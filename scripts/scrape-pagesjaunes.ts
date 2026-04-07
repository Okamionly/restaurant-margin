#!/usr/bin/env npx tsx
// ============================================================
// RestauMargin — PagesJaunes Restaurant Scraper
// Dedicated PagesJaunes scraper with advanced extraction
// Usage: npx tsx scripts/scrape-pagesjaunes.ts <city> [--pages 10] [--emails-only]
// ============================================================

import * as fs from 'fs';
import * as path from 'path';

// ── Types ──────────────────────────────────────────────────────────
interface PJRestaurant {
  name: string;
  phone: string;
  address: string;
  city: string;
  postalCode: string;
  website: string;
  email: string;
  category: string;
  pjUrl: string;
  scrapedAt: string;
}

// ── Config ─────────────────────────────────────────────────────────
const RATE_LIMIT_MS = 2500; // Be extra polite with PagesJaunes
const EMAIL_REGEX = /[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}/g;
const OUTPUT_DIR = path.join(__dirname, '..', 'data', 'scraping');
const USER_AGENT = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36';

// ── Helpers ────────────────────────────────────────────────────────
function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function sanitizeCSV(str: string): string {
  if (!str) return '';
  const escaped = str.replace(/"/g, '""');
  return /[,"\n\r]/.test(str) ? `"${escaped}"` : escaped;
}

function cleanHtml(str: string): string {
  return str
    .replace(/<[^>]+>/g, '')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&apos;/g, "'")
    .replace(/&eacute;/g, 'e')
    .replace(/&egrave;/g, 'e')
    .replace(/&agrave;/g, 'a')
    .replace(/&ccedil;/g, 'c')
    .replace(/&nbsp;/g, ' ')
    .trim();
}

async function safeFetch(url: string, timeout = 12000): Promise<string | null> {
  try {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), timeout);
    const res = await fetch(url, {
      headers: {
        'User-Agent': USER_AGENT,
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        'Accept-Language': 'fr-FR,fr;q=0.9,en;q=0.5',
        'Accept-Encoding': 'gzip, deflate',
        'Referer': 'https://www.pagesjaunes.fr/',
      },
      signal: controller.signal,
      redirect: 'follow',
    });
    clearTimeout(timer);
    if (!res.ok) {
      console.log(`    [HTTP ${res.status}] ${url.substring(0, 80)}...`);
      return null;
    }
    return await res.text();
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'unknown error';
    if (!msg.includes('abort')) {
      console.log(`    [Fetch error] ${msg.substring(0, 60)}`);
    }
    return null;
  }
}

