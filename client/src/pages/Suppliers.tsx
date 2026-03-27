import { useState, useEffect, useMemo, useCallback } from 'react';
import {
  Truck, Package, Search, ExternalLink, Check, X, Filter, Globe, MapPin,
  Tag, Building2, Plus, Edit2, Trash2, Link2, Phone, Mail, ChevronDown,
  ChevronUp, FileText, ToggleLeft, ToggleRight, Euro, BarChart3, ShoppingCart,
  Star, Clock, TrendingUp, ArrowRightLeft, Zap,
} from 'lucide-react';
import {
  fetchSuppliers, createSupplier, updateSupplier, deleteSupplier,
  linkSupplierIngredients, fetchIngredients, updateIngredient, createIngredient,
} from '../services/api';
import type { Supplier, Ingredient } from '../types';
import { INGREDIENT_CATEGORIES } from '../types';
import {
  FRENCH_SUPPLIERS,
  FRENCH_REGIONS,
  SUPPLIER_CATEGORIES,
  searchSuppliers,
} from '../data/frenchSuppliers';
import type { FrenchSupplier } from '../data/frenchSuppliers';
import { searchCatalog, type CatalogProduct } from '../data/productCatalog';
import Modal from '../components/Modal';
import ConfirmDialog from '../components/ConfirmDialog';
import { useToast } from '../hooks/useToast';

// ── helpers ──────────────────────────────────────────────────────────────────

const TYPE_COLORS: Record<FrenchSupplier['type'], { bg: string; text: string; label: string }> = {
  grossiste: { bg: 'bg-blue-100 dark:bg-blue-900/40', text: 'text-blue-700 dark:text-blue-300', label: 'Grossiste' },
  specialiste: { bg: 'bg-purple-100 dark:bg-purple-900/40', text: 'text-purple-700 dark:text-purple-300', label: 'Spécialiste' },
  local: { bg: 'bg-green-100 dark:bg-green-900/40', text: 'text-green-700 dark:text-green-300', label: 'Local' },
  national: { bg: 'bg-orange-100 dark:bg-orange-900/40', text: 'text-orange-700 dark:text-orange-300', label: 'National' },
};

type TabId = 'mes-fournisseurs' | 'annuaire';

interface SupplierFormData {
  name: string;
  contactName: string;
  phone: string;
  email: string;
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
  const ratings: SupplierRating[] = [
    { reliability: 5, deliveryDays: '24h', minOrderAmount: '150 EUR' },
    { reliability: 4, deliveryDays: '48h', minOrderAmount: '200 EUR' },
    { reliability: 3, deliveryDays: '72h', minOrderAmount: '100 EUR' },
    { reliability: 5, deliveryDays: '24-48h', minOrderAmount: '300 EUR' },
    { reliability: 4, deliveryDays: '48-72h', minOrderAmount: '80 EUR' },
    { reliability: 3, deliveryDays: '3-5 jours', minOrderAmount: '250 EUR' },
  ];
  return ratings[supplierId % ratings.length];
}

