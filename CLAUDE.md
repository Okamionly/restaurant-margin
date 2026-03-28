# RestauMargin — Instructions pour tous les agents Claude Code

## Stack technique
- **Frontend** : React 18 + Vite + TypeScript
- **Backend** : Node.js + Express + TypeScript
- **ORM** : Prisma
- **BDD** : PostgreSQL (Supabase)
- **UI** : Tailwind CSS, dark theme (bg-slate-950, text-white)
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

## Style
- Dark theme : `bg-slate-950`, `bg-slate-900`, `text-white`, `text-slate-400`
- Cards : `bg-slate-900/50 border border-slate-800 rounded-2xl`
- Boutons primaires : `bg-blue-600 hover:bg-blue-700 rounded-xl`
- Boutons success : `bg-emerald-500 hover:bg-emerald-400 rounded-xl`
- Inputs : `bg-slate-800 border-slate-700 rounded-lg`
- Animations : transitions Tailwind, pas de librairies d'animation

## API
- Base URL : vide (proxy Vite vers localhost:3001)
- Auth : Bearer token dans localStorage
- Headers : `{ 'Content-Type': 'application/json', Authorization: 'Bearer ${token}' }`
- Pattern : `const res = await fetch('/api/endpoint', { headers: authHeaders() })`

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
