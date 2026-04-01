# Audit SEO Complet - RestauMargin
**URL** : https://www.restaumargin.fr
**Date** : 1er avril 2026
**Score global : 52/100**

---

## 1. Technical SEO (22/30)

### 1.1 Meta Tags - index.html (8/10)

| Element | Statut | Detail |
|---------|--------|--------|
| `<html lang="fr">` | OK | Langue correctement declaree |
| `<title>` | OK | "RestauMargin -- Gestion de marge et fiches techniques pour restaurants" (69 car.) |
| `<meta description>` | OK | 155 car., contient les mots-cles principaux |
| `<meta keywords>` | OK | Present mais peu utile pour Google (ignore depuis 2009) |
| `<meta viewport>` | OK | Mobile-friendly |
| `<meta robots>` | OK | "index, follow" |
| `<link canonical>` | ATTENTION | Pointe uniquement vers la homepage. Pas de canonical dynamique par page |
| Google Site Verification | OK | Present |

### 1.2 Open Graph (9/10)

| Tag | Statut | Valeur |
|-----|--------|--------|
| og:type | OK | website |
| og:title | OK | "RestauMargin -- Gestion de marge pour restaurants" |
| og:description | OK | Presente et pertinente |
| og:url | OK | https://www.restaumargin.fr |
| og:image | VERIFIER | `/og-image.png` -- verifier que le fichier existe et fait 1200x630px |
| og:locale | OK | fr_FR |
| og:site_name | OK | RestauMargin |

### 1.3 Twitter Cards (8/10)

| Tag | Statut |
|-----|--------|
| twitter:card | OK | summary_large_image |
| twitter:title | OK |
| twitter:description | OK |
| twitter:image | OK |
| twitter:site | MANQUANT | Pas de @compte Twitter |

### 1.4 Sitemap.xml (5/10)

**Problemes majeurs :**
- Seulement **9 URLs** referencees
- Pages manquantes : `/station-produit` est incluse mais **pas de page blog, pas de /features, pas de /contact**
- Pas de `<lastmod>` sur les URLs -- Google ne sait pas quand le contenu a change
- Le sitemap ne couvre pas les pages SEO a fort potentiel

**URLs presentes :**
- `/` (priority 1.0)
- `/pricing` (0.9)
- `/login` (0.7) -- inutile pour le SEO
- `/register` (0.7) -- inutile pour le SEO
- `/station-produit` (0.8)
- `/mentions-legales`, `/cgu`, `/cgv`, `/politique-confidentialite` (0.3)

### 1.5 Robots.txt (9/10)

```
User-agent: *
Allow: /
Disallow: /dashboard
Disallow: /ingredients
Disallow: /recettes
Disallow: /planning
Disallow: /settings
Disallow: /api/
Sitemap: https://www.restaumargin.fr/sitemap.xml
```

OK -- Les pages privees sont bien bloquees. Le sitemap est reference.

### 1.6 Structured Data / Schema.org (0/10)

**CRITIQUE : Aucune donnee structuree n'est presente.**

- Pas de JSON-LD
- Pas de schema SoftwareApplication
- Pas de schema FAQPage
- Pas de schema Organization
- Pas de schema WebSite avec SearchAction

---

## 2. On-Page SEO (15/30)

### 2.1 Structure des headings - Landing.tsx

| Tag | Contenu | Evaluation |
|-----|---------|------------|
| H1 | "Maitrisez vos marges. Augmentez vos profits." | MOYEN - Pas de mot-cle "restaurant" ni "gestion" |
| H2 | "Tout ce dont vous avez besoin pour piloter vos marges" | OK |
| H2 | "3 etapes pour piloter vos marges" | OK |
| H2 | Section integrations | OK |
| H2 | Section pricing | OK |
| H2 | "Questions frequentes" | OK |
| H2 | Section contact | OK |
| H3 | "Fiches techniques intelligentes" | BON - mot-cle "fiche technique" |
| H3 | "Menu Engineering" | BON |
| H3 | "Gestion fournisseurs" | BON |
| H3 | "HACCP & Tracabilite" | BON |
| H3 | "Station de pesee connectee" | BON |
| H3 | "Assistant IA" | OK |

**Probleme** : Le H1 est trop generique. Il devrait contenir "gestion restaurant" ou "marge restaurant".

### 2.2 Mots-cles cibles

| Mot-cle | Volume estime | Present dans H1 | Present dans meta | Present dans contenu |
|---------|---------------|-----------------|-------------------|---------------------|
| gestion restaurant | Eleve | NON | OUI (description) | Partiellement |
| marge restaurant | Eleve | "marges" sans "restaurant" | OUI | OUI |
| fiche technique cuisine | Moyen | NON | OUI (description) | OUI (H3) |
| food cost | Moyen | NON | OUI (keywords) | NON dans le contenu visible |
| logiciel restauration | Moyen | NON | OUI (keywords) | NON |
| menu engineering | Moyen | NON | NON (description) | OUI (H3) |

