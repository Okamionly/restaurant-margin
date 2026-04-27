# Audit RestauMargin — Synthèse 28 avril 2026

3 audits parallèles : **CPO** (UX/Product), **CTO** (Engineering), **Design Reviewer** (Design + a11y).

## Scores consolidés

| Axe | Score | Verdict |
|---|---|---|
| Architecture | 6/10 | OK shippable |
| Code quality | 5/10 | Refactor needed |
| Tech debt | 4/10 | **Critical** |
| Design tokens compliance | 4/10 | **Fail** |
| A11y WCAG AA | 4/10 | **Fail** |
| Dark mode parity | 7/10 | Warn |
| Bundle size | 5/10 | **Fail** |
| Component consistency | 5/10 | Warn |
| **Score global** | **5.7/10** | Shippable mais polishing critique |

## 🔴 Verdict launch PH (6 mai)

**NO-GO en l'état → GO conditionnel après 6 fixes critiques** (~2h de travail).

3 blockers reportables publiquement :
1. Zero focus ring dans `Button.tsx` → keyboard nav aveugle
2. 1379 raw `<button>` ne passant pas par le composant Button → inconsistance visuelle
3. 9 images sans alt → WCAG 1.1.1 fail (crawlers PH/Google flag)

---

## 📋 Plan d'action structuré

### 🎯 P0 — À FAIRE AVANT LE 6 MAI (Quick Wins, ~3h total)

| # | Action | Fichier | Effort | Impact |
|---|---|---|---|---|
| 1 | Focus ring dans Button.tsx | `client/src/components/Button.tsx` | 5 min | A11y critique |
| 2 | Alt text sur 9 images | 9 fichiers | 30 min | A11y critique |
| 3 | EmptyState → utiliser Button | `client/src/components/EmptyState.tsx` | 20 min | A11y + cohérence |
| 4 | Lazy load Landing + StationLanding + PublicMenu | `client/src/App.tsx` | 10 min | -60-80 KB gzip first load |
| 5 | Swagger off production | `api/index.ts` | 10 min | Sécurité + cold start |
| 6 | Extract authHeaders → hook | new `client/src/hooks/useApiClient.ts` + 23 fichiers | 90 min | DRY (security risk) |
| 7 | Extract getUnitDivisor → utils | new `client/src/utils/units.ts` + 3 fichiers | 20 min | DRY |
| 8 | Remove WelcomeMessage widget Dashboard | `client/src/pages/Dashboard.tsx` | 15 min | Allègement UX |
| 9 | Fuse "AI Insight" + "Priorité du jour" widgets | `client/src/pages/Dashboard.tsx` | 20 min | Allègement UX |

**Total : ~3h pour bypass tous les blockers + amélioration UX significative.**

---

### 🟠 P1 — POST-LAUNCH (Semaine 1-2 après PH)

#### Engineering refactor majeur
- **Split `api/index.ts` 6542 lignes → `api-lib/routes/` modules** (2-3 jours)
  - Pattern existe déjà partiellement (9 modules dans api-lib/routes)
  - Domaines à migrer : ingredients, recipes, inventory, haccp, planning, reports
  - Cible : api/index.ts < 300 lignes orchestration

- **Découper Recipes.tsx (4386 lignes) + Suppliers.tsx (3718 lignes)**
  - Sous-composants : `RecipeList`, `RecipeForm`, `RecipeFilters`, `SupplierList`, `SupplierForm`
  - Cible : < 500 lignes par fichier

- **Migrate 1379 raw buttons → composant Button**
  - Incrémental page par page
  - Standardiser variantes : `primary` (teal-600), `success` (emerald-600), `ghost`, `danger` (red-600)

#### Design system
- **Remplacer 5302 hex hardcodés par tokens Tailwind** (`text-[#6B7280]` → `text-mono-600`)
- **Standardiser heading hierarchy** : 5 tailles différentes de h1 actuellement → 1 seule classe centralisée `heading-page`
- **Border radius unifié** : choisir 1 valeur par contexte (cards = `rounded-2xl`, buttons = `rounded-xl`, inputs = `rounded-lg`)
- **Compléter dark mode** : pages CGU, CGV, certaines blog pages restent light-only

#### UX
- **Sidebar progressive disclosure** : 40 liens actuels = paralysie. Mode "Solo" par défaut avec 8 liens + CTA "Découvrir outils avancés"
- **Empty states systématiques** : utiliser `EmptyState` partout, jamais d'écrans vides hostiles
- **Onboarding step 4-5 mesurables** : remplacer "Testez la commande vocale" (faux progrès) par "Calculez la marge de votre première recette"

