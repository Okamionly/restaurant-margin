/**
 * FoodIllustration — Pure CSS-only food illustration system
 *
 * Generates beautiful CSS art food icons based on dish name/category.
 * No images, no external libraries — 100% CSS: border-radius, gradients,
 * box-shadow, transforms, pseudo-elements, and keyframe animations.
 *
 * 30+ food illustrations with auto-detection from recipe name keywords.
 *
 * Props:
 *   recipeName — dish name (used for auto-detection)
 *   category   — fallback category (Entree/Plat/Dessert/Boisson/Accompagnement)
 *   size       — 'sm' (32px) | 'md' (64px) | 'lg' (128px) | 'xl' (200px)
 *   animated   — enable hover animations (default true)
 *   className  — additional CSS classes
 */

import { useMemo } from 'react';

// ── Types ────────────────────────────────────────────────────────────────

type FoodType =
  | 'burger' | 'pizza' | 'steak' | 'salmon' | 'salad'
  | 'pasta' | 'soup' | 'cake' | 'wine' | 'coffee'
  | 'sushi' | 'croissant' | 'bread' | 'egg' | 'cheese'
  | 'chicken' | 'shrimp' | 'taco' | 'icecream' | 'fries'
  | 'beer' | 'cocktail' | 'rice' | 'mushroom' | 'carrot'
  | 'tomato' | 'apple' | 'lemon' | 'pepper' | 'onion'
  | 'lobster' | 'donut' | 'cookie' | 'cupcake' | 'default';

type SizeKey = 'sm' | 'md' | 'lg' | 'xl';

interface FoodIllustrationProps {
  recipeName?: string;
  category?: string;
  size?: SizeKey;
  animated?: boolean;
  className?: string;
}

// ── Size configs ─────────────────────────────────────────────────────────

const SIZES: Record<SizeKey, number> = {
  sm: 32,
  md: 64,
  lg: 128,
  xl: 200,
};

// ── Keyword detection map (French + English) ─────────────────────────────

const KEYWORD_MAP: { type: FoodType; keywords: RegExp }[] = [
  { type: 'burger', keywords: /burger|hamburger|cheeseburger|smash/i },
  { type: 'pizza', keywords: /pizza|pizz|margherita|calzone/i },
  { type: 'steak', keywords: /steak|boeuf|b[œe]uf|entrecote|entrecôte|bavette|faux.?filet|rumsteck|t.?bone|rib.?eye|angus|wagyu/i },
  { type: 'salmon', keywords: /saumon|salmon|cabillaud|poisson|truite|sole|bar |dorade|lotte|thon|merlu|colin|flétan|fl[eé]tan|morue/i },
  { type: 'lobster', keywords: /homard|lobster|langouste|langoustine|crabe|crab/i },
  { type: 'shrimp', keywords: /crevette|shrimp|prawn|gambas|scampi/i },
  { type: 'sushi', keywords: /sushi|maki|sashimi|temaki|nigiri|california|chirashi/i },
  { type: 'salad', keywords: /salade|salad|c[eé]sar|caesar|mesclun|roquette/i },
  { type: 'pasta', keywords: /p[aâ]te|pasta|spaghetti|risotto|tagliatelle|penne|fusilli|gnocchi|ravioli|lasagne|carbonara|bolognaise|linguine|fettuccine|macaroni/i },
  { type: 'soup', keywords: /soupe|soup|bouillon|velouté|veloute|consomm[eé]|gazpacho|minestrone|bisque|potage/i },
  { type: 'rice', keywords: /riz |rice|pilaf|biryani|paella|wok/i },
  { type: 'chicken', keywords: /poulet|chicken|volaille|dinde|turkey|canard|duck|pintade/i },
  { type: 'taco', keywords: /taco|burrito|fajita|quesadilla|nacho|enchilada|wrap/i },
  { type: 'fries', keywords: /frite|fries|patate|pomme.?de.?terre|potato|pur[eé]e|gratin/i },
  { type: 'mushroom', keywords: /champignon|mushroom|c[eè]pe|giroll|morille|truffe/i },
  { type: 'egg', keywords: /[oœ]uf|egg|omelette|frittata|bénédicte|benedict/i },
  { type: 'cheese', keywords: /fromage|cheese|raclette|fondue|gruy[eè]re|camembert|brie|mozzarella|burrata/i },
  { type: 'cake', keywords: /g[aâ]teau|cake|fondant|tarte|torte|cheesecake|moelleux|mousse.?choc|brownie|tiramisu|panna.?cotta|cr[eè]me.?brul/i },
  { type: 'icecream', keywords: /glace|ice.?cream|sorbet|sundae|parfait|frozen/i },
  { type: 'donut', keywords: /donut|beignet|doughnut|churro/i },
  { type: 'cookie', keywords: /cookie|biscuit|macaron|madeleine|financier|sablé|sabl[eé]/i },
  { type: 'cupcake', keywords: /cupcake|muffin|chou.?(?:chantilly|cream)/i },
  { type: 'croissant', keywords: /croissant|viennoiserie|pain.?au.?chocolat|brioche/i },
  { type: 'bread', keywords: /pain |bread|baguette|ciabatta|focaccia|naan|pita/i },
  { type: 'wine', keywords: /vin |wine|bordeaux|bourgogne|champagne|prosecco|ros[eé]/i },
  { type: 'beer', keywords: /bi[eè]re|beer|ale|lager|stout|ipa|pilsner/i },
  { type: 'cocktail', keywords: /cocktail|mojito|margarita|spritz|daiquiri|negroni|aperol|sangria/i },
  { type: 'coffee', keywords: /caf[eé]|coffee|espresso|cappuccino|latte|macchiato|th[eé] |tea /i },
  { type: 'tomato', keywords: /tomate|tomato|bruschetta|caprese/i },
  { type: 'carrot', keywords: /carotte|carrot/i },
  { type: 'apple', keywords: /pomme(?!.?de.?terre)|apple|compote|crumble/i },
  { type: 'lemon', keywords: /citron|lemon|lime|agrume/i },
  { type: 'pepper', keywords: /poivron|pepper|piment|chili/i },
  { type: 'onion', keywords: /oignon|onion|[eé]chalote|shallot/i },
];

// Category fallback mapping
const CATEGORY_FOOD_MAP: Record<string, FoodType> = {
  'Entrée': 'salad',
  'Entree': 'salad',
  'Plat': 'steak',
  'Dessert': 'cake',
  'Boisson': 'wine',
  'Accompagnement': 'fries',
};

// ── Detection logic ──────────────────────────────────────────────────────

function detectFoodType(recipeName?: string, category?: string): FoodType {
  if (recipeName) {
    const name = recipeName.toLowerCase();
    for (const { type, keywords } of KEYWORD_MAP) {
      if (keywords.test(name)) return type;
    }
  }
  if (category) {
    return CATEGORY_FOOD_MAP[category] || 'default';
  }
  return 'default';
}

// ── CSS Art Components ───────────────────────────────────────────────────
// Each returns a pure-div CSS illustration scaled to the given pixel size.

function BurgerArt({ s }: { s: number }) {
  const u = s / 32; // unit scale
  return (
    <div className="relative" style={{ width: s, height: s }}>
      {/* Top bun */}
      <div className="absolute" style={{
        width: s * 0.7, height: s * 0.22, left: s * 0.15, top: s * 0.08,
        background: 'linear-gradient(180deg, #F59E0B 0%, #D97706 100%)',
        borderRadius: `${s * 0.35}px ${s * 0.35}px ${s * 0.04}px ${s * 0.04}px`,
      }}>
        {/* Sesame seeds */}
        {[0.25, 0.45, 0.65].map((x, i) => (
          <div key={i} className="absolute bg-yellow-200" style={{
            width: u * 2, height: u * 1.2, borderRadius: '50%',
            left: s * 0.7 * x, top: s * 0.04,
            transform: `rotate(${i * 30 - 15}deg)`,
          }} />
        ))}
      </div>
      {/* Lettuce */}
      <div className="absolute" style={{
        width: s * 0.75, height: s * 0.1, left: s * 0.125, top: s * 0.28,
        background: 'linear-gradient(90deg, #22C55E, #16A34A, #22C55E, #16A34A)',
        borderRadius: `${s * 0.03}px`,
        clipPath: 'polygon(0% 40%, 5% 0%, 15% 50%, 25% 0%, 35% 50%, 45% 0%, 55% 50%, 65% 0%, 75% 50%, 85% 0%, 95% 50%, 100% 0%, 100% 100%, 0% 100%)',
      }} />
      {/* Tomato */}
      <div className="absolute" style={{
        width: s * 0.7, height: s * 0.08, left: s * 0.15, top: s * 0.36,
        background: '#EF4444',
        borderRadius: `${u * 1}px`,
      }} />
      {/* Patty */}
      <div className="absolute" style={{
        width: s * 0.72, height: s * 0.14, left: s * 0.14, top: s * 0.43,
        background: 'linear-gradient(180deg, #78350F 0%, #451A03 100%)',
        borderRadius: `${u * 2}px`,
      }} />
      {/* Cheese dripping */}
      <div className="absolute" style={{
        width: s * 0.74, height: s * 0.08, left: s * 0.13, top: s * 0.55,
        background: '#FBBF24',
        borderRadius: `${u * 1}px`,
        clipPath: 'polygon(0% 0%, 100% 0%, 100% 40%, 90% 100%, 80% 40%, 70% 80%, 60% 40%, 50% 100%, 40% 40%, 30% 80%, 20% 40%, 10% 100%, 0% 40%)',
      }} />
      {/* Bottom bun */}
      <div className="absolute" style={{
        width: s * 0.7, height: s * 0.16, left: s * 0.15, top: s * 0.62,
        background: 'linear-gradient(180deg, #D97706 0%, #B45309 100%)',
        borderRadius: `${s * 0.04}px ${s * 0.04}px ${s * 0.2}px ${s * 0.2}px`,
      }} />
    </div>
  );
}

