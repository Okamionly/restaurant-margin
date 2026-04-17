# Backlog — ui-design-system

## 1. Créer un composant <Table> générique réutilisable
Plusieurs pages (Ingredients, Recipes, Suppliers, Inventory) réimplèmentent des tables `<table>` identiques avec en-têtes, lignes, colonnes triables, état vide. Créer `components/Table.tsx` avec props : `columns: { key, label, sortable? }[]`, `data: Record<string, any>[]`, `emptyState?: ReactNode`, `loading?: boolean`. Light + dark mode obligatoire.

## 2. Créer un composant <Card> générique réutilisable
Les cards stats (KPI en haut des pages Dashboard, Ingredients, Recipes) sont copiées-collées. Créer `components/Card.tsx` avec props : `title`, `value`, `subtitle?`, `icon?`, `trend?`. Classes standardisées : `bg-white dark:bg-[#0A0A0A]/50 border border-[#E5E7EB] dark:border-[#1A1A1A] rounded-2xl`.

## 3. Supprimer ou conditionner le noise SVG dans body::before
Le filtre `feTurbulence` SVG inline dans `index.css` (`body::before`) est fixe et non GPU-accéléré. Sur tablette (Samsung Tab A9+), il provoque un repaint permanent. Solution : le désactiver via `@media (prefers-reduced-motion: reduce)` ou le conditionner à `@media (min-width: 1024px)` seulement.

## 4. Finaliser les clés i18n manquantes dans les 4 langues (en/ar/es/de)
`fr.json` est la source (2584 lignes). Comparer avec `en.json`, `ar.json`, `es.json`, `de.json` pour identifier les clés présentes en FR mais absentes ailleurs. Pour les nouvelles clés : ajouter la valeur EN en priorité, laisser un placeholder `""` ou la valeur FR pour ar/es/de (à traduire plus tard).

## 5. Auditer PaywallModal et TrialPaywallGuard pour cohérence
Ces deux composants vérifient l'état `plan` et `trialEndsAt` mais potentiellement avec des logiques différentes. Centraliser la vérification dans un helper `isPaidPlan(user)` dans `types/` ou `utils/`, et l'utiliser dans les deux composants.

## 6. Documenter les composants existants dans un index composants
Créer `client/src/components/README.md` (ou en-tête de fichier) listant les 41 composants avec leur interface props et cas d'usage. Objectif : éviter que les agents recréent des composants existants. Pas de doc externe — commentaire JSDoc en tête de chaque fichier composant.
