# Backend API

Serveur Express/TypeScript monolithique à découper en modules par domaine fonctionnel.

## Scope
- `api/index.ts` — 5905 lignes, point d'entrée Express, contient 90+ routes inline dont les routes recettes, inventaire, opérations et Stripe webhook
- `api/routes/auth.ts` — authentification (register/login/reset-password/verify-email, activation codes)
- `api/routes/export.ts` — exports CSV avec BOM UTF-8 et séparateur `;` (compatibilité Excel FR)
- `api/middleware.ts` — `authMiddleware`, `authWithRestaurant`, `sanitizeInput`, `validatePrice`, `validatePositiveNumber`, `logAudit`
- `api/utils/unitConversion.ts` — `getUnitDivisor()`, utilitaire partagé entre routes et export
- `api/utils/emailTemplates.ts` — builders HTML pour emails transactionnels (order, quote, welcome, verify, reset, digest, campaign, trial)
- `api/routes/admin.ts` — routes admin avec double guard : `authMiddleware` + `adminGuard` (role === 'admin')
- `api/routes/mercuriale.ts` — prix fournisseurs éditoriaux

## Décisions clés
- **Monolithe intentionnel** : toutes les routes métier sont dans `api/index.ts`. Les fichiers dans `api/routes/` (auth, ai, export, admin, mercuriale) sont les seuls modules déjà extraits. Le travail de ce département est de poursuivre cette extraction.
- **Double middleware d'auth** : `authMiddleware` (JWT seul) pour les routes user, `authWithRestaurant` (JWT + vérification `RestaurantMember` en DB) pour les routes sensibles aux données restaurateur. Le header `X-Restaurant-Id` est obligatoire pour `authWithRestaurant`.
- **Prisma + Supabase PostgreSQL** : instance `PrismaClient` instanciée dans `middleware.ts` et importée par les routes. Ne pas créer de second client.
- **Stripe webhook avant `express.json()`** : le webhook `/api/stripe/webhook` utilise `express.raw({ type: 'application/json' })` car Stripe exige le corps brut pour vérifier la signature. Cette position dans `index.ts` est critique.
- **Pattern erreur uniforme** : toutes les routes répondent `{ error: string }` sur 4xx/5xx. Ne pas introduire de format différent.
- **Resend** pour les emails transactionnels, clé via `process.env.RESEND_API_KEY`. Le from address est toujours `RestauMargin <contact@restaumargin.fr>`.

## Conventions
- Les routes extraites retournent un `Router` Express et sont montées dans `index.ts` via `app.use('/api/<domaine>', routes)`.
- Validation : utiliser `sanitizeInput` et `validatePrice` / `validatePositiveNumber` importés depuis `middleware.ts`. Pas de validation inline ad hoc.
- Les inputs numériques passent par `getUnitDivisor()` de `utils/unitConversion.ts` quand ils impliquent des unités (g/kg/L/mL/pcs).
- Les routes de lecture seule (GET) ne nécessitent que `authMiddleware`. Les mutations (POST/PUT/DELETE) sur des données restaurateur nécessitent `authWithRestaurant`.
- Rate limiting sur `/api/ai/chat` : 20 req/heure/user (in-memory `Map`). À répliquer sur `/api/auth/login` avec un compteur similaire.

## Dépendances avec autres tentacules
- **ia-engine** : `api/routes/ai.ts` est monté via `app.use('/api/ai', aiRoutes)` dans `index.ts` — ia-engine est owner de ce fichier
- **growth-billing** : les routes Stripe dans `api/index.ts` (webhook, checkout, portal) appartiennent à growth-billing — ne pas toucher lors du découpage
- **frontend-pages** : le proxy Vite redirige toutes les requêtes `/api/*` vers `localhost:3001` — les URLs de routes ne doivent pas changer sans coordination
