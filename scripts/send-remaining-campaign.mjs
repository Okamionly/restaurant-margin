#!/usr/bin/env node
// ============================================================
// RestauMargin — Send campaign to ALL remaining unsent contacts
// Consolidates contacts from all CSV files, deduplicates, sends
// ============================================================

import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ── Config ─────────────────────────────────────────────────────────
const RESEND_API_KEY = process.env.RESEND_API_KEY;
if (!RESEND_API_KEY) {
  console.error('[FATAL] RESEND_API_KEY env var is required');
  process.exit(1);
}
const FROM_ADDRESS = 'RestauMargin <contact@restaumargin.fr>';
const RATE_LIMIT_MS = 1100; // ~1 email per second
const BATCH_SIZE = 50;
const BATCH_PAUSE_MS = 5000;

const PROJECT_ROOT = path.join(__dirname, '..');
const CAMPAIGNS_DIR = path.join(PROJECT_ROOT, 'docs', 'campaigns');
const DATA_CAMPAIGNS_DIR = path.join(PROJECT_ROOT, 'data', 'campaigns');
const SCRAPING_DIR = path.join(PROJECT_ROOT, 'data', 'scraping');
const SENT_LOG_FILE = path.join(DATA_CAMPAIGNS_DIR, 'sent-log.json');
const RELANCE_LOG_FILE = path.join(DATA_CAMPAIGNS_DIR, 'relance-sent-log.json');

// ── Helpers ────────────────────────────────────────────────────────
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function loadSentEmails() {
  const sent = new Set();
  // Load from sent-log.json
  for (const logFile of [SENT_LOG_FILE, RELANCE_LOG_FILE]) {
    if (fs.existsSync(logFile)) {
      try {
        const data = JSON.parse(fs.readFileSync(logFile, 'utf-8'));
        if (Array.isArray(data)) {
          data.forEach(e => sent.add(e.toLowerCase().trim()));
        }
      } catch (e) { /* ignore */ }
    }
  }
  return sent;
}

function saveSentLog(sentEmails) {
  if (!fs.existsSync(DATA_CAMPAIGNS_DIR)) {
    fs.mkdirSync(DATA_CAMPAIGNS_DIR, { recursive: true });
  }
  fs.writeFileSync(SENT_LOG_FILE, JSON.stringify([...sentEmails], null, 2), 'utf-8');
}

// Parse semicolon-delimited CSV (campaigns format)
function parseSemicolonCSV(filePath) {
  const content = fs.readFileSync(filePath, 'utf-8');
  const lines = content.split('\n').filter(l => l.trim());
  if (lines.length < 2) return [];

  const header = lines[0].split(';').map(h => h.trim().toLowerCase());
  const contacts = [];

  for (let i = 1; i < lines.length; i++) {
    const cols = lines[i].split(';');
    const obj = {};
    header.forEach((h, idx) => {
      obj[h] = (cols[idx] || '').trim();
    });
    contacts.push(obj);
  }
  return contacts;
}

// Parse comma-delimited CSV (scraping format)
function parseCommaCSV(filePath) {
  const content = fs.readFileSync(filePath, 'utf-8');
  const lines = content.split('\n').filter(l => l.trim());
  if (lines.length < 2) return [];

  // Handle quoted fields
  function splitCSVLine(line) {
    const result = [];
    let current = '';
    let inQuotes = false;
    for (let i = 0; i < line.length; i++) {
      const ch = line[i];
      if (ch === '"') {
        if (inQuotes && line[i + 1] === '"') { current += '"'; i++; }
        else inQuotes = !inQuotes;
      } else if (ch === ',' && !inQuotes) {
        result.push(current);
        current = '';
      } else {
        current += ch;
      }
    }
    result.push(current);
    return result;
  }

  const header = splitCSVLine(lines[0]).map(h => h.trim().toLowerCase());
  const contacts = [];

  for (let i = 1; i < lines.length; i++) {
    const cols = splitCSVLine(lines[i]);
    const obj = {};
    header.forEach((h, idx) => {
      obj[h] = (cols[idx] || '').trim();
    });
    contacts.push(obj);
  }
  return contacts;
}

