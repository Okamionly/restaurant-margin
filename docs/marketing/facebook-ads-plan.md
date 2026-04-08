# RestauMargin -- Plan Facebook / Meta Ads Complet

> **Produit** : RestauMargin -- Logiciel SaaS gestion de marge restaurant avec IA
> **Landing Page** : https://www.restaumargin.fr
> **Meta Pixel ID** : XXXXXXXXXXXXXXXXX (a remplacer par le vrai ID)
> **Conversion principale** : Lead (inscription compte)
> **Budget recommande** : 200-400 EUR/mois
> **Marche** : France metropolitaine
> **Date** : Avril 2026

---

## 1. Structure de campagne

```
Compte Meta Business -- RestauMargin
│
├── Campagne 1 : Acquisition Froide (Conversions)
│   ├── Ad Set A : Interets Restauration (large)
│   ├── Ad Set B : Interets Gestion & Logiciel
│   └── Ad Set C : Proprietaires PME + Food
│
├── Campagne 2 : Retargeting (Conversions)
│   ├── Ad Set D : Visiteurs site 7 jours
│   └── Ad Set E : Visiteurs site 30 jours (excl. 7j)
│
└── Campagne 3 : Lookalike (Conversions) -- activer M+3
    ├── Ad Set F : Lookalike 1% clients
    └── Ad Set G : Lookalike 2% clients
```

---

## 2. Objectif de campagne

| Campagne | Objectif Meta | Optimisation | Evenement |
|----------|--------------|--------------|-----------|
| Acquisition Froide | Conversions | Conversions | Lead (inscription) |
| Retargeting | Conversions | Conversions | Lead (inscription) |
| Lookalike | Conversions | Conversions | Lead (inscription) |

> **Note** : Utiliser l'objectif "Conversions" plutot que "Lead Generation" (formulaire natif) car nous redirigeons vers restaumargin.fr pour l'inscription. Le Meta Pixel declenche `fbq('track', 'Lead')` a l'inscription.

---

## 3. Audiences cibles

### Ad Set A -- Interets Restauration (acquisition froide principale)

| Parametre | Valeur |
|-----------|--------|
| **Age** | 25-55 ans |
| **Sexe** | Tous |
| **Localisation** | France metropolitaine |
| **Langue** | Francais |
| **Interets** | Restauration, Restaurant management, Gestion de restaurant, CHR (Cafes Hotels Restaurants), UMIH, GNI restauration, Food cost management, Gastronomie professionnelle |
| **Comportements** | Proprietaires de petites entreprises, Administrateurs de pages Facebook professionnelles |
| **Exclusions** | Clients existants (liste email), Convertis 180 jours |
| **Taille estimee** | 300 000 - 500 000 |
| **Budget** | 50% du budget total |

### Ad Set B -- Interets Gestion & Logiciel

| Parametre | Valeur |
|-----------|--------|
| **Age** | 28-50 ans |
| **Localisation** | France metropolitaine |
| **Interets** | Logiciel de gestion, ERP, Comptabilite, SaaS, Gestion d'entreprise, Gestion des stocks |
| **Interets restreints (AND)** | Restauration OU Cuisine professionnelle OU Food service |
| **Taille estimee** | 100 000 - 200 000 |
| **Budget** | 25% du budget total |

### Ad Set C -- Proprietaires PME + Food

| Parametre | Valeur |
|-----------|--------|
| **Age** | 30-55 ans |
| **Localisation** | France metropolitaine |
| **Comportements** | Proprietaires de petites entreprises |
| **Interets** | Food service industry, Restaurant equipment, Cuisine professionnelle, Metro (grossiste), Rungis |
| **Taille estimee** | 150 000 - 300 000 |
| **Budget** | 25% du budget total |

### Ad Set D -- Retargeting 7 jours

| Parametre | Valeur |
|-----------|--------|
| **Source** | Pixel Meta -- Visiteurs site 7 derniers jours |
| **Exclusions** | Clients existants, convertis |
| **Frequence max** | 1 impression/jour |
| **Budget** | 20 EUR/mois minimum |

### Ad Set E -- Retargeting 30 jours