function PizzaArt({ s }: { s: number }) {
  return (
    <div className="relative" style={{ width: s, height: s }}>
      {/* Pizza slice triangle */}
      <div className="absolute" style={{
        width: 0, height: 0, left: s * 0.15, top: s * 0.12,
        borderLeft: `${s * 0.35}px solid transparent`,
        borderRight: `${s * 0.35}px solid transparent`,
        borderBottom: `${s * 0.7}px solid #F59E0B`,
      }} />
      {/* Cheese layer */}
      <div className="absolute" style={{
        width: 0, height: 0, left: s * 0.18, top: s * 0.22,
        borderLeft: `${s * 0.32}px solid transparent`,
        borderRight: `${s * 0.32}px solid transparent`,
        borderBottom: `${s * 0.55}px solid #FDE68A`,
      }} />
      {/* Crust arc */}
      <div className="absolute" style={{
        width: s * 0.7, height: s * 0.18, left: s * 0.15, top: s * 0.7,
        background: 'linear-gradient(180deg, #D97706, #92400E)',
        borderRadius: `0 0 ${s * 0.35}px ${s * 0.35}px`,
      }} />
      {/* Pepperoni dots */}
      {[
        [0.42, 0.4], [0.52, 0.55], [0.35, 0.58], [0.48, 0.7], [0.38, 0.45],
      ].map(([x, y], i) => (
        <div key={i} className="absolute rounded-full" style={{
          width: s * 0.09, height: s * 0.09,
          left: s * (x as number), top: s * (y as number),
          background: 'radial-gradient(circle at 35% 35%, #DC2626, #991B1B)',
        }} />
      ))}
    </div>
  );
}

function SteakArt({ s }: { s: number }) {
  return (
    <div className="relative" style={{ width: s, height: s }}>
      {/* Steak body */}
      <div className="absolute" style={{
        width: s * 0.72, height: s * 0.48, left: s * 0.14, top: s * 0.26,
        background: 'linear-gradient(135deg, #78350F 0%, #92400E 30%, #7C2D12 70%, #451A03 100%)',
        borderRadius: `${s * 0.25}px ${s * 0.3}px ${s * 0.2}px ${s * 0.35}px`,
      }}>
        {/* Grill marks */}
        {[0.2, 0.4, 0.6, 0.8].map((x, i) => (
          <div key={i} className="absolute" style={{
            width: s * 0.04, height: s * 0.38,
            background: 'rgba(0,0,0,0.3)',
            borderRadius: s * 0.02,
            left: `${x * 100}%`, top: '12%',
            transform: 'rotate(-25deg)',
          }} />
        ))}
      </div>
      {/* Fat marbling */}
      <div className="absolute rounded-full" style={{
        width: s * 0.12, height: s * 0.06,
        left: s * 0.25, top: s * 0.38,
        background: 'rgba(255,255,255,0.15)',
      }} />
      {/* Rosemary sprig */}
      <div className="absolute" style={{
        width: s * 0.25, height: s * 0.02, left: s * 0.6, top: s * 0.22,
        background: '#166534', borderRadius: s * 0.01,
        transform: 'rotate(-20deg)',
      }}>
        {[0.1, 0.3, 0.5, 0.7, 0.9].map((p, i) => (
          <div key={i} className="absolute bg-green-700 rounded-full" style={{
            width: s * 0.035, height: s * 0.02,
            left: `${p * 100}%`, top: i % 2 === 0 ? -s * 0.015 : s * 0.015,
            transform: `rotate(${i % 2 === 0 ? -40 : 40}deg)`,
          }} />
        ))}
      </div>
    </div>
  );
}

function SalmonArt({ s }: { s: number }) {
  return (
    <div className="relative" style={{ width: s, height: s }}>
      {/* Fish body */}
      <div className="absolute" style={{
        width: s * 0.65, height: s * 0.35, left: s * 0.08, top: s * 0.3,
        background: 'linear-gradient(180deg, #FB923C 0%, #EA580C 50%, #F97316 100%)',
        borderRadius: `${s * 0.15}px ${s * 0.05}px ${s * 0.05}px ${s * 0.15}px`,
      }}>
        {/* Diagonal lines (fish scales) */}
        {[0.2, 0.35, 0.5, 0.65, 0.8].map((x, i) => (
          <div key={i} className="absolute" style={{
            width: s * 0.015, height: '80%',
            background: 'rgba(255,255,255,0.25)',
            left: `${x * 100}%`, top: '10%',
            transform: 'rotate(30deg)',
          }} />
        ))}
      </div>
      {/* Tail */}
      <div className="absolute" style={{
        width: s * 0.18, height: s * 0.28, left: s * 0.64, top: s * 0.33,
        background: 'linear-gradient(135deg, #EA580C, #C2410C)',
        clipPath: 'polygon(0% 50%, 100% 0%, 80% 50%, 100% 100%)',
      }} />
      {/* Eye */}
      <div className="absolute rounded-full" style={{
        width: s * 0.06, height: s * 0.06,
        left: s * 0.14, top: s * 0.38,
        background: 'white',
        boxShadow: `inset ${s * 0.02}px 0 0 #111`,
      }} />
      {/* Lemon slice */}
      <div className="absolute rounded-full" style={{
        width: s * 0.18, height: s * 0.18,
        left: s * 0.3, top: s * 0.12,
        background: 'radial-gradient(circle, #FEF3C7 30%, #FDE047 60%, #FACC15 100%)',
        border: `${s * 0.01}px solid #EAB308`,
      }} />
    </div>
  );
}

function SaladArt({ s }: { s: number }) {
  return (
    <div className="relative" style={{ width: s, height: s }}>
      {/* Bowl */}
      <div className="absolute" style={{
        width: s * 0.78, height: s * 0.35, left: s * 0.11, top: s * 0.52,
        background: 'linear-gradient(180deg, #E5E7EB 0%, #D1D5DB 100%)',
        borderRadius: `0 0 ${s * 0.39}px ${s * 0.39}px`,
      }} />
      {/* Leaves poking out */}
      {[
        { x: 0.2, y: 0.22, rot: -30, color: '#22C55E' },
        { x: 0.35, y: 0.18, rot: -10, color: '#16A34A' },
        { x: 0.5, y: 0.15, rot: 5, color: '#4ADE80' },
        { x: 0.62, y: 0.2, rot: 20, color: '#22C55E' },
        { x: 0.72, y: 0.28, rot: 35, color: '#15803D' },
      ].map((leaf, i) => (
        <div key={i} className="absolute" style={{
          width: s * 0.16, height: s * 0.28,
          left: s * leaf.x, top: s * leaf.y,
          background: leaf.color,
          borderRadius: `${s * 0.08}px ${s * 0.02}px ${s * 0.08}px ${s * 0.02}px`,
          transform: `rotate(${leaf.rot}deg)`,
          opacity: 0.9,
        }} />
      ))}
      {/* Tomato chunks */}
      {[[0.3, 0.38], [0.55, 0.35]].map(([x, y], i) => (
        <div key={i} className="absolute rounded-full" style={{
          width: s * 0.08, height: s * 0.08,
          left: s * (x as number), top: s * (y as number),
          background: '#EF4444',
        }} />
      ))}
      {/* Crouton */}
      <div className="absolute" style={{
        width: s * 0.07, height: s * 0.07,
        left: s * 0.44, top: s * 0.4,
        background: '#D97706',
        borderRadius: s * 0.01,
        transform: 'rotate(25deg)',
      }} />
    </div>
  );
}

