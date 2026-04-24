#!/usr/bin/env npx tsx
// ============================================================
// RestauMargin Agent — Sentry Bug Detection Monitor
// Usage: npx tsx scripts/agents/sentry-monitor.ts
// Schedule: every 30 minutes
// ============================================================

import * as fs from 'fs';
import * as path from 'path';

// ── Config ──────────────────────────────────────────────────
const SENTRY_BASE = 'https://sentry.io/api/0/projects/restaumargin/restaumargin';
const SENTRY_AUTH_TOKEN = process.env.SENTRY_AUTH_TOKEN || '';
const RESEND_API_KEY = process.env.RESEND_API_KEY;
if (!RESEND_API_KEY) {
  console.error('[FATAL] RESEND_API_KEY env var is required');
  process.exit(1);
}
const ALERT_EMAIL = 'contact@restaumargin.fr';
const FROM_ADDRESS = 'RestauMargin Agents <contact@restaumargin.fr>';

const OUTPUT_DIR = path.resolve(__dirname, '..', '..', 'data', 'agents');
const today = new Date().toISOString().slice(0, 10);
const REPORT_FILE = path.join(OUTPUT_DIR, `sentry-report-${today}.json`);

// ── Types ───────────────────────────────────────────────────
interface SentryIssue {
  id: string;
  title: string;
  culprit: string;
  level: string;
  status: string;
  count: string;
  firstSeen: string;
  lastSeen: string;
  shortId: string;
  permalink: string;
  metadata: {
    type?: string;
    value?: string;
    filename?: string;
    function?: string;
  };
}

interface CategorizedIssue {
  id: string;
  title: string;
  culprit: string;
  level: string;
  count: number;
  category: 'frontend' | 'backend' | 'network' | 'unknown';
  severity: 'critical' | 'high' | 'medium' | 'low';
  firstSeen: string;
  lastSeen: string;
  permalink: string;
}

interface SentryReport {
  timestamp: string;
  totalIssues: number;
  newIssues: number;
  categories: {
    frontend: number;
    backend: number;
    network: number;
    unknown: number;
  };
  criticalCount: number;
  alertSent: boolean;
  issues: CategorizedIssue[];
}

// ── Helpers ─────────────────────────────────────────────────
function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function ensureDir(dir: string): void {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
}

function log(msg: string): void {
  const ts = new Date().toISOString();
  console.log(`[${ts}] [sentry-monitor] ${msg}`);
}

function categorizeIssue(issue: SentryIssue): 'frontend' | 'backend' | 'network' | 'unknown' {
  const culprit = (issue.culprit || '').toLowerCase();
  const title = (issue.title || '').toLowerCase();
  const filename = (issue.metadata?.filename || '').toLowerCase();

  // Network errors
  if (
    title.includes('fetch') ||
    title.includes('network') ||
    title.includes('timeout') ||
    title.includes('cors') ||
    title.includes('econnrefused') ||
    title.includes('socket')
  ) {
    return 'network';
  }

  // Frontend errors
  if (
    filename.includes('.tsx') ||
    filename.includes('.jsx') ||
    filename.includes('client/') ||
    culprit.includes('react') ||
    culprit.includes('component') ||
    title.includes('typeerror') ||
    title.includes('referenceerror') ||
    title.includes('syntaxerror') ||
    culprit.includes('pages/') ||
    culprit.includes('components/')
  ) {
    return 'frontend';
  }

  // Backend errors
  if (
    filename.includes('.ts') ||
    filename.includes('server/') ||
    filename.includes('api/') ||
    culprit.includes('express') ||
    culprit.includes('prisma') ||
    culprit.includes('route') ||
    title.includes('prisma') ||
    title.includes('database') ||
    title.includes('sql')
  ) {
    return 'backend';
  }

  return 'unknown';
}

function calculateSeverity(issue: SentryIssue): 'critical' | 'high' | 'medium' | 'low' {
  const count = parseInt(issue.count, 10) || 0;
  const level = (issue.level || '').toLowerCase();

  if (level === 'fatal' || level === 'critical') return 'critical';
  if (level === 'error' && count > 100) return 'critical';
  if (level === 'error' && count > 20) return 'high';
  if (level === 'error') return 'medium';
  if (level === 'warning' && count > 50) return 'medium';
  return 'low';
}

function loadPreviousReport(): SentryReport | null {
  if (!fs.existsSync(REPORT_FILE)) return null;
  try {
    return JSON.parse(fs.readFileSync(REPORT_FILE, 'utf-8'));
  } catch {
    return null;
  }
}

function getKnownIssueIds(report: SentryReport | null): Set<string> {
  if (!report) return new Set();
  return new Set(report.issues.map(i => i.id));
}

// ── Sentry API ──────────────────────────────────────────────
async function fetchUnresolvedIssues(): Promise<SentryIssue[]> {
  if (!SENTRY_AUTH_TOKEN) {
    log('WARNING: SENTRY_AUTH_TOKEN not set. Using mock data for demonstration.');
    return [];
  }

  const url = `${SENTRY_BASE}/issues/?query=is:unresolved&sort=date&limit=50`;
  log(`Fetching: ${url}`);

  try {
    const res = await fetch(url, {
      headers: {
        Authorization: `Bearer ${SENTRY_AUTH_TOKEN}`,
        'Content-Type': 'application/json',
      },
    });

    if (!res.ok) {
      const body = await res.text();
      throw new Error(`Sentry API ${res.status}: ${body}`);
    }

    return (await res.json()) as SentryIssue[];
  } catch (err: any) {
    log(`ERROR fetching Sentry issues: ${err.message}`);
    return [];
  }
}

