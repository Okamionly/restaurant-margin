/**
 * @file tests/auth.test.ts
 * Critical test: JWT authentication middleware (unit, no DB)
 */
import { describe, it, expect, beforeAll, vi } from 'vitest';
import jwt from 'jsonwebtoken';

const TEST_SECRET = 'test-secret-32-chars-minimum-ok!';

// Set env vars BEFORE any module import that reads them at module level
beforeAll(() => {
  process.env['JWT_SECRET'] = TEST_SECRET;
});

// Stub PrismaClient as a real class (not just a function)
vi.mock('@prisma/client', () => {
  class PrismaClient {
    restaurantMember = { findFirst: vi.fn() };
    auditLog = { create: vi.fn() };
  }
  return { PrismaClient };
});

function makeReq(token?: string): any {
  return {
    headers: {
      authorization: token ? `Bearer ${token}` : undefined,
    },
  };
}

function makeRes(): any {
  const res: any = {};
  res.status = vi.fn().mockReturnValue(res);
  res.json = vi.fn().mockReturnValue(res);
  return res;
}

describe('authMiddleware — JWT validation', () => {
  it('rejects request with no Authorization header', async () => {
    const { authMiddleware } = await import('../api-lib/middleware');
    const req = makeReq();
    const res = makeRes();
    const next = vi.fn();
    authMiddleware(req, res, next);
    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ error: 'Token requis' });
    expect(next).not.toHaveBeenCalled();
  });

  it('rejects request with invalid token', async () => {
    const { authMiddleware } = await import('../api-lib/middleware');
    const req = makeReq('invalid.token.here');
    const res = makeRes();
    const next = vi.fn();
    authMiddleware(req, res, next);
    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ error: 'Token invalide' });
    expect(next).not.toHaveBeenCalled();
  });

  it('rejects token signed with wrong secret', async () => {
    const { authMiddleware } = await import('../api-lib/middleware');
    const badToken = jwt.sign({ userId: 1, email: 'a@b.com', role: 'owner' }, 'wrong-secret');
    const req = makeReq(badToken);
    const res = makeRes();
    const next = vi.fn();
    authMiddleware(req, res, next);
    expect(res.status).toHaveBeenCalledWith(401);
    expect(next).not.toHaveBeenCalled();
  });

  it('accepts valid JWT and populates req.user', async () => {
    const { authMiddleware } = await import('../api-lib/middleware');
    const payload = { userId: 42, email: 'chef@restaurant.fr', role: 'owner' };
    const token = jwt.sign(payload, TEST_SECRET);
    const req = makeReq(token);
    const res = makeRes();
    const next = vi.fn();
    authMiddleware(req, res, next);
    expect(next).toHaveBeenCalledOnce();
    expect(req.user.userId).toBe(42);
    expect(req.user.email).toBe('chef@restaurant.fr');
    expect(res.status).not.toHaveBeenCalled();
  });

  it('rejects expired JWT', async () => {
    const { authMiddleware } = await import('../api-lib/middleware');
    // Sign with negative expiry to get an already-expired token
    const token = jwt.sign({ userId: 1, email: 'x@x.com', role: 'owner' }, TEST_SECRET, { expiresIn: -1 });
    const req = makeReq(token);
    const res = makeRes();
    const next = vi.fn();
    authMiddleware(req, res, next);
    expect(res.status).toHaveBeenCalledWith(401);
    expect(next).not.toHaveBeenCalled();
  });
});
