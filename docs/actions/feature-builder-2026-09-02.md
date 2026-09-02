# Feature Builder — 2026-09-02

## Feature livrée : Saisonnalité des ingrédients

**Route :** `/saisonnalite`  
**Section sidebar :** INTELLIGENCE  
**Fichier :** `client/src/pages/SaisonnaliteIngredients.tsx`

## Ce qui a été fait

- Créé `SaisonnaliteIngredients.tsx` (~200 LOC) avec :
  - 56 ingrédients couvrant 5 catégories : Légumes, Fruits, Champignons, Herbes, Poissons
  - Barre mensuelle colorée par catégorie (Jan → Déc) pour chaque ingrédient
  - Filtre par catégorie (boutons), par mois (grille 12 mois), et recherche texte
  - Mois courant mis en évidence automatiquement
  - Astuces food cost pour 8 ingrédients clés (tomate, fraise, cèpe, saint-jacques…)
  - Design W&B complet (light + dark mode, Tailwind hex directs, zero slate)
- Ajouté `Leaf` dans les imports lucide-react de `App.tsx`
- Ajouté lazy import `SaisonnaliteIngredients` dans `App.tsx`
- Ajouté `{ to: '/saisonnalite', icon: Leaf, label: 'Saisonnalité' }` dans la section INTELLIGENCE
- Ajouté `<Route path="/saisonnalite" element={<SaisonnaliteIngredients />} />`
- TypeScript : 0 erreur propre au fichier (erreurs env pre-existantes sans `node_modules`)
- Commit + push sur `main` → Vercel deploie automatiquement

## Commit

`59dda25` — feat: seasonal ingredient calendar (/saisonnalite)
