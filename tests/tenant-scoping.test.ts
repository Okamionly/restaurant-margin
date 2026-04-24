/**
 * @file tests/tenant-scoping.test.ts
 * Tests authWithRestaurant — multi-tenant scoping middleware.
 * Critical for SaaS data isolation: every authenticated request must carry
 * an X-Restaurant-Id header AND the user must have a membership row in
 * that restaurant. Without this, an attacker with a valid JWT could spoof
 * the header to read any other tenant's data.
 */
import { describe, it, expect, vi, beforeAll, beforeEach } from 'vitest';
import jwt from 'jsonwebtoken';

const TEST_SECRET = 'test-secret-32-chars-minimum-ok!';

beforeAll(() => {
  process.env['JWT_SECRET'] = TEST_SECRET;
});

const mockState = {
  membershipExists: false,
  membership: null as null | { userId: number; restaurantId: number; role: string },
};

vi.mock('@prisma/client', () => {
  class PrismaClient {
    restaurantMember = {
      findFirst: vi.fn(async () =>
        mockState.membershipExists ? mockState.membership : null
      ),
    };
    auditLog = { create: vi.fn() };
  }
  return { PrismaClient, Prisma: {} };
});

function makeReq(token?: string, restaurantId?: string): any {
  const headers: any = {};
  if (token) headers.authorization = `Bearer ${token}`;
  if (restaurantId !== undefined) headers['x-restaurant-id'] = restaurantId;
  return { headers };
}

function makeRes(): any {
  const res: any = {};
  res.status = vi.fn().mockReturnValue(res);
  res.json = vi.fn().mockReturnValue(res);
  return res;
}

describe('authWithRestaurant — multi-tenant scoping', () => {
  beforeEach(() => {
    mockState.membershipExists = false;
    mockState.membership = null;
  });

  it('returns 400 when X-Restaurant-Id header missing', async () => {
    const { authWithRestaurant } = await import('../api-lib/middleware');
    const token = jwt.sign({ userId: 1, email: 'a@b.com', role: 'owner' }, TEST_SECRET);
    const req = makeReq(token /* no restaurantId */);
    const res = makeRes();
    const next = vi.fn();
    await authWithRestaurant(req, res, next);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ error: 'X-Restaurant-Id header requis' });
    expect(next).not.toHaveBeenCalled();
  });

  it('returns 403 when user has no membership in requested restaurant', async () => {
    const { authWithRestaurant } = await import('../api-lib/middleware');
    const token = jwt.sign({ userId: 1, email: 'a@b.com', role: 'owner' }, TEST_SECRET);
    mockState.membershipExists = false; // no row
    const req = makeReq(token, '999');
    const res = makeRes();
    const next = vi.fn();
    await authWithRestaurant(req, res, next);
    expect(res.status).toHaveBeenCalledWith(403);
    expect(res.json).toHaveBeenCalledWith({ error: 'Accès refusé à ce restaurant' });
    expect(next).not.toHaveBeenCalled();
  });

  it('prevents cross-restaurant data access (attacker spoof header)', async () => {
    const { authWithRestaurant } = await import('../api-lib/middleware');
    // Attacker logged in as user 7 (member of restaurant 5) tries to access
    // restaurant 99 by spoofing the X-Restaurant-Id header.
    const token = jwt.sign({ userId: 7, email: 'attacker@bad.com', role: 'chef' }, TEST_SECRET);
    // No membership row exists for (userId=7, restaurantId=99) so the mock
    // returns null — middleware must reject.
    mockState.membershipExists = false;
    const req = makeReq(token, '99');
    const res = makeRes();
    const next = vi.fn();
    await authWithRestaurant(req, res, next);
    expect(res.status).toHaveBeenCalledWith(403);
    expect(next).not.toHaveBeenCalled();
    // req.restaurantId must NEVER be set when access is refused
    expect((req as any).restaurantId).toBeUndefined();
  });

  it('allows access when membership exists', async () => {
    const { authWithRestaurant } = await import('../api-lib/middleware');
    const token = jwt.sign({ userId: 7, email: 'owner@ok.com', role: 'owner' }, TEST_SECRET);
    mockState.membershipExists = true;
    mockState.membership = { userId: 7, restaurantId: 5, role: 'owner' };
    const req = makeReq(token, '5');
    const res = makeRes();
    const next = vi.fn();
    await authWithRestaurant(req, res, next);
    expect(next).toHaveBeenCalledOnce();
    expect((req as any).restaurantId).toBe(5);
    expect(res.status).not.toHaveBeenCalled();
  });
});
