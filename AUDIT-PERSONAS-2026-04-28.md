# Audit Personas Multi-Agents — 28 avril 2026

## Méthodologie

4 agents simulent de vrais clients qui testent l'app comme s'ils découvraient le produit :

| Persona | Profil | Mission |
|---|---|---|
| **Karim** (Pizzeria Lyon) | 42 ans, peu tech, 15 min de test | Découverte landing → onboarding → 1ère recette |
| **Sophie** (Bistrot Bordeaux) | 38 ans, tech-savvy, 1h test | Migration 50+ recettes Excel + flow complet recette → marge |
| **Marc** (Serveur kiosk tablette) | Mains farinées, dictée vocale, balance BT | Mobile/tablette + WCAG touch targets |
| **Auditeur cohérence** | Robot QA | Dead links, i18n, calculs dupliqués, endpoints 404 |

---

## 🔴 P0 — BLOCKERS (FIXED dans commit fb315d4)

### #1+2 — Marge calculée FAUSSE pour toute recette multi-portions
- **Détecté par** : Sophie (power user)
- **Impact** : Une recette à 4 portions, prix vente 18€/portion, ingrédients 32€ total → l'app affichait `costPerPortion = 32€` (au lieu de `8€`) et `marge = -14€` (au lieu de `+10€`).
- **Cause** : `api-lib/routes/recipes.ts:27` importait `calculateMargin` (sans nbPortions, stratégie waste additive) au lieu de `calculateRecipeMargin` (avec nbPortions, stratégie waste yield).
- **Fix** : import + appel corrigés. **Commit fb315d4** ✅
- **Sévérité** : LAUNCH-BLOCKER. Sans ce fix, toute recette dans l'app affichait des chiffres délirants → confiance détruite en 1 minute.

### #3 — MenuEngineering classifiait sur la marge absolue (€)
- **Détecté par** : Sophie
- **Impact** : Salade 60% marge classée "Dog" ; foie gras 30% marge classé "Star" — incohérent avec le scatter plot qui affichait pourtant marginPercent en axe Y.
- **Cause** : `MenuEngineering.tsx:610` calculait `avgMarginAmount` puis comparait `item.margin` vs absolu.
- **Fix** : remplacé par `avgMarginPercent` + comparaison `item.marginPercent`. **Commit fb315d4** ✅

---

## 🟠 P1 — IMPORTANT (FIXED dans commit fb315d4)

### #4 — Button size sm 28px → WCAG fail
- **Détecté par** : Marc (kiosk)
- **Impact** : Boutons "Annuler", "Historique", "Voir →" trop petits pour doigts mouillés/farinés.
- **Fix** : `sm` et `md` désormais `min-h-[44px]` (WCAG 2.5.5). **Commit fb315d4** ✅

### #5 — 2 pages orphelines (404 SEO)
- **Détecté par** : Auditeur cohérence
- **Impact** : `BlogPrixDeVente.tsx` et `LogicielMargeRestaurant.tsx` existaient en code mais n'avaient PAS de route → invisibles pour Google et les visiteurs.
- **Fix** : routes `/blog/prix-de-vente-restaurant` et `/logiciel-marge-restaurant` ajoutées. **Commit fb315d4** ✅

### #6 — Duplicate content blog
- **Détecté par** : Auditeur
- **Impact** : `/blog/menu-engineering-boston-matrix` ET `/blog/menu-engineering-boston-matrix-restaurant` rendaient le même composant → pénalité SEO duplicate content.
- **Fix** : la 2e URL redirige (`<Navigate replace>`) vers la canonique. **Commit fb315d4** ✅

---

## 🟡 P2 — DEFERRED (post-launch ou semaine prochaine)

### Onboarding (Karim — verdict 5.3/10)

- **#7 — Récompense trop tardive** : Wizard 6 étapes force à saisir 5+ ingrédients AVANT de voir la 1ère marge. Fix recommandé : à l'étape 1, sélection "Pizzeria" → import auto pack 5 recettes préconfigurées → marge visible en 90s. La logique `handleImportPack` existe déjà dans `OnboardingWizard.tsx`, juste à câbler. **Effort : 1 jour**.

- **#8 — Sidebar overload** : 40 liens dès J+0. Fix sidebar progressive disclosure (déjà SHIPPED commit 72cbef0) — mais améliorer le mode "Starter" pour afficher seulement 4 liens (Recettes, Ingrédients, Dashboard, Aide) tant que l'user n'a pas créé sa 1ère recette. **Effort : 2h**.

- **#9 — Jargon non expliqué** : "Food cost", "coefficient", "fiche technique", "mercuriale" sans tooltips. Tooltip `?` 10 mots chacun. **Effort : 2h**.

- **#10 — Bouton Apple non fonctionnel** : Login.tsx affiche "Continuer avec Apple" qui déclenche un toast "Bientôt disponible". Masquer jusqu'à implémentation. **Effort : 30 min**.

### Cohérence backend (Sophie + Auditeur)

