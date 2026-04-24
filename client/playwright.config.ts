import { defineConfig, devices } from '@playwright/test';

/**
 * Playwright config — read-only smoke tests against production restaumargin.fr.
 *
 * We run these directly against prod (no preview / staging URL yet) so the
 * tests must be IDEMPOTENT and side-effect-free. No registrations, no
 * payments — only public-page smoke tests + pre-seeded login.
 *
 * For local runs:    npm run test:e2e
 * For CI smoke runs: npx playwright test --grep @smoke
 */
export default defineConfig({
  testDir: './tests-e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: process.env.CI ? [['html'], ['github']] : 'list',

  use: {
    baseURL: process.env.E2E_BASE_URL ?? 'https://www.restaumargin.fr',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    // Default 30s; some pages do client-side hydration which can be slow on cold start
    navigationTimeout: 30_000,
  },

  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
});
