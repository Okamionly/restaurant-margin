import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeft, Clock, ChefHat, X, Play, Pause, RotateCcw, Timer,
  UtensilsCrossed, Maximize2, Minimize2, Plus, Trash2, AlertTriangle,
  CheckCircle2, Eye, Flame, Volume2, VolumeX, Printer, Bell,
  Star, Users, ArrowRightCircle, RefreshCw
} from 'lucide-react';
import { fetchRecipes } from '../services/api';
import type { Recipe } from '../types';

// ══════════════════════════════════════════════════════════════════════════
// ██  TYPES  ██████████████████████████████████████████████████████████████
// ══════════════════════════════════════════════════════════════════════════
type DishStatus = 'attente' | 'preparation' | 'pret' | 'servi';
type OrderPriority = 'normal' | 'rush' | 'vip';

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
}

interface DailyStats {
  platsServis: number;
  tempsMoyenSeconds: number;
  totalPrepTimes: number[];
}

// ══════════════════════════════════════════════════════════════════════════
// ██  CONSTANTS  ██████████████████████████████████████████████████████████
// ══════════════════════════════════════════════════════════════════════════
const STORAGE_KEY = 'kitchen-mode-orders';
const STATS_KEY = 'kitchen-mode-stats';
const STATS_DATE_KEY = 'kitchen-mode-stats-date';
const SERVICE_TRACKER_KEY = 'service-tracker-current';
const KITCHEN_SOUND_KEY = 'kitchen-mode-sound';
const AUTO_DIM_TIMEOUT = 30000; // 30s

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
    // Two ascending tones
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
  if (mins < 5) return '#22c55e';   // green
  if (mins < 10) return '#f59e0b';  // amber
  if (mins < 20) return '#f97316';  // orange
  return '#ef4444';                  // red
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

