import { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  TrendingUp, TrendingDown, DollarSign, ChefHat, Eye, Briefcase,
  PieChart as PieChartIcon, AlertTriangle, Plus, Download, Printer, ShieldAlert,
  Trophy, Target, Calculator, Utensils, BarChart3, ArrowRight, ArrowUpRight, ArrowDownRight,
  ChevronDown, ChevronRight, Package, ClipboardList, FileText, ShoppingCart,
  Lightbulb, Sparkles, Star, Zap, ArrowUp, ArrowDown,
} from 'lucide-react';
import {
  PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Legend, Treemap, LineChart, Line, LabelList,
} from 'recharts';
import { fetchRecipes, fetchIngredients } from '../services/api';
import type { Recipe, Ingredient } from '../types';
import { ALLERGENS } from '../types';

// ── Color Palette ──────────────────────────────────────────────────────────
const COLORS = ['#2563eb', '#059669', '#d97706', '#dc2626', '#7c3aed', '#0891b2', '#e11d48', '#4f46e5'];
const FOOD_CATEGORY_COLORS: Record<string, string> = {
  'Viandes': '#dc2626',
  'Poissons & Fruits de mer': '#2563eb',
  'Légumes': '#16a34a',
  'Fruits': '#f59e0b',
  'Produits laitiers': '#8b5cf6',
  'Épices & Condiments': '#ea580c',
  'Féculents & Céréales': '#a16207',
  'Huiles & Matières grasses': '#0891b2',
  'Boissons': '#ec4899',
  'Autres': '#64748b',
};
const MARGIN_BAR_COLORS: Record<string, string> = {
  'Entrée': '#2563eb',
  'Plat': '#059669',
  'Dessert': '#d97706',
  'Boisson': '#7c3aed',
  'Accompagnement': '#0891b2',
};

// ── Allergen color map ─────────────────────────────────────────────────────
const ALLERGEN_COLORS: Record<string, string> = {
  Gluten: 'bg-yellow-200 text-yellow-900 dark:bg-yellow-800/50 dark:text-yellow-200',
  'Crustacés': 'bg-orange-200 text-orange-900 dark:bg-orange-800/50 dark:text-orange-200',
  Oeufs: 'bg-amber-200 text-amber-900 dark:bg-amber-800/50 dark:text-amber-200',
  Poissons: 'bg-blue-200 text-blue-900 dark:bg-blue-800/50 dark:text-blue-200',
  Arachides: 'bg-red-200 text-red-900 dark:bg-red-800/50 dark:text-red-200',
  Soja: 'bg-green-200 text-green-900 dark:bg-green-800/50 dark:text-green-200',
  Lait: 'bg-sky-200 text-sky-900 dark:bg-sky-800/50 dark:text-sky-200',
  'Fruits à coque': 'bg-stone-200 text-stone-900 dark:bg-stone-800/50 dark:text-stone-200',
  'Céleri': 'bg-lime-200 text-lime-900 dark:bg-lime-800/50 dark:text-lime-200',
  Moutarde: 'bg-yellow-300 text-yellow-900 dark:bg-yellow-700/50 dark:text-yellow-200',
  'Sésame': 'bg-teal-200 text-teal-900 dark:bg-teal-800/50 dark:text-teal-200',
  Sulfites: 'bg-purple-200 text-purple-900 dark:bg-purple-800/50 dark:text-purple-200',
  Lupin: 'bg-violet-200 text-violet-900 dark:bg-violet-800/50 dark:text-violet-200',
  Mollusques: 'bg-cyan-200 text-cyan-900 dark:bg-cyan-800/50 dark:text-cyan-200',
};

// ── Tab definitions with descriptions ──────────────────────────────────────
type TabKey = 'overview' | 'margins' | 'costs' | 'profitability';
const TABS: { key: TabKey; label: string; desc: string; icon: any }[] = [
  { key: 'overview', label: "Vue d'ensemble", desc: 'Résumé global et catégories', icon: BarChart3 },
  { key: 'margins', label: 'Analyse des marges', desc: 'Marges par recette et classement', icon: TrendingUp },
  { key: 'costs', label: 'Coûts matière', desc: 'Répartition des coûts ingrédients', icon: ShoppingCart },
  { key: 'profitability', label: 'Rentabilité', desc: 'Projections et seuils', icon: DollarSign },
];

// ── Stat card color configs ────────────────────────────────────────────────
const STAT_CARD_STYLES: Record<string, { gradient: string; border: string }> = {
  blue:   { gradient: 'from-blue-50 to-white dark:from-blue-950/30 dark:to-slate-800',   border: 'border-t-blue-500' },
  green:  { gradient: 'from-green-50 to-white dark:from-green-950/30 dark:to-slate-800',  border: 'border-t-green-500' },
  amber:  { gradient: 'from-amber-50 to-white dark:from-amber-950/30 dark:to-slate-800',  border: 'border-t-amber-500' },
  purple: { gradient: 'from-purple-50 to-white dark:from-purple-950/30 dark:to-slate-800', border: 'border-t-purple-500' },
  cyan:   { gradient: 'from-cyan-50 to-white dark:from-cyan-950/30 dark:to-slate-800',    border: 'border-t-cyan-500' },
  slate:  { gradient: 'from-slate-50 to-white dark:from-slate-900/50 dark:to-slate-800',   border: 'border-t-slate-500' },
};

// ── Animated Number Counter ────────────────────────────────────────────────
function AnimatedNumber({ value, decimals = 1, suffix = '', prefix = '', duration = 800 }: {
  value: number; decimals?: number; suffix?: string; prefix?: string; duration?: number;
}) {
  const [display, setDisplay] = useState(0);
  const ref = useRef<number>();

  useEffect(() => {
    const start = display;
    const diff = value - start;
    const startTime = performance.now();
    const step = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplay(start + diff * eased);
      if (progress < 1) ref.current = requestAnimationFrame(step);
    };
    ref.current = requestAnimationFrame(step);
    return () => { if (ref.current) cancelAnimationFrame(ref.current); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value, duration]);

  return <span>{prefix}{display.toFixed(decimals)}{suffix}</span>;
}

// ── Enhanced Stat Card ─────────────────────────────────────────────────────
function StatCard({ title, value, numericValue, subtitle, icon: Icon, color, colorKey, decimals = 1, suffix = '', prefix = '', trend }: {
  title: string; value?: string; numericValue?: number; subtitle?: string; icon: any; color: string;
  colorKey: string; decimals?: number; suffix?: string; prefix?: string; trend?: 'up' | 'down' | null;
}) {
  const style = STAT_CARD_STYLES[colorKey] || STAT_CARD_STYLES.blue;
  return (
    <div className={`bg-gradient-to-b ${style.gradient} rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 border-t-[3px] ${style.border} p-4 sm:p-5 hover:shadow-md transition-shadow`}>
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs sm:text-sm font-medium text-slate-500 dark:text-slate-400 truncate">{title}</span>
        <div className={`p-2 rounded-lg ${color}`}>
          <Icon className="w-4 h-4 text-white" />
        </div>
      </div>
      <div className="flex items-end gap-2">
        <div className="text-2xl sm:text-3xl font-bold text-slate-800 dark:text-slate-100">
          {numericValue !== undefined
            ? <AnimatedNumber value={numericValue} decimals={decimals} suffix={suffix} prefix={prefix} />
            : value}
        </div>
        {trend && (
          <div className={`flex items-center gap-0.5 mb-1 ${trend === 'up' ? 'text-green-500' : 'text-red-500'}`}>
            {trend === 'up' ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
          </div>
        )}
      </div>
      {subtitle && <p className="text-xs text-slate-400 dark:text-slate-500 mt-1 truncate">{subtitle}</p>}
    </div>
  );
}

// ── Progress Bar for ranked lists ──────────────────────────────────────────
function RankBar({ rank, name, value, maxValue, color, unit = '%', link }: {
  rank: number; name: string; value: number; maxValue: number; color: string; unit?: string; link?: string;
}) {
  const pct = maxValue > 0 ? (value / maxValue) * 100 : 0;
  const inner = (
    <div className="flex items-center gap-3 group">
      <span className="text-xs font-bold text-slate-400 dark:text-slate-500 w-5 text-right">{rank}</span>
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between mb-1">
          <span className="text-sm font-medium text-slate-700 dark:text-slate-300 truncate pr-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
            {name}
          </span>
          <span className="text-sm font-bold tabular-nums whitespace-nowrap" style={{ color }}>
            {value.toFixed(1)}{unit}
          </span>
        </div>
        <div className="h-2 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-700 ease-out"
            style={{ width: `${Math.min(pct, 100)}%`, backgroundColor: color }}
          />
        </div>
      </div>
    </div>
  );
  return link ? <Link to={link} className="block">{inner}</Link> : <div>{inner}</div>;
}

// ── Custom Recharts Tooltip ────────────────────────────────────────────────
function ChartTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white dark:bg-slate-800 shadow-xl rounded-lg p-3 border border-slate-200 dark:border-slate-600 text-sm min-w-[180px]">
      <p className="font-semibold text-slate-800 dark:text-slate-100 mb-1.5">
        {payload[0]?.payload?.fullName || label || payload[0]?.payload?.name}
      </p>
      {payload.map((p: any, i: number) => (
        <div key={i} className="flex items-center gap-2 mt-0.5">
          <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: p.color || p.fill }} />
          <span className="text-slate-500 dark:text-slate-400">{p.name}:</span>
          <span className="font-semibold ml-auto" style={{ color: p.color || p.fill }}>
            {typeof p.value === 'number'
              ? (p.dataKey === 'margin' || p.dataKey === 'avgMargin' || p.dataKey === 'marginPercent'
                ? `${p.value.toFixed(1)}%`
                : p.dataKey === 'count'
                  ? p.value
                  : `${p.value.toFixed(2)} €`)
              : p.value}
          </span>
        </div>
      ))}
    </div>
  );
}

