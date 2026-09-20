# SEO Weekly Review — semaine 38 (14 → 20 septembre 2026)

**Rotation du jour** : dimanche = review hebdo + plan semaine + signal EAT.

**Résultat principal de la semaine** : le canal Bing, désigné « canal prioritaire » par le
brief depuis juillet, est **entièrement fermé** — Bing n'a aucune page du site dans son index,
et rien de ce qui est fait dans ce dépôt ne peut l'ouvrir. Mesuré aujourd'hui avec témoin (§3).

---

## 1. Ce qui a été fait cette semaine

**4 jours de rotation exécutés sur 6 écoulés — 2 jours manqués (jeudi, vendredi) :**

| Jour | Commit | Action |
|---|---|---|
| Lun 14/09 | `bd301b3` | `seo(paa-daily)` — publication de l'article orphelin `pourboires-restaurant-legislation-fiscalite` (dette identifiée au plan semaine 37, point 4). |
| Mar 15/09 | `7e9b02c` | `seo(boost)` — `BlogOuvrirTerrasseRestaurant` : +2 sections, FAQ 4→10, schema FAQPage, 5 liens internes. |
| Mer 16/09 | `59f86e2` | `seo(audit)` — **génération statique des schemas Article + FAQPage** à partir du `seoBody`. Ce run a aussi établi qu'aucune des ~50 pages blog/guide n'émettait ces schemas : les vérifications précédentes grepaient la chaîne `FAQPage`, qui ne matchait qu'un commentaire mort de `client/index.html` présent sur **toutes** les pages — faux positif systématique. |
| **Jeu 17/09** | — | **Aucun commit SEO.** Rotation « nouvelle page comparatif ou niche » sautée. |
| **Ven 18/09** | — | **Aucun commit de cette routine.** Rotation « freshness + IndexNow + rich snippets » sautée. Le système workforce a en revanche livré `f9c8caa fix(pwa): rendre aux pages publiques leur HTML prerendu` — correctif à fort impact SEO, mais hors de cette routine. |
| Sam 19/09 | `44cff3e` → `c9bb089` | `perf(seo)` — préchargement du chunk de route, **mesuré en A/B de production puis reverté** le jour même. Livrable = diagnostic : le LCP est CPU-bound (56-94 long tasks, 7,5-8,4 s de blocage), pas réseau-bound. |
| Dim 20/09 | `9321a7a`, `683ffae` | Voir §3. |

**Constat de régularité** : 3ᵉ semaine consécutive avec des jours de rotation manqués
(semaine 36 : lun+mar ; semaine 37 : ven ; semaine 38 : jeu+ven). Le motif reste irrégulier
et non cantonné à un jour fixe — cohérent avec `project_restaumargin_routines_health`.

**Point positif inverse** : le gap de publication d'articles orphelins, qui avait récidivé
4 fois en 3 semaines, **ne s'est pas reproduit cette semaine**. La dette identifiée au plan
précédent (`pourboires-…`) a été résorbée dès le lundi, et `check-seo-coverage.cjs` rend
132 sitemap / 131 prerender en parité depuis.

---

## 2. Positions — avertissement de méthode d'abord

⚠️ **Changement d'instrument cette semaine, la comparaison semaine/semaine est donc bancale.**

La méthode validée le 09/09 (scrape SERP Playwright sur `google.com/search?gl=fr&hl=fr`) est
**devenue inutilisable** : Google sert désormais une page de détection de bots
(`/sorry/index?continue=…`) à ce navigateur. Ce type de contrôle ne se contourne pas — j'ai
basculé sur `WebSearch`, qui renvoie un **jeu de liens, pas des rangs vérifiés**.

Conséquence à garder en tête : entre la semaine 37 et la semaine 38, **le sujet mesuré ET
l'instrument ont changé en même temps**. Tout écart observé ci-dessous est donc non
attribuable — il ne prouve ni progression ni régression.

