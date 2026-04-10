import { formatCurrency, getCurrencySymbol } from '../utils/currency';
import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import {
  Bluetooth, BluetoothOff, Scale, Check, RotateCcw, Search,
  AlertTriangle, Wifi, Plus, Minus, ArrowLeft, Trash2,
  ClipboardList, Package, ChefHat, Zap, CircleDot, Euro, PlusCircle, X,
  Maximize, Minimize, Camera, RefreshCw, Settings, WifiOff,
  ArrowDownToLine, ArrowUpFromLine, Replace,
  // New icons for features
  BookOpen, Calendar, Download, Bell, Router, Weight,
  ChevronDown, ChevronRight, CheckCircle2, AlertCircle, Clock,
  BarChart3, FileText, ExternalLink, Save, Play, Pause,
} from 'lucide-react';
import { useScale } from '../hooks/useScale';
import { useToast } from '../hooks/useToast';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from '../hooks/useTranslation';

const API = '';

function authHeaders() {
  const token = localStorage.getItem('token');
  const restaurantId = localStorage.getItem('activeRestaurantId');
  return { 'Content-Type': 'application/json', Authorization: `Bearer ${token}`, 'X-Restaurant-Id': restaurantId || '1' };
}

type Ingredient = { id: number; name: string; unit: string; category: string; pricePerUnit: number };

type StockMode = 'remove' | 'add' | 'set';

type HistoryEntry = {
  ingredientName: string;
  ingredientCategory: string;
  weight: number;
  unit: string;
  timestamp: string;
  status: 'success' | 'error';
  stockAction?: StockMode;
  stockBefore?: number;
  stockAfter?: number;
  recipeId?: number;
  recipeName?: string;
};

// ── Recipe types ──
type RecipeIngredient = {
  id: number;
  ingredientId: number;
  quantity: number;
  wastePercent: number;
  ingredient: Ingredient;
};

type Recipe = {
  id: number;
  name: string;
  category: string;
  sellingPrice: number;
  nbPortions: number;
  ingredients: RecipeIngredient[];
};

// ── Recipe weighing session ──
type RecipeWeighEntry = {
  ingredientId: number;
  ingredientName: string;
  targetQty: number;
  actualQty: number | null;
  unit: string;
  pricePerUnit: number;
  status: 'pending' | 'weighed';
};

type RecipeSession = {
  recipeId: number;
  recipeName: string;
  entries: RecipeWeighEntry[];
  startedAt: string;
};

// ── Tare Profile ──
type TareProfile = {
  id: string;
  name: string;
  weightGrams: number;
};

const DEFAULT_TARE_PROFILES: TareProfile[] = [
  { id: 'gn1-1', name: 'Bac GN 1/1', weightGrams: 850 },
  { id: 'bol-inox', name: 'Bol inox', weightGrams: 320 },
  { id: 'assiette', name: 'Assiette', weightGrams: 450 },
  { id: 'bac-gn-1-2', name: 'Bac GN 1/2', weightGrams: 520 },
  { id: 'saladier', name: 'Saladier', weightGrams: 680 },
];

// ── Multi-scale ──
type ScaleProfile = {
  id: string;
  name: string;
  type: 'floor' | 'precision' | 'standard';
  lastUsedForCategory?: string;
};

// ── Weighing History Session ──
type WeighingSession = {
  date: string; // YYYY-MM-DD
  entries: HistoryEntry[];
  totalValue: number;
  totalKg: number;
};

const CATEGORY_COLORS: Record<string, string> = {
  'Viandes': 'bg-red-500/20 text-red-300 border-red-500/30',
  'Poissons': 'bg-teal-500/20 text-teal-300 border-teal-500/30',
  'Legumes': 'bg-green-500/20 text-green-300 border-green-500/30',
  'Fruits': 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30',
  'Produits laitiers': 'bg-orange-500/20 text-orange-300 border-orange-500/30',
  'Epicerie': 'bg-purple-500/20 text-purple-300 border-purple-500/30',
};

function getCategoryColor(cat: string) {
  return CATEGORY_COLORS[cat] ?? 'bg-[#F3F4F6] dark:bg-[#171717]/20 text-[#6B7280] dark:text-[#A3A3A3] border-[#E5E7EB] dark:border-[#1A1A1A]/30';
}

// Scale gives kg, convert to target unit
function convertWeight(kg: number, unit: string): number {
  switch (unit.toLowerCase()) {
    case 'g': return Math.round(kg * 1000);
    case 'kg': return Math.round(kg * 1000) / 1000;
    case 'l': return Math.round(kg * 100) / 100;
    case 'cl': return Math.round(kg * 1000) / 10;
    case 'ml': return Math.round(kg * 1000 * 10);
    default: return Math.round(kg * 1000) / 1000;
  }
}

// localStorage persistence for history
const HISTORY_KEY = 'weighstation_history';
const TARE_PROFILES_KEY = 'weighstation_tare_profiles';
const SCALE_PROFILES_KEY = 'weighstation_scale_profiles';
const RECIPE_SESSIONS_KEY = 'weighstation_recipe_sessions';
const RECENT_INGREDIENTS_KEY = 'weighstation_recent_ingredients';

