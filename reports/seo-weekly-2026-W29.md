# SEO Weekly Review — Semaine 29 (2026-07-13 → 2026-07-19)

> Rotation quotidienne active toute la semaine. Ce run = dimanche (review hebdo + plan W30 + EAT + fix build).
> Positions vérifiées via WebSearch le 2026-07-19 (⚠️ biais US de WebSearch — à recouper avec Search Console pour le ranking google.fr exact).

## 1. Volume d'activité SEO

- **11 commits SEO/contenu** sur `main` cette semaine (repo multi-agents ; ~70 commits tous agents confondus — CTO/CFO/CMO/COO/QA/onboarder quotidiens).
- Rotation active sur 5 jours :

  | Jour | Commits clés | Action |
  |---|---|---|
  | Lun 07-13 | `3602b20` `55a1a7d` | `seo(paa-daily)` — nouvel article **BlogTauxMarque** (PAA « taux de marque ou taux de marge ») |
  | Mer 07-16 | `20b3471` `a21b167` `2ac0037` | `seo(niche)` **LogicielMargeIndien** + **retrait aggregateRating factice sur 23 pages** (résidu) |
  | Jeu 07-17 | `5915b02` `e544b10` `b2a8a3d` | **🔧 seo(maillage) — 76 liens internes morts réparés + 7 pages rendues visibles à Google** + prerender negocier-fournisseurs |
  | Ven 07-18 | `a4e539d` `c065e42` `5081205` | `perf(seo)` — Login (+ i18n) sorti du chunk `index` critique → **−46 % JS** sur les pages SEO |
  | Dim 07-19 | *(ce run)* | **fix build regression** BlogNegocierFournisseurs + `seo(weekly+eat)` review W29 + Sources sur BlogSeuilRentabilite |

### Faits marquants de la semaine

- **🏆 Maillage interne réparé (`5915b02`, jeu 07-17)** — **76 liens internes morts** corrigés + **7 pages devenues visibles à Google**. C'est le plus gros gain structurel de la semaine : il s'attaque directement au piège « SPA = liens internes morts invisibles » (soft-404 renvoyant 200 + title accueil). Priorité qui a légitimement fait glisser 2 tâches planifiées (voir §4).
- **✅ aggregateRating factice éliminé à 100 % (`a21b167`)** — 23 pages résiduelles nettoyées. W28 avait retiré le rating du schema global `SoftwareApplication` ; cette semaine a chassé les 23 dernières occurrences. **Risque d'action manuelle Google désormais nul.**
- **⚡ Perf −46 % JS critique (`a4e539d`)** — `Login` (+ hook `useTranslation` ~99 kB + fond WebGL) était importé *eagerly* dans le chunk `index` que chaque page SEO télécharge avant le first paint. Passé en lazy → chunk `index` 282 → 161 kB (gzip 75,7 → 41 kB). Precache PWA **638 KiB ce dimanche** (753 KiB en W28) → LCP encore en baisse.
- **📝 Nouveau contenu** : BlogTauxMarque (PAA taux de marque/marge) + LogicielMargeIndien (niche cuisine indienne).
- **🔧 Fix build regression (ce run, dim 07-19)** — 3 erreurs TS dans `BlogNegocierFournisseurs.tsx` (introduites `20d756a`, 07-17). La page est **live, routée et dans le sitemap** — mais les mauvais props (`schemas` au lieu de `schema`, `canonical` au lieu de `path`, `icon` inexistant, `<BlogAuthor/>` sans dates) faisaient qu'elle **n'émettait AUCUN JSON-LD Article/FAQPage** (confirmé : `"@type":"Article"` absent du HTML live) et affichait une signature auteur cassée. `vite build` (esbuild, sans type-check) laissait passer ; seul le `tsc` de QA échouait. **Corrigé** → restaure Article + FAQPage + BreadcrumbList (`@graph`) et les dates auteur sur une page indexée.

**Deploy Vercel** : dernier deploy prod `8729e5b` en **READY** (aucun `ERROR` bloquant de la semaine — le build regression ne cassait pas Vercel car `build:vercel` = `vite build` sans `tsc`). Homepage servie HTTP 200.

## 2. Positions Google (WebSearch 2026-07-19)

| Query | Statut W29 | Δ vs W28 | Concurrents en tête |
|---|---|---|---|
| `coefficient multiplicateur restaurant calcul` | **Page coefficient #6** | 🔻 **#4 → #6** | Restopilot #1 · Koust #2 · L'Hôtellerie #3 · **Resthodev #4 (nouveau)** · **Comptable-restaurant #5 (nouveau)** · RestauMargin #6 |
| `marge restaurant calcul rentabilité` | **Absent top 10** | = | Coopeo #1 · Zenchef #2 · Skello #3 · Asendens #4 · … · Restopilot #9 |
| `food cost restaurant calcul` | **Absent** (SERP US only) | n/a | SERP 100 % US (gfs, opentable, lightspeed…) — page FR non captée par WebSearch US |
| Branded `restaumargin` | #1 | = | — |

**Lecture** : régression à surveiller sur **coefficient** — la page passe #4 → #6, doublée par deux nouveaux entrants (Resthodev, Comptable-restaurant). Les deux gros trous informationnels (**food cost**, **marge/rentabilité tête de requête**) **persistent** → restent prioritaires W30. Caveat : volatilité SERP + biais US de WebSearch ; à confirmer en Search Console.

