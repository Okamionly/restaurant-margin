import jwt from 'jsonwebtoken';
import { prisma } from './prisma';
import { isJtiRevoked } from './jti-blocklist';

const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) throw new Error('JWT_SECRET env variable required');

export const TOKEN_EXPIRY = '7d';
export const AUTH_COOKIE_NAME = 'auth_token';

export interface JwtPayload {
  userId: number;
  email: string;
  role: string;
  jti?: string; // present on tokens issued from 2026-04-25 onward
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

export { prisma, JWT_SECRET };
