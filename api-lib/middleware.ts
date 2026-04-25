import jwt from 'jsonwebtoken';
import { prisma } from './prisma';
import { isJtiRevoked } from './jti-blocklist';
import { z, ZodTypeAny } from 'zod';

const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) throw new Error('JWT_SECRET env variable required');

export const TOKEN_EXPIRY = '7d';
export const AUTH_COOKIE_NAME = 'auth_token';

export interface JwtPayload {
  userId: number;
  email: string;
  role: string;
  jti?: string; // present on tokens issued from 2026-04-25 onward
  mfaVerified?: boolean; // true when user completed TOTP challenge this session
  exp?: number;
  iat?: number;
}

/**
 * Pull a JWT off the request: cookie first (preferred, httpOnly), Authorization
 * header second (back-compat for native clients and pre-cookie sessions).
 */
function extractToken(req: any): string | null {
  const cookieToken = req.cookies?.[AUTH_COOKIE_NAME];
  if (cookieToken && typeof cookieToken === 'string') return cookieToken;
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) return authHeader.split(' ')[1];
  return null;
}

export async function authMiddleware(req: any, res: any, next: any) {
  const token = extractToken(req);
  if (!token) return res.status(401).json({ error: 'Token requis' });
  let decoded: JwtPayload;
  try {
    decoded = jwt.verify(token, JWT_SECRET!) as JwtPayload;
  } catch {
    return res.status(401).json({ error: 'Token invalide' });
  }
  if (await isJtiRevoked(decoded.jti)) {
    return res.status(401).json({ error: 'Token révoqué' });
  }
  req.user = decoded;
  next();
}

export async function authWithRestaurant(req: any, res: any, next: any) {
  const token = extractToken(req);
  if (!token) return res.status(401).json({ error: 'Token requis' });
  let decoded: JwtPayload;
  try {
    decoded = jwt.verify(token, JWT_SECRET!) as JwtPayload;
  } catch {
    return res.status(401).json({ error: 'Token invalide' });
  }
  if (await isJtiRevoked(decoded.jti)) {
    return res.status(401).json({ error: 'Token révoqué' });
  }
  req.user = decoded;
  const restaurantHeader = req.headers['x-restaurant-id'];
  if (!restaurantHeader) {
    return res.status(400).json({ error: 'X-Restaurant-Id header requis' });
  }
  const restaurantId = parseInt(String(restaurantHeader), 10);
  if (isNaN(restaurantId)) {
    return res.status(400).json({ error: 'X-Restaurant-Id invalide' });
  }
  try {
    const member = await prisma.restaurantMember.findFirst({
      where: { userId: req.user.userId, restaurantId },
    });
    if (!member) {
      return res.status(403).json({ error: 'Accès refusé à ce restaurant' });
    }
    req.restaurantId = restaurantId;
    next();
  } catch {
    return res.status(500).json({ error: 'Erreur vérification restaurant' });
  }
}

// ── Input Sanitization (XSS protection) ──
export function sanitizeInput(str: string): string {
  return str.replace(/[<>]/g, '').replace(/&/g, '&amp;').trim();
}

// ── Numeric Validation Helpers ──
export function validatePrice(val: any, fieldName: string): { valid: boolean; value?: number; error?: string } {
  const n = parseFloat(val);
  if (isNaN(n) || !isFinite(n)) return { valid: false, error: `${fieldName}: nombre invalide` };
  if (n < 0) return { valid: false, error: `${fieldName}: doit être positif` };
  if (n > 999999) return { valid: false, error: `${fieldName}: valeur trop élevée` };
  return { valid: true, value: Math.round(n * 100) / 100 };
}

export function validatePositiveNumber(val: any, fieldName: string): { valid: boolean; value?: number; error?: string } {
  const n = parseFloat(val);
  if (isNaN(n) || !isFinite(n)) return { valid: false, error: `${fieldName}: nombre invalide` };
  if (n < 0) return { valid: false, error: `${fieldName}: doit être positif` };
  if (n > 999999) return { valid: false, error: `${fieldName}: valeur trop élevée` };
  return { valid: true, value: n };
}

// ── Audit Trail Helper ──
export async function logAudit(
  userId: number,
  restaurantId: number,
  action: string,
  entityType: string,
  entityId: number,
  changes?: any
) {
  try {
    await prisma.auditLog.create({
      data: { userId, restaurantId, action, entityType, entityId, changes },
    });
  } catch {
    /* silent fail — audit should never break main flow */
  }
}

// ── Zod Request Validation Middleware (Wave 3 QA) ─────────────────────────────
/**
 * Express middleware factory that validates req.body against a Zod schema.
 * Returns HTTP 400 with structured { error, issues } if validation fails.
 * On success, replaces req.body with the parsed (coerced) value.
 *
 * Usage:
 *   router.post('/login', validateRequest(loginRequestSchema), handler)
 */
export function validateRequest<T extends ZodTypeAny>(schema: T) {
  return async (req: any, res: any, next: any) => {
    const result = schema.safeParse(req.body);
    if (!result.success) {
      return res.status(400).json({
        error: 'Validation échouée',
        issues: result.error.issues.map((i) => ({
          path: i.path.join('.'),
          message: i.message,
        })),
      });
    }
    req.body = result.data;
    // Await next so handler chain (incl. async handlers in tests) completes
    // before the caller's await resolves. Express runtime is fine with async.
    await next();
  };
}

/**
 * requireMFA — enforces that the JWT claim mfaVerified=true is present.
 * Mount AFTER authMiddleware on routes that need TOTP second-factor.
 * If the user has not enabled MFA the check is skipped (grace mode for
 * non-enrolled users). If MFA is enabled on the account and the claim is
 * missing/false, return 403 so the client can redirect to the TOTP prompt.
 */
export async function requireMFA(req: any, res: any, next: any) {
  const decoded: JwtPayload = req.user;
  // No req.user means this route uses a different auth mechanism (e.g. ACTIVATION_SECRET).
  // requireMFA is a JWT-layer decorator — skip silently when there's no JWT user.
  if (!decoded) return next();

  try {
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: { totpEnabled: true },
    });
    // If user does not have MFA enabled, skip the check — they are not
    // yet enrolled. Admins should be nudged to enroll via the onboarding UI.
    if (!user || !user.totpEnabled) {
      return next();
    }
    if (!decoded.mfaVerified) {
      return res.status(403).json({ error: 'MFA requis — vérifiez votre code TOTP', code: 'MFA_REQUIRED' });
    }
    next();
  } catch {
    return res.status(500).json({ error: 'Erreur vérification MFA' });
  }
}

/**
 * setGUC — sets the PostgreSQL GUC app.current_user_id to the authenticated
 * user's id within the current transaction/request context.
 * Required by RLS Phase 2 strict policies (see migration 20260425_3020_rls_strict).
 * Call this AFTER authMiddleware, once per request.
 */
export async function setGUC(req: any, _res: any, next: any) {
  const decoded: JwtPayload = req.user;
  if (decoded?.userId) {
    try {
      await prisma.$executeRawUnsafe(
        `SELECT set_config('app.current_user_id', $1, true)`,
        String(decoded.userId)
      );
    } catch {
      // Non-fatal: if the DB doesn't support the GUC (e.g. legacy migration not run),
      // we continue. The membership check in authWithRestaurant is the primary gate.
    }
  }
  next();
}

export { prisma, JWT_SECRET };
