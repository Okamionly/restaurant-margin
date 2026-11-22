# Rapport QA — 2026-11-22

**Exécuté le** : 2026-11-22  
**Statut global** : ⚠️ RÉGRESSION DÉTECTÉE

---

## 1. Tests HTTP — Pages (15/15)

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

**Résultat** : ✅ 15/15 OK — tous les `<h1>` présents (pré-rendu OK)

---

## 2. Tests API

| Endpoint | Attendu | Obtenu | Statut |
|----------|---------|--------|--------|
| POST /api/auth/login (mauvaises credentials) | 401 | **500** | ❌ RÉGRESSION |
| GET /api/health?deep=1 — database | "ok" | "ok" | ✅ |
| GET /api/health?deep=1 — ai | "ok" | "ok" | ✅ |

**Détail health** : `{"status":"ok","database":"ok","ai":"ok","aiDetail":"claude-sonnet-4-6","api":"ok"}` — uptime 196s, responseTime 1234ms

---

## 3. CI — Derniers passages sur `main`

| Workflow | Conclusion | SHA | Titre |
|----------|-----------|-----|-------|
| Taches automatiques RestauMargin | success | f8c6804 | Taches automatiques RestauMargin |
| CI | success | f8c6804 | cfo: analyse quotidienne |
| Taches automatiques RestauMargin | success | fa7766e | Taches automatiques RestauMargin |
| CI | success | fa7766e | cto: audit quotidien |
| Taches automatiques RestauMargin | success | 5d3cdf0 | Taches automatiques RestauMargin |

**Résultat** : ✅ CI verte sur les 5 derniers commits

---

## Synthèse

- Pages OK : **15/15**
- H1 manquants : **0**
- API login : **❌ 500 au lieu de 401** — le endpoint `/api/auth/login` retourne une erreur serveur sur credentials invalides au lieu du 401 attendu
- Santé BDD/IA : ✅ OK
- CI : ✅ Verte
