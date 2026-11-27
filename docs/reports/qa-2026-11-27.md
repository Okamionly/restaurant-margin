# Rapport QA — 2026-11-27

## Résumé

**Pages OK : 15/15** | **API : OK** | **CI : OK** | **Régressions : 0**

---

## 1. Tests HTTP (15 pages)

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

Toutes les pages retournent 200. Toutes les 13 pages pré-rendues contiennent bien un `<h1>`.  
H1 manquants : **aucun**.

---

## 2. Tests API

| Endpoint | Attendu | Obtenu | Statut |
|----------|---------|--------|--------|
| POST /api/auth/login (mauvais identifiants) | 401 | 401 | ✓ |
| GET /api/health?deep=1 → database | ok | ok | ✓ |
| GET /api/health?deep=1 → ai | ok | ok (claude-sonnet-4-6) | ✓ |

Réponse complète health : `{"status":"ok","uptime":50,"responseTime":"1188ms","services":{"database":"ok","ai":"ok","aiDetail":"claude-sonnet-4-6","api":"ok"}}`

---

## 3. CI — derniers passages sur `main`

| Workflow | Conclusion | Commit | Titre |
|----------|-----------|--------|-------|
| Taches automatiques RestauMargin | success | 2edc994 | Taches automatiques RestauMargin |
| Taches automatiques RestauMargin | success | 2edc994 | Taches automatiques RestauMargin |
| CI | **success** | 2edc994 | cfo: analyse quotidienne |
| Taches automatiques RestauMargin | success | 018dbcf | Taches automatiques RestauMargin |
| Taches automatiques RestauMargin | success | 018dbcf | Taches automatiques RestauMargin |

Dernier CI sur `main` : **success** (commit `2edc994`).

---

## Conclusion

Aucune régression détectée. Pas de notification envoyée.
