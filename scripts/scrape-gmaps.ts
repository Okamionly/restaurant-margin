#!/usr/bin/env npx tsx
// ============================================================
// RestauMargin — Google Maps Restaurant Scraper (Puppeteer)
// Scrapes ALL restaurants in a city from Google Maps,
// extracts website URLs, then visits each website to find emails.
//
// Usage:
//   npx tsx scripts/scrape-gmaps.ts <city> [--limit N] [--headless false]
//
// Examples:
//   npx tsx scripts/scrape-gmaps.ts montpellier
//   npx tsx scripts/scrape-gmaps.ts marseille --limit 50
//   npx tsx scripts/scrape-gmaps.ts lyon --headless false
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

// ── Config ─────────────────────────────────────────────────────────
const RATE_LIMIT_MS = 2000;
const EMAIL_REGEX = /[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}/g;
const OUTPUT_DIR = path.join(__dirname, '..', 'data', 'scraping');
const USER_AGENT = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36';

// ── Helpers ────────────────────────────────────────────────────────
function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function randomDelay(min: number, max: number): Promise<void> {
  const ms = Math.floor(Math.random() * (max - min + 1)) + min;
  return sleep(ms);
}

function sanitizeCSV(str: string): string {
  if (!str) return '';
  const escaped = str.replace(/"/g, '""');
  return /[,"\n\r]/.test(str) ? `"${escaped}"` : escaped;
}

function initCSV(filePath: string): void {
  const header = 'name,address,phone,website,email,rating,reviewCount,category,city,source,scrapedAt\n';
  fs.writeFileSync(filePath, header, 'utf-8');
}

function appendToCSV(filePath: string, r: GmapsRestaurant): void {
  const line = [
    sanitizeCSV(r.name),
    sanitizeCSV(r.address),
    sanitizeCSV(r.phone),
    sanitizeCSV(r.website),
    sanitizeCSV(r.email),
    sanitizeCSV(r.rating),
    sanitizeCSV(r.reviewCount),
    sanitizeCSV(r.category),
    sanitizeCSV(r.city),
    sanitizeCSV(r.source),
    sanitizeCSV(r.scrapedAt),
  ].join(',');
  fs.appendFileSync(filePath, line + '\n', 'utf-8');
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

// ── Handle Google cookie consent ──────────────────────────────────
async function handleCookieConsent(page: Page): Promise<void> {
  try {
    // Google shows a cookie consent dialog — accept it
    // The button text varies by locale: "Accept all", "Tout accepter", etc.
    const consentSelectors = [
      'button[aria-label="Accept all"]',
      'button[aria-label="Tout accepter"]',
      'button[aria-label="Alle akzeptieren"]',
      'button[aria-label="Aceptar todo"]',
      // Fallback: the "Reject all" / form buttons
      'form[action*="consent"] button:first-of-type',
      // Generic consent button with specific text
      'button.VfPpkd-LgbsSe',
    ];

    for (const selector of consentSelectors) {
      const btn = await page.$(selector);
      if (btn) {
        // Check if it says "accept" or "accepter"
        const text = await btn.evaluate(el => el.textContent || '');
        if (text.toLowerCase().includes('accept') || text.toLowerCase().includes('tout accepter') || text.toLowerCase().includes('akzeptieren')) {
          await btn.click();
          console.log('  [Consent] Cookie dialog accepted');
          await sleep(1500);
          return;
        }
      }
    }

    // Try a broader approach: find any button in the consent form
    const accepted = await page.evaluate(() => {
      const buttons = document.querySelectorAll('button');
      for (const btn of buttons) {
        const text = (btn.textContent || '').toLowerCase();
        if (text.includes('accept') || text.includes('accepter') || text.includes('agree') || text.includes('j\'accepte')) {
          (btn as HTMLButtonElement).click();
          return true;
        }
      }
      return false;
    });

    if (accepted) {
      console.log('  [Consent] Cookie dialog accepted (fallback)');
      await sleep(1500);
    }
  } catch {
    // No consent dialog or already handled
  }
}

// ── Scroll the Google Maps results panel to load all results ──────
async function scrollAndLoadAllResults(page: Page, maxScrolls: number = 150): Promise<number> {
  console.log('  [Scroll] Loading all results...');

  let previousCount = 0;
  let sameCountStreak = 0;
  const maxSameCount = 8; // Stop after 8 scrolls with no new results

  for (let i = 0; i < maxScrolls; i++) {
    // Try ALL possible scroll containers (Google Maps changes DOM frequently)
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

    // Wait longer for lazy loading
    await sleep(2000 + Math.random() * 1500);

    // Count current results with multiple selectors
    const currentCount = await page.evaluate(() => {
      // Try multiple selectors to find restaurant listings
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
      // Fallback: count divs with restaurant-like content
      const feed = document.querySelector('[role="feed"]');
      if (feed) return feed.children.length;
      return 0;
    });

    // Check for "end of list" indicator
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
      // Try clicking "More results" button if it exists
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
      console.log(`  [Scroll] End of results reached at ${currentCount} items`);
      break;
    }

    if (sameCountStreak >= maxSameCount) {
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

    // Name — h1 or the main title
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

    // Website — the authority link
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

// ── Main scraping flow ────────────────────────────────────────────
async function scrapeGmaps(city: string, limit: number, headless: boolean): Promise<void> {
  console.log(`\n${'='.repeat(56)}`);
  console.log(`  Google Maps Restaurant Scraper — ${city}`);
  console.log(`  Limit: ${limit === Infinity ? 'unlimited' : limit}`);
  console.log(`  Mode: ${headless ? 'headless' : 'visible browser'}`);
  console.log(`${'='.repeat(56)}\n`);

  // Ensure output directory
  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  }

  const timestamp = new Date().toISOString().slice(0, 10);
  const csvFile = path.join(OUTPUT_DIR, `gmaps-${city.toLowerCase().replace(/\s+/g, '-')}-${timestamp}.csv`);
  initCSV(csvFile);
  console.log(`  Output: ${csvFile}\n`);

  // Launch browser
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

  const page = await browser.newPage();
  await page.setUserAgent(USER_AGENT);
  await page.setExtraHTTPHeaders({ 'Accept-Language': 'fr-FR,fr;q=0.9,en;q=0.5' });

  try {
    // Navigate to Google Maps search
    const searchQuery = `restaurant ${city}`;
    const searchUrl = `https://www.google.com/maps/search/${encodeURIComponent(searchQuery)}`;
    console.log(`  [Navigate] ${searchUrl}`);
    await page.goto(searchUrl, { waitUntil: 'networkidle2', timeout: 30000 });

    // Handle cookie consent
    await handleCookieConsent(page);
    await sleep(2000);

    // Wait for results to appear
    try {
      await page.waitForSelector('[role="feed"]', { timeout: 15000 });
      console.log('  [Ready] Results feed detected');
    } catch {
      console.log('  [Warning] Could not find results feed. Trying alternative selectors...');
      try {
        await page.waitForSelector('.m6QErb', { timeout: 10000 });
        console.log('  [Ready] Alternative container detected');
      } catch {
        console.log('  [Error] Cannot find Google Maps results. The page may have changed.');
        console.log('  Saving screenshot for debugging...');
        const screenshotPath = path.join(OUTPUT_DIR, `gmaps-debug-${timestamp}.png`);
        await page.screenshot({ path: screenshotPath, fullPage: true });
        console.log(`  Screenshot saved: ${screenshotPath}`);
        await browser.close();
        return;
      }
    }

    // Scroll to load all results
    const totalLoaded = await scrollAndLoadAllResults(page, limit === Infinity ? 100 : Math.min(Math.ceil(limit / 5) + 10, 100));
    console.log(`\n  [Results] Total items loaded: ${totalLoaded}\n`);

    // Collect all listing links from the feed
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

    console.log(`  [Listings] Found ${listingLinks.length} restaurant links to process\n`);

    const allResults: GmapsRestaurant[] = [];
    const seenNames = new Set<string>();
    const effectiveLimit = limit === Infinity ? listingLinks.length : Math.min(limit, listingLinks.length);

    // Process each listing
    for (let i = 0; i < effectiveLimit; i++) {
      const link = listingLinks[i];

      try {
        // Navigate to the listing detail
        console.log(`  [${i + 1}/${effectiveLimit}] Opening: ${link.ariaLabel || link.href.substring(0, 60)}...`);

        // Click on the listing in the feed to open details panel
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

        // Wait for the detail panel to load
        try {
          await page.waitForSelector('h1.DUwDvf, h1', { timeout: 5000 });
        } catch {
          console.log(`    [Skip] Detail panel did not load`);
          continue;
        }

        await sleep(800);

        // Extract info from the detail panel
        const details = await extractRestaurantDetails(page);

        if (!details.name) {
          console.log(`    [Skip] No name found`);
          continue;
        }

        // Skip duplicates
        const nameKey = details.name.toLowerCase();
        if (seenNames.has(nameKey)) {
          console.log(`    [Skip] Duplicate: ${details.name}`);
          continue;
        }
        seenNames.add(nameKey);

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

        // If restaurant has a website, visit it to find email
        if (restaurant.website) {
          await randomDelay(RATE_LIMIT_MS, RATE_LIMIT_MS + 1500);
          const emails = await scrapeWebsiteForEmails(browser, restaurant.website);
          if (emails.length > 0) {
            restaurant.email = emails[0];
            console.log(`    >>> EMAIL FOUND: ${restaurant.email}`);
          }
        }

        // Save incrementally
        allResults.push(restaurant);
        appendToCSV(csvFile, restaurant);

        const emailStr = restaurant.email ? `>>> ${restaurant.email}` : restaurant.website ? 'no email (has website)' : 'no website';
        console.log(`    ${restaurant.name} | ${restaurant.rating || '-'} | ${emailStr}`);

        // Go back to the results list
        await page.evaluate(() => {
          const backBtn = document.querySelector('button[aria-label="Back"], button[aria-label="Retour"], button.hYBQ0b');
          if (backBtn) (backBtn as HTMLButtonElement).click();
        });
        await randomDelay(800, 1500);

      } catch (err) {
        const msg = err instanceof Error ? err.message : String(err);
        console.log(`    [Error] ${msg.substring(0, 100)}`);
        // Try to recover by going back
        try {
          await page.goBack({ waitUntil: 'domcontentloaded', timeout: 5000 });
          await sleep(1000);
        } catch {
          // If goBack fails, try navigating to the search URL again
          try {
            const searchUrl = `https://www.google.com/maps/search/${encodeURIComponent(`restaurant ${city}`)}`;
            await page.goto(searchUrl, { waitUntil: 'networkidle2', timeout: 15000 });
            await sleep(2000);
            await scrollAndLoadAllResults(page, 20);
          } catch {
            console.log('    [Error] Could not recover. Stopping.');
            break;
          }
        }
        continue;
      }
    }

    // ── Summary ──────────────────────────────────────────────────
    const withEmail = allResults.filter(r => r.email);
    const withWebsite = allResults.filter(r => r.website);

    console.log(`\n${'='.repeat(56)}`);
    console.log(`  SCRAPING COMPLETE: ${city}`);
    console.log(`  Total restaurants scraped: ${allResults.length}`);
    console.log(`  With website: ${withWebsite.length}`);
    console.log(`  With email: ${withEmail.length}`);
    console.log(`  Email rate: ${allResults.length > 0 ? Math.round(withEmail.length / allResults.length * 100) : 0}%`);
    console.log(`  CSV saved: ${csvFile}`);
    console.log(`${'='.repeat(56)}\n`);

    // Save summary JSON
    const summaryFile = path.join(OUTPUT_DIR, `gmaps-${city.toLowerCase().replace(/\s+/g, '-')}-${timestamp}-summary.json`);
    fs.writeFileSync(summaryFile, JSON.stringify({
      city,
      date: timestamp,
      totalRestaurants: allResults.length,
      withWebsite: withWebsite.length,
      withEmail: withEmail.length,
      withoutEmail: allResults.length - withEmail.length,
      emailRate: allResults.length > 0 ? `${Math.round(withEmail.length / allResults.length * 100)}%` : '0%',
      csvFile,
      topEmails: withEmail.slice(0, 10).map(r => ({ name: r.name, email: r.email })),
    }, null, 2), 'utf-8');
    console.log(`  Summary: ${summaryFile}`);

  } catch (err) {
    console.error('\n  [FATAL ERROR]', err instanceof Error ? err.message : String(err));
    // Save a debug screenshot
    try {
      const screenshotPath = path.join(OUTPUT_DIR, `gmaps-error-${timestamp}.png`);
      await page.screenshot({ path: screenshotPath, fullPage: true });
      console.log(`  Debug screenshot: ${screenshotPath}`);
    } catch { /* ignore */ }
  } finally {
    await browser.close();
    console.log('  [Browser] Closed.\n');
  }
}

// ── CLI ───────────────────────────────────────────────────────────
async function main(): Promise<void> {
  const args = process.argv.slice(2);

  if (args.length === 0 || args.includes('--help')) {
    console.log(`
  RestauMargin — Google Maps Restaurant Scraper
  ================================================

  Uses Puppeteer (real Chrome browser) to scrape Google Maps.
  Extracts restaurant info + visits websites to find email addresses.

  Usage:
    npx tsx scripts/scrape-gmaps.ts <city> [options]

  Examples:
    npx tsx scripts/scrape-gmaps.ts montpellier
    npx tsx scripts/scrape-gmaps.ts marseille --limit 50
    npx tsx scripts/scrape-gmaps.ts lyon --headless false
    npx tsx scripts/scrape-gmaps.ts "aix-en-provence" --limit 100

  Options:
    --limit N         Max restaurants to scrape (default: unlimited)
    --headless false  Show the browser window (useful for debugging)
    --help            Show this help message

  Output:
    CSV:     data/scraping/gmaps-<city>-<date>.csv
    Summary: data/scraping/gmaps-<city>-<date>-summary.json

  Requirements:
    puppeteer-core must be installed: npm install puppeteer-core
    Uses system Chrome at: C:/Program Files/Google/Chrome/Application/chrome.exe
    Set CHROME_PATH env var to override.
    `);
    process.exit(0);
  }

  const city = args[0];

  // Parse --limit
  const limitIdx = args.indexOf('--limit');
  const limit = limitIdx !== -1 ? parseInt(args[limitIdx + 1], 10) || Infinity : Infinity;

  // Parse --headless
  const headlessIdx = args.indexOf('--headless');
  const headless = headlessIdx !== -1 ? args[headlessIdx + 1] !== 'false' : true;

  await scrapeGmaps(city, limit, headless);
}

main().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});
