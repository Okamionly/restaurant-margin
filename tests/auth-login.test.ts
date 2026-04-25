/**
 * @file tests/auth-login.test.ts
 * Tests POST /api/auth/login — JWT issuance, password mismatch, and the
 * timing-attack mitigation (CWE-208) that runs bcrypt.compare against a
 * dummy hash for unknown emails.
 */
import { describe, it, expect, vi, beforeAll, beforeEach } from 'vitest';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const TEST_SECRET = 'test-secret-32-chars-minimum-ok!';

beforeAll(() => {
  process.env['JWT_SECRET'] = TEST_SECRET;
});

const mockState = {
  user: null as null | {
    id: number;
    email: string;
    passwordHash: string;
    name: string;
    role: string;
    plan: string;
    trialEndsAt: Date | null;
  },
};

vi.mock('@prisma/client', () => {
  class PrismaClient {
    user = {
      findFirst: vi.fn(async () => mockState.user),
      count: vi.fn(async () => 1),
      findUnique: vi.fn(async () => null),
    };
    restaurantMember = {
      findFirst: vi.fn(async () => null),
    };
    auditLog = { create: vi.fn() };
  }
  return { PrismaClient, Prisma: {} };
});

vi.mock('resend', () => ({
  Resend: class {
    emails = { send: vi.fn() };
  },
}));

function makeReq(body: any): any {
  return { body, headers: {} };
}

function makeRes(): any {
  const res: any = {};
  res.status = vi.fn().mockReturnValue(res);
  res.json = vi.fn().mockReturnValue(res);
  res.cookie = vi.fn().mockReturnValue(res);
  res.clearCookie = vi.fn().mockReturnValue(res);
  return res;
}

async function callLogin(req: any, res: any) {
  const authRouter = (await import('../api-lib/routes/auth')).default;
  const layer = (authRouter as any).stack.find(
    (l: any) => l.route?.path === '/login' && l.route?.methods?.post
  );
  // Walk the full middleware stack: validateRequest -> handler.
  // Each layer.handle expects (req, res, next). Resolve next() chain manually.
  const stack = layer.route.stack;
  let i = 0;
  const runNext = async (): Promise<void> => {
    const fn = stack[i++]?.handle;
    if (!fn) return;
    await fn(req, res, runNext);
  };
  await runNext();
}

describe('POST /api/auth/login', () => {
  beforeEach(() => {
    mockState.user = null;
  });

  it('returns valid JWT on correct credentials', async () => {
    const passwordHash = await bcrypt.hash('CorrectPass1', 10);
    mockState.user = {
      id: 7,
      email: 'chef@bistro.fr',
      passwordHash,
      name: 'Chef',
      role: 'owner',
      plan: 'pro',
      trialEndsAt: null,
    };
    const req = makeReq({ email: 'chef@bistro.fr', password: 'CorrectPass1' });
    const res = makeRes();
    await callLogin(req, res);
    expect(res.json).toHaveBeenCalled();
    const payload = (res.json as any).mock.calls[0][0];
    expect(payload.token).toBeTypeOf('string');
    const decoded = jwt.verify(payload.token, TEST_SECRET) as any;
    expect(decoded.userId).toBe(7);
    expect(decoded.email).toBe('chef@bistro.fr');
  });

  it('returns 401 on wrong password', async () => {
    const passwordHash = await bcrypt.hash('CorrectPass1', 10);
    mockState.user = {
      id: 7,
      email: 'chef@bistro.fr',
      passwordHash,
      name: 'Chef',
      role: 'owner',
      plan: 'pro',
      trialEndsAt: null,
    };
    const req = makeReq({ email: 'chef@bistro.fr', password: 'WrongPass1' });
    const res = makeRes();
    await callLogin(req, res);
    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ error: 'Email ou mot de passe incorrect' });
  });

  it('returns 401 on unknown email (anti-enum: bcrypt always runs)', async () => {
    // Spy on bcrypt.compare to verify it is invoked even when user is null —
    // this is the timing-parity guarantee. We don't assert on wall-clock time
    // (too flaky in CI) but on the fact that bcrypt.compare is called against
    // the dummy hash for unknown emails.
    const compareSpy = vi.spyOn(bcrypt, 'compare');
    mockState.user = null; // no such user
    const req = makeReq({ email: 'ghost@nowhere.fr', password: 'AnyPass123' });
    const res = makeRes();
    await callLogin(req, res);
    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ error: 'Email ou mot de passe incorrect' });
    // CRITICAL: bcrypt.compare must be called even when user is null,
    // otherwise an attacker can enumerate users by response latency (CWE-208).
    expect(compareSpy).toHaveBeenCalledTimes(1);
    const [, hashArg] = compareSpy.mock.calls[0];
    // Second arg must be a real bcrypt hash ($2a$ or $2b$ prefix), not undefined
    expect(typeof hashArg).toBe('string');
    expect(hashArg).toMatch(/^\$2[ab]\$/);
    compareSpy.mockRestore();
  });
});
