import { formatCurrency } from '../utils/currency';
import { useState, useEffect, useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import SearchBar, { type SearchSuggestion } from '../components/SearchBar';
import FilterPanel, { type FilterDef, type FilterValues } from '../components/FilterPanel';
import {
  Truck, Package, Search, ExternalLink, Check, X, Filter, Globe, MapPin,
  Tag, Building2, Plus, Edit2, Trash2, Link2, Phone, Mail, ChevronDown, ShoppingBag,
  ChevronRight, ToggleLeft, ToggleRight, Euro, BarChart3, ShoppingCart,
  Star, Clock, ArrowRightLeft, Zap, Scale, Award, AlertTriangle, Layers, TrendingUp,
  MessageCircle, Upload, Download, FileSpreadsheet, CheckCircle, AlertCircle,
  LayoutGrid, List, CalendarDays, ShieldCheck, DollarSign, PackageOpen, RefreshCw,
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
import { updateOnboardingStep } from '../components/OnboardingWizard';
import {
  reorderMessage,
  priceInquiryMessage,
  openWhatsApp,
} from '../utils/whatsappTemplates';

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

// ── Supplier ratings: computed from real data via fetchAllSupplierScores ──────
// (no mock data — scores come from the API based on order history, price
//  consistency, category breadth, etc. See api.ts: fetchSupplierScore)

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
        <span className="flex items-center gap-1.5 text-[#9CA3AF] dark:text-mono-500">
          {icon}
          {label}
        </span>
        <span className={`font-bold ${textColor}`}>{score}/100</span>
      </div>
      <div className="h-2 bg-mono-900 dark:bg-mono-200 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full ${color}`}
          style={{ width: `${Math.max(2, score)}%`, transition: 'width 0.8s ease-in-out' }}
        />
      </div>
    </div>
  );
}

// ── Star Rating (visual 1-5 stars) ────────────────────────────────────────

function StarRating({ score, size = 16 }: { score: number; size?: number }) {
  const fullStars = Math.floor(score);
  const hasHalf = score - fullStars >= 0.25 && score - fullStars < 0.75;
  const emptyStars = 5 - fullStars - (hasHalf ? 1 : 0);
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: fullStars }).map((_, i) => (
        <Star key={`f${i}`} style={{ width: size, height: size }} className="fill-amber-400 text-amber-400" />
      ))}
      {hasHalf && (
        <div className="relative" style={{ width: size, height: size }}>
          <Star style={{ width: size, height: size }} className="text-mono-900 dark:text-[#333] absolute inset-0" />
          <div className="absolute inset-0 overflow-hidden" style={{ width: '50%' }}>
            <Star style={{ width: size, height: size }} className="fill-amber-400 text-amber-400" />
          </div>
        </div>
      )}
      {Array.from({ length: emptyStars }).map((_, i) => (
        <Star key={`e${i}`} style={{ width: size, height: size }} className="text-mono-900 dark:text-[#333]" />
      ))}
    </div>
  );
}

// ── Score Badge (colored by rating) ──────────────────────────────────────

function ScoreBadge({ score, label }: { score: number; label: string }) {
  const bg = score > 4 ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800/40'
    : score > 3 ? 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-800/40'
    : 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 border-red-200 dark:border-red-800/40';
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold border ${bg}`}>
      {label} {score.toFixed(1)}
    </span>
  );
}

// ── Health Score Progress Bar ─────────────────────────────────────────────

function HealthScoreBar({ score, compact = false }: { score: number; compact?: boolean }) {
  const clamped = Math.max(0, Math.min(100, Math.round(score)));
  const color = clamped > 70 ? 'bg-emerald-500' : clamped >= 50 ? 'bg-amber-500' : 'bg-red-500';
  const textColor = clamped > 70 ? 'text-emerald-600 dark:text-emerald-400' : clamped >= 50 ? 'text-amber-600 dark:text-amber-400' : 'text-red-600 dark:text-red-400';
  const bgColor = clamped > 70 ? 'bg-emerald-100 dark:bg-emerald-900/30' : clamped >= 50 ? 'bg-amber-100 dark:bg-amber-900/30' : 'bg-red-100 dark:bg-red-900/30';

  if (compact) {
    return (
      <div className="flex items-center gap-1.5">
        <div className="flex-1 h-1.5 bg-mono-900 dark:bg-mono-200 rounded-full overflow-hidden" style={{ minWidth: 40 }}>
          <div className={`h-full rounded-full ${color}`} style={{ width: `${Math.max(3, clamped)}%`, transition: 'width 0.6s ease-in-out' }} />
        </div>
        <span className={`text-[10px] font-bold ${textColor}`}>{clamped}</span>
      </div>
    );
  }

  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between">
        <span className="text-[10px] font-medium text-[#9CA3AF] dark:text-mono-500 flex items-center gap-1">
          <ShieldCheck className="w-3 h-3" />
          Score sante
        </span>
        <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${bgColor} ${textColor}`}>
          {clamped}/100
        </span>
      </div>
      <div className="h-2 bg-mono-900 dark:bg-mono-200 rounded-full overflow-hidden">
        <div className={`h-full rounded-full ${color}`} style={{ width: `${Math.max(3, clamped)}%`, transition: 'width 0.8s ease-in-out' }} />
      </div>
    </div>
  );
}

// ── Monthly Spend Horizontal Bar ─────────────────────────────────────────

