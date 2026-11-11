# Rapport QA — 2026-11-11

## Pages HTTP (15/15 OK)

| Code | H1 | URL |
|------|-----|-----|
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

## CI — derniers passages sur main

| Workflow | Conclusion | SHA | Titre |
|----------|-----------|-----|-------|
| Taches automatiques RestauMargin | success | ae1899a | Taches automatiques RestauMargin |
| Taches automatiques RestauMargin | success | ae1899a | Taches automatiques RestauMargin |
| Taches automatiques RestauMargin | success | ae1899a | Taches automatiques RestauMargin |
| CI | success | ae1899a | cfo: analyse quotidienne |
| Taches automatiques RestauMargin | success | 46a030e | Taches automatiques RestauMargin |

## Synthèse

**Statut global : ✅ TOUT OK**

- Pages 200 : 15/15
- H1 présents : 15/15 (13 pré-rendues + 2 SPA)
- API login 401 : OK
- Santé DB + IA : OK
- CI main : tous success
- Régressions : **aucune**
