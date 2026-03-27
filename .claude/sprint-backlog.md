# Sprint Backlog: From Demo to Product

**Sprint Goal:** Transform RestauMargin from a working prototype into a deployable SaaS that a paying restaurant can rely on daily.

**Date:** 2026-03-27
**Duration:** 2 weeks (aggressive)

---

## Codebase Audit Summary

### Scale
- **32 pages** in client/src/pages/ (17,900+ lines total)
- **12 server route files** (1,969 lines total)
- **Prisma schema:** PostgreSQL, 14 models

### What Works (DB-backed via Prisma)
| Feature | Route | Status |
|---------|-------|--------|
| Auth (login/register/JWT) | auth.ts (215L) | Real - Prisma + bcrypt + JWT |
| Ingredients CRUD | ingredients.ts (160L) | Real - Prisma |
| Recipes CRUD + costing | recipes.ts (330L) | Real - Prisma |
| Suppliers CRUD | suppliers.ts (192L) | Real - Prisma |
| Inventory tracking | inventory.ts (244L) | Real - Prisma |
| Menu Engineering | menuEngineering.ts (120L) | Real - reads from Prisma |
| Public Menu | publicMenu.ts (41L) | Real - Prisma |

### What is FAKE (in-memory server or local-only)

**Server routes with in-memory arrays (data lost on restart):**
| Route | Problem |
|-------|---------|
| invoices.ts (120L) | In-memory array -- NO Prisma, despite Invoice model existing in schema |
| menuSales.ts (158L) | generateDemoSales() -- demo data generator, no Prisma |
| messages.ts (215L) | In-memory storage, no Prisma model at all |
| priceHistory.ts (105L) | In-memory array -- despite PriceHistory model existing in schema |

**Pages with ZERO backend (pure useState/localStorage):**
| Page | Lines | What is Missing |
|------|-------|-----------------|
| Clients | 1,305 | No DB model, no route. All localStorage. |
| Comptabilite | 1,147 | No DB model, no route. Pure local state. |
| Devis (Quotes) | 1,190 | Mock documents builder. No persistence. |
| HACCP | 770 | Temperature logs, DLC tracking -- all lost on refresh. |
| Planning | 840 | Employee shifts -- sample data, no backend. |
| WasteTracker | 791 | generateWasteData() -- fake data, no persistence. |
| Marketplace | 841 | Static product catalog, no real supplier integration. |
| Seminaires | 1,164 | Event management -- localStorage only. |
| Messagerie | 541 | Chat UI with no real messaging backend. |
| Integrations | 534 | Settings page listing integrations -- none actually connected. |
| Restaurants | 290 | Multi-restaurant selector -- no multi-tenancy in DB. |
| QRMenu | 380 | QR generator, but limited backend support. |
| Subscription | 537 | Billing page -- no Stripe integration. |

### Critical Architecture Gaps
1. **No multi-tenancy** -- zero restaurantId fields anywhere. Every user sees ALL data.
2. **No input validation** -- no zod/joi anywhere on server routes.
3. **No rate limiting** -- no helmet, no express-rate-limit.
4. **No tests** -- zero test files in entire project.
5. **Hardcoded JWT secret** in config.ts fallback.
6. **No OCR** -- InvoiceScanner page has sample data, no real OCR integration.
7. **CORS wide open** for localhost + vercel domain only.

---

## TOP 10 Prioritized Tasks

### P1. Multi-Tenancy Foundation
**Impact: 5/5 | Effort: L | Agent: Backend**

Without this, the app is single-user. Every paying customer would see every other customer data.

- Add Restaurant model to Prisma schema (id, name, ownerId, plan, createdAt)
- Add restaurantId FK to: Ingredient, Recipe, Supplier, Invoice, InventoryItem, RFQ, MenuSales
- Create restaurantMiddleware that extracts restaurantId from JWT and filters all queries
- Migrate all existing Prisma routes to scope by restaurantId
- Update auth to create a default restaurant on first registration

**Depends on:** Nothing (foundational)
**Blocks:** Everything else

---

### P2. Migrate Invoices + PriceHistory to Prisma
**Impact: 5/5 | Effort: M | Agent: Backend**

These models ALREADY EXIST in the Prisma schema but the routes use in-memory arrays. This is the #1 data-loss bug.

- Rewrite invoices.ts to use prisma.invoice and prisma.invoiceItem
- Rewrite priceHistory.ts to use prisma.priceHistory
- Wire invoice /apply endpoint to actually update ingredient prices via Prisma
- Add proper error handling and validation

**Depends on:** P1 (add restaurantId)
**Blocks:** P5 (OCR), Dashboard accuracy

---

### P3. Migrate MenuSales to Prisma
**Impact: 4/5 | Effort: S | Agent: Backend**

MenuSales model exists in schema. Route generates fake demo data. Dashboard and MenuEngineering depend on real sales.

- Rewrite menuSales.ts to use prisma.menuSales
- Add proper CRUD endpoints (record a sale, bulk import, date range queries)
- Remove generateDemoSales() demo generator
- Connect Dashboard to real aggregated data

**Depends on:** P1
**Blocks:** Dashboard accuracy, MenuEngineering reliability

---

### P4. Security Hardening
**Impact: 5/5 | Effort: M | Agent: Backend**

Currently zero production security beyond JWT auth.

