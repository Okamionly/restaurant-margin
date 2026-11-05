# QA RestauMargin — 2026-11-05

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

| Test | Résultat | Attendu | Statut |
|------|----------|---------|--------|
| POST /api/auth/login (mauvais mdp) | 401 | 401 | ✅ |
| GET /api/health?deep=1 → database | ok | ok | ✅ |
| GET /api/health?deep=1 → ai | ok | ok | ✅ |

Détail health : `{"status":"ok","uptime":3s,"responseTime":"1237ms","services":{"database":"ok","ai":"ok","aiDetail":"claude-sonnet-4-6","api":"ok"}}`

## CI GitHub (main)

| Workflow | Conclusion | SHA | Titre |
|---------|-----------|-----|-------|
| Taches automatiques RestauMargin | success | 1a71270 | Taches automatiques RestauMargin |
| Taches automatiques RestauMargin | success | 1a71270 | Taches automatiques RestauMargin |
| Taches automatiques RestauMargin | success | 1a71270 | Taches automatiques RestauMargin |
| CI | success | 1a71270 | cfo: analyse quotidienne 2026-11-05 |
| Taches automatiques RestauMargin | success | 25648e4 | Taches automatiques RestauMargin |

**CI** : vert sur le dernier commit `1a71270`

## Résumé

**Aucune régression.** Toutes les 15 pages répondent 200 avec un `<h1>`. Les 13 pages pré-rendues contiennent un H1. API login et health OK. CI verte.
