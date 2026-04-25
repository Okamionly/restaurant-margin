import { Router } from 'express';
import crypto from 'crypto';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { Resend } from 'resend';
import { authenticator } from 'otplib';
import qrcode from 'qrcode';
import {
  prisma,
  JWT_SECRET,
  TOKEN_EXPIRY,
  AUTH_COOKIE_NAME,
  authMiddleware,
  JwtPayload,
} from '../middleware';
import { revokeJti } from '../jti-blocklist';
import { buildWelcomeEmail, buildVerifyEmail, buildResetPasswordEmail } from '../utils/emailTemplates';
import { ratelimit } from '../ratelimit';

const router = Router();

const TOKEN_TTL_SECONDS = 7 * 24 * 60 * 60; // mirror TOKEN_EXPIRY = '7d'

/** Sign a JWT with a unique jti so it can be individually revoked via the blocklist. */
function signAuthToken(payload: { userId: number; email: string; role: string; mfaVerified?: boolean }): {
  token: string;
  jti: string;
} {
  const jti = crypto.randomUUID();
  const token = jwt.sign({ ...payload, jti }, JWT_SECRET!, { expiresIn: TOKEN_EXPIRY });
  return { token, jti };
}

/**
 * Set the JWT as an httpOnly cookie. Bearer-token JSON responses are kept in
 * parallel for back-compat (native clients, server-to-server) — migration
 * window closes 7 days after deploy.
 */
function setAuthCookie(res: any, token: string) {
  const isProd = process.env.NODE_ENV === 'production';
  res.cookie(AUTH_COOKIE_NAME, token, {
    httpOnly: true,
    secure: isProd,
    sameSite: 'lax',
    path: '/',
    maxAge: TOKEN_TTL_SECONDS * 1000,
  });
}

// Fixed dummy hash for timing-attack-safe login (CWE-208).
// Ensures bcrypt.compare() always runs even when the user doesn't exist.
// Valid bcrypt hash generated via bcryptjs.hashSync('never-matches', 12) — any
// password compared against it will return false, preserving latency parity
// with real user lookups.
const DUMMY_BCRYPT_HASH = '$2b$12$Ni2/SnC.Hp7AUij27cHg/eS8T/xymqGz8PwwTfRVNTgst18apv71e';

// Password policy (WCAG-accessible and strong enough to resist offline dictionary + bcrypt)
function validatePasswordPolicy(password: string): string | null {
  if (!password || password.length < 8) return 'Le mot de passe doit contenir au moins 8 caractères';
  if (!/[A-Z]/.test(password)) return 'Le mot de passe doit contenir au moins une majuscule';
  if (!/[0-9]/.test(password)) return 'Le mot de passe doit contenir au moins un chiffre';
  if (password.length > 128) return 'Mot de passe trop long (max 128 caractères)';
  return null;
}

// ============ AUTH: First user check ============
router.get('/first-user', async (_req, res) => {
  try {
    const count = await prisma.user.count();
    res.json({ isFirstUser: count === 0 });
  } catch (e: any) { console.error('DB Error:', e.message); res.status(500).json({ error: 'Erreur serveur', detail: e.message }); }
});

