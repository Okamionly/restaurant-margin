# QA — 2026-11-07

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

**H1 manquants** : aucun

## API

| Test | Attendu | Résultat |
|------|---------|---------|
| POST /api/auth/login (mauvais mdp) | 401 | ✅ 401 |
| GET /api/health?deep=1 database | ok | ✅ ok |
| GET /api/health?deep=1 ai | ok | ✅ ok (claude-sonnet-4-6) |

## CI (5 derniers runs sur main)

| Workflow | Conclusion | SHA | Titre |
|---------|-----------|-----|-------|
| Taches automatiques RestauMargin | success | b82dc73 | Taches automatiques RestauMargin |
| CI | success | b82dc73 | cfo: analyse quotidienne |
| Taches automatiques RestauMargin | success | 9579e97 | Taches automatiques RestauMargin |
| CI | success | 9579e97 | docs(seo): rapport quotidien 2026-11-07 |
| CI | success | 2f0f8ee | perf(seo): retire le chunk vendor-icons charge sur toutes les pages |

## Résumé

**Statut global : ✅ OK — aucune régression détectée**

- Pages OK : 15/15
- Prérendu H1 : 15/15
- Login 401 : ✅
- Santé base : ✅
- Santé IA : ✅
- Dernier CI : ✅ success
