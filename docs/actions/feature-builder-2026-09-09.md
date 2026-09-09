# Feature Builder — 2026-09-09

## Feature codée : Générateur de bon cadeau PDF

**Route :** `/bon-cadeau`  
**Section sidebar :** COMMUNICATION  
**Fichier :** `client/src/pages/BonCadeau.tsx`

## Ce qui a été fait

- Créé la page `BonCadeau.tsx` (~180 LOC, < 200 LOC target ✅)
- 3 designs de bon cadeau sélectionnables : Classique (noir/or), Moderne (teal), Festif (violet/rose)
- Champs personnalisables : nom restaurant, destinataire, expéditeur, montant (€), message, date d'expiration, code unique
- Génération de code unique aléatoire (format GC-XXXXXX) avec bouton de renouvellement
- Aperçu live du bon cadeau avec rendu fidèle à l'impression
- Export PDF via `window.open + window.print()` (sans dépendance externe)
- Ajout lazy import + route `/bon-cadeau` dans `App.tsx`
- Ajout entrée sidebar sous COMMUNICATION avec icône `Gift`

## Vérification TypeScript

```
npx tsc --noEmit → 1 warning pré-existant (vite/client), aucune erreur sur le nouveau code
```

## Commits

- `feat: add gift card generator page (/bon-cadeau)` → pushed to main
- `docs: feature-builder log 2026-09-09` → pushed to main

## Backlog

- Feature retirée de `docs/backlog/features.md`
- Ajoutée dans la section Complétées
