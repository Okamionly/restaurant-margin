import { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import { Plus, Pencil, Trash2, Search, ArrowUpDown, Printer, Loader2, Check, ChevronDown, X, BookOpen, Scale, Package, Euro, Tag, Truck, TrendingUp, TrendingDown, CheckSquare, BarChart3, Bell, AlertTriangle, Minus } from 'lucide-react';
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

const emptyForm = { name: '', unit: 'kg', pricePerUnit: '', supplier: '', supplierId: null as number | null, category: 'Légumes', allergens: [] as string[], barcode: '' };

type SortKey = 'name' | 'category' | 'pricePerUnit' | 'unit' | 'supplier';
type SortDir = 'asc' | 'desc';

export default function Ingredients() {
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
    // Category with highest average price
    const catPrices: Record<string, { sum: number; count: number }> = {};
    ingredients.forEach((i) => {
      if (!catPrices[i.category]) catPrices[i.category] = { sum: 0, count: 0 };
      catPrices[i.category].sum += i.pricePerUnit;
      catPrices[i.category].count += 1;
    });
    let expensiveCat = '—';
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

  const filtered = useMemo(() => {
    let result = ingredients.filter((i) => {
      const q = search.toLowerCase();
      const matchSearch = i.name.toLowerCase().includes(q) ||
        (i.supplier && i.supplier.toLowerCase().includes(q)) ||
        (i.supplierRef?.name && i.supplierRef.name.toLowerCase().includes(q));
      const matchCategory = !filterCategory || i.category === filterCategory;
      return matchSearch && matchCategory;
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
  }, [ingredients, search, filterCategory, sortKey, sortDir]);

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
    // If cleared or changed from the selected supplier, clear supplierId
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
      // Find existing inventory item for this ingredient
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
        // Create new inventory entry
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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <h2 className="text-2xl font-bold text-[#111111] dark:text-white">{t('ingredients.title')}</h2>
        <div className="flex gap-2">
          <button onClick={() => window.print()} className="btn-secondary flex items-center gap-2 text-sm no-print" title={t('ingredients.printTooltip')}>
            <Printer className="w-4 h-4" /> {t('ingredients.print')}
          </button>
          <button onClick={openNew} className="btn-primary flex items-center gap-2">
            <Plus className="w-4 h-4" /> {t('ingredients.add')}
          </button>
        </div>
      </div>

      {/* KPI Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-white dark:bg-[#0A0A0A] rounded-2xl border border-[#E5E7EB] dark:border-[#1A1A1A] p-4 flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-[#F3F4F6] dark:bg-[#171717]">
            <Package className="w-5 h-5 text-[#111111] dark:text-white" />
          </div>
          <div>
            <p className="text-xs text-[#9CA3AF] dark:text-[#737373]">{t('ingredients.totalIngredients')}</p>
            <p className="text-xl font-bold text-[#111111] dark:text-white">{summaryStats.total}</p>
          </div>
        </div>
        <div className="bg-white dark:bg-[#0A0A0A] rounded-2xl border border-[#E5E7EB] dark:border-[#1A1A1A] p-4 flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-[#F3F4F6] dark:bg-[#171717]">
            <Euro className="w-5 h-5 text-[#111111] dark:text-white" />
          </div>
          <div>
            <p className="text-xs text-[#9CA3AF] dark:text-[#737373]">{t('ingredients.avgPrice')}</p>
            <p className="text-xl font-bold text-[#111111] dark:text-white">{summaryStats.avgPrice.toFixed(2)} {getCurrencySymbol()}</p>
          </div>
        </div>
        <div className="bg-white dark:bg-[#0A0A0A] rounded-2xl border border-[#E5E7EB] dark:border-[#1A1A1A] p-4 flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-[#F3F4F6] dark:bg-[#171717]">
            <Tag className="w-5 h-5 text-[#111111] dark:text-white" />
          </div>
          <div>
            <p className="text-xs text-[#9CA3AF] dark:text-[#737373]">{t('ingredients.expensiveCategory')}</p>
            <p className="text-lg font-bold text-[#111111] dark:text-white truncate">{summaryStats.expensiveCat}</p>
          </div>
        </div>
        <div className="bg-white dark:bg-[#0A0A0A] rounded-2xl border border-[#E5E7EB] dark:border-[#1A1A1A] p-4 flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-[#F3F4F6] dark:bg-[#171717]">
            <Truck className="w-5 h-5 text-[#111111] dark:text-white" />
          </div>
          <div>
            <p className="text-xs text-[#9CA3AF] dark:text-[#737373]">{t('ingredients.linkedSuppliers')}</p>
            <p className="text-xl font-bold text-[#111111] dark:text-white">{summaryStats.uniqueSuppliers}</p>
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="relative mb-3">
        <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#9CA3AF] dark:text-[#737373]" />
        <input
          type="text"
          placeholder={t('ingredients.searchPlaceholder')}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="input pl-10 w-full"
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

      {/* Table */}
      <div className="bg-white dark:bg-[#0A0A0A] rounded-lg shadow overflow-x-auto border border-[#E5E7EB] dark:border-[#1A1A1A]">
        <table className="w-full text-sm">
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
              <th className="px-4 py-3"><SortHeader label={t('ingredients.unitColumn')} field="unit" /></th>
              <th className="px-4 py-3 font-medium">{t('ingredients.allergensColumn')}</th>
              <th className="px-4 py-3"><SortHeader label={t('ingredients.supplierColumn')} field="supplier" /></th>
              <th className="px-4 py-3 font-medium w-24">{t('ingredients.actionsColumn')}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#E5E7EB] dark:divide-[#1A1A1A]">
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={8} className="px-4 py-8 text-center text-[#9CA3AF] dark:text-[#737373]">
                  {ingredients.length === 0 ? t('ingredients.noIngredients') : t('ingredients.noResults')}
                </td>
              </tr>
            ) : (
              filtered.map((ing) => (
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
                          <span className="ml-1 text-xs text-emerald-500" title="Produit de saison">🌿</span>
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
                  <td className="px-4 py-3 text-[#6B7280] dark:text-[#A3A3A3]">{ing.unit}</td>
                  <td className="px-4 py-3">
                    <div className="flex flex-wrap gap-1">
                      {(ing.allergens || []).map((a) => (
                        <span key={a} className="px-1.5 py-0.5 rounded text-[10px] bg-[#F3F4F6] dark:bg-[#171717] text-[#111111] dark:text-white font-medium">
                          {a}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    {ing.supplierRef?.name || ing.supplier ? (
                      <span className="inline-flex items-center gap-1.5 text-[#6B7280] dark:text-[#A3A3A3]">
                        <Truck className="w-3.5 h-3.5 text-[#6B7280] dark:text-[#A3A3A3] flex-shrink-0" />
                        {ing.supplierRef?.name || ing.supplier}
                      </span>
                    ) : (
                      <span className="text-[#9CA3AF] dark:text-[#737373] italic text-xs">{t('ingredients.notAssigned')}</span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-1">
                      <button onClick={() => openWeigh(ing)} className="p-1.5 rounded hover:bg-emerald-100 dark:hover:bg-emerald-900/30" title={t('ingredients.weighTooltip')} aria-label="Peser l'ingrédient">
                        <Scale className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                      </button>
                      <button onClick={() => openEdit(ing)} className="p-1.5 rounded hover:bg-[#F3F4F6] dark:hover:bg-[#171717]" title={t('ingredients.editTooltip')} aria-label="Modifier l'ingrédient">
                        <Pencil className="w-4 h-4 text-[#6B7280] dark:text-[#A3A3A3]" />
                      </button>
                      <button onClick={() => setDeleteTarget(ing.id)} className="p-1.5 rounded hover:bg-red-100 dark:hover:bg-red-900/30" title={t('ingredients.deleteTooltip')} aria-label="Supprimer l'ingrédient">
                        <Trash2 className="w-4 h-4 text-red-500" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <p className="text-sm text-[#9CA3AF] dark:text-[#737373] mt-3">{t('ingredients.ingredientCount').replace('{count}', String(filtered.length))}</p>

      {/* ── Bulk Actions Floating Bar ──────────────────────────────────── */}
      {selectedIds.size > 0 && (
        <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 bg-[#111111] dark:bg-white text-white dark:text-black rounded-2xl shadow-2xl px-6 py-3 flex items-center gap-4 animate-in slide-in-from-bottom-4">
          <span className="text-sm font-medium flex items-center gap-2">
            <CheckSquare className="w-4 h-4" />
            {selectedIds.size} selectionne{selectedIds.size > 1 ? 's' : ''}
          </span>
          <div className="w-px h-6 bg-white/20 dark:bg-black/20" />

          {/* Bulk delete */}
          <button
            onClick={bulkDelete}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium bg-red-600 hover:bg-red-500 text-white transition-colors"
          >
            <Trash2 className="w-4 h-4" />
            Supprimer ({selectedIds.size})
          </button>

          {/* Bulk change category */}
          <div className="relative">
            <button
              onClick={() => { setBulkCategoryOpen(!bulkCategoryOpen); setBulkSupplierOpen(false); }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium bg-white/10 dark:bg-black/10 hover:bg-white/20 dark:hover:bg-black/20 transition-colors"
            >
              <Tag className="w-4 h-4" />
              Changer categorie
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
              Changer fournisseur
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
            {/* Name suggestions dropdown — existing + catalog */}
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
                          <span className="text-xs text-[#9CA3AF] dark:text-[#737373]">—</span>
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

          <div className="grid grid-cols-2 gap-4">
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
        title={trackerIngredient ? `Historique des prix — ${trackerIngredient.name}` : 'Historique des prix'}
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
