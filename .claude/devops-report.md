# DevOps Report — RestauMargin
**Date:** 2026-03-27
**Build tool:** Vite 6.4.1 | PWA v0.21.2 (generateSW)

---

## 1. Bundle Analysis

Build time: **4.47s** | Precache: 87 entries (1720 KiB)

### Largest chunks (gzip)

| Chunk | Raw | Gzip |
|---|---|---|
| PieChart | 329.89 KB | 100.60 KB |
| index (vendor) | 297.03 KB | 86.56 KB |
| index.css | 145.27 KB | 20.54 KB |
| Suppliers | 106.10 KB | 24.34 KB |
| Dashboard | 59.37 KB | 12.16 KB |
| Recipes | 55.60 KB | 10.93 KB |
| Clients | 53.44 KB | 11.51 KB |
| BarChart | 47.54 KB | 13.11 KB |
| Seminaires | 43.58 KB | 9.20 KB |
| Comptabilite | 39.05 KB | 8.41 KB |
| Devis | 38.33 KB | 8.99 KB |
| InvoiceScanner | 36.62 KB | 8.13 KB |
| RFQ | 35.87 KB | 8.98 KB |
| productCatalog | 35.83 KB | 4.43 KB |
| Settings | 35.45 KB | 8.79 KB |

**Key observation:** PieChart (recharts) at 330 KB raw is the single largest chunk. Consider lazy-loading recharts or switching to a lighter charting library for simple pie charts.

---

## 2. Unused Imports Removed

| File | Removed imports |
|---|---|
| Ingredients.tsx | `Download`, `Upload` |
| Planning.tsx | `Loader2` |
| MenuEngineering.tsx | `Download` |

**WeighStation.tsx:** `WifiOff` was NOT imported (the file imports `Wifi`, which is used). No change needed.

---

## 3. Catalog Loading Optimized

### Problem
`productCatalog.ts` called `loadFullCatalog()` eagerly at module import time, fetching `/catalog.json` (6000+ products) even when no one was searching. Additionally, `Suppliers.tsx` duplicated this fetch with its own raw `fetch('/catalog.json')`.

### Fix applied
- Removed the eager `loadFullCatalog()` call at module level.
- `searchCatalog()` now triggers `loadFullCatalog()` lazily on first call (non-blocking).
- Exported `loadFullCatalog()` so Suppliers.tsx reuses the shared singleton fetch instead of duplicating it.
- Suppliers.tsx now calls `loadFullCatalog()` instead of raw `fetch('/catalog.json')`, ensuring the catalog is fetched only once and cached across both pages.

### Files changed
- `client/src/data/productCatalog.ts`
- `client/src/pages/Suppliers.tsx`

---

## 4. PWA Cache Versioning Fixed

### Problem
The service worker config lacked `skipWaiting` and `clientsClaim`, meaning users could stay on stale cached versions indefinitely after a deploy. Old precaches were also not cleaned up.

### Fix applied (vite.config.ts workbox section)
- Added `skipWaiting: true` — new SW activates immediately on deploy.
- Added `clientsClaim: true` — active SW takes control of all tabs.
- Added `cleanupOutdatedCaches: true` — removes old precache entries from previous builds.
- Added `navigateFallback: '/index.html'` with deny list for `/api/` — proper SPA fallback for offline navigation.

---

## 5. Memory Leak Audit

### Files checked (7 files with addEventListener, 2 with setInterval)

| File | Pattern | Cleanup | Status |
|---|---|---|---|
| App.tsx | mousedown listener | removeEventListener in cleanup | OK |
| App.tsx | beforeinstallprompt | removeEventListener in cleanup | OK |
| Ingredients.tsx | mousedown listener | removeEventListener in cleanup | OK |
| WeighStation.tsx | mousedown listener | removeEventListener in cleanup | OK |
| Modal.tsx | keydown listener | removeEventListener in cleanup | OK |
| Landing.tsx | scroll listener | removeEventListener in cleanup | OK |
| Landing.tsx | setInterval (counter) | clearInterval in cleanup | OK |
| RFQ.tsx | scroll listener | removeEventListener in cleanup | OK |
| RFQ.tsx | setInterval (banner) | clearInterval in cleanup | OK |
| Settings.tsx | beforeinstallprompt | removeEventListener in cleanup | OK |

### useRef audit (11 files)
All refs are DOM element refs used for dropdown/scroll tracking. No dangling refs or uncleared timers found.

**Result: No memory leaks detected.** All event listeners have matching removeEventListener in useEffect cleanup functions. All intervals have matching clearInterval.

---

## Recommendations for next sprint

1. **PieChart/recharts (330 KB):** Consider `react-minimal-pie-chart` (3 KB) for simple pie/donut charts, or dynamic import recharts only on Dashboard.
2. **Suppliers chunk (106 KB):** Largest page chunk. Could benefit from splitting the Transgourmet catalog browser into a separate lazy component.
3. **CSS (145 KB):** Tailwind purge is active, but review if all utility classes are needed. Consider extracting critical CSS.
