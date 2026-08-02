# Backlog Features — RestauMargin

Triées par impact décroissant. La feature en cours est retirée par le Feature Builder.

---

## En attente

### BUSINESS
- **Simulateur prime saisonnière** — Calcul des primes d'été/hiver pour l'équipe selon le CA réalisé.

### OPERATIONS

### INTELLIGENCE
- **Analyse saisonnalité ingrédients** — Calendrier visuel des saisons par ingrédient pour optimiser les achats et les menus.

### COMMUNICATION
- **Générateur de bon cadeau PDF** — Création de bons-cadeaux personnalisés (nom, montant, design) exportables en PDF.

---

## Complétées

- ✅ **Calculateur Seuil de Rentabilité** (2026-04-24) — Page `/rentabilite` dans BUSINESS. Charges fixes, taux marge variable, ticket moyen → CA seuil, couverts/mois/semaine/jour.
- ✅ **Calculateur TVA restauration** (2026-05-06) — Page `/calculateur-tva` dans BUSINESS. Convertisseur HT↔TTC pour les 3 taux (5,5 % / 10 % / 20 %) avec tableau de référence produits.
- ✅ **Calculateur nombre couverts cible** (2026-04-29) — Page `/couverts-cible` dans BUSINESS. CA objectif, ticket moyen, jours ouverture, services/jour → couverts/mois/semaine/jour/service + badge faisabilité.
- ✅ **Tableau de bord DLC/DLUO** (2026-06-03) — Page `/dlc-tracker` dans OPERATIONS. Suivi des dates d'expiration (DLC/DLUO) avec alertes visuelles vert/orange/rouge, KPIs (expiré/bientôt/ok), ajout/suppression produits, persistance localStorage.
- ✅ **Simulateur augmentation prix carte** (2026-05-27) — Page `/simulateur-prix` dans INTELLIGENCE. CA mensuel, ticket moyen, food cost %, hausse → gain marge mensuel/annuel, slider élasticité, point mort clients, tableau comparatif 5/10/15/20%.
- ✅ **Calculateur coût main d'œuvre** (2026-05-20) — Page `/cout-main-oeuvre` dans BUSINESS. Saisie équipe + CA → ratio masse salariale/CA, jauge colorée, alertes, benchmarks UMIH/GNI par type d'établissement.
- ✅ **Checklist ouverture/fermeture** (2026-07-25) — Page `/checklist-service` dans OPERATIONS. Deux onglets (Ouverture/Fermeture), tâches pré-remplies, barre de progression, ajout de tâches personnalisées, réinitialisation, persistance localStorage.
- ✅ **Chrono préparation par poste** (2026-08-02) — Page `/chrono-preparation` dans OPERATIONS. 3 stations (Chaud, Froid, Pâtisserie), start/pause/enregistrer/reset, historique 5 derniers chrono, moyenne, postes personnalisés, persistance localStorage.
