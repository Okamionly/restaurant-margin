# RestauMargin -- Sequences Email

> SaaS gestion de marge restaurant | 29 EUR/mois
> Outil : Resend + sequences automatisees
> Ton : direct, restaurateur-a-restaurateur, zero bullshit corporate

---

## 1. Sequence Onboarding (5 emails, J0 a J14)

**Declencheur** : Inscription (trial ou paiement)
**Objectif** : Activer l'utilisateur jusqu'au moment "aha" (voir sa premiere marge)
**Condition de sortie** : Upgrade vers plan paye OU desabonnement

---

### Email 1 -- Bienvenue (J0, immediat)

**Objet** : Bienvenue dans RestauMargin -- votre marge vous attend

**Preview** : On va transformer vos chiffres en decisions. Voici par ou commencer.

**Corps** :

Salut {{prenom}},

Bienvenue dans RestauMargin.

Vous venez de faire le premier pas que 90% des restaurateurs repoussent : prendre le controle de vos marges.

Voici ce qui va se passer dans les 5 prochaines minutes :

- Vous ajoutez votre premier ingredient (juste un, pas besoin de tout faire d'un coup)
- Vous voyez instantanement son impact sur votre food cost
- Vous respirez un grand coup parce que maintenant, vous savez

Un seul ingredient. C'est tout ce qu'on vous demande aujourd'hui.

**CTA** : Ajouter mon premier ingredient -> {{app_url}}/ingredients/new

**Timing** : Immediat apres inscription

---

### Email 2 -- Premier ingredient (J1)

**Objet** : 2 minutes pour votre premier ingredient

**Preview** : Pas besoin de tout saisir. Un seul suffit pour commencer.

**Corps** :

{{prenom}},

Hier vous avez cree votre compte. Aujourd'hui, on passe a l'action.

Prenez l'ingredient que vous achetez le plus. Pour la plupart des restos, c'est un de ceux-la :

- Huile d'olive
- Poulet
- Farine
- Tomates

Ouvrez votre derniere facture fournisseur. Saisissez le nom, le prix au kilo, c'est fait.

Temps reel : 2 minutes chrono.

Si vous l'avez deja fait hier ? Bravo, vous etes en avance. Ajoutez-en 3 de plus.

**CTA** : Ajouter un ingredient -> {{app_url}}/ingredients/new

**Timing** : J+1, 10h du matin

---

### Email 3 -- Premiere recette (J3)

**Objet** : Votre plat le plus vendu vous coute combien ?

**Preview** : La reponse va probablement vous surprendre.

**Corps** :

{{prenom}},

La question qui empeche les restaurateurs de dormir : "Est-ce que mon plat star me fait vraiment gagner de l'argent ?"

Avec les ingredients que vous avez saisis, creez votre premiere recette :

1. Choisissez votre plat le plus vendu
2. Ajoutez les ingredients et les quantites
3. RestauMargin calcule le food cost en temps reel

La plupart des restaurateurs decouvrent un ecart de 3 a 8% entre ce qu'ils pensaient et la realite.

3 a 8%. Sur un an, ca fait des milliers d'euros.

**CTA** : Creer ma premiere recette -> {{app_url}}/recipes/new

**Timing** : J+3, 10h du matin

---

### Email 4 -- Commande vocale (J7)

**Objet** : "Ajoute 5 kilos de saumon" -- c'est tout

**Preview** : La saisie au clavier, c'est fini. Parlez a RestauMargin.

**Corps** :

{{prenom}},

Vous etes en cuisine, les mains dans la farine, et vous devez mettre a jour un ingredient ?

Dites-le. Litteralement.

RestauMargin comprend la commande vocale. Dites "Ajoute 5 kilos de saumon a 12 euros le kilo" et c'est fait.

Pas de clavier. Pas d'ecran tactile graisseux. Juste votre voix.

C'est notre fonctionnalite preferee. Et celle de 78% de nos utilisateurs.

**CTA** : Essayer la commande vocale -> {{app_url}}/voice

**Timing** : J+7, 14h (entre les deux services)

---

### Email 5 -- Upgrade / Fin de trial (J14)

**Objet** : Votre trial se termine -- vos marges, elles, continuent

**Preview** : 29 EUR/mois. Moins cher qu'un plat sur votre carte.

**Corps** :

{{prenom}},

En 14 jours, voici ce que RestauMargin a fait pour vous :

- {{nb_ingredients}} ingredients suivis
- {{nb_recipes}} recettes analysees
- {{savings_estimate}} EUR d'ecart potentiel identifie

Votre trial se termine demain.

29 EUR/mois. C'est le prix d'un plat sur votre carte. Sauf que ce plat-la vous fait economiser 10 a 50 fois plus chaque mois.

Pas d'engagement. Annulez quand vous voulez. Mais franchement, pourquoi vous le feriez ?

**CTA** : Passer a 29 EUR/mois -> {{app_url}}/billing/upgrade

**Timing** : J+14, 9h du matin

---

## 2. Sequence Nurture Pre-achat (4 emails)

**Declencheur** : Visiteur qui a laisse son email (lead magnet, simulateur, blog) mais n'a PAS cree de compte
**Objectif** : Convertir en inscription trial
**Timing** : 2-3 jours entre chaque email
**Condition de sortie** : Inscription OU desabonnement

---

### Email 1 -- Valeur immediate (J0, immediat)

**Objet** : Votre guide food cost -- comme promis

**Preview** : Le guide que 2 400 restaurateurs ont deja telecharge.

**Corps** :

{{prenom}},

Voici votre guide "Calculer son food cost sans tableur Excel" :

[Lien de telechargement]

Un chiffre pour vous mettre en appetit : le food cost moyen en restauration est de 31%. Les restos qui le suivent activement descendent a 25-27%.

La difference sur un CA de 500K EUR ? Entre 20 000 et 30 000 EUR par an.

On en reparle dans 2 jours avec un cas concret.

**CTA** : Telecharger le guide -> {{lead_magnet_url}}

**Timing** : Immediat apres capture email

---

### Email 2 -- Probleme concret (J2)

**Objet** : Le fournisseur a augmente de 8%. Vous l'avez vu ?

**Preview** : La hausse que personne ne remarque avant qu'il soit trop tard.

**Corps** :

{{prenom}},

Histoire vraie d'un restaurateur a Lyon :

Son fournisseur de viande a augmente ses prix de 8% en 3 mois. Pas d'un coup -- 2% par ci, 3% par la. Personne ne l'a remarque.

Resultat : 14 000 EUR de marge envolee en un an.

Ce genre de derive arrive dans 73% des restaurants. Pas parce que les restaurateurs sont mauvais en gestion -- parce qu'ils n'ont pas les bons outils.

Un tableur ne vous previent pas. RestauMargin, si.

**CTA** : Voir comment ca marche -> {{app_url}}/demo

**Timing** : J+2

---

### Email 3 -- Preuve sociale (J5)

**Objet** : Comment Le Bistrot du Marche a gagne 2 200 EUR/mois

**Preview** : Un restaurant de 45 couverts. Pas une chaine. Un resto comme le votre.

**Corps** :

{{prenom}},

Le Bistrot du Marche, 45 couverts a Bordeaux. Restaurant traditionnel, carte courte, produits frais.

Avant RestauMargin :
- Food cost estime "a la louche" : 28%
- Food cost reel : 34%
- Perte seche : 2 200 EUR/mois

Apres 3 mois sur RestauMargin :
- Food cost reel mesure : 34% (confirmation du probleme)
- Food cost optimise : 27%
- Gain : 2 200 EUR/mois recuperes

Le proprietaire n'a pas change sa carte. Il n'a pas change de fournisseur. Il a juste commence a mesurer.

**CTA** : Essayer gratuitement (14 jours) -> {{app_url}}/signup

**Timing** : J+5

---

### Email 4 -- Derniere chance (J8)

**Objet** : Dernier email -- une question

**Preview** : Apres ca, silence radio. Mais avant...

**Corps** :

{{prenom}},

C'est mon dernier email de cette serie. Pas de pression.

Juste une question : qu'est-ce qui vous retient ?

- "J'ai pas le temps" -> La saisie prend 2 minutes par jour. La commande vocale, encore moins.
- "C'est trop cher" -> 29 EUR/mois. Le premier mois est souvent rembourse 5 a 10 fois.
- "Mon Excel marche bien" -> Si votre food cost est en dessous de 28%, gardez Excel. Sinon...
- "Je veux voir avant de m'engager" -> 14 jours gratuits, aucune carte bancaire requise.

Si la reponse est "pas maintenant", aucun souci. Vous savez ou nous trouver.

**CTA** : Demarrer mon essai gratuit -> {{app_url}}/signup

**Timing** : J+8

---

## 3. Sequence Win-back (3 emails)

**Declencheur** : Abonnement annule depuis 7 jours
**Objectif** : Re-engager les anciens clients
**Timing** : J+7, J+21, J+45 apres annulation
**Condition de sortie** : Re-abonnement OU 3 emails envoyes

---

### Email 1 -- Le check-in (J+7 apres annulation)

**Objet** : {{prenom}}, vos donnees sont toujours la

**Preview** : On garde tout pendant 90 jours. Pas de pression.

**Corps** :

{{prenom}},

On a vu que vous avez quitte RestauMargin. Aucun jugement.

Deux choses a savoir :

1. Vos donnees (ingredients, recettes, historique) sont conservees 90 jours. Si vous revenez, tout est la.

2. Si quelque chose n'allait pas, on veut le savoir. Pas pour vous convaincre de rester -- pour s'ameliorer.

Un mot de reponse suffit. On lit tout.

**CTA** : Repondre a cet email (pas de lien, juste le reply)

**Timing** : J+7 apres annulation

---

### Email 2 -- Les nouveautes (J+21 apres annulation)

**Objet** : Ce qui a change depuis votre depart

**Preview** : 3 nouveautes qui auraient peut-etre change la donne.

**Corps** :

{{prenom}},

Depuis votre depart, on n'a pas chome :

{{nouveaute_1}} -- [description courte]
{{nouveaute_2}} -- [description courte]
{{nouveaute_3}} -- [description courte]

On sort aussi bientot : {{teaser_feature}}.

Si une de ces nouveautes repond a ce qui vous manquait, la porte est ouverte. Vos donnees sont toujours la.

**CTA** : Reactiver mon compte -> {{app_url}}/reactivate

**Timing** : J+21 apres annulation

---

### Email 3 -- L'offre de retour (J+45 apres annulation)

**Objet** : -50% pendant 2 mois pour revenir

**Preview** : 14,50 EUR/mois au lieu de 29 EUR. Offre limitee.

**Corps** :

{{prenom}},

On va etre direct : on aimerait vous revoir.

Offre speciale ancien client : -50% pendant 2 mois.

- Mois 1 : 14,50 EUR au lieu de 29 EUR
- Mois 2 : 14,50 EUR au lieu de 29 EUR
- Mois 3+ : retour au tarif normal

Vos donnees sont encore la (plus que 45 jours avant suppression).

Pas d'engagement au-dela des 2 mois. Si ca ne colle toujours pas, on se dit au revoir pour de bon, sans rancune.

**CTA** : Revenir a -50% -> {{app_url}}/reactivate?coupon=WINBACK50

**Timing** : J+45 apres annulation

---

## 4. Newsletter mensuelle -- Template

**Frequence** : 1er mardi du mois, 10h
**Objectif** : Valeur + retention + upsell doux
**Segment** : Tous les abonnes actifs

---

### Template standard

**Objet** : [Mois] -- Mercuriale, tips et nouveautes RestauMargin

**Preview** : Les prix du mois + 1 astuce marge + ce qu'on a sorti.

**Corps** :

Salut {{prenom}},

Voici votre recap mensuel pour rester affute sur vos marges.

---

**MERCURIALE DU MOIS**

Les mouvements de prix a surveiller ce mois-ci :

| Produit | Evolution | Impact |
|---------|-----------|--------|
| {{produit_1}} | {{variation_1}} | {{impact_1}} |
| {{produit_2}} | {{variation_2}} | {{impact_2}} |
| {{produit_3}} | {{variation_3}} | {{impact_3}} |

A retenir : {{resume_mercuriale}}

---

**ASTUCE MARGE DU MOIS**

{{titre_astuce}}

{{contenu_astuce_2_3_phrases}}

Exemple concret : {{exemple_concret}}

---

**NOUVEAUTES RESTAUMARGIN**

{{nouveaute_principale}} -- {{description_courte}}

{{nouveaute_secondaire}} -- {{description_courte}}

---

**VOTRE MOIS EN CHIFFRES**

- Food cost moyen : {{food_cost_moyen}}%
- Meilleure recette : {{best_recipe}} ({{best_margin}}% de marge)
- Alerte prix : {{nb_alertes}} variations detectees

---

A le mois prochain. Et d'ici la, surveillez vos marges.

L'equipe RestauMargin

**CTA principal** : Voir mon tableau de bord -> {{app_url}}/dashboard

**CTA secondaire** : Partager RestauMargin a un collegue -> {{referral_url}}

---

## Metriques a suivre

| Metrique | Onboarding | Nurture | Win-back | Newsletter |
|----------|-----------|---------|----------|------------|
| Taux ouverture | > 60% | > 40% | > 30% | > 35% |
| Taux clic | > 25% | > 8% | > 5% | > 6% |
| Conversion | > 15% upgrade | > 5% signup | > 8% retour | N/A |
| Desabonnement | < 1% | < 2% | < 3% | < 0.5% |

## Notes implementation

- **Outil** : Resend (deja integre) pour le transactionnel, prevoir un outil type Customer.io ou Loops pour les sequences comportementales
- **Variables dynamiques** : `{{prenom}}`, `{{nb_ingredients}}`, `{{nb_recipes}}`, `{{savings_estimate}}`, `{{food_cost_moyen}}` a brancher sur les donnees Supabase
- **Desabonnement** : Lien en footer de chaque email, obligatoire RGPD
- **Horaires d'envoi** : Eviter le rush (11h-14h et 18h-22h). Privilegier 9h-10h ou 14h-15h
- **A/B test prioritaire** : Objets des emails onboarding (impact direct sur activation)
