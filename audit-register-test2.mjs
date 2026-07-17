import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const { chromium } = require('C:/Users/mrgue/CLAUDE CODE/restaurant-margin/client/node_modules/playwright');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  await page.setViewportSize({ width: 1440, height: 900 });

  const apiResponses = [];
  page.on('response', async (response) => {
    if (response.url().includes('/api/auth') || response.url().includes('/api/csrf')) {
      let body = '';
      try { body = await response.text(); } catch {}
      apiResponses.push({ url: response.url(), method: response.request().method(), status: response.status(), body: body.slice(0, 600) });
    }
  });

  const jsErrors = [];
  page.on('pageerror', e => jsErrors.push(e.message));

  await page.goto('https://www.restaumargin.fr/login?mode=register', { waitUntil: 'networkidle', timeout: 30000 });
  await page.waitForTimeout(2000);

  const TIMESTAMP = Date.now();
  const testEmail = `test+pw-${TIMESTAMP}@restaumargin.fr`;

  // Fill email
  await page.fill('input[type="email"]', testEmail);
  console.log('Filled email:', testEmail);

  // Fill password
  const pwInputs = await page.$$('input[type="password"]');
  console.log('Password inputs found:', pwInputs.length);
  if (pwInputs[0]) await pwInputs[0].fill('TestAudit2026!');

  // Fill restaurant name
  const restaurantInput = await page.$('input[placeholder="Le Bistrot de Marie"]');
  if (restaurantInput) {
    await restaurantInput.fill('Test Audit Restaurant');
    console.log('Filled restaurant name');
  } else {
    console.log('Restaurant input NOT found');
  }

  // Check CGU checkbox
  const checkbox = await page.$('input[type="checkbox"]');
  if (checkbox) {
    await checkbox.check();
    const checked = await checkbox.evaluate(el => el.checked);
    console.log('CGU checkbox checked:', checked);
  } else {
    console.log('CGU checkbox NOT found');
  }

  await page.waitForTimeout(800);

  // Check submit button state
  const submitBtn = await page.$('button[type="submit"]');
  if (!submitBtn) {
    console.log('ERROR: No submit button found');
    await browser.close();
    return;
  }

  const isDisabled = await submitBtn.evaluate(el => el.disabled);
  const btnText = await submitBtn.evaluate(el => el.innerText);
  console.log('Submit button text:', btnText);
  console.log('Submit button disabled:', isDisabled);

  await page.screenshot({ path: 'C:/Users/mrgue/CLAUDE CODE/restaurant-margin/audit-output-2026-04-27/screenshots/register-before-submit.png', fullPage: true });

  if (!isDisabled) {
    console.log('Clicking submit...');
    const apiRespPromise = page.waitForResponse(
      r => r.url().includes('/api/auth') && r.request().method() === 'POST',
      { timeout: 15000 }
    ).catch(() => null);

    await submitBtn.click();
    const apiResp = await apiRespPromise;

    if (apiResp) {
      console.log('API /auth response status:', apiResp.status());
      const body = await apiResp.text().catch(() => '');
      console.log('API body:', body.slice(0, 400));
    } else {
      console.log('No API /auth POST intercepted');
    }

    await page.waitForTimeout(3000);
    console.log('URL after submit:', page.url());
  } else {
    console.log('Button still disabled after filling all fields!');
    // Debug: check all form fields
    const allInputs = await page.$$eval('input', inputs =>
      inputs.map(i => ({ type: i.type, name: i.name, id: i.id, placeholder: i.placeholder, value: i.value ? i.value.slice(0,20) : '', disabled: i.disabled }))
    );
    console.log('All inputs state:', JSON.stringify(allInputs, null, 2));
  }

  console.log('\n=== API Responses ===');
  console.log(JSON.stringify(apiResponses, null, 2));
  console.log('\n=== JS Errors ===');
  console.log(JSON.stringify(jsErrors));

  await page.screenshot({ path: 'C:/Users/mrgue/CLAUDE CODE/restaurant-margin/audit-output-2026-04-27/screenshots/register-after-submit.png', fullPage: true });
  await browser.close();
})().catch(err => {
  console.error('Test failed:', err.message);
  process.exit(1);
});
