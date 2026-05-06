#!/usr/bin/env node
/**
 * send-montpellier-v3.mjs
 *
 * Envoi campagne v3 corrigee sur les 10 erreurs v1.
 * - Lit montpellier-v3-leads.csv (scrape elargi) + montpellier-contacts*.csv (existants)
 * - Filtre les emails deja dans data/campaigns/sent-log.json
 * - Personnalise par resto (nom, quartier, cuisine)
 * - Envoie batch warmup (default 5/jour, configurable via --limit)
 * - Loggue dans sent-log + v3-tracking.json
 *
 * Usage:
 *   node scripts/send-montpellier-v3.mjs --limit 5 --dry-run
 *   node scripts/send-montpellier-v3.mjs --limit 10
 *   node scripts/send-montpellier-v3.mjs --limit 1 --to test@example.com  (test 1 email vers une adresse donnee)
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT = path.join(__dirname, '..');

// ─── Args ─────────────────────────────────────────────────────────
const args = process.argv.slice(2);
const getArg = (flag, def = null) => {
  const idx = args.indexOf(flag);
  return idx > -1 ? args[idx + 1] : def;
};
const hasArg = (flag) => args.includes(flag);

const LIMIT = parseInt(getArg('--limit', '5'), 10);
const DRY_RUN = hasArg('--dry-run');
const TEST_TO = getArg('--to', null);
const FROM = 'RestauMargin <contact@restaumargin.fr>';
const REPLY_TO = 'contact@restaumargin.fr';
const SOURCE = getArg('--source', 'auto'); // 'v3', 'v1', 'auto' = combine

// ─── Resend API ───────────────────────────────────────────────────
// Lit la cle depuis .env.production (pull Vercel) ou ENV
let RESEND_API_KEY = process.env.RESEND_API_KEY;
if (!RESEND_API_KEY) {
  try {
    const envFile = fs.readFileSync(path.join(ROOT, '.env.production'), 'utf8');
    const m = envFile.match(/^RESEND_API_KEY="?([^"\n\r]+)"?$/m);
    if (m) RESEND_API_KEY = m[1];
  } catch {}
}
if (!RESEND_API_KEY && !DRY_RUN) {
  console.error('FATAL: RESEND_API_KEY introuvable. Set ENV ou ajoute dans .env.production.');
  process.exit(1);
}

// ─── Helpers ──────────────────────────────────────────────────────
function readCsv(p) {
  if (!fs.existsSync(p)) return [];
  const lines = fs.readFileSync(p, 'utf8').split('\n').slice(1).filter(l => l.trim());
  return lines.map(l => {
    const cols = l.split(';');
    return {
      name: (cols[0] || '').trim(),
      cuisine: (cols[1] || '').trim(),
      email: (cols[2] || '').trim().toLowerCase(),
      phone: (cols[3] || '').trim(),
      address: (cols[4] || '').trim(),
      neighborhood: (cols[5] || '').trim(),
    };
  }).filter(x => x.email && x.email.includes('@') && !x.email.includes('.png') && !x.email.includes('.jpg'));
}

function inferNeighborhood(address) {
  // Detection quartiers Montpellier
  if (!address) return 'Montpellier';
  const a = address.toLowerCase();
  if (/(rue\s+(saint-firmin|de\s+l'aiguillerie|du\s+plan|saint-guilhem|du\s+pila|valedeau|vauguelle)|place\s+(de\s+la\s+canourgue|jean\s+jaures|saint-cosme|saint-roch|saint-anne|petrarque|de\s+la\s+comedie))/i.test(address)) return "l'Ecusson";
  if (/antigone/i.test(a)) return 'Antigone';
  if (/port\s*marianne|odysseum/i.test(a)) return 'Port Marianne';
  if (/comedie/i.test(a)) return 'la Comedie';
  if (/beaux[\s-]arts/i.test(a)) return 'les Beaux-Arts';
  if (/figuerolles/i.test(a)) return 'Figuerolles';
  if (/aiguelongue/i.test(a)) return 'Aiguelongue';
  if (/arceaux/i.test(a)) return 'les Arceaux';
  if (/lez|saint-maur/i.test(a)) return 'les Bords du Lez';
  return 'Montpellier';
}

function lowercaseCuisine(cuisine) {
  if (!cuisine) return 'francaise';
  const c = cuisine.toLowerCase()
    .replace(/^restaurant\s+/i, '')
    .replace(/^bistrot\s*/i, 'bistrot ')
    .replace(/etoile\s*michelin/i, 'gastronomique')
    .trim();
  // Limit to first 3 words
  return c.split(/\s+/).slice(0, 3).join(' ');
}

