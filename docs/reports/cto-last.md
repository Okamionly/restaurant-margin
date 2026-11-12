# Audit CTO — 2026-11-12

## Santé globale : 🟢 VERT

| Service    | Statut |
|------------|--------|
| HTTP       | ✅ 200 |
| database   | ✅ ok  |
| ai         | ✅ ok (claude-sonnet-4-6) |
| api        | ✅ ok  |

## CI (source de vérité)

| Run ID       | Workflow            | Conclusion | SHA     | Titre |
|--------------|---------------------|------------|---------|-------|
| 43198715876  | CI                  | ✅ success | 00e3d1c | coo: operations |
| 43198618228  | CI                  | ✅ success | b4451e7 | docs: bug-fixer log 2026-11-12 |
| 43198575243  | CI                  | ✅ success | 287b998 | fix(i18n): traduire 7 toasts InvoiceScanner |
| 43195191022  | Taches automatiques | ✅ success | 70d6ce9 | — |
| 43181928826  | CI                  | ✅ success | 70d6ce9 | docs(seo): rapport quotidien 2026-11-12 |

**Résultat : CI verte sur les 10 derniers runs. Aucun job rouge.**

## Métriques

| Indicateur         | Valeur  |
|--------------------|---------|
| Pages (client/src/pages/) | 188    |
| LOC totaux (TS/TSX) | 216 311 |
| LOC api/index.ts   | 7 819   |
| LOC client/src/App.tsx | 1 464 |
| Commits 24 h       | 9       |

## Activité récente (20 derniers commits)

```
00e3d1c coo: operations
b4451e7 docs: bug-fixer log 2026-11-12
287b998 fix(i18n): traduire 7 toasts InvoiceScanner codés en dur
70d6ce9 docs(seo): rapport quotidien 2026-11-12
892b965 seo(boost): coefficient multiplicateur
f0b1ec9 cmo: post + analyse 2026-11-12
ac8edf5 ceo: digest quotidien
45474f9 qa: tests quotidiens 2026-11-11 — 15/15 OK
ae1899a cfo: analyse quotidienne
46a030e seo(accueil): texte de repli aligné, lastmod 09/11
```

## TODO / FIXME / HACK

**Aucun** marqueur de dette détecté dans le code source.

## Dette technique — Top 3

### 1. 🔴 `api/index.ts` : 7 819 lignes — monolithe critique
Toutes les routes, middlewares et logique métier dans un seul fichier.
Risque : collision de modifications entre agents, conflits git fréquents, lecture impossible.
**Refacto prioritaire** : extraire les routes en modules `api/routes/*.ts` (pattern déjà utilisé pour `auth.ts`, `ai.ts`, `mercuriale.ts`).

### 2. 🟠 `client/src/App.tsx` : 1 464 lignes — routeur et sidebar surchargés
App.tsx cumule la définition des routes, la sidebar, et la logique d'auth.
**Action** : extraire la sidebar dans `client/src/components/Sidebar.tsx`.

### 3. 🟡 Codebase 216 k LOC pour 188 pages
Ratio ~1 150 LOC/page. Acceptable mais révèle des composants de pages gonflés.
Surveiller la croissance ; au-delà de 250 k LOC, envisager un audit de dead code.

## Refacto prioritaire

**Découper `api/index.ts`** : sortir au minimum les routes les plus longues (facturation, dashboard, recettes) vers des fichiers séparés dans `api/routes/`. Objectif : ramener `api/index.ts` sous 500 lignes.

## Conclusion

Journée saine : CI verte, tous les services opérationnels, aucun TODO actif. La seule menace structurelle reste le monolithe `api/index.ts` qui grossit commit après commit.
