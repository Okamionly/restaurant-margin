/**
 * Audit Playwright complet — RestauMargin prod (https://www.restaumargin.fr)
 * Commit 5b0da13 — 2026-04-26
 *
 * Usage: node audit-playwright.mjs
 */

// Playwright is installed in client/node_modules — use absolute require path
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const { chromium } = require('C:/Users/mrgue/CLAUDE CODE/restaurant-margin/client/node_modules/playwright');
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const BASE_URL = 'https://www.restaumargin.fr';
const AUDIT_DIR = path.join(__dirname, 'audit-output-' + new Date().toISOString().slice(0, 10));
const SCREENSHOTS_DIR = path.join(AUDIT_DIR, 'screenshots');

// Create output directories
fs.mkdirSync(SCREENSHOTS_DIR, { recursive: true });

const TIMESTAMP = Date.now();
const REGISTER_EMAIL = `test+audit-${TIMESTAMP}@restaumargin.fr`;
const REGISTER_PASSWORD = 'TestAudit2026!';
const RESTAURANT_NAME = 'Test Audit';

// All public pages to crawl
const PUBLIC_PAGES = [
  { path: '/', name: 'landing' },
  { path: '/login', name: 'login' },
  { path: '/login?mode=register', name: 'login-register' },
  { path: '/pricing', name: 'pricing' },
  { path: '/blog', name: 'blog-index' },
  { path: '/blog/calcul-marge-restaurant', name: 'blog-calc-marge' },
  { path: '/blog/coefficient-multiplicateur', name: 'blog-coefficient' },
  { path: '/blog/fiche-technique-restaurant', name: 'blog-fiche-technique' },
  { path: '/blog/food-cost-restaurant', name: 'blog-food-cost' },
  { path: '/blog/gaspillage-alimentaire-restaurant', name: 'blog-gaspillage' },
  { path: '/blog/haccp-restaurant', name: 'blog-haccp' },
  { path: '/blog/intelligence-artificielle-restaurant', name: 'blog-ia' },
  { path: '/blog/kpi-restaurateur', name: 'blog-kpi' },
  { path: '/a-propos', name: 'a-propos' },
  { path: '/demo', name: 'demo' },
  { path: '/outils/calculateur-food-cost', name: 'outil-food-cost' },
  { path: '/outils/generateur-qr-menu', name: 'outil-qr-menu' },
  { path: '/cgu', name: 'cgu' },
  { path: '/politique-confidentialite', name: 'politique-confidentialite' },
  { path: '/mentions-legales', name: 'mentions-legales' },
];

// Landing page specific checks
const LANDING_CHECKS = {
  kpis: ['320+', '+4', '10', '800'],
  roiKeywords: ['AN', 'RETOUR', 'DÉLAI'],
  featureNumbers: ['01', '02', '03', '04', '05', '06', '07', '08'],
  trialDaysMention: '7 jours',
  wrongTrialDays: '14 jours',
  navbarTrialButton: 'Essai gratuit',
};

const results = {
  pages: [],
  registrationFlow: null,
  landingSpecific: null,
  summary: { total: 0, ok: 0, errors: 0, jsErrors: 0, networkErrors: 0 },
};

async function auditPage(page, url, name, viewport) {
  const jsErrors = [];
  const networkErrors = [];
  const consoleMessages = [];

  // Capture JS errors
  page.on('pageerror', (err) => {
    jsErrors.push({ message: err.message, stack: err.stack?.slice(0, 300) });
  });

  // Capture console errors/warnings
  page.on('console', (msg) => {
    if (msg.type() === 'error' || msg.type() === 'warning') {
      consoleMessages.push({ type: msg.type(), text: msg.text() });
    }
  });

  // Capture network errors (4xx, 5xx)
  page.on('response', (response) => {
    const status = response.status();
    const respUrl = response.url();
    // Ignore analytics/tracking pixels
    if (status >= 400 && !respUrl.includes('analytics') && !respUrl.includes('hotjar') && !respUrl.includes('gtag')) {
      networkErrors.push({ url: respUrl, status });
    }
  });

  let httpStatus = 200;
  let finalUrl = url;
  let loadError = null;
  let title = '';
  let pageText = '';

  try {
    const response = await page.goto(url, {
      waitUntil: 'networkidle',
      timeout: 30000,
    });
    httpStatus = response?.status() ?? 0;
    finalUrl = page.url();
    title = await page.title();

    // Wait a bit for animations/lazy content
    await page.waitForTimeout(2000);

    // Get visible text content
    pageText = await page.evaluate(() => document.body?.innerText?.slice(0, 5000) ?? '');

  } catch (err) {
    loadError = err.message;
    httpStatus = 0;
  }

  // Screenshot
  const screenshotPath = path.join(SCREENSHOTS_DIR, `${name}-${viewport.width}px.png`);
  try {
    await page.screenshot({ path: screenshotPath, fullPage: true });
  } catch (e) {
    // ignore screenshot failure
  }

  return {
    name,
    url,
    finalUrl,
    viewport: `${viewport.width}x${viewport.height}`,
    httpStatus,
    title,
    loadError,
    jsErrors,
    consoleErrors: consoleMessages,
    networkErrors,
    screenshotPath: path.basename(screenshotPath),
    pageTextSample: pageText.slice(0, 500),
  };
}

