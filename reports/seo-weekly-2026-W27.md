# SEO Weekly Review — Semaine 27 (2026-06-29 → 2026-07-05)

> Première review hebdo depuis la W22 (le fichier `seo-weekly` avait sauté W23→W26).
> Rotation quotidienne toujours active (dailies 07-03 / 07-04 / 07-05 présents).

## 1. Volume d'activité SEO

- **25 commits** sur `main` cette semaine (repo multi-agents : SEO push + agents quotidiens CTO/CFO/CMO/COO/CEO/QA/onboarder + feature Factures).
- **Commits SEO/perf dédiés cette semaine : 3 jours actifs**
  | Jour | Commit | Action |
  |---|---|---|
  | Ven 07-03 | `9cc7e7f` | `seo(freshness)` — sitemap lastmod 10 pages clés + hub priority 0.8→**0.95** + audit rich snippets |
  | Sam 07-04 | `f909a5d` | `perf(seo)` — lazy-load 10 overlays app-shell hors chunk `index` critique |
  | Dim 07-05 | *(ce run)* | `seo(weekly+eat)` — review W27 + section Sources & références sur le hub |
- **Deploy Vercel** : dernier prod `7cbc9b9` → **READY**. Aucun `ERROR` bloquant cette semaine (1 seul `CANCELED` sans impact, remplacé par le deploy suivant).
- **Build local** : `vite build` OK (15,8 s), 0 erreur TS, 10 entrées précache (883 KiB).

### Fait technique marquant de la semaine
`perf(seo)` du samedi : le chunk `index` chargé par **toutes** les pages SEO est passé de **133,4 → 112,4 KB gzip (−15,7 %)** en sortant 10 composants d'app-shell (rendus seulement en zone authentifiée) du chemin critique. Gain FCP/LCP/TBT sur landing, `/blog/*`, `/pricing`, comparatifs et niches → meilleur Core Web Vitals.

## 2. Positions Google (vérifié WebSearch 2026-07-05)

> ⚠️ WebSearch biaisé US — à recouper avec Search Console pour le ranking google.fr exact.
> Pas de point de comparaison "lundi" cette semaine (aucun audit positions lundi ; dernier audit daté = 2026-05-27).

| Query | Statut W27 | Lecture |
|---|---|---|
| `marge restaurant … coefficient multiplicateur` | **Hub #2** (derrière Coopeo #1) + page outil `/outils/calculateur-marge-restaurant` présente | Excellente position sur la longue traîne composée |
| `calcul marge restaurant comment calculer` | **Absent du top 10** — Coopeo #1, Zenchef #5, hr-associes / sumup / lhotellerie… | Trou sur la tête de requête « nue » : cible prioritaire |
| Branded `restaumargin` | #1 | OK |

**Cible n°1 confirmée : Coopeo** (`coopeo.fr/restauration/calcul-marge-restaurant/`) truste le #1 sur la requête tête `calcul marge restaurant`. Le hub RestauMargin gagne sur les variantes riches mais doit percer sur la formulation courte la plus recherchée.

## 3. Action EAT du dimanche (réalisée)

**Section « Sources & références » ajoutée au hub** `/blog/calcul-marge-restaurant` (page #2, la plus stratégique) — signal **Trust (E-E-A-T)** véridique, **sans fabrication** (cohérent avec la décision W22 de ne pas inventer d'auteur/LinkedIn fictif).

- `client/src/pages/BlogCalcMarge.tsx` : nouvelle section `<section aria-labelledby="sources-references">` avec **4 sources autoritatives vérifiées** (liens sortants `rel="noopener noreferrer"`, URLs contrôlées ce jour) :
  - **economie.gouv.fr** — page officielle des taux de TVA (5,5 / 10 / 20 %)
  - **INSEE** — statistiques restauration & démographie d'entreprises
  - **UMIH** — usages et ratios du secteur CHR
  - **L'Hôtellerie-Restauration** — presse professionnelle de référence
  - + renvoi vers `/a-propos` (méthodologie éditoriale, responsable de publication).
- **Freshness** : `dateModified` du schema Article `2026-06-02 → 2026-07-05` ; `updatedDate="2026-07-05"` passé à `BlogAuthor` (header + footer) → signal « Mis à jour le » visible + `dateModified` structuré.
- `sitemap.xml` : lastmod hub `2026-07-03 → 2026-07-05`.

> Citer des sources primaires officielles est un signal Trust documenté (helpful content / Core Update mars 2026) et durable, contrairement à une mention presse fabriquée.

## 4. Plan semaine 28 (7 actions)

1. **Lundi 07-06** — Article PAA non couvert. Candidats à vérifier : « Quel salaire se verser en tant que gérant de restaurant ? » (croiser avec `BlogSalaireProprietaire` existant), « Comment calculer le seuil de rentabilité d'un restaurant ? », ou « Combien de couverts par jour pour être rentable ? ».
2. **Mardi 07-07** — Boost ciblé **`calcul marge restaurant` (tête de requête)** : renforcer le hub avec une intro « featured snippet » de 40-60 mots répondant littéralement à « comment calculer la marge d'un restaurant » + un `HowTo` schema étape-par-étape, pour attaquer Coopeo sur la formulation courte.
3. **Mercredi 07-08** — Audit positions + analyse **Coopeo** au crible (structure H2, longueur, schema, densité internal link) → lister 3 leviers pour le dépasser sur la tête de requête. Créer `reports/seo-audit-2026-07-08.md`.
4. **Jeudi 07-09** — Nouvelle page niche/comparatif non couverte : **pâtisserie** ou **traiteur healthy/bowl**, OU comparatif **Tiller** / **Sunday** / **L'Addition**.
5. **Vendredi 07-10** — Sitemap fresh + audit Googlebot des 10 pages stratégiques (titles uniques servis en prod via prerender) + check rich results sur le hub (nouveau schema).
6. **Samedi 07-11** — Core Web Vitals : precache PWA à **883 KiB** — cibler lazy-load des images blog + `preload` de la font critique (Satoshi/General Sans) ; mesurer LCP.
7. **Dimanche 07-12** — Review W28 + EAT : enrichir une 2ᵉ page (coefficient ou food-cost) d'une section Sources vérifiées OU ajouter un `Article.author` Person si un auteur réel est validé par le propriétaire.

## 5. Risques / à surveiller

- **Search Console** : toujours pas d'accès pour mesurer les positions google.fr réelles → WebSearch US imprécis. À récupérer en priorité.
- **`LanguageToggle.tsx`** : ne pas toucher (bugs préexistants).
- **`ComparisonTable`** : warning `key` prop manquante sur `/pricing` (préexistant, flaggé, hors chemin SEO).
- **Régularité de la review hebdo** : W23→W26 manquantes — vérifier que la routine du dimanche produit bien le fichier chaque semaine.
- **Coopeo** : concurrent le plus solide sur la tête de requête — cible structurante des prochaines semaines.