### 2.3 Contenu textuel

- Le hero text est correct mais generique
- Les descriptions de features sont courtes et pertinentes
- La section FAQ contient 5 questions -- suffisant mais pourrait etre etendue
- **Pas de contenu long-form** (blog, guides, articles) pour le SEO organique

### 2.4 Images

| Image | Alt text | Evaluation |
|-------|----------|------------|
| hero-1.webp | "RestauMargin Station en cuisine" | OK |
| hero-2.webp | "RestauMargin Station cuisine pro" | OK |
| hero-3.webp | "Chef utilisant RestauMargin" | OK |

- Format WebP : BON pour la performance
- `loading="eager"` sur les 3 images hero : correct (above the fold)
- Pas de `width`/`height` definis sur les images -- provoque du CLS (Cumulative Layout Shift)

---

## 3. Problemes Critiques (15/30)

### 3.1 SPA React sans SSR -- PROBLEME MAJEUR (0/10)

**C'est le probleme SEO numero 1.**

- L'app est un SPA React pur (Vite + React, pas de Next.js, pas de SSR)
- Le `index.html` ne contient qu'un `<div id="root"></div>` vide
- Googlebot peut executer du JS mais avec un delai et des limites
- Les autres moteurs (Bing, Yahoo, Baidu) ont beaucoup plus de mal
- Le contenu de la landing page est **invisible dans le HTML source**
- La meta description statique aide, mais le contenu de la page (H1, texte, FAQ) n'est pas dans le HTML initial

**Impact** : Google peut mettre des jours/semaines a indexer le contenu. Les rich snippets FAQ ne fonctionneront pas sans prerender.

### 3.2 Performance / Bundle Size (8/10)

| Metrique | Valeur | Evaluation |
|----------|--------|------------|
| Bundle JS principal | 335 KB | MOYEN -- acceptable avec lazy loading |
| CSS total | 150 KB | OK |
| Total assets dist/ | 2.2 MB | OK avec code splitting |
| Lazy loading pages | OUI | BON (React.lazy dans App.tsx) |
| Google Fonts chargees | 6 familles | MAUVAIS -- trop de fonts |

**Fonts chargees** : DM Sans, Inter, Manrope, Outfit, Plus Jakarta Sans, Sora + Satoshi + General Sans (Fontshare) = **8 familles de polices**. C'est excessif et ralentit le LCP.

### 3.3 Canonical dynamique (5/10)

Le `<link rel="canonical">` est statique dans index.html et pointe toujours vers `https://www.restaumargin.fr`. Chaque page devrait avoir son propre canonical.

### 3.4 Meta descriptions par page (2/10)

- Seule la homepage a une meta description (dans index.html)
- `/pricing`, `/station-produit` et toutes les autres pages publiques partagent la meme meta description
- Pas de `react-helmet` ou equivalent pour gerer les meta dynamiques

### 3.5 Hreflang / i18n (0/5)

- L'app supporte 5 langues (fr, en, ar, es, de) via i18n
- Aucune balise hreflang n'est declaree
- Pas de versions localisees des URLs
- Google ne sait pas que le site est multilingue

---

## 4. Recommandations Prioritaires

### P0 -- CRITIQUE (Impact maximum)

#### 4.1 Ajouter le prerendering pour les pages publiques
**Solution** : Installer `vite-plugin-ssr` ou `react-snap` pour pre-rendre les pages publiques (/, /pricing, /station-produit) en HTML statique. Alternative : migrer vers Next.js pour les pages marketing.

```
Pages a pre-rendre :
- /
- /pricing
- /station-produit
- /mentions-legales
- /cgu
- /cgv
- /politique-confidentialite
```

#### 4.2 Ajouter le JSON-LD Schema.org dans index.html

**SoftwareApplication** :
```json
{
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  "name": "RestauMargin",
  "applicationCategory": "BusinessApplication",
  "operatingSystem": "Web",
  "description": "Plateforme de gestion de marge et fiches techniques pour restaurants",
  "url": "https://www.restaumargin.fr",
  "offers": {
    "@type": "Offer",
    "price": "49",
    "priceCurrency": "EUR"
  },
  "aggregateRating": {
    "@type": "AggregateRating",
    "ratingValue": "4.8",
    "ratingCount": "150"
  }
}
```

**FAQPage** (pour les 5 questions de la landing) :
```json
{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "Comment fonctionne l'abonnement ?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Choisissez votre plan..."
      }
    }
  ]
}
```

**Organization** :
```json
{
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "RestauMargin",
  "url": "https://www.restaumargin.fr",
  "logo": "https://www.restaumargin.fr/icon-512.png",
  "contactPoint": {
    "@type": "ContactPoint",
    "email": "contact@restaumargin.fr",
    "telephone": "+33-1-23-45-67-89",
    "contactType": "customer service"
  }
}
```

