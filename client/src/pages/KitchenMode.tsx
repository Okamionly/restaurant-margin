import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeft, Clock, ChefHat, X, Play, Pause, RotateCcw, Timer,
  UtensilsCrossed, Maximize2, Minimize2, Plus, Trash2, AlertTriangle,
  CheckCircle2, Eye, Flame, Volume2, VolumeX
} from 'lucide-react';
import { fetchRecipes } from '../services/api';
import type { Recipe } from '../types';

// ── Types ─────────────────────────────────────────────────────────────
type DishStatus = 'attente' | 'preparation' | 'pret' | 'servi';

interface OrderDish {
  id: string;
  recipeName: string;
  recipeId: number | null;
  status: DishStatus;
  prepTimeMinutes: number;
  startedAt: number | null;      // timestamp when prep started
  completedAt: number | null;    // timestamp when marked pret
  servedAt: number | null;
}

interface Order {
  id: string;
  tableNumber: number;
  createdAt: number;             // timestamp
  dishes: OrderDish[];
  notes: string;
  priority: 'normal' | 'rush';
}

interface DailyStats {
  platsServis: number;
  tempsMoyenSeconds: number;
  totalPrepTimes: number[];
}

// ── Constants ─────────────────────────────────────────────────────────
const STORAGE_KEY = 'kitchen-mode-orders';
const STATS_KEY = 'kitchen-mode-stats';
const STATS_DATE_KEY = 'kitchen-mode-stats-date';

// ── Helper: unit divisor ──────────────────────────────────────────────
function getUnitDivisor(unit: string): number {
  const u = (unit || '').toLowerCase().trim();
  if (u === 'g') return 1000;
  if (u === 'mg') return 1000000;
  if (u === 'cl') return 100;
  if (u === 'ml') return 1000;
  if (u === 'dl') return 10;
  return 1;
}

// ── Helper: format time elapsed ───────────────────────────────────────
function formatElapsed(seconds: number): string {
  if (seconds < 0) seconds = 0;
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
}

// ── Helper: get time color class ──────────────────────────────────────
function getTimeColor(elapsedSeconds: number): string {
  const mins = elapsedSeconds / 60;
  if (mins < 5) return 'text-emerald-400';
  if (mins < 15) return 'text-amber-400';
  return 'text-red-500';
}

function getTimeBorderColor(elapsedSeconds: number): string {
  const mins = elapsedSeconds / 60;
  if (mins < 5) return 'border-emerald-500/40';
  if (mins < 15) return 'border-amber-500/40';
  return 'border-red-500/60';
}

function getTimeBgGlow(elapsedSeconds: number): string {
  const mins = elapsedSeconds / 60;
  if (mins < 5) return '';
  if (mins < 15) return 'shadow-[0_0_20px_rgba(245,158,11,0.15)]';
  return 'shadow-[0_0_30px_rgba(239,68,68,0.25)]';
}

// ── Helper: dish status config ────────────────────────────────────────
const statusConfig: Record<DishStatus, { label: string; bg: string; text: string; icon: React.ReactNode }> = {
  attente:     { label: 'En attente',     bg: 'bg-zinc-800',    text: 'text-zinc-300',   icon: <Clock className="w-4 h-4" /> },
  preparation: { label: 'En preparation', bg: 'bg-amber-900/60', text: 'text-amber-300', icon: <Flame className="w-4 h-4" /> },
  pret:        { label: 'Pret',           bg: 'bg-emerald-900/60', text: 'text-emerald-300', icon: <CheckCircle2 className="w-4 h-4" /> },
  servi:       { label: 'Servi',          bg: 'bg-zinc-900',    text: 'text-zinc-500',   icon: <UtensilsCrossed className="w-4 h-4" /> },
};

// ── Helper: generate unique ID ────────────────────────────────────────
function uid(): string {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
}

