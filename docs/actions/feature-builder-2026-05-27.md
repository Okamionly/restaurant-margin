# Feature Builder — 2026-05-27

## Feature livrée : Simulateur hausse des prix

**Route** : `/simulateur-prix`  
**Fichier** : `client/src/pages/PriceIncreaseSimulator.tsx`  
**Section sidebar** : INTELLIGENCE  

### Ce qui a été fait

- Nouvelle page `PriceIncreaseSimulator.tsx` (< 200 LOC, zéro dépendance externe)
- Import lazy + route ajoutés dans `client/src/App.tsx`
- Lien sidebar ajouté dans la section INTELLIGENCE

### Fonctionnalités

- **4 inputs** : CA mensuel, ticket moyen, food cost %, hausse de prix souhaitée
- **Slider élasticité** : perte de clientèle estimée (0–50 %)
- **Point mort clients** : calcul du seuil au-delà duquel la marge totale diminue, affiché en temps réel
- **KPIs Avant → Après** : CA, ticket moyen, marge mensuelle, food cost ratio
- **Gain de marge** mensuel + annuel avec indicateur couleur (vert/rouge)
- **Tableau de sensibilité** : scénarios 5 / 10 / 15 / 20 % en un coup d'œil, ligne du scénario actuel surlignée

### Formule point mort

```
point_mort = hausse% / (1 + hausse% - food_cost%)
```

### Commits

- `feat: add price increase simulator page (/simulateur-prix)`
- `docs: feature-builder log 2026-05-27`
