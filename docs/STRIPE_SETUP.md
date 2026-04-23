# Stripe Setup Guide — RestauMargin

Guide complet pour activer Stripe Live, configurer les webhooks signés, et activer Stripe Tax FR.

---

## 1. Variables d'environnement requises sur Vercel

Aller dans Vercel Dashboard > Project Settings > Environment Variables.

| Variable | Valeur | Obtenir ici |
|---|---|---|
| `STRIPE_SECRET_KEY` | `sk_live_...` | Stripe Dashboard > Developers > API keys |
| `STRIPE_PUBLISHABLE_KEY` | `pk_live_...` | Stripe Dashboard > Developers > API keys |
| `STRIPE_WEBHOOK_SECRET` | `whsec_...` | Stripe Dashboard > Developers > Webhooks (après création endpoint) |
| `STRIPE_PRICE_PRO_MONTHLY` | `price_...` | Stripe Dashboard > Products |
| `STRIPE_PRICE_PRO_ANNUAL` | `price_...` | Stripe Dashboard > Products |
| `STRIPE_PRICE_BUSINESS_MONTHLY` | `price_...` | Stripe Dashboard > Products |
| `STRIPE_PRICE_BUSINESS_ANNUAL` | `price_...` | Stripe Dashboard > Products |

**IMPORTANT** : Ajouter toutes ces variables pour les environments `Production` et `Preview`.

Après avoir ajouté les variables, **Redeploy** le projet Vercel (sans cache).

---

## 2. Activer les clés Live Stripe

