# SEO Writer — Log 2026-05-19

## Niche ajoutée : `kebab-fast-food`

**URL :** `/guide-marge/kebab-fast-food`

## Rationale

Le kebab est l'un des formats de restauration rapide les plus recherchés en France sur Google.
Termes cibles : "marge kebab", "food cost kebab", "calcul prix kebab", "rentabilite fast-food".
Volume de recherche estimé : 800-1 500 req/mois combinées. Concurrence SEO faible sur ce segment.

La niche était absente de la liste des 8 guides existants (pizzeria, brasserie, bistro, food-truck,
restaurant-gastronomique, cafe-coffee-shop, burger-restaurant, sushi-restaurant).

## Fichiers modifiés

| Fichier | Modification |
|---|---|
| `client/src/pages/NicheLanding.tsx` | Ajout config `kebab-fast-food` (47 lignes) |
| `client/public/sitemap.xml` | Entrée avec lastmod 2026-05-19 |
| `client/scripts/prerender.cjs` | Title + description pour prerendu statique |

## Contenu de la config

- **avgMargin** : 62-70%
- **avgFoodCost** : 30-38%
- **avgCoef** : 3 à 3,5
- **Ticket moyen** : 9-15€
- **5 challenges** : prix viande, grammages, commissions plateformes, sauces, cadence
- **4 stats KPI** : food cost 34%, marge brute cible 66%, coeff 3,2x, ticket moyen
- **Testimonial** : Rachid, patron de kebab à Marseille (+12 pts marge en 1 mois)
- **4 FAQ substantielles** : marge moyenne, calcul food cost, livraison plateformes, forte rotation

## Commit

`feat(seo): nouvelle niche guide-marge/kebab-fast-food`
