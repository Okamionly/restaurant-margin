# Audit CRO — RestauMargin

**Date** : 2026-04-01
**Pages auditees** : Landing (`/`), Signup/Login (`/login?mode=register`), Pricing (`/pricing`)

---

## 1. Audit Landing Page (restaumargin.fr)

### 1.1 Hero — Clarte en 5 secondes

**Constat actuel :**
- Headline : "Maitrisez vos marges. Augmentez vos profits." -- clair, oriente benefice.
- Sous-titre explique le positionnement (couts matiere, carte, commandes). Bien.
- Badge "PLATEFORME #1 DES RESTAURATEURS" -- affirme le leadership sans preuve.
- Carrousel 3 images en hero (hero-1/2/3.webp) avec auto-rotation toutes les 4s.
- CTA principal : "Voir les tarifs" -- ne dirige PAS vers l'inscription mais vers /pricing.
- CTA secondaire : "Voir la demo" -- scroll vers la section "Comment ca marche" (pas une vraie demo).

**Problemes identifies :**
- **Pas de CTA d'inscription directe en hero.** Le visiteur doit passer par Pricing > Stripe > code d'activation > /login. Parcours trop long.
- **"Voir la demo" est trompeur** : ce n'est pas une demo interactive, c'est une section statique en 3 etapes.
- **Le carrousel auto-rotate detourne l'attention** sans apporter de valeur demontrable (pas de screenshots produit, juste des images generiques).
- **Pas de mention "Essai gratuit" ou "Sans engagement"** visible dans le hero -- alors que l'abonnement est sans engagement.

**Impact** : HIGH -- le hero est la zone la plus vue, l'absence de CTA signup direct perd des conversions.

### 1.2 Social Proof

**Constat actuel :**
- Section "Ils nous font confiance" avec 5 logos fournisseurs (METRO, Transgourmet, Pomona, Sysco, Brake) -- ce sont des grossistes, pas des clients.
- Statistiques animees : 150+ restaurants, 8% economise, 50k pesees/mois, 4.8/5 satisfaction.
- 3 temoignages avec nom, role, lieu et note etoile. Pas de photos.

