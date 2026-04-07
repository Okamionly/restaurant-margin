# Strategie de collecte de leads - Montpellier

> Date de creation : 7 avril 2026
> Zone cible : Montpellier et agglomeration (34000, 34070, 34080, 34090, 34170)
> Objectif : Constituer une base de 500 a 800 restaurants avec email du gerant

---

## Vue d'ensemble du marche

Montpellier compte environ **2 200 a 2 500 restaurants** (toutes categories confondues : traditionnels, bistrots, brasseries, pizzerias, restauration rapide, gastronomiques, etc.).

En ciblant les restaurants independants avec service a table (hors chaines, fast-food pur, kebabs sans site web), la cible realiste est de **800 a 1 200 etablissements**.

---

## Source 1 : Google Maps

### Description
Recherche "restaurant Montpellier" et variantes sur Google Maps / Google Business Profile.

### Estimation du nombre de resultats
- "restaurant Montpellier" : ~1 800 a 2 200 resultats
- En filtrant par type (restaurant traditionnel, brasserie, bistrot, gastronomique) : ~1 000 a 1 400

### Comment extraire les emails (legalement)
- Les fiches Google Business affichent parfois le **site web** du restaurant
- Visiter chaque site web pour trouver l'email de contact (page Contact, mentions legales, footer)
- **Ne pas scraper les emails directement de Google** (violation des CGU de Google)
- L'email publie sur le site du restaurant est considere comme **donnee publique** au sens du RGPD (interet legitime B2B), a condition d'informer le destinataire de la source

### Outils necessaires
| Outil | Usage | Cout |
|-------|-------|------|
| Google Maps (manuel) | Lister les restaurants | Gratuit |
| **Apify** (Google Maps Scraper) | Extraire noms, adresses, sites web, telephones | ~25 EUR/mois |
| **Hunter.io** | Trouver l'email a partir du domaine du site web | Gratuit (25 recherches/mois) ou 49 EUR/mois |
| Tableur (Google Sheets) | Centraliser les donnees | Gratuit |

### Temps estime
- Extraction des fiches avec Apify : **2-3 heures** (setup + execution)
- Nettoyage des donnees + visite manuelle des sites : **8-12 heures**
- Recherche emails via Hunter.io : **2-3 heures**
- **Total : 12-18 heures** (sur 2-3 jours)

---

## Source 2 : PagesJaunes.fr

### Description
Annuaire professionnel francais, reference historique. Recherche "restaurants" dans "Montpellier (34)".

### Estimation du nombre de resultats
- Categorie "Restaurants" a Montpellier : ~1 500 a 1 800 resultats
- Beaucoup de doublons avec Google Maps
- Avantage : les fiches PagesJaunes affichent souvent directement l'**email** et le **site web**

### Comment extraire les emails (legalement)
- PagesJaunes affiche les emails publies par les entreprises elles-memes
- Extraction manuelle ou semi-automatisee (attention : le scraping de PagesJaunes est interdit par leurs CGU)
- **Methode legale** : consultation manuelle + copie des informations de contact publiees
- Alternative : utiliser l'API officielle PagesJaunes / SoLocal (payante)

### Outils necessaires
| Outil | Usage | Cout |
|-------|-------|------|
| PagesJaunes.fr (manuel) | Consultation des fiches | Gratuit |
| **SoLocal API** (optionnel) | Acces structure aux donnees | Sur devis (~200-500 EUR) |
| Tableur | Centralisation | Gratuit |

### Temps estime
- Consultation manuelle de 200-300 fiches/jour : **4-6 jours** pour couvrir la ville
- Avec assistant ou freelance : **2-3 jours**
- **Total : 20-30 heures**

---

## Source 3 : TheFork (LaFourchette)

### Description
Plateforme de reservation en ligne leader en France. Les restaurants y publient leurs coordonnees et souvent le nom du gerant.

### Estimation du nombre de resultats
- Restaurants sur TheFork a Montpellier : ~400 a 600
- Profil type : restaurants de moyenne/haute gamme, souvent les plus susceptibles d'investir dans un outil de gestion
- **Cible ideale** pour RestauMargin (restaurateurs soucieux de leurs marges)

### Comment extraire les emails (legalement)
- TheFork n'affiche pas les emails directement
- **Methode** : relever le nom du restaurant + nom du gerant/chef --> chercher le site web --> trouver l'email
- Certains restaurants sur TheFork ont un lien vers leur site web
- **Interdit** : scraper TheFork directement

### Outils necessaires
| Outil | Usage | Cout |
|-------|-------|------|
| TheFork.fr (manuel) | Lister restaurants haut de gamme | Gratuit |
| Google Search | Trouver sites web des restaurants listes | Gratuit |
| Hunter.io / Snov.io | Trouver emails a partir des domaines | 49 EUR/mois |

### Temps estime
- Listing des 400-600 restaurants : **3-4 heures**
- Recherche d'emails (combinaison Hunter.io + recherche manuelle) : **6-8 heures**
- **Total : 10-12 heures**

---

## Source 4 : LinkedIn

### Description
Recherche de profils de restaurateurs, chefs, gerants de restaurants a Montpellier.

### Estimation du nombre de resultats
- "restaurateur Montpellier" : ~150-250 profils
- "chef cuisinier Montpellier" : ~200-350 profils
- "gerant restaurant Montpellier" : ~100-200 profils
- Apres deduplication : ~300-500 contacts uniques

