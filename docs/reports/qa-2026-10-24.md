# Rapport QA — 2026-10-24

## Pages HTTP (200 + H1)

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

**Pages OK : 15/15 — H1 manquants : 0**

## API

| Test | Attendu | Obtenu | Statut |
|------|---------|--------|--------|
| POST /api/auth/login (mauvais identifiants) | 401 | 401 | ✅ |
| GET /api/health?deep=1 — database | ok | ok | ✅ |
| GET /api/health?deep=1 — ai | ok | ok (claude-sonnet-4-6) | ✅ |

## CI GitHub (branch main)

| Workflow | Conclusion | SHA | Titre |
|----------|-----------|-----|-------|
| Taches automatiques RestauMargin | success | dedca6e | Taches automatiques RestauMargin |
| Taches automatiques RestauMargin | success | dedca6e | Taches automatiques RestauMargin |
| CI | success | dedca6e | cfo: analyse quotidienne |
| Taches automatiques RestauMargin | success | 15a0f31 | Taches automatiques RestauMargin |
| CI | success | 15a0f31 | cto: audit quotidien |

**CI : ✅ Tous les runs sont en succès**

## Résumé

- Pages : **15/15 OK**, aucun H1 manquant
- API login : **401 ✅**
- Santé DB : **ok ✅**
- Santé IA : **ok ✅**
- CI main : **success ✅**

Aucune régression détectée.
