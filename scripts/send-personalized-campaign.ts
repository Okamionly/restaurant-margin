#!/usr/bin/env npx tsx
// ============================================================
// RestauMargin — Personalized Campaign Email Sender via Resend
// Usage: npx tsx scripts/send-personalized-campaign.ts [options]
//
// Reads ALL CSV files in docs/campaigns/ and data/scraping/,
// deduplicates against sent-log.json, personalizes each email
// by city, cuisine type, and restaurant name, then sends via
// Resend with rate limiting and A/B subject line rotation.
// ============================================================

import * as fs from 'fs';
import * as path from 'path';

// ── Types ──────────────────────────────────────────────────────────
interface Contact {
  name: string;
  email: string;
  phone?: string;
  address?: string;
  city?: string;
  website?: string;
  category?: string;
  source?: string;
}

interface SendResult {
  email: string;
  name: string;
  city: string;
  cuisine: string;
  subjectVariant: 'A' | 'B' | 'C';
  subject: string;
  status: 'sent' | 'failed' | 'skipped' | 'dry-run';
  messageId?: string;
  error?: string;
  sentAt: string;
}

// ── Config ─────────────────────────────────────────────────────────
const RESEND_API_KEY = 're_7ubbQbFa_GVBfFkYLpW3ga9DQUdT35rAD';
const RATE_LIMIT_MS = 1200;        // 1 email per 1.2 seconds
const BATCH_SIZE = 50;             // Pause after every 50 emails
const BATCH_PAUSE_MS = 10000;      // 10 second pause between batches
const PROJECT_ROOT = path.join(__dirname, '..');
const OUTPUT_DIR = path.join(PROJECT_ROOT, 'data', 'campaigns');
const SENT_LOG_FILE = path.join(OUTPUT_DIR, 'sent-log.json');
const FROM_ADDRESS = 'RestauMargin <contact@restaumargin.fr>';

const CSV_DIRS = [
  path.join(PROJECT_ROOT, 'docs', 'campaigns'),
  path.join(PROJECT_ROOT, 'data', 'scraping'),
];

// ── Cuisine-specific hooks ─────────────────────────────────────────
const CUISINE_HOOKS: Record<string, string> = {
  francaise:  'Vos fiches techniques meritent un outil a la hauteur',
  italienne:  'De la pizza au risotto, calculez vos marges en 2 clics',
  japonaise:  'Sushi, ramen, bento — gerez votre food cost avec precision',
  asiatique:  'Du wok au vapeur, optimisez chaque ingredient',
  burger:     'Le prix de votre steak change? RestauMargin vous alerte',
  brasserie:  'Plat du jour, formule midi — suivez vos marges en temps reel',
  pizzeria:   'Pate, sauce, garnitures — le cout exact de chaque pizza',
  general:    'Calculez le cout reel de chaque plat en 5 minutes',
};

// ── Helpers ────────────────────────────────────────────────────────
function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function loadSentLog(): Set<string> {
  if (!fs.existsSync(SENT_LOG_FILE)) return new Set();
  try {
    const data = JSON.parse(fs.readFileSync(SENT_LOG_FILE, 'utf-8'));
    return new Set((Array.isArray(data) ? data : []).map((e: string) => e.toLowerCase()));
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

// ── CSV Parsing (handles both , and ; delimiters) ──────────────────
function detectDelimiter(headerLine: string): string {
  const semicolons = (headerLine.match(/;/g) || []).length;
  const commas = (headerLine.match(/,/g) || []).length;
  return semicolons > commas ? ';' : ',';
}

function parseCSVLine(line: string, delimiter: string): string[] {
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
    } else if (char === delimiter && !inQuotes) {
      result.push(current);
      current = '';
    } else {
      current += char;
    }
  }
  result.push(current);
  return result;
}

