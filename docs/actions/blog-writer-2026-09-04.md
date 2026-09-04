# Run scheduled blog-writer — 2026-09-04

## Article rédigé

**Titre** : No-show au restaurant : comment réduire les réservations non honorées (et chiffrer ce que ça coûte vraiment)
**Slug** : `no-show-restaurant-solutions`
**Fichier** : [no-show-restaurant-solutions.md](../blog-articles/no-show-restaurant-solutions.md)
**Mots** : ~1 480 mots prose (cible 1 500 — dans la limite)
**Structure** : intro accroche + tableau sommaire (5 sections) + 4 tableaux + FAQ 4 Q/R + CTA + maillage interne
**Statut** : Rédigé + composant React + route + sitemap ✅ — publié en production

## Sujet choisi

Tous les sujets de la liste prioritaire initiale étaient déjà traités. Sujet choisi dans le backlog `docs/blog-articles/backlog.md` : **no-show au restaurant** (#3 du backlog), jamais traité malgré plusieurs runs.

## Composant React

- `client/src/pages/BlogNoShowRestaurant.tsx` — 280 lignes, structure SEOHead + JSON-LD Article + article complet en JSX
- Route ajoutée dans `client/src/App.tsx` : `/blog/no-show-restaurant-solutions`
- Import `lazyRetry` ajouté à la ligne 235

## Sitemap

URL ajoutée dans `client/public/sitemap.xml` :
```xml
<url>
  <loc>https://www.restaumargin.fr/blog/no-show-restaurant-solutions</loc>
  <lastmod>2026-09-04</lastmod>
  <priority>0.7</priority>
</url>
```

## TypeScript

Erreurs vérifiées = 100 % pre-existing (missing node_modules types : react, react-router-dom, lucide-react). Aucune erreur nouvelle introduite. Même profil d'erreurs que `BlogAvisGoogleNegatifs.tsx` pris comme baseline.

## Git

- Commit : `feat(blog): nouvel article no-show restaurant solutions` — hash `1e30eac`
- Push : `git push origin HEAD:main` — succès

## Maillage interne

Liens vers 3 articles publiés vérifiés dans App.tsx :
- `/blog/augmenter-ticket-moyen-restaurant` ✅
- `/blog/kpi-restaurateur` ✅
- `/blog/seuil-rentabilite-restaurant` ✅

## Backlog mis à jour

- `no-show-restaurant-solutions` marqué publié (39 articles au total).
- Prochains slots prioritaires :
  1. Brigade cuisine — `brigade-cuisine-organisation-postes`
  2. Pourboires — `pourboires-restaurant-legislation-fiscalite`
  4. Prix de vente menu — `prix-vente-menu-restaurant-methode`
  5. Contrat saisonnier — `contrat-saisonnier-restauration`
  6. Contrôle DDPP — `controle-hygiene-restaurant-ddpp`