// ── Demo data generator ───────────────────────────────────────────────
function generateDemoOrders(recipes: Recipe[]): Order[] {
  const now = Date.now();
  const demoRecipes = recipes.length > 0 ? recipes : [];

  const pickRecipe = () => {
    if (demoRecipes.length === 0) return { name: 'Plat du jour', id: null, prep: 10 };
    const r = demoRecipes[Math.floor(Math.random() * demoRecipes.length)];
    return { name: r.name, id: r.id, prep: (r.prepTimeMinutes || 5) + (r.cookTimeMinutes || 5) };
  };

  const orders: Order[] = [
    {
      id: uid(),
      tableNumber: 3,
      createdAt: now - 18 * 60 * 1000,
      notes: '',
      priority: 'rush',
      dishes: [
        { id: uid(), recipeName: pickRecipe().name, recipeId: pickRecipe().id, status: 'preparation', prepTimeMinutes: 12, startedAt: now - 8 * 60 * 1000, completedAt: null, servedAt: null },
        { id: uid(), recipeName: pickRecipe().name, recipeId: pickRecipe().id, status: 'attente', prepTimeMinutes: 15, startedAt: null, completedAt: null, servedAt: null },
      ],
    },
    {
      id: uid(),
      tableNumber: 7,
      createdAt: now - 8 * 60 * 1000,
      notes: 'Sans gluten',
      priority: 'normal',
      dishes: [
        { id: uid(), recipeName: pickRecipe().name, recipeId: pickRecipe().id, status: 'attente', prepTimeMinutes: 10, startedAt: null, completedAt: null, servedAt: null },
        { id: uid(), recipeName: pickRecipe().name, recipeId: pickRecipe().id, status: 'attente', prepTimeMinutes: 8, startedAt: null, completedAt: null, servedAt: null },
        { id: uid(), recipeName: pickRecipe().name, recipeId: pickRecipe().id, status: 'attente', prepTimeMinutes: 20, startedAt: null, completedAt: null, servedAt: null },
      ],
    },
    {
      id: uid(),
      tableNumber: 12,
      createdAt: now - 2 * 60 * 1000,
      notes: '',
      priority: 'normal',
      dishes: [
        { id: uid(), recipeName: pickRecipe().name, recipeId: pickRecipe().id, status: 'attente', prepTimeMinutes: 15, startedAt: null, completedAt: null, servedAt: null },
      ],
    },
  ];
  return orders;
}

