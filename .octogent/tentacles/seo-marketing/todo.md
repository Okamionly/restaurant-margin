# Backlog — seo-marketing

## 1. Étendre le sitemap à 30+ URLs
Le sitemap actuel ne couvre probablement pas tous les articles de blog, les 2 outils publics et les pages légales. Mettre à jour `client/scripts/prerender.cjs` pour inclure : toutes les routes `/blog/*`, `/outils/calculateur-food-cost`, `/outils/generateur-qr-menu`, `/temoignages`, `/demo`, `/station`. Vérifier le fichier sitemap.xml généré (ou le déclarer dans `public/sitemap.xml`).

## 2. Ajouter le canonical dynamique sur les pages blog
Chaque article blog (8 fichiers `Blog*.tsx`) doit passer `path="/blog/<slug>"` à `<SEOHead>` pour que le canonical soit correct. Vérifier que chaque article a un slug unique et cohérent avec son URL dans `App.tsx`.

## 3. Améliorer les meta descriptions des outils publics
`FoodCostCalculator.tsx` et `QRCodeGenerator.tsx` ont des meta descriptions génériques. Les réécrire pour cibler les mots-clés longue traîne (ex: "Calculateur food cost gratuit pour restaurateurs — calculez votre coût matière en 30 secondes"). S'appuyer sur `docs/seo-audit.md` pour les mots-clés cibles.

## 4. Ajouter les données structurées JSON-LD sur les articles de blog
Chaque article `Blog*.tsx` doit inclure un `<script type="application/ld+json">` avec le schema `Article` (datePublished, author, headline). Peut être injecté via `<Helmet>` dans `SEOHead` avec une prop optionnelle `jsonLd?: object`.

## 5. Créer une page index /blog avec liste de tous les articles
Il n'existe pas de page `/blog` listant les 8 articles. Créer `client/src/pages/Blog.tsx` (page index) avec cards titre/description/date pour chaque article, ajouter la route dans `App.tsx` (coordonner avec frontend-pages), et inclure cette URL dans le sitemap.

## 6. Optimiser les performances de Landing.tsx sur mobile
La page Landing est eager-loaded et fait >1000 lignes. Mesurer le LCP sur mobile (Lighthouse). Si > 2.5s, envisager de déplacer les sections below-the-fold (témoignages, FAQ, footer) en lazy load via `Suspense` + `React.lazy` ou en divisant le composant.
