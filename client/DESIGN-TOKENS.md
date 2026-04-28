# Design Tokens — RestauMargin

Design system mono palette. Tokens defined in `tailwind.config.js`.

## Mono Scale (W&B Theme)

| Token | Hex | Usage |
|---|---|---|
| `mono-0` | `#000000` | Pure black |
| `mono-50` | `#0A0A0A` | Dark background (page, panels) |
| `mono-100` | `#111111` | Primary text (light mode) |
| `mono-150` | `#171717` | Hover backgrounds (dark mode) |
| `mono-200` | `#1A1A1A` | Borders (dark mode) |
| `mono-300` | `#262626` | Subtle borders, hover (dark) |
| `mono-350` | `#404040` | Muted backgrounds (dark) |
| `mono-400` | `#525252` | Muted text (mid-dark) |
| `mono-500` | `#737373` | Secondary text |
| `mono-600` | `#9CA3AF` | Placeholder text |
| `mono-700` | `#A3A3A3` | Subtle text (dark mode secondary) |
| `mono-800` | `#D4D4D4` | Borders (light mode mid) |
| `mono-900` | `#E5E7EB` | Borders (light mode default) |
| `mono-950` | `#F3F4F6` | Light backgrounds |
| `mono-975` | `#F5F5F5` | Input backgrounds (light) |
| `mono-1000` | `#FAFAFA` | Near-white backgrounds |
| `mono-white` | `#FFFFFF` | Pure white |

## Neon Accents

| Token | Hex | Usage |
|---|---|---|
| `neon-teal` | `#0d9488` | Primary CTA, focus rings |
| `neon-cyan` | `#06b6d4` | Secondary accent |
| `neon-green` | `#10b981` | Success states |
| `neon-red` | `#ef4444` | Error / danger |
| `neon-amber` | `#f59e0b` | Warning |
| `neon-purple` | `#8b5cf6` | Special / pro features |

## Hex Migration Map

These 13 hex values have been replaced with tokens across `client/src/`:

| Before (hex) | After (token) | Occurrences (initial) |
|---|---|---|
| `text-[#111111]` | `text-mono-100` | 3231 |
| `text-[#737373]` | `text-mono-500` | 2279 |
| `border-[#E5E7EB]` | `border-mono-900` | 2215 |
| `text-[#A3A3A3]` | `text-mono-700` | 1638 |
| `dark:border-[#1A1A1A]` | `dark:border-mono-200` | 1638 |
| `text-[#525252]` | `text-mono-400` | 1233 |
| `dark:bg-[#0A0A0A]` | `dark:bg-mono-50` | 1046 |
| `dark:bg-[#262626]` | `dark:bg-mono-300` | 1046 |
| `bg-[#F3F4F6]` | `bg-mono-950` | 702 |
| `border-[#D4D4D4]` | `border-mono-800` | 576 |
| `bg-[#F5F5F5]` | `bg-mono-975` | 299 |
| `bg-[#FAFAFA]` | `bg-mono-1000` | 308 |
| `bg-[#404040]` | `bg-mono-350` | 400 |

Works with all Tailwind prefixes: `text-`, `bg-`, `border-`, `fill-`, `stroke-`,
`ring-`, `from-`, `to-`, `via-`, `shadow-`, `outline-`, `hover:`, `dark:`, `sm:`, etc.

## Running the Migration Script

To complete migration on remaining files:

```bash
cd "C:/Users/mrgue/CLAUDE CODE/restaurant-margin/client"
python scripts/migrate-tokens.py
```

Dry run (no writes):
```bash
python scripts/migrate-tokens.py --dry-run
```

## Excluded Files

These files are NOT migrated (GL shaders + JS color palettes):
- `src/components/landing/ShaderBackground.tsx`
- `src/components/landing/MintMistBackground.tsx`
- `src/components/landing/PaperFoldBackground.tsx`
- `src/constants/colors.ts` (hex values used as JS strings for Recharts)

## ESLint Rule (future)

Add to `.eslintrc` to warn on remaining arbitrary hex classes:

```json
{
  "rules": {
    "no-restricted-syntax": [
      "warn",
      {
        "selector": "Literal[value=/\\b(text|bg|border)-\\[#[0-9A-Fa-f]{6}\\]/]",
        "message": "Use design tokens (mono-*, neon-*) instead of arbitrary hex colors."
      }
    ]
  }
}
```