| Parametre | Valeur |
|-----------|--------|
| **Source** | Pixel Meta -- Visiteurs site 30 derniers jours (excluant 7j) |
| **Exclusions** | Clients existants, convertis |
| **Frequence max** | 3 impressions/semaine |
| **Budget** | 15 EUR/mois minimum |

### Ad Set F & G -- Lookalike (activer quand 100+ clients)

| Parametre | Ad Set F | Ad Set G |
|-----------|----------|----------|
| **Source** | Lookalike 1% clients | Lookalike 2% clients |
| **Base** | Liste emails clients actifs | Liste emails clients actifs |
| **Taille** | ~450 000 | ~900 000 |
| **Budget** | 50 EUR/mois | 30 EUR/mois |

---

## 4. Formats publicitaires et creations

### Format 1 -- Image statique (Feed Facebook + Instagram)

**Specifications :**
- Dimensions : 1080x1080 px (carre) + 1080x1350 px (portrait)
- Texte sur image : < 20% de la surface
- Format : PNG ou JPG haute qualite

**Visuel propose :**
- Capture d'ecran du dashboard RestauMargin avec une fleche montrant "+12% de marge"
- Fond sombre (coherent avec le branding noir/blanc)
- Logo RestauMargin en bas a droite
- Badge "Essai gratuit 7 jours" en haut a gauche

---

### Format 2 -- Carousel (Feed Facebook + Instagram)

**5 slides :**

| Slide | Visuel | Titre | Description |
|-------|--------|-------|-------------|
| 1 | Chiffre choc sur fond noir | "Vous perdez 15% de marge sans le savoir" | La plupart des restaurants ne connaissent pas leur vrai food cost |
| 2 | Capture dashboard | "Visualisez vos marges en temps reel" | Dashboard avec food cost par plat, alertes, tendances |
| 3 | Avant/Apres | "Avant : tableur Excel / Apres : RestauMargin" | Comparaison visuelle du workflow |
| 4 | Fiche technique IA | "L'IA cree vos fiches techniques" | Une fiche technique generee automatiquement |
| 5 | CTA | "Essai gratuit 7 jours -- 29 EUR/mois" | Sans carte bancaire, sans engagement |

---

### Format 3 -- Video (Reels Instagram + Stories + Feed)

**Video placeholder -- Script 15-20 secondes :**

| Timing | Contenu | Type |
|--------|---------|------|
| 0-3s | **Hook** : "Restaurateur, vous connaissez votre vraie marge ?" | Texte anime sur fond noir |
| 3-8s | **Probleme** : "73% des restaurants perdent 5 a 15% de marge sans le savoir" | Statistique animee |
| 8-14s | **Solution** : Capture d'ecran animee du dashboard RestauMargin | Screen recording |
| 14-18s | **Preuve** : "+12% de marge en 30 jours pour nos utilisateurs" | Chiffre anime |
| 18-20s | **CTA** : "Essai gratuit -- Lien en bio" | Logo + CTA |

**Specifications video :**
- Format : 9:16 (Stories/Reels) + 1:1 (Feed)
- Duree : 15-20 secondes
- Sous-titres : Obligatoires (80% regardent sans son)
- Resolution : 1080x1920 (9:16) ou 1080x1080 (1:1)

> **TODO** : Produire la video avec des captures d'ecran reelles du produit. Possibilite d'utiliser les credits Kling restants pour des animations.

---

## 5. Textes publicitaires -- 3 variations en francais

### Variation 1 -- Angle "Perte d'argent" (emotion/peur)

**Texte principal :**
> Vous gerez votre restaurant au feeling ?
>
> La plupart des restaurateurs perdent entre 5% et 15% de marge chaque mois sans le savoir. Des ingredients mal doses, des prix fournisseurs qui augmentent en silence, des plats qui ne sont pas rentables...
>
> RestauMargin analyse vos achats et calcule vos marges automatiquement. En 48h, vous savez exactement combien vous gagnez (ou perdez) sur chaque plat.
>
> Essai gratuit 7 jours. 29 EUR/mois. Sans engagement.

**Titre** : Arretez de perdre de l'argent sur vos menus
**Description du lien** : Calculez vos marges restaurant en 1 clic avec l'IA
**CTA** : En savoir plus

---

### Variation 2 -- Angle "Simplicite / Gain de temps" (rationalite)

