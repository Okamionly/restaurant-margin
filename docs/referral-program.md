# Programme de Parrainage RestauMargin

> Document de design -- Version 1.0 -- Avril 2026

---

## 1. Vue d'ensemble

RestauMargin lance un programme de parrainage client-a-client (double-sided) pour transformer les restaurateurs existants en moteur de croissance organique.

**Objectif principal :** Acquérir de nouveaux clients a un CAC inferieur a 50 EUR en s'appuyant sur la confiance entre pairs dans le secteur de la restauration independante.

| Parametre | Valeur |
|-----------|--------|
| Plans eligibles | Pro (29 EUR/mois), Business (79 EUR/mois) |
| CAC cible | < 50 EUR |
| Type de programme | Double-sided (parrain + filleul recompenses) |
| Limite de parrainages | Aucune limite |

---

## 2. Structure des recompenses

### 2.1 Recompense parrain

| Element | Detail |
|---------|--------|
| Recompense | **1 mois gratuit** sur son abonnement en cours |
| Declenchement | Quand le filleul reste abonne 2 mois consecutifs |
| Cumul | Illimite -- chaque filleul valide = 1 mois gratuit supplementaire |
| Application | Credit applique sur la prochaine facture Stripe |

**Economie du parrain :**
- Plan Pro : economise 29 EUR par parrainage valide
- Plan Business : economise 79 EUR par parrainage valide

### 2.2 Recompense filleul

| Element | Detail |
|---------|--------|
| Recompense | **1er mois a 50% de reduction** |
| Prix filleul Pro | 14.50 EUR au lieu de 29 EUR |
| Prix filleul Business | 39.50 EUR au lieu de 79 EUR |
| Application | Coupon Stripe applique automatiquement a l'inscription |

### 2.3 Conditions de validation

- Le filleul doit etre un **nouveau client** (email jamais utilise sur RestauMargin).
- Le filleul doit rester abonne **2 mois minimum** apres son inscription.
- Si le filleul annule avant 2 mois, le parrain ne recoit pas la recompense.
- Auto-parrainage interdit (meme email, meme numero SIRET).

---

## 3. Analyse economique

### 3.1 Cout d'acquisition par parrainage (Plan Pro)

| Poste | Montant |
|-------|---------|
| Reduction filleul (mois 1) | 14.50 EUR |
| Mois gratuit parrain | 29.00 EUR |
| **Cout total par parrainage** | **43.50 EUR** |

CAC = 43.50 EUR < 50 EUR --> **objectif atteint**

### 3.2 Cout d'acquisition par parrainage (Plan Business)

| Poste | Montant |
|-------|---------|
| Reduction filleul (mois 1) | 39.50 EUR |
| Mois gratuit parrain | 79.00 EUR |
| **Cout total par parrainage** | **118.50 EUR** |

Le CAC pour Business depasse 50 EUR, mais la LTV d'un client Business (79 EUR x 12 mois = 948 EUR/an) justifie largement cet investissement. Ratio CAC/LTV annuelle = 0.12.

### 3.3 ROI attendu

En se basant sur les benchmarks du secteur SaaS :
- Les clients parraines ont une LTV 16-25% superieure.
- Leur taux de churn est 18-37% inferieur.
- Ils parrainent eux-memes 2-3x plus souvent.

---

## 4. Parcours utilisateur

### 4.1 Boucle de parrainage

```
Moment declencheur --> Partage du lien --> Inscription filleul --> Abonnement 2 mois --> Recompenses distribuees --> (boucle)
```

### 4.2 Parcours parrain

1. Le restaurateur se rend dans **Parametres > Parrainage** (`/settings`).
2. Il voit son **lien de parrainage unique** (ex: `https://restaumargin.com/ref/ABC123`).
3. Il copie le lien ou utilise le bouton de partage (email, WhatsApp, SMS).
4. Il suit ses parrainages dans le **Dashboard de parrainage** :
   - Nombre de filleuls invites
   - Nombre de filleuls inscrits
   - Nombre de filleuls valides (2 mois atteints)
   - Mois gratuits gagnes (utilises et en attente)
5. Il recoit un email de notification quand un parrainage est valide.

### 4.3 Parcours filleul

1. Le filleul recoit un lien de parrainage (via email, SMS, WhatsApp, etc.).
2. Il arrive sur une landing page dediee avec la reduction affichee.
3. Il s'inscrit normalement -- le coupon 50% est applique automatiquement.
4. Il utilise RestauMargin pendant 2 mois.
5. A la validation, le parrain est notifie et credite.

### 4.4 Moments declencheurs dans l'app

Les meilleurs moments pour proposer le parrainage :
- Apres la premiere analyse de marge reussie (moment "aha")
- Apres 30 jours d'utilisation active
- Apres un upgrade de plan
- Apres une interaction positive avec le support

