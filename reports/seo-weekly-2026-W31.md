# SEO Weekly Review — Semaine 31 (2026-07-27 → 2026-08-02)

> Rotation dimanche = review hebdo + plan W32 + signal EAT.
> Positions vérifiées par WebSearch le 2026-08-02 (⚠️ index US, SERP volatile — à recouper avec Search Console, qui reste la seule source de vérité sur les positions FR).

---

## 1. Volume d'activité — la routine a tourné 3 jours sur 7

**36 commits** sur `main` cette semaine, tous agents confondus. La routine `seo-daily-push` a produit des commits **lundi 27/07, samedi 01/08 et dimanche 02/08**.

| Jour réel | Rotation prévue (plan W30) | Réalisé |
|---|---|---|
| **Lun 27/07** | *(le plan W30 datait ce jour « dimanche »)* | ✅ `b68324b` retrait de la FAQPage globale sans contrepartie visible (~115 pages) |
| **Mar 28/07** | Article PAA | ❌ **aucun commit sur le repo, tous agents confondus** |
| **Mer 29/07** | Trou `food cost` : analyser Restopilot/Coopeo | ❌ **aucun commit** |
| **Jeu 30/07** | Audit positions + tenue du #1 `coefficient` | ❌ **aucun commit** |
| **Ven 31/07** | Byline `updatedDate` sur 19 pages | ❌ *(les autres agents ont tourné ce jour-là, pas le SEO)* |
| **Sam 01/08** | Sitemap fresh + Googlebot | ✅ `57ca49d` chaîne critique des polices (CWV — rotation samedi) |
| **Dim 02/08** | CWV | ✅ *(ce run : review + EAT — rotation dimanche)* |

### ⚠️ Défaut de méthode découvert : le plan W30 était décalé d'un jour

Le plan de la semaine dernière étiquetait « Lun 28/07 », « Mar 29/07 »… alors que **28/07 était un mardi**. Les 7 lignes du plan étaient décalées d'un cran. Une rotation qui se déclenche sur `date +%u` ne peut pas suivre un plan dont les jours sont faux : chaque run tombait sur la consigne du jour précédent. C'est probablement une des raisons pour lesquelles les runs du 27/07 et du 01/08 n'ont pas exécuté l'action prévue pour leur date.

**Correction appliquée dans le plan W32 ci-dessous : chaque ligne porte le jour vérifié via `date -d`.**

### 🔴 Trois jours à zéro commit — récidive

**28, 29 et 30 juillet : aucun commit d'aucun agent** (ni cto, ni cfo, ni coo, ni qa, ni cmo). Exactement le même symptôme qu'en W30 (20→23 juillet). Ce n'est pas un problème de priorisation SEO : c'est l'ordonnanceur. **Deuxième semaine consécutive avec un trou de 3-4 jours.** Point pour le propriétaire — sans exécution, le plan hebdo est un document, pas un levier.

**Deploys Vercel** : aucun `ERROR` sur les 20 derniers déploiements. Deux `CANCELED` (`4f6a522`, `222d607`), écrasés par un déploiement plus récent — comportement normal.

---

## 2. Positions (WebSearch 2026-08-02)

| Requête | W30 | **W31** | Δ |
|---|---|---|---|
| `coefficient multiplicateur restaurant calcul` | 🏆 #1 | **🏆 #1** | **= tenu** |
| `logiciel marge restaurant food cost` | *(non mesuré)* | **#1 + #2 + #4** | nouveau |
| `marge restaurant calcul rentabilité` | absent | **absent** | = *(5ᵉ semaine)* |
| `calcul food cost restaurant formule ratio matière` | absent | **absent** | = *(5ᵉ semaine)* |
| `gestion trésorerie restaurant plan 13 semaines` | — | **absent** | article publié le 31/07 — voir §3 |

### Lecture

- **Le #1 sur `coefficient` tient une semaine de plus**, sans aucune action sur la page. SERP : RestauMargin #1 · Mapa #2 · Vandemoortele #3 · **Restopilot #4** · Koust #5 · **Resthodev #6** · **Comptable-restaurant #7**. Les deux experts-comptables qui nous avaient doublés en W29 continuent de reculer.
- **L'intention commerciale est solide** : sur `logiciel marge restaurant food cost`, RestauMargin occupe **3 des 4 premiers résultats** (homepage #1, `/blog/fiche-technique-restaurant` #2, `/blog/calcul-marge-restaurant` #4). Le produit est trouvable quand la requête nomme l'outil.
- **Les deux trous informationnels tiennent bon, 5ᵉ semaine.** Sur `food cost`, la SERP s'est même **entièrement renouvelée** : restopil.fr #1, Coopeo #2, Onrush #3, HRImag #4, evolve-food #5, hr-associes #6, fullsoon #7, malou #8 — Restopilot, qui était #1 en W30, n'y figure plus. Une SERP qui tourne à ce point n'est pas un mur : c'est un signe qu'aucun acteur n'y est installé durablement, et que le classement s'y joue ailleurs que sur la qualité on-page (la page RestauMargin fait 3950 mots avec HowTo, snippet et sources).
- **`marge restaurant calcul rentabilité`** : cecca.fr (expert-comptable) prend le #1 devant Combo #2, Skello #3, Restopilot #4, Coopeo #5. Le motif se répète — sur les requêtes « marge/rentabilité », ce sont les **cabinets comptables** qui montent, pas les SaaS.

