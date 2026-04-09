/**
 * RecipePlaceholder — Beautiful CSS-only food illustration placeholder
 * Used across recipe cards, detail pages, and public menu.
 *
 * Props:
 *   category — recipe category string (Entree/Plat/Dessert/Boisson/Accompagnement)
 *   name     — recipe name (optional overlay text)
 *   size     — 'sm' | 'md' | 'lg'
 */

interface RecipePlaceholderProps {
  category: string;
  name?: string;
  size?: 'sm' | 'md' | 'lg';
}

// ── Category config ─────────────────────────────────────────────────────
const CATEGORY_CONFIG: Record<string, {
  gradient: string;
  emoji: string;
  patternColor: string;
}> = {
  'Entrée': {
    gradient: 'from-emerald-400 via-green-500 to-teal-600',
    emoji: '\u{1F957}', // salad
    patternColor: 'rgba(255,255,255,0.08)',
  },
  'Entree': {
    gradient: 'from-emerald-400 via-green-500 to-teal-600',
    emoji: '\u{1F957}',
    patternColor: 'rgba(255,255,255,0.08)',
  },
  'Plat': {
    gradient: 'from-orange-400 via-amber-500 to-red-500',
    emoji: '\u{1F356}', // meat on bone
    patternColor: 'rgba(255,255,255,0.07)',
  },
  'Dessert': {
    gradient: 'from-pink-400 via-rose-500 to-purple-600',
    emoji: '\u{1F370}', // cake
    patternColor: 'rgba(255,255,255,0.08)',
  },
  'Boisson': {
    gradient: 'from-cyan-400 via-blue-500 to-indigo-600',
    emoji: '\u{1F964}', // cup with straw
    patternColor: 'rgba(255,255,255,0.07)',
  },
  'Accompagnement': {
    gradient: 'from-amber-400 via-yellow-500 to-orange-500',
    emoji: '\u{1F35E}', // bread
    patternColor: 'rgba(255,255,255,0.07)',
  },
};

const DEFAULT_CONFIG = {
  gradient: 'from-gray-400 via-gray-500 to-gray-600',
  emoji: '\u{1F37D}\uFE0F', // fork and knife with plate
  patternColor: 'rgba(255,255,255,0.06)',
};

// ── Size presets ────────────────────────────────────────────────────────
const SIZE_MAP = {
  sm: {
    height: 'h-12',
    emojiSize: 'text-2xl',
    textSize: 'text-xs',
    padding: 'px-3 py-2',
    dotCount: 3,
  },
  md: {
    height: 'h-36',
    emojiSize: 'text-5xl',
    textSize: 'text-sm',
    padding: 'px-4 py-3',
    dotCount: 6,
  },
  lg: {
    height: 'h-48',
    emojiSize: 'text-7xl',
    textSize: 'text-base',
    padding: 'px-5 py-4',
    dotCount: 8,
  },
};

// ── Dot pattern SVG (radial dots for texture) ───────────────────────────
function DotPattern({ color, count }: { color: string; count: number }) {
  const dots = [];
  // Deterministic pseudo-random positions
  for (let i = 0; i < count * 4; i++) {
    const x = ((i * 37 + 13) % 100);
    const y = ((i * 53 + 7) % 100);
    const r = 1 + (i % 3) * 0.5;
    dots.push(<circle key={i} cx={x} cy={y} r={r} fill={color} />);
  }
  return (
    <svg
      className="absolute inset-0 w-full h-full"
      viewBox="0 0 100 100"
      preserveAspectRatio="none"
    >
      {dots}
    </svg>
  );
}

// ── Diagonal line pattern ───────────────────────────────────────────────
function LinePattern({ color }: { color: string }) {
  return (
    <svg
      className="absolute inset-0 w-full h-full opacity-30"
      viewBox="0 0 100 100"
      preserveAspectRatio="none"
    >
      <defs>
        <pattern id="diag-lines" patternUnits="userSpaceOnUse" width="8" height="8">
          <path d="M-1,1 l2,-2 M0,8 l8,-8 M7,9 l2,-2" stroke={color} strokeWidth="0.5" />
        </pattern>
      </defs>
      <rect width="100" height="100" fill="url(#diag-lines)" />
    </svg>
  );
}

