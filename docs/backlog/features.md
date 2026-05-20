# Backlog Features — RestauMargin

Triées par impact décroissant. La feature en cours est retirée par le Feature Builder.

---

## En attente

### BUSINESS
- **Simulateur prime saisonnière** — Calcul des primes d'été/hiver pour l'équipe selon le CA réalisé.
- **Tableau de bord DLC/DLUO** — Suivi visuel des dates d'expiration des produits en stock avec alertes colorées (vert/orange/rouge).

### OPERATIONS
- **Chrono préparation par poste** — Timer par station cuisine (chaud, froid, pâtisserie) pour mesurer les temps de sortie des plats.
- **Checklist ouverture/fermeture** — Listes de tâches personnalisables pour l'ouverture et la fermeture du restaurant, avec signature digitale.

### INTELLIGENCE
- **Analyse saisonnalité ingrédients** — Calendrier visuel des saisons par ingrédient pour optimiser les achats et les menus.
- **Simulateur augmentation prix carte** — Impact d'une hausse de prix de X% sur la marge et le CA, avec courbe de sensibilité.

### COMMUNICATION
- **Générateur de bon cadeau PDF** — Création de bons-cadeaux personnalisés (nom, montant, design) exportables en PDF.

---

## Complétées

- ✅ **Calculateur Seuil de Rentabilité** (2026-04-24) — Page `/rentabilite` dans BUSINESS. Charges fixes, taux marge variable, ticket moyen → CA seuil, couverts/mois/semaine/jour.
- ✅ **Calculateur TVA restauration** (2026-05-06) — Page `/calculateur-tva` dans BUSINESS. Convertisseur HT↔TTC pour les 3 taux (5,5 % / 10 % / 20 %) avec tableau de référence produits.
- ✅ **Calculateur nombre couverts cible** (2026-04-29) — Page `/couverts-cible` dans BUSINESS. CA objectif, ticket moyen, jours ouverture, services/jour → couverts/mois/semaine/jour/service + badge faisabilité.
- ✅ **Calculateur coût main d'œuvre** (2026-05-20) — Page `/cout-main-oeuvre` dans BUSINESS. Saisie équipe + CA → ratio masse salariale/CA, jauge colorée, alertes, benchmarks UMIH/GNI par type d'établissement.