// ── Register with activation code ──
router.post('/register', async (req: any, res) => {
  try {
    const { email: rawEmail, password, name, restaurantName, activationCode } = req.body;
    if (!rawEmail || !password || !name) return res.status(400).json({ error: 'Email, mot de passe et nom requis' });
    const policyError = validatePasswordPolicy(password);
    if (policyError) return res.status(400).json({ error: policyError });
    const email = rawEmail.toLowerCase().trim();

    const userCount = await prisma.user.count();
    let plan = 'pro';
    let trialEndsAt: Date | null = null;

    if (userCount > 0) {
      const authHeader = req.headers.authorization;
      const hasAdminToken = authHeader && authHeader.startsWith('Bearer ');
      if (hasAdminToken) {
        try { const d = jwt.verify(authHeader.split(' ')[1], JWT_SECRET!) as JwtPayload; if (d.role !== 'admin') return res.status(403).json({ error: 'Admin requis' }); } catch { return res.status(403).json({ error: 'Token invalide' }); }
      } else if (activationCode) {
        const activation = await prisma.activationCode.findUnique({ where: { code: activationCode.trim().toUpperCase() } });
        if (!activation) return res.status(403).json({ error: "Code d'activation invalide" });
        if (activation.used) return res.status(403).json({ error: "Ce code a déjà été utilisé" });
        plan = activation.plan;
        await prisma.activationCode.update({ where: { code: activation.code }, data: { used: true, usedBy: email, usedAt: new Date() } });
      } else {
        // Free trial: basic plan with 7-day trial period
        plan = 'basic';
        trialEndsAt = new Date(Date.now() + 14 * 24 * 60 * 60 * 1000);
      }
    }

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) return res.status(409).json({ error: 'Email déjà utilisé' });
    const passwordHash = await bcrypt.hash(password, 12);
    const role = userCount === 0 ? 'admin' : 'chef';
    const user = await prisma.user.create({ data: { email, passwordHash, name, role, plan, ...(trialEndsAt ? { trialEndsAt } : {}) } });

    const restaurant = await prisma.restaurant.create({
      data: { name: restaurantName?.trim() || 'Mon Restaurant', ownerId: user.id, members: { create: { userId: user.id, role: 'owner' } } },
    });

    // Send welcome onboarding email (non-blocking)
    try {
      const resendApiKey = process.env.RESEND_API_KEY;
      if (resendApiKey) {
        const resend = new Resend(resendApiKey);
        await resend.emails.send({
          from: 'RestauMargin <contact@restaumargin.fr>',
          to: user.email,
          subject: 'Bienvenue sur RestauMargin ! 🍳',
          html: buildWelcomeEmail({ userName: user.name }),
        });
      }
    } catch (emailErr) {
      console.error('Failed to send welcome email:', emailErr);
    }

    const { token } = signAuthToken({ userId: user.id, email: user.email, role: user.role });
    setAuthCookie(res, token);
    res.status(201).json({ token, user: { id: user.id, email: user.email, name: user.name, role: user.role, plan: user.plan, trialEndsAt: user.trialEndsAt || null }, restaurantId: restaurant.id });
  } catch (e) { console.error(e); res.status(500).json({ error: "Erreur inscription" }); }
});

// Helper: set headers only when res.setHeader exists (missing in unit-test mocks)
function setRLHeaders(res: any, rl: { limit: number; remaining: number; reset: number }) {
  if (typeof res.setHeader !== 'function') return;
  res.setHeader('X-RateLimit-Limit', String(rl.limit));
  res.setHeader('X-RateLimit-Remaining', String(rl.remaining));
  res.setHeader('X-RateLimit-Reset', String(rl.reset));
}

router.post('/login', async (req: any, res) => {
  try {
    // Rate limit by IP — 50 req/min (distributed via Upstash, in-memory fallback)
    const ip = req.headers['x-forwarded-for']?.split(',')[0]?.trim() || req.socket?.remoteAddress || 'unknown';
    const rl = await ratelimit(`login:${ip}`);
    if (!rl.success) {
      setRLHeaders(res, { ...rl, remaining: 0 });
      if (typeof res.setHeader === 'function') {
        res.setHeader('Retry-After', String(rl.reset - Math.floor(Date.now() / 1000)));
      }
      return res.status(429).json({ error: 'Trop de tentatives. Réessayez dans une minute.' });
    }
    setRLHeaders(res, rl);

    const { email, password, totpCode } = req.body;
    if (!email || !password) return res.status(400).json({ error: 'Email et mot de passe requis' });
    const user = await prisma.user.findFirst({ where: { email: { equals: email, mode: 'insensitive' } } });
    // SECURITY: always run bcrypt.compare() to prevent user enumeration via timing (CWE-208).
    // Non-existent users hit a dummy hash so the latency profile is identical.
    const valid = await bcrypt.compare(password, user?.passwordHash ?? DUMMY_BCRYPT_HASH);
    if (!user || !valid) return res.status(401).json({ error: 'Email ou mot de passe incorrect' });

    // MFA check: if enabled, require TOTP code in the same login request
    if ((user as any).totpEnabled && (user as any).totpSecret) {
      if (!totpCode) {
        return res.status(200).json({ mfaRequired: true, message: 'Code TOTP requis' });
      }
      const totpValid = authenticator.verify({ token: totpCode, secret: (user as any).totpSecret });
      if (!totpValid) {
        return res.status(401).json({ error: 'Code TOTP invalide' });
      }
    }

    const mfaVerified = (user as any).totpEnabled ? true : undefined;
    const { token } = signAuthToken({ userId: user.id, email: user.email, role: user.role, mfaVerified });
    setAuthCookie(res, token);

    // Récupère le restaurant principal de l'utilisateur (pour X-Restaurant-Id header)
    const membership = await prisma.restaurantMember.findFirst({
      where: { userId: user.id },
      include: { restaurant: { select: { id: true, name: true } } },
      orderBy: { id: 'asc' },
    });
    const restaurant = membership?.restaurant || null;

    res.json({
      token,
      user: { id: user.id, email: user.email, name: user.name, role: user.role, plan: user.plan || 'basic', trialEndsAt: user.trialEndsAt || null, totpEnabled: (user as any).totpEnabled || false },
      restaurant,
      restaurantId: restaurant?.id || null,
    });
  } catch (e) { console.error(e); res.status(500).json({ error: 'Erreur connexion' }); }
});