**Texte principal :**
> Fini les tableurs Excel pour calculer vos couts matiere.
>
> RestauMargin fait le travail en 1 clic : fiches techniques automatiques, food cost calcule en temps reel, alertes quand vos marges baissent.
>
> Configuration en 2 minutes. Pas besoin de formation. L'IA s'occupe du reste.
>
> Rejoint par 150+ restaurateurs en France.

**Titre** : Gestion restaurant simplifiee avec l'IA
**Description du lien** : Fiches techniques, food cost, marges -- tout en un seul outil
**CTA** : S'inscrire

---

### Variation 3 -- Angle "Preuve sociale / Resultat" (confiance)

**Texte principal :**
> "En 30 jours, j'ai decouvert que 3 de mes plats les plus vendus etaient en dessous du seuil de rentabilite. RestauMargin m'a fait gagner 12% de marge."
>
> 150+ restaurateurs utilisent deja RestauMargin pour piloter leurs couts matiere et optimiser leurs menus.
>
> L'IA analyse vos achats, calcule votre food cost par plat et vous alerte quand il faut agir.
>
> Essai gratuit 7 jours -- Sans carte bancaire.

**Titre** : +12% de marge en 30 jours
**Description du lien** : Le logiciel IA qui fait gagner de l'argent aux restaurateurs
**CTA** : Commencer l'essai gratuit

---

## 6. Budget et projections

### Budget recommande par phase

| Phase | Periode | Budget/mois | Repartition |
|-------|---------|-------------|-------------|
| Test | M1 | 200 EUR | 70% acquisition + 30% retargeting |
| Optimisation | M2-M3 | 300 EUR | 60% acquisition + 25% retargeting + 15% tests |
| Scale | M4+ | 400 EUR | 50% acquisition + 20% retargeting + 30% lookalike |

### Projections M1 (budget 200 EUR)

| Metrique | Valeur estimee |
|----------|---------------|
| CPM | 8-12 EUR |
| Impressions | 18 000 - 25 000 |
| CTR | 1.2% - 2.0% |
| Clics | 250 - 400 |
| CPC | 0.50 - 0.80 EUR |
| Taux conversion (sign_up) | 2.5% - 4% |
| Conversions (sign_up) | 6 - 16 |
| CPA | 12 - 33 EUR |

### Benchmarks secteur SaaS B2B France

| Metrique | Benchmark | Notre cible |
|----------|-----------|-------------|
| CTR | 0.9% - 1.5% | > 1.5% |
| CPC | 0.60 - 1.20 EUR | < 0.80 EUR |
| Taux conversion LP | 2% - 5% | > 3% |
| CPA | 30 - 80 EUR | < 50 EUR |

---

## 7. Plan A/B Tests

### Phase 1 -- Semaines 1-2 : Test des angles

| Test | Variante A | Variante B | Metrique | Budget |
|------|-----------|-----------|----------|--------|
| Angle copy | "Perte d'argent" (V1) | "Simplicite" (V2) | CPA, CTR | 100 EUR/variante |
| Format creatif | Image statique | Carousel | CPA, CTR | 100 EUR/variante |

**Regle** : Minimum 1 000 impressions par variante avant de conclure.

### Phase 2 -- Semaines 3-4 : Test des creatifs

| Test | Variante A | Variante B | Metrique | Budget |
|------|-----------|-----------|----------|--------|
| Hook video | Question ("Vous connaissez...") | Stat choc ("73% des restos...") | ThruPlay rate, CPA | 75 EUR/variante |
| Image | Dashboard capture | Avant/Apres Excel vs RM | CTR, CPA | 75 EUR/variante |

### Phase 3 -- Semaines 5-6 : Test des audiences

| Test | Variante A | Variante B | Metrique | Budget |
|------|-----------|-----------|----------|--------|
| Audience | Ad Set A (Interets resto) | Ad Set C (Proprios PME + food) | CPA, volume | 100 EUR/variante |
| Age | 25-40 ans | 40-55 ans | CPA, volume | 75 EUR/variante |

### Phase 4 -- Mois 2+ : Optimisation continue

| Test | Variante A | Variante B | Metrique |
|------|-----------|-----------|----------|
| Copy longueur | Court (2-3 lignes) | Long (5+ lignes) | CTR, CPA |
| CTA | "En savoir plus" | "S'inscrire" | Conversion rate |
| Placement | Feed uniquement | Feed + Stories + Reels | CPA, portee |
| Landing page | Page actuelle | Version simplifiee (email seul) | Taux inscription |

