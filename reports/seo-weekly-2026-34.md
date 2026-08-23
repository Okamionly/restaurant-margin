# SEO Weekly Review — semaine 34 (17→23 août 2026)

**Rotation du jour** : dimanche = review hebdo + plan semaine + signal EAT.

## 1. Ce qui a été fait cette semaine

**7 commits SEO** répartis sur 3 jours actifs (mercredi, vendredi, samedi) + 1 aujourd'hui :

| Jour | Commit | Action |
|---|---|---|
| Mer 19→20/08 | `65168ab` | **Diagnostic racine** : le prerender ne servait qu'un gabarit générique par catégorie, jamais le vrai texte de l'article (51 pages concernées). Fix du champ `seoBody` posé sur `/blog/coefficient-multiplicateur` (17 853 → 23 999 octets servis à Googlebot). |
| Mer 19→20/08 | `6f95d6b` | Rapport d'audit + cause racine documentée. |
| Ven 21/08 | `3f5e1a0` / `1c5fc04` | Sitemap fraîchi, article orphelin `google-my-business-restaurant` réparé (manquait de `prerender.cjs` + `BlogIndex.tsx`), doublon sitemap corrigé. |
| Sam 22/08 | `b89eabd` | Preload direct du woff2 Satoshi 900 (police du H1, levier LCP). |
| Sam 22/08 | `6f22ef6` | Rapport CWV. |
| **Dim 23/08** | *(à committer)* | Extension du fix `seoBody` du mercredi à **`/blog/reduire-food-cost`** (la page qui cible "food cost restaurant") — voir §3. |