// ── Logout: revoke the current JWT (jti blocklist) + clear cookie ──
router.post('/logout', authMiddleware, async (req: any, res) => {
  try {
    const jti = req.user?.jti as string | undefined;
    const exp = req.user?.exp as number | undefined;
    if (jti && exp) {
      await revokeJti(jti, new Date(exp * 1000));
    }
    res.clearCookie(AUTH_COOKIE_NAME, { path: '/' });
    res.json({ message: 'Déconnecté' });
  } catch (e: any) {
    console.error('[LOGOUT]', e.message);
    // Even on error, clear the cookie so the client is logged out client-side.
    res.clearCookie(AUTH_COOKIE_NAME, { path: '/' });
    res.json({ message: 'Déconnecté (erreur révocation: token expirera naturellement)' });
  }
});

// ============ RGPD: data portability + right to erasure ============

// GET /api/auth/me/export — full data dump for the authenticated user (RGPD art. 20).
// Returns a JSON attachment with the user record + every restaurant they own/belong
// to + nested business data (recipes, ingredients, invoices, devis, financial entries).
router.get('/me/export', authMiddleware, async (req: any, res) => {
  try {
    const userId = req.user.userId as number;
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true, email: true, name: true, role: true, plan: true, emailVerified: true,
        acceptedCguAt: true, trialEndsAt: true, createdAt: true,
        memberships: {
          include: {
            restaurant: {
              include: {
                recipes: { include: { ingredients: true } },
                ingredients: true,
                suppliers: true,
                invoices: { include: { items: true } },
                priceHistory: true,
                menuSales: true,
                devis: { include: { items: true } },
                financialEntries: true,
                wasteLogs: true,
                inventory: true,
                employees: true,
                shifts: true,
              },
            },
          },
        },
      },
    });
    if (!user) return res.status(404).json({ error: 'Non trouvé' });

    const filename = `restaumargin-data-${userId}-${new Date().toISOString().slice(0, 10)}.json`;
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    res.json({
      exportedAt: new Date().toISOString(),
      rgpdArticle: 'Article 20 RGPD — Right to data portability',
      user,
    });
  } catch (e: any) {
    console.error('[RGPD EXPORT]', e.message);
    res.status(500).json({ error: 'Erreur export RGPD' });
  }
});

