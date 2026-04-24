/**
 * @file client/tests-e2e/demo-page.spec.ts
 * Smoke test for /demo — public page, no auth.
 * Asserts the canonical demo restaurant name is rendered AND a food-cost
 * percentage is displayed (the headline value the page is built around).
 *
 * @smoke
 */
import { test, expect } from '@playwright/test';

test('@smoke /demo shows Le Bistrot de Marie + food-cost percentage', async ({ page }) => {
  await page.goto('/demo');

  // Wait for the page to hydrate then look for the demo restaurant name.
  await expect(page.getByText(/Le Bistrot de Marie/i)).toBeVisible({ timeout: 15_000 });

  // Food-cost percentage is rendered like "28.5%" or "28,5%" — match the
  // pattern broadly to avoid coupling to localisation choices.
  const foodCostPct = page.getByText(/\d{1,2}[.,]?\d?\s*%/);
  await expect(foodCostPct.first()).toBeVisible({ timeout: 15_000 });
});