| Requête | Présence RestauMargin (jeu WebSearch) | Lecture |
|---|---|---|
| `coefficient multiplicateur restaurant calcul` | **présent, 3ᵉ lien** (`/blog/coefficient-multiplicateur`) | Était donné **absent du top 10** les 09/09, 13/09 et 16/09 (3 runs consécutifs). Le fix schema du 16/09 est le changement le plus proche dans le temps, **mais l'instrument a changé aussi** — ne pas conclure. À re-mesurer mercredi 23/09 avec le même instrument qu'aujourd'hui. |
| `logiciel marge restaurant food cost` | **présent, 2ᵉ et 3ᵉ liens** (home + `/blog/fiche-technique-restaurant`) | Cohérent avec le #1 mesuré les semaines précédentes sur la requête commerciale. Nouveau venu devant : `margebrut.fr`. |
| `marge restaurant calcul` | **absent** des 9 liens | Requête informationnelle de tête, toujours pas percée. Devant : koust (×2), combohr, hr-associes, sumup, coopeo, myalfred, malou. |
| `restaumargin` (marque) | **10 liens sur 10** sont des pages restaumargin.fr | Le site est bien indexé côté Google — ce point sert de témoin au §3. |

**Concurrents informationnels nouvellement vus** : `margebrut.fr` (devant nous sur la requête
logiciel+food cost), `potti.co`, `coskitchen.fr`, `restomaestro.com`, `afoodi.io`,
`somm-it.com`. `adoria.com` et `komia.io`, repérés en semaine 37, se confirment. Le paysage
continue de se densifier — requalifier sur 2-3 semaines avant d'agir, comme d'habitude.

---

## 3. Action du jour (remplace l'action EAT prévue au brief)

Comme chaque dimanche depuis le 23/08, **l'étape EAT du brief n'a pas été exécutée**.
Fabriquer un « author bio enrichi avec lien LinkedIn fictif crédible » ou une « mention presse
fictive sur /a-propos » crée un signal de confiance qui n'existe pas — même risque que le faux
`aggregateRating` que le brief interdit lui-même ailleurs. `/a-propos` et `BlogAuthor.tsx`
restent inchangés et vrais. **Le brief mériterait d'être édité à la source** pour retirer cette
consigne (`~/.claude/scheduled-tasks/restaumargin-seo-daily-push/SKILL.md`, modifiable par le
propriétaire en session interactive, pas par un run planifié) — signalé chaque semaine depuis
4 semaines.

À la place, deux actions réelles.

### 3.1 — Le canal Bing est fermé, et ce n'est pas un détail de plan

Le plan porte depuis le 31/08 une ligne « IndexNow/Bing 403 — action propriétaire », traitée
comme une tâche mineure en attente. La mesure d'aujourd'hui la requalifie : **ce 403 est le
seul et unique verrou du canal Bing entier.**

**Ce que j'ai mesuré, et comment je me suis empêché de me tromper.** L'opérateur `site:` s'est
révélé **inutilisable** : `site:restaumargin.fr` renvoyait des forums baidu/zhihu, ce qui
ressemblait à une preuve d'absence d'index. Le témoin a démonté cette lecture —
`site:zenchef.com`, sur un site massivement indexé, renvoie lui aussi du hors-sujet
(stripchat.com). L'opérateur est simplement ignoré par cette session Bing. **Sans ce témoin,
je publiais une conclusion juste appuyée sur une preuve fausse.**

Sonde de remplacement, sans opérateur : **recherche du titre exact**, avec témoin.

| Sonde (titre exact, entre guillemets) | Résultat Bing |
|---|---|
| **TÉMOIN** `"Zenchef \| Logiciel de gestion restauration et restaurant"` | zenchef.com en **#1, #2, #3, #4, #5** — la sonde fonctionne. |
| `"Marge restaurant 2026 : calcul, formule, food cost"` (titre de la page hub) | **aucune page restaumargin.fr** — Bing abandonne la phrase et retombe sur les calculateurs génériques. |
| `"Logiciel marge restaurant + food cost IA"` (titre de la home) | **aucune page restaumargin.fr** — retombe sur clubic / 01net / logicieleducatif. |
| `restaumargin` (marque, même forme que le témoin `zenchef`) | YouTube et Google Accounts. Bing n'a **aucune correspondance de marque**. |

Sur les requêtes métier (`marge restaurant`, `logiciel marge restaurant`, `calcul marge
restaurant`, `food cost restaurant`, `coefficient multiplicateur restaurant`), Bing ne renvoie
d'ailleurs **aucun acteur de la gestion de restaurant** — ni Zenchef, ni Coopeo, ni koust : il
décompose les requêtes en termes génériques (calculatrices, Larousse, TheFork, Wikipédia).
Autrement dit, même indexé, il n'y aurait pas grand-chose à y gagner sur ces têtes de requête.

