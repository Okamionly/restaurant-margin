# Audit CTO — 2026-11-04

**Heure** : 13:20 UTC  
**HEAD** : `cafe7a4` — mrr: rapport hebdo 2026-11-02 — API indisponible (Prisma timeout)

---

## Santé : 🟢 VERT

| Service  | Statut | Détail                   |
|----------|--------|--------------------------|
| database | ✅ ok  | Supabase/Postgres         |
| ai       | ✅ ok  | claude-sonnet-4-6         |
| api      | ✅ ok  | uptime 13 s, 8 ms latence |

Résultat confirmé par double appel (pas d'alerte nécessaire).

---

## CI

Workflow visible : **"Taches automatiques RestauMargin"** (`crons.yml`) — 10 dernières exécutions toutes en `success`.

> ⚠️ Aucun pipeline CI dédié au type-check / build n'apparaît dans les 10 dernières exécutions GitHub Actions (branche `main`). Soit il n'existe pas, soit il n'a pas été déclenché récemment. À confirmer — sans lui, les régressions TypeScript ne sont pas détectées automatiquement sur chaque commit.

**Pas d'alerte CI requise.**

---

## Métriques

| Indicateur               | Valeur       |
|--------------------------|-------------|
| Pages React              | 185          |
| LOC client (ts/tsx)      | ~213 000     |
| LOC api/index.ts         | 7 817        |
| Commits dans les 24 h    | 0            |
| TODO / FIXME / HACK      | 0            |

---

## Dette technique — Top 3

### 1. 🔴 `api/index.ts` monolithique (7 817 LOC)
Fichier critique, ingérable. Même si des sous-fichiers `api/routes/*.ts` existent, l'essentiel du code reste dans un seul fichier. Risque : merge conflicts constants, temps de lecture prohibitif, onboarding impossible.  
**Priorité** : découpage en modules `api/routes/` + barril `api/index.ts` réduit à < 100 LOC.

### 2. 🟠 Absence de CI type-check/build sur `main`
Un `tsc --noEmit` automatique sur chaque push éviterait les régressions silencieuses. Sans lui, la seule source de vérité TypeScript est le dev local.  
**Priorité** : ajouter un job `ci.yml` simple (node install + tsc + vite build).

### 3. 🟡 185 pages React — pas de structure de dossiers par domaine
Avec autant de pages dans `client/src/pages/`, la navigation est difficile. Regrouper par domaine (`menu/`, `suppliers/`, `analytics/`, `public/`) réduirait le temps de recherche.  
**Priorité** : refactoring organisationnel, sans impact fonctionnel.

---

## Refacto prioritaire

**Découper `api/index.ts`** : extraire les blocs de routes par domaine (auth, menu, recettes, ingrédients, mercuriale, IA, utilisateur, parrainage) vers `api/routes/<domaine>.ts`. Effort estimé : 2–3 sessions. Bénéfice immédiat sur la maintenabilité et les revues de code.

---

## Résumé

Pas d'incident à signaler. Services en ligne, CI crons verte, zéro dette marquée (TODO/FIXME/HACK). La dette principale est structurelle : `api/index.ts` à 7 817 lignes est un monolithe qui ralentit toute évolution backend.