// ── Email extraction ───────────────────────────────────────────────
function extractEmails(html: string): string[] {
  const decoded = html
    .replace(/&#64;/g, '@')
    .replace(/&#46;/g, '.')
    .replace(/\[at\]/gi, '@')
    .replace(/\[dot\]/gi, '.')
    .replace(/ at /gi, '@')
    .replace(/ dot /gi, '.')
    .replace(/mailto:/gi, '');

  const matches = decoded.match(EMAIL_REGEX) || [];

  const blacklist = [
    'example.com', 'sentry.io', 'w3.org', 'schema.org', 'googleapis.com',
    'gravatar.com', 'wordpress.org', 'cloudflare.com', 'facebook.com',
    'twitter.com', 'google.com', 'pagesjaunes.fr', 'solocal.com',
    '.png', '.jpg', '.gif', '.svg', '.css', '.js', '.woff',
  ];

  return [...new Set(matches)]
    .filter(email => {
      const lower = email.toLowerCase();
      return !blacklist.some(b => lower.includes(b))
        && !lower.startsWith('noreply')
        && !lower.startsWith('no-reply')
        && !lower.startsWith('webmaster')
        && email.length < 80
        && email.includes('.');
    });
}

// ── Parse PagesJaunes search results page ─────────────────────────
function parsePJSearchResults(html: string, city: string): Partial<PJRestaurant>[] {
  const results: Partial<PJRestaurant>[] = [];

  // PagesJaunes uses JSON-LD structured data for listings
  const jsonLdRegex = /<script[^>]*type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/gi;
  let jsonMatch;
  while ((jsonMatch = jsonLdRegex.exec(html)) !== null) {
    try {
      const data = JSON.parse(jsonMatch[1]);
      const items = Array.isArray(data) ? data : [data];
      for (const item of items) {
        if (item['@type'] === 'LocalBusiness' || item['@type'] === 'Restaurant' || item['@type'] === 'FoodEstablishment') {
          results.push({
            name: item.name || '',
            phone: item.telephone || '',
            address: item.address?.streetAddress || '',
            postalCode: item.address?.postalCode || '',
            website: item.url || '',
            category: item.servesCuisine || '',
          });
        }
      }
    } catch {
      // JSON parse failed, ignore
    }
  }

  // Fallback: regex extraction from HTML structure
  if (results.length === 0) {
    // Extract listing blocks
    // PJ uses class patterns like "bi-header-title" for names
    const blocks = html.split(/class="[^"]*bi-header/gi);
    for (let i = 1; i < blocks.length; i++) {
      const block = blocks[i].substring(0, 3000); // Limit to avoid huge blocks

      // Name
      const nameMatch = block.match(/title="([^"]+)"/i) || block.match(/>([^<]{3,60})<\/a>/i);
      const name = nameMatch ? cleanHtml(nameMatch[1]) : '';
      if (!name) continue;

      // Phone
      const phoneMatch = block.match(/tel:([+\d\s.\-()]+)/i) || block.match(/(0[1-9][\s.]?\d{2}[\s.]?\d{2}[\s.]?\d{2}[\s.]?\d{2})/);
      const phone = phoneMatch ? phoneMatch[1].trim() : '';

      // Address
      const addrMatch = block.match(/class="[^"]*bi-address[^"]*"[^>]*>([^<]+)/i);
      const address = addrMatch ? cleanHtml(addrMatch[1]) : '';

      // Website link (external link, not PJ)
      const webMatch = block.match(/href="(https?:\/\/(?!www\.pagesjaunes)[^"]+)"/i);
      const website = webMatch ? webMatch[1] : '';

      // Category/cuisine
      const catMatch = block.match(/class="[^"]*bi-activity[^"]*"[^>]*>([^<]+)/i);
      const category = catMatch ? cleanHtml(catMatch[1]) : '';

      // PJ detail page URL
      const pjMatch = block.match(/href="(\/pros\/[^"]+)"/i);
      const pjUrl = pjMatch ? `https://www.pagesjaunes.fr${pjMatch[1]}` : '';

      results.push({ name, phone, address, postalCode: '', website, category, pjUrl });
    }
  }

  // Set city for all results
  results.forEach(r => { r.city = city; });

  return results;
}

// ── Scrape individual PagesJaunes listing detail page ──────────────
async function scrapePJDetailPage(url: string): Promise<{ website: string; email: string; phone: string }> {
  const html = await safeFetch(url);
  if (!html) return { website: '', email: '', phone: '' };

  // Extract website from detail page
  let website = '';
  const webMatch = html.match(/href="(https?:\/\/(?!www\.pagesjaunes|www\.facebook|www\.instagram|www\.twitter)[^"]+)"[^>]*class="[^"]*link-website/i)
    || html.match(/class="[^"]*link-website[^"]*"[^>]*href="(https?:\/\/[^"]+)"/i)
    || html.match(/Site internet[^<]*<[^>]*href="(https?:\/\/[^"]+)"/i);
  if (webMatch) website = webMatch[1];

  // Extract email directly from PJ page
  const emails = extractEmails(html);

  // Extract phone if not already known
  const phoneMatch = html.match(/(0[1-9][\s.]?\d{2}[\s.]?\d{2}[\s.]?\d{2}[\s.]?\d{2})/);

  return {
    website,
    email: emails[0] || '',
    phone: phoneMatch ? phoneMatch[1] : '',
  };
}

