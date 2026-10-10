# Audit CTO — 2026-10-10

## Santé globale : 🟢 VERT

| Service    | Statut | Détail                    |
|------------|--------|---------------------------|
| database   | ✅ ok  | PostgreSQL / Supabase      |
| ai         | ✅ ok  | claude-sonnet-4-6          |
| api        | ✅ ok  | responseTime 1384 ms       |
| site web   | ✅ ok  | restaumargin.fr accessible |

## CI (source de vérité)

| Run | Workflow | Conclusion | SHA     | Titre |
|-----|----------|------------|---------|-------|
| 38040697160 | CI | ✅ success | d732aa9 | coo: operations |
| 38040606620 | CI | ✅ success | d71fe07 | docs: bug-fixer log 2026-10-10 |
| 38040592914 | CI | ✅ success | 1135926 | fix: alert() → toast FloatingActionBubble |
| 38033734888 | CI | ✅ success | a2508ab | docs(seo): guides SSR vérifiés en prod |
| 38033358579 | CI | ✅ success | e13f2ab | perf(seo): 18 pages guide-marge HTML statique |

Dernière CI sur `main` : **success** (d732aa9). Aucun job rouge.

## Métriques

| Indicateur        | Valeur  |
|-------------------|---------|
| Pages frontend    | 185     |
| LOC total projet  | ~220 912 |
| LOC api/index.ts  | 7 817   |
| Commits 24 h      | 7       |
| TODO/FIXME/HACK   | 0       |
| Utilisateurs      | 18      |
| Recettes          | 62      |
| Ingrédients       | 436     |
| Abonnés payants   | 0       |
| MRR estimé        | 0 €     |
| Nouveaux users 24h| 0       |

## Dette technique — Top 3

### 1. 🔴 api/index.ts : 7 817 LOC (fichier monolithique critique)
Ce fichier concentre toutes les routes, middlewares et logique métier en un seul bloc.  
**Risque** : couplage total, impossibilité de tester unitairement, temps de lecture/merge prohibitif.  
**Priorité** : découpage en modules par domaine (`auth`, `recipes`, `ingredients`, `ai`, `mercuriale`, etc.).

### 2. 🟡 185 pages frontend — ratio pages/composants à auditer
Le projet compte 185 pages. Sans inventaire des composants partagés, le risque de duplication silencieuse est élevé.  
**Action** : audit de réutilisation sur les 20 pages les plus récentes.

### 3. 🟡 responseTime API : 1 384 ms au health check
Le health check `?deep=1` prend > 1 s — indicateur que la connexion Supabase (cold start ou pool insuffisant) ralentit chaque requête.  
**Action** : mesurer le temps de query Prisma isolément, envisager un pool persistent ou PgBouncer.

## Refacto prioritaire

**Découper api/index.ts** en fichiers de routes séparés par domaine.  
Gain : lisibilité, testabilité, onboarding accéléré, CI plus rapide (tree-shaking possible).  
Effort estimé : 2–3 sessions ciblées sans breaking change (Express Router modulaire).

## Activité récente (24 h)

- `fix`: remplacement `alert()` navigateur → toast dans `FloatingActionBubble`
- `perf(seo)`: 18 pages `guide-marge/:slug` rendues en HTML statique (108/108 pages totales, +18 vs 90 avant)
- `docs(seo)`: rapport SSR vérification prod
- `coo`: opérations COO planifiées
- `docs`: log bug-fixer

## Conclusion

Situation saine. CI verte sur tous les commits du jour. Services prod opérationnels.  
La dette majeure reste concentrée sur `api/index.ts` (7 817 LOC) — aucun risque immédiat mais l'entropie s'accélère à chaque feature ajoutée.  
Aucune alerte à envoyer.
