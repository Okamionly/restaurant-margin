#!/usr/bin/env npx tsx
// ============================================================
// RestauMargin Agent — Automated Email Sequence (J+0/J+3/J+7/J+14)
// Usage: npx tsx scripts/agents/email-sequence.ts [--dry-run]
// Schedule: daily at 10h
// ============================================================

import * as fs from 'fs';
import * as path from 'path';

// ── Config ──────────────────────────────────────────────────
const RESEND_API_KEY = 're_7ubbQbFa_GVBfFkYLpW3ga9DQUdT35rAD';
const FROM_ADDRESS = 'RestauMargin <contact@restaumargin.fr>';
const RATE_LIMIT_MS = 1200; // 1 email per 1.2 seconds

const DATA_DIR = path.resolve(__dirname, '..', '..', 'data');
const CAMPAIGNS_DIR = path.join(DATA_DIR, 'campaigns');
const AGENTS_DIR = path.join(DATA_DIR, 'agents');
const SENT_LOG_FILE = path.join(CAMPAIGNS_DIR, 'sent-log.json');
const today = new Date().toISOString().slice(0, 10);
const SEQUENCE_LOG_FILE = path.join(AGENTS_DIR, `sequence-${today}.json`);

const DRY_RUN = process.argv.includes('--dry-run');

// ── Types ───────────────────────────────────────────────────
interface SentEntry {
  email: string;
  name?: string;
  sentAt: string;
  step: 'intro' | 'relance' | 'testimonial' | 'last-chance';
  status: 'sent' | 'failed';
  messageId?: string;
}

interface ContactDue {
  email: string;
  name: string;
  nextStep: 'intro' | 'relance' | 'testimonial' | 'last-chance';
  daysSinceLastEmail: number;
  lastStep: string;
  lastSentAt: string;
}

interface SequenceReport {
  timestamp: string;
  dryRun: boolean;
  contactsDue: number;
  emailsSent: number;
  emailsFailed: number;
  byStep: {
    intro: number;
    relance: number;
    testimonial: number;
    'last-chance': number;
  };
  actions: {
    email: string;
    name: string;
    step: string;
    status: 'sent' | 'failed' | 'dry-run';
    error?: string;
  }[];
}

// ── Step Definitions ────────────────────────────────────────
const STEPS: { name: 'intro' | 'relance' | 'testimonial' | 'last-chance'; daysAfterPrevious: number }[] = [
  { name: 'intro', daysAfterPrevious: 0 },
  { name: 'relance', daysAfterPrevious: 3 },
  { name: 'testimonial', daysAfterPrevious: 4 }, // J+7 (3+4)
  { name: 'last-chance', daysAfterPrevious: 7 }, // J+14 (7+7)
];

// ── Helpers ─────────────────────────────────────────────────
function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function ensureDir(dir: string): void {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
}

function log(msg: string): void {
  const ts = new Date().toISOString();
  console.log(`[${ts}] [email-sequence] ${msg}`);
}

function daysBetween(date1: string, date2: string): number {
  const d1 = new Date(date1).getTime();
  const d2 = new Date(date2).getTime();
  return Math.floor(Math.abs(d2 - d1) / 86400000);
}

// ── Load Sent Log ───────────────────────────────────────────
function loadSentLog(): SentEntry[] {
  if (!fs.existsSync(SENT_LOG_FILE)) return [];
  try {
    const data = JSON.parse(fs.readFileSync(SENT_LOG_FILE, 'utf-8'));
    // Handle both array-of-emails (old format) and array-of-objects (new format)
    if (Array.isArray(data)) {
      if (data.length === 0) return [];
      if (typeof data[0] === 'string') {
        // Old format: array of email strings — treat as intro sent at unknown time
        return data.map((email: string) => ({
          email,
          sentAt: '2026-01-01T00:00:00Z',
          step: 'intro' as const,
          status: 'sent' as const,
        }));
      }
      return data as SentEntry[];
    }
    return [];
  } catch {
    return [];
  }
}

function saveSentLog(entries: SentEntry[]): void {
  ensureDir(CAMPAIGNS_DIR);
  fs.writeFileSync(SENT_LOG_FILE, JSON.stringify(entries, null, 2), 'utf-8');
}

// ── Determine Next Step ─────────────────────────────────────
function getContactHistory(email: string, sentLog: SentEntry[]): SentEntry[] {
  return sentLog
    .filter(e => e.email.toLowerCase() === email.toLowerCase() && e.status === 'sent')
    .sort((a, b) => new Date(a.sentAt).getTime() - new Date(b.sentAt).getTime());
}

function determineNextStep(history: SentEntry[]): { step: 'relance' | 'testimonial' | 'last-chance'; daysNeeded: number } | null {
  if (history.length === 0) return null; // no intro sent yet

  const lastEntry = history[history.length - 1];
  const lastStep = lastEntry.step;

  // Find the next step
  const stepIndex = STEPS.findIndex(s => s.name === lastStep);
  if (stepIndex < 0 || stepIndex >= STEPS.length - 1) return null; // sequence complete or unknown step

  const nextStep = STEPS[stepIndex + 1];
  return {
    step: nextStep.name as 'relance' | 'testimonial' | 'last-chance',
    daysNeeded: nextStep.daysAfterPrevious,
  };
}

