#!/usr/bin/env npx tsx
// ============================================================
// RestauMargin Agent — Restaurant Lead Finder via Exa API
// Usage: npx tsx scripts/agents/lead-finder.ts
// Schedule: daily at 8h
// ============================================================

import * as fs from 'fs';
import * as path from 'path';

// ── Config ──────────────────────────────────────────────────
const EXA_API_KEY = '85caf1c5-927c-4053-8dfb-9ea249872cb9';
const EXA_BASE = 'https://api.exa.ai';

const OUTPUT_DIR = path.resolve(__dirname, '..', '..', 'data', 'agents');
const CAMPAIGNS_DIR = path.resolve(__dirname, '..', '..', 'docs', 'campaigns');
const today = new Date().toISOString().slice(0, 10);
const CSV_OUTPUT = path.join(CAMPAIGNS_DIR, `exa-leads-${today}.csv`);
const JSON_OUTPUT = path.join(OUTPUT_DIR, `lead-finder-${today}.json`);

// Existing contacts CSVs for deduplication
const EXISTING_CSV_FILES = [
  'montpellier-contacts.csv',
  'montpellier-contacts-v2.csv',
  'montpellier-region-contacts.csv',
  'national-contacts.csv',
  'phase2-contacts.csv',
  'phase3-4-contacts.csv',
  'remaining-contacts.csv',
];

// 5 French cities per run — rotate through these
const ALL_CITIES = [
  'Montpellier', 'Paris', 'Lyon', 'Marseille', 'Bordeaux',
  'Toulouse', 'Nantes', 'Strasbourg', 'Lille', 'Nice',
  'Rennes', 'Grenoble', 'Aix-en-Provence', 'Toulon', 'Dijon',
];

// Search queries per city
const SEARCH_TEMPLATES = [
  'restaurant ouverture {city} 2026',
  'nouveau restaurant {city}',
  'restaurateur {city}',
];

// Competitor analysis queries (run once, not per city)
const COMPETITOR_QUERIES = [
  'logiciel gestion restaurant france',
  'outil food cost restaurant',
];

// ── Types ───────────────────────────────────────────────────
interface ExaResult {
  url: string;
  title: string;
  text?: string;
  publishedDate?: string;
  author?: string;
  score?: number;
}

interface ExaSearchResponse {
  results: ExaResult[];
  autopromptString?: string;
}

interface Lead {
  name: string;
  city: string;
  url: string;
  source: string;
  query: string;
  score: number;
  publishedDate: string;
  snippet: string;
  type: 'new_restaurant' | 'owner_contact' | 'competitor';
}

interface LeadFinderReport {
  timestamp: string;
  citiesSearched: string[];
  totalSearches: number;
  totalResults: number;
  newLeads: number;
  duplicatesSkipped: number;
  competitorInsights: number;
  leads: Lead[];
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
  console.log(`[${ts}] [lead-finder] ${msg}`);
}

function getCitiesToSearch(): string[] {
  // Pick 5 cities based on the day of year for rotation
  const dayOfYear = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86400000);
  const startIndex = (dayOfYear * 5) % ALL_CITIES.length;
  const cities: string[] = [];
  for (let i = 0; i < 5; i++) {
    cities.push(ALL_CITIES[(startIndex + i) % ALL_CITIES.length]);
  }
  return cities;
}

function loadExistingEmails(): Set<string> {
  const emails = new Set<string>();
  for (const file of EXISTING_CSV_FILES) {
    const filePath = path.join(CAMPAIGNS_DIR, file);
    if (!fs.existsSync(filePath)) continue;
    try {
      const content = fs.readFileSync(filePath, 'utf-8');
      const lines = content.split('\n').slice(1); // skip header
      for (const line of lines) {
        // Try to extract email from CSV line
        const match = line.match(/[\w.-]+@[\w.-]+\.\w+/);
        if (match) emails.add(match[0].toLowerCase());
      }
    } catch {
      // skip unreadable files
    }
  }
  return emails;
}

function loadExistingUrls(): Set<string> {
  const urls = new Set<string>();
  // Also load previous lead-finder outputs for URL dedup
  if (fs.existsSync(OUTPUT_DIR)) {
    const files = fs.readdirSync(OUTPUT_DIR).filter(f => f.startsWith('lead-finder-'));
    for (const file of files) {
      try {
        const data = JSON.parse(fs.readFileSync(path.join(OUTPUT_DIR, file), 'utf-8'));
        for (const lead of data.leads || []) {
          if (lead.url) urls.add(lead.url.toLowerCase());
        }
      } catch {
        // skip corrupt files
      }
    }
  }
  return urls;
}

function extractNameFromTitle(title: string): string {
  // Try to extract restaurant/business name from result title
  const cleaned = title
    .replace(/[-–—|].*$/, '') // remove everything after dash/pipe
    .replace(/\s*\(.*?\)\s*/g, '') // remove parenthetical
    .trim();
  return cleaned || title;
}

function determineLeadType(query: string): 'new_restaurant' | 'owner_contact' | 'competitor' {
  if (query.includes('logiciel') || query.includes('outil')) return 'competitor';
  if (query.includes('restaurateur')) return 'owner_contact';
  return 'new_restaurant';
}