function isValidEmail(email) {
  if (!email || typeof email !== 'string') return false;
  email = email.trim();
  // Must contain @, have something before and after, no spaces
  if (!email.includes('@')) return false;
  if (email.includes(' ')) return false;
  // Basic regex
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!re.test(email)) return false;
  // Filter out obviously invalid emails (image files, etc)
  if (email.endsWith('.jpeg') || email.endsWith('.png') || email.endsWith('.jpg')) return false;
  return true;
}

// ── Cuisine detection ──────────────────────────────────────────────
const CUISINE_HOOKS = {
  brasserie: {
    subject: 'Brasserie : savez-vous combien vous coute votre plat du jour ?',
    hook: 'Chaque midi, vous servez 50 a 100 couverts. Le plat du jour tourne, les prix fournisseurs bougent... Mais votre marge, elle, vous la connaissez vraiment ?',
    pain: "Sans outil adapte, impossible de savoir si votre blanquette du mardi est rentable ou si votre entrecote du vendredi vous fait perdre de l'argent.",
    benefit: "RestauMargin calcule le food cost de chaque plat en temps reel. Vous ajustez vos prix et vos portions avant que la marge ne s'effondre.",
  },
  pizzeria: {
    subject: 'Pizzeria : chaque pizza est-elle vraiment rentable ?',
    hook: "Farine, mozzarella, tomates San Marzano... Les ingredients d'une vraie pizza ont un cout. Et avec 15-20 pizzas a la carte, les ecarts de marge peuvent etre enormes.",
    pain: 'Votre 4 fromages est probablement 2x plus chere a produire que votre margherita. Vendez-vous la difference au bon prix ?',
    benefit: 'RestauMargin analyse chaque pizza de votre carte, compare les couts, et vous aide a fixer des prix qui refletent la realite de vos couts.',
  },
  general: {
    subject: 'Restaurateurs : arretez de perdre de l\'argent sur chaque plat',
    hook: 'En France, 1 restaurant sur 3 ferme dans les 3 premieres annees. La raison n1 ? Une mauvaise maitrise des couts matieres.',
    pain: 'Si vous ne connaissez pas le food cost exact de chaque plat de votre carte, vous pilotez votre restaurant a l\'aveugle.',
    benefit: "RestauMargin est l'outil qui vous donne enfin une vision claire : cout par plat, marge reelle, alertes prix, fiches techniques automatisees par IA.",
  },
};

function detectCuisine(name, category) {
  const text = `${name || ''} ${category || ''}`.toLowerCase();
  if (text.includes('pizza') || text.includes('pizzeria')) return 'pizzeria';
  if (text.includes('brasserie') || text.includes('bistro') || text.includes('bistrot')) return 'brasserie';
  return 'general';
}