// ── Treemap Custom Content ────────────────────────────────────────────────
function TreemapContent({ x, y, width, height, name, value, totalFoodCost }: any) {
  if (width < 40 || height < 30) return null;
  const pct = totalFoodCost > 0 ? ((value / totalFoodCost) * 100).toFixed(0) : '0';
  return (
    <g>
      <rect x={x} y={y} width={width} height={height} rx={4} fill={FOOD_CATEGORY_COLORS[name] || '#64748b'} fillOpacity={0.85} stroke="#fff" strokeWidth={2} />
      {width > 60 && height > 40 && (
        <>
          <text x={x + width / 2} y={y + height / 2 - 6} textAnchor="middle" className="text-[11px] font-medium" fill="#fff">{name}</text>
          <text x={x + width / 2} y={y + height / 2 + 10} textAnchor="middle" className="text-[10px]" fill="rgba(255,255,255,0.8)">{pct}%</text>
        </>
      )}
    </g>
  );
}

// ── Alert Ticker Banner ───────────────────────────────────────────────────
function AlertTicker({ alerts }: { alerts: Recipe[] }) {
  if (alerts.length === 0) return null;
  // Duplicate items for seamless loop
  const items = [...alerts, ...alerts];
  return (
    <div className="relative overflow-hidden bg-gradient-to-r from-red-600 to-red-700 rounded-xl shadow-sm">
      <div className="flex items-center gap-2 px-4 py-2.5">
        <AlertTriangle className="w-4 h-4 text-white flex-shrink-0" />
        <span className="text-xs font-bold text-white/90 flex-shrink-0 uppercase tracking-wide">
          Alertes ({alerts.length})
        </span>
        <div className="flex-1 overflow-hidden">
          <div className="flex gap-6 animate-[ticker_20s_linear_infinite]">
            {items.map((r, i) => (
              <Link
                key={`${r.id}-${i}`}
                to={`/recipes/${r.id}`}
                className="flex items-center gap-2 flex-shrink-0 text-white/90 hover:text-white transition-colors"
              >
                <span className="text-sm font-medium whitespace-nowrap">{r.name}</span>
                <span className={`text-xs font-bold px-1.5 py-0.5 rounded ${r.margin.marginPercent < 50 ? 'bg-white/25' : 'bg-white/15'}`}>
                  {r.margin.marginPercent.toFixed(1)}%
                </span>
              </Link>
            ))}
          </div>
        </div>
      </div>
      <style>{`
        @keyframes ticker {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
      `}</style>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// MAIN DASHBOARD
// ══════════════════════════════════════════════════════════════════════════════
export default function Dashboard() {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [ingredients, setIngredients] = useState<Ingredient[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<TabKey>('overview');
  const [couverts, setCouverts] = useState(50);
  const [serviceMode, setServiceMode] = useState<'all' | 'lunch' | 'dinner'>('all');
  const [avgPricePerCouvert, setAvgPricePerCouvert] = useState(25);
  const [marginSort, setMarginSort] = useState<'margin' | 'name'>('margin');
  const navigate = useNavigate();

  useEffect(() => {
    Promise.all([fetchRecipes(), fetchIngredients()])
      .then(([r, i]) => { setRecipes(r); setIngredients(i); })
      .catch(() => console.error('Erreur chargement'))
      .finally(() => setLoading(false));
  }, []);

  // ── Computed stats ─────────────────────────────────────────────────────
  const stats = useMemo(() => {
    const totalRecipes = recipes.length;
    if (totalRecipes === 0) return null;

    const avgMargin = recipes.reduce((s, r) => s + r.margin.marginPercent, 0) / totalRecipes;
    const avgCoefficient = recipes.reduce((s, r) => s + r.margin.coefficient, 0) / totalRecipes;
    const bestMargin = Math.max(...recipes.map(r => r.margin.marginPercent));
    const worstMargin = Math.min(...recipes.map(r => r.margin.marginPercent));
    const avgFoodCost = recipes.reduce((s, r) => s + r.margin.costPerPortion, 0) / totalRecipes;
    const avgLaborCost = recipes.reduce((s, r) => s + (r.margin.laborCostPerPortion || 0), 0) / totalRecipes;
    const avgTotalCost = recipes.reduce((s, r) => s + (r.margin.totalCostPerPortion || r.margin.costPerPortion), 0) / totalRecipes;

    // Revenue estimation based on couverts
    const serviceMultiplier = serviceMode === 'all' ? 2 : 1;
    const dailyCouverts = couverts * serviceMultiplier;
    const dailyRevenue = dailyCouverts * avgPricePerCouvert;
    const avgCostRatio = avgTotalCost / (recipes.reduce((s, r) => s + r.sellingPrice, 0) / totalRecipes);
    const dailyCost = dailyRevenue * avgCostRatio;
    const dailyProfit = dailyRevenue - dailyCost;

    // Breakeven
    const fixedCostsEstimate = 0;
    const profitPerCouvert = avgPricePerCouvert * (1 - avgCostRatio);
    const seuilRentabilite = profitPerCouvert > 0 ? Math.ceil(fixedCostsEstimate / profitPerCouvert) : 0;

    // Category breakdown
    const categoryMap = new Map<string, { count: number; totalMargin: number; totalRevenue: number; totalCost: number }>();
    recipes.forEach(r => {
      const existing = categoryMap.get(r.category) || { count: 0, totalMargin: 0, totalRevenue: 0, totalCost: 0 };
      categoryMap.set(r.category, {
        count: existing.count + 1,
        totalMargin: existing.totalMargin + r.margin.marginPercent,
        totalRevenue: existing.totalRevenue + r.sellingPrice,
        totalCost: existing.totalCost + (r.margin.totalCostPerPortion || r.margin.costPerPortion),
      });
    });
    const categoryData = Array.from(categoryMap.entries()).map(([name, data]) => ({
      name,
      count: data.count,
      avgMargin: Math.round((data.totalMargin / data.count) * 10) / 10,
      revenue: Math.round(data.totalRevenue * 100) / 100,
    }));
    const categoryMarginData = categoryData.map(c => ({
      name: c.name,
      avgMargin: c.avgMargin,
      fill: MARGIN_BAR_COLORS[c.name] || '#64748b',
    }));

    // Margin distribution buckets
    const marginBuckets = [
      { name: '< 50%', count: 0, color: '#dc2626' },
      { name: '50-60%', count: 0, color: '#ea580c' },
      { name: '60-70%', count: 0, color: '#d97706' },
      { name: '70-80%', count: 0, color: '#65a30d' },
      { name: '> 80%', count: 0, color: '#059669' },
    ];
    recipes.forEach(r => {
      const m = r.margin.marginPercent;
      if (m < 50) marginBuckets[0].count++;
      else if (m < 60) marginBuckets[1].count++;
      else if (m < 70) marginBuckets[2].count++;
      else if (m < 80) marginBuckets[3].count++;
      else marginBuckets[4].count++;
    });

    // All recipes sorted by margin for horizontal bar chart
    const allByMargin = [...recipes]
      .sort((a, b) => b.margin.marginPercent - a.margin.marginPercent)
      .map(r => ({
        name: r.name.length > 30 ? r.name.slice(0, 27) + '...' : r.name,
        fullName: r.name,
        margin: r.margin.marginPercent,
        category: r.category,
        id: r.id,
        fill: r.margin.marginPercent >= 70 ? '#059669' : r.margin.marginPercent >= 50 ? '#d97706' : '#dc2626',
      }));

    // Top 10 by margin
    const top10Margin = [...recipes]
      .sort((a, b) => b.margin.marginPercent - a.margin.marginPercent)
      .slice(0, 10);

    // Top 10 by coefficient
    const top10Coeff = [...recipes]
      .sort((a, b) => b.margin.coefficient - a.margin.coefficient)
      .slice(0, 10);

    // Worst 5
    const worst5 = [...recipes]
      .sort((a, b) => a.margin.marginPercent - b.margin.marginPercent)
      .slice(0, 5);

    // Alerts: recipes below 60% margin
    const alertRecipes = recipes.filter(r => r.margin.marginPercent < 60);

    // Food cost by ingredient category
    const foodCostMap = new Map<string, number>();
    const ingredientCostMap = new Map<string, { name: string; cost: number; unit: string; category: string }>();
    recipes.forEach(r => {
      r.ingredients.forEach(ri => {
        const cat = ri.ingredient.category || 'Autres';
        const cost = ri.ingredient.pricePerUnit * ri.quantity * (1 + ri.wastePercent / 100);
        foodCostMap.set(cat, (foodCostMap.get(cat) || 0) + cost);
        // Track individual ingredient costs
        const key = ri.ingredient.name;
        const existing = ingredientCostMap.get(key);
        ingredientCostMap.set(key, {
          name: ri.ingredient.name,
          cost: (existing?.cost || 0) + cost,
          unit: ri.ingredient.unit,
          category: cat,
        });
      });
    });
    const foodCostData = Array.from(foodCostMap.entries())
      .map(([name, value]) => ({
        name,
        value: Math.round(value * 100) / 100,
        fill: FOOD_CATEGORY_COLORS[name] || '#64748b',
      }))
      .sort((a, b) => b.value - a.value);
    const totalFoodCostAll = foodCostData.reduce((s, d) => s + d.value, 0);

    // Top 10 most expensive ingredients
    const topIngredients = Array.from(ingredientCostMap.values())
      .sort((a, b) => b.cost - a.cost)
      .slice(0, 10);

    // Allergen summary
    const allergenMap = new Map<string, Set<number>>();
    recipes.forEach(r => {
      r.ingredients.forEach(ri => {
        ri.ingredient.allergens?.forEach(a => {
          if (!allergenMap.has(a)) allergenMap.set(a, new Set());
          allergenMap.get(a)!.add(r.id);
        });
      });
    });
    const allergenSummary = ALLERGENS
      .map(a => ({ name: a, count: allergenMap.get(a)?.size || 0 }))
      .filter(a => a.count > 0)
      .sort((a, b) => b.count - a.count);

    // Coefficient distribution for profitability tab
    const coeffBuckets = [
      { name: '< 2.0', count: 0, color: '#dc2626' },
      { name: '2.0-2.5', count: 0, color: '#ea580c' },
      { name: '2.5-3.0', count: 0, color: '#d97706' },
      { name: '3.0-3.5', count: 0, color: '#65a30d' },
      { name: '3.5-4.0', count: 0, color: '#059669' },
      { name: '> 4.0', count: 0, color: '#047857' },
    ];
    recipes.forEach(r => {
      const c = r.margin.coefficient;
      if (c < 2.0) coeffBuckets[0].count++;
      else if (c < 2.5) coeffBuckets[1].count++;
      else if (c < 3.0) coeffBuckets[2].count++;
      else if (c < 3.5) coeffBuckets[3].count++;
      else if (c < 4.0) coeffBuckets[4].count++;
      else coeffBuckets[5].count++;
    });

    // Menu du Marché: top 4 highest-margin recipes as daily suggestions
    const menuDuMarche = [...recipes]
      .sort((a, b) => b.margin.marginPercent - a.margin.marginPercent)
      .slice(0, 4)
      .map(r => ({
        id: r.id,
        name: r.name,
        category: r.category,
        marginPercent: r.margin.marginPercent,
        costPerPortion: r.margin.costPerPortion,
        suggestedPrice: r.sellingPrice,
      }));

    // AI Suggestions based on data analysis
    const aiSuggestions: { id: string; type: 'opportunity' | 'warning' | 'info'; icon: string; text: string; action: string; actionLabel: string }[] = [];
    // Find worst margin recipe that could be improved
    if (worst5.length > 0) {
      const w = worst5[0];
      const suggestedIncrease = Math.ceil((w.margin.totalCostPerPortion || w.margin.costPerPortion) * 0.15);
      aiSuggestions.push({
        id: 'price-increase',
        type: 'opportunity',
        icon: 'trending-up',
        text: `Augmenter le prix du ${w.name} de ${suggestedIncrease}€ (+${((suggestedIncrease / w.sellingPrice) * 100).toFixed(0)}% marge)`,
        action: `/recipes/${w.id}`,
        actionLabel: 'Appliquer',
      });
    }
    // Find cheapest ingredient category for opportunity
    if (foodCostData.length > 1) {
      const cheapestCat = foodCostData[foodCostData.length - 1];
      aiSuggestions.push({
        id: 'cheap-category',
        type: 'info',
        icon: 'sparkles',
        text: `La catégorie "${cheapestCat.name}" est la moins coûteuse — Idéale pour de nouveaux plats`,
        action: '/ingredients',
        actionLabel: 'Voir',
      });
    }
    // Low-margin dishes warning
    const lowMarginCount = recipes.filter(r => r.margin.marginPercent < 50).length;
    if (lowMarginCount > 0) {
      aiSuggestions.push({
        id: 'low-margin',
        type: 'warning',
        icon: 'alert',
        text: `${lowMarginCount} plat${lowMarginCount > 1 ? 's' : ''} sous 50% de marge — À optimiser`,
        action: '/recipes',
        actionLabel: 'Voir',
      });
    }
    // Best performer
    if (top10Margin.length > 0) {
      const best = top10Margin[0];
      aiSuggestions.push({
        id: 'best-performer',
        type: 'opportunity',
        icon: 'star',
        text: `"${best.name}" est votre star à ${best.margin.marginPercent.toFixed(1)}% — Mettez-le en avant`,
        action: `/recipes/${best.id}`,
        actionLabel: 'Voir',
      });
    }

    // Profitability projection data (6 months)
    const projectionData = Array.from({ length: 6 }, (_, i) => {
      const month = i + 1;
      const monthlyRevenue = dailyRevenue * 26;
      const monthlyCost = dailyCost * 26;
      const fixedCosts = 2000; // Estimated fixed monthly costs
      const growthFactor = 1 + (i * 0.02); // 2% monthly growth
      return {
        name: `Mois ${month}`,
        revenue: Math.round(monthlyRevenue * growthFactor),
        costs: Math.round((monthlyCost * 26 > 0 ? monthlyCost : monthlyRevenue * 0.6) * (1 + i * 0.01)),
        profit: Math.round((monthlyRevenue * growthFactor) - ((monthlyCost > 0 ? monthlyCost : monthlyRevenue * 0.6) * (1 + i * 0.01))),
      };
    });

    // Cost breakdown by category with top ingredient per category
    const categoryBreakdown = foodCostData.map(cat => {
      const catIngredients = Array.from(ingredientCostMap.values()).filter(i => i.category === cat.name);
      const topIng = catIngredients.sort((a, b) => b.cost - a.cost)[0];
      return {
        name: cat.name,
        totalCost: cat.value,
        pctOfTotal: totalFoodCostAll > 0 ? ((cat.value / totalFoodCostAll) * 100) : 0,
        topIngredient: topIng?.name || '-',
        fill: cat.fill,
      };
    });

    return {
      totalRecipes, avgMargin, avgCoefficient, bestMargin, worstMargin,
      avgFoodCost, avgLaborCost, avgTotalCost,
      dailyCouverts, dailyRevenue, dailyCost, dailyProfit, seuilRentabilite,
      avgCostRatio, profitPerCouvert,
      categoryData, categoryMarginData, marginBuckets, allByMargin,
      top10Margin, top10Coeff, worst5, alertRecipes,
      foodCostData, totalFoodCostAll, topIngredients,
      allergenSummary, coeffBuckets,
      menuDuMarche, aiSuggestions, projectionData, categoryBreakdown,
    };
  }, [recipes, couverts, serviceMode, avgPricePerCouvert]);

  // ── Export CSV helper ──────────────────────────────────────────────────
  const handleExportCSV = useCallback(() => {
    if (recipes.length === 0) return;
    const header = 'Nom,Catégorie,Prix vente,Coût matière,Coût MO,Coût total,Marge €,Marge %,Coefficient\n';
    const rows = recipes.map(r =>
      `"${r.name}","${r.category}",${r.sellingPrice.toFixed(2)},${r.margin.costPerPortion.toFixed(2)},${(r.margin.laborCostPerPortion || 0).toFixed(2)},${(r.margin.totalCostPerPortion || r.margin.costPerPortion).toFixed(2)},${r.margin.marginAmount.toFixed(2)},${r.margin.marginPercent.toFixed(1)},${r.margin.coefficient.toFixed(2)}`
    ).join('\n');
    const blob = new Blob(['﻿' + header + rows], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = 'recettes-marges.csv'; a.click();
    URL.revokeObjectURL(url);
  }, [recipes]);

  // ── Loading ────────────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="animate-spin rounded-full h-10 w-10 border-4 border-blue-600 border-t-transparent" />
      </div>
    );
  }

  // ── Empty state ────────────────────────────────────────────────────────
  if (!stats || stats.totalRecipes === 0) {
    return (
      <div>
        <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100 mb-6">Tableau de bord</h2>
        <div className="text-center py-16 bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700">
          <ChefHat className="w-16 h-16 mx-auto text-slate-300 dark:text-slate-600 mb-4" />
          <h3 className="text-xl font-semibold text-slate-600 dark:text-slate-300 mb-2">Bienvenue sur RestauMargin</h3>
          <p className="text-slate-400 dark:text-slate-500 mb-6">Commencez par ajouter des ingrédients puis créez vos fiches techniques.</p>
          <div className="flex gap-4 justify-center">
            <Link to="/ingredients" className="btn-primary">Ajouter des ingrédients</Link>
            <Link to="/recipes" className="btn-secondary">Créer une recette</Link>
          </div>
        </div>
      </div>
    );
  }

  const sortedByMargin = [...recipes].sort((a, b) => a.margin.marginPercent - b.margin.marginPercent);

  return (
    <div className="space-y-6">
      {/* ── Header + Quick Actions ────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100">Tableau de bord</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            {stats.totalRecipes} recette{stats.totalRecipes > 1 ? 's' : ''} · {ingredients.length} ingrédient{ingredients.length > 1 ? 's' : ''}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => navigate('/recipes?action=new')}
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
          >
            <Plus className="w-4 h-4" /> Nouvelle recette
          </button>
          <button
            onClick={() => navigate('/ingredients?action=new')}
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-200 text-sm font-medium rounded-lg hover:bg-slate-50 dark:hover:bg-slate-600 transition-colors border border-slate-200 dark:border-slate-600 shadow-sm"
          >
            <Package className="w-4 h-4" /> Ajouter ingrédient
          </button>
          <Link
            to="/recipes"
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-200 text-sm font-medium rounded-lg hover:bg-slate-50 dark:hover:bg-slate-600 transition-colors border border-slate-200 dark:border-slate-600 shadow-sm"
          >
            <ClipboardList className="w-4 h-4" /> Voir les recettes
          </Link>
          <Link
            to="/inventory"
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-200 text-sm font-medium rounded-lg hover:bg-slate-50 dark:hover:bg-slate-600 transition-colors border border-slate-200 dark:border-slate-600 shadow-sm"
          >
            <FileText className="w-4 h-4" /> Voir l'inventaire
          </Link>
          <button
            onClick={() => window.print()}
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-200 text-sm font-medium rounded-lg hover:bg-slate-50 dark:hover:bg-slate-600 transition-colors border border-slate-200 dark:border-slate-600 shadow-sm no-print"
          >
            <Printer className="w-4 h-4" /> Imprimer
          </button>
        </div>
      </div>

      {/* ── Stat Cards (bigger, gradient, colored top border) ─────────── */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
        <StatCard title="Recettes" value={String(stats.totalRecipes)} icon={ChefHat} color="bg-blue-600" colorKey="blue" />
        <StatCard
          title="Marge moyenne"
          numericValue={stats.avgMargin}
          suffix="%"
          subtitle={stats.avgMargin >= 70 ? 'Objectif atteint' : 'Objectif : > 70%'}
          icon={TrendingUp}
          color={stats.avgMargin >= 70 ? 'bg-green-600' : 'bg-amber-500'}
          colorKey={stats.avgMargin >= 70 ? 'green' : 'amber'}
          trend={stats.avgMargin >= 70 ? 'up' : 'down'}
        />
        <StatCard
          title="Coefficient moyen"
          numericValue={stats.avgCoefficient}
          decimals={2}
          subtitle="Objectif : > 3.3"
          icon={DollarSign}
          color="bg-purple-600"
          colorKey="purple"
          trend={stats.avgCoefficient >= 3.3 ? 'up' : 'down'}
        />
        <StatCard
          title="Coût moyen total"
          numericValue={stats.avgTotalCost}
          decimals={2}
          suffix=" €"
          subtitle={stats.avgLaborCost > 0 ? `Mat. ${stats.avgFoodCost.toFixed(2)}€ + MO ${stats.avgLaborCost.toFixed(2)}€` : 'Matière seule'}
          icon={Briefcase}
          color="bg-cyan-600"
          colorKey="cyan"
        />
        <StatCard
          title={`Min\u00A0/\u00A0Max`}
          value={`${stats.worstMargin.toFixed(0)}%\u00A0/\u00A0${stats.bestMargin.toFixed(0)}%`}
          icon={TrendingDown}
          color="bg-slate-600"
          colorKey="slate"
        />
      </div>

      {/* ── Alert Ticker Banner ──────────────────────────────────────── */}
      <AlertTicker alerts={stats.alertRecipes} />

      {/* ── Menu du Marché + Suggestions IA ────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Menu du Marché */}
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-5">
          <div className="flex items-center gap-2 mb-4">
            <Star className="w-5 h-5 text-amber-500" />
            <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100">Suggestion du jour</h3>
            <span className="text-xs text-slate-400 dark:text-slate-500 ml-auto">Menu du Marché</span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mb-3">Plats recommandés basés sur les meilleures marges</p>
          <div className="space-y-3">
            {stats.menuDuMarche.map((dish, i) => (
              <Link
                key={dish.id}
                to={`/recipes/${dish.id}`}
                className="flex items-center gap-3 p-3 rounded-lg bg-slate-50 dark:bg-slate-700/50 hover:bg-amber-50 dark:hover:bg-amber-900/20 transition-colors group"
              >
                <span className="text-lg font-bold text-amber-500 w-6 text-center">{i + 1}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-slate-800 dark:text-slate-200 truncate group-hover:text-amber-700 dark:group-hover:text-amber-400 transition-colors">{dish.name}</p>
                  <p className="text-xs text-slate-400 dark:text-slate-500">{dish.category}</p>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className="text-sm font-bold text-green-600 dark:text-green-400">{dish.marginPercent.toFixed(1)}%</p>
                  <p className="text-xs text-slate-400 dark:text-slate-500">Coût {dish.costPerPortion.toFixed(2)}€ · Vente {dish.suggestedPrice.toFixed(2)}€</p>
                </div>
              </Link>
            ))}
          </div>
          <Link to="/recipes" className="inline-flex items-center gap-1 text-xs text-blue-600 dark:text-blue-400 hover:underline font-medium mt-3">
            Voir toutes les suggestions <ArrowRight className="w-3 h-3" />
          </Link>
        </div>

        {/* Suggestions IA */}
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-5">
          <div className="flex items-center gap-2 mb-4">
            <Sparkles className="w-5 h-5 text-purple-500" />
            <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100">Suggestions IA</h3>
          </div>
          <div className="space-y-3">
            {stats.aiSuggestions.map(suggestion => {
              const colorMap = {
                opportunity: 'border-l-green-500 bg-green-50/50 dark:bg-green-900/10',
                warning: 'border-l-orange-500 bg-orange-50/50 dark:bg-orange-900/10',
                info: 'border-l-blue-500 bg-blue-50/50 dark:bg-blue-900/10',
              };
              const btnColorMap = {
                opportunity: 'bg-green-600 hover:bg-green-700 text-white',
                warning: 'bg-orange-600 hover:bg-orange-700 text-white',
                info: 'bg-blue-600 hover:bg-blue-700 text-white',
              };
              const iconMap = {
                'trending-up': <TrendingUp className="w-4 h-4" />,
                'sparkles': <Lightbulb className="w-4 h-4" />,
                'alert': <AlertTriangle className="w-4 h-4" />,
                'star': <Zap className="w-4 h-4" />,
              };
              return (
                <div
                  key={suggestion.id}
                  className={`flex items-center gap-3 p-3 rounded-lg border-l-4 ${colorMap[suggestion.type]}`}
                >
                  <div className={`flex-shrink-0 ${suggestion.type === 'opportunity' ? 'text-green-600' : suggestion.type === 'warning' ? 'text-orange-600' : 'text-blue-600'}`}>
                    {iconMap[suggestion.icon as keyof typeof iconMap] || <Lightbulb className="w-4 h-4" />}
                  </div>
                  <p className="text-sm text-slate-700 dark:text-slate-300 flex-1">{suggestion.text}</p>
                  <Link
                    to={suggestion.action}
                    className={`flex-shrink-0 px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${btnColorMap[suggestion.type]}`}
                  >
                    {suggestion.actionLabel}
                  </Link>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* ── Tab Navigation (card-style) ──────────────────────────────── */}
      <div className="flex gap-3 overflow-x-auto pb-1 scrollbar-thin">
        {TABS.map(tab => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.key;
          return (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`flex items-center gap-3 px-5 py-3.5 rounded-xl text-left transition-all whitespace-nowrap flex-shrink-0 min-w-[180px]
                ${isActive
                  ? 'bg-white dark:bg-slate-800 border-l-4 border-l-blue-600 border border-slate-200 dark:border-slate-700 shadow-md'
                  : 'bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 hover:bg-white dark:hover:bg-slate-800 hover:shadow-sm opacity-75 hover:opacity-100'
                }`}
            >
              <div className={`p-2 rounded-lg ${isActive ? 'bg-blue-100 dark:bg-blue-900/30' : 'bg-slate-100 dark:bg-slate-700'}`}>
                <Icon className={`w-5 h-5 ${isActive ? 'text-blue-600 dark:text-blue-400' : 'text-slate-400 dark:text-slate-500'}`} />
              </div>
              <div>
                <div className={`text-sm font-semibold ${isActive ? 'text-slate-800 dark:text-slate-100' : 'text-slate-500 dark:text-slate-400'}`}>
                  {tab.label}
                </div>
                <div className={`text-xs ${isActive ? 'text-slate-500 dark:text-slate-400' : 'text-slate-400 dark:text-slate-500'}`}>
                  {tab.desc}
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {/* ══════════════════════════════════════════════════════════════════ */}
      {/* TAB: Vue d'ensemble                                               */}
      {/* ══════════════════════════════════════════════════════════════════ */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-[65%_35%] gap-6">
            {/* LEFT SIDE */}
            <div className="space-y-6">
              {/* Revenue Estimation */}
              <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-xl shadow-lg p-5 text-white">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-4">
                  <div className="flex items-center gap-2">
                    <Calculator className="w-5 h-5" />
                    <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100 text-white">Estimation de revenus</h3>
                  </div>
                  <div className="flex flex-wrap items-center gap-3">
                    <div className="flex items-center gap-1 bg-white/10 rounded-lg p-0.5">
                      {([['all', 'Jour'], ['lunch', 'Déj.'], ['dinner', 'Dîn.']] as const).map(([key, label]) => (
                        <button
                          key={key}
                          onClick={() => setServiceMode(key)}
                          className={`px-2.5 py-1 text-xs font-medium rounded-md transition-colors ${
                            serviceMode === key ? 'bg-white/25 text-white' : 'text-blue-200 hover:text-white'
                          }`}
                        >
                          {label}
                        </button>
                      ))}
                    </div>
                    <div className="flex items-center gap-2">
                      <label className="text-xs text-blue-100">Couverts :</label>
                      <input
                        type="number"
                        min={1}
                        max={500}
                        value={couverts}
                        onChange={e => setCouverts(Math.max(1, parseInt(e.target.value) || 1))}
                        className="w-16 px-2 py-1 rounded bg-white/20 border border-white/30 text-white text-sm text-center focus:outline-none focus:ring-2 focus:ring-white/50"
                      />
                    </div>
                    <div className="flex items-center gap-2">
                      <label className="text-xs text-blue-100">Ticket moy. :</label>
                      <input
                        type="number"
                        min={1}
                        max={500}
                        value={avgPricePerCouvert}
                        onChange={e => setAvgPricePerCouvert(Math.max(1, parseInt(e.target.value) || 1))}
                        className="w-16 px-2 py-1 rounded bg-white/20 border border-white/30 text-white text-sm text-center focus:outline-none focus:ring-2 focus:ring-white/50"
                      />
                      <span className="text-xs text-blue-200">€</span>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-3">
                  <div className="bg-white/10 rounded-lg p-3">
                    <p className="text-xs text-blue-200 mb-1">{"CA\u00A0/\u00A0jour"}</p>
                    <p className="text-xl font-bold"><AnimatedNumber value={stats.dailyRevenue} decimals={0} suffix=" €" /></p>
                  </div>
                  <div className="bg-white/10 rounded-lg p-3">
                    <p className="text-xs text-blue-200 mb-1">{"CA\u00A0/\u00A0semaine"}</p>
                    <p className="text-xl font-bold"><AnimatedNumber value={stats.dailyRevenue * 6} decimals={0} suffix=" €" /></p>
                  </div>
                  <div className="bg-white/10 rounded-lg p-3">
                    <p className="text-xs text-blue-200 mb-1">{"CA\u00A0/\u00A0mois"}</p>
                    <p className="text-xl font-bold"><AnimatedNumber value={stats.dailyRevenue * 26} decimals={0} suffix=" €" /></p>
                  </div>
                  <div className="bg-white/10 rounded-lg p-3">
                    <p className="text-xs text-blue-200 mb-1">{"Profit\u00A0/\u00A0jour"}</p>
                    <p className="text-xl font-bold text-green-300"><AnimatedNumber value={stats.dailyProfit} decimals={0} suffix=" €" /></p>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-x-6 gap-y-1 text-xs text-blue-200">
                  <span>{stats.dailyCouverts} couverts/jour ({serviceMode === 'all' ? '2 services' : serviceMode === 'lunch' ? 'déjeuner' : 'dîner'})</span>
                  <span>Coût ratio : {(stats.avgCostRatio * 100).toFixed(1)}%</span>
                  <span>Profit/couvert : {stats.profitPerCouvert.toFixed(2)} €</span>
                  {stats.seuilRentabilite > 0 && (
                    <span className="text-yellow-300 font-medium">Seuil de rentabilité : {stats.seuilRentabilite} couverts/jour</span>
                  )}
                </div>
              </div>

              {/* Category cards with colored dots */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {stats.categoryData.map((cat, i) => (
                  <div key={cat.name} className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-4 hover:shadow-md transition-shadow">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[i % COLORS.length] }} />
                      <span className="text-sm font-medium text-slate-700 dark:text-slate-300 truncate">{cat.name}</span>
                    </div>
                    <div className="text-2xl font-bold text-slate-800 dark:text-slate-100">{cat.count}</div>
                    <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                      Marge :{' '}
                      <span className={
                        cat.avgMargin >= 70 ? 'text-green-600 font-semibold'
                          : cat.avgMargin >= 60 ? 'text-amber-600 font-semibold'
                          : 'text-red-600 font-semibold'
                      }>
                        {cat.avgMargin}%
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* RIGHT SIDE */}
            <div className="space-y-6">
              {/* Donut chart for category distribution */}
              <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-5">
                <div className="flex items-center gap-2 mb-4">
                  <Utensils className="w-5 h-5 text-blue-600" />
                  <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100">Répartition</h3>
                </div>
                <ResponsiveContainer width="100%" height={280}>
                  <PieChart>
                    <Pie
                      data={stats.categoryData}
                      cx="50%"
                      cy="50%"
                      innerRadius={40}
                      outerRadius={110}
                      paddingAngle={2}
                      dataKey="count"
                      nameKey="name"
                      label={(props: any) => {
                        const { cx, cy, midAngle, innerRadius, outerRadius, name, count, percent } = props;
                        const RADIAN = Math.PI / 180;
                        const label = String(name || '');
                        // Small segments (<8%): show label outside with connector line
                        if ((percent || 0) < 0.08) {
                          const outerR = (outerRadius || 0) + 30;
                          const x = (cx || 0) + outerR * Math.cos(-(midAngle || 0) * RADIAN);
                          const y = (cy || 0) + outerR * Math.sin(-(midAngle || 0) * RADIAN);
                          return (
                            <text x={x} y={y} fill="#334155" textAnchor={x > (cx || 0) ? 'start' : 'end'} dominantBaseline="central" style={{ fontSize: '12px', fontWeight: 'bold' }}>
                              {label} ({count})
                            </text>
                          );
                        }
                        // Large segments: show label inside
                        const radius = (innerRadius || 0) + ((outerRadius || 0) - (innerRadius || 0)) * 0.55;
                        const x = (cx || 0) + radius * Math.cos(-(midAngle || 0) * RADIAN);
                        const y = (cy || 0) + radius * Math.sin(-(midAngle || 0) * RADIAN);
                        return (
                          <text x={x} y={y} fill="white" textAnchor="middle" dominantBaseline="central" style={{ fontSize: '12px', fontWeight: 'bold', textShadow: '0 1px 3px rgba(0,0,0,0.6)' }}>
                            {label} ({count})
                          </text>
                        );
                      }}
                      labelLine={(props: any) => {
                        const { cx, cy, midAngle, outerRadius, percent } = props;
                        if ((percent || 0) >= 0.08) return <path d="" />;
                        const RADIAN = Math.PI / 180;
                        const startX = (cx || 0) + (outerRadius || 0) * Math.cos(-(midAngle || 0) * RADIAN);
                        const startY = (cy || 0) + (outerRadius || 0) * Math.sin(-(midAngle || 0) * RADIAN);
                        const endX = (cx || 0) + ((outerRadius || 0) + 22) * Math.cos(-(midAngle || 0) * RADIAN);
                        const endY = (cy || 0) + ((outerRadius || 0) + 22) * Math.sin(-(midAngle || 0) * RADIAN);
                        return <path d={`M${startX},${startY}L${endX},${endY}`} stroke="#94a3b8" fill="none" strokeWidth={1} />;
                      }}
                    >
                      {stats.categoryData.map((_entry, index) => (
                        <Cell key={index} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip content={<ChartTooltip />} />
                  </PieChart>
                </ResponsiveContainer>
                <div className="space-y-2 mt-2">
                  {stats.categoryData.map((cat, i) => (
                    <div key={cat.name} className="flex items-center gap-2 text-sm">
                      <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: COLORS[i % COLORS.length] }} />
                      <span className="text-slate-700 dark:text-slate-300 flex-1 truncate">{cat.name}</span>
                      <span className="font-semibold text-slate-800 dark:text-slate-100 tabular-nums">{cat.count}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Allergen badges */}
              {stats.allergenSummary.length > 0 && (
                <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-5">
                  <div className="flex items-center gap-2 mb-3">
                    <ShieldAlert className="w-5 h-5 text-amber-500" />
                    <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100">Allergènes</h3>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {stats.allergenSummary.map(a => (
                      <span
                        key={a.name}
                        className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold ${ALLERGEN_COLORS[a.name] || 'bg-amber-200 text-amber-800 dark:bg-amber-800/50 dark:text-amber-200'}`}
                      >
                        {a.name} <span className="opacity-70">{a.count}</span>
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════════ */}
      {/* TAB: Analyse des marges                                           */}
      {/* ══════════════════════════════════════════════════════════════════ */}
      {activeTab === 'margins' && (
        <div className="space-y-6">
          {/* Full width horizontal bar chart of ALL recipes sorted by margin */}
          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-5">
            <div className="flex items-center gap-2 mb-4 flex-wrap">
              <TrendingUp className="w-5 h-5 text-green-600" />
              <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100">Toutes les recettes par marge</h3>
              <div className="flex items-center gap-2 ml-auto">
                <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-700 rounded-lg p-0.5">
                  <button
                    onClick={() => setMarginSort('margin')}
                    className={`inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium rounded-md transition-colors ${marginSort === 'margin' ? 'bg-white dark:bg-slate-600 text-slate-800 dark:text-slate-100 shadow-sm' : 'text-slate-500 dark:text-slate-400 hover:text-slate-700'}`}
                  >
                    <ArrowDown className="w-3 h-3" /> Marge
                  </button>
                  <button
                    onClick={() => setMarginSort('name')}
                    className={`inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium rounded-md transition-colors ${marginSort === 'name' ? 'bg-white dark:bg-slate-600 text-slate-800 dark:text-slate-100 shadow-sm' : 'text-slate-500 dark:text-slate-400 hover:text-slate-700'}`}
                  >
                    <ArrowDown className="w-3 h-3" /> Nom
                  </button>
                </div>
                <div className="flex items-center gap-3 text-xs text-slate-400 dark:text-slate-500">
                  <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-green-600 inline-block" /> &ge; 70%</span>
                  <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-amber-500 inline-block" /> 50-70%</span>
                  <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-red-500 inline-block" /> &lt; 50%</span>
                </div>
              </div>
            </div>
            <ResponsiveContainer width="100%" height={Math.max(400, stats.allByMargin.length * 34)}>
              <BarChart data={marginSort === 'name' ? [...stats.allByMargin].sort((a, b) => a.fullName.localeCompare(b.fullName)) : stats.allByMargin} layout="vertical" margin={{ top: 5, right: 60, bottom: 5, left: 5 }}>
                <CartesianGrid strokeDasharray="3 3" className="opacity-30" horizontal={false} />
                <XAxis type="number" domain={[0, 100]} unit="%" tick={{ fontSize: 11 }} />
                <YAxis type="category" dataKey="name" width={200} tick={{ fontSize: 11 }} />
                <Tooltip
                  content={({ active, payload }) => {
                    if (!active || !payload?.length) return null;
                    const d = payload[0]?.payload;
                    return (
                      <div className="bg-white dark:bg-slate-800 shadow-xl rounded-lg p-3 border border-slate-200 dark:border-slate-600 text-sm">
                        <p className="font-semibold text-slate-800 dark:text-slate-100">{d?.fullName}</p>
                        <p className="text-slate-500 dark:text-slate-400">{d?.category}</p>
                        <p className="font-bold mt-1" style={{ color: d?.fill }}>{d?.margin?.toFixed(1)}%</p>
                      </div>
                    );
                  }}
                />
                <Bar dataKey="margin" name="Marge %" radius={[0, 4, 4, 0]}>
                  {stats.allByMargin.map((entry, index) => (
                    <Cell key={index} fill={entry.fill} />
                  ))}
                  <LabelList dataKey="margin" position="right" formatter={(v: number) => `${v.toFixed(1)}%`} style={{ fontSize: '10px', fontWeight: 600, fill: '#475569' }} />
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Top 10 + Bottom 5 side by side */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-5">
              <div className="flex items-center gap-2 mb-4">
                <Trophy className="w-5 h-5 text-yellow-500" />
                <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100">Top 10 par marge</h3>
              </div>
              <div className="space-y-3">
                {stats.top10Margin.map((r, i) => (
                  <RankBar
                    key={r.id}
                    rank={i + 1}
                    name={r.name}
                    value={r.margin.marginPercent}
                    maxValue={100}
                    color={r.margin.marginPercent >= 70 ? '#059669' : r.margin.marginPercent >= 60 ? '#d97706' : '#dc2626'}
                    link={`/recipes/${r.id}`}
                  />
                ))}
              </div>
            </div>

            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-red-200 dark:border-red-800/50 p-5">
              <div className="flex items-center gap-2 mb-4">
                <ShieldAlert className="w-5 h-5 text-red-500" />
                <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100">5 marges les plus basses</h3>
                <span className="text-xs text-red-500 font-medium bg-red-50 dark:bg-red-900/20 px-2 py-0.5 rounded-full ml-auto">Action requise</span>
              </div>
              <div className="space-y-3">
                {stats.worst5.map((r, i) => (
                  <RankBar
                    key={r.id}
                    rank={i + 1}
                    name={r.name}
                    value={r.margin.marginPercent}
                    maxValue={100}
                    color={r.margin.marginPercent < 50 ? '#dc2626' : '#d97706'}
                    link={`/recipes/${r.id}`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════════ */}
      {/* TAB: Coûts matière                                                */}
      {/* ══════════════════════════════════════════════════════════════════ */}
      {activeTab === 'costs' && (
        <div className="space-y-6">
          {/* Treemap + Stacked bar side by side */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Food Cost Pie Chart with labels inside segments */}
            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-5">
              <div className="flex items-center gap-2 mb-4">
                <PieChartIcon className="w-5 h-5 text-blue-600" />
                <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100">Répartition coût matière</h3>
                <span className="text-xs text-slate-400 dark:text-slate-500 ml-auto">
                  Total : {stats.totalFoodCostAll.toFixed(2)} €
                </span>
              </div>
              {stats.foodCostData.length > 0 ? (
                <ResponsiveContainer width="100%" height={360}>
                  <PieChart>
                    <Pie
                      data={stats.foodCostData}
                      cx="50%"
                      cy="50%"
                      innerRadius={0}
                      outerRadius={140}
                      paddingAngle={1}
                      dataKey="value"
                      nameKey="name"
                      label={(props: any) => {
                        const { cx, cy, midAngle, innerRadius, outerRadius, name, percent } = props;
                        const RADIAN = Math.PI / 180;
                        const pctStr = ((percent || 0) * 100).toFixed(0);
                        const label = String(name || '');
                        // Small segments (<8%): show label outside with connector line
                        if ((percent || 0) < 0.08) {
                          const outerR = (outerRadius || 0) + 30;
                          const x = (cx || 0) + outerR * Math.cos(-(midAngle || 0) * RADIAN);
                          const y = (cy || 0) + outerR * Math.sin(-(midAngle || 0) * RADIAN);
                          return (
                            <text x={x} y={y} fill="#334155" textAnchor={x > (cx || 0) ? 'start' : 'end'} dominantBaseline="central" style={{ fontSize: '12px', fontWeight: 'bold' }}>
                              {label} ({pctStr}%)
                            </text>
                          );
                        }
                        const radius = (innerRadius || 0) + ((outerRadius || 0) - (innerRadius || 0)) * 0.5;
                        const x = (cx || 0) + radius * Math.cos(-(midAngle || 0) * RADIAN);
                        const y = (cy || 0) + radius * Math.sin(-(midAngle || 0) * RADIAN);
                        return (
                          <g>
                            <text x={x} y={y - 7} fill="white" textAnchor="middle" dominantBaseline="central" style={{ fontSize: '12px', fontWeight: 'bold', textShadow: '0 1px 3px rgba(0,0,0,0.6)' }}>
                              {label}
                            </text>
                            <text x={x} y={y + 9} fill="rgba(255,255,255,0.85)" textAnchor="middle" dominantBaseline="central" style={{ fontSize: '11px', textShadow: '0 1px 3px rgba(0,0,0,0.6)' }}>
                              {pctStr}%
                            </text>
                          </g>
                        );
                      }}
                      labelLine={(props: any) => {
                        const { cx, cy, midAngle, outerRadius, percent } = props;
                        if ((percent || 0) >= 0.08) return <path d="" />;
                        const RADIAN = Math.PI / 180;
                        const startX = (cx || 0) + (outerRadius || 0) * Math.cos(-(midAngle || 0) * RADIAN);
                        const startY = (cy || 0) + (outerRadius || 0) * Math.sin(-(midAngle || 0) * RADIAN);
                        const endX = (cx || 0) + ((outerRadius || 0) + 22) * Math.cos(-(midAngle || 0) * RADIAN);
                        const endY = (cy || 0) + ((outerRadius || 0) + 22) * Math.sin(-(midAngle || 0) * RADIAN);
                        return <path d={`M${startX},${startY}L${endX},${endY}`} stroke="#94a3b8" fill="none" strokeWidth={1} />;
                      }}
                    >
                      {stats.foodCostData.map((entry, index) => (
                        <Cell key={index} fill={entry.fill} />
                      ))}
                    </Pie>
                    <Tooltip
                      content={({ active, payload }) => {
                        if (!active || !payload?.length) return null;
                        const d = payload[0]?.payload;
                        const pct = stats.totalFoodCostAll > 0 ? ((d?.value / stats.totalFoodCostAll) * 100).toFixed(1) : '0';
                        return (
                          <div className="bg-white dark:bg-slate-800 shadow-xl rounded-lg p-3 border border-slate-200 dark:border-slate-600 text-sm">
                            <p className="font-semibold text-slate-800 dark:text-slate-100">{d?.name}</p>
                            <p className="text-slate-600 dark:text-slate-300">{d?.value?.toFixed(2)} € ({pct}%)</p>
                          </div>
                        );
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <p className="text-center text-slate-400 py-12">Aucune donnée</p>
              )}
            </div>

            {/* Cost by category bar */}
            {stats.foodCostData.length > 0 && (
              <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-5">
                <div className="flex items-center gap-2 mb-4">
                  <BarChart3 className="w-5 h-5 text-orange-600" />
                  <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100">Détail par catégorie</h3>
                </div>
                <ResponsiveContainer width="100%" height={Math.max(200, stats.foodCostData.length * 36)}>
                  <BarChart data={stats.foodCostData} layout="vertical" margin={{ top: 5, right: 30, bottom: 5, left: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" className="opacity-30" horizontal={false} />
                    <XAxis type="number" tick={{ fontSize: 11 }} unit=" €" />
                    <YAxis type="category" dataKey="name" width={150} tick={{ fontSize: 11 }} />
                    <Tooltip
                      content={({ active, payload }) => {
                        if (!active || !payload?.length) return null;
                        const d = payload[0]?.payload;
                        const pct = stats.totalFoodCostAll > 0 ? ((d?.value / stats.totalFoodCostAll) * 100).toFixed(1) : '0';
                        return (
                          <div className="bg-white dark:bg-slate-800 shadow-xl rounded-lg p-3 border border-slate-200 dark:border-slate-600 text-sm">
                            <p className="font-semibold text-slate-800 dark:text-slate-100">{d?.name}</p>
                            <p className="text-slate-600 dark:text-slate-300">{d?.value?.toFixed(2)} €</p>
                            <p className="text-slate-500 dark:text-slate-400">{pct}% du coût total</p>
                          </div>
                        );
                      }}
                    />
                    <Bar dataKey="value" name="Coût" radius={[0, 4, 4, 0]}>
                      {stats.foodCostData.map((entry, index) => (
                        <Cell key={index} fill={entry.fill} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}
          </div>

          {/* Top 10 most expensive ingredients table */}
          {stats.topIngredients.length > 0 && (
            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-5">
              <div className="flex items-center gap-2 mb-4">
                <ShoppingCart className="w-5 h-5 text-red-500" />
                <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100">Top 10 ingrédients les plus coûteux</h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-left text-slate-500 dark:text-slate-400 border-b border-slate-200 dark:border-slate-700">
                      <th className="pb-2 font-medium">#</th>
                      <th className="pb-2 font-medium">Ingrédient</th>
                      <th className="pb-2 font-medium">Catégorie</th>
                      <th className="pb-2 text-right font-medium">Coût total</th>
                      <th className="pb-2 text-right font-medium">% du total</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                    {stats.topIngredients.map((ing, i) => (
                      <tr key={ing.name} className="hover:bg-slate-50 dark:hover:bg-slate-700/50">
                        <td className="py-2.5 text-slate-400 font-bold">{i + 1}</td>
                        <td className="py-2.5 font-medium text-slate-800 dark:text-slate-200">{ing.name}</td>
                        <td className="py-2.5 text-slate-500 dark:text-slate-400">
                          <span className="inline-flex items-center gap-1">
                            <span className="w-2 h-2 rounded-full" style={{ backgroundColor: FOOD_CATEGORY_COLORS[ing.category] || '#64748b' }} />
                            {ing.category}
                          </span>
                        </td>
                        <td className="py-2.5 text-right font-mono font-semibold text-slate-700 dark:text-slate-300">{ing.cost.toFixed(2)} €</td>
                        <td className="py-2.5 text-right font-mono text-slate-500 dark:text-slate-400">
                          {stats.totalFoodCostAll > 0 ? ((ing.cost / stats.totalFoodCostAll) * 100).toFixed(1) : '0'}%
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Category Breakdown Table */}
          {stats.categoryBreakdown.length > 0 && (
            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-5">
              <div className="flex items-center gap-2 mb-4">
                <ClipboardList className="w-5 h-5 text-purple-600" />
                <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100">Détail par catégorie d'ingrédients</h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-left text-slate-500 dark:text-slate-400 border-b border-slate-200 dark:border-slate-700">
                      <th className="pb-2 font-medium">Catégorie</th>
                      <th className="pb-2 text-right font-medium">Coût total</th>
                      <th className="pb-2 text-right font-medium">% du total</th>
                      <th className="pb-2 font-medium">Ingrédient principal</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                    {stats.categoryBreakdown.map(cat => (
                      <tr key={cat.name} className="hover:bg-slate-50 dark:hover:bg-slate-700/50">
                        <td className="py-2.5 font-medium text-slate-800 dark:text-slate-200">
                          <span className="inline-flex items-center gap-2">
                            <span className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: cat.fill }} />
                            {cat.name}
                          </span>
                        </td>
                        <td className="py-2.5 text-right font-mono font-semibold text-slate-700 dark:text-slate-300">{cat.totalCost.toFixed(2)} €</td>
                        <td className="py-2.5 text-right font-mono text-slate-500 dark:text-slate-400">{cat.pctOfTotal.toFixed(1)}%</td>
                        <td className="py-2.5 text-slate-500 dark:text-slate-400">{cat.topIngredient}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════════ */}
      {/* TAB: Rentabilité                                                  */}
      {/* ══════════════════════════════════════════════════════════════════ */}
      {activeTab === 'profitability' && (
        <div className="space-y-6">
          {/* Revenue projection with service selector */}
          <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-xl shadow-lg p-5 text-white">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-4">
              <div className="flex items-center gap-2">
                <Calculator className="w-5 h-5" />
                <h3 className="text-lg font-semibold text-white">Projections de revenus</h3>
              </div>
              <div className="flex flex-wrap items-center gap-3">
                <div className="flex items-center gap-1 bg-white/10 rounded-lg p-0.5">
                  {([['all', 'Jour'], ['lunch', 'Déj.'], ['dinner', 'Dîn.']] as const).map(([key, label]) => (
                    <button
                      key={key}
                      onClick={() => setServiceMode(key)}
                      className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                        serviceMode === key ? 'bg-white/25 text-white' : 'text-blue-200 hover:text-white'
                      }`}
                    >
                      {label}
                    </button>
                  ))}
                </div>
                <div className="flex items-center gap-2">
                  <label className="text-xs text-blue-100">Couverts :</label>
                  <input
                    type="number"
                    min={1}
                    max={500}
                    value={couverts}
                    onChange={e => setCouverts(Math.max(1, parseInt(e.target.value) || 1))}
                    className="w-16 px-2 py-1 rounded bg-white/20 border border-white/30 text-white text-sm text-center focus:outline-none focus:ring-2 focus:ring-white/50"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <label className="text-xs text-blue-100">Ticket moy. :</label>
                  <input
                    type="number"
                    min={1}
                    max={500}
                    value={avgPricePerCouvert}
                    onChange={e => setAvgPricePerCouvert(Math.max(1, parseInt(e.target.value) || 1))}
                    className="w-16 px-2 py-1 rounded bg-white/20 border border-white/30 text-white text-sm text-center focus:outline-none focus:ring-2 focus:ring-white/50"
                  />
                  <span className="text-xs text-blue-200">€</span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="bg-white/10 rounded-lg p-4">
                <p className="text-xs text-blue-200 mb-1">{"CA\u00A0/\u00A0jour"}</p>
                <p className="text-2xl font-bold"><AnimatedNumber value={stats.dailyRevenue} decimals={0} suffix=" €" /></p>
              </div>
              <div className="bg-white/10 rounded-lg p-4">
                <p className="text-xs text-blue-200 mb-1">{"CA\u00A0/\u00A0semaine"}</p>
                <p className="text-2xl font-bold"><AnimatedNumber value={stats.dailyRevenue * 6} decimals={0} suffix=" €" /></p>
              </div>
              <div className="bg-white/10 rounded-lg p-4">
                <p className="text-xs text-blue-200 mb-1">{"CA\u00A0/\u00A0mois"}</p>
                <p className="text-2xl font-bold"><AnimatedNumber value={stats.dailyRevenue * 26} decimals={0} suffix=" €" /></p>
              </div>
              <div className="bg-white/10 rounded-lg p-4">
                <p className="text-xs text-blue-200 mb-1">{"Profit\u00A0/\u00A0jour"}</p>
                <p className="text-2xl font-bold text-green-300"><AnimatedNumber value={stats.dailyProfit} decimals={0} suffix=" €" /></p>
              </div>
            </div>
          </div>

          {/* Projections Line Chart */}
          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-5">
            <div className="flex items-center gap-2 mb-4">
              <TrendingUp className="w-5 h-5 text-indigo-600" />
              <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100">Projections sur 6 mois</h3>
              <span className="text-xs text-slate-400 dark:text-slate-500 ml-auto">Revenus vs Coûts</span>
            </div>
            <ResponsiveContainer width="100%" height={340}>
              <LineChart data={stats.projectionData} margin={{ top: 10, right: 30, bottom: 10, left: 20 }}>
                <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                <XAxis dataKey="name" tick={{ fontSize: 12 }} tickMargin={8} />
                <YAxis tick={{ fontSize: 12 }} tickFormatter={(v: number) => `${(v / 1000).toFixed(0)}k€`} width={55} />
                <Tooltip
                  content={({ active, payload, label }) => {
                    if (!active || !payload?.length) return null;
                    return (
                      <div className="bg-white dark:bg-slate-800 shadow-xl rounded-lg p-3 border border-slate-200 dark:border-slate-600 text-sm min-w-[180px]">
                        <p className="font-semibold text-slate-800 dark:text-slate-100 mb-1.5">{label}</p>
                        {payload.map((p: any, i: number) => (
                          <div key={i} className="flex items-center gap-2 mt-0.5">
                            <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: p.color }} />
                            <span className="text-slate-500 dark:text-slate-400">{p.name}:</span>
                            <span className="font-semibold ml-auto" style={{ color: p.color }}>{p.value?.toLocaleString('fr-FR')} €</span>
                          </div>
                        ))}
                      </div>
                    );
                  }}
                />
                <Line type="monotone" dataKey="revenue" name="Revenus" stroke="#2563eb" strokeWidth={2.5} dot={{ fill: '#2563eb', r: 4 }} />
                <Line type="monotone" dataKey="costs" name="Coûts" stroke="#dc2626" strokeWidth={2.5} dot={{ fill: '#dc2626', r: 4 }} strokeDasharray="5 5" />
                <Line type="monotone" dataKey="profit" name="Profit" stroke="#059669" strokeWidth={2.5} dot={{ fill: '#059669', r: 4 }} />
                <Legend />
              </LineChart>
            </ResponsiveContainer>
            {/* Break-even indicator */}
            <div className="mt-4 flex flex-wrap items-center gap-4">
              <div className="flex items-center gap-2 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800/50 rounded-lg px-3 py-2">
                <Target className="w-4 h-4 text-blue-600" />
                <span className="text-sm text-blue-800 dark:text-blue-300 font-medium">
                  Seuil de rentabilité : {stats.seuilRentabilite > 0 ? `${stats.seuilRentabilite} couverts/jour` : 'Rentable dès le 1er couvert'}
                </span>
              </div>
              <div className="flex items-center gap-2 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800/50 rounded-lg px-3 py-2">
                <DollarSign className="w-4 h-4 text-green-600" />
                <span className="text-sm text-green-800 dark:text-green-300 font-medium">
                  Profit mensuel estimé : {(stats.dailyProfit * 26).toLocaleString('fr-FR')} €
                </span>
              </div>
            </div>
          </div>

          {/* Break-even analysis + coefficient distribution side by side */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Break-even analysis */}
            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-5">
              <div className="flex items-center gap-2 mb-4">
                <Target className="w-5 h-5 text-blue-600" />
                <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100">Analyse de rentabilité</h3>
              </div>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-slate-50 dark:bg-slate-700/50 rounded-lg p-4">
                    <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Coût ratio moyen</p>
                    <p className="text-2xl font-bold text-slate-800 dark:text-slate-100">
                      <AnimatedNumber value={stats.avgCostRatio * 100} decimals={1} suffix="%" />
                    </p>
                  </div>
                  <div className="bg-slate-50 dark:bg-slate-700/50 rounded-lg p-4">
                    <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">{"Profit\u00A0/\u00A0couvert"}</p>
                    <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                      <AnimatedNumber value={stats.profitPerCouvert} decimals={2} suffix=" €" />
                    </p>
                  </div>
                  <div className="bg-slate-50 dark:bg-slate-700/50 rounded-lg p-4">
                    <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">{"Couverts\u00A0/\u00A0jour"}</p>
                    <p className="text-2xl font-bold text-slate-800 dark:text-slate-100">{stats.dailyCouverts}</p>
                  </div>
                  <div className="bg-slate-50 dark:bg-slate-700/50 rounded-lg p-4">
                    <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Coût matière moy.</p>
                    <p className="text-2xl font-bold text-slate-800 dark:text-slate-100">
                      <AnimatedNumber value={stats.avgFoodCost} decimals={2} suffix=" €" />
                    </p>
                  </div>
                </div>
                {stats.seuilRentabilite > 0 && (
                  <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800/50 rounded-lg p-4">
                    <div className="flex items-center gap-2 text-yellow-800 dark:text-yellow-300">
                      <AlertTriangle className="w-4 h-4" />
                      <span className="text-sm font-semibold">Seuil de rentabilité : {stats.seuilRentabilite} couverts/jour</span>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Coefficient distribution chart */}
            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-5">
              <div className="flex items-center gap-2 mb-4">
                <BarChart3 className="w-5 h-5 text-purple-600" />
                <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100">Distribution des coefficients</h3>
              </div>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={stats.coeffBuckets}>
                  <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                  <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                  <YAxis allowDecimals={false} tick={{ fontSize: 12 }} />
                  <Tooltip content={<ChartTooltip />} />
                  <Bar dataKey="count" name="Nb recettes" radius={[4, 4, 0, 0]}>
                    {stats.coeffBuckets.map((entry, index) => (
                      <Cell key={index} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Worst 5 Recipes table */}
          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-red-200 dark:border-red-800/50 p-5">
            <div className="flex items-center gap-2 mb-4">
              <ShieldAlert className="w-5 h-5 text-red-500" />
              <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100">5 recettes les moins rentables</h3>
              <span className="text-xs text-red-500 font-medium bg-red-50 dark:bg-red-900/20 px-2 py-0.5 rounded-full ml-auto">Action requise</span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-slate-500 dark:text-slate-400 border-b border-slate-200 dark:border-slate-700">
                    <th className="pb-2 font-medium">#</th>
                    <th className="pb-2 font-medium">Recette</th>
                    <th className="pb-2 font-medium">Catégorie</th>
                    <th className="pb-2 text-right font-medium">Prix vente</th>
                    <th className="pb-2 text-right font-medium">Coût total</th>
                    <th className="pb-2 text-right font-medium">Marge</th>
                    <th className="pb-2 text-right font-medium">Coeff.</th>
                    <th className="pb-2 text-center font-medium">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                  {stats.worst5.map((r, i) => (
                    <tr key={r.id} className="hover:bg-red-50/50 dark:hover:bg-red-900/10">
                      <td className="py-2.5 text-red-500 font-bold">{i + 1}</td>
                      <td className="py-2.5 font-medium text-slate-800 dark:text-slate-200">{r.name}</td>
                      <td className="py-2.5 text-slate-500 dark:text-slate-400">{r.category}</td>
                      <td className="py-2.5 text-right font-mono text-slate-700 dark:text-slate-300">{r.sellingPrice.toFixed(2)} €</td>
                      <td className="py-2.5 text-right font-mono text-slate-700 dark:text-slate-300">{(r.margin.totalCostPerPortion || r.margin.costPerPortion).toFixed(2)} €</td>
                      <td className={`py-2.5 text-right font-mono font-bold ${r.margin.marginPercent < 50 ? 'text-red-600' : 'text-amber-600'}`}>
                        {r.margin.marginPercent.toFixed(1)}%
                      </td>
                      <td className="py-2.5 text-right font-mono text-slate-700 dark:text-slate-300">{r.margin.coefficient.toFixed(2)}</td>
                      <td className="py-2.5 text-center">
                        <Link to={`/recipes/${r.id}`} className="inline-flex items-center gap-1 text-xs text-blue-600 dark:text-blue-400 hover:underline font-medium">
                          Modifier <ArrowRight className="w-3 h-3" />
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Full Recipes Table */}
          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700">
            <div className="px-5 py-3 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100">Détail par plat</h3>
              <span className="text-xs text-slate-400 dark:text-slate-500">Trié par marge croissante</span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-slate-50 dark:bg-slate-700/50 text-slate-600 dark:text-slate-300">
                  <tr>
                    <th className="px-4 py-2.5 text-left font-medium">Plat</th>
                    <th className="px-4 py-2.5 text-left font-medium">Cat.</th>
                    <th className="px-4 py-2.5 text-right font-medium">Prix</th>
                    <th className="px-4 py-2.5 text-right font-medium">Coût mat.</th>
                    <th className="px-4 py-2.5 text-right font-medium">Coût MO</th>
                    <th className="px-4 py-2.5 text-right font-medium">Coût total</th>
                    <th className="px-4 py-2.5 text-right font-medium">Marge €</th>
                    <th className="px-4 py-2.5 text-right font-medium">Marge %</th>
                    <th className="px-4 py-2.5 text-right font-medium">Coeff.</th>
                    <th className="px-4 py-2.5 text-center font-medium">Fiche</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                  {sortedByMargin.map(r => {
                    const mc = r.margin.marginPercent >= 70 ? 'text-green-600' : r.margin.marginPercent >= 60 ? 'text-amber-600' : 'text-red-600';
                    const rowBg = r.margin.marginPercent < 60 ? 'bg-red-50/40 dark:bg-red-900/10' : '';
                    return (
                      <tr key={r.id} className={`hover:bg-slate-50 dark:hover:bg-slate-700/50 ${rowBg}`}>
                        <td className="px-4 py-2.5 font-medium text-slate-800 dark:text-slate-200">
                          {r.margin.marginPercent < 50 && <AlertTriangle className="w-3.5 h-3.5 text-red-500 inline mr-1 -mt-0.5" />}
                          {r.name}
                        </td>
                        <td className="px-4 py-2.5 text-slate-500 dark:text-slate-400">{r.category}</td>
                        <td className="px-4 py-2.5 text-right font-mono text-slate-700 dark:text-slate-300">{r.sellingPrice.toFixed(2)} €</td>
                        <td className="px-4 py-2.5 text-right font-mono text-slate-700 dark:text-slate-300">{r.margin.costPerPortion.toFixed(2)} €</td>
                        <td className="px-4 py-2.5 text-right font-mono text-slate-500 dark:text-slate-400">{(r.margin.laborCostPerPortion || 0).toFixed(2)} €</td>
                        <td className="px-4 py-2.5 text-right font-mono font-medium text-slate-800 dark:text-slate-200">{(r.margin.totalCostPerPortion || r.margin.costPerPortion).toFixed(2)} €</td>
                        <td className="px-4 py-2.5 text-right font-mono text-slate-700 dark:text-slate-300">{r.margin.marginAmount.toFixed(2)} €</td>
                        <td className={`px-4 py-2.5 text-right font-mono font-semibold ${mc}`}>{r.margin.marginPercent.toFixed(1)}%</td>
                        <td className="px-4 py-2.5 text-right font-mono text-slate-700 dark:text-slate-300">{r.margin.coefficient.toFixed(2)}</td>
                        <td className="px-4 py-2.5 text-center">
                          <Link to={`/recipes/${r.id}`} className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300">
                            <Eye className="w-4 h-4 inline" />
                          </Link>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
