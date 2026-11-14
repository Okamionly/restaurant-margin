# Rapport QA — 2026-11-14

## Pages HTTP : 15/15 OK

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

Aucun H1 manquant. Prérendu OK.

## API

| Test | Résultat | Attendu |
|------|----------|---------|
| POST /api/auth/login (mauvais identifiants) | 401 | 401 ✓ |
| GET /api/health?deep=1 — database | ok | ok ✓ |
| GET /api/health?deep=1 — ai | ok (claude-sonnet-4-6) | ok ✓ |

## CI — derniers passages sur main

| Workflow | Conclusion | Commit | Titre |
|----------|------------|--------|-------|
| CI | success | afcc823 | cfo: analyse quotidienne |
| Taches automatiques RestauMargin | success | afcc823 | Taches automatiques RestauMargin |
| Taches automatiques RestauMargin | success | afcc823 | Taches automatiques RestauMargin |
| Taches automatiques RestauMargin | failure | 68d4346 | Taches automatiques RestauMargin |
| Taches automatiques RestauMargin | success | 68d4346 | Taches automatiques RestauMargin |

CI vert sur le dernier commit (afcc823). Le `failure` sur 68d4346 est antérieur.

## Conclusion

**Aucune régression détectée.** Tout est nominal.