async function auditLandingSpecific(page) {
  const checks = {};

  try {
    await page.goto(BASE_URL + '/', { waitUntil: 'networkidle', timeout: 30000 });
    await page.waitForTimeout(3000);

    // 1. PaperFold shader — check canvas exists and is not black
    const canvasInfo = await page.evaluate(() => {
      const canvases = document.querySelectorAll('canvas');
      const info = [];
      canvases.forEach((c) => {
        const rect = c.getBoundingClientRect();
        info.push({
          width: c.width,
          height: c.height,
          displayWidth: Math.round(rect.width),
          displayHeight: Math.round(rect.height),
          visible: rect.width > 0 && rect.height > 0,
        });
      });
      return info;
    });
    checks.paperFoldCanvas = {
      found: canvasInfo.length > 0,
      canvases: canvasInfo,
    };

    // 2. Browser frame dots (Safari dots: red/yellow/green)
    const safariDots = await page.evaluate(() => {
      // Look for the colored dots in the browser mockup
      const redDots = document.querySelectorAll('[style*="FF5F57"], .bg-\\[\\#FF5F57\\]');
      const allDots = document.querySelectorAll('[style*="FF5F57"]');
      return {
        redDotCount: redDots.length,
        allColoredDots: allDots.length,
        // Check if dots are in viewport
        inViewport: Array.from(allDots).map(el => {
          const r = el.getBoundingClientRect();
          return { top: Math.round(r.top), visible: r.top >= 0 && r.top < window.innerHeight };
        }),
      };
    });
    checks.browserFrameDots = safariDots;

    // 3. Check hero KPIs text (320+, +4 pts, 10 s, 800 €)
    const bodyText = await page.evaluate(() => document.body.innerText);
    checks.heroKpis = {
      has320: bodyText.includes('320'),
      hasPlusFour: bodyText.includes('+4'),
      has10: bodyText.includes('10'),
      has800: bodyText.includes('800'),
    };

    // 4. ROI section keywords
    checks.roiSection = {
      hasAN: bodyText.includes('/AN') || bodyText.includes('/ AN') || bodyText.includes('AN'),
      hasRETOUR: bodyText.includes('RETOUR') || bodyText.includes('retour'),
      hasDELAI: bodyText.includes('DÉLAI') || bodyText.includes('délai'),
    };

    // 5. Feature numbers 01-08
    checks.featureNumbers = {};
    for (const n of LANDING_CHECKS.featureNumbers) {
      checks.featureNumbers[n] = bodyText.includes(n);
    }

    // 6. Trial days — look for "7 jours" vs "14 jours"
    const trialMatches7 = (bodyText.match(/7 jours/gi) || []).length;
    const trialMatches14 = (bodyText.match(/14 jours/gi) || []).length;
    const trialMatchesEssai = (bodyText.match(/essai.{0,20}jours/gi) || []);
    checks.trialDays = {
      occurrences7jours: trialMatches7,
      occurrences14jours: trialMatches14,
      essaiContext: trialMatchesEssai.slice(0, 5),
    };

    // 7. Navbar mobile CTA — check the mobile menu button text
    // Switch to mobile viewport
    await page.setViewportSize({ width: 390, height: 844 });
    await page.waitForTimeout(500);

    const mobileNavbarText = await page.evaluate(() => {
      // Look for nav elements with "essai" or "jours"
      const navEl = document.querySelector('nav, header');
      return navEl ? navEl.innerText : '';
    });
    checks.mobileNavbarTrial = {
      navText: mobileNavbarText.slice(0, 300),
      has7jours: mobileNavbarText.toLowerCase().includes('7 jours'),
      has14jours: mobileNavbarText.toLowerCase().includes('14 jours'),
    };

    // Back to desktop
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.waitForTimeout(500);

    // 8. Carousel auto-cycle — check if carousel exists with 2 variants
    const carouselInfo = await page.evaluate(() => {
      const variants = document.querySelectorAll('[data-variant], .carousel-item');
      // Also check for presence of carousel-related content
      const bodyTxt = document.body.innerText;
      return {
        hasVoiceFiche: bodyTxt.includes('Dictée') || bodyTxt.includes('dictée') || bodyTxt.includes('Voice'),
        hasDashboardVariant: bodyTxt.includes('FOOD COST') || bodyTxt.includes('Food cost'),
        variantCount: variants.length,
      };
    });
    checks.carousel = carouselInfo;

    // 9. Newsletter section
    checks.newsletter = await page.evaluate(() => {
      const text = document.body.innerText;
      return {
        found: text.includes('Restez informé') || text.includes('newsletter') || text.includes('Newsletter'),
        emailInput: !!document.querySelector('input[type="email"]'),
      };
    });

    // 10. Contact section
    checks.contactSection = await page.evaluate(() => {
      const text = document.body.innerText;
      return {
        found: text.includes('Parlons') || text.includes('projet') || text.includes('Contact'),
      };
    });

    // 11. Footer
    checks.footer = await page.evaluate(() => {
      const footer = document.querySelector('footer');
      return {
        found: !!footer,
        text: footer ? footer.innerText.slice(0, 200) : '',
      };
    });

    // 12. Section 07 tablet mockups
    checks.tabletSection = await page.evaluate(() => {
      const text = document.body.innerText;
      return {
        hasTablet: text.includes('07') && (text.includes('tablette') || text.includes('Tablette') || text.includes('tablet')),
      };
    });

  } catch (err) {
    checks.error = err.message;
  }

  return checks;
}

