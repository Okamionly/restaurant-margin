#!/usr/bin/env node
/**
 * mass-send-pipeline.mjs
 *
 * Pipeline complet : enrich + send sur les 237 HQ contacts.
 *
 * Workflow :
 * 1. Lit tous les CSVs (Montpellier v1/v2/v3/region + France 61 villes)
 * 2. Filtre : non contactes (sent-log) + email domain match website
 * 3. Pour chaque batch de 10 :
 *    a. Pour chaque resto : POST /api/admin/outreach/enrich-menu (Claude Sonnet)
 *    b. POST /api/admin/outreach/send avec batch (Resend)
 *    c. Append au sent-log + tracking
 *    d. Wait 5s entre batches
 * 4. Log final
 *
 * Usage :
 *   node scripts/mass-send-pipeline.mjs --token JWT_ADMIN [--limit 237] [--batch 10] [--dry-run]
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT = path.join(__dirname, '..');

// ─── Args ───────────────────────────────────────────────────
const args = process.argv.slice(2);
const getArg = (flag, def = null) => { const i = args.indexOf(flag); return i > -1 ? args[i + 1] : def; };
const TOKEN = getArg('--token', null);
const LIMIT = parseInt(getArg('--limit', '237'), 10);
const BATCH_SIZE = parseInt(getArg('--batch', '10'), 10);
const BATCH_PAUSE_MS = parseInt(getArg('--pause', '5000'), 10);
const DRY_RUN = args.includes('--dry-run');
const INCLUDE_MISMATCH = args.includes('--include-mismatch');  // Wave 2 : inclure non-HQ
const BASE = getArg('--base', 'https://www.restaumargin.fr');
const CAMPAIGN = getArg('--campaign', 'mass_v7_2026_05_07');

if (!TOKEN) {
  console.error('ERROR: --token requis. Recupere ton JWT admin :');
  console.error('  Sur restaumargin.fr (loggue admin), console:');
  console.error('  console.log(localStorage.getItem("token"))');
  process.exit(1);
}

// ─── Helpers ───────────────────────────────────────────────────
function readCsv(p) {
  if (!fs.existsSync(p)) return [];
  const raw = fs.readFileSync(p, 'utf8');
  const all = raw.split('\n').filter(l => l.trim());
  if (all.length === 0) return [];
  const header = all[0].split(';').map(h => h.trim().toLowerCase());
  const idx = (k) => header.indexOf(k);
  const I = {
    name: idx('restaurant_name'), cuisine: idx('cuisine_type'),
    email: idx('email'), phone: idx('phone'), address: idx('address'),
    neighborhood: idx('neighborhood'), website: idx('website'), city: idx('city'),
  };
  return all.slice(1).map(l => {
    const c = l.split(';');
    return {
      name: (c[I.name >= 0 ? I.name : 0] || '').trim(),
      cuisine: (c[I.cuisine >= 0 ? I.cuisine : 1] || '').trim(),
      email: (c[I.email >= 0 ? I.email : 2] || '').trim().toLowerCase(),
      phone: (c[I.phone >= 0 ? I.phone : 3] || '').trim(),
      address: (c[I.address >= 0 ? I.address : 4] || '').trim(),
      neighborhood: I.neighborhood >= 0 ? (c[I.neighborhood] || '').trim() : '',
      website: I.website >= 0 ? (c[I.website] || '').trim() : '',
      city: I.city >= 0 ? (c[I.city] || '').trim() : '',
    };
  }).filter(x => x.email && x.email.includes('@') && !x.email.includes('.png') && !x.email.includes('.jpg'));
}

function emailMatchWebsite(email, website) {
  if (!email || !website) return false;
  try {
    const ed = email.split('@')[1]?.toLowerCase();
    const wd = new URL(website).hostname.replace(/^www\./, '').toLowerCase();
    return ed === wd || wd.endsWith('.' + ed) || ed.endsWith('.' + wd);
  } catch { return false; }
}

async function api(endpoint, body) {
  const res = await fetch(`${BASE}${endpoint}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${TOKEN}`,
    },
    body: JSON.stringify(body),
  });
  const data = await res.json().catch(() => ({}));
  return { ok: res.ok, status: res.status, data };
}

// ─── Main ──────────────────────────────────────────────────────
async function main() {
  console.log(`=== Mass Send Pipeline ===`);
  console.log(`Limit: ${LIMIT} | Batch: ${BATCH_SIZE} | Dry: ${DRY_RUN}`);
  console.log(`Campaign: ${CAMPAIGN}`);
  console.log('');

  // 1. Charger sent-log
  const sentLogPath = path.join(ROOT, 'data', 'campaigns', 'sent-log.json');
  const sent = new Set(
    JSON.parse(fs.readFileSync(sentLogPath, 'utf8')).filter(e => typeof e === 'string' && e.includes('@'))
  );

  // 2. Charger tous les CSVs
  const sources = [
    'docs/campaigns/montpellier-contacts.csv',
    'docs/campaigns/montpellier-contacts-v2.csv',
    'docs/campaigns/montpellier-region-contacts.csv',
    'docs/campaigns/montpellier-v3-leads.csv',
    'data/scraping/france-mass-2026-05-06.csv',
    'docs/campaigns/national-contacts.csv',
  ];

  const seen = new Set();
  const all = [];
  for (const src of sources) {
    const items = readCsv(path.join(ROOT, src));
    for (const c of items) {
      if (sent.has(c.email)) continue;
      if (seen.has(c.email)) continue;
      seen.add(c.email);
      all.push(c);
    }
  }
  console.log(`Total uniques non contactes : ${all.length}`);

  // 3. Filtre HQ ou inclusion totale selon flag
  let pool;
  if (INCLUDE_MISMATCH) {
    // Wave 2 : tous les neufs (filtre juste les emails qui ont l'air invalides)
    pool = all.filter(c => {
      // Skip emails type wixpress, photos, etc.
      const e = c.email.toLowerCase();
      if (e.includes('@wixpress')) return false;
      if (e.includes('@example')) return false;
      if (e.startsWith('noreply') || e.startsWith('no-reply')) return false;
      return true;
    });
    console.log(`Wave 2 (incl. mismatch) : ${pool.length}`);
  } else {
    pool = all.filter(c => emailMatchWebsite(c.email, c.website));
    console.log(`HQ (domain match) : ${pool.length}`);
  }

  const todo = pool.slice(0, LIMIT);
  console.log(`A traiter : ${todo.length}\n`);

  if (todo.length === 0) {
    console.log('Aucun candidat. Stop.');
    return;
  }

  // 4. Boucle batches : enrich + send
  const trackingPath = path.join(ROOT, 'data', 'campaigns', `${CAMPAIGN}-tracking.json`);
  let allResults = [];
  if (fs.existsSync(trackingPath)) {
    try { allResults = JSON.parse(fs.readFileSync(trackingPath, 'utf8')); } catch {}
  }

  let totalSent = 0;
  let totalEnriched = 0;
  let totalErrors = 0;

  for (let i = 0; i < todo.length; i += BATCH_SIZE) {
    const batch = todo.slice(i, i + BATCH_SIZE);
    const batchNum = Math.floor(i / BATCH_SIZE) + 1;
    const totalBatches = Math.ceil(todo.length / BATCH_SIZE);
    console.log(`\n━━━ BATCH ${batchNum}/${totalBatches} (${batch.length} restos) ━━━`);

    // 4a. Enrich chaque resto du batch (sequentiel pour Anthropic rate-limit)
    console.log('  [Enrich]');
    const enrichedBatch = [];
    for (let j = 0; j < batch.length; j++) {
      const r = batch[j];
      process.stdout.write(`    [${j + 1}/${batch.length}] ${(r.name || '?').slice(0, 30).padEnd(30)} `);
      try {
        const result = await api('/api/admin/outreach/enrich-menu', {
          name: r.name, website: r.website, cuisine: r.cuisine,
        });
        if (result.ok && result.data?.found && result.data?.dish) {
          enrichedBatch.push({
            ...r,
            featured_dish: result.data.dish,
            dish_price_eur: result.data.price_eur,
          });
          console.log(`-> ${result.data.dish.slice(0, 30)} @ ${result.data.price_eur}€`);
          totalEnriched++;
        } else {
          enrichedBatch.push(r); // Pas de plat = template v3 fallback
          console.log(`(no dish: ${result.data?.reason || 'unknown'})`);
        }
      } catch (e) {
        console.log(`ERROR: ${e.message}`);
        enrichedBatch.push(r);
        totalErrors++;
      }
      // Pacing 1s anti rate-limit
      await new Promise(res => setTimeout(res, 1000));
    }

    // 4b. Send batch
    console.log('  [Send]');
    try {
      const sendRes = await api('/api/admin/outreach/send', {
        candidates: enrichedBatch,
        dryRun: DRY_RUN,
        campaign: CAMPAIGN,
      });
      if (sendRes.ok) {
        const sentCount = sendRes.data.sent || 0;
        const failedCount = sendRes.data.failed || 0;
        console.log(`    OK : ${sentCount} envoyes / ${failedCount} fail`);
        totalSent += sentCount;
        totalErrors += failedCount;

        // Update sent-log + tracking
        if (!DRY_RUN) {
          for (const r of (sendRes.data.results || [])) {
            if (r.ok) sent.add(r.email);
            allResults.push({ ...r, batchNum, sentAt: new Date().toISOString() });
          }
          fs.writeFileSync(sentLogPath, JSON.stringify([...sent], null, 2));
          fs.writeFileSync(trackingPath, JSON.stringify(allResults, null, 2));
        }
      } else {
        console.log(`    ERROR send: status ${sendRes.status}`);
        totalErrors += enrichedBatch.length;
      }
    } catch (e) {
      console.log(`    EXCEPTION: ${e.message}`);
      totalErrors += enrichedBatch.length;
    }

    // Pause entre batches (anti spam suspect + rate limit Resend)
    if (i + BATCH_SIZE < todo.length) {
      console.log(`  Pause ${BATCH_PAUSE_MS / 1000}s avant prochain batch...`);
      await new Promise(res => setTimeout(res, BATCH_PAUSE_MS));
    }
  }

  console.log('\n═══════════════════════════════');
  console.log(`=== TERMINE ===`);
  console.log(`Total a traiter : ${todo.length}`);
  console.log(`Enrichis avec plat : ${totalEnriched} (${(totalEnriched * 100 / todo.length).toFixed(0)}%)`);
  console.log(`Envoyes : ${totalSent}`);
  console.log(`Erreurs : ${totalErrors}`);
  console.log(`\nTracking : ${trackingPath}`);
  console.log(`Sent-log : ${sentLogPath}`);
}

main().catch(e => {
  console.error('FATAL:', e);
  process.exit(1);
});
