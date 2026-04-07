#!/usr/bin/env npx tsx
// ============================================================
// RestauMargin — Restaurant Email Scraper (Google → PagesJaunes → Website)
// Usage: npx tsx scripts/scrape-restaurants.ts <city> [--limit 50]
// ============================================================

import * as fs from 'fs';
import * as path from 'path';

// ── Types ──────────────────────────────────────────────────────────
interface Restaurant {
  name: string;
  phone: string;
  address: string;
  city: string;
  website: string;
  email: string;
  source: string;
  scrapedAt: string;
}

// ── Config ─────────────────────────────────────────────────────────
const RATE_LIMIT_MS = 2000; // 1 request per 2 seconds
const EMAIL_REGEX = /[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}/g;
const OUTPUT_DIR = path.join(__dirname, '..', 'data', 'scraping');
const USER_AGENT = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36';

// ── Helpers ────────────────────────────────────────────────────────
function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function sanitizeCSV(str: string): string {
  if (!str) return '';
  // Escape quotes and wrap in quotes if contains comma/newline
  const escaped = str.replace(/"/g, '""');
  return /[,"\n\r]/.test(str) ? `"${escaped}"` : escaped;
}

function appendToCSV(filePath: string, restaurant: Restaurant): void {
  const line = [
    sanitizeCSV(restaurant.name),
    sanitizeCSV(restaurant.phone),
    sanitizeCSV(restaurant.address),
    sanitizeCSV(restaurant.city),
    sanitizeCSV(restaurant.website),
    sanitizeCSV(restaurant.email),
    sanitizeCSV(restaurant.source),
    sanitizeCSV(restaurant.scrapedAt),
  ].join(',');

  fs.appendFileSync(filePath, line + '\n', 'utf-8');
}

function initCSV(filePath: string): void {
  const header = 'name,phone,address,city,website,email,source,scrapedAt\n';
  fs.writeFileSync(filePath, header, 'utf-8');
}

async function safeFetch(url: string, timeout = 10000): Promise<string | null> {
  try {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), timeout);
    const res = await fetch(url, {
      headers: {
        'User-Agent': USER_AGENT,
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        'Accept-Language': 'fr-FR,fr;q=0.9,en;q=0.5',
      },
      signal: controller.signal,
      redirect: 'follow',
    });
    clearTimeout(timer);
    if (!res.ok) return null;
    return await res.text();
  } catch {
    return null;
  }
}

