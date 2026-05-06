# Feature Builder — 2026-05-06

## Feature livrée : Calculateur TVA restauration

**Route** : `/calculateur-tva`  
**Fichiers créés** : `client/src/pages/TvaCalculator.tsx`  
**Fichiers modifiés** : `client/src/App.tsx` (lazy import + route + sidebar BUSINESS)

### Ce qui a été fait

- Page de calculateur TVA restauration en mode W&B (light/dark)
- Convertisseur bidirectionnel **HT → TTC** et **TTC → HT**
- 3 cartes résultats simultanées, une par taux applicable :
  - **10 %** — nourriture/boissons consommées sur place
  - **5,5 %** — nourriture/boissons à emporter
  - **20 %** — boissons alcoolisées (tous contextes)
- Tableau de référence produits (sandwichs, glaces, alcools, confiseries…)
- Lien sidebar dans la section BUSINESS
- Commit + push `main` : `8046537`

### Décisions techniques

- Aucune API nécessaire (calcul client-side uniquement)
- `useMemo` sur le parse du montant pour éviter les recalculs inutiles
- `inputMode="decimal"` pour le clavier numérique mobile
- Couleur par taux : teal (10 %), emerald (5,5 %), amber (20 %)

### Backlog

- Feature retirée du backlog `features.md`
- 8 features restantes en attente
