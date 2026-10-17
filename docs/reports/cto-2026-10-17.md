# Audit CTO — 2026-10-17

## Santé production : 🟢 VERT

| Service    | Statut |
|------------|--------|
| database   | ✅ ok  |
| ai         | ✅ ok (claude-sonnet-4-6) |
| api        | ✅ ok  |
| site       | ✅ joignable |

- Temps de réponse `/api/health` : **1401 ms** (lent pour un health check — à surveiller)
- Endpoint testé : `https://www.restaumargin.fr/api/health?deep=1`

## CI : 🟢 VERT

- Dernier run CI (push sur main) : **success** — run #1321, commit `1576202` (`coo: operations`)
- 3 derniers runs CI push : tous success
- Note : workflow "Taches automatiques" run #311 en échec ce matin (~06:58 UTC) sur commit `0ff04b0` — c'est un job cron interne, pas le pipeline de build/lint/typecheck. Pas de régression code.

## Métriques produit

| Métrique               | Valeur |
|------------------------|--------|
| Utilisateurs totaux    | 18     |
| Nouveaux utilisateurs (24h) | 0 |
| Abonnés payants        | 0      |
| MRR estimé             | 0 €    |
| Recettes créées        | 62     |
| Ingrédients enregistrés| 436    |

## Métriques code

| Métrique               | Valeur   |
|------------------------|----------|
| Pages frontend         | 185      |
| LOC TypeScript total   | ~220 920 |
| LOC api/index.ts       | 7 817    |
| TODO/FIXME/HACK        | 0        |
| Commits (24h)          | 9        |

## Activité 24h (9 commits)

1. `1576202` coo: operations
2. `3cc29b6` docs: bug-fixer log 2026-10-17
3. `e6e6e76` fix: alert() → toast dans AdminDashboard
4. `03fcd2a` docs(seo): rapport quotidien — @import police bloquant retiré
5. `3b3c823` perf(seo): retire l'@import Google Fonts bloquant du CSS global
6. `0ff04b0` cmo: post + analyse
7. `242da42` ceo: digest quotidien
8. `0056f72` qa: tests quotidiens 2026-10-16
9. `2aa1dba` cfo: analyse quotidienne

## Dette technique — Top 3

### 1. 🔴 `api/index.ts` monolithique (7 817 LOC)
Tout le backend tient dans un seul fichier. Maintenance impossible au-delà d'une certaine taille, conflits git constants entre agents, lisibilité nulle. **Refacto prioritaire** : éclater en `api/routes/` (auth, recipes, ingredients, ai, mercuriale…) comme prévu dans l'architecture cible du CLAUDE.md.

### 2. 🟠 220k LOC pour un produit early-stage (0 payants)
Ratio code/valeur déséquilibré. Beaucoup de pages et fonctionnalités dont l'usage réel n'est pas mesuré. Risque de maintenance croissant. Audit d'utilisation à faire avant d'ajouter de nouvelles pages.

### 3. 🟡 Temps de réponse health check élevé (1401 ms)
Un `/api/health` ne devrait pas mettre 1,4 s. Soit la connexion DB est lente (cold start Supabase), soit le check est trop lourd. À investiguer — impact SEO indirect (TTFB).

## Refacto prioritaire

**Éclater `api/index.ts`** : créer `api/routes/` avec un fichier par domaine métier et importer dans `api/index.ts` via `app.use('/api/...', router)`. Réduction immédiate des conflits entre agents concurrents. Estimé : 2-3 sessions de travail.

## Incidents / alertes

Aucun. Pas de notification envoyée (CI vert, santé OK, site joignable).
