import { useState, useMemo, useEffect, useRef } from 'react';
import {
  Trash2, Plus, TrendingDown, AlertTriangle, Lightbulb,
  Target, PieChart as PieChartIcon, BarChart3, Leaf, Search,
  ChevronDown, ChevronUp, Calendar, ArrowDown, Loader2,
  Brain, Zap, Clock, TrendingUp, CalendarDays, Sparkles,
  Award, CheckCircle, Flame, ArrowUpRight, ArrowDownRight,
  FileText, Package, Camera, Mail, Percent, ShieldCheck,
  Image, X, Send, Eye
} from 'lucide-react';
import {
  PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, LineChart, Line, ReferenceLine
} from 'recharts';
import { useToast } from '../hooks/useToast';
import { useRestaurant } from '../hooks/useRestaurant';
import { useTranslation } from '../hooks/useTranslation';
import Modal from '../components/Modal';
import { fetchIngredients } from '../services/api';
import { HeatmapGrid, CSSBarChart, ProgressRing } from '../components/Charts';

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
import type { Ingredient } from '../types';

// ─── Types ───────────────────────────────────────────────────────────────────

type WasteReason = 'expired' | 'spoiled' | 'overproduction' | 'damaged' | 'other';

// ─── Root Cause Analysis Categories ─────────────────────────────────────────
type RootCause = 'surproduction' | 'perime' | 'preparation' | 'stockage' | 'invendu';

const ROOT_CAUSE_LABELS: Record<RootCause, string> = {
  perime: 'Perime / DLC depassee',
  surproduction: 'Surproduction',
  preparation: 'Erreur de preparation',
  stockage: 'Probleme de stockage',
  invendu: 'Invendu',
};

const ROOT_CAUSE_COLORS: Record<RootCause, string> = {
  perime: '#dc2626',
  surproduction: '#7c3aed',
  preparation: '#d97706',
  stockage: '#0891b2',
  invendu: '#ea580c',
};

interface WasteEntry {
  id: number;
  date: string;
  ingredientName: string;
  ingredientId: number;
  quantity: number;
  unit: string;
  costPerUnit: number;
  reason: WasteReason;
  rootCause?: RootCause;
  photoBase64?: string;
  notes: string;
}

// ─── Photo storage helpers ──────────────────────────────────────────────────
function saveWastePhoto(entryId: number, base64: string) {
  try {
    const photos = JSON.parse(localStorage.getItem('wastePhotos') || '{}');
    photos[entryId] = base64;
    localStorage.setItem('wastePhotos', JSON.stringify(photos));
  } catch { /* storage full */ }
}

function getWastePhoto(entryId: number): string | null {
  try {
    const photos = JSON.parse(localStorage.getItem('wastePhotos') || '{}');
    return photos[entryId] || null;
  } catch { return null; }
}

function getAllWastePhotos(): Record<number, string> {
  try {
    return JSON.parse(localStorage.getItem('wastePhotos') || '{}');
  } catch { return {}; }
}

// ─── Weekly Report helpers ──────────────────────────────────────────────────
interface WeeklyReport {
  weekStart: string;
  weekEnd: string;
  totalCost: number;
  entryCount: number;
  top3: { name: string; cost: number }[];
  trendVsLastWeek: number; // percentage
  suggestions: string[];
  generatedAt: string;
}

interface WasteSummary {
  totalCost: number;
  itemCount: number;
  topWasted: { ingredientName: string; totalCost: number; totalQuantity: number; unit: string }[];
  wasteByReason: Record<string, number>;
  trend: { date: string; cost: number }[];
}

interface AiRecommendation {
  action: string;
  impact: string;
  priority: 'haute' | 'moyenne' | 'basse';
  timeline: string;
}

interface WastePrediction {
  day: string;
  predictedCost: number;
  highRisk: boolean;
  confidence: 'haute' | 'moyenne' | 'basse';
}

interface AiWasteAnalysis {
  analysis: string;
  topWasteItems: { name: string; totalCost: number; totalQuantity: number; unit: string; incidents: number }[];
  patterns: {
    byDayOfWeek: Record<string, number>;
    byReason: Record<string, number>;
    byCategory: Record<string, number>;
  };
  recommendations: AiRecommendation[];
  estimatedSavings: number;
  trend: { date: string; cost: number }[];
  targetDailyCost: number;
  prediction: WastePrediction[];
}

// ── Reduction Goal stored in localStorage ────────────────────────────────
interface ReductionGoal {
  targetPercent: number; // e.g. 15 means -15%
  baselineCost: number;  // last month cost at time of setting goal
  month: string;         // YYYY-MM
}

const API_BASE = import.meta.env.VITE_API_URL || '/api';

function authHeaders(): Record<string, string> {
  const token = localStorage.getItem('token');
  const rid = localStorage.getItem('activeRestaurantId');
  const headers: Record<string, string> = { 'Content-Type': 'application/json' };
  if (token) headers['Authorization'] = `Bearer ${token}`;
  if (rid) headers['X-Restaurant-Id'] = rid;
  return headers;
}

type Period = 'jour' | 'semaine' | 'mois';

// ─── Constants ───────────────────────────────────────────────────────────────

const REASON_LABELS: Record<WasteReason, string> = {
  expired: 'Perime',
  spoiled: 'Avarie',
  overproduction: 'Surproduction',
  damaged: 'Erreur preparation',
  other: 'Autre',
};

const REASON_COLORS: Record<WasteReason, string> = {
  expired: '#dc2626',
  spoiled: '#d97706',
  overproduction: '#7c3aed',
  damaged: '#0891b2',
  other: '#6b7280',
};

const REASON_BADGE: Record<WasteReason, string> = {
  expired: 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300',
  spoiled: 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300',
  overproduction: 'bg-violet-100 text-violet-700 dark:bg-violet-900/40 dark:text-violet-300',
  damaged: 'bg-cyan-100 text-cyan-700 dark:bg-cyan-900/40 dark:text-cyan-300',
  other: 'bg-gray-100 text-gray-700 dark:bg-gray-900/40 dark:text-gray-300',
};

const CATEGORY_COLORS: Record<string, string> = {
  'Viandes': '#dc2626',
  'Poissons': '#2563eb',
  'Legumes': '#16a34a',
  'Fruits': '#ea580c',
  'Produits laitiers': '#8b5cf6',
  'Epicerie': '#d97706',
  'Boulangerie': '#a16207',
  'Boissons': '#0891b2',
  'Condiments': '#65a30d',
  'Surgeles': '#6366f1',
};

function getCategoryColor(cat: string): string {
  return CATEGORY_COLORS[cat] || '#6b7280';
}

// ─── AI Suggestions Generator ────────────────────────────────────────────────

