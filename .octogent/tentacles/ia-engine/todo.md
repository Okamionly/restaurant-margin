# Backlog — ia-engine

## 1. Implémenter le streaming SSE sur /api/ai/chat
Remplacer la réponse JSON unique par un stream Server-Sent Events. Anthropic SDK supporte `stream: true` avec `anthropic.messages.stream()`. Côté client, `ChatbotAssistant.tsx` devra utiliser `EventSource` ou `fetch` avec `response.body.getReader()`. Coordonner avec frontend-pages.

## 2. Migrer /api/ai/weekly-report en job asynchrone
Le weekly-report (~1955 lignes dans `api/index.ts`) est un endpoint HTTP synchrone qui génère un rapport long. Le migrer en job planifié (cron via `node-cron` ou appel depuis `scripts/agents/runner.ts`). Coordonner avec growth-billing pour l'envoi email.

## 3. Fusionner les intents forecast et demand-forecast
`/api/ai/forecast` et `/api/ai/demand-forecast` couvrent le même besoin (prévision de demande). Identifier lequel est appelé depuis le frontend (chercher dans `client/src/services/api.ts`), supprimer le doublon, mettre à jour `classifyIntent()` si nécessaire.

## 4. Quota différencié Pro/Business
Le quota actuel est fixé à 500 req/mois pour tous. Lire `user.plan` depuis la DB et appliquer : Pro = 500, Business = 2000. La valeur de `MONTHLY_LIMIT` doit être dynamique par restaurant en fonction du plan de l'owner.

## 5. Persister le context cache sur Redis ou persistance légère
Actuellement, le context cache (`Map<number, {...}>`) est perdu à chaque redémarrage du serveur. Évaluer un cache partagé (Redis via Upstash, ou fichier JSON local pour dev) pour survivre aux redémarrages. Coordonner avec backend-api.

## 6. Nettoyer et documenter les 17 endpoints IA
Lister tous les `router.post/get` dans `ai.ts`, vérifier lesquels sont appelés depuis le frontend, supprimer les endpoints orphelins. Ajouter un commentaire JSDoc sur chaque endpoint actif avec : modèle utilisé, intent classifié, données contexte chargées, format de réponse.
