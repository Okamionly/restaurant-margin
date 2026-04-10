import { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Play, Square, Clock, Users, DollarSign, ChefHat,
  Plus, X, Download, CalendarDays, ChevronLeft,
  ChevronRight, Monitor, BarChart3, Award, ArrowRight, Utensils,
  Timer, Printer, Percent, ShoppingBag, Search, RotateCcw,
  Sun, Moon, Send, Volume2, VolumeX, Trophy, Target, Flame,
  Maximize2, Minimize2,
} from 'lucide-react';
import { fetchRecipes, getToken } from '../services/api';
import type { Recipe } from '../types';
import { formatCurrency, currencySuffix } from '../utils/currency';
import { useRestaurant } from '../hooks/useRestaurant';
import FoodIllustration from '../components/FoodIllustration';

// ══════════════════════════════════════════════════════════════════════
// ██  TYPES  ██████████████████████████████████████████████████████████
// ══════════════════════════════════════════════════════════════════════

type ServiceType = 'midi' | 'soir';
type ServicePhase = 'idle' | 'active' | 'summary';
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
  sentToKitchen?: boolean;
}

interface ServiceSession {
  id: string;
  type: ServiceType;
  date: string;
  startTime: number;
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

// ══════════════════════════════════════════════════════════════════════
// ██  CONSTANTS  ██████████████████████████████████████████████████████
// ══════════════════════════════════════════════════════════════════════

const STORAGE_KEY = 'service-tracker-current';
const HISTORY_KEY = 'service-tracker-history';
const KITCHEN_STORAGE_KEY = 'kitchen-mode-orders';
const KITCHEN_SYNC_KEY = 'kitchen-orders-sync';
const API_BASE = import.meta.env.VITE_API_URL || '/api';

const CATEGORY_TABS = [
  { key: null, label: 'Tous' },
  { key: 'Entree', label: 'Entrees' },
  { key: 'Entrée', label: 'Entrees' },
  { key: 'Plat', label: 'Plats' },
  { key: 'Plat principal', label: 'Plats' },
  { key: 'Dessert', label: 'Desserts' },
  { key: 'Boisson', label: 'Boissons' },
];

// ══════════════════════════════════════════════════════════════════════
// ██  HELPERS  ████████████████████████████████████████████████████████
// ══════════════════════════════════════════════════════════════════════

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

function formatLiveTimer(ms: number): string {
  const totalSec = Math.floor(ms / 1000);
  const h = Math.floor(totalSec / 3600);
  const m = Math.floor((totalSec % 3600) / 60);
  const s = totalSec % 60;
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
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

function getCategoryColor(category: string): { strip: string; bg: string; text: string } {
  const cat = category.toLowerCase();
  if (cat.includes('entr')) return { strip: 'bg-amber-500', bg: 'bg-amber-50 dark:bg-amber-900/20', text: 'text-amber-600 dark:text-amber-400' };
  if (cat.includes('plat')) return { strip: 'bg-rose-500', bg: 'bg-rose-50 dark:bg-rose-900/20', text: 'text-rose-600 dark:text-rose-400' };
  if (cat.includes('dessert')) return { strip: 'bg-purple-500', bg: 'bg-purple-50 dark:bg-purple-900/20', text: 'text-purple-600 dark:text-purple-400' };
  if (cat.includes('boisson')) return { strip: 'bg-sky-500', bg: 'bg-sky-50 dark:bg-sky-900/20', text: 'text-sky-600 dark:text-sky-400' };
  return { strip: 'bg-teal-500', bg: 'bg-teal-50 dark:bg-teal-900/20', text: 'text-teal-600 dark:text-teal-400' };
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
  } catch { /* localStorage full */ }
}

// ══════════════════════════════════════════════════════════════════════
// ██  AUDIO FEEDBACK  ████████████████████████████████████████████████
// ══════════════════════════════════════════════════════════════════════

let audioCtx: AudioContext | null = null;

function playClickSound() {
  try {
    if (!audioCtx) audioCtx = new AudioContext();
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.connect(gain);
    gain.connect(audioCtx.destination);
    osc.frequency.setValueAtTime(1200, audioCtx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(800, audioCtx.currentTime + 0.05);
    gain.gain.setValueAtTime(0.15, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.08);
    osc.start(audioCtx.currentTime);
    osc.stop(audioCtx.currentTime + 0.08);
  } catch { /* audio not available */ }
}

function playSuccessSound() {
  try {
    if (!audioCtx) audioCtx = new AudioContext();
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.connect(gain);
    gain.connect(audioCtx.destination);
    osc.frequency.setValueAtTime(523, audioCtx.currentTime);
    osc.frequency.setValueAtTime(659, audioCtx.currentTime + 0.1);
    osc.frequency.setValueAtTime(784, audioCtx.currentTime + 0.2);
    gain.gain.setValueAtTime(0.12, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.35);
    osc.start(audioCtx.currentTime);
    osc.stop(audioCtx.currentTime + 0.35);
  } catch { /* audio not available */ }
}

// ══════════════════════════════════════════════════════════════════════
// ██  ANIMATED VALUE  ████████████████████████████████████████████████
// ══════════════════════════════════════════════════════════════════════

function AnimatedValue({ value, prefix = '', suffix = '', decimals = 2, className = '' }: {
  value: number; prefix?: string; suffix?: string; decimals?: number; className?: string;
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
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplay(from + (to - from) * eased);
      if (progress < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }, [value]);

  return <span className={className}>{prefix}{display.toFixed(decimals)}{suffix}</span>;
}

// ══════════════════════════════════════════════════════════════════════
// ██  MARGIN BADGE  ██████████████████████████████████████████████████
// ══════════════════════════════════════════════════════════════════════

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

// ══════════════════════════════════════════════════════════════════════
// ██  MARGE GAUGE (SVG)  █████████████████████████████████████████████
// ══════════════════════════════════════════════════════════════════════

function MargeGauge({ percent, size = 'md' }: { percent: number; size?: 'md' | 'lg' }) {
  const clampedPercent = Math.max(0, Math.min(100, percent));
  const rotation = (clampedPercent / 100) * 180 - 90;
  const color = percent >= 70 ? '#10b981' : percent >= 50 ? '#f59e0b' : '#ef4444';
  const dims = size === 'lg' ? 'w-24 h-14' : 'w-16 h-10';
  const needleH = size === 'lg' ? 'h-9' : 'h-6';

  return (
    <div className={`relative ${dims} mx-auto`}>
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
      <div
        className={`absolute bottom-0 left-1/2 w-0.5 ${needleH} origin-bottom transition-transform duration-700 ease-out`}
        style={{ transform: `translateX(-50%) rotate(${rotation}deg)`, backgroundColor: color }}
      />
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full" style={{ backgroundColor: color }} />
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════
// ██  PRINT TICKET  ██████████████████████████████████████████████████
// ══════════════════════════════════════════════════════════════════════

function printKitchenTicket(order: ServiceOrder, sessionType: ServiceType) {
  const ticketWindow = window.open('', '_blank', 'width=300,height=500');
  if (!ticketWindow) return;

  const time = new Date(order.timestamp).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  const date = new Date(order.timestamp).toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit', year: 'numeric' });
  const separator = '<div class="sep">================================</div>';
  const thinSep = '<div class="sep">--------------------------------</div>';

  const html = `<!DOCTYPE html><html><head><title>Ticket #${order.id.slice(-6)}</title>
<style>
  *{margin:0;padding:0;box-sizing:border-box}
  body{font-family:'Courier New',Courier,monospace;width:280px;margin:0 auto;padding:8px;color:#000;background:#fff;font-size:14px;line-height:1.4}
  .center{text-align:center}
  .sep{text-align:center;font-size:12px;margin:4px 0;letter-spacing:-0.5px}
  .header{text-align:center;font-size:12px;font-weight:bold;text-transform:uppercase;letter-spacing:1px}
  .service-type{text-align:center;font-size:11px;color:#555;margin:2px 0}
  .table-num{text-align:center;font-size:36px;font-weight:900;margin:6px 0;letter-spacing:2px}
  .ticket-id{text-align:center;font-size:12px;font-weight:bold}
  .meta-row{display:flex;justify-content:space-between;font-size:12px}
  .dish{font-size:18px;font-weight:bold;padding:6px 0}
  .dish-cat{font-size:11px;color:#666;text-transform:uppercase;letter-spacing:0.5px}
  .price-row{display:flex;justify-content:space-between;font-size:13px;padding:2px 0}
  .price-total{font-weight:bold;font-size:15px}
  .footer{text-align:center;font-size:10px;margin-top:6px;color:#999}
  @media print{body{width:100%;padding:0}}
</style></head><body>
<div class="header">** CUISINE **</div>
<div class="service-type">Service ${sessionType === 'midi' ? 'du Midi' : 'du Soir'}</div>
${separator}
${order.tableNumber ? `<div class="table-num">TABLE ${order.tableNumber}</div>` : ''}
<div class="ticket-id">#${order.id.slice(-6).toUpperCase()}</div>
${separator}
<div class="meta-row"><span>${date}</span><span>${time}</span></div>
${separator}
<div class="dish">${order.quantity}x ${order.recipeName.toUpperCase()}</div>
<div class="dish-cat">${order.recipeCategory}</div>
${thinSep}
<div class="price-row"><span>Prix unitaire</span><span>${formatCurrency(order.unitSellingPrice)}</span></div>
<div class="price-row price-total"><span>TOTAL</span><span>${formatCurrency(order.quantity * order.unitSellingPrice)}</span></div>
${separator}
<div class="footer">RestauMargin</div>
<script>window.onload=function(){setTimeout(function(){window.print()},200)}</script>
</body></html>`;
  ticketWindow.document.write(html);
  ticketWindow.document.close();
}

// ══════════════════════════════════════════════════════════════════════
// ██  SEND TO KITCHEN  ███████████████████████████████████████████████
// ══════════════════════════════════════════════════════════════════════

function sendOrderToKitchen(order: ServiceOrder, sessionType: ServiceType): boolean {
  try {
    const existing = loadFromStorage<any[]>(KITCHEN_STORAGE_KEY, []);

    const kitchenOrder = {
      id: `svc-${order.id}`,
      tableNumber: order.tableNumber || 0,
      serverName: 'Service',
      createdAt: order.timestamp,
      notes: '',
      priority: 'normal',
      source: 'service-tracker',
      dishes: [{
        id: `dish-${order.id}`,
        recipeName: order.recipeName,
        recipeId: order.recipeId,
        quantity: order.quantity,
        status: 'attente',
        prepTimeMinutes: 15,
        startedAt: null,
        completedAt: null,
        servedAt: null,
        category: order.recipeCategory,
      }],
    };

    existing.push(kitchenOrder);
    saveToStorage(KITCHEN_STORAGE_KEY, existing);
    return true;
  } catch {
    return false;
  }
}

// ══════════════════════════════════════════════════════════════════════
// ██  MAIN COMPONENT  ████████████████████████████████████████████████
// ══════════════════════════════════════════════════════════════════════

export default function ServiceTracker() {
  const navigate = useNavigate();
  const { selectedRestaurant } = useRestaurant();

  // ── Data ───────────────────────────────────────────────────────────
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);

  // ── Session ────────────────────────────────────────────────────────
  const [session, setSession] = useState<ServiceSession | null>(() => loadFromStorage(STORAGE_KEY, null));
  const [history, setHistory] = useState<ServiceSummary[]>(() => loadFromStorage(HISTORY_KEY, []));

  // ── Phase control ──────────────────────────────────────────────────
  const [phase, setPhase] = useState<ServicePhase>(() => {
    if (session) return 'active';
    return 'idle';
  });
  const [summaryData, setSummaryData] = useState<ServiceSummary | null>(null);

  // ── UI state ───────────────────────────────────────────────────────
  const [tab, setTab] = useState<Tab>('live');
  const [searchRecipe, setSearchRecipe] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [now, setNow] = useState(Date.now());
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [lastOrderId, setLastOrderId] = useState<number | null>(null);
  const [flashOrderId, setFlashOrderId] = useState<string | null>(null);
  const [calendarMonth, setCalendarMonth] = useState(() => {
    const d = new Date();
    return { year: d.getFullYear(), month: d.getMonth() };
  });
  const [selectedHistoryDate, setSelectedHistoryDate] = useState<string | null>(null);

  // ── Fullscreen ────────────────────────────────────────────────────
  const [isFullscreen, setIsFullscreen] = useState(false);
  const toggleFullscreen = useCallback(() => {
    setIsFullscreen(prev => !prev);
  }, []);

  // ── Kitchen connection ────────────────────────────────────────────
  const [kitchenOrderCount, setKitchenOrderCount] = useState(0);
  const [kitchenIsOpen, setKitchenIsOpen] = useState(false);

  // ── KPI pulse tracking ────────────────────────────────────────────
  const prevStatsRef = useRef({ couverts: 0, ca: 0, margePercent: 0 });
  const [pulsingKpi, setPulsingKpi] = useState<string | null>(null);

  // ── Timer ──────────────────────────────────────────────────────────
  useEffect(() => {
    const interval = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(interval);
  }, []);

  // ── Check kitchen connection ──────────────────────────────────────
  useEffect(() => {
    function checkKitchen() {
      try {
        const raw = localStorage.getItem('kitchen-mode-orders');
        if (raw) {
          const orders = JSON.parse(raw);
          const pending = orders.filter((o: any) =>
            o.dishes?.some((d: any) => d.status !== 'servi' && d.status !== 'annule')
          );
          setKitchenOrderCount(pending.length);
        } else {
          setKitchenOrderCount(0);
        }
        // KDS is "open" if it has had recent activity (stats updated within last 5 min)
        const statsRaw = localStorage.getItem('kitchen-mode-stats');
        if (statsRaw) {
          const stats = JSON.parse(statsRaw);
          setKitchenIsOpen(stats && stats.platsServis !== undefined);
        } else {
          setKitchenIsOpen(false);
        }
      } catch {
        setKitchenOrderCount(0);
        setKitchenIsOpen(false);
      }
    }
    checkKitchen();
    const interval = setInterval(checkKitchen, 3000);
    return () => clearInterval(interval);
  }, []);

  // NOTE: KPI pulse effect moved after liveStats computation

  // ── Load recipes ───────────────────────────────────────────────────
  useEffect(() => {
    setLoading(true);
    fetchRecipes()
      .then(r => setRecipes(r))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [selectedRestaurant?.id]);

  // ── Persist session ────────────────────────────────────────────────
  useEffect(() => {
    if (session) saveToStorage(STORAGE_KEY, session);
    else localStorage.removeItem(STORAGE_KEY);
  }, [session]);

  useEffect(() => {
    saveToStorage(HISTORY_KEY, history);
  }, [history]);

  // ── Track last added recipe ────────────────────────────────────────
  useEffect(() => {
    if (session && session.orders.length > 0) {
      const last = session.orders[session.orders.length - 1];
      setLastOrderId(last.recipeId);
    }
  }, [session?.orders.length]);

  // ══════════════════════════════════════════════════════════════════
  // ██  COMPUTED  ████████████████████████████████████████████████████
  // ══════════════════════════════════════════════════════════════════

  const categories = useMemo(() => {
    const cats = [...new Set(recipes.map(r => r.category).filter(Boolean))];
    cats.sort();
    return cats;
  }, [recipes]);

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
    if (!session) return { couverts: 0, ca: 0, cout: 0, marge: 0, margePercent: 0, orderCount: 0, ticketMoyen: 0 };
    const orders = session.orders;
    const couverts = orders.reduce((sum, o) => sum + o.quantity, 0);
    const ca = orders.reduce((sum, o) => sum + o.quantity * o.unitSellingPrice, 0);
    const cout = orders.reduce((sum, o) => sum + o.quantity * o.unitCost, 0);
    const marge = ca - cout;
    const margePercent = ca > 0 ? (marge / ca) * 100 : 0;
    const ticketMoyen = orders.length > 0 ? ca / orders.length : 0;
    return { couverts, ca, cout, marge, margePercent, orderCount: orders.length, ticketMoyen };
  }, [session, now]);

  // Top plats
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

  // ── KPI pulse detection ───────────────────────────────────────────
  useEffect(() => {
    const prev = prevStatsRef.current;
    if (liveStats.couverts !== prev.couverts) {
      setPulsingKpi('couverts');
      setTimeout(() => setPulsingKpi(null), 800);
    } else if (liveStats.ca !== prev.ca) {
      setPulsingKpi('ca');
      setTimeout(() => setPulsingKpi(null), 800);
    } else if (Math.abs(liveStats.margePercent - prev.margePercent) > 0.1) {
      setPulsingKpi('marge');
      setTimeout(() => setPulsingKpi(null), 800);
    }
    prevStatsRef.current = { couverts: liveStats.couverts, ca: liveStats.ca, margePercent: liveStats.margePercent };
  }, [liveStats.couverts, liveStats.ca, liveStats.margePercent]);

  // P&L bar
  const plBarPercent = useMemo(() => {
    if (liveStats.ca <= 0) return { marge: 50, cout: 50 };
    const margeP = (liveStats.marge / liveStats.ca) * 100;
    const coutP = (liveStats.cout / liveStats.ca) * 100;
    return { marge: Math.max(0, margeP), cout: Math.max(0, coutP) };
  }, [liveStats]);

  // Calendar helpers
  const maxHistoryCA = useMemo(() => {
    if (history.length === 0) return 0;
    return Math.max(...history.map(s => s.totalCA));
  }, [history]);

  const caByDate = useMemo(() => {
    const map = new Map<string, number>();
    history.forEach(s => {
      const current = map.get(s.date) || 0;
      map.set(s.date, current + s.totalCA);
    });
    return map;
  }, [history]);

  const calendarDays = useMemo(() => {
    const { year, month } = calendarMonth;
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const offset = firstDay === 0 ? 6 : firstDay - 1;
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

  // Monthly summary
  const monthlySummary = useMemo(() => {
    const { year, month } = calendarMonth;
    const prefix = `${year}-${String(month + 1).padStart(2, '0')}`;
    const monthServices = history.filter(s => s.date.startsWith(prefix));
    if (monthServices.length === 0) return null;
    const totalCA = monthServices.reduce((s, svc) => s + svc.totalCA, 0);
    const totalCouverts = monthServices.reduce((s, svc) => s + svc.totalCouverts, 0);
    const totalMarge = monthServices.reduce((s, svc) => s + svc.margeBrute, 0);
    const avgMarge = totalCA > 0 ? (totalMarge / totalCA) * 100 : 0;
    const uniqueDays = new Set(monthServices.map(s => s.date)).size;
    return { totalCA, totalCouverts, totalMarge, avgMarge, serviceCount: monthServices.length, dayCount: uniqueDays };
  }, [history, calendarMonth]);

  // Last week comparison
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

  // ══════════════════════════════════════════════════════════════════
  // ██  ACTIONS  █████████████████████████████████████████████████████
  // ══════════════════════════════════════════════════════════════════

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
    setPhase('active');
    setSummaryData(null);
    if (soundEnabled) playSuccessSound();
  }, [soundEnabled]);

  const quickAddOrder = useCallback((recipeId: number, quantity = 1) => {
    if (!session) return;
    const recipe = recipes.find(r => r.id === recipeId);
    if (!recipe) return;

    const order: ServiceOrder = {
      id: `ord-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      recipeId: recipe.id,
      recipeName: recipe.name,
      recipeCategory: recipe.category,
      quantity,
      unitSellingPrice: recipe.sellingPrice / (recipe.nbPortions || 1),
      unitCost: getRecipeCost(recipe),
      tableNumber: null,
      timestamp: Date.now(),
      sentToKitchen: true,
    };

    // Auto-sync to kitchen via shared localStorage key
    try {
      const syncData = loadFromStorage<any[]>(KITCHEN_SYNC_KEY, []);
      syncData.push({
        id: order.id,
        recipeId: order.recipeId,
        recipeName: order.recipeName,
        category: order.recipeCategory,
        quantity: order.quantity,
        tableNumber: order.tableNumber,
        timestamp: order.timestamp,
      });
      saveToStorage(KITCHEN_SYNC_KEY, syncData);
    } catch { /* sync fail is non-blocking */ }

    setSession(prev => prev ? { ...prev, orders: [...prev.orders, order] } : prev);
    setFlashOrderId(order.id);
    setTimeout(() => setFlashOrderId(null), 600);
    if (soundEnabled) playClickSound();
  }, [session, recipes, soundEnabled]);

  const repeatLastOrder = useCallback(() => {
    if (!lastOrderId) return;
    quickAddOrder(lastOrderId);
  }, [lastOrderId, quickAddOrder]);

  const removeOrder = useCallback((orderId: string) => {
    setSession(prev => prev ? { ...prev, orders: prev.orders.filter(o => o.id !== orderId) } : prev);
  }, []);

  const sendToKitchen = useCallback((orderId: string) => {
    if (!session) return;
    const order = session.orders.find(o => o.id === orderId);
    if (!order) return;
    const success = sendOrderToKitchen(order, session.type);
    if (success) {
      setSession(prev => prev ? {
        ...prev,
        orders: prev.orders.map(o => o.id === orderId ? { ...o, sentToKitchen: true } : o),
      } : prev);
      if (soundEnabled) playClickSound();
    }
  }, [session, soundEnabled]);

  const endService = useCallback(() => {
    if (!session) return;
    const orders = session.orders;
    const totalCouverts = orders.reduce((s, o) => s + o.quantity, 0);
    const totalCA = orders.reduce((s, o) => s + o.quantity * o.unitSellingPrice, 0);
    const totalCout = orders.reduce((s, o) => s + o.quantity * o.unitCost, 0);
    const margeBrute = totalCA - totalCout;
    const margePercent = totalCA > 0 ? (margeBrute / totalCA) * 100 : 0;

    const platMap = new Map<string, { name: string; qty: number; ca: number }>();
    for (const o of orders) {
      const e = platMap.get(o.recipeName) || { name: o.recipeName, qty: 0, ca: 0 };
      e.qty += o.quantity;
      e.ca += o.quantity * o.unitSellingPrice;
      platMap.set(o.recipeName, e);
    }
    const topP = [...platMap.values()].sort((a, b) => b.qty - a.qty).slice(0, 5);

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
      topPlats: topP,
      orders,
    };

    setHistory(prev => [summary, ...prev]);
    setSummaryData(summary);
    setPhase('summary');
    setSession(null);
    if (soundEnabled) playSuccessSound();

    // Save to API
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
      }).catch(() => {});
    }
  }, [session, selectedRestaurant, soundEnabled]);

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

  // ══════════════════════════════════════════════════════════════════
  // ██  RENDER  ██████████████████████████████████████████████████████
  // ══════════════════════════════════════════════════════════════════

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-10 h-10 border-4 border-teal-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className={isFullscreen
      ? 'fixed inset-0 z-[55] bg-white dark:bg-black overflow-y-auto p-4 sm:p-6 space-y-5'
      : 'space-y-5 pb-8'
    }>
      {/* ════════════════════════════════════════════════════════════ */}
      {/* HEADER                                                      */}
      {/* ════════════════════════════════════════════════════════════ */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-[#111111] dark:text-white font-satoshi flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-teal-600 flex items-center justify-center">
              <Timer className="w-5 h-5 text-white" />
            </div>
            Suivi de Service
          </h1>
          <p className="text-sm text-[#737373] dark:text-[#A3A3A3] mt-0.5 ml-12 flex items-center gap-2">
            Gestion POS en temps reel
            {/* Kitchen connection badge */}
            {phase === 'active' && (
              <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-[#F5F5F5] dark:bg-[#1A1A1A] border border-[#E5E7EB] dark:border-[#262626] text-[11px] font-semibold">
                <span className={`w-1.5 h-1.5 rounded-full ${kitchenIsOpen ? 'bg-emerald-500' : 'bg-[#737373]'}`} />
                <Monitor className="w-3 h-3 text-[#737373] dark:text-[#A3A3A3]" />
                <span className="text-[#737373] dark:text-[#A3A3A3]">
                  {kitchenOrderCount > 0
                    ? `${kitchenOrderCount} commande${kitchenOrderCount > 1 ? 's' : ''} en cuisine`
                    : 'Cuisine connectee'
                  }
                </span>
              </span>
            )}
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* Sound toggle */}
          <button
            onClick={() => setSoundEnabled(!soundEnabled)}
            className="p-2.5 bg-white dark:bg-[#0A0A0A] border border-[#E5E7EB] dark:border-[#1A1A1A] rounded-xl hover:border-[#D4D4D4] dark:hover:border-[#404040] transition-all"
            title={soundEnabled ? 'Desactiver le son' : 'Activer le son'}
          >
            {soundEnabled ? <Volume2 className="w-4 h-4 text-teal-500" /> : <VolumeX className="w-4 h-4 text-[#737373]" />}
          </button>

          {/* Fullscreen toggle */}
          <button
            onClick={toggleFullscreen}
            className="p-2.5 bg-white dark:bg-[#0A0A0A] border border-[#E5E7EB] dark:border-[#1A1A1A] rounded-xl hover:border-[#D4D4D4] dark:hover:border-[#404040] transition-all"
            title={isFullscreen ? 'Quitter le plein ecran' : 'Plein ecran'}
          >
            {isFullscreen
              ? <Minimize2 className="w-4 h-4 text-teal-500" />
              : <Maximize2 className="w-4 h-4 text-[#737373] dark:text-[#A3A3A3]" />
            }
          </button>

          {/* Tabs */}
          <div className="flex bg-white dark:bg-[#0A0A0A] rounded-xl p-1 gap-1 border border-[#E5E7EB] dark:border-[#1A1A1A]">
            <button
              onClick={() => setTab('live')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-1.5 ${
                tab === 'live' ? 'bg-teal-600 text-white shadow-lg shadow-teal-600/20' : 'text-[#737373] dark:text-[#A3A3A3] hover:text-[#111111] dark:hover:text-white'
              }`}
            >
              <Play className="w-4 h-4" />
              Service
            </button>
            <button
              onClick={() => setTab('history')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-1.5 ${
                tab === 'history' ? 'bg-teal-600 text-white shadow-lg shadow-teal-600/20' : 'text-[#737373] dark:text-[#A3A3A3] hover:text-[#111111] dark:hover:text-white'
              }`}
            >
              <CalendarDays className="w-4 h-4" />
              Historique
            </button>
          </div>
        </div>
      </div>

      {/* ════════════════════════════════════════════════════════════ */}
      {/* TAB: LIVE SERVICE                                           */}
      {/* ════════════════════════════════════════════════════════════ */}
      {tab === 'live' && (
        <>
          {/* ──────────────────────────────────────────────────────── */}
          {/* PHASE: IDLE - No service running                        */}
          {/* ──────────────────────────────────────────────────────── */}
          {phase === 'idle' && (
            <div className="bg-white dark:bg-[#0A0A0A]/50 border border-[#E5E7EB] dark:border-[#1A1A1A] rounded-2xl">
              <div className="text-center py-16 px-6">
                {/* Big icon */}
                <div className="w-24 h-24 mx-auto rounded-3xl bg-gradient-to-br from-teal-500 to-emerald-600 flex items-center justify-center mb-6 shadow-xl shadow-teal-600/20">
                  {detectServiceType() === 'midi'
                    ? <Sun className="w-12 h-12 text-white" />
                    : <Moon className="w-12 h-12 text-white" />
                  }
                </div>

                <h2 className="text-2xl font-bold text-[#111111] dark:text-white mb-2 font-satoshi">
                  Pas de service en cours
                </h2>
                <p className="text-[#737373] dark:text-[#A3A3A3] mb-8 max-w-md mx-auto">
                  Lancez le suivi pour enregistrer les commandes, suivre le CA et la marge brute en temps reel.
                </p>

                {/* Big start button */}
                <button
                  onClick={startService}
                  className="group relative inline-flex items-center gap-3 px-10 py-5 bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-500 hover:to-emerald-500 text-white rounded-2xl font-bold text-xl transition-all active:scale-[0.97] shadow-2xl shadow-teal-600/30 hover:shadow-teal-500/40"
                >
                  <Play className="w-7 h-7 transition-transform group-hover:scale-110" />
                  Demarrer le service {detectServiceType() === 'midi' ? 'du Midi' : 'du Soir'}
                </button>

                {/* Quick stats from today */}
                {history.filter(s => s.date === todayStr()).length > 0 && (
                  <div className="mt-10 max-w-lg mx-auto">
                    <div className="text-xs font-semibold text-[#737373] dark:text-[#A3A3A3] uppercase tracking-wider mb-3">
                      Aujourd'hui
                    </div>
                    <div className="grid grid-cols-3 gap-3">
                      {(() => {
                        const todayServices = history.filter(s => s.date === todayStr());
                        const todayCA = todayServices.reduce((s, svc) => s + svc.totalCA, 0);
                        const todayCouverts = todayServices.reduce((s, svc) => s + svc.totalCouverts, 0);
                        const todayMarge = todayCA > 0
                          ? (todayServices.reduce((s, svc) => s + svc.margeBrute, 0) / todayCA * 100)
                          : 0;
                        return (
                          <>
                            <div className="bg-white dark:bg-black border border-[#E5E7EB] dark:border-[#1A1A1A] rounded-xl p-3 text-center">
                              <div className="text-lg font-bold text-emerald-500">{formatCurrency(todayCA)}</div>
                              <div className="text-[10px] text-[#737373] dark:text-[#A3A3A3]">CA</div>
                            </div>
                            <div className="bg-white dark:bg-black border border-[#E5E7EB] dark:border-[#1A1A1A] rounded-xl p-3 text-center">
                              <div className="text-lg font-bold text-[#111111] dark:text-white">{todayCouverts}</div>
                              <div className="text-[10px] text-[#737373] dark:text-[#A3A3A3]">Couverts</div>
                            </div>
                            <div className="bg-white dark:bg-black border border-[#E5E7EB] dark:border-[#1A1A1A] rounded-xl p-3 text-center">
                              <div className={`text-lg font-bold ${todayMarge >= 70 ? 'text-emerald-500' : 'text-amber-500'}`}>
                                {todayMarge.toFixed(1)}%
                              </div>
                              <div className="text-[10px] text-[#737373] dark:text-[#A3A3A3]">Marge</div>
                            </div>
                          </>
                        );
                      })()}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ──────────────────────────────────────────────────────── */}
          {/* PHASE: ACTIVE - Service in progress                     */}
          {/* ──────────────────────────────────────────────────────── */}
          {phase === 'active' && session && (
            <>
              {/* ── 4 Big KPI Cards ────────────────────────────────── */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                {/* 1. Couverts */}
                <div className={`bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-900/40 rounded-2xl p-6 text-center relative overflow-hidden transition-all duration-300 ${pulsingKpi === 'couverts' ? 'scale-[1.03] ring-2 ring-blue-400/50' : ''}`}>
                  <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-blue-500 to-blue-400" />
                  <Users className="w-7 h-7 mx-auto mb-2 text-blue-500" />
                  <div className="text-5xl font-black text-[#111111] dark:text-white tabular-nums leading-none mb-1.5">
                    <AnimatedValue value={liveStats.couverts} decimals={0} />
                  </div>
                  <div className="text-xs font-semibold text-blue-600 dark:text-blue-400 uppercase tracking-wider">Couverts</div>
                </div>

                {/* 2. CA */}
                <div className={`bg-teal-50 dark:bg-teal-950/30 border border-teal-200 dark:border-teal-900/40 rounded-2xl p-6 text-center relative overflow-hidden transition-all duration-300 ${pulsingKpi === 'ca' ? 'scale-[1.03] ring-2 ring-teal-400/50' : ''}`}>
                  <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-teal-500 to-emerald-400" />
                  <DollarSign className="w-7 h-7 mx-auto mb-2 text-teal-500" />
                  <div className="text-5xl font-black text-[#111111] dark:text-white tabular-nums leading-none mb-1.5">
                    <AnimatedValue value={liveStats.ca} suffix={currencySuffix()} />
                  </div>
                  <div className="text-xs font-semibold text-teal-600 dark:text-teal-400 uppercase tracking-wider">CA Temps Reel</div>
                </div>

                {/* 3. Marge % with gauge */}
                <div className={`rounded-2xl p-6 text-center relative overflow-hidden border transition-all duration-300 ${
                  liveStats.margePercent >= 70
                    ? 'bg-amber-50 dark:bg-amber-950/30 border-amber-200 dark:border-amber-900/40'
                    : liveStats.margePercent >= 50
                    ? 'bg-amber-50 dark:bg-amber-950/30 border-amber-200 dark:border-amber-900/40'
                    : 'bg-red-50 dark:bg-red-950/30 border-red-200 dark:border-red-900/40'
                } ${pulsingKpi === 'marge' ? 'scale-[1.03] ring-2 ring-amber-400/50' : ''}`}>
                  <div className="absolute top-0 left-0 right-0 h-1.5" style={{
                    background: liveStats.margePercent >= 70 ? 'linear-gradient(to right, #f59e0b, #fbbf24)' :
                      liveStats.margePercent >= 50 ? 'linear-gradient(to right, #f59e0b, #fbbf24)' :
                      'linear-gradient(to right, #ef4444, #f87171)'
                  }} />
                  <MargeGauge percent={liveStats.margePercent} size="lg" />
                  <div className={`text-4xl font-black tabular-nums leading-none mt-1 mb-1.5 ${
                    liveStats.margePercent >= 70 ? 'text-emerald-500' : liveStats.margePercent >= 50 ? 'text-amber-500' : 'text-red-500'
                  }`}>
                    <AnimatedValue value={liveStats.margePercent} suffix="%" decimals={1} />
                  </div>
                  <div className="text-xs font-semibold text-amber-600 dark:text-amber-400 uppercase tracking-wider">Marge</div>
                </div>

                {/* 4. Service Timer */}
                <div className="bg-purple-50 dark:bg-purple-950/30 border border-purple-200 dark:border-purple-900/40 rounded-2xl p-6 text-center relative overflow-hidden">
                  <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-purple-500 to-purple-400" />
                  <Clock className="w-7 h-7 mx-auto mb-2 text-purple-500" />
                  <div className="text-5xl font-black text-[#111111] dark:text-white tabular-nums leading-none mb-1.5 font-mono">
                    {formatLiveTimer(now - session.startTime)}
                  </div>
                  <div className="text-xs font-semibold text-purple-600 dark:text-purple-400 uppercase tracking-wider">Temps Service</div>
                </div>
              </div>

              {/* ── Service Status Bar ─────────────────────────────── */}
              <div className="bg-white dark:bg-black border border-[#E5E7EB] dark:border-[#1A1A1A] rounded-2xl p-4">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <span className="relative flex h-3 w-3">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                      <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500" />
                    </span>
                    <div>
                      <h2 className="text-lg font-bold text-[#111111] dark:text-white flex items-center gap-2">
                        Service {session.type === 'midi' ? 'du Midi' : 'du Soir'}
                        <span className="text-sm font-normal text-[#737373] dark:text-[#A3A3A3]">
                          -- {formatDate(session.date)}
                        </span>
                      </h2>
                      <div className="flex items-center gap-4 text-xs text-[#737373] dark:text-[#A3A3A3]">
                        <span>{liveStats.orderCount} commande{liveStats.orderCount !== 1 ? 's' : ''}</span>
                        <span>Ticket moy: {formatCurrency(liveStats.ticketMoyen)}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {/* Kitchen status badge */}
                    {kitchenOrderCount > 0 && (
                      <span className="hidden sm:inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800/40 text-xs font-semibold text-orange-600 dark:text-orange-400">
                        <ChefHat className="w-3.5 h-3.5" />
                        {kitchenOrderCount} en cuisine
                      </span>
                    )}
                    <button
                      onClick={() => navigate('/kitchen-mode')}
                      className="px-3 py-2 bg-[#111111] dark:bg-white text-white dark:text-[#111111] hover:bg-[#262626] dark:hover:bg-[#E5E7EB] rounded-xl text-sm font-medium transition-all flex items-center gap-1.5"
                    >
                      <Monitor className="w-4 h-4" />
                      Cuisine
                    </button>
                    <button
                      onClick={endService}
                      className="px-4 py-2 bg-red-600 hover:bg-red-500 text-white rounded-xl text-sm font-medium transition-all flex items-center gap-1.5 active:scale-95"
                    >
                      <Square className="w-4 h-4" />
                      Terminer
                    </button>
                  </div>
                </div>

                {/* P&L Bar */}
                {liveStats.ca > 0 && (
                  <div className="mt-3">
                    <div className="relative h-6 rounded-full overflow-hidden bg-[#E5E7EB] dark:bg-[#262626]">
                      <div
                        className="absolute inset-y-0 left-0 bg-gradient-to-r from-emerald-600 to-emerald-500 transition-all duration-700 ease-out flex items-center justify-center"
                        style={{ width: `${plBarPercent.marge}%` }}
                      >
                        {plBarPercent.marge > 20 && (
                          <span className="text-[10px] font-bold text-white drop-shadow">
                            Marge {plBarPercent.marge.toFixed(0)}%
                          </span>
                        )}
                      </div>
                      <div
                        className="absolute inset-y-0 right-0 bg-gradient-to-l from-red-600 to-red-500 transition-all duration-700 ease-out flex items-center justify-center"
                        style={{ width: `${plBarPercent.cout}%` }}
                      >
                        {plBarPercent.cout > 20 && (
                          <span className="text-[10px] font-bold text-white drop-shadow">
                            Cout {plBarPercent.cout.toFixed(0)}%
                          </span>
                        )}
                      </div>
                      <div className="absolute inset-y-0 w-0.5 bg-yellow-400 z-10" style={{ left: '70%' }} title="Objectif 70%" />
                    </div>
                  </div>
                )}
              </div>

              {/* ── ORDER ENTRY ──────────────────────────────────── */}
              <div className="bg-white dark:bg-black border border-[#E5E7EB] dark:border-[#1A1A1A] rounded-2xl p-4">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm font-bold text-[#111111] dark:text-white flex items-center gap-2">
                    <ChefHat className="w-4.5 h-4.5 text-teal-500" />
                    Ajouter une commande
                  </h3>
                  {/* Repeat last order */}
                  {lastOrderId && (
                    <button
                      onClick={repeatLastOrder}
                      className="flex items-center gap-1.5 px-3 py-1.5 bg-teal-50 dark:bg-teal-900/20 border border-teal-200 dark:border-teal-800/40 text-teal-700 dark:text-teal-400 rounded-lg text-xs font-semibold hover:bg-teal-100 dark:hover:bg-teal-900/30 transition-all active:scale-95"
                    >
                      <RotateCcw className="w-3 h-3" />
                      Derniere commande
                    </button>
                  )}
                </div>

                {/* Search + Categories */}
                <div className="flex flex-col sm:flex-row gap-2 mb-3">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#737373]" />
                    <input
                      type="text"
                      value={searchRecipe}
                      onChange={e => setSearchRecipe(e.target.value)}
                      placeholder="Rechercher une recette..."
                      className="w-full pl-9 pr-3 py-2.5 bg-[#F5F5F5] dark:bg-[#262626] border border-[#E5E7EB] dark:border-[#262626] rounded-xl text-[#111111] dark:text-white text-sm placeholder:text-[#737373] focus:outline-none focus:ring-2 focus:ring-teal-500/50"
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

                {/* ── Recipe Grid — One-tap add ────────────────────── */}
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 max-h-[420px] overflow-y-auto pr-1 scrollbar-thin">
                  {filteredRecipes.map(recipe => {
                    const price = recipe.sellingPrice / (recipe.nbPortions || 1);
                    const marginPct = getRecipeMarginPercent(recipe);
                    const catColor = getCategoryColor(recipe.category);
                    const justAdded = flashOrderId && session.orders.some(o => o.recipeId === recipe.id && o.id === flashOrderId);
                    return (
                      <button
                        key={recipe.id}
                        onClick={() => quickAddOrder(recipe.id)}
                        className={`group relative bg-white dark:bg-[#0A0A0A] border rounded-2xl p-4 text-left transition-all duration-200 hover:scale-105 hover:shadow-lg hover:shadow-black/5 dark:hover:shadow-black/30 active:scale-[0.96] overflow-hidden ${
                          justAdded
                            ? 'border-emerald-400 dark:border-emerald-500 ring-2 ring-emerald-400/40 bg-emerald-50 dark:bg-emerald-900/20'
                            : 'border-[#E5E7EB] dark:border-[#1A1A1A] hover:border-teal-400 dark:hover:border-teal-600'
                        }`}
                      >
                        {/* Category color strip at top */}
                        <div className={`absolute top-0 left-0 right-0 h-1 ${catColor.strip}`} />
                        {/* Food illustration */}
                        <div className="w-14 h-14 mb-2.5 mx-auto">
                          <FoodIllustration recipeName={recipe.name} category={recipe.category} size="sm" animated={false} />
                        </div>
                        <div className="text-base font-bold text-[#111111] dark:text-white truncate text-center leading-tight">{recipe.name}</div>
                        <div className={`text-[11px] text-center mt-0.5 font-medium ${catColor.text}`}>{recipe.category}</div>
                        <div className="flex items-center justify-between mt-3 gap-1">
                          <span className="text-sm font-black text-emerald-500 bg-emerald-50 dark:bg-emerald-900/20 px-2 py-0.5 rounded-lg">{formatCurrency(price)}</span>
                          <MarginBadge percent={marginPct} />
                        </div>
                        {/* Hover overlay with + icon */}
                        <div className="absolute inset-0 rounded-2xl bg-teal-600/0 group-hover:bg-teal-600/5 dark:group-hover:bg-teal-500/5 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                          <div className="absolute top-2 right-2 w-7 h-7 bg-teal-500 rounded-full flex items-center justify-center shadow-lg shadow-teal-500/30">
                            <Plus className="w-4 h-4 text-white" />
                          </div>
                        </div>
                      </button>
                    );
                  })}
                  {filteredRecipes.length === 0 && (
                    <div className="col-span-full text-center py-12 text-[#737373] text-sm">
                      Aucune recette trouvee
                    </div>
                  )}
                </div>

                {/* Running total after last addition */}
                {session.orders.length > 0 && (
                  <div className="mt-3 flex items-center justify-between bg-[#F5F5F5] dark:bg-[#0A0A0A] border border-[#E5E7EB] dark:border-[#1A1A1A] rounded-xl px-4 py-3">
                    <div className="flex items-center gap-2">
                      <ShoppingBag className="w-4 h-4 text-teal-500" />
                      <span className="text-sm font-medium text-[#111111] dark:text-white">
                        {liveStats.orderCount} commande{liveStats.orderCount !== 1 ? 's' : ''} | {liveStats.couverts} couvert{liveStats.couverts !== 1 ? 's' : ''}
                      </span>
                    </div>
                    <div className="text-lg font-black text-emerald-500 tabular-nums">
                      {formatCurrency(liveStats.ca)}
                    </div>
                  </div>
                )}
              </div>

              {/* ── ORDER LIST ──────────────────────────────────── */}
              {session.orders.length > 0 && (
                <div className="bg-white dark:bg-black border border-[#E5E7EB] dark:border-[#1A1A1A] rounded-2xl p-4">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-sm font-bold text-[#111111] dark:text-white flex items-center gap-2">
                      <Utensils className="w-4 h-4 text-teal-500" />
                      Commandes ({session.orders.length})
                    </h3>
                    {topPlats.length > 0 && (
                      <span className="flex items-center gap-1 text-xs text-[#737373] dark:text-[#A3A3A3]">
                        <Flame className="w-3 h-3 text-orange-400" />
                        Top: {topPlats[0].name} ({topPlats[0].qty}x)
                      </span>
                    )}
                  </div>
                  <div className="space-y-1.5 max-h-[350px] overflow-y-auto pr-1 scrollbar-thin">
                    {[...session.orders].reverse().map(order => (
                      <div
                        key={order.id}
                        className={`flex items-center gap-3 bg-[#F5F5F5] dark:bg-[#0A0A0A] border rounded-xl px-3 py-2.5 group transition-all ${
                          flashOrderId === order.id
                            ? 'border-teal-500 bg-teal-50 dark:bg-teal-900/20 scale-[1.01]'
                            : 'border-[#E5E7EB] dark:border-[#1A1A1A] hover:bg-white dark:hover:bg-[#0A0A0A]/80'
                        }`}
                      >
                        <div className="w-9 h-9 flex-shrink-0">
                          <FoodIllustration recipeName={order.recipeName} category={order.recipeCategory} size="sm" animated={false} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="text-sm font-semibold text-[#111111] dark:text-white truncate">
                            {order.recipeName}
                            <span className="text-[#737373] dark:text-[#A3A3A3] font-normal"> x{order.quantity}</span>
                          </div>
                          <div className="text-[11px] text-[#737373] dark:text-[#A3A3A3] flex items-center gap-2">
                            <span>{formatTime(order.timestamp)}</span>
                            {order.tableNumber && <span>Table {order.tableNumber}</span>}
                            {order.sentToKitchen && (
                              <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full bg-teal-100 dark:bg-teal-900/30 text-teal-600 dark:text-teal-400 text-[10px] font-semibold">
                                <ChefHat className="w-3 h-3" /> Envoyee en cuisine
                              </span>
                            )}
                          </div>
                        </div>
                        <div className="text-right flex-shrink-0">
                          <div className="text-sm font-bold text-emerald-500">
                            +{formatCurrency(order.quantity * order.unitSellingPrice)}
                          </div>
                          <div className="text-[10px] text-red-400/70">
                            cout {formatCurrency(order.quantity * order.unitCost)}
                          </div>
                        </div>
                        {/* Actions */}
                        <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">
                          {!order.sentToKitchen && (
                            <button
                              onClick={() => sendToKitchen(order.id)}
                              className="p-1.5 hover:bg-teal-100 dark:hover:bg-teal-900/30 rounded-lg transition-all"
                              title="Envoyer en cuisine"
                            >
                              <Send className="w-3.5 h-3.5 text-teal-500" />
                            </button>
                          )}
                          <button
                            onClick={() => printKitchenTicket(order, session.type)}
                            className="p-1.5 hover:bg-[#E5E7EB] dark:hover:bg-[#262626] rounded-lg transition-all"
                            title="Imprimer ticket"
                          >
                            <Printer className="w-3.5 h-3.5 text-[#737373] dark:text-[#A3A3A3]" />
                          </button>
                          <button
                            onClick={() => removeOrder(order.id)}
                            className="p-1.5 hover:bg-red-100 dark:hover:bg-red-900/20 rounded-lg transition-all"
                            title="Supprimer"
                          >
                            <X className="w-3.5 h-3.5 text-red-400" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}

          {/* ──────────────────────────────────────────────────────── */}
          {/* PHASE: SUMMARY - Service ended                          */}
          {/* ──────────────────────────────────────────────────────── */}
          {phase === 'summary' && summaryData && (
            <div className="bg-white dark:bg-black border border-[#E5E7EB] dark:border-[#1A1A1A] rounded-2xl overflow-hidden">
              {/* Summary header */}
              <div className="bg-gradient-to-r from-teal-600 to-emerald-600 px-6 py-5 text-white">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
                      <Trophy className="w-7 h-7 text-white" />
                    </div>
                    <div>
                      <h2 className="text-xl font-bold">
                        Bilan du Service {summaryData.type === 'midi' ? 'du Midi' : 'du Soir'}
                      </h2>
                      <p className="text-white/70 text-sm">
                        {formatDate(summaryData.date)} | {formatTime(summaryData.startTime)} - {formatTime(summaryData.endTime)} ({formatDuration(summaryData.endTime - summaryData.startTime)})
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => { setPhase('idle'); setSummaryData(null); }}
                    className="p-2 hover:bg-white/20 rounded-xl transition-colors"
                  >
                    <X className="w-5 h-5 text-white/80" />
                  </button>
                </div>
              </div>

              <div className="p-6 space-y-6">
                {/* 5 KPI cards */}
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                  {[
                    { label: 'Couverts', value: String(summaryData.totalCouverts), icon: Users, accent: 'text-blue-500', bg: 'bg-blue-50 dark:bg-blue-900/20' },
                    { label: 'CA Total', value: formatCurrency(summaryData.totalCA), icon: DollarSign, accent: 'text-emerald-500', bg: 'bg-emerald-50 dark:bg-emerald-900/20' },
                    { label: 'Cout matieres', value: formatCurrency(summaryData.totalCout), icon: ShoppingBag, accent: 'text-red-500', bg: 'bg-red-50 dark:bg-red-900/20' },
                    { label: 'Marge brute', value: formatCurrency(summaryData.margeBrute), icon: BarChart3, accent: 'text-teal-500', bg: 'bg-teal-50 dark:bg-teal-900/20' },
                    { label: 'Marge %', value: `${summaryData.margePercent.toFixed(1)}%`, icon: Target, accent: summaryData.margePercent >= 70 ? 'text-emerald-500' : 'text-amber-500', bg: summaryData.margePercent >= 70 ? 'bg-emerald-50 dark:bg-emerald-900/20' : 'bg-amber-50 dark:bg-amber-900/20' },
                  ].map(s => (
                    <div key={s.label} className={`${s.bg} rounded-xl p-4 text-center`}>
                      <s.icon className={`w-5 h-5 mx-auto mb-1.5 ${s.accent}`} />
                      <div className={`text-xl font-black text-[#111111] dark:text-white`}>{s.value}</div>
                      <div className="text-[11px] text-[#737373] dark:text-[#A3A3A3] font-medium">{s.label}</div>
                    </div>
                  ))}
                </div>

                {/* Top plats */}
                {summaryData.topPlats.length > 0 && (
                  <div>
                    <h3 className="text-sm font-bold text-[#111111] dark:text-white mb-2 flex items-center gap-2">
                      <Award className="w-4 h-4 text-yellow-500" />
                      Top plats vendus
                    </h3>
                    <div className="space-y-2">
                      {summaryData.topPlats.map((p, i) => {
                        const maxQty = summaryData.topPlats[0].qty;
                        const barWidth = maxQty > 0 ? (p.qty / maxQty) * 100 : 0;
                        return (
                          <div key={p.name} className="relative flex items-center gap-3 bg-[#F5F5F5] dark:bg-[#0A0A0A] border border-[#E5E7EB] dark:border-[#1A1A1A] rounded-xl px-4 py-3 overflow-hidden">
                            <div
                              className="absolute inset-y-0 left-0 bg-teal-500/10 dark:bg-teal-500/5 transition-all duration-700"
                              style={{ width: `${barWidth}%` }}
                            />
                            <span className="relative text-lg font-black text-yellow-500 w-8 text-center">#{i + 1}</span>
                            <span className="relative flex-1 text-[#111111] dark:text-white font-semibold">{p.name}</span>
                            <span className="relative text-[#737373] dark:text-[#A3A3A3] text-sm font-medium">{p.qty}x</span>
                            <span className="relative text-emerald-500 text-sm font-bold">{formatCurrency(p.ca)}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Last week comparison */}
                {lastWeekComparison && (
                  <div className="bg-[#F5F5F5] dark:bg-[#0A0A0A] border border-[#E5E7EB] dark:border-[#1A1A1A] rounded-xl p-4">
                    <h3 className="text-sm font-bold text-[#111111] dark:text-white mb-3">vs. meme jour semaine derniere</h3>
                    <div className="grid grid-cols-3 gap-3 text-center">
                      <div>
                        <div className={`text-xl font-black ${lastWeekComparison.caDiff >= 0 ? 'text-emerald-500' : 'text-red-500'}`}>
                          {lastWeekComparison.caDiff >= 0 ? '+' : ''}{lastWeekComparison.caDiffPercent.toFixed(1)}%
                        </div>
                        <div className="text-[11px] text-[#737373] dark:text-[#A3A3A3] font-medium">CA</div>
                      </div>
                      <div>
                        <div className={`text-xl font-black ${lastWeekComparison.couvertsDiff >= 0 ? 'text-emerald-500' : 'text-red-500'}`}>
                          {lastWeekComparison.couvertsDiff >= 0 ? '+' : ''}{lastWeekComparison.couvertsDiff}
                        </div>
                        <div className="text-[11px] text-[#737373] dark:text-[#A3A3A3] font-medium">Couverts</div>
                      </div>
                      <div>
                        <div className={`text-xl font-black ${lastWeekComparison.margeDiff >= 0 ? 'text-emerald-500' : 'text-red-500'}`}>
                          {lastWeekComparison.margeDiff >= 0 ? '+' : ''}{lastWeekComparison.margeDiff.toFixed(1)}pt
                        </div>
                        <div className="text-[11px] text-[#737373] dark:text-[#A3A3A3] font-medium">Marge</div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Actions */}
                <div className="flex flex-wrap gap-3">
                  <button
                    onClick={() => exportService(summaryData)}
                    className="px-5 py-3 bg-[#111111] dark:bg-white text-white dark:text-[#111111] hover:bg-[#262626] dark:hover:bg-[#E5E7EB] rounded-xl text-sm font-semibold transition-all flex items-center gap-2"
                  >
                    <Download className="w-4 h-4" />
                    Exporter le bilan
                  </button>
                  <button
                    onClick={() => {
                      setPhase('idle');
                      setSummaryData(null);
                    }}
                    className="px-5 py-3 bg-teal-600 hover:bg-teal-500 text-white rounded-xl text-sm font-semibold transition-all flex items-center gap-2"
                  >
                    <Play className="w-4 h-4" />
                    Nouveau service
                  </button>
                </div>
              </div>
            </div>
          )}
        </>
      )}

      {/* ════════════════════════════════════════════════════════════ */}
      {/* TAB: HISTORY                                                */}
      {/* ════════════════════════════════════════════════════════════ */}
      {tab === 'history' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Calendar */}
          <div className="space-y-4">
            <div className="bg-white dark:bg-black border border-[#E5E7EB] dark:border-[#1A1A1A] rounded-2xl p-4">
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
                <span className="text-sm font-bold text-[#111111] dark:text-white capitalize">
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
                  <div key={i} className="text-center text-[10px] text-[#737373] dark:text-[#A3A3A3] font-semibold py-1">{d}</div>
                ))}
              </div>

              {/* Days */}
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
                        <span className="absolute bottom-0.5 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-emerald-500" />
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Legend */}
              <div className="flex items-center gap-3 mt-3 text-[10px] text-[#737373] dark:text-[#A3A3A3]">
                <span className="flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> Service
                </span>
                <span className="flex items-center gap-1">
                  <span className="inline-block w-3 h-2 rounded-sm" style={{ background: 'linear-gradient(90deg, rgba(20,184,166,0.1), rgba(20,184,166,0.4))' }} />
                  CA
                </span>
              </div>

              {/* Day stats */}
              {dayStats && (
                <div className="mt-4 pt-3 border-t border-[#E5E7EB] dark:border-[#1A1A1A] space-y-2">
                  <div className="text-xs font-bold text-[#111111] dark:text-white">
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

            {/* Monthly summary */}
            {monthlySummary && (
              <div className="bg-white dark:bg-black border border-[#E5E7EB] dark:border-[#1A1A1A] rounded-2xl p-4">
                <h3 className="text-xs font-bold text-[#111111] dark:text-white uppercase tracking-wider mb-3 flex items-center gap-1.5">
                  <BarChart3 className="w-3.5 h-3.5 text-teal-500" />
                  Resume du mois
                </h3>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-[#737373] dark:text-[#A3A3A3]">CA total</span>
                    <span className="text-sm font-bold text-emerald-500">{formatCurrency(monthlySummary.totalCA)}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-[#737373] dark:text-[#A3A3A3]">Couverts</span>
                    <span className="text-sm font-bold text-[#111111] dark:text-white">{monthlySummary.totalCouverts}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-[#737373] dark:text-[#A3A3A3]">Marge brute</span>
                    <span className="text-sm font-bold text-teal-500">{formatCurrency(monthlySummary.totalMarge)}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-[#737373] dark:text-[#A3A3A3]">Marge moy.</span>
                    <span className={`text-sm font-bold ${monthlySummary.avgMarge >= 70 ? 'text-emerald-500' : 'text-amber-500'}`}>
                      {monthlySummary.avgMarge.toFixed(1)}%
                    </span>
                  </div>
                  <div className="pt-2 border-t border-[#E5E7EB] dark:border-[#1A1A1A] flex items-center justify-between">
                    <span className="text-[10px] text-[#737373] dark:text-[#A3A3A3]">
                      {monthlySummary.serviceCount} services sur {monthlySummary.dayCount} jours
                    </span>
                    <span className="text-[10px] text-[#737373] dark:text-[#A3A3A3]">
                      Moy/service: {formatCurrency(monthlySummary.totalCA / monthlySummary.serviceCount)}
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Service list for selected date */}
          <div className="lg:col-span-2 space-y-3">
            {selectedHistoryDate ? (
              <>
                <h3 className="text-sm font-bold text-[#111111] dark:text-white">
                  Services du {formatDate(selectedHistoryDate)}
                </h3>
                {servicesForDate.length === 0 ? (
                  <div className="bg-white dark:bg-black border border-[#E5E7EB] dark:border-[#1A1A1A] rounded-2xl p-10 text-center">
                    <CalendarDays className="w-10 h-10 mx-auto text-[#525252] dark:text-[#737373] mb-3" />
                    <p className="text-[#737373] dark:text-[#A3A3A3] text-sm">Aucun service enregistre pour cette date</p>
                  </div>
                ) : (
                  servicesForDate.map(svc => (
                    <div key={svc.id} className="bg-white dark:bg-black border border-[#E5E7EB] dark:border-[#1A1A1A] rounded-2xl p-4">
                      <div className="flex items-center justify-between mb-3">
                        <div>
                          <h4 className="text-[#111111] dark:text-white font-bold flex items-center gap-2">
                            {svc.type === 'midi' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-blue-400" />}
                            Service {svc.type === 'midi' ? 'du Midi' : 'du Soir'}
                          </h4>
                          <span className="text-xs text-[#737373] dark:text-[#A3A3A3]">
                            {formatTime(svc.startTime)} - {formatTime(svc.endTime)} ({formatDuration(svc.endTime - svc.startTime)})
                          </span>
                        </div>
                        <button
                          onClick={() => exportService(svc)}
                          className="p-2 hover:bg-[#F5F5F5] dark:hover:bg-[#262626] rounded-lg transition-colors"
                          title="Exporter"
                        >
                          <Download className="w-4 h-4 text-[#737373] dark:text-[#A3A3A3]" />
                        </button>
                      </div>

                      <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                        {[
                          { label: 'Couverts', value: String(svc.totalCouverts), cls: 'text-[#111111] dark:text-white' },
                          { label: 'CA', value: formatCurrency(svc.totalCA), cls: 'text-emerald-500' },
                          { label: 'Cout', value: formatCurrency(svc.totalCout), cls: 'text-red-400' },
                          { label: 'Marge', value: formatCurrency(svc.margeBrute), cls: 'text-teal-500' },
                          { label: 'Marge %', value: `${svc.margePercent.toFixed(1)}%`, cls: svc.margePercent >= 70 ? 'text-emerald-500' : 'text-amber-500' },
                        ].map(item => (
                          <div key={item.label} className="bg-[#F5F5F5] dark:bg-[#0A0A0A] border border-[#E5E7EB] dark:border-[#1A1A1A] rounded-lg p-2.5 text-center">
                            <div className={`text-lg font-bold ${item.cls}`}>{item.value}</div>
                            <div className="text-[10px] text-[#737373] dark:text-[#A3A3A3]">{item.label}</div>
                          </div>
                        ))}
                      </div>

                      {svc.topPlats.length > 0 && (
                        <div className="mt-3 flex flex-wrap gap-2">
                          {svc.topPlats.map((p, i) => (
                            <span key={p.name} className="text-xs bg-[#F5F5F5] dark:bg-[#0A0A0A] border border-[#E5E7EB] dark:border-[#1A1A1A] text-[#111111] dark:text-[#D4D4D4] rounded-full px-2.5 py-1 font-medium">
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
                <h3 className="text-sm font-bold text-[#111111] dark:text-white">Derniers services</h3>
                {history.length === 0 ? (
                  <div className="bg-white dark:bg-black border border-[#E5E7EB] dark:border-[#1A1A1A] rounded-2xl p-10 text-center">
                    <Timer className="w-10 h-10 mx-auto text-[#525252] dark:text-[#737373] mb-3" />
                    <p className="text-[#737373] dark:text-[#A3A3A3] text-sm">Aucun service enregistre</p>
                    <p className="text-[#525252] dark:text-[#737373] text-xs mt-1">Demarrez un service pour commencer le suivi</p>
                  </div>
                ) : (
                  history.slice(0, 15).map(svc => (
                    <button
                      key={svc.id}
                      onClick={() => setSelectedHistoryDate(svc.date)}
                      className="w-full bg-white dark:bg-black border border-[#E5E7EB] dark:border-[#1A1A1A] rounded-xl p-3.5 text-left hover:border-teal-500/50 dark:hover:border-teal-500/50 transition-all group"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          {svc.type === 'midi'
                            ? <Sun className="w-5 h-5 text-amber-400 flex-shrink-0" />
                            : <Moon className="w-5 h-5 text-blue-400 flex-shrink-0" />
                          }
                          <div>
                            <div className="text-sm font-semibold text-[#111111] dark:text-white">
                              {formatDate(svc.date)} -- {svc.type === 'midi' ? 'Midi' : 'Soir'}
                            </div>
                            <div className="text-[11px] text-[#737373] dark:text-[#A3A3A3]">
                              {svc.totalCouverts} couverts | {formatDuration(svc.endTime - svc.startTime)}
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-sm font-bold text-emerald-500">{formatCurrency(svc.totalCA)}</div>
                          <div className={`text-[11px] font-semibold ${svc.margePercent >= 70 ? 'text-emerald-500' : 'text-amber-500'}`}>
                            {svc.margePercent.toFixed(1)}% marge
                          </div>
                        </div>
                        <ArrowRight className="w-4 h-4 text-[#525252] group-hover:text-teal-500 transition-colors ml-2 flex-shrink-0" />
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
