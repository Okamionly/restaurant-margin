import { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import {
  Package, AlertTriangle, Plus, RefreshCw, Pencil, Trash2, Search,
  ArrowUpDown, Download, Printer, TrendingUp, CheckCircle2, XCircle, MinusCircle,
  PackagePlus, Loader2, PieChart, Scale, Clock, MapPin, X, Trash, ScanBarcode, Camera, XOctagon,
  ShoppingCart, ChevronDown, ChevronUp, Timer, Flame, BarChart3, CheckSquare, Square
} from 'lucide-react';
import SearchBar, { type SearchSuggestion } from '../components/SearchBar';
import FilterPanel, { type FilterDef, type FilterValues } from '../components/FilterPanel';
import {
  fetchInventory, fetchInventoryAlerts, fetchInventoryValue, fetchInventorySuggestions,
  addToInventory, updateInventoryItem, restockInventoryItem, deleteInventoryItem,
  createWasteLog, fetchIngredients, fetchAutoReorderSuggestions, confirmAutoReorder
} from '../services/api';
import type { AutoReorderGroup } from '../services/api';
import type { InventoryItem, InventoryValue, Ingredient } from '../types';

// ── BarcodeDetector type declaration for Web API ────────
declare global {
  interface BarcodeDetectorOptions {
    formats?: string[];
  }
  class BarcodeDetector {
    constructor(options?: BarcodeDetectorOptions);
    detect(source: ImageBitmapSource): Promise<{ rawValue: string; format: string }[]>;
    static getSupportedFormats(): Promise<string[]>;
  }
}

import { useToast } from '../hooks/useToast';
import { useRestaurant } from '../hooks/useRestaurant';
import Modal from '../components/Modal';
import { ProgressRing } from '../components/Charts';
import ConfirmDialog from '../components/ConfirmDialog';
import WeighModal from '../components/WeighModal';
import { useTranslation } from '../hooks/useTranslation';
import { updateOnboardingStep } from '../components/OnboardingWizard';

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

const CATEGORY_EMOJIS: Record<string, string> = {
  'Viandes': '🥩',
  'Poissons & Fruits de mer': '🐟',
  'Legumes': '🥦',
  'Légumes': '🥦',
  'Fruits': '🍎',
  'Produits laitiers': '🧀',
  'Épices & Condiments': '🌶️',
  'Féculents & Céréales': '🌾',
  'Huiles & Matières grasses': '🫒',
  'Boissons': '🥤',
  'Autres': '📦',
};

const LOCATIONS = ['Cuisine', 'Chambre froide', 'Congélateur', 'Réserve sèche', 'Bar'] as const;
type LocationType = typeof LOCATIONS[number] | '';

const LOCATION_COLORS: Record<string, string> = {
  'Cuisine': 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400',
  'Chambre froide': 'bg-cyan-100 text-cyan-700 dark:bg-cyan-900/30 dark:text-cyan-400',
  'Congélateur': 'bg-teal-100 text-teal-700 dark:bg-teal-900/30 dark:text-teal-400',
  'Réserve sèche': 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
  'Bar': 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400',
};

const WASTE_REASONS = [
  { value: 'expired', label: 'Périmé' },
  { value: 'damaged', label: 'Abîmé' },
  { value: 'overproduction', label: 'Surproduction' },
  { value: 'spoiled', label: 'Avarié' },
  { value: 'other', label: 'Autre' },
];

type SortKey = 'name' | 'currentStock' | 'value' | 'status';
type SortDir = 'asc' | 'desc';

// Parse extra metadata from notes field (JSON encoded)
interface ItemMeta {
  expirationDate?: string;
  location?: string;
  _originalNotes?: string;
}

function parseMeta(notes: string | null): ItemMeta {
  if (!notes) return {};
  try {
    const parsed = JSON.parse(notes);
    if (typeof parsed === 'object' && parsed !== null && (parsed.expirationDate || parsed.location)) {
      return parsed;
    }
  } catch { /* not JSON, treat as plain notes */ }
  return { _originalNotes: notes || undefined };
}

function serializeMeta(meta: ItemMeta): string {
  const clean: Record<string, unknown> = {};
  if (meta.expirationDate) clean.expirationDate = meta.expirationDate;
  if (meta.location) clean.location = meta.location;
  if (meta._originalNotes) clean._originalNotes = meta._originalNotes;
  return Object.keys(clean).length > 0 ? JSON.stringify(clean) : '';
}

function getExpirationStatus(expirationDate?: string): 'expired' | 'soon3' | 'soon7' | 'ok' {
  if (!expirationDate) return 'ok';
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  const exp = new Date(expirationDate);
  exp.setHours(0, 0, 0, 0);
  const diffDays = Math.floor((exp.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
  if (diffDays < 0) return 'expired';
  if (diffDays <= 3) return 'soon3';
  if (diffDays <= 7) return 'soon7';
  return 'ok';
}

function getDaysUntilExpiry(expirationDate?: string): number | null {
  if (!expirationDate) return null;
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  const exp = new Date(expirationDate);
  exp.setHours(0, 0, 0, 0);
  return Math.floor((exp.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
}

function getStatus(item: InventoryItem): 'ok' | 'low' | 'critical' {
  if (item.currentStock <= 0) return 'critical';
  if (item.currentStock < item.minStock) return 'low';
  return 'ok';
}

function getStatusOrder(status: string): number {
  if (status === 'critical') return 0;
  if (status === 'low') return 1;
  return 2;
}

function getExpirationOrder(expStatus: string): number {
  if (expStatus === 'expired') return 0;
  if (expStatus === 'soon3') return 1;
  if (expStatus === 'soon7') return 2;
  return 3;
}

/** Compute stock fill % for the progress bar */
function getStockPercent(item: InventoryItem): number {
  const max = item.maxStock && item.maxStock > 0 ? item.maxStock : item.minStock * 3;
  if (max <= 0) return item.currentStock > 0 ? 100 : 0;
  return Math.min(100, Math.max(0, (item.currentStock / max) * 100));
}

/** Stock bar color based on fill percentage */
function getStockBarColor(pct: number): string {
  if (pct < 20) return 'bg-red-500';
  if (pct < 50) return 'bg-amber-500';
  return 'bg-emerald-500';
}

function getStockBarTrack(pct: number): string {
  if (pct < 20) return 'bg-red-100 dark:bg-red-900/30';
  if (pct < 50) return 'bg-amber-100 dark:bg-amber-900/30';
  return 'bg-emerald-100 dark:bg-emerald-900/30';
}

export default function Inventory() {
  const { t } = useTranslation();
  const { showToast } = useToast();
  const { selectedRestaurant, loading: restaurantLoading } = useRestaurant();
  const [items, setItems] = useState<InventoryItem[]>([]);
  const [alerts, setAlerts] = useState<InventoryItem[]>([]);
  const [valueData, setValueData] = useState<InventoryValue | null>(null);
  const [suggestions, setSuggestions] = useState<Ingredient[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterCategory, setFilterCategory] = useState('');
  const [filterLocation, setFilterLocation] = useState<LocationType>('');
  const [filterAlertOnly, setFilterAlertOnly] = useState(false);
  const [sortKey, setSortKey] = useState<SortKey>('name');
  const [sortDir, setSortDir] = useState<SortDir>('asc');

  // Advanced filters (via FilterPanel)
  const [inventoryFilters, setInventoryFilters] = useState<FilterValues>({
    stockLevel: [],
    category: '',
    expiry: { from: '', to: '' },
  });

  // Low stock banner
  const [bannerDismissed, setBannerDismissed] = useState(false);

  // Modals
  const [showAddModal, setShowAddModal] = useState(false);
  const [showRestockModal, setShowRestockModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<number | null>(null);
  const [showWasteModal, setShowWasteModal] = useState(false);

  // Weigh modal
  const [weighTarget, setWeighTarget] = useState<InventoryItem | null>(null);

  // Barcode scanner
  const [showScanner, setShowScanner] = useState(false);
  const [scannerSupported, setScannerSupported] = useState(true);
  const [scannerError, setScannerError] = useState('');
  const [lastScannedBarcode, setLastScannedBarcode] = useState('');
  const [allIngredients, setAllIngredients] = useState<Ingredient[]>([]);
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const scanIntervalRef = useRef<number | null>(null);

  // Auto-reorder
  const [showReorderModal, setShowReorderModal] = useState(false);
  const [reorderGroups, setReorderGroups] = useState<AutoReorderGroup[]>([]);
  const [reorderLoading, setReorderLoading] = useState(false);
  const [reorderConfirming, setReorderConfirming] = useState(false);
  const [editedQuantities, setEditedQuantities] = useState<Record<string, number>>({});
  const [expandedSuppliers, setExpandedSuppliers] = useState<Set<string>>(new Set());
  const [reorderBelowCount, setReorderBelowCount] = useState(0);

  // Quick restock inline
  const [quickRestockId, setQuickRestockId] = useState<number | null>(null);
  const [quickRestockQty, setQuickRestockQty] = useState('');

  // Bulk selection
  const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set());

  // Forms
  const [addForm, setAddForm] = useState({ ingredientId: 0, currentStock: '', minStock: '', unit: '', expirationDate: '', location: '' as LocationType });
  const [restockForm, setRestockForm] = useState({ id: 0, name: '', quantity: '' });
  const [editForm, setEditForm] = useState({ id: 0, currentStock: '', minStock: '', maxStock: '', unit: '', notes: '', expirationDate: '', location: '' as LocationType });
  const [editingStockId, setEditingStockId] = useState<number | null>(null);
  const [inlineStock, setInlineStock] = useState('');
  const [savingBulk, setSavingBulk] = useState(false);

  // Waste form
  const [wasteForm, setWasteForm] = useState({ itemId: 0, ingredientId: 0, ingredientName: '', unit: '', quantity: '', reason: 'expired', notes: '' });

  // Category tabs scroll ref
  const catScrollRef = useRef<HTMLDivElement>(null);

  async function loadData() {
    try {
      setLoading(true);
      const [inv, alertsData, val, sugg] = await Promise.all([
        fetchInventory(),
        fetchInventoryAlerts(),
        fetchInventoryValue(),
        fetchInventorySuggestions(),
      ]);
      setItems(inv);
      setAlerts(alertsData);
      setValueData(val);
      setSuggestions(sugg);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Erreur de chargement';
      showToast(message, 'error');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (restaurantLoading || !selectedRestaurant) return;
    loadData();
  }, [selectedRestaurant, restaurantLoading]);

  // Compute alert counts
  const criticalCount = useMemo(() => items.filter(i => i.currentStock <= 0).length, [items]);
  const lowCount = useMemo(() => items.filter(i => i.currentStock > 0 && i.currentStock < i.minStock).length, [items]);

  // Compute below-minimum count for auto-reorder badge
  useEffect(() => {
    const belowMin = items.filter(i => i.currentStock < i.minStock && i.minStock > 0).length;
    setReorderBelowCount(belowMin);
  }, [items]);

  // Compute total stock value from items directly (for the big card)
  const computedTotalValue = useMemo(() => {
    return items.reduce((sum, item) => {
      return sum + (item.currentStock / getUnitDivisor(item.ingredient.unit)) * item.ingredient.pricePerUnit;
    }, 0);
  }, [items]);

  // Expiring soon items
  const expiringItems = useMemo(() => {
    return items
      .map(item => {
        const meta = parseMeta(item.notes);
        const days = getDaysUntilExpiry(meta.expirationDate);
        return { item, days, expirationDate: meta.expirationDate };
      })
      .filter(x => x.days !== null && x.days <= 7)
      .sort((a, b) => (a.days ?? 999) - (b.days ?? 999));
  }, [items]);

  // Smart search suggestions for inventory
  const inventorySearchSuggestions = useMemo<SearchSuggestion[]>(() => {
    if (!search.trim()) return [];
    const q = search.toLowerCase();
    return items
      .filter((item) => item.ingredient?.name?.toLowerCase().includes(q))
      .slice(0, 8)
      .map((item) => ({
        id: `inv-${item.id}`,
        label: item.ingredient.name,
        category: 'Inventaire',
        icon: Package,
        onSelect: () => setSearch(item.ingredient.name),
      }));
  }, [search, items]);

  // Filter definitions for inventory FilterPanel
  const inventoryFilterDefs = useMemo<FilterDef[]>(() => [
    {
      key: 'stockLevel',
      label: 'Niveau de stock',
      type: 'checkbox-group',
      options: [
        { value: 'critical', label: 'Critique' },
        { value: 'low', label: 'Bas' },
        { value: 'ok', label: 'OK' },
        { value: 'over', label: 'Excedentaire' },
      ],
    },
    {
      key: 'category',
      label: 'Categorie',
      type: 'select',
      placeholder: 'Toutes les categories',
      options: Object.keys(CATEGORY_EMOJIS).map((c) => ({ value: c, label: c })),
    },
    {
      key: 'expiry',
      label: 'Date d\'expiration',
      type: 'date-range',
    },
  ], []);

  // Filtered and sorted items
  const filteredItems = useMemo(() => {
    let result = [...items];
    if (search) {
      const q = search.toLowerCase();
      result = result.filter(item => item.ingredient?.name?.toLowerCase().includes(q));
    }
    if (filterCategory) {
      result = result.filter(item => item.ingredient?.category === filterCategory);
    }
    if (filterLocation) {
      result = result.filter(item => {
        const meta = parseMeta(item.notes);
        return meta.location === filterLocation;
      });
    }
    if (filterAlertOnly) {
      result = result.filter(item => {
        const status = getStatus(item);
        return status === 'critical' || status === 'low';
      });
    }

    // Advanced filters
    const fStockLevel: string[] = inventoryFilters.stockLevel || [];
    const fCategory = inventoryFilters.category || '';
    const fExpiry = inventoryFilters.expiry || { from: '', to: '' };

    if (fStockLevel.length > 0) {
      result = result.filter(item => {
        const status = getStatus(item);
        return fStockLevel.includes(status);
      });
    }
    if (fCategory) {
      result = result.filter(item => item.ingredient?.category === fCategory);
    }
    if (fExpiry.from || fExpiry.to) {
      result = result.filter(item => {
        const meta = parseMeta(item.notes);
        if (!meta.expirationDate) return false;
        const d = new Date(meta.expirationDate);
        if (fExpiry.from && d < new Date(fExpiry.from)) return false;
        if (fExpiry.to && d > new Date(fExpiry.to)) return false;
        return true;
      });
    }

    result.sort((a, b) => {
      // Always sort expired items to top
      const metaA = parseMeta(a.notes);
      const metaB = parseMeta(b.notes);
      const expA = getExpirationOrder(getExpirationStatus(metaA.expirationDate));
      const expB = getExpirationOrder(getExpirationStatus(metaB.expirationDate));
      if (expA !== expB) return expA - expB;

      let cmp = 0;
      switch (sortKey) {
        case 'name':
          cmp = a.ingredient.name.localeCompare(b.ingredient.name);
          break;
        case 'currentStock':
          cmp = a.currentStock - b.currentStock;
          break;
        case 'value':
          cmp = ((a.currentStock / getUnitDivisor(a.ingredient.unit)) * a.ingredient.pricePerUnit) - ((b.currentStock / getUnitDivisor(b.ingredient.unit)) * b.ingredient.pricePerUnit);
          break;
        case 'status':
          cmp = getStatusOrder(getStatus(a)) - getStatusOrder(getStatus(b));
          break;
      }
      return sortDir === 'asc' ? cmp : -cmp;
    });
    return result;
  }, [items, search, filterCategory, filterLocation, filterAlertOnly, sortKey, sortDir, inventoryFilters]);

  function toggleSort(key: SortKey) {
    if (sortKey === key) setSortDir(d => d === 'asc' ? 'desc' : 'asc');
    else { setSortKey(key); setSortDir('asc'); }
  }

  // Categories present in inventory with counts
  const categoriesWithCounts = useMemo(() => {
    const map = new Map<string, number>();
    items.forEach(i => {
      const cat = i.ingredient.category;
      map.set(cat, (map.get(cat) || 0) + 1);
    });
    return Array.from(map.entries()).sort((a, b) => a[0].localeCompare(b[0]));
  }, [items]);

  // --- Bulk selection helpers ---
  function toggleSelect(id: number) {
    setSelectedIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function toggleSelectAll() {
    if (selectedIds.size === filteredItems.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(filteredItems.map(i => i.id)));
    }
  }

  function handleBulkExportCSV() {
    const selected = filteredItems.filter(i => selectedIds.has(i.id));
    if (selected.length === 0) { showToast('Aucun article selectionne', 'error'); return; }
    const header = 'Ingredient,Categorie,Stock actuel,Unite,Stock min,Stock max,Valeur,Statut,Emplacement,Date expiration\n';
    const rows = selected.map(item => {
      const val = ((item.currentStock / getUnitDivisor(item.ingredient.unit)) * item.ingredient.pricePerUnit).toFixed(2);
      const status = getStatus(item) === 'ok' ? 'OK' : getStatus(item) === 'low' ? 'Bas' : 'Critique';
      const meta = parseMeta(item.notes);
      return `"${item.ingredient.name}","${item.ingredient.category}",${item.currentStock},"${item.unit}",${item.minStock},${item.maxStock || ''},${val},${status},"${meta.location || ''}","${meta.expirationDate || ''}"`;
    }).join('\n');
    const blob = new Blob([header + rows], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `inventaire_selection_${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    showToast(`${selected.length} article(s) exporte(s) en CSV`, 'success');
  }

  async function handleBulkReorder() {
    const selected = items.filter(i => selectedIds.has(i.id) && i.currentStock < i.minStock);
    if (selected.length === 0) {
      showToast('Aucun article en stock bas dans la selection', 'error');
      return;
    }
    // Open the reorder modal which handles the full workflow
    openReorderModal();
  }

  // --- Quick Restock inline ---
  async function handleQuickRestock(itemId: number) {
    const qty = parseFloat(quickRestockQty);
    if (!qty || qty <= 0) { showToast('Quantite invalide', 'error'); return; }
    try {
      await restockInventoryItem(itemId, qty);
      showToast(`+${qty} ajoute au stock`, 'success');
      setQuickRestockId(null);
      setQuickRestockQty('');
      loadData();
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Erreur';
      showToast(message, 'error');
    }
  }

  // --- Handlers ---
  async function handleAdd() {
    if (!addForm.ingredientId) { showToast('Selectionnez un ingredient', 'error'); return; }
    try {
      const meta: ItemMeta = {};
      if (addForm.expirationDate) meta.expirationDate = addForm.expirationDate;
      if (addForm.location) meta.location = addForm.location;
      const notesStr = serializeMeta(meta);

      await addToInventory({
        ingredientId: addForm.ingredientId,
        currentStock: parseFloat(addForm.currentStock) || 0,
        minStock: parseFloat(addForm.minStock) || 0,
        unit: addForm.unit || undefined,
        notes: notesStr || undefined,
      });
      showToast('Ingredient ajoute a l\'inventaire', 'success');
      updateOnboardingStep('stockConfigured', true);
      setShowAddModal(false);
      setAddForm({ ingredientId: 0, currentStock: '', minStock: '', unit: '', expirationDate: '', location: '' });
      loadData();
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Erreur';
      showToast(message, 'error');
    }
  }

  async function handleRestock() {
    const qty = parseFloat(restockForm.quantity);
    if (!qty || qty <= 0) { showToast('Quantite invalide', 'error'); return; }
    try {
      await restockInventoryItem(restockForm.id, qty);
      showToast('Stock mis a jour', 'success');
      setShowRestockModal(false);
      setRestockForm({ id: 0, name: '', quantity: '' });
      loadData();
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Erreur';
      showToast(message, 'error');
    }
  }

  async function handleEdit() {
    try {
      // Merge existing meta with new values
      const existingItem = items.find(i => i.id === editForm.id);
      const existingMeta = existingItem ? parseMeta(existingItem.notes) : {};
      const meta: ItemMeta = {
        ...existingMeta,
        expirationDate: editForm.expirationDate || undefined,
        location: editForm.location || undefined,
      };
      // Preserve original notes text
      if (editForm.notes && editForm.notes !== serializeMeta(existingMeta)) {
        meta._originalNotes = editForm.notes;
      }
      const notesStr = serializeMeta(meta);

      const data: Partial<{ currentStock: number; minStock: number; maxStock: number | null; unit: string; notes: string }> = {};
      if (editForm.currentStock !== '') data.currentStock = parseFloat(editForm.currentStock);
      if (editForm.minStock !== '') data.minStock = parseFloat(editForm.minStock);
      data.maxStock = editForm.maxStock ? parseFloat(editForm.maxStock) : null;
      if (editForm.unit) data.unit = editForm.unit;
      data.notes = notesStr || undefined;
      await updateInventoryItem(editForm.id, data);
      showToast('Inventaire mis a jour', 'success');
      setShowEditModal(false);
      loadData();
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Erreur';
      showToast(message, 'error');
    }
  }

  async function handleDelete() {
    if (!deleteTarget) return;
    try {
      await deleteInventoryItem(deleteTarget);
      showToast('Supprime de l\'inventaire', 'success');
      setDeleteTarget(null);
      loadData();
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Erreur';
      showToast(message, 'error');
    }
  }

  async function handleInlineStockSave(itemId: number) {
    const val = parseFloat(inlineStock);
    if (isNaN(val) || val < 0) { showToast('Valeur invalide', 'error'); return; }
    try {
      await updateInventoryItem(itemId, { currentStock: val });
      setEditingStockId(null);
      loadData();
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Erreur';
      showToast(message, 'error');
    }
  }

  async function handleBulkAdd() {
    setSavingBulk(true);
    try {
      let added = 0;
      for (const ing of suggestions) {
        try {
          await addToInventory({ ingredientId: ing.id, currentStock: 0, minStock: 0 });
          added++;
        } catch { /* skip duplicates */ }
      }
      showToast(`${added} ingredient(s) ajoute(s) a l'inventaire`, 'success');
      loadData();
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Erreur';
      showToast(message, 'error');
    } finally {
      setSavingBulk(false);
    }
  }

  async function handleWeighComplete(data: { weight: number; mode: 'set' | 'add' }) {
    if (!weighTarget) return;
    try {
      const valueStr = weighTarget.ingredient.pricePerUnit > 0
        ? ` (${((data.weight / getUnitDivisor(weighTarget.ingredient.unit)) * weighTarget.ingredient.pricePerUnit).toFixed(2)} €)`
        : '';
      if (data.mode === 'set') {
        await updateInventoryItem(weighTarget.id, { currentStock: data.weight });
        showToast(`Stock mis a jour : ${data.weight} ${weighTarget.unit}${valueStr}`, 'success');
      } else {
        await restockInventoryItem(weighTarget.id, data.weight);
        showToast(`Stock mis a jour : ${data.weight} ${weighTarget.unit}${valueStr}`, 'success');
      }
      setWeighTarget(null);
      loadData();
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Erreur lors de la mise a jour';
      showToast(message, 'error');
    }
  }

  // ── Auto-Reorder ─────────────────────────────────────────────────
  async function openReorderModal() {
    setShowReorderModal(true);
    setReorderLoading(true);
    setEditedQuantities({});
    setExpandedSuppliers(new Set());
    try {
      const groups = await fetchAutoReorderSuggestions();
      setReorderGroups(groups);
      // Expand all suppliers by default
      setExpandedSuppliers(new Set(groups.map(g => g.supplier)));
      // Initialize edited quantities from suggestions
      const qtyMap: Record<string, number> = {};
      for (const group of groups) {
        for (const item of group.items) {
          qtyMap[`${group.supplier}-${item.ingredientId}`] = item.suggestedQty;
        }
      }
      setEditedQuantities(qtyMap);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Erreur';
      showToast(message, 'error');
    } finally {
      setReorderLoading(false);
    }
  }

  function getEditedQty(supplier: string, ingredientId: number): number {
    const key = `${supplier}-${ingredientId}`;
    return editedQuantities[key] ?? 0;
  }

  function setEditedQty(supplier: string, ingredientId: number, qty: number) {
    const key = `${supplier}-${ingredientId}`;
    setEditedQuantities(prev => ({ ...prev, [key]: Math.max(0, qty) }));
  }

  function getGroupEstimatedCost(group: AutoReorderGroup): number {
    let total = 0;
    for (const item of group.items) {
      const qty = getEditedQty(group.supplier, item.ingredientId);
      const ratio = item.suggestedQty > 0 ? qty / item.suggestedQty : 0;
      total += item.estimatedCost * ratio;
    }
    return Math.round(total * 100) / 100;
  }

  function toggleSupplier(supplier: string) {
    setExpandedSuppliers(prev => {
      const next = new Set(prev);
      if (next.has(supplier)) next.delete(supplier);
      else next.add(supplier);
      return next;
    });
  }

  async function handleConfirmReorder(supplierFilter?: string) {
    setReorderConfirming(true);
    try {
      const groupsToOrder = supplierFilter
        ? reorderGroups.filter(g => g.supplier === supplierFilter)
        : reorderGroups;

      const orders = groupsToOrder.map(group => ({
        supplier: group.supplier,
        supplierId: group.supplierId,
        items: group.items
          .filter(item => getEditedQty(group.supplier, item.ingredientId) > 0)
          .map(item => {
            const qty = getEditedQty(group.supplier, item.ingredientId);
            const unitPrice = item.suggestedQty > 0 ? (item.estimatedCost / item.suggestedQty) : 0;
            return {
              ingredientId: item.ingredientId,
              productName: item.ingredient,
              quantity: qty,
              unit: item.unit,
              unitPrice: Math.round(unitPrice * 100) / 100,
            };
          }),
      })).filter(o => o.items.length > 0);

      if (orders.length === 0) {
        showToast('Aucun article avec une quantite > 0', 'error');
        setReorderConfirming(false);
        return;
      }

      const result = await confirmAutoReorder(orders);
      showToast(`${result.count} commande${result.count > 1 ? 's' : ''} creee${result.count > 1 ? 's' : ''}`, 'success');

      if (supplierFilter) {
        // Remove ordered supplier from the list
        setReorderGroups(prev => prev.filter(g => g.supplier !== supplierFilter));
      } else {
        setShowReorderModal(false);
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Erreur';
      showToast(message, 'error');
    } finally {
      setReorderConfirming(false);
    }
  }

  // ── Barcode Scanner ─────────────────────────────────────────────────
  const stopScanner = useCallback(() => {
    if (scanIntervalRef.current) {
      clearInterval(scanIntervalRef.current);
      scanIntervalRef.current = null;
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
  }, []);

  async function startScanner() {
    setScannerError('');
    setLastScannedBarcode('');

    // Check BarcodeDetector support
    if (typeof BarcodeDetector === 'undefined') {
      setScannerSupported(false);
      setScannerError('BarcodeDetector non supporte par ce navigateur. Utilisez Chrome 83+ ou Edge 83+.');
      return;
    }

    // Load all ingredients for barcode lookup
    try {
      const ings = await fetchIngredients();
      setAllIngredients(ings);
    } catch {
      // fallback: use suggestions + items
    }

    setShowScanner(true);

    // Wait for video element to mount
    setTimeout(async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: 'environment', width: { ideal: 1280 }, height: { ideal: 720 } }
        });
        streamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          await videoRef.current.play();
        }

        const detector = new BarcodeDetector({
          formats: ['ean_13', 'ean_8', 'upc_a', 'upc_e', 'code_128', 'code_39']
        });

        // Poll for barcodes
        scanIntervalRef.current = window.setInterval(async () => {
          if (!videoRef.current || videoRef.current.readyState < 2) return;
          try {
            const barcodes = await detector.detect(videoRef.current);
            if (barcodes.length > 0) {
              const code = barcodes[0].rawValue;
              setLastScannedBarcode(code);
              handleBarcodeDetected(code);
            }
          } catch {
            // detection frame error, continue
          }
        }, 300);
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : 'Erreur camera';
        setScannerError(`Impossible d'acceder a la camera: ${message}`);
      }
    }, 100);
  }

  function handleBarcodeDetected(barcode: string) {
    stopScanner();
    setShowScanner(false);

    // Search in inventory items first
    const inventoryMatch = items.find(item => item.ingredient?.barcode === barcode);
    if (inventoryMatch) {
      openRestock(inventoryMatch);
      showToast(`Code-barres detecte : ${inventoryMatch.ingredient.name}`, 'success');
      return;
    }

    // Search in all ingredients (not yet in inventory)
    const ingredientMatch = allIngredients.find(ing => ing.barcode === barcode);
    if (ingredientMatch) {
      // Pre-fill add form with this ingredient
      setAddForm({
        ingredientId: ingredientMatch.id,
        currentStock: '',
        minStock: '',
        unit: ingredientMatch.unit,
        expirationDate: '',
        location: '',
      });
      setShowAddModal(true);
      showToast(`Code-barres detecte : ${ingredientMatch.name} (pas encore en inventaire)`, 'info');
      return;
    }

    // Not found
    showToast(`Code-barres ${barcode} non trouve. Ajoutez-le d'abord dans les ingredients.`, 'error');
  }

  function closeScanner() {
    stopScanner();
    setShowScanner(false);
  }

  // Cleanup scanner on unmount
  useEffect(() => {
    return () => { stopScanner(); };
  }, [stopScanner]);

  // Waste handler
  async function handleWasteSubmit() {
    const qty = parseFloat(wasteForm.quantity);
    if (!qty || qty <= 0) { showToast('Quantite invalide', 'error'); return; }
    try {
      await createWasteLog({
        ingredientId: wasteForm.ingredientId,
        quantity: qty,
        unit: wasteForm.unit,
        reason: wasteForm.reason,
        date: new Date().toISOString(),
        notes: wasteForm.notes || undefined,
      });
      // Also reduce stock
      const item = items.find(i => i.id === wasteForm.itemId);
      if (item) {
        const newStock = Math.max(0, item.currentStock - qty);
        await updateInventoryItem(wasteForm.itemId, { currentStock: newStock });
      }
      showToast('Perte declaree et stock mis a jour', 'success');
      setShowWasteModal(false);
      setWasteForm({ itemId: 0, ingredientId: 0, ingredientName: '', unit: '', quantity: '', reason: 'expired', notes: '' });
      loadData();
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Erreur';
      showToast(message, 'error');
    }
  }

  function openWaste(item: InventoryItem) {
    setWasteForm({
      itemId: item.id,
      ingredientId: item.ingredientId,
      ingredientName: item.ingredient.name,
      unit: item.unit,
      quantity: '',
      reason: 'expired',
      notes: '',
    });
    setShowWasteModal(true);
  }

  function handleExportCSV() {
    const header = 'Ingredient,Categorie,Stock actuel,Unite,Stock min,Stock max,Valeur,Statut,Emplacement,Date expiration\n';
    const rows = filteredItems.map(item => {
      const val = ((item.currentStock / getUnitDivisor(item.ingredient.unit)) * item.ingredient.pricePerUnit).toFixed(2);
      const status = getStatus(item) === 'ok' ? 'OK' : getStatus(item) === 'low' ? 'Bas' : 'Critique';
      const meta = parseMeta(item.notes);
      return `"${item.ingredient.name}","${item.ingredient.category}",${item.currentStock},"${item.unit}",${item.minStock},${item.maxStock || ''},${val},${status},"${meta.location || ''}","${meta.expirationDate || ''}"`;
    }).join('\n');
    const blob = new Blob([header + rows], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `inventaire_${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    showToast('Export CSV telecharge', 'success');
  }

  function handlePrint() {
    window.print();
  }

  function openRestock(item: InventoryItem) {
    setRestockForm({ id: item.id, name: item.ingredient.name, quantity: '' });
    setShowRestockModal(true);
  }

  function openEdit(item: InventoryItem) {
    const meta = parseMeta(item.notes);
    setEditForm({
      id: item.id,
      currentStock: String(item.currentStock),
      minStock: String(item.minStock),
      maxStock: item.maxStock ? String(item.maxStock) : '',
      unit: item.unit,
      notes: meta._originalNotes || '',
      expirationDate: meta.expirationDate || '',
      location: (meta.location as LocationType) || '',
    });
    setShowEditModal(true);
  }

  // Last update date
  const lastUpdate = useMemo(() => {
    if (items.length === 0) return null;
    const dates = items.map(i => new Date(i.updatedAt).getTime());
    return new Date(Math.max(...dates));
  }, [items]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-8 h-8 animate-spin text-teal-500" />
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {/* ══════ 6. LOW STOCK SUMMARY BANNER ══════ */}
      {!bannerDismissed && (criticalCount > 0 || lowCount > 0) && (
        <div
          className="rounded-2xl border p-4 flex items-center justify-between cursor-pointer transition-all hover:shadow-md"
          style={{
            background: criticalCount > 0
              ? 'linear-gradient(135deg, rgba(239,68,68,0.08) 0%, rgba(239,68,68,0.02) 100%)'
              : 'linear-gradient(135deg, rgba(245,158,11,0.08) 0%, rgba(245,158,11,0.02) 100%)',
            borderColor: criticalCount > 0 ? '#FCA5A5' : '#FCD34D',
          }}
          onClick={() => { setFilterAlertOnly(true); setBannerDismissed(true); }}
        >
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${criticalCount > 0 ? 'bg-red-100 dark:bg-red-900/40' : 'bg-amber-100 dark:bg-amber-900/40'}`}>
              <AlertTriangle className={`w-5 h-5 ${criticalCount > 0 ? 'text-red-600 dark:text-red-400' : 'text-amber-600 dark:text-amber-400'}`} />
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              {criticalCount > 0 && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-red-600 text-white">
                  {criticalCount} en rupture
                </span>
              )}
              {lowCount > 0 && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-500 text-white">
                  {lowCount} stock bas
                </span>
              )}
              <span className="text-xs text-[#9CA3AF] dark:text-[#737373] ml-1">Cliquez pour filtrer</span>
            </div>
          </div>
          <button
            onClick={e => { e.stopPropagation(); setBannerDismissed(true); }}
            className="p-1.5 rounded-lg hover:bg-black/10 dark:hover:bg-white/10 transition-colors"
            title="Masquer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold flex items-center gap-2">
            <Package className="w-6 h-6 sm:w-7 sm:h-7 text-teal-600" />
            Inventaire
          </h1>
          <p className="text-sm text-[#9CA3AF] dark:text-[#737373] mt-1">
            Gestion des stocks d'ingredients
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button onClick={openReorderModal} className="relative flex items-center gap-1.5 px-3 py-2 bg-[#111111] dark:bg-white text-white dark:text-black text-sm rounded-lg hover:bg-[#333] dark:hover:bg-[#E5E5E5] transition-colors">
            <ShoppingCart className="w-4 h-4" /> Reappro auto
            {reorderBelowCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 min-w-[20px] h-5 flex items-center justify-center px-1 text-[11px] font-bold rounded-full bg-red-600 text-white">
                {reorderBelowCount}
              </span>
            )}
          </button>
          <button onClick={() => { setAddForm({ ingredientId: 0, currentStock: '', minStock: '', unit: '', expirationDate: '', location: '' }); setShowAddModal(true); }} className="flex items-center gap-1.5 px-3 py-2 bg-[#111111] dark:bg-white text-white dark:text-black text-sm rounded-lg hover:bg-[#333] dark:hover:bg-[#E5E5E5] transition-colors">
            <Plus className="w-4 h-4" /> Ajouter
          </button>
          <button onClick={startScanner} className="flex items-center gap-1.5 px-3 py-2 bg-[#111111] dark:bg-white text-white dark:text-black text-sm rounded-lg hover:bg-[#333] dark:hover:bg-[#E5E5E5] transition-colors">
            <ScanBarcode className="w-4 h-4" /> Scanner
          </button>
          {suggestions.length > 0 && (
            <button onClick={handleBulkAdd} disabled={savingBulk} className="flex items-center gap-1.5 px-3 py-2 bg-purple-600 text-white text-sm rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50">
              {savingBulk ? <Loader2 className="w-4 h-4 animate-spin" /> : <PackagePlus className="w-4 h-4" />}
              Inventaire complet
            </button>
          )}
          <button onClick={handleExportCSV} className="flex items-center gap-1.5 px-3 py-2 bg-[#F3F4F6] dark:bg-[#171717] text-[#9CA3AF] dark:text-[#A3A3A3] text-sm rounded-lg hover:bg-[#E5E7EB] dark:hover:bg-[#171717] transition-colors">
            <Download className="w-4 h-4" /> Export CSV
          </button>
          <button onClick={handlePrint} className="flex items-center gap-1.5 px-3 py-2 bg-[#F3F4F6] dark:bg-[#171717] text-[#9CA3AF] dark:text-[#A3A3A3] text-sm rounded-lg hover:bg-[#E5E7EB] dark:hover:bg-[#171717] transition-colors no-print">
            <Printer className="w-4 h-4" /> Imprimer
          </button>
        </div>
      </div>

      {/* ══════ 2. STOCK VALUE CARD + STATS ══════ */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {/* Total Value - Hero Card */}
        <div className="col-span-2 bg-white dark:bg-[#0A0A0A] rounded-2xl border border-[#E5E7EB] dark:border-[#1A1A1A] p-5 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-emerald-50 dark:from-emerald-900/10 to-transparent rounded-bl-full" />
          <div className="relative">
            <div className="flex items-center gap-2 text-[#9CA3AF] dark:text-[#737373] text-sm mb-2">
              <div className="w-8 h-8 rounded-lg bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center">
                <TrendingUp className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              </div>
              Valeur totale du stock
            </div>
            <div className="text-3xl sm:text-4xl font-bold text-emerald-600 dark:text-emerald-400 tracking-tight">
              {computedTotalValue.toFixed(2)} <span className="text-lg font-medium">EUR</span>
            </div>
            <div className="flex items-center gap-4 mt-3">
              <div className="text-xs text-[#9CA3AF] dark:text-[#737373]">
                <span className="font-semibold text-black dark:text-white">{items.length}</span> articles
              </div>
              <div className="text-xs text-[#9CA3AF] dark:text-[#737373]">
                <span className="font-semibold text-black dark:text-white">{categoriesWithCounts.length}</span> categories
              </div>
              {lastUpdate && (
                <div className="text-xs text-[#9CA3AF] dark:text-[#737373]">
                  MaJ {lastUpdate.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Alerts Card */}
        <div className="bg-white dark:bg-[#0A0A0A] rounded-2xl border border-[#E5E7EB] dark:border-[#1A1A1A] p-4">
          <div className="flex items-center gap-2 text-[#9CA3AF] dark:text-[#737373] text-xs sm:text-sm mb-2">
            <div className="w-7 h-7 rounded-lg bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
              <AlertTriangle className="w-3.5 h-3.5 text-red-600 dark:text-red-400" />
            </div>
            Alertes
          </div>
          <div className={`text-2xl font-bold ${alerts.length > 0 ? 'text-red-600 dark:text-red-400' : 'text-emerald-600 dark:text-emerald-400'}`}>
            {alerts.length}
          </div>
          <div className="flex gap-1.5 mt-2">
            {criticalCount > 0 && (
              <span className="px-1.5 py-0.5 rounded text-[10px] font-semibold bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-400">
                {criticalCount} critique
              </span>
            )}
            {lowCount > 0 && (
              <span className="px-1.5 py-0.5 rounded text-[10px] font-semibold bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-400">
                {lowCount} bas
              </span>
            )}
            {alerts.length === 0 && (
              <span className="px-1.5 py-0.5 rounded text-[10px] font-semibold bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400">
                Tout OK
              </span>
            )}
          </div>
        </div>

        {/* Expiring Soon Card */}
        <div className="bg-white dark:bg-[#0A0A0A] rounded-2xl border border-[#E5E7EB] dark:border-[#1A1A1A] p-4">
          <div className="flex items-center gap-2 text-[#9CA3AF] dark:text-[#737373] text-xs sm:text-sm mb-2">
            <div className="w-7 h-7 rounded-lg bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center">
              <Timer className="w-3.5 h-3.5 text-orange-600 dark:text-orange-400" />
            </div>
            Expirent bientot
          </div>
          <div className={`text-2xl font-bold ${expiringItems.length > 0 ? 'text-orange-600 dark:text-orange-400' : 'text-emerald-600 dark:text-emerald-400'}`}>
            {expiringItems.length}
          </div>
          {expiringItems.length > 0 ? (
            <div className="mt-2 space-y-0.5 max-h-16 overflow-hidden">
              {expiringItems.slice(0, 2).map(({ item, days }) => (
                <div key={item.id} className="text-[10px] truncate">
                  <span className={`font-semibold ${(days ?? 0) <= 0 ? 'text-red-600 dark:text-red-400' : (days ?? 0) <= 3 ? 'text-red-500' : 'text-orange-500'}`}>
                    {(days ?? 0) <= 0 ? 'Expire' : `${days}j`}
                  </span>
                  <span className="text-[#9CA3AF] dark:text-[#737373] ml-1">{item.ingredient.name}</span>
                </div>
              ))}
              {expiringItems.length > 2 && (
                <div className="text-[10px] text-[#9CA3AF] dark:text-[#737373]">+{expiringItems.length - 2} autres</div>
              )}
            </div>
          ) : (
            <span className="px-1.5 py-0.5 rounded text-[10px] font-semibold bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400 inline-block mt-2">
              Aucun
            </span>
          )}
        </div>
      </div>

      {/* Alert Panel */}
      {alerts.length > 0 && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-2xl p-4">
          <h3 className="font-semibold text-red-700 dark:text-red-400 flex items-center gap-2 mb-3">
            <AlertTriangle className="w-5 h-5" />
            Alertes de stock ({alerts.length})
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
            {alerts.map(item => (
              <div key={item.id} className="flex items-center justify-between bg-white dark:bg-[#0A0A0A] rounded-lg px-3 py-2 border dark:border-[#1A1A1A]">
                <div>
                  <span className="text-sm font-medium">{CATEGORY_EMOJIS[item.ingredient.category] || '📦'} {item.ingredient.name}</span>
                  <div className="text-xs text-[#9CA3AF] dark:text-[#737373]">
                    {item.currentStock}{" / "}{item.minStock} {item.unit}
                  </div>
                </div>
                <button onClick={() => openRestock(item)} className="px-2 py-1 text-xs bg-[#111111] dark:bg-white text-white dark:text-black rounded hover:bg-[#333] dark:hover:bg-[#E5E5E5] transition-colors">
                  Reapprovisionner
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Value by category (pie chart representation) */}
      {valueData && valueData.byCategory.length > 0 && (
        <div className="bg-white dark:bg-[#0A0A0A] rounded-2xl border border-[#E5E7EB] dark:border-[#1A1A1A] p-4">
          <h3 className="font-semibold flex items-center gap-2 mb-3">
            <PieChart className="w-5 h-5 text-teal-600" />
            Valeur par categorie
          </h3>
          <div className="flex flex-wrap gap-3">
            {valueData.byCategory.sort((a, b) => b.value - a.value).map(cat => {
              const pct = valueData.totalValue > 0 ? (cat.value / valueData.totalValue * 100) : 0;
              return (
                <div key={cat.category} className="flex items-center gap-2 bg-[#FAFAFA] dark:bg-[#171717] rounded-lg px-3 py-2">
                  <span>{CATEGORY_EMOJIS[cat.category] || '📦'}</span>
                  <div>
                    <div className="text-sm font-medium">{cat.category}</div>
                    <div className="text-xs text-[#9CA3AF] dark:text-[#737373]">{cat.value.toFixed(2)} EUR ({pct.toFixed(1)}%)</div>
                  </div>
                  <div className="w-16 h-2 bg-[#E5E7EB] dark:bg-[#171717] rounded-full overflow-hidden">
                    <div className="h-full bg-teal-500 rounded-full" style={{ width: `${pct}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ══════ 5. CATEGORY FILTER TABS ══════ */}
      <div ref={catScrollRef} className="flex gap-2 overflow-x-auto pb-1 scrollbar-none -mx-1 px-1">
        <button
          onClick={() => setFilterCategory('')}
          className={`flex-shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium transition-all ${
            filterCategory === ''
              ? 'bg-[#111111] dark:bg-white text-white dark:text-black shadow-sm'
              : 'bg-[#F3F4F6] dark:bg-[#171717] text-[#6B7280] dark:text-[#A3A3A3] hover:bg-[#E5E7EB] dark:hover:bg-[#262626]'
          }`}
        >
          <Package className="w-3.5 h-3.5" />
          Tout
          <span className={`ml-0.5 text-[11px] px-1.5 py-0 rounded-full ${
            filterCategory === '' ? 'bg-white/20 dark:bg-black/20' : 'bg-[#E5E7EB] dark:bg-[#262626]'
          }`}>
            {items.length}
          </span>
        </button>
        {categoriesWithCounts.map(([cat, count]) => (
          <button
            key={cat}
            onClick={() => setFilterCategory(filterCategory === cat ? '' : cat)}
            className={`flex-shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium transition-all ${
              filterCategory === cat
                ? 'bg-[#111111] dark:bg-white text-white dark:text-black shadow-sm'
                : 'bg-[#F3F4F6] dark:bg-[#171717] text-[#6B7280] dark:text-[#A3A3A3] hover:bg-[#E5E7EB] dark:hover:bg-[#262626]'
            }`}
          >
            <span className="text-sm">{CATEGORY_EMOJIS[cat] || '📦'}</span>
            {cat}
            <span className={`ml-0.5 text-[11px] px-1.5 py-0 rounded-full ${
              filterCategory === cat ? 'bg-white/20 dark:bg-black/20' : 'bg-[#E5E7EB] dark:bg-[#262626]'
            }`}>
              {count}
            </span>
          </button>
        ))}
      </div>

      {/* Search and Filter */}
      <div className="space-y-2">
        <div className="flex flex-col sm:flex-row gap-3">
          <SearchBar
            value={search}
            onChange={setSearch}
            placeholder="Rechercher un ingredient..."
            pageKey="inventory"
            suggestions={inventorySearchSuggestions}
            className="flex-1"
          />
          <select
            value={filterLocation}
            onChange={e => setFilterLocation(e.target.value as LocationType)}
            className="px-3 py-2 rounded-lg border border-[#E5E7EB] dark:border-[#1A1A1A] bg-white dark:bg-[#0A0A0A] text-sm focus:ring-2 focus:ring-teal-500 outline-none"
          >
            <option value="">Tous emplacements</option>
            {LOCATIONS.map(loc => (
              <option key={loc} value={loc}>{loc}</option>
            ))}
          </select>
          {filterAlertOnly && (
            <button
              onClick={() => setFilterAlertOnly(false)}
              className="flex items-center gap-1.5 px-3 py-2 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 text-sm rounded-lg hover:bg-red-200 dark:hover:bg-red-900/50 transition-colors"
            >
              <X className="w-3.5 h-3.5" /> Alertes uniquement
            </button>
          )}
        </div>
        <FilterPanel
          filters={inventoryFilterDefs}
          values={inventoryFilters}
          onFilterChange={setInventoryFilters}
          presetKey="inventory"
        />
      </div>

      {/* ══════ 7. BULK ACTIONS BAR ══════ */}
      {selectedIds.size > 0 && (
        <div className="flex items-center gap-3 px-4 py-3 bg-teal-50 dark:bg-teal-900/20 border border-teal-200 dark:border-teal-800 rounded-2xl">
          <CheckSquare className="w-5 h-5 text-teal-600 dark:text-teal-400" />
          <span className="text-sm font-semibold text-teal-700 dark:text-teal-300">{selectedIds.size} selectionne{selectedIds.size > 1 ? 's' : ''}</span>
          <div className="flex-1" />
          <button
            onClick={handleBulkReorder}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-[#111111] dark:bg-white text-white dark:text-black text-xs font-medium rounded-lg hover:bg-[#333] dark:hover:bg-[#E5E5E5] transition-colors"
          >
            <ShoppingCart className="w-3.5 h-3.5" /> Commander tout
          </button>
          <button
            onClick={handleBulkExportCSV}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-[#F3F4F6] dark:bg-[#171717] text-[#6B7280] dark:text-[#A3A3A3] text-xs font-medium rounded-lg hover:bg-[#E5E7EB] dark:hover:bg-[#262626] transition-colors"
          >
            <Download className="w-3.5 h-3.5" /> Exporter CSV
          </button>
          <button
            onClick={() => setSelectedIds(new Set())}
            className="p-1.5 rounded-lg hover:bg-teal-100 dark:hover:bg-teal-900/40 text-teal-600 dark:text-teal-400 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* ══════ INVENTORY TABLE ══════ */}
      <div className="bg-white dark:bg-[#0A0A0A] rounded-2xl border border-[#E5E7EB] dark:border-[#1A1A1A] overflow-hidden">
        <div className="overflow-x-auto -mx-3 sm:mx-0">
          <table className="w-full text-sm min-w-[800px]">
            <thead>
              <tr className="bg-[#FAFAFA] dark:bg-[#171717] text-left">
                {/* Checkbox column */}
                <th className="px-3 py-3 w-10">
                  <button onClick={toggleSelectAll} className="p-0.5 rounded hover:bg-[#E5E7EB] dark:hover:bg-[#262626] transition-colors">
                    {selectedIds.size === filteredItems.length && filteredItems.length > 0
                      ? <CheckSquare className="w-4 h-4 text-teal-600 dark:text-teal-400" />
                      : <Square className="w-4 h-4 text-[#9CA3AF] dark:text-[#737373]" />
                    }
                  </button>
                </th>
                <th className="px-3 py-3 font-medium cursor-pointer select-none hover:bg-[#F3F4F6] dark:hover:bg-[#171717]" onClick={() => toggleSort('name')}>
                  <span className="flex items-center gap-1">Ingredient <ArrowUpDown className="w-3 h-3" /></span>
                </th>
                <th className="px-3 py-3 font-medium cursor-pointer select-none hover:bg-[#F3F4F6] dark:hover:bg-[#171717]" onClick={() => toggleSort('currentStock')}>
                  <span className="flex items-center gap-1">Stock <ArrowUpDown className="w-3 h-3" /></span>
                </th>
                <th className="px-3 py-3 font-medium w-40">Niveau</th>
                <th className="px-3 py-3 font-medium hidden md:table-cell">Expiration</th>
                <th className="px-3 py-3 font-medium cursor-pointer select-none hover:bg-[#F3F4F6] dark:hover:bg-[#171717] hidden sm:table-cell" onClick={() => toggleSort('value')}>
                  <span className="flex items-center gap-1">Valeur <ArrowUpDown className="w-3 h-3" /></span>
                </th>
                <th className="px-3 py-3 font-medium cursor-pointer select-none hover:bg-[#F3F4F6] dark:hover:bg-[#171717]" onClick={() => toggleSort('status')}>
                  <span className="flex items-center gap-1">Statut <ArrowUpDown className="w-3 h-3" /></span>
                </th>
                <th className="px-3 py-3 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E5E7EB] dark:divide-[#1A1A1A]">
              {filteredItems.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-4 py-8 text-center text-[#9CA3AF] dark:text-[#737373]">
                    {items.length === 0 ? 'Aucun article dans l\'inventaire. Ajoutez des ingredients pour commencer.' : 'Aucun resultat pour cette recherche.'}
                  </td>
                </tr>
              ) : filteredItems.map(item => {
                const status = getStatus(item);
                const value = (item.currentStock / getUnitDivisor(item.ingredient.unit)) * item.ingredient.pricePerUnit;
                const meta = parseMeta(item.notes);
                const expStatus = getExpirationStatus(meta.expirationDate);
                const daysLeft = getDaysUntilExpiry(meta.expirationDate);
                const stockPct = getStockPercent(item);
                const isSelected = selectedIds.has(item.id);
                return (
                  <tr
                    key={item.id}
                    className={`hover:bg-[#FAFAFA] dark:hover:bg-[#171717]/30 transition-colors ${
                      expStatus === 'expired' ? 'bg-red-50/50 dark:bg-red-900/10' : ''
                    } ${isSelected ? 'bg-teal-50/50 dark:bg-teal-900/10' : ''}`}
                  >
                    {/* Checkbox */}
                    <td className="px-3 py-3">
                      <button onClick={() => toggleSelect(item.id)} className="p-0.5 rounded hover:bg-[#E5E7EB] dark:hover:bg-[#262626] transition-colors">
                        {isSelected
                          ? <CheckSquare className="w-4 h-4 text-teal-600 dark:text-teal-400" />
                          : <Square className="w-4 h-4 text-[#D1D5DB] dark:text-[#404040]" />
                        }
                      </button>
                    </td>

                    {/* Ingredient name + meta */}
                    <td className="px-3 py-3">
                      <div className="flex items-center gap-2">
                        <span className="text-lg">{CATEGORY_EMOJIS[item.ingredient.category] || '📦'}</span>
                        <div>
                          <div className="font-medium flex items-center gap-1.5 flex-wrap">
                            {item.ingredient.name}
                            {meta.location && (
                              <span className={`inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded text-[10px] font-medium ${LOCATION_COLORS[meta.location] || 'bg-[#F3F4F6] dark:bg-[#171717] text-[#6B7280] dark:text-[#A3A3A3]'}`}>
                                <MapPin className="w-2.5 h-2.5" /> {meta.location}
                              </span>
                            )}
                          </div>
                          <div className="text-xs text-[#9CA3AF] dark:text-[#737373]">{item.ingredient.category}</div>
                        </div>
                      </div>
                    </td>

                    {/* Stock with inline edit */}
                    <td className="px-3 py-3">
                      {editingStockId === item.id ? (
                        <div className="flex items-center gap-1">
                          <input
                            type="number"
                            value={inlineStock}
                            onChange={e => setInlineStock(e.target.value)}
                            onKeyDown={e => { if (e.key === 'Enter') handleInlineStockSave(item.id); if (e.key === 'Escape') setEditingStockId(null); }}
                            className="w-20 px-2 py-1 text-sm border rounded border-[#E5E7EB] dark:border-[#1A1A1A] dark:bg-[#171717] focus:ring-2 focus:ring-teal-500 outline-none"
                            autoFocus
                            step="0.01"
                          />
                          <button onClick={() => handleInlineStockSave(item.id)} className="text-emerald-600 hover:text-emerald-700">
                            <CheckCircle2 className="w-4 h-4" />
                          </button>
                          <button onClick={() => setEditingStockId(null)} className="text-[#9CA3AF] dark:text-[#737373] hover:text-[#4B5563]">
                            <XCircle className="w-4 h-4" />
                          </button>
                        </div>
                      ) : (
                        <div>
                          <span
                            className="cursor-pointer hover:text-teal-600 transition-colors font-semibold"
                            onClick={() => { setEditingStockId(item.id); setInlineStock(String(item.currentStock)); }}
                            title="Cliquer pour modifier"
                          >
                            {item.currentStock} <span className="text-xs font-normal text-[#9CA3AF] dark:text-[#737373]">{item.unit}</span>
                          </span>
                          <div className="text-[10px] text-[#9CA3AF] dark:text-[#737373]">
                            min {item.minStock}{item.maxStock ? ` / max ${item.maxStock}` : ''}
                          </div>
                        </div>
                      )}
                    </td>

                    {/* ══════ 1. VISUAL STOCK RING ══════ */}
                    <td className="px-3 py-3">
                      <div className="flex items-center gap-2">
                        <ProgressRing
                          value={stockPct}
                          max={100}
                          size={40}
                          strokeWidth={4}
                          animated={true}
                          showPercent={true}
                        />
                        <div className="flex flex-col">
                          <span className={`text-[10px] font-semibold ${stockPct < 20 ? 'text-red-600 dark:text-red-400' : stockPct < 50 ? 'text-amber-600 dark:text-amber-400' : 'text-emerald-600 dark:text-emerald-400'}`}>
                            {status === 'critical' ? 'Critique' : status === 'low' ? 'Bas' : 'OK'}
                          </span>
                          {/* ══════ 4. QUICK RESTOCK BUTTON ══════ */}
                          {quickRestockId === item.id ? (
                            <div className="flex items-center gap-1">
                              <input
                                type="number"
                                value={quickRestockQty}
                                onChange={e => setQuickRestockQty(e.target.value)}
                                onKeyDown={e => { if (e.key === 'Enter') handleQuickRestock(item.id); if (e.key === 'Escape') { setQuickRestockId(null); setQuickRestockQty(''); } }}
                                className="w-14 px-1.5 py-0.5 text-[11px] border rounded border-[#E5E7EB] dark:border-[#1A1A1A] dark:bg-[#171717] focus:ring-1 focus:ring-teal-500 outline-none"
                                placeholder="qty"
                                autoFocus
                                step="0.1"
                              />
                              <button
                                onClick={() => handleQuickRestock(item.id)}
                                className="text-emerald-600 hover:text-emerald-700"
                              >
                                <CheckCircle2 className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={() => { setQuickRestockId(null); setQuickRestockQty(''); }}
                                className="text-[#9CA3AF] hover:text-[#6B7280]"
                              >
                                <XCircle className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          ) : (
                            <button
                              onClick={() => { setQuickRestockId(item.id); setQuickRestockQty(''); }}
                              className="flex items-center gap-0.5 px-1.5 py-0.5 rounded text-[10px] font-medium bg-teal-100 dark:bg-teal-900/30 text-teal-700 dark:text-teal-400 hover:bg-teal-200 dark:hover:bg-teal-900/50 transition-colors"
                              title="Restock rapide"
                            >
                              <Plus className="w-2.5 h-2.5" /> Restock
                            </button>
                          )}
                        </div>
                      </div>
                    </td>

                    {/* ══════ 3. EXPIRY COUNTDOWN ══════ */}
                    <td className="px-3 py-3 hidden md:table-cell">
                      {meta.expirationDate ? (
                        <div className="flex flex-col gap-0.5">
                          {daysLeft !== null && (
                            <span className={`inline-flex items-center gap-1 text-xs font-semibold ${
                              daysLeft <= 0 ? 'text-red-600 dark:text-red-400' :
                              daysLeft <= 3 ? 'text-red-500 dark:text-red-400' :
                              daysLeft <= 7 ? 'text-amber-500 dark:text-amber-400' :
                              'text-emerald-600 dark:text-emerald-400'
                            }`}>
                              <Clock className="w-3 h-3" />
                              {daysLeft <= 0 ? (
                                <span className="px-1.5 py-0.5 rounded bg-red-100 dark:bg-red-900/40 text-red-700 dark:text-red-400 text-[10px] font-bold animate-pulse">
                                  EXPIRE
                                </span>
                              ) : (
                                <>
                                  {daysLeft}j restant{daysLeft > 1 ? 's' : ''}
                                </>
                              )}
                            </span>
                          )}
                          {/* Mini progress bar for expiry */}
                          {daysLeft !== null && daysLeft > 0 && (
                            <div className="w-20 h-1.5 rounded-full bg-[#E5E7EB] dark:bg-[#262626] overflow-hidden">
                              <div
                                className={`h-full rounded-full transition-all ${
                                  daysLeft <= 3 ? 'bg-red-500' : daysLeft <= 7 ? 'bg-amber-500' : 'bg-emerald-500'
                                }`}
                                style={{ width: `${Math.min(100, (daysLeft / 30) * 100)}%` }}
                              />
                            </div>
                          )}
                          <span className="text-[10px] text-[#9CA3AF] dark:text-[#737373]">
                            {new Date(meta.expirationDate).toLocaleDateString('fr-FR')}
                          </span>
                        </div>
                      ) : (
                        <span className="text-xs text-[#D1D5DB] dark:text-[#404040]">---</span>
                      )}
                    </td>

                    {/* Value */}
                    <td className="px-3 py-3 font-medium hidden sm:table-cell">{value.toFixed(2)} EUR</td>

                    {/* Status */}
                    <td className="px-3 py-3">
                      {status === 'ok' && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400">
                          <CheckCircle2 className="w-3 h-3" /> OK
                        </span>
                      )}
                      {status === 'low' && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400">
                          <MinusCircle className="w-3 h-3" /> Bas
                        </span>
                      )}
                      {status === 'critical' && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 animate-pulse">
                          <Flame className="w-3 h-3" /> Critique
                        </span>
                      )}
                    </td>

                    {/* Actions */}
                    <td className="px-3 py-3">
                      <div className="flex items-center justify-end gap-1">
                        <button onClick={() => openWaste(item)} className="p-1.5 rounded hover:bg-red-50 dark:hover:bg-red-900/30 text-red-400 hover:text-red-600 dark:hover:text-red-300 transition-colors" title="Declarer perte">
                          <Trash className="w-4 h-4" />
                        </button>
                        <button onClick={() => setWeighTarget(item)} className="p-1.5 rounded hover:bg-emerald-50 dark:hover:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 transition-colors" title="Peser avec la balance">
                          <Scale className="w-4 h-4" />
                        </button>
                        <button onClick={() => openRestock(item)} className="p-1.5 rounded hover:bg-teal-50 dark:hover:bg-teal-900/30 text-teal-600 dark:text-teal-400 transition-colors" title="Reapprovisionner">
                          <RefreshCw className="w-4 h-4" />
                        </button>
                        <button onClick={() => openEdit(item)} className="p-1.5 rounded hover:bg-[#F3F4F6] dark:hover:bg-[#171717] text-[#9CA3AF] dark:text-[#737373] transition-colors" title="Modifier">
                          <Pencil className="w-4 h-4" />
                        </button>
                        <button onClick={() => setDeleteTarget(item.id)} className="p-1.5 rounded hover:bg-red-50 dark:hover:bg-red-900/30 text-red-500 transition-colors" title="Supprimer">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Modal */}
      <Modal isOpen={showAddModal} onClose={() => setShowAddModal(false)} title="Ajouter a l'inventaire">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Ingredient</label>
            <select
              value={addForm.ingredientId}
              onChange={e => {
                const id = parseInt(e.target.value);
                const ing = suggestions.find(s => s.id === id);
                setAddForm(f => ({ ...f, ingredientId: id, unit: ing?.unit || '' }));
              }}
              className="w-full px-3 py-2 rounded-lg border border-[#E5E7EB] dark:border-[#1A1A1A] bg-white dark:bg-[#171717] text-sm focus:ring-2 focus:ring-teal-500 outline-none"
            >
              <option value={0}>-- Selectionner --</option>
              {suggestions.map(ing => (
                <option key={ing.id} value={ing.id}>{CATEGORY_EMOJIS[ing.category] || ''} {ing.name} ({ing.unit})</option>
              ))}
            </select>
            {suggestions.length === 0 && (
              <p className="text-xs text-[#9CA3AF] dark:text-[#737373] mt-1">Tous les ingredients sont deja dans l'inventaire.</p>
            )}
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium mb-1">Stock initial</label>
              <input
                type="number"
                value={addForm.currentStock}
                onChange={e => setAddForm(f => ({ ...f, currentStock: e.target.value }))}
                className="w-full px-3 py-2 rounded-lg border border-[#E5E7EB] dark:border-[#1A1A1A] bg-white dark:bg-[#171717] text-sm focus:ring-2 focus:ring-teal-500 outline-none"
                placeholder="0"
                step="0.01"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Stock minimum</label>
              <input
                type="number"
                value={addForm.minStock}
                onChange={e => setAddForm(f => ({ ...f, minStock: e.target.value }))}
                className="w-full px-3 py-2 rounded-lg border border-[#E5E7EB] dark:border-[#1A1A1A] bg-white dark:bg-[#171717] text-sm focus:ring-2 focus:ring-teal-500 outline-none"
                placeholder="0"
                step="0.01"
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium mb-1">Date d'expiration</label>
              <input
                type="date"
                value={addForm.expirationDate}
                onChange={e => setAddForm(f => ({ ...f, expirationDate: e.target.value }))}
                className="w-full px-3 py-2 rounded-lg border border-[#E5E7EB] dark:border-[#1A1A1A] bg-white dark:bg-[#171717] text-sm focus:ring-2 focus:ring-teal-500 outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Emplacement</label>
              <select
                value={addForm.location}
                onChange={e => setAddForm(f => ({ ...f, location: e.target.value as LocationType }))}
                className="w-full px-3 py-2 rounded-lg border border-[#E5E7EB] dark:border-[#1A1A1A] bg-white dark:bg-[#171717] text-sm focus:ring-2 focus:ring-teal-500 outline-none"
              >
                <option value="">-- Aucun --</option>
                {LOCATIONS.map(loc => (
                  <option key={loc} value={loc}>{loc}</option>
                ))}
              </select>
            </div>
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <button onClick={() => setShowAddModal(false)} className="px-4 py-2 text-sm rounded-lg border border-[#E5E7EB] dark:border-[#1A1A1A] hover:bg-[#FAFAFA] dark:hover:bg-[#171717] transition-colors">
              Annuler
            </button>
            <button onClick={handleAdd} className="px-4 py-2 text-sm bg-[#111111] dark:bg-white text-white dark:text-black rounded-lg hover:bg-[#333] dark:hover:bg-[#E5E5E5] transition-colors">
              Ajouter
            </button>
          </div>
        </div>
      </Modal>

      {/* Restock Modal */}
      <Modal isOpen={showRestockModal} onClose={() => setShowRestockModal(false)} title={`Reapprovisionner : ${restockForm.name}`}>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Quantite a ajouter</label>
            <input
              type="number"
              value={restockForm.quantity}
              onChange={e => setRestockForm(f => ({ ...f, quantity: e.target.value }))}
              className="w-full px-3 py-2 rounded-lg border border-[#E5E7EB] dark:border-[#1A1A1A] bg-white dark:bg-[#171717] text-sm focus:ring-2 focus:ring-teal-500 outline-none"
              placeholder="Quantite"
              step="0.01"
              autoFocus
            />
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <button onClick={() => setShowRestockModal(false)} className="px-4 py-2 text-sm rounded-lg border border-[#E5E7EB] dark:border-[#1A1A1A] hover:bg-[#FAFAFA] dark:hover:bg-[#171717] transition-colors">
              Annuler
            </button>
            <button onClick={handleRestock} className="px-4 py-2 text-sm bg-[#111111] dark:bg-white text-white dark:text-black rounded-lg hover:bg-[#333] dark:hover:bg-[#E5E5E5] transition-colors">
              Reapprovisionner
            </button>
          </div>
        </div>
      </Modal>

      {/* Edit Modal */}
      <Modal isOpen={showEditModal} onClose={() => setShowEditModal(false)} title="Modifier l'article">
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium mb-1">Stock actuel</label>
              <input
                type="number"
                value={editForm.currentStock}
                onChange={e => setEditForm(f => ({ ...f, currentStock: e.target.value }))}
                className="w-full px-3 py-2 rounded-lg border border-[#E5E7EB] dark:border-[#1A1A1A] bg-white dark:bg-[#171717] text-sm focus:ring-2 focus:ring-teal-500 outline-none"
                step="0.01"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Unite</label>
              <input
                type="text"
                value={editForm.unit}
                onChange={e => setEditForm(f => ({ ...f, unit: e.target.value }))}
                className="w-full px-3 py-2 rounded-lg border border-[#E5E7EB] dark:border-[#1A1A1A] bg-white dark:bg-[#171717] text-sm focus:ring-2 focus:ring-teal-500 outline-none"
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium mb-1">Stock minimum</label>
              <input
                type="number"
                value={editForm.minStock}
                onChange={e => setEditForm(f => ({ ...f, minStock: e.target.value }))}
                className="w-full px-3 py-2 rounded-lg border border-[#E5E7EB] dark:border-[#1A1A1A] bg-white dark:bg-[#171717] text-sm focus:ring-2 focus:ring-teal-500 outline-none"
                step="0.01"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Stock maximum</label>
              <input
                type="number"
                value={editForm.maxStock}
                onChange={e => setEditForm(f => ({ ...f, maxStock: e.target.value }))}
                className="w-full px-3 py-2 rounded-lg border border-[#E5E7EB] dark:border-[#1A1A1A] bg-white dark:bg-[#171717] text-sm focus:ring-2 focus:ring-teal-500 outline-none"
                step="0.01"
                placeholder="Optionnel"
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium mb-1">Date d'expiration</label>
              <input
                type="date"
                value={editForm.expirationDate}
                onChange={e => setEditForm(f => ({ ...f, expirationDate: e.target.value }))}
                className="w-full px-3 py-2 rounded-lg border border-[#E5E7EB] dark:border-[#1A1A1A] bg-white dark:bg-[#171717] text-sm focus:ring-2 focus:ring-teal-500 outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Emplacement</label>
              <select
                value={editForm.location}
                onChange={e => setEditForm(f => ({ ...f, location: e.target.value as LocationType }))}
                className="w-full px-3 py-2 rounded-lg border border-[#E5E7EB] dark:border-[#1A1A1A] bg-white dark:bg-[#171717] text-sm focus:ring-2 focus:ring-teal-500 outline-none"
              >
                <option value="">-- Aucun --</option>
                {LOCATIONS.map(loc => (
                  <option key={loc} value={loc}>{loc}</option>
                ))}
              </select>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Notes</label>
            <textarea
              value={editForm.notes}
              onChange={e => setEditForm(f => ({ ...f, notes: e.target.value }))}
              className="w-full px-3 py-2 rounded-lg border border-[#E5E7EB] dark:border-[#1A1A1A] bg-white dark:bg-[#171717] text-sm focus:ring-2 focus:ring-teal-500 outline-none"
              rows={2}
              placeholder="Notes optionnelles..."
            />
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <button onClick={() => setShowEditModal(false)} className="px-4 py-2 text-sm rounded-lg border border-[#E5E7EB] dark:border-[#1A1A1A] hover:bg-[#FAFAFA] dark:hover:bg-[#171717] transition-colors">
              Annuler
            </button>
            <button onClick={handleEdit} className="px-4 py-2 text-sm bg-[#111111] dark:bg-white text-white dark:text-black rounded-lg hover:bg-[#333] dark:hover:bg-[#E5E5E5] transition-colors">
              Enregistrer
            </button>
          </div>
        </div>
      </Modal>

      {/* Waste Modal */}
      <Modal isOpen={showWasteModal} onClose={() => setShowWasteModal(false)} title={`Declarer perte : ${wasteForm.ingredientName}`}>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Quantite perdue ({wasteForm.unit})</label>
            <input
              type="number"
              value={wasteForm.quantity}
              onChange={e => setWasteForm(f => ({ ...f, quantity: e.target.value }))}
              className="w-full px-3 py-2 rounded-lg border border-[#E5E7EB] dark:border-[#1A1A1A] bg-white dark:bg-[#171717] text-sm focus:ring-2 focus:ring-teal-500 outline-none"
              placeholder="Quantite"
              step="0.01"
              autoFocus
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Raison</label>
            <select
              value={wasteForm.reason}
              onChange={e => setWasteForm(f => ({ ...f, reason: e.target.value }))}
              className="w-full px-3 py-2 rounded-lg border border-[#E5E7EB] dark:border-[#1A1A1A] bg-white dark:bg-[#171717] text-sm focus:ring-2 focus:ring-teal-500 outline-none"
            >
              {WASTE_REASONS.map(r => (
                <option key={r.value} value={r.value}>{r.label}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Notes (optionnel)</label>
            <textarea
              value={wasteForm.notes}
              onChange={e => setWasteForm(f => ({ ...f, notes: e.target.value }))}
              className="w-full px-3 py-2 rounded-lg border border-[#E5E7EB] dark:border-[#1A1A1A] bg-white dark:bg-[#171717] text-sm focus:ring-2 focus:ring-teal-500 outline-none"
              rows={2}
              placeholder="Details supplementaires..."
            />
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <button onClick={() => setShowWasteModal(false)} className="px-4 py-2 text-sm rounded-lg border border-[#E5E7EB] dark:border-[#1A1A1A] hover:bg-[#FAFAFA] dark:hover:bg-[#171717] transition-colors">
              Annuler
            </button>
            <button onClick={handleWasteSubmit} className="px-4 py-2 text-sm bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center gap-1.5">
              <Trash className="w-4 h-4" /> Declarer perte
            </button>
          </div>
        </div>
      </Modal>

      {/* Weigh Modal */}
      {weighTarget && (
        <WeighModal
          isOpen={!!weighTarget}
          onClose={() => setWeighTarget(null)}
          ingredientId={weighTarget.ingredientId}
          ingredientName={weighTarget.ingredient.name}
          currentStock={weighTarget.currentStock}
          unit={weighTarget.unit}
          pricePerUnit={weighTarget.ingredient.pricePerUnit}
          onComplete={handleWeighComplete}
        />
      )}

      {/* Barcode Scanner Modal */}
      {showScanner && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/80">
          <div className="bg-white dark:bg-[#0A0A0A] rounded-2xl border border-[#E5E7EB] dark:border-[#1A1A1A] w-full max-w-lg mx-4 overflow-hidden">
            <div className="flex items-center justify-between px-4 py-3 border-b border-[#E5E7EB] dark:border-[#1A1A1A]">
              <h3 className="font-semibold flex items-center gap-2">
                <Camera className="w-5 h-5" /> Scanner un code-barres
              </h3>
              <button onClick={closeScanner} className="p-1 rounded hover:bg-[#F3F4F6] dark:hover:bg-[#171717] transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-4 space-y-3">
              {scannerError ? (
                <div className="flex flex-col items-center gap-3 py-8">
                  <XOctagon className="w-12 h-12 text-red-500" />
                  <p className="text-sm text-center text-red-600 dark:text-red-400">{scannerError}</p>
                  {!scannerSupported && (
                    <div className="text-center space-y-2">
                      <p className="text-xs text-[#9CA3AF] dark:text-[#737373]">
                        Navigateurs compatibles : Chrome 83+, Edge 83+, Opera 69+
                      </p>
                      <div className="mt-3">
                        <label className="block text-sm font-medium mb-1">Saisie manuelle du code-barres</label>
                        <div className="flex gap-2">
                          <input
                            type="text"
                            inputMode="numeric"
                            placeholder="Ex: 3017620422003"
                            value={lastScannedBarcode}
                            onChange={e => setLastScannedBarcode(e.target.value)}
                            className="flex-1 px-3 py-2 rounded-lg border border-[#E5E7EB] dark:border-[#1A1A1A] bg-white dark:bg-[#171717] text-sm focus:ring-2 focus:ring-[#111111] dark:focus:ring-white outline-none"
                            autoFocus
                            onKeyDown={e => { if (e.key === 'Enter' && lastScannedBarcode.trim()) { closeScanner(); handleBarcodeDetected(lastScannedBarcode.trim()); } }}
                          />
                          <button
                            onClick={() => { if (lastScannedBarcode.trim()) { closeScanner(); handleBarcodeDetected(lastScannedBarcode.trim()); } }}
                            className="px-4 py-2 text-sm bg-[#111111] dark:bg-white text-white dark:text-black rounded-lg hover:bg-[#333] dark:hover:bg-[#E5E5E5] transition-colors"
                          >
                            Rechercher
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <>
                  <div className="relative bg-black rounded-lg overflow-hidden aspect-video">
                    <video
                      ref={videoRef}
                      className="w-full h-full object-cover"
                      playsInline
                      muted
                    />
                    {/* Scan overlay */}
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                      <div className="w-64 h-32 border-2 border-white/60 rounded-lg">
                        <div className="w-full h-0.5 bg-white/80 animate-pulse mt-[50%]" />
                      </div>
                    </div>
                  </div>
                  <p className="text-xs text-center text-[#9CA3AF] dark:text-[#737373]">
                    Placez le code-barres dans le cadre. La detection est automatique.
                  </p>
                  {lastScannedBarcode && (
                    <div className="text-center text-sm font-mono bg-[#F3F4F6] dark:bg-[#171717] rounded-lg px-3 py-2">
                      Dernier code : {lastScannedBarcode}
                    </div>
                  )}
                  {/* Manual fallback input */}
                  <div className="border-t border-[#E5E7EB] dark:border-[#1A1A1A] pt-3 mt-2">
                    <label className="block text-xs text-[#9CA3AF] dark:text-[#737373] mb-1">Ou saisir manuellement</label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        inputMode="numeric"
                        placeholder="Code-barres..."
                        value={lastScannedBarcode}
                        onChange={e => setLastScannedBarcode(e.target.value)}
                        className="flex-1 px-3 py-2 rounded-lg border border-[#E5E7EB] dark:border-[#1A1A1A] bg-white dark:bg-[#171717] text-sm focus:ring-2 focus:ring-[#111111] dark:focus:ring-white outline-none"
                        onKeyDown={e => { if (e.key === 'Enter' && lastScannedBarcode.trim()) { closeScanner(); handleBarcodeDetected(lastScannedBarcode.trim()); } }}
                      />
                      <button
                        onClick={() => { if (lastScannedBarcode.trim()) { closeScanner(); handleBarcodeDetected(lastScannedBarcode.trim()); } }}
                        disabled={!lastScannedBarcode.trim()}
                        className="px-4 py-2 text-sm bg-[#111111] dark:bg-white text-white dark:text-black rounded-lg hover:bg-[#333] dark:hover:bg-[#E5E5E5] transition-colors disabled:opacity-50"
                      >
                        OK
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Auto-Reorder Modal */}
      <Modal isOpen={showReorderModal} onClose={() => setShowReorderModal(false)} title="Reapprovisionnement automatique" className="max-w-3xl">
        {reorderLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-[#111111] dark:text-white" />
          </div>
        ) : reorderGroups.length === 0 ? (
          <div className="text-center py-12">
            <CheckCircle2 className="w-12 h-12 mx-auto mb-3 text-emerald-600 dark:text-emerald-400" />
            <p className="text-lg font-semibold">Tous les stocks sont suffisants</p>
            <p className="text-sm text-[#9CA3AF] dark:text-[#737373] mt-1">Aucun article en dessous du seuil minimum</p>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Summary */}
            <div className="flex items-center justify-between px-4 py-3 bg-[#F3F4F6] dark:bg-[#171717] rounded-xl">
              <div>
                <span className="text-sm text-[#9CA3AF] dark:text-[#737373]">Total estime</span>
                <p className="text-xl font-bold">
                  {reorderGroups.reduce((sum, g) => sum + getGroupEstimatedCost(g), 0).toFixed(2)} EUR
                </p>
              </div>
              <div className="text-right">
                <span className="text-sm text-[#9CA3AF] dark:text-[#737373]">{reorderGroups.length} fournisseur{reorderGroups.length > 1 ? 's' : ''}</span>
                <p className="text-sm font-medium">{reorderGroups.reduce((sum, g) => sum + g.items.length, 0)} article{reorderGroups.reduce((sum, g) => sum + g.items.length, 0) > 1 ? 's' : ''}</p>
              </div>
            </div>

            {/* Per-supplier groups */}
            {reorderGroups.map(group => (
              <div key={group.supplier} className="border border-[#E5E7EB] dark:border-[#1A1A1A] rounded-xl overflow-hidden">
                {/* Supplier header */}
                <button
                  onClick={() => toggleSupplier(group.supplier)}
                  className="w-full flex items-center justify-between px-4 py-3 bg-white dark:bg-[#0A0A0A] hover:bg-[#F9FAFB] dark:hover:bg-[#111111] transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-[#111111] dark:bg-white text-white dark:text-black flex items-center justify-center text-sm font-bold">
                      {group.supplier.charAt(0).toUpperCase()}
                    </div>
                    <div className="text-left">
                      <p className="font-semibold text-sm">{group.supplier}</p>
                      <p className="text-xs text-[#9CA3AF] dark:text-[#737373]">{group.items.length} article{group.items.length > 1 ? 's' : ''}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-semibold">{getGroupEstimatedCost(group).toFixed(2)} EUR</span>
                    {expandedSuppliers.has(group.supplier) ? <ChevronUp className="w-4 h-4 text-[#9CA3AF]" /> : <ChevronDown className="w-4 h-4 text-[#9CA3AF]" />}
                  </div>
                </button>

                {/* Items table */}
                {expandedSuppliers.has(group.supplier) && (
                  <div className="border-t border-[#E5E7EB] dark:border-[#1A1A1A]">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="text-[#9CA3AF] dark:text-[#737373] text-xs border-b border-[#E5E7EB] dark:border-[#1A1A1A]">
                          <th className="text-left px-4 py-2 font-medium">Ingredient</th>
                          <th className="text-right px-2 py-2 font-medium">Stock</th>
                          <th className="text-right px-2 py-2 font-medium">Min</th>
                          <th className="text-center px-2 py-2 font-medium">Qte commande</th>
                          <th className="text-right px-4 py-2 font-medium">Cout est.</th>
                        </tr>
                      </thead>
                      <tbody>
                        {group.items.map(item => {
                          const editedQty = getEditedQty(group.supplier, item.ingredientId);
                          const ratio = item.suggestedQty > 0 ? editedQty / item.suggestedQty : 0;
                          const cost = item.estimatedCost * ratio;
                          return (
                            <tr key={item.ingredientId} className="border-b border-[#E5E7EB] dark:border-[#1A1A1A] last:border-b-0">
                              <td className="px-4 py-2.5">
                                <span className="font-medium">{item.ingredient}</span>
                                <span className="text-[#9CA3AF] dark:text-[#737373] ml-1 text-xs">({item.unit})</span>
                              </td>
                              <td className="text-right px-2 py-2.5">
                                <span className={item.currentStock <= 0 ? 'text-red-600 dark:text-red-400 font-semibold' : 'text-amber-600 dark:text-amber-400'}>
                                  {item.currentStock}
                                </span>
                              </td>
                              <td className="text-right px-2 py-2.5 text-[#9CA3AF] dark:text-[#737373]">{item.minQuantity}</td>
                              <td className="text-center px-2 py-2.5">
                                <input
                                  type="number"
                                  min="0"
                                  step="0.1"
                                  value={editedQty}
                                  onChange={e => setEditedQty(group.supplier, item.ingredientId, parseFloat(e.target.value) || 0)}
                                  className="w-20 text-center px-2 py-1 rounded-lg border border-[#E5E7EB] dark:border-[#333333] bg-white dark:bg-[#171717] text-sm font-medium focus:ring-2 focus:ring-[#111111] dark:focus:ring-white outline-none"
                                />
                              </td>
                              <td className="text-right px-4 py-2.5 font-medium">{cost.toFixed(2)} EUR</td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>

                    {/* Per-supplier order button */}
                    <div className="px-4 py-3 bg-[#F9FAFB] dark:bg-[#0A0A0A] border-t border-[#E5E7EB] dark:border-[#1A1A1A] flex items-center justify-between">
                      <span className="text-sm font-semibold">Sous-total : {getGroupEstimatedCost(group).toFixed(2)} EUR</span>
                      <button
                        onClick={() => handleConfirmReorder(group.supplier)}
                        disabled={reorderConfirming}
                        className="flex items-center gap-1.5 px-4 py-2 bg-[#111111] dark:bg-white text-white dark:text-black text-sm font-medium rounded-lg hover:bg-[#333] dark:hover:bg-[#E5E5E5] transition-colors disabled:opacity-50"
                      >
                        {reorderConfirming ? <Loader2 className="w-4 h-4 animate-spin" /> : <ShoppingCart className="w-4 h-4" />}
                        Commander
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}

            {/* Global order all button */}
            <div className="pt-2 border-t border-[#E5E7EB] dark:border-[#1A1A1A]">
              <button
                onClick={() => handleConfirmReorder()}
                disabled={reorderConfirming}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-[#111111] dark:bg-white text-white dark:text-black text-sm font-semibold rounded-xl hover:bg-[#333] dark:hover:bg-[#E5E5E5] transition-colors disabled:opacity-50"
              >
                {reorderConfirming ? <Loader2 className="w-4 h-4 animate-spin" /> : <ShoppingCart className="w-4 h-4" />}
                Commander tout ({reorderGroups.reduce((sum, g) => sum + getGroupEstimatedCost(g), 0).toFixed(2)} EUR)
              </button>
            </div>
          </div>
        )}
      </Modal>

      {/* Delete Confirm */}
      <ConfirmDialog
        isOpen={deleteTarget !== null}
        title="Supprimer de l'inventaire"
        message="Etes-vous sur de vouloir supprimer cet article de l'inventaire ? Cette action est irreversible."
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
}
