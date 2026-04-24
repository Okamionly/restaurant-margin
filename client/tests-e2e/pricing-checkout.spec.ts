/**
 * @file client/tests-e2e/pricing-checkout.spec.ts
 * Smoke test for /pricing → Stripe checkout redirect.
 * Verifies that clicking "S'abonner" on the Pro tier redirects to a
 * buy.stripe.com checkout URL. We don't complete the checkout — just
 * assert the user-facing payment integration is wired up.
 *
 * @smoke
 */
import { test, expect } from '@playwright/test';

test('@smoke /pricing Pro CTA redirects to Stripe', async ({ page }) => {
  await page.goto('/pricing');

  // Find a button or link advertising the Pro tier subscription.
  // Wide net: "S'abonner", "Subscribe", "Choisir Pro", anything containing "Pro".
  const cta = page
    .getByRole('button', { name: /s'?abonner|subscribe|choisir.*pro|commencer.*pro/i })
    .or(page.getByRole('link', { name: /s'?abonner|subscribe|choisir.*pro/i }))
    .first();

  await expect(cta).toBeVisible({ timeout: 15_000 });

  // The CTA may either navigate the current tab, open a new one, or redirect
  // via a server endpoint (POST /api/stripe/create-checkout). Wait for any
  // navigation that lands on stripe.com.
  const [request] = await Promise.all([
    page.waitForRequest(
      (req) => /stripe\.com|checkout\.stripe\.com/.test(req.url()),
      { timeout: 20_000 }
    ),
    cta.click(),
  ]);

  expect(request.url()).toMatch(/stripe\.com/);
});
