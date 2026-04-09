#!/usr/bin/env npx tsx
// ============================================================
// RestauMargin Agent Orchestrator — Runner
// Usage:
//   npx tsx scripts/agents/runner.ts --agent sentry-monitor
//   npx tsx scripts/agents/runner.ts --agent health-check
//   npx tsx scripts/agents/runner.ts --all
//   npx tsx scripts/agents/runner.ts --status
//   npx tsx scripts/agents/runner.ts --schedule
// ============================================================

import * as fs from 'fs';
import * as path from 'path';
import { execSync, spawn } from 'child_process';

// ── Config ──────────────────────────────────────────────────
const AGENTS_DIR = path.resolve(__dirname);
const DATA_DIR = path.resolve(__dirname, '..', '..', 'data', 'agents');
const RUNNER_LOG = path.join(DATA_DIR, 'runner-log.json');

// Agent registry with schedule info
const AGENT_REGISTRY: Record<string, AgentConfig> = {
  'sentry-monitor': {
    file: 'sentry-monitor.ts',
    description: 'Bug Detection — fetch unresolved Sentry issues, categorize & alert',
    cron: '*/30 * * * *',       // every 30 minutes
    schedule: 'every 30 minutes',
    timeout: 60000,             // 1 min
  },
  'lead-finder': {
    file: 'lead-finder.ts',
    description: 'Restaurant Lead Finder — search Exa for new restaurants & contacts',
    cron: '0 8 * * *',          // daily at 8h
    schedule: 'daily at 08:00',
    timeout: 300000,            // 5 min
  },
  'market-intelligence': {
    file: 'market-intelligence.ts',
    description: 'Market News — search Tavily for food cost, trends, competitors',
    cron: '0 7 * * *',          // daily at 7h
    schedule: 'daily at 07:00',
    timeout: 300000,            // 5 min
  },
  'email-sequence': {
    file: 'email-sequence.ts',
    description: 'Email Sequence — J+0/J+3/J+7/J+14 automated follow-ups',
    cron: '0 10 * * *',         // daily at 10h
    schedule: 'daily at 10:00',
    timeout: 600000,            // 10 min
  },
  'health-check': {
    file: 'health-check.ts',
    description: 'Site Health — check API, response time, Vercel, Supabase',
    cron: '*/15 * * * *',       // every 15 minutes
    schedule: 'every 15 minutes',
    timeout: 30000,             // 30 sec
  },
};

// ── Types ───────────────────────────────────────────────────
interface AgentConfig {
  file: string;
  description: string;
  cron: string;
  schedule: string;
  timeout: number;
}

interface RunLogEntry {
  agent: string;
  startedAt: string;
  completedAt: string;
  durationMs: number;
  exitCode: number;
  status: 'success' | 'failure' | 'timeout';
  output?: string;
}

interface RunnerLog {
  lastUpdated: string;
  totalRuns: number;
  runs: RunLogEntry[];
}

// ── Helpers ─────────────────────────────────────────────────
function ensureDir(dir: string): void {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
}

function log(msg: string): void {
  const ts = new Date().toISOString();
  console.log(`[${ts}] [runner] ${msg}`);
}

function loadRunnerLog(): RunnerLog {
  if (!fs.existsSync(RUNNER_LOG)) {
    return { lastUpdated: new Date().toISOString(), totalRuns: 0, runs: [] };
  }
  try {
    return JSON.parse(fs.readFileSync(RUNNER_LOG, 'utf-8'));
  } catch {
    return { lastUpdated: new Date().toISOString(), totalRuns: 0, runs: [] };
  }
}

function saveRunnerLog(logData: RunnerLog): void {
  ensureDir(DATA_DIR);
  // Keep last 500 runs max
  logData.runs = logData.runs.slice(-500);
  logData.lastUpdated = new Date().toISOString();
  fs.writeFileSync(RUNNER_LOG, JSON.stringify(logData, null, 2), 'utf-8');
}