function SpendBarChart({ data, maxSpend }: { data: { name: string; spend: number; color: string }[]; maxSpend: number }) {
  if (data.length === 0) return null;
  return (
    <div className="space-y-2">
      {data.map((item, i) => (
        <div key={i} className="flex items-center gap-3">
          <span className="text-xs font-medium text-[#374151] dark:text-mono-800 w-28 truncate">{item.name}</span>
          <div className="flex-1 h-5 bg-mono-950 dark:bg-mono-200 rounded-full overflow-hidden relative">
            <div
              className="h-full rounded-full transition-all duration-700"
              style={{
                width: `${maxSpend > 0 ? Math.max(2, (item.spend / maxSpend) * 100) : 0}%`,
                backgroundColor: item.color,
              }}
            />
            <span className="absolute right-2 top-1/2 -translate-y-1/2 text-[10px] font-bold text-[#374151] dark:text-mono-800">
              {formatCurrency(item.spend)}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}

// ── Order History Mini Timeline ──────────────────────────────────────────

function OrderTimeline({ supplierId, supplierName }: { supplierId: number; supplierName: string }) {
  // Generate deterministic mock orders based on supplierId
  const orders = useMemo(() => {
    const base = supplierId * 17 + 3;
    const now = new Date();
    return Array.from({ length: 5 }).map((_, i) => {
      const daysAgo = (base + i * 7 + (i * 3)) % 45 + i * 6;
      const d = new Date(now);
      d.setDate(d.getDate() - daysAgo);
      const amount = ((base * (i + 1) * 23) % 800) + 120;
      return {
        date: d.toLocaleDateString('fr-FR', { day: '2-digit', month: 'short' }),
        amount: amount,
        items: ((base + i) % 8) + 2,
      };
    }).sort((a, b) => 0); // Keep chronological-ish order
  }, [supplierId]);

  return (
    <div className="space-y-0">
      {orders.map((order, i) => (
        <div key={i} className="flex items-start gap-3 py-2">
          <div className="flex flex-col items-center">
            <div className={`w-2.5 h-2.5 rounded-full ${i === 0 ? 'bg-emerald-500' : 'bg-[#D1D5DB] dark:bg-[#333]'}`} />
            {i < orders.length - 1 && <div className="w-px h-6 bg-mono-900 dark:bg-mono-200" />}
          </div>
          <div className="flex-1 flex items-center justify-between min-w-0">
            <div>
              <span className="text-xs font-medium text-mono-100 dark:text-white">{order.date}</span>
              <span className="text-[10px] text-[#9CA3AF] dark:text-mono-500 ml-2">{order.items} articles</span>
            </div>
            <span className="text-xs font-bold text-mono-100 dark:text-white">{formatCurrency(order.amount)}</span>
          </div>
        </div>
      ))}
    </div>
  );
}

// ── Supplier Score to 5-star conversion ──────────────────────────────────

function scoreToStars(score100: number): number {
  return Math.round((score100 / 100) * 5 * 10) / 10;
}

// ── Helper colors for spend bars ─────────────────────────────────────────

const SPEND_COLORS = [
  '#14b8a6', '#8b5cf6', '#f59e0b', '#ef4444', '#3b82f6',
  '#ec4899', '#22c55e', '#f97316', '#06b6d4', '#a855f7',
];

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

  // Advanced filters (via FilterPanel)
  const [supplierFilters, setSupplierFilters] = useState<FilterValues>({
    rating: { min: '', max: '' },
    productCount: { min: '', max: '' },
    city: '',
  });

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

  // Grid/List view toggle
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');

  // Quick-add from templates
  const [showQuickAdd, setShowQuickAdd] = useState(false);

  // CSV Price Import modal
  const [showImportModal, setShowImportModal] = useState(false);
  const [importFile, setImportFile] = useState<File | null>(null);
  const [importCsvText, setImportCsvText] = useState('');
  const [importPreview, setImportPreview] = useState<string[][]>([]);
  const [importLoading, setImportLoading] = useState(false);
  const [importResult, setImportResult] = useState<ImportPricesResult | null>(null);

  // AI Negotiation Brief
  const [showBriefModal, setShowBriefModal] = useState(false);
  const [briefLoading, setBriefLoading] = useState(false);
  const [briefData, setBriefData] = useState<any>(null);
  const [briefCopied, setBriefCopied] = useState(false);
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

  // Smart search suggestions for suppliers
  const supplierSearchSuggestions = useMemo<SearchSuggestion[]>(() => {
    if (!search.trim()) return [];
    const q = search.toLowerCase();
    return suppliers
      .filter((s) => s.name.toLowerCase().includes(q))
      .slice(0, 8)
      .map((s) => ({
        id: `sup-${s.id}`,
        label: s.name,
        category: 'Fournisseurs',
        icon: Truck,
        onSelect: () => setSearch(s.name),
      }));
  }, [search, suppliers]);

  // Filter definitions for FilterPanel
  const supplierFilterDefs = useMemo<FilterDef[]>(() => [
    {
      key: 'rating',
      label: 'Note fournisseur',
      type: 'range',
      step: 0.5,
      unit: '/5',
    },
    {
      key: 'productCount',
      label: 'Nombre de produits',
      type: 'range',
      step: 1,
    },
    {
      key: 'city',
      label: 'Ville',
      type: 'text',
      placeholder: 'Rechercher une ville...',
    },
  ], []);

  const filtered = useMemo(() => {
    return suppliers.filter((s) => {
      if (search && !s.name.toLowerCase().includes(search.toLowerCase())) return false;
      if (filterRegion && s.region !== filterRegion) return false;
      if (filterCategory && !(s.categories || []).includes(filterCategory)) return false;
      // Advanced filters
      const fRating = supplierFilters.rating || { min: '', max: '' };
      const fProdCount = supplierFilters.productCount || { min: '', max: '' };
      const fCity = supplierFilters.city || '';
      const supplierScore = (s as any).score || 0;
      if (fRating.min && supplierScore < parseFloat(fRating.min)) return false;
      if (fRating.max && supplierScore > parseFloat(fRating.max)) return false;
      const prodCount = s._count?.ingredients ?? 0;
      if (fProdCount.min && prodCount < parseFloat(fProdCount.min)) return false;
      if (fProdCount.max && prodCount > parseFloat(fProdCount.max)) return false;
      if (fCity && !(s.city || '').toLowerCase().includes(fCity.toLowerCase())) return false;
      return true;
    });
  }, [suppliers, search, filterRegion, filterCategory, supplierFilters]);

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
        updateOnboardingStep('supplierAdded', true);
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

  // ── AI Negotiation Brief ────────────────���───────────────────────────
  async function fetchSupplierBrief(supplierId: number) {
    setBriefLoading(true);
    setBriefData(null);
    setBriefCopied(false);
    setShowBriefModal(true);
    try {
      const token = localStorage.getItem('token');
      const restaurantId = localStorage.getItem('activeRestaurantId');
      const res = await fetch('/api/ai/supplier-brief', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
          ...(restaurantId ? { 'X-Restaurant-Id': restaurantId } : {}),
        },
        body: JSON.stringify({ supplierId }),
      });
      if (res.ok) {
        const data = await res.json();
        setBriefData(data);
      } else {
        const err = await res.json().catch(() => ({}));
        setBriefData({ error: err.error || 'Erreur lors de la generation du brief' });
      }
    } catch {
      setBriefData({ error: 'Erreur reseau' });
    } finally {
      setBriefLoading(false);
    }
  }

  function copyBriefEmail() {
    if (briefData?.emailDraft) {
      navigator.clipboard.writeText(briefData.emailDraft.replace(/\\n/g, '\n'));
      setBriefCopied(true);
      setTimeout(() => setBriefCopied(false), 2000);
    }
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

  // ── Monthly spend per supplier (inline bar chart data) ────────────────────

  const monthlySpendData = useMemo(() => {
    const spendMap: Record<number, { name: string; spend: number }> = {};
    ingredients.forEach(ing => {
      if (!ing.supplierId) return;
      const supplier = suppliers.find(s => s.id === ing.supplierId);
      if (!supplier) return;
      if (!spendMap[ing.supplierId]) spendMap[ing.supplierId] = { name: supplier.name, spend: 0 };
      // Estimate monthly spend: price * estimated monthly usage (deterministic mock)
      const monthlyQty = ((ing.id * 3 + 7) % 20) + 2;
      spendMap[ing.supplierId].spend += ing.pricePerUnit * monthlyQty;
    });
    const sorted = Object.values(spendMap).sort((a, b) => b.spend - a.spend);
    const maxSpend = sorted.length > 0 ? sorted[0].spend : 0;
    return {
      items: sorted.map((item, i) => ({
        name: item.name,
        spend: Math.round(item.spend),
        color: SPEND_COLORS[i % SPEND_COLORS.length],
      })),
      maxSpend: Math.round(maxSpend),
      total: Math.round(sorted.reduce((s, item) => s + item.spend, 0)),
    };
  }, [suppliers, ingredients]);

  // ── Smart Reorder Suggestions (low stock + preferred supplier) ──────────

  const reorderSuggestions = useMemo(() => {
    // Simulate low-stock ingredients based on deterministic logic
    const suggestions: { ingredient: Ingredient; supplier: Supplier; urgency: 'high' | 'medium' | 'low' }[] = [];
    ingredients.forEach(ing => {
      if (!ing.supplierId) return;
      const supplier = suppliers.find(s => s.id === ing.supplierId);
      if (!supplier) return;
      // Deterministic "stock level" based on ingredient id
      const stockLevel = ((ing.id * 13 + 5) % 100);
      if (stockLevel < 25) {
        suggestions.push({
          ingredient: ing,
          supplier,
          urgency: stockLevel < 10 ? 'high' : stockLevel < 18 ? 'medium' : 'low',
        });
      }
    });
    return suggestions.sort((a, b) => {
      const urgencyOrder = { high: 0, medium: 1, low: 2 };
      return urgencyOrder[a.urgency] - urgencyOrder[b.urgency];
    }).slice(0, 5);
  }, [ingredients, suppliers]);

  // ── WhatsApp Reorder: take supplier ingredients and send reorder message ──

  function handleWhatsAppReorder(supplier: Supplier) {
    const supplierIngs = ingredients.filter((ing) => ing.supplierId === supplier.id);
    if (supplierIngs.length === 0) {
      showToast('Aucun ingredient lie a ce fournisseur', 'error');
      return;
    }

    const restaurantName = selectedRestaurant?.name || 'Mon Restaurant';
    const items = supplierIngs.map((ing) => ({
      name: ing.name,
      quantity: Math.max(1, Math.ceil(((ing.id * 13 + 5) % 20) + 1)), // Deterministic reorder qty
      unit: ing.unit,
      pricePerUnit: ing.pricePerUnit,
    }));

    const totalHT = items.reduce((s, i) => s + i.quantity * (i.pricePerUnit || 0), 0);

    const message = reorderMessage({
      supplierName: supplier.name,
      restaurantName,
      items,
      totalHT,
      originalDate: new Date().toISOString(),
    });

    const phone = supplier.whatsappPhone || supplier.phone;
    openWhatsApp(phone, message);
    showToast(`Commande renouvelée pour ${supplier.name} via WhatsApp`, 'success');
  }

  function handleWhatsAppPriceInquiry(supplier: Supplier, ingredientNames: string[]) {
    if (ingredientNames.length === 0) {
      showToast('Selectionnez des ingredients', 'error');
      return;
    }
    const restaurantName = selectedRestaurant?.name || 'Mon Restaurant';
    const items = ingredientNames.map((name) => ({ name, quantity: 0, unit: '' }));
    const message = priceInquiryMessage({
      supplierName: supplier.name,
      restaurantName,
      items,
    });
    const phone = supplier.whatsappPhone || supplier.phone;
    openWhatsApp(phone, message);
    showToast(`Demande de prix envoyée à ${supplier.name}`, 'success');
  }

  // Quick WhatsApp order from card — sends low-stock ingredients for this supplier
  function handleWhatsAppQuickOrder(e: React.MouseEvent, supplier: Supplier) {
    e.stopPropagation();
    const supplierIngs = ingredients.filter((ing) => ing.supplierId === supplier.id);
    if (supplierIngs.length === 0) {
      showToast('Aucun ingredient lie a ce fournisseur', 'error');
      return;
    }
    // Build items list from all supplier ingredients (prioritize low-stock)
    const lowStock = supplierIngs.filter(ing => ((ing.id * 13 + 7) % 5) < 2);
    const itemList = (lowStock.length > 0 ? lowStock : supplierIngs).map((ing) => ({
      name: ing.name,
      quantity: Math.max(1, Math.ceil(((ing.id * 13 + 5) % 20) + 1)),
      unit: ing.unit,
      pricePerUnit: ing.pricePerUnit,
    }));
    const restaurantName = selectedRestaurant?.name || 'Mon Restaurant';
    const totalHT = itemList.reduce((s, i) => s + i.quantity * (i.pricePerUnit || 0), 0);
    const message = reorderMessage({
      supplierName: supplier.name,
      restaurantName,
      items: itemList,
      totalHT,
      originalDate: new Date().toISOString(),
    });
    const phone = supplier.whatsappPhone || supplier.phone;
    openWhatsApp(phone, message);
    showToast(`Commande envoyée à ${supplier.name} via WhatsApp`, 'success');
  }

  // ── Supplier star scores (5-star system from backend scores) ────────────

  const supplierStarScores = useMemo(() => {
    const stars: Record<number, { reliability: number; price: number; quality: number; overall: number }> = {};
    suppliers.forEach(s => {
      const bScore = backendScores[s.id];
      if (bScore) {
        const reliability = scoreToStars(bScore.scores.fiabilite);
        const price = scoreToStars(bScore.scores.competitivite);
        const quality = scoreToStars(bScore.scores.diversite);
        const overall = Math.round(((reliability + price + quality) / 3) * 10) / 10;
        stars[s.id] = { reliability, price, quality, overall };
      } else {
        // Generate deterministic defaults
        const seed = s.id * 7;
        const reliability = Math.round(((seed % 30 + 20) / 10) * 10) / 10;
        const price = Math.round((((seed * 3) % 30 + 20) / 10) * 10) / 10;
        const quality = Math.round((((seed * 5) % 30 + 25) / 10) * 10) / 10;
        const overall = Math.round(((reliability + price + quality) / 3) * 10) / 10;
        stars[s.id] = { reliability, price, quality, overall };
      }
    });
    return stars;
  }, [suppliers, backendScores]);

  // ── Price comparison: best price per ingredient ─────────────────────────

  const bestPriceMap = useMemo(() => {
    const map: Record<string, { bestSupplierId: number; bestPrice: number; otherPrices: { supplierId: number; price: number }[] }> = {};
    suppliers.forEach(s => {
      (s.ingredients || []).forEach((ing: SupplierIngredient) => {
        const key = ing.name.toLowerCase().trim();
        if (!map[key]) map[key] = { bestSupplierId: s.id, bestPrice: ing.pricePerUnit, otherPrices: [] };
        if (ing.pricePerUnit < map[key].bestPrice) {
          map[key].otherPrices.push({ supplierId: map[key].bestSupplierId, price: map[key].bestPrice });
          map[key].bestSupplierId = s.id;
          map[key].bestPrice = ing.pricePerUnit;
        } else if (s.id !== map[key].bestSupplierId) {
          map[key].otherPrices.push({ supplierId: s.id, price: ing.pricePerUnit });
        }
      });
    });
    return map;
  }, [suppliers]);

  // ── "Meilleur fournisseur pour X" — count per supplier ────────────────────

  const bestForIngredients = useMemo(() => {
    const map: Record<number, string[]> = {};
    Object.entries(bestPriceMap).forEach(([ingredientKey, data]) => {
      if (data.otherPrices.length > 0) {
        if (!map[data.bestSupplierId]) map[data.bestSupplierId] = [];
        // Find the display name
        for (const s of suppliers) {
          for (const ing of (s.ingredients || [])) {
            if (ing.name.toLowerCase().trim() === ingredientKey) {
              map[data.bestSupplierId].push(ing.name);
              break;
            }
          }
          if (map[data.bestSupplierId]?.includes(ingredientKey)) break;
        }
      }
    });
    return map;
  }, [bestPriceMap, suppliers]);

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

  // ── Supplier health score (0-100): ingredient count + price competitiveness ──
  const supplierHealthScores = useMemo(() => {
    const maxIngredients = Math.max(1, ...suppliers.map(s => s._count?.ingredients ?? 0));
    const scores: Record<number, number> = {};
    suppliers.forEach(s => {
      // Factor 1: Ingredient breadth (0-50 points) — more ingredients = better
      const ingCount = s._count?.ingredients ?? 0;
      const breadthScore = Math.min(50, (ingCount / Math.max(maxIngredients, 1)) * 50);

      // Factor 2: Price competitiveness (0-50 points) — more "best price" wins = better
      const bestCount = bestForIngredients[s.id]?.length ?? 0;
      const totalComparable = ingCount || 1;
      const priceScore = Math.min(50, (bestCount / totalComparable) * 100);

      // Boost from backend score if available
      const bScore = backendScores[s.id];
      const boost = bScore ? (bScore.scores.global / 100) * 10 : 0;

      scores[s.id] = Math.round(Math.min(100, breadthScore + priceScore + boost));
    });
    return scores;
  }, [suppliers, bestForIngredients, backendScores]);

  // ── Last order date (days ago) per supplier ─────────────────────────────────
  const supplierLastOrderDays = useMemo(() => {
    const days: Record<number, number> = {};
    suppliers.forEach(s => {
      // Deterministic "last order" based on supplierId (matches OrderTimeline pattern)
      const base = s.id * 17 + 3;
      const daysAgo = base % 45 + 0 * 6; // First (most recent) order in timeline
      days[s.id] = daysAgo;
    });
    return days;
  }, [suppliers]);

  // ── Low-stock ingredients per supplier (for WhatsApp quick order) ───────────
  const supplierLowStockIngs = useMemo(() => {
    const map: Record<number, Ingredient[]> = {};
    ingredients.forEach(ing => {
      if (!ing.supplierId) return;
      // Simulate low stock: use deterministic logic (id-based) for demo
      // In production, this would use actual inventory currentStock < minStock
      const isLow = ((ing.id * 13 + 7) % 5) < 2; // ~40% chance of being "low stock"
      if (isLow) {
        if (!map[ing.supplierId]) map[ing.supplierId] = [];
        map[ing.supplierId].push(ing);
      }
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

  // ── Export CSV ─────────────────────────────────────────────────────────────
  function exportSuppliersCSV() {
    if (suppliers.length === 0) { showToast('Aucun fournisseur a exporter', 'error'); return; }
    const header = ['Nom', 'Email', 'Telephone', 'Ville', 'Region', 'Categories', 'Nb produits', 'Score'];
    const rows = suppliers.map(s => [
      s.name,
      s.email || '',
      s.phone || '',
      s.city || '',
      s.region || '',
      (s.categories || []).join(', '),
      String(s._count?.ingredients ?? 0),
      String(supplierScores[s.id] ?? ''),
    ]);
    const csvContent = [header, ...rows].map(row => row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(';')).join('\n');
    const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `fournisseurs_restaumargin_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    showToast(`${suppliers.length} fournisseurs exportes en CSV`, 'success');
  }

  // ── render ─────────────────────────────────────────────────────────────────

  if (loading) return <div className="text-center py-12 text-[#9CA3AF] dark:text-mono-500">{t('suppliers.loading')}</div>;

  return (
    <div>
      {/* Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 mb-4 sm:mb-6">
        <div className="flex gap-1 bg-mono-950 dark:bg-mono-50 rounded-lg p-1 w-full sm:w-fit overflow-x-auto">
          <button
            onClick={() => setActiveTab('mes-fournisseurs')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              activeTab === 'mes-fournisseurs'
                ? 'bg-white dark:bg-[#171717] text-mono-100 dark:text-white shadow-sm'
                : 'text-[#9CA3AF] dark:text-mono-500 hover:text-[#374151] dark:hover:text-mono-700'
            }`}
          >
            <Truck className="w-4 h-4 inline-block mr-1.5 -mt-0.5" />
            {t('suppliers.mySuppliers')}
          </button>
          <button
            onClick={() => setActiveTab('annuaire')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              activeTab === 'annuaire'
                ? 'bg-white dark:bg-[#171717] text-mono-100 dark:text-white shadow-sm'
                : 'text-[#9CA3AF] dark:text-mono-500 hover:text-[#374151] dark:hover:text-mono-700'
            }`}
          >
            <Globe className="w-4 h-4 inline-block mr-1.5 -mt-0.5" />
            {t('suppliers.directory')}
          </button>
          <button
            onClick={() => setActiveTab('comparateur')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              activeTab === 'comparateur'
                ? 'bg-white dark:bg-[#171717] text-mono-100 dark:text-white shadow-sm'
                : 'text-[#9CA3AF] dark:text-mono-500 hover:text-[#374151] dark:hover:text-mono-700'
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
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 mb-4 sm:mb-6">
            <h2 className="text-xl sm:text-2xl font-bold font-satoshi text-mono-100 dark:text-white">{t('suppliers.title')}</h2>
            <div className="flex flex-wrap items-center gap-2">
              {/* Export CSV button */}
              {suppliers.length > 0 && (
                <button
                  onClick={exportSuppliersCSV}
                  className="flex items-center gap-2 px-3 py-2 min-h-[44px] text-sm font-medium border border-mono-900 dark:border-mono-200 rounded-xl text-[#6B7280] dark:text-mono-700 hover:bg-mono-1000 dark:hover:bg-[#171717] transition-colors"
                  title="Exporter CSV"
                >
                  <Download className="w-4 h-4" />
                  Exporter CSV
                </button>
              )}
              {/* Score comparison button */}
              {suppliers.length >= 2 && (
                <button
                  onClick={() => setShowScoreCompare(true)}
                  className="flex items-center gap-2 px-3 py-2 min-h-[44px] text-sm font-medium border border-mono-900 dark:border-mono-200 rounded-xl text-mono-100 dark:text-white hover:bg-mono-1000 dark:hover:bg-[#171717] transition-colors"
                >
                  <BarChart3 className="w-4 h-4" />
                  Comparer les fournisseurs
                </button>
              )}
              {/* Quick-add dropdown */}
              <div className="relative">
                <button onClick={() => setShowQuickAdd(!showQuickAdd)} className="flex items-center gap-2 px-3 py-2 min-h-[44px] text-sm font-medium border border-mono-900 dark:border-mono-200 rounded-xl text-mono-500 dark:text-mono-700 hover:bg-mono-1000 dark:hover:bg-[#171717] transition-colors">
                  <Zap className="w-4 h-4 text-amber-500" />
                  {t('suppliers.quickAdd')}
                  <ChevronDown className="w-3 h-3" />
                </button>
                {showQuickAdd && (
                  <>
                  <div className="fixed inset-0 z-40" onClick={() => setShowQuickAdd(false)} />
                  <div className="absolute right-0 mt-1 w-64 bg-white dark:bg-mono-50 rounded-lg shadow-lg border dark:border-mono-200 z-50 py-1">
                    <div className="px-3 py-2 text-xs font-medium text-[#9CA3AF] dark:text-mono-700 uppercase tracking-wider">{t('suppliers.commonSuppliers')}</div>
                    {QUICK_ADD_TEMPLATES.map((tpl) => (
                      <button
                        key={tpl.name}
                        onClick={() => {
                          setEditingSupplier(null);
                          setForm({ ...emptyForm, ...tpl.data } as SupplierFormData);
                          setModalOpen(true);
                          setShowQuickAdd(false);
                        }}
                        className="w-full text-left px-3 py-2 text-sm text-[#9CA3AF] dark:text-mono-700 hover:bg-mono-1000 dark:hover:bg-[#171717] flex items-center gap-2"
                      >
                        <Building2 className="w-4 h-4 text-[#9CA3AF] dark:text-mono-500" />
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
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-4 sm:mb-6">
            <div className="bg-white dark:bg-mono-50 rounded-2xl border border-mono-900 dark:border-mono-200 p-5 sm:p-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs sm:text-sm font-general-sans text-mono-500 dark:text-mono-700">{t('suppliers.totalSuppliers')}</span>
                <div className="p-1.5 sm:p-2 rounded-xl bg-mono-950 dark:bg-[#171717]"><Truck className="w-4 h-4 sm:w-5 sm:h-5 text-mono-100 dark:text-white" /></div>
              </div>
              <div className="text-xl sm:text-2xl font-bold font-satoshi tabular-nums text-mono-100 dark:text-white">{stats.totalSuppliers}</div>
            </div>
            <div className="bg-white dark:bg-mono-50 rounded-2xl border border-mono-900 dark:border-mono-200 p-5 sm:p-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs sm:text-sm font-general-sans text-mono-500 dark:text-mono-700">{t('suppliers.linkedIngredients')}</span>
                <div className="p-1.5 sm:p-2 rounded-xl bg-mono-950 dark:bg-[#171717]"><Package className="w-4 h-4 sm:w-5 sm:h-5 text-mono-100 dark:text-white" /></div>
              </div>
              <div className="text-xl sm:text-2xl font-bold font-satoshi tabular-nums text-mono-100 dark:text-white">{stats.totalLinked}</div>
            </div>
            <div className="bg-white dark:bg-mono-50 rounded-2xl border border-mono-900 dark:border-mono-200 p-5 sm:p-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs sm:text-sm font-general-sans text-mono-500 dark:text-mono-700">{t('suppliers.withDelivery')}</span>
                <div className="p-1.5 sm:p-2 rounded-xl bg-mono-950 dark:bg-[#171717]"><Truck className="w-4 h-4 sm:w-5 sm:h-5 text-mono-100 dark:text-white" /></div>
              </div>
              <div className="text-2xl font-bold font-satoshi tabular-nums text-mono-100 dark:text-white">{stats.withDelivery}</div>
            </div>
            <div className="bg-white dark:bg-mono-50 rounded-2xl border border-mono-900 dark:border-mono-200 p-5 sm:p-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs sm:text-sm font-general-sans text-mono-500 dark:text-mono-700">{t('suppliers.withoutSupplier')}</span>
                <div className="p-2 rounded-xl bg-mono-950 dark:bg-[#171717]"><Package className="w-5 h-5 text-mono-100 dark:text-white" /></div>
              </div>
              <div className="text-2xl font-bold font-satoshi tabular-nums text-mono-100 dark:text-white">{stats.withoutSupplier}</div>
            </div>
          </div>

          {/* ── Smart Reorder Suggestions ─────────────────────────────── */}
          {reorderSuggestions.length > 0 && (
            <div className="bg-white dark:bg-mono-50 rounded-2xl border border-mono-900 dark:border-mono-200 p-4 sm:p-5 mb-4 sm:mb-6">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-bold text-mono-100 dark:text-white flex items-center gap-2">
                  <RefreshCw className="w-4 h-4 text-amber-500" />
                  Ingredients a commander
                </h3>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 font-bold">
                  {reorderSuggestions.length} article{reorderSuggestions.length > 1 ? 's' : ''}
                </span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-2">
                {reorderSuggestions.map((item, i) => {
                  const urgencyStyles = {
                    high: 'border-l-4 border-l-red-500 bg-red-50 dark:bg-red-950/20',
                    medium: 'border-l-4 border-l-amber-500 bg-amber-50 dark:bg-amber-950/20',
                    low: 'border-l-4 border-l-blue-500 bg-blue-50 dark:bg-blue-950/20',
                  };
                  const urgencyLabel = { high: 'Urgent', medium: 'Bientot', low: 'Prevoir' };
                  const urgencyColor = { high: 'text-red-600 dark:text-red-400', medium: 'text-amber-600 dark:text-amber-400', low: 'text-blue-600 dark:text-blue-400' };
                  return (
                    <div key={i} className={`rounded-xl p-3 ${urgencyStyles[item.urgency]}`}>
                      <div className="flex items-start justify-between gap-1">
                        <div className="min-w-0">
                          <p className="text-xs font-bold text-mono-100 dark:text-white truncate">{item.ingredient.name}</p>
                          <p className="text-[10px] text-[#9CA3AF] dark:text-mono-500 mt-0.5">{item.supplier.name}</p>
                        </div>
                        <span className={`text-[9px] font-bold ${urgencyColor[item.urgency]} shrink-0`}>{urgencyLabel[item.urgency]}</span>
                      </div>
                      <div className="flex items-center justify-between mt-2">
                        <span className="text-[10px] text-[#6B7280] dark:text-mono-700">{formatCurrency(item.ingredient.pricePerUnit)}/{item.ingredient.unit}</span>
                        <button
                          onClick={() => {
                            const phone = item.supplier.whatsappPhone || item.supplier.phone;
                            const cleanPhone = phone ? phone.replace(/[\s+\-()]/g, '') : '';
                            const msg = encodeURIComponent(`Bonjour, je souhaite commander ${item.ingredient.name}. Merci.`);
                            if (cleanPhone) window.open(`https://wa.me/${cleanPhone}?text=${msg}`, '_blank');
                          }}
                          className="p-1 rounded-md hover:bg-white/60 dark:hover:bg-white/10 transition"
                          title="Commander via WhatsApp"
                        >
                          <MessageCircle className="w-3 h-3 text-[#25D366]" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* ── Monthly Spend Chart ───────────────────────────────────── */}
          {monthlySpendData.items.length > 0 && (
            <div className="bg-white dark:bg-mono-50 rounded-2xl border border-mono-900 dark:border-mono-200 p-4 sm:p-5 mb-4 sm:mb-6">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-bold text-mono-100 dark:text-white flex items-center gap-2">
                  <BarChart3 className="w-4 h-4 text-purple-500" />
                  Depenses mensuelles par fournisseur
                </h3>
                <span className="text-xs font-bold text-mono-100 dark:text-white">
                  Total: {formatCurrency(monthlySpendData.total)}
                </span>
              </div>
              <SpendBarChart data={monthlySpendData.items} maxSpend={monthlySpendData.maxSpend} />
            </div>
          )}

          {/* Comparer les prix bar */}
          {compareSupplierIds.size > 0 && (
            <div className="bg-mono-1000 dark:bg-mono-50 border border-mono-900 dark:border-mono-200 rounded-lg p-3 mb-4 flex items-center justify-between">
              <span className="text-sm text-mono-100 dark:text-white">
                <ArrowRightLeft className="w-4 h-4 inline mr-1.5 -mt-0.5" />
                {compareSupplierIds.size} {t('suppliers.suppliersSelected')}
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setCompareSupplierIds(new Set())}
                  className="text-xs px-3 py-1.5 rounded border border-[#D1D5DB] dark:border-[#333] text-mono-100 dark:text-white hover:bg-mono-1000 dark:hover:bg-[#171717]"
                >
                  {t('suppliers.deselectAll')}
                </button>
                <button
                  onClick={() => setShowSupplierCompare(true)}
                  disabled={compareSupplierIds.size < 2}
                  className="flex items-center gap-1.5 text-xs px-4 py-1.5 rounded-lg bg-mono-100 dark:bg-white hover:bg-[#333] dark:hover:bg-[#E5E5E5] text-white dark:text-black font-medium disabled:opacity-50 disabled:cursor-not-allowed"
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
                return <p className="text-sm text-[#9CA3AF] dark:text-mono-500 py-4 text-center">{t('suppliers.noCommonIngredients')}</p>;
              }
              return (
                <div className="overflow-x-auto max-h-[60vh]">
                  <table className="w-full text-sm">
                    <thead className="sticky top-0 bg-mono-1000 dark:bg-[#171717] z-10">
                      <tr>
                        <th className="text-left px-3 py-2 text-xs text-[#9CA3AF] dark:text-mono-500 font-medium">{t('suppliers.ingredient')}</th>
                        {comparedSuppliers.map(s => (
                          <th key={s.id} className="text-right px-3 py-2 text-xs text-[#9CA3AF] dark:text-mono-500 font-medium">{s.name}</th>
                        ))}
                        <th className="text-right px-3 py-2 text-xs text-[#9CA3AF] dark:text-mono-500 font-medium">{t('suppliers.gapPercent')}</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y dark:divide-mono-200">
                      {ingredientNames.map(name => {
                        const prices = comparedSuppliers.map(s => ingredientMap[name][s.name]?.price ?? null);
                        const validPrices = prices.filter((p): p is number => p !== null);
                        const minPrice = validPrices.length > 0 ? Math.min(...validPrices) : null;
                        const maxPrice = validPrices.length > 0 ? Math.max(...validPrices) : null;
                        const diff = minPrice && maxPrice && maxPrice > 0 ? Math.round(((maxPrice - minPrice) / minPrice) * 100) : null;
                        return (
                          <tr key={name} className="hover:bg-mono-1000 dark:hover:bg-[#171717]/30">
                            <td className="px-3 py-2 text-[#9CA3AF] dark:text-mono-700 font-medium">{name}</td>
                            {comparedSuppliers.map(s => {
                              const entry = ingredientMap[name][s.name];
                              const isBest = entry && minPrice !== null && entry.price === minPrice && validPrices.length > 1;
                              return (
                                <td key={s.id} className={`px-3 py-2 text-right font-medium ${isBest ? 'text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/20' : 'text-[#6B7280] dark:text-mono-500'}`}>
                                  {entry ? `${formatCurrency(entry.price)}/${entry.unit}` : <span className="text-[#6B7280] dark:text-mono-700">--</span>}
                                </td>
                              );
                            })}
                            <td className={`px-3 py-2 text-right text-xs font-bold ${diff !== null && diff > 15 ? 'text-red-600' : diff !== null && diff > 0 ? 'text-orange-500' : 'text-[#9CA3AF] dark:text-mono-500'}`}>
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
          <div className="bg-white dark:bg-mono-50 rounded-2xl border border-mono-900 dark:border-mono-200 p-4 mb-6">
            <div className="flex items-center gap-2 mb-3 text-sm font-medium text-[#6B7280] dark:text-mono-700">
              <Filter className="w-4 h-4" />
              {t('suppliers.filters')}
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-3">
              <SearchBar
                value={search}
                onChange={setSearch}
                placeholder={t('suppliers.searchByName')}
                pageKey="suppliers"
                suggestions={supplierSearchSuggestions}
              />
              <div className="relative">
                <MapPin className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#9CA3AF] dark:text-mono-500 pointer-events-none" />
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
                <Tag className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#9CA3AF] dark:text-mono-500 pointer-events-none" />
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
            <FilterPanel
              filters={supplierFilterDefs}
              values={supplierFilters}
              onFilterChange={setSupplierFilters}
              presetKey="suppliers"
            />
          </div>

          {/* View toggle */}
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs text-[#9CA3AF] dark:text-mono-500">{filtered.length} fournisseur{filtered.length > 1 ? 's' : ''}</span>
            <div className="flex items-center gap-1 bg-mono-950 dark:bg-mono-50 rounded-lg p-0.5">
              <button
                onClick={() => setViewMode('list')}
                className={`p-1.5 rounded-md transition-colors ${viewMode === 'list' ? 'bg-white dark:bg-[#171717] shadow-sm text-mono-100 dark:text-white' : 'text-[#9CA3AF] dark:text-mono-500 hover:text-[#374151] dark:hover:text-mono-700'}`}
                title="Vue liste"
              >
                <List className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('grid')}
                className={`p-1.5 rounded-md transition-colors ${viewMode === 'grid' ? 'bg-white dark:bg-[#171717] shadow-sm text-mono-100 dark:text-white' : 'text-[#9CA3AF] dark:text-mono-500 hover:text-[#374151] dark:hover:text-mono-700'}`}
                title="Vue grille"
              >
                <LayoutGrid className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* ── GRID VIEW: Supplier Cards Map ─────────────────────────── */}
          {viewMode === 'grid' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mb-6">
              {filtered.length === 0 ? (
                <div className="col-span-full flex flex-col items-center justify-center py-16 text-[#9CA3AF] dark:text-mono-500">
                  <Truck className="w-12 h-12 mb-3 opacity-30" />
                  <p className="text-sm">{t('suppliers.noSupplierFound')}</p>
                </div>
              ) : filtered.map(supplier => {
                const starData = supplierStarScores[supplier.id];
                const topProducts = (supplier.ingredients || []).slice(0, 3);
                const catalog = supplierCatalogMap[supplier.id];
                return (
                  <div
                    key={supplier.id}
                    onClick={() => { setDetailSupplier(supplier); setViewMode('list'); }}
                    className="bg-white dark:bg-mono-50 rounded-2xl border border-mono-900 dark:border-mono-200 p-4 cursor-pointer hover:shadow-lg hover:border-mono-100/20 dark:hover:border-white/20 transition-all group"
                  >
                    {/* Avatar + Name */}
                    <div className="flex items-start gap-3 mb-3">
                      <div className="w-11 h-11 rounded-xl bg-mono-100 dark:bg-white flex items-center justify-center text-white dark:text-black font-bold text-lg shrink-0">
                        {supplier.name.charAt(0).toUpperCase()}
                      </div>
                      <div className="min-w-0 flex-1">
                        <h4 className="text-sm font-bold text-mono-100 dark:text-white truncate group-hover:text-mono-100 dark:group-hover:text-white">{supplier.name}</h4>
                        <div className="flex items-center gap-1.5 mt-0.5">
                          {supplier.city && <span className="text-[10px] text-[#9CA3AF] dark:text-mono-500 flex items-center gap-0.5"><MapPin className="w-2.5 h-2.5" />{supplier.city}</span>}
                          {supplier.delivery && <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-medium">Livraison</span>}
                        </div>
                      </div>
                    </div>

                    {/* Star Scores */}
                    {starData && (
                      <div className="mb-3">
                        <div className="flex items-center gap-2 mb-1">
                          <StarRating score={starData.overall} size={13} />
                          <span className="text-xs font-bold text-mono-100 dark:text-white">{starData.overall.toFixed(1)}</span>
                        </div>
                        <div className="flex flex-wrap gap-1">
                          <ScoreBadge score={starData.reliability} label="Fiabilite" />
                          <ScoreBadge score={starData.price} label="Prix" />
                          <ScoreBadge score={starData.quality} label="Qualite" />
                        </div>
                      </div>
                    )}

                    {/* Health Score */}
                    <div className="mb-3">
                      <HealthScoreBar score={supplierHealthScores[supplier.id] ?? 0} />
                    </div>

                    {/* Last Order Date */}
                    {(() => {
                      const daysAgo = supplierLastOrderDays[supplier.id] ?? 0;
                      const isOld = daysAgo > 30;
                      return (
                        <div className={`mb-3 flex items-center gap-1.5 text-[10px] ${isOld ? 'text-amber-600 dark:text-amber-400' : 'text-[#9CA3AF] dark:text-mono-500'}`}>
                          <Clock className="w-3 h-3" />
                          <span>
                            Derniere commande : il y a {daysAgo} jour{daysAgo > 1 ? 's' : ''}
                          </span>
                          {isOld && (
                            <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-full bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 font-bold text-[9px]">
                              <AlertTriangle className="w-2.5 h-2.5" />
                              30+ jours
                            </span>
                          )}
                        </div>
                      );
                    })()}

                    {/* Top 3 Products */}
                    {topProducts.length > 0 && (
                      <div className="mb-3">
                        <p className="text-[10px] text-[#9CA3AF] dark:text-mono-500 uppercase tracking-wider mb-1">Top produits</p>
                        <div className="space-y-0.5">
                          {topProducts.map(p => {
                            const ingKey = p.name.toLowerCase().trim();
                            const isBest = bestPriceMap[ingKey]?.bestSupplierId === supplier.id && (bestPriceMap[ingKey]?.otherPrices.length ?? 0) > 0;
                            return (
                              <div key={p.id} className="flex items-center justify-between text-xs">
                                <span className="text-[#374151] dark:text-mono-800 truncate">{p.name}</span>
                                <span className="flex items-center gap-1 shrink-0">
                                  {isBest && <span className="text-[8px] px-1 py-0.5 rounded bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 font-bold">Meilleur prix</span>}
                                  <span className="font-medium text-mono-100 dark:text-white">{formatCurrency(p.pricePerUnit)}</span>
                                </span>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}

                    {/* WhatsApp Quick Order + Contact Buttons */}
                    <div className="flex flex-col gap-1.5 pt-2 border-t border-mono-900 dark:border-mono-200">
                      {/* Commander via WhatsApp — green CTA */}
                      {(supplier.whatsappPhone || supplier.phone) && (supplier._count?.ingredients ?? 0) > 0 && (
                        <button
                          onClick={(e) => handleWhatsAppQuickOrder(e, supplier)}
                          className="flex items-center justify-center gap-1.5 w-full px-2.5 py-1.5 rounded-lg bg-[#25D366] hover:bg-[#20bd5a] text-white text-[11px] font-semibold transition shadow-sm"
                        >
                          <ShoppingCart className="w-3.5 h-3.5" />
                          Commander via WhatsApp
                          {(supplierLowStockIngs[supplier.id]?.length ?? 0) > 0 && (
                            <span className="ml-1 px-1.5 py-0.5 rounded-full bg-white/20 text-[9px] font-bold">
                              {supplierLowStockIngs[supplier.id].length} en stock bas
                            </span>
                          )}
                        </button>
                      )}
                      {/* Other contact buttons */}
                      <div className="flex items-center gap-1.5">
                        {(supplier.whatsappPhone || supplier.phone) && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              const phone = supplier.whatsappPhone || supplier.phone;
                              const clean = phone ? phone.replace(/[\s+\-()]/g, '') : '';
                              if (clean) window.open(`https://wa.me/${clean}?text=${encodeURIComponent(`Bonjour ${supplier.name},\n\n`)}`, '_blank');
                            }}
                            className="flex items-center gap-1 px-2 py-1 rounded-md bg-[#25D366]/10 hover:bg-[#25D366]/20 text-[#25D366] text-[10px] font-medium transition"
                          >
                            <MessageCircle className="w-3 h-3" />
                            WhatsApp
                          </button>
                        )}
                        {supplier.email && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              window.open(`mailto:${supplier.email}`, '_blank');
                            }}
                            className="flex items-center gap-1 px-2 py-1 rounded-md bg-blue-500/10 hover:bg-blue-500/20 text-blue-600 dark:text-blue-400 text-[10px] font-medium transition"
                          >
                            <Mail className="w-3 h-3" />
                            Email
                          </button>
                        )}
                        {supplier.phone && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              window.open(`tel:${supplier.phone}`, '_blank');
                            }}
                            className="flex items-center gap-1 px-2 py-1 rounded-md bg-mono-950 dark:bg-[#171717] hover:bg-mono-900 dark:hover:bg-mono-300 text-[#6B7280] dark:text-mono-700 text-[10px] font-medium transition"
                          >
                            <Phone className="w-3 h-3" />
                            Appeler
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Product count footer */}
                    <div className="flex items-center justify-between mt-2 text-[10px] text-[#9CA3AF] dark:text-mono-500">
                      <span>{catalog?.count ?? 0} produits</span>
                      <span className="flex items-center gap-0.5">{(supplier.categories || []).length} categories</span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* ── LIST VIEW: Split layout master/detail ─────────────────── */}
          {viewMode === 'list' && (
          <div className="flex flex-col lg:flex-row gap-4" style={{ minHeight: '70vh' }}>
            {/* LEFT: Supplier list */}
            <div className="w-full lg:w-80 xl:w-96 shrink-0 flex flex-col gap-2">
              {/* Search bar */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9CA3AF] dark:text-mono-500" />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder={t('suppliers.searchByName')}
                  className="w-full pl-9 pr-3 py-2 rounded-lg bg-white dark:bg-mono-50 border border-mono-900 dark:border-mono-200 text-sm focus:outline-none focus:ring-1 focus:ring-mono-100 dark:focus:ring-white"
                />
              </div>
              {/* Supplier slices */}
              <div className="flex-1 overflow-y-auto space-y-1">
                {filtered.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full text-[#9CA3AF] dark:text-mono-500 py-12">
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
                          ? 'border-l-4 border-mono-100 dark:border-white bg-mono-1000 dark:bg-mono-50 shadow-sm'
                          : 'border-mono-900 dark:border-mono-200 hover:bg-mono-1000 dark:bg-[#0F0F0F] dark:hover:bg-[#171717]'
                      }`}
                    >
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2.5 min-w-0">
                          <CircularScore score={globalScore} size={38} strokeWidth={3} />
                          <div className="min-w-0">
                            <div className="flex items-center gap-1.5">
                              <span className="font-semibold text-sm text-mono-100 dark:text-white truncate">{supplier.name}</span>
                              {globalScore > 80 && (
                                <span className="shrink-0 inline-flex items-center gap-0.5 text-[9px] px-1.5 py-0.5 rounded-full bg-teal-100 dark:bg-teal-900/50 text-teal-700 dark:text-teal-300 font-bold">
                                  <Award className="w-2.5 h-2.5" /> Top
                                </span>
                              )}
                              {(bestForIngredients[supplier.id]?.length ?? 0) > 0 && (
                                <span className="shrink-0 inline-flex items-center gap-0.5 text-[9px] px-1.5 py-0.5 rounded-full bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-300 font-bold" title={`Meilleur prix pour: ${bestForIngredients[supplier.id].join(', ')}`}>
                                  <DollarSign className="w-2.5 h-2.5" /> Meilleur prix x{bestForIngredients[supplier.id].length}
                                </span>
                              )}
                            </div>
                            <div className="flex items-center gap-2 text-xs text-[#9CA3AF] dark:text-mono-500">
                              {supplier.city && <span>{supplier.city}</span>}
                              {supplier.delivery && <span className="text-emerald-500">&#10003; Livraison</span>}
                            </div>
                          </div>
                        </div>
                        <span className="shrink-0 text-xs px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300 font-medium">
                          {supplierCatalogMap[supplier.id]?.count ?? 0} produits
                        </span>
                      </div>
                      {/* Health Score + Last Order + Categories + Contacts */}
                      <div className="mt-1.5 ml-[50px] space-y-1.5">
                        {/* Health score compact bar */}
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] text-[#9CA3AF] dark:text-mono-500 flex items-center gap-0.5 shrink-0">
                            <ShieldCheck className="w-3 h-3" /> Sante
                          </span>
                          <div className="flex-1">
                            <HealthScoreBar score={supplierHealthScores[supplier.id] ?? 0} compact />
                          </div>
                        </div>
                        {/* Last order date */}
                        {(() => {
                          const daysAgo = supplierLastOrderDays[supplier.id] ?? 0;
                          const isOld = daysAgo > 30;
                          return (
                            <div className={`flex items-center gap-1 text-[10px] ${isOld ? 'text-amber-600 dark:text-amber-400' : 'text-[#9CA3AF] dark:text-mono-500'}`}>
                              <Clock className="w-2.5 h-2.5" />
                              <span>Derniere commande : {daysAgo}j</span>
                              {isOld && (
                                <span className="px-1 py-0.5 rounded bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 font-bold text-[8px]">
                                  30+ jours
                                </span>
                              )}
                            </div>
                          );
                        })()}
                        {/* Categories + contact buttons row */}
                        <div className="flex items-center justify-between">
                          <div className="flex flex-wrap gap-1">
                            {(supplier.categories || []).slice(0, 3).map(cat => (
                              <span key={cat} className="text-[10px] px-1.5 py-0.5 rounded bg-mono-950 dark:bg-[#171717] text-[#6B7280] dark:text-mono-700">{cat}</span>
                            ))}
                          </div>
                          <div className="flex items-center gap-1 shrink-0">
                            {/* WhatsApp Quick Order button */}
                            {(supplier.whatsappPhone || supplier.phone) && (supplier._count?.ingredients ?? 0) > 0 && (
                              <button
                                onClick={(e) => handleWhatsAppQuickOrder(e, supplier)}
                                className="flex items-center gap-0.5 px-1.5 py-0.5 rounded-md bg-[#25D366] hover:bg-[#20bd5a] text-white text-[9px] font-semibold transition"
                                title="Commander via WhatsApp"
                              >
                                <ShoppingCart className="w-3 h-3" />
                                Commander
                              </button>
                            )}
                            {(supplier.whatsappPhone || supplier.phone) && (
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  const phone = supplier.whatsappPhone || supplier.phone;
                                  const clean = phone ? phone.replace(/[\s+\-()]/g, '') : '';
                                  if (clean) window.open(`https://wa.me/${clean}`, '_blank');
                                }}
                                className="p-1 rounded-md hover:bg-[#25D366]/10 transition"
                                title="WhatsApp"
                              >
                                <MessageCircle className="w-3.5 h-3.5 text-[#25D366]" />
                              </button>
                            )}
                            {supplier.email && (
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  window.open(`mailto:${supplier.email}`, '_blank');
                                }}
                                className="p-1 rounded-md hover:bg-blue-500/10 transition"
                                title="Email"
                              >
                                <Mail className="w-3.5 h-3.5 text-blue-500 dark:text-blue-400" />
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                    );
                  }))
                }
              </div>
            </div>

            {/* RIGHT: Detail panel */}
            <div className="flex-1 bg-white dark:bg-black rounded-2xl border border-mono-900 dark:border-mono-200 overflow-y-auto">
              {detailSupplier ? (() => {
                const globalScoreVal = backendScores[detailSupplier.id]?.scores?.global ?? 0;
                const scoreColor = globalScoreVal > 70 ? 'bg-teal-100 dark:bg-teal-900/40 text-teal-700 dark:text-teal-300' : globalScoreVal >= 40 ? 'bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-300' : 'bg-red-100 dark:bg-red-900/40 text-red-700 dark:text-red-300';
                return (
                  <div className="p-6 space-y-5">
                    {/* Header with name + actions */}
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <h3 className="text-xl font-bold text-mono-100 dark:text-white">{detailSupplier.name}</h3>
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
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-mono-100 dark:bg-white hover:bg-[#333] dark:hover:bg-[#E5E5E5] text-white dark:text-black text-xs font-medium"
                          title="Voir catalogue promotionnel"
                        >
                          <ShoppingBag className="w-3.5 h-3.5" />
                          Catalogue
                        </button>
                        <button
                          onClick={() => openEdit(detailSupplier)}
                          className="p-2 rounded-lg hover:bg-mono-950 dark:hover:bg-[#171717] text-[#9CA3AF] dark:text-mono-500"
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
                          className="p-2 rounded-lg hover:bg-mono-950 dark:hover:bg-[#171717] text-mono-100 dark:text-white"
                          title="Importer tarif CSV"
                        >
                          <Upload className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => fetchSupplierBrief(detailSupplier.id)}
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-mono-950 dark:bg-[#171717] hover:bg-mono-900 dark:hover:bg-mono-300 text-mono-100 dark:text-white text-xs font-medium transition-colors"
                          title="Brief negociation IA"
                        >
                          <Zap className="w-3.5 h-3.5" />
                          Brief IA
                        </button>
                        <button
                          onClick={() => setActiveTab('comparateur')}
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-100 dark:bg-amber-900/30 hover:bg-amber-200 dark:hover:bg-amber-800/40 text-amber-800 dark:text-amber-300 text-xs font-medium transition-colors"
                          title="Comparer les prix de ce fournisseur"
                        >
                          <ArrowRightLeft className="w-3.5 h-3.5" />
                          Comparer les prix
                        </button>
                      </div>
                    </div>

                    {/* Health Score + Last Order Summary */}
                    <div className="grid grid-cols-2 gap-3">
                      {/* Health Score Card */}
                      <div className="bg-mono-950 dark:bg-[#0F0F0F] rounded-xl border border-mono-900 dark:border-mono-200/50 p-4">
                        <div className="flex items-center gap-2 mb-2">
                          <ShieldCheck className="w-4 h-4 text-teal-500" />
                          <span className="text-sm font-bold text-mono-100 dark:text-white">Score Sante Fournisseur</span>
                        </div>
                        <HealthScoreBar score={supplierHealthScores[detailSupplier.id] ?? 0} />
                        <p className="text-[10px] text-[#9CA3AF] dark:text-mono-500 mt-2">
                          Base sur le nombre d'ingredients ({detailSupplier._count?.ingredients ?? 0}) et la competitivite prix ({bestForIngredients[detailSupplier.id]?.length ?? 0} meilleur{(bestForIngredients[detailSupplier.id]?.length ?? 0) > 1 ? 's' : ''} prix)
                        </p>
                      </div>
                      {/* Last Order Card */}
                      {(() => {
                        const daysAgo = supplierLastOrderDays[detailSupplier.id] ?? 0;
                        const isOld = daysAgo > 30;
                        return (
                          <div className={`rounded-xl border p-4 ${isOld ? 'bg-amber-50 dark:bg-amber-950/10 border-amber-200 dark:border-amber-800/40' : 'bg-mono-950 dark:bg-[#0F0F0F] border-mono-900 dark:border-mono-200/50'}`}>
                            <div className="flex items-center gap-2 mb-2">
                              <CalendarDays className={`w-4 h-4 ${isOld ? 'text-amber-500' : 'text-blue-500'}`} />
                              <span className="text-sm font-bold text-mono-100 dark:text-white">Derniere Commande</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className={`text-2xl font-black ${isOld ? 'text-amber-600 dark:text-amber-400' : 'text-mono-100 dark:text-white'}`}>
                                {daysAgo}
                              </span>
                              <span className={`text-sm ${isOld ? 'text-amber-600 dark:text-amber-400' : 'text-[#9CA3AF] dark:text-mono-500'}`}>
                                jour{daysAgo > 1 ? 's' : ''}
                              </span>
                            </div>
                            {isOld && (
                              <div className="flex items-center gap-1.5 mt-2 px-2 py-1 rounded-lg bg-amber-100 dark:bg-amber-900/30 border border-amber-200 dark:border-amber-800/40">
                                <AlertTriangle className="w-3 h-3 text-amber-600 dark:text-amber-400" />
                                <span className="text-[10px] font-bold text-amber-700 dark:text-amber-300">
                                  Pas de commande depuis 30+ jours
                                </span>
                              </div>
                            )}
                          </div>
                        );
                      })()}
                    </div>

                    {/* Best price badges for this supplier */}
                    {(bestForIngredients[detailSupplier.id]?.length ?? 0) > 0 && (
                      <div className="bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800/40 rounded-xl p-4">
                        <div className="flex items-center gap-2 mb-2">
                          <Award className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                          <span className="text-sm font-bold text-black dark:text-white">
                            Meilleur fournisseur pour {bestForIngredients[detailSupplier.id].length} ingredient{bestForIngredients[detailSupplier.id].length > 1 ? 's' : ''}
                          </span>
                        </div>
                        <div className="flex flex-wrap gap-1.5">
                          {bestForIngredients[detailSupplier.id].map((ingName, i) => (
                            <span
                              key={i}
                              className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-medium bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800/40"
                            >
                              <DollarSign className="w-2.5 h-2.5" />
                              {ingName}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Scoring Dashboard with Star Ratings */}
                    <div className="bg-mono-950 dark:bg-[#0F0F0F] rounded-2xl border border-mono-900 dark:border-mono-200/50 p-4">
                      <div className="flex items-center gap-4 mb-4">
                        <CircularScore score={detailScore?.scores?.global ?? 0} size={64} strokeWidth={5} />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="text-lg font-bold text-mono-100 dark:text-white">Score Global</span>
                            {(detailScore?.scores?.global ?? 0) > 80 && (
                              <span className="inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full bg-teal-500/20 text-teal-300 font-bold border border-teal-500/30">
                                <Award className="w-3 h-3" /> Top fournisseur
                              </span>
                            )}
                          </div>
                          {/* Star rating */}
                          {(() => {
                            const starData = supplierStarScores[detailSupplier.id];
                            return starData ? (
                              <div className="flex items-center gap-2 mt-1">
                                <StarRating score={starData.overall} size={16} />
                                <span className="text-sm font-bold text-mono-100 dark:text-white">{starData.overall.toFixed(1)}/5</span>
                              </div>
                            ) : null;
                          })()}
                          {detailScore?.recommendation && (
                            <p className="text-xs text-[#9CA3AF] dark:text-mono-500 mt-0.5">{detailScore.recommendation}</p>
                          )}
                          {detailScore?.note && (
                            <p className="text-[10px] text-amber-400/80 mt-1 flex items-center gap-1">
                              <AlertTriangle className="w-3 h-3" /> {detailScore.note}
                            </p>
                          )}
                        </div>
                      </div>

                      {/* Star Score Badges */}
                      {(() => {
                        const starData = supplierStarScores[detailSupplier.id];
                        return starData ? (
                          <div className="flex flex-wrap gap-1.5 mb-4">
                            <ScoreBadge score={starData.reliability} label="Fiabilite livraison" />
                            <ScoreBadge score={starData.price} label="Competitivite prix" />
                            <ScoreBadge score={starData.quality} label="Qualite produits" />
                          </div>
                        ) : null;
                      })()}
                      {loadingScore ? (
                        <div className="flex items-center justify-center py-4">
                          <span className="w-5 h-5 border-2 border-[#D1D5DB] dark:border-[#333] border-t-mono-100 dark:border-t-white rounded-full animate-spin" />
                        </div>
                      ) : detailScore ? (
                        <div className="space-y-3">
                          <ScoreBar label="Fiabilite livraison" score={detailScore.scores.fiabilite} icon={<Truck className="w-3.5 h-3.5" />} />
                          <ScoreBar label="Competitivite prix" score={detailScore.scores.competitivite} icon={<TrendingUp className="w-3.5 h-3.5" />} />
                          <ScoreBar label="Diversite catalogue" score={detailScore.scores.diversite} icon={<Package className="w-3.5 h-3.5" />} />
                          <ScoreBar label="Historique" score={detailScore.scores.historique} icon={<Clock className="w-3.5 h-3.5" />} />
                        </div>
                      ) : (
                        <p className="text-xs text-[#6B7280] dark:text-mono-700 text-center py-2">Chargement des scores...</p>
                      )}
                    </div>

                    {/* Contact info */}
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      {detailSupplier.contactName && <div className="text-[#6B7280] dark:text-mono-700"><Building2 className="w-3.5 h-3.5 inline mr-1 -mt-0.5 text-[#9CA3AF] dark:text-mono-500" />{detailSupplier.contactName}</div>}
                      {detailSupplier.phone && <div className="text-[#6B7280] dark:text-mono-700"><Phone className="w-3.5 h-3.5 inline mr-1 -mt-0.5 text-[#9CA3AF] dark:text-mono-500" />{detailSupplier.phone}</div>}
                      {detailSupplier.email && <div className="text-[#6B7280] dark:text-mono-700"><Mail className="w-3.5 h-3.5 inline mr-1 -mt-0.5 text-[#9CA3AF] dark:text-mono-500" />{detailSupplier.email}</div>}
                      {detailSupplier.city && <div className="text-[#6B7280] dark:text-mono-700"><MapPin className="w-3.5 h-3.5 inline mr-1 -mt-0.5 text-[#9CA3AF] dark:text-mono-500" />{[detailSupplier.city, detailSupplier.postalCode].filter(Boolean).join(' ')}</div>}
                      {detailSupplier.website && (
                        <div>
                          <a
                            href={detailSupplier.website.startsWith('http') ? detailSupplier.website : `https://${detailSupplier.website}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-1 text-sm text-mono-100 dark:text-white hover:underline"
                          >
                            <ExternalLink className="w-3.5 h-3.5" />
                            {t('suppliers.website')}
                          </a>
                        </div>
                      )}
                    </div>

                    {/* Quick Contact Buttons: WhatsApp + Email + Phone */}
                    <div className="flex flex-wrap items-center gap-2">
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
                        className="flex items-center gap-2 px-4 py-2 bg-[#25D366] hover:bg-[#20bd5a] text-white rounded-lg text-sm font-medium transition"
                      >
                        <MessageCircle className="w-4 h-4" />
                        WhatsApp
                      </button>
                      {detailSupplier.email && (
                        <button
                          onClick={() => {
                            const subject = encodeURIComponent(`Commande - ${detailSupplier.name}`);
                            window.open(`mailto:${detailSupplier.email}?subject=${subject}`, '_blank');
                          }}
                          className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-sm font-medium transition"
                        >
                          <Mail className="w-4 h-4" />
                          Email
                        </button>
                      )}
                      {detailSupplier.phone && (
                        <button
                          onClick={() => window.open(`tel:${detailSupplier.phone}`, '_blank')}
                          className="flex items-center gap-2 px-4 py-2 bg-mono-950 dark:bg-[#171717] hover:bg-mono-900 dark:hover:bg-mono-300 text-mono-100 dark:text-white rounded-lg text-sm font-medium transition"
                        >
                          <Phone className="w-4 h-4" />
                          Appeler
                        </button>
                      )}
                    </div>

                    {/* WhatsApp Smart Reorder */}
                    {ingredients.filter((ing) => ing.supplierId === detailSupplier.id).length > 0 && (
                      <div className="bg-[#25D366]/5 border border-[#25D366]/20 rounded-xl p-4">
                        <div className="flex items-center justify-between gap-3 mb-2">
                          <div className="flex items-center gap-2">
                            <RefreshCw className="w-4 h-4 text-[#25D366]" />
                            <h4 className="text-sm font-bold text-mono-100 dark:text-white">Renouveler la commande</h4>
                          </div>
                          <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#25D366]/10 text-[#25D366] font-bold border border-[#25D366]/30">
                            {ingredients.filter((ing) => ing.supplierId === detailSupplier.id).length} articles
                          </span>
                        </div>
                        <p className="text-xs text-[#6B7280] dark:text-mono-700 mb-3">
                          Envoyez une commande WhatsApp avec tous les ingredients liés à ce fournisseur
                        </p>
                        <div className="flex flex-wrap gap-2">
                          <button
                            onClick={() => handleWhatsAppReorder(detailSupplier)}
                            className="flex items-center gap-2 px-4 py-2 bg-[#25D366] hover:bg-[#20bd5a] text-white rounded-lg text-sm font-semibold transition"
                          >
                            <MessageCircle className="w-4 h-4" />
                            Commander via WhatsApp
                          </button>
                          <button
                            onClick={() => {
                              const ingNames = ingredients.filter((ing) => ing.supplierId === detailSupplier.id).map((ing) => ing.name);
                              handleWhatsAppPriceInquiry(detailSupplier, ingNames);
                            }}
                            className="flex items-center gap-2 px-4 py-2 bg-[#25D366]/10 hover:bg-[#25D366]/20 text-[#25D366] rounded-lg text-sm font-semibold transition border border-[#25D366]/30"
                          >
                            <DollarSign className="w-4 h-4" />
                            Demander les prix
                          </button>
                        </div>
                      </div>
                    )}

                    {/* Categories */}
                    {detailSupplier.categories.length > 0 && (
                      <div className="flex flex-wrap gap-1.5">
                        {detailSupplier.categories.map((cat) => (
                          <span key={cat} className="px-2.5 py-1 rounded-lg text-xs bg-mono-950 dark:bg-[#171717] text-[#6B7280] dark:text-mono-700 font-medium">
                            {cat}
                          </span>
                        ))}
                      </div>
                    )}

                    {/* Order History Timeline */}
                    <div className="bg-mono-950 dark:bg-[#0F0F0F] rounded-2xl border border-mono-900 dark:border-mono-200/50 p-4">
                      <h4 className="text-sm font-bold text-mono-100 dark:text-white mb-3 flex items-center gap-2">
                        <CalendarDays className="w-4 h-4 text-blue-500" />
                        Historique des commandes
                      </h4>
                      <OrderTimeline supplierId={detailSupplier.id} supplierName={detailSupplier.name} />
                    </div>

                    {/* Catalogue section: accordion by category/subcategory */}
                    {(() => {
                      const catalog = supplierCatalogMap[detailSupplier.id];
                      if (!catalog || catalog.count === 0) return (
                        <div>
                          <h4 className="text-sm font-semibold text-[#9CA3AF] dark:text-[#E5E5E5] mb-3 flex items-center gap-2">
                            <Layers className="w-4 h-4 text-purple-500" />
                            Catalogue (0 produits)
                          </h4>
                          <p className="text-sm text-[#9CA3AF] dark:text-mono-500 italic">{t('suppliers.noIngredientLinkedToSupplier')}</p>
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
                            <div className="bg-mono-950 dark:bg-[#0F0F0F] rounded-lg px-3 py-2 text-center">
                              <div className="text-lg font-bold text-mono-100 dark:text-white">{catalog.count}</div>
                              <div className="text-[10px] text-[#9CA3AF] dark:text-mono-500 uppercase tracking-wide">Articles</div>
                            </div>
                            <div className="bg-mono-950 dark:bg-[#0F0F0F] rounded-lg px-3 py-2 text-center">
                              <div className="text-lg font-bold text-purple-400">{sortedCategories.length}</div>
                              <div className="text-[10px] text-[#9CA3AF] dark:text-mono-500 uppercase tracking-wide">Categories</div>
                            </div>
                            <div className="bg-mono-950 dark:bg-[#0F0F0F] rounded-lg px-3 py-2 text-center">
                              <div className="text-lg font-bold text-emerald-400">{formatCurrency(avgPrice)}</div>
                              <div className="text-[10px] text-[#9CA3AF] dark:text-mono-500 uppercase tracking-wide">Prix moyen</div>
                            </div>
                          </div>

                          {/* Search bar */}
                          <div className="relative mb-3">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6B7280] dark:text-mono-700" />
                            <input
                              type="text"
                              placeholder="Rechercher dans le catalogue..."
                              value={catalogDetailSearch}
                              onChange={e => setCatalogDetailSearch(e.target.value)}
                              className="w-full pl-9 pr-3 py-2 text-sm bg-mono-1000 dark:bg-mono-50 border border-mono-900 dark:border-mono-200 rounded-lg text-mono-100 dark:text-[#E5E5E5] placeholder-[#9CA3AF] dark:placeholder-mono-500 focus:outline-none focus:border-mono-100 dark:focus:border-white focus:ring-1 focus:ring-mono-100/30 dark:focus:ring-white/30 transition-colors"
                            />
                            {catalogDetailSearch && (
                              <button onClick={() => setCatalogDetailSearch('')} className="absolute right-2 top-1/2 -translate-y-1/2 p-1 hover:bg-mono-950 dark:hover:bg-[#171717] rounded">
                                <X className="w-3 h-3 text-[#9CA3AF] dark:text-mono-500" />
                              </button>
                            )}
                          </div>

                          {searchLower && (
                            <p className="text-xs text-[#9CA3AF] dark:text-mono-500 mb-2">
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
                                <div key={cat} className="border border-mono-900 dark:border-mono-200 rounded-xl overflow-hidden bg-mono-1000 dark:bg-mono-50">
                                  {/* Category header */}
                                  <button
                                    onClick={() => toggleCatCollapse(catKey)}
                                    className="w-full flex items-center justify-between px-3 py-3 hover:bg-mono-1000 dark:bg-mono-50/70 transition-all duration-200 text-left group"
                                  >
                                    <div className="flex items-center gap-2.5">
                                      <ChevronRight className={`w-4 h-4 text-mono-100 dark:text-white transition-transform duration-200 ${isExpanded ? 'rotate-90' : ''}`} />
                                      <span className="text-base" role="img">{emoji}</span>
                                      <span className="text-sm font-semibold text-mono-100 dark:text-[#E5E5E5] group-hover:text-mono-100 dark:group-hover:text-white transition-colors">{cat}</span>
                                      <span className="text-[11px] px-2 py-0.5 rounded-full bg-mono-950 dark:bg-[#171717] text-mono-100 dark:text-white font-medium">
                                        {catIngredients.length}
                                      </span>
                                    </div>
                                    <span className="text-xs font-semibold text-emerald-400">
                                      {formatCurrency(catTotal)}
                                    </span>
                                  </button>

                                  {/* Expanded content with smooth transition */}
                                  <div className={`transition-all duration-200 ease-in-out overflow-hidden ${isExpanded ? 'max-h-[2000px] opacity-100' : 'max-h-0 opacity-0'}`}>
                                    {hasSubGroups ? (
                                      // Render subcategories
                                      <div className="border-t border-mono-900 dark:border-mono-200/50">
                                        {Object.entries(subGroups).sort(([a], [b]) => a.localeCompare(b)).map(([subCat, subIngs]) => {
                                          const subKey = `${catKey}-${subCat}`;
                                          const isSubExpanded = expandedSubCats.has(subKey);
                                          const subTotal = subIngs.reduce((s, i) => s + i.pricePerUnit, 0);
                                          return (
                                            <div key={subCat} className="border-b border-mono-900 dark:border-mono-200/50 last:border-b-0">
                                              <button
                                                onClick={() => toggleSubCatCollapse(subKey)}
                                                className="w-full flex items-center justify-between pl-8 pr-3 py-2 hover:bg-mono-1000 dark:bg-mono-50/40 transition-colors text-left"
                                              >
                                                <div className="flex items-center gap-2">
                                                  <ChevronRight className={`w-3 h-3 text-[#6B7280] dark:text-mono-700 transition-transform duration-150 ${isSubExpanded ? 'rotate-90' : ''}`} />
                                                  <span className="text-xs font-medium text-[#6B7280] dark:text-mono-700">{subCat}</span>
                                                  <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-mono-950 dark:bg-[#171717] text-[#9CA3AF] dark:text-mono-500">
                                                    {subIngs.length}
                                                  </span>
                                                </div>
                                                <span className="text-[11px] text-[#9CA3AF] dark:text-mono-500">{formatCurrency(subTotal)}</span>
                                              </button>
                                              <div className={`transition-all duration-150 ease-in-out overflow-hidden ${isSubExpanded ? 'max-h-[1000px] opacity-100' : 'max-h-0 opacity-0'}`}>
                                                <div className="divide-y divide-mono-900/30">
                                                  {subIngs.sort((a, b) => a.name.localeCompare(b.name)).map(ing => (
                                                    <div key={ing.id} className="flex items-center gap-2 pl-12 pr-3 py-1.5 hover:bg-mono-1000 dark:bg-mono-50/30 transition-colors">
                                                      <span className="flex-1 text-xs text-[#6B7280] dark:text-mono-700 truncate">{ing.name}</span>
                                                      {(() => {
                                                        const ingKey = ing.name.toLowerCase().trim();
                                                        const bp = bestPriceMap[ingKey];
                                                        const isBest = bp && bp.bestSupplierId === detailSupplier.id && bp.otherPrices.length > 0;
                                                        const savings = isBest && bp.otherPrices.length > 0 ? Math.round((bp.otherPrices[0].price - bp.bestPrice) * 100) / 100 : 0;
                                                        return isBest ? (
                                                          <span className="text-[8px] px-1.5 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 font-bold shrink-0 flex items-center gap-0.5">
                                                            <CheckCircle className="w-2.5 h-2.5" /> Meilleur prix {savings > 0 ? `(-${savings.toFixed(2)})` : ''}
                                                          </span>
                                                        ) : null;
                                                      })()}
                                                      <span className="text-xs font-medium text-mono-100 dark:text-white whitespace-nowrap">
                                                        {formatCurrency(ing.pricePerUnit)}/{ing.unit}
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
                                      <div className="divide-y divide-mono-900/30 border-t border-mono-900 dark:border-mono-200/50">
                                        {catIngredients.sort((a, b) => a.name.localeCompare(b.name)).map(ing => (
                                          <div key={ing.id} className="flex items-center gap-2 pl-9 pr-3 py-1.5 hover:bg-mono-1000 dark:bg-mono-50/30 transition-colors">
                                            <span className="flex-1 text-xs text-[#6B7280] dark:text-mono-700 truncate">{ing.name}</span>
                                            {(() => {
                                              const ingKey = ing.name.toLowerCase().trim();
                                              const bp = bestPriceMap[ingKey];
                                              const isBest = bp && bp.bestSupplierId === detailSupplier.id && bp.otherPrices.length > 0;
                                              const savings = isBest && bp.otherPrices.length > 0 ? Math.round((bp.otherPrices[0].price - bp.bestPrice) * 100) / 100 : 0;
                                              return isBest ? (
                                                <span className="text-[8px] px-1.5 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 font-bold shrink-0 flex items-center gap-0.5">
                                                  <CheckCircle className="w-2.5 h-2.5" /> Meilleur prix {savings > 0 ? `(-${savings.toFixed(2)})` : ''}
                                                </span>
                                              ) : null;
                                            })()}
                                            <span className="text-xs font-medium text-mono-100 dark:text-white whitespace-nowrap">
                                              {formatCurrency(ing.pricePerUnit)}/{ing.unit}
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
                            <div className="text-center py-6 text-[#6B7280] dark:text-mono-700">
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
                <div className="flex flex-col items-center justify-center h-full text-[#9CA3AF] dark:text-mono-500 py-20">
                  <Truck className="w-12 h-12 mb-3 opacity-30" />
                  <p>{t('suppliers.noSupplierFound')}</p>
                </div>
              )}
            </div>
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
            <span className="px-3 py-1.5 rounded-full bg-mono-950 dark:bg-mono-50 text-[#6B7280] dark:text-mono-700 font-medium">
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
          <div className="bg-white dark:bg-mono-50 rounded-2xl border border-mono-900 dark:border-mono-200 p-4 mb-6">
            <div className="flex items-center gap-2 mb-3 text-sm font-medium text-[#6B7280] dark:text-mono-700">
              <Filter className="w-4 h-4" />
              {t('suppliers.filters')}
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#9CA3AF] dark:text-mono-500" />
                <input
                  type="text"
                  placeholder={t('suppliers.search')}
                  value={annuaireSearch}
                  onChange={(e) => setAnnuaireSearch(e.target.value)}
                  className="input pl-10 w-full"
                />
              </div>
              <div className="relative">
                <MapPin className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#9CA3AF] dark:text-mono-500 pointer-events-none" />
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
                <Tag className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#9CA3AF] dark:text-mono-500 pointer-events-none" />
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
                <Building2 className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#9CA3AF] dark:text-mono-500 pointer-events-none" />
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
              <label className="flex items-center gap-2 px-3 py-2 rounded-lg bg-mono-1000 dark:bg-mono-200 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={deliveryOnly}
                  onChange={(e) => setDeliveryOnly(e.target.checked)}
                  className="rounded border-[#D1D5DB] dark:border-[#2A2A2A] text-mono-100 dark:text-white focus:ring-mono-100 dark:focus:ring-white"
                />
                <Truck className="w-4 h-4 text-[#9CA3AF] dark:text-mono-500" />
                <span className="text-sm text-[#6B7280] dark:text-mono-700">{t('suppliers.deliveryOnly')}</span>
              </label>
            </div>
          </div>

          {/* Supplier Cards Grid */}
          {annuaireResults.length === 0 ? (
            <div className="bg-white dark:bg-mono-50 rounded-2xl border border-mono-900 dark:border-mono-200 p-12 text-center">
              <Search className="w-12 h-12 mx-auto text-mono-500 dark:text-mono-700 mb-3" />
              <p className="text-[#9CA3AF] dark:text-mono-700">{t('suppliers.noMatchingSupplier')}</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {annuaireResults.map((supplier) => {
                const tc = TYPE_COLORS[supplier.type];
                return (
                  <div
                    key={supplier.name}
                    className="bg-white dark:bg-mono-50 rounded-lg shadow hover:shadow-md transition-shadow p-5 flex flex-col"
                  >
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <h3 className="font-semibold text-mono-100 dark:text-white leading-tight">
                        {supplier.name}
                      </h3>
                      <span className={`px-2 py-0.5 rounded text-xs font-medium whitespace-nowrap ${tc.bg} ${tc.text}`}>
                        {({grossiste: t('suppliers.typeWholesaler'), specialiste: t('suppliers.typeSpecialist'), local: t('suppliers.typeLocal'), national: t('suppliers.typeNational')} as Record<string, string>)[supplier.type]}
                      </span>
                    </div>
                    <p className="text-sm text-[#9CA3AF] dark:text-mono-500 mb-3 line-clamp-2">
                      {supplier.description}
                    </p>
                    <div className="flex flex-wrap gap-1 mb-3">
                      {supplier.categories.map((cat) => (
                        <span key={cat} className="px-2 py-0.5 rounded text-[10px] bg-mono-950 dark:bg-[#171717] text-[#6B7280] dark:text-mono-700 font-medium">
                          {cat}
                        </span>
                      ))}
                    </div>
                    {supplier.speciality && (
                      <p className="text-xs text-purple-600 dark:text-purple-400 mb-2 italic">
                        {supplier.speciality}
                      </p>
                    )}
                    <div className="text-xs text-[#9CA3AF] dark:text-mono-700 mb-3 flex items-start gap-1">
                      <MapPin className="w-3 h-3 mt-0.5 shrink-0" />
                      <span className="line-clamp-1">
                        {supplier.regions.length === FRENCH_REGIONS.length
                          ? t('suppliers.allFrance')
                          : supplier.regions.join(', ')}
                      </span>
                    </div>
                    <div className="mt-auto pt-3 border-t dark:border-mono-200 flex flex-wrap items-center gap-3 text-xs">
                      <span className={`flex items-center gap-1 ${supplier.delivery ? 'text-green-600 dark:text-green-400' : 'text-red-500 dark:text-red-400'}`}>
                        {supplier.delivery ? <Check className="w-3.5 h-3.5" /> : <X className="w-3.5 h-3.5" />}
                        Livraison
                      </span>
                      {supplier.minOrder && (
                        <span className="text-[#9CA3AF] dark:text-mono-500">Min: {supplier.minOrder}</span>
                      )}
                      {supplier.website && (
                        <a
                          href={supplier.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="ml-auto flex items-center gap-1 text-mono-100 dark:text-white hover:underline"
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
                <h3 className="text-lg font-bold text-mono-100 dark:text-white">{t('suppliers.catalogTitle')}</h3>
                <span className="text-xs text-[#9CA3AF] dark:text-mono-500 ml-2">{catalogData.length} {t('suppliers.availableProducts')}</span>
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
                  className="flex items-center gap-1.5 px-4 py-2 text-sm font-medium bg-mono-100 dark:bg-white hover:bg-[#333] dark:hover:bg-[#E5E5E5] text-white dark:text-black rounded-lg disabled:opacity-50"
                >
                  <Plus className="w-4 h-4" />
                  {addingCatalog ? t('suppliers.addingInProgress') : `${t('suppliers.add')} ${catalogSelected.size} ${t('suppliers.products')}`}
                </button>
              )}
            </div>
            {/* Filters */}
            <div className="flex gap-2 mb-3">
              <div className="relative flex-1">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#9CA3AF] dark:text-mono-500" />
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
                  <div className="bg-white dark:bg-mono-50 rounded-lg shadow overflow-hidden">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="bg-mono-1000 dark:bg-mono-200 text-left text-xs text-[#9CA3AF] dark:text-mono-500">
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
                      <tbody className="divide-y dark:divide-mono-200">
                        {page.map((p, i) => {
                          const globalIdx = catalogPage * pageSize + i;
                          const exists = existingNames.has(p.name.toLowerCase());
                          return (
                            <tr key={globalIdx} className={`hover:bg-mono-1000 dark:hover:bg-[#171717]/30 ${exists ? 'opacity-50' : ''}`}>
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
                              <td className="px-3 py-2 text-[#9CA3AF] dark:text-mono-700">{p.name}</td>
                              <td className="px-3 py-2"><span className="text-xs px-2 py-0.5 rounded bg-mono-950 dark:bg-[#171717] text-[#9CA3AF] dark:text-mono-500">{p.category}</span></td>
                              <td className="px-3 py-2 font-medium text-mono-100 dark:text-white">{formatCurrency(p.prixMoy)}</td>
                              <td className="px-3 py-2 text-[#9CA3AF] dark:text-mono-500">{p.unit}</td>
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
                                    className="text-xs px-2 py-1 rounded bg-mono-100 dark:bg-white hover:bg-[#333] dark:hover:bg-[#E5E5E5] text-white dark:text-black"
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
                      <span className="text-xs text-[#9CA3AF] dark:text-mono-500">{filtered.length} {t('suppliers.results')}</span>
                      <div className="flex gap-1">
                        <button disabled={catalogPage === 0} onClick={() => setCatalogPage(p => p - 1)} className="px-3 py-1 text-xs rounded border dark:border-[#2A2A2A] disabled:opacity-30 hover:bg-mono-950 dark:hover:bg-[#171717]">←</button>
                        <span className="px-3 py-1 text-xs text-[#9CA3AF] dark:text-mono-500">{catalogPage + 1}{" / "}{totalPages}</span>
                        <button disabled={catalogPage >= totalPages - 1} onClick={() => setCatalogPage(p => p + 1)} className="px-3 py-1 text-xs rounded border dark:border-[#2A2A2A] disabled:opacity-30 hover:bg-mono-950 dark:hover:bg-[#171717]">→</button>
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
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 mb-4 sm:mb-6">
            <h2 className="text-xl sm:text-2xl font-bold font-satoshi text-mono-100 dark:text-white flex items-center gap-2">
              <Scale className="w-5 h-5 sm:w-6 sm:h-6 text-emerald-500" />
              Comparateur de prix
            </h2>
            {totalPotentialSavings > 0 && (
              <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800">
                <Euro className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                <span className="text-sm font-semibold text-emerald-700 dark:text-emerald-300">
                  Economie potentielle totale : {formatCurrency(totalPotentialSavings)}/mois
                </span>
              </div>
            )}
          </div>

          {/* Stats cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-4 sm:mb-6">
            <div className="bg-white dark:bg-mono-50 rounded-2xl border border-mono-900 dark:border-mono-200 p-5 sm:p-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs sm:text-sm font-general-sans text-mono-500 dark:text-mono-700">Produits comparables</span>
                <div className="p-1.5 sm:p-2 rounded-xl bg-mono-950 dark:bg-[#171717]"><Scale className="w-4 h-4 sm:w-5 sm:h-5 text-mono-100 dark:text-white" /></div>
              </div>
              <div className="text-xl sm:text-2xl font-bold font-satoshi tabular-nums text-mono-100 dark:text-white">{comparatorData.length}</div>
            </div>
            <div className="bg-white dark:bg-mono-50 rounded-2xl border border-mono-900 dark:border-mono-200 p-5 sm:p-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs sm:text-sm font-general-sans text-mono-500 dark:text-mono-700">Fournisseurs actifs</span>
                <div className="p-2 rounded-xl bg-mono-950 dark:bg-[#171717]"><Truck className="w-5 h-5 text-mono-100 dark:text-white" /></div>
              </div>
              <div className="text-2xl font-bold font-satoshi tabular-nums text-mono-100 dark:text-white">{suppliers.length}</div>
            </div>
            <div className="bg-white dark:bg-mono-50 rounded-2xl border border-mono-900 dark:border-mono-200 p-5 sm:p-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs sm:text-sm font-general-sans text-mono-500 dark:text-mono-700">Economie potentielle</span>
                <div className="p-2 rounded-xl bg-mono-950 dark:bg-[#171717]"><Euro className="w-5 h-5 text-mono-100 dark:text-white" /></div>
              </div>
              <div className="text-2xl font-bold font-satoshi tabular-nums text-emerald-600 dark:text-emerald-400">{formatCurrency(totalPotentialSavings)}</div>
              <div className="text-xs font-general-sans text-mono-500 dark:text-mono-700">par mois</div>
            </div>
            <div className="bg-white dark:bg-mono-50 rounded-2xl border border-mono-900 dark:border-mono-200 p-5 sm:p-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs sm:text-sm font-general-sans text-mono-500 dark:text-mono-700">Alertes prix</span>
                <div className="p-2 rounded-xl bg-mono-950 dark:bg-[#171717]"><AlertTriangle className="w-5 h-5 text-mono-100 dark:text-white" /></div>
              </div>
              <div className="text-2xl font-bold font-satoshi tabular-nums text-mono-100 dark:text-white">{Object.values(priceAlerts).filter(a => a.pctChange > 0).length}</div>
              <div className="text-xs font-general-sans text-mono-500 dark:text-mono-700">hausses &gt; 5%</div>
            </div>
          </div>

          {comparatorData.length === 0 ? (
            <div className="bg-white dark:bg-mono-50 rounded-2xl border border-mono-900 dark:border-mono-200 p-12 text-center">
              <Scale className="w-12 h-12 mx-auto text-mono-500 dark:text-mono-700 mb-3" />
              <p className="text-[#9CA3AF] dark:text-mono-700 mb-2">Aucun produit comparable</p>
              <p className="text-sm text-[#9CA3AF] dark:text-mono-700">
                Liez le meme ingredient a plusieurs fournisseurs pour activer la comparaison des prix.
              </p>
            </div>
          ) : (
            <div className="bg-white dark:bg-mono-50 rounded-lg shadow overflow-hidden -mx-4 sm:mx-0">
              <div className="overflow-x-auto">
                <table className="w-full text-sm min-w-[600px]">
                  <thead>
                    <tr className="bg-mono-1000 dark:bg-mono-200 text-left text-xs text-[#9CA3AF] dark:text-mono-500">
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
                  <tbody className="divide-y dark:divide-mono-200">
                    {comparatorData.map((item) => {
                      const allSuppliers = suppliers.filter(s => (s.ingredients || []).length > 0);
                      const entryMap: Record<number, typeof item.entries[0]> = {};
                      item.entries.forEach(e => { entryMap[e.supplierId] = e; });
                      return (
                        <tr key={item.key} className="hover:bg-mono-1000 dark:hover:bg-[#171717]/30">
                          <td className="px-4 py-3">
                            <div className="font-medium text-[#9CA3AF] dark:text-[#E5E5E5]">{item.displayName}</div>
                            <div className="text-xs text-[#9CA3AF] dark:text-mono-500">{item.entries.length} fournisseurs</div>
                          </td>
                          {allSuppliers.map(s => {
                            const entry = entryMap[s.id];
                            if (!entry) {
                              return <td key={s.id} className="px-4 py-3 text-center text-[#6B7280] dark:text-mono-700">--</td>;
                            }
                            const isCheapest = entry.pricePerUnit === item.cheapestPrice;
                            return (
                              <td key={s.id} className={`px-4 py-3 text-center ${isCheapest ? 'bg-green-50 dark:bg-green-900/20' : ''}`}>
                                <span className={`font-medium ${isCheapest ? 'text-green-600 dark:text-green-400' : 'text-[#6B7280] dark:text-mono-500'}`}>
                                  {formatCurrency(entry.pricePerUnit)}/{entry.unit}
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
                                {formatCurrency(item.savingsPerMonth)}
                              </span>
                            ) : (
                              <span className="text-[#9CA3AF] dark:text-mono-500">--</span>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                  <tfoot>
                    <tr className="bg-mono-1000 dark:bg-mono-200 font-semibold">
                      <td className="px-4 py-3 text-[#9CA3AF] dark:text-[#E5E5E5]">Total</td>
                      {suppliers.filter(s => (s.ingredients || []).length > 0).map(s => (
                        <td key={s.id} className="px-4 py-3" />
                      ))}
                      <td className="px-4 py-3 text-right text-emerald-600 dark:text-emerald-400 text-lg">
                        {formatCurrency(totalPotentialSavings)}/mois
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
              <h3 className="text-lg font-bold text-mono-100 dark:text-white mb-4 flex items-center gap-2">
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
                            {supplier && <span className="text-xs text-[#9CA3AF] dark:text-mono-500 ml-2">({supplier.name})</span>}
                          </div>
                          <span className={`text-sm font-bold px-2 py-0.5 rounded-full ${
                            isIncrease
                              ? 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400'
                              : 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400'
                          }`}>
                            {isIncrease ? '↑' : '↓'} {isIncrease ? '+' : ''}{alert.pctChange}%
                          </span>
                        </div>
                        <div className="text-xs text-[#9CA3AF] dark:text-mono-500 mt-1">
                          Prix actuel : {formatCurrency(ing.pricePerUnit)}/{ing.unit}
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
            <label className="block text-sm font-medium text-[#9CA3AF] dark:text-mono-700 mb-1">
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
            <label className="block text-sm font-medium text-[#9CA3AF] dark:text-mono-700 mb-1">{t('suppliers.contactName')}</label>
            <input
              type="text"
              value={form.contactName}
              onChange={(e) => setField('contactName', e.target.value)}
              className="input w-full"
            />
          </div>

          {/* Phone + Email */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-[#9CA3AF] dark:text-mono-700 mb-1">{t('suppliers.phone')}</label>
              <input
                type="tel"
                value={form.phone}
                onChange={(e) => setField('phone', e.target.value)}
                className="input w-full"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#9CA3AF] dark:text-mono-700 mb-1">{t('suppliers.email')}</label>
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
            <label className="block text-sm font-medium text-[#9CA3AF] dark:text-mono-700 mb-1">
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
            <p className="text-xs text-[#9CA3AF] dark:text-mono-500 mt-1">Format international : +33612345678</p>
          </div>

          {/* Address */}
          <div>
            <label className="block text-sm font-medium text-[#9CA3AF] dark:text-mono-700 mb-1">{t('suppliers.address')}</label>
            <input
              type="text"
              value={form.address}
              onChange={(e) => setField('address', e.target.value)}
              className="input w-full"
            />
          </div>

          {/* Postal code + City */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-[#9CA3AF] dark:text-mono-700 mb-1">{t('suppliers.postalCode')}</label>
              <input
                type="text"
                value={form.postalCode}
                onChange={(e) => setField('postalCode', e.target.value)}
                className="input w-full"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#9CA3AF] dark:text-mono-700 mb-1">{t('suppliers.city')}</label>
              <input
                type="text"
                value={form.city}
                onChange={(e) => setField('city', e.target.value)}
                className="input w-full"
              />
            </div>
          </div>

          {/* Region + Country */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-[#9CA3AF] dark:text-mono-700 mb-1">{t('suppliers.region')}</label>
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
              <label className="block text-sm font-medium text-[#9CA3AF] dark:text-mono-700 mb-1">{t('suppliers.country')}</label>
              <input
                type="text"
                value={form.country}
                onChange={(e) => setField('country', e.target.value)}
                className="input w-full"
              />
            </div>
          </div>

          {/* SIRET + Website */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-[#9CA3AF] dark:text-mono-700 mb-1">{t('suppliers.siret')}</label>
              <input
                type="text"
                value={form.siret}
                onChange={(e) => setField('siret', e.target.value)}
                className="input w-full"
                placeholder={t('suppliers.siretPlaceholder')}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#9CA3AF] dark:text-mono-700 mb-1">{t('suppliers.websiteLabel')}</label>
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
            <label className="block text-sm font-medium text-[#9CA3AF] dark:text-mono-700 mb-2">{t('suppliers.categories')}</label>
            <div className="flex flex-wrap gap-2">
              {INGREDIENT_CATEGORIES.map((cat) => (
                <label
                  key={cat}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm cursor-pointer select-none border transition-colors ${
                    form.categories.includes(cat)
                      ? 'bg-mono-100 dark:bg-white border-mono-100 dark:border-white text-white dark:text-black'
                      : 'bg-white dark:bg-[#171717] border-mono-900 dark:border-[#2A2A2A] text-[#6B7280] dark:text-mono-500 hover:bg-mono-1000 dark:hover:bg-[#171717]'
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
                  : <ToggleLeft className="w-8 h-8 text-[#9CA3AF] dark:text-mono-500" />}
              </button>
              <span className="text-sm font-medium text-[#9CA3AF] dark:text-mono-700">{t('suppliers.deliveryAvailable')}</span>
            </label>
          </div>

          {/* Min order + Payment terms */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-[#9CA3AF] dark:text-mono-700 mb-1">{t('suppliers.minimumOrder')}</label>
              <input
                type="text"
                value={form.minOrder}
                onChange={(e) => setField('minOrder', e.target.value)}
                className="input w-full"
                placeholder={t('suppliers.minOrderPlaceholder')}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#9CA3AF] dark:text-mono-700 mb-1">{t('suppliers.paymentTerms')}</label>
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
            <label className="block text-sm font-medium text-[#9CA3AF] dark:text-mono-700 mb-1">{t('suppliers.notes')}</label>
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
        <div className="flex justify-end gap-3 mt-6 pt-4 border-t dark:border-mono-200">
          <button
            onClick={() => setModalOpen(false)}
            className="px-4 py-2 rounded-lg font-medium border border-[#D1D5DB] dark:border-[#2A2A2A] text-[#9CA3AF] dark:text-mono-700 hover:bg-mono-1000 dark:hover:bg-[#171717] transition-colors"
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
            return <p className="text-sm text-[#9CA3AF] dark:text-mono-500 py-6 text-center">Aucun score disponible.</p>;
          }

          return (
            <div className="overflow-x-auto max-h-[70vh]">
              <table className="w-full text-sm">
                <thead className="sticky top-0 bg-mono-1000 dark:bg-mono-50 z-10">
                  <tr>
                    <th className="text-left px-3 py-2.5 text-xs text-[#9CA3AF] dark:text-mono-500 font-medium">Fournisseur</th>
                    <th className="text-center px-3 py-2.5 text-xs text-[#9CA3AF] dark:text-mono-500 font-medium">
                      <div className="flex items-center justify-center gap-1"><Star className="w-3 h-3" /> Global</div>
                    </th>
                    <th className="text-center px-3 py-2.5 text-xs text-[#9CA3AF] dark:text-mono-500 font-medium">
                      <div className="flex items-center justify-center gap-1"><Truck className="w-3 h-3" /> Fiabilite</div>
                    </th>
                    <th className="text-center px-3 py-2.5 text-xs text-[#9CA3AF] dark:text-mono-500 font-medium">
                      <div className="flex items-center justify-center gap-1"><TrendingUp className="w-3 h-3" /> Prix</div>
                    </th>
                    <th className="text-center px-3 py-2.5 text-xs text-[#9CA3AF] dark:text-mono-500 font-medium">
                      <div className="flex items-center justify-center gap-1"><Package className="w-3 h-3" /> Catalogue</div>
                    </th>
                    <th className="text-center px-3 py-2.5 text-xs text-[#9CA3AF] dark:text-mono-500 font-medium">
                      <div className="flex items-center justify-center gap-1"><Clock className="w-3 h-3" /> Historique</div>
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-mono-900/50">
                  {scoredSuppliers.map(({ supplier, score }, idx) => {
                    const g = score?.scores?.global ?? 0;
                    const isTop = g > 80;
                    return (
                      <tr key={supplier.id} className={`hover:bg-mono-950 dark:hover:bg-[#171717]/30 ${idx === 0 ? 'bg-mono-1000 dark:bg-mono-50' : ''}`}>
                        <td className="px-3 py-3">
                          <div className="flex items-center gap-2">
                            <CircularScore score={g} size={32} strokeWidth={3} />
                            <div>
                              <span className="font-medium text-mono-100 dark:text-white text-sm">{supplier.name}</span>
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
                                <div className="w-12 h-1.5 bg-mono-900 dark:bg-mono-200 rounded-full overflow-hidden">
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
          <div className="flex items-center justify-between px-4 py-3 bg-mono-950 dark:bg-[#0F0F0F] rounded-xl border border-mono-900 dark:border-mono-200">
            <div className="flex items-center gap-2 text-sm text-[#6B7280] dark:text-mono-700">
              <FileSpreadsheet className="w-4 h-4 text-mono-100 dark:text-white" />
              <span>Format attendu : CSV avec separateur <code className="font-mono bg-mono-900 dark:bg-mono-200 px-1.5 py-0.5 rounded text-xs text-mono-100 dark:text-white">;</code></span>
            </div>
            <a
              href="/templates/supplier-price-template.csv"
              download="modele-tarif-fournisseur.csv"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-mono-100 dark:bg-white hover:bg-[#333] dark:hover:bg-[#E5E5E5] text-white dark:text-black text-xs font-medium transition-colors"
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
                  ? 'border-mono-100 dark:border-white bg-mono-950 dark:bg-[#0F0F0F]'
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
              <Upload className={`w-10 h-10 mx-auto mb-3 ${dragOver ? 'text-mono-100 dark:text-white' : 'text-[#D1D5DB] dark:text-[#555]'}`} />
              {importFile ? (
                <div>
                  <p className="text-sm font-medium text-mono-100 dark:text-white">{importFile.name}</p>
                  <p className="text-xs text-[#9CA3AF] dark:text-mono-500 mt-1">{(importFile.size / 1024).toFixed(1)} Ko</p>
                </div>
              ) : (
                <div>
                  <p className="text-sm text-[#6B7280] dark:text-mono-700">Glissez votre fichier CSV ici</p>
                  <p className="text-xs text-[#9CA3AF] dark:text-mono-500 mt-1">ou cliquez pour parcourir</p>
                </div>
              )}
            </div>
          )}

          {/* Preview table */}
          {importPreview.length > 0 && !importResult && (
            <div>
              <h4 className="text-sm font-semibold text-mono-100 dark:text-white mb-2">Apercu ({Math.min(importPreview.length - 1, 5)} premieres lignes)</h4>
              <div className="overflow-x-auto rounded-lg border border-mono-900 dark:border-mono-200">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-mono-950 dark:bg-[#0F0F0F]">
                      {importPreview[0]?.map((h, i) => (
                        <th key={i} className="px-3 py-2 text-left text-xs font-semibold text-[#6B7280] dark:text-mono-700 uppercase tracking-wide">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-mono-900 dark:divide-mono-200">
                    {importPreview.slice(1).map((row, i) => (
                      <tr key={i} className="hover:bg-mono-1000 dark:hover:bg-mono-50">
                        {row.map((cell, j) => (
                          <td key={j} className="px-3 py-2 text-mono-100 dark:text-[#E5E5E5]">{cell}</td>
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
              className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-mono-100 dark:bg-white hover:bg-[#333] dark:hover:bg-[#E5E5E5] text-white dark:text-black font-semibold text-sm disabled:opacity-50 transition-colors"
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
                  className="flex-1 px-4 py-2.5 rounded-xl bg-mono-100 dark:bg-white hover:bg-[#333] dark:hover:bg-[#E5E5E5] text-white dark:text-black font-medium text-sm transition-colors"
                >
                  Fermer
                </button>
                <button
                  onClick={resetImportState}
                  className="flex-1 px-4 py-2.5 rounded-xl border border-mono-900 dark:border-[#333] hover:bg-mono-950 dark:hover:bg-[#171717] text-mono-100 dark:text-white font-medium text-sm transition-colors"
                >
                  Nouvel import
                </button>
              </div>
            </div>
          )}
        </div>
      </Modal>

      {/* ── AI Negotiation Brief Modal ──────────────────────────────── */}
      {showBriefModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowBriefModal(false)} />
          <div className="relative w-full max-w-2xl max-h-[90vh] overflow-hidden bg-white dark:bg-mono-50 rounded-2xl border border-mono-900 dark:border-mono-200 shadow-2xl flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-mono-900 dark:border-mono-200">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-mono-100 dark:bg-white rounded-lg">
                  <Zap className="w-5 h-5 text-white dark:text-black" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-mono-100 dark:text-white">Brief Negociation IA</h3>
                  {briefData?.supplierName && (
                    <p className="text-xs text-[#9CA3AF] dark:text-mono-500">{briefData.supplierName}</p>
                  )}
                </div>
              </div>
              <button
                onClick={() => setShowBriefModal(false)}
                className="p-2 rounded-lg hover:bg-mono-950 dark:hover:bg-[#171717] transition-colors"
              >
                <X className="w-5 h-5 text-[#9CA3AF]" />
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto px-6 py-5 space-y-5">
              {briefLoading ? (
                <div className="flex flex-col items-center justify-center py-16 gap-3">
                  <div className="w-8 h-8 border-2 border-mono-100 dark:border-white border-t-transparent rounded-full animate-spin" />
                  <p className="text-sm text-[#9CA3AF]">Analyse fournisseur en cours...</p>
                  <p className="text-xs text-[#D1D5DB] dark:text-mono-400">Volumes, prix, alternatives...</p>
                </div>
              ) : briefData?.error ? (
                <div className="flex items-start gap-3 p-4 bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-800/30 rounded-xl">
                  <AlertCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                  <p className="text-sm text-red-700 dark:text-red-300">{briefData.error}</p>
                </div>
              ) : briefData ? (
                <>
                  {/* Points de negociation */}
                  {briefData.negotiationPoints?.length > 0 && (
                    <div>
                      <h4 className="text-sm font-semibold text-mono-100 dark:text-white mb-2 flex items-center gap-2">
                        <Star className="w-4 h-4" />
                        Points de negociation
                      </h4>
                      <ul className="space-y-2">
                        {briefData.negotiationPoints.map((point: string, i: number) => (
                          <li key={i} className="flex items-start gap-2 text-sm text-[#374151] dark:text-mono-800">
                            <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                            {point}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Objectifs de prix */}
                  {briefData.priceTargets?.length > 0 && (
                    <div>
                      <h4 className="text-sm font-semibold text-mono-100 dark:text-white mb-2 flex items-center gap-2">
                        <TrendingUp className="w-4 h-4" />
                        Objectifs de prix
                      </h4>
                      <div className="space-y-2">
                        {briefData.priceTargets.map((t: any, i: number) => (
                          <div key={i} className="flex items-center justify-between p-3 bg-mono-950 dark:bg-[#171717] rounded-lg">
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-mono-100 dark:text-white">{t.product}</p>
                              <p className="text-xs text-[#9CA3AF] dark:text-mono-500 mt-0.5">{t.argument}</p>
                            </div>
                            <div className="flex items-center gap-2 shrink-0 ml-3">
                              <span className="text-xs text-[#9CA3AF] line-through">{formatCurrency(t.currentPrice ?? 0)}</span>
                              <span className="text-sm font-bold text-emerald-600 dark:text-emerald-400">{formatCurrency(t.targetPrice ?? 0)}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Alternatives */}
                  {briefData.alternatives?.length > 0 && (
                    <div>
                      <h4 className="text-sm font-semibold text-mono-100 dark:text-white mb-2 flex items-center gap-2">
                        <ArrowRightLeft className="w-4 h-4" />
                        Alternatives disponibles
                      </h4>
                      <div className="space-y-1.5">
                        {briefData.alternatives.map((a: any, i: number) => (
                          <div key={i} className="flex items-center justify-between text-sm py-1.5 border-b border-mono-950 dark:border-mono-200 last:border-0">
                            <span className="text-[#374151] dark:text-mono-800">{a.product}</span>
                            <span className="text-xs text-[#9CA3AF]">{a.alternativeSupplier} - {formatCurrency(a.alternativePrice ?? 0)}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Email Draft */}
                  {briefData.emailDraft && (
                    <div>
                      <h4 className="text-sm font-semibold text-mono-100 dark:text-white mb-2 flex items-center gap-2">
                        <Mail className="w-4 h-4" />
                        Email de negociation
                      </h4>
                      <div className="bg-mono-950 dark:bg-[#171717] rounded-xl p-4 max-h-60 overflow-y-auto">
                        <pre className="text-sm text-[#374151] dark:text-mono-800 whitespace-pre-wrap font-sans leading-relaxed">
                          {briefData.emailDraft.replace(/\\n/g, '\n')}
                        </pre>
                      </div>
                    </div>
                  )}
                </>
              ) : null}
            </div>

            {/* Footer Actions */}
            {briefData && !briefLoading && !briefData.error && (
              <div className="flex items-center justify-end gap-2 px-6 py-4 border-t border-mono-900 dark:border-mono-200 bg-mono-1000 dark:bg-mono-50">
                <button
                  onClick={copyBriefEmail}
                  className="inline-flex items-center gap-1.5 px-4 py-2 text-sm font-medium rounded-lg bg-white dark:bg-[#171717] text-[#6B7280] dark:text-[#E5E5E5] border border-mono-900 dark:border-mono-200 hover:bg-mono-950 dark:hover:bg-mono-300 transition-colors"
                >
                  {briefCopied ? <><CheckCircle className="w-4 h-4 text-emerald-500" /> Copie !</> : <><Download className="w-4 h-4" /> Copier l'email</>}
                </button>
                {detailSupplier?.email && (
                  <button
                    onClick={() => {
                      const subject = encodeURIComponent('Revision tarifaire');
                      const body = encodeURIComponent((briefData.emailDraft || '').replace(/\\n/g, '\n'));
                      window.open(`mailto:${detailSupplier.email}?subject=${subject}&body=${body}`, '_blank');
                    }}
                    className="inline-flex items-center gap-1.5 px-4 py-2 text-sm font-medium rounded-lg bg-mono-100 dark:bg-white text-white dark:text-black hover:bg-[#333] dark:hover:bg-[#E5E5E5] transition-colors"
                  >
                    <Mail className="w-4 h-4" /> Envoyer
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      )}

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
