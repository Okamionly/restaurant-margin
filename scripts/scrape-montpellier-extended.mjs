#!/usr/bin/env node
/**
 * scrape-montpellier-extended.mjs
 *
 * Etend la base de contacts Montpellier en lancant scrape-gmaps avec
 * plusieurs queries differentes pour mieux couvrir le marche local.
 *
 * Queries lancees :
 * - "pizzeria montpellier"
 * - "brasserie montpellier"
 * - "bistrot montpellier"
 * - "restaurant gastronomique montpellier"
 * - "restaurant asiatique montpellier"
 * - "restaurant italien montpellier"
 * - "creperie montpellier"
 *
 * Output : docs/campaigns/montpellier-v3-leads.csv (combine + dedupe)
 *
 * Usage :
 *   node scripts/scrape-montpellier-extended.mjs
 */

import puppeteer from 'puppeteer-core';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT = path.join(__dirname, '..');

const CHROME_PATH = process.env.CHROME_PATH || 'C:/Program Files/Google/Chrome/Application/chrome.exe';
const USER_AGENT = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36';
const EMAIL_REGEX = /[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}/g;
const sleep = (ms) => new Promise(r => setTimeout(r, ms));

const QUERIES = [
  'pizzeria montpellier',
  'brasserie montpellier',
  'bistrot montpellier',
  'restaurant gastronomique montpellier',
  'restaurant asiatique montpellier',
  'restaurant italien montpellier',
  'creperie montpellier',
  'restaurant antigone montpellier',
  'restaurant port marianne montpellier',
];

async function handleCookieConsent(page) {
  try {
    await page.waitForSelector('button[aria-label*="Accepter"], button[aria-label*="Tout accepter"], button[aria-label*="Accept"]', { timeout: 5000 });
    await page.click('button[aria-label*="Accepter"], button[aria-label*="Tout accepter"], button[aria-label*="Accept"]');
    await sleep(1500);
  } catch {
    // Pas de consent screen, OK
  }
}

async function scrollResults(page, iterations = 12) {
  for (let i = 0; i < iterations; i++) {
    await page.evaluate(() => {
      const feed = document.querySelector('[role="feed"]');
      if (feed) feed.scrollTop = feed.scrollHeight;
    });
    await sleep(1500);
  }
}

async function scrapeQuery(browser, query) {
  console.log(`\n[${query}] Starting...`);
  const page = await browser.newPage();
  await page.setUserAgent(USER_AGENT);
  await page.setExtraHTTPHeaders({ 'Accept-Language': 'fr-FR,fr;q=0.9' });

  const results = [];
  try {
    const url = `https://www.google.com/maps/search/${encodeURIComponent(query)}`;
    await page.goto(url, { waitUntil: 'networkidle2', timeout: 45000 });
    await handleCookieConsent(page);

    if (!page.url().includes('google.com/maps')) {
      await page.goto(url, { waitUntil: 'networkidle2', timeout: 30000 });
      await sleep(2000);
    }

    try {
      await page.waitForSelector('[role="feed"]', { timeout: 15000 });
    } catch {
      console.log(`  [${query}] Pas de feed, skip.`);
      await page.close();
      return results;
    }

    await scrollResults(page);

    // Extract restaurant cards
    const items = await page.evaluate(() => {
      const cards = Array.from(document.querySelectorAll('a.hfpxzc'));
      return cards.map(c => ({
        name: c.getAttribute('aria-label') || '',
        href: c.href,
      })).filter(x => x.name);
    });

    console.log(`  [${query}] ${items.length} cartes trouvees, extraction details...`);

    for (let i = 0; i < Math.min(items.length, 60); i++) {
      const item = items[i];
      try {
        await page.goto(item.href, { waitUntil: 'networkidle2', timeout: 20000 });
        await sleep(800);
        const detail = await page.evaluate(() => {
          const text = document.body.innerText;
          // Phone: format francais
          const phoneMatch = text.match(/0[1-9](?:[\s.-]?\d{2}){4}/);
          // Website: lien externe (skip google domains)
          const websiteEl = Array.from(document.querySelectorAll('a[data-item-id*="authority"], a[href^="http"]:not([href*="google"]):not([href*="maps"])')).find(a => a.textContent && a.href.startsWith('http'));
          // Address: data-item-id="address"
          const addrEl = document.querySelector('[data-item-id="address"]');
          // Category
          const catEl = document.querySelector('[jsaction*="category"]');
          return {
            phone: phoneMatch ? phoneMatch[0] : '',
            website: websiteEl ? websiteEl.href : '',
            address: addrEl ? (addrEl.getAttribute('aria-label')?.replace('Adresse:', '').trim() || '') : '',
            category: catEl ? catEl.textContent.trim() : '',
          };
        });
        results.push({
          name: item.name,
          phone: detail.phone,
          website: detail.website,
          address: detail.address,
          category: detail.category,
          query,
        });
      } catch (e) {
        console.log(`    [${i}/${items.length}] Skip ${item.name.slice(0, 30)}: ${e.message.slice(0, 50)}`);
      }
    }
  } catch (e) {
    console.log(`  [${query}] FAILED: ${e.message.slice(0, 100)}`);
  } finally {
    await page.close();
  }

  console.log(`  [${query}] -> ${results.length} restaurants`);
  return results;
}