### Regles de test

- **Significativite** : 95% de confiance statistique minimum
- **Duree minimum** : 5 jours par test (couvrir les jours de semaine + weekend)
- **Budget minimum** : 50 EUR par variante
- **Un seul test a la fois** par Ad Set
- **Documenter** : Hypothese, resultats, decision, apprentissage
- **Gagnant = +20% CPA** : Si la difference est < 20%, prolonger le test

---

## 8. Meta Pixel et tracking

### Installation du Pixel

Le Meta Pixel (ID: XXXXXXXXXXXXXXXXX) est installe dans `client/index.html` avec le code de base standard.

### Evenements configures

| Evenement | Declencheur | Code |
|-----------|-------------|------|
| PageView | Chaque page (automatique) | `fbq('track', 'PageView')` |
| Lead | Inscription reussie | `fbq('track', 'Lead')` |

L'evenement `Lead` est declenche dans `client/src/pages/Login.tsx` apres une inscription reussie :

```javascript
// Declenche apres register() reussi
if (typeof window !== 'undefined' && (window as any).fbq) {
  (window as any).fbq('track', 'Lead');
}
```

### Configuration dans Meta Events Manager

1. Aller dans Meta Events Manager
2. Verifier que le Pixel recoit des evenements PageView
3. Configurer "Lead" comme evenement de conversion
4. Activer le Conversions API (CAPI) pour une meilleure attribution (optionnel M+2)
5. Configurer l'Aggregated Event Measurement (iOS 14.5+)

---

## 9. Placements recommandes

### Acquisition froide

| Placement | Priorite | Raison |
|-----------|----------|--------|
| Feed Facebook | Haute | Meilleur engagement, audience mature |
| Feed Instagram | Haute | Visuel fort, restaurateurs actifs |
| Stories Instagram | Moyenne | Bon CTR, format vertical |
| Reels Instagram | Moyenne | Portee organique bonus |
| Audience Network | Basse | Desactiver au debut (qualite faible) |
| Messenger | Basse | Desactiver (non pertinent) |

### Retargeting

| Placement | Priorite | Raison |
|-----------|----------|--------|
| Feed Facebook | Haute | Rappel visible |
| Feed Instagram | Haute | Rappel visible |
| Stories Instagram | Haute | Urgence, format immersif |
| Colonne droite Facebook | Moyenne | CPC bas, bonne complementarite |

---

## 10. Planning de lancement

| Jour | Action |
|------|--------|
| J1 | Creer le Meta Business Manager et le Pixel |
| J1 | Installer le Pixel dans index.html (deja fait) |
| J2 | Verifier la reception des evenements PageView dans Events Manager |
| J2 | Creer les audiences personnalisees (visiteurs site, liste emails) |
| J3 | Creer la Campagne 1 (Acquisition) avec Ad Sets A, B, C |
| J3 | Uploader les creatifs (image + carousel) |
| J4 | Rediger les 3 variations de copy |
| J5 | Lancer la campagne a 7 EUR/jour |
| J7 | Premier check : impressions, CPM, CTR |
| J14 | Creer la Campagne 2 (Retargeting) |
| J14 | Premier bilan : pauser les Ad Sets avec CPA > 80 EUR |
| J21 | Lancer les A/B tests Phase 2 (creatifs) |
| J30 | Bilan M1 complet, ajuster budget et audiences |
| J60 | Activer les Lookalike si 100+ conversions Pixel |

---

## 11. KPIs et objectifs

| KPI | Objectif M1 | Objectif M3 | Objectif M6 |
|-----|-------------|-------------|-------------|
| Impressions/mois | 20 000 | 40 000 | 80 000 |
| CTR | > 1.2% | > 1.8% | > 2.0% |
| CPC | < 0.80 EUR | < 0.60 EUR | < 0.50 EUR |
| Conversions (Lead) | 4 | 8 | 15 |
| CPA | < 50 EUR | < 40 EUR | < 30 EUR |
| Frequence (acquisition) | < 3 | < 3 | < 3 |
| ROAS | > 6x | > 8x | > 12x |
