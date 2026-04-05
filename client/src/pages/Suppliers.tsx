import { useState, useEffect, useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Truck, Package, Search, ExternalLink, Check, X, Filter, Globe, MapPin,
  Tag, Building2, Plus, Edit2, Trash2, Link2, Phone, Mail, ChevronDown, ShoppingBag,
  ChevronRight, ToggleLeft, ToggleRight, Euro, BarChart3, ShoppingCart,
  Star, Clock, ArrowRightLeft, Zap, Scale, Award, AlertTriangle, Layers, TrendingUp,
  MessageCircle, Upload, Download, FileSpreadsheet, CheckCircle, AlertCircle,
} from 'lucide-react';
import {
  fetchSuppliers, createSupplier, updateSupplier, deleteSupplier,
  linkSupplierIngredients, fetchIngredients, updateIngredient, createIngredient,
  fetchSupplierScore, fetchAllSupplierScores, importSupplierPrices,
} from '../services/api';
import type { SupplierScoreBreakdown, ImportPricesResult } from '../services/api';
import type { Supplier, Ingredient } from '../types';

type SupplierIngredient = Pick<Ingredient, 'id' | 'name' | 'unit' | 'pricePerUnit' | 'category'>;
import { INGREDIENT_CATEGORIES } from '../types';
import {
  FRENCH_REGIONS,
  SUPPLIER_CATEGORIES,
  searchSuppliers,
} from '../data/frenchSuppliers';
import type { FrenchSupplier } from '../data/frenchSuppliers';
import { searchCatalog, loadFullCatalog, type CatalogProduct } from '../data/productCatalog';
import Modal from '../components/Modal';
import ConfirmDialog from '../components/ConfirmDialog';
import { useToast } from '../hooks/useToast';
import { useTranslation } from '../hooks/useTranslation';
import { useRestaurant } from '../hooks/useRestaurant';

// ── helpers ──────────────────────────────────────────────────────────────────

const TYPE_COLORS: Record<FrenchSupplier['type'], { bg: string; text: string; label: string }> = {
  grossiste: { bg: 'bg-teal-100 dark:bg-teal-900/40', text: 'text-teal-700 dark:text-teal-300', label: 'Grossiste' },
  specialiste: { bg: 'bg-purple-100 dark:bg-purple-900/40', text: 'text-purple-700 dark:text-purple-300', label: 'Spécialiste' },
  local: { bg: 'bg-green-100 dark:bg-green-900/40', text: 'text-green-700 dark:text-green-300', label: 'Local' },
  national: { bg: 'bg-orange-100 dark:bg-orange-900/40', text: 'text-orange-700 dark:text-orange-300', label: 'National' },
};

type TabId = 'mes-fournisseurs' | 'annuaire' | 'comparateur';

interface SupplierFormData {
  name: string;
  contactName: string;
  phone: string;
  email: string;
  whatsappPhone: string;
  address: string;
  postalCode: string;
  city: string;
  region: string;
  country: string;
  siret: string;
  website: string;
  categories: string[];
  delivery: boolean;
  minOrder: string;
  paymentTerms: string;
  notes: string;
}

const emptyForm: SupplierFormData = {
  name: '',
  contactName: '',
  phone: '',
  email: '',
  whatsappPhone: '',
  address: '',
  postalCode: '',
  city: '',
  region: '',
  country: 'France',
  siret: '',
  website: '',
  categories: [],
  delivery: false,
  minOrder: '',
  paymentTerms: '',
  notes: '',
};

// ── Mock data: supplier ratings ──────────────────────────────────────────────

interface SupplierRating {
  reliability: number; // 1-5 stars
  deliveryDays: string;
  minOrderAmount: string;
}

function getMockRating(supplierId: number): SupplierRating {
  return { reliability: 0, deliveryDays: '-', minOrderAmount: '-' };
}

function getMockPriceHistory(basePrice: number): number[] {
  return [];
}

// ── Mini sparkline chart (SVG) ──────────────────────────────────────────────

function MiniPriceChart({ data, width = 200, height = 50 }: { data: number[]; width?: number; height?: number }) {
  if (data.length < 2) return null;
  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;
  const points = data.map((v, i) => {
    const x = (i / (data.length - 1)) * width;
    const y = height - ((v - min) / range) * (height - 4) - 2;
    return `${x},${y}`;
  }).join(' ');
  const trend = data[data.length - 1] - data[0];
  const color = trend > 0 ? '#ef4444' : '#22c55e';
  return (
    <svg width={width} height={height} className="block">
      <polyline fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" points={points} />
      <circle cx={(data.length - 1) / (data.length - 1) * width} cy={height - ((data[data.length - 1] - min) / range) * (height - 4) - 2} r="2.5" fill={color} />
    </svg>
  );
}

// ── Quick-add templates ─────────────────────────────────────────────────────

const QUICK_ADD_TEMPLATES: { name: string; data: Partial<SupplierFormData> }[] = [
  { name: 'Metro', data: { name: 'Metro Cash & Carry', website: 'https://www.metro.fr', categories: ['Viandes', 'Poissons & Fruits de mer', 'Légumes', 'Fruits', 'Produits laitiers', 'Épices & Condiments', 'Féculents & Céréales'], delivery: true, minOrder: '0 EUR', paymentTerms: 'Comptant / 30 jours', notes: 'Grossiste généraliste - carte Metro requise' } },
  { name: 'Transgourmet', data: { name: 'Transgourmet', website: 'https://www.transgourmet.fr', categories: ['Viandes', 'Poissons & Fruits de mer', 'Légumes', 'Produits laitiers', 'Féculents & Céréales'], delivery: true, minOrder: '150 EUR', paymentTerms: '30 jours fin de mois', notes: 'Livraison professionnelle' } },
  { name: 'Pomona', data: { name: 'Pomona', website: 'https://www.pomona.fr', categories: ['Légumes', 'Fruits'], delivery: true, minOrder: '100 EUR', paymentTerms: '30 jours', notes: 'Spécialiste fruits et légumes frais' } },
  { name: 'Sysco', data: { name: 'Sysco France', website: 'https://www.sysco.fr', categories: ['Viandes', 'Poissons & Fruits de mer', 'Légumes', 'Produits laitiers', 'Féculents & Céréales', 'Huiles & Matières grasses'], delivery: true, minOrder: '200 EUR', paymentTerms: '30 jours fin de mois', notes: 'Distribution alimentaire multiservice' } },
  { name: 'Brake', data: { name: 'Brake France', website: 'https://www.brake.fr', categories: ['Viandes', 'Poissons & Fruits de mer', 'Légumes', 'Produits laitiers'], delivery: true, minOrder: '150 EUR', paymentTerms: '30 jours', notes: 'Surgelés et frais, livraison nationale' } },
  { name: 'Davigel', data: { name: 'Davigel', website: 'https://www.davigel.fr', categories: ['Poissons & Fruits de mer', 'Légumes', 'Féculents & Céréales'], delivery: true, minOrder: '200 EUR', paymentTerms: '30 jours fin de mois', notes: 'Spécialiste surgelés professionnels' } },
  { name: 'Promocash', data: { name: 'Promocash', website: 'https://www.promocash.com', categories: ['Viandes', 'Légumes', 'Fruits', 'Produits laitiers', 'Boissons', 'Épices & Condiments'], delivery: false, minOrder: '0 EUR', paymentTerms: 'Comptant', notes: 'Cash & Carry, libre-service professionnel' } },
];

function supplierToForm(s: Supplier): SupplierFormData {
  return {
    name: s.name,
    contactName: s.contactName || '',
    phone: s.phone || '',
    email: s.email || '',
    whatsappPhone: s.whatsappPhone || '',
    address: s.address || '',
    postalCode: s.postalCode || '',
    city: s.city || '',
    region: s.region || '',
    country: s.country || 'France',
    siret: s.siret || '',
    website: s.website || '',
    categories: s.categories || [],
    delivery: s.delivery,
    minOrder: s.minOrder || '',
    paymentTerms: s.paymentTerms || '',
    notes: s.notes || '',
  };
}

// ── Circular Score Indicator (SVG) ──────────────────────────────────────────

function CircularScore({ score, size = 48, strokeWidth = 4 }: { score: number; size?: number; strokeWidth?: number }) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const progress = Math.max(0, Math.min(100, score));
  const offset = circumference - (progress / 100) * circumference;
  const color = score > 70 ? '#14b8a6' : score >= 40 ? '#f59e0b' : '#ef4444';
  const bgColor = score > 70 ? 'rgba(20,184,166,0.15)' : score >= 40 ? 'rgba(245,158,11,0.15)' : 'rgba(239,68,68,0.15)';

  return (
    <div className="relative inline-flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="transform -rotate-90">
        <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke="currentColor" strokeWidth={strokeWidth} className="text-[#374151]/30" />
        <circle
          cx={size / 2} cy={size / 2} r={radius} fill="none"
          stroke={color} strokeWidth={strokeWidth} strokeLinecap="round"
          strokeDasharray={circumference} strokeDashoffset={offset}
          style={{ transition: 'stroke-dashoffset 0.8s ease-in-out' }}
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-xs font-bold" style={{ color }}>{score}</span>
      </div>
    </div>
  );
}

// ── Score Bar (horizontal) ─────────────────────────────────────────────────

function ScoreBar({ label, score, icon }: { label: string; score: number; icon: React.ReactNode }) {
  const color = score > 70 ? 'bg-teal-500' : score >= 40 ? 'bg-amber-500' : 'bg-red-500';
  const textColor = score > 70 ? 'text-teal-400' : score >= 40 ? 'text-amber-400' : 'text-red-400';

  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between text-xs">
        <span className="flex items-center gap-1.5 text-[#9CA3AF] dark:text-[#737373]">
          {icon}
          {label}
        </span>
        <span className={`font-bold ${textColor}`}>{score}/100</span>
      </div>
      <div className="h-2 bg-[#E5E7EB] dark:bg-[#1A1A1A] rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full ${color}`}
          style={{ width: `${Math.max(2, score)}%`, transition: 'width 0.8s ease-in-out' }}
        />
      </div>
    </div>
  );
}

// ── Component ────────────────────────────────────────────────────────────────

