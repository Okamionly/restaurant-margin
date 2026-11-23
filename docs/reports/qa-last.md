# Rapport QA — 2026-11-23

**Heure** : 2026-11-23T19:24 UTC

## Pages HTTP (200 + H1)

| Page | HTTP | H1 |
|------|------|----|
| / | 200 | ✓ |
| /pricing | 200 | ✓ |
| /login | 200 | ✓ |
| /demo | 200 | ✓ |
| /a-propos | 200 | ✓ |
| /blog | 200 | ✓ |
| /blog/calcul-marge-restaurant | 200 | ✓ |
| /outils/calculateur-food-cost | 200 | ✓ |
| /outils/generateur-qr-menu | 200 | ✓ |
| /station-produit | 200 | ✓ |
| /mentions-legales | 200 | ✓ |
| /cgv | 200 | ✓ |
| /reactivation | 200 | ✓ |
| /guide-marge/pizzeria | 200 | ✓ |
| /guide-marge/brasserie | 200 | ✓ |

**Pages OK : 15/15 — H1 manquants : 0**

## API

| Test | Attendu | Résultat |
|------|---------|---------|
| POST /api/auth/login (mauvais credentials) | 401 | ✓ 401 |
| GET /api/health?deep=1 — database | ok | ✓ ok |
| GET /api/health?deep=1 — ai | ok | ✓ ok (claude-sonnet-4-6) |

## CI — Derniers passages sur main

| Workflow | Commit | Conclusion |
|----------|--------|------------|
| Taches automatiques RestauMargin | f61438a | ✅ success |
| CI | f61438a | ✅ success |
| Taches automatiques RestauMargin | fed7f1f | ✅ success |
| Taches automatiques RestauMargin | fed7f1f | ❌ failure (commit précédent, non bloquant) |
| CI | fed7f1f | ✅ success |

**Dernier commit f61438a : CI et tâches automatiques en success.**

## Résultat global

**TOUT OK** — Aucune régression détectée.
