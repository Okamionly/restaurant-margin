# SOP · Onboarding client

**Trigger :** Nouveau compte créé (webhook Stripe ou signup gratuit)  
**Qui :** CS Freelance (quand en poste) · Fondateur en attendant  
**Timing :** Contact dans les 24h ouvrées suivant le signup  
**Outputs :** Client actif (a créé sa première recette + calculé sa première marge)

---

## Étapes

### J+0 · Détection du nouveau client

- [ ] Email de bienvenue automatique via Resend (déclenché par signup)
- [ ] Ajouter le client dans Notion "Pipeline Clients" (nom, email, type resto, plan)
- [ ] Check si le client a complété l'onboarding wizard (indicateur en DB)

### J+1 · Premier contact humain

**Email manuel à envoyer** (template ci-dessous) si le client n'a pas créé de recette en J+1 :

```
Sujet : [RestauMargin] On est là si tu as des questions

Bonjour [Prénom],

Bienvenue sur RestauMargin ! Je suis Youssef, le fondateur.

J'ai vu que tu venais de créer ton compte. Est-ce que tu voudrais
qu'on fasse une rapide visio de 20 min pour que je te montre
comment calculer ta première marge ? C'est beaucoup plus rapide
avec un guide.

Tu peux prendre un créneau directement ici : [lien Calendly]

Sinon, la première chose à faire est de créer une recette →
restaumargin.com/recettes → bouton "+ Nouvelle recette"

À bientôt,
Youssef
```

### J+3 · Visio onboarding (si le client a accepté)

**Structure de la visio 45 min :**

- **0–5 min** : Accueil, contexte (quel type de resto, quel problème ils veulent résoudre)
- **5–25 min** : Guided tour produit adapté à leur besoin :
  - Restaurateur classique → Ingrédients + Recettes + Food Cost
  - Manager multi-sites → Restaurants + Analytics + Mercuriale
  - Chef pâtissier → Fiches techniques + Coefficients + Yield
- **25–40 min** : Ils créent eux-mêmes leur première recette (on guide, on ne fait pas à leur place)
- **40–45 min** : Questions, ressources help center, prochaine étape

**"Aha moment" à déclencher :** Le client voit pour la première fois son food cost réel vs ce qu'il croyait. C'est là que le produit se vend.

### J+7 · Check-in asynchrone

Si le client n'est pas revenu en J+7 :

```
Sujet : Comment ça se passe avec RestauMargin ?

Bonjour [Prénom],

Juste un petit mot pour savoir si tu as eu le temps d'explorer
RestauMargin. Est-ce qu'il y a quelque chose qui bloque ou
qui n'est pas clair ?

Un seul retour m'aide à améliorer le produit pour tous les
restaurateurs. Ça prend 2 minutes.

Merci,
Youssef
```

### J+30 · Revue de compte

- [ ] Le client a-t-il créé 3+ recettes ? → Client engagé, continuer
- [ ] Le client a-t-il un seul login en J+30 ? → Risque churn, appel téléphonique proactif
- [ ] Le client est-il sur le plan gratuit et actif ? → Proposition upgrade si limite atteinte

---

## Signaux churn à surveiller

| Signal | Action |
|--------|--------|
| Inactif 7 jours | Email automatique "on est là" |
| Inactif 14 jours | Appel téléphonique manuel |
| Inactif 30 jours | Email "pause ou annulation ?" + offre assistance |
| Annulation | Email exit survey (1 question : pourquoi ?) |

---

## KPIs à tracker

- Time-to-first-recipe (cible : < 48h après signup)
- Taux completion visio onboarding (cible : > 60% des trials actifs)
- Taux activation J+7 (cible : > 40%)
- Churn M1 (cible : < 15%)

---

**Dernière mise à jour :** 2026-04-23  
**Owner :** CS Freelance / Fondateur
