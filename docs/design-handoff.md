# RestauMargin -- Design Handoff Specification

> Version 1.0 | 2026-04-01
> Source of truth for all visual specs, component states, tokens, and interaction patterns.

---

## Table of Contents

1. [Design Tokens](#1-design-tokens)
2. [Components](#2-components)
3. [Layout Specs](#3-layout-specs)
4. [Responsive Breakpoints](#4-responsive-breakpoints)
5. [Animations / Motion](#5-animations--motion)
6. [Visual Effects](#6-visual-effects)
7. [Edge Cases](#7-edge-cases)
8. [Accessibility](#8-accessibility)

---

## 1. Design Tokens

### 1.1 Colors

#### Brand / Neon Palette (custom tokens from `tailwind.config.js`)

| Token | Hex | Usage |
|---|---|---|
| `neon-teal` | `#0d9488` | Primary brand color, active nav states, focus rings, CTA glow |
| `neon-cyan` | `#06b6d4` | Secondary brand accent, gradient mesh, avatar ring gradient |
| `neon-green` | `#10b981` | Success states, positive margins, Station Balance CTA |
| `neon-red` | `#ef4444` | Danger states, negative margins, delete actions |
| `neon-amber` | `#f59e0b` | Warning states, medium-margin badges |
| `neon-purple` | `#8b5cf6` | Chart accents, category color |

#### Semantic Colors (Tailwind defaults used throughout)

| Role | Light | Dark | Usage |
|---|---|---|---|
| Background | `white` | `slate-950` (#020617) | Root body background |
| Surface | `white` | `slate-900/50` (rgba) | Card backgrounds |
| Text primary | `slate-900` | `slate-100` | Body text, headings |
| Text secondary | `slate-700` | `slate-300` | Labels, descriptions |
| Text muted | `slate-500` | `slate-400` | Placeholder text, timestamps |
| Text disabled | `slate-400` | `slate-500` | Disabled elements |
| Border default | `slate-200` | `slate-700` | Card borders, dividers |
| Border subtle | `slate-200/80` | `slate-700/80` | Modal header border |
| Border active | `teal-500` | `teal-400` | Focus state borders |

#### Badge Variants

| Variant | Light bg | Light text | Dark bg | Dark text |
|---|---|---|---|---|
| `badge-success` | `emerald-100` | `emerald-700` | `emerald-900/30` | `emerald-400` |
| `badge-warning` | `amber-100` | `amber-700` | `amber-900/30` | `amber-400` |
| `badge-danger` | `red-100` | `red-700` | `red-900/30` | `red-400` |
| `badge-info` | `blue-100` | `blue-700` | `blue-900/30` | `blue-400` |
| `badge-neutral` | `slate-100` | `slate-600` | `slate-700` | `slate-300` |

#### Chart Colors (Dashboard)

| Index | Hex | Usage |
|---|---|---|
| 0 | `#2563eb` | Blue (primary chart series) |
| 1 | `#059669` | Emerald (secondary series) |
| 2 | `#d97706` | Amber |
| 3 | `#dc2626` | Red |
| 4 | `#7c3aed` | Purple |
| 5 | `#0891b2` | Cyan |
| 6 | `#e11d48` | Rose |
| 7 | `#4f46e5` | Indigo |

#### Stat Card Gradient Configs

| Color Key | Gradient (light to dark) | Top Border |
|---|---|---|
| `teal` | `from-teal-50 to-white` / `from-teal-950/20 to-slate-900/40` | `border-t-teal-400` |
| `green` | `from-green-50 to-white` / `from-green-950/20 to-slate-900/40` | `border-t-emerald-400` |
| `amber` | `from-amber-50 to-white` / `from-amber-950/20 to-slate-900/40` | `border-t-amber-400` |
| `purple` | `from-purple-50 to-white` / `from-purple-950/20 to-slate-900/40` | `border-t-purple-400` |
| `cyan` | `from-cyan-50 to-white` / `from-cyan-950/20 to-slate-900/40` | `border-t-cyan-400` |
| `slate` | `from-slate-50 to-white` / `from-slate-900/30 to-slate-900/40` | `border-t-slate-400` |

### 1.2 Typography

| Token | Font Stack | Usage |
|---|---|---|
| `font-satoshi` | `Satoshi, DM Sans, Inter, sans-serif` | Logo branding, nav section labels |
| `font-general-sans` | `General Sans, DM Sans, Inter, sans-serif` | Default body text (set in `index.css`) |
| (fallback) | `DM Sans, Inter, system-ui, sans-serif` | Automatic fallback chain |

| Element | Size | Weight | Tracking | Class |
|---|---|---|---|---|
| Section title | `text-lg` (18px) | `font-bold` (700) | `tracking-tight` | `.section-title` |
| Modal title | `text-lg` (18px) | `font-bold` (700) | `tracking-tight` | -- |
| Nav label | `text-sm` (14px) | `font-medium` (500) | -- | NavLink |
| Nav section header | `text-[9px]` | `font-semibold` (600) | `tracking-[0.18em]` | Uppercase |
| Badge | `text-xs` (12px) | `font-semibold` (600) | -- | `.badge` |
| Table header | `text-[0.7rem]` | `font-semibold` (600) | `tracking-[0.05em]` | `.table-pro thead th` (uppercase) |
| Body text | `text-sm` (14px) | `font-normal` (400) | -- | -- |
| Input text | `text-sm` (14px) | `font-normal` (400) | -- | `.input` |

### 1.3 Spacing

| Token | Value | Usage |
|---|---|---|
| Card padding | `p-6` (24px) | Default `.card` padding |
| Modal body padding | `p-6` (24px) | Modal content area |
| Modal header padding | `px-6 py-4` (24px / 16px) | Modal title bar |
| Sidebar inner padding | `px-3` (12px) | Nav items container |
| Nav item padding | `px-3 py-2` (12px / 8px) | Standard nav link |
| Input padding | `px-3 py-2` (12px / 8px) | `.input` class |
| Button padding | `px-4 py-2` (16px / 8px) | `.btn-primary`, `.btn-secondary` |
| Badge padding | `px-2.5 py-0.5` (10px / 2px) | `.badge` |
| Grid gap (form) | `gap-3` (12px) | SmartIngredientInput inline form |

### 1.4 Border Radius

| Token | Value | Usage |
|---|---|---|
| `rounded-2xl` | 16px | Cards, modal panel |
| `rounded-xl` | 12px | Buttons (primary usage in CLAUDE.md), input fields |
| `rounded-lg` | 8px | Nav items, inputs (`.input`), dropdowns, toasts |
| `rounded-full` | 9999px | Badges, avatar, notification dots |

### 1.5 Shadows

| Token | Value | Usage |
|---|---|---|
| Card default | `shadow-sm` | `.card` resting state |
| Card hover | `shadow-md` | `.card:hover` |
| Card hover dark | `0 0 30px rgba(13,148,136,0.08)` | `.dark .card:hover` |
| Modal | `shadow-2xl` | Modal panel |
| Dropdown | `shadow-xl` | SmartIngredientInput dropdown, restaurant selector |
| Glow (btn-primary) | `blur(8px)` on gradient pseudo | Button hover glow |
| Neon pulse | `0 0 20px rgba(13,148,136,0.3)` to `0 0 40px/80px` | `@keyframes neonPulse` |
| Avatar ring | `ring-2 ring-teal-400/20 shadow-[0_0_12px_rgba(13,148,136,0.2)]` | User avatar |

---

## 2. Components

### 2.1 Button

#### Variants

| Variant | Class | Light | Dark |
|---|---|---|---|
| Primary | `.btn-primary` | `bg-teal-600 text-white` | `bg-teal-600 text-white` |
| Secondary | `.btn-secondary` | `bg-white text-slate-700 border-slate-300` | `bg-slate-700 text-slate-200 border-slate-600` |
| Danger | (inline) | `bg-red-600 text-white` | `bg-red-600 text-white` |
| Ghost | (inline) | `text-slate-500 hover:bg-slate-100` | `text-slate-400 hover:bg-slate-700` |
| Success | (inline) | `bg-emerald-500 text-white` | `bg-emerald-500 text-white` |

#### States

| State | Primary behavior | Notes |
|---|---|---|
| Default | Solid background | -- |
| Hover | `bg-teal-500` + glow pseudo-element (`opacity: 1`) | Glow is `blur(8px)` gradient |
| Active / Pressed | Default browser active | -- |
| Disabled | `opacity-50 cursor-not-allowed` | Used on create button in SmartIngredientInput |
| Loading | Icon replaced with `<Loader2 className="animate-spin" />` | Text preserved beside spinner |

#### Glow Effect (Primary only)

```css
.btn-primary::after {
  content: '';
  position: absolute;
  inset: -1px;
  background: linear-gradient(135deg, rgba(13,148,136,0.4), rgba(6,182,212,0.4));
  border-radius: inherit;
  z-index: -1;
  filter: blur(8px);
  opacity: 0;          /* hidden by default */
  transition: opacity 0.3s;
}
.btn-primary:hover::after {
  opacity: 1;          /* visible on hover */
}
```

#### Code Example

```tsx
<button className="btn-primary">Enregistrer</button>
<button className="btn-secondary">Annuler</button>
<button className="btn-primary" disabled>
  <Loader2 className="w-4 h-4 animate-spin" />
  Chargement...
</button>
```

---

### 2.2 Card

#### Variants

| Variant | Usage | Additional styling |
|---|---|---|
| Default | Standard content card | `.card` class |
| Stat Card | Dashboard KPI tiles | Gradient bg + colored top border (`border-t-4`) |

#### States

| State | Light | Dark |
|---|---|---|
| Default | `bg-white rounded-2xl shadow-sm border-slate-200` | Glassmorphism: `bg-slate-900/60 backdrop-blur-12px border-slate-200/10` |
| Hover | `shadow-md transform: translateY(-2px)` | `border-color: rgba(13,148,136,0.3)` + teal glow shadow |
| Active | -- (no active state) | -- |

#### Code Example

```tsx
<div className="card">
  <h3 className="section-title">Titre</h3>
  <p>Contenu</p>
</div>
```

---

### 2.3 Input

#### Variants

| Variant | Description |
|---|---|
| Default | `.input` class -- standard text input |
| Search | With `<Search>` icon left, optional `<Loader2>` / `<ChevronDown>` right |
| Select | `<select>` with same base styling |

#### States

| State | Light | Dark |
|---|---|---|
| Default | `bg-white border-slate-300 text-slate-900` | `bg-slate-700 border-slate-600 text-slate-100` |
| Placeholder | `text-slate-400` (implicit) | `placeholder-slate-400` |
| Focus | `ring-2 ring-teal-500/40 border-teal-500 shadow-[0_0_0_3px_rgba(13,148,136,0.1)]` | `ring-teal-400/40 border-teal-400 shadow-[0_0_0_3px_rgba(45,212,191,0.1)]` |
| Disabled | `opacity-50 cursor-not-allowed` | Same |
| Error | (inline) `border-red-500 ring-red-500/40` | `border-red-400 ring-red-400/40` |

#### Props

| Prop | Type | Default |
|---|---|---|
| `type` | `text` / `number` / `email` / `password` | `text` |
| `placeholder` | `string` | -- |
| `className` | `string` | `''` |
| `value` | `string` | -- |
| `onChange` | `(e) => void` | -- |

#### Code Example

```tsx
<input type="text" className="input w-full" placeholder="Rechercher..." />
```

---

### 2.4 Modal

#### Props

| Prop | Type | Required | Default |
|---|---|---|---|
| `isOpen` | `boolean` | Yes | -- |
| `onClose` | `() => void` | Yes | -- |
| `title` | `string` | Yes | -- |
| `children` | `ReactNode` | Yes | -- |
| `className` | `string` | No | `''` |
| `contentClassName` | `string` | No | `''` |

#### States

| State | Description |
|---|---|
| Closed | Returns `null`, no DOM rendered |
| Opening | Backdrop: `animate-fade-in` (0.2s). Panel: `animate-modal-in` (0.25s ease-out, translateY 24px + scale 0.96 to normal) |
| Open | Body scroll locked (`overflow: hidden`). Click outside or press Escape to close |
| Closing | Instant removal (no exit animation) |

#### Structure

```
Fixed overlay (z-50, flex items-start justify-center)
  |-- Backdrop: bg-black/40 backdrop-blur-sm
  |-- Panel: bg-white dark:bg-slate-800 rounded-2xl shadow-2xl max-w-2xl
       |-- Header: px-6 py-4, border-b, title + close button
       |-- Content: p-6, max-h-[70vh] overflow-y-auto
```

#### ARIA

- `role="dialog"` on container
- `aria-modal="true"`
- `aria-labelledby="modal-title"` pointing to `<h3 id="modal-title">`
- Escape key closes modal

#### Code Example

```tsx
<Modal isOpen={showModal} onClose={() => setShowModal(false)} title="Nouvel ingredient">
  <form>...</form>
</Modal>
```

---

### 2.5 Toast

#### Variants

| Variant | Background | Icon |
|---|---|---|
| Success | `bg-green-600` | Checkmark emoji |
| Error | `bg-red-600` | -- |
| Info | `bg-blue-600` | -- |

#### States

| State | Behavior |
|---|---|
| Entering | `animate-toast-in`: translateX(100%) to 0, 0.3s ease-out |
| Visible | Fixed position `bottom-6 right-6 z-[9999]` |
| Auto-dismiss | 3 seconds timeout via `setTimeout` |
| Exiting | Instant removal |

#### Code Example

```tsx
{toast && (
  <div className="fixed bottom-6 right-6 z-[9999] bg-green-600 text-white px-4 py-3 rounded-lg shadow-lg flex items-center gap-2 animate-toast-in">
    <span>check emoji</span>
    <span className="text-sm">{toast}</span>
  </div>
)}
```

---

### 2.6 SmartIngredientInput

A combo search input with autocomplete dropdown, mercuriale price hints, and inline "new ingredient" creation form.

#### Props

| Prop | Type | Required | Default |
|---|---|---|---|
| `onSelect` | `(ingredient: { id, name, unit, price, category? }) => void` | Yes | -- |
| `placeholder` | `string` | No | `'Rechercher un ingredient...'` |
| `className` | `string` | No | `''` |

#### States

| State | Visual |
|---|---|
| Empty | Search icon left, placeholder text |
| Typing | Debounced search after 300ms, `<Loader2>` spinner right |
| Results | Dropdown with ingredient list (emoji + name + price/unit), mercuriale price hint below each |
| No results | "Nouvel ingredient detecte !" banner with inline creation form (price, unit, category, supplier) |
| Creating | Submit button shows `<Loader2>` spinner, disabled |
| Created | Toast appears, dropdown closes, input filled with new name |

#### Dropdown Structure

```
Wrapper (relative, z-50)
  |-- Search input (pl-10 pr-10, Search icon left, Loader2 or ChevronDown right)
  |-- Dropdown (bg-slate-900, border-slate-700, rounded-lg, shadow-xl)
       |-- Existing results list (max-h-60 overflow-y-auto)
       |    |-- Item: emoji + name + supplier + price/unit + mercuriale hint
       |-- OR: New ingredient panel (animate-slideDown)
            |-- Header: teal-900/40 bg, sparkle icon, ingredient name badge
            |-- Mercuriale hint row (if available)
            |-- Mini form: 2x2 grid (price, unit, category, supplier)
            |-- Create button: bg-teal-600 full width
```

---

### 2.7 IngredientAvatar (inline pattern)

Used across the app as category emoji indicators next to ingredient names.

| Category | Emoji |
|---|---|
| Viandes | meat emoji |
| Poissons | fish emoji |
| Fruits & Legumes | vegetable emoji |
| Epicerie | olive emoji |
| Produits laitiers | cheese emoji |
| Boissons | wine emoji |
| Surgeles | ice cube emoji |
| Boulangerie | bread emoji |
| Condiments | salt emoji |
| (default) | package emoji |

---

### 2.8 Badge

#### Variants

See badge variant table in section 1.1.

#### Props

| Prop | Type | Default |
|---|---|---|
| `className` | `string` | -- |
| `children` | `ReactNode` | -- |

#### Code Example

```tsx
<span className="badge badge-success">En stock</span>
<span className="badge badge-danger">Rupture</span>
<span className="badge badge-warning">Alerte</span>
```

---

### 2.9 NavLink (Sidebar)

#### States

| State | Style |
|---|---|
| Default | `text-slate-400` |
| Hover | `bg-white/[0.03] text-slate-200 translate-x-0.5` |
| Active | `bg-teal-500/8 text-teal-300 border-l-[2px] border-teal-400 pl-[10px]` |
| Disabled | `opacity-50 cursor-not-allowed text-slate-500` with "Bientot" badge |

---

## 3. Layout Specs

### 3.1 Sidebar

| Breakpoint | Behavior | Width | Content |
|---|---|---|---|
| Desktop (>= 1024px) | Fixed left sidebar | `w-56` (224px) | Full: logo + restaurant selector + nav + user |
| Tablet (768-1023px) | Fixed left sidebar (collapsed) | `w-16` (64px) | Icons only (`.sidebar-label` hidden via CSS) |
| Mobile (< 768px) | Hidden, opened via hamburger | `w-72` (288px) overlay | Full content + close button, backdrop `bg-black/50` |

#### Sidebar Background

```
bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950
dark: from-slate-950 via-slate-950 to-black
```

#### Sidebar Structure

```
<aside> (fixed, inset-y-0, left-0)
  |-- Gradient accent line: h-[1px] from-teal-500 via-cyan-400 to-transparent
  |-- Logo: ChefHat icon + "RestauMargin" text (font-satoshi)
  |-- Restaurant selector (collapsed: hidden)
  |-- Station Balance CTA (bg-emerald-600)
  |-- Nav sections (scrollable, .sidebar-scroll)
  |    |-- PRINCIPAL (3 items)
  |    |-- GESTION (5 items)
  |    |-- INTELLIGENCE (5 items)
  |    |-- OPERATIONS (5 items)
  |    |-- COMMUNICATION (2 items)
  |    |-- BUSINESS (6 items)
  |-- Bottom section (border-t)
       |-- Settings / Users (admin only)
       |-- Dark mode toggle
       |-- Install PWA button (conditional)
       |-- User profile card
```

### 3.2 Content Area

| Property | Value |
|---|---|
| Margin left (desktop) | `lg:ml-56` (224px) |
| Margin left (tablet) | `md:ml-16` (64px) |
| Margin left (mobile) | `ml-0` |
| Main layout | `flex-1 flex flex-col min-h-screen` |
| Page padding | Applied per-page (typically `p-4 lg:p-6`) |
| Page enter animation | `animate-page-enter`: translateY(6px) to 0, 0.25s ease-out |

### 3.3 Stat Cards Grid (Dashboard)

Dashboard stat cards use a responsive grid:

```
grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4
```

Each stat card uses the `STAT_CARD_STYLES` gradient system with a `border-t-4` colored top accent.

### 3.4 Mobile Top Bar

- Visible: `< md` (< 768px)
- Height: `py-3` (12px top/bottom) + content
- Background: `bg-white dark:bg-slate-800`
- Border: `border-b dark:border-slate-700`
- Contains: hamburger menu button (left), app branding (center)

---

## 4. Responsive Breakpoints

| Breakpoint | Min Width | Key Changes |
|---|---|---|
| Mobile | `0px` | Sidebar hidden (hamburger trigger), single-column grids, top bar visible, `w-72` overlay sidebar |
| Tablet (`md`) | `768px` | Collapsed icon-only sidebar (`w-16`), 2-column grids, top bar hidden, `.sidebar-label` display:none |
| Desktop (`lg`) | `1024px` | Full sidebar (`w-56`), multi-column grids, full nav labels visible |
| Wide (`xl`) | `1280px` | 4-column stat card grid |

### Sidebar label hiding (tablet)

```css
@media (min-width: 768px) and (max-width: 1023px) {
  aside .sidebar-label { display: none; }
}
```

---

## 5. Animations / Motion

| Element | Trigger | Animation | Duration | Easing | Delay |
|---|---|---|---|---|---|
| Page content | Route change | `page-enter`: translateY(6px) to 0, opacity 0 to 1 | 0.25s | ease-out | -- |
| Stagger cards | Page load | `luxFadeInUp`: translateY(16px) to 0, opacity 0 to 1 | 0.5s | ease-out | `.stagger-1`: 50ms, `.stagger-2`: 120ms, `.stagger-3`: 190ms, `.stagger-4`: 260ms, `.stagger-5`: 330ms |
| Card hover | Mouse enter | `transform: translateY(-2px)` | 0.3s | CSS `transition-all` | -- |
| Button glow | Mouse enter `.btn-primary` | Pseudo-element opacity 0 to 1 (blur 8px gradient) | 0.3s | CSS transition | -- |
| Modal backdrop | Modal open | `fade-in`: opacity 0 to 1 | 0.2s | ease-out | -- |
| Modal panel | Modal open | `modal-in`: translateY(24px) scale(0.96) to normal | 0.25s | ease-out | -- |
| Toast | Appears | `toast-in`: translateX(100%) to 0, opacity 0 to 1 | 0.3s | ease-out | -- |
| Toast dismiss | 3s timeout | Instant removal | -- | -- | 3000ms auto |
| Dropdown expand | New ingredient form | `slideDown`: max-height 0 to 400px, opacity 0 to 1 | 0.3s | ease-out | -- |
| Mobile sidebar | Hamburger click | `slide-in-left`: translateX(-100%) to 0 | 0.2s | ease-out | -- |
| Nav link hover | Mouse enter | `translate-x-0.5` (2px right) | 0.2s | `transition-all` | -- |
| Slideup generic | Various | `slideInUp`: translateY(10px) scale(0.97) to normal | 0.3s | ease-out | -- |
| Neon pulse | Continuous | Box-shadow 20px to 40px/80px cycle | -- | keyframes (0%, 50%, 100%) | -- |
| Sound wave (vocal) | Voice active | Height 8px to 24px cycle | -- | keyframes (0%, 50%, 100%) | -- |
| Landing fadeInUp | Scroll / load | translateY(30px) to 0, opacity 0 to 1 | -- | -- | -- |
| Spinner | Loading state | `animate-spin` (Tailwind built-in 360deg) | 1s | linear | -- |
| Table row hover | Mouse enter | `background-color` transition | 0.15s | CSS transition | -- |

---

## 6. Visual Effects

### 6.1 Noise Texture Overlay

Applied via `body::before` pseudo-element, covering the entire viewport:

```css
body::before {
  content: '';
  position: fixed;
  inset: 0;
  background-image: url("data:image/svg+xml,..."); /* fractalNoise SVG filter */
  pointer-events: none;
  z-index: 9999;
  opacity: 0.4;
}
```

- Type: `fractalNoise`, baseFrequency `0.65`, 3 octaves
- SVG rect opacity: `0.03`
- Overall pseudo opacity: `0.4`
- Non-interactive (`pointer-events: none`)

### 6.2 Gradient Mesh Background (Dark mode)

```css
.dark body {
  background:
    radial-gradient(ellipse at 20% 50%, rgba(13,148,136,0.08) 0%, transparent 50%),
    radial-gradient(ellipse at 80% 20%, rgba(6,182,212,0.05) 0%, transparent 50%),
    #020617;
}
```

Two overlapping teal/cyan radial gradients on top of `slate-950` base.

### 6.3 Glassmorphism Cards (Dark mode)

```css
.dark .card {
  background: rgba(15, 23, 42, 0.6);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border: 1px solid rgba(148, 163, 184, 0.1);
}
.dark .card:hover {
  border-color: rgba(13, 148, 136, 0.3);
  box-shadow: 0 0 30px rgba(13, 148, 136, 0.08);
}
```

### 6.4 Custom Scrollbar

```css
::-webkit-scrollbar { width: 6px; }
::-webkit-scrollbar-track { background: transparent; }
::-webkit-scrollbar-thumb { background: rgba(148,163,184,0.2); border-radius: 3px; }
::-webkit-scrollbar-thumb:hover { background: rgba(13,148,136,0.4); }
```

Sidebar has its own thinner scrollbar (4px width).

### 6.5 Selection Color

```css
::selection { background: rgba(13,148,136,0.3); color: white; }
```

### 6.6 Button Glow (Primary)

See section 2.1 -- gradient pseudo-element with `blur(8px)`, opacity transitions on hover.

### 6.7 Sidebar Gradient Accent

Top of sidebar: `h-[1px] bg-gradient-to-r from-teal-500 via-cyan-400 to-transparent`

### 6.8 User Avatar Glow

```
bg-gradient-to-br from-teal-400 to-cyan-600
ring-2 ring-teal-400/20
shadow-[0_0_12px_rgba(13,148,136,0.2)]
```

---

## 7. Edge Cases

### 7.1 Empty States

| Page | Empty State |
|---|---|
| Dashboard | Shows zero values in stat cards, empty chart containers with "no data" |
| Ingredients | Empty list with "Aucun ingredient" message + CTA to add first |
| Recipes | Empty list with prompt to create first recipe |
| Inventory | Empty inventory table |
| Suppliers | No suppliers message |
| Messagerie | "Aucun message" empty state |
| SmartIngredientInput | "Nouvel ingredient detecte !" banner when search returns 0 results (auto-creation form) |

### 7.2 Loading States

| Context | Implementation |
|---|---|
| Page lazy load | `<Suspense>` fallback: centered "Chargement..." text with `text-slate-500 dark:text-slate-400` |
| Auth check | `min-h-screen flex items-center justify-center` with "Chargement..." |
| API fetch | `<Loader2 className="w-4 h-4 animate-spin" />` inline spinner |
| Button action | Replace icon with `<Loader2 className="animate-spin" />`, keep text, add `disabled` |
| SmartIngredientInput search | Spinner in right side of input field |
| Chunk load failure | Auto-reload via `lazyRetry()` with 5s cooldown; on persistent failure, force page reload |

### 7.3 Error States

| Context | Implementation |
|---|---|
| API error | Toast notification (red variant) or inline error message |
| Network offline | `<ConnectivityBar>` component at top of layout |
| Auth expired | Redirect to `/login` via `<ProtectedRoute>` |
| Chunk load failure | `lazyRetry` forces page reload; prevents white screen |
| Form validation | Inline red border + error text below field |
| 404 page | `<NotFound>` page component with navigation back |

### 7.4 Long Text Truncation

| Element | Behavior |
|---|---|
| Sidebar nav labels | `truncate` (single-line ellipsis) |
| Restaurant name (sidebar) | `truncate` on name span |
| Ingredient name (dropdown) | `truncate` on `<p>` with `min-w-0` parent |
| Supplier name (dropdown) | `truncate` on subtext |
| User name (sidebar) | `truncate` |
| Table cells | `.no-break-slash` for slash-separated values (`word-break: keep-all; white-space: nowrap`) |

### 7.5 Slow Connection

| Scenario | Handling |
|---|---|
| SmartIngredientInput | 300ms debounce on search; spinner during fetch; silent error catch |
| Mercuriale parallel fetch | Fetched in `Promise.all` alongside ingredients; fails silently if unavailable |
| Lazy page chunks | `lazyRetry` with auto-reload on chunk failure; 5s cooldown prevents infinite loop |
| General API | Bearer token attached automatically; no retry logic (fail-fast) |

---

## 8. Accessibility

### 8.1 Focus Management

#### Global Focus Style

```css
*:focus-visible {
  outline: 2px solid #0d9488;
  outline-offset: 2px;
}
```

All interactive elements get a teal focus ring via `focus-visible` (keyboard only, not mouse clicks).

#### Skip Link

```tsx
<a href="#main-content"
   className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50
              focus:bg-teal-600 focus:text-white focus:px-4 focus:py-2 focus:rounded-lg">
  Aller au contenu principal
</a>
```

### 8.2 ARIA Requirements

| Component | ARIA Attributes |
|---|---|
| Modal | `role="dialog"`, `aria-modal="true"`, `aria-labelledby="modal-title"` |
| Sidebar nav | `aria-label="Navigation principale"` on `<nav>` |
| Close buttons | Implicit from `<button>` + icon (add `aria-label` for icon-only) |
| Chart SVGs | Recharts focus outlines removed (`outline: none !important`) -- non-interactive |

### 8.3 Keyboard Navigation

| Action | Key | Behavior |
|---|---|---|
| Close modal | `Escape` | Calls `onClose()` callback |
| Navigate sidebar | `Tab` | Sequential focus through nav links |
| Skip to content | `Tab` (first) | Skip link appears on first Tab press |
| Close dropdowns | Click outside | `mousedown` listener on document |
| Form submit | `Enter` | Standard form behavior |

### 8.4 Color Contrast

| Pair | Ratio (approx.) | Passes AA |
|---|---|---|
| `slate-100` on `slate-950` | > 15:1 | Yes |
| `teal-400` on `slate-900` | ~ 5.5:1 | Yes |
| `slate-400` on `slate-950` | ~ 4.8:1 | Yes (large text) |
| `white` on `teal-600` | ~ 4.6:1 | Yes (large text / bold) |
| `white` on `emerald-600` | ~ 4.6:1 | Yes (large text / bold) |
| `slate-500/60` on `slate-900` | ~ 2.5:1 | No -- nav section labels are decorative |

### 8.5 Print Styles

```css
@media print {
  nav, header, aside, .no-print, .sidebar { display: none !important; }
  main { margin-left: 0 !important; padding: 0 !important; width: 100% !important; }
  body { background: white !important; color: black !important; }
  .rounded-2xl, .rounded-xl, table { break-inside: avoid; }
}
```

---

## Appendix: File Reference

| File | Contains |
|---|---|
| `client/tailwind.config.js` | Custom font families, neon color palette, slideInUp keyframes |
| `client/src/index.css` | Global styles, noise texture, gradient mesh, scrollbar, animations, component classes, print styles |
| `client/src/App.tsx` | Sidebar layout, navigation structure, responsive breakpoints, user profile |
| `client/src/pages/Dashboard.tsx` | Chart colors, stat card styles, allergen color map, category colors |
| `client/src/components/Modal.tsx` | Modal component with ARIA, Escape handling, animations |
| `client/src/components/SmartIngredientInput.tsx` | Search input, dropdown, new ingredient form, mercuriale integration |