function PastaArt({ s }: { s: number }) {
  return (
    <div className="relative" style={{ width: s, height: s }}>
      {/* Plate rim */}
      <div className="absolute rounded-full" style={{
        width: s * 0.85, height: s * 0.45, left: s * 0.075, top: s * 0.45,
        background: 'linear-gradient(180deg, #F3F4F6 0%, #E5E7EB 100%)',
        border: `${s * 0.015}px solid #D1D5DB`,
      }} />
      {/* Spaghetti wavy lines */}
      {[0, 1, 2, 3, 4, 5].map((i) => (
        <svg key={i} className="absolute" style={{
          width: s * 0.55, height: s * 0.08,
          left: s * 0.22, top: s * (0.34 + i * 0.045),
        }} viewBox="0 0 100 20">
          <path
            d={`M 0 10 Q 15 ${i % 2 === 0 ? 0 : 20} 30 10 Q 45 ${i % 2 === 0 ? 20 : 0} 60 10 Q 75 ${i % 2 === 0 ? 0 : 20} 100 10`}
            fill="none"
            stroke="#EAB308"
            strokeWidth="3"
            strokeLinecap="round"
          />
        </svg>
      ))}
      {/* Tomato sauce splash */}
      <div className="absolute rounded-full" style={{
        width: s * 0.2, height: s * 0.12,
        left: s * 0.4, top: s * 0.42,
        background: 'radial-gradient(ellipse, #DC2626 40%, transparent 100%)',
        opacity: 0.7,
      }} />
      {/* Basil leaf */}
      <div className="absolute" style={{
        width: s * 0.1, height: s * 0.08,
        left: s * 0.48, top: s * 0.38,
        background: '#22C55E',
        borderRadius: `${s * 0.05}px ${s * 0.01}px`,
        transform: 'rotate(-15deg)',
      }} />
    </div>
  );
}

function SoupArt({ s, animated }: { s: number; animated: boolean }) {
  return (
    <div className="relative" style={{ width: s, height: s }}>
      {/* Bowl */}
      <div className="absolute" style={{
        width: s * 0.75, height: s * 0.38, left: s * 0.125, top: s * 0.48,
        background: 'linear-gradient(180deg, #E5E7EB 0%, #D1D5DB 100%)',
        borderRadius: `0 0 ${s * 0.38}px ${s * 0.38}px`,
        border: `${s * 0.012}px solid #9CA3AF`,
        borderTop: 'none',
      }} />
      {/* Soup surface */}
      <div className="absolute" style={{
        width: s * 0.7, height: s * 0.12, left: s * 0.15, top: s * 0.46,
        background: 'linear-gradient(180deg, #F97316 0%, #EA580C 100%)',
        borderRadius: '50%',
      }} />
      {/* Steam lines */}
      {[0.35, 0.5, 0.65].map((x, i) => (
        <svg key={i} className="absolute" style={{
          width: s * 0.08, height: s * 0.2,
          left: s * x, top: s * 0.1,
          animation: animated ? `food-steam ${1.5 + i * 0.3}s ease-in-out infinite` : undefined,
          opacity: 0.5,
        }} viewBox="0 0 20 50">
          <path
            d={`M 10 50 Q ${i % 2 === 0 ? 0 : 20} 35 10 25 Q ${i % 2 === 0 ? 20 : 0} 15 10 0`}
            fill="none"
            stroke="#9CA3AF"
            strokeWidth="2.5"
            strokeLinecap="round"
          />
        </svg>
      ))}
      {/* Bread crouton floating */}
      <div className="absolute" style={{
        width: s * 0.06, height: s * 0.05,
        left: s * 0.4, top: s * 0.45,
        background: '#D97706',
        borderRadius: s * 0.01,
      }} />
    </div>
  );
}

function CakeArt({ s }: { s: number }) {
  return (
    <div className="relative" style={{ width: s, height: s }}>
      {/* Bottom layer */}
      <div className="absolute" style={{
        width: s * 0.65, height: s * 0.2, left: s * 0.175, top: s * 0.6,
        background: 'linear-gradient(180deg, #92400E 0%, #78350F 100%)',
        borderRadius: `${s * 0.02}px ${s * 0.02}px ${s * 0.06}px ${s * 0.06}px`,
      }} />
      {/* Cream layer */}
      <div className="absolute" style={{
        width: s * 0.65, height: s * 0.06, left: s * 0.175, top: s * 0.56,
        background: '#FEF3C7',
        borderRadius: s * 0.01,
      }} />
      {/* Top layer */}
      <div className="absolute" style={{
        width: s * 0.65, height: s * 0.18, left: s * 0.175, top: s * 0.4,
        background: 'linear-gradient(180deg, #B45309 0%, #92400E 100%)',
        borderRadius: `${s * 0.06}px ${s * 0.06}px ${s * 0.02}px ${s * 0.02}px`,
      }} />
      {/* Frosting drip */}
      <div className="absolute" style={{
        width: s * 0.68, height: s * 0.08, left: s * 0.16, top: s * 0.38,
        background: '#F472B6',
        borderRadius: `${s * 0.04}px`,
        clipPath: 'polygon(0% 0%, 100% 0%, 100% 50%, 88% 100%, 78% 50%, 68% 80%, 58% 50%, 48% 100%, 38% 50%, 28% 80%, 18% 50%, 8% 100%, 0% 50%)',
      }} />
      {/* Cherry */}
      <div className="absolute rounded-full" style={{
        width: s * 0.1, height: s * 0.1,
        left: s * 0.45, top: s * 0.22,
        background: 'radial-gradient(circle at 35% 35%, #F87171, #DC2626, #991B1B)',
      }}>
        {/* Cherry stem */}
        <div className="absolute" style={{
          width: s * 0.015, height: s * 0.08,
          left: '45%', top: -s * 0.06,
          background: '#166534',
          borderRadius: s * 0.01,
          transform: 'rotate(10deg)',
        }} />
      </div>
    </div>
  );
}

function WineArt({ s }: { s: number }) {
  return (
    <div className="relative" style={{ width: s, height: s }}>
      {/* Glass bowl */}
      <div className="absolute" style={{
        width: s * 0.4, height: s * 0.35, left: s * 0.3, top: s * 0.1,
        background: 'linear-gradient(180deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%)',
        border: `${s * 0.012}px solid rgba(200,200,200,0.4)`,
        borderRadius: `${s * 0.2}px ${s * 0.2}px ${s * 0.05}px ${s * 0.05}px`,
        overflow: 'hidden',
      }}>
        {/* Wine liquid */}
        <div className="absolute" style={{
          width: '100%', height: '55%', bottom: 0, left: 0,
          background: 'linear-gradient(180deg, #881337 0%, #4C0519 100%)',
          borderRadius: `0 0 ${s * 0.04}px ${s * 0.04}px`,
        }} />
      </div>
      {/* Stem */}
      <div className="absolute" style={{
        width: s * 0.03, height: s * 0.28,
        left: s * 0.485, top: s * 0.44,
        background: 'linear-gradient(180deg, rgba(200,200,200,0.5), rgba(200,200,200,0.3))',
      }} />
      {/* Base */}
      <div className="absolute" style={{
        width: s * 0.3, height: s * 0.06, left: s * 0.35, top: s * 0.72,
        background: 'linear-gradient(180deg, rgba(200,200,200,0.4), rgba(200,200,200,0.2))',
        borderRadius: `0 0 ${s * 0.03}px ${s * 0.03}px`,
      }} />
      {/* Shine */}
      <div className="absolute" style={{
        width: s * 0.04, height: s * 0.12,
        left: s * 0.38, top: s * 0.15,
        background: 'rgba(255,255,255,0.3)',
        borderRadius: s * 0.02,
        transform: 'rotate(-10deg)',
      }} />
    </div>
  );
}

function CoffeeArt({ s, animated }: { s: number; animated: boolean }) {
  return (
    <div className="relative" style={{ width: s, height: s }}>
      {/* Cup body */}
      <div className="absolute" style={{
        width: s * 0.5, height: s * 0.38, left: s * 0.18, top: s * 0.38,
        background: 'linear-gradient(180deg, #FFFFFF 0%, #F3F4F6 100%)',
        borderRadius: `${s * 0.02}px ${s * 0.02}px ${s * 0.08}px ${s * 0.08}px`,
        border: `${s * 0.012}px solid #D1D5DB`,
      }}>
        {/* Coffee liquid */}
        <div className="absolute" style={{
          width: '85%', height: '75%', left: '7.5%', top: '8%',
          background: 'linear-gradient(180deg, #78350F 0%, #451A03 100%)',
          borderRadius: `${s * 0.02}px`,
        }} />
      </div>
      {/* Handle */}
      <div className="absolute" style={{
        width: s * 0.12, height: s * 0.18,
        left: s * 0.66, top: s * 0.44,
        border: `${s * 0.02}px solid #D1D5DB`,
        borderLeft: 'none',
        borderRadius: `0 ${s * 0.08}px ${s * 0.08}px 0`,
        background: 'transparent',
      }} />
      {/* Saucer */}
      <div className="absolute" style={{
        width: s * 0.7, height: s * 0.08, left: s * 0.12, top: s * 0.76,
        background: 'linear-gradient(180deg, #E5E7EB, #D1D5DB)',
        borderRadius: `0 0 ${s * 0.04}px ${s * 0.04}px`,
      }} />
      {/* Steam */}
      {[0.32, 0.42, 0.52].map((x, i) => (
        <svg key={i} className="absolute" style={{
          width: s * 0.07, height: s * 0.18,
          left: s * x, top: s * 0.08,
          animation: animated ? `food-steam ${1.3 + i * 0.4}s ease-in-out infinite` : undefined,
          opacity: 0.4,
        }} viewBox="0 0 20 50">
          <path
            d={`M 10 50 Q ${i % 2 === 0 ? 2 : 18} 30 10 15 Q ${i % 2 === 0 ? 18 : 2} 5 10 0`}
            fill="none"
            stroke="#9CA3AF"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </svg>
      ))}
    </div>
  );
}

