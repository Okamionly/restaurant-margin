# SEO Writer — Log 2026-09-08

## Niche ajoutée : `restaurant-halal`

### URL cible
`/guide-marge/restaurant-halal`

### Rationale
- **Marché significatif** : 5,7 millions de consommateurs halal en France, segment en croissance de +8% par an
- **Non couvert** : toutes les niches de la liste initiale étaient traitées sauf restaurant-halal, restaurant-seminaire-groupe, restaurant-scolaire, bistro-gastronomique
- **Fort potentiel SEO** : requêtes long-tail peu compétitives ("marge restaurant halal", "food cost viande halal", "rentabilité kebab halal")
- **Défi spécifique documentable** : surcoût structurel de la viande halal certifiée (+15-25% vs standard) = problème réel de food cost non adressé ailleurs

### Métriques de la niche
- Marge brute moyenne : 62-72%
- Food cost moyen : 28-35%
- Coefficient multiplicateur type : 3,2 à 4
- Ticket moyen : 12-20€

### Fichiers modifiés
1. `client/src/pages/NicheLanding.tsx` — ajout config `restaurant-halal` (slug, h1, tagline, description, heroSubtitle, avgMargin, avgFoodCost, avgCoef, 5 challenges, 4 stats, testimonial, 4 FAQs détaillées)
2. `client/public/sitemap.xml` — ajout URL `/guide-marge/restaurant-halal` (lastmod 2026-09-08, priority 0.8)
3. `client/scripts/prerender.cjs` — ajout route avec title + description SEO

### Contenu SEO produit
- **Titre** : "Calcul de marge restaurant halal : guide complet 2026"
- **Meta description** : food cost viande halal certifiée, surcoût certification, kebabs, grillades, tajines
- **4 FAQs schema** : marge moyenne, calcul food cost viande halal, stratégies absorption surcoût, adéquation RestauMargin multi-activités
- **Testimonial** : Rachid, patron de restaurant halal à Marseille

### Niches restantes à couvrir
- restaurant-seminaire-groupe
- restaurant-scolaire
- bistro-gastronomique
