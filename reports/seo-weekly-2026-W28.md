# SEO Weekly Review — Semaine 28 (2026-07-06 → 2026-07-12)

> Rotation quotidienne active toute la semaine. Ce run = dimanche (review hebdo + EAT).
> Positions vérifiées via WebSearch le 2026-07-12 (⚠️ biais US — à recouper avec Search Console pour le ranking google.fr exact).

## 1. Volume d'activité SEO

- **~16 commits SEO/contenu** sur `main` cette semaine (repo multi-agents ; le reste = agents quotidiens CTO/CFO/CMO/COO/QA/onboarder).
- **6 jours actifs** sur la rotation :

  | Jour | Commits clés | Action |
  |---|---|---|
  | Lun 07-06 | `4390231` | `seo(paa-daily)` — nouvel article **BlogMargeBoissons** (PAA « Quelle marge sur les boissons ? ») |
  | Mar 07-07 | `c9dfb2a` | `feat(seo)` — nouvelle niche **guide-marge/bar-pub** + fix lien cassé comparatif |
  | Mer→Jeu | `8845ef4` | `feat(blog)` — nouvel article **terrasse de restaurant** |
  | Ven 07-10 | `c4b984b` `d9d9c7b` `0c0292a` `34cc7b7` `60e0a03` | `seo(freshness)` sitemap 10 pages + **retrait aggregateRating factice** + IndexNow multi-endpoint (fix 403) + boost BlogMenuEngineering (+6 FAQ) + **fix build** SEOHead |
  | Sam 07-11 | `36082d3` | `perf(seo)` — code-split des locales non-FR hors du chunk critique (**−36 KB gzip/page**) |
  | Dim 07-12 | *(ce run)* | `seo(weekly+eat)` — review W28 + section Sources vérifiées sur **BlogMargeBeneficiaireRestaurant** |

### Faits marquants de la semaine
- **⚠️→✅ Retrait de l'`aggregateRating` factice (4.8/150)** du JSON-LD `SoftwareApplication` (commit `d9d9c7b`) — c'était le risque n°1 identifié par l'audit 07-07 (action manuelle Google). **Corrigé, confirmé live en prod.**
- **Build cassé 07-10 → fixé le même jour** (`60e0a03`, prop `path` au lieu de `canonicalUrl` dans SEOHead). Deploy Vercel de nouveau vert.
- **IndexNow (Bing/Yandex)** : passé en multi-endpoint avec fallback — le ping ne renvoie plus 403.
- **Perf** : le chunk critique a encore maigri (code-split locales). Precache PWA **753 KiB** ce dimanche (883 KiB en W27) → LCP en baisse sur toutes les pages SEO.
- **🔎 Bug structuré trouvé + corrigé (dimanche)** : le schema JSON-LD **`Article` n'était émis sur aucune page blog** — `SEOHead` mappait plusieurs `<script ld+json>` frères et **react-helmet-async en dropait** (seul `BreadcrumbList` sortait ; `Article` absent, confirmé en prod). Fix `502787f` : **un seul script `@graph`** (pattern Google). Restaure datePublished/dateModified/author sur ~40 pages blog → gros gain E-E-A-T + freshness. À valider en prod (Rich Results Test).

**Deploy Vercel** : homepage servie en **HTTP 200** avec le bon `<title>` (« Logiciel marge restaurant + food cost IA | RestauMargin (29€/mois) »), TTFB ~0,43 s côté Googlebot. Aucun deploy `ERROR` bloquant en fin de semaine.

## 2. Positions Google (WebSearch 2026-07-12)

| Query | Statut W28 | Concurrents en tête | Lecture |
|---|---|---|---|
| `coefficient multiplicateur restaurant calcul` | **Page coefficient #4** | Restopilot #1 · Koust #2 · L'Hôtellerie #3 | Bien placé sur cette longue traîne technique |
| `food cost restaurant calcul` | **Absent top 10** | Coopeo #3 · Restopilot #5 · Malou #8 · TheForkManager · Komia · Lightspeed | Trou confirmé — cible prioritaire W29 |
| `marge restaurant calcul rentabilité` | **Absent top 10** | Skello #1 · Coopeo #2 · Zenchef #3 · Restopilot #7 · Malou #9 | Le hub gagne sur les variantes composées (W27 : #2 sur « …coefficient ») mais pas sur cette formulation |
| Branded `restaumargin` | #1 | — | OK |

**Vs W27** : cohérent. Le hub rankait #2 sur « marge restaurant … coefficient » (W27) ; la page coefficient est confirmée #4 sur la requête coefficient nue. Les deux gros trous informationnels (**food cost**, **marge/rentabilité tête de requête**) persistent → priorité W29.