function parseCSV(filePath: string): Contact[] {
  let content: string;
  try {
    content = fs.readFileSync(filePath, 'utf-8');
  } catch {
    return [];
  }

  const lines = content.split('\n').filter(l => l.trim());
  if (lines.length < 2) return [];

  const delimiter = detectDelimiter(lines[0]);
  const header = parseCSVLine(lines[0], delimiter);
  const headerMap: Record<string, number> = {};
  header.forEach((col, idx) => {
    headerMap[col.trim().toLowerCase().replace(/[\ufeff]/g, '')] = idx;
  });

  // Flexible column detection
  const nameCol = headerMap['restaurant_name'] ?? headerMap['name'] ?? headerMap['nom'] ?? headerMap['restaurant'] ?? -1;
  const emailCol = headerMap['email'] ?? headerMap['e-mail'] ?? headerMap['mail'] ?? -1;
  const phoneCol = headerMap['phone'] ?? headerMap['telephone'] ?? headerMap['tel'] ?? -1;
  const addressCol = headerMap['address'] ?? headerMap['adresse'] ?? -1;
  const cityCol = headerMap['city'] ?? headerMap['ville'] ?? headerMap['neighborhood'] ?? -1;
  const websiteCol = headerMap['website'] ?? headerMap['site'] ?? headerMap['url'] ?? -1;
  const categoryCol = headerMap['category'] ?? headerMap['categorie'] ?? headerMap['cuisine'] ?? headerMap['cuisine_type'] ?? -1;
  const sourceCol = headerMap['source'] ?? -1;

  if (emailCol === -1) return [];

  const contacts: Contact[] = [];
  for (let i = 1; i < lines.length; i++) {
    const cols = parseCSVLine(lines[i], delimiter);
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
      source: sourceCol >= 0 ? (cols[sourceCol] || '').trim() : path.basename(filePath),
    });
  }

  return contacts;
}

// ── Discover and load all CSVs ─────────────────────────────────────
function loadAllContacts(): Contact[] {
  const allContacts: Contact[] = [];

  for (const dir of CSV_DIRS) {
    if (!fs.existsSync(dir)) continue;
    const files = fs.readdirSync(dir).filter(f => f.endsWith('.csv'));
    for (const file of files) {
      const filePath = path.join(dir, file);
      const contacts = parseCSV(filePath);
      if (contacts.length > 0) {
        console.log(`  [CSV] ${path.relative(PROJECT_ROOT, filePath)} -> ${contacts.length} contacts`);
      }
      allContacts.push(...contacts);
    }
  }

  return allContacts;
}

// ── Deduplicate contacts by email ──────────────────────────────────
function deduplicateContacts(contacts: Contact[]): Contact[] {
  const seen = new Map<string, Contact>();
  for (const c of contacts) {
    const key = c.email.toLowerCase();
    if (!seen.has(key)) {
      seen.set(key, c);
    } else {
      // Keep the contact with more data (prefer one with city and category)
      const existing = seen.get(key)!;
      if ((!existing.city && c.city) || (!existing.category && c.category)) {
        seen.set(key, { ...existing, ...c, email: existing.email });
      }
    }
  }
  return [...seen.values()];
}

// ── Detect cuisine type from category/name ─────────────────────────
function detectCuisine(contact: Contact): string {
  const text = `${contact.name} ${contact.category || ''}`.toLowerCase();

  if (text.includes('pizza') || text.includes('pizzeria')) return 'pizzeria';
  if (text.includes('brasserie') || text.includes('bistro') || text.includes('bistrot')) return 'brasserie';
  if (text.includes('japonais') || text.includes('sushi') || text.includes('ramen') || text.includes('bento')) return 'japonaise';
  if (text.includes('italien') || text.includes('risotto') || text.includes('trattoria') || text.includes('pasta')) return 'italienne';
  if (text.includes('asiatique') || text.includes('wok') || text.includes('thaï') || text.includes('thai') || text.includes('vietnamien') || text.includes('chinois')) return 'asiatique';
  if (text.includes('burger') || text.includes('smash')) return 'burger';
  if (text.includes('francais') || text.includes('français') || text.includes('gastronomique') || text.includes('bistronomique')) return 'francaise';
  if (text.includes('poisson') || text.includes('fruits de mer') || text.includes('seafood')) return 'francaise';
  if (text.includes('plat du jour') || text.includes('formule')) return 'brasserie';

  return 'general';
}

