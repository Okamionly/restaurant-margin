# CFO Analyse — 2026-11-13

> **Période couverte :** analyse du 2026-11-13. Données issues de `/api/agents/data`.
> **API :** Endpoint opérationnel — données fraîches (cached: false, timestamp: 2026-11-13T16:37:28Z).

---

## Métriques Clés

| Indicateur | Valeur J (2026-11-13) | Valeur J-1 (2026-11-12) | Variation |
|---|---|---|---|
| **MRR** | 0 € (Pro 0 + Biz 0) | 0 € | = |
| **ARR** | 0 € | 0 € | = |
| **Abonnés Pro** | 0 | 0 | = |
| **Abonnés Business** | 0 | 0 | = |
| **Utilisateurs totaux** | 21 | 21 | = |
| **Trials actifs** | 0 | 1 | -1 ⚠️ |
| **Leads qualifiés (7j)** | 0 | 0 | = |
| **Nouveaux inscrits 24h** | 0 | 0 | = |
| **Recettes créées** | 64 | 64 | = |
| **Ingrédients enregistrés** | 442 | 442 | = |

> **Événement notable :** Le dernier trial actif (présent depuis ≥4 jours) a expiré sans conversion. 0 trial en cours — pipeline de conversion vide pour la première fois depuis plusieurs semaines.

---

## Alertes

### 🔴 Alerte 1 — Phase amorçage, focus acquisition
- **Condition :** MRR < 100 €
- **Constat :** MRR = 0 €. Aucun abonnement Stripe actif (Pro = 0, Biz = 0). J+49 sans abonné payant depuis la correction de mesure du 2026-09-25.

### 🔴 Alerte 2 — Investiguer acquisition
- **Condition :** LEADS = 0 sur 7 jours
- **Constat :** realLeadsCount = 0. Aucun lead qualifié enregistré. 0 nouvel inscrit en 24h ni en 48h (total 21 utilisateurs stable).

### ✅ Alerte 3 — Conversion lente (non déclenchée)
- **Condition :** TRIAL > 5× payants
- **Constat :** trialUsers = 0, payants = 0 → condition non applicable. Pipeline trial vide.

---

## 3 Recommandations Chiffrées

### Recommandation 1 — Vérifier le flux Stripe end-to-end (Impact cible : éliminer blocage silencieux)
- **Action :** 49 jours sans abonné parmi 21 inscrits est statistiquement anormal. Le dernier trial vient d'expirer sans conversion — c'est le bon moment pour diagnostiquer. Tester un paiement Pro complet en conditions réelles (29 €/mois) : checkout → paiement Stripe → webhook → activation compte. Vérifier les logs Stripe Dashboard pour identifier si des tentatives de paiement ont échoué silencieusement.
- **Effort :** 30–60 min
- **Objectif mesurable :** Flux Stripe validé ou bug identifié et corrigé sous 24h
- **ROI :** Chaque semaine supplémentaire de blocage non détecté = 29 € de MRR potentiel non encaissé

### Recommandation 2 — Relancer une campagne de trials immédiatement (Impact cible : ≥2 nouveaux trials en 7 jours)
- **Action :** Pipeline trial est maintenant vide (0 trial actif). Contacter les 21 inscrits n'ayant pas souscrit : identifier ceux qui ont créé ≥1 recette (64 recettes pour 21 utilisateurs, soit ~3 recettes/utilisateur actif), leur proposer de démarrer un essai 7 jours sans carte. Priorité aux comptes avec activité récente.
- **Effort :** 2–3h (segmentation + emails manuels)
- **Objectif mesurable :** ≥2 nouveaux trials actifs dans les 7 prochains jours
- **ROI :** Avec un taux de conversion trial→payant de 10 %, 2 trials = 0,2 abonnés en espérance = 5,80 €/mois de MRR

### Recommandation 3 — Activer un canal d'acquisition mesurable (Impact cible : +1 lead qualifié / semaine)
- **Action :** 0 lead qualifié depuis ≥7 jours, 0 inscrit en 48h. Choisir un seul canal prioritaire : (a) vérifier l'indexation des outils SEO gratuits (`/outils/calculateur-food-cost`, `/outils/generateur-qr-menu`) dans Google Search Console — ces pages sont le seul actif d'acquisition passif existant ; (b) outreach direct — 5 restaurateurs LinkedIn avec offre essai 7 jours sans CB ; (c) publication d'un post ciblant "food cost restaurant" sur un réseau à portée organique.
- **Effort :** 2–3h
- **Objectif mesurable :** ≥1 lead qualifié dans les 7 prochains jours (realLeadsCount passe de 0 à ≥1)
- **ROI :** Chaque lead qualifié avec conversion de 10 % = 2,90 €/mois de MRR en espérance

---

*Rapport généré automatiquement le 2026-11-13 — CFO Agent RestauMargin*
