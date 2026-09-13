# SEO Weekly Review — semaine 37 (7 → 13 septembre 2026)

**Rotation du jour** : dimanche = review hebdo + plan semaine + signal EAT.

## 1. Ce qui a été fait cette semaine

**5 commits SEO sur 7 jours de rotation prévus — 1 jour manqué (vendredi) :**

| Jour | Commit | Action |
|---|---|---|
| Lun 07/09 | `c0d035e` | `seo(paa-daily)` — publication `brigade-cuisine-organisation-postes` (dette de 3 jours résorbée). |
| Mar 08/09 | `f610f6b` | `seo(boost)` — `BlogAllergenes` +900 mots, FAQ 5→10, 5 liens internes ajoutés. |
| Mer 09/09 | `6ee5090` | `seo(audit)` — rapport positions (passage à la méthode Playwright SERP scrape, plus fiable que WebSearch) + FAQ `seoBody` dupliquée sur `coefficient-multiplicateur`. |
| Jeu 10/09 | `894e0c2` | `seo(niche\|comparatif)` — nouvelle page `/alternative-marge-brut`, concurrent identifié le 02/09. |
| **Ven 11/09** | — | **Aucun commit SEO ce jour** — rotation "freshness + IndexNow + rich snippets" sautée (seuls `qa`/`cfo` du système workforce présents ce jour-là). 2ᵉ semaine consécutive avec un jour de rotation manqué (semaine 36 : lundi+mardi ; semaine 37 : vendredi) — pattern irrégulier, pas cantonné à un jour fixe, cohérent avec `project_restaumargin_routines_health`. |
| Sam 12/09 | `55dee22` | `perf(seo)` — `fetchPriority="high"` sur l'image hero de la fiche recette publique. |
| **Dim 13/09** | `29a4aa0` | Voir §3 — fix régression build TS + publication orpheline `logiciel-reservation-restaurant`. |

**Hors rotation seo-daily-push** : le système multi-agent "workforce" (cto/coo/cmo/qa/cfo/ceo/onboarder/outreach/bug-fixer) a continué de committer quotidiennement sur ce repo. Son `blog-writer` a rédigé et componentisé un nouvel article (`logiciel-reservation-restaurant`, commits `6cd13a1`/`096e902` du 12/09) mais sans le router ni le prerendre — voir §3, corrigé aujourd'hui. Son `qa` a détecté la régression de build le jour même (`38c5e11`) mais ne l'a pas corrigée avant ce run.

## 2. Positions Google — avant / après

Mesuré via Playwright (scrape SERP `google.com/search?gl=fr&hl=fr`, méthode validée le 09/09 — plus fiable que WebSearch sur ces requêtes), sans nom de marque pour ne pas biaiser le résultat :

| Requête | Résultat | Comparaison vs mercredi dernier (09/09) |
|---|---|---|
| `logiciel marge restaurant` | **#1** (homepage) | Stable — domine la requête commerciale. |
| `marge restaurant calcul logiciel` | **#1** (homepage) | **Progression** — était #5 le 30/08 puis stable ; passé #1 cette semaine. |
| `coefficient multiplicateur restaurant calcul` | **Absent du top 8** (`/blog/coefficient-multiplicateur`, page toujours en 200 OK, non cassée) | **Régression** — était #4 stable depuis 3 semaines (fix `seoBody` du 19-20/08). À remesurer mercredi prochain avant de conclure ; SERP français pur cette fois (plus aucun résultat anglophone, contrairement aux runs précédents), signe possible d'un remaniement de l'algorithme sur cette requête plutôt qu'un problème propre à la page. |
| `prime cost restaurant calcul formule` | **Toujours absent du top 9**, SERP 100 % francophone cette fois (Libeo, Steandy, Zenchef, Onrush, RestoClover…) | **Inchangé** — 2 semaines après le fix `seoBody` du 30/08, toujours aucun signal. Le délai habituel de 3-5 jours observé sur `coefficient-multiplicateur` est largement dépassé. Conclusion provisoire : le fix seul ne suffit pas sur cette requête (concurrence dense, 9 pages francophones dédiées « prime cost » déjà bien installées) — un simple ajout de contenu ne rattrape probablement pas l'autorité de domaine acquise par ces concurrents spécialisés. |

**Nouveaux concurrents informationnels observés cette semaine** (jamais suivis avant) : `inpulse.ai`, `adoria.com`, `komia.io`, `otami.fr`, `previresto.com`, `yokitup.com`, `heypongo.com`, `libeo.io`, `steandy.com`, `onrush.fr`, `restoclover.com`. Le paysage concurrentiel informationnel s'est nettement densifié depuis l'audit initial (Coopeo/Zenchef/RestoPilot) — à requalifier sur 2-3 semaines avant d'agir, comme fait pour earn.fr/gostan.io le 09/09 (qui n'apparaissent plus dans les 3 SERP scannées aujourd'hui — turnover normal en page 1).

