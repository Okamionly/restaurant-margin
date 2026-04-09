# RestauMargin — Instructions pour tous les agents Claude Code

## Stack technique
- **Frontend** : React 18 + Vite + TypeScript
- **Backend** : Node.js + Express + TypeScript
- **ORM** : Prisma
- **BDD** : PostgreSQL (Supabase)
- **UI** : Tailwind CSS, theme W&B (bg-white/dark:bg-black, zero slate, hex directs)
- **Fonts** : Satoshi (titres, headings) + General Sans (corps, body text)
- **Icônes** : lucide-react uniquement
- **Pas de librairies UI externes** (pas de shadcn, pas de MUI, pas de Chakra)

## Conventions de code
- Pages dans `client/src/pages/` — PascalCase (ex: `MenuEngineering.tsx`)
- Composants dans `client/src/components/`
- Services API dans `client/src/services/api.ts`
- Types dans `client/src/types/`
- Hooks dans `client/src/hooks/`
- Export default pour les pages : `export default function PageName() {}`
- Pas de props pour les pages (routing via React Router)

## Composants réutilisables
- `Button` — bouton standard avec variantes (primary, success, danger, ghost)
- `SearchBar` — barre de recherche avec icône et placeholder
- `EmptyState` — état vide avec illustration et CTA
- `SmartIngredientInput` — input intelligent avec suggestions IA pour les ingrédients
- `IngredientAvatar` — avatar coloré pour les ingrédients (initiales + couleur)
- `PaywallModal` — modale de paywall pour les fonctionnalités premium

## i18n
- Hook : `useTranslation` depuis `../hooks/useTranslation`
- 5 fichiers de locale : `client/src/locales/fr.json`, `en.json`, `ar.json`, `es.json`, `de.json`
- Toujours remplacer les strings françaises par `t("key")`
- Clés en camelCase groupées par page : `"ingredients.title"`, `"dashboard.margin"`

## Routing
- Fichier : `client/src/App.tsx`
- Routes publiques : directement dans `<Routes>`
- Routes protégées : dans `<ProtectedRoute>` avec `<Suspense>`
- Lazy loading : `const Page = lazy(() => import('./pages/Page'))`
- Toujours ajouter la route dans App.tsx après création d'une page

## Sidebar
- Dans `App.tsx` (pas de fichier séparé)
- Ajouter le lien dans la section appropriée (PRINCIPAL, GESTION, INTELLIGENCE, OPERATIONS, COMMUNICATION, BUSINESS)
- Format : `{ to: '/path', icon: IconName, label: 'Label' }`

## Style (W&B — White & Black)
- **Zero slate** : utiliser des hex directs, jamais `slate-*`
- Light mode : `bg-white`, `text-[#111111]`, borders `border-[#E5E7EB]`
- Dark mode : `dark:bg-black` ou `dark:bg-[#0A0A0A]`, `dark:text-white`, `dark:border-[#1A1A1A]`
- Cards : `bg-white dark:bg-[#0A0A0A]/50 border border-[#E5E7EB] dark:border-[#1A1A1A] rounded-2xl`
- Boutons primaires : `bg-teal-600 hover:bg-teal-500 rounded-xl`
- Boutons success : `bg-emerald-500 hover:bg-emerald-400 rounded-xl`
- Boutons CTA : `bg-[#111111] dark:bg-white text-white dark:text-[#111111]`
- Inputs : `bg-[#F5F5F5] dark:bg-[#262626] border-[#E5E7EB] dark:border-[#262626] rounded-lg`
- Texte secondaire : `text-[#737373] dark:text-[#A3A3A3]`
- Couleur principale : `teal-600`, hover : `teal-500`
- Chaque element doit avoir light ET dark mode
- Animations : transitions Tailwind, pas de librairies d'animation

## API
- Base URL : vide (proxy Vite vers localhost:3001)
- Auth : Bearer token dans localStorage
- Headers : `{ 'Content-Type': 'application/json', Authorization: 'Bearer ${token}' }`
- Pattern : `const res = await fetch('/api/endpoint', { headers: authHeaders() })`

## Architecture backend (routes API)
- `api/routes/auth.ts` — authentification (login, register, reset password)
- `api/routes/ai.ts` — endpoints IA (suggestions, analyse, commande vocale)
- `api/routes/mercuriale.ts` — gestion éditoriale des prix fournisseurs

## Intelligence Artificielle
- **19 actions IA** disponibles (suggestions recettes, optimisation marges, analyse food cost, détection anomalies, etc.)
- **Commande vocale** : dictée et commandes en langage naturel via Web Speech API
- **Modèle optimisé** : Claude Haiku pour les réponses rapides (suggestions, autocomplétion), Sonnet pour les analyses complexes
- Les endpoints IA sont dans `api/routes/ai.ts`

## Mercuriale (système éditorial fournisseurs)
- Tables Prisma : `mercuriale_suppliers`, `mercuriale_products`, `mercuriale_prices`, `mercuriale_price_history`
- Permet le suivi des prix fournisseurs dans le temps
- Routes dans `api/routes/mercuriale.ts`
- Interface d'édition des prix avec historique et comparaison

## Outils publics (SEO)
- `/outils/calculateur-food-cost` — calculateur gratuit de food cost (page publique, pas d'auth)
- `/outils/generateur-qr-menu` — générateur de QR code pour menu digital

## Blog
- `/blog/calcul-marge-restaurant` — article SEO sur le calcul de marge en restauration

## Parrainage
- Table Prisma : `referrals` (referrer_id, referred_email, status, reward)
- Routes dans `api/routes/referrals.ts` (ou dans auth.ts)
- Système de codes de parrainage avec suivi des conversions et récompenses

## Git
- Commit après chaque page/feature terminée
- Message en français : "feat: ajout page HACCP avec checklist températures"
- Ne pas push automatiquement (le user push manuellement)

## Règles importantes
- NE PAS modifier les fichiers sur lesquels un autre agent travaille
- NE PAS installer de nouvelles dépendances sans raison
- NE PAS supprimer du code existant sauf si demandé
- Toujours tester que la page se charge sans erreur
- Responsive : mobile-first, fonctionne sur tablette (Samsung Tab A9+)
