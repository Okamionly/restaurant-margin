#!/usr/bin/env node
/**
 * scrape-michelin-france.mjs
 *
 * Recolte les restaurants etoiles Michelin France via Wikipedia (liste
 * publique, mise a jour annuellement) puis enrichit avec emails depuis
 * les sites web de chaque resto.
 *
 * Sources :
 * - Wikipedia FR : https://fr.wikipedia.org/wiki/Liste_des_restaurants_%C3%A9toil%C3%A9s_par_le_Guide_Michelin_en_France
 * - Le Chef.com (top etoiles)
 * - Backup : Google "restaurant 3 etoiles michelin france 2026 liste"
 *
 * Output : data/scraping/michelin-france-{date}.csv
 *
 * Usage : node scripts/scrape-michelin-france.mjs
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

const TODAY = new Date().toISOString().slice(0, 10);
const OUT_PATH = path.join(ROOT, 'data', 'scraping', `michelin-france-${TODAY}.csv`);
const HEADER = 'restaurant_name;stars;chef;city;email;phone;website;source;scraped_at';

const WIKIPEDIA_URLS = [
  // Liste 3 etoiles
  'https://fr.wikipedia.org/wiki/Liste_des_restaurants_trois_%C3%A9toiles_du_Guide_Michelin',
  // Liste etoiles France
  'https://fr.wikipedia.org/wiki/Liste_des_restaurants_%C3%A9toil%C3%A9s_par_le_Guide_Michelin_en_France',
];

async function fetchEmailAndDetails(page, url) {
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

    let email = '';
    if (valid.length > 0) {
      const priority = ['contact@', 'reservation@', 'reservations@', 'info@', 'restaurant@', 'commercial@'];
      for (const p of priority) {
        const m = valid.find(e => e.toLowerCase().startsWith(p));
        if (m) { email = m; break; }
      }
      if (!email) email = valid[0];
    }

    if (!email) {
      // Try contact page
      try {
        const contactUrl = new URL('contact', url).toString();
        await page.goto(contactUrl, { waitUntil: 'domcontentloaded', timeout: 8000 });
        const t2 = await page.evaluate(() => document.body.innerText);
        const m2 = t2.match(EMAIL_REGEX) || [];
        const v2 = m2.filter(e => !e.includes('noreply') && !/(\.png|\.jpg|\.jpeg|\.gif)$/i.test(e));
        if (v2.length > 0) email = v2[0];
      } catch {}
    }

    // Extract phone aussi
    const phoneMatch = text.match(/\+?33[\s.-]?\d(?:[\s.-]?\d{2}){4}|\b0[1-9](?:[\s.-]?\d{2}){4}\b/);

    return { email, phone: phoneMatch ? phoneMatch[0] : '' };
  } catch {
    return { email: '', phone: '' };
  }
}

async function scrapeWikipediaList(page, url) {
  console.log(`  [Wiki] ${url}`);
  await page.goto(url, { waitUntil: 'networkidle2', timeout: 30000 });
  await sleep(1500);

  // Extract restaurants depuis tables/listes
  const items = await page.evaluate(() => {
    const results = [];

    // Strategie 1 : tableaux wikitable
    document.querySelectorAll('table.wikitable tbody tr').forEach(tr => {
      const cells = tr.querySelectorAll('td');
      if (cells.length < 2) return;
      // Premier link = nom resto, autres cellules = ville/chef/etoiles
      const nameLink = cells[0]?.querySelector('a, b') || cells[0];
      const name = nameLink?.textContent.trim();
      if (!name || name.length < 3 || name.length > 100) return;
      const cityCell = Array.from(cells).slice(1).find(c => c.textContent.match(/[A-Z]/));
      const city = cityCell?.textContent.trim().split('\n')[0] || '';
      results.push({ name, city, source: 'wikipedia-table' });
    });

    // Strategie 2 : listes a puces (ul li)
    document.querySelectorAll('div.mw-parser-output ul li').forEach(li => {
      const link = li.querySelector('a');
      if (!link) return;
      const text = li.textContent.trim();
      // Pattern : "Nom restaurant, Ville (Departement)"
      const m = text.match(/^([^,(]+?)\s*[,(]\s*([^,()]+)/);
      if (!m) return;
      const name = m[1].trim();
      const city = m[2].trim();
      if (name.length < 3 || name.length > 100) return;
      results.push({ name, city, source: 'wikipedia-list' });
    });

    return results;
  });

  console.log(`  [Wiki] ${items.length} restaurants extraits`);
  return items;
}

async function findWebsiteOnGoogle(page, query) {
  try {
    await page.goto(`https://www.google.com/search?q=${encodeURIComponent(query)}`, { waitUntil: 'domcontentloaded', timeout: 15000 });
    await sleep(800);

    // Accept cookies si present
    try {
      await page.click('button[aria-label*="Accepter"], button[aria-label*="Accept all"]', { timeout: 2000 });
      await sleep(800);
    } catch {}

    const url = await page.evaluate(() => {
      // Premier lien organique (skip ads/maps)
      const links = Array.from(document.querySelectorAll('a[href]'));
      for (const a of links) {
        const href = a.href;
        if (!href.startsWith('http')) continue;
        if (href.includes('google.com')) continue;
        if (href.includes('maps.google')) continue;
        if (href.includes('youtube.com')) continue;
        if (href.includes('facebook.com')) continue;
        if (href.includes('instagram.com')) continue;
        if (href.includes('tripadvisor')) continue;
        if (href.includes('michelin.com')) continue;
        if (href.includes('wikipedia.org')) continue;
        if (href.includes('thefork')) continue;
        return href;
      }
      return '';
    });
    return url;
  } catch {
    return '';
  }
}

function appendCsvRow(r) {
  const row = [r.name, r.stars || '', r.chef || '', r.city, r.email || '', r.phone || '', r.website || '', r.source || '', r.scrapedAt]
    .map(v => (v || '').replace(/[;\n\r]/g, ' ').trim())
    .join(';');
  fs.appendFileSync(OUT_PATH, row + '\n');
}

async function main() {
  console.log('=== Michelin France Scraping ===');

  if (!fs.existsSync(CHROME_PATH)) {
    console.error('ERROR: Chrome introuvable.');
    process.exit(1);
  }

  if (!fs.existsSync(OUT_PATH)) {
    fs.mkdirSync(path.dirname(OUT_PATH), { recursive: true });
    fs.writeFileSync(OUT_PATH, HEADER + '\n');
  }

  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });

  const page = await browser.newPage();
  await page.setUserAgent(USER_AGENT);
  await page.setExtraHTTPHeaders({ 'Accept-Language': 'fr-FR,fr;q=0.9' });

  // Phase 1 : Wikipedia
  const all = new Map();
  for (const url of WIKIPEDIA_URLS) {
    try {
      const items = await scrapeWikipediaList(page, url);
      for (const it of items) {
        const key = it.name.toLowerCase().trim();
        if (!all.has(key)) all.set(key, it);
      }
    } catch (e) {
      console.log(`  Erreur ${url}: ${e.message}`);
    }
  }

  console.log(`\nTotal restaurants etoiles uniques: ${all.size}`);
  console.log('\nPhase 2 : recherche websites + emails...\n');

  let processed = 0;
  let withEmail = 0;
  for (const [key, r] of all) {
    processed++;
    process.stdout.write(`  [${processed}/${all.size}] ${r.name.slice(0, 35).padEnd(35)} `);

    // Find website
    const website = await findWebsiteOnGoogle(page, `${r.name} ${r.city} site officiel`);
    r.website = website;

    if (website) {
      const { email, phone } = await fetchEmailAndDetails(page, website);
      r.email = email;
      r.phone = phone;
      if (email) withEmail++;
    }

    r.scrapedAt = new Date().toISOString();
    appendCsvRow(r);
    console.log(`-> ${r.email || '(no email)'}`);

    await sleep(1500);
  }

  await browser.close();

  console.log(`\n=== TERMINE ===`);
  console.log(`Total: ${all.size} | Avec email: ${withEmail}`);
  console.log(`CSV: ${OUT_PATH}`);
}

main().catch(e => {
  console.error('FATAL:', e);
  process.exit(1);
});