function SushiArt({ s }: { s: number }) {
  return (
    <div className="relative" style={{ width: s, height: s }}>
      {/* Maki roll 1 */}
      <div className="absolute rounded-full" style={{
        width: s * 0.3, height: s * 0.3, left: s * 0.08, top: s * 0.35,
        background: '#111827',
        border: `${s * 0.02}px solid #1F2937`,
      }}>
        <div className="absolute rounded-full" style={{
          width: '70%', height: '70%', left: '15%', top: '15%',
          background: 'linear-gradient(135deg, #FFFFFF 0%, #F3F4F6 100%)',
        }}>
          <div className="absolute rounded-full" style={{
            width: '50%', height: '50%', left: '25%', top: '25%',
            background: '#F97316',
          }} />
        </div>
      </div>
      {/* Maki roll 2 */}
      <div className="absolute rounded-full" style={{
        width: s * 0.3, height: s * 0.3, left: s * 0.35, top: s * 0.25,
        background: '#111827',
        border: `${s * 0.02}px solid #1F2937`,
      }}>
        <div className="absolute rounded-full" style={{
          width: '70%', height: '70%', left: '15%', top: '15%',
          background: 'linear-gradient(135deg, #FFFFFF 0%, #F3F4F6 100%)',
        }}>
          <div className="absolute rounded-full" style={{
            width: '50%', height: '50%', left: '25%', top: '25%',
            background: '#EF4444',
          }} />
        </div>
      </div>
      {/* Nigiri */}
      <div className="absolute" style={{
        width: s * 0.22, height: s * 0.28, left: s * 0.6, top: s * 0.38,
      }}>
        {/* Rice base */}
        <div className="absolute" style={{
          width: '100%', height: '50%', bottom: 0,
          background: '#FFFFFF',
          borderRadius: `${s * 0.02}px ${s * 0.02}px ${s * 0.08}px ${s * 0.08}px`,
          border: '1px solid #E5E7EB',
        }} />
        {/* Salmon on top */}
        <div className="absolute" style={{
          width: '110%', height: '45%', left: '-5%', top: '15%',
          background: 'linear-gradient(90deg, #FB923C, #F97316)',
          borderRadius: `${s * 0.04}px`,
        }} />
      </div>
      {/* Chopsticks */}
      <div className="absolute" style={{
        width: s * 0.6, height: s * 0.015,
        left: s * 0.35, top: s * 0.15,
        background: '#92400E',
        borderRadius: s * 0.01,
        transform: 'rotate(25deg)',
      }} />
      <div className="absolute" style={{
        width: s * 0.6, height: s * 0.015,
        left: s * 0.38, top: s * 0.13,
        background: '#78350F',
        borderRadius: s * 0.01,
        transform: 'rotate(28deg)',
      }} />
    </div>
  );
}

function CroissantArt({ s }: { s: number }) {
  return (
    <div className="relative" style={{ width: s, height: s }}>
      {/* Crescent shape via overlapping circles */}
      <div className="absolute" style={{
        width: s * 0.7, height: s * 0.5, left: s * 0.15, top: s * 0.25,
        background: 'linear-gradient(135deg, #F59E0B 0%, #D97706 40%, #B45309 100%)',
        borderRadius: `${s * 0.25}px ${s * 0.25}px ${s * 0.1}px ${s * 0.1}px`,
        clipPath: 'ellipse(50% 50% at 50% 50%)',
        transform: 'rotate(-10deg)',
      }} />
      {/* Layered ridges */}
      {[0.3, 0.42, 0.54, 0.66].map((x, i) => (
        <div key={i} className="absolute" style={{
          width: s * 0.04, height: s * 0.35,
          left: s * x, top: s * 0.3,
          background: `rgba(120, 53, 15, ${0.15 + i * 0.05})`,
          borderRadius: s * 0.02,
          transform: `rotate(${-15 + i * 8}deg)`,
        }} />
      ))}
      {/* Curved tips */}
      <div className="absolute" style={{
        width: s * 0.12, height: s * 0.12,
        left: s * 0.1, top: s * 0.5,
        background: '#D97706',
        borderRadius: `0 0 ${s * 0.06}px ${s * 0.06}px`,
        transform: 'rotate(30deg)',
      }} />
      <div className="absolute" style={{
        width: s * 0.12, height: s * 0.12,
        left: s * 0.75, top: s * 0.48,
        background: '#D97706',
        borderRadius: `0 0 ${s * 0.06}px ${s * 0.06}px`,
        transform: 'rotate(-30deg)',
      }} />
      {/* Glaze shine */}
      <div className="absolute" style={{
        width: s * 0.15, height: s * 0.06,
        left: s * 0.38, top: s * 0.32,
        background: 'rgba(255,255,255,0.25)',
        borderRadius: '50%',
        transform: 'rotate(-10deg)',
      }} />
    </div>
  );
}

function BreadArt({ s }: { s: number }) {
  return (
    <div className="relative" style={{ width: s, height: s }}>
      {/* Loaf body */}
      <div className="absolute" style={{
        width: s * 0.75, height: s * 0.4, left: s * 0.125, top: s * 0.3,
        background: 'linear-gradient(180deg, #D97706 0%, #B45309 60%, #92400E 100%)',
        borderRadius: `${s * 0.2}px ${s * 0.2}px ${s * 0.05}px ${s * 0.05}px`,
      }}>
        {/* Score lines */}
        {[0.25, 0.45, 0.65].map((x, i) => (
          <div key={i} className="absolute" style={{
            width: s * 0.15, height: s * 0.015,
            left: `${x * 100}%`, top: '20%',
            background: 'rgba(120,53,15,0.4)',
            borderRadius: s * 0.01,
            transform: `rotate(${-20 + i * 10}deg)`,
          }} />
        ))}
      </div>
      {/* Flour dusting */}
      {[0.3, 0.5, 0.65, 0.4, 0.55].map((x, i) => (
        <div key={i} className="absolute rounded-full" style={{
          width: s * 0.03, height: s * 0.03,
          left: s * x, top: s * (0.32 + (i * 0.04)),
          background: 'rgba(255,255,255,0.3)',
        }} />
      ))}
    </div>
  );
}

function EggArt({ s }: { s: number }) {
  return (
    <div className="relative" style={{ width: s, height: s }}>
      {/* Egg white */}
      <div className="absolute" style={{
        width: s * 0.55, height: s * 0.55, left: s * 0.22, top: s * 0.22,
        background: 'radial-gradient(ellipse at 50% 60%, #FFFFFF 50%, #F3F4F6 75%, rgba(243,244,246,0) 100%)',
        borderRadius: '50% 50% 50% 50% / 60% 60% 40% 40%',
      }} />
      {/* Yolk */}
      <div className="absolute rounded-full" style={{
        width: s * 0.28, height: s * 0.28, left: s * 0.36, top: s * 0.33,
        background: 'radial-gradient(circle at 40% 40%, #FDE047, #F59E0B, #D97706)',
        boxShadow: `0 ${s * 0.01}px ${s * 0.03}px rgba(0,0,0,0.1)`,
      }}>
        {/* Yolk shine */}
        <div className="absolute rounded-full" style={{
          width: '25%', height: '25%', left: '25%', top: '20%',
          background: 'rgba(255,255,255,0.4)',
        }} />
      </div>
    </div>
  );
}

function CheeseArt({ s }: { s: number }) {
  return (
    <div className="relative" style={{ width: s, height: s }}>
      {/* Cheese wedge */}
      <div className="absolute" style={{
        width: s * 0.7, height: s * 0.5, left: s * 0.15, top: s * 0.25,
        background: 'linear-gradient(135deg, #FDE047 0%, #FACC15 50%, #EAB308 100%)',
        clipPath: 'polygon(0% 100%, 50% 0%, 100% 100%)',
      }} />
      {/* Cheese side face */}
      <div className="absolute" style={{
        width: s * 0.35, height: s * 0.5, left: s * 0.5, top: s * 0.25,
        background: 'linear-gradient(135deg, #EAB308 0%, #CA8A04 100%)',
        clipPath: 'polygon(0% 0%, 100% 100%, 0% 100%)',
      }} />
      {/* Holes */}
      {[
        [0.35, 0.55, 0.08], [0.48, 0.42, 0.06], [0.3, 0.68, 0.05],
        [0.55, 0.62, 0.07], [0.42, 0.7, 0.04],
      ].map(([x, y, r], i) => (
        <div key={i} className="absolute rounded-full" style={{
          width: s * (r as number), height: s * (r as number),
          left: s * (x as number), top: s * (y as number),
          background: 'radial-gradient(circle, #B45309 0%, #92400E 100%)',
        }} />
      ))}
    </div>
  );
}

