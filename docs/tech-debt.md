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

---

## Dette ouverte — audit du 2026-09-25 (reportee a une prochaine vague)

> L'audit de 8 dimensions du 2026-09-25 a ete corrige en grande partie le jour meme
> (commits 280ceee → e0d8c5d : isolation multi-restaurant, webhooks, relais d'email,
> revocation des jetons, cout IA, caches, file hors ligne, prerendu, routines cloud...).
> Restent ici les points NON traites, du plus au moins important. Aucun n'est ouvert
> par accident : chacun a ete lu, et reporte.

### Decisions produit (a trancher par le fondateur, pas par un agent)

1. **Parrainage : recompenses promises, jamais appliquees.** L'interface promet -20 % au
   filleul et 1 mois offert au parrain ; aucun coupon ni credit Stripe n'est applique par
   le code. Le suivi et la qualification sont cables depuis 27b0016 (le fondateur est
   prevenu quand un filleul paie). Choisir : implementer (coupon Stripe au checkout +
   credit client a la qualification) ou reformuler `MesParrainages.tsx`.
2. **Contacts de prospection dans un depot PUBLIC.** `docs/campaigns/montpellier-contacts*.csv`
   (~200 restaurants : emails dont ~25 adresses Gmail/Hotmail, telephones, adresses).
   Retirer du depot (et de l'historique si necessaire) ou justifier.
3. **Prospection automatique** (routine `outreach-bot`, desactivee) : ne la relancer
   qu'avec une liste reelle constituee legalement et un envoi cote serveur.

### Technique

4. **Resend : erreurs encore non lues.** Lisent `{ data, error }` : inscription (notification
   fondateur), fin d'essai, onboarding, campagne, email/send, accuse inbox-sync, parrainage.
   Ne le lisent pas encore : email de bienvenue, verification, reinitialisation du mot de
   passe, notifications diverses (~20 appels). Le SDK ne leve jamais.
5. **Limite de debit IA en memoire par instance** (`Map` dans `api-lib/routes/ai.ts`) :
   Upstash n'est pas configure sur Vercel. Brancher `UPSTASH_REDIS_REST_URL/TOKEN` et
   passer `checkAiRateLimit` sur `ratelimit()`.
6. **inbox-sync non atomique** : import du message puis marquage `notif_log` ; un crash
   entre les deux peut re-importer. Envisager une transaction ou marquer d'abord.
7. **Soft 404** : toute URL inconnue repond 200 avec la page d'accueil, et un visiteur
   anonyme est renvoye sur /login (catch-all `/*` -> ProtectedRoute dans `App.tsx`).
   Ajouter une 404 publique `noindex` pour les chemins inconnus.
8. **Donnees structurees** : FAQPage en double sur 7 articles ; `dateModified` = date du
   build (`BUILD_DATE` dans `client/scripts/prerender.cjs`) : change a chaque deploiement.
9. **CSP** : `'unsafe-eval'` et `'unsafe-inline'` dans `script-src` (`vercel.json`). A retirer
   apres test page par page (une lib WASM exigerait `'wasm-unsafe-eval'`).
10. **Observabilite** : journaux Vercel ~1 h (Hobby), aucun log drain, aucune capture
    d'erreurs serveur.
11. **Planification GitHub Actions** : les crons derivent de plusieurs heures et sautent des
    passages (limite connue de GitHub). Si la ponctualite compte, planificateur externe.
12. **Cannibalisation du blog** (TVA, KPI, FIFO, prix de vente) : fusionner ou rediriger.
13. **EmailMarketing.tsx** : compteurs de destinataires ecrits en dur (342 / 67 / 89) a
    verifier et retirer s'ils sont fictifs (signal fabrique).
14. **Monolithe** `api/index.ts` (~7 500 lignes) : toujours d'actualite (voir point 2 ci-dessus).

### Actions humaines en attente (hors code)

- Revoquer puis recreer les cles **Tavily** et **Exa** (presentes dans l'historique git
  public), puis mettre a jour les variables Vercel.
- Ajouter les secrets `E2E_DEMO_EMAIL` / `E2E_DEMO_PASSWORD` au depot (tests E2E).
- Revoquer les jetons Vercel temporaires utilises pendant les sessions d'audit.