export default function RecipePlaceholder({ category, name, size = 'md' }: RecipePlaceholderProps) {
  const config = CATEGORY_CONFIG[category] || DEFAULT_CONFIG;
  const sizeConfig = SIZE_MAP[size];

  return (
    <div
      className={`relative ${sizeConfig.height} bg-gradient-to-br ${config.gradient} flex flex-col items-center justify-center overflow-hidden group/placeholder`}
    >
      {/* Dot pattern overlay */}
      <DotPattern color={config.patternColor} count={sizeConfig.dotCount} />

      {/* Diagonal line texture */}
      <LinePattern color={config.patternColor} />

      {/* Radial glow behind emoji */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="w-1/2 h-1/2 rounded-full bg-white/10 blur-2xl" />
      </div>

      {/* Large emoji */}
      <span
        className={`${sizeConfig.emojiSize} drop-shadow-lg transition-transform duration-300 group-hover/placeholder:scale-110 select-none relative z-10`}
        role="img"
        aria-label={category}
      >
        {config.emoji}
      </span>

      {/* Recipe name overlay at bottom */}
      {name && size !== 'sm' && (
        <div className={`absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/50 to-transparent ${sizeConfig.padding}`}>
          <p className={`text-white font-bold ${sizeConfig.textSize} leading-tight drop-shadow-md truncate`}>
            {name}
          </p>
        </div>
      )}
    </div>
  );
}

/**
 * RecipeCategoryBadge — Small colored circle with category emoji
 * For inline use (e.g., public menu items)
 */
export function RecipeCategoryBadge({ category }: { category: string }) {
  const config = CATEGORY_CONFIG[category] || DEFAULT_CONFIG;

  return (
    <span
      className={`inline-flex items-center justify-center w-8 h-8 rounded-full bg-gradient-to-br ${config.gradient} shadow-sm flex-shrink-0`}
    >
      <span className="text-sm select-none" role="img" aria-label={category}>
        {config.emoji}
      </span>
    </span>
  );
}

/**
 * getCategoryBorderColor — Returns a Tailwind border color class for category
 * Used for left-border accents in lists
 */
export function getCategoryBorderColor(category: string): string {
  const map: Record<string, string> = {
    'Entrée': 'border-l-emerald-500',
    'Entree': 'border-l-emerald-500',
    'Plat': 'border-l-orange-500',
    'Dessert': 'border-l-pink-500',
    'Boisson': 'border-l-blue-500',
    'Accompagnement': 'border-l-amber-500',
  };
  return map[category] || 'border-l-gray-400';
}

/**
 * getCategoryGradient — Returns gradient classes for a category
 * Useful for hero banners etc.
 */
export function getCategoryGradient(category: string): string {
  const config = CATEGORY_CONFIG[category] || DEFAULT_CONFIG;
  return config.gradient;
}

/**
 * getCategoryEmoji — Returns the emoji for a category
 */
export function getCategoryEmoji(category: string): string {
  const config = CATEGORY_CONFIG[category] || DEFAULT_CONFIG;
  return config.emoji;
}

/**
 * getMarginBadgeColor — Returns badge styling based on margin percent
 */
export function getMarginBadgeColor(marginPercent: number): {
  bg: string;
  text: string;
  label: string;
} {
  if (marginPercent >= 70) return { bg: 'bg-green-500', text: 'text-white', label: 'Excellente' };
  if (marginPercent >= 60) return { bg: 'bg-amber-500', text: 'text-white', label: 'Correcte' };
  return { bg: 'bg-red-500', text: 'text-white', label: 'Faible' };
}