---

## 3. 🔧 Le défaut de la semaine : un 3ᵉ article publié invisible

`/blog/gestion-tresorerie-restaurant` (`9caccf4`, blog-writer, 31/07) était routé, dans le sitemap, correctement écrit — et **absent de `prerender.cjs`**.

Vérifié en production, avant correction :

```
curl -A "…Googlebot…" https://www.restaumargin.fr/blog/gestion-tresorerie-restaurant
  → <title>Logiciel marge restaurant + food cost IA | RestauMargin (29€/mois)</title>
```

Googlebot recevait donc le **title de la homepage**. L'article était publié depuis 2 jours en doublon de title exact — ce que confirme la recherche `gestion trésorerie restaurant plan 13 semaines` : absent, alors que la SERP est occupée par des cabinets comptables généralistes et **aucun contenu restauration spécifique**. C'était une requête gagnable, perdue par une ligne de configuration.

**C'est la 3ᵉ semaine consécutive**, même cause, même agent en amont :

| Semaine | Article | Défaut |
|---|---|---|
| W29 | `BlogNegocierFournisseurs` | absent de prerender + props SEOHead invalides |
| W30 | `BlogRepriseRestaurant` | absent de prerender + `canonical=`/`jsonLd=` inexistants + BlogAuthor sans props |
| **W31** | `BlogGestionTresorerie` | **absent de prerender** *(les props SEOHead étaient correctes cette fois)* |

### Garde-fou posé aujourd'hui

Constater le défaut trois fois et le réparer trois fois à la main, c'est se répéter — donc c'est un signal qu'il faut écrire le contrôle, pas refaire le geste.

**`npm run seo:check`** (`client/scripts/check-seo-coverage.cjs`) : échoue avec `exit 1` dès qu'une URL du sitemap n'a pas d'entrée prerender, et imprime le correctif exact.

**Contrôle négatif effectué** (une vérification qui ne peut pas échouer ne vérifie rien) : URL bidon injectée dans le sitemap → `exit 1` + URL nommée ; sitemap restauré → `exit 0`. Le script détecte bien ce qu'il prétend détecter.

⚠️ **Il n'est pas encore branché sur le déploiement** — c'est le même arbitrage que pour `tsc` : modifier `buildCommand` engage tout le projet, hors périmètre d'un run SEO. Voir §6.

**Corrigé aussi** : `/login` était lui aussi dans le sitemap sans entrée prerender (donc title de homepage, doublon). **Branché** avec un title propre (`Connexion — RestauMargin`) plutôt que retiré du sitemap — une page orpheline se raccorde, elle ne se supprime pas. 115 → **117 pages prerendues**.

---

## 4. Signal EAT du dimanche — 5 articles sans aucune signature

Audit de toutes les pages `client/src/pages/Blog*.tsx` : **5 articles n'avaient aucune attribution d'auteur**, dont 2 avec une signature en **texte brut** non structuré. Le composant `BlogAuthor` documente lui-même le risque : *« The March 2026 Core Update penalized blog posts without author attribution. »*

| Article | Publié | Mis à jour | Source de la date |
|---|---|---|---|
| `BlogKpiRestaurateur` | 2026-04-24 | — | création ; commits suivants = refactor design uniquement |
| `BlogMenuEngineering` | 2026-04-27 | **2026-07-10** | boost réel (+6 FAQ) |
| `BlogStrategieDigitale` | 2026-04-27 | **2026-05-26** | boost réel (3000+ mots) |
| `BlogGestionTresorerie` | 2026-07-31 | — | création *(signature texte brut remplacée)* |
| `BlogOuvrirTerrasse` | 2026-07-10 | — | création *(signature texte brut remplacée)* |

**Chaque date vient de `git log`, jamais de la date du jour.** Cas d'école : le dernier commit touchant `BlogStrategieDigitale` date du 17/07, mais il n'a modifié que **2 lignes de liens internes**. Ce n'est pas une mise à jour de contenu → la byline reste au 26/05, en accord avec le schema. Une fraîcheur non méritée est un faux signal, pas un gain.

