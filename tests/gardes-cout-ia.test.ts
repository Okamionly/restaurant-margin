/**
 * @file tests/gardes-cout-ia.test.ts
 * Les appels a un modele sont factures : chaque route qui en fait doit etre
 * bornee (essai, quota mensuel compte, limite de debit), et aucune route
 * publique ne doit pouvoir en declencher a volonte.
 *
 * Constat du 2026-09-25 : six routes Sonnet et le scan de factures verifiaient
 * un quota qu'elles n'incrementaient jamais ; le scan n'avait aucun frein ;
 * un essai expire gardait l'IA cote API ; deux GET publics appelaient un
 * modele a chaque requete.
 */
import { describe, it, expect, vi, beforeAll, beforeEach } from 'vitest';
import { readFileSync } from 'fs';
import { join } from 'path';

const racine = join(__dirname, '..');
const lire = (rel: string) => readFileSync(join(racine, rel), 'utf8');

// Decoupe un fichier en routes Express : { declaration, corps } par route.
function routes(src: string, prefixe: RegExp) {
  const lignes = src.split(/\r?\n/);
  const debuts: number[] = [];
  lignes.forEach((l, i) => { if (prefixe.test(l)) debuts.push(i); });
  return debuts.map((d, k) => ({
    declaration: lignes[d],
    corps: lignes.slice(d, k + 1 < debuts.length ? debuts[k + 1] : lignes.length).join('\n'),
  }));
}

describe('gardes statiques du cout IA', () => {
  it("chaque route du routeur IA qui appelle un modele est bornee et comptee", () => {
    const ia = routes(lire('api-lib/routes/ai.ts'), /^router\.(get|post|put|delete)\(/);
    const avecModele = ia.filter((r) => /anthropic\.messages\.create|llmComplete\(/.test(r.corps));
    expect(avecModele.length).toBeGreaterThanOrEqual(14);
    for (const r of avecModele) {
      const nom = r.declaration.match(/'([^']+)'/)?.[1];
      expect(r.declaration, `${nom} : garde d'essai`).toMatch(/authWithRestaurant,\s*exigerAccesIA,/);
      expect(r.corps, `${nom} : quota mensuel`).toMatch(/checkMonthlyQuota\(/);
      expect(r.corps, `${nom} : usage compte`).toMatch(/enregistrerUsageIA\(|INSERT INTO ai_usage/);
    }
  });

  it('le scan de factures est borne comme les autres routes IA', () => {
    const scan = routes(lire('api/index.ts'), /^app\.(get|post|put|delete)\(/)
      .find((r) => r.declaration.includes("'/api/invoices/scan'"));
    expect(scan).toBeTruthy();
    expect(scan!.declaration).toMatch(/authWithRestaurant,\s*exigerAccesIA,/);
    expect(scan!.corps).toMatch(/checkAiRateLimit\(/);
    expect(scan!.corps).toMatch(/checkMonthlyQuota\(/);
    expect(scan!.corps).toMatch(/enregistrerUsageIA\(/);
  });

  it("aucun GET public n'appelle un modele a chaque requete", () => {
    const index = routes(lire('api/index.ts'), /^app\.(get|post|put|delete)\(/);
    const assistantSante = index.find((r) => r.declaration.includes("'/api/assistant/health'"));
    expect(assistantSante!.corps).toMatch(/if \(!verifyCron\(req, res\)\) return;/);
    const sante = index.find((r) => r.declaration.includes("'/api/health'"));
    // La sonde profonde passe par le cache : un resultat 'ok' est reutilise.
    expect(sante!.corps).toMatch(/aiProbeCache\.status === 'ok' && Date\.now\(\) - aiProbeCache\.at < AI_PROBE_TTL_MS/);
  });
});

// ── Comportement de la garde d'essai ────────────────────────────────────────
const etat = vi.hoisted(() => ({ utilisateur: null as any }));

vi.mock('@prisma/client', () => {
  class PrismaClient {
    user = { findUnique: vi.fn(async () => etat.utilisateur) };
    restaurantMember = { findFirst: vi.fn(async () => null) };
    auditLog = { create: vi.fn() };
    $executeRaw = vi.fn(async () => 1);
    $queryRaw = vi.fn(async () => []);
  }
  return { PrismaClient, Prisma: {} };
});

beforeAll(() => {
  process.env['JWT_SECRET'] = 'test-secret-32-chars-minimum-ok!';
});

function makeRes(): any {
  const res: any = {};
  res.status = vi.fn().mockReturnValue(res);
  res.json = vi.fn().mockReturnValue(res);
  return res;
}

describe("exigerAccesIA applique la regle du client (TrialPaywallGuard)", () => {
  beforeEach(() => { etat.utilisateur = null; });

  const cas: Array<[string, any, string, boolean]> = [
    ['abonne pro', { plan: 'pro', trialEndsAt: null }, 'chef', true],
    ['abonne business', { plan: 'business', trialEndsAt: new Date(Date.now() - 864e5) }, 'chef', true],
    ['essai en cours', { plan: 'basic', trialEndsAt: new Date(Date.now() + 864e5) }, 'chef', true],
    ['basic sans date de fin (onboarding)', { plan: 'basic', trialEndsAt: null }, 'chef', true],
    ['administrateur', { plan: 'basic', trialEndsAt: new Date(Date.now() - 864e5) }, 'admin', true],
    ['essai expire', { plan: 'basic', trialEndsAt: new Date(Date.now() - 864e5) }, 'chef', false],
  ];

  for (const [nom, utilisateur, role, autorise] of cas) {
    it(`${nom} -> ${autorise ? 'autorise' : '402'}`, async () => {
      const { exigerAccesIA } = await import('../api-lib/routes/ai');
      etat.utilisateur = utilisateur;
      const res = makeRes();
      const next = vi.fn();
      await exigerAccesIA({ user: { userId: 9, role } }, res, next);
      if (autorise) {
        expect(next).toHaveBeenCalledOnce();
        expect(res.status).not.toHaveBeenCalled();
      } else {
        expect(next).not.toHaveBeenCalled();
        expect(res.status).toHaveBeenCalledWith(402);
      }
    }, 30_000);
  }
});
