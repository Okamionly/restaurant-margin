# Feature Builder — 2026-08-02

## Feature livrée : Chrono préparation par poste

**Page** : `/chrono-preparation`  
**Section sidebar** : OPERATIONS  
**Fichier** : `client/src/pages/ChronoPreparation.tsx`

### Description

Timer par station cuisine permettant de mesurer les temps de sortie des plats.

### Fonctionnalités

- 3 stations par défaut : Chaud (🔥), Froid (❄️), Pâtisserie (🍰)
- Boutons Démarrer / Pause / Reprendre par station
- Bouton "Enregistrer" pour lapper le temps et remettre le chrono à zéro
- Historique des 5 derniers temps enregistrés par station
- Affichage de la moyenne des temps enregistrés
- Ajout de postes personnalisés (avec suppression)
- Persistance `localStorage` (key: `chronoPreparation`)
- Timer live à 500ms de refresh
- Badge "En cours" animé quand un chrono tourne

### Style

- W&B theme (white/dark:black), zéro slate
- Icônes lucide-react : Timer, Flame, Snowflake, CakeSlice, Play, Square, RotateCcw, Plus, Trash2
- Teal-600 pour le bouton start et le timer actif, amber-500 pour pause, emerald-500 pour enregistrer
- Responsive mobile-first, `max-w-2xl`

### Commits

- `feat: add kitchen station preparation timer (/chrono-preparation)`
- `docs: feature-builder log`

### Statut

✅ Livré — Vercel déploie automatiquement depuis main.