Ce que le composant ajoute par rapport au hero existant (qui n'affichait qu'un badge de date) : entité auteur liée à `/a-propos`, `<time itemProp="datePublished">` et `dateModified` **visibles**, lien méthodologie, tags d'expertise. Les dates annoncées dans le schema `Article` sont désormais corroborées à l'écran — c'était précisément le défaut relevé sur 19 pages en W30.

> **Décision assumée, 5ᵉ semaine consécutive** (W22, W28, W29, W30, W31) : l'« auteur fictif avec profil LinkedIn crédible » et la « mention presse fictive » prévus par la consigne générique du dimanche sont **écartés**. C'est la même classe de faux signal que l'`aggregateRating` 4.8/150 retiré en W28 — risque d'action manuelle Google, et contenu inventé présenté comme véridique. L'entité `Organization` réelle, datée et vérifiable est un signal Trust durable ; un faux profil est une dette qui se paie une seule fois, très cher.

---

## 5. Ce que la semaine apprend

1. **Le contenu n'est plus le facteur limitant sur l'informationnel.** 5 semaines d'absence sur `food cost` avec une page de 3950 mots complète, pendant qu'une SERP entièrement renouvelée défile au-dessus. Continuer à écrire ne répondra pas à la question ; il faut mesurer **pourquoi** ces pages ne sortent pas (cannibalisation interne ? autorité de domaine ? intention mal servie ?).
2. **La question de cannibalisation posée le 27/07 n'a toujours pas été instruite** — reportée par le trou du 28-30/07. **23 titres du site portent l'expression « food cost »** ; le hub `/blog/calcul-marge-restaurant` et la page dédiée `/blog/reduire-food-cost` visent la même tête de requête. C'est l'hypothèse la mieux étayée du dossier et elle attend depuis 3 runs.
3. **Un défaut qui revient 3 fois est un défaut de processus, pas d'exécution.** D'où le garde-fou plutôt qu'une 3ᵉ réparation manuelle.

---

## 6. Plan semaine 32 (2026-08-03 → 2026-08-09) — jours vérifiés via `date -d`

| Jour | Date | Action |
|---|---|---|
| **Lundi** | 03/08 | **Instruire la cannibalisation `food cost`** *(reportée 3 fois)*. Lister les URLs qui ciblent la même intention, décider laquelle est la page canonique, désoptimiser/rediriger les autres et faire pointer le maillage vers elle. Ne PAS écrire un nouvel article avant d'avoir tranché. |
| **Mardi** | 04/08 | Article PAA non couvert *(jamais fait depuis W29)*. Croiser `ls client/src/pages/Blog*.tsx` + `docs/blog-articles/backlog.md` avant d'écrire — piège du doublon déjà documenté. Finir par `npm run seo:check`. |
| **Mercredi** | 05/08 | Audit positions + **vérifier l'indexation de `/blog/gestion-tresorerie-restaurant`** maintenant qu'il sert enfin son propre title. C'est la mesure directe du coût du défaut prerender. |
| **Jeudi** | 06/08 | Byline `updatedDate` sur les **19 pages** qui annoncent un `dateModified` sans rien afficher *(reportée depuis W30)*. Chaque date alignée sur `git log`, jamais sur le jour du run. |
| **Vendredi** | 07/08 | Sitemap fresh + audit Googlebot des 10 titres clés + re-vérifier en prod les 5 articles signés aujourd'hui *(pas de « Invalid Date », dates cohérentes)*. |
| **Samedi** | 08/08 | CWV : le precache PWA est à **639,68 KiB pour 10 entrées** — viser le LCP réel de `/blog/calcul-marge-restaurant`. |
| **Dimanche** | 09/08 | Review W32 + EAT : enrichir `/a-propos` (méthodologie, sources de données réelles) — la page est la destination de toutes les signatures auteur, elle doit tenir la promesse. |

### 🔴 Points propriétaire (aucun ne peut être traité par un run SEO)

1. **Ordonnanceur** — 2ᵉ semaine consécutive avec 3 jours à zéro commit (28-30/07, après 20-23/07). Cause commune à tous les agents.
2. **`tsc` absent du build Vercel** — *inchangé, 4 semaines*. `buildCommand` = `npx vite build` sans type-check, alors que `client/package.json` a `build: tsc -b && vite build`. Deux articles publiés cassés pour cette raison. Le type-check passe actuellement (revérifié aujourd'hui, `exit 0`) → l'activer est sans risque immédiat.
3. **Brancher `npm run seo:check`** sur le même `buildCommand`, pour que le défaut prerender ne puisse plus atteindre la production une 4ᵉ fois.
4. **Bing IndexNow 403** (`UserForbiddedToAccessSite`) — revendiquer `restaumargin.fr` dans Bing Webmaster Tools. Bloqué depuis le 19/07, prouvé côté compte (le fichier clé est servi en 200). Bing est le canal qui a déjà amené une inscription organique réelle.
