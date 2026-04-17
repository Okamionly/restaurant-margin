# Backlog — backend-api

## 1. Extraire les routes recettes de api/index.ts vers api/routes/recipes.ts
Toutes les routes `/api/recipes/*` et `/api/recipe-*` sont actuellement inline dans `api/index.ts`. Les extraire vers un module `api/routes/recipes.ts` suivant le même pattern que `api/routes/export.ts` (Router Express + import dans index.ts). Inclure les dépendances `getUnitDivisor` et `authWithRestaurant`.

## 2. Extraire les routes inventaire vers api/routes/inventory.ts
Routes `/api/inventory/*`, `/api/stock-*`, `/api/waste-*` à isoler dans leur propre module. Vérifier les imports Prisma (modèles `InventoryItem`, `WasteLog`).

## 3. Extraire les routes opérations vers api/routes/operations.ts
Routes planning, HACCP, shifts, timeEntries, employees (`/api/planning/*`, `/api/haccp/*`, `/api/employees/*`). Regrouper par domaine opérationnel, pas par URL.

## 4. Ajouter rate limiting sur /api/auth/login
Implémenter un compteur in-memory identique à celui de `/api/ai/chat` (20 tentatives/heure par IP). Le pattern existe déjà dans `api/routes/ai.ts` — le répliquer dans `api/routes/auth.ts` en utilisant `req.ip` comme clé.

## 5. Validation Zod sur les routes extraites
Au fur et à mesure de l'extraction, ajouter des schémas Zod pour valider les bodies des mutations. Priorité : routes recettes (POST/PUT) et routes auth (register, reset-password). Utiliser `zod.parse()` avec un try/catch qui retourne `{ error: string }` en 400.

## 6. Centraliser la gestion d'erreurs avec un middleware Express
Actuellement chaque route a son propre `catch (e: any) { res.status(500).json({ error: e.message }) }`. Créer un error handler Express global `(err, req, res, next)` monté en dernier dans `index.ts` et supprimer les blocs catch inline redondants.

## 7. Documenter les routes API extraites avec commentaires JSDoc
Après extraction, ajouter sur chaque router function : méthode HTTP, auth requise, body attendu, codes de réponse possibles. Format : commentaire JSDoc inline au-dessus de chaque `router.get/post/put/delete`.