// ── Run Agent ───────────────────────────────────────────────
async function runAgent(agentName: string): Promise<RunLogEntry> {
  const config = AGENT_REGISTRY[agentName];
  if (!config) {
    throw new Error(`Unknown agent: "${agentName}". Available: ${Object.keys(AGENT_REGISTRY).join(', ')}`);
  }

  const agentFile = path.join(AGENTS_DIR, config.file);
  if (!fs.existsSync(agentFile)) {
    throw new Error(`Agent file not found: ${agentFile}`);
  }

  const startedAt = new Date().toISOString();
  const startTime = Date.now();

  log(`Starting agent: ${agentName} (${config.description})`);
  log(`File: ${agentFile}`);
  log(`Timeout: ${config.timeout}ms`);

  return new Promise<RunLogEntry>((resolve) => {
    // Quote the agent file path to handle spaces in directory names
    const quotedFile = `"${agentFile}"`;
    const child = spawn('npx', ['tsx', quotedFile], {
      cwd: path.resolve(__dirname, '..', '..'),
      stdio: ['ignore', 'pipe', 'pipe'],
      shell: true,
      timeout: config.timeout,
    });

    let stdout = '';
    let stderr = '';

    child.stdout.on('data', (data) => {
      const text = data.toString();
      stdout += text;
      process.stdout.write(text);
    });

    child.stderr.on('data', (data) => {
      const text = data.toString();
      stderr += text;
      process.stderr.write(text);
    });

    child.on('close', (code) => {
      const durationMs = Date.now() - startTime;
      const exitCode = code ?? 1;

      const entry: RunLogEntry = {
        agent: agentName,
        startedAt,
        completedAt: new Date().toISOString(),
        durationMs,
        exitCode,
        status: exitCode === 0 ? 'success' : 'failure',
        output: (stdout + stderr).slice(-2000), // keep last 2000 chars
      };

      log(`Agent ${agentName} completed — exit code: ${exitCode}, duration: ${durationMs}ms`);
      resolve(entry);
    });

    child.on('error', (err) => {
      const durationMs = Date.now() - startTime;
      const entry: RunLogEntry = {
        agent: agentName,
        startedAt,
        completedAt: new Date().toISOString(),
        durationMs,
        exitCode: 1,
        status: err.message.includes('timeout') ? 'timeout' : 'failure',
        output: `Error: ${err.message}`,
      };

      log(`Agent ${agentName} ERROR: ${err.message}`);
      resolve(entry);
    });
  });
}

// ── Commands ────────────────────────────────────────────────
async function runSingleAgent(agentName: string): Promise<void> {
  const runnerLog = loadRunnerLog();
  const entry = await runAgent(agentName);
  runnerLog.runs.push(entry);
  runnerLog.totalRuns++;
  saveRunnerLog(runnerLog);
}

async function runAllAgents(): Promise<void> {
  const agentNames = Object.keys(AGENT_REGISTRY);
  log(`Running all ${agentNames.length} agents sequentially...`);
  log('');

  const runnerLog = loadRunnerLog();
  const results: { name: string; status: string; duration: number }[] = [];

  for (const name of agentNames) {
    log(`========== ${name.toUpperCase()} ==========`);
    const entry = await runAgent(name);
    runnerLog.runs.push(entry);
    runnerLog.totalRuns++;
    results.push({ name, status: entry.status, duration: entry.durationMs });
    log('');
  }

  saveRunnerLog(runnerLog);

  // Final summary
  log('========== ALL AGENTS SUMMARY ==========');
  for (const r of results) {
    const icon = r.status === 'success' ? 'OK' : r.status === 'timeout' ? 'TO' : 'XX';
    log(`  [${icon}] ${r.name} — ${r.status} (${r.duration}ms)`);
  }

  const successCount = results.filter(r => r.status === 'success').length;
  log(`Total: ${successCount}/${results.length} succeeded`);
}

