# Backlog Features — RestauMargin

Triées par impact décroissant. La feature en cours est retirée par le Feature Builder.

---

## En attente

### BUSINESS
- **Calculateur TVA restauration** — Aide au calcul TVA 5.5% / 10% / 20% selon contexte (sur place, à emporter, alcool). Page interne simple, aucun API.
- **Simulateur prime saisonnière** — Calcul des primes d'été/hiver pour l'équipe selon le CA réalisé.
- **Tableau de bord DLC/DLUO** — Suivi visuel des dates d'expiration des produits en stock avec alertes colorées (vert/orange/rouge).
- **Calculateur coût main d'œuvre** — Ratio masse salariale / CA avec alertes benchmarks secteur (idéal < 35 %).

### OPERATIONS
- **Chrono préparation par poste** — Timer par station cuisine (chaud, froid, pâtisserie) pour mesurer les temps de sortie des plats.
- **Checklist ouverture/fermeture** — Listes de tâches personnalisables pour l'ouverture et la fermeture du restaurant, avec signature digitale.
- **Calculateur nombre couverts cible** — À partir du CA objectif et du ticket moyen, calcule le nombre de couverts à viser par service.

### INTELLIGENCE
- **Analyse saisonnalité ingrédients** — Calendrier visuel des saisons par ingrédient pour optimiser les achats et les menus.
- **Simulateur augmentation prix carte** — Impact d'une hausse de prix de X% sur la marge et le CA, avec courbe de sensibilité.

### COMMUNICATION
- **Générateur de bon cadeau PDF** — Création de bons-cadeaux personnalisés (nom, montant, design) exportables en PDF.

---

## Complétées

- ✅ **Calculateur Seuil de Rentabilité** (2026-04-24) — Page `/rentabilite` dans BUSINESS. Charges fixes, taux marge variable, ticket moyen → CA seuil, couverts/mois/semaine/jour.
