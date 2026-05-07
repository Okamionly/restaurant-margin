#!/usr/bin/env node
/**
 * relance-wave1.mjs
 *
 * Relance J+5 sur les emails wave 1 (mass_v7_2026_05_07) qui n'ont pas
 * encore donné lieu à inscription sur RestauMargin.
 *
 * Logic :
 * 1. Lit le tracking de wave 1 (sent emails)
 * 2. Exclut ceux qui se sont inscrits depuis (DB users) ou ont demandé unsubscribe
 * 3. Envoie POST /api/admin/outreach/relance par batch de 10
 *
 * Usage :
 *   node scripts/relance-wave1.mjs --token JWT_ADMIN [--dry-run] [--limit 100]
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT = path.join(__dirname, '..');

const args = process.argv.slice(2);
const getArg = (flag, def = null) => { const i = args.indexOf(flag); return i > -1 ? args[i + 1] : def; };
const TOKEN = getArg('--token', null);
const LIMIT = parseInt(getArg('--limit', '300'), 10);
const BATCH_SIZE = parseInt(getArg('--batch', '10'), 10);
const DRY_RUN = args.includes('--dry-run');
const BASE = getArg('--base', 'https://www.restaumargin.fr');
const CAMPAIGN_SOURCE = getArg('--source-campaign', 'mass_v7_2026_05_07');
const CAMPAIGN_RELANCE = getArg('--relance-campaign', 'mass_v7_relance_j5');
const TRACKING_FILE = getArg('--tracking', `data/campaigns/${CAMPAIGN_SOURCE}-tracking.json`);

if (!TOKEN) {
  console.error('ERROR: --token requis (JWT admin)');
  process.exit(1);
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
  return { ok: res.ok, status: res.status, data: await res.json().catch(() => ({})) };
}

async function main() {
  console.log(`=== Relance Wave 1 (J+5) ===`);
  console.log(`Source: ${CAMPAIGN_SOURCE} | Dry: ${DRY_RUN}`);

  const trackingPath = path.join(ROOT, TRACKING_FILE);
  if (!fs.existsSync(trackingPath)) {
    console.error(`ERROR: ${trackingPath} introuvable`);
    process.exit(1);
  }

  const tracking = JSON.parse(fs.readFileSync(trackingPath, 'utf8'));
  const wave1Sent = tracking.filter(t => t.ok && t.email);
  console.log(`Wave 1 sent: ${wave1Sent.length}`);

  // Exclude : ceux qui ont une réponse "non merci" (manuel pour l'instant)
  // Exclude : ceux inscrits sur RestauMargin (via API users)
  let exclude = new Set();
  try {
    const usersRes = await api('/api/admin/users', { limit: 1000 });
    if (usersRes.ok && usersRes.data?.users) {
      for (const u of usersRes.data.users) {
        if (u.email) exclude.add(u.email.toLowerCase());
      }
      console.log(`Exclus (deja inscrits) : ${exclude.size}`);
    }
  } catch {
    console.log('Warning : check users skipped (endpoint not available)');
  }

  // Charge sent-log pour eviter relancer les recents non-wave1
  const sentLogPath = path.join(ROOT, 'data', 'campaigns', 'sent-log.json');

  const candidates = wave1Sent
    .filter(t => !exclude.has(t.email.toLowerCase()))
    .slice(0, LIMIT);

  console.log(`A relancer : ${candidates.length}\n`);

  if (candidates.length === 0) return;

  // Reconstruct candidate objects pour l'endpoint relance
  // (nous avons subject + email du tracking, on doit reconstruire name/etc)
  // Pour cela, on relit les CSV originaux pour matcher email -> resto data
  const sources = [
    'docs/campaigns/montpellier-contacts.csv',
    'docs/campaigns/montpellier-contacts-v2.csv',
    'docs/campaigns/montpellier-region-contacts.csv',
    'docs/campaigns/montpellier-v3-leads.csv',
    'data/scraping/france-mass-2026-05-06.csv',
    'docs/campaigns/national-contacts.csv',
  ];

  const restoByEmail = new Map();
  for (const src of sources) {
    const p = path.join(ROOT, src);
    if (!fs.existsSync(p)) continue;
    const lines = fs.readFileSync(p, 'utf8').split('\n').filter(l => l.trim());
    if (lines.length === 0) continue;
    const header = lines[0].split(';').map(h => h.trim().toLowerCase());
    const I = {
      name: header.indexOf('restaurant_name'),
      email: header.indexOf('email'),
      cuisine: header.indexOf('cuisine_type'),
      address: header.indexOf('address'),
      neighborhood: header.indexOf('neighborhood'),
    };
    for (const l of lines.slice(1)) {
      const cols = l.split(';');
      const email = (cols[I.email >= 0 ? I.email : 2] || '').toLowerCase().trim();
      if (!email || !email.includes('@')) continue;
      if (!restoByEmail.has(email)) {
        restoByEmail.set(email, {
          name: (cols[I.name >= 0 ? I.name : 0] || '').trim(),
          cuisine: (cols[I.cuisine >= 0 ? I.cuisine : 1] || '').trim(),
          address: (cols[I.address >= 0 ? I.address : 4] || '').trim(),
          neighborhood: I.neighborhood >= 0 ? (cols[I.neighborhood] || '').trim() : '',
        });
      }
    }
  }

  // Boucle batches
  let totalSent = 0;
  let totalErrors = 0;
  const relanceTracking = [];

  for (let i = 0; i < candidates.length; i += BATCH_SIZE) {
    const batch = candidates.slice(i, i + BATCH_SIZE);
    const batchEnriched = batch.map(t => {
      const meta = restoByEmail.get(t.email.toLowerCase()) || {};
      return {
        name: meta.name || t.email.split('@')[0],
        email: t.email,
        cuisine: meta.cuisine || '',
        address: meta.address || '',
        neighborhood: meta.neighborhood || '',
      };
    });
    const batchNum = Math.floor(i / BATCH_SIZE) + 1;
    const totalBatches = Math.ceil(candidates.length / BATCH_SIZE);
    console.log(`━━━ BATCH ${batchNum}/${totalBatches} (${batch.length}) ━━━`);

    try {
      const sendRes = await api('/api/admin/outreach/relance', {
        candidates: batchEnriched,
        dryRun: DRY_RUN,
        campaign: CAMPAIGN_RELANCE,
      });
      if (sendRes.ok) {
        const sentCount = sendRes.data.sent || 0;
        const failedCount = sendRes.data.failed || 0;
        console.log(`  OK : ${sentCount}/${batch.length} envoyes`);
        totalSent += sentCount;
        totalErrors += failedCount;
        for (const r of (sendRes.data.results || [])) {
          relanceTracking.push({ ...r, batchNum, sentAt: new Date().toISOString() });
        }
      } else {
        console.log(`  FAIL : status ${sendRes.status}`);
        totalErrors += batch.length;
      }
    } catch (e) {
      console.log(`  EXCEPTION: ${e.message}`);
      totalErrors += batch.length;
    }

    if (i + BATCH_SIZE < candidates.length) {
      await new Promise(r => setTimeout(r, 5000));
    }
  }

  // Persist relance tracking
  if (!DRY_RUN) {
    const trackingOut = path.join(ROOT, 'data', 'campaigns', `${CAMPAIGN_RELANCE}-tracking.json`);
    fs.writeFileSync(trackingOut, JSON.stringify(relanceTracking, null, 2));
    console.log(`\nTracking: ${trackingOut}`);
  }

  console.log(`\n=== TERMINE ===`);
  console.log(`Envoyes : ${totalSent}`);
  console.log(`Erreurs : ${totalErrors}`);
}

main().catch(e => { console.error('FATAL:', e); process.exit(1); });
