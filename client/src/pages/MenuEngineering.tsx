import { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import {
  Target, BarChart3, Plus,
  Calendar, Award, ArrowUpDown, ArrowUp, ArrowDown, Printer, Upload,
  Loader2, ShoppingBag, DollarSign, Percent, ChefHat,
  RefreshCw, SlidersHorizontal, AlertTriangle, Lightbulb, Shield,
  Sparkles, TrendingUp, X, Check, Star, Zap,
  GripVertical, PieChart, FileDown, TrendingDown,
  ArrowRightLeft, CircleDollarSign, Eye,
} from 'lucide-react';
import { useToast } from '../hooks/useToast';
import { useTranslation } from '../hooks/useTranslation';
import Modal from '../components/Modal';

const API = '';

// ── Unit conversion divisor (price is always per bulk unit: kg/L) ────────
function getUnitDivisor(unit: string): number {
  const u = (unit || '').toLowerCase().trim();
  if (u === 'g') return 1000;
  if (u === 'mg') return 1000000;
  if (u === 'cl') return 100;
  if (u === 'ml') return 1000;
  if (u === 'dl') return 10;
  return 1;
}

function authHeaders(): Record<string, string> {
  const token = localStorage.getItem('token');
  const rid = localStorage.getItem('activeRestaurantId');
  const headers: Record<string, string> = { 'Content-Type': 'application/json' };
  if (token) headers['Authorization'] = `Bearer ${token}`;
  if (rid) headers['X-Restaurant-Id'] = rid;
  return headers;
}

// ── Types ────────────────────────────────────────────────────────────────────
interface EngineeringItem {
  id: number;
  name: string;
  category: string;
  sellingPrice: number;
  costPerPortion: number;
  margin: number;
  marginPercent: number;
  salesQty: number;
  salesRevenue: number;
  popularity: number;
  quadrant: 'star' | 'puzzle' | 'plow' | 'dog';
}

interface EngineeringData {
  engineering: EngineeringItem[];
  totalSales: number;
  avgMargin: number;
  days: number;
}

interface RecipeIngredient {
  id: number;
  quantity: number;
  wastePercent: number;
  ingredient: {
    id: number;
    name: string;
    unit: string;
    pricePerUnit: number;
    allergens?: string[];
  };
}

interface Recipe {
  id: number;
  name: string;
  category: string;
  sellingPrice: number;
  nbPortions: number;
  ingredients: RecipeIngredient[];
  margin?: {
    costPerPortion: number;
    marginAmount: number;
    marginPercent: number;
  };
}

interface MenuSale {
  id: number;
  recipeId: number;
  quantity: number;
  revenue: number;
  date: string;
}

// ── Quadrant config ──────────────────────────────────────────────────────────
const QUADRANT_CONFIG = {
  star: {
    label: 'Vedettes',
    emoji: '⭐',
    color: 'emerald',
    bg: 'bg-emerald-50 dark:bg-emerald-950/30',
    border: 'border-emerald-200 dark:border-emerald-800',
    text: 'text-emerald-700 dark:text-emerald-300',
    badge: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/50 dark:text-emerald-300',
    dot: '#10b981',
    action: 'METTRE EN AVANT',
    desc: 'Haute marge + populaire',
    recommendation: 'Mettre en avant sur le menu, maintenir la qualité',
  },
  puzzle: {
    label: 'Énigmes',
    emoji: '🧩',
    color: 'teal',
    bg: 'bg-teal-50 dark:bg-teal-950/30',
    border: 'border-teal-200 dark:border-teal-800',
    text: 'text-teal-700 dark:text-teal-300',
    badge: 'bg-teal-100 text-teal-800 dark:bg-teal-900/50 dark:text-teal-300',
    dot: '#3b82f6',
    action: 'DÉVELOPPER',
    desc: 'Haute marge + peu populaire',
    recommendation: 'Améliorer la visibilité, repositionner sur le menu',
  },
  plow: {
    label: 'Valeurs sûres',
    emoji: '🐮',
    color: 'amber',
    bg: 'bg-amber-50 dark:bg-amber-950/30',
    border: 'border-amber-200 dark:border-amber-800',
    text: 'text-amber-700 dark:text-amber-300',
    badge: 'bg-amber-100 text-amber-800 dark:bg-amber-900/50 dark:text-amber-300',
    dot: '#f59e0b',
    action: 'REFORMULER',
    desc: 'Basse marge + populaire',
    recommendation: 'Augmenter le prix ou réduire le coût des ingrédients',
  },
  dog: {
    label: 'Poids morts',
    emoji: '🐕',
    color: 'red',
    bg: 'bg-red-50 dark:bg-red-950/30',
    border: 'border-red-200 dark:border-red-800',
    text: 'text-red-700 dark:text-red-300',
    badge: 'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300',
    dot: '#ef4444',
    action: 'REMPLACER',
    desc: 'Basse marge + peu populaire',
    recommendation: 'Envisager de retirer du menu ou reformuler',
  },
} as const;

type Quadrant = keyof typeof QUADRANT_CONFIG;
type SortField = 'name' | 'category' | 'sellingPrice' | 'costPerPortion' | 'margin' | 'marginPercent' | 'salesQty' | 'salesRevenue' | 'quadrant';
type SortDir = 'asc' | 'desc';
type Period = '7' | '30' | '90' | 'custom';

// ── Helpers ──────────────────────────────────────────────────────────────────
function fmt(n: number, decimals = 2) {
  return n.toLocaleString('fr-FR', { minimumFractionDigits: decimals, maximumFractionDigits: decimals });
}

function fmtEur(n: number) {
  return `${fmt(n, 2)} €`;
}

// ── Allergen helpers ──────────────────────────────────────────────────────────
const ALLERGEN_COLORS: Record<string, string> = {
  gluten: 'bg-amber-100 text-amber-800 dark:bg-amber-900/50 dark:text-amber-300',
  lactose: 'bg-teal-100 text-teal-800 dark:bg-teal-900/50 dark:text-teal-300',
  lait: 'bg-teal-100 text-teal-800 dark:bg-teal-900/50 dark:text-teal-300',
  noix: 'bg-orange-100 text-orange-800 dark:bg-orange-900/50 dark:text-orange-300',
  'fruits à coque': 'bg-orange-100 text-orange-800 dark:bg-orange-900/50 dark:text-orange-300',
  arachide: 'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300',
  soja: 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300',
  oeuf: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300',
  oeufs: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300',
  poisson: 'bg-cyan-100 text-cyan-800 dark:bg-cyan-900/50 dark:text-cyan-300',
  crustacé: 'bg-pink-100 text-pink-800 dark:bg-pink-900/50 dark:text-pink-300',
  crustacés: 'bg-pink-100 text-pink-800 dark:bg-pink-900/50 dark:text-pink-300',
  mollusque: 'bg-purple-100 text-purple-800 dark:bg-purple-900/50 dark:text-purple-300',
  mollusques: 'bg-purple-100 text-purple-800 dark:bg-purple-900/50 dark:text-purple-300',
  sésame: 'bg-lime-100 text-lime-800 dark:bg-lime-900/50 dark:text-lime-300',
  céleri: 'bg-teal-100 text-teal-800 dark:bg-teal-900/50 dark:text-teal-300',
  moutarde: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300',
  lupin: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/50 dark:text-indigo-300',
  sulfites: 'bg-violet-100 text-violet-800 dark:bg-violet-900/50 dark:text-violet-300',
};

function getAllergenColor(allergen: string): string {
  const key = allergen.toLowerCase().trim();
  return ALLERGEN_COLORS[key] || 'bg-[#F5F5F5] text-[#111111] dark:bg-[#171717] dark:text-[#A3A3A3]';
}

function getRecipeAllergens(recipe: Recipe): string[] {
  const set = new Set<string>();
  (recipe.ingredients || []).forEach(ri => {
    (ri.ingredient?.allergens || []).forEach(a => set.add(a));
  });
  return Array.from(set).sort();
}

// ── Profitability score ───────────────────────────────────────────────────────
function computeProfitabilityScore(item: EngineeringItem, maxSalesQty: number): number {
  // Margin % component (40%) — scale to 0-100 where 80%+ margin = 100
  const marginScore = Math.min(100, (item.marginPercent / 80) * 100);
  // Popularity component (30%) — relative to max sales
  const popScore = maxSalesQty > 0 ? (item.salesQty / maxSalesQty) * 100 : 0;
  // Food cost ratio component (30%) — lower is better, invert
  const costRatio = item.sellingPrice > 0 ? (item.costPerPortion / item.sellingPrice) * 100 : 100;
  const costScore = Math.max(0, 100 - costRatio);
  return Math.round(marginScore * 0.4 + popScore * 0.3 + costScore * 0.3);
}

function scoreColor(score: number): string {
  if (score > 70) return 'text-emerald-600 dark:text-emerald-400';
  if (score >= 40) return 'text-amber-600 dark:text-amber-400';
  return 'text-red-600 dark:text-red-400';
}

function scoreBg(score: number): string {
  if (score > 70) return 'bg-emerald-100 dark:bg-emerald-900/40';
  if (score >= 40) return 'bg-amber-100 dark:bg-amber-900/40';
  return 'bg-red-100 dark:bg-red-900/40';
}

// ── AI Recommendation generator ─────────────────────────────────────────────
function generateRecommendations(items: EngineeringItem[]): { icon: string; text: string; type: 'success' | 'info' | 'warning' | 'danger' }[] {
  const tips: { icon: string; text: string; type: 'success' | 'info' | 'warning' | 'danger' }[] = [];
  const stars = items.filter(i => i.quadrant === 'star');
  const puzzles = items.filter(i => i.quadrant === 'puzzle');
  const plows = items.filter(i => i.quadrant === 'plow');
  const dogs = items.filter(i => i.quadrant === 'dog');

  // Stars recommendations
  if (stars.length > 0) {
    const topStar = stars.sort((a, b) => b.salesRevenue - a.salesRevenue)[0];
    tips.push({
      icon: '⭐',
      text: `Mettez "${topStar.name}" en avant sur la carte (vedette n°1 avec ${fmtEur(topStar.salesRevenue)} de CA et ${fmt(topStar.marginPercent, 1)}% de marge).`,
      type: 'success',
    });
  }

  // Puzzles recommendations
  if (puzzles.length > 0) {
    const topPuzzle = puzzles.sort((a, b) => b.marginPercent - a.marginPercent)[0];
    const suggestedDiscount = Math.round(topPuzzle.sellingPrice * 0.05 * 100) / 100;
    tips.push({
      icon: '🧩',
      text: `"${topPuzzle.name}" a une excellente marge (${fmt(topPuzzle.marginPercent, 1)}%) mais se vend peu. Augmentez sa visibilité ou proposez une réduction de ${fmtEur(suggestedDiscount)} pour stimuler les ventes.`,
      type: 'info',
    });
  }

  // Plows recommendations
  if (plows.length > 0) {
    const topPlow = plows.sort((a, b) => b.salesQty - a.salesQty)[0];
    const suggestedIncrease = Math.round(topPlow.sellingPrice * 0.08 * 100) / 100;
    tips.push({
      icon: '🐮',
      text: `"${topPlow.name}" est populaire (${topPlow.salesQty} ventes) mais la marge est faible. Augmentez le prix de ${fmtEur(suggestedIncrease)} sans perdre de clients.`,
      type: 'warning',
    });
  }

  // Dogs recommendations
  if (dogs.length > 0) {
    const worstDog = dogs.sort((a, b) => a.marginPercent - b.marginPercent)[0];
    tips.push({
      icon: '🐕',
      text: `Envisagez de retirer "${worstDog.name}" du menu (marge de seulement ${fmt(worstDog.marginPercent, 1)}% et ${worstDog.salesQty} ventes). Reformulez la recette ou remplacez-le.`,
      type: 'danger',
    });
  }

  // General optimization tips
  const avgMargin = items.length > 0 ? items.reduce((s, i) => s + i.marginPercent, 0) / items.length : 0;
  if (avgMargin < 65) {
    tips.push({
      icon: '📊',
      text: `Votre marge moyenne est de ${fmt(avgMargin, 1)}%, en dessous de l'objectif de 65%. Concentrez-vous sur la réduction des coûts matières ou l'augmentation des prix des plats les plus populaires.`,
      type: 'warning',
    });
  }

  if (dogs.length > stars.length && items.length > 4) {
    tips.push({
      icon: '🔄',
      text: `Vous avez ${dogs.length} poids morts contre ${stars.length} vedettes. Réduisez votre carte en supprimant les plats peu rentables pour simplifier la cuisine et améliorer la marge globale.`,
      type: 'danger',
    });
  }

  return tips.slice(0, 5);
}

// ── BCG Matrix Component ─────────────────────────────────────────────────────
function BCGMatrix({ items }: { items: EngineeringItem[] }) {
  const [hovered, setHovered] = useState<EngineeringItem | null>(null);
  const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 });
  const svgRef = useRef<SVGSVGElement>(null);

  const padding = { top: 40, right: 40, bottom: 50, left: 60 };
  const width = 700;
  const height = 500;
  const plotW = width - padding.left - padding.right;
  const plotH = height - padding.top - padding.bottom;

  const { maxPop, maxMargin, avgPop, avgMargin } = useMemo(() => {
    if (items.length === 0) return { maxPop: 100, maxMargin: 100, avgPop: 50, avgMargin: 50 };
    const pops = items.map(i => i.popularity);
    const margins = items.map(i => i.marginPercent);
    return {
      maxPop: Math.max(...pops) * 1.15,
      maxMargin: Math.max(...margins) * 1.15,
      avgPop: pops.reduce((a, b) => a + b, 0) / pops.length,
      avgMargin: margins.reduce((a, b) => a + b, 0) / margins.length,
    };
  }, [items]);

  const scaleX = (pop: number) => padding.left + (pop / maxPop) * plotW;
  const scaleY = (margin: number) => padding.top + plotH - (margin / maxMargin) * plotH;

  const handleMouseMove = useCallback((e: React.MouseEvent<SVGSVGElement>) => {
    if (!svgRef.current) return;
    const rect = svgRef.current.getBoundingClientRect();
    setTooltipPos({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  }, []);

  const avgPopX = scaleX(avgPop);
  const avgMarginY = scaleY(avgMargin);

  return (
    <div className="relative">
      <svg
        ref={svgRef}
        viewBox={`0 0 ${width} ${height}`}
        className="w-full max-w-3xl mx-auto"
        onMouseMove={handleMouseMove}
        onTouchStart={(e) => {
          if (!svgRef.current) return;
          const touch = e.touches[0];
          const rect = svgRef.current.getBoundingClientRect();
          setTooltipPos({ x: touch.clientX - rect.left, y: touch.clientY - rect.top });
        }}
        onClick={(e) => {
          // Dismiss tooltip when tapping SVG background (not a data point)
          if ((e.target as SVGElement).tagName === 'svg' || (e.target as SVGElement).tagName === 'rect') {
            setHovered(null);
          }
        }}
      >
        {/* Background quadrants */}
        <rect x={padding.left} y={padding.top} width={avgPopX - padding.left} height={avgMarginY - padding.top}
          fill="rgba(59,130,246,0.06)" />
        <rect x={avgPopX} y={padding.top} width={padding.left + plotW - avgPopX} height={avgMarginY - padding.top}
          fill="rgba(16,185,129,0.06)" />
        <rect x={padding.left} y={avgMarginY} width={avgPopX - padding.left} height={padding.top + plotH - avgMarginY}
          fill="rgba(239,68,68,0.06)" />
        <rect x={avgPopX} y={avgMarginY} width={padding.left + plotW - avgPopX} height={padding.top + plotH - avgMarginY}
          fill="rgba(245,158,11,0.06)" />

        {/* Grid lines */}
        {[0.25, 0.5, 0.75, 1].map(t => (
          <g key={`grid-${t}`}>
            <line x1={padding.left} y1={padding.top + plotH * (1 - t)} x2={padding.left + plotW} y2={padding.top + plotH * (1 - t)}
              stroke="currentColor" className="text-[#111111] dark:text-white dark:text-[#1A1A1A]" strokeWidth={0.5} strokeDasharray="4,4" />
            <line x1={padding.left + plotW * t} y1={padding.top} x2={padding.left + plotW * t} y2={padding.top + plotH}
              stroke="currentColor" className="text-[#111111] dark:text-white dark:text-[#1A1A1A]" strokeWidth={0.5} strokeDasharray="4,4" />
          </g>
        ))}

        {/* Average lines */}
        <line x1={avgPopX} y1={padding.top} x2={avgPopX} y2={padding.top + plotH}
          stroke="currentColor" className="text-[#9CA3AF] dark:text-[#737373] dark:text-[#A3A3A3]" strokeWidth={1.5} strokeDasharray="6,4" />
        <line x1={padding.left} y1={avgMarginY} x2={padding.left + plotW} y2={avgMarginY}
          stroke="currentColor" className="text-[#9CA3AF] dark:text-[#737373] dark:text-[#A3A3A3]" strokeWidth={1.5} strokeDasharray="6,4" />

        {/* Quadrant labels */}
        <text x={padding.left + 8} y={padding.top + 18} className="fill-teal-400 dark:fill-teal-500" fontSize={11} fontWeight={600}>
          {QUADRANT_CONFIG.puzzle.emoji} {QUADRANT_CONFIG.puzzle.label}
        </text>
        <text x={padding.left + plotW - 8} y={padding.top + 18} className="fill-emerald-500 dark:fill-emerald-400" fontSize={11} fontWeight={600} textAnchor="end">
          {QUADRANT_CONFIG.star.emoji} {QUADRANT_CONFIG.star.label}
        </text>
        <text x={padding.left + 8} y={padding.top + plotH - 8} className="fill-red-400 dark:fill-red-500" fontSize={11} fontWeight={600}>
          {QUADRANT_CONFIG.dog.emoji} {QUADRANT_CONFIG.dog.label}
        </text>
        <text x={padding.left + plotW - 8} y={padding.top + plotH - 8} className="fill-amber-500 dark:fill-amber-400" fontSize={11} fontWeight={600} textAnchor="end">
          {QUADRANT_CONFIG.plow.emoji} {QUADRANT_CONFIG.plow.label}
        </text>

        {/* Axes */}
        <line x1={padding.left} y1={padding.top + plotH} x2={padding.left + plotW} y2={padding.top + plotH}
          stroke="currentColor" className="text-[#6B7280] dark:text-[#A3A3A3] dark:text-[#1A1A1A]" strokeWidth={1} />
        <line x1={padding.left} y1={padding.top} x2={padding.left} y2={padding.top + plotH}
          stroke="currentColor" className="text-[#6B7280] dark:text-[#A3A3A3] dark:text-[#1A1A1A]" strokeWidth={1} />

        {/* Axis labels */}
        <text x={padding.left + plotW / 2} y={height - 8} className="fill-[#6B7280] dark:fill-[#9CA3AF]" fontSize={12} textAnchor="middle" fontWeight={500}>
          Popularité (ventes)
        </text>
        <text x={14} y={padding.top + plotH / 2} className="fill-[#6B7280] dark:fill-[#9CA3AF]" fontSize={12}
          textAnchor="middle" fontWeight={500} transform={`rotate(-90, 14, ${padding.top + plotH / 2})`}>
          Marge (%)
        </text>

        {/* Y-axis ticks */}
        {[0, 0.25, 0.5, 0.75, 1].map(t => (
          <text key={`y-${t}`} x={padding.left - 8} y={padding.top + plotH * (1 - t) + 4}
            className="fill-[#9CA3AF] dark:fill-[#6B7280]" fontSize={10} textAnchor="end">
            {fmt(maxMargin * t, 0)}%
          </text>
        ))}

        {/* X-axis ticks */}
        {[0, 0.25, 0.5, 0.75, 1].map(t => (
          <text key={`x-${t}`} x={padding.left + plotW * t} y={padding.top + plotH + 18}
            className="fill-[#9CA3AF] dark:fill-[#6B7280]" fontSize={10} textAnchor="middle">
            {fmt(maxPop * t, 0)}
          </text>
        ))}

        {/* Data points */}
        {items.map(item => {
          const cx = scaleX(item.popularity);
          const cy = scaleY(item.marginPercent);
          const r = Math.max(8, Math.min(22, Math.sqrt(item.salesRevenue) / 7));
          const cfg = QUADRANT_CONFIG[item.quadrant] || QUADRANT_CONFIG['star'];
          const isHovered = hovered?.id === item.id;
          return (
            <g key={item.id}
              onMouseEnter={() => setHovered(item)}
              onMouseLeave={() => setHovered(null)}
              onClick={() => setHovered(prev => prev?.id === item.id ? null : item)}
              className="cursor-pointer"
            >
              <circle cx={cx} cy={cy} r={isHovered ? r + 3 : r}
                fill={cfg.dot} fillOpacity={isHovered ? 0.9 : 0.7}
                stroke={isHovered ? '#fff' : cfg.dot} strokeWidth={isHovered ? 2.5 : 1}
                className="transition-all duration-150" />
              {isHovered && (
                <text x={cx} y={cy - r - 6} textAnchor="middle"
                  className="fill-[#111111] dark:fill-white" fontSize={11} fontWeight={600}>
                  {item.name}
                </text>
              )}
            </g>
          );
        })}

        {/* Border */}
        <rect x={padding.left} y={padding.top} width={plotW} height={plotH}
          fill="none" stroke="currentColor" className="text-[#111111] dark:text-white dark:text-[#1A1A1A]" strokeWidth={1} />
      </svg>

      {/* Floating tooltip */}
      {hovered && (
        <div
          className="absolute z-50 pointer-events-none bg-white dark:bg-[#0A0A0A] border border-[#E5E7EB] dark:border-[#1A1A1A] rounded-xl shadow-xl px-4 py-3 text-sm max-w-xs"
          style={{
            left: Math.min(tooltipPos.x + 16, 500),
            top: tooltipPos.y - 10,
          }}
        >
          <div className="font-bold text-[#111111] dark:text-white mb-1">{hovered.name}</div>
          <div className="text-[#9CA3AF] dark:text-[#737373] text-xs mb-2">{hovered.category}</div>
          <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-xs">
            <span className="text-[#9CA3AF] dark:text-[#737373]">Prix vente:</span>
            <span className="font-medium text-[#9CA3AF] dark:text-[#737373] dark:text-white">{fmtEur(hovered.sellingPrice)}</span>
            <span className="text-[#9CA3AF] dark:text-[#737373]">Coût:</span>
            <span className="font-medium text-[#9CA3AF] dark:text-[#737373] dark:text-white">{fmtEur(hovered.costPerPortion)}</span>
            <span className="text-[#9CA3AF] dark:text-[#737373]">Marge:</span>
            <span className="font-medium text-[#9CA3AF] dark:text-[#737373] dark:text-white">{fmt(hovered.marginPercent, 1)}%</span>
            <span className="text-[#9CA3AF] dark:text-[#737373]">Ventes:</span>
            <span className="font-medium text-[#9CA3AF] dark:text-[#737373] dark:text-white">{hovered.salesQty}</span>
            <span className="text-[#9CA3AF] dark:text-[#737373]">CA:</span>
            <span className="font-medium text-[#9CA3AF] dark:text-[#737373] dark:text-white">{fmtEur(hovered.salesRevenue)}</span>
          </div>
          <div className="mt-2 pt-2 border-t border-[#E5E7EB] dark:border-[#1A1A1A]">
            <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold ${(QUADRANT_CONFIG[hovered.quadrant] || QUADRANT_CONFIG['star']).badge}`}>
              {(QUADRANT_CONFIG[hovered.quadrant] || QUADRANT_CONFIG['star']).emoji} {(QUADRANT_CONFIG[hovered.quadrant] || QUADRANT_CONFIG['star']).action}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}

// ── Main Page Component ──────────────────────────────────────────────────────
export default function MenuEngineering() {
  const { t } = useTranslation();
  const { showToast } = useToast();

  // Data
  const [data, setData] = useState<EngineeringData | null>(null);
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);

  // Period
  const [period, setPeriod] = useState<Period>('30');
  const [customFrom, setCustomFrom] = useState('');
  const [customTo, setCustomTo] = useState('');

  // Table sorting
  const [sortField, setSortField] = useState<SortField>('salesRevenue');
  const [sortDir, setSortDir] = useState<SortDir>('desc');
  const [filterQuadrant, setFilterQuadrant] = useState<Quadrant | 'all'>('all');

  // Sales modal
  const [showSalesModal, setShowSalesModal] = useState(false);
  const [saleRecipeId, setSaleRecipeId] = useState<number | ''>('');
  const [saleQty, setSaleQty] = useState('');
  const [saleDate, setSaleDate] = useState(new Date().toISOString().slice(0, 10));
  const [saleSubmitting, setSaleSubmitting] = useState(false);

  // Bulk import
  const [showBulkModal, setShowBulkModal] = useState(false);
  const [bulkCsv, setBulkCsv] = useState('');
  const [bulkSubmitting, setBulkSubmitting] = useState(false);

  // What-if scenario
  const [showWhatIf, setShowWhatIf] = useState(false);
  const [whatIfRecipeId, setWhatIfRecipeId] = useState<number | ''>('');
  const [whatIfPriceAdjust, setWhatIfPriceAdjust] = useState(0); // percentage -30 to +30

  // AI Menu Optimizer
  const [aiOptimizing, setAiOptimizing] = useState(false);
  const [aiResult, setAiResult] = useState<any>(null);
  const [showAiPanel, setShowAiPanel] = useState(false);
  const [applyingPrices, setApplyingPrices] = useState(false);
  const matrixRef = useRef<HTMLDivElement>(null);

  // Drag-drop menu reorder
  const [menuOrder, setMenuOrder] = useState<EngineeringItem[]>([]);
  const [dragIdx, setDragIdx] = useState<number | null>(null);
  const [dragOverIdx, setDragOverIdx] = useState<number | null>(null);
  const [showReorder, setShowReorder] = useState(false);

  // Seasonal performance tab
  const [seasonalTab, setSeasonalTab] = useState<'all' | 'week' | 'month' | 'quarter'>('all');

  // ── Fetch data ─────────────────────────────────────────────────────────────
  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      // Fetch recipes and sales in parallel
      const [recipesRes, salesRes] = await Promise.all([
        fetch(`${API}/api/recipes`, { headers: authHeaders() }),
        fetch(`${API}/api/menu-sales${period === 'custom' && customFrom && customTo
          ? `?from=${customFrom}&to=${customTo}`
          : ''}`, { headers: authHeaders() }),
      ]);

      if (!recipesRes.ok) throw new Error('Erreur chargement recettes');
      const recipesJson: Recipe[] = await recipesRes.json();
      setRecipes(recipesJson);

      const salesJson: MenuSale[] = salesRes.ok ? await salesRes.json() : [];

      // Filter sales by period (if not custom)
      const now = Date.now();
      const daysNum = period === 'custom' ? 0 : Number(period);
      const filteredSales = period === 'custom'
        ? salesJson
        : salesJson.filter(s => {
            const saleDate = new Date(s.date).getTime();
            return saleDate >= now - daysNum * 86400000;
          });

      // Aggregate sales by recipeId
      const salesByRecipe: Record<number, { qty: number; revenue: number }> = {};
      filteredSales.forEach(s => {
        if (!salesByRecipe[s.recipeId]) salesByRecipe[s.recipeId] = { qty: 0, revenue: 0 };
        salesByRecipe[s.recipeId].qty += s.quantity;
        salesByRecipe[s.recipeId].revenue += s.revenue || 0;
      });

      const totalSales = Object.values(salesByRecipe).reduce((sum, s) => sum + s.qty, 0);
      const avgSalesQty = totalSales / Math.max(recipesJson.length, 1);

      // Calculate food cost per recipe and build engineering items
      const engineeringItems: EngineeringItem[] = recipesJson.map(recipe => {
        // Calculate food cost from ingredients
        const foodCost = (recipe.ingredients || []).reduce((total, ri) => {
          const wasteMultiplier = ri.wastePercent > 0 ? 1 / (1 - ri.wastePercent / 100) : 1;
          const divisor = getUnitDivisor(ri.ingredient.unit);
          return total + (ri.quantity / divisor) * ri.ingredient.pricePerUnit * wasteMultiplier;
        }, 0);
        const costPerPortion = recipe.nbPortions > 0 ? foodCost / recipe.nbPortions : foodCost;

        // Use API-computed margin if available, otherwise compute
        const sellingPrice = recipe.sellingPrice || 0;
        const margin = sellingPrice - costPerPortion;
        const marginPercent = sellingPrice > 0 ? (margin / sellingPrice) * 100 : 0;

        const salesData = salesByRecipe[recipe.id] || { qty: 0, revenue: 0 };
        const popularity = totalSales > 0 ? (salesData.qty / totalSales) * 100 : 0;
        const salesRevenue = salesData.revenue > 0 ? salesData.revenue : salesData.qty * sellingPrice;

        return {
          id: recipe.id,
          name: recipe.name,
          category: recipe.category || 'Non classé',
          sellingPrice,
          costPerPortion: Math.round(costPerPortion * 100) / 100,
          margin: Math.round(margin * 100) / 100,
          marginPercent: Math.round(marginPercent * 10) / 10,
          salesQty: salesData.qty,
          salesRevenue: Math.round(salesRevenue * 100) / 100,
          popularity: Math.round(popularity * 10) / 10,
          quadrant: 'dog' as const, // placeholder, will be assigned below
        };
      });

      // Compute average margin for quadrant classification
      const avgMarginAmount = engineeringItems.reduce((s, e) => s + e.margin, 0) / Math.max(engineeringItems.length, 1);

      // Assign quadrants based on averages
      engineeringItems.forEach(item => {
        if (item.margin >= avgMarginAmount && item.salesQty >= avgSalesQty) item.quadrant = 'star';
        else if (item.margin >= avgMarginAmount && item.salesQty < avgSalesQty) item.quadrant = 'puzzle';
        else if (item.margin < avgMarginAmount && item.salesQty >= avgSalesQty) item.quadrant = 'plow';
        else item.quadrant = 'dog';
      });

      const avgMarginPct = engineeringItems.length > 0
        ? engineeringItems.reduce((s, e) => s + e.marginPercent, 0) / engineeringItems.length
        : 0;

      setData({
        engineering: engineeringItems,
        totalSales,
        avgMargin: Math.round(avgMarginPct * 10) / 10,
        days: daysNum || Math.ceil((new Date(customTo).getTime() - new Date(customFrom).getTime()) / 86400000) || 30,
      });
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Erreur de chargement';
      showToast(message, 'error');
    } finally {
      setLoading(false);
    }
  }, [period, customFrom, customTo, showToast]);

  useEffect(() => { fetchData(); }, [fetchData]);

  // ── Submit single sale ─────────────────────────────────────────────────────
  const handleSubmitSale = async () => {
    if (!saleRecipeId || !saleQty) {
      showToast('Veuillez remplir tous les champs', 'error');
      return;
    }
    setSaleSubmitting(true);
    try {
      const recipe = recipes.find(r => r.id === Number(saleRecipeId));
      const res = await fetch(`${API}/api/menu-sales`, {
        method: 'POST',
        headers: authHeaders(),
        body: JSON.stringify({
          recipeId: Number(saleRecipeId),
          quantity: Number(saleQty),
          revenue: 0,
          date: saleDate,
        }),
      });
      if (!res.ok) throw new Error('Erreur enregistrement');
      showToast(`Vente enregistrée : ${recipe?.name || ''} x${saleQty}`, 'success');
      setShowSalesModal(false);
      setSaleRecipeId('');
      setSaleQty('');
      fetchData();
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Erreur';
      showToast(message, 'error');
    } finally {
      setSaleSubmitting(false);
    }
  };

  // ── Submit bulk import ─────────────────────────────────────────────────────
  const handleBulkImport = async () => {
    if (!bulkCsv.trim()) {
      showToast('Veuillez coller des données CSV', 'error');
      return;
    }
    setBulkSubmitting(true);
    try {
      const lines = bulkCsv.trim().split('\n').filter(l => l.trim());
      const sales = lines.map(line => {
        const parts = line.split(/[;,\t]/).map(s => s.trim());
        if (parts.length < 2) throw new Error(`Ligne invalide: ${line}`);
        const recipeMatch = recipes.find(r =>
          r.name.toLowerCase() === parts[0].toLowerCase() || r.id === Number(parts[0])
        );
        if (!recipeMatch) throw new Error(`Recette non trouvée: ${parts[0]}`);
        return {
          recipeId: recipeMatch.id,
          quantity: Number(parts[1]),
          revenue: 0,
          date: parts[2] || new Date().toISOString().slice(0, 10),
        };
      });

      const res = await fetch(`${API}/api/menu-sales/bulk`, {
        method: 'POST',
        headers: authHeaders(),
        body: JSON.stringify({ sales }),
      });
      if (!res.ok) throw new Error('Erreur import');
      showToast(`${sales.length} ventes importées avec succès`, 'success');
      setShowBulkModal(false);
      setBulkCsv('');
      fetchData();
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Erreur import';
      showToast(message, 'error');
    } finally {
      setBulkSubmitting(false);
    }
  };

  // ── AI Menu Optimizer ───────────────────────────────────────────────────────
  const handleOptimizeMenu = async () => {
    setAiOptimizing(true);
    try {
      const res = await fetch(`${API}/api/ai/optimize-menu`, {
        method: 'POST',
        headers: authHeaders(),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({ error: 'Erreur IA' }));
        throw new Error(err.error || 'Erreur IA');
      }
      const result = await res.json();
      setAiResult(result);
      setShowAiPanel(true);
      showToast('Analyse IA terminée', 'success');
      // Scroll to matrix
      setTimeout(() => matrixRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 300);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Erreur IA';
      showToast(message, 'error');
    } finally {
      setAiOptimizing(false);
    }
  };

  const handleApplyPrices = async () => {
    if (!aiResult?.optimization?.priceAdjustments?.length) return;
    setApplyingPrices(true);
    let applied = 0;
    try {
      for (const adj of aiResult.optimization.priceAdjustments) {
        if (!adj.suggestedPrice || adj.suggestedPrice === adj.currentPrice) continue;
        const res = await fetch(`${API}/api/recipes/${adj.id}`, {
          method: 'PUT',
          headers: authHeaders(),
          body: JSON.stringify({ sellingPrice: adj.suggestedPrice }),
        });
        if (res.ok) applied++;
      }
      showToast(`${applied} prix mis à jour avec succès`, 'success');
      fetchData(); // Refresh data
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Erreur mise à jour';
      showToast(message, 'error');
    } finally {
      setApplyingPrices(false);
    }
  };

  // ── Derived data ───────────────────────────────────────────────────────────
  const items = data?.engineering || [];

  const quadrantCounts = useMemo(() => {
    const counts = { star: 0, puzzle: 0, plow: 0, dog: 0 };
    items.forEach(i => { counts[i.quadrant]++; });
    return counts;
  }, [items]);

  const totalRevenue = useMemo(() => items.reduce((s, i) => s + i.salesRevenue, 0), [items]);

  // ── Seasonal filter (applied before sorting) ──────────────────────────────
  const seasonalItemsEarly = useMemo(() => {
    if (seasonalTab === 'all') return items;
    const factor = seasonalTab === 'week' ? 0.23 : seasonalTab === 'month' ? 1.0 : 3.0;
    return items.map(item => ({
      ...item,
      salesQty: Math.round(item.salesQty * factor),
      salesRevenue: Math.round(item.salesRevenue * factor * 100) / 100,
    }));
  }, [items, seasonalTab]);

  const sortedItems = useMemo(() => {
    const source = seasonalItemsEarly;
    let filtered = filterQuadrant === 'all' ? [...source] : source.filter(i => i.quadrant === filterQuadrant);
    filtered.sort((a, b) => {
      let va: any = a[sortField];
      let vb: any = b[sortField];
      if (typeof va === 'string') { va = va.toLowerCase(); vb = (vb as string).toLowerCase(); }
      if (va < vb) return sortDir === 'asc' ? -1 : 1;
      if (va > vb) return sortDir === 'asc' ? 1 : -1;
      return 0;
    });
    return filtered;
  }, [seasonalItemsEarly, sortField, sortDir, filterQuadrant]);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDir(d => d === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDir('desc');
    }
  };

  // ── What-if computed values ─────────────────────────────────────────────────
  const whatIfData = useMemo(() => {
    if (!whatIfRecipeId) return null;
    const item = items.find(i => i.id === Number(whatIfRecipeId));
    if (!item) return null;
    const originalPrice = item.sellingPrice;
    const newPrice = Math.round(originalPrice * (1 + whatIfPriceAdjust / 100) * 100) / 100;
    const newMargin = newPrice - item.costPerPortion;
    const newMarginPercent = newPrice > 0 ? (newMargin / newPrice) * 100 : 0;
    const newFoodCostRatio = newPrice > 0 ? (item.costPerPortion / newPrice) * 100 : 0;
    const originalFoodCostRatio = originalPrice > 0 ? (item.costPerPortion / originalPrice) * 100 : 0;
    const revenueImpact = (newPrice - originalPrice) * item.salesQty;
    return {
      item,
      originalPrice,
      newPrice,
      originalMargin: item.margin,
      newMargin: Math.round(newMargin * 100) / 100,
      originalMarginPercent: item.marginPercent,
      newMarginPercent: Math.round(newMarginPercent * 10) / 10,
      originalFoodCostRatio: Math.round(originalFoodCostRatio * 10) / 10,
      newFoodCostRatio: Math.round(newFoodCostRatio * 10) / 10,
      revenueImpact: Math.round(revenueImpact * 100) / 100,
    };
  }, [whatIfRecipeId, whatIfPriceAdjust, items]);

  const maxSalesQty = useMemo(() => Math.max(...items.map(i => i.salesQty), 1), [items]);

  const recommendations = useMemo(() => generateRecommendations([...items]), [items]);

  // ── Menu Mix Analysis (revenue by category) ───────────────────────────────
  const menuMixData = useMemo(() => {
    const catMap: Record<string, { revenue: number; count: number; qty: number }> = {};
    items.forEach(item => {
      const cat = item.category || 'Autre';
      if (!catMap[cat]) catMap[cat] = { revenue: 0, count: 0, qty: 0 };
      catMap[cat].revenue += item.salesRevenue;
      catMap[cat].count += 1;
      catMap[cat].qty += item.salesQty;
    });
    const total = Object.values(catMap).reduce((s, c) => s + c.revenue, 0);
    const CATEGORY_COLORS: Record<string, string> = {
      'Entrees': '#8B5CF6', 'Entrées': '#8B5CF6', 'Entree': '#8B5CF6', 'Entrée': '#8B5CF6',
      'Plats': '#10B981', 'Plat': '#10B981', 'Plat principal': '#10B981',
      'Desserts': '#F59E0B', 'Dessert': '#F59E0B',
      'Boissons': '#3B82F6', 'Boisson': '#3B82F6',
      'Autre': '#6B7280', 'Non classé': '#9CA3AF',
    };
    const fallbackColors = ['#EC4899', '#14B8A6', '#F97316', '#6366F1', '#EF4444', '#84CC16'];
    let fallbackIdx = 0;
    return Object.entries(catMap)
      .map(([cat, data]) => ({
        category: cat,
        revenue: data.revenue,
        count: data.count,
        qty: data.qty,
        percent: total > 0 ? (data.revenue / total) * 100 : 0,
        color: CATEGORY_COLORS[cat] || fallbackColors[fallbackIdx++ % fallbackColors.length],
      }))
      .sort((a, b) => b.revenue - a.revenue);
  }, [items]);

  const menuMixGradient = useMemo(() => {
    if (menuMixData.length === 0) return 'conic-gradient(#E5E7EB 0deg 360deg)';
    let deg = 0;
    const stops: string[] = [];
    menuMixData.forEach(d => {
      const span = (d.percent / 100) * 360;
      stops.push(`${d.color} ${deg}deg ${deg + span}deg`);
      deg += span;
    });
    return `conic-gradient(${stops.join(', ')})`;
  }, [menuMixData]);

  // ── Price Optimization Suggestions ─────────────────────────────────────────
  const priceOptSuggestions = useMemo(() => {
    if (items.length === 0) return [];
    const totalRev = items.reduce((s, i) => s + i.salesRevenue, 0);
    const totalMarginEur = items.reduce((s, i) => s + (i.margin * i.salesQty), 0);

    return items
      .filter(i => i.salesQty > 0 && i.sellingPrice > 0)
      .map(item => {
        // Suggest price increase for popular items with low margin
        // Suggest price decrease for unpopular items with high margin
        let suggestedChange = 0;
        let reason = '';

        if (item.quadrant === 'plow') {
          // Popular but low margin: increase price
          suggestedChange = Math.round(item.sellingPrice * 0.08 * 100) / 100;
          reason = `Populaire (${item.salesQty} ventes) mais marge faible (${fmt(item.marginPercent, 1)}%)`;
        } else if (item.quadrant === 'puzzle') {
          // High margin but unpopular: slight decrease to boost volume
          suggestedChange = -Math.round(item.sellingPrice * 0.05 * 100) / 100;
          reason = `Bonne marge (${fmt(item.marginPercent, 1)}%) mais peu de ventes (${item.salesQty})`;
        } else if (item.quadrant === 'dog' && item.marginPercent < 40) {
          // Low everything: increase price or remove
          suggestedChange = Math.round(item.sellingPrice * 0.12 * 100) / 100;
          reason = `Marge critique (${fmt(item.marginPercent, 1)}%) et ${item.salesQty} ventes`;
        } else if (item.quadrant === 'star' && item.marginPercent < 60) {
          // Star but margin could be better
          suggestedChange = Math.round(item.sellingPrice * 0.04 * 100) / 100;
          reason = `Vedette avec potentiel de marge (actuellement ${fmt(item.marginPercent, 1)}%)`;
        }

        if (suggestedChange === 0) return null;

        // Calculate impact on global margin
        const newPrice = item.sellingPrice + suggestedChange;
        const newMargin = newPrice - item.costPerPortion;
        const newMarginTotal = totalMarginEur - (item.margin * item.salesQty) + (newMargin * item.salesQty);
        const marginImpactPct = totalMarginEur > 0 ? ((newMarginTotal - totalMarginEur) / totalMarginEur) * 100 : 0;

        return {
          id: item.id,
          name: item.name,
          category: item.category,
          currentPrice: item.sellingPrice,
          suggestedChange,
          newPrice: Math.round(newPrice * 100) / 100,
          reason,
          marginImpactPct: Math.round(marginImpactPct * 10) / 10,
          quadrant: item.quadrant,
        };
      })
      .filter(Boolean)
      .sort((a, b) => Math.abs(b!.marginImpactPct) - Math.abs(a!.marginImpactPct))
      .slice(0, 5) as {
        id: number; name: string; category: string; currentPrice: number;
        suggestedChange: number; newPrice: number; reason: string;
        marginImpactPct: number; quadrant: Quadrant;
      }[];
  }, [items]);


  // ── Sync menuOrder when items change ───────────────────────────────────────
  useEffect(() => {
    if (items.length > 0 && menuOrder.length === 0) {
      setMenuOrder([...items]);
    }
  }, [items, menuOrder.length]);

  // ── Drag-drop handlers ─────────────────────────────────────────────────────
  const handleDragStart = useCallback((idx: number) => {
    setDragIdx(idx);
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent, idx: number) => {
    e.preventDefault();
    setDragOverIdx(idx);
  }, []);

  const handleDrop = useCallback((idx: number) => {
    if (dragIdx === null || dragIdx === idx) {
      setDragIdx(null);
      setDragOverIdx(null);
      return;
    }
    setMenuOrder(prev => {
      const newOrder = [...prev];
      const [moved] = newOrder.splice(dragIdx, 1);
      newOrder.splice(idx, 0, moved);
      return newOrder;
    });
    setDragIdx(null);
    setDragOverIdx(null);
  }, [dragIdx]);

  const handleTouchDragStart = useCallback((idx: number) => {
    setDragIdx(idx);
  }, []);

  const handleTouchDragEnd = useCallback((idx: number) => {
    if (dragIdx === null || dragIdx === idx) {
      setDragIdx(null);
      return;
    }
    setMenuOrder(prev => {
      const newOrder = [...prev];
      const [moved] = newOrder.splice(dragIdx, 1);
      newOrder.splice(idx, 0, moved);
      return newOrder;
    });
    setDragIdx(null);
    setDragOverIdx(null);
  }, [dragIdx]);

  // ── Allergens per recipe (map recipeId -> allergens) ──────────────────────
  const recipeAllergens = useMemo(() => {
    const map: Record<number, string[]> = {};
    recipes.forEach(r => { map[r.id] = getRecipeAllergens(r); });
    return map;
  }, [recipes]);

  const SortIcon = ({ field }: { field: SortField }) => {
    if (sortField !== field) return <ArrowUpDown className="w-3.5 h-3.5 text-[#9CA3AF] dark:text-[#737373]" />;
    return sortDir === 'asc'
      ? <ArrowUp className="w-3.5 h-3.5 text-teal-500" />
      : <ArrowDown className="w-3.5 h-3.5 text-teal-500" />;
  };

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FAFAFA] via-white to-[#F5F5F5] dark:from-black dark:via-black dark:to-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">

        {/* ── Header ───────────────────────────────────────────────────────── */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-[#111111] dark:text-white flex items-center gap-3">
              <div className="p-2.5 bg-gradient-to-br from-violet-500 to-purple-600 rounded-xl text-white shadow-lg">
                <BarChart3 className="w-6 h-6" />
              </div>
              {t('menuEngineering.title')}
            </h1>
            <p className="text-[#9CA3AF] dark:text-[#737373] mt-1">
              {t('menuEngineering.subtitle')}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleOptimizeMenu}
              disabled={aiOptimizing || !data?.engineering?.length}
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#111111] dark:bg-white hover:bg-[#333333] dark:hover:bg-[#E5E5E5] text-white dark:text-black rounded-xl font-medium text-sm shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {aiOptimizing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
              Optimiser avec IA
            </button>
            <button
              onClick={() => setShowSalesModal(true)}
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 text-white rounded-xl font-medium text-sm shadow-lg shadow-violet-500/25 transition-all"
            >
              <Plus className="w-4 h-4" /> {t('menuEngineering.addSale')}
            </button>
            <button
              onClick={() => window.print()}
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-white dark:bg-[#0A0A0A] border border-[#E5E7EB] dark:border-[#1A1A1A] hover:bg-[#FAFAFA] dark:hover:bg-[#171717] text-[#9CA3AF] dark:text-[#737373] dark:text-white rounded-xl font-medium text-sm transition-all no-print"
            >
              <Printer className="w-4 h-4" /> {t('menuEngineering.print')}
            </button>
            <button
              onClick={() => showToast('Export PDF en cours de developpement. Bientot disponible !', 'info')}
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-white dark:bg-[#0A0A0A] border border-[#E5E7EB] dark:border-[#1A1A1A] hover:bg-[#FAFAFA] dark:hover:bg-[#171717] text-[#9CA3AF] dark:text-[#737373] dark:text-white rounded-xl font-medium text-sm transition-all no-print"
            >
              <FileDown className="w-4 h-4" /> Exporter la carte
            </button>
          </div>
        </div>

        {/* ── Seasonal Performance Toggle ──────────────────────────────────── */}
        <div className="flex flex-wrap items-center gap-3">
          <span className="text-sm font-medium text-[#6B7280] dark:text-[#A3A3A3]">Periode :</span>
          <div className="flex items-center gap-1 bg-white dark:bg-[#0A0A0A] border border-[#E5E7EB] dark:border-[#1A1A1A] rounded-xl p-1 shadow-sm">
            {([
              { key: 'all' as const, label: 'Tout' },
              { key: 'week' as const, label: 'Semaine' },
              { key: 'month' as const, label: 'Mois' },
              { key: 'quarter' as const, label: 'Trimestre' },
            ]).map(tab => (
              <button
                key={tab.key}
                onClick={() => setSeasonalTab(tab.key)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  seasonalTab === tab.key
                    ? 'bg-[#111111] dark:bg-white text-white dark:text-black shadow-md'
                    : 'text-[#6B7280] dark:text-[#A3A3A3] hover:bg-[#F5F5F5] dark:hover:bg-[#171717]'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* ── Period selector ──────────────────────────────────────────────── */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-1 bg-white dark:bg-[#0A0A0A] border border-[#E5E7EB] dark:border-[#1A1A1A] rounded-xl p-1 shadow-sm">
            {(['7', '30', '90'] as Period[]).map(p => (
              <button
                key={p}
                onClick={() => setPeriod(p)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  period === p
                    ? 'bg-violet-600 text-white shadow-md'
                    : 'text-[#6B7280] dark:text-[#A3A3A3] hover:bg-[#F5F5F5] dark:hover:bg-[#171717]'
                }`}
              >
                {p}j
              </button>
            ))}
            <button
              onClick={() => setPeriod('custom')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-1.5 ${
                period === 'custom'
                  ? 'bg-violet-600 text-white shadow-md'
                  : 'text-[#6B7280] dark:text-[#A3A3A3] hover:bg-[#F5F5F5] dark:hover:bg-[#171717]'
              }`}
            >
              <Calendar className="w-3.5 h-3.5" /> {t('menuEngineering.custom')}
            </button>
          </div>

          {period === 'custom' && (
            <div className="flex items-center gap-2">
              <input
                type="date"
                value={customFrom}
                onChange={e => setCustomFrom(e.target.value)}
                className="px-3 py-2 border border-[#E5E7EB] dark:border-[#1A1A1A] rounded-lg bg-white dark:bg-[#0A0A0A] text-[#9CA3AF] dark:text-[#737373] dark:text-white text-sm"
              />
              <span className="text-[#9CA3AF] dark:text-[#737373]">→</span>
              <input
                type="date"
                value={customTo}
                onChange={e => setCustomTo(e.target.value)}
                className="px-3 py-2 border border-[#E5E7EB] dark:border-[#1A1A1A] rounded-lg bg-white dark:bg-[#0A0A0A] text-[#9CA3AF] dark:text-[#737373] dark:text-white text-sm"
              />
              <button
                onClick={fetchData}
                className="p-2 bg-violet-600 hover:bg-violet-700 text-white rounded-lg transition-colors"
              >
                <RefreshCw className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>

        {/* ── AI BCG Matrix & Recommendations ─────────────────────────────── */}
        {showAiPanel && aiResult && (
          <div ref={matrixRef} className="space-y-6">
            {/* Close bar */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-[#111111] dark:bg-white rounded-xl">
                  <Sparkles className="w-5 h-5 text-white dark:text-black" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-[#111111] dark:text-white">Matrice BCG — Optimisation IA</h2>
                  <p className="text-xs text-[#9CA3AF] dark:text-[#737373]">
                    Basé sur {aiResult.totalSales} ventes · Marge moy. {aiResult.avgMargin}% · Popularité moy. {aiResult.avgPopularity}%
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowAiPanel(false)}
                className="p-2 hover:bg-[#F5F5F5] dark:hover:bg-[#171717] rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-[#9CA3AF]" />
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* ── BCG Matrix Visualization ── */}
              <div className="lg:col-span-2 bg-white dark:bg-[#0A0A0A] border border-[#E5E7EB] dark:border-[#1A1A1A] rounded-2xl p-6 shadow-sm">
                <div className="relative w-full" style={{ paddingBottom: '80%' }}>
                  <div className="absolute inset-0">
                    {/* Axes */}
                    <div className="absolute left-8 top-0 bottom-8 w-px bg-[#E5E7EB] dark:bg-[#333333]" />
                    <div className="absolute left-8 bottom-8 right-0 h-px bg-[#E5E7EB] dark:bg-[#333333]" />
                    {/* Mid lines (dashed) */}
                    <div className="absolute left-8 right-0 border-t border-dashed border-[#E5E7EB] dark:border-[#333333]" style={{ top: 'calc(50% - 16px)' }} />
                    <div className="absolute top-0 bottom-8 border-l border-dashed border-[#E5E7EB] dark:border-[#333333]" style={{ left: 'calc(50% + 16px)' }} />

                    {/* Quadrant labels */}
                    <div className="absolute text-[10px] font-bold uppercase tracking-wider text-[#9CA3AF] dark:text-[#525252]" style={{ top: '8px', left: 'calc(25% + 16px)', transform: 'translateX(-50%)' }}>
                      Puzzles
                    </div>
                    <div className="absolute text-[10px] font-bold uppercase tracking-wider text-[#9CA3AF] dark:text-[#525252]" style={{ top: '8px', left: 'calc(75% + 16px)', transform: 'translateX(-50%)' }}>
                      Stars
                    </div>
                    <div className="absolute text-[10px] font-bold uppercase tracking-wider text-[#9CA3AF] dark:text-[#525252]" style={{ bottom: 'calc(50% - 38px)', left: 'calc(25% + 16px)', transform: 'translateX(-50%)' }}>
                      Dogs
                    </div>
                    <div className="absolute text-[10px] font-bold uppercase tracking-wider text-[#9CA3AF] dark:text-[#525252]" style={{ bottom: 'calc(50% - 38px)', left: 'calc(75% + 16px)', transform: 'translateX(-50%)' }}>
                      Plowhorses
                    </div>

                    {/* Quadrant backgrounds */}
                    <div className="absolute bg-blue-50/50 dark:bg-blue-950/10" style={{ top: 0, left: '32px', width: 'calc(50% - 16px)', height: 'calc(50% - 16px)' }} />
                    <div className="absolute bg-emerald-50/50 dark:bg-emerald-950/10" style={{ top: 0, right: 0, width: 'calc(50% - 16px)', height: 'calc(50% - 16px)' }} />
                    <div className="absolute bg-red-50/50 dark:bg-red-950/10" style={{ bottom: '32px', left: '32px', width: 'calc(50% - 16px)', height: 'calc(50% - 16px)' }} />
                    <div className="absolute bg-amber-50/50 dark:bg-amber-950/10" style={{ bottom: '32px', right: 0, width: 'calc(50% - 16px)', height: 'calc(50% - 16px)' }} />

                    {/* Axis labels */}
                    <div className="absolute text-[9px] font-medium text-[#9CA3AF] dark:text-[#525252] -rotate-90" style={{ left: '-4px', top: '50%', transform: 'rotate(-90deg) translateX(50%)' }}>
                      MARGE %
                    </div>
                    <div className="absolute text-[9px] font-medium text-[#9CA3AF] dark:text-[#525252]" style={{ bottom: '8px', left: '50%', transform: 'translateX(-50%)' }}>
                      POPULARITE
                    </div>

                    {/* Recipe dots */}
                    {(() => {
                      const recs = aiResult.recipes || [];
                      const maxMargin = Math.max(...recs.map((r: any) => r.marginPercent), 1);
                      const maxPop = Math.max(...recs.map((r: any) => r.popularity), 1);
                      return recs.map((recipe: any) => {
                        // Normalize to 0-1 range with padding
                        const xPct = Math.min(Math.max(recipe.popularity / maxPop, 0.05), 0.95);
                        const yPct = Math.min(Math.max(recipe.marginPercent / maxMargin, 0.05), 0.95);

                        // Chart area: left starts at 32px, bottom starts at 32px
                        // Use percentage within the drawable area (5% to 95% range)
                        const leftPct = 5 + xPct * 90; // 5% to 95% of the container
                        const bottomPct = 5 + yPct * 90;

                        // Determine quadrant color
                        const isHighMargin = recipe.marginPercent >= aiResult.avgMargin;
                        const isHighPop = recipe.popularity >= aiResult.avgPopularity;
                        let dotColor = '#EF4444'; // dogs - red
                        if (isHighMargin && isHighPop) dotColor = '#10B981'; // stars - green
                        else if (isHighMargin && !isHighPop) dotColor = '#3B82F6'; // puzzles - blue
                        else if (!isHighMargin && isHighPop) dotColor = '#F59E0B'; // plowhorses - amber

                        return (
                          <div
                            key={recipe.id}
                            className="absolute group cursor-pointer z-10"
                            style={{
                              left: `${leftPct}%`,
                              bottom: `${bottomPct}%`,
                              transform: 'translate(-50%, 50%)',
                            }}
                          >
                            <div
                              className="w-3 h-3 rounded-full border-2 border-white dark:border-[#0A0A0A] shadow-md transition-transform group-hover:scale-150"
                              style={{ backgroundColor: dotColor }}
                            />
                            {/* Tooltip */}
                            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2.5 py-1.5 bg-[#111111] dark:bg-white text-white dark:text-black text-[10px] rounded-lg shadow-xl opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap z-20">
                              <div className="font-semibold">{recipe.name}</div>
                              <div>Marge: {recipe.marginPercent}% · Pop: {recipe.popularity}%</div>
                              <div>Prix: {recipe.sellingPrice}€</div>
                            </div>
                          </div>
                        );
                      });
                    })()}
                  </div>
                </div>

                {/* Legend */}
                <div className="flex flex-wrap items-center gap-4 mt-4 pt-4 border-t border-[#E5E7EB] dark:border-[#1A1A1A]">
                  {[
                    { color: '#10B981', label: 'Stars — Garder' },
                    { color: '#3B82F6', label: 'Puzzles — Promouvoir' },
                    { color: '#F59E0B', label: 'Plowhorses — Repriser' },
                    { color: '#EF4444', label: 'Dogs — Retirer' },
                  ].map(item => (
                    <div key={item.label} className="flex items-center gap-1.5">
                      <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                      <span className="text-[10px] font-medium text-[#6B7280] dark:text-[#A3A3A3]">{item.label}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* ── AI Recommendations Panel ── */}
              <div className="space-y-4">
                {/* Summary */}
                {aiResult.optimization?.summary && (
                  <div className="bg-white dark:bg-[#0A0A0A] border border-[#E5E7EB] dark:border-[#1A1A1A] rounded-2xl p-4 shadow-sm">
                    <div className="flex items-center gap-2 mb-2">
                      <Lightbulb className="w-4 h-4 text-[#111111] dark:text-white" />
                      <span className="text-sm font-bold text-[#111111] dark:text-white">Synthèse IA</span>
                    </div>
                    <p className="text-xs text-[#6B7280] dark:text-[#A3A3A3] leading-relaxed">
                      {aiResult.optimization.summary}
                    </p>
                  </div>
                )}

                {/* Stars */}
                {aiResult.optimization?.stars?.length > 0 && (
                  <div className="bg-white dark:bg-[#0A0A0A] border border-[#E5E7EB] dark:border-[#1A1A1A] rounded-2xl p-4 shadow-sm">
                    <div className="flex items-center gap-2 mb-3">
                      <div className="w-2 h-2 rounded-full bg-emerald-500" />
                      <span className="text-sm font-bold text-[#111111] dark:text-white">Stars ({aiResult.optimization.stars.length})</span>
                    </div>
                    <div className="space-y-2">
                      {aiResult.optimization.stars.map((item: any) => (
                        <div key={item.id} className="flex items-start gap-2">
                          <Star className="w-3.5 h-3.5 text-emerald-500 mt-0.5 shrink-0" />
                          <div>
                            <span className="text-xs font-semibold text-[#111111] dark:text-white">{item.name}</span>
                            <p className="text-[10px] text-[#9CA3AF] dark:text-[#737373]">{item.action}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Puzzles */}
                {aiResult.optimization?.puzzles?.length > 0 && (
                  <div className="bg-white dark:bg-[#0A0A0A] border border-[#E5E7EB] dark:border-[#1A1A1A] rounded-2xl p-4 shadow-sm">
                    <div className="flex items-center gap-2 mb-3">
                      <div className="w-2 h-2 rounded-full bg-blue-500" />
                      <span className="text-sm font-bold text-[#111111] dark:text-white">Puzzles ({aiResult.optimization.puzzles.length})</span>
                    </div>
                    <div className="space-y-2">
                      {aiResult.optimization.puzzles.map((item: any) => (
                        <div key={item.id} className="flex items-start gap-2">
                          <Zap className="w-3.5 h-3.5 text-blue-500 mt-0.5 shrink-0" />
                          <div>
                            <span className="text-xs font-semibold text-[#111111] dark:text-white">{item.name}</span>
                            <p className="text-[10px] text-[#9CA3AF] dark:text-[#737373]">{item.action}</p>
                            {item.marketingSuggestion && (
                              <p className="text-[10px] text-blue-600 dark:text-blue-400 mt-0.5">{item.marketingSuggestion}</p>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Plowhorses */}
                {aiResult.optimization?.plowhorses?.length > 0 && (
                  <div className="bg-white dark:bg-[#0A0A0A] border border-[#E5E7EB] dark:border-[#1A1A1A] rounded-2xl p-4 shadow-sm">
                    <div className="flex items-center gap-2 mb-3">
                      <div className="w-2 h-2 rounded-full bg-amber-500" />
                      <span className="text-sm font-bold text-[#111111] dark:text-white">Plowhorses ({aiResult.optimization.plowhorses.length})</span>
                    </div>
                    <div className="space-y-2">
                      {aiResult.optimization.plowhorses.map((item: any) => (
                        <div key={item.id} className="flex items-start gap-2">
                          <TrendingUp className="w-3.5 h-3.5 text-amber-500 mt-0.5 shrink-0" />
                          <div>
                            <span className="text-xs font-semibold text-[#111111] dark:text-white">{item.name}</span>
                            <p className="text-[10px] text-[#9CA3AF] dark:text-[#737373]">{item.action}</p>
                            {item.suggestedPrice && (
                              <p className="text-[10px] text-amber-600 dark:text-amber-400 mt-0.5">
                                Prix suggéré: {item.suggestedPrice}€
                              </p>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Dogs */}
                {aiResult.optimization?.dogs?.length > 0 && (
                  <div className="bg-white dark:bg-[#0A0A0A] border border-[#E5E7EB] dark:border-[#1A1A1A] rounded-2xl p-4 shadow-sm">
                    <div className="flex items-center gap-2 mb-3">
                      <div className="w-2 h-2 rounded-full bg-red-500" />
                      <span className="text-sm font-bold text-[#111111] dark:text-white">Dogs ({aiResult.optimization.dogs.length})</span>
                    </div>
                    <div className="space-y-2">
                      {aiResult.optimization.dogs.map((item: any) => (
                        <div key={item.id} className="flex items-start gap-2">
                          <X className="w-3.5 h-3.5 text-red-500 mt-0.5 shrink-0" />
                          <div>
                            <span className="text-xs font-semibold text-[#111111] dark:text-white">{item.name}</span>
                            <p className="text-[10px] text-[#9CA3AF] dark:text-[#737373]">{item.action}</p>
                            {item.alternative && (
                              <p className="text-[10px] text-red-600 dark:text-red-400 mt-0.5">Alternative: {item.alternative}</p>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Revenue Impact */}
                {aiResult.optimization?.revenueImpact && (
                  <div className="bg-white dark:bg-[#0A0A0A] border border-[#E5E7EB] dark:border-[#1A1A1A] rounded-2xl p-4 shadow-sm">
                    <div className="flex items-center gap-2 mb-3">
                      <TrendingUp className="w-4 h-4 text-[#111111] dark:text-white" />
                      <span className="text-sm font-bold text-[#111111] dark:text-white">Impact estimé</span>
                    </div>
                    {aiResult.optimization.revenueImpact.estimatedMonthlyRevenue > 0 && (
                      <div className="flex items-baseline gap-2 mb-2">
                        <span className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
                          +{aiResult.optimization.revenueImpact.percentChange}%
                        </span>
                        <span className="text-xs text-[#9CA3AF] dark:text-[#737373]">revenu mensuel</span>
                      </div>
                    )}
                    <p className="text-[10px] text-[#6B7280] dark:text-[#A3A3A3] leading-relaxed">
                      {aiResult.optimization.revenueImpact.explanation}
                    </p>
                  </div>
                )}

                {/* Price Adjustments Table + Apply Button */}
                {aiResult.optimization?.priceAdjustments?.length > 0 && (
                  <div className="bg-white dark:bg-[#0A0A0A] border border-[#E5E7EB] dark:border-[#1A1A1A] rounded-2xl p-4 shadow-sm">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <DollarSign className="w-4 h-4 text-[#111111] dark:text-white" />
                        <span className="text-sm font-bold text-[#111111] dark:text-white">Ajustements de prix</span>
                      </div>
                    </div>
                    <div className="space-y-2 mb-4">
                      {aiResult.optimization.priceAdjustments.map((adj: any) => (
                        <div key={adj.id} className="flex items-center justify-between py-1.5 border-b border-[#F5F5F5] dark:border-[#1A1A1A] last:border-0">
                          <span className="text-xs font-medium text-[#111111] dark:text-white">{adj.name}</span>
                          <div className="flex items-center gap-2">
                            <span className="text-xs text-[#9CA3AF] dark:text-[#737373] line-through">{adj.currentPrice}€</span>
                            <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">{adj.suggestedPrice}€</span>
                          </div>
                        </div>
                      ))}
                    </div>
                    <button
                      onClick={handleApplyPrices}
                      disabled={applyingPrices}
                      className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-[#111111] dark:bg-white hover:bg-[#333333] dark:hover:bg-[#E5E5E5] text-white dark:text-black rounded-xl font-medium text-sm transition-all disabled:opacity-50"
                    >
                      {applyingPrices ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
                      Appliquer les suggestions
                    </button>
                  </div>
                )}

                {/* Menu Composition */}
                {aiResult.optimization?.menuComposition?.recommendation && (
                  <div className="bg-white dark:bg-[#0A0A0A] border border-[#E5E7EB] dark:border-[#1A1A1A] rounded-2xl p-4 shadow-sm">
                    <div className="flex items-center gap-2 mb-2">
                      <ChefHat className="w-4 h-4 text-[#111111] dark:text-white" />
                      <span className="text-sm font-bold text-[#111111] dark:text-white">Composition du menu</span>
                    </div>
                    <p className="text-xs text-[#6B7280] dark:text-[#A3A3A3] leading-relaxed">
                      {aiResult.optimization.menuComposition.recommendation}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ── Loading ──────────────────────────────────────────────────────── */}
        {loading && (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-violet-500" />
            <span className="ml-3 text-[#9CA3AF] dark:text-[#737373]">{t('menuEngineering.loadingAnalysis')}</span>
          </div>
        )}

        {!loading && data && (
          <>
            {/* ── Summary cards ────────────────────────────────────────────── */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <SummaryCard
                icon={<ShoppingBag className="w-5 h-5" />}
                label={t('menuEngineering.totalSales')}
                value={data.totalSales.toString()}
                sub={`${t('menuEngineering.over')} ${data.days} ${t('menuEngineering.days')}`}
                color="violet"
              />
              <SummaryCard
                icon={<DollarSign className="w-5 h-5" />}
                label={t('menuEngineering.totalRevenue')}
                value={fmtEur(totalRevenue)}
                sub={t('menuEngineering.revenue')}
                color="emerald"
              />
              <SummaryCard
                icon={<Percent className="w-5 h-5" />}
                label={t('menuEngineering.avgMargin')}
                value={`${fmt(data.avgMargin, 1)}%`}
                sub={t('menuEngineering.allRecipes')}
                color="teal"
              />
              <SummaryCard
                icon={<ChefHat className="w-5 h-5" />}
                label={t('menuEngineering.nbRecipes')}
                value={items.length.toString()}
                sub={t('menuEngineering.analyzed')}
                color="amber"
              />
            </div>

            {/* ── Quadrant Summary Cards with Actions ─────────────────────── */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {([
                { q: 'star' as Quadrant, action: 'Maintenir', actionIcon: <Star className="w-3 h-3" />, actionColor: 'text-emerald-700 dark:text-emerald-300 bg-emerald-100 dark:bg-emerald-900/50' },
                { q: 'puzzle' as Quadrant, action: 'Promouvoir', actionIcon: <Eye className="w-3 h-3" />, actionColor: 'text-teal-700 dark:text-teal-300 bg-teal-100 dark:bg-teal-900/50' },
                { q: 'plow' as Quadrant, action: 'Optimiser le prix', actionIcon: <CircleDollarSign className="w-3 h-3" />, actionColor: 'text-amber-700 dark:text-amber-300 bg-amber-100 dark:bg-amber-900/50' },
                { q: 'dog' as Quadrant, action: 'Retirer ou reformuler', actionIcon: <ArrowRightLeft className="w-3 h-3" />, actionColor: 'text-red-700 dark:text-red-300 bg-red-100 dark:bg-red-900/50' },
              ]).map(({ q, action, actionIcon, actionColor }) => {
                const cfg = QUADRANT_CONFIG[q];
                const qItems = items.filter(i => i.quadrant === q);
                const qRevenue = qItems.reduce((s, i) => s + i.salesRevenue, 0);
                return (
                  <button
                    key={q}
                    onClick={() => setFilterQuadrant(prev => prev === q ? 'all' : q)}
                    className={`text-left p-5 rounded-2xl border-2 transition-all ${
                      filterQuadrant === q
                        ? `${cfg.border} ${cfg.bg} ring-2 ring-offset-1 ring-${cfg.color}-400/50`
                        : 'border-[#E5E7EB] dark:border-[#1A1A1A] bg-white dark:bg-[#0A0A0A] hover:border-[#D1D5DB] dark:hover:border-[#333333]'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-2xl">{cfg.emoji}</span>
                      <span className={`text-3xl font-bold ${cfg.text}`}>{quadrantCounts[q]}</span>
                    </div>
                    <div className="font-bold text-sm text-[#111111] dark:text-white">{cfg.label}</div>
                    <div className="text-xs text-[#9CA3AF] dark:text-[#737373] mt-0.5">{cfg.desc}</div>
                    {qRevenue > 0 && (
                      <div className="text-xs text-[#6B7280] dark:text-[#A3A3A3] mt-1 font-medium">
                        CA: {fmtEur(qRevenue)}
                      </div>
                    )}
                    <div className={`mt-3 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold ${actionColor}`}>
                      {actionIcon} {action}
                    </div>
                  </button>
                );
              })}
            </div>

            {/* ── Menu Mix Analysis + Price Optimization (2-col layout) ───── */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

              {/* ── Menu Mix Donut Chart ── */}
              <div className="bg-white dark:bg-[#0A0A0A] rounded-2xl border border-[#E5E7EB] dark:border-[#1A1A1A] shadow-sm p-6">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2.5 bg-gradient-to-br from-pink-500 to-rose-600 rounded-xl text-white shadow-lg">
                    <PieChart className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-[#111111] dark:text-white">Menu Mix</h2>
                    <p className="text-sm text-[#9CA3AF] dark:text-[#737373]">Repartition du CA par categorie</p>
                  </div>
                </div>

                {menuMixData.length > 0 ? (
                  <div className="flex flex-col sm:flex-row items-center gap-8">
                    {/* Donut chart via conic-gradient */}
                    <div className="relative flex-shrink-0">
                      <div
                        className="w-44 h-44 rounded-full shadow-inner"
                        style={{ background: menuMixGradient }}
                      />
                      {/* Inner circle for donut effect */}
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-24 h-24 rounded-full bg-white dark:bg-[#0A0A0A] flex flex-col items-center justify-center shadow-sm">
                          <span className="text-lg font-bold text-[#111111] dark:text-white">{menuMixData.length}</span>
                          <span className="text-[10px] text-[#9CA3AF] dark:text-[#737373]">categories</span>
                        </div>
                      </div>
                    </div>

                    {/* Legend */}
                    <div className="flex-1 space-y-3 w-full">
                      {menuMixData.map(d => (
                        <div key={d.category} className="flex items-center gap-3">
                          <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: d.color }} />
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between">
                              <span className="text-sm font-medium text-[#111111] dark:text-white truncate">{d.category}</span>
                              <span className="text-sm font-bold text-[#111111] dark:text-white ml-2">{fmt(d.percent, 1)}%</span>
                            </div>
                            <div className="flex items-center justify-between mt-0.5">
                              <span className="text-xs text-[#9CA3AF] dark:text-[#737373]">{d.count} recettes - {d.qty} ventes</span>
                              <span className="text-xs text-[#6B7280] dark:text-[#A3A3A3] font-medium">{fmtEur(d.revenue)}</span>
                            </div>
                            {/* Progress bar */}
                            <div className="w-full h-1.5 bg-[#F5F5F5] dark:bg-[#1A1A1A] rounded-full mt-1.5 overflow-hidden">
                              <div className="h-full rounded-full transition-all duration-500" style={{ width: `${d.percent}%`, backgroundColor: d.color }} />
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-12 text-[#9CA3AF] dark:text-[#737373]">
                    <PieChart className="w-10 h-10 mx-auto mb-2 opacity-50" />
                    <p className="text-sm">Aucune donnee de vente disponible</p>
                  </div>
                )}
              </div>

              {/* ── Price Optimization Suggestions ── */}
              <div className="bg-white dark:bg-[#0A0A0A] rounded-2xl border border-[#E5E7EB] dark:border-[#1A1A1A] shadow-sm p-6">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2.5 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl text-white shadow-lg">
                    <TrendingUp className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-[#111111] dark:text-white">Optimisation des prix</h2>
                    <p className="text-sm text-[#9CA3AF] dark:text-[#737373]">Suggestions par impact sur la marge globale</p>
                  </div>
                </div>

                {priceOptSuggestions.length > 0 ? (
                  <div className="space-y-3">
                    {priceOptSuggestions.map((sug, idx) => {
                      const isIncrease = sug.suggestedChange > 0;
                      const cfgQ = QUADRANT_CONFIG[sug.quadrant];
                      return (
                        <div
                          key={sug.id}
                          className="p-4 rounded-xl border border-[#E5E7EB] dark:border-[#1A1A1A] hover:border-[#D1D5DB] dark:hover:border-[#333333] transition-all"
                        >
                          <div className="flex items-start justify-between gap-3">
                            <div className="flex items-start gap-3 min-w-0">
                              <div className={`flex items-center justify-center w-7 h-7 rounded-full text-xs font-bold flex-shrink-0 ${
                                isIncrease ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-300' : 'bg-teal-100 text-teal-700 dark:bg-teal-900/50 dark:text-teal-300'
                              }`}>
                                {idx + 1}
                              </div>
                              <div className="min-w-0">
                                <div className="flex items-center gap-2 flex-wrap">
                                  <span className="font-bold text-sm text-[#111111] dark:text-white">{sug.name}</span>
                                  <span className={`inline-flex px-1.5 py-0.5 rounded text-[10px] font-semibold ${cfgQ.badge}`}>
                                    {cfgQ.emoji} {cfgQ.label}
                                  </span>
                                </div>
                                <p className="text-xs text-[#9CA3AF] dark:text-[#737373] mt-1 leading-relaxed">
                                  Si vous {isIncrease ? 'augmentez' : 'reduisez'} <strong className="text-[#111111] dark:text-white">{sug.name}</strong> de{' '}
                                  <strong className={isIncrease ? 'text-emerald-600 dark:text-emerald-400' : 'text-teal-600 dark:text-teal-400'}>
                                    {fmtEur(Math.abs(sug.suggestedChange))}
                                  </strong>, votre marge globale {sug.marginImpactPct > 0 ? 'augmente' : 'diminue'} de{' '}
                                  <strong className={sug.marginImpactPct > 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-600 dark:text-red-400'}>
                                    {sug.marginImpactPct > 0 ? '+' : ''}{fmt(sug.marginImpactPct, 1)}%
                                  </strong>.
                                </p>
                                <p className="text-[10px] text-[#9CA3AF] dark:text-[#525252] mt-1">{sug.reason}</p>
                              </div>
                            </div>
                            <div className="text-right flex-shrink-0">
                              <div className="text-xs text-[#9CA3AF] dark:text-[#737373] line-through">{fmtEur(sug.currentPrice)}</div>
                              <div className={`text-sm font-bold ${isIncrease ? 'text-emerald-600 dark:text-emerald-400' : 'text-teal-600 dark:text-teal-400'}`}>
                                {fmtEur(sug.newPrice)}
                              </div>
                              <div className="flex items-center justify-end gap-0.5 mt-1">
                                {isIncrease
                                  ? <TrendingUp className="w-3 h-3 text-emerald-500" />
                                  : <TrendingDown className="w-3 h-3 text-teal-500" />
                                }
                                <span className={`text-xs font-semibold ${isIncrease ? 'text-emerald-600 dark:text-emerald-400' : 'text-teal-600 dark:text-teal-400'}`}>
                                  {isIncrease ? '+' : ''}{fmtEur(sug.suggestedChange)}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="text-center py-12 text-[#9CA3AF] dark:text-[#737373]">
                    <CircleDollarSign className="w-10 h-10 mx-auto mb-2 opacity-50" />
                    <p className="text-sm">Ajoutez des ventes pour obtenir des suggestions</p>
                  </div>
                )}
              </div>
            </div>

            {/* ── BCG Matrix ──────────────────────────────────────────────── */}
            <div className="bg-white dark:bg-[#0A0A0A] rounded-2xl border border-[#E5E7EB] dark:border-[#1A1A1A] shadow-sm p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-lg font-bold text-[#111111] dark:text-white flex items-center gap-2">
                    <Target className="w-5 h-5 text-violet-500" />
                    {t('menuEngineering.bcgMatrix')}
                  </h2>
                  <p className="text-sm text-[#9CA3AF] dark:text-[#737373] mt-0.5">
                    {t('menuEngineering.bcgDescription')}
                  </p>
                </div>
                <div className="flex items-center gap-3 text-xs text-[#9CA3AF] dark:text-[#737373]">
                  <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-emerald-500" /> Vedettes</span>
                  <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-teal-500" /> Énigmes</span>
                  <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-amber-500" /> Valeurs sûres</span>
                  <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-red-500" /> Poids morts</span>
                </div>
              </div>

              {items.length > 0 ? (
                <BCGMatrix items={items} />
              ) : (
                <div className="text-center py-16 text-[#9CA3AF] dark:text-[#737373] dark:text-[#A3A3A3]">
                  <BarChart3 className="w-12 h-12 mx-auto mb-3 opacity-50" />
                  <p className="font-medium">{t('menuEngineering.addRecipesAndSales')}</p>
                  <p className="text-sm mt-1">{t('menuEngineering.createRecipesHint')}</p>
                </div>
              )}
            </div>

            {/* ── Detailed table ───────────────────────────────────────────── */}
            <div className="bg-white dark:bg-[#0A0A0A] rounded-2xl border border-[#E5E7EB] dark:border-[#1A1A1A] shadow-sm overflow-hidden">
              <div className="px-6 py-4 border-b border-[#E5E7EB] dark:border-[#1A1A1A] flex flex-wrap items-center justify-between gap-3">
                <h2 className="text-lg font-bold text-[#111111] dark:text-white flex items-center gap-2">
                  <Award className="w-5 h-5 text-violet-500" />
                  {t('menuEngineering.detailByRecipe')}
                </h2>
                <div className="flex items-center gap-2">
                  <select
                    value={filterQuadrant}
                    onChange={e => setFilterQuadrant(e.target.value as Quadrant | 'all')}
                    className="px-3 py-1.5 border border-[#E5E7EB] dark:border-[#1A1A1A] rounded-lg bg-white dark:bg-[#0A0A0A] text-sm text-[#9CA3AF] dark:text-[#737373] dark:text-white"
                  >
                    <option value="all">{t('menuEngineering.allQuadrants')}</option>
                    {(Object.keys(QUADRANT_CONFIG) as Quadrant[]).map(q => (
                      <option key={q} value={q}>{QUADRANT_CONFIG[q].emoji} {QUADRANT_CONFIG[q].label}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-[#FAFAFA] dark:bg-black/50">
                      {[
                        { field: 'name' as SortField, label: 'Nom' },
                        { field: 'category' as SortField, label: 'Catégorie' },
                        { field: 'sellingPrice' as SortField, label: 'Prix vente' },
                        { field: 'costPerPortion' as SortField, label: 'Coût' },
                        { field: 'margin' as SortField, label: 'Marge (€)' },
                        { field: 'marginPercent' as SortField, label: 'Marge (%)' },
                        { field: 'salesQty' as SortField, label: 'Ventes' },
                        { field: 'salesRevenue' as SortField, label: 'CA' },
                        { field: 'quadrant' as SortField, label: 'Quadrant' },
                      ].map(col => (
                        <th
                          key={col.field}
                          onClick={() => handleSort(col.field)}
                          className="px-4 py-3 text-left text-xs font-semibold text-[#9CA3AF] dark:text-[#737373] uppercase tracking-wider cursor-pointer hover:text-[#111111] dark:hover:text-[#111111] dark:text-white transition-colors select-none"
                        >
                          <span className="inline-flex items-center gap-1">
                            {col.label}
                            <SortIcon field={col.field} />
                          </span>
                        </th>
                      ))}
                      <th className="px-4 py-3 text-center text-xs font-semibold text-[#9CA3AF] dark:text-[#737373] uppercase tracking-wider">
                        Score
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-[#9CA3AF] dark:text-[#737373] uppercase tracking-wider">
                        Allergènes
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-[#9CA3AF] dark:text-[#737373] uppercase tracking-wider">
                        Action
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#E5E7EB] dark:divide-[#1A1A1A]/50">
                    {sortedItems.length === 0 ? (
                      <tr>
                        <td colSpan={12} className="px-4 py-12 text-center text-[#9CA3AF] dark:text-[#737373] dark:text-[#A3A3A3]">
                          {t('menuEngineering.noDishFound')}
                        </td>
                      </tr>
                    ) : (
                      sortedItems.map(item => {
                        const cfg = QUADRANT_CONFIG[item.quadrant] || QUADRANT_CONFIG['star'];
                        const score = computeProfitabilityScore(item, maxSalesQty);
                        const allergens = recipeAllergens[item.id] || [];
                        return (
                          <tr key={item.id} className="hover:bg-[#FAFAFA] dark:hover:bg-[#171717]/50 transition-colors">
                            <td className="px-4 py-3 font-medium text-[#111111] dark:text-white whitespace-nowrap">
                              {item.name}
                            </td>
                            <td className="px-4 py-3 text-[#6B7280] dark:text-[#A3A3A3]">
                              {item.category}
                            </td>
                            <td className="px-4 py-3 text-[#9CA3AF] dark:text-[#737373] dark:text-white font-mono text-right">
                              {fmtEur(item.sellingPrice)}
                            </td>
                            <td className="px-4 py-3 text-[#9CA3AF] dark:text-[#737373] dark:text-white font-mono text-right">
                              {fmtEur(item.costPerPortion)}
                            </td>
                            <td className="px-4 py-3 font-mono text-right font-medium text-[#111111] dark:text-white">
                              {fmtEur(item.margin)}
                            </td>
                            <td className="px-4 py-3 text-right">
                              <MarginBadge percent={item.marginPercent} />
                            </td>
                            <td className="px-4 py-3 text-[#9CA3AF] dark:text-[#737373] dark:text-white font-mono text-right">
                              {item.salesQty}
                            </td>
                            <td className="px-4 py-3 font-mono text-right font-medium text-[#111111] dark:text-white">
                              {fmtEur(item.salesRevenue)}
                            </td>
                            <td className="px-4 py-3">
                              <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold ${cfg.badge}`}>
                                {cfg.emoji} {cfg.label}
                              </span>
                            </td>
                            <td className="px-4 py-3 text-center">
                              <span className={`inline-flex items-center justify-center w-10 h-10 rounded-full text-sm font-bold ${scoreBg(score)} ${scoreColor(score)}`}>
                                {score}
                              </span>
                            </td>
                            <td className="px-4 py-3">
                              <div className="flex flex-wrap gap-1 max-w-[180px]">
                                {allergens.length > 0 ? (
                                  <>
                                    {allergens.length >= 3 && (
                                      <AlertTriangle className="w-3.5 h-3.5 text-amber-500 mr-0.5 flex-shrink-0 mt-0.5" />
                                    )}
                                    {allergens.map(a => (
                                      <span key={a} className={`inline-flex px-1.5 py-0.5 rounded text-[10px] font-medium leading-tight ${getAllergenColor(a)}`}>
                                        {a}
                                      </span>
                                    ))}
                                  </>
                                ) : (
                                  <span className="text-xs text-[#9CA3AF] dark:text-[#737373]">-</span>
                                )}
                              </div>
                            </td>
                            <td className="px-4 py-3">
                              <button
                                onClick={() => { setWhatIfRecipeId(item.id); setWhatIfPriceAdjust(0); setShowWhatIf(true); }}
                                className="inline-flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-medium text-violet-600 dark:text-violet-400 hover:bg-violet-50 dark:hover:bg-violet-900/30 transition-colors"
                                title={t('menuEngineering.simulatePrice')}
                              >
                                <SlidersHorizontal className="w-3.5 h-3.5" /> {t('menuEngineering.simulate')}
                              </button>
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* ── AI Recommendations ─────────────────────────────────────────── */}
            {recommendations.length > 0 && (
              <div className="bg-white dark:bg-[#0A0A0A] rounded-2xl border border-[#E5E7EB] dark:border-[#1A1A1A] shadow-sm p-6">
                <div className="flex items-center gap-3 mb-5">
                  <div className="p-2.5 bg-gradient-to-br from-amber-400 to-orange-500 rounded-xl text-white shadow-lg">
                    <Lightbulb className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-[#111111] dark:text-white">
                      {t('menuEngineering.aiRecommendations')}
                    </h2>
                    <p className="text-sm text-[#9CA3AF] dark:text-[#737373]">
                      {t('menuEngineering.aiRecommendationsDesc')}
                    </p>
                  </div>
                </div>

                <div className="space-y-3">
                  {recommendations.map((tip, idx) => {
                    const borderColors = {
                      success: 'border-l-emerald-500 bg-emerald-50/50 dark:bg-emerald-950/20',
                      info: 'border-l-teal-500 bg-teal-50/50 dark:bg-teal-950/20',
                      warning: 'border-l-amber-500 bg-amber-50/50 dark:bg-amber-950/20',
                      danger: 'border-l-red-500 bg-red-50/50 dark:bg-red-950/20',
                    };
                    return (
                      <div
                        key={idx}
                        className={`flex items-start gap-3 p-4 rounded-xl border-l-4 ${borderColors[tip.type]}`}
                      >
                        <span className="text-xl flex-shrink-0 mt-0.5">{tip.icon}</span>
                        <p className="text-sm text-[#9CA3AF] dark:text-[#737373] dark:text-white leading-relaxed">
                          {tip.text}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* ── Drag-Drop Menu Reorder ──────────────────────────────────── */}
            <div className="bg-white dark:bg-[#0A0A0A] rounded-2xl border border-[#E5E7EB] dark:border-[#1A1A1A] shadow-sm p-6">
              <div className="flex items-center justify-between mb-5">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 bg-gradient-to-br from-indigo-500 to-blue-600 rounded-xl text-white shadow-lg">
                    <GripVertical className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-[#111111] dark:text-white">Simuler l'ordre du menu</h2>
                    <p className="text-sm text-[#9CA3AF] dark:text-[#737373]">Glissez-deposez pour reorganiser vos plats</p>
                  </div>
                </div>
                <button
                  onClick={() => {
                    setShowReorder(!showReorder);
                    if (!showReorder && menuOrder.length === 0) setMenuOrder([...items]);
                  }}
                  className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                    showReorder
                      ? 'bg-[#111111] dark:bg-white text-white dark:text-black'
                      : 'bg-[#F5F5F5] dark:bg-[#171717] text-[#6B7280] dark:text-[#A3A3A3] hover:bg-[#E5E7EB] dark:hover:bg-[#1A1A1A]'
                  }`}
                >
                  <GripVertical className="w-4 h-4" />
                  {showReorder ? 'Masquer' : 'Reorganiser'}
                </button>
              </div>

              {showReorder && menuOrder.length > 0 && (
                <div className="space-y-1.5 max-h-[400px] overflow-y-auto pr-2">
                  {menuOrder.map((item, idx) => {
                    const cfg = QUADRANT_CONFIG[item.quadrant] || QUADRANT_CONFIG['star'];
                    const isDragging = dragIdx === idx;
                    const isDragOver = dragOverIdx === idx;
                    return (
                      <div
                        key={item.id}
                        draggable
                        onDragStart={() => handleDragStart(idx)}
                        onDragOver={(e) => handleDragOver(e, idx)}
                        onDrop={() => handleDrop(idx)}
                        onDragEnd={() => { setDragIdx(null); setDragOverIdx(null); }}
                        onTouchStart={() => handleTouchDragStart(idx)}
                        onTouchEnd={() => handleTouchDragEnd(idx)}
                        className={`flex items-center gap-3 p-3 rounded-xl border transition-all cursor-grab active:cursor-grabbing select-none ${
                          isDragging
                            ? 'opacity-50 border-violet-400 dark:border-violet-600 bg-violet-50 dark:bg-violet-950/30'
                            : isDragOver
                              ? 'border-violet-300 dark:border-violet-700 bg-violet-50/50 dark:bg-violet-950/20 scale-[1.01]'
                              : 'border-[#E5E7EB] dark:border-[#1A1A1A] bg-white dark:bg-[#0A0A0A] hover:bg-[#FAFAFA] dark:hover:bg-[#171717]'
                        }`}
                      >
                        {/* Drag handle */}
                        <div className="flex flex-col items-center gap-0.5 text-[#D1D5DB] dark:text-[#525252]">
                          <GripVertical className="w-4 h-4" />
                        </div>

                        {/* Position number */}
                        <div className="flex items-center justify-center w-7 h-7 rounded-lg bg-[#F5F5F5] dark:bg-[#171717] text-xs font-bold text-[#6B7280] dark:text-[#A3A3A3]">
                          {idx + 1}
                        </div>

                        {/* Item info */}
                        <div className="flex-1 min-w-0">
                          <div className="font-medium text-sm text-[#111111] dark:text-white truncate">{item.name}</div>
                          <div className="text-xs text-[#9CA3AF] dark:text-[#737373]">{item.category} - {fmtEur(item.sellingPrice)}</div>
                        </div>

                        {/* Quadrant badge */}
                        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold flex-shrink-0 ${cfg.badge}`}>
                          {cfg.emoji} {cfg.label}
                        </span>

                        {/* Margin */}
                        <div className="text-right flex-shrink-0">
                          <div className="text-xs font-bold text-[#111111] dark:text-white">{fmt(item.marginPercent, 1)}%</div>
                          <div className="text-[10px] text-[#9CA3AF] dark:text-[#737373]">{fmtEur(item.margin)}</div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              {showReorder && menuOrder.length === 0 && (
                <div className="text-center py-8 text-[#9CA3AF] dark:text-[#737373]">
                  <GripVertical className="w-10 h-10 mx-auto mb-2 opacity-50" />
                  <p className="text-sm">Aucune recette a reorganiser</p>
                </div>
              )}

              {!showReorder && (
                <div className="text-center py-6 text-[#9CA3AF] dark:text-[#737373]">
                  <p className="text-sm">Cliquez sur "Reorganiser" pour simuler un nouvel agencement de votre carte</p>
                </div>
              )}
            </div>

            {/* ── Score Legend ────────────────────────────────────────────────── */}
            <div className="bg-white dark:bg-[#0A0A0A] rounded-2xl border border-[#E5E7EB] dark:border-[#1A1A1A] shadow-sm p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2.5 bg-gradient-to-br from-teal-500 to-indigo-600 rounded-xl text-white shadow-lg">
                  <Shield className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-[#111111] dark:text-white">
                    {t('menuEngineering.scoreLegend')}
                  </h2>
                  <p className="text-sm text-[#9CA3AF] dark:text-[#737373]">
                    {t('menuEngineering.scoreLegendDesc')}
                  </p>
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="flex items-center gap-3 p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-800">
                  <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-emerald-100 dark:bg-emerald-900/40 text-emerald-600 dark:text-emerald-400 text-sm font-bold">71+</span>
                  <div>
                    <div className="font-semibold text-emerald-700 dark:text-emerald-300 text-sm">{t('menuEngineering.excellent')}</div>
                    <div className="text-xs text-emerald-600/70 dark:text-emerald-400/70">{t('menuEngineering.veryProfitable')}</div>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 rounded-xl bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800">
                  <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-amber-100 dark:bg-amber-900/40 text-amber-600 dark:text-amber-400 text-sm font-bold">40-70</span>
                  <div>
                    <div className="font-semibold text-amber-700 dark:text-amber-300 text-sm">{t('menuEngineering.average')}</div>
                    <div className="text-xs text-amber-600/70 dark:text-amber-400/70">{t('menuEngineering.toOptimize')}</div>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 rounded-xl bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800">
                  <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-red-100 dark:bg-red-900/40 text-red-600 dark:text-red-400 text-sm font-bold">&lt;40</span>
                  <div>
                    <div className="font-semibold text-red-700 dark:text-red-300 text-sm">{t('menuEngineering.low')}</div>
                    <div className="text-xs text-red-600/70 dark:text-red-400/70">{t('menuEngineering.actionRequired')}</div>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </div>

      {/* ── Modal: What-If Scenario ─────────────────────────────────────────── */}
      <Modal isOpen={showWhatIf} onClose={() => setShowWhatIf(false)} title={t('menuEngineering.whatIfTitle')}>
        <div className="space-y-5">
          {/* Recipe selector */}
          <div>
            <label className="block text-sm font-medium text-[#9CA3AF] dark:text-[#737373] dark:text-[#A3A3A3] mb-1">{t('menuEngineering.recipe')}</label>
            <select
              value={whatIfRecipeId}
              onChange={e => { setWhatIfRecipeId(e.target.value ? Number(e.target.value) : ''); setWhatIfPriceAdjust(0); }}
              className="w-full px-3 py-2.5 border border-[#E5E7EB] dark:border-[#1A1A1A] rounded-xl bg-white dark:bg-[#0A0A0A] text-[#9CA3AF] dark:text-[#737373] dark:text-white"
            >
              <option value="">{t('menuEngineering.selectRecipe')}</option>
              {items.map(r => (
                <option key={r.id} value={r.id}>{r.name} ({fmtEur(r.sellingPrice)})</option>
              ))}
            </select>
          </div>

          {/* Price slider */}
          {whatIfRecipeId && whatIfData && (
            <>
              <div>
                <label className="block text-sm font-medium text-[#9CA3AF] dark:text-[#737373] dark:text-[#A3A3A3] mb-2">
                  Ajustement du prix: <span className={`font-bold ${whatIfPriceAdjust > 0 ? 'text-emerald-600' : whatIfPriceAdjust < 0 ? 'text-red-600' : 'text-[#6B7280] dark:text-[#A3A3A3]'}`}>
                    {whatIfPriceAdjust > 0 ? '+' : ''}{whatIfPriceAdjust}%
                  </span>
                </label>
                <input
                  type="range"
                  min={-30}
                  max={30}
                  step={1}
                  value={whatIfPriceAdjust}
                  onChange={e => setWhatIfPriceAdjust(Number(e.target.value))}
                  className="w-full h-2 bg-[#E5E7EB] dark:bg-[#171717] rounded-lg appearance-none cursor-pointer accent-violet-600"
                />
                <div className="flex justify-between text-xs text-[#9CA3AF] dark:text-[#737373] mt-1">
                  <span>-30%</span>
                  <span>0%</span>
                  <span>+30%</span>
                </div>
              </div>

              {/* Results */}
              <div className="bg-[#FAFAFA] dark:bg-black/50 rounded-xl p-4 space-y-3">
                <div className="grid grid-cols-2 gap-4">
                  {/* Price comparison */}
                  <div className="space-y-1">
                    <div className="text-xs text-[#9CA3AF] dark:text-[#737373] uppercase font-semibold">Prix actuel</div>
                    <div className="text-lg font-bold text-[#9CA3AF] dark:text-[#737373] dark:text-white">{fmtEur(whatIfData.originalPrice)}</div>
                  </div>
                  <div className="space-y-1">
                    <div className="text-xs text-[#9CA3AF] dark:text-[#737373] uppercase font-semibold">Nouveau prix</div>
                    <div className={`text-lg font-bold ${whatIfPriceAdjust > 0 ? 'text-emerald-600 dark:text-emerald-400' : whatIfPriceAdjust < 0 ? 'text-red-600 dark:text-red-400' : 'text-[#9CA3AF] dark:text-[#737373] dark:text-white'}`}>
                      {fmtEur(whatIfData.newPrice)}
                    </div>
                  </div>

                  {/* Margin comparison */}
                  <div className="space-y-1">
                    <div className="text-xs text-[#9CA3AF] dark:text-[#737373] uppercase font-semibold">Marge actuelle</div>
                    <div className="text-lg font-bold text-[#9CA3AF] dark:text-[#737373] dark:text-white">{fmt(whatIfData.originalMarginPercent, 1)}%</div>
                  </div>
                  <div className="space-y-1">
                    <div className="text-xs text-[#9CA3AF] dark:text-[#737373] uppercase font-semibold">Nouvelle marge</div>
                    <div className={`text-lg font-bold ${whatIfData.newMarginPercent > whatIfData.originalMarginPercent ? 'text-emerald-600 dark:text-emerald-400' : whatIfData.newMarginPercent < whatIfData.originalMarginPercent ? 'text-red-600 dark:text-red-400' : 'text-[#9CA3AF] dark:text-[#737373] dark:text-white'}`}>
                      {fmt(whatIfData.newMarginPercent, 1)}%
                    </div>
                  </div>

                  {/* Food cost ratio */}
                  <div className="space-y-1">
                    <div className="text-xs text-[#9CA3AF] dark:text-[#737373] uppercase font-semibold">Ratio coût matière</div>
                    <div className="text-lg font-bold text-[#9CA3AF] dark:text-[#737373] dark:text-white">{fmt(whatIfData.originalFoodCostRatio, 1)}%</div>
                  </div>
                  <div className="space-y-1">
                    <div className="text-xs text-[#9CA3AF] dark:text-[#737373] uppercase font-semibold">Nouveau ratio</div>
                    <div className={`text-lg font-bold ${whatIfData.newFoodCostRatio < whatIfData.originalFoodCostRatio ? 'text-emerald-600 dark:text-emerald-400' : whatIfData.newFoodCostRatio > whatIfData.originalFoodCostRatio ? 'text-red-600 dark:text-red-400' : 'text-[#9CA3AF] dark:text-[#737373] dark:text-white'}`}>
                      {fmt(whatIfData.newFoodCostRatio, 1)}%
                    </div>
                  </div>
                </div>

                {/* Revenue impact */}
                <div className="pt-3 border-t border-[#E5E7EB] dark:border-[#1A1A1A]">
                  <div className="text-xs text-[#9CA3AF] dark:text-[#737373] uppercase font-semibold mb-1">Impact CA estimé (sur {whatIfData.item.salesQty} ventes)</div>
                  <div className={`text-xl font-bold ${whatIfData.revenueImpact > 0 ? 'text-emerald-600 dark:text-emerald-400' : whatIfData.revenueImpact < 0 ? 'text-red-600 dark:text-red-400' : 'text-[#6B7280] dark:text-[#A3A3A3]'}`}>
                    {whatIfData.revenueImpact > 0 ? '+' : ''}{fmtEur(whatIfData.revenueImpact)}
                  </div>
                </div>

                {/* Summary message */}
                {whatIfPriceAdjust !== 0 && (
                  <div className={`p-3 rounded-lg text-sm ${whatIfPriceAdjust > 0 ? 'bg-emerald-50 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800' : 'bg-red-50 dark:bg-red-950/30 text-red-700 dark:text-red-300 border border-red-200 dark:border-red-800'}`}>
                    Si vous {whatIfPriceAdjust > 0 ? 'augmentez' : 'baissez'} le prix de {fmtEur(Math.abs(whatIfData.newPrice - whatIfData.originalPrice))}, la marge passe de {fmt(whatIfData.originalMarginPercent, 1)}% à {fmt(whatIfData.newMarginPercent, 1)}%.
                  </div>
                )}
              </div>
            </>
          )}

          <div className="flex justify-end pt-2">
            <button
              onClick={() => setShowWhatIf(false)}
              className="px-4 py-2.5 border border-[#E5E7EB] dark:border-[#1A1A1A] rounded-xl text-sm font-medium text-[#6B7280] dark:text-[#A3A3A3] hover:bg-[#FAFAFA] dark:hover:bg-[#171717] transition-colors"
            >
              {t('menuEngineering.close')}
            </button>
          </div>
        </div>
      </Modal>

      {/* ── Modal: Saisie de vente ──────────────────────────────────────────── */}
      <Modal isOpen={showSalesModal} onClose={() => setShowSalesModal(false)} title={t('menuEngineering.addSaleTitle')}>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-[#9CA3AF] dark:text-[#737373] dark:text-[#A3A3A3] mb-1">{t('menuEngineering.recipe')}</label>
            <select
              value={saleRecipeId}
              onChange={e => setSaleRecipeId(e.target.value ? Number(e.target.value) : '')}
              className="w-full px-3 py-2.5 border border-[#E5E7EB] dark:border-[#1A1A1A] rounded-xl bg-white dark:bg-[#0A0A0A] text-[#9CA3AF] dark:text-[#737373] dark:text-white"
            >
              <option value="">{t('menuEngineering.selectRecipe')}</option>
              {recipes.map(r => (
                <option key={r.id} value={r.id}>{r.name} ({r.category})</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-[#9CA3AF] dark:text-[#737373] dark:text-[#A3A3A3] mb-1">{t('menuEngineering.qtySold')}</label>
            <input
              type="number"
              min="1"
              value={saleQty}
              onChange={e => setSaleQty(e.target.value)}
              placeholder="Ex: 12"
              className="w-full px-3 py-2.5 border border-[#E5E7EB] dark:border-[#1A1A1A] rounded-xl bg-white dark:bg-[#0A0A0A] text-[#9CA3AF] dark:text-[#737373] dark:text-white"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-[#9CA3AF] dark:text-[#737373] dark:text-[#A3A3A3] mb-1">{t('menuEngineering.date')}</label>
            <input
              type="date"
              value={saleDate}
              onChange={e => setSaleDate(e.target.value)}
              className="w-full px-3 py-2.5 border border-[#E5E7EB] dark:border-[#1A1A1A] rounded-xl bg-white dark:bg-[#0A0A0A] text-[#9CA3AF] dark:text-[#737373] dark:text-white"
            />
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button
              onClick={() => setShowSalesModal(false)}
              className="px-4 py-2.5 border border-[#E5E7EB] dark:border-[#1A1A1A] rounded-xl text-sm font-medium text-[#6B7280] dark:text-[#A3A3A3] hover:bg-[#FAFAFA] dark:hover:bg-[#171717] transition-colors"
            >
              {t('menuEngineering.cancel')}
            </button>
            <button
              onClick={handleSubmitSale}
              disabled={saleSubmitting}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 text-white rounded-xl font-medium text-sm shadow-lg shadow-violet-500/25 transition-all disabled:opacity-50"
            >
              {saleSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
              {t('menuEngineering.save')}
            </button>
          </div>
        </div>
      </Modal>

      {/* ── Modal: Bulk import ──────────────────────────────────────────────── */}
      <Modal isOpen={showBulkModal} onClose={() => setShowBulkModal(false)} title={t('menuEngineering.csvImportTitle')}>
        <div className="space-y-4">
          <div className="p-3 bg-teal-50 dark:bg-teal-950/30 border border-teal-200 dark:border-teal-800 rounded-xl text-sm text-teal-700 dark:text-teal-300">
            <p className="font-medium mb-1">Format attendu (séparateur: virgule, point-virgule ou tabulation)</p>
            <code className="text-xs block mt-1 font-mono">
              nom_recette, quantité, date (YYYY-MM-DD)<br />
              Burger Classic, 25, 2026-03-20<br />
              Salade César, 18, 2026-03-20<br />
              Tiramisu, 12, 2026-03-20
            </code>
          </div>

          <div>
            <label className="block text-sm font-medium text-[#9CA3AF] dark:text-[#737373] dark:text-[#A3A3A3] mb-1">
              {t('menuEngineering.csvData')}
            </label>
            <textarea
              rows={8}
              value={bulkCsv}
              onChange={e => setBulkCsv(e.target.value)}
              placeholder={t('menuEngineering.pasteDataHere')}
              className="w-full px-3 py-2.5 border border-[#E5E7EB] dark:border-[#1A1A1A] rounded-xl bg-white dark:bg-[#0A0A0A] text-[#9CA3AF] dark:text-[#737373] dark:text-white font-mono text-sm resize-y"
            />
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button
              onClick={() => setShowBulkModal(false)}
              className="px-4 py-2.5 border border-[#E5E7EB] dark:border-[#1A1A1A] rounded-xl text-sm font-medium text-[#6B7280] dark:text-[#A3A3A3] hover:bg-[#FAFAFA] dark:hover:bg-[#171717] transition-colors"
            >
              {t('menuEngineering.cancel')}
            </button>
            <button
              onClick={handleBulkImport}
              disabled={bulkSubmitting}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 text-white rounded-xl font-medium text-sm shadow-lg shadow-violet-500/25 transition-all disabled:opacity-50"
            >
              {bulkSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
              {t('menuEngineering.import')}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

// ── Reusable subcomponents ───────────────────────────────────────────────────

function SummaryCard({ icon, label, value, sub, color }: {
  icon: React.ReactNode;
  label: string;
  value: string;
  sub: string;
  color: string;
}) {
  const colorMap: Record<string, { bg: string; icon: string; border: string }> = {
    violet: {
      bg: 'from-violet-50 to-white dark:from-violet-950/30 dark:to-[#0A0A0A]',
      icon: 'bg-violet-100 text-violet-600 dark:bg-violet-900/50 dark:text-violet-400',
      border: 'border-t-violet-500',
    },
    emerald: {
      bg: 'from-emerald-50 to-white dark:from-emerald-950/30 dark:to-[#0A0A0A]',
      icon: 'bg-emerald-100 text-emerald-600 dark:bg-emerald-900/50 dark:text-emerald-400',
      border: 'border-t-emerald-500',
    },
    teal: {
      bg: 'from-teal-50 to-white dark:from-teal-950/30 dark:to-[#0A0A0A]',
      icon: 'bg-teal-100 text-teal-600 dark:bg-teal-900/50 dark:text-teal-400',
      border: 'border-t-teal-500',
    },
    amber: {
      bg: 'from-amber-50 to-white dark:from-amber-950/30 dark:to-[#0A0A0A]',
      icon: 'bg-amber-100 text-amber-600 dark:bg-amber-900/50 dark:text-amber-400',
      border: 'border-t-amber-500',
    },
  };
  const c = colorMap[color] || colorMap.violet;

  return (
    <div className={`bg-gradient-to-br ${c.bg} rounded-2xl border border-[#E5E7EB] dark:border-[#1A1A1A] border-t-4 ${c.border} p-5 shadow-sm`}>
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs font-semibold text-[#9CA3AF] dark:text-[#737373] uppercase tracking-wider">{label}</span>
        <div className={`p-2 rounded-lg ${c.icon}`}>{icon}</div>
      </div>
      <div className="text-2xl font-bold text-[#111111] dark:text-white">{value}</div>
      <div className="text-xs text-[#9CA3AF] dark:text-[#737373] mt-1">{sub}</div>
    </div>
  );
}

function MarginBadge({ percent }: { percent: number }) {
  const cls = percent >= 70
    ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/50 dark:text-emerald-300'
    : percent >= 50
    ? 'bg-amber-100 text-amber-800 dark:bg-amber-900/50 dark:text-amber-300'
    : 'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300';
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold ${cls}`}>
      {fmt(percent, 1)}%
    </span>
  );
}
