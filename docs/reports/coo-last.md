# COO — Rapport opérationnel — 2026-11-22

Généré le : 2026-11-22T10:14 UTC

---

## 1. Santé des services

| Service  | Statut |
|----------|--------|
| database | ✅ ok  |
| ai       | ✅ ok (claude-sonnet-4-6) |
| api      | ✅ ok  |

Temps de réponse health check : **1381 ms** (lent — à surveiller)
Uptime process : 2 s (redémarrage récent possible)

---

## 2. Données produit

| Indicateur          | Valeur |
|---------------------|--------|
| Utilisateurs totaux | 21     |
| Recettes            | 64     |
| Ingrédients         | 442    |
| Nouveaux 24h/48h    | 0 / 0  |
| Abonnés pro         | 0      |
| Abonnés business    | 0      |
| Utilisateurs essai  | 0      |
| MRR estimé          | 0 €    |

---

## 3. CI / Déploiements (branche main)

| Run                            | Conclusion | Commit  |
|--------------------------------|-----------|---------|
| CI (en cours)                  | in_progress | b29050a |
| CI                             | ✅ success  | 6c49c42 |
| Taches automatiques            | ✅ success  | 66e9f58 |
| CI                             | ✅ success  | 66e9f58 |
| Taches automatiques            | ✅ success  | bb4bdf3 |

Dernier commit : `b29050a fix(i18n): remplacer strings françaises hardcodées dans handleAiSuggest`
CI démarré à 10:13:44 UTC — pas encore de conclusion.

---

## 4. Tâches GitHub Actions (crons.yml)

| Heure              | Événement | Résultat     |
|--------------------|-----------|--------------|
| 2026-11-22 07:13   | schedule  | ✅ success   |
| 2026-11-22 02:15   | schedule  | ✅ success   |
| 2026-11-21 20:32   | schedule  | ✅ success   |
| 2026-11-21 19:36   | schedule  | ✅ success   |
| 2026-11-21 17:16   | schedule  | ✅ success   |
| 2026-11-21 14:59   | schedule  | ✅ success   |

Dernier passage : il y a ~3h — **toutes les exécutions success**.

---

## 5. Agents (dernier rapport — âge via git commit)

| Agent | Âge dernier rapport | Statut |
|-------|---------------------|--------|
| CTO   | ~20h                | ✅ OK  |
| CMO   | ~27h                | ✅ OK  |
| CFO   | ~17h                | ✅ OK  |
| QA    | ~14h                | ✅ OK  |

**Aucun agent en panne.**

---

## 6. Actions du jour

1. **Surveiller la fin du CI b29050a** — fix i18n en cours, vérifier que le déploiement passe sans régression.
2. **Investiguer le temps de réponse** — health check à 1381 ms est anormalement lent ; vérifier les requêtes Prisma et la latence Supabase.
3. **Activation d'essai** — 21 comptes, 0 abonné payant, 0 en essai actif ; prioriser l'onboarding in-app pour convertir les inscrits existants.
