# Stripe Setup — RestauMargin Production

Guide d'activation complet pour passer Stripe en mode Live, sécuriser le webhook et activer Stripe Tax FR + Customer Portal + Smart Retries.

**Compte Stripe** : `acct_1TCSG73Y5IoWMA5k` (MarketPhase)
**Endpoint webhook prod** : `https://www.restaumargin.fr/api/stripe/webhook`

---

## Checklist 15 points

### A. Environment variables (Vercel)

- [x] 1. `STRIPE_SECRET_KEY` = `sk_live_...` (Production, Sensitive ON) — **set le 2026-04-23**
- [x] 2. `VITE_STRIPE_PUBLISHABLE_KEY` = `pk_live_...` (Production, Sensitive ON) — **set le 2026-04-23**
- [ ] 3. `STRIPE_WEBHOOK_SECRET` = `whsec_...` (Production, Sensitive ON) — **à créer après endpoint webhook**
- [ ] 4. Redeploy Vercel Production pour appliquer les 3 vars (via bouton "Redeploy" ou nouveau commit)

### B. Stripe Dashboard — sécurité webhook

- [ ] 5. Créer l'endpoint webhook sur `dashboard.stripe.com/webhooks` en mode Live
  - URL : `https://www.restaumargin.fr/api/stripe/webhook`
  - Description : `RestauMargin production`
- [ ] 6. Cocher les 8 events à écouter :
  - `checkout.session.completed`
  - `customer.subscription.created`
  - `customer.subscription.updated`
  - `customer.subscription.deleted`
  - `invoice.payment_succeeded`
  - `invoice.payment_failed`
  - `customer.subscription.trial_will_end`
  - `payment_intent.succeeded`
- [ ] 7. Récupérer le signing secret et le setter dans Vercel (étape 3)

### C. Stripe Tax FR (compliance DGFiP)

- [ ] 8. `dashboard.stripe.com/settings/tax` → activer Stripe Tax
- [ ] 9. Configurer l'origine fiscale : France, SIRET de la SASU
- [ ] 10. Activer TVA 20% par défaut sur les produits abonnement Pro / Business / Enterprise

### D. Customer Portal

- [ ] 11. `dashboard.stripe.com/settings/billing/portal` → activer Customer Portal
- [ ] 12. Configurer : permettre update carte, annulation, historique factures, mise à jour email
- [ ] 13. Custom branding : logo RestauMargin + couleurs (#8B5CF6 / #00FF88)

### E. Smart Retries (recovery paiements échoués)

- [ ] 14. `dashboard.stripe.com/settings/billing/automatic` → activer Smart Retries
- [ ] 15. Configurer dunning emails Stripe (en complément du dunning custom J+1/J+3/J+7 côté app)

---

## Vérification post-activation

Après les 15 étapes, tester en production :

```bash
# 1. Webhook signature (doit renvoyer 400 sans signature)
curl -X POST https://www.restaumargin.fr/api/stripe/webhook \
  -H "Content-Type: application/json" \
  -d '{"type":"test"}'
# Attendu : HTTP 400 "Missing stripe-signature header"

# 2. Health check backend
curl https://www.restaumargin.fr/api/health
# Attendu : {"status":"healthy",...}

# 3. Test trial signup end-to-end depuis incognito
# /pricing → Pro → email test → confirmer que trial 14j démarre
```

---

## Événements Stripe → actions app

| Event | Handler backend | Action utilisateur |
|---|---|---|
| `checkout.session.completed` | Upgrade user plan (trial → paid) | Compte activé, email confirmation |
| `customer.subscription.created` | Log subscription, setup features | Accès features premium |
| `customer.subscription.updated` | Sync plan changes | Upgrade/downgrade tier |
| `customer.subscription.deleted` | Downgrade user | Accès readonly, email winback |
| `invoice.payment_succeeded` | Confirm payment, extend period | Email facture |
| `invoice.payment_failed` | Trigger dunning J+1 | Email relance |
| `customer.subscription.trial_will_end` | Notify user (3j before) | Email "trial bientôt fini" |
| `payment_intent.succeeded` | Log one-off payments | - |

---

## TVA & facturation FR (art. 242 nonies A CGI)

- Numérotation séquentielle : `FAC-YYYY-NNNNNN` (via `api/utils/invoiceNumbering.ts`)
- Mentions obligatoires : SIRET, TVA intracommunautaire, pénalités de retard (40€ forfaitaires), rétention 10 ans
- Stripe Tax FR gère la collecte TVA 20% automatiquement
- Autoliquidation EU B2B : détection via VAT ID (pas de TVA facturée)

---

## Sécurité

- **Jamais** de clé Live en dev/staging (utilise `sk_test_...` sur Vercel preview)
- **Jamais** de `STRIPE_WEBHOOK_SECRET` committé dans le repo
- Rotation des clés : trimestrielle (avril / juillet / octobre / janvier)
- Toggle `Sensitive` ON sur Vercel pour les 3 vars Stripe
- Monitoring webhook failures : Sentry (à activer par CTO)

---

## Rollback plan

Si problème post-activation Live :

1. Vercel → désactiver `STRIPE_SECRET_KEY` temporairement
2. Stripe Dashboard → désactiver l'endpoint webhook
3. Bascule en Test mode pour debug
4. Merger fix, puis réactiver séquentiellement

---

*Document maintenu par l'équipe CFO. Prochaine revue : trimestrielle ou après incident.*
