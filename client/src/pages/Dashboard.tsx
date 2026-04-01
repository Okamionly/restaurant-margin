import { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  TrendingUp, TrendingDown, DollarSign, ChefHat, Eye, Briefcase,
  PieChart as PieChartIcon, AlertTriangle, Plus, Printer, ShieldAlert,
  Trophy, Target, Calculator, Utensils, BarChart3, ArrowRight, ArrowUpRight, ArrowDownRight,
  Package, ClipboardList, FileText, ShoppingCart,
  Lightbulb, Sparkles, Star, Zap, ArrowDown,
  Building2, ShoppingBasket, Mic, Check,
} from 'lucide-react';
import {
  PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Legend, LineChart, Line,
} from 'recharts';
import { fetchRecipes, fetchIngredients } from '../services/api';
import type { Recipe, Ingredient } from '../types';
import { ALLERGENS } from '../types';
import { useTranslation } from '../hooks/useTranslation';
import { useRestaurant } from '../hooks/useRestaurant';
import { getCurrentSeason, getCurrentSeasonLabel, getSeasonalProducts, getSeasonIcon } from '../data/seasons';

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
  Poissons: 'bg-teal-200 text-teal-900 dark:bg-teal-800/50 dark:text-teal-200',
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
const TAB_ICONS: Record<TabKey, any> = {
  overview: BarChart3,
  margins: TrendingUp,
  costs: ShoppingCart,
  profitability: DollarSign,
};