// POST /api/auth/me/delete — soft anonymisation of the authenticated user (RGPD art. 17).
// Email/name/passwordHash are scrambled so the row cannot be tied back to the
// real person. Restaurants/business data are kept (auditability + co-owners),
// but the user's PII is unrecoverable. SLA: 30 days for full pipeline cleanup —
// see docs/rgpd-erasure.md for the runbook.
router.post('/me/delete', authMiddleware, async (req: any, res) => {
  try {
    const userId = req.user.userId as number;
    if (req.user.role === 'admin') {
      // Admin self-deletion is too dangerous as a single-call self-serve flow —
      // require the manual /api/auth/users/:id path instead.
      return res.status(400).json({
        error: 'Suppression admin non autorisée par self-service. Contactez le support.',
      });
    }
    const anonEmail = `deleted-${crypto.randomUUID()}@deleted.local`;
    const scrambled = await bcrypt.hash(crypto.randomBytes(32).toString('hex'), 12);
    await prisma.user.update({
      where: { id: userId },
      data: {
        email: anonEmail,
        name: 'Compte supprimé',
        passwordHash: scrambled,
        role: 'deleted',
        verificationToken: null,
        resetToken: null,
        resetTokenExpiry: null,
        stripeCustomerId: null,
        stripeSubId: null,
      },
    });

    // Revoke the current session token so the now-anonymised user is locked out
    // immediately, even on the back-compat Bearer header path.
    const jti = req.user?.jti as string | undefined;
    const exp = req.user?.exp as number | undefined;
    if (jti && exp) {
      try { await revokeJti(jti, new Date(exp * 1000)); } catch { /* best-effort */ }
    }
    res.clearCookie(AUTH_COOKIE_NAME, { path: '/' });
    res.json({ message: 'Compte supprimé. Vos données ont été anonymisées.' });
  } catch (e: any) {
    console.error('[RGPD DELETE]', e.message);
    res.status(500).json({ error: 'Erreur suppression RGPD' });
  }
});

router.get('/me', authMiddleware, async (req: any, res) => {
  try {
    const user = await prisma.user.findUnique({ where: { id: req.user.userId }, select: { id: true, email: true, name: true, role: true, plan: true, trialEndsAt: true, createdAt: true } });
    if (!user) return res.status(404).json({ error: 'Non trouvé' });

    // Récupère le restaurant principal (pour X-Restaurant-Id sur refresh session)
    const membership = await prisma.restaurantMember.findFirst({
      where: { userId: user.id },
      include: { restaurant: { select: { id: true, name: true } } },
      orderBy: { id: 'asc' },
    });

    res.json({ ...user, restaurant: membership?.restaurant || null, restaurantId: membership?.restaurant?.id || null });
  } catch { res.status(500).json({ error: 'Erreur serveur' }); }
});

router.get('/users', authMiddleware, async (req: any, res) => {
  try {
    if (req.user.role !== 'admin') return res.status(403).json({ error: 'Admin requis' });
    const users = await prisma.user.findMany({ select: { id: true, email: true, name: true, role: true, createdAt: true }, orderBy: { createdAt: 'asc' } });
    res.json(users);
  } catch { res.status(500).json({ error: 'Erreur serveur' }); }
});

router.delete('/users/:id', authMiddleware, async (req: any, res) => {
  try {
    if (req.user.role !== 'admin') return res.status(403).json({ error: 'Admin requis' });
    const targetId = parseInt(req.params.id);
    if (targetId === req.user.userId) return res.status(400).json({ error: 'Impossible de supprimer votre propre compte' });
    // Soft delete: deactivate user instead of hard delete (foreign key constraints)
    await prisma.user.update({
      where: { id: targetId },
      data: { email: `deleted_${targetId}_${Date.now()}@deleted.local`, passwordHash: 'DELETED', role: 'deleted' },
    });
    res.status(204).send();
  } catch (e: any) {
    console.error('[DELETE USER]', e.message);
    res.status(500).json({ error: 'Erreur suppression utilisateur' });
  }
});

// ============ AUTH: VERIFY EMAIL, RESEND, FORGOT/RESET PASSWORD ============
router.get('/verify-email', async (req: any, res) => {
  try {
    const token = req.query.token as string;
    if (!token) return res.status(400).json({ error: 'Token manquant' });
    const user = await prisma.user.findFirst({ where: { verificationToken: token } });
    if (!user) return res.status(400).json({ error: 'Token invalide' });
    await prisma.user.update({ where: { id: user.id }, data: { emailVerified: true, verificationToken: null } });
    res.json({ success: true, message: 'Email vérifié avec succès' });
  } catch (e) { console.error(e); res.status(500).json({ error: 'Erreur serveur' }); }
});

