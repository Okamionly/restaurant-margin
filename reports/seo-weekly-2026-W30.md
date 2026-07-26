# SEO Weekly Review — Semaine 30 (2026-07-20 → 2026-07-26)

> Rotation dimanche = review hebdo + plan W31 + signal EAT.
> Positions vérifiées via WebSearch le 2026-07-26 (⚠️ biais US + volatilité SERP — à recouper avec Search Console).

## 1. Volume d'activité — ⚠️ la rotation n'a tourné que 2 jours sur 7

**31 commits** sur `main` cette semaine (tous agents confondus), mais la routine `seo-daily-push` n'a produit des commits que **samedi 25 et dimanche 26**.

| Jour | Rotation prévue (plan W29) | Réalisé |
|---|---|---|
| Lun 20/07 | Article PAA | ❌ **aucun commit sur le repo** |
| Mar 21/07 | Boost food cost (carry-over) | ❌ **aucun commit** |
| Mer 22/07 | Audit positions + dissection concurrents | ❌ **aucun commit** |
| Jeu 23/07 | Étendre BlogNegocierFournisseurs / niche | ❌ **aucun commit** |
| Ven 24/07 | Sitemap fresh + Googlebot + rich results | ❌ *(seuls cto/cfo/coo/qa/onboarder ont tourné)* |
| Sam 25/07 | CWV | ✅ `27b17f3` lazy-load + decoding + dimensions CLS |
| Dim 26/07 | Review + EAT | ✅ *(ce run)* |

**5 des 7 actions planifiées n'ont jamais été exécutées.** Les journées 20→23 sont vides pour *tous* les agents, pas seulement le SEO → cause probablement infra/ordonnanceur, pas un choix de priorisation. **À remonter au propriétaire** : sans exécution, le plan hebdo n'est qu'un document.

Contenu tout de même produit samedi par **d'autres** agents :
- `42e9144` — niche `/guide-marge/restaurant-traiteur` (seo-writer) — **prerender OK**, title propre servi à Googlebot ✅
- `827997c` — article `/blog/reprise-restaurant-guide-acheteur` (blog-writer) — **cassé, réparé aujourd'hui** (voir §3)

**Deploy Vercel** : aucun `ERROR` de la semaine. Dernier prod `dbe810b` en `BUILDING` au moment du run, les précédents `READY`.

## 2. Positions Google (WebSearch 2026-07-26)

| Query | W30 | Δ vs W29 | SERP |
|---|---|---|---|
| `coefficient multiplicateur restaurant calcul` | **🏆 #1** | 🔼 **#6 → #1 (+5)** | RestauMargin #1 · Mapa #2 · Vandemoortele #3 · GE-RH #4 · **Restopilot #5** · Koust #6 · **Resthodev #7** · **Comptable-restaurant #8** |
| `marge restaurant calcul rentabilité` | Absent top 8 | = (absent) | Mapa #1 · Combo #2 · Skello #3 · Restopilot #4 · Coopeo #5 |
| `calcul food cost restaurant formule ratio matière` | Absent top 9 | = (absent) | Restopilot #1 · Coopeo #2 · Onrush #3 · HRImag #4 · evolve-food #5 |

### Lecture

- **🏆 Récupération complète sur `coefficient`** — la page passe **#6 → #1**, devant les deux experts-comptables qui nous avaient doublés en W29 (Resthodev #4→#7, Comptable-restaurant #5→#8) et devant **Restopilot (#1 → #5)**. C'était le risque n°1 identifié en W29 ; il est levé. Aucune action n'a pourtant été menée sur cette page cette semaine → le gain vient probablement des travaux structurels antérieurs qui se sont propagés (maillage interne réparé en W29, −46 % de JS critique, retrait de l'aggregateRating) plutôt que d'une optimisation ponctuelle.
- **Les 2 trous informationnels persistent** (`food cost`, `marge/rentabilité` tête de requête) — **4ᵉ semaine consécutive**. Le boost food cost est reporté depuis W29… alors qu'il était en réalité **déjà fait** (voir §4). Le plan répétait une tâche fantôme.
- **Restopilot reste le concurrent n°1** sur l'informationnel : #1 food cost, #4 marge-rentabilité, #5 coefficient.

## 3. 🔧 Réparation critique — l'article publié samedi était un écran blanc SEO

`/blog/reprise-restaurant-guide-acheteur` (`827997c`, blog-writer) était publié, routé et dans le sitemap, mais **cassé sur 4 plans simultanés** — détecté par l'audit `prerender ↔ sitemap` de ce run, confirmé en prod puis par `tsc`.

| Défaut | Effet réel | Correction |
|---|---|---|
| Absent de `prerender.cjs` | Googlebot recevait le **title de la homepage** (vérifié en live : `Logiciel marge restaurant + food cost IA \| RestauMargin (29€/mois)`) → doublon invisible | Entrée ajoutée (115 fichiers prerendus, +1) |
| `canonical={...}` — prop inexistante | **Aucune balise canonical** | → `path={...}` |
| `jsonLd={[...]}` — prop inexistante | **Aucun JSON-LD** : Article + FAQPage + BreadcrumbList tous perdus | → `schema={[...]}` |
| `<BlogAuthor />` sans props (requises) | `new Date(undefined)` → **« Invalid Date » affiché aux visiteurs** | props + variantes header/footer |