async function testRegistrationFlow(browser) {
  const page = await browser.newPage();
  const result = {
    steps: [],
    success: false,
    finalError: null,
  };

  const jsErrors = [];
  page.on('pageerror', (err) => jsErrors.push(err.message));

  const apiResponses = [];
  page.on('response', async (response) => {
    if (response.url().includes('/api/')) {
      let body = '';
      try { body = await response.text(); } catch {}
      apiResponses.push({
        url: response.url(),
        method: response.request().method(),
        status: response.status(),
        body: body.slice(0, 500),
      });
    }
  });

  try {
    // Step 1: Navigate to register page
    await page.goto(BASE_URL + '/login?mode=register', { waitUntil: 'networkidle', timeout: 30000 });
    result.steps.push({ step: 'navigate-register', status: 'ok', url: page.url() });

    await page.waitForTimeout(2000);

    // Screenshot register page
    await page.screenshot({ path: path.join(SCREENSHOTS_DIR, 'register-page.png'), fullPage: true });

    // Step 2: Fill registration form
    // Try to find fields
    const emailInputSelector = 'input[type="email"], input[name="email"], input[placeholder*="email" i], input[placeholder*="Email" i]';
    const passwordInputSelector = 'input[type="password"]';
    const restaurantInputSelector = 'input[name="restaurantName"], input[placeholder*="restaurant" i], input[placeholder*="Restaurant" i], input[placeholder*="établissement" i]';

    const emailInput = await page.$(emailInputSelector);
    const passwordInputs = await page.$$(passwordInputSelector);

    if (!emailInput) {
      result.steps.push({ step: 'find-email-input', status: 'fail', detail: 'No email input found on register page' });
      result.finalError = 'Register form not found';
      await page.close();
      return { ...result, jsErrors, apiResponses };
    }

    await emailInput.fill(REGISTER_EMAIL);
    result.steps.push({ step: 'fill-email', status: 'ok', value: REGISTER_EMAIL });

    if (passwordInputs.length >= 1) {
      await passwordInputs[0].fill(REGISTER_PASSWORD);
      result.steps.push({ step: 'fill-password', status: 'ok' });
    }
    if (passwordInputs.length >= 2) {
      await passwordInputs[1].fill(REGISTER_PASSWORD);
      result.steps.push({ step: 'fill-confirm-password', status: 'ok' });
    }

    // Restaurant name
    const restaurantInput = await page.$(restaurantInputSelector);
    if (restaurantInput) {
      await restaurantInput.fill(RESTAURANT_NAME);
      result.steps.push({ step: 'fill-restaurant', status: 'ok' });
    } else {
      result.steps.push({ step: 'fill-restaurant', status: 'skip', detail: 'Restaurant input not found' });
    }

    // Screenshot before submit
    await page.screenshot({ path: path.join(SCREENSHOTS_DIR, 'register-filled.png'), fullPage: true });

    // Step 3: Submit
    const submitButton = await page.$('button[type="submit"], button:has-text("Créer"), button:has-text("S\'inscrire"), button:has-text("Commencer"), button:has-text("Inscription")');
    if (!submitButton) {
      result.steps.push({ step: 'find-submit-button', status: 'fail', detail: 'No submit button found' });
      result.finalError = 'Submit button not found';
      await page.close();
      return { ...result, jsErrors, apiResponses };
    }

    // Wait for network response after click
    const [apiResponse] = await Promise.all([
      page.waitForResponse((r) => r.url().includes('/api/auth') && r.request().method() === 'POST', { timeout: 15000 }).catch(() => null),
      submitButton.click(),
    ]);

    if (apiResponse) {
      const status = apiResponse.status();
      let body = '';
      try { body = await apiResponse.text(); } catch {}
      result.steps.push({
        step: 'api-register-response',
        status: status === 201 ? 'ok' : 'fail',
        httpStatus: status,
        body: body.slice(0, 300),
      });
    } else {
      result.steps.push({ step: 'api-register-response', status: 'no-response', detail: 'No /api/auth POST intercepted in 15s' });
    }

    await page.waitForTimeout(3000);
    await page.screenshot({ path: path.join(SCREENSHOTS_DIR, 'register-after-submit.png'), fullPage: true });

    const currentUrl = page.url();
    result.steps.push({ step: 'post-submit-url', url: currentUrl });

    // Check redirect to dashboard
    if (currentUrl.includes('/dashboard')) {
      result.steps.push({ step: 'redirect-dashboard', status: 'ok' });
      result.success = true;
    } else if (currentUrl.includes('/login') || currentUrl.includes('/register')) {
      result.steps.push({
        step: 'redirect-dashboard',
        status: 'fail',
        detail: 'Still on login/register page — no redirect',
        currentUrl,
      });
    } else {
      result.steps.push({ step: 'redirect-dashboard', status: 'unknown', currentUrl });
    }

  } catch (err) {
    result.finalError = err.message;
    result.steps.push({ step: 'error', detail: err.message });
  }

  await page.close();
  return { ...result, jsErrors, apiResponses };
}