**Côté serveur, tout est correct** — le blocage n'est pas chez nous :

| Contrôle | Résultat |
|---|---|
| `robots.txt` | `User-agent: * / Allow: /`, `Sitemap:` déclaré |
| bingbot sur `/` | **200**, `<title>` prerendu correct, 216 ms |
| bingbot sur `/blog/calcul-marge-restaurant` | **200**, `<title>` prerendu correct |
| Fichier clé IndexNow servi | **200**, contenu = la clé |
| `POST api.indexnow.org` | **403 `UserForbiddedToAccessSite`** |
| `POST yandex.com/indexnow` | **202 Accepted** |

**Conclusion** : la seule action qui ouvre ce canal est la **revendication du domaine dans Bing
Webmaster Tools** — hors dépôt, propriétaire uniquement.

### 3.2 — Correction d'une prémisse fausse écrite dans le code (`683ffae`)

`scripts/indexnow-ping.mjs` portait ce commentaire :

> « yandex.com accepte **et propage les URLs au réseau IndexNow** » — donc « utile tant que la
> vérification de la clé côté Bing renvoie 403 ».

Cette phrase a fait passer le 403 pour bénin pendant 3 semaines. La mesure ci-dessus la
**réfute** : après 3+ semaines de `yandex 202` quotidiens, Bing n'a toujours rien. Le
commentaire a été remplacé par la mesure et sa date.

Le résumé de fin de run a été corrigé dans le même esprit : il affichait
`IndexNow : accepté par au moins un moteur (repartagé au réseau)` — une ligne verte sur un
canal mort. Il nomme désormais les moteurs qui ont accepté et affiche explicitement le blocage.
Sortie réelle du run d'aujourd'hui :

```
  KO  api.indexnow.org     HTTP 403 Forbidden
  KO  www.bing.com         HTTP 403 Forbidden
  OK  yandex.com           HTTP 200 Ok
IndexNow : accepté par yandex.com.
IndexNow : BING REFUSE (403) — canal Bing fermé, indexation Bing nulle.
           Action propriétaire requise : revendiquer www.restaumargin.fr
           dans Bing Webmaster Tools (https://www.bing.com/webmasters) ;
           option "Importer depuis Google Search Console" la plus rapide.
```

Le code de sortie est **inchangé** (0 si un moteur accepte) : la correction porte sur ce qui est
rapporté, pas sur le flux de la chaîne quotidienne.

### 3.3 — Enrichissement `seoBody` de `/blog/seuil-rentabilite-restaurant` (`9321a7a`)

Point 1 du plan de la semaine 37, jamais exécuté. La page (3 200 mots côté React, 1 031 lignes)
n'émettait **que `BreadcrumbList`** dans le HTML servi aux crawlers.

Ajout d'un `seoBody` reprenant fidèlement du contenu **déjà publié sur la page** : les 4 étapes
du calcul (MCV → seuil → couverts → point mort calendaire), la ventilation fixes/variables
(CDI 70/30, énergie variable et non fixe, commissions CB 0,5-1 %), les benchmarks de point mort
(Fiducial/GIRA 2025), l'exemple chiffré 18 000 EUR de charges fixes / MCV 60 % → 30 000 EUR de
seuil, et 7 questions fréquentes. **Aucun chiffre inventé** — tout provient de
`BlogSeuilRentabilite.tsx`.

Effet mesuré, avec témoins :

| Page | Schemas dans le HTML statique | Poids |
|---|---|---|
| `tva-restaurant` (témoin sans `seoBody`) | BreadcrumbList seul | 19 254 o |
| `calcul-marge-restaurant` (témoin avec `seoBody` ancien) | Article + FAQPage (8 Question) | — |
| **`seuil-rentabilite-restaurant` (avant)** | BreadcrumbList seul | ~19 Ko |
| **`seuil-rentabilite-restaurant` (après)** | **Article + FAQPage + 7 Question** | **31 672 o** |

Vérifié **en production** après déploiement : `200`, 31 395 o, `Article` + `FAQPage` +
`BreadcrumbList`, 7 `Question`, contenu présent. `lastmod` du sitemap passé au 2026-09-20 pour
cette seule URL (1 ligne modifiée, vérifié par `git diff --numstat`).