function ChickenArt({ s }: { s: number }) {
  return (
    <div className="relative" style={{ width: s, height: s }}>
      {/* Drumstick body */}
      <div className="absolute" style={{
        width: s * 0.35, height: s * 0.5, left: s * 0.25, top: s * 0.15,
        background: 'linear-gradient(180deg, #D97706 0%, #B45309 100%)',
        borderRadius: `${s * 0.15}px ${s * 0.15}px ${s * 0.08}px ${s * 0.08}px`,
        transform: 'rotate(-15deg)',
      }} />
      {/* Bone */}
      <div className="absolute" style={{
        width: s * 0.06, height: s * 0.22, left: s * 0.42, top: s * 0.58,
        background: '#FEF3C7',
        borderRadius: s * 0.03,
        transform: 'rotate(-15deg)',
      }}>
        <div className="absolute rounded-full" style={{
          width: s * 0.09, height: s * 0.06,
          left: -s * 0.015, bottom: 0,
          background: '#FEF3C7',
        }} />
      </div>
      {/* Crispy texture */}
      {[0.32, 0.4, 0.35, 0.42].map((x, i) => (
        <div key={i} className="absolute rounded-full" style={{
          width: s * 0.06, height: s * 0.04,
          left: s * x, top: s * (0.25 + i * 0.08),
          background: 'rgba(120,53,15,0.3)',
          transform: `rotate(${i * 25}deg)`,
        }} />
      ))}
      {/* Herb sprig */}
      <div className="absolute" style={{
        width: s * 0.08, height: s * 0.06,
        left: s * 0.58, top: s * 0.3,
        background: '#22C55E',
        borderRadius: `${s * 0.04}px ${s * 0.01}px`,
        transform: 'rotate(20deg)',
      }} />
    </div>
  );
}

function ShrimpArt({ s }: { s: number }) {
  return (
    <div className="relative" style={{ width: s, height: s }}>
      {/* Shrimp body curve */}
      <svg className="absolute inset-0" viewBox="0 0 100 100" style={{ width: s, height: s }}>
        <path
          d="M 65 25 Q 80 35 75 55 Q 70 70 55 75 Q 40 78 30 70"
          fill="none"
          stroke="#F97316"
          strokeWidth="10"
          strokeLinecap="round"
        />
        {/* Segments */}
        {[35, 45, 55, 65].map((y, i) => (
          <line key={i} x1={50 + i * 3} y1={y} x2={70 - i * 2} y2={y + 3}
            stroke="rgba(234,88,12,0.4)" strokeWidth="1" />
        ))}
        {/* Tail */}
        <path d="M 65 22 L 72 12 M 65 22 L 58 14 M 65 22 L 65 10"
          fill="none" stroke="#FB923C" strokeWidth="3" strokeLinecap="round" />
      </svg>
      {/* Eye */}
      <div className="absolute rounded-full" style={{
        width: s * 0.04, height: s * 0.04,
        left: s * 0.28, top: s * 0.65,
        background: '#111',
      }} />
    </div>
  );
}

function TacoArt({ s }: { s: number }) {
  return (
    <div className="relative" style={{ width: s, height: s }}>
      {/* Tortilla shell */}
      <div className="absolute" style={{
        width: s * 0.7, height: s * 0.55, left: s * 0.15, top: s * 0.25,
        background: 'linear-gradient(180deg, #F59E0B 0%, #D97706 100%)',
        borderRadius: `${s * 0.35}px ${s * 0.35}px 0 0`,
        border: `${s * 0.015}px solid #B45309`,
        borderBottom: 'none',
      }} />
      {/* Fillings */}
      <div className="absolute" style={{
        width: s * 0.55, height: s * 0.15, left: s * 0.225, top: s * 0.35,
        background: '#22C55E',
        borderRadius: `${s * 0.05}px`,
        clipPath: 'polygon(5% 100%, 0% 0%, 20% 60%, 40% 0%, 60% 60%, 80% 0%, 100% 60%, 95% 100%)',
      }} />
      <div className="absolute rounded-full" style={{
        width: s * 0.1, height: s * 0.08, left: s * 0.35, top: s * 0.38,
        background: '#EF4444',
      }} />
      <div className="absolute rounded-full" style={{
        width: s * 0.08, height: s * 0.06, left: s * 0.5, top: s * 0.4,
        background: '#FBBF24',
      }} />
      {/* Meat */}
      <div className="absolute" style={{
        width: s * 0.45, height: s * 0.1, left: s * 0.275, top: s * 0.45,
        background: '#78350F',
        borderRadius: s * 0.02,
      }} />
    </div>
  );
}

function IcecreamArt({ s }: { s: number }) {
  return (
    <div className="relative" style={{ width: s, height: s }}>
      {/* Cone */}
      <div className="absolute" style={{
        width: 0, height: 0,
        left: s * 0.28, top: s * 0.45,
        borderLeft: `${s * 0.22}px solid transparent`,
        borderRight: `${s * 0.22}px solid transparent`,
        borderTop: `${s * 0.42}px solid #D97706`,
      }} />
      {/* Waffle pattern on cone */}
      {[0.5, 0.6, 0.7].map((y, i) => (
        <div key={i} className="absolute" style={{
          width: s * (0.35 - i * 0.07), height: s * 0.01,
          left: s * (0.325 + i * 0.035), top: s * y,
          background: 'rgba(120,53,15,0.3)',
        }} />
      ))}
      {/* Scoop 1 (bottom) */}
      <div className="absolute rounded-full" style={{
        width: s * 0.32, height: s * 0.32, left: s * 0.34, top: s * 0.25,
        background: 'radial-gradient(circle at 40% 35%, #FDE68A, #F59E0B)',
        boxShadow: `0 ${s * 0.01}px ${s * 0.02}px rgba(0,0,0,0.1)`,
      }} />
      {/* Scoop 2 (top) */}
      <div className="absolute rounded-full" style={{
        width: s * 0.28, height: s * 0.28, left: s * 0.28, top: s * 0.08,
        background: 'radial-gradient(circle at 40% 35%, #FECDD3, #F472B6)',
        boxShadow: `0 ${s * 0.01}px ${s * 0.02}px rgba(0,0,0,0.1)`,
      }} />
      {/* Chocolate drip */}
      <div className="absolute" style={{
        width: s * 0.05, height: s * 0.08,
        left: s * 0.52, top: s * 0.35,
        background: '#78350F',
        borderRadius: `0 0 ${s * 0.025}px ${s * 0.025}px`,
      }} />
    </div>
  );
}

function FriesArt({ s }: { s: number }) {
  return (
    <div className="relative" style={{ width: s, height: s }}>
      {/* Red container */}
      <div className="absolute" style={{
        width: s * 0.5, height: s * 0.4, left: s * 0.25, top: s * 0.48,
        background: 'linear-gradient(180deg, #DC2626 0%, #B91C1C 100%)',
        borderRadius: `${s * 0.03}px ${s * 0.03}px ${s * 0.06}px ${s * 0.06}px`,
        clipPath: 'polygon(5% 0%, 95% 0%, 100% 100%, 0% 100%)',
      }} />
      {/* Fries sticking out */}
      {[
        { x: 0.3, h: 0.35, rot: -12 },
        { x: 0.37, h: 0.42, rot: -5 },
        { x: 0.44, h: 0.38, rot: 2 },
        { x: 0.51, h: 0.44, rot: 8 },
        { x: 0.58, h: 0.36, rot: 15 },
        { x: 0.34, h: 0.3, rot: -18 },
        { x: 0.55, h: 0.32, rot: 20 },
      ].map((f, i) => (
        <div key={i} className="absolute" style={{
          width: s * 0.055, height: s * f.h,
          left: s * f.x, top: s * (0.5 - f.h),
          background: 'linear-gradient(180deg, #FDE047 0%, #FACC15 50%, #EAB308 100%)',
          borderRadius: s * 0.015,
          transform: `rotate(${f.rot}deg)`,
          transformOrigin: 'bottom center',
        }} />
      ))}
    </div>
  );
}

function BeerArt({ s }: { s: number }) {
  return (
    <div className="relative" style={{ width: s, height: s }}>
      {/* Glass body */}
      <div className="absolute" style={{
        width: s * 0.4, height: s * 0.55, left: s * 0.25, top: s * 0.25,
        background: 'rgba(255,255,255,0.15)',
        border: `${s * 0.012}px solid rgba(200,200,200,0.3)`,
        borderRadius: `${s * 0.02}px ${s * 0.02}px ${s * 0.04}px ${s * 0.04}px`,
        overflow: 'hidden',
      }}>
        {/* Beer liquid */}
        <div className="absolute" style={{
          width: '100%', height: '80%', bottom: 0,
          background: 'linear-gradient(180deg, #FDE047 0%, #F59E0B 100%)',
        }} />
        {/* Foam */}
        <div className="absolute" style={{
          width: '100%', height: '25%', top: 0,
          background: '#FFFBEB',
          borderRadius: `0 0 ${s * 0.1}px ${s * 0.1}px`,
        }} />
      </div>
      {/* Handle */}
      <div className="absolute" style={{
        width: s * 0.14, height: s * 0.25,
        left: s * 0.63, top: s * 0.35,
        border: `${s * 0.025}px solid rgba(200,200,200,0.3)`,
        borderLeft: 'none',
        borderRadius: `0 ${s * 0.07}px ${s * 0.07}px 0`,
      }} />
      {/* Bubbles */}
      {[0.35, 0.42, 0.5, 0.38, 0.48].map((x, i) => (
        <div key={i} className="absolute rounded-full" style={{
          width: s * 0.025, height: s * 0.025,
          left: s * x, top: s * (0.45 + i * 0.06),
          background: 'rgba(255,255,255,0.3)',
        }} />
      ))}
    </div>
  );
}

