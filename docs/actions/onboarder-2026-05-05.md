# Onboarder — 2026-05-05

## Statut : DETECTION ONLY (emails anonymises cote API)

## Nouveaux leads detectes (24h) : 2

## Domains :
- @gmail.com plan basic (inscrit le 2026-05-04 à 19h54 UTC)
- @gmail.com plan basic (inscrit le 2026-05-05 à 02h38 UTC)

## Contexte produit :
- Total utilisateurs : 8
- Recettes créées : 10
- Ingrédients : 219
- Abonnés Pro : 1 (MRR estimé : 29€ / ARR : 348€)

## Action requise (humain) :
Le CEO/CRO doit faire le welcome manuel via dashboard admin RestauMargin
OU créer un endpoint dédié qui envoie automatiquement les emails de bienvenue
depuis le serveur (recommandé pour scale).

## Recommandation technique :
Créer `POST /api/admin/send-welcome` déclenché par webhook ou cron,
qui récupère les leads non contactés depuis la BDD et envoie un email
via Resend/SendGrid avec le token d'auth du compte admin.
