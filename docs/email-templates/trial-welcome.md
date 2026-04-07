# Email Template -- Bienvenue apres inscription

> **Objectif** : Activer l'utilisateur -- qu'il ajoute son premier ingredient dans les 24h
> **Declencheur** : Inscription trial ou paiement
> **Envoi** : Immediat (automatique)
> **Expediteur** : Youssef Guessous, Fondateur RestauMargin

---

## Email principal

**Objet** : Bienvenue ! Voici comment demarrer en 5 minutes

**Preview** : Un seul ingredient. C'est tout ce qu'on vous demande aujourd'hui.

---

Bonjour {{Prenom}},

Bienvenue dans RestauMargin !

Vous venez de faire le premier pas que la majorite des restaurateurs repoussent indefiniment : **prendre le controle de vos marges**. Bravo.

Je ne vais pas vous noyer d'informations. Voici exactement ce que je vous recommande de faire dans les **5 prochaines minutes** :

---

### Etape 1 : Ajoutez votre premier ingredient (2 min)

Pensez a l'ingredient que vous achetez le plus souvent. Pour la plupart des restos, c'est :
- L'huile d'olive
- Le poulet
- La farine
- Les tomates

Allez dans **Ingredients** et ajoutez-le. Nom, prix d'achat, unite. C'est tout.

**[Ajouter mon premier ingredient ->]** {{app_url}}/ingredients

---

### Etape 2 : Creez votre premiere fiche technique (3 min)

Prenez votre plat le plus vendu. Ajoutez les ingredients et leurs quantites. L'IA calculera automatiquement :
- Le **cout matiere** exact
- Le **food cost** en pourcentage
- La **marge brute** par portion

**[Creer ma premiere fiche technique ->]** {{app_url}}/recipes/new

---

### Etape 3 : Decouvrez votre dashboard

Une fois votre premiere fiche creee, votre dashboard prend vie. Vous verrez vos marges en un coup d'oeil. A partir de la, chaque ingredient ajoute enrichit vos donnees.

**[Voir mon dashboard ->]** {{app_url}}/dashboard

---

### Besoin d'aide ?

- **Parlez a l'IA** : dans l'application, utilisez le chat IA pour poser n'importe quelle question ("quel est mon food cost moyen ?", "montre-moi mes plats les moins rentables")
- **Ecrivez-moi** : repondez directement a cet email. C'est moi, Youssef, qui vous reponds. Pas un bot.

Votre essai gratuit dure **14 jours**. Mon conseil : ajoutez au moins 5 ingredients et 3 fiches techniques cette semaine. C'est le moment ou l'outil commence a devenir indispensable.

A tout de suite dans l'appli,

-- Youssef Guessous
Fondateur, RestauMargin
youssef@restaumargin.com

P.S. -- Si vous avez deja un fichier Excel avec vos ingredients et prix, envoyez-le moi par email. Je l'importe pour vous gratuitement dans la journee.

---

## Email de suivi J+1 (si pas d'activite)

**Objet** : 2 minutes pour votre premier ingredient

**Preview** : Pas besoin de tout saisir. Un seul suffit pour commencer.

---

{{Prenom}},

Vous avez cree votre compte hier. Aujourd'hui, on passe a l'action.

Je sais ce que vous vous dites : "Je ferai ca quand j'aurai le temps." Mais voila le truc -- **ca prend 2 minutes**. Litteralement.

1. Ouvrez l'appli
2. Allez dans Ingredients
3. Ajoutez un seul produit (celui que vous achetez le plus)

C'est fait. Vous avez deja plus de visibilite sur vos couts que 80% des restaurateurs.

**[Ajouter un ingredient (2 min) ->]** {{app_url}}/ingredients

Demain, on attaque les fiches techniques. Mais aujourd'hui, un seul ingredient suffit.

-- Youssef

---

## Email de suivi J+3 (si premiere fiche technique creee)

**Objet** : Bravo -- votre premiere marge est calculee

**Preview** : Maintenant, ajoutez 2 fiches de plus et decouvrez le menu engineering.

---

{{Prenom}},

Vous avez cree votre premiere fiche technique. Felicitations -- vous avez maintenant un chiffre que 90% des restaurateurs n'ont pas : **votre vrai food cost sur ce plat**.

Pour debloquer la puissance de RestauMargin, voici la prochaine etape :

**Ajoutez 2 fiches techniques supplementaires** -- de preference vos 2 plats les plus vendus.

Pourquoi ? Parce qu'avec 3 fiches, vous pouvez utiliser le **Menu Engineering BCG** : une matrice qui classe vos plats en 4 categories :
- **Stars** : populaires ET rentables (gardez-les !)
- **Vaches a lait** : rentables mais peu vendus (a promouvoir)
- **Enigmes** : vendus mais pas rentables (a repriser)
- **Poids morts** : ni vendus ni rentables (a retirer ou transformer)

**[Creer ma 2e fiche technique ->]** {{app_url}}/recipes/new
**[Decouvrir le Menu Engineering ->]** {{app_url}}/menu-engineering

A bientot,

-- Youssef

---

## Notes techniques

### Declencheurs d'envoi
| Email | Condition | Timing |
|-------|-----------|--------|
| Bienvenue | Inscription confirmee | Immediat |
| J+1 Nudge | Pas d'ingredient ajoute apres 24h | J+1 a 10h |
| J+3 Bravo | Premiere fiche technique creee | Immediat apres creation |
| J+3 Rappel | Pas de fiche technique apres 3 jours | J+3 a 10h |

### Metriques a suivre
- Taux d'ouverture email bienvenue : cible > 70%
- Taux de clic "Ajouter ingredient" : cible > 30%
- % d'utilisateurs ayant ajoute 1 ingredient dans les 48h : cible > 50%
- % d'utilisateurs ayant cree 1 fiche technique dans les 7 jours : cible > 35%
