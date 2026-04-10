import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeft, Clock, ChefHat, X, Play, Pause, RotateCcw, Timer,
  UtensilsCrossed, Maximize2, Minimize2, Plus, Trash2, AlertTriangle,
  CheckCircle2, Eye, Flame, Volume2, VolumeX, Printer,
  Star, Users, MicOff, Zap,
  SplitSquareHorizontal, BarChart3, TrendingUp, Award, Archive,
  ShieldAlert, Megaphone, Undo2, ArrowDown, PauseCircle,
  Settings, Edit3, Scissors, LayoutGrid, MapPin, XCircle
} from 'lucide-react';
import { fetchRecipes } from '../services/api';
import type { Recipe } from '../types';

// ══════════════════════════════════════════════════════════════════════════
// ██  TYPES  ██████████████████████████████████████████████████████████████
// ══════════════════════════════════════════════════════════════════════════
type DishStatus = 'attente' | 'preparation' | 'pret' | 'servi';
type OrderPriority = 'normal' | 'rush' | 'vip';
type StationView = 'complete' | 'chaud' | 'froid' | 'passe';
type OrderHoldStatus = 'active' | 'hold';

interface OrderDish {
  id: string;
  recipeName: string;
  recipeId: number | null;
  quantity: number;
  status: DishStatus;
  prepTimeMinutes: number;
  startedAt: number | null;
  completedAt: number | null;
  servedAt: number | null;
  category?: string;
  course?: 'entree' | 'plat' | 'dessert' | 'autre';
}

interface Order {
  id: string;
  orderNumber: number;
  tableNumber: number;
  serverName: string;
  createdAt: number;
  dishes: OrderDish[];
  notes: string;
  priority: OrderPriority;
  source: 'kitchen' | 'service-tracker';
  archivedAt?: number | null;
  bumpedAt?: number | null;
  holdStatus: OrderHoldStatus;
}

type TableStatus = 'libre' | 'occupee' | 'attente';

interface TableInfo {
  number: number;
  section: 'salle' | 'terrasse';
}

interface TableConfig {
  tableCount: number;
  tables: TableInfo[];
}

interface DailyStats {
  platsServis: number;
  tempsMoyenSeconds: number;
  totalPrepTimes: number[];
  dishPrepTimes: Record<string, number[]>;
  hourlyOrders: Record<number, number>;
  revenueToday: number;
}

interface OrderTimestamp {
  time: number;
}

// ══════════════════════════════════════════════════════════════════════════
// ██  CONSTANTS  ██████████████████████████████████████████████████████████
// ══════════════════════════════════════════════════════════════════════════
const STORAGE_KEY = 'kitchen-mode-orders';
const STATS_KEY = 'kitchen-mode-stats';
const STATS_DATE_KEY = 'kitchen-mode-stats-date';
const SERVICE_TRACKER_KEY = 'service-tracker-current';
const KITCHEN_SYNC_KEY = 'kitchen-orders-sync';
const KITCHEN_SOUND_KEY = 'kitchen-mode-sound';
const KITCHEN_VOICE_KEY = 'kitchen-mode-voice';
const KITCHEN_STATION_KEY = 'kitchen-mode-station';
const KITCHEN_ARCHIVE_KEY = 'kitchen-mode-archived-count';
const KITCHEN_ORDER_TIMESTAMPS_KEY = 'kitchen-mode-order-timestamps';
const KITCHEN_ORDER_COUNTER_KEY = 'kitchen-mode-order-counter';
const KITCHEN_BUMPED_KEY = 'kitchen-mode-bumped';
const KITCHEN_TABLE_CONFIG_KEY = 'kitchen-mode-table-config';
const AUTO_DIM_TIMEOUT = 30000;
const AUTO_ARCHIVE_DELAY = 30000;
const RUSH_WINDOW_MS = 10 * 60 * 1000;
const RUSH_THRESHOLD = 5;
const PULSE_THRESHOLD_MS = 10 * 60 * 1000; // 10min for pulsing border

// Course detection keywords
const COURSE_ENTREE_KEYWORDS = ['entree', 'entrees', 'salade', 'salades', 'froid', 'tartare', 'carpaccio', 'ceviche', 'veloute', 'terrine', 'gaspacho', 'bruschetta'];
const COURSE_DESSERT_KEYWORDS = ['dessert', 'desserts', 'patisserie', 'patisseries', 'glace', 'glaces', 'sorbet', 'mousse', 'tiramisu', 'creme brulee', 'tarte', 'fondant', 'gateau', 'macaron', 'fruit', 'fromage', 'fromages'];
const COURSE_PLAT_KEYWORDS = ['plat', 'plats', 'viande', 'viandes', 'poisson', 'poissons', 'grillade', 'grillades', 'pizza', 'pizzas', 'pate', 'pates', 'risotto', 'soupe', 'soupes', 'plat principal', 'plat du jour', 'chaud', 'burger', 'steak'];

// Allergen keywords
const ALLERGEN_KEYWORDS: Record<string, string> = {
  'gluten': 'GLUTEN', 'ble': 'GLUTEN', 'lactose': 'LACTOSE', 'lait': 'LACTOSE',
  'noix': 'NOIX', 'noisette': 'NOIX', 'amande': 'NOIX',
  'arachide': 'ARACHIDES', 'arachides': 'ARACHIDES', 'cacahuete': 'ARACHIDES',
  'oeuf': 'OEUFS', 'oeufs': 'OEUFS', 'poisson': 'POISSON',
  'crustace': 'CRUSTACES', 'crustaces': 'CRUSTACES', 'soja': 'SOJA',
  'celeri': 'CELERI', 'moutarde': 'MOUTARDE', 'sesame': 'SESAME',
  'sulfite': 'SULFITES', 'sulfites': 'SULFITES', 'lupin': 'LUPIN',
  'mollusque': 'MOLLUSQUES', 'mollusques': 'MOLLUSQUES',
  'allergie': 'ALLERGIE', 'vegetarien': 'VEGETARIEN', 'vegan': 'VEGAN',
  'sans gluten': 'SANS GLUTEN',
};

// Hot kitchen categories
const HOT_CATEGORIES = ['plat', 'plats', 'viande', 'viandes', 'poisson', 'poissons', 'grillade', 'grillades', 'pizza', 'pizzas', 'pate', 'pates', 'risotto', 'soupe', 'soupes', 'plat principal', 'plat du jour', 'chaud'];
const COLD_CATEGORIES = ['entree', 'entrees', 'dessert', 'desserts', 'salade', 'salades', 'froid', 'fromage', 'fromages', 'patisserie', 'patisseries', 'glace', 'glaces', 'tartare', 'carpaccio', 'ceviche'];

// ══════════════════════════════════════════════════════════════════════════
// ██  GLOBAL STYLES (injected once)  ██████████████████████████████████████
// ══════════════════════════════════════════════════════════════════════════
const KDS_STYLES = `
  @keyframes kds-pulse-border {
    0%, 100% { border-color: rgba(239, 68, 68, 0.7); box-shadow: 0 0 20px rgba(239, 68, 68, 0.15); }
    50% { border-color: rgba(239, 68, 68, 1); box-shadow: 0 0 40px rgba(239, 68, 68, 0.35); }
  }
  @keyframes kds-flash-red {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.4; }
  }
  @keyframes kds-allergen-flash {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.6; }
  }
  @keyframes kds-rush-pulse {
    0%, 100% { background-color: #ef4444; }
    50% { background-color: #dc2626; }
  }
  @keyframes kds-bump-success {
    0% { transform: scale(1); }
    50% { transform: scale(1.05); }
    100% { transform: scale(1) translateY(20px); opacity: 0; }
  }
  @keyframes kds-slide-in {
    from { opacity: 0; transform: translateY(-12px) scale(0.97); }
    to { opacity: 1; transform: translateY(0) scale(1); }
  }
  @keyframes kds-fade-strikethrough {
    from { opacity: 1; }
    to { opacity: 0.35; }
  }
  .kds-card-enter { animation: kds-slide-in 0.3s ease-out; }
  .kds-card-bump { animation: kds-bump-success 0.5s ease-out forwards; }
  .kds-dish-done { animation: kds-fade-strikethrough 0.3s ease-out forwards; }
  .kds-pulse-waiting { animation: kds-pulse-border 2s ease-in-out infinite; }
  .kds-flash-overtime { animation: kds-flash-red 0.8s ease-in-out infinite; }

  /* Progress bar animations */
  .kds-progress-bar { transition: width 1s linear, background-color 0.5s ease; }

  /* Drag styles */
  .kds-dragging { opacity: 0.6; transform: rotate(2deg) scale(1.02); }
  .kds-drop-target { outline: 3px dashed rgba(20, 184, 166, 0.6); outline-offset: 4px; }

  /* All transitions for state changes */
  .kds-transition { transition: all 0.2s ease; }
`;

// ══════════════════════════════════════════════════════════════════════════
// ██  SOUND SYSTEM (Web Audio API - 3 distinct sounds)  ██████████████████
// ══════════════════════════════════════════════════════════════════════════
const audioCtxRef = { current: null as AudioContext | null };

function getAudioCtx(): AudioContext {
  if (!audioCtxRef.current) {
    audioCtxRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
  }
  return audioCtxRef.current;
}

// Sound 1: New order "ding" bell - bright metallic tap
function playBellSound() {
  try {
    const ctx = getAudioCtx();
    const osc = ctx.createOscillator();
    const osc2 = ctx.createOscillator();
    const gain = ctx.createGain();
    const gain2 = ctx.createGain();
    osc.connect(gain); gain.connect(ctx.destination);
    osc2.connect(gain2); gain2.connect(ctx.destination);
    // Primary bell tone
    osc.type = 'sine';
    osc.frequency.setValueAtTime(1200, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(800, ctx.currentTime + 0.3);
    gain.gain.setValueAtTime(0.35, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.6);
    // Harmonic overtone
    osc2.type = 'sine';
    osc2.frequency.setValueAtTime(2400, ctx.currentTime);
    gain2.gain.setValueAtTime(0.12, ctx.currentTime);
    gain2.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.3);
    osc.start(ctx.currentTime); osc.stop(ctx.currentTime + 0.6);
    osc2.start(ctx.currentTime); osc2.stop(ctx.currentTime + 0.3);
  } catch {}
}

// Sound 2: Order ready - ascending three-note chime
function playReadySound() {
  try {
    const ctx = getAudioCtx();
    const notes = [523.25, 659.25, 783.99]; // C5, E5, G5 - major triad
    notes.forEach((freq, i) => {
      const delay = i * 0.12;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain); gain.connect(ctx.destination);
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, ctx.currentTime + delay);
      gain.gain.setValueAtTime(0.25, ctx.currentTime + delay);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + delay + 0.4);
      osc.start(ctx.currentTime + delay);
      osc.stop(ctx.currentTime + delay + 0.4);
    });
  } catch {}
}

// Sound 3: Rush hour alarm - urgent pulsing tone
function playRushAlarm() {
  try {
    const ctx = getAudioCtx();
    for (let i = 0; i < 3; i++) {
      const delay = i * 0.25;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain); gain.connect(ctx.destination);
      osc.type = 'square';
      osc.frequency.setValueAtTime(440, ctx.currentTime + delay);
      osc.frequency.setValueAtTime(520, ctx.currentTime + delay + 0.08);
      gain.gain.setValueAtTime(0.15, ctx.currentTime + delay);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + delay + 0.2);
      osc.start(ctx.currentTime + delay);
      osc.stop(ctx.currentTime + delay + 0.2);
    }
  } catch {}
}

// ══════════════════════════════════════════════════════════════════════════
// ██  VOICE ANNOUNCEMENTS  ███████████████████████████████████████████████
// ══════════════════════════════════════════════════════════════════════════
function announceReady(tableNumber: number) {
  try {
    if (!('speechSynthesis' in window)) return;
    const utterance = new SpeechSynthesisUtterance(`Table ${tableNumber}, commande prete!`);
    utterance.lang = 'fr-FR';
    utterance.rate = 1.1;
    utterance.pitch = 1.0;
    utterance.volume = 1.0;
    const voices = window.speechSynthesis.getVoices();
    const frVoice = voices.find(v => v.lang.startsWith('fr'));
    if (frVoice) utterance.voice = frVoice;
    window.speechSynthesis.speak(utterance);
  } catch {}
}

// ══════════════════════════════════════════════════════════════════════════
// ██  HELPERS  ████████████████████████████████████████████████████████████
// ══════════════════════════════════════════════════════════════════════════
function uid(): string {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
}

function detectAllergens(notes: string): string[] {
  if (!notes) return [];
  const lower = notes.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  const found = new Set<string>();
  for (const [keyword, allergen] of Object.entries(ALLERGEN_KEYWORDS)) {
    const normalizedKeyword = keyword.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    if (lower.includes(normalizedKeyword)) found.add(allergen);
  }
  return Array.from(found);
}

