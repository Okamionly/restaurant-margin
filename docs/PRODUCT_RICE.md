# RICE Scoring Framework — RestauMargin

> Methode de priorisation produit pour l'equipe RestauMargin.
> Mise a jour : 2026-04-23 | Auteur : CPO Build

---

## 1. Formule RICE

```
RICE Score = (Reach × Impact × Confidence) / Effort
```

| Variable | Definition | Echelle |
|---|---|---|
| **Reach** | Nombre d'utilisateurs touches en 30 jours | Nombre brut (users/mois) |
| **Impact** | Impact sur l'activation ou la retention | 0.25 = minimal, 0.5 = faible, 1 = moyen, 2 = fort, 3 = massif |
| **Confidence** | Niveau de certitude basé sur données/interviews | 20% = intuition, 50% = hypothese, 80% = evidence, 100% = prouve |
| **Effort** | Effort de developpement (person-weeks) | En semaines-personnes |

**Interpretation du score :**
- > 100 : Priorite critique, next sprint
- 50-100 : Haute priorite, Q1
- 20-50 : Moyenne priorite, Q2
- < 20 : Backlog, revisiter si PMF signal

---

## 2. Politique de priorisation (Stop Building Policy)

> **Regle fondamentale (2026-04-23) :** ZERO nouvelle feature jusqu'a 10 clients payants.
> Mode maintenance + optimisation activation uniquement.

Criteres de deblocage :
- 10 clients payants → autoriser 1 nouvelle feature / sprint
- Sean Ellis Score > 40% → ouvrir roadmap complete
- NPS > 30 → investir dans differenciateurs

---

## 3. Tableau de scoring Q2 2026 — 10 features candidates

| # | Feature | Reach | Impact | Confidence | Effort (pw) | RICE Score | Priorite |
|---|---|---|---|---|---|---|---|
| 1 | Brancher Stripe (checkout) | 12 | 3 | 100% | 1 | **3600** | CRITIQUE |
| 2 | Seed data 50 ingredients Transgourmet | 12 | 2 | 80% | 0.5 | **3840** | CRITIQUE |
| 3 | Onboarding checklist 6 etapes | 12 | 2 | 80% | 1 | **1920** | HAUTE |
| 4 | First-run product tour | 12 | 1 | 70% | 0.5 | **1680** | HAUTE |
| 5 | Unification typographie (General Sans) | 12 | 0.5 | 100% | 0.5 | **1200** | HAUTE |
| 6 | PostHog analytics (evenements activation) | 12 | 2 | 90% | 2 | **1080** | HAUTE |
| 7 | Accessibilite WCAG 2.1 AA (top 20 pages) | 12 | 0.5 | 80% | 2 | **240** | MOYENNE |
| 8 | Email nurturing J1/J3/J7 | 12 | 2 | 50% | 3 | **400** | MOYENNE |
| 9 | Redesign landing hero (balance BT + vocal) | 30 | 2 | 60% | 3 | **1200** | HAUTE |
| 10 | Kill list 25+ pages non-core (feature flags) | 12 | 1 | 90% | 2 | **540** | MOYENNE |

> Note : Reach = 12 (base users actuelle). A recalculer apres campagne externe.

---

## 4. Process de priorisation

### Cadence recommandee
- **Hebdomadaire** : revue des metriques activation (TTV, conversion wizard, first_recipe)
- **Bi-mensuel** : RICE scoring sur nouvelles demandes features
- **Mensuel** : PMF test (Sean Ellis), ajustement roadmap

### Criteres d'entree dans le backlog
Une feature entre dans le backlog uniquement si :
1. Au moins 3 users l'ont demandee explicitement (interviews ou Crisp)
2. Elle ameliore directement activation, retention ou conversion
3. Elle n'entre pas en conflit avec la kill list

### Criteres de sortie de la kill list
Une feature sur la kill list peut etre reactivee si :
1. RICE Score > 500 recalcule avec 100+ users
2. Au moins 5 users payants la reclament

---

## 5. Kill List actuelle (features en pause)

Ces features sont cachees ou desactivees. Ne pas investir de developpement.

| Feature | Raison | Action recommandee |
|---|---|---|
| Messagerie | Hors-scope food cost | Supprimer apres 10 payants |
| EmailMarketing | Conflict positionnement | Renvoyer vers Brevo/Mailchimp |
| Seminaires + Devis | Verticale evenementiel | Supprimer |
| Comptabilite | Bataille perdue vs Pennylane | Integration API |
| Marketplace + RFQ + FournisseurPromo | 3 features redondantes | Garder 1 seule |
| AIAssistant (page dediee) | Doit etre contextuel | Integrer dans sidebar |
| QRCodeGenerator + QRMenu | Doublon | Merger en 1 page |
| EmailSequences, AutoOrders | Premature | Freeze |
| AllergenMatrix | Nice-to-have, deja couvert HACCP | Simplifier |
| NegociationIA | Trop complexe pour early stage | Freeze |

---

## 6. Metriques d'activation a tracker (PostHog events)

```javascript
// Evenements critiques a implementer
posthog.capture('first_ingredient_added')
posthog.capture('first_recipe_created')
posthog.capture('aha_moment_reached', { time_to_aha_minutes: N })
posthog.capture('voice_command_used')
posthog.capture('weighstation_connected')
posthog.capture('invoice_scanned')
posthog.capture('onboarding_completed', { steps_completed: N })
posthog.capture('trial_to_paid_conversion')
```

**KPIs cibles (H1 2026) :**
- Activation rate (1 recette en 24h) : > 40% (actuel : probablement < 20%)
- Time to first recipe : < 5 minutes
- Time to aha moment : < 10 minutes
- Trial-to-paid conversion : > 15%
- NPS : > 30
- Sean Ellis PMF score : > 40%

---

## 7. Processus d'interview utilisateur (template JTBD)

**Cible : 5 pizzerias + 5 bistros**

Questions clés :
1. "Racontez-moi la derniere fois que vous avez calcule le cout d'un plat. Qu'est-ce qui s'est passe ?"
2. "Qu'est-ce qui vous a fait chercher un outil comme RestauMargin ?"
3. "Si RestauMargin disparaissait demain, comment vous sentiriez-vous ?"
4. "Quelle est la fonctionnalite dont vous ne pourriez pas vous passer ?"
5. "Qu'est-ce qui vous a surprise (positivement ou negativement) dans le produit ?"

**Sean Ellis PMF Test :**
"Comment vous sentiriez-vous si vous ne pouviez plus utiliser RestauMargin ?"
- Tres decu / Plutot decu / Pas decu / Je ne l'utilise plus
- Cible : > 40% repondant "tres decu"

---

*Ce document est mis a jour apres chaque sprint. Owner : CPO.*
