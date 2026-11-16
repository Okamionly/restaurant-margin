# Rapport MRR Hebdo — 2026-11-16

> Source : `/api/agents/data` — 2026-11-16 07:04 UTC  
> API disponible (réponse directe, pas de cache)

---

## ⚠️ ALERTE — MRR = 0 € · Aucun nouvel inscrit sur la semaine · Essai non converti

---

## Métriques clés

| Indicateur             | Valeur aujourd'hui | Variation 7 j (vs 11-09) |
|------------------------|--------------------|--------------------------|
| MRR                    | **0 €**            | = 0 € (inchangé)         |
| → Pro (29 €/mois)      | 0 abonné           | —                        |
| → Business             | 0 abonné           | —                        |
| ARR projeté            | **0 €**            | —                        |
| Essais actifs          | **0**              | **−1** (non converti)    |
| Nouveaux inscrits 48 h | **0**              | —                        |
| Comptes totaux         | **21**             | **0** (inchangé)         |
| Leads qualifiés        | **0**              | = 0 (inchangé)           |

---

## Analyse

Le produit reste à **0 abonné payant** et **0 MRR**. Cette semaine, aucun
nouveau compte ne s'est créé (21 → 21). L'essai actif signalé le 11-09 s'est
terminé sans conversion (1 → 0 essai actif) : c'est la première opportunité
de conversion explicitement identifiée qui se ferme sans résultat.

Le flux d'acquisition est à l'arrêt complet : 0 inscription sur 7 jours,
0 lead qualifié, 0 essai en cours. Sans entrée dans le funnel, la conversion
ne peut pas se produire. La situation est stable depuis plusieurs semaines au
même niveau.

---

## Recommandations actionnables

1. **Analyser pourquoi l'essai du 11-09 ne s'est pas converti.** Consulter
   la table `users` pour identifier ce compte (créé avant le 09-11, dernière
   activité ?), et comprendre s'il s'est désengagé rapidement ou a utilisé
   le produit sans payer. Ce retour d'information est actionnable
   immédiatement et ne coûte rien.

2. **Activer une source d'acquisition testable cette semaine.** Avec 0
   inscription sur 7 jours, le canal organique seul est insuffisant. Une
   action concrète à faible coût : publier sur un groupe Facebook ou LinkedIn
   de restaurateurs francophones avec un lien vers le calculateur food cost
   gratuit (`/outils/calculateur-food-cost`), qui ne nécessite pas d'inscription
   et permet de qualifier l'intérêt.

3. **Mettre en place une séquence d'onboarding pour les prochains essais.**
   L'essai perdu sans conversion suggère une friction à l'activation. Un
   e-mail de bienvenue J+1 (« avez-vous créé votre première fiche recette ? »)
   et un rappel J+5 avant expiration de l'essai sont les deux actions les
   plus simples pour améliorer le taux de conversion sans modifier le produit.

---

*Rapport généré automatiquement — données temps réel, API disponible.*
