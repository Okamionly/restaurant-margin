import { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Pencil, Trash2, Search, ArrowUpDown, Printer, Loader2, Check, ChevronDown, ChevronUp, X, BookOpen, Scale, Package, Euro, Tag, Truck, TrendingUp, TrendingDown, CheckSquare, BarChart3, Bell, AlertTriangle, Minus, Flame, CheckCircle, Download, Upload, SlidersHorizontal, Filter, Percent, ShoppingBasket } from 'lucide-react';
import SearchBar, { type SearchSuggestion } from '../components/SearchBar';
import FilterPanel, { type FilterDef, type FilterValues } from '../components/FilterPanel';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';
import { searchCatalog, type CatalogProduct } from '../data/productCatalog';
import { fetchIngredients, createIngredient, updateIngredient, deleteIngredient, fetchSuppliers, createSupplier, fetchInventory, addToInventory, restockInventoryItem, updateInventoryItem } from '../services/api';
import type { Ingredient, Supplier, InventoryItem } from '../types';
import { INGREDIENT_CATEGORIES, UNITS, ALLERGENS } from '../types';
import { useToast } from '../hooks/useToast';
import { useTranslation } from '../hooks/useTranslation';
import { useRestaurant } from '../hooks/useRestaurant';
import { isInSeason } from '../data/seasons';
import Modal from '../components/Modal';
import ConfirmDialog from '../components/ConfirmDialog';
import WeighModal from '../components/WeighModal';
import IngredientAvatar from '../components/IngredientAvatar';
import { formatCurrency, getCurrencySymbol } from '../utils/currency';
import { updateOnboardingStep } from '../components/OnboardingWizard';

// ── Price alert helpers (localStorage) ─────────────────────────────────
interface PriceAlert {
  ingredientId: number;
  threshold: number;
}

function getPriceAlerts(): PriceAlert[] {
  try {
    return JSON.parse(localStorage.getItem('restaumargin_price_alerts') || '[]');
  } catch { return []; }
}

function setPriceAlert(ingredientId: number, threshold: number) {
  const alerts = getPriceAlerts().filter(a => a.ingredientId !== ingredientId);
  if (threshold > 0) alerts.push({ ingredientId, threshold });
  localStorage.setItem('restaumargin_price_alerts', JSON.stringify(alerts));
}

function removePriceAlert(ingredientId: number) {
  const alerts = getPriceAlerts().filter(a => a.ingredientId !== ingredientId);
  localStorage.setItem('restaumargin_price_alerts', JSON.stringify(alerts));
}

function getAlertForIngredient(ingredientId: number): number | null {
  const alert = getPriceAlerts().find(a => a.ingredientId === ingredientId);
  return alert ? alert.threshold : null;
}

// ── Price history response type ────────────────────────────────────────
interface PriceHistoryResponse {
  data: { date: string; price: number }[];
  minPrice: number;
  maxPrice: number;
  avgPrice: number;
  currentPrice: number;
  trend: 'up' | 'down' | 'stable';
  volatility: number;
  supplierPrices: { supplierId: number | null; supplierName: string; price: number }[];
}

// ── Category color mapping ─────────────────────────────────────────────
const CATEGORY_COLORS: Record<string, { border: string; bg: string; text: string; darkBorder: string; darkBg: string }> = {
  'Viandes': { border: 'border-red-400', bg: 'bg-red-50', text: 'text-red-700', darkBorder: 'dark:border-red-800', darkBg: 'dark:bg-red-950/30' },
  'Poissons & Fruits de mer': { border: 'border-blue-400', bg: 'bg-blue-50', text: 'text-blue-700', darkBorder: 'dark:border-blue-800', darkBg: 'dark:bg-blue-950/30' },
  'Légumes': { border: 'border-green-400', bg: 'bg-green-50', text: 'text-green-700', darkBorder: 'dark:border-green-800', darkBg: 'dark:bg-green-950/30' },
  'Fruits': { border: 'border-orange-400', bg: 'bg-orange-50', text: 'text-orange-700', darkBorder: 'dark:border-orange-800', darkBg: 'dark:bg-orange-950/30' },
  'Produits laitiers': { border: 'border-yellow-400', bg: 'bg-yellow-50', text: 'text-yellow-700', darkBorder: 'dark:border-yellow-800', darkBg: 'dark:bg-yellow-950/30' },
  'Épices & Condiments': { border: 'border-amber-400', bg: 'bg-amber-50', text: 'text-amber-700', darkBorder: 'dark:border-amber-800', darkBg: 'dark:bg-amber-950/30' },
  'Féculents & Céréales': { border: 'border-lime-400', bg: 'bg-lime-50', text: 'text-lime-700', darkBorder: 'dark:border-lime-800', darkBg: 'dark:bg-lime-950/30' },
  'Huiles & Matières grasses': { border: 'border-yellow-500', bg: 'bg-yellow-50', text: 'text-yellow-700', darkBorder: 'dark:border-yellow-700', darkBg: 'dark:bg-yellow-950/30' },
  'Boissons': { border: 'border-cyan-400', bg: 'bg-cyan-50', text: 'text-cyan-700', darkBorder: 'dark:border-cyan-800', darkBg: 'dark:bg-cyan-950/30' },
  'Autres': { border: 'border-gray-400', bg: 'bg-gray-50', text: 'text-gray-700', darkBorder: 'dark:border-gray-700', darkBg: 'dark:bg-gray-900/30' },
};

// ── Supplier badge colors (hash-based) ─────────────────────────────────
const SUPPLIER_BADGE_COLORS = [
  { bg: 'bg-violet-100 dark:bg-violet-900/30', text: 'text-violet-700 dark:text-violet-300', hover: 'hover:bg-violet-200 dark:hover:bg-violet-900/50' },
  { bg: 'bg-sky-100 dark:bg-sky-900/30', text: 'text-sky-700 dark:text-sky-300', hover: 'hover:bg-sky-200 dark:hover:bg-sky-900/50' },
  { bg: 'bg-rose-100 dark:bg-rose-900/30', text: 'text-rose-700 dark:text-rose-300', hover: 'hover:bg-rose-200 dark:hover:bg-rose-900/50' },
  { bg: 'bg-emerald-100 dark:bg-emerald-900/30', text: 'text-emerald-700 dark:text-emerald-300', hover: 'hover:bg-emerald-200 dark:hover:bg-emerald-900/50' },
  { bg: 'bg-amber-100 dark:bg-amber-900/30', text: 'text-amber-700 dark:text-amber-300', hover: 'hover:bg-amber-200 dark:hover:bg-amber-900/50' },
  { bg: 'bg-teal-100 dark:bg-teal-900/30', text: 'text-teal-700 dark:text-teal-300', hover: 'hover:bg-teal-200 dark:hover:bg-teal-900/50' },
  { bg: 'bg-indigo-100 dark:bg-indigo-900/30', text: 'text-indigo-700 dark:text-indigo-300', hover: 'hover:bg-indigo-200 dark:hover:bg-indigo-900/50' },
  { bg: 'bg-pink-100 dark:bg-pink-900/30', text: 'text-pink-700 dark:text-pink-300', hover: 'hover:bg-pink-200 dark:hover:bg-pink-900/50' },
];

function getSupplierBadgeColor(name: string) {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return SUPPLIER_BADGE_COLORS[Math.abs(hash) % SUPPLIER_BADGE_COLORS.length];
}

// ── CSS-only Sparkline Component ───────────────────────────────────────
function PriceSparkline({ prices }: { prices: number[] }) {
  if (prices.length < 2) return null;
  // Take last 6 values
  const pts = prices.slice(-6);
  const min = Math.min(...pts);
  const max = Math.max(...pts);
  const range = max - min || 1;
  const trending = pts[pts.length - 1] > pts[0] ? 'up' : pts[pts.length - 1] < pts[0] ? 'down' : 'stable';
  const color = trending === 'up' ? '#EF4444' : trending === 'down' ? '#10B981' : '#9CA3AF';

  // Generate SVG path
  const width = 60;
  const height = 20;
  const stepX = width / (pts.length - 1);
  const points = pts.map((p, i) => ({
    x: i * stepX,
    y: height - ((p - min) / range) * (height - 4) - 2,
  }));

  const pathD = points.map((p, i) => (i === 0 ? `M ${p.x} ${p.y}` : `L ${p.x} ${p.y}`)).join(' ');

  return (
    <svg width={width} height={height} className="inline-block ml-1.5 align-middle" viewBox={`0 0 ${width} ${height}`}>
      <path d={pathD} fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      {points.map((p, i) => (
        <circle key={i} cx={p.x} cy={p.y} r="2" fill={color} />
      ))}
    </svg>
  );
}

const emptyForm = { name: '', unit: 'kg', pricePerUnit: '', supplier: '', supplierId: null as number | null, category: 'Légumes', allergens: [] as string[], barcode: '' };

type SortKey = 'name' | 'category' | 'pricePerUnit' | 'unit' | 'supplier';
type SortDir = 'asc' | 'desc';

