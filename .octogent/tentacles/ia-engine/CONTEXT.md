# IA Engine

Couche IA isolée : 17 endpoints Claude, classifieur d'intent, double cache, quota mensuel.

## Scope
- `api/routes/ai.ts` — 2800 lignes, owner exclusif de ce fichier
- Dépend de `api/middleware.ts` (imports : `prisma`, `authWithRestaurant`)
- Dépend de `api/utils/emailTemplates.ts` (`buildOrderEmail` pour l'endpoint auto-commande)
- Dépend de `api/utils/unitConversion.ts` (`getUnitDivisor`)
- `api/index.ts` (lignes weekly-report, ~1955 lignes) — endpoint `/api/ai/weekly-report` est actuellement dans `index.ts`, à migrer vers `ai.ts`

## Décisions clés
- **Deux modèles Anthropic** : Haiku pour la classification d'intent (réponse max 20 tokens, prompt minimal), Sonnet pour les analyses lourdes et le chat contextuel. Le modèle Sonnet utilisé est `claude-sonnet-4-20250514`.
- **Classifieur d'intent `classifyIntent()`** : 7 catégories (`recipe | ingredient | order | planning | haccp | analysis | general`). Les intents `MUTABLE_INTENTS = ['recipe', 'ingredient', 'order', 'planning', 'haccp']` ne sont pas mis en cache (risque de données périmées).
- **Double cache in-memory** :
  - Context cache (par restaurantId) : TTL 1h (`CACHE_TTL = 3600000`). Contient les données DB (recettes, ingrédients, stock, fournisseurs) pour éviter des requêtes Prisma répétées.
  - Response cache : TTL 5min (`RESPONSE_CACHE_TTL = 5 * 60 * 1000`), clé = `restaurantId:intent:message[:100]`. Limité à 200 entrées max avec éviction automatique.
- **Quota mensuel** : 500 requêtes/mois/restaurant (table `ai_usage`, colonne `requests_count`, clé `month = YYYY-MM`). Requête via `prisma.$queryRaw`. Business = 2000 req/mois (différenciation à implémenter).
- **Rate limit utilisateur** : 20 req/heure/userId, compteur in-memory `Map<number, { count, resetAt }>`. Fonction exportée `checkAiRateLimit(restaurantId)` réutilisable.
- **Intent dupliqué** : il existe un endpoint `/api/ai/forecast` et un endpoint `/api/ai/demand-forecast` qui couvrent le même besoin. L'un des deux est à supprimer ou fusionner.

## Conventions
- Tous les endpoints IA passent par `authWithRestaurant` (JWT + membership vérification + header `X-Restaurant-Id`).
- Le contexte restaurant est chargé de façon lazy selon l'intent : `needsRecipes`, `needsIngredients`, `needsInventory`, `needsSuppliers`, `needsEmployees`, `needsHaccp`, `needsSales` — ne pas charger ce qui n'est pas nécessaire.
- Les réponses IA suivent la forme `{ response: string, intent: string, cached?: boolean }`.
- Le streaming SSE n'est pas encore implémenté sur `/api/ai/chat` — les réponses sont actuellement renvoyées en une fois après génération complète.
- Les erreurs Anthropic retournent `{ error: 'Service IA non configuré...' }` avec code 503 si `ANTHROPIC_API_KEY` absent, 429 si quota atteint.

## Dépendances avec autres tentacules
- **backend-api** : monte `aiRoutes` dans `index.ts` via `app.use('/api/ai', aiRoutes)`. Toute modification de l'URL de base doit être coordonnée.
- **frontend-pages** : `ChatbotAssistant.tsx` et `VoiceCommandButton.tsx` appellent `/api/ai/chat` et `/api/ai/voice`. Pas de changement de contrat d'API sans coordination.
- **growth-billing** : l'endpoint `/api/ai/weekly-report` génère le rapport envoyé par email aux abonnés Business — coordonner la migration vers un job async.
