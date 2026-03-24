import { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  TrendingUp, TrendingDown, DollarSign, ChefHat, Eye, Briefcase,
  PieChart as PieChartIcon, AlertTriangle, Plus, Download, ShieldAlert,
  Trophy, Target, Calculator, Utensils, BarChart3, ArrowRight,
} from 'lucide-react';
import {
  PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Legend, RadialBarChart, RadialBar,
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

// ── Stat Card ──────────────────────────────────────────────────────────────
function StatCard({ title, value, numericValue, subtitle, icon: Icon, color, decimals = 1, suffix = '', prefix = '' }: {
  title: string; value?: string; numericValue?: number; subtitle?: string; icon: any; color: string;
  decimals?: number; suffix?: string; prefix?: string;
}) {
  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700 p-5 hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-medium text-slate-500 dark:text-slate-400">{title}</span>
        <div className={`p-2 rounded-lg ${color}`}>
          <Icon className="w-5 h-5 text-white" />
        </div>
      </div>
      <div className="text-2xl font-bold text-slate-800 dark:text-slate-100">
        {numericValue !== undefined
          ? <AnimatedNumber value={numericValue} decimals={decimals} suffix={suffix} prefix={prefix} />
          : value}
      </div>
      {subtitle && <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">{subtitle}</p>}
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
    <div className="bg-white dark:bg-slate-800 shadow-xl rounded-lg p-3 border border-slate-200 dark:border-slate-600 text-sm min-w-[160px]">
      <p className="font-semibold text-slate-800 dark:text-slate-100 mb-1">
        {payload[0]?.payload?.fullName || label || payload[0]?.payload?.name}
      </p>
      {payload.map((p: any, i: number) => (
        <div key={i} className="flex items-center gap-2 mt-0.5">
          <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: p.color || p.fill }} />
          <span className="text-slate-500 dark:text-slate-400">{p.name}:</span>
          <span className="font-semibold" style={{ color: p.color || p.fill }}>
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

// ── Allergen Badge ─────────────────────────────────────────────────────────
function AllergenBadge({ name, count, total }: { name: string; count: number; total: number }) {
  const pct = total > 0 ? (count / total) * 100 : 0;
  const bg = pct > 50 ? 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800 text-red-700 dark:text-red-400'
    : pct > 25 ? 'bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800 text-amber-700 dark:text-amber-400'
    : 'bg-slate-50 dark:bg-slate-700/50 border-slate-200 dark:border-slate-600 text-slate-600 dark:text-slate-400';
  return (
    <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-xs font-medium ${bg}`}>
      <span>{name}</span>
      <span className="font-bold">{count}</span>
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
  const [portionsPerDay, setPortionsPerDay] = useState(30);
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
    const totalDailyRevenue = recipes.reduce((s, r) => s + r.sellingPrice * portionsPerDay, 0);
    const totalDailyCost = recipes.reduce((s, r) => s + (r.margin.totalCostPerPortion || r.margin.costPerPortion) * portionsPerDay, 0);
    const totalDailyProfit = totalDailyRevenue - totalDailyCost;

    // Category breakdown (recipe categories: Entree, Plat, etc.)
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
      .map(([name, value]) => ({ name, value: Math.round(value * 100) / 100 }))
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

    // Average margin gauge (radial)
    const gaugeData = [{ name: 'Marge', value: avgMargin, fill: avgMargin >= 70 ? '#059669' : avgMargin >= 60 ? '#d97706' : '#dc2626' }];

    return {
      totalRecipes, avgMargin, avgCoefficient, bestMargin, worstMargin,
      avgFoodCost, avgLaborCost, avgTotalCost,
      totalDailyRevenue, totalDailyCost, totalDailyProfit,
      categoryData, categoryMarginData, marginBuckets,
      top10Margin, top10Coeff, worst5, alertRecipes,
      foodCostData, totalFoodCostAll,
      allergenSummary, gaugeData,
    };
  }, [recipes, portionsPerDay]);

  // ── Export CSV helper ──────────────────────────────────────────────────
  const handleExportCSV = useCallback(() => {
    if (recipes.length === 0) return;
    const header = 'Nom,Catégorie,Prix vente,Coût matière,Coût MO,Coût total,Marge €,Marge %,Coefficient\n';
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
          <p className="text-slate-400 dark:text-slate-500 mb-6">Commencez par ajouter des ingredients puis créez vos fiches techniques.</p>
          <div className="flex gap-4 justify-center">
            <Link to="/ingredients" className="btn-primary">Ajouter des ingredients</Link>
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
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            {stats.totalRecipes} recette{stats.totalRecipes > 1 ? 's' : ''} &middot; {ingredients.length} ingredient{ingredients.length > 1 ? 's' : ''}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => navigate('/recipes?action=new')}
            className="inline-flex items-center gap-1.5 px-3 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-4 h-4" /> Nouvelle recette
          </button>
          <button
            onClick={() => navigate('/ingredients?action=new')}
            className="inline-flex items-center gap-1.5 px-3 py-2 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 text-sm font-medium rounded-lg hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors"
          >
            <Plus className="w-4 h-4" /> Ajouter ingredient
          </button>
          <button
            onClick={handleExportCSV}
            className="inline-flex items-center gap-1.5 px-3 py-2 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 text-sm font-medium rounded-lg hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors"
          >
            <Download className="w-4 h-4" /> Exporter CSV
          </button>
        </div>
      </div>

      {/* ── Stat Cards ────────────────────────────────────────────────── */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
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
          title="Coût moyen total"
          numericValue={stats.avgTotalCost}
          decimals={2}
          suffix=" €"
          subtitle={stats.avgLaborCost > 0 ? `Matière ${stats.avgFoodCost.toFixed(2)}€ + MO ${stats.avgLaborCost.toFixed(2)}€` : 'Matière seule'}
          icon={Briefcase}
          color="bg-cyan-600"
        />
        <StatCard
          title="Marge min / max"
          value={`${stats.worstMargin.toFixed(0)}% / ${stats.bestMargin.toFixed(0)}%`}
          icon={TrendingDown}
          color="bg-slate-600"
        />
      </div>

      {/* ── Alerts Section ────────────────────────────────────────────── */}
      {stats.alertRecipes.length > 0 && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-5">
          <div className="flex items-center gap-2 mb-3">
            <AlertTriangle className="w-5 h-5 text-red-600 dark:text-red-400" />
            <h3 className="font-semibold text-red-800 dark:text-red-300">
              Alertes &mdash; {stats.alertRecipes.length} recette{stats.alertRecipes.length > 1 ? 's' : ''} sous 60% de marge
            </h3>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
            {stats.alertRecipes.map(r => (
              <Link
                key={r.id}
                to={`/recipes/${r.id}`}
                className="flex items-center justify-between bg-white dark:bg-slate-800 rounded-lg px-3 py-2 hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors border border-red-100 dark:border-red-800/50"
              >
                <span className="text-sm font-medium text-slate-700 dark:text-slate-300 truncate pr-2">{r.name}</span>
                <span className={`text-sm font-bold tabular-nums ${r.margin.marginPercent < 50 ? 'text-red-600' : 'text-amber-600'}`}>
                  {r.margin.marginPercent.toFixed(1)}%
                </span>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* ── Revenue Estimation ────────────────────────────────────────── */}
      <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-xl shadow-lg p-6 text-white">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4">
          <div className="flex items-center gap-2">
            <Calculator className="w-5 h-5" />
            <h3 className="font-semibold text-lg">Estimation de revenus</h3>
          </div>
          <div className="flex items-center gap-2">
            <label className="text-sm text-blue-100">Portions / jour / recette :</label>
            <input
              type="number"
              min={1}
              max={500}
              value={portionsPerDay}
              onChange={e => setPortionsPerDay(Math.max(1, parseInt(e.target.value) || 1))}
              className="w-16 px-2 py-1 rounded bg-white/20 border border-white/30 text-white text-sm text-center focus:outline-none focus:ring-2 focus:ring-white/50"
            />
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-white/10 rounded-lg p-4">
            <p className="text-sm text-blue-100 mb-1">Chiffre d'affaires / jour</p>
            <p className="text-2xl font-bold"><AnimatedNumber value={stats.totalDailyRevenue} decimals={0} suffix=" €" /></p>
            <p className="text-xs text-blue-200 mt-1">
              <AnimatedNumber value={stats.totalDailyRevenue * 30} decimals={0} suffix=" € / mois" />
            </p>
          </div>
          <div className="bg-white/10 rounded-lg p-4">
            <p className="text-sm text-blue-100 mb-1">Coût total / jour</p>
            <p className="text-2xl font-bold"><AnimatedNumber value={stats.totalDailyCost} decimals={0} suffix=" €" /></p>
            <p className="text-xs text-blue-200 mt-1">
              <AnimatedNumber value={stats.totalDailyCost * 30} decimals={0} suffix=" € / mois" />
            </p>
          </div>
          <div className="bg-white/10 rounded-lg p-4">
            <p className="text-sm text-blue-100 mb-1">Profit estimé / jour</p>
            <p className="text-2xl font-bold text-green-300"><AnimatedNumber value={stats.totalDailyProfit} decimals={0} suffix=" €" /></p>
            <p className="text-xs text-green-200 mt-1">
              <AnimatedNumber value={stats.totalDailyProfit * 30} decimals={0} suffix=" € / mois" />
            </p>
          </div>
        </div>
      </div>

      {/* ── Top 10 Margin + Top 10 Coefficient ────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top 10 by Margin */}
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700 p-5">
          <div className="flex items-center gap-2 mb-4">
            <Trophy className="w-5 h-5 text-yellow-500" />
            <h3 className="font-semibold text-lg text-slate-800 dark:text-slate-100">Top 10 recettes par marge</h3>
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

        {/* Top 10 by Coefficient */}
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700 p-5">
          <div className="flex items-center gap-2 mb-4">
            <Target className="w-5 h-5 text-purple-500" />
            <h3 className="font-semibold text-lg text-slate-800 dark:text-slate-100">Top 10 recettes par coefficient</h3>
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

      {/* ── Worst 5 Recipes ───────────────────────────────────────────── */}
      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-red-200 dark:border-red-800/50 p-5">
        <div className="flex items-center gap-2 mb-4">
          <ShieldAlert className="w-5 h-5 text-red-500" />
          <h3 className="font-semibold text-lg text-slate-800 dark:text-slate-100">5 recettes les moins rentables</h3>
          <span className="text-xs text-red-500 font-medium bg-red-50 dark:bg-red-900/20 px-2 py-0.5 rounded-full ml-auto">Action requise</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-slate-500 dark:text-slate-400 border-b border-slate-100 dark:border-slate-700">
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

      {/* ── Charts: Food Cost Pie + Margin by Category Bar ────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Food Cost Breakdown Pie */}
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700 p-5">
          <div className="flex items-center gap-2 mb-4">
            <PieChartIcon className="w-5 h-5 text-blue-600" />
            <h3 className="font-semibold text-lg text-slate-800 dark:text-slate-100">Répartition coût matière</h3>
          </div>
          {stats.foodCostData.length > 0 ? (
            <>
              <ResponsiveContainer width="100%" height={280}>
                <PieChart>
                  <Pie
                    data={stats.foodCostData}
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={95}
                    paddingAngle={2}
                    dataKey="value"
                    nameKey="name"
                    label={({ name, value }: any) => {
                      const pct = stats.totalFoodCostAll > 0 ? ((value / stats.totalFoodCostAll) * 100).toFixed(0) : '0';
                      return `${name} (${pct}%)`;
                    }}
                    labelLine={{ strokeWidth: 1 }}
                  >
                    {stats.foodCostData.map((entry, index) => (
                      <Cell key={index} fill={FOOD_CATEGORY_COLORS[entry.name] || COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value: number, name: string) => [`${value.toFixed(2)} € (${stats.totalFoodCostAll > 0 ? ((value / stats.totalFoodCostAll) * 100).toFixed(1) : 0}%)`, name]}
                    contentStyle={{ borderRadius: '0.5rem', border: '1px solid #e2e8f0', fontSize: '0.875rem' }}
                  />
                </PieChart>
              </ResponsiveContainer>
              <p className="text-center text-xs text-slate-400 dark:text-slate-500 mt-2">
                Total coût matière : <span className="font-semibold text-slate-600 dark:text-slate-300">{stats.totalFoodCostAll.toFixed(2)} &euro;</span> (toutes recettes confondues)
              </p>
            </>
          ) : (
            <p className="text-center text-slate-400 py-12">Aucune donnée</p>
          )}
        </div>

        {/* Average Margin by Recipe Category Bar */}
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700 p-5">
          <div className="flex items-center gap-2 mb-4">
            <BarChart3 className="w-5 h-5 text-green-600" />
            <h3 className="font-semibold text-lg text-slate-800 dark:text-slate-100">Marge moyenne par catégorie</h3>
          </div>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={stats.categoryMarginData} margin={{ top: 10, right: 10, bottom: 0, left: -10 }}>
              <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
              <XAxis dataKey="name" tick={{ fontSize: 12 }} />
              <YAxis domain={[0, 100]} tick={{ fontSize: 12 }} unit="%" />
              <Tooltip content={<ChartTooltip />} />
              <Bar dataKey="avgMargin" name="Marge moy." radius={[6, 6, 0, 0]}>
                {stats.categoryMarginData.map((entry, index) => (
                  <Cell key={index} fill={entry.fill} />
                ))}
              </Bar>
              {/* Reference line at 70% */}
              <CartesianGrid horizontal={false} />
            </BarChart>
          </ResponsiveContainer>
          <div className="flex items-center justify-center gap-4 mt-2 text-xs text-slate-400 dark:text-slate-500">
            <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-green-600 inline-block" /> &ge; 70% objectif</span>
            <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-amber-500 inline-block" /> 60-70% vigilance</span>
            <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-red-500 inline-block" /> &lt; 60% critique</span>
          </div>
        </div>
      </div>

      {/* ── Original Charts: Category Distribution + Margin Distribution ─ */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Pie Chart - Category Distribution */}
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700 p-5">
          <div className="flex items-center gap-2 mb-4">
            <Utensils className="w-5 h-5 text-blue-600" />
            <h3 className="font-semibold text-lg text-slate-800 dark:text-slate-100">Répartition par catégorie</h3>
          </div>
          <ResponsiveContainer width="100%" height={280}>
            <PieChart>
              <Pie
                data={stats.categoryData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={3}
                dataKey="count"
                nameKey="name"
                label={({ name, count }: any) => `${name} (${count})`}
              >
                {stats.categoryData.map((_entry, index) => (
                  <Cell key={index} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip content={<ChartTooltip />} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Bar Chart - Margin Distribution */}
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700 p-5">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className="w-5 h-5 text-green-600" />
            <h3 className="font-semibold text-lg text-slate-800 dark:text-slate-100">Distribution des marges</h3>
          </div>
          <ResponsiveContainer width="100%" height={280}>
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
      </div>

      {/* ── Allergen Summary ──────────────────────────────────────────── */}
      {stats.allergenSummary.length > 0 && (
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700 p-5">
          <div className="flex items-center gap-2 mb-4">
            <ShieldAlert className="w-5 h-5 text-amber-500" />
            <h3 className="font-semibold text-lg text-slate-800 dark:text-slate-100">Résumé des allergènes</h3>
            <span className="text-xs text-slate-400 dark:text-slate-500 ml-auto">
              Nombre de recettes contenant chaque allergène
            </span>
          </div>
          <div className="flex flex-wrap gap-2">
            {stats.allergenSummary.map(a => (
              <AllergenBadge key={a.name} name={a.name} count={a.count} total={stats.totalRecipes} />
            ))}
          </div>
        </div>
      )}

      {/* ── Category Summary Cards ────────────────────────────────────── */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
        {stats.categoryData.map((cat, i) => (
          <div key={cat.name} className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700 p-4 hover:shadow-md transition-shadow">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[i % COLORS.length] }} />
              <span className="text-sm font-medium text-slate-700 dark:text-slate-300">{cat.name}</span>
            </div>
            <div className="text-lg font-bold text-slate-800 dark:text-slate-100">{cat.count} plat{cat.count > 1 ? 's' : ''}</div>
            <div className="text-sm text-slate-500 dark:text-slate-400">
              Marge moy. :{' '}
              <span className={
                cat.avgMargin >= 70 ? 'text-green-600 font-semibold'
                  : cat.avgMargin >= 60 ? 'text-amber-600 font-semibold'
                  : 'text-red-600 font-semibold'
              }>
                {cat.avgMargin}%
              </span>
            </div>
            <div className="text-xs text-slate-400 dark:text-slate-500 mt-1">
              CA : {cat.revenue.toFixed(0)} &euro;
            </div>
          </div>
        ))}
      </div>

      {/* ── Full Recipes Table ─────────────────────────────────────────── */}
      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700">
        <div className="px-5 py-4 border-b border-slate-100 dark:border-slate-700 flex items-center justify-between">
          <h3 className="font-semibold text-lg text-slate-800 dark:text-slate-100">Détail par plat</h3>
          <span className="text-xs text-slate-400 dark:text-slate-500">Trié par marge croissante</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 dark:bg-slate-700/50 text-slate-600 dark:text-slate-300">
              <tr>
                <th className="px-5 py-3 text-left font-medium">Plat</th>
                <th className="px-5 py-3 text-left font-medium">Catégorie</th>
                <th className="px-5 py-3 text-right font-medium">Prix vente</th>
                <th className="px-5 py-3 text-right font-medium">Coût matière</th>
                <th className="px-5 py-3 text-right font-medium">Coût MO</th>
                <th className="px-5 py-3 text-right font-medium">Coût total</th>
                <th className="px-5 py-3 text-right font-medium">Marge &euro;</th>
                <th className="px-5 py-3 text-right font-medium">Marge %</th>
                <th className="px-5 py-3 text-right font-medium">Coeff.</th>
                <th className="px-5 py-3 text-center font-medium">Fiche</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
              {sortedByMargin.map(r => {
                const mc = r.margin.marginPercent >= 70 ? 'text-green-600' : r.margin.marginPercent >= 60 ? 'text-amber-600' : 'text-red-600';
                const rowBg = r.margin.marginPercent < 60 ? 'bg-red-50/40 dark:bg-red-900/10' : '';
                return (
                  <tr key={r.id} className={`hover:bg-slate-50 dark:hover:bg-slate-700/50 ${rowBg}`}>
                    <td className="px-5 py-3 font-medium text-slate-800 dark:text-slate-200">
                      {r.margin.marginPercent < 50 && <AlertTriangle className="w-3.5 h-3.5 text-red-500 inline mr-1.5 -mt-0.5" />}
                      {r.name}
                    </td>
                    <td className="px-5 py-3 text-slate-500 dark:text-slate-400">{r.category}</td>
                    <td className="px-5 py-3 text-right font-mono text-slate-700 dark:text-slate-300">{r.sellingPrice.toFixed(2)} &euro;</td>
                    <td className="px-5 py-3 text-right font-mono text-slate-700 dark:text-slate-300">{r.margin.costPerPortion.toFixed(2)} &euro;</td>
                    <td className="px-5 py-3 text-right font-mono text-slate-500 dark:text-slate-400">{(r.margin.laborCostPerPortion || 0).toFixed(2)} &euro;</td>
                    <td className="px-5 py-3 text-right font-mono font-medium text-slate-800 dark:text-slate-200">{(r.margin.totalCostPerPortion || r.margin.costPerPortion).toFixed(2)} &euro;</td>
                    <td className="px-5 py-3 text-right font-mono text-slate-700 dark:text-slate-300">{r.margin.marginAmount.toFixed(2)} &euro;</td>
                    <td className={`px-5 py-3 text-right font-mono font-semibold ${mc}`}>{r.margin.marginPercent.toFixed(1)}%</td>
                    <td className="px-5 py-3 text-right font-mono text-slate-700 dark:text-slate-300">{r.margin.coefficient.toFixed(2)}</td>
                    <td className="px-5 py-3 text-center">
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
  );
}
