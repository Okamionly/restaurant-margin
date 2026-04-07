# Email Template -- Rappel J+7 (essai se termine dans 7 jours)

> **Objectif** : Convertir l'utilisateur trial en abonne payant
> **Declencheur** : 7 jours apres inscription (J+7 sur un trial de 14 jours)
> **Expediteur** : Youssef Guessous, Fondateur RestauMargin

---

## Version A -- Utilisateur actif (a cree 3+ fiches techniques)

**Objet** : Votre essai se termine dans 7 jours

**Preview** : Vos fiches techniques et vos marges restent accessibles si vous passez au plan Pro.

---

Bonjour {{Prenom}},

Ca fait 7 jours que vous utilisez RestauMargin, et je vois que vous avez deja :
- Ajoute **{{NbIngredients}} ingredients**
- Cree **{{NbFiches}} fiches techniques**
- Un food cost moyen de **{{FoodCostMoyen}}%** sur vos plats

C'est exactement comme ca qu'on obtient des resultats. Bravo.

**Votre essai gratuit se termine dans 7 jours.** Apres ca, vous perdrez l'acces a vos donnees, vos fiches et votre dashboard.

Pour continuer sans interruption :

**[Passer au plan Pro -- 49 EUR/mois ->]** {{app_url}}/pricing

Ce que vous gardez avec le plan Pro :
- Toutes vos fiches techniques et ingredients (rien n'est perdu)
- Dashboard et statistiques en temps reel
- Menu Engineering BCG
- Alertes food cost
- Export PDF / Excel
- Support prioritaire (je reponds en < 24h)

**49 EUR/mois, c'est moins de 2 EUR par jour.** Si l'outil vous a permis de detecter ne serait-ce qu'un plat mal price, il s'est deja rembourse.

Une question ? Repondez a cet email, je vous reponds personnellement.

-- Youssef

---

## Version B -- Utilisateur peu actif (0-2 fiches techniques)

**Objet** : Votre essai se termine dans 7 jours -- on en profite ?

**Preview** : 7 jours pour decouvrir combien vos plats vous rapportent vraiment.

---

Bonjour {{Prenom}},

Votre essai gratuit de RestauMargin se termine dans **7 jours**, et je vois que vous n'avez pas encore eu le temps de l'explorer a fond. C'est normal -- entre le service, les fournisseurs et l'equipe, les journees passent vite.

Mais voila le truc : **il vous reste 7 jours pour decouvrir combien vos plats vous rapportent vraiment. Et ca prend 10 minutes.**

Voici mon defi pour cette semaine :

| Jour | Action | Temps |
|------|--------|-------|
| Aujourd'hui | Ajoutez 5 ingredients (vos 5 achats principaux) | 5 min |
| Demain | Creez la fiche technique de votre plat best-seller | 5 min |
| Apres-demain | Regardez votre dashboard -- votre food cost est la | 2 min |

**[Relever le defi ->]** {{app_url}}/ingredients

Si le probleme c'est le temps, je vous propose un coup de main : **envoyez-moi votre carte par email** (photo, PDF, Word, ce que vous avez). Je cree vos fiches techniques pour vous gratuitement dans les 48h.

Serieusement. C'est offert.

-- Youssef
youssef@restaumargin.com

---

## Version C -- Rappel J+11 (3 jours avant expiration)

**Objet** : Plus que 3 jours d'essai gratuit

**Preview** : Vos donnees seront desactivees vendredi. Passez au Pro pour les garder.

---

{{Prenom}},

Votre essai gratuit de RestauMargin expire dans **3 jours**.

Apres cette date :
- Vos fiches techniques ne seront plus accessibles
- Votre dashboard sera desactive
- Vos donnees seront conservees 30 jours (au cas ou vous changeriez d'avis)

**Pour continuer :**

**[Passer au Pro -- 49 EUR/mois ->]** {{app_url}}/pricing

Pas convaincu(e) ? Dites-moi ce qui manque. Je prends tous les retours, meme les critiques. Un simple "ca ne me convient pas parce que..." m'aide enormement a ameliorer l'outil.

Repondez a cet email, je lis tout.

-- Youssef

---

## Version D -- Dernier jour (J+14)

**Objet** : Votre essai se termine aujourd'hui

**Preview** : Dernier jour. 49 EUR/mois pour garder le controle de vos marges.

---

{{Prenom}},

C'est le dernier jour de votre essai gratuit RestauMargin.

**Deux options :**

**Option 1 -- Vous passez au Pro (49 EUR/mois)**
Vous gardez tout : vos fiches, vos ingredients, votre dashboard, vos marges. Rien ne change, sauf que vous continuez a maitriser vos couts.

**[Passer au Pro maintenant ->]** {{app_url}}/pricing

**Option 2 -- Vous ne faites rien**
Votre compte sera desactive ce soir. Vos donnees seront conservees 30 jours. Vous pourrez reactiver a tout moment.

Pas de pression. Mais si l'outil vous a ete utile, meme un tout petit peu, sachez que 49 EUR/mois c'est le prix d'un plat du jour. Et l'outil peut vous faire economiser des milliers d'euros par an.

Merci d'avoir teste RestauMargin. Quelle que soit votre decision, j'espere que vous avez appris quelque chose sur vos marges.

-- Youssef

---

## Notes d'utilisation

### Sequence complete J+7 a J+14

| Jour | Email | Condition |
|------|-------|-----------|
| J+7 | Version A (actif) OU Version B (peu actif) | Basee sur l'activite (>= 3 fiches = actif) |
| J+11 | Version C (rappel 3 jours) | Si pas encore abonne |
| J+14 | Version D (dernier jour) | Si pas encore abonne |

### Variables dynamiques
- `{{NbIngredients}}` : Nombre d'ingredients ajoutes
- `{{NbFiches}}` : Nombre de fiches techniques creees
- `{{FoodCostMoyen}}` : Food cost moyen calcule

### Metriques a suivre
- Taux de conversion trial -> paid (global) : cible > 20%
- Taux de conversion actifs (3+ fiches) -> paid : cible > 40%
- Taux de conversion inactifs -> paid : cible > 5%
- Taux de reponse "pourquoi pas convaincu" : cible > 10%