export default function Ingredients() {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const { t } = useTranslation();
  const { selectedRestaurant, loading: restaurantLoading } = useRestaurant();
  const [ingredients, setIngredients] = useState<Ingredient[]>([]);
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterCategory, setFilterCategory] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [sortKey, setSortKey] = useState<SortKey>('name');
  const [sortDir, setSortDir] = useState<SortDir>('asc');
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Bulk selection
  const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set());
  const [bulkCategoryOpen, setBulkCategoryOpen] = useState(false);
  const [bulkSupplierOpen, setBulkSupplierOpen] = useState(false);

  // Bulk price update
  const [showBulkPriceModal, setShowBulkPriceModal] = useState(false);
  const [bulkPricePercent, setBulkPricePercent] = useState('');
  const [bulkPriceDirection, setBulkPriceDirection] = useState<'increase' | 'decrease'>('increase');

  // Delete confirm
  const [deleteTarget, setDeleteTarget] = useState<number | null>(null);

  // Weigh modal
  const [weighTarget, setWeighTarget] = useState<Ingredient | null>(null);
  const [inventoryItems, setInventoryItems] = useState<InventoryItem[]>([]);

  // New: form enhancements state
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [formErrors, setFormErrors] = useState<Record<string, boolean>>({});
  const [nameQuery, setNameQuery] = useState('');
  const [showNameSuggestions, setShowNameSuggestions] = useState(false);
  const [supplierQuery, setSupplierQuery] = useState('');
  const [showSupplierDropdown, setShowSupplierDropdown] = useState(false);
  const [showNewSupplierForm, setShowNewSupplierForm] = useState(false);
  const [newSupplierName, setNewSupplierName] = useState('');
  const nameInputRef = useRef<HTMLInputElement>(null);
  const supplierDropdownRef = useRef<HTMLDivElement>(null);
  const nameDropdownRef = useRef<HTMLDivElement>(null);

  // Price history state (edit form mini-chart)
  const [priceHistory, setPriceHistory] = useState<{ date: string; price: number }[]>([]);
  const [priceHistoryLoading, setPriceHistoryLoading] = useState(false);

  // Price tracker modal state
  const [trackerIngredient, setTrackerIngredient] = useState<Ingredient | null>(null);
  const [trackerData, setTrackerData] = useState<PriceHistoryResponse | null>(null);
  const [trackerLoading, setTrackerLoading] = useState(false);
  const [trackerPeriod, setTrackerPeriod] = useState<30 | 90 | 365>(30);
  const [alertInput, setAlertInput] = useState('');
  const [alertsChecked, setAlertsChecked] = useState(false);

  // Advanced filters (via FilterPanel)
  const [advancedFilters, setAdvancedFilters] = useState<FilterValues>({
    supplier: '',
    price: { min: '', max: '' },
    unit: '',
    allergen: [],
  });

  // All-ingredient price histories for sparklines (simple simulation from updatedAt)
  const [allPriceHistories, setAllPriceHistories] = useState<Record<number, number[]>>({});

  // Last price for edited ingredient
  const lastPrice = useMemo(() => {
    if (!editingId) return null;
    const ing = ingredients.find((i) => i.id === editingId);
    return ing ? ing.pricePerUnit : null;
  }, [editingId, ingredients]);

  // Suppliers from database
  const filteredSuppliersList = useMemo(() => {
    if (!supplierQuery.trim()) return suppliers;
    const q = supplierQuery.toLowerCase();
    return suppliers.filter((s) => s.name.toLowerCase().includes(q));
  }, [suppliers, supplierQuery]);

  // Name suggestions from existing ingredients (for duplicate detection)
  const nameSuggestions = useMemo(() => {
    if (!nameQuery || nameQuery.length < 2) return [];
    const q = nameQuery.toLowerCase();
    return ingredients.filter((i) => i.name.toLowerCase().includes(q)).slice(0, 5);
  }, [nameQuery, ingredients]);

  // Catalog suggestions (new products with reference prices)
  const catalogSuggestions = useMemo(() => {
    if (!nameQuery || nameQuery.length < 2) return [];
    const existingNames = new Set(ingredients.map(i => i.name.toLowerCase()));
    return searchCatalog(nameQuery, 10).filter(p => !existingNames.has(p.name.toLowerCase()));
  }, [nameQuery, ingredients]);

  // KPI summary values
  const summaryStats = useMemo(() => {
    const total = ingredients.length;
    const avgPrice = total > 0
      ? ingredients.reduce((sum, i) => sum + i.pricePerUnit, 0) / total
      : 0;
    const catPrices: Record<string, { sum: number; count: number }> = {};
    ingredients.forEach((i) => {
      if (!catPrices[i.category]) catPrices[i.category] = { sum: 0, count: 0 };
      catPrices[i.category].sum += i.pricePerUnit;
      catPrices[i.category].count += 1;
    });
    let expensiveCat = '\u2014';
    let maxAvg = 0;
    Object.entries(catPrices).forEach(([cat, { sum, count }]) => {
      const avg = sum / count;
      if (avg > maxAvg) { maxAvg = avg; expensiveCat = cat; }
    });
    const uniqueSuppliers = new Set(ingredients.filter((i) => i.supplierId).map((i) => i.supplierId)).size;
    return { total, avgPrice, expensiveCat, uniqueSuppliers };
  }, [ingredients]);

  // Category counts for pill filters
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    ingredients.forEach((i) => {
      counts[i.category] = (counts[i.category] || 0) + 1;
    });
    return counts;
  }, [ingredients]);

  // Category summary cards data
  const categorySummaries = useMemo(() => {
    const data: Record<string, { count: number; totalSpend: number; avgPrice: number }> = {};
    ingredients.forEach((i) => {
      if (!data[i.category]) data[i.category] = { count: 0, totalSpend: 0, avgPrice: 0 };
      data[i.category].count += 1;
      data[i.category].totalSpend += i.pricePerUnit;
    });
    Object.keys(data).forEach((cat) => {
      data[cat].avgPrice = data[cat].count > 0 ? data[cat].totalSpend / data[cat].count : 0;
    });
    return data;
  }, [ingredients]);

  // Cost alert: detect ingredients with >10% price increase (simulated via updatedAt recency)
  const costAlertIds = useMemo(() => {
    const alertSet = new Set<number>();
    const stableSet = new Set<number>();
    ingredients.forEach((ing) => {
      const history = allPriceHistories[ing.id];
      if (history && history.length >= 2) {
        const oldest = history[0];
        const latest = history[history.length - 1];
        const pctChange = oldest > 0 ? ((latest - oldest) / oldest) * 100 : 0;
        if (pctChange > 10) {
          alertSet.add(ing.id);
        } else {
          stableSet.add(ing.id);
        }
      } else {
        stableSet.add(ing.id);
      }
    });
    return { alertIds: alertSet, stableIds: stableSet };
  }, [ingredients, allPriceHistories]);

  // Close dropdowns on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (supplierDropdownRef.current && !supplierDropdownRef.current.contains(e.target as Node)) {
        setShowSupplierDropdown(false);
      }
      if (nameDropdownRef.current && !nameDropdownRef.current.contains(e.target as Node)) {
        setShowNameSuggestions(false);
      }
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  useEffect(() => {
    if (restaurantLoading || !selectedRestaurant) return;
    loadIngredients();
  }, [selectedRestaurant, restaurantLoading]);

  // Fetch price history when editing an ingredient
  useEffect(() => {
    if (!editingId) {
      setPriceHistory([]);
      return;
    }
    setPriceHistoryLoading(true);
    const token = localStorage.getItem('token');
    const headers: Record<string, string> = { 'Content-Type': 'application/json' };
    if (token) headers['Authorization'] = `Bearer ${token}`;
    fetch(`/api/price-history?ingredientId=${editingId}`, { headers })
      .then(res => res.ok ? res.json() : [])
      .then((data: { date: string; price: number }[]) => {
        setPriceHistory(data);
      })
      .catch(() => setPriceHistory([]))
      .finally(() => setPriceHistoryLoading(false));
  }, [editingId]);

  // Load sparkline data for all ingredients
  useEffect(() => {
    if (ingredients.length === 0) return;
    const token = localStorage.getItem('token');
    const headers: Record<string, string> = { 'Content-Type': 'application/json' };
    if (token) headers['Authorization'] = `Bearer ${token}`;
    // Fetch price histories for all ingredients in batch (or individually)
    const histories: Record<number, number[]> = {};
    const promises = ingredients.map((ing) =>
      fetch(`/api/price-history?ingredientId=${ing.id}&period=90`, { headers })
        .then(res => res.ok ? res.json() : null)
        .then((data) => {
          if (data && Array.isArray(data.data) && data.data.length > 0) {
            histories[ing.id] = data.data.map((d: { price: number }) => d.price);
          } else if (data && Array.isArray(data) && data.length > 0) {
            histories[ing.id] = data.map((d: { price: number }) => d.price);
          }
        })
        .catch(() => {})
    );
    Promise.all(promises).then(() => {
      setAllPriceHistories(histories);
    });
  }, [ingredients]);

  async function loadIngredients() {
    try {
      const [data, sups, inv] = await Promise.all([fetchIngredients(), fetchSuppliers(), fetchInventory().catch(() => [] as InventoryItem[])]);
      setIngredients(data);
      setSuppliers(sups);
      setInventoryItems(inv);
      // Check price alerts once per session
      if (!alertsChecked) {
        setAlertsChecked(true);
        const alerts = getPriceAlerts();
        for (const alert of alerts) {
          const ing = data.find((i: Ingredient) => i.id === alert.ingredientId);
          if (ing && ing.pricePerUnit > alert.threshold) {
            showToast(
              `Alerte prix : ${ing.name} a ${ing.pricePerUnit.toFixed(2)} \u20AC (seuil: ${alert.threshold.toFixed(2)} \u20AC)`,
              'error'
            );
          }
        }
      }
    } catch {
      showToast(t('ingredients.loadError'), 'error');
    } finally {
      setLoading(false);
    }
  }

  // Fetch enhanced price history for the tracker modal
  async function fetchTrackerData(ingredientId: number, period: number) {
    setTrackerLoading(true);
    try {
      const token = localStorage.getItem('token');
      const headers: Record<string, string> = { 'Content-Type': 'application/json' };
      if (token) headers['Authorization'] = `Bearer ${token}`;
      const res = await fetch(`/api/price-history?ingredientId=${ingredientId}&period=${period}`, { headers });
      if (res.ok) {
        const data: PriceHistoryResponse = await res.json();
        setTrackerData(data);
      } else {
        setTrackerData(null);
      }
    } catch {
      setTrackerData(null);
    } finally {
      setTrackerLoading(false);
    }
  }

  // Open price tracker modal
  function openPriceTracker(ing: Ingredient) {
    setTrackerIngredient(ing);
    setTrackerPeriod(30);
    setAlertInput(String(getAlertForIngredient(ing.id) || ''));
    fetchTrackerData(ing.id, 30);
  }

  // Change period in tracker
  function changeTrackerPeriod(period: 30 | 90 | 365) {
    setTrackerPeriod(period);
    if (trackerIngredient) {
      fetchTrackerData(trackerIngredient.id, period);
    }
  }

  // Save alert threshold
  function saveAlertThreshold() {
    if (!trackerIngredient) return;
    const val = parseFloat(alertInput);
    if (val > 0) {
      setPriceAlert(trackerIngredient.id, val);
      showToast(`Alerte configuree : ${trackerIngredient.name} > ${val.toFixed(2)} \u20AC`, 'success');
    } else {
      removePriceAlert(trackerIngredient.id);
      showToast(`Alerte supprimee pour ${trackerIngredient.name}`, 'success');
    }
  }

  // Smart search suggestions
  const searchSuggestions = useMemo<SearchSuggestion[]>(() => {
    if (!search.trim()) return [];
    const q = search.toLowerCase();
    return ingredients
      .filter((i) => i.name.toLowerCase().includes(q))
      .slice(0, 8)
      .map((i) => ({
        id: `ing-${i.id}`,
        label: i.name,
        category: 'Ingredients',
        icon: ShoppingBasket,
        onSelect: () => setSearch(i.name),
      }));
  }, [search, ingredients]);

  // Filter definitions for FilterPanel
  const ingredientFilterDefs = useMemo<FilterDef[]>(() => [
    {
      key: 'supplier',
      label: 'Fournisseur',
      type: 'select',
      placeholder: 'Tous les fournisseurs',
      options: suppliers.map((s) => ({ value: s.name, label: s.name })),
    },
    {
      key: 'price',
      label: 'Fourchette de prix',
      type: 'range',
      step: 0.01,
      unit: getCurrencySymbol(),
    },
    {
      key: 'unit',
      label: 'Unite',
      type: 'select',
      placeholder: 'Toutes les unites',
      options: UNITS.map((u) => ({ value: u, label: u })),
    },
    {
      key: 'allergen',
      label: 'Allergenes',
      type: 'tags',
      options: ALLERGENS.map((a) => ({ value: a, label: a })),
    },
  ], [suppliers]);

  const filtered = useMemo(() => {
    const filterSupplier = advancedFilters.supplier || '';
    const filterPriceMin = advancedFilters.price?.min || '';
    const filterPriceMax = advancedFilters.price?.max || '';
    const filterUnit = advancedFilters.unit || '';
    const filterAllergens: string[] = advancedFilters.allergen || [];

    let result = ingredients.filter((i) => {
      const q = search.toLowerCase();
      const matchSearch = i.name.toLowerCase().includes(q) ||
        (i.supplier && i.supplier.toLowerCase().includes(q)) ||
        (i.supplierRef?.name && i.supplierRef.name.toLowerCase().includes(q)) ||
        i.category.toLowerCase().includes(q);
      const matchCategory = !filterCategory || i.category === filterCategory;
      const matchSupplier = !filterSupplier || (i.supplierRef?.name || i.supplier || '').toLowerCase().includes(filterSupplier.toLowerCase());
      const matchPriceMin = !filterPriceMin || i.pricePerUnit >= parseFloat(filterPriceMin);
      const matchPriceMax = !filterPriceMax || i.pricePerUnit <= parseFloat(filterPriceMax);
      const matchUnit = !filterUnit || i.unit === filterUnit;
      const matchAllergen = filterAllergens.length === 0 || filterAllergens.some((a) => (i as any).allergens?.includes(a));
      return matchSearch && matchCategory && matchSupplier && matchPriceMin && matchPriceMax && matchUnit && matchAllergen;
    });
    result.sort((a, b) => {
      let aVal: string | number = a[sortKey as keyof typeof a] as string | number;
      let bVal: string | number = b[sortKey as keyof typeof b] as string | number;
      if (typeof aVal === 'string') aVal = (aVal || '').toLowerCase();
      if (typeof bVal === 'string') bVal = (bVal || '').toLowerCase();
      if (aVal < bVal) return sortDir === 'asc' ? -1 : 1;
      if (aVal > bVal) return sortDir === 'asc' ? 1 : -1;
      return 0;
    });
    return result;
  }, [ingredients, search, filterCategory, sortKey, sortDir, advancedFilters]);

  function toggleSort(key: SortKey) {
    if (sortKey === key) {
      setSortDir(sortDir === 'asc' ? 'desc' : 'asc');
    } else {
      setSortKey(key);
      setSortDir('asc');
    }
  }

  function openNew() {
    setForm(emptyForm);
    setEditingId(null);
    setFormErrors({});
    setNameQuery('');
    setSupplierQuery('');
    setShowNewSupplierForm(false);
    setShowForm(true);
  }

  function openEdit(ing: Ingredient) {
    const supplierName = ing.supplier || ing.supplierRef?.name || '';
    const supplierIdVal = ing.supplierId || ing.supplierRef?.id || null;
    setForm({
      name: ing.name,
      unit: ing.unit,
      pricePerUnit: String(ing.pricePerUnit),
      supplier: supplierName,
      supplierId: supplierIdVal,
      category: ing.category,
      allergens: ing.allergens || [],
      barcode: ing.barcode || '',
    });
    setEditingId(ing.id);
    setFormErrors({});
    setNameQuery(ing.name);
    setSupplierQuery(supplierName);
    setShowNewSupplierForm(false);
    setShowForm(true);
  }

  function toggleAllergen(allergen: string) {
    setForm((prev) => ({
      ...prev,
      allergens: prev.allergens.includes(allergen)
        ? prev.allergens.filter((a) => a !== allergen)
        : [...prev.allergens, allergen],
    }));
  }

  // Handle name change with autocomplete
  function handleNameChange(value: string) {
    setNameQuery(value);
    setForm({ ...form, name: value });
    setShowNameSuggestions(value.length >= 2 && (nameSuggestions.length > 0 || catalogSuggestions.length > 0));
    if (formErrors.name && value.trim()) {
      setFormErrors((prev) => ({ ...prev, name: false }));
    }
  }

  // Auto-fill unit and category when selecting an existing ingredient name
  function selectNameSuggestion(ing: Ingredient) {
    setForm({
      ...form,
      name: ing.name,
      unit: ing.unit,
      category: ing.category,
    });
    setNameQuery(ing.name);
    setShowNameSuggestions(false);
  }

  // Auto-fill from catalog product (new product with reference price)
  function selectCatalogProduct(product: CatalogProduct) {
    setForm({
      ...form,
      name: product.name,
      unit: product.unit,
      pricePerUnit: String(product.prixMoy),
      category: product.category,
    });
    setNameQuery(product.name);
    setShowNameSuggestions(false);
  }

  // Supplier selection
  function selectSupplier(sup: Supplier) {
    setForm({ ...form, supplier: sup.name, supplierId: sup.id });
    setSupplierQuery(sup.name);
    setShowSupplierDropdown(false);
  }

  function handleSupplierInputChange(value: string) {
    setSupplierQuery(value);
    const match = suppliers.find((s) => s.name.toLowerCase() === value.toLowerCase());
    setForm({ ...form, supplier: value, supplierId: match ? match.id : null });
    setShowSupplierDropdown(true);
  }

  async function addNewSupplier() {
    if (!newSupplierName.trim()) return;
    try {
      const newSup = await createSupplier({ name: newSupplierName.trim(), phone: null, email: null, address: null, city: null, postalCode: null, region: null, country: 'France', siret: null, website: null, notes: null, categories: [], contactName: null, delivery: false, minOrder: null, paymentTerms: null, whatsappPhone: null });
      setSuppliers([...suppliers, newSup]);
      setForm({ ...form, supplier: newSup.name, supplierId: newSup.id });
      setSupplierQuery(newSup.name);
      setShowNewSupplierForm(false);
      setNewSupplierName('');
      setShowSupplierDropdown(false);
      showToast(t('ingredients.supplierCreated'), 'success');
    } catch {
      showToast(t('ingredients.supplierCreateError'), 'error');
    }
  }

  // Keyboard shortcut: Enter to save (handled by form), Escape handled by Modal
  const handleFormKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
      e.preventDefault();
      const formEl = (e.target as HTMLElement).closest('form');
      if (formEl) formEl.requestSubmit();
    }
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    // Validation
    const errors: Record<string, boolean> = {};
    if (!form.name.trim()) errors.name = true;
    if (!form.pricePerUnit || parseFloat(form.pricePerUnit) <= 0) errors.pricePerUnit = true;
    if (!form.unit) errors.unit = true;
    if (!form.category) errors.category = true;

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    setFormErrors({});
    setSaving(true);

    const data = {
      name: form.name,
      unit: form.unit,
      pricePerUnit: parseFloat(form.pricePerUnit),
      supplier: form.supplier || null,
      supplierId: form.supplierId,
      category: form.category,
      allergens: form.allergens,
      barcode: form.barcode || null,
    };

    try {
      if (editingId) {
        await updateIngredient(editingId, data);
      } else {
        await createIngredient(data);
        updateOnboardingStep('ingredientAdded', true);
      }
      setSaveSuccess(true);
      setTimeout(() => {
        setSaveSuccess(false);
        setShowForm(false);
        showToast(editingId ? t('ingredients.ingredientUpdated') : t('ingredients.ingredientCreated'), 'success');
        loadIngredients();
      }, 600);
    } catch {
      showToast(t('ingredients.saveError'), 'error');
    } finally {
      setSaving(false);
    }
  }

  async function handleDeleteConfirm() {
    if (!deleteTarget) return;
    try {
      await deleteIngredient(deleteTarget);
      showToast(t('ingredients.ingredientDeleted'), 'success');
      loadIngredients();
    } catch {
      showToast(t('ingredients.deleteError'), 'error');
    } finally {
      setDeleteTarget(null);
    }
  }

  // Weigh and add to inventory
  function openWeigh(ing: Ingredient) {
    setWeighTarget(ing);
  }

  async function handleWeighComplete(data: { weight: number; mode: 'set' | 'add' }) {
    if (!weighTarget) return;
    try {
      const valueStr = weighTarget.pricePerUnit > 0
        ? ` (${formatCurrency(data.weight * weighTarget.pricePerUnit)})`
        : '';
      const invItem = inventoryItems.find(i => i.ingredientId === weighTarget.id);
      if (invItem) {
        if (data.mode === 'set') {
          await updateInventoryItem(invItem.id, { currentStock: data.weight });
          showToast(t('ingredients.stockUpdated').replace('{weight}', String(data.weight)).replace('{unit}', weighTarget.unit).replace('{value}', valueStr), 'success');
        } else {
          await restockInventoryItem(invItem.id, data.weight);
          showToast(t('ingredients.stockUpdated').replace('{weight}', String(data.weight)).replace('{unit}', weighTarget.unit).replace('{value}', valueStr), 'success');
        }
      } else {
        await addToInventory({
          ingredientId: weighTarget.id,
          currentStock: data.weight,
          minStock: 0,
          unit: weighTarget.unit,
        });
        showToast(t('ingredients.addedToInventory').replace('{weight}', String(data.weight)).replace('{unit}', weighTarget.unit).replace('{name}', weighTarget.name).replace('{value}', valueStr), 'success');
      }
      setWeighTarget(null);
      loadIngredients();
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : t('ingredients.inventoryError');
      showToast(message, 'error');
    }
  }

  // ── Bulk selection helpers ───────────────────────────────────────────
  function toggleSelectOne(id: number) {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  }

  function toggleSelectAll() {
    if (selectedIds.size === filtered.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(filtered.map((i) => i.id)));
    }
  }

  async function bulkDelete() {
    const ids = Array.from(selectedIds);
    try {
      await Promise.all(ids.map((id) => deleteIngredient(id)));
      showToast(`${ids.length} ingredient(s) supprime(s)`, 'success');
      setSelectedIds(new Set());
      loadIngredients();
    } catch {
      showToast(t('ingredients.deleteError'), 'error');
    }
  }

  async function bulkChangeCategory(category: string) {
    const ids = Array.from(selectedIds);
    try {
      await Promise.all(ids.map((id) => updateIngredient(id, { category })));
      showToast(`Categorie changee pour ${ids.length} ingredient(s)`, 'success');
      setSelectedIds(new Set());
      setBulkCategoryOpen(false);
      loadIngredients();
    } catch {
      showToast(t('ingredients.saveError'), 'error');
    }
  }

  async function bulkChangeSupplier(supplierId: number, supplierName: string) {
    const ids = Array.from(selectedIds);
    try {
      await Promise.all(ids.map((id) => updateIngredient(id, { supplierId, supplier: supplierName })));
      showToast(`Fournisseur assigne pour ${ids.length} ingredient(s)`, 'success');
      setSelectedIds(new Set());
      setBulkSupplierOpen(false);
      loadIngredients();
    } catch {
      showToast(t('ingredients.saveError'), 'error');
    }
  }

  // ── Bulk Price Update ─────────────────────────────────────────────
  function openBulkPriceUpdate() {
    setBulkPricePercent('');
    setBulkPriceDirection('increase');
    setShowBulkPriceModal(true);
  }

  const bulkPricePreview = useMemo(() => {
    const pct = parseFloat(bulkPricePercent);
    if (isNaN(pct) || pct <= 0) return [];
    const ids = Array.from(selectedIds);
    return ids.map((id) => {
      const ing = ingredients.find(i => i.id === id);
      if (!ing) return null;
      const multiplier = bulkPriceDirection === 'increase' ? (1 + pct / 100) : (1 - pct / 100);
      const newPrice = Math.max(0, ing.pricePerUnit * multiplier);
      return { id: ing.id, name: ing.name, oldPrice: ing.pricePerUnit, newPrice, unit: ing.unit };
    }).filter(Boolean) as { id: number; name: string; oldPrice: number; newPrice: number; unit: string }[];
  }, [selectedIds, ingredients, bulkPricePercent, bulkPriceDirection]);

  async function applyBulkPriceUpdate() {
    if (bulkPricePreview.length === 0) return;
    try {
      await Promise.all(bulkPricePreview.map(item =>
        updateIngredient(item.id, { pricePerUnit: Math.round(item.newPrice * 100) / 100 })
      ));
      showToast(`Prix mis a jour pour ${bulkPricePreview.length} ingredient(s)`, 'success');
      setShowBulkPriceModal(false);
      setSelectedIds(new Set());
      loadIngredients();
    } catch {
      showToast(t('ingredients.saveError'), 'error');
    }
  }

  // ── Export CSV ────────────────────────────────────────────────────
  function exportCSV() {
    const header = ['Nom', 'Categorie', 'Prix unitaire', 'Unite', 'Fournisseur', 'Allergenes', 'Code-barres'];
    const rows = ingredients.map(ing => [
      ing.name,
      ing.category,
      ing.pricePerUnit.toFixed(2),
      ing.unit,
      ing.supplierRef?.name || ing.supplier || '',
      (ing.allergens || []).join('; '),
      ing.barcode || '',
    ]);
    const csvContent = [header, ...rows].map(row => row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(',')).join('\n');
    const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ingredients_restaumargin_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    showToast(`${ingredients.length} ingredients exportes en CSV`, 'success');
  }

  function downloadCSVTemplate() {
    const header = ['Nom', 'Categorie', 'Prix unitaire', 'Unite', 'Fournisseur', 'Allergenes', 'Code-barres'];
    const exampleRow = ['Tomate cerise', 'Legumes', '3.50', 'kg', 'Metro', 'Aucun', ''];
    const csvContent = [header, exampleRow].map(row => row.map(cell => `"${cell}"`).join(',')).join('\n');
    const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'template_ingredients_restaumargin.csv';
    a.click();
    URL.revokeObjectURL(url);
  }

  function handleImportClick() {
    fileInputRef.current?.click();
  }

  // Check if any advanced filter is active (kept for backward compat)
  const hasAdvancedFilters = !!(advancedFilters.supplier || advancedFilters.price?.min || advancedFilters.price?.max || advancedFilters.unit || (advancedFilters.allergen?.length > 0));

  function clearAdvancedFilters() {
    setAdvancedFilters({ supplier: '', price: { min: '', max: '' }, unit: '', allergen: [] });
  }

  function SortHeader({ label, field }: { label: string; field: SortKey }) {
    return (
      <button onClick={() => toggleSort(field)} className="flex items-center gap-1 font-medium hover:text-[#111111] dark:hover:text-white">
        {label}
        <ArrowUpDown className={`w-3 h-3 ${sortKey === field ? 'text-[#111111] dark:text-white' : 'text-[#9CA3AF] dark:text-[#737373]'}`} />
      </button>
    );
  }

  if (loading) return <div className="text-center py-12 text-[#9CA3AF] dark:text-[#737373]">{t('ingredients.loading')}</div>;

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 mb-4 sm:mb-6">
        <h2 className="text-xl sm:text-2xl font-bold text-[#111111] dark:text-white">{t('ingredients.title')}</h2>
        <div className="flex flex-wrap gap-2 w-full sm:w-auto">
          <button onClick={exportCSV} className="hidden sm:flex btn-secondary items-center gap-2 text-sm no-print" title="Exporter CSV">
            <Download className="w-4 h-4" /> Exporter CSV
          </button>
          <button onClick={handleImportClick} className="hidden sm:flex btn-secondary items-center gap-2 text-sm no-print" title="Importer CSV">
            <Upload className="w-4 h-4" /> Importer CSV
          </button>
          <button onClick={() => window.print()} className="hidden sm:flex btn-secondary items-center gap-2 text-sm no-print" title={t('ingredients.printTooltip')}>
            <Printer className="w-4 h-4" /> {t('ingredients.print')}
          </button>
          <button onClick={openNew} className="btn-primary flex items-center gap-2 flex-1 sm:flex-none justify-center">
            <Plus className="w-4 h-4" /> {t('ingredients.add')}
          </button>
        </div>
      </div>

      {/* ── Category Summary Cards ──────────────────────────────────── */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2 sm:gap-3 mb-4 sm:mb-6">
        {INGREDIENT_CATEGORIES.filter(cat => categorySummaries[cat]).map((cat) => {
          const summary = categorySummaries[cat];
          const colors = CATEGORY_COLORS[cat] || CATEGORY_COLORS['Autres'];
          return (
            <button
              key={cat}
              onClick={() => setFilterCategory(filterCategory === cat ? '' : cat)}
              className={`${colors.bg} ${colors.darkBg} rounded-2xl border-l-4 ${colors.border} ${colors.darkBorder} p-3 text-left transition-all hover:scale-[1.02] ${filterCategory === cat ? 'ring-2 ring-[#111111] dark:ring-white' : ''}`}
            >
              <p className={`text-xs font-semibold ${colors.text} dark:text-white/70 truncate`}>{cat}</p>
              <p className="text-lg font-bold text-[#111111] dark:text-white mt-0.5">{summary.count}</p>
              <div className="flex items-center justify-between mt-1">
                <span className="text-[10px] text-[#6B7280] dark:text-[#A3A3A3]">Moy. {summary.avgPrice.toFixed(2)}{getCurrencySymbol()}</span>
                <span className="text-[10px] text-[#9CA3AF] dark:text-[#737373]">Tot. {summary.totalSpend.toFixed(0)}{getCurrencySymbol()}</span>
              </div>
            </button>
          );
        })}
      </div>

      {/* KPI Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-4 mb-4 sm:mb-6">
        <div className="bg-white dark:bg-[#0A0A0A] rounded-2xl border border-[#E5E7EB] dark:border-[#1A1A1A] p-3 sm:p-4 flex items-center gap-2 sm:gap-3">
          <div className="p-2 sm:p-2.5 rounded-xl bg-[#F3F4F6] dark:bg-[#171717]">
            <Package className="w-5 h-5 text-[#111111] dark:text-white" />
          </div>
          <div>
            <p className="text-xs text-[#9CA3AF] dark:text-[#737373]">{t('ingredients.totalIngredients')}</p>
            <p className="text-xl font-bold text-[#111111] dark:text-white">{summaryStats.total}</p>
          </div>
        </div>
        <div className="bg-white dark:bg-[#0A0A0A] rounded-2xl border border-[#E5E7EB] dark:border-[#1A1A1A] p-3 sm:p-4 flex items-center gap-2 sm:gap-3">
          <div className="p-2 sm:p-2.5 rounded-xl bg-[#F3F4F6] dark:bg-[#171717]">
            <Euro className="w-5 h-5 text-[#111111] dark:text-white" />
          </div>
          <div>
            <p className="text-xs text-[#9CA3AF] dark:text-[#737373]">{t('ingredients.avgPrice')}</p>
            <p className="text-xl font-bold text-[#111111] dark:text-white">{summaryStats.avgPrice.toFixed(2)} {getCurrencySymbol()}</p>
          </div>
        </div>
        <div className="bg-white dark:bg-[#0A0A0A] rounded-2xl border border-[#E5E7EB] dark:border-[#1A1A1A] p-3 sm:p-4 flex items-center gap-2 sm:gap-3">
          <div className="p-2 sm:p-2.5 rounded-xl bg-[#F3F4F6] dark:bg-[#171717]">
            <Tag className="w-5 h-5 text-[#111111] dark:text-white" />
          </div>
          <div>
            <p className="text-xs text-[#9CA3AF] dark:text-[#737373]">{t('ingredients.expensiveCategory')}</p>
            <p className="text-lg font-bold text-[#111111] dark:text-white truncate">{summaryStats.expensiveCat}</p>
          </div>
        </div>
        <div className="bg-white dark:bg-[#0A0A0A] rounded-2xl border border-[#E5E7EB] dark:border-[#1A1A1A] p-3 sm:p-4 flex items-center gap-2 sm:gap-3">
          <div className="p-2 sm:p-2.5 rounded-xl bg-[#F3F4F6] dark:bg-[#171717]">
            <Truck className="w-5 h-5 text-[#111111] dark:text-white" />
          </div>
          <div>
            <p className="text-xs text-[#9CA3AF] dark:text-[#737373]">{t('ingredients.linkedSuppliers')}</p>
            <p className="text-xl font-bold text-[#111111] dark:text-white">{summaryStats.uniqueSuppliers}</p>
          </div>
        </div>
      </div>

      {/* ── Smart Search + Advanced Filters ─────────────────────────── */}
      <div className="mb-3 space-y-2">
        <div className="flex gap-2">
          <SearchBar
            value={search}
            onChange={setSearch}
            placeholder={t('ingredients.searchPlaceholder') + ', categorie, fournisseur...'}
            pageKey="ingredients"
            suggestions={searchSuggestions}
            className="flex-1"
          />
        </div>
        <FilterPanel
          filters={ingredientFilterDefs}
          values={advancedFilters}
          onFilterChange={setAdvancedFilters}
          presetKey="ingredients"
        />
      </div>

      {/* Category pill filters */}
      <div className="flex flex-wrap gap-2 mb-4">
        <button
          onClick={() => setFilterCategory('')}
          className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
            !filterCategory
              ? 'bg-[#111111] dark:bg-white text-white dark:text-black'
              : 'bg-[#F3F4F6] dark:bg-[#171717] text-[#6B7280] dark:text-[#A3A3A3] hover:bg-[#E5E7EB] dark:hover:bg-[#262626]'
          }`}
        >
          {t('ingredients.allCategories')} ({ingredients.length})
        </button>
        {INGREDIENT_CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => setFilterCategory(filterCategory === cat ? '' : cat)}
            className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
              filterCategory === cat
                ? 'bg-[#111111] dark:bg-white text-white dark:text-black'
                : 'bg-[#F3F4F6] dark:bg-[#171717] text-[#6B7280] dark:text-[#A3A3A3] hover:bg-[#E5E7EB] dark:hover:bg-[#262626]'
            }`}
          >
            {cat} ({categoryCounts[cat] || 0})
          </button>
        ))}
      </div>

      {/* ── Import/Export bar (mobile) ──────────────────────────────── */}
      <div className="flex sm:hidden gap-2 mb-3">
        <button onClick={exportCSV} className="flex-1 btn-secondary flex items-center justify-center gap-2 text-xs">
          <Download className="w-3.5 h-3.5" /> Exporter
        </button>
        <button onClick={handleImportClick} className="flex-1 btn-secondary flex items-center justify-center gap-2 text-xs">
          <Upload className="w-3.5 h-3.5" /> Importer
        </button>
      </div>

      {/* Table */}
      <div className="bg-white dark:bg-[#0A0A0A] rounded-2xl shadow overflow-x-auto border border-[#E5E7EB] dark:border-[#1A1A1A] -mx-4 sm:mx-0">
        <table className="w-full text-sm min-w-[740px]">
          <thead className="bg-[#FAFAFA] dark:bg-[#0A0A0A] text-[#6B7280] dark:text-[#A3A3A3] text-left">
            <tr>
              <th className="px-4 py-3 w-10">
                <input
                  type="checkbox"
                  checked={filtered.length > 0 && selectedIds.size === filtered.length}
                  onChange={toggleSelectAll}
                  className="w-4 h-4 rounded accent-[#111111] dark:accent-white cursor-pointer"
                  aria-label="Tout selectionner"
                />
              </th>
              <th className="px-4 py-3"><SortHeader label={t('ingredients.nameColumn')} field="name" /></th>
              <th className="px-4 py-3"><SortHeader label={t('ingredients.categoryColumn')} field="category" /></th>
              <th className="px-4 py-3"><SortHeader label={t('ingredients.unitPriceColumn')} field="pricePerUnit" /></th>
              <th className="px-3 py-3 font-medium text-xs">Tendance</th>
              <th className="px-4 py-3"><SortHeader label={t('ingredients.unitColumn')} field="unit" /></th>
              <th className="px-4 py-3"><SortHeader label={t('ingredients.supplierColumn')} field="supplier" /></th>
              <th className="px-3 py-3 font-medium text-xs">Statut</th>
              <th className="px-4 py-3 font-medium w-24">{t('ingredients.actionsColumn')}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#E5E7EB] dark:divide-[#1A1A1A]">
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={9} className="px-4 py-8 text-center text-[#9CA3AF] dark:text-[#737373]">
                  {ingredients.length === 0 ? t('ingredients.noIngredients') : t('ingredients.noResults')}
                </td>
              </tr>
            ) : (
              filtered.map((ing) => {
                const supplierName = ing.supplierRef?.name || ing.supplier || '';
                const badgeColor = supplierName ? getSupplierBadgeColor(supplierName) : null;
                const sparklinePrices = allPriceHistories[ing.id];
                const isAlert = costAlertIds.alertIds.has(ing.id);
                const isStable = costAlertIds.stableIds.has(ing.id);

                return (
                  <tr key={ing.id} className={`hover:bg-[#FAFAFA] dark:hover:bg-[#0A0A0A] ${selectedIds.has(ing.id) ? 'bg-[#F3F4F6] dark:bg-[#171717]' : ''}`}>
                    <td className="px-4 py-3">
                      <input
                        type="checkbox"
                        checked={selectedIds.has(ing.id)}
                        onChange={() => toggleSelectOne(ing.id)}
                        className="w-4 h-4 rounded accent-[#111111] dark:accent-white cursor-pointer"
                        aria-label={`Selectionner ${ing.name}`}
                      />
                    </td>
                    <td className="px-4 py-3 font-medium text-[#111111] dark:text-white">
                      <div className="flex items-center gap-2.5">
                        <IngredientAvatar name={ing.name} category={ing.category} size="sm" />
                        <span>
                          {ing.name}
                          {isInSeason(ing.name) && (
                            <span className="ml-1 text-xs text-emerald-500" title="Produit de saison">&#127807;</span>
                          )}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className="px-2 py-1 rounded-full text-xs bg-[#F3F4F6] dark:bg-[#171717] text-[#111111] dark:text-white">{ing.category}</span>
                    </td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() => openPriceTracker(ing)}
                        className="inline-flex items-center gap-1.5 font-mono text-[#6B7280] dark:text-[#A3A3A3] hover:text-[#111111] dark:hover:text-white transition-colors group"
                        title="Voir l'historique des prix"
                      >
                        {ing.pricePerUnit.toFixed(2)} {getCurrencySymbol()}
                        <BarChart3 className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity" />
                        {getAlertForIngredient(ing.id) !== null && (
                          <Bell className={`w-3 h-3 ${ing.pricePerUnit > (getAlertForIngredient(ing.id) || 0) ? 'text-red-500' : 'text-[#9CA3AF] dark:text-[#737373]'}`} />
                        )}
                      </button>
                    </td>
                    {/* Sparkline */}
                    <td className="px-3 py-3">
                      {sparklinePrices && sparklinePrices.length >= 2 ? (
                        <PriceSparkline prices={sparklinePrices} />
                      ) : (
                        <span className="text-[10px] text-[#9CA3AF] dark:text-[#737373]">--</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-[#6B7280] dark:text-[#A3A3A3]">{ing.unit}</td>
                    {/* Supplier Badge */}
                    <td className="px-4 py-3">
                      {supplierName && badgeColor ? (
                        <button
                          onClick={() => navigate('/suppliers')}
                          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium transition-colors ${badgeColor.bg} ${badgeColor.text} ${badgeColor.hover}`}
                          title={`Voir le fournisseur : ${supplierName}`}
                        >
                          <Truck className="w-3 h-3 flex-shrink-0" />
                          {supplierName}
                        </button>
                      ) : (
                        <span className="text-[#9CA3AF] dark:text-[#737373] italic text-xs">{t('ingredients.notAssigned')}</span>
                      )}
                    </td>
                    {/* Cost Alert */}
                    <td className="px-3 py-3">
                      {isAlert ? (
                        <span className="inline-flex items-center gap-1 text-red-500" title="Prix en hausse >10%">
                          <Flame className="w-4 h-4" />
                        </span>
                      ) : isStable ? (
                        <span className="inline-flex items-center gap-1 text-emerald-500" title="Prix stable">
                          <CheckCircle className="w-4 h-4" />
                        </span>
                      ) : (
                        <span className="text-[#9CA3AF] dark:text-[#737373]">
                          <Minus className="w-4 h-4" />
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex gap-1">
                        <button onClick={() => openWeigh(ing)} className="p-1.5 rounded hover:bg-emerald-100 dark:hover:bg-emerald-900/30" title={t('ingredients.weighTooltip')} aria-label="Peser l'ingredient">
                          <Scale className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                        </button>
                        <button onClick={() => openEdit(ing)} className="p-1.5 rounded hover:bg-[#F3F4F6] dark:hover:bg-[#171717]" title={t('ingredients.editTooltip')} aria-label="Modifier l'ingredient">
                          <Pencil className="w-4 h-4 text-[#6B7280] dark:text-[#A3A3A3]" />
                        </button>
                        <button onClick={() => setDeleteTarget(ing.id)} className="p-1.5 rounded hover:bg-red-100 dark:hover:bg-red-900/30" title={t('ingredients.deleteTooltip')} aria-label="Supprimer l'ingredient">
                          <Trash2 className="w-4 h-4 text-red-500" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      <p className="text-sm text-[#9CA3AF] dark:text-[#737373] mt-3">{t('ingredients.ingredientCount').replace('{count}', String(filtered.length))}</p>

      {/* Hidden file input for CSV import */}
      <input type="file" ref={fileInputRef} accept=".csv" className="hidden" onChange={(e) => {
        const file = e.target.files?.[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = (evt) => {
          try {
            const text = evt.target?.result as string;
            const lines = text.split('\n').filter(l => l.trim());
            if (lines.length < 2) { showToast('Le fichier CSV est vide ou invalide', 'error'); return; }
            const headers = lines[0].split(',').map(h => h.replace(/"/g, '').trim().toLowerCase());
            const nameIdx = headers.findIndex(h => h === 'nom' || h === 'name');
            const catIdx = headers.findIndex(h => h === 'categorie' || h === 'category');
            const unitIdx = headers.findIndex(h => h === 'unite' || h === 'unit');
            const priceIdx = headers.findIndex(h => h.includes('prix') || h.includes('price') || h.includes('cout') || h.includes('cost'));
            const supplierIdx = headers.findIndex(h => h.includes('fournisseur') || h.includes('supplier'));
            if (nameIdx === -1) { showToast('Colonne "Nom" introuvable dans le CSV', 'error'); return; }
            let importCount = 0;
            for (let i = 1; i < lines.length; i++) {
              const cols = lines[i].split(',').map(c => c.replace(/"/g, '').trim());
              const name = cols[nameIdx];
              if (!name) continue;
              const newIngredient = {
                id: Date.now() + i,
                name,
                category: catIdx !== -1 ? cols[catIdx] || 'Autre' : 'Autre',
                unit: unitIdx !== -1 ? cols[unitIdx] || 'kg' : 'kg',
                price: priceIdx !== -1 ? parseFloat(cols[priceIdx]) || 0 : 0,
                supplier: supplierIdx !== -1 ? cols[supplierIdx] || '' : '',
                stock: 0,
                alertThreshold: 5,
                lastUpdated: new Date().toISOString().split('T')[0],
              };
              setIngredients(prev => [...prev, newIngredient as any]);
              importCount++;
            }
            showToast(`${importCount} ingredient${importCount > 1 ? 's' : ''} importe${importCount > 1 ? 's' : ''} avec succes`, 'success');
          } catch { showToast('Erreur lors de la lecture du fichier CSV', 'error'); }
        };
        reader.readAsText(file);
        e.target.value = '';
      }} />

      {/* ── Bulk Actions Floating Bar ──────────────────────────────────── */}
      {selectedIds.size > 0 && (
        <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 bg-[#111111] dark:bg-white text-white dark:text-black rounded-2xl shadow-2xl px-4 sm:px-6 py-3 flex flex-wrap items-center gap-2 sm:gap-4 animate-in slide-in-from-bottom-4 max-w-[95vw]">
          <span className="text-sm font-medium flex items-center gap-2">
            <CheckSquare className="w-4 h-4" />
            {selectedIds.size} selectionne{selectedIds.size > 1 ? 's' : ''}
          </span>
          <div className="w-px h-6 bg-white/20 dark:bg-black/20 hidden sm:block" />

          {/* Bulk price update */}
          <button
            onClick={openBulkPriceUpdate}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium bg-amber-600 hover:bg-amber-500 text-white transition-colors"
          >
            <Percent className="w-4 h-4" />
            <span className="hidden sm:inline">Mettre a jour les prix</span>
            <span className="sm:hidden">Prix</span>
          </button>

          {/* Bulk delete */}
          <button
            onClick={bulkDelete}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium bg-red-600 hover:bg-red-500 text-white transition-colors"
          >
            <Trash2 className="w-4 h-4" />
            <span className="hidden sm:inline">Supprimer ({selectedIds.size})</span>
            <span className="sm:hidden">{selectedIds.size}</span>
          </button>

          {/* Bulk change category */}
          <div className="relative">
            <button
              onClick={() => { setBulkCategoryOpen(!bulkCategoryOpen); setBulkSupplierOpen(false); }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium bg-white/10 dark:bg-black/10 hover:bg-white/20 dark:hover:bg-black/20 transition-colors"
            >
              <Tag className="w-4 h-4" />
              <span className="hidden sm:inline">Changer categorie</span>
              <ChevronDown className="w-3 h-3" />
            </button>
            {bulkCategoryOpen && (
              <div className="absolute bottom-full left-0 mb-2 w-48 bg-white dark:bg-[#0A0A0A] rounded-lg shadow-xl border border-[#E5E7EB] dark:border-[#1A1A1A] max-h-56 overflow-y-auto">
                {INGREDIENT_CATEGORIES.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => bulkChangeCategory(cat)}
                    className="w-full text-left px-3 py-2 text-sm text-[#111111] dark:text-white hover:bg-[#F3F4F6] dark:hover:bg-[#171717] transition-colors"
                  >
                    {cat}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Bulk change supplier */}
          <div className="relative">
            <button
              onClick={() => { setBulkSupplierOpen(!bulkSupplierOpen); setBulkCategoryOpen(false); }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium bg-white/10 dark:bg-black/10 hover:bg-white/20 dark:hover:bg-black/20 transition-colors"
            >
              <Truck className="w-4 h-4" />
              <span className="hidden sm:inline">Changer fournisseur</span>
              <ChevronDown className="w-3 h-3" />
            </button>
            {bulkSupplierOpen && (
              <div className="absolute bottom-full left-0 mb-2 w-56 bg-white dark:bg-[#0A0A0A] rounded-lg shadow-xl border border-[#E5E7EB] dark:border-[#1A1A1A] max-h-56 overflow-y-auto">
                {suppliers.length === 0 ? (
                  <div className="px-3 py-2 text-sm text-[#9CA3AF] dark:text-[#737373]">Aucun fournisseur</div>
                ) : suppliers.map((sup) => (
                  <button
                    key={sup.id}
                    onClick={() => bulkChangeSupplier(sup.id, sup.name)}
                    className="w-full text-left px-3 py-2 text-sm text-[#111111] dark:text-white hover:bg-[#F3F4F6] dark:hover:bg-[#171717] transition-colors"
                  >
                    {sup.name}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Close selection */}
          <button
            onClick={() => { setSelectedIds(new Set()); setBulkCategoryOpen(false); setBulkSupplierOpen(false); }}
            className="p-1.5 rounded-lg hover:bg-white/10 dark:hover:bg-black/10 transition-colors ml-1"
            aria-label="Fermer la selection"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* ── Bulk Price Update Modal ──────────────────────────────────── */}
      <Modal isOpen={showBulkPriceModal} onClose={() => setShowBulkPriceModal(false)} title="Mettre a jour les prix en lot">
        <div className="space-y-4">
          <p className="text-sm text-[#6B7280] dark:text-[#A3A3A3]">
            Appliquer un ajustement de prix a <strong className="text-[#111111] dark:text-white">{selectedIds.size}</strong> ingredient(s) selectionne(s).
          </p>

          <div className="flex items-center gap-3">
            <div className="flex rounded-lg border border-[#E5E7EB] dark:border-[#1A1A1A] overflow-hidden">
              <button
                onClick={() => setBulkPriceDirection('increase')}
                className={`px-4 py-2 text-sm font-medium transition-colors ${bulkPriceDirection === 'increase' ? 'bg-red-500 text-white' : 'bg-white dark:bg-[#0A0A0A] text-[#6B7280] dark:text-[#A3A3A3]'}`}
              >
                <TrendingUp className="w-4 h-4 inline mr-1" /> Hausse
              </button>
              <button
                onClick={() => setBulkPriceDirection('decrease')}
                className={`px-4 py-2 text-sm font-medium transition-colors ${bulkPriceDirection === 'decrease' ? 'bg-emerald-500 text-white' : 'bg-white dark:bg-[#0A0A0A] text-[#6B7280] dark:text-[#A3A3A3]'}`}
              >
                <TrendingDown className="w-4 h-4 inline mr-1" /> Baisse
              </button>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="number"
                step="0.1"
                min="0"
                max="100"
                value={bulkPricePercent}
                onChange={(e) => setBulkPricePercent(e.target.value)}
                className="input w-24 text-center"
                placeholder="5"
              />
              <span className="text-sm text-[#6B7280] dark:text-[#A3A3A3] font-medium">%</span>
            </div>
          </div>

          {/* Preview table */}
          {bulkPricePreview.length > 0 && (
            <div className="bg-[#FAFAFA] dark:bg-[#0A0A0A] rounded-xl border border-[#E5E7EB] dark:border-[#1A1A1A] overflow-hidden max-h-64 overflow-y-auto">
              <table className="w-full text-sm">
                <thead className="bg-[#F3F4F6] dark:bg-[#171717]">
                  <tr>
                    <th className="px-3 py-2 text-left text-xs font-medium text-[#6B7280] dark:text-[#A3A3A3]">Ingredient</th>
                    <th className="px-3 py-2 text-right text-xs font-medium text-[#6B7280] dark:text-[#A3A3A3]">Avant</th>
                    <th className="px-3 py-2 text-center text-xs font-medium text-[#6B7280] dark:text-[#A3A3A3]"></th>
                    <th className="px-3 py-2 text-right text-xs font-medium text-[#6B7280] dark:text-[#A3A3A3]">Apres</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E5E7EB] dark:divide-[#1A1A1A]">
                  {bulkPricePreview.map((item) => (
                    <tr key={item.id}>
                      <td className="px-3 py-2 font-medium text-[#111111] dark:text-white">{item.name}</td>
                      <td className="px-3 py-2 text-right font-mono text-[#6B7280] dark:text-[#A3A3A3]">{item.oldPrice.toFixed(2)}{getCurrencySymbol()}/{item.unit}</td>
                      <td className="px-3 py-2 text-center">
                        {bulkPriceDirection === 'increase'
                          ? <TrendingUp className="w-3.5 h-3.5 text-red-500 mx-auto" />
                          : <TrendingDown className="w-3.5 h-3.5 text-emerald-500 mx-auto" />
                        }
                      </td>
                      <td className={`px-3 py-2 text-right font-mono font-semibold ${bulkPriceDirection === 'increase' ? 'text-red-500' : 'text-emerald-500'}`}>
                        {item.newPrice.toFixed(2)}{getCurrencySymbol()}/{item.unit}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          <div className="flex justify-end gap-3 pt-2">
            <button onClick={() => setShowBulkPriceModal(false)} className="btn-secondary">Annuler</button>
            <button
              onClick={applyBulkPriceUpdate}
              disabled={bulkPricePreview.length === 0}
              className="btn-primary flex items-center gap-2 disabled:opacity-50"
            >
              <Check className="w-4 h-4" /> Appliquer les changements
            </button>
          </div>
        </div>
      </Modal>

      {/* Form Modal */}
      <Modal isOpen={showForm} onClose={() => setShowForm(false)} title={editingId ? t('ingredients.editModalTitle') : t('ingredients.newModalTitle')}>
        {/* Price History Chart (edit mode only) */}
        {editingId && (
          <div className="mb-4 bg-[#FAFAFA] dark:bg-[#0A0A0A] rounded-xl border border-[#E5E7EB] dark:border-[#1A1A1A] p-3">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-[#6B7280] dark:text-[#A3A3A3] uppercase tracking-wider">
                Historique des prix (30j)
              </span>
              {priceHistory.length >= 2 && (() => {
                const first = priceHistory[0].price;
                const last = priceHistory[priceHistory.length - 1].price;
                const diff = last - first;
                const pct = first > 0 ? ((diff / first) * 100).toFixed(1) : '0';
                const isUp = diff > 0;
                const isDown = diff < 0;
                return (
                  <span className={`flex items-center gap-1 text-xs font-semibold ${isUp ? 'text-red-500' : isDown ? 'text-emerald-500' : 'text-[#9CA3AF] dark:text-[#737373]'}`}>
                    {isUp && <TrendingUp className="w-3.5 h-3.5" />}
                    {isDown && <TrendingDown className="w-3.5 h-3.5" />}
                    {isUp ? '+' : ''}{pct}%
                  </span>
                );
              })()}
            </div>
            {priceHistoryLoading ? (
              <div className="flex items-center justify-center py-4">
                <Loader2 className="w-4 h-4 animate-spin text-[#9CA3AF] dark:text-[#737373]" />
              </div>
            ) : priceHistory.length === 0 ? (
              <p className="text-xs text-[#9CA3AF] dark:text-[#737373] text-center py-3">
                Pas d'historique disponible
              </p>
            ) : (
              <div className="h-28">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={priceHistory} margin={{ top: 4, right: 8, bottom: 0, left: 0 }}>
                    <XAxis
                      dataKey="date"
                      tick={{ fontSize: 10, fill: '#9CA3AF' }}
                      tickFormatter={(v: string) => {
                        const d = new Date(v);
                        return `${d.getDate()}/${d.getMonth() + 1}`;
                      }}
                      axisLine={false}
                      tickLine={false}
                    />
                    <YAxis
                      tick={{ fontSize: 10, fill: '#9CA3AF' }}
                      width={40}
                      tickFormatter={(v: number) => `${v.toFixed(1)}`}
                      axisLine={false}
                      tickLine={false}
                      domain={['auto', 'auto']}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#000000',
                        border: '1px solid #1A1A1A',
                        borderRadius: '8px',
                        fontSize: '12px',
                        color: '#FFFFFF',
                      }}
                      formatter={(value: unknown) => [`${Number(value).toFixed(2)} \u20AC`, 'Prix']}
                      labelFormatter={(label: unknown) => {
                        const d = new Date(String(label));
                        return d.toLocaleDateString('fr-FR');
                      }}
                    />
                    <Line
                      type="monotone"
                      dataKey="price"
                      stroke="#111111"
                      strokeWidth={2}
                      dot={false}
                      activeDot={{ r: 3, fill: '#111111' }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            )}
          </div>
        )}

        <form onSubmit={handleSubmit} onKeyDown={handleFormKeyDown} className={`space-y-4 transition-colors duration-500 ${saveSuccess ? 'bg-green-50 dark:bg-green-900/20 rounded-lg p-2 -m-2' : ''}`}>
          {/* Name with autocomplete */}
          <div className="relative" ref={nameDropdownRef}>
            <label className="label">{t('ingredients.nameLabel')}</label>
            <input
              ref={nameInputRef}
              required
              className={`input w-full ${formErrors.name ? 'border-red-500 ring-1 ring-red-500' : ''}`}
              value={form.name}
              onChange={(e) => handleNameChange(e.target.value)}
              onFocus={() => { if (nameQuery.length >= 2) setShowNameSuggestions(true); }}
              placeholder={t('ingredients.namePlaceholder')}
              autoComplete="off"
            />
            {formErrors.name && <p className="text-xs text-red-500 mt-1">{t('ingredients.nameRequired')}</p>}
            {/* Name suggestions dropdown */}
            {showNameSuggestions && (nameSuggestions.length > 0 || catalogSuggestions.length > 0) && (
              <div className="absolute z-50 top-full left-0 right-0 mt-1 bg-white dark:bg-[#0A0A0A] rounded-lg shadow-xl border border-[#E5E7EB] dark:border-[#1A1A1A] max-h-64 overflow-y-auto">
                {nameSuggestions.length > 0 && (
                  <>
                    <div className="px-3 py-1.5 text-xs text-[#9CA3AF] dark:text-[#737373] border-b border-[#E5E7EB] dark:border-[#1A1A1A] bg-[#FAFAFA] dark:bg-[#0A0A0A]">
                      {t('ingredients.existingIngredients')}
                    </div>
                    {nameSuggestions.map((ing) => (
                      <button
                        key={ing.id}
                        type="button"
                        onClick={() => selectNameSuggestion(ing)}
                        className="w-full text-left px-3 py-2 hover:bg-[#F3F4F6] dark:hover:bg-[#171717] transition-colors border-b border-[#E5E7EB] dark:border-[#1A1A1A] last:border-0"
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-medium text-[#111111] dark:text-white">{ing.name}</span>
                          <span className="text-xs text-[#9CA3AF] dark:text-[#737373]">{ing.category} - {ing.pricePerUnit.toFixed(2)}{getCurrencySymbol()}/{ing.unit}</span>
                        </div>
                        {ing.supplier && <div className="text-xs text-[#9CA3AF] dark:text-[#737373] mt-0.5">{t('ingredients.supplierPrefix')}{ing.supplier}</div>}
                      </button>
                    ))}
                  </>
                )}
                {catalogSuggestions.length > 0 && (
                  <>
                    <div className="px-3 py-1.5 text-xs text-[#111111] dark:text-white border-b border-[#E5E7EB] dark:border-[#1A1A1A] bg-[#F3F4F6] dark:bg-[#171717] flex items-center gap-1.5">
                      <BookOpen className="w-3 h-3" /> {t('ingredients.catalogTitle')}
                    </div>
                    {catalogSuggestions.map((product, idx) => (
                      <button
                        key={`cat-${idx}`}
                        type="button"
                        onClick={() => selectCatalogProduct(product)}
                        className="w-full text-left px-3 py-2 hover:bg-[#F3F4F6] dark:hover:bg-[#171717] transition-colors border-b border-[#E5E7EB] dark:border-[#1A1A1A] last:border-0"
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-medium text-[#111111] dark:text-white">{product.name}</span>
                          <span className="text-xs font-semibold text-[#111111] dark:text-white">{product.prixMoy.toFixed(2)}{getCurrencySymbol()}/{product.unit}</span>
                        </div>
                        <div className="flex items-center gap-2 mt-0.5">
                          <span className="text-xs text-[#9CA3AF] dark:text-[#737373]">{product.category}</span>
                          <span className="text-xs text-[#9CA3AF] dark:text-[#737373]">|</span>
                          <span className="text-xs text-green-600">{product.prixMin.toFixed(2)}{getCurrencySymbol()}</span>
                          <span className="text-xs text-[#9CA3AF] dark:text-[#737373]">&mdash;</span>
                          <span className="text-xs text-red-500">{product.prixMax.toFixed(2)}{getCurrencySymbol()}</span>
                          <span className="text-xs text-[#9CA3AF] dark:text-[#737373] ml-auto">{product.fournisseurs.join(', ')}</span>
                        </div>
                      </button>
                    ))}
                  </>
                )}
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="label">{t('ingredients.unitPriceLabel')}</label>
              <input
                required
                type="number"
                step="0.01"
                min="0"
                className={`input w-full ${formErrors.pricePerUnit ? 'border-red-500 ring-1 ring-red-500' : ''}`}
                value={form.pricePerUnit}
                onChange={(e) => {
                  setForm({ ...form, pricePerUnit: e.target.value });
                  if (formErrors.pricePerUnit && parseFloat(e.target.value) > 0) {
                    setFormErrors((prev) => ({ ...prev, pricePerUnit: false }));
                  }
                }}
              />
              {formErrors.pricePerUnit && <p className="text-xs text-red-500 mt-1">{t('ingredients.priceRequired')}</p>}
              {editingId && lastPrice !== null && (
                <p className="text-xs text-[#6B7280] dark:text-[#A3A3A3] mt-1">
                  {t('ingredients.lastPrice').replace('{price}', lastPrice.toFixed(2))}
                </p>
              )}
            </div>
            <div>
              <label className="label">{t('ingredients.unitLabel')}</label>
              <select
                required
                className={`input w-full ${formErrors.unit ? 'border-red-500 ring-1 ring-red-500' : ''}`}
                value={form.unit}
                onChange={(e) => setForm({ ...form, unit: e.target.value })}
              >
                {UNITS.map((u) => <option key={u} value={u}>{u}</option>)}
              </select>
            </div>
          </div>

          <div>
            <label className="label">{t('ingredients.categoryLabel')}</label>
            <select
              required
              className={`input w-full ${formErrors.category ? 'border-red-500 ring-1 ring-red-500' : ''}`}
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value })}
            >
              {INGREDIENT_CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>

          {/* Supplier dropdown with autocomplete */}
          <div className="relative" ref={supplierDropdownRef}>
            <div className="flex items-center justify-between">
              <label className="label">{t('ingredients.supplierLabelText')}</label>
              <button
                type="button"
                onClick={() => setShowNewSupplierForm(!showNewSupplierForm)}
                className="text-xs text-[#111111] dark:text-white hover:text-[#333] dark:hover:text-[#E5E5E5] font-medium"
              >
                {showNewSupplierForm ? t('ingredients.cancelCreateSupplier') : t('ingredients.createSupplier')}
              </button>
            </div>

            {showNewSupplierForm ? (
              <div className="flex gap-2 mt-1">
                <input
                  className="input flex-1"
                  value={newSupplierName}
                  onChange={(e) => setNewSupplierName(e.target.value)}
                  placeholder={t('ingredients.newSupplierPlaceholder')}
                  autoFocus
                  onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addNewSupplier(); } }}
                />
                <button
                  type="button"
                  onClick={addNewSupplier}
                  className="btn-primary text-sm px-3"
                  disabled={!newSupplierName.trim()}
                >
                  {t('ingredients.addSupplierBtn')}
                </button>
              </div>
            ) : (
              <div className="relative">
                <input
                  className="input w-full pr-8"
                  value={supplierQuery}
                  onChange={(e) => handleSupplierInputChange(e.target.value)}
                  onFocus={() => setShowSupplierDropdown(true)}
                  placeholder={t('ingredients.supplierSelectPlaceholder')}
                  autoComplete="off"
                />
                <ChevronDown className="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 text-[#9CA3AF] dark:text-[#737373] pointer-events-none" />
                {form.supplier && (
                  <button
                    type="button"
                    onClick={() => { setForm({ ...form, supplier: '', supplierId: null }); setSupplierQuery(''); }}
                    aria-label="Effacer le fournisseur"
                    className="absolute right-8 top-1/2 -translate-y-1/2 p-0.5 rounded hover:bg-[#F3F4F6] dark:hover:bg-[#171717]"
                  >
                    <X className="w-3 h-3 text-[#9CA3AF] dark:text-[#737373]" />
                  </button>
                )}
                {showSupplierDropdown && (
                  <div className="absolute z-50 top-full left-0 right-0 mt-1 bg-white dark:bg-[#0A0A0A] rounded-lg shadow-xl border border-[#E5E7EB] dark:border-[#1A1A1A] max-h-48 overflow-y-auto">
                    {filteredSuppliersList.length === 0 ? (
                      <div className="px-3 py-2 text-sm text-[#9CA3AF] dark:text-[#737373]">
                        {suppliers.length === 0 ? t('ingredients.noExistingSuppliers') : t('ingredients.noMatch')}
                      </div>
                    ) : (
                      filteredSuppliersList.map((s) => (
                        <button
                          key={s.id}
                          type="button"
                          onClick={() => selectSupplier(s)}
                          className={`w-full text-left px-3 py-2 text-sm hover:bg-[#F3F4F6] dark:hover:bg-[#171717] transition-colors ${form.supplierId === s.id ? 'bg-[#F3F4F6] dark:bg-[#171717] font-medium text-[#111111] dark:text-white' : 'text-[#6B7280] dark:text-[#A3A3A3]'}`}
                        >
                          {s.name}
                        </button>
                      ))
                    )}
                  </div>
                )}
              </div>
            )}
          </div>

          <div>
            <label className="label">{t('ingredients.allergensLabel')}</label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mt-1">
              {ALLERGENS.map((allergen) => (
                <label key={allergen} className="flex items-center gap-2 text-sm text-[#6B7280] dark:text-[#A3A3A3] cursor-pointer">
                  <input
                    type="checkbox"
                    checked={form.allergens.includes(allergen)}
                    onChange={() => toggleAllergen(allergen)}
                    className="rounded border-[#E5E7EB] dark:border-[#1A1A1A] text-[#111111] focus:ring-[#111111] dark:focus:ring-white"
                  />
                  {allergen}
                </label>
              ))}
            </div>
          </div>

          {/* Barcode */}
          <div>
            <label className="label">Code-barres (EAN/UPC)</label>
            <input
              type="text"
              className="input w-full"
              value={form.barcode}
              onChange={(e) => setForm({ ...form, barcode: e.target.value })}
              placeholder="Ex: 3017620422003"
              inputMode="numeric"
            />
            <p className="text-xs text-[#9CA3AF] dark:text-[#737373] mt-1">Optionnel. Permet le scan rapide en inventaire.</p>
          </div>

          <div className="flex items-center justify-between pt-2">
            <div className="flex items-center gap-2">
              <span className="text-xs text-[#9CA3AF] dark:text-[#737373]">{t('ingredients.saveShortcut')}</span>
              {editingId && (
                <button
                  type="button"
                  onClick={() => {
                    const ing = ingredients.find(i => i.id === editingId);
                    if (ing) { setShowForm(false); openWeigh(ing); }
                  }}
                  className="flex items-center gap-1 px-2 py-1 text-xs bg-[#F3F4F6] dark:bg-[#171717] text-[#111111] dark:text-white rounded border border-[#E5E7EB] dark:border-[#1A1A1A] hover:bg-[#E5E7EB] dark:hover:bg-[#262626] transition-colors"
                >
                  <Scale className="w-3 h-3" /> {t('ingredients.weigh')}
                </button>
              )}
            </div>
            <div className="flex gap-3">
              <button type="button" onClick={() => setShowForm(false)} className="btn-secondary">{t('ingredients.cancel')}</button>
              <button
                type="submit"
                className={`btn-primary flex items-center gap-2 min-w-[120px] justify-center transition-all ${saveSuccess ? 'bg-green-600 hover:bg-green-700' : ''}`}
                disabled={saving}
              >
                {saving ? (
                  <><Loader2 className="w-4 h-4 animate-spin" /> {t('ingredients.saving')}</>
                ) : saveSuccess ? (
                  <><Check className="w-4 h-4" /> {t('ingredients.saved')}</>
                ) : (
                  editingId ? t('ingredients.edit') : t('ingredients.add')
                )}
              </button>
            </div>
          </div>
        </form>
      </Modal>

      {/* ── Price Tracker Modal ──────────────────────────────────────── */}
      <Modal
        isOpen={!!trackerIngredient}
        onClose={() => { setTrackerIngredient(null); setTrackerData(null); }}
        title={trackerIngredient ? `Historique des prix \u2014 ${trackerIngredient.name}` : 'Historique des prix'}
        className="max-w-2xl"
      >
        {trackerIngredient && (
          <div className="space-y-5">
            {/* Period selector */}
            <div className="flex gap-2">
              {([30, 90, 365] as const).map((p) => (
                <button
                  key={p}
                  onClick={() => changeTrackerPeriod(p)}
                  className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                    trackerPeriod === p
                      ? 'bg-[#111111] dark:bg-white text-white dark:text-black'
                      : 'bg-[#F3F4F6] dark:bg-[#171717] text-[#6B7280] dark:text-[#A3A3A3] hover:bg-[#E5E7EB] dark:hover:bg-[#262626]'
                  }`}
                >
                  {p === 30 ? '30 jours' : p === 90 ? '90 jours' : '1 an'}
                </button>
              ))}
            </div>

            {/* Chart */}
            {trackerLoading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="w-6 h-6 animate-spin text-[#9CA3AF] dark:text-[#737373]" />
              </div>
            ) : trackerData && trackerData.data.length > 0 ? (
              <div className="h-56 bg-[#FAFAFA] dark:bg-[#0A0A0A] rounded-xl border border-[#E5E7EB] dark:border-[#1A1A1A] p-3">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={trackerData.data} margin={{ top: 8, right: 12, bottom: 4, left: 0 }}>
                    <XAxis
                      dataKey="date"
                      tick={{ fontSize: 10, fill: '#9CA3AF' }}
                      tickFormatter={(v: string) => {
                        const d = new Date(v);
                        return `${d.getDate()}/${d.getMonth() + 1}`;
                      }}
                      axisLine={false}
                      tickLine={false}
                    />
                    <YAxis
                      tick={{ fontSize: 10, fill: '#9CA3AF' }}
                      width={45}
                      tickFormatter={(v: number) => `${v.toFixed(2)}`}
                      axisLine={false}
                      tickLine={false}
                      domain={['auto', 'auto']}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#000000',
                        border: '1px solid #1A1A1A',
                        borderRadius: '8px',
                        fontSize: '12px',
                        color: '#FFFFFF',
                      }}
                      formatter={(value: unknown) => [`${Number(value).toFixed(2)} \u20AC`, 'Prix']}
                      labelFormatter={(label: unknown) => {
                        const d = new Date(String(label));
                        return d.toLocaleDateString('fr-FR');
                      }}
                    />
                    {/* Average reference line */}
                    <ReferenceLine
                      y={trackerData.avgPrice}
                      stroke="#9CA3AF"
                      strokeDasharray="4 4"
                      strokeWidth={1}
                    />
                    {/* Alert threshold line */}
                    {getAlertForIngredient(trackerIngredient.id) !== null && (
                      <ReferenceLine
                        y={getAlertForIngredient(trackerIngredient.id)!}
                        stroke="#EF4444"
                        strokeDasharray="6 3"
                        strokeWidth={1.5}
                        label={{ value: 'Alerte', position: 'right', fill: '#EF4444', fontSize: 10 }}
                      />
                    )}
                    <Line
                      type="monotone"
                      dataKey="price"
                      stroke="#111111"
                      strokeWidth={2}
                      dot={false}
                      activeDot={{ r: 4, fill: '#111111', stroke: '#fff', strokeWidth: 2 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <div className="text-center py-8 text-[#9CA3AF] dark:text-[#737373]">
                <BarChart3 className="w-8 h-8 mx-auto mb-2 opacity-40" />
                <p className="text-sm">Pas d'historique de prix disponible</p>
                <p className="text-xs mt-1">L'historique s'enregistre a chaque modification de prix.</p>
              </div>
            )}

            {/* Stats cards */}
            {trackerData && trackerData.data.length > 0 && (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="bg-[#F3F4F6] dark:bg-[#171717] rounded-xl p-3">
                  <p className="text-[10px] uppercase tracking-wider text-[#9CA3AF] dark:text-[#737373] font-semibold">Min</p>
                  <p className="text-lg font-bold text-[#111111] dark:text-white">{trackerData.minPrice.toFixed(2)} {getCurrencySymbol()}</p>
                </div>
                <div className="bg-[#F3F4F6] dark:bg-[#171717] rounded-xl p-3">
                  <p className="text-[10px] uppercase tracking-wider text-[#9CA3AF] dark:text-[#737373] font-semibold">Max</p>
                  <p className="text-lg font-bold text-[#111111] dark:text-white">{trackerData.maxPrice.toFixed(2)} {getCurrencySymbol()}</p>
                </div>
                <div className="bg-[#F3F4F6] dark:bg-[#171717] rounded-xl p-3">
                  <p className="text-[10px] uppercase tracking-wider text-[#9CA3AF] dark:text-[#737373] font-semibold">Moyenne</p>
                  <p className="text-lg font-bold text-[#111111] dark:text-white">{trackerData.avgPrice.toFixed(2)} {getCurrencySymbol()}</p>
                </div>
                <div className="bg-[#F3F4F6] dark:bg-[#171717] rounded-xl p-3">
                  <p className="text-[10px] uppercase tracking-wider text-[#9CA3AF] dark:text-[#737373] font-semibold">Actuel</p>
                  <div className="flex items-center gap-1.5">
                    <p className="text-lg font-bold text-[#111111] dark:text-white">{trackerData.currentPrice.toFixed(2)} {getCurrencySymbol()}</p>
                    {trackerData.trend === 'up' && <TrendingUp className="w-4 h-4 text-red-500" />}
                    {trackerData.trend === 'down' && <TrendingDown className="w-4 h-4 text-emerald-500" />}
                    {trackerData.trend === 'stable' && <Minus className="w-4 h-4 text-[#9CA3AF] dark:text-[#737373]" />}
                  </div>
                </div>
              </div>
            )}

            {/* Volatility indicator */}
            {trackerData && trackerData.data.length > 1 && (
              <div className="flex items-center gap-3 bg-[#FAFAFA] dark:bg-[#0A0A0A] rounded-xl border border-[#E5E7EB] dark:border-[#1A1A1A] p-3">
                <div className="flex-1">
                  <p className="text-xs font-semibold text-[#6B7280] dark:text-[#A3A3A3] uppercase tracking-wider mb-1">Volatilite</p>
                  <div className="flex items-center gap-2">
                    <div className="flex-1 h-2 bg-[#E5E7EB] dark:bg-[#262626] rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all ${
                          trackerData.volatility > 15 ? 'bg-red-500' : trackerData.volatility > 5 ? 'bg-yellow-500' : 'bg-emerald-500'
                        }`}
                        style={{ width: `${Math.min(100, trackerData.volatility * 3)}%` }}
                      />
                    </div>
                    <span className={`text-xs font-semibold ${
                      trackerData.volatility > 15 ? 'text-red-500' : trackerData.volatility > 5 ? 'text-yellow-500' : 'text-emerald-500'
                    }`}>
                      {trackerData.volatility > 15 ? 'Haute' : trackerData.volatility > 5 ? 'Moyenne' : 'Basse'}
                      {' '}({trackerData.volatility.toFixed(1)}%)
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* Supplier comparison */}
            {trackerData && trackerData.supplierPrices.length > 1 && (
              <div className="bg-[#FAFAFA] dark:bg-[#0A0A0A] rounded-xl border border-[#E5E7EB] dark:border-[#1A1A1A] p-3">
                <p className="text-xs font-semibold text-[#6B7280] dark:text-[#A3A3A3] uppercase tracking-wider mb-2">
                  Comparaison fournisseurs
                </p>
                <div className="space-y-2">
                  {trackerData.supplierPrices
                    .sort((a, b) => a.price - b.price)
                    .map((sp, idx) => {
                      const cheapest = trackerData.supplierPrices.reduce((min, s) => s.price < min.price ? s : min, trackerData.supplierPrices[0]);
                      const isCheapest = sp.price === cheapest.price;
                      const pctDiff = cheapest.price > 0 ? ((sp.price - cheapest.price) / cheapest.price * 100) : 0;
                      return (
                        <div key={idx} className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Truck className="w-3.5 h-3.5 text-[#9CA3AF] dark:text-[#737373]" />
                            <span className={`text-sm ${isCheapest ? 'font-semibold text-[#111111] dark:text-white' : 'text-[#6B7280] dark:text-[#A3A3A3]'}`}>
                              {sp.supplierName}
                            </span>
                            {isCheapest && (
                              <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 font-semibold">
                                Meilleur prix
                              </span>
                            )}
                          </div>
                          <div className="flex items-center gap-2">
                            <span className={`text-sm font-mono ${isCheapest ? 'font-bold text-[#111111] dark:text-white' : 'text-[#6B7280] dark:text-[#A3A3A3]'}`}>
                              {sp.price.toFixed(2)} {getCurrencySymbol()}
                            </span>
                            {!isCheapest && pctDiff > 0 && (
                              <span className="text-[10px] text-red-500 font-semibold">+{pctDiff.toFixed(1)}%</span>
                            )}
                          </div>
                        </div>
                      );
                    })}
                </div>
              </div>
            )}

            {/* Price alert threshold */}
            <div className="bg-[#FAFAFA] dark:bg-[#0A0A0A] rounded-xl border border-[#E5E7EB] dark:border-[#1A1A1A] p-3">
              <div className="flex items-center gap-2 mb-2">
                <Bell className="w-4 h-4 text-[#6B7280] dark:text-[#A3A3A3]" />
                <p className="text-xs font-semibold text-[#6B7280] dark:text-[#A3A3A3] uppercase tracking-wider">
                  Alerte si prix depasse
                </p>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  className="input flex-1"
                  value={alertInput}
                  onChange={(e) => setAlertInput(e.target.value)}
                  placeholder={`Ex: ${(trackerIngredient.pricePerUnit * 1.1).toFixed(2)} \u20AC`}
                />
                <span className="text-sm text-[#9CA3AF] dark:text-[#737373]">{getCurrencySymbol()}/{trackerIngredient.unit}</span>
                <button
                  onClick={saveAlertThreshold}
                  className="btn-primary text-sm px-4"
                >
                  {parseFloat(alertInput) > 0 ? 'Sauvegarder' : 'Supprimer'}
                </button>
              </div>
              {getAlertForIngredient(trackerIngredient.id) !== null && (
                <p className="text-xs mt-2 flex items-center gap-1.5">
                  <AlertTriangle className={`w-3 h-3 ${trackerIngredient.pricePerUnit > (getAlertForIngredient(trackerIngredient.id) || 0) ? 'text-red-500' : 'text-emerald-500'}`} />
                  <span className={trackerIngredient.pricePerUnit > (getAlertForIngredient(trackerIngredient.id) || 0) ? 'text-red-500 font-semibold' : 'text-emerald-500'}>
                    {trackerIngredient.pricePerUnit > (getAlertForIngredient(trackerIngredient.id) || 0)
                      ? `Prix actuel (${trackerIngredient.pricePerUnit.toFixed(2)} \u20AC) depasse le seuil !`
                      : `Prix sous le seuil (${getAlertForIngredient(trackerIngredient.id)?.toFixed(2)} \u20AC)`
                    }
                  </span>
                </p>
              )}
            </div>
          </div>
        )}
      </Modal>

      {/* Weigh Modal */}
      {weighTarget && (
        <WeighModal
          isOpen={!!weighTarget}
          onClose={() => setWeighTarget(null)}
          ingredientId={weighTarget.id}
          ingredientName={weighTarget.name}
          currentStock={inventoryItems.find(i => i.ingredientId === weighTarget.id)?.currentStock ?? 0}
          unit={weighTarget.unit}
          pricePerUnit={weighTarget.pricePerUnit}
          onComplete={handleWeighComplete}
        />
      )}

      {/* Delete Confirm */}
      <ConfirmDialog
        isOpen={deleteTarget !== null}
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeleteTarget(null)}
        title={t('ingredients.deleteTitle')}
        message={t('ingredients.deleteMessage')}
      />
    </div>
  );
}
