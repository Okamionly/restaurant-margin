# Backlog — growth-billing

## 1. Brancher le webhook customer.subscription.updated
Ajouter dans le bloc switch de `/api/stripe/webhook` la gestion de `customer.subscription.updated`. Récupérer `subscription.items.data[0].price.id`, mapper vers le plan correspondant (`pro` ou `business`), mettre à jour `user.plan` en DB. Tester avec Stripe CLI (`stripe trigger customer.subscription.updated`).

## 2. Créer la migration Prisma pour le modèle Referral
Le modèle `Referral` est défini dans `docs/referral-program.md` mais absent de `prisma/schema.prisma`. Ajouter le modèle : `id`, `referrerId` (FK → User), `referredEmail`, `status` (enum : pending/active/rewarded), `reward`, `createdAt`. Générer et appliquer la migration Supabase.

## 3. Créer les routes API parrainage dans api/routes/auth.ts ou nouveau fichier
Routes nécessaires : `POST /api/referrals/generate-code` (génère un code unique pour l'user), `POST /api/referrals/track` (enregistre un filleul à l'inscription), `GET /api/referrals/stats` (compte parrainages validés de l'user). Protéger avec `authMiddleware`.

## 4. Créer la page /parrainage publique côté frontend
Page React listant les avantages du programme (1 mois gratuit parrain, 15% filleul), avec affichage du code de parrainage de l'user connecté et compteur de parrainages validés. Coordonner avec frontend-pages pour la route dans `App.tsx`. Utiliser le design W&B standard.

## 5. Tester le flow Stripe end-to-end en LIVE
Tester les 4 cas : checkout Pro mensuel, checkout Business annuel, portail client (changement de plan), annulation. Utiliser Stripe CLI pour simuler les webhooks. Vérifier que `user.plan`, `stripeCustomerId`, `stripeSubId` sont corrects après chaque event. Logger les résultats dans `docs/sprints/`.

## 6. Automatiser le script email-sequence via runner.ts
`email-sequence.ts` s'exécute manuellement. L'intégrer dans `scripts/agents/runner.ts` avec un schedule cron (10h quotidien). Vérifier que le `SENT_LOG_FILE` (`data/campaigns/sent-log.json`) est accessible et non corrompu avant chaque run. Ajouter une alerte Sentry si l'agent échoue.

## 7. Mettre en place le test A/B sur la page Pricing
`docs/ab-tests-analytics.md` mentionne des tests A/B. Implémenter un test simple sur le CTA de `Pricing.tsx` (texte "Commencer l'essai gratuit" vs "Voir les plans") avec tracking côté client via un event custom. Stocker la variante dans `localStorage` et envoyer l'event via `/api/analytics/track` (si la route existe) ou Google Analytics.
