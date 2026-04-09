import { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Play, Square, Clock, Users, DollarSign, TrendingUp, ChefHat,
  Plus, Minus, Hash, X, Download, CalendarDays, ChevronLeft,
  ChevronRight, Monitor, BarChart3, Award, ArrowRight, Utensils,
  Timer, Eye, Pause, RotateCcw, Search, SlidersHorizontal,
  Printer, Percent, ShoppingBag, Zap,
} from 'lucide-react';
import { fetchRecipes, getToken } from '../services/api';
import type { Recipe } from '../types';
import { formatCurrency, currencySuffix } from '../utils/currency';
import { useRestaurant } from '../hooks/useRestaurant';
import FoodIllustration from '../components/FoodIllustration';

// ── Types ─────────────────────────────────────────────────────────────

type ServiceType = 'midi' | 'soir';
type Tab = 'live' | 'history';

interface ServiceOrder {
  id: string;
  recipeId: number;
  recipeName: string;
  recipeCategory: string;
  quantity: number;
  unitSellingPrice: number;
  unitCost: number;
  tableNumber: number | null;
  timestamp: number;
}

interface ServiceSession {
  id: string;
  type: ServiceType;
  date: string; // YYYY-MM-DD
  startTime: number; // timestamp
  endTime: number | null;
  orders: ServiceOrder[];
  isActive: boolean;
}

interface ServiceSummary {
  id: string;
  type: ServiceType;
  date: string;
  startTime: number;
  endTime: number;
  totalCouverts: number;
  totalCA: number;
  totalCout: number;
  margeBrute: number;
  margePercent: number;
  topPlats: { name: string; qty: number; ca: number }[];
  orders: ServiceOrder[];
}

// ── Constants ─────────────────────────────────────────────────────────

const STORAGE_KEY = 'service-tracker-current';
const HISTORY_KEY = 'service-tracker-history';
const API_BASE = import.meta.env.VITE_API_URL || '/api';

// Category config for tabs
const CATEGORY_TABS = [
  { key: null, label: 'Tous', emoji: '' },
  { key: 'Entrée', label: 'Entrees', emoji: '' },
  { key: 'Entree', label: 'Entrees', emoji: '' },
  { key: 'Plat', label: 'Plats', emoji: '' },
  { key: 'Plat principal', label: 'Plats', emoji: '' },
  { key: 'Dessert', label: 'Desserts', emoji: '' },
  { key: 'Boisson', label: 'Boissons', emoji: '' },
];

// ── Helpers ────────────────────────────────────────────────────────────

function detectServiceType(): ServiceType {
  const h = new Date().getHours();
  return h < 16 ? 'midi' : 'soir';
}

function formatDuration(ms: number): string {
  const totalSec = Math.floor(ms / 1000);
  const h = Math.floor(totalSec / 3600);
  const m = Math.floor((totalSec % 3600) / 60);
  if (h > 0) return `${h}h${String(m).padStart(2, '0')}`;
  return `${m}min`;
}

function formatTime(ts: number): string {
  return new Date(ts).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
}

function formatDate(dateStr: string): string {
  const d = new Date(dateStr + 'T12:00:00');
  return d.toLocaleDateString('fr-FR', { weekday: 'short', day: 'numeric', month: 'short' });
}

function todayStr(): string {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

function getRecipeCost(recipe: Recipe): number {
  if (recipe.margin && recipe.margin.costPerPortion != null) return recipe.margin.costPerPortion;
  if (recipe.margin && recipe.margin.foodCost != null && recipe.nbPortions > 0) return recipe.margin.foodCost / recipe.nbPortions;
  return 0;
}

function getRecipeMarginPercent(recipe: Recipe): number {
  const cost = getRecipeCost(recipe);
  const price = recipe.sellingPrice / (recipe.nbPortions || 1);
  if (price <= 0) return 0;
  return ((price - cost) / price) * 100;
}

function loadFromStorage<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw);
  } catch {
    return fallback;
  }
}

function saveToStorage(key: string, data: any): void {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch { /* localStorage full -- ignore */ }
}

// ── Animated Counter ──────────────────────────────────────────────────

