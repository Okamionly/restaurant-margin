/**
 * @file tests/auth-revocation.test.ts
 * La deconnexion et la suppression de compte doivent couper l'acces pour de vrai.
 *
 * Constat du 2026-09-25 : api/index.ts redefinissait ses propres middlewares
 * d'authentification, sans liste de revocation ni statut du compte ; un jeton
 * revoque restait valable 7 jours sur toutes ses routes. Et le middleware partage
 * lisait le cookie AVANT le Bearer : sur un poste partage, une requete pouvait
 * etre servie au nom du compte precedent.
 */
import { describe, it, expect, vi, beforeAll, beforeEach } from 'vitest';
import { readFileSync } from 'fs';
import { join } from 'path';
import jwt from 'jsonwebtoken';

const TEST_SECRET = 'test-secret-32-chars-minimum-ok!';

beforeAll(() => {
  process.env['JWT_SECRET'] = TEST_SECRET;
});

const etat = vi.hoisted(() => ({
  revoques: new Set<string>(),
  derniereRequeteMembre: null as any,
}));

vi.mock('../api-lib/jti-blocklist', () => ({
  isJtiRevoked: async (jti?: string) => !!jti && etat.revoques.has(jti),
  revokeJti: async () => {},
}));

vi.mock('@prisma/client', () => {
  class PrismaClient {
    restaurantMember = {
      findFirst: vi.fn(async (args: any) => {
        etat.derniereRequeteMembre = args;
        return { userId: 1, restaurantId: 7, role: 'owner' };
      }),
    };
    auditLog = { create: vi.fn() };
  }
  return { PrismaClient, Prisma: {} };
});

function makeRes(): any {
  const res: any = {};
  res.status = vi.fn().mockReturnValue(res);
  res.json = vi.fn().mockReturnValue(res);
  return res;
}

const signer = (payload: object) => jwt.sign(payload, TEST_SECRET);

describe('revocation des jetons et priorite Bearer / cookie', () => {
  beforeEach(() => {
    etat.revoques.clear();
    etat.derniereRequeteMembre = null;
  });

  it("api/index.ts n'a plus de copie locale des middlewares d'authentification", () => {
    const src = readFileSync(join(__dirname, '..', 'api', 'index.ts'), 'utf8');
    expect(src).not.toMatch(/^\s*(async\s+)?function\s+(authMiddleware|authWithRestaurant)\s*\(/m);
    expect(src).toMatch(
      /import\s*\{[^}]*\bauthMiddleware\b[^}]*\bauthWithRestaurant\b[^}]*\}\s*from\s*'\.\.\/api-lib\/middleware'/,
    );
  });

  it('refuse un jeton revoque par la deconnexion', async () => {
    const { authMiddleware } = await import('../api-lib/middleware');
    etat.revoques.add('jti-deconnecte');
    const token = signer({ userId: 1, email: 'a@b.fr', role: 'chef', jti: 'jti-deconnecte' });
    const res = makeRes();
    const next = vi.fn();
    await authMiddleware({ headers: { authorization: `Bearer ${token}` } }, res, next);
    expect(res.status).toHaveBeenCalledWith(401);
    expect(next).not.toHaveBeenCalled();
  });

  it("le Bearer de la session affichee l'emporte sur le cookie du compte precedent", async () => {
    const { authMiddleware } = await import('../api-lib/middleware');
    const req: any = {
      headers: { authorization: `Bearer ${signer({ userId: 2, email: 'b@b.fr', role: 'chef' })}` },
      cookies: { auth_token: signer({ userId: 1, email: 'a@a.fr', role: 'chef' }) },
    };
    const next = vi.fn();
    await authMiddleware(req, makeRes(), next);
    expect(next).toHaveBeenCalledOnce();
    expect(req.user.userId).toBe(2);
  });

  it('sans Bearer, le cookie httpOnly reste accepte', async () => {
    const { authMiddleware } = await import('../api-lib/middleware');
    const req: any = { headers: {}, cookies: { auth_token: signer({ userId: 3, email: 'c@c.fr', role: 'chef' }) } };
    const next = vi.fn();
    await authMiddleware(req, makeRes(), next);
    expect(next).toHaveBeenCalledOnce();
    expect(req.user.userId).toBe(3);
  });

  it("la verification d'appartenance au restaurant exclut un compte supprime", async () => {
    const { authWithRestaurant } = await import('../api-lib/middleware');
    const token = signer({ userId: 1, email: 'a@b.fr', role: 'chef' });
    const next = vi.fn();
    await authWithRestaurant({ headers: { authorization: `Bearer ${token}`, 'x-restaurant-id': '7' } }, makeRes(), next);
    expect(next).toHaveBeenCalledOnce();
    expect(etat.derniereRequeteMembre?.where?.user).toEqual({ role: { not: 'deleted' } });
  });
});