function CocktailArt({ s }: { s: number }) {
  return (
    <div className="relative" style={{ width: s, height: s }}>
      {/* Glass bowl (martini shape) */}
      <div className="absolute" style={{
        width: s * 0.55, height: s * 0.35, left: s * 0.225, top: s * 0.15,
        clipPath: 'polygon(0% 0%, 100% 0%, 65% 100%, 35% 100%)',
        background: 'rgba(255,255,255,0.1)',
        border: `${s * 0.01}px solid rgba(200,200,200,0.3)`,
        overflow: 'hidden',
      }}>
        {/* Liquid */}
        <div className="absolute" style={{
          width: '100%', height: '60%', bottom: 0,
          background: 'linear-gradient(180deg, #F472B6, #EC4899)',
        }} />
      </div>
      {/* Stem */}
      <div className="absolute" style={{
        width: s * 0.025, height: s * 0.25,
        left: s * 0.488, top: s * 0.49,
        background: 'rgba(200,200,200,0.4)',
      }} />
      {/* Base */}
      <div className="absolute" style={{
        width: s * 0.25, height: s * 0.04,
        left: s * 0.375, top: s * 0.74,
        background: 'rgba(200,200,200,0.3)',
        borderRadius: `0 0 ${s * 0.02}px ${s * 0.02}px`,
      }} />
      {/* Garnish - lemon slice */}
      <div className="absolute rounded-full" style={{
        width: s * 0.12, height: s * 0.12,
        left: s * 0.6, top: s * 0.12,
        background: 'radial-gradient(circle, #FEF9C3 30%, #FDE047 100%)',
        border: `${s * 0.01}px solid #EAB308`,
      }} />
      {/* Straw */}
      <div className="absolute" style={{
        width: s * 0.02, height: s * 0.35,
        left: s * 0.56, top: s * 0.05,
        background: '#EF4444',
        borderRadius: s * 0.01,
        transform: 'rotate(15deg)',
      }} />
    </div>
  );
}

function RiceArt({ s }: { s: number }) {
  return (
    <div className="relative" style={{ width: s, height: s }}>
      {/* Bowl */}
      <div className="absolute" style={{
        width: s * 0.75, height: s * 0.32, left: s * 0.125, top: s * 0.52,
        background: 'linear-gradient(180deg, #1F2937 0%, #111827 100%)',
        borderRadius: `0 0 ${s * 0.38}px ${s * 0.38}px`,
        border: `${s * 0.01}px solid #374151`,
        borderTop: 'none',
      }} />
      {/* Rice mound */}
      <div className="absolute" style={{
        width: s * 0.6, height: s * 0.28, left: s * 0.2, top: s * 0.32,
        background: 'radial-gradient(ellipse, #FFFFFF 0%, #F3F4F6 70%, #E5E7EB 100%)',
        borderRadius: `${s * 0.3}px ${s * 0.3}px ${s * 0.05}px ${s * 0.05}px`,
      }} />
      {/* Rice grain texture */}
      {[0.3, 0.4, 0.5, 0.6, 0.35, 0.55].map((x, i) => (
        <div key={i} className="absolute" style={{
          width: s * 0.03, height: s * 0.015,
          left: s * x, top: s * (0.38 + (i % 3) * 0.04),
          background: 'rgba(0,0,0,0.05)',
          borderRadius: '50%',
          transform: `rotate(${i * 30}deg)`,
        }} />
      ))}
    </div>
  );
}

function MushroomArt({ s }: { s: number }) {
  return (
    <div className="relative" style={{ width: s, height: s }}>
      {/* Cap */}
      <div className="absolute" style={{
        width: s * 0.55, height: s * 0.3, left: s * 0.225, top: s * 0.2,
        background: 'linear-gradient(180deg, #92400E 0%, #78350F 100%)',
        borderRadius: `${s * 0.28}px ${s * 0.28}px ${s * 0.05}px ${s * 0.05}px`,
      }}>
        {/* Spots */}
        {[[0.2, 0.3], [0.5, 0.15], [0.7, 0.4]].map(([x, y], i) => (
          <div key={i} className="absolute rounded-full" style={{
            width: s * 0.06, height: s * 0.05,
            left: `${(x as number) * 100}%`, top: `${(y as number) * 100}%`,
            background: 'rgba(255,255,255,0.2)',
          }} />
        ))}
      </div>
      {/* Gills */}
      <div className="absolute" style={{
        width: s * 0.45, height: s * 0.06, left: s * 0.275, top: s * 0.48,
        background: '#D1D5DB',
        borderRadius: `0 0 ${s * 0.03}px ${s * 0.03}px`,
      }} />
      {/* Stem */}
      <div className="absolute" style={{
        width: s * 0.18, height: s * 0.28, left: s * 0.41, top: s * 0.5,
        background: 'linear-gradient(180deg, #F3F4F6 0%, #E5E7EB 100%)',
        borderRadius: `${s * 0.02}px ${s * 0.02}px ${s * 0.06}px ${s * 0.06}px`,
      }} />
    </div>
  );
}

function CarrotArt({ s }: { s: number }) {
  return (
    <div className="relative" style={{ width: s, height: s }}>
      {/* Carrot body */}
      <div className="absolute" style={{
        width: s * 0.22, height: s * 0.55, left: s * 0.39, top: s * 0.3,
        background: 'linear-gradient(180deg, #F97316 0%, #EA580C 50%, #C2410C 100%)',
        borderRadius: `${s * 0.08}px ${s * 0.08}px ${s * 0.11}px ${s * 0.11}px`,
        transform: 'rotate(10deg)',
      }}>
        {/* Ridges */}
        {[0.25, 0.45, 0.65].map((y, i) => (
          <div key={i} className="absolute" style={{
            width: '90%', height: s * 0.01, left: '5%', top: `${y * 100}%`,
            background: 'rgba(0,0,0,0.1)',
          }} />
        ))}
      </div>
      {/* Green tops */}
      {[-20, 0, 20].map((rot, i) => (
        <div key={i} className="absolute" style={{
          width: s * 0.04, height: s * 0.2,
          left: s * (0.48 + i * 0.02), top: s * 0.1,
          background: '#22C55E',
          borderRadius: `${s * 0.02}px ${s * 0.02}px 0 0`,
          transform: `rotate(${rot}deg)`,
          transformOrigin: 'bottom center',
        }} />
      ))}
    </div>
  );
}

function TomatoArt({ s }: { s: number }) {
  return (
    <div className="relative" style={{ width: s, height: s }}>
      {/* Tomato body */}
      <div className="absolute rounded-full" style={{
        width: s * 0.55, height: s * 0.5, left: s * 0.225, top: s * 0.3,
        background: 'radial-gradient(circle at 40% 35%, #F87171, #EF4444, #DC2626)',
        boxShadow: `inset -${s * 0.02}px -${s * 0.02}px ${s * 0.04}px rgba(0,0,0,0.15)`,
      }}>
        {/* Highlight */}
        <div className="absolute rounded-full" style={{
          width: '20%', height: '15%', left: '25%', top: '15%',
          background: 'rgba(255,255,255,0.3)',
        }} />
      </div>
      {/* Stem */}
      <div className="absolute" style={{
        width: s * 0.04, height: s * 0.08, left: s * 0.48, top: s * 0.22,
        background: '#166534',
        borderRadius: s * 0.02,
      }} />
      {/* Leaves */}
      {[-40, -10, 20, 50].map((rot, i) => (
        <div key={i} className="absolute" style={{
          width: s * 0.1, height: s * 0.04,
          left: s * 0.45, top: s * 0.28,
          background: '#22C55E',
          borderRadius: `${s * 0.02}px`,
          transform: `rotate(${rot}deg)`,
          transformOrigin: '20% 50%',
        }} />
      ))}
    </div>
  );
}

function AppleArt({ s }: { s: number }) {
  return (
    <div className="relative" style={{ width: s, height: s }}>
      {/* Apple body */}
      <div className="absolute rounded-full" style={{
        width: s * 0.52, height: s * 0.52, left: s * 0.24, top: s * 0.3,
        background: 'radial-gradient(circle at 35% 30%, #F87171, #EF4444, #B91C1C)',
        boxShadow: `inset -${s * 0.02}px -${s * 0.02}px ${s * 0.04}px rgba(0,0,0,0.2)`,
      }}>
        <div className="absolute rounded-full" style={{
          width: '15%', height: '12%', left: '22%', top: '15%',
          background: 'rgba(255,255,255,0.35)',
        }} />
      </div>
      {/* Stem */}
      <div className="absolute" style={{
        width: s * 0.025, height: s * 0.1,
        left: s * 0.49, top: s * 0.2,
        background: '#78350F',
        borderRadius: s * 0.01,
        transform: 'rotate(5deg)',
      }} />
      {/* Leaf */}
      <div className="absolute" style={{
        width: s * 0.12, height: s * 0.06,
        left: s * 0.51, top: s * 0.22,
        background: '#22C55E',
        borderRadius: `${s * 0.03}px ${s * 0.06}px`,
        transform: 'rotate(25deg)',
      }} />
    </div>
  );
}

