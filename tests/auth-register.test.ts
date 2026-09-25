/**
 * @file tests/auth-register.test.ts
 * Tests POST /api/auth/register — covers plan assignment (pro via activation
 * code, basic + 14-day trial without code), already-used activation codes,
 * and duplicate emails. Mocks Prisma + Resend; no DB, no network.
 */
import { describe, it, expect, vi, beforeAll, beforeEach } from 'vitest';

beforeAll(() => {
  process.env['JWT_SECRET'] = 'test-secret-32-chars-minimum-ok!';
  // Disable Resend to skip email send branch entirely
  delete process.env['RESEND_API_KEY'];
});

// Chauffe du routeur d'authentification HORS du premier test (FIX 2026-09-25).
// Son import charge express, resend, otplib, qrcode, jsonwebtoken, upstash et zod :
// fait dans le corps du premier test, ce cout comptait dans son delai de 5 s, qui
// sautait des que la machine etait chargee (9 fichiers en parallele, ou juste apres
// un vite build) — d'ou des echecs a 5 014 / 6 600 ms qui repassaient en relancant.
// Une fois importe ici, le import() de callRegister est servi par le cache.
beforeAll(async () => {
  await import('../api-lib/routes/auth');
}, 30_000);

// ── Prisma mock factory ──────────────────────────────────────────────────────
const mockPrismaState = {
  userCount: 0,
  existingUserByEmail: null as null | { id: number; email: string },
  activationCode: null as null | { code: string; plan: string; used: boolean },
  createdUser: null as any,
  createdRestaurant: null as any,
  activationUpdated: false,
  requetesBrutes: [] as string[],
};

vi.mock('@prisma/client', () => {
  class PrismaClient {
    user = {
      count: vi.fn(async () => mockPrismaState.userCount),
      findUnique: vi.fn(async ({ where }: any) => {
        if (mockPrismaState.existingUserByEmail && where.email === mockPrismaState.existingUserByEmail.email) {
          return mockPrismaState.existingUserByEmail;
        }
        return null;
      }),
      findFirst: vi.fn(async () => null),
      create: vi.fn(async ({ data }: any) => {
        mockPrismaState.createdUser = { id: 42, ...data };
        return mockPrismaState.createdUser;
      }),
    };
    restaurant = {
      create: vi.fn(async ({ data }: any) => {
        mockPrismaState.createdRestaurant = { id: 99, ...data };
        return mockPrismaState.createdRestaurant;
      }),
    };
    restaurantMember = { findFirst: vi.fn(async () => null) };
    activationCode = {
      findUnique: vi.fn(async ({ where }: any) => {
        if (mockPrismaState.activationCode && mockPrismaState.activationCode.code === where.code) {
          return mockPrismaState.activationCode;
        }
        return null;
      }),
      update: vi.fn(async () => {
        mockPrismaState.activationUpdated = true;
        return {};
      }),
    };
    auditLog = { create: vi.fn() };
    // Requetes brutes (marquage notif_log de la notification d'inscription).
    $executeRaw = vi.fn(async (morceaux: TemplateStringsArray) => {
      mockPrismaState.requetesBrutes.push(Array.from(morceaux).join('?'));
      return 1;
    });
  }
  return { PrismaClient, Prisma: {} };
});

// Mock Resend (just in case env leaks). Les envois sont memorises pour que le
// test de notification du fondateur puisse les lire ; la reponse imite le vrai
// SDK, qui renvoie { data, error } et ne leve jamais.
const envois = vi.hoisted(() => [] as any[]);
vi.mock('resend', () => {
  class Resend {
    emails = { send: vi.fn(async (p: any) => { envois.push(p); return { data: { id: 'mock' }, error: null }; }) };
    constructor(_apiKey?: string) {}
  }
  return { Resend };
});

function resetMockState() {
  mockPrismaState.userCount = 1; // simulate non-first user (avoids admin path)
  mockPrismaState.existingUserByEmail = null;
  mockPrismaState.activationCode = null;
  mockPrismaState.createdUser = null;
  mockPrismaState.createdRestaurant = null;
  mockPrismaState.activationUpdated = false;
  mockPrismaState.requetesBrutes = [];
}

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

async function callRegister(req: any, res: any) {
  const authRouter = (await import('../api-lib/routes/auth')).default;
  // Find the register handler — express router stack
  const layer = (authRouter as any).stack.find(
    (l: any) => l.route?.path === '/register' && l.route?.methods?.post
  );
  if (!layer) throw new Error('register handler not found');
  // Walk the full middleware stack (validateRequest -> handler) so Wave 3
  // Zod validation runs first, then the actual handler.
  const stack = layer.route.stack;
  let i = 0;
  const runNext = async (): Promise<void> => {
    const fn = stack[i++]?.handle;
    if (!fn) return;
    await fn(req, res, runNext);
  };
  await runNext();
}

