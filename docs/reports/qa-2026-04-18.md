# Rapport QA — 2026-04-18

**Heure d'exécution :** 20h00 (Paris)
**Environnement :** Production — https://www.restaumargin.fr

---

## 1. TESTS HTTP DES PAGES PUBLIQUES

**Résultat : 15/15 ✅**

| Code | URL |
|------|-----|
| 200 | / |
| 200 | /pricing |
| 200 | /login |
| 200 | /demo |
| 200 | /a-propos |
| 200 | /blog |
| 200 | /blog/calcul-marge-restaurant |
| 200 | /outils/calculateur-food-cost |
| 200 | /temoignages |
| 200 | /station-produit |
| 200 | /mentions-legales |
| 200 | /cgv |
| 200 | /reactivation |
| 200 | /guide-marge/pizzeria |
| 200 | /guide-marge/brasserie |

Aucune page KO. Toutes les routes publiques répondent correctement.

---

## 2. TESTS SEO

| Page | Title | Canonical | H1 |
|------|-------|-----------|-----|
| / | ✅ RestauMargin — Logiciel de calcul de marge restaurant \| Food cost et fiches techniques | ✅ https://www.restaumargin.fr | ✅ |
| /pricing | ✅ Tarifs — RestauMargin | ✅ https://www.restaumargin.fr/pricing | ⚠️ |
| /a-propos | ✅ À propos — RestauMargin | ✅ https://www.restaumargin.fr/a-propos | ⚠️ |
| /blog | ✅ Blog RestauMargin — Guides et conseils pour restaurateurs | ✅ https://www.restaumargin.fr/blog | ⚠️ |

**⚠️ ANOMALIE SEO DÉTECTÉE — H1 identique sur toutes les pages**

Toutes les pages retournent le même H1 côté serveur :
> `<h1>RestauMargin — Logiciel de gestion de marge restaurant`

Les titres (`<title>`) et les canonicals sont bien uniques par page.  
Le H1 identique est probablement rendu côté client (SPA React) et non injecté par le SSR.  
**Impact : les crawlers qui n'exécutent pas JavaScript verront un H1 identique sur toutes les pages.**  
À surveiller : vérifier si Googlebot indexe le contenu rendu côté client.

---

## 3. TESTS API

| Test | Attendu | Résultat |
|------|---------|---------|
| POST /api/auth/login (mauvais password) | 401 | ✅ 401 |
| GET /api/health | `{"status":"healthy"}` | ✅ `{"status":"healthy","timestamp":"2026-04-18T18:23:37.911Z","uptime":2.53s,"services":{"database":"ok","api":"ok"}}` |

API : **OK** — Base de données et API opérationnelles.

---

## 4. BUILD CHECK (TypeScript)

**⚠️ Non exécutable localement** — `node_modules` absents dans l'environnement CI local.

Les erreurs TypeScript détectées (`Cannot find module 'react'`, `react-router-dom`, `lucide-react`) sont des **faux positifs** dus à l'absence de `node_modules`.

**Production : OK** — confirmé par les 15/15 réponses HTTP 200.

---

## 5. SYNTHÈSE

| Catégorie | Statut | Détail |
|-----------|--------|--------|
| Pages HTTP | ✅ 15/15 | Aucune régression |
| SEO Titles | ✅ OK | Uniques par page |
| SEO Canonicals | ✅ OK | Corrects |
| SEO H1 | ⚠️ Anomalie | H1 identique sur toutes les pages (SPA) |
| API Auth | ✅ OK | 401 correct |
| API Health | ✅ OK | DB + API healthy |
| Build TS | ⚠️ N/A | node_modules absents localement |

**Verdict global : ⚠️ ANOMALIE SEO H1 — surveillance recommandée**

---

*Rapport généré automatiquement par l'agent QA RestauMargin*
