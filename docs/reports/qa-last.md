# Rapport QA — 2026-11-13

## Pages HTTP — 15/15 OK

| Code | H1 | URL |
|------|----|-----|
| 200 | 1 | / |
| 200 | 1 | /pricing |
| 200 | 1 | /login |
| 200 | 1 | /demo |
| 200 | 1 | /a-propos |
| 200 | 1 | /blog |
| 200 | 1 | /blog/calcul-marge-restaurant |
| 200 | 1 | /outils/calculateur-food-cost |
| 200 | 1 | /outils/generateur-qr-menu |
| 200 | 1 | /station-produit |
| 200 | 1 | /mentions-legales |
| 200 | 1 | /cgv |
| 200 | 1 | /reactivation |
| 200 | 1 | /guide-marge/pizzeria |
| 200 | 1 | /guide-marge/brasserie |

**H1 manquants** : aucun

## API

| Test | Attendu | Résultat |
|------|---------|----------|
| POST /api/auth/login (mauvais mdp) | 401 | ✅ 401 |
| GET /api/health?deep=1 — database | ok | ✅ ok |
| GET /api/health?deep=1 — ai | ok | ✅ ok (claude-sonnet-4-6) |

## CI — GitHub Actions (branche main)

| Workflow | Conclusion | Commit | Titre |
|----------|-----------|--------|-------|
| Taches automatiques RestauMargin | success | 2c9ae20 | Taches automatiques RestauMargin |
| Taches automatiques RestauMargin | success | 2c9ae20 | Taches automatiques RestauMargin |
| Taches automatiques RestauMargin | success | 2c9ae20 | Taches automatiques RestauMargin |
| CI | success | 2c9ae20 | cfo: analyse quotidienne |
| Taches automatiques RestauMargin | success | 7fb5203 | Taches automatiques RestauMargin |

**CI rouge** : aucun

## Résumé

**Aucune régression détectée.** Tous les indicateurs sont verts.
