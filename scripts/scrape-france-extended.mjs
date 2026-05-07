#!/usr/bin/env node
/**
 * scrape-france-extended.mjs
 *
 * Scraping étendu France : 140 villes × 14 queries cuisines = couverture max.
 *
 * Stratégie :
 * - Reprise du fichier france-mass-2026-05-06.csv (ne pas dupliquer)
 * - Skip villes avec déjà >= 30 restos (déjà bien couvertes)
 * - 14 queries par ville (5 cuisines initiales + 9 nouvelles ethniques)
 * - Pauses 45s entre villes (anti-ban)
 * - Output : data/scraping/france-mass-2026-05-06.csv (append au même fichier)
 *
 * Usage :
 *   node scripts/scrape-france-extended.mjs                    # 140 villes
 *   node scripts/scrape-france-extended.mjs --start 50         # reprend a la 50e
 *   node scripts/scrape-france-extended.mjs --queries 8        # limite queries
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

// ── Args ──────────────────────────────────────────────────────────
const args = process.argv.slice(2);
const getArg = (flag, def = null) => { const i = args.indexOf(flag); return i > -1 ? args[i + 1] : def; };
const START = parseInt(getArg('--start', '0'), 10);
const QUERIES_LIMIT = parseInt(getArg('--queries', '14'), 10);
const PAUSE_BETWEEN_CITIES = parseInt(getArg('--pause', '45'), 10) * 1000;
const MIN_RESTOS_TO_SKIP = parseInt(getArg('--skip-if-min', '30'), 10);

// ── 140 villes France (top 30 + 110 moyennes) ────────────────────
const CITIES = [
  // Paris arrondissements
  'Paris 1er', 'Paris 2e', 'Paris 3e', 'Paris 4e', 'Paris 5e',
  'Paris 6e', 'Paris 7e', 'Paris 8e', 'Paris 9e', 'Paris 10e',
  'Paris 11e', 'Paris 12e', 'Paris 13e', 'Paris 14e', 'Paris 15e',
  'Paris 16e', 'Paris 17e', 'Paris 18e', 'Paris 19e', 'Paris 20e',
  // Top 30 metropoles
  'Marseille', 'Lyon', 'Toulouse', 'Nice', 'Nantes',
  'Montpellier', 'Strasbourg', 'Bordeaux', 'Lille',
  'Rennes', 'Reims', 'Saint-Etienne', 'Toulon', 'Le Havre',
  'Grenoble', 'Dijon', 'Angers', 'Nimes',
  'Aix-en-Provence', 'Clermont-Ferrand', 'Le Mans', 'Brest',
  'Tours', 'Amiens', 'Limoges', 'Perpignan', 'Metz',
  'Besancon', 'Orleans', 'Rouen', 'Caen', 'Nancy',
  // Tourisme/gastronomique (déjà partielles)
  'Cannes', 'Saint-Tropez', 'Biarritz', 'Annecy', 'Chamonix',
  'Avignon', 'Aix-les-Bains', 'Deauville', 'La Rochelle', 'Saint-Malo',
  // ── NOUVEAU : 80 villes moyennes (50-150k hab) ──
  // Ile-de-France banlieue
  'Boulogne-Billancourt', 'Saint-Denis', 'Argenteuil', 'Montreuil',
  'Versailles', 'Nanterre', 'Vitry-sur-Seine', 'Clichy',
  'Courbevoie', 'Asnieres-sur-Seine', 'Colombes', 'Aulnay-sous-Bois',
  'Champigny-sur-Marne', 'Saint-Maur-des-Fosses', 'Cergy',
  'Issy-les-Moulineaux', 'Levallois-Perret', 'Neuilly-sur-Seine',
  // Sud-Est
  'Antibes', 'Cagnes-sur-Mer', 'Frejus', 'Hyeres', 'La Seyne-sur-Mer',
  'Beziers', 'Narbonne', 'Sete', 'Beaucaire', 'Tarbes', 'Pau',
  'Bayonne', 'Anglet', 'Saint-Jean-de-Luz', 'Carcassonne',
  // Sud-Ouest / Centre
  'Albi', 'Cahors', 'Rodez', 'Montauban', 'Agen',
  'Bergerac', 'Perigueux', 'Limoges', 'Brive-la-Gaillarde',
  'Angouleme', 'Niort', 'La Roche-sur-Yon', 'Cholet', 'Saumur',
  // Ouest
  'Lorient', 'Vannes', 'Quimper', 'Saint-Brieuc', 'Lannion',
  'Laval', 'Alencon', 'Cherbourg-en-Cotentin', 'Saint-Lo',
  // Nord
  'Calais', 'Boulogne-sur-Mer', 'Dunkerque', 'Roubaix',
  'Tourcoing', 'Valenciennes', 'Arras', 'Beauvais', 'Compiegne',
  // Est
  'Mulhouse', 'Colmar', 'Belfort', 'Montbeliard', 'Vesoul',
  'Chalons-en-Champagne', 'Troyes', 'Charleville-Mezieres',
  'Verdun', 'Thionville', 'Forbach', 'Sarreguemines',
  'Saint-Die-des-Vosges', 'Epinal',
  // Centre / Bourgogne
  'Auxerre', 'Sens', 'Nevers', 'Vichy', 'Moulins', 'Chartres',
  'Bourges', 'Chateauroux', 'Blois', 'Le Puy-en-Velay',
  // Alpes / Rhône-Alpes
  'Albertville', 'Bourg-en-Bresse', 'Roanne', 'Valence',
  'Romans-sur-Isere', 'Voiron', 'Annonay', 'Aubenas',
];

// ── 14 queries (5 anciennes + 9 nouvelles cuisines ethniques/specialites) ──
const QUERIES = [
  // Originales
  'restaurant',
  'pizzeria',
  'brasserie',
  'bistrot',
  'restaurant gastronomique',
  // NOUVEAU : couverture cuisines ethniques (forte presence en France)
  'restaurant chinois',
  'restaurant japonais',
  'sushi',
  'restaurant marocain',
  'restaurant indien',
  'restaurant turc',
  'kebab',
  'restaurant africain',
  'restaurant libanais',
];

// ── Output (re-utilise le fichier existant) ───────────────────────
const TODAY = '2026-05-06'; // Force la date du fichier source pour append
const OUT_PATH = path.join(ROOT, 'data', 'scraping', `france-mass-${TODAY}.csv`);
const STATE_PATH = path.join(ROOT, 'data', 'scraping', `france-mass-${TODAY}.state.json`);
const HEADER = 'restaurant_name;cuisine_type;email;phone;address;website;city;query;scraped_at';

function loadState() {
  if (fs.existsSync(STATE_PATH)) {
    try { return JSON.parse(fs.readFileSync(STATE_PATH, 'utf8')); } catch {}
  }
  return { done: [], totalRestaurants: 0 };
}
function saveState(s) {
  fs.writeFileSync(STATE_PATH, JSON.stringify(s, null, 2));
}
function appendCsvRow(r) {
  const row = [r.name, r.category, r.email || '', r.phone || '', r.address || '', r.website || '', r.city, r.query, r.scrapedAt]
    .map(v => (v || '').replace(/[;\n\r]/g, ' ').trim())
    .join(';');
  fs.appendFileSync(OUT_PATH, row + '\n');
}

// Charge les noms deja vus (pour eviter doublons inter-villes)
function loadKnownNames() {
  const known = new Set();
  if (!fs.existsSync(OUT_PATH)) return known;
  const lines = fs.readFileSync(OUT_PATH, 'utf8').split('\n').slice(1).filter(l => l.trim());
  for (const l of lines) {
    const name = (l.split(';')[0] || '').toLowerCase().trim();
    if (name) known.add(name);
  }
  return known;
}

// Compte restos par ville pour skip-if-min
function loadCityCounts() {
  const counts = {};
  if (!fs.existsSync(OUT_PATH)) return counts;
  const lines = fs.readFileSync(OUT_PATH, 'utf8').split('\n').slice(1).filter(l => l.trim());
  for (const l of lines) {
    const c = l.split(';')[6] || '';
    counts[c] = (counts[c] || 0) + 1;
  }
  return counts;
}

// ── Scraping helpers ──────────────────────────────────────────────
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
      !e.includes('@wixpress.com') && !e.includes('@gmail-noreply') &&
      !/(\.png|\.jpg|\.jpeg|\.gif|\.svg|\.webp)$/i.test(e)
    );
    if (valid.length === 0) {
      try {
        const contactUrl = new URL('contact', url).toString();
        await page.goto(contactUrl, { waitUntil: 'domcontentloaded', timeout: 8000 });
        const t2 = await page.evaluate(() => document.body.innerText);
        const m2 = t2.match(EMAIL_REGEX) || [];
        const v2 = m2.filter(e => !e.includes('noreply') && !e.includes('no-reply') && !/(\.png|\.jpg|\.jpeg|\.gif|\.svg|\.webp)$/i.test(e));
        if (v2.length === 0) return '';
        const priority = ['contact@', 'info@', 'hello@', 'reservation@', 'reservations@', 'commercial@'];
        for (const p of priority) { const m = v2.find(e => e.toLowerCase().startsWith(p)); if (m) return m; }
        return v2[0];
      } catch { return ''; }
    }
    const priority = ['contact@', 'info@', 'hello@', 'reservation@', 'reservations@', 'commercial@'];
    for (const p of priority) { const m = valid.find(e => e.toLowerCase().startsWith(p)); if (m) return m; }
    return valid[0];
  } catch { return ''; }
}

async function scrapeQuery(browser, query, city, alreadyFoundNames) {
  const page = await browser.newPage();
  await page.setUserAgent(USER_AGENT);
  await page.setExtraHTTPHeaders({ 'Accept-Language': 'fr-FR,fr;q=0.9' });

  const results = [];
  try {
    const fullQuery = `${query} ${city}`;
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

    await scrollResults(page, 6); // Reduit a 6 pour vitesse

    const items = await page.evaluate(() => {
      const cards = Array.from(document.querySelectorAll('a.hfpxzc'));
      return cards.map(c => ({ name: c.getAttribute('aria-label') || '', href: c.href })).filter(x => x.name);
    });

    for (let i = 0; i < Math.min(items.length, 40); i++) { // Reduit a 40 pour vitesse
      const item = items[i];
      const nameKey = item.name.toLowerCase().trim();
      if (alreadyFoundNames.has(nameKey)) continue;
      try {
        await page.goto(item.href, { waitUntil: 'networkidle2', timeout: 18000 });
        await sleep(500);
        const detail = await page.evaluate(() => {
          const text = document.body.innerText;
          const phoneMatch = text.match(/0[1-9](?:[\s.-]?\d{2}){4}/);
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
          address: detail.address, category: detail.category, city, query,
        });
        alreadyFoundNames.add(nameKey);
      } catch {}
    }
  } catch (e) {
    console.log(`  [${query} ${city}] FAIL ${e.message.slice(0, 60)}`);
  } finally {
    await page.close();
  }
  return results;
}

// ── Main ──────────────────────────────────────────────────────────
async function main() {
  console.log('=== France EXTENDED Scraping ===');
  console.log(`Cities: ${CITIES.length} | Queries/city: ${QUERIES.slice(0, QUERIES_LIMIT).length}`);
  console.log(`Output: ${OUT_PATH}`);

  if (!fs.existsSync(CHROME_PATH)) {
    console.error(`ERROR: Chrome introuvable.`);
    process.exit(1);
  }

  if (!fs.existsSync(OUT_PATH)) {
    fs.mkdirSync(path.dirname(OUT_PATH), { recursive: true });
    fs.writeFileSync(OUT_PATH, HEADER + '\n');
  }

  const state = loadState();
  const cityCounts = loadCityCounts();
  const knownNames = loadKnownNames();

  console.log(`Existing: ${knownNames.size} restos uniques | ${Object.keys(cityCounts).length} villes scraped`);

  // Filter targets : skip villes deja bien couvertes
  let targets = CITIES.slice(START);
  targets = targets.filter(c => (cityCounts[c] || 0) < MIN_RESTOS_TO_SKIP);
  console.log(`Villes a faire (couverture <${MIN_RESTOS_TO_SKIP}): ${targets.length}`);

  if (targets.length === 0) {
    console.log('Toutes les villes sont deja bien couvertes. Stop.');
    return;
  }

  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-blink-features=AutomationControlled'],
  });

  const queries = QUERIES.slice(0, QUERIES_LIMIT);

  for (const city of targets) {
    console.log(`\n${'='.repeat(60)}`);
    console.log(`  ${city} (queries: ${queries.length})`);
    console.log(`${'='.repeat(60)}`);

    const cityResults = new Map();

    for (const query of queries) {
      console.log(`  > ${query} ${city}`);
      const results = await scrapeQuery(browser, query, city, knownNames);
      console.log(`    ${results.length} nouveaux`);
      for (const r of results) {
        cityResults.set(r.name.toLowerCase().trim(), r);
      }
      await sleep(2500);
    }

    // Phase 2 : extraire emails
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
    await emailPage.close();

    // Append CSV
    let written = 0;
    for (const [, r] of cityResults) {
      r.scrapedAt = new Date().toISOString();
      appendCsvRow(r);
      written++;
    }

    if (!state.done.includes(city)) state.done.push(city);
    state.totalRestaurants += written;
    saveState(state);

    console.log(`  ${city} DONE: ${written} restos | ${withEmail} avec email`);
    console.log(`  Pause ${PAUSE_BETWEEN_CITIES / 1000}s avant prochaine ville...`);

    if (city !== targets[targets.length - 1]) {
      await sleep(PAUSE_BETWEEN_CITIES);
    }
  }

  await browser.close();

  console.log(`\n${'='.repeat(60)}`);
  console.log(`=== TERMINE ===`);
  console.log(`Total villes scraped (cumul) : ${state.done.length}`);
  console.log(`Total restos (cumul) : ${state.totalRestaurants}`);
  console.log(`CSV: ${OUT_PATH}`);
}

main().catch(e => {
  console.error('FATAL:', e);
  process.exit(1);
});
