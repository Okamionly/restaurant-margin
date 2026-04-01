# RestauMargin -- A/B Tests & Analytics Tracking Plan

> Date : 2026-04-01
> Statut : Draft

---

## 1. A/B Tests prioritaires

### Test 1 -- Hero CTA

| Champ | Detail |
|-------|--------|
| **Hypothese** | Le CTA "Essayer gratuitement" reduit la friction perceptuelle et augmente le taux de clic par rapport a "Voir les tarifs" qui implique un engagement financier |
| **Variante A (controle)** | "Voir les tarifs" |
| **Variante B** | "Essayer gratuitement" |
| **Metrique primaire** | Taux de clic sur le CTA hero (cta_hero_clicked) |
| **Metriques secondaires** | Taux de signup, temps sur la page pricing |
| **Metrique guardrail** | Taux de rebond sur la page pricing |
| **Trafic minimum** | ~7 000 visiteurs/variante (baseline 5 %, MDE 20 %) |
| **Duree estimee** | 2-4 semaines |
| **Outil** | PostHog Feature Flags ou Vercel Edge Config |

---

### Test 2 -- Affichage du prix

| Champ | Detail |
|-------|--------|
| **Hypothese** | L'affichage en prix journalier (0.96 EUR/jour) reduit l'ancrage mental du cout mensuel et augmente le taux de conversion vers l'essai gratuit |
| **Variante A (controle)** | 29 EUR/mois |
| **Variante B** | 0.96 EUR/jour |
| **Metrique primaire** | Taux de clic sur "Commencer l'essai" depuis la page pricing |
| **Metriques secondaires** | Temps passe sur la page pricing, scroll depth |
| **Metrique guardrail** | Tickets support lies a la facturation, taux de refund |
| **Trafic minimum** | ~7 000 visiteurs/variante |
| **Duree estimee** | 2-4 semaines |
| **Outil** | PostHog Feature Flags |

---

### Test 3 -- Landing page avec/sans video

| Champ | Detail |
|-------|--------|
| **Hypothese** | Une video de demo de 60 secondes augmente la comprehension du produit et le taux de signup car le produit est complexe (marge, recettes, IA) |
| **Variante A (controle)** | Landing page sans video |
| **Variante B** | Landing page avec video hero autoplay (muted) |
| **Metrique primaire** | Taux de signup (signup_completed) |
| **Metriques secondaires** | Taux de lecture video, duree de visionnage, scroll depth |
| **Metrique guardrail** | Core Web Vitals (LCP), taux de rebond mobile |
| **Trafic minimum** | ~7 000 visiteurs/variante |
| **Duree estimee** | 3-4 semaines |
| **Outil** | PostHog + hebergement video Cloudflare Stream ou YouTube embed |

---

### Test 4 -- Signup : email+password vs Google SSO

| Champ | Detail |
|-------|--------|
| **Hypothese** | Le signup Google SSO en un clic reduit la friction d'inscription et augmente le taux de completion du formulaire par rapport a email+password |
| **Variante A (controle)** | Formulaire email + mot de passe |
| **Variante B** | Bouton "Continuer avec Google" en priorite + option email en secondaire |
| **Metrique primaire** | Taux de completion signup (signup_completed) |
| **Metriques secondaires** | Temps de completion, taux d'abandon formulaire |
| **Metrique guardrail** | Taux de login jour+1 (retention immediate) |
| **Trafic minimum** | ~3 000 visiteurs/variante (baseline 10 %) |
| **Duree estimee** | 2-3 semaines |
| **Outil** | Supabase Auth (supporte deja les deux methodes) |

---

### Test 5 -- Onboarding : avec checklist vs sans

