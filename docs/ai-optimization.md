# Optimisation IA RestauMargin - Audit & Recommandations

Date : 2026-04-01
Source : Audit du code `api/index.ts` (route `/api/ai/chat`) + principes de Context Engineering

---

## 1. Audit du prompt actuel

### 1.1 Architecture actuelle

Le chat IA utilise **Claude Sonnet 4** (`claude-sonnet-4-20250514`) pour la route principale `/api/ai/chat` et **Claude 3 Haiku** (`claude-3-haiku-20240307`) pour 4 routes secondaires (forecast, menu-analysis, order-recommendation, invoice-check).

La route `/api/ai/chat` effectue **10 queries Prisma en parallele** a chaque requete :

| # | Query | Limite |
|---|-------|--------|
| 1 | `recipe.findMany` + ingredients inclus | 50 recettes |
| 2 | `ingredient.findMany` (par prix desc) | 30 ingredients |
| 3 | `inventoryItem.findMany` + ingredient | illimite |
| 4 | `supplier.findMany` | 20 fournisseurs |
| 5 | `employee.count` (actifs) | 1 valeur |
| 6 | `marketplaceOrder.count` | 1 valeur |
| 7 | `menuSale.findMany` (recentes) | 100 ventes |
| 8 | `haccpTemperature.findMany` (today) | 10 releves |
| 9 | `haccpCleaning.findMany` (today) | 20 taches |
| 10 | `employee.findMany` (actifs) | 30 employes |

### 1.2 Estimation tokens du system prompt