// ── Resend Alert ────────────────────────────────────────────
async function sendCriticalAlert(issues: CategorizedIssue[]): Promise<boolean> {
  if (issues.length === 0) return false;

  const issueList = issues
    .map(i => `- [${i.severity.toUpperCase()}] ${i.title} (${i.count}x) — ${i.category}\n  ${i.permalink}`)
    .join('\n');

  const body = {
    from: FROM_ADDRESS,
    to: [ALERT_EMAIL],
    subject: `[ALERTE] ${issues.length} erreur(s) critique(s) sur RestauMargin`,
    html: `
      <div style="font-family: system-ui, sans-serif; max-width: 600px;">
        <h2 style="color: #dc2626;">Alertes Sentry - RestauMargin</h2>
        <p><strong>${issues.length} erreur(s) critique(s)</strong> detectee(s) a ${new Date().toLocaleTimeString('fr-FR')}.</p>
        <div style="background: #fef2f2; border: 1px solid #fecaca; border-radius: 8px; padding: 16px; margin: 16px 0;">
          <pre style="white-space: pre-wrap; font-size: 13px;">${issueList}</pre>
        </div>
        <p style="color: #6b7280; font-size: 12px;">
          Agent Sentry Monitor — RestauMargin<br>
          <a href="https://sentry.io/organizations/restaumargin/issues/">Voir dans Sentry</a>
        </p>
      </div>
    `,
  };

  try {
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      const err = await res.text();
      log(`ERROR sending alert email: ${err}`);
      return false;
    }

    log(`Alert email sent to ${ALERT_EMAIL}`);
    return true;
  } catch (err: any) {
    log(`ERROR sending alert: ${err.message}`);
    return false;
  }
}

// ── Main ────────────────────────────────────────────────────
async function main(): Promise<SentryReport> {
  log('Starting Sentry Monitor run...');
  ensureDir(OUTPUT_DIR);

  // Load previous report to detect new issues
  const previousReport = loadPreviousReport();
  const knownIds = getKnownIssueIds(previousReport);

  // Fetch unresolved issues from Sentry
  const rawIssues = await fetchUnresolvedIssues();
  log(`Fetched ${rawIssues.length} unresolved issues`);

  // Categorize and assess severity
  const issues: CategorizedIssue[] = rawIssues.map(issue => ({
    id: issue.id,
    title: issue.title,
    culprit: issue.culprit,
    level: issue.level,
    count: parseInt(issue.count, 10) || 0,
    category: categorizeIssue(issue),
    severity: calculateSeverity(issue),
    firstSeen: issue.firstSeen,
    lastSeen: issue.lastSeen,
    permalink: issue.permalink,
  }));

  // Count new issues
  const newIssues = issues.filter(i => !knownIds.has(i.id));

  // Count by category
  const categories = {
    frontend: issues.filter(i => i.category === 'frontend').length,
    backend: issues.filter(i => i.category === 'backend').length,
    network: issues.filter(i => i.category === 'network').length,
    unknown: issues.filter(i => i.category === 'unknown').length,
  };

  // Find critical issues
  const criticalIssues = issues.filter(i => i.severity === 'critical');

  // Send alert if there are new critical issues
  let alertSent = false;
  const newCritical = criticalIssues.filter(i => !knownIds.has(i.id));
  if (newCritical.length > 0) {
    log(`Found ${newCritical.length} NEW critical issue(s). Sending alert...`);
    alertSent = await sendCriticalAlert(newCritical);
  } else if (criticalIssues.length > 0) {
    log(`${criticalIssues.length} known critical issue(s) — no new alert needed`);
  } else {
    log('No critical issues detected');
  }

  // Build report
  const report: SentryReport = {
    timestamp: new Date().toISOString(),
    totalIssues: issues.length,
    newIssues: newIssues.length,
    categories,
    criticalCount: criticalIssues.length,
    alertSent,
    issues,
  };

  // Save report
  fs.writeFileSync(REPORT_FILE, JSON.stringify(report, null, 2), 'utf-8');
  log(`Report saved to ${REPORT_FILE}`);

  // Summary
  log('--- Summary ---');
  log(`Total issues: ${report.totalIssues}`);
  log(`New issues: ${report.newIssues}`);
  log(`Critical: ${report.criticalCount} | Frontend: ${categories.frontend} | Backend: ${categories.backend} | Network: ${categories.network}`);
  log(`Alert sent: ${alertSent}`);

  return report;
}

// ── Execute ─────────────────────────────────────────────────
main()
  .then(report => {
    process.exit(report.criticalCount > 0 ? 1 : 0);
  })
  .catch(err => {
    log(`FATAL: ${err.message}`);
    process.exit(2);
  });

export { main as runSentryMonitor };
export type { SentryReport, CategorizedIssue };
