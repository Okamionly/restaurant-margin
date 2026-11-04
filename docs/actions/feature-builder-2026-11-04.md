# Feature Builder — 2026-11-04

## Fonctionnalité livrée

**Comparateur rentabilité plateformes livraison** — Page `/livraison-rentabilite` (section BUSINESS)

## Ce qui a été fait

1. **Backlog** : `docs/backlog/features.md` recréé avec 10 idées. Feature choisie et marquée complétée.
2. **Page** : `client/src/pages/LivraisonRentabilite.tsx` — 191 lignes.
   - Inputs : CA livraison mensuel, food cost + variables %, répartition % + commission % par canal (Uber Eats 27 %, Deliveroo 25 %, Just Eat 20 %, En direct 0 %)
   - Outputs : KPIs (CA, commissions totales, marge nette), tableau comparatif par canal (CA brut / commission / CA net / marge nette € et %), barres de marge, conseils d'optimisation
   - Alerte si la somme des % n'atteint pas 100
3. **Route** : ajout `lazyRetry` import + `<Route path="/livraison-rentabilite">` dans `client/src/App.tsx`
4. **Sidebar** : entrée `{ to: '/livraison-rentabilite', icon: Truck, label: 'Rentabilité livraison' }` dans BUSINESS

## Vérification

```
node scripts/verifier-preuve-sociale.cjs  → ✓ Aucune preuve sociale fabriquée
npx tsc --noEmit --skipLibCheck           → exit=0
npx vite build                            → ✓ built in 24.18s — exit=0
node scripts/prerender.cjs                → 132 HTML générés — exit=0
```

exit=0
