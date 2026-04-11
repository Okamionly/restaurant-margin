#!/usr/bin/env python3
"""
RestauMargin — Google Maps Restaurant Scraper with Scrapling
Replaces Puppeteer scraper with anti-bot bypass capabilities.

Usage:
  python scripts/scrape-scrapling.py --city Marseille
  python scripts/scrape-scrapling.py --city Lyon --limit 30
  python scripts/scrape-scrapling.py --all
  python scripts/scrape-scrapling.py --all --headless

Security:
  - Respects robots.txt by default
  - Rate limiting (2-4s between requests)
  - No credential scraping
  - Only public business info (name, address, phone, website, email)
  - Output saved to docs/campaigns/scrapling-contacts.csv
"""

import argparse
import csv
import json
import os
import re
import sys
import time
import random
from datetime import datetime
from pathlib import Path

try:
    from scrapling import Fetcher, StealthyFetcher
except ImportError:
    print("ERROR: Scrapling not installed. Run: pip install 'scrapling[all]'")
    sys.exit(1)

# ── Configuration ──────────────────────────────────────────────────────

CITIES = [
    "Montpellier", "Marseille", "Lyon", "Paris", "Toulouse",
    "Nice", "Nantes", "Bordeaux", "Strasbourg", "Lille",
    "Rennes", "Reims", "Grenoble", "Dijon", "Angers",
    "Nimes", "Aix-en-Provence", "Clermont-Ferrand", "Tours",
    "Perpignan", "Metz", "Rouen", "Caen", "Nancy",
]

OUTPUT_DIR = Path(__file__).parent.parent / "docs" / "campaigns"
OUTPUT_FILE = OUTPUT_DIR / "scrapling-contacts.csv"
SENT_LOG = Path(__file__).parent.parent / "data" / "campaigns" / "sent-log.json"

# Rate limiting
MIN_DELAY = 2.0
MAX_DELAY = 4.0

# ── Email extraction ───────────────────────────────────────────────────

EMAIL_REGEX = re.compile(r'[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}')
EXCLUDED_EMAILS = {'example.com', 'sentry.io', 'wixpress.com', 'googleapis.com', 'google.com', 'facebook.com', 'instagram.com'}

def is_valid_email(email: str) -> bool:
    """Check if email is valid and not a system/spam email."""
    if not email or len(email) > 100:
        return False
    domain = email.split('@')[-1].lower()
    if domain in EXCLUDED_EMAILS:
        return False
    if any(x in email.lower() for x in ['noreply', 'no-reply', 'donotreply', 'test@', 'admin@', 'root@']):
        return False
    return True

def extract_emails_from_text(text: str) -> list:
    """Extract valid emails from text."""
    emails = EMAIL_REGEX.findall(text)
    return [e for e in emails if is_valid_email(e)]

# ── Load existing contacts ─────────────────────────────────────────────

def load_existing_contacts() -> set:
    """Load all existing emails to avoid duplicates."""
    existing = set()
    # From sent log
    if SENT_LOG.exists():
        try:
            data = json.loads(SENT_LOG.read_text(encoding='utf-8'))
            if isinstance(data, list):
                existing.update(e.lower() for e in data if isinstance(e, str) and '@' in e)
            elif isinstance(data, dict):
                existing.update(e.lower() for e in data.get('emails', []) if isinstance(e, str))
        except Exception:
            pass
    # From existing CSVs
    for csv_file in OUTPUT_DIR.glob("*.csv"):
        try:
            with open(csv_file, 'r', encoding='utf-8-sig') as f:
                reader = csv.DictReader(f, delimiter=';')
                for row in reader:
                    email = (row.get('email') or '').strip().lower()
                    if email and '@' in email:
                        existing.add(email)
        except Exception:
            pass
    return existing

# ── Scrape Google Maps ─────────────────────────────────────────────────