// ── Email extraction from HTML ─────────────────────────────────────
function extractEmails(html: string): string[] {
  // Decode HTML entities that might hide emails
  const decoded = html
    .replace(/&#64;/g, '@')
    .replace(/&#46;/g, '.')
    .replace(/\[at\]/gi, '@')
    .replace(/\[dot\]/gi, '.')
    .replace(/ at /gi, '@')
    .replace(/ dot /gi, '.');

  const matches = decoded.match(EMAIL_REGEX) || [];

  // Filter out common false positives
  const blacklist = [
    'example.com', 'sentry.io', 'w3.org', 'schema.org', 'googleapis.com',
    'gravatar.com', 'wordpress.org', 'apache.org', 'cloudflare.com',
    'facebook.com', 'twitter.com', 'google.com', 'jquery.com',
    'wix.com', 'squarespace.com', 'shopify.com', 'webflow.com',
    '.png', '.jpg', '.gif', '.svg', '.css', '.js', '.woff',
  ];

  return [...new Set(matches)]
    .filter(email => {
      const lower = email.toLowerCase();
      return !blacklist.some(b => lower.includes(b))
        && !lower.startsWith('noreply')
        && !lower.startsWith('no-reply')
        && !lower.startsWith('mailer-daemon')
        && email.length < 80;
    });
}

// ── Extract website URL from PagesJaunes listing page ─────────────
function extractWebsites(html: string): string[] {
  const websites: string[] = [];
  // PagesJaunes uses data-pjlb links for website redirects
  const urlRegex = /href=["'](https?:\/\/[^"'<>\s]+)["']/gi;
  let match;
  while ((match = urlRegex.exec(html)) !== null) {
    const url = match[1];
    // Skip PagesJaunes internal links, social media, and tracking URLs
    if (
      !url.includes('pagesjaunes.fr') &&
      !url.includes('facebook.com') &&
      !url.includes('instagram.com') &&
      !url.includes('twitter.com') &&
      !url.includes('google.com') &&
      !url.includes('tripadvisor') &&
      !url.includes('yelp.com') &&
      !url.includes('javascript:') &&
      (url.startsWith('http://') || url.startsWith('https://'))
    ) {
      websites.push(url);
    }
  }
  return [...new Set(websites)];
}

// ── Extract restaurant info from PagesJaunes search HTML ──────────
function extractListings(html: string, city: string): Partial<Restaurant>[] {
  const restaurants: Partial<Restaurant>[] = [];

  // PagesJaunes listings are in <li> blocks with class "bi-generic"
  // We use regex-based extraction (no DOM parser dependency)

  // Extract name: look for bi-denomination spans or h3 tags with business names
  const nameRegex = /class="[^"]*bi-denomination[^"]*"[^>]*>([^<]+)</gi;
  const phoneRegex = /(?:tel:|href="tel:)([+\d\s.\-()]+)/gi;
  const addressRegex = /class="[^"]*bi-address[^"]*"[^>]*>([^<]+)</gi;

  const names: string[] = [];
  const phones: string[] = [];
  const addresses: string[] = [];

  let m;
  while ((m = nameRegex.exec(html)) !== null) names.push(m[1].trim());
  while ((m = phoneRegex.exec(html)) !== null) phones.push(m[1].trim());
  while ((m = addressRegex.exec(html)) !== null) addresses.push(m[1].trim());

  // Also try a broader name extraction from anchor tags with titles
  if (names.length === 0) {
    const titleRegex = /<a[^>]*class="[^"]*bi-denomination[^"]*"[^>]*title="([^"]+)"/gi;
    while ((m = titleRegex.exec(html)) !== null) names.push(m[1].trim());
  }

  // Also try extracting from SEO-friendly listing blocks
  if (names.length === 0) {
    const h3Regex = /<h3[^>]*>[\s]*<a[^>]*>([^<]+)<\/a>[\s]*<\/h3>/gi;
    while ((m = h3Regex.exec(html)) !== null) names.push(m[1].trim());
  }

  const count = Math.max(names.length, 1);
  for (let i = 0; i < count; i++) {
    if (names[i]) {
      restaurants.push({
        name: names[i] || '',
        phone: phones[i] || '',
        address: addresses[i] || '',
        city: city,
      });
    }
  }

  return restaurants;
}

// ── Google search approach for finding restaurant pages ────────────
async function searchGoogle(query: string): Promise<string[]> {
  // Use Google search to find PagesJaunes listings
  const encoded = encodeURIComponent(query);
  const url = `https://www.google.com/search?q=${encoded}&num=20&hl=fr`;

  console.log(`  [Google] Searching: ${query}`);
  const html = await safeFetch(url);
  if (!html) {
    console.log('  [Google] Search failed or blocked');
    return [];
  }

  // Extract URLs from Google results
  const urlRegex = /href="\/url\?q=(https?[^"&]+)/gi;
  const urls: string[] = [];
  let match;
  while ((match = urlRegex.exec(html)) !== null) {
    urls.push(decodeURIComponent(match[1]));
  }

  // Also try direct href extraction
  const directRegex = /href="(https?:\/\/(?:www\.)?pagesjaunes\.fr[^"]+)"/gi;
  while ((match = directRegex.exec(html)) !== null) {
    urls.push(decodeURIComponent(match[1]));
  }

  return [...new Set(urls)];
}

// ── Direct PagesJaunes search ─────────────────────────────────────
async function searchPagesJaunes(city: string, page: number = 1): Promise<string | null> {
  const normalizedCity = city.toLowerCase().replace(/\s+/g, '-').replace(/[éèê]/g, 'e').replace(/[àâ]/g, 'a');
  const url = `https://www.pagesjaunes.fr/annuaire/chercherlespros?quoiqui=restaurant&ou=${encodeURIComponent(city)}&page=${page}`;

  console.log(`  [PagesJaunes] Fetching page ${page} for "${city}"`);
  return safeFetch(url);
}

// ── Scrape a single restaurant website for emails ──────────────────
async function scrapeWebsiteForEmail(websiteUrl: string): Promise<string[]> {
  console.log(`    [Website] Fetching: ${websiteUrl}`);
  const html = await safeFetch(websiteUrl, 8000);
  if (!html) return [];

  const emails = extractEmails(html);

  // If no email on main page, try common sub-pages
  if (emails.length === 0) {
    const baseUrl = new URL(websiteUrl).origin;
    const subPages = ['/contact', '/about', '/a-propos', '/mentions-legales', '/legal'];

    for (const sub of subPages) {
      await sleep(1000);
      const subHtml = await safeFetch(baseUrl + sub, 6000);
      if (subHtml) {
        const subEmails = extractEmails(subHtml);
        if (subEmails.length > 0) {
          console.log(`    [Website] Found email on ${sub}`);
          return subEmails;
        }
      }
    }
  }

  return emails;
}

