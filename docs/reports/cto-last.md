# Audit CTO — 2026-11-21

## Santé globale : 🟢 VERT

| Service    | Statut | Détail                   |
|------------|--------|--------------------------|
| database   | ✅ ok  |                          |
| ai         | ✅ ok  | claude-sonnet-4-6        |
| api        | ✅ ok  |                          |
| Site web   | ✅ ok  | restaumargin.fr joignable |

## CI (source de vérité)

Derniers 10 runs sur `main` : **tous SUCCESS**

| Run ID      | Workflow                        | Résultat | SHA     |
|-------------|---------------------------------|----------|---------|
| 44905108459 | Taches automatiques RestauMargin | success  | 87df9fb |
| 44893411419 | CI                              | success  | 87df9fb |
| 44893399699 | CI                              | success  | 3fbd9e9 |
| 44893382069 | CI                              | success  | c15363d |
| 44880660866 | Taches automatiques RestauMargin | success  | 034986e |
| 44879132015 | CI                              | success  | 034986e |
| 44869482506 | CI                              | success  | 87a4ba4 |
| 44860002645 | Taches automatiques RestauMargin | success  | e8cfa80 |
| 44823710970 | Taches automatiques RestauMargin | success  | e8cfa80 |
| 44813089612 | Taches automatiques RestauMargin | success  | e8cfa80 |

## Métriques

| Indicateur              | Valeur       |
|-------------------------|--------------|
| Pages React             | 188          |
| LOC client/src (tsx)    | ~181 600     |
| LOC api/index.ts        | 7 825        |
| LOC api-lib/            | 12 165       |
| LOC total TypeScript    | ~216 300     |
| Commits dernières 24h   | 7            |
| TODO/FIXME/HACK         | 0            |

## Commits 24h

```
87df9fb docs: bug-fixer log 2026-11-21
3fbd9e9 coo: operations
c15363d fix(notifications): remplacer window.location.href par navigate() + traduire labels footer
034986e cmo: post + analyse
87a4ba4 ceo: digest quotidien
e8cfa80 qa: tests quotidiens 2026-11-20
fa89f0b cfo: analyse quotidienne
```

## Dette technique — Top 3

### 1. `api/index.ts` : monolithe 7 825 LOC (critique)
Toutes les routes, middlewares et logique métier sont concentrés dans un seul fichier. `api-lib/routes/` existe déjà avec une structure modulaire (ai.ts, auth.ts, admin.ts, mercuriale.ts, inventory.ts…) mais `api/index.ts` n'est pas migré. Risque : impossible à maintenir, conflits de merge fréquents entre agents.

### 2. Pages client géantes (lourd)
Quatre pages dépassent 3 000 LOC :
- `Recipes.tsx` : 4 497 LOC
- `Suppliers.tsx` : 3 767 LOC
- `Clients.tsx` : 3 348 LOC
- `HACCP.tsx` : 3 270 LOC

Ces fichiers devraient être découpés en sous-composants dans `client/src/components/`.

### 3. `api-lib/routes/ai.ts` : 2 919 LOC (modéré)
Route IA très volumineuse regroupant ~19 actions hétérogènes. Candidat à une organisation par domaine fonctionnel (suggestions, analyse, voice, optimisation).

## Refacto prioritaire

**Migrer `api/index.ts` → `api-lib/routes/`**

Plan :
1. Identifier les routes non encore présentes dans `api-lib/routes/` (export, referrals, subscriptions…)
2. Créer les fichiers manquants dans `api-lib/routes/`
3. Faire pointer `api/index.ts` vers `api-lib/` en mode façade (< 100 LOC)
4. Valider CI avant suppression du code migré

Impact estimé : réduction de 90 % du monolithe, meilleure parallélisation des agents.