function AnimatedValue({ value, prefix = '', suffix = '', decimals = 2 }: {
  value: number; prefix?: string; suffix?: string; decimals?: number;
}) {
  const [display, setDisplay] = useState(value);
  const prev = useRef(value);

  useEffect(() => {
    const from = prev.current;
    const to = value;
    if (from === to) return;
    prev.current = to;

    const duration = 400;
    const start = performance.now();

    function tick(now: number) {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
      setDisplay(from + (to - from) * eased);
      if (progress < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }, [value]);

  return <span>{prefix}{display.toFixed(decimals)}{suffix}</span>;
}

// ── Margin Badge ─────────────────────────────────────────────────────

function MarginBadge({ percent }: { percent: number }) {
  const color = percent >= 70 ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400'
    : percent >= 50 ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-400'
    : 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-400';
  return (
    <span className={`inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-full text-[10px] font-semibold ${color}`}>
      <Percent className="w-2.5 h-2.5" />
      {percent.toFixed(0)}
    </span>
  );
}

// ── Marge Gauge ──────────────────────────────────────────────────────

function MargeGauge({ percent }: { percent: number }) {
  const clampedPercent = Math.max(0, Math.min(100, percent));
  const rotation = (clampedPercent / 100) * 180 - 90; // -90 to 90 degrees
  const color = percent >= 70 ? '#10b981' : percent >= 50 ? '#f59e0b' : '#ef4444';

  return (
    <div className="relative w-16 h-10 mx-auto">
      {/* Background arc */}
      <svg viewBox="0 0 100 60" className="w-full h-full">
        <path d="M 10 55 A 40 40 0 0 1 90 55" fill="none" stroke="currentColor" strokeWidth="8" className="text-[#E5E7EB] dark:text-[#262626]" strokeLinecap="round" />
        <path
          d="M 10 55 A 40 40 0 0 1 90 55"
          fill="none"
          stroke={color}
          strokeWidth="8"
          strokeLinecap="round"
          strokeDasharray={`${(clampedPercent / 100) * 126} 126`}
          className="transition-all duration-700"
        />
      </svg>
      {/* Needle */}
      <div
        className="absolute bottom-0 left-1/2 w-0.5 h-6 origin-bottom transition-transform duration-700 ease-out"
        style={{ transform: `translateX(-50%) rotate(${rotation}deg)`, backgroundColor: color }}
      />
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full" style={{ backgroundColor: color }} />
    </div>
  );
}

// ── Print Ticket ─────────────────────────────────────────────────────

function printKitchenTicket(order: ServiceOrder, sessionType: ServiceType) {
  const ticketWindow = window.open('', '_blank', 'width=300,height=500');
  if (!ticketWindow) return;

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <title>Ticket #${order.id.slice(-6)}</title>
      <style>
        body { font-family: 'Courier New', monospace; width: 280px; margin: 0 auto; padding: 10px; color: #000; }
        .center { text-align: center; }
        .bold { font-weight: bold; }
        .divider { border-top: 1px dashed #000; margin: 8px 0; }
        .large { font-size: 18px; }
        .small { font-size: 11px; }
        .row { display: flex; justify-content: space-between; }
        @media print { body { width: 100%; } }
      </style>
    </head>
    <body>
      <div class="center bold large">CUISINE</div>
      <div class="center small">Service ${sessionType === 'midi' ? 'du Midi' : 'du Soir'}</div>
      <div class="divider"></div>
      <div class="center bold">${new Date(order.timestamp).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}</div>
      <div class="center small">Ticket #${order.id.slice(-6).toUpperCase()}</div>
      <div class="divider"></div>
      ${order.tableNumber ? `<div class="center bold large">TABLE ${order.tableNumber}</div><div class="divider"></div>` : ''}
      <div class="bold large">${order.quantity}x ${order.recipeName}</div>
      <div class="small">${order.recipeCategory}</div>
      <div class="divider"></div>
      <div class="row">
        <span>Prix unitaire</span>
        <span>${formatCurrency(order.unitSellingPrice)}</span>
      </div>
      <div class="row bold">
        <span>Total</span>
        <span>${formatCurrency(order.quantity * order.unitSellingPrice)}</span>
      </div>
      <div class="divider"></div>
      <div class="center small">RestauMargin</div>
      <script>window.onload = function() { window.print(); }</script>
    </body>
    </html>
  `;
  ticketWindow.document.write(html);
  ticketWindow.document.close();
}

// ── Main Component ────────────────────────────────────────────────────

export default function ServiceTracker() {
  const navigate = useNavigate();
  const { selectedRestaurant } = useRestaurant();

  // Data
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);

  // Current service
  const [session, setSession] = useState<ServiceSession | null>(() => loadFromStorage(STORAGE_KEY, null));
  const [history, setHistory] = useState<ServiceSummary[]>(() => loadFromStorage(HISTORY_KEY, []));

  // UI state
  const [tab, setTab] = useState<Tab>('live');
  const [searchRecipe, setSearchRecipe] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [orderQty, setOrderQty] = useState(1);
  const [orderTable, setOrderTable] = useState<string>('');
  const [selectedRecipeId, setSelectedRecipeId] = useState<number | null>(null);
  const [showSummary, setShowSummary] = useState(false);
  const [summaryData, setSummaryData] = useState<ServiceSummary | null>(null);
  const [now, setNow] = useState(Date.now());
  const [calendarMonth, setCalendarMonth] = useState(() => {
    const d = new Date();
    return { year: d.getFullYear(), month: d.getMonth() };
  });
  const [selectedHistoryDate, setSelectedHistoryDate] = useState<string | null>(null);
  const [recentQuickAdd, setRecentQuickAdd] = useState<number[]>([]);

  // Timer tick
  useEffect(() => {
    const interval = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(interval);
  }, []);

  // Load recipes
  useEffect(() => {
    setLoading(true);
    fetchRecipes()
      .then(r => setRecipes(r))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [selectedRestaurant?.id]);

  // Persist session
  useEffect(() => {
    if (session) saveToStorage(STORAGE_KEY, session);
    else localStorage.removeItem(STORAGE_KEY);
  }, [session]);

  // Persist history
  useEffect(() => {
    saveToStorage(HISTORY_KEY, history);
  }, [history]);

  // Track recent recipe IDs from orders
  useEffect(() => {
    if (session && session.orders.length > 0) {
      const recentIds = [...new Set(session.orders.slice(-10).reverse().map(o => o.recipeId))].slice(0, 5);
      setRecentQuickAdd(recentIds);
    }
  }, [session?.orders.length]);

  // ── Computed values ─────────────────────────────────────────────────

  const categories = useMemo(() => {
    const cats = [...new Set(recipes.map(r => r.category).filter(Boolean))];
    cats.sort();
    return cats;
  }, [recipes]);

  // Deduplicate category tabs based on what's actually in the data
  const activeCategoryTabs = useMemo(() => {
    const matchedKeys = new Set<string | null>();
    const result: { key: string | null; label: string }[] = [{ key: null, label: 'Tous' }];
    for (const tab of CATEGORY_TABS) {
      if (tab.key === null) continue;
      if (categories.includes(tab.key) && !matchedKeys.has(tab.label)) {
        matchedKeys.add(tab.label);
        result.push({ key: tab.key, label: tab.label });
      }
    }
    // Add any categories not already covered
    for (const cat of categories) {
      if (!CATEGORY_TABS.some(t => t.key === cat)) {
        result.push({ key: cat, label: cat });
      }
    }
    return result;
  }, [categories]);

  const filteredRecipes = useMemo(() => {
    let filtered = recipes;
    if (selectedCategory) filtered = filtered.filter(r => r.category === selectedCategory);
    if (searchRecipe.trim()) {
      const q = searchRecipe.toLowerCase();
      filtered = filtered.filter(r => r.name.toLowerCase().includes(q));
    }
    return filtered.sort((a, b) => a.name.localeCompare(b.name));
  }, [recipes, selectedCategory, searchRecipe]);

  // Live stats
  const liveStats = useMemo(() => {
    if (!session) return { couverts: 0, ca: 0, cout: 0, marge: 0, margePercent: 0, avgTimePerOrder: 0 };
    const orders = session.orders;
    const couverts = orders.reduce((sum, o) => sum + o.quantity, 0);
    const ca = orders.reduce((sum, o) => sum + o.quantity * o.unitSellingPrice, 0);
    const cout = orders.reduce((sum, o) => sum + o.quantity * o.unitCost, 0);
    const marge = ca - cout;
    const margePercent = ca > 0 ? (marge / ca) * 100 : 0;

    // Average time between orders
    let avgTimePerOrder = 0;
    if (orders.length >= 2) {
      const sortedTimestamps = orders.map(o => o.timestamp).sort();
      const totalGap = sortedTimestamps[sortedTimestamps.length - 1] - sortedTimestamps[0];
      avgTimePerOrder = totalGap / (orders.length - 1);
    } else if (orders.length === 1) {
      avgTimePerOrder = orders[0].timestamp - session.startTime;
    }

    return { couverts, ca, cout, marge, margePercent, avgTimePerOrder };
  }, [session, now]);

  // Top plats in current service
  const topPlats = useMemo(() => {
    if (!session) return [];
    const map = new Map<string, { name: string; qty: number; ca: number }>();
    for (const o of session.orders) {
      const existing = map.get(o.recipeName) || { name: o.recipeName, qty: 0, ca: 0 };
      existing.qty += o.quantity;
      existing.ca += o.quantity * o.unitSellingPrice;
      map.set(o.recipeName, existing);
    }
    return [...map.values()].sort((a, b) => b.qty - a.qty);
  }, [session]);

  // Max CA in history for calendar intensity
  const maxHistoryCA = useMemo(() => {
    if (history.length === 0) return 0;
    return Math.max(...history.map(s => s.totalCA));
  }, [history]);

  // CA by date for calendar intensity
  const caByDate = useMemo(() => {
    const map = new Map<string, number>();
    history.forEach(s => {
      const current = map.get(s.date) || 0;
      map.set(s.date, current + s.totalCA);
    });
    return map;
  }, [history]);

  // ── Actions ─────────────────────────────────────────────────────────

  const startService = useCallback(() => {
    const newSession: ServiceSession = {
      id: `svc-${Date.now()}`,
      type: detectServiceType(),
      date: todayStr(),
      startTime: Date.now(),
      endTime: null,
      orders: [],
      isActive: true,
    };
    setSession(newSession);
    setShowSummary(false);
    setSummaryData(null);
  }, []);

  const addOrder = useCallback((overrideRecipeId?: number) => {
    const recipeId = overrideRecipeId || selectedRecipeId;
    if (!session || !recipeId) return;
    const recipe = recipes.find(r => r.id === recipeId);
    if (!recipe) return;

    const qty = overrideRecipeId ? 1 : orderQty;
    const tbl = overrideRecipeId ? '' : orderTable;

    const order: ServiceOrder = {
      id: `ord-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      recipeId: recipe.id,
      recipeName: recipe.name,
      recipeCategory: recipe.category,
      quantity: qty,
      unitSellingPrice: recipe.sellingPrice / (recipe.nbPortions || 1),
      unitCost: getRecipeCost(recipe),
      tableNumber: tbl ? parseInt(tbl) : null,
      timestamp: Date.now(),
    };

    setSession(prev => prev ? { ...prev, orders: [...prev.orders, order] } : prev);
    if (!overrideRecipeId) {
      setSelectedRecipeId(null);
      setOrderQty(1);
      setOrderTable('');
    }
  }, [session, selectedRecipeId, recipes, orderQty, orderTable]);

  const removeOrder = useCallback((orderId: string) => {
    setSession(prev => prev ? { ...prev, orders: prev.orders.filter(o => o.id !== orderId) } : prev);
  }, []);

  const endService = useCallback(() => {
    if (!session) return;

    const orders = session.orders;
    const totalCouverts = orders.reduce((s, o) => s + o.quantity, 0);
    const totalCA = orders.reduce((s, o) => s + o.quantity * o.unitSellingPrice, 0);
    const totalCout = orders.reduce((s, o) => s + o.quantity * o.unitCost, 0);
    const margeBrute = totalCA - totalCout;
    const margePercent = totalCA > 0 ? (margeBrute / totalCA) * 100 : 0;

    // Top 3 plats
    const platMap = new Map<string, { name: string; qty: number; ca: number }>();
    for (const o of orders) {
      const e = platMap.get(o.recipeName) || { name: o.recipeName, qty: 0, ca: 0 };
      e.qty += o.quantity;
      e.ca += o.quantity * o.unitSellingPrice;
      platMap.set(o.recipeName, e);
    }
    const topPlats = [...platMap.values()].sort((a, b) => b.qty - a.qty).slice(0, 3);

    const summary: ServiceSummary = {
      id: session.id,
      type: session.type,
      date: session.date,
      startTime: session.startTime,
      endTime: Date.now(),
      totalCouverts,
      totalCA,
      totalCout,
      margeBrute,
      margePercent,
      topPlats,
      orders,
    };

    setHistory(prev => [summary, ...prev]);
    setSummaryData(summary);
    setShowSummary(true);
    setSession(null);

    // Save to API (fire and forget)
    const token = getToken();
    if (token) {
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      };
      if (selectedRestaurant?.id) {
        headers['X-Restaurant-Id'] = String(selectedRestaurant.id);
      }
      fetch(`${API_BASE}/services`, {
        method: 'POST',
        headers,
        body: JSON.stringify(summary),
      }).catch(() => { /* silent */ });
    }
  }, [session, selectedRestaurant]);

  const exportService = useCallback((svc: ServiceSummary) => {
    const lines = [
      `========================================`,
      `    BILAN DE SERVICE`,
      `========================================`,
      ``,
      `Service ${svc.type === 'midi' ? 'du Midi' : 'du Soir'} -- ${formatDate(svc.date)}`,
      `Debut: ${formatTime(svc.startTime)} | Fin: ${formatTime(svc.endTime)}`,
      `Duree: ${formatDuration(svc.endTime - svc.startTime)}`,
      ``,
      `--- RESUME ---`,
      `Couverts: ${svc.totalCouverts}`,
      `CA: ${formatCurrency(svc.totalCA)}`,
      `Cout matieres: ${formatCurrency(svc.totalCout)}`,
      `Marge brute: ${formatCurrency(svc.margeBrute)} (${svc.margePercent.toFixed(1)}%)`,
      ``,
      `--- TOP PLATS ---`,
      ...svc.topPlats.map((p, i) => `  ${i + 1}. ${p.name} -- ${p.qty}x (${formatCurrency(p.ca)})`),
      ``,
      `--- DETAIL COMMANDES ---`,
      ...svc.orders.map(o => `  ${formatTime(o.timestamp)} | ${o.recipeName} x${o.quantity}${o.tableNumber ? ` (T${o.tableNumber})` : ''} -- ${formatCurrency(o.quantity * o.unitSellingPrice)}`),
      ``,
      `========================================`,
      `  Genere par RestauMargin`,
      `========================================`,
    ];
    const blob = new Blob([lines.join('\n')], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `bilan-service-${svc.date}-${svc.type}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  }, []);

  // ── Calendar helpers ─────────────────────────────────────────────────

  const calendarDays = useMemo(() => {
    const { year, month } = calendarMonth;
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const offset = firstDay === 0 ? 6 : firstDay - 1; // Monday start
    const days: (number | null)[] = [];
    for (let i = 0; i < offset; i++) days.push(null);
    for (let i = 1; i <= daysInMonth; i++) days.push(i);
    return days;
  }, [calendarMonth]);

  const datesWithServices = useMemo(() => {
    const set = new Set<string>();
    history.forEach(s => set.add(s.date));
    return set;
  }, [history]);

  const servicesForDate = useMemo(() => {
    if (!selectedHistoryDate) return [];
    return history.filter(s => s.date === selectedHistoryDate);
  }, [history, selectedHistoryDate]);

  // Stats per day for calendar
  const dayStats = useMemo(() => {
    if (!selectedHistoryDate) return null;
    const services = servicesForDate;
    if (services.length === 0) return null;
    const totalCA = services.reduce((s, svc) => s + svc.totalCA, 0);
    const totalCouverts = services.reduce((s, svc) => s + svc.totalCouverts, 0);
    const totalMarge = services.reduce((s, svc) => s + svc.margeBrute, 0);
    const avgMarge = totalCA > 0 ? (totalMarge / totalCA) * 100 : 0;
    return { totalCA, totalCouverts, totalMarge, avgMarge, count: services.length };
  }, [servicesForDate, selectedHistoryDate]);

  // Same day last week comparison
  const lastWeekComparison = useMemo(() => {
    if (!summaryData) return null;
    const d = new Date(summaryData.date + 'T12:00:00');
    d.setDate(d.getDate() - 7);
    const lastWeekDate = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
    const lastWeekService = history.find(s => s.date === lastWeekDate && s.type === summaryData.type);
    if (!lastWeekService) return null;
    return {
      caDiff: summaryData.totalCA - lastWeekService.totalCA,
      caDiffPercent: lastWeekService.totalCA > 0 ? ((summaryData.totalCA - lastWeekService.totalCA) / lastWeekService.totalCA) * 100 : 0,
      couvertsDiff: summaryData.totalCouverts - lastWeekService.totalCouverts,
      margeDiff: summaryData.margePercent - lastWeekService.margePercent,
    };
  }, [summaryData, history]);

  // ── P&L Bar percentages ─────────────────────────────────────────────

  const plBarPercent = useMemo(() => {
    if (liveStats.ca <= 0) return { marge: 50, cout: 50 };
    const margeP = (liveStats.marge / liveStats.ca) * 100;
    const coutP = (liveStats.cout / liveStats.ca) * 100;
    return { marge: Math.max(0, margeP), cout: Math.max(0, coutP) };
  }, [liveStats]);

  // ── Render ──────────────────────────────────────────────────────────

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-4 border-teal-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-4 pb-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-[#111111] dark:text-white font-satoshi flex items-center gap-2">
            <Timer className="w-7 h-7 text-teal-400" />
            Suivi de Service
          </h1>
          <p className="text-sm text-[#737373] dark:text-[#A3A3A3] mt-0.5">Suivi en temps reel des couts et marges pendant le service</p>
        </div>

        {/* Tabs */}
        <div className="flex bg-[#F5F5F5] dark:bg-[#0A0A0A] rounded-xl p-1 gap-1 border border-[#E5E7EB] dark:border-[#1A1A1A]">
          <button
            onClick={() => setTab('live')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              tab === 'live' ? 'bg-teal-600 text-white shadow-lg' : 'text-[#737373] dark:text-[#A3A3A3] hover:text-[#111111] dark:hover:text-white'
            }`}
          >
            <Play className="w-4 h-4 inline mr-1.5" />
            Service Live
          </button>
          <button
            onClick={() => setTab('history')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              tab === 'history' ? 'bg-teal-600 text-white shadow-lg' : 'text-[#737373] dark:text-[#A3A3A3] hover:text-[#111111] dark:hover:text-white'
            }`}
          >
            <CalendarDays className="w-4 h-4 inline mr-1.5" />
            Historique
          </button>
        </div>
      </div>

      {/* ================================================================ */}
      {/* TAB: LIVE SERVICE                                                */}
      {/* ================================================================ */}
      {tab === 'live' && (
        <>
          {/* ── Live P&L Bar ─────────────────────────────────────────── */}
          {session && (
            <div className="bg-white dark:bg-[#0A0A0A]/50 border border-[#E5E7EB] dark:border-[#1A1A1A] rounded-2xl p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold text-[#737373] dark:text-[#A3A3A3] uppercase tracking-wider">P&L en temps reel</span>
                <span className="text-xs text-[#737373] dark:text-[#A3A3A3]">
                  Objectif marge: 70%
                </span>
              </div>
              <div className="relative h-8 rounded-full overflow-hidden bg-[#E5E7EB] dark:bg-[#262626]">
                {/* Green = marge */}
                <div
                  className="absolute inset-y-0 left-0 bg-gradient-to-r from-emerald-600 to-emerald-500 transition-all duration-700 ease-out flex items-center justify-center"
                  style={{ width: `${plBarPercent.marge}%` }}
                >
                  {plBarPercent.marge > 15 && (
                    <span className="text-[11px] font-bold text-white drop-shadow">
                      Marge {plBarPercent.marge.toFixed(1)}%
                    </span>
                  )}
                </div>
                {/* Red = cout */}
                <div
                  className="absolute inset-y-0 right-0 bg-gradient-to-l from-red-600 to-red-500 transition-all duration-700 ease-out flex items-center justify-center"
                  style={{ width: `${plBarPercent.cout}%` }}
                >
                  {plBarPercent.cout > 15 && (
                    <span className="text-[11px] font-bold text-white drop-shadow">
                      Cout {plBarPercent.cout.toFixed(1)}%
                    </span>
                  )}
                </div>
                {/* Target line at 70% from left */}
                <div
                  className="absolute inset-y-0 w-0.5 bg-yellow-400 z-10"
                  style={{ left: '70%' }}
                  title="Objectif 70% marge"
                />
                <div
                  className="absolute -top-0.5 text-[9px] text-yellow-400 font-bold z-10"
                  style={{ left: '70%', transform: 'translateX(-50%)' }}
                >
                  70%
                </div>
              </div>
            </div>
          )}

          {/* ── Service Status Panel ────────────────────────────────── */}
          <div className="bg-white dark:bg-[#0A0A0A]/50 border border-[#E5E7EB] dark:border-[#1A1A1A] rounded-2xl p-5">
            {!session && !showSummary && (
              <div className="text-center py-12">
                <div className="w-20 h-20 mx-auto rounded-full bg-teal-500/10 flex items-center justify-center mb-4">
                  <Play className="w-10 h-10 text-teal-400" />
                </div>
                <h2 className="text-xl font-bold text-[#111111] dark:text-white mb-2">Aucun service en cours</h2>
                <p className="text-[#737373] dark:text-[#A3A3A3] mb-6 max-w-md mx-auto">
                  Demarrez un service pour suivre les commandes, le CA et la marge en temps reel.
                </p>
                <button
                  onClick={startService}
                  className="px-8 py-3.5 bg-teal-600 hover:bg-teal-500 text-white rounded-xl font-semibold text-lg transition-all active:scale-95 shadow-lg shadow-teal-600/20"
                >
                  <Play className="w-5 h-5 inline mr-2" />
                  Demarrer le service {detectServiceType() === 'midi' ? 'du Midi' : 'du Soir'}
                </button>
              </div>
            )}

            {/* ── Summary modal ──────────────────────────────────────── */}
            {showSummary && summaryData && (
              <div className="space-y-5">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-bold text-[#111111] dark:text-white flex items-center gap-2">
                    <Award className="w-6 h-6 text-yellow-400" />
                    Bilan du Service {summaryData.type === 'midi' ? 'du Midi' : 'du Soir'}
                  </h2>
                  <button
                    onClick={() => { setShowSummary(false); setSummaryData(null); }}
                    className="p-2 hover:bg-[#F5F5F5] dark:hover:bg-[#262626] rounded-lg transition-colors"
                  >
                    <X className="w-5 h-5 text-[#A3A3A3]" />
                  </button>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                  {[
                    { label: 'Couverts', value: String(summaryData.totalCouverts), icon: Users, color: 'text-blue-400' },
                    { label: 'CA', value: formatCurrency(summaryData.totalCA), icon: DollarSign, color: 'text-emerald-400' },
                    { label: 'Cout matieres', value: formatCurrency(summaryData.totalCout), icon: TrendingUp, color: 'text-red-400' },
                    { label: 'Marge brute', value: formatCurrency(summaryData.margeBrute), icon: BarChart3, color: 'text-teal-400' },
                    { label: 'Marge %', value: `${summaryData.margePercent.toFixed(1)}%`, icon: TrendingUp, color: summaryData.margePercent >= 70 ? 'text-emerald-400' : 'text-amber-400' },
                  ].map(s => (
                    <div key={s.label} className="bg-[#F5F5F5] dark:bg-[#262626]/60 rounded-xl p-3 text-center">
                      <s.icon className={`w-5 h-5 mx-auto mb-1 ${s.color}`} />
                      <div className="text-lg font-bold text-[#111111] dark:text-white">{s.value}</div>
                      <div className="text-[11px] text-[#737373] dark:text-[#A3A3A3]">{s.label}</div>
                    </div>
                  ))}
                </div>

                {/* Top 3 plats */}
                {summaryData.topPlats.length > 0 && (
                  <div>
                    <h3 className="text-sm font-semibold text-[#404040] dark:text-[#D4D4D4] mb-2">Top 3 plats vendus</h3>
                    <div className="space-y-2">
                      {summaryData.topPlats.map((p, i) => (
                        <div key={p.name} className="flex items-center gap-3 bg-[#F5F5F5] dark:bg-[#262626]/40 rounded-lg px-3 py-2">
                          <span className="text-lg font-bold text-yellow-400 w-6">#{i + 1}</span>
                          <span className="flex-1 text-[#111111] dark:text-white font-medium">{p.name}</span>
                          <span className="text-[#525252] dark:text-[#D4D4D4] text-sm">{p.qty}x</span>
                          <span className="text-emerald-400 text-sm font-semibold">{formatCurrency(p.ca)}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Last week comparison */}
                {lastWeekComparison && (
                  <div className="bg-[#F5F5F5] dark:bg-[#262626]/40 rounded-xl p-4">
                    <h3 className="text-sm font-semibold text-[#404040] dark:text-[#D4D4D4] mb-2">vs. meme jour semaine derniere</h3>
                    <div className="grid grid-cols-3 gap-3 text-center">
                      <div>
                        <div className={`text-lg font-bold ${lastWeekComparison.caDiff >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                          {lastWeekComparison.caDiff >= 0 ? '+' : ''}{lastWeekComparison.caDiffPercent.toFixed(1)}%
                        </div>
                        <div className="text-[11px] text-[#737373] dark:text-[#A3A3A3]">CA</div>
                      </div>
                      <div>
                        <div className={`text-lg font-bold ${lastWeekComparison.couvertsDiff >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                          {lastWeekComparison.couvertsDiff >= 0 ? '+' : ''}{lastWeekComparison.couvertsDiff}
                        </div>
                        <div className="text-[11px] text-[#737373] dark:text-[#A3A3A3]">Couverts</div>
                      </div>
                      <div>
                        <div className={`text-lg font-bold ${lastWeekComparison.margeDiff >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                          {lastWeekComparison.margeDiff >= 0 ? '+' : ''}{lastWeekComparison.margeDiff.toFixed(1)}pt
                        </div>
                        <div className="text-[11px] text-[#737373] dark:text-[#A3A3A3]">Marge</div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Actions */}
                <div className="flex flex-wrap gap-3">
                  <button
                    onClick={() => exportService(summaryData)}
                    className="px-4 py-2.5 bg-[#111111] dark:bg-white text-white dark:text-[#111111] hover:bg-[#262626] dark:hover:bg-[#E5E7EB] rounded-xl text-sm font-medium transition-all flex items-center gap-2"
                  >
                    <Download className="w-4 h-4" />
                    Exporter le bilan
                  </button>
                  <button
                    onClick={() => { setShowSummary(false); setSummaryData(null); }}
                    className="px-4 py-2.5 bg-teal-600 hover:bg-teal-500 text-white rounded-xl text-sm font-medium transition-all flex items-center gap-2"
                  >
                    <Play className="w-4 h-4" />
                    Nouveau service
                  </button>
                </div>
              </div>
            )}

            {/* ── Active session ─────────────────────────────────────── */}
            {session && (
              <div className="space-y-5">
                {/* Service header */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                  <div>
                    <h2 className="text-xl font-bold text-[#111111] dark:text-white flex items-center gap-2">
                      <span className="relative flex h-3 w-3">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                        <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500" />
                      </span>
                      Service {session.type === 'midi' ? 'du Midi' : 'du Soir'}
                    </h2>
                    <div className="flex items-center gap-4 mt-1 text-sm text-[#737373] dark:text-[#A3A3A3]">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" />
                        En cours depuis {formatDuration(now - session.startTime)}
                      </span>
                      <span className="flex items-center gap-1">
                        <CalendarDays className="w-3.5 h-3.5" />
                        {formatDate(session.date)}
                      </span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => navigate('/kitchen-mode')}
                      className="px-3 py-2 bg-[#111111] dark:bg-white text-white dark:text-[#111111] hover:bg-[#262626] dark:hover:bg-[#E5E7EB] rounded-xl text-sm font-medium transition-all flex items-center gap-1.5"
                    >
                      <Monitor className="w-4 h-4" />
                      Afficher en cuisine
                    </button>
                    <button
                      onClick={endService}
                      className="px-4 py-2 bg-red-600 hover:bg-red-500 text-white rounded-xl text-sm font-medium transition-all flex items-center gap-1.5 active:scale-95"
                    >
                      <Square className="w-4 h-4" />
                      Terminer le service
                    </button>
                  </div>
                </div>

                {/* ── 6 Live Dashboard KPIs ──────────────────────────── */}
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
                  {/* 1. Couverts */}
                  <div className="bg-white dark:bg-[#0A0A0A] border border-blue-200 dark:border-blue-900/40 rounded-xl p-4 text-center">
                    <Users className="w-5 h-5 mx-auto mb-1 text-blue-500" />
                    <div className="text-2xl font-bold text-[#111111] dark:text-white tabular-nums">
                      <AnimatedValue value={liveStats.couverts} decimals={0} />
                    </div>
                    <div className="text-[11px] text-[#737373] dark:text-[#A3A3A3]">Couverts</div>
                  </div>
                  {/* 2. CA en temps reel */}
                  <div className="bg-white dark:bg-[#0A0A0A] border border-emerald-200 dark:border-emerald-900/40 rounded-xl p-4 text-center">
                    <DollarSign className="w-5 h-5 mx-auto mb-1 text-emerald-500" />
                    <div className="text-2xl font-bold text-[#111111] dark:text-white tabular-nums">
                      <AnimatedValue value={liveStats.ca} suffix={currencySuffix()} />
                    </div>
                    <div className="text-[11px] text-[#737373] dark:text-[#A3A3A3]">CA temps reel</div>
                  </div>
                  {/* 3. Cout matieres cumule */}
                  <div className="bg-white dark:bg-[#0A0A0A] border border-red-200 dark:border-red-900/40 rounded-xl p-4 text-center">
                    <ShoppingBag className="w-5 h-5 mx-auto mb-1 text-red-500" />
                    <div className="text-2xl font-bold text-[#111111] dark:text-white tabular-nums">
                      <AnimatedValue value={liveStats.cout} suffix={currencySuffix()} />
                    </div>
                    <div className="text-[11px] text-[#737373] dark:text-[#A3A3A3]">Cout matieres</div>
                  </div>
                  {/* 4. Marge brute EUR */}
                  <div className="bg-white dark:bg-[#0A0A0A] border border-teal-200 dark:border-teal-900/40 rounded-xl p-4 text-center">
                    <TrendingUp className="w-5 h-5 mx-auto mb-1 text-teal-500" />
                    <div className="text-2xl font-bold text-[#111111] dark:text-white tabular-nums">
                      <AnimatedValue value={liveStats.marge} suffix={currencySuffix()} />
                    </div>
                    <div className="text-[11px] text-[#737373] dark:text-[#A3A3A3]">Marge brute</div>
                  </div>
                  {/* 5. Marge % (color-coded gauge) */}
                  <div className="bg-white dark:bg-[#0A0A0A] border border-[#E5E7EB] dark:border-[#1A1A1A] rounded-xl p-4 text-center">
                    <MargeGauge percent={liveStats.margePercent} />
                    <div className={`text-lg font-bold tabular-nums mt-1 ${
                      liveStats.margePercent >= 70 ? 'text-emerald-500' : liveStats.margePercent >= 50 ? 'text-amber-500' : 'text-red-500'
                    }`}>
                      <AnimatedValue value={liveStats.margePercent} suffix="%" decimals={1} />
                    </div>
                    <div className="text-[11px] text-[#737373] dark:text-[#A3A3A3]">Marge %</div>
                  </div>
                  {/* 6. Temps moyen par commande */}
                  <div className="bg-white dark:bg-[#0A0A0A] border border-purple-200 dark:border-purple-900/40 rounded-xl p-4 text-center">
                    <Zap className="w-5 h-5 mx-auto mb-1 text-purple-500" />
                    <div className="text-2xl font-bold text-[#111111] dark:text-white tabular-nums">
                      {liveStats.avgTimePerOrder > 0 ? formatDuration(liveStats.avgTimePerOrder) : '--'}
                    </div>
                    <div className="text-[11px] text-[#737373] dark:text-[#A3A3A3]">Temps moy/cmd</div>
                  </div>
                </div>

                {/* ── Smart Order Entry ─────────────────────────────── */}
                <div>
                  <h3 className="text-sm font-semibold text-[#404040] dark:text-[#D4D4D4] mb-3 flex items-center gap-2">
                    <ChefHat className="w-4 h-4 text-teal-400" />
                    Ajouter une commande
                  </h3>

                  {/* Recent orders quick-add */}
                  {recentQuickAdd.length > 0 && (
                    <div className="mb-3">
                      <div className="text-[11px] text-[#737373] dark:text-[#A3A3A3] uppercase tracking-wider mb-1.5 font-medium">Ajout rapide</div>
                      <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
                        {recentQuickAdd.map(rid => {
                          const r = recipes.find(rec => rec.id === rid);
                          if (!r) return null;
                          return (
                            <button
                              key={rid}
                              onClick={() => addOrder(rid)}
                              className="flex items-center gap-2 px-3 py-2 bg-[#F5F5F5] dark:bg-[#0A0A0A] border border-[#E5E7EB] dark:border-[#1A1A1A] rounded-lg hover:border-teal-500 dark:hover:border-teal-500 transition-all whitespace-nowrap active:scale-95"
                            >
                              <div className="w-6 h-6 flex-shrink-0">
                                <FoodIllustration recipeName={r.name} category={r.category} size="sm" animated={false} />
                              </div>
                              <span className="text-xs font-medium text-[#111111] dark:text-white">{r.name}</span>
                              <Plus className="w-3 h-3 text-teal-500" />
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* Search & category tabs */}
                  <div className="flex flex-col sm:flex-row gap-2 mb-3">
                    <div className="relative flex-1">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#737373]" />
                      <input
                        type="text"
                        value={searchRecipe}
                        onChange={e => setSearchRecipe(e.target.value)}
                        placeholder="Rechercher une recette..."
                        className="w-full pl-9 pr-3 py-2.5 bg-[#F5F5F5] dark:bg-[#262626] border border-[#E5E7EB] dark:border-[#262626] rounded-lg text-[#111111] dark:text-white text-sm placeholder:text-[#737373] focus:outline-none focus:ring-2 focus:ring-teal-500/50"
                      />
                    </div>
                    <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-hide">
                      {activeCategoryTabs.map(catTab => (
                        <button
                          key={catTab.label + (catTab.key || 'all')}
                          onClick={() => setSelectedCategory(catTab.key === selectedCategory ? null : catTab.key)}
                          className={`px-3 py-2 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${
                            (catTab.key === null && !selectedCategory) || selectedCategory === catTab.key
                              ? 'bg-teal-600 text-white'
                              : 'bg-[#F5F5F5] dark:bg-[#0A0A0A] border border-[#E5E7EB] dark:border-[#1A1A1A] text-[#737373] dark:text-[#A3A3A3] hover:text-[#111111] dark:hover:text-white hover:border-[#D4D4D4] dark:hover:border-[#404040]'
                          }`}
                        >
                          {catTab.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Recipe grid with FoodIllustration + margin badge */}
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2 max-h-[320px] overflow-y-auto pr-1 scrollbar-thin">
                    {filteredRecipes.map(recipe => {
                      const isSelected = selectedRecipeId === recipe.id;
                      const cost = getRecipeCost(recipe);
                      const price = recipe.sellingPrice / (recipe.nbPortions || 1);
                      const marginPct = getRecipeMarginPercent(recipe);
                      return (
                        <button
                          key={recipe.id}
                          onClick={() => setSelectedRecipeId(isSelected ? null : recipe.id)}
                          className={`relative p-3 rounded-xl text-left transition-all active:scale-95 ${
                            isSelected
                              ? 'bg-teal-50 dark:bg-teal-900/20 border-2 border-teal-500 ring-2 ring-teal-500/30'
                              : 'bg-[#F5F5F5] dark:bg-[#0A0A0A] border border-[#E5E7EB] dark:border-[#1A1A1A] hover:border-[#D4D4D4] dark:hover:border-[#404040]'
                          }`}
                        >
                          {/* FoodIllustration */}
                          <div className="w-10 h-10 mb-2">
                            <FoodIllustration recipeName={recipe.name} category={recipe.category} size="sm" animated={false} />
                          </div>
                          <div className="text-sm font-medium text-[#111111] dark:text-white truncate">{recipe.name}</div>
                          <div className="text-[11px] text-[#A3A3A3] mt-0.5">{recipe.category}</div>
                          <div className="flex items-center justify-between mt-1.5 gap-1">
                            <span className="text-xs font-semibold text-emerald-500">{formatCurrency(price)}</span>
                            <MarginBadge percent={marginPct} />
                          </div>
                          {isSelected && (
                            <div className="absolute top-1.5 right-1.5 w-5 h-5 bg-teal-500 rounded-full flex items-center justify-center">
                              <Plus className="w-3 h-3 text-white" />
                            </div>
                          )}
                        </button>
                      );
                    })}
                    {filteredRecipes.length === 0 && (
                      <div className="col-span-full text-center py-8 text-[#737373] text-sm">
                        Aucune recette trouvee
                      </div>
                    )}
                  </div>

                  {/* Quantity & table input + add button */}
                  {selectedRecipeId && (
                    <div className="mt-3 flex flex-col sm:flex-row items-stretch sm:items-center gap-2 bg-[#F5F5F5] dark:bg-[#0A0A0A] rounded-xl p-3 border border-teal-500/20">
                      <div className="flex-1 flex items-center gap-2">
                        <div className="w-8 h-8 flex-shrink-0">
                          <FoodIllustration
                            recipeName={recipes.find(r => r.id === selectedRecipeId)?.name}
                            category={recipes.find(r => r.id === selectedRecipeId)?.category}
                            size="sm"
                            animated={false}
                          />
                        </div>
                        <span className="text-sm text-[#111111] dark:text-white font-medium truncate">
                          {recipes.find(r => r.id === selectedRecipeId)?.name}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        {/* Quantity */}
                        <div className="flex items-center bg-white dark:bg-black rounded-lg border border-[#E5E7EB] dark:border-[#1A1A1A] overflow-hidden">
                          <button
                            onClick={() => setOrderQty(Math.max(1, orderQty - 1))}
                            className="p-2 hover:bg-[#F5F5F5] dark:hover:bg-[#262626] transition-colors"
                          >
                            <Minus className="w-4 h-4 text-[#737373] dark:text-[#A3A3A3]" />
                          </button>
                          <span className="w-8 text-center text-[#111111] dark:text-white font-bold text-sm tabular-nums">{orderQty}</span>
                          <button
                            onClick={() => setOrderQty(orderQty + 1)}
                            className="p-2 hover:bg-[#F5F5F5] dark:hover:bg-[#262626] transition-colors"
                          >
                            <Plus className="w-4 h-4 text-[#737373] dark:text-[#A3A3A3]" />
                          </button>
                        </div>

                        {/* Table number */}
                        <div className="relative">
                          <Hash className="absolute left-2 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#737373]" />
                          <input
                            type="number"
                            value={orderTable}
                            onChange={e => setOrderTable(e.target.value)}
                            placeholder="Table"
                            className="w-20 pl-7 pr-2 py-2 bg-white dark:bg-black border border-[#E5E7EB] dark:border-[#1A1A1A] rounded-lg text-[#111111] dark:text-white text-sm placeholder:text-[#737373] focus:outline-none focus:ring-2 focus:ring-teal-500/50"
                          />
                        </div>

                        {/* Add */}
                        <button
                          onClick={() => addOrder()}
                          className="px-4 py-2 bg-teal-600 hover:bg-teal-500 text-white rounded-lg text-sm font-medium transition-all active:scale-95 flex items-center gap-1.5"
                        >
                          <Plus className="w-4 h-4" />
                          Ajouter
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                {/* ── Recent orders ──────────────────────────────────── */}
                {session.orders.length > 0 && (
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-sm font-semibold text-[#404040] dark:text-[#D4D4D4] flex items-center gap-2">
                        <Utensils className="w-4 h-4 text-teal-400" />
                        Commandes ({session.orders.length})
                      </h3>
                      {topPlats.length > 0 && (
                        <span className="text-xs text-[#737373] dark:text-[#A3A3A3]">
                          Top: {topPlats[0].name} ({topPlats[0].qty}x)
                        </span>
                      )}
                    </div>
                    <div className="space-y-1.5 max-h-[280px] overflow-y-auto pr-1 scrollbar-thin">
                      {[...session.orders].reverse().map(order => (
                        <div
                          key={order.id}
                          className="flex items-center gap-3 bg-[#F5F5F5] dark:bg-[#0A0A0A] border border-[#E5E7EB] dark:border-[#1A1A1A] rounded-lg px-3 py-2 group transition-all hover:bg-white dark:hover:bg-[#0A0A0A]/80"
                        >
                          <div className="w-8 h-8 flex-shrink-0">
                            <FoodIllustration recipeName={order.recipeName} category={order.recipeCategory} size="sm" animated={false} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="text-sm font-medium text-[#111111] dark:text-white truncate">
                              {order.recipeName}
                              <span className="text-[#737373] dark:text-[#A3A3A3] font-normal"> x{order.quantity}</span>
                            </div>
                            <div className="text-[11px] text-[#737373] dark:text-[#A3A3A3] flex items-center gap-2">
                              <span>{formatTime(order.timestamp)}</span>
                              {order.tableNumber && <span>Table {order.tableNumber}</span>}
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-sm font-semibold text-emerald-500">
                              +{formatCurrency(order.quantity * order.unitSellingPrice)}
                            </div>
                            <div className="text-[10px] text-red-400/60">
                              cout {formatCurrency(order.quantity * order.unitCost)}
                            </div>
                          </div>
                          {/* Print ticket */}
                          <button
                            onClick={() => printKitchenTicket(order, session.type)}
                            className="p-1.5 opacity-0 group-hover:opacity-100 hover:bg-[#E5E7EB] dark:hover:bg-[#262626] rounded-lg transition-all"
                            title="Imprimer ticket cuisine"
                          >
                            <Printer className="w-3.5 h-3.5 text-[#737373] dark:text-[#A3A3A3]" />
                          </button>
                          {/* Remove */}
                          <button
                            onClick={() => removeOrder(order.id)}
                            className="p-1.5 opacity-0 group-hover:opacity-100 hover:bg-red-100 dark:hover:bg-red-900/20 rounded-lg transition-all"
                            title="Supprimer"
                          >
                            <X className="w-3.5 h-3.5 text-red-400" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </>
      )}

      {/* ================================================================ */}
      {/* TAB: HISTORY                                                     */}
      {/* ================================================================ */}
      {tab === 'history' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Calendar */}
          <div className="bg-white dark:bg-[#0A0A0A]/50 border border-[#E5E7EB] dark:border-[#1A1A1A] rounded-2xl p-4">
            <div className="flex items-center justify-between mb-3">
              <button
                onClick={() => setCalendarMonth(prev => {
                  const d = new Date(prev.year, prev.month - 1, 1);
                  return { year: d.getFullYear(), month: d.getMonth() };
                })}
                className="p-1.5 hover:bg-[#F5F5F5] dark:hover:bg-[#262626] rounded-lg transition-colors"
              >
                <ChevronLeft className="w-4 h-4 text-[#737373] dark:text-[#A3A3A3]" />
              </button>
              <span className="text-sm font-semibold text-[#111111] dark:text-white capitalize">
                {new Date(calendarMonth.year, calendarMonth.month).toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' })}
              </span>
              <button
                onClick={() => setCalendarMonth(prev => {
                  const d = new Date(prev.year, prev.month + 1, 1);
                  return { year: d.getFullYear(), month: d.getMonth() };
                })}
                className="p-1.5 hover:bg-[#F5F5F5] dark:hover:bg-[#262626] rounded-lg transition-colors"
              >
                <ChevronRight className="w-4 h-4 text-[#737373] dark:text-[#A3A3A3]" />
              </button>
            </div>

            {/* Day headers */}
            <div className="grid grid-cols-7 gap-1 mb-1">
              {['L', 'M', 'M', 'J', 'V', 'S', 'D'].map((d, i) => (
                <div key={i} className="text-center text-[10px] text-[#737373] dark:text-[#A3A3A3] font-medium py-1">{d}</div>
              ))}
            </div>

            {/* Days with CA-based color intensity */}
            <div className="grid grid-cols-7 gap-1">
              {calendarDays.map((day, i) => {
                if (day === null) return <div key={i} />;
                const dateStr = `${calendarMonth.year}-${String(calendarMonth.month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
                const hasService = datesWithServices.has(dateStr);
                const isSelected = selectedHistoryDate === dateStr;
                const isToday = dateStr === todayStr();
                const dayCA = caByDate.get(dateStr) || 0;
                const intensity = maxHistoryCA > 0 && dayCA > 0 ? Math.max(0.15, dayCA / maxHistoryCA) : 0;

                return (
                  <button
                    key={i}
                    onClick={() => setSelectedHistoryDate(isSelected ? null : dateStr)}
                    className={`relative h-9 rounded-lg text-xs font-medium transition-all ${
                      isSelected
                        ? 'bg-teal-600 text-white'
                        : isToday
                          ? 'bg-[#E5E7EB] dark:bg-[#404040] text-[#111111] dark:text-white'
                          : hasService
                            ? 'text-[#111111] dark:text-white hover:ring-1 hover:ring-teal-400/50'
                            : 'text-[#737373] dark:text-[#525252] hover:bg-[#F5F5F5] dark:hover:bg-[#0A0A0A]'
                    }`}
                    style={hasService && !isSelected ? {
                      backgroundColor: `rgba(20, 184, 166, ${intensity * 0.35})`,
                    } : undefined}
                  >
                    {day}
                    {hasService && !isSelected && (
                      <span className="absolute bottom-0.5 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-teal-500" />
                    )}
                  </button>
                );
              })}
            </div>

            {/* Legend */}
            <div className="flex items-center gap-3 mt-3 text-[10px] text-[#737373] dark:text-[#A3A3A3]">
              <span className="flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-teal-400" /> Service
              </span>
              <span className="flex items-center gap-1">
                <span className="inline-block w-3 h-2 rounded-sm" style={{ background: 'linear-gradient(90deg, rgba(20,184,166,0.1), rgba(20,184,166,0.4))' }} />
                CA intensite
              </span>
            </div>

            {/* Day stats summary */}
            {dayStats && (
              <div className="mt-4 pt-3 border-t border-[#E5E7EB] dark:border-[#1A1A1A] space-y-2">
                <div className="text-xs font-semibold text-[#111111] dark:text-white">
                  Resume du {formatDate(selectedHistoryDate!)}
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div className="bg-[#F5F5F5] dark:bg-[#0A0A0A] rounded-lg p-2 text-center">
                    <div className="text-sm font-bold text-emerald-500">{formatCurrency(dayStats.totalCA)}</div>
                    <div className="text-[9px] text-[#737373] dark:text-[#A3A3A3]">CA total</div>
                  </div>
                  <div className="bg-[#F5F5F5] dark:bg-[#0A0A0A] rounded-lg p-2 text-center">
                    <div className="text-sm font-bold text-[#111111] dark:text-white">{dayStats.totalCouverts}</div>
                    <div className="text-[9px] text-[#737373] dark:text-[#A3A3A3]">Couverts</div>
                  </div>
                  <div className="bg-[#F5F5F5] dark:bg-[#0A0A0A] rounded-lg p-2 text-center">
                    <div className="text-sm font-bold text-teal-500">{formatCurrency(dayStats.totalMarge)}</div>
                    <div className="text-[9px] text-[#737373] dark:text-[#A3A3A3]">Marge brute</div>
                  </div>
                  <div className="bg-[#F5F5F5] dark:bg-[#0A0A0A] rounded-lg p-2 text-center">
                    <div className={`text-sm font-bold ${dayStats.avgMarge >= 70 ? 'text-emerald-500' : 'text-amber-500'}`}>
                      {dayStats.avgMarge.toFixed(1)}%
                    </div>
                    <div className="text-[9px] text-[#737373] dark:text-[#A3A3A3]">Marge moy.</div>
                  </div>
                </div>
                <div className="text-[10px] text-[#737373] dark:text-[#A3A3A3] text-center">
                  {dayStats.count} service{dayStats.count > 1 ? 's' : ''}
                </div>
              </div>
            )}
          </div>

          {/* Service list for selected date */}
          <div className="lg:col-span-2 space-y-3">
            {selectedHistoryDate ? (
              <>
                <h3 className="text-sm font-semibold text-[#404040] dark:text-[#D4D4D4]">
                  Services du {formatDate(selectedHistoryDate)}
                </h3>
                {servicesForDate.length === 0 ? (
                  <div className="bg-white dark:bg-[#0A0A0A]/50 border border-[#E5E7EB] dark:border-[#1A1A1A] rounded-2xl p-8 text-center">
                    <CalendarDays className="w-10 h-10 mx-auto text-[#525252] mb-2" />
                    <p className="text-[#737373] dark:text-[#A3A3A3] text-sm">Aucun service enregistre pour cette date</p>
                  </div>
                ) : (
                  servicesForDate.map(svc => (
                    <div key={svc.id} className="bg-white dark:bg-[#0A0A0A]/50 border border-[#E5E7EB] dark:border-[#1A1A1A] rounded-2xl p-4">
                      <div className="flex items-center justify-between mb-3">
                        <div>
                          <h4 className="text-[#111111] dark:text-white font-semibold flex items-center gap-2">
                            {svc.type === 'midi' ? '\u2600\uFE0F' : '\uD83C\uDF19'} Service {svc.type === 'midi' ? 'du Midi' : 'du Soir'}
                          </h4>
                          <span className="text-xs text-[#737373] dark:text-[#A3A3A3]">
                            {formatTime(svc.startTime)} - {formatTime(svc.endTime)} ({formatDuration(svc.endTime - svc.startTime)})
                          </span>
                        </div>
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => exportService(svc)}
                            className="p-2 hover:bg-[#F5F5F5] dark:hover:bg-[#262626] rounded-lg transition-colors"
                            title="Exporter le bilan"
                          >
                            <Download className="w-4 h-4 text-[#737373] dark:text-[#A3A3A3]" />
                          </button>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                        <div className="bg-[#F5F5F5] dark:bg-[#0A0A0A] border border-[#E5E7EB] dark:border-[#1A1A1A] rounded-lg p-2.5 text-center">
                          <div className="text-lg font-bold text-[#111111] dark:text-white">{svc.totalCouverts}</div>
                          <div className="text-[10px] text-[#737373] dark:text-[#A3A3A3]">Couverts</div>
                        </div>
                        <div className="bg-[#F5F5F5] dark:bg-[#0A0A0A] border border-[#E5E7EB] dark:border-[#1A1A1A] rounded-lg p-2.5 text-center">
                          <div className="text-lg font-bold text-emerald-500">{formatCurrency(svc.totalCA)}</div>
                          <div className="text-[10px] text-[#737373] dark:text-[#A3A3A3]">CA</div>
                        </div>
                        <div className="bg-[#F5F5F5] dark:bg-[#0A0A0A] border border-[#E5E7EB] dark:border-[#1A1A1A] rounded-lg p-2.5 text-center">
                          <div className="text-lg font-bold text-red-400">{formatCurrency(svc.totalCout)}</div>
                          <div className="text-[10px] text-[#737373] dark:text-[#A3A3A3]">Cout</div>
                        </div>
                        <div className="bg-[#F5F5F5] dark:bg-[#0A0A0A] border border-[#E5E7EB] dark:border-[#1A1A1A] rounded-lg p-2.5 text-center">
                          <div className="text-lg font-bold text-teal-500">{formatCurrency(svc.margeBrute)}</div>
                          <div className="text-[10px] text-[#737373] dark:text-[#A3A3A3]">Marge</div>
                        </div>
                        <div className="bg-[#F5F5F5] dark:bg-[#0A0A0A] border border-[#E5E7EB] dark:border-[#1A1A1A] rounded-lg p-2.5 text-center">
                          <div className={`text-lg font-bold ${svc.margePercent >= 70 ? 'text-emerald-500' : 'text-amber-500'}`}>
                            {svc.margePercent.toFixed(1)}%
                          </div>
                          <div className="text-[10px] text-[#737373] dark:text-[#A3A3A3]">Marge %</div>
                        </div>
                      </div>

                      {/* Top plats */}
                      {svc.topPlats.length > 0 && (
                        <div className="mt-3 flex flex-wrap gap-2">
                          {svc.topPlats.map((p, i) => (
                            <span key={p.name} className="text-xs bg-[#F5F5F5] dark:bg-[#0A0A0A] border border-[#E5E7EB] dark:border-[#1A1A1A] text-[#111111] dark:text-[#D4D4D4] rounded-full px-2.5 py-1">
                              #{i + 1} {p.name} ({p.qty}x)
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  ))
                )}
              </>
            ) : (
              <>
                <h3 className="text-sm font-semibold text-[#404040] dark:text-[#D4D4D4]">Derniers services</h3>
                {history.length === 0 ? (
                  <div className="bg-white dark:bg-[#0A0A0A]/50 border border-[#E5E7EB] dark:border-[#1A1A1A] rounded-2xl p-8 text-center">
                    <Timer className="w-10 h-10 mx-auto text-[#525252] mb-2" />
                    <p className="text-[#737373] dark:text-[#A3A3A3] text-sm">Aucun service enregistre</p>
                    <p className="text-[#525252] dark:text-[#737373] text-xs mt-1">Demarrez un service pour commencer le suivi</p>
                  </div>
                ) : (
                  history.slice(0, 10).map(svc => (
                    <button
                      key={svc.id}
                      onClick={() => setSelectedHistoryDate(svc.date)}
                      className="w-full bg-white dark:bg-[#0A0A0A]/50 border border-[#E5E7EB] dark:border-[#1A1A1A] rounded-xl p-3 text-left hover:border-teal-500/50 dark:hover:border-teal-500/50 transition-all group"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="text-lg">{svc.type === 'midi' ? '\u2600\uFE0F' : '\uD83C\uDF19'}</span>
                          <div>
                            <div className="text-sm font-medium text-[#111111] dark:text-white">
                              {formatDate(svc.date)} -- {svc.type === 'midi' ? 'Midi' : 'Soir'}
                            </div>
                            <div className="text-[11px] text-[#737373] dark:text-[#A3A3A3]">
                              {svc.totalCouverts} couverts | {formatDuration(svc.endTime - svc.startTime)}
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-sm font-bold text-emerald-500">{formatCurrency(svc.totalCA)}</div>
                          <div className={`text-[11px] font-medium ${svc.margePercent >= 70 ? 'text-emerald-500' : 'text-amber-500'}`}>
                            {svc.margePercent.toFixed(1)}% marge
                          </div>
                        </div>
                        <ArrowRight className="w-4 h-4 text-[#525252] group-hover:text-teal-500 transition-colors ml-2" />
                      </div>
                    </button>
                  ))
                )}
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