async function main() {
  console.log('Starting RestauMargin audit...');
  console.log('Output dir:', AUDIT_DIR);

  const browser = await chromium.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });

  // ── Phase 1: Audit all public pages (desktop + mobile) ──────────────────
  for (const pageConfig of PUBLIC_PAGES) {
    const url = BASE_URL + pageConfig.path;
    console.log(`Auditing: ${pageConfig.name} (${url})`);

    const pageResult = { name: pageConfig.name, url };

    // Desktop (1440px)
    const desktopPage = await browser.newPage();
    await desktopPage.setViewportSize({ width: 1440, height: 900 });
    const desktopResult = await auditPage(desktopPage, url, pageConfig.name + '-desktop', { width: 1440, height: 900 });
    await desktopPage.close();
    pageResult.desktop = desktopResult;

    // Mobile (390px)
    const mobilePage = await browser.newPage();
    await mobilePage.setViewportSize({ width: 390, height: 844 });
    const mobileResult = await auditPage(mobilePage, url, pageConfig.name + '-mobile', { width: 390, height: 844 });
    await mobilePage.close();
    pageResult.mobile = mobileResult;

    results.pages.push(pageResult);

    // Update summary
    results.summary.total++;
    const hasError = desktopResult.httpStatus >= 400 || desktopResult.loadError ||
                     desktopResult.jsErrors.length > 0 || desktopResult.networkErrors.length > 0;
    if (hasError) results.summary.errors++;
    else results.summary.ok++;
    if (desktopResult.jsErrors.length > 0) results.summary.jsErrors += desktopResult.jsErrors.length;
    if (desktopResult.networkErrors.length > 0) results.summary.networkErrors += desktopResult.networkErrors.length;
  }

  // ── Phase 2: Landing specific audit ────────────────────────────────────────
  console.log('Running landing-specific checks...');
  const landingPage = await browser.newPage();
  await landingPage.setViewportSize({ width: 1440, height: 900 });
  results.landingSpecific = await auditLandingSpecific(landingPage);
  await landingPage.close();

  // ── Phase 3: Registration flow ─────────────────────────────────────────────
  console.log('Testing registration flow...');
  results.registrationFlow = await testRegistrationFlow(browser);

  await browser.close();

  // ── Save JSON results ──────────────────────────────────────────────────────
  const jsonPath = path.join(AUDIT_DIR, 'audit-results.json');
  fs.writeFileSync(jsonPath, JSON.stringify(results, null, 2));
  console.log('Audit complete. Results saved to:', jsonPath);
  console.log(JSON.stringify(results, null, 2));
}

main().catch((err) => {
  console.error('Audit failed:', err);
  process.exit(1);
});
