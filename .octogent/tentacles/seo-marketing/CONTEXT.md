# SEO Marketing

Pages publiques, outils gratuits, blog, et infrastructure SEO technique.

## Scope
- `client/src/pages/Landing.tsx` — page d'accueil principale (eager-loaded, import direct dans App.tsx)
- `client/src/pages/Pricing.tsx` — page tarifs publique avec FAQ, tableau comparatif, Stripe checkout
- `client/src/pages/StationLanding.tsx` — landing page Station Balance (eager-loaded)
- `client/src/pages/Temoignages.tsx` — page témoignages clients
- `client/src/pages/Demo.tsx` — page démo produit
- `client/src/pages/Blog*.tsx` — 8 articles blog : `BlogCalcMarge`, `BlogCoefficient`, `BlogFicheTechnique`, `BlogFoodCost`, `BlogGaspillage`, `BlogHACCP`, `BlogIA`, (compter dans pages/)
- `client/src/pages/FoodCostCalculator.tsx` — outil gratuit public (`/outils/calculateur-food-cost`)
- `client/src/pages/QRCodeGenerator.tsx` — outil gratuit public (`/outils/generateur-qr-menu`)
- `client/src/components/SEOHead.tsx` — wrapper `react-helmet-async` pour title/description/OG/Twitter/canonical
- `client/scripts/prerender.cjs` — script de prerender statique
- `docs/seo-audit.md` — audit SEO de référence

## Décisions clés
- **`SEOHead.tsx`** : wrapper `react-helmet-async`. Interface : `{ title, description, path?, ogImage?, type?, noindex? }`. La `BASE_URL` est `https://www.restaumargin.fr`. Le canonical est généré automatiquement (`${BASE_URL}${path}`). Le `fullTitle` ajoute `| RestauMargin` si absent. Ne pas modifier cette interface sans coordination avec ui-design-system.
- **Pages blog** : chaque article est une page React autonome avec son propre `<SEOHead>`. Il n'y a pas de CMS — les articles sont du TSX statique. L'ajout d'un article = création d'une nouvelle page + ajout de route dans `App.tsx`.
- **Outils publics** : `FoodCostCalculator` et `QRCodeGenerator` sont des pages sans auth, accessibles publiquement sous `/outils/*`. Ne requièrent aucun token.
- **`Landing.tsx`** : page la plus lourde du projet (>1000 lignes). Elle importe `SEOHead`, `FoodIllustration` (composant SVG animé), `useTranslation`. Contient une sauvegarde HTML commentée de l'ancienne hero section (lignes 18-33) — ne pas supprimer, c'est intentionnel.
- **Pricing.tsx** : contient les prix hardcodés Pro (29€/mois, 23€/an) et Business (79€/mois, 63€/an). Ces prix correspondent aux price IDs Stripe LIVE. Ne jamais modifier sans vérification des IDs Stripe.

## Conventions
- Les pages publiques SEO n'utilisent pas `useAuth()` ni `useRestaurant()`.
- Toutes les pages publiques ont un `<SEOHead>` avec `title` et `description` remplis — pas d'exceptions.
- `noindex={true}` uniquement pour les pages légales (CGU, CGV, PolitiqueConfidentialite) et pages de test.
- Les outils publics doivent fonctionner sans JavaScript désactivé pour les crawlers (ou prérendus via `prerender.cjs`).
- Responsive : les pages Landing et Pricing doivent être impeccables sur mobile (320px) et desktop (1440px).
- Pas de strings françaises hardcodées dans les pages de contenu — mais les articles de blog en TSX statique sont une exception acceptable (contenu éditorial fixe).

## Dépendances avec autres tentacules
- **ui-design-system** : `SEOHead.tsx` est géré dans ui-design-system mais son scope d'usage est ce département — toute modification d'interface se coordonne ici.
- **growth-billing** : `Pricing.tsx` contient le bouton de checkout Stripe. Les price IDs et les URLs de redirection Stripe sont gérés par growth-billing.
- **frontend-pages** : `App.tsx` (géré par frontend-pages) contient les routes publiques pour les pages de ce département. Toute nouvelle page SEO nécessite l'ajout d'une route dans `App.tsx`.
