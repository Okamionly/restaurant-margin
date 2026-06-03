# Feature Builder — 2026-06-03

## Feature shippée : Tableau de bord DLC / DLUO

**Route :** `/dlc-tracker`
**Section sidebar :** OPERATIONS
**Fichier :** `client/src/pages/DlcTracker.tsx`

## Ce qui a été fait

### Page DlcTracker.tsx (~240 LOC)
- Affichage trafic light : vert (> 3j), orange (0-3j), rouge (expiré)
- 3 KPI cards cliquables pour filtrer par statut
- Formulaire d'ajout (nom, catégorie, quantité, unité, date, type DLC/DLUO)
- Liste triée par urgence (les plus proches d'expiration en tête)
- Filtre par statut (tous / expiré / bientôt / ok)
- Suppression individuelle par produit
- Persistance 100% localStorage (pas de backend requis)
- Légende explicative DLC vs DLUO en bas de page
- Light + Dark mode complets
- Aucune dépendance externe ajoutée

### App.tsx
- Lazy import `DlcTracker`
- Route ajoutée : `<Route path="/dlc-tracker" element={<DlcTracker />} />`
- Lien sidebar dans section OPERATIONS avec icône `Package`

## Backlog
- Feature retirée de `docs/backlog/features.md`
- Ajoutée dans la liste "Complétées"
