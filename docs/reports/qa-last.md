# Rapport QA — 2026-10-09

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

H1 manquants : **aucun**

## API

| Test | Attendu | Résultat |
|------|---------|----------|
| POST /api/auth/login (mauvaises credentials) | 401 | **401 ✓** |
| GET /api/health?deep=1 — database | "ok" | **ok ✓** |
| GET /api/health?deep=1 — ai | "ok" | **ok ✓** |

Modèle IA actif : `claude-sonnet-4-6`

## CI GitHub (main)

| Workflow | Conclusion | Commit | Titre |
|----------|-----------|--------|-------|
| Taches automatiques RestauMargin | success | ef88d04 | Taches automatiques RestauMargin |
| Taches automatiques RestauMargin | success | ef88d04 | Taches automatiques RestauMargin |
| Taches automatiques RestauMargin | success | ef88d04 | Taches automatiques RestauMargin |
| CI | **success** | ef88d04 | cfo: analyse quotidienne 2026-10-09 |
| Taches automatiques RestauMargin | success | df4ff73 | Taches automatiques RestauMargin |

Dernier CI sur main : **success** ✓

## Conclusion

**Aucune régression détectée.** Toutes les vérifications sont passées.