// ─── Templates ────────────────────────────────────────────────────
const SUBJECTS = [
  { weight: 0.6, tpl: '{{name}} — 5 min pour calculer votre vraie marge' },
  { weight: 0.3, tpl: 'Combien vous coute reellement votre carte {{cuisine}} ?' },
  { weight: 0.1, tpl: 'RestauMargin — outil local lance a Montpellier' },
];

function pickSubject(name, cuisine) {
  const r = Math.random();
  let cum = 0;
  for (const s of SUBJECTS) {
    cum += s.weight;
    if (r <= cum) return s.tpl.replace('{{name}}', name).replace('{{cuisine}}', cuisine);
  }
  return SUBJECTS[0].tpl.replace('{{name}}', name);
}

function formatNeighborhoodForBody(n) {
  if (!n) return 'Montpellier';
  const lower = n.toLowerCase();
  // Ajoute article correct selon quartier
  if (lower === 'ecusson') return "l'Ecusson";
  if (lower === 'antigone') return 'Antigone';
  if (lower === 'port marianne' || lower === 'port-marianne') return 'Port Marianne';
  if (lower === 'comedie' || lower === 'la comedie') return 'la Comedie';
  if (lower === 'beaux-arts' || lower === 'les beaux-arts') return 'les Beaux-Arts';
  if (lower === 'figuerolles') return 'Figuerolles';
  if (lower === 'arceaux' || lower === 'les arceaux') return 'les Arceaux';
  if (lower === 'aiguelongue') return 'Aiguelongue';
  if (lower === 'bords du lez' || lower === 'les bords du lez') return 'les Bords du Lez';
  if (lower === 'odysseum') return 'Odysseum';
  if (lower === 'montpellier' || !n) return 'Montpellier';
  // Si commence deja par article, garde tel quel
  if (/^(le |la |les |l')/i.test(n)) return n;
  return n;
}

function buildBody(restaurant) {
  const name = restaurant.name;
  const rawN = restaurant.neighborhood || inferNeighborhood(restaurant.address);
  const neighborhood = formatNeighborhoodForBody(rawN);
  const cuisine = lowercaseCuisine(restaurant.cuisine);

  // Choix preposition : "a/dans" selon article
  const prep = /^l'/i.test(neighborhood) ? "a " :
               /^les /i.test(neighborhood) ? 'aux ' :
               /^la /i.test(neighborhood) ? 'a ' :
               /^le /i.test(neighborhood) ? 'au ' :
               'a ';
  const cleanedN = neighborhood.replace(/^(le |la |les |l')/i, '');
  const finalN = (prep === "a " && /^l'/i.test(neighborhood)) ? `${prep}${neighborhood}`.replace("a l'", "a l'") :
                 (prep === 'aux ') ? `aux ${cleanedN}` :
                 (prep === 'a ' && /^la /i.test(neighborhood)) ? `a la ${cleanedN}` :
                 (prep === 'au ') ? `au ${cleanedN}` :
                 `${prep}${neighborhood}`;

  return `Bonjour,

J'ai vu ${name} ${finalN}.

Je lance RestauMargin a Montpellier ce mois-ci : un outil web pour calculer le cout exact d'un plat (ingredients + perte) en 5 min, sans Excel.

2 restaurants se sont inscrits cette semaine. Avant de pousser plus loin, je voulais avoir l'avis d'un autre restaurateur du coin.

Vous pouvez tester ici sans engagement : https://www.restaumargin.fr

Si vous n'avez pas le temps, repondez juste "non merci" et je n'envoie plus rien.

Cordialement,
L'equipe RestauMargin
contact@restaumargin.fr`;
}

function buildHtml(restaurant) {
  const text = buildBody(restaurant);
  // Convertit lignes en <p>, garde les emails comme liens, et ajoute branding leger
  const escaped = text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
  const withLinks = escaped.replace(
    /(https?:\/\/[^\s]+)/g,
    '<a href="$1" style="color:#0d9488;text-decoration:none;">$1</a>'
  );
  const paragraphs = withLinks.split(/\n\n+/).map(p => `<p style="margin:0 0 14px 0;">${p.replace(/\n/g, '<br>')}</p>`).join('');
  return `<!DOCTYPE html>
<html lang="fr"><head><meta charset="utf-8"><title>RestauMargin</title></head>
<body style="font-family:-apple-system,Segoe UI,Roboto,Helvetica,Arial,sans-serif;font-size:15px;line-height:1.55;color:#111;max-width:560px;margin:0 auto;padding:20px;">
${paragraphs}
<hr style="border:0;border-top:1px solid #e5e7eb;margin:24px 0 12px 0;">
<p style="font-size:12px;color:#737373;margin:0;">RestauMargin · Outil SaaS pour restaurateurs francais · <a href="https://www.restaumargin.fr" style="color:#737373;">restaumargin.fr</a></p>
<p style="font-size:11px;color:#9ca3af;margin:4px 0 0 0;">Si vous ne souhaitez plus recevoir de message, repondez "non merci" et nous vous retirerons immediatement.</p>
</body></html>`;
}

// ─── Send Resend ──────────────────────────────────────────────────
async function sendOne(restaurant) {
  const subject = pickSubject(restaurant.name, lowercaseCuisine(restaurant.cuisine));
  const text = buildBody(restaurant);
  const html = buildHtml(restaurant);
  const to = TEST_TO || restaurant.email;

  if (DRY_RUN) {
    console.log(`\n[DRY] To: ${to}`);
    console.log(`[DRY] Subject: ${subject}`);
    console.log(`[DRY] Body:\n${text}\n${'─'.repeat(60)}`);
    return { ok: true, dryRun: true };
  }

  const refId = `mtp-v3-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${RESEND_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: FROM,
      to: [to],
      reply_to: REPLY_TO,
      subject,
      text,
      html,
      headers: {
        'X-Entity-Ref-ID': refId,
        'X-Campaign': 'montpellier-v3',
      },
      tags: [
        { name: 'campaign', value: 'montpellier_v3' },
        { name: 'subject_variant', value: subject.startsWith(restaurant.name) ? 'A' : (subject.startsWith('Combien') ? 'B' : 'C') },
      ],
    }),
  });

  const data = await res.json();
  return { ok: res.ok, status: res.status, data, refId, subject };
}

// ─── Main ─────────────────────────────────────────────────────────
async function main() {
  console.log('=== Send Montpellier v3 ===');
  console.log(`Limit: ${LIMIT} | Dry: ${DRY_RUN} | Source: ${SOURCE}${TEST_TO ? ` | Test-to: ${TEST_TO}` : ''}`);

  // Charge sent-log
  const sentLogPath = path.join(ROOT, 'data', 'campaigns', 'sent-log.json');
  const sent = new Set(
    (JSON.parse(fs.readFileSync(sentLogPath, 'utf8'))).filter(e => typeof e === 'string' && e.includes('@'))
  );
  console.log(`Deja contactes: ${sent.size}`);

  // Charge contacts
  const sources = [];
  if (SOURCE === 'v3' || SOURCE === 'auto') sources.push('docs/campaigns/montpellier-v3-leads.csv');
  if (SOURCE === 'v1' || SOURCE === 'auto') {
    sources.push('docs/campaigns/montpellier-contacts.csv');
    sources.push('docs/campaigns/montpellier-contacts-v2.csv');
    sources.push('docs/campaigns/montpellier-region-contacts.csv');
  }

  const seenEmails = new Set();
  const candidates = [];
  for (const src of sources) {
    const items = readCsv(path.join(ROOT, src));
    console.log(`  ${src}: ${items.length} lignes`);
    for (const c of items) {
      // En mode TEST_TO, on ne filtre pas sent-log (on veut juste tester le rendu)
      if (!TEST_TO && sent.has(c.email)) continue;
      if (seenEmails.has(c.email)) continue;
      seenEmails.add(c.email);
      candidates.push(c);
    }
  }

  console.log(`Candidates ${TEST_TO ? 'disponibles (test mode)' : 'non encore contactes'}: ${candidates.length}`);

  if (candidates.length === 0) {
    if (TEST_TO) {
      // Fallback : candidat factice pour tester delivery vers --to
      candidates.push({
        name: 'Le Petit Jardin',
        cuisine: 'Bistronomique',
        email: TEST_TO,
        phone: '04 67 12 34 56',
        address: '20 rue Saint-Firmin 34000 Montpellier',
        neighborhood: "l'Ecusson",
      });
      console.log('Fallback: utilisation d\'un candidat factice pour tester delivery.');
    } else {
      console.log('Aucun candidat a contacter. Lance le scraping etendu d abord.');
      return;
    }
  }

  const batch = TEST_TO ? candidates.slice(0, 1) : candidates.slice(0, LIMIT);
  console.log(`\nEnvoi de ${batch.length} email(s)...`);

  const results = [];
  for (let i = 0; i < batch.length; i++) {
    const r = batch[i];
    process.stdout.write(`  [${i + 1}/${batch.length}] ${r.email.padEnd(40)} ... `);
    try {
      const result = await sendOne(r);
      if (result.ok) {
        console.log(`OK${result.dryRun ? ' (dry)' : ` id=${result.data?.id?.slice(0, 12)}`}`);
        if (!result.dryRun) sent.add(r.email);
        results.push({ email: r.email, name: r.name, ok: true, refId: result.refId, subject: result.subject, sentAt: new Date().toISOString() });
      } else {
        console.log(`FAIL ${result.status}: ${JSON.stringify(result.data).slice(0, 80)}`);
        results.push({ email: r.email, name: r.name, ok: false, error: result.data, sentAt: new Date().toISOString() });
      }
    } catch (e) {
      console.log(`ERROR: ${e.message}`);
      results.push({ email: r.email, name: r.name, ok: false, error: e.message, sentAt: new Date().toISOString() });
    }
    // Pacing entre envois (anti-rate-limit + anti-spam suspect)
    if (i < batch.length - 1) await new Promise(r => setTimeout(r, 2000));
  }

  // Persist
  if (!DRY_RUN) {
    fs.writeFileSync(sentLogPath, JSON.stringify([...sent], null, 2));
    const trackingPath = path.join(ROOT, 'data', 'campaigns', 'v3-tracking.json');
    let existing = [];
    if (fs.existsSync(trackingPath)) {
      try { existing = JSON.parse(fs.readFileSync(trackingPath, 'utf8')); } catch {}
    }
    existing.push(...results);
    fs.writeFileSync(trackingPath, JSON.stringify(existing, null, 2));
    console.log(`\nLog: ${sentLogPath} (${sent.size} entries)`);
    console.log(`Tracking: ${trackingPath} (${existing.length} entries)`);
  }

  const ok = results.filter(r => r.ok).length;
  console.log(`\n=== Resultat: ${ok}/${batch.length} OK ===`);
}

main().catch(e => {
  console.error('FATAL:', e);
  process.exit(1);
});