| Champ | Detail |
|-------|--------|
| **Hypothese** | Une checklist d'onboarding guidee (creer 1 recette, lancer le chat IA, inviter un membre) augmente le taux d'activation a 7 jours |
| **Variante A (controle)** | Dashboard standard sans guidance |
| **Variante B** | Dashboard avec checklist d'onboarding (3-5 etapes) |
| **Metrique primaire** | Taux d'activation a 7 jours (au moins 1 recette creee + 1 session IA) |
| **Metriques secondaires** | Nombre d'etapes completees, time-to-first-recipe |
| **Metrique guardrail** | Taux de churn a 14 jours |
| **Trafic minimum** | ~550 signups/variante (baseline 10 %, MDE 50 %) |
| **Duree estimee** | 4-6 semaines |
| **Outil** | PostHog Feature Flags cote client |

---

### Priorisation

| Priorite | Test | Impact potentiel | Effort |
|----------|------|-------------------|--------|
| 1 | Hero CTA | Eleve | Faible |
| 2 | Affichage prix | Eleve | Faible |
| 3 | Signup SSO vs email | Eleve | Moyen |
| 4 | Onboarding checklist | Eleve | Moyen-Eleve |
| 5 | Landing video | Moyen | Eleve |

---

## 2. Plan Analytics Tracking

### 2.1 Events a tracker

| Event Name | Categorie | Properties | Declencheur |
|------------|-----------|------------|-------------|
| `page_view` | Navigation | page_title, page_path, referrer, utm_source, utm_medium, utm_campaign | Chargement de chaque page |
| `signup_started` | Acquisition | method (email/google) | Ouverture du formulaire signup |
| `signup_completed` | Acquisition | method, plan, source | Signup reussi |
| `login` | Engagement | method, is_returning | Connexion reussie |
| `recipe_created` | Activation | recipe_type, ingredient_count, has_photo | Sauvegarde d'une recette |
| `ai_chat_sent` | Engagement | message_length, is_voice, context (recipe/margin/general) | Envoi d'un message au chat IA |
| `voice_command` | Engagement | command_type, success (true/false), language | Utilisation commande vocale |
| `order_created` | Revenue | order_total, supplier, item_count | Creation d'une commande fournisseur |
| `margin_calculated` | Activation | recipe_id, margin_percent, food_cost_percent | Calcul de marge affiche |
| `subscription_started` | Revenue | plan, price, trial (true/false) | Debut d'abonnement |
| `subscription_cancelled` | Churn | reason, days_active, plan | Annulation abonnement |
| `onboarding_step_completed` | Activation | step_number, step_name | Completion d'une etape onboarding |
| `cta_hero_clicked` | Acquisition | button_text, page | Clic sur CTA hero |
| `pricing_page_viewed` | Acquisition | source, plan_highlighted | Vue page tarifs |
| `feature_used` | Engagement | feature_name (scale, pdf_export, team_invite) | Utilisation d'une feature |

---

### 2.2 Funnels

#### Funnel principal : Visit -> Revenue

```
visit (page_view landing)
  -> signup_started
    -> signup_completed
      -> recipe_created (activation)
        -> subscription_started (revenue)
          -> recipe_created x10 (retention)
```

#### Funnel detaille

| Etape | Event | Taux cible |
|-------|-------|------------|
| 1. Visite | `page_view` (landing) | 100 % |
| 2. Signup demarre | `signup_started` | > 8 % |
| 3. Signup complete | `signup_completed` | > 70 % du step 2 |
| 4. Premiere recette | `recipe_created` (first) | > 50 % du step 3 |
| 5. Chat IA utilise | `ai_chat_sent` (first) | > 30 % du step 3 |
| 6. Abonnement | `subscription_started` | > 5 % du step 3 |
| 7. Retention M1 | `login` a 30 jours | > 40 % du step 6 |
| 8. Expansion | `feature_used` (team_invite) | > 10 % du step 6 |

---

### 2.3 GA4 Setup recommande

#### Configuration

1. **Creer une propriete GA4** dediee RestauMargin
2. **Data stream** : Web (restaumargin.com)
3. **Enhanced Measurement** : activer page_view, scroll, outbound_click, site_search
4. **Retention des donnees** : 14 mois

#### Custom Events GA4