// ── Scrape restaurant's own website for email ──────────────────────
async function scrapeRestaurantWebsite(websiteUrl: string): Promise<string[]> {
  console.log(`    [Website] Scanning: ${websiteUrl}`);

  const html = await safeFetch(websiteUrl, 8000);
  if (!html) return [];

  let emails = extractEmails(html);
  if (emails.length > 0) return emails;

  // Try common contact sub-pages
  try {
    const baseUrl = new URL(websiteUrl).origin;
    const contactPages = ['/contact', '/contact.html', '/contactez-nous', '/a-propos', '/about', '/mentions-legales'];

    for (const page of contactPages) {
      await sleep(1500);
      const subHtml = await safeFetch(baseUrl + page, 6000);
      if (subHtml) {
        emails = extractEmails(subHtml);
        if (emails.length > 0) {
          console.log(`    [Website] Email found on ${page}`);
          return emails;
        }
      }
    }
  } catch {
    // URL parsing failed
  }

  return [];
}

// ── Main scraping flow ─────────────────────────────────────────────
async function scrapePagesJaunes(city: string, maxPages: number, emailsOnly: boolean): Promise<void> {
  console.log(`\n========================================`);
  console.log(`  PagesJaunes Scraper — ${city}`);
  console.log(`  Max pages: ${maxPages}`);
  console.log(`  Mode: ${emailsOnly ? 'emails only' : 'all results'}`);
  console.log(`========================================\n`);

  // Ensure output directory
  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  }

  const timestamp = new Date().toISOString().slice(0, 10);
  const csvFile = path.join(OUTPUT_DIR, `pj-${city.toLowerCase().replace(/\s+/g, '-')}-${timestamp}.csv`);

  // Write CSV header
  const header = 'name,phone,address,city,postalCode,website,email,category,pjUrl,scrapedAt\n';
  fs.writeFileSync(csvFile, header, 'utf-8');

  console.log(`  Output: ${csvFile}\n`);

  const allResults: PJRestaurant[] = [];
  const seenNames = new Set<string>();
  let totalListings = 0;

  for (let page = 1; page <= maxPages; page++) {
    console.log(`\n--- Page ${page}/${maxPages} ---`);

    const searchUrl = `https://www.pagesjaunes.fr/annuaire/chercherlespros?quoiqui=restaurant&ou=${encodeURIComponent(city)}&page=${page}`;
    const html = await safeFetch(searchUrl);

    if (!html) {
      console.log(`  Page ${page} failed to load. Stopping.`);
      break;
    }

    // Check if we got a valid results page
    if (html.includes('Aucun r') || html.includes('pas de r')) {
      console.log(`  No more results. Stopping.`);
      break;
    }

    const listings = parsePJSearchResults(html, city);
    console.log(`  Found ${listings.length} listings on page ${page}`);
    totalListings += listings.length;

    if (listings.length === 0) {
      console.log(`  Empty page. Stopping.`);
      break;
    }

    for (const listing of listings) {
      if (!listing.name) continue;
      const key = listing.name.toLowerCase();
      if (seenNames.has(key)) continue;
      seenNames.add(key);

      const restaurant: PJRestaurant = {
        name: listing.name || '',
        phone: listing.phone || '',
        address: listing.address || '',
        city: city,
        postalCode: listing.postalCode || '',
        website: listing.website || '',
        email: '',
        category: listing.category || '',
        pjUrl: listing.pjUrl || '',
        scrapedAt: new Date().toISOString(),
      };

      // Step 1: Visit PJ detail page for more info
      if (restaurant.pjUrl) {
        await sleep(RATE_LIMIT_MS);
        const detail = await scrapePJDetailPage(restaurant.pjUrl);
        if (detail.website && !restaurant.website) restaurant.website = detail.website;
        if (detail.email) restaurant.email = detail.email;
        if (detail.phone && !restaurant.phone) restaurant.phone = detail.phone;
      }

      // Step 2: Visit restaurant website for email
      if (!restaurant.email && restaurant.website) {
        await sleep(RATE_LIMIT_MS);
        const emails = await scrapeRestaurantWebsite(restaurant.website);
        if (emails.length > 0) restaurant.email = emails[0];
      }

      // Skip if emails-only mode and no email
      if (emailsOnly && !restaurant.email) {
        console.log(`  [SKIP] ${restaurant.name} — no email found`);
        continue;
      }

      allResults.push(restaurant);

      // Write to CSV incrementally
      const line = [
        sanitizeCSV(restaurant.name),
        sanitizeCSV(restaurant.phone),
        sanitizeCSV(restaurant.address),
        sanitizeCSV(restaurant.city),
        sanitizeCSV(restaurant.postalCode),
        sanitizeCSV(restaurant.website),
        sanitizeCSV(restaurant.email),
        sanitizeCSV(restaurant.category),
        sanitizeCSV(restaurant.pjUrl),
        sanitizeCSV(restaurant.scrapedAt),
      ].join(',');
      fs.appendFileSync(csvFile, line + '\n', 'utf-8');

      const emailStr = restaurant.email ? `>>> ${restaurant.email}` : 'no email';
      console.log(`  [${allResults.length}] ${restaurant.name} | ${emailStr}`);
    }

    await sleep(RATE_LIMIT_MS);
  }

  // ── Summary ────────────────────────────────────────────────────
  const withEmail = allResults.filter(r => r.email);
  console.log(`\n========================================`);
  console.log(`  SCRAPING COMPLETE: ${city}`);
  console.log(`  Pages scraped: ${maxPages}`);
  console.log(`  Total listings processed: ${totalListings}`);
  console.log(`  Unique restaurants saved: ${allResults.length}`);
  console.log(`  With email: ${withEmail.length} (${totalListings > 0 ? Math.round(withEmail.length / totalListings * 100) : 0}%)`);
  console.log(`  CSV: ${csvFile}`);
  console.log(`========================================\n`);

  // Also write a summary JSON for easy programmatic access
  const summaryFile = path.join(OUTPUT_DIR, `pj-${city.toLowerCase().replace(/\s+/g, '-')}-${timestamp}-summary.json`);
  fs.writeFileSync(summaryFile, JSON.stringify({
    city,
    date: timestamp,
    totalListings,
    uniqueRestaurants: allResults.length,
    withEmail: withEmail.length,
    withoutEmail: allResults.length - withEmail.length,
    emailRate: totalListings > 0 ? `${Math.round(withEmail.length / totalListings * 100)}%` : '0%',
    csvFile,
  }, null, 2), 'utf-8');
}

