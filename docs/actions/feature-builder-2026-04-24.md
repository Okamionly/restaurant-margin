# Feature Builder — 2026-04-24

## Feature livrée : Calculateur Seuil de Rentabilité

**Route** : `/rentabilite`
**Sidebar** : Section BUSINESS — icône `Activity` (lucide-react)
**Fichiers créés/modifiés** :
- `client/src/pages/BreakevenCalculator.tsx` (nouveau, ~170 LOC)
- `client/src/App.tsx` (import lazy + route + sidebar entry)
- `docs/backlog/features.md` (créé)

## Ce que fait la feature

Calculateur interactif permettant à un restaurateur de calculer son point mort mensuel :

1. **Charges fixes éditables** — 5 postes par défaut (loyer, salaires, assurances, abonnements, amortissements). Collapsible pour ne pas surcharger l'UI.
2. **Taux de marge sur coût variable** — slider 1-99%, avec info-bulle pédagogique (benchmark secteur 60-75%).
3. **Ticket moyen** et **jours d'ouverture/mois** — paramètres simples.
4. **Résultats en temps réel** :
   - CA seuil mensuel (carte accent teal)
   - CA seuil par jour
   - Nombre de couverts nécessaires : par mois / par semaine / par jour
5. **Tip ambre** : rappel benchmark sectoriel.
6. **Formule affichée** en bas de page (transparence pédagogique).

## Décisions techniques

- Pas d'API — calcul 100% client-side, pas de localStorage (recalcul instantané).
- Composant `StatCard` local (pas de composant réutilisable pour ne pas sur-abstraire).
- Style W&B strict : bg-white/dark:bg-[#0A0A0A]/50, teal-600, hex directs, zéro slate.
- Responsive grid md:grid-cols-2.

## Commit

`feat: add breakeven calculator page (/rentabilite)` — pushé sur main, Vercel déploie automatiquement.
