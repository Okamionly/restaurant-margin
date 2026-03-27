# QA Report - RestauMargin Frontend & Backend

**Date:** 2026-03-27
**Build status:** Vite build PASSES (2271 modules, 4.58s)
**TypeScript:** 3 errors (non-blocking for build but strict mode failures)

---

## CRITICAL

_No critical bugs found._

---

## HIGH

### H1 - TypeScript type errors in Comptabilite.tsx (Recharts Tooltip formatter)

| Field       | Value |
|-------------|-------|
| Severity    | HIGH |
| File        | `client/src/pages/Comptabilite.tsx` |
| Lines       | 649, 819, 919 |
| Description | The `formatter` prop on `<Tooltip>` is typed as `(v: number) => string`, but Recharts expects `Formatter<ValueType, NameType>` where `ValueType` can be `undefined`. This causes `tsc --noEmit` to fail with 3 errors. The build still succeeds (Vite/esbuild skips type checking) but this will break CI if strict type checking is enforced. |
| Fix         | Change `(v: number) => fmt(v)` to `(v: any) => fmt(Number(v ?? 0))` or cast: `formatter={((v: number) => fmt(v)) as any}` |

---

## MEDIUM

### M1 - Unicode escape sequences in demo data (Devis.tsx)

| Field       | Value |
|-------------|-------|
| Severity    | MEDIUM |
| File        | `client/src/pages/Devis.tsx` |
| Lines       | 176, 179, 183 |
| Description | Three strings use `\u00ee` and `\u00e9` unicode escapes instead of actual French characters: `d\u00eenner`, `ma\u00eetres`, `d\u00eenatoire`. These render correctly at runtime but hurt readability and are inconsistent with the rest of the codebase which uses literal accented characters. |
| Fix         | Replace unicode escapes with UTF-8 chars: `Cocktail diner` -> `Cocktail diner`, `maitres` -> `maitres`, `dinatoire` -> `dinatoire`. |

### M2 - Widespread empty catch blocks in frontend (silent error swallowing)

| Field       | Value |
|-------------|-------|
| Severity    | MEDIUM |
| Files       | 16 files, ~53 occurrences |
| Description | Many `catch {}` or `catch { }` blocks silently swallow errors with no logging and no user feedback. |

**Worst offenders (completely silent, no fallback):**

| File | Count | Notes |
|------|-------|-------|
| `Ingredients.tsx` | 6 | Multiple CRUD operations silently fail |
| `Settings.tsx` | 6 | Config save/load silently fails |
| `ChatbotAssistant.tsx` | 6 | AI chat errors invisible to user |
| `Mercuriale.tsx` | 5 | Price comparison silently fails |
| `Recipes.tsx` | 4 | Recipe operations silently fail |
| `MenuBuilder.tsx` | 3 | Lines 93, 103: completely empty catch {} |
| `UserManagement.tsx` | 3 | User CRUD silently fails |
| `WeighStation.tsx` | 3 | Scale operations silently fail |
| `Suppliers.tsx` | 3 | Including line 1099: empty catch {} |
| `InvoiceScanner.tsx` | 2 | OCR processing silently fails |
| `AutoOrders.tsx` | 1 | Order generation silently fails |
| `Inventory.tsx` | 1 | Duplicate skip (acceptable) |
| `PublicMenu.tsx` | 1 | Menu load silently fails |
| `RecipeDetail.tsx` | 1 | Acceptable (intentional ignore) |
| `MenuEngineering.tsx` | 1 | Acceptable (intentional silent) |
| `useAuth.tsx` | 1 | Auth check silently fails |

| Fix | Add `console.error(e)` at minimum. For user-facing ops, add `showToast(t('common.error'), 'error')`. RFQ.tsx is the good example -- it shows toasts in catch. |

### M3 - Email route GET /sent has no try/catch

| Field       | Value |
|-------------|-------|
| Severity    | MEDIUM |
| File        | `server/src/routes/email.ts` |
| Line        | 67-69 |
| Description | The `GET /sent` endpoint lacks the try/catch pattern used by every other route. Currently reads from in-memory array so unlikely to throw, but inconsistent with codebase patterns. |
| Fix         | Wrap in try/catch for consistency. |

---

## LOW

### L1 - Server auth route has empty catch block

| Field       | Value |
|-------------|-------|
| Severity    | LOW |
| File        | `server/src/routes/auth.ts` |
| Line        | 55 |
| Description | `catch {}` returns 403 (correct behavior) but does not log the JWT verification error. Acceptable for security but hinders debugging. |
| Fix         | Add `console.warn('JWT verify failed')` for server-side logging. |

---

## CLEAN (no issues found)

| Check | Result |
|-------|--------|
| `console.log` in client pages (.tsx) | NONE |
| Hardcoded `localhost` URLs in .tsx | NONE |
| `TODO` / `FIXME` comments in .tsx | NONE |
| Missing imports | NONE (build passes) |
| Server routes missing error handling | All have try/catch except trivial GET /sent |

---

## Summary

| Severity | Count |
|----------|-------|
| CRITICAL | 0 |
| HIGH     | 1 (3 TS errors in Comptabilite.tsx) |
| MEDIUM   | 3 (unicode escapes, ~53 empty catches, 1 missing try/catch) |
| LOW      | 1 (auth empty catch) |
| **Total** | **5 issues** |

### Priority fix order:
1. **H1** - Fix Recharts Tooltip formatter types (breaks tsc --noEmit / CI)
2. **M2** - Add error logging to empty catch blocks (top 5 files first)
3. **M1** - Replace unicode escapes with UTF-8 characters in Devis.tsx
4. **M3** - Add try/catch to email GET /sent
5. **L1** - Add logging to auth catch block