function getMockPriceHistory(basePrice: number): number[] {
  const points: number[] = [];
  let price = basePrice * (0.9 + Math.random() * 0.1);
  for (let i = 0; i < 30; i++) {
    price += (Math.random() - 0.48) * basePrice * 0.03;
    price = Math.max(basePrice * 0.75, Math.min(basePrice * 1.25, price));
    points.push(Math.round(price * 100) / 100);
  }
  return points;
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

// ── Component ────────────────────────────────────────────────────────────────

export default function Suppliers() {
  const { showToast } = useToast();

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

  // Expand / form / delete
  const [expandedId, setExpandedId] = useState<number | null>(null);
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

  // Quick-add from templates
  const [showQuickAdd, setShowQuickAdd] = useState(false);

  // Catalogue Transgourmet
  const [catalogData, setCatalogData] = useState<CatalogProduct[]>([]);
  const [catalogSearch, setCatalogSearch] = useState('');
  const [catalogCat, setCatalogCat] = useState('');
  const [catalogPage, setCatalogPage] = useState(0);
  const [catalogSelected, setCatalogSelected] = useState<Set<number>>(new Set());
  const [addingCatalog, setAddingCatalog] = useState(false);

  // Load catalog for annuaire
  useEffect(() => {
    fetch('/catalog.json').then(r => r.json()).then(setCatalogData).catch(() => {});
  }, []);

  // ── data loading ───────────────────────────────────────────────────────────

  const loadData = useCallback(async () => {
    try {
      const [s, i] = await Promise.all([fetchSuppliers(), fetchIngredients()]);
      setSuppliers(s);
      setIngredients(i);
    } catch {
      showToast('Erreur de chargement', 'error');
    } finally {
      setLoading(false);
    }
  }, [showToast]);

  useEffect(() => { loadData(); }, [loadData]);

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
      showToast('Le nom du fournisseur est requis', 'error');
      return;
    }
    setSaving(true);
    try {
      const payload = {
        ...form,
        contactName: form.contactName || null,
        phone: form.phone || null,
        email: form.email || null,
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
        showToast('Fournisseur mis à jour', 'success');
      } else {
        await createSupplier(payload as any);
        showToast('Fournisseur créé', 'success');
      }
      setModalOpen(false);
      await loadData();
    } catch (e: any) {
      showToast(e.message || 'Erreur', 'error');
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    if (!deleteTarget) return;
    try {
      await deleteSupplier(deleteTarget.id);
      showToast('Fournisseur supprimé', 'success');
      setDeleteTarget(null);
      await loadData();
    } catch (e: any) {
      showToast(e.message || 'Erreur', 'error');
    }
  }

  async function handleLink(s: Supplier) {
    setLinking(s.id);
    try {
      const result = await linkSupplierIngredients(s.id);
      showToast(`${result.linked} ingrédient(s) lié(s) à ${result.supplierName}`, 'success');
      await loadData();
    } catch (e: any) {
      showToast(e.message || 'Erreur', 'error');
    } finally {
      setLinking(null);
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

  // ── render ─────────────────────────────────────────────────────────────────

  if (loading) return <div className="text-center py-12 text-slate-500 dark:text-slate-400">Chargement...</div>;

  return (
    <div>
      {/* Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div className="flex gap-1 bg-slate-100 dark:bg-slate-800 rounded-lg p-1 w-fit">
          <button
            onClick={() => setActiveTab('mes-fournisseurs')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              activeTab === 'mes-fournisseurs'
                ? 'bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-100 shadow-sm'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300'
            }`}
          >
            <Truck className="w-4 h-4 inline-block mr-1.5 -mt-0.5" />
            Mes fournisseurs
          </button>
          <button
            onClick={() => setActiveTab('annuaire')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              activeTab === 'annuaire'
                ? 'bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-100 shadow-sm'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300'
            }`}
          >
            <Globe className="w-4 h-4 inline-block mr-1.5 -mt-0.5" />
            Annuaire fournisseurs France
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
            <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100">Fournisseurs</h2>
            <div className="flex items-center gap-2">
              {/* Quick-add dropdown */}
              <div className="relative">
                <button onClick={() => setShowQuickAdd(!showQuickAdd)} className="flex items-center gap-2 px-3 py-2 text-sm font-medium border border-slate-300 dark:border-slate-600 rounded-lg text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors">
                  <Zap className="w-4 h-4 text-amber-500" />
                  Ajout rapide
                  <ChevronDown className="w-3 h-3" />
                </button>
                {showQuickAdd && (
                  <>
                  <div className="fixed inset-0 z-40" onClick={() => setShowQuickAdd(false)} />
                  <div className="absolute right-0 mt-1 w-64 bg-white dark:bg-slate-800 rounded-lg shadow-lg border dark:border-slate-700 z-50 py-1">
                    <div className="px-3 py-2 text-xs font-medium text-slate-400 dark:text-slate-500 uppercase tracking-wider">Fournisseurs courants</div>
                    {QUICK_ADD_TEMPLATES.map((tpl) => (
                      <button
                        key={tpl.name}
                        onClick={() => {
                          setEditingSupplier(null);
                          setForm({ ...emptyForm, ...tpl.data } as SupplierFormData);
                          setModalOpen(true);
                          setShowQuickAdd(false);
                        }}
                        className="w-full text-left px-3 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 flex items-center gap-2"
                      >
                        <Building2 className="w-4 h-4 text-slate-400" />
                        {tpl.name}
                      </button>
                    ))}
                  </div>
                  </>
                )}
              </div>
              <button onClick={openAdd} className="btn btn-primary flex items-center gap-2 w-fit">
                <Plus className="w-4 h-4" />
                Ajouter un fournisseur
              </button>
            </div>
          </div>

          {/* Stats cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <div className="bg-white dark:bg-slate-800 rounded-lg shadow p-5">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-slate-500 dark:text-slate-400">Total fournisseurs</span>
                <div className="p-2 rounded-lg bg-blue-600"><Truck className="w-5 h-5 text-white" /></div>
              </div>
              <div className="text-2xl font-bold text-slate-800 dark:text-slate-100">{stats.totalSuppliers}</div>
            </div>
            <div className="bg-white dark:bg-slate-800 rounded-lg shadow p-5">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-slate-500 dark:text-slate-400">Ingrédients liés</span>
                <div className="p-2 rounded-lg bg-green-600"><Package className="w-5 h-5 text-white" /></div>
              </div>
              <div className="text-2xl font-bold text-slate-800 dark:text-slate-100">{stats.totalLinked}</div>
            </div>
            <div className="bg-white dark:bg-slate-800 rounded-lg shadow p-5">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-slate-500 dark:text-slate-400">Avec livraison</span>
                <div className="p-2 rounded-lg bg-purple-600"><Truck className="w-5 h-5 text-white" /></div>
              </div>
              <div className="text-2xl font-bold text-slate-800 dark:text-slate-100">{stats.withDelivery}</div>
            </div>
            <div className="bg-white dark:bg-slate-800 rounded-lg shadow p-5">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-slate-500 dark:text-slate-400">Sans fournisseur</span>
                <div className="p-2 rounded-lg bg-amber-500"><Package className="w-5 h-5 text-white" /></div>
              </div>
              <div className="text-2xl font-bold text-slate-800 dark:text-slate-100">{stats.withoutSupplier}</div>
            </div>
          </div>

          {/* Comparer les prix bar */}
          {compareSupplierIds.size > 0 && (
            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-3 mb-4 flex items-center justify-between">
              <span className="text-sm text-blue-700 dark:text-blue-300">
                <ArrowRightLeft className="w-4 h-4 inline mr-1.5 -mt-0.5" />
                {compareSupplierIds.size} fournisseur{compareSupplierIds.size > 1 ? 's' : ''} sélectionné{compareSupplierIds.size > 1 ? 's' : ''}
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setCompareSupplierIds(new Set())}
                  className="text-xs px-3 py-1.5 rounded border border-blue-300 dark:border-blue-700 text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-800"
                >
                  Tout désélectionner
                </button>
                <button
                  onClick={() => setShowSupplierCompare(true)}
                  disabled={compareSupplierIds.size < 2}
                  className="flex items-center gap-1.5 text-xs px-4 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <BarChart3 className="w-3.5 h-3.5" />
                  Comparer les prix
                </button>
              </div>
            </div>
          )}

          {/* Supplier price comparison modal */}
          <Modal isOpen={showSupplierCompare} onClose={() => setShowSupplierCompare(false)} title="Comparaison des prix fournisseurs">
            {(() => {
              const comparedSuppliers = suppliers.filter(s => compareSupplierIds.has(s.id));
              // Build a map of ingredient name -> { supplier name -> price, unit }
              const ingredientMap: Record<string, Record<string, { price: number; unit: string }>> = {};
              comparedSuppliers.forEach(s => {
                (s.ingredients || []).forEach((ing: any) => {
                  if (!ingredientMap[ing.name]) ingredientMap[ing.name] = {};
                  ingredientMap[ing.name][s.name] = { price: ing.pricePerUnit, unit: ing.unit };
                });
              });
              const ingredientNames = Object.keys(ingredientMap).sort();
              if (ingredientNames.length === 0) {
                return <p className="text-sm text-slate-400 py-4 text-center">Aucun ingrédient en commun. Liez d'abord des ingrédients aux fournisseurs sélectionnés.</p>;
              }
              return (
                <div className="overflow-x-auto max-h-[60vh]">
                  <table className="w-full text-sm">
                    <thead className="sticky top-0 bg-slate-50 dark:bg-slate-700 z-10">
                      <tr>
                        <th className="text-left px-3 py-2 text-xs text-slate-500 dark:text-slate-400 font-medium">Ingrédient</th>
                        {comparedSuppliers.map(s => (
                          <th key={s.id} className="text-right px-3 py-2 text-xs text-slate-500 dark:text-slate-400 font-medium">{s.name}</th>
                        ))}
                        <th className="text-right px-3 py-2 text-xs text-slate-500 dark:text-slate-400 font-medium">Écart %</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y dark:divide-slate-700">
                      {ingredientNames.map(name => {
                        const prices = comparedSuppliers.map(s => ingredientMap[name][s.name]?.price ?? null);
                        const validPrices = prices.filter((p): p is number => p !== null);
                        const minPrice = validPrices.length > 0 ? Math.min(...validPrices) : null;
                        const maxPrice = validPrices.length > 0 ? Math.max(...validPrices) : null;
                        const diff = minPrice && maxPrice && maxPrice > 0 ? Math.round(((maxPrice - minPrice) / minPrice) * 100) : null;
                        return (
                          <tr key={name} className="hover:bg-slate-50 dark:hover:bg-slate-700/30">
                            <td className="px-3 py-2 text-slate-700 dark:text-slate-300 font-medium">{name}</td>
                            {comparedSuppliers.map(s => {
                              const entry = ingredientMap[name][s.name];
                              const isBest = entry && minPrice !== null && entry.price === minPrice && validPrices.length > 1;
                              return (
                                <td key={s.id} className={`px-3 py-2 text-right font-medium ${isBest ? 'text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/20' : 'text-slate-600 dark:text-slate-400'}`}>
                                  {entry ? `${entry.price.toFixed(2)} €/${entry.unit}` : <span className="text-slate-300 dark:text-slate-600">--</span>}
                                </td>
                              );
                            })}
                            <td className={`px-3 py-2 text-right text-xs font-bold ${diff !== null && diff > 15 ? 'text-red-600' : diff !== null && diff > 0 ? 'text-orange-500' : 'text-slate-400'}`}>
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
          <div className="bg-white dark:bg-slate-800 rounded-lg shadow p-4 mb-6">
            <div className="flex items-center gap-2 mb-3 text-sm font-medium text-slate-600 dark:text-slate-300">
              <Filter className="w-4 h-4" />
              Filtres
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Rechercher par nom..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="input pl-10 w-full"
                />
              </div>
              <div className="relative">
                <MapPin className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                <select
                  value={filterRegion}
                  onChange={(e) => setFilterRegion(e.target.value)}
                  className="input pl-10 w-full appearance-none"
                >
                  <option value="">Toutes les régions</option>
                  {FRENCH_REGIONS.map((r) => (
                    <option key={r} value={r}>{r}</option>
                  ))}
                </select>
              </div>
              <div className="relative">
                <Tag className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                <select
                  value={filterCategory}
                  onChange={(e) => setFilterCategory(e.target.value)}
                  className="input pl-10 w-full appearance-none"
                >
                  <option value="">Toutes catégories</option>
                  {INGREDIENT_CATEGORIES.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Supplier card grid */}
          {filtered.length === 0 ? (
            <div className="bg-white dark:bg-slate-800 rounded-lg shadow p-12 text-center">
              <Truck className="w-12 h-12 mx-auto text-slate-300 dark:text-slate-600 mb-3" />
              <p className="text-slate-400 dark:text-slate-500">Aucun fournisseur trouvé</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {filtered.map((supplier) => {
                const ingCount = supplier._count?.ingredients ?? 0;
                const isExpanded = expandedId === supplier.id;

                return (
                  <div
                    key={supplier.id}
                    className="bg-white dark:bg-slate-800 rounded-lg shadow hover:shadow-md transition-shadow flex flex-col"
                  >
                    {/* Card header */}
                    <div className="p-5 flex-1">
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <div className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            checked={compareSupplierIds.has(supplier.id)}
                            onChange={() => setCompareSupplierIds(prev => {
                              const next = new Set(prev);
                              next.has(supplier.id) ? next.delete(supplier.id) : next.add(supplier.id);
                              return next;
                            })}
                            className="accent-blue-600 shrink-0 mt-0.5"
                            title="Sélectionner pour comparer"
                          />
                          <h3
                            className="font-semibold text-slate-800 dark:text-slate-100 leading-tight cursor-pointer hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                            onClick={() => setDetailSupplier(supplier)}
                            title="Voir le détail"
                          >
                            {supplier.name}
                          </h3>
                        </div>
                        <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 whitespace-nowrap">
                          {ingCount} ing.
                        </span>
                      </div>

                      {/* Supplier rating */}
                      {(() => {
                        const rating = getMockRating(supplier.id);
                        return (
                          <div className="flex items-center gap-3 mb-2 text-xs">
                            <span className="flex items-center gap-0.5" title="Fiabilité">
                              {[1,2,3,4,5].map(n => (
                                <Star key={n} className={`w-3 h-3 ${n <= rating.reliability ? 'text-amber-400 fill-amber-400' : 'text-slate-300 dark:text-slate-600'}`} />
                              ))}
                            </span>
                            <span className="flex items-center gap-1 text-slate-500 dark:text-slate-400" title="Délai de livraison">
                              <Clock className="w-3 h-3" />
                              {rating.deliveryDays}
                            </span>
                            <span className="text-slate-500 dark:text-slate-400" title="Commande minimum">
                              Min: {rating.minOrderAmount}
                            </span>
                          </div>
                        );
                      })()}

                      {/* Contact info */}
                      {supplier.contactName && (
                        <p className="text-sm text-slate-600 dark:text-slate-300 mb-1">
                          <Building2 className="w-3.5 h-3.5 inline -mt-0.5 mr-1 text-slate-400" />
                          {supplier.contactName}
                        </p>
                      )}
                      {supplier.phone && (
                        <p className="text-sm text-slate-500 dark:text-slate-400 mb-0.5">
                          <Phone className="w-3.5 h-3.5 inline -mt-0.5 mr-1 text-slate-400" />
                          {supplier.phone}
                        </p>
                      )}
                      {supplier.email && (
                        <p className="text-sm text-slate-500 dark:text-slate-400 mb-0.5 truncate">
                          <Mail className="w-3.5 h-3.5 inline -mt-0.5 mr-1 text-slate-400" />
                          {supplier.email}
                        </p>
                      )}
                      {(supplier.city || supplier.postalCode) && (
                        <p className="text-sm text-slate-500 dark:text-slate-400 mb-2">
                          <MapPin className="w-3.5 h-3.5 inline -mt-0.5 mr-1 text-slate-400" />
                          {[supplier.city, supplier.postalCode].filter(Boolean).join(' ')}
                        </p>
                      )}

                      {/* Categories */}
                      {supplier.categories.length > 0 && (
                        <div className="flex flex-wrap gap-1 mb-2">
                          {supplier.categories.map((cat) => (
                            <span key={cat} className="px-2 py-0.5 rounded text-[10px] bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 font-medium">
                              {cat}
                            </span>
                          ))}
                        </div>
                      )}

                      {/* Delivery + website */}
                      <div className="flex flex-wrap items-center gap-3 text-xs mt-2">
                        <span className={`flex items-center gap-1 ${supplier.delivery ? 'text-green-600 dark:text-green-400' : 'text-slate-400 dark:text-slate-500'}`}>
                          {supplier.delivery ? <Check className="w-3.5 h-3.5" /> : <X className="w-3.5 h-3.5" />}
                          Livraison
                        </span>
                        {supplier.website && (
                          <a
                            href={supplier.website.startsWith('http') ? supplier.website : `https://${supplier.website}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-1 text-blue-600 dark:text-blue-400 hover:underline"
                          >
                            <ExternalLink className="w-3 h-3" />
                            Site web
                          </a>
                        )}
                      </div>
                    </div>

                    {/* Action buttons */}
                    <div className="border-t dark:border-slate-700 px-5 py-3 flex items-center gap-2">
                      <button
                        onClick={() => openEdit(supplier)}
                        className="p-1.5 rounded hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-500 dark:text-slate-400"
                        title="Modifier"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => setDeleteTarget(supplier)}
                        className="p-1.5 rounded hover:bg-red-50 dark:hover:bg-red-900/20 text-red-500"
                        title="Supprimer"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleLink(supplier)}
                        disabled={linking === supplier.id}
                        className="p-1.5 rounded hover:bg-green-50 dark:hover:bg-green-900/20 text-green-600 dark:text-green-400 disabled:opacity-50"
                        title="Lier les ingrédients"
                      >
                        <Link2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => setExpandedId(isExpanded ? null : supplier.id)}
                        className="ml-auto p-1.5 rounded hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-500 dark:text-slate-400"
                        title="Voir les ingrédients"
                      >
                        {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                      </button>
                    </div>

                    {/* Expanded ingredients — interactive table */}
                    {isExpanded && (
                      <div className="border-t dark:border-slate-700 px-5 py-3 bg-slate-50 dark:bg-slate-900/30 rounded-b-lg space-y-3">
                        {supplier.ingredients && supplier.ingredients.length > 0 ? (
                          <>
                            {/* Search + Compare bar */}
                            <div className="flex items-center gap-2">
                              <div className="relative flex-1">
                                <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
                                <input
                                  type="text" placeholder="Filtrer les ingrédients..." value={ingSearch}
                                  onChange={e => setIngSearch(e.target.value)}
                                  className="w-full pl-8 pr-3 py-1.5 text-xs border border-slate-200 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-500"
                                />
                              </div>
                              {compareIds.size > 0 && (
                                <button
                                  onClick={() => setShowCompare(true)}
                                  className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium bg-blue-600 hover:bg-blue-700 text-white rounded-lg"
                                >
                                  <BarChart3 className="w-3.5 h-3.5" /> Comparer ({compareIds.size})
                                </button>
                              )}
                              <span className="text-xs text-slate-400">{supplier.ingredients.length} produits</span>
                            </div>
                            {/* Ingredient rows */}
                            <div className="max-h-80 overflow-y-auto space-y-0.5">
                              {supplier.ingredients
                                .filter((ing: any) => !ingSearch || ing.name.toLowerCase().includes(ingSearch.toLowerCase()))
                                .map((ing: any) => (
                                <div key={ing.id} className="flex items-center gap-2 py-1.5 px-2 rounded hover:bg-white dark:hover:bg-slate-800 group text-sm">
                                  <input
                                    type="checkbox"
                                    checked={compareIds.has(ing.id)}
                                    onChange={() => setCompareIds(prev => {
                                      const next = new Set(prev);
                                      next.has(ing.id) ? next.delete(ing.id) : next.add(ing.id);
                                      return next;
                                    })}
                                    className="accent-blue-600 shrink-0"
                                  />
                                  <span className="flex-1 text-slate-700 dark:text-slate-300 truncate">{ing.name}</span>
                                  <span className="text-xs text-slate-400 w-20 shrink-0">{ing.category}</span>
                                  {/* Editable price */}
                                  {editingPrice?.id === ing.id ? (
                                    <div className="flex items-center gap-1">
                                      <input
                                        type="number" step="0.01" min="0" autoFocus
                                        value={editingPrice!.value}
                                        onChange={e => setEditingPrice({ id: ing.id, value: e.target.value })}
                                        onKeyDown={async e => {
                                          if (e.key === 'Enter') {
                                            await updateIngredient(ing.id, { pricePerUnit: parseFloat(editingPrice!.value) } as any);
                                            setEditingPrice(null);
                                            loadData();
                                            showToast('Prix mis à jour', 'success');
                                          } else if (e.key === 'Escape') setEditingPrice(null);
                                        }}
                                        className="w-20 px-2 py-0.5 text-xs border border-blue-400 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 dark:bg-slate-700"
                                      />
                                      <span className="text-xs text-slate-400">€/{ing.unit}</span>
                                    </div>
                                  ) : (
                                    <span
                                      className="text-xs font-medium text-blue-600 dark:text-blue-400 cursor-pointer hover:underline w-24 text-right shrink-0"
                                      onClick={() => setEditingPrice({ id: ing.id, value: ing.pricePerUnit.toFixed(2) })}
                                      title="Cliquer pour modifier le prix"
                                    >
                                      {ing.pricePerUnit.toFixed(2)} €/{ing.unit}
                                    </span>
                                  )}
                                  {/* Unlink button */}
                                  <button
                                    onClick={async () => {
                                      await updateIngredient(ing.id, { supplierId: null, supplier: '' } as any);
                                      loadData();
                                      showToast(`${ing.name} délié`, 'success');
                                    }}
                                    className="opacity-0 group-hover:opacity-100 p-1 rounded hover:bg-red-50 dark:hover:bg-red-900/20 text-red-400 hover:text-red-600 transition-all shrink-0"
                                    title="Délier du fournisseur"
                                  >
                                    <X className="w-3.5 h-3.5" />
                                  </button>
                                </div>
                              ))}
                            </div>

                            {/* Compare panel */}
                            {showCompare && compareIds.size > 0 && (
                              <div className="border border-blue-200 dark:border-blue-800 rounded-lg bg-blue-50 dark:bg-blue-900/20 p-3">
                                <div className="flex items-center justify-between mb-2">
                                  <span className="text-sm font-semibold text-blue-700 dark:text-blue-300">Comparaison prix catalogue</span>
                                  <button onClick={() => { setShowCompare(false); setCompareIds(new Set()); }} className="text-blue-400 hover:text-blue-600"><X className="w-4 h-4" /></button>
                                </div>
                                <div className="text-xs space-y-1">
                                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 font-medium text-slate-500 dark:text-slate-400 pb-1 border-b dark:border-blue-800">
                                    <span className="col-span-2">Produit</span>
                                    <span>Mon prix</span>
                                    <span>Cat. min</span>
                                    <span>Cat. moy</span>
                                    <span>Écart</span>
                                  </div>
                                  {supplier.ingredients.filter((i: any) => compareIds.has(i.id)).map((ing: any) => {
                                    const match = searchCatalog(ing.name, 1)[0];
                                    const ecart = match ? Math.round(((ing.pricePerUnit - match.prixMoy) / match.prixMoy) * 100) : null;
                                    return (
                                      <div key={ing.id} className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 py-1">
                                        <span className="col-span-2 truncate text-slate-700 dark:text-slate-300">{ing.name}</span>
                                        <span className="font-medium">{ing.pricePerUnit.toFixed(2)}€</span>
                                        <span className="text-green-600">{match ? match.prixMin.toFixed(2) + '€' : '—'}</span>
                                        <span>{match ? match.prixMoy.toFixed(2) + '€' : '—'}</span>
                                        <span className={ecart !== null ? (ecart > 15 ? 'text-red-600 font-bold' : ecart < -10 ? 'text-green-600 font-bold' : 'text-orange-500') : 'text-slate-400'}>
                                          {ecart !== null ? (ecart > 0 ? '+' : '') + ecart + '%' : '—'}
                                        </span>
                                      </div>
                                    );
                                  })}
                                </div>
                              </div>
                            )}
                          </>
                        ) : (
                          <p className="text-sm text-slate-400 italic">Aucun ingrédient lié</p>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </>
      )}

      {/* ================================================================== */}
      {/* TAB: Annuaire fournisseurs France (kept as-is)                     */}
      {/* ================================================================== */}
      {activeTab === 'annuaire' && (
        <>
          {/* Stats bar */}
          <div className="flex flex-wrap gap-3 mb-4 text-sm">
            <span className="px-3 py-1.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-medium">
              {annuaireStats.total} fournisseur{annuaireStats.total > 1 ? 's' : ''} trouvé{annuaireStats.total > 1 ? 's' : ''}
            </span>
            <span className="px-3 py-1.5 rounded-full bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 font-medium">
              {annuaireStats.withDelivery} avec livraison
            </span>
            {Object.entries(annuaireStats.byType).map(([type, count]) => {
              const tc = TYPE_COLORS[type as FrenchSupplier['type']];
              return (
                <span key={type} className={`px-3 py-1.5 rounded-full ${tc.bg} ${tc.text} font-medium`}>
                  {count} {tc.label.toLowerCase()}{count > 1 ? 's' : ''}
                </span>
              );
            })}
          </div>

          {/* Filters */}
          <div className="bg-white dark:bg-slate-800 rounded-lg shadow p-4 mb-6">
            <div className="flex items-center gap-2 mb-3 text-sm font-medium text-slate-600 dark:text-slate-300">
              <Filter className="w-4 h-4" />
              Filtres
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Rechercher..."
                  value={annuaireSearch}
                  onChange={(e) => setAnnuaireSearch(e.target.value)}
                  className="input pl-10 w-full"
                />
              </div>
              <div className="relative">
                <MapPin className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                <select
                  value={annuaireRegion}
                  onChange={(e) => setAnnuaireRegion(e.target.value)}
                  className="input pl-10 w-full appearance-none"
                >
                  <option value="">Toutes les régions</option>
                  {FRENCH_REGIONS.map((r) => (
                    <option key={r} value={r}>{r}</option>
                  ))}
                </select>
              </div>
              <div className="relative">
                <Tag className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                <select
                  value={annuaireCategory}
                  onChange={(e) => setAnnuaireCategory(e.target.value)}
                  className="input pl-10 w-full appearance-none"
                >
                  <option value="">Toutes catégories</option>
                  {SUPPLIER_CATEGORIES.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>
              <div className="relative">
                <Building2 className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                <select
                  value={annuaireType}
                  onChange={(e) => setAnnuaireType(e.target.value as '' | FrenchSupplier['type'])}
                  className="input pl-10 w-full appearance-none"
                >
                  <option value="">Tous types</option>
                  <option value="grossiste">Grossiste</option>
                  <option value="specialiste">Spécialiste</option>
                  <option value="local">Local</option>
                  <option value="national">National</option>
                </select>
              </div>
              <label className="flex items-center gap-2 px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-700/50 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={deliveryOnly}
                  onChange={(e) => setDeliveryOnly(e.target.checked)}
                  className="rounded border-slate-300 dark:border-slate-600 text-blue-600 focus:ring-blue-500"
                />
                <Truck className="w-4 h-4 text-slate-500 dark:text-slate-400" />
                <span className="text-sm text-slate-600 dark:text-slate-300">Livraison uniquement</span>
              </label>
            </div>
          </div>

          {/* Supplier Cards Grid */}
          {annuaireResults.length === 0 ? (
            <div className="bg-white dark:bg-slate-800 rounded-lg shadow p-12 text-center">
              <Search className="w-12 h-12 mx-auto text-slate-300 dark:text-slate-600 mb-3" />
              <p className="text-slate-400 dark:text-slate-500">Aucun fournisseur ne correspond à vos critères</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {annuaireResults.map((supplier) => {
                const tc = TYPE_COLORS[supplier.type];
                return (
                  <div
                    key={supplier.name}
                    className="bg-white dark:bg-slate-800 rounded-lg shadow hover:shadow-md transition-shadow p-5 flex flex-col"
                  >
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <h3 className="font-semibold text-slate-800 dark:text-slate-100 leading-tight">
                        {supplier.name}
                      </h3>
                      <span className={`px-2 py-0.5 rounded text-xs font-medium whitespace-nowrap ${tc.bg} ${tc.text}`}>
                        {tc.label}
                      </span>
                    </div>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mb-3 line-clamp-2">
                      {supplier.description}
                    </p>
                    <div className="flex flex-wrap gap-1 mb-3">
                      {supplier.categories.map((cat) => (
                        <span key={cat} className="px-2 py-0.5 rounded text-[10px] bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 font-medium">
                          {cat}
                        </span>
                      ))}
                    </div>
                    {supplier.speciality && (
                      <p className="text-xs text-purple-600 dark:text-purple-400 mb-2 italic">
                        {supplier.speciality}
                      </p>
                    )}
                    <div className="text-xs text-slate-400 dark:text-slate-500 mb-3 flex items-start gap-1">
                      <MapPin className="w-3 h-3 mt-0.5 shrink-0" />
                      <span className="line-clamp-1">
                        {supplier.regions.length === FRENCH_REGIONS.length
                          ? 'Toute la France'
                          : supplier.regions.join(', ')}
                      </span>
                    </div>
                    <div className="mt-auto pt-3 border-t dark:border-slate-700 flex flex-wrap items-center gap-3 text-xs">
                      <span className={`flex items-center gap-1 ${supplier.delivery ? 'text-green-600 dark:text-green-400' : 'text-red-500 dark:text-red-400'}`}>
                        {supplier.delivery ? <Check className="w-3.5 h-3.5" /> : <X className="w-3.5 h-3.5" />}
                        Livraison
                      </span>
                      {supplier.minOrder && (
                        <span className="text-slate-500 dark:text-slate-400">Min: {supplier.minOrder}</span>
                      )}
                      {supplier.website && (
                        <a
                          href={supplier.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="ml-auto flex items-center gap-1 text-blue-600 dark:text-blue-400 hover:underline"
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
                <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100">Catalogue Transgourmet</h3>
                <span className="text-xs text-slate-400 ml-2">{catalogData.length} produits disponibles</span>
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
                    showToast(`${added} produit${added > 1 ? 's' : ''} ajouté${added > 1 ? 's' : ''}`, 'success');
                    setAddingCatalog(false);
                  }}
                  className="flex items-center gap-1.5 px-4 py-2 text-sm font-medium bg-green-600 hover:bg-green-700 text-white rounded-lg disabled:opacity-50"
                >
                  <Plus className="w-4 h-4" />
                  {addingCatalog ? 'Ajout en cours...' : `Ajouter ${catalogSelected.size} produit${catalogSelected.size > 1 ? 's' : ''}`}
                </button>
              )}
            </div>
            {/* Filters */}
            <div className="flex gap-2 mb-3">
              <div className="relative flex-1">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text" placeholder="Rechercher un produit..." value={catalogSearch}
                  onChange={e => { setCatalogSearch(e.target.value); setCatalogPage(0); }}
                  className="input pl-10 w-full"
                />
              </div>
              <select
                value={catalogCat} onChange={e => { setCatalogCat(e.target.value); setCatalogPage(0); }}
                className="input w-48"
              >
                <option value="">Toutes catégories</option>
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
                  <div className="bg-white dark:bg-slate-800 rounded-lg shadow overflow-hidden">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="bg-slate-50 dark:bg-slate-700/50 text-left text-xs text-slate-500 dark:text-slate-400">
                          <th className="px-3 py-2 w-8">
                            <input type="checkbox"
                              checked={page.length > 0 && page.every((_, i) => catalogSelected.has(catalogPage * pageSize + i))}
                              onChange={e => {
                                const next = new Set(catalogSelected);
                                page.forEach((_, i) => e.target.checked ? next.add(catalogPage * pageSize + i) : next.delete(catalogPage * pageSize + i));
                                setCatalogSelected(next);
                              }}
                              className="accent-blue-600"
                            />
                          </th>
                          <th className="px-3 py-2">Produit</th>
                          <th className="px-3 py-2">Catégorie</th>
                          <th className="px-3 py-2">Prix estimé</th>
                          <th className="px-3 py-2">Unité</th>
                          <th className="px-3 py-2 w-20">Action</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y dark:divide-slate-700">
                        {page.map((p, i) => {
                          const globalIdx = catalogPage * pageSize + i;
                          const exists = existingNames.has(p.name.toLowerCase());
                          return (
                            <tr key={globalIdx} className={`hover:bg-slate-50 dark:hover:bg-slate-700/30 ${exists ? 'opacity-50' : ''}`}>
                              <td className="px-3 py-2">
                                <input type="checkbox" disabled={exists}
                                  checked={catalogSelected.has(globalIdx)}
                                  onChange={() => setCatalogSelected(prev => {
                                    const next = new Set(prev);
                                    next.has(globalIdx) ? next.delete(globalIdx) : next.add(globalIdx);
                                    return next;
                                  })}
                                  className="accent-blue-600"
                                />
                              </td>
                              <td className="px-3 py-2 text-slate-700 dark:text-slate-300">{p.name}</td>
                              <td className="px-3 py-2"><span className="text-xs px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400">{p.category}</span></td>
                              <td className="px-3 py-2 font-medium text-blue-600 dark:text-blue-400">{p.prixMoy.toFixed(2)} €</td>
                              <td className="px-3 py-2 text-slate-400">{p.unit}</td>
                              <td className="px-3 py-2">
                                {exists ? (
                                  <span className="text-xs text-green-500">✓ Ajouté</span>
                                ) : (
                                  <button
                                    onClick={async () => {
                                      try {
                                        await createIngredient({ name: p.name, unit: p.unit, pricePerUnit: p.prixMoy, category: p.category, allergens: [] } as any);
                                        await loadData();
                                        showToast(`${p.name} ajouté`, 'success');
                                      } catch { showToast('Erreur', 'error'); }
                                    }}
                                    className="text-xs px-2 py-1 rounded bg-blue-600 hover:bg-blue-700 text-white"
                                  >
                                    + Ajouter
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
                      <span className="text-xs text-slate-400">{filtered.length} résultats</span>
                      <div className="flex gap-1">
                        <button disabled={catalogPage === 0} onClick={() => setCatalogPage(p => p - 1)} className="px-3 py-1 text-xs rounded border dark:border-slate-600 disabled:opacity-30 hover:bg-slate-100 dark:hover:bg-slate-700">←</button>
                        <span className="px-3 py-1 text-xs text-slate-500">{catalogPage + 1}{"\u00A0/\u00A0"}{totalPages}</span>
                        <button disabled={catalogPage >= totalPages - 1} onClick={() => setCatalogPage(p => p + 1)} className="px-3 py-1 text-xs rounded border dark:border-slate-600 disabled:opacity-30 hover:bg-slate-100 dark:hover:bg-slate-700">→</button>
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
      {/* Supplier Detail Modal                                              */}
      {/* ================================================================== */}
      <Modal isOpen={!!detailSupplier} onClose={() => setDetailSupplier(null)} title={detailSupplier?.name || 'Détail fournisseur'}>
        {detailSupplier && (() => {
          const rating = getMockRating(detailSupplier.id);
          const ings = detailSupplier.ingredients || [];
          return (
            <div className="space-y-5 max-h-[70vh] overflow-y-auto pr-1">
              {/* Rating summary */}
              <div className="grid grid-cols-3 gap-3">
                <div className="bg-slate-50 dark:bg-slate-700/50 rounded-lg p-3 text-center">
                  <div className="flex items-center justify-center gap-0.5 mb-1">
                    {[1,2,3,4,5].map(n => (
                      <Star key={n} className={`w-4 h-4 ${n <= rating.reliability ? 'text-amber-400 fill-amber-400' : 'text-slate-300 dark:text-slate-600'}`} />
                    ))}
                  </div>
                  <span className="text-xs text-slate-500 dark:text-slate-400">Fiabilité</span>
                </div>
                <div className="bg-slate-50 dark:bg-slate-700/50 rounded-lg p-3 text-center">
                  <div className="text-lg font-bold text-slate-800 dark:text-slate-100 flex items-center justify-center gap-1">
                    <Clock className="w-4 h-4 text-blue-500" />
                    {rating.deliveryDays}
                  </div>
                  <span className="text-xs text-slate-500 dark:text-slate-400">Délai livraison</span>
                </div>
                <div className="bg-slate-50 dark:bg-slate-700/50 rounded-lg p-3 text-center">
                  <div className="text-lg font-bold text-slate-800 dark:text-slate-100">{rating.minOrderAmount}</div>
                  <span className="text-xs text-slate-500 dark:text-slate-400">Commande min.</span>
                </div>
              </div>

              {/* Contact info */}
              <div className="grid grid-cols-2 gap-2 text-sm">
                {detailSupplier.contactName && <div className="text-slate-600 dark:text-slate-300"><Building2 className="w-3.5 h-3.5 inline mr-1 -mt-0.5 text-slate-400" />{detailSupplier.contactName}</div>}
                {detailSupplier.phone && <div className="text-slate-600 dark:text-slate-300"><Phone className="w-3.5 h-3.5 inline mr-1 -mt-0.5 text-slate-400" />{detailSupplier.phone}</div>}
                {detailSupplier.email && <div className="text-slate-600 dark:text-slate-300"><Mail className="w-3.5 h-3.5 inline mr-1 -mt-0.5 text-slate-400" />{detailSupplier.email}</div>}
                {detailSupplier.city && <div className="text-slate-600 dark:text-slate-300"><MapPin className="w-3.5 h-3.5 inline mr-1 -mt-0.5 text-slate-400" />{[detailSupplier.city, detailSupplier.postalCode].filter(Boolean).join(' ')}</div>}
              </div>

              {/* Linked ingredients with price history */}
              <div>
                <h4 className="text-sm font-semibold text-slate-700 dark:text-slate-200 mb-3 flex items-center gap-2">
                  <Package className="w-4 h-4 text-blue-500" />
                  Ingrédients liés ({ings.length})
                </h4>
                {ings.length === 0 ? (
                  <p className="text-sm text-slate-400 italic">Aucun ingrédient lié à ce fournisseur</p>
                ) : (
                  <div className="space-y-3">
                    {ings.map((ing: any) => {
                      const priceHistory = getMockPriceHistory(ing.pricePerUnit);
                      const trend = priceHistory[priceHistory.length - 1] - priceHistory[0];
                      return (
                        <div key={ing.id} className="bg-slate-50 dark:bg-slate-700/50 rounded-lg p-3">
                          <div className="flex items-center justify-between mb-1">
                            <div>
                              <span className="text-sm font-medium text-slate-700 dark:text-slate-200">{ing.name}</span>
                              <span className="ml-2 text-xs px-2 py-0.5 rounded bg-slate-200 dark:bg-slate-600 text-slate-500 dark:text-slate-400">{ing.category}</span>
                            </div>
                            <div className="text-right">
                              <span className="text-sm font-bold text-blue-600 dark:text-blue-400">{ing.pricePerUnit.toFixed(2)} €/{ing.unit}</span>
                              <span className={`ml-2 text-xs font-medium ${trend > 0 ? 'text-red-500' : 'text-green-500'}`}>
                                <TrendingUp className={`w-3 h-3 inline -mt-0.5 ${trend < 0 ? 'rotate-180' : ''}`} />
                                {trend > 0 ? '+' : ''}{((trend / priceHistory[0]) * 100).toFixed(1)}%
                              </span>
                            </div>
                          </div>
                          {/* Mini price chart */}
                          <div className="mt-1">
                            <div className="flex items-center justify-between text-[10px] text-slate-400 mb-0.5">
                              <span>Historique 30j</span>
                              <span>{priceHistory[priceHistory.length - 1].toFixed(2)} €</span>
                            </div>
                            <MiniPriceChart data={priceHistory} width={300} height={40} />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          );
        })()}
      </Modal>

      {/* ================================================================== */}
      {/* Add / Edit Modal                                                   */}
      {/* ================================================================== */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingSupplier ? 'Modifier le fournisseur' : 'Ajouter un fournisseur'}
      >
        <div className="space-y-4 max-h-[70vh] overflow-y-auto pr-1">
          {/* Nom */}
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
              Nom du fournisseur <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => setField('name', e.target.value)}
              className="input w-full"
              placeholder="Ex: Metro, Transgourmet..."
            />
          </div>

          {/* Contact name */}
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Nom du contact</label>
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
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Téléphone</label>
              <input
                type="tel"
                value={form.phone}
                onChange={(e) => setField('phone', e.target.value)}
                className="input w-full"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Email</label>
              <input
                type="email"
                value={form.email}
                onChange={(e) => setField('email', e.target.value)}
                className="input w-full"
              />
            </div>
          </div>

          {/* Address */}
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Adresse</label>
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
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Code postal</label>
              <input
                type="text"
                value={form.postalCode}
                onChange={(e) => setField('postalCode', e.target.value)}
                className="input w-full"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Ville</label>
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
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Région</label>
              <select
                value={form.region}
                onChange={(e) => setField('region', e.target.value)}
                className="input w-full"
              >
                <option value="">-- Sélectionner --</option>
                {FRENCH_REGIONS.map((r) => (
                  <option key={r} value={r}>{r}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Pays</label>
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
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">SIRET</label>
              <input
                type="text"
                value={form.siret}
                onChange={(e) => setField('siret', e.target.value)}
                className="input w-full"
                placeholder="14 chiffres"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Site web</label>
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
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Catégories</label>
            <div className="flex flex-wrap gap-2">
              {INGREDIENT_CATEGORIES.map((cat) => (
                <label
                  key={cat}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm cursor-pointer select-none border transition-colors ${
                    form.categories.includes(cat)
                      ? 'bg-blue-50 dark:bg-blue-900/30 border-blue-300 dark:border-blue-700 text-blue-700 dark:text-blue-300'
                      : 'bg-white dark:bg-slate-700 border-slate-200 dark:border-slate-600 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-600'
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
                  : <ToggleLeft className="w-8 h-8 text-slate-400" />}
              </button>
              <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Livraison disponible</span>
            </label>
          </div>

          {/* Min order + Payment terms */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Commande minimum</label>
              <input
                type="text"
                value={form.minOrder}
                onChange={(e) => setField('minOrder', e.target.value)}
                className="input w-full"
                placeholder="Ex: 150 EUR"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Conditions de paiement</label>
              <input
                type="text"
                value={form.paymentTerms}
                onChange={(e) => setField('paymentTerms', e.target.value)}
                className="input w-full"
                placeholder="Ex: 30 jours fin de mois"
              />
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Notes</label>
            <textarea
              value={form.notes}
              onChange={(e) => setField('notes', e.target.value)}
              rows={3}
              className="input w-full resize-none"
              placeholder="Informations complémentaires..."
            />
          </div>
        </div>

        {/* Modal footer */}
        <div className="flex justify-end gap-3 mt-6 pt-4 border-t dark:border-slate-700">
          <button
            onClick={() => setModalOpen(false)}
            className="px-4 py-2 rounded-lg font-medium border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
          >
            Annuler
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="btn btn-primary flex items-center gap-2 disabled:opacity-50"
          >
            {saving ? (
              <>
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Enregistrement...
              </>
            ) : (
              editingSupplier ? 'Mettre à jour' : 'Créer'
            )}
          </button>
        </div>
      </Modal>

      {/* ================================================================== */}
      {/* Delete confirmation                                                */}
      {/* ================================================================== */}
      <ConfirmDialog
        isOpen={!!deleteTarget}
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
        title="Supprimer le fournisseur"
        message={`Voulez-vous vraiment supprimer "${deleteTarget?.name}" ? Cette action est irréversible.`}
      />
    </div>
  );
}
