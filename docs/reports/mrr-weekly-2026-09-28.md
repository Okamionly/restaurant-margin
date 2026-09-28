# Rapport MRR Hebdo — 2026-09-28

> Source : `/api/agents/data` — 2026-09-28 06:19 UTC

---

## ⚠️ ALERTE — MRR = 0 € · Variation comptes semaine : −2

---

## Métriques clés

| Indicateur             | Valeur          | Variation 7 j (vs 09-21) |
|------------------------|-----------------|---------------------------|
| MRR                    | **0 €**         | 0 € (base post-correction 09-25) |
| → Pro (29 €/mois)      | 0 abonné        | —                         |
| → Business             | 0 abonné        | —                         |
| ARR projeté            | 0 €             | —                         |
| Essais actifs          | **1**           | +1 (0 il y a 7 j)         |
| Nouveaux inscrits 48h  | 1               | (ne pas extrapoler à 7 j) |
| Comptes totaux         | **18**          | **−2** (20 → 18)          |
| Leads qualifiés        | 1               | —                         |

*Rupture de série 09-25 : le MRR ne comptabilise plus que les abonnements Stripe
réels. Le passage de non-zéro à 0 € est une correction de mesure, pas une perte
d'abonné.*

---

## Analyse

La semaine se clôt avec **zéro revenu réel** et une **base utilisateurs en recul
net de 2 comptes** (20 → 18). Un essai en cours (inscrit le 27/09, domaine
gmail.com, plan basic) représente le seul signal d'activité commerciale de la
semaine.

Le recul de 2 comptes est inhabituel : les rapports CEO du 09-25 indiquent encore
20 utilisateurs ; à investiguer (suppressions volontaires ? nettoyage BDD ?).

---

## Recommandations actionnables

1. **Investiguer la perte de 2 comptes (priorité immédiate).** Identifier si c'est
   une suppression volontaire, un nettoyage BDD automatique ou une anomalie
   technique. Action : requête SQL sur `users` avec `deleted_at` ou log d'audit.

2. **Activer l'essai en cours sous 24h.** 1 seul lead qualifié, inscrit hier
   (gmail.com). Envoyer un message d'onboarding manuel, proposer une démo si
   c'est un restaurateur identifiable. Avec 0 abonné payant, chaque essai compte.

3. **Fixer un objectif minimal : 1 abonné Pro d'ici 30 jours.** Le produit
   fonctionne (18 comptes, 62 recettes créées, 436 ingrédients). L'absence totale
   de conversion depuis plusieurs semaines indique un problème d'acquisition ou
   d'onboarding, pas de valeur produit. Action concrète : identifier les 3 users
   les plus actifs (recettes créées) et leur proposer directement un essai Pro.

---

*Premier rapport de la série mrr-weekly — aucun rapport précédent disponible
pour comparaison inter-hebdomadaire antérieure au 09-21.*
