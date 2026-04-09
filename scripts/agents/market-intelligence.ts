#!/usr/bin/env npx tsx
// ============================================================
// RestauMargin Agent — Market Intelligence via Tavily API
// Usage: npx tsx scripts/agents/market-intelligence.ts
// Schedule: daily at 7h
// ============================================================

import * as fs from 'fs';
import * as path from 'path';

// ── Config ──────────────────────────────────────────────────
const TAVILY_API_KEY = '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';
const TAVILY_BASE = 'https://api.tavily.com';

const OUTPUT_DIR = path.resolve(__dirname, '..', '..', 'data', 'agents');
const today = new Date().toISOString().slice(0, 10);
const REPORT_FILE = path.join(OUTPUT_DIR, `market-intel-${today}.json`);

// Search queries
const QUERIES = [
  'prix matieres premieres restaurant france 2026',
  'tendance restauration 2026',
  'food cost france actualite',
  'inflation alimentaire restauration france',
  'logiciel gestion restaurant nouveaute',
];

// ── Types ───────────────────────────────────────────────────
interface TavilyResult {
  title: string;
  url: string;
  content: string;
  score: number;
  published_date?: string;
}

interface TavilyResponse {
  query: string;
  results: TavilyResult[];
  answer?: string;
}

interface ArticleSummary {
  title: string;
  url: string;
  snippet: string;
  score: number;
  publishedDate: string;
  query: string;
  category: 'prix_matieres' | 'tendances' | 'food_cost' | 'inflation' | 'tech_concurrence';
}

interface MarketIntelReport {
  timestamp: string;
  queriesRun: number;
  totalArticles: number;
  topArticles: ArticleSummary[];
  answerSummaries: { query: string; answer: string }[];
  categories: {
    prix_matieres: number;
    tendances: number;
    food_cost: number;
    inflation: number;
    tech_concurrence: number;
  };
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
  console.log(`[${ts}] [market-intel] ${msg}`);
}

function categorizeQuery(query: string): 'prix_matieres' | 'tendances' | 'food_cost' | 'inflation' | 'tech_concurrence' {
  if (query.includes('matieres premieres') || query.includes('prix')) return 'prix_matieres';
  if (query.includes('tendance')) return 'tendances';
  if (query.includes('food cost')) return 'food_cost';
  if (query.includes('inflation')) return 'inflation';
  if (query.includes('logiciel') || query.includes('nouveaute')) return 'tech_concurrence';
  return 'tendances';
}

// ── Tavily API ──────────────────────────────────────────────
async function searchTavily(query: string): Promise<TavilyResponse> {
  try {
    const res = await fetch(`${TAVILY_BASE}/search`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        api_key: TAVILY_API_KEY,
        query,
        search_depth: 'advanced',
        include_answer: true,
        include_raw_content: false,
        max_results: 5,
        include_domains: [],
        exclude_domains: [],
      }),
    });

    if (!res.ok) {
      const err = await res.text();
      log(`Tavily API error ${res.status}: ${err}`);
      return { query, results: [] };
    }

    const data = await res.json();
    return {
      query,
      results: data.results || [],
      answer: data.answer,
    };
  } catch (err: any) {
    log(`ERROR searching Tavily: ${err.message}`);
    return { query, results: [] };
  }
}

// ── Main ────────────────────────────────────────────────────
async function main(): Promise<MarketIntelReport> {
  log('Starting Market Intelligence run...');
  ensureDir(OUTPUT_DIR);

  const allArticles: ArticleSummary[] = [];
  const answerSummaries: { query: string; answer: string }[] = [];
  let totalResults = 0;

  for (const query of QUERIES) {
    log(`Searching: "${query}"`);
    const response = await searchTavily(query);
    const category = categorizeQuery(query);

    // Collect answer summary
    if (response.answer) {
      answerSummaries.push({ query, answer: response.answer });
    }

    // Process results
    for (const result of response.results) {
      totalResults++;
      allArticles.push({
        title: result.title,
        url: result.url,
        snippet: (result.content || '').slice(0, 400),
        score: result.score || 0,
        publishedDate: result.published_date || '',
        query,
        category,
      });
    }

    // Rate limit between searches
    await sleep(500);
  }

  // Sort by score and take top 5 per category, then overall top 5
  allArticles.sort((a, b) => b.score - a.score);
  const topArticles = allArticles.slice(0, 15); // Keep top 15 for diversity

  // Count by category
  const categories = {
    prix_matieres: allArticles.filter(a => a.category === 'prix_matieres').length,
    tendances: allArticles.filter(a => a.category === 'tendances').length,
    food_cost: allArticles.filter(a => a.category === 'food_cost').length,
    inflation: allArticles.filter(a => a.category === 'inflation').length,
    tech_concurrence: allArticles.filter(a => a.category === 'tech_concurrence').length,
  };

  // Build report
  const report: MarketIntelReport = {
    timestamp: new Date().toISOString(),
    queriesRun: QUERIES.length,
    totalArticles: totalResults,
    topArticles,
    answerSummaries,
    categories,
  };

  // Save report
  fs.writeFileSync(REPORT_FILE, JSON.stringify(report, null, 2), 'utf-8');
  log(`Report saved to ${REPORT_FILE}`);

  // Summary
  log('--- Summary ---');
  log(`Queries: ${QUERIES.length} | Articles found: ${totalResults}`);
  log(`Categories — Prix: ${categories.prix_matieres} | Tendances: ${categories.tendances} | Food Cost: ${categories.food_cost} | Inflation: ${categories.inflation} | Tech: ${categories.tech_concurrence}`);

  if (answerSummaries.length > 0) {
    log('--- AI Summaries ---');
    for (const s of answerSummaries) {
      log(`Q: ${s.query}`);
      log(`A: ${s.answer.slice(0, 200)}...`);
      log('');
    }
  }

  return report;
}

// ── Execute ─────────────────────────────────────────────────
main()
  .then(report => {
    log(`Market Intelligence completed. ${report.totalArticles} articles collected.`);
    process.exit(0);
  })
  .catch(err => {
    log(`FATAL: ${err.message}`);
    process.exit(1);
  });

export { main as runMarketIntelligence };
export type { MarketIntelReport, ArticleSummary };