**Problemes identifies :**
- **Les logos affichent des fournisseurs, pas des clients.** Cela peut creer de la confusion ("METRO utilise RestauMargin ?" alors que c'est juste une compatibilite).
- **Les temoignages n'ont pas de photo** -- les temoignages avec photo convertissent mieux.
- **Pas de lien vers un avis externe** (Google, Trustpilot, Capterra).
- **"150+ restaurants"** est un chiffre modeste pour une revendication "#1 des restaurateurs".

**Impact** : MEDIUM -- la credibilite est partiellement etablie mais pourrait etre renforcee.

### 1.3 Pricing Section (sur la landing)

**Constat actuel :**
- 2 plans affiches sur la landing : Pro (29 EUR) et Business (79 EUR).
- CTA "Choisir Pro" / "Choisir Business" redirigent vers des liens Stripe externes (buy.stripe.com).
- Pas de toggle mensuel/annuel sur la landing (seulement sur /pricing).
- Pas de mention "Sans carte bancaire" ou "Essai gratuit".

**Problemes identifies :**
- **Le flux d'achat est disjoint** : Stripe Payment Link > email avec code > aller sur /login > creer un compte > entrer le code. C'est un parcours en 5 etapes au lieu d'un flux integre.
- **Aucune option gratuite visible** (free trial, freemium) -- c'est un bloqueur majeur pour un SaaS B2B en phase d'acquisition.
- **Les features listees sont differentes** entre la landing et la page /pricing dediee -- incoherence.

**Impact** : HIGH -- le modele "payer d'abord, creer un compte ensuite" est contre-intuitif et freine l'adoption.

### 1.4 FAQ

**Constat actuel :**
- 5 questions couvrant : abonnement, code d'activation, changement de plan, balance connectee, securite donnees.
- Format accordion (collapse/expand).

**Problemes identifies :**
- **Ne couvre pas les objections cles** :
  - "Combien de temps pour configurer ?" (time-to-value)
  - "Et si je ne suis pas satisfait ?" (garantie / remboursement)
  - "Y a-t-il un essai gratuit ?" (question la plus probable pour un SaaS)
  - "Est-ce que ca fonctionne avec ma caisse ?" (deja couvert par la section integrations, mais devrait etre aussi en FAQ)
- **Pas de schema FAQ pour le SEO** (schema.org/FAQPage).

**Impact** : MEDIUM -- les questions existantes sont correctes mais les objections bloquantes manquent.

### 1.5 Mobile

**Constat actuel :**
- Responsive mobile avec menu hamburger.
- Hero en colonne unique, carrousel cache sur mobile (hidden lg:block).
- Navbar fixe avec CTA "Voir les tarifs" dans le menu mobile.

**Problemes identifies :**
- **Le logo et les images hero sont caches sur mobile** (hidden lg:block) -- le visiteur mobile voit uniquement du texte.
- **Pas de CTA sticky en bas d'ecran** sur mobile.
- **Le formulaire de contact en bas de page est long a scroller** sur mobile.

**Impact** : MEDIUM -- le responsive est fonctionnel mais pas optimise pour la conversion mobile.

---

## 2. Audit Signup Flow

### 2.1 Architecture du parcours

**Parcours actuel (5+ etapes) :**
1. Landing > clic "Voir les tarifs"
2. Page Pricing > clic sur lien Stripe
3. Paiement sur Stripe (site externe)
4. Reception email avec code d'activation
5. Navigation vers /login?mode=register
6. Remplissage du formulaire (name + email + password + role + code activation + CGU)
7. Email de verification
8. Clic sur le lien de verification
9. Login > Dashboard

**C'est un flow en 9 etapes.** La norme SaaS est 2-3 etapes (signup > onboarding > dashboard).

**Impact** : CRITICAL -- chaque etape supplementaire perd environ 20% des utilisateurs.

### 2.2 Formulaire d'inscription (/login?mode=register)

**Champs requis :**
- Nom (required)
- Email (required)
- Mot de passe (required, minLength=6)
- Role (select : chef / admin) -- required sauf first user
- Code d'activation (required sauf first user)
- Checkbox CGU (required)

**Total : 6 champs** (dont 2 inutiles a l'inscription).

**Problemes identifies :**
- **Le champ "Role" (chef/admin) peut etre collecte plus tard** dans les settings. Il n'apporte rien au signup.
- **Le code d'activation est un point de friction majeur.** L'utilisateur doit deja avoir paye AVANT de creer son compte. C'est l'inverse du modele SaaS standard.
- **Pas de toggle "afficher mot de passe"** (oeil) -- mauvaise UX.
- **Pas de validation inline** : les erreurs apparaissent seulement apres submit.
- **Pas de social login** (Google, Apple) -- or la page Login affiche des "value props" dans le panneau gauche mais pas de Google Auth.
- **Le placeholder du mot de passe est "........"** -- pas informatif, ne communique pas les exigences.
- **Pas d'indication de force du mot de passe.**
- **Le label "Code d'activation" n'explique pas ou le trouver** si l'utilisateur arrive directement sur /register sans etre passe par Stripe.
- **Pas de message "Pas de carte requise"** ou "Essai gratuit" pres du formulaire.

**Impact** : HIGH -- 6 champs + code d'activation + paiement prealable = taux d'abandon eleve.

### 2.3 Social Login

**Constat** : Aucun social login disponible. Ni Google, ni Apple, ni Microsoft.

**Impact** : HIGH -- le social login (Google en particulier) reduit la friction de 20-40% en moyenne pour les SaaS B2B.

### 2.4 Friction Points

| Point de friction | Severite |
|---|---|
| Paiement AVANT creation de compte | CRITICAL |
| Code d'activation requis | HIGH |
| 6 champs au lieu de 2-3 | HIGH |
| Pas de social login | HIGH |
| Pas de toggle password visibility | MEDIUM |
| Pas de validation inline | MEDIUM |
| Pas d'indicateur de force MDP | LOW |
| Verification email obligatoire avant usage | MEDIUM |

### 2.5 Error Messages

**Constat :**
- Les erreurs sont affichees dans un bandeau rouge en haut du formulaire.
- Messages venant du backend (generiques).
- Pas de message specifique pour "email deja utilise" avec lien de recuperation.
- Pas de focus automatique sur le champ en erreur.
- Le formulaire n'est pas vide apres erreur (bien).

**Impact** : MEDIUM -- les erreurs sont visibles mais pas assez contextuelles.

---

## 3. Recommandations CRO

### 3.1 Quick Wins (implementables en 1-2 jours)

| # | Recommandation | Impact |
|---|---|---|
| 1 | **Ajouter un CTA "Creer mon compte" dans le hero** de la landing, dirigeant vers /login?mode=register | HIGH |
| 2 | **Ajouter un toggle "afficher/cacher" sur le champ mot de passe** (icone oeil) | MEDIUM |
| 3 | **Ajouter "Sans engagement. Annulez quand vous voulez."** directement dans le hero, pres du CTA | HIGH |
| 4 | **Remplacer le placeholder "........" du mot de passe** par "Minimum 6 caracteres" | MEDIUM |
| 5 | **Ajouter des photos aux temoignages** (meme si generees) pour augmenter la credibilite | MEDIUM |
| 6 | **Rendre le champ Role optionnel** ou le deplacer en post-signup (settings) | MEDIUM |
| 7 | **Ajouter une FAQ "Y a-t-il un essai gratuit ?"** et "Et si je ne suis pas satisfait ?" | MEDIUM |
| 8 | **Ajouter validation inline** sur email (format) et mot de passe (longueur) | MEDIUM |
| 9 | **Corriger les couleurs text-slate-300** sur fond blanc dans la page Pricing (contraste insuffisant pour les descriptions et features) | MEDIUM |

### 3.2 High-Impact Changes (1-2 semaines)

| # | Recommandation | Impact |
|---|---|---|
| 10 | **Inverser le flow : signup AVANT paiement.** Permettre la creation de compte avec email+password, puis demander le paiement apres onboarding (modele "try then buy"). Supprimer le systeme de code d'activation. | CRITICAL |
| 11 | **Ajouter Google OAuth** comme option de signup (bouton "Continuer avec Google" au-dessus du formulaire email). | HIGH |
| 12 | **Creer un plan Free/Trial** : 14 jours gratuits avec acces limite (ex: 5 recettes, 1 fournisseur) pour reduire la barriere d'entree. | HIGH |
| 13 | **Reduire le formulaire a 3 champs** : Email + Mot de passe + Nom (optionnel). Collecter role, restaurant, etc. dans un onboarding post-signup. | HIGH |
| 14 | **Remplacer "Voir la demo" par une vraie demo interactive** ou une video de 60 secondes montrant le produit en action. | HIGH |
| 15 | **Ajouter un CTA sticky mobile** en bas d'ecran ("Essayer gratuitement" ou "Voir les tarifs"). | MEDIUM |
| 16 | **Deplacer les temoignages plus haut** sur la page, juste apres la section "problem/solution", avant les features. | MEDIUM |
| 17 | **Ajouter le schema FAQ** (JSON-LD) pour ameliorer le SEO et les rich snippets Google. | MEDIUM |

### 3.3 Test Hypotheses (A/B test)

| # | Hypothese | Ce qu'on teste |
|---|---|---|
| A | Le headline "Maitrisez vos marges" vs. un headline plus specifique : "Reduisez vos couts matiere de 8% en 30 jours" | Impact sur le taux de clic CTA hero |
| B | CTA "Voir les tarifs" vs. "Essayer gratuitement" vs. "Creer mon compte" | Taux de conversion landing > signup |
| C | Formulaire signup sur la landing (inline) vs. page separee /register | Taux de completion signup |
| D | Avec code d'activation vs. sans code (inscription libre + paywall in-app) | Taux de completion signup |
| E | 2 plans visibles vs. 3 plans (ajouter un plan Starter gratuit) | Conversion pricing |
| F | Logos fournisseurs vs. logos de vrais restaurants clients | Impact sur la credibilite percue |

---

## Resume des priorites

| Priorite | Action | Impact estime |
|---|---|---|
| 1 | Inverser le flow (signup avant paiement) | +50-80% signups |
| 2 | Ajouter Google OAuth | +20-40% signups |
| 3 | Creer un plan Free Trial 14j | +30-50% signups |
| 4 | Reduire le formulaire a 3 champs | +15-25% completion |
| 5 | CTA signup direct dans le hero | +10-20% clics hero |
| 6 | Corriger les couleurs de contraste (text-slate-300 sur fond blanc) | +5-10% lisibilite/engagement |
| 7 | Ajouter validation inline + toggle password | +5-10% completion |
| 8 | Demo video ou interactive | +10-15% engagement |