- **#11 — Suppression d'un ingrédient utilisé dans une recette = silencieuse** : DELETE soft-delete sans alerter l'user des recettes impactées. Fix : avant DELETE, vérifier `/api/ingredients/usage` → si usageCount > 0, retourner 409 avec liste recettes. **Effort : 1h**.

- **#12 — Inventory low stock → Recipes pas marquées indisponibles** : aucun cross-link entre stock 0 d'un ingrédient et les recettes l'utilisant. **Effort : 3h**.

- **#13 — Mercuriale prix update → Ingredient.pricePerUnit pas auto-propagé** : la mercuriale a ses propres tables, pas de trigger qui sync vers Ingredient. **Effort : 4h** (logique de sync + tests).

- **#14 — getUnitDivisor dupliqué dans 7 fichiers frontend** : `client/src/utils/units.ts` existe (créé dans audit précédent) mais pas tous les fichiers ont migré. **Effort : 1h** mécanique.

- **#15 — `(cost / sellingPrice) * 100` dupliqué dans 7 fichiers** : créer `client/src/utils/foodCost.ts` avec une seule implémentation. **Effort : 1h**.

### Mobile/Kiosk (Marc — score 6-7/10)

- **#16 — VoiceCommandButton sans feedback de confidence** : en cuisine bruyante, pas de jauge "qualité dictée" ni countdown silence (2s timeout invisible). **Effort : 2h** (lire `event.results[i][0].confidence`).

- **#17 — InlineWeighPanel Tare/Valider trop petits** (28px) → bump à `py-3 min-h-[48px]`. **Effort : 30 min**.

- **#18 — KitchenMode action icons (Edit/Scissors/Trash) sans padding** → wrapper `p-2.5 min-h-[44px]`. Trash devrait avoir confirm dialog. **Effort : 1h**.

- **#19 — MobileBottomNav labels masqués sauf onglet actif** → afficher labels 8px en permanence. **Effort : 30 min**.

### UI/UX cohérence (Auditeur)

- **#20 — Labels boutons : "Sauvegarder" vs "Enregistrer" vs "Valider"** : 3 mots pour la même action sur 16 fichiers. Standardiser sur "Enregistrer" partout. **Effort : 1h** (find+replace).

- **#21 — i18n strings hardcodés** : App.tsx + Dashboard + Recipes + HACCP + Planning + Comptabilite contiennent du français en dur. Migrer vers `t()`. **Effort : 1 jour** par page.

---

## 🚫 FAUX POSITIFS de l'audit

L'auditeur cohérence a claimé "20 endpoints 404 silencieux" mais a cherché dans `server/src/routes/` (qui est vide ou ancien). En réalité :
- `/api/nps` → existe dans `api-lib/routes/nps.ts`
- `/api/admin/*` → mounted via `app.use('/api/admin', adminRoutes)`
- `/api/mercuriale/*` → existe dans `api-lib/routes/mercuriale.ts`
- `/api/referrals/*` → existe dans `api-lib/routes/referrals.ts`
- `/api/public/launch-notify` → ajouté récemment
- `/api/outreach/send` → ajouté récemment

**Réellement 404 (à creuser)** :
- `/api/ai/weekly-report`, `/api/ai/usage` — peut-être routés via `/api/ai/*` mais à vérifier
- `/api/orders/send-email` — à vérifier

---

## Score global avant / après ces fixes

| Critère | Avant audit | Après fixes shippés | Cible launch |
|---|---|---|---|
| Logique métier | 5/10 | **8/10** | 8/10 ✅ |
| Cohérence cross-features | 4/10 | **5/10** | 6/10 |
| UX onboarding | 5/10 | 5/10 | 7/10 (cible J-3) |
| Mobile/Kiosk | 6/10 | **7/10** | 7/10 ✅ |
| SEO | 7/10 | **8/10** | 8/10 ✅ |
| **GLOBAL** | **5.4/10** | **6.6/10** | **7/10** |

---

## Plan d'action restant avant launch (J-7 à J-1)

### J-7 (29 avril) — UX onboarding (priorité absolue)
1. **Auto-import pack onboarding** (#7) — déclenche `handleImportPack` dès sélection type resto.
2. **Bouton Apple masqué** (#10) — 30 min.
3. **Tooltips métier** (#9) — 2h sur 5 termes clés.

### J-3 (3 mai) — Cohérence
4. **Suppression ingrédient avec check usage** (#11) — 1h.
5. **Labels boutons standardisés** (#20) — 1h.
6. **getUnitDivisor + foodCost utilities** (#14, #15) — 2h.

### J-1 (5 mai) — Polish mobile
7. **VoiceCommandButton confidence** (#16) — 2h.
8. **InlineWeighPanel touch targets** (#17) — 30 min.
9. **MobileBottomNav labels permanents** (#19) — 30 min.

### Post-launch (semaine 1-2)
- Tout le reste (#8, #12, #13, #18, #21) — non bloquant pour launch PH.

---

*Audit consolidé le 2026-04-28. 4 personas, 4 sessions parallèles, 21 findings, 6 fixes shippés.*
