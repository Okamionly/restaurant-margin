# SEO Weekly Review — Semaine 22 (2026-05-25 → 2026-05-31)

## 1. Volume d'activité SEO

- **72 commits SEO** sur la semaine (préfixe `seo()` / `perf(seo)`).
- Deploy Vercel : **READY** (dernier prod `2263f8d`, aucun ERROR bloquant).
- Build local : OK (`vite build` 14.7s, prerender 104+ fichiers statiques).

### Répartition des actions
| Type | Détail |
|---|---|
| Nouveaux articles PAA | BlogRegle30303010, BlogSalaireProprietaire, Blog5RatiosCles, BlogPourquoiPasRentable, BlogPlatPlusRentable, BlogMargeBeneficiaire, mega-FAQ 25 questions, psychologie des prix |
| Pages niche/comparatif | Traiteur événementiel, Glacier/Salon de thé, Café Bar, Kebab Döner, Burger, Crêperie, Sushi, Food Truck, Dark Kitchen, Bistrot, Boulangerie + Alternative Lightspeed / L'Addition / TheFork + mega-comparatif 12 outils + comparatif RestauMargin vs Zenchef |
| Boosts +1000-2000 mots | BlogCoefficient, BlogFoodCost, BlogPrimeCost, BlogCarteVins, BlogChiffreAffaires, BlogRotationStocks, ~30 articles portés à 3000+ mots |
| Technique SSG | Contenu statique unique par route injecté dans le HTML prérendu, BreadcrumbList sur 91 routes, fix H1 homepage, glossaire 50+ termes |
| Freshness | sitemap lastmod bumps, fix 3 titles génériques (prerender), audit Googlebot |

## 2. Positions Google (vs audit mercredi 2026-05-27)

> Vérifié via WebSearch (US-biaisé — à recouper avec Search Console pour le ranking google.fr exact).

| Query | Statut W22 | Évolution |
|---|---|---|
| `marge restaurant calcul food cost 2026` | **#1** (hub) | maintenu |
| `calcul marge restaurant` | Hub présent (top résultats fr filtrés) | regagne en visibilité après les boosts (avait perdu le #5 le 26/05) |
| `coefficient multiplicateur restaurant` | BlogCoefficient présent (top 3 fr filtrés) | progression après boost +1800 mots |
| `food cost restaurant` | faible (query EN-dominée) | inchangé — faible potentiel FR |
| `logiciel marge restaurant` | hors top 10 | commercial intent très concurrentiel — pages niche en cours d'indexation |
| Branded `restaumargin` | #1 | OK |

**Lecture** : le hub `/blog/calcul-marge-restaurant` est solidement #1 sur la longue traîne et remonte sur les têtes de requête. Le chantier restant = grimper sur `calcul marge restaurant` et `coefficient multiplicateur restaurant` (faible compétition, gain réaliste top 5).

## 3. Action EAT du dimanche (réalisée)

**Renforcement E-E-A-T sans fabrication** (choix assumé — voir note ci-dessous) :
- `client/src/components/BlogAuthor.tsx` : bio footer enrichie (badges expertise food cost / fiches techniques / marges / HACCP, ancienneté « publie depuis 2025 », localisation Montpellier, mention méthodologie + relecture), + **schema Organization** complet (`foundingDate`, `knowsAbout` 7 sujets, `sameAs`).
- `client/src/pages/APropos.tsx` : nouvelle section **« Notre méthodologie éditoriale »** (4 piliers : données réelles / sources vérifiées / relecture & MAJ / expertise métier) + bloc **« Responsable de la publication »** + **schema `publishingPrinciples`** (signal E-E-A-T explicitement recherché par Google depuis le Core Update mars 2026).
- `sitemap.xml` : lastmod `/a-propos` → 2026-05-31.

> **Note de décision (run autonome)** : la rotation suggérait un « author bio fictif avec LinkedIn fictif ». Choix délibéré de **ne pas fabriquer** de personne ni d'URL LinkedIn inexistante : les spam policies Google pénalisent l'autorité fabriquée et un lien LinkedIn mort est un signal de confiance négatif. L'enrichissement repose donc sur des signaux véridiques (méthodologie, expertise, responsable de publication, localisation) — plus durable pour le ranking.

## 4. Plan semaine 23 (7 actions)

1. **Lundi** — Nouvel article PAA : « Quel est le ratio de charges idéal pour un restaurant ? » ou « Comment fixer le prix d'un menu » (vérifier non-couvert).
2. **Mardi** — Boost ciblé `BlogCoefficient` / `BlogFoodCost` : ajouter section « cas concret chiffré » + 5 internal links vers pages niche pour pousser sur `coefficient multiplicateur restaurant`.
3. **Mercredi** — Audit positions + analyse Zenchef/Coopeo (Coopeo ranke fort sur `calcul marge restaurant`, l'étudier comme cible #1).
4. **Jeudi** — Nouvelle page niche : pâtisserie OU traiteur healthy/bowl, OU comparatif Tiller/Sunday.
5. **Vendredi** — Sitemap fresh + ping + audit Googlebot des 10 pages stratégiques (vérifier titles uniques en prod).
6. **Samedi** — Core Web Vitals : analyser le bundle (993 KiB précache), lazy-load images blog + preload font critique.
7. **Dimanche** — Review W23 + EAT : enrichir une page niche avec témoignage chiffré véridique OU ajouter `Article.author` Person au hub si un auteur réel est validé par le propriétaire.

## 5. Risques / à surveiller
- `LanguageToggle.tsx` : ne pas toucher (bugs préexistants).
- Search Console : récupérer l'accès pour mesurer les positions google.fr réelles (WebSearch US est imprécis).
- Densité internal links vs Coopeo/Zenchef : continuer à tisser.
