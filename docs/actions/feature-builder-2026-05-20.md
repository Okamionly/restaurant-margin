# Feature Builder — 2026-05-20

## Feature shippée : Calculateur coût main d'œuvre

**Route** : `/cout-main-oeuvre`  
**Fichier** : `client/src/pages/LaborCostCalculator.tsx`  
**Section sidebar** : BUSINESS

### Ce qui a été fait

- Nouvelle page calculateur avec deux colonnes : inputs à gauche, résultats à droite
- Inputs :
  - CA mensuel HT (€)
  - Tableau des employés : poste + salaire brut, ajout/suppression dynamique
- Calculs automatiques :
  - Charges patronales estimées à 42% du brut
  - Masse salariale totale (brut + charges)
  - Ratio masse salariale / CA (%)
- Jauge visuelle colorée : vert ≤ 30%, orange 30-35%, rouge > 35%
- Alerte rouge si ratio > 35% : montant à économiser affiché
- Alerte verte si ratio dans la norme
- Tableau de benchmarks secteur (restauration rapide, brasserie, traditionnel, gastronomique) — source UMIH/GNI 2024
- Lazy import + route protégée dans App.tsx
- Lien sidebar dans section BUSINESS

### Commits

- `84785d8` — feat: calculateur coût main d'oeuvre avec ratio masse salariale/CA