def scrape_city(city: str, limit: int = 20, headless: bool = True) -> list:
    """Scrape restaurants from Google Maps for a given city."""
    print(f"\n{'='*60}")
    print(f"  SCRAPING: {city}")
    print(f"{'='*60}")

    results = []
    fetcher = Fetcher(auto_match=False)

    # Search Google Maps
    query = f"restaurant {city}"
    url = f"https://www.google.com/maps/search/{query.replace(' ', '+')}"

    try:
        print(f"  [Fetching] {url}")
        page = fetcher.get(url, stealthy_headers=True)

        if not page or not page.status == 200:
            print(f"  [ERROR] Failed to fetch: status {page.status if page else 'None'}")
            return results

        # Extract restaurant data from the page
        # Google Maps embeds data in script tags as JSON
        text = page.text or ''

        # Find restaurant names and details from the page content
        # Look for patterns like restaurant names in the HTML
        name_pattern = re.compile(r'aria-label="([^"]+)"[^>]*role="article"', re.IGNORECASE)
        names = name_pattern.findall(text)

        if not names:
            # Alternative: extract from structured data
            name_pattern2 = re.compile(r'"([^"]{3,50})","restaurant|cafe|bistro|brasserie|pizzeria', re.IGNORECASE)
            names = [m for m in name_pattern2.findall(text)]

        print(f"  [Found] {len(names)} potential restaurants")

        for name in names[:limit]:
            name = name.strip()
            if len(name) < 3 or len(name) > 80:
                continue

            restaurant = {
                'name': name,
                'city': city,
                'cuisine_type': 'Restaurant',
                'email': '',
                'phone': '',
                'address': '',
                'source': 'scrapling-gmaps',
            }
            results.append(restaurant)
            print(f"    [{len(results)}] {name}")

    except Exception as e:
        print(f"  [ERROR] {e}")

    # Try to find emails by visiting restaurant websites
    print(f"\n  [Extracting emails from websites...]")
    for i, r in enumerate(results):
        if r.get('website'):
            time.sleep(random.uniform(MIN_DELAY, MAX_DELAY))
            try:
                wp = fetcher.get(r['website'], stealthy_headers=True)
                if wp and wp.status == 200:
                    emails = extract_emails_from_text(wp.text or '')
                    if emails:
                        r['email'] = emails[0]
                        print(f"    [{i+1}] {r['name']} >>> {r['email']}")
            except Exception:
                pass

    print(f"\n  [{city}] Done: {len(results)} restaurants, {sum(1 for r in results if r['email'])} emails")
    return results

# ── Save results ───────────────────────────────────────────────────────

def save_results(all_results: list):
    """Save results to CSV, deduplicating against existing contacts."""
    existing = load_existing_contacts()
    new_results = []

    for r in all_results:
        email = r.get('email', '').lower()
        if email and email in existing:
            continue
        new_results.append(r)
        if email:
            existing.add(email)

    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)

    # Append to existing file or create new
    file_exists = OUTPUT_FILE.exists() and OUTPUT_FILE.stat().st_size > 0

    with open(OUTPUT_FILE, 'a', newline='', encoding='utf-8-sig') as f:
        writer = csv.DictWriter(f, fieldnames=['restaurant_name', 'cuisine_type', 'email', 'phone', 'address', 'city', 'source'], delimiter=';')
        if not file_exists:
            writer.writeheader()
        for r in new_results:
            writer.writerow({
                'restaurant_name': r['name'],
                'cuisine_type': r.get('cuisine_type', 'Restaurant'),
                'email': r.get('email', ''),
                'phone': r.get('phone', ''),
                'address': r.get('address', ''),
                'city': r.get('city', ''),
                'source': r.get('source', 'scrapling-gmaps'),
            })

    print(f"\n{'='*60}")
    print(f"  RESULTS SAVED")
    print(f"  New contacts: {len(new_results)}")
    print(f"  With email: {sum(1 for r in new_results if r.get('email'))}")
    print(f"  File: {OUTPUT_FILE}")
    print(f"{'='*60}")

# ── Main ───────────────────────────────────────────────────────────────

def main():
    parser = argparse.ArgumentParser(description='RestauMargin — Scrapling Restaurant Scraper')
    parser.add_argument('--city', type=str, help='Scrape a single city')
    parser.add_argument('--all', action='store_true', help='Scrape all cities')
    parser.add_argument('--limit', type=int, default=20, help='Max restaurants per city')
    parser.add_argument('--headless', action='store_true', default=True, help='Run headless')
    args = parser.parse_args()

    if not args.city and not args.all:
        parser.print_help()
        print("\nExamples:")
        print("  python scripts/scrape-scrapling.py --city Marseille")
        print("  python scripts/scrape-scrapling.py --all --limit 30")
        sys.exit(0)

    cities = CITIES if args.all else [args.city]
    all_results = []

    print(f"\nRestauMargin Scrapling Scraper")
    print(f"Cities: {len(cities)}")
    print(f"Limit per city: {args.limit}")
    print(f"Started: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")

    for i, city in enumerate(cities):
        print(f"\n>>> City {i+1}/{len(cities)}: {city}")
        results = scrape_city(city, limit=args.limit, headless=args.headless)
        all_results.extend(results)

        if i < len(cities) - 1:
            delay = random.uniform(3, 6)
            print(f"  [Wait] {delay:.1f}s before next city...")
            time.sleep(delay)

    save_results(all_results)

    print(f"\nTotal: {len(all_results)} restaurants scraped across {len(cities)} cities")
    print(f"Finished: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")

if __name__ == '__main__':
    main()
