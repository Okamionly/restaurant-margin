# SOP · Deploy en production

**Trigger :** Merge d'une PR sur `main` après review  
**Qui :** Fondateur (Youssef) ou Dev Senior (quand en poste)  
**Timing :** Hors heures de pointe (éviter 11h30–14h et 18h30–22h)  
**Outputs :** Déploiement Vercel live, sanity check passé, log dans Notion

---

## Étapes

### 1. Pré-checks avant merge (5 min)

- [ ] CI GitHub Actions verte (`npm run build` + `npm test` passent)
- [ ] Pas de migration Prisma non-reviewée (check `prisma/migrations/`)
- [ ] Variables d'environnement ajoutées dans Vercel si nouvelle feature les nécessite
- [ ] PR reviewée et approuvée (même par soi-même avec relecture à froid 24h après)

### 2. Merge sur main

```bash
# Sur GitHub : "Squash and merge" pour garder l'historique propre
# Message de commit : feat|fix|chore: description courte
```

### 3. Watch le build Vercel (3–8 min)

- Ouvrir https://vercel.com/dashboard → projet `restaurant-margin`
- Vérifier que le build passe sans warning critique
- Si build échoue : **ne pas paniquer**, Vercel garde l'ancienne version live

### 4. Sanity check post-deploy (10 min)

Tester les 5 flows critiques sur la version prod :

- [ ] **Auth** : Login avec `Mr.guessousyoussef@gmail.com` → Dashboard charge
- [ ] **Fiche recette** : Créer une recette test → calcul marge correct
- [ ] **Billing** : Page `/subscription` charge sans erreur 500
- [ ] **WeighStation** : Page `/station` accessible (ne pas tester balance physique)
- [ ] **API health** : `GET /api/health` → `{ status: "ok" }`

### 5. Si migration Prisma impliquée

```bash
# ATTENTION : action irréversible sur la DB prod
# Toujours faire un backup Supabase avant
# Dashboard Supabase → Database → Backups → "Create backup"

# Puis dans Vercel, via les Build Logs ou en CLI :
npx prisma migrate deploy
```

### 6. Communication (si breaking change)

- Poster dans Notion "Changelog" : date, résumé des changements, fonctionnalités affectées
- Si clients peuvent être impactés : email proactif via Resend

### 7. Rollback si nécessaire

- Vercel → projet → Deployments → clic sur le déploiement précédent → "Promote to Production"
- Rollback est immédiat (< 30 secondes)
- Log l'incident dans Notion avec root cause

---

## Contacts urgents

| Situation | Contact |
|-----------|---------|
| DB Supabase down | support.supabase.com (SLA 99.9%) |
| Vercel incident | vercel.com/status |
| Stripe webhook cassé | dashboard.stripe.com → Webhooks → redeliver |
| Emails Resend down | resend.com/status |

---

**Dernière mise à jour :** 2026-04-23  
**Owner :** Youssef Guessous
