# RestauMargin - Audit Dette Technique

> Date : 2026-04-01

---

## CRITIQUE (a fixer maintenant)

### 1. JWT_SECRET hardcode dans le code source

- **Fichier** : `api/index.ts` ligne 14
- **Probleme** : Le fallback `'rM$9xK#2pL7vQ!dW4nZ8jF0tY6bA3hU5cE1gI'` est en clair dans le repo Git. Si `JWT_SECRET` n'est pas defini dans l'env, ce secret statique est utilise en production.
- **Risque** : N'importe qui ayant acces au repo peut forger des tokens JWT valides.
- **Fix** : Supprimer le fallback, crash au demarrage si `JWT_SECRET` est absent.

```typescript
// AVANT (dangereux)
const JWT_SECRET = process.env.JWT_SECRET || 'rM$9xK#2pL7vQ!dW4nZ8jF0tY6bA3hU5cE1gI';

// APRES (securise)
const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) throw new Error('JWT_SECRET manquant');
```

### 2. Monolithe api/index.ts (3786 lignes)

- **Fichier** : `api/index.ts`
- **Probleme** : Tout le backend (auth, recettes, ingredients, mercuriale, chat IA, admin, HACCP, fournisseurs, etc.) dans un seul fichier.
- **Risque** : Impossible a maintenir, conflits Git frequents, difficulte a tester unitairement.
- **Fix** : Decouper en modules par domaine :
  - `api/routes/auth.ts`
  - `api/routes/recipes.ts`
  - `api/routes/ingredients.ts`
  - `api/routes/mercuriale.ts`
  - `api/routes/chat.ts`
  - `api/routes/admin.ts`
  - `api/middleware/auth.ts`

---

## HAUTE (a fixer ce mois)

### 3. 349 classes "blue" restantes dans le frontend

- **Scope** : `client/src/` (fichiers .tsx et .ts)
- **Probleme** : Le design system a migre vers teal (`bg-teal-600`, `neon-teal`), mais 349 occurrences de `blue-600`, `blue-700`, `blue-500` subsistent.
- **Impact** : Incoherence visuelle, boutons/liens melangeant bleu et teal.
- **Fix** : Rechercher/remplacer `blue-600` -> `teal-600`, `blue-700` -> `teal-700`, `blue-500` -> `teal-500` dans tous les fichiers tsx.

### 4. Zero tests automatises

- **Probleme** : Aucun fichier `.test.ts`, `.test.tsx` ou `.spec.ts` dans le projet (hors node_modules).
- **Impact** : Chaque deploy est un pari. Regressions non detectees.
- **Fix prioritaire** :
  - Tests unitaires pour l'auth (login, register, token)
  - Tests API pour les routes critiques (recettes, ingredients)
  - Tests composants React pour le dashboard

### 5. Composants UI partages manquants

- **Composants existants** : `Modal`, `Toast`, `ConfirmDialog`, `ErrorBoundary`, `ConnectivityBar`
- **Composants manquants** :
  - `Button` : Chaque page re-cree ses boutons avec des classes inline
  - `Table` : Pas de composant table reutilisable (tableaux refaits partout)
  - `SearchBar` : Input de recherche duplique dans chaque page
  - `Card` : Classe CSS `.card` existe mais pas de composant React
- **Impact** : Duplication massive, incoherence entre pages, changement de style = toucher 30+ fichiers.

---

## MOYENNE (a planifier)

### 6. i18n incomplet (~16 pages)

- **Probleme** : Environ 16 pages contiennent encore des strings francaises en dur au lieu d'utiliser `t("key")`.
- **Tracking** : Voir `project_i18n_remaining.md`
- **Impact** : L'app ne peut pas etre utilisee en anglais/arabe/espagnol/allemand correctement.

### 7. CLAUDE.md desynchronise

- **Probleme** : Le fichier `CLAUDE.md` reference `bg-blue-600` comme bouton primaire alors que le design utilise maintenant `teal-600`. Les conventions documentees ne refletent pas l'etat reel du code.
- **Fix** : Mettre a jour les sections "Style" et "Boutons primaires".

### 8. CSS global trop charge

- **Fichier** : `client/src/index.css`
- **Probleme** : Contient des effets visuels lourds (noise texture SVG sur body::before avec z-index 9999, gradient mesh background). Ces effets sont appliques globalement.
- **Impact** : Performance potentiellement affectee sur tablettes (Tab A9+), le overlay SVG couvre tout l'ecran en permanence.

---

## BASSE (amelioration future)

### 9. Pas de validation schema API (Zod/Joi)

- **Probleme** : Les routes Express ne valident pas les body/params avec un schema. Validation manuelle inline.
- **Fix** : Ajouter Zod pour la validation des requetes.

### 10. Pas de rate limiting

- **Probleme** : Aucune protection contre le brute-force sur `/api/login` ou l'abus de l'endpoint chat IA.
- **Fix** : Ajouter `express-rate-limit` sur les routes sensibles.

### 11. Pas de logging structure

- **Probleme** : Utilisation de `console.log` partout. Pas de niveaux de log (info, warn, error), pas de correlation d'erreurs.
- **Fix** : Adopter `pino` ou `winston` avec des niveaux structures.

### 12. Tailwind config - fonts non chargees

- **Fichier** : `client/tailwind.config.js`
- **Probleme** : Les fonts `Satoshi` et `General Sans` sont definies dans la config mais il n'y a pas de preuve de leur chargement (pas de @font-face ou Google Fonts link visible).
- **Impact** : Fallback silencieux sur `DM Sans` / `Inter` / `system-ui`.

---

## Resume

| Priorite | Items | Effort estime |
|----------|-------|---------------|
| CRITIQUE | 2     | 2-3 jours     |
| HAUTE    | 3     | 1-2 semaines  |
| MOYENNE  | 3     | 1 semaine     |
| BASSE    | 4     | Continu       |
