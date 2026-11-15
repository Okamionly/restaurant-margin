# Audit CTO — 2026-11-15

## Santé globale : 🟢 VERT

| Service   | Statut |
|-----------|--------|
| database  | ✅ ok  |
| ai        | ✅ ok (claude-sonnet-4-6) |
| api       | ✅ ok  |
| site      | ✅ joignable |

- Uptime au check : 213 s (redémarrage récent — à surveiller)
- Temps de réponse API : **1377 ms** (lent — seuil acceptable ≤ 800 ms)

---

## CI : 🟢 VERT

| Run | Workflow | Conclusion | Commit |
|-----|----------|------------|--------|
| #1455 | CI | **success** | `e73bb9e` seo(weekly) semaine 46 |
| #1454 | CI | success | `41cd187` coo: operations |
| #1453 | CI | success | `30ba37d` docs: bug-fixer log |
| #1452 | CI | success | `959297d` fix: i18n toast sidebar |
| #1451 | CI | success | `6602447` cmo: post + analyse |
| #1450 | CI | success | `8a00bea` ceo: digest quotidien |

Dernier passage CI vert sur `e73bb9e` (HEAD main). Aucun job rouge.

---

## Métriques

| Indicateur | Valeur |
|-----------|--------|
| Pages React | 188 |
| LOC api/index.ts | **7 819** |
| Commits 24 h | ~7 |
| Utilisateurs totaux | 21 |
| Recettes | 64 |
| Ingrédients | 442 |
| Nouveaux utilisateurs 24 h | 0 |
| Abonnés payants | 0 |
| MRR estimé | 0 € |
| TODO/FIXME/HACK | **0** |

---

## Dette technique — Top 3

### 1. 🔴 api/index.ts — monolithe à 7 819 lignes
Toutes les routes, middlewares et logique métier sont concentrés dans un seul fichier.
Risque : modifications difficiles, conflits de merge fréquents, temps de review élevé.
**Action** : découper en modules `routes/`, `middlewares/`, `services/` (déjà amorcé dans `api/routes/`).

### 2. 🟠 Uptime 213 s au moment du check
Le serveur a redémarré moins de 4 minutes avant l'audit. Pas de route CI rouge associée.
Peut être un redémarrage Render/hébergeur normal (cold start), mais à confirmer sur les prochains audits.
**Action** : vérifier les logs hébergeur si l'uptime reste < 10 min lors du prochain audit.

### 3. 🟡 Temps de réponse API à 1 377 ms
Le endpoint `/api/health?deep=1` répond en 1,4 s — deux fois le seuil cible (700 ms).
Peut indiquer une query DB lente dans le health-check lui-même, ou une latence réseau Supabase.
**Action** : simplifier le health-check (ping DB sans query lourde) ou mettre un cache court.

---

## Refacto prioritaire

**Découpage de `api/index.ts`** — priorité haute.
Le fichier dépasse 7 800 lignes. Les routes `auth`, `ai` et `mercuriale` sont déjà externalisées dans `api/routes/` mais le reste du code (ingrédients, recettes, fiches techniques, etc.) reste dans le monolithe. Objectif : ≤ 500 LOC dans `index.ts`, tout le reste en modules.

---

## Activité récente (20 derniers commits)

```
e73bb9e seo(weekly): bilan semaine 46 — marque #1, logiciel #2, calcul marge #6
41cd187 coo: operations
30ba37d docs: bug-fixer log 2026-11-15
959297d fix: i18n toast sidebar — remplacer chaîne FR codée en dur
6602447 cmo: post + analyse 2026-11-15
8a00bea ceo: digest quotidien 2026-11-15
baac4b3 qa: tests quotidiens 2026-11-14
afcc823 cfo: analyse quotidienne
68d4346 cto: audit quotidien
faf5ae5 coo: operations
9af85c6 docs: bug-fixer log 2026-11-14
95208d7 fix(i18n): traduire 2 toasts PriceAlertSetup Marketplace codés en dur
baa28fe docs(seo): rapport quotidien 2026-11-14 — chunk d'entree -16 % gzip
4236fb9 perf(seo): sort NotificationCenter et AssistantWidget du chunk d'entree
b31222b cmo: post + analyse
1a3cc41 ceo: digest quotidien 2026-11-14
4f08124 qa: tests quotidiens 2026-11-13 — 15/15 OK, CI vert
2c9ae20 cfo: analyse quotidienne
7fb5203 qa: tests quotidiens 2026-11-12
e94f408 cfo: analyse quotidienne 2026-11-12
```

---

*Généré automatiquement — 2026-11-15T13:18 UTC*
