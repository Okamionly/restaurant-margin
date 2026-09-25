# Feature Builder — 2026-09-25

## Feature livrée : Calculateur Coût par Couvert

**Route** : `/cout-couvert`  
**Section sidebar** : BUSINESS  
**Fichier** : `client/src/pages/CoutCouvert.tsx`  
**LOC** : ~190

### Ce qui a été fait

- Page `/cout-couvert` : calculateur permettant de ventiler le coût réel pour servir un client
- **Inputs** : CA mensuel, nb couverts/mois, food cost %, masse salariale %, charges fixes € , autres charges variables %
- **Résultats** :
  - Ticket moyen calculé automatiquement
  - Coût total par couvert (somme des 4 postes)
  - Marge nette par couvert (€ et %)
  - Barre de progression colorée pour chaque poste (matières, personnel, charges fixes, autres)
  - Section benchmarks avec alertes visuelles (food cost 28-34 %, masse salariale 30-35 %, marge ≥ 10 %)
- **App.tsx** : import lazy `CoutCouvert`, route protégée, lien sidebar avec icône `Utensils`
- **Icône `Utensils`** ajoutée aux imports lucide-react dans App.tsx

### Commits pushés sur `main`

- `feat: add cost-per-cover calculator page (/cout-couvert)`
- Rebase propre sur HEAD remote avant push

### Backlog

- Feature ajoutée dans `docs/backlog/features.md` → section Complétées