async function fetchEmailFromWebsite(page, url) {
  try {
    await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 12000 });
    const text = await page.evaluate(() => document.body.innerText);
    const matches = text.match(EMAIL_REGEX) || [];
    // Privilegier contact@ ou info@ et exclure noreply
    const emails = matches.filter(e =>
      !e.includes('noreply') &&
      !e.includes('no-reply') &&
      !e.includes('@sentry.io') &&
      !e.includes('@example.com') &&
      !e.includes('.png') &&
      !e.includes('.jpg') &&
      !e.includes('.jpeg')
    );
    if (emails.length === 0) {
      // Try contact page
      try {
        const contactUrl = new URL('contact', url).toString();
        await page.goto(contactUrl, { waitUntil: 'domcontentloaded', timeout: 8000 });
        const t2 = await page.evaluate(() => document.body.innerText);
        const m2 = t2.match(EMAIL_REGEX) || [];
        return m2.find(e => !e.includes('noreply') && !e.includes('no-reply')) || '';
      } catch { return ''; }
    }
    // Priorite : contact@, info@, hello@
    const priority = ['contact@', 'info@', 'hello@', 'reservation@'];
    for (const p of priority) {
      const match = emails.find(e => e.toLowerCase().startsWith(p));
      if (match) return match;
    }
    return emails[0];
  } catch {
    return '';
  }
}

async function main() {
  console.log('=== Montpellier Extended Scraping ===');
  console.log(`Queries: ${QUERIES.length}`);
  console.log(`Chrome: ${CHROME_PATH}`);

  if (!fs.existsSync(CHROME_PATH)) {
    console.error(`ERROR: Chrome introuvable a ${CHROME_PATH}`);
    process.exit(1);
  }

  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-blink-features=AutomationControlled'],
  });

  const all = new Map();
  for (const query of QUERIES) {
    const results = await scrapeQuery(browser, query);
    for (const r of results) {
      // Dedupe par nom (lowercase)
      const key = r.name.toLowerCase().trim();
      if (!all.has(key) || (!all.get(key).website && r.website)) {
        all.set(key, r);
      }
    }
    await sleep(2000);
  }

  console.log(`\n=== Total uniques: ${all.size} ===`);

  // Phase 2 : extraire emails depuis les websites
  console.log('\n=== Extracting emails from websites ===');
  const page = await browser.newPage();
  await page.setUserAgent(USER_AGENT);

  let withEmail = 0;
  let i = 0;
  for (const [key, r] of all) {
    i++;
    if (!r.website) continue;
    process.stdout.write(`  [${i}/${all.size}] ${r.name.slice(0, 30).padEnd(30)} `);
    const email = await fetchEmailFromWebsite(page, r.website);
    if (email) {
      r.email = email;
      withEmail++;
      console.log(`-> ${email}`);
    } else {
      console.log('(no email)');
    }
    await sleep(800);
  }

  await browser.close();

  // Filter: Montpellier only (address contains 34000-34999)
  const montpellier = [...all.values()].filter(r =>
    r.address && /34\d{3}/.test(r.address)
  );

  console.log(`\n=== Filtered Montpellier (CP 34xxx): ${montpellier.length} ===`);
  console.log(`=== Avec email: ${montpellier.filter(r => r.email).length} ===`);

  // Output CSV
  const outPath = path.join(ROOT, 'docs', 'campaigns', 'montpellier-v3-leads.csv');
  const header = 'restaurant_name;cuisine_type;email;phone;address;website;query';
  const rows = montpellier.map(r => [
    r.name.replace(/;/g, ','),
    (r.category || '').replace(/;/g, ','),
    r.email || '',
    r.phone || '',
    (r.address || '').replace(/;/g, ','),
    r.website || '',
    r.query || '',
  ].join(';'));
  fs.writeFileSync(outPath, [header, ...rows].join('\n') + '\n');

  console.log(`\nOutput: ${outPath}`);
  console.log(`\n=== DONE ===`);
}

main().catch(e => {
  console.error('FATAL:', e);
  process.exit(1);
});
