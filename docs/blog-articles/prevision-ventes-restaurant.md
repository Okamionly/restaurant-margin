---
title: "Prévision des ventes en restauration : méthodes et outils pour anticiper votre chiffre d'affaires"
slug: prevision-ventes-restaurant
date: 2026-04-27
description: "Méthodes éprouvées pour prévoir vos ventes restaurant : historique N-1, moyennes mobiles, régression par facteurs. Modèle hebdo, exemple chiffré et précision mesurée."
keywords: ["prévision ventes restaurant", "prévoir chiffre affaires restaurant", "forecast restauration", "méthode prévision restaurant"]
readingTime: 13
category: Gestion financière
---

# Prévision des ventes en restauration : méthodes et outils pour anticiper votre chiffre d'affaires

Combien de couverts allez-vous faire vendredi prochain ? Si la réponse est "ça dépend", vous perdez de l'argent chaque semaine. Trop de stock le mardi, trop peu d'équipe le samedi, ruptures de plats du jour le dimanche midi : tout vient d'une absence de prévision. Pourtant, les restaurants qui pratiquent un forecast hebdomadaire structuré atteignent une précision de 92 % au bout de six mois. Cet article détaille les trois méthodes éprouvées, les facteurs à intégrer, et un modèle de tableau hebdomadaire à dupliquer dès la semaine prochaine.

## Sommaire

