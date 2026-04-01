# RestauMargin -- Architecture du Site restaumargin.fr

> Document de reference pour la structure, les URLs, le maillage interne et le SEO programmatique.
> Date : 2026-04-01

---

## 1. Sitemap Visuel (ASCII)

### Pages publiques existantes

```
restaumargin.fr (/)
├── Landing (/landing)
├── Pricing (/pricing)
├── Login (/login)
├── Reset Password (/reset-password)
├── Menu Public (/menu-public)
├── Station Produit (/station-produit)
├── Dev Corp (/dev-corp)
├── Mentions Legales (/mentions-legales)
├── CGV (/cgv)
├── CGU (/cgu)
├── Politique de Confidentialite (/politique-confidentialite)
└── 404 (/*)
```

### Pages privees (app, derriere authentification)

```
App Dashboard (/)
├── Ingredients (/ingredients)
├── Recettes (/recipes)
│   └── Detail recette (/recipes/:id)
├── Menu Builder (/menu)
├── Menu Engineering (/menu-engineering)
├── QR Menu (/qr-menu)
├── Fournisseurs (/suppliers)
│   └── Promo fournisseur (/fournisseur/:id)
├── Inventaire (/inventory)
├── Gaspillage (/gaspillage)
├── RFQs (/rfqs)
├── Scanner Factures (/scanner-factures)
├── Actualites (/actualites)
├── Mercuriale (/mercuriale)
├── Commandes auto (/commandes)
├── Planning (/planning)
├── Seminaires (/seminaires)
├── HACCP (/haccp)
├── Assistant IA (/assistant)
├── Messagerie (/messagerie)
├── Clients (/clients)
├── Marketplace (/marketplace)
├── Integrations (/integrations)
├── Comptabilite (/comptabilite)
├── Devis (/devis)
├── Restaurants (/restaurants)
├── Pricing (/pricing)
├── Abonnement (/abonnement)
├── Settings (/settings)
├── Gestion utilisateurs (/users)
└── Station balance (/station)
```

### Pages a CREER (publiques, SEO)

```
restaumargin.fr (/)                              ← homepage / landing unifiee
│
├── /fonctionnalites                              ← hub features (nouveau)
│   ├── /fonctionnalites/food-cost                ← page feature dediee
│   ├── /fonctionnalites/menu-engineering         ← page feature dediee
│   ├── /fonctionnalites/gestion-stocks           ← page feature dediee
│   ├── /fonctionnalites/haccp                    ← page feature dediee
│   ├── /fonctionnalites/scanner-factures         ← page feature dediee
│   └── /fonctionnalites/qr-menu                  ← page feature dediee
│
├── /outils                                       ← hub outils gratuits (pSEO)
│   ├── /outils/calculateur-food-cost             ← outil gratuit
│   └── /outils/generateur-qr-menu               ← outil gratuit
│
├── /comparatif                                   ← hub comparaisons (pSEO)
│   ├── /comparatif/restaumargin-vs-inpulse       ← page comparaison
│   ├── /comparatif/restaumargin-vs-koust         ← page comparaison
│   ├── /comparatif/restaumargin-vs-yokitup       ← page comparaison
│   └── /comparatif/restaumargin-vs-easilys       ← page comparaison
│
├── /blog                                         ← hub articles SEO
│   ├── /blog/calcul-marge-restaurant             ← article SEO
│   ├── /blog/food-cost-ratio-ideal               ← article SEO
│   ├── /blog/reduire-gaspillage-alimentaire      ← article SEO
│   ├── /blog/normes-haccp-restaurant             ← article SEO
│   ├── /blog/menu-engineering-guide              ← article SEO
│   ├── /blog/gestion-stocks-restaurant           ← article SEO
│   └── /blog/...                                 ← (extensible)
│
├── /glossaire                                    ← glossaire termes restauration (pSEO)
│   ├── /glossaire/food-cost                      ← definition
│   ├── /glossaire/marge-brute                    ← definition
│   ├── /glossaire/ticket-moyen                   ← definition
│   └── /glossaire/...                            ← (extensible)
│
├── /pricing                                      ← existante
├── /login                                        ← existante
├── /mentions-legales                             ← existante
├── /cgv                                          ← existante
├── /cgu                                          ← existante
└── /politique-confidentialite                    ← existante
```

---

