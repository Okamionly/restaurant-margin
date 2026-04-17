# Frontend Pages

67 pages applicatives React 18 + routing + hooks + service API.

## Scope
- `client/src/pages/` — toutes les pages applicatives sauf : `Landing.tsx`, `Pricing.tsx`, `StationLanding.tsx`, `Temoignages.tsx`, `Demo.tsx`, `Blog*.tsx`, `FoodCostCalculator.tsx`, `QRCodeGenerator.tsx` (appartiennent à seo-marketing)
- `client/src/App.tsx` — routing React Router, sidebar, lazy loading via `lazyRetry()`, providers
- `client/src/hooks/` — `useAuth.tsx`, `useRestaurant.tsx`, `useCollaboration.tsx`, `useConnectivity.ts`, `useToast.tsx`, `useTranslation.ts`, `useDebounce.ts`, `useScale.ts`, `useUndoDelete.ts`
- `client/src/services/api.ts` — client HTTP centralisé, gestion erreurs, retry GET, offline store
- `client/src/types/` — types partagés TypeScript
- `client/src/utils/` — utilitaires frontend (ex: `currency.ts`)

## Décisions clés
- **Lazy loading systématique** : toutes les pages sauf `Login`, `Landing`, `StationLanding`, `PublicMenu`, `NotFound` utilisent `lazyRetry()` (wrapper autour de `React.lazy()` avec auto-reload sur chunk failure due à un nouveau deploy).
- **Pattern offline** : `services/api.ts` intègre `saveToOffline`, `getFromOffline`, `addPendingAction`, `isOffline` depuis `services/offlineStore`. Les mutations critiques sont mises en file d'attente si hors ligne.
- **Service API centralisé** : toutes les requêtes passent par `api.ts`. Inclut : retry GET automatique sur 500/502/503 (1 retry, délai 2s), toast d'erreur event-based (`onApiToast`), messages FR par code HTTP (`STATUS_MESSAGES`), headers auth via `getToken()` depuis localStorage.
- **Routing protégé** : `<ProtectedRoute>` dans `App.tsx` (vérification token + redirect `/login`). Les routes publiques (`/`, `/login`, `/pricing`, `/blog/*`, `/public/*`, `/outils/*`) sont hors du guard.
- **Sidebar inline dans App.tsx** : pas de composant `Sidebar` séparé. Les liens sidebar sont des tableaux de `{ to, icon, label }` groupés par sections (PRINCIPAL, GESTION, INTELLIGENCE, OPERATIONS, COMMUNICATION, BUSINESS).
- **i18n** : hook `useTranslation()` retourne `{ t, locale, setLocale }`. La fonction `t("key.subkey")` utilise la traversée de chemin en points sur les fichiers JSON. Fallback : retourne la clé si absente. Locale par défaut : `fr`, persistée en `localStorage`. Support RTL pour `ar` (via `document.documentElement.dir`).

## Conventions
- Pages en PascalCase, export default function, pas de props (routing React Router sans prop drilling).
- `import { useTranslation } from '../hooks/useTranslation'` — jamais de string française hardcodée dans une page.
- Couleurs Tailwind : zéro `slate-*`, zéro `blue-*`. Seuls `teal-600/teal-500` (primaire), `emerald-500/emerald-400` (success), hex directs `[#111111]`/`[#E5E7EB]`/`[#737373]` pour les teintes non-couvertes par Tailwind.
- Chaque page doit avoir son mode dark (classes `dark:*`) — pas d'exceptions.
- Icônes : `lucide-react` uniquement. Chercher le nom exact dans les imports existants de `App.tsx` avant d'importer de nouveaux icônes.
- Responsive mobile-first : priorité tablette Samsung Tab A9+ (1340×800 px, touch).
- 175 classes `blue-*` sont encore présentes dans les pages — à migrer vers `teal-*` (migration en cours).

## Dépendances avec autres tentacules
- **ui-design-system** : importe les composants `Button`, `SearchBar`, `EmptyState`, `PaywallModal`, `Modal`, etc. depuis `client/src/components/`. Ne pas dupliquer de logique UI dans les pages.
- **backend-api** : toutes les requêtes passent par `services/api.ts` vers `/api/*`. Les URLs ne doivent pas être hardcodées dans les pages.
- **ia-engine** : `ChatbotAssistant.tsx` et `VoiceCommandButton.tsx` (qui sont dans `components/`, géré par ui-design-system) utilisent `/api/ai/chat` — coordonner le passage au SSE.
- **seo-marketing** : `SEOHead.tsx` (composant dans `components/`) est importé dans les pages publiques — ne pas modifier depuis ce département.
