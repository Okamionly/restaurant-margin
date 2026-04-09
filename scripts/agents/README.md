# RestauMargin — Automated Agent System

Systeme d'agents automatises pour la surveillance, la prospection et la maintenance de RestauMargin.

## Agents

| Agent | Fichier | Frequence | Description |
|-------|---------|-----------|-------------|
| **Sentry Monitor** | `sentry-monitor.ts` | Toutes les 30 min | Detecte les bugs via Sentry API, categorise (frontend/backend/network), alerte par email si critique |
| **Lead Finder** | `lead-finder.ts` | Quotidien 8h | Recherche de nouveaux restaurants via Exa API dans 5 villes FR, deduplique avec les contacts existants |
| **Market Intelligence** | `market-intelligence.ts` | Quotidien 7h | Veille marche via Tavily (prix matieres premieres, tendances restauration, food cost) |
| **Email Sequence** | `email-sequence.ts` | Quotidien 10h | Gere la sequence J+0/J+3/J+7/J+14 automatiquement, envoie les relances via Resend |
| **Health Check** | `health-check.ts` | Toutes les 15 min | Verifie API health, temps de reponse, Vercel, Supabase. Alerte si panne |
| **Runner** | `runner.ts` | Orchestrateur | CLI pour lancer les agents individuellement ou tous ensemble |

## Commandes

### Lancer un agent specifique

```bash
npx tsx scripts/agents/runner.ts --agent sentry-monitor
npx tsx scripts/agents/runner.ts --agent lead-finder
npx tsx scripts/agents/runner.ts --agent market-intelligence
npx tsx scripts/agents/runner.ts --agent email-sequence
npx tsx scripts/agents/runner.ts --agent health-check
```

### Lancer tous les agents

```bash
npx tsx scripts/agents/runner.ts --all
```

### Voir le statut

```bash
npx tsx scripts/agents/runner.ts --status
```

### Voir les schedules

```bash
npx tsx scripts/agents/runner.ts --schedule
```

### Lancer un agent directement (sans le runner)

```bash
npx tsx scripts/agents/sentry-monitor.ts
npx tsx scripts/agents/lead-finder.ts
npx tsx scripts/agents/market-intelligence.ts
npx tsx scripts/agents/email-sequence.ts
npx tsx scripts/agents/email-sequence.ts --dry-run
npx tsx scripts/agents/health-check.ts
```

## Variables d'environnement

| Variable | Agent | Description |
|----------|-------|-------------|
| `SENTRY_AUTH_TOKEN` | sentry-monitor | Token Bearer pour l'API Sentry |
| `VERCEL_TOKEN` | health-check | Token API Vercel (optionnel) |
| `VERCEL_PROJECT_ID` | health-check | ID du projet Vercel (optionnel) |
| `SUPABASE_URL` | health-check | URL Supabase (optionnel, utilise VITE_SUPABASE_URL en fallback) |
| `SUPABASE_ANON_KEY` | health-check | Cle anonyme Supabase (optionnel) |

Les cles API Resend, Exa et Tavily sont configurees directement dans les scripts.

## Fichiers de sortie

Tous les rapports sont sauvegardes dans `data/agents/` :

```
data/agents/
  sentry-report-2026-04-09.json      # Rapport Sentry du jour
  lead-finder-2026-04-09.json        # Leads trouves du jour
  market-intel-2026-04-09.json       # Veille marche du jour
  sequence-2026-04-09.json           # Actions sequence email du jour
  health-2026-04-09.json             # Checks sante du jour (array, 1 entree par check)
  runner-log.json                    # Journal de tous les runs
```

Les leads CSV sont sauvegardes dans `docs/campaigns/exa-leads-{date}.csv`.

## Cron Expressions (pour CI/CD ou crontab)

```cron
# Health Check - toutes les 15 minutes
*/15 * * * * cd /path/to/restaurant-margin && npx tsx scripts/agents/runner.ts --agent health-check

# Sentry Monitor - toutes les 30 minutes
*/30 * * * * cd /path/to/restaurant-margin && npx tsx scripts/agents/runner.ts --agent sentry-monitor

# Market Intelligence - quotidien a 7h
0 7 * * * cd /path/to/restaurant-margin && npx tsx scripts/agents/runner.ts --agent market-intelligence

# Lead Finder - quotidien a 8h
0 8 * * * cd /path/to/restaurant-margin && npx tsx scripts/agents/runner.ts --agent lead-finder

# Email Sequence - quotidien a 10h
0 10 * * * cd /path/to/restaurant-margin && npx tsx scripts/agents/runner.ts --agent email-sequence
```

## Architecture

```
scripts/agents/
  sentry-monitor.ts       # Standalone — exports runSentryMonitor()
  lead-finder.ts          # Standalone — exports runLeadFinder()
  market-intelligence.ts  # Standalone — exports runMarketIntelligence()
  email-sequence.ts       # Standalone — exports runEmailSequence()
  health-check.ts         # Standalone — exports runHealthCheck()
  runner.ts               # Orchestrateur CLI
  README.md               # Ce fichier
```

Chaque agent est **standalone** (executable individuellement) et **orchestrable** via le runner.
Chaque agent exporte sa fonction `main()` pour usage programmatique.

## Rate Limiting

- **Resend** (emails) : 1 email / 1.2 secondes
- **Exa** (recherche) : 200ms entre chaque requete
- **Tavily** (recherche) : 500ms entre chaque requete
- **Sentry** (API) : pas de limite specifique
- **Health checks** : pas de limite (requetes legeres)
