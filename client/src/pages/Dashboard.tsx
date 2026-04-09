import { useState, useEffect, useMemo, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  TrendingUp, ChefHat,
  AlertTriangle, Plus, Printer,
  Package, ClipboardList, FileText,
  Sparkles, ArrowRight, ArrowUpRight, ArrowDownRight,
  Building2, ShoppingBasket, Mic, Check,
  X, Loader2, Copy, Mail, Download, Trophy,
} from 'lucide-react';
import { fetchRecipes, fetchIngredients } from '../services/api';
import type { Recipe, Ingredient } from '../types';
import { useTranslation } from '../hooks/useTranslation';
import { useRestaurant } from '../hooks/useRestaurant';
import { formatCurrency, getCurrencySymbol } from '../utils/currency';
import { trackEvent } from '../utils/analytics';

// ── Unit conversion divisor ────────────────────────────────────────────────
function getUnitDivisor(unit: string): number {
  const u = (unit || '').toLowerCase().trim();
  if (u === 'g') return 1000;
  if (u === 'mg') return 1000000;
  if (u === 'cl') return 100;
  if (u === 'ml') return 1000;
  if (u === 'dl') return 10;
  return 1;
}

// ── Tab definitions ────────────────────────────────────────────────────────
type TabKey = 'overview' | 'margins' | 'costs' | 'profitability' | 'pnl';

// ── Onboarding Steps ───────────────────────────────────────────────────────
const ONBOARDING_STEPS = [
  { id: 'restaurant', label: 'Nommez votre restaurant', icon: Building2, link: '/settings' },
  { id: 'ingredient', label: 'Ajoutez votre premier ingredient', icon: ShoppingBasket, link: '/ingredients' },
  { id: 'recipe', label: 'Creez une recette avec l\'IA', icon: Sparkles, link: '/assistant' },
  { id: 'voice', label: 'Testez la commande vocale', icon: Mic, link: '/assistant' },
  { id: 'mercuriale', label: 'Explorez la mercuriale', icon: TrendingUp, link: '/mercuriale' },
] as const;

const ONBOARDING_STORAGE_KEY = 'onboarding_completed_steps';

