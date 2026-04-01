# RestauMargin -- Architecture Systeme

> Document de reference -- Derniere mise a jour : 2026-04-01

---

## Table des matieres

1. [Architecture Overview](#1-architecture-overview)
2. [Stack technique](#2-stack-technique)
3. [Flux d'authentification (JWT)](#3-flux-dauthentification-jwt)
4. [Flux IA](#4-flux-ia)
5. [Flux Mercuriale](#5-flux-mercuriale)
6. [Base de donnees](#6-base-de-donnees)
7. [Deployment](#7-deployment)
8. [Securite](#8-securite)
9. [ADR (Architecture Decision Records)](#9-adr-architecture-decision-records)

---

## 1. Architecture Overview

```
                          +-------------------+
                          |   Navigateur /    |
                          |   Tablette        |
                          |   (React SPA)     |
                          +--------+----------+
                                   |
                            HTTPS  |  JWT Bearer Token
                                   |  X-Restaurant-Id Header
                                   v
                    +------------------------------+
                    |        Vercel Edge CDN        |
                    |   (Static Assets + Rewrites)  |
                    +-----+------------------+-----+
                          |                  |
                  /assets/*            /api/*
                  (cache 1y)           (rewrite)
                          |                  |
                          v                  v
                 +----------------+  +-------------------+
                 |  client/dist   |  |  api/index.ts     |
                 |  (Vite build)  |  |  (Serverless Fn)  |
                 |  React 18 SPA |  |  Express ~3800 L   |
                 +----------------+  +--------+----------+
                                              |
                        +---------------------+---------------------+
                        |                     |                     |
                        v                     v                     v
               +----------------+    +-----------------+   +-----------------+
               |   Supabase     |    |   Anthropic     |   |   Resend        |
               |   PostgreSQL   |    |   Claude API    |   |   Email API     |
               |   (Prisma ORM) |    |   (Haiku/Sonnet)|   |   (Transac.)    |
               +----------------+    +-----------------+   +-----------------+
```

**Principes cles :**
- Monolithe API : un seul fichier `api/index.ts` (3786 lignes) sert toutes les routes
- SPA React avec code splitting (lazy loading sur ~35 pages)
- Multi-tenant : un utilisateur possede/partage plusieurs restaurants via `RestaurantMember`
- Serverless : chaque requete API s'execute comme une Vercel Serverless Function

---

## 2. Stack technique

### Frontend (client/)

| Technologie       | Version  | Role                                |
|-------------------|----------|-------------------------------------|
| React             | 18.3     | Framework UI                        |
| Vite              | 6.0      | Bundler + dev server                |
| TypeScript        | 5.7      | Typage statique                     |
| React Router      | 6.28     | Routing SPA                         |
| Tailwind CSS      | 3.4      | Styles utilitaires, dark theme      |
| Recharts          | 3.8      | Graphiques (dashboard, marges)      |
| Lucide React      | 0.460    | Icones                              |
| vite-plugin-pwa   | 0.21     | Progressive Web App (tablette)      |

**Pas de librairie UI externe** (pas de shadcn, MUI, Chakra).

### Backend (api/ + server/)

| Technologie        | Version  | Role                               |
|--------------------|----------|-------------------------------------|
| Node.js + Express  | 4.21     | Serveur HTTP                        |
| TypeScript         | 5.7      | Typage statique                     |
| Prisma             | 5.22     | ORM (migrations + queries)          |
| jsonwebtoken       | 9.0      | Auth JWT                            |
| bcryptjs           | 3.0      | Hachage mots de passe               |
| helmet             | 8.1      | Headers de securite                 |
| express-rate-limit | 8.3      | Protection anti-abus                |
| zod                | 4.3      | Validation de schemas               |

### Services externes

| Service        | Role                                        |
|----------------|---------------------------------------------|
| Supabase       | PostgreSQL manage (BDD principale)          |
| Anthropic API  | IA (chat, OCR factures, analyses, previsions) |
| Resend         | Emails transactionnels (activation, reset)  |
| Stripe         | Paiements (webhook pour codes activation)   |
| Vercel         | Hosting (SPA + Serverless Functions)        |
| OVH            | DNS pour restaumargin.fr                    |

---

## 3. Flux d'authentification (JWT)

```
  Utilisateur                  Frontend (React)              API (Express)              Supabase (PG)
      |                              |                            |                          |
      |--- email + password -------->|                            |                          |
      |                              |--- POST /api/auth/login -->|                          |
      |                              |                            |--- SELECT user WHERE     |
      |                              |                            |    email = ? ----------->|
      |                              |                            |<-- user row --------------|
      |                              |                            |                          |
      |                              |                            |--- bcrypt.compare()      |
      |                              |                            |--- jwt.sign({userId,     |
      |                              |                            |    email, role}, SECRET,  |
      |                              |                            |    {expiresIn: '7d'})     |
      |                              |                            |                          |
      |                              |<-- { token, user } --------|                          |
      |                              |                            |                          |
      |                              |--- localStorage.set(token) |                          |
      |<-- Dashboard ----------------|                            |                          |
      |                              |                            |                          |
      |--- Requete protegee -------->|                            |                          |
      |                              |--- GET /api/recipes        |                          |
      |                              |    Authorization: Bearer T |                          |
      |                              |    X-Restaurant-Id: 42     |                          |
      |                              |                            |--- jwt.verify(token) --->|
      |                              |                            |--- RestaurantMember      |
      |                              |                            |    .findFirst({userId,   |
      |                              |                            |     restaurantId}) ------>|
      |                              |                            |<-- member found ----------|
      |                              |                            |--- query data ---------->|
      |                              |<-- JSON response ----------|                          |
```

**Details :**
- Token JWT : expire apres **7 jours**
- Payload JWT : `{ userId, email, role }`
- Deux middlewares :
  - `authMiddleware` : verifie le token JWT uniquement
  - `authWithRestaurant` : verifie le token **+** l'appartenance au restaurant via `X-Restaurant-Id` header
- Mots de passe haches avec **bcryptjs**
- Roles : `admin` (gestion globale + mercuriale), `chef` (acces restaurant)
- Plans : `basic`, `pro`, `business` (controle des fonctionnalites)

---

## 4. Flux IA

```
  Utilisateur        Frontend          API /api/ai/chat         Prisma/DB         Anthropic API
      |                  |                    |                      |                    |
      |-- question ----->|                    |                      |                    |
      |                  |-- POST message --->|                      |                    |
      |                  |                    |-- rate limit check   |                    |
      |                  |                    |   (20 req/heure)     |                    |
      |                  |                    |                      |                    |
      |                  |                    |-- Promise.all() ---->|                    |
      |                  |                    |   recipes (50)       |                    |
      |                  |                    |   ingredients (30)   |                    |
      |                  |                    |   inventory          |                    |
      |                  |                    |   suppliers (20)     |                    |
      |                  |                    |   employees          |                    |
      |                  |                    |   sales (100)        |                    |
      |                  |                    |   HACCP temps/clean  |                    |
      |                  |                    |<-- contexte enrichi -|                    |
      |                  |                    |                      |                    |
      |                  |                    |-- system prompt:     |                    |
      |                  |                    |   "Tu es chef        |                    |
      |                  |                    |    consultant..."    |                    |
      |                  |                    |   + contexte restau  |                    |
      |                  |                    |-- user message ----->|------------------->|
      |                  |                    |                      |                    |
      |                  |                    |<-- reponse Claude ---|<-------------------|
      |                  |<-- JSON response --|                      |                    |
      |<-- affichage ----|                    |                      |                    |
```

**Modeles utilises :**

| Endpoint                     | Modele                          | Usage                          |
|------------------------------|---------------------------------|--------------------------------|
| `/api/ai/chat`               | claude-sonnet-4-20250514        | Chat principal (contexte riche)|
| `/api/ai/forecast`           | claude-3-haiku-20240307         | Previsions de ventes           |
| `/api/ai/menu-analysis`      | claude-3-haiku-20240307         | Analyse menu engineering       |
| `/api/ai/order-recommendation`| claude-3-haiku-20240307        | Suggestions commandes          |
| `/api/ai/invoice-check`      | claude-3-haiku-20240307         | Verification factures          |
| `/api/invoices/scan`         | claude-opus-4-6                 | OCR factures (vision)          |
| `/api/news/generate`         | claude-sonnet-4-20250514        | Generation actualites           |
| `/api/mercuriale/suggest`    | claude-3-haiku-20240307         | Suggestions mercuriale         |

**Rate limiting IA :** 20 requetes par utilisateur par heure (Map en memoire).

---

## 5. Flux Mercuriale

La mercuriale est un systeme de prix de reference que l'admin publie et que tous les clients consultent.

```
  Admin                  API                           DB (raw SQL)            Tous les clients
    |                     |                                |                         |
    |-- POST /mercuriale  |                                |                         |
    |   /publications     |                                |                         |
    |   {weekDate, title} |                                |                         |
    |-------------------->|-- INSERT mercuriale_           |                         |
    |                     |   publications --------------->|                         |
    |                     |<-- publication id --------------|                         |
    |                     |                                |                         |
    |-- POST /mercuriale  |                                |                         |
    |   /:id/prices       |                                |                         |
    |   [{ingredient,     |                                |                         |
    |     prix, unite}]   |                                |                         |
    |-------------------->|-- INSERT mercuriale_prices ---->|                         |
    |                     |                                |                         |
    |-- POST /:id/alerts  |                                |                         |
    |   [{type, message}] |                                |                         |
    |-------------------->|-- INSERT mercuriale_alerts ---->|                         |
    |                     |                                |                         |
    |-- POST              |                                |                         |
    |   /:id/alternatives |                                |                         |
    |-------------------->|-- INSERT mercuriale_           |                         |
    |                     |   alternatives --------------->|                         |
    |                     |                                |                         |
    |                     |                                |         GET /mercuriale |
    |                     |                                |         /latest          |
    |                     |<--  latest WHERE published ----|<------------------------|
    |                     |    + prices + alerts            |                         |
    |                     |    + alternatives               |                         |
    |                     |------------------------------->|------------------------>|
    |                     |                                |    JSON response        |
```

**Points cles :**
- Tables Mercuriale gerees en **raw SQL** (`prisma.$queryRaw`) car non modelisees dans le schema Prisma
- L'endpoint `GET /api/mercuriale/latest` est **public** (pas d'auth), tous les clients voient la derniere publication
- Seuls les `admin` peuvent creer/modifier les publications
- Recherche et suggestions IA disponibles pour les clients

---

## 6. Base de donnees

### Schema simplifie (24 modeles Prisma)

```
  +----------+       +------------------+       +-------------+
  |   User   |------>| RestaurantMember |<------| Restaurant  |
  +----------+  1:N  +------------------+  N:1  +------+------+
  | email    |       | role (owner/     |       | name |
  | password |       |  admin/member)   |       +------+------+
  | plan     |       +------------------+              |
  | role     |                                         |
  +----------+                          +--------------+---------------+
                                        |              |               |
                                        v              v               v
                                 +------------+  +----------+   +------------+
                                 | Ingredient |  |  Recipe  |   |  Supplier  |
                                 +-----+------+  +----+-----+   +------------+
                                       |              |
                                       v              v
                                +---------------+  +------------------+
                                | InventoryItem |  | RecipeIngredient |
                                +---------------+  +------------------+
                                       |
                              +--------+--------+----------+
                              |        |        |          |
                              v        v        v          v
                         +---------+ +-----+ +--------+ +----------+
                         |PriceHist| |Waste| |Invoice | |Marketplace|
                         |ory      | |Log  | |+ Items | |Order+Items|
                         +---------+ +-----+ +--------+ +----------+

  Autres modeles :
  +----------+ +--------+ +--------+ +-----------+ +------+ +--------+
  | MenuSale | | Devis  | | Financ.| | Haccp     | |Shift | |Employee|
  |          | | +Items | | Entry  | | Temp/Clean| |      | |        |
  +----------+ +--------+ +--------+ +-----------+ +------+ +--------+
  +-------------+ +---------+ +----------+ +----------------+
  | Conversation | | Message | | NewsItem | | ActivationCode |
  +-------------+ +---------+ +----------+ +----------------+
  +----------+
  | Seminaire|
  +----------+
```

### Modeles principaux

| Modele             | Table SQL              | Relations                                   |
|--------------------|------------------------|---------------------------------------------|
| User               | users                  | possede N restaurants, N memberships         |
| Restaurant         | restaurants            | 1 owner, N members, N ingredients/recipes... |
| RestaurantMember   | restaurant_members     | lie User et Restaurant (role-based)          |
| Ingredient         | ingredients            | appartient a 1 restaurant, N recettes        |
| Recipe             | recipes                | N ingredients (via RecipeIngredient)          |
| RecipeIngredient   | recipe_ingredients     | table pivot (quantity, wastePercent)          |
| Supplier           | suppliers              | N ingredients lies                            |
| InventoryItem      | inventory_items        | 1:1 avec Ingredient, stock temps reel        |
| Invoice            | invoices               | N InvoiceItems, scan OCR                     |
| PriceHistory       | price_history          | historique prix par ingredient                |
| MenuSale           | menu_sales             | ventes quotidiennes par recette              |
| Employee           | employees              | N shifts (planning)                          |
| Shift              | shifts                 | horaires par employe                         |
| HaccpTemperature   | haccp_temperatures     | releves quotidiens                           |
| HaccpCleaning      | haccp_cleanings        | taches nettoyage                             |
| Devis              | devis                  | N DevisItems                                 |
| FinancialEntry     | financial_entries      | comptabilite (revenus/depenses)              |
| WasteLog           | waste_logs             | suivi pertes                                 |
| Seminaire          | seminaires             | evenements/reservations                      |
| Conversation       | conversations          | messagerie (N messages)                      |
| MarketplaceOrder   | marketplace_orders     | commandes fournisseurs                       |
| NewsItem           | news_items             | actualites + mercuriale                      |
| ActivationCode     | activation_codes       | codes Stripe pour inscription                |

---

## 7. Deployment

### Architecture Vercel

```
  vercel.json
  +-------------------------------------------------+
  |  buildCommand: prisma generate + vite build      |
  |  outputDirectory: client/dist                    |
  |                                                  |
  |  Rewrites:                                       |
  |    /api/*  --> api/index.ts  (Serverless Fn)     |
  |    /*      --> index.html    (SPA fallback)      |
  |                                                  |
  |  Headers:                                        |
  |    /index.html   -> no-cache (toujours frais)    |
  |    /assets/*     -> cache 1 an (hashes Vite)     |
  +-------------------------------------------------+
```

**Pipeline de build :**
1. `npm install` (root + client + server)
2. `npx prisma generate` (genere le client Prisma)
3. `cd client && npx vite build` (bundle React en `client/dist/`)
4. Vercel deploie `client/dist/` comme static + `api/index.ts` comme serverless function

**Domaines :**
- Production : `www.restaumargin.fr` / `restaumargin.fr`
- Preview : `restaumargin.vercel.app`

**Variables d'environnement (Vercel) :**
- `DATABASE_URL` / `DIRECT_URL` -- connexion Supabase PostgreSQL
- `JWT_SECRET` -- secret pour signer les tokens
- `ANTHROPIC_API_KEY` -- cle API Claude
- `RESEND_API_KEY` -- cle API Resend pour les emails
- `FRONTEND_URL` -- URL frontend (pour liens dans les emails)

---

## 8. Securite

### Couches de protection

| Couche              | Implementation                                       |
|---------------------|------------------------------------------------------|
| CORS                | Whitelist : localhost:5173, restaumargin.fr, vercel   |
| Helmet              | Headers HTTP securises (dep. server)                  |
| Rate Limiting       | express-rate-limit (dep. server)                      |
| Rate Limit IA       | 20 req/heure par userId (Map en memoire)              |
| Auth JWT            | Token 7 jours, payload minimal                       |
| Mot de passe        | bcryptjs (hachage sale)                              |
| Multi-tenant        | Verification RestaurantMember a chaque requete        |
| Validation          | zod (schemas de validation)                          |
| HTTPS               | Force par Vercel (TLS automatique)                   |
| Cache headers       | no-cache sur index.html, immutable sur assets         |

### Middleware d'autorisation

1. **authMiddleware** : extrait et verifie le JWT. Utilise pour les routes admin (mercuriale, users)
2. **authWithRestaurant** : verifie le JWT + controle que l'utilisateur est membre du restaurant cible (`X-Restaurant-Id`). Utilise pour toutes les routes metier (ingredients, recettes, etc.)

### Acces role-based

| Role   | Acces                                                       |
|--------|-------------------------------------------------------------|
| admin  | Tout + gestion utilisateurs + publications mercuriale       |
| chef   | Donnees de ses restaurants (via RestaurantMember)           |

---

## 9. ADR (Architecture Decision Records)

### ADR-001 : Vercel Serverless vs VPS traditionnel

**Statut :** Accepte
**Date :** 2024-11
**Contexte :**
RestauMargin est un SaaS destine aux restaurateurs. L'equipe est reduite (1 developpeur). Le produit doit etre deploye rapidement avec un cout minimal en phase de lancement.

**Decision :**
Utiliser Vercel pour heberger le frontend (SPA statique) et le backend (Serverless Functions) plutot qu'un VPS (OVH, Hetzner, AWS EC2).

**Arguments pour :**
- **Zero ops** : pas de serveur a maintenir, pas de nginx, pas de PM2, pas de certificats SSL manuels
- **Deploy automatique** : chaque `git push` declenche un build + deploy en ~60 secondes
- **Scaling automatique** : les Serverless Functions scalent avec le trafic sans config
- **Cout initial nul** : le plan gratuit Vercel suffit pour le MVP et les premiers clients
- **Preview deployments** : chaque branche a son propre URL de test
- **CDN global** : assets statiques servis depuis les edge nodes proches des utilisateurs

**Arguments contre :**
- **Cold starts** : la premiere requete apres inactivite prend 1-3 secondes (connexion Prisma/PG)
- **Limite 10s** par defaut sur les Serverless Functions (extensible a 60s sur Pro)
- **Pas de websockets** : impossible pour du temps reel natif (contourne par polling)
- **Monolithe contraint** : tout le backend est dans un seul fichier car Vercel rewrite vers un seul entry point

**Consequences :**
- L'API est un monolithe Express (`api/index.ts`) car Vercel route tout `/api/*` vers un seul fichier
- Les fonctionnalites temps reel (messagerie) utilisent du polling au lieu de WebSockets
- Si le nombre de requetes simultanees depasse les limites Vercel, migration vers un VPS avec Docker sera necessaire

---

### ADR-002 : Anthropic Claude (Haiku + Sonnet) vs OpenAI GPT-4

**Statut :** Accepte
**Date :** 2024-11
**Contexte :**
L'application integre plusieurs fonctionnalites IA : chat assistant, OCR de factures, analyses de marge, previsions de ventes, generation de contenu. Le choix du fournisseur LLM impacte le cout, la qualite et la latence.

**Decision :**
Utiliser Anthropic Claude avec une strategie multi-modeles : Haiku pour les taches rapides/economiques, Sonnet pour le chat enrichi, Opus pour la vision (OCR).

**Arguments pour :**
- **Cout** : Claude 3 Haiku est ~10x moins cher que GPT-4 pour des taches simples (analyses, previsions)
- **Qualite du francais** : Claude produit des reponses naturelles en francais, ce qui est crucial pour un public de restaurateurs francophones
- **Context window** : 200k tokens permettent d'injecter le contexte complet du restaurant (recettes, stocks, prix) dans chaque requete
- **Strategie multi-modeles** : Haiku (rapide, pas cher) pour 80% des appels, Sonnet (intelligent) pour le chat, Opus (vision) pour l'OCR
- **SDK TypeScript** : le SDK `@anthropic-ai/sdk` s'integre nativement avec l'API Express

**Arguments contre :**
- **Ecosysteme** : OpenAI a un ecosysteme plus large (plugins, fine-tuning, assistants API)
- **Vendor lock-in** : dependance a un seul fournisseur IA
- **Disponibilite** : OpenAI a historiquement plus de redundance geographique

**Consequences :**
- Les appels IA sont repartis par endpoint selon le ratio cout/qualite necessaire
- Le rate limiting (20 req/h) est essentiel pour controler les couts Anthropic
- Si Anthropic augmente ses prix, la migration vers OpenAI est possible en changeant uniquement `api/index.ts` (meme pattern request/response)

---

### ADR-003 : Monolithe api/index.ts vs microservices

**Statut :** Accepte
**Date :** 2024-11
**Contexte :**
L'API backend gere l'authentification, le CRUD (ingredients, recettes, fournisseurs, etc.), les integrations IA, les webhooks Stripe, les emails, et la mercuriale. Tout ce code est dans un seul fichier `api/index.ts` de ~3800 lignes.

**Decision :**
Conserver un monolithe dans un seul fichier plutot que de decouper en microservices ou meme en modules separes.

**Arguments pour :**
- **Contrainte Vercel** : le `vercel.json` rewrite `/api/*` vers `api/index.ts`. Tous les endpoints doivent etre dans ce fichier (ou re-exportes depuis)
- **Simplicite** : un seul fichier = pas de gestion d'imports circulaires, pas de config de bundling backend, pas de barrel files
- **Grep-friendly** : `Ctrl+F` suffit pour trouver n'importe quelle route, middleware ou logique
- **Vitesse de developpement** : pas de ceremony pour ajouter un endpoint (pas de router, pas de controller, pas de service layer)
- **Une seule instance Prisma** : le `PrismaClient` est instancie une seule fois en haut du fichier, reutilise partout

**Arguments contre :**
- **Lisibilite** : 3800 lignes dans un fichier est difficile a naviguer pour un nouveau contributeur
- **Tests** : impossible de tester unitairement une route sans charger tout le fichier
- **Cold start** : le fichier entier est parse a chaque cold start de la Serverless Function
- **Conflits git** : si plusieurs developpeurs travaillent en parallele, les conflits de merge sont frequents

**Consequences :**
- Le fichier est organise par sections avec des commentaires separateurs (`// ============ AUTH ============`)
- Si l'equipe grandit, il faudra extraire les routes en modules (`auth.ts`, `recipes.ts`, `ai.ts`) et les importer dans `index.ts`
- Les tests d'integration se font via des requetes HTTP plutot que des tests unitaires de fonctions

---

## Annexe : Routes API (exhaustif)

### Auth & Users
- `POST /api/auth/register` -- Inscription (avec code activation)
- `POST /api/auth/login` -- Connexion
- `GET  /api/auth/me` -- Profil utilisateur courant
- `GET  /api/auth/users` -- Liste utilisateurs (admin)
- `DELETE /api/auth/users/:id` -- Suppression utilisateur (admin)
- `GET  /api/auth/verify-email` -- Verification email
- `POST /api/auth/resend-verification` -- Renvoyer verification
- `POST /api/auth/forgot-password` -- Mot de passe oublie
- `POST /api/auth/reset-password` -- Reset mot de passe
- `GET  /api/auth/first-user` -- Verifier si premier utilisateur

### Activation & Stripe
- `POST /api/activation/generate` -- Generer code (admin)
- `POST /api/activation/validate` -- Valider code
- `GET  /api/activation/list` -- Lister codes (admin)
- `POST /api/stripe/webhook` -- Webhook Stripe (checkout)

### Restaurants
- `GET  /api/restaurants` -- Mes restaurants
- `POST /api/restaurants` -- Creer restaurant
- `PUT  /api/restaurants/:id` -- Modifier restaurant
- `DELETE /api/restaurants/:id` -- Supprimer restaurant

### Ingredients & Recettes
- `GET/POST/PUT/DELETE /api/ingredients` -- CRUD ingredients
- `GET /api/ingredients/usage` -- Utilisation par recette
- `GET/POST/PUT/DELETE /api/recipes` -- CRUD recettes
- `POST /api/recipes/:id/clone` -- Cloner une recette

### Fournisseurs & Approvisionnement
- `GET/POST/PUT/DELETE /api/suppliers` -- CRUD fournisseurs
- `POST /api/suppliers/:id/link-ingredients` -- Lier ingredients
- `GET/POST/PUT/DELETE /api/inventory` -- Gestion stock
- `GET/POST/PUT/DELETE /api/rfqs` -- Appels d'offres
- `GET/POST/PUT/DELETE /api/marketplace/orders` -- Commandes

### Facturation & Finance
- `GET/POST/DELETE /api/invoices` -- Factures
- `POST /api/invoices/scan` -- OCR facture (Claude Vision)
- `POST /api/invoices/:id/apply` -- Appliquer facture au stock
- `GET/POST /api/menu-sales` -- Ventes menu
- `GET /api/menu-engineering` -- Analyse menu engineering
- `GET /api/price-history` -- Historique prix

### IA
- `POST /api/ai/chat` -- Chat assistant (Sonnet)
- `POST /api/ai/forecast` -- Previsions (Haiku)
- `POST /api/ai/menu-analysis` -- Analyse menu (Haiku)
- `POST /api/ai/order-recommendation` -- Suggestion commande (Haiku)
- `POST /api/ai/invoice-check` -- Verification facture (Haiku)

### HACCP & Planning
- `GET/POST /api/haccp/temperatures` -- Releves temperature
- `GET/POST/PUT /api/haccp/cleanings` -- Nettoyage
- `GET /api/haccp/summary` -- Resume HACCP du jour
- `GET/POST/PUT/DELETE /api/planning/employees` -- Employes
- `GET/POST/PUT/DELETE /api/planning/shifts` -- Planning

### Communication & CRM
- `GET/POST/DELETE /api/messages/conversations` -- Conversations
- `GET/POST /api/messages/conversations/:id/messages` -- Messages
- `POST /api/crm/send-email` -- Email CRM
- `POST /api/email/send` -- Email generique
- `POST /api/contact` -- Formulaire contact (public)

### Mercuriale
- `GET  /api/mercuriale/latest` -- Derniere publication (public)
- `GET  /api/mercuriale/publications` -- Toutes les publications (admin)
- `POST /api/mercuriale/publications` -- Creer publication (admin)
- `POST /api/mercuriale/publications/:id/prices` -- Ajouter prix
- `POST /api/mercuriale/publications/:id/alerts` -- Ajouter alertes
- `POST /api/mercuriale/publications/:id/alternatives` -- Ajouter alternatives
- `GET  /api/mercuriale/search` -- Rechercher produits
- `GET  /api/mercuriale/suggest` -- Suggestions IA

### Divers
- `GET /api/health` -- Health check
- `POST /api/errors` -- Log erreurs frontend
- `GET/POST /api/news` -- Actualites
- `GET/POST/PUT/DELETE /api/seminaires` -- Seminaires/evenements
- `GET/POST /api/devis` -- Devis
- `GET /api/public/menu` -- Menu public (QR code)
