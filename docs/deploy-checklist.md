# RestauMargin - Checklist Pre-Deploy

> A executer avant chaque `vercel --prod`

## Build

- [ ] Build frontend sans erreur (`cd client && npm run build`)
- [ ] Build backend sans erreur TypeScript

## Variables d'environnement

- [ ] Variables Vercel verifiees :
  - [ ] `DATABASE_URL` (Supabase connection string)
  - [ ] `JWT_SECRET` (secret fort, PAS le fallback hardcode)
  - [ ] `ANTHROPIC_API_KEY` (cle API Claude)
  - [ ] `RESEND_API_KEY` (envoi d'emails)

## Base de donnees

- [ ] Migrations DB executees sur Supabase (`npx prisma migrate deploy`)

## Tests manuels

- [ ] Test login / register (creation compte + connexion)
- [ ] Test creation recette + ajout ingredient
- [ ] Test chat IA (envoi message + execution action)
- [ ] Test mercuriale (donnees affichees correctement)

## UI / UX

- [ ] Verifier landing page responsive (mobile + tablette)
- [ ] Verifier console Chrome : 0 erreurs, 0 warnings critiques

## Git / Deploy

- [ ] Git commit propre, branche a jour
- [ ] Pas de fichiers `.env` commites (`git status` propre)
- [ ] Vercel deploy `--prod` reussi
- [ ] Verifier URL de production apres deploy (navigation, login)

---

## Post-Deploy

- [ ] Verifier les logs Vercel (pas d'erreurs 500)
- [ ] Tester le login sur l'URL de production
- [ ] Verifier que le chat IA repond correctement