---

## 5. Implementation technique

### 5.1 Schema de base de donnees

**Table `referrals`**

| Colonne | Type | Description |
|---------|------|-------------|
| `id` | uuid | Cle primaire |
| `referrer_id` | uuid (FK -> users) | Utilisateur parrain |
| `referee_id` | uuid (FK -> users), nullable | Utilisateur filleul (rempli a l'inscription) |
| `referral_code` | varchar(20), unique | Code unique du parrain (ex: ABC123) |
| `referee_email` | varchar(255), nullable | Email du filleul invite (avant inscription) |
| `status` | enum | `pending`, `signed_up`, `active`, `validated`, `expired`, `cancelled` |
| `reward_applied` | boolean, default false | Mois gratuit applique au parrain |
| `created_at` | timestamptz | Date de creation |
| `signed_up_at` | timestamptz, nullable | Date d'inscription du filleul |
| `validated_at` | timestamptz, nullable | Date de validation (2 mois atteints) |

**Index recommandes :**
- `referrer_id` (listing des parrainages d'un utilisateur)
- `referral_code` (lookup rapide lors de l'inscription)
- `status` (filtrage par statut)

### 5.2 Routes API

#### `POST /api/referrals/create`

Genere un code de parrainage pour l'utilisateur connecte.

```
Request: (authentifie)
Response: {
  "referral_code": "ABC123",
  "referral_link": "https://restaumargin.com/ref/ABC123",
  "created_at": "2026-04-01T10:00:00Z"
}
```

#### `GET /api/referrals/my`

Retourne le dashboard de parrainage de l'utilisateur connecte.

```
Response: {
  "referral_code": "ABC123",
  "referral_link": "https://restaumargin.com/ref/ABC123",
  "stats": {
    "total_invited": 5,
    "signed_up": 3,
    "validated": 2,
    "pending_validation": 1,
    "free_months_earned": 2,
    "free_months_used": 1,
    "free_months_available": 1
  },
  "referrals": [
    {
      "referee_email": "chef.marc@resto.fr",
      "status": "validated",
      "signed_up_at": "2026-02-15T10:00:00Z",
      "validated_at": "2026-04-15T10:00:00Z"
    }
  ]
}
```

#### `POST /api/referrals/apply`

Applique un code de parrainage lors de l'inscription d'un nouveau filleul.

```
Request: {
  "referral_code": "ABC123"
}
Response: {
  "discount": "50%",
  "first_month_price": 14.50,
  "referrer_name": "Restaurant Le Provencal"
}
```

### 5.3 Integration Stripe

| Action | Implementation Stripe |
|--------|----------------------|
| Reduction filleul (50% mois 1) | Coupon Stripe `REFERRAL_50` applique a la premiere facture |
| Mois gratuit parrain | Credit note ou coupon `REFERRAL_FREE_MONTH` applique a la prochaine facture |
| Validation a 2 mois | Webhook `invoice.paid` -- compter les factures payees par le filleul |

### 5.4 Page frontend

**Emplacement :** Section dans la page Settings (`/settings`) ou page dediee (`/settings/referral`).

**Composants :**
- Carte avec le lien de parrainage + bouton copier
- Boutons de partage (email, WhatsApp, SMS)
- Tableau de bord avec statistiques
- Liste des parrainages avec statut
- Explication du programme (comment ca marche en 3 etapes)

---

## 6. Emails automatiques

### 6.1 Email au parrain -- Parrainage valide

**Declencheur :** Le filleul atteint 2 mois d'abonnement.

```
Objet : Votre parrainage est valide -- 1 mois gratuit !

Bonjour [prenom_parrain],

Bonne nouvelle ! [prenom_filleul] de [nom_restaurant_filleul] utilise
RestauMargin depuis 2 mois.

Votre recompense : 1 mois gratuit sur votre abonnement [plan].
Le credit sera applique a votre prochaine facture.

Continuez a parrainer : [lien_parrainage]
Chaque restaurateur qui s'abonne = 1 mois gratuit pour vous.

[CTA: Voir mon dashboard de parrainage]
```

### 6.2 Email d'invitation au filleul

**Declencheur :** Le parrain partage via le bouton email dans l'app.

```
Objet : [prenom_parrain] vous offre 50% sur RestauMargin

Bonjour,

[prenom_parrain] de [nom_restaurant_parrain] utilise RestauMargin pour
optimiser ses marges et vous recommande l'outil.

Votre avantage : votre 1er mois a moitie prix.
- Plan Pro : 14.50 EUR au lieu de 29 EUR
- Plan Business : 39.50 EUR au lieu de 79 EUR

[CTA: Decouvrir RestauMargin avec -50%]
```

### 6.3 Email au parrain -- Filleul inscrit

**Declencheur :** Le filleul cree son compte.

```
Objet : [prenom_filleul] s'est inscrit grace a vous !

Bonjour [prenom_parrain],

[prenom_filleul] de [nom_restaurant_filleul] vient de s'inscrire sur
RestauMargin grace a votre recommandation.

Votre mois gratuit sera active des que [prenom_filleul] atteindra
2 mois d'abonnement.

Statut actuel : En attente de validation

[CTA: Suivre mes parrainages]
```

---

## 7. Messaging et CTA dans l'app

### 7.1 CTA principal

> **Parrainez un restaurateur, gagnez 1 mois gratuit**

Emplacements :
- Barre laterale (sidebar) -- lien permanent
- Dashboard principal -- banniere discrete
- Page Settings -- section dediee

### 7.2 Variantes de CTA a tester (A/B)

| Variante | CTA |
|----------|-----|
| A (defaut) | Parrainez un restaurateur, gagnez 1 mois gratuit |
| B | Invitez un collegue restaurateur -- vous gagnez tous les deux |
| C | Connaissez un restaurateur ? Offrez-lui -50% |

### 7.3 In-app notifications

- **Post-aha moment :** "Vous avez optimise votre premiere marge ! Partagez RestauMargin avec d'autres restaurateurs et gagnez 1 mois gratuit."
- **Post-30 jours :** "Ca fait 1 mois que vous utilisez RestauMargin. Parrainez un collegue et gagnez 1 mois gratuit."
- **Post-upgrade :** "Bienvenue sur [plan] ! Saviez-vous que chaque parrainage vous offre 1 mois gratuit ?"

---

## 8. Prevention de la fraude

| Regle | Implementation |
|-------|----------------|
| Auto-parrainage | Verification email + SIRET different |
| Comptes jetables | Verification email (pas de domaines jetables) |
| Abus de volume | Monitoring automatique si > 10 parrainages/mois |
| Annulations rapides | Validation uniquement apres 2 mois d'abonnement paye |

---

## 9. Metriques de suivi

### 9.1 KPIs du programme

| Metrique | Cible |
|----------|-------|
| Taux de partage (% utilisateurs qui partagent) | > 15% |
| Taux de conversion (invites -> inscrits) | > 20% |
| Taux de validation (inscrits -> 2 mois) | > 70% |
| CAC via parrainage (Plan Pro) | < 50 EUR |
| % des nouveaux clients via parrainage | > 25% a 6 mois |

### 9.2 Dashboard interne (admin)

- Nombre total de parrainages actifs
- Parrainages par statut (pending, signed_up, validated, expired)
- Top parrains (classement par nombre de filleuls valides)
- Cout total du programme (credits distribues)
- CAC effectif via parrainage vs autres canaux

---

## 10. Plan de lancement

### Phase 1 -- Preparation (semaine 1-2)

- [ ] Creer la table `referrals` en base de donnees
- [ ] Implementer les routes API
- [ ] Creer les coupons Stripe (REFERRAL_50, REFERRAL_FREE_MONTH)
- [ ] Developper la section parrainage dans Settings
- [ ] Configurer les templates d'email (Resend)
- [ ] Mettre en place le webhook Stripe pour la validation a 2 mois
- [ ] Tester le flux complet (parrain -> filleul -> validation -> recompense)

### Phase 2 -- Lancement soft (semaine 3)

- [ ] Activer pour les utilisateurs existants les plus actifs (beta)
- [ ] Envoyer un email d'annonce aux beta-testeurs
- [ ] Recueillir les retours et corriger les frictions

### Phase 3 -- Lancement general (semaine 4)

- [ ] Activer le programme pour tous les utilisateurs
- [ ] Ajouter les CTA dans l'app (sidebar, dashboard, settings)
- [ ] Envoyer l'email d'annonce a toute la base
- [ ] Briefer le support sur le programme

### Phase 4 -- Optimisation (mois 2+)

- [ ] Analyser le funnel de conversion
- [ ] Identifier les top parrains
- [ ] A/B tester les CTA et les messages
- [ ] Envoyer des emails de relance aux non-parrains
- [ ] Evaluer l'ajout de recompenses par paliers (5, 10, 20 parrainages)

---

## 11. Evolutions futures

- **Programme par paliers :** Recompenses supplementaires pour les top parrains (ex: 5 parrainages = 3 mois gratuits, 10 parrainages = badge ambassadeur + 6 mois gratuits).
- **Programme ambassadeur :** Les top parrains deviennent ambassadeurs avec un lien personnalise et une page de profil public.
- **Widget de parrainage :** Widget a integrer sur le site du restaurant pour partager le lien.
- **QR code :** Generation d'un QR code pour le partage en personne entre restaurateurs.