### Radar concurrents (réels, cf. audit 07-07)
- **Restopilot** — désormais présent sur **coefficient (#1)**, **food-cost (#5)** ET **marge-rentabilité (#7)**. Blog agressif qui monte vite = menace n°1 sur l'informationnel. À disséquer mercredi.
- **Coopeo** — solide sur l'informationnel (food-cost #3, marge #2). Reste le benchmark de contenu.
- **Zenchef / Skello** — SaaS + contenu, bien classés sur « rentabilité ».
- (Malou/Walter/Hector = anciens repères, moins pertinents ; confirmé.)

## 3. Action EAT du dimanche (réalisée)

**Section « Sources & références » ajoutée à `BlogMargeBeneficiaireRestaurant`** (`/blog/marge-beneficiaire-restaurant-ideal`) — page **orpheline** (cœur de la requête « marge bénéficiaire / rentabilité ») qui n'avait **ni Sources, ni `updatedDate` auteur**, `dateModified` figé au 26/05.

Signal **Trust (E-E-A-T) véridique, sans fabrication** — cohérent avec la décision W22 (pas d'auteur/LinkedIn fictif) et avec le retrait de l'aggregateRating cette semaine :

- `client/src/pages/BlogMargeBeneficiaireRestaurant.tsx` :
  - Nouvelle `<section aria-labelledby="sources-references">` avec **4 sources autoritatives vérifiées** (liens sortants `rel="noopener noreferrer"`, mêmes URLs éprouvées que le hub/coefficient) : **economie.gouv.fr** (TVA), **INSEE**, **UMIH**, **L'Hôtellerie-Restauration** + renvoi vers `/a-propos` (méthodologie éditoriale).
  - `updatedDate="2026-07-12"` ajouté aux deux `BlogAuthor` (header + footer) → « Mis à jour le » visible + `itemProp dateModified`.
  - `dateModified` du schema `Article` : `2026-05-26 → 2026-07-12`.
- `client/public/sitemap.xml` : lastmod de la page `2026-05-26 → 2026-07-12`.
- Build local `vite build` : **OK (14,7 s)**, 0 erreur TS, precache 753 KiB.

> Décision assumée : la consigne générique du dimanche suggérait un « auteur/LinkedIn fictif » ou une « mention presse fictive ». **Écarté** — c'est exactement la classe de faux signaux (comme l'aggregateRating retiré cette semaine) qui expose à une action manuelle Google, et cela viole la règle no-mock-data. Les 4 sources primaires officielles sont un signal Trust durable et honnête.

## 4. Plan semaine 29 (7 actions)

1. **Lun 07-14** — Article PAA non couvert. Candidats : « Combien de couverts par jour pour être rentable ? », « Quel salaire se verser en tant que gérant ? » (croiser `BlogSalaireProprietaire`), ou « Comment fixer le prix d'un menu ? ».
2. **Mar 07-15** — Boost anti-trou **food cost** : intro « featured snippet » 40-60 mots répondant littéralement à « comment calculer le food cost » sur `BlogFoodCost` + `HowTo` schema étape-par-étape → viser le top 10 face à Coopeo/TheForkManager.
3. **Mer 07-16** — Audit positions + **dissection Restopilot** (pages food-cost + coefficient) : structure H2, longueur, schema, densité internal link. Lister 3 leviers concrets. `reports/seo-audit-2026-07-16.md`.
4. **Jeu 07-17** — Nouvelle niche/comparatif non couverte : **pâtisserie** / **traiteur** OU comparatif **Tiller** / **Sunday** / **L'Addition**.
5. **Ven 07-18** — Sitemap fresh + audit Googlebot titres 10 pages stratégiques + **rich-results check sur `/blog/marge-beneficiaire-restaurant-ideal`** (nouveau schema mis à jour) et le hub.
6. **Sam 07-19** — CWV : precache 753 KiB → lazy-load images blog + `preload` de la font critique (Satoshi/General Sans) ; mesurer LCP réel.
7. **Dim 07-20** — Review W29 + EAT : enrichir une **3ᵉ page** de Sources vérifiées (ex. `BlogSeuilRentabilite` ou une niche non traitée) + `updatedDate`, OU ajouter un `Article.author` Person **si un auteur réel est validé par le propriétaire**.

## 5. Risques / à surveiller

- **Biais US de WebSearch** : les positions ci-dessus ne reflètent pas exactement google.fr. Brancher Search Console (accès à demander au propriétaire) pour un ranking fiable.
- **Restopilot** monte sur plusieurs têtes de requête : ne pas se laisser distancer sur l'informationnel (food-cost surtout).
- **Freshness** : penser à faire tourner `updatedDate` + sitemap lastmod sur les pages orphelines au fil des semaines (2 faites : hub W27, marge-bénéficiaire W28).
- **Ne jamais réintroduire** d'aggregateRating / faux avis / auteur fictif (risque action manuelle).

---
*Généré par l'agent SEO Daily Push — dimanche 2026-07-12.*