1. Aller sur [dashboard.stripe.com/developers/apikeys](https://dashboard.stripe.com/developers/apikeys)
2. S'assurer que le toggle "View test data" est **desactivé** (mode Live)
3. Copier `Publishable key` (pk_live_...) et `Secret key` (sk_live_...)
4. Coller dans Vercel Environment Variables

Le compte Stripe existant est : `acct_1TCSG73Y5IoWMA5k` (activation 1-2h max).

---

## 3. Configurer le Webhook Endpoint

### 3.1 Créer l'endpoint

1. Aller sur [dashboard.stripe.com/webhooks](https://dashboard.stripe.com/webhooks)
2. Cliquer "Add endpoint"
3. URL de l'endpoint : `https://www.restaumargin.fr/api/stripe/webhook`
4. Sélectionner les événements suivants :

```
checkout.session.completed
customer.subscription.created
customer.subscription.updated
customer.subscription.deleted
invoice.paid
invoice.payment_failed
invoice.payment_action_required
customer.subscription.trial_will_end
```

5. Cliquer "Add endpoint"
6. Sur la page du webhook, cliquer "Reveal" sous "Signing secret"
7. Copier la valeur `whsec_...` dans `STRIPE_WEBHOOK_SECRET` sur Vercel

### 3.2 Vérifier la signature (déjà implémenté)

Le webhook handler dans `api/index.ts` vérifie déjà la signature Stripe quand `STRIPE_WEBHOOK_SECRET` est présente :

```typescript
event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
```

**Risque actuel** : si `STRIPE_WEBHOOK_SECRET` est absent, le handler fallback sur `JSON.parse` sans vérification. Ce fallback doit être supprimé en production (voir section 7).

---

## 4. Créer les produits et prix Stripe

### 4.1 Produit Pro (29€/mois)

```
Nom : RestauMargin Pro
Prix mensuel : 29.00 EUR / mois (recurring)
Prix annuel  : 278.00 EUR / an (= 29 x 12 x 0.80 — remise 20%)
Metadata : planType = pro
```

### 4.2 Produit Business (79€/mois)

```
Nom : RestauMargin Business
Prix mensuel : 79.00 EUR / mois (recurring)
Prix annuel  : 758.00 EUR / an (= 79 x 12 x 0.80 — remise 20%)
Metadata : planType = business
```

Après création, copier les `price_...` IDs dans les variables Vercel correspondantes.

---

## 5. Activer Stripe Tax (TVA 20% France)

### 5.1 Activer Stripe Tax

1. Aller sur [dashboard.stripe.com/tax](https://dashboard.stripe.com/tax)
2. Cliquer "Get started with Stripe Tax"
3. Renseigner l'adresse fiscale de l'entreprise (France)
4. Activer "Automatic tax collection"

### 5.2 Configurer le produit comme taxable

Pour chaque produit (Pro et Business) :
1. Ouvrir le produit dans Stripe Dashboard
2. Sous "Tax", sélectionner `txcd_10000000` (Software as a Service)
3. Sauvegarder

### 5.3 Impact DGFiP

Sans Stripe Tax activé : les factures émises ne comportent pas de TVA = risque redressement DGFiP.
La TVA applicable en France sur les SaaS B2B est **20%** (art. 259 B CGI).
Pour les clients EU hors FR : OSS (One Stop Shop) géré automatiquement par Stripe Tax.

---

## 6. Activer le Customer Portal (self-service)

1. Aller sur [dashboard.stripe.com/settings/billing/portal](https://dashboard.stripe.com/settings/billing/portal)
2. Activer les options :
   - Allow customers to update payment methods
   - Allow customers to cancel subscriptions
   - Allow customers to switch plans
3. Cliquer "Save"
4. Copier l'URL de configuration (pour le lien "Gérer mon abonnement" dans l'app)

---

## 7. Activer Smart Retries (Dunning automatique)

1. Aller sur [dashboard.stripe.com/settings/billing/automatic-collection](https://dashboard.stripe.com/settings/billing/automatic-collection)
2. Activer "Smart Retries"
3. Configurer la séquence : J+1 / J+3 / J+7 (défaut Stripe)
4. Activer "Send emails to customers" pour les paiements échoués

Les templates email dunning FR sont dans `api/utils/emailTemplates.ts` (fonctions `buildDunningJ1Email`, `buildDunningJ3Email`, `buildDunningJ7Email`).

---

## 8. Tester avec Stripe CLI

```bash
# Installer Stripe CLI
# https://stripe.com/docs/stripe-cli

# Login
stripe login

# Forwarder les webhooks en local
stripe listen --forward-to localhost:3001/api/stripe/webhook

# Dans un autre terminal, tester les événements
stripe trigger checkout.session.completed
stripe trigger invoice.payment_failed
stripe trigger customer.subscription.deleted
stripe trigger customer.subscription.trial_will_end
```

---

## 9. Checklist activation Live

- [ ] `STRIPE_SECRET_KEY` sk_live_ ajoutée sur Vercel (Production + Preview)
- [ ] `STRIPE_PUBLISHABLE_KEY` pk_live_ ajoutée sur Vercel
- [ ] `STRIPE_WEBHOOK_SECRET` whsec_ ajoutée sur Vercel
- [ ] Webhook endpoint créé sur dashboard.stripe.com avec URL prod
- [ ] Tous les événements webhook sélectionnés (8 events listés section 3.1)
- [ ] Produit Pro créé avec prix mensuel + annuel
- [ ] Produit Business créé avec prix mensuel + annuel
- [ ] Price IDs ajoutés dans variables Vercel
- [ ] Stripe Tax activé + produits marqués taxables (SaaS txcd_10000000)
- [ ] Customer Portal activé
- [ ] Smart Retries activés
- [ ] Test avec `stripe trigger checkout.session.completed` validé
- [ ] Redeploy Vercel effectué après ajout des variables
- [ ] Premier paiement test Live effectué (1€ ou montant réel)

---

## 10. Sécurisation webhook en production

Supprimer le fallback non-signé dans `api/index.ts` (lignes 49-52) :

```typescript
// SUPPRIMER ce bloc en production :
} else {
  console.warn('[STRIPE WEBHOOK] WARNING: No STRIPE_WEBHOOK_SECRET configured, skipping signature verification');
  event = JSON.parse(req.body.toString());
}
```

Remplacer par :

```typescript
} else {
  console.error('[STRIPE WEBHOOK] FATAL: STRIPE_WEBHOOK_SECRET not configured — rejecting request');
  return res.status(401).send('Webhook secret not configured');
}
```

---

## Contacts support

- Stripe support (FR) : [support.stripe.com](https://support.stripe.com)
- Documentation Stripe Tax : [stripe.com/docs/tax](https://stripe.com/docs/tax)
- Documentation Webhooks : [stripe.com/docs/webhooks](https://stripe.com/docs/webhooks)