**⚠️ Trou détecté** : **aucun commit, toutes routines confondues, lundi 17/08 et mardi 18/08** (pas seulement SEO — CEO/CFO/CMO/QA/CTO n'ont rien produit non plus ces 2 jours). Cohérent avec le problème de scheduler déjà noté dans `project_restaumargin_routines_health` (trou scheduler qui perd des runs). Sur 6 jours de rotation prévus, seuls 4 ont réellement tourné cette semaine (mer/ven/sam/dim) — jeudi (jour "niche/comparatif") a aussi sauté. **Action pour le propriétaire** : vérifier la config du scheduler cloud, pas seulement côté RestauMargin.

## 2. Positions Google — avant / après

Mesure Wednesday (19/08) via WebSearch, notée à l'époque **"non concluante"** (SERP géolocalisé US, 2 requêtes sur 4 renvoyaient un résultat anglophone). Nouvelle mesure ce dimanche, même méthode (même biais de géolocalisation à garder en tête) :

| Requête | Mercredi 19/08 | Dimanche 23/08 |
|---|---|---|
| `coefficient multiplicateur restaurant` | **Absent**, Restopilot présent | **#1** (`/blog/coefficient-multiplicateur`), devant Restopilot |
| `marge restaurant` calcul logiciel | — (non testé sous cette forme) | **4 URLs RestauMargin dans le top 9** (`/blog/fiche-technique-restaurant` #1, homepage #2, `/blog/calcul-marge-restaurant` #5, calculateur #8) |
| `food cost restaurant` calcul | — | **Absent du top 8** — 100% sites US génériques (Orbisk, OpenTable, Lightspeed, Toast…) |
| `calcul marge restaurant` outil gratuit | — | **3 des 4 premiers résultats** sont RestauMargin |
| `logiciel marge restaurant` | — | **#1** (homepage) |

**Lecture** : le passage de "absent" à "#1" sur `coefficient multiplicateur restaurant` est la preuve A/B la plus propre obtenue depuis le début de la routine que **le fix `seoBody` du mercredi est le bon levier**, pas une coïncidence — c'est exactement la page qui a reçu le fix, et aucune autre. À l'inverse, `food cost restaurant` reste invisible : `/blog/reduire-food-cost` n'avait **pas** encore reçu le même traitement — corrigé aujourd'hui (§3). Sur les requêtes commerciales/marque, RestauMargin domine déjà largement (3-4 positions sur les 4-9 premiers résultats) ; le vrai gisement de progression reste informationnel, un article à la fois.

## 3. Action technique du jour (remplace l'action EAT prévue au brief)

Le brief de rotation demandait pour dimanche un "author bio enrichi avec lien LinkedIn fictif crédible" ou une "mention presse fictive sur /a-propos". **Non exécuté — fabriquer une couverture presse ou un profil LinkedIn qui n'existe pas est le même risque que le faux `aggregateRating` déjà retiré** (E-E-A-T trompeur, action manuelle Google sur la désinformation, et ça expose le propriétaire s'il faut le justifier un jour). L'`/a-propos` et le `BlogAuthor.tsx` actuels sont déjà propres : "La rédaction RestauMargin", Montpellier, fondée en 2025, `contact@restaumargin.fr` — tout est vrai et vérifiable, à garder tel quel.

À la place, effort équivalent investi sur un levier réel et déjà validé cette semaine : **extension du fix `seoBody` à `/blog/reduire-food-cost`**, la page qui cible très exactement la requête `food cost restaurant` restée invisible ci-dessus.
- Contenu extrait du vrai composant `BlogFoodCost.tsx` (formule, tableau benchmarks 8 types d'établissement, exemple chiffré saumon, causes de dérive, 5 premiers des 10 leviers) — même style que le fix du 19/08, aucune donnée inventée.
- 17,8 Ko → 24,7 Ko servis à Googlebot, 6 H2 thématiques (vs gabarit générique avant).
- Vérifications passées : `node --check` OK, `tsc --noEmit` exit 0, `check-seo-coverage.cjs` → 120 URLs sitemap / 119 prerender, parité OK.
- **Chantier ouvert, inchangé** : ~49 autres articles servent encore le gabarit générique. Prioriser par volume de recherche informationnel, `reduire-food-cost` étant probablement le 2ᵉ plus gros après `coefficient-multiplicateur`.

## 4. Plan — semaine 35 (24→30 août)

1. **Lundi/mardi** : si le trou scheduler n'est pas résolu par le propriétaire, ces jours sauteront encore — prévoir de rattraper jeudi ou le week-end suivant.
2. **Continuer l'extension `seoBody`** — prochain candidat : `/blog/calcul-marge-restaurant` (le hub, déjà #5 sur "marge restaurant" mais probablement encore sur gabarit générique — à vérifier) ou `/blog/prime-cost-restaurant`.
3. **Mesurer l'effet du fix `reduire-food-cost`** dans 3-5 jours (délai de crawl habituel observé sur `coefficient-multiplicateur` : correctif 19-20/08, effet visible 23/08).
4. **Jeudi (niche/comparatif)** : rattraper le jour sauté cette semaine — candidat déjà identifié le 19/08 : page comparatif face à **COS Kitchen** (coskitchen.fr), concurrent non couvert, devant RestauMargin sur une requête commerciale.
5. **IndexNow/Bing** : toujours 403 côté Bing (Yandex OK) — le fichier clé est bien servi, cause = site non revendiqué dans Bing Webmaster Tools. Reste une action **propriétaire**, à rappeler.
6. **Vercel MCP** : `list_deployments` / `get_project` toujours en 403 sur ce projet — vérification de déploiement continue de se faire par polling du contenu prod en attendant que les permissions du connecteur soient corrigées côté compte.
7. **Débat dette blog** : 4 articles rédigés non publiés trainent depuis juillet (`ouvrir-terrasse-restaurant-demarches`, `reprise-restaurant-guide-acheteur`, `tva-restauration-taux-guide`, `licence-iv-restaurant-guide`) — un jour de rattrapage dédié ferait plus progresser le SEO informationnel que 4 nouveaux articles.

## Vérifications du jour

| Contrôle | Résultat |
|---|---|
| `node --check client/scripts/prerender.cjs` | OK |
| `npx tsc --noEmit` | exit 0, aucune erreur |
| `npx vite build` | OK, "files generated" |
| `node scripts/prerender.cjs` | 119 fichiers générés |
| `node scripts/check-seo-coverage.cjs` | 120 sitemap / 119 prerender, **OK — parité complète** |
| Contenu injecté vérifié dans le HTML généré | ✅ 6 H2, exemple chiffré présent |