---

### 🟢 P2 — TECH DEBT (Mois 2-3)

- **Bundle vendor-charts 408 KB** : SVG statiques pour les 16 pages blog au lieu de Recharts
- **146 occurrences `: any`** : type properly
- **52 casts `as any`** : refactor
- **`useApiClient` hook** : ajouter intercepteurs (token refresh, retry, error boundary)
- **Monitoring** : Sentry + alerting Slack/PagerDuty + runbook
- **lucide-react tree-shaking** : vérifier vendor-icons 116 KB
- **pdf-parse + puppeteer-core** : déplacer en optionalDependencies (scripts only)

---

## 📊 Findings détaillés par axe

### A11y critiques

```
client/src/components/Button.tsx:49           PAS de focus-visible
client/src/components/EmptyState.tsx:128,137  <button> raw au lieu de Button
client/src/pages/AIAssistant.tsx:1208         <img sans alt>
client/src/pages/BlogFifoLifo.tsx:202         <img sans alt>
client/src/pages/EditorialRecipes.tsx:339     <img sans alt>
client/src/pages/InvoiceScanner.tsx:1199      <img sans alt>
client/src/pages/PublicRecipe.tsx:83          <img sans alt>
client/src/pages/RecipeDetail.tsx:418,2085    <img sans alt>
client/src/pages/StationLanding.tsx:260,355   <img sans alt>
client/src/pages/AutoOrders.tsx:2799          <div onClick> non accessible
client/src/pages/Recipes.tsx:558              <div onClick> non accessible
~100 inputs/selects sans label associé
```

### Bundle hotspots

```
dist/assets/index-*.js              769 KB raw / 211 KB gzip   ← cible < 120 KB gzip
dist/assets/vendor-charts-*.js      408 KB raw / 119 KB gzip   ← séparer blog vs app
dist/assets/vendor-react-*.js       166 KB raw / 54 KB gzip    OK
dist/assets/vendor-icons-*.js       116 KB raw / 22 KB gzip    OK
client/src/pages/Landing.tsx        2 341 lignes + GSAP eager  ← lazy + dynamic GSAP
client/src/pages/StationLanding.tsx 2 fichiers eager           ← lazy
client/src/pages/PublicMenu.tsx     fichier eager              ← lazy
```

### Code duplication

```
authHeaders() : 23 fichiers
getUnitDivisor() : 3 fichiers (Dashboard, Recipes, Inventory)
fetch boilerplate auth : 265 occurrences
hex hardcodés (#XXXXXX) : 5302 occurrences
raw <button> : 1379 occurrences
```

### Tech debt hotspots

```
api/index.ts                 6 542 lignes (monolithe)
client/src/pages/Recipes.tsx 4 386 lignes
client/src/pages/Suppliers.tsx 3 718 lignes
client/src/App.tsx           1 094 lignes (sidebar + routing + providers)
client/src/pages/Landing.tsx 2 341 lignes (GSAP en eager import)
```

### Security

```
swagger-ui-express monté en production sans auth gate (api/index.ts)
authHeaders() dupliqué 23x → 23 endroits à patcher si rotation token
CI security scan ne couvre pas Supabase JWT longue durée ni Prisma DATABASE_URL
E2E Playwright tourne contre prod avec continue-on-error: true
```

---

## 🎯 Recommandations next hires

| Rôle | Quand | Pourquoi |
|---|---|---|
| Senior Backend Engineer Node/TS | api/index.ts > 8000 lignes ou bug race condition prod | Splitter monolithe, intro tests intégration |
| Frontend Engineer mid/senior React | Premier client enterprise signalant lenteurs mobile | Bundle 769 KB ne tient pas sur mobile 3G |
| DevOps / Platform Eng (freelance) | Passage Vercel Pro ou première panne sans runbook | Pas de monitoring (Sentry absent), pas d'alerting |

---

## ✅ Conclusion

**Action immédiate** : exécuter les 9 Quick Wins P0 (3h) avant le 6 mai pour passer le verdict launch de NO-GO → GO.

**Stratégie 30j post-launch** : focus refactor `api/index.ts` + sidebar progressive disclosure + migration buttons.

**Stratégie 90j** : design system tokens + monitoring + tests intégration.

---

*Audit consolidé du CPO + CTO + Design Reviewer le 2026-04-28.*