describe('POST /api/auth/register', () => {
  beforeEach(() => {
    resetMockState();
  });

  it('assigns pro plan when valid activation code provided', async () => {
    mockPrismaState.activationCode = { code: 'CODE123', plan: 'pro', used: false };
    const req = makeReq({
      email: 'chef@bistro.fr',
      password: 'StrongPass1',
      name: 'Chef',
      activationCode: 'code123', // case-insensitive
      acceptedCgu: true,
    });
    const res = makeRes();
    await callRegister(req, res);
    expect(res.status).not.toHaveBeenCalledWith(403);
    expect(res.status).not.toHaveBeenCalledWith(409);
    expect(mockPrismaState.createdUser?.plan).toBe('pro');
    expect(mockPrismaState.activationUpdated).toBe(true);
    // res.status(201) is called
    expect(res.status).toHaveBeenCalledWith(201);
  });

  it('assigns basic plan + 7d trial when no activation code', async () => {
    const req = makeReq({
      email: 'newbie@bistro.fr',
      password: 'StrongPass1',
      name: 'Newbie',
      acceptedCgu: true,
    });
    const res = makeRes();
    await callRegister(req, res);
    expect(mockPrismaState.createdUser?.plan).toBe('basic');
    expect(mockPrismaState.createdUser?.trialEndsAt).toBeInstanceOf(Date);
    const days = Math.round(
      (mockPrismaState.createdUser.trialEndsAt.getTime() - Date.now()) / (24 * 60 * 60 * 1000)
    );
    expect(days).toBeGreaterThanOrEqual(6);
    expect(days).toBeLessThanOrEqual(7);
  });

  it('returns 403 on already-used activation code', async () => {
    mockPrismaState.activationCode = { code: 'USED99', plan: 'pro', used: true };
    const req = makeReq({
      email: 'chef@bistro.fr',
      password: 'StrongPass1',
      name: 'Chef',
      activationCode: 'used99',
      acceptedCgu: true,
    });
    const res = makeRes();
    await callRegister(req, res);
    expect(res.status).toHaveBeenCalledWith(403);
    expect(res.json).toHaveBeenCalledWith({ error: 'Ce code a déjà été utilisé' });
    expect(mockPrismaState.createdUser).toBeNull();
  });

  // Ajoute le 2026-09-25 : ce signal passait par une routine cloud dont la cle
  // Resend etait revoquee depuis juillet — plus aucune inscription n'etait
  // signalee, sans que rien ne rougisse. Il vit desormais dans le serveur.
  it("previent le fondateur a chaque inscription, avec les champs saisis echappes", async () => {
    process.env['RESEND_API_KEY'] = 're_test_factice';
    envois.length = 0;
    try {
      const req = makeReq({
        email: 'nouveau@bistro.fr',
        password: 'StrongPass1',
        name: 'Nouveau',
        restaurantName: 'Chez <b>Nous</b>',
        acceptedCgu: true,
      });
      const res = makeRes();
      await callRegister(req, res);
      expect(res.status).toHaveBeenCalledWith(201);
      const auFondateur = envois.filter((e) => e.to === 'mr.guessousyoussef@gmail.com');
      expect(auFondateur).toHaveLength(1);
      expect(auFondateur[0].subject).toContain('Nouvelle inscription');
      expect(auFondateur[0].html).toContain('nouveau@bistro.fr');
      // Le nom du restaurant est saisi par l'inscrit : il doit arriver echappe.
      expect(auFondateur[0].html).toContain('Chez &lt;b&gt;Nous&lt;/b&gt;');
      expect(auFondateur[0].html).not.toContain('<b>Nous</b>');
      // L'email de bienvenue part toujours, a l'inscrit.
      expect(envois.some((e) => e.to === 'nouveau@bistro.fr')).toBe(true);
      // L'inscription est marquee comme signalee : le recapitulatif d'inbox-sync
      // (toutes les 2 h) ne la renverra pas une seconde fois.
      expect(mockPrismaState.requetesBrutes.some((q) => q.includes("VALUES ('signup'"))).toBe(true);
    } finally {
      delete process.env['RESEND_API_KEY'];
    }
  });

  it('returns 409 on duplicate email', async () => {
    mockPrismaState.existingUserByEmail = { id: 1, email: 'taken@bistro.fr' };
    const req = makeReq({
      email: 'TAKEN@bistro.fr',
      password: 'StrongPass1',
      name: 'Dup',
      acceptedCgu: true,
    });
    const res = makeRes();
    await callRegister(req, res);
    expect(res.status).toHaveBeenCalledWith(409);
    expect(res.json).toHaveBeenCalledWith({ error: 'Email déjà utilisé' });
  });
});