function detectCourse(dish: { recipeName: string; category?: string }): 'entree' | 'plat' | 'dessert' | 'autre' {
  const name = (dish.recipeName || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  const cat = (dish.category || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  if (COURSE_ENTREE_KEYWORDS.some(k => cat.includes(k) || name.includes(k))) return 'entree';
  if (COURSE_DESSERT_KEYWORDS.some(k => cat.includes(k) || name.includes(k))) return 'dessert';
  if (COURSE_PLAT_KEYWORDS.some(k => cat.includes(k) || name.includes(k))) return 'plat';
  return 'plat'; // default to plat
}

function isDishHot(dish: OrderDish): boolean {
  const name = (dish.recipeName || '').toLowerCase();
  const cat = (dish.category || '').toLowerCase();
  if (HOT_CATEGORIES.some(c => cat.includes(c))) return true;
  if (['steak', 'poulet', 'boeuf', 'agneau', 'canard', 'saumon', 'grille', 'roti', 'braise', 'soupe', 'pizza', 'pate', 'risotto', 'burger', 'frite'].some(w => name.includes(w))) return true;
  if (COLD_CATEGORIES.some(c => cat.includes(c) || name.includes(c))) return false;
  return true;
}

function formatElapsed(seconds: number): string {
  if (seconds < 0) seconds = 0;
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
}

function formatOrderNumber(n: number): string {
  return `#${n.toString().padStart(3, '0')}`;
}

function getWaitColor(elapsedSeconds: number): string {
  const mins = elapsedSeconds / 60;
  if (mins < 5) return '#22c55e';
  if (mins < 10) return '#f59e0b';
  if (mins < 20) return '#f97316';
  return '#ef4444';
}

function getCourseColor(course: string): { bg: string; text: string; label: string } {
  switch (course) {
    case 'entree': return { bg: 'bg-[#1e3a5f]', text: 'text-[#60a5fa]', label: 'ENTREE' };
    case 'plat': return { bg: 'bg-[#78350f]', text: 'text-[#fb923c]', label: 'PLAT' };
    case 'dessert': return { bg: 'bg-[#4a1942]', text: 'text-[#f0abfc]', label: 'DESSERT' };
    default: return { bg: 'bg-[#262626]', text: 'text-[#a1a1aa]', label: 'AUTRE' };
  }
}

function getPriorityConfig(p: OrderPriority) {
  switch (p) {
    case 'vip': return { label: 'VIP', bg: 'bg-[#7c3aed]', text: 'text-white', ring: 'ring-[#7c3aed]/40' };
    case 'rush': return { label: 'RUSH', bg: 'bg-[#ef4444]', text: 'text-white', ring: 'ring-[#ef4444]/40' };
    default: return { label: '', bg: '', text: '', ring: '' };
  }
}

function getOrderColumn(order: Order): 'new' | 'preparing' | 'ready' {
  if (order.bumpedAt) return 'ready'; // bumped = done
  const allServed = order.dishes.every(d => d.status === 'servi');
  if (allServed) return 'ready';
  const allPretOrServed = order.dishes.every(d => d.status === 'pret' || d.status === 'servi');
  if (allPretOrServed) return 'ready';
  const hasAnyPrep = order.dishes.some(d => d.status === 'preparation');
  if (hasAnyPrep) return 'preparing';
  return 'new';
}

function getDefaultTableConfig(count: number = 12): TableConfig {
  const tables: TableInfo[] = [];
  for (let i = 1; i <= count; i++) {
    tables.push({ number: i, section: i <= Math.ceil(count * 0.75) ? 'salle' : 'terrasse' });
  }
  return { tableCount: count, tables };
}

function getTableStatus(tableNumber: number, orders: Order[]): { status: TableStatus; orderCount: number; firstOrderTime: number | null } {
  const tableOrders = orders.filter(o => o.tableNumber === tableNumber && !o.bumpedAt && !o.dishes.every(d => d.status === 'servi'));
  if (tableOrders.length === 0) return { status: 'libre', orderCount: 0, firstOrderTime: null };
  const hasWaiting = tableOrders.some(o => o.dishes.some(d => d.status === 'attente'));
  const firstOrderTime = Math.min(...tableOrders.map(o => o.createdAt));
  if (hasWaiting) return { status: 'attente', orderCount: tableOrders.length, firstOrderTime };
  return { status: 'occupee', orderCount: tableOrders.length, firstOrderTime };
}

// ══════════════════════════════════════════════════════════════════════════
// ██  DEMO DATA  ██████████████████████████████████████████████████████████
// ══════════════════════════════════════════════════════════════════════════
const DEMO_SERVERS = ['Marie', 'Karim', 'Julie', 'Thomas', 'Sofia', 'Lucas'];

function generateDemoOrders(recipes: Recipe[], startCounter: number): { orders: Order[]; nextCounter: number } {
  const now = Date.now();
  const pick = () => {
    if (recipes.length === 0) return { name: 'Plat du jour', id: null, prep: 10, category: 'plat' };
    const r = recipes[Math.floor(Math.random() * recipes.length)];
    return { name: r.name, id: r.id, prep: (r.prepTimeMinutes || 5) + (r.cookTimeMinutes || 5), category: r.category || 'plat' };
  };
  const srv = () => DEMO_SERVERS[Math.floor(Math.random() * DEMO_SERVERS.length)];
  let counter = startCounter;

  const makeDish = (overrides: Partial<OrderDish> = {}): OrderDish => {
    const p = pick();
    return {
      id: uid(), recipeName: p.name, recipeId: p.id, quantity: 1,
      status: 'attente', prepTimeMinutes: p.prep,
      startedAt: null, completedAt: null, servedAt: null,
      category: p.category, course: detectCourse({ recipeName: p.name, category: p.category }),
      ...overrides,
    };
  };

  const orders: Order[] = [
    {
      id: uid(), orderNumber: ++counter, tableNumber: 3, serverName: srv(), createdAt: now - 22 * 60 * 1000,
      notes: 'ALLERGIE ARACHIDES - Sans gluten', priority: 'rush', source: 'kitchen', holdStatus: 'active',
      dishes: [
        makeDish({ quantity: 2, status: 'preparation', prepTimeMinutes: 12, startedAt: now - 8 * 60 * 1000, category: 'plat', course: 'plat' }),
        makeDish({ status: 'attente', prepTimeMinutes: 15, category: 'dessert', course: 'dessert' }),
      ],
    },
    {
      id: uid(), orderNumber: ++counter, tableNumber: 7, serverName: srv(), createdAt: now - 12 * 60 * 1000,
      notes: 'Sans lactose', priority: 'normal', source: 'kitchen', holdStatus: 'active',
      dishes: [
        makeDish({ status: 'attente', prepTimeMinutes: 10, category: 'entree', course: 'entree' }),
        makeDish({ quantity: 3, status: 'attente', prepTimeMinutes: 8, category: 'plat', course: 'plat' }),
        makeDish({ status: 'attente', prepTimeMinutes: 20, category: 'plat', course: 'plat' }),
      ],
    },
    {
      id: uid(), orderNumber: ++counter, tableNumber: 1, serverName: srv(), createdAt: now - 6 * 60 * 1000,
      notes: 'Allergie noix', priority: 'vip', source: 'kitchen', holdStatus: 'active',
      dishes: [
        makeDish({ status: 'preparation', prepTimeMinutes: 18, startedAt: now - 5 * 60 * 1000, category: 'plat', course: 'plat' }),
        makeDish({ quantity: 2, status: 'pret', prepTimeMinutes: 8, startedAt: now - 10 * 60 * 1000, completedAt: now - 2 * 60 * 1000, category: 'entree', course: 'entree' }),
      ],
    },
    {
      id: uid(), orderNumber: ++counter, tableNumber: 12, serverName: srv(), createdAt: now - 2 * 60 * 1000,
      notes: '', priority: 'normal', source: 'kitchen', holdStatus: 'active',
      dishes: [
        makeDish({ status: 'attente', prepTimeMinutes: 15, category: 'plat', course: 'plat' }),
        makeDish({ status: 'attente', prepTimeMinutes: 10, category: 'dessert', course: 'dessert' }),
      ],
    },
    {
      id: uid(), orderNumber: ++counter, tableNumber: 5, serverName: srv(), createdAt: now - 25 * 60 * 1000,
      notes: 'Vegetarien strict', priority: 'normal', source: 'kitchen', holdStatus: 'active',
      dishes: [
        makeDish({ status: 'pret', prepTimeMinutes: 12, startedAt: now - 20 * 60 * 1000, completedAt: now - 3 * 60 * 1000, category: 'salade', course: 'entree' }),
        makeDish({ quantity: 2, status: 'pret', prepTimeMinutes: 10, startedAt: now - 18 * 60 * 1000, completedAt: now - 4 * 60 * 1000, category: 'entree', course: 'entree' }),
      ],
    },
    {
      id: uid(), orderNumber: ++counter, tableNumber: 9, serverName: srv(), createdAt: now - 1 * 60 * 1000,
      notes: '', priority: 'rush', source: 'kitchen', holdStatus: 'active',
      dishes: [
        makeDish({ quantity: 4, status: 'attente', prepTimeMinutes: 6, category: 'plat', course: 'plat' }),
      ],
    },
  ];

  return { orders, nextCounter: counter };
}

// ══════════════════════════════════════════════════════════════════════════
// ██  DISH PROGRESS BAR  ██████████████████████████████████████████████████
// ══════════════════════════════════════════════════════════════════════════
function DishProgressBar({ dish, now }: { dish: OrderDish; now: number }) {
  if (dish.status !== 'preparation' || !dish.startedAt) return null;

  const elapsed = (now - dish.startedAt) / 1000;
  const target = dish.prepTimeMinutes * 60;
  const pct = Math.min((elapsed / target) * 100, 150);
  const ratio = elapsed / target;

  let barColor = '#22c55e'; // green
  if (ratio >= 1.2) barColor = '#ef4444'; // flashing red
  else if (ratio >= 1.0) barColor = '#ef4444'; // red
  else if (ratio >= 0.8) barColor = '#f59e0b'; // amber

  return (
    <div className="w-full h-2 bg-[#1a1a1a] rounded-full overflow-hidden mt-1.5">
      <div
        className={`h-full rounded-full kds-progress-bar ${ratio >= 1.2 ? 'kds-flash-overtime' : ''}`}
        style={{ width: `${Math.min(pct, 100)}%`, backgroundColor: barColor }}
      />
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════
// ██  DISH TIMER DISPLAY  ████████████████████████████████████████████████
// ══════════════════════════════════════════════════════════════════════════
function DishTimer({ dish, now }: { dish: OrderDish; now: number }) {
  if (dish.status === 'servi') return <span className="text-[#404040] font-mono text-xl line-through">--:--</span>;
  if (dish.status === 'pret') return <span className="text-[#34d399] font-mono text-xl font-bold">PRET</span>;
  if (dish.status === 'attente') {
    return (
      <div className="text-right">
        <span className="text-[#71717a] font-mono text-xl">{dish.prepTimeMinutes}:00</span>
        <div className="text-xs text-[#404040]">cible</div>
      </div>
    );
  }

  const elapsed = dish.startedAt ? Math.floor((now - dish.startedAt) / 1000) : 0;
  const target = dish.prepTimeMinutes * 60;
  const remaining = target - elapsed;
  const isOvertime = remaining <= 0;
  const ratio = elapsed / target;

  return (
    <div className="text-right">
      <span className={`font-mono text-xl font-bold ${
        ratio >= 1.2 ? 'text-[#ef4444] kds-flash-overtime' :
        isOvertime ? 'text-[#ef4444]' :
        remaining < 60 ? 'text-[#fbbf24]' : 'text-[#22c55e]'
      }`}>
        {isOvertime ? '+' : ''}{formatElapsed(Math.abs(remaining))}
      </span>
      <div className="text-xs text-[#525252] font-mono">{dish.prepTimeMinutes}m cible</div>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════
// ██  PREP TIME ESTIMATOR  ███████████████████████████████████████████████
// ══════════════════════════════════════════════════════════════════════════
function PrepTimeEstimator({ order, now }: { order: Order; now: number }) {
  const unfinished = order.dishes.filter(d => d.status !== 'pret' && d.status !== 'servi');
  if (unfinished.length === 0) return null;

  let maxRemainingMinutes = 0;
  for (const dish of unfinished) {
    if (dish.status === 'preparation' && dish.startedAt) {
      const elapsedMin = (now - dish.startedAt) / 60000;
      const remaining = Math.max(0, dish.prepTimeMinutes - elapsedMin);
      maxRemainingMinutes = Math.max(maxRemainingMinutes, remaining);
    } else if (dish.status === 'attente') {
      maxRemainingMinutes = Math.max(maxRemainingMinutes, dish.prepTimeMinutes);
    }
  }

  const mins = Math.ceil(maxRemainingMinutes);
  if (mins <= 0) return null;

  return (
    <div className="px-5 py-2 bg-[#1e3a5f]/30 border-t border-[#1e3a5f]/40 flex items-center gap-2">
      <Timer className="w-5 h-5 text-[#60a5fa]" />
      <span className="text-[#60a5fa] text-lg font-bold">
        Pret dans ~{mins} min
      </span>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════
// ██  ALLERGEN BANNER  ███████████████████████████████████████████████████
// ══════════════════════════════════════════════════════════════════════════
function AllergenBanner({ notes }: { notes: string }) {
  const allergens = detectAllergens(notes);
  if (allergens.length === 0) return null;

  return (
    <div className="px-5 py-2.5 border-t-2 border-[#ef4444]/50"
      style={{ animation: 'kds-allergen-flash 1s ease-in-out infinite', background: 'linear-gradient(90deg, rgba(239,68,68,0.15) 0%, rgba(239,68,68,0.25) 50%, rgba(239,68,68,0.15) 100%)' }}>
      <div className="flex items-center gap-2 flex-wrap">
        <ShieldAlert className="w-6 h-6 text-[#ef4444] animate-bounce" />
        <span className="text-[#ef4444] text-lg font-black uppercase tracking-wider">ALLERGENE</span>
        {allergens.map(a => (
          <span key={a} className="px-3 py-1.5 bg-[#ef4444] text-white rounded-lg text-sm font-black shadow-lg shadow-red-500/30">{a}</span>
        ))}
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════
// ██  RECIPE QUICK VIEW  ██████████████████████████████████████████████████
// ══════════════════════════════════════════════════════════════════════════
function RecipeQuickView({ recipe, onClose }: { recipe: Recipe; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-sm p-4" onClick={onClose}>
      <div className="bg-[#0a0a0a] border-2 border-[#333333] rounded-2xl w-full max-w-2xl max-h-[85vh] overflow-y-auto p-6" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-3xl font-bold text-white">{recipe.name}</h2>
            <div className="flex gap-3 mt-2 flex-wrap">
              <span className="text-lg text-[#fbbf24] font-semibold">{recipe.category}</span>
              <span className="text-lg text-[#a1a1aa]">{recipe.nbPortions} portions</span>
              {recipe.prepTimeMinutes > 0 && <span className="text-lg text-[#60a5fa]">Prep {recipe.prepTimeMinutes}min</span>}
              {recipe.cookTimeMinutes > 0 && <span className="text-lg text-[#f97316]">Cuisson {recipe.cookTimeMinutes}min</span>}
            </div>
          </div>
          <button onClick={onClose} aria-label="Fermer" className="p-3 rounded-xl bg-[#1a1a1a] hover:bg-[#262626] text-[#a1a1aa] hover:text-white transition-colors min-w-[64px] min-h-[64px] flex items-center justify-center">
            <X className="w-7 h-7" />
          </button>
        </div>
        {recipe.ingredients?.some((ri: any) => ri.ingredient?.allergens?.length > 0) && (
          <div className="bg-[#ef4444]/10 border border-[#ef4444]/30 rounded-xl p-4 mb-6">
            <div className="flex items-center gap-2 text-[#ef4444] text-xl font-bold mb-2">
              <AlertTriangle className="w-6 h-6" />ALLERGENES
            </div>
            <div className="flex flex-wrap gap-2">
              {Array.from(new Set(recipe.ingredients?.flatMap((ri: any) => ri.ingredient?.allergens || []) || [])).map((a: any, i: number) => (
                <span key={i} className="px-3 py-1 bg-[#ef4444]/20 text-[#ef4444] rounded-lg text-lg font-semibold">{a}</span>
              ))}
            </div>
          </div>
        )}
        <h3 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
          <UtensilsCrossed className="w-6 h-6 text-[#fbbf24]" />Ingredients
        </h3>
        <div className="space-y-2 mb-6">
          {recipe.ingredients?.map((ri: any) => (
            <div key={ri.id} className="flex justify-between items-center bg-[#1a1a1a] rounded-xl px-5 py-4">
              <span className="text-xl font-semibold text-white">{ri.ingredient?.name || 'Ingredient'}</span>
              <span className="text-xl text-[#fbbf24] font-mono font-bold">{ri.quantity} {ri.ingredient?.unit || ''}</span>
            </div>
          ))}
        </div>
        <div className="bg-[#1a1a1a] border border-[#262626] rounded-xl p-5">
          <h3 className="text-xl font-bold text-white mb-3">Instructions de preparation</h3>
          <p className="text-lg text-[#71717a]">{recipe.description || 'Aucune instruction disponible.'}</p>
        </div>
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════
// ██  NEW ORDER MODAL  ████████████████████████████████████████████████████
// ══════════════════════════════════════════════════════════════════════════
function NewOrderModal({ recipes, onAdd, onClose }: { recipes: Recipe[]; onAdd: (order: Omit<Order, 'orderNumber'>) => void; onClose: () => void }) {
  const [tableNumber, setTableNumber] = useState<number>(1);
  const [serverName, setServerName] = useState('');
  const [notes, setNotes] = useState('');
  const [priority, setPriority] = useState<OrderPriority>('normal');
  const [selectedDishes, setSelectedDishes] = useState<{ recipeName: string; recipeId: number | null; prepTime: number; quantity: number; category: string }[]>([]);
  const [search, setSearch] = useState('');

  const filtered = recipes.filter(r =>
    r.name.toLowerCase().includes(search.toLowerCase()) || r.category.toLowerCase().includes(search.toLowerCase())
  );

  const addDish = (recipe: Recipe) => {
    const existing = selectedDishes.findIndex(d => d.recipeId === recipe.id);
    if (existing >= 0) {
      setSelectedDishes(prev => prev.map((d, i) => i === existing ? { ...d, quantity: d.quantity + 1 } : d));
    } else {
      setSelectedDishes(prev => [...prev, {
        recipeName: recipe.name, recipeId: recipe.id,
        prepTime: (recipe.prepTimeMinutes || 5) + (recipe.cookTimeMinutes || 5),
        quantity: 1, category: recipe.category || 'plat',
      }]);
    }
  };

  const detectedAllergens = detectAllergens(notes);

  const handleSubmit = () => {
    if (selectedDishes.length === 0) return;
    onAdd({
      id: uid(), tableNumber,
      serverName: serverName.trim() || 'Serveur', createdAt: Date.now(), notes, priority,
      source: 'kitchen', holdStatus: 'active',
      dishes: selectedDishes.map(d => ({
        id: uid(), recipeName: d.recipeName, recipeId: d.recipeId, quantity: d.quantity,
        status: 'attente' as DishStatus, prepTimeMinutes: d.prepTime,
        startedAt: null, completedAt: null, servedAt: null,
        category: d.category, course: detectCourse({ recipeName: d.recipeName, category: d.category }),
      })),
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-sm p-4" onClick={onClose}>
      <div className="bg-[#0a0a0a] border-2 border-[#333333] rounded-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto p-6" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-3xl font-bold text-white">Nouvelle Commande</h2>
          <button onClick={onClose} className="p-3 rounded-xl bg-[#1a1a1a] hover:bg-[#262626] text-[#a1a1aa] hover:text-white kds-transition min-w-[64px] min-h-[64px] flex items-center justify-center">
            <X className="w-7 h-7" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div>
            <label className="text-lg text-[#a1a1aa] mb-2 block">Table N&deg;</label>
            <div className="flex gap-2 flex-wrap">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map(n => (
                <button key={n} onClick={() => setTableNumber(n)}
                  className={`min-w-[64px] min-h-[64px] rounded-xl text-2xl font-bold kds-transition
                    ${tableNumber === n ? 'bg-[#0d9488] text-white' : 'bg-[#1a1a1a] text-[#a1a1aa] hover:bg-[#262626]'}`}>
                  {n}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="text-lg text-[#a1a1aa] mb-2 block">Serveur</label>
            <input value={serverName} onChange={e => setServerName(e.target.value)} placeholder="Nom du serveur..."
              className="w-full bg-[#1a1a1a] border border-[#333333] rounded-xl px-4 py-3 text-xl text-white placeholder-[#525252] focus:border-[#0d9488] focus:outline-none min-h-[64px] mb-4" />
            <label className="text-lg text-[#a1a1aa] mb-2 block">Priorite</label>
            <div className="flex gap-2">
              {(['normal', 'rush', 'vip'] as OrderPriority[]).map(p => (
                <button key={p} onClick={() => setPriority(p)}
                  className={`flex-1 min-h-[64px] rounded-xl text-xl font-bold kds-transition uppercase
                    ${priority === p
                      ? p === 'vip' ? 'bg-[#7c3aed] text-white' : p === 'rush' ? 'bg-[#ef4444] text-white' : 'bg-[#404040] text-white'
                      : 'bg-[#1a1a1a] text-[#71717a] hover:bg-[#262626]'}`}>
                  {p === 'vip' && <Star className="w-5 h-5 inline mr-1" />}{p}
                </button>
              ))}
            </div>
            <div className="mt-4">
              <label className="text-lg text-[#a1a1aa] mb-2 block">Notes / Allergies</label>
              <input value={notes} onChange={e => setNotes(e.target.value)} placeholder="Allergies, cuisson speciale..."
                className="w-full bg-[#1a1a1a] border border-[#333333] rounded-xl px-4 py-3 text-xl text-white placeholder-[#525252] focus:border-[#0d9488] focus:outline-none min-h-[64px]" />
              {detectedAllergens.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {detectedAllergens.map(a => (
                    <span key={a} className="px-2 py-1 bg-[#ef4444]/20 text-[#ef4444] rounded-lg text-sm font-bold animate-pulse">
                      <ShieldAlert className="w-3 h-3 inline mr-1" />{a}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {selectedDishes.length > 0 && (
          <div className="mb-6">
            <h3 className="text-xl font-bold text-white mb-3">Plats selectionnes ({selectedDishes.reduce((s, d) => s + d.quantity, 0)})</h3>
            <div className="space-y-2">
              {selectedDishes.map((d, i) => (
                <div key={i} className="flex items-center justify-between bg-[#1a1a1a] rounded-xl px-4 py-3">
                  <span className="text-lg text-white font-semibold">{d.quantity > 1 && <span className="text-[#fbbf24] mr-2">x{d.quantity}</span>}{d.recipeName}</span>
                  <div className="flex items-center gap-3">
                    <span className={`text-sm px-2 py-0.5 rounded ${getCourseColor(detectCourse({ recipeName: d.recipeName, category: d.category })).bg} ${getCourseColor(detectCourse({ recipeName: d.recipeName, category: d.category })).text}`}>
                      {getCourseColor(detectCourse({ recipeName: d.recipeName, category: d.category })).label}
                    </span>
                    <span className="text-[#a1a1aa] text-lg">{d.prepTime} min</span>
                    <button onClick={() => setSelectedDishes(prev => prev.filter((_, idx) => idx !== i))}
                      className="p-2 rounded-lg bg-[#ef4444]/10 hover:bg-[#ef4444]/20 text-[#ef4444] min-w-[56px] min-h-[56px] flex items-center justify-center">
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="mb-4">
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Chercher un plat..."
            className="w-full bg-[#1a1a1a] border border-[#333333] rounded-xl px-4 py-3 text-xl text-white placeholder-[#525252] focus:border-[#0d9488] focus:outline-none min-h-[64px]" />
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 max-h-[220px] overflow-y-auto mb-6">
          {filtered.map(recipe => (
            <button key={recipe.id} onClick={() => addDish(recipe)}
              className="text-left p-3 rounded-xl bg-[#1a1a1a] hover:bg-[#262626] border border-[#262626] hover:border-[#0d9488] kds-transition min-h-[64px]">
              <div className="text-white font-semibold text-lg truncate">{recipe.name}</div>
              <div className="text-[#71717a] text-sm">{recipe.category} - {(recipe.prepTimeMinutes || 0) + (recipe.cookTimeMinutes || 0)} min</div>
            </button>
          ))}
        </div>

        <button onClick={handleSubmit} disabled={selectedDishes.length === 0}
          className={`w-full min-h-[72px] rounded-xl text-2xl font-bold kds-transition
            ${selectedDishes.length > 0 ? 'bg-[#0d9488] hover:bg-[#14b8a6] text-white' : 'bg-[#1a1a1a] text-[#525252] cursor-not-allowed'}`}>
          Envoyer en cuisine ({selectedDishes.reduce((s, d) => s + d.quantity, 0)} plats)
        </button>
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════
// ██  ORDER CARD (Professional KDS)  ██████████████████████████████████████
// ══════════════════════════════════════════════════════════════════════════
function OrderCard({
  order, now, column, onDishStatusChange, onDishView, onRemoveOrder, onPrint, onBump, onHold, isArchiving, isDragging, onDragStart, onDragEnd, onDrop,
  onEditOrder, onDeleteOrder, onSplitOrder,
}: {
  order: Order; now: number; column: 'new' | 'preparing' | 'ready';
  onDishStatusChange: (orderId: string, dishId: string) => void;
  onDishView: (recipeId: number) => void;
  onRemoveOrder: (orderId: string) => void;
  onPrint: (order: Order) => void;
  onBump: (orderId: string) => void;
  onHold: (orderId: string) => void;
  isArchiving?: boolean;
  isDragging?: boolean;
  onDragStart?: (e: React.DragEvent, orderId: string) => void;
  onDragEnd?: () => void;
  onDrop?: (e: React.DragEvent, targetColumn: 'new' | 'preparing' | 'ready') => void;
  onEditOrder?: (order: Order) => void;
  onDeleteOrder?: (orderId: string) => void;
  onSplitOrder?: (order: Order) => void;
}) {
  const elapsed = Math.floor((now - order.createdAt) / 1000);
  const elapsedMs = now - order.createdAt;
  const allServed = order.dishes.every(d => d.status === 'servi');
  const allPretOrServed = order.dishes.every(d => d.status === 'pret' || d.status === 'servi');
  const prio = getPriorityConfig(order.priority);
  const allergens = detectAllergens(order.notes);
  const isOnHold = order.holdStatus === 'hold';
  const isBumped = !!order.bumpedAt;
  const isWaitingLong = elapsedMs > PULSE_THRESHOLD_MS && !allServed && !isOnHold;

  // Table badge color by column
  const tableBadgeBg = isBumped || allServed
    ? 'bg-[#1a1a1a]'
    : isOnHold
      ? 'bg-[#78350f]'
      : allPretOrServed
        ? 'bg-[#059669]'
        : column === 'preparing'
          ? 'bg-[#78350f]'
          : 'bg-[#1a1a1a]';

  const tableBadgeText = isBumped || allServed
    ? 'text-[#525252]'
    : isOnHold
      ? 'text-[#fbbf24]'
      : allPretOrServed
        ? 'text-white'
        : column === 'preparing'
          ? 'text-[#fbbf24]'
          : 'text-white';

  return (
    <div
      draggable
      onDragStart={e => onDragStart?.(e, order.id)}
      onDragEnd={onDragEnd}
      className={`
        group rounded-2xl border-2 overflow-hidden kds-card-enter
        ${isDragging ? 'kds-dragging' : ''}
        ${isArchiving ? 'opacity-0 scale-95 translate-y-4 transition-all duration-500' : ''}
        ${isWaitingLong ? 'kds-pulse-waiting border-[#ef4444]/70' :
          isOnHold ? 'border-[#f59e0b]/50 opacity-70' :
          allServed || isBumped ? 'border-[#262626] opacity-40' :
          column === 'new' ? 'border-[#525252]/40' :
          column === 'preparing' ? 'border-[#fbbf24]/40' :
          'border-[#34d399]/50'}
        ${order.priority !== 'normal' && !allServed && !isBumped ? `ring-2 ${prio.ring}` : ''}
        ${allergens.length > 0 && !allServed && !isBumped ? 'ring-2 ring-[#ef4444]/50' : ''}
      `}
      style={{ transition: 'all 0.2s ease, opacity 0.5s ease, transform 0.5s ease' }}
    >
      {/* ── Card Header: 72px table badge ── */}
      <div className="px-4 py-3 flex items-center justify-between bg-[#0a0a0a]">
        <div className="flex items-center gap-4">
          {/* Table Number Badge */}
          <div className={`
            w-16 h-16 rounded-2xl flex items-center justify-center font-black shrink-0
            ${tableBadgeBg} ${tableBadgeText}
            ${allPretOrServed && !allServed && !isBumped ? 'animate-pulse' : ''}
          `} style={{ fontSize: '32px', lineHeight: 1 }}>
            {order.tableNumber}
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-[#71717a] font-mono text-lg font-bold">{formatOrderNumber(order.orderNumber)}</span>
              <span className="text-2xl font-black text-white">T{order.tableNumber}</span>
              {order.priority !== 'normal' && !allServed && !isBumped && (
                <span className={`px-2.5 py-1 rounded-lg ${prio.bg} ${prio.text} text-base font-black uppercase tracking-wider ${order.priority === 'rush' ? 'animate-pulse' : ''}`}>
                  {order.priority === 'vip' && <Star className="w-4 h-4 inline mr-0.5" />}{prio.label}
                </span>
              )}
              {isOnHold && (
                <span className="px-2.5 py-1 rounded-lg bg-[#f59e0b]/20 text-[#f59e0b] text-base font-black uppercase">
                  <PauseCircle className="w-4 h-4 inline mr-0.5" />HOLD
                </span>
              )}
              {order.source === 'service-tracker' && (
                <span className="px-2 py-0.5 rounded-md bg-[#1d4ed8]/30 text-[#60a5fa] text-xs font-bold flex items-center gap-1">
                  <Users className="w-3 h-3 flex-shrink-0" />SALLE
                </span>
              )}
            </div>
            <div className="flex items-center gap-3 mt-0.5">
              <span className="text-lg text-[#a1a1aa]">
                <Users className="w-4 h-4 inline mr-1" />{order.serverName}
              </span>
              <span className="text-lg font-mono font-bold" style={{ color: getWaitColor(elapsed) }}>
                <Clock className="w-4 h-4 inline mr-1" />{formatElapsed(elapsed)}
              </span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="text-[#71717a] text-lg font-mono">
            {order.dishes.filter(d => d.status === 'pret' || d.status === 'servi').length}/{order.dishes.length}
          </span>
          {/* Secondary actions: hidden by default, visible on card hover */}
          <div className="hidden group-hover:flex items-center gap-1.5">
            {!allServed && !isBumped && onEditOrder && (
              <button onClick={() => onEditOrder(order)} title="Modifier"
                className="p-2 rounded-lg bg-[#1a1a1a] hover:bg-[#14b8a6]/10 text-[#71717a] hover:text-[#14b8a6] kds-transition min-w-[48px] min-h-[48px] flex items-center justify-center">
                <Edit3 className="w-5 h-5" />
              </button>
            )}
            {!allServed && !isBumped && onSplitOrder && order.dishes.length > 1 && (
              <button onClick={() => onSplitOrder(order)} title="Scinder"
                className="p-2 rounded-lg bg-[#1a1a1a] hover:bg-[#a78bfa]/10 text-[#71717a] hover:text-[#a78bfa] kds-transition min-w-[48px] min-h-[48px] flex items-center justify-center">
                <Scissors className="w-5 h-5" />
              </button>
            )}
            <button onClick={() => onPrint(order)} title="Imprimer"
              className="p-2 rounded-lg bg-[#1a1a1a] hover:bg-[#262626] text-[#71717a] hover:text-white kds-transition min-w-[48px] min-h-[48px] flex items-center justify-center">
              <Printer className="w-5 h-5" />
            </button>
            {!allServed && !isBumped && onDeleteOrder && (
              <button onClick={() => { if (confirm('Supprimer cette commande ?')) onDeleteOrder(order.id); }} title="Supprimer"
                className="p-2 rounded-lg bg-[#1a1a1a] hover:bg-[#ef4444]/10 text-[#71717a] hover:text-[#ef4444] kds-transition min-w-[48px] min-h-[48px] flex items-center justify-center">
                <Trash2 className="w-5 h-5" />
              </button>
            )}
          </div>
          {(allServed || isBumped) && (
            <button onClick={() => onRemoveOrder(order.id)}
              className="p-2 rounded-lg bg-[#1a1a1a] hover:bg-[#ef4444]/10 text-[#525252] hover:text-[#ef4444] kds-transition min-w-[48px] min-h-[48px] flex items-center justify-center">
              <Trash2 className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>

      {/* ── Allergen Banner ── */}
      {!allServed && !isBumped && <AllergenBanner notes={order.notes} />}

      {/* ── Notes ── */}
      {order.notes && !allServed && !isBumped && allergens.length === 0 && (
        <div className="px-5 py-2 bg-[#ef4444]/8 border-t border-[#ef4444]/20">
          <span className="text-[#ef4444] text-lg font-bold">
            <AlertTriangle className="w-5 h-5 inline mr-1" />{order.notes}
          </span>
        </div>
      )}
      {order.notes && !allServed && !isBumped && allergens.length > 0 && (
        <div className="px-5 py-2 bg-[#ef4444]/8 border-t border-[#ef4444]/20">
          <span className="text-[#ef4444] text-lg font-bold">
            <AlertTriangle className="w-5 h-5 inline mr-1" />{order.notes}
          </span>
        </div>
      )}

      {/* ── Prep Time Estimator ── */}
      {!allServed && !allPretOrServed && !isBumped && !isOnHold && (
        <PrepTimeEstimator order={order} now={now} />
      )}

      {/* ── Hold Banner ── */}
      {isOnHold && (
        <div className="px-5 py-2 bg-[#f59e0b]/10 border-t border-[#f59e0b]/30 flex items-center justify-between">
          <span className="text-[#f59e0b] text-lg font-bold"><PauseCircle className="w-5 h-5 inline mr-1" />Commande en pause</span>
          <button onClick={() => onHold(order.id)}
            className="px-4 py-2 rounded-lg bg-[#f59e0b]/20 hover:bg-[#f59e0b]/30 text-[#f59e0b] text-base font-bold kds-transition min-h-[44px]">
            Reprendre
          </button>
        </div>
      )}

      {/* ── Dishes ── */}
      {!isBumped && (
        <div className="divide-y divide-[#1a1a1a]">
          {order.dishes.map(dish => {
            const course = dish.course || detectCourse(dish);
            const courseColor = getCourseColor(course);
            const nextStatus: DishStatus | null =
              dish.status === 'attente' ? 'preparation' :
              dish.status === 'preparation' ? 'pret' :
              dish.status === 'pret' ? 'servi' : null;
            const isDone = dish.status === 'servi';

            return (
              <div key={dish.id}
                className={`px-4 py-3 kds-transition ${isDone ? 'bg-[#0a0a0a]/50 kds-dish-done' : 'bg-black hover:bg-[#0a0a0a]'}`}>
                <div className="flex items-center gap-3">
                  {/* Status cycle button */}
                  <button
                    onClick={() => nextStatus && !isOnHold && onDishStatusChange(order.id, dish.id)}
                    disabled={!nextStatus || isOnHold}
                    className={`min-w-[64px] min-h-[64px] rounded-xl flex items-center justify-center kds-transition
                      ${dish.status === 'attente' ? 'bg-[#27272a] hover:bg-[#78350f]/40 text-[#a1a1aa] hover:text-[#fbbf24] active:scale-95' : ''}
                      ${dish.status === 'preparation' ? 'bg-[#78350f]/50 hover:bg-[#064e3b]/50 text-[#fbbf24] hover:text-[#34d399] active:scale-95' : ''}
                      ${dish.status === 'pret' ? 'bg-[#064e3b]/50 hover:bg-[#27272a] text-[#34d399] hover:text-[#a1a1aa] active:scale-95' : ''}
                      ${dish.status === 'servi' ? 'bg-[#0a0a0a] text-[#333333] cursor-default' : ''}
                      ${isOnHold ? 'opacity-50 cursor-not-allowed' : ''}
                    `}>
                    {dish.status === 'attente' && <Clock className="w-6 h-6" />}
                    {dish.status === 'preparation' && <Flame className="w-6 h-6" />}
                    {dish.status === 'pret' && <CheckCircle2 className="w-6 h-6" />}
                    {dish.status === 'servi' && <UtensilsCrossed className="w-6 h-6" />}
                  </button>

                  <div className="flex-1 min-w-0">
                    {/* Dish name - lg bold, 2-line clamp */}
                    <div className={`text-lg font-bold line-clamp-2 ${isDone ? 'text-[#404040] line-through' : 'text-white'}`}>
                      {dish.quantity > 1 && <span className="text-[#fbbf24] mr-1">x{dish.quantity}</span>}
                      {dish.recipeName}
                    </div>
                    <div className="flex items-center gap-2 mt-0.5">
                      {/* Course color badge */}
                      <span className={`text-xs px-2 py-0.5 rounded-md font-bold ${courseColor.bg} ${courseColor.text}`}>
                        {courseColor.label}
                      </span>
                      <span className="text-sm font-medium" style={{
                        color: dish.status === 'attente' ? '#a1a1aa' :
                               dish.status === 'preparation' ? '#fbbf24' :
                               dish.status === 'pret' ? '#34d399' : '#525252'
                      }}>
                        {dish.status === 'attente' ? 'En attente' :
                         dish.status === 'preparation' ? 'En preparation' :
                         dish.status === 'pret' ? 'Pret' : 'Servi'}
                      </span>
                    </div>
                    {/* Progress bar for dishes in preparation */}
                    <DishProgressBar dish={dish} now={now} />
                  </div>

                  <DishTimer dish={dish} now={now} />

                  {dish.recipeId && !isDone && (
                    <button onClick={() => dish.recipeId && onDishView(dish.recipeId)}
                      className="min-w-[56px] min-h-[56px] rounded-lg bg-[#1a1a1a] hover:bg-[#262626] text-[#71717a] hover:text-[#14b8a6] flex items-center justify-center kds-transition">
                      <Eye className="w-5 h-5" />
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ── Bumped state ── */}
      {isBumped && (
        <div className="px-5 py-4 bg-[#064e3b]/20 border-t border-[#064e3b]/30 text-center">
          <CheckCircle2 className="w-8 h-8 text-[#34d399] mx-auto mb-1" />
          <span className="text-[#34d399] text-xl font-bold">BUMPED</span>
        </div>
      )}

      {/* ── Action Buttons: BUMP / HOLD ── */}
      {!allServed && !isBumped && (
        <div className="px-4 py-3 bg-[#0a0a0a] border-t border-[#1a1a1a] flex flex-col gap-2">
          {/* BUMP button - full width, tall, neon glow */}
          <button onClick={() => onBump(order.id)}
            aria-label="Marquer comme pret"
            className="w-full py-4 rounded-xl bg-[#059669] hover:bg-[#10b981] active:scale-[0.97] text-white text-lg font-black uppercase tracking-wider flex items-center justify-center gap-2 kds-transition"
            style={{ boxShadow: '0 0 20px rgba(16, 185, 129, 0.4), 0 0 40px rgba(16, 185, 129, 0.15)' }}>
            <ArrowDown className="w-7 h-7" />
            BUMP
          </button>
          {/* HOLD button */}
          <button onClick={() => onHold(order.id)}
            aria-label={isOnHold ? 'Reprendre la commande' : 'Mettre la commande en pause'}
            className={`w-full min-h-[48px] rounded-xl kds-transition flex items-center justify-center gap-2
              ${isOnHold ? 'bg-[#f59e0b]/20 text-[#f59e0b] hover:bg-[#f59e0b]/30' : 'bg-[#1a1a1a] text-[#71717a] hover:bg-[#262626] hover:text-[#f59e0b]'}`}
            title={isOnHold ? 'Reprendre' : 'Mettre en pause'}>
            {isOnHold ? <Play className="w-5 h-5" /> : <PauseCircle className="w-5 h-5" />}
            <span className="text-sm font-bold">{isOnHold ? 'Reprendre' : 'Pause'}</span>
          </button>
        </div>
      )}
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════
// ██  COLUMN HEADER  ██████████████████████████████████████████████████████
// ══════════════════════════════════════════════════════════════════════════
function ColumnHeader({ title, count, color, icon }: { title: string; count: number; color: string; icon: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between px-5 py-4 mb-2">
      <div className="flex items-center gap-3">
        <div className="w-5 h-5 rounded-full" style={{ backgroundColor: color }} />
        {icon}
        <span className="text-lg font-black text-white uppercase tracking-wider">{title}</span>
      </div>
      <span className="text-4xl font-black font-mono" style={{ color }}>{count}</span>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════
// ██  RUSH HOUR BANNER  ██████████████████████████████████████████████████
// ══════════════════════════════════════════════════════════════════════════
function RushHourBanner() {
  return (
    <div className="px-4 py-3 flex items-center justify-center gap-3 shrink-0"
      style={{ animation: 'kds-rush-pulse 2s ease-in-out infinite' }}>
      <Zap className="w-7 h-7 text-white animate-bounce" />
      <span className="text-white text-2xl font-black uppercase tracking-[0.2em]">RUSH HOUR</span>
      <Zap className="w-7 h-7 text-white animate-bounce" />
      <span className="text-white/80 text-lg font-bold ml-2">Prioritisez les commandes urgentes!</span>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════
// ██  PERFORMANCE STATS MODAL  ████████████████████████████████████████████
// ══════════════════════════════════════════════════════════════════════════
function PerformanceStatsModal({ stats, orders, onClose }: { stats: DailyStats; orders: Order[]; onClose: () => void }) {
  const categoryTimes = useMemo(() => {
    const catMap: Record<string, { total: number; count: number }> = {};
    for (const order of orders) {
      for (const dish of order.dishes) {
        if (dish.startedAt && dish.completedAt) {
          const cat = dish.category || 'Autre';
          if (!catMap[cat]) catMap[cat] = { total: 0, count: 0 };
          catMap[cat].total += (dish.completedAt - dish.startedAt) / 1000;
          catMap[cat].count += 1;
        }
      }
    }
    return Object.entries(catMap).map(([cat, data]) => ({
      category: cat, avgSeconds: Math.round(data.total / data.count), count: data.count,
    })).sort((a, b) => b.avgSeconds - a.avgSeconds);
  }, [orders]);

  // Average prep time by dish NAME (not category)
  const dishNameTimes = useMemo(() => {
    const nameMap: Record<string, { total: number; count: number }> = {};
    for (const order of orders) {
      for (const dish of order.dishes) {
        if (dish.startedAt && dish.completedAt) {
          const name = dish.recipeName;
          if (!nameMap[name]) nameMap[name] = { total: 0, count: 0 };
          nameMap[name].total += (dish.completedAt - dish.startedAt) / 1000;
          nameMap[name].count += 1;
        }
      }
    }
    return Object.entries(nameMap)
      .filter(([, data]) => data.count >= 1)
      .map(([name, data]) => ({ name, avgSeconds: Math.round(data.total / data.count), count: data.count }))
      .sort((a, b) => b.avgSeconds - a.avgSeconds)
      .slice(0, 10);
  }, [orders]);

  const hourlyData = useMemo(() => {
    const hours: Record<number, number> = {};
    for (let h = 0; h < 24; h++) hours[h] = 0;
    if (stats.hourlyOrders) {
      for (const [h, count] of Object.entries(stats.hourlyOrders)) hours[Number(h)] = count;
    }
    for (const order of orders) {
      const h = new Date(order.createdAt).getHours();
      hours[h] = (hours[h] || 0) + 1;
    }
    const maxCount = Math.max(...Object.values(hours), 1);
    return { hours, maxCount };
  }, [stats, orders]);

  const fastSlow = useMemo(() => {
    let fastest: { name: string; seconds: number } | null = null;
    let slowest: { name: string; seconds: number } | null = null;
    for (const order of orders) {
      for (const dish of order.dishes) {
        if (dish.startedAt && dish.completedAt) {
          const secs = (dish.completedAt - dish.startedAt) / 1000;
          if (!fastest || secs < fastest.seconds) fastest = { name: dish.recipeName, seconds: secs };
          if (!slowest || secs > slowest.seconds) slowest = { name: dish.recipeName, seconds: secs };
        }
      }
    }
    return { fastest, slowest };
  }, [orders]);

  const avgTime = stats.totalPrepTimes.length > 0
    ? Math.round(stats.totalPrepTimes.reduce((a, b) => a + b, 0) / stats.totalPrepTimes.length) : 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-sm p-4" onClick={onClose}>
      <div className="bg-[#0a0a0a] border-2 border-[#333333] rounded-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto p-6" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <BarChart3 className="w-8 h-8 text-[#14b8a6]" />
            <h2 className="text-3xl font-bold text-white">Performance du jour</h2>
          </div>
          <button onClick={onClose} className="p-3 rounded-xl bg-[#1a1a1a] hover:bg-[#262626] text-[#a1a1aa] hover:text-white kds-transition min-w-[64px] min-h-[64px] flex items-center justify-center">
            <X className="w-7 h-7" />
          </button>
        </div>

        {/* Key metrics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
          <div className="bg-[#1a1a1a] rounded-xl p-4 text-center">
            <div className="text-4xl font-black text-[#22c55e] font-mono">{stats.platsServis}</div>
            <div className="text-base text-[#a1a1aa] mt-1">Plats servis</div>
          </div>
          <div className="bg-[#1a1a1a] rounded-xl p-4 text-center">
            <div className="text-4xl font-black text-[#14b8a6] font-mono">{formatElapsed(avgTime)}</div>
            <div className="text-base text-[#a1a1aa] mt-1">Temps moyen</div>
          </div>
          <div className="bg-[#1a1a1a] rounded-xl p-4 text-center">
            <div className="text-4xl font-black text-[#fbbf24] font-mono">{orders.filter(o => !o.dishes.every(d => d.status === 'servi') && !o.bumpedAt).length}</div>
            <div className="text-base text-[#a1a1aa] mt-1">Actives</div>
          </div>
          <div className="bg-[#1a1a1a] rounded-xl p-4 text-center">
            <div className="text-4xl font-black text-[#a78bfa] font-mono">{stats.revenueToday > 0 ? `${stats.revenueToday.toFixed(0)}` : '--'}</div>
            <div className="text-base text-[#a1a1aa] mt-1">Revenue est. (EUR)</div>
          </div>
        </div>

        {/* Peak hours */}
        <div className="mb-8">
          <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-[#f97316]" />Heures de pointe
          </h3>
          <div className="bg-[#1a1a1a] rounded-xl p-4">
            <div className="flex items-end gap-1 h-32">
              {Array.from({ length: 24 }, (_, h) => {
                const count = hourlyData.hours[h] || 0;
                const height = count > 0 ? Math.max(8, (count / hourlyData.maxCount) * 100) : 4;
                const isNow = new Date().getHours() === h;
                const isPeak = count >= RUSH_THRESHOLD;
                return (
                  <div key={h} className="flex-1 flex flex-col items-center gap-1" title={`${h}h: ${count} commandes`}>
                    <div className={`w-full rounded-t kds-transition ${isPeak ? 'bg-[#ef4444]' : isNow ? 'bg-[#14b8a6]' : count > 0 ? 'bg-[#404040]' : 'bg-[#262626]'}`}
                      style={{ height: `${height}%`, minHeight: '4px' }} />
                    {(h % 3 === 0) && <span className="text-[10px] text-[#525252]">{h}h</span>}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Prep time by category */}
        {categoryTimes.length > 0 && (
          <div className="mb-8">
            <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              <Clock className="w-5 h-5 text-[#fbbf24]" />Temps moyen par categorie
            </h3>
            <div className="space-y-2">
              {categoryTimes.map(ct => (
                <div key={ct.category} className="flex items-center gap-3 bg-[#1a1a1a] rounded-xl px-4 py-3">
                  <span className="text-lg text-white font-semibold flex-1 capitalize">{ct.category}</span>
                  <span className="text-sm text-[#71717a]">{ct.count} plats</span>
                  <div className="w-32 h-3 bg-[#262626] rounded-full overflow-hidden">
                    <div className="h-full rounded-full bg-[#fbbf24] kds-transition"
                      style={{ width: `${Math.min(100, (ct.avgSeconds / (categoryTimes[0]?.avgSeconds || 1)) * 100)}%` }} />
                  </div>
                  <span className="text-lg font-mono font-bold text-[#fbbf24] w-20 text-right">{formatElapsed(ct.avgSeconds)}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Average prep time per dish type */}
        {dishNameTimes.length > 0 && (
          <div className="mb-8">
            <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              <ChefHat className="w-5 h-5 text-[#14b8a6]" />Temps moyen par plat
            </h3>
            <div className="space-y-2">
              {dishNameTimes.map(dt => (
                <div key={dt.name} className="flex items-center gap-3 bg-[#1a1a1a] rounded-xl px-4 py-3">
                  <span className="text-lg text-white font-semibold flex-1 truncate">{dt.name}</span>
                  <span className="text-sm text-[#71717a]">x{dt.count}</span>
                  <span className="text-lg font-mono font-bold text-[#14b8a6] w-20 text-right">{formatElapsed(dt.avgSeconds)}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Fastest / Slowest */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {fastSlow.fastest && (
            <div className="bg-[#064e3b]/30 border border-[#064e3b]/50 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-2"><Award className="w-5 h-5 text-[#34d399]" /><span className="text-lg font-bold text-[#34d399]">Plus rapide</span></div>
              <div className="text-xl text-white font-semibold truncate">{fastSlow.fastest.name}</div>
              <div className="text-2xl font-mono font-black text-[#34d399]">{formatElapsed(Math.round(fastSlow.fastest.seconds))}</div>
            </div>
          )}
          {fastSlow.slowest && (
            <div className="bg-[#7f1d1d]/30 border border-[#7f1d1d]/50 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-2"><AlertTriangle className="w-5 h-5 text-[#f97316]" /><span className="text-lg font-bold text-[#f97316]">Plus lent</span></div>
              <div className="text-xl text-white font-semibold truncate">{fastSlow.slowest.name}</div>
              <div className="text-2xl font-mono font-black text-[#f97316]">{formatElapsed(Math.round(fastSlow.slowest.seconds))}</div>
            </div>
          )}
        </div>

        {(!fastSlow.fastest && !fastSlow.slowest) && (
          <div className="text-center text-[#525252] text-lg py-4">
            Aucune donnee de preparation encore. Les stats s'afficheront apres les premiers plats servis.
          </div>
        )}
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════
// ██  STATS BAR  ██████████████████████████████████████████████████████████
// ══════════════════════════════════════════════════════════════════════════
function StatsBar({ orders, stats, onOpenStats }: { orders: Order[]; stats: DailyStats; archivedCount?: number; onOpenStats: () => void }) {
  const enAttente = orders.reduce((sum, o) => sum + o.dishes.filter(d => d.status === 'attente').length, 0);
  const enPrep = orders.reduce((sum, o) => sum + o.dishes.filter(d => d.status === 'preparation').length, 0);
  const prets = orders.reduce((sum, o) => sum + o.dishes.filter(d => d.status === 'pret').length, 0);
  const avgTime = stats.totalPrepTimes.length > 0
    ? Math.round(stats.totalPrepTimes.reduce((a, b) => a + b, 0) / stats.totalPrepTimes.length) : 0;

  return (
    <div className="bg-[#0a0a0a] border-t-2 border-[#262626] px-3 md:px-6 py-2 md:py-3 shrink-0 cursor-pointer hover:bg-[#111111] kds-transition"
      onClick={onOpenStats} title="Cliquer pour voir les stats detaillees">
      <div className="flex items-center justify-around gap-3 md:gap-6 max-w-full">
        <div className="flex items-center gap-1.5 md:gap-2 shrink-0">
          <div className="w-2.5 md:w-3 h-2.5 md:h-3 rounded-full bg-[#22c55e]" />
          <span className="text-[#a1a1aa] text-xs md:text-base">Servis</span>
          <span className="text-white text-lg md:text-2xl font-black font-mono">{stats.platsServis}</span>
        </div>
        <div className="flex items-center gap-1.5 md:gap-2 shrink-0">
          <div className="w-2.5 md:w-3 h-2.5 md:h-3 rounded-full bg-[#fbbf24]" />
          <span className="text-[#a1a1aa] text-xs md:text-base">Prep</span>
          <span className="text-[#fbbf24] text-lg md:text-2xl font-black font-mono">{enPrep}</span>
        </div>
        <div className="flex items-center gap-1.5 md:gap-2 shrink-0">
          <Clock className="w-4 md:w-5 h-4 md:h-5 text-[#71717a]" />
          <span className="text-[#a1a1aa] text-xs md:text-base hidden sm:inline">Tps moy</span>
          <span className="text-white text-lg md:text-2xl font-black font-mono">{formatElapsed(avgTime)}</span>
        </div>
        <div className="hidden md:flex items-center gap-2 shrink-0">
          <div className="w-3 h-3 rounded-full bg-[#71717a]" />
          <span className="text-[#a1a1aa] text-base">En attente</span>
          <span className="text-white text-2xl font-black font-mono">{enAttente}</span>
        </div>
        <div className="hidden md:flex items-center gap-2 shrink-0">
          <div className="w-3 h-3 rounded-full bg-[#34d399]" />
          <span className="text-[#a1a1aa] text-base">Prets</span>
          <span className="text-[#34d399] text-2xl font-black font-mono">{prets}</span>
        </div>
        <div className="flex items-center gap-1 shrink-0">
          <BarChart3 className="w-4 md:w-5 h-4 md:h-5 text-[#14b8a6]" /><span className="text-[#14b8a6] text-xs md:text-sm font-bold">STATS</span>
        </div>
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════
// ██  STANDALONE TIMER  ██████████████████████████████████████████████████
// ══════════════════════════════════════════════════════════════════════════
function StandaloneTimer({ onClose }: { onClose: () => void }) {
  const [seconds, setSeconds] = useState(0);
  const [targetMinutes, setTargetMinutes] = useState(0);
  const [running, setRunning] = useState(false);
  const [alarm, setAlarm] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (running && !alarm) {
      intervalRef.current = setInterval(() => {
        setSeconds(prev => {
          const next = prev + 1;
          if (targetMinutes > 0 && next >= targetMinutes * 60) { setAlarm(true); setRunning(false); }
          return next;
        });
      }, 1000);
    }
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [running, targetMinutes, alarm]);

  const reset = () => { setSeconds(0); setRunning(false); setAlarm(false); if (intervalRef.current) clearInterval(intervalRef.current); };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-sm p-4" onClick={onClose}>
      <div className={`bg-[#0a0a0a] border-2 rounded-2xl p-8 w-full max-w-md ${alarm ? 'border-[#ef4444] animate-pulse' : 'border-[#333333]'}`} onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <Timer className="w-8 h-8 text-[#14b8a6]" /><span className="text-2xl font-bold text-white">Timer Cuisine</span>
          </div>
          <button onClick={onClose} className="p-3 rounded-xl bg-[#1a1a1a] hover:bg-[#262626] text-[#a1a1aa] hover:text-white min-w-[64px] min-h-[64px] flex items-center justify-center">
            <X className="w-7 h-7" />
          </button>
        </div>
        <div className={`text-8xl font-mono font-black text-center py-6 ${alarm ? 'text-[#ef4444]' : 'text-white'}`}>{formatElapsed(seconds)}</div>
        {alarm && <div className="text-center text-[#ef4444] font-black text-3xl mb-6 animate-bounce">TEMPS ECOULE !</div>}
        <div className="flex flex-wrap gap-2 mb-6 justify-center">
          {[1, 3, 5, 10, 15, 20].map(m => (
            <button key={m} onClick={() => { setTargetMinutes(m); reset(); }}
              className={`min-w-[64px] min-h-[64px] rounded-xl text-xl font-bold kds-transition ${targetMinutes === m ? 'bg-[#0d9488] text-white' : 'bg-[#1a1a1a] text-[#a1a1aa] hover:bg-[#262626]'}`}>
              {m}m
            </button>
          ))}
        </div>
        <div className="flex gap-3 justify-center">
          <button onClick={() => { setAlarm(false); setRunning(r => !r); }}
            className="flex items-center gap-2 px-8 min-h-[64px] rounded-xl text-xl font-bold bg-[#0d9488] hover:bg-[#14b8a6] text-white kds-transition">
            {running ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6" />}{running ? 'Pause' : 'Lancer'}
          </button>
          <button onClick={reset} className="flex items-center gap-2 px-6 min-h-[64px] rounded-xl text-xl font-bold bg-[#1a1a1a] hover:bg-[#262626] text-[#a1a1aa] kds-transition">
            <RotateCcw className="w-6 h-6" />
          </button>
        </div>
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════
// ██  PRINT KITCHEN TICKET  ██████████████████████████████████████████████
// ══════════════════════════════════════════════════════════════════════════
function printKitchenTicket(order: Order) {
  const win = window.open('', '_blank', 'width=300,height=600');
  if (!win) return;
  const time = new Date(order.createdAt).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  const date = new Date(order.createdAt).toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit', year: 'numeric' });
  const prio = order.priority !== 'normal' ? `*** ${order.priority.toUpperCase()} ***` : '';
  const allergens = detectAllergens(order.notes);

  const separator = '<div class="sep">================================</div>';
  const thinSep = '<div class="sep">--------------------------------</div>';

  const dishLines = order.dishes.map(d => {
    const qty = d.quantity > 1 ? `${d.quantity}x ` : '1x ';
    return `<div class="dish"><span class="dish-qty">${qty}</span><span class="dish-name">${d.recipeName.toUpperCase()}</span></div>`;
  }).join('');

  const allergenLine = allergens.length > 0
    ? `${thinSep}<div class="allergen">!! ALLERGENES: ${allergens.join(', ')} !!</div>`
    : '';

  win.document.write(`<!DOCTYPE html><html><head><title>Ticket Cuisine</title>
<style>
  *{margin:0;padding:0;box-sizing:border-box}
  body{font-family:'Courier New',Courier,monospace;width:280px;margin:0 auto;padding:8px;color:#000;background:#fff;font-size:14px;line-height:1.4}
  .center{text-align:center}
  .sep{text-align:center;font-size:12px;margin:4px 0;letter-spacing:-0.5px}
  .header{text-align:center;font-size:12px;font-weight:bold;text-transform:uppercase;letter-spacing:1px;margin-bottom:2px}
  .table-num{text-align:center;font-size:36px;font-weight:900;margin:6px 0;letter-spacing:2px}
  .order-num{text-align:center;font-size:14px;font-weight:bold;margin:2px 0}
  .prio{text-align:center;font-size:18px;font-weight:bold;margin:4px 0;padding:4px;border:2px solid #000}
  .meta{font-size:12px;margin:2px 0}
  .meta-row{display:flex;justify-content:space-between;font-size:12px}
  .dish{font-size:16px;font-weight:bold;padding:4px 0;border-bottom:1px dotted #ccc}
  .dish:last-child{border-bottom:none}
  .dish-qty{font-weight:normal;min-width:30px;display:inline-block}
  .dish-name{font-weight:bold}
  .notes{font-size:14px;font-weight:bold;background:#000;color:#fff;padding:6px 8px;margin:6px 0;text-align:center}
  .allergen{font-size:14px;font-weight:bold;background:#000;color:#fff;padding:6px 8px;margin:4px 0;text-align:center;letter-spacing:0.5px}
  .footer{text-align:center;font-size:10px;margin-top:6px;color:#999}
  @media print{body{width:100%;padding:0}}
</style></head><body>
<div class="header">** CUISINE **</div>
${separator}
<div class="table-num">TABLE ${order.tableNumber}</div>
<div class="order-num">${formatOrderNumber(order.orderNumber)}</div>
${separator}
<div class="meta-row"><span>${date}</span><span>${time}</span></div>
<div class="meta">Serveur: ${order.serverName}</div>
${prio ? `<div class="prio">${prio}</div>` : ''}
${separator}
${dishLines}
${allergenLine}
${order.notes ? `${thinSep}<div class="notes">!! ${order.notes.toUpperCase()} !!</div>` : ''}
${separator}
<div class="footer">RestauMargin KDS</div>
<script>window.onload=function(){setTimeout(function(){window.print()},200)}</script>
</body></html>`);
  win.document.close();
}

// ══════════════════════════════════════════════════════════════════════════
// ██  STATION VIEW TABS  ██████████████████████████████████████████████████
// ══════════════════════════════════════════════════════════════════════════
function StationViewTabs({ current, onChange }: { current: StationView; onChange: (v: StationView) => void }) {
  const tabs: { key: StationView; label: string; icon: React.ReactNode; color: string }[] = [
    { key: 'complete', label: 'Vue complete', icon: <SplitSquareHorizontal className="w-5 h-5" />, color: '#14b8a6' },
    { key: 'chaud', label: 'Chaud', icon: <Flame className="w-5 h-5" />, color: '#f97316' },
    { key: 'froid', label: 'Froid', icon: <UtensilsCrossed className="w-5 h-5" />, color: '#60a5fa' },
    { key: 'passe', label: 'Passe', icon: <CheckCircle2 className="w-5 h-5" />, color: '#34d399' },
  ];

  return (
    <div className="flex items-center gap-1.5 bg-[#0a0a0a] rounded-xl p-1">
      {tabs.map(tab => (
        <button key={tab.key} onClick={() => onChange(tab.key)}
          className={`flex items-center gap-1.5 px-4 min-h-[48px] rounded-lg text-base font-bold kds-transition
            ${current === tab.key ? 'text-white' : 'text-[#525252] hover:text-[#a1a1aa]'}`}
          style={current === tab.key ? { backgroundColor: `${tab.color}22`, color: tab.color } : {}}>
          {tab.icon}
          <span className="hidden md:inline">{tab.label}</span>
        </button>
      ))}
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════
// ██  TABLE PANEL  ████████████████████████████████████████████████████████
// ══════════════════════════════════════════════════════════════════════════
function TablePanel({
  tableConfig, orders, now, onFilterTable, activeTableFilter, onFreeTable, onAddTable, onRemoveTable,
}: {
  tableConfig: TableConfig; orders: Order[]; now: number;
  onFilterTable: (t: number | null) => void; activeTableFilter: number | null;
  onFreeTable: (t: number) => void; onAddTable: () => void; onRemoveTable: () => void;
}) {
  const sections = useMemo(() => {
    const salle = tableConfig.tables.filter(t => t.section === 'salle');
    const terrasse = tableConfig.tables.filter(t => t.section === 'terrasse');
    return { salle, terrasse };
  }, [tableConfig]);

  const renderTable = (table: TableInfo) => {
    const { status, orderCount, firstOrderTime } = getTableStatus(table.number, orders);
    const elapsed = firstOrderTime ? Math.floor((now - firstOrderTime) / 1000) : 0;
    const isActive = activeTableFilter === table.number;

    return (
      <button key={table.number}
        onClick={() => onFilterTable(isActive ? null : table.number)}
        className={`relative rounded-xl p-3 min-h-[90px] flex flex-col items-center justify-center gap-1 kds-transition border-2
          ${isActive ? 'ring-2 ring-[#14b8a6] border-[#14b8a6]' :
            status === 'libre' ? 'border-[#064e3b]/50 bg-[#064e3b]/10 hover:bg-[#064e3b]/20' :
            status === 'occupee' ? 'border-[#f59e0b]/50 bg-[#78350f]/20 hover:bg-[#78350f]/30' :
            'border-[#ef4444]/50 bg-[#7f1d1d]/20 hover:bg-[#7f1d1d]/30'}`}>
        <span className={`text-3xl font-black ${
          status === 'libre' ? 'text-[#34d399]' :
          status === 'occupee' ? 'text-[#fbbf24]' : 'text-[#ef4444]'
        }`}>{table.number}</span>
        <span className={`text-xs font-bold uppercase ${
          status === 'libre' ? 'text-[#34d399]/70' :
          status === 'occupee' ? 'text-[#fbbf24]/70' : 'text-[#ef4444]/70'
        }`}>{status === 'libre' ? 'Libre' : status === 'occupee' ? 'Occupee' : 'Attente'}</span>
        {orderCount > 0 && (
          <span className="text-[10px] text-[#a1a1aa]">{orderCount} cmd - {formatElapsed(elapsed)}</span>
        )}
        {status !== 'libre' && (
          <button
            onClick={e => { e.stopPropagation(); onFreeTable(table.number); }}
            className="absolute top-1 right-1 p-1 rounded-md bg-[#ef4444]/20 hover:bg-[#ef4444]/40 text-[#ef4444] kds-transition"
            title="Liberer la table">
            <XCircle className="w-3.5 h-3.5" />
          </button>
        )}
      </button>
    );
  };

  const occupiedCount = tableConfig.tables.filter(t => getTableStatus(t.number, orders).status !== 'libre').length;

  return (
    <div className="bg-[#0a0a0a] border-b-2 border-[#262626] px-4 py-3">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <LayoutGrid className="w-5 h-5 text-[#14b8a6]" />
          <span className="text-lg font-bold text-white">Tables</span>
          <span className="text-sm text-[#a1a1aa]">{occupiedCount}/{tableConfig.tableCount} occupees</span>
        </div>
        <div className="flex items-center gap-2">
          {activeTableFilter && (
            <button onClick={() => onFilterTable(null)}
              className="px-3 py-1.5 rounded-lg bg-[#14b8a6]/20 text-[#14b8a6] text-sm font-bold kds-transition hover:bg-[#14b8a6]/30">
              <X className="w-4 h-4 inline mr-1" />Filtre T{activeTableFilter}
            </button>
          )}
          <button onClick={onAddTable}
            className="px-3 py-1.5 rounded-lg bg-[#1a1a1a] hover:bg-[#262626] text-[#a1a1aa] text-sm font-bold kds-transition">
            <Plus className="w-4 h-4 inline mr-1" />Table
          </button>
          <button onClick={onRemoveTable} disabled={tableConfig.tableCount <= 1}
            className="px-3 py-1.5 rounded-lg bg-[#1a1a1a] hover:bg-[#ef4444]/10 text-[#a1a1aa] hover:text-[#ef4444] text-sm font-bold kds-transition disabled:opacity-30 disabled:cursor-not-allowed">
            <Trash2 className="w-4 h-4 inline mr-1" />Table
          </button>
        </div>
      </div>
      {sections.salle.length > 0 && (
        <div className="mb-2">
          <span className="text-xs text-[#525252] font-bold uppercase tracking-wider mb-1 block"><MapPin className="w-3 h-3 inline mr-1" />Salle</span>
          <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-10 gap-2">
            {sections.salle.map(renderTable)}
          </div>
        </div>
      )}
      {sections.terrasse.length > 0 && (
        <div>
          <span className="text-xs text-[#525252] font-bold uppercase tracking-wider mb-1 block"><MapPin className="w-3 h-3 inline mr-1" />Terrasse</span>
          <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-10 gap-2">
            {sections.terrasse.map(renderTable)}
          </div>
        </div>
      )}
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════
// ██  EDIT ORDER MODAL  ██████████████████████████████████████████████████
// ══════════════════════════════════════════════════════════════════════════
function EditOrderModal({ order, onSave, onClose }: {
  order: Order;
  onSave: (orderId: string, updates: { tableNumber?: number; notes?: string; priority?: OrderPriority }) => void;
  onClose: () => void;
}) {
  const [tableNumber, setTableNumber] = useState(order.tableNumber);
  const [notes, setNotes] = useState(order.notes);
  const [priority, setPriority] = useState<OrderPriority>(order.priority);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-sm p-4" onClick={onClose}>
      <div className="bg-[#0a0a0a] border-2 border-[#333333] rounded-2xl w-full max-w-lg p-6" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-white">Modifier {formatOrderNumber(order.orderNumber)}</h2>
          <button onClick={onClose} className="p-3 rounded-xl bg-[#1a1a1a] hover:bg-[#262626] text-[#a1a1aa] hover:text-white kds-transition min-w-[52px] min-h-[52px] flex items-center justify-center">
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="text-base text-[#a1a1aa] mb-2 block">Table N&deg;</label>
            <div className="flex gap-2 flex-wrap">
              {Array.from({ length: 20 }, (_, i) => i + 1).map(n => (
                <button key={n} onClick={() => setTableNumber(n)}
                  className={`min-w-[52px] min-h-[52px] rounded-xl text-xl font-bold kds-transition
                    ${tableNumber === n ? 'bg-[#0d9488] text-white' : 'bg-[#1a1a1a] text-[#a1a1aa] hover:bg-[#262626]'}`}>
                  {n}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-base text-[#a1a1aa] mb-2 block">Priorite</label>
            <div className="flex gap-2">
              {(['normal', 'rush', 'vip'] as OrderPriority[]).map(p => (
                <button key={p} onClick={() => setPriority(p)}
                  className={`flex-1 min-h-[52px] rounded-xl text-lg font-bold kds-transition uppercase
                    ${priority === p
                      ? p === 'vip' ? 'bg-[#7c3aed] text-white' : p === 'rush' ? 'bg-[#ef4444] text-white' : 'bg-[#404040] text-white'
                      : 'bg-[#1a1a1a] text-[#71717a] hover:bg-[#262626]'}`}>
                  {p === 'vip' && <Star className="w-4 h-4 inline mr-1" />}{p}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-base text-[#a1a1aa] mb-2 block">Notes / Allergies</label>
            <input value={notes} onChange={e => setNotes(e.target.value)} placeholder="Allergies, cuisson speciale..."
              className="w-full bg-[#1a1a1a] border border-[#333333] rounded-xl px-4 py-3 text-lg text-white placeholder-[#525252] focus:border-[#0d9488] focus:outline-none min-h-[52px]" />
          </div>
        </div>

        <button onClick={() => { onSave(order.id, { tableNumber, notes, priority }); onClose(); }}
          className="w-full mt-6 min-h-[60px] rounded-xl bg-[#0d9488] hover:bg-[#14b8a6] text-white text-xl font-bold kds-transition">
          Enregistrer
        </button>
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════
// ██  SPLIT ORDER MODAL  █████████████████████████████████████████████████
// ══════════════════════════════════════════════════════════════════════════
function SplitOrderModal({ order, onSplit, onClose }: {
  order: Order;
  onSplit: (orderId: string, dishIdsToMove: string[]) => void;
  onClose: () => void;
}) {
  const [selectedDishIds, setSelectedDishIds] = useState<Set<string>>(new Set());

  const toggleDish = (dishId: string) => {
    setSelectedDishIds(prev => {
      const next = new Set(prev);
      if (next.has(dishId)) next.delete(dishId);
      else next.add(dishId);
      return next;
    });
  };

  const canSplit = selectedDishIds.size > 0 && selectedDishIds.size < order.dishes.length;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-sm p-4" onClick={onClose}>
      <div className="bg-[#0a0a0a] border-2 border-[#333333] rounded-2xl w-full max-w-lg p-6" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-white">Scinder {formatOrderNumber(order.orderNumber)}</h2>
          <button onClick={onClose} className="p-3 rounded-xl bg-[#1a1a1a] hover:bg-[#262626] text-[#a1a1aa] hover:text-white kds-transition min-w-[52px] min-h-[52px] flex items-center justify-center">
            <X className="w-6 h-6" />
          </button>
        </div>

        <p className="text-[#a1a1aa] text-base mb-4">Selectionnez les plats a deplacer vers une nouvelle commande :</p>

        <div className="space-y-2 mb-6 max-h-[40vh] overflow-y-auto">
          {order.dishes.map(dish => (
            <button key={dish.id} onClick={() => toggleDish(dish.id)}
              className={`w-full flex items-center justify-between p-3 rounded-xl kds-transition border-2
                ${selectedDishIds.has(dish.id) ? 'border-[#14b8a6] bg-[#14b8a6]/10' : 'border-[#262626] bg-[#1a1a1a] hover:bg-[#262626]'}`}>
              <div className="flex items-center gap-3">
                <div className={`w-6 h-6 rounded-md border-2 flex items-center justify-center kds-transition
                  ${selectedDishIds.has(dish.id) ? 'border-[#14b8a6] bg-[#14b8a6]' : 'border-[#404040]'}`}>
                  {selectedDishIds.has(dish.id) && <CheckCircle2 className="w-4 h-4 text-white" />}
                </div>
                <span className="text-lg text-white font-semibold">
                  {dish.quantity > 1 && <span className="text-[#fbbf24] mr-1">x{dish.quantity}</span>}
                  {dish.recipeName}
                </span>
              </div>
              <span className={`text-sm px-2 py-0.5 rounded ${getCourseColor(dish.course || 'autre').bg} ${getCourseColor(dish.course || 'autre').text}`}>
                {getCourseColor(dish.course || 'autre').label}
              </span>
            </button>
          ))}
        </div>

        <div className="flex items-center gap-3 mb-4 text-sm">
          <div className="flex-1 bg-[#1a1a1a] rounded-lg p-2 text-center">
            <span className="text-[#a1a1aa]">Commande originale: </span>
            <span className="text-white font-bold">{order.dishes.length - selectedDishIds.size} plats</span>
          </div>
          <Scissors className="w-5 h-5 text-[#525252]" />
          <div className="flex-1 bg-[#1a1a1a] rounded-lg p-2 text-center">
            <span className="text-[#a1a1aa]">Nouvelle: </span>
            <span className="text-[#14b8a6] font-bold">{selectedDishIds.size} plats</span>
          </div>
        </div>

        <button onClick={() => { if (canSplit) { onSplit(order.id, Array.from(selectedDishIds)); onClose(); } }}
          disabled={!canSplit}
          className={`w-full min-h-[60px] rounded-xl text-xl font-bold kds-transition
            ${canSplit ? 'bg-[#0d9488] hover:bg-[#14b8a6] text-white' : 'bg-[#1a1a1a] text-[#525252] cursor-not-allowed'}`}>
          <Scissors className="w-5 h-5 inline mr-2" />Scinder la commande
        </button>
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════
// ██  TABLE CONFIG MODAL  ████████████████████████████████████████████████
// ══════════════════════════════════════════════════════════════════════════
function TableConfigModal({ config, onSave, onClose }: {
  config: TableConfig;
  onSave: (config: TableConfig) => void;
  onClose: () => void;
}) {
  const [tableCount, setTableCount] = useState(config.tableCount);
  const [tables, setTables] = useState<TableInfo[]>(config.tables);

  const updateCount = (count: number) => {
    const clamped = Math.max(1, Math.min(50, count));
    setTableCount(clamped);
    const newTables: TableInfo[] = [];
    for (let i = 1; i <= clamped; i++) {
      const existing = tables.find(t => t.number === i);
      newTables.push(existing || { number: i, section: i <= Math.ceil(clamped * 0.75) ? 'salle' : 'terrasse' });
    }
    setTables(newTables);
  };

  const toggleSection = (num: number) => {
    setTables(prev => prev.map(t => t.number === num ? { ...t, section: t.section === 'salle' ? 'terrasse' : 'salle' } : t));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-sm p-4" onClick={onClose}>
      <div className="bg-[#0a0a0a] border-2 border-[#333333] rounded-2xl w-full max-w-lg max-h-[85vh] overflow-y-auto p-6" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <Settings className="w-7 h-7 text-[#14b8a6]" />
            <h2 className="text-2xl font-bold text-white">Configuration Tables</h2>
          </div>
          <button onClick={onClose} className="p-3 rounded-xl bg-[#1a1a1a] hover:bg-[#262626] text-[#a1a1aa] hover:text-white kds-transition min-w-[52px] min-h-[52px] flex items-center justify-center">
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="mb-6">
          <label className="text-base text-[#a1a1aa] mb-2 block">Nombre de tables</label>
          <div className="flex items-center gap-3">
            <button onClick={() => updateCount(tableCount - 1)}
              className="min-w-[52px] min-h-[52px] rounded-xl bg-[#1a1a1a] hover:bg-[#262626] text-white text-2xl font-bold kds-transition">-</button>
            <span className="text-4xl font-black text-white font-mono w-20 text-center">{tableCount}</span>
            <button onClick={() => updateCount(tableCount + 1)}
              className="min-w-[52px] min-h-[52px] rounded-xl bg-[#1a1a1a] hover:bg-[#262626] text-white text-2xl font-bold kds-transition">+</button>
          </div>
          <div className="flex gap-2 mt-3">
            {[8, 10, 12, 15, 20].map(n => (
              <button key={n} onClick={() => updateCount(n)}
                className={`px-3 py-2 rounded-lg text-sm font-bold kds-transition
                  ${tableCount === n ? 'bg-[#0d9488] text-white' : 'bg-[#1a1a1a] text-[#71717a] hover:bg-[#262626]'}`}>
                {n}
              </button>
            ))}
          </div>
        </div>

        <div className="mb-6">
          <label className="text-base text-[#a1a1aa] mb-2 block">Disposition (cliquer pour changer Salle/Terrasse)</label>
          <div className="grid grid-cols-5 gap-2">
            {tables.map(t => (
              <button key={t.number} onClick={() => toggleSection(t.number)}
                className={`p-2 rounded-lg text-center kds-transition border
                  ${t.section === 'salle' ? 'border-[#14b8a6]/30 bg-[#14b8a6]/10 text-[#14b8a6]' : 'border-[#f97316]/30 bg-[#f97316]/10 text-[#f97316]'}`}>
                <span className="text-lg font-bold block">{t.number}</span>
                <span className="text-[10px] uppercase font-bold">{t.section === 'salle' ? 'Salle' : 'Terr.'}</span>
              </button>
            ))}
          </div>
        </div>

        <button onClick={() => { onSave({ tableCount, tables }); onClose(); }}
          className="w-full min-h-[60px] rounded-xl bg-[#0d9488] hover:bg-[#14b8a6] text-white text-xl font-bold kds-transition">
          Enregistrer
        </button>
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════
// ██  QUICK ACTIONS BAR  █████████████████████████████████████████████████
// ══════════════════════════════════════════════════════════════════════════
function QuickActionsBar({
  orders, tableConfig, onClearAll, onLoadDemo, onOpenTableConfig,
}: {
  orders: Order[];
  tableConfig: TableConfig;
  onClearAll: () => void;
  onLoadDemo: () => void;
  onOpenTableConfig: () => void;
}) {
  const [confirmClear, setConfirmClear] = useState(false);
  const [showSettingsMenu, setShowSettingsMenu] = useState(false);
  const activeOrders = orders.filter(o => !o.dishes.every(d => d.status === 'servi') && !o.bumpedAt).length;
  const occupiedTables = tableConfig.tables.filter(t => getTableStatus(t.number, orders).status !== 'libre').length;

  useEffect(() => {
    if (confirmClear) { const t = setTimeout(() => setConfirmClear(false), 3000); return () => clearTimeout(t); }
  }, [confirmClear]);

  return (
    <div className="bg-[#0a0a0a]/80 border-b border-[#262626] px-4 py-2 flex items-center gap-3 shrink-0 overflow-x-auto">
      {/* Table counter */}
      <div className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-[#1a1a1a] text-sm shrink-0">
        <LayoutGrid className="w-4 h-4 text-[#14b8a6]" />
        <span className="text-[#14b8a6] font-bold">{occupiedTables}/{tableConfig.tableCount}</span>
        <span className="text-[#71717a]">tables</span>
      </div>
      {/* Order counter */}
      <div className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-[#1a1a1a] text-sm shrink-0">
        <ChefHat className="w-4 h-4 text-[#fbbf24]" />
        <span className="text-[#fbbf24] font-bold">{activeOrders}</span>
        <span className="text-[#71717a]">actives</span>
      </div>
      {/* Settings gear with dropdown menu */}
      <div className="ml-auto relative shrink-0">
        <button onClick={() => setShowSettingsMenu(v => !v)}
          className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-bold kds-transition
            ${showSettingsMenu ? 'bg-[#262626] text-white' : 'bg-[#1a1a1a] text-[#71717a] hover:bg-[#262626] hover:text-white'}`}>
          <Settings className="w-4 h-4" />
        </button>
        {showSettingsMenu && (
          <>
            <div className="fixed inset-0 z-40" onClick={() => setShowSettingsMenu(false)} />
            <div className="absolute right-0 bottom-full mb-1 z-50 bg-[#1a1a1a] border border-[#333333] rounded-xl shadow-2xl shadow-black/50 py-2 min-w-[200px]">
              <button onClick={() => { onOpenTableConfig(); setShowSettingsMenu(false); }}
                className="w-full flex items-center gap-2 px-4 py-3 text-sm font-bold text-[#a1a1aa] hover:bg-[#262626] hover:text-white kds-transition">
                <Settings className="w-4 h-4" />Config tables
              </button>
              <button onClick={() => { onLoadDemo(); setShowSettingsMenu(false); }}
                className="w-full flex items-center gap-2 px-4 py-3 text-sm font-bold text-[#a1a1aa] hover:bg-[#78350f]/30 hover:text-[#fbbf24] kds-transition">
                <Flame className="w-4 h-4" />Charger demo
              </button>
              <div className="border-t border-[#333333] my-1" />
              <button onClick={() => { if (confirmClear) { onClearAll(); setConfirmClear(false); setShowSettingsMenu(false); } else setConfirmClear(true); }}
                className={`w-full flex items-center gap-2 px-4 py-3 text-sm font-bold kds-transition
                  ${confirmClear ? 'bg-[#ef4444] text-white animate-pulse' : 'text-[#71717a] hover:bg-[#ef4444]/10 hover:text-[#ef4444]'}`}>
                <Trash2 className="w-4 h-4" />{confirmClear ? 'Confirmer suppression ?' : 'Vider tout'}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════
// ██  MAIN PAGE  ██████████████████████████████████████████████████████████
// ══════════════════════════════════════════════════════════════════════════
export default function KitchenMode() {
  const navigate = useNavigate();
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [bumpedOrders, setBumpedOrders] = useState<Order[]>([]); // recall buffer
  const syncProcessedRef = useRef(new Set<string>());
  const [now, setNow] = useState(Date.now());
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showNewOrder, setShowNewOrder] = useState(false);
  const [showTimer, setShowTimer] = useState(false);
  const [showStats, setShowStats] = useState(false);
  const [viewRecipeId, setViewRecipeId] = useState<number | null>(null);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [voiceEnabled, setVoiceEnabled] = useState(() => {
    try { return localStorage.getItem(KITCHEN_VOICE_KEY) === 'true'; } catch { return false; }
  });
  const [stationView, setStationView] = useState<StationView>(() => {
    try { return (localStorage.getItem(KITCHEN_STATION_KEY) as StationView) || 'complete'; } catch { return 'complete'; }
  });
  const [stats, setStats] = useState<DailyStats>({ platsServis: 0, tempsMoyenSeconds: 0, totalPrepTimes: [], dishPrepTimes: {}, hourlyOrders: {}, revenueToday: 0 });
  const [loaded, setLoaded] = useState(false);
  const [isDimmed, setIsDimmed] = useState(false);
  const [archivedCount, setArchivedCount] = useState(0);
  const [archivingIds, setArchivingIds] = useState<Set<string>>(new Set());
  const [orderTimestamps, setOrderTimestamps] = useState<OrderTimestamp[]>([]);
  const [orderCounter, setOrderCounter] = useState(0);
  const [draggedOrderId, setDraggedOrderId] = useState<string | null>(null);
  const [showTablePanel, setShowTablePanel] = useState(false);
  const [tableFilter, setTableFilter] = useState<number | null>(null);
  const [tableConfig, setTableConfig] = useState<TableConfig>(() => {
    try {
      const saved = localStorage.getItem(KITCHEN_TABLE_CONFIG_KEY);
      if (saved) return JSON.parse(saved);
    } catch {}
    return getDefaultTableConfig(12);
  });
  const [showTableConfig, setShowTableConfig] = useState(false);
  const [editingOrder, setEditingOrder] = useState<Order | null>(null);
  const [splittingOrder, setSplittingOrder] = useState<Order | null>(null);
  const dimTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const prevOrderCountRef = useRef(0);
  const prevReadyTablesRef = useRef<Set<string>>(new Set());
  const prevRushRef = useRef(false);

  // ── Load recipes ──────────────────────────────────────────────────
  useEffect(() => { fetchRecipes().then(setRecipes).catch(() => {}); }, []);

  // ── Load persisted data ───────────────────────────────────────────
  useEffect(() => {
    try {
      const today = new Date().toISOString().slice(0, 10);
      const savedDate = localStorage.getItem(STATS_DATE_KEY);
      if (savedDate !== today) {
        localStorage.setItem(STATS_DATE_KEY, today);
        localStorage.removeItem(STATS_KEY);
        localStorage.removeItem(STORAGE_KEY);
        localStorage.removeItem(KITCHEN_ARCHIVE_KEY);
        localStorage.removeItem(KITCHEN_ORDER_TIMESTAMPS_KEY);
        localStorage.removeItem(KITCHEN_ORDER_COUNTER_KEY);
        localStorage.removeItem(KITCHEN_BUMPED_KEY);
      }
      const savedOrders = localStorage.getItem(STORAGE_KEY);
      if (savedOrders) setOrders(JSON.parse(savedOrders));
      const savedStats = localStorage.getItem(STATS_KEY);
      if (savedStats) {
        const parsed = JSON.parse(savedStats);
        setStats({
          platsServis: parsed.platsServis || 0, tempsMoyenSeconds: parsed.tempsMoyenSeconds || 0,
          totalPrepTimes: parsed.totalPrepTimes || [], dishPrepTimes: parsed.dishPrepTimes || {},
          hourlyOrders: parsed.hourlyOrders || {}, revenueToday: parsed.revenueToday || 0,
        });
      }
      const savedSound = localStorage.getItem(KITCHEN_SOUND_KEY);
      if (savedSound !== null) setSoundEnabled(savedSound === 'true');
      const savedArchived = localStorage.getItem(KITCHEN_ARCHIVE_KEY);
      if (savedArchived) setArchivedCount(Number(savedArchived) || 0);
      const savedTimestamps = localStorage.getItem(KITCHEN_ORDER_TIMESTAMPS_KEY);
      if (savedTimestamps) setOrderTimestamps(JSON.parse(savedTimestamps));
      const savedCounter = localStorage.getItem(KITCHEN_ORDER_COUNTER_KEY);
      if (savedCounter) setOrderCounter(Number(savedCounter) || 0);
      const savedBumped = localStorage.getItem(KITCHEN_BUMPED_KEY);
      if (savedBumped) setBumpedOrders(JSON.parse(savedBumped));
    } catch {}
    setLoaded(true);
  }, []);

  // ── Persist ───────────────────────────────────────────────────────
  useEffect(() => { if (loaded) localStorage.setItem(STORAGE_KEY, JSON.stringify(orders)); }, [orders, loaded]);
  useEffect(() => { if (loaded) localStorage.setItem(STATS_KEY, JSON.stringify(stats)); }, [stats, loaded]);
  useEffect(() => { localStorage.setItem(KITCHEN_SOUND_KEY, String(soundEnabled)); }, [soundEnabled]);
  useEffect(() => { localStorage.setItem(KITCHEN_VOICE_KEY, String(voiceEnabled)); }, [voiceEnabled]);
  useEffect(() => { localStorage.setItem(KITCHEN_STATION_KEY, stationView); }, [stationView]);
  useEffect(() => { if (loaded) localStorage.setItem(KITCHEN_ARCHIVE_KEY, String(archivedCount)); }, [archivedCount, loaded]);
  useEffect(() => { if (loaded) localStorage.setItem(KITCHEN_ORDER_TIMESTAMPS_KEY, JSON.stringify(orderTimestamps)); }, [orderTimestamps, loaded]);
  useEffect(() => { if (loaded) localStorage.setItem(KITCHEN_ORDER_COUNTER_KEY, String(orderCounter)); }, [orderCounter, loaded]);
  useEffect(() => { if (loaded) localStorage.setItem(KITCHEN_BUMPED_KEY, JSON.stringify(bumpedOrders)); }, [bumpedOrders, loaded]);
  useEffect(() => { localStorage.setItem(KITCHEN_TABLE_CONFIG_KEY, JSON.stringify(tableConfig)); }, [tableConfig]);

  // ── Live clock ────────────────────────────────────────────────────
  useEffect(() => {
    const interval = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(interval);
  }, []);

  // ── Sound: new order bell ─────────────────────────────────────────
  useEffect(() => {
    const currentCount = orders.length;
    if (loaded && soundEnabled && currentCount > prevOrderCountRef.current && prevOrderCountRef.current > 0) {
      playBellSound();
    }
    prevOrderCountRef.current = currentCount;
  }, [orders.length, loaded, soundEnabled]);

  // ── Sound + Voice: order ready ────────────────────────────────────
  useEffect(() => {
    const readyTables = new Set<string>();
    for (const o of orders) {
      const active = o.dishes.some(d => d.status !== 'servi');
      const allPretOrServed = o.dishes.every(d => d.status === 'pret' || d.status === 'servi');
      if (active && allPretOrServed && !o.bumpedAt) readyTables.add(o.id);
    }
    if (loaded) {
      for (const id of readyTables) {
        if (!prevReadyTablesRef.current.has(id)) {
          if (soundEnabled) playReadySound();
          if (voiceEnabled) {
            const order = orders.find(o => o.id === id);
            if (order) announceReady(order.tableNumber);
          }
        }
      }
    }
    prevReadyTablesRef.current = readyTables;
  }, [orders, loaded, soundEnabled, voiceEnabled]);

  // ── Rush Hour Detection + Sound ───────────────────────────────────
  const isRushHour = useMemo(() => {
    const cutoff = now - RUSH_WINDOW_MS;
    const recentOrders = orders.filter(o => o.createdAt > cutoff).length;
    const recentTimestamps = orderTimestamps.filter(t => t.time > cutoff).length;
    return Math.max(recentOrders, recentTimestamps) >= RUSH_THRESHOLD;
  }, [orders, orderTimestamps, now]);

  useEffect(() => {
    if (loaded && isRushHour && !prevRushRef.current && soundEnabled) {
      playRushAlarm();
    }
    prevRushRef.current = isRushHour;
  }, [isRushHour, loaded, soundEnabled]);

  // ── Auto-Archive ──────────────────────────────────────────────────
  useEffect(() => {
    if (!loaded) return;
    const interval = setInterval(() => {
      const nowMs = Date.now();
      setOrders(prev => {
        const toArchive: string[] = [];
        for (const order of prev) {
          const allServed = order.dishes.every(d => d.status === 'servi');
          const isBumped = !!order.bumpedAt;
          if (allServed || isBumped) {
            const timestamp = isBumped ? order.bumpedAt! : Math.max(...order.dishes.filter(d => d.servedAt).map(d => d.servedAt!));
            if (timestamp > 0 && (nowMs - timestamp) > AUTO_ARCHIVE_DELAY) toArchive.push(order.id);
          }
        }
        if (toArchive.length === 0) return prev;
        setArchivingIds(prevIds => { const next = new Set(prevIds); toArchive.forEach(id => next.add(id)); return next; });
        setTimeout(() => {
          setOrders(current => {
            const removed = current.filter(o => !toArchive.includes(o.id));
            setArchivedCount(c => c + toArchive.length);
            setArchivingIds(new Set());
            return removed;
          });
        }, 500);
        return prev;
      });
    }, 5000);
    return () => clearInterval(interval);
  }, [loaded]);

  // ── Auto-dim ──────────────────────────────────────────────────────
  const resetDimTimer = useCallback(() => {
    setIsDimmed(false);
    if (dimTimerRef.current) clearTimeout(dimTimerRef.current);
    dimTimerRef.current = setTimeout(() => setIsDimmed(true), AUTO_DIM_TIMEOUT);
  }, []);

  useEffect(() => {
    resetDimTimer();
    const events = ['touchstart', 'mousedown', 'mousemove', 'keydown'];
    events.forEach(e => document.addEventListener(e, resetDimTimer, { passive: true }));
    return () => {
      events.forEach(e => document.removeEventListener(e, resetDimTimer));
      if (dimTimerRef.current) clearTimeout(dimTimerRef.current);
    };
  }, [resetDimTimer]);

  // ── Fullscreen ────────────────────────────────────────────────────
  const toggleFullscreen = useCallback(() => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen?.().catch(() => {});
      setIsFullscreen(true);
    } else {
      document.exitFullscreen?.().catch(() => {});
      setIsFullscreen(false);
    }
  }, []);

  useEffect(() => {
    const handler = () => setIsFullscreen(!!document.fullscreenElement);
    document.addEventListener('fullscreenchange', handler);
    return () => document.removeEventListener('fullscreenchange', handler);
  }, []);

  // ── ServiceTracker integration ────────────────────────────────────
  useEffect(() => {
    const pollInterval = setInterval(() => {
      try {
        const raw = localStorage.getItem(SERVICE_TRACKER_KEY);
        if (!raw) return;
        const session = JSON.parse(raw);
        if (!session?.isActive || !session?.orders) return;
        const tableGroups: Record<number, typeof session.orders> = {};
        for (const so of session.orders) {
          const tbl = so.tableNumber || 0;
          if (!tableGroups[tbl]) tableGroups[tbl] = [];
          tableGroups[tbl].push(so);
        }
        setOrders(prev => {
          let updated = [...prev];
          for (const [tblStr, stOrders] of Object.entries(tableGroups)) {
            const tbl = Number(tblStr);
            if (tbl === 0) continue;
            for (const so of stOrders) {
              const alreadyExists = updated.some(o => o.source === 'service-tracker' && o.dishes.some(d => d.id === `st-${so.id}`));
              if (alreadyExists) continue;
              let existingOrder = updated.find(o => o.source === 'service-tracker' && o.tableNumber === tbl && !o.dishes.every(d => d.status === 'servi'));
              const newDish: OrderDish = {
                id: `st-${so.id}`, recipeName: so.recipeName, recipeId: so.recipeId, quantity: so.quantity || 1,
                status: 'attente', prepTimeMinutes: 10, startedAt: null, completedAt: null, servedAt: null,
                category: so.category || 'plat', course: detectCourse({ recipeName: so.recipeName, category: so.category || 'plat' }),
              };
              if (existingOrder) {
                updated = updated.map(o => o.id === existingOrder!.id ? { ...o, dishes: [...o.dishes, newDish] } : o);
              } else {
                const newCounter = orderCounter + 1;
                setOrderCounter(newCounter);
                updated.push({
                  id: uid(), orderNumber: newCounter, tableNumber: tbl, serverName: 'Service',
                  createdAt: so.timestamp || Date.now(), notes: '', priority: 'normal',
                  source: 'service-tracker', holdStatus: 'active', dishes: [newDish],
                });
              }
            }
          }
          return updated;
        });
      } catch {}
    }, 3000);
    return () => clearInterval(pollInterval);
  }, [orderCounter]);

  // ── kitchen-orders-sync polling (ServiceTracker auto-sync) ───────
  useEffect(() => {
    const syncPoll = setInterval(() => {
      try {
        const raw = localStorage.getItem(KITCHEN_SYNC_KEY);
        if (!raw) return;
        const syncItems: any[] = JSON.parse(raw);
        if (!syncItems.length) return;
        const newItems = syncItems.filter(item => !syncProcessedRef.current.has(item.id));
        if (!newItems.length) return;

        setOrders(prev => {
          let updated = [...prev];
          for (const item of newItems) {
            syncProcessedRef.current.add(item.id);
            const alreadyExists = updated.some(o => o.dishes.some(d => d.id === `sync-${item.id}`));
            if (alreadyExists) continue;
            const tbl = item.tableNumber || 0;
            const newDish: OrderDish = {
              id: `sync-${item.id}`, recipeName: item.recipeName, recipeId: item.recipeId, quantity: item.quantity || 1,
              status: 'attente', prepTimeMinutes: 10, startedAt: null, completedAt: null, servedAt: null,
              category: item.category || 'plat', course: detectCourse({ recipeName: item.recipeName, category: item.category || 'plat' }),
            };
            let existingOrder = updated.find(o => o.source === 'service-tracker' && o.tableNumber === tbl && !o.dishes.every(d => d.status === 'servi'));
            if (existingOrder && tbl > 0) {
              updated = updated.map(o => o.id === existingOrder!.id ? { ...o, dishes: [...o.dishes, newDish] } : o);
            } else {
              const newCounter = orderCounter + 1;
              setOrderCounter(newCounter);
              updated.push({
                id: uid(), orderNumber: newCounter, tableNumber: tbl, serverName: 'Salle',
                createdAt: item.timestamp || Date.now(), notes: '', priority: 'normal',
                source: 'service-tracker', holdStatus: 'active', dishes: [newDish],
              });
            }
          }
          return updated;
        });
        if (soundEnabled && newItems.length > 0) playBellSound();
      } catch {}
    }, 3000);
    return () => clearInterval(syncPoll);
  }, [orderCounter, soundEnabled]);

  // ── Speech synthesis voices ───────────────────────────────────────
  useEffect(() => { if ('speechSynthesis' in window) window.speechSynthesis.getVoices(); }, []);

  // ── Actions ───────────────────────────────────────────────────────
  const addDemoOrders = useCallback(() => {
    const { orders: newOrders, nextCounter } = generateDemoOrders(recipes, orderCounter);
    setOrderCounter(nextCounter);
    setOrders(prev => [...prev, ...newOrders]);
    setOrderTimestamps(prev => [...prev, ...newOrders.map(() => ({ time: Date.now() }))]);
    const hour = new Date().getHours();
    setStats(prev => ({ ...prev, hourlyOrders: { ...prev.hourlyOrders, [hour]: (prev.hourlyOrders[hour] || 0) + newOrders.length } }));
  }, [recipes, orderCounter]);

  const addOrder = useCallback((orderData: Omit<Order, 'orderNumber'>) => {
    const newCounter = orderCounter + 1;
    setOrderCounter(newCounter);
    const order: Order = { ...orderData, orderNumber: newCounter };
    setOrders(prev => [...prev, order]);
    setOrderTimestamps(prev => [...prev, { time: Date.now() }]);
    const hour = new Date().getHours();
    setStats(prev => ({ ...prev, hourlyOrders: { ...prev.hourlyOrders, [hour]: (prev.hourlyOrders[hour] || 0) + 1 } }));
  }, [orderCounter]);

  const removeOrder = useCallback((orderId: string) => {
    setOrders(prev => prev.filter(o => o.id !== orderId));
  }, []);

  // BUMP: marks entire order as done instantly
  const bumpOrder = useCallback((orderId: string) => {
    setOrders(prev => prev.map(order => {
      if (order.id !== orderId) return order;
      const bumpedDishes = order.dishes.map(dish => {
        if (dish.status === 'servi') return dish;
        const completedAt = dish.completedAt || Date.now();
        if (dish.startedAt && !dish.completedAt) {
          const prepDuration = Math.floor((completedAt - dish.startedAt) / 1000);
          setStats(prev => {
            const cat = dish.category || 'autre';
            const catTimes = { ...prev.dishPrepTimes };
            if (!catTimes[cat]) catTimes[cat] = [];
            catTimes[cat] = [...catTimes[cat], prepDuration];
            return { ...prev, platsServis: prev.platsServis + 1, totalPrepTimes: [...prev.totalPrepTimes, prepDuration], dishPrepTimes: catTimes };
          });
        } else {
          setStats(prev => ({ ...prev, platsServis: prev.platsServis + 1 }));
        }
        return { ...dish, status: 'servi' as DishStatus, completedAt, servedAt: Date.now() };
      });
      const bumped = { ...order, dishes: bumpedDishes, bumpedAt: Date.now() };
      // Save to recall buffer
      setBumpedOrders(prev => [bumped, ...prev].slice(0, 20));
      return bumped;
    }));
  }, []);

  // RECALL: bring back a bumped order
  const recallOrder = useCallback((orderId: string) => {
    const recalled = bumpedOrders.find(o => o.id === orderId);
    if (!recalled) return;
    // Reset all dishes to their pre-bump state (attente)
    const restoredOrder: Order = {
      ...recalled,
      bumpedAt: undefined,
      dishes: recalled.dishes.map(d => ({
        ...d, status: 'attente' as DishStatus, startedAt: null, completedAt: null, servedAt: null,
      })),
    };
    setOrders(prev => {
      const existing = prev.find(o => o.id === orderId);
      if (existing) return prev.map(o => o.id === orderId ? restoredOrder : o);
      return [...prev, restoredOrder];
    });
    setBumpedOrders(prev => prev.filter(o => o.id !== orderId));
    // Adjust stats
    setStats(prev => ({ ...prev, platsServis: Math.max(0, prev.platsServis - recalled.dishes.length) }));
  }, [bumpedOrders]);

  // HOLD: pause/unpause an order
  const toggleHold = useCallback((orderId: string) => {
    setOrders(prev => prev.map(order =>
      order.id === orderId ? { ...order, holdStatus: order.holdStatus === 'hold' ? 'active' : 'hold' } : order
    ));
  }, []);

  const cycleDishStatus = useCallback((orderId: string, dishId: string) => {
    setOrders(prev => prev.map(order => {
      if (order.id !== orderId) return order;
      return {
        ...order,
        dishes: order.dishes.map(dish => {
          if (dish.id !== dishId) return dish;
          if (dish.status === 'attente') return { ...dish, status: 'preparation' as DishStatus, startedAt: Date.now() };
          if (dish.status === 'preparation') {
            const completedAt = Date.now();
            if (dish.startedAt) {
              const prepDuration = Math.floor((completedAt - dish.startedAt) / 1000);
              setStats(prev => {
                const cat = dish.category || 'autre';
                const catTimes = { ...prev.dishPrepTimes };
                if (!catTimes[cat]) catTimes[cat] = [];
                catTimes[cat] = [...catTimes[cat], prepDuration];
                return { ...prev, totalPrepTimes: [...prev.totalPrepTimes, prepDuration], dishPrepTimes: catTimes };
              });
            }
            return { ...dish, status: 'pret' as DishStatus, completedAt };
          }
          if (dish.status === 'pret') {
            setStats(prev => ({ ...prev, platsServis: prev.platsServis + 1 }));
            return { ...dish, status: 'servi' as DishStatus, servedAt: Date.now() };
          }
          return dish;
        }),
      };
    }));
  }, []);

  const clearServed = useCallback(() => {
    const servedCount = orders.filter(o => o.dishes.every(d => d.status === 'servi') || o.bumpedAt).length;
    setOrders(prev => prev.filter(o => !o.dishes.every(d => d.status === 'servi') && !o.bumpedAt));
    setArchivedCount(c => c + servedCount);
  }, [orders]);

  // ── Clear ALL orders (with confirmation handled in QuickActionsBar) ──
  const clearAllOrders = useCallback(() => {
    const count = orders.length;
    setOrders([]);
    setArchivedCount(c => c + count);
  }, [orders]);

  // ── Free a table: mark all its active orders as served + archive ──
  const freeTable = useCallback((tableNumber: number) => {
    setOrders(prev => prev.map(order => {
      if (order.tableNumber !== tableNumber) return order;
      if (order.bumpedAt || order.dishes.every(d => d.status === 'servi')) return order;
      const updatedDishes = order.dishes.map(dish => {
        if (dish.status === 'servi') return dish;
        setStats(s => ({ ...s, platsServis: s.platsServis + 1 }));
        return { ...dish, status: 'servi' as DishStatus, completedAt: dish.completedAt || Date.now(), servedAt: Date.now() };
      });
      return { ...order, dishes: updatedDishes, bumpedAt: Date.now() };
    }));
  }, []);

  // ── Add / Remove table ────────────────────────────────────────────
  const addTable = useCallback(() => {
    setTableConfig(prev => {
      const newNum = prev.tableCount + 1;
      return { tableCount: newNum, tables: [...prev.tables, { number: newNum, section: 'salle' }] };
    });
  }, []);

  const removeTable = useCallback(() => {
    setTableConfig(prev => {
      if (prev.tableCount <= 1) return prev;
      return { tableCount: prev.tableCount - 1, tables: prev.tables.filter(t => t.number !== prev.tableCount) };
    });
  }, []);

  // ── Edit order (change table, notes, priority) ────────────────────
  const updateOrder = useCallback((orderId: string, updates: { tableNumber?: number; notes?: string; priority?: OrderPriority }) => {
    setOrders(prev => prev.map(order => {
      if (order.id !== orderId) return order;
      return {
        ...order,
        tableNumber: updates.tableNumber ?? order.tableNumber,
        notes: updates.notes ?? order.notes,
        priority: updates.priority ?? order.priority,
      };
    }));
  }, []);

  // ── Delete order with confirmation (handled at call-site) ─────────
  const deleteOrder = useCallback((orderId: string) => {
    setOrders(prev => prev.filter(o => o.id !== orderId));
  }, []);

  // ── Split order ───────────────────────────────────────────────────
  const splitOrder = useCallback((orderId: string, dishIdsToMove: string[]) => {
    setOrders(prev => {
      const original = prev.find(o => o.id === orderId);
      if (!original) return prev;
      const movingDishes = original.dishes.filter(d => dishIdsToMove.includes(d.id));
      const remainingDishes = original.dishes.filter(d => !dishIdsToMove.includes(d.id));
      if (movingDishes.length === 0 || remainingDishes.length === 0) return prev;
      const newCounter = orderCounter + 1;
      setOrderCounter(newCounter);
      const newOrder: Order = {
        id: uid(), orderNumber: newCounter, tableNumber: original.tableNumber,
        serverName: original.serverName, createdAt: Date.now(), notes: original.notes,
        priority: original.priority, source: original.source, holdStatus: 'active',
        dishes: movingDishes.map(d => ({ ...d, id: uid() })),
      };
      return [
        ...prev.map(o => o.id === orderId ? { ...o, dishes: remainingDishes } : o),
        newOrder,
      ];
    });
  }, [orderCounter]);

  // ── Drag & Drop ───────────────────────────────────────────────────
  const handleDragStart = useCallback((e: React.DragEvent, orderId: string) => {
    e.dataTransfer.setData('text/plain', orderId);
    setDraggedOrderId(orderId);
  }, []);

  const handleDragEnd = useCallback(() => { setDraggedOrderId(null); }, []);

  const handleDrop = useCallback((e: React.DragEvent, targetColumn: 'new' | 'preparing' | 'ready') => {
    e.preventDefault();
    const orderId = e.dataTransfer.getData('text/plain');
    if (!orderId) return;

    setOrders(prev => prev.map(order => {
      if (order.id !== orderId) return order;
      if (targetColumn === 'ready') {
        // Move to ready = bump
        return { ...order, bumpedAt: Date.now(), dishes: order.dishes.map(d => d.status === 'servi' ? d : { ...d, status: 'pret' as DishStatus, completedAt: d.completedAt || Date.now() }) };
      }
      if (targetColumn === 'preparing') {
        // Move to preparing = start all waiting dishes
        return { ...order, dishes: order.dishes.map(d => d.status === 'attente' ? { ...d, status: 'preparation' as DishStatus, startedAt: Date.now() } : d) };
      }
      return order;
    }));
    setDraggedOrderId(null);
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent) => { e.preventDefault(); }, []);

  // ── Recipe view ───────────────────────────────────────────────────
  const recipeToView = viewRecipeId ? recipes.find(r => r.id === viewRecipeId) : null;

  // ── 3-column split with station view filtering ────────────────────
  const { newOrders, preparingOrders, readyOrders } = useMemo(() => {
    let active = orders.filter(o => !o.bumpedAt || (now - (o.bumpedAt || 0)) < AUTO_ARCHIVE_DELAY);

    // Apply table filter
    if (tableFilter !== null) {
      active = active.filter(o => o.tableNumber === tableFilter);
    }

    const sort = (arr: Order[]) => [...arr].sort((a, b) => {
      // Hold orders go to bottom
      if (a.holdStatus !== b.holdStatus) return a.holdStatus === 'hold' ? 1 : -1;
      const prioWeight = { vip: 0, rush: 1, normal: 2 };
      if (prioWeight[a.priority] !== prioWeight[b.priority]) return prioWeight[a.priority] - prioWeight[b.priority];
      return a.createdAt - b.createdAt;
    });

    const n: Order[] = [], p: Order[] = [], r: Order[] = [];
    for (const o of active) {
      const col = getOrderColumn(o);
      if (col === 'new') n.push(o);
      else if (col === 'preparing') p.push(o);
      else r.push(o);
    }

    return { newOrders: sort(n), preparingOrders: sort(p), readyOrders: sort(r) };
  }, [orders, now, tableFilter]);

  // ── Station View Filtering ────────────────────────────────────────
  const filterByStation = useCallback((orderList: Order[]): Order[] => {
    if (stationView === 'complete') return orderList;
    if (stationView === 'passe') return orderList; // passe shows only ready column

    return orderList.map(order => {
      const filteredDishes = order.dishes.filter(dish => {
        if (stationView === 'chaud') return isDishHot(dish);
        if (stationView === 'froid') return !isDishHot(dish);
        return true;
      });
      if (filteredDishes.length === 0) return null;
      return { ...order, dishes: filteredDishes };
    }).filter(Boolean) as Order[];
  }, [stationView]);

  const hasAnyOrders = orders.length > 0;
  const hasServed = orders.some(o => o.dishes.every(d => d.status === 'servi') || o.bumpedAt);

  // ── Render Column ─────────────────────────────────────────────────
  const renderColumn = (title: string, count: number, color: string, icon: React.ReactNode, ordersList: Order[], column: 'new' | 'preparing' | 'ready', emptyMsg: string) => (
    <div className="flex flex-col overflow-hidden"
      onDragOver={handleDragOver}
      onDrop={e => handleDrop(e, column)}>
      <ColumnHeader title={title} count={count} color={color} icon={icon} />
      <div className="flex-1 overflow-y-auto px-3 pb-3 space-y-3">
        {ordersList.map(order => (
          <OrderCard
            key={order.id}
            order={order}
            now={now}
            column={column}
            onDishStatusChange={cycleDishStatus}
            onDishView={id => setViewRecipeId(id)}
            onRemoveOrder={removeOrder}
            onPrint={printKitchenTicket}
            onBump={bumpOrder}
            onHold={toggleHold}
            isArchiving={archivingIds.has(order.id)}
            isDragging={draggedOrderId === order.id}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
            onDrop={handleDrop}
            onEditOrder={o => setEditingOrder(o)}
            onDeleteOrder={deleteOrder}
            onSplitOrder={o => setSplittingOrder(o)}
          />
        ))}
        {ordersList.length === 0 && (
          <div className="flex items-center justify-center h-32 text-[#333333]">
            <p className="text-xl">{emptyMsg}</p>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className={`fixed inset-0 z-[60] bg-black text-white flex flex-col select-none overflow-hidden transition-opacity duration-700 ${isDimmed ? 'opacity-30' : 'opacity-100'}`}
      style={{ fontSize: '18px', isolation: 'isolate' }}
      onClick={() => isDimmed && resetDimTimer()}>

      {/* Inject KDS styles */}
      <style>{KDS_STYLES}</style>

      {/* ── RUSH HOUR BANNER ── */}
      {isRushHour && <RushHourBanner />}

      {/* ── TOP BAR ── */}
      <div className="bg-[#0a0a0a] border-b-2 border-[#262626] px-4 py-2 shrink-0">
        <div className="flex items-center gap-3">
          {!isFullscreen && (
            <button onClick={() => navigate('/dashboard')}
              className="min-w-[56px] min-h-[56px] rounded-xl bg-[#1a1a1a] hover:bg-[#262626] text-[#a1a1aa] hover:text-white flex items-center justify-center kds-transition shrink-0">
              <ArrowLeft className="w-6 h-6 flex-shrink-0" />
            </button>
          )}

          <div className="flex items-center gap-3 shrink-0">
            <ChefHat className="w-10 h-10 text-[#14b8a6]" />
            <div>
              <h1 className="text-2xl font-black text-white tracking-wider hidden sm:block">CUISINE KDS</h1>
              <p className="text-sm text-[#71717a] hidden lg:block">Kitchen Display System</p>
            </div>
          </div>

          {/* Station View Tabs */}
          <div className="ml-2 hidden lg:block">
            <StationViewTabs current={stationView} onChange={setStationView} />
          </div>

          <div className="flex items-center gap-2 ml-auto shrink-0">
            <div className="text-4xl font-mono font-black text-[#14b8a6]">
              {new Date(now).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button onClick={() => setShowNewOrder(true)}
              className="min-w-[56px] min-h-[56px] rounded-xl bg-[#0d9488] hover:bg-[#14b8a6] text-white flex items-center justify-center gap-2 px-4 kds-transition">
              <Plus className="w-6 h-6 flex-shrink-0" /><span className="hidden sm:inline text-lg font-bold">Commande</span>
            </button>

            <button onClick={() => setShowTablePanel(v => !v)}
              className={`relative min-w-[56px] min-h-[56px] rounded-xl flex items-center justify-center gap-2 px-4 kds-transition
                ${showTablePanel ? 'bg-[#14b8a6]/20 text-[#14b8a6]' : 'bg-[#1a1a1a] text-[#a1a1aa] hover:bg-[#262626]'}`}
              title="Gestion des tables">
              <LayoutGrid className="w-6 h-6 flex-shrink-0" /><span className="hidden sm:inline text-lg font-bold">Tables</span>
              {tableFilter !== null && (
                <span className="absolute -top-1 -right-1 text-[10px] font-black px-1.5 py-0.5 rounded-full bg-[#14b8a6] text-white">
                  T{tableFilter}
                </span>
              )}
            </button>

            {/* Recall button */}
            {bumpedOrders.length > 0 && (
              <button onClick={() => { const last = bumpedOrders[0]; if (last) recallOrder(last.id); }}
                className="min-w-[56px] min-h-[56px] rounded-xl bg-[#f59e0b]/20 hover:bg-[#f59e0b]/30 text-[#f59e0b] flex items-center justify-center kds-transition relative"
                title="Rappeler derniere commande bumpee">
                <Undo2 className="w-6 h-6 flex-shrink-0" />
                <span className="absolute -top-1 -right-1 text-xs font-black px-1.5 py-0.5 rounded-full bg-[#f59e0b] text-black min-w-[20px] text-center">
                  {bumpedOrders.length}
                </span>
              </button>
            )}

            {/* Mobile station view toggle */}
            <button onClick={() => setStationView(v => v === 'complete' ? 'chaud' : v === 'chaud' ? 'froid' : v === 'froid' ? 'passe' : 'complete')}
              className={`min-w-[56px] min-h-[56px] rounded-xl flex items-center justify-center kds-transition lg:hidden relative
                ${stationView !== 'complete' ? 'bg-[#14b8a6]/20 text-[#14b8a6]' : 'bg-[#1a1a1a] text-[#a1a1aa] hover:bg-[#262626]'}`}>
              <SplitSquareHorizontal className="w-6 h-6 flex-shrink-0" />
              {stationView !== 'complete' && (
                <span className="absolute -top-1 -right-1 text-[10px] font-black px-1.5 py-0.5 rounded-full bg-[#1a1a1a] border border-current uppercase">
                  {stationView === 'chaud' ? 'HOT' : stationView === 'froid' ? 'COLD' : 'PASS'}
                </span>
              )}
            </button>

            <button onClick={() => setSoundEnabled(s => !s)}
              className={`min-w-[56px] min-h-[56px] rounded-xl flex items-center justify-center kds-transition
                ${soundEnabled ? 'bg-[#0d9488]/20 text-[#14b8a6] hover:bg-[#0d9488]/30' : 'bg-[#1a1a1a] text-[#525252] hover:bg-[#262626]'}`}>
              {soundEnabled ? <Volume2 className="w-6 h-6 flex-shrink-0" /> : <VolumeX className="w-6 h-6 flex-shrink-0" />}
            </button>

            <button onClick={toggleFullscreen}
              className="min-w-[56px] min-h-[56px] rounded-xl bg-[#1a1a1a] hover:bg-[#262626] text-[#a1a1aa] hover:text-white flex items-center justify-center kds-transition">
              {isFullscreen ? <Minimize2 className="w-6 h-6 flex-shrink-0" /> : <Maximize2 className="w-6 h-6 flex-shrink-0" />}
            </button>
          </div>
        </div>

        {/* Station view indicator (when not 'complete') - mobile */}
        {stationView !== 'complete' && (
          <div className="flex items-center gap-3 mt-2 pb-1 lg:hidden">
            {(['chaud', 'froid', 'passe'] as StationView[]).map(sv => (
              <button key={sv} onClick={() => setStationView(sv)}
                className={`flex-1 py-2 rounded-lg text-lg font-bold kds-transition
                  ${stationView === sv
                    ? sv === 'chaud' ? 'bg-[#f97316]/20 text-[#f97316] border border-[#f97316]/40'
                    : sv === 'froid' ? 'bg-[#60a5fa]/20 text-[#60a5fa] border border-[#60a5fa]/40'
                    : 'bg-[#34d399]/20 text-[#34d399] border border-[#34d399]/40'
                    : 'bg-[#1a1a1a] text-[#525252]'}`}>
                {sv === 'chaud' && <><Flame className="w-4 h-4 inline mr-1" />CHAUD</>}
                {sv === 'froid' && <><UtensilsCrossed className="w-4 h-4 inline mr-1" />FROID</>}
                {sv === 'passe' && <><CheckCircle2 className="w-4 h-4 inline mr-1" />PASSE</>}
              </button>
            ))}
            <button onClick={() => setStationView('complete')}
              className="px-4 py-2 rounded-lg text-sm font-bold bg-[#1a1a1a] text-[#71717a] hover:text-white kds-transition">
              <X className="w-4 h-4 inline" />
            </button>
          </div>
        )}
      </div>

      {/* ── QUICK ACTIONS BAR ── */}
      <QuickActionsBar
        orders={orders}
        tableConfig={tableConfig}
        onClearAll={clearAllOrders}
        onLoadDemo={addDemoOrders}
        onOpenTableConfig={() => setShowTableConfig(true)}
      />

      {/* ── TABLE PANEL ── */}
      {showTablePanel && (
        <TablePanel
          tableConfig={tableConfig}
          orders={orders}
          now={now}
          onFilterTable={setTableFilter}
          activeTableFilter={tableFilter}
          onFreeTable={freeTable}
          onAddTable={addTable}
          onRemoveTable={removeTable}
        />
      )}

      {/* ── TABLE FILTER INDICATOR ── */}
      {tableFilter !== null && (
        <div className="bg-[#14b8a6]/10 border-b border-[#14b8a6]/30 px-4 py-2 flex items-center justify-center gap-3 shrink-0">
          <LayoutGrid className="w-5 h-5 text-[#14b8a6]" />
          <span className="text-[#14b8a6] text-lg font-bold">Filtre actif: Table {tableFilter}</span>
          <button onClick={() => setTableFilter(null)}
            className="px-3 py-1 rounded-lg bg-[#14b8a6]/20 hover:bg-[#14b8a6]/30 text-[#14b8a6] text-sm font-bold kds-transition">
            <X className="w-4 h-4 inline mr-1" />Retirer le filtre
          </button>
        </div>
      )}

      {/* ── 3-COLUMN KDS BOARD ── */}
      <div className="flex-1 overflow-hidden">
        {!hasAnyOrders ? (
          <div className="flex flex-col items-center justify-center h-full gap-8 py-20">
            <ChefHat className="w-24 h-24 text-[#262626] animate-pulse" />
            <p className="text-3xl text-[#525252] font-black">Aucune commande en cours</p>
            <p className="text-xl text-[#404040]">Ajoutez une commande ou chargez des donnees demo</p>
            <div className="flex gap-4">
              <button onClick={() => setShowNewOrder(true)}
                className="min-h-[72px] px-10 rounded-xl bg-[#0d9488] hover:bg-[#14b8a6] text-white text-xl font-bold kds-transition"
                style={{ boxShadow: '0 0 20px rgba(13, 148, 136, 0.3)' }}>
                <Plus className="w-7 h-7 inline mr-2" />Nouvelle Commande
              </button>
              <button onClick={addDemoOrders}
                className="min-h-[72px] px-10 rounded-xl bg-[#1a1a1a] hover:bg-[#262626] text-[#a1a1aa] text-xl font-bold kds-transition border border-[#333333]">
                <Flame className="w-6 h-6 inline mr-2" />Donnees demo
              </button>
            </div>
          </div>
        ) : stationView === 'passe' ? (
          /* PASSE VIEW: Only ready orders in single column */
          <div className="h-full overflow-hidden">
            {renderColumn(
              'Passe - Prets a servir',
              filterByStation(readyOrders).length,
              '#34d399',
              <CheckCircle2 className="w-6 h-6 text-[#34d399]" />,
              filterByStation(readyOrders),
              'ready',
              'Aucun plat au passe'
            )}
          </div>
        ) : (
          /* FULL / CHAUD / FROID: 3 columns */
          <div className="grid grid-cols-1 lg:grid-cols-3 h-full">
            <div className="border-r-0 lg:border-r-2 border-[#1a1a1a] flex flex-col overflow-hidden bg-red-950/30">
              {renderColumn(
                'Nouvelles', filterByStation(newOrders).length, '#ef4444',
                <Clock className="w-6 h-6 text-[#ef4444]" />,
                filterByStation(newOrders), 'new', 'Aucune commande en attente'
              )}
            </div>
            <div className="border-r-0 lg:border-r-2 border-[#1a1a1a] flex flex-col overflow-hidden bg-amber-950/30">
              {renderColumn(
                'En preparation', filterByStation(preparingOrders).length, '#fbbf24',
                <Flame className="w-6 h-6 text-[#fbbf24]" />,
                filterByStation(preparingOrders), 'preparing', 'Rien en preparation'
              )}
            </div>
            <div className="flex flex-col overflow-hidden bg-emerald-950/30">
              {renderColumn(
                'Prets a servir', filterByStation(readyOrders).length, '#34d399',
                <CheckCircle2 className="w-6 h-6 text-[#34d399]" />,
                filterByStation(readyOrders), 'ready', 'Aucun plat pret'
              )}
            </div>
          </div>
        )}
      </div>

      {/* ── STATS BAR ── */}
      <StatsBar orders={orders} stats={stats} archivedCount={archivedCount} onOpenStats={() => setShowStats(true)} />

      {/* ── MODALS ── */}
      {showNewOrder && <NewOrderModal recipes={recipes} onAdd={addOrder} onClose={() => setShowNewOrder(false)} />}
      {showTimer && <StandaloneTimer onClose={() => setShowTimer(false)} />}
      {showStats && <PerformanceStatsModal stats={stats} orders={orders} onClose={() => setShowStats(false)} />}
      {recipeToView && <RecipeQuickView recipe={recipeToView} onClose={() => setViewRecipeId(null)} />}
      {editingOrder && <EditOrderModal order={editingOrder} onSave={updateOrder} onClose={() => setEditingOrder(null)} />}
      {splittingOrder && <SplitOrderModal order={splittingOrder} onSplit={splitOrder} onClose={() => setSplittingOrder(null)} />}
      {showTableConfig && <TableConfigModal config={tableConfig} onSave={setTableConfig} onClose={() => setShowTableConfig(false)} />}
    </div>
  );
}
