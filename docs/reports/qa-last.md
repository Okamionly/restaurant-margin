# Rapport QA — 2026-10-23

## Pages HTTP — 15/15 OK

| Code | H1 | URL |
|------|----|-----|
| 200  | 1  | / |
| 200  | 1  | /pricing |
| 200  | 1  | /login |
| 200  | 1  | /demo |
| 200  | 1  | /a-propos |
| 200  | 1  | /blog |
| 200  | 1  | /blog/calcul-marge-restaurant |
| 200  | 1  | /outils/calculateur-food-cost |
| 200  | 1  | /outils/generateur-qr-menu |
| 200  | 1  | /station-produit |
| 200  | 1  | /mentions-legales |
| 200  | 1  | /cgv |
| 200  | 1  | /reactivation |
| 200  | 1  | /guide-marge/pizzeria |
| 200  | 1  | /guide-marge/brasserie |

H1 manquants : **aucun**

## API

| Test | Résultat | Attendu | Statut |
|------|----------|---------|--------|
| POST /api/auth/login (mauvais identifiants) | 401 | 401 | ✅ OK |
| GET /api/health?deep=1 — database | ok | ok | ✅ OK |
| GET /api/health?deep=1 — ai | ok | ok | ✅ OK |

Réponse health complète :
```json
{"status":"ok","timestamp":"2026-10-23T18:24:33.482Z","uptime":3,"responseTime":"1266ms","services":{"database":"ok","ai":"ok","aiDetail":"claude-sonnet-4-6","api":"ok"}}
```

## CI — main

| Workflow | Conclusion | Commit | Titre |
|----------|------------|--------|-------|
| Taches automatiques RestauMargin | success | 47f3ce9 | Taches automatiques RestauMargin |
| Taches automatiques RestauMargin | success | 47f3ce9 | Taches automatiques RestauMargin |
| CI | success | 47f3ce9 | cfo: analyse quotidienne |
| Taches automatiques RestauMargin | success | f83fdc1 | Taches automatiques RestauMargin |
| Taches automatiques RestauMargin | success | f83fdc1 | Taches automatiques RestauMargin |

Dernier CI sur main : **success** ✅

## Résumé

- Pages OK : **15/15**
- H1 manquants : **0**
- Login 401 : **OK**
- Santé BDD : **OK**
- Santé IA : **OK**
- CI main : **success**

**Aucune régression détectée.**
