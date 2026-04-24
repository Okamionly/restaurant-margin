# RGPD — Right to erasure runbook

**SLA : 30 jours** à compter de la requête utilisateur (RGPD art. 17 §1, 3).

## Endpoints utilisateur (self-service)

- `GET  /api/auth/me/export` — dump JSON complet (RGPD art. 20, portabilité)
- `POST /api/auth/me/delete` — anonymisation immédiate du user record

## Pipeline d'effacement complet

`POST /api/auth/me/delete` exécute en synchrone :

1. **User row** : email scrambled (`deleted-<uuid>@deleted.local`), name = "Compte supprimé", `passwordHash` = bcrypt aléatoire 32 bytes, `verificationToken/resetToken` nullify, Stripe IDs nullify, `role = 'deleted'`.
2. **Session courante** : jti revoqué dans `jwt_revoked` + cookie `auth_token` cleared.

À compléter manuellement (J+1 → J+30) :

3. **Stripe** : si `stripeCustomerId` était présent avant l'anonymisation, déclencher `stripe.customers.del(<id>)` côté admin (Stripe garde les paiements, supprime le profil).
4. **Resend audience** : retirer `user.email` original de toutes les listes marketing (pre-deletion email captured by webhook).
5. **Sentry / Logs** : scrubber automatique sur PII (email pattern) appliqué via Sentry `beforeSend`. Les logs >30j sont purgés par rotation.
6. **Backups Supabase** : la PII reste dans les backups jusqu'à expiration (35j Supabase). À l'expiration, l'effacement est complet.
7. **Restaurant data** : conservée pour des raisons légales (factures FR art. 242 nonies A, comptabilité 10 ans). Pas concerné par l'art. 17 §1 e (obligation légale de conservation).

## Auto-vérification

- `prisma.user.findFirst({ where: { email: <original> } })` doit renvoyer null
- `prisma.user.findUnique({ where: { id: <userId> } })` doit renvoyer un row anonymisé
- `prisma.jwtRevoked.findUnique({ where: { jti: <session jti> } })` doit renvoyer un row

## Cas particulier admin

Self-service `/me/delete` refuse `role === 'admin'`. Un admin doit passer par `DELETE /api/auth/users/:id` (qui requiert un autre admin), pour éviter qu'un admin se locked-out sans transition.

## Audit trail

Chaque suppression émet un log `[RGPD DELETE] userId=...` (Vercel logs). Pour conformité, conserver une trace immuable : à terme, `prisma.auditLog` (model à créer).