function LemonArt({ s }: { s: number }) {
  return (
    <div className="relative" style={{ width: s, height: s }}>
      {/* Lemon body */}
      <div className="absolute" style={{
        width: s * 0.55, height: s * 0.42, left: s * 0.225, top: s * 0.29,
        background: 'radial-gradient(ellipse at 40% 40%, #FDE047, #FACC15, #EAB308)',
        borderRadius: `${s * 0.2}px ${s * 0.25}px ${s * 0.2}px ${s * 0.25}px`,
        boxShadow: `inset -${s * 0.02}px -${s * 0.01}px ${s * 0.03}px rgba(0,0,0,0.1)`,
      }}>
        <div className="absolute rounded-full" style={{
          width: '15%', height: '12%', left: '25%', top: '18%',
          background: 'rgba(255,255,255,0.3)',
        }} />
      </div>
      {/* Tip nubs */}
      <div className="absolute rounded-full" style={{
        width: s * 0.06, height: s * 0.05, left: s * 0.19, top: s * 0.46,
        background: '#EAB308',
      }} />
      <div className="absolute rounded-full" style={{
        width: s * 0.06, height: s * 0.05, left: s * 0.75, top: s * 0.44,
        background: '#EAB308',
      }} />
    </div>
  );
}

function PepperArt({ s }: { s: number }) {
  return (
    <div className="relative" style={{ width: s, height: s }}>
      {/* Bell pepper body */}
      <div className="absolute" style={{
        width: s * 0.45, height: s * 0.48, left: s * 0.275, top: s * 0.32,
        background: 'linear-gradient(135deg, #EF4444 0%, #DC2626 50%, #B91C1C 100%)',
        borderRadius: `${s * 0.15}px ${s * 0.15}px ${s * 0.22}px ${s * 0.22}px`,
      }}>
        {/* Highlight */}
        <div className="absolute" style={{
          width: '15%', height: '30%', left: '20%', top: '10%',
          background: 'rgba(255,255,255,0.2)',
          borderRadius: s * 0.05,
        }} />
      </div>
      {/* Stem */}
      <div className="absolute" style={{
        width: s * 0.06, height: s * 0.1,
        left: s * 0.47, top: s * 0.22,
        background: '#166534',
        borderRadius: `${s * 0.03}px ${s * 0.03}px 0 0`,
      }} />
    </div>
  );
}

function OnionArt({ s }: { s: number }) {
  return (
    <div className="relative" style={{ width: s, height: s }}>
      {/* Onion body */}
      <div className="absolute" style={{
        width: s * 0.5, height: s * 0.48, left: s * 0.25, top: s * 0.32,
        background: 'radial-gradient(ellipse at 45% 40%, #FDE68A, #D97706, #92400E)',
        borderRadius: `${s * 0.22}px ${s * 0.22}px ${s * 0.25}px ${s * 0.25}px`,
      }}>
        {/* Layer lines */}
        {[0.3, 0.5, 0.7].map((y, i) => (
          <div key={i} className="absolute" style={{
            width: '70%', height: s * 0.008, left: '15%', top: `${y * 100}%`,
            background: 'rgba(120,53,15,0.2)',
            borderRadius: '50%',
          }} />
        ))}
      </div>
      {/* Top sprout */}
      <div className="absolute" style={{
        width: s * 0.03, height: s * 0.15,
        left: s * 0.485, top: s * 0.18,
        background: 'linear-gradient(180deg, #22C55E, #166534)',
        borderRadius: `${s * 0.015}px ${s * 0.015}px 0 0`,
      }} />
    </div>
  );
}

function LobsterArt({ s }: { s: number }) {
  return (
    <div className="relative" style={{ width: s, height: s }}>
      {/* Body */}
      <div className="absolute" style={{
        width: s * 0.35, height: s * 0.3, left: s * 0.325, top: s * 0.35,
        background: 'linear-gradient(180deg, #DC2626, #B91C1C)',
        borderRadius: `${s * 0.1}px ${s * 0.1}px ${s * 0.05}px ${s * 0.05}px`,
      }} />
      {/* Tail */}
      <div className="absolute" style={{
        width: s * 0.2, height: s * 0.15,
        left: s * 0.4, top: s * 0.62,
        background: '#DC2626',
        borderRadius: `0 0 ${s * 0.1}px ${s * 0.1}px`,
        clipPath: 'polygon(20% 0%, 80% 0%, 100% 100%, 50% 70%, 0% 100%)',
      }} />
      {/* Claws */}
      {[{ x: 0.12, rot: 30 }, { x: 0.7, rot: -30 }].map((claw, i) => (
        <div key={i} className="absolute" style={{
          width: s * 0.18, height: s * 0.12,
          left: s * claw.x, top: s * 0.28,
          background: '#EF4444',
          borderRadius: `${s * 0.06}px`,
          transform: `rotate(${claw.rot}deg)`,
        }}>
          {/* Pincer gap */}
          <div className="absolute" style={{
            width: '15%', height: '80%',
            right: i === 0 ? 0 : 'auto',
            left: i === 1 ? 0 : 'auto',
            top: '10%',
            background: 'var(--food-ill-bg, #FFFFFF)',
          }} />
        </div>
      ))}
      {/* Antennae */}
      <div className="absolute" style={{
        width: s * 0.4, height: s * 0.01,
        left: s * 0.15, top: s * 0.33,
        background: '#EF4444',
        borderRadius: s * 0.005,
        transform: 'rotate(-15deg)',
      }} />
      <div className="absolute" style={{
        width: s * 0.4, height: s * 0.01,
        left: s * 0.45, top: s * 0.32,
        background: '#EF4444',
        borderRadius: s * 0.005,
        transform: 'rotate(15deg)',
      }} />
      {/* Eyes */}
      {[0.38, 0.55].map((x, i) => (
        <div key={i} className="absolute rounded-full" style={{
          width: s * 0.04, height: s * 0.04,
          left: s * x, top: s * 0.35,
          background: '#111',
        }} />
      ))}
    </div>
  );
}

