# Backlog Features — RestauMargin

Triées par impact décroissant. La feature en cours est retirée par le Feature Builder.

---

## En attente

### BUSINESS

- **Calculateur rendement matière** — Saisir plusieurs ingrédients (prix/kg, taux de perte à la coupe) → coût net/kg après perte, coût par portion, coefficient de vente conseillé. Très demandé par les chefs.

- **Simulateur impact hausse charges fixes** — Charges fixes actuelles + % hausse → nouveau seuil de rentabilité et impact sur le CA nécessaire.

- **Calculateur rentabilité événement/privatisation** — Couverts, ticket moyen, food cost %, coûts extra → marge événement vs service classique côte à côte.

- **Calculateur amortissement petits équipements** — Liste équipements (nom, prix, durée de vie) → coût/mois + coût/couvert + total annuel.

### OPERATIONS

- **Calculateur coût énergie par service** — Puissance équipements cuisine, durée utilisation, prix kWh → coût énergie/service et par couvert.

- **Tableau de suivi température chambre froide** — Saisie manuelle des températures (matin/soir) avec alertes HACCP (seuils légaux), historique 7 jours, persistance localStorage.

- **Générateur de planning de nettoyage HACCP** — Planning hebdomadaire des tâches de nettoyage par zone (cuisine, salle, stockage, chambre froide), coché par service, persistance localStorage.

### INTELLIGENCE

- **Calculateur rentabilité menu du jour vs à la carte** — Coût matière menu du jour, prix de vente, couverts visés → marge globale comparée à la carte, seuil de remplissage minimum.

- **Simulateur impact élasticité prix par catégorie** — Boissons, entrées, plats, desserts : hausse de prix + % de clients perdus estimé → impact net sur la marge.

### COMMUNICATION

- **Simulateur coût et ROI réseaux sociaux** — Temps hebdo, coût horaire, budget ads → coût mensuel de la présence sociale, CA additionnel nécessaire pour l'amortir.

---

## Complétées

- ✅ **Comparateur rentabilité plateformes livraison** (2026-11-04) — Page `/livraison-rentabilite` dans BUSINESS. CA livraison mensuel + répartition par canal (Uber Eats, Deliveroo, Just Eat, En direct) + commissions → revenu net par canal, perte totale en commissions, recommandation optimisation.

- ✅ **Calculateur ROI Équipement** (2026-09-16) — Page `/roi-equipement` dans BUSINESS. Saisie équipement (nom, prix achat, durée amortissement, gain CA mensuel, économies mensuelles) → ROI %, délai de retour en mois, gain net sur la durée totale. Comparaison jusqu'à 4 équipements en onglets, barre de progression payback vs amortissement, tableau détail.

- ✅ **Générateur de bon cadeau PDF** (2026-09-09) — Page `/bon-cadeau` dans COMMUNICATION. Création de bons-cadeaux personnalisés (restaurant, destinataire, expéditeur, montant, message, expiration, code unique) avec 3 designs (Classique, Moderne, Festif). Export PDF via impression navigateur.

- ✅ **Calculateur Coût par Couvert** (2026-09-25) — Page `/cout-couvert` dans BUSINESS. CA mensuel, couverts/mois, food cost %, masse salariale %, charges fixes € + autres variables % → coût total/couvert, marge nette/couvert et %, barre de ventilation par poste de charge, benchmarks UMIH (food cost 28-34 %, masse salariale 30-35 %, marge nette ≥ 10 %).

- ✅ **Analyse saisonnalité ingrédients** (2026-09-02) — Page `/saisonnalite` dans INTELLIGENCE. Calendrier mensuel pour 56 ingrédients (Légumes/Fruits/Champignons/Herbes/Poissons), filtre par catégorie, mois, et recherche texte. Astuces food cost intégrées.

- ✅ **Calculateur Seuil de Rentabilité** (2026-04-24) — Page `/rentabilite` dans BUSINESS. Charges fixes, taux marge variable, ticket moyen → CA seuil, couverts/mois/semaine/jour.
- ✅ **Calculateur TVA restauration** (2026-05-06) — Page `/calculateur-tva` dans BUSINESS. Convertisseur HT↔TTC pour les 3 taux (5,5 % / 10 % / 20 %) avec tableau de référence produits.
- ✅ **Calculateur nombre couverts cible** (2026-04-29) — Page `/couverts-cible` dans BUSINESS. CA objectif, ticket moyen, jours ouverture, services/jour → couverts/mois/semaine/jour/service + badge faisabilité.
- ✅ **Tableau de bord DLC/DLUO** (2026-06-03) — Page `/dlc-tracker` dans OPERATIONS. Suivi des dates d'expiration (DLC/DLUO) avec alertes visuelles vert/orange/rouge, KPIs (expiré/bientôt/ok), ajout/suppression produits, persistance localStorage.
- ✅ **Simulateur augmentation prix carte** (2026-05-27) — Page `/simulateur-prix` dans INTELLIGENCE. CA mensuel, ticket moyen, food cost %, hausse → gain marge mensuel/annuel, slider élasticité, point mort clients, tableau comparatif 5/10/15/20%.
- ✅ **Calculateur coût main d'œuvre** (2026-05-20) — Page `/cout-main-oeuvre` dans BUSINESS. Saisie équipe + CA → ratio masse salariale/CA, jauge colorée, alertes, benchmarks UMIH/GNI par type d'établissement.
- ✅ **Checklist ouverture/fermeture** (2026-07-25) — Page `/checklist-service` dans OPERATIONS. Deux onglets (Ouverture/Fermeture), tâches pré-remplies, barre de progression, ajout de tâches personnalisées, réinitialisation, persistance localStorage.
- ✅ **Chrono préparation par poste** (2026-08-02) — Page `/chrono-preparation` dans OPERATIONS. 3 stations (Chaud, Froid, Pâtisserie), start/pause/enregistrer/reset, historique 5 derniers chrono, moyenne, postes personnalisés, persistance localStorage.
- ✅ **Simulateur prime saisonnière** (2026-08-26) — Page `/prime-saisonniere` dans BUSINESS. Toggle Été/Hiver, CA objectif vs réalisé, paramètres équipe, barème 4 paliers (Insuffisant/Quasi/Atteint/Excellent), KPIs prime/employé + enveloppe totale.
