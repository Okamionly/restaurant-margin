# Rapport COO — 2026-11-16

## Santé des services
- **API** : ok
- **Base de données** : ok
- **IA** : ok (claude-sonnet-4-6)
- **Uptime** : 2 s (redémarrage récent)
- Réponse health : 1 471 ms → parallélisation DB/IA mergée ce matin, amélioration attendue ~700 ms

## Données produit
- Utilisateurs total : 21
- Recettes : 64 | Ingrédients : 442
- Nouveaux inscrits 24 h : 0
- Abonnés Pro : 0 | MRR : 0 €

## CI (derniers runs)
| Run | Commit | Statut |
|-----|--------|--------|
| #1463 | docs: bug-fixer log 2026-11-16 | in_progress |
| #1462 | fix(health): paralleliser sondes DB et IA | in_progress |
| #1461 | cmo: post + analyse 2026-11-16 | ✅ success |
| #1460 | mrr: rapport hebdo 2026-11-16 | ✅ success |

Dernier CI complété : **success**. Deux runs in_progress au moment du rapport.

## Tâches GitHub Actions (crons.yml)
| Run | Date | Évènement | Résultat |
|-----|------|-----------|----------|
| #624 | 2026-11-16 07:00 | schedule | ✅ success |
| #623 | 2026-11-16 06:32 | schedule | ✅ success |
| #622 | 2026-11-15 22:50 | schedule | ✅ success |
| #621 | 2026-11-15 19:01 | schedule | ✅ success |
| #620 | 2026-11-15 17:12 | schedule | ❌ failure |
| #619 | 2026-11-15 16:54 | schedule | ✅ success |

Dernier passage : **success**. Un échec isolé hier (17 h 12) suivi d'une reprise immédiate — pas d'alerte.

## Agents (rapport > 48 h = panne)
| Agent | Dernier rapport | État |
|-------|----------------|------|
| cto   | il y a 20 h    | ✅ OK |
| cmo   | il y a 2 h     | ✅ OK |
| cfo   | il y a 17 h    | ✅ OK |
| qa    | il y a 14 h    | ✅ OK |

Aucun agent en panne.

## 3 actions du jour
1. **Surveiller les deux CI in_progress** — fix(health) et bug-fixer log engagés ce matin ; vérifier qu'ils passent au vert avant midi.
2. **Investiguer le pool timeout BDD** — le CMO a signalé des métriques indisponibles ce matin à cause d'un pool timeout ; surveiller `api/health?deep=1` et les logs Supabase pour identifier si c'est ponctuel ou récurrent.
3. **Plan d'activation abonnés** — 21 utilisateurs, 0 payant ; préparer un parcours d'upsell ciblé sur les inscrits les plus actifs (recettes > 5) pour déclencher la première conversion.
