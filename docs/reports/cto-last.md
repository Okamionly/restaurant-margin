# Audit CTO — 2026-11-16

## Santé globale : 🟢 VERT

| Service    | Statut | Détail                   |
|------------|--------|--------------------------|
| database   | ✅ ok  | —                        |
| ai         | ✅ ok  | claude-sonnet-4-6        |
| api        | ✅ ok  | —                        |
| uptime     | ✅     | 611 s à l'instant        |
| responseTime | ⚠️   | 1118 ms (seuil cible <500ms) |

## CI — Dernier commit main

| Run ID       | Workflow | Résultat   | SHA     |
|--------------|----------|------------|---------|
| 43869021875  | CI       | ✅ success | 87fa285 |
| 43867622630  | CI       | ✅ success | 28b2a66 |
| 43847114224  | CI       | ✅ success | 32d6fc9 |

10 derniers runs main : tous **success**. CI verte.

## Métriques

| Indicateur         | Valeur  |
|--------------------|---------|
| Pages (TSX)        | 188     |
| LOC total TS/TSX   | ~216 317|
| LOC api/index.ts   | 7 825   |
| LOC App.tsx        | 1 470   |
| Commits (24 h)     | 10      |
| TODO/FIXME/HACK    | 0       |

## Dette technique — Top 3

### 1. 🔴 `api/index.ts` monolithique (7 825 LOC)
Le backend tient dans un seul fichier. Toute lecture ou modification est coûteuse. Risque de conflits en cas de contributions parallèles.  
**Action** : découper en modules `api/routes/`, `api/middleware/`, `api/services/` — déjà amorcé partiellement (routes auth, ai, mercuriale existent).

### 2. 🟠 `App.tsx` trop chargé (1 470 LOC)
Routing + sidebar + providers dans un seul fichier. Ralentit l'édition et nuit à la lisibilité.  
**Action** : extraire la sidebar dans `components/Sidebar.tsx` et regrouper les routes par domaine.

### 3. 🟡 Duplication pages `Alternative*.tsx` (16 fichiers)
16 pages de comparaison concurrents suivent le même template. Toute modification UX doit être répercutée 16 fois.  
**Action** : créer un composant générique `AlternativePage` paramétré par les données concurrentes.

## Refacto prioritaire

**Découpage `api/index.ts`** — rapport bénéfice/risque le plus élevé. Un fichier de 7 825 LOC non découpé est le principal risque de régresssion future. Proposer une branche `refacto/api-split` avec migration progressive des routes métier.

## Commits 24 h (10)

```
87fa285 seo(boost): intro du hub dérivée de la grille unique
28b2a66 seo(boost): calcul marge restaurant
32d6fc9 coo: operations
acccad1 docs: bug-fixer log 2026-11-16
3ba9a45 fix(health): paralleliser sondes DB et IA dans /api/health?deep=1
9d743e7 cmo: post + analyse 2026-11-16
238f8ee mrr: rapport hebdo 2026-11-16
36e6c7f ceo: digest quotidien
6d8c409 qa: tests quotidiens 2026-11-15 — 15/15 OK, API OK, CI vert
033150b cfo: analyse quotidienne
```

Cadence soutenue. Fix health check parallélisé ce matin — pertinent (responseTime encore à 1118 ms, à surveiller).

---
*Généré automatiquement — 2026-11-16 13:24 UTC*
