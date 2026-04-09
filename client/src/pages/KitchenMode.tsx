import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeft, Clock, ChefHat, X, Play, Pause, RotateCcw, Timer,
  UtensilsCrossed, Maximize2, Minimize2, Plus, Trash2, AlertTriangle,
  CheckCircle2, Eye, Flame, Volume2, VolumeX, Printer, Bell,
  Star, Users, ArrowRightCircle, RefreshCw, Mic, MicOff, Zap,
  SplitSquareHorizontal, BarChart3, TrendingUp, Award, Archive,
  ShieldAlert, Megaphone
} from 'lucide-react';
import { fetchRecipes } from '../services/api';
import type { Recipe } from '../types';

// ══════════════════════════════════════════════════════════════════════════
// ██  TYPES  ██████████████████████████████████████████████████████████████
// ══════════════════════════════════════════════════════════════════════════
type DishStatus = 'attente' | 'preparation' | 'pret' | 'servi';
type OrderPriority = 'normal' | 'rush' | 'vip';
type KitchenZone = 'all' | 'hot' | 'cold';

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
}

interface Order {
  id: string;
  tableNumber: number;
  serverName: string;
  createdAt: number;
  dishes: OrderDish[];
  notes: string;
  priority: OrderPriority;
  source: 'kitchen' | 'service-tracker';
  archivedAt?: number | null;
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
const KITCHEN_SOUND_KEY = 'kitchen-mode-sound';
const KITCHEN_VOICE_KEY = 'kitchen-mode-voice';
const KITCHEN_SPLIT_KEY = 'kitchen-mode-split';
const KITCHEN_ARCHIVE_KEY = 'kitchen-mode-archived-count';
const KITCHEN_ORDER_TIMESTAMPS_KEY = 'kitchen-mode-order-timestamps';
const AUTO_DIM_TIMEOUT = 30000;
const AUTO_ARCHIVE_DELAY = 30000; // 30s after served
const RUSH_WINDOW_MS = 10 * 60 * 1000; // 10 minutes
const RUSH_THRESHOLD = 5; // 5 orders in 10 min = rush

// Allergen keywords for detection
const ALLERGEN_KEYWORDS: Record<string, string> = {
  'gluten': 'GLUTEN',
  'ble': 'GLUTEN',
  'lactose': 'LACTOSE',
  'lait': 'LACTOSE',
  'noix': 'NOIX',
  'noisette': 'NOIX',
  'amande': 'NOIX',
  'arachide': 'ARACHIDES',
  'arachides': 'ARACHIDES',
  'cacahuete': 'ARACHIDES',
  'oeuf': 'OEUFS',
  'oeufs': 'OEUFS',
  'poisson': 'POISSON',
  'crustace': 'CRUSTACES',
  'crustaces': 'CRUSTACES',
  'soja': 'SOJA',
  'celeri': 'CELERI',
  'moutarde': 'MOUTARDE',
  'sesame': 'SESAME',
  'sulfite': 'SULFITES',
  'sulfites': 'SULFITES',
  'lupin': 'LUPIN',
  'mollusque': 'MOLLUSQUES',
  'mollusques': 'MOLLUSQUES',
  'allergie': 'ALLERGIE',
  'vegetarien': 'VEGETARIEN',
  'vegan': 'VEGAN',
  'sans gluten': 'SANS GLUTEN',
};

// Hot kitchen categories (plats chauds)
const HOT_CATEGORIES = ['plat', 'plats', 'viande', 'viandes', 'poisson', 'poissons', 'grillade', 'grillades', 'pizza', 'pizzas', 'pate', 'pates', 'risotto', 'soupe', 'soupes', 'plat principal', 'plat du jour', 'chaud'];
// Cold kitchen categories (entrees/desserts)
const COLD_CATEGORIES = ['entree', 'entrees', 'dessert', 'desserts', 'salade', 'salades', 'froid', 'fromage', 'fromages', 'patisserie', 'patisseries', 'glace', 'glaces', 'tartare', 'carpaccio', 'ceviche'];

// ══════════════════════════════════════════════════════════════════════════
// ██  SOUND SYSTEM  ██████████████████████████████████████████████████████
// ══════════════════════════════════════════════════════════════════════════
const audioCtxRef = { current: null as AudioContext | null };

function getAudioCtx(): AudioContext {
  if (!audioCtxRef.current) {
    audioCtxRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
  }
  return audioCtxRef.current;
}

function playBellSound() {
  try {
    const ctx = getAudioCtx();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.type = 'sine';
    osc.frequency.setValueAtTime(880, ctx.currentTime);
    osc.frequency.setValueAtTime(1100, ctx.currentTime + 0.1);
    osc.frequency.setValueAtTime(880, ctx.currentTime + 0.2);
    gain.gain.setValueAtTime(0.3, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.5);
    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + 0.5);
  } catch {}
}

function playReadySound() {
  try {
    const ctx = getAudioCtx();
    [0, 0.15].forEach((delay, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.type = 'sine';
      osc.frequency.setValueAtTime(i === 0 ? 660 : 990, ctx.currentTime + delay);
      gain.gain.setValueAtTime(0.25, ctx.currentTime + delay);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + delay + 0.3);
      osc.start(ctx.currentTime + delay);
      osc.stop(ctx.currentTime + delay + 0.3);
    });
  } catch {}
}

// ══════════════════════════════════════════════════════════════════════════
// ██  VOICE ANNOUNCEMENTS (Web Speech API)  ██████████████████████████████
// ══════════════════════════════════════════════════════════════════════════
function announceReady(tableNumber: number) {
  try {
    if (!('speechSynthesis' in window)) return;
    const utterance = new SpeechSynthesisUtterance(`Table ${tableNumber}, commande prete!`);
    utterance.lang = 'fr-FR';
    utterance.rate = 1.1;
    utterance.pitch = 1.0;
    utterance.volume = 1.0;
    // Try to pick a French voice
    const voices = window.speechSynthesis.getVoices();
    const frVoice = voices.find(v => v.lang.startsWith('fr'));
    if (frVoice) utterance.voice = frVoice;
    window.speechSynthesis.speak(utterance);
  } catch {}
}

// ══════════════════════════════════════════════════════════════════════════
// ██  ALLERGEN DETECTION  ████████████████████████████████████████████████
// ══════════════════════════════════════════════════════════════════════════
function detectAllergens(notes: string): string[] {
  if (!notes) return [];
  const lower = notes.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  const found = new Set<string>();
  for (const [keyword, allergen] of Object.entries(ALLERGEN_KEYWORDS)) {
    const normalizedKeyword = keyword.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    if (lower.includes(normalizedKeyword)) {
      found.add(allergen);
    }
  }
  return Array.from(found);
}

// ══════════════════════════════════════════════════════════════════════════
// ██  ZONE CLASSIFICATION  ██████████████████████████████████████████████
// ══════════════════════════════════════════════════════════════════════════
function isDishHot(dish: OrderDish): boolean {
  const name = (dish.recipeName || '').toLowerCase();
  const cat = (dish.category || '').toLowerCase();
  // Check category
  if (HOT_CATEGORIES.some(c => cat.includes(c))) return true;
  // Check name hints
  if (['steak', 'poulet', 'boeuf', 'agneau', 'canard', 'saumon', 'grille', 'roti', 'braise', 'soupe', 'pizza', 'pate', 'risotto', 'burger', 'frite'].some(w => name.includes(w))) return true;
  // Default: if not clearly cold, assume hot
  if (COLD_CATEGORIES.some(c => cat.includes(c) || name.includes(c))) return false;
  return true;
}

function isDishCold(dish: OrderDish): boolean {
  return !isDishHot(dish);
}

// ══════════════════════════════════════════════════════════════════════════
// ██  HELPERS  ████████████████████████████████████████████████████████████
// ══════════════════════════════════════════════════════════════════════════
function uid(): string {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
}

function formatElapsed(seconds: number): string {
  if (seconds < 0) seconds = 0;
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
}

function getWaitColor(elapsedSeconds: number): string {
  const mins = elapsedSeconds / 60;
  if (mins < 5) return '#22c55e';
  if (mins < 10) return '#f59e0b';
  if (mins < 20) return '#f97316';
  return '#ef4444';
}

function getWaitBorder(elapsedSeconds: number): string {
  const mins = elapsedSeconds / 60;
  if (mins < 5) return 'border-[#22c55e]/40';
  if (mins < 10) return 'border-[#f59e0b]/50';
  if (mins < 20) return 'border-[#f97316]/60';
  return 'border-[#ef4444]/70';
}

function getWaitBg(elapsedSeconds: number): string {
  const mins = elapsedSeconds / 60;
  if (mins < 5) return '';
  if (mins < 10) return 'shadow-[0_0_20px_rgba(245,158,11,0.12)]';
  if (mins < 20) return 'shadow-[0_0_25px_rgba(249,115,22,0.18)]';
  return 'shadow-[0_0_35px_rgba(239,68,68,0.25)]';
}

function getPriorityConfig(p: OrderPriority) {
  switch (p) {
    case 'vip': return { label: 'VIP', bg: 'bg-[#7c3aed]', text: 'text-white', ring: 'ring-[#7c3aed]/40' };
    case 'rush': return { label: 'RUSH', bg: 'bg-[#ef4444]', text: 'text-white', ring: 'ring-[#ef4444]/40' };
    default: return { label: '', bg: '', text: '', ring: '' };
  }
}