// ── CLI ────────────────────────────────────────────────────────────
async function main() {
  const args = process.argv.slice(2);

  if (args.length === 0 || args.includes('--help')) {
    console.log(`
  RestauMargin — PagesJaunes Restaurant Scraper
  ================================================

  Usage:
    npx tsx scripts/scrape-pagesjaunes.ts <city> [options]

  Examples:
    npx tsx scripts/scrape-pagesjaunes.ts Paris
    npx tsx scripts/scrape-pagesjaunes.ts Lyon --pages 10
    npx tsx scripts/scrape-pagesjaunes.ts Marseille --pages 5 --emails-only

  Options:
    --pages N       Number of PagesJaunes pages to scrape (default: 5, ~20 results/page)
    --emails-only   Only save restaurants where an email was found
    --help          Show this help message

  Output:
    CSV: data/scraping/pj-<city>-<date>.csv
    Summary: data/scraping/pj-<city>-<date>-summary.json
    `);
    process.exit(0);
  }

  const city = args[0];
  const pagesIdx = args.indexOf('--pages');
  const maxPages = pagesIdx !== -1 ? parseInt(args[pagesIdx + 1], 10) || 5 : 5;
  const emailsOnly = args.includes('--emails-only');

  await scrapePagesJaunes(city, maxPages, emailsOnly);
}

main().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});
