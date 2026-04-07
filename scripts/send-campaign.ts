#!/usr/bin/env npx tsx
// ============================================================
// RestauMargin — Bulk Campaign Email Sender via Resend
// Usage: npx tsx scripts/send-campaign.ts <csv-file> [options]
// ============================================================

import * as fs from 'fs';
import * as path from 'path';

// Import the campaign email builder from the existing codebase
// We replicate the interface here to keep the script self-contained for CLI use
// The actual buildCampaignEmail is in api/utils/emailTemplates.ts

// ── Types ──────────────────────────────────────────────────────────
interface Contact {
  name: string;
  email: string;
  phone?: string;
  address?: string;
  city?: string;
  website?: string;
  category?: string;
}

interface SendResult {
  email: string;
  name: string;
  status: 'sent' | 'failed' | 'skipped' | 'bounced';
  messageId?: string;
  error?: string;
  sentAt: string;
}

// ── Config ─────────────────────────────────────────────────────────
const RATE_LIMIT_MS = 1100; // 1 email per ~1.1 seconds (safe margin)
const BATCH_SIZE = 50; // Pause after every N emails
const BATCH_PAUSE_MS = 5000; // 5 second pause between batches
const OUTPUT_DIR = path.join(__dirname, '..', 'data', 'campaigns');
const SENT_LOG_FILE = path.join(OUTPUT_DIR, 'sent-log.json');
const FROM_ADDRESS = 'RestauMargin <contact@restaumargin.fr>';

// ── Helpers ────────────────────────────────────────────────────────
function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function loadSentLog(): Set<string> {
  if (!fs.existsSync(SENT_LOG_FILE)) return new Set();
  try {
    const data = JSON.parse(fs.readFileSync(SENT_LOG_FILE, 'utf-8'));
    return new Set(Array.isArray(data) ? data : []);
  } catch {
    return new Set();
  }
}

function saveSentLog(sentEmails: Set<string>): void {
  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  }
  fs.writeFileSync(SENT_LOG_FILE, JSON.stringify([...sentEmails], null, 2), 'utf-8');
}

function parseCSV(filePath: string): Contact[] {
  const content = fs.readFileSync(filePath, 'utf-8');
  const lines = content.split('\n').filter(l => l.trim());

  if (lines.length < 2) {
    console.error('CSV file is empty or has no data rows');
    return [];
  }

  // Parse header
  const header = parseCSVLine(lines[0]);
  const headerMap: Record<string, number> = {};
  header.forEach((col, idx) => {
    headerMap[col.trim().toLowerCase()] = idx;
  });

  // Find relevant columns
  const nameCol = headerMap['name'] ?? headerMap['nom'] ?? headerMap['restaurant'] ?? -1;
  const emailCol = headerMap['email'] ?? headerMap['e-mail'] ?? headerMap['mail'] ?? -1;
  const phoneCol = headerMap['phone'] ?? headerMap['telephone'] ?? headerMap['tel'] ?? -1;
  const addressCol = headerMap['address'] ?? headerMap['adresse'] ?? -1;
  const cityCol = headerMap['city'] ?? headerMap['ville'] ?? -1;
  const websiteCol = headerMap['website'] ?? headerMap['site'] ?? headerMap['url'] ?? -1;
  const categoryCol = headerMap['category'] ?? headerMap['categorie'] ?? headerMap['cuisine'] ?? -1;

  if (emailCol === -1) {
    console.error('No "email" column found in CSV header. Columns found:', header.join(', '));
    return [];
  }

  const contacts: Contact[] = [];
  for (let i = 1; i < lines.length; i++) {
    const cols = parseCSVLine(lines[i]);
    const email = (cols[emailCol] || '').trim();
    if (!email || !email.includes('@')) continue;

    contacts.push({
      name: (nameCol >= 0 ? cols[nameCol] : '').trim() || 'Restaurant',
      email,
      phone: phoneCol >= 0 ? (cols[phoneCol] || '').trim() : undefined,
      address: addressCol >= 0 ? (cols[addressCol] || '').trim() : undefined,
      city: cityCol >= 0 ? (cols[cityCol] || '').trim() : undefined,
      website: websiteCol >= 0 ? (cols[websiteCol] || '').trim() : undefined,
      category: categoryCol >= 0 ? (cols[categoryCol] || '').trim() : undefined,
    });
  }

  return contacts;
}

