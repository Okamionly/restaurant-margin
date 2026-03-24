import { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  TrendingUp, TrendingDown, DollarSign, ChefHat, Eye, Briefcase,
  PieChart as PieChartIcon, AlertTriangle, Plus, Download, ShieldAlert,
  Trophy, Target, Calculator, Utensils, BarChart3, ArrowRight,
  ChevronDown, ChevronRight, Package, ClipboardList, FileText,
} from 'lucide-react';
import {
  PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Legend, Treemap,
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

// ── Allergen color map (matching fiche technique) ─────────────────────────
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

// ── Tab definitions ───────────────────────────────────────────────────────
type TabKey = 'overview' | 'margins' | 'costs' | 'profitability';
const TABS: { key: TabKey; label: string; icon: any }[] = [
  { key: 'overview', label: "Vue d'ensemble", icon: BarChart3 },
  { key: 'margins', label: 'Analyse des marges', icon: TrendingUp },
  { key: 'costs', label: 'Coûts matière', icon: PieChartIcon },
  { key: 'profitability', label: 'Rentabilité', icon: DollarSign },
];

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

// ── Compact Stat Card (5 in a row) ────────────────────────────────────────
function StatCard({ title, value, numericValue, subtitle, icon: Icon, color, decimals = 1, suffix = '', prefix = '' }: {
  title: string; value?: string; numericValue?: number; subtitle?: string; icon: any; color: string;
  decimals?: number; suffix?: string; prefix?: string;
}) {
  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700 p-3 sm:p-4 hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between mb-1.5">
        <span className="text-xs font-medium text-slate-500 dark:text-slate-400 truncate">{title}</span>
        <div className={`p-1.5 rounded-lg ${color}`}>
          <Icon className="w-3.5 h-3.5 text-white" />
        </div>
      </div>
      <div className="text-lg sm:text-xl font-bold text-slate-800 dark:text-slate-100">
        {numericValue !== undefined
          ? <AnimatedNumber value={numericValue} decimals={decimals} suffix={suffix} prefix={prefix} />
          : value}
      </div>
      {subtitle && <p className="text-[10px] sm:text-xs text-slate-400 dark:text-slate-500 mt-0.5 truncate">{subtitle}</p>}
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

// ── Collapsible Section ───────────────────────────────────────────────────
function Collapsible({ title, icon: Icon, badge, defaultOpen = false, children, className = '' }: {
  title: string; icon: any; badge?: number; defaultOpen?: boolean; children: React.ReactNode; className?: string;
}) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className={`bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700 ${className}`}>
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center gap-2 px-5 py-3 text-left hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors rounded-xl"
      >
        <Icon className="w-4 h-4 text-slate-500 dark:text-slate-400" />
        <span className="font-semibold text-sm text-slate-800 dark:text-slate-100 flex-1">{title}</span>
        {badge !== undefined && badge > 0 && (
          <span className="bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 text-xs font-bold px-2 py-0.5 rounded-full">
            {badge}
          </span>
        )}
        {open ? <ChevronDown className="w-4 h-4 text-slate-400" /> : <ChevronRight className="w-4 h-4 text-slate-400" />}
      </button>
      {open && <div className="px-5 pb-4">{children}</div>}
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
    const fixedCostsEstimate = 0; // Could be user-configurable
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
        name: r.name.length > 20 ? r.name.slice(0, 18) + '...' : r.name,
        fullName: r.name,
        margin: r.margin.marginPercent,
        category: r.category,
        fill: r.margin.marginPercent >= 70 ? '#059669' : r.margin.marginPercent >= 60 ? '#d97706' : '#dc2626',
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
    recipes.forEach(r => {
      r.ingredients.forEach(ri => {
        const cat = ri.ingredient.category || 'Autres';
        const cost = ri.ingredient.pricePerUnit * ri.quantity * (1 + ri.wastePercent / 100);
        foodCostMap.set(cat, (foodCostMap.get(cat) || 0) + cost);
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

    return {
      totalRecipes, avgMargin, avgCoefficient, bestMargin, worstMargin,
      avgFoodCost, avgLaborCost, avgTotalCost,
      dailyCouverts, dailyRevenue, dailyCost, dailyProfit, seuilRentabilite,
      avgCostRatio, profitPerCouvert,
      categoryData, categoryMarginData, marginBuckets, allByMargin,
      top10Margin, top10Coeff, worst5, alertRecipes,
      foodCostData, totalFoodCostAll,
      allergenSummary,
    };
  }, [recipes, couverts, serviceMode, avgPricePerCouvert]);

  // ── Export CSV helper ──────────────────────────────────────────────────
  const handleExportCSV = useCallback(() => {
    if (recipes.length === 0) return;
    const header = 'Nom,Cat\u00e9gorie,Prix vente,Co\u00fbt mati\u00e8re,Co\u00fbt MO,Co\u00fbt total,Marge €,Marge %,Coefficient\n';
    const rows = recipes.map(r =>
      `"${r.name}","${r.category}",${r.sellingPrice.toFixed(2)},${r.margin.costPerPortion.toFixed(2)},${(r.margin.laborCostPerPortion || 0).toFixed(2)},${(r.margin.totalCostPerPortion || r.margin.costPerPortion).toFixed(2)},${r.margin.marginAmount.toFixed(2)},${r.margin.marginPercent.toFixed(1)},${r.margin.coefficient.toFixed(2)}`
    ).join('\n');
    const blob = new Blob(['\uFEFF' + header + rows], { type: 'text/csv;charset=utf-8;' });
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
        <div className="text-center py-16 bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700">
          <ChefHat className="w-16 h-16 mx-auto text-slate-300 dark:text-slate-600 mb-4" />
          <h3 className="text-xl font-semibold text-slate-600 dark:text-slate-300 mb-2">Bienvenue sur RestauMargin</h3>
          <p className="text-slate-400 dark:text-slate-500 mb-6">Commencez par ajouter des ingredients puis cr&eacute;ez vos fiches techniques.</p>
          <div className="flex gap-4 justify-center">
            <Link to="/ingredients" className="btn-primary">Ajouter des ingredients</Link>
            <Link to="/recipes" className="btn-secondary">Cr&eacute;er une recette</Link>
          </div>
        </div>
      </div>
    );
  }

  const sortedByMargin = [...recipes].sort((a, b) => a.margin.marginPercent - b.margin.marginPercent);

  return (
    <div className="space-y-4">
      {/* ── Header + Quick Actions ────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100">Tableau de bord</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            {stats.totalRecipes} recette{stats.totalRecipes > 1 ? 's' : ''} &middot; {ingredients.length} ingr&eacute;dient{ingredients.length > 1 ? 's' : ''}
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
            <Package className="w-4 h-4" /> Ajouter ingr&eacute;dient
          </button>
          <Link
            to="/recipes"
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-200 text-sm font-medium rounded-lg hover:bg-slate-50 dark:hover:bg-slate-600 transition-colors border border-slate-200 dark:border-slate-600 shadow-sm"
          >
            <ClipboardList className="w-4 h-4" /> Voir les recettes
          </Link>
          <Link
            to="/ingredients"
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-200 text-sm font-medium rounded-lg hover:bg-slate-50 dark:hover:bg-slate-600 transition-colors border border-slate-200 dark:border-slate-600 shadow-sm"
          >
            <FileText className="w-4 h-4" /> Voir l'inventaire
          </Link>
          <button
            onClick={handleExportCSV}
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-200 text-sm font-medium rounded-lg hover:bg-slate-50 dark:hover:bg-slate-600 transition-colors border border-slate-200 dark:border-slate-600 shadow-sm"
          >
            <Download className="w-4 h-4" /> Exporter CSV
          </button>
        </div>
      </div>

      {/* ── Stat Cards (5 in a row, compact) ──────────────────────────── */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        <StatCard title="Recettes" value={String(stats.totalRecipes)} icon={ChefHat} color="bg-blue-600" />
        <StatCard
          title="Marge moyenne"
          numericValue={stats.avgMargin}
          suffix="%"
          subtitle={stats.avgMargin >= 70 ? 'Objectif atteint' : 'Objectif : > 70%'}
          icon={TrendingUp}
          color={stats.avgMargin >= 70 ? 'bg-green-600' : 'bg-amber-500'}
        />
        <StatCard
          title="Coefficient moyen"
          numericValue={stats.avgCoefficient}
          decimals={2}
          subtitle="Objectif : > 3.3"
          icon={DollarSign}
          color="bg-purple-600"
        />
        <StatCard
          title="Co\u00fbt moyen total"
          numericValue={stats.avgTotalCost}
          decimals={2}
          suffix=" €"
          subtitle={stats.avgLaborCost > 0 ? `Mat. ${stats.avgFoodCost.toFixed(2)}€ + MO ${stats.avgLaborCost.toFixed(2)}€` : 'Mati\u00e8re seule'}
          icon={Briefcase}
          color="bg-cyan-600"
        />
        <StatCard
          title="Min / Max"
          value={`${stats.worstMargin.toFixed(0)}% / ${stats.bestMargin.toFixed(0)}%`}
          icon={TrendingDown}
          color="bg-slate-600"
        />
      </div>

      {/* ── Alerts (collapsible, collapsed by default) ─────────────────── */}
      {stats.alertRecipes.length > 0 && (
        <Collapsible
          title={`Alertes \u2014 ${stats.alertRecipes.length} recette${stats.alertRecipes.length > 1 ? 's' : ''} sous 60% de marge`}
          icon={AlertTriangle}
          badge={stats.alertRecipes.length}
          defaultOpen={false}
          className="border-red-200 dark:border-red-800/50"
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
            {stats.alertRecipes.map(r => (
              <Link
                key={r.id}
                to={`/recipes/${r.id}`}
                className="flex items-center justify-between bg-red-50 dark:bg-red-900/20 rounded-lg px-3 py-2 hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors border border-red-100 dark:border-red-800/50"
              >
                <span className="text-sm font-medium text-slate-700 dark:text-slate-300 truncate pr-2">{r.name}</span>
                <span className={`text-sm font-bold tabular-nums ${r.margin.marginPercent < 50 ? 'text-red-600' : 'text-amber-600'}`}>
                  {r.margin.marginPercent.toFixed(1)}%
                </span>
              </Link>
            ))}
          </div>
        </Collapsible>
      )}

      {/* ── Allergen Strip (compact horizontal scroll) ─────────────────── */}
      {stats.allergenSummary.length > 0 && (
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-thin">
          <ShieldAlert className="w-4 h-4 text-amber-500 flex-shrink-0" />
          <span className="text-xs font-medium text-slate-500 dark:text-slate-400 flex-shrink-0">Allerg&egrave;nes :</span>
          {stats.allergenSummary.map(a => (
            <span
              key={a.name}
              className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold flex-shrink-0 ${ALLERGEN_COLORS[a.name] || 'bg-amber-200 text-amber-800 dark:bg-amber-800/50 dark:text-amber-200'}`}
            >
              {a.name} <span className="opacity-70">{a.count}</span>
            </span>
          ))}
        </div>
      )}

      {/* ── Tab Navigation ─────────────────────────────────────────────── */}
      <div className="flex gap-1 bg-slate-100 dark:bg-slate-800 rounded-lg p-1 overflow-x-auto">
        {TABS.map(tab => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.key;
          return (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-md text-sm font-medium transition-all whitespace-nowrap flex-shrink-0
                ${isActive
                  ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-400 shadow-sm'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300'
                }`}
            >
              <Icon className="w-4 h-4" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* ══════════════════════════════════════════════════════════════════ */}
      {/* TAB: Vue d'ensemble                                               */}
      {/* ══════════════════════════════════════════════════════════════════ */}
      {activeTab === 'overview' && (
        <div className="space-y-4">
          {/* Revenue Estimation */}
          <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-xl shadow-lg p-5 text-white">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-4">
              <div className="flex items-center gap-2">
                <Calculator className="w-5 h-5" />
                <h3 className="font-semibold text-lg">Estimation de revenus</h3>
              </div>
              <div className="flex flex-wrap items-center gap-3">
                {/* Service mode selector */}
                <div className="flex items-center gap-1 bg-white/10 rounded-lg p-0.5">
                  {([['all', 'Jour'], ['lunch', 'D\u00e9j.'], ['dinner', 'D\u00een.']] as const).map(([key, label]) => (
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
                  <label className="text-xs text-blue-100">Couverts/service :</label>
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
                  <span className="text-xs text-blue-200">&euro;</span>
                </div>
              </div>
            </div>

            {/* Projections grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-3">
              <div className="bg-white/10 rounded-lg p-3">
                <p className="text-xs text-blue-200 mb-1">CA / jour</p>
                <p className="text-xl font-bold"><AnimatedNumber value={stats.dailyRevenue} decimals={0} suffix=" €" /></p>
              </div>
              <div className="bg-white/10 rounded-lg p-3">
                <p className="text-xs text-blue-200 mb-1">CA / semaine</p>
                <p className="text-xl font-bold"><AnimatedNumber value={stats.dailyRevenue * 6} decimals={0} suffix=" €" /></p>
              </div>
              <div className="bg-white/10 rounded-lg p-3">
                <p className="text-xs text-blue-200 mb-1">CA / mois</p>
                <p className="text-xl font-bold"><AnimatedNumber value={stats.dailyRevenue * 26} decimals={0} suffix=" €" /></p>
              </div>
              <div className="bg-white/10 rounded-lg p-3">
                <p className="text-xs text-blue-200 mb-1">Profit / jour</p>
                <p className="text-xl font-bold text-green-300"><AnimatedNumber value={stats.dailyProfit} decimals={0} suffix=" €" /></p>
              </div>
            </div>

            {/* Info line */}
            <div className="flex flex-wrap items-center gap-x-6 gap-y-1 text-xs text-blue-200">
              <span>{stats.dailyCouverts} couverts/jour ({serviceMode === 'all' ? '2 services' : serviceMode === 'lunch' ? 'd\u00e9jeuner' : 'd\u00eener'})</span>
              <span>Co\u00fbt ratio : {(stats.avgCostRatio * 100).toFixed(1)}%</span>
              <span>Profit/couvert : {stats.profitPerCouvert.toFixed(2)} €</span>
              {stats.seuilRentabilite > 0 && (
                <span className="text-yellow-300 font-medium">Seuil de rentabilit\u00e9 : {stats.seuilRentabilite} couverts/jour</span>
              )}
            </div>
          </div>

          {/* Category Summary */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
            {stats.categoryData.map((cat, i) => (
              <div key={cat.name} className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700 p-3 hover:shadow-md transition-shadow">
                <div className="flex items-center gap-2 mb-1">
                  <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: COLORS[i % COLORS.length] }} />
                  <span className="text-xs font-medium text-slate-700 dark:text-slate-300 truncate">{cat.name}</span>
                </div>
                <div className="text-lg font-bold text-slate-800 dark:text-slate-100">{cat.count}</div>
                <div className="text-xs text-slate-500 dark:text-slate-400">
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

          {/* Charts side by side: Category Donut + Margin by Category */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Category Distribution - Clean donut with side legend */}
            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700 p-5">
              <div className="flex items-center gap-2 mb-4">
                <Utensils className="w-5 h-5 text-blue-600" />
                <h3 className="font-semibold text-slate-800 dark:text-slate-100">R&eacute;partition par cat&eacute;gorie</h3>
              </div>
              <div className="flex flex-col sm:flex-row items-center gap-4">
                <div className="w-full sm:w-1/2">
                  <ResponsiveContainer width="100%" height={200}>
                    <PieChart>
                      <Pie
                        data={stats.categoryData}
                        cx="50%"
                        cy="50%"
                        innerRadius={50}
                        outerRadius={85}
                        paddingAngle={3}
                        dataKey="count"
                        nameKey="name"
                      >
                        {stats.categoryData.map((_entry, index) => (
                          <Cell key={index} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip content={<ChartTooltip />} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="w-full sm:w-1/2 space-y-2">
                  {stats.categoryData.map((cat, i) => (
                    <div key={cat.name} className="flex items-center gap-2 text-sm">
                      <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: COLORS[i % COLORS.length] }} />
                      <span className="text-slate-700 dark:text-slate-300 flex-1 truncate">{cat.name}</span>
                      <span className="font-semibold text-slate-800 dark:text-slate-100 tabular-nums">{cat.count}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Margin by Category Bar */}
            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700 p-5">
              <div className="flex items-center gap-2 mb-4">
                <BarChart3 className="w-5 h-5 text-green-600" />
                <h3 className="font-semibold text-slate-800 dark:text-slate-100">Marge moyenne par cat&eacute;gorie</h3>
              </div>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={stats.categoryMarginData} margin={{ top: 5, right: 10, bottom: 0, left: -10 }}>
                  <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                  <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                  <YAxis domain={[0, 100]} tick={{ fontSize: 11 }} unit="%" />
                  <Tooltip content={<ChartTooltip />} />
                  <Bar dataKey="avgMargin" name="Marge moy." radius={[6, 6, 0, 0]}>
                    {stats.categoryMarginData.map((entry, index) => (
                      <Cell key={index} fill={entry.fill} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
              <div className="flex items-center justify-center gap-4 mt-1 text-xs text-slate-400 dark:text-slate-500">
                <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-green-600 inline-block" /> &ge; 70%</span>
                <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-amber-500 inline-block" /> 60-70%</span>
                <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-red-500 inline-block" /> &lt; 60%</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════════ */}
      {/* TAB: Analyse des marges                                           */}
      {/* ══════════════════════════════════════════════════════════════════ */}
      {activeTab === 'margins' && (
        <div className="space-y-4">
          {/* Distribution des marges - Horizontal bar chart sorted by margin */}
          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700 p-5">
            <div className="flex items-center gap-2 mb-4">
              <TrendingUp className="w-5 h-5 text-green-600" />
              <h3 className="font-semibold text-slate-800 dark:text-slate-100">Distribution des marges (toutes recettes)</h3>
            </div>
            <ResponsiveContainer width="100%" height={Math.max(300, stats.allByMargin.length * 28)}>
              <BarChart data={stats.allByMargin} layout="vertical" margin={{ top: 5, right: 30, bottom: 5, left: 5 }}>
                <CartesianGrid strokeDasharray="3 3" className="opacity-30" horizontal={false} />
                <XAxis type="number" domain={[0, 100]} unit="%" tick={{ fontSize: 11 }} />
                <YAxis type="category" dataKey="name" width={130} tick={{ fontSize: 11 }} />
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
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Margin Buckets */}
          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700 p-5">
            <div className="flex items-center gap-2 mb-4">
              <BarChart3 className="w-5 h-5 text-blue-600" />
              <h3 className="font-semibold text-slate-800 dark:text-slate-100">R&eacute;partition par tranche de marge</h3>
            </div>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={stats.marginBuckets}>
                <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                <YAxis allowDecimals={false} tick={{ fontSize: 12 }} />
                <Tooltip content={<ChartTooltip />} />
                <Bar dataKey="count" name="Nb recettes" radius={[4, 4, 0, 0]}>
                  {stats.marginBuckets.map((entry, index) => (
                    <Cell key={index} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Top 10 Margin + Top 10 Coefficient */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700 p-5">
              <div className="flex items-center gap-2 mb-4">
                <Trophy className="w-5 h-5 text-yellow-500" />
                <h3 className="font-semibold text-slate-800 dark:text-slate-100">Top 10 par marge</h3>
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

            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700 p-5">
              <div className="flex items-center gap-2 mb-4">
                <Target className="w-5 h-5 text-purple-500" />
                <h3 className="font-semibold text-slate-800 dark:text-slate-100">Top 10 par coefficient</h3>
              </div>
              <div className="space-y-3">
                {stats.top10Coeff.map((r, i) => {
                  const maxCoeff = stats.top10Coeff[0]?.margin.coefficient || 1;
                  return (
                    <RankBar
                      key={r.id}
                      rank={i + 1}
                      name={r.name}
                      value={r.margin.coefficient}
                      maxValue={maxCoeff * 1.1}
                      unit="x"
                      color={r.margin.coefficient >= 3.3 ? '#7c3aed' : r.margin.coefficient >= 2.5 ? '#d97706' : '#dc2626'}
                      link={`/recipes/${r.id}`}
                    />
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════════ */}
      {/* TAB: Co\u00fbts mati\u00e8re                                                        */}
      {/* ══════════════════════════════════════════════════════════════════ */}
      {activeTab === 'costs' && (
        <div className="space-y-4">
          {/* Food Cost Treemap */}
          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700 p-5">
            <div className="flex items-center gap-2 mb-4">
              <PieChartIcon className="w-5 h-5 text-blue-600" />
              <h3 className="font-semibold text-slate-800 dark:text-slate-100">R&eacute;partition co\u00fbt mati&egrave;re</h3>
              <span className="text-xs text-slate-400 dark:text-slate-500 ml-auto">
                Total : {stats.totalFoodCostAll.toFixed(2)} &euro;
              </span>
            </div>
            {stats.foodCostData.length > 0 ? (
              <ResponsiveContainer width="100%" height={320}>
                <Treemap
                  data={stats.foodCostData.map(d => ({ ...d, totalFoodCost: stats.totalFoodCostAll }))}
                  dataKey="value"
                  nameKey="name"
                  content={<TreemapContent totalFoodCost={stats.totalFoodCostAll} />}
                >
                  <Tooltip
                    content={({ active, payload }) => {
                      if (!active || !payload?.length) return null;
                      const d = payload[0]?.payload;
                      const pct = stats.totalFoodCostAll > 0 ? ((d?.value / stats.totalFoodCostAll) * 100).toFixed(1) : '0';
                      return (
                        <div className="bg-white dark:bg-slate-800 shadow-xl rounded-lg p-3 border border-slate-200 dark:border-slate-600 text-sm">
                          <p className="font-semibold text-slate-800 dark:text-slate-100">{d?.name}</p>
                          <p className="text-slate-600 dark:text-slate-300">{d?.value?.toFixed(2)} &euro; ({pct}%)</p>
                        </div>
                      );
                    }}
                  />
                </Treemap>
              </ResponsiveContainer>
            ) : (
              <p className="text-center text-slate-400 py-12">Aucune donn&eacute;e</p>
            )}
          </div>

          {/* Stacked bar alternative view */}
          {stats.foodCostData.length > 0 && (
            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700 p-5">
              <div className="flex items-center gap-2 mb-4">
                <BarChart3 className="w-5 h-5 text-orange-600" />
                <h3 className="font-semibold text-slate-800 dark:text-slate-100">D&eacute;tail par cat&eacute;gorie de co\u00fbt</h3>
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
                          <p className="text-slate-600 dark:text-slate-300">{d?.value?.toFixed(2)} &euro;</p>
                          <p className="text-slate-500 dark:text-slate-400">{pct}% du co\u00fbt total</p>
                        </div>
                      );
                    }}
                  />
                  <Bar dataKey="value" name="Co\u00fbt" radius={[0, 4, 4, 0]}>
                    {stats.foodCostData.map((entry, index) => (
                      <Cell key={index} fill={entry.fill} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════════ */}
      {/* TAB: Rentabilit\u00e9                                                     */}
      {/* ══════════════════════════════════════════════════════════════════ */}
      {activeTab === 'profitability' && (
        <div className="space-y-4">
          {/* Worst 5 Recipes */}
          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-red-200 dark:border-red-800/50 p-5">
            <div className="flex items-center gap-2 mb-4">
              <ShieldAlert className="w-5 h-5 text-red-500" />
              <h3 className="font-semibold text-slate-800 dark:text-slate-100">5 recettes les moins rentables</h3>
              <span className="text-xs text-red-500 font-medium bg-red-50 dark:bg-red-900/20 px-2 py-0.5 rounded-full ml-auto">Action requise</span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-slate-500 dark:text-slate-400 border-b border-slate-100 dark:border-slate-700">
                    <th className="pb-2 font-medium">#</th>
                    <th className="pb-2 font-medium">Recette</th>
                    <th className="pb-2 font-medium">Cat&eacute;gorie</th>
                    <th className="pb-2 text-right font-medium">Prix vente</th>
                    <th className="pb-2 text-right font-medium">Co\u00fbt total</th>
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
                      <td className="py-2.5 text-right font-mono text-slate-700 dark:text-slate-300">{r.sellingPrice.toFixed(2)} &euro;</td>
                      <td className="py-2.5 text-right font-mono text-slate-700 dark:text-slate-300">{(r.margin.totalCostPerPortion || r.margin.costPerPortion).toFixed(2)} &euro;</td>
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
          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700">
            <div className="px-5 py-3 border-b border-slate-100 dark:border-slate-700 flex items-center justify-between">
              <h3 className="font-semibold text-slate-800 dark:text-slate-100">D&eacute;tail par plat</h3>
              <span className="text-xs text-slate-400 dark:text-slate-500">Tri&eacute; par marge croissante</span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-slate-50 dark:bg-slate-700/50 text-slate-600 dark:text-slate-300">
                  <tr>
                    <th className="px-4 py-2.5 text-left font-medium">Plat</th>
                    <th className="px-4 py-2.5 text-left font-medium">Cat.</th>
                    <th className="px-4 py-2.5 text-right font-medium">Prix</th>
                    <th className="px-4 py-2.5 text-right font-medium">Co\u00fbt mat.</th>
                    <th className="px-4 py-2.5 text-right font-medium">Co\u00fbt MO</th>
                    <th className="px-4 py-2.5 text-right font-medium">Co\u00fbt total</th>
                    <th className="px-4 py-2.5 text-right font-medium">Marge &euro;</th>
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
                        <td className="px-4 py-2.5 text-right font-mono text-slate-700 dark:text-slate-300">{r.sellingPrice.toFixed(2)} &euro;</td>
                        <td className="px-4 py-2.5 text-right font-mono text-slate-700 dark:text-slate-300">{r.margin.costPerPortion.toFixed(2)} &euro;</td>
                        <td className="px-4 py-2.5 text-right font-mono text-slate-500 dark:text-slate-400">{(r.margin.laborCostPerPortion || 0).toFixed(2)} &euro;</td>
                        <td className="px-4 py-2.5 text-right font-mono font-medium text-slate-800 dark:text-slate-200">{(r.margin.totalCostPerPortion || r.margin.costPerPortion).toFixed(2)} &euro;</td>
                        <td className="px-4 py-2.5 text-right font-mono text-slate-700 dark:text-slate-300">{r.margin.marginAmount.toFixed(2)} &euro;</td>
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
