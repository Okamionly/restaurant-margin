# Feature Builder — 2026-04-29

## Feature livrée : Calculateur Couverts Cible

**Route :** `/couverts-cible`  
**Sidebar :** Section BUSINESS, après "Seuil de rentabilité"  
**Fichier créé :** `client/src/pages/CouvertsCible.tsx` (~200 LOC)

### Ce que fait la page

À partir de :
- CA objectif mensuel (€)
- Ticket moyen par couvert (€)
- Jours d'ouverture par mois
- Nombre de services par jour (1 / 2 / 3)
- Capacité de la salle (places)

Elle calcule et affiche :
- **Couverts / mois** (carte accent teal)
- **Couverts / semaine**
- **Couverts / jour**
- **Couverts / service**
- **Taux de remplissage** par service (barre colorée vert/orange/rouge)
- **Badge de faisabilité** : Atteignable / Ambitieux / Capacité insuffisante

### Repères secteur inclus
Tableau comparatif brasserie / gastronomique / fast-casual (ticket moyen + taux de remplissage typiques).

### Commits
- `feat: add couverts-cible calculator page`
- `docs: feature-builder log`