function DonutArt({ s }: { s: number }) {
  return (
    <div className="relative" style={{ width: s, height: s }}>
      {/* Donut ring */}
      <div className="absolute rounded-full" style={{
        width: s * 0.6, height: s * 0.6, left: s * 0.2, top: s * 0.2,
        background: 'linear-gradient(135deg, #D97706, #B45309)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        {/* Hole */}
        <div className="rounded-full" style={{
          width: s * 0.22, height: s * 0.22,
          background: 'var(--food-ill-bg, #FFFFFF)',
        }} />
      </div>
      {/* Glaze */}
      <div className="absolute rounded-full" style={{
        width: s * 0.58, height: s * 0.35, left: s * 0.21, top: s * 0.2,
        background: 'linear-gradient(180deg, #F472B6, #EC4899)',
        borderRadius: `${s * 0.3}px ${s * 0.3}px ${s * 0.15}px ${s * 0.15}px`,
        clipPath: 'polygon(0% 0%, 100% 0%, 95% 60%, 85% 100%, 75% 60%, 65% 90%, 55% 60%, 45% 100%, 35% 60%, 25% 90%, 15% 60%, 5% 100%)',
      }} />
      {/* Sprinkles */}
      {[
        { x: 0.32, y: 0.25, c: '#EF4444', r: 20 },
        { x: 0.48, y: 0.22, c: '#3B82F6', r: -10 },
        { x: 0.62, y: 0.28, c: '#22C55E', r: 45 },
        { x: 0.38, y: 0.35, c: '#F59E0B', r: -30 },
        { x: 0.55, y: 0.32, c: '#8B5CF6', r: 15 },
      ].map((sp, i) => (
        <div key={i} className="absolute" style={{
          width: s * 0.04, height: s * 0.015,
          left: s * sp.x, top: s * sp.y,
          background: sp.c,
          borderRadius: s * 0.01,
          transform: `rotate(${sp.r}deg)`,
        }} />
      ))}
    </div>
  );
}

function CookieArt({ s }: { s: number }) {
  return (
    <div className="relative" style={{ width: s, height: s }}>
      {/* Cookie body */}
      <div className="absolute rounded-full" style={{
        width: s * 0.6, height: s * 0.6, left: s * 0.2, top: s * 0.2,
        background: 'radial-gradient(circle at 45% 40%, #D97706, #B45309, #92400E)',
        boxShadow: `inset 0 -${s * 0.02}px ${s * 0.03}px rgba(0,0,0,0.2)`,
      }}>
        {/* Chocolate chips */}
        {[
          [0.25, 0.3], [0.55, 0.2], [0.4, 0.55],
          [0.65, 0.5], [0.3, 0.65], [0.5, 0.4],
        ].map(([x, y], i) => (
          <div key={i} className="absolute rounded-full" style={{
            width: s * 0.06, height: s * 0.05,
            left: `${(x as number) * 100}%`, top: `${(y as number) * 100}%`,
            background: 'radial-gradient(circle, #451A03, #1C0A00)',
          }} />
        ))}
      </div>
    </div>
  );
}

function CupcakeArt({ s }: { s: number }) {
  return (
    <div className="relative" style={{ width: s, height: s }}>
      {/* Wrapper */}
      <div className="absolute" style={{
        width: s * 0.45, height: s * 0.3, left: s * 0.275, top: s * 0.55,
        background: 'linear-gradient(180deg, #EC4899, #DB2777)',
        clipPath: 'polygon(8% 0%, 92% 0%, 100% 100%, 0% 100%)',
      }}>
        {/* Wrapper ridges */}
        {[0.15, 0.3, 0.45, 0.6, 0.75].map((x, i) => (
          <div key={i} className="absolute" style={{
            width: s * 0.01, height: '100%', left: `${x * 100}%`,
            background: 'rgba(255,255,255,0.15)',
          }} />
        ))}
      </div>
      {/* Frosting swirl */}
      <div className="absolute" style={{
        width: s * 0.42, height: s * 0.25, left: s * 0.29, top: s * 0.32,
        background: 'linear-gradient(180deg, #FDE68A 0%, #FBBF24 100%)',
        borderRadius: `${s * 0.15}px ${s * 0.15}px ${s * 0.03}px ${s * 0.03}px`,
      }}>
        {/* Swirl lines */}
        <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 60">
          <path d="M 10 50 Q 25 10 50 30 Q 75 50 90 15" fill="none"
            stroke="rgba(255,255,255,0.3)" strokeWidth="3" />
        </svg>
      </div>
      {/* Cherry on top */}
      <div className="absolute rounded-full" style={{
        width: s * 0.1, height: s * 0.1,
        left: s * 0.45, top: s * 0.22,
        background: 'radial-gradient(circle at 35% 35%, #F87171, #DC2626)',
      }} />
    </div>
  );
}

function DefaultFoodArt({ s }: { s: number }) {
  return (
    <div className="relative" style={{ width: s, height: s }}>
      {/* Plate */}
      <div className="absolute rounded-full" style={{
        width: s * 0.75, height: s * 0.35, left: s * 0.125, top: s * 0.45,
        background: 'linear-gradient(180deg, #F3F4F6 0%, #E5E7EB 100%)',
        border: `${s * 0.015}px solid #D1D5DB`,
      }} />
      {/* Fork */}
      <div className="absolute" style={{
        width: s * 0.04, height: s * 0.45, left: s * 0.22, top: s * 0.15,
        background: '#9CA3AF',
        borderRadius: s * 0.02,
        transform: 'rotate(-15deg)',
      }} />
      {/* Knife */}
      <div className="absolute" style={{
        width: s * 0.04, height: s * 0.45, left: s * 0.7, top: s * 0.15,
        background: 'linear-gradient(180deg, #9CA3AF 60%, #6B7280 100%)',
        borderRadius: `${s * 0.02}px ${s * 0.02}px ${s * 0.01}px ${s * 0.01}px`,
        transform: 'rotate(15deg)',
      }} />
      {/* Generic food on plate */}
      <div className="absolute" style={{
        width: s * 0.35, height: s * 0.15, left: s * 0.325, top: s * 0.42,
        background: 'linear-gradient(135deg, #F59E0B, #D97706)',
        borderRadius: `${s * 0.08}px`,
      }} />
    </div>
  );
}

// ── Art router ───────────────────────────────────────────────────────────

const ART_MAP: Record<FoodType, React.FC<{ s: number; animated: boolean }>> = {
  burger: ({ s }) => <BurgerArt s={s} />,
  pizza: ({ s }) => <PizzaArt s={s} />,
  steak: ({ s }) => <SteakArt s={s} />,
  salmon: ({ s }) => <SalmonArt s={s} />,
  salad: ({ s }) => <SaladArt s={s} />,
  pasta: ({ s }) => <PastaArt s={s} />,
  soup: ({ s, animated }) => <SoupArt s={s} animated={animated} />,
  cake: ({ s }) => <CakeArt s={s} />,
  wine: ({ s }) => <WineArt s={s} />,
  coffee: ({ s, animated }) => <CoffeeArt s={s} animated={animated} />,
  sushi: ({ s }) => <SushiArt s={s} />,
  croissant: ({ s }) => <CroissantArt s={s} />,
  bread: ({ s }) => <BreadArt s={s} />,
  egg: ({ s }) => <EggArt s={s} />,
  cheese: ({ s }) => <CheeseArt s={s} />,
  chicken: ({ s }) => <ChickenArt s={s} />,
  shrimp: ({ s }) => <ShrimpArt s={s} />,
  taco: ({ s }) => <TacoArt s={s} />,
  icecream: ({ s }) => <IcecreamArt s={s} />,
  fries: ({ s }) => <FriesArt s={s} />,
  beer: ({ s }) => <BeerArt s={s} />,
  cocktail: ({ s }) => <CocktailArt s={s} />,
  rice: ({ s }) => <RiceArt s={s} />,
  mushroom: ({ s }) => <MushroomArt s={s} />,
  carrot: ({ s }) => <CarrotArt s={s} />,
  tomato: ({ s }) => <TomatoArt s={s} />,
  apple: ({ s }) => <AppleArt s={s} />,
  lemon: ({ s }) => <LemonArt s={s} />,
  pepper: ({ s }) => <PepperArt s={s} />,
  onion: ({ s }) => <OnionArt s={s} />,
  lobster: ({ s }) => <LobsterArt s={s} />,
  donut: ({ s }) => <DonutArt s={s} />,
  cookie: ({ s }) => <CookieArt s={s} />,
  cupcake: ({ s }) => <CupcakeArt s={s} />,
  default: ({ s }) => <DefaultFoodArt s={s} />,
};

// ── Global CSS keyframes (injected once) ─────────────────────────────────

let stylesInjected = false;
function injectStyles() {
  if (stylesInjected) return;
  stylesInjected = true;
  const style = document.createElement('style');
  style.textContent = `
    @keyframes food-steam {
      0%, 100% { opacity: 0.2; transform: translateY(0) scaleX(1); }
      50% { opacity: 0.6; transform: translateY(-6px) scaleX(1.15); }
    }
    @keyframes food-wobble {
      0%, 100% { transform: rotate(0deg) scale(1); }
      25% { transform: rotate(-2deg) scale(1.02); }
      75% { transform: rotate(2deg) scale(1.02); }
    }
    @keyframes food-bounce {
      0%, 100% { transform: translateY(0); }
      50% { transform: translateY(-4px); }
    }
    @keyframes food-garnish {
      0% { opacity: 0; transform: scale(0.5) rotate(-20deg); }
      100% { opacity: 1; transform: scale(1) rotate(0deg); }
    }
    .food-ill-hover:hover {
      animation: food-wobble 0.6s ease-in-out;
    }
    .food-ill-hover:hover .food-ill-bounce {
      animation: food-bounce 0.5s ease-in-out infinite;
    }
  `;
  document.head.appendChild(style);
}

// ── Main Component ───────────────────────────────────────────────────────

export default function FoodIllustration({
  recipeName,
  category,
  size = 'md',
  animated = true,
  className = '',
}: FoodIllustrationProps) {
  const foodType = useMemo(() => detectFoodType(recipeName, category), [recipeName, category]);
  const px = SIZES[size];
  const ArtComponent = ART_MAP[foodType];

  // Inject global keyframe styles once
  if (typeof document !== 'undefined') {
    injectStyles();
  }

  return (
    <div
      className={`inline-flex items-center justify-center overflow-hidden ${animated ? 'food-ill-hover' : ''} ${className}`}
      style={{
        width: px,
        height: px,
        ['--food-ill-bg' as string]: 'var(--tw-bg-opacity, #FFFFFF)',
      }}
      title={recipeName || category || 'food'}
      role="img"
      aria-label={`Illustration: ${recipeName || category || 'dish'}`}
    >
      <div className={animated ? 'food-ill-bounce' : ''}>
        <ArtComponent s={px} animated={animated} />
      </div>
    </div>
  );
}

// ── Utility: get detected food type (for external use) ───────────────────

export function getFoodType(recipeName?: string, category?: string): FoodType {
  return detectFoodType(recipeName, category);
}

// ── Utility: all available food types ────────────────────────────────────

export const FOOD_TYPES: FoodType[] = [
  'burger', 'pizza', 'steak', 'salmon', 'salad', 'pasta', 'soup', 'cake',
  'wine', 'coffee', 'sushi', 'croissant', 'bread', 'egg', 'cheese', 'chicken',
  'shrimp', 'taco', 'icecream', 'fries', 'beer', 'cocktail', 'rice', 'mushroom',
  'carrot', 'tomato', 'apple', 'lemon', 'pepper', 'onion', 'lobster', 'donut',
  'cookie', 'cupcake',
];
