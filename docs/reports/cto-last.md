# Rapport CTO — 2026-11-22

## Santé globale : 🟢 VERT

| Service    | Statut | Détail                   |
|------------|--------|--------------------------|
| database   | ✅ ok  | —                        |
| ai         | ✅ ok  | claude-sonnet-4-6        |
| api        | ✅ ok  | responseTime: 1122 ms    |
| site       | ✅ ok  | restaumargin.fr joignable|

> Remarque : responseTime à 1122 ms — légèrement élevé (seuil d'alerte conseillé : 2000 ms). À surveiller.

---

## CI — 🟢 Verte

| Run  | Workflow | SHA     | Résultat | Déclencheur           |
|------|----------|---------|----------|-----------------------|
| 1485 | CI       | 5d3cdf0 | ✅ success | push — coo: operations |
| 1484 | CI       | 17f94e1 | ✅ success | push — docs: bug-fixer |
| 1483 | CI       | b29050a | ✅ success | push — fix(i18n)       |
| 1482 | CI       | 6c49c42 | ✅ success | push — seo(weekly)     |
| 1481 | CI       | 66e9f58 | ✅ success | push — ceo: digest     |

Aucun job rouge. Dernier commit validé : `5d3cdf0` (coo: operations).

---

## Métriques

| Métrique              | Valeur     |
|-----------------------|------------|
| Pages (client/src/pages/) | 188    |
| LOC total (TS/TSX)    | ~216 321   |
| api/index.ts          | 7 825 lignes |
| TODO / FIXME / HACK   | 0          |
| Commits (24 h)        | 8          |

---

## Dette technique — Top 3

### 1. 🔴 `api/index.ts` monolithique (7 825 lignes)
Fichier unique contenant toutes les routes API. Difficile à lire, tester et faire évoluer. Priorité haute de découpage en modules (auth, recipes, ingredients, ai, mercuriale, etc.).

### 2. 🟠 Croissance rapide des pages (188 pages)
Risque de duplication de logique et de composants similaires non mutualisés. Audit de similarité à planifier pour identifier les pages candidates à factorisation.

### 3. 🟡 responseTime API à 1122 ms
Le health check `/api/health?deep=1` répond en 1,1 s — probablement lié à la connexion Supabase froide. Envisager un keep-alive de connexion ou un pool de connexion persistant.

---

## Refacto prioritaire

**Découpage de `api/index.ts`** : extraire chaque domaine fonctionnel vers `api/routes/<domaine>.ts` (pattern déjà amorcé avec `mercuriale.ts`, `ai.ts`, `auth.ts`). Travail estimé : 3–4 sessions, faisable par un agent dédié.

---

## Commits des dernières 24 h (8 commits)

```
5d3cdf0 coo: operations
17f94e1 docs: bug-fixer log 2026-11-22
b29050a fix(i18n): remplacer strings françaises hardcodées dans handleAiSuggest
6c49c42 seo(weekly): bilan semaine 47
66e9f58 ceo: digest quotidien
bb4bdf3 qa: tests quotidiens
a35579a cfo: analyse quotidienne
0b0ccc6 cto: audit quotidien
```

---

*Généré automatiquement — 2026-11-22T13:18 UTC*
