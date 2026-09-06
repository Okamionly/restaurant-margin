# SEO Weekly Review — semaine 36 (31 août → 6 septembre 2026)

**Rotation du jour** : dimanche = review hebdo + plan semaine + signal EAT.

## 1. Ce qui a été fait cette semaine

**4 commits SEO** sur 6 jours de rotation prévus — 1 jour manqué :

| Jour | Commit | Action |
|---|---|---|
| Lun 31/08 | — | **Aucun commit SEO ce jour** — rotation "nouvel article PAA" sautée (seuls qa/cfo/cto présents ce jour d'après le log). |
| Mar 01/09 | — | **Aucun commit SEO ce jour non plus** — rotation "boost article existant" sautée (seul `qa: tests quotidiens 2026-09-01` présent). |
| Mer 02/09 | `18d5798` | `seo(audit)` — rapport positions + FAQ statique dupliquée dans le `seoBody` du hub `/blog/calcul-marge-restaurant` (8 Q/R, +27 % de mots servis au premier crawl). |
| Jeu 03/09 | `573b80a` | `seo(comparatif)` — nouvelle page `/alternative-cos-kitchen`, concurrent identifié le 19/08, jamais couvert jusque-là. |
| Ven 04/09 | `bd6af33` | `seo(freshness)` — sitemap update + audit rich snippets. |
| Sam 05/09 | `7ad2d97` | `perf(seo)` — cache-control 24h sur `kit-station.jpg` (était `max-age=0` à chaque visite). |
| **Dim 06/09** | `0cfce50` | Voir §3 — `seoBody` sur `/blog/prix-de-vente-restaurant` + fix parité prerender pour `no-show-restaurant-solutions`. |

**Trou détecté** : lundi et mardi (jours 1 et 2 de la rotation) n'ont produit aucun commit SEO cette semaine, alors que les jours 3 à 6 ont bien tourné. Différent des semaines 34/35 où le trou touchait plutôt mercredi/jeudi/vendredi — cohérent avec le fait que les trous de scheduler documentés dans `project_restaumargin_routines_health` sont irréguliers, pas cantonnés à un jour fixe. Non actionnable depuis cette routine ; à signaler au propriétaire.

## 2. Positions Google — avant / après

Mesuré via WebSearch ce dimanche, requêtes sans le nom de marque pour ne pas biaiser le résultat :

| Requête | Résultat | Comparaison vs dimanche dernier (30/08) |
|---|---|---|
| `marge restaurant calcul logiciel` | RestauMargin présent en **position 5/9** (`/blog/fiche-technique-restaurant`) | **Stable** (position 5 la semaine dernière aussi). |
| `coefficient multiplicateur restaurant calcul` | RestauMargin présent en **position 4/9** (`/blog/coefficient-multiplicateur`) | **Stable** — le fix `seoBody` du 19-20/08 continue de tenir 17 jours après. |
| `prime cost restaurant calcul formule` | **Toujours absent du top 8** — 100 % résultats anglophones (BinWise, Toast, Restaurant365, Orderly, WISK) | **Inchangé** depuis le déploiement du fix le 30/08 (7 jours). Le délai habituel de 3-5 jours observé sur `coefficient-multiplicateur` est dépassé — soit la requête reste structurellement biaisée anglophone (comme `menu engineering`), soit l'effet met plus longtemps sur cette formulation précise. À remesurer une dernière fois mercredi avant de conclure à un échec du fix sur cette requête. |

**Lecture** : les deux positions les plus anciennes (`coefficient-multiplicateur`, `fiche-technique-restaurant`) restent stables — confirme que les gains sont durables, pas du bruit de mesure. `prime-cost-restaurant` reste la seule zone d'incertitude ; pas assez de signal pour juger le fix sur cette requête précise après 7 jours.

## 3. Action du jour (remplace l'action EAT prévue au brief)

Comme chaque dimanche depuis le 23/08, **l'étape EAT du brief n'a pas été exécutée** : fabriquer un "author bio enrichi avec lien LinkedIn fictif crédible" ou une "mention presse fictive sur /a-propos" crée un signal de confiance qui n'existe pas — même risque que le faux `aggregateRating` déjà retiré (action manuelle Google pour désinformation, exposition du propriétaire si la fiction doit un jour être justifiée). `/a-propos` et `BlogAuthor.tsx` restent inchangés et vrais : "La rédaction RestauMargin", Montpellier, fondée 2025, `contact@restaumargin.fr`.

À la place, deux actions réelles :

1. **6ᵉ extension du fix `seoBody`** (même chantier que coefficient-multiplicateur, reduire-food-cost, calcul-marge-restaurant, menu-engineering-boston-matrix, prime-cost-restaurant) : **`/blog/prix-de-vente-restaurant`**. Candidat choisi parce que "prix de vente plat" est explicitement cité dans l'audit du 07/07 comme requête informationnelle absente du top 10 malgré une page dédiée (3300 mots, composant `BlogPrixDeVente.tsx`). Contenu injecté extrait tel quel du composant : formule (coefficient + marge cible), tableau des coefficients par type d'établissement, TVA (10/5,5/20 %), cas pratique chiffré (plat à 5 EUR de coût matières → 18,50 EUR TTC, marge 70,3 %), pricing psychologique (étude Cornell 2009). Aucune donnée inventée.
2. **Fix de parité découvert en vérifiant le chantier** : `/blog/no-show-restaurant-solutions` (publié le 04/09 par la routine blog-writer) était absent de `client/scripts/prerender.cjs` — Googlebot recevait le `<title>` générique de la homepage sur cette URL depuis 2 jours. Entrée ajoutée avec le vrai title/description du composant. Récidive du pattern déjà documenté dans `project_restaumargin_blog` (`google-my-business-restaurant` le 21/08) : la routine blog-writer publie une route sans toujours l'ajouter au prerender.
3. `lastmod` de `prix-de-vente-restaurant` mis à jour dans `sitemap.xml` (2026-09-06).

**Chantier `seoBody` — 6/51 articles traités.** Prochains candidats : `/blog/seuil-rentabilite-restaurant`, `/blog/faq-marge-restaurant-25-questions` (déjà écrits, riches, sans `seoBody`).

## 4. Plan — semaine 37 (7 → 13 septembre)

1. **Continuer l'extension `seoBody`** — candidat suivant : `/blog/seuil-rentabilite-restaurant` ou `/blog/faq-marge-restaurant-25-questions`.
2. **Remesurer `prime cost restaurant calcul formule`** une dernière fois avant de juger le fix du 30/08 (10 jours de recul au prochain mercredi).
3. **Rattraper les jours sautés** si un créneau s'ouvre : lundi (article PAA) et mardi (boost) n'ont rien produit cette semaine.
4. **IndexNow/Bing** : toujours 403 (`UserForbiddedToAccessSite`), Yandex 200 OK — action **propriétaire** (revendication du site dans Bing Webmaster Tools), inchangé depuis le 31/08 (7ᵉ jour+ consécutif).
5. **Vercel MCP** : `list_deployments` toujours 403 sur ce projet — vérification de déploiement par polling direct de la prod (fonctionne, ~90 s ce jour). Action **propriétaire** (ré-autorisation connecteur côté claude.ai).
6. **Vérifier au prochain run blog-writer** que la nouvelle checklist (prerender/sitemap) est bien appliquée avant publication, pour éviter une 3ᵉ récidive du même gap.

## Vérifications du jour

| Contrôle | Résultat |
|---|---|
| `node --check client/scripts/prerender.cjs` | OK |
| `npx tsc --noEmit` | exit 0, aucune erreur |
| `npx vite build` | OK, "files generated" |
| `node scripts/prerender.cjs` | 125 fichiers générés (124 → 125 avec l'ajout `no-show-restaurant-solutions`) |
| `node scripts/check-seo-coverage.cjs` | 126 sitemap / 125 prerender — **OK, toutes les URLs prerendues** (échec avant fix : 1 URL manquante) |
| Contenu `seoBody` vérifié dans le HTML généré | ✅ "coefficient effectif de 3,36", "22,50 EUR", "8 a 12 %" trouvés dans `dist/blog/prix-de-vente-restaurant/index.html` |
| Déploiement prod vérifié live (poll Googlebot UA) | ✅ `prix-de-vente-restaurant` live ~90 s après push ; `no-show-restaurant-solutions` sert désormais le bon `<title>` |
| IndexNow | Bing/api.indexnow.org 403 `UserForbiddedToAccessSite` (inchangé), Yandex 200 Accepted |
| Vercel MCP `list_deployments` | 403 Forbidden (inchangé) |
