# SEO Writer — 2026-04-28

## Niche ajoutée : `burger-restaurant`

**URL** : `/guide-marge/burger-restaurant`

## Rationale

- Volume de recherche élevé : "marge burger restaurant", "food cost hamburger", "rentabilité burger" représentent des milliers de requêtes mensuelles en France
- Niche distincte avec une structure de food cost spécifique (viande hachée volatile, bun, sauces) qui justifie un contenu dédié
- Problématique livraison (Uber Eats / Deliveroo) très cherchée par les restaurateurs — angle différenciant par rapport aux autres niches
- Format dark kitchen / smash burger en forte croissance depuis 2022 — longue traîne pertinente
- Aucune concurrence directe sur "calcul marge burger restaurant" avec contenu structured data FAQ

## Modifications

| Fichier | Modification |
|---------|-------------|
| `client/src/pages/NicheLanding.tsx` | Ajout config `burger-restaurant` dans `NICHES` (slug, title, h1, tagline, description, heroSubtitle, avgMargin, avgFoodCost, avgCoef, challenges x5, stats x4, testimonial, faqs x4) |
| `client/public/sitemap.xml` | Ajout `<url>` pour `/guide-marge/burger-restaurant` avec lastmod 2026-04-28, priority 0.8 |
| `client/scripts/prerender.cjs` | Ajout entrée prerender avec title + description SEO |

## KPIs cibles

- `avgMargin` : 65-72%
- `avgFoodCost` : 28-35%
- `avgCoef` : 3 à 3,8
- Ticket moyen : 14-20€

## Prochaines niches suggérées

1. `boulangerie-patisserie` — très forte demande, food cost spécifique (farine, beurre, levain)
2. `sushi-restaurant` — niche premium croissante, thon/saumon/riz = food cost complexe
3. `dark-kitchen` — format 100% livraison, angle commission plateforme