// ── Stat card color configs ────────────────────────────────────────────────
const STAT_CARD_STYLES: Record<string, { gradient: string; border: string }> = {
  teal:   { gradient: 'from-teal-50 to-white dark:from-teal-950/20 dark:to-slate-900/40',   border: 'border-t-teal-400' },
  green:  { gradient: 'from-green-50 to-white dark:from-green-950/20 dark:to-slate-900/40',  border: 'border-t-emerald-400' },
  amber:  { gradient: 'from-amber-50 to-white dark:from-amber-950/20 dark:to-slate-900/40',  border: 'border-t-amber-400' },
  purple: { gradient: 'from-purple-50 to-white dark:from-purple-950/20 dark:to-slate-900/40', border: 'border-t-purple-400' },
  cyan:   { gradient: 'from-cyan-50 to-white dark:from-cyan-950/20 dark:to-slate-900/40',    border: 'border-t-cyan-400' },
  slate:  { gradient: 'from-slate-50 to-white dark:from-slate-900/30 dark:to-slate-900/40',   border: 'border-t-slate-400' },
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
  title: string; value?: string; numericValue?: number; subtitle?: string; icon: React.ComponentType<{ className?: string }>; color: string;
  colorKey: string; decimals?: number; suffix?: string; prefix?: string; trend?: 'up' | 'down' | null;
}) {
  const style = STAT_CARD_STYLES[colorKey] || STAT_CARD_STYLES.teal;
  return (
    <div className={`bg-gradient-to-b ${style.gradient} rounded-xl shadow-sm border border-slate-200 dark:border-slate-700/50 border-t-[3px] ${style.border} p-4 sm:p-5 transition-all duration-300 hover:shadow-lg dark:hover:shadow-teal-900/10 hover:-translate-y-0.5 dark:bg-slate-800/40 dark:backdrop-blur-md`}>
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs sm:text-sm font-medium text-slate-400 dark:text-slate-400 truncate font-general-sans">{title}</span>
        <div className={`p-2 rounded-lg ${color} shadow-lg`}>
          <Icon className="w-4 h-4 text-white" />
        </div>
      </div>
      <div className="flex items-end gap-2">
        <div className="text-2xl sm:text-3xl font-black font-satoshi text-slate-800 dark:text-slate-100 tracking-tight">
          {numericValue !== undefined
            ? <AnimatedNumber value={numericValue} decimals={decimals} suffix={suffix} prefix={prefix} />
            : value}
        </div>
        {trend && (
          <div className={`flex items-center gap-0.5 mb-1 ${trend === 'up' ? 'text-emerald-400' : 'text-red-400'}`}>
            {trend === 'up' ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
          </div>
        )}
      </div>
      {subtitle && <p className="text-xs text-slate-400 dark:text-slate-500 mt-1 truncate font-general-sans">{subtitle}</p>}
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
          <span className="text-sm font-medium text-slate-400 dark:text-slate-300 truncate pr-2 group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors">
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
interface TooltipPayloadEntry {
  name: string;
  value: number;
  color?: string;
  fill?: string;
  dataKey?: string;
  payload?: Record<string, unknown>;
}

interface ChartTooltipProps {
  active?: boolean;
  payload?: TooltipPayloadEntry[];
  label?: string;
}

function ChartTooltip({ active, payload, label }: ChartTooltipProps) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white dark:bg-slate-800/90 dark:backdrop-blur-lg shadow-xl rounded-lg p-3 border border-slate-200 dark:border-slate-600/50 text-sm min-w-[180px]">
      <p className="font-semibold text-slate-800 dark:text-slate-100 mb-1.5">
        {String(payload[0]?.payload?.fullName || label || payload[0]?.payload?.name || '')}
      </p>
      {payload.map((p: TooltipPayloadEntry, i: number) => (
        <div key={i} className="flex items-center gap-2 mt-0.5">
          <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: p.color || p.fill }} />
          <span className="text-slate-400 dark:text-slate-400">{p.name}:</span>
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

// ── Alert Ticker Banner ───────────────────────────────────────────────────
function AlertTicker({ alerts }: { alerts: Recipe[] }) {
  const { t } = useTranslation();
  if (alerts.length === 0) return null;
  // Duplicate items for seamless loop
  const items = [...alerts, ...alerts];
  return (
    <div className="relative overflow-hidden bg-gradient-to-r from-red-600 to-red-700 rounded-xl shadow-sm">
      <div className="flex items-center gap-2 px-4 py-2.5">
        <AlertTriangle className="w-4 h-4 text-white flex-shrink-0" />
        <span className="text-xs font-bold text-white/90 flex-shrink-0 uppercase tracking-wide">
          {t("dashboard.alerts")} ({alerts.length})
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

// ── Onboarding Steps ──────────────────────────────────────────────────────
const ONBOARDING_STEPS = [
  { id: 'restaurant', label: 'Nommez votre restaurant', icon: Building2, link: '/settings' },
  { id: 'ingredient', label: 'Ajoutez votre premier ingrédient', icon: ShoppingBasket, link: '/ingredients' },
  { id: 'recipe', label: 'Créez une recette avec l\'IA', icon: Sparkles, link: '/assistant' },
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

function OnboardingChecklist({ restaurantName, ingredientCount, recipeCount, navigate }: {
  restaurantName: string; ingredientCount: number; recipeCount: number; navigate: (path: string) => void;
}) {
  const [completedSteps, setCompletedSteps] = useState<string[]>(getCompletedSteps);
  const [dismissed, setDismissed] = useState(false);

  // Auto-detect completion of verifiable steps
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

  // Find first incomplete step
  const currentStepId = ONBOARDING_STEPS.find(s => !completedSteps.includes(s.id))?.id;

  if (dismissed && allDone) return null;

  return (
    <div className="relative rounded-2xl border border-teal-500/30 bg-white/5 dark:bg-slate-800/40 backdrop-blur-xl shadow-xl shadow-teal-900/5 p-6 overflow-hidden stagger-1">
      {/* Glassmorphism decorative blobs */}
      <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full bg-teal-400/10 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-10 -left-10 w-32 h-32 rounded-full bg-cyan-400/10 blur-3xl pointer-events-none" />

      {/* Header */}
      <div className="relative flex items-center justify-between mb-5">
        <div>
          <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100 font-satoshi">
            {allDone ? 'Bravo ! Vous êtes prêt 🎉' : 'Premiers pas avec RestauMargin'}
          </h3>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            {allDone ? 'Toutes les étapes sont complétées.' : `${completedSteps.length}/${ONBOARDING_STEPS.length} étapes complétées`}
          </p>
        </div>
        {allDone && (
          <button
            onClick={() => setDismissed(true)}
            className="text-xs text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
          >
            Masquer
          </button>
        )}
      </div>

      {/* Progress bar */}
      <div className="relative h-2.5 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden mb-6">
        <div
          className="h-full rounded-full bg-gradient-to-r from-teal-500 to-cyan-400 transition-all duration-700 ease-out"
          style={{ width: `${progress}%` }}
        />
        <span className="absolute right-2 top-1/2 -translate-y-1/2 text-[10px] font-bold text-slate-500 dark:text-slate-400">
          {progress}%
        </span>
      </div>

      {/* Steps */}
      {!allDone && (
        <div className="space-y-3">
          {ONBOARDING_STEPS.map((step, i) => {
            const done = completedSteps.includes(step.id);
            const isCurrent = step.id === currentStepId;
            const Icon = step.icon;

            return (
              <button
                key={step.id}
                onClick={() => {
                  // For voice and mercuriale, mark done on click since they're localStorage flags
                  if (step.id === 'voice' || step.id === 'mercuriale') markDone(step.id);
                  navigate(step.link);
                }}
                className={`w-full flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-300 text-left group
                  ${done
                    ? 'bg-teal-50/50 dark:bg-teal-900/10 border border-teal-200/50 dark:border-teal-800/30'
                    : isCurrent
                      ? 'bg-white dark:bg-slate-700/50 border border-teal-400/50 dark:border-teal-500/30 shadow-md shadow-teal-500/10 hover:shadow-lg hover:shadow-teal-500/15'
                      : 'bg-slate-50 dark:bg-slate-800/30 border border-slate-200/50 dark:border-slate-700/30 opacity-60 hover:opacity-80'
                  }`}
                style={{ animationDelay: `${i * 80}ms` }}
              >
                {/* Circle indicator */}
                <div className={`relative flex-shrink-0 w-9 h-9 rounded-full flex items-center justify-center transition-all duration-300
                  ${done
                    ? 'bg-teal-500 text-white shadow-md shadow-teal-500/30'
                    : isCurrent
                      ? 'bg-teal-100 dark:bg-teal-900/40 text-teal-600 dark:text-teal-400 ring-2 ring-teal-400/50'
                      : 'bg-slate-200 dark:bg-slate-700 text-slate-400 dark:text-slate-500'
                  }`}>
                  {done ? (
                    <Check className="w-4 h-4" />
                  ) : (
                    <Icon className="w-4 h-4" />
                  )}
                  {isCurrent && !done && (
                    <span className="absolute inset-0 rounded-full animate-ping bg-teal-400/30" />
                  )}
                </div>

                {/* Label */}
                <span className={`text-sm font-medium transition-colors
                  ${done
                    ? 'text-teal-700 dark:text-teal-300 line-through decoration-teal-400/40'
                    : isCurrent
                      ? 'text-slate-800 dark:text-slate-100'
                      : 'text-slate-500 dark:text-slate-400'
                  }`}>
                  {step.label}
                </span>

                {/* Arrow for current */}
                {isCurrent && !done && (
                  <ArrowRight className="w-4 h-4 ml-auto text-teal-500 group-hover:translate-x-1 transition-transform" />
                )}
            </button>
          );
        })}
      </div>
    )}

      {/* Celebration message when all done */}
      {allDone && (
        <div className="flex items-center gap-3 mt-2 p-3 bg-teal-50 dark:bg-teal-900/20 rounded-xl border border-teal-200/50 dark:border-teal-800/30">
          <Trophy className="w-5 h-5 text-amber-500 flex-shrink-0" />
          <p className="text-sm text-teal-700 dark:text-teal-300">
            Votre restaurant est configuré. Explorez maintenant vos marges et optimisez votre carte !
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
  const [couverts, setCouverts] = useState(50);
  const [serviceMode, setServiceMode] = useState<'all' | 'lunch' | 'dinner'>('all');
  const [avgPricePerCouvert, setAvgPricePerCouvert] = useState(25);
  const [marginSort, setMarginSort] = useState<'margin' | 'name'>('margin');
  const navigate = useNavigate();

  const TABS: { key: TabKey; label: string; desc: string; icon: React.ComponentType<{ className?: string }> }[] = [
    { key: 'overview', label: t("dashboard.tabOverview"), desc: t("dashboard.tabOverviewDesc"), icon: TAB_ICONS.overview },
    { key: 'margins', label: t("dashboard.tabMargins"), desc: t("dashboard.tabMarginsDesc"), icon: TAB_ICONS.margins },
    { key: 'costs', label: t("dashboard.tabCosts"), desc: t("dashboard.tabCostsDesc"), icon: TAB_ICONS.costs },
    { key: 'profitability', label: t("dashboard.tabProfitability"), desc: t("dashboard.tabProfitabilityDesc"), icon: TAB_ICONS.profitability },
  ];

  useEffect(() => {
    if (restaurantLoading || !selectedRestaurant) return;
    Promise.all([fetchRecipes(), fetchIngredients()])
      .then(([r, i]) => { setRecipes(r); setIngredients(i); })
      .catch(() => console.error('Erreur chargement'))
      .finally(() => setLoading(false));
  }, [selectedRestaurant, restaurantLoading]);

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
        name: r.name.length > 20 ? r.name.slice(0, 18) + '...' : r.name,
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
    const alertRecipes = recipes.filter(r => r.margin?.marginPercent < 60);

    // Food cost by ingredient category
    const foodCostMap = new Map<string, number>();
    const ingredientCostMap = new Map<string, { name: string; cost: number; unit: string; category: string }>();
    recipes.forEach(r => {
      (r.ingredients || []).forEach(ri => {
        if (!ri.ingredient) return;
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
      (r.ingredients || []).forEach(ri => {
        if (!ri.ingredient) return;
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
        text: `${t("dashboard.aiIncreasePriceOf")} ${w.name} ${t("dashboard.aiBy")} ${suggestedIncrease}€ (+${((suggestedIncrease / w.sellingPrice) * 100).toFixed(0)}% ${t("dashboard.margin")})`,
        action: `/recipes/${w.id}`,
        actionLabel: t("dashboard.aiApply"),
      });
    }
    // Find cheapest ingredient category for opportunity
    if (foodCostData.length > 1) {
      const cheapestCat = foodCostData[foodCostData.length - 1];
      aiSuggestions.push({
        id: 'cheap-category',
        type: 'info',
        icon: 'sparkles',
        text: `${t("dashboard.aiCheapestCategory")} "${cheapestCat.name}" — ${t("dashboard.aiIdealForNewDishes")}`,
        action: '/ingredients',
        actionLabel: t("dashboard.aiView"),
      });
    }
    // Low-margin dishes warning
    const lowMarginCount = recipes.filter(r => r.margin.marginPercent < 50).length;
    if (lowMarginCount > 0) {
      aiSuggestions.push({
        id: 'low-margin',
        type: 'warning',
        icon: 'alert',
        text: `${lowMarginCount} ${lowMarginCount > 1 ? t("dashboard.aiDishesPlural") : t("dashboard.aiDishSingular")} ${t("dashboard.aiBelow50Margin")}`,
        action: '/recipes',
        actionLabel: t("dashboard.aiView"),
      });
    }
    // Best performer
    if (top10Margin.length > 0) {
      const best = top10Margin[0];
      aiSuggestions.push({
        id: 'best-performer',
        type: 'opportunity',
        icon: 'star',
        text: `"${best.name}" ${t("dashboard.aiIsYourStar")} ${best.margin.marginPercent.toFixed(1)}% — ${t("dashboard.aiHighlightIt")}`,
        action: `/recipes/${best.id}`,
        actionLabel: t("dashboard.aiView"),
      });
    }

    // Profitability projection data (6 months)
    const projectionData = Array.from({ length: 6 }, (_, i) => {
      const month = i + 1;
      const monthlyRevenue = dailyRevenue * 26;
      const monthlyCost = dailyCost * 26;
      const growthFactor = 1 + (i * 0.02); // 2% monthly growth
      return {
        name: `${t("dashboard.month")} ${month}`,
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
  }, [recipes, couverts, serviceMode, avgPricePerCouvert, t]);

  // ── Loading ────────────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="animate-spin rounded-full h-10 w-10 border-4 border-teal-600 border-t-transparent" />
      </div>
    );
  }

  // ── Empty state with onboarding ─────────────────────────────────────────
  if (!stats || stats.totalRecipes === 0) {
    return (
      <div className="space-y-6">
        <h2 className="text-2xl sm:text-3xl font-black font-satoshi tracking-tight">
          <span className="bg-gradient-to-r from-teal-400 via-cyan-400 to-teal-300 bg-clip-text text-transparent">{t("dashboard.title")}</span>
        </h2>

        {/* Onboarding Checklist */}
        <OnboardingChecklist
          restaurantName={selectedRestaurant?.name || ''}
          ingredientCount={ingredients.length}
          recipeCount={recipes.length}
          navigate={navigate}
        />

        {/* Original empty state card below */}
        <div className="text-center py-12 bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700">
          <ChefHat className="w-14 h-14 mx-auto text-slate-300 dark:text-slate-600 mb-4" />
          <h3 className="text-lg font-semibold text-slate-300 dark:text-slate-300 mb-2">{t("dashboard.welcome")}</h3>
          <p className="text-slate-400 dark:text-slate-500 mb-6">{t("dashboard.emptyStateDesc")}</p>
          <div className="flex gap-4 justify-center">
            <Link to="/ingredients" className="btn-primary">{t("dashboard.addIngredients")}</Link>
            <Link to="/recipes" className="btn-secondary">{t("dashboard.createRecipe")}</Link>
          </div>
        </div>
      </div>
    );
  }

  const sortedByMargin = [...recipes].sort((a, b) => a.margin.marginPercent - b.margin.marginPercent);

  return (
    <div className="space-y-6">
      {/* ── Header + Quick Actions ────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 stagger-1">
        <div>
          <h2 className="text-2xl sm:text-3xl font-black font-satoshi tracking-tight">
            <span className="bg-gradient-to-r from-teal-400 via-cyan-400 to-teal-300 bg-clip-text text-transparent">{t("dashboard.title")}</span>
          </h2>
          <p className="text-sm text-slate-400 dark:text-slate-500 mt-1 font-general-sans">
            {stats.totalRecipes} {t("dashboard.recipesCount")} · {ingredients.length} {t("dashboard.ingredientsCount")}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => navigate('/recipes?action=new')}
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-teal-600 text-white text-sm font-medium rounded-lg hover:bg-teal-700 transition-colors shadow-sm"
          >
            <Plus className="w-4 h-4" /> {t("dashboard.newRecipe")}
          </button>
          <button
            onClick={() => navigate('/ingredients?action=new')}
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-white dark:bg-slate-700 text-slate-400 dark:text-slate-200 text-sm font-medium rounded-lg hover:bg-slate-50 dark:hover:bg-slate-600 transition-colors border border-slate-200 dark:border-slate-600 shadow-sm"
          >
            <Package className="w-4 h-4" /> {t("dashboard.addIngredient")}
          </button>
          <Link
            to="/recipes"
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-white dark:bg-slate-700 text-slate-400 dark:text-slate-200 text-sm font-medium rounded-lg hover:bg-slate-50 dark:hover:bg-slate-600 transition-colors border border-slate-200 dark:border-slate-600 shadow-sm"
          >
            <ClipboardList className="w-4 h-4" /> {t("dashboard.viewRecipes")}
          </Link>
          <Link
            to="/inventory"
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-white dark:bg-slate-700 text-slate-400 dark:text-slate-200 text-sm font-medium rounded-lg hover:bg-slate-50 dark:hover:bg-slate-600 transition-colors border border-slate-200 dark:border-slate-600 shadow-sm"
          >
            <FileText className="w-4 h-4" /> {t("dashboard.viewInventory")}
          </Link>
          <button
            onClick={() => window.print()}
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-white dark:bg-slate-700 text-slate-400 dark:text-slate-200 text-sm font-medium rounded-lg hover:bg-slate-50 dark:hover:bg-slate-600 transition-colors border border-slate-200 dark:border-slate-600 shadow-sm no-print"
          >
            <Printer className="w-4 h-4" /> {t("dashboard.print")}
          </button>
        </div>
      </div>

      {/* ── Onboarding (shown until all steps complete) ──────────────── */}
      <OnboardingChecklist
        restaurantName={selectedRestaurant?.name || ''}
        ingredientCount={ingredients.length}
        recipeCount={recipes.length}
        navigate={navigate}
      />

      {/* ── Stat Cards (bigger, gradient, colored top border) ─────────── */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 stagger-2">
        <StatCard title={t("dashboard.recipes")} value={String(stats.totalRecipes)} icon={ChefHat} color="bg-teal-600" colorKey="teal" />
        <StatCard
          title={t("dashboard.avgMargin")}
          numericValue={stats.avgMargin}
          suffix="%"
          subtitle={stats.avgMargin >= 70 ? t("dashboard.goalReached") : t("dashboard.goalTarget70")}
          icon={TrendingUp}
          color={stats.avgMargin >= 70 ? 'bg-green-600' : 'bg-amber-500'}
          colorKey={stats.avgMargin >= 70 ? 'green' : 'amber'}
          trend={stats.avgMargin >= 70 ? 'up' : 'down'}
        />
        <StatCard
          title={t("dashboard.avgCoefficient")}
          numericValue={stats.avgCoefficient}
          decimals={2}
          subtitle={t("dashboard.goalTarget33")}
          icon={DollarSign}
          color="bg-purple-600"
          colorKey="purple"
          trend={stats.avgCoefficient >= 3.3 ? 'up' : 'down'}
        />
        <StatCard
          title={t("dashboard.avgTotalCost")}
          numericValue={stats.avgTotalCost}
          decimals={2}
          suffix=" €"
          subtitle={stats.avgLaborCost > 0 ? `${t("dashboard.material")} ${stats.avgFoodCost.toFixed(2)}€ + ${t("dashboard.labor")} ${stats.avgLaborCost.toFixed(2)}€` : t("dashboard.materialOnly")}
          icon={Briefcase}
          color="bg-cyan-600"
          colorKey="cyan"
        />
        <StatCard
          title={t("dashboard.minMax")}
          value={`${stats.worstMargin.toFixed(0)}% / ${stats.bestMargin.toFixed(0)}%`}
          icon={TrendingDown}
          color="bg-slate-600"
          colorKey="slate"
        />
      </div>

      {/* ── Alert Ticker Banner ──────────────────────────────────────── */}
      <div className="stagger-3">
        <AlertTicker alerts={stats.alertRecipes} />
      </div>

      {/* ── Menu du Marché + Suggestions IA ────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 stagger-4">
        {/* Menu du Marché */}
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-5">
          <div className="flex items-center gap-2 mb-4">
            <Star className="w-5 h-5 text-amber-500" />
            <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100">{t("dashboard.dailySuggestion")}</h3>
            <span className="text-xs text-slate-400 dark:text-slate-500 ml-auto">{t("dashboard.marketMenu")}</span>
          </div>
          <p className="text-xs text-slate-400 dark:text-slate-400 mb-3">{t("dashboard.recommendedDishes")}</p>
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
                  <p className="text-xs text-slate-400 dark:text-slate-500">{t("dashboard.cost")} {dish.costPerPortion.toFixed(2)}€ · {t("dashboard.sale")} {dish.suggestedPrice.toFixed(2)}€</p>
                </div>
              </Link>
            ))}
          </div>
          <Link to="/recipes" className="inline-flex items-center gap-1 text-xs text-teal-600 dark:text-teal-400 hover:underline font-medium mt-3">
            {t("dashboard.viewAllSuggestions")} <ArrowRight className="w-3 h-3" />
          </Link>
        </div>

        {/* Suggestions IA */}
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-5">
          <div className="flex items-center gap-2 mb-4">
            <Sparkles className="w-5 h-5 text-purple-500" />
            <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100">{t("dashboard.aiSuggestions")}</h3>
          </div>
          <div className="space-y-3">
            {stats.aiSuggestions.map(suggestion => {
              const colorMap = {
                opportunity: 'border-l-green-500 bg-green-50/50 dark:bg-green-900/10',
                warning: 'border-l-orange-500 bg-orange-50/50 dark:bg-orange-900/10',
                info: 'border-l-teal-500 bg-teal-50/50 dark:bg-teal-900/10',
              };
              const btnColorMap = {
                opportunity: 'bg-green-600 hover:bg-green-700 text-white',
                warning: 'bg-orange-600 hover:bg-orange-700 text-white',
                info: 'bg-teal-600 hover:bg-teal-700 text-white',
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
                  <div className={`flex-shrink-0 ${suggestion.type === 'opportunity' ? 'text-green-600' : suggestion.type === 'warning' ? 'text-orange-600' : 'text-teal-600'}`}>
                    {iconMap[suggestion.icon as keyof typeof iconMap] || <Lightbulb className="w-4 h-4" />}
                  </div>
                  <p className="text-sm text-slate-400 dark:text-slate-300 flex-1">{suggestion.text}</p>
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
                  ? 'bg-white dark:bg-slate-800 border-l-4 border-l-teal-600 border border-slate-200 dark:border-slate-700 shadow-md'
                  : 'bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 hover:bg-white dark:hover:bg-slate-800 hover:shadow-sm opacity-75 hover:opacity-100'
                }`}
            >
              <div className={`p-2 rounded-lg ${isActive ? 'bg-teal-100 dark:bg-teal-900/30' : 'bg-slate-100 dark:bg-slate-700'}`}>
                <Icon className={`w-5 h-5 ${isActive ? 'text-teal-600 dark:text-teal-400' : 'text-slate-400 dark:text-slate-500'}`} />
              </div>
              <div>
                <div className={`text-sm font-semibold ${isActive ? 'text-slate-800 dark:text-slate-100' : 'text-slate-400 dark:text-slate-400'}`}>
                  {tab.label}
                </div>
                <div className={`text-xs ${isActive ? 'text-slate-400 dark:text-slate-400' : 'text-slate-400 dark:text-slate-500'}`}>
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
          {/* Produits de saison */}
          <div className="bg-gradient-to-r from-emerald-50 to-green-50 dark:from-emerald-950/30 dark:to-green-950/30 border border-emerald-200 dark:border-emerald-800 rounded-2xl p-4 mb-6">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-2xl">{getSeasonIcon(getCurrentSeason())}</span>
              <h3 className="text-lg font-bold text-emerald-800 dark:text-emerald-200">{getCurrentSeasonLabel()}</h3>
              <span className="text-sm text-emerald-600 dark:text-emerald-400">— Produits de saison</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {getSeasonalProducts().slice(0, 8).map(p => (
                <span key={p.name} className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-white/70 dark:bg-slate-800/70 text-sm border border-emerald-200 dark:border-emerald-700">
                  <span className="font-medium text-slate-800 dark:text-slate-200">{p.name}</span>
                  <span className="text-emerald-600 dark:text-emerald-400 text-xs">{p.avgPrice.toFixed(2)}€/{p.unit}</span>
                </span>
              ))}
            </div>
            <Link to="/mercuriale" className="inline-flex items-center gap-1 mt-3 text-sm text-emerald-600 dark:text-emerald-400 hover:underline">
              Voir tous les produits de saison <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-[65%_35%] gap-6">
            {/* LEFT SIDE */}
            <div className="space-y-6">
              {/* Revenue Estimation */}
              <div className="bg-gradient-to-br from-teal-600 to-indigo-700 rounded-xl shadow-lg p-5 text-white">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-4">
                  <div className="flex items-center gap-2">
                    <Calculator className="w-5 h-5" />
                    <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100 text-white">{t("dashboard.revenueEstimation")}</h3>
                  </div>
                  <div className="flex flex-wrap items-center gap-3">
                    <div className="flex items-center gap-1 bg-white/10 rounded-lg p-0.5">
                      {([['all', t("dashboard.serviceAll")], ['lunch', t("dashboard.serviceLunch")], ['dinner', t("dashboard.serviceDinner")]] as [string, string][]).map(([key, label]) => (
                        <button
                          key={key}
                          onClick={() => setServiceMode(key as 'all' | 'lunch' | 'dinner')}
                          className={`px-2.5 py-1 text-xs font-medium rounded-md transition-colors ${
                            serviceMode === key ? 'bg-white/25 text-white' : 'text-teal-200 hover:text-white'
                          }`}
                        >
                          {label}
                        </button>
                      ))}
                    </div>
                    <div className="flex items-center gap-2">
                      <label className="text-xs text-teal-100">{t("dashboard.covers")} :</label>
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
                      <label className="text-xs text-teal-100">{t("dashboard.avgTicket")} :</label>
                      <input
                        type="number"
                        min={1}
                        max={500}
                        value={avgPricePerCouvert}
                        onChange={e => setAvgPricePerCouvert(Math.max(1, parseInt(e.target.value) || 1))}
                        className="w-16 px-2 py-1 rounded bg-white/20 border border-white/30 text-white text-sm text-center focus:outline-none focus:ring-2 focus:ring-white/50"
                      />
                      <span className="text-xs text-teal-200">€</span>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-3">
                  <div className="bg-white/10 rounded-lg p-3">
                    <p className="text-xs text-teal-200 mb-1">{t("dashboard.revenuePerDay")}</p>
                    <p className="text-xl font-bold"><AnimatedNumber value={stats.dailyRevenue} decimals={0} suffix=" €" /></p>
                  </div>
                  <div className="bg-white/10 rounded-lg p-3">
                    <p className="text-xs text-teal-200 mb-1">{t("dashboard.revenuePerWeek")}</p>
                    <p className="text-xl font-bold"><AnimatedNumber value={stats.dailyRevenue * 6} decimals={0} suffix=" €" /></p>
                  </div>
                  <div className="bg-white/10 rounded-lg p-3">
                    <p className="text-xs text-teal-200 mb-1">{t("dashboard.revenuePerMonth")}</p>
                    <p className="text-xl font-bold"><AnimatedNumber value={stats.dailyRevenue * 26} decimals={0} suffix=" €" /></p>
                  </div>
                  <div className="bg-white/10 rounded-lg p-3">
                    <p className="text-xs text-teal-200 mb-1">{t("dashboard.profitPerDay")}</p>
                    <p className="text-xl font-bold text-green-300"><AnimatedNumber value={stats.dailyProfit} decimals={0} suffix=" €" /></p>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-x-6 gap-y-1 text-xs text-teal-200">
                  <span>{stats.dailyCouverts} {t("dashboard.coversPerDay")} ({serviceMode === 'all' ? t("dashboard.twoServices") : serviceMode === 'lunch' ? t("dashboard.lunch") : t("dashboard.dinner")})</span>
                  <span>{t("dashboard.costRatio")} : {(stats.avgCostRatio * 100).toFixed(1)}%</span>
                  <span>{t("dashboard.profitPerCover")} : {stats.profitPerCouvert.toFixed(2)} €</span>
                  {stats.seuilRentabilite > 0 && (
                    <span className="text-yellow-300 font-medium">{t("dashboard.breakEvenPoint")} : {stats.seuilRentabilite} {t("dashboard.coversPerDay")}</span>
                  )}
                </div>
              </div>

              {/* Category cards with colored dots */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {stats.categoryData.map((cat, i) => (
                  <div key={cat.name} className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-4 hover:shadow-md transition-shadow">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[i % COLORS.length] }} />
                      <span className="text-sm font-medium text-slate-400 dark:text-slate-300 truncate">{cat.name}</span>
                    </div>
                    <div className="text-2xl font-bold text-slate-800 dark:text-slate-100">{cat.count}</div>
                    <div className="text-xs text-slate-400 dark:text-slate-400 mt-1">
                      {t("dashboard.margin")} :{' '}
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
                  <Utensils className="w-5 h-5 text-teal-600" />
                  <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100">{t("dashboard.distribution")}</h3>
                </div>
                <ResponsiveContainer width="100%" height={240}>
                  <PieChart>
                    <Pie
                      data={stats.categoryData}
                      cx="50%"
                      cy="50%"
                      innerRadius={40}
                      outerRadius={95}
                      paddingAngle={2}
                      dataKey="count"
                      nameKey="name"
                      label={(props: unknown) => {
                        const { cx, cy, midAngle, innerRadius, outerRadius, name, count, percent } = props as { cx: number; cy: number; midAngle: number; innerRadius: number; outerRadius: number; name: string; count: number; percent: number };
                        const RADIAN = Math.PI / 180;
                        const radius = (innerRadius || 0) + ((outerRadius || 0) - (innerRadius || 0)) * 0.55;
                        const x = (cx || 0) + radius * Math.cos(-(midAngle || 0) * RADIAN);
                        const y = (cy || 0) + radius * Math.sin(-(midAngle || 0) * RADIAN);
                        if ((percent || 0) < 0.08) return null;
                        const label = String(name || '');
                        return (
                          <text x={x} y={y} fill="white" textAnchor="middle" dominantBaseline="central" style={{ fontSize: '11px', fontWeight: 'bold', textShadow: '0 1px 3px rgba(0,0,0,0.6)' }}>
                            {label.length > 12 ? label.slice(0, 11) + '…' : label} ({count})
                          </text>
                        );
                      }}
                      labelLine={false}
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
                      <span className="text-slate-400 dark:text-slate-300 flex-1 truncate">{cat.name}</span>
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
                    <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100">{t("dashboard.allergens")}</h3>
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
              <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100">{t("dashboard.allRecipesByMargin")}</h3>
              <div className="flex items-center gap-2 ml-auto">
                <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-700 rounded-lg p-0.5">
                  <button
                    onClick={() => setMarginSort('margin')}
                    className={`inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium rounded-md transition-colors ${marginSort === 'margin' ? 'bg-white dark:bg-slate-600 text-slate-800 dark:text-slate-100 shadow-sm' : 'text-slate-400 dark:text-slate-400 hover:text-slate-700'}`}
                  >
                    <ArrowDown className="w-3 h-3" /> {t("dashboard.margin")}
                  </button>
                  <button
                    onClick={() => setMarginSort('name')}
                    className={`inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium rounded-md transition-colors ${marginSort === 'name' ? 'bg-white dark:bg-slate-600 text-slate-800 dark:text-slate-100 shadow-sm' : 'text-slate-400 dark:text-slate-400 hover:text-slate-700'}`}
                  >
                    <ArrowDown className="w-3 h-3" /> {t("dashboard.name")}
                  </button>
                </div>
                <div className="flex items-center gap-3 text-xs text-slate-400 dark:text-slate-500">
                  <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-green-600 inline-block" /> &ge; 70%</span>
                  <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-amber-500 inline-block" /> 50-70%</span>
                  <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-red-500 inline-block" /> &lt; 50%</span>
                </div>
              </div>
            </div>
            <ResponsiveContainer width="100%" height={Math.max(300, stats.allByMargin.length * 28)}>
              <BarChart data={marginSort === 'name' ? [...stats.allByMargin].sort((a, b) => a.fullName.localeCompare(b.fullName)) : stats.allByMargin} layout="vertical" margin={{ top: 5, right: 30, bottom: 5, left: 5 }}>
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
                        <p className="text-slate-400 dark:text-slate-400">{d?.category}</p>
                        <p className="font-bold mt-1" style={{ color: d?.fill }}>{d?.margin?.toFixed(1)}%</p>
                      </div>
                    );
                  }}
                />
                <Bar dataKey="margin" name={t("dashboard.marginPercent")} radius={[0, 4, 4, 0]}>
                  {stats.allByMargin.map((entry, index) => (
                    <Cell key={index} fill={entry.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Top 10 + Bottom 5 side by side */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-5">
              <div className="flex items-center gap-2 mb-4">
                <Trophy className="w-5 h-5 text-yellow-500" />
                <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100">{t("dashboard.top10ByMargin")}</h3>
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
                <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100">{t("dashboard.bottom5Margins")}</h3>
                <span className="text-xs text-red-500 font-medium bg-red-50 dark:bg-red-900/20 px-2 py-0.5 rounded-full ml-auto">{t("dashboard.actionRequired")}</span>
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
                <PieChartIcon className="w-5 h-5 text-teal-600" />
                <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100">{t("dashboard.foodCostDistribution")}</h3>
                <span className="text-xs text-slate-400 dark:text-slate-500 ml-auto">
                  Total : {stats.totalFoodCostAll.toFixed(2)} €
                </span>
              </div>
              {stats.foodCostData.length > 0 ? (
                <ResponsiveContainer width="100%" height={320}>
                  <PieChart>
                    <Pie
                      data={stats.foodCostData}
                      cx="50%"
                      cy="50%"
                      innerRadius={0}
                      outerRadius={130}
                      paddingAngle={1}
                      dataKey="value"
                      nameKey="name"
                      label={(props: unknown) => {
                        const { cx, cy, midAngle, innerRadius, outerRadius, name, percent } = props as { cx: number; cy: number; midAngle: number; innerRadius: number; outerRadius: number; name: string; percent: number };
                        const RADIAN = Math.PI / 180;
                        const radius = (innerRadius || 0) + ((outerRadius || 0) - (innerRadius || 0)) * 0.5;
                        const x = (cx || 0) + radius * Math.cos(-(midAngle || 0) * RADIAN);
                        const y = (cy || 0) + radius * Math.sin(-(midAngle || 0) * RADIAN);
                        if ((percent || 0) < 0.05) return null;
                        const pctStr = ((percent || 0) * 100).toFixed(0);
                        const label = String(name || '');
                        return (
                          <g>
                            <text x={x} y={y - 6} fill="white" textAnchor="middle" dominantBaseline="central" style={{ fontSize: '10px', fontWeight: 'bold', textShadow: '0 1px 3px rgba(0,0,0,0.6)' }}>
                              {label.length > 10 ? label.slice(0, 9) + '…' : label}
                            </text>
                            <text x={x} y={y + 8} fill="rgba(255,255,255,0.85)" textAnchor="middle" dominantBaseline="central" style={{ fontSize: '9px', textShadow: '0 1px 3px rgba(0,0,0,0.6)' }}>
                              {pctStr}%
                            </text>
                          </g>
                        );
                      }}
                      labelLine={false}
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
                            <p className="text-slate-300 dark:text-slate-300">{d?.value?.toFixed(2)} € ({pct}%)</p>
                          </div>
                        );
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <p className="text-center text-slate-400 py-12">{t("dashboard.noData")}</p>
              )}
            </div>

            {/* Cost by category bar */}
            {stats.foodCostData.length > 0 && (
              <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-5">
                <div className="flex items-center gap-2 mb-4">
                  <BarChart3 className="w-5 h-5 text-orange-600" />
                  <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100">{t("dashboard.detailByCategory")}</h3>
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
                            <p className="text-slate-300 dark:text-slate-300">{d?.value?.toFixed(2)} €</p>
                            <p className="text-slate-400 dark:text-slate-400">{pct}% {t("dashboard.ofTotalCost")}</p>
                          </div>
                        );
                      }}
                    />
                    <Bar dataKey="value" name={t("dashboard.cost")} radius={[0, 4, 4, 0]}>
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
                <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100">{t("dashboard.top10ExpensiveIngredients")}</h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-left text-slate-400 dark:text-slate-400 border-b border-slate-200 dark:border-slate-700">
                      <th className="pb-2 font-medium">#</th>
                      <th className="pb-2 font-medium">{t("dashboard.ingredient")}</th>
                      <th className="pb-2 font-medium">{t("dashboard.category")}</th>
                      <th className="pb-2 text-right font-medium">{t("dashboard.totalCost")}</th>
                      <th className="pb-2 text-right font-medium">{t("dashboard.percentOfTotal")}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                    {stats.topIngredients.map((ing, i) => (
                      <tr key={ing.name} className="hover:bg-slate-50 dark:hover:bg-slate-700/50">
                        <td className="py-2.5 text-slate-400 font-bold">{i + 1}</td>
                        <td className="py-2.5 font-medium text-slate-800 dark:text-slate-200">{ing.name}</td>
                        <td className="py-2.5 text-slate-400 dark:text-slate-400">
                          <span className="inline-flex items-center gap-1">
                            <span className="w-2 h-2 rounded-full" style={{ backgroundColor: FOOD_CATEGORY_COLORS[ing.category] || '#64748b' }} />
                            {ing.category}
                          </span>
                        </td>
                        <td className="py-2.5 text-right font-mono font-semibold text-slate-400 dark:text-slate-300">{ing.cost.toFixed(2)} €</td>
                        <td className="py-2.5 text-right font-mono text-slate-400 dark:text-slate-400">
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
                <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100">{t("dashboard.ingredientCategoryDetail")}</h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-left text-slate-400 dark:text-slate-400 border-b border-slate-200 dark:border-slate-700">
                      <th className="pb-2 font-medium">{t("dashboard.category")}</th>
                      <th className="pb-2 text-right font-medium">{t("dashboard.totalCost")}</th>
                      <th className="pb-2 text-right font-medium">{t("dashboard.percentOfTotal")}</th>
                      <th className="pb-2 font-medium">{t("dashboard.mainIngredient")}</th>
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
                        <td className="py-2.5 text-right font-mono font-semibold text-slate-400 dark:text-slate-300">{cat.totalCost.toFixed(2)} €</td>
                        <td className="py-2.5 text-right font-mono text-slate-400 dark:text-slate-400">{cat.pctOfTotal.toFixed(1)}%</td>
                        <td className="py-2.5 text-slate-400 dark:text-slate-400">{cat.topIngredient}</td>
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
          <div className="bg-gradient-to-br from-teal-600 to-indigo-700 rounded-xl shadow-lg p-5 text-white">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-4">
              <div className="flex items-center gap-2">
                <Calculator className="w-5 h-5" />
                <h3 className="text-lg font-semibold text-white">{t("dashboard.revenueProjections")}</h3>
              </div>
              <div className="flex flex-wrap items-center gap-3">
                <div className="flex items-center gap-1 bg-white/10 rounded-lg p-0.5">
                  {([['all', t("dashboard.serviceAll")], ['lunch', t("dashboard.serviceLunch")], ['dinner', t("dashboard.serviceDinner")]] as [string, string][]).map(([key, label]) => (
                    <button
                      key={key}
                      onClick={() => setServiceMode(key as 'all' | 'lunch' | 'dinner')}
                      className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                        serviceMode === key ? 'bg-white/25 text-white' : 'text-teal-200 hover:text-white'
                      }`}
                    >
                      {label}
                    </button>
                  ))}
                </div>
                <div className="flex items-center gap-2">
                  <label className="text-xs text-teal-100">{t("dashboard.covers")} :</label>
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
                  <label className="text-xs text-teal-100">{t("dashboard.avgTicket")} :</label>
                  <input
                    type="number"
                    min={1}
                    max={500}
                    value={avgPricePerCouvert}
                    onChange={e => setAvgPricePerCouvert(Math.max(1, parseInt(e.target.value) || 1))}
                    className="w-16 px-2 py-1 rounded bg-white/20 border border-white/30 text-white text-sm text-center focus:outline-none focus:ring-2 focus:ring-white/50"
                  />
                  <span className="text-xs text-teal-200">€</span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="bg-white/10 rounded-lg p-4">
                <p className="text-xs text-teal-200 mb-1">{t("dashboard.revenuePerDay")}</p>
                <p className="text-2xl font-bold"><AnimatedNumber value={stats.dailyRevenue} decimals={0} suffix=" €" /></p>
              </div>
              <div className="bg-white/10 rounded-lg p-4">
                <p className="text-xs text-teal-200 mb-1">{t("dashboard.revenuePerWeek")}</p>
                <p className="text-2xl font-bold"><AnimatedNumber value={stats.dailyRevenue * 6} decimals={0} suffix=" €" /></p>
              </div>
              <div className="bg-white/10 rounded-lg p-4">
                <p className="text-xs text-teal-200 mb-1">{t("dashboard.revenuePerMonth")}</p>
                <p className="text-2xl font-bold"><AnimatedNumber value={stats.dailyRevenue * 26} decimals={0} suffix=" €" /></p>
              </div>
              <div className="bg-white/10 rounded-lg p-4">
                <p className="text-xs text-teal-200 mb-1">{t("dashboard.profitPerDay")}</p>
                <p className="text-2xl font-bold text-green-300"><AnimatedNumber value={stats.dailyProfit} decimals={0} suffix=" €" /></p>
              </div>
            </div>
          </div>

          {/* Projections Line Chart */}
          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-5">
            <div className="flex items-center gap-2 mb-4">
              <TrendingUp className="w-5 h-5 text-indigo-600" />
              <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100">{t("dashboard.projections6Months")}</h3>
              <span className="text-xs text-slate-400 dark:text-slate-500 ml-auto">{t("dashboard.revenueVsCosts")}</span>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={stats.projectionData} margin={{ top: 5, right: 30, bottom: 5, left: 10 }}>
                <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} tickFormatter={(v: number) => `${(v / 1000).toFixed(0)}k€`} />
                <Tooltip
                  content={({ active, payload, label }) => {
                    if (!active || !payload?.length) return null;
                    return (
                      <div className="bg-white dark:bg-slate-800 shadow-xl rounded-lg p-3 border border-slate-200 dark:border-slate-600 text-sm min-w-[180px]">
                        <p className="font-semibold text-slate-800 dark:text-slate-100 mb-1.5">{label}</p>
                        {payload.map((p, i: number) => (
                          <div key={i} className="flex items-center gap-2 mt-0.5">
                            <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: p.color }} />
                            <span className="text-slate-400 dark:text-slate-400">{p.name}:</span>
                            <span className="font-semibold ml-auto" style={{ color: p.color }}>{p.value?.toLocaleString('fr-FR')} €</span>
                          </div>
                        ))}
                      </div>
                    );
                  }}
                />
                <Line type="monotone" dataKey="revenue" name={t("dashboard.revenue")} stroke="#2563eb" strokeWidth={2.5} dot={{ fill: '#2563eb', r: 4 }} />
                <Line type="monotone" dataKey="costs" name={t("dashboard.costs")} stroke="#dc2626" strokeWidth={2.5} dot={{ fill: '#dc2626', r: 4 }} strokeDasharray="5 5" />
                <Line type="monotone" dataKey="profit" name={t("dashboard.profit")} stroke="#059669" strokeWidth={2.5} dot={{ fill: '#059669', r: 4 }} />
                <Legend />
              </LineChart>
            </ResponsiveContainer>
            {/* Break-even indicator */}
            <div className="mt-4 flex flex-wrap items-center gap-4">
              <div className="flex items-center gap-2 bg-teal-50 dark:bg-teal-900/20 border border-teal-200 dark:border-teal-800/50 rounded-lg px-3 py-2">
                <Target className="w-4 h-4 text-teal-600" />
                <span className="text-sm text-teal-800 dark:text-teal-300 font-medium">
                  {t("dashboard.breakEvenPoint")} : {stats.seuilRentabilite > 0 ? `${stats.seuilRentabilite} ${t("dashboard.coversPerDay")}` : t("dashboard.profitableFromFirst")}
                </span>
              </div>
              <div className="flex items-center gap-2 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800/50 rounded-lg px-3 py-2">
                <DollarSign className="w-4 h-4 text-green-600" />
                <span className="text-sm text-green-800 dark:text-green-300 font-medium">
                  {t("dashboard.estimatedMonthlyProfit")} : {(stats.dailyProfit * 26).toLocaleString('fr-FR')} €
                </span>
              </div>
            </div>
          </div>

          {/* Break-even analysis + coefficient distribution side by side */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Break-even analysis */}
            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-5">
              <div className="flex items-center gap-2 mb-4">
                <Target className="w-5 h-5 text-teal-600" />
                <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100">{t("dashboard.profitabilityAnalysis")}</h3>
              </div>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-slate-50 dark:bg-slate-700/50 rounded-lg p-4">
                    <p className="text-xs text-slate-400 dark:text-slate-400 mb-1">{t("dashboard.avgCostRatio")}</p>
                    <p className="text-2xl font-bold text-slate-800 dark:text-slate-100">
                      <AnimatedNumber value={stats.avgCostRatio * 100} decimals={1} suffix="%" />
                    </p>
                  </div>
                  <div className="bg-slate-50 dark:bg-slate-700/50 rounded-lg p-4">
                    <p className="text-xs text-slate-400 dark:text-slate-400 mb-1">{t("dashboard.profitPerCover")}</p>
                    <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                      <AnimatedNumber value={stats.profitPerCouvert} decimals={2} suffix=" €" />
                    </p>
                  </div>
                  <div className="bg-slate-50 dark:bg-slate-700/50 rounded-lg p-4">
                    <p className="text-xs text-slate-400 dark:text-slate-400 mb-1">{t("dashboard.coversPerDay")}</p>
                    <p className="text-2xl font-bold text-slate-800 dark:text-slate-100">{stats.dailyCouverts}</p>
                  </div>
                  <div className="bg-slate-50 dark:bg-slate-700/50 rounded-lg p-4">
                    <p className="text-xs text-slate-400 dark:text-slate-400 mb-1">{t("dashboard.avgFoodCost")}</p>
                    <p className="text-2xl font-bold text-slate-800 dark:text-slate-100">
                      <AnimatedNumber value={stats.avgFoodCost} decimals={2} suffix=" €" />
                    </p>
                  </div>
                </div>
                {stats.seuilRentabilite > 0 && (
                  <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800/50 rounded-lg p-4">
                    <div className="flex items-center gap-2 text-yellow-800 dark:text-yellow-300">
                      <AlertTriangle className="w-4 h-4" />
                      <span className="text-sm font-semibold">{t("dashboard.breakEvenPoint")} : {stats.seuilRentabilite} {t("dashboard.coversPerDay")}</span>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Coefficient distribution chart */}
            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-5">
              <div className="flex items-center gap-2 mb-4">
                <BarChart3 className="w-5 h-5 text-purple-600" />
                <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100">{t("dashboard.coefficientDistribution")}</h3>
              </div>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={stats.coeffBuckets}>
                  <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                  <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                  <YAxis allowDecimals={false} tick={{ fontSize: 12 }} />
                  <Tooltip content={<ChartTooltip />} />
                  <Bar dataKey="count" name={t("dashboard.nbRecipes")} radius={[4, 4, 0, 0]}>
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
              <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100">{t("dashboard.bottom5LeastProfitable")}</h3>
              <span className="text-xs text-red-500 font-medium bg-red-50 dark:bg-red-900/20 px-2 py-0.5 rounded-full ml-auto">{t("dashboard.actionRequired")}</span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-slate-400 dark:text-slate-400 border-b border-slate-200 dark:border-slate-700">
                    <th className="pb-2 font-medium">#</th>
                    <th className="pb-2 font-medium">{t("dashboard.recipe")}</th>
                    <th className="pb-2 font-medium">{t("dashboard.category")}</th>
                    <th className="pb-2 text-right font-medium">{t("dashboard.sellingPrice")}</th>
                    <th className="pb-2 text-right font-medium">{t("dashboard.totalCost")}</th>
                    <th className="pb-2 text-right font-medium">{t("dashboard.margin")}</th>
                    <th className="pb-2 text-right font-medium">{t("dashboard.coeff")}</th>
                    <th className="pb-2 text-center font-medium">{t("dashboard.action")}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                  {stats.worst5.map((r, i) => (
                    <tr key={r.id} className="hover:bg-red-50/50 dark:hover:bg-red-900/10">
                      <td className="py-2.5 text-red-500 font-bold">{i + 1}</td>
                      <td className="py-2.5 font-medium text-slate-800 dark:text-slate-200">{r.name}</td>
                      <td className="py-2.5 text-slate-400 dark:text-slate-400">{r.category}</td>
                      <td className="py-2.5 text-right font-mono text-slate-400 dark:text-slate-300">{r.sellingPrice.toFixed(2)} €</td>
                      <td className="py-2.5 text-right font-mono text-slate-400 dark:text-slate-300">{(r.margin.totalCostPerPortion || r.margin.costPerPortion).toFixed(2)} €</td>
                      <td className={`py-2.5 text-right font-mono font-bold ${r.margin.marginPercent < 50 ? 'text-red-600' : 'text-amber-600'}`}>
                        {r.margin.marginPercent.toFixed(1)}%
                      </td>
                      <td className="py-2.5 text-right font-mono text-slate-400 dark:text-slate-300">{r.margin.coefficient.toFixed(2)}</td>
                      <td className="py-2.5 text-center">
                        <Link to={`/recipes/${r.id}`} className="inline-flex items-center gap-1 text-xs text-teal-600 dark:text-teal-400 hover:underline font-medium">
                          {t("dashboard.edit")} <ArrowRight className="w-3 h-3" />
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
              <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100">{t("dashboard.detailByDish")}</h3>
              <span className="text-xs text-slate-400 dark:text-slate-500">{t("dashboard.sortedByMarginAsc")}</span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-slate-50 dark:bg-slate-700/50 text-slate-300 dark:text-slate-300">
                  <tr>
                    <th className="px-4 py-2.5 text-left font-medium">{t("dashboard.dish")}</th>
                    <th className="px-4 py-2.5 text-left font-medium">{t("dashboard.cat")}</th>
                    <th className="px-4 py-2.5 text-right font-medium">{t("dashboard.price")}</th>
                    <th className="px-4 py-2.5 text-right font-medium">{t("dashboard.foodCostShort")}</th>
                    <th className="px-4 py-2.5 text-right font-medium">{t("dashboard.laborCostShort")}</th>
                    <th className="px-4 py-2.5 text-right font-medium">{t("dashboard.totalCost")}</th>
                    <th className="px-4 py-2.5 text-right font-medium">{t("dashboard.marginEuro")}</th>
                    <th className="px-4 py-2.5 text-right font-medium">{t("dashboard.marginPercent")}</th>
                    <th className="px-4 py-2.5 text-right font-medium">{t("dashboard.coeff")}</th>
                    <th className="px-4 py-2.5 text-center font-medium">{t("dashboard.sheet")}</th>
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
                        <td className="px-4 py-2.5 text-slate-400 dark:text-slate-400">{r.category}</td>
                        <td className="px-4 py-2.5 text-right font-mono text-slate-400 dark:text-slate-300">{r.sellingPrice.toFixed(2)} €</td>
                        <td className="px-4 py-2.5 text-right font-mono text-slate-400 dark:text-slate-300">{r.margin.costPerPortion.toFixed(2)} €</td>
                        <td className="px-4 py-2.5 text-right font-mono text-slate-400 dark:text-slate-400">{(r.margin.laborCostPerPortion || 0).toFixed(2)} €</td>
                        <td className="px-4 py-2.5 text-right font-mono font-medium text-slate-800 dark:text-slate-200">{(r.margin.totalCostPerPortion || r.margin.costPerPortion).toFixed(2)} €</td>
                        <td className="px-4 py-2.5 text-right font-mono text-slate-400 dark:text-slate-300">{r.margin.marginAmount.toFixed(2)} €</td>
                        <td className={`px-4 py-2.5 text-right font-mono font-semibold ${mc}`}>{r.margin.marginPercent.toFixed(1)}%</td>
                        <td className="px-4 py-2.5 text-right font-mono text-slate-400 dark:text-slate-300">{r.margin.coefficient.toFixed(2)}</td>
                        <td className="px-4 py-2.5 text-center">
                          <Link to={`/recipes/${r.id}`} className="text-teal-600 dark:text-teal-400 hover:text-teal-800 dark:hover:text-teal-300">
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
