/**
 * @file tests/prospection.test.ts
 * Prospection de restaurants (2026-09-26) : qui peut etre contacte, et ce que
 * dit le message. Fonctions pures d'api-lib/utils/prospection.ts, plus des gardes
 * statiques sur le cron (1 envoi par jour, interrupteur, desinscription).
 */
import { describe, it, expect } from 'vitest';
import { readFileSync } from 'fs';
import { join } from 'path';
import {
  emailAcceptable, choisirEmail, estAgregateur, extraireEmails, ciblesDuJour, composerMessage,
} from '../api-lib/utils/prospection';

describe('adresses contactables', () => {
  it('accepte une adresse generique du site ou au nom de l etablissement', () => {
    expect(emailAcceptable('contact@lebistrot.fr', 'lebistrot.fr')).toBe(true);
    expect(emailAcceptable('reservation@lebistrot.fr', 'lebistrot.fr')).toBe(true);
    expect(emailAcceptable('lebistrot@gmail.com', 'lebistrot.fr')).toBe(true);
  });

  it('refuse une adresse nominative, technique, ou etrangere au site', () => {
    expect(emailAcceptable('jean.dupont@lebistrot.fr', 'lebistrot.fr')).toBe(false);
    expect(emailAcceptable('noreply@lebistrot.fr', 'lebistrot.fr')).toBe(false);
    expect(emailAcceptable('rgpd@lebistrot.fr', 'lebistrot.fr')).toBe(false);
    expect(emailAcceptable('contact@wixpress.com', 'lebistrot.fr')).toBe(false);
    expect(emailAcceptable('contact@agence-web.fr', 'lebistrot.fr')).toBe(false);
    expect(emailAcceptable('logo@2x.png', 'lebistrot.fr')).toBe(false);
    expect(emailAcceptable('marie.martin@gmail.com', 'lebistrot.fr')).toBe(false);
  });

  it('prefere contact@ a info@', () => {
    expect(choisirEmail(['info@lebistrot.fr', 'contact@lebistrot.fr'], 'lebistrot.fr')).toBe('contact@lebistrot.fr');
    expect(choisirEmail(['jean.dupont@lebistrot.fr'], 'lebistrot.fr')).toBeNull();
  });

  it('ignore annuaires et plateformes, lit les adresses obfusquees', () => {
    expect(estAgregateur('https://www.tripadvisor.fr/Restaurant_Review-x')).toBe(true);
    expect(estAgregateur('https://www.thefork.fr/restaurant/x')).toBe(true);
    expect(estAgregateur('https://www.lebistrot.fr/')).toBe(false);
    expect(extraireEmails('<a href="mailto:Contact&#64;LeBistrot.fr">x</a>')).toContain('contact@lebistrot.fr');
  });
});

describe('pays vises', () => {
  it("n'inclut le Canada qu'avec une adresse postale (LCAP)", () => {
    const sans = Array.from({ length: 40 }, (_, j) => ciblesDuJour(j, undefined)).flat();
    expect(sans.some((c) => c.pays === 'Canada')).toBe(false);
    const avec = Array.from({ length: 40 }, (_, j) => ciblesDuJour(j, '1 rue X, 75000 Paris')).flat();
    expect(avec.some((c) => c.pays === 'Canada')).toBe(true);
    expect(new Set(sans.map((c) => c.pays))).toEqual(new Set(['France', 'Belgique', 'Suisse']));
  });
});

describe('le message', () => {
  const m = composerMessage({
    nom: 'Le Bistrot', site: 'https://www.lebistrot.fr', email: 'contact@lebistrot.fr',
    code: 'RM-ABCD1234', jeton: 'a'.repeat(48),
  });

  it("porte l'offre reelle, la desinscription et l'origine de l'adresse", () => {
    expect(m.texte).toContain('RM-ABCD1234');
    expect(m.texte).toContain('offre=RM-ABCD1234');
    expect(m.texte).toContain(`/api/prospection/desinscription?t=${'a'.repeat(48)}`);
    expect(m.texte).toContain("l'adresse contact@lebistrot.fr est publiée sur https://www.lebistrot.fr");
    expect(m.texte).toContain('29 € par mois, sans engagement');
    expect(m.html).toContain('Ne plus recevoir de message');
  });

  it("ne contient aucune preuve sociale (regle absolue du CLAUDE.md)", () => {
    const t = m.texte.toLowerCase();
    expect(t).toMatch(/l'outil est récent/);
    for (const interdit of [/\d+\s*(\+\s*)?(restaurants|clients|utilisateurs|établissements)/, /nos clients/, /n°\s*1/, /numéro 1/, /\/5\b/, /avis/]) {
      expect(t).not.toMatch(interdit);
    }
  });
});

describe('gardes du cron de prospection', () => {
  const src = readFileSync(join(__dirname, '..', 'api', 'index.ts'), 'utf8');
  const i = src.indexOf("app.get('/api/cron/prospection'");
  const corps = src.slice(i, src.indexOf('\n});', i));

  it('un envoi par jour au plus, et rien sans l interrupteur', () => {
    expect(i).toBeGreaterThan(0);
    expect(corps).toMatch(/PROSPECTION_ACTIVE === '1'/);
    expect(corps).toMatch(/envoyeAt: \{ gt: new Date\(Date\.now\(\) - 20 \* 3600_000\) \}/);
    expect(corps).toMatch(/if \(recent\) return/);
  });

  it("verifie un domaine et une adresse jamais contactes, et lit l'erreur Resend", () => {
    expect(corps).toMatch(/where: \{ domaine \}/);
    expect(corps).toMatch(/where: \{ email \}/);
    expect(corps).toMatch(/\(envoi as any\)\?\.error \|\| !envoi\?\.data\?\.id/);
    expect(corps).toMatch(/'List-Unsubscribe-Post': 'List-Unsubscribe=One-Click'/);
  });
});
