import { Router } from 'express';
import crypto from 'crypto';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { Resend } from 'resend';
import { prisma, JWT_SECRET, TOKEN_EXPIRY, authMiddleware, JwtPayload } from '../middleware';
import { buildWelcomeEmail, buildVerifyEmail, buildResetPasswordEmail } from '../utils/emailTemplates';

const router = Router();

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
    if (password.length < 6) return res.status(400).json({ error: 'Min. 6 caractères' });
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
        trialEndsAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
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

    const token = jwt.sign({ userId: user.id, email: user.email, role: user.role }, JWT_SECRET!, { expiresIn: TOKEN_EXPIRY });
    res.status(201).json({ token, user: { id: user.id, email: user.email, name: user.name, role: user.role, plan: user.plan, trialEndsAt: user.trialEndsAt || null }, restaurantId: restaurant.id });
  } catch (e) { console.error(e); res.status(500).json({ error: "Erreur inscription" }); }
});

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ error: 'Email et mot de passe requis' });
    const user = await prisma.user.findFirst({ where: { email: { equals: email, mode: 'insensitive' } } });
    if (!user) return res.status(401).json({ error: 'Email ou mot de passe incorrect' });
    const valid = await bcrypt.compare(password, user.passwordHash);
    if (!valid) return res.status(401).json({ error: 'Email ou mot de passe incorrect' });
    const token = jwt.sign({ userId: user.id, email: user.email, role: user.role }, JWT_SECRET!, { expiresIn: TOKEN_EXPIRY });
    res.json({ token, user: { id: user.id, email: user.email, name: user.name, role: user.role, plan: (user as any).plan || 'pro', trialEndsAt: (user as any).trialEndsAt || null } });
  } catch (e) { console.error(e); res.status(500).json({ error: 'Erreur connexion' }); }
});

router.get('/me', authMiddleware, async (req: any, res) => {
  try {
    const user = await prisma.user.findUnique({ where: { id: req.user.userId }, select: { id: true, email: true, name: true, role: true, plan: true, trialEndsAt: true, createdAt: true } });
    if (!user) return res.status(404).json({ error: 'Non trouvé' });
    res.json(user);
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
      // Existing user → login
      const token = jwt.sign({ userId: user.id, email: user.email, role: user.role }, JWT_SECRET!, { expiresIn: TOKEN_EXPIRY });
      return res.redirect(`${frontendUrl}/login?token=${token}`);
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

    const token = jwt.sign({ userId: user.id, email: user.email, role: user.role }, JWT_SECRET!, { expiresIn: TOKEN_EXPIRY });
    return res.redirect(`${frontendUrl}/login?token=${token}`);
  } catch (e) {
    console.error('[GOOGLE OAUTH] Error:', e);
    return res.redirect(`${frontendUrl}/login?error=google_failed`);
  }
});

export default router;
