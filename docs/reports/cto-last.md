# Audit CTO — 2026-10-24

## Santé globale : 🟢 VERT

| Service    | Statut | Détail              |
|------------|--------|---------------------|
| database   | ✅ ok  |                     |
| ai         | ✅ ok  | claude-sonnet-4-6   |
| api        | ✅ ok  |                     |
| site       | ✅ ok  | https://www.restaumargin.fr répond |

## CI (source de vérité)

| Workflow | Run | Commit | Conclusion |
|----------|-----|--------|------------|
| CI       | #1326 | `11f224f` (cmo: post + analyse 2026-10-24) | ✅ success |
| CI       | #1325 | `f7fd33d` (ceo: digest quotidien) | ✅ success |

Dernier CI vert sur le HEAD. Aucun job rouge détecté.

## Métriques

| Indicateur              | Valeur    |
|-------------------------|-----------|
| Pages (`client/src/pages/`) | 185   |
| LOC total (TS + TSX)    | ~220 920  |
| LOC `api/index.ts`      | 7 817     |
| TODO/FIXME/HACK         | 0         |
| Commits (dernières 24 h) | 4        |
| Utilisateurs inscrits   | 19        |
| Abonnés payants         | 0         |
| MRR estimé              | 0 €       |

## Dette technique — Top 3

1. **`api/index.ts` à 7 817 LOC** — fichier monolithique ingérable. Toutes les
   routes, middleware, helpers et logique métier sont dans un seul fichier. Risque
   de régression élevé à chaque modification, difficile à relire, impossible à
   tester unitairement. *Priorité : fragmenter par domaine (auth, recipes,
   ingredients, reports, ai, mercuriale…) en sous-routeurs Express.*

2. **185 pages sans code splitting mesuré** — le bundle client n'a pas été
   audité depuis les dernières ajouts de pages. Lazy loading déclaré dans App.tsx
   mais l'impact réel sur le LCP n'est pas mesuré. *Priorité : audit Lighthouse /
   bundle analyzer sur la prod.*

3. **MRR = 0, 0 abonné payant sur 19 inscrits** — signal produit critique. Le
   tunnel d'activation (inscription → essai → abonnement) n'est pas instrumenté ;
   on ne sait pas où les prospects décrochent. *Priorité : ajouter les events
   d'activation dans le code (premiers calculs, première fiche technique, etc.).*

## Refacto prioritaire

**Découper `api/index.ts`** en modules par domaine. Approche suggérée :

```
api/
  routes/
    auth.ts       (existe déjà)
    ai.ts         (existe déjà)
    mercuriale.ts (existe déjà)
    recipes.ts    ← nouveau
    ingredients.ts ← nouveau
    reports.ts    ← nouveau
    admin.ts      ← nouveau
  index.ts        ← 200 LOC max (bootstrap + montage des routeurs)
```

Gain attendu : réduction de `api/index.ts` de 7 817 à ~200 LOC, amélioration
de la lisibilité et de la testabilité.

## Derniers commits (20 derniers)

```
11f224f cmo: post + analyse 2026-10-24
f7fd33d ceo: digest quotidien
d16bc12 qa: tests quotidiens
47f3ce9 cfo: analyse quotidienne
f83fdc1 cto: audit quotidien
1576202 coo: operations
3cc29b6 docs: bug-fixer log 2026-10-17
e6e6e76 fix: alert() → toast dans AdminDashboard
03fcd2a docs(seo): rapport quotidien 2026-10-17
3b3c823 perf(seo): retire l'@import Google Fonts bloquant
0ff04b0 cmo: post + analyse
242da42 ceo: digest quotidien
0056f72 qa: tests quotidiens 2026-10-16
2aa1dba cfo: analyse quotidienne
4b2ff28 cto: audit quotidien
d732aa9 coo: operations
d71fe07 docs: bug-fixer log 2026-10-10
1135926 fix: remplacer alert() navigateur par toast
a2508ab docs(seo): rapport quotidien 2026-10-10
e13f2ab perf(seo): corps complet en HTML statique (18 pages guide-marge)
```