## 3. Action du jour (remplace l'action EAT prévue au brief)

Comme chaque dimanche depuis le 23/08, **l'étape EAT du brief n'a pas été exécutée** : fabriquer un "author bio enrichi avec lien LinkedIn fictif crédible" ou une "mention presse fictive sur /a-propos" crée un signal de confiance qui n'existe pas — même risque que le faux `aggregateRating` déjà retiré (action manuelle Google pour désinformation, exposition du propriétaire si la fiction doit un jour être justifiée). `/a-propos` et `BlogAuthor.tsx` restent inchangés et vrais.

À la place, deux actions réelles (la 1ère plus lourde que d'habitude car bloquante) :

1. **Fix de la régression de build TS détectée par le workforce le 12/09** (`38c5e11`) : `BlogLogicielReservation.tsx` passait une prop `canonicalPath` inexistante sur `SEOHeadProps` (interface n'accepte que `path`) — `npx tsc`/`vite build` cassés depuis la veille au soir. Corrigé (`path=`).
2. **Publication de la page orpheline `logiciel-reservation-restaurant`** : componentisée + dans le sitemap depuis le 12/09, mais jamais routée (`App.tsx`), jamais prerendue, absente de `BlogIndex.tsx` — Googlebot n'avait aucun moyen d'atteindre cette URL malgré sa présence dans le sitemap. **4ᵉ récidive du même gap de publication** documenté dans `project_restaumargin_blog` (`google-my-business-restaurant` 21/08, `no-show-restaurant-solutions` 04/09, `brigade-cuisine-organisation-postes` 07/09). Route + entrée `prerender.cjs` + carte `BlogIndex.tsx` ajoutées, `check-seo-coverage.cjs` confirme 130 sitemap / 130 prerender après build (129 avant l'ajout).

**Constat structurel à signaler au propriétaire** : ce gap se reproduit maintenant à un rythme régulier (4 fois en 3 semaines) car la routine `blog-writer` du système workforce componentise sans exécuter la checklist route/prerender/index. Une correction ponctuelle par `seo-daily-push` ne résout pas la cause — le vrai fix serait de brancher `check-seo-coverage.cjs` en fin de run `blog-writer` lui-même (déjà recommandé les 26/07, 21/08 et 06/09, toujours pas fait).

## 4. Plan — semaine 38 (14 → 20 septembre)

1. **Continuer l'extension `seoBody`** — candidats : `/blog/seuil-rentabilite-restaurant`, `/blog/faq-marge-restaurant-25-questions` (déjà écrits, riches, sans `seoBody`).
2. **Remesurer `coefficient multiplicateur restaurant calcul` et `prime cost restaurant calcul formule` mercredi** — trancher si la régression du premier est du bruit SERP ou un vrai recul, et si le second nécessite une stratégie différente du simple `seoBody` (backlinks / contenu plus ciblé) après 2 semaines sans effet.
3. **Rattraper vendredi** si un créneau s'ouvre (freshness + IndexNow + rich snippets sauté cette semaine).
4. **Vérifier que `pourboires-restaurant-legislation-fiscalite.md`** (rédigé le 12/09 par blog-writer, backlog #1) est componentisé + publié — nouvelle dette de publication en attente, à traiter un lundi prochain si le workforce ne le fait pas.
5. **IndexNow/Bing** : toujours 403 (`UserForbiddedToAccessSite`), Yandex 200 OK — action **propriétaire** (revendication du site dans Bing Webmaster Tools), inchangé depuis le 31/08 (2 semaines+ consécutives).
6. **Signaler au propriétaire** : brancher `check-seo-coverage.cjs` en fin de run `blog-writer` pour éviter une 5ᵉ récidive du gap de publication.

## Vérifications du jour

| Contrôle | Résultat |
|---|---|
| `git merge origin/main` (8 commits workforce divergents) | OK, sans conflit |
| `npx vite build` | OK, "files generated" (build cassé avant le fix `path=`) |
| `node scripts/prerender.cjs` | 129 fichiers générés |
| `node scripts/check-seo-coverage.cjs` | 130 sitemap / 129 prerender avant l'ajout → **OK après** (parité confirmée) |
| Title prerendu vérifié | `<title>Logiciel de reservation restaurant : comparatif 2026 \| RestauMargin</title>` présent dans `dist/blog/logiciel-reservation-restaurant/index.html` |
| `git push origin main` | `29a4aa0`, OK |
| Déploiement Vercel (2 contextes, `gh api .../commits/<sha>/status`) | Voir rapport quotidien du jour |
| IndexNow | Bing/api.indexnow.org 403 `UserForbiddedToAccessSite` (inchangé), Yandex 200 Accepted |