## 2. Structure d'URL recommandee

### Principes

| Regle                  | Convention RestauMargin                |
|------------------------|----------------------------------------|
| Separateur             | Tirets `-` (jamais `_`)                |
| Casse                  | Tout en minuscules                     |
| Trailing slash         | Sans (pas de `/` final)                |
| Langue                 | Francais (slug en francais sans accents)|
| Profondeur max         | 3 niveaux (`/section/sous-section/slug`)|

### Patterns par type de page

| Type de page       | Pattern URL                              | Exemple                                  |
|--------------------|------------------------------------------|------------------------------------------|
| Homepage           | `/`                                      | `restaumargin.fr`                        |
| Page feature       | `/fonctionnalites/{slug}`                | `/fonctionnalites/food-cost`             |
| Article blog       | `/blog/{slug}`                           | `/blog/calcul-marge-restaurant`          |
| Outil gratuit      | `/outils/{slug}`                         | `/outils/calculateur-food-cost`          |
| Page comparaison   | `/comparatif/restaumargin-vs-{concurrent}` | `/comparatif/restaumargin-vs-inpulse`  |
| Glossaire          | `/glossaire/{terme}`                     | `/glossaire/food-cost`                   |
| Legal              | `/{slug}`                                | `/mentions-legales`                      |
| Pricing            | `/pricing`                               | `/pricing`                               |

### Blog : regle de nommage

- Format : `/blog/{mot-cle-principal}`
- PAS de date dans l'URL (ni `/blog/2026/04/...`)
- PAS de categorie dans l'URL (ni `/blog/category/seo/...`)
- Slug court et descriptif : 3 a 5 mots max
- Exemples :
  - `/blog/calcul-marge-restaurant`
  - `/blog/food-cost-ratio-ideal`
  - `/blog/reduire-gaspillage-alimentaire`
  - `/blog/normes-haccp-restaurant`
  - `/blog/menu-engineering-guide`

---

## 3. Strategie de Maillage Interne (Internal Linking)

### 3.1 Modele Hub-and-Spoke

```
                    ┌──────────────┐
                    │  HOMEPAGE    │
                    │  restaumargin.fr
                    └──────┬───────┘
           ┌───────────────┼───────────────┐
           v               v               v
   ┌───────────┐   ┌───────────┐   ┌───────────┐
   │/fonctionnalites│  │  /blog     │   │  /outils   │
   │  (Hub Features)│  │ (Hub Blog) │   │(Hub Outils)│
   └───┬───┬───┘   └───┬───┬───┘   └───┬───────┘
       │   │           │   │           │
       v   v           v   v           v
   Spokes:         Spokes:         Spokes:
   food-cost       calcul-marge    calculateur-food-cost
   menu-eng.       food-cost-ratio generateur-qr-menu
   stocks          gaspillage
   haccp           haccp-normes
   scanner         menu-eng-guide
   qr-menu         stocks-guide
```

### 3.2 Regles de liens par type de page

| Page source                     | Liens sortants recommandes                                         |
|---------------------------------|--------------------------------------------------------------------|
| **Homepage**                    | → /fonctionnalites, /pricing, /blog (3 derniers articles), /outils |
| **Page feature** (/fonctionnalites/X) | → article blog associe, outil gratuit associe, /pricing, autres features |
| **Article blog** (/blog/X)     | → feature associee, outil associe, 2-3 articles lies, /pricing (CTA) |
| **Outil gratuit** (/outils/X)  | → feature principale, article associe, /pricing (CTA upsell)      |
| **Page comparaison** (/comparatif/X) | → /pricing, features mentionnees, article blog lie            |
| **Glossaire** (/glossaire/X)   | → article blog qui developpe, feature associee, autres termes lies |
| **Pricing**                     | → features principales, /login (CTA)                              |

### 3.3 Liens contextuels specifiques

