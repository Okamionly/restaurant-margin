import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const { chromium } = require('C:/Users/mrgue/CLAUDE CODE/restaurant-margin/client/node_modules/playwright');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  await page.setViewportSize({ width: 1440, height: 900 });

  const jsErrors = [];
  const apiErrors = [];
  const consoleErrors = [];

  page.on('pageerror', e => jsErrors.push(e.message));
  page.on('response', async (r) => {
    const url = r.url();
    if (r.status() >= 400 && !url.includes('analytics') && !url.includes('google') && !url.includes('gtag') && !url.includes('sentry')) {
      let body = '';
      try { body = await r.text(); } catch {}
      apiErrors.push({ url, status: r.status(), method: r.request().method(), body: body.slice(0, 300) });
    }
  });
  page.on('console', msg => {
    const text = msg.text();
    if (msg.type() === 'error' && !text.includes('google') && !text.includes('analytics') && !text.includes('region1') && !text.includes('G-656')) {
      consoleErrors.push({ type: msg.type(), text: text.slice(0, 250) });
    }
  });

  // Register a new user
  await page.goto('https://www.restaumargin.fr/login?mode=register', { waitUntil: 'networkidle', timeout: 30000 });
  await page.waitForTimeout(1500);

  const ts = Date.now();
  const testEmail = `test+dash-${ts}@restaumargin.fr`;

  await page.fill('input[type="email"]', testEmail);

  const pwInputs = await page.$$('input[type="password"]');
  if (pwInputs[0]) await pwInputs[0].fill('TestAudit2026!');

  const restaurantInput = await page.$('input[placeholder="Le Bistrot de Marie"]');
  if (restaurantInput) {
    await restaurantInput.fill('Test Dashboard Audit');
  }

  const checkbox = await page.$('input[type="checkbox"]');
  if (checkbox) await checkbox.check();

  await page.waitForTimeout(400);

  const submitBtn = await page.$('button[type="submit"]');
  if (!submitBtn) {
    console.log('ERROR: No submit button');
    await browser.close();
    return;
  }

  await submitBtn.click();

  try {
    await page.waitForURL('**/dashboard', { timeout: 15000 });
  } catch (e) {
    console.log('Did not reach dashboard:', page.url());
  }

  // Wait for dashboard to fully initialize
  await page.waitForTimeout(5000);

  console.log('Dashboard URL:', page.url());

  // Capture visible error toasts/notifications
  const toasts = await page.evaluate(() => {
    const selectors = [
      '[class*="toast"]',
      '[class*="Toast"]',
      '[role="alert"]',
      '[class*="notification"]',
      '[class*="error"]',
      '[class*="Error"]',
    ];
    const found = [];
    for (const sel of selectors) {
      document.querySelectorAll(sel).forEach(el => {
        const text = el.innerText?.trim();
        if (text && text.length > 2) {
          found.push({ selector: sel, text: text.slice(0, 200), classes: el.className?.slice(0, 80) });
        }
      });
    }
    return found;
  });

  // Capture all visible text in bottom-right corner (where toasts usually are)
  const bodyText = await page.evaluate(() => document.body.innerText.slice(0, 2000));

  console.log('\n=== JS Errors ===');
  console.log(JSON.stringify(jsErrors, null, 2));

  console.log('\n=== API Errors (4xx/5xx) ===');
  console.log(JSON.stringify(apiErrors, null, 2));

  console.log('\n=== Console Errors ===');
  console.log(JSON.stringify(consoleErrors, null, 2));

  console.log('\n=== Toast/Alert Elements ===');
  console.log(JSON.stringify(toasts, null, 2));

  console.log('\n=== Body text sample ===');
  console.log(bodyText.slice(0, 800));

  await page.screenshot({
    path: 'C:/Users/mrgue/CLAUDE CODE/restaurant-margin/audit-output-2026-04-27/screenshots/dashboard-post-register.png',
    fullPage: false,
  });

  await browser.close();
})().catch(err => {
  console.error('FAIL:', err.message);
  process.exit(1);
});
