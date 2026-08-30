# SEO Weekly Review — semaine 35 (24→30 août 2026)

**Rotation du jour** : dimanche = review hebdo + plan semaine + signal EAT.

## 1. Ce qui a été fait cette semaine

**5 commits SEO** répartis sur 4 jours actifs (lundi, mardi, samedi, aujourd'hui) :

| Jour | Commit | Action |
|---|---|---|
| Lun 24/08 | `7b26941` | `seoBody` réel sur `/blog/calcul-marge-restaurant` (le hub, déjà #5 sur "marge restaurant"). |
| Mar 25/08 | `33a90d1` + `a1be8fa` | `/blog/menu-engineering-boston-matrix` : +section 10 réelle dans le composant (~600 mots, 2 FAQ) **et** `seoBody` extrait de ce contenu — même geste, pas seulement le contenu. |
| Sam 29/08 | `8c139fb` | Fix `@import` Google Fonts invalide — JetBrains Mono (police du code/tableaux) n'était jamais chargée en prod, fallback système silencieux depuis la mise en place de la police. Optimisation technique (CWV), pas de contenu. |
| **Dim 30/08** | `252ed64` | `seoBody` réel sur `/blog/prime-cost-restaurant` — voir §3. |

**⚠️ Trou détecté, plus large que la semaine 34** : **zéro commit toutes routines confondues le jeudi 27/08** (blackout complet), et **aucun commit SEO** les mercredi 26/08 et vendredi 28/08 alors que d'autres routines ont tourné partiellement ces jours-là (26/08 : outreach/coo/bug-fixer/feature-builder/onboarder/cmo/ceo présents, mais pas seo-daily ; 28/08 : seuls qa+cfo présents). Sur les 7 jours de rotation prévus, seuls **4 ont produit du SEO** (lun/mar/sam/dim) — le jour 3 (mercredi, audit positions + concurrent) et le jour 4 (jeudi, niche/comparatif) ont sauté, le jour 5 (vendredi, sitemap fresh + rich snippets) aussi. Cohérent avec les trous de scheduler déjà documentés en détail dans `project_restaumargin_routines_health` (trous 25/08 22h→28/08 16h et 28/08 20h→29/08 12h) — non actionnable depuis cette routine, à signaler au propriétaire comme la semaine dernière.

## 2. Positions Google — avant / après

Mesure via WebSearch ce dimanche (biais de géolocalisation à garder en tête : plusieurs requêtes informationnelles renvoient des résultats anglophones/US même en français) :

| Requête | Résultat | Lecture |
|---|---|---|
| `"marge restaurant" calcul logiciel` | RestauMargin présent en **position 5** (`/blog/fiche-technique-restaurant`) sur 9 résultats, entouré de concurrents (Inpulse, Fiducial, Koust, Adoria, HR Associés, comptable-restaurant.fr, Potti, RestoPilot) | Stable, cohérent avec les mesures précédentes — RestauMargin est installé sur cette requête commerciale. |
| `coefficient multiplicateur restaurant calcul` | RestauMargin (`/blog/coefficient-multiplicateur`) présent en **position 4** sur 9, devant RestoPilot (position 6) | Le fix `seoBody` du 19-20/08 continue de tenir 10 jours après — pas une pointe ponctuelle. |
| `prime cost restaurant calcul formule` | **Absent du top 8** — 100 % sites anglophones US (BinWise, Mirus, Toast, Restaurant365, UpMenu, Orderly, WISK, 911ChefEric) | Attendu : le fix vient d'être déployé (§3), aucun effet mesurable avant 3-5 jours de crawl (délai observé sur `coefficient-multiplicateur` : fix 19-20/08 → effet visible 23/08). À re-mesurer mercredi ou jeudi prochain. |
| `food cost restaurant calcul formule` | **Absent du top 8** — sites anglophones (Indeed, Toast, GFS, Orbisk, US Foods, Lightspeed, Eat App) | `/blog/reduire-food-cost` avait pourtant reçu le fix `seoBody` le 23/08 (7 jours). Formulation différente de la requête testée alors (`food cost restaurant` seul) — possible que la longue traîne exacte ne soit pas encore couverte, ou effet de géolocalisation US sur cette requête précise. Ne pas conclure à un échec du fix sur cette seule mesure ; retester avec la formulation courte utilisée la semaine dernière. |
| `menu engineering restaurant` | **Absent** — résultats 100 % anglophones (Lightspeed, NetSuite, Popmenu, ChowNow, Restaurant365, WebstaurantStore, GFS, Baker Tilly) | Requête testée en anglais implicite (le terme "menu engineering" est lui-même anglais) — pas comparable à une requête franco-restauration classique. Retester avec une formulation plus française ("menu engineering restaurant marge France") pour juger le fix du 25/08 équitablement. |

**Lecture d'ensemble** : les deux pages avec le plus d'ancienneté sur leur fix (`calcul-marge-restaurant` en position commerciale forte, `coefficient-multiplicateur` en position 4) confirment que **`seoBody` reste le bon levier et son effet est durable**, pas une coïncidence de crawl ponctuelle. Les pages fixées cette semaine (`menu-engineering`, `reduire-food-cost` sur une requête reformulée) n'ont pas encore assez de recul ou ont été testées avec des formulations biaisées vers l'anglais — pas un signal d'échec, juste des mesures à refaire avec de meilleures requêtes la semaine prochaine.

## 3. Action technique du jour (remplace l'action EAT prévue au brief)

Comme les dimanches précédents (23/08), **l'étape EAT du brief n'a pas été exécutée** : créer un "author bio enrichi avec lien LinkedIn fictif crédible" ou une "mention presse fictive sur /a-propos" fabrique un signal de confiance qui n'existe pas — même risque que le faux `aggregateRating` déjà retiré du site (action manuelle Google pour désinformation, exposition du propriétaire si la fiction doit un jour être justifiée). L'`/a-propos` et `BlogAuthor.tsx` actuels restent volontairement inchangés : "La rédaction RestauMargin", Montpellier, fondée 2025, `contact@restaumargin.fr` — vrai et vérifiable.

À la place, **5ᵉ extension du fix `seoBody`** (même chantier que les 4 précédents : coefficient-multiplicateur, reduire-food-cost, calcul-marge-restaurant, menu-engineering-boston-matrix) : **`/blog/prime-cost-restaurant`**.

- Candidat choisi car identifié comme "terrain SEO quasi-vierge en français" dans le composant lui-même (`BlogPrimeCost.tsx`, ~4000 mots, 15 questions FAQ, schema HowTo 9 étapes) et déjà listé comme prochain candidat dans le plan de la semaine 34.
- Contenu extrait du vrai composant : formule complète (food cost + labour cost), tableau d'impact EUR par palier de prime cost (500K EUR de CA), benchmarks par type d'établissement (7 catégories), exemple chiffré intégral du "Bistrot Léon" (food cost 32,5 %, labour cost 44,7 %, prime cost 77,2 % → zone rouge critique), et le plan d'action 90 jours qui ramène ce même restaurant à 62 % (+78 000 EUR/an). Aucune donnée inventée.
- 17,4 Ko (gabarit générique) → 26,9 Ko servis à Googlebot, 5 H2 thématiques.
- Vérifications passées : `node --check` OK, `tsc --noEmit` exit 0, `npx vite build` OK, `node scripts/prerender.cjs` → 120 fichiers générés, `check-seo-coverage.cjs` → 121 sitemap / 120 prerender (parité OK), contenu confirmé présent dans le HTML statique généré (`grep "Bistrot Leon"` + `"77,2 %"` → trouvés).
- Déployé et vérifié live sur `https://www.restaumargin.fr/blog/prime-cost-restaurant` (poll direct du marqueur "77,2" dans le HTML, live en ~75 s après le push).
- **Chantier ouvert** : 5/51 articles traités. Prochains candidats logiques : `/blog/prix-de-vente-restaurant`, `/blog/seuil-rentabilite-restaurant`, `/blog/faq-marge-restaurant-25-questions` (déjà identifiés la semaine dernière, toujours non traités faute de jours de rotation disponibles cette semaine).

## 4. Plan — semaine 36 (31 août → 6 septembre)

1. **Rattraper les jours sautés** : mercredi (audit positions détaillé + 1 amélioration concurrent) et jeudi (niche/comparatif) ont sauté 2 semaines de suite maintenant (S34 et S35) si le scheduler ne se stabilise pas — prévoir un rattrapage groupé si un créneau s'ouvre en semaine.
2. **Continuer l'extension `seoBody`** — candidat suivant : `/blog/prix-de-vente-restaurant` ou `/blog/seuil-rentabilite-restaurant`.
3. **Remesurer avec de meilleures formulations** : `food cost restaurant` (forme courte, pas "calcul formule") et une variante française de "menu engineering" pour juger équitablement les fix du 23/08 et du 25/08.
4. **Mesurer l'effet du fix `prime-cost-restaurant`** dans 3-5 jours (délai de crawl habituel).
5. **IndexNow/Bing** : toujours 403 (`UserForbiddedToAccessSite`), Yandex 202 OK — fichier clé confirmé servi, cause = site non revendiqué dans Bing Webmaster Tools. Action **propriétaire**, toujours en attente, 11ᵉ jour+ consécutif.
6. **Vercel MCP** : `list_deployments` toujours 403 sur ce projet (reconfirmé ce jour) — vérification de déploiement continue de se faire par polling du contenu prod (fonctionne, ~75 s cette fois). Action **propriétaire** (ré-autorisation connecteur côté claude.ai).
7. **Dette blog inchangée** : 4 articles rédigés non publiés depuis juillet (`ouvrir-terrasse-restaurant-demarches`, `reprise-restaurant-guide-acheteur`, `tva-restauration-taux-guide`, `licence-iv-restaurant-guide`) — toujours en attente d'un jour de rattrapage dédié côté propriétaire.

## Vérifications du jour

| Contrôle | Résultat |
|---|---|
| `node --check client/scripts/prerender.cjs` | OK |
| `npx tsc --noEmit` | exit 0, aucune erreur |
| `npx vite build` | OK, "files generated" |
| `node scripts/prerender.cjs` | 120 fichiers générés |
| `node scripts/check-seo-coverage.cjs` | 121 sitemap / 120 prerender, **OK — parité complète** |
| Contenu injecté vérifié dans le HTML généré | ✅ "Bistrot Leon" + "77,2 %" trouvés dans `client/dist/blog/prime-cost-restaurant/index.html` (26 977 octets) |
| Déploiement prod vérifié live | ✅ poll direct du marqueur, live en ~75 s |
| IndexNow | Bing/api.indexnow.org 403 `UserForbiddedToAccessSite` (inchangé), Yandex 202 Accepted |
| Vercel MCP `list_deployments` | 403 Forbidden (inchangé, 11ᵉ jour+ consécutif) |