### Comment extraire les emails (legalement)
- LinkedIn interdit strictement le scraping
- **Methode legale 1** : Envoyer des demandes de connexion personnalisees avec un message de prospection
- **Methode legale 2** : Utiliser LinkedIn Sales Navigator (version payante) pour filtrer et contacter
- **Methode legale 3** : Utiliser des outils comme **Kaspr** ou **Lusha** qui enrichissent les profils LinkedIn avec des emails professionnels (conforme RGPD si B2B)

### Outils necessaires
| Outil | Usage | Cout |
|-------|-------|------|
| LinkedIn (compte gratuit) | Recherche de profils | Gratuit |
| **LinkedIn Sales Navigator** | Filtrage avance + InMails | ~79 EUR/mois |
| **Kaspr** ou **Lusha** | Enrichissement email | 49-79 EUR/mois |
| **Lemlist** ou **Instantly** | Automatisation des sequences LinkedIn + email | 59 EUR/mois |

### Temps estime
- Configuration Sales Navigator + recherche : **2-3 heures**
- Enrichissement avec Kaspr/Lusha : **2-3 heures**
- Envoi de demandes de connexion (30-50/jour max) : **continu sur 2 semaines**
- **Total setup : 5-6 heures** + suivi quotidien de 30 min

---

## Source 5 : Associations et reseaux locaux

### Description
Montpellier possede plusieurs associations et reseaux de restaurateurs qui peuvent servir de levier.

### Organisations cibles

| Organisation | Description | Contacts estimes |
|-------------|-------------|-----------------|
| **UMIH 34** (Union des Metiers et des Industries de l'Hotellerie) | Syndicat patronal, antenne de l'Herault | 200-400 adherents restaurateurs |
| **GNI Occitanie** (Groupement National des Independants) | Syndicat des independants de l'hotellerie-restauration | 100-200 adherents |
| **Les Toques Blanches du Languedoc** | Association de chefs cuisiniers | 50-80 membres |
| **Office de Tourisme de Montpellier** | Liste des restaurants recommandes | 150-300 restaurants references |
| **Montpellier Mediterranee Metropole** | Annuaire des commerces | 500+ restaurants |
| **CCI Herault** (Chambre de Commerce) | Annuaire des entreprises de restauration | 800+ entreprises |
| **Les Restaurateurs de France** (antenne locale) | Label qualite | 30-50 membres locaux |

### Comment extraire les emails (legalement)
- **Partenariat** : Contacter l'UMIH 34 et le GNI pour proposer un partenariat (outil recommande a leurs adherents en echange de visibilite)
- **Annuaires publics** : L'Office de Tourisme et la CCI publient des annuaires consultables
- **Evenements** : Participer aux salons locaux (Salon de la Restauration, marche de Rungis local) pour collecter des cartes de visite
- **Intervention** : Proposer une presentation gratuite "Comment maitriser vos couts en cuisine" lors d'une reunion UMIH

### Outils necessaires
| Outil | Usage | Cout |
|-------|-------|------|
| Telephone + email | Contact direct avec les associations | Gratuit |
| Eventbrite / Meetup | Trouver des evenements locaux | Gratuit |
| Cartes de visite RestauMargin | Networking en personne | ~30 EUR (250 cartes) |

### Temps estime
- Identification et contact des associations : **3-4 heures**
- Suivi et relances : **2-3 heures/semaine pendant 1 mois**
- Participation a un evenement : **1 journee**
- **Total : 15-20 heures** sur le premier mois

---

## Recapitulatif

| Source | Restaurants estimes | Emails recuperables | Cout | Temps |
|--------|--------------------|--------------------|------|-------|
| Google Maps + Apify + Hunter | 1 000-1 400 | 300-500 | ~75 EUR/mois | 12-18h |
| PagesJaunes | 1 500-1 800 | 200-400 | Gratuit-500 EUR | 20-30h |
| TheFork | 400-600 | 150-250 | ~49 EUR/mois | 10-12h |
| LinkedIn | 300-500 | 100-200 | ~130 EUR/mois | 5-6h + suivi |
| Associations locales | 200-400 | 50-150 | ~30 EUR | 15-20h |
| **TOTAL (deduplique)** | **~2 200** | **500-800** | **~285 EUR** | **~70h** |

---

## Plan d'action recommande (priorite)

### Semaine 1 : Sources rapides
1. Lancer le scraping Google Maps via Apify (2-3h)
2. Enrichir les emails avec Hunter.io (2-3h)
3. Creer le fichier CSV de base dans Google Sheets

### Semaine 2 : Sources complementaires
4. Explorer TheFork manuellement (3-4h/jour pendant 3 jours)
5. Lancer les recherches LinkedIn + Kaspr (setup 3h)
6. Croiser et dedupliquer avec la base existante

### Semaine 3 : Reseautage local
7. Contacter UMIH 34, GNI, Office de Tourisme
8. Proposer un partenariat / intervention gratuite
9. Completer les emails manquants via PagesJaunes

### Semaine 4 : Lancement de la campagne
10. Base finale nettoyee et segmentee
11. A/B test sur 100 contacts
12. Envoi de la campagne principale

---

## Conformite RGPD

- **Base legale** : Interet legitime (prospection B2B, article 6.1.f du RGPD)
- **Information** : Chaque email doit mentionner la source de collecte de l'adresse
- **Desinscription** : Lien de desinscription obligatoire dans chaque email
- **Registre** : Documenter la collecte dans le registre de traitement
- **Droit d'opposition** : Traiter toute demande de desinscription sous 48h
- **Conservation** : Supprimer les contacts inactifs apres 3 ans sans interaction
- **Pas de donnees sensibles** : Ne collecter que nom, prenom, email, telephone, nom du restaurant
