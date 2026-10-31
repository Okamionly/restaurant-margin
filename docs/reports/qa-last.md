# Rapport QA — 2026-10-31

## Pages HTTP (15/15 OK)

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

**Pages OK : 15/15 — H1 manquants : 0**

## API

| Endpoint | Attendu | Obtenu | Statut |
|----------|---------|--------|--------|
| POST /api/auth/login (mauvaises credentials) | 401 | 401 | ✅ |
| GET /api/health?deep=1 — database | ok | ok | ✅ |
| GET /api/health?deep=1 — ai | ok | ok (claude-sonnet-4-6) | ✅ |

## CI (derniers runs sur main)

| Workflow | Conclusion | SHA | Titre |
|----------|-----------|-----|-------|
| Taches automatiques RestauMargin | success | 4da5091 | Taches automatiques RestauMargin |
| Taches automatiques RestauMargin | success | 4da5091 | Taches automatiques RestauMargin |
| CI | success | 4da5091 | cto: audit quotidien |
| Taches automatiques RestauMargin | success | 763e54b | Taches automatiques RestauMargin |
| Taches automatiques RestauMargin | success | 763e54b | Taches automatiques RestauMargin |

**Dernier commit CI : success ✅**

## Résumé

- Pages OK : **15/15**
- H1 manquants (prérendu) : **0**
- Login 401 : **✅**
- Santé DB : **ok**
- Santé IA : **ok**
- CI main : **success**

> Aucune régression détectée.
