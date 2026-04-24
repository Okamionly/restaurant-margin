#!/usr/bin/env npx tsx
// ============================================================
// RestauMargin Agent — Site Health Check
// Usage: npx tsx scripts/agents/health-check.ts
// Schedule: every 15 minutes
// ============================================================

import * as fs from 'fs';
import * as path from 'path';

// ── Config ──────────────────────────────────────────────────
const SITE_URL = 'https://www.restaumargin.fr';
const HEALTH_ENDPOINT = `${SITE_URL}/api/health`;
const MAX_RESPONSE_TIME_MS = 2000;
const RESEND_API_KEY = process.env.RESEND_API_KEY;
if (!RESEND_API_KEY) {
  console.error('[FATAL] RESEND_API_KEY env var is required');
  process.exit(1);
}
const ALERT_EMAIL = 'contact@restaumargin.fr';
const FROM_ADDRESS = 'RestauMargin Agents <contact@restaumargin.fr>';

// Vercel API (uses VERCEL_TOKEN env var)
const VERCEL_TOKEN = process.env.VERCEL_TOKEN || '';
const VERCEL_PROJECT_ID = process.env.VERCEL_PROJECT_ID || '';

// Supabase health check
const SUPABASE_URL = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL || '';
const SUPABASE_KEY = process.env.SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_ANON_KEY || '';

const OUTPUT_DIR = path.resolve(__dirname, '..', '..', 'data', 'agents');
const today = new Date().toISOString().slice(0, 10);
const REPORT_FILE = path.join(OUTPUT_DIR, `health-${today}.json`);

// ── Types ───────────────────────────────────────────────────
interface CheckResult {
  name: string;
  status: 'pass' | 'fail' | 'warn' | 'skip';
  responseTimeMs: number;
  message: string;
  timestamp: string;
}

interface HealthReport {
  timestamp: string;
  overallStatus: 'healthy' | 'degraded' | 'down';
  checks: CheckResult[];
  alertSent: boolean;
  consecutiveFailures: number;
}

// ── Helpers ─────────────────────────────────────────────────
function ensureDir(dir: string): void {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
}

function log(msg: string): void {
  const ts = new Date().toISOString();
  console.log(`[${ts}] [health-check] ${msg}`);
}

function getConsecutiveFailures(): number {
  if (!fs.existsSync(REPORT_FILE)) return 0;
  try {
    const data = JSON.parse(fs.readFileSync(REPORT_FILE, 'utf-8'));
    // If the file contains an array, look at the last entry
    if (Array.isArray(data)) {
      const last = data[data.length - 1];
      return last?.overallStatus !== 'healthy' ? (last?.consecutiveFailures || 0) + 1 : 0;
    }
    // Single report
    return data.overallStatus !== 'healthy' ? (data.consecutiveFailures || 0) + 1 : 0;
  } catch {
    return 0;
  }
}

function loadTodayReports(): HealthReport[] {
  if (!fs.existsSync(REPORT_FILE)) return [];
  try {
    const data = JSON.parse(fs.readFileSync(REPORT_FILE, 'utf-8'));
    return Array.isArray(data) ? data : [data];
  } catch {
    return [];
  }
}

// ── Health Checks ───────────────────────────────────────────
async function checkHealthEndpoint(): Promise<CheckResult> {
  const start = Date.now();
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 10000);

    const res = await fetch(HEALTH_ENDPOINT, {
      signal: controller.signal,
      headers: { 'User-Agent': 'RestauMargin-HealthCheck/1.0' },
    });
    clearTimeout(timeout);

    const elapsed = Date.now() - start;
    const ok = res.ok;
    const slow = elapsed > MAX_RESPONSE_TIME_MS;

    return {
      name: 'api-health',
      status: !ok ? 'fail' : slow ? 'warn' : 'pass',
      responseTimeMs: elapsed,
      message: !ok
        ? `HTTP ${res.status} — endpoint returned error`
        : slow
          ? `Response time ${elapsed}ms exceeds ${MAX_RESPONSE_TIME_MS}ms threshold`
          : `OK (${elapsed}ms)`,
      timestamp: new Date().toISOString(),
    };
  } catch (err: any) {
    return {
      name: 'api-health',
      status: 'fail',
      responseTimeMs: Date.now() - start,
      message: `Request failed: ${err.message}`,
      timestamp: new Date().toISOString(),
    };
  }
}