⚠️ **Récidive exacte de W29** (`BlogNegocierFournisseurs`, mêmes mauvaises props, même agent en amont). Cause racine inchangée : **`build:vercel` = `vite build` sans `tsc`** → esbuild strippe les types sans les vérifier, le déploiement passe au vert avec des props invalides. Les 2 erreurs étaient visibles en 8 s avec `npx tsc --noEmit`.

## 4. Signal EAT du dimanche — attribution d'auteur (véridique)

**Audit systématique des 46 articles** (schema `dateModified` vs byline visible `updatedDate`) :

| État | Nb | Détail |
|---|---|---|
| ✅ cohérent | 22 | — |
| ⚠️ **aucun `<BlogAuthor>`** | 4 | ChiffreAffaires, CoutRevient, PsychologiePrix, TauxOccupation |
| ⚠️ byline sans date de MAJ visible | 19 | schema annonce un `dateModified` que rien ne corrobore à l'écran |
| ❌ **drift** | 1 | FoodCost : schema `2026-06-03` vs byline `2026-05-26` |

**Corrigé aujourd'hui :**
- **4 articles dotés de la signature auteur** (header + footer). C'est exactement le risque que le composant documente lui-même : *« The March 2026 Core Update penalized blog posts without author attribution. »* `BlogPsychologiePrix` avait une signature en **texte brut** (`Par l'équipe RestauMargin · 29 mai 2026`) — remplacée par le composant structuré (`<time itemProp>`, schema `Organization`, lien méthodologie `/a-propos`, tags d'expertise).
- **Drift FoodCost résolu** — `git log` confirme que la dernière modification réelle du fichier date bien du **2026-06-03** : c'est le schema qui disait vrai et la byline qui était périmée. Byline alignée sur `2026-06-03`, hero `« Mai 2026 » → « Juin 2026 »`. **Pas de bump à la date du jour** : corriger une date affichée n'est pas une mise à jour de contenu, et une fraîcheur non méritée est un faux signal.

> **Décision assumée, 4ᵉ semaine consécutive** (W22, W28, W29, W30) : l'« auteur fictif + LinkedIn crédible » et la « mention presse fictive » suggérés par la consigne générique sont **écartés**. Même classe de faux signal que l'`aggregateRating` retiré en W28/W29 → risque d'action manuelle Google, et violation de la règle no-mock-data. Le dépôt a d'ailleurs déjà tranché dans ce sens (`ebc742f` : remplacement d'un nom propre par « La rédaction RestauMargin »). L'entité `Organization` réelle, datée et sourcée est un signal Trust durable ; un faux profil est une dette.

## 5. Plan semaine 31 (2026-07-27 → 08-02)

0. **🔴 Préalable (propriétaire)** — comprendre pourquoi **aucun agent n'a tourné du 20 au 23**. Sans ordonnanceur, le reste du plan est théorique.
1. **Lun 28/07** — Article PAA non couvert (jamais fait en W30). Croiser l'existant avant d'écrire : `ls client/src/pages/Blog*.tsx` + backlog (piège doublon documenté).
2. **Mar 29/07** — **Attaquer le trou `food cost`** : la page est complète (3950 mots, HowTo, snippet, sources) et reste absente → le problème **n'est pas le contenu on-page**. Analyser ce que Restopilot/Coopeo ont en plus (maillage entrant, fraîcheur, backlinks) plutôt que rallonger l'article.
3. **Mer 30/07** — Audit positions + **confirmer la tenue du #1 coefficient** (gain à consolider, pas à tenir pour acquis).
4. **Jeu 31/07** — Compléter la **byline `updatedDate` sur les 19 pages** qui l'ont perdue (suite directe de l'EAT d'aujourd'hui), en alignant chaque date sur `git log` — jamais sur la date du jour.
5. **Ven 01/08** — Sitemap fresh + audit Googlebot 10 titres + **re-vérifier `/blog/reprise-restaurant-guide-acheteur` en prod** (title propre + JSON-LD Article présents après ce déploiement).
6. **Sam 02/08** — CWV : precache 640 KiB, viser le LCP réel.
7. **Dim 03/08** — Review W31 + EAT.

## 6. Risques / à surveiller

- **🔴 Ordonnanceur muet 4 jours** (20→23) — risque n°1 de la semaine, hors périmètre de l'agent.
- **🔴 Dette type-safety, 2ᵉ récidive en 2 semaines** — `build:vercel` sans `tsc` laisse passer des pages cassées. **Recommandation concrète** : ajouter `tsc --noEmit` au `buildCommand` Vercel ou en pre-commit. Deux articles ont déjà été publiés cassés (W29, W30) ; sans garde-fou il y en aura un troisième.
- **Un agent qui crée une page ne synchronise pas `prerender.cjs`** — l'audit `comm -23 sitemap prerender` doit rester dans **chaque** run SEO. Il a rapporté une page ce dimanche.
- **Plan basé sur des hypothèses non vérifiées** — le « carry-over food cost » a été reporté 2 semaines alors qu'il était déjà livré. Vérifier l'état réel du fichier avant de reconduire une tâche.
- **Bing IndexNow 403** (≥ 07-19) — `restaumargin.fr` à revendiquer dans Bing Webmaster Tools (action propriétaire, non automatisable).
- **Ne jamais réintroduire** aggregateRating / faux avis / auteur fictif.

---
*Généré par l'agent SEO Daily Push — dimanche 2026-07-26.*