const dishStatusConfig: Record<DishStatus, { label: string; color: string; bgColor: string; icon: React.ReactNode }> = {
  attente:     { label: 'En attente',     color: '#a1a1aa', bgColor: 'bg-[#27272a]',    icon: <Clock className="w-5 h-5" /> },
  preparation: { label: 'En preparation', color: '#fbbf24', bgColor: 'bg-[#78350f]/60', icon: <Flame className="w-5 h-5" /> },
  pret:        { label: 'Pret',           color: '#34d399', bgColor: 'bg-[#064e3b]/60', icon: <CheckCircle2 className="w-5 h-5" /> },
  servi:       { label: 'Servi',          color: '#52525b', bgColor: 'bg-[#18181b]',    icon: <UtensilsCrossed className="w-5 h-5" /> },
};

function getOrderColumn(order: Order): 'new' | 'preparing' | 'ready' {
  const allServed = order.dishes.every(d => d.status === 'servi');
  if (allServed) return 'ready';
  const allPretOrServed = order.dishes.every(d => d.status === 'pret' || d.status === 'servi');
  if (allPretOrServed) return 'ready';
  const hasAnyPrep = order.dishes.some(d => d.status === 'preparation');
  if (hasAnyPrep) return 'preparing';
  return 'new';
}

// ══════════════════════════════════════════════════════════════════════════
// ██  DEMO DATA  ██████████████████████████████████████████████████████████
// ══════════════════════════════════════════════════════════════════════════
const DEMO_SERVERS = ['Marie', 'Karim', 'Julie', 'Thomas', 'Sofia', 'Lucas'];

