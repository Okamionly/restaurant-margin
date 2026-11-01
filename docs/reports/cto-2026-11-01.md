# Audit CTO — 2026-11-01

## Santé globale : 🟢 VERT

| Service    | Statut | Détail                  |
|------------|--------|-------------------------|
| database   | ✅ ok  |                         |
| ai         | ✅ ok  | claude-sonnet-4-6       |
| api        | ✅ ok  |                         |
| CI (main)  | ✅ ok  | dernier commit 275200e success |
| Site web   | ✅ ok  | /api/health répond      |

## CI — État

Dernier run CI : **success** sur `275200e` (coo: operations).  
Les 10 derniers runs (CI + Taches automatiques) sont tous **success**. Aucun job rouge.

## Métriques

| Indicateur               | Valeur   |
|--------------------------|----------|
| Pages frontend           | 185      |
| LOC totales (ts/tsx)     | 220 921  |
| LOC api/index.ts         | 7 817    |
| Commits (24 h)           | 5        |
| TODO/FIXME/HACK          | 0        |
| Utilisateurs total       | 20       |
| Nouveaux utilisateurs 24h| 0        |
| Trial actifs             | 1        |
| Abonnés payants          | 0        |
| MRR estimé               | 0 €      |
| Recettes                 | 63       |
| Ingrédients              | 439      |

## Commits des dernières 24h

```
275200e coo: operations
1418fb4 docs: bug-fixer log 2026-11-01
c57baca fix: alert() → showToast() dans la sidebar AppLayout
54b37a8 ceo: digest quotidien
c987f4d qa: tests quotidiens 2026-10-31
```

## Dette technique — Top 3

### 1. `api/index.ts` monolithique (7 817 LOC) — HAUTE PRIORITÉ
Un seul fichier centralise toutes les routes API. Cela rend la maintenance difficile, ralentit les revues de code et crée des conflits de merge fréquents. L'architecture prévue existe déjà partiellement (`api/routes/auth.ts`, `api/routes/ai.ts`, `api/routes/mercuriale.ts`) mais la migration est incomplète.

### 2. 185 pages frontend — bundle size à surveiller
La croissance du nombre de pages (185) sans audit du lazy-loading peut dégrader le TTI. Vérifier que toutes les pages non-critiques passent bien par `React.lazy()` dans `App.tsx`.

### 3. Zéro abonné payant — dette produit/conversion
Le produit est fonctionnel (20 comptes, 63 recettes, 439 ingrédients) mais le funnel de conversion ne fonctionne pas (MRR = 0 €, 1 seul trial). C'est une dette produit autant que technique : les flows d'onboarding et de paywall méritent une revue critique.

## Refacto prioritaire

**Éclater `api/index.ts`** en modules de routes par domaine :
- `api/routes/ingredients.ts`
- `api/routes/recipes.ts`
- `api/routes/users.ts`
- `api/routes/dashboard.ts`
- etc.

Approche recommandée : extraction progressive par domaine, 1 fichier par PR, sans régression sur les routes existantes.

## Résumé

Situation stable. CI verte, services en ligne, aucun TODO critique dans le code. La priorité immédiate reste la réduction du monolithe `api/index.ts` et l'amélioration du funnel de conversion (0 abonné payant sur 20 comptes).