function getCompletedSteps(): string[] {
  try {
    const raw = localStorage.getItem(ONBOARDING_STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch { return []; }
}

function saveCompletedSteps(steps: string[]) {
  localStorage.setItem(ONBOARDING_STORAGE_KEY, JSON.stringify(steps));
}

// ── Onboarding Checklist ───────────────────────────────────────────────────
function OnboardingChecklist({ restaurantName, ingredientCount, recipeCount, navigate }: {
  restaurantName: string; ingredientCount: number; recipeCount: number; navigate: (path: string) => void;
}) {
  const [completedSteps, setCompletedSteps] = useState<string[]>(getCompletedSteps);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    const auto: string[] = [];
    if (restaurantName && restaurantName !== 'Mon Restaurant') auto.push('restaurant');
    if (ingredientCount > 0) auto.push('ingredient');
    if (recipeCount > 0) auto.push('recipe');
    const stored = getCompletedSteps();
    const merged = Array.from(new Set([...stored, ...auto]));
    if (merged.length !== stored.length || merged.some(s => !stored.includes(s))) {
      saveCompletedSteps(merged);
      setCompletedSteps(merged);
    }
  }, [restaurantName, ingredientCount, recipeCount]);

  const markDone = useCallback((id: string) => {
    setCompletedSteps(prev => {
      if (prev.includes(id)) return prev;
      const next = [...prev, id];
      saveCompletedSteps(next);
      return next;
    });
  }, []);

  const progress = Math.round((completedSteps.length / ONBOARDING_STEPS.length) * 100);
  const allDone = completedSteps.length === ONBOARDING_STEPS.length;
  const currentStepId = ONBOARDING_STEPS.find(s => !completedSteps.includes(s.id))?.id;

  if (dismissed && allDone) return null;

  return (
    <div className="rounded-2xl border border-[#E5E7EB] dark:border-[#1A1A1A] bg-white dark:bg-black p-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-lg font-bold text-[#111111] dark:text-white font-satoshi">
            {allDone ? 'Bravo ! Vous etes pret' : 'Premiers pas avec RestauMargin'}
          </h3>
          <p className="text-sm text-[#9CA3AF] dark:text-[#737373] mt-0.5">
            {allDone ? 'Toutes les etapes sont completees.' : `${completedSteps.length}/${ONBOARDING_STEPS.length} etapes completees`}
          </p>
        </div>
        {allDone && (
          <button onClick={() => setDismissed(true)} className="text-xs text-[#9CA3AF] hover:text-[#6B7280] transition-colors">
            Masquer
          </button>
        )}
      </div>

      <div className="h-2 bg-[#F3F4F6] dark:bg-[#171717] rounded-full overflow-hidden mb-5">
        <div className="h-full rounded-full bg-teal-500 transition-all duration-700" style={{ width: `${progress}%` }} />
      </div>

      {!allDone && (
        <div className="space-y-2">
          {ONBOARDING_STEPS.map(step => {
            const done = completedSteps.includes(step.id);
            const isCurrent = step.id === currentStepId;
            const Icon = step.icon;
            return (
              <button
                key={step.id}
                onClick={() => {
                  if (step.id === 'voice' || step.id === 'mercuriale') markDone(step.id);
                  navigate(step.link);
                }}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all text-left
                  ${done ? 'bg-teal-50 dark:bg-teal-900/10 border border-teal-200/50 dark:border-teal-800/30'
                    : isCurrent ? 'bg-white dark:bg-[#0A0A0A] border border-teal-400/50 dark:border-teal-500/30 shadow-sm'
                    : 'bg-[#FAFAFA] dark:bg-[#0A0A0A]/30 border border-[#E5E7EB]/50 dark:border-[#1A1A1A]/30 opacity-60'
                  }`}
              >
                <div className={`w-8 h-8 rounded-full flex items-center justify-center
                  ${done ? 'bg-teal-500 text-white' : isCurrent ? 'bg-teal-100 dark:bg-teal-900/40 text-teal-600' : 'bg-[#E5E7EB] dark:bg-[#171717] text-[#9CA3AF]'}`}>
                  {done ? <Check className="w-4 h-4" /> : <Icon className="w-4 h-4" />}
                </div>
                <span className={`text-sm font-medium ${done ? 'text-teal-700 dark:text-teal-300 line-through' : 'text-[#111111] dark:text-white'}`}>
                  {step.label}
                </span>
                {isCurrent && !done && <ArrowRight className="w-4 h-4 ml-auto text-teal-500" />}
              </button>
            );
          })}
        </div>
      )}

      {allDone && (
        <div className="flex items-center gap-3 p-3 bg-teal-50 dark:bg-teal-900/20 rounded-xl border border-teal-200/50 dark:border-teal-800/30">
          <Trophy className="w-5 h-5 text-amber-500" />
          <p className="text-sm text-teal-700 dark:text-teal-300">
            Votre restaurant est configure. Explorez maintenant vos marges et optimisez votre carte !
          </p>
        </div>
      )}
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// MAIN DASHBOARD
// ══════════════════════════════════════════════════════════════════════════════
export default function Dashboard() {
  const { t } = useTranslation();
  const { selectedRestaurant, loading: restaurantLoading } = useRestaurant();
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [ingredients, setIngredients] = useState<Ingredient[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<TabKey>('overview');
  const navigate = useNavigate();

  // ── AI Report state ────────────────────────────────────────────────────
  const [reportModalOpen, setReportModalOpen] = useState(false);
  const [reportLoading, setReportLoading] = useState(false);
  const [reportData, setReportData] = useState<{ report: string; generatedAt: string; keyMetrics: any } | null>(null);
  const [reportCopied, setReportCopied] = useState(false);
  const [reportEmailSending, setReportEmailSending] = useState(false);
  const [reportEmailSent, setReportEmailSent] = useState(false);

  // ── P&L state ──────────────────────────────────────────────────────────
  const [pnlPeriod, setPnlPeriod] = useState<'week' | 'month' | 'year'>('month');
  const [pnlData, setPnlData] = useState<any>(null);
  const [pnlLoading, setPnlLoading] = useState(false);

  // ── Weekly AI Report ───────────────────────────────────────────────────
  const REPORT_CACHE_KEY = 'restaumargin_weekly_report';
  const REPORT_CACHE_TTL = 24 * 60 * 60 * 1000;

  const fetchWeeklyReport = useCallback(async () => {
    try {
      const cached = localStorage.getItem(REPORT_CACHE_KEY);
      if (cached) {
        const parsed = JSON.parse(cached);
        if (Date.now() - new Date(parsed.generatedAt).getTime() < REPORT_CACHE_TTL) {
          setReportData(parsed);
          setReportModalOpen(true);
          return;
        }
        localStorage.removeItem(REPORT_CACHE_KEY);
      }
    } catch { /* ignore */ }

    setReportLoading(true);
    setReportModalOpen(true);
    try {
      const token = localStorage.getItem('token');
      const restaurantId = localStorage.getItem('activeRestaurantId');
      const res = await fetch('/api/ai/weekly-report', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
          ...(restaurantId ? { 'X-Restaurant-Id': restaurantId } : {}),
        },
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({ error: 'Erreur serveur' }));
        throw new Error(err.error || 'Erreur serveur');
      }
      const data = await res.json();
      setReportData(data);
      localStorage.setItem(REPORT_CACHE_KEY, JSON.stringify(data));
    } catch (err: any) {
      setReportData({ report: `Erreur: ${err.message}`, generatedAt: new Date().toISOString(), keyMetrics: null });
    } finally {
      setReportLoading(false);
    }
  }, []);

  const copyReport = useCallback(() => {
    if (!reportData?.report) return;
    navigator.clipboard.writeText(reportData.report).then(() => {
      setReportCopied(true);
      setTimeout(() => setReportCopied(false), 2000);
    });
  }, [reportData]);

  const sendReportByEmail = useCallback(async () => {
    if (!reportData) return;
    setReportEmailSending(true);
    try {
      const token = localStorage.getItem('token');
      const restaurantId = localStorage.getItem('activeRestaurantId');
      const res = await fetch('/api/ai/weekly-report/send-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
          ...(restaurantId ? { 'X-Restaurant-Id': restaurantId } : {}),
        },
        body: JSON.stringify({ report: reportData.report, keyMetrics: reportData.keyMetrics }),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({ error: 'Erreur' }));
        throw new Error(err.error || 'Erreur envoi email');
      }
      setReportEmailSent(true);
      setTimeout(() => setReportEmailSent(false), 3000);
    } catch (err: any) {
      alert(err.message);
    } finally {
      setReportEmailSending(false);
    }
  }, [reportData]);

  // ── Tab definitions ────────────────────────────────────────────────────
  const TABS: { key: TabKey; label: string }[] = [
    { key: 'overview', label: t("dashboard.tabOverview") },
    { key: 'margins', label: t("dashboard.tabMargins") },
    { key: 'costs', label: t("dashboard.tabCosts") },
    { key: 'profitability', label: t("dashboard.tabProfitability") },
    { key: 'pnl', label: 'P&L' },
  ];

  // ── Data fetching ──────────────────────────────────────────────────────
  useEffect(() => {
    trackEvent('page_view', { page: 'dashboard' });
  }, []);

  useEffect(() => {
    if (restaurantLoading || !selectedRestaurant) return;
    Promise.all([fetchRecipes(), fetchIngredients()])
      .then(([r, i]) => { setRecipes(r); setIngredients(i); })
      .catch(() => console.error('Erreur chargement'))
      .finally(() => setLoading(false));
  }, [selectedRestaurant, restaurantLoading]);

  // ── P&L data fetch ─────────────────────────────────────────────────────
  useEffect(() => {
    if (activeTab !== 'pnl' || restaurantLoading || !selectedRestaurant) return;
    setPnlLoading(true);
    const token = localStorage.getItem('token');
    const restaurantId = localStorage.getItem('activeRestaurantId');
    fetch(`/api/analytics/pnl?period=${pnlPeriod}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        ...(restaurantId ? { 'X-Restaurant-Id': restaurantId } : {}),
      },
    })
      .then(r => r.ok ? r.json() : null)
      .then(data => { if (data) setPnlData(data); })
      .catch(() => {})
      .finally(() => setPnlLoading(false));
  }, [activeTab, pnlPeriod, selectedRestaurant, restaurantLoading]);

  // ── Computed stats ─────────────────────────────────────────────────────
  const stats = useMemo(() => {
    const totalRecipes = recipes.length;
    if (totalRecipes === 0) return null;

    const avgMargin = recipes.reduce((s, r) => s + r.margin.marginPercent, 0) / totalRecipes;
    const avgFoodCost = recipes.reduce((s, r) => s + r.margin.costPerPortion, 0) / totalRecipes;
    const avgTotalCost = recipes.reduce((s, r) => s + (r.margin.totalCostPerPortion || r.margin.costPerPortion), 0) / totalRecipes;
    const avgSellingPrice = recipes.reduce((s, r) => s + r.sellingPrice, 0) / totalRecipes;
    const avgFoodCostPct = avgSellingPrice > 0 ? (avgFoodCost / avgSellingPrice) * 100 : 0;

    // Sorted lists
    const sortedByMarginAsc = [...recipes].sort((a, b) => a.margin.marginPercent - b.margin.marginPercent);
    const sortedByMarginDesc = [...recipes].sort((a, b) => b.margin.marginPercent - a.margin.marginPercent);
    const sortedByCostDesc = [...recipes].sort((a, b) =>
      (b.margin.totalCostPerPortion || b.margin.costPerPortion) - (a.margin.totalCostPerPortion || a.margin.costPerPortion));

    // Alerts
    const lowMarginRecipes = recipes.filter(r => r.margin.marginPercent < 50);
    const alertRecipes = recipes.filter(r => r.margin.marginPercent < 60);

    // Category breakdown for costs
    const foodCostMap = new Map<string, number>();
    recipes.forEach(r => {
      (r.ingredients || []).forEach(ri => {
        if (!ri.ingredient) return;
        const cat = ri.ingredient.category || 'Autres';
        const cost = (ri.quantity / getUnitDivisor(ri.ingredient.unit)) * ri.ingredient.pricePerUnit * (1 + ri.wastePercent / 100);
        foodCostMap.set(cat, (foodCostMap.get(cat) || 0) + cost);
      });
    });
    const foodCostData = Array.from(foodCostMap.entries())
      .map(([name, value]) => ({ name, value: Math.round(value * 100) / 100 }))
      .sort((a, b) => b.value - a.value);
    const totalFoodCostAll = foodCostData.reduce((s, d) => s + d.value, 0);

    return {
      totalRecipes, avgMargin, avgFoodCost, avgTotalCost, avgFoodCostPct,
      sortedByMarginAsc, sortedByMarginDesc, sortedByCostDesc,
      lowMarginRecipes, alertRecipes,
      foodCostData, totalFoodCostAll,
    };
  }, [recipes]);

  // ── Quick alerts ───────────────────────────────────────────────────────
  const alertSummary = useMemo(() => {
    const items: string[] = [];
    const lowMargin = recipes.filter(r => r.margin?.marginPercent < 50).length;
    const noPrice = ingredients.filter(i => !i.pricePerUnit || i.pricePerUnit === 0).length;
    if (lowMargin > 0) items.push(`${lowMargin} marge${lowMargin > 1 ? 's' : ''} < 50%`);
    if (noPrice > 0) items.push(`${noPrice} ingredient${noPrice > 1 ? 's' : ''} sans prix`);
    return { count: items.length, items };
  }, [recipes, ingredients]);

  // ── Loading ────────────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="animate-spin rounded-full h-10 w-10 border-4 border-teal-600 border-t-transparent" />
      </div>
    );
  }

  // ── Margin color helper ────────────────────────────────────────────────
  const marginColor = (pct: number) =>
    pct >= 70 ? 'text-emerald-600 dark:text-emerald-400'
    : pct >= 50 ? 'text-amber-600 dark:text-amber-400'
    : 'text-red-600 dark:text-red-400';

  const marginBg = (pct: number) =>
    pct >= 70 ? 'bg-emerald-50 dark:bg-emerald-900/20'
    : pct >= 50 ? 'bg-amber-50 dark:bg-amber-900/20'
    : 'bg-red-50 dark:bg-red-900/20';

  const foodCostColor = (pct: number) =>
    pct <= 30 ? 'text-emerald-600 dark:text-emerald-400'
    : pct <= 35 ? 'text-amber-600 dark:text-amber-400'
    : 'text-red-600 dark:text-red-400';

  const foodCostBg = (pct: number) =>
    pct <= 30 ? 'bg-emerald-50 dark:bg-emerald-900/20'
    : pct <= 35 ? 'bg-amber-50 dark:bg-amber-900/20'
    : 'bg-red-50 dark:bg-red-900/20';

  // ── Bar width helper ───────────────────────────────────────────────────
  const barPct = (val: number, max: number) => max > 0 ? `${Math.min((val / max) * 100, 100)}%` : '0%';

  const barColor = (pct: number) =>
    pct >= 70 ? '#059669' : pct >= 50 ? '#D97706' : '#DC2626';

  // ══════════════════════════════════════════════════════════════════════════
  // RENDER
  // ══════════════════════════════════════════════════════════════════════════
  return (
    <div className="space-y-6 max-w-6xl mx-auto">

      {/* ── HEADER ──────────────────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black font-satoshi text-[#111111] dark:text-white tracking-tight">
            {t("dashboard.title")}
          </h1>
          <p className="text-sm text-[#9CA3AF] dark:text-[#737373] mt-1 font-general-sans">
            {stats ? stats.totalRecipes : 0} {t("dashboard.recipesCount")} · {ingredients.length} {t("dashboard.ingredientsCount")}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => navigate('/recipes?action=new')}
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#111111] dark:bg-white text-white dark:text-black text-sm font-medium rounded-xl hover:bg-[#333] dark:hover:bg-[#E5E5E5] transition-colors"
          >
            <Plus className="w-4 h-4" /> {t("dashboard.newRecipe")}
          </button>
          <button
            onClick={() => navigate('/ingredients?action=new')}
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-white dark:bg-[#0A0A0A] text-[#6B7280] dark:text-[#E5E5E5] text-sm font-medium rounded-xl border border-[#E5E7EB] dark:border-[#1A1A1A] hover:bg-[#FAFAFA] dark:hover:bg-[#171717] transition-colors"
          >
            <Package className="w-4 h-4" /> {t("dashboard.addIngredient")}
          </button>
          <Link to="/recipes" className="hidden sm:inline-flex items-center gap-1.5 px-4 py-2 bg-white dark:bg-[#0A0A0A] text-[#6B7280] dark:text-[#E5E5E5] text-sm font-medium rounded-xl border border-[#E5E7EB] dark:border-[#1A1A1A] hover:bg-[#FAFAFA] dark:hover:bg-[#171717] transition-colors">
            <ClipboardList className="w-4 h-4" /> {t("dashboard.viewRecipes")}
          </Link>
          <Link to="/inventory" className="hidden sm:inline-flex items-center gap-1.5 px-4 py-2 bg-white dark:bg-[#0A0A0A] text-[#6B7280] dark:text-[#E5E5E5] text-sm font-medium rounded-xl border border-[#E5E7EB] dark:border-[#1A1A1A] hover:bg-[#FAFAFA] dark:hover:bg-[#171717] transition-colors">
            <FileText className="w-4 h-4" /> {t("dashboard.viewInventory")}
          </Link>
          <button
            onClick={fetchWeeklyReport}
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#111111] dark:bg-white text-white dark:text-black text-sm font-medium rounded-xl hover:bg-[#333] dark:hover:bg-[#E5E5E5] transition-colors no-print"
          >
            <Sparkles className="w-4 h-4" /> <span className="hidden sm:inline">Rapport</span> IA
          </button>
          <button
            onClick={() => window.print()}
            className="hidden sm:inline-flex items-center gap-1.5 px-4 py-2 bg-white dark:bg-[#0A0A0A] text-[#6B7280] dark:text-[#E5E5E5] text-sm font-medium rounded-xl border border-[#E5E7EB] dark:border-[#1A1A1A] hover:bg-[#FAFAFA] dark:hover:bg-[#171717] transition-colors no-print"
          >
            <Printer className="w-4 h-4" /> {t("dashboard.print")}
          </button>
        </div>
      </div>

      {/* ── 3 BIG KPI CARDS ─────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Marge moyenne */}
        <div className="rounded-2xl border border-[#E5E7EB] dark:border-[#1A1A1A] bg-white dark:bg-black p-6">
          <p className="text-xs font-medium uppercase tracking-wider text-[#9CA3AF] dark:text-[#737373] mb-2">Marge moyenne</p>
          <div className="flex items-end gap-2">
            <span className={`text-4xl font-black font-satoshi tabular-nums ${stats ? marginColor(stats.avgMargin) : 'text-[#9CA3AF]'}`}>
              {stats ? stats.avgMargin.toFixed(1) : '--'}%
            </span>
            {stats && (
              <span className={`mb-1 ${stats.avgMargin >= 70 ? 'text-emerald-500' : 'text-red-400'}`}>
                {stats.avgMargin >= 70 ? <ArrowUpRight className="w-5 h-5" /> : <ArrowDownRight className="w-5 h-5" />}
              </span>
            )}
          </div>
          <p className="text-xs text-[#9CA3AF] dark:text-[#737373] mt-2">
            {stats ? (stats.avgMargin >= 70 ? 'Objectif atteint' : 'Objectif : 70%') : 'Ajoutez des recettes'}
          </p>
          {stats && (
            <div className="mt-3 h-2 bg-[#F3F4F6] dark:bg-[#171717] rounded-full overflow-hidden">
              <div className="h-full rounded-full transition-all duration-700" style={{ width: `${Math.min(stats.avgMargin, 100)}%`, backgroundColor: barColor(stats.avgMargin) }} />
            </div>
          )}
        </div>

        {/* Food Cost moyen */}
        <div className="rounded-2xl border border-[#E5E7EB] dark:border-[#1A1A1A] bg-white dark:bg-black p-6">
          <p className="text-xs font-medium uppercase tracking-wider text-[#9CA3AF] dark:text-[#737373] mb-2">Food Cost moyen</p>
          <div className="flex items-end gap-2">
            <span className={`text-4xl font-black font-satoshi tabular-nums ${stats ? foodCostColor(stats.avgFoodCostPct) : 'text-[#9CA3AF]'}`}>
              {stats ? stats.avgFoodCostPct.toFixed(1) : '--'}%
            </span>
            {stats && (
              <span className={`mb-1 ${stats.avgFoodCostPct <= 30 ? 'text-emerald-500' : 'text-red-400'}`}>
                {stats.avgFoodCostPct <= 30 ? <ArrowDownRight className="w-5 h-5" /> : <ArrowUpRight className="w-5 h-5" />}
              </span>
            )}
          </div>
          <p className="text-xs text-[#9CA3AF] dark:text-[#737373] mt-2">
            {stats ? (stats.avgFoodCostPct <= 30 ? 'Excellent' : stats.avgFoodCostPct <= 35 ? 'Objectif : < 30%' : 'Trop eleve, objectif < 30%') : 'Ajoutez des recettes'}
          </p>
          {stats && (
            <div className="mt-3 h-2 bg-[#F3F4F6] dark:bg-[#171717] rounded-full overflow-hidden">
              <div className="h-full rounded-full transition-all duration-700 bg-red-500" style={{ width: `${Math.min(stats.avgFoodCostPct * 2.5, 100)}%` }} />
            </div>
          )}
        </div>

        {/* Cout moyen total */}
        <div className="rounded-2xl border border-[#E5E7EB] dark:border-[#1A1A1A] bg-white dark:bg-black p-6">
          <p className="text-xs font-medium uppercase tracking-wider text-[#9CA3AF] dark:text-[#737373] mb-2">Cout moyen / portion</p>
          <span className="text-4xl font-black font-satoshi tabular-nums text-[#111111] dark:text-white">
            {stats && stats.avgTotalCost > 0 ? formatCurrency(stats.avgTotalCost) : '--'}
          </span>
          <p className="text-xs text-[#9CA3AF] dark:text-[#737373] mt-2">
            {stats ? `Food cost : ${formatCurrency(stats.avgFoodCost)}` : 'Ajoutez des recettes'}
          </p>
        </div>
      </div>

      {/* ── ALERT BANNER ────────────────────────────────────────────────── */}
      {alertSummary.count > 0 && (
        <div className="flex items-center gap-3 px-5 py-3 rounded-2xl border border-amber-200 dark:border-amber-800/40 bg-amber-50 dark:bg-amber-900/10">
          <AlertTriangle className="w-5 h-5 text-amber-600 dark:text-amber-400 flex-shrink-0" />
          <p className="text-sm font-medium text-amber-800 dark:text-amber-300 flex-1">
            {alertSummary.count} alerte{alertSummary.count > 1 ? 's' : ''} : {alertSummary.items.join(', ')}
          </p>
          <Link to="/recipes" className="text-xs font-medium text-amber-700 dark:text-amber-400 hover:underline flex-shrink-0">
            Voir details <ArrowRight className="w-3 h-3 inline" />
          </Link>
        </div>
      )}

      {/* ── TABS ────────────────────────────────────────────────────────── */}
      <div className="flex gap-1 p-1 bg-[#F3F4F6] dark:bg-[#0A0A0A] rounded-xl overflow-x-auto">
        {TABS.map(tab => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`px-4 py-2 text-sm font-medium rounded-lg transition-all whitespace-nowrap
              ${activeTab === tab.key
                ? 'bg-white dark:bg-[#171717] text-[#111111] dark:text-white shadow-sm'
                : 'text-[#9CA3AF] dark:text-[#737373] hover:text-[#6B7280] dark:hover:text-[#A3A3A3]'
              }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* ── TAB CONTENT ─────────────────────────────────────────────────── */}

      {/* OVERVIEW TAB */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* Top 5 worst margins */}
          {stats && stats.sortedByMarginAsc.length > 0 && (
            <div className="rounded-2xl border border-[#E5E7EB] dark:border-[#1A1A1A] bg-white dark:bg-black p-6">
              <h3 className="text-base font-bold text-[#111111] dark:text-white font-satoshi mb-4">
                Top 5 — Marges a ameliorer
              </h3>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-[#E5E7EB] dark:border-[#1A1A1A]">
                      <th className="text-left py-2 text-xs font-semibold text-[#9CA3AF] dark:text-[#737373] uppercase tracking-wider">Recette</th>
                      <th className="text-right py-2 text-xs font-semibold text-[#9CA3AF] dark:text-[#737373] uppercase tracking-wider">Cout</th>
                      <th className="text-right py-2 text-xs font-semibold text-[#9CA3AF] dark:text-[#737373] uppercase tracking-wider">Prix vente</th>
                      <th className="text-right py-2 text-xs font-semibold text-[#9CA3AF] dark:text-[#737373] uppercase tracking-wider">Marge %</th>
                    </tr>
                  </thead>
                  <tbody>
                    {stats.sortedByMarginAsc.slice(0, 5).map((recipe, i) => (
                      <tr key={recipe.id} className="border-b border-[#F3F4F6] dark:border-[#1A1A1A]/50 hover:bg-[#FAFAFA] dark:hover:bg-[#0A0A0A] transition-colors">
                        <td className="py-3">
                          <Link to={`/recipes/${recipe.id}`} className="flex items-center gap-2 group">
                            <span className="text-xs font-bold text-[#9CA3AF] dark:text-[#525252] w-5">{i + 1}</span>
                            <span className="font-medium text-[#111111] dark:text-[#E5E5E5] truncate max-w-[200px] group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors">
                              {recipe.name}
                            </span>
                          </Link>
                        </td>
                        <td className="py-3 text-right text-[#6B7280] dark:text-[#737373] tabular-nums">
                          {formatCurrency(recipe.margin.totalCostPerPortion || recipe.margin.costPerPortion)}
                        </td>
                        <td className="py-3 text-right text-[#111111] dark:text-[#A3A3A3] font-medium tabular-nums">
                          {formatCurrency(recipe.sellingPrice)}
                        </td>
                        <td className="py-3 text-right">
                          <span className={`inline-block px-2 py-0.5 rounded-md text-xs font-bold tabular-nums ${marginColor(recipe.margin.marginPercent)} ${marginBg(recipe.margin.marginPercent)}`}>
                            {recipe.margin.marginPercent.toFixed(1)}%
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <Link to="/recipes" className="inline-flex items-center gap-1 text-xs text-teal-600 dark:text-teal-400 hover:underline font-medium mt-4">
                Voir toutes les recettes <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
          )}

          {/* Onboarding — only if < 5 recipes */}
          {recipes.length < 5 && (
            <OnboardingChecklist
              restaurantName={selectedRestaurant?.name || ''}
              ingredientCount={ingredients.length}
              recipeCount={recipes.length}
              navigate={navigate}
            />
          )}

          {/* Empty state */}
          {(!stats || stats.totalRecipes === 0) && recipes.length === 0 && (
            <div className="text-center py-16 rounded-2xl border border-[#E5E7EB] dark:border-[#1A1A1A] bg-white dark:bg-black">
              <ChefHat className="w-14 h-14 mx-auto text-[#D1D5DB] dark:text-[#525252] mb-4" />
              <h3 className="text-lg font-semibold text-[#111111] dark:text-white mb-2">{t("dashboard.welcome")}</h3>
              <p className="text-[#9CA3AF] dark:text-[#737373] mb-6 max-w-md mx-auto">{t("dashboard.emptyStateDesc")}</p>
              <div className="flex gap-3 justify-center">
                <Link to="/ingredients" className="inline-flex items-center gap-1.5 px-5 py-2.5 bg-[#111111] dark:bg-white text-white dark:text-black text-sm font-medium rounded-xl">
                  <Plus className="w-4 h-4" /> {t("dashboard.addIngredients")}
                </Link>
                <Link to="/recipes" className="inline-flex items-center gap-1.5 px-5 py-2.5 bg-white dark:bg-[#0A0A0A] text-[#6B7280] dark:text-[#E5E5E5] text-sm font-medium rounded-xl border border-[#E5E7EB] dark:border-[#1A1A1A]">
                  {t("dashboard.createRecipe")}
                </Link>
              </div>
            </div>
          )}
        </div>
      )}

      {/* MARGINS TAB */}
      {activeTab === 'margins' && stats && (
        <div className="rounded-2xl border border-[#E5E7EB] dark:border-[#1A1A1A] bg-white dark:bg-black p-6">
          <h3 className="text-base font-bold text-[#111111] dark:text-white font-satoshi mb-4">
            Marge par recette
          </h3>
          <div className="space-y-3">
            {stats.sortedByMarginDesc.map((recipe, i) => {
              const max = stats.sortedByMarginDesc[0]?.margin.marginPercent || 100;
              return (
                <Link key={recipe.id} to={`/recipes/${recipe.id}`} className="block group">
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-bold text-[#9CA3AF] dark:text-[#737373] w-5 text-right tabular-nums">{i + 1}</span>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm font-medium text-[#111111] dark:text-white truncate pr-2 group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors">
                          {recipe.name}
                        </span>
                        <span className="text-sm font-bold tabular-nums flex-shrink-0" style={{ color: barColor(recipe.margin.marginPercent) }}>
                          {recipe.margin.marginPercent.toFixed(1)}%
                        </span>
                      </div>
                      <div className="h-2 bg-[#F3F4F6] dark:bg-[#171717] rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full transition-all duration-500"
                          style={{ width: barPct(recipe.margin.marginPercent, max), backgroundColor: barColor(recipe.margin.marginPercent) }}
                        />
                      </div>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      )}

      {/* COSTS TAB */}
      {activeTab === 'costs' && stats && (
        <div className="space-y-6">
          {/* Cost per recipe table */}
          <div className="rounded-2xl border border-[#E5E7EB] dark:border-[#1A1A1A] bg-white dark:bg-black p-6">
            <h3 className="text-base font-bold text-[#111111] dark:text-white font-satoshi mb-4">
              Cout par recette
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-[#E5E7EB] dark:border-[#1A1A1A]">
                    <th className="text-left py-2 text-xs font-semibold text-[#9CA3AF] uppercase tracking-wider">Recette</th>
                    <th className="text-right py-2 text-xs font-semibold text-[#9CA3AF] uppercase tracking-wider">Food Cost</th>
                    <th className="text-right py-2 text-xs font-semibold text-[#9CA3AF] uppercase tracking-wider">Cout Total</th>
                    <th className="text-right py-2 text-xs font-semibold text-[#9CA3AF] uppercase tracking-wider">% du prix</th>
                  </tr>
                </thead>
                <tbody>
                  {stats.sortedByCostDesc.map(recipe => {
                    const totalCost = recipe.margin.totalCostPerPortion || recipe.margin.costPerPortion;
                    const pctOfPrice = recipe.sellingPrice > 0 ? (totalCost / recipe.sellingPrice) * 100 : 0;
                    return (
                      <tr key={recipe.id} className="border-b border-[#F3F4F6] dark:border-[#1A1A1A]/50 hover:bg-[#FAFAFA] dark:hover:bg-[#0A0A0A] transition-colors">
                        <td className="py-3">
                          <Link to={`/recipes/${recipe.id}`} className="font-medium text-[#111111] dark:text-[#E5E5E5] hover:text-teal-600 dark:hover:text-teal-400 transition-colors">
                            {recipe.name}
                          </Link>
                        </td>
                        <td className="py-3 text-right text-[#6B7280] tabular-nums">{formatCurrency(recipe.margin.costPerPortion)}</td>
                        <td className="py-3 text-right font-medium text-[#111111] dark:text-white tabular-nums">{formatCurrency(totalCost)}</td>
                        <td className="py-3 text-right">
                          <span className={`text-xs font-bold tabular-nums ${foodCostColor(pctOfPrice)}`}>
                            {pctOfPrice.toFixed(1)}%
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Cost by category */}
          {stats.foodCostData.length > 0 && (
            <div className="rounded-2xl border border-[#E5E7EB] dark:border-[#1A1A1A] bg-white dark:bg-black p-6">
              <h3 className="text-base font-bold text-[#111111] dark:text-white font-satoshi mb-4">
                Cout par categorie d'ingredient
              </h3>
              <div className="space-y-3">
                {stats.foodCostData.map(cat => {
                  const pct = stats.totalFoodCostAll > 0 ? (cat.value / stats.totalFoodCostAll) * 100 : 0;
                  return (
                    <div key={cat.name}>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm font-medium text-[#111111] dark:text-white">{cat.name}</span>
                        <div className="flex items-center gap-3">
                          <span className="text-xs text-[#9CA3AF]">{pct.toFixed(0)}%</span>
                          <span className="text-sm font-bold text-[#111111] dark:text-white tabular-nums">{formatCurrency(cat.value)}</span>
                        </div>
                      </div>
                      <div className="h-2 bg-[#F3F4F6] dark:bg-[#171717] rounded-full overflow-hidden">
                        <div className="h-full rounded-full bg-teal-500 transition-all duration-500" style={{ width: `${pct}%` }} />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}

      {/* PROFITABILITY TAB */}
      {activeTab === 'profitability' && stats && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Best 5 */}
            <div className="rounded-2xl border border-[#E5E7EB] dark:border-[#1A1A1A] bg-white dark:bg-black p-6">
              <h3 className="text-base font-bold text-emerald-600 dark:text-emerald-400 font-satoshi mb-4">
                5 meilleures recettes
              </h3>
              <div className="space-y-3">
                {stats.sortedByMarginDesc.slice(0, 5).map((r, i) => (
                  <Link key={r.id} to={`/recipes/${r.id}`} className="flex items-center justify-between py-2 border-b border-[#F3F4F6] dark:border-[#1A1A1A]/50 last:border-0 group">
                    <div className="flex items-center gap-2 min-w-0">
                      <span className="text-xs font-bold text-[#9CA3AF] w-4">{i + 1}</span>
                      <span className="text-sm font-medium text-[#111111] dark:text-white truncate group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors">{r.name}</span>
                    </div>
                    <span className={`text-sm font-bold tabular-nums flex-shrink-0 ${marginColor(r.margin.marginPercent)}`}>
                      {r.margin.marginPercent.toFixed(1)}%
                    </span>
                  </Link>
                ))}
              </div>
            </div>

            {/* Worst 5 */}
            <div className="rounded-2xl border border-[#E5E7EB] dark:border-[#1A1A1A] bg-white dark:bg-black p-6">
              <h3 className="text-base font-bold text-red-600 dark:text-red-400 font-satoshi mb-4">
                5 recettes a ameliorer
              </h3>
              <div className="space-y-3">
                {stats.sortedByMarginAsc.slice(0, 5).map((r, i) => (
                  <Link key={r.id} to={`/recipes/${r.id}`} className="flex items-center justify-between py-2 border-b border-[#F3F4F6] dark:border-[#1A1A1A]/50 last:border-0 group">
                    <div className="flex items-center gap-2 min-w-0">
                      <span className="text-xs font-bold text-[#9CA3AF] w-4">{i + 1}</span>
                      <span className="text-sm font-medium text-[#111111] dark:text-white truncate group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors">{r.name}</span>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <span className="text-xs text-[#9CA3AF]">{formatCurrency(r.sellingPrice)}</span>
                      <span className={`text-sm font-bold tabular-nums ${marginColor(r.margin.marginPercent)}`}>
                        {r.margin.marginPercent.toFixed(1)}%
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>

          {/* Margin distribution */}
          <div className="rounded-2xl border border-[#E5E7EB] dark:border-[#1A1A1A] bg-white dark:bg-black p-6">
            <h3 className="text-base font-bold text-[#111111] dark:text-white font-satoshi mb-4">
              Distribution des marges
            </h3>
            <div className="grid grid-cols-5 gap-1.5 sm:gap-3">
              {[
                { label: '< 50%', count: recipes.filter(r => r.margin.marginPercent < 50).length, color: '#dc2626' },
                { label: '50-60%', count: recipes.filter(r => r.margin.marginPercent >= 50 && r.margin.marginPercent < 60).length, color: '#ea580c' },
                { label: '60-70%', count: recipes.filter(r => r.margin.marginPercent >= 60 && r.margin.marginPercent < 70).length, color: '#d97706' },
                { label: '70-80%', count: recipes.filter(r => r.margin.marginPercent >= 70 && r.margin.marginPercent < 80).length, color: '#65a30d' },
                { label: '> 80%', count: recipes.filter(r => r.margin.marginPercent >= 80).length, color: '#059669' },
              ].map(bucket => {
                const maxCount = Math.max(...recipes.map(() => 1), recipes.length);
                const height = maxCount > 0 ? Math.max((bucket.count / maxCount) * 80, 4) : 4;
                return (
                  <div key={bucket.label} className="flex flex-col items-center gap-2">
                    <div className="w-full h-20 flex items-end justify-center">
                      <div
                        className="w-full max-w-[40px] rounded-t-md transition-all duration-500"
                        style={{ height: `${height}px`, backgroundColor: bucket.color }}
                      />
                    </div>
                    <span className="text-lg font-black text-[#111111] dark:text-white tabular-nums">{bucket.count}</span>
                    <span className="text-xs text-[#9CA3AF] dark:text-[#737373]">{bucket.label}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* P&L TAB */}
      {activeTab === 'pnl' && (
        <div className="space-y-6">
          {/* Period selector */}
          <div className="flex gap-2">
            {(['week', 'month', 'year'] as const).map(p => (
              <button
                key={p}
                onClick={() => setPnlPeriod(p)}
                className={`px-4 py-2 text-sm font-medium rounded-lg transition-all
                  ${pnlPeriod === p
                    ? 'bg-[#111111] dark:bg-white text-white dark:text-black'
                    : 'bg-white dark:bg-[#0A0A0A] text-[#9CA3AF] border border-[#E5E7EB] dark:border-[#1A1A1A] hover:text-[#6B7280]'
                  }`}
              >
                {p === 'week' ? 'Semaine' : p === 'month' ? 'Mois' : 'Annee'}
              </button>
            ))}
          </div>

          {pnlLoading ? (
            <div className="flex items-center justify-center py-16">
              <div className="animate-spin rounded-full h-8 w-8 border-4 border-teal-600 border-t-transparent" />
            </div>
          ) : pnlData ? (
            <div className="rounded-2xl border border-[#E5E7EB] dark:border-[#1A1A1A] bg-white dark:bg-black p-6">
              <h3 className="text-base font-bold text-[#111111] dark:text-white font-satoshi mb-6">Compte de resultat</h3>
              <div className="space-y-4">
                {/* CA */}
                <div className="flex items-center justify-between py-3 border-b border-[#E5E7EB] dark:border-[#1A1A1A]">
                  <span className="text-sm font-medium text-[#111111] dark:text-white">Chiffre d'affaires</span>
                  <span className="text-lg font-black text-[#111111] dark:text-white tabular-nums">{formatCurrency(pnlData.revenue)}</span>
                </div>
                {/* Food cost */}
                <div className="flex items-center justify-between py-3 border-b border-[#E5E7EB] dark:border-[#1A1A1A]">
                  <div>
                    <span className="text-sm font-medium text-[#111111] dark:text-white">Cout matieres</span>
                    <span className="text-xs text-[#9CA3AF] ml-2">{pnlData.foodCostPercent}% du CA</span>
                  </div>
                  <span className="text-lg font-bold text-red-600 dark:text-red-400 tabular-nums">- {formatCurrency(pnlData.foodCost)}</span>
                </div>
                {/* Labor cost */}
                {pnlData.laborCost > 0 && (
                  <div className="flex items-center justify-between py-3 border-b border-[#E5E7EB] dark:border-[#1A1A1A]">
                    <div>
                      <span className="text-sm font-medium text-[#111111] dark:text-white">Cout main d'oeuvre</span>
                      <span className="text-xs text-[#9CA3AF] ml-2">{pnlData.laborCostPercent}% du CA</span>
                    </div>
                    <span className="text-lg font-bold text-red-600 dark:text-red-400 tabular-nums">- {formatCurrency(pnlData.laborCost)}</span>
                  </div>
                )}
                {/* Gross margin */}
                <div className={`flex items-center justify-between py-4 rounded-xl px-4 ${
                  pnlData.grossMargin >= 0 ? 'bg-emerald-50 dark:bg-emerald-900/10' : 'bg-red-50 dark:bg-red-900/10'
                }`}>
                  <div>
                    <span className="text-sm font-bold text-[#111111] dark:text-white">= Marge brute</span>
                    <span className={`text-xs ml-2 font-bold ${pnlData.grossMargin >= 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-600 dark:text-red-400'}`}>
                      {pnlData.grossMarginPercent}%
                    </span>
                  </div>
                  <span className={`text-xl font-black tabular-nums ${pnlData.grossMargin >= 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-600 dark:text-red-400'}`}>
                    {formatCurrency(pnlData.grossMargin)}
                  </span>
                </div>
              </div>
            </div>
          ) : stats ? (
            /* Fallback P&L from local recipe data */
            <div className="rounded-2xl border border-[#E5E7EB] dark:border-[#1A1A1A] bg-white dark:bg-black p-6">
              <h3 className="text-base font-bold text-[#111111] dark:text-white font-satoshi mb-6">Estimation P&L (donnees locales)</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between py-3 border-b border-[#E5E7EB] dark:border-[#1A1A1A]">
                  <span className="text-sm text-[#111111] dark:text-white">Cout moyen / portion</span>
                  <span className="text-lg font-bold text-[#111111] dark:text-white tabular-nums">{formatCurrency(stats.avgTotalCost)}</span>
                </div>
                <div className="flex items-center justify-between py-3 border-b border-[#E5E7EB] dark:border-[#1A1A1A]">
                  <span className="text-sm text-[#111111] dark:text-white">Food Cost moyen</span>
                  <span className={`text-lg font-bold tabular-nums ${foodCostColor(stats.avgFoodCostPct)}`}>{stats.avgFoodCostPct.toFixed(1)}%</span>
                </div>
                <div className={`flex items-center justify-between py-4 rounded-xl px-4 ${marginBg(stats.avgMargin)}`}>
                  <span className="text-sm font-bold text-[#111111] dark:text-white">Marge moyenne</span>
                  <span className={`text-xl font-black tabular-nums ${marginColor(stats.avgMargin)}`}>{stats.avgMargin.toFixed(1)}%</span>
                </div>
              </div>
            </div>
          ) : null}
        </div>
      )}

      {/* No stats fallback for margin/cost/profitability tabs */}
      {activeTab !== 'overview' && activeTab !== 'pnl' && !stats && (
        <div className="text-center py-16 rounded-2xl border border-[#E5E7EB] dark:border-[#1A1A1A] bg-white dark:bg-black">
          <ChefHat className="w-12 h-12 mx-auto text-[#D1D5DB] dark:text-[#525252] mb-3" />
          <p className="text-sm text-[#9CA3AF]">Ajoutez des recettes pour voir les analyses</p>
          <Link to="/recipes?action=new" className="inline-flex items-center gap-1.5 px-4 py-2 mt-4 bg-[#111111] dark:bg-white text-white dark:text-black text-sm font-medium rounded-xl">
            <Plus className="w-4 h-4" /> Creer une recette
          </Link>
        </div>
      )}

      {/* ── WEEKLY AI REPORT MODAL ──────────────────────────────────────── */}
      {reportModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 no-print">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setReportModalOpen(false)} />
          <div className="relative w-full max-w-3xl max-h-[90vh] overflow-hidden bg-white dark:bg-black rounded-2xl border border-[#E5E7EB] dark:border-[#1A1A1A] shadow-2xl flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-[#E5E7EB] dark:border-[#1A1A1A]">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-[#111111] dark:bg-white rounded-lg">
                  <Sparkles className="w-5 h-5 text-white dark:text-black" />
                </div>
                <div>
                  <h3 className="text-lg font-bold font-satoshi text-[#111111] dark:text-white">Rapport Hebdomadaire IA</h3>
                  {reportData?.generatedAt && (
                    <p className="text-xs text-[#9CA3AF] dark:text-[#737373]">
                      {new Date(reportData.generatedAt).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                    </p>
                  )}
                </div>
              </div>
              <button onClick={() => setReportModalOpen(false)} className="p-2 rounded-lg hover:bg-[#F3F4F6] dark:hover:bg-[#171717] transition-colors">
                <X className="w-5 h-5 text-[#9CA3AF]" />
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto px-6 py-5">
              {reportLoading ? (
                <div className="flex flex-col items-center justify-center py-20 gap-4">
                  <Loader2 className="w-8 h-8 text-[#111111] dark:text-white animate-spin" />
                  <p className="text-sm text-[#9CA3AF]">Analyse de vos donnees en cours...</p>
                </div>
              ) : reportData ? (
                <>
                  {reportData.keyMetrics && (
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-6">
                      {[
                        { value: reportData.keyMetrics.recipeCount, label: 'Recettes' },
                        { value: `${reportData.keyMetrics.avgMargin}%`, label: 'Marge moy.' },
                        { value: `${reportData.keyMetrics.totalRevenue}${getCurrencySymbol()}`, label: 'CA semaine' },
                      ].map((m, i) => (
                        <div key={i} className="bg-[#FAFAFA] dark:bg-[#0A0A0A] border border-[#E5E7EB] dark:border-[#1A1A1A] rounded-xl p-4 text-center">
                          <p className="text-2xl font-black font-satoshi text-[#111111] dark:text-white">{m.value}</p>
                          <p className="text-xs text-[#9CA3AF] mt-1">{m.label}</p>
                        </div>
                      ))}
                    </div>
                  )}
                  <div className="space-y-3">
                    {reportData.report.split('\n').filter((p: string) => p.trim()).map((paragraph: string, i: number) => (
                      <p key={i} className="text-sm leading-relaxed text-[#374151] dark:text-[#D4D4D4]">{paragraph}</p>
                    ))}
                  </div>
                </>
              ) : null}
            </div>

            {/* Footer */}
            {reportData && !reportLoading && (
              <div className="flex items-center justify-between gap-3 px-6 py-4 border-t border-[#E5E7EB] dark:border-[#1A1A1A] bg-[#FAFAFA] dark:bg-[#0A0A0A]">
                <p className="text-xs text-[#9CA3AF]">Rapport en cache 24h</p>
                <div className="flex items-center gap-2">
                  <button onClick={copyReport} className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium rounded-lg bg-white dark:bg-[#171717] text-[#6B7280] dark:text-[#E5E5E5] border border-[#E5E7EB] dark:border-[#1A1A1A] hover:bg-[#F3F4F6] dark:hover:bg-[#262626] transition-colors">
                    {reportCopied ? <><Check className="w-3.5 h-3.5 text-emerald-500" /> Copie !</> : <><Copy className="w-3.5 h-3.5" /> Copier</>}
                  </button>
                  <button onClick={sendReportByEmail} disabled={reportEmailSending} className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium rounded-lg bg-white dark:bg-[#171717] text-[#6B7280] dark:text-[#E5E5E5] border border-[#E5E7EB] dark:border-[#1A1A1A] hover:bg-[#F3F4F6] dark:hover:bg-[#262626] transition-colors disabled:opacity-50">
                    {reportEmailSending ? <><Loader2 className="w-3.5 h-3.5 animate-spin" /> Envoi...</> : reportEmailSent ? <><Check className="w-3.5 h-3.5 text-emerald-500" /> Envoye !</> : <><Mail className="w-3.5 h-3.5" /> Email</>}
                  </button>
                  <button onClick={() => window.print()} className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium rounded-lg bg-[#111111] dark:bg-white text-white dark:text-black hover:bg-[#333] dark:hover:bg-[#E5E5E5] transition-colors">
                    <Download className="w-3.5 h-3.5" /> PDF
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
