import { useState, useEffect, useRef, useCallback } from 'react';
import {
  BarChart3, TrendingUp, DollarSign, ChefHat,
  AlertTriangle, ArrowUpRight, ArrowDownRight,
  Target, Package, Trash2, Clock, Star, Minus,
  Printer, RefreshCw,
} from 'lucide-react';
import {
  LineChart, Line, BarChart, Bar, AreaChart, Area,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell,
} from 'recharts';
import { useTranslation } from '../hooks/useTranslation';
import { useRestaurant } from '../hooks/useRestaurant';
import { getToken } from '../services/api';

const API_BASE = import.meta.env.VITE_API_URL || '/api';

// ── Types ──
interface AnalyticsReport {
  generatedAt: string;
  periodDays: number;
  periodStart: string;
  periodEnd: string;
  summary: {
    totalRecipes: number;
    totalIngredients: number;
    avgMarginPercent: number;
    avgFoodCost: number;
    totalRevenuePotential: number;
    totalCostPotential: number;
    newRecipesThisPeriod: number;
    newRecipesPrevPeriod: number;
  };
  performanceScore: number;
  topProfitable: RecipeSummary[];
  bottomMargin: RecipeSummary[];
  ingredientTrends: IngredientTrend[];
  categoryPerformance: CategoryPerf[];
  laborAnalysis: LaborAnalysis | null;
  wasteImpact: WasteImpact;
  marginTimeline: TimelinePoint[];
}

interface RecipeSummary {
  id: number;
  name: string;
  category: string;
  sellingPrice: number;
  marginAmount: number;
  marginPercent: number;
  foodCost: number;
}

interface IngredientTrend {
  ingredientId: number;
  name: string;
  category: string;
  oldPrice: number;
  newPrice: number;
  changePercent: number;
}

interface CategoryPerf {
  category: string;
  recipeCount: number;
  avgMargin: number;
  totalRevenue: number;
  totalCost: number;
  avgMarginPercent: number;
}

interface LaborAnalysis {
  totalHours: number;
  totalCost: number;
  avgCostPerHour: number;
  entryCount: number;
}

interface WasteImpact {
  totalCost: number;
  entryCount: number;
  byReason: { reason: string; count: number; cost: number }[];
  topWastedIngredients: { name: string; cost: number; count: number }[];
}

interface TimelinePoint {
  date: string;
  avgMargin: number;
  avgCost: number;
  recipeCount: number;
}

// ── Period options ──
const PERIODS = [
  { label: '7j', value: 7 },
  { label: '30j', value: 30 },
  { label: '90j', value: 90 },
  { label: '1 an', value: 365 },
];

// ── Monochrome colors ──
const MONO_COLORS = ['#000000', '#404040', '#737373', '#A3A3A3', '#D4D4D4'];
const MONO_DARK = ['#FFFFFF', '#D4D4D4', '#A3A3A3', '#737373', '#525252'];

// ── Sparkline component ──
function Sparkline({ data, dataKey, color, width = 80, height = 24 }: {
  data: { value: number }[];
  dataKey: string;
  color: string;
  width?: number;
  height?: number;
}) {
  return (
    <ResponsiveContainer width={width} height={height}>
      <LineChart data={data}>
        <Line type="monotone" dataKey={dataKey} stroke={color} strokeWidth={1.5} dot={false} />
      </LineChart>
    </ResponsiveContainer>
  );
}