function esc(str) {
  return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

function buildCampaignEmail(name, category) {
  const cuisine = CUISINE_HOOKS[detectCuisine(name, category)] || CUISINE_HOOKS.general;
  const greeting = name && name !== 'Restaurant' ? `Bonjour ${esc(name)},` : 'Bonjour,';

  const html = `<!DOCTYPE html>
<html lang="fr">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width"></head>
<body style="margin:0;padding:0;background:#f4f4f5;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
<table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:#f4f4f5;">
<tr><td align="center" style="padding:40px 16px;">
<table role="presentation" width="600" cellspacing="0" cellpadding="0" style="background:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,0.06);">

<!-- Header -->
<tr><td style="background:#0d9488;padding:28px 30px;text-align:center;">
  <span style="color:#ffffff;font-size:22px;font-weight:700;letter-spacing:-0.5px;">RestauMargin</span>
</td></tr>

<!-- Body -->
<tr><td style="padding:30px;">
  <p style="color:#1a1a2e;font-size:15px;line-height:1.8;margin:0 0 18px;">${greeting}</p>

  <p style="color:#1a1a2e;font-size:15px;line-height:1.8;margin:0 0 18px;">${esc(cuisine.hook)}</p>
  <p style="color:#1a1a2e;font-size:15px;line-height:1.8;margin:0 0 18px;">${esc(cuisine.pain)}</p>
  <p style="color:#1a1a2e;font-size:15px;line-height:1.8;margin:0 0 24px;">${esc(cuisine.benefit)}</p>

  <div style="border-top:1px solid #e5e5e5;margin:24px 0;"></div>

  <p style="color:#1a1a2e;font-size:15px;line-height:1.8;margin:0 0 14px;">
    RestauMargin est ne d'un constat simple : les restaurateurs passent des heures a calculer leurs couts sur Excel,
    alors que la technologie pourrait le faire en quelques secondes.
  </p>

  <p style="color:#1a1a2e;font-size:15px;line-height:1.8;margin:0 0 14px;">
    Notre intelligence artificielle permet de <strong>creer une fiche technique par la voix</strong>, en plein service.
    Vous dites &laquo; risotto aux cepes, 4 portions, 19 euros &raquo; &mdash; et le food cost s'affiche en 10 secondes.
  </p>

  <p style="color:#1a1a2e;font-size:15px;line-height:1.8;margin:0 0 14px;">
    Votre livreur depose une facture ? <strong>Photographiez-la.</strong> L'IA lit les prix et met a jour vos couts automatiquement.
  </p>

  <p style="color:#1a1a2e;font-size:15px;line-height:1.8;margin:0 0 14px;">
    Vos stocks baissent ? <strong>La commande part en 1 clic</strong> &mdash; par email ou WhatsApp &mdash; directement a votre fournisseur.
  </p>

  <p style="color:#1a1a2e;font-size:15px;line-height:1.8;margin:0 0 14px;">
    Un fournisseur augmente ses prix ? <strong>Vous etes alerte immediatement</strong>, avant que ca impacte vos marges.
  </p>

  <div style="border-top:1px solid #e5e5e5;margin:24px 0;"></div>

  <p style="color:#1a1a2e;font-size:15px;line-height:1.8;margin:0 0 24px;">
    Nous proposons un essai gratuit de 7 jours, sans carte bancaire et sans engagement.
    En 5 minutes, vous savez exactement ce que chaque plat vous coute et ce qu'il vous rapporte.
  </p>

  <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
    <tr><td align="center" style="padding:8px 0 24px;">
      <a href="https://www.restaumargin.fr/login?mode=register" style="display:inline-block;padding:14px 36px;background:#0d9488;color:#ffffff;text-decoration:none;border-radius:8px;font-weight:700;font-size:15px;">
        Essayer gratuitement &rarr;
      </a>
    </td></tr>
  </table>

  <p style="color:#6b7280;font-size:13px;text-align:center;margin:0 0 24px;">
    29&euro;/mois apres l'essai &mdash; Sans engagement
  </p>

  <p style="color:#1a1a2e;font-size:15px;line-height:1.8;margin:0;">
    A bientot,<br>
    L'equipe RestauMargin<br>
    <span style="color:#6b7280;">Montpellier</span>
  </p>
</td></tr>

<!-- Footer -->
<tr><td style="background:#f9fafb;padding:20px 30px;border-top:1px solid #e5e5e5;">
  <p style="color:#9ca3af;font-size:11px;line-height:1.6;margin:0;text-align:center;">
    Vous recevez cet email car votre restaurant est reference publiquement.<br>
    <a href="mailto:contact@restaumargin.fr?subject=Desabonnement" style="color:#9ca3af;">Se desabonner</a>
    &nbsp;|&nbsp; RestauMargin &mdash; Montpellier, France
  </p>
</td></tr>

</table>
</td></tr>
</table>
</body>
</html>`;

  return { subject: cuisine.subject, html };
}

// ── Send email via Resend API ──────────────────────────────────────
async function sendEmail(to, subject, html) {
  try {
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: FROM_ADDRESS,
        to: [to],
        subject,
        html,
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      return {
        success: false,
        error: data?.message || data?.error?.message || `HTTP ${res.status}`,
      };
    }

    return { success: true, messageId: data.id };
  } catch (err) {
    return {
      success: false,
      error: err instanceof Error ? err.message : 'Unknown error',
    };
  }
}

