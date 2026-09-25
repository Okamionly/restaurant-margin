/**
 * Non-regression des gardes posees le 2026-09-25 sur les envois d'email et les
 * webhooks (audit : relais ouvert, webhooks qui echouaient OUVERTS).
 *
 * Tests statiques : api/index.ts monte toute l'application et ces routes
 * appellent Resend et la base. On verifie ici que les REGLES sont presentes dans
 * le code — un retour en arriere (ex. « si le secret manque, tout passe ») fait
 * rougir le CI au lieu de repartir en production sans bruit.
 */
import { describe, it, expect } from 'vitest';
import { readFileSync } from 'fs';
import { join } from 'path';

const INDEX = readFileSync(join(__dirname, '..', 'api', 'index.ts'), 'utf8');
const REFERRALS = readFileSync(join(__dirname, '..', 'api-lib', 'routes', 'referrals.ts'), 'utf8');

function corpsDeRoute(source: string, signature: string): string {
  const i = source.indexOf(signature);
  expect(i, `route introuvable : ${signature}`).toBeGreaterThanOrEqual(0);
  const fin = source.indexOf('\n});', i);
  return source.slice(i, fin);
}

describe('Webhooks : echouer FERME quand le secret manque', () => {
  it('verifyResendSignature refuse sans RESEND_WEBHOOK_SECRET', () => {
    const f = INDEX.match(/function verifyResendSignature\(req: any\): boolean \{[\s\S]*?\n\}/);
    expect(f).not.toBeNull();
    // Le motif fautif d'origine : `if (!secret) return true;`
    expect(f![0]).not.toMatch(/if \(!secret\) return true/);
    expect(f![0]).toMatch(/if \(!secret\) \{[\s\S]*?return false;/);
  });

  it('/referrals/qualify exige que le secret attendu soit defini', () => {
    // Le motif fautif : undefined === undefined laissait passer.
    expect(REFERRALS).toMatch(/if \(!attendu \|\| typeof secret !== 'string' \|\| secret !== attendu\)/);
  });
});

describe("Envois d'email : pas de relais ouvert", () => {
  it('outreach/send est reserve a l administrateur', () => {
    const c = corpsDeRoute(INDEX, "app.post('/api/outreach/send'");
    expect(c).toMatch(/req\.user\?\.role !== 'admin'/);
  });

  it('campaign/send est reserve a l administrateur et lit l erreur Resend', () => {
    const c = corpsDeRoute(INDEX, "app.post('/api/campaign/send'");
    expect(c).toMatch(/req\.user\?\.role !== 'admin'/);
    expect(c).toMatch(/result as any\)\?\.error/);
  });

  it('email/send : HTML brut reserve a l admin, un seul destinataire, plafond, erreur Resend lue', () => {
    const c = corpsDeRoute(INDEX, "app.post('/api/email/send'");
    expect(c).toMatch(/if \(html && !estAdmin\)/);
    expect(c).toMatch(/typeof to !== 'string'/);
    expect(c).toMatch(/PLAFOND_EMAILS_RESTAURANT_24H/);
    expect(c).toMatch(/result as any\)\?\.error/);
  });

  it('email/sent ne renvoie que les envois du restaurant appelant', () => {
    const c = corpsDeRoute(INDEX, "app.get('/api/email/sent'");
    expect(c).toMatch(/restaurantId === req\.restaurantId/);
  });
});

describe("Boite de reception : l'IA n'ecrit a personne sans relecture", () => {
  // Constat du 2026-09-25 : quand l'IA jugeait une question « factuelle », son
  // brouillon partait seul, vers l'adresse From (falsifiable), sujet recopie.
  it("inbox-sync n'envoie que l'accuse de reception fixe, au plus une fois par adresse et par jour", () => {
    const c = corpsDeRoute(INDEX, "app.get('/api/cron/inbox-sync'");
    expect(c).not.toMatch(/auto_ok|autoOk/);
    // Seul texte envoye au contact : la constante fixe, jamais le brouillon.
    expect(c).toMatch(/<p style="white-space:pre-wrap;">\$\{ACCUSE_RECEPTION\}<\/p>/);
    expect(c).toMatch(/content: ACCUSE_RECEPTION,/);
    // Garde atomique quotidienne, avant l'envoi.
    expect(c).toMatch(/VALUES \('auto_ack', \$\{`\$\{senderEmail\}\|\$\{jour\}`\}/);
    expect(c.indexOf("'auto_ack'")).toBeLessThan(c.indexOf('resendAuto.emails.send'));
    // Le sujet de l'expediteur n'est plus recopie dans la reponse.
    expect(c).not.toMatch(/subject: subject \? `Re: /);
  });

  it("l'accuse de reception est un texte fixe, sans rien d'interpole", () => {
    const m = INDEX.match(/const ACCUSE_RECEPTION = `([\s\S]*?)`;/);
    expect(m).not.toBeNull();
    expect(m![1]).not.toMatch(/\$\{/);
  });
});
