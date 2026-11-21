# CFO Analyse — 2026-11-21

> **Période couverte :** analyse du 2026-11-21. Données issues de `/api/agents/data`.
> **API :** Endpoint opérationnel — données fraîches (cached: false, timestamp: 2026-11-21T16:19:35Z).

---

## Métriques Clés

| Indicateur | Valeur J (2026-11-21) | Valeur J-1 (2026-11-20) | Variation |
|---|---|---|---|
| **MRR** | 0 € (Pro 0 + Biz 0) | 0 € | = |
| **ARR** | 0 € | 0 € | = |
| **Abonnés Pro** | 0 | 0 | = |
| **Abonnés Business** | 0 | 0 | = |
| **Utilisateurs totaux** | 21 | 21 | = |
| **Trials actifs** | 0 | 0 | = |
| **Leads qualifiés (7j)** | 0 | 0 | = |
| **Nouveaux inscrits 24h** | 0 | 0 | = |
| **Recettes créées** | 64 | 64 | = |
| **Ingrédients enregistrés** | 442 | 442 | = |

> **Événement notable :** J+57 sans abonné payant depuis la correction de mesure du 2026-09-25. Stagnation totale : aucune activité enregistrée en 24h ni en 48h. Base figée à 21 utilisateurs, pipeline trial vide. Aucun mouvement depuis le dernier rapport du 2026-11-20.

---

## Alertes

### 🔴 Alerte 1 — Phase amorçage, focus acquisition
- **Condition :** MRR < 100 €
- **Constat :** MRR = 0 €. Aucun abonnement Stripe actif (Pro = 0, Biz = 0). J+57 sans abonné payant.

### 🔴 Alerte 2 — Investiguer acquisition
- **Condition :** LEADS = 0 sur 7 jours
- **Constat :** realLeadsCount = 0. Aucun lead qualifié. 0 nouvel inscrit en 24h ni en 48h. Base figée à 21 utilisateurs.

### ✅ Alerte 3 — Conversion lente (non déclenchée)
- **Condition :** TRIAL > 5× payants
- **Constat :** trialUsers = 0, payants = 0 → condition non applicable. Pipeline trial vide.

---

## 3 Recommandations Chiffrées

### Recommandation 1 — Vérifier les webhooks Stripe et tester un paiement bout-en-bout (Impact cible : débloquer le premier paiement)
- **Action :** 57 jours sans conversion parmi 21 inscrits. Effectuer un paiement test Pro (19 €/mois) en mode Stripe test : checkout → paiement → webhook → activation compte. Vérifier les logs Stripe Dashboard pour des événements `payment_intent.succeeded` non reçus côté serveur. Si le webhook échoue silencieusement, corriger l'URL de webhook dans Stripe Dashboard et vérifier la variable d'environnement `STRIPE_WEBHOOK_SECRET`.
- **Effort :** 1–2h
- **Objectif mesurable :** Flux Stripe validé end-to-end dans les 24h
- **ROI :** Chaque semaine supplémentaire de blocage = 19 €/mois de MRR Pro non encaissé par abonné potentiel bloqué

### Recommandation 2 — Contacter directement les 21 inscrits (Impact cible : ≥2 nouveaux trials en 7 jours)
- **Action :** 64 recettes créées pour 21 utilisateurs = 3,05 recettes/utilisateur moyen — l'engagement existe. Identifier les comptes avec ≥1 recette (engagement prouvé) via la base Supabase, leur envoyer un message personnalisé proposant l'essai 7 jours sans carte bancaire. Priorité aux comptes actifs dans les 30 derniers jours (recette modifiée ou créée).
- **Effort :** 2–4h (segmentation Supabase + messages manuels)
- **Objectif mesurable :** ≥2 nouveaux trials actifs dans les 7 prochains jours
- **ROI :** Taux conversion trial→payant à 10 % → 2 trials = 0,2 abonnés espérés = 3,80 €/mois de MRR attendu en valeur d'espérance

### Recommandation 3 — Auditer la visibilité SEO des outils gratuits (Impact cible : +1 lead qualifié / semaine)
- **Action :** Les outils gratuits (`/outils/calculateur-food-cost`, `/outils/generateur-qr-menu`) et le blog (`/blog/calcul-marge-restaurant`) sont les seuls actifs d'acquisition passive. Vérifier dans Google Search Console : (a) indexation effective des 3 URLs, (b) nombre d'impressions et clics dans les 28 derniers jours, (c) requêtes génératrices de trafic. Si les URLs ne sont pas encore indexées, les soumettre via l'outil d'inspection d'URL de Search Console.
- **Effort :** 1h
- **Objectif mesurable :** Données Search Console disponibles ; ≥1 lead qualifié dans les 7 prochains jours
- **ROI :** Acquisition organique à coût nul — chaque conversion = 19 €/mois de MRR (228 €/an)

---

*Rapport généré automatiquement le 2026-11-21 — CFO Agent RestauMargin*
