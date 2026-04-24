# Rapport CMO — 24 avril 2026

**Agent** : CMO RestauMargin (Claude Code)
**Date** : 24 avril 2026, 08h00 Paris
**Branche** : main

---

## 1. Metrics Acquisition

### API Daily Report
- **Status** : `{"error":"Unauthorized cron"}` — endpoint protégé, pas d'accès externe direct
- **Action requise** : Vérifier token cron ou exposer un endpoint lisible par l'agent

### Blog / SEO
| Indicateur | Valeur |
|---|---|
| Articles blog indexés | **8 pages** |
| Pages dans le sitemap | **26 URLs** |
| Couverture thématique | Food cost, marge, HACCP, fiche technique, gaspillage, IA resto, coefficient multiplicateur |

**Articles existants :**
- `BlogCalcMarge.tsx` — Calcul de marge restaurant
- `BlogCoefficient.tsx` — Coefficient multiplicateur
- `BlogFicheTechnique.tsx` — Fiche technique recette
- `BlogFoodCost.tsx` — Food cost
- `BlogGaspillage.tsx` — Gaspillage alimentaire
- `BlogHACCP.tsx` — HACCP
- `BlogIA.tsx` — IA en restauration
- `BlogIndex.tsx` — Index blog

**Ratio blog/sitemap** : 8/26 = 31 % des URLs sont du contenu blog.

### Analyse contenu manquant (opportunités SEO)
Thèmes à fort volume non encore couverts :
1. **Calcul du coût de revient d'un plat** (haute intention commerciale)
2. **Comment fixer le prix de vente d'un menu** (transactionnel)
3. **Logiciel de gestion de restaurant** (comparatif concurrentiel)
4. **Planning équipe restauration** (TOFU, trafic large)
5. **Prime de fidélité / programme fidélité restaurant** (MOFU)

---

## 2. Action du Jour

### Post social rédigé
- **Fichier** : `docs/marketing/social-posts/2026-04-24.md`
- **Thème** : 5 erreurs food cost qui coûtent cher
- **Format** : LinkedIn + Instagram, ~280 mots
- **CTA** : `/outils/calculateur-food-cost` (TOFU) + `/pricing` (conversion)
- **Hashtags** : #restauration #restaurateur #foodcost #gestion #margebrute

### Rationale du thème choisi
Le food cost reste le sujet #1 de douleur chez les restaurateurs indépendants. Angle "erreurs silencieuses" = fort taux d'engagement car diagnostic personnel. Timing post-Pâques : les restaurateurs font le bilan de la semaine chargée et cherchent à optimiser.

---

## 3. Recommandations Semaine

| Priorité | Action | Impact |
|---|---|---|
| 🔴 Haute | Rédiger article "Comment fixer le prix de vente d'un plat" | SEO transactionnel fort |
| 🔴 Haute | Corriger accès API daily-report pour agent CMO | Metrics réels |
| 🟡 Moyenne | Thread LinkedIn food cost semaine prochaine (série 5 posts) | Notoriété organique |
| 🟡 Moyenne | Ajouter Open Graph tags blog articles pour partage social | CTR social |
| 🟢 Basse | Page comparatif RestauMargin vs Excel | SEO concurrentiel |

---

## 4. KPIs à suivre

- Portée du post social (objectif : >800 impressions LinkedIn dans 48h)
- Clics vers `/outils/calculateur-food-cost` depuis social (UTM à ajouter)
- Nouvelles inscriptions trial dans les 72h post-publication
