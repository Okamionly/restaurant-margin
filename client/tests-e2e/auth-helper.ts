/**
 * @file client/tests-e2e/auth-helper.ts
 * Helper to authenticate a Playwright page via the JSON API rather than
 * navigating the login form. Faster and skips client-side validation that
 * isn't part of the test under inspection.
 *
 * Usage:
 *   import { login } from './auth-helper';
 *   test('protected route', async ({ page }) => {
 *     await login(page, 'demo@restaumargin.fr', 'DemoPass123');
 *     await page.goto('/dashboard');
 *   });
 */
import type { Page, APIRequestContext } from '@playwright/test';

export interface LoginResponse {
  token: string;
  user: { id: number; email: string; name: string; role: string; plan?: string };
  restaurantId?: number | null;
  restaurant?: { id: number; name: string } | null;
}

export async function login(page: Page, email: string, password: string): Promise<LoginResponse> {
  const apiBase = process.env.E2E_API_BASE ?? 'https://www.restaumargin.fr';
  const res = await page.request.post(`${apiBase}/api/auth/login`, {
    data: { email, password },
    headers: { 'Content-Type': 'application/json' },
  });
  if (!res.ok()) {
    const body = await res.text();
    throw new Error(`Login failed (${res.status()}): ${body}`);
  }
  const json = (await res.json()) as LoginResponse;
  // The frontend stores the JWT in localStorage under "token" + restaurant id under "restaurantId".
  // Seed both before the page is navigated so route guards pass.
  await page.addInitScript(
    ({ token, restaurantId, user }) => {
      localStorage.setItem('token', token);
      if (restaurantId != null) localStorage.setItem('restaurantId', String(restaurantId));
      if (user) localStorage.setItem('user', JSON.stringify(user));
    },
    { token: json.token, restaurantId: json.restaurantId ?? null, user: json.user }
  );
  return json;
}

/**
 * Direct API token request (no Page) — useful for seeding fixtures.
 */
export async function loginAPI(
  request: APIRequestContext,
  email: string,
  password: string
): Promise<string> {
  const apiBase = process.env.E2E_API_BASE ?? 'https://www.restaumargin.fr';
  const res = await request.post(`${apiBase}/api/auth/login`, { data: { email, password } });
  if (!res.ok()) throw new Error(`Login failed: ${res.status()}`);
  const json = (await res.json()) as LoginResponse;
  return json.token;
}