// ── Recipe Quick View Popup ───────────────────────────────────────────
function RecipeQuickView({ recipe, onClose }: { recipe: Recipe; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4" onClick={onClose}>
      <div
        className="bg-zinc-900 border border-zinc-700 rounded-2xl w-full max-w-2xl max-h-[85vh] overflow-y-auto p-6"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-3xl font-bold text-white">{recipe.name}</h2>
            <div className="flex gap-3 mt-2">
              <span className="text-lg text-amber-400 font-semibold">{recipe.category}</span>
              <span className="text-lg text-zinc-400">{recipe.nbPortions} portions</span>
              {recipe.prepTimeMinutes > 0 && <span className="text-lg text-blue-400">Prep {recipe.prepTimeMinutes}min</span>}
              {recipe.cookTimeMinutes > 0 && <span className="text-lg text-orange-400">Cuisson {recipe.cookTimeMinutes}min</span>}
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-3 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-400 hover:text-white transition-colors min-w-[56px] min-h-[56px] flex items-center justify-center"
          >
            <X className="w-7 h-7" />
          </button>
        </div>

        {recipe.description && (
          <p className="text-xl text-zinc-400 mb-6 leading-relaxed">{recipe.description}</p>
        )}

        {/* Ingredients */}
        <h3 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
          <UtensilsCrossed className="w-6 h-6 text-amber-400" />
          Ingredients
        </h3>
        <div className="space-y-2">
          {recipe.ingredients.map((ri) => (
            <div key={ri.id} className="flex justify-between items-center bg-zinc-800 rounded-xl px-5 py-4">
              <span className="text-xl font-semibold text-white">{ri.ingredient.name}</span>
              <span className="text-xl text-amber-400 font-mono font-bold">
                {ri.quantity} {ri.ingredient.unit}
              </span>
            </div>
          ))}
        </div>

        {/* Cost info */}
        <div className="mt-6 bg-zinc-800/50 rounded-xl p-4 flex gap-6 text-lg">
          <span className="text-zinc-400">Prix: <span className="text-white font-bold">{recipe.sellingPrice.toFixed(2)} EUR</span></span>
          {recipe.margin && (
            <span className="text-zinc-400">
              Marge: <span className={`font-bold ${recipe.margin.marginPercent >= 70 ? 'text-emerald-400' : recipe.margin.marginPercent >= 60 ? 'text-amber-400' : 'text-red-400'}`}>
                {recipe.margin.marginPercent.toFixed(1)}%
              </span>
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

// ── New Order Modal ───────────────────────────────────────────────────
function NewOrderModal({
  recipes,
  onAdd,
  onClose
}: {
  recipes: Recipe[];
  onAdd: (order: Order) => void;
  onClose: () => void;
}) {
  const [tableNumber, setTableNumber] = useState<number>(1);
  const [notes, setNotes] = useState('');
  const [priority, setPriority] = useState<'normal' | 'rush'>('normal');
  const [selectedDishes, setSelectedDishes] = useState<{ recipeName: string; recipeId: number | null; prepTime: number }[]>([]);
  const [search, setSearch] = useState('');

  const filtered = recipes.filter(r =>
    r.name.toLowerCase().includes(search.toLowerCase()) ||
    r.category.toLowerCase().includes(search.toLowerCase())
  );

  const addDish = (recipe: Recipe) => {
    setSelectedDishes(prev => [
      ...prev,
      {
        recipeName: recipe.name,
        recipeId: recipe.id,
        prepTime: (recipe.prepTimeMinutes || 5) + (recipe.cookTimeMinutes || 5),
      },
    ]);
  };

  const removeDish = (index: number) => {
    setSelectedDishes(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = () => {
    if (selectedDishes.length === 0) return;
    const order: Order = {
      id: uid(),
      tableNumber,
      createdAt: Date.now(),
      notes,
      priority,
      dishes: selectedDishes.map(d => ({
        id: uid(),
        recipeName: d.recipeName,
        recipeId: d.recipeId,
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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4" onClick={onClose}>
      <div
        className="bg-zinc-900 border border-zinc-700 rounded-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto p-6"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-3xl font-bold text-white">Nouvelle Commande</h2>
          <button onClick={onClose} className="p-3 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-400 hover:text-white transition-colors min-w-[56px] min-h-[56px] flex items-center justify-center">
            <X className="w-7 h-7" />
          </button>
        </div>

        {/* Table + Priority */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div>
            <label className="text-lg text-zinc-400 mb-2 block">Table N&#176;</label>
            <div className="flex gap-2 flex-wrap">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map(n => (
                <button
                  key={n}
                  onClick={() => setTableNumber(n)}
                  className={`min-w-[56px] min-h-[56px] rounded-xl text-xl font-bold transition-colors
                    ${tableNumber === n ? 'bg-teal-600 text-white' : 'bg-zinc-800 text-zinc-400 hover:bg-zinc-700'}`}
                >
                  {n}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="text-lg text-zinc-400 mb-2 block">Priorite</label>
            <div className="flex gap-3">
              <button
                onClick={() => setPriority('normal')}
                className={`flex-1 min-h-[56px] rounded-xl text-xl font-bold transition-colors
                  ${priority === 'normal' ? 'bg-zinc-700 text-white' : 'bg-zinc-800 text-zinc-500 hover:bg-zinc-700'}`}
              >
                Normal
              </button>
              <button
                onClick={() => setPriority('rush')}
                className={`flex-1 min-h-[56px] rounded-xl text-xl font-bold transition-colors
                  ${priority === 'rush' ? 'bg-red-600 text-white' : 'bg-zinc-800 text-zinc-500 hover:bg-zinc-700'}`}
              >
                RUSH
              </button>
            </div>
            <div className="mt-4">
              <label className="text-lg text-zinc-400 mb-2 block">Notes</label>
              <input
                value={notes}
                onChange={e => setNotes(e.target.value)}
                placeholder="Allergies, cuisson..."
                className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-3 text-xl text-white placeholder-zinc-600 focus:border-teal-500 focus:outline-none min-h-[56px]"
              />
            </div>
          </div>
        </div>

        {/* Selected dishes */}
        {selectedDishes.length > 0 && (
          <div className="mb-6">
            <h3 className="text-xl font-bold text-white mb-3">Plats selectionnes ({selectedDishes.length})</h3>
            <div className="space-y-2">
              {selectedDishes.map((d, i) => (
                <div key={i} className="flex items-center justify-between bg-zinc-800 rounded-xl px-4 py-3">
                  <span className="text-lg text-white font-semibold">{d.recipeName}</span>
                  <div className="flex items-center gap-3">
                    <span className="text-zinc-400 text-lg">{d.prepTime} min</span>
                    <button onClick={() => removeDish(i)} className="p-2 rounded-lg bg-red-900/50 hover:bg-red-800/50 text-red-400 min-w-[44px] min-h-[44px] flex items-center justify-center">
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Search recipes to add */}
        <div className="mb-4">
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Chercher un plat..."
            className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-3 text-xl text-white placeholder-zinc-600 focus:border-teal-500 focus:outline-none min-h-[56px]"
          />
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 max-h-[200px] overflow-y-auto mb-6">
          {filtered.map(recipe => (
            <button
              key={recipe.id}
              onClick={() => addDish(recipe)}
              className="text-left p-3 rounded-xl bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 hover:border-teal-500 transition-all min-h-[56px]"
            >
              <div className="text-white font-semibold text-lg truncate">{recipe.name}</div>
              <div className="text-zinc-500 text-sm">{recipe.category} - {(recipe.prepTimeMinutes || 0) + (recipe.cookTimeMinutes || 0)} min</div>
            </button>
          ))}
        </div>

        {/* Submit */}
        <button
          onClick={handleSubmit}
          disabled={selectedDishes.length === 0}
          className={`w-full min-h-[64px] rounded-xl text-2xl font-bold transition-colors
            ${selectedDishes.length > 0
              ? 'bg-teal-600 hover:bg-teal-500 text-white'
              : 'bg-zinc-800 text-zinc-600 cursor-not-allowed'}`}
        >
          Envoyer en cuisine ({selectedDishes.length} plats)
        </button>
      </div>
    </div>
  );
}

// ── Dish Timer Display ────────────────────────────────────────────────
function DishTimer({ dish, now }: { dish: OrderDish; now: number }) {
  if (dish.status === 'servi') {
    return <span className="text-zinc-600 font-mono text-lg">--:--</span>;
  }
  if (dish.status === 'pret') {
    return <span className="text-emerald-400 font-mono text-lg font-bold">PRET</span>;
  }

  const baseTime = dish.status === 'preparation' && dish.startedAt
    ? dish.startedAt
    : now;

  const elapsed = dish.status === 'preparation' && dish.startedAt
    ? Math.floor((now - dish.startedAt) / 1000)
    : 0;

  const targetSeconds = dish.prepTimeMinutes * 60;
  const remaining = targetSeconds - elapsed;
  const isOvertime = remaining <= 0;

  if (dish.status === 'attente') {
    return <span className="text-zinc-500 font-mono text-lg">{dish.prepTimeMinutes}:00</span>;
  }

  // preparation
  return (
    <span className={`font-mono text-lg font-bold ${isOvertime ? 'text-red-500 animate-pulse' : remaining < 60 ? 'text-amber-400' : 'text-emerald-400'}`}>
      {isOvertime ? '+' : ''}{formatElapsed(Math.abs(remaining))}
    </span>
  );
}

// ── Order Card ────────────────────────────────────────────────────────
function OrderCard({
  order,
  now,
  onDishStatusChange,
  onDishView,
  onRemoveOrder,
}: {
  order: Order;
  now: number;
  onDishStatusChange: (orderId: string, dishId: string) => void;
  onDishView: (recipeId: number) => void;
  onRemoveOrder: (orderId: string) => void;
}) {
  const elapsed = Math.floor((now - order.createdAt) / 1000);
  const allServed = order.dishes.every(d => d.status === 'servi');
  const allPretOrServed = order.dishes.every(d => d.status === 'pret' || d.status === 'servi');

  return (
    <div className={`
      rounded-2xl border-2 overflow-hidden transition-all duration-300
      ${allServed
        ? 'border-zinc-800 opacity-50'
        : `${getTimeBorderColor(elapsed)} ${getTimeBgGlow(elapsed)}`}
      ${order.priority === 'rush' && !allServed ? 'ring-2 ring-red-500/30' : ''}
    `}>
      {/* Card Header */}
      <div className={`px-5 py-4 flex items-center justify-between ${allServed ? 'bg-zinc-900/50' : 'bg-zinc-900'}`}>
        <div className="flex items-center gap-3">
          <div className={`
            w-14 h-14 rounded-xl flex items-center justify-center text-2xl font-black
            ${allPretOrServed && !allServed
              ? 'bg-emerald-600 text-white animate-pulse'
              : allServed
                ? 'bg-zinc-800 text-zinc-600'
                : 'bg-zinc-800 text-white'}
          `}>
            {order.tableNumber}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xl font-bold text-white">Table {order.tableNumber}</span>
              {order.priority === 'rush' && !allServed && (
                <span className="px-2 py-0.5 rounded-md bg-red-600 text-white text-sm font-bold uppercase tracking-wider animate-pulse">
                  RUSH
                </span>
              )}
            </div>
            <div className={`text-lg font-mono font-bold ${getTimeColor(elapsed)}`}>
              <Clock className="w-4 h-4 inline mr-1" />
              {formatElapsed(elapsed)}
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-zinc-500 text-lg">
            {order.dishes.filter(d => d.status === 'servi').length}/{order.dishes.length}
          </span>
          {allServed && (
            <button
              onClick={() => onRemoveOrder(order.id)}
              className="p-2 rounded-lg bg-zinc-800 hover:bg-red-900/50 text-zinc-600 hover:text-red-400 transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center"
            >
              <Trash2 className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>

      {/* Notes */}
      {order.notes && !allServed && (
        <div className="px-5 py-2 bg-amber-900/20 border-t border-amber-800/30">
          <span className="text-amber-400 text-lg font-semibold">
            <AlertTriangle className="w-4 h-4 inline mr-1" />
            {order.notes}
          </span>
        </div>
      )}

      {/* Dishes */}
      <div className="divide-y divide-zinc-800/50">
        {order.dishes.map(dish => {
          const cfg = statusConfig[dish.status];
          const nextStatus: DishStatus | null =
            dish.status === 'attente' ? 'preparation' :
            dish.status === 'preparation' ? 'pret' :
            dish.status === 'pret' ? 'servi' : null;

          return (
            <div
              key={dish.id}
              className={`flex items-center gap-3 px-5 py-3 transition-all
                ${dish.status === 'servi' ? 'bg-zinc-900/30' : 'bg-black hover:bg-zinc-900/50'}`}
            >
              {/* Status button */}
              <button
                onClick={() => nextStatus && onDishStatusChange(order.id, dish.id)}
                disabled={!nextStatus}
                className={`
                  min-w-[56px] min-h-[56px] rounded-xl flex items-center justify-center transition-all
                  ${dish.status === 'attente' ? 'bg-zinc-800 hover:bg-amber-900/50 text-zinc-400 hover:text-amber-300 active:scale-95' : ''}
                  ${dish.status === 'preparation' ? 'bg-amber-800/50 hover:bg-emerald-900/50 text-amber-300 hover:text-emerald-300 active:scale-95' : ''}
                  ${dish.status === 'pret' ? 'bg-emerald-800/50 hover:bg-zinc-700 text-emerald-300 hover:text-zinc-300 active:scale-95' : ''}
                  ${dish.status === 'servi' ? 'bg-zinc-900 text-zinc-700 cursor-default' : ''}
                `}
              >
                {cfg.icon}
              </button>

              {/* Dish info */}
              <div className="flex-1 min-w-0">
                <div className={`text-lg font-bold truncate ${dish.status === 'servi' ? 'text-zinc-600 line-through' : 'text-white'}`}>
                  {dish.recipeName}
                </div>
                <div className={`text-sm font-medium ${cfg.text}`}>{cfg.label}</div>
              </div>

              {/* Timer */}
              <DishTimer dish={dish} now={now} />

              {/* View recipe */}
              {dish.recipeId && dish.status !== 'servi' && (
                <button
                  onClick={() => dish.recipeId && onDishView(dish.recipeId)}
                  className="min-w-[44px] min-h-[44px] rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-400 hover:text-teal-400 flex items-center justify-center transition-colors"
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

// ── Stats Bar ─────────────────────────────────────────────────────────
function StatsBar({ orders, stats }: { orders: Order[]; stats: DailyStats }) {
  const enAttente = orders.reduce((sum, o) => sum + o.dishes.filter(d => d.status === 'attente').length, 0);
  const enPrep = orders.reduce((sum, o) => sum + o.dishes.filter(d => d.status === 'preparation').length, 0);
  const prets = orders.reduce((sum, o) => sum + o.dishes.filter(d => d.status === 'pret').length, 0);
  const avgTime = stats.totalPrepTimes.length > 0
    ? Math.round(stats.totalPrepTimes.reduce((a, b) => a + b, 0) / stats.totalPrepTimes.length)
    : 0;

  return (
    <div className="bg-zinc-900 border-t border-zinc-800 px-6 py-3">
      <div className="flex items-center justify-between gap-6 max-w-full overflow-x-auto">
        <div className="flex items-center gap-2 shrink-0">
          <div className="w-3 h-3 rounded-full bg-emerald-500" />
          <span className="text-zinc-400 text-lg">Servis</span>
          <span className="text-white text-2xl font-bold font-mono">{stats.platsServis}</span>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <div className="w-3 h-3 rounded-full bg-amber-500" />
          <span className="text-zinc-400 text-lg">En prep</span>
          <span className="text-amber-400 text-2xl font-bold font-mono">{enPrep}</span>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <div className="w-3 h-3 rounded-full bg-zinc-500" />
          <span className="text-zinc-400 text-lg">En attente</span>
          <span className="text-white text-2xl font-bold font-mono">{enAttente}</span>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <div className="w-3 h-3 rounded-full bg-teal-500" />
          <span className="text-zinc-400 text-lg">Prets</span>
          <span className="text-teal-400 text-2xl font-bold font-mono">{prets}</span>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <Clock className="w-5 h-5 text-zinc-500" />
          <span className="text-zinc-400 text-lg">Temps moyen</span>
          <span className="text-white text-2xl font-bold font-mono">{formatElapsed(avgTime)}</span>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <span className="text-zinc-400 text-lg">Commandes actives</span>
          <span className="text-white text-2xl font-bold font-mono">{orders.filter(o => !o.dishes.every(d => d.status === 'servi')).length}</span>
        </div>
      </div>
    </div>
  );
}

// ── Kitchen Timer (standalone) ────────────────────────────────────────
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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4" onClick={onClose}>
      <div className={`bg-zinc-900 border-2 rounded-2xl p-8 w-full max-w-md ${alarm ? 'border-red-500 animate-pulse' : 'border-zinc-700'}`} onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <Timer className="w-8 h-8 text-teal-400" />
            <span className="text-2xl font-bold text-white">Timer</span>
          </div>
          <button onClick={onClose} className="p-3 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-400 hover:text-white min-w-[56px] min-h-[56px] flex items-center justify-center">
            <X className="w-7 h-7" />
          </button>
        </div>

        <div className={`text-7xl font-mono font-bold text-center py-6 ${alarm ? 'text-red-500' : 'text-white'}`}>
          {formatElapsed(seconds)}
        </div>

        {alarm && (
          <div className="text-center text-red-500 font-bold text-3xl mb-6 animate-bounce">
            TEMPS ECOULE !
          </div>
        )}

        <div className="flex flex-wrap gap-2 mb-6 justify-center">
          {presets.map(m => (
            <button
              key={m}
              onClick={() => { setTargetMinutes(m); reset(); }}
              className={`min-w-[56px] min-h-[56px] rounded-xl text-xl font-bold transition-colors
                ${targetMinutes === m ? 'bg-teal-600 text-white' : 'bg-zinc-800 text-zinc-400 hover:bg-zinc-700'}`}
            >
              {m}m
            </button>
          ))}
        </div>

        <div className="flex gap-3 justify-center">
          <button
            onClick={() => { setAlarm(false); setRunning(r => !r); }}
            className="flex items-center gap-2 px-8 min-h-[56px] rounded-xl text-xl font-bold bg-teal-600 hover:bg-teal-500 text-white transition-colors"
          >
            {running ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6" />}
            {running ? 'Pause' : 'Lancer'}
          </button>
          <button
            onClick={reset}
            className="flex items-center gap-2 px-6 min-h-[56px] rounded-xl text-xl font-bold bg-zinc-800 hover:bg-zinc-700 text-zinc-400 transition-colors"
          >
            <RotateCcw className="w-6 h-6" />
          </button>
        </div>
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════
// ══  MAIN KITCHEN MODE PAGE  ═════════════════════════════════════════
// ══════════════════════════════════════════════════════════════════════
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

  // ── Load recipes ──────────────────────────────────────────────────
  useEffect(() => {
    fetchRecipes()
      .then(setRecipes)
      .catch(() => {});
  }, []);

  // ── Load persisted orders & stats ─────────────────────────────────
  useEffect(() => {
    try {
      const today = new Date().toISOString().slice(0, 10);
      const savedDate = localStorage.getItem(STATS_DATE_KEY);

      // Reset stats if day changed
      if (savedDate !== today) {
        localStorage.setItem(STATS_DATE_KEY, today);
        localStorage.removeItem(STATS_KEY);
        localStorage.removeItem(STORAGE_KEY);
      }

      const savedOrders = localStorage.getItem(STORAGE_KEY);
      if (savedOrders) {
        setOrders(JSON.parse(savedOrders));
      }

      const savedStats = localStorage.getItem(STATS_KEY);
      if (savedStats) {
        setStats(JSON.parse(savedStats));
      }
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

  // ── Live clock tick (every second) ────────────────────────────────
  useEffect(() => {
    const interval = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(interval);
  }, []);

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

  // ── Add demo data ─────────────────────────────────────────────────
  const addDemoOrders = useCallback(() => {
    const demo = generateDemoOrders(recipes);
    setOrders(prev => [...prev, ...demo]);
  }, [recipes]);

  // ── Add order ─────────────────────────────────────────────────────
  const addOrder = useCallback((order: Order) => {
    setOrders(prev => [...prev, order]);
  }, []);

  // ── Remove order ──────────────────────────────────────────────────
  const removeOrder = useCallback((orderId: string) => {
    setOrders(prev => prev.filter(o => o.id !== orderId));
  }, []);

  // ── Cycle dish status ─────────────────────────────────────────────
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
            // Track prep time for stats
            if (dish.startedAt) {
              const prepDuration = Math.floor((completedAt - dish.startedAt) / 1000);
              setStats(prev => ({
                ...prev,
                totalPrepTimes: [...prev.totalPrepTimes, prepDuration],
              }));
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

  // ── Clear all served ──────────────────────────────────────────────
  const clearServed = useCallback(() => {
    setOrders(prev => prev.filter(o => !o.dishes.every(d => d.status === 'servi')));
  }, []);

  // ── Recipe to view ────────────────────────────────────────────────
  const recipeToView = viewRecipeId ? recipes.find(r => r.id === viewRecipeId) : null;

  // ── Sort orders: rush first, then by time (oldest first), served last ──
  const sortedOrders = useMemo(() => {
    return [...orders].sort((a, b) => {
      const aServed = a.dishes.every(d => d.status === 'servi');
      const bServed = b.dishes.every(d => d.status === 'servi');
      if (aServed && !bServed) return 1;
      if (!aServed && bServed) return -1;
      if (a.priority === 'rush' && b.priority !== 'rush') return -1;
      if (a.priority !== 'rush' && b.priority === 'rush') return 1;
      return a.createdAt - b.createdAt;
    });
  }, [orders]);

  const activeOrderCount = orders.filter(o => !o.dishes.every(d => d.status === 'servi')).length;

  return (
    <div className="min-h-screen bg-black text-white flex flex-col">
      {/* ── TOP BAR ─────────────────────────────────────────────────── */}
      <div className="bg-zinc-900 border-b border-zinc-800 px-4 py-3 shrink-0">
        <div className="flex items-center gap-3">
          {/* Back */}
          {!isFullscreen && (
            <button
              onClick={() => navigate('/dashboard')}
              className="min-w-[56px] min-h-[56px] rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-400 hover:text-white flex items-center justify-center transition-colors shrink-0"
            >
              <ArrowLeft className="w-6 h-6" />
            </button>
          )}

          {/* Title */}
          <div className="flex items-center gap-3 shrink-0">
            <ChefHat className="w-8 h-8 text-teal-400" />
            <h1 className="text-2xl font-bold text-white hidden sm:block">CUISINE</h1>
          </div>

          {/* Live clock */}
          <div className="flex items-center gap-2 ml-auto shrink-0">
            <div className="text-3xl font-mono font-bold text-teal-400">
              {new Date(now).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-2 shrink-0">
            {/* New order */}
            <button
              onClick={() => setShowNewOrder(true)}
              className="min-w-[56px] min-h-[56px] rounded-xl bg-teal-600 hover:bg-teal-500 text-white flex items-center justify-center gap-2 px-4 transition-colors"
            >
              <Plus className="w-6 h-6" />
              <span className="hidden sm:inline text-lg font-bold">Commande</span>
            </button>

            {/* Demo data */}
            {orders.length === 0 && (
              <button
                onClick={addDemoOrders}
                className="min-w-[56px] min-h-[56px] rounded-xl bg-amber-800/50 hover:bg-amber-700/50 text-amber-400 flex items-center justify-center gap-2 px-4 transition-colors"
              >
                <Flame className="w-5 h-5" />
                <span className="hidden sm:inline text-lg font-bold">Demo</span>
              </button>
            )}

            {/* Timer */}
            <button
              onClick={() => setShowTimer(true)}
              className="min-w-[56px] min-h-[56px] rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-400 hover:text-white flex items-center justify-center transition-colors"
            >
              <Timer className="w-6 h-6" />
            </button>

            {/* Sound toggle */}
            <button
              onClick={() => setSoundEnabled(s => !s)}
              className="min-w-[56px] min-h-[56px] rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-400 hover:text-white flex items-center justify-center transition-colors"
            >
              {soundEnabled ? <Volume2 className="w-6 h-6" /> : <VolumeX className="w-6 h-6" />}
            </button>

            {/* Clear served */}
            {orders.some(o => o.dishes.every(d => d.status === 'servi')) && (
              <button
                onClick={clearServed}
                className="min-w-[56px] min-h-[56px] rounded-xl bg-zinc-800 hover:bg-red-900/50 text-zinc-400 hover:text-red-400 flex items-center justify-center transition-colors"
              >
                <Trash2 className="w-6 h-6" />
              </button>
            )}

            {/* Fullscreen */}
            <button
              onClick={toggleFullscreen}
              className="min-w-[56px] min-h-[56px] rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-400 hover:text-white flex items-center justify-center transition-colors"
            >
              {isFullscreen ? <Minimize2 className="w-6 h-6" /> : <Maximize2 className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* ── ORDER BOARD ─────────────────────────────────────────────── */}
      <div className="flex-1 overflow-auto p-4">
        {sortedOrders.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full gap-6 py-20">
            <ChefHat className="w-24 h-24 text-zinc-800" />
            <p className="text-3xl text-zinc-600 font-bold">Aucune commande en cours</p>
            <p className="text-xl text-zinc-700">Cliquez sur "Commande" pour ajouter ou "Demo" pour tester</p>
            <div className="flex gap-4">
              <button
                onClick={() => setShowNewOrder(true)}
                className="min-h-[56px] px-8 rounded-xl bg-teal-600 hover:bg-teal-500 text-white text-xl font-bold transition-colors"
              >
                <Plus className="w-6 h-6 inline mr-2" />
                Nouvelle Commande
              </button>
              <button
                onClick={addDemoOrders}
                className="min-h-[56px] px-8 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-xl font-bold transition-colors"
              >
                <Flame className="w-5 h-5 inline mr-2" />
                Charger Demo
              </button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4 auto-rows-min">
            {sortedOrders.map(order => (
              <OrderCard
                key={order.id}
                order={order}
                now={now}
                onDishStatusChange={cycleDishStatus}
                onDishView={id => setViewRecipeId(id)}
                onRemoveOrder={removeOrder}
              />
            ))}
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
