# Rapport CTO — RestauMargin — 2026-11-14

**Généré** : 2026-11-14 (après-midi)

---

## Santé production — VERT ✅

| Service   | Statut |
|-----------|--------|
| database  | ✅ ok  |
| ai        | ✅ ok (claude-sonnet-4-6) |
| api       | ✅ ok  |
| site web  | ✅ joignable |

---

## CI — VERT ✅

- Dernier run CI (#1446) : **success** — commit `faf5ae5` ("coo: operations")
- 10 derniers runs CI sur main : **tous success**
- Aucun job rouge détecté

---

## Métriques codebase

| Indicateur            | Valeur  |
|-----------------------|---------|
| Pages React           | 188     |
| LOC TypeScript total  | 216 316 |
| LOC api/index.ts      | 7 819   |
| Commits (24 h)        | 9       |

---

## Dette technique — TODO/FIXME/HACK

**Aucune annotation TODO/FIXME/HACK** trouvée dans `client/src/` ni dans `api/`.

---

## Top 3 dette technique (analyse structurelle)

### 1. `api/index.ts` — fichier monolithique (7 819 LOC) 🔴

Fichier unique de 7 819 lignes contenant toutes les routes API. Risque de conflits de merge, difficulté de maintenance, chargement intégral à chaque restart.

**Refacto prioritaire** : découper en modules par domaine (auth, ingredients, recipes, mercuriale, ai…) dans `api/routes/`, pattern déjà partiellement amorcé (`api/routes/auth.ts`, `mercuriale.ts`).

### 2. 188 pages React — cohérence des patterns 🟡

Avec 188 pages, le risque de divergence stylistique et de duplication de logique est élevé (fetch patterns, error handling, loading states).

**Action** : audit de 5 pages aléatoires pour détecter les copy-paste patterns et candidats à des hooks réutilisables.

### 3. i18n — toasts codés en dur récurrents 🟡

Deux corrections i18n en 48 h (commits `95208d7`, `287b998`) suggèrent un pattern systémique : les toasts sont ajoutés en français sans passer par `t()`.

**Action** : ajouter une règle ESLint custom interdisant les strings littérales dans les appels `toast()`.

---

## Refacto prioritaire

**`api/index.ts` → découpage modulaire**

Plan minimal en 3 étapes :
1. Extraire les routes `/api/recipes/*` → `api/routes/recipes.ts`
2. Extraire les routes `/api/ingredients/*` → `api/routes/ingredients.ts`
3. `api/index.ts` ne fait plus que `app.use()` les routeurs

Gain attendu : fichiers de 300–500 LOC, merge conflicts éliminés, tests unitaires par domaine possibles.

---

## Commits dernières 24 h (9 commits)

| SHA | Message |
|-----|---------|
| faf5ae5 | coo: operations |
| 9af85c6 | docs: bug-fixer log 2026-11-14 |
| 95208d7 | fix(i18n): traduire 2 toasts PriceAlertSetup Marketplace codés en dur |
| baa28fe | docs(seo): rapport quotidien 2026-11-14 |
| 4236fb9 | perf(seo): sort NotificationCenter et AssistantWidget du chunk d'entree |
| b31222b | cmo: post + analyse |
| 1a3cc41 | ceo: digest quotidien 2026-11-14 |
| 4f08124 | qa: tests quotidiens 2026-11-13 |
| 2c9ae20 | cfo: analyse quotidienne |

Activité dense : 9 commits en 24 h. Mix rapports automatiques + fixes i18n + optimisation perf (chunk entrée -16 % gzip).

---

## Conclusion

Produit en bonne santé opérationnelle. CI verte, production accessible, tous services ok. La dette principale reste la taille de `api/index.ts` (7 819 LOC). La récurrence des corrections i18n sur les toasts mérite une règle de lint préventive.
