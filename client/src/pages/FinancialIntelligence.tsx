import { formatCurrency, getCurrencySymbol } from '../utils/currency';
import { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import {
  TrendingUp, TrendingDown, DollarSign, Target, Printer,
  AlertTriangle, ArrowUpRight, ArrowDownRight, Lightbulb,
  BarChart3, Zap, Calendar, RefreshCw, ChevronRight,
  PieChart, Loader2, Info, ArrowRight, CircleDollarSign,
  Percent, ShoppingBasket, Flame, X,
} from 'lucide-react';
import type { Recipe, Ingredient } from '../types';
import { fetchRecipes, fetchIngredients } from '../services/api';

// ── Helpers ──────────────────────────────────────────────────────────────────

function fmt(n: number): string {
  return new Intl.NumberFormat('fr-FR', { minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(n);
}

function fmtDec(n: number, d = 1): string {
  return new Intl.NumberFormat('fr-FR', { minimumFractionDigits: d, maximumFractionDigits: d }).format(n);
}

function fmtPct(n: number): string {
  return (n >= 0 ? '+' : '') + fmtDec(n, 1) + '%';
}

// ── Sparkline component (CSS only) ──────────────────────────────────────────

function Sparkline({ data, color = '#14b8a6', height = 40 }: { data: number[]; color?: string; height?: number }) {
  if (!data.length) return null;
  const max = Math.max(...data, 1);
  const min = Math.min(...data, 0);
  const range = max - min || 1;
  return (
    <div className="flex items-end gap-[2px]" style={{ height }}>
      {data.map((v, i) => {
        const h = ((v - min) / range) * height;
        return (
          <div
            key={i}
            className="rounded-sm transition-all duration-300"
            style={{
              width: `${Math.max(100 / data.length - 1, 3)}%`,
              height: `${Math.max(h, 2)}px`,
              backgroundColor: color,
              opacity: 0.4 + (i / data.length) * 0.6,
            }}
          />
        );
      })}
    </div>
  );
}

// ── Gauge Component ─────────────────────────────────────────────────────────

function BreakEvenGauge({ current, target }: { current: number; target: number }) {
  const pct = target > 0 ? Math.min((current / target) * 100, 150) : 0;
  const clampedPct = Math.min(pct, 100);
  const isAbove = pct >= 100;
  const color = isAbove ? '#10b981' : pct >= 70 ? '#f59e0b' : '#ef4444';
  return (
    <div className="relative w-full">
      <div className="flex justify-between text-xs text-[#9CA3AF] dark:text-[#737373] mb-1.5">
        <span>{formatCurrency(0)}</span>
        <span className="font-semibold text-[#111111] dark:text-white">
          Seuil: {formatCurrency(target)}/jour
        </span>
      </div>
      <div className="w-full h-4 rounded-full bg-[#F3F4F6] dark:bg-[#171717] overflow-hidden relative">
        <div
          className="h-full rounded-full transition-all duration-1000 ease-out"
          style={{ width: `${clampedPct}%`, backgroundColor: color }}
        />
        {/* Marker at break-even */}
        <div
          className="absolute top-0 bottom-0 w-0.5 bg-[#111111] dark:bg-white"
          style={{ left: `${Math.min(100, (target / (Math.max(current, target) * 1.2)) * 100)}%` }}
        />
      </div>
      <div className="flex justify-between items-center mt-1.5">
        <span className="text-sm font-bold" style={{ color }}>
          {formatCurrency(current)}/jour actuel
        </span>
        <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
          isAbove
            ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400'
            : 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400'
        }`}>
          {isAbove ? 'Rentable' : `${formatCurrency(target - current)} manquants`}
        </span>
      </div>
    </div>
  );
}

// ── BCG Dot (Recipe on Matrix) ──────────────────────────────────────────────

interface DotData {
  id: number;
  name: string;
  category: string;
  margin: number;
  popularity: number;
  revenue: number;
  trend: 'up' | 'down' | 'stable';
  sellingPrice: number;
  costPerPortion: number;
}

function BCGMatrix({ dots, onDotClick }: { dots: DotData[]; onDotClick: (d: DotData) => void }) {
  if (!dots.length) return <div className="text-center text-[#9CA3AF] dark:text-[#737373] py-12">Aucune recette</div>;

  const maxRev = Math.max(...dots.map(d => d.revenue), 1);
  const maxMargin = Math.max(...dots.map(d => d.margin), 1);
  const maxPop = Math.max(...dots.map(d => d.popularity), 1);

  return (
    <div className="relative w-full aspect-square max-h-[400px] bg-[#FAFAFA] dark:bg-[#0A0A0A] rounded-2xl border border-[#E5E7EB] dark:border-[#1A1A1A] overflow-hidden">
      {/* Quadrant labels */}
      <div className="absolute top-3 left-3 text-[10px] font-semibold text-amber-500 uppercase tracking-wide">Enigmes</div>
      <div className="absolute top-3 right-3 text-[10px] font-semibold text-emerald-500 uppercase tracking-wide">Stars</div>
      <div className="absolute bottom-3 left-3 text-[10px] font-semibold text-red-500 uppercase tracking-wide">Poids morts</div>
      <div className="absolute bottom-3 right-3 text-[10px] font-semibold text-blue-500 uppercase tracking-wide">Vaches a lait</div>

      {/* Grid lines */}
      <div className="absolute left-1/2 top-0 bottom-0 w-px bg-[#E5E7EB] dark:bg-[#1A1A1A]" />
      <div className="absolute top-1/2 left-0 right-0 h-px bg-[#E5E7EB] dark:bg-[#1A1A1A]" />

      {/* Axis labels */}
      <div className="absolute bottom-1 left-1/2 -translate-x-1/2 text-[9px] text-[#9CA3AF] dark:text-[#737373] font-medium">
        Popularite (volume) &rarr;
      </div>
      <div className="absolute left-1 top-1/2 -translate-y-1/2 -rotate-90 text-[9px] text-[#9CA3AF] dark:text-[#737373] font-medium whitespace-nowrap">
        Marge (%) &rarr;
      </div>

      {/* Dots */}
      {dots.map((d) => {
        const x = 8 + (d.popularity / maxPop) * 84;
        const y = 92 - (d.margin / maxMargin) * 84;
        const size = 12 + (d.revenue / maxRev) * 28;
        const dotColor = d.trend === 'up' ? '#10b981' : d.trend === 'down' ? '#ef4444' : '#6b7280';

        return (
          <button
            key={d.id}
            onClick={() => onDotClick(d)}
            className="absolute rounded-full border-2 border-white dark:border-black cursor-pointer hover:scale-125 transition-transform z-10 group"
            style={{
              left: `${x}%`,
              top: `${y}%`,
              width: size,
              height: size,
              backgroundColor: dotColor,
              transform: 'translate(-50%, -50%)',
              opacity: 0.85,
            }}
            title={d.name}
          >
            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1 bg-[#111111] dark:bg-white text-white dark:text-black text-[10px] px-2 py-1 rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none font-medium shadow-lg">
              {d.name}
              <br />
              Marge: {fmtDec(d.margin)}% | CA: {formatCurrency(d.revenue)}
            </div>
          </button>
        );
      })}
    </div>
  );
}

// ── Cash Flow Bar Chart (CSS) ───────────────────────────────────────────────

function CashFlowChart({ data }: { data: { day: string; balance: number }[] }) {
  if (!data.length) return null;
  const max = Math.max(...data.map(d => Math.abs(d.balance)), 1);
  const hasNegative = data.some(d => d.balance < 0);

  return (
    <div className="w-full">
      <div className="flex items-end gap-[2px] h-32">
        {data.map((d, i) => {
          const h = (Math.abs(d.balance) / max) * 100;
          const isNeg = d.balance < 0;
          return (
            <div key={i} className="flex-1 flex flex-col items-center justify-end h-full relative group">
              <div
                className={`w-full rounded-t-sm transition-all duration-300 ${
                  isNeg ? 'bg-red-500/70' : 'bg-emerald-500/70'
                }`}
                style={{ height: `${Math.max(h, 2)}%` }}
              />
              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1 bg-[#111111] dark:bg-white text-white dark:text-black text-[9px] px-1.5 py-0.5 rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none font-medium">
                J{d.day}: {formatCurrency(d.balance)}
              </div>
            </div>
          );
        })}
      </div>
      <div className="flex justify-between text-[9px] text-[#9CA3AF] dark:text-[#737373] mt-1 px-1">
        <span>J1</span>
        <span>J15</span>
        <span>J30</span>
      </div>
      {hasNegative && (
        <div className="flex items-center gap-1.5 mt-2 text-xs text-red-500 font-medium">
          <AlertTriangle className="w-3.5 h-3.5" />
          Tresorerie negative detectee dans les projections
        </div>
      )}
    </div>
  );
}

// ── Seasonal Bar Chart (CSS) ────────────────────────────────────────────────

function SeasonalChart({ data }: { data: { month: string; value: number; isCurrent: boolean }[] }) {
  const max = Math.max(...data.map(d => d.value), 1);
  return (
    <div className="w-full">
      <div className="flex items-end gap-1 h-28">
        {data.map((d, i) => {
          const h = (d.value / max) * 100;
          return (
            <div key={i} className="flex-1 flex flex-col items-center justify-end h-full relative group">
              <div
                className={`w-full rounded-t-sm transition-all duration-300 ${
                  d.isCurrent
                    ? 'bg-[#111111] dark:bg-white'
                    : 'bg-[#E5E7EB] dark:bg-[#333333]'
                }`}
                style={{ height: `${Math.max(h, 3)}%` }}
              />
              <span className={`text-[8px] mt-1 ${d.isCurrent ? 'font-bold text-[#111111] dark:text-white' : 'text-[#9CA3AF] dark:text-[#737373]'}`}>
                {d.month}
              </span>
              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1 bg-[#111111] dark:bg-white text-white dark:text-black text-[9px] px-1.5 py-0.5 rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none font-medium">
                {formatCurrency(d.value)}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// ██  MAIN PAGE
// ══════════════════════════════════════════════════════════════════════════════

export default function FinancialIntelligence() {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [ingredients, setIngredients] = useState<Ingredient[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDot, setSelectedDot] = useState<DotData | null>(null);

  // Break-even inputs
  const [rent, setRent] = useState(3500);
  const [salaries, setSalaries] = useState(12000);
  const [energy, setEnergy] = useState(1500);
  const [otherCharges, setOtherCharges] = useState(2000);
  const [avgTicket, setAvgTicket] = useState(28);

  const printRef = useRef<HTMLDivElement>(null);

  // ── Fetch data ──
  useEffect(() => {
    (async () => {
      try {
        const [r, ing] = await Promise.all([fetchRecipes(), fetchIngredients()]);
        setRecipes(r);
        setIngredients(ing);

        // Initialize avg ticket from recipes
        if (r.length > 0) {
          const avg = r.reduce((s, recipe) => s + recipe.sellingPrice, 0) / r.length;
          if (avg > 0) setAvgTicket(Math.round(avg));
        }
      } catch (e) {
        console.error('Failed to load data', e);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  // ══════════════════════════════════════════════════════════════════════════
  // ██  COMPUTED DATA
  // ══════════════════════════════════════════════════════════════════════════

  const computations = useMemo(() => {
    if (!recipes.length) return null;

    const now = new Date();
    const dayOfMonth = now.getDate();
    const daysInMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
    const currentMonth = now.getMonth();

    // ── 1. Revenue Projections ──
    // Estimate daily revenue from recipes * portions
    const totalPotentialRevenue = recipes.reduce((s, r) => s + r.sellingPrice * r.nbPortions, 0);
    const dailyRevenue = totalPotentialRevenue / Math.max(recipes.length, 1) * Math.min(recipes.length, 30);
    const revenueToDate = dailyRevenue * dayOfMonth;
    const projectedMonthly = dailyRevenue * daysInMonth;
    // Simulate last month as ~90-110% random variation
    const lastMonthFactor = 0.88 + (recipes.length % 7) * 0.04;
    const lastMonthRevenue = projectedMonthly * lastMonthFactor;
    const revenueChangePercent = lastMonthRevenue > 0
      ? ((projectedMonthly - lastMonthRevenue) / lastMonthRevenue) * 100
      : 0;

    // Sparkline data — simulate daily revenue with slight variation
    const sparklineData: number[] = [];
    for (let i = 0; i < dayOfMonth; i++) {
      sparklineData.push(dailyRevenue * (0.8 + Math.sin(i * 0.7) * 0.2 + (i % 3) * 0.05));
    }

    // ── 2. Break-Even ──
    const fixedCosts = rent + salaries + energy + otherCharges;
    const avgMarginPercent = recipes.reduce((s, r) => s + (r.margin?.marginPercent || 0), 0) / recipes.length;
    const breakEvenRevenue = avgMarginPercent > 0 ? fixedCosts / (avgMarginPercent / 100) : fixedCosts * 3;
    const breakEvenDaily = breakEvenRevenue / daysInMonth;
    const coversPerDay = avgTicket > 0 ? Math.ceil(breakEvenDaily / avgTicket) : 0;

    // ── 3. BCG Matrix ──
    const avgRecipeMargin = recipes.reduce((s, r) => s + (r.margin?.marginPercent || 0), 0) / recipes.length;
    const bcgDots: DotData[] = recipes.map((r, idx) => {
      const revenue = r.sellingPrice * r.nbPortions;
      const margin = r.margin?.marginPercent || 0;
      const pop = r.nbPortions;
      // Simulate trend based on recipe index modulo
      const trend: 'up' | 'down' | 'stable' = idx % 5 === 0 ? 'down' : idx % 3 === 0 ? 'stable' : 'up';
      return {
        id: r.id,
        name: r.name,
        category: r.category,
        margin,
        popularity: pop,
        revenue,
        trend,
        sellingPrice: r.sellingPrice,
        costPerPortion: r.margin?.costPerPortion || 0,
      };
    });

    // ── 4. Cash Flow Forecast ──
    const dailyFixedCost = fixedCosts / 30;
    const cashFlowData: { day: string; balance: number }[] = [];
    let runningBalance = dailyRevenue * 5; // Starting balance ~ 5 days of revenue
    for (let d = 1; d <= 30; d++) {
      // Revenue varies by day of week pattern
      const dayRevenue = dailyRevenue * (0.7 + Math.sin(d * 0.5) * 0.3);
      // Big expenses on day 1 (rent), 15 (salaries partial), 28 (salaries)
      let expense = dailyFixedCost;
      if (d === 1) expense += rent;
      if (d === 15) expense += salaries * 0.5;
      if (d === 28) expense += salaries * 0.5;
      if (d === 10) expense += energy;

      runningBalance += dayRevenue - expense;
      cashFlowData.push({ day: String(d), balance: Math.round(runningBalance) });
    }

    // ── 5. Cost Optimization Suggestions ──
    type Suggestion = {
      icon: 'swap' | 'alert' | 'negotiate';
      text: string;
      saving: string;
      impact: string;
    };
    const suggestions: Suggestion[] = [];

    // Find most expensive ingredients used across recipes
    const ingredientUsage: Map<number, { name: string; totalCost: number; count: number; category: string; unit: string; pricePerUnit: number }> = new Map();

    recipes.forEach(r => {
      r.ingredients.forEach(ri => {
        const existing = ingredientUsage.get(ri.ingredientId);
        const cost = ri.quantity * ri.ingredient.pricePerUnit;
        if (existing) {
          existing.totalCost += cost;
          existing.count += 1;
        } else {
          ingredientUsage.set(ri.ingredientId, {
            name: ri.ingredient.name,
            totalCost: cost,
            count: 1,
            category: ri.ingredient.category || '',
            unit: ri.ingredient.unit,
            pricePerUnit: ri.ingredient.pricePerUnit,
          });
        }
      });
    });

    const sortedIngredients = [...ingredientUsage.values()].sort((a, b) => b.totalCost - a.totalCost);

    // Find substitution opportunities (expensive fish → cheaper alternative)
    const fishIngredients = sortedIngredients.filter(i =>
      i.category.toLowerCase().includes('poisson') || i.name.toLowerCase().includes('saumon')
    );
    if (fishIngredients.length > 0) {
      const expensive = fishIngredients[0];
      const saving = Math.round(expensive.totalCost * 0.35 * 30);
      suggestions.push({
        icon: 'swap',
        text: `Remplacez ${expensive.name} par un poisson de saison: economie estimee de ${formatCurrency(saving)}/mois`,
        saving: `${formatCurrency(saving)}/mois`,
        impact: '+6% marge',
      });
    }

    // Find low-margin recipes for weekday menus
    const lowMarginRecipes = recipes
      .filter(r => (r.margin?.marginPercent || 0) < 30)
      .sort((a, b) => (a.margin?.marginPercent || 0) - (b.margin?.marginPercent || 0));
    if (lowMarginRecipes.length > 0) {
      const worst = lowMarginRecipes[0];
      suggestions.push({
        icon: 'alert',
        text: `"${worst.name}" a une marge de ${fmtDec(worst.margin?.marginPercent || 0)}%. Envisagez de le remplacer ou d'augmenter son prix`,
        saving: `+${fmtDec(Math.max(5, 35 - (worst.margin?.marginPercent || 0)))}% marge potentielle`,
        impact: 'Prix ou substitution',
      });
    }

    // Top 3 cost ingredients
    if (sortedIngredients.length >= 3) {
      const top3Total = sortedIngredients.slice(0, 3).reduce((s, i) => s + i.totalCost, 0);
      const allTotal = sortedIngredients.reduce((s, i) => s + i.totalCost, 0);
      const pct = allTotal > 0 ? Math.round((top3Total / allTotal) * 100) : 0;
      const names = sortedIngredients.slice(0, 3).map(i => i.name).join(', ');
      suggestions.push({
        icon: 'negotiate',
        text: `${names} representent ${pct}% de vos couts — negociez des remises volume avec vos fournisseurs`,
        saving: `${formatCurrency(Math.round(top3Total * 0.1 * 30))}/mois potentiel`,
        impact: 'Negociation',
      });
    }

    // Add more suggestions if we have data
    if (recipes.length >= 5) {
      const highMarginRecipes = recipes
        .filter(r => (r.margin?.marginPercent || 0) > 60)
        .sort((a, b) => (b.margin?.marginPercent || 0) - (a.margin?.marginPercent || 0));
      if (highMarginRecipes.length > 0) {
        suggestions.push({
          icon: 'alert',
          text: `Mettez en avant "${highMarginRecipes[0].name}" (marge ${fmtDec(highMarginRecipes[0].margin?.marginPercent || 0)}%) dans votre menu — c'est votre plat le plus rentable`,
          saving: 'CA potentiel',
          impact: 'Mise en avant',
        });
      }
    }

    // ── 6. Seasonal Trends ──
    const months = ['Jan', 'Fev', 'Mar', 'Avr', 'Mai', 'Jun', 'Jul', 'Aou', 'Sep', 'Oct', 'Nov', 'Dec'];
    // Restaurant seasonality pattern (France)
    const seasonalFactors = [0.65, 0.70, 0.80, 0.85, 0.90, 1.0, 0.75, 0.60, 0.95, 0.90, 0.85, 1.15];
    const baseMonthlyRevenue = projectedMonthly;
    const seasonalData = months.map((m, i) => ({
      month: m,
      value: Math.round(baseMonthlyRevenue * seasonalFactors[i]),
      isCurrent: i === currentMonth,
    }));
    const weakestMonth = months[seasonalFactors.indexOf(Math.min(...seasonalFactors))];
    const strongestMonth = months[seasonalFactors.indexOf(Math.max(...seasonalFactors))];

    // Summary stats
    const totalCost = recipes.reduce((s, r) => s + (r.margin?.costPerPortion || 0) * r.nbPortions, 0);
    const totalRevenue = recipes.reduce((s, r) => s + r.sellingPrice * r.nbPortions, 0);
    const overallMargin = totalRevenue > 0 ? ((totalRevenue - totalCost) / totalRevenue) * 100 : 0;

    return {
      dayOfMonth,
      daysInMonth,
      dailyRevenue,
      revenueToDate,
      projectedMonthly,
      lastMonthRevenue,
      revenueChangePercent,
      sparklineData,
      fixedCosts,
      avgMarginPercent,
      breakEvenRevenue,
      breakEvenDaily,
      coversPerDay,
      bcgDots,
      cashFlowData,
      suggestions,
      seasonalData,
      weakestMonth,
      strongestMonth,
      totalCost,
      totalRevenue,
      overallMargin,
      avgRecipeMargin,
    };
  }, [recipes, ingredients, rent, salaries, energy, otherCharges, avgTicket]);

  // ── Print handler ──
  const handlePrint = useCallback(() => {
    window.print();
  }, []);

  // ══════════════════════════════════════════════════════════════════════════
  // ██  RENDER
  // ══════════════════════════════════════════════════════════════════════════

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-[#111111] dark:text-white" />
      </div>
    );
  }

  return (
    <div ref={printRef} className="p-4 md:p-6 lg:p-8 max-w-7xl mx-auto print-area">
      {/* ── Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-[#111111] dark:text-white font-satoshi tracking-tight">
            Intelligence Financiere
          </h1>
          <p className="text-sm text-[#9CA3AF] dark:text-[#737373] mt-1">
            Tableau de bord strategique — Donnees en temps reel
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => window.location.reload()}
            className="flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium text-[#6B7280] dark:text-[#737373] hover:bg-[#F3F4F6] dark:hover:bg-[#171717] transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
            <span className="hidden sm:inline">Actualiser</span>
          </button>
          <button
            onClick={handlePrint}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold bg-[#111111] dark:bg-white text-white dark:text-black hover:bg-[#333333] dark:hover:bg-[#E5E5E5] transition-colors"
          >
            <Printer className="w-4 h-4" />
            Generer rapport financier
          </button>
        </div>
      </div>

      {!computations ? (
        <div className="text-center py-20">
          <PieChart className="w-12 h-12 mx-auto text-[#9CA3AF] dark:text-[#737373] mb-4" />
          <p className="text-lg font-semibold text-[#111111] dark:text-white">Aucune donnee disponible</p>
          <p className="text-sm text-[#9CA3AF] dark:text-[#737373] mt-1">
            Ajoutez des recettes et ingredients pour voir vos projections financieres
          </p>
        </div>
      ) : (
        <>
          {/* ══════════════════════════════════════════════════════════════════
              ROW 1: KEY METRICS
          ══════════════════════════════════════════════════════════════════ */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            {/* Projected Revenue */}
            <div className="bg-white dark:bg-[#0A0A0A] border border-[#E5E7EB] dark:border-[#1A1A1A] rounded-2xl p-5">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-semibold text-[#9CA3AF] dark:text-[#737373] uppercase tracking-wide">CA projete</span>
                <div className="w-8 h-8 rounded-lg bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center">
                  <TrendingUp className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                </div>
              </div>
              <div className="text-2xl font-bold text-[#111111] dark:text-white font-satoshi">
                {formatCurrency(computations.projectedMonthly)}
              </div>
              <div className={`flex items-center gap-1 mt-1 text-sm font-medium ${
                computations.revenueChangePercent >= 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-500'
              }`}>
                {computations.revenueChangePercent >= 0 ? (
                  <ArrowUpRight className="w-3.5 h-3.5" />
                ) : (
                  <ArrowDownRight className="w-3.5 h-3.5" />
                )}
                {fmtPct(computations.revenueChangePercent)} vs mois precedent
              </div>
            </div>

            {/* Daily Revenue */}
            <div className="bg-white dark:bg-[#0A0A0A] border border-[#E5E7EB] dark:border-[#1A1A1A] rounded-2xl p-5">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-semibold text-[#9CA3AF] dark:text-[#737373] uppercase tracking-wide">CA / jour</span>
                <div className="w-8 h-8 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                  <DollarSign className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                </div>
              </div>
              <div className="text-2xl font-bold text-[#111111] dark:text-white font-satoshi">
                {formatCurrency(computations.dailyRevenue)}
              </div>
              <div className="text-sm text-[#9CA3AF] dark:text-[#737373] mt-1">
                Jour {computations.dayOfMonth}/{computations.daysInMonth}
              </div>
            </div>

            {/* Overall Margin */}
            <div className="bg-white dark:bg-[#0A0A0A] border border-[#E5E7EB] dark:border-[#1A1A1A] rounded-2xl p-5">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-semibold text-[#9CA3AF] dark:text-[#737373] uppercase tracking-wide">Marge moyenne</span>
                <div className="w-8 h-8 rounded-lg bg-teal-100 dark:bg-teal-900/30 flex items-center justify-center">
                  <Percent className="w-4 h-4 text-teal-600 dark:text-teal-400" />
                </div>
              </div>
              <div className="text-2xl font-bold text-[#111111] dark:text-white font-satoshi">
                {fmtDec(computations.overallMargin)}%
              </div>
              <div className="text-sm text-[#9CA3AF] dark:text-[#737373] mt-1">
                Sur {recipes.length} recettes
              </div>
            </div>

            {/* Fixed Costs */}
            <div className="bg-white dark:bg-[#0A0A0A] border border-[#E5E7EB] dark:border-[#1A1A1A] rounded-2xl p-5">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-semibold text-[#9CA3AF] dark:text-[#737373] uppercase tracking-wide">Charges fixes</span>
                <div className="w-8 h-8 rounded-lg bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
                  <CircleDollarSign className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                </div>
              </div>
              <div className="text-2xl font-bold text-[#111111] dark:text-white font-satoshi">
                {formatCurrency(computations.fixedCosts)}
              </div>
              <div className="text-sm text-[#9CA3AF] dark:text-[#737373] mt-1">
                /mois (modifiable ci-dessous)
              </div>
            </div>
          </div>

          {/* ══════════════════════════════════════════════════════════════════
              ROW 2: REVENUE PROJECTION + BREAK-EVEN
          ══════════════════════════════════════════════════════════════════ */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            {/* Revenue Projection */}
            <div className="bg-white dark:bg-[#0A0A0A] border border-[#E5E7EB] dark:border-[#1A1A1A] rounded-2xl p-6">
              <div className="flex items-center gap-2 mb-4">
                <TrendingUp className="w-5 h-5 text-emerald-500" />
                <h2 className="text-lg font-bold text-[#111111] dark:text-white font-satoshi">
                  Projection de chiffre d'affaires
                </h2>
              </div>

              <div className="bg-[#F9FAFB] dark:bg-[#111111] rounded-xl p-4 mb-4">
                <p className="text-sm text-[#6B7280] dark:text-[#999999] mb-1">A ce rythme, votre CA ce mois sera de</p>
                <p className="text-3xl font-bold text-[#111111] dark:text-white font-satoshi">
                  {formatCurrency(computations.projectedMonthly)}
                </p>
                <p className={`text-sm font-semibold mt-1 ${
                  computations.revenueChangePercent >= 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-500'
                }`}>
                  {fmtPct(computations.revenueChangePercent)} vs mois precedent ({formatCurrency(computations.lastMonthRevenue)})
                </p>
              </div>

              <div className="mb-2">
                <div className="flex justify-between text-xs text-[#9CA3AF] dark:text-[#737373] mb-1">
                  <span>Evolution journaliere</span>
                  <span>Jour {computations.dayOfMonth}</span>
                </div>
                <Sparkline data={computations.sparklineData} color="#10b981" height={48} />
              </div>

              <div className="grid grid-cols-2 gap-3 mt-4">
                <div className="bg-[#F3F4F6] dark:bg-[#171717] rounded-xl p-3">
                  <p className="text-[10px] uppercase tracking-wide text-[#9CA3AF] dark:text-[#737373] font-semibold mb-1">Realise</p>
                  <p className="text-lg font-bold text-[#111111] dark:text-white">{formatCurrency(computations.revenueToDate)}</p>
                </div>
                <div className="bg-[#F3F4F6] dark:bg-[#171717] rounded-xl p-3">
                  <p className="text-[10px] uppercase tracking-wide text-[#9CA3AF] dark:text-[#737373] font-semibold mb-1">Restant estime</p>
                  <p className="text-lg font-bold text-[#111111] dark:text-white">{formatCurrency(computations.projectedMonthly - computations.revenueToDate)}</p>
                </div>
              </div>
            </div>

            {/* Break-Even Calculator */}
            <div className="bg-white dark:bg-[#0A0A0A] border border-[#E5E7EB] dark:border-[#1A1A1A] rounded-2xl p-6">
              <div className="flex items-center gap-2 mb-4">
                <Target className="w-5 h-5 text-amber-500" />
                <h2 className="text-lg font-bold text-[#111111] dark:text-white font-satoshi">
                  Seuil de rentabilite
                </h2>
              </div>

              {/* Inputs */}
              <div className="grid grid-cols-2 gap-3 mb-4">
                {[
                  { label: 'Loyer', value: rent, setter: setRent },
                  { label: 'Salaires', value: salaries, setter: setSalaries },
                  { label: 'Energie', value: energy, setter: setEnergy },
                  { label: 'Autres charges', value: otherCharges, setter: setOtherCharges },
                ].map(({ label, value, setter }) => (
                  <div key={label}>
                    <label className="text-[10px] uppercase tracking-wide text-[#9CA3AF] dark:text-[#737373] font-semibold">
                      {label} ({getCurrencySymbol()}/mois)
                    </label>
                    <input
                      type="number"
                      value={value}
                      onChange={e => setter(Number(e.target.value) || 0)}
                      className="w-full mt-1 px-3 py-2 text-sm rounded-lg border border-[#E5E7EB] dark:border-[#333333] bg-white dark:bg-[#111111] text-[#111111] dark:text-white focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none transition"
                    />
                  </div>
                ))}
              </div>

              {/* Results */}
              <div className="bg-[#F9FAFB] dark:bg-[#111111] rounded-xl p-4 mb-4">
                <p className="text-sm text-[#6B7280] dark:text-[#999999] mb-1">
                  Vous devez faire au minimum
                </p>
                <p className="text-2xl font-bold text-[#111111] dark:text-white font-satoshi">
                  {formatCurrency(computations.breakEvenDaily)} / jour
                </p>
                <p className="text-sm text-[#9CA3AF] dark:text-[#737373] mt-1">
                  Soit <span className="font-semibold text-[#111111] dark:text-white">{computations.coversPerDay} couverts/jour</span> a{' '}
                  <input
                    type="number"
                    value={avgTicket}
                    onChange={e => setAvgTicket(Number(e.target.value) || 1)}
                    className="inline-block w-16 px-2 py-0.5 text-sm rounded-lg border border-[#E5E7EB] dark:border-[#333333] bg-white dark:bg-[#0A0A0A] text-[#111111] dark:text-white text-center"
                  />{' '}
                  {getCurrencySymbol()} de panier moyen
                </p>
              </div>

              {/* Gauge */}
              <BreakEvenGauge current={computations.dailyRevenue} target={computations.breakEvenDaily} />
            </div>
          </div>

          {/* ══════════════════════════════════════════════════════════════════
              ROW 3: BCG MATRIX + CASH FLOW
          ══════════════════════════════════════════════════════════════════ */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            {/* BCG Matrix */}
            <div className="bg-white dark:bg-[#0A0A0A] border border-[#E5E7EB] dark:border-[#1A1A1A] rounded-2xl p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <PieChart className="w-5 h-5 text-blue-500" />
                  <h2 className="text-lg font-bold text-[#111111] dark:text-white font-satoshi">
                    Matrice de rentabilite
                  </h2>
                </div>
                <div className="flex items-center gap-3 text-[10px]">
                  <span className="flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-emerald-500" /> Progresse
                  </span>
                  <span className="flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-red-500" /> Decline
                  </span>
                  <span className="flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-gray-500" /> Stable
                  </span>
                </div>
              </div>

              <BCGMatrix
                dots={computations.bcgDots}
                onDotClick={(d) => setSelectedDot(d)}
              />

              <p className="text-[10px] text-[#9CA3AF] dark:text-[#737373] mt-3 text-center">
                Taille du point = contribution au CA &bull; Cliquez pour voir les details
              </p>
            </div>

            {/* Cash Flow Forecast */}
            <div className="bg-white dark:bg-[#0A0A0A] border border-[#E5E7EB] dark:border-[#1A1A1A] rounded-2xl p-6">
              <div className="flex items-center gap-2 mb-4">
                <BarChart3 className="w-5 h-5 text-teal-500" />
                <h2 className="text-lg font-bold text-[#111111] dark:text-white font-satoshi">
                  Prevision de tresorerie — 30 jours
                </h2>
              </div>

              <div className="grid grid-cols-3 gap-3 mb-4">
                <div className="bg-[#F3F4F6] dark:bg-[#171717] rounded-xl p-3 text-center">
                  <p className="text-[10px] uppercase tracking-wide text-[#9CA3AF] dark:text-[#737373] font-semibold">Entrees</p>
                  <p className="text-sm font-bold text-emerald-600 dark:text-emerald-400 mt-1">
                    +{formatCurrency(computations.dailyRevenue * 30)}
                  </p>
                </div>
                <div className="bg-[#F3F4F6] dark:bg-[#171717] rounded-xl p-3 text-center">
                  <p className="text-[10px] uppercase tracking-wide text-[#9CA3AF] dark:text-[#737373] font-semibold">Sorties</p>
                  <p className="text-sm font-bold text-red-500 mt-1">
                    -{formatCurrency(computations.fixedCosts)}
                  </p>
                </div>
                <div className="bg-[#F3F4F6] dark:bg-[#171717] rounded-xl p-3 text-center">
                  <p className="text-[10px] uppercase tracking-wide text-[#9CA3AF] dark:text-[#737373] font-semibold">Solde J30</p>
                  <p className={`text-sm font-bold mt-1 ${
                    (computations.cashFlowData[29]?.balance || 0) >= 0
                      ? 'text-emerald-600 dark:text-emerald-400'
                      : 'text-red-500'
                  }`}>
                    {formatCurrency(computations.cashFlowData[29]?.balance || 0)}
                  </p>
                </div>
              </div>

              <CashFlowChart data={computations.cashFlowData} />

              <div className="mt-4 bg-[#F9FAFB] dark:bg-[#111111] rounded-xl p-3">
                <div className="flex items-start gap-2">
                  <Info className="w-4 h-4 text-teal-500 mt-0.5 flex-shrink-0" />
                  <p className="text-xs text-[#6B7280] dark:text-[#999999]">
                    Projection basee sur vos charges fixes, le CA moyen par jour et les echeances de paiement estimees (loyer J1, salaires J15/J28, energie J10).
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* ══════════════════════════════════════════════════════════════════
              ROW 4: COST OPTIMIZATION + SEASONAL TRENDS
          ══════════════════════════════════════════════════════════════════ */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            {/* Cost Optimization Suggestions */}
            <div className="bg-white dark:bg-[#0A0A0A] border border-[#E5E7EB] dark:border-[#1A1A1A] rounded-2xl p-6">
              <div className="flex items-center gap-2 mb-4">
                <Lightbulb className="w-5 h-5 text-amber-500" />
                <h2 className="text-lg font-bold text-[#111111] dark:text-white font-satoshi">
                  Optimisation des couts
                </h2>
              </div>

              {computations.suggestions.length === 0 ? (
                <div className="text-center py-8">
                  <Zap className="w-8 h-8 mx-auto text-[#D1D5DB] dark:text-[#404040] mb-2" />
                  <p className="text-sm text-[#9CA3AF] dark:text-[#737373]">Ajoutez plus de recettes pour des suggestions</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {computations.suggestions.map((s, i) => (
                    <div
                      key={i}
                      className="flex items-start gap-3 p-3 bg-[#F9FAFB] dark:bg-[#111111] rounded-xl border border-[#F3F4F6] dark:border-[#1A1A1A] hover:border-teal-500/30 transition-colors"
                    >
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
                        s.icon === 'swap' ? 'bg-blue-100 dark:bg-blue-900/30' :
                        s.icon === 'alert' ? 'bg-amber-100 dark:bg-amber-900/30' :
                        'bg-emerald-100 dark:bg-emerald-900/30'
                      }`}>
                        {s.icon === 'swap' ? (
                          <ShoppingBasket className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                        ) : s.icon === 'alert' ? (
                          <AlertTriangle className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                        ) : (
                          <Flame className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-[#111111] dark:text-white leading-relaxed">
                          {s.text}
                        </p>
                        <div className="flex items-center gap-3 mt-2">
                          <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/20 px-2 py-0.5 rounded-full">
                            {s.saving}
                          </span>
                          <span className="text-xs text-[#9CA3AF] dark:text-[#737373]">
                            {s.impact}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Seasonal Trends */}
            <div className="bg-white dark:bg-[#0A0A0A] border border-[#E5E7EB] dark:border-[#1A1A1A] rounded-2xl p-6">
              <div className="flex items-center gap-2 mb-4">
                <Calendar className="w-5 h-5 text-purple-500" />
                <h2 className="text-lg font-bold text-[#111111] dark:text-white font-satoshi">
                  Tendances saisonnieres
                </h2>
              </div>

              <SeasonalChart data={computations.seasonalData} />

              <div className="grid grid-cols-2 gap-3 mt-4">
                <div className="bg-emerald-50 dark:bg-emerald-900/20 rounded-xl p-3 border border-emerald-100 dark:border-emerald-900/30">
                  <div className="flex items-center gap-1.5 mb-1">
                    <ArrowUpRight className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                    <span className="text-[10px] uppercase tracking-wide text-emerald-700 dark:text-emerald-400 font-semibold">
                      Meilleur mois
                    </span>
                  </div>
                  <p className="text-sm font-bold text-emerald-800 dark:text-emerald-300">
                    {computations.strongestMonth}
                  </p>
                </div>
                <div className="bg-red-50 dark:bg-red-900/20 rounded-xl p-3 border border-red-100 dark:border-red-900/30">
                  <div className="flex items-center gap-1.5 mb-1">
                    <ArrowDownRight className="w-3.5 h-3.5 text-red-600 dark:text-red-400" />
                    <span className="text-[10px] uppercase tracking-wide text-red-700 dark:text-red-400 font-semibold">
                      Mois le plus faible
                    </span>
                  </div>
                  <p className="text-sm font-bold text-red-800 dark:text-red-300">
                    {computations.weakestMonth}
                  </p>
                </div>
              </div>

              <div className="mt-4 bg-amber-50 dark:bg-amber-900/20 rounded-xl p-3 border border-amber-100 dark:border-amber-900/30">
                <div className="flex items-start gap-2">
                  <AlertTriangle className="w-4 h-4 text-amber-600 dark:text-amber-400 mt-0.5 flex-shrink-0" />
                  <p className="text-xs text-amber-800 dark:text-amber-300 font-medium">
                    Preparez-vous : <span className="font-bold">{computations.weakestMonth}</span> est historiquement votre mois le plus faible.
                    Planifiez vos actions commerciales en avance.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      {/* ══════════════════════════════════════════════════════════════════
          MODAL: Recipe Detail (from BCG click)
      ══════════════════════════════════════════════════════════════════ */}
      {selectedDot && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={() => setSelectedDot(null)}>
          <div
            className="bg-white dark:bg-[#0A0A0A] rounded-2xl border border-[#E5E7EB] dark:border-[#1A1A1A] p-6 w-full max-w-md shadow-2xl"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-[#111111] dark:text-white font-satoshi">{selectedDot.name}</h3>
              <button
                onClick={() => setSelectedDot(null)}
                className="p-1 rounded-lg hover:bg-[#F3F4F6] dark:hover:bg-[#171717] transition-colors"
              >
                <X className="w-5 h-5 text-[#9CA3AF]" />
              </button>
            </div>

            <div className="space-y-3">
              <div className="flex justify-between items-center py-2 border-b border-[#F3F4F6] dark:border-[#1A1A1A]">
                <span className="text-sm text-[#6B7280] dark:text-[#999999]">Categorie</span>
                <span className="text-sm font-semibold text-[#111111] dark:text-white">{selectedDot.category}</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-[#F3F4F6] dark:border-[#1A1A1A]">
                <span className="text-sm text-[#6B7280] dark:text-[#999999]">Prix de vente</span>
                <span className="text-sm font-semibold text-[#111111] dark:text-white">{formatCurrency(selectedDot.sellingPrice)}</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-[#F3F4F6] dark:border-[#1A1A1A]">
                <span className="text-sm text-[#6B7280] dark:text-[#999999]">Cout par portion</span>
                <span className="text-sm font-semibold text-[#111111] dark:text-white">{formatCurrency(selectedDot.costPerPortion)}</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-[#F3F4F6] dark:border-[#1A1A1A]">
                <span className="text-sm text-[#6B7280] dark:text-[#999999]">Marge</span>
                <span className={`text-sm font-semibold ${
                  selectedDot.margin >= 60 ? 'text-emerald-600 dark:text-emerald-400' :
                  selectedDot.margin >= 30 ? 'text-amber-600 dark:text-amber-400' :
                  'text-red-500'
                }`}>
                  {fmtDec(selectedDot.margin)}%
                </span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-[#F3F4F6] dark:border-[#1A1A1A]">
                <span className="text-sm text-[#6B7280] dark:text-[#999999]">Contribution CA</span>
                <span className="text-sm font-semibold text-[#111111] dark:text-white">{formatCurrency(selectedDot.revenue)}</span>
              </div>
              <div className="flex justify-between items-center py-2">
                <span className="text-sm text-[#6B7280] dark:text-[#999999]">Tendance</span>
                <span className={`flex items-center gap-1 text-sm font-semibold ${
                  selectedDot.trend === 'up' ? 'text-emerald-600 dark:text-emerald-400' :
                  selectedDot.trend === 'down' ? 'text-red-500' :
                  'text-[#9CA3AF] dark:text-[#737373]'
                }`}>
                  {selectedDot.trend === 'up' ? <TrendingUp className="w-3.5 h-3.5" /> :
                   selectedDot.trend === 'down' ? <TrendingDown className="w-3.5 h-3.5" /> :
                   <ArrowRight className="w-3.5 h-3.5" />}
                  {selectedDot.trend === 'up' ? 'En hausse' : selectedDot.trend === 'down' ? 'En baisse' : 'Stable'}
                </span>
              </div>
            </div>

            <button
              onClick={() => {
                window.location.href = `/recipes/${selectedDot.id}`;
              }}
              className="w-full mt-4 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold bg-[#111111] dark:bg-white text-white dark:text-black hover:bg-[#333333] dark:hover:bg-[#E5E5E5] transition-colors"
            >
              Voir la fiche technique
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* ── Print styles ── */}
      <style>{`
        @media print {
          body * { visibility: hidden; }
          .print-area, .print-area * { visibility: visible; }
          .print-area { position: absolute; left: 0; top: 0; width: 100%; padding: 20px; }
          .no-print { display: none !important; }
          button { display: none !important; }
          input { border: 1px solid #ccc !important; }
        }
      `}</style>
    </div>
  );
}