async function checkSiteReachable(): Promise<CheckResult> {
  const start = Date.now();
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 10000);

    const res = await fetch(SITE_URL, {
      signal: controller.signal,
      headers: { 'User-Agent': 'RestauMargin-HealthCheck/1.0' },
      redirect: 'follow',
    });
    clearTimeout(timeout);

    const elapsed = Date.now() - start;

    return {
      name: 'site-reachable',
      status: res.ok ? 'pass' : 'fail',
      responseTimeMs: elapsed,
      message: res.ok ? `Site reachable (${elapsed}ms)` : `HTTP ${res.status}`,
      timestamp: new Date().toISOString(),
    };
  } catch (err: any) {
    return {
      name: 'site-reachable',
      status: 'fail',
      responseTimeMs: Date.now() - start,
      message: `Site unreachable: ${err.message}`,
      timestamp: new Date().toISOString(),
    };
  }
}

async function checkResponseTime(): Promise<CheckResult> {
  const start = Date.now();
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), MAX_RESPONSE_TIME_MS + 5000);

    const res = await fetch(SITE_URL, {
      signal: controller.signal,
      headers: { 'User-Agent': 'RestauMargin-HealthCheck/1.0' },
    });
    clearTimeout(timeout);

    const elapsed = Date.now() - start;

    return {
      name: 'response-time',
      status: elapsed <= MAX_RESPONSE_TIME_MS ? 'pass' : 'warn',
      responseTimeMs: elapsed,
      message: elapsed <= MAX_RESPONSE_TIME_MS
        ? `${elapsed}ms (under ${MAX_RESPONSE_TIME_MS}ms threshold)`
        : `${elapsed}ms EXCEEDS ${MAX_RESPONSE_TIME_MS}ms threshold`,
      timestamp: new Date().toISOString(),
    };
  } catch (err: any) {
    return {
      name: 'response-time',
      status: 'fail',
      responseTimeMs: Date.now() - start,
      message: `Cannot measure: ${err.message}`,
      timestamp: new Date().toISOString(),
    };
  }
}

async function checkVercelDeployment(): Promise<CheckResult> {
  if (!VERCEL_TOKEN || !VERCEL_PROJECT_ID) {
    return {
      name: 'vercel-deployment',
      status: 'skip',
      responseTimeMs: 0,
      message: 'VERCEL_TOKEN or VERCEL_PROJECT_ID not set — skipping',
      timestamp: new Date().toISOString(),
    };
  }

  const start = Date.now();
  try {
    const res = await fetch(
      `https://api.vercel.com/v6/deployments?projectId=${VERCEL_PROJECT_ID}&limit=1&state=READY`,
      {
        headers: { Authorization: `Bearer ${VERCEL_TOKEN}` },
      }
    );

    const elapsed = Date.now() - start;

    if (!res.ok) {
      return {
        name: 'vercel-deployment',
        status: 'fail',
        responseTimeMs: elapsed,
        message: `Vercel API error: HTTP ${res.status}`,
        timestamp: new Date().toISOString(),
      };
    }

    const data = await res.json();
    const deployments = data.deployments || [];

    if (deployments.length === 0) {
      return {
        name: 'vercel-deployment',
        status: 'warn',
        responseTimeMs: elapsed,
        message: 'No READY deployments found',
        timestamp: new Date().toISOString(),
      };
    }

    const latest = deployments[0];
    return {
      name: 'vercel-deployment',
      status: 'pass',
      responseTimeMs: elapsed,
      message: `Latest deployment: ${latest.url} (${latest.state}) — ${new Date(latest.created).toISOString()}`,
      timestamp: new Date().toISOString(),
    };
  } catch (err: any) {
    return {
      name: 'vercel-deployment',
      status: 'fail',
      responseTimeMs: Date.now() - start,
      message: `Vercel check failed: ${err.message}`,
      timestamp: new Date().toISOString(),
    };
  }
}

async function checkSupabase(): Promise<CheckResult> {
  if (!SUPABASE_URL) {
    return {
      name: 'supabase-connectivity',
      status: 'skip',
      responseTimeMs: 0,
      message: 'SUPABASE_URL not set — skipping',
      timestamp: new Date().toISOString(),
    };
  }

  const start = Date.now();
  try {
    // Use the Supabase REST API health endpoint
    const res = await fetch(`${SUPABASE_URL}/rest/v1/`, {
      headers: {
        apikey: SUPABASE_KEY,
        Authorization: `Bearer ${SUPABASE_KEY}`,
      },
    });

    const elapsed = Date.now() - start;

    return {
      name: 'supabase-connectivity',
      status: res.ok ? 'pass' : 'fail',
      responseTimeMs: elapsed,
      message: res.ok ? `Supabase reachable (${elapsed}ms)` : `HTTP ${res.status}`,
      timestamp: new Date().toISOString(),
    };
  } catch (err: any) {
    return {
      name: 'supabase-connectivity',
      status: 'fail',
      responseTimeMs: Date.now() - start,
      message: `Supabase check failed: ${err.message}`,
      timestamp: new Date().toISOString(),
    };
  }
}