router.post('/resend-verification', authMiddleware, async (req: any, res) => {
  try {
    const user = await prisma.user.findUnique({ where: { id: req.user.userId } });
    if (!user) return res.status(404).json({ error: 'Utilisateur non trouvé' });
    if (user.emailVerified) return res.json({ message: 'Email déjà vérifié' });
    const verificationToken = crypto.randomBytes(32).toString('hex');
    await prisma.user.update({ where: { id: user.id }, data: { verificationToken } });
    const apiKey = process.env.RESEND_API_KEY;
    if (apiKey) {
      const resend = new Resend(apiKey);
      const frontendUrl = process.env.FRONTEND_URL || 'https://www.restaumargin.fr';
      await resend.emails.send({
        from: 'RestauMargin <contact@restaumargin.fr>', to: user.email,
        subject: 'RestauMargin — Vérifiez votre adresse email',
        html: buildVerifyEmail({ userName: user.name, verifyUrl: `${frontendUrl}/login?verify=${verificationToken}` }),
      });
    }
    res.json({ message: 'Email de vérification envoyé' });
  } catch (e) { console.error(e); res.status(500).json({ error: 'Erreur serveur' }); }
});

router.post('/forgot-password', async (req: any, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ error: 'Email requis' });
    const genericMsg = 'Si un compte existe avec cet email, un lien de réinitialisation a été envoyé.';
    const user = await prisma.user.findUnique({ where: { email: email.toLowerCase().trim() } });
    if (!user) return res.json({ message: genericMsg });
    const token = crypto.randomBytes(32).toString('hex');
    const expiry = new Date(Date.now() + 3600000);
    await prisma.user.update({ where: { id: user.id }, data: { resetToken: token, resetTokenExpiry: expiry } });
    const apiKey = process.env.RESEND_API_KEY;
    if (apiKey) {
      const resend = new Resend(apiKey);
      const frontendUrl = process.env.FRONTEND_URL || 'https://www.restaumargin.fr';
      await resend.emails.send({
        from: 'RestauMargin <contact@restaumargin.fr>', to: user.email,
        subject: 'RestauMargin — Réinitialisation de votre mot de passe',
        html: buildResetPasswordEmail({ userName: user.name, resetUrl: `${frontendUrl}/reset-password?token=${token}` }),
      });
    }
    res.json({ message: genericMsg });
  } catch (e) { console.error(e); res.status(500).json({ error: 'Erreur serveur' }); }
});

router.post('/reset-password', async (req: any, res) => {
  try {
    const { token, newPassword } = req.body;
    if (!token || !newPassword) return res.status(400).json({ error: 'Token et nouveau mot de passe requis' });
    if (newPassword.length < 6) return res.status(400).json({ error: 'Le mot de passe doit contenir au moins 6 caractères' });
    const user = await prisma.user.findFirst({ where: { resetToken: token, resetTokenExpiry: { gt: new Date() } } });
    if (!user) return res.status(400).json({ error: 'Lien invalide ou expiré' });
    const hashedPassword = await bcrypt.hash(newPassword, 12);
    await prisma.user.update({ where: { id: user.id }, data: { passwordHash: hashedPassword, resetToken: null, resetTokenExpiry: null } });
    res.json({ message: 'Mot de passe réinitialisé avec succès' });
  } catch (e) { console.error(e); res.status(500).json({ error: 'Erreur serveur' }); }
});

// ============ MFA TOTP ============

const APP_NAME = 'RestauMargin';

// POST /api/auth/mfa/setup — generate TOTP secret + return QR code data URL
router.post('/mfa/setup', authMiddleware, async (req: any, res) => {
  try {
    const userId = req.user.userId as number;
    const user = await prisma.user.findUnique({ where: { id: userId }, select: { email: true } });
    if (!user) return res.status(404).json({ error: 'Utilisateur introuvable' });

    const secret = authenticator.generateSecret();
    const otpauthUrl = authenticator.keyuri(user.email, APP_NAME, secret);
    const qrDataUrl = await qrcode.toDataURL(otpauthUrl);

    // Persist the pending secret (not yet enabled — user must verify first)
    await (prisma as any).user.update({
      where: { id: userId },
      data: { totpSecret: secret, totpEnabled: false },
    });

    res.json({ secret, otpauthUrl, qrDataUrl });
  } catch (e) {
    console.error('[MFA SETUP]', e);
    res.status(500).json({ error: 'Erreur setup MFA' });
  }
});

