/**
 * @file client/tests-e2e/login.spec.ts
 * Smoke test du parcours de connexion : /login -> identifiants via l'aide API
 * -> /dashboard.
 *
 * ── Pourquoi ce test se met en PAUSE au lieu d'echouer ──────────────────────
 * Constate le 2026-09-24 : le CI etait ROUGE sur TOUS ses runs, et ce test en
 * etait une des deux causes. Deux defauts cumules :
 *
 *  1. Le workflow passe `E2E_DEMO_EMAIL: ${{ secrets.E2E_DEMO_EMAIL }}`. Quand le
 *     secret n'existe pas, GitHub injecte une CHAINE VIDE, pas `undefined`. Or le
 *     code utilisait `??`, qui ne se declenche que sur null/undefined : le repli
 *     etait donc inerte, et c'est une chaine vide qui partait au serveur —
 *     d'ou le "400 Email invalide" au lieu d'un message utile.
 *  2. Le compte de repli `demo@restaumargin.fr` n'existe PAS en base (verifie).
 *     Meme repli repare, le test ne pouvait pas passer.
 *
 * Un CI rouge en permanence ne protege plus rien : on cesse de le lire, et les
 * vraies regressions passent avec (c'est ainsi qu'une regression de types est
 * restee invisible deux jours). Un test qui ne PEUT pas s'executer faute
 * d'identifiants doit donc se declarer ignore, explicitement et visiblement —
 * jamais echouer, et jamais passer en silence non plus.
 *
 * Pour l'activer : definir les secrets de depot E2E_DEMO_EMAIL et
 * E2E_DEMO_PASSWORD, pointant sur un compte de demonstration reel.
 *
 * @smoke
 */
import { test, expect } from '@playwright/test';
import { login } from './auth-helper';

// `|| ''` et non `?? ''` : le cas reel a traiter est la CHAINE VIDE injectee par
// GitHub Actions pour un secret absent, que `??` laisse passer.
const email = (process.env.E2E_DEMO_EMAIL || '').trim();
const password = (process.env.E2E_DEMO_PASSWORD || '').trim();
const identifiantsFournis = email.length > 0 && password.length > 0;

test('@smoke login redirects to dashboard', async ({ page }) => {
  test.skip(
    !identifiantsFournis,
    'Identifiants E2E absents : definissez les secrets E2E_DEMO_EMAIL et ' +
      'E2E_DEMO_PASSWORD sur un compte de demonstration reel pour activer ce test.'
  );

  // Pre-seed token + user so the dashboard skips its login redirect.
  await login(page, email, password);

  await page.goto('/dashboard');

  // The dashboard either shows a user name, a logout button, or — at minimum —
  // navigates away from /login. Use a permissive assertion: URL contains
  // /dashboard AND any heading is rendered. Adjust when stable selectors land.
  await expect(page).toHaveURL(/\/dashboard/, { timeout: 15_000 });

  // Look for a heading — there's typically an h1 or h2 with the page title.
  const headings = page.locator('h1, h2');
  await expect(headings.first()).toBeVisible({ timeout: 15_000 });
});