| Depuis                              | Vers                                 | Ancre textuelle recommandee                     |
|--------------------------------------|--------------------------------------|--------------------------------------------------|
| /blog/calcul-marge-restaurant        | /outils/calculateur-food-cost        | "calculer votre food cost gratuitement"          |
| /blog/calcul-marge-restaurant        | /fonctionnalites/food-cost           | "automatiser le suivi de vos marges"             |
| /outils/calculateur-food-cost        | /blog/calcul-marge-restaurant        | "guide complet du calcul de marge"               |
| /outils/calculateur-food-cost        | /pricing                             | "passer a la version complete"                   |
| /fonctionnalites/food-cost           | /blog/food-cost-ratio-ideal          | "quel ratio food cost viser"                     |
| /comparatif/restaumargin-vs-inpulse  | /pricing                             | "voir nos tarifs"                                |
| /comparatif/restaumargin-vs-inpulse  | /fonctionnalites/food-cost           | "decouvrir notre calcul automatique"             |
| /glossaire/food-cost                 | /blog/calcul-marge-restaurant        | "en savoir plus sur le calcul de marge"          |
| /blog/normes-haccp-restaurant        | /fonctionnalites/haccp               | "gerer votre conformite HACCP"                   |
| /blog/menu-engineering-guide         | /fonctionnalites/menu-engineering    | "analyser la rentabilite de votre carte"         |

### 3.4 Composants de maillage

- **Breadcrumbs** sur toutes les pages : `Accueil > Blog > Calcul Marge Restaurant`
- **Section "Articles lies"** en bas de chaque article blog (3 articles)
- **Section "Outils gratuits"** en sidebar ou bas de chaque article
- **CTA pricing** dans chaque page publique (footer sticky ou section dediee)
- **Footer** : liens vers toutes les sections principales + legal

---

## 4. SEO Programmatique (pSEO)

### 4.1 Pages Outils Gratuits

#### /outils/calculateur-food-cost

| Element           | Valeur                                                           |
|-------------------|------------------------------------------------------------------|
| **Title tag**     | Calculateur Food Cost Gratuit -- RestauMargin                    |
| **Meta desc**     | Calculez votre food cost en quelques clics. Outil gratuit pour restaurateurs. Entrez vos ingredients et obtenez votre ratio instantanement. |
| **H1**            | Calculateur de Food Cost Gratuit                                 |
| **Intention**     | Transactionnelle (outil) + informationnelle                      |
| **Schema**        | WebApplication + FAQPage                                         |
| **Contenu unique**| Calculateur interactif + explication de la formule + benchmarks secteur + CTA vers RestauMargin |
| **CTA**           | "Automatisez le suivi de vos marges -- Essai gratuit"            |

#### /outils/generateur-qr-menu

| Element           | Valeur                                                           |
|-------------------|------------------------------------------------------------------|
| **Title tag**     | Generateur QR Code Menu Restaurant Gratuit -- RestauMargin       |
| **Meta desc**     | Creez un QR code pour votre carte de restaurant en 30 secondes. Gratuit, sans inscription. Personnalisez couleurs et logo. |
| **H1**            | Generateur de QR Code Menu Gratuit                               |
| **Intention**     | Transactionnelle (outil)                                         |
| **Schema**        | WebApplication + FAQPage                                         |
| **Contenu unique**| Generateur interactif + guide d'utilisation + avantages du QR menu + CTA |
| **CTA**           | "Gerez votre menu digital complet -- Essai gratuit"              |

### 4.2 Pages Comparaison

#### Template : /comparatif/restaumargin-vs-{concurrent}

| Element           | Valeur                                                           |
|-------------------|------------------------------------------------------------------|
| **Title tag**     | RestauMargin vs {Concurrent} : Comparatif {Annee}                |
| **Meta desc**     | Comparaison detaillee RestauMargin vs {Concurrent}. Fonctionnalites, prix, avis. Decouvrez quelle solution convient a votre restaurant. |
| **H1**            | RestauMargin vs {Concurrent} : Quel logiciel choisir ?           |
| **Schema**        | FAQPage + Product (pour chaque outil)                            |
| **Sections**      | Tableau comparatif / Prix / Avis clients / Fonctionnalites cles / Verdict / FAQ |

**Pages a creer en priorite :**

| URL                                     | Concurrent | Volume estime |
|-----------------------------------------|------------|---------------|
| /comparatif/restaumargin-vs-inpulse     | Inpulse    | Moyen         |
| /comparatif/restaumargin-vs-koust       | Koust      | Moyen         |
| /comparatif/restaumargin-vs-yokitup     | Yokitup    | Faible-Moyen  |
| /comparatif/restaumargin-vs-easilys     | Easilys    | Faible        |

### 4.3 Articles Blog (Hub SEO)

#### Pattern : /blog/{keyword}