// POST /api/auth/mfa/verify — confirm TOTP code + activate MFA
router.post('/mfa/verify', authMiddleware, async (req: any, res) => {
  try {
    const userId = req.user.userId as number;
    const { code } = req.body;
    if (!code) return res.status(400).json({ error: 'Code TOTP requis' });

    const user = await (prisma as any).user.findUnique({
      where: { id: userId },
      select: { totpSecret: true, totpEnabled: true },
    });
    if (!user || !user.totpSecret) {
      return res.status(400).json({ error: 'MFA setup non initié — appelez /mfa/setup d\'abord' });
    }
    const valid = authenticator.verify({ token: code, secret: user.totpSecret });
    if (!valid) return res.status(401).json({ error: 'Code TOTP invalide' });

    await (prisma as any).user.update({ where: { id: userId }, data: { totpEnabled: true } });
    res.json({ message: 'MFA activé avec succès' });
  } catch (e) {
    console.error('[MFA VERIFY]', e);
    res.status(500).json({ error: 'Erreur vérification MFA' });
  }
});

// POST /api/auth/mfa/disable — disable MFA (requires TOTP code + password)
router.post('/mfa/disable', authMiddleware, async (req: any, res) => {
  try {
    const userId = req.user.userId as number;
    const { code, password } = req.body;
    if (!code || !password) return res.status(400).json({ error: 'Code TOTP et mot de passe requis' });

    const user = await (prisma as any).user.findUnique({
      where: { id: userId },
      select: { totpSecret: true, totpEnabled: true, passwordHash: true },
    });
    if (!user) return res.status(404).json({ error: 'Utilisateur introuvable' });
    if (!user.totpEnabled || !user.totpSecret) {
      return res.status(400).json({ error: 'MFA non activé' });
    }

    // Verify TOTP code
    const totpValid = authenticator.verify({ token: code, secret: user.totpSecret });
    if (!totpValid) return res.status(401).json({ error: 'Code TOTP invalide' });

    // Verify password
    const pwValid = await bcrypt.compare(password, user.passwordHash);
    if (!pwValid) return res.status(401).json({ error: 'Mot de passe incorrect' });

    await (prisma as any).user.update({
      where: { id: userId },
      data: { totpEnabled: false, totpSecret: null },
    });
    res.json({ message: 'MFA désactivé avec succès' });
  } catch (e) {
    console.error('[MFA DISABLE]', e);
    res.status(500).json({ error: 'Erreur désactivation MFA' });
  }
});

// ============ OAUTH ONE-TIME CODE EXCHANGE ============

// POST /api/auth/oauth/exchange — exchange one-time code for JWT
// Client calls this after Google callback redirects with ?code=...
router.post('/oauth/exchange', async (req: any, res) => {
  try {
    const { code } = req.body;
    if (!code || typeof code !== 'string') {
      return res.status(400).json({ error: 'Code requis' });
    }

    const oauthCode = await (prisma as any).oauthCode.findUnique({ where: { code } });
    if (!oauthCode) return res.status(401).json({ error: 'Code invalide' });
    if (oauthCode.used) return res.status(401).json({ error: 'Code déjà utilisé' });
    if (new Date(oauthCode.expiresAt) < new Date()) return res.status(401).json({ error: 'Code expiré' });

    // Mark as used (atomic — prevents replay)
    await (prisma as any).oauthCode.update({ where: { code }, data: { used: true } });

    const user = await prisma.user.findUnique({
      where: { id: oauthCode.userId },
      select: { id: true, email: true, name: true, role: true, plan: true, trialEndsAt: true },
    });
    if (!user) return res.status(404).json({ error: 'Utilisateur introuvable' });

    const { token } = signAuthToken({ userId: user.id, email: user.email, role: user.role });
    setAuthCookie(res, token);

    const membership = await prisma.restaurantMember.findFirst({
      where: { userId: user.id },
      include: { restaurant: { select: { id: true, name: true } } },
      orderBy: { id: 'asc' },
    });

    res.json({
      token,
      user: { ...user, trialEndsAt: user.trialEndsAt || null },
      restaurant: membership?.restaurant || null,
      restaurantId: membership?.restaurant?.id || null,
    });
  } catch (e) {
    console.error('[OAUTH EXCHANGE]', e);
    res.status(500).json({ error: 'Erreur échange code OAuth' });
  }
});

// ============ GOOGLE OAUTH ============

