# SEO Writer — 2026-07-25

## Niche ajoutee : restaurant-traiteur

**URL** : `/guide-marge/restaurant-traiteur`

### Rationale
- Les 12 niches precedentes couvrent les formats de restauration directe (pizzeria, brasserie, sushi, burger, etc.) et quelques specialites (creperie, boulangerie, bar).
- La restauration traiteur est un segment distinct et tres recherche sur Google ("calcul marge traiteur", "food cost buffet mariage", "prix revient prestation traiteur") avec peu de contenu expert en francais.
- Fort potentiel SEO long-tail sur les requetes liees aux devis evenementiels, au food cost par convive et a la rentabilite des buffets.
- Segment avec une douleur forte : les traiteurs font souvent des devis "au feeling" et peinent a securiser leur marge nette sur chaque prestation.

### Contenu cree
- Config NicheConfig complete dans `client/src/pages/NicheLanding.tsx`
- Chiffres realistes : food cost 22-35%, marge brute 65-78%, coef 3,5 a 5, ticket moyen 25-65€/convive
- 5 defis specifiques (devis perdants, gaspillage post-buffet, sous-traitants, saisonnalite, tarification)
- 4 stats avec couleurs (teal/emerald/amber/rose)
- Temoignage fictif realiste : Patricia, traiteur independante a Aix-en-Provence
- 4 FAQs substantielles : marge moyenne traiteur, calcul food cost buffet/cocktail, eviter les devis perdants, multi-activites

### Fichiers modifies
- `client/src/pages/NicheLanding.tsx` — ajout config `restaurant-traiteur`
- `client/public/sitemap.xml` — ajout URL avec lastmod 2026-07-25
- `client/scripts/prerender.cjs` — ajout entree prerender avec title + description