| Element           | Valeur                                                           |
|-------------------|------------------------------------------------------------------|
| **Title tag**     | {Titre Article} -- RestauMargin                                  |
| **Meta desc**     | 150-160 car, incluant le mot-cle principal + proposition de valeur |
| **H1**            | {Titre Article}                                                  |
| **Schema**        | Article + FAQPage + BreadcrumbList                               |
| **Contenu**       | 1500-2500 mots, structure H2/H3, images, donnees chiffrees      |

**Cluster de contenu prioritaire :**

| Cluster (Hub)                | Articles (Spokes)                                                |
|------------------------------|------------------------------------------------------------------|
| Marge & Food Cost            | calcul-marge-restaurant, food-cost-ratio-ideal, prix-de-revient-recette |
| Gestion operationnelle       | reduire-gaspillage-alimentaire, gestion-stocks-restaurant, inventaire-restaurant |
| Conformite                   | normes-haccp-restaurant, tracabilite-alimentaire, hygiene-cuisine |
| Carte & Menu                 | menu-engineering-guide, creer-menu-restaurant, prix-carte-restaurant |

### 4.4 Glossaire (pSEO a echelle)

#### Pattern : /glossaire/{terme}

| Element           | Valeur                                                           |
|-------------------|------------------------------------------------------------------|
| **Title tag**     | {Terme} : Definition -- Glossaire Restauration                   |
| **Meta desc**     | Qu'est-ce que le/la {terme} ? Definition, formule et exemples pour les restaurateurs. |
| **H1**            | {Terme} : Definition et Calcul                                   |
| **Schema**        | DefinedTerm + FAQPage + BreadcrumbList                           |
| **Contenu unique**| Definition + formule + exemple chiffre + lien vers feature + lien vers article |

**Potentiel** : 30 a 50 pages termes (food cost, marge brute, ticket moyen, coefficient multiplicateur, ratio matiere, point mort, seuil de rentabilite, etc.)

---

## 5. Navigation Recommandee pour la Landing

### 5.1 Header Navigation (6 items + CTA)

```
┌─────────────────────────────────────────────────────────────────────┐
│ [Logo]   Fonctionnalites v   Outils   Blog   Pricing   Connexion  │ [Essai Gratuit] │
└─────────────────────────────────────────────────────────────────────┘
```

**Detail du dropdown "Fonctionnalites" :**

```
┌─────────────────────────────────────┐
│ Calcul Food Cost                    │
│ Menu Engineering                    │
│ Gestion des Stocks                  │
│ Conformite HACCP                    │
│ Scanner de Factures                 │
│ QR Code Menu                        │
│ ────────────────────                │
│ Toutes les fonctionnalites →        │
└─────────────────────────────────────┘
```

**Ordre de priorite (gauche a droite) :**
1. Fonctionnalites (dropdown) -- attire les prospects
2. Outils -- acquisition SEO, entree gratuite
3. Blog -- acquisition SEO, confiance
4. Pricing -- conversion
5. Connexion -- utilisateurs existants
6. **[Essai Gratuit]** -- CTA principal (bouton plein, couleur accent)

### 5.2 Footer (4 colonnes)

```
┌──────────────────────────────────────────────────────────────────────┐
│                                                                      │
│  Produit              Ressources           Comparatifs    Legal      │
│  ────────             ──────────           ───────────    ─────      │
│  Fonctionnalites      Blog                 vs Inpulse    Mentions   │
│  Pricing              Glossaire            vs Koust      CGV        │
│  Integrations         Outils gratuits      vs Yokitup    CGU        │
│  Station Balance      Guide demarrage      vs Easilys    Conf.      │
│                                                                      │
│  ──────────────────────────────────────────────────────────────────  │
│  [Logo] RestauMargin (c) 2026 -- Logiciel de gestion pour restaurants │
└──────────────────────────────────────────────────────────────────────┘
```

### 5.3 Breadcrumbs

Implementation sur toutes les pages publiques (hors homepage) :