function generateDemoOrders(recipes: Recipe[]): Order[] {
  const now = Date.now();
  const pick = () => {
    if (recipes.length === 0) return { name: 'Plat du jour', id: null, prep: 10, category: 'plat' };
    const r = recipes[Math.floor(Math.random() * recipes.length)];
    return { name: r.name, id: r.id, prep: (r.prepTimeMinutes || 5) + (r.cookTimeMinutes || 5), category: r.category || 'plat' };
  };
  const srv = () => DEMO_SERVERS[Math.floor(Math.random() * DEMO_SERVERS.length)];

  return [
    {
      id: uid(), tableNumber: 3, serverName: srv(), createdAt: now - 22 * 60 * 1000, notes: 'ALLERGIE ARACHIDES - Sans gluten', priority: 'rush' as OrderPriority, source: 'kitchen' as const,
      dishes: [
        { id: uid(), recipeName: pick().name, recipeId: pick().id, quantity: 2, status: 'preparation' as DishStatus, prepTimeMinutes: 12, startedAt: now - 8 * 60 * 1000, completedAt: null, servedAt: null, category: 'plat' },
        { id: uid(), recipeName: pick().name, recipeId: pick().id, quantity: 1, status: 'attente' as DishStatus, prepTimeMinutes: 15, startedAt: null, completedAt: null, servedAt: null, category: 'dessert' },
      ],
    },
    {
      id: uid(), tableNumber: 7, serverName: srv(), createdAt: now - 12 * 60 * 1000, notes: 'Sans lactose', priority: 'normal' as OrderPriority, source: 'kitchen' as const,
      dishes: [
        { id: uid(), recipeName: pick().name, recipeId: pick().id, quantity: 1, status: 'attente' as DishStatus, prepTimeMinutes: 10, startedAt: null, completedAt: null, servedAt: null, category: 'entree' },
        { id: uid(), recipeName: pick().name, recipeId: pick().id, quantity: 3, status: 'attente' as DishStatus, prepTimeMinutes: 8, startedAt: null, completedAt: null, servedAt: null, category: 'plat' },
        { id: uid(), recipeName: pick().name, recipeId: pick().id, quantity: 1, status: 'attente' as DishStatus, prepTimeMinutes: 20, startedAt: null, completedAt: null, servedAt: null, category: 'plat' },
      ],
    },
    {
      id: uid(), tableNumber: 1, serverName: srv(), createdAt: now - 6 * 60 * 1000, notes: 'Allergie noix', priority: 'vip' as OrderPriority, source: 'kitchen' as const,
      dishes: [
        { id: uid(), recipeName: pick().name, recipeId: pick().id, quantity: 1, status: 'preparation' as DishStatus, prepTimeMinutes: 18, startedAt: now - 5 * 60 * 1000, completedAt: null, servedAt: null, category: 'plat' },
        { id: uid(), recipeName: pick().name, recipeId: pick().id, quantity: 2, status: 'pret' as DishStatus, prepTimeMinutes: 8, startedAt: now - 10 * 60 * 1000, completedAt: now - 2 * 60 * 1000, servedAt: null, category: 'entree' },
      ],
    },
    {
      id: uid(), tableNumber: 12, serverName: srv(), createdAt: now - 2 * 60 * 1000, notes: '', priority: 'normal' as OrderPriority, source: 'kitchen' as const,
      dishes: [
        { id: uid(), recipeName: pick().name, recipeId: pick().id, quantity: 1, status: 'attente' as DishStatus, prepTimeMinutes: 15, startedAt: null, completedAt: null, servedAt: null, category: 'plat' },
        { id: uid(), recipeName: pick().name, recipeId: pick().id, quantity: 1, status: 'attente' as DishStatus, prepTimeMinutes: 10, startedAt: null, completedAt: null, servedAt: null, category: 'dessert' },
      ],
    },
    {
      id: uid(), tableNumber: 5, serverName: srv(), createdAt: now - 25 * 60 * 1000, notes: 'Vegetarien strict', priority: 'normal' as OrderPriority, source: 'kitchen' as const,
      dishes: [
        { id: uid(), recipeName: pick().name, recipeId: pick().id, quantity: 1, status: 'pret' as DishStatus, prepTimeMinutes: 12, startedAt: now - 20 * 60 * 1000, completedAt: now - 3 * 60 * 1000, servedAt: null, category: 'salade' },
        { id: uid(), recipeName: pick().name, recipeId: pick().id, quantity: 2, status: 'pret' as DishStatus, prepTimeMinutes: 10, startedAt: now - 18 * 60 * 1000, completedAt: now - 4 * 60 * 1000, servedAt: null, category: 'entree' },
      ],
    },
    {
      id: uid(), tableNumber: 9, serverName: srv(), createdAt: now - 1 * 60 * 1000, notes: '', priority: 'rush' as OrderPriority, source: 'kitchen' as const,
      dishes: [
        { id: uid(), recipeName: pick().name, recipeId: pick().id, quantity: 4, status: 'attente' as DishStatus, prepTimeMinutes: 6, startedAt: null, completedAt: null, servedAt: null, category: 'plat' },
      ],
    },
  ];
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
          <button onClick={onClose} className="p-3 rounded-xl bg-[#1a1a1a] hover:bg-[#262626] text-[#a1a1aa] hover:text-white transition-colors min-w-[64px] min-h-[64px] flex items-center justify-center">
            <X className="w-7 h-7" />
          </button>
        </div>

        <div className="w-full h-48 bg-[#1a1a1a] rounded-xl mb-6 flex items-center justify-center border border-[#262626]">
          <ChefHat className="w-16 h-16 text-[#333333]" />
        </div>

        {recipe.description && (
          <p className="text-xl text-[#a1a1aa] mb-6 leading-relaxed">{recipe.description}</p>
        )}

        {recipe.ingredients?.some((ri: any) => ri.ingredient?.allergens?.length > 0) && (
          <div className="bg-[#ef4444]/10 border border-[#ef4444]/30 rounded-xl p-4 mb-6">
            <div className="flex items-center gap-2 text-[#ef4444] text-xl font-bold mb-2">
              <AlertTriangle className="w-6 h-6" />
              ALLERGENES
            </div>
            <div className="flex flex-wrap gap-2">
              {Array.from(new Set(recipe.ingredients?.flatMap((ri: any) => ri.ingredient?.allergens || []) || [])).map((a: any, i: number) => (
                <span key={i} className="px-3 py-1 bg-[#ef4444]/20 text-[#ef4444] rounded-lg text-lg font-semibold">{a}</span>
              ))}
            </div>
          </div>
        )}

        <h3 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
          <UtensilsCrossed className="w-6 h-6 text-[#fbbf24]" />
          Ingredients
        </h3>
        <div className="space-y-2 mb-6">
          {recipe.ingredients?.map((ri: any) => (
            <div key={ri.id} className="flex justify-between items-center bg-[#1a1a1a] rounded-xl px-5 py-4">
              <span className="text-xl font-semibold text-white">{ri.ingredient?.name || 'Ingredient'}</span>
              <span className="text-xl text-[#fbbf24] font-mono font-bold">
                {ri.quantity} {ri.ingredient?.unit || ''}
              </span>
            </div>
          ))}
        </div>

        <div className="bg-[#1a1a1a] border border-[#262626] rounded-xl p-5">
          <h3 className="text-xl font-bold text-white mb-3">Instructions de preparation</h3>
          <p className="text-lg text-[#71717a]">
            {recipe.description || 'Aucune instruction disponible. Ajoutez des instructions dans la fiche recette.'}
          </p>
        </div>
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════
// ██  NEW ORDER MODAL  ████████████████████████████████████████████████████
// ══════════════════════════════════════════════════════════════════════════
function NewOrderModal({
  recipes, onAdd, onClose
}: {
  recipes: Recipe[];
  onAdd: (order: Order) => void;
  onClose: () => void;
}) {
  const [tableNumber, setTableNumber] = useState<number>(1);
  const [serverName, setServerName] = useState('');
  const [notes, setNotes] = useState('');
  const [priority, setPriority] = useState<OrderPriority>('normal');
  const [selectedDishes, setSelectedDishes] = useState<{ recipeName: string; recipeId: number | null; prepTime: number; quantity: number; category: string }[]>([]);
  const [search, setSearch] = useState('');

  const filtered = recipes.filter(r =>
    r.name.toLowerCase().includes(search.toLowerCase()) ||
    r.category.toLowerCase().includes(search.toLowerCase())
  );

  const addDish = (recipe: Recipe) => {
    const existing = selectedDishes.findIndex(d => d.recipeId === recipe.id);
    if (existing >= 0) {
      setSelectedDishes(prev => prev.map((d, i) => i === existing ? { ...d, quantity: d.quantity + 1 } : d));
    } else {
      setSelectedDishes(prev => [...prev, {
        recipeName: recipe.name,
        recipeId: recipe.id,
        prepTime: (recipe.prepTimeMinutes || 5) + (recipe.cookTimeMinutes || 5),
        quantity: 1,
        category: recipe.category || 'plat',
      }]);
    }
  };

  const removeDish = (index: number) => {
    setSelectedDishes(prev => prev.filter((_, i) => i !== index));
  };

  // Detect allergens in notes as user types
  const detectedAllergens = detectAllergens(notes);

  const handleSubmit = () => {
    if (selectedDishes.length === 0) return;
    const order: Order = {
      id: uid(),
      tableNumber,
      serverName: serverName.trim() || 'Serveur',
      createdAt: Date.now(),
      notes,
      priority,
      source: 'kitchen',
      dishes: selectedDishes.map(d => ({
        id: uid(),
        recipeName: d.recipeName,
        recipeId: d.recipeId,
        quantity: d.quantity,
        status: 'attente' as DishStatus,
        prepTimeMinutes: d.prepTime,
        startedAt: null,
        completedAt: null,
        servedAt: null,
        category: d.category,
      })),
    };
    onAdd(order);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-sm p-4" onClick={onClose}>
      <div className="bg-[#0a0a0a] border-2 border-[#333333] rounded-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto p-6" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-3xl font-bold text-white">Nouvelle Commande</h2>
          <button onClick={onClose} className="p-3 rounded-xl bg-[#1a1a1a] hover:bg-[#262626] text-[#a1a1aa] hover:text-white transition-colors min-w-[64px] min-h-[64px] flex items-center justify-center">
            <X className="w-7 h-7" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div>
            <label className="text-lg text-[#a1a1aa] mb-2 block">Table N&deg;</label>
            <div className="flex gap-2 flex-wrap">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map(n => (
                <button
                  key={n}
                  onClick={() => setTableNumber(n)}
                  className={`min-w-[64px] min-h-[64px] rounded-xl text-2xl font-bold transition-colors
                    ${tableNumber === n ? 'bg-[#0d9488] text-white' : 'bg-[#1a1a1a] text-[#a1a1aa] hover:bg-[#262626]'}`}
                >
                  {n}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="text-lg text-[#a1a1aa] mb-2 block">Serveur</label>
            <input
              value={serverName}
              onChange={e => setServerName(e.target.value)}
              placeholder="Nom du serveur..."
              className="w-full bg-[#1a1a1a] border border-[#333333] rounded-xl px-4 py-3 text-xl text-white placeholder-[#525252] focus:border-[#0d9488] focus:outline-none min-h-[64px] mb-4"
            />

            <label className="text-lg text-[#a1a1aa] mb-2 block">Priorite</label>
            <div className="flex gap-2">
              {(['normal', 'rush', 'vip'] as OrderPriority[]).map(p => (
                <button
                  key={p}
                  onClick={() => setPriority(p)}
                  className={`flex-1 min-h-[64px] rounded-xl text-xl font-bold transition-colors uppercase
                    ${priority === p
                      ? p === 'vip' ? 'bg-[#7c3aed] text-white' : p === 'rush' ? 'bg-[#ef4444] text-white' : 'bg-[#404040] text-white'
                      : 'bg-[#1a1a1a] text-[#71717a] hover:bg-[#262626]'}`}
                >
                  {p === 'vip' && <Star className="w-5 h-5 inline mr-1" />}
                  {p}
                </button>
              ))}
            </div>

            <div className="mt-4">
              <label className="text-lg text-[#a1a1aa] mb-2 block">Notes / Allergies</label>
              <input
                value={notes}
                onChange={e => setNotes(e.target.value)}
                placeholder="Allergies, cuisson speciale..."
                className="w-full bg-[#1a1a1a] border border-[#333333] rounded-xl px-4 py-3 text-xl text-white placeholder-[#525252] focus:border-[#0d9488] focus:outline-none min-h-[64px]"
              />
              {/* Live allergen detection preview */}
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
                    <span className="text-[#a1a1aa] text-lg">{d.prepTime} min</span>
                    <button onClick={() => removeDish(i)} className="p-2 rounded-lg bg-[#ef4444]/10 hover:bg-[#ef4444]/20 text-[#ef4444] min-w-[48px] min-h-[48px] flex items-center justify-center">
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="mb-4">
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Chercher un plat..."
            className="w-full bg-[#1a1a1a] border border-[#333333] rounded-xl px-4 py-3 text-xl text-white placeholder-[#525252] focus:border-[#0d9488] focus:outline-none min-h-[64px]"
          />
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 max-h-[220px] overflow-y-auto mb-6">
          {filtered.map(recipe => (
            <button
              key={recipe.id}
              onClick={() => addDish(recipe)}
              className="text-left p-3 rounded-xl bg-[#1a1a1a] hover:bg-[#262626] border border-[#262626] hover:border-[#0d9488] transition-all min-h-[64px]"
            >
              <div className="text-white font-semibold text-lg truncate">{recipe.name}</div>
              <div className="text-[#71717a] text-sm">{recipe.category} - {(recipe.prepTimeMinutes || 0) + (recipe.cookTimeMinutes || 0)} min</div>
            </button>
          ))}
        </div>

        <button
          onClick={handleSubmit}
          disabled={selectedDishes.length === 0}
          className={`w-full min-h-[72px] rounded-xl text-2xl font-bold transition-colors
            ${selectedDishes.length > 0
              ? 'bg-[#0d9488] hover:bg-[#14b8a6] text-white'
              : 'bg-[#1a1a1a] text-[#525252] cursor-not-allowed'}`}
        >
          Envoyer en cuisine ({selectedDishes.reduce((s, d) => s + d.quantity, 0)} plats)
        </button>
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════
// ██  DISH TIMER DISPLAY  ████████████████████████████████████████████████
// ══════════════════════════════════════════════════════════════════════════
function DishTimer({ dish, now }: { dish: OrderDish; now: number }) {
  if (dish.status === 'servi') return <span className="text-[#525252] font-mono text-xl">--:--</span>;
  if (dish.status === 'pret') return <span className="text-[#34d399] font-mono text-xl font-bold">PRET</span>;

  if (dish.status === 'attente') {
    return <span className="text-[#71717a] font-mono text-xl">{dish.prepTimeMinutes}:00</span>;
  }

  const elapsed = dish.startedAt ? Math.floor((now - dish.startedAt) / 1000) : 0;
  const target = dish.prepTimeMinutes * 60;
  const remaining = target - elapsed;
  const isOvertime = remaining <= 0;

  return (
    <span className={`font-mono text-xl font-bold ${isOvertime ? 'text-[#ef4444] animate-pulse' : remaining < 60 ? 'text-[#fbbf24]' : 'text-[#34d399]'}`}>
      {isOvertime ? '+' : ''}{formatElapsed(Math.abs(remaining))}
    </span>
  );
}

// ══════════════════════════════════════════════════════════════════════════
// ██  PREPARATION TIME ESTIMATOR  ████████████████████████████████████████
// ══════════════════════════════════════════════════════════════════════════
function PrepTimeEstimator({ order, now }: { order: Order; now: number }) {
  const unfinished = order.dishes.filter(d => d.status !== 'pret' && d.status !== 'servi');
  if (unfinished.length === 0) return null;

  // Calculate max remaining time across all unfinished dishes
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
    <div className="px-4 py-1.5 bg-[#1e3a5f]/40 border-t border-[#1e3a5f]/60 flex items-center gap-2">
      <Timer className="w-4 h-4 text-[#60a5fa]" />
      <span className="text-[#60a5fa] text-base font-bold">
        Pret dans ~{mins} min
      </span>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════
// ██  ALLERGEN BANNER (FLASHING)  ████████████████████████████████████████
// ══════════════════════════════════════════════════════════════════════════
function AllergenBanner({ notes }: { notes: string }) {
  const allergens = detectAllergens(notes);
  if (allergens.length === 0) return null;

  return (
    <div className="px-4 py-2 border-t border-[#ef4444]/40" style={{
      animation: 'allergenFlash 1s ease-in-out infinite',
      background: 'linear-gradient(90deg, rgba(239,68,68,0.15) 0%, rgba(239,68,68,0.25) 50%, rgba(239,68,68,0.15) 100%)',
    }}>
      <style>{`
        @keyframes allergenFlash {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.6; }
        }
      `}</style>
      <div className="flex items-center gap-2 flex-wrap">
        <ShieldAlert className="w-5 h-5 text-[#ef4444] animate-bounce" />
        <span className="text-[#ef4444] text-base font-black uppercase tracking-wider">ALLERGENE</span>
        {allergens.map(a => (
          <span key={a} className="px-2 py-0.5 bg-[#ef4444] text-white rounded-md text-sm font-black">
            {a}
          </span>
        ))}
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════
// ██  ORDER CARD (3-column KDS)  ██████████████████████████████████████████
// ══════════════════════════════════════════════════════════════════════════
function OrderCard({
  order, now, column, onDishStatusChange, onDishView, onRemoveOrder, onPrint, isArchiving
}: {
  order: Order;
  now: number;
  column: 'new' | 'preparing' | 'ready';
  onDishStatusChange: (orderId: string, dishId: string) => void;
  onDishView: (recipeId: number) => void;
  onRemoveOrder: (orderId: string) => void;
  onPrint: (order: Order) => void;
  isArchiving?: boolean;
}) {
  const elapsed = Math.floor((now - order.createdAt) / 1000);
  const allServed = order.dishes.every(d => d.status === 'servi');
  const allPretOrServed = order.dishes.every(d => d.status === 'pret' || d.status === 'servi');
  const prio = getPriorityConfig(order.priority);
  const allergens = detectAllergens(order.notes);

  const columnBorder = column === 'new'
    ? getWaitBorder(elapsed)
    : column === 'preparing'
      ? 'border-[#fbbf24]/50'
      : 'border-[#34d399]/50';

  const columnGlow = column === 'new'
    ? getWaitBg(elapsed)
    : column === 'preparing'
      ? 'shadow-[0_0_20px_rgba(251,191,36,0.1)]'
      : 'shadow-[0_0_20px_rgba(52,211,153,0.12)]';

  const readyTimerDisplay = useMemo(() => {
    if (column !== 'ready') return null;
    const lastCompleted = Math.max(...order.dishes.filter(d => d.completedAt).map(d => d.completedAt!));
    if (!lastCompleted || lastCompleted <= 0) return null;
    const waitSecs = Math.floor((now - lastCompleted) / 1000);
    return { seconds: waitSecs, text: formatElapsed(waitSecs) };
  }, [column, order.dishes, now]);

  return (
    <div className={`
      rounded-2xl border-2 overflow-hidden transition-all duration-500
      ${isArchiving ? 'opacity-0 scale-95 translate-y-4' : ''}
      ${allServed ? 'border-[#262626] opacity-40' : `${columnBorder} ${columnGlow}`}
      ${order.priority !== 'normal' && !allServed ? `ring-2 ${prio.ring}` : ''}
      ${allergens.length > 0 && !allServed ? 'ring-2 ring-[#ef4444]/50' : ''}
    `}>
      {/* Card Header */}
      <div className="px-4 py-3 flex items-center justify-between bg-[#0a0a0a]">
        <div className="flex items-center gap-3">
          <div className={`
            w-16 h-16 rounded-xl flex items-center justify-center text-3xl font-black
            ${allPretOrServed && !allServed
              ? 'bg-[#059669] text-white animate-pulse'
              : allServed
                ? 'bg-[#1a1a1a] text-[#525252]'
                : column === 'preparing'
                  ? 'bg-[#78350f] text-[#fbbf24]'
                  : 'bg-[#1a1a1a] text-white'}
          `}>
            {order.tableNumber}
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-2xl font-black text-white">T{order.tableNumber}</span>
              {order.priority !== 'normal' && !allServed && (
                <span className={`px-2 py-0.5 rounded-md ${prio.bg} ${prio.text} text-sm font-black uppercase tracking-wider ${order.priority === 'rush' ? 'animate-pulse' : ''}`}>
                  {order.priority === 'vip' && <Star className="w-3 h-3 inline mr-0.5" />}
                  {prio.label}
                </span>
              )}
              {order.source === 'service-tracker' && (
                <span className="px-2 py-0.5 rounded-md bg-[#1d4ed8]/30 text-[#60a5fa] text-xs font-bold">ST</span>
              )}
            </div>
            <div className="flex items-center gap-3">
              <span className="text-lg text-[#a1a1aa]">
                <Users className="w-4 h-4 inline mr-1" />
                {order.serverName}
              </span>
              <span className={`text-lg font-mono font-bold`} style={{ color: getWaitColor(elapsed) }}>
                <Clock className="w-4 h-4 inline mr-1" />
                {formatElapsed(elapsed)}
              </span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="text-[#71717a] text-lg font-mono">
            {order.dishes.filter(d => d.status === 'pret' || d.status === 'servi').length}/{order.dishes.length}
          </span>
          <button
            onClick={() => onPrint(order)}
            className="p-2 rounded-lg bg-[#1a1a1a] hover:bg-[#262626] text-[#71717a] hover:text-white transition-colors min-w-[48px] min-h-[48px] flex items-center justify-center"
            title="Imprimer ticket"
          >
            <Printer className="w-5 h-5" />
          </button>
          {allServed && (
            <button
              onClick={() => onRemoveOrder(order.id)}
              className="p-2 rounded-lg bg-[#1a1a1a] hover:bg-[#ef4444]/10 text-[#525252] hover:text-[#ef4444] transition-colors min-w-[48px] min-h-[48px] flex items-center justify-center"
            >
              <Trash2 className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>

      {/* Allergen Banner (FLASHING) */}
      {!allServed && <AllergenBanner notes={order.notes} />}

      {/* Notes / Allergies (general) */}
      {order.notes && !allServed && allergens.length === 0 && (
        <div className="px-4 py-2 bg-[#ef4444]/8 border-t border-[#ef4444]/20">
          <span className="text-[#ef4444] text-lg font-bold">
            <AlertTriangle className="w-5 h-5 inline mr-1" />
            {order.notes}
          </span>
        </div>
      )}

      {/* Notes text below allergen banner (when allergens exist) */}
      {order.notes && !allServed && allergens.length > 0 && (
        <div className="px-4 py-2 bg-[#ef4444]/8 border-t border-[#ef4444]/20">
          <span className="text-[#ef4444] text-lg font-bold">
            <AlertTriangle className="w-5 h-5 inline mr-1" />
            {order.notes}
          </span>
        </div>
      )}

      {/* Preparation Time Estimator */}
      {!allServed && !allPretOrServed && (
        <PrepTimeEstimator order={order} now={now} />
      )}

      {/* Ready: pickup timer */}
      {readyTimerDisplay && !allServed && (
        <div className="px-4 py-2 bg-[#059669]/10 border-t border-[#059669]/20 flex items-center justify-between">
          <span className="text-[#34d399] text-lg font-bold">
            <Bell className="w-4 h-4 inline mr-1" />
            Attente pickup
          </span>
          <span className={`font-mono text-xl font-bold ${readyTimerDisplay.seconds > 120 ? 'text-[#ef4444] animate-pulse' : 'text-[#34d399]'}`}>
            {readyTimerDisplay.text}
          </span>
        </div>
      )}

      {/* Dishes */}
      <div className="divide-y divide-[#1a1a1a]">
        {order.dishes.map(dish => {
          const cfg = dishStatusConfig[dish.status];
          const nextStatus: DishStatus | null =
            dish.status === 'attente' ? 'preparation' :
            dish.status === 'preparation' ? 'pret' :
            dish.status === 'pret' ? 'servi' : null;

          return (
            <div
              key={dish.id}
              className={`flex items-center gap-3 px-4 py-3 transition-all
                ${dish.status === 'servi' ? 'bg-[#0a0a0a]/50' : 'bg-black hover:bg-[#0a0a0a]'}`}
            >
              <button
                onClick={() => nextStatus && onDishStatusChange(order.id, dish.id)}
                disabled={!nextStatus}
                className={`
                  min-w-[64px] min-h-[64px] rounded-xl flex items-center justify-center transition-all
                  ${dish.status === 'attente' ? 'bg-[#27272a] hover:bg-[#78350f]/40 text-[#a1a1aa] hover:text-[#fbbf24] active:scale-95' : ''}
                  ${dish.status === 'preparation' ? 'bg-[#78350f]/50 hover:bg-[#064e3b]/50 text-[#fbbf24] hover:text-[#34d399] active:scale-95' : ''}
                  ${dish.status === 'pret' ? 'bg-[#064e3b]/50 hover:bg-[#27272a] text-[#34d399] hover:text-[#a1a1aa] active:scale-95' : ''}
                  ${dish.status === 'servi' ? 'bg-[#0a0a0a] text-[#333333] cursor-default' : ''}
                `}
              >
                {cfg.icon}
              </button>

              <div className="flex-1 min-w-0">
                <div className={`text-2xl font-bold truncate ${dish.status === 'servi' ? 'text-[#525252] line-through' : 'text-white'}`}>
                  {dish.quantity > 1 && <span className="text-[#fbbf24] mr-1">x{dish.quantity}</span>}
                  {dish.recipeName}
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium" style={{ color: cfg.color }}>{cfg.label}</span>
                  {dish.category && (
                    <span className={`text-xs px-1.5 py-0.5 rounded ${isDishHot(dish) ? 'bg-[#78350f]/30 text-[#f97316]' : 'bg-[#1e3a5f]/30 text-[#60a5fa]'}`}>
                      {isDishHot(dish) ? 'CHAUD' : 'FROID'}
                    </span>
                  )}
                </div>
              </div>

              <DishTimer dish={dish} now={now} />

              {dish.recipeId && dish.status !== 'servi' && (
                <button
                  onClick={() => dish.recipeId && onDishView(dish.recipeId)}
                  className="min-w-[48px] min-h-[48px] rounded-lg bg-[#1a1a1a] hover:bg-[#262626] text-[#71717a] hover:text-[#14b8a6] flex items-center justify-center transition-colors"
                >
                  <Eye className="w-5 h-5" />
                </button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════
// ██  COLUMN HEADER  ██████████████████████████████████████████████████████
// ══════════════════════════════════════════════════════════════════════════
function ColumnHeader({ title, count, color, icon }: { title: string; count: number; color: string; icon: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between px-3 py-3 mb-3">
      <div className="flex items-center gap-2">
        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: color }} />
        {icon}
        <span className="text-xl font-bold text-white uppercase tracking-wider">{title}</span>
      </div>
      <span className="text-3xl font-black font-mono" style={{ color }}>{count}</span>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════
// ██  RUSH HOUR BANNER  ██████████████████████████████████████████████████
// ══════════════════════════════════════════════════════════════════════════
function RushHourBanner() {
  return (
    <div className="bg-[#ef4444] px-4 py-2 flex items-center justify-center gap-3 shrink-0" style={{
      animation: 'rushPulse 2s ease-in-out infinite',
    }}>
      <style>{`
        @keyframes rushPulse {
          0%, 100% { background-color: #ef4444; }
          50% { background-color: #dc2626; }
        }
      `}</style>
      <Zap className="w-6 h-6 text-white animate-bounce" />
      <span className="text-white text-2xl font-black uppercase tracking-[0.2em]">RUSH HOUR</span>
      <Zap className="w-6 h-6 text-white animate-bounce" />
      <span className="text-white/80 text-lg font-bold ml-2">Prioritisez les commandes urgentes!</span>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════
// ██  PERFORMANCE STATS MODAL  ████████████████████████████████████████████
// ══════════════════════════════════════════════════════════════════════════
function PerformanceStatsModal({ stats, orders, onClose }: { stats: DailyStats; orders: Order[]; onClose: () => void }) {
  // Average prep time by dish category
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
      category: cat,
      avgSeconds: Math.round(data.total / data.count),
      count: data.count,
    })).sort((a, b) => b.avgSeconds - a.avgSeconds);
  }, [orders]);

  // Peak hours (last 24h)
  const hourlyData = useMemo(() => {
    const hours: Record<number, number> = {};
    for (let h = 0; h < 24; h++) hours[h] = 0;
    // Count from stats
    if (stats.hourlyOrders) {
      for (const [h, count] of Object.entries(stats.hourlyOrders)) {
        hours[Number(h)] = count;
      }
    }
    // Also count current orders
    for (const order of orders) {
      const h = new Date(order.createdAt).getHours();
      hours[h] = (hours[h] || 0) + 1;
    }
    const maxCount = Math.max(...Object.values(hours), 1);
    return { hours, maxCount };
  }, [stats, orders]);

  // Fastest / slowest dish
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
    ? Math.round(stats.totalPrepTimes.reduce((a, b) => a + b, 0) / stats.totalPrepTimes.length)
    : 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-sm p-4" onClick={onClose}>
      <div className="bg-[#0a0a0a] border-2 border-[#333333] rounded-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto p-6" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <BarChart3 className="w-8 h-8 text-[#14b8a6]" />
            <h2 className="text-3xl font-bold text-white">Performance du jour</h2>
          </div>
          <button onClick={onClose} className="p-3 rounded-xl bg-[#1a1a1a] hover:bg-[#262626] text-[#a1a1aa] hover:text-white transition-colors min-w-[64px] min-h-[64px] flex items-center justify-center">
            <X className="w-7 h-7" />
          </button>
        </div>

        {/* Key metrics row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
          <div className="bg-[#1a1a1a] rounded-xl p-4 text-center">
            <div className="text-4xl font-black text-[#22c55e] font-mono">{stats.platsServis}</div>
            <div className="text-sm text-[#a1a1aa] mt-1">Plats servis</div>
          </div>
          <div className="bg-[#1a1a1a] rounded-xl p-4 text-center">
            <div className="text-4xl font-black text-[#14b8a6] font-mono">{formatElapsed(avgTime)}</div>
            <div className="text-sm text-[#a1a1aa] mt-1">Temps moyen</div>
          </div>
          <div className="bg-[#1a1a1a] rounded-xl p-4 text-center">
            <div className="text-4xl font-black text-[#fbbf24] font-mono">{orders.filter(o => !o.dishes.every(d => d.status === 'servi')).length}</div>
            <div className="text-sm text-[#a1a1aa] mt-1">Commandes actives</div>
          </div>
          <div className="bg-[#1a1a1a] rounded-xl p-4 text-center">
            <div className="text-4xl font-black text-[#a78bfa] font-mono">{stats.revenueToday > 0 ? `${stats.revenueToday.toFixed(0)}` : '--'}</div>
            <div className="text-sm text-[#a1a1aa] mt-1">Revenue est. (EUR)</div>
          </div>
        </div>

        {/* Peak hours graph */}
        <div className="mb-8">
          <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-[#f97316]" />
            Heures de pointe
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
                    <div
                      className={`w-full rounded-t transition-all ${isPeak ? 'bg-[#ef4444]' : isNow ? 'bg-[#14b8a6]' : count > 0 ? 'bg-[#404040]' : 'bg-[#262626]'}`}
                      style={{ height: `${height}%`, minHeight: '4px' }}
                    />
                    {(h % 3 === 0) && (
                      <span className="text-[10px] text-[#525252]">{h}h</span>
                    )}
                  </div>
                );
              })}
            </div>
            <div className="flex items-center gap-4 mt-3 text-xs text-[#71717a]">
              <span className="flex items-center gap-1"><div className="w-2 h-2 rounded bg-[#14b8a6]" /> Heure actuelle</span>
              <span className="flex items-center gap-1"><div className="w-2 h-2 rounded bg-[#ef4444]" /> Rush ({'>='}{RUSH_THRESHOLD} cmd)</span>
            </div>
          </div>
        </div>

        {/* Prep time by category */}
        {categoryTimes.length > 0 && (
          <div className="mb-8">
            <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              <Clock className="w-5 h-5 text-[#fbbf24]" />
              Temps moyen par categorie
            </h3>
            <div className="space-y-2">
              {categoryTimes.map(ct => (
                <div key={ct.category} className="flex items-center gap-3 bg-[#1a1a1a] rounded-xl px-4 py-3">
                  <span className="text-lg text-white font-semibold flex-1 capitalize">{ct.category}</span>
                  <span className="text-sm text-[#71717a]">{ct.count} plats</span>
                  <div className="w-32 h-3 bg-[#262626] rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full bg-[#fbbf24] transition-all"
                      style={{ width: `${Math.min(100, (ct.avgSeconds / (categoryTimes[0]?.avgSeconds || 1)) * 100)}%` }}
                    />
                  </div>
                  <span className="text-lg font-mono font-bold text-[#fbbf24] w-20 text-right">{formatElapsed(ct.avgSeconds)}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Fastest / Slowest */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {fastSlow.fastest && (
            <div className="bg-[#064e3b]/30 border border-[#064e3b]/50 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <Award className="w-5 h-5 text-[#34d399]" />
                <span className="text-lg font-bold text-[#34d399]">Plus rapide</span>
              </div>
              <div className="text-xl text-white font-semibold truncate">{fastSlow.fastest.name}</div>
              <div className="text-2xl font-mono font-black text-[#34d399]">{formatElapsed(Math.round(fastSlow.fastest.seconds))}</div>
            </div>
          )}
          {fastSlow.slowest && (
            <div className="bg-[#7f1d1d]/30 border border-[#7f1d1d]/50 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <AlertTriangle className="w-5 h-5 text-[#f97316]" />
                <span className="text-lg font-bold text-[#f97316]">Plus lent</span>
              </div>
              <div className="text-xl text-white font-semibold truncate">{fastSlow.slowest.name}</div>
              <div className="text-2xl font-mono font-black text-[#f97316]">{formatElapsed(Math.round(fastSlow.slowest.seconds))}</div>
            </div>
          )}
        </div>

        {(! fastSlow.fastest && !fastSlow.slowest) && (
          <div className="text-center text-[#525252] text-lg py-4">
            Aucune donnee de preparation encore. Les stats s'afficheront apres les premiers plats servis.
          </div>
        )}
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════
// ██  STATS BAR (clickable for modal)  ████████████████████████████████████
// ══════════════════════════════════════════════════════════════════════════
function StatsBar({ orders, stats, archivedCount, onOpenStats }: { orders: Order[]; stats: DailyStats; archivedCount: number; onOpenStats: () => void }) {
  const enAttente = orders.reduce((sum, o) => sum + o.dishes.filter(d => d.status === 'attente').length, 0);
  const enPrep = orders.reduce((sum, o) => sum + o.dishes.filter(d => d.status === 'preparation').length, 0);
  const prets = orders.reduce((sum, o) => sum + o.dishes.filter(d => d.status === 'pret').length, 0);
  const avgTime = stats.totalPrepTimes.length > 0
    ? Math.round(stats.totalPrepTimes.reduce((a, b) => a + b, 0) / stats.totalPrepTimes.length)
    : 0;
  const activeOrders = orders.filter(o => !o.dishes.every(d => d.status === 'servi')).length;

  return (
    <div
      className="bg-[#0a0a0a] border-t-2 border-[#262626] px-6 py-3 shrink-0 cursor-pointer hover:bg-[#111111] transition-colors"
      onClick={onOpenStats}
      title="Cliquer pour voir les stats detaillees"
    >
      <div className="flex items-center justify-between gap-4 max-w-full overflow-x-auto">
        <div className="flex items-center gap-2 shrink-0">
          <div className="w-3 h-3 rounded-full bg-[#22c55e]" />
          <span className="text-[#a1a1aa] text-lg">Servis</span>
          <span className="text-white text-2xl font-black font-mono">{stats.platsServis}</span>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <div className="w-3 h-3 rounded-full bg-[#fbbf24]" />
          <span className="text-[#a1a1aa] text-lg">En prep</span>
          <span className="text-[#fbbf24] text-2xl font-black font-mono">{enPrep}</span>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <div className="w-3 h-3 rounded-full bg-[#71717a]" />
          <span className="text-[#a1a1aa] text-lg">En file</span>
          <span className="text-white text-2xl font-black font-mono">{enAttente}</span>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <div className="w-3 h-3 rounded-full bg-[#34d399]" />
          <span className="text-[#a1a1aa] text-lg">Prets</span>
          <span className="text-[#34d399] text-2xl font-black font-mono">{prets}</span>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <Clock className="w-5 h-5 text-[#71717a]" />
          <span className="text-[#a1a1aa] text-lg">Temps moy.</span>
          <span className="text-white text-2xl font-black font-mono">{formatElapsed(avgTime)}</span>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <ChefHat className="w-5 h-5 text-[#71717a]" />
          <span className="text-[#a1a1aa] text-lg">Actives</span>
          <span className="text-white text-2xl font-black font-mono">{activeOrders}</span>
        </div>
        {archivedCount > 0 && (
          <div className="flex items-center gap-2 shrink-0">
            <Archive className="w-5 h-5 text-[#525252]" />
            <span className="text-[#525252] text-lg">{archivedCount} archivees</span>
          </div>
        )}
        <div className="flex items-center gap-1 shrink-0">
          <BarChart3 className="w-5 h-5 text-[#14b8a6]" />
          <span className="text-[#14b8a6] text-sm font-bold">STATS</span>
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
          if (targetMinutes > 0 && next >= targetMinutes * 60) {
            setAlarm(true);
            setRunning(false);
          }
          return next;
        });
      }, 1000);
    }
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [running, targetMinutes, alarm]);

  const reset = () => {
    setSeconds(0);
    setRunning(false);
    setAlarm(false);
    if (intervalRef.current) clearInterval(intervalRef.current);
  };

  const presets = [1, 3, 5, 10, 15, 20];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-sm p-4" onClick={onClose}>
      <div className={`bg-[#0a0a0a] border-2 rounded-2xl p-8 w-full max-w-md ${alarm ? 'border-[#ef4444] animate-pulse' : 'border-[#333333]'}`} onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <Timer className="w-8 h-8 text-[#14b8a6]" />
            <span className="text-2xl font-bold text-white">Timer Cuisine</span>
          </div>
          <button onClick={onClose} className="p-3 rounded-xl bg-[#1a1a1a] hover:bg-[#262626] text-[#a1a1aa] hover:text-white min-w-[64px] min-h-[64px] flex items-center justify-center">
            <X className="w-7 h-7" />
          </button>
        </div>

        <div className={`text-8xl font-mono font-black text-center py-6 ${alarm ? 'text-[#ef4444]' : 'text-white'}`}>
          {formatElapsed(seconds)}
        </div>

        {alarm && (
          <div className="text-center text-[#ef4444] font-black text-3xl mb-6 animate-bounce">
            TEMPS ECOULE !
          </div>
        )}

        <div className="flex flex-wrap gap-2 mb-6 justify-center">
          {presets.map(m => (
            <button
              key={m}
              onClick={() => { setTargetMinutes(m); reset(); }}
              className={`min-w-[64px] min-h-[64px] rounded-xl text-xl font-bold transition-colors
                ${targetMinutes === m ? 'bg-[#0d9488] text-white' : 'bg-[#1a1a1a] text-[#a1a1aa] hover:bg-[#262626]'}`}
            >
              {m}m
            </button>
          ))}
        </div>

        <div className="flex gap-3 justify-center">
          <button
            onClick={() => { setAlarm(false); setRunning(r => !r); }}
            className="flex items-center gap-2 px-8 min-h-[64px] rounded-xl text-xl font-bold bg-[#0d9488] hover:bg-[#14b8a6] text-white transition-colors"
          >
            {running ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6" />}
            {running ? 'Pause' : 'Lancer'}
          </button>
          <button
            onClick={reset}
            className="flex items-center gap-2 px-6 min-h-[64px] rounded-xl text-xl font-bold bg-[#1a1a1a] hover:bg-[#262626] text-[#a1a1aa] transition-colors"
          >
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

  const time = new Date(order.createdAt).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
  const prio = order.priority !== 'normal' ? `*** ${order.priority.toUpperCase()} ***` : '';
  const allergens = detectAllergens(order.notes);

  const dishLines = order.dishes.map(d =>
    `<tr><td style="font-size:18px;padding:4px 0;font-weight:bold;">${d.quantity > 1 ? `x${d.quantity} ` : ''}${d.recipeName}</td></tr>`
  ).join('');

  const allergenLine = allergens.length > 0
    ? `<div class="allergen">!! ALLERGENES: ${allergens.join(', ')} !!</div>`
    : '';

  win.document.write(`
    <html><head><title>Ticket Cuisine</title>
    <style>
      body { font-family: monospace; padding: 10px; margin: 0; color: #000; background: #fff; }
      h1 { text-align: center; font-size: 24px; margin: 5px 0; border-bottom: 2px dashed #000; padding-bottom: 8px; }
      .prio { text-align: center; font-size: 20px; font-weight: bold; color: red; margin: 5px 0; }
      .info { font-size: 14px; margin: 4px 0; }
      .notes { font-size: 16px; font-weight: bold; color: red; background: #fee; padding: 6px; margin: 8px 0; border: 1px solid red; }
      .allergen { font-size: 18px; font-weight: bold; color: red; background: #fee; padding: 8px; margin: 8px 0; border: 2px solid red; text-align: center; }
      table { width: 100%; border-collapse: collapse; }
      .footer { text-align: center; font-size: 12px; margin-top: 10px; border-top: 2px dashed #000; padding-top: 8px; }
    </style></head><body>
    <h1>TABLE ${order.tableNumber}</h1>
    ${prio ? `<div class="prio">${prio}</div>` : ''}
    <div class="info">Heure: ${time}</div>
    <div class="info">Serveur: ${order.serverName}</div>
    ${allergenLine}
    ${order.notes ? `<div class="notes">!! ${order.notes} !!</div>` : ''}
    <table>${dishLines}</table>
    <div class="footer">RestauMargin KDS</div>
    </body></html>
  `);
  win.document.close();
  setTimeout(() => { win.print(); }, 300);
}

// ══════════════════════════════════════════════════════════════════════════
// ██  MAIN PAGE  ██████████████████████████████████████████████████████████
// ══════════════════════════════════════════════════════════════════════════
export default function KitchenMode() {
  const navigate = useNavigate();
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
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
  const [splitMode, setSplitMode] = useState<KitchenZone>(() => {
    try { return (localStorage.getItem(KITCHEN_SPLIT_KEY) as KitchenZone) || 'all'; } catch { return 'all'; }
  });
  const [stats, setStats] = useState<DailyStats>({ platsServis: 0, tempsMoyenSeconds: 0, totalPrepTimes: [], dishPrepTimes: {}, hourlyOrders: {}, revenueToday: 0 });
  const [loaded, setLoaded] = useState(false);
  const [isDimmed, setIsDimmed] = useState(false);
  const [archivedCount, setArchivedCount] = useState(0);
  const [archivingIds, setArchivingIds] = useState<Set<string>>(new Set());
  const [orderTimestamps, setOrderTimestamps] = useState<OrderTimestamp[]>([]);
  const dimTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const prevOrderCountRef = useRef(0);
  const prevReadyCountRef = useRef(0);
  const prevReadyTablesRef = useRef<Set<string>>(new Set());

  // ── Load recipes ──────────────────────────────────────────────────
  useEffect(() => {
    fetchRecipes().then(setRecipes).catch(() => {});
  }, []);

  // ── Load persisted orders & stats ─────────────────────────────────
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
      }
      const savedOrders = localStorage.getItem(STORAGE_KEY);
      if (savedOrders) setOrders(JSON.parse(savedOrders));
      const savedStats = localStorage.getItem(STATS_KEY);
      if (savedStats) {
        const parsed = JSON.parse(savedStats);
        setStats({
          platsServis: parsed.platsServis || 0,
          tempsMoyenSeconds: parsed.tempsMoyenSeconds || 0,
          totalPrepTimes: parsed.totalPrepTimes || [],
          dishPrepTimes: parsed.dishPrepTimes || {},
          hourlyOrders: parsed.hourlyOrders || {},
          revenueToday: parsed.revenueToday || 0,
        });
      }
      const savedSound = localStorage.getItem(KITCHEN_SOUND_KEY);
      if (savedSound !== null) setSoundEnabled(savedSound === 'true');
      const savedArchived = localStorage.getItem(KITCHEN_ARCHIVE_KEY);
      if (savedArchived) setArchivedCount(Number(savedArchived) || 0);
      const savedTimestamps = localStorage.getItem(KITCHEN_ORDER_TIMESTAMPS_KEY);
      if (savedTimestamps) setOrderTimestamps(JSON.parse(savedTimestamps));
    } catch {}
    setLoaded(true);
  }, []);

  // ── Persist orders ────────────────────────────────────────────────
  useEffect(() => {
    if (!loaded) return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(orders));
  }, [orders, loaded]);

  // ── Persist stats ─────────────────────────────────────────────────
  useEffect(() => {
    if (!loaded) return;
    localStorage.setItem(STATS_KEY, JSON.stringify(stats));
  }, [stats, loaded]);

  // ── Persist preferences ───────────────────────────────────────────
  useEffect(() => {
    localStorage.setItem(KITCHEN_SOUND_KEY, String(soundEnabled));
  }, [soundEnabled]);

  useEffect(() => {
    localStorage.setItem(KITCHEN_VOICE_KEY, String(voiceEnabled));
  }, [voiceEnabled]);

  useEffect(() => {
    localStorage.setItem(KITCHEN_SPLIT_KEY, splitMode);
  }, [splitMode]);

  useEffect(() => {
    if (!loaded) return;
    localStorage.setItem(KITCHEN_ARCHIVE_KEY, String(archivedCount));
  }, [archivedCount, loaded]);

  useEffect(() => {
    if (!loaded) return;
    localStorage.setItem(KITCHEN_ORDER_TIMESTAMPS_KEY, JSON.stringify(orderTimestamps));
  }, [orderTimestamps, loaded]);

  // ── Live clock tick ───────────────────────────────────────────────
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
      if (active && allPretOrServed) {
        readyTables.add(o.id);
      }
    }

    if (loaded) {
      // Find newly ready orders
      for (const id of readyTables) {
        if (!prevReadyTablesRef.current.has(id)) {
          if (soundEnabled) playReadySound();
          // Voice announcement
          if (voiceEnabled) {
            const order = orders.find(o => o.id === id);
            if (order) announceReady(order.tableNumber);
          }
        }
      }
    }
    prevReadyTablesRef.current = readyTables;
  }, [orders, loaded, soundEnabled, voiceEnabled]);

  // ── Auto-Archive: fade out served orders after 30s ────────────────
  useEffect(() => {
    if (!loaded) return;
    const interval = setInterval(() => {
      const nowMs = Date.now();
      setOrders(prev => {
        const toArchive: string[] = [];
        for (const order of prev) {
          const allServed = order.dishes.every(d => d.status === 'servi');
          if (allServed) {
            const lastServed = Math.max(...order.dishes.filter(d => d.servedAt).map(d => d.servedAt!));
            if (lastServed > 0 && (nowMs - lastServed) > AUTO_ARCHIVE_DELAY) {
              toArchive.push(order.id);
            }
          }
        }
        if (toArchive.length === 0) return prev;

        // Start fade animation
        setArchivingIds(prevIds => {
          const next = new Set(prevIds);
          toArchive.forEach(id => next.add(id));
          return next;
        });

        // Actually remove after animation
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

  // ── Rush Hour Detection ───────────────────────────────────────────
  const isRushHour = useMemo(() => {
    const cutoff = now - RUSH_WINDOW_MS;
    // Count orders created in the last 10 minutes
    const recentOrders = orders.filter(o => o.createdAt > cutoff).length;
    // Also count from timestamps
    const recentTimestamps = orderTimestamps.filter(t => t.time > cutoff).length;
    return Math.max(recentOrders, recentTimestamps) >= RUSH_THRESHOLD;
  }, [orders, orderTimestamps, now]);

  // ── Auto-dim after inactivity ─────────────────────────────────────
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

  // ── Fullscreen API ────────────────────────────────────────────────
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

  // ── ServiceTracker integration: poll for new orders ───────────────
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
              const alreadyExists = updated.some(o =>
                o.source === 'service-tracker' && o.dishes.some(d => d.id === `st-${so.id}`)
              );
              if (alreadyExists) continue;

              let existingOrder = updated.find(o =>
                o.source === 'service-tracker' && o.tableNumber === tbl &&
                !o.dishes.every(d => d.status === 'servi')
              );

              const newDish: OrderDish = {
                id: `st-${so.id}`,
                recipeName: so.recipeName,
                recipeId: so.recipeId,
                quantity: so.quantity || 1,
                status: 'attente',
                prepTimeMinutes: 10,
                startedAt: null,
                completedAt: null,
                servedAt: null,
                category: so.category || 'plat',
              };

              if (existingOrder) {
                updated = updated.map(o =>
                  o.id === existingOrder!.id
                    ? { ...o, dishes: [...o.dishes, newDish] }
                    : o
                );
              } else {
                updated.push({
                  id: uid(),
                  tableNumber: tbl,
                  serverName: 'Service',
                  createdAt: so.timestamp || Date.now(),
                  notes: '',
                  priority: 'normal',
                  source: 'service-tracker',
                  dishes: [newDish],
                });
              }
            }
          }
          return updated;
        });
      } catch {}
    }, 3000);

    return () => clearInterval(pollInterval);
  }, []);

  // ── Load speech synthesis voices on mount ─────────────────────────
  useEffect(() => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.getVoices();
    }
  }, []);

  // ── Actions ───────────────────────────────────────────────────────
  const addDemoOrders = useCallback(() => {
    const newOrders = generateDemoOrders(recipes);
    setOrders(prev => [...prev, ...newOrders]);
    // Track timestamps for rush detection
    setOrderTimestamps(prev => [...prev, ...newOrders.map(() => ({ time: Date.now() }))]);
    // Track hourly
    const hour = new Date().getHours();
    setStats(prev => ({
      ...prev,
      hourlyOrders: { ...prev.hourlyOrders, [hour]: (prev.hourlyOrders[hour] || 0) + newOrders.length },
    }));
  }, [recipes]);

  const addOrder = useCallback((order: Order) => {
    setOrders(prev => [...prev, order]);
    // Track for rush detection
    setOrderTimestamps(prev => [...prev, { time: Date.now() }]);
    // Track hourly
    const hour = new Date().getHours();
    setStats(prev => ({
      ...prev,
      hourlyOrders: { ...prev.hourlyOrders, [hour]: (prev.hourlyOrders[hour] || 0) + 1 },
    }));
  }, []);

  const removeOrder = useCallback((orderId: string) => {
    setOrders(prev => prev.filter(o => o.id !== orderId));
  }, []);

  const cycleDishStatus = useCallback((orderId: string, dishId: string) => {
    setOrders(prev => prev.map(order => {
      if (order.id !== orderId) return order;
      return {
        ...order,
        dishes: order.dishes.map(dish => {
          if (dish.id !== dishId) return dish;
          if (dish.status === 'attente') {
            return { ...dish, status: 'preparation' as DishStatus, startedAt: Date.now() };
          }
          if (dish.status === 'preparation') {
            const completedAt = Date.now();
            if (dish.startedAt) {
              const prepDuration = Math.floor((completedAt - dish.startedAt) / 1000);
              setStats(prev => {
                const cat = dish.category || 'autre';
                const catTimes = { ...prev.dishPrepTimes };
                if (!catTimes[cat]) catTimes[cat] = [];
                catTimes[cat] = [...catTimes[cat], prepDuration];
                return {
                  ...prev,
                  totalPrepTimes: [...prev.totalPrepTimes, prepDuration],
                  dishPrepTimes: catTimes,
                };
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
    const servedCount = orders.filter(o => o.dishes.every(d => d.status === 'servi')).length;
    setOrders(prev => prev.filter(o => !o.dishes.every(d => d.status === 'servi')));
    setArchivedCount(c => c + servedCount);
  }, [orders]);

  // ── Recipe view ───────────────────────────────────────────────────
  const recipeToView = viewRecipeId ? recipes.find(r => r.id === viewRecipeId) : null;

  // ── 3-column split (with zone filtering for split screen) ─────────
  const { newOrders, preparingOrders, readyOrders } = useMemo(() => {
    let active = orders.filter(o => !o.dishes.every(d => d.status === 'servi'));

    // Sort: VIP first, then rush, then by time (oldest first)
    const sort = (arr: Order[]) => [...arr].sort((a, b) => {
      const prioWeight = { vip: 0, rush: 1, normal: 2 };
      if (prioWeight[a.priority] !== prioWeight[b.priority]) return prioWeight[a.priority] - prioWeight[b.priority];
      return a.createdAt - b.createdAt;
    });

    const n: Order[] = [];
    const p: Order[] = [];
    const r: Order[] = [];

    for (const o of active) {
      const col = getOrderColumn(o);
      if (col === 'new') n.push(o);
      else if (col === 'preparing') p.push(o);
      else r.push(o);
    }

    return { newOrders: sort(n), preparingOrders: sort(p), readyOrders: sort(r) };
  }, [orders]);

  // ── Split screen zone filtering ───────────────────────────────────
  const filterOrdersByZone = useCallback((orderList: Order[], zone: KitchenZone): Order[] => {
    if (zone === 'all') return orderList;
    return orderList.map(order => {
      const filteredDishes = order.dishes.filter(dish =>
        zone === 'hot' ? isDishHot(dish) : isDishCold(dish)
      );
      if (filteredDishes.length === 0) return null;
      return { ...order, dishes: filteredDishes };
    }).filter(Boolean) as Order[];
  }, []);

  const hasAnyOrders = orders.length > 0;
  const hasServed = orders.some(o => o.dishes.every(d => d.status === 'servi'));

  // Split screen render
  const renderColumn = (title: string, count: number, color: string, icon: React.ReactNode, ordersList: Order[], column: 'new' | 'preparing' | 'ready', emptyMsg: string) => (
    <div className="flex flex-col overflow-hidden">
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
            isArchiving={archivingIds.has(order.id)}
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
    <div className={`min-h-screen bg-black text-white flex flex-col select-none transition-opacity duration-700 ${isDimmed ? 'opacity-30' : 'opacity-100'}`}
         onClick={() => isDimmed && resetDimTimer()}>

      {/* ── RUSH HOUR BANNER ──────────────────────────────────────── */}
      {isRushHour && <RushHourBanner />}

      {/* ── TOP BAR ─────────────────────────────────────────────────── */}
      <div className="bg-[#0a0a0a] border-b-2 border-[#262626] px-4 py-2 shrink-0">
        <div className="flex items-center gap-3">
          {!isFullscreen && (
            <button
              onClick={() => navigate('/dashboard')}
              className="min-w-[64px] min-h-[64px] rounded-xl bg-[#1a1a1a] hover:bg-[#262626] text-[#a1a1aa] hover:text-white flex items-center justify-center transition-colors shrink-0"
            >
              <ArrowLeft className="w-6 h-6" />
            </button>
          )}

          <div className="flex items-center gap-3 shrink-0">
            <ChefHat className="w-10 h-10 text-[#14b8a6]" />
            <div>
              <h1 className="text-2xl font-black text-white tracking-wider hidden sm:block">CUISINE KDS</h1>
              <p className="text-sm text-[#71717a] hidden lg:block">Kitchen Display System</p>
            </div>
          </div>

          <div className="flex items-center gap-2 ml-auto shrink-0">
            <div className="text-4xl font-mono font-black text-[#14b8a6]">
              {new Date(now).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => setShowNewOrder(true)}
              className="min-w-[64px] min-h-[64px] rounded-xl bg-[#0d9488] hover:bg-[#14b8a6] text-white flex items-center justify-center gap-2 px-4 transition-colors"
            >
              <Plus className="w-6 h-6" />
              <span className="hidden sm:inline text-lg font-bold">Commande</span>
            </button>

            {!hasAnyOrders && (
              <button
                onClick={addDemoOrders}
                className="min-w-[64px] min-h-[64px] rounded-xl bg-[#78350f]/50 hover:bg-[#78350f]/70 text-[#fbbf24] flex items-center justify-center gap-2 px-4 transition-colors"
              >
                <Flame className="w-5 h-5" />
                <span className="hidden sm:inline text-lg font-bold">Demo</span>
              </button>
            )}

            <button
              onClick={() => setShowTimer(true)}
              className="min-w-[64px] min-h-[64px] rounded-xl bg-[#1a1a1a] hover:bg-[#262626] text-[#a1a1aa] hover:text-white flex items-center justify-center transition-colors"
            >
              <Timer className="w-6 h-6" />
            </button>

            {/* Split Screen Mode Toggle */}
            <button
              onClick={() => setSplitMode(m => m === 'all' ? 'hot' : m === 'hot' ? 'cold' : 'all')}
              className={`min-w-[64px] min-h-[64px] rounded-xl flex items-center justify-center transition-colors relative
                ${splitMode !== 'all'
                  ? splitMode === 'hot'
                    ? 'bg-[#f97316]/20 text-[#f97316] hover:bg-[#f97316]/30'
                    : 'bg-[#60a5fa]/20 text-[#60a5fa] hover:bg-[#60a5fa]/30'
                  : 'bg-[#1a1a1a] text-[#a1a1aa] hover:bg-[#262626]'}`}
              title={splitMode === 'all' ? 'Activer split screen' : splitMode === 'hot' ? 'Zone chaude' : 'Zone froide'}
            >
              <SplitSquareHorizontal className="w-6 h-6" />
              {splitMode !== 'all' && (
                <span className="absolute -top-1 -right-1 text-[10px] font-black px-1.5 py-0.5 rounded-full bg-[#1a1a1a] border border-current">
                  {splitMode === 'hot' ? 'HOT' : 'COLD'}
                </span>
              )}
            </button>

            {/* Voice toggle */}
            <button
              onClick={() => setVoiceEnabled(v => !v)}
              className={`min-w-[64px] min-h-[64px] rounded-xl flex items-center justify-center transition-colors
                ${voiceEnabled ? 'bg-[#a78bfa]/20 text-[#a78bfa] hover:bg-[#a78bfa]/30' : 'bg-[#1a1a1a] text-[#525252] hover:bg-[#262626]'}`}
              title={voiceEnabled ? 'Annonces vocales: ON' : 'Annonces vocales: OFF'}
            >
              {voiceEnabled ? <Megaphone className="w-6 h-6" /> : <MicOff className="w-6 h-6" />}
            </button>

            <button
              onClick={() => setSoundEnabled(s => !s)}
              className={`min-w-[64px] min-h-[64px] rounded-xl flex items-center justify-center transition-colors
                ${soundEnabled ? 'bg-[#0d9488]/20 text-[#14b8a6] hover:bg-[#0d9488]/30' : 'bg-[#1a1a1a] text-[#525252] hover:bg-[#262626]'}`}
            >
              {soundEnabled ? <Volume2 className="w-6 h-6" /> : <VolumeX className="w-6 h-6" />}
            </button>

            {hasServed && (
              <button
                onClick={clearServed}
                className="min-w-[64px] min-h-[64px] rounded-xl bg-[#1a1a1a] hover:bg-[#ef4444]/10 text-[#71717a] hover:text-[#ef4444] flex items-center justify-center transition-colors"
                title="Supprimer les commandes servies"
              >
                <Trash2 className="w-6 h-6" />
              </button>
            )}

            <button
              onClick={toggleFullscreen}
              className="min-w-[64px] min-h-[64px] rounded-xl bg-[#1a1a1a] hover:bg-[#262626] text-[#a1a1aa] hover:text-white flex items-center justify-center transition-colors"
            >
              {isFullscreen ? <Minimize2 className="w-6 h-6" /> : <Maximize2 className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Split mode indicator bar */}
        {splitMode !== 'all' && (
          <div className="flex items-center gap-3 mt-2 pb-1">
            <button
              onClick={() => setSplitMode('hot')}
              className={`flex-1 py-2 rounded-lg text-lg font-bold transition-all ${splitMode === 'hot' ? 'bg-[#f97316]/20 text-[#f97316] border border-[#f97316]/40' : 'bg-[#1a1a1a] text-[#525252]'}`}
            >
              <Flame className="w-4 h-4 inline mr-1" />
              CUISINE CHAUDE (Plats)
            </button>
            <button
              onClick={() => setSplitMode('cold')}
              className={`flex-1 py-2 rounded-lg text-lg font-bold transition-all ${splitMode === 'cold' ? 'bg-[#60a5fa]/20 text-[#60a5fa] border border-[#60a5fa]/40' : 'bg-[#1a1a1a] text-[#525252]'}`}
            >
              <UtensilsCrossed className="w-4 h-4 inline mr-1" />
              CUISINE FROIDE (Entrees/Desserts)
            </button>
            <button
              onClick={() => setSplitMode('all')}
              className="px-4 py-2 rounded-lg text-sm font-bold bg-[#1a1a1a] text-[#71717a] hover:text-white transition-colors"
            >
              <X className="w-4 h-4 inline" />
            </button>
          </div>
        )}
      </div>

      {/* ── 3-COLUMN KDS BOARD ──────────────────────────────────────── */}
      <div className="flex-1 overflow-hidden">
        {!hasAnyOrders ? (
          <div className="flex flex-col items-center justify-center h-full gap-6 py-20">
            <ChefHat className="w-28 h-28 text-[#262626]" />
            <p className="text-3xl text-[#525252] font-black">Aucune commande en cours</p>
            <p className="text-xl text-[#404040]">Ajoutez une commande ou chargez des donnees demo</p>
            <div className="flex gap-4">
              <button
                onClick={() => setShowNewOrder(true)}
                className="min-h-[64px] px-8 rounded-xl bg-[#0d9488] hover:bg-[#14b8a6] text-white text-xl font-bold transition-colors"
              >
                <Plus className="w-6 h-6 inline mr-2" />
                Nouvelle Commande
              </button>
              <button
                onClick={addDemoOrders}
                className="min-h-[64px] px-8 rounded-xl bg-[#1a1a1a] hover:bg-[#262626] text-[#a1a1aa] text-xl font-bold transition-colors"
              >
                <Flame className="w-5 h-5 inline mr-2" />
                Charger des donnees demo
              </button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 h-full">
            {/* LEFT: NEW ORDERS */}
            <div className="border-r-0 lg:border-r-2 border-[#1a1a1a] flex flex-col overflow-hidden">
              {renderColumn(
                'Nouvelles',
                filterOrdersByZone(newOrders, splitMode).length,
                '#ef4444',
                <Clock className="w-5 h-5 text-[#ef4444]" />,
                filterOrdersByZone(newOrders, splitMode),
                'new',
                'Aucune commande en attente'
              )}
            </div>

            {/* CENTER: IN PREPARATION */}
            <div className="border-r-0 lg:border-r-2 border-[#1a1a1a] flex flex-col overflow-hidden">
              {renderColumn(
                'En preparation',
                filterOrdersByZone(preparingOrders, splitMode).length,
                '#fbbf24',
                <Flame className="w-5 h-5 text-[#fbbf24]" />,
                filterOrdersByZone(preparingOrders, splitMode),
                'preparing',
                'Rien en preparation'
              )}
            </div>

            {/* RIGHT: READY TO SERVE */}
            <div className="flex flex-col overflow-hidden">
              {renderColumn(
                'Prets a servir',
                filterOrdersByZone(readyOrders, splitMode).length,
                '#34d399',
                <CheckCircle2 className="w-5 h-5 text-[#34d399]" />,
                filterOrdersByZone(readyOrders, splitMode),
                'ready',
                'Aucun plat pret'
              )}
            </div>
          </div>
        )}
      </div>

      {/* ── STATS BAR ───────────────────────────────────────────────── */}
      <StatsBar orders={orders} stats={stats} archivedCount={archivedCount} onOpenStats={() => setShowStats(true)} />

      {/* ── MODALS ──────────────────────────────────────────────────── */}
      {showNewOrder && (
        <NewOrderModal
          recipes={recipes}
          onAdd={addOrder}
          onClose={() => setShowNewOrder(false)}
        />
      )}

      {showTimer && (
        <StandaloneTimer onClose={() => setShowTimer(false)} />
      )}

      {showStats && (
        <PerformanceStatsModal
          stats={stats}
          orders={orders}
          onClose={() => setShowStats(false)}
        />
      )}

      {recipeToView && (
        <RecipeQuickView
          recipe={recipeToView}
          onClose={() => setViewRecipeId(null)}
        />
      )}
    </div>
  );
}
