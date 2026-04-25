# Onboarder — 2026-04-25

## Statut : BLOQUÉ — Impossible de récupérer les nouveaux utilisateurs

### Problème identifié

L'endpoint `GET /api/cron/daily-report` retourne `{"error":"Unauthorized cron"}`.

**Cause :** L'endpoint est protégé par `CRON_SECRET` (header `Authorization: Bearer <secret>`).
La variable `CRON_SECRET` n'est pas disponible dans l'environnement d'exécution de l'agent.

**Problème supplémentaire :** Même avec le secret, cet endpoint n'expose pas la liste des nouveaux inscrits.
Il envoie un email récapitulatif agrégé (nb users, recettes, ingrédients) sans lister les emails individuels.

### Ce qu'il faudrait

Pour que cet agent fonctionne en production, il faut :

1. **Un endpoint dédié** qui retourne la liste des users inscrits dans les dernières 24h, ex :
   ```
   GET /api/cron/new-users
   → [{ email, name, createdAt }]
   ```
   Protégé par `CRON_SECRET`, avec filtre `createdAt >= now - 24h`.

2. **Renseigner `CRON_SECRET`** dans l'environnement de l'agent (variable d'env ou secret).

### Emails envoyés aujourd'hui

Aucun — données inaccessibles.

### Prochaine action

Créer l'endpoint `/api/cron/new-users` et configurer `CRON_SECRET` pour l'agent.
