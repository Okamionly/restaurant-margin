# Restaurant Email Scraper & Campaign Sender

Outils automatises pour collecter des emails de restaurants en France et envoyer des campagnes de prospection via Resend.

## Pre-requis

- Node.js 18+ (pour `fetch` natif)
- `tsx` installe globalement ou via npx
- Variable d'environnement `RESEND_API_KEY` (pour l'envoi uniquement)

## Scripts

### 1. Scraper general (`scrape-restaurants.ts`)

Recherche des restaurants via Google + PagesJaunes, extrait les infos et emails.

```bash
# Scraper les restaurants de Lyon (max 100)
npx tsx scripts/scrape-restaurants.ts Lyon

# Avec limite
npx tsx scripts/scrape-restaurants.ts Paris --limit 200

# Villes avec espaces
npx tsx scripts/scrape-restaurants.ts "Aix-en-Provence" --limit 50
```

**Sortie** : `data/scraping/restaurants-<ville>-<date>.csv`

### 2. Scraper PagesJaunes (`scrape-pagesjaunes.ts`)

Scraper dedie PagesJaunes avec extraction detaillee (JSON-LD, pages de detail).

```bash
# Scraper PagesJaunes pour Marseille (5 pages)
npx tsx scripts/scrape-pagesjaunes.ts Marseille

# 10 pages, uniquement les restaurants avec email
npx tsx scripts/scrape-pagesjaunes.ts Lyon --pages 10 --emails-only

# Bordeaux, toutes les pages disponibles
npx tsx scripts/scrape-pagesjaunes.ts Bordeaux --pages 20
```

**Sortie** :
- `data/scraping/pj-<ville>-<date>.csv`
- `data/scraping/pj-<ville>-<date>-summary.json`

### 3. Envoi de campagne (`send-campaign.ts`)

Envoie des emails personnalises via Resend API a partir d'un fichier CSV.

```bash
# Preview sans envoyer (DRY RUN)
npx tsx scripts/send-campaign.ts data/scraping/pj-lyon-2026-04-07.csv --dry-run

# Envoyer 10 emails de test
export RESEND_API_KEY=re_xxxxxxxxxxxxx
npx tsx scripts/send-campaign.ts data/scraping/pj-lyon-2026-04-07.csv --limit 10

# Envoyer a tous avec type de cuisine force
npx tsx scripts/send-campaign.ts contacts.csv --cuisine pizzeria
```

**Sortie** :
- `data/campaigns/campaign-results-<timestamp>.json`
- `data/campaigns/sent-log.json` (persistant entre les envois)

## Workflow recommande

```
1. Scraper une ville
   npx tsx scripts/scrape-pagesjaunes.ts Lyon --pages 5

2. Verifier les resultats
   - Ouvrir le CSV dans Excel/Numbers
   - Supprimer les doublons/faux positifs
   - Verifier les emails manuellement si besoin

3. Tester l'envoi (dry run)
   npx tsx scripts/send-campaign.ts data/scraping/pj-lyon-2026-04-07.csv --dry-run

4. Envoyer un petit lot de test
   npx tsx scripts/send-campaign.ts data/scraping/pj-lyon-2026-04-07.csv --limit 5

5. Envoyer le reste
   npx tsx scripts/send-campaign.ts data/scraping/pj-lyon-2026-04-07.csv
```

## Villes cibles (par ordre de priorite)

| Ville | Pop. | Restaurants estimes |
|-------|------|---------------------|
| Paris | 2.1M | 15,000+ |
| Lyon | 530k | 3,000+ |
| Marseille | 870k | 4,000+ |
| Toulouse | 500k | 2,500+ |
| Bordeaux | 260k | 2,000+ |
| Montpellier | 300k | 1,500+ |
| Nice | 340k | 2,000+ |
| Nantes | 320k | 1,500+ |
| Strasbourg | 290k | 1,200+ |
| Lille | 235k | 1,500+ |

## Format CSV

Les deux scrapers produisent des CSV compatibles avec le campaign sender :

```csv
name,phone,address,city,website,email,source,scrapedAt
Le Bistrot Lyonnais,04 78 12 34 56,15 rue de la Republique,Lyon,https://lebistrotlyonnais.fr,contact@lebistrotlyonnais.fr,pagesjaunes,2026-04-07T10:30:00Z
```

## Rate limiting

- **Scraping** : 1 requete toutes les 2 secondes (pour eviter le blocage)
- **Envoi** : 1 email par seconde + pause de 5s tous les 50 emails
- **Anti-doublon** : les emails deja envoyes sont suivis dans `sent-log.json`

## Securite et conformite

- Les emails sont collectes depuis des sources publiques (PagesJaunes, sites web)
- Chaque email contient un lien de desabonnement
- Les emails envoyes sont trackes pour eviter le spam
- Respecter le RGPD : base legale = interet legitime (prospection B2B)
