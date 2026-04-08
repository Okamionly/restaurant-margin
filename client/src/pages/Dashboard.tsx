import { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  TrendingUp, TrendingDown, DollarSign, ChefHat, Eye, Briefcase,
  PieChart as PieChartIcon, AlertTriangle, Plus, Printer, ShieldAlert,
  Trophy, Target, Calculator, Utensils, BarChart3, ArrowRight, ArrowUpRight, ArrowDownRight,
  Package, ClipboardList, FileText, ShoppingCart,
  Lightbulb, Sparkles, Star, Zap, ArrowDown,
  Building2, ShoppingBasket, Mic, Check,
  X, Loader2, Copy, Mail, Download,
  Scale, ScanLine, Brain, Clock, Activity,
  AlertCircle, PackageX, Flame,
} from 'lucide-react';
import {
  PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Legend, LineChart, Line, AreaChart, Area,
} from 'recharts';
import { fetchRecipes, fetchIngredients, fetchAlerts, fetchInventoryAlerts } from '../services/api';
import type { InventoryItem } from '../types';
import type { Recipe, Ingredient } from '../types';
import { ALLERGENS } from '../types';
import { useTranslation } from '../hooks/useTranslation';
import { useRestaurant } from '../hooks/useRestaurant';
import { formatCurrency, currencySuffix, getCurrencySymbol } from '../utils/currency';
import { getCurrentSeason, getCurrentSeasonLabel, getSeasonalProducts, getSeasonIcon } from '../data/seasons';
import { trackEvent } from '../utils/analytics';

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
type TabKey = 'overview' | 'margins' | 'costs' | 'profitability' | 'pnl';
const TAB_ICONS: Record<TabKey, any> = {
  overview: BarChart3,
  margins: TrendingUp,
  costs: ShoppingCart,
  profitability: DollarSign,
  pnl: ClipboardList,
};

// ── Stat card color configs ────────────────────────────────────────────────
const STAT_CARD_STYLES: Record<string, { gradient: string; border: string }> = {
  teal:   { gradient: 'from-[#F0FDFA] to-white dark:from-teal-950/20 dark:to-black/40',   border: 'border-t-teal-400' },
  green:  { gradient: 'from-[#F0FDF4] to-white dark:from-green-950/20 dark:to-black/40',  border: 'border-t-emerald-400' },
  amber:  { gradient: 'from-[#FFFBEB] to-white dark:from-amber-950/20 dark:to-black/40',  border: 'border-t-amber-400' },
  purple: { gradient: 'from-[#FAF5FF] to-white dark:from-purple-950/20 dark:to-black/40', border: 'border-t-purple-400' },
  cyan:   { gradient: 'from-[#ECFEFF] to-white dark:from-cyan-950/20 dark:to-black/40',    border: 'border-t-cyan-400' },
  slate:  { gradient: 'from-[#F8FAFC] to-white dark:from-[#0A0A0A]/30 dark:to-black/40',   border: 'border-t-[#9CA3AF]' },
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
    <div className={`bg-gradient-to-b ${style.gradient} rounded-xl shadow-sm border border-[#E5E7EB] dark:border-[#1A1A1A]/50 border-t-[3px] ${style.border} p-3 sm:p-4 lg:p-5 transition-all duration-300 hover:shadow-lg dark:hover:shadow-black/20 hover:-translate-y-0.5 dark:bg-[#0A0A0A]/40 dark:backdrop-blur-md`}>
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs sm:text-sm font-medium text-[#9CA3AF] dark:text-[#737373] truncate font-general-sans">{title}</span>
        <div className={`p-2 rounded-lg ${color} shadow-lg`}>
          <Icon className="w-4 h-4 text-white" />
        </div>
      </div>
      <div className="flex items-end gap-2">
        <div className="text-xl sm:text-2xl lg:text-3xl font-black font-satoshi text-[#111111] dark:text-white tracking-tight">
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
      {subtitle && <p className="text-xs text-[#9CA3AF] dark:text-[#737373] mt-1 truncate font-general-sans">{subtitle}</p>}
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
      <span className="text-xs font-bold text-[#9CA3AF] dark:text-[#737373] w-5 text-right">{rank}</span>
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between mb-1">
          <span className="text-sm font-medium text-[#9CA3AF] dark:text-[#A3A3A3] truncate pr-2 group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors">
            {name}
          </span>
          <span className="text-sm font-bold tabular-nums whitespace-nowrap" style={{ color }}>
            {value.toFixed(1)}{unit}
          </span>
        </div>
        <div className="h-2 bg-[#F3F4F6] dark:bg-[#171717] rounded-full overflow-hidden">
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
    <div className="bg-white dark:bg-[#0A0A0A]/90 dark:backdrop-blur-lg shadow-xl rounded-lg p-3 border border-[#E5E7EB] dark:border-[#1A1A1A]/50 text-sm min-w-[180px]">
      <p className="font-semibold text-[#111111] dark:text-white mb-1.5">
        {String(payload[0]?.payload?.fullName || label || payload[0]?.payload?.name || '')}
      </p>
      {payload.map((p: TooltipPayloadEntry, i: number) => (
        <div key={i} className="flex items-center gap-2 mt-0.5">
          <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: p.color || p.fill }} />
          <span className="text-[#9CA3AF] dark:text-[#737373]">{p.name}:</span>
          <span className="font-semibold ml-auto" style={{ color: p.color || p.fill }}>
            {typeof p.value === 'number'
              ? (p.dataKey === 'margin' || p.dataKey === 'avgMargin' || p.dataKey === 'marginPercent'
                ? `${p.value.toFixed(1)}%`
                : p.dataKey === 'count'
                  ? p.value
                  : formatCurrency(p.value))
              : p.value}
          </span>
        </div>
      ))}
    </div>
  );
}

// ── Budget Widget ─────────────────────────────────────────────────────────
interface BudgetData {
  dailyBudget: number | null;
  weeklyBudget: number | null;
  monthlyBudget: number | null;
  todaySpending: number;
  weekSpending: number;
  monthSpending: number;
  budgetUsed: number;
  daysOverBudget: number;
  forecast: number;
  dayOfMonth: number;
  daysInMonth: number;
}

