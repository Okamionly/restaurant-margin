# Rapport QA — 2026-11-20

Généré le : 2026-11-20T19:24 UTC

## 1. Pages HTTP (15/15 OK)

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

**H1 manquants : aucun**

## 2. API

| Test | Attendu | Résultat |
|------|---------|----------|
| POST /api/auth/login (mauvais identifiants) | 401 | ✅ 401 |
| GET /api/health?deep=1 — database | "ok" | ✅ ok |
| GET /api/health?deep=1 — ai | "ok" | ✅ ok (claude-sonnet-4-6) |

## 3. CI (main)

| Workflow | Conclusion | SHA | Titre |
|----------|-----------|-----|-------|
| Taches automatiques RestauMargin | success | fa89f0b | Taches automatiques RestauMargin |
| Taches automatiques RestauMargin | success | fa89f0b | Taches automatiques RestauMargin |
| CI | success | fa89f0b | cfo: analyse quotidienne |
| Taches automatiques RestauMargin | success | fef5eb1 | Taches automatiques RestauMargin |
| Taches automatiques RestauMargin | success | fef5eb1 | Taches automatiques RestauMargin |

**CI : ✅ Aucune régression détectée**

## Résumé

- Pages OK : **15/15**
- H1 manquants : **0**
- API login 401 : **✅**
- Santé base + IA : **✅**
- CI main : **✅ success**

**Statut global : TOUT OK — Aucune notification envoyée**
