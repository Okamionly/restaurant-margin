#!/usr/bin/env npx tsx
// ============================================================
// RestauMargin — Google Maps Restaurant Scraper (Puppeteer)
// NATIONAL EDITION — Scrapes restaurants across 50+ French cities
//
// Usage:
//   npx tsx scripts/scrape-gmaps.ts --city montpellier
//   npx tsx scripts/scrape-gmaps.ts --all
//   npx tsx scripts/scrape-gmaps.ts --all --headless false
//   npx tsx scripts/scrape-gmaps.ts --city "Paris 11e" --limit 50
//
// Output:
//   docs/campaigns/national-contacts.csv
// ============================================================

import puppeteer, { type Browser, type Page } from 'puppeteer-core';
import * as fs from 'fs';
import * as path from 'path';

// ── Chrome path (system-installed Chrome) ─────────────────────────
const CHROME_PATH = process.env.CHROME_PATH
  || 'C:/Program Files/Google/Chrome/Application/chrome.exe';

// ── Types ──────────────────────────────────────────────────────────
interface GmapsRestaurant {
  name: string;
  address: string;
  phone: string;
  website: string;
  email: string;
  rating: string;
  reviewCount: string;
  category: string;
  city: string;
  source: string;
  scrapedAt: string;
}

interface CityResult {
  city: string;
  total: number;
  withEmail: number;
  withWebsite: number;
  status: 'success' | 'failed' | 'skipped';
  error?: string;
}

// ── National City List ────────────────────────────────────────────
// Top 30+ French cities by restaurant density, with Paris by arrondissement
const FRENCH_CITIES: string[] = [
  // Paris by arrondissement (20 arrondissements)
  'Paris 1er', 'Paris 2e', 'Paris 3e', 'Paris 4e', 'Paris 5e',
  'Paris 6e', 'Paris 7e', 'Paris 8e', 'Paris 9e', 'Paris 10e',
  'Paris 11e', 'Paris 12e', 'Paris 13e', 'Paris 14e', 'Paris 15e',
  'Paris 16e', 'Paris 17e', 'Paris 18e', 'Paris 19e', 'Paris 20e',
  // Major cities
  'Marseille', 'Lyon', 'Toulouse', 'Nice', 'Nantes',
  'Montpellier', 'Strasbourg', 'Bordeaux', 'Lille',
  // Secondary cities
  'Rennes', 'Reims', 'Saint-Etienne', 'Toulon', 'Le Havre',
  'Grenoble', 'Dijon', 'Angers', 'Nimes',
  'Aix-en-Provence', 'Clermont-Ferrand', 'Le Mans', 'Brest',
  'Tours', 'Amiens', 'Limoges', 'Perpignan', 'Metz',
  'Besancon', 'Orleans', 'Rouen', 'Caen', 'Nancy',
];

// ── Config ─────────────────────────────────────────────────────────
const RATE_LIMIT_MS = 2000;
const EMAIL_REGEX = /[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}/g;
const NATIONAL_CSV_PATH = path.join(__dirname, '..', 'docs', 'campaigns', 'national-contacts.csv');
const NATIONAL_CSV_HEADER = 'restaurant_name;cuisine_type;email;phone;address;city;source';
const USER_AGENT = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36';
const MAX_RETRIES = 2;
const SCROLL_ITERATIONS = 10; // Minimum scrolls to get more than 20 results

// ── Helpers ────────────────────────────────────────────────────────
function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function randomDelay(min: number, max: number): Promise<void> {
  const ms = Math.floor(Math.random() * (max - min + 1)) + min;
  return sleep(ms);
}

function sanitizeCSVField(str: string): string {
  if (!str) return '';
  // Remove newlines and semicolons that would break CSV
  const cleaned = str.replace(/[\n\r;]/g, ' ').trim();
  return cleaned;
}