function BudgetWidget({ data, onEditBudget }: { data: BudgetData | null; onEditBudget: () => void }) {
  const [editing, setEditing] = useState(false);
  const [dailyInput, setDailyInput] = useState('');

  if (!data) return null;

  const hasBudget = data.dailyBudget && data.dailyBudget > 0;
  const pct = hasBudget ? Math.min(data.budgetUsed, 100) : 0;
  const overBudget = data.budgetUsed > 100;
  const overAmount = overBudget ? data.todaySpending - (data.dailyBudget || 0) : 0;

  // SVG circular progress ring
  const radius = 36;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (pct / 100) * circumference;

  // Color based on percentage — detect dark mode
  const isDark = document.documentElement.classList.contains('dark');
  const ringColor = !hasBudget
    ? (isDark ? '#737373' : '#9CA3AF')
    : data.budgetUsed < 70
    ? (isDark ? '#FFFFFF' : '#111111')
    : data.budgetUsed < 90
    ? (isDark ? '#F59E0B' : '#D97706')
    : (isDark ? '#EF4444' : '#DC2626');

  const handleSaveBudget = async () => {
    const val = parseFloat(dailyInput);
    if (isNaN(val) || val <= 0) return;
    try {
      const token = localStorage.getItem('token');
      const restaurantId = localStorage.getItem('activeRestaurantId');
      await fetch('/api/budget/set', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
          ...(restaurantId ? { 'X-Restaurant-Id': restaurantId } : {}),
        },
        body: JSON.stringify({ dailyBudget: val }),
      });
      setEditing(false);
      onEditBudget();
    } catch (err) { console.error(err); }
  };

  return (
    <div className="relative rounded-2xl border border-[#E5E7EB] dark:border-[#1A1A1A]/50 bg-white/80 dark:bg-[#0A0A0A]/40 backdrop-blur-xl shadow-sm p-3 sm:p-5 overflow-hidden">
      {/* Over-budget alert banner */}
      {overBudget && (
        <div className="flex items-center gap-2 mb-4 px-3 py-2 rounded-lg bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900/50">
          <AlertTriangle className="w-4 h-4 text-red-600 dark:text-red-400 flex-shrink-0" />
          <span className="text-xs font-medium text-red-700 dark:text-red-300">
            Attention : depassement de budget de {formatCurrency(overAmount)}
          </span>
        </div>
      )}

      <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 sm:gap-5">
        {/* Circular progress ring */}
        <div className="relative flex-shrink-0">
          <svg width="88" height="88" viewBox="0 0 88 88" className="transform -rotate-90">
            {/* Background ring */}
            <circle
              cx="44" cy="44" r={radius}
              fill="none" strokeWidth="6"
              className="stroke-[#E5E7EB] dark:stroke-[#1A1A1A]"
            />
            {/* Progress ring */}
            <circle
              cx="44" cy="44" r={radius}
              fill="none" strokeWidth="6"
              strokeLinecap="round"
              style={{
                stroke: ringColor,
                strokeDasharray: circumference,
                strokeDashoffset: hasBudget ? strokeDashoffset : circumference,
                transition: 'stroke-dashoffset 0.8s ease-out',
              }}
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-lg font-black text-[#111111] dark:text-white leading-none">
              {hasBudget ? `${Math.round(data.budgetUsed)}%` : '---'}
            </span>
            <span className="text-[10px] text-[#9CA3AF] dark:text-[#737373] mt-0.5">budget</span>
          </div>
        </div>

        {/* Details */}
        <div className="flex-1 min-w-0 space-y-2">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-[#111111] dark:text-white">Budget du jour</h3>
            <button
              onClick={() => {
                if (!editing) {
                  setDailyInput(String(data.dailyBudget || ''));
                  setEditing(true);
                } else {
                  setEditing(false);
                }
              }}
              className="text-xs text-[#9CA3AF] dark:text-[#737373] hover:text-[#111111] dark:hover:text-white transition-colors"
            >
              {editing ? 'Annuler' : 'Modifier'}
            </button>
          </div>

          {editing ? (
            <div className="flex items-center gap-2">
              <input
                type="number"
                value={dailyInput}
                onChange={(e) => setDailyInput(e.target.value)}
                placeholder="Budget quotidien"
                className="w-full px-2.5 py-1.5 text-sm bg-[#FAFAFA] dark:bg-[#171717] border border-[#E5E7EB] dark:border-[#1A1A1A] rounded-lg text-[#111111] dark:text-white placeholder-[#9CA3AF]"
                autoFocus
                onKeyDown={(e) => { if (e.key === 'Enter') handleSaveBudget(); }}
              />
              <span className="text-sm text-[#9CA3AF]">{getCurrencySymbol()}</span>
              <button
                onClick={handleSaveBudget}
                className="px-2.5 py-1.5 text-xs font-medium bg-[#111111] dark:bg-white text-white dark:text-black rounded-lg hover:bg-[#333] dark:hover:bg-[#E5E5E5] transition-colors"
              >
                OK
              </button>
            </div>
          ) : (
            <>
              {/* Today */}
              <div className="flex items-center justify-between text-xs">
                <span className="text-[#9CA3AF] dark:text-[#737373]">Aujourd'hui</span>
                <span className="font-semibold text-[#111111] dark:text-white">
                  {formatCurrency(data.todaySpending)}
                  {hasBudget && (
                    <span className="text-[#9CA3AF] dark:text-[#737373] font-normal"> / {formatCurrency(data.dailyBudget ?? 0)}</span>
                  )}
                </span>
              </div>
              {/* Week */}
              <div className="flex items-center justify-between text-xs">
                <span className="text-[#9CA3AF] dark:text-[#737373]">Semaine</span>
                <span className="font-semibold text-[#111111] dark:text-white">
                  {formatCurrency(data.weekSpending)}
                  {data.weeklyBudget && data.weeklyBudget > 0 && (
                    <span className="text-[#9CA3AF] dark:text-[#737373] font-normal"> / {formatCurrency(data.weeklyBudget)}</span>
                  )}
                </span>
              </div>
              {/* Month */}
              <div className="flex items-center justify-between text-xs">
                <span className="text-[#9CA3AF] dark:text-[#737373]">Mois</span>
                <span className="font-semibold text-[#111111] dark:text-white">
                  {formatCurrency(data.monthSpending)}
                  {data.monthlyBudget && data.monthlyBudget > 0 && (
                    <span className="text-[#9CA3AF] dark:text-[#737373] font-normal"> / {formatCurrency(data.monthlyBudget)}</span>
                  )}
                </span>
              </div>
              {/* Forecast + days over */}
              {hasBudget && (
                <div className="flex items-center justify-between text-xs pt-1 border-t border-[#E5E7EB] dark:border-[#1A1A1A]">
                  <span className="text-[#9CA3AF] dark:text-[#737373]">
                    Prevision fin de mois
                  </span>
                  <span className="font-semibold text-[#111111] dark:text-white">{data.forecast.toFixed(0)}{currencySuffix()}</span>
                </div>
              )}
              {data.daysOverBudget > 0 && (
                <div className="text-[10px] text-red-600 dark:text-red-400 font-medium">
                  {data.daysOverBudget} jour{data.daysOverBudget > 1 ? 's' : ''} en depassement ce mois
                </div>
              )}
            </>
          )}
        </div>
      </div>
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
    <div className="relative rounded-2xl border border-teal-500/30 bg-white/5 dark:bg-[#0A0A0A]/40 backdrop-blur-xl shadow-xl shadow-teal-900/5 p-6 overflow-hidden stagger-1">
      {/* Glassmorphism decorative blobs */}
      <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full bg-teal-400/10 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-10 -left-10 w-32 h-32 rounded-full bg-cyan-400/10 blur-3xl pointer-events-none" />

      {/* Header */}
      <div className="relative flex items-center justify-between mb-5">
        <div>
          <h3 className="text-lg font-bold text-[#111111] dark:text-white font-satoshi">
            {allDone ? 'Bravo ! Vous êtes prêt 🎉' : 'Premiers pas avec RestauMargin'}
          </h3>
          <p className="text-sm text-[#6B7280] dark:text-[#737373] mt-0.5">
            {allDone ? 'Toutes les étapes sont complétées.' : `${completedSteps.length}/${ONBOARDING_STEPS.length} étapes complétées`}
          </p>
        </div>
        {allDone && (
          <button
            onClick={() => setDismissed(true)}
            className="text-xs text-[#9CA3AF] hover:text-[#6B7280] dark:hover:text-[#A3A3A3] transition-colors"
          >
            Masquer
          </button>
        )}
      </div>

      {/* Progress bar */}
      <div className="relative h-2.5 bg-[#E5E7EB] dark:bg-[#171717] rounded-full overflow-hidden mb-6">
        <div
          className="h-full rounded-full bg-gradient-to-r from-teal-500 to-cyan-400 transition-all duration-700 ease-out"
          style={{ width: `${progress}%` }}
        />
        <span className="absolute right-2 top-1/2 -translate-y-1/2 text-[10px] font-bold text-[#6B7280] dark:text-[#737373]">
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
                      ? 'bg-white dark:bg-[#171717]/50 border border-teal-400/50 dark:border-teal-500/30 shadow-md shadow-teal-500/10 hover:shadow-lg hover:shadow-teal-500/15'
                      : 'bg-[#FAFAFA] dark:bg-[#0A0A0A]/30 border border-[#E5E7EB]/50 dark:border-[#1A1A1A]/30 opacity-60 hover:opacity-80'
                  }`}
                style={{ animationDelay: `${i * 80}ms` }}
              >
                {/* Circle indicator */}
                <div className={`relative flex-shrink-0 w-9 h-9 rounded-full flex items-center justify-center transition-all duration-300
                  ${done
                    ? 'bg-teal-500 text-white shadow-md shadow-teal-500/30'
                    : isCurrent
                      ? 'bg-teal-100 dark:bg-teal-900/40 text-teal-600 dark:text-teal-400 ring-2 ring-teal-400/50'
                      : 'bg-[#E5E7EB] dark:bg-[#171717] text-[#9CA3AF] dark:text-[#737373]'
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
                      ? 'text-[#111111] dark:text-white'
                      : 'text-[#6B7280] dark:text-[#737373]'
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
  const [aiUsage, setAiUsage] = useState<{ used: number; limit: number; percentage: number } | null>(null);
  const [pnlPeriod, setPnlPeriod] = useState<'week' | 'month' | 'year'>('month');
  const [pnlData, setPnlData] = useState<any>(null);
  const [pnlLoading, setPnlLoading] = useState(false);
  const [reportModalOpen, setReportModalOpen] = useState(false);
  const [reportLoading, setReportLoading] = useState(false);
  const [reportData, setReportData] = useState<{ report: string; generatedAt: string; keyMetrics: any } | null>(null);
  const [reportCopied, setReportCopied] = useState(false);
  const [reportEmailSending, setReportEmailSending] = useState(false);
  const [reportEmailSent, setReportEmailSent] = useState(false);
  const navigate = useNavigate();
  const [budgetData, setBudgetData] = useState<BudgetData | null>(null);

  // ── New Dashboard Enhancement State ────────────────────────────────
  const [inventoryAlerts, setInventoryAlerts] = useState<InventoryItem[]>([]);
  const [systemAlerts, setSystemAlerts] = useState<{ alerts: { type: string; severity: string; title: string; detail: string }[]; count: number }>({ alerts: [], count: 0 });
  const [recentActivity, setRecentActivity] = useState<{ id: string; type: string; label: string; detail: string; time: string; icon: string }[]>([]);

  // ── AI Predictive state ──────────────────────────────────────────────
  const [forecastData, setForecastData] = useState<any>(null);
  const [forecastLoading, setForecastLoading] = useState(false);
  const [pricingData, setPricingData] = useState<any>(null);
  const [pricingLoading, setPricingLoading] = useState(false);
  const [aiPredictiveLoaded, setAiPredictiveLoaded] = useState(false);

  // ── Budget fetch ──────────────────────────────────────────────────────
  const fetchBudget = useCallback(async () => {
    try {
      const token = localStorage.getItem('token');
      const restaurantId = localStorage.getItem('activeRestaurantId');
      const res = await fetch('/api/budget/status', {
        headers: {
          Authorization: `Bearer ${token}`,
          ...(restaurantId ? { 'X-Restaurant-Id': restaurantId } : {}),
        },
      });
      if (res.ok) {
        const d = await res.json();
        setBudgetData(d);
      }
    } catch (err) { console.error(err); }
  }, []);

  // ── Weekly AI Report ──────────────────────────────────────────────────
  const REPORT_CACHE_KEY = 'restaumargin_weekly_report';
  const REPORT_CACHE_TTL = 24 * 60 * 60 * 1000; // 24h

  const fetchWeeklyReport = useCallback(async () => {
    // Check localStorage cache first
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
    } catch { /* ignore parse errors */ }

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
      console.error('Weekly report error:', err.message);
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

  const printReport = useCallback(() => {
    // Mark the report modal as print target, hide rest
    const modal = document.querySelector('[data-print-report]');
    if (modal) modal.classList.add('print-target');
    document.querySelectorAll('.no-print, nav, aside, header').forEach(el => el.classList.add('print-hide'));
    window.print();
    // Cleanup after print
    setTimeout(() => {
      if (modal) modal.classList.remove('print-target');
      document.querySelectorAll('.print-hide').forEach(el => el.classList.remove('print-hide'));
    }, 500);
  }, []);

  const TABS: { key: TabKey; label: string; desc: string; icon: React.ComponentType<{ className?: string }> }[] = [
    { key: 'overview', label: t("dashboard.tabOverview"), desc: t("dashboard.tabOverviewDesc"), icon: TAB_ICONS.overview },
    { key: 'margins', label: t("dashboard.tabMargins"), desc: t("dashboard.tabMarginsDesc"), icon: TAB_ICONS.margins },
    { key: 'costs', label: t("dashboard.tabCosts"), desc: t("dashboard.tabCostsDesc"), icon: TAB_ICONS.costs },
    { key: 'profitability', label: t("dashboard.tabProfitability"), desc: t("dashboard.tabProfitabilityDesc"), icon: TAB_ICONS.profitability },
    { key: 'pnl', label: 'Compte de Resultat', desc: 'P&L et rentabilite', icon: TAB_ICONS.pnl },
  ];

  useEffect(() => {
    trackEvent('page_view', { page: 'dashboard' });
    // Fetch AI usage
    const token = localStorage.getItem('token');
    const restaurantId = localStorage.getItem('activeRestaurantId');
    fetch('/api/ai/usage', {
      headers: {
        Authorization: `Bearer ${token}`,
        ...(restaurantId ? { 'X-Restaurant-Id': restaurantId } : {}),
      },
    })
      .then(r => r.ok ? r.json() : null)
      .then(data => { if (data) setAiUsage(data); })
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (restaurantLoading || !selectedRestaurant) return;
    Promise.all([fetchRecipes(), fetchIngredients()])
      .then(([r, i]) => { setRecipes(r); setIngredients(i); })
      .catch(() => console.error('Erreur chargement'))
      .finally(() => setLoading(false));
    fetchBudget();
    // Fetch inventory alerts and system alerts for dashboard cards
    fetchInventoryAlerts()
      .then(data => setInventoryAlerts(data || []))
      .catch(() => {});
    fetchAlerts()
      .then(data => { if (data) setSystemAlerts(data); })
      .catch(() => {});
    // Build recent activity from recipes/ingredients timestamps
    Promise.all([fetchRecipes(), fetchIngredients()])
      .then(([recs, ings]) => {
        const activities: { id: string; type: string; label: string; detail: string; time: string; icon: string }[] = [];
        recs.slice(0, 20).forEach(r => {
          if (r.updatedAt) {
            activities.push({ id: `recipe-${r.id}`, type: 'recipe', label: 'Recette modifiee', detail: r.name, time: r.updatedAt, icon: 'chef' });
          }
          if (r.createdAt && r.createdAt !== r.updatedAt) {
            activities.push({ id: `recipe-new-${r.id}`, type: 'recipe-new', label: 'Nouvelle recette', detail: r.name, time: r.createdAt, icon: 'plus' });
          }
        });
        ings.slice(0, 20).forEach(i => {
          if (i.updatedAt) {
            activities.push({ id: `ing-${i.id}`, type: 'ingredient', label: 'Ingredient mis a jour', detail: i.name, time: i.updatedAt, icon: 'package' });
          }
        });
        activities.sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime());
        setRecentActivity(activities.slice(0, 10));
      })
      .catch(() => {});
  }, [selectedRestaurant, restaurantLoading, fetchBudget]);

  // ── P&L data fetch ──────────────────────────────────────────────────────
  useEffect(() => {
    if (activeTab !== 'pnl' || restaurantLoading || !selectedRestaurant) return;
    setPnlLoading(true);
    const token = localStorage.getItem('token');
    const restaurantId = localStorage.getItem('activeRestaurantId');
    fetch(`/api/analytics/pnl?period=${pnlPeriod}&couverts=${couverts}&avgTicket=${avgPricePerCouvert}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        ...(restaurantId ? { 'X-Restaurant-Id': restaurantId } : {}),
      },
    })
      .then(r => r.ok ? r.json() : null)
      .then(data => { if (data) setPnlData(data); })
      .catch(() => console.error('Erreur chargement P&L'))
      .finally(() => setPnlLoading(false));
  }, [activeTab, pnlPeriod, couverts, avgPricePerCouvert, selectedRestaurant, restaurantLoading]);

  // ── AI Predictive auto-load when P&L tab is active ────────────────────
  useEffect(() => {
    if (activeTab !== 'pnl' || restaurantLoading || !selectedRestaurant || aiPredictiveLoaded) return;
    const token = localStorage.getItem('token');
    const restaurantId = localStorage.getItem('activeRestaurantId');
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
      ...(restaurantId ? { 'X-Restaurant-Id': restaurantId } : {}),
    };

    // Load demand forecast
    setForecastLoading(true);
    fetch('/api/ai/demand-forecast', { method: 'POST', headers, body: '{}' })
      .then(r => r.ok ? r.json() : null)
      .then(data => { if (data) setForecastData(data); })
      .catch(() => {})
      .finally(() => setForecastLoading(false));

    // Load pricing suggestions
    setPricingLoading(true);
    fetch('/api/ai/pricing-suggestions', { method: 'POST', headers, body: '{}' })
      .then(r => r.ok ? r.json() : null)
      .then(data => { if (data) setPricingData(data); })
      .catch(() => {})
      .finally(() => setPricingLoading(false));

    setAiPredictiveLoaded(true);
  }, [activeTab, restaurantLoading, selectedRestaurant, aiPredictiveLoaded]);

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
        const cost = (ri.quantity / getUnitDivisor(ri.ingredient.unit)) * ri.ingredient.pricePerUnit * (1 + ri.wastePercent / 100);
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
        text: `${t("dashboard.aiIncreasePriceOf")} ${w.name} ${t("dashboard.aiBy")} ${formatCurrency(suggestedIncrease)} (+${((suggestedIncrease / w.sellingPrice) * 100).toFixed(0)}% ${t("dashboard.margin")})`,
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

  // ── Computed alerts (available even with partial data) ──────────────────
  const quickAlerts = useMemo(() => {
    const alerts: { id: string; icon: React.ComponentType<{ className?: string }>; text: string; color: string; bgColor: string; link: string }[] = [];
    // Ingredients without supplier
    const noSupplierCount = ingredients.filter(i => !i.supplier && !i.supplierId).length;
    if (noSupplierCount > 0) {
      alerts.push({
        id: 'no-supplier',
        icon: ShoppingBasket,
        text: `${noSupplierCount} ${noSupplierCount > 1 ? 'ingrédients sans fournisseur' : 'ingrédient sans fournisseur'}`,
        color: 'text-amber-600 dark:text-amber-400',
        bgColor: 'bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800/40',
        link: '/ingredients',
      });
    }
    // Low margin recipes
    const lowMarginRecipes = recipes.filter(r => r.margin?.marginPercent < 60);
    if (lowMarginRecipes.length > 0) {
      alerts.push({
        id: 'low-margin',
        icon: TrendingDown,
        text: `${lowMarginRecipes.length} ${lowMarginRecipes.length > 1 ? 'recettes avec marge < 60%' : 'recette avec marge < 60%'}`,
        color: 'text-red-600 dark:text-red-400',
        bgColor: 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800/40',
        link: '/recipes',
      });
    }
    // Ingredients without price
    const zeroPriceCount = ingredients.filter(i => !i.pricePerUnit || i.pricePerUnit === 0).length;
    if (zeroPriceCount > 0) {
      alerts.push({
        id: 'no-price',
        icon: AlertTriangle,
        text: `${zeroPriceCount} ${zeroPriceCount > 1 ? 'ingrédients sans prix défini' : 'ingrédient sans prix défini'}`,
        color: 'text-orange-600 dark:text-orange-400',
        bgColor: 'bg-orange-50 dark:bg-orange-900/20 border-orange-200 dark:border-orange-800/40',
        link: '/ingredients',
      });
    }
    return alerts;
  }, [ingredients, recipes]);

  // ── Top 5 recipes by margin ───────────────────────────────────────────
  const top5Margin = useMemo(() => {
    if (recipes.length === 0) return [];
    return [...recipes]
      .sort((a, b) => b.margin.marginPercent - a.margin.marginPercent)
      .slice(0, 5);
  }, [recipes]);

  // ── Category donut data (for partial state) ───────────────────────────
  const partialCategoryData = useMemo(() => {
    if (recipes.length === 0 && ingredients.length === 0) return [];
    if (recipes.length > 0) {
      const catMap = new Map<string, number>();
      recipes.forEach(r => catMap.set(r.category, (catMap.get(r.category) || 0) + 1));
      return Array.from(catMap.entries()).map(([name, count]) => ({ name, count }));
    }
    // Fallback: ingredient categories
    const catMap = new Map<string, number>();
    ingredients.forEach(i => catMap.set(i.category || 'Autres', (catMap.get(i.category || 'Autres') || 0) + 1));
    return Array.from(catMap.entries()).map(([name, count]) => ({ name, count }));
  }, [recipes, ingredients]);

  // ── Loading ────────────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="animate-spin rounded-full h-10 w-10 border-4 border-teal-600 border-t-transparent" />
      </div>
    );
  }

  // ── Empty state with onboarding — now shows dynamic KPIs ──────────────
  if (!stats || stats.totalRecipes === 0) {
    const avgFoodCostPct = recipes.length > 0
      ? recipes.reduce((s, r) => s + (r.margin.costPerPortion / r.sellingPrice * 100), 0) / recipes.length
      : 0;
    const avgMarginPct = recipes.length > 0
      ? recipes.reduce((s, r) => s + r.margin.marginPercent, 0) / recipes.length
      : 0;
    const hasAnyData = ingredients.length > 0 || recipes.length > 0;

    return (
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 stagger-1">
          <div>
            <h2 className="text-2xl sm:text-3xl font-black font-satoshi tracking-tight">
              <span className="bg-gradient-to-r from-teal-400 via-cyan-400 to-teal-300 bg-clip-text text-transparent">{t("dashboard.title")}</span>
            </h2>
            {hasAnyData && (
              <p className="text-sm text-[#9CA3AF] dark:text-[#737373] mt-1 font-general-sans">
                {recipes.length} {t("dashboard.recipesCount")} · {ingredients.length} {t("dashboard.ingredientsCount")}
              </p>
            )}
          </div>
          <div className="flex flex-wrap gap-2">
            <Link to="/ingredients" className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#111111] dark:bg-white text-white dark:text-black text-sm font-medium rounded-lg hover:bg-[#333] dark:hover:bg-[#E5E5E5] transition-colors shadow-sm">
              <Plus className="w-4 h-4" /> {t("dashboard.addIngredients")}
            </Link>
            <Link to="/recipes" className="inline-flex items-center gap-1.5 px-4 py-2 bg-white dark:bg-[#171717] text-[#6B7280] dark:text-[#E5E5E5] text-sm font-medium rounded-lg hover:bg-[#FAFAFA] dark:hover:bg-[#262626] transition-colors border border-[#E5E7EB] dark:border-[#1A1A1A] shadow-sm">
              <ClipboardList className="w-4 h-4" /> {t("dashboard.createRecipe")}
            </Link>
          </div>
        </div>

        {/* 4 Stat Cards — always visible */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 stagger-2">
          <StatCard
            title="Recettes"
            numericValue={recipes.length}
            decimals={0}
            icon={ClipboardList}
            color="bg-[#111111] dark:bg-white"
            colorKey="teal"
          />
          <StatCard
            title="Ingrédients"
            numericValue={ingredients.length}
            decimals={0}
            icon={ShoppingBasket}
            color="bg-purple-600"
            colorKey="purple"
          />
          <StatCard
            title="Food Cost Moyen"
            numericValue={avgFoodCostPct}
            suffix="%"
            subtitle={recipes.length === 0 ? 'Ajoutez des recettes' : undefined}
            icon={DollarSign}
            color={avgFoodCostPct > 35 ? 'bg-red-500' : 'bg-green-600'}
            colorKey={avgFoodCostPct > 35 ? 'amber' : 'green'}
            trend={recipes.length > 0 ? (avgFoodCostPct <= 35 ? 'up' : 'down') : null}
          />
          <StatCard
            title="Marge Moyenne"
            numericValue={avgMarginPct}
            suffix="%"
            subtitle={recipes.length === 0 ? 'Ajoutez des recettes' : avgMarginPct >= 70 ? 'Objectif atteint' : 'Objectif : 70%'}
            icon={TrendingUp}
            color={avgMarginPct >= 70 ? 'bg-green-600' : avgMarginPct >= 60 ? 'bg-amber-500' : 'bg-red-500'}
            colorKey={avgMarginPct >= 70 ? 'green' : 'amber'}
            trend={recipes.length > 0 ? (avgMarginPct >= 70 ? 'up' : 'down') : null}
          />
        </div>

        {/* Quick Alerts */}
        {quickAlerts.length > 0 && (
          <div className="relative rounded-2xl border border-[#E5E7EB] dark:border-[#1A1A1A]/50 bg-white/80 dark:bg-[#0A0A0A]/40 backdrop-blur-xl shadow-sm p-5 stagger-3">
            <div className="flex items-center gap-2 mb-4">
              <ShieldAlert className="w-5 h-5 text-amber-500" />
              <h3 className="text-base font-bold text-[#111111] dark:text-white font-satoshi">Alertes rapides</h3>
              <span className="ml-auto text-xs text-[#9CA3AF] dark:text-[#737373] font-general-sans">{quickAlerts.length} alerte{quickAlerts.length > 1 ? 's' : ''}</span>
            </div>
            <div className="space-y-2">
              {quickAlerts.map(alert => {
                const AlertIcon = alert.icon;
                return (
                  <Link
                    key={alert.id}
                    to={alert.link}
                    className={`flex items-center gap-3 p-3 rounded-xl border transition-all hover:shadow-md hover:-translate-y-0.5 ${alert.bgColor}`}
                  >
                    <AlertIcon className={`w-4 h-4 flex-shrink-0 ${alert.color}`} />
                    <span className={`text-sm font-medium ${alert.color}`}>{alert.text}</span>
                    <ArrowRight className={`w-3.5 h-3.5 ml-auto flex-shrink-0 ${alert.color} opacity-50`} />
                  </Link>
                );
              })}
            </div>
          </div>
        )}

        {/* Ingredient category donut (when ingredients exist) */}
        {partialCategoryData.length > 0 && (
          <div className="relative rounded-2xl border border-[#E5E7EB] dark:border-[#1A1A1A]/50 bg-white/80 dark:bg-[#0A0A0A]/40 backdrop-blur-xl shadow-sm p-5 stagger-4">
            <div className="flex items-center gap-2 mb-4">
              <PieChartIcon className="w-5 h-5 text-teal-600" />
              <h3 className="text-base font-bold text-[#111111] dark:text-white font-satoshi">
                {recipes.length > 0 ? 'Répartition par catégorie' : 'Ingrédients par catégorie'}
              </h3>
            </div>
            <ResponsiveContainer width="100%" height={260}>
              <PieChart>
                <Pie
                  data={partialCategoryData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={100}
                  paddingAngle={3}
                  dataKey="count"
                  nameKey="name"
                  label={(props: unknown) => {
                    const { cx, cy, midAngle, outerRadius, name, count, percent } = props as { cx: number; cy: number; midAngle: number; outerRadius: number; name: string; count: number; percent: number };
                    const RADIAN = Math.PI / 180;
                    const radius = (outerRadius || 0) + 20;
                    const x = (cx || 0) + radius * Math.cos(-(midAngle || 0) * RADIAN);
                    const y = (cy || 0) + radius * Math.sin(-(midAngle || 0) * RADIAN);
                    if ((percent || 0) < 0.05) return null;
                    return (
                      <text x={x} y={y} fill="currentColor" textAnchor={x > (cx || 0) ? 'start' : 'end'} dominantBaseline="central" className="text-xs fill-[#6B7280] dark:fill-[#A3A3A3]">
                        {String(name || '').slice(0, 15)} ({count})
                      </text>
                    );
                  }}
                  labelLine={true}
                >
                  {partialCategoryData.map((_entry, index) => (
                    <Cell key={index} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip content={<ChartTooltip />} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        )}

        {/* Onboarding Checklist */}
        <OnboardingChecklist
          restaurantName={selectedRestaurant?.name || ''}
          ingredientCount={ingredients.length}
          recipeCount={recipes.length}
          navigate={navigate}
        />

        {/* CTA if truly empty */}
        {!hasAnyData && (
          <div className="text-center py-12 bg-white dark:bg-[#0A0A0A] rounded-xl shadow-sm border border-[#E5E7EB] dark:border-[#1A1A1A]">
            <ChefHat className="w-14 h-14 mx-auto text-[#9CA3AF] dark:text-[#525252] mb-4" />
            <h3 className="text-lg font-semibold text-[#111111] dark:text-[#A3A3A3] mb-2">{t("dashboard.welcome")}</h3>
            <p className="text-[#9CA3AF] dark:text-[#737373] mb-6">{t("dashboard.emptyStateDesc")}</p>
            <div className="flex gap-4 justify-center">
              <Link to="/ingredients" className="btn-primary">{t("dashboard.addIngredients")}</Link>
              <Link to="/recipes" className="btn-secondary">{t("dashboard.createRecipe")}</Link>
            </div>
          </div>
        )}
      </div>
    );
  }

  const sortedByMargin = [...recipes].sort((a, b) => a.margin.marginPercent - b.margin.marginPercent);

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* ── Header + Quick Actions ────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4 stagger-1">
        <div>
          <h2 className="text-xl sm:text-2xl lg:text-3xl font-black font-satoshi tracking-tight">
            <span className="bg-gradient-to-r from-teal-400 via-cyan-400 to-teal-300 bg-clip-text text-transparent">{t("dashboard.title")}</span>
          </h2>
          <p className="text-sm text-[#9CA3AF] dark:text-[#737373] mt-1 font-general-sans">
            {stats.totalRecipes} {t("dashboard.recipesCount")} · {ingredients.length} {t("dashboard.ingredientsCount")}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => navigate('/recipes?action=new')}
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#111111] dark:bg-white text-white dark:text-black text-sm font-medium rounded-lg hover:bg-[#333] dark:hover:bg-[#E5E5E5] transition-colors shadow-sm"
          >
            <Plus className="w-4 h-4" /> {t("dashboard.newRecipe")}
          </button>
          <button
            onClick={() => navigate('/ingredients?action=new')}
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-white dark:bg-[#171717] text-[#6B7280] dark:text-[#E5E5E5] text-sm font-medium rounded-lg hover:bg-[#FAFAFA] dark:hover:bg-[#262626] transition-colors border border-[#E5E7EB] dark:border-[#1A1A1A] shadow-sm"
          >
            <Package className="w-4 h-4" /> {t("dashboard.addIngredient")}
          </button>
          <Link
            to="/recipes"
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-white dark:bg-[#171717] text-[#6B7280] dark:text-[#E5E5E5] text-sm font-medium rounded-lg hover:bg-[#FAFAFA] dark:hover:bg-[#262626] transition-colors border border-[#E5E7EB] dark:border-[#1A1A1A] shadow-sm"
          >
            <ClipboardList className="w-4 h-4" /> {t("dashboard.viewRecipes")}
          </Link>
          <Link
            to="/inventory"
            className="hidden sm:inline-flex items-center gap-1.5 px-4 py-2 bg-white dark:bg-[#171717] text-[#6B7280] dark:text-[#E5E5E5] text-sm font-medium rounded-lg hover:bg-[#FAFAFA] dark:hover:bg-[#262626] transition-colors border border-[#E5E7EB] dark:border-[#1A1A1A] shadow-sm"
          >
            <FileText className="w-4 h-4" /> {t("dashboard.viewInventory")}
          </Link>
          <button
            onClick={fetchWeeklyReport}
            className="inline-flex items-center gap-1.5 px-3 sm:px-4 py-2 bg-[#111111] dark:bg-white text-white dark:text-black text-sm font-medium rounded-lg hover:bg-[#333] dark:hover:bg-[#E5E5E5] transition-colors shadow-sm no-print"
          >
            <Sparkles className="w-4 h-4" /> <span className="hidden sm:inline">Rapport</span> IA
          </button>
          <button
            onClick={() => window.print()}
            className="hidden sm:inline-flex items-center gap-1.5 px-4 py-2 bg-white dark:bg-[#171717] text-[#6B7280] dark:text-[#E5E5E5] text-sm font-medium rounded-lg hover:bg-[#FAFAFA] dark:hover:bg-[#262626] transition-colors border border-[#E5E7EB] dark:border-[#1A1A1A] shadow-sm no-print"
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
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-3 sm:gap-4 stagger-2">
        <StatCard title={t("dashboard.recipes")} value={String(stats.totalRecipes)} icon={ChefHat} color="bg-[#111111] dark:bg-white" colorKey="teal" />
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
          suffix={currencySuffix()}
          subtitle={stats.avgLaborCost > 0 ? `${t("dashboard.material")} ${formatCurrency(stats.avgFoodCost)} + ${t("dashboard.labor")} ${formatCurrency(stats.avgLaborCost)}` : t("dashboard.materialOnly")}
          icon={Briefcase}
          color="bg-cyan-600"
          colorKey="cyan"
        />
        <StatCard
          title={t("dashboard.minMax")}
          value={`${stats.worstMargin.toFixed(0)}% / ${stats.bestMargin.toFixed(0)}%`}
          icon={TrendingDown}
          color="bg-[#6B7280]"
          colorKey="slate"
        />
      </div>

      {/* ── AI Usage Mini Card ──────────────────────────────────────── */}
      {aiUsage && (
        <div className="stagger-3">
          <Link
            to="/assistant"
            className="flex items-center gap-4 bg-[#FAFAFA] dark:bg-[#0A0A0A]/60 border border-[#E5E7EB] dark:border-[#1A1A1A]/50 rounded-xl p-4 hover:border-[#111111]/30 dark:hover:border-[#333]/50 transition-all duration-300 group"
          >
            <div className="p-2.5 rounded-xl bg-[#111111] dark:bg-white shadow-lg">
              <Sparkles className="w-5 h-5 text-white dark:text-[#111111]" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-sm font-medium text-[#6B7280] dark:text-[#A3A3A3]">
                  IA : {aiUsage.used}/{aiUsage.limit}
                </span>
                <span className="text-xs text-teal-400 group-hover:text-teal-300 transition-colors">
                  Voir details →
                </span>
              </div>
              <div className="w-full h-1.5 bg-[#E5E7EB] dark:bg-[#1A1A1A] rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-700 ease-out ${
                    aiUsage.percentage > 80
                      ? 'bg-red-500'
                      : aiUsage.percentage > 50
                      ? 'bg-amber-500'
                      : 'bg-teal-500'
                  }`}
                  style={{ width: `${Math.min(aiUsage.percentage, 100)}%` }}
                />
              </div>
            </div>
          </Link>
        </div>
      )}

      {/* ── Budget Widget ─────────────────────────────────────────── */}
      <div className="stagger-3">
        <BudgetWidget data={budgetData} onEditBudget={fetchBudget} />
      </div>

      {/* ── Alert Ticker Banner ──────────────────────────────────────── */}
      <div className="stagger-3">
        <AlertTicker alerts={stats.alertRecipes} />
      </div>

      {/* ══════════════════════════════════════════════════════════════ */}
      {/* SECTION 1: Live P&L Summary Card                              */}
      {/* ══════════════════════════════════════════════════════════════ */}
      <div className="stagger-3">
        <div className="bg-white dark:bg-black rounded-2xl border border-[#E5E7EB] dark:border-[#1A1A1A] shadow-sm p-5 sm:p-6">
          <div className="flex items-center gap-2 mb-5">
            <div className="p-2 rounded-lg bg-emerald-100 dark:bg-emerald-900/30">
              <DollarSign className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
            </div>
            <h3 className="text-lg font-bold text-[#111111] dark:text-white font-satoshi">Compte de resultat express</h3>
            <span className="ml-auto text-xs text-[#9CA3AF] dark:text-[#737373]">Estimation journaliere</span>
          </div>
          {(() => {
            const ca = stats.dailyRevenue;
            const coutMatieres = stats.dailyCost;
            const margeBrute = ca - coutMatieres;
            const margePct = ca > 0 ? (margeBrute / ca) * 100 : 0;
            const coutPct = ca > 0 ? (coutMatieres / ca) * 100 : 0;
            const getBarColor = (pct: number) => pct >= 70 ? '#059669' : pct >= 50 ? '#D97706' : '#DC2626';
            const getBarBg = (pct: number) => pct >= 70 ? 'bg-emerald-50 dark:bg-emerald-900/20' : pct >= 50 ? 'bg-amber-50 dark:bg-amber-900/20' : 'bg-red-50 dark:bg-red-900/20';
            const getTextColor = (pct: number) => pct >= 70 ? 'text-emerald-600 dark:text-emerald-400' : pct >= 50 ? 'text-amber-600 dark:text-amber-400' : 'text-red-600 dark:text-red-400';
            return (
              <div className="space-y-4">
                {/* Chiffre d'affaires */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-sm font-medium text-[#111111] dark:text-white">Chiffre d'affaires</span>
                    <span className="text-sm font-bold text-[#111111] dark:text-white">{formatCurrency(ca)}</span>
                  </div>
                  <div className="h-3 bg-[#F3F4F6] dark:bg-[#171717] rounded-full overflow-hidden">
                    <div className="h-full rounded-full transition-all duration-700 bg-emerald-500" style={{ width: '100%' }} />
                  </div>
                </div>
                {/* Cout matieres */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-sm font-medium text-[#111111] dark:text-white">Cout matieres</span>
                    <div className="flex items-center gap-2">
                      <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${getBarBg(100 - coutPct)} ${getTextColor(100 - coutPct)}`}>
                        {coutPct.toFixed(1)}% du CA
                      </span>
                      <span className="text-sm font-bold text-red-600 dark:text-red-400">{formatCurrency(coutMatieres)}</span>
                    </div>
                  </div>
                  <div className="h-3 bg-[#F3F4F6] dark:bg-[#171717] rounded-full overflow-hidden">
                    <div className="h-full rounded-full transition-all duration-700" style={{ width: `${Math.min(coutPct, 100)}%`, backgroundColor: '#DC2626' }} />
                  </div>
                </div>
                {/* Marge brute */}
                <div className="pt-2 border-t border-[#E5E7EB] dark:border-[#1A1A1A]">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-sm font-bold text-[#111111] dark:text-white">Marge brute</span>
                    <div className="flex items-center gap-2">
                      <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${getBarBg(margePct)} ${getTextColor(margePct)}`}>
                        {margePct.toFixed(1)}%
                      </span>
                      <span className={`text-sm font-bold ${getTextColor(margePct)}`}>{formatCurrency(margeBrute)}</span>
                    </div>
                  </div>
                  <div className="h-4 bg-[#F3F4F6] dark:bg-[#171717] rounded-full overflow-hidden">
                    <div className="h-full rounded-full transition-all duration-700" style={{ width: `${Math.min(margePct, 100)}%`, backgroundColor: getBarColor(margePct) }} />
                  </div>
                  <div className="flex items-center justify-between mt-2 text-xs text-[#9CA3AF] dark:text-[#737373]">
                    <span>0%</span>
                    <div className="flex gap-4">
                      <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-red-500 inline-block" /> &lt;50%</span>
                      <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-amber-500 inline-block" /> 50-70%</span>
                      <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-emerald-500 inline-block" /> &gt;70%</span>
                    </div>
                    <span>100%</span>
                  </div>
                </div>
              </div>
            );
          })()}
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════════════ */}
      {/* SECTION 2: Top 5 Plats les plus vendus (bar chart)           */}
      {/* ══════════════════════════════════════════════════════════════ */}
      {stats.top10Margin.length > 0 && (
        <div className="stagger-3">
          <div className="bg-white dark:bg-black rounded-2xl border border-[#E5E7EB] dark:border-[#1A1A1A] shadow-sm p-5 sm:p-6">
            <div className="flex items-center gap-2 mb-5">
              <div className="p-2 rounded-lg bg-teal-100 dark:bg-teal-900/30">
                <Flame className="w-5 h-5 text-teal-600 dark:text-teal-400" />
              </div>
              <h3 className="text-lg font-bold text-[#111111] dark:text-white font-satoshi">Top 5 — Plats les plus rentables</h3>
            </div>
            <div className="space-y-3">
              {stats.top10Margin.slice(0, 5).map((recipe, i) => {
                const maxMargin = stats.top10Margin[0].margin.marginPercent;
                const pct = maxMargin > 0 ? (recipe.margin.marginPercent / maxMargin) * 100 : 0;
                const barColor = recipe.margin.marginPercent >= 70 ? '#059669' : recipe.margin.marginPercent >= 50 ? '#D97706' : '#DC2626';
                return (
                  <Link key={recipe.id} to={`/recipes/${recipe.id}`} className="block group">
                    <div className="flex items-center gap-3">
                      <span className="text-lg font-black text-[#9CA3AF] dark:text-[#737373] w-7 text-right tabular-nums">{i + 1}</span>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-sm font-medium text-[#111111] dark:text-white truncate pr-2 group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors">
                            {recipe.name}
                          </span>
                          <div className="flex items-center gap-2 flex-shrink-0">
                            <span className="text-xs text-[#9CA3AF] dark:text-[#737373]">{formatCurrency(recipe.sellingPrice)}</span>
                            <span className="text-sm font-bold tabular-nums" style={{ color: barColor }}>
                              {recipe.margin.marginPercent.toFixed(1)}%
                            </span>
                          </div>
                        </div>
                        {/* Inline CSS bar chart */}
                        <div className="h-2.5 bg-[#F3F4F6] dark:bg-[#171717] rounded-full overflow-hidden">
                          <div
                            className="h-full rounded-full transition-all duration-700 ease-out"
                            style={{ width: `${Math.min(pct, 100)}%`, backgroundColor: barColor }}
                          />
                        </div>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
            <Link to="/recipes" className="inline-flex items-center gap-1 text-xs text-teal-600 dark:text-teal-400 hover:underline font-medium mt-4">
              Voir toutes les recettes <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════ */}
      {/* SECTION 3: Alertes intelligentes                              */}
      {/* ══════════════════════════════════════════════════════════════ */}
      <div className="stagger-3">
        <div className="bg-white dark:bg-black rounded-2xl border border-[#E5E7EB] dark:border-[#1A1A1A] shadow-sm p-5 sm:p-6">
          <div className="flex items-center gap-2 mb-5">
            <div className="p-2 rounded-lg bg-red-100 dark:bg-red-900/30">
              <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400" />
            </div>
            <h3 className="text-lg font-bold text-[#111111] dark:text-white font-satoshi">Alertes intelligentes</h3>
            {(() => {
              const totalAlerts = inventoryAlerts.length + systemAlerts.count + stats.alertRecipes.length;
              return totalAlerts > 0 ? (
                <span className="ml-auto text-xs bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 px-2.5 py-0.5 rounded-full font-bold">{totalAlerts}</span>
              ) : null;
            })()}
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {/* Stock critique */}
            <div className={`rounded-xl border p-4 transition-all ${
              inventoryAlerts.length > 0
                ? 'border-red-200 dark:border-red-900/50 bg-red-50 dark:bg-red-950/20'
                : 'border-[#E5E7EB] dark:border-[#1A1A1A] bg-[#FAFAFA] dark:bg-[#0A0A0A]/50'
            }`}>
              <div className="flex items-center gap-2 mb-2">
                <PackageX className={`w-4 h-4 ${inventoryAlerts.length > 0 ? 'text-red-600 dark:text-red-400' : 'text-[#9CA3AF] dark:text-[#737373]'}`} />
                <span className={`text-xs font-semibold uppercase tracking-wider ${inventoryAlerts.length > 0 ? 'text-red-600 dark:text-red-400' : 'text-[#9CA3AF] dark:text-[#737373]'}`}>
                  Stock critique
                </span>
              </div>
              <p className={`text-2xl font-black font-satoshi ${inventoryAlerts.length > 0 ? 'text-red-600 dark:text-red-400' : 'text-[#111111] dark:text-white'}`}>
                {inventoryAlerts.length}
              </p>
              <p className="text-xs text-[#9CA3AF] dark:text-[#737373] mt-1">
                {inventoryAlerts.length > 0
                  ? inventoryAlerts.slice(0, 2).map(a => a.ingredient?.name || 'Inconnu').join(', ') + (inventoryAlerts.length > 2 ? '...' : '')
                  : 'Aucune alerte'}
              </p>
              {inventoryAlerts.length > 0 && (
                <Link to="/inventory" className="inline-flex items-center gap-1 text-xs text-red-600 dark:text-red-400 hover:underline font-medium mt-2">
                  Voir <ArrowRight className="w-3 h-3" />
                </Link>
              )}
            </div>

            {/* Marges negatives */}
            {(() => {
              const negMargin = recipes.filter(r => r.margin.marginPercent < 50);
              return (
                <div className={`rounded-xl border p-4 transition-all ${
                  negMargin.length > 0
                    ? 'border-orange-200 dark:border-orange-900/50 bg-orange-50 dark:bg-orange-950/20'
                    : 'border-[#E5E7EB] dark:border-[#1A1A1A] bg-[#FAFAFA] dark:bg-[#0A0A0A]/50'
                }`}>
                  <div className="flex items-center gap-2 mb-2">
                    <TrendingDown className={`w-4 h-4 ${negMargin.length > 0 ? 'text-orange-600 dark:text-orange-400' : 'text-[#9CA3AF] dark:text-[#737373]'}`} />
                    <span className={`text-xs font-semibold uppercase tracking-wider ${negMargin.length > 0 ? 'text-orange-600 dark:text-orange-400' : 'text-[#9CA3AF] dark:text-[#737373]'}`}>
                      Marges &lt; 50%
                    </span>
                  </div>
                  <p className={`text-2xl font-black font-satoshi ${negMargin.length > 0 ? 'text-orange-600 dark:text-orange-400' : 'text-[#111111] dark:text-white'}`}>
                    {negMargin.length}
                  </p>
                  <p className="text-xs text-[#9CA3AF] dark:text-[#737373] mt-1">
                    {negMargin.length > 0
                      ? negMargin.slice(0, 2).map(r => r.name).join(', ') + (negMargin.length > 2 ? '...' : '')
                      : 'Toutes les marges OK'}
                  </p>
                  {negMargin.length > 0 && (
                    <Link to="/recipes" className="inline-flex items-center gap-1 text-xs text-orange-600 dark:text-orange-400 hover:underline font-medium mt-2">
                      Corriger <ArrowRight className="w-3 h-3" />
                    </Link>
                  )}
                </div>
              );
            })()}

            {/* Ingredients sans prix */}
            {(() => {
              const noPriceCount = ingredients.filter(i => !i.pricePerUnit || i.pricePerUnit === 0).length;
              return (
                <div className={`rounded-xl border p-4 transition-all ${
                  noPriceCount > 0
                    ? 'border-amber-200 dark:border-amber-900/50 bg-amber-50 dark:bg-amber-950/20'
                    : 'border-[#E5E7EB] dark:border-[#1A1A1A] bg-[#FAFAFA] dark:bg-[#0A0A0A]/50'
                }`}>
                  <div className="flex items-center gap-2 mb-2">
                    <AlertTriangle className={`w-4 h-4 ${noPriceCount > 0 ? 'text-amber-600 dark:text-amber-400' : 'text-[#9CA3AF] dark:text-[#737373]'}`} />
                    <span className={`text-xs font-semibold uppercase tracking-wider ${noPriceCount > 0 ? 'text-amber-600 dark:text-amber-400' : 'text-[#9CA3AF] dark:text-[#737373]'}`}>
                      Sans prix
                    </span>
                  </div>
                  <p className={`text-2xl font-black font-satoshi ${noPriceCount > 0 ? 'text-amber-600 dark:text-amber-400' : 'text-[#111111] dark:text-white'}`}>
                    {noPriceCount}
                  </p>
                  <p className="text-xs text-[#9CA3AF] dark:text-[#737373] mt-1">
                    {noPriceCount > 0 ? `${noPriceCount} ingredient${noPriceCount > 1 ? 's' : ''} a mettre a jour` : 'Tous les prix sont definis'}
                  </p>
                  {noPriceCount > 0 && (
                    <Link to="/ingredients" className="inline-flex items-center gap-1 text-xs text-amber-600 dark:text-amber-400 hover:underline font-medium mt-2">
                      Mettre a jour <ArrowRight className="w-3 h-3" />
                    </Link>
                  )}
                </div>
              );
            })()}

            {/* Prix fournisseurs en hausse */}
            {(() => {
              const priceAlerts = systemAlerts.alerts.filter(a => a.type === 'price');
              return (
                <div className={`rounded-xl border p-4 transition-all ${
                  priceAlerts.length > 0
                    ? 'border-purple-200 dark:border-purple-900/50 bg-purple-50 dark:bg-purple-950/20'
                    : 'border-[#E5E7EB] dark:border-[#1A1A1A] bg-[#FAFAFA] dark:bg-[#0A0A0A]/50'
                }`}>
                  <div className="flex items-center gap-2 mb-2">
                    <TrendingUp className={`w-4 h-4 ${priceAlerts.length > 0 ? 'text-purple-600 dark:text-purple-400' : 'text-[#9CA3AF] dark:text-[#737373]'}`} />
                    <span className={`text-xs font-semibold uppercase tracking-wider ${priceAlerts.length > 0 ? 'text-purple-600 dark:text-purple-400' : 'text-[#9CA3AF] dark:text-[#737373]'}`}>
                      Prix en hausse
                    </span>
                  </div>
                  <p className={`text-2xl font-black font-satoshi ${priceAlerts.length > 0 ? 'text-purple-600 dark:text-purple-400' : 'text-[#111111] dark:text-white'}`}>
                    {priceAlerts.length}
                  </p>
                  <p className="text-xs text-[#9CA3AF] dark:text-[#737373] mt-1">
                    {priceAlerts.length > 0
                      ? priceAlerts.slice(0, 1).map(a => a.title).join(', ') + (priceAlerts.length > 1 ? '...' : '')
                      : 'Prix stables'}
                  </p>
                  {priceAlerts.length > 0 && (
                    <Link to="/mercuriale" className="inline-flex items-center gap-1 text-xs text-purple-600 dark:text-purple-400 hover:underline font-medium mt-2">
                      Voir <ArrowRight className="w-3 h-3" />
                    </Link>
                  )}
                </div>
              );
            })()}
          </div>
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════════════ */}
      {/* SECTION 4: Quick Actions Grid                                 */}
      {/* ══════════════════════════════════════════════════════════════ */}
      <div className="stagger-3">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          {/* Nouvelle pesee */}
          <button
            onClick={() => navigate('/station')}
            className="flex flex-col items-center gap-3 p-5 sm:p-6 bg-white dark:bg-black rounded-2xl border border-[#E5E7EB] dark:border-[#1A1A1A] shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 group"
          >
            <div className="p-3 rounded-xl bg-teal-100 dark:bg-teal-900/30 group-hover:bg-teal-200 dark:group-hover:bg-teal-800/40 transition-colors">
              <Scale className="w-6 h-6 text-teal-600 dark:text-teal-400" />
            </div>
            <span className="text-sm font-semibold text-[#111111] dark:text-white text-center">Nouvelle pesee</span>
            <span className="text-xs text-[#9CA3AF] dark:text-[#737373]">Station balance</span>
          </button>

          {/* Commande fournisseur */}
          <button
            onClick={() => navigate('/commandes')}
            className="flex flex-col items-center gap-3 p-5 sm:p-6 bg-white dark:bg-black rounded-2xl border border-[#E5E7EB] dark:border-[#1A1A1A] shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 group"
          >
            <div className="p-3 rounded-xl bg-blue-100 dark:bg-blue-900/30 group-hover:bg-blue-200 dark:group-hover:bg-blue-800/40 transition-colors">
              <ShoppingCart className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
            <span className="text-sm font-semibold text-[#111111] dark:text-white text-center">Commande fournisseur</span>
            <span className="text-xs text-[#9CA3AF] dark:text-[#737373]">Auto-commandes</span>
          </button>

          {/* Scan facture */}
          <button
            onClick={() => navigate('/scanner-factures')}
            className="flex flex-col items-center gap-3 p-5 sm:p-6 bg-white dark:bg-black rounded-2xl border border-[#E5E7EB] dark:border-[#1A1A1A] shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 group"
          >
            <div className="p-3 rounded-xl bg-amber-100 dark:bg-amber-900/30 group-hover:bg-amber-200 dark:group-hover:bg-amber-800/40 transition-colors">
              <ScanLine className="w-6 h-6 text-amber-600 dark:text-amber-400" />
            </div>
            <span className="text-sm font-semibold text-[#111111] dark:text-white text-center">Scan facture</span>
            <span className="text-xs text-[#9CA3AF] dark:text-[#737373]">OCR intelligent</span>
          </button>

          {/* Rapport IA */}
          <button
            onClick={fetchWeeklyReport}
            className="flex flex-col items-center gap-3 p-5 sm:p-6 bg-white dark:bg-black rounded-2xl border border-[#E5E7EB] dark:border-[#1A1A1A] shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 group"
          >
            <div className="p-3 rounded-xl bg-purple-100 dark:bg-purple-900/30 group-hover:bg-purple-200 dark:group-hover:bg-purple-800/40 transition-colors">
              <Brain className="w-6 h-6 text-purple-600 dark:text-purple-400" />
            </div>
            <span className="text-sm font-semibold text-[#111111] dark:text-white text-center">Rapport IA</span>
            <span className="text-xs text-[#9CA3AF] dark:text-[#737373]">Analyse hebdo</span>
          </button>
        </div>
      </div>

      {/* Activite recente supprimee — deplacee dans les notifications */}

      {/* ── Top 5 Margin + Quick Alerts ────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 stagger-3">
        {/* Top 5 recipes by margin — mini table */}
        {top5Margin.length > 0 && (
          <div className="relative rounded-2xl border border-[#E5E7EB] dark:border-[#1A1A1A]/50 bg-white/80 dark:bg-[#0A0A0A]/40 backdrop-blur-xl shadow-sm p-5 overflow-hidden">
            <div className="absolute -top-10 -right-10 w-32 h-32 rounded-full bg-teal-400/5 blur-3xl pointer-events-none" />
            <div className="relative flex items-center gap-2 mb-4">
              <Trophy className="w-5 h-5 text-amber-500" />
              <h3 className="text-base font-bold text-[#111111] dark:text-white font-satoshi">Top 5 — Meilleures marges</h3>
            </div>
            <div className="relative overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-[#E5E7EB] dark:border-[#1A1A1A]">
                    <th className="text-left py-2 text-xs font-semibold text-[#9CA3AF] dark:text-[#737373] uppercase tracking-wider">Recette</th>
                    <th className="text-right py-2 text-xs font-semibold text-[#9CA3AF] dark:text-[#737373] uppercase tracking-wider">Coût</th>
                    <th className="text-right py-2 text-xs font-semibold text-[#9CA3AF] dark:text-[#737373] uppercase tracking-wider">Prix</th>
                    <th className="text-right py-2 text-xs font-semibold text-[#9CA3AF] dark:text-[#737373] uppercase tracking-wider">Marge</th>
                  </tr>
                </thead>
                <tbody>
                  {top5Margin.map((recipe, i) => {
                    const marginColor = recipe.margin.marginPercent >= 70
                      ? 'text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/20'
                      : recipe.margin.marginPercent >= 60
                        ? 'text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/20'
                        : 'text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20';
                    return (
                      <tr
                        key={recipe.id}
                        className="border-b border-[#F3F4F6] dark:border-[#1A1A1A]/50 hover:bg-[#FAFAFA] dark:hover:bg-[#171717]/30 transition-colors"
                        style={{ animationDelay: `${i * 60}ms` }}
                      >
                        <td className="py-2.5">
                          <Link to={`/recipes/${recipe.id}`} className="flex items-center gap-2 group">
                            <span className="text-xs font-bold text-[#9CA3AF] dark:text-[#525252] w-4">{i + 1}</span>
                            <span className="font-medium text-[#111111] dark:text-[#E5E5E5] truncate max-w-[160px] group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors">
                              {recipe.name}
                            </span>
                          </Link>
                        </td>
                        <td className="py-2.5 text-right text-[#6B7280] dark:text-[#737373] tabular-nums">
                          {recipe.margin.costPerPortion.toFixed(2)}{currencySuffix()}
                        </td>
                        <td className="py-2.5 text-right text-[#111111] dark:text-[#A3A3A3] font-medium tabular-nums">
                          {recipe.sellingPrice.toFixed(2)}{currencySuffix()}
                        </td>
                        <td className="py-2.5 text-right">
                          <span className={`inline-block px-2 py-0.5 rounded-md text-xs font-bold tabular-nums ${marginColor}`}>
                            {recipe.margin.marginPercent.toFixed(1)}%
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            <Link to="/recipes" className="inline-flex items-center gap-1 text-xs text-teal-600 dark:text-teal-400 hover:underline font-medium mt-3">
              Voir toutes les recettes <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
        )}

        {/* Quick Alerts */}
        {quickAlerts.length > 0 && (
          <div className="relative rounded-2xl border border-[#E5E7EB] dark:border-[#1A1A1A]/50 bg-white/80 dark:bg-[#0A0A0A]/40 backdrop-blur-xl shadow-sm p-5 overflow-hidden">
            <div className="absolute -bottom-8 -left-8 w-28 h-28 rounded-full bg-amber-400/5 blur-3xl pointer-events-none" />
            <div className="relative flex items-center gap-2 mb-4">
              <ShieldAlert className="w-5 h-5 text-amber-500" />
              <h3 className="text-base font-bold text-[#111111] dark:text-white font-satoshi">Alertes rapides</h3>
              <span className="ml-auto text-xs bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 px-2 py-0.5 rounded-full font-medium">
                {quickAlerts.length}
              </span>
            </div>
            <div className="relative space-y-2.5">
              {quickAlerts.map((alert, i) => {
                const AlertIcon = alert.icon;
                return (
                  <Link
                    key={alert.id}
                    to={alert.link}
                    className={`flex items-center gap-3 p-3.5 rounded-xl border transition-all duration-300 hover:shadow-md hover:-translate-y-0.5 group ${alert.bgColor}`}
                    style={{ animationDelay: `${i * 80}ms` }}
                  >
                    <div className={`p-2 rounded-lg bg-white/50 dark:bg-[#0A0A0A]/50 ${alert.color}`}>
                      <AlertIcon className="w-4 h-4" />
                    </div>
                    <span className={`text-sm font-medium flex-1 ${alert.color}`}>{alert.text}</span>
                    <ArrowRight className={`w-3.5 h-3.5 flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity ${alert.color}`} />
                  </Link>
                );
              })}
            </div>
            {quickAlerts.length === 0 && (
              <div className="flex items-center gap-2 p-3 bg-green-50 dark:bg-green-900/20 rounded-xl border border-green-200 dark:border-green-800/40">
                <Check className="w-4 h-4 text-green-600 dark:text-green-400" />
                <span className="text-sm font-medium text-green-600 dark:text-green-400">Tout est en ordre</span>
              </div>
            )}
          </div>
        )}
      </div>

      {/* ── Menu du Marché + Suggestions IA ────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 stagger-4">
        {/* Menu du Marché */}
        <div className="bg-white dark:bg-[#0A0A0A] rounded-xl shadow-sm border border-[#E5E7EB] dark:border-[#1A1A1A] p-5">
          <div className="flex items-center gap-2 mb-4">
            <Star className="w-5 h-5 text-amber-500" />
            <h3 className="text-lg font-semibold text-[#111111] dark:text-white">{t("dashboard.dailySuggestion")}</h3>
            <span className="text-xs text-[#9CA3AF] dark:text-[#737373] ml-auto">{t("dashboard.marketMenu")}</span>
          </div>
          <p className="text-xs text-[#9CA3AF] dark:text-[#737373] mb-3">{t("dashboard.recommendedDishes")}</p>
          <div className="space-y-3">
            {stats.menuDuMarche.map((dish, i) => (
              <Link
                key={dish.id}
                to={`/recipes/${dish.id}`}
                className="flex items-center gap-3 p-3 rounded-lg bg-[#FAFAFA] dark:bg-[#171717]/50 hover:bg-amber-50 dark:hover:bg-amber-900/20 transition-colors group"
              >
                <span className="text-lg font-bold text-amber-500 w-6 text-center">{i + 1}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-[#111111] dark:text-[#E5E5E5] truncate group-hover:text-amber-700 dark:group-hover:text-amber-400 transition-colors">{dish.name}</p>
                  <p className="text-xs text-[#9CA3AF] dark:text-[#737373]">{dish.category}</p>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className="text-sm font-bold text-green-600 dark:text-green-400">{dish.marginPercent.toFixed(1)}%</p>
                  <p className="text-xs text-[#9CA3AF] dark:text-[#737373]">{t("dashboard.cost")} {formatCurrency(dish.costPerPortion)} · {t("dashboard.sale")} {formatCurrency(dish.suggestedPrice)}</p>
                </div>
              </Link>
            ))}
          </div>
          <Link to="/recipes" className="inline-flex items-center gap-1 text-xs text-teal-600 dark:text-teal-400 hover:underline font-medium mt-3">
            {t("dashboard.viewAllSuggestions")} <ArrowRight className="w-3 h-3" />
          </Link>
        </div>

        {/* Suggestions IA */}
        <div className="bg-white dark:bg-[#0A0A0A] rounded-xl shadow-sm border border-[#E5E7EB] dark:border-[#1A1A1A] p-5">
          <div className="flex items-center gap-2 mb-4">
            <Sparkles className="w-5 h-5 text-purple-500" />
            <h3 className="text-lg font-semibold text-[#111111] dark:text-white">{t("dashboard.aiSuggestions")}</h3>
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
                info: 'bg-[#111111] hover:bg-[#333] dark:bg-white dark:hover:bg-[#E5E5E5] text-white dark:text-black',
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
                  <p className="text-sm text-[#9CA3AF] dark:text-[#A3A3A3] flex-1">{suggestion.text}</p>
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
                  ? 'bg-white dark:bg-[#0A0A0A] border-l-4 border-l-[#111111] dark:border-l-white border border-[#E5E7EB] dark:border-[#1A1A1A] shadow-md'
                  : 'bg-[#FAFAFA] dark:bg-[#0A0A0A]/50 border border-[#E5E7EB] dark:border-[#1A1A1A] hover:bg-white dark:hover:bg-[#0A0A0A] hover:shadow-sm opacity-75 hover:opacity-100'
                }`}
            >
              <div className={`p-2 rounded-lg ${isActive ? 'bg-[#111111]/10 dark:bg-white/10' : 'bg-[#F3F4F6] dark:bg-[#171717]'}`}>
                <Icon className={`w-5 h-5 ${isActive ? 'text-[#111111] dark:text-white' : 'text-[#9CA3AF] dark:text-[#737373]'}`} />
              </div>
              <div>
                <div className={`text-sm font-semibold ${isActive ? 'text-[#111111] dark:text-white' : 'text-[#9CA3AF] dark:text-[#737373]'}`}>
                  {tab.label}
                </div>
                <div className={`text-xs ${isActive ? 'text-[#9CA3AF] dark:text-[#737373]' : 'text-[#9CA3AF] dark:text-[#737373]'}`}>
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
                <span key={p.name} className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-white/70 dark:bg-[#0A0A0A]/70 text-sm border border-emerald-200 dark:border-emerald-700">
                  <span className="font-medium text-[#111111] dark:text-[#E5E5E5]">{p.name}</span>
                  <span className="text-emerald-600 dark:text-emerald-400 text-xs">{formatCurrency(p.avgPrice)}/{p.unit}</span>
                </span>
              ))}
            </div>
            <Link to="/mercuriale" className="inline-flex items-center gap-1 mt-3 text-sm text-emerald-600 dark:text-emerald-400 hover:underline">
              Voir tous les produits de saison <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-[65%_35%] gap-4 sm:gap-6">
            {/* LEFT SIDE */}
            <div className="space-y-6">
              {/* Revenue Estimation */}
              <div className="bg-[#111111] dark:bg-[#FAFAFA] rounded-xl shadow-lg p-5 text-white dark:text-[#111111]">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-4">
                  <div className="flex items-center gap-2">
                    <Calculator className="w-5 h-5" />
                    <h3 className="text-lg font-semibold text-white dark:text-[#111111]">{t("dashboard.revenueEstimation")}</h3>
                  </div>
                  <div className="flex flex-wrap items-center gap-3">
                    <div className="flex items-center gap-1 bg-white/10 dark:bg-black/10 rounded-lg p-0.5">
                      {([['all', t("dashboard.serviceAll")], ['lunch', t("dashboard.serviceLunch")], ['dinner', t("dashboard.serviceDinner")]] as [string, string][]).map(([key, label]) => (
                        <button
                          key={key}
                          onClick={() => setServiceMode(key as 'all' | 'lunch' | 'dinner')}
                          className={`px-2.5 py-1 text-xs font-medium rounded-md transition-colors ${
                            serviceMode === key ? 'bg-white/25 dark:bg-black/15 text-white dark:text-[#111111]' : 'text-white/60 dark:text-[#111111]/60 hover:text-white dark:hover:text-[#111111]'
                          }`}
                        >
                          {label}
                        </button>
                      ))}
                    </div>
                    <div className="flex items-center gap-2">
                      <label className="text-xs text-white/70 dark:text-[#111111]/70">{t("dashboard.covers")} :</label>
                      <input
                        type="number"
                        min={1}
                        max={500}
                        value={couverts}
                        onChange={e => setCouverts(Math.max(1, parseInt(e.target.value) || 1))}
                        className="w-16 px-2 py-1 rounded bg-white/20 dark:bg-black/10 border border-white/30 dark:border-black/20 text-white dark:text-[#111111] text-sm text-center focus:outline-none focus:ring-2 focus:ring-white/50 dark:focus:ring-black/30"
                      />
                    </div>
                    <div className="flex items-center gap-2">
                      <label className="text-xs text-white/70 dark:text-[#111111]/70">{t("dashboard.avgTicket")} :</label>
                      <input
                        type="number"
                        min={1}
                        max={500}
                        value={avgPricePerCouvert}
                        onChange={e => setAvgPricePerCouvert(Math.max(1, parseInt(e.target.value) || 1))}
                        className="w-16 px-2 py-1 rounded bg-white/20 dark:bg-black/10 border border-white/30 dark:border-black/20 text-white dark:text-[#111111] text-sm text-center focus:outline-none focus:ring-2 focus:ring-white/50 dark:focus:ring-black/30"
                      />
                      <span className="text-xs text-white/60 dark:text-[#111111]/60">{getCurrencySymbol()}</span>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3 mb-3">
                  <div className="bg-white/10 dark:bg-black/10 rounded-lg p-2 sm:p-3">
                    <p className="text-[10px] sm:text-xs text-white/60 dark:text-[#111111]/60 mb-1">{t("dashboard.revenuePerDay")}</p>
                    <p className="text-base sm:text-xl font-bold"><AnimatedNumber value={stats.dailyRevenue} decimals={0} suffix={currencySuffix()} /></p>
                  </div>
                  <div className="bg-white/10 dark:bg-black/10 rounded-lg p-2 sm:p-3">
                    <p className="text-[10px] sm:text-xs text-white/60 dark:text-[#111111]/60 mb-1">{t("dashboard.revenuePerWeek")}</p>
                    <p className="text-base sm:text-xl font-bold"><AnimatedNumber value={stats.dailyRevenue * 6} decimals={0} suffix={currencySuffix()} /></p>
                  </div>
                  <div className="bg-white/10 dark:bg-black/10 rounded-lg p-2 sm:p-3">
                    <p className="text-[10px] sm:text-xs text-white/60 dark:text-[#111111]/60 mb-1">{t("dashboard.revenuePerMonth")}</p>
                    <p className="text-base sm:text-xl font-bold"><AnimatedNumber value={stats.dailyRevenue * 26} decimals={0} suffix={currencySuffix()} /></p>
                  </div>
                  <div className="bg-white/10 dark:bg-black/10 rounded-lg p-2 sm:p-3">
                    <p className="text-[10px] sm:text-xs text-white/60 dark:text-[#111111]/60 mb-1">{t("dashboard.profitPerDay")}</p>
                    <p className="text-base sm:text-xl font-bold text-green-300 dark:text-green-600"><AnimatedNumber value={stats.dailyProfit} decimals={0} suffix={currencySuffix()} /></p>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-x-6 gap-y-1 text-xs text-white/60 dark:text-[#111111]/60">
                  <span>{stats.dailyCouverts} {t("dashboard.coversPerDay")} ({serviceMode === 'all' ? t("dashboard.twoServices") : serviceMode === 'lunch' ? t("dashboard.lunch") : t("dashboard.dinner")})</span>
                  <span>{t("dashboard.costRatio")} : {(stats.avgCostRatio * 100).toFixed(1)}%</span>
                  <span>{t("dashboard.profitPerCover")} : {formatCurrency(stats.profitPerCouvert)}</span>
                  {stats.seuilRentabilite > 0 && (
                    <span className="text-yellow-300 dark:text-amber-600 font-medium">{t("dashboard.breakEvenPoint")} : {stats.seuilRentabilite} {t("dashboard.coversPerDay")}</span>
                  )}
                </div>
              </div>

              {/* Category cards with colored dots */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {stats.categoryData.map((cat, i) => (
                  <div key={cat.name} className="bg-white dark:bg-[#0A0A0A] rounded-xl shadow-sm border border-[#E5E7EB] dark:border-[#1A1A1A] p-4 hover:shadow-md transition-shadow">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[i % COLORS.length] }} />
                      <span className="text-sm font-medium text-[#9CA3AF] dark:text-[#A3A3A3] truncate">{cat.name}</span>
                    </div>
                    <div className="text-2xl font-bold text-[#111111] dark:text-white">{cat.count}</div>
                    <div className="text-xs text-[#9CA3AF] dark:text-[#737373] mt-1">
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
              <div className="bg-white dark:bg-[#0A0A0A] rounded-xl shadow-sm border border-[#E5E7EB] dark:border-[#1A1A1A] p-5">
                <div className="flex items-center gap-2 mb-4">
                  <Utensils className="w-5 h-5 text-teal-600" />
                  <h3 className="text-lg font-semibold text-[#111111] dark:text-white">{t("dashboard.distribution")}</h3>
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
                      <span className="text-[#9CA3AF] dark:text-[#A3A3A3] flex-1 truncate">{cat.name}</span>
                      <span className="font-semibold text-[#111111] dark:text-white tabular-nums">{cat.count}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Allergen badges */}
              {stats.allergenSummary.length > 0 && (
                <div className="bg-white dark:bg-[#0A0A0A] rounded-xl shadow-sm border border-[#E5E7EB] dark:border-[#1A1A1A] p-5">
                  <div className="flex items-center gap-2 mb-3">
                    <ShieldAlert className="w-5 h-5 text-amber-500" />
                    <h3 className="text-lg font-semibold text-[#111111] dark:text-white">{t("dashboard.allergens")}</h3>
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
          <div className="bg-white dark:bg-[#0A0A0A] rounded-xl shadow-sm border border-[#E5E7EB] dark:border-[#1A1A1A] p-5">
            <div className="flex items-center gap-2 mb-4 flex-wrap">
              <TrendingUp className="w-5 h-5 text-green-600" />
              <h3 className="text-lg font-semibold text-[#111111] dark:text-white">{t("dashboard.allRecipesByMargin")}</h3>
              <div className="flex items-center gap-2 ml-auto">
                <div className="flex items-center gap-1 bg-[#F3F4F6] dark:bg-[#171717] rounded-lg p-0.5">
                  <button
                    onClick={() => setMarginSort('margin')}
                    className={`inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium rounded-md transition-colors ${marginSort === 'margin' ? 'bg-white dark:bg-[#262626] text-[#111111] dark:text-white shadow-sm' : 'text-[#9CA3AF] dark:text-[#737373] hover:text-[#111111]'}`}
                  >
                    <ArrowDown className="w-3 h-3" /> {t("dashboard.margin")}
                  </button>
                  <button
                    onClick={() => setMarginSort('name')}
                    className={`inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium rounded-md transition-colors ${marginSort === 'name' ? 'bg-white dark:bg-[#262626] text-[#111111] dark:text-white shadow-sm' : 'text-[#9CA3AF] dark:text-[#737373] hover:text-[#111111]'}`}
                  >
                    <ArrowDown className="w-3 h-3" /> {t("dashboard.name")}
                  </button>
                </div>
                <div className="flex items-center gap-3 text-xs text-[#9CA3AF] dark:text-[#737373]">
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
                      <div className="bg-white dark:bg-[#0A0A0A] shadow-xl rounded-lg p-3 border border-[#E5E7EB] dark:border-[#1A1A1A] text-sm">
                        <p className="font-semibold text-[#111111] dark:text-white">{d?.fullName}</p>
                        <p className="text-[#9CA3AF] dark:text-[#737373]">{d?.category}</p>
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
            <div className="bg-white dark:bg-[#0A0A0A] rounded-xl shadow-sm border border-[#E5E7EB] dark:border-[#1A1A1A] p-5">
              <div className="flex items-center gap-2 mb-4">
                <Trophy className="w-5 h-5 text-yellow-500" />
                <h3 className="text-lg font-semibold text-[#111111] dark:text-white">{t("dashboard.top10ByMargin")}</h3>
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

            <div className="bg-white dark:bg-[#0A0A0A] rounded-xl shadow-sm border border-red-200 dark:border-red-800/50 p-5">
              <div className="flex items-center gap-2 mb-4">
                <ShieldAlert className="w-5 h-5 text-red-500" />
                <h3 className="text-lg font-semibold text-[#111111] dark:text-white">{t("dashboard.bottom5Margins")}</h3>
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
            <div className="bg-white dark:bg-[#0A0A0A] rounded-xl shadow-sm border border-[#E5E7EB] dark:border-[#1A1A1A] p-5">
              <div className="flex items-center gap-2 mb-4">
                <PieChartIcon className="w-5 h-5 text-teal-600" />
                <h3 className="text-lg font-semibold text-[#111111] dark:text-white">{t("dashboard.foodCostDistribution")}</h3>
                <span className="text-xs text-[#9CA3AF] dark:text-[#737373] ml-auto">
                  Total : {formatCurrency(stats.totalFoodCostAll)}
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
                          <div className="bg-white dark:bg-[#0A0A0A] shadow-xl rounded-lg p-3 border border-[#E5E7EB] dark:border-[#1A1A1A] text-sm">
                            <p className="font-semibold text-[#111111] dark:text-white">{d?.name}</p>
                            <p className="text-[#6B7280] dark:text-[#A3A3A3]">{formatCurrency(d?.value ?? 0)} ({pct}%)</p>
                          </div>
                        );
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <p className="text-center text-[#9CA3AF] py-12">{t("dashboard.noData")}</p>
              )}
            </div>

            {/* Cost by category bar */}
            {stats.foodCostData.length > 0 && (
              <div className="bg-white dark:bg-[#0A0A0A] rounded-xl shadow-sm border border-[#E5E7EB] dark:border-[#1A1A1A] p-5">
                <div className="flex items-center gap-2 mb-4">
                  <BarChart3 className="w-5 h-5 text-orange-600" />
                  <h3 className="text-lg font-semibold text-[#111111] dark:text-white">{t("dashboard.detailByCategory")}</h3>
                </div>
                <ResponsiveContainer width="100%" height={Math.max(200, stats.foodCostData.length * 36)}>
                  <BarChart data={stats.foodCostData} layout="vertical" margin={{ top: 5, right: 30, bottom: 5, left: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" className="opacity-30" horizontal={false} />
                    <XAxis type="number" tick={{ fontSize: 11 }} unit={currencySuffix()} />
                    <YAxis type="category" dataKey="name" width={150} tick={{ fontSize: 11 }} />
                    <Tooltip
                      content={({ active, payload }) => {
                        if (!active || !payload?.length) return null;
                        const d = payload[0]?.payload;
                        const pct = stats.totalFoodCostAll > 0 ? ((d?.value / stats.totalFoodCostAll) * 100).toFixed(1) : '0';
                        return (
                          <div className="bg-white dark:bg-[#0A0A0A] shadow-xl rounded-lg p-3 border border-[#E5E7EB] dark:border-[#1A1A1A] text-sm">
                            <p className="font-semibold text-[#111111] dark:text-white">{d?.name}</p>
                            <p className="text-[#6B7280] dark:text-[#A3A3A3]">{formatCurrency(d?.value ?? 0)}</p>
                            <p className="text-[#9CA3AF] dark:text-[#737373]">{pct}% {t("dashboard.ofTotalCost")}</p>
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
            <div className="bg-white dark:bg-[#0A0A0A] rounded-xl shadow-sm border border-[#E5E7EB] dark:border-[#1A1A1A] p-5">
              <div className="flex items-center gap-2 mb-4">
                <ShoppingCart className="w-5 h-5 text-red-500" />
                <h3 className="text-lg font-semibold text-[#111111] dark:text-white">{t("dashboard.top10ExpensiveIngredients")}</h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-left text-[#9CA3AF] dark:text-[#737373] border-b border-[#E5E7EB] dark:border-[#1A1A1A]">
                      <th className="pb-2 font-medium">#</th>
                      <th className="pb-2 font-medium">{t("dashboard.ingredient")}</th>
                      <th className="pb-2 font-medium">{t("dashboard.category")}</th>
                      <th className="pb-2 text-right font-medium">{t("dashboard.totalCost")}</th>
                      <th className="pb-2 text-right font-medium">{t("dashboard.percentOfTotal")}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#F3F4F6] dark:divide-[#1A1A1A]">
                    {stats.topIngredients.map((ing, i) => (
                      <tr key={ing.name} className="hover:bg-[#FAFAFA] dark:hover:bg-[#171717]/50">
                        <td className="py-2.5 text-[#9CA3AF] font-bold">{i + 1}</td>
                        <td className="py-2.5 font-medium text-[#111111] dark:text-[#E5E5E5]">{ing.name}</td>
                        <td className="py-2.5 text-[#9CA3AF] dark:text-[#737373]">
                          <span className="inline-flex items-center gap-1">
                            <span className="w-2 h-2 rounded-full" style={{ backgroundColor: FOOD_CATEGORY_COLORS[ing.category] || '#64748b' }} />
                            {ing.category}
                          </span>
                        </td>
                        <td className="py-2.5 text-right font-mono font-semibold text-[#9CA3AF] dark:text-[#A3A3A3]">{formatCurrency(ing.cost)}</td>
                        <td className="py-2.5 text-right font-mono text-[#9CA3AF] dark:text-[#737373]">
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
            <div className="bg-white dark:bg-[#0A0A0A] rounded-xl shadow-sm border border-[#E5E7EB] dark:border-[#1A1A1A] p-5">
              <div className="flex items-center gap-2 mb-4">
                <ClipboardList className="w-5 h-5 text-purple-600" />
                <h3 className="text-lg font-semibold text-[#111111] dark:text-white">{t("dashboard.ingredientCategoryDetail")}</h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-left text-[#9CA3AF] dark:text-[#737373] border-b border-[#E5E7EB] dark:border-[#1A1A1A]">
                      <th className="pb-2 font-medium">{t("dashboard.category")}</th>
                      <th className="pb-2 text-right font-medium">{t("dashboard.totalCost")}</th>
                      <th className="pb-2 text-right font-medium">{t("dashboard.percentOfTotal")}</th>
                      <th className="pb-2 font-medium">{t("dashboard.mainIngredient")}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#F3F4F6] dark:divide-[#1A1A1A]">
                    {stats.categoryBreakdown.map(cat => (
                      <tr key={cat.name} className="hover:bg-[#FAFAFA] dark:hover:bg-[#171717]/50">
                        <td className="py-2.5 font-medium text-[#111111] dark:text-[#E5E5E5]">
                          <span className="inline-flex items-center gap-2">
                            <span className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: cat.fill }} />
                            {cat.name}
                          </span>
                        </td>
                        <td className="py-2.5 text-right font-mono font-semibold text-[#9CA3AF] dark:text-[#A3A3A3]">{formatCurrency(cat.totalCost)}</td>
                        <td className="py-2.5 text-right font-mono text-[#9CA3AF] dark:text-[#737373]">{cat.pctOfTotal.toFixed(1)}%</td>
                        <td className="py-2.5 text-[#9CA3AF] dark:text-[#737373]">{cat.topIngredient}</td>
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
          <div className="bg-[#111111] dark:bg-[#FAFAFA] rounded-xl shadow-lg p-5 text-white dark:text-[#111111]">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-4">
              <div className="flex items-center gap-2">
                <Calculator className="w-5 h-5" />
                <h3 className="text-lg font-semibold text-white dark:text-[#111111]">{t("dashboard.revenueProjections")}</h3>
              </div>
              <div className="flex flex-wrap items-center gap-3">
                <div className="flex items-center gap-1 bg-white/10 dark:bg-black/10 rounded-lg p-0.5">
                  {([['all', t("dashboard.serviceAll")], ['lunch', t("dashboard.serviceLunch")], ['dinner', t("dashboard.serviceDinner")]] as [string, string][]).map(([key, label]) => (
                    <button
                      key={key}
                      onClick={() => setServiceMode(key as 'all' | 'lunch' | 'dinner')}
                      className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                        serviceMode === key ? 'bg-white/25 dark:bg-black/15 text-white dark:text-[#111111]' : 'text-white/60 dark:text-[#111111]/60 hover:text-white dark:hover:text-[#111111]'
                      }`}
                    >
                      {label}
                    </button>
                  ))}
                </div>
                <div className="flex items-center gap-2">
                  <label className="text-xs text-white/70 dark:text-[#111111]/70">{t("dashboard.covers")} :</label>
                  <input
                    type="number"
                    min={1}
                    max={500}
                    value={couverts}
                    onChange={e => setCouverts(Math.max(1, parseInt(e.target.value) || 1))}
                    className="w-16 px-2 py-1 rounded bg-white/20 dark:bg-black/10 border border-white/30 dark:border-black/20 text-white dark:text-[#111111] text-sm text-center focus:outline-none focus:ring-2 focus:ring-white/50 dark:focus:ring-black/30"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <label className="text-xs text-white/70 dark:text-[#111111]/70">{t("dashboard.avgTicket")} :</label>
                  <input
                    type="number"
                    min={1}
                    max={500}
                    value={avgPricePerCouvert}
                    onChange={e => setAvgPricePerCouvert(Math.max(1, parseInt(e.target.value) || 1))}
                    className="w-16 px-2 py-1 rounded bg-white/20 dark:bg-black/10 border border-white/30 dark:border-black/20 text-white dark:text-[#111111] text-sm text-center focus:outline-none focus:ring-2 focus:ring-white/50 dark:focus:ring-black/30"
                  />
                  <span className="text-xs text-white/60 dark:text-[#111111]/60">{getCurrencySymbol()}</span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3">
              <div className="bg-white/10 dark:bg-black/10 rounded-lg p-2 sm:p-4">
                <p className="text-[10px] sm:text-xs text-white/60 dark:text-[#111111]/60 mb-1">{t("dashboard.revenuePerDay")}</p>
                <p className="text-lg sm:text-2xl font-bold"><AnimatedNumber value={stats.dailyRevenue} decimals={0} suffix={currencySuffix()} /></p>
              </div>
              <div className="bg-white/10 dark:bg-black/10 rounded-lg p-2 sm:p-4">
                <p className="text-[10px] sm:text-xs text-white/60 dark:text-[#111111]/60 mb-1">{t("dashboard.revenuePerWeek")}</p>
                <p className="text-lg sm:text-2xl font-bold"><AnimatedNumber value={stats.dailyRevenue * 6} decimals={0} suffix={currencySuffix()} /></p>
              </div>
              <div className="bg-white/10 dark:bg-black/10 rounded-lg p-2 sm:p-4">
                <p className="text-[10px] sm:text-xs text-white/60 dark:text-[#111111]/60 mb-1">{t("dashboard.revenuePerMonth")}</p>
                <p className="text-lg sm:text-2xl font-bold"><AnimatedNumber value={stats.dailyRevenue * 26} decimals={0} suffix={currencySuffix()} /></p>
              </div>
              <div className="bg-white/10 dark:bg-black/10 rounded-lg p-2 sm:p-4">
                <p className="text-[10px] sm:text-xs text-white/60 dark:text-[#111111]/60 mb-1">{t("dashboard.profitPerDay")}</p>
                <p className="text-lg sm:text-2xl font-bold text-green-300 dark:text-green-600"><AnimatedNumber value={stats.dailyProfit} decimals={0} suffix={currencySuffix()} /></p>
              </div>
            </div>
          </div>

          {/* Projections Line Chart */}
          <div className="bg-white dark:bg-[#0A0A0A] rounded-xl shadow-sm border border-[#E5E7EB] dark:border-[#1A1A1A] p-5">
            <div className="flex items-center gap-2 mb-4">
              <TrendingUp className="w-5 h-5 text-indigo-600" />
              <h3 className="text-lg font-semibold text-[#111111] dark:text-white">{t("dashboard.projections6Months")}</h3>
              <span className="text-xs text-[#9CA3AF] dark:text-[#737373] ml-auto">{t("dashboard.revenueVsCosts")}</span>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={stats.projectionData} margin={{ top: 5, right: 30, bottom: 5, left: 10 }}>
                <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} tickFormatter={(v: number) => `${(v / 1000).toFixed(0)}k${getCurrencySymbol()}`} />
                <Tooltip
                  content={({ active, payload, label }) => {
                    if (!active || !payload?.length) return null;
                    return (
                      <div className="bg-white dark:bg-[#0A0A0A] shadow-xl rounded-lg p-3 border border-[#E5E7EB] dark:border-[#1A1A1A] text-sm min-w-[180px]">
                        <p className="font-semibold text-[#111111] dark:text-white mb-1.5">{label}</p>
                        {payload.map((p, i: number) => (
                          <div key={i} className="flex items-center gap-2 mt-0.5">
                            <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: p.color }} />
                            <span className="text-[#9CA3AF] dark:text-[#737373]">{p.name}:</span>
                            <span className="font-semibold ml-auto" style={{ color: p.color }}>{p.value?.toLocaleString('fr-FR')}{currencySuffix()}</span>
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
                  {t("dashboard.estimatedMonthlyProfit")} : {(stats.dailyProfit * 26).toLocaleString('fr-FR')}{currencySuffix()}
                </span>
              </div>
            </div>
          </div>

          {/* Break-even analysis + coefficient distribution side by side */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Break-even analysis */}
            <div className="bg-white dark:bg-[#0A0A0A] rounded-xl shadow-sm border border-[#E5E7EB] dark:border-[#1A1A1A] p-5">
              <div className="flex items-center gap-2 mb-4">
                <Target className="w-5 h-5 text-teal-600" />
                <h3 className="text-lg font-semibold text-[#111111] dark:text-white">{t("dashboard.profitabilityAnalysis")}</h3>
              </div>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-[#FAFAFA] dark:bg-[#171717]/50 rounded-lg p-4">
                    <p className="text-xs text-[#9CA3AF] dark:text-[#737373] mb-1">{t("dashboard.avgCostRatio")}</p>
                    <p className="text-2xl font-bold text-[#111111] dark:text-white">
                      <AnimatedNumber value={stats.avgCostRatio * 100} decimals={1} suffix="%" />
                    </p>
                  </div>
                  <div className="bg-[#FAFAFA] dark:bg-[#171717]/50 rounded-lg p-4">
                    <p className="text-xs text-[#9CA3AF] dark:text-[#737373] mb-1">{t("dashboard.profitPerCover")}</p>
                    <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                      <AnimatedNumber value={stats.profitPerCouvert} decimals={2} suffix={currencySuffix()} />
                    </p>
                  </div>
                  <div className="bg-[#FAFAFA] dark:bg-[#171717]/50 rounded-lg p-4">
                    <p className="text-xs text-[#9CA3AF] dark:text-[#737373] mb-1">{t("dashboard.coversPerDay")}</p>
                    <p className="text-2xl font-bold text-[#111111] dark:text-white">{stats.dailyCouverts}</p>
                  </div>
                  <div className="bg-[#FAFAFA] dark:bg-[#171717]/50 rounded-lg p-4">
                    <p className="text-xs text-[#9CA3AF] dark:text-[#737373] mb-1">{t("dashboard.avgFoodCost")}</p>
                    <p className="text-2xl font-bold text-[#111111] dark:text-white">
                      <AnimatedNumber value={stats.avgFoodCost} decimals={2} suffix={currencySuffix()} />
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
            <div className="bg-white dark:bg-[#0A0A0A] rounded-xl shadow-sm border border-[#E5E7EB] dark:border-[#1A1A1A] p-5">
              <div className="flex items-center gap-2 mb-4">
                <BarChart3 className="w-5 h-5 text-purple-600" />
                <h3 className="text-lg font-semibold text-[#111111] dark:text-white">{t("dashboard.coefficientDistribution")}</h3>
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
          <div className="bg-white dark:bg-[#0A0A0A] rounded-xl shadow-sm border border-red-200 dark:border-red-800/50 p-5">
            <div className="flex items-center gap-2 mb-4">
              <ShieldAlert className="w-5 h-5 text-red-500" />
              <h3 className="text-lg font-semibold text-[#111111] dark:text-white">{t("dashboard.bottom5LeastProfitable")}</h3>
              <span className="text-xs text-red-500 font-medium bg-red-50 dark:bg-red-900/20 px-2 py-0.5 rounded-full ml-auto">{t("dashboard.actionRequired")}</span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-[#9CA3AF] dark:text-[#737373] border-b border-[#E5E7EB] dark:border-[#1A1A1A]">
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
                <tbody className="divide-y divide-[#F3F4F6] dark:divide-[#1A1A1A]">
                  {stats.worst5.map((r, i) => (
                    <tr key={r.id} className="hover:bg-red-50/50 dark:hover:bg-red-900/10">
                      <td className="py-2.5 text-red-500 font-bold">{i + 1}</td>
                      <td className="py-2.5 font-medium text-[#111111] dark:text-[#E5E5E5]">{r.name}</td>
                      <td className="py-2.5 text-[#9CA3AF] dark:text-[#737373]">{r.category}</td>
                      <td className="py-2.5 text-right font-mono text-[#9CA3AF] dark:text-[#A3A3A3]">{r.sellingPrice.toFixed(2)}{currencySuffix()}</td>
                      <td className="py-2.5 text-right font-mono text-[#9CA3AF] dark:text-[#A3A3A3]">{formatCurrency(r.margin.totalCostPerPortion || r.margin.costPerPortion)}</td>
                      <td className={`py-2.5 text-right font-mono font-bold ${r.margin.marginPercent < 50 ? 'text-red-600' : 'text-amber-600'}`}>
                        {r.margin.marginPercent.toFixed(1)}%
                      </td>
                      <td className="py-2.5 text-right font-mono text-[#9CA3AF] dark:text-[#A3A3A3]">{r.margin.coefficient.toFixed(2)}</td>
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
          <div className="bg-white dark:bg-[#0A0A0A] rounded-xl shadow-sm border border-[#E5E7EB] dark:border-[#1A1A1A]">
            <div className="px-5 py-3 border-b border-[#E5E7EB] dark:border-[#1A1A1A] flex items-center justify-between">
              <h3 className="text-lg font-semibold text-[#111111] dark:text-white">{t("dashboard.detailByDish")}</h3>
              <span className="text-xs text-[#9CA3AF] dark:text-[#737373]">{t("dashboard.sortedByMarginAsc")}</span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-[#FAFAFA] dark:bg-[#171717]/50 text-[#6B7280] dark:text-[#A3A3A3]">
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
                <tbody className="divide-y divide-[#F3F4F6] dark:divide-[#1A1A1A]">
                  {sortedByMargin.map(r => {
                    const mc = r.margin.marginPercent >= 70 ? 'text-green-600' : r.margin.marginPercent >= 60 ? 'text-amber-600' : 'text-red-600';
                    const rowBg = r.margin.marginPercent < 60 ? 'bg-red-50/40 dark:bg-red-900/10' : '';
                    return (
                      <tr key={r.id} className={`hover:bg-[#FAFAFA] dark:hover:bg-[#171717]/50 ${rowBg}`}>
                        <td className="px-4 py-2.5 font-medium text-[#111111] dark:text-[#E5E5E5]">
                          {r.margin.marginPercent < 50 && <AlertTriangle className="w-3.5 h-3.5 text-red-500 inline mr-1 -mt-0.5" />}
                          {r.name}
                        </td>
                        <td className="px-4 py-2.5 text-[#9CA3AF] dark:text-[#737373]">{r.category}</td>
                        <td className="px-4 py-2.5 text-right font-mono text-[#9CA3AF] dark:text-[#A3A3A3]">{r.sellingPrice.toFixed(2)}{currencySuffix()}</td>
                        <td className="px-4 py-2.5 text-right font-mono text-[#9CA3AF] dark:text-[#A3A3A3]">{r.margin.costPerPortion.toFixed(2)}{currencySuffix()}</td>
                        <td className="px-4 py-2.5 text-right font-mono text-[#9CA3AF] dark:text-[#737373]">{formatCurrency(r.margin.laborCostPerPortion || 0)}</td>
                        <td className="px-4 py-2.5 text-right font-mono font-medium text-[#111111] dark:text-[#E5E5E5]">{formatCurrency(r.margin.totalCostPerPortion || r.margin.costPerPortion)}</td>
                        <td className="px-4 py-2.5 text-right font-mono text-[#9CA3AF] dark:text-[#A3A3A3]">{formatCurrency(r.margin.marginAmount)}</td>
                        <td className={`px-4 py-2.5 text-right font-mono font-semibold ${mc}`}>{r.margin.marginPercent.toFixed(1)}%</td>
                        <td className="px-4 py-2.5 text-right font-mono text-[#9CA3AF] dark:text-[#A3A3A3]">{r.margin.coefficient.toFixed(2)}</td>
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

      {/* ═══���══════════════════════════════════════════════════════════════ */}
      {/* TAB: P&L (Profit & Loss)                                         */}
      {/* ══════════════════════════════════════════════════════════════════ */}
      {activeTab === 'pnl' && (
        <div className="space-y-6">
          {/* Period Selector */}
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div className="flex items-center gap-3">
              <ClipboardList className="w-6 h-6 text-[#111111] dark:text-white" />
              <h2 className="text-xl font-bold text-[#111111] dark:text-white">Compte de Resultat</h2>
            </div>
            <div className="flex items-center gap-1 bg-[#F3F4F6] dark:bg-[#171717] rounded-lg p-1">
              {([['week', 'Semaine'], ['month', 'Mois'], ['year', 'Annee']] as ['week' | 'month' | 'year', string][]).map(([key, label]) => (
                <button
                  key={key}
                  onClick={() => setPnlPeriod(key)}
                  className={`px-4 py-2 text-sm font-medium rounded-md transition-all ${
                    pnlPeriod === key
                      ? 'bg-white dark:bg-[#0A0A0A] text-[#111111] dark:text-white shadow-sm'
                      : 'text-[#9CA3AF] dark:text-[#737373] hover:text-[#111111] dark:hover:text-white'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          {pnlLoading ? (
            <div className="flex items-center justify-center py-20">
              <div className="w-8 h-8 border-2 border-[#111111] dark:border-white border-t-transparent rounded-full animate-spin" />
            </div>
          ) : !pnlData || pnlData.revenue === 0 ? (
            <div className="bg-white dark:bg-[#0A0A0A] rounded-xl border border-[#E5E7EB] dark:border-[#1A1A1A] p-12 text-center">
              <ClipboardList className="w-12 h-12 text-[#9CA3AF] mx-auto mb-4" />
              <p className="text-[#9CA3AF] dark:text-[#737373] text-lg">Ajoutez des recettes pour voir votre P&L</p>
            </div>
          ) : (
            <>
              {/* Revenue Sparkline + Key Figure */}
              <div className="bg-white dark:bg-[#0A0A0A] rounded-xl shadow-sm border border-[#E5E7EB] dark:border-[#1A1A1A] p-5">
                <div className="flex items-center justify-between mb-1">
                  <div>
                    <p className="text-xs text-[#9CA3AF] dark:text-[#737373] uppercase tracking-wider font-medium">Chiffre d'affaires</p>
                    <div className="flex items-baseline gap-3 mt-1">
                      <span className="text-3xl font-bold text-[#111111] dark:text-white">
                        {pnlData.revenue.toLocaleString('fr-FR', { maximumFractionDigits: 0 })} EUR
                      </span>
                      {pnlData.trend.revenueChange !== 0 && (
                        <span className={`inline-flex items-center gap-1 text-sm font-semibold px-2 py-0.5 rounded-full ${
                          pnlData.trend.revenueChange > 0
                            ? 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400'
                            : 'bg-red-50 dark:bg-red-900/20 text-red-500'
                        }`}>
                          {pnlData.trend.revenueChange > 0 ? <ArrowUpRight className="w-3.5 h-3.5" /> : <ArrowDownRight className="w-3.5 h-3.5" />}
                          {pnlData.trend.revenueChange > 0 ? '+' : ''}{pnlData.trend.revenueChange}%
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-[#9CA3AF] dark:text-[#737373] mt-0.5">vs periode precedente</p>
                  </div>
                </div>
                <div className="mt-3 -mx-2">
                  <ResponsiveContainer width="100%" height={80}>
                    <AreaChart data={pnlData.dailyBreakdown}>
                      <defs>
                        <linearGradient id="pnlRevenueGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#111111" stopOpacity={0.15} />
                          <stop offset="95%" stopColor="#111111" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <Area type="monotone" dataKey="revenue" stroke="#111111" strokeWidth={2} fill="url(#pnlRevenueGrad)" dot={false} />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* P&L Lines */}
              <div className="bg-white dark:bg-[#0A0A0A] rounded-xl shadow-sm border border-[#E5E7EB] dark:border-[#1A1A1A] overflow-hidden">
                <div className="px-5 py-4 border-b border-[#E5E7EB] dark:border-[#1A1A1A]">
                  <h3 className="text-base font-semibold text-[#111111] dark:text-white">Detail du compte de resultat</h3>
                  <p className="text-xs text-[#9CA3AF] dark:text-[#737373] mt-0.5">Estimation basee sur {couverts} couverts/service, ticket moyen {avgPricePerCouvert} EUR</p>
                </div>

                <div className="divide-y divide-[#F3F4F6] dark:divide-[#1A1A1A]">
                  {/* Revenue */}
                  <div className="flex items-center justify-between px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-8 rounded-full bg-[#111111] dark:bg-white" />
                      <div>
                        <p className="text-sm font-semibold text-[#111111] dark:text-white">Chiffre d'affaires</p>
                        <p className="text-xs text-[#9CA3AF] dark:text-[#737373]">{pnlData.daysInPeriod} jours</p>
                      </div>
                    </div>
                    <span className="text-lg font-bold text-[#111111] dark:text-white font-mono">
                      {pnlData.revenue.toLocaleString('fr-FR', { maximumFractionDigits: 0 })} EUR
                    </span>
                  </div>

                  {/* Food Cost */}
                  <div className="flex items-center justify-between px-5 py-4 bg-red-50/30 dark:bg-red-900/5">
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-8 rounded-full bg-red-500" />
                      <div>
                        <p className="text-sm font-semibold text-red-500">Cout matiere</p>
                        <p className="text-xs text-[#9CA3AF] dark:text-[#737373]">{pnlData.foodCostPercent}% du CA</p>
                      </div>
                    </div>
                    <span className="text-lg font-bold text-red-500 font-mono">
                      - {pnlData.foodCost.toLocaleString('fr-FR', { maximumFractionDigits: 0 })} EUR
                    </span>
                  </div>

                  {/* Gross Margin */}
                  <div className="flex items-center justify-between px-5 py-4 bg-[#FAFAFA] dark:bg-[#171717]/30">
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-8 rounded-full bg-emerald-500" />
                      <div>
                        <p className="text-sm font-bold text-[#111111] dark:text-white">= Marge brute</p>
                        <p className="text-xs text-emerald-600 dark:text-emerald-400 font-medium">{pnlData.grossMarginPercent}% du CA</p>
                      </div>
                    </div>
                    <span className="text-lg font-bold text-emerald-500 font-mono">
                      {pnlData.grossMargin.toLocaleString('fr-FR', { maximumFractionDigits: 0 })} EUR
                    </span>
                  </div>

                  {/* Labor Cost */}
                  <div className="flex items-center justify-between px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-8 rounded-full bg-red-400" />
                      <div>
                        <p className="text-sm font-semibold text-red-500">Cout main d'oeuvre</p>
                        <p className="text-xs text-[#9CA3AF] dark:text-[#737373]">{pnlData.laborCostPercent}% du CA</p>
                      </div>
                    </div>
                    <span className="text-lg font-bold text-red-500 font-mono">
                      - {pnlData.laborCost.toLocaleString('fr-FR', { maximumFractionDigits: 0 })} EUR
                    </span>
                  </div>

                  {/* Fixed Costs */}
                  <div className="flex items-center justify-between px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-8 rounded-full bg-red-300" />
                      <div>
                        <p className="text-sm font-semibold text-red-500">Charges fixes estimees</p>
                        <p className="text-xs text-[#9CA3AF] dark:text-[#737373]">~15% du CA (loyer, assurances, energie)</p>
                      </div>
                    </div>
                    <span className="text-lg font-bold text-red-500 font-mono">
                      - {pnlData.fixedCosts.toLocaleString('fr-FR', { maximumFractionDigits: 0 })} EUR
                    </span>
                  </div>

                  {/* Net Result */}
                  <div className={`flex items-center justify-between px-5 py-5 ${
                    pnlData.netResult >= 0
                      ? 'bg-emerald-50 dark:bg-emerald-900/10'
                      : 'bg-red-50 dark:bg-red-900/10'
                  }`}>
                    <div className="flex items-center gap-3">
                      <div className={`w-3 h-10 rounded-full ${pnlData.netResult >= 0 ? 'bg-emerald-500' : 'bg-red-500'}`} />
                      <div>
                        <p className="text-base font-bold text-[#111111] dark:text-white">= Resultat net</p>
                        <div className="flex items-center gap-2 mt-0.5">
                          <span className={`text-xs font-semibold ${pnlData.netResult >= 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-500'}`}>
                            {pnlData.netMarginPercent}% du CA
                          </span>
                          {pnlData.trend.netResultChange !== 0 && (
                            <span className={`inline-flex items-center gap-0.5 text-xs font-semibold px-1.5 py-0.5 rounded-full ${
                              pnlData.trend.netResultChange > 0
                                ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400'
                                : 'bg-red-100 dark:bg-red-900/30 text-red-500'
                            }`}>
                              {pnlData.trend.netResultChange > 0 ? '+' : ''}{pnlData.trend.netResultChange}%
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    <span className={`text-2xl font-bold font-mono ${pnlData.netResult >= 0 ? 'text-emerald-500' : 'text-red-500'}`}>
                      {pnlData.netResult >= 0 ? '+' : ''}{pnlData.netResult.toLocaleString('fr-FR', { maximumFractionDigits: 0 })} EUR
                    </span>
                  </div>
                </div>
              </div>

              {/* Category Breakdown */}
              <div className="bg-white dark:bg-[#0A0A0A] rounded-xl shadow-sm border border-[#E5E7EB] dark:border-[#1A1A1A] p-5">
                <div className="flex items-center gap-2 mb-4">
                  <BarChart3 className="w-5 h-5 text-[#111111] dark:text-white" />
                  <h3 className="text-base font-semibold text-[#111111] dark:text-white">Ventilation par categorie</h3>
                </div>
                <div className="space-y-3">
                  {pnlData.categoryBreakdown.map((cat: any) => {
                    const maxRevenue = Math.max(...pnlData.categoryBreakdown.map((c: any) => c.revenue));
                    const barWidth = maxRevenue > 0 ? (cat.revenue / maxRevenue) * 100 : 0;
                    return (
                      <div key={cat.name} className="group">
                        <div className="flex items-center justify-between mb-1">
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-medium text-[#111111] dark:text-white">{cat.name}</span>
                            <span className="text-xs text-[#9CA3AF] dark:text-[#737373]">{cat.recipeCount} recettes</span>
                          </div>
                          <div className="flex items-center gap-3">
                            <span className="text-xs text-[#9CA3AF] dark:text-[#737373]">Marge {cat.margin}%</span>
                            <span className="text-sm font-bold font-mono text-[#111111] dark:text-white">
                              {cat.revenue.toLocaleString('fr-FR', { maximumFractionDigits: 0 })} EUR
                            </span>
                          </div>
                        </div>
                        <div className="h-3 bg-[#F3F4F6] dark:bg-[#171717] rounded-full overflow-hidden">
                          <div className="h-full rounded-full relative" style={{ width: `${barWidth}%` }}>
                            <div
                              className="absolute inset-0 rounded-full bg-[#111111] dark:bg-white"
                              style={{ width: `${cat.revenue > 0 ? 100 - (cat.foodCost / cat.revenue) * 100 : 0}%` }}
                            />
                            <div
                              className="absolute inset-0 rounded-full bg-red-400/40 dark:bg-red-400/30"
                              style={{ left: `${cat.revenue > 0 ? 100 - (cat.foodCost / cat.revenue) * 100 : 0}%` }}
                            />
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
                <div className="flex items-center gap-4 mt-4 pt-3 border-t border-[#F3F4F6] dark:border-[#1A1A1A]">
                  <div className="flex items-center gap-1.5">
                    <div className="w-3 h-3 rounded-full bg-[#111111] dark:bg-white" />
                    <span className="text-xs text-[#9CA3AF] dark:text-[#737373]">Marge</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <div className="w-3 h-3 rounded-full bg-red-400/40 dark:bg-red-400/30" />
                    <span className="text-xs text-[#9CA3AF] dark:text-[#737373]">Cout matiere</span>
                  </div>
                </div>
              </div>

              {/* Revenue vs Costs Chart */}
              <div className="bg-white dark:bg-[#0A0A0A] rounded-xl shadow-sm border border-[#E5E7EB] dark:border-[#1A1A1A] p-5">
                <div className="flex items-center gap-2 mb-4">
                  <TrendingUp className="w-5 h-5 text-[#111111] dark:text-white" />
                  <h3 className="text-base font-semibold text-[#111111] dark:text-white">Evolution CA vs Couts</h3>
                </div>
                <ResponsiveContainer width="100%" height={260}>
                  <AreaChart data={pnlData.dailyBreakdown} margin={{ top: 5, right: 10, bottom: 5, left: 10 }}>
                    <defs>
                      <linearGradient id="pnlRevArea" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#111111" stopOpacity={0.1} />
                        <stop offset="95%" stopColor="#111111" stopOpacity={0} />
                      </linearGradient>
                      <linearGradient id="pnlCostArea" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#ef4444" stopOpacity={0.1} />
                        <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" className="opacity-20" />
                    <XAxis dataKey="label" tick={{ fontSize: 11, fill: '#9CA3AF' }} />
                    <YAxis tick={{ fontSize: 11, fill: '#9CA3AF' }} tickFormatter={(v: number) => `${(v / 1000).toFixed(0)}k`} />
                    <Tooltip
                      content={({ active, payload, label }) => {
                        if (!active || !payload?.length) return null;
                        return (
                          <div className="bg-white dark:bg-[#0A0A0A] shadow-xl rounded-lg p-3 border border-[#E5E7EB] dark:border-[#1A1A1A] text-sm">
                            <p className="font-semibold text-[#111111] dark:text-white mb-1.5">{label}</p>
                            {payload.map((p: any, i: number) => (
                              <div key={i} className="flex items-center gap-2 mt-0.5">
                                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: p.color }} />
                                <span className="text-[#9CA3AF]">{p.name} :</span>
                                <span className="font-semibold ml-auto" style={{ color: p.color }}>{p.value?.toLocaleString('fr-FR')} EUR</span>
                              </div>
                            ))}
                          </div>
                        );
                      }}
                    />
                    <Area type="monotone" dataKey="revenue" name="CA" stroke="#111111" strokeWidth={2} fill="url(#pnlRevArea)" />
                    <Area type="monotone" dataKey="cost" name="Couts" stroke="#ef4444" strokeWidth={2} fill="url(#pnlCostArea)" />
                    <Line type="monotone" dataKey="profit" name="Profit" stroke="#10b981" strokeWidth={2} strokeDasharray="5 5" dot={false} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>

              {/* Summary Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
                <div className="bg-white dark:bg-[#0A0A0A] rounded-xl border border-[#E5E7EB] dark:border-[#1A1A1A] p-4">
                  <p className="text-xs text-[#9CA3AF] dark:text-[#737373] mb-1">Food Cost %</p>
                  <p className="text-lg sm:text-2xl font-bold text-red-500 font-mono">{pnlData.foodCostPercent}%</p>
                  <div className="h-1.5 bg-[#F3F4F6] dark:bg-[#171717] rounded-full mt-2">
                    <div className="h-full bg-red-500 rounded-full" style={{ width: `${Math.min(pnlData.foodCostPercent * 2.5, 100)}%` }} />
                  </div>
                </div>
                <div className="bg-white dark:bg-[#0A0A0A] rounded-xl border border-[#E5E7EB] dark:border-[#1A1A1A] p-4">
                  <p className="text-xs text-[#9CA3AF] dark:text-[#737373] mb-1">Labor Cost %</p>
                  <p className="text-lg sm:text-2xl font-bold text-red-500 font-mono">{pnlData.laborCostPercent}%</p>
                  <div className="h-1.5 bg-[#F3F4F6] dark:bg-[#171717] rounded-full mt-2">
                    <div className="h-full bg-red-400 rounded-full" style={{ width: `${Math.min(pnlData.laborCostPercent * 2.5, 100)}%` }} />
                  </div>
                </div>
                <div className="bg-white dark:bg-[#0A0A0A] rounded-xl border border-[#E5E7EB] dark:border-[#1A1A1A] p-4">
                  <p className="text-xs text-[#9CA3AF] dark:text-[#737373] mb-1">Marge brute %</p>
                  <p className="text-lg sm:text-2xl font-bold text-emerald-500 font-mono">{pnlData.grossMarginPercent}%</p>
                  <div className="h-1.5 bg-[#F3F4F6] dark:bg-[#171717] rounded-full mt-2">
                    <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${Math.min(pnlData.grossMarginPercent, 100)}%` }} />
                  </div>
                </div>
                <div className={`rounded-xl border p-4 ${
                  pnlData.netResult >= 0
                    ? 'bg-emerald-50/50 dark:bg-emerald-900/10 border-emerald-200 dark:border-emerald-800/50'
                    : 'bg-red-50/50 dark:bg-red-900/10 border-red-200 dark:border-red-800/50'
                }`}>
                  <p className="text-xs text-[#9CA3AF] dark:text-[#737373] mb-1">Marge nette %</p>
                  <p className={`text-2xl font-bold font-mono ${pnlData.netResult >= 0 ? 'text-emerald-500' : 'text-red-500'}`}>
                    {pnlData.netMarginPercent}%
                  </p>
                  <div className="h-1.5 bg-[#F3F4F6] dark:bg-[#171717] rounded-full mt-2">
                    <div className={`h-full rounded-full ${pnlData.netResult >= 0 ? 'bg-emerald-500' : 'bg-red-500'}`} style={{ width: `${Math.min(Math.abs(pnlData.netMarginPercent), 100)}%` }} />
                  </div>
                </div>
              </div>

              {/* ══════════════════════════════════════════════════════════ */}
              {/* IA Predictive Section                                     */}
              {/* ══════════════════════════════════════════════════════════ */}
              <div className="pt-4 border-t border-[#E5E7EB] dark:border-[#1A1A1A]">
                <div className="flex items-center gap-3 mb-5">
                  <div className="p-2 bg-[#111111] dark:bg-white rounded-lg">
                    <Sparkles className="w-5 h-5 text-white dark:text-black" />
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-[#111111] dark:text-white">IA Predictive</h2>
                    <p className="text-xs text-[#9CA3AF] dark:text-[#737373]">Previsions de demande et suggestions de prix generees par IA</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                  {/* Card: Previsions de la semaine */}
                  <div className="bg-white dark:bg-[#0A0A0A] rounded-xl shadow-sm border border-[#E5E7EB] dark:border-[#1A1A1A] overflow-hidden">
                    <div className="px-5 py-4 border-b border-[#E5E7EB] dark:border-[#1A1A1A] flex items-center gap-2">
                      <BarChart3 className="w-4 h-4 text-[#111111] dark:text-white" />
                      <h3 className="text-sm font-semibold text-[#111111] dark:text-white">Previsions de la semaine</h3>
                    </div>
                    <div className="p-5">
                      {forecastLoading ? (
                        <div className="flex items-center justify-center py-10">
                          <div className="w-6 h-6 border-2 border-[#111111] dark:border-white border-t-transparent rounded-full animate-spin" />
                          <span className="ml-3 text-sm text-[#9CA3AF]">Analyse des ventes en cours...</span>
                        </div>
                      ) : forecastData?.predictions?.length > 0 ? (
                        <div className="space-y-3">
                          {forecastData.predictions.slice(0, 7).map((day: any, i: number) => (
                            <div key={i} className="group">
                              <div className="flex items-center justify-between mb-1.5">
                                <span className="text-sm font-semibold text-[#111111] dark:text-white capitalize">{day.dayOfWeek}</span>
                                <span className="text-xs text-[#9CA3AF] dark:text-[#737373]">{day.date}</span>
                              </div>
                              <div className="flex flex-wrap gap-1.5">
                                {(day.recipes || []).slice(0, 4).map((r: any, j: number) => (
                                  <span
                                    key={j}
                                    className="inline-flex items-center gap-1 px-2 py-1 rounded-md text-xs bg-[#F3F4F6] dark:bg-[#171717] text-[#374151] dark:text-[#D4D4D4]"
                                  >
                                    <span className="font-medium">{r.name}</span>
                                    <span className="font-bold text-[#111111] dark:text-white">x{r.predictedQuantity}</span>
                                    {r.confidence >= 0.8 && <span className="text-emerald-500 text-[10px]">HQ</span>}
                                  </span>
                                ))}
                                {(day.recipes || []).length > 4 && (
                                  <span className="px-2 py-1 rounded-md text-xs bg-[#F3F4F6] dark:bg-[#171717] text-[#9CA3AF]">
                                    +{day.recipes.length - 4}
                                  </span>
                                )}
                              </div>
                            </div>
                          ))}
                          {forecastData.insights && (
                            <div className="mt-4 pt-3 border-t border-[#F3F4F6] dark:border-[#1A1A1A]">
                              <p className="text-xs text-[#6B7280] dark:text-[#A3A3A3] leading-relaxed">{forecastData.insights.slice(0, 300)}{forecastData.insights.length > 300 ? '...' : ''}</p>
                            </div>
                          )}
                        </div>
                      ) : (
                        <div className="text-center py-8">
                          <BarChart3 className="w-8 h-8 text-[#D1D5DB] dark:text-[#333] mx-auto mb-2" />
                          <p className="text-sm text-[#9CA3AF] dark:text-[#737373]">{forecastData?.insights || 'Enregistrez des ventes pour activer les previsions'}</p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Card: Suggestions prix */}
                  <div className="bg-white dark:bg-[#0A0A0A] rounded-xl shadow-sm border border-[#E5E7EB] dark:border-[#1A1A1A] overflow-hidden">
                    <div className="px-5 py-4 border-b border-[#E5E7EB] dark:border-[#1A1A1A] flex items-center gap-2">
                      <TrendingUp className="w-4 h-4 text-[#111111] dark:text-white" />
                      <h3 className="text-sm font-semibold text-[#111111] dark:text-white">Suggestions prix</h3>
                    </div>
                    <div className="p-5">
                      {pricingLoading ? (
                        <div className="flex items-center justify-center py-10">
                          <div className="w-6 h-6 border-2 border-[#111111] dark:border-white border-t-transparent rounded-full animate-spin" />
                          <span className="ml-3 text-sm text-[#9CA3AF]">Analyse des marges en cours...</span>
                        </div>
                      ) : pricingData?.suggestions?.length > 0 ? (
                        <div className="space-y-3">
                          {pricingData.suggestions.slice(0, 5).map((s: any, i: number) => {
                            const diff = s.suggestedPrice - s.currentPrice;
                            const isUp = diff > 0;
                            return (
                              <div key={i} className="flex items-center justify-between py-2 border-b border-[#F3F4F6] dark:border-[#1A1A1A] last:border-0">
                                <div className="flex-1 min-w-0">
                                  <p className="text-sm font-medium text-[#111111] dark:text-white truncate">{s.recipeName}</p>
                                  <p className="text-xs text-[#9CA3AF] dark:text-[#737373] mt-0.5 truncate">{s.reasoning}</p>
                                </div>
                                <div className="flex items-center gap-3 shrink-0 ml-3">
                                  <div className="text-right">
                                    <p className="text-xs text-[#9CA3AF] line-through">{s.currentPrice?.toFixed(2)} EUR</p>
                                    <p className="text-sm font-bold text-[#111111] dark:text-white">{s.suggestedPrice?.toFixed(2)} EUR</p>
                                  </div>
                                  <span className={`inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full text-xs font-bold ${
                                    isUp ? 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400' : 'bg-red-50 dark:bg-red-900/20 text-red-500'
                                  }`}>
                                    {isUp ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                                    {isUp ? '+' : ''}{diff.toFixed(2)}
                                  </span>
                                </div>
                              </div>
                            );
                          })}
                          {pricingData.summary && (
                            <div className="mt-3 pt-3 border-t border-[#F3F4F6] dark:border-[#1A1A1A]">
                              <p className="text-xs text-[#6B7280] dark:text-[#A3A3A3] leading-relaxed">{pricingData.summary}</p>
                            </div>
                          )}
                        </div>
                      ) : (
                        <div className="text-center py-8">
                          <TrendingUp className="w-8 h-8 text-[#D1D5DB] dark:text-[#333] mx-auto mb-2" />
                          <p className="text-sm text-[#9CA3AF] dark:text-[#737373]">{pricingData?.summary || 'Ajoutez des recettes pour obtenir des suggestions'}</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      )}

      {/* ── Weekly AI Report Modal ──────────────────────────────────────── */}
      {reportModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 no-print">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setReportModalOpen(false)} />
          <div className="relative w-full max-w-3xl max-h-[90vh] overflow-hidden bg-white dark:bg-[#0A0A0A] rounded-2xl border border-[#E5E7EB] dark:border-[#1A1A1A] shadow-2xl flex flex-col print-report">
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-[#E5E7EB] dark:border-[#1A1A1A]">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-[#111111] dark:bg-white rounded-lg">
                  <Sparkles className="w-5 h-5 text-white dark:text-black" />
                </div>
                <div>
                  <h3 className="text-lg font-bold font-satoshi text-[#111111] dark:text-white">Rapport Hebdomadaire IA</h3>
                  {reportData?.generatedAt && (
                    <p className="text-xs text-[#9CA3AF] dark:text-[#737373] font-general-sans">
                      {new Date(reportData.generatedAt).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                    </p>
                  )}
                </div>
              </div>
              <button
                onClick={() => setReportModalOpen(false)}
                className="p-2 rounded-lg hover:bg-[#F3F4F6] dark:hover:bg-[#171717] transition-colors"
              >
                <X className="w-5 h-5 text-[#9CA3AF]" />
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto px-4 sm:px-6 py-4 sm:py-5">
              {reportLoading ? (
                <div className="flex flex-col items-center justify-center py-20 gap-4">
                  <Loader2 className="w-8 h-8 text-[#111111] dark:text-white animate-spin" />
                  <p className="text-sm text-[#9CA3AF] dark:text-[#737373] font-general-sans">Analyse de vos donnees en cours...</p>
                  <p className="text-xs text-[#D1D5DB] dark:text-[#525252] font-general-sans">Recettes, marges, stock, pertes, planning...</p>
                </div>
              ) : reportData ? (
                <>
                  {/* Key Metrics Cards */}
                  {reportData.keyMetrics && (
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-6">
                      <div className="bg-[#FAFAFA] dark:bg-[#111111] border border-[#E5E7EB] dark:border-[#1A1A1A] rounded-xl p-4 text-center">
                        <p className="text-2xl font-black font-satoshi text-[#111111] dark:text-white">{reportData.keyMetrics.recipeCount}</p>
                        <p className="text-xs text-[#9CA3AF] dark:text-[#737373] mt-1 font-general-sans">Recettes</p>
                      </div>
                      <div className="bg-[#FAFAFA] dark:bg-[#111111] border border-[#E5E7EB] dark:border-[#1A1A1A] rounded-xl p-4 text-center">
                        <p className="text-2xl font-black font-satoshi text-[#111111] dark:text-white">{reportData.keyMetrics.avgMargin}%</p>
                        <p className="text-xs text-[#9CA3AF] dark:text-[#737373] mt-1 font-general-sans">Marge moy.</p>
                      </div>
                      <div className="bg-[#FAFAFA] dark:bg-[#111111] border border-[#E5E7EB] dark:border-[#1A1A1A] rounded-xl p-4 text-center">
                        <p className="text-2xl font-black font-satoshi text-[#111111] dark:text-white">{reportData.keyMetrics.totalRevenue}{getCurrencySymbol()}</p>
                        <p className="text-xs text-[#9CA3AF] dark:text-[#737373] mt-1 font-general-sans">CA semaine</p>
                      </div>
                      <div className="bg-[#FAFAFA] dark:bg-[#111111] border border-[#E5E7EB] dark:border-[#1A1A1A] rounded-xl p-4 text-center">
                        <p className={`text-2xl font-black font-satoshi ${(reportData.keyMetrics.totalWasteCost || 0) > 50 ? 'text-red-500' : 'text-[#111111] dark:text-white'}`}>{reportData.keyMetrics.totalWasteCost}{getCurrencySymbol()}</p>
                        <p className="text-xs text-[#9CA3AF] dark:text-[#737373] mt-1 font-general-sans">Pertes</p>
                      </div>
                      <div className="bg-[#FAFAFA] dark:bg-[#111111] border border-[#E5E7EB] dark:border-[#1A1A1A] rounded-xl p-4 text-center">
                        <p className="text-2xl font-black font-satoshi text-[#111111] dark:text-white">{reportData.keyMetrics.totalHours}h</p>
                        <p className="text-xs text-[#9CA3AF] dark:text-[#737373] mt-1 font-general-sans">Heures planning</p>
                      </div>
                      <div className="bg-[#FAFAFA] dark:bg-[#111111] border border-[#E5E7EB] dark:border-[#1A1A1A] rounded-xl p-4 text-center">
                        <p className={`text-2xl font-black font-satoshi ${(reportData.keyMetrics.stockAlertCount || 0) > 0 ? 'text-red-500' : 'text-[#111111] dark:text-white'}`}>{reportData.keyMetrics.stockAlertCount}</p>
                        <p className="text-xs text-[#9CA3AF] dark:text-[#737373] mt-1 font-general-sans">Alertes stock</p>
                      </div>
                    </div>
                  )}

                  {/* Report Text */}
                  <div className="space-y-3">
                    {reportData.report.split('\n').filter((p: string) => p.trim()).map((paragraph: string, i: number) => (
                      <p key={i} className="text-sm leading-relaxed text-[#374151] dark:text-[#D4D4D4] font-general-sans">
                        {paragraph}
                      </p>
                    ))}
                  </div>
                </>
              ) : null}
            </div>

            {/* Footer Actions */}
            {reportData && !reportLoading && (
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 px-4 sm:px-6 py-4 border-t border-[#E5E7EB] dark:border-[#1A1A1A] bg-[#FAFAFA] dark:bg-[#0A0A0A]">
                <p className="text-xs text-[#9CA3AF] dark:text-[#737373] font-general-sans">
                  Rapport en cache 24h
                </p>
                <div className="flex flex-wrap items-center gap-2">
                  <button
                    onClick={copyReport}
                    className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium rounded-lg bg-white dark:bg-[#171717] text-[#6B7280] dark:text-[#E5E5E5] border border-[#E5E7EB] dark:border-[#1A1A1A] hover:bg-[#F3F4F6] dark:hover:bg-[#262626] transition-colors"
                  >
                    {reportCopied ? <><Check className="w-3.5 h-3.5 text-emerald-500" /> Copie !</> : <><Copy className="w-3.5 h-3.5" /> Copier</>}
                  </button>
                  <button
                    onClick={sendReportByEmail}
                    disabled={reportEmailSending}
                    className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium rounded-lg bg-white dark:bg-[#171717] text-[#6B7280] dark:text-[#E5E5E5] border border-[#E5E7EB] dark:border-[#1A1A1A] hover:bg-[#F3F4F6] dark:hover:bg-[#262626] transition-colors disabled:opacity-50"
                  >
                    {reportEmailSending ? <><Loader2 className="w-3.5 h-3.5 animate-spin" /> Envoi...</> : reportEmailSent ? <><Check className="w-3.5 h-3.5 text-emerald-500" /> Envoye !</> : <><Mail className="w-3.5 h-3.5" /> Envoyer par email</>}
                  </button>
                  <button
                    onClick={printReport}
                    className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium rounded-lg bg-[#111111] dark:bg-white text-white dark:text-black hover:bg-[#333] dark:hover:bg-[#E5E5E5] transition-colors"
                  >
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
