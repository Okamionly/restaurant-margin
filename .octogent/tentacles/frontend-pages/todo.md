# Backlog — frontend-pages

## 1. Migrer les 175 classes blue-* vers teal-* dans les pages applicatives
Faire un grep de `blue-` dans `client/src/pages/` (hors pages SEO). Remplacer toutes les occurrences par leur équivalent teal : `blue-600` → `teal-600`, `blue-500` → `teal-500`, `blue-50` → `teal-50`, `blue-100` → `teal-100`, etc. Vérifier visuellement après chaque page modifiée.

## 2. Compléter i18n sur les ~16 pages avec strings françaises hardcodées
Identifier les pages qui contiennent encore du texte FR hors `t()`. Ajouter les clés manquantes dans `client/src/locales/fr.json` (et synchroniser les clés vides dans `en.json`, `ar.json`, `es.json`, `de.json`). Format clé : `"pageName.element"` en camelCase.

## 3. Améliorer l'offline store pour les mutations en attente
`services/offlineStore` stocke des `pendingActions` mais le mécanisme de replay à la reconnexion n'est pas complet. Implémenter la consommation de la queue dans `useConnectivity.ts` : quand `isOnline` repasse à `true`, rejouer les actions en attente dans l'ordre, avec feedback Toast.

## 4. Ajouter la page Parrainage publique dans le routing
Une page `/parrainage` ou `/referral` doit être créée et ajoutée dans `App.tsx` (route publique, hors `<ProtectedRoute>`). Elle présente le programme de parrainage (coordonner avec growth-billing pour le contenu et les endpoints `/api/referrals/*`).

## 5. Auditer et corriger les pages sans dark mode
Passer en revue les pages récentes (`NegociationIA.tsx`, `Seminaires.tsx`, `DevCorp.tsx`, `ServiceTracker.tsx`) pour vérifier que chaque `bg-white`, `text-gray-*`, `border-gray-*` a son équivalent `dark:`. Zéro exception.

## 6. Optimiser le bundle : identifier les pages à splitting plus fin
Vérifier les tailles de chunk avec `vite build --report`. Les pages les plus lourdes (ex: `MenuEngineering.tsx`, `FinancialIntelligence.tsx`) peuvent bénéficier d'imports dynamiques internes pour leurs sous-composants lourds (charts, tables de données).
