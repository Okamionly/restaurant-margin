# Rapport CMO — 2026-11-16

## Métriques

| Indicateur | Valeur |
|---|---|
| Total users | N/D (erreur BDD) |
| Nouveaux users 24h | N/D |
| Leads réels | N/D |
| MRR estimé | N/D |
| Pages blog (Blog*.tsx) | 64 |

**Note** : L'endpoint `/api/agents/data` a retourné une erreur de connexion PostgreSQL (connection pool timeout). Les métriques seront disponibles lors de la prochaine fenêtre stable.

## Post publié

Fichier : `docs/marketing/social-posts/2026-11-16.md`

**Thème** : Food cost — 4 réflexes pour garder le contrôle de ses marges.

**CTA** : https://www.restaumargin.fr/outils/calculateur-food-cost

**Format** : LinkedIn / Instagram, ~270 mots. Conforme CLAUDE.md (aucune preuve sociale fabriquée, aucun témoignage, aucun chiffre d'adoption).

## Action recommandée

- Investiguer la stabilité du pool de connexions Prisma (timeout à 20s, limite 5) — plusieurs runs matinaux ont échoué sur ce point.
- Envisager d'augmenter `connection_limit` ou de mettre en place un retry côté endpoint `/api/agents/data`.
