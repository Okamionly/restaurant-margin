#!/usr/bin/env node
/**
 * scrape-multi-country.mjs
 *
 * Scrape multi-pays : Suisse Romande + Belgique francophone
 * Réutilise la logique de scrape-france-extended mais avec villes etrangeres.
 *
 * Output : data/scraping/multi-country-2026-05-08.csv
 *
 * Usage : node scripts/scrape-multi-country.mjs
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

const PAUSE_BETWEEN_CITIES = 30 * 1000;

// === Suisse Romande ===
const SUISSE_ROMANDE = [
  'Genève', 'Lausanne', 'Sion', 'Fribourg', 'Neuchâtel',
  'La Chaux-de-Fonds', 'Vevey', 'Montreux', 'Bulle', 'Yverdon-les-Bains',
  'Nyon', 'Morges', 'Pully', 'Renens', 'Carouge',
  'Vernier', 'Onex', 'Meyrin', 'Martigny', 'Monthey',
  'Delémont', 'Le Locle', 'Gland',
];

// === Belgique francophone (Wallonie + Bruxelles) ===
const BELGIQUE_FR = [
  'Bruxelles', 'Liège', 'Charleroi', 'Namur', 'Mons',
  'La Louvière', 'Tournai', 'Verviers', 'Mouscron', 'Arlon',
  'Wavre', 'Nivelles', 'Ottignies-Louvain-la-Neuve', 'Marche-en-Famenne',
  'Bastogne', 'Dinant', 'Spa', 'Huy', 'Waterloo',
  'Ixelles', 'Uccle', 'Etterbeek', 'Saint-Gilles',
];

const TARGETS = [
  ...SUISSE_ROMANDE.map(c => ({ city: c, country: 'Suisse' })),
  ...BELGIQUE_FR.map(c => ({ city: c, country: 'Belgique' })),
];

const QUERIES = [
  'restaurant',
  'pizzeria',
  'brasserie',
  'bistrot',
  'restaurant gastronomique',
  'restaurant italien',
];

const TODAY = new Date().toISOString().slice(0, 10);
const OUT_PATH = path.join(ROOT, 'data', 'scraping', `multi-country-${TODAY}.csv`);
const STATE_PATH = path.join(ROOT, 'data', 'scraping', `multi-country-${TODAY}.state.json`);
const HEADER = 'restaurant_name;cuisine_type;email;phone;address;website;city;country;query;scraped_at';

function loadState() {
  if (fs.existsSync(STATE_PATH)) {
    try { return JSON.parse(fs.readFileSync(STATE_PATH, 'utf8')); } catch {}
  }
  return { done: [], totalRestaurants: 0 };
}
function saveState(s) { fs.writeFileSync(STATE_PATH, JSON.stringify(s, null, 2)); }
function appendCsvRow(r) {
  const row = [r.name, r.category, r.email || '', r.phone || '', r.address || '', r.website || '', r.city, r.country, r.query, r.scrapedAt]
    .map(v => (v || '').replace(/[;\n\r]/g, ' ').trim())
    .join(';');
  fs.appendFileSync(OUT_PATH, row + '\n');
}

async function handleCookieConsent(page) {
  try {
    await page.waitForSelector('button[aria-label*="Accepter"], button[aria-label*="Tout accepter"], button[aria-label*="Accept"]', { timeout: 5000 });
    await page.click('button[aria-label*="Accepter"], button[aria-label*="Tout accepter"], button[aria-label*="Accept"]');
    await sleep(1500);
  } catch {}
}

async function scrollResults(page, iterations = 8) {
  for (let i = 0; i < iterations; i++) {
    await page.evaluate(() => {
      const feed = document.querySelector('[role="feed"]');
      if (feed) feed.scrollTop = feed.scrollHeight;
    });
    await sleep(1500);
  }
}

async function fetchEmailFromWebsite(page, url) {
  try {
    await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 12000 });
    const text = await page.evaluate(() => document.body.innerText);
    const matches = text.match(EMAIL_REGEX) || [];
    const valid = matches.filter(e =>
      !e.includes('noreply') && !e.includes('no-reply') &&
      !e.includes('@sentry.io') && !e.includes('@example.com') &&
      !e.includes('@wixpress.com') &&
      !/(\.png|\.jpg|\.jpeg|\.gif|\.svg|\.webp)$/i.test(e)
    );
    if (valid.length === 0) {
      try {
        const contactUrl = new URL('contact', url).toString();
        await page.goto(contactUrl, { waitUntil: 'domcontentloaded', timeout: 8000 });
        const t2 = await page.evaluate(() => document.body.innerText);
        const m2 = t2.match(EMAIL_REGEX) || [];
        const v2 = m2.filter(e => !e.includes('noreply') && !/(\.png|\.jpg|\.jpeg|\.gif|\.svg|\.webp)$/i.test(e));
        if (v2.length === 0) return '';
        const priority = ['contact@', 'info@', 'hello@', 'reservation@', 'reservations@'];
        for (const p of priority) { const m = v2.find(e => e.toLowerCase().startsWith(p)); if (m) return m; }
        return v2[0];
      } catch { return ''; }
    }
    const priority = ['contact@', 'info@', 'hello@', 'reservation@', 'reservations@'];
    for (const p of priority) { const m = valid.find(e => e.toLowerCase().startsWith(p)); if (m) return m; }
    return valid[0];
  } catch { return ''; }
}

async function scrapeQuery(browser, query, city, country, alreadyFoundNames) {
  const page = await browser.newPage();
  await page.setUserAgent(USER_AGENT);
  await page.setExtraHTTPHeaders({ 'Accept-Language': 'fr-FR,fr;q=0.9' });

  const results = [];
  try {
    const fullQuery = `${query} ${city} ${country}`;
    const url = `https://www.google.com/maps/search/${encodeURIComponent(fullQuery)}`;
    await page.goto(url, { waitUntil: 'networkidle2', timeout: 45000 });
    await handleCookieConsent(page);

    if (!page.url().includes('google.com/maps')) {
      await page.goto(url, { waitUntil: 'networkidle2', timeout: 30000 });
      await sleep(2000);
    }

    try {
      await page.waitForSelector('[role="feed"]', { timeout: 12000 });
    } catch {
      await page.close();
      return results;
    }

    await scrollResults(page, 6);

    const items = await page.evaluate(() => {
      const cards = Array.from(document.querySelectorAll('a.hfpxzc'));
      return cards.map(c => ({ name: c.getAttribute('aria-label') || '', href: c.href })).filter(x => x.name);
    });

    for (let i = 0; i < Math.min(items.length, 50); i++) {
      const item = items[i];
      const nameKey = item.name.toLowerCase().trim();
      if (alreadyFoundNames.has(nameKey)) continue;
      try {
        await page.goto(item.href, { waitUntil: 'networkidle2', timeout: 18000 });
        await sleep(500);
        const detail = await page.evaluate(() => {
          const text = document.body.innerText;
          const phoneMatch = text.match(/(\+?(?:33|41|32)|0)\s?\d(?:[\s.-]?\d{2}){4}/);
          const websiteEl = Array.from(document.querySelectorAll('a[data-item-id*="authority"], a[href^="http"]:not([href*="google"]):not([href*="maps"])')).find(a => a.textContent && a.href.startsWith('http'));
          const addrEl = document.querySelector('[data-item-id="address"]');
          const catEl = document.querySelector('[jsaction*="category"]');
          return {
            phone: phoneMatch ? phoneMatch[0] : '',
            website: websiteEl ? websiteEl.href : '',
            address: addrEl ? (addrEl.getAttribute('aria-label')?.replace('Adresse:', '').trim() || '') : '',
            category: catEl ? catEl.textContent.trim() : '',
          };
        });
        results.push({
          name: item.name, phone: detail.phone, website: detail.website,
          address: detail.address, category: detail.category, city, country, query,
        });
        alreadyFoundNames.add(nameKey);
      } catch {}
    }
  } catch (e) {
    console.log(`  [${query} ${city}] FAIL ${e.message.slice(0, 60)}`);
  } finally {
    try { await page.close(); } catch {}
  }
  return results;
}

async function main() {
  console.log('=== Multi-Country Scraping (Suisse + Belgique) ===');
  console.log(`Targets: ${TARGETS.length} villes (${SUISSE_ROMANDE.length} CH + ${BELGIQUE_FR.length} BE)`);
  console.log(`Queries: ${QUERIES.length}/ville`);
  console.log(`Output: ${OUT_PATH}`);

  if (!fs.existsSync(CHROME_PATH)) {
    console.error('ERROR: Chrome introuvable.');
    process.exit(1);
  }

  if (!fs.existsSync(OUT_PATH)) {
    fs.mkdirSync(path.dirname(OUT_PATH), { recursive: true });
    fs.writeFileSync(OUT_PATH, HEADER + '\n');
  }

  const state = loadState();
  console.log(`Existing : ${state.done.length} villes faites, ${state.totalRestaurants} restos`);

  const targets = TARGETS.filter(t => !state.done.includes(`${t.city} ${t.country}`));
  console.log(`A faire : ${targets.length}`);

  if (targets.length === 0) {
    console.log('Toutes les villes faites. Stop.');
    return;
  }

  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-blink-features=AutomationControlled'],
  });

  for (const target of targets) {
    console.log(`\n${'='.repeat(60)}`);
    console.log(`  ${target.city} (${target.country})`);
    console.log(`${'='.repeat(60)}`);

    const cityResults = new Map();
    const alreadyFoundNames = new Set();

    for (const query of QUERIES) {
      console.log(`  > ${query} ${target.city} ${target.country}`);
      const results = await scrapeQuery(browser, query, target.city, target.country, alreadyFoundNames);
      console.log(`    ${results.length} nouveaux`);
      for (const r of results) {
        cityResults.set(r.name.toLowerCase().trim(), r);
      }
      await sleep(2500);
    }

    console.log(`  -> ${cityResults.size} restos uniques. Extraction emails...`);
    const emailPage = await browser.newPage();
    await emailPage.setUserAgent(USER_AGENT);
    let withEmail = 0;
    for (const [, r] of cityResults) {
      if (!r.website) continue;
      const email = await fetchEmailFromWebsite(emailPage, r.website);
      if (email) {
        r.email = email;
        withEmail++;
      }
      await sleep(500);
    }
    try { await emailPage.close(); } catch {}

    let written = 0;
    for (const [, r] of cityResults) {
      r.scrapedAt = new Date().toISOString();
      appendCsvRow(r);
      written++;
    }

    state.done.push(`${target.city} ${target.country}`);
    state.totalRestaurants += written;
    saveState(state);

    console.log(`  ${target.city} DONE: ${written} restos | ${withEmail} avec email`);

    if (target !== targets[targets.length - 1]) {
      console.log(`  Pause ${PAUSE_BETWEEN_CITIES / 1000}s...`);
      await sleep(PAUSE_BETWEEN_CITIES);
    }
  }

  await browser.close();

  console.log(`\n=== TERMINE ===`);
  console.log(`Total villes : ${state.done.length}`);
  console.log(`Total restos : ${state.totalRestaurants}`);
  console.log(`CSV : ${OUT_PATH}`);
}

main().catch(e => { console.error('FATAL:', e); process.exit(1); });