| Page                                  | Breadcrumb                                              |
|---------------------------------------|--------------------------------------------------------|
| /fonctionnalites/food-cost            | Accueil > Fonctionnalites > Calcul Food Cost           |
| /blog/calcul-marge-restaurant         | Accueil > Blog > Calcul Marge Restaurant               |
| /outils/calculateur-food-cost         | Accueil > Outils > Calculateur Food Cost               |
| /comparatif/restaumargin-vs-inpulse   | Accueil > Comparatif > RestauMargin vs Inpulse         |
| /glossaire/food-cost                  | Accueil > Glossaire > Food Cost                        |
| /pricing                              | Accueil > Tarifs                                       |

Schema markup `BreadcrumbList` sur chaque page.

---

## 6. URL Map Complete

| Page                               | URL                                      | Parent            | Nav         | Priorite |
|------------------------------------|------------------------------------------|--------------------|-------------|----------|
| Homepage                           | `/`                                      | --                 | Header      | Haute    |
| Fonctionnalites (hub)              | `/fonctionnalites`                       | Homepage           | Header      | Haute    |
| Food Cost                          | `/fonctionnalites/food-cost`             | Fonctionnalites    | Dropdown    | Haute    |
| Menu Engineering                   | `/fonctionnalites/menu-engineering`      | Fonctionnalites    | Dropdown    | Haute    |
| Gestion Stocks                     | `/fonctionnalites/gestion-stocks`        | Fonctionnalites    | Dropdown    | Moyenne  |
| HACCP                              | `/fonctionnalites/haccp`                 | Fonctionnalites    | Dropdown    | Moyenne  |
| Scanner Factures                   | `/fonctionnalites/scanner-factures`      | Fonctionnalites    | Dropdown    | Moyenne  |
| QR Menu                            | `/fonctionnalites/qr-menu`              | Fonctionnalites    | Dropdown    | Moyenne  |
| Outils (hub)                       | `/outils`                                | Homepage           | Header      | Haute    |
| Calculateur Food Cost              | `/outils/calculateur-food-cost`          | Outils             | --          | Haute    |
| Generateur QR Menu                 | `/outils/generateur-qr-menu`            | Outils             | --          | Haute    |
| Blog (hub)                         | `/blog`                                  | Homepage           | Header      | Haute    |
| Article blog                       | `/blog/{slug}`                           | Blog               | --          | Moyenne  |
| Comparatif (hub)                   | `/comparatif`                            | Homepage           | Footer      | Moyenne  |
| Page comparaison                   | `/comparatif/restaumargin-vs-{slug}`     | Comparatif         | Footer      | Moyenne  |
| Glossaire (hub)                    | `/glossaire`                             | Homepage           | Footer      | Faible   |
| Terme glossaire                    | `/glossaire/{slug}`                      | Glossaire          | --          | Faible   |
| Pricing                            | `/pricing`                               | Homepage           | Header      | Haute    |
| Login                              | `/login`                                 | Homepage           | Header      | Haute    |
| Station Produit                    | `/station-produit`                       | Homepage           | Footer      | Faible   |
| Dev Corp                           | `/dev-corp`                              | Homepage           | Footer      | Faible   |
| Mentions Legales                   | `/mentions-legales`                      | Homepage           | Footer      | Faible   |
| CGV                                | `/cgv`                                   | Homepage           | Footer      | Faible   |
| CGU                                | `/cgu`                                   | Homepage           | Footer      | Faible   |
| Politique Confidentialite          | `/politique-confidentialite`             | Homepage           | Footer      | Faible   |

---

## 7. Checklist d'Implementation

- [ ] Creer la page hub `/fonctionnalites` + 6 sous-pages features
- [ ] Creer la page hub `/outils` + calculateur food cost + generateur QR
- [ ] Creer la page hub `/blog` + 4 premiers articles du cluster "Marge & Food Cost"
- [ ] Creer la page hub `/comparatif` + page vs Inpulse (prioritaire)
- [ ] Creer la page hub `/glossaire` + 10 premiers termes
- [ ] Mettre a jour le header nav (6 items + CTA)
- [ ] Mettre a jour le footer (4 colonnes)
- [ ] Implementer les breadcrumbs avec schema `BreadcrumbList`
- [ ] Ajouter schema `WebApplication` sur les pages outils
- [ ] Ajouter schema `FAQPage` sur les pages comparatif et outils
- [ ] Configurer les meta tags (title + description) sur chaque page
- [ ] Generer le sitemap XML (`/sitemap.xml`) incluant toutes les pages publiques
- [ ] Verifier qu'aucune page publique n'est orpheline (au moins 1 lien entrant)
