# Audit CTO — 2026-11-08

## Santé globale : 🟢 VERT

### Services
| Service   | Statut | Détail                  |
|-----------|--------|-------------------------|
| database  | ✅ ok  |                         |
| ai        | ✅ ok  | claude-sonnet-4-6       |
| api       | ✅ ok  |                         |

### CI (branche main)
- Dernier run CI : **success** (`12b94e3`) — `seo(weekly+eat): bilan S45`
- 10 derniers runs CI : tous **success**
- Aucun job rouge détecté

## Métriques
| Indicateur          | Valeur  |
|---------------------|---------|
| Pages frontend      | 188     |
| LOC total TypeScript| 216 305 |
| LOC api/index.ts    | 7 819   |
| Commits (24 h)      | 12      |
| Utilisateurs totaux | 21      |
| Essais actifs       | 1       |
| Abonnés payants     | 0       |
| MRR                 | 0 €     |

## Dette technique — Top 3

### 1. 🔴 `api/index.ts` : fichier monolithique (7 819 LOC)
Toutes les routes API sont dans un seul fichier de 7 819 lignes. L'extraction vers `api/routes/` est amorcée dans le CLAUDE.md mais pas encore appliquée. Ce fichier est la première source de conflits de merge et ralentit la lecture de code.

**Refacto prioritaire** : extraire progressivement les groupes de routes (auth, recettes, ingrédients, mercuriale, IA) vers des fichiers dédiés — même pattern que `api/routes/ai.ts` / `api/routes/mercuriale.ts` mentionnés dans CLAUDE.md.

### 2. 🟡 Zéro test automatisé côté client
La CI passe (build + tsc) mais ne couvre pas les comportements produit. Les régressions ne sont détectées qu'en production. Priorité : au moins des smoke tests sur les pages critiques (calculateur food cost, fiche recette).

### 3. 🟡 Stagnation de conversion (0 payant / 21 users)
Point technique : le tunnel trial → payant n'a aucun event de tracking instrumenté. Sans données, impossible d'identifier où les trials abandonnent. Ajouter les events minimum (`trial_started`, `feature_used`, `checkout_opened`) dans l'API.

## Refacto prioritaire
**Éclater `api/index.ts`** en modules de routes. Réduire le fichier en dessous de 1 000 LOC. Approche recommandée : router Express par domaine (auth, recipes, ingredients, mercuriale, ai, tools), un fichier par domaine.

## Commits du jour (12)
```
12b94e3 seo(weekly+eat): bilan S45, essai 7 jours
bca6b84 seo(eat): signature auteur sur 4 articles
3e2ed0e coo: operations
a53e874 docs: bug-fixer log 2026-11-08
922f892 fix(i18n): traduire 9 chaînes VoiceCommandButton
c988dff cmo: post + analyse 2026-11-08
f360077 ceo: digest quotidien
85895ef qa: tests quotidiens
b82dc73 cfo: analyse quotidienne
9579e97 docs(seo): rapport quotidien 2026-11-07
2f0f8ee perf(seo): retire chunk vendor-icons
68a82fb cto: audit quotidien
```

## Alertes actives
Aucune.
