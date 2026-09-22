# SEO Writer — 2026-09-22

## Niche ajoutee

**Slug** : `restaurant-seminaire-groupe`
**URL** : `/guide-marge/restaurant-seminaire-groupe`

## Rationale

Toutes les niches de la liste initiale etaient deja couvertes sauf deux :
- `restaurant-seminaire-groupe`
- `restaurant-scolaire`

`restaurant-seminaire-groupe` a ete choisie en priorite car :
- Volume de recherche eleve : les mots-cles "restaurant seminaire", "salle groupe restaurant", "menu groupe restaurant", "tarif groupe restaurant" representent un fort potentiel organique
- Segment a fort ticket moyen (35-75€/convive) = audience avec un vrai budget logiciel
- Problematique marge specifique (devis perdants, boissons a volonte, gaspillage en volume) qui justifie un contenu evergreen a haute valeur ajoutee
- Segment peu couvert sur le marche logiciel restauration — differenciateur SEO fort

## Fichiers modifies

- `client/src/pages/NicheLanding.tsx` — ajout config `restaurant-seminaire-groupe` (slug, h1, tagline, description, avgMargin 65-74%, avgFoodCost 26-35%, avgCoef 3.5-4.5, 5 challenges, 4 stats, testimonial, 4 FAQ substantielles)
- `client/public/sitemap.xml` — ajout URL avec lastmod 2026-09-22, priority 0.8
- `client/scripts/prerender.cjs` — ajout entree avec title + description

## Verifications

- TypeScript : erreurs pre-existantes uniquement (modules non installes en CI), aucune erreur specifique au nouveau code
- Structure NicheConfig respectee integralement
- Contenu SEO evergreen, francais, sans IA-washing

## Prochaine niche disponible

`restaurant-scolaire` (cantines scolaires avec gestion portion, allergenes, commandes institutionnelles)