// ── Score ring ──
function ScoreRing({ score, size = 160 }: { score: number; size?: number }) {
  const radius = (size - 16) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;
  const getColor = () => {
    if (score >= 75) return '#000000';
    if (score >= 50) return '#525252';
    if (score >= 25) return '#737373';
    return '#A3A3A3';
  };
  const getDarkColor = () => {
    if (score >= 75) return '#FFFFFF';
    if (score >= 50) return '#D4D4D4';
    if (score >= 25) return '#A3A3A3';
    return '#737373';
  };
  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="transform -rotate-90">
        <circle
          cx={size / 2} cy={size / 2} r={radius}
          fill="none" stroke="#E5E7EB" strokeWidth="8"
          className="dark:stroke-[#262626]"
        />
        <circle
          cx={size / 2} cy={size / 2} r={radius}
          fill="none" strokeWidth="8" strokeLinecap="round"
          stroke={getColor()}
          className="dark:stroke-white"
          style={{
            strokeDasharray: circumference,
            strokeDashoffset: offset,
            transition: 'stroke-dashoffset 1s ease-out',
          }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-3xl font-bold text-[#111111] dark:text-white">{score}</span>
        <span className="text-xs text-[#6B7280] dark:text-[#A3A3A3]">/100</span>
      </div>
    </div>
  );
}

// ── Change indicator ──
function ChangeIndicator({ value, suffix = '%' }: { value: number; suffix?: string }) {
  if (value === 0) return <span className="flex items-center gap-1 text-xs text-[#6B7280] dark:text-[#A3A3A3]"><Minus className="w-3 h-3" /> 0{suffix}</span>;
  if (value > 0) return <span className="flex items-center gap-1 text-xs text-[#111111] dark:text-white font-medium"><ArrowUpRight className="w-3 h-3" /> +{value.toFixed(1)}{suffix}</span>;
  return <span className="flex items-center gap-1 text-xs text-[#6B7280] dark:text-[#737373]"><ArrowDownRight className="w-3 h-3" /> {value.toFixed(1)}{suffix}</span>;
}

// ── Waste reason labels ──
const WASTE_LABELS: Record<string, string> = {
  expired: 'Perime',
  spoiled: 'Avarie',
  overproduction: 'Surproduction',
  damaged: 'Endommage',
  other: 'Autre',
};

export default function Analytics() {
  const { t } = useTranslation();
  const { selectedRestaurant } = useRestaurant();
  const [period, setPeriod] = useState(30);
  const [report, setReport] = useState<AnalyticsReport | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [compareMode, setCompareMode] = useState(false);
  const [prevReport, setPrevReport] = useState<AnalyticsReport | null>(null);
  const printRef = useRef<HTMLDivElement>(null);

  const fetchReport = useCallback(async (days: number) => {
    setLoading(true);
    setError('');
    try {
      const token = getToken();
      const restaurantId = selectedRestaurant?.id;
      if (!token || !restaurantId) return;
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
        'X-Restaurant-Id': String(restaurantId),
      };
      const res = await fetch(`${API_BASE}/analytics/report?period=${days}`, { headers });
      if (!res.ok) throw new Error('Erreur serveur');
      const data = await res.json();
      setReport(data);

      // If compare mode, also fetch previous period
      if (compareMode) {
        const prevRes = await fetch(`${API_BASE}/analytics/report?period=${days * 2}`, { headers });
        if (prevRes.ok) {
          setPrevReport(await prevRes.json());
        }
      }
    } catch (e: any) {
      setError(e.message || 'Erreur chargement rapport');
    } finally {
      setLoading(false);
    }
  }, [selectedRestaurant, compareMode]);

  useEffect(() => {
    if (selectedRestaurant) fetchReport(period);
  }, [period, selectedRestaurant, fetchReport]);

  // ── PDF Export (print-based) ──
  const handleExportPDF = () => {
    window.print();
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <RefreshCw className="w-8 h-8 animate-spin text-[#6B7280] dark:text-[#A3A3A3]" />
          <p className="text-[#6B7280] dark:text-[#A3A3A3]">Chargement du rapport...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <AlertTriangle className="w-12 h-12 text-[#6B7280] dark:text-[#737373] mx-auto mb-4" />
          <p className="text-[#111111] dark:text-white font-medium mb-2">Erreur</p>
          <p className="text-[#6B7280] dark:text-[#A3A3A3] text-sm mb-4">{error}</p>
          <button onClick={() => fetchReport(period)} className="px-4 py-2 bg-[#111111] dark:bg-white text-white dark:text-[#111111] rounded-lg text-sm font-medium hover:opacity-90 transition-opacity">
            Reessayer
          </button>
        </div>
      </div>
    );
  }

  if (!report) return null;

  const { summary, performanceScore, topProfitable, bottomMargin, ingredientTrends, categoryPerformance, laborAnalysis, wasteImpact, marginTimeline } = report;

  // Dark mode detection for charts
  const isDark = typeof document !== 'undefined' && document.documentElement.classList.contains('dark');
  const chartStroke = isDark ? '#FFFFFF' : '#000000';
  const chartSecondary = isDark ? '#A3A3A3' : '#6B7280';
  const chartGrid = isDark ? '#262626' : '#E5E7EB';
  const chartBg = isDark ? '#0A0A0A' : '#FFFFFF';
  const chartText = isDark ? '#A3A3A3' : '#6B7280';
  const chartColors = isDark ? MONO_DARK : MONO_COLORS;

  return (
    <div ref={printRef} className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-6">
      {/* ── Header ── */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#111111] dark:text-white flex items-center gap-3">
            <BarChart3 className="w-7 h-7" />
            Analytiques
          </h1>
          <p className="text-sm text-[#6B7280] dark:text-[#A3A3A3] mt-1">
            Rapport de performance — {selectedRestaurant?.name}
          </p>
        </div>
        <div className="flex items-center gap-3 flex-wrap">
          {/* Period selector */}
          <div className="flex bg-[#F3F4F6] dark:bg-[#171717] rounded-lg p-0.5">
            {PERIODS.map(p => (
              <button
                key={p.value}
                onClick={() => setPeriod(p.value)}
                className={`px-3 py-1.5 text-sm font-medium rounded-md transition-all ${
                  period === p.value
                    ? 'bg-[#111111] dark:bg-white text-white dark:text-[#111111] shadow-sm'
                    : 'text-[#6B7280] dark:text-[#A3A3A3] hover:text-[#111111] dark:hover:text-white'
                }`}
              >
                {p.label}
              </button>
            ))}
          </div>
          {/* Compare toggle */}
          <button
            onClick={() => setCompareMode(!compareMode)}
            className={`px-3 py-1.5 text-sm font-medium rounded-lg border transition-all ${
              compareMode
                ? 'border-[#111111] dark:border-white bg-[#111111] dark:bg-white text-white dark:text-[#111111]'
                : 'border-[#E5E7EB] dark:border-[#262626] text-[#6B7280] dark:text-[#A3A3A3] hover:border-[#111111] dark:hover:border-white'
            }`}
          >
            Comparer
          </button>
          {/* Export PDF */}
          <button
            onClick={handleExportPDF}
            className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium rounded-lg border border-[#E5E7EB] dark:border-[#262626] text-[#6B7280] dark:text-[#A3A3A3] hover:border-[#111111] dark:hover:border-white hover:text-[#111111] dark:hover:text-white transition-all print:hidden"
          >
            <Printer className="w-4 h-4" />
            Exporter PDF
          </button>
        </div>
      </div>

      {/* ── Score + Summary Cards ── */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        {/* Performance Score */}
        <div className="lg:col-span-1 bg-white dark:bg-[#0A0A0A] border border-[#E5E7EB] dark:border-[#1A1A1A] rounded-2xl p-6 flex flex-col items-center justify-center">
          <p className="text-xs font-medium text-[#6B7280] dark:text-[#A3A3A3] uppercase tracking-wider mb-4">Score de performance</p>
          <ScoreRing score={performanceScore} />
          <p className="text-xs text-[#6B7280] dark:text-[#A3A3A3] mt-3">
            {performanceScore >= 75 ? 'Excellent' : performanceScore >= 50 ? 'Bon' : performanceScore >= 25 ? 'A ameliorer' : 'Critique'}
          </p>
        </div>

        {/* Summary cards grid */}
        <div className="lg:col-span-3 grid grid-cols-2 sm:grid-cols-3 gap-4">
          <SummaryCard
            icon={<Target className="w-4 h-4" />}
            label="Marge moyenne"
            value={`${summary.avgMarginPercent}%`}
            sub={summary.avgMarginPercent >= 65 ? 'Objectif atteint' : 'Sous objectif 65%'}
            trend={summary.avgMarginPercent >= 65}
          />
          <SummaryCard
            icon={<DollarSign className="w-4 h-4" />}
            label="Food cost moyen"
            value={`${summary.avgFoodCost.toFixed(2)} EUR`}
            sub={`${summary.totalRecipes} recettes`}
          />
          <SummaryCard
            icon={<ChefHat className="w-4 h-4" />}
            label="Recettes"
            value={String(summary.totalRecipes)}
            sub={`+${summary.newRecipesThisPeriod} cette periode`}
            trend={summary.newRecipesThisPeriod > summary.newRecipesPrevPeriod}
          />
          <SummaryCard
            icon={<Package className="w-4 h-4" />}
            label="Ingredients"
            value={String(summary.totalIngredients)}
            sub="references actives"
          />
          <SummaryCard
            icon={<TrendingUp className="w-4 h-4" />}
            label="CA potentiel"
            value={`${summary.totalRevenuePotential.toFixed(0)} EUR`}
            sub="somme des prix de vente"
          />
          <SummaryCard
            icon={<Trash2 className="w-4 h-4" />}
            label="Gaspillage"
            value={`${wasteImpact.totalCost.toFixed(0)} EUR`}
            sub={`${wasteImpact.entryCount} incidents`}
            trend={wasteImpact.totalCost < 100}
          />
        </div>
      </div>

      {/* ── Margin Over Time Chart ── */}
      {marginTimeline.length > 1 && (
        <div className="bg-white dark:bg-[#0A0A0A] border border-[#E5E7EB] dark:border-[#1A1A1A] rounded-2xl p-6">
          <h2 className="text-sm font-semibold text-[#111111] dark:text-white mb-4">Evolution des marges</h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={marginTimeline}>
                <defs>
                  <linearGradient id="marginGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={chartStroke} stopOpacity={0.15} />
                    <stop offset="95%" stopColor={chartStroke} stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke={chartGrid} />
                <XAxis dataKey="date" tick={{ fill: chartText, fontSize: 11 }} tickLine={false} axisLine={false} />
                <YAxis tick={{ fill: chartText, fontSize: 11 }} tickLine={false} axisLine={false} tickFormatter={v => `${v}%`} />
                <Tooltip
                  contentStyle={{ background: chartBg, border: `1px solid ${chartGrid}`, borderRadius: 8, fontSize: 12 }}
                  labelStyle={{ color: chartText }}
                  formatter={(value: any, name: any) => [
                    name === 'avgMargin' ? `${value}%` : `${Number(value).toFixed(2)} EUR`,
                    name === 'avgMargin' ? 'Marge' : 'Cout moyen'
                  ]}
                />
                <Area type="monotone" dataKey="avgMargin" stroke={chartStroke} fill="url(#marginGrad)" strokeWidth={2} />
                <Line type="monotone" dataKey="avgCost" stroke={chartSecondary} strokeWidth={1.5} strokeDasharray="5 5" dot={false} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* ── Top / Bottom Tables ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Top 5 Most Profitable */}
        <div className="bg-white dark:bg-[#0A0A0A] border border-[#E5E7EB] dark:border-[#1A1A1A] rounded-2xl p-6">
          <div className="flex items-center gap-2 mb-4">
            <Star className="w-4 h-4 text-[#111111] dark:text-white" />
            <h2 className="text-sm font-semibold text-[#111111] dark:text-white">Top 5 — Plus rentables</h2>
          </div>
          <div className="space-y-2">
            {topProfitable.length === 0 && (
              <p className="text-sm text-[#6B7280] dark:text-[#A3A3A3]">Aucune recette</p>
            )}
            {topProfitable.map((r, i) => (
              <div key={r.id} className="flex items-center gap-3 p-3 rounded-lg bg-[#F9FAFB] dark:bg-[#111111] border border-[#F3F4F6] dark:border-[#1A1A1A]">
                <span className="w-6 h-6 flex items-center justify-center rounded-full bg-[#111111] dark:bg-white text-white dark:text-[#111111] text-xs font-bold flex-shrink-0">
                  {i + 1}
                </span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-[#111111] dark:text-white truncate">{r.name}</p>
                  <p className="text-xs text-[#6B7280] dark:text-[#A3A3A3]">{r.category} — {r.sellingPrice.toFixed(2)} EUR</p>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className="text-sm font-bold text-[#111111] dark:text-white">{r.marginPercent.toFixed(1)}%</p>
                  <p className="text-xs text-[#6B7280] dark:text-[#A3A3A3]">+{r.marginAmount.toFixed(2)} EUR</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom 5 Worst Margin */}
        <div className="bg-white dark:bg-[#0A0A0A] border border-[#E5E7EB] dark:border-[#1A1A1A] rounded-2xl p-6">
          <div className="flex items-center gap-2 mb-4">
            <AlertTriangle className="w-4 h-4 text-[#6B7280] dark:text-[#A3A3A3]" />
            <h2 className="text-sm font-semibold text-[#111111] dark:text-white">Top 5 — Marges faibles</h2>
          </div>
          <div className="space-y-2">
            {bottomMargin.length === 0 && (
              <p className="text-sm text-[#6B7280] dark:text-[#A3A3A3]">Aucune recette</p>
            )}
            {bottomMargin.map((r, i) => (
              <div key={r.id} className="flex items-center gap-3 p-3 rounded-lg bg-[#F9FAFB] dark:bg-[#111111] border border-[#F3F4F6] dark:border-[#1A1A1A]">
                <span className="w-6 h-6 flex items-center justify-center rounded-full bg-[#D4D4D4] dark:bg-[#404040] text-[#111111] dark:text-[#D4D4D4] text-xs font-bold flex-shrink-0">
                  {i + 1}
                </span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-[#111111] dark:text-white truncate">{r.name}</p>
                  <p className="text-xs text-[#6B7280] dark:text-[#A3A3A3]">{r.category} — {r.sellingPrice.toFixed(2)} EUR</p>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className={`text-sm font-bold ${r.marginPercent < 30 ? 'text-[#6B7280] dark:text-[#737373]' : 'text-[#111111] dark:text-white'}`}>
                    {r.marginPercent.toFixed(1)}%
                  </p>
                  <p className="text-xs text-[#6B7280] dark:text-[#A3A3A3]">{r.marginAmount.toFixed(2)} EUR</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Category Performance ── */}
      {categoryPerformance.length > 0 && (
        <div className="bg-white dark:bg-[#0A0A0A] border border-[#E5E7EB] dark:border-[#1A1A1A] rounded-2xl p-6">
          <h2 className="text-sm font-semibold text-[#111111] dark:text-white mb-4">Performance par categorie</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Bar chart */}
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={categoryPerformance} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke={chartGrid} horizontal={false} />
                  <XAxis type="number" tick={{ fill: chartText, fontSize: 11 }} tickLine={false} axisLine={false} tickFormatter={v => `${v}%`} />
                  <YAxis type="category" dataKey="category" tick={{ fill: chartText, fontSize: 11 }} tickLine={false} axisLine={false} width={100} />
                  <Tooltip
                    contentStyle={{ background: chartBg, border: `1px solid ${chartGrid}`, borderRadius: 8, fontSize: 12 }}
                    formatter={(value: any) => [`${value}%`, 'Marge']}
                  />
                  <Bar dataKey="avgMarginPercent" fill={chartStroke} radius={[0, 4, 4, 0]} barSize={20} />
                </BarChart>
              </ResponsiveContainer>
            </div>
            {/* Pie chart */}
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={categoryPerformance}
                    dataKey="recipeCount"
                    nameKey="category"
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    label={({ name, value }: any) => `${name} (${value})`}
                    labelLine={false}
                  >
                    {categoryPerformance.map((_, i) => (
                      <Cell key={i} fill={chartColors[i % chartColors.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{ background: chartBg, border: `1px solid ${chartGrid}`, borderRadius: 8, fontSize: 12 }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
          {/* Category table */}
          <div className="mt-4 overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-xs text-[#6B7280] dark:text-[#A3A3A3] border-b border-[#E5E7EB] dark:border-[#262626]">
                  <th className="pb-2 font-medium">Categorie</th>
                  <th className="pb-2 font-medium text-right">Recettes</th>
                  <th className="pb-2 font-medium text-right">Marge moy.</th>
                  <th className="pb-2 font-medium text-right">CA total</th>
                  <th className="pb-2 font-medium text-right">Cout total</th>
                </tr>
              </thead>
              <tbody>
                {categoryPerformance.map(cat => (
                  <tr key={cat.category} className="border-b border-[#F3F4F6] dark:border-[#1A1A1A] last:border-0">
                    <td className="py-2.5 text-[#111111] dark:text-white font-medium">{cat.category}</td>
                    <td className="py-2.5 text-right text-[#6B7280] dark:text-[#A3A3A3]">{cat.recipeCount}</td>
                    <td className="py-2.5 text-right font-medium text-[#111111] dark:text-white">{cat.avgMarginPercent}%</td>
                    <td className="py-2.5 text-right text-[#6B7280] dark:text-[#A3A3A3]">{cat.totalRevenue.toFixed(0)} EUR</td>
                    <td className="py-2.5 text-right text-[#6B7280] dark:text-[#A3A3A3]">{cat.totalCost.toFixed(0)} EUR</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ── Ingredient Cost Trends ── */}
      {ingredientTrends.length > 0 && (
        <div className="bg-white dark:bg-[#0A0A0A] border border-[#E5E7EB] dark:border-[#1A1A1A] rounded-2xl p-6">
          <h2 className="text-sm font-semibold text-[#111111] dark:text-white mb-4">Tendances prix ingredients</h2>
          <div className="space-y-2">
            {ingredientTrends.map(tr => (
              <div key={tr.ingredientId} className="flex items-center gap-3 p-3 rounded-lg bg-[#F9FAFB] dark:bg-[#111111] border border-[#F3F4F6] dark:border-[#1A1A1A]">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-[#111111] dark:text-white truncate">{tr.name}</p>
                  <p className="text-xs text-[#6B7280] dark:text-[#A3A3A3]">{tr.category}</p>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className="text-xs text-[#6B7280] dark:text-[#A3A3A3]">
                    {tr.oldPrice.toFixed(2)} EUR &rarr; {tr.newPrice.toFixed(2)} EUR
                  </p>
                  <ChangeIndicator value={tr.changePercent} />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── Labor + Waste side by side ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Labor Analysis */}
        <div className="bg-white dark:bg-[#0A0A0A] border border-[#E5E7EB] dark:border-[#1A1A1A] rounded-2xl p-6">
          <div className="flex items-center gap-2 mb-4">
            <Clock className="w-4 h-4 text-[#111111] dark:text-white" />
            <h2 className="text-sm font-semibold text-[#111111] dark:text-white">Main d'oeuvre</h2>
          </div>
          {laborAnalysis ? (
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-2xl font-bold text-[#111111] dark:text-white">{laborAnalysis.totalHours}h</p>
                <p className="text-xs text-[#6B7280] dark:text-[#A3A3A3]">Heures totales</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-[#111111] dark:text-white">{laborAnalysis.totalCost.toFixed(0)} EUR</p>
                <p className="text-xs text-[#6B7280] dark:text-[#A3A3A3]">Cout total</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-[#111111] dark:text-white">{laborAnalysis.avgCostPerHour.toFixed(2)} EUR</p>
                <p className="text-xs text-[#6B7280] dark:text-[#A3A3A3]">Cout/heure</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-[#111111] dark:text-white">{laborAnalysis.entryCount}</p>
                <p className="text-xs text-[#6B7280] dark:text-[#A3A3A3]">Entrees</p>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <Clock className="w-8 h-8 text-[#D4D4D4] dark:text-[#404040] mb-2" />
              <p className="text-sm text-[#6B7280] dark:text-[#A3A3A3]">Aucune donnee de temps</p>
              <p className="text-xs text-[#9CA3AF] dark:text-[#525252] mt-1">Utilisez le planning pour suivre les heures</p>
            </div>
          )}
        </div>

        {/* Food Waste */}
        <div className="bg-white dark:bg-[#0A0A0A] border border-[#E5E7EB] dark:border-[#1A1A1A] rounded-2xl p-6">
          <div className="flex items-center gap-2 mb-4">
            <Trash2 className="w-4 h-4 text-[#111111] dark:text-white" />
            <h2 className="text-sm font-semibold text-[#111111] dark:text-white">Impact gaspillage</h2>
          </div>
          {wasteImpact.entryCount > 0 ? (
            <div className="space-y-4">
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-bold text-[#111111] dark:text-white">{wasteImpact.totalCost.toFixed(0)} EUR</span>
                <span className="text-xs text-[#6B7280] dark:text-[#A3A3A3]">perdu sur {wasteImpact.entryCount} incidents</span>
              </div>
              {/* By reason */}
              <div className="space-y-1.5">
                {wasteImpact.byReason.map(r => {
                  const pct = wasteImpact.totalCost > 0 ? (r.cost / wasteImpact.totalCost) * 100 : 0;
                  return (
                    <div key={r.reason} className="flex items-center gap-2">
                      <span className="text-xs text-[#6B7280] dark:text-[#A3A3A3] w-28 flex-shrink-0">{WASTE_LABELS[r.reason] || r.reason}</span>
                      <div className="flex-1 h-2 bg-[#F3F4F6] dark:bg-[#171717] rounded-full overflow-hidden">
                        <div className="h-full bg-[#111111] dark:bg-white rounded-full transition-all" style={{ width: `${pct}%` }} />
                      </div>
                      <span className="text-xs font-medium text-[#111111] dark:text-white w-16 text-right">{r.cost.toFixed(0)} EUR</span>
                    </div>
                  );
                })}
              </div>
              {/* Top wasted */}
              {wasteImpact.topWastedIngredients.length > 0 && (
                <div className="pt-3 border-t border-[#F3F4F6] dark:border-[#1A1A1A]">
                  <p className="text-xs font-medium text-[#6B7280] dark:text-[#A3A3A3] mb-2">Plus gaspilles</p>
                  {wasteImpact.topWastedIngredients.slice(0, 3).map(w => (
                    <div key={w.name} className="flex justify-between text-xs py-1">
                      <span className="text-[#111111] dark:text-white">{w.name}</span>
                      <span className="text-[#6B7280] dark:text-[#A3A3A3]">{w.cost.toFixed(2)} EUR ({w.count}x)</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <Trash2 className="w-8 h-8 text-[#D4D4D4] dark:text-[#404040] mb-2" />
              <p className="text-sm text-[#6B7280] dark:text-[#A3A3A3]">Aucun gaspillage enregistre</p>
              <p className="text-xs text-[#9CA3AF] dark:text-[#525252] mt-1">Utilisez le suivi gaspillage</p>
            </div>
          )}
        </div>
      </div>

      {/* ── Print Footer ── */}
      <div className="hidden print:block text-center text-xs text-[#9CA3AF] mt-8 pt-4 border-t border-[#E5E7EB]">
        <p>RestauMargin — Rapport analytique genere le {new Date().toLocaleDateString('fr-FR')}</p>
        <p>{selectedRestaurant?.name} — Periode: {report.periodDays} jours</p>
      </div>
    </div>
  );
}

// ── Summary Card Component ──
function SummaryCard({ icon, label, value, sub, trend }: {
  icon: React.ReactNode;
  label: string;
  value: string;
  sub?: string;
  trend?: boolean;
}) {
  return (
    <div className="bg-white dark:bg-[#0A0A0A] border border-[#E5E7EB] dark:border-[#1A1A1A] rounded-xl p-4">
      <div className="flex items-center gap-2 mb-2">
        <span className="text-[#6B7280] dark:text-[#A3A3A3]">{icon}</span>
        <span className="text-xs font-medium text-[#6B7280] dark:text-[#A3A3A3]">{label}</span>
      </div>
      <p className="text-xl font-bold text-[#111111] dark:text-white">{value}</p>
      {sub && (
        <p className={`text-xs mt-1 ${trend === true ? 'text-[#111111] dark:text-white font-medium' : trend === false ? 'text-[#9CA3AF] dark:text-[#525252]' : 'text-[#6B7280] dark:text-[#A3A3A3]'}`}>
          {sub}
        </p>
      )}
    </div>
  );
}
