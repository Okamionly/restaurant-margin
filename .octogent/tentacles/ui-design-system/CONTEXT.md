# UI Design System

41 composants réutilisables, 5 locales i18n, feuille de styles globale.

## Scope
- `client/src/components/` — 41 composants (Button, SearchBar, EmptyState, Modal, Toast, PaywallModal, SEOHead, ChatbotAssistant, VoiceCommandButton, AlertsBell, Breadcrumbs, Charts, CommandPalette, etc.)
- `client/src/locales/fr.json` (2584 lignes), `en.json`, `ar.json`, `es.json`, `de.json`
- `client/src/index.css` — Tailwind base/components/utilities + noise texture SVG inline + transitions dark mode

## Décisions clés
- **Zéro librairie UI externe** : pas de shadcn, pas de MUI, pas de Chakra. Tous les composants sont écrits from scratch en Tailwind + lucide-react.
- **Noise texture SVG inline** : `body::before` applique un filtre `feTurbulence` SVG encodé en base64 dans `index.css`. Utile esthétiquement mais coûteux en perf sur tablette (Samsung Tab A9+) — le nettoyage est un item prioritaire.
- **Transitions dark mode** : `html.dark-transition *` active `transition-duration: 300ms` uniquement pendant le switch. En état stable, `transition-duration: 0ms` pour éviter les micro-animations non désirées.
- **Composants existants documentés dans CLAUDE.md** : `Button` (variantes primary/success/danger/ghost), `SearchBar`, `EmptyState`, `SmartIngredientInput`, `IngredientAvatar`, `PaywallModal`. Ces composants sont la référence — ne pas recréer de variantes ad hoc dans les pages.
- **`TrialPaywallGuard`** : wrappeur qui bloque l'accès aux features premium si `trialEndsAt` est dépassé ou si le plan est `basic`. Utilisé dans plusieurs pages protégées.
- **i18n** : le hook `useTranslation()` est dans `hooks/`, mais les fichiers JSON source sont dans `locales/` — scope de ce département. `fr.json` est la source de vérité, les autres langues sont synchronisées en conséquence.
- **Fonts** : `General Sans` (body, textes courants) + `Satoshi` (titres, headings). Définies dans `index.css` via `font-family`. Ne pas utiliser d'autres polices.

## Conventions
- Cards : `bg-white dark:bg-[#0A0A0A]/50 border border-[#E5E7EB] dark:border-[#1A1A1A] rounded-2xl`
- Boutons primaires : `bg-teal-600 hover:bg-teal-500 rounded-xl` (jamais `blue-*`)
- Inputs : `bg-[#F5F5F5] dark:bg-[#262626] border-[#E5E7EB] dark:border-[#262626] rounded-lg`
- Texte secondaire : `text-[#737373] dark:text-[#A3A3A3]`
- Boutons CTA inversés : `bg-[#111111] dark:bg-white text-white dark:text-[#111111]`
- Chaque composant doit exporter une interface TypeScript explicite pour ses props.
- Icônes : uniquement `lucide-react`. Vérifier que l'icône existe dans la version installée avant d'importer.
- Animations : Tailwind transitions uniquement (`transition-*`, `duration-*`, `ease-*`). Pas de framer-motion, pas d'anime.js.

## Dépendances avec autres tentacules
- **frontend-pages** : consomme tous les composants. Toute modification d'interface de composant (props ajoutées/supprimées) doit être rétrocompatible ou coordonnée.
- **seo-marketing** : `SEOHead.tsx` est un composant de ce département utilisé par les pages Landing/Blog. Ne pas modifier son interface sans coordination.
- **ia-engine** : `ChatbotAssistant.tsx` et `VoiceCommandButton.tsx` consomment `/api/ai/chat` et `/api/ai/voice` — coordonner passage SSE avec ia-engine.