**System prompt statique (instructions + 19 exemples d'actions) :**

Le prompt contient :
- Instructions generales : ~100 tokens
- 19 blocs action JSON (exemples complets avec structure) : ~1 800 tokens
- Regles (categories, unites, consignes) : ~300 tokens
- **Total statique : ~2 200 tokens**

**Contexte dynamique (donnees restaurant, cas typique 30 recettes, 50 ingredients) :**

| Section | Tokens estimes |
|---------|---------------|
| Recettes (30 lignes detaillees avec id, cout, marge) | ~600 |
| Ingredients (30 lignes avec id, prix, unite, categorie) | ~500 |
| Alertes stock | ~100 |
| Fournisseurs (20 lignes) | ~200 |
| Employes (15 lignes avec id, role, taux) | ~200 |
| Releves HACCP | ~80 |
| Statistiques header | ~50 |
| **Total contexte dynamique** | **~1 730** |

**Message utilisateur moyen : ~30 tokens**

**TOTAL INPUT par requete : ~4 000 tokens**
**Output moyen (reponse + action JSON) : ~500 tokens**

### 1.3 Problemes identifies

#### P1 - Contexte trop large ("context stuffing")
Les 10 queries chargent TOUT le contexte a chaque requete, quel que soit le sujet. Un utilisateur qui demande "Quelle est la temperature du frigo ?" recoit 30 ingredients, 50 recettes, 20 fournisseurs, 15 employes... dont 90% sont inutiles pour sa question.

> Principe de Context Engineering : "The fundamental challenge is that context windows are constrained not by raw token capacity but by attention mechanics. As context length increases, models exhibit predictable degradation patterns."

#### P2 - 19 exemples d'actions dans chaque requete
Les 19 blocs `action` JSON sont envoyes a CHAQUE message, meme si l'utilisateur pose une simple question analytique. Ces exemples representent ~1 800 tokens de "bruit" constant.

#### P3 - Donnees redondantes
- `employee.count` ET `employee.findMany` sont charges en parallele (le count est redondant)
- Les IDs sont inclus dans chaque ligne de contexte, meme quand aucune action CRUD n'est demandee
- `marketplaceOrder.count` charge un seul nombre mais occupe un slot de query

#### P4 - Pas de cache
Le contexte est reconstruit a chaque message, meme si les donnees du restaurant n'ont pas change depuis 5 minutes. Pour un utilisateur posant 10 questions, ce sont 10 x les memes 10 queries DB.

#### P5 - Modele surdimensionne
La route chat principale utilise **Sonnet 4** au lieu de Haiku. Pour des questions simples (stock, temperature, marge d'un plat), Haiku suffirait et couterait 10-15x moins cher.

#### P6 - Pas de conversation multi-turn
Chaque requete est independante (pas d'historique). Le modele n'a aucun contexte des messages precedents, obligeant l'utilisateur a repeter le contexte.

---

## 2. Optimisations recommandees

### OPT-1 : Lazy Loading du contexte (impact : -60% tokens)

**Principe** : Ne charger que les donnees pertinentes pour la question.

**Implementation** : Classifier l'intention de l'utilisateur AVANT de charger le contexte.

```
Etape 1 : Appel rapide a Haiku pour classifier l'intention
  Input : message utilisateur (~30 tokens)
  Output : { "categories": ["recettes", "stock"], "needsActions": true }
  Cout : ~50 tokens total

Etape 2 : Charger uniquement les queries pertinentes
  "recettes" -> query recettes
  "stock" -> query inventaire
  "haccp" -> query temperatures + cleaning
  "planning" -> query employees
  "fournisseurs" -> query suppliers
  "analyse" -> query recettes + ventes
```

**Estimation** : Passe de ~1 730 tokens contexte a ~500 tokens en moyenne (seules 2-3 categories sur 6 sont pertinentes par question).

### OPT-2 : Compression du contexte (impact : -40% tokens contexte)

**Principe** : Envoyer des resumes au lieu de listes completes.

Actuellement :
```
- Salade Cesar (id:12, Entrées): vente 14.50€, coût 4.23€, marge 70.8%
- Entrecôte Grillée (id:13, Plats): vente 28.00€, coût 11.50€, marge 58.9%
... (30 lignes)
```

Apres compression :
```
30 recettes. Marge moyenne: 65%. Top marge: Salade Cesar 70.8%. Pire marge: Risotto 38.2%.
Alertes: 3 plats sous 40% marge (Risotto, Burger, Fish&Chips).
```

Reduction : 600 tokens -> 80 tokens pour les recettes.

L'IA peut toujours demander le detail d'un plat specifique via une action `analyze_recipe`.

### OPT-3 : Separation prompt statique / dynamique + cache (impact : -50% cout prompt)

**Principe** : Utiliser le prefix caching d'Anthropic.

Le system prompt se decompose en :
1. **Prefix stable** (instructions + actions) : ~2 200 tokens - identique pour TOUTES les requetes
2. **Contexte dynamique** : ~500-1 700 tokens - change par restaurant

Avec le prefix caching Anthropic, le prefix stable est mis en cache cote serveur apres le premier appel. Les appels suivants ne paient que 10% du cout pour cette partie.

**Cache applicatif (1h TTL)** pour le contexte restaurant :
```
Cache key : `ai-context:${restaurantId}`
TTL : 1 heure (ou invalidation sur mutation)
Benefice : elimine 10 queries DB pour 90% des messages
```

### OPT-4 : Reduction des exemples d'actions (impact : -1 200 tokens)

**Actuellement** : 19 exemples JSON complets avec toutes les proprietes.

**Optimise** :
- Garder seulement les 6 schemas de type (sans exemples de valeurs detaillees)
- Deplacer les exemples complets dans un bloc "reference" charge uniquement quand `needsActions: true`

Prompt optimise :
```
ACTIONS : create_recipe, update_recipe, analyze_recipe, duplicate_recipe,
add_ingredient, update_price, check_stock, create_order, suggest_order,
add_supplier, compare_suppliers, add_shift, weekly_planning,
margin_analysis, best_sellers, cost_alert, daily_report,
log_temperature, cleaning_checklist

Schemas : voir reference si action necessaire.
```

~600 tokens au lieu de ~1 800 tokens.

### OPT-5 : Routage de modele intelligent (impact : -80% cout/requete simple)

| Type de question | Modele | Cout relatif |
|-----------------|--------|-------------|
| Question simple (stock, temperature, prix) | Haiku 3.5 | 1x |
| Analyse (marges, tendances, comparaisons) | Haiku 3.5 | 1x |
| Creation/action complexe (fiche technique, planning) | Sonnet 4 | 12x |

**80% des questions** sont des consultations simples -> Haiku suffit.

Tarifs Anthropic (par million de tokens) :
- Haiku 3.5 : $0.80 input / $4.00 output
- Sonnet 4 : $3.00 input / $15.00 output

### OPT-6 : Historique de conversation leger (impact : qualite UX)

Garder les 3 derniers messages (user + assistant) dans le contexte, mais en version compressee :
```
Historique recent:
- User: "Quelle est ma marge sur la Salade Cesar?"
- IA: "Marge 70.8% (cout 4.23€ / vente 14.50€)"
- User: [message actuel]
```

Cout additionnel : ~100 tokens. Gain : l'utilisateur peut enchainer ("et pour l'Entrecote?") sans repeter le contexte.

---

## 3. Estimation des couts

### Hypotheses
- 100 restaurants actifs
- 15 messages/jour/restaurant en moyenne
- 30 jours/mois
- Total : **45 000 requetes/mois**

### AVANT optimisation (situation actuelle)

| Metrique | Valeur |
|----------|--------|
| Modele | Sonnet 4 pour TOUT |
| Input moyen | ~4 000 tokens |
| Output moyen | ~500 tokens |
| Cout input/req | 4 000 / 1M x $3.00 = $0.012 |
| Cout output/req | 500 / 1M x $15.00 = $0.0075 |
| **Cout/requete** | **$0.0195** |
| **Cout mensuel (45k req)** | **$877.50 (~810 EUR)** |

### APRES optimisation

**Repartition estimee :**
- 80% requetes simples -> Haiku 3.5 (36 000 req)
- 20% requetes actions -> Sonnet 4 (9 000 req)

**Requetes Haiku (apres OPT-1 a OPT-4) :**

| Metrique | Valeur |
|----------|--------|
| Input moyen | ~1 200 tokens (prompt compresse + contexte lazy) |
| Output moyen | ~400 tokens |
| Cout input/req | 1 200 / 1M x $0.80 = $0.00096 |
| Cout output/req | 400 / 1M x $4.00 = $0.0016 |
| **Cout/requete Haiku** | **$0.00256** |
| Total Haiku (36k req) | **$92.16** |

**Requetes Sonnet (actions, avec prefix cache) :**

| Metrique | Valeur |
|----------|--------|
| Prefix cache (2 200 tokens a 10%) | $0.00066 |
| Contexte dynamique (~800 tokens) | 800 / 1M x $3.00 = $0.0024 |
| Output moyen | ~600 tokens -> $0.009 |
| **Cout/requete Sonnet** | **$0.01206** |
| Total Sonnet (9k req) | **$108.54** |

### Comparaison

| | Avant | Apres | Reduction |
|---|-------|-------|-----------|
| Tokens input/requete | ~4 000 | ~1 200 (moy.) | **-70%** |
| Cout/mois (100 restaurants) | **~810 EUR** | **~185 EUR** | **-77%** |
| Queries DB/requete | 10 | 2-3 (moy.) | **-70%** |
| Latence estimee | ~3s | ~1.5s | **-50%** |

### Cout par restaurant/mois

| | Avant | Apres |
|---|-------|-------|
| Par restaurant | ~8.10 EUR/mois | ~1.85 EUR/mois |

---

## 4. Plan d'implementation (par priorite)

| Priorite | Optimisation | Effort | Impact cout |
|----------|-------------|--------|-------------|
| P1 | OPT-5 : Routage Haiku/Sonnet | 2h | -70% |
| P2 | OPT-3 : Cache contexte (1h TTL) | 3h | -60% queries DB |
| P3 | OPT-1 : Lazy loading contexte | 4h | -60% tokens |
| P4 | OPT-4 : Compression exemples actions | 1h | -1 200 tokens |
| P5 | OPT-2 : Compression donnees | 3h | -40% tokens contexte |
| P6 | OPT-6 : Historique conversation | 2h | +qualite UX |

**Impact cumule estime : passage de ~810 EUR/mois a ~185 EUR/mois pour 100 restaurants.**

---

## 5. References Context Engineering appliquees

- **Context stuffing** : charger tout le contexte a chaque requete = degradation d'attention (lost-in-middle)
- **Observation masking** : remplacer les outputs verbeux par des resumes (OPT-2)
- **Prefix caching** : reutiliser les KV blocks du prompt statique (OPT-3)
- **Context partitioning** : isoler les categories de donnees et ne charger que le pertinent (OPT-1)
- **Tool design consolidation** : reduire les 19 schemas d'actions a un format compact (OPT-4)
- **Progressive disclosure** : charger les details uniquement quand necessaires, pas systematiquement

Source : Agent Skills for Context Engineering (muratcankoylan/Agent-Skills-for-Context-Engineering)
