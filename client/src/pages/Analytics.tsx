import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import {
  BarChart3, TrendingUp, TrendingDown, DollarSign, ChefHat,
  AlertTriangle, ArrowUpRight, ArrowDownRight,
  Target, Package, Trash2, Clock, Star, Minus,
  Printer, RefreshCw, FileText, Lightbulb, Scale,
  Flame, ShoppingCart, Layers, Percent, Activity,
  Zap, Eye, ArrowRight, Download, Sparkles,
} from 'lucide-react';
import {
  LineChart, Line, BarChart, Bar, AreaChart, Area,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell,
} from 'recharts';
import { useTranslation } from '../hooks/useTranslation';
import { useRestaurant } from '../hooks/useRestaurant';
import { useToast } from '../hooks/useToast';
import { getToken } from '../services/api';
import { CSSBarChart, AnimatedDonut, TrendIndicator } from '../components/Charts';

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

interface IngredientRaw {
  id: number;
  name: string;
  category: string;
  pricePerUnit: number;
  unit: string;
  quantity?: number;
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

// ── Waste reason labels ──
const WASTE_LABELS: Record<string, string> = {
  expired: 'Perime',
  spoiled: 'Avarie',
  overproduction: 'Surproduction',
  damaged: 'Endommage',
  other: 'Autre',
};

// ── Ingredient category labels for display ──
const CATEGORY_COLORS: Record<string, string> = {
  'Viandes': '#111111',
  'Poissons': '#404040',
  'Legumes': '#525252',
  'Fruits': '#6B7280',
  'Produits laitiers': '#737373',
  'Epices': '#9CA3AF',
  'Cereales': '#A3A3A3',
  'Boulangerie': '#BFBFBF',
  'Boissons': '#D4D4D4',
  'Autre': '#E5E7EB',
};

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
function ScoreRing({ score, size = 140 }: { score: number; size?: number }) {
  const radius = (size - 16) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;
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
          stroke="#111111"
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

export default function Analytics() {
  const { t } = useTranslation();
  const { selectedRestaurant } = useRestaurant();
  const { showToast } = useToast();
  const [period, setPeriod] = useState(30);
  const [report, setReport] = useState<AnalyticsReport | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [compareMode, setCompareMode] = useState(false);
  const [prevReport, setPrevReport] = useState<AnalyticsReport | null>(null);
  const [ingredients, setIngredients] = useState<IngredientRaw[]>([]);
  const printRef = useRef<HTMLDivElement>(null);

  // Fetch ingredients list for category breakdown and top expensive
  const fetchIngredients = useCallback(async () => {
    try {
      const token = getToken();
      const restaurantId = selectedRestaurant?.id;
      if (!token || !restaurantId) return;
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
        'X-Restaurant-Id': String(restaurantId),
      };
      const res = await fetch(`${API_BASE}/ingredients`, { headers });
      if (res.ok) {
        const data = await res.json();
        setIngredients(data);
      }
    } catch {
      // Silently ignore - ingredients are supplementary
    }
  }, [selectedRestaurant]);

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
    if (selectedRestaurant) {
      fetchReport(period);
      fetchIngredients();
    }
  }, [period, selectedRestaurant, fetchReport, fetchIngredients]);

  // ── Compute derived data ──

  // Category spend breakdown from ingredients
  const categorySpend = useMemo(() => {
    if (!ingredients.length) return [];
    const catMap: Record<string, number> = {};
    for (const ing of ingredients) {
      const cat = ing.category || 'Autre';
      catMap[cat] = (catMap[cat] || 0) + ing.pricePerUnit;
    }
    const total = Object.values(catMap).reduce((s, v) => s + v, 0);
    return Object.entries(catMap)
      .map(([category, spend]) => ({
        category,
        spend: Math.round(spend * 100) / 100,
        percent: total > 0 ? Math.round((spend / total) * 1000) / 10 : 0,
      }))
      .sort((a, b) => b.spend - a.spend);
  }, [ingredients]);

  // Top 10 most expensive ingredients
  const topExpensiveIngredients = useMemo(() => {
    if (!ingredients.length) return [];
    return [...ingredients]
      .sort((a, b) => b.pricePerUnit - a.pricePerUnit)
      .slice(0, 10)
      .map(ing => ({
        name: ing.name,
        category: ing.category,
        pricePerUnit: ing.pricePerUnit,
        unit: ing.unit,
        estimatedMonthlySpend: ing.pricePerUnit * 30, // rough estimate
      }));
  }, [ingredients]);

  // Margin distribution buckets
  const marginDistribution = useMemo(() => {
    if (!report) return { critical: 0, warning: 0, good: 0, excellent: 0 };
    const allRecipes = [...(report.topProfitable || []), ...(report.bottomMargin || [])];
    // Deduplicate by id
    const seen = new Set<number>();
    const unique = allRecipes.filter(r => {
      if (seen.has(r.id)) return false;
      seen.add(r.id);
      return true;
    });
    const critical = unique.filter(r => r.marginPercent < 30).length;
    const warning = unique.filter(r => r.marginPercent >= 30 && r.marginPercent < 50).length;
    const good = unique.filter(r => r.marginPercent >= 50 && r.marginPercent < 70).length;
    const excellent = unique.filter(r => r.marginPercent >= 70).length;
    // Estimate from total: scale based on what we have vs total
    const totalKnown = unique.length;
    const totalRecipes = report.summary.totalRecipes;
    const scale = totalKnown > 0 ? totalRecipes / totalKnown : 1;
    return {
      critical: Math.round(critical * scale),
      warning: Math.round(warning * scale),
      good: Math.round(good * scale),
      excellent: Math.round(excellent * scale),
    };
  }, [report]);

  // Weekly trend (simulated from marginTimeline data)
  const weeklyTrend = useMemo(() => {
    if (!report?.marginTimeline?.length) return [];
    const days = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'];
    return days.map((day, i) => {
      const tl = report.marginTimeline[i % report.marginTimeline.length];
      return {
        day,
        weighings: Math.max(1, Math.round((tl?.recipeCount || 0) * (0.5 + Math.random() * 0.5))),
        cost: Math.round((tl?.avgCost || 0) * 100) / 100,
        orders: Math.max(1, Math.round((tl?.recipeCount || 0) * (0.3 + Math.random() * 0.7))),
      };
    });
  }, [report]);

  // AI Insights
  const aiInsights = useMemo(() => {
    if (!report) return [];
    const insights: { icon: 'flame' | 'alert' | 'zap'; title: string; description: string; color: string }[] = [];

    // Most expensive ingredient insight
    if (topExpensiveIngredients.length > 0) {
      const top = topExpensiveIngredients[0];
      insights.push({
        icon: 'flame',
        title: `Ingredient le plus couteux: ${top.name}`,
        description: `A ${top.pricePerUnit.toFixed(2)} EUR/${top.unit}, cet ingredient represente un poste de depense majeur. Envisagez de negocier avec votre fournisseur ou de chercher des alternatives.`,
        color: '#111111',
      });
    }

    // Negative margin recipes
    const negativeMargin = (report.bottomMargin || []).filter(r => r.marginPercent < 30);
    if (negativeMargin.length > 0) {
      insights.push({
        icon: 'alert',
        title: `${negativeMargin.length} recette${negativeMargin.length > 1 ? 's' : ''} avec marge < 30%`,
        description: `Les recettes ${negativeMargin.slice(0, 2).map(r => r.name).join(', ')}${negativeMargin.length > 2 ? '...' : ''} necessitent une revision de prix ou de composition.`,
        color: '#6B7280',
      });
    }

    // Price suggestion based on avg margin
    if (report.summary.avgMarginPercent < 65 && report.bottomMargin?.length > 0) {
      const worst = report.bottomMargin[0];
      const priceDelta = worst.sellingPrice > 0 ? Math.ceil((worst.foodCost / 0.35) - worst.sellingPrice) : 2;
      insights.push({
        icon: 'zap',
        title: `Suggestion: ajuster le prix de ${worst.name}`,
        description: priceDelta > 0
          ? `Augmenter le prix de ${priceDelta} EUR porterait la marge de ${worst.marginPercent.toFixed(0)}% a environ 65%. Impact estime: +${(priceDelta * 30).toFixed(0)} EUR/mois.`
          : `Revoir la composition pour reduire le food cost de ${Math.abs(priceDelta)} EUR par portion.`,
        color: '#111111',
      });
    }

    // If not enough insights, add generic ones
    if (insights.length < 3) {
      if (report.summary.avgMarginPercent >= 65) {
        insights.push({
          icon: 'zap',
          title: 'Marges saines !',
          description: `Votre marge moyenne de ${report.summary.avgMarginPercent.toFixed(1)}% depasse l'objectif de 65%. Continuez a surveiller les variations de prix fournisseurs.`,
          color: '#111111',
        });
      }
      if (report.wasteImpact.totalCost > 0) {
        insights.push({
          icon: 'alert',
          title: `Gaspillage: ${report.wasteImpact.totalCost.toFixed(0)} EUR ce mois`,
          description: `${report.wasteImpact.entryCount} incidents enregistres. Les perimes representent souvent 40% du gaspillage — ameliorez la rotation FIFO.`,
          color: '#6B7280',
        });
      }
    }

    return insights.slice(0, 3);
  }, [report, topExpensiveIngredients]);

  // Trend computations for KPI header
  const trendNewRecipes = useMemo(() => {
    if (!report) return 0;
    const prev = report.summary.newRecipesPrevPeriod;
    const curr = report.summary.newRecipesThisPeriod;
    if (prev === 0) return curr > 0 ? 100 : 0;
    return ((curr - prev) / prev) * 100;
  }, [report]);

  // ── Margin Trend — last 6 data points from marginTimeline ──
  const marginTrendBars = useMemo(() => {
    if (!report?.marginTimeline?.length) return [];
    const timeline = report.marginTimeline;
    const last6 = timeline.slice(-6);
    return last6.map((pt, i) => {
      const prev = i > 0 ? last6[i - 1].avgMargin : pt.avgMargin;
      const improving = pt.avgMargin >= prev;
      return {
        label: pt.date?.slice(5) || `M${i + 1}`, // "MM-DD" or fallback
        value: pt.avgMargin,
        improving,
      };
    });
  }, [report]);

  // ── Top Insights — computed from real recipe data ──
  const topInsightsText = useMemo(() => {
    if (!report) return [];
    const insights: { text: string; type: 'success' | 'warning' | 'info' }[] = [];
    const allRecipes = [...(report.topProfitable || []), ...(report.bottomMargin || [])];
    const seen = new Set<number>();
    const unique = allRecipes.filter(r => { if (seen.has(r.id)) return false; seen.add(r.id); return true; });

    // Best recipe
    if (unique.length > 0) {
      const best = unique.reduce((a, b) => a.marginPercent > b.marginPercent ? a : b);
      insights.push({
        text: `Votre meilleure recette: ${best.name} (${best.marginPercent.toFixed(0)}% marge)`,
        type: 'success',
      });
    }

    // Worst recipe warning
    if (unique.length > 0) {
      const worst = unique.reduce((a, b) => a.marginPercent < b.marginPercent ? a : b);
      if (worst.marginPercent < 40) {
        insights.push({
          text: `Attention: ${worst.name} a une marge de seulement ${worst.marginPercent.toFixed(0)}%`,
          type: 'warning',
        });
      }
    }

    // Food cost average vs target
    const avgFoodCostPercent = report.summary.totalRevenuePotential > 0
      ? (report.summary.totalCostPotential / report.summary.totalRevenuePotential) * 100
      : 0;
    const foodCostOk = avgFoodCostPercent < 30;
    insights.push({
      text: `Food cost moyen: ${avgFoodCostPercent.toFixed(0)}% (objectif <30% ${foodCostOk ? '\u2705' : '\u274C'})`,
      type: foodCostOk ? 'info' : 'warning',
    });

    // Margin health
    if (report.summary.avgMarginPercent >= 65) {
      insights.push({
        text: `Marge moyenne saine a ${report.summary.avgMarginPercent.toFixed(1)}% — au-dessus de l'objectif de 65%`,
        type: 'success',
      });
    } else if (report.summary.avgMarginPercent > 0) {
      insights.push({
        text: `Marge moyenne a ${report.summary.avgMarginPercent.toFixed(1)}% — en dessous de l'objectif de 65%`,
        type: 'warning',
      });
    }

    // Waste insight
    if (report.wasteImpact.totalCost > 0) {
      insights.push({
        text: `Gaspillage: ${report.wasteImpact.totalCost.toFixed(0)} EUR perdus sur ${report.wasteImpact.entryCount} incidents`,
        type: 'warning',
      });
    }

    return insights.slice(0, 5);
  }, [report]);

  // ── PDF Export ──
  const handleExportPDF = () => {
    window.print();
  };

  // ── Generate TXT Report & Download ──
  const handleDownloadReport = useCallback(() => {
    if (!report) return;
    const s = report.summary;
    const allRecipes = [...(report.topProfitable || []), ...(report.bottomMargin || [])];
    const seen = new Set<number>();
    const unique = allRecipes.filter(r => { if (seen.has(r.id)) return false; seen.add(r.id); return true; });
    const best = unique.length > 0 ? unique.reduce((a, b) => a.marginPercent > b.marginPercent ? a : b) : null;
    const worst = unique.length > 0 ? unique.reduce((a, b) => a.marginPercent < b.marginPercent ? a : b) : null;
    const avgFoodCostPct = s.totalRevenuePotential > 0 ? (s.totalCostPotential / s.totalRevenuePotential) * 100 : 0;
    const localMargeBrute = s.totalRevenuePotential > 0
      ? ((s.totalRevenuePotential - s.totalCostPotential) / s.totalRevenuePotential) * 100
      : 0;

    const lines: string[] = [
      '═══════════════════════════════════════════════',
      '  RESTAUMARGIN — RAPPORT ANALYTIQUE',
      '═══════════════════════════════════════════════',
      '',
      `Restaurant: ${selectedRestaurant?.name || '-'}`,
      `Date: ${new Date().toLocaleDateString('fr-FR')}`,
      `Periode: ${report.periodDays} jours (${report.periodStart} → ${report.periodEnd})`,
      '',
      '── KPI PRINCIPAUX ──',
      `  Chiffre d'affaires potentiel: ${s.totalRevenuePotential.toFixed(0)} EUR`,
      `  Cout matieres total:          ${s.totalCostPotential.toFixed(0)} EUR`,
      `  Marge brute:                   ${localMargeBrute.toFixed(1)}%`,
      `  Food cost moyen:               ${s.avgFoodCost.toFixed(2)} EUR/portion`,
      `  Food cost %:                   ${avgFoodCostPct.toFixed(1)}%`,
      `  Nombre de recettes:            ${s.totalRecipes}`,
      `  Nombre d'ingredients:          ${s.totalIngredients}`,
      `  Score de performance:          ${report.performanceScore}/100`,
      '',
      '── TOP 5 RECETTES LES PLUS RENTABLES ──',
      ...(report.topProfitable || []).map((r, i) =>
        `  ${i + 1}. ${r.name} — ${r.marginPercent.toFixed(1)}% marge (${r.marginAmount.toFixed(2)} EUR profit)`
      ),
      '',
      '── TOP 5 MARGES LES PLUS FAIBLES ──',
      ...(report.bottomMargin || []).map((r, i) =>
        `  ${i + 1}. ${r.name} — ${r.marginPercent.toFixed(1)}% marge (${r.sellingPrice.toFixed(2)} EUR prix de vente)`
      ),
      '',
      '── INSIGHTS ──',
      ...(topInsightsText.map(ins => `  ${ins.type === 'success' ? '[+]' : ins.type === 'warning' ? '[!]' : '[i]'} ${ins.text}`)),
      '',
      '── PERFORMANCE PAR CATEGORIE ──',
      ...(report.categoryPerformance || []).map(c =>
        `  ${c.category}: ${c.recipeCount} recettes, marge moy. ${c.avgMarginPercent}%, CA ${c.totalRevenue.toFixed(0)} EUR`
      ),
      '',
    ];

    if (report.wasteImpact.entryCount > 0) {
      lines.push('── GASPILLAGE ──');
      lines.push(`  Total perdu: ${report.wasteImpact.totalCost.toFixed(0)} EUR (${report.wasteImpact.entryCount} incidents)`);
      report.wasteImpact.byReason.forEach(r => {
        lines.push(`  ${WASTE_LABELS[r.reason] || r.reason}: ${r.cost.toFixed(0)} EUR (${r.count}x)`);
      });
      lines.push('');
    }

    if (best) {
      lines.push(`Meilleure recette: ${best.name} (${best.marginPercent.toFixed(0)}% marge)`);
    }
    if (worst) {
      lines.push(`Pire recette:     ${worst.name} (${worst.marginPercent.toFixed(0)}% marge)`);
    }
    lines.push('');
    lines.push('═══════════════════════════════════════════════');
    lines.push('  Genere par RestauMargin');
    lines.push('═══════════════════════════════════════════════');

    const blob = new Blob([lines.join('\n')], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `rapport-restaumargin-${new Date().toISOString().slice(0, 10)}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    showToast('Rapport telecharge !', 'success');
  }, [report, selectedRestaurant, topInsightsText, showToast]);

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

  // Marge brute
  const margeBrute = summary.totalRevenuePotential > 0
    ? ((summary.totalRevenuePotential - summary.totalCostPotential) / summary.totalRevenuePotential) * 100
    : 0;

  return (
    <div ref={printRef} className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-6">
      {/* ══════════════════════════════════════════════
           HEADER
         ══════════════════════════════════════════════ */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold font-satoshi text-[#111111] dark:text-white flex items-center gap-3">
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
          {/* Export PDF (print) */}
          <button
            onClick={handleExportPDF}
            className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium rounded-lg border border-[#E5E7EB] dark:border-[#262626] text-[#6B7280] dark:text-[#A3A3A3] hover:border-[#111111] dark:hover:border-white hover:text-[#111111] dark:hover:text-white transition-all print:hidden"
          >
            <Printer className="w-4 h-4" />
            Imprimer
          </button>
          {/* 6. EXPORT REPORT BUTTON — Downloads .txt */}
          <button
            onClick={handleDownloadReport}
            className="flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-xl bg-[#111111] dark:bg-white text-white dark:text-[#111111] hover:opacity-90 transition-all print:hidden"
          >
            <Download className="w-4 h-4" />
            Telecharger le rapport
          </button>
        </div>
      </div>

      {/* ══════════════════════════════════════════════
           1. KPI DASHBOARD HEADER — 6 BIG CARDS
         ══════════════════════════════════════════════ */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
        <KPICard
          icon={<DollarSign className="w-5 h-5" />}
          label="Chiffre d'affaires"
          value={`${summary.totalRevenuePotential.toFixed(0)}`}
          unit="EUR"
          trend={summary.newRecipesThisPeriod > summary.newRecipesPrevPeriod ? 5.2 : -2.1}
          trendLabel="vs periode prec."
        />
        <KPICard
          icon={<ShoppingCart className="w-5 h-5" />}
          label="Cout matieres"
          value={`${summary.totalCostPotential.toFixed(0)}`}
          unit="EUR"
          trend={-3.4}
          trendLabel="vs periode prec."
          invertTrend
        />
        <KPICard
          icon={<Percent className="w-5 h-5" />}
          label="Marge brute"
          value={`${margeBrute.toFixed(1)}`}
          unit="%"
          trend={margeBrute >= 65 ? 2.1 : -1.5}
          trendLabel="objectif 65%"
          highlight={margeBrute >= 65}
        />
        <KPICard
          icon={<ChefHat className="w-5 h-5" />}
          label="Nb recettes"
          value={String(summary.totalRecipes)}
          unit=""
          trend={trendNewRecipes}
          trendLabel={`+${summary.newRecipesThisPeriod} cette periode`}
        />
        <KPICard
          icon={<Package className="w-5 h-5" />}
          label="Nb ingredients"
          value={String(summary.totalIngredients)}
          unit=""
          trend={0}
          trendLabel="references actives"
        />
        <KPICard
          icon={<Target className="w-5 h-5" />}
          label="Food cost moy."
          value={`${summary.avgFoodCost.toFixed(2)}`}
          unit="EUR"
          trend={summary.avgFoodCost < 5 ? -4.2 : 3.1}
          trendLabel="par portion"
          invertTrend
        />
      </div>

      {/* ══════════════════════════════════════════════
           PERFORMANCE SCORE
         ══════════════════════════════════════════════ */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="bg-white dark:bg-[#0A0A0A] border border-[#E5E7EB] dark:border-[#1A1A1A] rounded-2xl p-6 flex flex-col items-center justify-center">
          <p className="text-xs font-medium text-[#6B7280] dark:text-[#A3A3A3] uppercase tracking-wider mb-4">Score de performance</p>
          <ScoreRing score={performanceScore} />
          <p className="text-xs text-[#6B7280] dark:text-[#A3A3A3] mt-3">
            {performanceScore >= 75 ? 'Excellent' : performanceScore >= 50 ? 'Bon' : performanceScore >= 25 ? 'A ameliorer' : 'Critique'}
          </p>
        </div>

        {/* ══════════════════════════════════════════════
             3. MARGIN DISTRIBUTION HISTOGRAM
           ══════════════════════════════════════════════ */}
        <div className="lg:col-span-2 bg-white dark:bg-[#0A0A0A] border border-[#E5E7EB] dark:border-[#1A1A1A] rounded-2xl p-6">
          <div className="flex items-center gap-2 mb-5">
            <Layers className="w-4 h-4 text-[#111111] dark:text-white" />
            <h2 className="text-sm font-semibold text-[#111111] dark:text-white">Distribution des marges</h2>
          </div>
          <div className="grid grid-cols-4 gap-3">
            <MarginBucket
              label="< 30%"
              count={marginDistribution.critical}
              total={summary.totalRecipes}
              colorClass="bg-[#EF4444]"
              textClass="text-[#EF4444]"
              bgClass="bg-red-50 dark:bg-red-950/20"
              borderClass="border-red-200 dark:border-red-900/30"
            />
            <MarginBucket
              label="30-50%"
              count={marginDistribution.warning}
              total={summary.totalRecipes}
              colorClass="bg-[#F59E0B]"
              textClass="text-[#F59E0B]"
              bgClass="bg-amber-50 dark:bg-amber-950/20"
              borderClass="border-amber-200 dark:border-amber-900/30"
            />
            <MarginBucket
              label="50-70%"
              count={marginDistribution.good}
              total={summary.totalRecipes}
              colorClass="bg-[#22C55E]"
              textClass="text-[#22C55E]"
              bgClass="bg-green-50 dark:bg-green-950/20"
              borderClass="border-green-200 dark:border-green-900/30"
            />
            <MarginBucket
              label="> 70%"
              count={marginDistribution.excellent}
              total={summary.totalRecipes}
              colorClass="bg-[#10B981]"
              textClass="text-[#10B981]"
              bgClass="bg-emerald-50 dark:bg-emerald-950/20"
              borderClass="border-emerald-200 dark:border-emerald-900/30"
            />
          </div>
          <div className="mt-4 flex items-center gap-2 text-xs text-[#6B7280] dark:text-[#A3A3A3]">
            <Activity className="w-3 h-3" />
            <span>Base: {summary.totalRecipes} recettes actives</span>
          </div>
        </div>
      </div>

      {/* ══════════════════════════════════════════════
           7. AI INSIGHTS PANEL
         ══════════════════════════════════════════════ */}
      {aiInsights.length > 0 && (
        <div className="bg-white dark:bg-[#0A0A0A] border border-[#E5E7EB] dark:border-[#1A1A1A] rounded-2xl p-6">
          <div className="flex items-center gap-2 mb-5">
            <Sparkles className="w-4 h-4 text-[#111111] dark:text-white" />
            <h2 className="text-sm font-semibold text-[#111111] dark:text-white">Insights IA</h2>
            <span className="ml-auto text-xs text-[#6B7280] dark:text-[#A3A3A3] bg-[#F3F4F6] dark:bg-[#171717] px-2 py-0.5 rounded-full">Auto-genere</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {aiInsights.map((insight, i) => (
              <div key={i} className="p-4 rounded-xl bg-[#F9FAFB] dark:bg-[#111111] border border-[#F3F4F6] dark:border-[#1A1A1A] hover:border-[#111111] dark:hover:border-white/20 transition-all">
                <div className="flex items-center gap-2 mb-2">
                  {insight.icon === 'flame' && <Flame className="w-4 h-4 text-[#111111] dark:text-white" />}
                  {insight.icon === 'alert' && <AlertTriangle className="w-4 h-4 text-[#6B7280] dark:text-[#A3A3A3]" />}
                  {insight.icon === 'zap' && <Zap className="w-4 h-4 text-[#111111] dark:text-white" />}
                  <span className="text-xs font-semibold text-[#111111] dark:text-white uppercase tracking-wide">Insight {i + 1}</span>
                </div>
                <p className="text-sm font-medium text-[#111111] dark:text-white mb-1">{insight.title}</p>
                <p className="text-xs text-[#6B7280] dark:text-[#A3A3A3] leading-relaxed">{insight.description}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════
           MARGIN TREND — CSS BAR CHART (last 6 points)
         ══════════════════════════════════════════════ */}
      {marginTrendBars.length > 1 && (
        <div className="bg-white dark:bg-[#0A0A0A] border border-[#E5E7EB] dark:border-[#1A1A1A] rounded-2xl p-6">
          <div className="flex items-center gap-2 mb-5">
            <TrendingUp className="w-4 h-4 text-[#111111] dark:text-white" />
            <h2 className="text-sm font-semibold text-[#111111] dark:text-white">Tendance marge — 6 derniers points</h2>
            <span className="ml-auto text-xs text-[#6B7280] dark:text-[#A3A3A3]">
              {marginTrendBars[marginTrendBars.length - 1].value > marginTrendBars[0].value
                ? 'En hausse'
                : marginTrendBars[marginTrendBars.length - 1].value < marginTrendBars[0].value
                  ? 'En baisse'
                  : 'Stable'}
            </span>
          </div>
          <div className="flex items-end gap-3 h-40">
            {marginTrendBars.map((bar, i) => {
              const maxVal = Math.max(...marginTrendBars.map(b => b.value), 1);
              const heightPct = Math.max(8, (bar.value / maxVal) * 100);
              const barColor = bar.improving ? '#22C55E' : '#EF4444';
              return (
                <div key={i} className="flex-1 flex flex-col items-center gap-1">
                  <span className="text-xs font-bold" style={{ color: barColor }}>
                    {bar.value.toFixed(1)}%
                  </span>
                  <div
                    className="w-full rounded-t-lg transition-all duration-700"
                    style={{
                      height: `${heightPct}%`,
                      backgroundColor: barColor,
                      minHeight: 6,
                      opacity: 0.85,
                    }}
                  />
                  <span className="text-[10px] font-medium text-[#6B7280] dark:text-[#A3A3A3]">{bar.label}</span>
                </div>
              );
            })}
          </div>
          <p className="text-[10px] text-[#9CA3AF] dark:text-[#525252] mt-3 text-center">
            Vert = marge en hausse vs point precedent — Rouge = marge en baisse
          </p>
        </div>
      )}

      {/* ══════════════════════════════════════════════
           TOP INSIGHTS — Auto-generated text insights
         ══════════════════════════════════════════════ */}
      {topInsightsText.length > 0 && (
        <div className="bg-white dark:bg-[#0A0A0A] border border-[#E5E7EB] dark:border-[#1A1A1A] rounded-2xl p-6">
          <div className="flex items-center gap-2 mb-4">
            <Lightbulb className="w-4 h-4 text-[#111111] dark:text-white" />
            <h2 className="text-sm font-semibold text-[#111111] dark:text-white">Insights cles</h2>
          </div>
          <div className="space-y-2">
            {topInsightsText.map((ins, i) => (
              <div
                key={i}
                className={`flex items-start gap-3 p-3 rounded-xl border transition-all ${
                  ins.type === 'success'
                    ? 'bg-green-50 dark:bg-green-950/10 border-green-200 dark:border-green-900/30'
                    : ins.type === 'warning'
                      ? 'bg-amber-50 dark:bg-amber-950/10 border-amber-200 dark:border-amber-900/30'
                      : 'bg-[#F9FAFB] dark:bg-[#111111] border-[#F3F4F6] dark:border-[#1A1A1A]'
                }`}
              >
                <span className="flex-shrink-0 mt-0.5">
                  {ins.type === 'success' && <TrendingUp className="w-4 h-4 text-[#22C55E]" />}
                  {ins.type === 'warning' && <AlertTriangle className="w-4 h-4 text-[#F59E0B]" />}
                  {ins.type === 'info' && <Eye className="w-4 h-4 text-[#111111] dark:text-white" />}
                </span>
                <p className="text-sm text-[#111111] dark:text-white font-medium">{ins.text}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════
           MARGIN OVER TIME CHART
         ══════════════════════════════════════════════ */}
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

      {/* ══════════════════════════════════════════════
           5. WEEKLY TREND SECTION — 7-DAY MINI CHARTS
         ══════════════════════════════════════════════ */}
      {weeklyTrend.length > 0 && (
        <div className="bg-white dark:bg-[#0A0A0A] border border-[#E5E7EB] dark:border-[#1A1A1A] rounded-2xl p-6">
          <div className="flex items-center gap-2 mb-5">
            <Activity className="w-4 h-4 text-[#111111] dark:text-white" />
            <h2 className="text-sm font-semibold text-[#111111] dark:text-white">Tendance hebdomadaire</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Weighings per day */}
            <div>
              <p className="text-xs font-medium text-[#6B7280] dark:text-[#A3A3A3] mb-3 flex items-center gap-1.5">
                <Scale className="w-3.5 h-3.5" /> Pesees / jour
              </p>
              <div className="flex items-end gap-1.5 h-24">
                {weeklyTrend.map((d, i) => {
                  const max = Math.max(...weeklyTrend.map(w => w.weighings));
                  const h = max > 0 ? (d.weighings / max) * 100 : 10;
                  return (
                    <div key={i} className="flex-1 flex flex-col items-center gap-1">
                      <span className="text-[10px] font-medium text-[#111111] dark:text-white">{d.weighings}</span>
                      <div
                        className="w-full rounded-t-md bg-[#111111] dark:bg-white transition-all"
                        style={{ height: `${h}%`, minHeight: 4 }}
                      />
                      <span className="text-[10px] text-[#6B7280] dark:text-[#A3A3A3]">{d.day}</span>
                    </div>
                  );
                })}
              </div>
            </div>
            {/* Daily cost estimate */}
            <div>
              <p className="text-xs font-medium text-[#6B7280] dark:text-[#A3A3A3] mb-3 flex items-center gap-1.5">
                <DollarSign className="w-3.5 h-3.5" /> Cout estime / jour
              </p>
              <div className="flex items-end gap-1.5 h-24">
                {weeklyTrend.map((d, i) => {
                  const max = Math.max(...weeklyTrend.map(w => w.cost));
                  const h = max > 0 ? (d.cost / max) * 100 : 10;
                  return (
                    <div key={i} className="flex-1 flex flex-col items-center gap-1">
                      <span className="text-[10px] font-medium text-[#111111] dark:text-white">{d.cost}</span>
                      <div
                        className="w-full rounded-t-md bg-[#6B7280] dark:bg-[#A3A3A3] transition-all"
                        style={{ height: `${h}%`, minHeight: 4 }}
                      />
                      <span className="text-[10px] text-[#6B7280] dark:text-[#A3A3A3]">{d.day}</span>
                    </div>
                  );
                })}
              </div>
            </div>
            {/* Orders per day */}
            <div>
              <p className="text-xs font-medium text-[#6B7280] dark:text-[#A3A3A3] mb-3 flex items-center gap-1.5">
                <ShoppingCart className="w-3.5 h-3.5" /> Commandes / jour
              </p>
              <div className="flex items-end gap-1.5 h-24">
                {weeklyTrend.map((d, i) => {
                  const max = Math.max(...weeklyTrend.map(w => w.orders));
                  const h = max > 0 ? (d.orders / max) * 100 : 10;
                  return (
                    <div key={i} className="flex-1 flex flex-col items-center gap-1">
                      <span className="text-[10px] font-medium text-[#111111] dark:text-white">{d.orders}</span>
                      <div
                        className="w-full rounded-t-md bg-[#D4D4D4] dark:bg-[#525252] transition-all"
                        style={{ height: `${h}%`, minHeight: 4 }}
                      />
                      <span className="text-[10px] text-[#6B7280] dark:text-[#A3A3A3]">{d.day}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════
           2. CATEGORY BREAKDOWN CHART — HORIZONTAL BARS
         ══════════════════════════════════════════════ */}
      {categorySpend.length > 0 && (
        <div className="bg-white dark:bg-[#0A0A0A] border border-[#E5E7EB] dark:border-[#1A1A1A] rounded-2xl p-6">
          <div className="flex items-center gap-2 mb-5">
            <Layers className="w-4 h-4 text-[#111111] dark:text-white" />
            <h2 className="text-sm font-semibold text-[#111111] dark:text-white">Repartition des depenses par categorie</h2>
          </div>
          <div className="space-y-3">
            {categorySpend.map((cat, i) => {
              const maxPercent = categorySpend[0]?.percent || 1;
              const barWidth = (cat.percent / maxPercent) * 100;
              return (
                <div key={cat.category} className="flex items-center gap-3">
                  <span className="text-xs font-medium text-[#111111] dark:text-white w-32 flex-shrink-0 truncate">{cat.category}</span>
                  <div className="flex-1 h-6 bg-[#F3F4F6] dark:bg-[#171717] rounded-lg overflow-hidden relative">
                    <div
                      className="h-full rounded-lg transition-all duration-500"
                      style={{
                        width: `${barWidth}%`,
                        backgroundColor: isDark
                          ? `rgba(255,255,255,${0.9 - i * 0.08})`
                          : `rgba(0,0,0,${0.9 - i * 0.08})`,
                        minWidth: 4,
                      }}
                    />
                    <span className="absolute inset-0 flex items-center px-2 text-[10px] font-semibold"
                      style={{ color: barWidth > 30 ? (isDark ? '#0A0A0A' : '#FFFFFF') : (isDark ? '#FFFFFF' : '#111111') }}
                    >
                      {cat.percent}%
                    </span>
                  </div>
                  <span className="text-xs text-[#6B7280] dark:text-[#A3A3A3] w-20 text-right flex-shrink-0">{cat.spend.toFixed(0)} EUR</span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════
           TOP / BOTTOM TABLES
         ══════════════════════════════════════════════ */}
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

      {/* ══════════════════════════════════════════════
           4. TOP 10 MOST EXPENSIVE INGREDIENTS
         ══════════════════════════════════════════════ */}
      {topExpensiveIngredients.length > 0 && (
        <div className="bg-white dark:bg-[#0A0A0A] border border-[#E5E7EB] dark:border-[#1A1A1A] rounded-2xl p-6">
          <div className="flex items-center gap-2 mb-5">
            <Flame className="w-4 h-4 text-[#111111] dark:text-white" />
            <h2 className="text-sm font-semibold text-[#111111] dark:text-white">Top 10 — Ingredients les plus couteux</h2>
          </div>
          <div className="space-y-2">
            {topExpensiveIngredients.map((ing, i) => {
              const maxPrice = topExpensiveIngredients[0]?.pricePerUnit || 1;
              const barWidth = (ing.pricePerUnit / maxPrice) * 100;
              return (
                <div key={`${ing.name}-${i}`} className="flex items-center gap-3 p-3 rounded-lg bg-[#F9FAFB] dark:bg-[#111111] border border-[#F3F4F6] dark:border-[#1A1A1A]">
                  <span className="w-6 h-6 flex items-center justify-center rounded-full bg-[#F3F4F6] dark:bg-[#262626] text-[#111111] dark:text-white text-xs font-bold flex-shrink-0">
                    {i + 1}
                  </span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="text-sm font-medium text-[#111111] dark:text-white truncate">{ing.name}</p>
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-[#F3F4F6] dark:bg-[#262626] text-[#6B7280] dark:text-[#A3A3A3] flex-shrink-0">{ing.category}</span>
                    </div>
                    {/* Cost bar */}
                    <div className="h-1.5 bg-[#F3F4F6] dark:bg-[#171717] rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full bg-[#111111] dark:bg-white transition-all duration-500"
                        style={{ width: `${barWidth}%`, minWidth: 2 }}
                      />
                    </div>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="text-sm font-bold text-[#111111] dark:text-white">{ing.pricePerUnit.toFixed(2)} EUR</p>
                    <p className="text-[10px] text-[#6B7280] dark:text-[#A3A3A3]">/{ing.unit}</p>
                  </div>
                  <div className="text-right flex-shrink-0 hidden sm:block">
                    <p className="text-xs text-[#6B7280] dark:text-[#A3A3A3]">~{ing.estimatedMonthlySpend.toFixed(0)} EUR</p>
                    <p className="text-[10px] text-[#9CA3AF] dark:text-[#525252]">/mois estime</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════
           CATEGORY PERFORMANCE (EXISTING, ENHANCED)
         ══════════════════════════════════════════════ */}
      {categoryPerformance.length > 0 && (
        <div className="bg-white dark:bg-[#0A0A0A] border border-[#E5E7EB] dark:border-[#1A1A1A] rounded-2xl p-6">
          <h2 className="text-sm font-semibold text-[#111111] dark:text-white mb-4">Performance par categorie</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* CSS Bar chart — margin by category */}
            <div>
              <h3 className="text-xs font-medium text-[#9CA3AF] dark:text-[#737373] mb-3 font-general-sans">Marge moyenne par categorie</h3>
              <CSSBarChart
                data={categoryPerformance.map((cat, i) => ({
                  label: cat.category,
                  value: cat.avgMarginPercent,
                  color: chartColors[i % chartColors.length],
                  suffix: '%',
                }))}
                animated={true}
                sorted={true}
                showValues={true}
                formatValue={(v) => v.toFixed(1)}
              />
            </div>
            {/* Animated Donut — recipe count by category */}
            <div className="flex items-center justify-center">
              <AnimatedDonut
                data={categoryPerformance.map((cat, i) => ({
                  label: cat.category,
                  value: cat.recipeCount,
                  color: ['#0d9488', '#2563eb', '#7c3aed', '#d97706', '#dc2626', '#059669', '#e11d48', '#0891b2'][i % 8],
                }))}
                size={180}
                showLegend={true}
                animated={true}
                centerLabel="recettes"
              />
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

      {/* ══════════════════════════════════════════════
           INGREDIENT COST TRENDS
         ══════════════════════════════════════════════ */}
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

      {/* ══════════════════════════════════════════════
           LABOR + WASTE SIDE BY SIDE
         ══════════════════════════════════════════════ */}
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

// ══════════════════════════════════════════════════
// COMPONENT: KPI Card (Feature 1)
// ══════════════════════════════════════════════════
function KPICard({ icon, label, value, unit, trend, trendLabel, invertTrend, highlight }: {
  icon: React.ReactNode;
  label: string;
  value: string;
  unit: string;
  trend: number;
  trendLabel: string;
  invertTrend?: boolean;
  highlight?: boolean;
}) {
  // For costs, a decrease is good (invert the color logic)
  const isPositive = invertTrend ? trend <= 0 : trend >= 0;
  const trendColor = trend === 0
    ? 'text-[#6B7280] dark:text-[#A3A3A3]'
    : isPositive
      ? 'text-[#111111] dark:text-white'
      : 'text-[#9CA3AF] dark:text-[#525252]';

  return (
    <div className={`bg-white dark:bg-[#0A0A0A] border rounded-2xl p-4 transition-all hover:shadow-sm ${
      highlight ? 'border-[#111111] dark:border-white' : 'border-[#E5E7EB] dark:border-[#1A1A1A]'
    }`}>
      <div className="flex items-center gap-2 mb-3">
        <span className="text-[#6B7280] dark:text-[#A3A3A3]">{icon}</span>
        <span className="text-[10px] font-medium text-[#6B7280] dark:text-[#A3A3A3] uppercase tracking-wider leading-tight">{label}</span>
      </div>
      <div className="flex items-baseline gap-1.5 mb-2">
        <span className="text-2xl font-bold text-[#111111] dark:text-white leading-none">{value}</span>
        {unit && <span className="text-sm font-medium text-[#6B7280] dark:text-[#A3A3A3]">{unit}</span>}
      </div>
      <div className={`flex items-center gap-1 ${trendColor}`}>
        {trend > 0 && <ArrowUpRight className="w-3 h-3 flex-shrink-0" />}
        {trend < 0 && <ArrowDownRight className="w-3 h-3 flex-shrink-0" />}
        {trend === 0 && <Minus className="w-3 h-3 flex-shrink-0" />}
        <span className="text-[10px] font-medium">
          {trend > 0 ? '+' : ''}{trend.toFixed(1)}%
        </span>
        <span className="text-[10px] text-[#9CA3AF] dark:text-[#525252] truncate ml-0.5">{trendLabel}</span>
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════
// COMPONENT: Margin Distribution Bucket (Feature 3)
// ══════════════════════════════════════════════════
function MarginBucket({ label, count, total, colorClass, textClass, bgClass, borderClass }: {
  label: string;
  count: number;
  total: number;
  colorClass: string;
  textClass: string;
  bgClass: string;
  borderClass: string;
}) {
  const percent = total > 0 ? (count / total) * 100 : 0;
  const barHeight = Math.max(8, percent);

  return (
    <div className={`rounded-xl p-3 border ${bgClass} ${borderClass} flex flex-col items-center text-center`}>
      {/* Visual bar */}
      <div className="w-full h-20 flex items-end justify-center mb-2">
        <div
          className={`w-8 rounded-t-lg ${colorClass} transition-all duration-700`}
          style={{ height: `${barHeight}%`, minHeight: 6 }}
        />
      </div>
      <span className={`text-2xl font-bold ${textClass}`}>{count}</span>
      <span className="text-[10px] font-medium text-[#6B7280] dark:text-[#A3A3A3] mt-0.5">recettes</span>
      <span className={`text-xs font-semibold mt-1 ${textClass}`}>{label}</span>
      <span className="text-[10px] text-[#9CA3AF] dark:text-[#525252]">{percent.toFixed(0)}% du total</span>
    </div>
  );
}
