# Cap Table — RestauMargin
**Version** : 1.0 — 2026-04-23
**Statut** : Template — action juridique externe requise pour formalisation

> AVERTISSEMENT LEGAL : Ce document est un template de travail interne. Il ne constitue pas un acte juridique. La création de SASU, l'émission de BSPCE et toute transaction capitalistique nécessitent l'intervention d'un avocat ou expert-comptable. Ce fichier sert à cadrer la réflexion et préparer les conversations avec les conseils.

---

## Structure actuelle (pré-SASU)

| Actionnaire | Statut | Actions | % |
|---|---|---|---|
| Youssef Guessous | Fondateur | 100 (symbolique) | 100% |
| **Total** | | **100** | **100%** |

**Forme juridique actuelle** : Auto-entrepreneur (à formaliser en SASU — priorité OKR Q2 KR3.3)

---

## Structure cible post-constitution SASU

### Scénario de base (bootstrapped, pré-seed)

| Actionnaire | Type | Actions | % |
|---|---|---|---|
| Youssef Guessous | Fondateur | 10 000 | 90% |
| Pool BSPCE réservé | Non émis | 1 111 (réserve) | 10% (dilué futur) |
| **Total fully diluted** | | **11 111** | **100%** |

**Valeur nominale recommandée** : 0,01€/action (standard SASU early-stage France)
**Capital social de constitution** : 100€ (10 000 actions × 0,01€)

---

## Pool BSPCE — Plan d'attribution prévu

Les BSPCE (Bons de Souscription de Parts de Créateur d'Entreprise) sont l'outil fiscal optimal pour les early-stage français — exonérations IS + flat tax 12,8% sur plus-value pour le bénéficiaire.

### Règles d'attribution envisagées

| Bénéficiaire type | % pool | Vesting | Cliff | Conditions |
|---|---|---|---|---|
| Dev senior co-founder track | 1-2% | 4 ans mensuel | 12 mois | à 3k€ MRR |
| Customer Success lead | 0,5-1% | 3 ans mensuel | 6 mois | à 500€ MRR |
| Advisor strategic | 0,25% par advisor | 2 ans mensuel | 3 mois | Advisory agreement signé |

**Pool réservé total** : 10% fully diluted (standard seed Europe)

### Standard vesting clause (à adapter avec avocat)

- Vesting linéaire mensuel post-cliff
- Accélération single-trigger en cas de changement de contrôle
- Good leaver / bad leaver à définir selon conseil

---

## Scénarios de levée de fonds

### Scenario A — Seed 500k€ à valorisation pre-money 3M€

| Actionnaire | Pre-seed | Post-seed |
|---|---|---|
| Youssef Guessous | 90% | 67,5% |
| Pool BSPCE (non émis) | 10% | 7,5% |
| Investisseur seed | 0% | 25% |
| **Total** | **100%** | **100%** |

**Calcul** :
- Pre-money : 3 000 000€
- Investissement : 500 000€
- Post-money : 3 500 000€
- Dilution : 500k / 3 500k = 14,3%
- Fondateur post-dilution : 90% × (1 - 14,3%) = 77,1% — mais avec le pool maintenu, structure à 67,5%/7,5%/25%

**Note** : à ce stade (0 MRR), une valorisation 3M€ est difficile à défendre. Milestone réaliste pour seed crédible : 10k€ ARR avec 10+ clients payants sur un vertical clair.

### Scenario B — Seed 200k€ (love money / BA) à 1,5M€ pre-money

| Actionnaire | Pre-seed | Post-seed |
|---|---|---|
| Youssef Guessous | 90% | 76% |
| Pool BSPCE (non émis) | 10% | 8,4% |
| Business Angel(s) | 0% | 15,7% |
| **Total** | **100%** | **100%** |

**Calcul** : 200k / 1 700k = 11,8% de dilution — structure plus founder-friendly pour une première levée de validation.

### Scenario C — No raise, bootstrapped jusqu'à 50k€ ARR

Structure inchangée. Fondateur 90%, pool BSPCE non émis 10%.
Avantage : aucune dilution, contrôle total.
Condition : les 215h de priorités top-10 génèrent >500€ MRR à fin Q2 et >5k€ MRR à fin Q3.

---

## Documents à préparer (due diligence readiness)

Pour être "investissable" en 90 jours, voici les documents à avoir prêts :

| Document | Statut | Priorité |
|---|---|---|
| Statuts SASU | A créer | Urgent (OKR Q2 KR3.3) |
| Registre des mouvements de titres | A créer | Urgent |
| PV d'assemblée constitution | A créer | Urgent |
| Shareholders agreement template | A préparer | T3 2026 |
| BSPCE plan règlement plan | A préparer | T3 2026 (avant 1er hire) |
| Comptes annuels / bilan | N/A (pré-SASU) | T3 2026 |
| Modèle financier 3 ans | A créer (voir INVESTOR_UPDATE_TEMPLATE.md) | T3 2026 |

---

## Conseils recommandés

- **Expert-comptable** : Nécessaire pour constitution SASU + optimisation charges sociales TNS vs salaire
- **Avocat startup** : Nécessaire avant premier BSPCE ou investment. Coût : 1-3k€ pour une doc BSPCE complète. Options : Legalstart pour le simple, cabinet spécialisé (Gide, Fidal, Vaughan Avocats) pour le seed.
- **Station Fiscal** : Vérifier l'éligibilité JEI (Jeune Entreprise Innovante) — exonération IS + charges sociales dirigeant pendant 8 ans si R&D >15% charges.

---

## Principes de gouvernance (pré-investisseur)

- Décisions produit, hiring, pricing : Fondateur seul
- Dépenses >5k€ : validation interne (self-check) documentée
- Changement de direction stratégique majeure : note écrite dans ce repo
- Advisor board : 2-3 advisors max, réunion mensuelle 30 min, pas de droit de vote

---

*Ce document est confidentiel. Ne pas partager publiquement. Versionné dans le repo Git (si repo privé) ou dans /private/ (gitignored) si repo public.*

*Dernière mise à jour : 2026-04-23 — prochain checkpoint : SASU constituée Q2 2026*
