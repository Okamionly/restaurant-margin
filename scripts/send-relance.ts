#!/usr/bin/env npx tsx
// ============================================================
// RestauMargin — J+3 Follow-up Email Sender via Resend
// Usage: npx tsx scripts/send-relance.ts <csv-file>
// ============================================================

import * as fs from 'fs';
import * as path from 'path';

const RATE_LIMIT_MS = 1100;
const OUTPUT_DIR = path.join(__dirname, '..', 'data', 'campaigns');
const SENT_LOG_FILE = path.join(OUTPUT_DIR, 'relance-sent-log.json');
const FROM_ADDRESS = 'RestauMargin <contact@restaumargin.fr>';

function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function loadSentLog(): Set<string> {
  if (!fs.existsSync(SENT_LOG_FILE)) return new Set();
  try {
    const data = JSON.parse(fs.readFileSync(SENT_LOG_FILE, 'utf-8'));
    return new Set(Array.isArray(data) ? data : []);
  } catch { return new Set(); }
}

function saveSentLog(sent: Set<string>): void {
  if (!fs.existsSync(OUTPUT_DIR)) fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  fs.writeFileSync(SENT_LOG_FILE, JSON.stringify([...sent], null, 2), 'utf-8');
}

function parseCSVLine(line: string): string[] {
  const result: string[] = [];
  let current = '';
  let inQuotes = false;
  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    if (char === '"') {
      if (inQuotes && line[i + 1] === '"') { current += '"'; i++; }
      else inQuotes = !inQuotes;
    } else if ((char === ',' || char === ';') && !inQuotes) {
      result.push(current); current = '';
    } else current += char;
  }
  result.push(current);
  return result;
}

interface Contact { name: string; email: string; category?: string; }

function parseCSV(filePath: string): Contact[] {
  const content = fs.readFileSync(filePath, 'utf-8');
  const lines = content.split('\n').filter(l => l.trim());
  if (lines.length < 2) return [];

  const header = parseCSVLine(lines[0]);
  const h: Record<string, number> = {};
  header.forEach((col, idx) => { h[col.trim().toLowerCase()] = idx; });

  const nameCol = h['restaurant_name'] ?? h['name'] ?? h['nom'] ?? h['restaurant'] ?? -1;
  const emailCol = h['email'] ?? h['e-mail'] ?? h['mail'] ?? -1;
  const catCol = h['cuisine_type'] ?? h['category'] ?? h['categorie'] ?? h['cuisine'] ?? -1;

  if (emailCol === -1) { console.error('No email column found'); return []; }

  const contacts: Contact[] = [];
  for (let i = 1; i < lines.length; i++) {
    const cols = parseCSVLine(lines[i]);
    const email = (cols[emailCol] || '').trim();
    if (!email || !email.includes('@')) continue;
    contacts.push({
      name: (nameCol >= 0 ? cols[nameCol] : '').trim() || 'Restaurant',
      email,
      category: catCol >= 0 ? (cols[catCol] || '').trim() : undefined,
    });
  }
  return contacts;
}