// ── Load existing contacts for deduplication ──────────────────────
function loadExistingContacts(): Set<string> {
  const seen = new Set<string>();
  const campaignsDir = path.join(__dirname, '..', 'docs', 'campaigns');

  if (!fs.existsSync(campaignsDir)) return seen;

  const csvFiles = fs.readdirSync(campaignsDir).filter(f => f.endsWith('.csv'));

  for (const file of csvFiles) {
    try {
      const content = fs.readFileSync(path.join(campaignsDir, file), 'utf-8');
      const lines = content.split('\n').slice(1); // Skip header
      for (const line of lines) {
        if (!line.trim()) continue;
        // Extract restaurant name (first field) — works with both , and ; delimiters
        const delimiter = line.includes(';') ? ';' : ',';
        const parts = line.split(delimiter);
        if (parts[0]) {
          const name = parts[0].replace(/"/g, '').trim().toLowerCase();
          if (name) seen.add(name);
        }
      }
    } catch {
      // Skip unreadable files
    }
  }

  console.log(`  [Dedup] Loaded ${seen.size} existing restaurant names from CSV files`);
  return seen;
}

// ── CSV output management ─────────────────────────────────────────
function ensureNationalCSV(): void {
  const dir = path.dirname(NATIONAL_CSV_PATH);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  if (!fs.existsSync(NATIONAL_CSV_PATH)) {
    fs.writeFileSync(NATIONAL_CSV_PATH, NATIONAL_CSV_HEADER + '\n', 'utf-8');
    console.log(`  [CSV] Created: ${NATIONAL_CSV_PATH}`);
  } else {
    console.log(`  [CSV] Appending to: ${NATIONAL_CSV_PATH}`);
  }
}

function appendContactToCSV(r: GmapsRestaurant): void {
  const line = [
    sanitizeCSVField(r.name),
    sanitizeCSVField(r.category),
    sanitizeCSVField(r.email),
    sanitizeCSVField(r.phone),
    sanitizeCSVField(r.address),
    sanitizeCSVField(r.city),
    sanitizeCSVField(r.source),
  ].join(';');
  fs.appendFileSync(NATIONAL_CSV_PATH, line + '\n', 'utf-8');
}

// ── Email extraction ──────────────────────────────────────────────
function extractEmails(html: string): string[] {
  const decoded = html
    .replace(/&#64;/g, '@')
    .replace(/&#46;/g, '.')
    .replace(/\[at\]/gi, '@')
    .replace(/\[dot\]/gi, '.')
    .replace(/ at /gi, '@')
    .replace(/ dot /gi, '.')
    .replace(/mailto:/gi, '');

  const matches = decoded.match(EMAIL_REGEX) || [];

  const blacklist = [
    'example.com', 'sentry.io', 'w3.org', 'schema.org', 'googleapis.com',
    'gravatar.com', 'wordpress.org', 'cloudflare.com', 'facebook.com',
    'twitter.com', 'google.com', 'gstatic.com', 'pagesjaunes.fr',
    'wix.com', 'squarespace.com', 'shopify.com', 'webflow.com',
    '.png', '.jpg', '.gif', '.svg', '.css', '.js', '.woff', '.map',
  ];

  return [...new Set(matches)]
    .filter(email => {
      const lower = email.toLowerCase();
      return !blacklist.some(b => lower.includes(b))
        && !lower.startsWith('noreply')
        && !lower.startsWith('no-reply')
        && !lower.startsWith('mailer-daemon')
        && !lower.startsWith('webmaster@')
        && email.length < 80
        && email.includes('.');
    });
}

// ── Handle Google cookie consent (CRITICAL for non-Montpellier cities) ──
async function handleCookieConsent(page: Page): Promise<void> {
  try {
    // Wait a moment for the consent dialog to appear
    await sleep(2000);

    // Strategy 1: Look for the consent iframe (Google often loads consent in an iframe)
    const frames = page.frames();
    for (const frame of frames) {
      try {
        const consentBtn = await frame.$('button[aria-label="Tout accepter"], button[aria-label="Accept all"]');
        if (consentBtn) {
          await consentBtn.click();
          console.log('  [Consent] Accepted via iframe');
          await sleep(2000);
          return;
        }
      } catch {
        // Frame may not be accessible
      }
    }

    // Strategy 2: Direct button selectors on the main page
    const consentSelectors = [
      // French Google consent
      'button[aria-label="Tout accepter"]',
      'button[aria-label="Accept all"]',
      'button[aria-label="Alle akzeptieren"]',
      'button[aria-label="Aceptar todo"]',
      // Material Design button class used by Google
      'button.VfPpkd-LgbsSe',
    ];

    for (const selector of consentSelectors) {
      const buttons = await page.$$(selector);
      for (const btn of buttons) {
        const text = await btn.evaluate(el => (el.textContent || '').trim().toLowerCase());
        if (
          text.includes('tout accepter') ||
          text.includes('accept all') ||
          text.includes('alle akzeptieren') ||
          text.includes('aceptar todo')
        ) {
          await btn.click();
          console.log(`  [Consent] Cookie dialog accepted: "${text}"`);
          await sleep(2000);
          return;
        }
      }
    }

    // Strategy 3: Broad text-based search — find any button with accept text
    const accepted = await page.evaluate(() => {
      const allButtons = document.querySelectorAll('button');
      for (const btn of allButtons) {
        const text = (btn.textContent || '').trim().toLowerCase();
        if (
          text === 'tout accepter' ||
          text === 'accept all' ||
          text.includes('j\'accepte') ||
          text.includes('agree')
        ) {
          (btn as HTMLButtonElement).click();
          return text;
        }
      }
      return null;
    });

    if (accepted) {
      console.log(`  [Consent] Cookie dialog accepted (text match): "${accepted}"`);
      await sleep(2000);
      return;
    }

    // Strategy 4: Try to find the consent form and click the first button
    const formAccepted = await page.evaluate(() => {
      // Google consent forms have specific action URLs
      const forms = document.querySelectorAll('form[action*="consent"], form[action*="save"]');
      for (const form of forms) {
        const buttons = form.querySelectorAll('button');
        if (buttons.length >= 2) {
          // The "Accept all" / "Tout accepter" is usually the LAST button in the form
          const lastBtn = buttons[buttons.length - 1];
          (lastBtn as HTMLButtonElement).click();
          return true;
        }
      }
      return false;
    });

    if (formAccepted) {
      console.log('  [Consent] Cookie dialog accepted (form strategy)');
      await sleep(2000);
      return;
    }

    // Strategy 5: Check for consent.google.com redirect
    const currentUrl = page.url();
    if (currentUrl.includes('consent.google.com') || currentUrl.includes('consent.google.fr')) {
      console.log('  [Consent] Detected consent redirect page, attempting to accept...');
      // Click the submit/accept button
      await page.evaluate(() => {
        const btns = document.querySelectorAll('button, input[type="submit"]');
        for (const btn of btns) {
          const text = (btn.textContent || btn.getAttribute('value') || '').toLowerCase();
          if (text.includes('accept') || text.includes('agree') || text.includes('consent') || text.includes('accepter')) {
            (btn as HTMLElement).click();
            return;
          }
        }
        // Last resort: click the last button (usually accept)
        if (btns.length > 0) {
          (btns[btns.length - 1] as HTMLElement).click();
        }
      });
      await sleep(3000);
      return;
    }

    console.log('  [Consent] No consent dialog found (may already be accepted)');
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    console.log(`  [Consent] Error handling consent: ${msg.substring(0, 80)}`);
  }
}

// ── Scroll the Google Maps results panel to load more results ─────
async function scrollAndLoadResults(page: Page, minScrolls: number = SCROLL_ITERATIONS): Promise<number> {
  console.log(`  [Scroll] Loading results (min ${minScrolls} scrolls)...`);

  let previousCount = 0;
  let sameCountStreak = 0;
  const maxSameCount = 5; // Stop after 5 scrolls with no new results
  const maxScrolls = Math.max(minScrolls, 30); // Upper bound

  for (let i = 0; i < maxScrolls; i++) {
    // Scroll all possible containers
    await page.evaluate(() => {
      // Method 1: role="feed"
      const feed = document.querySelector('[role="feed"]');
      if (feed) { feed.scrollTop = feed.scrollHeight; }

      // Method 2: .m6QErb containers
      const containers = document.querySelectorAll('.m6QErb');
      for (const c of containers) {
        if (c.scrollHeight > c.clientHeight + 10) {
          c.scrollTop = c.scrollHeight;
        }
      }

      // Method 3: any scrollable div inside [role="main"]
      const mainDivs = document.querySelectorAll('[role="main"] div');
      for (const d of mainDivs) {
        if (d.scrollHeight > d.clientHeight + 200 && d.clientHeight > 100) {
          d.scrollTop = d.scrollHeight;
        }
      }
    });

    // Wait for lazy loading (random delay to avoid detection)
    await sleep(2000 + Math.random() * 2000);

    // Count current results
    const currentCount = await page.evaluate(() => {
      const selectors = [
        '[role="feed"] > div > div > a[href*="/maps/place/"]',
        '[role="feed"] a[href*="/maps/place/"]',
        '.m6QErb a[href*="/maps/place/"]',
        'a[href*="/maps/place/"]',
      ];
      for (const sel of selectors) {
        const items = document.querySelectorAll(sel);
        if (items.length > 0) return items.length;
      }
      const feed = document.querySelector('[role="feed"]');
      if (feed) return feed.children.length;
      return 0;
    });

    // Check for "end of list"
    const endReached = await page.evaluate(() => {
      const bodyText = document.body.innerText;
      return bodyText.includes("Vous avez vu tous les résultats")
        || bodyText.includes("You've reached the end")
        || bodyText.includes("No more results")
        || !!document.querySelector('.m6QErb .PbZDve')
        || !!document.querySelector('.m6QErb .lXJj5c');
    });

    if (currentCount > previousCount) {
      console.log(`  [Scroll] ${i + 1}: ${currentCount} results loaded`);
      previousCount = currentCount;
      sameCountStreak = 0;
    } else {
      sameCountStreak++;
      // Try clicking "More results" button
      await page.evaluate(() => {
        const btns = document.querySelectorAll('button');
        for (const b of btns) {
          if (b.textContent?.includes('Plus de résultats') || b.textContent?.includes('More results')) {
            b.click();
          }
        }
      });
    }

    if (endReached) {
      console.log(`  [Scroll] End of results at ${currentCount} items`);
      break;
    }

    // Only stop early if we have done at least minScrolls
    if (sameCountStreak >= maxSameCount && i >= minScrolls) {
      console.log(`  [Scroll] No new results after ${maxSameCount} attempts. Stopping at ${currentCount}.`);
      break;
    }
  }

  return previousCount;
}

// ── Extract restaurant info from the detail panel ──────────────────
async function extractRestaurantDetails(page: Page): Promise<Partial<GmapsRestaurant>> {
  return page.evaluate(() => {
    const result: Record<string, string> = {};

    // Name
    const h1 = document.querySelector('h1.DUwDvf') || document.querySelector('h1');
    result.name = h1?.textContent?.trim() || '';

    // Rating
    const ratingEl = document.querySelector('span.ceNzKf') || document.querySelector('[role="img"][aria-label*="star"]');
    if (ratingEl) {
      const ariaLabel = ratingEl.getAttribute('aria-label') || '';
      const ratingMatch = ariaLabel.match(/([\d,.]+)/);
      result.rating = ratingMatch ? ratingMatch[1].replace(',', '.') : '';
    }

    // Review count
    const reviewEl = document.querySelector('span.F7nice span[aria-label]') || document.querySelector('button[jsaction*="review"] span');
    if (reviewEl) {
      const reviewText = reviewEl.getAttribute('aria-label') || reviewEl.textContent || '';
      const reviewMatch = reviewText.match(/([\d\s,.]+)/);
      result.reviewCount = reviewMatch ? reviewMatch[1].replace(/\s/g, '').replace(',', '') : '';
    }

    // Category / cuisine type
    const categoryEl = document.querySelector('button[jsaction*="category"]') || document.querySelector('.DkEaL');
    result.category = categoryEl?.textContent?.trim() || '';

    // Address
    const addressEl = document.querySelector('[data-item-id="address"] .Io6YTe')
      || document.querySelector('button[data-item-id="address"]');
    if (addressEl) {
      result.address = addressEl.textContent?.trim() || '';
    }

    // Phone
    const phoneEl = document.querySelector('[data-item-id^="phone"] .Io6YTe')
      || document.querySelector('button[data-item-id^="phone"]');
    if (phoneEl) {
      result.phone = phoneEl.textContent?.trim() || '';
    }

    // Website
    const websiteEl = document.querySelector('a[data-item-id="authority"]');
    if (websiteEl) {
      result.website = (websiteEl as HTMLAnchorElement).href || '';
    }

    return result;
  });
}

// ── Visit a restaurant website and scrape for emails ─────────────
async function scrapeWebsiteForEmails(browser: Browser, websiteUrl: string): Promise<string[]> {
  const page = await browser.newPage();

  try {
    await page.setUserAgent(USER_AGENT);
    await page.setViewport({ width: 1280, height: 800 });

    // Block images and heavy resources for speed
    await page.setRequestInterception(true);
    page.on('request', (req) => {
      const resourceType = req.resourceType();
      if (['image', 'media', 'font', 'stylesheet'].includes(resourceType)) {
        req.abort();
      } else {
        req.continue();
      }
    });

    console.log(`    [Website] Visiting: ${websiteUrl}`);
    await page.goto(websiteUrl, { waitUntil: 'domcontentloaded', timeout: 15000 });
    await sleep(1000);

    // Get page HTML and extract emails
    const html = await page.content();
    let emails = extractEmails(html);

    if (emails.length > 0) {
      await page.close();
      return emails;
    }

    // Try common contact sub-pages
    const baseUrl = new URL(websiteUrl).origin;
    const contactPaths = [
      '/contact',
      '/contact-us',
      '/contactez-nous',
      '/nous-contacter',
      '/a-propos',
      '/about',
      '/mentions-legales',
      '/legal',
      '/contact.html',
      '/contact.php',
    ];

    for (const subPath of contactPaths) {
      try {
        await sleep(1000);
        const subUrl = baseUrl + subPath;
        const response = await page.goto(subUrl, { waitUntil: 'domcontentloaded', timeout: 10000 });
        if (response && response.ok()) {
          const subHtml = await page.content();
          emails = extractEmails(subHtml);
          if (emails.length > 0) {
            console.log(`    [Website] Email found on ${subPath}`);
            await page.close();
            return emails;
          }
        }
      } catch {
        // Sub-page failed, continue
      }
    }

    await page.close();
    return [];
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    console.log(`    [Website] Error: ${msg.substring(0, 80)}`);
    try { await page.close(); } catch { /* ignore */ }
    return [];
  }
}

// ── Scrape a single city ─────────────────────────────────────────
async function scrapeCity(
  browser: Browser,
  city: string,
  limit: number,
  existingNames: Set<string>,
): Promise<CityResult> {
  const result: CityResult = { city, total: 0, withEmail: 0, withWebsite: 0, status: 'success' };

  console.log(`\n${'='.repeat(60)}`);
  console.log(`  SCRAPING: ${city}`);
  console.log(`${'='.repeat(60)}`);

  const page = await browser.newPage();
  await page.setUserAgent(USER_AGENT);
  await page.setExtraHTTPHeaders({ 'Accept-Language': 'fr-FR,fr;q=0.9,en;q=0.5' });

  try {
    // Navigate to Google Maps search
    const searchQuery = `restaurant ${city}`;
    const searchUrl = `https://www.google.com/maps/search/${encodeURIComponent(searchQuery)}`;
    console.log(`  [Navigate] ${searchUrl}`);
    await page.goto(searchUrl, { waitUntil: 'networkidle2', timeout: 45000 });

    // CRITICAL: Handle cookie consent BEFORE anything else
    await handleCookieConsent(page);

    // After consent, check if we were redirected away from Maps
    const currentUrl = page.url();
    if (!currentUrl.includes('google.com/maps')) {
      console.log('  [Recovery] Redirected away from Maps, navigating back...');
      await page.goto(searchUrl, { waitUntil: 'networkidle2', timeout: 30000 });
      await sleep(2000);
    }

    // Wait for results to appear
    try {
      await page.waitForSelector('[role="feed"]', { timeout: 15000 });
      console.log('  [Ready] Results feed detected');
    } catch {
      console.log('  [Warning] No results feed, trying alternative...');
      try {
        await page.waitForSelector('.m6QErb', { timeout: 10000 });
        console.log('  [Ready] Alternative container detected');
      } catch {
        // Take debug screenshot
        const debugDir = path.join(__dirname, '..', 'data', 'scraping');
        if (!fs.existsSync(debugDir)) fs.mkdirSync(debugDir, { recursive: true });
        const screenshotPath = path.join(debugDir, `debug-${city.replace(/\s+/g, '-')}.png`);
        await page.screenshot({ path: screenshotPath, fullPage: true });
        console.log(`  [Error] No results found. Screenshot: ${screenshotPath}`);
        result.status = 'failed';
        result.error = 'No results feed found';
        await page.close();
        return result;
      }
    }

    // Scroll to load more than 20 results
    const totalLoaded = await scrollAndLoadResults(page, SCROLL_ITERATIONS);
    console.log(`  [Results] ${totalLoaded} items loaded`);

    // Collect all listing links
    const listingLinks = await page.evaluate(() => {
      const feed = document.querySelector('[role="feed"]');
      if (!feed) return [];
      const anchors = feed.querySelectorAll(':scope > div > div > a');
      return Array.from(anchors).map((a, idx) => ({
        index: idx,
        href: (a as HTMLAnchorElement).href || '',
        ariaLabel: a.getAttribute('aria-label') || '',
      })).filter(l => l.href.includes('/maps/place/'));
    });

    console.log(`  [Listings] ${listingLinks.length} restaurant links found`);

    const effectiveLimit = limit === Infinity ? listingLinks.length : Math.min(limit, listingLinks.length);
    const cityResults: GmapsRestaurant[] = [];

    // Process each listing
    for (let i = 0; i < effectiveLimit; i++) {
      const link = listingLinks[i];

      try {
        const shortLabel = link.ariaLabel ? link.ariaLabel.substring(0, 50) : `Restaurant ${i + 1}`;
        console.log(`  [${i + 1}/${effectiveLimit}] ${shortLabel}`);

        // Click on the listing to open details panel
        await page.evaluate((href) => {
          const feed = document.querySelector('[role="feed"]');
          if (!feed) return;
          const anchors = feed.querySelectorAll(':scope > div > div > a');
          for (const a of anchors) {
            if ((a as HTMLAnchorElement).href === href) {
              (a as HTMLElement).click();
              return;
            }
          }
        }, link.href);

        await randomDelay(1500, 2500);

        // Wait for detail panel
        try {
          await page.waitForSelector('h1.DUwDvf, h1', { timeout: 5000 });
        } catch {
          console.log(`    [Skip] Detail panel did not load`);
          continue;
        }

        await sleep(800);

        // Extract info
        const details = await extractRestaurantDetails(page);

        if (!details.name) {
          console.log(`    [Skip] No name found`);
          continue;
        }

        // Check deduplication against existing CSVs
        const nameKey = details.name.toLowerCase();
        if (existingNames.has(nameKey)) {
          console.log(`    [Skip] Already in database: ${details.name}`);
          continue;
        }

        const restaurant: GmapsRestaurant = {
          name: details.name || '',
          address: details.address || '',
          phone: details.phone || '',
          website: details.website || '',
          email: '',
          rating: details.rating || '',
          reviewCount: details.reviewCount || '',
          category: details.category || '',
          city: city,
          source: 'google-maps',
          scrapedAt: new Date().toISOString(),
        };

        // Visit website to find email
        if (restaurant.website) {
          result.withWebsite++;
          await randomDelay(RATE_LIMIT_MS, RATE_LIMIT_MS + 1500);
          const emails = await scrapeWebsiteForEmails(browser, restaurant.website);
          if (emails.length > 0) {
            restaurant.email = emails[0];
            result.withEmail++;
            console.log(`    >>> EMAIL: ${restaurant.email}`);
          }
        }

        // Save incrementally to national CSV
        cityResults.push(restaurant);
        appendContactToCSV(restaurant);
        existingNames.add(nameKey); // Prevent duplicates within the same run
        result.total++;

        const status = restaurant.email
          ? `>>> ${restaurant.email}`
          : restaurant.website
            ? 'no email (has website)'
            : 'no website';
        console.log(`    ${restaurant.name} | ${restaurant.category || '-'} | ${status}`);

        // Go back to the results list
        await page.evaluate(() => {
          const backBtn = document.querySelector('button[aria-label="Back"], button[aria-label="Retour"], button.hYBQ0b');
          if (backBtn) (backBtn as HTMLButtonElement).click();
        });
        await randomDelay(800, 1500);

      } catch (err) {
        const msg = err instanceof Error ? err.message : String(err);
        console.log(`    [Error] ${msg.substring(0, 100)}`);
        // Try to recover
        try {
          await page.evaluate(() => {
            const backBtn = document.querySelector('button[aria-label="Back"], button[aria-label="Retour"], button.hYBQ0b');
            if (backBtn) (backBtn as HTMLButtonElement).click();
          });
          await sleep(1500);
        } catch {
          // If back button fails, try goBack
          try {
            await page.goBack({ waitUntil: 'domcontentloaded', timeout: 5000 });
            await sleep(1000);
          } catch {
            console.log('    [Error] Could not recover, skipping remaining listings');
            break;
          }
        }
        continue;
      }
    }

    // City summary
    console.log(`\n  [${city}] Done: ${result.total} restaurants, ${result.withEmail} emails, ${result.withWebsite} websites`);

    await page.close();
    return result;

  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    console.log(`  [FATAL] ${city}: ${msg}`);
    result.status = 'failed';
    result.error = msg;
    try { await page.close(); } catch { /* ignore */ }
    return result;
  }
}

// ── Main flow ────────────────────────────────────────────────────
async function main(): Promise<void> {
  const args = process.argv.slice(2);

  if (args.includes('--help') || args.includes('-h')) {
    console.log(`
  RestauMargin — Google Maps National Restaurant Scraper
  ========================================================

  Scrapes restaurants from Google Maps across 50+ French cities.
  Extracts restaurant info + visits websites to find email addresses.

  Usage:
    npx tsx scripts/scrape-gmaps.ts --city <city>         Scrape a single city
    npx tsx scripts/scrape-gmaps.ts --all                 Scrape ALL French cities
    npx tsx scripts/scrape-gmaps.ts --all --headless false Show browser window

  Options:
    --city <name>     Scrape a specific city (e.g., "montpellier", "Paris 11e")
    --all             Scrape all ${FRENCH_CITIES.length} French cities nationally
    --limit N         Max restaurants per city (default: unlimited)
    --headless false  Show the browser window (useful for debugging)
    --help            Show this help message

  Output:
    docs/campaigns/national-contacts.csv

  Cities covered (${FRENCH_CITIES.length}):
    Paris (20 arrondissements) + ${FRENCH_CITIES.length - 20} major cities
    `);
    process.exit(0);
  }

  // Parse flags
  const isAll = args.includes('--all');
  const cityIdx = args.indexOf('--city');
  const singleCity = cityIdx !== -1 ? args[cityIdx + 1] : null;

  if (!isAll && !singleCity) {
    // Backward compatibility: first non-flag argument is city name
    const firstArg = args.find(a => !a.startsWith('--'));
    if (firstArg) {
      return runScraper([firstArg], args);
    }
    console.error('  Error: Specify --city <name> or --all. Use --help for usage.');
    process.exit(1);
  }

  const cities = isAll ? FRENCH_CITIES : [singleCity!];
  return runScraper(cities, args);
}

async function runScraper(cities: string[], args: string[]): Promise<void> {
  // Parse --limit
  const limitIdx = args.indexOf('--limit');
  const limit = limitIdx !== -1 ? parseInt(args[limitIdx + 1], 10) || Infinity : Infinity;

  // Parse --headless
  const headlessIdx = args.indexOf('--headless');
  const headless = headlessIdx !== -1 ? args[headlessIdx + 1] !== 'false' : true;

  console.log(`\n${'#'.repeat(60)}`);
  console.log(`  RestauMargin — National Google Maps Scraper`);
  console.log(`  Cities: ${cities.length}`);
  console.log(`  Limit per city: ${limit === Infinity ? 'unlimited' : limit}`);
  console.log(`  Mode: ${headless ? 'headless' : 'visible browser'}`);
  console.log(`${'#'.repeat(60)}\n`);

  // Initialize CSV
  ensureNationalCSV();

  // Load existing contacts for deduplication
  const existingNames = loadExistingContacts();

  // Launch browser once for all cities
  console.log('  [Browser] Launching Chrome...');
  const browser = await puppeteer.launch({
    headless: headless ? true : false,
    executablePath: CHROME_PATH,
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-dev-shm-usage',
      '--disable-gpu',
      '--window-size=1280,900',
      '--lang=fr-FR',
    ],
    defaultViewport: { width: 1280, height: 900 },
  });

  const allResults: CityResult[] = [];
  const failedCities: string[] = [];

  try {
    for (let i = 0; i < cities.length; i++) {
      const city = cities[i];
      console.log(`\n  >>> City ${i + 1}/${cities.length}: ${city}`);

      let cityResult: CityResult | null = null;

      // Retry logic
      for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
        if (attempt > 0) {
          console.log(`  [Retry] Attempt ${attempt + 1} for ${city}`);
          await sleep(5000); // Wait before retry
        }

        cityResult = await scrapeCity(browser, city, limit, existingNames);

        if (cityResult.status === 'success') {
          break;
        }

        console.log(`  [Retry] ${city} failed: ${cityResult.error || 'unknown error'}`);
      }

      allResults.push(cityResult!);

      if (cityResult!.status === 'failed') {
        failedCities.push(city);
      }

      // Small delay between cities to avoid rate limiting
      if (i < cities.length - 1) {
        const delay = 3000 + Math.random() * 4000;
        console.log(`  [Wait] ${Math.round(delay / 1000)}s before next city...`);
        await sleep(delay);
      }
    }
  } finally {
    await browser.close();
    console.log('\n  [Browser] Closed.');
  }

  // ── Final Summary ────────────────────────────────────────────
  const totalRestaurants = allResults.reduce((sum, r) => sum + r.total, 0);
  const totalEmails = allResults.reduce((sum, r) => sum + r.withEmail, 0);
  const totalWebsites = allResults.reduce((sum, r) => sum + r.withWebsite, 0);
  const successCities = allResults.filter(r => r.status === 'success').length;

  console.log(`\n${'#'.repeat(60)}`);
  console.log(`  NATIONAL SCRAPING COMPLETE`);
  console.log(`${'#'.repeat(60)}`);
  console.log(`  Cities scraped: ${successCities}/${cities.length}`);
  console.log(`  Total restaurants: ${totalRestaurants}`);
  console.log(`  With website: ${totalWebsites}`);
  console.log(`  With email: ${totalEmails}`);
  console.log(`  Email rate: ${totalRestaurants > 0 ? Math.round(totalEmails / totalRestaurants * 100) : 0}%`);
  console.log(`  Output: ${NATIONAL_CSV_PATH}`);

  if (failedCities.length > 0) {
    console.log(`\n  FAILED CITIES (${failedCities.length}):`);
    for (const fc of failedCities) {
      console.log(`    - ${fc}`);
    }
  }

  console.log(`\n  Per-city breakdown:`);
  for (const r of allResults) {
    const statusIcon = r.status === 'success' ? '[OK]' : '[FAIL]';
    console.log(`    ${statusIcon} ${r.city}: ${r.total} restaurants, ${r.withEmail} emails`);
  }
  console.log(`${'#'.repeat(60)}\n`);

  // Save summary JSON
  const summaryDir = path.join(__dirname, '..', 'data', 'scraping');
  if (!fs.existsSync(summaryDir)) fs.mkdirSync(summaryDir, { recursive: true });
  const timestamp = new Date().toISOString().slice(0, 10);
  const summaryFile = path.join(summaryDir, `national-summary-${timestamp}.json`);
  fs.writeFileSync(summaryFile, JSON.stringify({
    date: timestamp,
    citiesScraped: successCities,
    citiesTotal: cities.length,
    totalRestaurants,
    withWebsite: totalWebsites,
    withEmail: totalEmails,
    emailRate: totalRestaurants > 0 ? `${Math.round(totalEmails / totalRestaurants * 100)}%` : '0%',
    failedCities,
    perCity: allResults,
    outputFile: NATIONAL_CSV_PATH,
  }, null, 2), 'utf-8');
  console.log(`  Summary saved: ${summaryFile}`);
}

main().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});