### Radar concurrents (réels, cf. audit 07-07)
- **Restopilot** — toujours #1 sur coefficient, présent sur food-cost et marge-rentabilité. Menace n°1 sur l'informationnel, blog agressif.
- **Coopeo** — #1 sur « marge restaurant calcul rentabilité ». Benchmark de contenu.
- **Zenchef / Skello** — SaaS + contenu, #2/#3 sur rentabilité.
- **Nouveaux sur coefficient** : Resthodev + Comptable-restaurant (expert-comptable) — contenu technique de niche qui nous a doublés.

## 3. Action EAT du dimanche (réalisée)

**Section « Sources & références » ajoutée à `BlogSeuilRentabilite`** (`/blog/seuil-rentabilite-restaurant`) — page **routée mais au `dateModified` gelé au 26/05** (8 semaines de retard) et **sans aucune source citée**. C'est la **3ᵉ page** enrichie de cette manière (hub W27, marge-bénéficiaire W28, seuil-rentabilité W29).

Signal **Trust (E-E-A-T) véridique, sans fabrication** — même politique que le retrait de l'aggregateRating :

- `client/src/pages/BlogSeuilRentabilite.tsx` :
  - `<section aria-labelledby="sources-references">` avec **4 sources autoritatives vérifiées** (liens sortants `rel="noopener noreferrer"`) : **economie.gouv.fr** (TVA/CA HT), **INSEE** (défaillances/point mort), **UMIH** (ratios CHR), **L'Hôtellerie-Restauration** (presse pro) + renvoi `/a-propos` (méthodologie).
  - `updatedDate` header + footer : `2026-05-26 → 2026-07-19` (« Mis à jour le » visible + `itemProp dateModified`).
  - `dateModified` du schema `Article` : `2026-05-26 → 2026-07-19`.
- `client/public/sitemap.xml` : lastmod seuil `2026-07-17 → 2026-07-19` (page réellement modifiée aujourd'hui → lastmod légitime).
- Build : `tsc --noEmit` **0 erreur**, `vite build` **OK (15,5 s)**, precache 638 KiB.

> Décision assumée (comme W22/W28) : **écarté** l'« auteur/LinkedIn fictif » ou la « mention presse fictive » suggérés par la consigne générique — même classe de faux signaux que l'aggregateRating retiré (risque action manuelle, viole no-mock-data). Les 4 sources primaires officielles sont un signal Trust durable et honnête.

## 4. Plan semaine 30 (2026-07-20 → 07-26) — 7 actions

1. **Lun 07-20** — Article PAA non couvert. Candidats : « Combien de couverts par jour pour être rentable ? », « Comment fixer le prix d'un plat au restaurant ? », ou « Quel budget pour ouvrir un restaurant ? » (croiser l'existant).
2. **Mar 07-21** — **Boost food cost (CARRY-OVER prioritaire, non fait W29)** : intro featured-snippet 40-60 mots répondant littéralement à « comment calculer le food cost » sur `BlogFoodCost` + schema `HowTo` étape-par-étape → viser le top 10 FR face à Coopeo/Restopilot. **Trou informationnel n°1.**
3. **Mer 07-22** — Audit positions + **dissection Resthodev + Comptable-restaurant** (les 2 qui nous ont doublés sur coefficient #4→#6) : structure H2, longueur, schema, densité internal link. Lister 3 leviers pour **récupérer la position coefficient**. `reports/seo-audit-2026-07-22.md`.
4. **Jeu 07-23** — **Étendre `BlogNegocierFournisseurs` à 2500+ mots** (actuellement ~1500, sous le plancher ; déjà routée + prerender + sitemap + build réparé aujourd'hui) → passe-la au-dessus du seuil anti-thin. OU nouvelle niche **pâtisserie / traiteur**.
5. **Ven 07-24** — Sitemap fresh + audit Googlebot titres 10 pages + **rich-results check sur `/blog/negocier-fournisseurs-restaurant` (schema Article/FAQ restauré aujourd'hui) et `/blog/seuil-rentabilite-restaurant` (dates + Sources)**.
6. **Sam 07-25** — CWV : precache 638 KiB → lazy-load images blog + `preload` font critique (Satoshi / General Sans) ; mesurer LCP réel.
7. **Dim 07-26** — Review W30 + EAT : **4ᵉ page** de Sources vérifiées (candidats : `BlogCoefficient` — la page qui glisse — ou `BlogFoodCost`) + `updatedDate`.

## 5. Risques / à surveiller

- **🔻 Régression coefficient (#4 → #6)** — deux experts-comptables nous ont doublés. Ne pas laisser filer : c'était notre seul top-10 informationnel. Action Mercredi W30.
- **Trous food-cost + marge-rentabilité tête de requête** persistent depuis 3 semaines → le boost food-cost (Mardi) est repoussé depuis W29, à ne plus repousser.
- **Biais US de WebSearch** : positions non exactement google.fr. Brancher **Search Console** (accès propriétaire à demander) pour un ranking fiable.
- **Dette build type-safety** : `build:vercel` ne lance pas `tsc` → un composant peut shipper cassé (comme negocier cette semaine). Envisager un `tsc --noEmit` en pre-commit ou CI (à proposer au propriétaire).
- **Ne jamais réintroduire** aggregateRating / faux avis / auteur fictif.

---
*Généré par l'agent SEO Daily Push — dimanche 2026-07-19.*
