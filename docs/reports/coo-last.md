# COO — Rapport opérationnel 2026-11-28

## Santé des services
- **API** : ok
- **Base de données** : ok
- **IA** : ok (claude-sonnet-4-6)
- **Uptime** : actif
- **Temps de réponse** : 1261 ms

## Données produit
- Utilisateurs total : 21
- Recettes : 64
- Ingrédients : 442
- Nouveaux utilisateurs 24h : 0
- Abonnés Pro : 0 | Business : 0
- MRR estimé : 0 €

## CI (5 derniers runs — branche main)
| Workflow | Résultat | Commit |
|---|---|---|
| CI | success | 69ed863 |
| Taches automatiques RestauMargin | success | f8dbad7 |
| CI | success | f8dbad7 |
| CI | success | 4317e11 |
| CI | success | f8df63b |

→ CI verte sur tous les commits récents.

## GitHub Actions — crons.yml (6 derniers passages)
| Date | Évènement | Résultat |
|---|---|---|
| 2026-11-28T08:14:16Z | schedule | success |
| 2026-11-28T02:42:24Z | schedule | success |
| 2026-11-27T21:30:56Z | schedule | success |
| 2026-11-27T19:28:56Z | schedule | success |
| 2026-11-27T19:24:38Z | schedule | success |
| 2026-11-27T19:23:33Z | schedule | success |

→ Toutes les exécutions planifiées réussies.

## Agents — état des rapports
| Agent | Âge dernier rapport | Statut |
|---|---|---|
| CTO | 116 h | ⚠️ EN PANNE |
| CMO | 3 h | ok |
| CFO | 17 h | ok |
| QA | 14 h | ok |

**Agent CTO en panne** : dernier rapport il y a 116 h (> 48 h). Cause probable : quota hebdomadaire Claude épuisé. À vérifier.

## 3 actions du jour
1. Surveiller la reprise du CTO — vérifier si quota Claude rétabli en fin de journée.
2. Maintenir le rythme d'acquisition : 0 nouvel utilisateur en 24h, lancer une action marketing légère (CMO).
3. Vérifier la performance du déploiement AppLayout (commit f8dbad7) — perf/seo chunk séparé.