```javascript
// Signup
gtag('event', 'signup_completed', {
  method: 'google',      // ou 'email'
  plan: 'free_trial'
});

// Recette creee
gtag('event', 'recipe_created', {
  recipe_type: 'plat_principal',
  ingredient_count: 8,
  has_photo: true
});

// Chat IA
gtag('event', 'ai_chat_sent', {
  is_voice: false,
  context: 'recipe'
});

// Commande fournisseur
gtag('event', 'order_created', {
  order_total: 245.50,
  supplier: 'Metro',
  item_count: 12
});

// Abonnement
gtag('event', 'subscription_started', {
  plan: 'pro',
  price: 29,
  trial: true
});
```

#### Conversions a marquer dans GA4

| Conversion | Event | Comptage |
|------------|-------|----------|
| Signup | `signup_completed` | 1 fois par session |
| Activation | `recipe_created` (premier) | 1 fois par utilisateur |
| Abonnement | `subscription_started` | A chaque occurrence |
| Chat IA | `ai_chat_sent` (premier) | 1 fois par utilisateur |

#### Custom Dimensions

| Dimension | Scope | Parametre |
|-----------|-------|-----------|
| Plan utilisateur | User | `user_plan` |
| Methode signup | User | `signup_method` |
| A/B test variant | Session | `ab_variant` |
| Restaurant type | User | `restaurant_type` |

---

### 2.4 Vercel Analytics -- Conversion Goals

#### Web Vitals (automatique)

Vercel Analytics fournit nativement LCP, FID, CLS, TTFB, INP par page.

#### Audiences Vercel

| Audience | Condition | Usage |
|----------|-----------|-------|
| Signups | `page_path = /dashboard` AND `referrer contains /signup` | Mesurer le taux de signup |
| Pricing viewers | `page_path = /pricing` | Mesurer l'interet pricing |
| Activated users | `page_path = /recipes/*` AND `visits > 3` | Identifier les utilisateurs actives |

#### Speed Insights par page cle

| Page | LCP cible | CLS cible |
|------|-----------|-----------|
| `/` (landing) | < 2.5s | < 0.1 |
| `/pricing` | < 2.0s | < 0.1 |
| `/signup` | < 1.5s | < 0.05 |
| `/dashboard` | < 3.0s | < 0.1 |
| `/recipes/[id]` | < 2.5s | < 0.1 |

---

### 2.5 UTM Strategy

#### Conventions de nommage

```
utm_source   : google, linkedin, facebook, newsletter, partner_name
utm_medium   : cpc, organic, email, social, referral
utm_campaign : launch_2026, content_recipes, retargeting_q2
utm_content  : hero_cta, footer_cta, sidebar_banner
```

#### Exemples de liens

```
restaumargin.com/?utm_source=linkedin&utm_medium=social&utm_campaign=launch_2026&utm_content=founder_post

restaumargin.com/?utm_source=newsletter&utm_medium=email&utm_campaign=onboarding_week1&utm_content=recipe_tip
```

---

### 2.6 Validation et Debug

#### Checklist de validation

- [ ] Tous les events se declenchent sur les bons triggers
- [ ] Les proprietes sont correctement remplies
- [ ] Pas de doublons d'events
- [ ] Fonctionne sur mobile et desktop
- [ ] Conversions enregistrees dans GA4
- [ ] Pas de PII dans les proprietes (pas d'email, pas de nom)
- [ ] Consent Mode actif pour RGPD
- [ ] UTM parameters persistent a travers le signup

#### Outils de debug

| Outil | Usage |
|-------|-------|
| GA4 DebugView | Monitoring events en temps reel |
| PostHog Session Replay | Voir les sessions utilisateur |
| Vercel Analytics Dashboard | Web Vitals et audiences |
| Browser DevTools Network tab | Verifier les requetes analytics |

---

### 2.7 Privacy et RGPD

- **Banniere cookie** : Cookiebot ou equivalent, consent avant tout tracking
- **GA4 Consent Mode** : activer `analytics_storage` et `ad_storage` conditionnes
- **Anonymisation IP** : active par defaut dans GA4
- **Retention** : 14 mois max
- **Pas de PII** : jamais d'email, nom, ou telephone dans les events
- **Droit a l'effacement** : processus Supabase pour supprimer les donnees utilisateur