- Install + configure helmet (HTTP headers)
- Install + configure express-rate-limit (brute-force protection on /auth)
- Add zod input validation schemas for all POST/PUT routes
- Remove hardcoded JWT_SECRET fallback -- require env var or fail startup
- Add request size limits
- Sanitize user inputs (XSS prevention)
- Add CORS configuration for production domain

**Depends on:** Nothing
**Blocks:** Production deployment

---

### P5. Invoice OCR Integration
**Impact: 5/5 | Effort: L | Agent: Backend + Frontend**

The killer feature. InvoiceScanner is beautiful UI with sample data and zero OCR.

- Integrate OCR service (Google Vision API or Mistral OCR)
- Add file upload endpoint with multer (store in S3 or local)
- Parse OCR output into structured invoice items
- Auto-match extracted items to existing ingredients (fuzzy matching)
- Update InvoiceScanner.tsx to use real upload + parse flow

**Depends on:** P2 (invoices in DB)
**Blocks:** Core value proposition

---

### P6. WasteTracker + HACCP Backend
**Impact: 4/5 | Effort: M | Agent: Backend**

HACCP temperature tracking is LEGALLY REQUIRED in France. WasteTracker directly impacts margins.

- Add Prisma models: WasteEntry, TemperatureReading, DLCProduct, CleaningTask
- Create server routes: /api/waste, /api/haccp
- Migrate WasteTracker.tsx and HACCP.tsx from useState to API calls
- Add date-range queries for reporting/export

**Depends on:** P1
**Blocks:** Regulatory compliance, waste cost analysis

---

### P7. Client/Devis (Quotes) Backend
**Impact: 3/5 | Effort: M | Agent: Backend + Frontend**

Clients (1,305L) and Devis (1,190L) are large polished pages using only localStorage.

- Add Prisma models: Client, Devis, DevisLine
- Create server routes: /api/clients, /api/devis
- Migrate both pages from localStorage to API calls
- Add PDF export for quotes

**Depends on:** P1
**Blocks:** Revenue features (catering, events)

---

### P8. Dashboard Data Accuracy
**Impact: 4/5 | Effort: M | Agent: Frontend + Backend**

Dashboard fetches real recipes/ingredients but computes KPIs client-side with mock sales data.

- Create /api/dashboard/summary endpoint that aggregates real data
- Total food cost, revenue, margin %, top/bottom dishes, cost trends
- Add date range filtering
- Cache expensive aggregations

**Depends on:** P2, P3 (real invoices + sales data)
**Blocks:** User trust in the platform

---

### P9. Planning/Scheduling Backend
**Impact: 3/5 | Effort: M | Agent: Backend**

Planning (840L) is sample data with no persistence.

- Add Prisma models: Employee, Shift
- Create server routes: /api/planning
- Migrate from buildSampleData() to API
- Add shift conflict detection

**Depends on:** P1
**Blocks:** Labor cost integration into margin calculations

---

### P10. Stripe Subscription Integration
**Impact: 4/5 | Effort: L | Agent: Backend + Frontend**

No monetization without billing.

- Integrate Stripe Checkout for subscription plans
- Add webhook handler for payment events
- Create Subscription Prisma model (plan, status, stripeId, nextBilling)
- Gate features by plan tier
- Connect to Restaurants page for multi-location billing

**Depends on:** P1, P4
**Blocks:** Revenue, go-to-market

---

## Dependency Graph

P1 (Multi-tenancy) is the root. It unblocks:
- P2 (Invoices to DB) --> P5 (OCR) and P8 (Dashboard)
- P3 (MenuSales to DB) --> P8 (Dashboard)
- P6 (Waste + HACCP)
- P7 (Clients + Devis)
- P9 (Planning)
- P10 (Stripe, also needs P4)

P4 (Security) is independent and unblocks P10 and production deploy.

## Execution Order

**Week 1: Foundation**
| Day | Task | Agent |
|-----|------|-------|
| D1-D2 | P1: Multi-tenancy schema + middleware | Backend |
| D1 | P4: Security hardening (parallel) | Backend #2 |
| D3 | P2: Invoices + PriceHistory migration | Backend |
| D3-D4 | P3: MenuSales migration | Backend |
| D4-D5 | P6: WasteTracker + HACCP models + routes | Backend |

**Week 2: Features**
| Day | Task | Agent |
|-----|------|-------|
| D6-D7 | P5: Invoice OCR integration | Backend + Frontend |
| D6-D7 | P7: Clients + Devis backend | Backend #2 |
| D8 | P8: Dashboard server-side aggregation | Frontend + Backend |
| D9 | P9: Planning backend | Backend |
| D9-D10 | P10: Stripe integration | Backend + Frontend |

---

## MVP Checklist: What a Paying Customer Needs

- [x] Login/Register with JWT
- [x] Create ingredients with prices
- [x] Create recipes with cost calculations
- [x] Manage suppliers
- [x] Track inventory
- [ ] **Multi-tenancy (data isolation)**
- [ ] **Invoices persisted to DB**
- [ ] **Real sales data tracking**
- [ ] **Invoice OCR scanning**
- [ ] **Security hardening**
- [ ] **HACCP compliance tracking**
- [ ] **Waste tracking with real data**
- [ ] **Billing/subscription**

The checked items work today. The unchecked items are what separates a demo from a product.