function findContactsDue(sentLog: SentEntry[]): ContactDue[] {
  const now = new Date().toISOString();
  const emailMap = new Map<string, SentEntry[]>();

  // Group by email
  for (const entry of sentLog) {
    if (entry.status !== 'sent') continue;
    const key = entry.email.toLowerCase();
    if (!emailMap.has(key)) emailMap.set(key, []);
    emailMap.get(key)!.push(entry);
  }

  const due: ContactDue[] = [];

  for (const [email, history] of emailMap) {
    history.sort((a, b) => new Date(a.sentAt).getTime() - new Date(b.sentAt).getTime());
    const lastEntry = history[history.length - 1];
    const nextInfo = determineNextStep(history);

    if (!nextInfo) continue; // sequence complete

    const daysSinceLast = daysBetween(lastEntry.sentAt, now);

    if (daysSinceLast >= nextInfo.daysNeeded) {
      due.push({
        email,
        name: lastEntry.name || email.split('@')[0],
        nextStep: nextInfo.step,
        daysSinceLastEmail: daysSinceLast,
        lastStep: lastEntry.step,
        lastSentAt: lastEntry.sentAt,
      });
    }
  }

  return due;
}

// ── Email Templates ─────────────────────────────────────────
function buildEmailHTML(step: string, name: string): { subject: string; html: string } {
  const firstName = name.split(' ')[0] || name;

  switch (step) {
    case 'relance':
      return {
        subject: `${firstName}, avez-vous eu le temps de tester RestauMargin ?`,
        html: `
          <div style="font-family: system-ui, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #111;">Bonjour ${firstName},</h2>
            <p>Je vous ai contacte il y a quelques jours pour vous presenter <strong>RestauMargin</strong>, l'outil de gestion des marges pour restaurateurs.</p>
            <p>Je me permets de revenir vers vous car beaucoup de restaurateurs nous disent que le suivi des marges est leur point faible numero 1.</p>
            <p><strong>En 5 minutes</strong>, RestauMargin vous permet de :</p>
            <ul>
              <li>Calculer votre food cost reel par plat</li>
              <li>Identifier les plats qui vous font perdre de l'argent</li>
              <li>Recevoir des alertes si vos prix fournisseurs augmentent</li>
            </ul>
            <p><a href="https://www.restaumargin.fr" style="display: inline-block; background: #0d9488; color: white; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: 600;">Essayer gratuitement</a></p>
            <p style="color: #6b7280; font-size: 13px;">Youssef — Fondateur de RestauMargin</p>
          </div>
        `,
      };

    case 'testimonial':
      return {
        subject: `Comment Le Bistrot du Port a reduit son food cost de 8% avec RestauMargin`,
        html: `
          <div style="font-family: system-ui, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #111;">Bonjour ${firstName},</h2>
            <p>Je voulais partager avec vous un retour concret d'un restaurateur comme vous.</p>
            <div style="background: #f0fdf4; border-left: 4px solid #10b981; padding: 16px; margin: 16px 0; border-radius: 4px;">
              <p style="font-style: italic; margin: 0;">"Avant RestauMargin, je ne savais pas quels plats etaient rentables. En 2 semaines, j'ai identifie 3 plats a marge negative et j'ai ajuste mes recettes. Mon food cost est passe de 35% a 27%."</p>
              <p style="margin: 8px 0 0; font-weight: 600; color: #065f46;">— Chef de Le Bistrot du Port, Montpellier</p>
            </div>
            <p>Vous aussi, vous pourriez decouvrir des opportunites d'economie cachees dans votre carte.</p>
            <p><a href="https://www.restaumargin.fr" style="display: inline-block; background: #0d9488; color: white; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: 600;">Decouvrir RestauMargin</a></p>
            <p style="color: #6b7280; font-size: 13px;">Youssef — Fondateur de RestauMargin</p>
          </div>
        `,
      };

    case 'last-chance':
      return {
        subject: `Dernier rappel : votre essai gratuit RestauMargin`,
        html: `
          <div style="font-family: system-ui, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #111;">Bonjour ${firstName},</h2>
            <p>C'est mon dernier message a ce sujet — je ne veux pas vous importuner.</p>
            <p>Si le suivi de vos marges et de votre food cost est un sujet pour vous, <strong>RestauMargin</strong> est la solution la plus simple du marche :</p>
            <ul>
              <li>Gratuit pour commencer</li>
              <li>Prise en main en 5 minutes</li>
              <li>Pas besoin de formation</li>
              <li>Compatible tablette</li>
            </ul>
            <p>Si ce n'est pas le bon moment, aucun souci. Je vous souhaite une excellente continuation.</p>
            <p><a href="https://www.restaumargin.fr" style="display: inline-block; background: #111; color: white; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: 600;">Essayer maintenant</a></p>
            <p style="color: #6b7280; font-size: 13px;">Youssef — Fondateur de RestauMargin<br>
            <a href="mailto:contact@restaumargin.fr" style="color: #6b7280;">contact@restaumargin.fr</a></p>
          </div>
        `,
      };

    default:
      return { subject: '', html: '' };
  }
}