function generateSuggestions(entries: WasteEntry[], ingredients: Ingredient[]): string[] {
  const tips: string[] = [];
  const byReason: Record<WasteReason, number> = { expired: 0, spoiled: 0, overproduction: 0, damaged: 0, other: 0 };
  const byIngredient: Record<string, { cost: number; name: string }> = {};

  entries.forEach(e => {
    const cost = e.quantity * e.costPerUnit;
    byReason[e.reason] += cost;
    if (!byIngredient[e.ingredientName]) byIngredient[e.ingredientName] = { cost: 0, name: e.ingredientName };
    byIngredient[e.ingredientName].cost += cost;
  });

  const topReason = (Object.entries(byReason) as [WasteReason, number][]).sort((a, b) => b[1] - a[1])[0];
  const topIngredients = Object.entries(byIngredient).sort((a, b) => b[1].cost - a[1].cost).slice(0, 3);
  const totalCost = entries.reduce((s, e) => s + e.quantity * e.costPerUnit, 0);

  if (topIngredients.length > 0) {
    const top = topIngredients[0];
    const saving10 = top[1].cost * 0.1;
    tips.push(
      `L'IA suggere : Reduisez les portions de ${top[1].name} de 10% pour economiser ${saving10.toFixed(0)} EUR/mois`
    );
  }
  if (topIngredients.length > 1) {
    tips.push(
      `L'IA suggere : Commandez ${topIngredients[1][1].name} plus frequemment en plus petites quantites pour reduire les pertes`
    );
  }
  if (topReason && topReason[0] === 'expired') {
    tips.push(
      'L\'IA suggere : Appliquez le FIFO (First In, First Out) pour reduire les pertes par peremption. Verifiez les DLC chaque matin.'
    );
  }
  if (topReason && topReason[0] === 'overproduction') {
    tips.push(
      'L\'IA suggere : Analysez vos donnees de frequentation pour ajuster les quantites preparees. Utilisez les previsions du planning.'
    );
  }
  if (topReason && topReason[0] === 'damaged') {
    tips.push(
      'L\'IA suggere : Renforcez la formation des equipes sur les fiches techniques. Utilisez la station balance pour un dosage precis.'
    );
  }
  if (totalCost > 500) {
    tips.push(
      `L'IA suggere : Votre gaspillage mensuel depasse 500 EUR. Mettez en place un "plat du jour" avec les surplus pour valoriser les excedents.`
    );
  }

  // Category-based suggestions
  const ingByCategory: Record<string, number> = {};
  entries.forEach(e => {
    const ing = ingredients.find(i => i.id === e.ingredientId);
    if (ing && ing.category) {
      ingByCategory[ing.category] = (ingByCategory[ing.category] || 0) + e.quantity * e.costPerUnit;
    }
  });
  const topCat = Object.entries(ingByCategory).sort((a, b) => b[1] - a[1])[0];
  if (topCat) {
    tips.push(
      `L'IA suggere : La categorie "${topCat[0]}" represente votre plus grosse source de gaspillage (${topCat[1].toFixed(0)} EUR). Negociez des conditionnements plus petits.`
    );
  }

  // Day-of-week pattern detection
  const byDayOfWeek: Record<string, number> = {};
  const dayNames = ['dimanche', 'lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi', 'samedi'];
  entries.forEach(e => {
    const d = new Date(e.date);
    const dayName = dayNames[d.getDay()];
    byDayOfWeek[dayName] = (byDayOfWeek[dayName] || 0) + e.quantity * e.costPerUnit;
  });
  const sortedDays = Object.entries(byDayOfWeek).sort((a, b) => b[1] - a[1]);
  if (sortedDays.length > 0 && sortedDays[0][1] > 0) {
    const avgDayCost = Object.values(byDayOfWeek).reduce((a, b) => a + b, 0) / Object.keys(byDayOfWeek).length;
    if (sortedDays[0][1] > avgDayCost * 1.3) {
      tips.push(
        `L'IA suggere : Le gaspillage augmente le ${sortedDays[0][0]} (${sortedDays[0][1].toFixed(0)} EUR vs ${avgDayCost.toFixed(0)} EUR en moyenne). Ajustez les commandes et les preparations ce jour-la.`
      );
    }
  }

  // Root cause pattern suggestion
  const rootCauseCounts: Record<string, number> = {};
  entries.forEach(e => {
    if (e.rootCause) {
      rootCauseCounts[e.rootCause] = (rootCauseCounts[e.rootCause] || 0) + 1;
    }
  });
  const topRootCause = Object.entries(rootCauseCounts).sort((a, b) => b[1] - a[1])[0];
  if (topRootCause) {
    const label = ROOT_CAUSE_LABELS[topRootCause[0] as RootCause] || topRootCause[0];
    tips.push(
      `L'IA suggere : La cause racine la plus frequente est "${label}" (${topRootCause[1]} occurrences). Concentrez vos efforts de reduction sur ce point.`
    );
  }

  tips.push('L\'IA suggere : Utilisez une app anti-gaspi (Too Good To Go) pour vendre les invendus en fin de service.');

  return tips;
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function formatEuro(val: number): string {
  return val.toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' });
}

function getWeekNumber(d: Date): number {
  const oneJan = new Date(d.getFullYear(), 0, 1);
  return Math.ceil(((d.getTime() - oneJan.getTime()) / 86400000 + oneJan.getDay() + 1) / 7);
}

// ── Animated Counter Hook ────────────────────────────────────────────────────
function useAnimatedCounter(target: number, duration = 1200): number {
  const [value, setValue] = useState(0);
  const prevTarget = useRef(0);

  useEffect(() => {
    const start = prevTarget.current;
    const diff = target - start;
    if (Math.abs(diff) < 0.01) { setValue(target); return; }
    const startTime = performance.now();
    let rafId: number;

    function animate(now: number) {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // ease-out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      setValue(start + diff * eased);
      if (progress < 1) {
        rafId = requestAnimationFrame(animate);
      } else {
        prevTarget.current = target;
      }
    }
    rafId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(rafId);
  }, [target, duration]);

  return value;
}

// ─── Calendar Heatmap Helpers ────────────────────────────────────────────────
function getLast30Days(): string[] {
  const days: string[] = [];
  const now = new Date();
  for (let i = 29; i >= 0; i--) {
    const d = new Date(now);
    d.setDate(d.getDate() - i);
    days.push(d.toISOString().split('T')[0]);
  }
  return days;
}

function getHeatColor(value: number, max: number): { bg: string; text: string } {
  if (value === 0) return { bg: '#16a34a22', text: '#16a34a' };
  const ratio = max > 0 ? value / max : 0;
  if (ratio < 0.25) return { bg: '#16a34a44', text: '#16a34a' };
  if (ratio < 0.5) return { bg: '#eab30866', text: '#a16207' };
  if (ratio < 0.75) return { bg: '#f97316aa', text: '#c2410c' };
  return { bg: '#dc2626cc', text: '#ffffff' };
}

// ─── Component ───────────────────────────────────────────────────────────────

export default function WasteTracker() {
  const { t } = useTranslation();
  const { showToast } = useToast();
  const { selectedRestaurant, loading: restaurantLoading } = useRestaurant();
  const [entries, setEntries] = useState<WasteEntry[]>([]);
  const [loadingEntries, setLoadingEntries] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [ingredients, setIngredients] = useState<Ingredient[]>([]);
  const [period, setPeriod] = useState<Period>('mois');
  const [search, setSearch] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showTips, setShowTips] = useState(true);

  // AI Analysis state
  const [aiAnalysis, setAiAnalysis] = useState<AiWasteAnalysis | null>(null);
  const [aiLoading, setAiLoading] = useState(false);
  const [showAiPanel, setShowAiPanel] = useState(false);

  // Calendar heatmap
  const [selectedDay, setSelectedDay] = useState<string | null>(null);

  // Reduction Goal
  const [reductionGoal, setReductionGoal] = useState<ReductionGoal | null>(null);
  const [showGoalModal, setShowGoalModal] = useState(false);
  const [goalInput, setGoalInput] = useState('15');

  // Inline form (not modal) state
  const [showInlineForm, setShowInlineForm] = useState(false);
  const [ingredientSearch, setIngredientSearch] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const suggestionsRef = useRef<HTMLDivElement>(null);

  // Photo documentation
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [viewingPhoto, setViewingPhoto] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Weekly report
  const [showWeeklyReport, setShowWeeklyReport] = useState(false);
  const [weeklyReportSending, setWeeklyReportSending] = useState(false);

  // Form state
  const [form, setForm] = useState({
    ingredientId: '',
    ingredientName: '',
    quantity: '',
    reason: 'expired' as WasteReason,
    rootCause: '' as RootCause | '',
    notes: '',
  });

  // ─── Reduction Goal persistence ──────────────────────────────────────────
  useEffect(() => {
    const stored = localStorage.getItem('wasteReductionGoal');
    if (stored) {
      try {
        setReductionGoal(JSON.parse(stored));
      } catch { /* ignore */ }
    }
  }, []);

  function saveGoal() {
    const pct = parseInt(goalInput);
    if (!pct || pct <= 0 || pct > 100) {
      showToast('Entrez un pourcentage valide (1-100)', 'error');
      return;
    }
    const now = new Date();
    const monthKey = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
    // Baseline = last month cost
    const lastMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const lastMonthEnd = new Date(now.getFullYear(), now.getMonth(), 0);
    const lastMonthCost = entries
      .filter(e => {
        const d = new Date(e.date);
        return d >= lastMonthStart && d <= lastMonthEnd;
      })
      .reduce((s, e) => s + e.quantity * e.costPerUnit, 0);

    // If no last month data, use current month as baseline
    const baseline = lastMonthCost > 0 ? lastMonthCost : thisMonthCost;
    const goal: ReductionGoal = { targetPercent: pct, baselineCost: baseline, month: monthKey };
    setReductionGoal(goal);
    localStorage.setItem('wasteReductionGoal', JSON.stringify(goal));
    setShowGoalModal(false);
    showToast(`Objectif fixe : -${pct}% de gaspillage ce mois`, 'success');
  }

  // ─── Data fetching ────────────────────────────────────────────────────────

  async function loadEntries() {
    setLoadingEntries(true);
    try {
      const res = await fetch(`${API_BASE}/waste`, { headers: authHeaders() });
      if (!res.ok) throw new Error('Erreur chargement des pertes');
      const data: WasteEntry[] = await res.json();
      setEntries(data);
    } catch {
      showToast('Impossible de charger les pertes', 'error');
    } finally {
      setLoadingEntries(false);
    }
  }

  async function loadSummary() {
    try {
      const res = await fetch(`${API_BASE}/waste/summary`, { headers: authHeaders() });
      if (res.ok) {
        await res.json() as WasteSummary;
      }
    } catch {
      // non-blocking
    }
  }

  async function loadAiAnalysis() {
    setAiLoading(true);
    try {
      const res = await fetch(`${API_BASE}/ai/waste-analysis`, {
        method: 'POST',
        headers: authHeaders(),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({})) as { error?: string };
        throw new Error(body.error || 'Erreur analyse IA');
      }
      const data: AiWasteAnalysis = await res.json();
      setAiAnalysis(data);
      setShowAiPanel(true);
      showToast('Analyse IA terminee', 'success');
    } catch (err: unknown) {
      showToast(err instanceof Error ? err.message : 'Erreur analyse IA', 'error');
    } finally {
      setAiLoading(false);
    }
  }

  useEffect(() => {
    if (restaurantLoading || !selectedRestaurant) return;
    loadEntries();
    loadSummary();
    fetchIngredients()
      .then(setIngredients)
      .catch(() => showToast('Impossible de charger les ingredients', 'error'));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedRestaurant, restaurantLoading]);

  // Close ingredient suggestions when clicking outside
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (suggestionsRef.current && !suggestionsRef.current.contains(e.target as Node)) {
        setShowSuggestions(false);
      }
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  // ─── Computed data ───────────────────────────────────────────────────────

  const today = new Date();
  const todayStr = today.toISOString().split('T')[0];

  const filteredByPeriod = useMemo(() => {
    const now = new Date();
    return entries.filter(e => {
      const d = new Date(e.date);
      if (period === 'jour') return e.date === todayStr;
      if (period === 'semaine') {
        const weekAgo = new Date(now);
        weekAgo.setDate(weekAgo.getDate() - 7);
        return d >= weekAgo;
      }
      const monthAgo = new Date(now);
      monthAgo.setDate(monthAgo.getDate() - 30);
      return d >= monthAgo;
    });
  }, [entries, period, todayStr]);

  const totalCost = useMemo(() =>
    filteredByPeriod.reduce((sum, e) => sum + e.quantity * e.costPerUnit, 0),
    [filteredByPeriod]
  );

  // This month cost (for the big counter + goal)
  const thisMonthCost = useMemo(() => {
    const now = new Date();
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    return entries
      .filter(e => new Date(e.date) >= monthStart)
      .reduce((s, e) => s + e.quantity * e.costPerUnit, 0);
  }, [entries]);

  // Last month cost (for trend comparison)
  const lastMonthCost = useMemo(() => {
    const now = new Date();
    const lastStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const lastEnd = new Date(now.getFullYear(), now.getMonth(), 0);
    return entries
      .filter(e => { const d = new Date(e.date); return d >= lastStart && d <= lastEnd; })
      .reduce((s, e) => s + e.quantity * e.costPerUnit, 0);
  }, [entries]);

  const monthTrend = lastMonthCost > 0
    ? ((thisMonthCost - lastMonthCost) / lastMonthCost * 100)
    : 0;

  const previousPeriodCost = useMemo(() => {
    const now = new Date();
    let start: Date, end: Date;
    if (period === 'jour') {
      start = new Date(now); start.setDate(start.getDate() - 2);
      end = new Date(now); end.setDate(end.getDate() - 1);
    } else if (period === 'semaine') {
      start = new Date(now); start.setDate(start.getDate() - 14);
      end = new Date(now); end.setDate(end.getDate() - 7);
    } else {
      start = new Date(now); start.setDate(start.getDate() - 60);
      end = new Date(now); end.setDate(end.getDate() - 30);
    }
    return entries
      .filter(e => { const d = new Date(e.date); return d >= start && d < end; })
      .reduce((sum, e) => sum + e.quantity * e.costPerUnit, 0);
  }, [entries, period]);

  const costChange = previousPeriodCost > 0
    ? ((totalCost - previousPeriodCost) / previousPeriodCost * 100)
    : 0;

  const entryCount = filteredByPeriod.length;

  // Animated counter
  const animatedCost = useAnimatedCounter(thisMonthCost);

  // Pie chart: waste by reason
  const pieData = useMemo(() => {
    const byReason: Record<WasteReason, number> = { expired: 0, spoiled: 0, overproduction: 0, damaged: 0, other: 0 };
    filteredByPeriod.forEach(e => { byReason[e.reason] += e.quantity * e.costPerUnit; });
    return (Object.entries(byReason) as [WasteReason, number][])
      .filter(([, v]) => v > 0)
      .map(([reason, value]) => ({
        name: REASON_LABELS[reason],
        value: parseFloat(value.toFixed(2)),
        color: REASON_COLORS[reason],
      }));
  }, [filteredByPeriod]);

  // Waste by Category (horizontal bar)
  const categoryData = useMemo(() => {
    const byCat: Record<string, number> = {};
    filteredByPeriod.forEach(e => {
      const ing = ingredients.find(i => i.id === e.ingredientId);
      const cat = ing?.category || 'Autre';
      byCat[cat] = (byCat[cat] || 0) + e.quantity * e.costPerUnit;
    });
    return Object.entries(byCat)
      .sort((a, b) => b[1] - a[1])
      .map(([category, cost]) => ({ category, cost }));
  }, [filteredByPeriod, ingredients]);

  const maxCategoryCost = categoryData.length > 0 ? categoryData[0].cost : 1;

  // Bar chart: waste trend over time
  const barData = useMemo(() => {
    if (period === 'jour') {
      const days: Record<string, number> = {};
      const now = new Date();
      for (let i = 6; i >= 0; i--) {
        const d = new Date(now); d.setDate(d.getDate() - i);
        const key = d.toLocaleDateString('fr-FR', { weekday: 'short', day: 'numeric' });
        days[key] = 0;
      }
      entries.forEach(e => {
        const d = new Date(e.date);
        const diffDays = Math.floor((now.getTime() - d.getTime()) / 86400000);
        if (diffDays >= 0 && diffDays <= 6) {
          const key = d.toLocaleDateString('fr-FR', { weekday: 'short', day: 'numeric' });
          if (key in days) days[key] += e.quantity * e.costPerUnit;
        }
      });
      return Object.entries(days).map(([name, value]) => ({ name, value: parseFloat(value.toFixed(2)) }));
    }
    if (period === 'semaine') {
      const weeks: Record<string, number> = {};
      for (let i = 3; i >= 0; i--) {
        const d = new Date(); d.setDate(d.getDate() - i * 7);
        const key = `S${getWeekNumber(d)}`;
        weeks[key] = 0;
      }
      entries.forEach(e => {
        const d = new Date(e.date);
        const key = `S${getWeekNumber(d)}`;
        if (key in weeks) weeks[key] += e.quantity * e.costPerUnit;
      });
      return Object.entries(weeks).map(([name, value]) => ({ name, value: parseFloat(value.toFixed(2)) }));
    }
    const days: Record<string, number> = {};
    for (let i = 29; i >= 0; i--) {
      const d = new Date(); d.setDate(d.getDate() - i);
      const key = d.toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit' });
      days[key] = 0;
    }
    entries.forEach(e => {
      const d = new Date(e.date);
      const key = d.toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit' });
      if (key in days) days[key] += e.quantity * e.costPerUnit;
    });
    return Object.entries(days).map(([name, value]) => ({ name, value: parseFloat(value.toFixed(2)) }));
  }, [entries, period]);

  // Top 5 most wasted ingredients (enhanced with % of total)
  const topWasted = useMemo(() => {
    const byIng: Record<string, { cost: number; qty: number; unit: string; ingredientId: number }> = {};
    filteredByPeriod.forEach(e => {
      if (!byIng[e.ingredientName]) byIng[e.ingredientName] = { cost: 0, qty: 0, unit: e.unit, ingredientId: e.ingredientId };
      byIng[e.ingredientName].cost += e.quantity * e.costPerUnit;
      byIng[e.ingredientName].qty += e.quantity;
    });
    return Object.entries(byIng)
      .sort((a, b) => b[1].cost - a[1].cost)
      .slice(0, 5)
      .map(([name, data]) => ({ name, ...data, pctOfTotal: totalCost > 0 ? (data.cost / totalCost * 100) : 0 }));
  }, [filteredByPeriod, totalCost]);

  // Calendar heatmap data
  const calendarData = useMemo(() => {
    const last30 = getLast30Days();
    const byDay: Record<string, number> = {};
    last30.forEach(d => { byDay[d] = 0; });
    entries.forEach(e => {
      if (e.date in byDay) {
        byDay[e.date] += e.quantity * e.costPerUnit;
      }
    });
    const maxVal = Math.max(...Object.values(byDay), 1);
    return { byDay, maxVal, days: last30 };
  }, [entries]);

  // Entries for selected calendar day
  const selectedDayEntries = useMemo(() => {
    if (!selectedDay) return [];
    return entries.filter(e => e.date === selectedDay);
  }, [entries, selectedDay]);

  // Zero waste progress (target: reduce by 20% from month average)
  const monthlyTarget = useMemo(() => {
    const monthEntries = entries.filter(e => {
      const d = new Date(e.date);
      const monthAgo = new Date(); monthAgo.setDate(monthAgo.getDate() - 30);
      return d >= monthAgo;
    });
    const total = monthEntries.reduce((s, e) => s + e.quantity * e.costPerUnit, 0);
    const target = total * 0.80;
    return { actual: total, target, percentage: total > 0 ? Math.min(100, Math.max(0, ((total - target) / total) * 100)) : 0 };
  }, [entries]);

  const zeroWasteScore = Math.max(0, Math.min(100, 100 - monthlyTarget.percentage * 5));

  // Reduction goal progress
  const goalProgress = useMemo(() => {
    if (!reductionGoal) return null;
    const targetCost = reductionGoal.baselineCost * (1 - reductionGoal.targetPercent / 100);
    const currentSaving = reductionGoal.baselineCost - thisMonthCost;
    const requiredSaving = reductionGoal.baselineCost - targetCost;
    const pct = requiredSaving > 0 ? Math.min(100, Math.max(0, (currentSaving / requiredSaving) * 100)) : 0;
    const met = thisMonthCost <= targetCost;
    return { targetCost, currentSaving, requiredSaving, pct, met };
  }, [reductionGoal, thisMonthCost]);

  // AI suggestions
  const suggestions = useMemo(() => generateSuggestions(entries, ingredients), [entries, ingredients]);

  // ── Root Cause Analysis ──────────────────────────────────────────────────
  const rootCauseStats = useMemo(() => {
    const counts: Record<RootCause, { count: number; cost: number }> = {
      perime: { count: 0, cost: 0 },
      surproduction: { count: 0, cost: 0 },
      preparation: { count: 0, cost: 0 },
      stockage: { count: 0, cost: 0 },
      invendu: { count: 0, cost: 0 },
    };
    filteredByPeriod.forEach(e => {
      if (e.rootCause && counts[e.rootCause]) {
        counts[e.rootCause].count += 1;
        counts[e.rootCause].cost += e.quantity * e.costPerUnit;
      }
    });
    const totalWithCause = Object.values(counts).reduce((s, c) => s + c.count, 0);
    return {
      counts,
      totalWithCause,
      topCause: Object.entries(counts).sort((a, b) => b[1].count - a[1].count)[0] as [RootCause, { count: number; cost: number }] | undefined,
    };
  }, [filteredByPeriod]);

  // ── Waste vs Revenue Ratio ───────────────────────────────────────────────
  // Estimate total food cost from all ingredients (sum of all ingredient costs in stock)
  const totalFoodCost = useMemo(() => {
    // Use a rough estimate: sum of all ingredient pricePerUnit * typical quantity
    // For a more accurate version, this would come from an API
    return ingredients.reduce((sum, ing) => sum + (ing.pricePerUnit || 0), 0) * 30; // rough monthly estimate
  }, [ingredients]);

  const wasteRevenueRatio = useMemo(() => {
    if (totalFoodCost <= 0) return null;
    const ratio = (thisMonthCost / totalFoodCost) * 100;
    let status: 'excellent' | 'ok' | 'problematic';
    let color: string;
    if (ratio < 3) { status = 'excellent'; color = '#16a34a'; }
    else if (ratio <= 5) { status = 'ok'; color = '#d97706'; }
    else { status = 'problematic'; color = '#dc2626'; }
    return { ratio, status, color };
  }, [thisMonthCost, totalFoodCost]);

  // ── Weekly Report Generation ─────────────────────────────────────────────
  const weeklyReport = useMemo((): WeeklyReport | null => {
    const now = new Date();
    // Get last Monday
    const dayOfWeek = now.getDay();
    const lastMonday = new Date(now);
    lastMonday.setDate(now.getDate() - ((dayOfWeek + 6) % 7));
    lastMonday.setHours(0, 0, 0, 0);
    const lastSunday = new Date(lastMonday);
    lastSunday.setDate(lastMonday.getDate() + 6);

    // Previous week
    const prevMonday = new Date(lastMonday);
    prevMonday.setDate(prevMonday.getDate() - 7);
    const prevSunday = new Date(lastMonday);
    prevSunday.setDate(prevSunday.getDate() - 1);

    const thisWeekEntries = entries.filter(e => {
      const d = new Date(e.date);
      return d >= lastMonday && d <= lastSunday;
    });
    const prevWeekEntries = entries.filter(e => {
      const d = new Date(e.date);
      return d >= prevMonday && d <= prevSunday;
    });

    const thisWeekCost = thisWeekEntries.reduce((s, e) => s + e.quantity * e.costPerUnit, 0);
    const prevWeekCost = prevWeekEntries.reduce((s, e) => s + e.quantity * e.costPerUnit, 0);
    const trend = prevWeekCost > 0 ? ((thisWeekCost - prevWeekCost) / prevWeekCost * 100) : 0;

    // Top 3
    const byIng: Record<string, number> = {};
    thisWeekEntries.forEach(e => {
      byIng[e.ingredientName] = (byIng[e.ingredientName] || 0) + e.quantity * e.costPerUnit;
    });
    const top3 = Object.entries(byIng)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)
      .map(([name, cost]) => ({ name, cost }));

    // Generate relevant suggestions
    const reportSuggestions: string[] = [];
    if (trend > 0) {
      reportSuggestions.push(`Le gaspillage a augmente de ${trend.toFixed(1)}% — revisez les quantites commandees.`);
    } else if (trend < 0) {
      reportSuggestions.push(`Le gaspillage a diminue de ${Math.abs(trend).toFixed(1)}% — continuez vos efforts !`);
    }
    if (top3.length > 0) {
      reportSuggestions.push(`Priorite de la semaine : reduire les pertes de ${top3[0].name} (${formatEuro(top3[0].cost)}).`);
    }
    reportSuggestions.push('Verifiez les DLC de tous les produits frais chaque lundi matin.');

    return {
      weekStart: lastMonday.toISOString().split('T')[0],
      weekEnd: lastSunday.toISOString().split('T')[0],
      totalCost: thisWeekCost,
      entryCount: thisWeekEntries.length,
      top3,
      trendVsLastWeek: trend,
      suggestions: reportSuggestions,
      generatedAt: now.toISOString(),
    };
  }, [entries]);

  // Filtered ingredient suggestions for autocomplete
  const filteredIngredients = useMemo(() => {
    if (!ingredientSearch.trim()) return ingredients.slice(0, 20);
    const s = ingredientSearch.toLowerCase();
    return ingredients
      .filter(i => i.name.toLowerCase().includes(s))
      .slice(0, 10);
  }, [ingredients, ingredientSearch]);

  // Recent entries
  const recentEntries = useMemo(() => {
    let result = [...filteredByPeriod].sort((a, b) => b.date.localeCompare(a.date) || b.id - a.id);
    if (search) {
      const s = search.toLowerCase();
      result = result.filter(e =>
        e.ingredientName.toLowerCase().includes(s) || REASON_LABELS[e.reason].toLowerCase().includes(s)
      );
    }
    return result.slice(0, 20);
  }, [filteredByPeriod, search]);

  // ─── Handlers ──────────────────────────────────────────────────────────────

  function selectIngredient(ing: Ingredient) {
    setForm(f => ({ ...f, ingredientId: String(ing.id), ingredientName: ing.name }));
    setIngredientSearch(ing.name);
    setShowSuggestions(false);
  }

  async function handleAddWaste() {
    const ing = ingredients.find(i => i.id === parseInt(form.ingredientId));
    if (!ing) { showToast('Selectionnez un ingredient', 'error'); return; }
    const qty = parseFloat(form.quantity);
    if (!qty || qty <= 0) { showToast('Quantite invalide', 'error'); return; }

    setSubmitting(true);
    try {
      const res = await fetch(`${API_BASE}/waste`, {
        method: 'POST',
        headers: authHeaders(),
        body: JSON.stringify({
          ingredientId: ing.id,
          ingredientName: ing.name,
          quantity: qty,
          unit: ing.unit,
          costPerUnit: ing.pricePerUnit,
          reason: form.reason,
          notes: form.notes,
          date: todayStr,
        }),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({})) as { error?: string };
        throw new Error(body.error || 'Erreur lors de la declaration');
      }
      setForm({ ingredientId: '', ingredientName: '', quantity: '', reason: 'expired', rootCause: '', notes: '' }); setPhotoPreview(null);
      setIngredientSearch('');
      setShowAddModal(false);
      setShowInlineForm(false);
      showToast(`Perte declaree : ${qty} ${ing.unit} de ${ing.name} (${formatEuro((qty / getUnitDivisor(ing.unit)) * ing.pricePerUnit)})`, 'success');
      await loadEntries();
    } catch (err: unknown) {
      showToast(err instanceof Error ? err.message : 'Erreur declaration', 'error');
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDeleteEntry(id: number) {
    try {
      const res = await fetch(`${API_BASE}/waste/${id}`, {
        method: 'DELETE',
        headers: authHeaders(),
      });
      if (!res.ok) throw new Error('Erreur suppression');
      showToast('Declaration supprimee', 'success');
      await loadEntries();
    } catch {
      showToast('Impossible de supprimer la declaration', 'error');
    }
  }

  // ─── Photo Capture Handler ─────────────────────────────────────────────────
  function handlePhotoCapture(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      showToast('Photo trop volumineuse (max 5 Mo)', 'error');
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      const base64 = reader.result as string;
      setPhotoPreview(base64);
    };
    reader.readAsDataURL(file);
  }

  // ─── Weekly Report Send ───────────────────────────────────────────────────
  async function handleSendWeeklyReport() {
    if (!weeklyReport) return;
    setWeeklyReportSending(true);
    try {
      const res = await fetch(`${API_BASE}/waste/weekly-report`, {
        method: 'POST',
        headers: authHeaders(),
        body: JSON.stringify(weeklyReport),
      });
      if (!res.ok) {
        // If endpoint doesn't exist yet, show a success preview anyway
        showToast('Rapport hebdomadaire genere. L\'envoi par email sera bientot disponible.', 'success');
      } else {
        showToast('Rapport hebdomadaire envoye par email !', 'success');
      }
    } catch {
      showToast('Rapport genere localement. Envoi email bientot disponible.', 'success');
    } finally {
      setWeeklyReportSending(false);
    }
  }

  // ─── Render ────────────────────────────────────────────────────────────────

  const periodLabels: Record<Period, string> = { jour: t('wasteTracker.today'), semaine: t('wasteTracker.thisWeek'), mois: t('wasteTracker.thisMonth') };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#111111] dark:text-white flex items-center gap-3">
            <Trash2 className="w-7 h-7 text-red-500" />
            {t('wasteTracker.title')}
          </h1>
          <p className="text-sm text-[#9CA3AF] dark:text-[#737373] mt-1">
            {t('wasteTracker.subtitle')}
          </p>
        </div>
        <div className="flex items-center gap-3 flex-wrap">
          {/* Period selector */}
          <div className="flex rounded-lg border border-[#E5E7EB] dark:border-[#1A1A1A] overflow-hidden">
            {(['jour', 'semaine', 'mois'] as Period[]).map(p => (
              <button
                key={p}
                onClick={() => setPeriod(p)}
                className={`px-3 py-1.5 text-sm font-medium transition-colors ${
                  period === p
                    ? 'bg-[#111111] dark:bg-white text-white dark:text-black'
                    : 'bg-white dark:bg-[#0A0A0A] text-[#6B7280] dark:text-[#A3A3A3] hover:bg-[#F9FAFB] dark:hover:bg-[#171717]'
                }`}
              >
                {p === 'jour' ? t('wasteTracker.day') : p === 'semaine' ? t('wasteTracker.week') : t('wasteTracker.month')}
              </button>
            ))}
          </div>
          <button
            onClick={loadAiAnalysis}
            disabled={aiLoading}
            className="flex items-center gap-2 px-4 py-2 bg-[#111111] dark:bg-white text-white dark:text-black hover:bg-[#333333] dark:hover:bg-[#E5E5E5] rounded-lg text-sm font-semibold transition-colors disabled:opacity-60"
          >
            {aiLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Brain className="w-4 h-4" />}
            Analyse IA
          </button>
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-500 text-white rounded-lg text-sm font-semibold transition-colors"
          >
            <Plus className="w-4 h-4" />
            {t('wasteTracker.declareWaste')}
          </button>
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════════════════════
          1. BIG ANIMATED WASTE COST COUNTER
          ═══════════════════════════════════════════════════════════════════════ */}
      <div className="bg-white dark:bg-[#0A0A0A] rounded-2xl border border-[#E5E7EB] dark:border-[#1A1A1A] p-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-48 h-48 opacity-5">
          <Flame className="w-full h-full text-red-600" />
        </div>
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-2">
            <Flame className="w-5 h-5 text-red-500" />
            <span className="text-sm font-semibold text-[#9CA3AF] dark:text-[#737373] uppercase tracking-wider">
              Cout total gaspillage -- ce mois
            </span>
          </div>
          <div className="flex items-end gap-4 flex-wrap">
            <span
              className="text-5xl sm:text-6xl font-black tabular-nums"
              style={{ color: '#dc2626' }}
            >
              {animatedCost.toLocaleString('fr-FR', { style: 'currency', currency: 'EUR', minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </span>
            {lastMonthCost > 0 && (
              <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-bold ${
                monthTrend > 0
                  ? 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300'
                  : 'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300'
              }`}>
                {monthTrend > 0 ? (
                  <ArrowUpRight className="w-4 h-4" />
                ) : (
                  <ArrowDownRight className="w-4 h-4" />
                )}
                {monthTrend > 0 ? '+' : ''}{monthTrend.toFixed(1)}% vs mois dernier
              </div>
            )}
          </div>
          <p className="text-sm text-[#9CA3AF] dark:text-[#737373] mt-2">
            Mois dernier : {formatEuro(lastMonthCost)} | Ecart : {formatEuro(thisMonthCost - lastMonthCost)}
          </p>

          {/* Target comparison */}
          {reductionGoal ? (
            <div className="mt-3 flex items-center gap-3 flex-wrap">
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#F9FAFB] dark:bg-[#171717] border border-[#E5E7EB] dark:border-[#1A1A1A]">
                <Target className="w-4 h-4 text-green-500" />
                <span className="text-sm font-medium text-[#374151] dark:text-[#D4D4D4]">
                  Objectif : -{reductionGoal.targetPercent}% vs mois dernier
                </span>
                <span className="text-sm font-bold text-green-600 dark:text-green-400">
                  ({formatEuro(goalProgress?.targetCost || 0)})
                </span>
              </div>
              {goalProgress && (
                <span className={`text-sm font-bold ${goalProgress.met ? 'text-green-600' : 'text-red-500'}`}>
                  {goalProgress.met ? 'Objectif atteint !' : `Reste ${formatEuro(thisMonthCost - (goalProgress.targetCost || 0))} a economiser`}
                </span>
              )}
            </div>
          ) : (
            <div className="mt-3 flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#F9FAFB] dark:bg-[#171717] border border-[#E5E7EB] dark:border-[#1A1A1A] w-fit">
              <Target className="w-4 h-4 text-[#9CA3AF]" />
              <span className="text-sm text-[#9CA3AF] dark:text-[#737373]">
                Objectif : -15% vs mois dernier (recommande)
              </span>
              <button
                onClick={() => { setGoalInput('15'); setShowGoalModal(true); }}
                className="text-sm font-semibold text-[#111111] dark:text-white underline ml-1"
              >
                Definir
              </button>
            </div>
          )}
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="bg-white dark:bg-[#0A0A0A] rounded-2xl border border-[#E5E7EB] dark:border-[#1A1A1A] p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-[#9CA3AF] dark:text-[#737373]">{t('wasteTracker.totalLosses')}</span>
            <div className="p-2 rounded-lg bg-red-50 dark:bg-red-900/30">
              <TrendingDown className="w-4 h-4 text-red-500" />
            </div>
          </div>
          <div className="text-2xl font-bold text-[#111111] dark:text-white">{formatEuro(totalCost)}</div>
          <div className="flex items-center gap-1 mt-1">
            {costChange !== 0 && (
              <span className={`text-xs font-medium flex items-center gap-0.5 ${
                costChange > 0 ? 'text-red-500' : 'text-green-500'
              }`}>
                {costChange > 0 ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                {Math.abs(costChange).toFixed(1)}%
              </span>
            )}
            <span className="text-xs text-[#9CA3AF] dark:text-[#737373]">{periodLabels[period]}</span>
          </div>
        </div>

        <div className="bg-white dark:bg-[#0A0A0A] rounded-2xl border border-[#E5E7EB] dark:border-[#1A1A1A] p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-[#9CA3AF] dark:text-[#737373]">{t('wasteTracker.incidents')}</span>
            <div className="p-2 rounded-lg bg-amber-50 dark:bg-amber-900/30">
              <AlertTriangle className="w-4 h-4 text-amber-500" />
            </div>
          </div>
          <div className="text-2xl font-bold text-[#111111] dark:text-white">{entryCount}</div>
          <span className="text-xs text-[#9CA3AF] dark:text-[#737373]">{t('wasteTracker.declarations')}</span>
        </div>

        <div className="bg-white dark:bg-[#0A0A0A] rounded-2xl border border-[#E5E7EB] dark:border-[#1A1A1A] p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-[#9CA3AF] dark:text-[#737373]">{t('wasteTracker.avgCost')}</span>
            <div className="p-2 rounded-lg bg-violet-50 dark:bg-violet-900/30">
              <BarChart3 className="w-4 h-4 text-violet-500" />
            </div>
          </div>
          <div className="text-2xl font-bold text-[#111111] dark:text-white">
            {entryCount > 0 ? formatEuro(totalCost / entryCount) : '--'}
          </div>
          <span className="text-xs text-[#9CA3AF] dark:text-[#737373]">{t('wasteTracker.perIncident')}</span>
        </div>

        {/* Waste vs Revenue Ratio (NEW) */}
        <div className="bg-white dark:bg-[#0A0A0A] rounded-2xl border border-[#E5E7EB] dark:border-[#1A1A1A] p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-[#9CA3AF] dark:text-[#737373]">Ratio gaspillage</span>
            <div className="p-2 rounded-lg" style={{ backgroundColor: wasteRevenueRatio ? `${wasteRevenueRatio.color}15` : '#f3f4f6' }}>
              <Percent className="w-4 h-4" style={{ color: wasteRevenueRatio?.color || '#9ca3af' }} />
            </div>
          </div>
          <div className="text-2xl font-bold text-[#111111] dark:text-white">
            {wasteRevenueRatio ? `${wasteRevenueRatio.ratio.toFixed(1)}%` : '--'}
          </div>
          {wasteRevenueRatio && (
            <div className="flex items-center gap-1.5 mt-1">
              <span
                className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-bold uppercase"
                style={{
                  backgroundColor: `${wasteRevenueRatio.color}20`,
                  color: wasteRevenueRatio.color,
                }}
              >
                {wasteRevenueRatio.status === 'excellent' ? 'Excellent' :
                 wasteRevenueRatio.status === 'ok' ? 'Acceptable' : 'Problematique'}
              </span>
              <span className="text-[10px] text-[#9CA3AF] dark:text-[#737373]">du food cost</span>
            </div>
          )}
        </div>

        <div className="bg-white dark:bg-[#0A0A0A] rounded-2xl border border-[#E5E7EB] dark:border-[#1A1A1A] p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-[#9CA3AF] dark:text-[#737373]">{t('wasteTracker.antiWasteScore')}</span>
            <div className="p-2 rounded-lg bg-green-50 dark:bg-green-900/30">
              <Leaf className="w-4 h-4 text-green-500" />
            </div>
          </div>
          <div className="text-2xl font-bold text-[#111111] dark:text-white">{zeroWasteScore.toFixed(0)}/100</div>
          <span className="text-xs text-[#9CA3AF] dark:text-[#737373]">{t('wasteTracker.zeroWasteGoal')}</span>
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════════════════════
          WASTE vs REVENUE BENCHMARK — Industry Standards
          ═══════════════════════════════════════════════════════════════════════ */}
      <div className="bg-white dark:bg-[#0A0A0A] rounded-2xl border border-[#E5E7EB] dark:border-[#1A1A1A] p-5">
        <div className="flex items-center gap-2 mb-4">
          <Percent className="w-5 h-5 text-[#111111] dark:text-white" />
          <h2 className="font-semibold text-[#1F2937] dark:text-white">Ratio gaspillage / food cost</h2>
          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#111111] dark:bg-white text-white dark:text-black uppercase">
            Benchmark
          </span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            { label: 'Excellent', range: '< 3%', color: '#16a34a', threshold: 3 },
            { label: 'Acceptable', range: '3% - 5%', color: '#d97706', threshold: 5 },
            { label: 'Problematique', range: '> 5%', color: '#dc2626', threshold: 100 },
          ].map(benchmark => {
            const isActive = wasteRevenueRatio
              ? (benchmark.threshold === 3 && wasteRevenueRatio.ratio < 3) ||
                (benchmark.threshold === 5 && wasteRevenueRatio.ratio >= 3 && wasteRevenueRatio.ratio <= 5) ||
                (benchmark.threshold === 100 && wasteRevenueRatio.ratio > 5)
              : false;
            return (
              <div
                key={benchmark.label}
                className={`p-4 rounded-xl border-2 transition-all ${
                  isActive
                    ? 'border-[#111111] dark:border-white bg-[#F9FAFB] dark:bg-[#171717] scale-[1.02]'
                    : 'border-[#E5E7EB] dark:border-[#1A1A1A]'
                }`}
              >
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: benchmark.color }} />
                  <span className="text-sm font-bold text-[#111111] dark:text-white">{benchmark.label}</span>
                  {isActive && <CheckCircle className="w-4 h-4 ml-auto" style={{ color: benchmark.color }} />}
                </div>
                <div className="text-2xl font-black" style={{ color: benchmark.color }}>
                  {benchmark.range}
                </div>
                <p className="text-xs text-[#9CA3AF] dark:text-[#737373] mt-1">
                  {benchmark.label === 'Excellent' && 'Gestion optimale des stocks et productions'}
                  {benchmark.label === 'Acceptable' && 'Marge d\'amelioration identifiable'}
                  {benchmark.label === 'Problematique' && 'Action immediate requise sur les processus'}
                </p>
              </div>
            );
          })}
        </div>
        {wasteRevenueRatio && (
          <div className="mt-4 pt-4 border-t border-[#E5E7EB] dark:border-[#1A1A1A]">
            <div className="flex items-center gap-3">
              <span className="text-sm text-[#9CA3AF] dark:text-[#737373]">Votre ratio actuel :</span>
              <span className="text-lg font-black" style={{ color: wasteRevenueRatio.color }}>
                {wasteRevenueRatio.ratio.toFixed(1)}%
              </span>
              <div className="flex-1 h-2 bg-[#F3F4F6] dark:bg-[#171717] rounded-full overflow-hidden relative">
                {/* Green zone */}
                <div className="absolute inset-y-0 left-0 bg-green-200 dark:bg-green-900/50" style={{ width: '30%' }} />
                {/* Amber zone */}
                <div className="absolute inset-y-0 bg-amber-200 dark:bg-amber-900/50" style={{ left: '30%', width: '20%' }} />
                {/* Red zone */}
                <div className="absolute inset-y-0 bg-red-200 dark:bg-red-900/50" style={{ left: '50%', right: 0 }} />
                {/* Marker */}
                <div
                  className="absolute inset-y-0 w-1 bg-[#111111] dark:bg-white rounded-full z-10"
                  style={{ left: `${Math.min(wasteRevenueRatio.ratio * 10, 100)}%` }}
                />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ═══════════════════════════════════════════════════════════════════════
          3. DAILY WASTE LOG (inline form)
          ═══════════════════════════════════════════════════════════════════════ */}
      <div className="bg-white dark:bg-[#0A0A0A] rounded-2xl border border-[#E5E7EB] dark:border-[#1A1A1A] p-5">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-[#111111] dark:text-white" />
            <h2 className="font-semibold text-[#1F2937] dark:text-white">Journal de gaspillage quotidien</h2>
          </div>
          <button
            onClick={() => setShowInlineForm(!showInlineForm)}
            className="flex items-center gap-2 px-3 py-1.5 bg-red-600 hover:bg-red-500 text-white rounded-lg text-sm font-semibold transition-colors"
          >
            <Plus className="w-4 h-4" />
            Ajouter
          </button>
        </div>

        {showInlineForm && (
          <div className="bg-[#F9FAFB] dark:bg-[#171717] rounded-xl p-4 mb-4 border border-[#E5E7EB] dark:border-[#1A1A1A] space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {/* Ingredient autocomplete */}
              <div className="relative" ref={suggestionsRef}>
                <label className="block text-xs font-semibold text-[#9CA3AF] dark:text-[#737373] mb-1 uppercase">Ingredient</label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9CA3AF] dark:text-[#737373]" />
                  <input
                    type="text"
                    value={ingredientSearch}
                    onChange={e => {
                      setIngredientSearch(e.target.value);
                      setShowSuggestions(true);
                      setForm(f => ({ ...f, ingredientId: '', ingredientName: '' }));
                    }}
                    onFocus={() => setShowSuggestions(true)}
                    placeholder="Rechercher un ingredient..."
                    className="w-full pl-9 pr-3 py-2 border border-[#D1D5DB] dark:border-[#1A1A1A] rounded-lg bg-white dark:bg-[#0A0A0A] text-[#1F2937] dark:text-white text-sm focus:ring-2 focus:ring-[#111111] dark:focus:ring-white"
                  />
                </div>
                {showSuggestions && filteredIngredients.length > 0 && (
                  <div className="absolute z-20 w-full mt-1 bg-white dark:bg-[#0A0A0A] border border-[#E5E7EB] dark:border-[#1A1A1A] rounded-lg shadow-lg max-h-48 overflow-y-auto">
                    {filteredIngredients.map(ing => (
                      <button
                        key={ing.id}
                        onClick={() => selectIngredient(ing)}
                        className="w-full text-left px-3 py-2 text-sm hover:bg-[#F3F4F6] dark:hover:bg-[#171717] transition-colors flex items-center justify-between"
                      >
                        <span className="text-[#1F2937] dark:text-white">{ing.name}</span>
                        <span className="text-xs text-[#9CA3AF] dark:text-[#737373]">{formatEuro(ing.pricePerUnit)}/{ing.unit}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Quantity */}
              <div>
                <label className="block text-xs font-semibold text-[#9CA3AF] dark:text-[#737373] mb-1 uppercase">Quantite</label>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    value={form.quantity}
                    onChange={e => setForm(f => ({ ...f, quantity: e.target.value }))}
                    placeholder="0.00"
                    className="flex-1 px-3 py-2 border border-[#D1D5DB] dark:border-[#1A1A1A] rounded-lg bg-white dark:bg-[#0A0A0A] text-[#1F2937] dark:text-white text-sm focus:ring-2 focus:ring-[#111111] dark:focus:ring-white"
                  />
                  {form.ingredientId && (
                    <span className="text-xs text-[#9CA3AF] dark:text-[#737373] font-medium">
                      {ingredients.find(i => i.id === parseInt(form.ingredientId))?.unit}
                    </span>
                  )}
                </div>
              </div>

              {/* Reason dropdown */}
              <div>
                <label className="block text-xs font-semibold text-[#9CA3AF] dark:text-[#737373] mb-1 uppercase">Raison</label>
                <select
                  value={form.reason}
                  onChange={e => setForm(f => ({ ...f, reason: e.target.value as WasteReason }))}
                  className="w-full px-3 py-2 border border-[#D1D5DB] dark:border-[#1A1A1A] rounded-lg bg-white dark:bg-[#0A0A0A] text-[#1F2937] dark:text-white text-sm focus:ring-2 focus:ring-[#111111] dark:focus:ring-white"
                >
                  {(Object.entries(REASON_LABELS) as [WasteReason, string][]).map(([key, label]) => (
                    <option key={key} value={key}>{label}</option>
                  ))}
                </select>
              </div>

              {/* Notes */}
              <div>
                <label className="block text-xs font-semibold text-[#9CA3AF] dark:text-[#737373] mb-1 uppercase">Note (optionnel)</label>
                <input
                  type="text"
                  value={form.notes}
                  onChange={e => setForm(f => ({ ...f, notes: e.target.value }))}
                  placeholder="Details supplementaires..."
                  className="w-full px-3 py-2 border border-[#D1D5DB] dark:border-[#1A1A1A] rounded-lg bg-white dark:bg-[#0A0A0A] text-[#1F2937] dark:text-white text-sm focus:ring-2 focus:ring-[#111111] dark:focus:ring-white"
                />
              </div>
            </div>

            {/* Root Cause + Photo row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* Root Cause Analysis dropdown */}
              <div>
                <label className="block text-xs font-semibold text-[#9CA3AF] dark:text-[#737373] mb-1 uppercase">
                  Cause racine (HACCP)
                </label>
                <select
                  value={form.rootCause}
                  onChange={e => setForm(f => ({ ...f, rootCause: e.target.value as RootCause }))}
                  className="w-full px-3 py-2 border border-[#D1D5DB] dark:border-[#1A1A1A] rounded-lg bg-white dark:bg-[#0A0A0A] text-[#1F2937] dark:text-white text-sm focus:ring-2 focus:ring-[#111111] dark:focus:ring-white"
                >
                  <option value="">-- Selectionnez --</option>
                  {(Object.entries(ROOT_CAUSE_LABELS) as [RootCause, string][]).map(([key, label]) => (
                    <option key={key} value={key}>{label}</option>
                  ))}
                </select>
              </div>

              {/* Photo Documentation */}
              <div>
                <label className="block text-xs font-semibold text-[#9CA3AF] dark:text-[#737373] mb-1 uppercase">
                  Photo (HACCP)
                </label>
                <div className="flex items-center gap-2">
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    capture="environment"
                    onChange={handlePhotoCapture}
                    className="hidden"
                  />
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="flex items-center gap-2 px-3 py-2 border border-[#D1D5DB] dark:border-[#1A1A1A] rounded-lg bg-white dark:bg-[#0A0A0A] text-[#6B7280] dark:text-[#A3A3A3] text-sm hover:bg-[#F9FAFB] dark:hover:bg-[#171717] transition-colors w-full"
                  >
                    <Camera className="w-4 h-4" />
                    {photoPreview ? 'Photo ajoutee' : 'Prendre une photo'}
                  </button>
                  {photoPreview && (
                    <div className="relative w-10 h-10 rounded-lg overflow-hidden border border-[#E5E7EB] dark:border-[#1A1A1A] flex-shrink-0">
                      <img src={photoPreview} alt="preview" className="w-full h-full object-cover" />
                      <button
                        onClick={() => setPhotoPreview(null)}
                        className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center"
                      >
                        <X className="w-2.5 h-2.5 text-white" />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Cost preview + save */}
            <div className="flex items-center justify-between flex-wrap gap-3">
              {form.ingredientId && form.quantity && (() => {
                const ing = ingredients.find(i => i.id === parseInt(form.ingredientId));
                return ing ? (
                  <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800/40 rounded-lg px-4 py-2 text-sm">
                    <span className="text-[#6B7280] dark:text-[#A3A3A3]">Cout estime : </span>
                    <span className="font-bold text-red-600 dark:text-red-400">
                      {formatEuro((parseFloat(form.quantity || '0') / getUnitDivisor(ing.unit)) * ing.pricePerUnit)}
                    </span>
                  </div>
                ) : null;
              })()}
              <div className="flex gap-2 ml-auto">
                <button
                  onClick={() => {
                    setShowInlineForm(false);
                    setForm({ ingredientId: '', ingredientName: '', quantity: '', reason: 'expired', rootCause: '', notes: '' }); setPhotoPreview(null);
                    setIngredientSearch('');
                  }}
                  className="px-4 py-2 text-sm font-medium text-[#6B7280] dark:text-[#A3A3A3] hover:bg-[#F3F4F6] dark:hover:bg-[#0A0A0A] rounded-lg transition-colors"
                >
                  Annuler
                </button>
                <button
                  onClick={handleAddWaste}
                  disabled={submitting || !form.ingredientId || !form.quantity}
                  className="flex items-center gap-2 px-5 py-2 bg-red-600 hover:bg-red-500 text-white rounded-lg text-sm font-semibold transition-colors disabled:opacity-50"
                >
                  {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                  Enregistrer la perte
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ═══════════════════════════════════════════════════════════════════════
          4. WASTE CALENDAR HEATMAP (30 days) — Premium HeatmapGrid
          ═══════════════════════════════════════════════════════════════════════ */}
      <div className="bg-white dark:bg-[#0A0A0A] rounded-2xl border border-[#E5E7EB] dark:border-[#1A1A1A] p-5">
        <div className="flex items-center gap-2 mb-4">
          <CalendarDays className="w-5 h-5 text-[#111111] dark:text-white" />
          <h2 className="font-semibold text-[#1F2937] dark:text-white">Calendrier du gaspillage -- 35 derniers jours</h2>
        </div>

        <HeatmapGrid
          data={calendarData.days.map(day => ({
            date: day,
            value: calendarData.byDay[day] || 0,
          }))}
          colorScale={['#16a34a11', '#16a34a44', '#eab30866', '#f97316aa', '#dc2626cc']}
          cellSize={44}
          cellGap={4}
          showLabels={true}
          formatTooltip={(date, value) => {
            const d = new Date(date);
            return `${d.toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' })} : ${formatEuro(value)}`;
          }}
          onCellClick={(date) => setSelectedDay(selectedDay === date ? null : date)}
          selectedDate={selectedDay}
        />

        {/* Day detail overlay */}
        {selectedDay && (
          <div className="mt-4 bg-[#F9FAFB] dark:bg-[#171717] rounded-xl p-4 border border-[#E5E7EB] dark:border-[#1A1A1A]">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold text-[#1F2937] dark:text-white">
                {new Date(selectedDay).toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
              </h3>
              <span className="text-lg font-bold text-red-600 dark:text-red-400">
                {formatEuro(calendarData.byDay[selectedDay] || 0)}
              </span>
            </div>
            {selectedDayEntries.length > 0 ? (
              <div className="space-y-2">
                {selectedDayEntries.map(e => (
                  <div key={e.id} className="flex items-center justify-between text-sm py-1.5 px-3 rounded-lg bg-white dark:bg-[#0A0A0A] border border-[#E5E7EB] dark:border-[#1A1A1A]">
                    <div className="flex items-center gap-3">
                      <span className="font-medium text-[#1F2937] dark:text-white">{e.ingredientName}</span>
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${REASON_BADGE[e.reason]}`}>
                        {REASON_LABELS[e.reason]}
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-[#9CA3AF] dark:text-[#737373]">{e.quantity} {e.unit}</span>
                      <span className="font-semibold text-red-600 dark:text-red-400">{formatEuro(e.quantity * e.costPerUnit)}</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-[#9CA3AF] dark:text-[#737373]">Aucune perte enregistree ce jour</p>
            )}
          </div>
        )}
      </div>

      {/* ═══════════════════════════════════════════════════════════════════════
          2. WASTE BY CATEGORY (horizontal bar chart) + 5. TOP 5 MOST WASTED
          ═══════════════════════════════════════════════════════════════════════ */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Waste by Category */}
        <div className="bg-white dark:bg-[#0A0A0A] rounded-2xl border border-[#E5E7EB] dark:border-[#1A1A1A] p-5">
          <div className="flex items-center gap-2 mb-4">
            <Package className="w-5 h-5 text-[#111111] dark:text-white" />
            <h2 className="font-semibold text-[#1F2937] dark:text-white">Gaspillage par categorie</h2>
          </div>
          {categoryData.length > 0 ? (
            <CSSBarChart
              data={categoryData.map(item => ({
                label: item.category,
                value: item.cost,
                color: getCategoryColor(item.category),
                suffix: ' EUR',
              }))}
              animated={true}
              sorted={true}
              showValues={true}
              formatValue={(v) => v.toFixed(2)}
            />
          ) : (
            <p className="text-sm text-[#9CA3AF] dark:text-[#737373]">{t('wasteTracker.noDataForPeriod')}</p>
          )}
        </div>

        {/* Top 5 most wasted (enhanced with % of total) */}
        <div className="bg-white dark:bg-[#0A0A0A] rounded-2xl border border-[#E5E7EB] dark:border-[#1A1A1A] p-5">
          <div className="flex items-center gap-2 mb-4">
            <ArrowDown className="w-5 h-5 text-red-500" />
            <h2 className="font-semibold text-[#1F2937] dark:text-white">{t('wasteTracker.top5Wasted')}</h2>
          </div>
          {topWasted.length > 0 ? (
            <div className="space-y-3">
              {topWasted.map((item, i) => {
                const maxCost = topWasted[0].cost;
                const pct = (item.cost / maxCost) * 100;
                return (
                  <div key={item.name}>
                    <div className="flex items-center justify-between text-sm mb-1">
                      <span className="font-medium text-[#374151] dark:text-white flex items-center gap-2">
                        <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-red-600 text-white text-[10px] font-bold">
                          {i + 1}
                        </span>
                        {item.name}
                      </span>
                      <div className="flex items-center gap-3">
                        <span className="text-xs text-[#9CA3AF] dark:text-[#737373]">
                          {item.pctOfTotal.toFixed(1)}% du total
                        </span>
                        <span className="font-bold text-red-600 dark:text-red-400">{formatEuro(item.cost)}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="flex-1 h-3 bg-[#F3F4F6] dark:bg-[#171717] rounded-full overflow-hidden">
                        <div
                          className="h-full bg-red-500 rounded-full transition-all duration-500"
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                      <span className="text-xs text-[#9CA3AF] dark:text-[#737373] w-20 text-right">
                        {item.qty.toFixed(1)} {item.unit}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="text-sm text-[#9CA3AF] dark:text-[#737373]">{t('wasteTracker.noDataForPeriod')}</p>
          )}
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════════════════════
          ROOT CAUSE ANALYSIS — Track which cause is most frequent
          ═══════════════════════════════════════════════════════════════════════ */}
      <div className="bg-white dark:bg-[#0A0A0A] rounded-2xl border border-[#E5E7EB] dark:border-[#1A1A1A] p-5">
        <div className="flex items-center gap-2 mb-4">
          <ShieldCheck className="w-5 h-5 text-[#111111] dark:text-white" />
          <h2 className="font-semibold text-[#1F2937] dark:text-white">Analyse des causes racines</h2>
          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300 uppercase">
            HACCP
          </span>
        </div>

        {rootCauseStats.totalWithCause > 0 ? (
          <div className="space-y-4">
            {/* Most frequent cause highlight */}
            {rootCauseStats.topCause && (
              <div className="bg-[#F9FAFB] dark:bg-[#171717] rounded-xl p-4 border border-[#E5E7EB] dark:border-[#1A1A1A]">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-xl" style={{ backgroundColor: `${ROOT_CAUSE_COLORS[rootCauseStats.topCause[0]]}20` }}>
                    <AlertTriangle className="w-5 h-5" style={{ color: ROOT_CAUSE_COLORS[rootCauseStats.topCause[0]] }} />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-[#111111] dark:text-white">
                      Cause n.1 : {ROOT_CAUSE_LABELS[rootCauseStats.topCause[0]]}
                    </p>
                    <p className="text-xs text-[#9CA3AF] dark:text-[#737373]">
                      {rootCauseStats.topCause[1].count} incidents | {formatEuro(rootCauseStats.topCause[1].cost)} de pertes
                    </p>
                  </div>
                  <div className="ml-auto text-right">
                    <span className="text-2xl font-black" style={{ color: ROOT_CAUSE_COLORS[rootCauseStats.topCause[0]] }}>
                      {rootCauseStats.totalWithCause > 0
                        ? ((rootCauseStats.topCause[1].count / rootCauseStats.totalWithCause) * 100).toFixed(0)
                        : 0}%
                    </span>
                    <p className="text-[10px] text-[#9CA3AF] dark:text-[#737373]">des incidents</p>
                  </div>
                </div>
              </div>
            )}

            {/* All root causes breakdown */}
            <div className="grid grid-cols-1 sm:grid-cols-5 gap-3">
              {(Object.entries(rootCauseStats.counts) as [RootCause, { count: number; cost: number }][])
                .sort((a, b) => b[1].count - a[1].count)
                .map(([cause, data]) => {
                  const pct = rootCauseStats.totalWithCause > 0
                    ? (data.count / rootCauseStats.totalWithCause) * 100
                    : 0;
                  return (
                    <div
                      key={cause}
                      className="p-3 rounded-xl border border-[#E5E7EB] dark:border-[#1A1A1A] text-center"
                    >
                      <div
                        className="w-8 h-8 rounded-full mx-auto mb-2 flex items-center justify-center text-white text-xs font-bold"
                        style={{ backgroundColor: ROOT_CAUSE_COLORS[cause] }}
                      >
                        {data.count}
                      </div>
                      <p className="text-xs font-semibold text-[#374151] dark:text-[#D4D4D4] mb-1">
                        {ROOT_CAUSE_LABELS[cause]}
                      </p>
                      <div className="w-full h-1.5 bg-[#F3F4F6] dark:bg-[#171717] rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full transition-all duration-500"
                          style={{ width: `${pct}%`, backgroundColor: ROOT_CAUSE_COLORS[cause] }}
                        />
                      </div>
                      <p className="text-[10px] text-[#9CA3AF] dark:text-[#737373] mt-1">{formatEuro(data.cost)}</p>
                    </div>
                  );
                })}
            </div>
          </div>
        ) : (
          <div className="text-center py-8">
            <ShieldCheck className="w-10 h-10 text-[#D1D5DB] dark:text-[#404040] mx-auto mb-3" />
            <p className="text-sm text-[#9CA3AF] dark:text-[#737373]">
              Aucune cause racine enregistree. Selectionnez une cause racine lors de chaque declaration pour activer l'analyse.
            </p>
          </div>
        )}
      </div>

      {/* ═══════════════════════════════════════════════════════════════════════
          6. REDUCTION GOALS
          ═══════════════════════════════════════════════════════════════════════ */}
      <div className="bg-white dark:bg-[#0A0A0A] rounded-2xl border border-[#E5E7EB] dark:border-[#1A1A1A] p-5">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Target className="w-5 h-5 text-green-500" />
            <h2 className="font-semibold text-[#1F2937] dark:text-white">Objectif de reduction mensuel</h2>
          </div>
          <button
            onClick={() => setShowGoalModal(true)}
            className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium border border-[#E5E7EB] dark:border-[#1A1A1A] rounded-lg text-[#6B7280] dark:text-[#A3A3A3] hover:bg-[#F9FAFB] dark:hover:bg-[#171717] transition-colors"
          >
            <Target className="w-4 h-4" />
            {reductionGoal ? 'Modifier l\'objectif' : 'Definir un objectif'}
          </button>
        </div>

        {reductionGoal && goalProgress ? (
          <div>
            <div className="flex items-center justify-between mb-2 text-sm">
              <span className="text-[#6B7280] dark:text-[#A3A3A3]">
                Objectif : -{reductionGoal.targetPercent}% par rapport au mois dernier ({formatEuro(reductionGoal.baselineCost)})
              </span>
              <span className="font-bold text-[#111111] dark:text-white">
                Cible : {formatEuro(goalProgress.targetCost)}
              </span>
            </div>
            <div className="relative w-full h-8 bg-[#F3F4F6] dark:bg-[#171717] rounded-full overflow-hidden mb-2">
              <div
                className={`absolute inset-y-0 left-0 rounded-full transition-all duration-1000 ${
                  goalProgress.met
                    ? 'bg-green-500'
                    : goalProgress.pct >= 60
                    ? 'bg-amber-500'
                    : 'bg-red-500'
                }`}
                style={{ width: `${goalProgress.pct}%` }}
              />
              <div className="absolute inset-0 flex items-center justify-center text-xs font-bold text-[#374151] dark:text-white">
                {goalProgress.pct.toFixed(0)}% de l'objectif atteint
              </div>
            </div>
            <div className="flex items-center justify-between text-xs text-[#9CA3AF] dark:text-[#737373]">
              <span>Ce mois : {formatEuro(thisMonthCost)}</span>
              <span>Economie : {formatEuro(goalProgress.currentSaving)}</span>
            </div>

            {/* Congratulations message */}
            {goalProgress.met && (
              <div className="mt-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800/40 rounded-xl p-4 flex items-center gap-3">
                <div className="p-2 bg-green-500 rounded-full">
                  <Award className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="font-bold text-green-700 dark:text-green-300">Objectif atteint !</p>
                  <p className="text-sm text-green-600 dark:text-green-400">
                    Vous avez reduit votre gaspillage de {((1 - thisMonthCost / reductionGoal.baselineCost) * 100).toFixed(1)}% ce mois.
                    Continuez ainsi !
                  </p>
                </div>
                <CheckCircle className="w-8 h-8 text-green-500 ml-auto flex-shrink-0" />
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-6">
            <Target className="w-10 h-10 text-[#D1D5DB] dark:text-[#404040] mx-auto mb-3" />
            <p className="text-sm text-[#9CA3AF] dark:text-[#737373]">
              Aucun objectif defini. Definissez un objectif de reduction pour suivre vos progres.
            </p>
          </div>
        )}
      </div>

      {/* ═══════════════════════════════════════════════════════════════════════
          7. AI SUGGESTIONS
          ═══════════════════════════════════════════════════════════════════════ */}
      <div className="bg-white dark:bg-[#0A0A0A] rounded-2xl border border-[#E5E7EB] dark:border-[#1A1A1A] p-5">
        <button
          onClick={() => setShowTips(!showTips)}
          className="flex items-center justify-between w-full mb-3"
        >
          <div className="flex items-center gap-2">
            <Brain className="w-5 h-5 text-[#111111] dark:text-white" />
            <h2 className="font-semibold text-[#1F2937] dark:text-white">Suggestions de l'IA</h2>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#111111] dark:bg-white text-white dark:text-black uppercase">
              Smart
            </span>
          </div>
          {showTips ? <ChevronUp className="w-4 h-4 text-[#9CA3AF] dark:text-[#737373]" /> : <ChevronDown className="w-4 h-4 text-[#9CA3AF] dark:text-[#737373]" />}
        </button>
        {showTips && (
          <div className="space-y-3">
            {suggestions.map((tip, i) => (
              <div
                key={i}
                className="flex gap-3 p-4 rounded-xl border border-[#E5E7EB] dark:border-[#1A1A1A] bg-[#F9FAFB] dark:bg-[#171717] hover:border-[#111111] dark:hover:border-white transition-colors"
              >
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-[#111111] dark:bg-white flex items-center justify-center">
                  <Lightbulb className="w-4 h-4 text-white dark:text-black" />
                </div>
                <span className="text-sm text-[#374151] dark:text-[#D4D4D4] leading-relaxed">{tip}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Pie chart: by reason */}
        <div className="bg-white dark:bg-[#0A0A0A] rounded-2xl border border-[#E5E7EB] dark:border-[#1A1A1A] p-5">
          <div className="flex items-center gap-2 mb-4">
            <PieChartIcon className="w-5 h-5 text-[#374151] dark:text-[#D4D4D4]" />
            <h2 className="font-semibold text-[#1F2937] dark:text-white">{t('wasteTracker.lossesByCause')}</h2>
          </div>
          {pieData.length > 0 ? (
            <ResponsiveContainer width="100%" height={280}>
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={3}
                  dataKey="value"
                  label={({ name, percent }: { name?: string; percent?: number }) => `${name ?? ''} (${((percent ?? 0) * 100).toFixed(0)}%)`}
                >
                  {pieData.map((entry, i) => (
                    <Cell key={i} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(val: unknown) => formatEuro(Number(val))} />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-[280px] flex items-center justify-center text-[#9CA3AF] dark:text-[#737373]">{t('wasteTracker.noData')}</div>
          )}
        </div>

        {/* Bar chart: trend */}
        <div className="bg-white dark:bg-[#0A0A0A] rounded-2xl border border-[#E5E7EB] dark:border-[#1A1A1A] p-5">
          <div className="flex items-center gap-2 mb-4">
            <BarChart3 className="w-5 h-5 text-emerald-500" />
            <h2 className="font-semibold text-[#1F2937] dark:text-white">{t('wasteTracker.lossTrend')}</h2>
          </div>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={barData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.3} />
              <XAxis dataKey="name" tick={{ fontSize: 11 }} interval={period === 'mois' ? 4 : 0} />
              <YAxis tick={{ fontSize: 11 }} tickFormatter={(v) => `${v}EUR`} />
              <Tooltip formatter={(val: unknown) => formatEuro(Number(val))} labelStyle={{ color: '#1e293b' }} />
              <Bar dataKey="value" fill="#dc2626" radius={[4, 4, 0, 0]} name="Pertes (EUR)" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Zero Waste Progress — ProgressRing */}
      <div className="bg-white dark:bg-[#0A0A0A] rounded-2xl border border-[#E5E7EB] dark:border-[#1A1A1A] p-5">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Leaf className="w-5 h-5 text-green-500" />
            <h2 className="font-semibold text-[#1F2937] dark:text-white">{t('wasteTracker.zeroWasteObjective')}</h2>
          </div>
          <span className="text-sm text-[#9CA3AF] dark:text-[#737373]">
            Objectif : reduire de 20% ({formatEuro(monthlyTarget.target)})
          </span>
        </div>
        <div className="flex items-center gap-6">
          <ProgressRing
            value={zeroWasteScore}
            max={100}
            size={88}
            strokeWidth={7}
            animated={true}
            showPercent={true}
            label="Score zero dechet"
          />
          <div className="flex-1 space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-[#6B7280] dark:text-[#A3A3A3]">Depense actuelle</span>
              <span className="font-bold text-[#111111] dark:text-white">{formatEuro(monthlyTarget.actual)}</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-[#6B7280] dark:text-[#A3A3A3]">Objectif</span>
              <span className="font-bold text-green-600 dark:text-green-400">{formatEuro(monthlyTarget.target)}</span>
            </div>
            <div className="relative w-full h-3 bg-[#F3F4F6] dark:bg-[#171717] rounded-full overflow-hidden">
              <div
                className={`absolute inset-y-0 left-0 rounded-full transition-all duration-700 ${
                  zeroWasteScore >= 70 ? 'bg-green-500' : zeroWasteScore >= 40 ? 'bg-amber-500' : 'bg-red-500'
                }`}
                style={{ width: `${zeroWasteScore}%` }}
              />
            </div>
            <div className="flex justify-between text-[10px] text-[#9CA3AF] dark:text-[#737373]">
              <span>{t('wasteTracker.critical')}</span>
              <span>{t('wasteTracker.good')}</span>
              <span>{t('wasteTracker.excellent')}</span>
            </div>
          </div>
        </div>
      </div>

      {/* ── AI Analysis Panel ── */}
      {showAiPanel && aiAnalysis && (
        <div className="space-y-6">
          {/* AI Analysis Header */}
          <div className="bg-white dark:bg-[#0A0A0A] rounded-2xl border border-[#E5E7EB] dark:border-[#1A1A1A] p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-[#111111] dark:bg-white">
                  <Brain className="w-5 h-5 text-white dark:text-black" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-[#111111] dark:text-white">Analyse IA du gaspillage</h2>
                  <p className="text-xs text-[#9CA3AF] dark:text-[#737373]">30 derniers jours -- Claude Haiku</p>
                </div>
              </div>
              <button
                onClick={() => setShowAiPanel(false)}
                className="p-2 rounded-lg text-[#9CA3AF] dark:text-[#737373] hover:bg-[#F3F4F6] dark:hover:bg-[#171717] transition-colors"
              >
                <ChevronUp className="w-4 h-4" />
              </button>
            </div>

            <div className="prose prose-sm max-w-none">
              <div className="bg-[#F9FAFB] dark:bg-[#171717] rounded-lg p-4 border border-[#E5E7EB] dark:border-[#1A1A1A]">
                <p className="text-sm text-[#374151] dark:text-[#D4D4D4] leading-relaxed whitespace-pre-line">
                  {aiAnalysis.analysis}
                </p>
              </div>
            </div>
          </div>

          {/* AI Top Waste Items + Pattern Detection Row */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white dark:bg-[#0A0A0A] rounded-2xl border border-[#E5E7EB] dark:border-[#1A1A1A] p-5">
              <div className="flex items-center gap-2 mb-4">
                <Zap className="w-5 h-5 text-[#111111] dark:text-white" />
                <h3 className="font-semibold text-[#1F2937] dark:text-white">Top 5 ingredients gaspilles</h3>
              </div>
              <div className="space-y-3">
                {aiAnalysis.topWasteItems.map((item, i) => {
                  const maxCost = aiAnalysis.topWasteItems[0]?.totalCost || 1;
                  const pct = (item.totalCost / maxCost) * 100;
                  return (
                    <div key={item.name}>
                      <div className="flex items-center justify-between text-sm mb-1">
                        <span className="font-medium text-[#374151] dark:text-white">
                          <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-[#111111] dark:bg-white text-white dark:text-black text-[10px] font-bold mr-2">
                            {i + 1}
                          </span>
                          {item.name}
                        </span>
                        <span className="font-bold text-[#111111] dark:text-white">{formatEuro(item.totalCost)}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="flex-1 h-2 bg-[#F3F4F6] dark:bg-[#171717] rounded-full overflow-hidden">
                          <div
                            className="h-full bg-[#111111] dark:bg-white rounded-full transition-all duration-500"
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                        <span className="text-xs text-[#9CA3AF] dark:text-[#737373] w-24 text-right">
                          {item.totalQuantity} {item.unit} ({item.incidents}x)
                        </span>
                      </div>
                    </div>
                  );
                })}
                {aiAnalysis.topWasteItems.length === 0 && (
                  <p className="text-sm text-[#9CA3AF] dark:text-[#737373]">Aucune donnee disponible</p>
                )}
              </div>
            </div>

            <div className="bg-white dark:bg-[#0A0A0A] rounded-2xl border border-[#E5E7EB] dark:border-[#1A1A1A] p-5">
              <div className="flex items-center gap-2 mb-4">
                <Sparkles className="w-5 h-5 text-[#111111] dark:text-white" />
                <h3 className="font-semibold text-[#1F2937] dark:text-white">Patterns detectes</h3>
              </div>
              <div className="space-y-4">
                <div>
                  <h4 className="text-xs font-semibold text-[#9CA3AF] dark:text-[#737373] uppercase mb-2">Par jour de la semaine</h4>
                  <div className="grid grid-cols-7 gap-1">
                    {['lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi', 'samedi', 'dimanche'].map(day => {
                      const val = aiAnalysis.patterns.byDayOfWeek[day] || 0;
                      const maxVal = Math.max(...Object.values(aiAnalysis.patterns.byDayOfWeek), 1);
                      const intensity = Math.round((val / maxVal) * 4);
                      const bgClasses = [
                        'bg-[#F3F4F6] dark:bg-[#171717]',
                        'bg-[#D1D5DB] dark:bg-[#404040]',
                        'bg-[#9CA3AF] dark:bg-[#737373]',
                        'bg-[#6B7280] dark:bg-[#A3A3A3]',
                        'bg-[#111111] dark:bg-white',
                      ];
                      return (
                        <div key={day} className="text-center">
                          <div
                            className={`h-8 rounded ${bgClasses[intensity]} transition-colors`}
                            title={`${day}: ${formatEuro(val)}`}
                          />
                          <span className="text-[9px] text-[#9CA3AF] dark:text-[#737373] mt-0.5 block">
                            {day.slice(0, 3)}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div>
                  <h4 className="text-xs font-semibold text-[#9CA3AF] dark:text-[#737373] uppercase mb-2">Par cause</h4>
                  <div className="space-y-1.5">
                    {Object.entries(aiAnalysis.patterns.byReason)
                      .sort((a, b) => b[1] - a[1])
                      .map(([reason, cost]) => {
                        const totalPatternCost = Object.values(aiAnalysis.patterns.byReason).reduce((a, b) => a + b, 0);
                        const pct = totalPatternCost > 0 ? (cost / totalPatternCost) * 100 : 0;
                        return (
                          <div key={reason} className="flex items-center gap-2 text-xs">
                            <span className="w-24 text-[#6B7280] dark:text-[#A3A3A3] capitalize">{REASON_LABELS[reason as WasteReason] || reason}</span>
                            <div className="flex-1 h-1.5 bg-[#F3F4F6] dark:bg-[#171717] rounded-full overflow-hidden">
                              <div className="h-full bg-[#111111] dark:bg-white rounded-full" style={{ width: `${pct}%` }} />
                            </div>
                            <span className="w-12 text-right font-medium text-[#374151] dark:text-[#D4D4D4]">{pct.toFixed(0)}%</span>
                          </div>
                        );
                      })}
                  </div>
                </div>

                <div>
                  <h4 className="text-xs font-semibold text-[#9CA3AF] dark:text-[#737373] uppercase mb-2">Par categorie</h4>
                  <div className="flex flex-wrap gap-2">
                    {Object.entries(aiAnalysis.patterns.byCategory)
                      .sort((a, b) => b[1] - a[1])
                      .slice(0, 6)
                      .map(([cat, cost]) => (
                        <span
                          key={cat}
                          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-[#F3F4F6] dark:bg-[#171717] text-[#374151] dark:text-[#D4D4D4] border border-[#E5E7EB] dark:border-[#1A1A1A]"
                        >
                          {cat}
                          <span className="text-[#9CA3AF] dark:text-[#737373]">{formatEuro(cost)}</span>
                        </span>
                      ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Recommendations */}
          <div className="bg-white dark:bg-[#0A0A0A] rounded-2xl border border-[#E5E7EB] dark:border-[#1A1A1A] p-5">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Lightbulb className="w-5 h-5 text-[#111111] dark:text-white" />
                <h3 className="font-semibold text-[#1F2937] dark:text-white">5 actions recommandees</h3>
              </div>
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#111111] dark:bg-white">
                <TrendingDown className="w-3.5 h-3.5 text-white dark:text-black" />
                <span className="text-xs font-bold text-white dark:text-black">
                  Economie estimee: {formatEuro(aiAnalysis.estimatedSavings)}/mois
                </span>
              </div>
            </div>
            <div className="space-y-3">
              {aiAnalysis.recommendations.map((rec, i) => {
                const priorityStyles: Record<string, string> = {
                  haute: 'bg-[#111111] dark:bg-white text-white dark:text-black',
                  moyenne: 'bg-[#6B7280] dark:bg-[#A3A3A3] text-white dark:text-black',
                  basse: 'bg-[#E5E7EB] dark:bg-[#404040] text-[#374151] dark:text-[#D4D4D4]',
                };
                return (
                  <div
                    key={i}
                    className="flex gap-4 p-4 rounded-lg border border-[#E5E7EB] dark:border-[#1A1A1A] hover:bg-[#F9FAFB] dark:hover:bg-[#171717] transition-colors"
                  >
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-[#111111] dark:bg-white flex items-center justify-center">
                      <span className="text-sm font-bold text-white dark:text-black">{i + 1}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2 mb-1">
                        <p className="text-sm font-medium text-[#1F2937] dark:text-white">{rec.action}</p>
                        <span className={`flex-shrink-0 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${priorityStyles[rec.priority] || priorityStyles.basse}`}>
                          {rec.priority}
                        </span>
                      </div>
                      <div className="flex items-center gap-3 text-xs text-[#9CA3AF] dark:text-[#737373]">
                        <span className="flex items-center gap-1">
                          <TrendingDown className="w-3 h-3" />
                          {rec.impact}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {rec.timeline}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
              {aiAnalysis.recommendations.length === 0 && (
                <p className="text-sm text-[#9CA3AF] dark:text-[#737373] text-center py-4">
                  Pas assez de donnees pour generer des recommandations
                </p>
              )}
            </div>
          </div>

          {/* Trend Chart with Target Line + Prediction Card Row */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 bg-white dark:bg-[#0A0A0A] rounded-2xl border border-[#E5E7EB] dark:border-[#1A1A1A] p-5">
              <div className="flex items-center gap-2 mb-4">
                <TrendingUp className="w-5 h-5 text-[#111111] dark:text-white" />
                <h3 className="font-semibold text-[#1F2937] dark:text-white">Tendance du gaspillage (30j)</h3>
              </div>
              {aiAnalysis.trend.length > 0 ? (
                <ResponsiveContainer width="100%" height={280}>
                  <LineChart data={aiAnalysis.trend}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" strokeOpacity={0.5} />
                    <XAxis
                      dataKey="date"
                      tick={{ fontSize: 10 }}
                      tickFormatter={(d: string) => {
                        const parts = d.split('-');
                        return `${parts[2]}/${parts[1]}`;
                      }}
                      interval={4}
                    />
                    <YAxis tick={{ fontSize: 10 }} tickFormatter={(v) => `${v}`} />
                    <Tooltip
                      formatter={(val: unknown) => [formatEuro(Number(val)), 'Pertes']}
                      labelFormatter={(l: unknown) => {
                        const str = String(l);
                        const parts = str.split('-');
                        return parts.length === 3 ? `${parts[2]}/${parts[1]}/${parts[0]}` : str;
                      }}
                      contentStyle={{ backgroundColor: '#fff', border: '1px solid #E5E7EB', borderRadius: '8px', fontSize: '12px' }}
                    />
                    <ReferenceLine
                      y={aiAnalysis.targetDailyCost}
                      stroke="#111111"
                      strokeDasharray="8 4"
                      strokeWidth={2}
                      label={{
                        value: `Objectif: ${formatEuro(aiAnalysis.targetDailyCost)}/j`,
                        position: 'insideTopRight',
                        fill: '#111111',
                        fontSize: 10,
                        fontWeight: 'bold',
                      }}
                    />
                    <Line
                      type="monotone"
                      dataKey="cost"
                      stroke="#111111"
                      strokeWidth={2}
                      dot={{ fill: '#111111', r: 2 }}
                      activeDot={{ r: 4, fill: '#111111' }}
                      name="Pertes"
                    />
                  </LineChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-[280px] flex items-center justify-center text-[#9CA3AF] dark:text-[#737373]">
                  Pas assez de donnees pour afficher la tendance
                </div>
              )}
            </div>

            <div className="bg-white dark:bg-[#0A0A0A] rounded-2xl border border-[#E5E7EB] dark:border-[#1A1A1A] p-5">
              <div className="flex items-center gap-2 mb-4">
                <CalendarDays className="w-5 h-5 text-[#111111] dark:text-white" />
                <h3 className="font-semibold text-[#1F2937] dark:text-white">Prediction semaine prochaine</h3>
              </div>
              <div className="space-y-2">
                {aiAnalysis.prediction.map((pred) => (
                  <div
                    key={pred.day}
                    className={`flex items-center justify-between p-3 rounded-lg border transition-colors ${
                      pred.highRisk
                        ? 'border-[#111111] dark:border-white bg-[#F9FAFB] dark:bg-[#171717]'
                        : 'border-[#E5E7EB] dark:border-[#1A1A1A]'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      {pred.highRisk && (
                        <AlertTriangle className="w-3.5 h-3.5 text-[#111111] dark:text-white" />
                      )}
                      <span className={`text-sm capitalize ${
                        pred.highRisk
                          ? 'font-bold text-[#111111] dark:text-white'
                          : 'text-[#6B7280] dark:text-[#A3A3A3]'
                      }`}>
                        {pred.day}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`text-sm font-medium ${
                        pred.highRisk ? 'text-[#111111] dark:text-white' : 'text-[#6B7280] dark:text-[#A3A3A3]'
                      }`}>
                        {formatEuro(pred.predictedCost)}
                      </span>
                      <span className={`text-[9px] px-1.5 py-0.5 rounded-full font-medium ${
                        pred.confidence === 'haute'
                          ? 'bg-[#111111] dark:bg-white text-white dark:text-black'
                          : pred.confidence === 'moyenne'
                          ? 'bg-[#9CA3AF] dark:bg-[#737373] text-white dark:text-black'
                          : 'bg-[#E5E7EB] dark:bg-[#404040] text-[#6B7280] dark:text-[#A3A3A3]'
                      }`}>
                        {pred.confidence}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-3 pt-3 border-t border-[#E5E7EB] dark:border-[#1A1A1A]">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-[#9CA3AF] dark:text-[#737373]">Total predit</span>
                  <span className="font-bold text-[#111111] dark:text-white">
                    {formatEuro(aiAnalysis.prediction.reduce((s, p) => s + p.predictedCost, 0))}
                  </span>
                </div>
                <p className="text-[10px] text-[#9CA3AF] dark:text-[#737373] mt-1">
                  Base sur les patterns des 30 derniers jours. Les jours en gras presentent un risque eleve de gaspillage.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ═══════════════════════════════════════════════════════════════════════
          WEEKLY WASTE REPORT — Auto-generated summary
          ═══════════════════════════════════════════════════════════════════════ */}
      <div className="bg-white dark:bg-[#0A0A0A] rounded-2xl border border-[#E5E7EB] dark:border-[#1A1A1A] p-5">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Mail className="w-5 h-5 text-[#111111] dark:text-white" />
            <h2 className="font-semibold text-[#1F2937] dark:text-white">Rapport hebdomadaire</h2>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#111111] dark:bg-white text-white dark:text-black uppercase">
              Auto
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowWeeklyReport(!showWeeklyReport)}
              className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium border border-[#E5E7EB] dark:border-[#1A1A1A] rounded-lg text-[#6B7280] dark:text-[#A3A3A3] hover:bg-[#F9FAFB] dark:hover:bg-[#171717] transition-colors"
            >
              <Eye className="w-4 h-4" />
              {showWeeklyReport ? 'Masquer' : 'Apercu'}
            </button>
            <button
              onClick={handleSendWeeklyReport}
              disabled={weeklyReportSending}
              className="flex items-center gap-2 px-3 py-1.5 bg-[#111111] dark:bg-white text-white dark:text-black hover:bg-[#333333] dark:hover:bg-[#E5E5E5] rounded-lg text-sm font-semibold transition-colors disabled:opacity-60"
            >
              {weeklyReportSending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
              Envoyer par email
            </button>
          </div>
        </div>

        {/* Report summary bar */}
        {weeklyReport && (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
            <div className="bg-[#F9FAFB] dark:bg-[#171717] rounded-xl p-3 text-center">
              <p className="text-xs text-[#9CA3AF] dark:text-[#737373] mb-1">Total semaine</p>
              <p className="text-lg font-bold text-red-600 dark:text-red-400">{formatEuro(weeklyReport.totalCost)}</p>
            </div>
            <div className="bg-[#F9FAFB] dark:bg-[#171717] rounded-xl p-3 text-center">
              <p className="text-xs text-[#9CA3AF] dark:text-[#737373] mb-1">Incidents</p>
              <p className="text-lg font-bold text-[#111111] dark:text-white">{weeklyReport.entryCount}</p>
            </div>
            <div className="bg-[#F9FAFB] dark:bg-[#171717] rounded-xl p-3 text-center">
              <p className="text-xs text-[#9CA3AF] dark:text-[#737373] mb-1">vs semaine precedente</p>
              <p className={`text-lg font-bold ${weeklyReport.trendVsLastWeek > 0 ? 'text-red-600' : 'text-green-600'}`}>
                {weeklyReport.trendVsLastWeek > 0 ? '+' : ''}{weeklyReport.trendVsLastWeek.toFixed(1)}%
              </p>
            </div>
            <div className="bg-[#F9FAFB] dark:bg-[#171717] rounded-xl p-3 text-center">
              <p className="text-xs text-[#9CA3AF] dark:text-[#737373] mb-1">Envoi automatique</p>
              <p className="text-lg font-bold text-[#111111] dark:text-white">Lundi</p>
            </div>
          </div>
        )}

        {showWeeklyReport && weeklyReport && (
          <div className="bg-[#F9FAFB] dark:bg-[#171717] rounded-xl p-5 border border-[#E5E7EB] dark:border-[#1A1A1A] space-y-4">
            <div className="border-b border-[#E5E7EB] dark:border-[#1A1A1A] pb-3">
              <h3 className="font-bold text-[#111111] dark:text-white text-lg">
                Rapport gaspillage — Semaine du {new Date(weeklyReport.weekStart).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long' })} au {new Date(weeklyReport.weekEnd).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}
              </h3>
            </div>

            {/* Total & Trend */}
            <div className="flex items-center gap-4 flex-wrap">
              <div>
                <p className="text-sm text-[#9CA3AF] dark:text-[#737373]">Cout total du gaspillage</p>
                <p className="text-3xl font-black text-red-600 dark:text-red-400">{formatEuro(weeklyReport.totalCost)}</p>
              </div>
              <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-bold ${
                weeklyReport.trendVsLastWeek > 0
                  ? 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300'
                  : 'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300'
              }`}>
                {weeklyReport.trendVsLastWeek > 0 ? (
                  <ArrowUpRight className="w-4 h-4" />
                ) : (
                  <ArrowDownRight className="w-4 h-4" />
                )}
                {weeklyReport.trendVsLastWeek > 0 ? '+' : ''}{weeklyReport.trendVsLastWeek.toFixed(1)}% vs semaine precedente
              </div>
            </div>

            {/* Top 3 wasted items */}
            <div>
              <h4 className="text-sm font-semibold text-[#111111] dark:text-white mb-2">Top 3 ingredients gaspilles</h4>
              <div className="space-y-2">
                {weeklyReport.top3.map((item, i) => (
                  <div key={item.name} className="flex items-center gap-3">
                    <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-red-600 text-white text-xs font-bold">
                      {i + 1}
                    </span>
                    <span className="text-sm font-medium text-[#374151] dark:text-[#D4D4D4] flex-1">{item.name}</span>
                    <span className="text-sm font-bold text-red-600 dark:text-red-400">{formatEuro(item.cost)}</span>
                  </div>
                ))}
                {weeklyReport.top3.length === 0 && (
                  <p className="text-sm text-[#9CA3AF] dark:text-[#737373]">Aucune perte cette semaine</p>
                )}
              </div>
            </div>

            {/* Suggestions */}
            <div>
              <h4 className="text-sm font-semibold text-[#111111] dark:text-white mb-2">Suggestions de la semaine</h4>
              <div className="space-y-2">
                {weeklyReport.suggestions.map((sug, i) => (
                  <div key={i} className="flex items-start gap-2">
                    <Lightbulb className="w-4 h-4 text-amber-500 mt-0.5 flex-shrink-0" />
                    <p className="text-sm text-[#374151] dark:text-[#D4D4D4]">{sug}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-3 border-t border-[#E5E7EB] dark:border-[#1A1A1A]">
              <p className="text-[10px] text-[#9CA3AF] dark:text-[#737373]">
                Ce rapport est genere automatiquement chaque lundi. Il sera envoye a l'adresse email du compte.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Recent waste entries table */}
      <div className="bg-white dark:bg-[#0A0A0A] rounded-2xl border border-[#E5E7EB] dark:border-[#1A1A1A] p-5">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
          <h2 className="font-semibold text-[#1F2937] dark:text-white flex items-center gap-2">
            <Calendar className="w-5 h-5 text-[#9CA3AF] dark:text-[#737373]" />
            {t('wasteTracker.recentDeclarations')}
          </h2>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9CA3AF] dark:text-[#737373]" />
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder={t('wasteTracker.search')}
              className="pl-9 pr-4 py-2 border border-[#E5E7EB] dark:border-[#1A1A1A] rounded-lg bg-white dark:bg-[#171717] text-sm text-[#1F2937] dark:text-white placeholder:text-[#6B7280] w-full sm:w-64 focus:ring-2 focus:ring-[#111111] dark:focus:ring-white focus:border-transparent"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[#E5E7EB] dark:border-[#1A1A1A]">
                <th className="text-left py-2 px-3 text-xs font-semibold text-[#9CA3AF] dark:text-[#737373] uppercase">{t('wasteTracker.date')}</th>
                <th className="text-left py-2 px-3 text-xs font-semibold text-[#9CA3AF] dark:text-[#737373] uppercase">{t('wasteTracker.ingredient')}</th>
                <th className="text-right py-2 px-3 text-xs font-semibold text-[#9CA3AF] dark:text-[#737373] uppercase">{t('wasteTracker.quantity')}</th>
                <th className="text-left py-2 px-3 text-xs font-semibold text-[#9CA3AF] dark:text-[#737373] uppercase">{t('wasteTracker.cause')}</th>
                <th className="text-left py-2 px-3 text-xs font-semibold text-[#9CA3AF] dark:text-[#737373] uppercase">Cause racine</th>
                <th className="text-center py-2 px-3 text-xs font-semibold text-[#9CA3AF] dark:text-[#737373] uppercase">Photo</th>
                <th className="text-right py-2 px-3 text-xs font-semibold text-[#9CA3AF] dark:text-[#737373] uppercase">{t('wasteTracker.cost')}</th>
                <th className="py-2 px-3"></th>
              </tr>
            </thead>
            <tbody>
              {loadingEntries ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-[#9CA3AF] dark:text-[#737373]">
                    <Loader2 className="w-5 h-5 animate-spin mx-auto" />
                  </td>
                </tr>
              ) : (
                <>
                  {recentEntries.map(e => {
                    const photo = getWastePhoto(e.id);
                    return (
                      <tr key={e.id} className="border-b border-[#F3F4F6] dark:border-[#1A1A1A]/50 hover:bg-[#F9FAFB] dark:hover:bg-[#171717]/30 transition-colors">
                        <td className="py-2.5 px-3 text-[#6B7280] dark:text-[#A3A3A3]">
                          {new Date(e.date).toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit' })}
                        </td>
                        <td className="py-2.5 px-3 font-medium text-[#1F2937] dark:text-white">{e.ingredientName}</td>
                        <td className="py-2.5 px-3 text-right text-[#6B7280] dark:text-[#A3A3A3]">
                          {e.quantity.toFixed(2)} {e.unit}
                        </td>
                        <td className="py-2.5 px-3">
                          <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${REASON_BADGE[e.reason]}`}>
                            {REASON_LABELS[e.reason]}
                          </span>
                        </td>
                        <td className="py-2.5 px-3">
                          {e.rootCause ? (
                            <span
                              className="inline-block px-2 py-0.5 rounded-full text-xs font-medium"
                              style={{
                                backgroundColor: `${ROOT_CAUSE_COLORS[e.rootCause]}20`,
                                color: ROOT_CAUSE_COLORS[e.rootCause],
                              }}
                            >
                              {ROOT_CAUSE_LABELS[e.rootCause]}
                            </span>
                          ) : (
                            <span className="text-xs text-[#D1D5DB] dark:text-[#404040]">--</span>
                          )}
                        </td>
                        <td className="py-2.5 px-3 text-center">
                          {photo ? (
                            <button
                              onClick={() => setViewingPhoto(photo)}
                              className="inline-flex items-center justify-center w-7 h-7 rounded-lg overflow-hidden border border-[#E5E7EB] dark:border-[#1A1A1A] hover:ring-2 hover:ring-[#111111] dark:hover:ring-white transition-all"
                            >
                              <img src={photo} alt="waste" className="w-full h-full object-cover" />
                            </button>
                          ) : (
                            <span className="text-[#D1D5DB] dark:text-[#404040]">
                              <Image className="w-3.5 h-3.5 mx-auto" />
                            </span>
                          )}
                        </td>
                        <td className="py-2.5 px-3 text-right font-semibold text-red-600 dark:text-red-400">
                          {formatEuro(e.quantity * e.costPerUnit)}
                        </td>
                        <td className="py-2.5 px-3 text-right">
                          <button
                            onClick={() => handleDeleteEntry(e.id)}
                            className="p-1.5 rounded-lg text-[#9CA3AF] dark:text-[#737373] hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/30 transition-colors"
                            title={t('wasteTracker.delete')}
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                  {recentEntries.length === 0 && (
                    <tr>
                      <td colSpan={8} className="py-8 text-center text-[#9CA3AF] dark:text-[#737373]">
                        {t('wasteTracker.noWasteForPeriod')}
                      </td>
                    </tr>
                  )}
                </>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Waste Modal (kept for button compatibility) */}
      <Modal isOpen={showAddModal} onClose={() => setShowAddModal(false)} title={t('wasteTracker.declareWasteTitle')}>
        <div className="space-y-4">
          {/* Ingredient with autocomplete */}
          <div className="relative">
            <label className="block text-sm font-medium text-[#9CA3AF] dark:text-[#737373] mb-1">{t('wasteTracker.ingredient')}</label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9CA3AF] dark:text-[#737373]" />
              <input
                type="text"
                value={ingredientSearch}
                onChange={e => {
                  setIngredientSearch(e.target.value);
                  setShowSuggestions(true);
                  setForm(f => ({ ...f, ingredientId: '', ingredientName: '' }));
                }}
                onFocus={() => setShowSuggestions(true)}
                placeholder="Tapez pour rechercher..."
                className="w-full pl-9 pr-3 py-2 border border-[#D1D5DB] dark:border-[#1A1A1A] rounded-lg bg-white dark:bg-[#171717] text-[#1F2937] dark:text-white focus:ring-2 focus:ring-[#111111] dark:focus:ring-white"
              />
            </div>
            {showSuggestions && filteredIngredients.length > 0 && (
              <div className="absolute z-30 w-full mt-1 bg-white dark:bg-[#0A0A0A] border border-[#E5E7EB] dark:border-[#1A1A1A] rounded-lg shadow-lg max-h-48 overflow-y-auto">
                {filteredIngredients.map(ing => (
                  <button
                    key={ing.id}
                    onClick={() => selectIngredient(ing)}
                    className="w-full text-left px-3 py-2 text-sm hover:bg-[#F3F4F6] dark:hover:bg-[#171717] transition-colors flex items-center justify-between"
                  >
                    <div>
                      <span className="text-[#1F2937] dark:text-white">{ing.name}</span>
                      {ing.category && (
                        <span className="ml-2 text-xs text-[#9CA3AF] dark:text-[#737373]">{ing.category}</span>
                      )}
                    </div>
                    <span className="text-xs text-[#9CA3AF] dark:text-[#737373]">{formatEuro(ing.pricePerUnit)}/{ing.unit}</span>
                  </button>
                ))}
              </div>
            )}
            {form.ingredientId && (
              <div className="mt-1 text-xs text-green-600 dark:text-green-400 flex items-center gap-1">
                <CheckCircle className="w-3 h-3" />
                {form.ingredientName} selectionne
              </div>
            )}
          </div>

          {/* Quantity */}
          <div>
            <label className="block text-sm font-medium text-[#9CA3AF] dark:text-[#737373] mb-1">{t('wasteTracker.quantity')}</label>
            <div className="flex items-center gap-2">
              <input
                type="number"
                step="0.01"
                min="0"
                value={form.quantity}
                onChange={e => setForm(f => ({ ...f, quantity: e.target.value }))}
                placeholder="0.00"
                className="flex-1 px-3 py-2 border border-[#D1D5DB] dark:border-[#1A1A1A] rounded-lg bg-white dark:bg-[#171717] text-[#1F2937] dark:text-white focus:ring-2 focus:ring-[#111111] dark:focus:ring-white"
              />
              {form.ingredientId && (
                <span className="text-sm text-[#9CA3AF] dark:text-[#737373] font-medium">
                  {ingredients.find(i => i.id === parseInt(form.ingredientId))?.unit}
                </span>
              )}
            </div>
          </div>

          {/* Reason - styled buttons */}
          <div>
            <label className="block text-sm font-medium text-[#9CA3AF] dark:text-[#737373] mb-1">{t('wasteTracker.cause')}</label>
            <div className="grid grid-cols-2 gap-2">
              {(Object.entries(REASON_LABELS) as [WasteReason, string][]).map(([key, label]) => (
                <button
                  key={key}
                  onClick={() => setForm(f => ({ ...f, reason: key }))}
                  className={`px-3 py-2.5 rounded-lg text-sm font-medium border-2 transition-colors ${
                    form.reason === key
                      ? 'border-[#111111] dark:border-white bg-[#F9FAFB] dark:bg-[#171717] text-[#111111] dark:text-white'
                      : 'border-[#E5E7EB] dark:border-[#1A1A1A] text-[#6B7280] dark:text-[#A3A3A3] hover:border-[#D1D5DB] dark:hover:border-[#6B7280]'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-sm font-medium text-[#9CA3AF] dark:text-[#737373] mb-1">{t('wasteTracker.notesOptional')}</label>
            <textarea
              value={form.notes}
              onChange={e => setForm(f => ({ ...f, notes: e.target.value }))}
              rows={2}
              placeholder={t('wasteTracker.additionalDetails')}
              className="w-full px-3 py-2 border border-[#D1D5DB] dark:border-[#1A1A1A] rounded-lg bg-white dark:bg-[#171717] text-[#1F2937] dark:text-white focus:ring-2 focus:ring-[#111111] dark:focus:ring-white resize-none"
            />
          </div>

          {/* Estimated cost preview */}
          {form.ingredientId && form.quantity && (() => {
            const ing = ingredients.find(i => i.id === parseInt(form.ingredientId));
            return ing ? (
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800/40 rounded-lg p-3 text-sm">
                <span className="text-[#6B7280] dark:text-[#A3A3A3]">{t('wasteTracker.estimatedCost')} : </span>
                <span className="font-bold text-red-600 dark:text-red-400">
                  {formatEuro((parseFloat(form.quantity || '0') / getUnitDivisor(ing.unit)) * ing.pricePerUnit)}
                </span>
              </div>
            ) : null;
          })()}

          {/* Submit */}
          <div className="flex justify-end gap-3 pt-2">
            <button
              onClick={() => setShowAddModal(false)}
              disabled={submitting}
              className="px-4 py-2 rounded-lg text-sm font-medium text-[#6B7280] dark:text-[#A3A3A3] hover:bg-[#F3F4F6] dark:hover:bg-[#171717] transition-colors disabled:opacity-50"
            >
              {t('wasteTracker.cancel')}
            </button>
            <button
              onClick={handleAddWaste}
              disabled={submitting}
              className="flex items-center gap-2 px-5 py-2 bg-red-600 hover:bg-red-500 text-white rounded-lg text-sm font-semibold transition-colors disabled:opacity-60"
            >
              {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
              {t('wasteTracker.declareWaste')}
            </button>
          </div>
        </div>
      </Modal>

      {/* Goal Modal */}
      <Modal isOpen={showGoalModal} onClose={() => setShowGoalModal(false)} title="Definir l'objectif de reduction">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-[#9CA3AF] dark:text-[#737373] mb-1">
              Reduction souhaitee (%)
            </label>
            <div className="flex items-center gap-3">
              <span className="text-lg font-bold text-[#111111] dark:text-white">-</span>
              <input
                type="number"
                min="1"
                max="100"
                value={goalInput}
                onChange={e => setGoalInput(e.target.value)}
                className="w-24 px-3 py-2 border border-[#D1D5DB] dark:border-[#1A1A1A] rounded-lg bg-white dark:bg-[#171717] text-[#1F2937] dark:text-white text-lg font-bold text-center focus:ring-2 focus:ring-[#111111] dark:focus:ring-white"
              />
              <span className="text-lg font-bold text-[#111111] dark:text-white">%</span>
            </div>
          </div>
          <div className="bg-[#F9FAFB] dark:bg-[#171717] rounded-lg p-3 text-sm">
            <p className="text-[#6B7280] dark:text-[#A3A3A3]">
              Reference (mois dernier) : <span className="font-bold text-[#111111] dark:text-white">{formatEuro(lastMonthCost || thisMonthCost)}</span>
            </p>
            <p className="text-[#6B7280] dark:text-[#A3A3A3] mt-1">
              Objectif ce mois : <span className="font-bold text-green-600 dark:text-green-400">
                {formatEuro((lastMonthCost || thisMonthCost) * (1 - parseInt(goalInput || '0') / 100))}
              </span>
            </p>
          </div>
          <div className="flex justify-end gap-3">
            <button
              onClick={() => setShowGoalModal(false)}
              className="px-4 py-2 rounded-lg text-sm font-medium text-[#6B7280] dark:text-[#A3A3A3] hover:bg-[#F3F4F6] dark:hover:bg-[#171717] transition-colors"
            >
              Annuler
            </button>
            <button
              onClick={saveGoal}
              className="flex items-center gap-2 px-5 py-2 bg-green-600 hover:bg-green-500 text-white rounded-lg text-sm font-semibold transition-colors"
            >
              <Target className="w-4 h-4" />
              Valider l'objectif
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