// ── Exa API ─────────────────────────────────────────────────
async function searchExa(query: string, numResults = 10): Promise<ExaResult[]> {
  try {
    const res = await fetch(`${EXA_BASE}/search`, {
      method: 'POST',
      headers: {
        'x-api-key': EXA_API_KEY,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query,
        numResults,
        type: 'auto',
        useAutoprompt: true,
        startPublishedDate: new Date(Date.now() - 90 * 86400000).toISOString().slice(0, 10), // last 90 days
        contents: {
          text: { maxCharacters: 500 },
        },
      }),
    });

    if (!res.ok) {
      const err = await res.text();
      log(`Exa API error ${res.status}: ${err}`);
      return [];
    }

    const data = (await res.json()) as ExaSearchResponse;
    return data.results || [];
  } catch (err: any) {
    log(`ERROR searching Exa: ${err.message}`);
    return [];
  }
}

// ── CSV Writer ──────────────────────────────────────────────
function escapeCSV(val: string): string {
  if (val.includes(',') || val.includes('"') || val.includes('\n')) {
    return `"${val.replace(/"/g, '""')}"`;
  }
  return val;
}

function writeLeadsCSV(leads: Lead[]): void {
  const header = 'name,city,url,type,score,published_date,snippet,query';
  const rows = leads.map(l =>
    [l.name, l.city, l.url, l.type, l.score.toFixed(2), l.publishedDate, l.snippet.slice(0, 200), l.query]
      .map(v => escapeCSV(String(v)))
      .join(',')
  );
  const content = [header, ...rows].join('\n');
  fs.writeFileSync(CSV_OUTPUT, content, 'utf-8');
  log(`CSV saved: ${CSV_OUTPUT} (${leads.length} leads)`);
}

// ── Main ────────────────────────────────────────────────────
async function main(): Promise<LeadFinderReport> {
  log('Starting Lead Finder run...');
  ensureDir(OUTPUT_DIR);
  ensureDir(CAMPAIGNS_DIR);

  const cities = getCitiesToSearch();
  log(`Cities for today: ${cities.join(', ')}`);

  const existingUrls = loadExistingUrls();
  log(`Loaded ${existingUrls.size} known URLs for deduplication`);

  const allLeads: Lead[] = [];
  let totalSearches = 0;
  let totalResults = 0;
  let duplicatesSkipped = 0;

  // Search per city
  for (const city of cities) {
    for (const template of SEARCH_TEMPLATES) {
      const query = template.replace('{city}', city);
      log(`Searching: "${query}"`);
      totalSearches++;

      const results = await searchExa(query, 10);
      totalResults += results.length;

      for (const result of results) {
        const urlLower = result.url.toLowerCase();
        if (existingUrls.has(urlLower)) {
          duplicatesSkipped++;
          continue;
        }
        existingUrls.add(urlLower);

        allLeads.push({
          name: extractNameFromTitle(result.title || ''),
          city,
          url: result.url,
          source: 'exa',
          query,
          score: result.score || 0,
          publishedDate: result.publishedDate || '',
          snippet: (result.text || '').slice(0, 300),
          type: determineLeadType(query),
        });
      }

      // Rate limit: 200ms between searches
      await sleep(200);
    }
  }

  // Competitor analysis queries
  let competitorInsights = 0;
  for (const query of COMPETITOR_QUERIES) {
    log(`Competitor search: "${query}"`);
    totalSearches++;

    const results = await searchExa(query, 5);
    totalResults += results.length;
    competitorInsights += results.length;

    for (const result of results) {
      const urlLower = result.url.toLowerCase();
      if (existingUrls.has(urlLower)) {
        duplicatesSkipped++;
        continue;
      }
      existingUrls.add(urlLower);

      allLeads.push({
        name: extractNameFromTitle(result.title || ''),
        city: 'France',
        url: result.url,
        source: 'exa',
        query,
        score: result.score || 0,
        publishedDate: result.publishedDate || '',
        snippet: (result.text || '').slice(0, 300),
        type: 'competitor',
      });
    }

    await sleep(200);
  }

  // Save CSV
  const nonCompetitorLeads = allLeads.filter(l => l.type !== 'competitor');
  if (nonCompetitorLeads.length > 0) {
    writeLeadsCSV(nonCompetitorLeads);
  }

  // Build report
  const report: LeadFinderReport = {
    timestamp: new Date().toISOString(),
    citiesSearched: cities,
    totalSearches,
    totalResults,
    newLeads: allLeads.length,
    duplicatesSkipped,
    competitorInsights,
    leads: allLeads,
  };

  // Save JSON report
  fs.writeFileSync(JSON_OUTPUT, JSON.stringify(report, null, 2), 'utf-8');
  log(`Report saved to ${JSON_OUTPUT}`);

  // Summary
  log('--- Summary ---');
  log(`Cities: ${cities.join(', ')}`);
  log(`Searches: ${totalSearches} | Results: ${totalResults}`);
  log(`New leads: ${allLeads.length} | Duplicates skipped: ${duplicatesSkipped}`);
  log(`Competitor insights: ${competitorInsights}`);

  return report;
}

// ── Execute ─────────────────────────────────────────────────
main()
  .then(report => {
    log(`Lead Finder completed. ${report.newLeads} new leads found.`);
    process.exit(0);
  })
  .catch(err => {
    log(`FATAL: ${err.message}`);
    process.exit(1);
  });

export { main as runLeadFinder };
export type { LeadFinderReport, Lead };
