# Roadmap post-launch RestauMargin

État : **6 mai 2026** — launch Product Hunt programmé. Tous les bugs critiques shippés. Cette roadmap liste ce qui reste à faire en post-launch.

---

## ✅ Fait dans la session 2026-04-28

### Critique (sécurité + correctness)
- Fix calculateMargin → calculateRecipeMargin (bug marge multi-portions)
- Fix MenuEngineering classifie sur marginPercent (pas margin absolu)
- Fix inventory minQuantity → minStock (alertes lowStock cassées en prod)
- Fix Suppliers comparator (revert mon faux fix qui multipliait par 1000)
- Fix ai.ts ternaire identique (économie API 60-80% via Haiku par défaut)
- Fix IDOR cross-tenant inventory PUT/restock
- Fix quota IA uniforme sur 19 endpoints (avant : 4)
- Fix HTML escape + rate limit launch-notify
- Fix recipes.ts PUT NaN sur PATCH partiel
- Fix Unicode escapes dans 14 fichiers (€, é, ç affichés en dur)

### Cohérence cross-features
- Endpoint POST /api/services/close avec décrément stock atomique
- Endpoint POST /api/mercuriale/publications/:id/apply-to-ingredients (sync prix)
- Auto-reorder enrichi : `portionsPossibles` + `recipesUsing`
- Sidebar progressive disclosure (Messages + Commandes en PRINCIPAL)
- Onboarding auto-import pack au step 1 (récompense en 90s vs 6 min)

### UX + qualité
- Bouton "Continuer avec Apple" caché (CTA fake retiré)
- Composant `GlossaryTooltip` créé (5 termes métier : food cost, coefficient, marge brute, fiche technique, mercuriale)
- 6 fakes/mocks retirés (Settings sessions/billing/usage, EmailMarketing campaigns, FournisseurPromo, Suppliers OrderTimeline + priceAlerts + monthlySpend, RecipeDetail priceHistory + modificationLog)
- Date-pin claude-haiku-4-5-20251022

### Refactor architecture
- API split round 1-3 : `ingredients.ts`, `recipes.ts`, `inventory.ts`, `services.ts` (api/index.ts : 6432 → 6021 lignes)
- `useApiClient` hook + 32 fichiers migrés (DRY auth)
- Design tokens : 130 fichiers migrés (top 13 hex → mono-*)
- 5 tests régression sur calculateRecipeMargin

---

## 🟠 P1 — Semaine 1-2 post-launch

### HACCP propagation (audit cohérence #6)
- **Problème** : ingrédient périmé HACCP reste utilisable en KitchenMode
- **Effort** : 1 jour (migration DB + endpoint + UI)
- **Steps** :
  1. Migration Prisma : `InventoryItem.available: Boolean @default(true)`
  2. Cron qui passe `available: false` quand DLUO < today
  3. Endpoint `PATCH /api/inventory/:id/availability`
  4. Filtre KitchenMode pour cacher recettes contenant ingrédients `available: false`

### Scanner factures → Mercuriale sync (audit cohérence #10)
- **Problème** : InvoiceScanner update `Ingredient.pricePerUnit` mais pas mercuriale_prices
- **Effort** : 2-3h
- **Steps** :
  1. Dans `InvoiceScanner.tsx` après `updateIngredient()`, appeler aussi `POST /api/mercuriale/prices` avec source: 'facture-scan'
  2. Ajouter UI "Voir prix mercuriale" sur facture scannée

### Planning labor cost sync (audit cohérence #7)
- **Problème** : Planning calcule un coût horaire, mais Recipe.laborCostPerHour saisi à la main
- **Effort** : 3-4h
- **Steps** :
  1. Endpoint `GET /api/planning/labor-rate?week=YYYY-WW`
  2. Recipes form pre-fill `laborCostPerHour` depuis cette source
  3. Toggle "Utiliser tarif planning" vs "Tarif manuel"

---

## 🟡 P2 — Mois 1-2 post-launch

### Refactors gros
- **`Recipes.tsx` 4386 lignes** → split en `RecipeList`, `RecipeForm`, `RecipeFilters` sous-composants. **Effort : 2-3 jours**.
- **`Suppliers.tsx` 3718 lignes** → idem. **Effort : 2 jours**.
- **`api/index.ts` 6021 lignes** → split haccp/planning/reports/orders/auth en modules (pattern existe). **Effort : 2 jours**.
- **1379 raw `<button>` non-Button component** → migration incrémentale page par page. **Effort : 1 sem**.
- **4264 hex hardcodés restants** → script `migrate-tokens.mjs` extension + visual review. **Effort : 1-2 jours**.

### Code quality
- **146 occurrences `: any` + 52 casts `as any`** → typer correctement. **Effort : 1 sem**.
- **i18n strings hardcodés** dans App.tsx + Dashboard + Recipes + HACCP + Planning + Comptabilite → migrer vers `t()`. **Effort : 1 jour par page**.

### Monitoring
- Sentry + alerting Slack/PagerDuty + runbook basique. **Effort : 1 jour**.
- Tests intégration sur 187 routes API critiques (recettes, marges, HACCP). **Effort : 1 sem**.

### UX polish
- Mobile/Kiosk : `VoiceCommandButton` confidence score + countdown. **Effort : 2h**.
- Mobile : `InlineWeighPanel` Tare/Valider touch targets 48px. **Effort : 30 min**.
- Mobile : `KitchenMode` action icons 44px + Trash confirm dialog. **Effort : 1h**.
- Sidebar starter mode (4 liens default day-1, progression). **Effort : 3h**.
- Apply `GlossaryTooltip` partout où les 5 termes métier apparaissent. **Effort : 2h**.
- "Déconnecter tous les appareils" Settings → implémenter `POST /api/auth/logout-all`. **Effort : 2h**.

---

## 🔴 P3 — Mois 2-3

### Tech debt long
- Migration complète vers tokens design system (zéro hex hardcodé)
- Refactor toutes les pages > 1000 lignes
- 100% coverage backend
- E2E Playwright sur 20+ user flows critiques
- Performance : LCP < 2.5s mobile 3G, TTI < 5s

### Features nouvelles (post-PMF)
- Multi-langue active (EN, ES, AR, DE déjà préparés mais incomplets)
- Mobile app native (Tauri ou React Native)
- Intégration POS (Toast, Square, Lightspeed) via webhooks
- Marketplace fournisseurs avec commande directe in-app

---

## 🚫 Pas dans cette roadmap

- Auth flow / passwordHash / Stripe (production stable)
- WeighStation / Hardware kit (validé)
- Logo, palette, theme W&B (validé)
- Aucune migration DB Supabase non documentée

---

*Document mis à jour 2026-04-28 après vague d'audit + révision multi-agents.*