// ── Main scraping flow ─────────────────────────────────────────────
async function scrapeCity(city: string, limit: number = 100): Promise<void> {
  console.log(`\n========================================`);
  console.log(`  Scraping restaurants in: ${city}`);
  console.log(`  Limit: ${limit} results`);
  console.log(`========================================\n`);

  // Ensure output directory exists
  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  }

  const timestamp = new Date().toISOString().slice(0, 10);
  const csvFile = path.join(OUTPUT_DIR, `restaurants-${city.toLowerCase().replace(/\s+/g, '-')}-${timestamp}.csv`);
  initCSV(csvFile);
  console.log(`  Output: ${csvFile}\n`);

  const allRestaurants: Restaurant[] = [];
  const seenNames = new Set<string>();

  // Strategy 1: Direct PagesJaunes search
  console.log('--- Strategy 1: PagesJaunes direct search ---');
  for (let page = 1; page <= 5; page++) {
    if (allRestaurants.length >= limit) break;

    const html = await searchPagesJaunes(city, page);
    if (!html) {
      console.log(`  [PagesJaunes] Page ${page} failed, stopping pagination`);
      break;
    }

    const listings = extractListings(html, city);
    console.log(`  [PagesJaunes] Page ${page}: found ${listings.length} listings`);

    if (listings.length === 0) break;

    // Extract website links from the search results page
    const websites = extractWebsites(html);

    for (let i = 0; i < listings.length && allRestaurants.length < limit; i++) {
      const listing = listings[i];
      if (!listing.name || seenNames.has(listing.name.toLowerCase())) continue;
      seenNames.add(listing.name.toLowerCase());

      const restaurant: Restaurant = {
        name: listing.name || '',
        phone: listing.phone || '',
        address: listing.address || '',
        city: city,
        website: '',
        email: '',
        source: 'pagesjaunes',
        scrapedAt: new Date().toISOString(),
      };

      // Try to find email from restaurant websites found in the page
      if (websites[i]) {
        restaurant.website = websites[i];
        await sleep(RATE_LIMIT_MS);
        const emails = await scrapeWebsiteForEmail(websites[i]);
        if (emails.length > 0) {
          restaurant.email = emails[0];
          console.log(`  >>> FOUND EMAIL: ${restaurant.name} → ${restaurant.email}`);
        }
      }

      allRestaurants.push(restaurant);
      appendToCSV(csvFile, restaurant);
      console.log(`  [${allRestaurants.length}/${limit}] ${restaurant.name} | ${restaurant.email || 'no email'}`);
    }

    await sleep(RATE_LIMIT_MS);
  }

  // Strategy 2: Google search for more results
  console.log('\n--- Strategy 2: Google search ---');
  const queries = [
    `restaurant ${city} email contact`,
    `restaurant ${city} site:pagesjaunes.fr`,
    `meilleur restaurant ${city} contact`,
  ];

  for (const query of queries) {
    if (allRestaurants.length >= limit) break;

    const urls = await searchGoogle(query);
    await sleep(RATE_LIMIT_MS);

    for (const url of urls) {
      if (allRestaurants.length >= limit) break;

      // Visit each URL and look for restaurant info + emails
      const html = await safeFetch(url, 8000);
      if (!html) continue;

      const emails = extractEmails(html);
      if (emails.length > 0) {
        // Try to extract a restaurant name from the page title
        const titleMatch = html.match(/<title[^>]*>([^<]+)<\/title>/i);
        const name = titleMatch?.[1]?.split(/[|\-–—]/)[0]?.trim() || url;

        if (seenNames.has(name.toLowerCase())) continue;
        seenNames.add(name.toLowerCase());

        const restaurant: Restaurant = {
          name: name,
          phone: '',
          address: '',
          city: city,
          website: url,
          email: emails[0],
          source: 'google',
          scrapedAt: new Date().toISOString(),
        };

        allRestaurants.push(restaurant);
        appendToCSV(csvFile, restaurant);
        console.log(`  >>> FOUND: ${restaurant.name} → ${restaurant.email}`);
      }

      await sleep(RATE_LIMIT_MS);
    }
  }

  // ── Summary ────────────────────────────────────────────────────
  const withEmail = allRestaurants.filter(r => r.email);
  console.log(`\n========================================`);
  console.log(`  SCRAPING COMPLETE: ${city}`);
  console.log(`  Total restaurants found: ${allRestaurants.length}`);
  console.log(`  With email: ${withEmail.length}`);
  console.log(`  Without email: ${allRestaurants.length - withEmail.length}`);
  console.log(`  CSV saved: ${csvFile}`);
  console.log(`========================================\n`);
}

// ── CLI ────────────────────────────────────────────────────────────
async function main() {
  const args = process.argv.slice(2);

  if (args.length === 0 || args.includes('--help')) {
    console.log(`
  RestauMargin — Restaurant Email Scraper
  ========================================

  Usage:
    npx tsx scripts/scrape-restaurants.ts <city> [--limit N]

  Examples:
    npx tsx scripts/scrape-restaurants.ts Paris
    npx tsx scripts/scrape-restaurants.ts Lyon --limit 200
    npx tsx scripts/scrape-restaurants.ts "Aix-en-Provence" --limit 50

  Options:
    --limit N    Maximum number of restaurants to scrape (default: 100)
    --help       Show this help message

  Output:
    CSV file saved to data/scraping/restaurants-<city>-<date>.csv
    `);
    process.exit(0);
  }

  const city = args[0];
  const limitIdx = args.indexOf('--limit');
  const limit = limitIdx !== -1 ? parseInt(args[limitIdx + 1], 10) || 100 : 100;

  await scrapeCity(city, limit);
}

main().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});