function loadRecentIngredients(): number[] {
  try {
    const raw = localStorage.getItem(RECENT_INGREDIENTS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch { return []; }
}

function saveRecentIngredients(ids: number[]) {
  localStorage.setItem(RECENT_INGREDIENTS_KEY, JSON.stringify(ids.slice(0, 5)));
}

function addToRecent(id: number) {
  const recent = loadRecentIngredients().filter(rid => rid !== id);
  recent.unshift(id);
  saveRecentIngredients(recent.slice(0, 5));
}

function loadHistory(): HistoryEntry[] {
  try {
    const raw = localStorage.getItem(HISTORY_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch { return []; }
}

function saveHistory(entries: HistoryEntry[]) {
  localStorage.setItem(HISTORY_KEY, JSON.stringify(entries.slice(0, 200)));
}

function loadTareProfiles(): TareProfile[] {
  try {
    const raw = localStorage.getItem(TARE_PROFILES_KEY);
    return raw ? JSON.parse(raw) : DEFAULT_TARE_PROFILES;
  } catch { return DEFAULT_TARE_PROFILES; }
}

function saveTareProfiles(profiles: TareProfile[]) {
  localStorage.setItem(TARE_PROFILES_KEY, JSON.stringify(profiles));
}

function loadRecipeSessions(): RecipeSession[] {
  try {
    const raw = localStorage.getItem(RECIPE_SESSIONS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch { return []; }
}

function saveRecipeSessions(sessions: RecipeSession[]) {
  localStorage.setItem(RECIPE_SESSIONS_KEY, JSON.stringify(sessions.slice(0, 100)));
}

// Steps for the workflow
const STEPS = [
  { num: 1, label: 'Ingredient', icon: Search },
  { num: 2, label: 'Tare', icon: RotateCcw },
  { num: 3, label: 'Peser', icon: Scale },
  { num: 4, label: 'Action', icon: Package },
  { num: 5, label: 'Valider', icon: Check },
];

type DisplayUnit = 'g' | 'kg' | 'L' | 'piece';

// ── Main tabs ──
type MainTab = 'peser' | 'recette' | 'historique' | 'rapport';

// ── Accuracy color helpers ──
function getAccuracyColor(target: number, actual: number): 'green' | 'amber' | 'red' {
  if (target <= 0) return 'green';
  const diff = Math.abs(actual - target) / target;
  if (diff <= 0.05) return 'green';
  if (diff <= 0.15) return 'amber';
  return 'red';
}

function getAccuracyClasses(color: 'green' | 'amber' | 'red') {
  switch (color) {
    case 'green': return 'text-emerald-400 bg-emerald-900/30 border-emerald-500/30';
    case 'amber': return 'text-amber-400 bg-amber-900/30 border-amber-500/30';
    case 'red': return 'text-red-400 bg-red-900/30 border-red-500/30';
  }
}

function getAccuracyIcon(color: 'green' | 'amber' | 'red') {
  switch (color) {
    case 'green': return CheckCircle2;
    case 'amber': return AlertTriangle;
    case 'red': return AlertCircle;
  }
}

// ── CSV export helper ──
function exportCSV(data: HistoryEntry[], filename: string) {
  const headers = ['Date', 'Heure', 'Ingredient', 'Categorie', 'Poids', 'Unite', 'Action', 'Stock Avant', 'Stock Apres', 'Statut', 'Recette'];
  const rows = data.map(e => {
    const d = new Date(e.timestamp);
    return [
      d.toLocaleDateString('fr-FR'),
      d.toLocaleTimeString('fr-FR'),
      e.ingredientName,
      e.ingredientCategory,
      e.weight.toString(),
      e.unit,
      e.stockAction || '',
      e.stockBefore?.toString() || '',
      e.stockAfter?.toString() || '',
      e.status,
      e.recipeName || '',
    ].join(';');
  });
  const csv = [headers.join(';'), ...rows].join('\n');
  const blob = new Blob(['\ufeff' + csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}


export default function WeighStation() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { showToast } = useToast();
  const {
    status, reading, error, isSupported, deviceName, scaleType,
    kioskMode, setKioskMode, autoReconnect, setAutoReconnect,
    connect, disconnect,
  } = useScale();

  // ── Main tab state ──
  const [mainTab, setMainTab] = useState<MainTab>('peser');

  const [ingredients, setIngredients] = useState<Ingredient[]>([]);
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState<Ingredient | null>(null);
  const [tare, setTare] = useState(0);
  const [saving, setSaving] = useState(false);
  const [simWeight, setSimWeight] = useState(0);
  const [useSimulation, setUseSimulation] = useState(false);
  const [history, setHistory] = useState<HistoryEntry[]>(loadHistory);
  const [displayUnit, setDisplayUnit] = useState<DisplayUnit>('g');
  const [quickMode, setQuickMode] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [prevWeight, setPrevWeight] = useState(0);
  const [flashGreen, setFlashGreen] = useState(false);
  const [connectAnim, setConnectAnim] = useState(false);
  const [showNewIngredient, setShowNewIngredient] = useState(false);
  const [newIngForm, setNewIngForm] = useState({ name: '', category: 'Legumes', unit: 'kg', pricePerUnit: '' });
  const [creatingIngredient, setCreatingIngredient] = useState(false);
  const [ingredientStock, setIngredientStock] = useState<{ stock: number; unit: string; itemId: number; minStock?: number } | null>(null);
  const [loadingStock, setLoadingStock] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showCameraPlaceholder, setShowCameraPlaceholder] = useState(false);
  const [stockMode, setStockMode] = useState<StockMode>('remove');
  const [recentIngredientIds, setRecentIngredientIds] = useState<number[]>(loadRecentIngredients);
  const [categoryFilter, setCategoryFilter] = useState<string | null>(null);

  // ── Recipe Mode state ──
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);
  const [recipeSession, setRecipeSession] = useState<RecipeSession | null>(null);
  const [activeRecipeIngIdx, setActiveRecipeIngIdx] = useState<number | null>(null);
  const [recipeSessions, setRecipeSessions] = useState<RecipeSession[]>(loadRecipeSessions);

  // ── Tare Profiles state ──
  const [tareProfiles, setTareProfiles] = useState<TareProfile[]>(loadTareProfiles);
  const [showTareProfiles, setShowTareProfiles] = useState(false);
  const [newTareForm, setNewTareForm] = useState({ name: '', weightGrams: '' });

  // ── Multi-Scale state ──
  const [scaleProfiles] = useState<ScaleProfile[]>([
    { id: 'main', name: 'Balance principale', type: 'standard' },
    { id: 'precision', name: 'Balance de precision', type: 'precision' },
    { id: 'floor', name: 'Balance au sol', type: 'floor' },
  ]);
  const [activeScaleId, setActiveScaleId] = useState('main');
  const [showScaleSelector, setShowScaleSelector] = useState(false);

  // ── Smart Alerts state ──
  const [smartAlerts, setSmartAlerts] = useState<Array<{ type: 'warning' | 'danger' | 'reorder'; message: string }>>([]);
  const [inventoryItems, setInventoryItems] = useState<any[]>([]);

  // ── History tab state ──
  const [historySelectedDate, setHistorySelectedDate] = useState<string | null>(null);
  const [historyCalendarMonth, setHistoryCalendarMonth] = useState(() => {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
  });

  const searchRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Load ingredients
  useEffect(() => {
    fetch(`${API}/api/ingredients`, { headers: authHeaders() })
      .then(r => r.ok ? r.json() : [])
      .then(setIngredients)
      .catch(() => {});
  }, []);

  // Load recipes for Recipe Mode
  useEffect(() => {
    fetch(`${API}/api/recipes`, { headers: authHeaders() })
      .then(r => r.ok ? r.json() : [])
      .then(setRecipes)
      .catch(() => {});
  }, []);

  // Load full inventory for smart alerts
  useEffect(() => {
    fetch(`${API}/api/inventory`, { headers: authHeaders() })
      .then(r => r.ok ? r.json() : [])
      .then(setInventoryItems)
      .catch(() => {});
  }, []);

  // Fetch stock when ingredient is selected
  useEffect(() => {
    if (!selected) { setIngredientStock(null); return; }
    setLoadingStock(true);
    fetch(`${API}/api/inventory`, { headers: authHeaders() })
      .then(r => r.ok ? r.json() : [])
      .then((items: any[]) => {
        const item = items.find((i: any) => i.ingredientId === selected.id);
        if (item) {
          setIngredientStock({ stock: item.currentStock, unit: item.unit || selected.unit, itemId: item.id, minStock: item.minStock });
        } else {
          setIngredientStock(null);
        }
      })
      .catch(() => setIngredientStock(null))
      .finally(() => setLoadingStock(false));
  }, [selected]);

  // ── Smart Alerts: check stock levels when weighing ──
  useEffect(() => {
    if (!selected || stockMode !== 'remove') { setSmartAlerts([]); return; }
    const currentWeight = useSimulation ? simWeight : (reading?.weight ?? 0);
    const netW = Math.max(0, currentWeight - tare);
    const netConv = selected ? convertWeight(netW, selected.unit) : 0;
    if (netConv <= 0 || !ingredientStock) { setSmartAlerts([]); return; }

    const alerts: Array<{ type: 'warning' | 'danger' | 'reorder'; message: string }> = [];
    const afterStock = ingredientStock.stock - netConv;

    if (afterStock <= 0) {
      alerts.push({ type: 'danger', message: `Stock de ${selected.name} sera a 0 apres cette pesee !` });
      alerts.push({ type: 'reorder', message: `Commander ${selected.name} chez votre fournisseur ?` });
    } else if (ingredientStock.minStock && afterStock <= ingredientStock.minStock) {
      alerts.push({ type: 'warning', message: `Stock de ${selected.name} passera sous le seuil minimum (${ingredientStock.minStock} ${selected.unit})` });
      const reorderQty = Math.ceil((ingredientStock.minStock * 3) - afterStock);
      if (reorderQty > 0) {
        alerts.push({ type: 'reorder', message: `Commander ${reorderQty} ${selected.unit} de ${selected.name} ?` });
      }
    }

    setSmartAlerts(alerts);
  }, [selected, stockMode, reading, simWeight, tare, useSimulation, ingredientStock]);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setShowDropdown(false);
      }
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  // Connection animation
  useEffect(() => {
    if (status === 'connecting' || status === 'reconnecting') {
      setConnectAnim(true);
    } else {
      const t = setTimeout(() => setConnectAnim(false), 600);
      return () => clearTimeout(t);
    }
  }, [status]);

  const currentWeight = useSimulation ? simWeight : (reading?.weight ?? 0);
  const netWeight = Math.max(0, currentWeight - tare);
  const isStable = useSimulation ? true : (reading?.stable ?? false);

  // Green flash when stable
  useEffect(() => {
    if (netWeight > 0 && isStable && prevWeight !== netWeight) {
      setFlashGreen(true);
      const t = setTimeout(() => setFlashGreen(false), 800);
      setPrevWeight(netWeight);
      return () => clearTimeout(t);
    }
  }, [netWeight, isStable, prevWeight]);

  // Display weight in current display unit
  const displayWeight = useCallback((kg: number): string => {
    if (kg <= 0) return '0';
    if (displayUnit === 'g') return `${Math.round(kg * 1000)}`;
    return `${(Math.round(kg * 1000) / 1000).toFixed(3)}`;
  }, [displayUnit]);

  // Converted weight for selected ingredient
  const netConverted = selected ? convertWeight(netWeight, selected.unit) : (displayUnit === 'g' ? Math.round(netWeight * 1000) : Math.round(netWeight * 1000) / 1000);

  // Current step calculation
  const currentStep = !selected && !quickMode ? 1 : tare === 0 && currentWeight <= 0 ? 2 : netWeight <= 0 ? 3 : netConverted > 0 && selected ? 5 : 4;

  // filteredIngredients alias is set after displayIngredients useMemo below

  function handleTare() {
    setTare(currentWeight);
    showToast('Tare effectuee', 'success');
  }

  function handleTareFromProfile(profile: TareProfile) {
    setTare(profile.weightGrams / 1000);
    setShowTareProfiles(false);
    showToast(`Tare "${profile.name}" appliquee (${profile.weightGrams}g)`, 'success');
  }

  function handleReset() {
    setTare(0);
    setSelected(null);
    setQuickMode(false);
    setSearch('');
    setSmartAlerts([]);
  }

  async function handleValidate() {
    if (quickMode) {
      const entry: HistoryEntry = {
        ingredientName: 'Pesee rapide',
        ingredientCategory: '',
        weight: netConverted,
        unit: displayUnit,
        timestamp: new Date().toISOString(),
        status: 'success',
      };
      const updated = [entry, ...history].slice(0, 200);
      setHistory(updated);
      saveHistory(updated);
      showToast(`Pesee enregistree : ${netConverted} ${displayUnit}`, 'success');
      setTare(0);
      setQuickMode(false);
      return;
    }

    if (!selected || netConverted <= 0) return;
    setSaving(true);
    try {
      const invRes = await fetch(`${API}/api/inventory`, { headers: authHeaders() });
      let entryStatus: 'success' | 'error' = 'success';
      let stockBefore = 0;
      let stockAfter = 0;

      if (invRes.ok) {
        const invItems = await invRes.json();
        const item = invItems.find((i: any) => i.ingredientId === selected.id);

        if (item) {
          stockBefore = item.currentStock;
          let newStock: number;

          if (stockMode === 'add') {
            newStock = item.currentStock + netConverted;
            await fetch(`${API}/api/inventory/${item.id}/restock`, {
              method: 'POST',
              headers: authHeaders(),
              body: JSON.stringify({ quantity: netConverted }),
            });
          } else if (stockMode === 'set') {
            newStock = netConverted;
            await fetch(`${API}/api/inventory/${item.id}`, {
              method: 'PUT',
              headers: authHeaders(),
              body: JSON.stringify({ currentStock: netConverted }),
            });
          } else {
            newStock = Math.max(0, item.currentStock - netConverted);
            await fetch(`${API}/api/inventory/${item.id}`, {
              method: 'PUT',
              headers: authHeaders(),
              body: JSON.stringify({ currentStock: newStock }),
            });
          }

          stockAfter = newStock;
          setIngredientStock({ stock: newStock, unit: item.unit || selected.unit, itemId: item.id, minStock: item.minStock });

          const actionLabel = stockMode === 'add' ? '+' : stockMode === 'set' ? '=' : '-';
          showToast(
            `Stock ${selected.name} : ${actionLabel}${netConverted} ${selected.unit} → ${newStock.toFixed(2)} ${selected.unit}`,
            'success'
          );
        } else {
          if (stockMode === 'remove') {
            showToast(`Pas de stock pour ${selected.name} — impossible de retirer`, 'error');
            entryStatus = 'error';
          } else {
            const createRes = await fetch(`${API}/api/inventory`, {
              method: 'POST',
              headers: authHeaders(),
              body: JSON.stringify({
                ingredientId: selected.id,
                currentStock: netConverted,
                minStock: 0,
                unit: selected.unit,
              }),
            });
            if (createRes.ok) {
              const created = await createRes.json();
              stockAfter = netConverted;
              setIngredientStock({ stock: netConverted, unit: selected.unit, itemId: created.id });
              showToast(`Stock cree pour ${selected.name} : ${netConverted} ${selected.unit}`, 'success');
            } else {
              throw new Error('Erreur creation stock');
            }
          }
        }
      }

      const entry: HistoryEntry = {
        ingredientName: selected.name,
        ingredientCategory: selected.category,
        weight: netConverted,
        unit: selected.unit,
        timestamp: new Date().toISOString(),
        status: entryStatus,
        stockAction: stockMode,
        stockBefore,
        stockAfter,
      };
      const updated = [entry, ...history].slice(0, 200);
      setHistory(updated);
      saveHistory(updated);
      setTare(0);
      setSelected(null);
      setSearch('');
    } catch {
      showToast('Erreur sauvegarde stock', 'error');
      const entry: HistoryEntry = {
        ingredientName: selected.name,
        ingredientCategory: selected.category,
        weight: netConverted,
        unit: selected.unit,
        timestamp: new Date().toISOString(),
        status: 'error',
        stockAction: stockMode,
      };
      const updated = [entry, ...history].slice(0, 200);
      setHistory(updated);
      saveHistory(updated);
    }
    setSaving(false);
  }

  function clearHistory() {
    setHistory([]);
    localStorage.removeItem(HISTORY_KEY);
    showToast('Historique efface', 'success');
  }

  function selectIngredient(ing: Ingredient) {
    setSelected(ing);
    setTare(0);
    setSearch('');
    setShowDropdown(false);
    setQuickMode(false);
    addToRecent(ing.id);
    setRecentIngredientIds(loadRecentIngredients());
  }

  // Daily stats
  const todayStats = (() => {
    const today = new Date().toISOString().slice(0, 10);
    const todayEntries = history.filter(e => e.timestamp.slice(0, 10) === today && e.status === 'success');
    const totalWeighs = todayEntries.length;
    const totalKg = todayEntries.reduce((sum, e) => {
      const w = e.weight;
      const u = e.unit.toLowerCase();
      if (u === 'g') return sum + w / 1000;
      if (u === 'kg') return sum + w;
      if (u === 'l') return sum + w;
      if (u === 'cl') return sum + w / 100;
      if (u === 'ml') return sum + w / 1000;
      return sum + w;
    }, 0);
    const totalValue = todayEntries.reduce((sum, e) => {
      const ing = ingredients.find(i => i.name === e.ingredientName);
      if (!ing) return sum;
      const w = e.weight;
      const u = e.unit.toLowerCase();
      let kgVal = w;
      if (u === 'g') kgVal = w / 1000;
      else if (u === 'cl') kgVal = w / 100;
      else if (u === 'ml') kgVal = w / 1000;
      return sum + kgVal * ing.pricePerUnit;
    }, 0);
    // Most weighed ingredient
    const ingCounts: Record<string, number> = {};
    todayEntries.forEach(e => {
      if (e.ingredientName && e.ingredientName !== 'Pesee rapide') {
        ingCounts[e.ingredientName] = (ingCounts[e.ingredientName] || 0) + 1;
      }
    });
    const mostWeighed = Object.entries(ingCounts).sort((a, b) => b[1] - a[1])[0];
    return {
      totalWeighs,
      totalKg: Math.round(totalKg * 100) / 100,
      totalValue: Math.round(totalValue * 100) / 100,
      mostWeighedName: mostWeighed ? mostWeighed[0] : null,
      mostWeighedCount: mostWeighed ? mostWeighed[1] : 0,
    };
  })();

  // Get unique categories from ingredients
  const ingredientCategories = useMemo(() => {
    const cats = new Set<string>();
    ingredients.forEach(i => { if (i.category) cats.add(i.category); });
    return Array.from(cats).sort();
  }, [ingredients]);

  // Filtered ingredients with category filter
  const displayIngredients = useMemo(() => {
    let list = ingredients;
    if (search) {
      list = list.filter(i =>
        i.name.toLowerCase().includes(search.toLowerCase()) ||
        i.category.toLowerCase().includes(search.toLowerCase())
      );
    }
    if (categoryFilter) {
      list = list.filter(i => i.category === categoryFilter);
    }
    return list;
  }, [ingredients, search, categoryFilter]);

  // Recent ingredients resolved
  const recentIngredients = useMemo(() => {
    return recentIngredientIds
      .map(id => ingredients.find(i => i.id === id))
      .filter(Boolean) as Ingredient[];
  }, [recentIngredientIds, ingredients]);

  // Alias for kiosk mode usage
  const filteredIngredients = displayIngredients;

  const isConnected = status === 'connected' || useSimulation;
  const weightForDisplay = quickMode || !selected
    ? displayWeight(netWeight)
    : `${netConverted}`;
  const unitForDisplay = quickMode || !selected ? displayUnit : (selected?.unit ?? displayUnit);

  // Status label helper
  const statusLabel = (() => {
    switch (status) {
      case 'connected': return 'Connecte';
      case 'connecting': return 'Connexion...';
      case 'reconnecting': return 'Reconnexion...';
      case 'error': return 'Erreur';
      case 'unsupported': return 'Non supporte';
      default: return 'Deconnecte';
    }
  })();

  const statusDotClass = (() => {
    switch (status) {
      case 'connected': return 'bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.6)]';
      case 'connecting':
      case 'reconnecting': return 'bg-teal-400 animate-pulse';
      case 'error':
      case 'unsupported': return 'bg-red-400';
      default: return 'bg-[#F3F4F6] dark:bg-[#171717]';
    }
  })();

  // Kiosk: font size multiplier
  const kf = kioskMode ? 1.3 : 1;

  // ═══════════════════════════════════════════════════════════
  // RECIPE MODE FUNCTIONS
  // ═══════════════════════════════════════════════════════════

  function startRecipeSession(recipe: Recipe) {
    const entries: RecipeWeighEntry[] = recipe.ingredients.map(ri => ({
      ingredientId: ri.ingredientId,
      ingredientName: ri.ingredient.name,
      targetQty: ri.quantity,
      actualQty: null,
      unit: ri.ingredient.unit,
      pricePerUnit: ri.ingredient.pricePerUnit,
      status: 'pending',
    }));
    const session: RecipeSession = {
      recipeId: recipe.id,
      recipeName: recipe.name,
      entries,
      startedAt: new Date().toISOString(),
    };
    setRecipeSession(session);
    setActiveRecipeIngIdx(0);
    // Select the first pending ingredient on the scale
    const firstIng = recipe.ingredients[0]?.ingredient;
    if (firstIng) {
      setSelected({ id: firstIng.id, name: firstIng.name, unit: firstIng.unit, category: firstIng.category, pricePerUnit: firstIng.pricePerUnit });
    }
  }

  function confirmRecipeIngredient() {
    if (!recipeSession || activeRecipeIngIdx === null) return;
    const updated = { ...recipeSession };
    updated.entries = [...updated.entries];
    const netConv = selected ? convertWeight(netWeight, selected.unit) : 0;
    if (netConv <= 0) return;
    updated.entries[activeRecipeIngIdx] = {
      ...updated.entries[activeRecipeIngIdx],
      actualQty: netConv,
      status: 'weighed',
    };
    setRecipeSession(updated);

    // Also log to history
    const entry: HistoryEntry = {
      ingredientName: updated.entries[activeRecipeIngIdx].ingredientName,
      ingredientCategory: selected?.category || '',
      weight: netConv,
      unit: updated.entries[activeRecipeIngIdx].unit,
      timestamp: new Date().toISOString(),
      status: 'success',
      stockAction: 'remove',
      recipeId: updated.recipeId,
      recipeName: updated.recipeName,
    };
    const updatedHist = [entry, ...history].slice(0, 200);
    setHistory(updatedHist);
    saveHistory(updatedHist);

    // Move to next pending ingredient
    const nextIdx = updated.entries.findIndex((e, i) => i > activeRecipeIngIdx! && e.status === 'pending');
    if (nextIdx >= 0) {
      setActiveRecipeIngIdx(nextIdx);
      const nextIng = selectedRecipe?.ingredients[nextIdx]?.ingredient;
      if (nextIng) {
        setSelected({ id: nextIng.id, name: nextIng.name, unit: nextIng.unit, category: nextIng.category, pricePerUnit: nextIng.pricePerUnit });
      }
      setTare(0);
    } else {
      setActiveRecipeIngIdx(null);
    }
    showToast(`${updated.entries[activeRecipeIngIdx].ingredientName} pese !`, 'success');
  }

  function saveRecipeSession() {
    if (!recipeSession) return;
    const updated = [recipeSession, ...recipeSessions].slice(0, 100);
    setRecipeSessions(updated);
    saveRecipeSessions(updated);
    showToast('Pesee de recette sauvegardee !', 'success');
    setRecipeSession(null);
    setActiveRecipeIngIdx(null);
    setSelectedRecipe(null);
    setSelected(null);
  }

  const recipeWeighedCount = recipeSession?.entries.filter(e => e.status === 'weighed').length ?? 0;
  const recipeTotalCount = recipeSession?.entries.length ?? 0;
  const recipeProgress = recipeTotalCount > 0 ? (recipeWeighedCount / recipeTotalCount) * 100 : 0;

  // Recipe cost comparison
  const recipeTheoreticalCost = useMemo(() => {
    if (!recipeSession) return 0;
    return recipeSession.entries.reduce((sum, e) => {
      const u = e.unit.toLowerCase();
      let kgQty = e.targetQty;
      if (u === 'g') kgQty = e.targetQty / 1000;
      else if (u === 'cl') kgQty = e.targetQty / 100;
      else if (u === 'ml') kgQty = e.targetQty / 1000;
      return sum + kgQty * e.pricePerUnit;
    }, 0);
  }, [recipeSession]);

  const recipeActualCost = useMemo(() => {
    if (!recipeSession) return 0;
    return recipeSession.entries.reduce((sum, e) => {
      if (e.actualQty === null) return sum;
      const u = e.unit.toLowerCase();
      let kgQty = e.actualQty;
      if (u === 'g') kgQty = e.actualQty / 1000;
      else if (u === 'cl') kgQty = e.actualQty / 100;
      else if (u === 'ml') kgQty = e.actualQty / 1000;
      return sum + kgQty * e.pricePerUnit;
    }, 0);
  }, [recipeSession]);

  // ═══════════════════════════════════════════════════════════
  // HISTORY TAB: Calendar & Grouped Sessions
  // ═══════════════════════════════════════════════════════════

  const historySessions = useMemo((): WeighingSession[] => {
    const grouped: Record<string, HistoryEntry[]> = {};
    history.forEach(e => {
      const date = e.timestamp.slice(0, 10);
      if (!grouped[date]) grouped[date] = [];
      grouped[date].push(e);
    });
    return Object.entries(grouped).map(([date, entries]) => ({
      date,
      entries,
      totalKg: entries.reduce((sum, e) => {
        const u = e.unit.toLowerCase();
        if (u === 'g') return sum + e.weight / 1000;
        if (u === 'kg') return sum + e.weight;
        if (u === 'cl') return sum + e.weight / 100;
        if (u === 'ml') return sum + e.weight / 1000;
        return sum + e.weight;
      }, 0),
      totalValue: entries.reduce((sum, e) => {
        const ing = ingredients.find(i => i.name === e.ingredientName);
        if (!ing) return sum;
        const u = e.unit.toLowerCase();
        let kgVal = e.weight;
        if (u === 'g') kgVal = e.weight / 1000;
        else if (u === 'cl') kgVal = e.weight / 100;
        else if (u === 'ml') kgVal = e.weight / 1000;
        return sum + kgVal * ing.pricePerUnit;
      }, 0),
    })).sort((a, b) => b.date.localeCompare(a.date));
  }, [history, ingredients]);

  // Calendar dates with weighings
  const calendarDatesWithData = useMemo(() => {
    const dates = new Set<string>();
    history.forEach(e => dates.add(e.timestamp.slice(0, 10)));
    return dates;
  }, [history]);

  // Generate calendar days for the month
  const calendarDays = useMemo(() => {
    const [year, month] = historyCalendarMonth.split('-').map(Number);
    const firstDay = new Date(year, month - 1, 1);
    const lastDay = new Date(year, month, 0);
    const startPad = (firstDay.getDay() + 6) % 7; // Monday = 0
    const days: Array<{ date: string; day: number; isCurrentMonth: boolean; hasData: boolean }> = [];

    // Pad start
    for (let i = startPad - 1; i >= 0; i--) {
      const d = new Date(year, month - 1, -i);
      const ds = d.toISOString().slice(0, 10);
      days.push({ date: ds, day: d.getDate(), isCurrentMonth: false, hasData: calendarDatesWithData.has(ds) });
    }
    // Current month days
    for (let d = 1; d <= lastDay.getDate(); d++) {
      const ds = `${year}-${String(month).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
      days.push({ date: ds, day: d, isCurrentMonth: true, hasData: calendarDatesWithData.has(ds) });
    }
    // Pad end
    const remaining = 7 - (days.length % 7);
    if (remaining < 7) {
      for (let d = 1; d <= remaining; d++) {
        const dd = new Date(year, month, d);
        const ds = dd.toISOString().slice(0, 10);
        days.push({ date: ds, day: d, isCurrentMonth: false, hasData: calendarDatesWithData.has(ds) });
      }
    }
    return days;
  }, [historyCalendarMonth, calendarDatesWithData]);

  function navigateCalendar(dir: -1 | 1) {
    const [y, m] = historyCalendarMonth.split('-').map(Number);
    const d = new Date(y, m - 1 + dir, 1);
    setHistoryCalendarMonth(`${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`);
  }

  const selectedDateEntries = historySelectedDate
    ? history.filter(e => e.timestamp.slice(0, 10) === historySelectedDate)
    : [];

  // ═══════════════════════════════════════════════════════════
  // DAILY REPORT
  // ═══════════════════════════════════════════════════════════

  const dailyReport = useMemo(() => {
    const today = new Date().toISOString().slice(0, 10);
    const todayEntries = history.filter(e => e.timestamp.slice(0, 10) === today);
    const successEntries = todayEntries.filter(e => e.status === 'success');
    const errorEntries = todayEntries.filter(e => e.status === 'error');
    const totalKg = successEntries.reduce((sum, e) => {
      const u = e.unit.toLowerCase();
      if (u === 'g') return sum + e.weight / 1000;
      if (u === 'kg') return sum + e.weight;
      return sum + e.weight;
    }, 0);
    const totalValue = successEntries.reduce((sum, e) => {
      const ing = ingredients.find(i => i.name === e.ingredientName);
      if (!ing) return sum;
      const u = e.unit.toLowerCase();
      let kgVal = e.weight;
      if (u === 'g') kgVal = e.weight / 1000;
      else if (u === 'cl') kgVal = e.weight / 100;
      else if (u === 'ml') kgVal = e.weight / 1000;
      return sum + kgVal * ing.pricePerUnit;
    }, 0);

    // Find discrepancies from recipe sessions today
    const todayRecipeSessions = recipeSessions.filter(s => s.startedAt.slice(0, 10) === today);
    const discrepancies: Array<{ ingredient: string; target: number; actual: number; unit: string; diff: number }> = [];
    todayRecipeSessions.forEach(s => {
      s.entries.forEach(e => {
        if (e.actualQty !== null && e.targetQty > 0) {
          const diffPct = Math.abs(e.actualQty - e.targetQty) / e.targetQty;
          if (diffPct > 0.05) {
            discrepancies.push({
              ingredient: e.ingredientName,
              target: e.targetQty,
              actual: e.actualQty,
              unit: e.unit,
              diff: Math.round(diffPct * 100),
            });
          }
        }
      });
    });

    // Calculate potential losses
    const totalLoss = discrepancies.reduce((sum, d) => {
      const ing = ingredients.find(i => i.name === d.ingredient);
      if (!ing) return sum;
      const overUsed = d.actual - d.target;
      if (overUsed <= 0) return sum;
      const u = d.unit.toLowerCase();
      let kgOver = overUsed;
      if (u === 'g') kgOver = overUsed / 1000;
      else if (u === 'cl') kgOver = overUsed / 100;
      else if (u === 'ml') kgOver = overUsed / 1000;
      return sum + kgOver * ing.pricePerUnit;
    }, 0);

    return {
      totalWeighs: successEntries.length,
      errorCount: errorEntries.length,
      totalKg: Math.round(totalKg * 100) / 100,
      totalValue: Math.round(totalValue * 100) / 100,
      discrepancies,
      totalLoss: Math.round(totalLoss * 100) / 100,
      uniqueIngredients: new Set(successEntries.map(e => e.ingredientName)).size,
    };
  }, [history, ingredients, recipeSessions]);

  // ═══════════════════════════════════════════════════════════
  // TARE PROFILE MANAGEMENT
  // ═══════════════════════════════════════════════════════════

  function addTareProfile() {
    if (!newTareForm.name.trim() || !newTareForm.weightGrams) return;
    const profile: TareProfile = {
      id: `custom-${Date.now()}`,
      name: newTareForm.name.trim(),
      weightGrams: parseFloat(newTareForm.weightGrams),
    };
    const updated = [...tareProfiles, profile];
    setTareProfiles(updated);
    saveTareProfiles(updated);
    setNewTareForm({ name: '', weightGrams: '' });
    showToast(`Profil tare "${profile.name}" ajoute`, 'success');
  }

  function removeTareProfile(id: string) {
    const updated = tareProfiles.filter(p => p.id !== id);
    setTareProfiles(updated);
    saveTareProfiles(updated);
  }

  // ═══════════════════════════════════════════════════════════
  // RENDER
  // ═══════════════════════════════════════════════════════════

  return (
    <div className={`min-h-screen lg:h-screen bg-gradient-to-b from-white dark:from-black via-white dark:via-black to-white dark:to-black text-white flex flex-col select-none lg:overflow-hidden ${kioskMode ? 'kiosk-mode' : ''}`}>

      {/* ===== TOP BAR ===== */}
      <header className={`flex flex-wrap items-center justify-between gap-2 px-3 sm:px-4 bg-white dark:bg-black/80 border-b border-[#E5E7EB] dark:border-[#1A1A1A]/60 backdrop-blur-sm ${kioskMode ? 'py-1.5' : 'py-2 sm:py-3'}`}>
        <div className="flex items-center gap-2 sm:gap-3">
          {!kioskMode && (
            <button
              onClick={() => navigate('/')}
              className="flex items-center gap-2 px-4 py-2.5 min-h-[48px] bg-[#FAFAFA] dark:bg-[#0A0A0A] hover:bg-[#F3F4F6] dark:hover:bg-[#171717] rounded-xl text-[#111111] dark:text-white font-medium text-sm transition-all active:scale-95"
            >
              <ArrowLeft className="w-5 h-5" />
              <span className="hidden sm:inline">Retour</span>
            </button>
          )}
          <div className="flex items-center gap-2">
            <Scale className={`text-emerald-400 ${kioskMode ? 'w-7 h-7' : 'w-5 h-5 sm:w-6 sm:h-6'}`} />
            <span className={`font-bold text-[#111111] dark:text-white tracking-tight ${kioskMode ? 'text-xl' : 'text-base sm:text-lg'}`}>Station Balance</span>
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          {/* Connection status */}
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#FAFAFA] dark:bg-[#0A0A0A]/60 border border-[#E5E7EB] dark:border-[#1A1A1A]/50">
            <div className={`w-2.5 h-2.5 rounded-full transition-colors duration-300 ${statusDotClass}`} />
            <span className="text-xs text-[#9CA3AF] dark:text-[#737373] hidden sm:inline">
              {useSimulation ? 'Mode Simule' : statusLabel}
              {status === 'connected' && deviceName && !useSimulation && (
                <span className="ml-1 text-emerald-400">({deviceName})</span>
              )}
            </span>
          </div>

          {/* Multi-Scale selector */}
          <div className="relative">
            <button
              onClick={() => setShowScaleSelector(s => !s)}
              className="flex items-center gap-1.5 px-3 py-2.5 min-h-[48px] rounded-xl text-sm font-medium bg-[#FAFAFA] dark:bg-[#0A0A0A] text-[#9CA3AF] dark:text-[#737373] hover:bg-[#F3F4F6] dark:hover:bg-[#171717] border border-[#E5E7EB] dark:border-[#1A1A1A]/50 transition-all active:scale-95"
              title="Changer de balance"
            >
              <Router className="w-4 h-4" />
              <span className="hidden lg:inline">{scaleProfiles.find(s => s.id === activeScaleId)?.name?.split(' ').pop()}</span>
              <ChevronDown className="w-3 h-3" />
            </button>
            {showScaleSelector && (
              <div className="absolute right-0 top-full mt-1 w-64 bg-white dark:bg-[#111111] border border-[#E5E7EB] dark:border-[#1A1A1A] rounded-xl shadow-2xl z-30 overflow-hidden">
                <div className="px-3 py-2 border-b border-[#E5E7EB] dark:border-[#1A1A1A]">
                  <p className="text-xs font-semibold text-[#6B7280] dark:text-[#A3A3A3] uppercase tracking-wider">Balances disponibles</p>
                </div>
                {scaleProfiles.map(sp => (
                  <button
                    key={sp.id}
                    onClick={() => { setActiveScaleId(sp.id); setShowScaleSelector(false); showToast(`Balance "${sp.name}" selectionnee`, 'success'); }}
                    className={`w-full flex items-center gap-3 px-3 py-3 min-h-[48px] text-left transition-all hover:bg-[#FAFAFA] dark:hover:bg-[#171717] ${activeScaleId === sp.id ? 'bg-emerald-900/20' : ''}`}
                  >
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                      sp.type === 'precision' ? 'bg-purple-900/30 text-purple-400' :
                      sp.type === 'floor' ? 'bg-orange-900/30 text-orange-400' :
                      'bg-teal-900/30 text-teal-400'
                    }`}>
                      <Scale className="w-4 h-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-[#111111] dark:text-white truncate">{sp.name}</p>
                      <p className="text-[10px] text-[#9CA3AF] dark:text-[#737373]">
                        {sp.type === 'precision' ? 'Pour epices, herbes' : sp.type === 'floor' ? 'Pour sacs, cartons' : 'Usage general'}
                      </p>
                    </div>
                    {activeScaleId === sp.id && <Check className="w-4 h-4 text-emerald-400 shrink-0" />}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Mode toggle */}
          <button
            onClick={() => setUseSimulation(s => !s)}
            className={`px-3 py-2.5 min-h-[48px] rounded-xl text-sm font-medium transition-all active:scale-95 ${
              useSimulation ? 'bg-amber-600/80 text-[#111111] dark:text-white border border-amber-500/50' : 'bg-[#FAFAFA] dark:bg-[#0A0A0A] text-[#9CA3AF] dark:text-[#737373] hover:bg-[#F3F4F6] dark:hover:bg-[#171717] border border-[#E5E7EB] dark:border-[#1A1A1A]/50'
            }`}
          >
            {useSimulation ? 'Mode Simule' : 'Mode Bluetooth'}
          </button>

          {/* Connect / Disconnect */}
          {!useSimulation && (
            <button
              onClick={status === 'connected' ? disconnect : connect}
              disabled={status === 'connecting' || status === 'reconnecting'}
              className={`flex items-center gap-2 px-4 py-2.5 min-h-[48px] rounded-xl font-medium text-sm transition-all active:scale-95 ${
                connectAnim ? 'animate-pulse' : ''
              } ${
                status === 'connected' ? 'bg-emerald-600 hover:bg-emerald-500 text-white' :
                status === 'connecting' || status === 'reconnecting' ? 'bg-teal-700 text-[#111111] dark:text-white cursor-wait' :
                status === 'error' || status === 'unsupported' ? 'bg-red-600 hover:bg-red-500 text-white' :
                'bg-[#111111] dark:bg-white hover:bg-[#333] dark:hover:bg-[#E5E5E5] text-white dark:text-black'
              }`}
            >
              {status === 'connected' ? <Wifi className="w-5 h-5" /> :
               status === 'connecting' || status === 'reconnecting' ? <Bluetooth className="w-5 h-5 animate-spin" /> :
               <BluetoothOff className="w-5 h-5" />}
              <span className="hidden sm:inline">
                {status === 'connected' ? 'Deconnecter' :
                 status === 'connecting' ? 'Connexion...' :
                 status === 'reconnecting' ? 'Reconnexion...' :
                 'Connecter une balance'}
              </span>
            </button>
          )}

          {/* Kiosk toggle */}
          <button
            onClick={() => setKioskMode(k => !k)}
            className={`p-2.5 min-h-[48px] min-w-[48px] flex items-center justify-center rounded-xl transition-all active:scale-95 ${
              kioskMode
                ? 'bg-teal-600 text-white border border-teal-500/50'
                : 'bg-[#FAFAFA] dark:bg-[#0A0A0A] text-[#9CA3AF] dark:text-[#737373] hover:bg-[#F3F4F6] dark:hover:bg-[#171717] border border-[#E5E7EB] dark:border-[#1A1A1A]/50'
            }`}
            title={kioskMode ? 'Quitter Mode Kiosque' : 'Mode Kiosque'}
          >
            {kioskMode ? <Minimize className="w-5 h-5" /> : <Maximize className="w-5 h-5" />}
          </button>

          {/* Settings */}
          <button
            onClick={() => setShowSettings(s => !s)}
            className="p-2.5 min-h-[48px] min-w-[48px] flex items-center justify-center rounded-xl bg-[#FAFAFA] dark:bg-[#0A0A0A] text-[#9CA3AF] dark:text-[#737373] hover:bg-[#F3F4F6] dark:hover:bg-[#171717] border border-[#E5E7EB] dark:border-[#1A1A1A]/50 transition-all active:scale-95"
            title="Parametres"
          >
            <Settings className="w-5 h-5" />
          </button>
        </div>
      </header>

      {/* Settings dropdown */}
      {showSettings && (
        <div className="px-4 py-3 bg-[#FAFAFA] dark:bg-[#0A0A0A]/90 border-b border-[#E5E7EB] dark:border-[#1A1A1A]/60 flex flex-wrap items-center gap-4 text-sm">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={autoReconnect}
              onChange={e => setAutoReconnect(e.target.checked)}
              className="w-5 h-5 accent-teal-500 rounded"
            />
            <span className="text-[#6B7280] dark:text-[#A3A3A3]">Reconnexion auto Bluetooth</span>
          </label>
          <div className="flex items-center gap-2 text-[#6B7280] dark:text-[#A3A3A3]">
            <Bluetooth className="w-4 h-4" />
            <span>Type : {scaleType === 'mi-scale' ? 'Mi Scale 2' : scaleType === 'generic' ? 'Balance BLE Standard' : 'Non detecte'}</span>
          </div>
          {!isSupported && (
            <div className="flex items-center gap-2 text-amber-400 text-xs">
              <AlertTriangle className="w-4 h-4" />
              Web Bluetooth non supporte. Utilisez Chrome (Android/Desktop) en HTTPS.
            </div>
          )}
          <button
            onClick={() => setShowSettings(false)}
            className="ml-auto p-2 hover:bg-[#F3F4F6] dark:hover:bg-[#171717] rounded-lg transition-colors"
          >
            <X className="w-4 h-4 text-[#9CA3AF] dark:text-[#737373]" />
          </button>
        </div>
      )}

      {/* Error / reconnecting banner */}
      {error && !useSimulation && (
        <div className="flex items-center gap-2 px-6 py-2.5 bg-red-900/40 text-red-300 text-sm border-b border-red-800/50">
          <AlertTriangle className="w-4 h-4 shrink-0" />
          {error}
          {status === 'error' && (
            <button
              onClick={connect}
              className="ml-auto flex items-center gap-1.5 px-3 py-1.5 bg-red-800/60 hover:bg-red-700/60 rounded-lg text-xs font-medium transition-colors"
            >
              <RefreshCw className="w-3.5 h-3.5" /> Reessayer
            </button>
          )}
        </div>
      )}
      {status === 'reconnecting' && !useSimulation && (
        <div className="flex items-center gap-2 px-6 py-2.5 bg-teal-900/40 text-teal-300 text-sm border-b border-teal-800/50">
          <RefreshCw className="w-4 h-4 shrink-0 animate-spin" />
          Reconnexion en cours... La balance a ete deconnectee.
        </div>
      )}

      {/* Smart Alerts Banner */}
      {smartAlerts.length > 0 && mainTab === 'peser' && (
        <div className="px-4 py-2 bg-amber-900/20 border-b border-amber-500/20 space-y-1">
          {smartAlerts.map((alert, i) => (
            <div key={i} className={`flex items-center gap-2 text-sm ${
              alert.type === 'danger' ? 'text-red-400' :
              alert.type === 'reorder' ? 'text-teal-400' :
              'text-amber-400'
            }`}>
              {alert.type === 'danger' ? <AlertCircle className="w-4 h-4 shrink-0" /> :
               alert.type === 'reorder' ? <Package className="w-4 h-4 shrink-0" /> :
               <AlertTriangle className="w-4 h-4 shrink-0" />}
              <span>{alert.message}</span>
              {alert.type === 'reorder' && (
                <button
                  onClick={() => showToast('Demande de commande enregistree', 'success')}
                  className="ml-auto px-3 py-1 bg-teal-600 hover:bg-teal-500 text-white text-xs rounded-lg font-medium transition-all active:scale-95"
                >
                  Commander
                </button>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Camera placeholder modal */}
      {showCameraPlaceholder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm" onClick={() => setShowCameraPlaceholder(false)}>
          <div className="bg-white dark:bg-[#111111] rounded-2xl p-6 max-w-sm mx-4 text-center border border-[#E5E7EB] dark:border-[#1A1A1A]" onClick={e => e.stopPropagation()}>
            <Camera className="w-16 h-16 text-teal-500 mx-auto mb-4" />
            <h3 className="text-lg font-bold text-[#111111] dark:text-white mb-2">Scanner code-barres</h3>
            <p className="text-sm text-[#6B7280] dark:text-[#A3A3A3] mb-4">
              Cette fonctionnalite utilisera la camera de votre tablette pour scanner les codes-barres
              des ingredients et les selectionner automatiquement.
            </p>
            <button
              onClick={() => setShowCameraPlaceholder(false)}
              className="px-6 py-3 min-h-[48px] bg-teal-600 hover:bg-teal-500 text-white rounded-xl font-medium transition-all active:scale-95 w-full"
            >
              Fermer
            </button>
          </div>
        </div>
      )}

      {/* ===== TAB NAVIGATION ===== */}
      {!kioskMode && (
        <div className="flex items-center gap-1 px-3 sm:px-4 py-2 bg-[#FAFAFA]/50 dark:bg-[#0A0A0A]/50 border-b border-[#E5E7EB] dark:border-[#1A1A1A]/60 overflow-x-auto scrollbar-none">
          {([
            { id: 'peser' as MainTab, label: 'Peser', icon: Scale },
            { id: 'recette' as MainTab, label: 'Peser une recette', icon: BookOpen },
            { id: 'historique' as MainTab, label: 'Historique des pesees', icon: Calendar },
            { id: 'rapport' as MainTab, label: 'Rapport du jour', icon: BarChart3 },
          ]).map(tab => (
            <button
              key={tab.id}
              onClick={() => setMainTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2.5 min-h-[44px] rounded-xl text-sm font-medium transition-all active:scale-95 whitespace-nowrap ${
                mainTab === tab.id
                  ? 'bg-emerald-600/20 text-emerald-400 border border-emerald-500/30'
                  : 'text-[#6B7280] dark:text-[#A3A3A3] hover:bg-[#F3F4F6] dark:hover:bg-[#171717] border border-transparent'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </div>
      )}

      {/* ===== STEP INDICATOR (only for peser tab, hidden in kiosk) ===== */}
      {mainTab === 'peser' && !quickMode && !kioskMode && (
        <div className="flex items-center justify-center gap-1 px-4 py-3 bg-[#FAFAFA]/50 dark:bg-[#0A0A0A]/50 border-b border-[#E5E7EB] dark:border-[#1A1A1A]/60">
          {STEPS.map((step, idx) => {
            const active = currentStep === step.num;
            const done = currentStep > step.num;
            const Icon = step.icon;
            return (
              <div key={step.num} className="flex items-center">
                <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all duration-300 ${
                  active ? 'bg-emerald-600/30 text-emerald-300 border border-emerald-500/40' :
                  done ? 'bg-[#F3F4F6] dark:bg-[#171717]/40 text-emerald-400' :
                  'bg-[#FAFAFA]/30 dark:bg-[#0A0A0A]/30 text-[#6B7280] dark:text-[#A3A3A3]'
                }`}>
                  <Icon className="w-4 h-4" />
                  <span className="text-xs font-medium hidden sm:inline">{step.label}</span>
                  <span className="text-xs font-bold sm:hidden">{step.num}</span>
                </div>
                {idx < STEPS.length - 1 && (
                  <div className={`w-6 h-0.5 mx-1 rounded transition-colors ${done ? 'bg-emerald-500/60' : 'bg-[#F3F4F6] dark:bg-[#171717]/40'}`} />
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* ═══════════════════════════════════════════════════════════ */}
      {/* TAB: PESER (original weighing interface) */}
      {/* ═══════════════════════════════════════════════════════════ */}
      {mainTab === 'peser' && (
        <div className="flex-1 flex flex-col lg:flex-row overflow-y-auto lg:overflow-hidden">
          {/* LEFT PANEL */}
          {!kioskMode && (
            <div className="max-h-[50vh] lg:max-h-none lg:w-80 xl:w-96 bg-white dark:bg-black/40 border-b lg:border-b-0 lg:border-r border-[#E5E7EB] dark:border-[#1A1A1A]/60 flex flex-col overflow-hidden shrink-0">
              {/* Quick actions */}
              <div className="p-3 border-b border-[#E5E7EB] dark:border-[#1A1A1A]/60 flex overflow-x-auto sm:grid sm:grid-cols-5 gap-2 scrollbar-none">
                <button
                  onClick={() => { setQuickMode(true); setSelected(null); setSearch(''); }}
                  className={`flex flex-col items-center gap-1 px-3 py-3 min-h-[48px] min-w-[90px] shrink-0 sm:min-w-0 sm:shrink rounded-xl text-xs font-medium transition-all active:scale-95 ${
                    quickMode ? 'bg-amber-600/30 text-amber-300 border border-amber-500/40' : 'bg-[#FAFAFA] dark:bg-[#0A0A0A]/60 text-[#9CA3AF] dark:text-[#737373] hover:bg-[#F3F4F6] dark:hover:bg-[#171717]/60 border border-[#E5E7EB] dark:border-[#1A1A1A]/40'
                  }`}
                >
                  <Zap className="w-5 h-5" />
                  Rapide
                </button>
                <button
                  onClick={() => setShowNewIngredient(true)}
                  className="flex flex-col items-center gap-1 px-3 py-3 min-h-[48px] min-w-[90px] shrink-0 sm:min-w-0 sm:shrink rounded-xl text-xs font-medium bg-emerald-800/40 text-emerald-300 hover:bg-emerald-700/40 border border-emerald-600/30 transition-all active:scale-95"
                >
                  <PlusCircle className="w-5 h-5" />
                  Nouveau
                </button>
                <button
                  onClick={() => setShowCameraPlaceholder(true)}
                  className="flex flex-col items-center gap-1 px-3 py-3 min-h-[48px] min-w-[90px] shrink-0 sm:min-w-0 sm:shrink rounded-xl text-xs font-medium bg-[#FAFAFA] dark:bg-[#0A0A0A]/60 text-[#9CA3AF] dark:text-[#737373] hover:bg-[#F3F4F6] dark:hover:bg-[#171717]/60 border border-[#E5E7EB] dark:border-[#1A1A1A]/40 transition-all active:scale-95"
                >
                  <Camera className="w-5 h-5" />
                  Scanner
                </button>
                <button
                  onClick={() => setShowTareProfiles(s => !s)}
                  className={`flex flex-col items-center gap-1 px-3 py-3 min-h-[48px] min-w-[90px] shrink-0 sm:min-w-0 sm:shrink rounded-xl text-xs font-medium transition-all active:scale-95 ${
                    showTareProfiles ? 'bg-purple-600/30 text-purple-300 border border-purple-500/40' : 'bg-[#FAFAFA] dark:bg-[#0A0A0A]/60 text-[#9CA3AF] dark:text-[#737373] hover:bg-[#F3F4F6] dark:hover:bg-[#171717]/60 border border-[#E5E7EB] dark:border-[#1A1A1A]/40'
                  }`}
                >
                  <Weight className="w-5 h-5" />
                  Tare
                </button>
                <button
                  onClick={() => setMainTab('recette')}
                  className="flex flex-col items-center gap-1 px-3 py-3 min-h-[48px] min-w-[90px] shrink-0 sm:min-w-0 sm:shrink rounded-xl text-xs font-medium bg-[#FAFAFA] dark:bg-[#0A0A0A]/60 text-[#9CA3AF] dark:text-[#737373] hover:bg-[#F3F4F6] dark:hover:bg-[#171717]/60 border border-[#E5E7EB] dark:border-[#1A1A1A]/40 transition-all active:scale-95"
                >
                  <ChefHat className="w-5 h-5" />
                  Recettes
                </button>
              </div>

              {/* ── Tare Profiles Panel ── */}
              {showTareProfiles && (
                <div className="p-3 border-b border-[#E5E7EB] dark:border-[#1A1A1A]/60 bg-purple-900/10">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-sm font-semibold text-purple-300 flex items-center gap-2"><Weight className="w-4 h-4" /> Profils de tare</p>
                    <button onClick={() => setShowTareProfiles(false)} className="p-1 hover:bg-[#F3F4F6] dark:hover:bg-[#171717] rounded-lg transition-colors">
                      <X className="w-4 h-4 text-[#9CA3AF] dark:text-[#737373]" />
                    </button>
                  </div>
                  <div className="grid grid-cols-2 gap-1.5 mb-2">
                    {tareProfiles.map(tp => (
                      <button
                        key={tp.id}
                        onClick={() => handleTareFromProfile(tp)}
                        className="flex items-center justify-between gap-1 px-2.5 py-2.5 min-h-[44px] bg-[#FAFAFA] dark:bg-[#0A0A0A]/80 hover:bg-purple-900/20 rounded-lg border border-[#E5E7EB] dark:border-[#1A1A1A]/50 transition-all active:scale-95 text-left group"
                      >
                        <div className="min-w-0 flex-1">
                          <p className="text-xs font-medium text-[#111111] dark:text-white truncate">{tp.name}</p>
                          <p className="text-[10px] text-purple-400 font-bold">{tp.weightGrams}g</p>
                        </div>
                        {tp.id.startsWith('custom-') && (
                          <button
                            onClick={e => { e.stopPropagation(); removeTareProfile(tp.id); }}
                            className="opacity-0 group-hover:opacity-100 p-1 text-red-400 hover:bg-red-900/30 rounded transition-all"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        )}
                      </button>
                    ))}
                  </div>
                  <div className="flex gap-1.5">
                    <input
                      type="text"
                      placeholder="Nom..."
                      value={newTareForm.name}
                      onChange={e => setNewTareForm(f => ({ ...f, name: e.target.value }))}
                      className="flex-1 px-2.5 py-2 min-h-[40px] bg-[#FAFAFA] dark:bg-[#0A0A0A]/80 rounded-lg text-[#111111] dark:text-white text-xs placeholder-[#9CA3AF] dark:placeholder-[#737373] border border-[#E5E7EB] dark:border-[#1A1A1A]/50 focus:outline-none focus:ring-1 focus:ring-purple-500/60"
                    />
                    <input
                      type="number"
                      placeholder="Poids (g)"
                      value={newTareForm.weightGrams}
                      onChange={e => setNewTareForm(f => ({ ...f, weightGrams: e.target.value }))}
                      className="w-20 px-2.5 py-2 min-h-[40px] bg-[#FAFAFA] dark:bg-[#0A0A0A]/80 rounded-lg text-[#111111] dark:text-white text-xs placeholder-[#9CA3AF] dark:placeholder-[#737373] border border-[#E5E7EB] dark:border-[#1A1A1A]/50 focus:outline-none focus:ring-1 focus:ring-purple-500/60"
                    />
                    <button
                      onClick={addTareProfile}
                      disabled={!newTareForm.name.trim() || !newTareForm.weightGrams}
                      className="px-3 py-2 min-h-[40px] bg-purple-600 hover:bg-purple-500 disabled:opacity-40 text-white rounded-lg text-xs font-medium transition-all active:scale-95"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                  {tare > 0 && (
                    <div className="mt-2 flex items-center gap-2 text-xs text-purple-300">
                      <Check className="w-3 h-3" />
                      Tare active : {(tare * 1000).toFixed(0)}g
                    </div>
                  )}
                </div>
              )}

              {/* New ingredient mini form */}
              {showNewIngredient && (
                <div className="p-3 border-b border-[#E5E7EB] dark:border-[#1A1A1A]/60 bg-emerald-900/20">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-sm font-semibold text-emerald-300">Nouvel ingredient</p>
                    <button onClick={() => setShowNewIngredient(false)} className="p-1 hover:bg-[#F3F4F6] dark:hover:bg-[#171717] rounded-lg transition-colors">
                      <X className="w-4 h-4 text-[#9CA3AF] dark:text-[#737373]" />
                    </button>
                  </div>
                  <div className="space-y-2">
                    <input
                      type="text"
                      placeholder="Nom *"
                      value={newIngForm.name}
                      onChange={e => setNewIngForm(f => ({ ...f, name: e.target.value }))}
                      className="w-full px-3 py-2.5 min-h-[44px] bg-[#FAFAFA] dark:bg-[#0A0A0A]/80 rounded-lg text-[#111111] dark:text-white text-sm placeholder-[#9CA3AF] dark:placeholder-[#737373] focus:outline-none focus:ring-2 focus:ring-emerald-500/60 border border-[#E5E7EB] dark:border-[#1A1A1A]/50"
                    />
                    <div className="grid grid-cols-2 gap-2">
                      <select
                        value={newIngForm.category}
                        onChange={e => setNewIngForm(f => ({ ...f, category: e.target.value }))}
                        className="px-3 py-2.5 min-h-[44px] bg-[#FAFAFA] dark:bg-[#0A0A0A]/80 rounded-lg text-[#111111] dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/60 border border-[#E5E7EB] dark:border-[#1A1A1A]/50"
                      >
                        {['Viandes', 'Poissons', 'Legumes', 'Fruits', 'Produits laitiers', 'Epicerie', 'Autres'].map(c => (
                          <option key={c} value={c}>{c}</option>
                        ))}
                      </select>
                      <select
                        value={newIngForm.unit}
                        onChange={e => setNewIngForm(f => ({ ...f, unit: e.target.value }))}
                        className="px-3 py-2.5 min-h-[44px] bg-[#FAFAFA] dark:bg-[#0A0A0A]/80 rounded-lg text-[#111111] dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/60 border border-[#E5E7EB] dark:border-[#1A1A1A]/50"
                      >
                        {['kg', 'g', 'L', 'cl', 'ml', 'piece'].map(u => (
                          <option key={u} value={u}>{u}</option>
                        ))}
                      </select>
                    </div>
                    <input
                      type="number"
                      step="0.01"
                      placeholder="Prix / unite (EUR) *"
                      value={newIngForm.pricePerUnit}
                      onChange={e => setNewIngForm(f => ({ ...f, pricePerUnit: e.target.value }))}
                      className="w-full px-3 py-2.5 min-h-[44px] bg-[#FAFAFA] dark:bg-[#0A0A0A]/80 rounded-lg text-[#111111] dark:text-white text-sm placeholder-[#9CA3AF] dark:placeholder-[#737373] focus:outline-none focus:ring-2 focus:ring-emerald-500/60 border border-[#E5E7EB] dark:border-[#1A1A1A]/50"
                    />
                    <button
                      disabled={!newIngForm.name.trim() || !newIngForm.pricePerUnit || creatingIngredient}
                      onClick={async () => {
                        setCreatingIngredient(true);
                        try {
                          const res = await fetch(`${API}/api/ingredients`, {
                            method: 'POST',
                            headers: authHeaders(),
                            body: JSON.stringify({
                              name: newIngForm.name.trim(),
                              category: newIngForm.category,
                              unit: newIngForm.unit,
                              pricePerUnit: parseFloat(newIngForm.pricePerUnit),
                              allergens: [],
                            }),
                          });
                          if (!res.ok) throw new Error('Erreur creation');
                          const created = await res.json();
                          const newIng: Ingredient = { id: created.id, name: created.name, unit: created.unit, category: created.category, pricePerUnit: created.pricePerUnit };
                          setIngredients(prev => [...prev, newIng]);
                          selectIngredient(newIng);
                          setShowNewIngredient(false);
                          setNewIngForm({ name: '', category: 'Legumes', unit: 'kg', pricePerUnit: '' });
                          showToast(`Ingredient "${created.name}" cree et selectionne`, 'success');
                        } catch {
                          showToast('Erreur lors de la creation de l\'ingredient', 'error');
                        }
                        setCreatingIngredient(false);
                      }}
                      className="w-full flex items-center justify-center gap-2 px-4 py-3 min-h-[48px] bg-emerald-600 hover:bg-emerald-500 disabled:opacity-40 disabled:cursor-not-allowed rounded-xl text-white font-medium text-sm transition-all active:scale-95"
                    >
                      <PlusCircle className="w-4 h-4" />
                      {creatingIngredient ? 'Creation...' : 'Creer et selectionner'}
                    </button>
                  </div>
                </div>
              )}

              {/* Ingredient search */}
              <div className="p-3 border-b border-[#E5E7EB] dark:border-[#1A1A1A]/60" ref={dropdownRef}>
                <div className="relative">
                  <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#9CA3AF] dark:text-[#737373] pointer-events-none" />
                  <input
                    ref={searchRef}
                    type="text"
                    value={search}
                    onChange={e => { setSearch(e.target.value); setShowDropdown(true); setCategoryFilter(null); }}
                    onFocus={() => setShowDropdown(true)}
                    placeholder="Rechercher un ingredient..."
                    className="w-full pl-10 pr-10 py-3 min-h-[48px] bg-[#FAFAFA] dark:bg-[#0A0A0A]/80 rounded-xl text-[#111111] dark:text-white placeholder-[#9CA3AF] dark:placeholder-[#737373] text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/60 border border-[#E5E7EB] dark:border-[#1A1A1A]/50"
                  />
                  {search && (
                    <button
                      onClick={() => { setSearch(''); setCategoryFilter(null); }}
                      className="absolute right-3 top-1/2 -translate-y-1/2 p-1 hover:bg-[#F3F4F6] dark:hover:bg-[#171717] rounded-lg transition-colors"
                    >
                      <X className="w-3.5 h-3.5 text-[#9CA3AF] dark:text-[#737373]" />
                    </button>
                  )}
                </div>

                {/* Recent ingredients chips */}
                {recentIngredients.length > 0 && !search && (
                  <div className="mt-2">
                    <p className="text-[10px] text-[#9CA3AF] dark:text-[#737373] uppercase tracking-wider font-semibold mb-1.5 flex items-center gap-1">
                      <Clock className="w-3 h-3" /> Recents
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                      {recentIngredients.map(ing => (
                        <button
                          key={`recent-${ing.id}`}
                          onClick={() => selectIngredient(ing)}
                          className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all active:scale-95 ${
                            selected?.id === ing.id
                              ? 'bg-emerald-600/30 text-emerald-300 border border-emerald-500/40'
                              : 'bg-[#FAFAFA] dark:bg-[#0A0A0A]/60 text-[#6B7280] dark:text-[#A3A3A3] border border-[#E5E7EB] dark:border-[#1A1A1A]/40 hover:bg-emerald-900/10 hover:border-emerald-500/20 hover:text-emerald-400'
                          }`}
                        >
                          <span className="truncate max-w-[100px]">{ing.name}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Category filter tabs */}
                {!search && ingredientCategories.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-1">
                    <button
                      onClick={() => setCategoryFilter(null)}
                      className={`px-2 py-1 rounded-lg text-[10px] font-semibold transition-all ${
                        !categoryFilter
                          ? 'bg-[#111111] dark:bg-white text-white dark:text-[#111111]'
                          : 'bg-[#FAFAFA] dark:bg-[#0A0A0A]/60 text-[#9CA3AF] dark:text-[#737373] hover:bg-[#F3F4F6] dark:hover:bg-[#171717] border border-[#E5E7EB] dark:border-[#1A1A1A]/40'
                      }`}
                    >
                      Tous
                    </button>
                    {ingredientCategories.map(cat => (
                      <button
                        key={cat}
                        onClick={() => setCategoryFilter(categoryFilter === cat ? null : cat)}
                        className={`px-2 py-1 rounded-lg text-[10px] font-semibold transition-all ${
                          categoryFilter === cat
                            ? 'bg-[#111111] dark:bg-white text-white dark:text-[#111111]'
                            : `${getCategoryColor(cat)} hover:opacity-80`
                        }`}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Ingredient list */}
              <div className="flex-1 overflow-y-auto py-1 px-2 space-y-0.5">
                {displayIngredients.map(ing => (
                  <button
                    key={ing.id}
                    onClick={() => selectIngredient(ing)}
                    className={`w-full flex items-center justify-between px-3 py-3 min-h-[48px] rounded-xl text-left transition-all active:scale-[0.98] ${
                      selected?.id === ing.id
                        ? 'bg-emerald-600/30 text-white border border-emerald-500/40'
                        : 'hover:bg-[#FAFAFA] dark:hover:bg-[#0A0A0A]/60 text-[#6B7280] dark:text-[#A3A3A3] border border-transparent'
                    }`}
                  >
                    <div className="min-w-0 flex-1">
                      <p className="font-medium text-sm truncate">{ing.name}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className={`text-[10px] px-1.5 py-0.5 rounded border ${getCategoryColor(ing.category)}`}>
                          {ing.category}
                        </span>
                        <span className="text-[10px] text-[#9CA3AF] dark:text-[#737373]">{ing.unit}</span>
                        <span className="text-[10px] text-teal-400">{formatCurrency(ing.pricePerUnit ?? 0)}/{ing.unit === 'g' ? 'kg' : ing.unit === 'cl' ? 'L' : ing.unit === 'ml' ? 'L' : ing.unit}</span>
                      </div>
                    </div>
                    {selected?.id === ing.id && (
                      <CircleDot className="w-4 h-4 text-emerald-400 shrink-0 ml-2" />
                    )}
                  </button>
                ))}
                {displayIngredients.length === 0 && (search || categoryFilter) && (
                  <div className="text-center py-8">
                    <p className="text-[#6B7280] dark:text-[#A3A3A3] text-sm">Aucun resultat</p>
                    {categoryFilter && (
                      <button
                        onClick={() => setCategoryFilter(null)}
                        className="mt-2 text-xs text-teal-400 hover:underline"
                      >
                        Voir tous les ingredients
                      </button>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* CENTER: Scale display */}
          <div className={`flex-1 flex flex-col items-center justify-center gap-3 sm:gap-5 px-3 sm:px-4 py-4 sm:py-6 relative overflow-hidden ${kioskMode ? 'gap-6' : ''}`}>
            {/* Kiosk: quick ingredient selector */}
            {kioskMode && (
              <div className="w-full max-w-2xl flex items-center gap-2">
                <div className="relative flex-1">
                  <Search className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-[#9CA3AF] dark:text-[#737373] pointer-events-none" />
                  <input
                    type="text"
                    value={search}
                    onChange={e => { setSearch(e.target.value); setShowDropdown(true); }}
                    onFocus={() => setShowDropdown(true)}
                    placeholder="Rechercher un ingredient..."
                    className="w-full pl-12 pr-4 py-4 min-h-[56px] bg-[#FAFAFA] dark:bg-[#0A0A0A]/80 rounded-2xl text-[#111111] dark:text-white placeholder-[#9CA3AF] dark:placeholder-[#737373] text-lg focus:outline-none focus:ring-2 focus:ring-teal-500/60 border border-[#E5E7EB] dark:border-[#1A1A1A]/50"
                  />
                  {showDropdown && search && filteredIngredients.length > 0 && (
                    <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-[#111111] border border-[#E5E7EB] dark:border-[#1A1A1A] rounded-2xl shadow-2xl max-h-60 overflow-y-auto z-20">
                      {filteredIngredients.slice(0, 8).map(ing => (
                        <button
                          key={ing.id}
                          onClick={() => { selectIngredient(ing); setShowDropdown(false); }}
                          className="w-full flex items-center justify-between px-4 py-4 min-h-[56px] hover:bg-[#FAFAFA] dark:hover:bg-[#171717] text-left transition-all border-b border-[#E5E7EB] dark:border-[#1A1A1A]/30 last:border-b-0"
                        >
                          <div>
                            <p className="font-semibold text-base text-[#111111] dark:text-white">{ing.name}</p>
                            <span className={`text-xs px-2 py-0.5 rounded border ${getCategoryColor(ing.category)}`}>{ing.category}</span>
                          </div>
                          <span className="text-teal-400 font-bold text-lg">{formatCurrency(ing.pricePerUnit ?? 0)}</span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
                <button
                  onClick={() => { setQuickMode(true); setSelected(null); setSearch(''); }}
                  className={`px-5 py-4 min-h-[56px] rounded-2xl font-semibold text-base transition-all active:scale-95 ${
                    quickMode ? 'bg-amber-600/30 text-amber-300 border border-amber-500/40' : 'bg-[#FAFAFA] dark:bg-[#0A0A0A] text-[#9CA3AF] dark:text-[#737373] hover:bg-[#F3F4F6] dark:hover:bg-[#171717] border border-[#E5E7EB] dark:border-[#1A1A1A]/40'
                  }`}
                >
                  <Zap className="w-6 h-6" />
                </button>
                <button
                  onClick={() => setShowCameraPlaceholder(true)}
                  className="px-5 py-4 min-h-[56px] rounded-2xl bg-[#FAFAFA] dark:bg-[#0A0A0A] text-[#9CA3AF] dark:text-[#737373] hover:bg-[#F3F4F6] dark:hover:bg-[#171717] border border-[#E5E7EB] dark:border-[#1A1A1A]/40 transition-all active:scale-95"
                >
                  <Camera className="w-6 h-6" />
                </button>
              </div>
            )}

            {/* Selected ingredient label */}
            <div className={`text-center flex flex-col items-center justify-center ${kioskMode ? 'min-h-[40px]' : 'min-h-[60px]'}`}>
              {quickMode ? (
                <div>
                  <p className={`text-amber-400 uppercase tracking-widest font-medium ${kioskMode ? 'text-base' : 'text-sm'}`}>Pesee rapide</p>
                  {!kioskMode && <p className="text-[#9CA3AF] dark:text-[#737373] text-xs mt-1">Pesez sans selectionner d'ingredient</p>}
                </div>
              ) : selected ? (
                <div>
                  {!kioskMode && <p className="text-[#9CA3AF] dark:text-[#737373] text-[10px] uppercase tracking-[0.2em]">Ingredient selectionne</p>}
                  <p className={`font-bold text-[#111111] dark:text-white mt-0.5 ${kioskMode ? 'text-3xl' : 'text-2xl'}`}>{selected.name}</p>
                  <div className="flex items-center justify-center gap-3 mt-1">
                    <span className={`inline-block px-2 py-0.5 rounded border ${getCategoryColor(selected.category)} ${kioskMode ? 'text-xs' : 'text-[10px]'}`}>
                      {selected.category}
                    </span>
                    <span className={`text-teal-400 font-medium ${kioskMode ? 'text-sm' : 'text-xs'}`}>
                      {formatCurrency(selected.pricePerUnit ?? 0)}/{selected.unit === 'g' ? 'kg' : selected.unit === 'cl' ? 'L' : selected.unit === 'ml' ? 'L' : selected.unit}
                    </span>
                  </div>
                  <div className="mt-1.5">
                    {loadingStock ? (
                      <span className="text-[11px] text-[#6B7280] dark:text-[#A3A3A3]">Chargement stock...</span>
                    ) : ingredientStock ? (
                      <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${
                        ingredientStock.stock <= 0 ? 'bg-red-900/40 text-red-400' :
                        ingredientStock.stock < 2 ? 'bg-amber-900/40 text-amber-400' :
                        'bg-emerald-900/30 text-emerald-400'
                      }`}>
                        Stock : {ingredientStock.stock.toFixed(2)} {ingredientStock.unit}
                      </span>
                    ) : (
                      <span className="text-[11px] text-[#6B7280] dark:text-[#A3A3A3]">Pas de stock enregistre</span>
                    )}
                  </div>
                </div>
              ) : (
                <div>
                  <p className={`text-[#6B7280] dark:text-[#A3A3A3] px-2 text-center ${kioskMode ? 'text-lg' : 'text-sm sm:text-base'}`}>
                    {kioskMode ? 'Recherchez un ingredient ci-dessus' : 'Selectionnez un ingredient ou utilisez la pesee rapide'}
                  </p>
                </div>
              )}
            </div>

            {/* ===== BIG WEIGHT DISPLAY (Premium LCD-style) ===== */}
            <div
              className={`relative w-full rounded-3xl flex flex-col items-center justify-center transition-all duration-700 overflow-hidden ${
                flashGreen ? '' : ''
              } ${kioskMode ? 'max-w-2xl aspect-[2.5/1]' : 'max-w-full sm:max-w-lg aspect-[2/1] sm:aspect-[1.8/1]'}`}
              style={{
                background: 'linear-gradient(145deg, #050810 0%, #0c1220 40%, #0a0f1a 100%)',
                border: `2px solid ${
                  netWeight > 0 && isStable ? '#10b981' :
                  netWeight > 0 ? '#3b82f6' :
                  '#1a2035'
                }`,
                boxShadow: netWeight > 0 && isStable
                  ? '0 0 80px rgba(16,185,129,0.2), 0 0 120px rgba(16,185,129,0.08), inset 0 1px 0 rgba(255,255,255,0.04), inset 0 -2px 20px rgba(16,185,129,0.05)'
                  : netWeight > 0
                  ? '0 0 50px rgba(59,130,246,0.12), inset 0 1px 0 rgba(255,255,255,0.03)'
                  : 'inset 0 1px 0 rgba(255,255,255,0.03), inset 0 -1px 0 rgba(0,0,0,0.3)',
              }}
            >
              {/* Scanline overlay */}
              <div className="absolute inset-0 rounded-3xl opacity-[0.025] pointer-events-none"
                style={{ backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,255,255,0.15) 2px, rgba(255,255,255,0.15) 3px)' }}
              />
              {/* Inner glow ring for stable state */}
              {netWeight > 0 && isStable && (
                <div className="absolute inset-0 rounded-3xl pointer-events-none" style={{
                  background: 'radial-gradient(ellipse at center, rgba(16,185,129,0.06) 0%, transparent 70%)',
                }} />
              )}
              {/* Status badge top-left */}
              <div className="absolute top-3 left-4 z-10">
                {netWeight > 0 && isStable ? (
                  <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/25">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_6px_rgba(52,211,153,0.8)]" />
                    <span className="text-emerald-400 text-[10px] font-semibold uppercase tracking-wider">Stable</span>
                  </span>
                ) : netWeight > 0 ? (
                  <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-blue-500/10 border border-blue-500/20">
                    <span className="flex gap-0.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-teal-400 animate-bounce" style={{ animationDelay: '0ms' }} />
                      <span className="w-1.5 h-1.5 rounded-full bg-teal-400 animate-bounce" style={{ animationDelay: '150ms' }} />
                      <span className="w-1.5 h-1.5 rounded-full bg-teal-400 animate-bounce" style={{ animationDelay: '300ms' }} />
                    </span>
                    <span className="text-teal-400 text-[10px] font-medium uppercase tracking-wider">Mesure...</span>
                  </span>
                ) : null}
              </div>
              {/* BLE/SIM badge top-right */}
              <div className="absolute top-3 right-4 z-10 flex items-center gap-1.5">
                {useSimulation ? (
                  <span className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/20">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                    <span className="text-amber-400/70 text-[9px] font-semibold uppercase tracking-wider">SIM</span>
                  </span>
                ) : status === 'connected' ? (
                  <span className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-teal-500/10 border border-teal-500/20">
                    <Bluetooth className="w-3 h-3 text-teal-400/70" />
                    <span className="text-teal-400/60 text-[9px] font-semibold uppercase tracking-wider">BLE</span>
                  </span>
                ) : status === 'reconnecting' ? (
                  <RefreshCw className="w-3.5 h-3.5 text-amber-400/60 animate-spin" />
                ) : (
                  <WifiOff className="w-3.5 h-3.5 text-[#6B7280]/30" />
                )}
              </div>

              {/* Main weight number - HUGE LCD */}
              <div className="relative z-10 flex items-baseline gap-1">
                <span
                  className={`tabular-nums tracking-tighter transition-all duration-500 ease-out ${
                    netWeight > 0 && isStable ? 'text-emerald-400' :
                    netWeight > 0 ? 'text-teal-300' :
                    'text-[#2a3040]'
                  }`}
                  style={{
                    fontSize: kioskMode ? 'clamp(6rem, 16vw, 11rem)' : 'clamp(4.5rem, 12vw, 7.5rem)',
                    lineHeight: 0.9,
                    fontFamily: '"SF Mono", "Cascadia Code", "Fira Code", "JetBrains Mono", ui-monospace, monospace',
                    fontWeight: 800,
                    letterSpacing: '-0.04em',
                    textShadow: netWeight > 0 && isStable
                      ? '0 0 40px rgba(16,185,129,0.4), 0 0 80px rgba(16,185,129,0.15)'
                      : netWeight > 0
                      ? '0 0 30px rgba(56,189,248,0.2)'
                      : 'none',
                  }}
                >
                  {netWeight <= 0 ? '0.000' : weightForDisplay}
                </span>
                <span
                  className={`font-bold transition-colors duration-500 ${
                    netWeight > 0 && isStable ? 'text-emerald-400/50' :
                    netWeight > 0 ? 'text-teal-300/40' :
                    'text-[#2a3040]'
                  }`}
                  style={{
                    fontSize: kioskMode ? 'clamp(2rem, 5vw, 3.5rem)' : 'clamp(1.5rem, 3.5vw, 2.5rem)',
                    fontFamily: '"SF Mono", "Cascadia Code", "Fira Code", "JetBrains Mono", ui-monospace, monospace',
                  }}
                >
                  {unitForDisplay}
                </span>
              </div>

              {/* Tare indicator */}
              {tare > 0 && (
                <div className="relative z-10 mt-2 flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/15">
                  <RotateCcw className="w-3 h-3 text-amber-400/60" />
                  <span className="text-[10px] text-amber-400/70 font-medium tracking-wide">TARE {(tare * 1000).toFixed(0)}g</span>
                </div>
              )}
            </div>

            {/* Real-time estimated value */}
            {selected && netConverted > 0 && selected.pricePerUnit > 0 && (
              <div className={`flex items-center gap-2 px-5 py-2.5 bg-emerald-900/30 border border-emerald-500/30 rounded-2xl ${kioskMode ? 'px-8 py-4' : ''}`}>
                <Euro className={kioskMode ? 'w-7 h-7 text-emerald-400' : 'w-5 h-5 text-emerald-400'} />
                <span className={`font-bold text-emerald-400 tabular-nums ${kioskMode ? 'text-3xl' : 'text-2xl'}`}>
                  Valeur : {(() => {
                    const unit = selected.unit.toLowerCase();
                    if (unit === 'g') return formatCurrency(netConverted / 1000 * selected.pricePerUnit);
                    if (unit === 'cl') return formatCurrency(netConverted / 100 * selected.pricePerUnit);
                    if (unit === 'ml') return formatCurrency(netConverted / 1000 * selected.pricePerUnit);
                    return formatCurrency(netConverted * selected.pricePerUnit);
                  })()}
                </span>
              </div>
            )}

            {/* Unit toggle */}
            <div className="flex items-center gap-1 p-1 bg-[#FAFAFA] dark:bg-[#0A0A0A]/60 rounded-xl border border-[#E5E7EB] dark:border-[#1A1A1A]/40">
              {(['g', 'kg', 'L', 'piece'] as DisplayUnit[]).map(u => (
                <button
                  key={u}
                  onClick={() => setDisplayUnit(u)}
                  className={`px-3 sm:px-5 py-2 rounded-lg font-bold transition-all ${kioskMode ? 'min-h-[56px] text-base' : 'min-h-[48px] text-sm'} ${
                    displayUnit === u
                      ? 'bg-emerald-600 text-white shadow-md'
                      : 'text-[#9CA3AF] dark:text-[#737373] hover:text-[#111111] dark:hover:text-white hover:bg-[#F3F4F6] dark:hover:bg-[#171717]/60'
                  }`}
                >
                  {u}
                </button>
              ))}
            </div>

            {/* Simulation controls */}
            {useSimulation && (
              <div className={`flex items-center gap-3 sm:gap-4 bg-[#FAFAFA] dark:bg-[#0A0A0A]/60 px-3 sm:px-5 py-3 rounded-2xl border border-amber-600/30 ${kioskMode ? 'gap-6 px-8 py-4' : ''}`}>
                <p className={`text-amber-400 font-medium uppercase tracking-wider ${kioskMode ? 'text-sm' : 'text-xs'}`}>Sim</p>
                <button
                  onClick={() => setSimWeight(w => Math.max(0, +(w - 0.05).toFixed(3)))}
                  className={`rounded-xl bg-[#F3F4F6] dark:bg-[#171717] hover:bg-[#E5E7EB] dark:hover:bg-[#222] flex items-center justify-center active:scale-90 transition-all ${kioskMode ? 'w-16 h-16' : 'w-12 h-12'}`}
                >
                  <Minus className={kioskMode ? 'w-7 h-7' : 'w-5 h-5'} />
                </button>
                <span className={`text-[#111111] dark:text-white font-mono text-center tabular-nums ${kioskMode ? 'w-32 text-2xl' : 'w-24 text-lg'}`}>{simWeight.toFixed(3)} kg</span>
                <button
                  onClick={() => setSimWeight(w => +(w + 0.05).toFixed(3))}
                  className={`rounded-xl bg-[#F3F4F6] dark:bg-[#171717] hover:bg-[#E5E7EB] dark:hover:bg-[#222] flex items-center justify-center active:scale-90 transition-all ${kioskMode ? 'w-16 h-16' : 'w-12 h-12'}`}
                >
                  <Plus className={kioskMode ? 'w-7 h-7' : 'w-5 h-5'} />
                </button>
              </div>
            )}

            {/* Stock mode selector - Premium buttons */}
            {selected && !quickMode && (
              <div className={`flex items-center gap-2 p-1.5 rounded-2xl border ${kioskMode ? 'gap-3' : ''} ${
                stockMode === 'add' ? 'bg-emerald-900/10 border-emerald-500/20' :
                stockMode === 'set' ? 'bg-teal-900/10 border-teal-500/20' :
                'bg-red-900/10 border-red-500/15'
              }`}>
                <button
                  onClick={() => setStockMode('remove')}
                  className={`flex items-center gap-2 rounded-xl font-bold transition-all active:scale-95 ${kioskMode ? 'px-6 py-4 min-h-[56px] text-base' : 'px-4 sm:px-5 py-2.5 min-h-[48px] text-sm'} ${
                    stockMode === 'remove'
                      ? 'bg-red-600 text-white shadow-lg shadow-red-900/30 border-2 border-red-500/50'
                      : 'text-[#9CA3AF] dark:text-[#737373] hover:text-red-400 hover:bg-red-900/10 border-2 border-transparent'
                  }`}
                >
                  <Minus className={kioskMode ? 'w-6 h-6' : 'w-5 h-5'} />
                  Retirer
                </button>
                <button
                  onClick={() => setStockMode('add')}
                  className={`flex items-center gap-2 rounded-xl font-bold transition-all active:scale-95 ${kioskMode ? 'px-6 py-4 min-h-[56px] text-base' : 'px-4 sm:px-5 py-2.5 min-h-[48px] text-sm'} ${
                    stockMode === 'add'
                      ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-900/30 border-2 border-emerald-500/50'
                      : 'text-[#9CA3AF] dark:text-[#737373] hover:text-emerald-400 hover:bg-emerald-900/10 border-2 border-transparent'
                  }`}
                >
                  <Plus className={kioskMode ? 'w-6 h-6' : 'w-5 h-5'} />
                  Ajouter
                </button>
                <button
                  onClick={() => setStockMode('set')}
                  className={`flex items-center gap-2 rounded-xl font-bold transition-all active:scale-95 ${kioskMode ? 'px-6 py-4 min-h-[56px] text-base' : 'px-4 sm:px-5 py-2.5 min-h-[48px] text-sm'} ${
                    stockMode === 'set'
                      ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/30 border-2 border-blue-500/50'
                      : 'text-[#9CA3AF] dark:text-[#737373] hover:text-blue-400 hover:bg-blue-900/10 border-2 border-transparent'
                  }`}
                >
                  <Replace className={kioskMode ? 'w-6 h-6' : 'w-5 h-5'} />
                  Definir
                </button>
              </div>
            )}

            {/* Stock change preview - Premium card */}
            {selected && !quickMode && ingredientStock && (
              <div className={`w-full rounded-2xl border px-4 py-3 ${kioskMode ? 'max-w-2xl px-6 py-4' : 'max-w-md'} ${
                stockMode === 'add' ? 'bg-emerald-900/10 border-emerald-500/15' :
                stockMode === 'set' ? 'bg-blue-900/10 border-blue-500/15' :
                'bg-red-900/10 border-red-500/10'
              }`}>
                <p className="text-[10px] text-[#9CA3AF] dark:text-[#737373] uppercase tracking-wider font-semibold mb-2">Stock actuel</p>
                <div className={`flex items-center justify-center gap-3 ${kioskMode ? 'text-xl' : 'text-base'}`}>
                  <div className="flex items-center gap-1.5">
                    <Package className={`${kioskMode ? 'w-5 h-5' : 'w-4 h-4'} text-[#9CA3AF] dark:text-[#737373]`} />
                    <span className="font-bold text-[#111111] dark:text-white tabular-nums" style={{ fontFamily: 'ui-monospace, monospace' }}>
                      {ingredientStock.stock.toFixed(2)} {selected.unit}
                    </span>
                  </div>
                  {netConverted > 0 && (
                    <>
                      <span className={`text-2xl font-light ${
                        stockMode === 'add' ? 'text-emerald-400' :
                        stockMode === 'set' ? 'text-blue-400' :
                        'text-red-400'
                      }`}>&rarr;</span>
                      <span className={`font-black tabular-nums ${kioskMode ? 'text-2xl' : 'text-lg'} ${
                        stockMode === 'add' ? 'text-emerald-400' :
                        stockMode === 'set' ? 'text-blue-400' :
                        'text-red-400'
                      }`} style={{ fontFamily: 'ui-monospace, monospace' }}>
                        {stockMode === 'add'
                          ? (ingredientStock.stock + netConverted).toFixed(2)
                          : stockMode === 'set'
                          ? netConverted.toFixed(2)
                          : Math.max(0, ingredientStock.stock - netConverted).toFixed(2)
                        } {selected.unit}
                      </span>
                      <span className={`text-xs px-2.5 py-1 rounded-full font-bold ${
                        stockMode === 'add' ? 'bg-emerald-600/20 text-emerald-300 border border-emerald-500/20' :
                        stockMode === 'set' ? 'bg-blue-600/20 text-blue-300 border border-blue-500/20' :
                        'bg-red-600/20 text-red-300 border border-red-500/20'
                      }`}>
                        {stockMode === 'add' ? `+${netConverted.toFixed(2)}` :
                         stockMode === 'set' ? `= ${netConverted.toFixed(2)}` :
                         `-${netConverted.toFixed(2)}`}
                      </span>
                    </>
                  )}
                </div>
              </div>
            )}

            {/* Action buttons */}
            <div className={`flex flex-wrap justify-center gap-2 sm:gap-3 w-full px-1 ${kioskMode ? 'max-w-2xl gap-4' : 'max-w-lg'}`}>
              <button
                onClick={handleTare}
                disabled={currentWeight <= 0}
                className={`flex items-center gap-2 bg-[#FAFAFA] dark:bg-[#0A0A0A] hover:bg-[#F3F4F6] dark:hover:bg-[#171717] disabled:opacity-30 disabled:cursor-not-allowed rounded-2xl font-semibold text-[#111111] dark:text-white transition-all active:scale-95 border border-[#E5E7EB] dark:border-[#1A1A1A]/50 ${
                  kioskMode ? 'px-8 py-5 min-h-[64px] text-lg' : 'px-4 sm:px-6 py-3 sm:py-4 min-h-[48px] sm:min-h-[56px] text-sm sm:text-base'
                }`}
              >
                <RotateCcw className={kioskMode ? 'w-6 h-6' : 'w-5 h-5'} /> Tare
              </button>

              <button
                onClick={handleValidate}
                disabled={(!selected && !quickMode) || netConverted <= 0 || saving}
                className={`flex items-center gap-2 disabled:opacity-30 disabled:cursor-not-allowed rounded-2xl font-bold text-white transition-all active:scale-95 shadow-lg border ${
                  selected && !quickMode ? (
                    stockMode === 'add' ? 'bg-emerald-600 hover:bg-emerald-500 shadow-emerald-900/30 border-emerald-500/30' :
                    stockMode === 'set' ? 'bg-teal-600 hover:bg-teal-500 shadow-teal-900/30 border-teal-500/30' :
                    'bg-red-600 hover:bg-red-500 shadow-red-900/30 border-red-500/30'
                  ) : 'bg-emerald-600 hover:bg-emerald-500 shadow-emerald-900/30 border-emerald-500/30'
                } ${
                  kioskMode ? 'px-14 py-5 min-h-[64px] text-2xl' : 'px-6 sm:px-10 py-4 min-h-[56px] text-base sm:text-lg'
                }`}
              >
                {selected && !quickMode ? (
                  stockMode === 'add' ? <ArrowDownToLine className={kioskMode ? 'w-8 h-8' : 'w-6 h-6'} /> :
                  stockMode === 'set' ? <Replace className={kioskMode ? 'w-8 h-8' : 'w-6 h-6'} /> :
                  <ArrowUpFromLine className={kioskMode ? 'w-8 h-8' : 'w-6 h-6'} />
                ) : (
                  <Check className={kioskMode ? 'w-8 h-8' : 'w-6 h-6'} />
                )}
                {saving ? 'Sauvegarde...' : (
                  selected && !quickMode ? (
                    stockMode === 'add' ? 'Ajouter au stock' :
                    stockMode === 'set' ? 'Definir le stock' :
                    'Retirer du stock'
                  ) : 'Valider'
                )}
              </button>

              <button
                onClick={handleReset}
                className={`flex items-center gap-2 bg-[#FAFAFA] dark:bg-[#0A0A0A] hover:bg-[#F3F4F6] dark:hover:bg-[#171717] rounded-2xl font-semibold text-[#111111] dark:text-white transition-all active:scale-95 border border-[#E5E7EB] dark:border-[#1A1A1A]/50 ${
                  kioskMode ? 'px-8 py-5 min-h-[64px] text-lg' : 'px-4 sm:px-6 py-3 sm:py-4 min-h-[48px] sm:min-h-[56px] text-sm sm:text-base'
                }`}
              >
                <RotateCcw className={kioskMode ? 'w-6 h-6' : 'w-5 h-5'} /> Reset
              </button>
            </div>
          </div>

          {/* RIGHT PANEL: History log (hidden in kiosk) */}
          {!kioskMode && (
            <div className="max-h-[40vh] lg:max-h-none lg:w-80 xl:w-96 bg-white dark:bg-black/40 border-t lg:border-t-0 lg:border-l border-[#E5E7EB] dark:border-[#1A1A1A]/60 flex flex-col overflow-hidden shrink-0">
              <div className="flex items-center justify-between px-4 py-3 border-b border-[#E5E7EB] dark:border-[#1A1A1A]/60">
                <div className="flex items-center gap-2">
                  <ClipboardList className="w-4 h-4 text-[#9CA3AF] dark:text-[#737373]" />
                  <p className="text-sm font-bold text-[#111111] dark:text-white">Historique</p>
                  {history.length > 0 && (
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-900/20 text-emerald-400 font-bold">{history.length}</span>
                  )}
                </div>
                {history.length > 0 && (
                  <button
                    onClick={clearHistory}
                    className="flex items-center gap-1 px-3 py-2 min-h-[40px] text-xs text-red-400 hover:text-red-300 hover:bg-red-900/20 rounded-lg transition-all"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    Effacer
                  </button>
                )}
              </div>
              <div className="flex-1 overflow-y-auto px-2 py-2 space-y-0.5">
                {history.length === 0 && (
                  <div className="flex flex-col items-center justify-center py-12 text-[#9CA3AF] dark:text-[#737373]">
                    <Scale className="w-8 h-8 mb-2 opacity-40" />
                    <p className="text-sm">Aucune pesee</p>
                    <p className="text-[10px] mt-1">Les pesees apparaitront ici</p>
                  </div>
                )}
                {/* Group history by date */}
                {(() => {
                  const today = new Date().toISOString().slice(0, 10);
                  const yesterday = new Date(Date.now() - 86400000).toISOString().slice(0, 10);
                  const grouped: Record<string, HistoryEntry[]> = {};
                  history.slice(0, 30).forEach(e => {
                    const date = e.timestamp.slice(0, 10);
                    if (!grouped[date]) grouped[date] = [];
                    grouped[date].push(e);
                  });
                  return Object.entries(grouped).map(([date, entries]) => (
                    <div key={date}>
                      {/* Date header */}
                      <div className="flex items-center gap-2 px-2 py-1.5 mt-1 first:mt-0">
                        <div className="h-[1px] flex-1 bg-[#E5E7EB] dark:bg-[#1A1A1A]/60" />
                        <span className="text-[10px] font-bold text-[#9CA3AF] dark:text-[#737373] uppercase tracking-wider shrink-0">
                          {date === today ? "Aujourd'hui" :
                           date === yesterday ? 'Hier' :
                           new Date(date).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })}
                        </span>
                        <div className="h-[1px] flex-1 bg-[#E5E7EB] dark:bg-[#1A1A1A]/60" />
                      </div>
                      {entries.map((entry, i) => {
                        const actionColor = entry.status === 'error' ? 'red' :
                          entry.stockAction === 'add' ? 'emerald' :
                          entry.stockAction === 'set' ? 'blue' :
                          entry.stockAction === 'remove' ? 'red' : 'teal';
                        return (
                          <div
                            key={`${entry.timestamp}-${i}`}
                            className={`rounded-xl px-3 py-2.5 mb-0.5 transition-all ${
                              entry.status === 'error'
                                ? 'bg-red-900/10 border-l-2 border-red-500'
                                : entry.stockAction === 'add'
                                ? 'bg-[#FAFAFA]/40 dark:bg-[#0A0A0A]/40 border-l-2 border-emerald-500'
                                : entry.stockAction === 'set'
                                ? 'bg-[#FAFAFA]/40 dark:bg-[#0A0A0A]/40 border-l-2 border-blue-500'
                                : 'bg-[#FAFAFA]/40 dark:bg-[#0A0A0A]/40 border-l-2 border-red-400'
                            }`}
                          >
                            <div className="flex items-start justify-between gap-2">
                              <div className="min-w-0 flex-1">
                                <div className="flex items-center gap-1.5">
                                  <p className="text-[#111111] dark:text-white text-sm font-semibold truncate">{entry.ingredientName}</p>
                                  {entry.stockAction && (
                                    <span className={`inline-flex items-center gap-0.5 text-[9px] px-1.5 py-0.5 rounded-full font-bold ${
                                      entry.stockAction === 'add' ? 'bg-emerald-500/15 text-emerald-400' :
                                      entry.stockAction === 'set' ? 'bg-blue-500/15 text-blue-400' :
                                      'bg-red-500/15 text-red-400'
                                    }`}>
                                      {entry.stockAction === 'add' ? <Plus className="w-2.5 h-2.5" /> :
                                       entry.stockAction === 'set' ? <Replace className="w-2.5 h-2.5" /> :
                                       <Minus className="w-2.5 h-2.5" />}
                                      {entry.stockAction === 'add' ? 'Ajout' : entry.stockAction === 'set' ? 'Defini' : 'Retrait'}
                                    </span>
                                  )}
                                </div>
                                {entry.recipeName && (
                                  <span className="inline-block text-[9px] px-1.5 py-0.5 rounded bg-purple-900/20 text-purple-400 font-semibold mt-0.5">
                                    {entry.recipeName}
                                  </span>
                                )}
                              </div>
                              <div className="text-right shrink-0">
                                <p className={`text-base font-black tabular-nums ${
                                  actionColor === 'red' ? 'text-red-400' :
                                  actionColor === 'emerald' ? 'text-emerald-400' :
                                  actionColor === 'blue' ? 'text-blue-400' :
                                  'text-teal-400'
                                }`} style={{ fontFamily: 'ui-monospace, monospace' }}>
                                  {entry.stockAction === 'add' ? '+' : entry.stockAction === 'remove' ? '-' : ''}{entry.weight} <span className="text-xs opacity-60">{entry.unit}</span>
                                </p>
                              </div>
                            </div>
                            {entry.stockAction && entry.stockBefore !== undefined && entry.stockAfter !== undefined && entry.status === 'success' && (
                              <div className="flex items-center gap-1.5 mt-1.5 text-[10px] text-[#9CA3AF] dark:text-[#737373]">
                                <Package className="w-3 h-3 opacity-50" />
                                <span className="tabular-nums">{entry.stockBefore.toFixed(1)}</span>
                                <span className="opacity-40">&rarr;</span>
                                <span className="font-bold text-[#111111] dark:text-white tabular-nums">{entry.stockAfter.toFixed(1)} {entry.unit}</span>
                              </div>
                            )}
                            <p className="text-[#6B7280] dark:text-[#A3A3A3] text-[10px] mt-1 tabular-nums">
                              {new Date(entry.timestamp).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
                            </p>
                          </div>
                        );
                      })}
                    </div>
                  ));
                })()}
              </div>

              {/* Daily stats footer - premium */}
              <div className="px-3 py-3 border-t border-[#E5E7EB] dark:border-[#1A1A1A]/60 bg-[#FAFAFA]/80 dark:bg-[#0A0A0A]/80">
                <p className="text-[10px] text-[#9CA3AF] dark:text-[#737373] uppercase tracking-wider font-bold mb-2">Statistiques du jour</p>
                <div className="grid grid-cols-3 gap-2">
                  <div className="text-center px-2 py-2 rounded-xl bg-white dark:bg-[#0A0A0A]/50 border border-[#E5E7EB] dark:border-[#1A1A1A]/40">
                    <p className="text-lg font-black text-emerald-400 tabular-nums" style={{ fontFamily: 'ui-monospace, monospace' }}>{todayStats.totalWeighs}</p>
                    <p className="text-[9px] text-[#9CA3AF] dark:text-[#737373] font-medium">Pesees</p>
                  </div>
                  <div className="text-center px-2 py-2 rounded-xl bg-white dark:bg-[#0A0A0A]/50 border border-[#E5E7EB] dark:border-[#1A1A1A]/40">
                    <p className="text-lg font-black text-teal-400 tabular-nums" style={{ fontFamily: 'ui-monospace, monospace' }}>{todayStats.totalKg}</p>
                    <p className="text-[9px] text-[#9CA3AF] dark:text-[#737373] font-medium">kg total</p>
                  </div>
                  <div className="text-center px-2 py-2 rounded-xl bg-white dark:bg-[#0A0A0A]/50 border border-[#E5E7EB] dark:border-[#1A1A1A]/40">
                    <p className="text-lg font-black text-amber-400 tabular-nums" style={{ fontFamily: 'ui-monospace, monospace' }}>{todayStats.totalValue}</p>
                    <p className="text-[9px] text-[#9CA3AF] dark:text-[#737373] font-medium">{getCurrencySymbol()}</p>
                  </div>
                </div>
                {todayStats.mostWeighedName && (
                  <div className="mt-2 flex items-center gap-2 px-2.5 py-1.5 rounded-lg bg-white dark:bg-[#0A0A0A]/50 border border-[#E5E7EB] dark:border-[#1A1A1A]/40">
                    <BarChart3 className="w-3.5 h-3.5 text-purple-400 shrink-0" />
                    <span className="text-[10px] text-[#9CA3AF] dark:text-[#737373]">Plus pese:</span>
                    <span className="text-[10px] font-bold text-[#111111] dark:text-white truncate">{todayStats.mostWeighedName}</span>
                    <span className="text-[10px] text-purple-400 font-bold shrink-0">x{todayStats.mostWeighedCount}</span>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      )}

      {/* ═══════════════════════════════════════════════════════════ */}
      {/* TAB: RECIPE MODE */}
      {/* ═══════════════════════════════════════════════════════════ */}
      {mainTab === 'recette' && (
        <div className="flex-1 flex flex-col lg:flex-row overflow-y-auto lg:overflow-hidden">

          {/* LEFT: Recipe selector / ingredient list */}
          <div className="lg:w-96 xl:w-[28rem] bg-white dark:bg-black/40 border-b lg:border-b-0 lg:border-r border-[#E5E7EB] dark:border-[#1A1A1A]/60 flex flex-col overflow-hidden shrink-0">

            {!recipeSession ? (
              <>
                {/* Recipe selector */}
                <div className="p-4 border-b border-[#E5E7EB] dark:border-[#1A1A1A]/60">
                  <p className="text-sm font-semibold text-[#111111] dark:text-white mb-2 flex items-center gap-2">
                    <BookOpen className="w-4 h-4 text-teal-400" />
                    Selectionner une recette
                  </p>
                  <select
                    value={selectedRecipe?.id || ''}
                    onChange={e => {
                      const r = recipes.find(r => r.id === Number(e.target.value));
                      setSelectedRecipe(r || null);
                    }}
                    className="w-full px-3 py-3 min-h-[48px] bg-[#FAFAFA] dark:bg-[#0A0A0A]/80 rounded-xl text-[#111111] dark:text-white text-sm border border-[#E5E7EB] dark:border-[#1A1A1A]/50 focus:outline-none focus:ring-2 focus:ring-teal-500/60"
                  >
                    <option value="">-- Choisir une recette --</option>
                    {recipes.map(r => (
                      <option key={r.id} value={r.id}>{r.name} ({r.ingredients?.length || 0} ingredients)</option>
                    ))}
                  </select>
                </div>

                {/* Selected recipe preview */}
                {selectedRecipe && selectedRecipe.ingredients && (
                  <div className="flex-1 overflow-y-auto">
                    <div className="p-4 border-b border-[#E5E7EB] dark:border-[#1A1A1A]/60">
                      <h3 className="text-lg font-bold text-[#111111] dark:text-white">{selectedRecipe.name}</h3>
                      <div className="flex items-center gap-3 mt-1">
                        <span className="text-xs text-[#9CA3AF] dark:text-[#737373]">{selectedRecipe.category}</span>
                        <span className="text-xs text-teal-400">{selectedRecipe.ingredients.length} ingredients</span>
                        <span className="text-xs text-emerald-400">{formatCurrency(selectedRecipe.sellingPrice ?? 0)}</span>
                      </div>
                    </div>
                    <div className="p-3 space-y-1">
                      {selectedRecipe.ingredients.map((ri, idx) => (
                        <div key={ri.id || idx} className="flex items-center justify-between px-3 py-2.5 rounded-xl bg-[#FAFAFA]/40 dark:bg-[#0A0A0A]/40 border border-[#E5E7EB] dark:border-[#1A1A1A]/30">
                          <div className="min-w-0 flex-1">
                            <p className="text-sm font-medium text-[#111111] dark:text-white truncate">{ri.ingredient.name}</p>
                            <span className={`text-[10px] px-1.5 py-0.5 rounded border ${getCategoryColor(ri.ingredient.category)}`}>
                              {ri.ingredient.category}
                            </span>
                          </div>
                          <span className="text-sm font-bold text-teal-400 tabular-nums">
                            {ri.quantity} {ri.ingredient.unit}
                          </span>
                        </div>
                      ))}
                    </div>
                    <div className="p-4">
                      <button
                        onClick={() => startRecipeSession(selectedRecipe)}
                        className="w-full flex items-center justify-center gap-2 px-6 py-4 min-h-[56px] bg-teal-600 hover:bg-teal-500 text-white rounded-2xl font-bold text-lg transition-all active:scale-95 shadow-lg shadow-teal-900/30"
                      >
                        <Play className="w-6 h-6" />
                        Commencer la pesee
                      </button>
                    </div>
                  </div>
                )}

                {!selectedRecipe && (
                  <div className="flex-1 flex flex-col items-center justify-center py-12 text-[#9CA3AF] dark:text-[#737373]">
                    <ChefHat className="w-12 h-12 mb-3" />
                    <p className="text-sm">Choisissez une recette pour commencer</p>
                  </div>
                )}
              </>
            ) : (
              <>
                {/* Active recipe session */}
                <div className="p-4 border-b border-[#E5E7EB] dark:border-[#1A1A1A]/60 bg-teal-900/10">
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <p className="text-xs text-teal-400 uppercase tracking-wider font-medium">Pesee en cours</p>
                      <h3 className="text-lg font-bold text-[#111111] dark:text-white">{recipeSession.recipeName}</h3>
                    </div>
                    <button
                      onClick={() => { setRecipeSession(null); setActiveRecipeIngIdx(null); setSelected(null); }}
                      className="p-2 hover:bg-red-900/20 rounded-lg text-red-400 transition-all"
                      title="Annuler"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>

                  {/* Progress bar */}
                  <div className="mb-2">
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span className="text-[#6B7280] dark:text-[#A3A3A3]">{recipeWeighedCount}/{recipeTotalCount} ingredients peses</span>
                      <span className="text-teal-400 font-medium">{Math.round(recipeProgress)}%</span>
                    </div>
                    <div className="h-2.5 bg-[#F3F4F6] dark:bg-[#171717] rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-teal-600 to-emerald-500 rounded-full transition-all duration-500"
                        style={{ width: `${recipeProgress}%` }}
                      />
                    </div>
                  </div>

                  {/* Cost comparison */}
                  <div className="grid grid-cols-2 gap-2 mt-3">
                    <div className="px-3 py-2 bg-[#FAFAFA] dark:bg-[#0A0A0A]/80 rounded-lg border border-[#E5E7EB] dark:border-[#1A1A1A]/50">
                      <p className="text-[10px] text-[#9CA3AF] dark:text-[#737373] uppercase">Cout theorique</p>
                      <p className="text-sm font-bold text-[#111111] dark:text-white">{formatCurrency(recipeTheoreticalCost)}</p>
                    </div>
                    <div className={`px-3 py-2 rounded-lg border ${
                      recipeActualCost > recipeTheoreticalCost * 1.05 ? 'bg-red-900/20 border-red-500/30' :
                      recipeActualCost < recipeTheoreticalCost * 0.95 ? 'bg-emerald-900/20 border-emerald-500/30' :
                      'bg-[#FAFAFA] dark:bg-[#0A0A0A]/80 border-[#E5E7EB] dark:border-[#1A1A1A]/50'
                    }`}>
                      <p className="text-[10px] text-[#9CA3AF] dark:text-[#737373] uppercase">Cout reel</p>
                      <p className={`text-sm font-bold ${
                        recipeActualCost > recipeTheoreticalCost * 1.05 ? 'text-red-400' :
                        recipeActualCost < recipeTheoreticalCost * 0.95 ? 'text-emerald-400' :
                        'text-[#111111] dark:text-white'
                      }`}>{formatCurrency(recipeActualCost)}</p>
                    </div>
                  </div>
                </div>

                {/* Ingredient list with status */}
                <div className="flex-1 overflow-y-auto p-2 space-y-1">
                  {recipeSession.entries.map((entry, idx) => {
                    const isActive = activeRecipeIngIdx === idx;
                    const isWeighed = entry.status === 'weighed';
                    const accuracy = isWeighed && entry.actualQty !== null ? getAccuracyColor(entry.targetQty, entry.actualQty) : null;
                    const AccIcon = accuracy ? getAccuracyIcon(accuracy) : null;
                    return (
                      <button
                        key={idx}
                        onClick={() => {
                          if (!isWeighed) {
                            setActiveRecipeIngIdx(idx);
                            const ing = selectedRecipe?.ingredients[idx]?.ingredient;
                            if (ing) {
                              setSelected({ id: ing.id, name: ing.name, unit: ing.unit, category: ing.category, pricePerUnit: ing.pricePerUnit });
                            }
                            setTare(0);
                          }
                        }}
                        className={`w-full flex items-center gap-3 px-3 py-3 min-h-[52px] rounded-xl text-left transition-all ${
                          isActive ? 'bg-teal-600/20 border-2 border-teal-500/50 shadow-lg shadow-teal-900/20' :
                          isWeighed ? `border ${getAccuracyClasses(accuracy!)}` :
                          'bg-[#FAFAFA]/40 dark:bg-[#0A0A0A]/40 border border-[#E5E7EB] dark:border-[#1A1A1A]/30 hover:bg-[#F3F4F6] dark:hover:bg-[#171717]'
                        }`}
                      >
                        {/* Status icon */}
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                          isActive ? 'bg-teal-600 text-white' :
                          isWeighed && AccIcon ? 'bg-transparent' :
                          'bg-[#F3F4F6] dark:bg-[#171717] text-[#9CA3AF] dark:text-[#737373]'
                        }`}>
                          {isActive ? <Scale className="w-4 h-4" /> :
                           isWeighed && AccIcon ? <AccIcon className="w-5 h-5" /> :
                           <span className="text-xs font-bold">{idx + 1}</span>}
                        </div>

                        <div className="min-w-0 flex-1">
                          <p className={`text-sm font-medium truncate ${isActive ? 'text-[#111111] dark:text-white' : isWeighed ? '' : 'text-[#6B7280] dark:text-[#A3A3A3]'}`}>
                            {entry.ingredientName}
                          </p>
                          <div className="flex items-center gap-2 mt-0.5">
                            <span className="text-[10px] text-[#9CA3AF] dark:text-[#737373]">Cible : {entry.targetQty} {entry.unit}</span>
                            {isWeighed && entry.actualQty !== null && (
                              <span className={`text-[10px] font-bold ${accuracy === 'green' ? 'text-emerald-400' : accuracy === 'amber' ? 'text-amber-400' : 'text-red-400'}`}>
                                Pese : {entry.actualQty.toFixed(2)} {entry.unit}
                              </span>
                            )}
                          </div>
                        </div>

                        {isActive && <ChevronRight className="w-4 h-4 text-teal-400 shrink-0" />}
                      </button>
                    );
                  })}
                </div>

                {/* Save session button */}
                <div className="p-3 border-t border-[#E5E7EB] dark:border-[#1A1A1A]/60">
                  <button
                    onClick={saveRecipeSession}
                    disabled={recipeWeighedCount === 0}
                    className="w-full flex items-center justify-center gap-2 px-4 py-3 min-h-[48px] bg-emerald-600 hover:bg-emerald-500 disabled:opacity-40 text-white rounded-xl font-medium text-sm transition-all active:scale-95"
                  >
                    <Save className="w-4 h-4" />
                    Sauvegarder la pesee ({recipeWeighedCount}/{recipeTotalCount})
                  </button>
                </div>
              </>
            )}
          </div>

          {/* CENTER: Scale display for recipe mode */}
          <div className="flex-1 flex flex-col items-center justify-center gap-4 px-4 py-6">
            {recipeSession && activeRecipeIngIdx !== null ? (
              <>
                <div className="text-center">
                  <p className="text-[10px] text-teal-400 uppercase tracking-[0.2em]">Ingredient a peser</p>
                  <p className="text-2xl font-bold text-[#111111] dark:text-white mt-1">{recipeSession.entries[activeRecipeIngIdx].ingredientName}</p>
                  <p className="text-lg text-teal-400 font-medium mt-1">
                    Cible : {recipeSession.entries[activeRecipeIngIdx].targetQty} {recipeSession.entries[activeRecipeIngIdx].unit}
                  </p>
                </div>

                {/* Scale display */}
                <div
                  className="relative w-full max-w-md aspect-[2/1] rounded-2xl flex flex-col items-center justify-center transition-all duration-500"
                  style={{
                    background: 'linear-gradient(135deg, #0a0e17 0%, #111827 50%, #0a0e17 100%)',
                    border: `2px solid ${netWeight > 0 && isStable ? '#10b981' : netWeight > 0 ? '#3b82f6' : '#1e293b'}`,
                  }}
                >
                  <div className="absolute inset-0 rounded-2xl opacity-[0.03] pointer-events-none"
                    style={{ backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,255,255,0.1) 2px, rgba(255,255,255,0.1) 4px)' }}
                  />
                  <div className="relative z-10 flex items-baseline gap-2">
                    <span className={`font-black tabular-nums tracking-tight transition-all duration-300 text-5xl sm:text-6xl ${
                      netWeight > 0 && isStable ? 'text-emerald-400' : netWeight > 0 ? 'text-teal-300' : 'text-[#6B7280]'
                    }`}>
                      {netWeight <= 0 ? '0' : weightForDisplay}
                    </span>
                    <span className="font-bold text-xl text-[#9CA3AF] dark:text-[#737373]">{unitForDisplay}</span>
                  </div>
                  {tare > 0 && <p className="relative z-10 text-xs text-amber-400/70 mt-1">Tare : {(tare * 1000).toFixed(0)} g</p>}
                </div>

                {/* Accuracy indicator for current ingredient */}
                {netConverted > 0 && (() => {
                  const target = recipeSession.entries[activeRecipeIngIdx].targetQty;
                  const color = getAccuracyColor(target, netConverted);
                  const AccuracyIcon = getAccuracyIcon(color);
                  const diffPct = target > 0 ? Math.round(Math.abs(netConverted - target) / target * 100) : 0;
                  return (
                    <div className={`flex items-center gap-2 px-4 py-2 rounded-xl border ${getAccuracyClasses(color)}`}>
                      <AccuracyIcon className="w-5 h-5" />
                      <span className="text-sm font-medium">
                        {color === 'green' ? 'Quantite correcte' :
                         color === 'amber' ? `Ecart de ${diffPct}% — acceptable` :
                         `Ecart de ${diffPct}% — trop important`}
                      </span>
                    </div>
                  );
                })()}

                {/* Simulation controls in recipe mode */}
                {useSimulation && (
                  <div className="flex items-center gap-4 bg-[#FAFAFA] dark:bg-[#0A0A0A]/60 px-5 py-3 rounded-2xl border border-amber-600/30">
                    <p className="text-amber-400 font-medium uppercase tracking-wider text-xs">Sim</p>
                    <button onClick={() => setSimWeight(w => Math.max(0, +(w - 0.05).toFixed(3)))} className="w-12 h-12 rounded-xl bg-[#F3F4F6] dark:bg-[#171717] hover:bg-[#E5E7EB] dark:hover:bg-[#222] flex items-center justify-center active:scale-90 transition-all">
                      <Minus className="w-5 h-5" />
                    </button>
                    <span className="text-[#111111] dark:text-white font-mono w-24 text-lg text-center tabular-nums">{simWeight.toFixed(3)} kg</span>
                    <button onClick={() => setSimWeight(w => +(w + 0.05).toFixed(3))} className="w-12 h-12 rounded-xl bg-[#F3F4F6] dark:bg-[#171717] hover:bg-[#E5E7EB] dark:hover:bg-[#222] flex items-center justify-center active:scale-90 transition-all">
                      <Plus className="w-5 h-5" />
                    </button>
                  </div>
                )}

                {/* Tare profile quick select */}
                <div className="flex flex-wrap items-center gap-1.5">
                  {tareProfiles.slice(0, 4).map(tp => (
                    <button
                      key={tp.id}
                      onClick={() => handleTareFromProfile(tp)}
                      className="px-3 py-2 min-h-[40px] rounded-lg text-xs font-medium bg-purple-900/20 text-purple-300 border border-purple-500/30 hover:bg-purple-900/40 transition-all active:scale-95"
                    >
                      {tp.name} ({tp.weightGrams}g)
                    </button>
                  ))}
                </div>

                {/* Action buttons */}
                <div className="flex items-center gap-3">
                  <button
                    onClick={handleTare}
                    disabled={currentWeight <= 0}
                    className="flex items-center gap-2 px-6 py-4 min-h-[56px] bg-[#FAFAFA] dark:bg-[#0A0A0A] hover:bg-[#F3F4F6] dark:hover:bg-[#171717] disabled:opacity-30 rounded-2xl font-semibold text-[#111111] dark:text-white transition-all active:scale-95 border border-[#E5E7EB] dark:border-[#1A1A1A]/50"
                  >
                    <RotateCcw className="w-5 h-5" /> Tare
                  </button>
                  <button
                    onClick={confirmRecipeIngredient}
                    disabled={netConverted <= 0}
                    className="flex items-center gap-2 px-10 py-4 min-h-[56px] bg-teal-600 hover:bg-teal-500 disabled:opacity-30 rounded-2xl font-bold text-white text-lg transition-all active:scale-95 shadow-lg shadow-teal-900/30"
                  >
                    <Check className="w-6 h-6" /> Confirmer
                  </button>
                </div>
              </>
            ) : recipeSession ? (
              <div className="text-center">
                <CheckCircle2 className="w-16 h-16 text-emerald-400 mx-auto mb-4" />
                <h3 className="text-2xl font-bold text-[#111111] dark:text-white mb-2">Pesee terminee !</h3>
                <p className="text-[#6B7280] dark:text-[#A3A3A3] mb-4">
                  {recipeWeighedCount}/{recipeTotalCount} ingredients peses
                </p>
                <div className="flex items-center justify-center gap-4 mb-6">
                  <div className="px-4 py-3 bg-[#FAFAFA] dark:bg-[#0A0A0A]/80 rounded-xl border border-[#E5E7EB] dark:border-[#1A1A1A]/50">
                    <p className="text-[10px] text-[#9CA3AF] dark:text-[#737373]">Theorique</p>
                    <p className="text-lg font-bold text-[#111111] dark:text-white">{formatCurrency(recipeTheoreticalCost)}</p>
                  </div>
                  <span className="text-[#9CA3AF] dark:text-[#737373]">&rarr;</span>
                  <div className={`px-4 py-3 rounded-xl border ${
                    recipeActualCost > recipeTheoreticalCost * 1.05 ? 'bg-red-900/20 border-red-500/30' : 'bg-emerald-900/20 border-emerald-500/30'
                  }`}>
                    <p className="text-[10px] text-[#9CA3AF] dark:text-[#737373]">Reel</p>
                    <p className={`text-lg font-bold ${recipeActualCost > recipeTheoreticalCost * 1.05 ? 'text-red-400' : 'text-emerald-400'}`}>
                      {formatCurrency(recipeActualCost)}
                    </p>
                  </div>
                </div>
                <button
                  onClick={saveRecipeSession}
                  className="px-8 py-4 min-h-[56px] bg-emerald-600 hover:bg-emerald-500 text-white rounded-2xl font-bold text-lg transition-all active:scale-95"
                >
                  <Save className="w-5 h-5 inline mr-2" />
                  Sauvegarder
                </button>
              </div>
            ) : (
              <div className="text-center text-[#6B7280] dark:text-[#A3A3A3]">
                <BookOpen className="w-16 h-16 mx-auto mb-4 opacity-30" />
                <p className="text-lg">Selectionnez une recette dans le panneau de gauche</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ═══════════════════════════════════════════════════════════ */}
      {/* TAB: HISTORIQUE DES PESEES */}
      {/* ═══════════════════════════════════════════════════════════ */}
      {mainTab === 'historique' && (
        <div className="flex-1 flex flex-col lg:flex-row overflow-y-auto lg:overflow-hidden">
          {/* LEFT: Calendar */}
          <div className="lg:w-96 bg-white dark:bg-black/40 border-b lg:border-b-0 lg:border-r border-[#E5E7EB] dark:border-[#1A1A1A]/60 flex flex-col overflow-hidden shrink-0">
            <div className="p-4 border-b border-[#E5E7EB] dark:border-[#1A1A1A]/60">
              <div className="flex items-center justify-between mb-4">
                <button onClick={() => navigateCalendar(-1)} className="p-2 min-h-[44px] min-w-[44px] hover:bg-[#F3F4F6] dark:hover:bg-[#171717] rounded-lg transition-all">
                  <ArrowLeft className="w-4 h-4 text-[#6B7280] dark:text-[#A3A3A3]" />
                </button>
                <p className="text-sm font-bold text-[#111111] dark:text-white capitalize">
                  {new Date(historyCalendarMonth + '-01').toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' })}
                </p>
                <button onClick={() => navigateCalendar(1)} className="p-2 min-h-[44px] min-w-[44px] hover:bg-[#F3F4F6] dark:hover:bg-[#171717] rounded-lg transition-all">
                  <ChevronRight className="w-4 h-4 text-[#6B7280] dark:text-[#A3A3A3]" />
                </button>
              </div>

              {/* Day headers */}
              <div className="grid grid-cols-7 gap-1 mb-1">
                {['Lu', 'Ma', 'Me', 'Je', 'Ve', 'Sa', 'Di'].map(d => (
                  <div key={d} className="text-center text-[10px] font-medium text-[#9CA3AF] dark:text-[#737373] py-1">{d}</div>
                ))}
              </div>

              {/* Calendar grid */}
              <div className="grid grid-cols-7 gap-1">
                {calendarDays.map((day, i) => (
                  <button
                    key={i}
                    onClick={() => day.hasData && setHistorySelectedDate(day.date)}
                    className={`aspect-square flex flex-col items-center justify-center rounded-lg text-sm transition-all ${
                      historySelectedDate === day.date
                        ? 'bg-teal-600 text-white font-bold'
                        : day.hasData && day.isCurrentMonth
                        ? 'bg-emerald-900/20 text-emerald-400 font-medium hover:bg-emerald-900/40 cursor-pointer'
                        : day.isCurrentMonth
                        ? 'text-[#6B7280] dark:text-[#A3A3A3]'
                        : 'text-[#D1D5DB] dark:text-[#3A3A3A]'
                    }`}
                  >
                    {day.day}
                    {day.hasData && (
                      <div className={`w-1.5 h-1.5 rounded-full mt-0.5 ${historySelectedDate === day.date ? 'bg-white' : 'bg-emerald-400'}`} />
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Session summaries */}
            <div className="flex-1 overflow-y-auto p-3 space-y-2">
              <p className="text-xs font-semibold text-[#6B7280] dark:text-[#A3A3A3] uppercase tracking-wider px-1">Sessions recentes</p>
              {historySessions.slice(0, 15).map(session => (
                <button
                  key={session.date}
                  onClick={() => setHistorySelectedDate(session.date)}
                  className={`w-full flex items-center justify-between px-3 py-3 min-h-[48px] rounded-xl text-left transition-all active:scale-[0.98] ${
                    historySelectedDate === session.date
                      ? 'bg-teal-600/20 border border-teal-500/40'
                      : 'bg-[#FAFAFA]/40 dark:bg-[#0A0A0A]/40 border border-[#E5E7EB] dark:border-[#1A1A1A]/30 hover:bg-[#F3F4F6] dark:hover:bg-[#171717]'
                  }`}
                >
                  <div>
                    <p className="text-sm font-medium text-[#111111] dark:text-white">
                      {new Date(session.date).toLocaleDateString('fr-FR', { weekday: 'short', day: 'numeric', month: 'short' })}
                    </p>
                    <p className="text-[10px] text-[#9CA3AF] dark:text-[#737373]">{session.entries.length} pesees</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold text-teal-400">{session.totalKg.toFixed(1)} kg</p>
                    <p className="text-[10px] text-emerald-400">{formatCurrency(session.totalValue)}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* RIGHT: Detail view */}
          <div className="flex-1 flex flex-col overflow-hidden">
            {historySelectedDate ? (
              <>
                <div className="flex items-center justify-between px-4 py-3 border-b border-[#E5E7EB] dark:border-[#1A1A1A]/60">
                  <div>
                    <p className="text-lg font-bold text-[#111111] dark:text-white">
                      {new Date(historySelectedDate).toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
                    </p>
                    <p className="text-xs text-[#9CA3AF] dark:text-[#737373]">{selectedDateEntries.length} pesees enregistrees</p>
                  </div>
                  <button
                    onClick={() => exportCSV(selectedDateEntries, `pesees_${historySelectedDate}.csv`)}
                    className="flex items-center gap-2 px-4 py-2.5 min-h-[44px] bg-[#111111] dark:bg-white text-white dark:text-[#111111] rounded-xl text-sm font-medium transition-all active:scale-95 hover:bg-[#333] dark:hover:bg-[#E5E5E5]"
                  >
                    <Download className="w-4 h-4" />
                    Exporter CSV
                  </button>
                </div>

                <div className="flex-1 overflow-y-auto p-3 space-y-1.5">
                  {selectedDateEntries.map((entry, i) => (
                    <div
                      key={`${entry.timestamp}-${i}`}
                      className={`rounded-xl px-4 py-3 border ${
                        entry.status === 'error' ? 'bg-red-900/10 border-red-800/30' :
                        'bg-[#FAFAFA]/40 dark:bg-[#0A0A0A]/40 border-[#E5E7EB] dark:border-[#1A1A1A]/30'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                            entry.status === 'error' ? 'bg-red-900/30 text-red-400' :
                            entry.stockAction === 'add' ? 'bg-emerald-900/30 text-emerald-400' :
                            entry.stockAction === 'remove' ? 'bg-red-900/30 text-red-400' :
                            'bg-teal-900/30 text-teal-400'
                          }`}>
                            {entry.stockAction === 'add' ? <ArrowDownToLine className="w-4 h-4" /> :
                             entry.stockAction === 'remove' ? <ArrowUpFromLine className="w-4 h-4" /> :
                             <Scale className="w-4 h-4" />}
                          </div>
                          <div>
                            <p className="text-sm font-medium text-[#111111] dark:text-white">{entry.ingredientName}</p>
                            <div className="flex items-center gap-2 mt-0.5">
                              {entry.ingredientCategory && (
                                <span className={`text-[10px] px-1.5 py-0.5 rounded border ${getCategoryColor(entry.ingredientCategory)}`}>
                                  {entry.ingredientCategory}
                                </span>
                              )}
                              {entry.recipeName && (
                                <span className="text-[10px] px-1.5 py-0.5 rounded bg-purple-900/30 text-purple-400 border border-purple-500/30">
                                  {entry.recipeName}
                                </span>
                              )}
                              <span className="text-[10px] text-[#9CA3AF] dark:text-[#737373]">
                                {new Date(entry.timestamp).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className={`text-lg font-bold tabular-nums ${
                            entry.stockAction === 'add' ? 'text-emerald-400' :
                            entry.stockAction === 'remove' ? 'text-red-400' :
                            'text-teal-400'
                          }`}>
                            {entry.stockAction === 'add' ? '+' : entry.stockAction === 'remove' ? '-' : ''}{entry.weight} {entry.unit}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center text-[#9CA3AF] dark:text-[#737373]">
                <Calendar className="w-16 h-16 mb-4 opacity-30" />
                <p className="text-lg">Selectionnez une date dans le calendrier</p>
                <p className="text-sm mt-1">Les jours avec des pesees sont marques en vert</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ═══════════════════════════════════════════════════════════ */}
      {/* TAB: RAPPORT DU JOUR */}
      {/* ═══════════════════════════════════════════════════════════ */}
      {mainTab === 'rapport' && (
        <div className="flex-1 overflow-y-auto">
          <div className="max-w-4xl mx-auto p-4 sm:p-6 space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-[#111111] dark:text-white flex items-center gap-3">
                  <BarChart3 className="w-7 h-7 text-teal-400" />
                  Rapport du jour
                </h2>
                <p className="text-sm text-[#6B7280] dark:text-[#A3A3A3] mt-1">
                  {new Date().toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
                </p>
              </div>
              <button
                onClick={() => {
                  const today = new Date().toISOString().slice(0, 10);
                  const todayEntries = history.filter(e => e.timestamp.slice(0, 10) === today);
                  exportCSV(todayEntries, `rapport_${today}.csv`);
                }}
                className="flex items-center gap-2 px-4 py-2.5 min-h-[44px] bg-[#111111] dark:bg-white text-white dark:text-[#111111] rounded-xl text-sm font-medium transition-all active:scale-95"
              >
                <Download className="w-4 h-4" />
                Exporter
              </button>
            </div>

            {/* KPI Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="bg-white dark:bg-[#0A0A0A]/50 border border-[#E5E7EB] dark:border-[#1A1A1A] rounded-2xl p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Scale className="w-5 h-5 text-teal-400" />
                  <span className="text-xs text-[#9CA3AF] dark:text-[#737373] uppercase font-medium">Pesees</span>
                </div>
                <p className="text-3xl font-black text-[#111111] dark:text-white tabular-nums">{dailyReport.totalWeighs}</p>
                <p className="text-xs text-[#6B7280] dark:text-[#A3A3A3] mt-1">{dailyReport.uniqueIngredients} ingredients differents</p>
              </div>

              <div className="bg-white dark:bg-[#0A0A0A]/50 border border-[#E5E7EB] dark:border-[#1A1A1A] rounded-2xl p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Package className="w-5 h-5 text-emerald-400" />
                  <span className="text-xs text-[#9CA3AF] dark:text-[#737373] uppercase font-medium">Total pese</span>
                </div>
                <p className="text-3xl font-black text-[#111111] dark:text-white tabular-nums">{dailyReport.totalKg}</p>
                <p className="text-xs text-[#6B7280] dark:text-[#A3A3A3] mt-1">kilogrammes</p>
              </div>

              <div className="bg-white dark:bg-[#0A0A0A]/50 border border-[#E5E7EB] dark:border-[#1A1A1A] rounded-2xl p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Euro className="w-5 h-5 text-emerald-400" />
                  <span className="text-xs text-[#9CA3AF] dark:text-[#737373] uppercase font-medium">Valeur pesee</span>
                </div>
                <p className="text-3xl font-black text-[#111111] dark:text-white tabular-nums">{dailyReport.totalValue}</p>
                <p className="text-xs text-[#6B7280] dark:text-[#A3A3A3] mt-1">euros</p>
              </div>

              <div className={`border rounded-2xl p-4 ${
                dailyReport.totalLoss > 0
                  ? 'bg-red-900/10 dark:bg-red-900/20 border-red-500/30'
                  : 'bg-white dark:bg-[#0A0A0A]/50 border-[#E5E7EB] dark:border-[#1A1A1A]'
              }`}>
                <div className="flex items-center gap-2 mb-2">
                  <AlertTriangle className={`w-5 h-5 ${dailyReport.totalLoss > 0 ? 'text-red-400' : 'text-[#9CA3AF] dark:text-[#737373]'}`} />
                  <span className="text-xs text-[#9CA3AF] dark:text-[#737373] uppercase font-medium">Ecarts</span>
                </div>
                <p className={`text-3xl font-black tabular-nums ${dailyReport.totalLoss > 0 ? 'text-red-400' : 'text-[#111111] dark:text-white'}`}>
                  {dailyReport.discrepancies.length}
                </p>
                <p className="text-xs text-[#6B7280] dark:text-[#A3A3A3] mt-1">
                  {dailyReport.totalLoss > 0 ? `${formatCurrency(dailyReport.totalLoss)} de pertes` : 'Aucune perte detectee'}
                </p>
              </div>
            </div>

            {/* Discrepancies table */}
            {dailyReport.discrepancies.length > 0 && (
              <div className="bg-white dark:bg-[#0A0A0A]/50 border border-[#E5E7EB] dark:border-[#1A1A1A] rounded-2xl overflow-hidden">
                <div className="flex items-center justify-between px-4 py-3 border-b border-[#E5E7EB] dark:border-[#1A1A1A]">
                  <p className="text-sm font-semibold text-[#111111] dark:text-white flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 text-amber-400" />
                    Ecarts detectes (attendu vs reel)
                  </p>
                  <button
                    onClick={() => navigate('/gaspillage')}
                    className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-teal-400 hover:bg-teal-900/20 rounded-lg font-medium transition-all"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    Voir WasteTracker
                  </button>
                </div>
                <div className="divide-y divide-[#E5E7EB] dark:divide-[#1A1A1A]">
                  {dailyReport.discrepancies.map((d, i) => {
                    const color = getAccuracyColor(d.target, d.actual);
                    const AccIcon = getAccuracyIcon(color);
                    return (
                      <div key={i} className="flex items-center justify-between px-4 py-3">
                        <div className="flex items-center gap-3">
                          <AccIcon className={`w-5 h-5 ${color === 'amber' ? 'text-amber-400' : 'text-red-400'}`} />
                          <div>
                            <p className="text-sm font-medium text-[#111111] dark:text-white">{d.ingredient}</p>
                            <p className="text-xs text-[#9CA3AF] dark:text-[#737373]">
                              Cible : {d.target} {d.unit} &rarr; Reel : {d.actual.toFixed(2)} {d.unit}
                            </p>
                          </div>
                        </div>
                        <span className={`text-sm font-bold px-2 py-1 rounded-lg ${
                          color === 'amber' ? 'bg-amber-900/30 text-amber-400' : 'bg-red-900/30 text-red-400'
                        }`}>
                          {d.actual > d.target ? '+' : ''}{d.diff}%
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Error count */}
            {dailyReport.errorCount > 0 && (
              <div className="bg-red-900/10 border border-red-500/30 rounded-2xl p-4 flex items-center gap-3">
                <AlertCircle className="w-6 h-6 text-red-400 shrink-0" />
                <div>
                  <p className="text-sm font-semibold text-red-400">{dailyReport.errorCount} erreur{dailyReport.errorCount > 1 ? 's' : ''} de pesee</p>
                  <p className="text-xs text-[#9CA3AF] dark:text-[#737373]">Verifiez la connexion de la balance et les niveaux de stock</p>
                </div>
              </div>
            )}

            {/* Link to WasteTracker */}
            {dailyReport.totalLoss > 0 && (
              <button
                onClick={() => navigate('/gaspillage')}
                className="w-full flex items-center justify-center gap-3 px-6 py-4 min-h-[56px] bg-amber-900/20 hover:bg-amber-900/30 border border-amber-500/30 rounded-2xl text-amber-400 font-medium transition-all active:scale-[0.98]"
              >
                <AlertTriangle className="w-5 h-5" />
                <span>Pertes estimees : {formatCurrency(dailyReport.totalLoss)}</span>
                <span className="text-xs bg-amber-600/30 px-2 py-0.5 rounded-full">Voir WasteTracker &rarr;</span>
              </button>
            )}

            {/* Empty state */}
            {dailyReport.totalWeighs === 0 && (
              <div className="text-center py-16 text-[#9CA3AF] dark:text-[#737373]">
                <BarChart3 className="w-16 h-16 mx-auto mb-4 opacity-30" />
                <p className="text-lg">Aucune pesee aujourd'hui</p>
                <p className="text-sm mt-1">Les donnees du rapport s'afficheront apres vos premieres pesees</p>
                <button
                  onClick={() => setMainTab('peser')}
                  className="mt-4 px-6 py-3 bg-teal-600 hover:bg-teal-500 text-white rounded-xl font-medium transition-all active:scale-95"
                >
                  Commencer a peser
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
