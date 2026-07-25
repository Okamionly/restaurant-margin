# Feature Builder — 2026-07-25

## Feature livrée : Checklist ouverture/fermeture de service

**Route** : `/checklist-service`  
**Section sidebar** : OPERATIONS  
**Fichier** : `client/src/pages/ChecklistService.tsx` (175 LOC)

## Ce qui a été fait

- Créé `ChecklistService.tsx` : page avec deux onglets (Ouverture / Fermeture)
- 8 tâches pré-remplies par mode (équipements, températures, caisse, briefing, etc.)
- Barre de progression (0 → 100 %) avec couleur teal → emerald à 100 %
- Message de félicitation quand toutes les tâches sont cochées
- Ajout de tâches personnalisées (Enter ou bouton), suppression au survol
- Bouton "Réinitialiser" pour remettre les tâches par défaut
- Persistance `localStorage` — les coches sont conservées entre sessions
- Style W&B complet : light + dark mode, Tailwind sans slate, icons lucide-react

## Modifications App.tsx

- Import lazy : `ChecklistService`
- Route : `<Route path="/checklist-service" element={<ChecklistService />} />`
- Sidebar OPERATIONS : `{ to: '/checklist-service', icon: ClipboardList, label: 'Checklist service' }`

## Backlog

- Retirée : **Checklist ouverture/fermeture**
- Restant : Chrono préparation par poste, Simulateur prime saisonnière, Analyse saisonnalité ingrédients, Générateur de bon cadeau PDF
