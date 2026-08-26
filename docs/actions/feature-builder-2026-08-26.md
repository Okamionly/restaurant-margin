# Feature Builder — 2026-08-26

## Feature livrée : Simulateur prime saisonnière

**Page** : `/prime-saisonniere`  
**Section sidebar** : BUSINESS  
**Fichier** : `client/src/pages/PrimeSaisonniere.tsx`

## Ce qui a été fait

1. **Création de `PrimeSaisonniere.tsx`** (~190 LOC)
   - Toggle saison Été (juin–sept) / Hiver (nov–fév)
   - Saisie CA objectif et CA réalisé
   - Paramètres équipe : nombre d'employés, salaire brut moyen/mois, taux prime max %
   - Calcul du taux de réalisation (%)
   - Barème 4 paliers : < 90 % → pas de prime, 90–99 % → 50 %, 100–109 % → 100 %, ≥ 110 % → 150 %
   - Badge de performance coloré (rouge/amber/teal/emerald) avec barre de progression
   - 3 KPI cards : prime par employé, enveloppe totale, taux effectif
   - Tableau barème complet avec indicateur "Vous" sur le palier actuel
   - Note légale : valider avec expert-comptable

2. **App.tsx mis à jour**
   - Import lazy : `const PrimeSaisonniere = lazyRetry(() => import('./pages/PrimeSaisonniere'))`
   - Sidebar BUSINESS : `{ to: '/prime-saisonniere', icon: Gift, label: 'Prime saisonnière' }`
   - Route protégée : `<Route path="/prime-saisonniere" element={<PrimeSaisonniere />} />`

3. **Backlog mis à jour**
   - Feature retirée de "En attente"
   - Ajoutée dans "Complétées"

## Choix techniques

- Barème multiplicatif (taux max × multiplicateur) : simple à comprendre et à paramétrer
- Durée saison fixée à 4 mois (standard restauration)
- Aucune dépendance nouvelle
- Pas de localStorage (calculateur ponctuel, pas de persistance nécessaire)
