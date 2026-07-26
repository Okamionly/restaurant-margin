# Onboarder — 2026-07-26

## Statut : DETECTION ONLY (emails anonymises cote API)

## Nouveaux leads detectes (24h) : 1

## Domains :
- @gmail.com plan basic

## Contexte :
- Lead inscrit le : 2026-07-25T16:27:56Z
- Plan : basic (gratuit)
- Total utilisateurs plateforme : 19
- Abonnés Pro : 1 (MRR estimé : 29€)

## Action requise (humain) :
Le CEO/CRO doit faire le welcome manuel via dashboard admin RestauMargin
OU on cree un endpoint dedie qui envoie automatiquement les emails de bienvenue depuis le serveur (recommande pour scale).

## Recommandation scale :
Avec 19 users et 1 lead/jour, envisager un webhook Supabase → email automatique
(ex: Resend ou Postmark) pour ne plus manquer d'onboarding.