// ── Main ───────────────────────────────────────────────────────────
async function main() {
  console.log('\n========================================');
  console.log('  RestauMargin — Full Campaign Sender');
  console.log('  Consolidating ALL unsent contacts');
  console.log('========================================\n');

  // Step 1: Load already-sent emails (montpellier-contacts.csv 50 + relance log)
  const alreadySent = loadSentEmails();

  // Also add all emails from montpellier-contacts.csv (the original 50 already sent)
  const montpellierV1 = parseSemicolonCSV(path.join(CAMPAIGNS_DIR, 'montpellier-contacts.csv'));
  montpellierV1.forEach(c => {
    if (c.email && isValidEmail(c.email)) {
      alreadySent.add(c.email.toLowerCase().trim());
    }
  });

  console.log(`  Already sent/skipped emails: ${alreadySent.size}`);

  // Step 2: Collect all contacts from all source CSVs
  const allContacts = new Map(); // email -> contact object

  // Source 1: montpellier-contacts-v2.csv (154 rows)
  const v2 = parseSemicolonCSV(path.join(CAMPAIGNS_DIR, 'montpellier-contacts-v2.csv'));
  console.log(`  montpellier-contacts-v2.csv: ${v2.length} rows`);
  let v2WithEmail = 0, v2WithoutEmail = 0;
  v2.forEach(c => {
    const name = c.restaurant_name || c.name || 'Restaurant';
    const email = (c.email || '').trim();
    if (isValidEmail(email)) {
      v2WithEmail++;
      const key = email.toLowerCase();
      if (!allContacts.has(key)) {
        allContacts.set(key, { name, email, category: c.cuisine_type || '', phone: c.phone || '', address: c.address || '', city: c.neighborhood || 'Montpellier', source: 'montpellier-contacts-v2.csv' });
      }
    } else {
      v2WithoutEmail++;
    }
  });
  console.log(`    -> With email: ${v2WithEmail}, Without: ${v2WithoutEmail}`);

  // Source 2: montpellier-region-contacts.csv (103 rows)
  const region = parseSemicolonCSV(path.join(CAMPAIGNS_DIR, 'montpellier-region-contacts.csv'));
  console.log(`  montpellier-region-contacts.csv: ${region.length} rows`);
  let regWithEmail = 0, regWithoutEmail = 0;
  region.forEach(c => {
    const name = c.restaurant_name || c.name || 'Restaurant';
    const email = (c.email || '').trim();
    if (isValidEmail(email)) {
      regWithEmail++;
      const key = email.toLowerCase();
      if (!allContacts.has(key)) {
        allContacts.set(key, { name, email, category: c.cuisine_type || '', phone: c.phone || '', address: c.address || '', city: c.neighborhood || c.city || '', source: 'montpellier-region-contacts.csv' });
      }
    } else {
      regWithoutEmail++;
    }
  });
  console.log(`    -> With email: ${regWithEmail}, Without: ${regWithoutEmail}`);

  // Source 3: phase2-contacts.csv (8 rows)
  const phase2 = parseSemicolonCSV(path.join(CAMPAIGNS_DIR, 'phase2-contacts.csv'));
  console.log(`  phase2-contacts.csv: ${phase2.length} rows`);
  let p2WithEmail = 0, p2WithoutEmail = 0;
  phase2.forEach(c => {
    const name = c.restaurant_name || c.name || 'Restaurant';
    const email = (c.email || '').trim();
    if (isValidEmail(email)) {
      p2WithEmail++;
      const key = email.toLowerCase();
      if (!allContacts.has(key)) {
        allContacts.set(key, { name, email, category: c.cuisine_type || '', phone: c.phone || '', address: c.address || '', city: c.city || '', source: 'phase2-contacts.csv' });
      }
    } else {
      p2WithoutEmail++;
    }
  });
  console.log(`    -> With email: ${p2WithEmail}, Without: ${p2WithoutEmail}`);

  // Source 4: phase3-4-contacts.csv (7 rows)
  const phase34 = parseSemicolonCSV(path.join(CAMPAIGNS_DIR, 'phase3-4-contacts.csv'));
  console.log(`  phase3-4-contacts.csv: ${phase34.length} rows`);
  let p34WithEmail = 0, p34WithoutEmail = 0;
  phase34.forEach(c => {
    const name = c.restaurant_name || c.name || 'Restaurant';
    const email = (c.email || '').trim();
    if (isValidEmail(email)) {
      p34WithEmail++;
      const key = email.toLowerCase();
      if (!allContacts.has(key)) {
        allContacts.set(key, { name, email, category: c.cuisine_type || '', phone: c.phone || '', address: c.address || '', city: c.city || '', source: 'phase3-4-contacts.csv' });
      }
    } else {
      p34WithoutEmail++;
    }
  });
  console.log(`    -> With email: ${p34WithEmail}, Without: ${p34WithoutEmail}`);

  // Source 5: data/scraping/gmaps-montpellier-2026-04-07.csv
  const gmapsMtp = parseCommaCSV(path.join(SCRAPING_DIR, 'gmaps-montpellier-2026-04-07.csv'));
  console.log(`  gmaps-montpellier-2026-04-07.csv: ${gmapsMtp.length} rows`);
  let gmWithEmail = 0, gmWithoutEmail = 0;
  gmapsMtp.forEach(c => {
    const name = c.name || 'Restaurant';
    const email = (c.email || '').trim();
    if (isValidEmail(email)) {
      gmWithEmail++;
      const key = email.toLowerCase();
      if (!allContacts.has(key)) {
        allContacts.set(key, { name, email, category: c.category || '', phone: c.phone || '', address: c.address || '', city: 'Montpellier', source: 'gmaps-montpellier-scraping' });
      }
    } else {
      gmWithoutEmail++;
    }
  });
  console.log(`    -> With email: ${gmWithEmail}, Without: ${gmWithoutEmail}`);

  console.log(`\n  TOTAL unique contacts with valid emails: ${allContacts.size}`);

  // Step 3: Filter out already-sent
  const unsent = [];
  const alreadySentList = [];
  for (const [emailKey, contact] of allContacts) {
    if (alreadySent.has(emailKey)) {
      alreadySentList.push(contact);
    } else {
      unsent.push(contact);
    }
  }

  console.log(`  Already sent (will skip): ${alreadySentList.size || alreadySentList.length}`);
  console.log(`  NEW contacts to send: ${unsent.length}`);

  // Step 4: Create consolidated CSV
  const csvHeader = 'restaurant_name;cuisine_type;email;phone;address;city;source';
  const csvLines = [csvHeader];
  unsent.forEach(c => {
    csvLines.push(`${c.name};${c.category};${c.email};${c.phone};${c.address};${c.city};${c.source}`);
  });
  const consolidatedPath = path.join(CAMPAIGNS_DIR, 'remaining-contacts.csv');
  fs.writeFileSync(consolidatedPath, csvLines.join('\n'), 'utf-8');
  console.log(`\n  Consolidated CSV saved: ${consolidatedPath}`);
  console.log(`  Entries in consolidated CSV: ${unsent.length}`);

  // Step 5: Print ALL email addresses found
  console.log('\n========================================');
  console.log('  ALL EMAIL ADDRESSES TO SEND');
  console.log('========================================\n');
  unsent.forEach((c, i) => {
    console.log(`  ${String(i + 1).padStart(3, ' ')}. ${c.email.padEnd(45)} [${c.name}]`);
  });

  // Step 6: Summary statistics
  const totalWithEmails = allContacts.size;
  const totalV2Rows = v2.length;
  const totalRegionRows = region.length;
  const totalPhase2Rows = phase2.length;
  const totalPhase34Rows = phase34.length;
  const totalGmapsRows = gmapsMtp.length;
  const totalRows = totalV2Rows + totalRegionRows + totalPhase2Rows + totalPhase34Rows + totalGmapsRows;
  const totalWithoutEmails = totalRows - (v2WithEmail + regWithEmail + p2WithEmail + p34WithEmail + gmWithEmail);

  console.log('\n========================================');
  console.log('  SUMMARY');
  console.log('========================================');
  console.log(`  Total rows across all files: ${totalRows}`);
  console.log(`  Total with valid emails: ${v2WithEmail + regWithEmail + p2WithEmail + p34WithEmail + gmWithEmail}`);
  console.log(`  Total without emails: ${totalWithoutEmails}`);
  console.log(`  Unique emails (after dedup): ${totalWithEmails}`);
  console.log(`  Already sent (from V1 + relance): ${alreadySentList.length}`);
  console.log(`  Remaining to send: ${unsent.length}`);
  console.log('========================================\n');

  // Step 7: Send emails
  if (unsent.length === 0) {
    console.log('  No unsent contacts to process. Done!');
    return;
  }

  console.log('========================================');
  console.log('  SENDING CAMPAIGN EMAILS');
  console.log(`  Rate: 1 email / ${RATE_LIMIT_MS}ms`);
  console.log(`  Batch pause: ${BATCH_PAUSE_MS}ms every ${BATCH_SIZE} emails`);
  console.log('========================================\n');

  // Load existing sent log for tracking
  const sentLog = loadSentEmails();
  const results = [];
  let sentCount = 0;
  let failedCount = 0;

  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const resultsFile = path.join(DATA_CAMPAIGNS_DIR, `campaign-results-${timestamp}.json`);

  for (let i = 0; i < unsent.length; i++) {
    const contact = unsent[i];
    const cuisine = detectCuisine(contact.name, contact.category);
    const { subject, html } = buildCampaignEmail(contact.name, contact.category);

    console.log(`  [${i + 1}/${unsent.length}] ${contact.name} <${contact.email}> [${cuisine}]`);

    const result = await sendEmail(contact.email, subject, html);

    if (result.success) {
      console.log(`    -> SENT (${result.messageId})`);
      sentCount++;
      sentLog.add(contact.email.toLowerCase());
      results.push({
        email: contact.email,
        name: contact.name,
        status: 'sent',
        messageId: result.messageId,
        sentAt: new Date().toISOString(),
      });
    } else {
      console.log(`    -> FAILED: ${result.error}`);
      failedCount++;
      results.push({
        email: contact.email,
        name: contact.name,
        status: 'failed',
        error: result.error,
        sentAt: new Date().toISOString(),
      });
    }

    // Save sent log incrementally
    saveSentLog(sentLog);

    // Rate limiting
    await sleep(RATE_LIMIT_MS);

    // Batch pause
    if ((i + 1) % BATCH_SIZE === 0 && i + 1 < unsent.length) {
      console.log(`\n  --- Batch pause (${BATCH_PAUSE_MS / 1000}s) after ${i + 1} emails ---\n`);
      await sleep(BATCH_PAUSE_MS);
    }
  }

  // Save results
  if (!fs.existsSync(DATA_CAMPAIGNS_DIR)) {
    fs.mkdirSync(DATA_CAMPAIGNS_DIR, { recursive: true });
  }
  fs.writeFileSync(resultsFile, JSON.stringify({
    campaign: {
      startedAt: new Date().toISOString(),
      sources: ['montpellier-contacts-v2.csv', 'montpellier-region-contacts.csv', 'phase2-contacts.csv', 'phase3-4-contacts.csv', 'gmaps-montpellier-2026-04-07.csv'],
    },
    summary: {
      total: unsent.length,
      sent: sentCount,
      failed: failedCount,
    },
    results,
  }, null, 2), 'utf-8');

  console.log('\n========================================');
  console.log('  CAMPAIGN COMPLETE');
  console.log(`  Total processed: ${unsent.length}`);
  console.log(`  Sent: ${sentCount}`);
  console.log(`  Failed: ${failedCount}`);
  console.log(`  Results: ${resultsFile}`);
  console.log(`  Sent log: ${SENT_LOG_FILE}`);
  console.log('========================================\n');
}

main().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});