function parseCSVLine(line: string): string[] {
  const result: string[] = [];
  let current = '';
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    if (char === '"') {
      if (inQuotes && line[i + 1] === '"') {
        current += '"';
        i++;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (char === ',' && !inQuotes) {
      result.push(current);
      current = '';
    } else {
      current += char;
    }
  }
  result.push(current);
  return result;
}

// ── Campaign email builder (self-contained for CLI) ────────────────
// This mirrors the logic from api/utils/emailTemplates.ts
// to keep the script runnable without importing the full server codebase

const CUISINE_HOOKS: Record<string, { subject: string; hook: string; pain: string; benefit: string }> = {
  brasserie: {
    subject: 'Brasserie : savez-vous combien vous coute votre plat du jour ?',
    hook: 'Chaque midi, vous servez 50 a 100 couverts. Le plat du jour tourne, les prix fournisseurs bougent... Mais votre marge, elle, vous la connaissez vraiment ?',
    pain: 'Sans outil adapte, impossible de savoir si votre blanquette du mardi est rentable ou si votre entrecote du vendredi vous fait perdre de l\'argent.',
    benefit: 'RestauMargin calcule le food cost de chaque plat en temps reel. Vous ajustez vos prix et vos portions avant que la marge ne s\'effondre.',
  },
  pizzeria: {
    subject: 'Pizzeria : chaque pizza est-elle vraiment rentable ?',
    hook: 'Farine, mozzarella, tomates San Marzano... Les ingredients d\'une vraie pizza ont un cout. Et avec 15-20 pizzas a la carte, les ecarts de marge peuvent etre enormes.',
    pain: 'Votre 4 fromages est probablement 2x plus chere a produire que votre margherita. Vendez-vous la difference au bon prix ?',
    benefit: 'RestauMargin analyse chaque pizza de votre carte, compare les couts, et vous aide a fixer des prix qui refletent la realite de vos couts.',
  },
  general: {
    subject: 'Restaurateurs : arretez de perdre de l\'argent sur chaque plat',
    hook: 'En France, 1 restaurant sur 3 ferme dans les 3 premieres annees. La raison n1 ? Une mauvaise maitrise des couts matieres.',
    pain: 'Si vous ne connaissez pas le food cost exact de chaque plat de votre carte, vous pilotez votre restaurant a l\'aveugle.',
    benefit: 'RestauMargin est l\'outil qui vous donne enfin une vision claire : cout par plat, marge reelle, alertes prix, fiches techniques automatisees par IA.',
  },
};

function esc(str: string): string {
  return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

function buildCampaignEmailLocal(name: string, category?: string): { subject: string; html: string } {
  const cuisine = CUISINE_HOOKS[(category || 'general').toLowerCase()] || CUISINE_HOOKS.general;
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

// ── Detect cuisine type from category/name ────────────────────────
function detectCuisine(contact: Contact): string {
  const text = `${contact.name} ${contact.category || ''}`.toLowerCase();
  if (text.includes('pizza') || text.includes('pizzeria')) return 'pizzeria';
  if (text.includes('brasserie') || text.includes('bistro') || text.includes('bistrot')) return 'brasserie';
  return 'general';
}

// ── Send email via Resend API ──────────────────────────────────────
async function sendEmail(
  apiKey: string,
  to: string,
  subject: string,
  html: string,
): Promise<{ success: boolean; messageId?: string; error?: string }> {
  try {
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: FROM_ADDRESS,
        to: [to],
        subject,
        html,
      }),
    });

    const data = await res.json() as any;

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

// ── Main campaign send flow ────────────────────────────────────────
async function runCampaign(csvFile: string, options: {
  dryRun: boolean;
  limit?: number;
  cuisine?: string;
}): Promise<void> {
  console.log(`\n========================================`);
  console.log(`  RestauMargin Campaign Sender`);
  console.log(`  CSV: ${csvFile}`);
  console.log(`  Mode: ${options.dryRun ? 'DRY RUN (no emails sent)' : 'LIVE SEND'}`);
  if (options.limit) console.log(`  Limit: ${options.limit}`);
  if (options.cuisine) console.log(`  Cuisine override: ${options.cuisine}`);
  console.log(`========================================\n`);

  // Load CSV contacts
  const contacts = parseCSV(csvFile);
  console.log(`  Loaded ${contacts.length} contacts with email from CSV\n`);

  if (contacts.length === 0) {
    console.error('No valid contacts found. Check CSV format.');
    process.exit(1);
  }

  // Check API key (unless dry run)
  const apiKey = process.env.RESEND_API_KEY;
  if (!options.dryRun && !apiKey) {
    console.error('RESEND_API_KEY environment variable is required for live send.');
    console.error('Set it: export RESEND_API_KEY=re_...');
    console.error('Or run with --dry-run to preview.');
    process.exit(1);
  }

  // Load sent log to skip already-sent
  const sentLog = loadSentLog();
  const toSend = contacts.filter(c => !sentLog.has(c.email.toLowerCase()));
  const skippedCount = contacts.length - toSend.length;

  if (skippedCount > 0) {
    console.log(`  Skipping ${skippedCount} already-sent emails`);
  }

  const limit = options.limit ? Math.min(options.limit, toSend.length) : toSend.length;
  console.log(`  Will process: ${limit} emails\n`);

  // Ensure output directory
  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  }

  // Results log
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const resultsFile = path.join(OUTPUT_DIR, `campaign-results-${timestamp}.json`);
  const results: SendResult[] = [];

  let sentCount = 0;
  let failedCount = 0;
  let skipCount = 0;

  for (let i = 0; i < limit; i++) {
    const contact = toSend[i];
    const cuisine = options.cuisine || detectCuisine(contact);
    const { subject, html } = buildCampaignEmailLocal(contact.name, cuisine);

    console.log(`  [${i + 1}/${limit}] ${contact.name} <${contact.email}> [${cuisine}]`);

    if (options.dryRun) {
      console.log(`    -> DRY RUN: would send "${subject}"`);
      results.push({
        email: contact.email,
        name: contact.name,
        status: 'skipped',
        sentAt: new Date().toISOString(),
      });
      skipCount++;
      continue;
    }

    // Actually send
    const result = await sendEmail(apiKey!, contact.email, subject, html);

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
        status: result.error?.includes('bounce') ? 'bounced' : 'failed',
        error: result.error,
        sentAt: new Date().toISOString(),
      });
    }

    // Save sent log incrementally (don't lose progress on crash)
    saveSentLog(sentLog);

    // Rate limiting
    await sleep(RATE_LIMIT_MS);

    // Batch pause
    if ((i + 1) % BATCH_SIZE === 0 && i + 1 < limit) {
      console.log(`\n  --- Batch pause (${BATCH_PAUSE_MS / 1000}s) after ${i + 1} emails ---\n`);
      await sleep(BATCH_PAUSE_MS);
    }
  }

  // Save final results
  fs.writeFileSync(resultsFile, JSON.stringify({
    campaign: {
      csvFile,
      startedAt: new Date().toISOString(),
      dryRun: options.dryRun,
      cuisine: options.cuisine || 'auto-detect',
    },
    summary: {
      total: limit,
      sent: sentCount,
      failed: failedCount,
      skipped: skipCount + skippedCount,
      bounced: results.filter(r => r.status === 'bounced').length,
    },
    results,
  }, null, 2), 'utf-8');

  console.log(`\n========================================`);
  console.log(`  CAMPAIGN COMPLETE`);
  console.log(`  Total processed: ${limit}`);
  console.log(`  Sent: ${sentCount}`);
  console.log(`  Failed: ${failedCount}`);
  console.log(`  Skipped (already sent): ${skippedCount}`);
  if (options.dryRun) console.log(`  Dry run skipped: ${skipCount}`);
  console.log(`  Results: ${resultsFile}`);
  console.log(`  Sent log: ${SENT_LOG_FILE}`);
  console.log(`========================================\n`);
}

