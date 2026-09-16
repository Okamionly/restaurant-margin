# Feature Builder — 2026-09-16

## Feature livrée : Calculateur ROI Équipement

**Route :** `/roi-equipement`  
**Section sidebar :** BUSINESS  
**Commit :** `feat: add ROI equipment calculator page (/roi-equipement)`

### Contexte
Le backlog était vide (toutes les features précédentes complétées). Une nouvelle feature a été choisie parmi les besoins récurrents des restaurateurs : justifier un investissement équipement (four, machine espresso, lave-vaisselle…) avant l'achat.

### Ce qui a été fait

**Fichier créé :**
- `client/src/pages/RoiEquipement.tsx` (~200 LOC)

**Fichier modifié :**
- `client/src/App.tsx` : lazy import + route `/roi-equipement` + entrée sidebar BUSINESS

### Fonctionnalités
- Saisie : nom équipement, prix d'achat, durée d'amortissement (années), gain CA mensuel estimé, économies mensuelles (énergie, main d'œuvre)
- Résultats : ROI en %, délai de retour en mois, gain net sur la durée totale
- Comparaison jusqu'à 4 équipements via onglets cliquables
- Barre de progression visuelle payback vs durée d'amortissement (vert si retour avant fin amortissement, orange sinon)
- Tableau détail : investissement, gains CA cumulés, économies cumulées, amortissement mensuel
- Light + dark mode complet (W&B theme, zéro slate)
- Stateless (pas de localStorage — calculateur pur)

### Validation TS
Les erreurs TypeScript présentes sont pré-existantes dans l'environnement (modules react/lucide-react non résolus côté tsc dans le remote container) — identiques sur tous les fichiers existants comme `BreakevenCalculator.tsx`. Aucune erreur propre à `RoiEquipement.tsx`.

### Push
Pushé sur `main` — Vercel deploie automatiquement.