// ── Subject line A/B/C rotation ────────────────────────────────────
type SubjectVariant = 'A' | 'B' | 'C';

function getSubjectVariant(index: number): SubjectVariant {
  const variants: SubjectVariant[] = ['A', 'B', 'C'];
  return variants[index % 3];
}

function buildSubjectLine(contact: Contact, variant: SubjectVariant): string {
  const name = contact.name && contact.name !== 'Restaurant' ? contact.name : 'Votre restaurant';
  const city = contact.city || 'France';

  switch (variant) {
    case 'A':
      return `${name}, savez-vous combien vous coute votre plat du jour?`;
    case 'B':
      return `Restaurateurs de ${city} — l'outil qui calcule vos marges automatiquement`;
    case 'C':
      return `${name} — 7 jours gratuits pour transformer votre gestion`;
  }
}

// ── HTML email builder ─────────────────────────────────────────────
function esc(str: string): string {
  return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

function buildPersonalizedEmail(contact: Contact, cuisine: string, subject: string): string {
  const hook = CUISINE_HOOKS[cuisine] || CUISINE_HOOKS.general;
  const city = contact.city || '';
  const name = contact.name && contact.name !== 'Restaurant' ? contact.name : '';

  // Build personalized greeting
  let greeting: string;
  if (name && city) {
    greeting = `Bonjour ${esc(name)},`;
  } else if (name) {
    greeting = `Bonjour ${esc(name)},`;
  } else if (city) {
    greeting = `Cher restaurateur de ${esc(city)},`;
  } else {
    greeting = 'Bonjour,';
  }

  // Build city-specific intro
  const cityIntro = city
    ? `<p style="color:#1a1a2e;font-size:15px;line-height:1.8;margin:0 0 18px;">Cher restaurateur de <strong>${esc(city)}</strong>, ${esc(hook.charAt(0).toLowerCase() + hook.slice(1))}.</p>`
    : `<p style="color:#1a1a2e;font-size:15px;line-height:1.8;margin:0 0 18px;">${esc(hook)}.</p>`;

  return `<!DOCTYPE html>
<html lang="fr">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width"></head>
<body style="margin:0;padding:0;background:#f4f4f5;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
<table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:#f4f4f5;">
<tr><td align="center" style="padding:40px 16px;">
<table role="presentation" width="600" cellspacing="0" cellpadding="0" style="background:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,0.06);">

<!-- Header -->
<tr><td style="background:linear-gradient(135deg,#0d9488,#06b6d4);padding:28px 30px;text-align:center;">
  <span style="color:#ffffff;font-size:22px;font-weight:700;letter-spacing:-0.5px;">&#127860; RestauMargin</span>
  <p style="color:rgba(255,255,255,0.85);margin:6px 0 0;font-size:13px;letter-spacing:0.3px;">L'outil de gestion des marges pour restaurateurs</p>
</td></tr>

<!-- Body -->
<tr><td style="padding:30px;">

  <!-- Personalized greeting -->
  <p style="color:#1a1a2e;font-size:15px;line-height:1.8;margin:0 0 18px;">${greeting}</p>

  <!-- Cuisine-specific hook with city -->
  ${cityIntro}

  <p style="color:#1a1a2e;font-size:15px;line-height:1.8;margin:0 0 18px;">
    En France, <strong>1 restaurant sur 3</strong> ferme dans les 3 premieres annees. La raison n&deg;1 ?
    Une mauvaise maitrise des couts matieres. Si vous ne connaissez pas le food cost exact de chaque plat,
    vous pilotez votre restaurant a l'aveugle.
  </p>

  <div style="border-top:1px solid #e5e5e5;margin:24px 0;"></div>

  <!-- 5 Key Features -->
  <p style="color:#0d9488;font-size:16px;font-weight:700;margin:0 0 16px;">&#9989; Ce que RestauMargin fait pour vous :</p>

  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="margin:0 0 24px;">
    <tr><td style="padding:8px 0;vertical-align:top;">
      <table role="presentation" cellspacing="0" cellpadding="0">
        <tr>
          <td style="padding:0 12px 0 0;vertical-align:top;color:#0d9488;font-size:18px;">&#127908;</td>
          <td style="color:#1a1a2e;font-size:14px;line-height:1.6;">
            <strong>Fiche technique par la voix</strong> &mdash; Dites &laquo; risotto aux cepes, 4 portions, 19&euro; &raquo; et le food cost s'affiche en 10 secondes.
          </td>
        </tr>
      </table>
    </td></tr>
    <tr><td style="padding:8px 0;vertical-align:top;">
      <table role="presentation" cellspacing="0" cellpadding="0">
        <tr>
          <td style="padding:0 12px 0 0;vertical-align:top;color:#0d9488;font-size:18px;">&#128247;</td>
          <td style="color:#1a1a2e;font-size:14px;line-height:1.6;">
            <strong>Scan de factures par IA</strong> &mdash; Photographiez une facture fournisseur, l'IA lit les prix et met a jour vos couts automatiquement.
          </td>
        </tr>
      </table>
    </td></tr>
    <tr><td style="padding:8px 0;vertical-align:top;">
      <table role="presentation" cellspacing="0" cellpadding="0">
        <tr>
          <td style="padding:0 12px 0 0;vertical-align:top;color:#0d9488;font-size:18px;">&#128200;</td>
          <td style="color:#1a1a2e;font-size:14px;line-height:1.6;">
            <strong>Marges en temps reel</strong> &mdash; Food cost par plat, marge brute, marge nette. Tout est visible sur votre tableau de bord.
          </td>
        </tr>
      </table>
    </td></tr>
    <tr><td style="padding:8px 0;vertical-align:top;">
      <table role="presentation" cellspacing="0" cellpadding="0">
        <tr>
          <td style="padding:0 12px 0 0;vertical-align:top;color:#0d9488;font-size:18px;">&#128680;</td>
          <td style="color:#1a1a2e;font-size:14px;line-height:1.6;">
            <strong>Alertes prix fournisseurs</strong> &mdash; Un fournisseur augmente ses prix ? Vous etes alerte immediatement, avant que ca impacte vos marges.
          </td>
        </tr>
      </table>
    </td></tr>
    <tr><td style="padding:8px 0;vertical-align:top;">
      <table role="presentation" cellspacing="0" cellpadding="0">
        <tr>
          <td style="padding:0 12px 0 0;vertical-align:top;color:#0d9488;font-size:18px;">&#128230;</td>
          <td style="color:#1a1a2e;font-size:14px;line-height:1.6;">
            <strong>Commandes en 1 clic</strong> &mdash; Stock bas ? La commande part par email ou WhatsApp directement a votre fournisseur.
          </td>
        </tr>
      </table>
    </td></tr>
  </table>

  <div style="border-top:1px solid #e5e5e5;margin:24px 0;"></div>

  <!-- CTA Button -->
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
    <tr><td align="center" style="padding:8px 0 24px;">
      <a href="https://www.restaumargin.fr/login?mode=register" style="display:inline-block;padding:16px 40px;background:#0d9488;color:#ffffff;text-decoration:none;border-radius:8px;font-weight:700;font-size:16px;">
        Essayer gratuitement 7 jours &rarr;
      </a>
    </td></tr>
  </table>

  <!-- Trust badges -->
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="margin:0 0 24px;">
    <tr>
      <td width="33%" align="center" style="padding:12px 4px;">
        <div style="background:#f0fdfa;border-radius:8px;padding:12px 8px;">
          <span style="color:#0d9488;font-size:20px;font-weight:700;display:block;">150+</span>
          <span style="color:#6b7280;font-size:11px;">restaurants inscrits</span>
        </div>
      </td>
      <td width="33%" align="center" style="padding:12px 4px;">
        <div style="background:#f0fdfa;border-radius:8px;padding:12px 8px;">
          <span style="color:#0d9488;font-size:20px;font-weight:700;display:block;">7 jours</span>
          <span style="color:#6b7280;font-size:11px;">d'essai gratuit</span>
        </div>
      </td>
      <td width="33%" align="center" style="padding:12px 4px;">
        <div style="background:#f0fdfa;border-radius:8px;padding:12px 8px;">
          <span style="color:#0d9488;font-size:20px;font-weight:700;display:block;">Sans CB</span>
          <span style="color:#6b7280;font-size:11px;">sans engagement</span>
        </div>
      </td>
    </tr>
  </table>

  <p style="color:#6b7280;font-size:13px;text-align:center;margin:0 0 24px;">
    29&euro;/mois apres l'essai &mdash; Sans engagement &mdash; Annulation en 1 clic
  </p>

  <p style="color:#1a1a2e;font-size:15px;line-height:1.8;margin:0;">
    A bientot,<br>
    L'equipe RestauMargin<br>
    <span style="color:#6b7280;">Montpellier, France</span>
  </p>
</td></tr>

<!-- Footer -->
<tr><td style="background:#f9fafb;padding:20px 30px;border-top:1px solid #e5e5e5;">
  <p style="color:#9ca3af;font-size:11px;line-height:1.6;margin:0;text-align:center;">
    Vous recevez cet email car votre restaurant est reference publiquement sur Internet.<br>
    <a href="mailto:contact@restaumargin.fr?subject=Desabonnement&body=Merci de me desabonner de vos communications. Email : ${esc(contact.email)}" style="color:#9ca3af;text-decoration:underline;">Se desabonner</a>
    &nbsp;|&nbsp; <a href="https://www.restaumargin.fr" style="color:#9ca3af;text-decoration:underline;">restaumargin.fr</a>
    &nbsp;|&nbsp; RestauMargin &mdash; Montpellier, France
  </p>
</td></tr>

</table>
</td></tr>
</table>
</body>
</html>`;
}

// ── Send email via Resend API ──────────────────────────────────────
async function sendEmail(
  to: string,
  subject: string,
  html: string,
): Promise<{ success: boolean; messageId?: string; error?: string }> {
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

// ── Main campaign flow ─────────────────────────────────────────────
async function runPersonalizedCampaign(options: {
  dryRun: boolean;
  city?: string;
  limit?: number;
}): Promise<void> {
  const startTime = Date.now();

  console.log(`\n${'='.repeat(56)}`);
  console.log(`  RestauMargin — Personalized Campaign Sender`);
  console.log(`  Mode: ${options.dryRun ? 'DRY RUN (no emails sent)' : 'LIVE SEND'}`);
  if (options.city) console.log(`  City filter: ${options.city}`);
  if (options.limit) console.log(`  Limit: ${options.limit}`);
  console.log(`${'='.repeat(56)}\n`);

  // 1. Load all CSV contacts
  console.log('  [1/4] Loading CSV files...\n');
  const rawContacts = loadAllContacts();
  console.log(`\n  Total raw contacts: ${rawContacts.length}\n`);

  if (rawContacts.length === 0) {
    console.error('  No contacts found in any CSV. Check docs/campaigns/ and data/scraping/ directories.');
    process.exit(1);
  }

  // 2. Deduplicate by email
  console.log('  [2/4] Deduplicating contacts...');
  let contacts = deduplicateContacts(rawContacts);
  console.log(`  After dedup: ${contacts.length} unique contacts\n`);

  // 3. Filter by city if specified
  if (options.city) {
    const cityFilter = options.city.toLowerCase();
    contacts = contacts.filter(c => (c.city || '').toLowerCase().includes(cityFilter));
    console.log(`  After city filter ("${options.city}"): ${contacts.length} contacts\n`);
  }

  // 4. Remove already-sent emails
  console.log('  [3/4] Checking sent log...');
  const sentLog = loadSentLog();
  const toSend = contacts.filter(c => !sentLog.has(c.email.toLowerCase()));
  const alreadySent = contacts.length - toSend.length;
  if (alreadySent > 0) {
    console.log(`  Skipping ${alreadySent} already-sent emails`);
  }

  const limit = options.limit ? Math.min(options.limit, toSend.length) : toSend.length;
  console.log(`  Will process: ${limit} emails\n`);

  if (limit === 0) {
    console.log('  Nothing to send! All contacts already in sent log or no contacts match filters.');
    return;
  }

  // Ensure output directory
  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  }

  // 5. Send emails
  console.log('  [4/4] Sending personalized emails...\n');

  const dateStr = new Date().toISOString().slice(0, 10);
  const resultsFile = path.join(OUTPUT_DIR, `personalized-campaign-${dateStr}.json`);
  const results: SendResult[] = [];

  let sentCount = 0;
  let failedCount = 0;
  let dryRunCount = 0;

  // City and cuisine stats
  const cityStats: Record<string, number> = {};
  const cuisineStats: Record<string, number> = {};
  const variantStats: Record<string, number> = { A: 0, B: 0, C: 0 };

  for (let i = 0; i < limit; i++) {
    const contact = toSend[i];
    const cuisine = detectCuisine(contact);
    const variant = getSubjectVariant(i);
    const subject = buildSubjectLine(contact, variant);
    const html = buildPersonalizedEmail(contact, cuisine, subject);
    const city = contact.city || 'Inconnu';

    // Track stats
    cityStats[city] = (cityStats[city] || 0) + 1;
    cuisineStats[cuisine] = (cuisineStats[cuisine] || 0) + 1;
    variantStats[variant]++;

    const prefix = `  [${String(i + 1).padStart(String(limit).length, ' ')}/${limit}]`;
    console.log(`${prefix} ${contact.name} <${contact.email}> [${city}] [${cuisine}] [${variant}]`);

    if (options.dryRun) {
      console.log(`         -> DRY RUN: "${subject}"`);
      results.push({
        email: contact.email,
        name: contact.name,
        city,
        cuisine,
        subjectVariant: variant,
        subject,
        status: 'dry-run',
        sentAt: new Date().toISOString(),
      });
      dryRunCount++;
      continue;
    }

    // Actually send
    const result = await sendEmail(contact.email, subject, html);

    if (result.success) {
      console.log(`         -> SENT (${result.messageId})`);
      sentCount++;
      sentLog.add(contact.email.toLowerCase());
      results.push({
        email: contact.email,
        name: contact.name,
        city,
        cuisine,
        subjectVariant: variant,
        subject,
        status: 'sent',
        messageId: result.messageId,
        sentAt: new Date().toISOString(),
      });
    } else {
      console.log(`         -> FAILED: ${result.error}`);
      failedCount++;
      results.push({
        email: contact.email,
        name: contact.name,
        city,
        cuisine,
        subjectVariant: variant,
        subject,
        status: 'failed',
        error: result.error,
        sentAt: new Date().toISOString(),
      });
    }

    // Save sent log incrementally
    saveSentLog(sentLog);

    // Rate limiting
    await sleep(RATE_LIMIT_MS);

    // Batch pause every 50 emails
    if ((i + 1) % BATCH_SIZE === 0 && i + 1 < limit) {
      console.log(`\n  --- Batch pause (${BATCH_PAUSE_MS / 1000}s) after ${i + 1} emails ---\n`);
      await sleep(BATCH_PAUSE_MS);
    }
  }

  // Save results
  const campaignData = {
    campaign: {
      type: 'personalized',
      startedAt: new Date(startTime).toISOString(),
      completedAt: new Date().toISOString(),
      durationSeconds: Math.round((Date.now() - startTime) / 1000),
      dryRun: options.dryRun,
      cityFilter: options.city || null,
      limitApplied: options.limit || null,
    },
    summary: {
      totalProcessed: limit,
      sent: sentCount,
      failed: failedCount,
      dryRun: dryRunCount,
      alreadySentSkipped: alreadySent,
    },
    breakdown: {
      byCity: cityStats,
      byCuisine: cuisineStats,
      bySubjectVariant: variantStats,
    },
    results,
  };

  fs.writeFileSync(resultsFile, JSON.stringify(campaignData, null, 2), 'utf-8');

  // Summary
  console.log(`\n${'='.repeat(56)}`);
  console.log(`  CAMPAIGN COMPLETE`);
  console.log(`${'='.repeat(56)}`);
  console.log(`  Total processed:       ${limit}`);
  if (options.dryRun) {
    console.log(`  Dry run previewed:     ${dryRunCount}`);
  } else {
    console.log(`  Sent:                  ${sentCount}`);
    console.log(`  Failed:                ${failedCount}`);
  }
  console.log(`  Already sent (skipped): ${alreadySent}`);
  console.log(`  Duration:              ${Math.round((Date.now() - startTime) / 1000)}s`);
  console.log();
  console.log(`  By city:`);
  Object.entries(cityStats).sort((a, b) => b[1] - a[1]).forEach(([city, count]) => {
    console.log(`    ${city}: ${count}`);
  });
  console.log();
  console.log(`  By cuisine:`);
  Object.entries(cuisineStats).sort((a, b) => b[1] - a[1]).forEach(([cuisine, count]) => {
    console.log(`    ${cuisine}: ${count}`);
  });
  console.log();
  console.log(`  Subject A/B/C split:`);
  console.log(`    A: ${variantStats.A}  B: ${variantStats.B}  C: ${variantStats.C}`);
  console.log();
  console.log(`  Results: ${resultsFile}`);
  console.log(`  Sent log: ${SENT_LOG_FILE}`);
  console.log(`${'='.repeat(56)}\n`);
}

// ── CLI ────────────────────────────────────────────────────────────
async function main() {
  const args = process.argv.slice(2);

  if (args.includes('--help') || args.includes('-h')) {
    console.log(`
  RestauMargin — Personalized Campaign Email Sender
  ===================================================

  Automatically reads ALL CSVs from docs/campaigns/ and data/scraping/,
  deduplicates contacts, personalizes emails by city + cuisine + name,
  and sends via Resend with A/B/C subject line rotation.

  Usage:
    npx tsx scripts/send-personalized-campaign.ts [options]

  Examples:
    npx tsx scripts/send-personalized-campaign.ts --dry-run
    npx tsx scripts/send-personalized-campaign.ts --dry-run --city Lyon
    npx tsx scripts/send-personalized-campaign.ts --dry-run --limit 10
    npx tsx scripts/send-personalized-campaign.ts --city Marseille --limit 20
    npx tsx scripts/send-personalized-campaign.ts              # LIVE: sends to all contacts

  Options:
    --dry-run       Preview what would be sent without actually sending
    --city NAME     Filter contacts by city (case-insensitive, partial match)
    --limit N       Maximum number of emails to send (default: all)
    --help, -h      Show this help message

  Personalization:
    - Greeting uses restaurant name: "Bonjour [Restaurant],"
    - City mention: "Cher restaurateur de [City]"
    - Cuisine-specific hook based on category:
        francaise, italienne, japonaise, asiatique, burger,
        brasserie, pizzeria, general (fallback)
    - Subject line A/B/C rotation for testing

  Rate Limiting:
    - 1 email per 1.2 seconds
    - 10 second pause every 50 emails
    - Already-sent emails skipped (tracked in data/campaigns/sent-log.json)

  CSV Sources:
    - docs/campaigns/*.csv
    - data/scraping/*.csv
    - Supports both comma (,) and semicolon (;) delimited files
    - Flexible column detection (name/restaurant_name, city/ville, etc.)

  Output:
    - data/campaigns/personalized-campaign-{date}.json
    - data/campaigns/sent-log.json (persistent across runs)
    `);
    process.exit(0);
  }

  const dryRun = args.includes('--dry-run');
  const cityIdx = args.indexOf('--city');
  const city = cityIdx !== -1 ? args[cityIdx + 1] : undefined;
  const limitIdx = args.indexOf('--limit');
  const limit = limitIdx !== -1 ? parseInt(args[limitIdx + 1], 10) : undefined;

  if (limit !== undefined && (isNaN(limit) || limit <= 0)) {
    console.error('Error: --limit must be a positive number');
    process.exit(1);
  }

  await runPersonalizedCampaign({ dryRun, city, limit });
}

main().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});
