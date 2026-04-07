# Campagne Email - Lancement Montpellier

> Date de creation : 7 avril 2026
> Marche cible : Restaurants de Montpellier (34000)
> Objectif : Acquisition premiers utilisateurs en marche local

---

## Objet du mail (A/B Test)

| Variante | Objet |
|----------|-------|
| **A** | Votre plat du jour vous coute combien ? \| RestauMargin |
| **B** | Reduisez votre food cost de 15% -- essai gratuit 7 jours |

**Strategie A/B :** Envoyer A a 50% de la liste, B a 50%. Mesurer le taux d'ouverture apres 48h. L'objet gagnant sera utilise pour les relances et les villes suivantes.

- **Variante A** : Approche curiosite/douleur. Le restaurateur se pose la question.
- **Variante B** : Approche benefice direct + urgence (essai gratuit).

---

## Corps de l'email

```
Bonjour [Prenom],

Savez-vous exactement combien vous coute votre plat du jour ?
Entre les prix fournisseurs qui bougent chaque semaine, les pertes en cuisine
et les portions qui varient d'un service a l'autre, la plupart des restaurateurs
a Montpellier travaillent avec des marges qu'ils ne maitrisent pas vraiment.

Resultat : on pense gagner 65% de marge, et en realite c'est plutot 45%.

C'est exactement pour ca qu'on a cree RestauMargin.

RestauMargin est un outil en ligne concu specifiquement pour les restaurateurs
independants. Il vous permet de :

  - Calculer automatiquement vos couts et marges grace a l'IA
    (scannez une facture, l'outil fait le reste)

  - Commander directement aupres de vos fournisseurs depuis la plateforme,
    en comparant les prix en temps reel

  - Creer des fiches techniques precises pour chaque plat,
    avec le cout exact par portion

Deja utilise par des restaurateurs a Marseille et dans le sud de la France,
RestauMargin a permis en moyenne de reduire le food cost de 12 a 18%
des le premier mois d'utilisation.

A Montpellier, entre l'Ecusson, Antigone et Port Marianne, la concurrence
est rude. Chaque euro compte. RestauMargin vous donne la visibilite
necessaire pour prendre les bonnes decisions.

Essayez gratuitement pendant 7 jours -- sans engagement, sans carte bancaire.

    --> https://restaumargin.fr

Si vous avez la moindre question, repondez simplement a cet email.
On est une petite equipe basee dans le sud, et on repond personnellement
a chaque message.

A tres vite,

L'equipe RestauMargin
https://restaumargin.fr
```

---

## Footer / Mentions legales

```
---
Vous recevez cet email car votre restaurant est reference publiquement
a Montpellier. Si vous ne souhaitez plus recevoir nos communications,
cliquez ici pour vous desinscrire : [lien desinscription]

RestauMargin | Montpellier, France
contact@restaumargin.fr | restaumargin.fr

Conformement au RGPD, vous pouvez exercer vos droits d'acces,
de rectification et de suppression en nous ecrivant a :
rgpd@restaumargin.fr

Note : Ce message est envoye aux restaurateurs de Montpellier dans
le cadre du lancement local de RestauMargin. Nous avons collecte
votre adresse email a partir de sources publiques (site web de votre
etablissement, Pages Jaunes, Google Maps).
```

---

## Sequence de relance

| Jour | Action | Objet |
|------|--------|-------|
| J+0 | Email initial | Variante A ou B (A/B test) |
| J+3 | Relance 1 (si non ouvert) | "On a oublie de vous dire..." |
| J+3 | Relance 1 (si ouvert, pas clique) | "Votre essai gratuit vous attend, [Prenom]" |
| J+7 | Relance 2 | "Un restaurateur a Montpellier a economise 340 EUR ce mois" |
| J+14 | Derniere relance | "Derniere chance : votre acces gratuit expire bientot" |

---

## Metriques cibles

| Metrique | Objectif |
|----------|----------|
| Taux d'ouverture | > 25% |
| Taux de clic | > 5% |
| Taux d'inscription essai gratuit | > 2% |
| Taux de desinscription | < 1% |
| Taux de conversion essai -> paye | > 15% (apres 7 jours) |

---

## Notes techniques

- **Outil d'envoi recommande** : Brevo (ex-Sendinblue) -- serveurs en France, conforme RGPD, gratuit jusqu'a 300 emails/jour
- **Personnalisation** : Utiliser le prenom du gerant + nom du restaurant si disponible
- **Horaire d'envoi optimal** : Mardi ou jeudi, 10h-11h (apres le rush du matin, avant le service du midi)
- **SPF/DKIM** : Configurer sur le domaine restaumargin.fr avant tout envoi
- **Adresse d'expediteur** : youssef@restaumargin.fr (nom reel = confiance)
