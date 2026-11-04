# Rapport QA — 2026-11-04

## Résumé

| Catégorie | Résultat |
|-----------|----------|
| Pages HTTP (200) | 15/15 |
| H1 manquants | 0 |
| API login (401) | ✅ |
| Santé API | ✅ |
| CI main | ✅ |

## 1. Tests HTTP

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

Toutes les pages prérendues contiennent un `<h1>`. Aucune régression de prérendu.

## 2. Tests API

- **POST /api/auth/login** (mauvais identifiants) → `401` ✅
- **GET /api/health?deep=1** → `database: ok`, `ai: ok` (claude-sonnet-4-6), `api: ok` ✅

## 3. CI — dernier passage sur main

| Workflow | Conclusion | Commit | Titre |
|----------|-----------|--------|-------|
| CI | success | cf6aec9 | fix: prix sans HT, parrainage sans -20 % fictif… |
| CI | success | a89d6ca | build(vercel): contrôle des accents… |
| CI | success | 62947d1 | fix(accueil): prix 19 EUR dans le HTML statique… |
| CI | success | d8c7c59 | fix(tarifs): offre unique 19 EUR/mois… |
| CI | success | cbc0133 | feat(contenu): garde-fou des accents… |

Dernier commit CI : **success** sur `cf6aec9`.

## Conclusion

Aucune régression détectée. Tout est opérationnel.
