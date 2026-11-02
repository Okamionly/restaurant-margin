# Rapport MRR Hebdo — 2026-11-02

> Source : `/api/agents/data` — 2026-11-02 07:14 UTC  
> **ERREUR API** : `agents_data_failed` — Prisma connection pool timeout (20 s, limite 5 connexions)

---

## ⚠️ ALERTE DOUBLE — API INDISPONIBLE · Dernier MRR connu : 0 €

---

## Métriques clés

| Indicateur             | Valeur (dernier rapport 09-28) | Variation 7 j |
|------------------------|-------------------------------|----------------|
| MRR                    | **0 €**                       | Indisponible — API en erreur |
| → Pro (29 €/mois)      | 0 abonné                      | —              |
| → Business             | 0 abonné                      | —              |
| ARR projeté            | 0 €                           | —              |
| Essais actifs          | 1 (09-28)                     | Indisponible   |
| Nouveaux inscrits 48h  | —                             | Indisponible   |
| Comptes totaux         | **18** (09-28)                | Indisponible   |
| Leads qualifiés        | 1 (09-28)                     | Indisponible   |

*Dernier rapport MRR disponible : 2026-09-28 (il y a 35 jours).  
Rupture de série 09-25 : le MRR ne comptabilise que les abonnements Stripe réels.*

---

## Analyse

L'API `/api/agents/data` a renvoyé une erreur `agents_data_failed` au moment de
l'exécution de ce rapport (07:14 UTC) : timeout du pool de connexions Prisma
(délai 20 s, limite 5 connexions). Aucune métrique en temps réel n'est disponible
ce lundi.

Le dernier rapport MRR disponible date du 28 septembre 2026, soit **35 jours sans
rapport hebdomadaire**. Les données commerciales (MRR, comptes, essais) sont
donc inconnues depuis plus d'un mois.

L'indisponibilité de l'API est elle-même un signal de fragilité infrastructure à
corriger en priorité.

---

## Recommandations actionnables

1. **Corriger le timeout Prisma en urgence.** L'erreur indique une saturation du
   pool (5 connexions, 20 s). Vérifier : (a) que la connexion Supabase est active
   (`DATABASE_URL` en production) ; (b) qu'aucune requête longue ne bloque les
   connexions ; (c) augmenter temporairement `connection_limit` dans le schema
   Prisma si le pool est sous-dimensionné.

2. **Relancer manuellement l'API et rejouer le rapport.** Une fois l'API rétablie,
   exécuter à nouveau la routine `restaumargin-mrr-weekly` pour obtenir les vraies
   métriques du jour. Le dernier rapport date de 09-28 : 35 jours sans données est
   un angle mort trop large pour piloter la conversion.

3. **Enquêter sur la situation commerciale depuis le 09-28.** Avec 0 abonné payant
   au 09-28, toute conversion réalisée depuis est non tracée. Accéder directement
   au dashboard Stripe pour vérifier si un abonnement a été créé entre le 28/09 et
   aujourd'hui, indépendamment de l'API.

---

*Rapport généré automatiquement — données issues du dernier rapport valide (09-28),
API indisponible au moment de l'exécution.*