// ── Alert Email ─────────────────────────────────────────────
async function sendHealthAlert(checks: CheckResult[], consecutiveFailures: number): Promise<boolean> {
  const failedChecks = checks.filter(c => c.status === 'fail');
  if (failedChecks.length === 0) return false;

  const checkList = checks
    .map(c => {
      const icon = c.status === 'pass' ? 'OK' : c.status === 'warn' ? 'WARN' : c.status === 'fail' ? 'FAIL' : 'SKIP';
      return `[${icon}] ${c.name}: ${c.message} (${c.responseTimeMs}ms)`;
    })
    .join('\n');

  const body = {
    from: FROM_ADDRESS,
    to: [ALERT_EMAIL],
    subject: `[PANNE] RestauMargin — ${failedChecks.length} verification(s) echouee(s)`,
    html: `
      <div style="font-family: system-ui, sans-serif; max-width: 600px;">
        <h2 style="color: #dc2626;">Alerte Sante — RestauMargin</h2>
        <p><strong>${failedChecks.length} verification(s) en echec</strong> (${consecutiveFailures} echecs consecutifs)</p>
        <div style="background: #fef2f2; border: 1px solid #fecaca; border-radius: 8px; padding: 16px; margin: 16px 0;">
          <pre style="white-space: pre-wrap; font-size: 13px;">${checkList}</pre>
        </div>
        <p style="color: #6b7280; font-size: 12px;">
          Agent Health Check — RestauMargin<br>
          Prochaine verification dans 15 minutes
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
      log(`ERROR sending alert: ${await res.text()}`);
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
async function main(): Promise<HealthReport> {
  log('Starting Health Check run...');
  ensureDir(OUTPUT_DIR);

  const previousFailures = getConsecutiveFailures();

  // Run all checks
  log('Running checks...');
  const checks = await Promise.all([
    checkSiteReachable(),
    checkHealthEndpoint(),
    checkResponseTime(),
    checkVercelDeployment(),
    checkSupabase(),
  ]);

  // Log each check result
  for (const check of checks) {
    const icon = check.status === 'pass' ? 'OK' : check.status === 'warn' ? '!!' : check.status === 'fail' ? 'XX' : '--';
    log(`  [${icon}] ${check.name}: ${check.message}`);
  }

  // Determine overall status
  const failCount = checks.filter(c => c.status === 'fail').length;
  const warnCount = checks.filter(c => c.status === 'warn').length;
  const overallStatus: 'healthy' | 'degraded' | 'down' =
    failCount >= 2 ? 'down' : failCount === 1 ? 'degraded' : warnCount > 0 ? 'degraded' : 'healthy';

  const consecutiveFailures = overallStatus !== 'healthy' ? previousFailures + 1 : 0;

  // Send alert if any check failed (but only every 3rd consecutive failure to avoid spam)
  let alertSent = false;
  if (failCount > 0 && (consecutiveFailures === 1 || consecutiveFailures % 3 === 0)) {
    log(`Sending health alert (${consecutiveFailures} consecutive failures)...`);
    alertSent = await sendHealthAlert(checks, consecutiveFailures);
  }

  // Build report
  const report: HealthReport = {
    timestamp: new Date().toISOString(),
    overallStatus,
    checks,
    alertSent,
    consecutiveFailures,
  };

  // Append to today's report file (array of checks throughout the day)
  const existingReports = loadTodayReports();
  existingReports.push(report);

  // Keep max 96 entries per day (every 15 min = 96 per day)
  const trimmed = existingReports.slice(-96);
  fs.writeFileSync(REPORT_FILE, JSON.stringify(trimmed, null, 2), 'utf-8');

  // Summary
  log('--- Summary ---');
  log(`Overall: ${overallStatus.toUpperCase()}`);
  log(`Checks — Pass: ${checks.filter(c => c.status === 'pass').length} | Warn: ${warnCount} | Fail: ${failCount} | Skip: ${checks.filter(c => c.status === 'skip').length}`);
  log(`Consecutive failures: ${consecutiveFailures}`);
  log(`Alert sent: ${alertSent}`);

  return report;
}

// ── Execute ─────────────────────────────────────────────────
main()
  .then(report => {
    process.exit(report.overallStatus === 'down' ? 1 : 0);
  })
  .catch(err => {
    log(`FATAL: ${err.message}`);
    process.exit(2);
  });

export { main as runHealthCheck };
export type { HealthReport, CheckResult };