function esc(str: string): string {
  return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

function buildRelanceEmail(name: string): { subject: string; html: string } {
  const greeting = name && name !== 'Restaurant' ? `Bonjour ${esc(name)},` : 'Bonjour,';

  const subject = 'Votre essai gratuit vous attend — 7 jours pour transformer vos marges';

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

  <p style="color:#1a1a2e;font-size:15px;line-height:1.8;margin:0 0 18px;">
    Je vous ai contacte il y a quelques jours au sujet de <strong>RestauMargin</strong>,
    l'outil qui calcule automatiquement le food cost de chaque plat de votre carte.
  </p>

  <p style="color:#1a1a2e;font-size:15px;line-height:1.8;margin:0 0 18px;">
    Je comprends que vous etes en plein service et que le temps est precieux.
    C'est justement pour ca que RestauMargin existe : <strong>moins de temps sur les calculs, plus de temps en cuisine.</strong>
  </p>

  <div style="background:#f0fdf4;border-left:4px solid #0d9488;padding:16px 20px;border-radius:0 8px 8px 0;margin:0 0 24px;">
    <p style="color:#0d9488;font-size:14px;font-weight:700;margin:0 0 10px;">Ce que nos restaurateurs decouvrent en 5 minutes :</p>
    <p style="color:#1a1a2e;font-size:14px;line-height:1.8;margin:0;">
      &#10003; Le plat qui leur coute le plus cher a produire<br>
      &#10003; Celui qui a la meilleure marge (souvent une surprise)<br>
      &#10003; L'ecart entre le prix de vente et le cout reel
    </p>
  </div>

  <p style="color:#1a1a2e;font-size:15px;line-height:1.8;margin:0 0 24px;">
    <strong>7 jours gratuits, sans carte bancaire.</strong> Si ca ne vous convient pas, vous ne payez rien.
    Si ca transforme votre facon de travailler, c'est 29&euro;/mois.
  </p>

  <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
    <tr><td align="center" style="padding:8px 0 24px;">
      <a href="https://www.restaumargin.fr/login?mode=register" style="display:inline-block;padding:14px 36px;background:#0d9488;color:#ffffff;text-decoration:none;border-radius:8px;font-weight:700;font-size:15px;">
        Demarrer mon essai gratuit &rarr;
      </a>
    </td></tr>
  </table>

  <p style="color:#6b7280;font-size:13px;text-align:center;margin:0 0 24px;">
    Pas de carte bancaire &mdash; Pas d'engagement &mdash; 5 minutes pour demarrer
  </p>

  <p style="color:#1a1a2e;font-size:15px;line-height:1.8;margin:0;">
    A bientot,<br>
    L'equipe RestauMargin
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

  return { subject, html };
}

async function sendEmail(apiKey: string, to: string, subject: string, html: string) {
  try {
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${apiKey}` },
      body: JSON.stringify({ from: FROM_ADDRESS, to: [to], subject, html }),
    });
    const data = await res.json() as any;
    if (!res.ok) return { success: false, error: data.message || `HTTP ${res.status}` };
    return { success: true, messageId: data.id };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

// ── Main ──────────────────────────────────────────────────────────
async function main() {
  const csvFile = process.argv[2];
  if (!csvFile) {
    console.log('Usage: npx tsx scripts/send-relance.ts <csv-file>');
    console.log('Example: npx tsx scripts/send-relance.ts docs/campaigns/montpellier-contacts.csv');
    process.exit(1);
  }

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) { console.error('RESEND_API_KEY env var required'); process.exit(1); }

  const contacts = parseCSV(csvFile);
  const alreadySent = loadSentLog();

  const toSend = contacts.filter(c => !alreadySent.has(c.email));
  console.log(`\n📧 RELANCE J+3 — RestauMargin`);
  console.log(`Total contacts: ${contacts.length}`);
  console.log(`Deja relances: ${alreadySent.size}`);
  console.log(`A envoyer: ${toSend.length}\n`);

  if (toSend.length === 0) { console.log('Rien a envoyer.'); return; }

  const dryRun = process.argv.includes('--dry-run');
  if (dryRun) {
    console.log('🔍 DRY RUN — aucun email envoye');
    toSend.forEach(c => console.log(`  → ${c.name} <${c.email}>`));
    return;
  }

  let sent = 0, failed = 0;
  for (const contact of toSend) {
    const { subject, html } = buildRelanceEmail(contact.name);
    const result = await sendEmail(apiKey, contact.email, subject, html);

    if (result.success) {
      sent++;
      alreadySent.add(contact.email);
      saveSentLog(alreadySent);
      console.log(`✅ ${sent}/${toSend.length} ${contact.name} <${contact.email}>`);
    } else {
      failed++;
      console.log(`❌ ${contact.name} <${contact.email}> — ${result.error}`);
    }

    await sleep(RATE_LIMIT_MS);
  }

  console.log(`\n📊 Resultat: ${sent} envoyes, ${failed} echecs sur ${toSend.length}`);
}

main().catch(console.error);
