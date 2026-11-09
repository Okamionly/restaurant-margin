# Rapport MRR Hebdo — 2026-11-09

> Source : `/api/agents/data` — 2026-11-09 07:03 UTC  
> API disponible (réponse directe, pas de cache)

---

## ⚠️ ALERTE — MRR = 0 € · Aucun nouvel inscrit sur 48 h

---

## Métriques clés

| Indicateur             | Valeur aujourd'hui | Variation 7 j |
|------------------------|--------------------|----------------|
| MRR                    | **0 €**            | = 0 € (inchangé) |
| → Pro (29 €/mois)      | 0 abonné           | —              |
| → Business             | 0 abonné           | —              |
| ARR projeté            | **0 €**            | —              |
| Essais actifs          | **1**              | = (inchangé vs 09-28¹) |
| Nouveaux inscrits 48 h | **0**              | —              |
| Comptes totaux         | **21**             | +3 vs 09-28¹ (variation 7 j indisponible²) |
| Leads qualifiés        | **0**              | −1 vs 09-28¹   |

¹ Dernier point de référence valide : rapport 09-28. L'API était hors ligne le 2026-11-02.  
² La variation strictement hebdomadaire est indisponible (API down semaine dernière).

---

## Analyse

L'API est à nouveau opérationnelle après la panne du 02-11. Les métriques
sont fiables.

Le produit reste à **0 abonné payant** et **0 MRR**. Sur les ~6 semaines
depuis le 09-28, 3 nouveaux comptes se sont créés (18 → 21), soit un rythme
très faible (~2 comptes/mois). Un seul essai actif est en cours ; aucun
lead qualifié n'est enregistré (contre 1 au 09-28).

Le point positif : la résolution de la panne API permet de reprendre le
suivi hebdomadaire avec des données fiables.

---

## Recommandations actionnables

1. **Contacter l'essai actif dans les 24 h.** Un seul utilisateur est en
   période d'essai. Un message personnalisé (aide à la prise en main,
   réponse à des blocages) augmente significativement la probabilité de
   conversion. C'est l'action à fort levier la plus immédiate.

2. **Identifier les 3 comptes créés depuis le 09-28.** Comprendre par quel
   canal ils sont arrivés (SEO, bouche-à-oreille, réseaux) oriente les
   efforts d'acquisition. Consulter directement la table `users` en
   production pour trouver leur date et source d'inscription.

3. **Relancer un canal d'acquisition minimal.** Avec 0 lead qualifié actif
   et ~0,5 inscription/semaine, le flux entrant est insuffisant pour
   convertir statistiquement. Une action concrète testable cette semaine :
   publier un contenu SEO sur une requête à fort intent (ex. « calculateur
   food cost restaurant ») ou activer une campagne d'essai ciblée sur les
   groupes LinkedIn de restaurateurs.

---

*Rapport généré automatiquement — données temps réel, API disponible.*
