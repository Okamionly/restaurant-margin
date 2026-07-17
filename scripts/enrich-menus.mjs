#!/usr/bin/env node
/**
 * enrich-menus.mjs
 *
 * Pour chaque resto avec website (high-quality), appelle l'endpoint
 * /api/admin/outreach/enrich-menu pour extraire 1 plat phare + son prix.
 * Output : CSV enrichi avec colonnes featured_dish, dish_price_eur, source_url.
 *
 * Utilise le browser ouvert avec session admin active (Playwright MCP)
 * pour faire les calls authentifies, OU un JWT en arg --token.
 *
 * Usage :
 *   node scripts/enrich-menus.mjs --source montpellier --limit 5
 *   node scripts/enrich-menus.mjs --source france --limit 50
 *   node scripts/enrich-menus.mjs --source all
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT = path.join(__dirname, '..');

const args = process.argv.slice(2);
const getArg = (flag, def = null) => { const i = args.indexOf(flag); return i > -1 ? args[i + 1] : def; };
const SOURCE = getArg('--source', 'all'); // 'montpellier' | 'france' | 'all'
const LIMIT = parseInt(getArg('--limit', '5'), 10);
const TOKEN = getArg('--token', null);
const BASE_URL = getArg('--base', 'https://www.restaumargin.fr');

if (!TOKEN) {
  console.error('ERROR: --token requis. Recupere ton JWT admin via:');
  console.error('  console.log(localStorage.getItem("token")) dans le browser sur restaumargin.fr');
  process.exit(1);
}

// ─── Helpers ───────────────────────────────────────────────────
function readCsv(p) {
  if (!fs.existsSync(p)) return [];
  const raw = fs.readFileSync(p, 'utf8');
  const allLines = raw.split('\n').filter(l => l.trim());
  if (allLines.length === 0) return [];
  const header = allLines[0].split(';').map(h => h.trim().toLowerCase());
  const idx = (key) => header.indexOf(key);
  const I = {
    name: idx('restaurant_name'),
    cuisine: idx('cuisine_type'),
    email: idx('email'),
    phone: idx('phone'),
    address: idx('address'),
    neighborhood: idx('neighborhood'),
    website: idx('website'),
    city: idx('city'),
  };
  return allLines.slice(1).map(l => {
    const cols = l.split(';');
    return {
      name: (cols[I.name >= 0 ? I.name : 0] || '').trim(),
      cuisine: (cols[I.cuisine >= 0 ? I.cuisine : 1] || '').trim(),
      email: (cols[I.email >= 0 ? I.email : 2] || '').trim().toLowerCase(),
      phone: (cols[I.phone >= 0 ? I.phone : 3] || '').trim(),
      address: (cols[I.address >= 0 ? I.address : 4] || '').trim(),
      neighborhood: I.neighborhood >= 0 ? (cols[I.neighborhood] || '').trim() : '',
      website: I.website >= 0 ? (cols[I.website] || '').trim() : '',
      city: I.city >= 0 ? (cols[I.city] || '').trim() : 'Montpellier',
    };
  }).filter(x => x.email && x.email.includes('@'));
}

function emailDomainMatchesWebsite(email, website) {
  if (!email || !website) return false;
  try {
    const ed = email.split('@')[1]?.toLowerCase();
    const wd = new URL(website).hostname.replace(/^www\./, '').toLowerCase();
    return ed === wd || wd.endsWith('.' + ed) || ed.endsWith('.' + wd);
  } catch { return false; }
}

async function enrichOne(resto) {
  try {
    const res = await fetch(`${BASE_URL}/api/admin/outreach/enrich-menu`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${TOKEN}`,
      },
      body: JSON.stringify({
        name: resto.name,
        website: resto.website,
        cuisine: resto.cuisine,
      }),
    });
    if (!res.ok) {
      const t = await res.text();
      return { ok: false, error: `HTTP ${res.status}: ${t.slice(0, 100)}` };
    }
    return await res.json();
  } catch (e) {
    return { ok: false, error: e.message };
  }
}

// ─── Main ──────────────────────────────────────────────────────
async function main() {
  console.log(`=== Enrich Menus (source=${SOURCE}, limit=${LIMIT}) ===`);

  // Charge sent-log pour exclure
  const sentLogPath = path.join(ROOT, 'data', 'campaigns', 'sent-log.json');
  const sent = new Set(
    JSON.parse(fs.readFileSync(sentLogPath, 'utf8')).filter(e => typeof e === 'string' && e.includes('@'))
  );

  // Charge contacts selon source
  let contacts = [];
  if (SOURCE === 'montpellier' || SOURCE === 'all') {
    contacts.push(...readCsv(path.join(ROOT, 'docs/campaigns/montpellier-v3-leads.csv')));
  }
  if (SOURCE === 'france' || SOURCE === 'all') {
    contacts.push(...readCsv(path.join(ROOT, 'data/scraping/france-mass-2026-05-06.csv')));
  }

  // Dedupe par email
  const seenEmails = new Set();
  contacts = contacts.filter(c => {
    if (seenEmails.has(c.email)) return false;
    seenEmails.add(c.email);
    return true;
  });

  // Filtre : non contactes + haute qualite (domain match)
  const eligible = contacts.filter(c =>
    !sent.has(c.email) &&
    c.website &&
    emailDomainMatchesWebsite(c.email, c.website)
  );

  console.log(`Eligibles (haute qualite, non contactes) : ${eligible.length}`);
  console.log(`Limit : ${LIMIT}`);

  // Charge cache existant pour reprise (idempotent)
  const cachePath = path.join(ROOT, 'data', 'campaigns', 'menu-enrichment.json');
  let cache = {};
  if (fs.existsSync(cachePath)) {
    try { cache = JSON.parse(fs.readFileSync(cachePath, 'utf8')); } catch {}
  }
  console.log(`Cache existant : ${Object.keys(cache).length} entries`);

  const todo = eligible.filter(c => !cache[c.email]).slice(0, LIMIT);
  console.log(`A enrichir : ${todo.length}\n`);

  let withDish = 0;
  for (let i = 0; i < todo.length; i++) {
    const c = todo[i];
    process.stdout.write(`  [${i + 1}/${todo.length}] ${(c.name || '?').slice(0, 35).padEnd(35)} `);
    const result = await enrichOne(c);
    if (result.ok && result.found && result.dish) {
      console.log(`-> ${result.dish.slice(0, 40)} @ ${result.price_eur}€`);
      withDish++;
      cache[c.email] = {
        ...c,
        featured_dish: result.dish,
        dish_price_eur: result.price_eur,
        source_url: result.source_url || '',
        enriched_at: new Date().toISOString(),
      };
    } else {
      console.log(`(no dish: ${result.reason || result.error || 'unknown'})`);
      cache[c.email] = {
        ...c,
        featured_dish: '',
        dish_price_eur: null,
        enrich_failed_reason: result.reason || result.error,
        enriched_at: new Date().toISOString(),
      };
    }

    // Persist apres chaque appel (resilience)
    fs.writeFileSync(cachePath, JSON.stringify(cache, null, 2));

    // Pacing 1s anti rate-limit Anthropic
    if (i < todo.length - 1) await new Promise(r => setTimeout(r, 1000));
  }

  console.log(`\n=== Resultat ===`);
  console.log(`Enrichis : ${todo.length}`);
  console.log(`Avec plat extrait : ${withDish} (${(withDish * 100 / Math.max(todo.length, 1)).toFixed(0)}%)`);
  console.log(`Cache : ${cachePath}`);
}

main().catch(e => {
  console.error('FATAL:', e);
  process.exit(1);
});
