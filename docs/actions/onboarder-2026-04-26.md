# Onboarder — 2026-04-26

## Statut : ERREUR API (endpoint inaccessible)

## Résultat fetch : DNS cache overflow

## Cause probable :
- Le domaine restaumargin.fr ne résout pas depuis cet environnement
- OU l'endpoint /api/agents/data n'est pas encore déployé en production

## Action requise (humain) :
1. Vérifier que https://www.restaumargin.fr/api/agents/data est bien accessible en production
2. Si l'endpoint n'existe pas, le créer côté backend (voir api/routes/agents.ts)
3. Relancer le workflow onboarder manuellement une fois l'API disponible

## Prochaine exécution : 2026-04-27 09h00 Paris