// ── CLI ────────────────────────────────────────────────────────────
async function main() {
  const args = process.argv.slice(2);

  if (args.length === 0 || args.includes('--help')) {
    console.log(`
  RestauMargin — Campaign Email Sender
  =======================================

  Usage:
    npx tsx scripts/send-campaign.ts <csv-file> [options]

  Examples:
    npx tsx scripts/send-campaign.ts data/scraping/restaurants-lyon-2026-04-07.csv --dry-run
    npx tsx scripts/send-campaign.ts data/scraping/pj-paris-2026-04-07.csv --limit 10
    npx tsx scripts/send-campaign.ts contacts.csv --cuisine pizzeria

  Required:
    RESEND_API_KEY    Environment variable with Resend API key (not needed for --dry-run)

  Options:
    --dry-run       Preview what would be sent without actually sending
    --limit N       Maximum number of emails to send (default: all)
    --cuisine TYPE  Force cuisine type: general, brasserie, pizzeria (default: auto-detect)
    --help          Show this help message

  CSV Format:
    Must have at minimum a header row with "email" column.
    Recognized columns: name, email, phone, address, city, website, category

  Rate Limiting:
    - 1 email per second
    - 5 second pause every 50 emails
    - Already-sent emails are skipped (tracked in data/campaigns/sent-log.json)

  Output:
    Results: data/campaigns/campaign-results-<timestamp>.json
    Sent log: data/campaigns/sent-log.json (persistent across runs)
    `);
    process.exit(0);
  }

  const csvFile = args[0];
  if (!fs.existsSync(csvFile)) {
    // Try relative to project root
    const altPath = path.join(__dirname, '..', csvFile);
    if (fs.existsSync(altPath)) {
      args[0] = altPath;
    } else {
      console.error(`CSV file not found: ${csvFile}`);
      console.error(`Also tried: ${altPath}`);
      process.exit(1);
    }
  }

  const dryRun = args.includes('--dry-run');
  const limitIdx = args.indexOf('--limit');
  const limit = limitIdx !== -1 ? parseInt(args[limitIdx + 1], 10) : undefined;
  const cuisineIdx = args.indexOf('--cuisine');
  const cuisine = cuisineIdx !== -1 ? args[cuisineIdx + 1] : undefined;

  await runCampaign(args[0], { dryRun, limit, cuisine });
}

main().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});