export default function Suppliers() {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const { t } = useTranslation();
  const { selectedRestaurant, loading: restaurantLoading } = useRestaurant();

  // Tab
  const [activeTab, setActiveTab] = useState<TabId>('mes-fournisseurs');

  // Data
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [ingredients, setIngredients] = useState<Ingredient[]>([]);
  const [loading, setLoading] = useState(true);

  // Mes fournisseurs filters
  const [search, setSearch] = useState('');
  const [filterRegion, setFilterRegion] = useState('');
  const [filterCategory, setFilterCategory] = useState('');

  // Form / delete
  const [modalOpen, setModalOpen] = useState(false);
  const [editingSupplier, setEditingSupplier] = useState<Supplier | null>(null);
  const [form, setForm] = useState<SupplierFormData>(emptyForm);
  const [saving, setSaving] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<Supplier | null>(null);
  const [linking, setLinking] = useState<number | null>(null);

  // Annuaire filters
  const [annuaireSearch, setAnnuaireSearch] = useState('');
  const [annuaireRegion, setAnnuaireRegion] = useState('');
  const [annuaireCategory, setAnnuaireCategory] = useState('');
  const [annuaireType, setAnnuaireType] = useState<'' | FrenchSupplier['type']>('');
  const [deliveryOnly, setDeliveryOnly] = useState(false);

  // Interactive ingredient management
  const [editingPrice, setEditingPrice] = useState<{ id: number; value: string } | null>(null);
  const [ingSearch, setIngSearch] = useState('');
  const [compareIds, setCompareIds] = useState<Set<number>>(new Set());
  const [showCompare, setShowCompare] = useState(false);

  // Supplier comparison (top-level, cross-supplier)
  const [compareSupplierIds, setCompareSupplierIds] = useState<Set<number>>(new Set());
  const [showSupplierCompare, setShowSupplierCompare] = useState(false);

  // Supplier detail view
  const [detailSupplier, setDetailSupplier] = useState<Supplier | null>(null);

  // Supplier scoring
  const [backendScores, setBackendScores] = useState<Record<number, SupplierScoreBreakdown>>({});
  const [detailScore, setDetailScore] = useState<SupplierScoreBreakdown | null>(null);
  const [loadingScore, setLoadingScore] = useState(false);
  const [showScoreCompare, setShowScoreCompare] = useState(false);
  const [expandedScoreId, setExpandedScoreId] = useState<number | null>(null);

  // Quick-add from templates
  const [showQuickAdd, setShowQuickAdd] = useState(false);

  // CSV Price Import modal
  const [showImportModal, setShowImportModal] = useState(false);
  const [importFile, setImportFile] = useState<File | null>(null);
  const [importCsvText, setImportCsvText] = useState('');
  const [importPreview, setImportPreview] = useState<string[][]>([]);
  const [importLoading, setImportLoading] = useState(false);
  const [importResult, setImportResult] = useState<ImportPricesResult | null>(null);
  const [dragOver, setDragOver] = useState(false);

  // Catalogue Transgourmet
  const [catalogData, setCatalogData] = useState<CatalogProduct[]>([]);
  const [catalogSearch, setCatalogSearch] = useState('');
  const [catalogCat, setCatalogCat] = useState('');
  const [catalogPage, setCatalogPage] = useState(0);
  const [catalogSelected, setCatalogSelected] = useState<Set<number>>(new Set());
  const [addingCatalog, setAddingCatalog] = useState(false);

  // Load catalog for annuaire
  useEffect(() => {
    loadFullCatalog().then(setCatalogData).catch(() => {});
  }, []);

  // ── data loading ───────────────────────────────────────────────────────────

  const loadData = useCallback(async () => {
    if (restaurantLoading || !selectedRestaurant) return;
    try {
      const [s, i] = await Promise.all([fetchSuppliers(), fetchIngredients()]);
      setSuppliers(s);
      setIngredients(i);
    } catch {
      showToast(t('suppliers.loadError'), 'error');
    } finally {
      setLoading(false);
    }
  }, [showToast, selectedRestaurant, restaurantLoading]);

  useEffect(() => { loadData(); }, [loadData]);

  // Load all supplier scores from backend
  useEffect(() => {
    if (suppliers.length === 0) return;
    fetchAllSupplierScores()
      .then((allScores) => {
        const map: Record<number, SupplierScoreBreakdown> = {};
        allScores.forEach((s) => { map[s.supplierId] = s; });
        setBackendScores(map);
      })
      .catch(() => {});
  }, [suppliers]);

  // Load detailed score when selecting a supplier
  useEffect(() => {
    if (!detailSupplier) { setDetailScore(null); return; }
    setLoadingScore(true);
    fetchSupplierScore(detailSupplier.id)
      .then(setDetailScore)
      .catch(() => setDetailScore(null))
      .finally(() => setLoadingScore(false));
  }, [detailSupplier?.id]);

  // ── Mes fournisseurs: stats ────────────────────────────────────────────────

  const stats = useMemo(() => {
    const totalSuppliers = suppliers.length;
    const totalLinked = suppliers.reduce((n, s) => n + (s._count?.ingredients ?? 0), 0);
    const withDelivery = suppliers.filter((s) => s.delivery).length;
    const withoutSupplier = ingredients.filter((i) => !i.supplierId).length;
    return { totalSuppliers, totalLinked, withDelivery, withoutSupplier };
  }, [suppliers, ingredients]);

  // ── Mes fournisseurs: filtering ────────────────────────────────────────────

  const filtered = useMemo(() => {
    return suppliers.filter((s) => {
      if (search && !s.name.toLowerCase().includes(search.toLowerCase())) return false;
      if (filterRegion && s.region !== filterRegion) return false;
      if (filterCategory && !(s.categories || []).includes(filterCategory)) return false;
      return true;
    });
  }, [suppliers, search, filterRegion, filterCategory]);

  // ── CRUD handlers ──────────────────────────────────────────────────────────

  function openAdd() {
    setEditingSupplier(null);
    setForm(emptyForm);
    setModalOpen(true);
  }

  function openEdit(s: Supplier) {
    setEditingSupplier(s);
    setForm(supplierToForm(s));
    setModalOpen(true);
  }

  async function handleSave() {
    if (!form.name.trim()) {
      showToast(t('suppliers.nameRequired'), 'error');
      return;
    }
    setSaving(true);
    try {
      const payload = {
        ...form,
        contactName: form.contactName || null,
        phone: form.phone || null,
        email: form.email || null,
        whatsappPhone: form.whatsappPhone || null,
        address: form.address || null,
        postalCode: form.postalCode || null,
        city: form.city || null,
        region: form.region || null,
        siret: form.siret || null,
        website: form.website || null,
        minOrder: form.minOrder || null,
        paymentTerms: form.paymentTerms || null,
        notes: form.notes || null,
      };
      if (editingSupplier) {
        await updateSupplier(editingSupplier.id, payload);
        showToast(t('suppliers.updated'), 'success');
      } else {
        await createSupplier(payload as Omit<Supplier, 'id' | 'createdAt' | 'updatedAt' | '_count' | 'ingredients'>);
        showToast(t('suppliers.created'), 'success');
      }
      setModalOpen(false);
      await loadData();
    } catch (e: unknown) {
      const message = e instanceof Error ? e.message : t('suppliers.error');
      showToast(message, 'error');
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    if (!deleteTarget) return;
    try {
      await deleteSupplier(deleteTarget.id);
      showToast(t('suppliers.deleted'), 'success');
      setDeleteTarget(null);
      await loadData();
    } catch (e: unknown) {
      const message = e instanceof Error ? e.message : t('suppliers.error');
      showToast(message, 'error');
    }
  }

  async function handleLink(s: Supplier) {
    setLinking(s.id);
    try {
      const result = await linkSupplierIngredients(s.id);
      showToast(`${result.linked} ${t('suppliers.ingredientsLinkedTo')} ${result.supplierName}`, 'success');
      await loadData();
    } catch (e: unknown) {
      const message = e instanceof Error ? e.message : t('suppliers.error');
      showToast(message, 'error');
    } finally {
      setLinking(null);
    }
  }

  // ── CSV Price Import helpers ────────────────────────────────────────────────

  function resetImportState() {
    setImportFile(null);
    setImportCsvText('');
    setImportPreview([]);
    setImportResult(null);
    setDragOver(false);
  }

  function openImportModal() {
    resetImportState();
    setShowImportModal(true);
  }

  function closeImportModal() {
    setShowImportModal(false);
    resetImportState();
  }

  function parseCsvPreview(text: string) {
    const lines = text.trim().split(/\r?\n/);
    const rows = lines.map(l => l.split(';').map(c => c.trim()));
    setImportPreview(rows.slice(0, 6)); // header + 5 data rows
    setImportCsvText(text);
  }

  function handleImportFile(file: File) {
    setImportFile(file);
    setImportResult(null);
    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result as string;
      if (text) parseCsvPreview(text);
    };
    reader.readAsText(file, 'UTF-8');
  }

  function handleImportDrop(e: React.DragEvent) {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file && (file.name.endsWith('.csv') || file.name.endsWith('.txt') || file.name.endsWith('.xlsx'))) {
      handleImportFile(file);
    }
  }

  async function handleImportSubmit() {
    if (!detailSupplier || !importCsvText) return;
    setImportLoading(true);
    try {
      const result = await importSupplierPrices(detailSupplier.id, importCsvText);
      setImportResult(result);
      if (result.updated > 0) {
        showToast(`${result.updated} prix mis a jour`, 'success');
        await loadData();
      }
    } catch (e: unknown) {
      const message = e instanceof Error ? e.message : 'Erreur import';
      showToast(message, 'error');
    } finally {
      setImportLoading(false);
    }
  }

  // ── form helpers ───────────────────────────────────────────────────────────

  function setField<K extends keyof SupplierFormData>(key: K, value: SupplierFormData[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function toggleCategory(cat: string) {
    setForm((prev) => ({
      ...prev,
      categories: prev.categories.includes(cat)
        ? prev.categories.filter((c) => c !== cat)
        : [...prev.categories, cat],
    }));
  }

  // ── Annuaire ───────────────────────────────────────────────────────────────

  const annuaireResults = useMemo(() => {
    let results = searchSuppliers(
      annuaireSearch || undefined,
      annuaireRegion || undefined,
      undefined,
      annuaireCategory || undefined,
    );
    if (annuaireType) results = results.filter((s) => s.type === annuaireType);
    if (deliveryOnly) results = results.filter((s) => s.delivery);
    return results;
  }, [annuaireSearch, annuaireRegion, annuaireCategory, annuaireType, deliveryOnly]);

  const annuaireStats = useMemo(() => {
    const withDel = annuaireResults.filter((s) => s.delivery).length;
    const byType = annuaireResults.reduce((acc, s) => {
      acc[s.type] = (acc[s.type] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    return { total: annuaireResults.length, withDelivery: withDel, byType };
  }, [annuaireResults]);

  // ── Comparateur: group ingredients by name across suppliers ────────────────

  const comparatorData = useMemo(() => {
    const map: Record<string, { supplierId: number; supplierName: string; pricePerUnit: number; unit: string; ingredientId: number }[]> = {};
    suppliers.forEach(s => {
      (s.ingredients || []).forEach((ing: SupplierIngredient) => {
        const key = ing.name.toLowerCase().trim();
        if (!map[key]) map[key] = [];
        map[key].push({
          supplierId: s.id,
          supplierName: s.name,
          pricePerUnit: ing.pricePerUnit,
          unit: ing.unit,
          ingredientId: ing.id,
        });
      });
    });
    return Object.entries(map)
      .filter(([, entries]) => entries.length >= 2)
      .map(([key, entries]) => {
        const sorted = [...entries].sort((a, b) => a.pricePerUnit - b.pricePerUnit);
        const cheapest = sorted[0];
        const mostExpensive = sorted[sorted.length - 1];
        const avgMonthlyUsage = 10;
        const savingsPerUnit = mostExpensive.pricePerUnit - cheapest.pricePerUnit;
        const monthlySavings = savingsPerUnit * avgMonthlyUsage;
        let displayName = key;
        for (const s of suppliers) {
          for (const ing of (s.ingredients || [])) {
            if (ing.name.toLowerCase().trim() === key) { displayName = ing.name; break; }
          }
          if (displayName !== key) break;
        }
        return {
          key,
          displayName,
          entries: sorted,
          cheapestSupplierId: cheapest.supplierId,
          cheapestPrice: cheapest.pricePerUnit,
          unit: cheapest.unit,
          savingsPerMonth: monthlySavings,
        };
      })
      .sort((a, b) => b.savingsPerMonth - a.savingsPerMonth);
  }, [suppliers]);

  const totalPotentialSavings = useMemo(() => {
    return comparatorData.reduce((sum, item) => sum + item.savingsPerMonth, 0);
  }, [comparatorData]);

  // ── Supplier Score ────────────────────────────────────────────────────────

  const supplierScores = useMemo(() => {
    const allCategories = new Set(INGREDIENT_CATEGORIES);
    const totalCategories = allCategories.size;
    const maxIngredients = Math.max(...suppliers.map(s => (s.ingredients || []).length), 1);

    const cheapestCounts: Record<number, number> = {};
    const totalComparisons: Record<number, number> = {};
    suppliers.forEach(s => { cheapestCounts[s.id] = 0; totalComparisons[s.id] = 0; });

    const ingMap: Record<string, { supplierId: number; price: number }[]> = {};
    suppliers.forEach(s => {
      (s.ingredients || []).forEach((ing: SupplierIngredient) => {
        const key = ing.name.toLowerCase().trim();
        if (!ingMap[key]) ingMap[key] = [];
        ingMap[key].push({ supplierId: s.id, price: ing.pricePerUnit });
      });
    });
    Object.values(ingMap).forEach(entries => {
      if (entries.length < 2) return;
      const minPrice = Math.min(...entries.map(e => e.price));
      entries.forEach(e => {
        totalComparisons[e.supplierId] = (totalComparisons[e.supplierId] || 0) + 1;
        if (e.price === minPrice) {
          cheapestCounts[e.supplierId] = (cheapestCounts[e.supplierId] || 0) + 1;
        }
      });
    });

    const scores: Record<number, number> = {};
    suppliers.forEach(s => {
      const ings = s.ingredients || [];
      const compTotal = totalComparisons[s.id] || 0;
      const priceScore = compTotal > 0 ? (cheapestCounts[s.id] || 0) / compTotal : 0.5;
      const ingredientScore = ings.length / maxIngredients;
      const supplierCats = new Set((s.categories || []).filter(c => allCategories.has(c)));
      const categoryScore = totalCategories > 0 ? supplierCats.size / totalCategories : 0;
      scores[s.id] = Math.round((priceScore * 0.4 + ingredientScore * 0.3 + categoryScore * 0.3) * 10 * 10) / 10;
    });
    return scores;
  }, [suppliers]);

  // ── Price change badges (deterministic mock) ──────────────────────────────

  const priceAlerts = useMemo(() => {
    const alerts: Record<number, { pctChange: number }> = {};
    ingredients.forEach(ing => {
      if (!ing.supplierId) return;
      const seed = ((ing.id * 7 + 13) % 20) - 10;
      const pct = seed * 0.8;
      if (Math.abs(pct) > 4) {
        alerts[ing.id] = { pctChange: Math.round(pct * 10) / 10 };
      }
    });
    return alerts;
  }, [ingredients]);

  // ── Supplier catalogue: ingredients grouped by category ───────────────────

  const supplierCatalogMap = useMemo(() => {
    const map: Record<number, { byCategory: Record<string, Ingredient[]>; totalSpend: number; count: number }> = {};
    ingredients.forEach(ing => {
      if (!ing.supplierId) return;
      if (!map[ing.supplierId]) map[ing.supplierId] = { byCategory: {}, totalSpend: 0, count: 0 };
      const entry = map[ing.supplierId];
      const cat = ing.category || 'Autres';
      if (!entry.byCategory[cat]) entry.byCategory[cat] = [];
      entry.byCategory[cat].push(ing);
      entry.totalSpend += ing.pricePerUnit;
      entry.count++;
    });
    return map;
  }, [ingredients]);

  // Auto-select first supplier when list loads
  useEffect(() => {
    if (filtered.length > 0 && !detailSupplier) {
      setDetailSupplier(filtered[0]);
    }
  }, [filtered]);

  // Accordion: expanded categories & subcategories (default all collapsed)
  const [expandedCats, setExpandedCats] = useState<Set<string>>(new Set());
  const [expandedSubCats, setExpandedSubCats] = useState<Set<string>>(new Set());
  const [catalogDetailSearch, setCatalogDetailSearch] = useState('');

  function toggleCatCollapse(cat: string) {
    setExpandedCats(prev => {
      const next = new Set(prev);
      next.has(cat) ? next.delete(cat) : next.add(cat);
      return next;
    });
  }

  function toggleSubCatCollapse(key: string) {
    setExpandedSubCats(prev => {
      const next = new Set(prev);
      next.has(key) ? next.delete(key) : next.add(key);
      return next;
    });
  }

  // Category emoji map
  const CATEGORY_EMOJIS: Record<string, string> = {
    'Viandes': '🥩',
    'Poissons & Fruits de mer': '🐟',
    'Légumes': '🥬',
    'Fruits': '🍎',
    'Produits laitiers': '🧀',
    'Épices & Condiments': '🌶️',
    'Féculents & Céréales': '🌾',
    'Huiles & Matières grasses': '🫒',
    'Boissons': '🥤',
    'Autres': '📦',
  };

  // Subcategory mapping for finer grouping
  const SUBCATEGORY_RULES: Record<string, (name: string) => string> = {
    'Viandes': (name: string) => {
      const n = name.toLowerCase();
      if (n.includes('boeuf') || n.includes('bœuf') || n.includes('entrecôte') || n.includes('bavette') || n.includes('faux-filet') || n.includes('rumsteck') || n.includes('côte de boeuf')) return 'Boeuf';
      if (n.includes('volaille') || n.includes('poulet') || n.includes('dinde') || n.includes('canard') || n.includes('pintade') || n.includes('chapon')) return 'Volaille';
      if (n.includes('porc') || n.includes('cochon') || n.includes('jambon') || n.includes('lard') || n.includes('saucisse')) return 'Porc';
      if (n.includes('veau')) return 'Veau';
      if (n.includes('agneau') || n.includes('mouton')) return 'Agneau';
      return 'Autres viandes';
    },
    'Poissons & Fruits de mer': (name: string) => {
      const n = name.toLowerCase();
      if (n.includes('saumon') || n.includes('truite') || n.includes('cabillaud') || n.includes('bar') || n.includes('sole') || n.includes('dorade') || n.includes('thon') || n.includes('merlu') || n.includes('lieu')) return 'Poissons';
      if (n.includes('crevette') || n.includes('moule') || n.includes('huître') || n.includes('homard') || n.includes('langouste') || n.includes('crabe') || n.includes('coquille') || n.includes('calmar') || n.includes('poulpe')) return 'Fruits de mer';
      return 'Autres produits de la mer';
    },
    'Légumes': (name: string) => {
      const n = name.toLowerCase();
      if (n.includes('tomate') || n.includes('poivron') || n.includes('aubergine') || n.includes('courgette') || n.includes('concombre')) return 'Légumes-fruits';
      if (n.includes('carotte') || n.includes('navet') || n.includes('betterave') || n.includes('radis') || n.includes('céleri')) return 'Racines';
      if (n.includes('salade') || n.includes('laitue') || n.includes('épinard') || n.includes('roquette') || n.includes('mâche') || n.includes('chou')) return 'Feuilles & Salades';
      if (n.includes('oignon') || n.includes('ail') || n.includes('échalote') || n.includes('poireau')) return 'Alliacées';
      if (n.includes('champignon') || n.includes('cèpe') || n.includes('girolle') || n.includes('truffe') || n.includes('morille')) return 'Champignons';
      return 'Autres légumes';
    },
    'Fruits': (name: string) => {
      const n = name.toLowerCase();
      if (n.includes('pomme') || n.includes('poire') || n.includes('pêche') || n.includes('abricot') || n.includes('prune') || n.includes('cerise')) return 'Fruits à noyau/pépin';
      if (n.includes('fraise') || n.includes('framboise') || n.includes('myrtille') || n.includes('mûre') || n.includes('cassis') || n.includes('groseille')) return 'Fruits rouges';
      if (n.includes('orange') || n.includes('citron') || n.includes('mandarine') || n.includes('pamplemousse') || n.includes('lime') || n.includes('clémentine')) return 'Agrumes';
      if (n.includes('banane') || n.includes('mangue') || n.includes('ananas') || n.includes('papaye') || n.includes('passion') || n.includes('litchi') || n.includes('coco')) return 'Fruits exotiques';
      return 'Autres fruits';
    },
    'Produits laitiers': (name: string) => {
      const n = name.toLowerCase();
      if (n.includes('lait')) return 'Lait';
      if (n.includes('fromage') || n.includes('comté') || n.includes('gruyère') || n.includes('emmental') || n.includes('brie') || n.includes('camembert') || n.includes('roquefort') || n.includes('chèvre') || n.includes('parmesan') || n.includes('mozzarella') || n.includes('feta') || n.includes('reblochon')) return 'Fromages';
      if (n.includes('crème') || n.includes('beurre') || n.includes('mascarpone')) return 'Crème & Beurre';
      if (n.includes('yaourt') || n.includes('yogourt') || n.includes('fromage blanc')) return 'Yaourts';
      if (n.includes('oeuf') || n.includes('œuf')) return 'Oeufs';
      return 'Autres produits laitiers';
    },
  };

  // ── render ─────────────────────────────────────────────────────────────────

  if (loading) return <div className="text-center py-12 text-[#9CA3AF] dark:text-[#737373]">{t('suppliers.loading')}</div>;

  return (
    <div>
      {/* Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div className="flex gap-1 bg-[#F3F4F6] dark:bg-[#0A0A0A] rounded-lg p-1 w-fit">
          <button
            onClick={() => setActiveTab('mes-fournisseurs')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              activeTab === 'mes-fournisseurs'
                ? 'bg-white dark:bg-[#171717] text-[#111111] dark:text-white shadow-sm'
                : 'text-[#9CA3AF] dark:text-[#737373] hover:text-[#374151] dark:hover:text-[#A3A3A3]'
            }`}
          >
            <Truck className="w-4 h-4 inline-block mr-1.5 -mt-0.5" />
            {t('suppliers.mySuppliers')}
          </button>
          <button
            onClick={() => setActiveTab('annuaire')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              activeTab === 'annuaire'
                ? 'bg-white dark:bg-[#171717] text-[#111111] dark:text-white shadow-sm'
                : 'text-[#9CA3AF] dark:text-[#737373] hover:text-[#374151] dark:hover:text-[#A3A3A3]'
            }`}
          >
            <Globe className="w-4 h-4 inline-block mr-1.5 -mt-0.5" />
            {t('suppliers.directory')}
          </button>
          <button
            onClick={() => setActiveTab('comparateur')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              activeTab === 'comparateur'
                ? 'bg-white dark:bg-[#171717] text-[#111111] dark:text-white shadow-sm'
                : 'text-[#9CA3AF] dark:text-[#737373] hover:text-[#374151] dark:hover:text-[#A3A3A3]'
            }`}
          >
            <Scale className="w-4 h-4 inline-block mr-1.5 -mt-0.5" />
            Comparateur
            {comparatorData.length > 0 && (
              <span className="ml-1.5 px-1.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300">
                {comparatorData.length}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* ================================================================== */}
      {/* TAB: Mes fournisseurs (CRUD)                                       */}
      {/* ================================================================== */}
      {activeTab === 'mes-fournisseurs' && (
        <>
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <h2 className="text-2xl font-bold text-[#111111] dark:text-white">{t('suppliers.title')}</h2>
            <div className="flex items-center gap-2">
              {/* Score comparison button */}
              {suppliers.length >= 2 && (
                <button
                  onClick={() => setShowScoreCompare(true)}
                  className="flex items-center gap-2 px-3 py-2 text-sm font-medium border border-[#D1D5DB] dark:border-[#333] rounded-lg text-[#111111] dark:text-white hover:bg-[#FAFAFA] dark:hover:bg-[#171717] transition-colors"
                >
                  <BarChart3 className="w-4 h-4" />
                  Comparer les fournisseurs
                </button>
              )}
              {/* Quick-add dropdown */}
              <div className="relative">
                <button onClick={() => setShowQuickAdd(!showQuickAdd)} className="flex items-center gap-2 px-3 py-2 text-sm font-medium border border-[#D1D5DB] dark:border-[#2A2A2A] rounded-lg text-[#9CA3AF] dark:text-[#A3A3A3] hover:bg-[#FAFAFA] dark:hover:bg-[#171717] transition-colors">
                  <Zap className="w-4 h-4 text-amber-500" />
                  {t('suppliers.quickAdd')}
                  <ChevronDown className="w-3 h-3" />
                </button>
                {showQuickAdd && (
                  <>
                  <div className="fixed inset-0 z-40" onClick={() => setShowQuickAdd(false)} />
                  <div className="absolute right-0 mt-1 w-64 bg-white dark:bg-[#0A0A0A] rounded-lg shadow-lg border dark:border-[#1A1A1A] z-50 py-1">
                    <div className="px-3 py-2 text-xs font-medium text-[#9CA3AF] dark:text-[#A3A3A3] uppercase tracking-wider">{t('suppliers.commonSuppliers')}</div>
                    {QUICK_ADD_TEMPLATES.map((tpl) => (
                      <button
                        key={tpl.name}
                        onClick={() => {
                          setEditingSupplier(null);
                          setForm({ ...emptyForm, ...tpl.data } as SupplierFormData);
                          setModalOpen(true);
                          setShowQuickAdd(false);
                        }}
                        className="w-full text-left px-3 py-2 text-sm text-[#9CA3AF] dark:text-[#A3A3A3] hover:bg-[#FAFAFA] dark:hover:bg-[#171717] flex items-center gap-2"
                      >
                        <Building2 className="w-4 h-4 text-[#9CA3AF] dark:text-[#737373]" />
                        {tpl.name}
                      </button>
                    ))}
                  </div>
                  </>
                )}
              </div>
              <button onClick={openAdd} className="btn btn-primary flex items-center gap-2 w-fit">
                <Plus className="w-4 h-4" />
                {t('suppliers.addSupplier')}
              </button>
            </div>
          </div>

          {/* Stats cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <div className="bg-white dark:bg-[#0A0A0A] rounded-lg shadow p-5">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-[#9CA3AF] dark:text-[#737373]">{t('suppliers.totalSuppliers')}</span>
                <div className="p-2 rounded-lg bg-[#F3F4F6] dark:bg-[#171717]"><Truck className="w-5 h-5 text-[#111111] dark:text-white" /></div>
              </div>
              <div className="text-2xl font-bold text-[#111111] dark:text-white">{stats.totalSuppliers}</div>
            </div>
            <div className="bg-white dark:bg-[#0A0A0A] rounded-lg shadow p-5">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-[#9CA3AF] dark:text-[#737373]">{t('suppliers.linkedIngredients')}</span>
                <div className="p-2 rounded-lg bg-[#F3F4F6] dark:bg-[#171717]"><Package className="w-5 h-5 text-[#111111] dark:text-white" /></div>
              </div>
              <div className="text-2xl font-bold text-[#111111] dark:text-white">{stats.totalLinked}</div>
            </div>
            <div className="bg-white dark:bg-[#0A0A0A] rounded-lg shadow p-5">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-[#9CA3AF] dark:text-[#737373]">{t('suppliers.withDelivery')}</span>
                <div className="p-2 rounded-lg bg-[#F3F4F6] dark:bg-[#171717]"><Truck className="w-5 h-5 text-[#111111] dark:text-white" /></div>
              </div>
              <div className="text-2xl font-bold text-[#111111] dark:text-white">{stats.withDelivery}</div>
            </div>
            <div className="bg-white dark:bg-[#0A0A0A] rounded-lg shadow p-5">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-[#9CA3AF] dark:text-[#737373]">{t('suppliers.withoutSupplier')}</span>
                <div className="p-2 rounded-lg bg-[#F3F4F6] dark:bg-[#171717]"><Package className="w-5 h-5 text-[#111111] dark:text-white" /></div>
              </div>
              <div className="text-2xl font-bold text-[#111111] dark:text-white">{stats.withoutSupplier}</div>
            </div>
          </div>

          {/* Comparer les prix bar */}
          {compareSupplierIds.size > 0 && (
            <div className="bg-[#FAFAFA] dark:bg-[#0A0A0A] border border-[#E5E7EB] dark:border-[#1A1A1A] rounded-lg p-3 mb-4 flex items-center justify-between">
              <span className="text-sm text-[#111111] dark:text-white">
                <ArrowRightLeft className="w-4 h-4 inline mr-1.5 -mt-0.5" />
                {compareSupplierIds.size} {t('suppliers.suppliersSelected')}
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setCompareSupplierIds(new Set())}
                  className="text-xs px-3 py-1.5 rounded border border-[#D1D5DB] dark:border-[#333] text-[#111111] dark:text-white hover:bg-[#FAFAFA] dark:hover:bg-[#171717]"
                >
                  {t('suppliers.deselectAll')}
                </button>
                <button
                  onClick={() => setShowSupplierCompare(true)}
                  disabled={compareSupplierIds.size < 2}
                  className="flex items-center gap-1.5 text-xs px-4 py-1.5 rounded-lg bg-[#111111] dark:bg-white hover:bg-[#333] dark:hover:bg-[#E5E5E5] text-white dark:text-black font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <BarChart3 className="w-3.5 h-3.5" />
                  {t('suppliers.comparePrices')}
                </button>
              </div>
            </div>
          )}

          {/* Supplier price comparison modal */}
          <Modal isOpen={showSupplierCompare} onClose={() => setShowSupplierCompare(false)} title={t('suppliers.priceComparison')}>
            {(() => {
              const comparedSuppliers = suppliers.filter(s => compareSupplierIds.has(s.id));
              // Build a map of ingredient name -> { supplier name -> price, unit }
              const ingredientMap: Record<string, Record<string, { price: number; unit: string }>> = {};
              comparedSuppliers.forEach(s => {
                (s.ingredients || []).forEach((ing: SupplierIngredient) => {
                  if (!ingredientMap[ing.name]) ingredientMap[ing.name] = {};
                  ingredientMap[ing.name][s.name] = { price: ing.pricePerUnit, unit: ing.unit };
                });
              });
              const ingredientNames = Object.keys(ingredientMap).sort();
              if (ingredientNames.length === 0) {
                return <p className="text-sm text-[#9CA3AF] dark:text-[#737373] py-4 text-center">{t('suppliers.noCommonIngredients')}</p>;
              }
              return (
                <div className="overflow-x-auto max-h-[60vh]">
                  <table className="w-full text-sm">
                    <thead className="sticky top-0 bg-[#FAFAFA] dark:bg-[#171717] z-10">
                      <tr>
                        <th className="text-left px-3 py-2 text-xs text-[#9CA3AF] dark:text-[#737373] font-medium">{t('suppliers.ingredient')}</th>
                        {comparedSuppliers.map(s => (
                          <th key={s.id} className="text-right px-3 py-2 text-xs text-[#9CA3AF] dark:text-[#737373] font-medium">{s.name}</th>
                        ))}
                        <th className="text-right px-3 py-2 text-xs text-[#9CA3AF] dark:text-[#737373] font-medium">{t('suppliers.gapPercent')}</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y dark:divide-[#1A1A1A]">
                      {ingredientNames.map(name => {
                        const prices = comparedSuppliers.map(s => ingredientMap[name][s.name]?.price ?? null);
                        const validPrices = prices.filter((p): p is number => p !== null);
                        const minPrice = validPrices.length > 0 ? Math.min(...validPrices) : null;
                        const maxPrice = validPrices.length > 0 ? Math.max(...validPrices) : null;
                        const diff = minPrice && maxPrice && maxPrice > 0 ? Math.round(((maxPrice - minPrice) / minPrice) * 100) : null;
                        return (
                          <tr key={name} className="hover:bg-[#FAFAFA] dark:hover:bg-[#171717]/30">
                            <td className="px-3 py-2 text-[#9CA3AF] dark:text-[#A3A3A3] font-medium">{name}</td>
                            {comparedSuppliers.map(s => {
                              const entry = ingredientMap[name][s.name];
                              const isBest = entry && minPrice !== null && entry.price === minPrice && validPrices.length > 1;
                              return (
                                <td key={s.id} className={`px-3 py-2 text-right font-medium ${isBest ? 'text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/20' : 'text-[#6B7280] dark:text-[#737373]'}`}>
                                  {entry ? `${entry.price.toFixed(2)} €/${entry.unit}` : <span className="text-[#6B7280] dark:text-[#A3A3A3]">--</span>}
                                </td>
                              );
                            })}
                            <td className={`px-3 py-2 text-right text-xs font-bold ${diff !== null && diff > 15 ? 'text-red-600' : diff !== null && diff > 0 ? 'text-orange-500' : 'text-[#9CA3AF] dark:text-[#737373]'}`}>
                              {diff !== null ? `${diff}%` : '--'}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              );
            })()}
          </Modal>

          {/* Search / filter bar */}
          <div className="bg-white dark:bg-[#0A0A0A] rounded-lg shadow p-4 mb-6">
            <div className="flex items-center gap-2 mb-3 text-sm font-medium text-[#6B7280] dark:text-[#A3A3A3]">
              <Filter className="w-4 h-4" />
              {t('suppliers.filters')}
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#9CA3AF] dark:text-[#737373]" />
                <input
                  type="text"
                  placeholder={t('suppliers.searchByName')}
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="input pl-10 w-full"
                />
              </div>
              <div className="relative">
                <MapPin className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#9CA3AF] dark:text-[#737373] pointer-events-none" />
                <select
                  value={filterRegion}
                  onChange={(e) => setFilterRegion(e.target.value)}
                  className="input pl-10 w-full appearance-none"
                >
                  <option value="">{t('suppliers.allRegions')}</option>
                  {FRENCH_REGIONS.map((r) => (
                    <option key={r} value={r}>{r}</option>
                  ))}
                </select>
              </div>
              <div className="relative">
                <Tag className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#9CA3AF] dark:text-[#737373] pointer-events-none" />
                <select
                  value={filterCategory}
                  onChange={(e) => setFilterCategory(e.target.value)}
                  className="input pl-10 w-full appearance-none"
                >
                  <option value="">{t('suppliers.allCategories')}</option>
                  {INGREDIENT_CATEGORIES.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Split layout: master/detail */}
          <div className="flex flex-col lg:flex-row gap-4" style={{ minHeight: '70vh' }}>
            {/* LEFT: Supplier list */}
            <div className="w-full lg:w-80 xl:w-96 shrink-0 flex flex-col gap-2">
              {/* Search bar */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9CA3AF] dark:text-[#737373]" />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder={t('suppliers.searchByName')}
                  className="w-full pl-9 pr-3 py-2 rounded-lg bg-white dark:bg-[#0A0A0A] border border-[#E5E7EB] dark:border-[#1A1A1A] text-sm focus:outline-none focus:ring-1 focus:ring-[#111111] dark:focus:ring-white"
                />
              </div>
              {/* Supplier slices */}
              <div className="flex-1 overflow-y-auto space-y-1">
                {filtered.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full text-[#9CA3AF] dark:text-[#737373] py-12">
                    <Truck className="w-10 h-10 mb-2 opacity-30" />
                    <p className="text-sm">{t('suppliers.noSupplierFound')}</p>
                  </div>
                ) : (
                  filtered.map(supplier => {
                    const bScore = backendScores[supplier.id];
                    const globalScore = bScore?.scores?.global ?? 0;
                    return (
                    <div
                      key={supplier.id}
                      onClick={() => setDetailSupplier(supplier)}
                      className={`cursor-pointer rounded-xl p-3 border transition-all ${
                        detailSupplier?.id === supplier.id
                          ? 'border-l-4 border-[#111111] dark:border-white bg-[#FAFAFA] dark:bg-[#0A0A0A] shadow-sm'
                          : 'border-[#E5E7EB] dark:border-[#1A1A1A] hover:bg-[#FAFAFA] dark:bg-[#0F0F0F] dark:hover:bg-[#171717]'
                      }`}
                    >
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2.5 min-w-0">
                          <CircularScore score={globalScore} size={38} strokeWidth={3} />
                          <div className="min-w-0">
                            <div className="flex items-center gap-1.5">
                              <span className="font-semibold text-sm text-[#111111] dark:text-white truncate">{supplier.name}</span>
                              {globalScore > 80 && (
                                <span className="shrink-0 inline-flex items-center gap-0.5 text-[9px] px-1.5 py-0.5 rounded-full bg-teal-100 dark:bg-teal-900/50 text-teal-700 dark:text-teal-300 font-bold">
                                  <Award className="w-2.5 h-2.5" /> Top
                                </span>
                              )}
                            </div>
                            <div className="flex items-center gap-2 text-xs text-[#9CA3AF] dark:text-[#737373]">
                              {supplier.city && <span>{supplier.city}</span>}
                              {supplier.delivery && <span className="text-emerald-500">&#10003; Livraison</span>}
                            </div>
                          </div>
                        </div>
                        <span className="shrink-0 text-xs px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300 font-medium">
                          {supplierCatalogMap[supplier.id]?.count ?? 0} produits
                        </span>
                      </div>
                      <div className="flex flex-wrap gap-1 mt-1.5 ml-[50px]">
                        {(supplier.categories || []).slice(0, 3).map(cat => (
                          <span key={cat} className="text-[10px] px-1.5 py-0.5 rounded bg-[#F3F4F6] dark:bg-[#171717] text-[#6B7280] dark:text-[#A3A3A3]">{cat}</span>
                        ))}
                      </div>
                    </div>
                    );
                  }))
                }
              </div>
            </div>

            {/* RIGHT: Detail panel */}
            <div className="flex-1 bg-white dark:bg-black rounded-2xl border border-[#E5E7EB] dark:border-[#1A1A1A] overflow-y-auto">
              {detailSupplier ? (() => {
                const globalScoreVal = backendScores[detailSupplier.id]?.scores?.global ?? 0;
                const scoreColor = globalScoreVal > 70 ? 'bg-teal-100 dark:bg-teal-900/40 text-teal-700 dark:text-teal-300' : globalScoreVal >= 40 ? 'bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-300' : 'bg-red-100 dark:bg-red-900/40 text-red-700 dark:text-red-300';
                return (
                  <div className="p-6 space-y-5">
                    {/* Header with name + actions */}
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <h3 className="text-xl font-bold text-[#111111] dark:text-white">{detailSupplier.name}</h3>
                        <div className="flex items-center gap-2 mt-1">
                          <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${scoreColor}`}>{globalScoreVal}/100</span>
                          {detailSupplier.delivery && (
                            <span className="text-xs px-2 py-0.5 rounded-full bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-300 font-medium flex items-center gap-1">
                              <Check className="w-3 h-3" /> Livraison
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-1.5 shrink-0">
                        <button
                          onClick={() => navigate(`/fournisseur/${detailSupplier.id}`)}
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#111111] dark:bg-white hover:bg-[#333] dark:hover:bg-[#E5E5E5] text-white dark:text-black text-xs font-medium"
                          title="Voir catalogue promotionnel"
                        >
                          <ShoppingBag className="w-3.5 h-3.5" />
                          Catalogue
                        </button>
                        <button
                          onClick={() => openEdit(detailSupplier)}
                          className="p-2 rounded-lg hover:bg-[#F3F4F6] dark:hover:bg-[#171717] text-[#9CA3AF] dark:text-[#737373]"
                          title={t('suppliers.edit')}
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setDeleteTarget(detailSupplier)}
                          className="p-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 text-red-500"
                          title={t('suppliers.delete')}
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleLink(detailSupplier)}
                          disabled={linking === detailSupplier.id}
                          className="p-2 rounded-lg hover:bg-green-50 dark:hover:bg-green-900/20 text-green-600 dark:text-green-400 disabled:opacity-50"
                          title={t('suppliers.linkIngredients')}
                        >
                          <Link2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={openImportModal}
                          className="p-2 rounded-lg hover:bg-[#F3F4F6] dark:hover:bg-[#171717] text-[#111111] dark:text-white"
                          title="Importer tarif CSV"
                        >
                          <Upload className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    {/* Scoring Dashboard */}
                    <div className="bg-[#F3F4F6] dark:bg-[#0F0F0F] rounded-xl border border-[#E5E7EB] dark:border-[#1A1A1A]/50 p-4">
                      <div className="flex items-center gap-4 mb-4">
                        <CircularScore score={detailScore?.scores?.global ?? 0} size={64} strokeWidth={5} />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="text-lg font-bold text-[#111111] dark:text-white">Score Global</span>
                            {(detailScore?.scores?.global ?? 0) > 80 && (
                              <span className="inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full bg-teal-500/20 text-teal-300 font-bold border border-teal-500/30">
                                <Award className="w-3 h-3" /> Top fournisseur
                              </span>
                            )}
                          </div>
                          {detailScore?.recommendation && (
                            <p className="text-xs text-[#9CA3AF] dark:text-[#737373] mt-0.5">{detailScore.recommendation}</p>
                          )}
                          {detailScore?.note && (
                            <p className="text-[10px] text-amber-400/80 mt-1 flex items-center gap-1">
                              <AlertTriangle className="w-3 h-3" /> {detailScore.note}
                            </p>
                          )}
                        </div>
                      </div>
                      {loadingScore ? (
                        <div className="flex items-center justify-center py-4">
                          <span className="w-5 h-5 border-2 border-[#D1D5DB] dark:border-[#333] border-t-[#111111] dark:border-t-white rounded-full animate-spin" />
                        </div>
                      ) : detailScore ? (
                        <div className="space-y-3">
                          <ScoreBar label="Fiabilite livraison" score={detailScore.scores.fiabilite} icon={<Truck className="w-3.5 h-3.5" />} />
                          <ScoreBar label="Competitivite prix" score={detailScore.scores.competitivite} icon={<TrendingUp className="w-3.5 h-3.5" />} />
                          <ScoreBar label="Diversite catalogue" score={detailScore.scores.diversite} icon={<Package className="w-3.5 h-3.5" />} />
                          <ScoreBar label="Historique" score={detailScore.scores.historique} icon={<Clock className="w-3.5 h-3.5" />} />
                        </div>
                      ) : (
                        <p className="text-xs text-[#6B7280] dark:text-[#A3A3A3] text-center py-2">Chargement des scores...</p>
                      )}
                    </div>

                    {/* Contact info */}
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      {detailSupplier.contactName && <div className="text-[#6B7280] dark:text-[#A3A3A3]"><Building2 className="w-3.5 h-3.5 inline mr-1 -mt-0.5 text-[#9CA3AF] dark:text-[#737373]" />{detailSupplier.contactName}</div>}
                      {detailSupplier.phone && <div className="text-[#6B7280] dark:text-[#A3A3A3]"><Phone className="w-3.5 h-3.5 inline mr-1 -mt-0.5 text-[#9CA3AF] dark:text-[#737373]" />{detailSupplier.phone}</div>}
                      {detailSupplier.email && <div className="text-[#6B7280] dark:text-[#A3A3A3]"><Mail className="w-3.5 h-3.5 inline mr-1 -mt-0.5 text-[#9CA3AF] dark:text-[#737373]" />{detailSupplier.email}</div>}
                      {detailSupplier.city && <div className="text-[#6B7280] dark:text-[#A3A3A3]"><MapPin className="w-3.5 h-3.5 inline mr-1 -mt-0.5 text-[#9CA3AF] dark:text-[#737373]" />{[detailSupplier.city, detailSupplier.postalCode].filter(Boolean).join(' ')}</div>}
                      {detailSupplier.website && (
                        <div>
                          <a
                            href={detailSupplier.website.startsWith('http') ? detailSupplier.website : `https://${detailSupplier.website}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-1 text-sm text-[#111111] dark:text-white hover:underline"
                          >
                            <ExternalLink className="w-3.5 h-3.5" />
                            {t('suppliers.website')}
                          </a>
                        </div>
                      )}
                    </div>

                    {/* WhatsApp quick action */}
                    <button
                      onClick={() => {
                        const phone = detailSupplier.whatsappPhone || detailSupplier.phone;
                        const cleanPhone = phone ? phone.replace(/[\s+\-()]/g, '') : '';
                        const message = encodeURIComponent(`Bonjour ${detailSupplier.name},\n\n`);
                        if (cleanPhone) {
                          window.open(`https://wa.me/${cleanPhone}?text=${message}`, '_blank');
                        } else {
                          window.open(`https://web.whatsapp.com/send?text=${message}`, '_blank');
                        }
                      }}
                      className="flex items-center gap-2 px-4 py-2 bg-[#25D366] hover:bg-[#20bd5a] text-white rounded-lg text-sm font-medium transition w-fit"
                    >
                      <MessageCircle className="w-4 h-4" />
                      WhatsApp
                    </button>

                    {/* Categories */}
                    {detailSupplier.categories.length > 0 && (
                      <div className="flex flex-wrap gap-1.5">
                        {detailSupplier.categories.map((cat) => (
                          <span key={cat} className="px-2.5 py-1 rounded-lg text-xs bg-[#F3F4F6] dark:bg-[#171717] text-[#6B7280] dark:text-[#A3A3A3] font-medium">
                            {cat}
                          </span>
                        ))}
                      </div>
                    )}

                    {/* Catalogue section: accordion by category/subcategory */}
                    {(() => {
                      const catalog = supplierCatalogMap[detailSupplier.id];
                      if (!catalog || catalog.count === 0) return (
                        <div>
                          <h4 className="text-sm font-semibold text-[#9CA3AF] dark:text-[#E5E5E5] mb-3 flex items-center gap-2">
                            <Layers className="w-4 h-4 text-purple-500" />
                            Catalogue (0 produits)
                          </h4>
                          <p className="text-sm text-[#9CA3AF] dark:text-[#737373] italic">{t('suppliers.noIngredientLinkedToSupplier')}</p>
                        </div>
                      );

                      // Filter ingredients by search
                      const searchLower = catalogDetailSearch.toLowerCase().trim();
                      const filteredByCategory: Record<string, Ingredient[]> = {};
                      let filteredCount = 0;
                      Object.entries(catalog.byCategory).forEach(([cat, ings]) => {
                        const filtered = searchLower
                          ? ings.filter(i => i.name.toLowerCase().includes(searchLower))
                          : ings;
                        if (filtered.length > 0) {
                          filteredByCategory[cat] = filtered;
                          filteredCount += filtered.length;
                        }
                      });

                      const sortedCategories = Object.keys(filteredByCategory).sort();
                      const avgPrice = filteredCount > 0
                        ? Object.values(filteredByCategory).flat().reduce((s, i) => s + i.pricePerUnit, 0) / filteredCount
                        : 0;

                      return (
                        <div>
                          {/* Stats bar */}
                          <div className="grid grid-cols-3 gap-2 mb-3">
                            <div className="bg-[#F3F4F6] dark:bg-[#0F0F0F] rounded-lg px-3 py-2 text-center">
                              <div className="text-lg font-bold text-[#111111] dark:text-white">{catalog.count}</div>
                              <div className="text-[10px] text-[#9CA3AF] dark:text-[#737373] uppercase tracking-wide">Articles</div>
                            </div>
                            <div className="bg-[#F3F4F6] dark:bg-[#0F0F0F] rounded-lg px-3 py-2 text-center">
                              <div className="text-lg font-bold text-purple-400">{sortedCategories.length}</div>
                              <div className="text-[10px] text-[#9CA3AF] dark:text-[#737373] uppercase tracking-wide">Categories</div>
                            </div>
                            <div className="bg-[#F3F4F6] dark:bg-[#0F0F0F] rounded-lg px-3 py-2 text-center">
                              <div className="text-lg font-bold text-emerald-400">{avgPrice.toFixed(2)} EUR</div>
                              <div className="text-[10px] text-[#9CA3AF] dark:text-[#737373] uppercase tracking-wide">Prix moyen</div>
                            </div>
                          </div>

                          {/* Search bar */}
                          <div className="relative mb-3">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6B7280] dark:text-[#A3A3A3]" />
                            <input
                              type="text"
                              placeholder="Rechercher dans le catalogue..."
                              value={catalogDetailSearch}
                              onChange={e => setCatalogDetailSearch(e.target.value)}
                              className="w-full pl-9 pr-3 py-2 text-sm bg-[#FAFAFA] dark:bg-[#0A0A0A] border border-[#E5E7EB] dark:border-[#1A1A1A] rounded-lg text-[#111111] dark:text-[#E5E5E5] placeholder-[#9CA3AF] dark:placeholder-[#737373] focus:outline-none focus:border-[#111111] dark:focus:border-white focus:ring-1 focus:ring-[#111111]/30 dark:focus:ring-white/30 transition-colors"
                            />
                            {catalogDetailSearch && (
                              <button onClick={() => setCatalogDetailSearch('')} className="absolute right-2 top-1/2 -translate-y-1/2 p-1 hover:bg-[#F3F4F6] dark:hover:bg-[#171717] rounded">
                                <X className="w-3 h-3 text-[#9CA3AF] dark:text-[#737373]" />
                              </button>
                            )}
                          </div>

                          {searchLower && (
                            <p className="text-xs text-[#9CA3AF] dark:text-[#737373] mb-2">
                              {filteredCount} resultat{filteredCount !== 1 ? 's' : ''} pour "{catalogDetailSearch}"
                            </p>
                          )}

                          {/* Accordion categories */}
                          <div className="space-y-1.5">
                            {sortedCategories.map(cat => {
                              const catIngredients = filteredByCategory[cat];
                              const catKey = `${detailSupplier.id}-${cat}`;
                              const isExpanded = expandedCats.has(catKey);
                              const catTotal = catIngredients.reduce((s, i) => s + i.pricePerUnit, 0);
                              const emoji = CATEGORY_EMOJIS[cat] || '📦';

                              // Build subcategories
                              const subCatFn = SUBCATEGORY_RULES[cat];
                              const subGroups: Record<string, Ingredient[]> = {};
                              if (subCatFn) {
                                catIngredients.forEach(ing => {
                                  const sub = subCatFn(ing.name);
                                  if (!subGroups[sub]) subGroups[sub] = [];
                                  subGroups[sub].push(ing);
                                });
                              } else {
                                subGroups['_all'] = catIngredients;
                              }
                              const hasSubGroups = !!subCatFn && Object.keys(subGroups).length > 1;

                              return (
                                <div key={cat} className="border border-[#E5E7EB] dark:border-[#1A1A1A] rounded-xl overflow-hidden bg-[#FAFAFA] dark:bg-[#0A0A0A]">
                                  {/* Category header */}
                                  <button
                                    onClick={() => toggleCatCollapse(catKey)}
                                    className="w-full flex items-center justify-between px-3 py-3 hover:bg-[#FAFAFA] dark:bg-[#0A0A0A]/70 transition-all duration-200 text-left group"
                                  >
                                    <div className="flex items-center gap-2.5">
                                      <ChevronRight className={`w-4 h-4 text-[#111111] dark:text-white transition-transform duration-200 ${isExpanded ? 'rotate-90' : ''}`} />
                                      <span className="text-base" role="img">{emoji}</span>
                                      <span className="text-sm font-semibold text-[#111111] dark:text-[#E5E5E5] group-hover:text-[#111111] dark:group-hover:text-white transition-colors">{cat}</span>
                                      <span className="text-[11px] px-2 py-0.5 rounded-full bg-[#F3F4F6] dark:bg-[#171717] text-[#111111] dark:text-white font-medium">
                                        {catIngredients.length}
                                      </span>
                                    </div>
                                    <span className="text-xs font-semibold text-emerald-400">
                                      {catTotal.toFixed(2)} EUR
                                    </span>
                                  </button>

                                  {/* Expanded content with smooth transition */}
                                  <div className={`transition-all duration-200 ease-in-out overflow-hidden ${isExpanded ? 'max-h-[2000px] opacity-100' : 'max-h-0 opacity-0'}`}>
                                    {hasSubGroups ? (
                                      // Render subcategories
                                      <div className="border-t border-[#E5E7EB] dark:border-[#1A1A1A]/50">
                                        {Object.entries(subGroups).sort(([a], [b]) => a.localeCompare(b)).map(([subCat, subIngs]) => {
                                          const subKey = `${catKey}-${subCat}`;
                                          const isSubExpanded = expandedSubCats.has(subKey);
                                          const subTotal = subIngs.reduce((s, i) => s + i.pricePerUnit, 0);
                                          return (
                                            <div key={subCat} className="border-b border-[#E5E7EB] dark:border-[#1A1A1A]/50 last:border-b-0">
                                              <button
                                                onClick={() => toggleSubCatCollapse(subKey)}
                                                className="w-full flex items-center justify-between pl-8 pr-3 py-2 hover:bg-[#FAFAFA] dark:bg-[#0A0A0A]/40 transition-colors text-left"
                                              >
                                                <div className="flex items-center gap-2">
                                                  <ChevronRight className={`w-3 h-3 text-[#6B7280] dark:text-[#A3A3A3] transition-transform duration-150 ${isSubExpanded ? 'rotate-90' : ''}`} />
                                                  <span className="text-xs font-medium text-[#6B7280] dark:text-[#A3A3A3]">{subCat}</span>
                                                  <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-[#F3F4F6] dark:bg-[#171717] text-[#9CA3AF] dark:text-[#737373]">
                                                    {subIngs.length}
                                                  </span>
                                                </div>
                                                <span className="text-[11px] text-[#9CA3AF] dark:text-[#737373]">{subTotal.toFixed(2)} EUR</span>
                                              </button>
                                              <div className={`transition-all duration-150 ease-in-out overflow-hidden ${isSubExpanded ? 'max-h-[1000px] opacity-100' : 'max-h-0 opacity-0'}`}>
                                                <div className="divide-y divide-[#E5E7EB]/30">
                                                  {subIngs.sort((a, b) => a.name.localeCompare(b.name)).map(ing => (
                                                    <div key={ing.id} className="flex items-center gap-2 pl-12 pr-3 py-1.5 hover:bg-[#FAFAFA] dark:bg-[#0A0A0A]/30 transition-colors">
                                                      <span className="flex-1 text-xs text-[#6B7280] dark:text-[#A3A3A3] truncate">{ing.name}</span>
                                                      <span className="text-xs font-medium text-[#111111] dark:text-white whitespace-nowrap">
                                                        {ing.pricePerUnit.toFixed(2)} EUR/{ing.unit}
                                                      </span>
                                                      {priceAlerts[ing.id] && (
                                                        <span className={`text-[9px] font-bold px-1 py-0.5 rounded-full shrink-0 ${
                                                          priceAlerts[ing.id].pctChange > 0
                                                            ? 'bg-red-900/30 text-red-400'
                                                            : 'bg-green-900/30 text-green-400'
                                                        }`}>
                                                          {priceAlerts[ing.id].pctChange > 0 ? '+' : ''}{priceAlerts[ing.id].pctChange}%
                                                        </span>
                                                      )}
                                                    </div>
                                                  ))}
                                                </div>
                                              </div>
                                            </div>
                                          );
                                        })}
                                      </div>
                                    ) : (
                                      // Flat list (no subcategories)
                                      <div className="divide-y divide-[#E5E7EB]/30 border-t border-[#E5E7EB] dark:border-[#1A1A1A]/50">
                                        {catIngredients.sort((a, b) => a.name.localeCompare(b.name)).map(ing => (
                                          <div key={ing.id} className="flex items-center gap-2 pl-9 pr-3 py-1.5 hover:bg-[#FAFAFA] dark:bg-[#0A0A0A]/30 transition-colors">
                                            <span className="flex-1 text-xs text-[#6B7280] dark:text-[#A3A3A3] truncate">{ing.name}</span>
                                            <span className="text-xs font-medium text-[#111111] dark:text-white whitespace-nowrap">
                                              {ing.pricePerUnit.toFixed(2)} EUR/{ing.unit}
                                            </span>
                                            {priceAlerts[ing.id] && (
                                              <span className={`text-[9px] font-bold px-1 py-0.5 rounded-full shrink-0 ${
                                                priceAlerts[ing.id].pctChange > 0
                                                  ? 'bg-red-900/30 text-red-400'
                                                  : 'bg-green-900/30 text-green-400'
                                              }`}>
                                                {priceAlerts[ing.id].pctChange > 0 ? '+' : ''}{priceAlerts[ing.id].pctChange}%
                                              </span>
                                            )}
                                          </div>
                                        ))}
                                      </div>
                                    )}
                                  </div>
                                </div>
                              );
                            })}
                          </div>

                          {filteredCount === 0 && searchLower && (
                            <div className="text-center py-6 text-[#6B7280] dark:text-[#A3A3A3]">
                              <Search className="w-8 h-8 mx-auto mb-2 opacity-30" />
                              <p className="text-sm">Aucun article trouve pour "{catalogDetailSearch}"</p>
                            </div>
                          )}
                        </div>
                      );
                    })()}
                  </div>
                );
              })() : (
                <div className="flex flex-col items-center justify-center h-full text-[#9CA3AF] dark:text-[#737373] py-20">
                  <Truck className="w-12 h-12 mb-3 opacity-30" />
                  <p>{t('suppliers.noSupplierFound')}</p>
                </div>
              )}
            </div>
          </div>
        </>
      )}

      {/* ================================================================== */}
      {/* TAB: Annuaire fournisseurs France (kept as-is)                     */}
      {/* ================================================================== */}
      {activeTab === 'annuaire' && (
        <>
          {/* Stats bar */}
          <div className="flex flex-wrap gap-3 mb-4 text-sm">
            <span className="px-3 py-1.5 rounded-full bg-[#F3F4F6] dark:bg-[#0A0A0A] text-[#6B7280] dark:text-[#A3A3A3] font-medium">
              {annuaireStats.total} {t('suppliers.suppliersFound')}
            </span>
            <span className="px-3 py-1.5 rounded-full bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 font-medium">
              {annuaireStats.withDelivery} {t('suppliers.withDeliveryLabel')}
            </span>
            {Object.entries(annuaireStats.byType).map(([type, count]) => {
              const tc = TYPE_COLORS[type as FrenchSupplier['type']];
              return (
                <span key={type} className={`px-3 py-1.5 rounded-full ${tc.bg} ${tc.text} font-medium`}>
                  {count} {({grossiste: t('suppliers.typeWholesaler'), specialiste: t('suppliers.typeSpecialist'), local: t('suppliers.typeLocal'), national: t('suppliers.typeNational')} as Record<string, string>)[type]?.toLowerCase()}
                </span>
              );
            })}
          </div>

          {/* Filters */}
          <div className="bg-white dark:bg-[#0A0A0A] rounded-lg shadow p-4 mb-6">
            <div className="flex items-center gap-2 mb-3 text-sm font-medium text-[#6B7280] dark:text-[#A3A3A3]">
              <Filter className="w-4 h-4" />
              {t('suppliers.filters')}
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#9CA3AF] dark:text-[#737373]" />
                <input
                  type="text"
                  placeholder={t('suppliers.search')}
                  value={annuaireSearch}
                  onChange={(e) => setAnnuaireSearch(e.target.value)}
                  className="input pl-10 w-full"
                />
              </div>
              <div className="relative">
                <MapPin className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#9CA3AF] dark:text-[#737373] pointer-events-none" />
                <select
                  value={annuaireRegion}
                  onChange={(e) => setAnnuaireRegion(e.target.value)}
                  className="input pl-10 w-full appearance-none"
                >
                  <option value="">{t('suppliers.allRegions')}</option>
                  {FRENCH_REGIONS.map((r) => (
                    <option key={r} value={r}>{r}</option>
                  ))}
                </select>
              </div>
              <div className="relative">
                <Tag className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#9CA3AF] dark:text-[#737373] pointer-events-none" />
                <select
                  value={annuaireCategory}
                  onChange={(e) => setAnnuaireCategory(e.target.value)}
                  className="input pl-10 w-full appearance-none"
                >
                  <option value="">{t('suppliers.allCategories')}</option>
                  {SUPPLIER_CATEGORIES.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>
              <div className="relative">
                <Building2 className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#9CA3AF] dark:text-[#737373] pointer-events-none" />
                <select
                  value={annuaireType}
                  onChange={(e) => setAnnuaireType(e.target.value as '' | FrenchSupplier['type'])}
                  className="input pl-10 w-full appearance-none"
                >
                  <option value="">{t('suppliers.allTypes')}</option>
                  <option value="grossiste">{t('suppliers.typeWholesaler')}</option>
                  <option value="specialiste">{t('suppliers.typeSpecialist')}</option>
                  <option value="local">{t('suppliers.typeLocal')}</option>
                  <option value="national">{t('suppliers.typeNational')}</option>
                </select>
              </div>
              <label className="flex items-center gap-2 px-3 py-2 rounded-lg bg-[#FAFAFA] dark:bg-[#1A1A1A] cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={deliveryOnly}
                  onChange={(e) => setDeliveryOnly(e.target.checked)}
                  className="rounded border-[#D1D5DB] dark:border-[#2A2A2A] text-[#111111] dark:text-white focus:ring-[#111111] dark:focus:ring-white"
                />
                <Truck className="w-4 h-4 text-[#9CA3AF] dark:text-[#737373]" />
                <span className="text-sm text-[#6B7280] dark:text-[#A3A3A3]">{t('suppliers.deliveryOnly')}</span>
              </label>
            </div>
          </div>

          {/* Supplier Cards Grid */}
          {annuaireResults.length === 0 ? (
            <div className="bg-white dark:bg-[#0A0A0A] rounded-lg shadow p-12 text-center">
              <Search className="w-12 h-12 mx-auto text-[#6B7280] dark:text-[#A3A3A3] mb-3" />
              <p className="text-[#9CA3AF] dark:text-[#A3A3A3]">{t('suppliers.noMatchingSupplier')}</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {annuaireResults.map((supplier) => {
                const tc = TYPE_COLORS[supplier.type];
                return (
                  <div
                    key={supplier.name}
                    className="bg-white dark:bg-[#0A0A0A] rounded-lg shadow hover:shadow-md transition-shadow p-5 flex flex-col"
                  >
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <h3 className="font-semibold text-[#111111] dark:text-white leading-tight">
                        {supplier.name}
                      </h3>
                      <span className={`px-2 py-0.5 rounded text-xs font-medium whitespace-nowrap ${tc.bg} ${tc.text}`}>
                        {({grossiste: t('suppliers.typeWholesaler'), specialiste: t('suppliers.typeSpecialist'), local: t('suppliers.typeLocal'), national: t('suppliers.typeNational')} as Record<string, string>)[supplier.type]}
                      </span>
                    </div>
                    <p className="text-sm text-[#9CA3AF] dark:text-[#737373] mb-3 line-clamp-2">
                      {supplier.description}
                    </p>
                    <div className="flex flex-wrap gap-1 mb-3">
                      {supplier.categories.map((cat) => (
                        <span key={cat} className="px-2 py-0.5 rounded text-[10px] bg-[#F3F4F6] dark:bg-[#171717] text-[#6B7280] dark:text-[#A3A3A3] font-medium">
                          {cat}
                        </span>
                      ))}
                    </div>
                    {supplier.speciality && (
                      <p className="text-xs text-purple-600 dark:text-purple-400 mb-2 italic">
                        {supplier.speciality}
                      </p>
                    )}
                    <div className="text-xs text-[#9CA3AF] dark:text-[#A3A3A3] mb-3 flex items-start gap-1">
                      <MapPin className="w-3 h-3 mt-0.5 shrink-0" />
                      <span className="line-clamp-1">
                        {supplier.regions.length === FRENCH_REGIONS.length
                          ? t('suppliers.allFrance')
                          : supplier.regions.join(', ')}
                      </span>
                    </div>
                    <div className="mt-auto pt-3 border-t dark:border-[#1A1A1A] flex flex-wrap items-center gap-3 text-xs">
                      <span className={`flex items-center gap-1 ${supplier.delivery ? 'text-green-600 dark:text-green-400' : 'text-red-500 dark:text-red-400'}`}>
                        {supplier.delivery ? <Check className="w-3.5 h-3.5" /> : <X className="w-3.5 h-3.5" />}
                        Livraison
                      </span>
                      {supplier.minOrder && (
                        <span className="text-[#9CA3AF] dark:text-[#737373]">Min: {supplier.minOrder}</span>
                      )}
                      {supplier.website && (
                        <a
                          href={supplier.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="ml-auto flex items-center gap-1 text-[#111111] dark:text-white hover:underline"
                        >
                          <ExternalLink className="w-3 h-3" />
                          Site web
                        </a>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* ── Catalogue Transgourmet ─────────────────────────────────── */}
          <div className="mt-8">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <ShoppingCart className="w-5 h-5 text-red-500" />
                <h3 className="text-lg font-bold text-[#111111] dark:text-white">{t('suppliers.catalogTitle')}</h3>
                <span className="text-xs text-[#9CA3AF] dark:text-[#737373] ml-2">{catalogData.length} {t('suppliers.availableProducts')}</span>
              </div>
              {catalogSelected.size > 0 && (
                <button
                  disabled={addingCatalog}
                  onClick={async () => {
                    setAddingCatalog(true);
                    let added = 0;
                    const existingNames = new Set(ingredients.map(i => i.name.toLowerCase()));
                    const fc = catalogData.filter(p => (!catalogSearch || p.name.toLowerCase().includes(catalogSearch.toLowerCase())) && (!catalogCat || p.category === catalogCat));
                    for (const idx of catalogSelected) {
                      const p = fc[idx];
                      if (p && !existingNames.has(p.name.toLowerCase())) {
                        try {
                          await createIngredient({ name: p.name, unit: p.unit, pricePerUnit: p.prixMoy, category: p.category, allergens: [] } as any);
                          added++;
                          existingNames.add(p.name.toLowerCase());
                        } catch {}
                      }
                    }
                    setCatalogSelected(new Set());
                    await loadData();
                    showToast(`${added} ${t('suppliers.productsAdded')}`, 'success');
                    setAddingCatalog(false);
                  }}
                  className="flex items-center gap-1.5 px-4 py-2 text-sm font-medium bg-[#111111] dark:bg-white hover:bg-[#333] dark:hover:bg-[#E5E5E5] text-white dark:text-black rounded-lg disabled:opacity-50"
                >
                  <Plus className="w-4 h-4" />
                  {addingCatalog ? t('suppliers.addingInProgress') : `${t('suppliers.add')} ${catalogSelected.size} ${t('suppliers.products')}`}
                </button>
              )}
            </div>
            {/* Filters */}
            <div className="flex gap-2 mb-3">
              <div className="relative flex-1">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#9CA3AF] dark:text-[#737373]" />
                <input
                  type="text" placeholder={t('suppliers.searchProduct')} value={catalogSearch}
                  onChange={e => { setCatalogSearch(e.target.value); setCatalogPage(0); }}
                  className="input pl-10 w-full"
                />
              </div>
              <select
                value={catalogCat} onChange={e => { setCatalogCat(e.target.value); setCatalogPage(0); }}
                className="input w-48"
              >
                <option value="">{t('suppliers.allCategories')}</option>
                {[...new Set(catalogData.map(p => p.category))].sort().map(c => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
            {/* Table */}
            {(() => {
              const filtered = catalogData.filter(p =>
                (!catalogSearch || p.name.toLowerCase().includes(catalogSearch.toLowerCase())) &&
                (!catalogCat || p.category === catalogCat)
              );
              const pageSize = 50;
              const totalPages = Math.ceil(filtered.length / pageSize);
              const page = filtered.slice(catalogPage * pageSize, (catalogPage + 1) * pageSize);
              const existingNames = new Set(ingredients.map(i => i.name.toLowerCase()));
              return (
                <>
                  <div className="bg-white dark:bg-[#0A0A0A] rounded-lg shadow overflow-hidden">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="bg-[#FAFAFA] dark:bg-[#1A1A1A] text-left text-xs text-[#9CA3AF] dark:text-[#737373]">
                          <th className="px-3 py-2 w-8">
                            <input type="checkbox"
                              checked={page.length > 0 && page.every((_, i) => catalogSelected.has(catalogPage * pageSize + i))}
                              onChange={e => {
                                const next = new Set(catalogSelected);
                                page.forEach((_, i) => e.target.checked ? next.add(catalogPage * pageSize + i) : next.delete(catalogPage * pageSize + i));
                                setCatalogSelected(next);
                              }}
                              className="accent-neutral-900 dark:accent-white"
                            />
                          </th>
                          <th className="px-3 py-2">{t('suppliers.product')}</th>
                          <th className="px-3 py-2">{t('suppliers.category')}</th>
                          <th className="px-3 py-2">{t('suppliers.estimatedPrice')}</th>
                          <th className="px-3 py-2">{t('suppliers.unit')}</th>
                          <th className="px-3 py-2 w-20">{t('suppliers.action')}</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y dark:divide-[#1A1A1A]">
                        {page.map((p, i) => {
                          const globalIdx = catalogPage * pageSize + i;
                          const exists = existingNames.has(p.name.toLowerCase());
                          return (
                            <tr key={globalIdx} className={`hover:bg-[#FAFAFA] dark:hover:bg-[#171717]/30 ${exists ? 'opacity-50' : ''}`}>
                              <td className="px-3 py-2">
                                <input type="checkbox" disabled={exists}
                                  checked={catalogSelected.has(globalIdx)}
                                  onChange={() => setCatalogSelected(prev => {
                                    const next = new Set(prev);
                                    next.has(globalIdx) ? next.delete(globalIdx) : next.add(globalIdx);
                                    return next;
                                  })}
                                  className="accent-neutral-900 dark:accent-white"
                                />
                              </td>
                              <td className="px-3 py-2 text-[#9CA3AF] dark:text-[#A3A3A3]">{p.name}</td>
                              <td className="px-3 py-2"><span className="text-xs px-2 py-0.5 rounded bg-[#F3F4F6] dark:bg-[#171717] text-[#9CA3AF] dark:text-[#737373]">{p.category}</span></td>
                              <td className="px-3 py-2 font-medium text-[#111111] dark:text-white">{p.prixMoy.toFixed(2)} €</td>
                              <td className="px-3 py-2 text-[#9CA3AF] dark:text-[#737373]">{p.unit}</td>
                              <td className="px-3 py-2">
                                {exists ? (
                                  <span className="text-xs text-green-500">✓ {t('suppliers.added')}</span>
                                ) : (
                                  <button
                                    onClick={async () => {
                                      try {
                                        await createIngredient({ name: p.name, unit: p.unit, pricePerUnit: p.prixMoy, category: p.category, allergens: [] } as any);
                                        await loadData();
                                        showToast(`${p.name} ${t('suppliers.added')}`, 'success');
                                      } catch { showToast(t('suppliers.error'), 'error'); }
                                    }}
                                    className="text-xs px-2 py-1 rounded bg-[#111111] dark:bg-white hover:bg-[#333] dark:hover:bg-[#E5E5E5] text-white dark:text-black"
                                  >
                                    + {t('suppliers.add')}
                                  </button>
                                )}
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                  {/* Pagination */}
                  {totalPages > 1 && (
                    <div className="flex items-center justify-between mt-3">
                      <span className="text-xs text-[#9CA3AF] dark:text-[#737373]">{filtered.length} {t('suppliers.results')}</span>
                      <div className="flex gap-1">
                        <button disabled={catalogPage === 0} onClick={() => setCatalogPage(p => p - 1)} className="px-3 py-1 text-xs rounded border dark:border-[#2A2A2A] disabled:opacity-30 hover:bg-[#F3F4F6] dark:hover:bg-[#171717]">←</button>
                        <span className="px-3 py-1 text-xs text-[#9CA3AF] dark:text-[#737373]">{catalogPage + 1}{" / "}{totalPages}</span>
                        <button disabled={catalogPage >= totalPages - 1} onClick={() => setCatalogPage(p => p + 1)} className="px-3 py-1 text-xs rounded border dark:border-[#2A2A2A] disabled:opacity-30 hover:bg-[#F3F4F6] dark:hover:bg-[#171717]">→</button>
                      </div>
                    </div>
                  )}
                </>
              );
            })()}
          </div>
        </>
      )}

      {/* ================================================================== */}
      {/* TAB: Comparateur de prix                                           */}
      {/* ================================================================== */}
      {activeTab === 'comparateur' && (
        <>
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <h2 className="text-2xl font-bold text-[#111111] dark:text-white flex items-center gap-2">
              <Scale className="w-6 h-6 text-emerald-500" />
              Comparateur de prix
            </h2>
            {totalPotentialSavings > 0 && (
              <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800">
                <Euro className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                <span className="text-sm font-semibold text-emerald-700 dark:text-emerald-300">
                  Economie potentielle totale : {totalPotentialSavings.toFixed(2)} EUR/mois
                </span>
              </div>
            )}
          </div>

          {/* Stats cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <div className="bg-white dark:bg-[#0A0A0A] rounded-lg shadow p-5">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-[#9CA3AF] dark:text-[#737373]">Produits comparables</span>
                <div className="p-2 rounded-lg bg-[#F3F4F6] dark:bg-[#171717]"><Scale className="w-5 h-5 text-[#111111] dark:text-white" /></div>
              </div>
              <div className="text-2xl font-bold text-[#111111] dark:text-white">{comparatorData.length}</div>
            </div>
            <div className="bg-white dark:bg-[#0A0A0A] rounded-lg shadow p-5">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-[#9CA3AF] dark:text-[#737373]">Fournisseurs actifs</span>
                <div className="p-2 rounded-lg bg-[#F3F4F6] dark:bg-[#171717]"><Truck className="w-5 h-5 text-[#111111] dark:text-white" /></div>
              </div>
              <div className="text-2xl font-bold text-[#111111] dark:text-white">{suppliers.length}</div>
            </div>
            <div className="bg-white dark:bg-[#0A0A0A] rounded-lg shadow p-5">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-[#9CA3AF] dark:text-[#737373]">Economie potentielle</span>
                <div className="p-2 rounded-lg bg-[#F3F4F6] dark:bg-[#171717]"><Euro className="w-5 h-5 text-[#111111] dark:text-white" /></div>
              </div>
              <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">{totalPotentialSavings.toFixed(2)} EUR</div>
              <div className="text-xs text-[#9CA3AF] dark:text-[#737373]">par mois</div>
            </div>
            <div className="bg-white dark:bg-[#0A0A0A] rounded-lg shadow p-5">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-[#9CA3AF] dark:text-[#737373]">Alertes prix</span>
                <div className="p-2 rounded-lg bg-[#F3F4F6] dark:bg-[#171717]"><AlertTriangle className="w-5 h-5 text-[#111111] dark:text-white" /></div>
              </div>
              <div className="text-2xl font-bold text-[#111111] dark:text-white">{Object.values(priceAlerts).filter(a => a.pctChange > 0).length}</div>
              <div className="text-xs text-[#9CA3AF] dark:text-[#737373]">hausses &gt; 5%</div>
            </div>
          </div>

          {comparatorData.length === 0 ? (
            <div className="bg-white dark:bg-[#0A0A0A] rounded-lg shadow p-12 text-center">
              <Scale className="w-12 h-12 mx-auto text-[#6B7280] dark:text-[#A3A3A3] mb-3" />
              <p className="text-[#9CA3AF] dark:text-[#A3A3A3] mb-2">Aucun produit comparable</p>
              <p className="text-sm text-[#9CA3AF] dark:text-[#A3A3A3]">
                Liez le meme ingredient a plusieurs fournisseurs pour activer la comparaison des prix.
              </p>
            </div>
          ) : (
            <div className="bg-white dark:bg-[#0A0A0A] rounded-lg shadow overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-[#FAFAFA] dark:bg-[#1A1A1A] text-left text-xs text-[#9CA3AF] dark:text-[#737373]">
                      <th className="px-4 py-3 font-medium">Ingredient</th>
                      {suppliers.filter(s => (s.ingredients || []).length > 0).map(s => (
                        <th key={s.id} className="px-4 py-3 font-medium text-center whitespace-nowrap">
                          <div className="flex flex-col items-center gap-0.5">
                            <span>{s.name}</span>
                            {(() => {
                              const score = supplierScores[s.id] ?? 0;
                              const color = score > 7 ? 'text-green-600 dark:text-green-400' : score >= 5 ? 'text-orange-500' : 'text-red-500';
                              return <span className={`text-[10px] font-bold ${color}`}>{score}/10</span>;
                            })()}
                          </div>
                        </th>
                      ))}
                      <th className="px-4 py-3 font-medium text-right whitespace-nowrap">Economie/mois</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y dark:divide-[#1A1A1A]">
                    {comparatorData.map((item) => {
                      const allSuppliers = suppliers.filter(s => (s.ingredients || []).length > 0);
                      const entryMap: Record<number, typeof item.entries[0]> = {};
                      item.entries.forEach(e => { entryMap[e.supplierId] = e; });
                      return (
                        <tr key={item.key} className="hover:bg-[#FAFAFA] dark:hover:bg-[#171717]/30">
                          <td className="px-4 py-3">
                            <div className="font-medium text-[#9CA3AF] dark:text-[#E5E5E5]">{item.displayName}</div>
                            <div className="text-xs text-[#9CA3AF] dark:text-[#737373]">{item.entries.length} fournisseurs</div>
                          </td>
                          {allSuppliers.map(s => {
                            const entry = entryMap[s.id];
                            if (!entry) {
                              return <td key={s.id} className="px-4 py-3 text-center text-[#6B7280] dark:text-[#A3A3A3]">--</td>;
                            }
                            const isCheapest = entry.pricePerUnit === item.cheapestPrice;
                            return (
                              <td key={s.id} className={`px-4 py-3 text-center ${isCheapest ? 'bg-green-50 dark:bg-green-900/20' : ''}`}>
                                <span className={`font-medium ${isCheapest ? 'text-green-600 dark:text-green-400' : 'text-[#6B7280] dark:text-[#737373]'}`}>
                                  {entry.pricePerUnit.toFixed(2)} EUR/{entry.unit}
                                </span>
                                {isCheapest && item.entries.length > 1 && (
                                  <div className="mt-1">
                                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-300">
                                      <Award className="w-3 h-3" />
                                      Meilleur prix
                                    </span>
                                  </div>
                                )}
                              </td>
                            );
                          })}
                          <td className="px-4 py-3 text-right">
                            {item.savingsPerMonth > 0 ? (
                              <span className="font-bold text-emerald-600 dark:text-emerald-400">
                                {item.savingsPerMonth.toFixed(2)} EUR
                              </span>
                            ) : (
                              <span className="text-[#9CA3AF] dark:text-[#737373]">--</span>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                  <tfoot>
                    <tr className="bg-[#FAFAFA] dark:bg-[#1A1A1A] font-semibold">
                      <td className="px-4 py-3 text-[#9CA3AF] dark:text-[#E5E5E5]">Total</td>
                      {suppliers.filter(s => (s.ingredients || []).length > 0).map(s => (
                        <td key={s.id} className="px-4 py-3" />
                      ))}
                      <td className="px-4 py-3 text-right text-emerald-600 dark:text-emerald-400 text-lg">
                        {totalPotentialSavings.toFixed(2)} EUR/mois
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>
          )}

          {/* Price alerts section */}
          {Object.keys(priceAlerts).length > 0 && (
            <div className="mt-6">
              <h3 className="text-lg font-bold text-[#111111] dark:text-white mb-4 flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-amber-500" />
                Alertes de prix
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
                {ingredients
                  .filter(ing => priceAlerts[ing.id])
                  .map(ing => {
                    const alert = priceAlerts[ing.id];
                    const supplier = suppliers.find(s => s.id === ing.supplierId);
                    const isIncrease = alert.pctChange > 0;
                    return (
                      <div
                        key={ing.id}
                        className={`p-3 rounded-lg border ${
                          isIncrease
                            ? 'bg-red-50 dark:bg-red-900/10 border-red-200 dark:border-red-800'
                            : 'bg-green-50 dark:bg-green-900/10 border-green-200 dark:border-green-800'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <span className="font-medium text-sm text-[#9CA3AF] dark:text-[#E5E5E5]">{ing.name}</span>
                            {supplier && <span className="text-xs text-[#9CA3AF] dark:text-[#737373] ml-2">({supplier.name})</span>}
                          </div>
                          <span className={`text-sm font-bold px-2 py-0.5 rounded-full ${
                            isIncrease
                              ? 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400'
                              : 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400'
                          }`}>
                            {isIncrease ? '↑' : '↓'} {isIncrease ? '+' : ''}{alert.pctChange}%
                          </span>
                        </div>
                        <div className="text-xs text-[#9CA3AF] dark:text-[#737373] mt-1">
                          Prix actuel : {ing.pricePerUnit.toFixed(2)} EUR/{ing.unit}
                        </div>
                      </div>
                    );
                  })}
              </div>
            </div>
          )}
        </>
      )}

      {/* ================================================================== */}
      {/* Add / Edit Modal                                                   */}
      {/* ================================================================== */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingSupplier ? t('suppliers.editSupplier') : t('suppliers.addSupplier')}
      >
        <div className="space-y-4 max-h-[70vh] overflow-y-auto pr-1">
          {/* Nom */}
          <div>
            <label className="block text-sm font-medium text-[#9CA3AF] dark:text-[#A3A3A3] mb-1">
              {t('suppliers.supplierName')} <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => setField('name', e.target.value)}
              className="input w-full"
              placeholder={t('suppliers.namePlaceholder')}
            />
          </div>

          {/* Contact name */}
          <div>
            <label className="block text-sm font-medium text-[#9CA3AF] dark:text-[#A3A3A3] mb-1">{t('suppliers.contactName')}</label>
            <input
              type="text"
              value={form.contactName}
              onChange={(e) => setField('contactName', e.target.value)}
              className="input w-full"
            />
          </div>

          {/* Phone + Email */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-[#9CA3AF] dark:text-[#A3A3A3] mb-1">{t('suppliers.phone')}</label>
              <input
                type="tel"
                value={form.phone}
                onChange={(e) => setField('phone', e.target.value)}
                className="input w-full"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#9CA3AF] dark:text-[#A3A3A3] mb-1">{t('suppliers.email')}</label>
              <input
                type="email"
                value={form.email}
                onChange={(e) => setField('email', e.target.value)}
                className="input w-full"
              />
            </div>
          </div>

          {/* WhatsApp Phone */}
          <div>
            <label className="block text-sm font-medium text-[#9CA3AF] dark:text-[#A3A3A3] mb-1">
              <span className="flex items-center gap-1.5">
                <MessageCircle className="w-3.5 h-3.5 text-[#25D366]" />
                {t('suppliers.whatsappPhone')}
              </span>
            </label>
            <input
              type="tel"
              value={form.whatsappPhone}
              onChange={(e) => setField('whatsappPhone', e.target.value)}
              className="input w-full"
              placeholder="+33612345678"
            />
            <p className="text-xs text-[#9CA3AF] dark:text-[#737373] mt-1">Format international : +33612345678</p>
          </div>

          {/* Address */}
          <div>
            <label className="block text-sm font-medium text-[#9CA3AF] dark:text-[#A3A3A3] mb-1">{t('suppliers.address')}</label>
            <input
              type="text"
              value={form.address}
              onChange={(e) => setField('address', e.target.value)}
              className="input w-full"
            />
          </div>

          {/* Postal code + City */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-[#9CA3AF] dark:text-[#A3A3A3] mb-1">{t('suppliers.postalCode')}</label>
              <input
                type="text"
                value={form.postalCode}
                onChange={(e) => setField('postalCode', e.target.value)}
                className="input w-full"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#9CA3AF] dark:text-[#A3A3A3] mb-1">{t('suppliers.city')}</label>
              <input
                type="text"
                value={form.city}
                onChange={(e) => setField('city', e.target.value)}
                className="input w-full"
              />
            </div>
          </div>

          {/* Region + Country */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-[#9CA3AF] dark:text-[#A3A3A3] mb-1">{t('suppliers.region')}</label>
              <select
                value={form.region}
                onChange={(e) => setField('region', e.target.value)}
                className="input w-full"
              >
                <option value="">-- {t('suppliers.select')} --</option>
                {FRENCH_REGIONS.map((r) => (
                  <option key={r} value={r}>{r}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-[#9CA3AF] dark:text-[#A3A3A3] mb-1">{t('suppliers.country')}</label>
              <input
                type="text"
                value={form.country}
                onChange={(e) => setField('country', e.target.value)}
                className="input w-full"
              />
            </div>
          </div>

          {/* SIRET + Website */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-[#9CA3AF] dark:text-[#A3A3A3] mb-1">{t('suppliers.siret')}</label>
              <input
                type="text"
                value={form.siret}
                onChange={(e) => setField('siret', e.target.value)}
                className="input w-full"
                placeholder={t('suppliers.siretPlaceholder')}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#9CA3AF] dark:text-[#A3A3A3] mb-1">{t('suppliers.websiteLabel')}</label>
              <input
                type="url"
                value={form.website}
                onChange={(e) => setField('website', e.target.value)}
                className="input w-full"
                placeholder="https://..."
              />
            </div>
          </div>

          {/* Categories multi-select */}
          <div>
            <label className="block text-sm font-medium text-[#9CA3AF] dark:text-[#A3A3A3] mb-2">{t('suppliers.categories')}</label>
            <div className="flex flex-wrap gap-2">
              {INGREDIENT_CATEGORIES.map((cat) => (
                <label
                  key={cat}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm cursor-pointer select-none border transition-colors ${
                    form.categories.includes(cat)
                      ? 'bg-[#111111] dark:bg-white border-[#111111] dark:border-white text-white dark:text-black'
                      : 'bg-white dark:bg-[#171717] border-[#E5E7EB] dark:border-[#2A2A2A] text-[#6B7280] dark:text-[#737373] hover:bg-[#FAFAFA] dark:hover:bg-[#171717]'
                  }`}
                >
                  <input
                    type="checkbox"
                    className="sr-only"
                    checked={form.categories.includes(cat)}
                    onChange={() => toggleCategory(cat)}
                  />
                  {form.categories.includes(cat) && <Check className="w-3.5 h-3.5" />}
                  {cat}
                </label>
              ))}
            </div>
          </div>

          {/* Delivery toggle */}
          <div>
            <label className="flex items-center gap-3 cursor-pointer select-none">
              <button
                type="button"
                onClick={() => setField('delivery', !form.delivery)}
                className="focus:outline-none"
              >
                {form.delivery
                  ? <ToggleRight className="w-8 h-8 text-green-500" />
                  : <ToggleLeft className="w-8 h-8 text-[#9CA3AF] dark:text-[#737373]" />}
              </button>
              <span className="text-sm font-medium text-[#9CA3AF] dark:text-[#A3A3A3]">{t('suppliers.deliveryAvailable')}</span>
            </label>
          </div>

          {/* Min order + Payment terms */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-[#9CA3AF] dark:text-[#A3A3A3] mb-1">{t('suppliers.minimumOrder')}</label>
              <input
                type="text"
                value={form.minOrder}
                onChange={(e) => setField('minOrder', e.target.value)}
                className="input w-full"
                placeholder={t('suppliers.minOrderPlaceholder')}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#9CA3AF] dark:text-[#A3A3A3] mb-1">{t('suppliers.paymentTerms')}</label>
              <input
                type="text"
                value={form.paymentTerms}
                onChange={(e) => setField('paymentTerms', e.target.value)}
                className="input w-full"
                placeholder={t('suppliers.paymentTermsPlaceholder')}
              />
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-sm font-medium text-[#9CA3AF] dark:text-[#A3A3A3] mb-1">{t('suppliers.notes')}</label>
            <textarea
              value={form.notes}
              onChange={(e) => setField('notes', e.target.value)}
              rows={3}
              className="input w-full resize-none"
              placeholder={t('suppliers.notesPlaceholder')}
            />
          </div>
        </div>

        {/* Modal footer */}
        <div className="flex justify-end gap-3 mt-6 pt-4 border-t dark:border-[#1A1A1A]">
          <button
            onClick={() => setModalOpen(false)}
            className="px-4 py-2 rounded-lg font-medium border border-[#D1D5DB] dark:border-[#2A2A2A] text-[#9CA3AF] dark:text-[#A3A3A3] hover:bg-[#FAFAFA] dark:hover:bg-[#171717] transition-colors"
          >
            {t('suppliers.cancel')}
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="btn btn-primary flex items-center gap-2 disabled:opacity-50"
          >
            {saving ? (
              <>
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                {t('suppliers.saving')}
              </>
            ) : (
              editingSupplier ? t('suppliers.update') : t('suppliers.create')
            )}
          </button>
        </div>
      </Modal>

      {/* ================================================================== */}
      {/* Score Comparison Modal                                             */}
      {/* ================================================================== */}
      <Modal isOpen={showScoreCompare} onClose={() => setShowScoreCompare(false)} title="Comparer les fournisseurs">
        {(() => {
          const scoredSuppliers = suppliers
            .map(s => ({ supplier: s, score: backendScores[s.id] }))
            .filter(x => x.score)
            .sort((a, b) => (b.score?.scores?.global ?? 0) - (a.score?.scores?.global ?? 0));

          if (scoredSuppliers.length === 0) {
            return <p className="text-sm text-[#9CA3AF] dark:text-[#737373] py-6 text-center">Aucun score disponible.</p>;
          }

          return (
            <div className="overflow-x-auto max-h-[70vh]">
              <table className="w-full text-sm">
                <thead className="sticky top-0 bg-[#FAFAFA] dark:bg-[#0A0A0A] z-10">
                  <tr>
                    <th className="text-left px-3 py-2.5 text-xs text-[#9CA3AF] dark:text-[#737373] font-medium">Fournisseur</th>
                    <th className="text-center px-3 py-2.5 text-xs text-[#9CA3AF] dark:text-[#737373] font-medium">
                      <div className="flex items-center justify-center gap-1"><Star className="w-3 h-3" /> Global</div>
                    </th>
                    <th className="text-center px-3 py-2.5 text-xs text-[#9CA3AF] dark:text-[#737373] font-medium">
                      <div className="flex items-center justify-center gap-1"><Truck className="w-3 h-3" /> Fiabilite</div>
                    </th>
                    <th className="text-center px-3 py-2.5 text-xs text-[#9CA3AF] dark:text-[#737373] font-medium">
                      <div className="flex items-center justify-center gap-1"><TrendingUp className="w-3 h-3" /> Prix</div>
                    </th>
                    <th className="text-center px-3 py-2.5 text-xs text-[#9CA3AF] dark:text-[#737373] font-medium">
                      <div className="flex items-center justify-center gap-1"><Package className="w-3 h-3" /> Catalogue</div>
                    </th>
                    <th className="text-center px-3 py-2.5 text-xs text-[#9CA3AF] dark:text-[#737373] font-medium">
                      <div className="flex items-center justify-center gap-1"><Clock className="w-3 h-3" /> Historique</div>
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E5E7EB]/50">
                  {scoredSuppliers.map(({ supplier, score }, idx) => {
                    const g = score?.scores?.global ?? 0;
                    const isTop = g > 80;
                    return (
                      <tr key={supplier.id} className={`hover:bg-[#F3F4F6] dark:hover:bg-[#171717]/30 ${idx === 0 ? 'bg-[#FAFAFA] dark:bg-[#0A0A0A]' : ''}`}>
                        <td className="px-3 py-3">
                          <div className="flex items-center gap-2">
                            <CircularScore score={g} size={32} strokeWidth={3} />
                            <div>
                              <span className="font-medium text-[#111111] dark:text-white text-sm">{supplier.name}</span>
                              {isTop && (
                                <span className="ml-1.5 inline-flex items-center gap-0.5 text-[9px] px-1.5 py-0.5 rounded-full bg-teal-500/20 text-teal-300 font-bold">
                                  <Award className="w-2.5 h-2.5" /> Top
                                </span>
                              )}
                            </div>
                          </div>
                        </td>
                        <td className="px-3 py-3 text-center">
                          <span className={`font-bold text-sm ${g > 70 ? 'text-teal-400' : g >= 40 ? 'text-amber-400' : 'text-red-400'}`}>{g}</span>
                        </td>
                        {[score?.scores?.fiabilite, score?.scores?.competitivite, score?.scores?.diversite, score?.scores?.historique].map((val, i) => {
                          const v = val ?? 0;
                          const c = v > 70 ? 'text-teal-400' : v >= 40 ? 'text-amber-400' : 'text-red-400';
                          return (
                            <td key={i} className="px-3 py-3 text-center">
                              <div className="flex flex-col items-center gap-1">
                                <span className={`font-semibold text-xs ${c}`}>{v}</span>
                                <div className="w-12 h-1.5 bg-[#E5E7EB] dark:bg-[#1A1A1A] rounded-full overflow-hidden">
                                  <div className={`h-full rounded-full ${v > 70 ? 'bg-teal-500' : v >= 40 ? 'bg-amber-500' : 'bg-red-500'}`} style={{ width: `${Math.max(2, v)}%` }} />
                                </div>
                              </div>
                            </td>
                          );
                        })}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          );
        })()}
      </Modal>

      {/* ================================================================== */}
      {/* Delete confirmation                                                */}
      {/* ================================================================== */}
      {/* ── CSV Price Import Modal ── */}
      <Modal isOpen={showImportModal} onClose={closeImportModal} title={`Importer tarif — ${detailSupplier?.name || ''}`}>
        <div className="space-y-5">
          {/* Template download */}
          <div className="flex items-center justify-between px-4 py-3 bg-[#F3F4F6] dark:bg-[#0F0F0F] rounded-xl border border-[#E5E7EB] dark:border-[#1A1A1A]">
            <div className="flex items-center gap-2 text-sm text-[#6B7280] dark:text-[#A3A3A3]">
              <FileSpreadsheet className="w-4 h-4 text-[#111111] dark:text-white" />
              <span>Format attendu : CSV avec separateur <code className="font-mono bg-[#E5E7EB] dark:bg-[#1A1A1A] px-1.5 py-0.5 rounded text-xs text-[#111111] dark:text-white">;</code></span>
            </div>
            <a
              href="/templates/supplier-price-template.csv"
              download="modele-tarif-fournisseur.csv"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#111111] dark:bg-white hover:bg-[#333] dark:hover:bg-[#E5E5E5] text-white dark:text-black text-xs font-medium transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
              Modele CSV
            </a>
          </div>

          {/* Drop zone */}
          {!importResult && (
            <div
              onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
              onDragLeave={() => setDragOver(false)}
              onDrop={handleImportDrop}
              className={`relative border-2 border-dashed rounded-xl p-8 text-center transition-all cursor-pointer ${
                dragOver
                  ? 'border-[#111111] dark:border-white bg-[#F3F4F6] dark:bg-[#0F0F0F]'
                  : 'border-[#D1D5DB] dark:border-[#333] hover:border-[#9CA3AF] dark:hover:border-[#555]'
              }`}
              onClick={() => {
                const input = document.createElement('input');
                input.type = 'file';
                input.accept = '.csv,.txt';
                input.onchange = (e) => {
                  const file = (e.target as HTMLInputElement).files?.[0];
                  if (file) handleImportFile(file);
                };
                input.click();
              }}
            >
              <Upload className={`w-10 h-10 mx-auto mb-3 ${dragOver ? 'text-[#111111] dark:text-white' : 'text-[#D1D5DB] dark:text-[#555]'}`} />
              {importFile ? (
                <div>
                  <p className="text-sm font-medium text-[#111111] dark:text-white">{importFile.name}</p>
                  <p className="text-xs text-[#9CA3AF] dark:text-[#737373] mt-1">{(importFile.size / 1024).toFixed(1)} Ko</p>
                </div>
              ) : (
                <div>
                  <p className="text-sm text-[#6B7280] dark:text-[#A3A3A3]">Glissez votre fichier CSV ici</p>
                  <p className="text-xs text-[#9CA3AF] dark:text-[#737373] mt-1">ou cliquez pour parcourir</p>
                </div>
              )}
            </div>
          )}

          {/* Preview table */}
          {importPreview.length > 0 && !importResult && (
            <div>
              <h4 className="text-sm font-semibold text-[#111111] dark:text-white mb-2">Apercu ({Math.min(importPreview.length - 1, 5)} premieres lignes)</h4>
              <div className="overflow-x-auto rounded-lg border border-[#E5E7EB] dark:border-[#1A1A1A]">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-[#F3F4F6] dark:bg-[#0F0F0F]">
                      {importPreview[0]?.map((h, i) => (
                        <th key={i} className="px-3 py-2 text-left text-xs font-semibold text-[#6B7280] dark:text-[#A3A3A3] uppercase tracking-wide">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#E5E7EB] dark:divide-[#1A1A1A]">
                    {importPreview.slice(1).map((row, i) => (
                      <tr key={i} className="hover:bg-[#FAFAFA] dark:hover:bg-[#0A0A0A]">
                        {row.map((cell, j) => (
                          <td key={j} className="px-3 py-2 text-[#111111] dark:text-[#E5E5E5]">{cell}</td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Import button */}
          {importCsvText && !importResult && (
            <button
              onClick={handleImportSubmit}
              disabled={importLoading}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-[#111111] dark:bg-white hover:bg-[#333] dark:hover:bg-[#E5E5E5] text-white dark:text-black font-semibold text-sm disabled:opacity-50 transition-colors"
            >
              {importLoading ? (
                <>
                  <span className="w-4 h-4 border-2 border-white/30 dark:border-black/30 border-t-white dark:border-t-black rounded-full animate-spin" />
                  Import en cours...
                </>
              ) : (
                <>
                  <Upload className="w-4 h-4" />
                  Importer les prix
                </>
              )}
            </button>
          )}

          {/* Results summary */}
          {importResult && (
            <div className="space-y-4">
              {/* Success count */}
              {importResult.updated > 0 && (
                <div className="flex items-start gap-3 p-4 bg-green-50 dark:bg-green-900/10 border border-green-200 dark:border-green-800/30 rounded-xl">
                  <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400 shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-semibold text-green-800 dark:text-green-300">{importResult.updated} prix mis a jour</p>
                    <div className="mt-1 flex flex-wrap gap-1">
                      {importResult.updatedNames.map((n, i) => (
                        <span key={i} className="px-2 py-0.5 rounded-full text-xs bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300">{n}</span>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Not found */}
              {importResult.notFound.length > 0 && (
                <div className="flex items-start gap-3 p-4 bg-amber-50 dark:bg-amber-900/10 border border-amber-200 dark:border-amber-800/30 rounded-xl">
                  <AlertCircle className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-semibold text-amber-800 dark:text-amber-300">{importResult.notFound.length} ingredients non trouves</p>
                    <div className="mt-1 flex flex-wrap gap-1">
                      {importResult.notFound.map((n, i) => (
                        <span key={i} className="px-2 py-0.5 rounded-full text-xs bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300">{n}</span>
                      ))}
                    </div>
                    <p className="text-xs text-amber-600/80 dark:text-amber-400/60 mt-2">Verifiez que les noms correspondent exactement a vos ingredients.</p>
                  </div>
                </div>
              )}

              {/* Errors */}
              {importResult.errors.length > 0 && (
                <div className="flex items-start gap-3 p-4 bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-800/30 rounded-xl">
                  <X className="w-5 h-5 text-red-600 dark:text-red-400 shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-semibold text-red-800 dark:text-red-300">{importResult.errors.length} erreurs</p>
                    <ul className="mt-1 text-xs text-red-700 dark:text-red-300 space-y-0.5">
                      {importResult.errors.map((e, i) => (
                        <li key={i}>{e}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}

              {/* Close / reimport */}
              <div className="flex gap-3">
                <button
                  onClick={closeImportModal}
                  className="flex-1 px-4 py-2.5 rounded-xl bg-[#111111] dark:bg-white hover:bg-[#333] dark:hover:bg-[#E5E5E5] text-white dark:text-black font-medium text-sm transition-colors"
                >
                  Fermer
                </button>
                <button
                  onClick={resetImportState}
                  className="flex-1 px-4 py-2.5 rounded-xl border border-[#E5E7EB] dark:border-[#333] hover:bg-[#F3F4F6] dark:hover:bg-[#171717] text-[#111111] dark:text-white font-medium text-sm transition-colors"
                >
                  Nouvel import
                </button>
              </div>
            </div>
          )}
        </div>
      </Modal>

      <ConfirmDialog
        isOpen={!!deleteTarget}
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
        title={t('suppliers.deleteSupplier')}
        message={`${t('suppliers.deleteConfirm')} "${deleteTarget?.name}" ?`}
      />
    </div>
  );
}