// ── Send Email ──────────────────────────────────────────────
async function sendEmail(to: string, subject: string, html: string): Promise<{ ok: boolean; messageId?: string; error?: string }> {
  try {
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: FROM_ADDRESS,
        to: [to],
        subject,
        html,
      }),
    });

    if (!res.ok) {
      const err = await res.text();
      return { ok: false, error: `HTTP ${res.status}: ${err}` };
    }

    const data = await res.json();
    return { ok: true, messageId: data.id };
  } catch (err: any) {
    return { ok: false, error: err.message };
  }
}

// ── Main ────────────────────────────────────────────────────
async function main(): Promise<SequenceReport> {
  log(`Starting Email Sequence run... ${DRY_RUN ? '(DRY RUN)' : ''}`);
  ensureDir(AGENTS_DIR);
  ensureDir(CAMPAIGNS_DIR);

  // Load sent log
  const sentLog = loadSentLog();
  log(`Loaded ${sentLog.length} sent log entries`);

  // Find contacts due for follow-up
  const contactsDue = findContactsDue(sentLog);
  log(`Found ${contactsDue.length} contacts due for follow-up`);

  // Group by step for display
  const byStep = {
    intro: 0,
    relance: contactsDue.filter(c => c.nextStep === 'relance').length,
    testimonial: contactsDue.filter(c => c.nextStep === 'testimonial').length,
    'last-chance': contactsDue.filter(c => c.nextStep === 'last-chance').length,
  };

  log(`Due by step — Relance (J+3): ${byStep.relance} | Testimonial (J+7): ${byStep.testimonial} | Last Chance (J+14): ${byStep['last-chance']}`);

  const actions: SequenceReport['actions'] = [];
  let emailsSent = 0;
  let emailsFailed = 0;

  for (const contact of contactsDue) {
    const { subject, html } = buildEmailHTML(contact.nextStep, contact.name);

    if (!subject || !html) {
      log(`WARNING: No template for step "${contact.nextStep}" — skipping ${contact.email}`);
      continue;
    }

    if (DRY_RUN) {
      log(`[DRY] Would send ${contact.nextStep} to ${contact.email} (${contact.name})`);
      actions.push({
        email: contact.email,
        name: contact.name,
        step: contact.nextStep,
        status: 'dry-run',
      });
      continue;
    }

    // Send the email
    log(`Sending ${contact.nextStep} to ${contact.email}...`);
    const result = await sendEmail(contact.email, subject, html);

    if (result.ok) {
      emailsSent++;
      log(`  OK: ${result.messageId}`);

      // Update sent log
      sentLog.push({
        email: contact.email,
        name: contact.name,
        sentAt: new Date().toISOString(),
        step: contact.nextStep,
        status: 'sent',
        messageId: result.messageId,
      });

      actions.push({
        email: contact.email,
        name: contact.name,
        step: contact.nextStep,
        status: 'sent',
      });
    } else {
      emailsFailed++;
      log(`  FAILED: ${result.error}`);

      sentLog.push({
        email: contact.email,
        name: contact.name,
        sentAt: new Date().toISOString(),
        step: contact.nextStep,
        status: 'failed',
      });

      actions.push({
        email: contact.email,
        name: contact.name,
        step: contact.nextStep,
        status: 'failed',
        error: result.error,
      });
    }

    // Rate limit
    await sleep(RATE_LIMIT_MS);
  }

  // Save updated sent log
  if (!DRY_RUN && (emailsSent > 0 || emailsFailed > 0)) {
    saveSentLog(sentLog);
    log(`Sent log updated (${sentLog.length} total entries)`);
  }

  // Build report
  const report: SequenceReport = {
    timestamp: new Date().toISOString(),
    dryRun: DRY_RUN,
    contactsDue: contactsDue.length,
    emailsSent,
    emailsFailed,
    byStep,
    actions,
  };

  // Save sequence report
  fs.writeFileSync(SEQUENCE_LOG_FILE, JSON.stringify(report, null, 2), 'utf-8');
  log(`Report saved to ${SEQUENCE_LOG_FILE}`);

  // Summary
  log('--- Summary ---');
  log(`Contacts due: ${contactsDue.length}`);
  log(`Sent: ${emailsSent} | Failed: ${emailsFailed}`);
  if (DRY_RUN) log('(Dry run — no emails actually sent)');

  return report;
}

// ── Execute ─────────────────────────────────────────────────
main()
  .then(report => {
    log(`Email Sequence completed. ${report.emailsSent} sent, ${report.emailsFailed} failed.`);
    process.exit(0);
  })
  .catch(err => {
    log(`FATAL: ${err.message}`);
    process.exit(1);
  });

export { main as runEmailSequence };
export type { SequenceReport };