// ── Column classification ───────────────────────────────────────────────
function getOrderColumn(order: Order): 'new' | 'preparing' | 'ready' {
  const allServed = order.dishes.every(d => d.status === 'servi');
  if (allServed) return 'ready'; // will be filtered out
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
    if (recipes.length === 0) return { name: 'Plat du jour', id: null, prep: 10 };
    const r = recipes[Math.floor(Math.random() * recipes.length)];
    return { name: r.name, id: r.id, prep: (r.prepTimeMinutes || 5) + (r.cookTimeMinutes || 5) };
  };
  const srv = () => DEMO_SERVERS[Math.floor(Math.random() * DEMO_SERVERS.length)];

  return [
    {
      id: uid(), tableNumber: 3, serverName: srv(), createdAt: now - 22 * 60 * 1000, notes: 'ALLERGIE ARACHIDES', priority: 'rush' as OrderPriority, source: 'kitchen' as const,
      dishes: [
        { id: uid(), recipeName: pick().name, recipeId: pick().id, quantity: 2, status: 'preparation' as DishStatus, prepTimeMinutes: 12, startedAt: now - 8 * 60 * 1000, completedAt: null, servedAt: null },
        { id: uid(), recipeName: pick().name, recipeId: pick().id, quantity: 1, status: 'attente' as DishStatus, prepTimeMinutes: 15, startedAt: null, completedAt: null, servedAt: null },
      ],
    },
    {
      id: uid(), tableNumber: 7, serverName: srv(), createdAt: now - 12 * 60 * 1000, notes: 'Sans gluten', priority: 'normal' as OrderPriority, source: 'kitchen' as const,
      dishes: [
        { id: uid(), recipeName: pick().name, recipeId: pick().id, quantity: 1, status: 'attente' as DishStatus, prepTimeMinutes: 10, startedAt: null, completedAt: null, servedAt: null },
        { id: uid(), recipeName: pick().name, recipeId: pick().id, quantity: 3, status: 'attente' as DishStatus, prepTimeMinutes: 8, startedAt: null, completedAt: null, servedAt: null },
        { id: uid(), recipeName: pick().name, recipeId: pick().id, quantity: 1, status: 'attente' as DishStatus, prepTimeMinutes: 20, startedAt: null, completedAt: null, servedAt: null },
      ],
    },
    {
      id: uid(), tableNumber: 1, serverName: srv(), createdAt: now - 6 * 60 * 1000, notes: '', priority: 'vip' as OrderPriority, source: 'kitchen' as const,
      dishes: [
        { id: uid(), recipeName: pick().name, recipeId: pick().id, quantity: 1, status: 'preparation' as DishStatus, prepTimeMinutes: 18, startedAt: now - 5 * 60 * 1000, completedAt: null, servedAt: null },
        { id: uid(), recipeName: pick().name, recipeId: pick().id, quantity: 2, status: 'pret' as DishStatus, prepTimeMinutes: 8, startedAt: now - 10 * 60 * 1000, completedAt: now - 2 * 60 * 1000, servedAt: null },
      ],
    },
    {
      id: uid(), tableNumber: 12, serverName: srv(), createdAt: now - 2 * 60 * 1000, notes: '', priority: 'normal' as OrderPriority, source: 'kitchen' as const,
      dishes: [
        { id: uid(), recipeName: pick().name, recipeId: pick().id, quantity: 1, status: 'attente' as DishStatus, prepTimeMinutes: 15, startedAt: null, completedAt: null, servedAt: null },
        { id: uid(), recipeName: pick().name, recipeId: pick().id, quantity: 1, status: 'attente' as DishStatus, prepTimeMinutes: 10, startedAt: null, completedAt: null, servedAt: null },
      ],
    },
    {
      id: uid(), tableNumber: 5, serverName: srv(), createdAt: now - 25 * 60 * 1000, notes: 'Vegetarien strict', priority: 'normal' as OrderPriority, source: 'kitchen' as const,
      dishes: [
        { id: uid(), recipeName: pick().name, recipeId: pick().id, quantity: 1, status: 'pret' as DishStatus, prepTimeMinutes: 12, startedAt: now - 20 * 60 * 1000, completedAt: now - 3 * 60 * 1000, servedAt: null },
        { id: uid(), recipeName: pick().name, recipeId: pick().id, quantity: 2, status: 'pret' as DishStatus, prepTimeMinutes: 10, startedAt: now - 18 * 60 * 1000, completedAt: now - 4 * 60 * 1000, servedAt: null },
      ],
    },
    {
      id: uid(), tableNumber: 9, serverName: srv(), createdAt: now - 1 * 60 * 1000, notes: '', priority: 'rush' as OrderPriority, source: 'kitchen' as const,
      dishes: [
        { id: uid(), recipeName: pick().name, recipeId: pick().id, quantity: 4, status: 'attente' as DishStatus, prepTimeMinutes: 6, startedAt: null, completedAt: null, servedAt: null },
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
        {/* Header */}
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

        {/* Photo placeholder */}
        <div className="w-full h-48 bg-[#1a1a1a] rounded-xl mb-6 flex items-center justify-center border border-[#262626]">
          <ChefHat className="w-16 h-16 text-[#333333]" />
        </div>

        {recipe.description && (
          <p className="text-xl text-[#a1a1aa] mb-6 leading-relaxed">{recipe.description}</p>
        )}

        {/* Allergens banner */}
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

        {/* Ingredients */}
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

        {/* Prep instructions placeholder */}
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
  const [selectedDishes, setSelectedDishes] = useState<{ recipeName: string; recipeId: number | null; prepTime: number; quantity: number }[]>([]);
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
      }]);
    }
  };

  const removeDish = (index: number) => {
    setSelectedDishes(prev => prev.filter((_, i) => i !== index));
  };

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

        {/* Table + Server + Priority */}
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
            {/* Server name */}
            <label className="text-lg text-[#a1a1aa] mb-2 block">Serveur</label>
            <input
              value={serverName}
              onChange={e => setServerName(e.target.value)}
              placeholder="Nom du serveur..."
              className="w-full bg-[#1a1a1a] border border-[#333333] rounded-xl px-4 py-3 text-xl text-white placeholder-[#525252] focus:border-[#0d9488] focus:outline-none min-h-[64px] mb-4"
            />

            {/* Priority */}
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

            {/* Notes */}
            <div className="mt-4">
              <label className="text-lg text-[#a1a1aa] mb-2 block">Notes / Allergies</label>
              <input
                value={notes}
                onChange={e => setNotes(e.target.value)}
                placeholder="Allergies, cuisson speciale..."
                className="w-full bg-[#1a1a1a] border border-[#333333] rounded-xl px-4 py-3 text-xl text-white placeholder-[#525252] focus:border-[#0d9488] focus:outline-none min-h-[64px]"
              />
            </div>
          </div>
        </div>

        {/* Selected dishes */}
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

        {/* Search recipes */}
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

  // preparation
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
// ██  ORDER CARD (3-column KDS)  ██████████████████████████████████████████
// ══════════════════════════════════════════════════════════════════════════
function OrderCard({
  order, now, column, onDishStatusChange, onDishView, onRemoveOrder, onPrint
}: {
  order: Order;
  now: number;
  column: 'new' | 'preparing' | 'ready';
  onDishStatusChange: (orderId: string, dishId: string) => void;
  onDishView: (recipeId: number) => void;
  onRemoveOrder: (orderId: string) => void;
  onPrint: (order: Order) => void;
}) {
  const elapsed = Math.floor((now - order.createdAt) / 1000);
  const allServed = order.dishes.every(d => d.status === 'servi');
  const allPretOrServed = order.dishes.every(d => d.status === 'pret' || d.status === 'servi');
  const prio = getPriorityConfig(order.priority);

  // Column border color
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

  // Pickup timer for ready column
  const readyTimerDisplay = useMemo(() => {
    if (column !== 'ready') return null;
    const lastCompleted = Math.max(...order.dishes.filter(d => d.completedAt).map(d => d.completedAt!));
    if (!lastCompleted || lastCompleted <= 0) return null;
    const waitSecs = Math.floor((now - lastCompleted) / 1000);
    return { seconds: waitSecs, text: formatElapsed(waitSecs) };
  }, [column, order.dishes, now]);

  return (
    <div className={`
      rounded-2xl border-2 overflow-hidden transition-all duration-300
      ${allServed ? 'border-[#262626] opacity-40' : `${columnBorder} ${columnGlow}`}
      ${order.priority !== 'normal' && !allServed ? `ring-2 ${prio.ring}` : ''}
    `}>
      {/* Card Header */}
      <div className="px-4 py-3 flex items-center justify-between bg-[#0a0a0a]">
        <div className="flex items-center gap-3">
          {/* Table badge */}
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
          {/* Print ticket */}
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

      {/* Notes / Allergies */}
      {order.notes && !allServed && (
        <div className="px-4 py-2 bg-[#ef4444]/8 border-t border-[#ef4444]/20">
          <span className="text-[#ef4444] text-lg font-bold">
            <AlertTriangle className="w-5 h-5 inline mr-1" />
            {order.notes}
          </span>
        </div>
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
              {/* Status button - large touch target */}
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

              {/* Dish info */}
              <div className="flex-1 min-w-0">
                <div className={`text-2xl font-bold truncate ${dish.status === 'servi' ? 'text-[#525252] line-through' : 'text-white'}`}>
                  {dish.quantity > 1 && <span className="text-[#fbbf24] mr-1">x{dish.quantity}</span>}
                  {dish.recipeName}
                </div>
                <div className="text-sm font-medium" style={{ color: cfg.color }}>{cfg.label}</div>
              </div>

              {/* Timer */}
              <DishTimer dish={dish} now={now} />

              {/* View recipe */}
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
// ██  STATS BAR  ██████████████████████████████████████████████████████████
// ══════════════════════════════════════════════════════════════════════════
function StatsBar({ orders, stats }: { orders: Order[]; stats: DailyStats }) {
  const enAttente = orders.reduce((sum, o) => sum + o.dishes.filter(d => d.status === 'attente').length, 0);
  const enPrep = orders.reduce((sum, o) => sum + o.dishes.filter(d => d.status === 'preparation').length, 0);
  const prets = orders.reduce((sum, o) => sum + o.dishes.filter(d => d.status === 'pret').length, 0);
  const avgTime = stats.totalPrepTimes.length > 0
    ? Math.round(stats.totalPrepTimes.reduce((a, b) => a + b, 0) / stats.totalPrepTimes.length)
    : 0;
  const activeOrders = orders.filter(o => !o.dishes.every(d => d.status === 'servi')).length;

  return (
    <div className="bg-[#0a0a0a] border-t-2 border-[#262626] px-6 py-3 shrink-0">
      <div className="flex items-center justify-between gap-4 max-w-full overflow-x-auto">
        <div className="flex items-center gap-2 shrink-0">
          <div className="w-3 h-3 rounded-full bg-[#22c55e]" />
          <span className="text-[#a1a1aa] text-lg">Servis aujourd'hui</span>
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

  const dishLines = order.dishes.map(d =>
    `<tr><td style="font-size:18px;padding:4px 0;font-weight:bold;">${d.quantity > 1 ? `x${d.quantity} ` : ''}${d.recipeName}</td></tr>`
  ).join('');

  win.document.write(`
    <html><head><title>Ticket Cuisine</title>
    <style>
      body { font-family: monospace; padding: 10px; margin: 0; color: #000; background: #fff; }
      h1 { text-align: center; font-size: 24px; margin: 5px 0; border-bottom: 2px dashed #000; padding-bottom: 8px; }
      .prio { text-align: center; font-size: 20px; font-weight: bold; color: red; margin: 5px 0; }
      .info { font-size: 14px; margin: 4px 0; }
      .notes { font-size: 16px; font-weight: bold; color: red; background: #fee; padding: 6px; margin: 8px 0; border: 1px solid red; }
      table { width: 100%; border-collapse: collapse; }
      .footer { text-align: center; font-size: 12px; margin-top: 10px; border-top: 2px dashed #000; padding-top: 8px; }
    </style></head><body>
    <h1>TABLE ${order.tableNumber}</h1>
    ${prio ? `<div class="prio">${prio}</div>` : ''}
    <div class="info">Heure: ${time}</div>
    <div class="info">Serveur: ${order.serverName}</div>
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
  const [viewRecipeId, setViewRecipeId] = useState<number | null>(null);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [stats, setStats] = useState<DailyStats>({ platsServis: 0, tempsMoyenSeconds: 0, totalPrepTimes: [] });
  const [loaded, setLoaded] = useState(false);
  const [isDimmed, setIsDimmed] = useState(false);
  const dimTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const prevOrderCountRef = useRef(0);
  const prevReadyCountRef = useRef(0);

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
      }
      const savedOrders = localStorage.getItem(STORAGE_KEY);
      if (savedOrders) setOrders(JSON.parse(savedOrders));
      const savedStats = localStorage.getItem(STATS_KEY);
      if (savedStats) setStats(JSON.parse(savedStats));
      const savedSound = localStorage.getItem(KITCHEN_SOUND_KEY);
      if (savedSound !== null) setSoundEnabled(savedSound === 'true');
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

  // ── Persist sound preference ──────────────────────────────────────
  useEffect(() => {
    localStorage.setItem(KITCHEN_SOUND_KEY, String(soundEnabled));
  }, [soundEnabled]);

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

  // ── Sound: order ready ────────────────────────────────────────────
  useEffect(() => {
    const readyCount = orders.filter(o => {
      const active = o.dishes.some(d => d.status !== 'servi');
      const allPretOrServed = o.dishes.every(d => d.status === 'pret' || d.status === 'servi');
      return active && allPretOrServed;
    }).length;
    if (loaded && soundEnabled && readyCount > prevReadyCountRef.current && prevReadyCountRef.current >= 0) {
      playReadySound();
    }
    prevReadyCountRef.current = readyCount;
  }, [orders, loaded, soundEnabled]);

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

        // Build kitchen orders from service tracker orders, grouped by table
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
            // Check if we already imported orders for this table from this session
            for (const so of stOrders) {
              const alreadyExists = updated.some(o =>
                o.source === 'service-tracker' && o.dishes.some(d => d.id === `st-${so.id}`)
              );
              if (alreadyExists) continue;

              // Find an existing ST order for this table to append to, or create new
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
    }, 3000); // Poll every 3 seconds

    return () => clearInterval(pollInterval);
  }, []);

  // ── Actions ───────────────────────────────────────────────────────
  const addDemoOrders = useCallback(() => {
    setOrders(prev => [...prev, ...generateDemoOrders(recipes)]);
  }, [recipes]);

  const addOrder = useCallback((order: Order) => {
    setOrders(prev => [...prev, order]);
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
              setStats(prev => ({ ...prev, totalPrepTimes: [...prev.totalPrepTimes, prepDuration] }));
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
    setOrders(prev => prev.filter(o => !o.dishes.every(d => d.status === 'servi')));
  }, []);

  // ── Recipe view ───────────────────────────────────────────────────
  const recipeToView = viewRecipeId ? recipes.find(r => r.id === viewRecipeId) : null;

  // ── 3-column split ────────────────────────────────────────────────
  const { newOrders, preparingOrders, readyOrders } = useMemo(() => {
    const active = orders.filter(o => !o.dishes.every(d => d.status === 'servi'));

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

  const hasAnyOrders = orders.length > 0;
  const hasServed = orders.some(o => o.dishes.every(d => d.status === 'servi'));

  return (
    <div className={`min-h-screen bg-black text-white flex flex-col select-none transition-opacity duration-700 ${isDimmed ? 'opacity-30' : 'opacity-100'}`}
         onClick={() => isDimmed && resetDimTimer()}>

      {/* ── TOP BAR ─────────────────────────────────────────────────── */}
      <div className="bg-[#0a0a0a] border-b-2 border-[#262626] px-4 py-2 shrink-0">
        <div className="flex items-center gap-3">
          {/* Back button */}
          {!isFullscreen && (
            <button
              onClick={() => navigate('/dashboard')}
              className="min-w-[64px] min-h-[64px] rounded-xl bg-[#1a1a1a] hover:bg-[#262626] text-[#a1a1aa] hover:text-white flex items-center justify-center transition-colors shrink-0"
            >
              <ArrowLeft className="w-6 h-6" />
            </button>
          )}

          {/* Title */}
          <div className="flex items-center gap-3 shrink-0">
            <ChefHat className="w-10 h-10 text-[#14b8a6]" />
            <div>
              <h1 className="text-2xl font-black text-white tracking-wider hidden sm:block">CUISINE KDS</h1>
              <p className="text-sm text-[#71717a] hidden lg:block">Kitchen Display System</p>
            </div>
          </div>

          {/* Live clock */}
          <div className="flex items-center gap-2 ml-auto shrink-0">
            <div className="text-4xl font-mono font-black text-[#14b8a6]">
              {new Date(now).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
            </div>
          </div>

          {/* Action buttons */}
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
      </div>

      {/* ── 3-COLUMN KDS BOARD ──────────────────────────────────────── */}
      <div className="flex-1 overflow-hidden">
        {!hasAnyOrders ? (
          /* Empty state */
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
          /* 3-column layout */
          <div className="grid grid-cols-1 lg:grid-cols-3 h-full">
            {/* LEFT: NEW ORDERS */}
            <div className="border-r-0 lg:border-r-2 border-[#1a1a1a] flex flex-col overflow-hidden">
              <ColumnHeader
                title="Nouvelles"
                count={newOrders.length}
                color="#ef4444"
                icon={<Clock className="w-5 h-5 text-[#ef4444]" />}
              />
              <div className="flex-1 overflow-y-auto px-3 pb-3 space-y-3">
                {newOrders.map(order => (
                  <OrderCard
                    key={order.id}
                    order={order}
                    now={now}
                    column="new"
                    onDishStatusChange={cycleDishStatus}
                    onDishView={id => setViewRecipeId(id)}
                    onRemoveOrder={removeOrder}
                    onPrint={printKitchenTicket}
                  />
                ))}
                {newOrders.length === 0 && (
                  <div className="flex items-center justify-center h-32 text-[#333333]">
                    <p className="text-xl">Aucune commande en attente</p>
                  </div>
                )}
              </div>
            </div>

            {/* CENTER: IN PREPARATION */}
            <div className="border-r-0 lg:border-r-2 border-[#1a1a1a] flex flex-col overflow-hidden">
              <ColumnHeader
                title="En preparation"
                count={preparingOrders.length}
                color="#fbbf24"
                icon={<Flame className="w-5 h-5 text-[#fbbf24]" />}
              />
              <div className="flex-1 overflow-y-auto px-3 pb-3 space-y-3">
                {preparingOrders.map(order => (
                  <OrderCard
                    key={order.id}
                    order={order}
                    now={now}
                    column="preparing"
                    onDishStatusChange={cycleDishStatus}
                    onDishView={id => setViewRecipeId(id)}
                    onRemoveOrder={removeOrder}
                    onPrint={printKitchenTicket}
                  />
                ))}
                {preparingOrders.length === 0 && (
                  <div className="flex items-center justify-center h-32 text-[#333333]">
                    <p className="text-xl">Rien en preparation</p>
                  </div>
                )}
              </div>
            </div>

            {/* RIGHT: READY TO SERVE */}
            <div className="flex flex-col overflow-hidden">
              <ColumnHeader
                title="Prets a servir"
                count={readyOrders.length}
                color="#34d399"
                icon={<CheckCircle2 className="w-5 h-5 text-[#34d399]" />}
              />
              <div className="flex-1 overflow-y-auto px-3 pb-3 space-y-3">
                {readyOrders.map(order => (
                  <OrderCard
                    key={order.id}
                    order={order}
                    now={now}
                    column="ready"
                    onDishStatusChange={cycleDishStatus}
                    onDishView={id => setViewRecipeId(id)}
                    onRemoveOrder={removeOrder}
                    onPrint={printKitchenTicket}
                  />
                ))}
                {readyOrders.length === 0 && (
                  <div className="flex items-center justify-center h-32 text-[#333333]">
                    <p className="text-xl">Aucun plat pret</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ── STATS BAR ───────────────────────────────────────────────── */}
      <StatsBar orders={orders} stats={stats} />

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

      {recipeToView && (
        <RecipeQuickView
          recipe={recipeToView}
          onClose={() => setViewRecipeId(null)}
        />
      )}
    </div>
  );
}
