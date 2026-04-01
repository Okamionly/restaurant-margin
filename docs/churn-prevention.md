# Strategie Anti-Churn -- RestauMargin

> **Produit :** RestauMargin SaaS -- 29 EUR/mois
> **Objectif :** maximiser la retention des restaurateurs abonnes

---

## 1. Signaux de churn

Detecter le risque avant que le restaurateur ne clique sur "Annuler".

| Signal | Seuil critique | Niveau de risque |
|--------|---------------|------------------|
| Aucun login depuis 7 jours | 7 j sans connexion | Eleve |
| Aucune recette creee depuis 14 jours | 0 recette sur 14 j | Eleve |
| IA non utilisee (suggestions marge, optimisation) | 0 appel IA sur 21 j | Moyen |
| Visite page "Mon abonnement" ou "Facturation" | 2+ visites en 3 j | Critique |
| Baisse du nombre de recettes actives | -50% sur 30 j | Moyen |
| NPS detracteur (score 0-6) | Derniere reponse NPS | Moyen |
| Export massif de donnees (recettes, fiches techniques) | Export complet | Critique |

### Implementation technique

- Cron job quotidien : requete Supabase `last_login_at < now() - interval '7 days'`
- Tracking events : `recipe_created`, `ai_suggestion_used`, `billing_page_viewed`
- Health score par utilisateur (0-100) base sur login + recettes + IA + support

---

## 2. Emails automatiques de reengagement

Sequences declenchees par les signaux ci-dessus. Envoi via Resend.

### Sequence A -- Inactivite login (7 jours)

| Email | Timing | Objet | Contenu |
|-------|--------|-------|---------|
| A1 | J+7 sans login | "Vos marges vous attendent" | Rappel des dernieres marges calculees, CTA vers le dashboard |
| A2 | J+10 sans login | "Nouveaute : [derniere feature]" | Mise en avant d'une fonctionnalite non utilisee |
| A3 | J+14 sans login | "Besoin d'aide ? On est la" | Proposition d'un appel de 15 min avec le support |

### Sequence B -- Pas de recette creee (14 jours)

| Email | Timing | Objet | Contenu |
|-------|--------|-------|---------|
| B1 | J+14 sans recette | "3 min pour votre premiere fiche technique" | Tuto video pas-a-pas + template de recette |
| B2 | J+18 sans recette | "Importez vos recettes en 1 clic" | Rappel de la fonctionnalite import CSV/Excel |

### Sequence C -- IA non utilisee (21 jours)

| Email | Timing | Objet | Contenu |
|-------|--------|-------|---------|
| C1 | J+21 sans IA | "L'IA a detecte une opportunite sur vos marges" | Teaser personnalise avec une suggestion concrete |
| C2 | J+28 sans IA | "Restaurateurs comme vous economisent 12% en moyenne" | Preuve sociale + CTA vers l'outil IA |

### Regles globales

- Pas plus d'1 email de reengagement par semaine
- Desinscrire automatiquement de la sequence si le signal disparait (ex: login detecte)
- Tracking open rate + click rate par sequence pour optimiser

---

## 3. Flow d'annulation

### Etape 1 -- Collecte de la raison

Quand le restaurateur clique "Annuler mon abonnement" :

```
Ecran : "Avant de partir, dites-nous pourquoi"

- Trop cher pour mon restaurant
- Je n'utilise pas assez l'outil
- Il me manque une fonctionnalite
- Je passe a un autre outil
- Problemes techniques / bugs
- Activite saisonniere / pause temporaire
- Fermeture du restaurant
- Autre : [champ libre]
```

### Etape 2 -- Save offer dynamique

L'offre depend de la raison selectionnee :

| Raison | Offre principale | Offre de repli |
|--------|-----------------|----------------|
| Trop cher | **50% pendant 3 mois** (14,50 EUR/mois) | Passage en formule limitee |
| Pas assez utilise | Pause 1 mois (voir section 4) | Session onboarding gratuite 20 min |
| Fonctionnalite manquante | Preview roadmap + date estimee | Acces beta a la feature si disponible |
| Autre outil | Comparatif + remise 50% x 3 mois | Feedback call avec le fondateur |
| Problemes techniques | Escalade support prioritaire immediat | Credit d'1 mois gratuit |
| Saisonnier | Pause abonnement (voir section 4) | -- |
| Fermeture | Pas d'offre (respect de la situation) | -- |

### Ecran de save offer (exemple "Trop cher")

```
"Et si on faisait un geste ?"

Offre speciale : 14,50 EUR/mois au lieu de 29 EUR
pendant les 3 prochains mois.

Vous economisez 43,50 EUR.

[Accepter l'offre]

Ou mettez votre abonnement en pause (1 mois gratuit) ->

[Non merci, continuer l'annulation]
```

### Etape 3 -- Confirmation

Si le restaurateur refuse les offres :
- Confirmation claire : "Votre abonnement restera actif jusqu'au [date fin de periode]"
- Ses donnees (recettes, fiches techniques) restent accessibles 90 jours en lecture seule
- CTA de reactivation visible