Il reste **8 pages sur 62 routes blog** avec un `seoBody`. C'est le gisement le plus direct
qui reste : chaque page traitée gagne d'un coup du texte indexable et ses schemas Article +
FAQPage.

---

## 4. Plan — semaine 39 (21 → 27 septembre)

1. **Re-mesurer `coefficient multiplicateur restaurant calcul` mercredi 23/09 avec l'instrument
   d'aujourd'hui** (WebSearch), pour obtenir enfin deux points comparables. Ne pas conclure sur
   l'effet du fix schema du 16/09 avant ça.
2. **Continuer l'extension `seoBody`** — 8 sur 62 pages couvertes. Candidats immédiats :
   `/blog/faq-marge-restaurant-25-questions` (déjà écrite, riche, sans `seoBody` — reste du
   plan 37), `/blog/prix-de-vente-restaurant` a déjà le sien, viser plutôt
   `/blog/marge-beneficiaire-restaurant-ideal` et `/blog/cout-revient-plat-restaurant` qui
   ciblent des requêtes informationnelles listées comme non rankées dans l'audit initial.
3. **Samedi technique = travail JS au démarrage**, pas les hints de ressources (piste fermée,
   mesurée le 19/09). Pistes à mesurer : coût d'init des fonds WebGL pendant la fenêtre LCP,
   travail d'hydratation de `Landing`.
4. **Redirection apex** : `restaumargin.fr` → `www` en **307** (temporaire) au lieu de 301/308.
   Signal de consolidation plus faible. Config de domaine Vercel, hors dépôt — à remonter au
   propriétaire avec le point Bing.
5. **Trouver une méthode de mesure de rang stable.** WebSearch ne donne pas de rangs, Playwright
   sur Google est désormais bloqué. Sans instrument fiable, l'objectif « passer #5 → TOP 1 sur
   marge restaurant » n'est pas vérifiable. À arbitrer : Search Console (le propriétaire y a
   accès) est la seule source de rang moyen qui soit à la fois exacte et légitime.

---

## 5. À remonter au propriétaire (2 actions, hors dépôt)

1. **Revendiquer `www.restaumargin.fr` dans Bing Webmaster Tools**
   (https://www.bing.com/webmasters) — l'option « Importer depuis Google Search Console » est la
   plus rapide. C'est le **seul** verrou du canal Bing : tout le reste (robots, prerender,
   sitemap, fichier clé) est déjà en place et vérifié. Sans cette action, la ligne « IndexNow »
   de cette routine ne fait qu'alimenter Yandex, et l'inscription venue de Bing en juillet
   restera un cas isolé.
2. **Éditer le brief de la routine** pour retirer la consigne EAT fictive (dimanche, point 4) —
   elle est refusée chaque semaine depuis le 23/08 et sera refusée chaque semaine tant qu'elle
   y figure.

Point de contexte, non demandé mais mesuré : `restaumargin.fr` redirige en 307 vers `www` (§4.4).

---

## Vérifications du jour

| Contrôle | Résultat |
|---|---|
| `git pull --ff-only origin main` | OK, 6 fichiers (commits workforce du matin) |
| `node --check client/scripts/prerender.cjs` | OK |
| `npx vite build` | OK — « files generated », 30,2 s |
| `node client/scripts/prerender.cjs` | 131 fichiers générés |
| `node client/scripts/check-seo-coverage.cjs` | 132 sitemap / 131 prerender — **parité OK** |
| Schemas en local sur la page modifiée | Article + FAQPage + 7 Question (témoins : `tva-restaurant` = BreadcrumbList seul) |
| `git push origin main` | `683ffae`, OK |
| Déploiement Vercel (`gh api .../commits/683ffae/status`) | **success** sur les 2 contextes (`Vercel – restaurant-margin`, `Vercel – restaumargin`), après ~1 min d'attente |
| Vérification en production (Googlebot) | 200, 31 395 o, Article + FAQPage + 7 Question, contenu `seoBody` présent |
| IndexNow | Bing/api.indexnow.org **403** (inchangé), Yandex **202** — nouveau résumé de run vérifié |
| MCP Vercel `list_deployments` | **403 forbidden**, re-testé ce run — toujours inutilisable, `gh api` reste la voie |