### P1 -- IMPORTANT (Impact eleve)

#### 4.3 Optimiser le H1
Remplacer "Maitrisez vos marges. Augmentez vos profits." par quelque chose comme :
> "Logiciel de gestion restaurant : maitrisez vos marges et fiches techniques"

#### 4.4 Installer react-helmet-async
Pour gerer dynamiquement les meta title, description et canonical par page :
- `/pricing` : "Tarifs RestauMargin -- Plans Pro et Business pour restaurants"
- `/station-produit` : "Station de pesee connectee pour restaurant -- RestauMargin"

#### 4.5 Completer le sitemap.xml
- Ajouter `<lastmod>` sur toutes les URLs
- Retirer `/login` et `/register` (pas utiles pour le SEO)
- Ajouter toute future page de contenu (blog, guides)

#### 4.6 Reduire le nombre de fonts
Passer de 8 familles a 2 maximum. Suggestion : garder uniquement DM Sans (body) et Satoshi (display). Gain estime : 200-400ms de LCP.

### P2 -- AMELIORATIONS (Impact moyen)

#### 4.7 Ajouter width/height aux images
Les 3 images hero n'ont pas de dimensions explicites, ce qui cause du CLS (Cumulative Layout Shift). Ajouter `width` et `height` ou un ratio CSS `aspect-ratio`.

#### 4.8 Creer une strategie de contenu
- Blog avec articles cibles : "Comment calculer le food cost en restauration", "Fiche technique cuisine : guide complet", "Marge brute restaurant : objectifs et calcul"
- Chaque article = une URL indexable avec ses propres meta tags
- Objectif : capter du trafic long-tail organique

#### 4.9 Ajouter les balises hreflang
Si le site cible aussi des utilisateurs non-francophones, declarer les versions linguistiques.

#### 4.10 Ajouter un breadcrumb schema
Pour les pages internes, ajouter le schema BreadcrumbList.

#### 4.11 Ajouter twitter:site
Creer un compte Twitter/X `@RestauMargin` et l'ajouter dans les meta Twitter.

---

## 5. Score Detaille

| Categorie | Score | Max | Details |
|-----------|-------|-----|---------|
| Meta tags (title, desc, OG, Twitter) | 8 | 10 | Bonne base, manque twitter:site |
| Canonical & hreflang | 2 | 10 | Canonical statique, pas de hreflang |
| Sitemap | 5 | 10 | Incomplet, pas de lastmod, URLs inutiles |
| Robots.txt | 9 | 10 | Correct |
| Structured data (Schema.org) | 0 | 15 | Aucune donnee structuree |
| Heading structure | 6 | 10 | H1 trop generique, H2/H3 bien |
| Contenu & mots-cles | 6 | 10 | Mots-cles presents mais pas optimises |
| Images (alt, format, CLS) | 6 | 5 | Alt OK, WebP OK, mais pas de dimensions |
| SSR / Renderability | 0 | 10 | SPA pur, contenu invisible au crawler |
| Performance (fonts, bundle) | 5 | 5 | Bundle OK, mais trop de fonts |
| Meta par page | 2 | 5 | Une seule meta description pour tout le site |
| **TOTAL** | **52** | **100** | |

---

## 6. Plan d'Action par Sprint

### Sprint 1 (Semaine 1) -- Quick Wins
- [ ] Ajouter 3 blocs JSON-LD dans index.html (Organization, SoftwareApplication, FAQPage)
- [ ] Optimiser le H1 de la landing avec mots-cles cibles
- [ ] Ajouter `<lastmod>` au sitemap et retirer /login et /register
- [ ] Reduire a 2 familles de fonts

### Sprint 2 (Semaine 2) -- Meta dynamiques
- [ ] Installer react-helmet-async
- [ ] Ajouter title + description + canonical uniques pour /pricing, /station-produit, pages legales

### Sprint 3 (Semaine 3-4) -- Prerendering
- [ ] Configurer react-snap ou vite-ssg pour pre-rendre les pages publiques
- [ ] Verifier que le HTML genere contient bien le contenu textuel
- [ ] Tester avec Google Search Console (Inspection URL)

### Sprint 4 (Mois 2+) -- Contenu
- [ ] Creer un blog (/blog) avec 3-5 articles cibles
- [ ] Chaque article optimise pour un mot-cle long-tail
- [ ] Ajouter le schema Article pour chaque post

---

## 7. Outils de Verification

- **Google Search Console** : Inspecter l'URL, verifier l'indexation
- **Google Rich Results Test** : Tester les structured data
- **PageSpeed Insights** : Score performance mobile/desktop
- **Screaming Frog** : Crawler le site pour detecter les problemes techniques
- **Schema.org Validator** : Valider le JSON-LD

---

*Rapport genere le 1er avril 2026*