### Implementation Stripe

- Coupon Stripe `SAVE50_3M` : 50% pendant 3 mois, applicable via `subscription.update`
- Webhook `customer.subscription.updated` pour tracker les saves reussis
- Metadonnee `cancel_reason` sur l'objet subscription pour analytics

---

## 4. Offre pause (gel de l'abonnement)

Permettre aux restaurateurs de geler leur abonnement sans perdre leurs donnees.

### Regles

| Parametre | Valeur |
|-----------|--------|
| Duree maximale | 1 mois |
| Nombre de pauses par an | 1 |
| Acces pendant la pause | Lecture seule (consultation recettes, pas de creation) |
| Reactivation | Automatique a la fin de la periode de pause |
| Notification pre-reactivation | Email J-3 avant la reprise de facturation |

### Implementation Stripe

- `subscription.pause_collection` avec `behavior: 'void'` et `resumes_at` a +30 jours
- Email automatique a J-3 : "Votre abonnement RestauMargin reprend dans 3 jours"
- Si pas de login dans les 7 jours post-reactivation : sequence de reengagement A

### Statistiques attendues

- 60-80% des utilisateurs en pause reactivent leur abonnement
- La pause reduit le churn de 5-10% sur les utilisateurs "saisonniers"

---

## 5. NPS automatique

Mesurer la satisfaction a intervalles cles pour detecter les detracteurs avant qu'ils ne partent.

### Calendrier d'envoi

| Moment | Timing | Canal |
|--------|--------|-------|
| M+1 | 30 jours apres le premier paiement | Email |
| M+3 | 90 jours apres le premier paiement | Email |
| M+6 | 180 jours apres le premier paiement | Email |
| Post-support | 24h apres fermeture d'un ticket | In-app |

### Format

```
Sur une echelle de 0 a 10, recommanderiez-vous
RestauMargin a un collegue restaurateur ?

[0] [1] [2] [3] [4] [5] [6] [7] [8] [9] [10]

Dites-nous pourquoi : [champ libre]
```

### Actions par segment

| Segment | Score | Action automatique |
|---------|-------|--------------------|
| Promoteurs | 9-10 | Email demande d'avis Google/Trustpilot + programme parrainage |
| Passifs | 7-8 | Aucune action immediate, suivi a la prochaine enquete |
| Detracteurs | 0-6 | Alerte Slack equipe + email personnel du fondateur sous 24h |

### Implementation

- Stockage : table `nps_responses` (user_id, score, comment, sent_at, responded_at)
- Cron Supabase Edge Function pour l'envoi aux bonnes dates
- Dashboard admin : score NPS moyen, evolution, repartition promoteurs/passifs/detracteurs

---

## 6. Win-back email pour les churns

Sequence pour recuperer les restaurateurs qui ont effectivement annule.

### Sequence win-back

| Email | Timing post-annulation | Objet | Contenu |
|-------|----------------------|-------|---------|
| W1 | J+7 | "On vous garde une place" | Rappel de ce qu'ils perdent, CTA reactivation |
| W2 | J+14 | "Quoi de neuf chez RestauMargin" | Nouvelles fonctionnalites depuis leur depart |
| W3 | J+30 | "Offre retour : -30% pendant 3 mois" | **20,30 EUR/mois au lieu de 29 EUR** pendant 3 mois |
| W4 | J+60 | "Derniere chance : votre offre expire" | Rappel de l'offre -30%, urgence (expire dans 7 jours) |
| W5 | J+90 | "Vos donnees seront supprimees dans 7 jours" | Notification reglementaire + derniere chance de reactivation |

### Implementation Stripe

- Coupon `WINBACK30_3M` : 30% pendant 3 mois
- Lien de reactivation avec coupon pre-applique : `https://app.restaumargin.com/reactivate?coupon=WINBACK30_3M`
- Tracking : `win_back_email_sent`, `win_back_reactivated` dans les events analytics

### Regles

- Ne pas envoyer de win-back si la raison d'annulation est "Fermeture du restaurant"
- Maximum 5 emails sur 90 jours, puis silence
- Si reactivation : onboarding leger (rappel des fonctionnalites cles en 3 ecrans)
- Supprimer les donnees a J+97 si pas de reactivation (conformite RGPD)

### Objectifs

| Metrique | Cible |
|----------|-------|
| Taux d'ouverture win-back | > 30% |
| Taux de clic | > 8% |
| Taux de reactivation global | 5-10% des churns |
| Delai moyen de reactivation | < 30 jours |

---

## Resume des metriques cles a suivre

| Metrique | Cible | Frequence de suivi |
|----------|-------|--------------------|
| Taux de churn mensuel | < 5% | Mensuel |
| Taux de save (flow annulation) | 25-35% | Mensuel |
| Taux de reactivation post-pause | 60-80% | Mensuel |
| NPS moyen | > 40 | Mensuel |
| Taux de reactivation win-back | 5-10% | Mensuel |
| Dunning recovery rate | 50-60% | Mensuel |
| Revenue churn net | Negatif (expansion > churn) | Mensuel |