function showStatus(): void {
  const runnerLog = loadRunnerLog();

  console.log('');
  console.log('=== RestauMargin Agent System — Status ===');
  console.log(`Last updated: ${runnerLog.lastUpdated}`);
  console.log(`Total runs (all time): ${runnerLog.totalRuns}`);
  console.log('');

  // Show each agent's last run
  console.log('Agent                  | Schedule          | Last Run            | Status  | Duration');
  console.log('-'.repeat(100));

  for (const [name, config] of Object.entries(AGENT_REGISTRY)) {
    const lastRun = [...runnerLog.runs]
      .reverse()
      .find(r => r.agent === name);

    const lastRunStr = lastRun
      ? new Date(lastRun.completedAt).toLocaleString('fr-FR', { timeZone: 'Europe/Paris' })
      : 'never';
    const statusStr = lastRun?.status || 'n/a';
    const durationStr = lastRun ? `${lastRun.durationMs}ms` : '-';

    console.log(
      `${name.padEnd(23)}| ${config.schedule.padEnd(18)}| ${lastRunStr.padEnd(20)}| ${statusStr.padEnd(8)}| ${durationStr}`
    );
  }

  console.log('');

  // Show recent failures
  const recentFailures = runnerLog.runs
    .filter(r => r.status !== 'success')
    .slice(-5);

  if (recentFailures.length > 0) {
    console.log('Recent Failures:');
    for (const f of recentFailures) {
      console.log(`  [${f.status}] ${f.agent} at ${f.completedAt} — exit code ${f.exitCode}`);
    }
    console.log('');
  }

  // Show today's stats
  const todayStr = new Date().toISOString().slice(0, 10);
  const todayRuns = runnerLog.runs.filter(r => r.startedAt.startsWith(todayStr));
  const todaySuccess = todayRuns.filter(r => r.status === 'success').length;
  const todayFailed = todayRuns.filter(r => r.status !== 'success').length;

  console.log(`Today: ${todayRuns.length} runs (${todaySuccess} success, ${todayFailed} failed)`);
  console.log('');
}

function showSchedule(): void {
  console.log('');
  console.log('=== RestauMargin Agent Schedules ===');
  console.log('');
  console.log('Agent                  | Cron Expression   | Human Schedule      | Description');
  console.log('-'.repeat(110));

  for (const [name, config] of Object.entries(AGENT_REGISTRY)) {
    console.log(
      `${name.padEnd(23)}| ${config.cron.padEnd(18)}| ${config.schedule.padEnd(20)}| ${config.description}`
    );
  }

  console.log('');
  console.log('Run commands:');
  for (const name of Object.keys(AGENT_REGISTRY)) {
    console.log(`  npx tsx scripts/agents/runner.ts --agent ${name}`);
  }
  console.log(`  npx tsx scripts/agents/runner.ts --all`);
  console.log('');
}

function showHelp(): void {
  console.log('');
  console.log('RestauMargin Agent Runner');
  console.log('========================');
  console.log('');
  console.log('Usage:');
  console.log('  npx tsx scripts/agents/runner.ts --agent <name>   Run a specific agent');
  console.log('  npx tsx scripts/agents/runner.ts --all            Run all agents');
  console.log('  npx tsx scripts/agents/runner.ts --status         Show agent status');
  console.log('  npx tsx scripts/agents/runner.ts --schedule       Show schedules');
  console.log('  npx tsx scripts/agents/runner.ts --help           Show this help');
  console.log('');
  console.log('Available agents:');
  for (const [name, config] of Object.entries(AGENT_REGISTRY)) {
    console.log(`  ${name.padEnd(25)} ${config.description}`);
  }
  console.log('');
}

// ── Main ────────────────────────────────────────────────────
async function main(): Promise<void> {
  ensureDir(DATA_DIR);

  const args = process.argv.slice(2);

  if (args.includes('--help') || args.includes('-h') || args.length === 0) {
    showHelp();
    return;
  }

  if (args.includes('--status')) {
    showStatus();
    return;
  }

  if (args.includes('--schedule')) {
    showSchedule();
    return;
  }

  if (args.includes('--all')) {
    await runAllAgents();
    return;
  }

  const agentIdx = args.indexOf('--agent');
  if (agentIdx >= 0 && args[agentIdx + 1]) {
    const agentName = args[agentIdx + 1];
    await runSingleAgent(agentName);
    return;
  }

  // Check if a bare agent name was passed
  const possibleAgent = args[0]?.replace(/^--?/, '');
  if (possibleAgent && AGENT_REGISTRY[possibleAgent]) {
    await runSingleAgent(possibleAgent);
    return;
  }

  console.error(`Unknown command: ${args.join(' ')}`);
  showHelp();
  process.exit(1);
}

// ── Execute ─────────────────────────────────────────────────
main()
  .then(() => {})
  .catch(err => {
    log(`FATAL: ${err.message}`);
    process.exit(1);
  });
