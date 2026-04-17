# Growth Billing

Stripe, emails marketing, agents de croissance automatisés, parrainage.

## Scope
- **Stripe dans `api/index.ts`** : webhook `/api/stripe/webhook` (avant `express.json()`), route checkout, route portal client — ces sections restent dans `index.ts` même après le découpage backend-api
- `client/src/pages/Subscription.tsx` — page abonnement in-app (plans Pro/Business, tableau comparatif, CTA checkout)
- `client/src/pages/Pricing.tsx` — page publique tarifs (partagée avec seo-marketing pour le contenu, mais les CTA Stripe sont sous scope growth-billing)
- `scripts/agents/email-sequence.ts` — séquence email automatisée J+0/J+3/J+7/J+14 (Resend, log dans `data/agents/`)
- `scripts/agents/health-check.ts` — monitoring santé du service
- `scripts/agents/lead-finder.ts` — discovery de leads
- `scripts/agents/market-intelligence.ts` — veille marché
- `scripts/agents/sentry-monitor.ts` — monitoring erreurs
- `scripts/agents/runner.ts` — orchestrateur des agents
- `scripts/send-campaign.ts`, `scripts/send-personalized-campaign.ts`, `scripts/send-relance.ts`, `scripts/send-remaining-campaign.mjs` — scripts d'envoi campagnes email manuels
- `scripts/scrape-gmaps.ts`, `scripts/scrape-pagesjaunes.ts`, `scripts/scrape-restaurants.ts`, `scripts/scrape-scrapling.py` — scraping leads
- `prisma/schema.prisma` modèle `Referral` (champs : `referrer_id`, `referred_email`, `status`, `reward`) — à créer via migration Prisma
- `docs/email-sequences.md`, `docs/referral-program.md`

## Décisions clés
- **Plans Stripe LIVE** : Pro mensuel 29€, Pro annuel 23€/mois (278€/an), Business mensuel 79€, Business annuel 63€/mois (758€/an). Les 4 price IDs sont en mode LIVE. Ne jamais modifier les prix dans `Subscription.tsx` sans vérifier les price IDs Stripe correspondants.
- **Flow activation** : `checkout.session.completed` → création d'un `ActivationCode` dans la DB → email Resend avec le code → l'utilisateur entre le code à l'inscription. Ce double flux (Stripe + activation code) est intentionnel pour permettre les inscriptions hors-ligne. Le `metaUserId` dans `session.metadata` permet la mise à jour directe du user si disponible.
- **Downgrade** : `customer.subscription.deleted` → `plan = 'basic'`, `stripeSubId = null`. `invoice.payment_failed` → log only (pas de downgrade immédiat, Stripe retry).
- **`customer.subscription.updated`** : cet event n'est pas encore géré dans le webhook (à implémenter). Il couvre les upgrades/downgrades de plan via le portail Stripe.
- **Email sequence** : stocke un log JSON dans `data/agents/sequence-YYYY-MM-DD.json`. Les étapes sont `intro | relance | testimonial | last-chance`. Le sent-log global est `data/campaigns/sent-log.json`. Rate limit interne : 1 email / 1.2 secondes (`RATE_LIMIT_MS = 1200`).
- **Programme parrainage** : défini dans `docs/referral-program.md`. Double-sided : 1 mois gratuit parrain + 15% réduction filleul. Déclenché quand le filleul reste abonné 2 mois. La table `Referral` n'existe pas encore en DB (migration Prisma à créer). La page `/parrainage` publique n'existe pas encore.

## Conventions
- Le webhook Stripe doit toujours être le premier endpoint monté dans `index.ts` (avant `express.json()`). Ne pas déplacer.
- Les scripts agents dans `scripts/agents/` sont exécutés via `npx tsx`. Le `runner.ts` les orchestre. Tous ont une option `--dry-run`.
- Les campagnes email utilisent `Resend` avec from `RestauMargin <contact@restaumargin.fr>`. Les templates HTML sont dans `api/utils/emailTemplates.ts`.
- La page `Subscription.tsx` lit `useAuth()` pour afficher l'usage actuel (`plan`, quota IA). Elle ne fait pas de fetch supplémentaire — les données sont dans le contexte auth.
- Toute modification des prix dans `Subscription.tsx` ou `Pricing.tsx` doit être synchronisée avec les price IDs Stripe et avec `docs/referral-program.md`.

## Dépendances avec autres tentacules
- **backend-api** : le webhook Stripe reste dans `api/index.ts`, géré par backend-api structurellement, mais la logique métier est ownership de growth-billing. Coordonner si refactor.
- **ia-engine** : le weekly-report (endpoint IA) est envoyé par email aux abonnés Business — coordonner la migration en job async.
- **seo-marketing** : `Pricing.tsx` est une page publique (SEO) avec des CTA Stripe (growth-billing). Les deux départements doivent se coordonner sur les modifications de cette page.
- **frontend-pages** : `Subscription.tsx` est une page interne — routing dans `App.tsx` géré par frontend-pages. La route `/parrainage` à créer doit être ajoutée par frontend-pages.