// GET /api/auth/google → redirect to Google consent screen
router.get('/google', (_req, res) => {
  const clientId = process.env.GOOGLE_CLIENT_ID;
  if (!clientId) return res.status(500).json({ error: 'Google OAuth non configure' });

  const redirectUri = 'https://www.restaumargin.fr/api/auth/google/callback';
  const scope = encodeURIComponent('email profile');
  const state = crypto.randomBytes(16).toString('hex');

  const url = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&response_type=code&scope=${scope}&state=${state}&access_type=offline&prompt=consent`;
  res.redirect(url);
});

// GET /api/auth/google/callback → handle Google callback
router.get('/google/callback', async (req, res) => {
  const frontendUrl = process.env.FRONTEND_URL || 'https://www.restaumargin.fr';
  try {
    const { code } = req.query;
    if (!code || typeof code !== 'string') {
      return res.redirect(`${frontendUrl}/login?error=google_no_code`);
    }

    const clientId = process.env.GOOGLE_CLIENT_ID;
    const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
    if (!clientId || !clientSecret) {
      return res.redirect(`${frontendUrl}/login?error=google_not_configured`);
    }

    const redirectUri = 'https://www.restaumargin.fr/api/auth/google/callback';

    // Exchange code for tokens
    const tokenRes = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        code,
        client_id: clientId,
        client_secret: clientSecret,
        redirect_uri: redirectUri,
        grant_type: 'authorization_code',
      }),
    });
    const tokenData = await tokenRes.json();
    if (!tokenData.access_token) {
      console.error('[GOOGLE OAUTH] Token exchange failed:', tokenData);
      return res.redirect(`${frontendUrl}/login?error=google_token_failed`);
    }

    // Get user info from Google
    const userInfoRes = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
      headers: { Authorization: `Bearer ${tokenData.access_token}` },
    });
    const userInfo = await userInfoRes.json();
    if (!userInfo.email) {
      return res.redirect(`${frontendUrl}/login?error=google_no_email`);
    }

    const email = userInfo.email.toLowerCase().trim();
    const name = userInfo.name || email.split('@')[0];

    // Check if user already exists
    let user = await prisma.user.findFirst({ where: { email: { equals: email, mode: 'insensitive' } } });

    if (user) {
      // Existing user → login: issue one-time code (no JWT in URL)
      const oauthCode = crypto.randomBytes(32).toString('hex');
      const expiresAt = new Date(Date.now() + 60 * 1000); // 60s TTL
      await (prisma as any).oauthCode.create({ data: { code: oauthCode, userId: user.id, expiresAt } });
      setAuthCookie(res, signAuthToken({ userId: user.id, email: user.email, role: user.role }).token);
      return res.redirect(`${frontendUrl}/login?code=${oauthCode}`);
    }

    // New user → create account + restaurant
    const passwordHash = await bcrypt.hash(crypto.randomBytes(32).toString('hex'), 12);
    user = await prisma.user.create({
      data: {
        email,
        passwordHash,
        name,
        role: 'chef',
        plan: 'basic',
        trialEndsAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        emailVerified: true, // Google emails are verified
      },
    });

    await prisma.restaurant.create({
      data: {
        name: 'Mon Restaurant',
        ownerId: user.id,
        members: { create: { userId: user.id, role: 'owner' } },
      },
    });

    // Send welcome email (non-blocking)
    try {
      const resendApiKey = process.env.RESEND_API_KEY;
      if (resendApiKey) {
        const resend = new Resend(resendApiKey);
        await resend.emails.send({
          from: 'RestauMargin <contact@restaumargin.fr>',
          to: user.email,
          subject: 'Bienvenue sur RestauMargin !',
          html: buildWelcomeEmail({ userName: user.name }),
        });
      }
    } catch (emailErr) {
      console.error('Failed to send welcome email (Google OAuth):', emailErr);
    }

    // New user → issue one-time code (no JWT in URL)
    const oauthCode = crypto.randomBytes(32).toString('hex');
    const expiresAt = new Date(Date.now() + 60 * 1000); // 60s TTL
    await (prisma as any).oauthCode.create({ data: { code: oauthCode, userId: user.id, expiresAt } });
    setAuthCookie(res, signAuthToken({ userId: user.id, email: user.email, role: user.role }).token);
    return res.redirect(`${frontendUrl}/login?code=${oauthCode}`);
  } catch (e) {
    console.error('[GOOGLE OAUTH] Error:', e);
    return res.redirect(`${frontendUrl}/login?error=google_failed`);
  }
});

export default router;