- [L'enjeu : prévoir pour commander juste et stafffer juste](#enjeu)
- [Les 3 méthodes de prévision](#methodes)
- [Facteurs qui influencent les ventes](#facteurs)
- [Exemple : vendredi soleil vs vendredi pluie](#exemple)
- [Modèle de tableau de prévision hebdomadaire](#tableau-hebdo)
- [Calculer l'écart prévision/réel](#ecart)
- [Comment les logiciels de caisse font du forecast](#caisse-forecast)
- [Lien avec la gestion des stocks](#stocks)
- [FAQ](#faq)

## L'enjeu : prévoir pour commander juste et stafffer juste <a id="enjeu"></a>

Une mauvaise prévision coûte sur trois fronts simultanément :

1. **Matières** : trop commandé = pertes (entre 4 et 8 % du food cost selon les études FoodTech 2025). Pas assez commandé = ruptures et clients déçus.
2. **Main-d'œuvre** : un extra appelé pour un service à 80 couverts qui en fait 50, c'est 110 € jetés. Un service sous-staffé qui craque, c'est 2 tables perdues, 80 € de CA, et un avis Google négatif.
3. **Trésorerie** : un stock qui dort 10 jours immobilise du cash que vous pourriez utiliser ailleurs.

Pour un restaurant de 50 couverts qui fait 580 000 € de CA annuel, une amélioration de 5 points de précision sur les prévisions représente entre 8 000 et 14 000 € de marge récupérée par an.

## Les 3 méthodes de prévision <a id="methodes"></a>

### Méthode 1 : Historique N-1 ajusté

La plus simple et souvent suffisante quand on a 18 mois d'historique. Principe : le vendredi 15 mai 2026 ressemble au vendredi de la même semaine en 2025, ajusté de l'inflation et des évolutions de votre activité.

**Formule type :**
> Prévision = CA jour équivalent N-1 × (1 + inflation) × (1 + croissance organique)

Exemple : vendredi 15 mai 2025 = 4 200 €. Inflation +3 %, croissance organique +5 %. Prévision : 4 200 × 1,03 × 1,05 = **4 542 €**.

**Avantages :** simple, rapide, intègre naturellement la saisonnalité.

**Limites :** ne tient pas compte des nouveautés (carte, équipe, météo, événements). À enrichir avec les autres méthodes pour les jours atypiques.

### Méthode 2 : Moyennes mobiles

Idéal quand vous n'avez pas 12 mois d'historique ou quand votre activité est volatile. Principe : la moyenne des 4 derniers jours équivalents donne une prévision robuste, peu sensible aux pics ponctuels.

**Formule :**
> Prévision = moyenne (CA des 4 derniers vendredis)

Exemple : vendredis 18 avril (3 800 €), 25 avril (4 100 €), 2 mai (4 300 €), 9 mai (4 000 €). Moyenne = 4 050 €. Prévision pour le 16 mai : **4 050 €**.

Variante pondérée : donner plus de poids aux semaines récentes.
> (CA S-1 × 0,4) + (CA S-2 × 0,3) + (CA S-3 × 0,2) + (CA S-4 × 0,1)

**Avantages :** lisse les pics, met en évidence les tendances.

**Limites :** ne capte pas les effets exceptionnels (jour férié, événement local).

### Méthode 3 : Régression par facteurs

La plus puissante mais la plus complexe. Principe : on calcule l'impact de chaque facteur (météo, jour, événement) sur le CA et on additionne.

**Modèle type :**
> CA prévu = CA base × coefficient météo × coefficient saison × coefficient événement

Exemple sur un restaurant avec terrasse :
- CA base vendredi soir : 3 800 €
- Coefficient météo (soleil > 22 °C, pas de pluie) : 1,15
- Coefficient saison (mai = +5 % vs moyenne annuelle) : 1,05
- Coefficient événement (concert local 800 m) : 1,08
- CA prévu : 3 800 × 1,15 × 1,05 × 1,08 = **4 957 €**

**Avantages :** précision maximale, intègre tous les facteurs.

**Limites :** demande 6 à 12 mois de données pour calibrer les coefficients, et un outil dédié (Excel avancé ou logiciel).

## Facteurs qui influencent les ventes <a id="facteurs"></a>

| Facteur | Impact typique | Mode d'intégration |
|---|---|---|
| Météo (terrasse été) | -25 % à +20 % | Coefficient quotidien |
| Jour de la semaine | -50 % (lundi) à +60 % (samedi) | Coefficient fixe |
| Vacances scolaires | +15 % zone touristique, -10 % zone bureau | Coefficient mensuel |
| Jours fériés | +30 % (fête mères) à -40 % (1er mai) | Coefficient ponctuel |
| Événements locaux | +10 % à +50 % | Coefficient ponctuel |
| Réservations en cours | Indicateur direct | Multiplier par taux walk-in |
| Météo froide hiver | +10 % en zone urbaine couverte | Coefficient saisonnier |
| Grèves transport | -30 % zones bureau | Alerte ponctuelle |
| Actualité locale (manifs) | -15 % à -50 % | Vigilance terrain |

L'erreur classique : se fier uniquement aux réservations. Sur un restaurant moyen, les réservations représentent 40 à 60 % des couverts ; le reste est en walk-in et dépend des facteurs externes.

## Exemple : vendredi soleil vs vendredi pluie <a id="exemple"></a>

Restaurant urbain avec terrasse 30 places, salle 60 places. Voici l'impact d'une prévision météo correcte un vendredi soir.

**Scénario A — Vendredi 16 mai, soleil prévu 24 °C**
- Prévision couverts : 180 (terrasse pleine + salle 90 %)
- Commande matières : 180 portions plat principal, 200 entrées, 220 desserts
- Planning : 1 chef + 2 commis + 1 plongeur, 1 chef de rang + 3 serveurs
- Vins frais en réserve : +20 % de blancs et rosés

**Scénario B — Vendredi 16 mai, pluie prévue toute la soirée**
- Prévision couverts : 120 (terrasse vide, salle 70 %)
- Commande matières : 120 portions, 130 entrées, 140 desserts
- Planning : 1 chef + 2 commis + 1 plongeur, 1 chef de rang + 2 serveurs
- Vins : stock standard

**Économie potentielle scénario B vs A si on avait staffé à 180 :**
- 1 serveur extra évité : 110 €
- Pertes matières évitées (60 portions × 4 € marge perdue) : 240 €
- **Économie totale : 350 € sur un seul service.**

Sur 2 vendredis pluvieux par mois, c'est 700 € × 12 = **8 400 € par an** simplement en consultant la météo à 4 jours.

## Modèle de tableau de prévision hebdomadaire <a id="tableau-hebdo"></a>

À remplir tous les dimanches soir pour la semaine suivante.

| Jour | Date | Météo prévue | Événement | Réservations à J-3 | Coefficient | Couverts prévus | CA prévu | Staffing | Commande |
|---|---|---|---|---|---|---|---|---|---|
| Lundi | 19 mai | 18 °C nuageux | - | 12 | 0,75 | 60 | 1 680 € | -1 commis | Standard -10 % |
| Mardi | 20 mai | 20 °C beau | - | 18 | 0,90 | 80 | 2 240 € | Standard | Standard |
| Mercredi | 21 mai | 22 °C soleil | Marché local | 28 | 1,05 | 100 | 2 800 € | +1 serveur | +5 % légumes |
| Jeudi | 22 mai | 23 °C soleil | - | 35 | 1,10 | 120 | 3 360 € | +1 serveur | +10 % |
| Vendredi | 23 mai | 24 °C soleil | Concert proche | 52 | 1,30 | 180 | 5 040 € | +1 serveur, +1 commis | +15 % |
| Samedi | 24 mai | 25 °C soleil | - | 65 | 1,40 | 200 | 5 600 € | Maxi | +20 % |
| Dimanche | 25 mai | 26 °C orage soir | - | 38 | 0,85 | 110 | 3 080 € | -1 serveur soir | -5 % |
| **Total** | | | | **248** | | **850** | **23 800 €** | | |

Lecture : la semaine prévue pèse 23 800 €, soit 4 % de plus qu'une semaine moyenne grâce au beau temps et au concert. Les commandes fournisseurs et le planning sont calés sur ces volumes.

## Calculer l'écart prévision/réel <a id="ecart"></a>

Chaque dimanche soir, comparez prévu et réel pour la semaine écoulée. Tableau type :

| Jour | Couverts prévus | Couverts réels | Écart % | Cause |
|---|---|---|---|---|
| Lundi | 60 | 55 | -8 % | RAS |
| Mardi | 80 | 82 | +3 % | RAS |
| Mercredi | 100 | 95 | -5 % | RAS |
| Jeudi | 120 | 130 | +8 % | Météo meilleure que prévu |
| Vendredi | 180 | 175 | -3 % | RAS |
| Samedi | 200 | 230 | +15 % | Sous-estimation, à corriger |
| Dimanche | 110 | 75 | -32 % | Orage déclenché à 19h |

**Indicateur de précision : MAPE (Mean Absolute Percentage Error)**
> MAPE = moyenne des écarts absolus en %

Sur cette semaine : (8+3+5+8+3+15+32)/7 = **10,6 % d'erreur moyenne**.

Objectifs réalistes :
- Mois 1 : 20 % d'erreur
- Mois 6 : 12 % d'erreur
- Mois 12 : 8 % d'erreur

Chaque écart > 15 % doit être analysé : a-t-on raté un événement, mal lu la météo, oublié un facteur ? L'apprentissage est progressif.

## Comment les logiciels de caisse font du forecast <a id="caisse-forecast"></a>

Les caisses modernes (Lightspeed, Tiller, Innovorder, Sumup) intègrent désormais des modules de prévision basés sur du machine learning. Principe :

1. Ingestion automatique de l'historique de ventes (jusqu'à 24 mois).
2. Récupération des données externes : météo, jours fériés, événements via API publiques.
3. Modèle prédictif (régression ou réseau de neurones) qui sort une prévision quotidienne.
4. Affinage continu en comparant prédit vs réel.

**Précision typique au bout de 6 mois :** 88 à 94 %.

**Limites :** la machine ne sait pas qu'il y a un concert privé chez le voisin ce soir. La supervision humaine reste indispensable, surtout pour les événements ponctuels. Un bon workflow combine forecast automatique (base) + ajustements manuels (événements).

## Lien avec la gestion des stocks <a id="stocks"></a>

La prévision de ventes est l'input principal de votre commande fournisseur. Workflow type :

1. **Dimanche soir :** prévision couverts par jour de la semaine suivante.
2. **Lundi matin :** déclinaison en portions par plat (selon mix-vente type carte).
3. **Lundi après-midi :** soustraction des stocks existants (inventaire flash).
4. **Lundi soir :** commande passée au fournisseur pour livraison mardi/mercredi.

**Exemple chiffré :**
- Prévision : 850 couverts dans la semaine
- Plat signature à 35 % de mix-vente : 297 portions
- Portion = 180 g de filet de bœuf : 53,5 kg nécessaires
- Stock actuel : 12 kg
- Commande : 42 kg arrondi à 45 kg pour sécurité

Une bonne prévision divise par 2 le gaspillage matière et fait économiser 2 à 4 points de food cost. Sur un CA de 600 000 €, c'est entre 12 000 et 24 000 € par an.

## FAQ <a id="faq"></a>

### Combien d'historique faut-il pour faire des prévisions fiables ?

3 mois pour démarrer (moyennes mobiles), 12 mois pour intégrer la saisonnalité, 24 mois pour calibrer un modèle de régression précis.

### Quelle météo consulter ?

Météo France pour la France, à 4-5 jours d'horizon. Au-delà, la précision baisse fortement. Privilégiez les API gratuites (Open-Meteo) si vous voulez automatiser.

### Faut-il prévoir par plat ou par couvert ?

Les deux. Au niveau global : couverts. Au niveau commande matières : par plat, en utilisant le mix-vente moyen des 4 dernières semaines équivalentes.

### Mon restaurant ouvre depuis 1 mois, comment prévoir ?

Utilisez les ratios sectoriels (ticket moyen, taux remplissage par jour) de votre format et zone. Au bout de 4 semaines, basculez en moyennes mobiles. Au bout de 12 semaines, vous aurez vos propres patterns.

### Le forecast remplace-t-il la connaissance terrain ?

Non, il la complète. La machine voit les patterns historiques, vous voyez le concert privé du voisin et la grève RATP de jeudi. Le bon forecast = data + intuition.

---

**Anticiper les ventes c'est 50 % du job. Le reste, c'est piloter le food cost et les marges en temps réel.** RestauMargin centralise vos prévisions, vos commandes et vos marges dans un seul outil.

Essayez RestauMargin gratuitement → https://www.restaumargin.fr
