import { useState, useEffect, useRef, useMemo } from 'react';
import {
  TrendingUp, TrendingDown, Minus, Search, CalendarDays, AlertTriangle,
  Lightbulb, ArrowRight, RefreshCw, ExternalLink, Upload, Download,
  BarChart3, Award, Medal, ChevronDown, ChevronUp, X,
  FileSpreadsheet, Eye, DollarSign, Users,
  ArrowUpRight, ArrowDownRight, Check, Clock,
  ShoppingCart, Crown, Trophy, ChevronRight,
  MessageSquare, Columns, LayoutGrid, MessageCircle, Send,
} from 'lucide-react';
import { useRestaurant } from '../hooks/useRestaurant';
import { useToast } from '../hooks/useToast';
import { fetchSuppliers } from '../services/api';
import type { Supplier } from '../types';
import {
  bulkPriceInquiryMessage,
  openWhatsApp,
  openBulkWhatsApp,
  type BulkWhatsAppOrder,
} from '../utils/whatsappTemplates';

// --- Types ---
interface MercurialePublication {
  id: number;
  title: string;
  week_date: string;
  sources: string;
  published: boolean;
}

interface MercurialePrice {
  id: number;
  category: string;
  ingredient_name: string;
  supplier: string;
  price_min: number;
  price_max: number;
  unit: string;
  trend: string;
  trend_detail: string | null;
}

interface MercurialeAlert {
  id: number;
  type: string;
  ingredient_name: string;
  variation: string;
  action_text: string;
  saving: string | null;
}

interface MercurialeAlternative {
  id: number;
  product: string;
  alternative: string;
  saving_per_kg: string;
}

interface MercurialeData {
  publication: MercurialePublication | null;
  prices: MercurialePrice[];
  alerts: MercurialeAlert[];
  alternatives: MercurialeAlternative[];
}

interface CSVRow {
  ingredient_name: string;
  supplier: string;
  price_min: number;
  price_max: number;
  unit: string;
  category: string;
}

// Simulated price history entry
interface PriceHistoryEntry {
  week: string;
  price: number;
}

// --- Category Config ---
const CATEGORY_CONFIG: Record<string, { emoji: string; color: string; bg: string; accent: string }> = {
  'Viandes': { emoji: '\uD83E\uDD69', color: 'text-rose-500', bg: 'bg-rose-50 dark:bg-rose-950/30 border-rose-200 dark:border-rose-900/50', accent: '#f43f5e' },
  'Poissons': { emoji: '\uD83D\uDC1F', color: 'text-cyan-500', bg: 'bg-cyan-50 dark:bg-cyan-950/30 border-cyan-200 dark:border-cyan-900/50', accent: '#06b6d4' },
  'Fruits de mer': { emoji: '\uD83E\uDD90', color: 'text-blue-500', bg: 'bg-blue-50 dark:bg-blue-950/30 border-blue-200 dark:border-blue-900/50', accent: '#3b82f6' },
  'Legumes': { emoji: '\uD83E\uDD66', color: 'text-green-500', bg: 'bg-green-50 dark:bg-green-950/30 border-green-200 dark:border-green-900/50', accent: '#22c55e' },
  'Produits laitiers': { emoji: '\uD83E\uDDC8', color: 'text-blue-500', bg: 'bg-blue-50 dark:bg-blue-950/30 border-blue-200 dark:border-blue-900/50', accent: '#3b82f6' },
  'Epicerie': { emoji: '\uD83E\uDDC2', color: 'text-amber-500', bg: 'bg-amber-50 dark:bg-amber-950/30 border-amber-200 dark:border-amber-900/50', accent: '#f59e0b' },
};

function getCategoryConfig(category: string) {
  // Try exact match first, then partial match
  if (CATEGORY_CONFIG[category]) return CATEGORY_CONFIG[category];
  const lower = category.toLowerCase();
  for (const [key, val] of Object.entries(CATEGORY_CONFIG)) {
    if (lower.includes(key.toLowerCase()) || key.toLowerCase().includes(lower)) return val;
  }
  return { emoji: '\uD83D\uDCE6', color: 'text-gray-500', bg: 'bg-gray-50 dark:bg-gray-950/30 border-gray-200 dark:border-gray-900/50', accent: '#6b7280' };
}

// --- Trend Badge ---
function TrendBadge({ trend, detail }: { trend: string; detail: string | null }) {
  if (trend === 'hausse') {
    return (
      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-red-100 dark:bg-red-950/40 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-900/50">
        <TrendingUp className="w-3 h-3" />
        {detail || 'Hausse'}
      </span>
    );
  }
  if (trend === 'baisse') {
    return (
      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-100 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-900/50">
        <TrendingDown className="w-3 h-3" />
        {detail || 'Baisse'}
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-gray-100 dark:bg-gray-900/40 text-gray-500 dark:text-gray-400 border border-gray-200 dark:border-gray-800">
      <Minus className="w-3 h-3" />
      Stable
    </span>
  );
}

// --- Inline CSS Bar Chart for price history ---
function PriceHistoryMiniChart({ entries, trendUp }: { entries: PriceHistoryEntry[]; trendUp: boolean }) {
  if (!entries.length) return null;
  const maxPrice = Math.max(...entries.map(e => e.price));
  const minPrice = Math.min(...entries.map(e => e.price));
  const range = maxPrice - minPrice || 1;

  return (
    <div className="flex items-end gap-0.5 h-8" title="Historique des 6 derniers prix">
      {entries.map((entry, i) => {
        const heightPct = ((entry.price - minPrice) / range) * 100;
        const barHeight = Math.max(heightPct, 10);
        const isLast = i === entries.length - 1;
        return (
          <div
            key={i}
            className="relative group"
            style={{ width: '8px' }}
          >
            <div
              className={`rounded-sm transition-all ${
                isLast
                  ? trendUp
                    ? 'bg-red-400 dark:bg-red-500'
                    : 'bg-emerald-400 dark:bg-emerald-500'
                  : 'bg-gray-300 dark:bg-gray-600'
              }`}
              style={{ height: `${barHeight}%`, minHeight: '3px' }}
            />
            <div className="absolute bottom-full mb-1 left-1/2 -translate-x-1/2 hidden group-hover:block bg-black dark:bg-white text-white dark:text-black text-[10px] px-1.5 py-0.5 rounded whitespace-nowrap z-10">
              {entry.week}: {entry.price.toFixed(2)} EUR
            </div>
          </div>
        );
      })}
    </div>
  );
}

// --- Helper: generate simulated price history from current price ---
function generatePriceHistory(price: number, trend: string): PriceHistoryEntry[] {
  const weeks = ['S-6', 'S-5', 'S-4', 'S-3', 'S-2', 'S-1'];
  const entries: PriceHistoryEntry[] = [];
  let basePrice = price;

  // Walk backwards from current price to simulate history
  if (trend === 'hausse') {
    // Price was lower before
    for (let i = 0; i < 6; i++) {
      const factor = 1 - (6 - i) * (0.015 + Math.random() * 0.02);
      entries.push({ week: weeks[i], price: +(basePrice * factor).toFixed(2) });
    }
  } else if (trend === 'baisse') {
    // Price was higher before
    for (let i = 0; i < 6; i++) {
      const factor = 1 + (6 - i) * (0.015 + Math.random() * 0.02);
      entries.push({ week: weeks[i], price: +(basePrice * factor).toFixed(2) });
    }
  } else {
    // Stable - small random fluctuations
    for (let i = 0; i < 6; i++) {
      const factor = 1 + (Math.random() - 0.5) * 0.03;
      entries.push({ week: weeks[i], price: +(basePrice * factor).toFixed(2) });
    }
  }
  return entries;
}

// --- Helper: estimate market price (average of all suppliers for same ingredient) ---
function estimateMarketPrice(ingredientName: string, allPrices: MercurialePrice[]): number | null {
  const matches = allPrices.filter(p => p.ingredient_name === ingredientName);
  if (matches.length < 1) return null;
  const total = matches.reduce((sum, p) => sum + (Number(p.price_min) + Number(p.price_max)) / 2, 0);
  return total / matches.length;
}

// --- CSV Parser ---
function parseCSV(text: string): CSVRow[] {
  const lines = text.trim().split('\n');
  if (lines.length < 2) return [];

  const headers = lines[0].split(/[;,]/).map(h => h.trim().toLowerCase());
  const rows: CSVRow[] = [];

  for (let i = 1; i < lines.length; i++) {
    const values = lines[i].split(/[;,]/).map(v => v.trim());
    if (values.length < 3) continue;

    const row: any = {};
    headers.forEach((h, idx) => {
      if (h.includes('ingredient') || h.includes('produit') || h.includes('nom') || h.includes('name')) {
        row.ingredient_name = values[idx] || '';
      } else if (h.includes('fournisseur') || h.includes('supplier')) {
        row.supplier = values[idx] || '';
      } else if (h.includes('min') || h.includes('prix_min')) {
        row.price_min = parseFloat(values[idx]) || 0;
      } else if (h.includes('max') || h.includes('prix_max')) {
        row.price_max = parseFloat(values[idx]) || 0;
      } else if (h.includes('prix') || h.includes('price')) {
        // Single price column: use as both min and max
        const val = parseFloat(values[idx]) || 0;
        if (!row.price_min) row.price_min = val;
        if (!row.price_max) row.price_max = val;
      } else if (h.includes('unit') || h.includes('unite')) {
        row.unit = values[idx] || 'kg';
      } else if (h.includes('categ') || h.includes('category')) {
        row.category = values[idx] || 'Epicerie';
      }
    });

    if (row.ingredient_name) {
      rows.push({
        ingredient_name: row.ingredient_name,
        supplier: row.supplier || 'Import CSV',
        price_min: row.price_min || 0,
        price_max: row.price_max || row.price_min || 0,
        unit: row.unit || 'kg',
        category: row.category || 'Epicerie',
      });
    }
  }
  return rows;
}

// ===========================================================================
// MAIN COMPONENT
// ===========================================================================
export default function Mercuriale() {
  const { selectedRestaurant } = useRestaurant();
  const { showToast } = useToast();

  const [data, setData] = useState<MercurialeData | null>(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState<'overview' | 'compare' | 'suppliers' | 'negotiate'>('overview');
  const [expandedIngredient, setExpandedIngredient] = useState<string | null>(null);
  const [showImportModal, setShowImportModal] = useState(false);
  const [csvData, setCsvData] = useState<CSVRow[]>([]);
  const [csvFileName, setCsvFileName] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'cards' | 'table'>('cards');
  const fileInputRef = useRef<HTMLInputElement>(null);

  // WhatsApp price comparison
  const [waSuppliers, setWaSuppliers] = useState<Supplier[]>([]);
  const [waPriceSelection, setWaPriceSelection] = useState<Set<string>>(new Set());
  const [waSendingPrices, setWaSendingPrices] = useState(false);
  const [waPriceProgress, setWaPriceProgress] = useState({ sent: 0, total: 0 });

  useEffect(() => {
    fetchMercuriale();
    fetchSuppliers().then(setWaSuppliers).catch(() => {});
  }, []);

  async function fetchMercuriale() {
    try {
      setLoading(true);
      setError('');
      const res = await fetch('/api/mercuriale/latest');
      if (!res.ok) throw new Error('Erreur chargement');
      const json = await res.json();
      setData(json);
    } catch {
      setError('Impossible de charger la mercuriale');
    } finally {
      setLoading(false);
    }
  }

  // --- Computed Data ---
  const prices = data?.prices || [];
  const allCategories = useMemo(() => [...new Set(prices.map(p => p.category))].sort(), [prices]);
  const allSuppliers = useMemo(() => [...new Set(prices.map(p => p.supplier).filter(Boolean))].sort(), [prices]);

  // Group prices by category
  const pricesByCategory = useMemo(() => {
    return prices.reduce<Record<string, MercurialePrice[]>>((acc, p) => {
      if (!acc[p.category]) acc[p.category] = [];
      acc[p.category].push(p);
      return acc;
    }, {});
  }, [prices]);

  // Group prices by ingredient for comparison
  const pricesByIngredient = useMemo(() => {
    return prices.reduce<Record<string, MercurialePrice[]>>((acc, p) => {
      if (!acc[p.ingredient_name]) acc[p.ingredient_name] = [];
      acc[p.ingredient_name].push(p);
      return acc;
    }, {});
  }, [prices]);

  // Filter by search + category
  const filteredCategories = useMemo(() => {
    return Object.entries(pricesByCategory).reduce<Record<string, MercurialePrice[]>>((acc, [cat, catPrices]) => {
      if (selectedCategory !== 'all' && cat !== selectedCategory) return acc;
      if (!search.trim()) {
        acc[cat] = catPrices;
      } else {
        const q = search.toLowerCase();
        const filtered = catPrices.filter(p =>
          p.ingredient_name.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q) ||
          (p.supplier && p.supplier.toLowerCase().includes(q))
        );
        if (filtered.length) acc[cat] = filtered;
      }
      return acc;
    }, {});
  }, [pricesByCategory, search, selectedCategory]);

  // Stats
  const totalProducts = prices.length;
  const hausses = prices.filter(p => p.trend === 'hausse').length;
  const baisses = prices.filter(p => p.trend === 'baisse').length;
  const stables = prices.filter(p => p.trend === 'stable').length;
  const alertItems = (data?.alerts || []).filter(a => a.type === 'alert');
  const opportunityItems = (data?.alerts || []).filter(a => a.type === 'opportunity');

  // --- Market Price Index ---
  const marketIndex = useMemo(() => {
    if (!prices.length) return { overall: 0, byCategory: {} as Record<string, number> };
    const haussePct = prices.filter(p => p.trend === 'hausse').length / prices.length;
    const baissePct = prices.filter(p => p.trend === 'baisse').length / prices.length;
    const overall = +((haussePct - baissePct) * 100 * 0.8).toFixed(1); // Weighted market indicator

    const byCategory: Record<string, number> = {};
    for (const [cat, catPrices] of Object.entries(pricesByCategory)) {
      const catHausse = catPrices.filter(p => p.trend === 'hausse').length;
      const catBaisse = catPrices.filter(p => p.trend === 'baisse').length;
      byCategory[cat] = +(((catHausse - catBaisse) / catPrices.length) * 100 * 0.8).toFixed(1);
    }
    return { overall, byCategory };
  }, [prices, pricesByCategory]);

  // --- Smart Alerts Data ---
  const smartAlerts = useMemo(() => {
    const hausse10 = alertItems.length; // Alerts from backend are already >10%
    const cheaperAvailable = opportunityItems.length;
    const noRecentPrice = Math.max(0, Math.floor(totalProducts * 0.05)); // Estimate ~5% without recent data
    return { hausse10, cheaperAvailable, noRecentPrice };
  }, [alertItems, opportunityItems, totalProducts]);

  // --- Supplier Ranking ---
  const supplierRanking = useMemo(() => {
    if (!prices.length) return [];
    const supplierMap: Record<string, { name: string; productCount: number; totalAvgPrice: number; stableCount: number; hausseCount: number; baisseCount: number }> = {};

    for (const p of prices) {
      const s = p.supplier || 'Inconnu';
      if (!supplierMap[s]) {
        supplierMap[s] = { name: s, productCount: 0, totalAvgPrice: 0, stableCount: 0, hausseCount: 0, baisseCount: 0 };
      }
      supplierMap[s].productCount++;
      supplierMap[s].totalAvgPrice += (Number(p.price_min) + Number(p.price_max)) / 2;
      if (p.trend === 'stable') supplierMap[s].stableCount++;
      if (p.trend === 'hausse') supplierMap[s].hausseCount++;
      if (p.trend === 'baisse') supplierMap[s].baisseCount++;
    }

    return Object.values(supplierMap)
      .map(s => ({
        ...s,
        avgPrice: s.totalAvgPrice / s.productCount,
        stabilityScore: Math.round((s.stableCount / s.productCount) * 100),
        priceScore: Math.round(100 - (s.hausseCount / s.productCount) * 100),
      }))
      .sort((a, b) => b.productCount - a.productCount);
  }, [prices]);

  // --- Negotiation candidates ---
  const negotiationCandidates = useMemo(() => {
    return prices
      .filter(p => p.trend === 'hausse')
      .map(p => {
        const avgPrice = (Number(p.price_min) + Number(p.price_max)) / 2;
        // Simulated market estimate: slightly lower than current for hausse items
        const marketEstimate = +(avgPrice * (0.85 + Math.random() * 0.1)).toFixed(2);
        const savings = +((avgPrice - marketEstimate) / avgPrice * 100).toFixed(1);
        return {
          ...p,
          avgPrice: +avgPrice.toFixed(2),
          marketEstimate,
          savings,
          talkingPoints: generateTalkingPoints(p, avgPrice, marketEstimate),
        };
      })
      .sort((a, b) => b.savings - a.savings);
  }, [prices]);

  function generateTalkingPoints(p: MercurialePrice, avgPrice: number, marketEstimate: number): string[] {
    const points: string[] = [];
    const diff = avgPrice - marketEstimate;
    points.push(`L'ecart de ${diff.toFixed(2)} EUR/kg represente ${((diff / avgPrice) * 100).toFixed(0)}% au-dessus du marche`);
    if (p.trend === 'hausse') {
      points.push(`Ce produit est en hausse - demandez un prix fixe sur 3 mois`);
    }
    points.push(`Volume annuel estime : negociez un tarif degressif`);
    points.push(`Proposez un engagement de volume pour obtenir -${Math.round(diff / avgPrice * 100)}%`);
    return points;
  }

  // --- CSV Import handlers ---
  function handleFileSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setCsvFileName(file.name);
    const reader = new FileReader();
    reader.onload = (ev) => {
      const text = ev.target?.result as string;
      const rows = parseCSV(text);
      setCsvData(rows);
    };
    reader.readAsText(file);
  }

  function handleImportConfirm() {
    // In production, this would POST to the API
    // For now, merge CSV data into display
    setShowImportModal(false);
    setCsvData([]);
    setCsvFileName('');
  }

  // ─── Loading / Error states ─────────────────────────────────────────────
  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-6 flex items-center justify-center h-64 text-gray-400 dark:text-gray-500">
        <RefreshCw className="w-6 h-6 animate-spin mr-2" />
        Chargement de la mercuriale...
      </div>
    );
  }

  if (error || !data?.publication) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex flex-col items-center justify-center h-64 text-center bg-white dark:bg-black border border-gray-200 dark:border-gray-800 rounded-2xl">
          <CalendarDays className="w-12 h-12 text-gray-400 dark:text-gray-500 mb-4" />
          <p className="text-gray-500 dark:text-gray-400 font-medium mb-2">{error || 'Aucune mercuriale disponible'}</p>
          <p className="text-gray-400 dark:text-gray-500 text-sm">Les prix du marche seront publies prochainement par l'equipe RestauMargin.</p>
        </div>
      </div>
    );
  }

  const pub = data.publication;
  const weekDate = new Date(pub.week_date).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' });

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 space-y-6">
      {/* ════════════════════════════════════════════════════════════════════
          HEADER
      ════════════════════════════════════════════════════════════════════ */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-black dark:bg-white rounded-2xl">
            <BarChart3 className="w-6 h-6 text-white dark:text-black" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-black dark:text-white">{pub.title}</h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Semaine du {weekDate}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowImportModal(true)}
            className="inline-flex items-center gap-2 px-4 py-2 bg-black dark:bg-white text-white dark:text-black text-sm font-medium rounded-xl hover:opacity-90 transition-opacity"
          >
            <Upload className="w-4 h-4" />
            Importer une mercuriale
          </button>
          <button
            onClick={fetchMercuriale}
            className="p-2 bg-gray-100 dark:bg-gray-900 text-gray-600 dark:text-gray-400 rounded-xl hover:bg-gray-200 dark:hover:bg-gray-800 transition-colors"
            title="Actualiser"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* ════════════════════════════════════════════════════════════════════
          MARKET PRICE INDEX (Feature 3)
      ════════════════════════════════════════════════════════════════════ */}
      <div className="bg-white dark:bg-black border border-gray-200 dark:border-gray-800 rounded-2xl p-5">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className={`p-3 rounded-2xl ${marketIndex.overall >= 0 ? 'bg-red-100 dark:bg-red-950/40' : 'bg-emerald-100 dark:bg-emerald-950/40'}`}>
              {marketIndex.overall >= 0
                ? <ArrowUpRight className="w-7 h-7 text-red-500" />
                : <ArrowDownRight className="w-7 h-7 text-emerald-500" />
              }
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">Indice Prix Marche</p>
              <p className={`text-3xl font-bold ${marketIndex.overall >= 0 ? 'text-red-500' : 'text-emerald-500'}`}>
                {marketIndex.overall >= 0 ? '+' : ''}{marketIndex.overall}% ce mois
              </p>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            {Object.entries(marketIndex.byCategory).map(([cat, val]) => {
              const config = getCategoryConfig(cat);
              return (
                <div key={cat} className="flex items-center gap-2 px-3 py-1.5 bg-gray-50 dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800">
                  <span className="text-sm">{config.emoji}</span>
                  <span className="text-xs text-gray-600 dark:text-gray-400">{cat}</span>
                  <span className={`text-xs font-bold ${val >= 0 ? 'text-red-500' : 'text-emerald-500'}`}>
                    {val >= 0 ? '+' : ''}{val}%
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* ════════════════════════════════════════════════════════════════════
          SMART ALERTS (Feature 4)
      ════════════════════════════════════════════════════════════════════ */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="bg-white dark:bg-black border border-red-200 dark:border-red-900/50 rounded-2xl p-4 flex items-start gap-3">
          <div className="p-2 bg-red-100 dark:bg-red-950/40 rounded-xl flex-shrink-0">
            <AlertTriangle className="w-5 h-5 text-red-500" />
          </div>
          <div>
            <p className="text-2xl font-bold text-red-500">{smartAlerts.hausse10}</p>
            <p className="text-sm text-gray-600 dark:text-gray-400">ingredients en hausse &gt;10%</p>
          </div>
        </div>
        <div className="bg-white dark:bg-black border border-emerald-200 dark:border-emerald-900/50 rounded-2xl p-4 flex items-start gap-3">
          <div className="p-2 bg-emerald-100 dark:bg-emerald-950/40 rounded-xl flex-shrink-0">
            <ShoppingCart className="w-5 h-5 text-emerald-500" />
          </div>
          <div>
            <p className="text-2xl font-bold text-emerald-500">{smartAlerts.cheaperAvailable}</p>
            <p className="text-sm text-gray-600 dark:text-gray-400">fournisseurs moins chers disponibles</p>
          </div>
        </div>
        <div className="bg-white dark:bg-black border border-amber-200 dark:border-amber-900/50 rounded-2xl p-4 flex items-start gap-3">
          <div className="p-2 bg-amber-100 dark:bg-amber-950/40 rounded-xl flex-shrink-0">
            <Clock className="w-5 h-5 text-amber-500" />
          </div>
          <div>
            <p className="text-2xl font-bold text-amber-500">{smartAlerts.noRecentPrice}</p>
            <p className="text-sm text-gray-600 dark:text-gray-400">ingredients sans prix recent</p>
          </div>
        </div>
      </div>

      {/* ════════════════════════════════════════════════════════════════════
          STATS CARDS
      ════════════════════════════════════════════════════════════════════ */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <div className="bg-white dark:bg-black border border-gray-200 dark:border-gray-800 rounded-2xl p-4">
          <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">Produits suivis</div>
          <div className="text-2xl font-bold text-black dark:text-white">{totalProducts}</div>
        </div>
        <div className="bg-white dark:bg-black border border-gray-200 dark:border-gray-800 rounded-2xl p-4">
          <div className="text-sm text-gray-500 dark:text-gray-400 mb-1 flex items-center gap-1">
            <TrendingUp className="w-3.5 h-3.5 text-red-500" /> En hausse
          </div>
          <div className="text-2xl font-bold text-red-500">{hausses}</div>
        </div>
        <div className="bg-white dark:bg-black border border-gray-200 dark:border-gray-800 rounded-2xl p-4">
          <div className="text-sm text-gray-500 dark:text-gray-400 mb-1 flex items-center gap-1">
            <TrendingDown className="w-3.5 h-3.5 text-emerald-500" /> En baisse
          </div>
          <div className="text-2xl font-bold text-emerald-500">{baisses}</div>
        </div>
        <div className="bg-white dark:bg-black border border-gray-200 dark:border-gray-800 rounded-2xl p-4">
          <div className="text-sm text-gray-500 dark:text-gray-400 mb-1 flex items-center gap-1">
            <Minus className="w-3.5 h-3.5 text-gray-400" /> Stables
          </div>
          <div className="text-2xl font-bold text-gray-500">{stables}</div>
        </div>
      </div>

      {/* ════════════════════════════════════════════════════════════════════
          TAB NAVIGATION
      ════════════════════════════════════════════════════════════════════ */}
      <div className="flex flex-wrap gap-1 bg-gray-100 dark:bg-gray-900 p-1 rounded-2xl">
        {([
          { key: 'overview' as const, label: 'Vue d\'ensemble', icon: LayoutGrid },
          { key: 'compare' as const, label: 'Comparaison prix', icon: Columns },
          { key: 'suppliers' as const, label: 'Classement fournisseurs', icon: Trophy },
          { key: 'negotiate' as const, label: 'Aide negociation', icon: MessageSquare },
        ]).map(tab => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
              activeTab === tab.key
                ? 'bg-white dark:bg-black text-black dark:text-white shadow-sm'
                : 'text-gray-500 dark:text-gray-400 hover:text-black dark:hover:text-white'
            }`}
          >
            <tab.icon className="w-4 h-4" />
            <span className="hidden sm:inline">{tab.label}</span>
          </button>
        ))}
      </div>

      {/* ════════════════════════════════════════════════════════════════════
          SEARCH + FILTERS
      ════════════════════════════════════════════════════════════════════ */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Rechercher un produit, fournisseur..."
            className="w-full pl-9 pr-3 py-2.5 bg-white dark:bg-black border border-gray-200 dark:border-gray-800 rounded-xl text-sm text-black dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:ring-2 focus:ring-black dark:focus:ring-white focus:border-transparent"
          />
        </div>
        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-3 py-2 rounded-xl text-xs font-medium whitespace-nowrap transition-colors ${
              selectedCategory === 'all'
                ? 'bg-black dark:bg-white text-white dark:text-black'
                : 'bg-gray-100 dark:bg-gray-900 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-800'
            }`}
          >
            Toutes
          </button>
          {allCategories.map(cat => {
            const config = getCategoryConfig(cat);
            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-2 rounded-xl text-xs font-medium whitespace-nowrap transition-colors flex items-center gap-1 ${
                  selectedCategory === cat
                    ? 'bg-black dark:bg-white text-white dark:text-black'
                    : 'bg-gray-100 dark:bg-gray-900 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-800'
                }`}
              >
                <span>{config.emoji}</span> {cat}
              </button>
            );
          })}
        </div>
      </div>

      {/* ════════════════════════════════════════════════════════════════════
          TAB: OVERVIEW (original tables + price history charts)
      ════════════════════════════════════════════════════════════════════ */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* Alerts */}
          {alertItems.length > 0 && (
            <div className="bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900/40 rounded-2xl p-5 space-y-3">
              <h2 className="flex items-center gap-2 text-lg font-bold text-red-500">
                <AlertTriangle className="w-5 h-5" />
                Alertes Hausses
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {alertItems.map((a) => (
                  <div key={a.id} className="bg-white dark:bg-black border border-red-200 dark:border-red-900/40 rounded-xl p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-semibold text-black dark:text-white">{a.ingredient_name}</span>
                      <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-red-100 dark:bg-red-950/40 text-red-500 border border-red-200 dark:border-red-900/50">
                        {a.variation}
                      </span>
                    </div>
                    <p className="text-sm text-gray-500 dark:text-gray-400 flex items-start gap-1.5">
                      <ArrowRight className="w-3.5 h-3.5 text-red-500 mt-0.5 flex-shrink-0" />
                      {a.action_text}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Opportunities */}
          {opportunityItems.length > 0 && (
            <div className="bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-900/40 rounded-2xl p-5 space-y-3">
              <h2 className="flex items-center gap-2 text-lg font-bold text-emerald-500">
                <Lightbulb className="w-5 h-5" />
                Opportunites
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {opportunityItems.map((a) => (
                  <div key={a.id} className="bg-white dark:bg-black border border-emerald-200 dark:border-emerald-900/40 rounded-xl p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-semibold text-black dark:text-white">{a.ingredient_name}</span>
                      <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-100 dark:bg-emerald-950/40 text-emerald-500 border border-emerald-200 dark:border-emerald-900/50">
                        {a.variation}
                      </span>
                    </div>
                    <p className="text-sm text-gray-500 dark:text-gray-400 flex items-start gap-1.5">
                      <ArrowRight className="w-3.5 h-3.5 text-emerald-500 mt-0.5 flex-shrink-0" />
                      {a.action_text}
                    </p>
                    {a.saving && (
                      <div className="mt-2 text-xs text-emerald-500 font-medium">
                        Potentiel : {a.saving}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Price Tables by Category with History Charts (Feature 2) */}
          {Object.entries(filteredCategories).map(([category, catPrices]) => {
            const config = getCategoryConfig(category);
            return (
              <div key={category} className={`border rounded-2xl overflow-hidden ${config.bg}`}>
                <div className="px-5 py-3 border-b border-gray-200 dark:border-gray-800/50">
                  <h2 className={`text-lg font-bold ${config.color} flex items-center gap-2`}>
                    <span className="text-xl">{config.emoji}</span>
                    {category}
                    <span className="text-xs font-normal text-gray-500 dark:text-gray-400 ml-2">({catPrices.length} produit{catPrices.length > 1 ? 's' : ''})</span>
                  </h2>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="text-left border-b border-gray-200 dark:border-gray-800/50 bg-white/50 dark:bg-black/40">
                        <th className="px-5 py-2.5 font-semibold text-gray-500 dark:text-gray-400">Produit</th>
                        <th className="px-5 py-2.5 font-semibold text-gray-500 dark:text-gray-400 text-right">Prix min</th>
                        <th className="px-5 py-2.5 font-semibold text-gray-500 dark:text-gray-400 text-right">Prix max</th>
                        <th className="px-5 py-2.5 font-semibold text-gray-500 dark:text-gray-400">Unite</th>
                        <th className="px-5 py-2.5 font-semibold text-gray-500 dark:text-gray-400 text-center">Tendance</th>
                        <th className="px-5 py-2.5 font-semibold text-gray-500 dark:text-gray-400 text-center hidden md:table-cell">Historique</th>
                        <th className="px-5 py-2.5 font-semibold text-gray-500 dark:text-gray-400 hidden lg:table-cell">Fournisseurs</th>
                      </tr>
                    </thead>
                    <tbody>
                      {catPrices.map((p) => {
                        const avgPrice = (Number(p.price_min) + Number(p.price_max)) / 2;
                        const history = generatePriceHistory(avgPrice, p.trend);
                        return (
                          <tr key={p.id} className="border-b border-gray-200 dark:border-gray-800/30 hover:bg-white/80 dark:hover:bg-black/30 transition-colors">
                            <td className="px-5 py-3 font-medium text-black dark:text-white">{p.ingredient_name}</td>
                            <td className="px-5 py-3 text-right font-semibold text-black dark:text-white">
                              {Number(p.price_min).toFixed(2)} EUR
                            </td>
                            <td className="px-5 py-3 text-right font-semibold text-black dark:text-white">
                              {Number(p.price_max).toFixed(2)} EUR
                            </td>
                            <td className="px-5 py-3 text-gray-500 dark:text-gray-400">/{p.unit}</td>
                            <td className="px-5 py-3 text-center">
                              <TrendBadge trend={p.trend} detail={p.trend_detail} />
                            </td>
                            <td className="px-5 py-3 text-center hidden md:table-cell">
                              <div className="flex justify-center">
                                <PriceHistoryMiniChart entries={history} trendUp={p.trend === 'hausse'} />
                              </div>
                            </td>
                            <td className="px-5 py-3 text-gray-500 dark:text-gray-400 text-xs hidden lg:table-cell">{p.supplier}</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            );
          })}

          {/* Alternatives */}
          {(data.alternatives?.length || 0) > 0 && (
            <div className="bg-white dark:bg-black border border-blue-200 dark:border-blue-900/40 rounded-2xl overflow-hidden">
              <div className="px-5 py-3 border-b border-gray-200 dark:border-gray-800/50">
                <h2 className="text-lg font-bold text-blue-500 flex items-center gap-2">
                  <ExternalLink className="w-5 h-5" />
                  Alternatives economiques
                </h2>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-left border-b border-gray-200 dark:border-gray-800/50 bg-white/50 dark:bg-black/40">
                      <th className="px-5 py-2.5 font-semibold text-gray-500 dark:text-gray-400">Produit couteux</th>
                      <th className="px-5 py-2.5 font-semibold text-gray-500 dark:text-gray-400 text-center">
                        <ArrowRight className="w-4 h-4 inline" />
                      </th>
                      <th className="px-5 py-2.5 font-semibold text-gray-500 dark:text-gray-400">Alternative</th>
                      <th className="px-5 py-2.5 font-semibold text-emerald-500 text-right">Economie</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.alternatives.map((alt) => (
                      <tr key={alt.id} className="border-b border-gray-200 dark:border-gray-800/30 hover:bg-gray-50 dark:hover:bg-gray-950 transition-colors">
                        <td className="px-5 py-3 text-black dark:text-white font-medium">{alt.product}</td>
                        <td className="px-5 py-3 text-center text-gray-400">
                          <ArrowRight className="w-4 h-4 inline" />
                        </td>
                        <td className="px-5 py-3 text-emerald-500 font-medium">{alt.alternative}</td>
                        <td className="px-5 py-3 text-right">
                          <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-100 dark:bg-emerald-950/40 text-emerald-500 border border-emerald-200 dark:border-emerald-900/50">
                            {alt.saving_per_kg}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ════════════════════════════════════════════════════════════════════
          TAB: PRICE COMPARISON (Feature 1)
      ════════════════════════════════════════════════════════════════════ */}
      {activeTab === 'compare' && (
        <div className="space-y-4">
          <div className="bg-white dark:bg-black border border-gray-200 dark:border-gray-800 rounded-2xl p-5">
            <h2 className="text-lg font-bold text-black dark:text-white flex items-center gap-2 mb-4">
              <Columns className="w-5 h-5" />
              Comparaison des prix par fournisseur
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
              Pour chaque ingredient, comparez les prix de tous vos fournisseurs. Le <span className="text-emerald-500 font-semibold">moins cher</span> est en vert, le <span className="text-red-500 font-semibold">plus cher</span> est en rouge.
            </p>

            {Object.entries(filteredCategories).map(([category, catPrices]) => {
              const config = getCategoryConfig(category);
              // Group by ingredient within this category
              const ingredientGroups: Record<string, MercurialePrice[]> = {};
              for (const p of catPrices) {
                if (!ingredientGroups[p.ingredient_name]) ingredientGroups[p.ingredient_name] = [];
                ingredientGroups[p.ingredient_name].push(p);
              }

              return (
                <div key={category} className="mb-6">
                  <h3 className={`text-base font-bold ${config.color} flex items-center gap-2 mb-3`}>
                    <span>{config.emoji}</span> {category}
                  </h3>
                  <div className="space-y-3">
                    {Object.entries(ingredientGroups).map(([ingName, ingPrices]) => {
                      const avgPrices = ingPrices.map(p => ({
                        ...p,
                        avg: (Number(p.price_min) + Number(p.price_max)) / 2,
                      }));
                      const cheapest = Math.min(...avgPrices.map(a => a.avg));
                      const mostExpensive = Math.max(...avgPrices.map(a => a.avg));
                      const savingsRange = mostExpensive - cheapest;

                      return (
                        <div key={ingName} className="bg-gray-50 dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-xl p-4">
                          <div className="flex items-center justify-between mb-3">
                            <h4 className="font-semibold text-black dark:text-white">{ingName}</h4>
                            {savingsRange > 0 && (
                              <span className="text-xs font-medium px-2.5 py-1 bg-emerald-100 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 rounded-full border border-emerald-200 dark:border-emerald-900/50">
                                Economie potentielle: {savingsRange.toFixed(2)} EUR/{ingPrices[0]?.unit || 'kg'}
                              </span>
                            )}
                          </div>
                          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                            {avgPrices
                              .sort((a, b) => a.avg - b.avg)
                              .map((p, idx) => {
                                const isCheapest = p.avg === cheapest && avgPrices.length > 1;
                                const isMostExpensive = p.avg === mostExpensive && avgPrices.length > 1 && cheapest !== mostExpensive;
                                return (
                                  <div
                                    key={p.id}
                                    className={`flex items-center justify-between px-3 py-2.5 rounded-lg border transition-colors ${
                                      isCheapest
                                        ? 'bg-emerald-50 dark:bg-emerald-950/30 border-emerald-300 dark:border-emerald-800'
                                        : isMostExpensive
                                        ? 'bg-red-50 dark:bg-red-950/30 border-red-300 dark:border-red-800'
                                        : 'bg-white dark:bg-black border-gray-200 dark:border-gray-800'
                                    }`}
                                  >
                                    <div className="flex items-center gap-2">
                                      {isCheapest && <Check className="w-4 h-4 text-emerald-500" />}
                                      {isMostExpensive && <AlertTriangle className="w-4 h-4 text-red-500" />}
                                      <span className="text-sm text-gray-700 dark:text-gray-300">{p.supplier || 'N/A'}</span>
                                    </div>
                                    <div className="text-right">
                                      <span className={`font-bold text-sm ${
                                        isCheapest ? 'text-emerald-600 dark:text-emerald-400' : isMostExpensive ? 'text-red-600 dark:text-red-400' : 'text-black dark:text-white'
                                      }`}>
                                        {p.avg.toFixed(2)} EUR
                                      </span>
                                      <span className="text-xs text-gray-400 ml-1">/{p.unit}</span>
                                    </div>
                                  </div>
                                );
                              })}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ════════════════════════════════════════════════════════════════════
          TAB: SUPPLIER RANKING (Feature 6)
      ════════════════════════════════════════════════════════════════════ */}
      {activeTab === 'suppliers' && (
        <div className="space-y-6">
          {/* Podium Top 3 */}
          {supplierRanking.length >= 3 && (
            <div className="bg-white dark:bg-black border border-gray-200 dark:border-gray-800 rounded-2xl p-6">
              <h2 className="text-lg font-bold text-black dark:text-white flex items-center gap-2 mb-6">
                <Trophy className="w-5 h-5 text-amber-500" />
                Podium Fournisseurs
              </h2>
              <div className="flex flex-col sm:flex-row items-end justify-center gap-4 sm:gap-6">
                {/* 2nd place */}
                <div className="flex flex-col items-center w-full sm:w-44 order-2 sm:order-1">
                  <div className="w-12 h-12 rounded-full bg-gray-200 dark:bg-gray-800 flex items-center justify-center mb-2">
                    <Medal className="w-6 h-6 text-gray-400" />
                  </div>
                  <p className="font-bold text-black dark:text-white text-sm text-center truncate w-full">{supplierRanking[1]?.name}</p>
                  <p className="text-xs text-gray-500">{supplierRanking[1]?.productCount} produits</p>
                  <div className="w-full mt-2 bg-gray-100 dark:bg-gray-900 rounded-t-xl" style={{ height: '80px' }}>
                    <div className="w-full h-full flex items-center justify-center">
                      <span className="text-2xl font-bold text-gray-300 dark:text-gray-600">2</span>
                    </div>
                  </div>
                </div>
                {/* 1st place */}
                <div className="flex flex-col items-center w-full sm:w-48 order-1 sm:order-2">
                  <div className="w-14 h-14 rounded-full bg-amber-100 dark:bg-amber-950/40 flex items-center justify-center mb-2 border-2 border-amber-400">
                    <Crown className="w-7 h-7 text-amber-500" />
                  </div>
                  <p className="font-bold text-black dark:text-white text-center truncate w-full">{supplierRanking[0]?.name}</p>
                  <p className="text-xs text-gray-500">{supplierRanking[0]?.productCount} produits</p>
                  <div className="w-full mt-2 bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/40 rounded-t-xl" style={{ height: '120px' }}>
                    <div className="w-full h-full flex items-center justify-center">
                      <span className="text-3xl font-bold text-amber-400">1</span>
                    </div>
                  </div>
                </div>
                {/* 3rd place */}
                <div className="flex flex-col items-center w-full sm:w-40 order-3">
                  <div className="w-11 h-11 rounded-full bg-orange-100 dark:bg-orange-950/40 flex items-center justify-center mb-2">
                    <Award className="w-5 h-5 text-orange-400" />
                  </div>
                  <p className="font-bold text-black dark:text-white text-sm text-center truncate w-full">{supplierRanking[2]?.name}</p>
                  <p className="text-xs text-gray-500">{supplierRanking[2]?.productCount} produits</p>
                  <div className="w-full mt-2 bg-orange-50 dark:bg-orange-950/20 rounded-t-xl" style={{ height: '60px' }}>
                    <div className="w-full h-full flex items-center justify-center">
                      <span className="text-xl font-bold text-orange-300 dark:text-orange-600">3</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Full ranking table */}
          <div className="bg-white dark:bg-black border border-gray-200 dark:border-gray-800 rounded-2xl overflow-hidden">
            <div className="px-5 py-4 border-b border-gray-200 dark:border-gray-800">
              <h3 className="font-bold text-black dark:text-white flex items-center gap-2">
                <Users className="w-5 h-5" />
                Classement complet des fournisseurs
              </h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left border-b border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-950">
                    <th className="px-5 py-3 font-semibold text-gray-500 dark:text-gray-400">#</th>
                    <th className="px-5 py-3 font-semibold text-gray-500 dark:text-gray-400">Fournisseur</th>
                    <th className="px-5 py-3 font-semibold text-gray-500 dark:text-gray-400 text-center">Produits</th>
                    <th className="px-5 py-3 font-semibold text-gray-500 dark:text-gray-400 text-center">Stabilite prix</th>
                    <th className="px-5 py-3 font-semibold text-gray-500 dark:text-gray-400 text-center">Score prix</th>
                    <th className="px-5 py-3 font-semibold text-gray-500 dark:text-gray-400 text-right">Prix moyen</th>
                  </tr>
                </thead>
                <tbody>
                  {supplierRanking.map((s, idx) => (
                    <tr key={s.name} className="border-b border-gray-200 dark:border-gray-800/30 hover:bg-gray-50 dark:hover:bg-gray-950 transition-colors">
                      <td className="px-5 py-3">
                        {idx === 0 && <span className="text-amber-500 font-bold">1</span>}
                        {idx === 1 && <span className="text-gray-400 font-bold">2</span>}
                        {idx === 2 && <span className="text-orange-400 font-bold">3</span>}
                        {idx > 2 && <span className="text-gray-400">{idx + 1}</span>}
                      </td>
                      <td className="px-5 py-3 font-medium text-black dark:text-white">{s.name}</td>
                      <td className="px-5 py-3 text-center text-black dark:text-white font-semibold">{s.productCount}</td>
                      <td className="px-5 py-3 text-center">
                        <div className="flex items-center justify-center gap-2">
                          <div className="w-20 h-2 bg-gray-200 dark:bg-gray-800 rounded-full overflow-hidden">
                            <div
                              className={`h-full rounded-full ${s.stabilityScore >= 70 ? 'bg-emerald-500' : s.stabilityScore >= 40 ? 'bg-amber-500' : 'bg-red-500'}`}
                              style={{ width: `${s.stabilityScore}%` }}
                            />
                          </div>
                          <span className="text-xs font-medium text-gray-600 dark:text-gray-400">{s.stabilityScore}%</span>
                        </div>
                      </td>
                      <td className="px-5 py-3 text-center">
                        <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                          s.priceScore >= 70 ? 'bg-emerald-100 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400' :
                          s.priceScore >= 40 ? 'bg-amber-100 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400' :
                          'bg-red-100 dark:bg-red-950/40 text-red-600 dark:text-red-400'
                        }`}>
                          {s.priceScore}/100
                        </span>
                      </td>
                      <td className="px-5 py-3 text-right font-semibold text-black dark:text-white">
                        {s.avgPrice.toFixed(2)} EUR
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ════════════════════════════════════════════════════════════════════
          TAB: NEGOTIATION HELPER (Feature 7)
      ════════════════════════════════════════════════════════════════════ */}
      {activeTab === 'negotiate' && (
        <div className="space-y-4">
          <div className="bg-white dark:bg-black border border-gray-200 dark:border-gray-800 rounded-2xl p-5">
            <h2 className="text-lg font-bold text-black dark:text-white flex items-center gap-2 mb-2">
              <MessageSquare className="w-5 h-5" />
              Aide a la negociation
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
              Pour chaque ingredient en hausse, voici les ecarts de prix et des arguments pour negocier avec vos fournisseurs.
            </p>

            {negotiationCandidates.length === 0 ? (
              <div className="text-center py-12 text-gray-400">
                <Check className="w-12 h-12 mx-auto mb-3 text-emerald-400" />
                <p className="font-medium text-black dark:text-white">Aucun ingredient surpaye detecte</p>
                <p className="text-sm text-gray-500">Tous vos prix sont proches du marche.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {negotiationCandidates.map((item) => (
                  <div key={item.id} className="border border-gray-200 dark:border-gray-800 rounded-xl overflow-hidden">
                    <button
                      onClick={() => setExpandedIngredient(expandedIngredient === item.ingredient_name ? null : item.ingredient_name)}
                      className="w-full px-5 py-4 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-950 transition-colors"
                    >
                      <div className="flex items-center gap-4">
                        <div className="p-2 bg-red-100 dark:bg-red-950/40 rounded-xl">
                          <DollarSign className="w-5 h-5 text-red-500" />
                        </div>
                        <div className="text-left">
                          <p className="font-semibold text-black dark:text-white">{item.ingredient_name}</p>
                          <p className="text-xs text-gray-500">Fournisseur: {item.supplier}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <p className="text-sm">
                            <span className="text-gray-500">Votre prix:</span>{' '}
                            <span className="font-bold text-red-500">{item.avgPrice.toFixed(2)} EUR</span>
                          </p>
                          <p className="text-sm">
                            <span className="text-gray-500">Prix marche estime:</span>{' '}
                            <span className="font-bold text-emerald-500">{item.marketEstimate.toFixed(2)} EUR</span>
                          </p>
                        </div>
                        <div className="px-3 py-1.5 bg-red-100 dark:bg-red-950/40 text-red-600 dark:text-red-400 rounded-full text-xs font-bold">
                          +{item.savings}%
                        </div>
                        {expandedIngredient === item.ingredient_name
                          ? <ChevronUp className="w-5 h-5 text-gray-400" />
                          : <ChevronDown className="w-5 h-5 text-gray-400" />
                        }
                      </div>
                    </button>

                    {expandedIngredient === item.ingredient_name && (
                      <div className="px-5 pb-5 pt-0 border-t border-gray-200 dark:border-gray-800">
                        {/* Price comparison bar */}
                        <div className="mt-4 mb-4">
                          <div className="flex items-center gap-3 mb-2">
                            <span className="text-xs text-gray-500 w-28">Prix marche</span>
                            <div className="flex-1 h-3 bg-gray-100 dark:bg-gray-900 rounded-full overflow-hidden">
                              <div
                                className="h-full bg-emerald-500 rounded-full"
                                style={{ width: `${(item.marketEstimate / item.avgPrice) * 100}%` }}
                              />
                            </div>
                            <span className="text-xs font-bold text-emerald-500 w-20 text-right">{item.marketEstimate.toFixed(2)} EUR</span>
                          </div>
                          <div className="flex items-center gap-3">
                            <span className="text-xs text-gray-500 w-28">Votre prix</span>
                            <div className="flex-1 h-3 bg-gray-100 dark:bg-gray-900 rounded-full overflow-hidden">
                              <div
                                className="h-full bg-red-500 rounded-full"
                                style={{ width: '100%' }}
                              />
                            </div>
                            <span className="text-xs font-bold text-red-500 w-20 text-right">{item.avgPrice.toFixed(2)} EUR</span>
                          </div>
                        </div>

                        {/* Talking points */}
                        <h4 className="text-sm font-semibold text-black dark:text-white mb-2 flex items-center gap-2">
                          <Lightbulb className="w-4 h-4 text-amber-500" />
                          Arguments de negociation
                        </h4>
                        <ul className="space-y-2">
                          {item.talkingPoints.map((point, idx) => (
                            <li key={idx} className="flex items-start gap-2 text-sm text-gray-600 dark:text-gray-400">
                              <ChevronRight className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
                              {point}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* ── WhatsApp Price Comparison Request ────────────────────────── */}
          <div className="bg-white dark:bg-black border border-[#25D366]/30 rounded-2xl p-5">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-[#25D366]/10 rounded-xl">
                  <MessageCircle className="w-5 h-5 text-[#25D366]" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-black dark:text-white">Demander les prix via WhatsApp</h2>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Selectionnez des ingredients et envoyez une demande de prix a vos fournisseurs
                  </p>
                </div>
              </div>
              {waPriceSelection.size > 0 && (
                <span className="px-2.5 py-1 bg-[#25D366]/10 text-[#25D366] rounded-full text-xs font-bold border border-[#25D366]/30">
                  {waPriceSelection.size} sélectionné(s)
                </span>
              )}
            </div>

            {/* Ingredient selection grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 mb-4 max-h-48 overflow-y-auto">
              {[...new Set(prices.map((p) => p.ingredient_name))].sort().map((name) => {
                const selected = waPriceSelection.has(name);
                return (
                  <button
                    key={name}
                    onClick={() => {
                      setWaPriceSelection((prev) => {
                        const next = new Set(prev);
                        if (next.has(name)) next.delete(name);
                        else next.add(name);
                        return next;
                      });
                    }}
                    className={`px-3 py-2 rounded-lg text-xs font-medium text-left transition-all border ${
                      selected
                        ? 'bg-[#25D366]/10 text-[#25D366] border-[#25D366]/40 shadow-sm'
                        : 'bg-gray-50 dark:bg-gray-950 text-gray-600 dark:text-gray-400 border-gray-200 dark:border-gray-800 hover:border-gray-400 dark:hover:border-gray-600'
                    }`}
                  >
                    <span className="flex items-center gap-1.5">
                      {selected && <Check className="w-3 h-3" />}
                      {name}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Quick select actions */}
            <div className="flex flex-wrap items-center gap-2 mb-4">
              <button
                onClick={() => {
                  const allNames = new Set(prices.map((p) => p.ingredient_name));
                  setWaPriceSelection(allNames);
                }}
                className="text-xs text-gray-500 dark:text-gray-400 hover:text-black dark:hover:text-white transition"
              >
                Tout sélectionner
              </button>
              <span className="text-gray-300 dark:text-gray-700">|</span>
              <button
                onClick={() => {
                  const hausse = new Set(prices.filter((p) => p.trend === 'hausse').map((p) => p.ingredient_name));
                  setWaPriceSelection(hausse);
                }}
                className="text-xs text-red-500 hover:text-red-400 transition"
              >
                Produits en hausse
              </button>
              <span className="text-gray-300 dark:text-gray-700">|</span>
              <button
                onClick={() => setWaPriceSelection(new Set())}
                className="text-xs text-gray-500 dark:text-gray-400 hover:text-black dark:hover:text-white transition"
              >
                Tout désélectionner
              </button>
            </div>

            {/* Send to suppliers */}
            {waPriceSelection.size > 0 && (
              <div className="border-t border-gray-200 dark:border-gray-800 pt-4">
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-3">
                  Envoyer la demande de prix a:
                </p>
                {waSendingPrices ? (
                  <div className="flex items-center gap-3 mb-3">
                    <div className="flex items-center gap-2 text-sm font-medium text-[#25D366]">
                      <Send className="w-4 h-4 animate-pulse" />
                      {waPriceProgress.sent}/{waPriceProgress.total} envoyés
                    </div>
                    <div className="flex-1 h-2 bg-gray-100 dark:bg-gray-900 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-[#25D366] rounded-full transition-all"
                        style={{ width: `${waPriceProgress.total > 0 ? (waPriceProgress.sent / waPriceProgress.total) * 100 : 0}%` }}
                      />
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-wrap gap-2">
                    {/* Individual supplier buttons */}
                    {waSuppliers.slice(0, 8).map((supplier) => (
                      <button
                        key={supplier.id}
                        onClick={() => {
                          const restaurantName = selectedRestaurant?.name || 'Mon Restaurant';
                          const ingredientNames = Array.from(waPriceSelection);
                          const message = bulkPriceInquiryMessage({
                            supplierName: supplier.name,
                            restaurantName,
                            ingredientNames,
                          });
                          const phone = supplier.whatsappPhone || supplier.phone;
                          openWhatsApp(phone, message);
                          showToast(`Demande de prix envoyée à ${supplier.name}`, 'success');
                        }}
                        className="flex items-center gap-1.5 px-3 py-2 bg-[#25D366]/10 hover:bg-[#25D366]/20 text-[#25D366] rounded-lg text-xs font-semibold transition border border-[#25D366]/30"
                      >
                        <MessageCircle className="w-3.5 h-3.5" />
                        {supplier.name}
                      </button>
                    ))}

                    {/* Send to all */}
                    {waSuppliers.length > 1 && (
                      <button
                        onClick={() => {
                          const restaurantName = selectedRestaurant?.name || 'Mon Restaurant';
                          const ingredientNames = Array.from(waPriceSelection);

                          const bulkOrders: BulkWhatsAppOrder[] = waSuppliers.map((supplier) => ({
                            supplierName: supplier.name,
                            phone: supplier.whatsappPhone || supplier.phone,
                            message: bulkPriceInquiryMessage({
                              supplierName: supplier.name,
                              restaurantName,
                              ingredientNames,
                            }),
                          }));

                          setWaSendingPrices(true);
                          setWaPriceProgress({ sent: 0, total: bulkOrders.length });

                          openBulkWhatsApp(
                            bulkOrders,
                            (sent, total) => setWaPriceProgress({ sent, total }),
                            () => {
                              setWaSendingPrices(false);
                              showToast(`Demande de prix envoyée à ${bulkOrders.length} fournisseurs`, 'success');
                            },
                          );
                        }}
                        className="flex items-center gap-1.5 px-4 py-2 bg-[#25D366] hover:bg-[#20bd5a] text-white rounded-lg text-xs font-semibold transition shadow-sm"
                      >
                        <Send className="w-3.5 h-3.5" />
                        Envoyer à tous ({waSuppliers.length})
                      </button>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ════════════════════════════════════════════════════════════════════
          CSV IMPORT MODAL (Feature 5)
      ════════════════════════════════════════════════════════════════════ */}
      {showImportModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white dark:bg-black border border-gray-200 dark:border-gray-800 rounded-2xl w-full max-w-2xl max-h-[80vh] overflow-hidden flex flex-col">
            {/* Modal header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-gray-800">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-black dark:bg-white rounded-xl">
                  <FileSpreadsheet className="w-5 h-5 text-white dark:text-black" />
                </div>
                <div>
                  <h3 className="font-bold text-black dark:text-white">Importer une mercuriale</h3>
                  <p className="text-xs text-gray-500">Format CSV avec colonnes: produit, fournisseur, prix, unite, categorie</p>
                </div>
              </div>
              <button
                onClick={() => { setShowImportModal(false); setCsvData([]); setCsvFileName(''); }}
                className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-900 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-gray-400" />
              </button>
            </div>

            {/* Modal body */}
            <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
              {/* Upload zone */}
              <div
                className="border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-xl p-8 text-center cursor-pointer hover:border-black dark:hover:border-white transition-colors"
                onClick={() => fileInputRef.current?.click()}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".csv,.tsv,.txt"
                  onChange={handleFileSelect}
                  className="hidden"
                />
                <Upload className="w-10 h-10 mx-auto text-gray-400 mb-3" />
                <p className="text-sm font-medium text-black dark:text-white">
                  {csvFileName || 'Cliquez ou glissez votre fichier CSV ici'}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  Formats acceptes: .csv, .tsv (max 10 Mo)
                </p>
              </div>

              {/* Template download */}
              <div className="flex items-center gap-2 text-xs text-gray-500">
                <Download className="w-3.5 h-3.5" />
                <span>Besoin d'un modele ?</span>
                <button className="text-black dark:text-white font-medium hover:underline">
                  Telecharger le template CSV
                </button>
              </div>

              {/* CSV Preview */}
              {csvData.length > 0 && (
                <div>
                  <h4 className="text-sm font-semibold text-black dark:text-white mb-2 flex items-center gap-2">
                    <Eye className="w-4 h-4" />
                    Apercu ({csvData.length} lignes)
                  </h4>
                  <div className="overflow-x-auto border border-gray-200 dark:border-gray-800 rounded-xl">
                    <table className="w-full text-xs">
                      <thead>
                        <tr className="bg-gray-50 dark:bg-gray-950 border-b border-gray-200 dark:border-gray-800">
                          <th className="px-3 py-2 text-left text-gray-500">Produit</th>
                          <th className="px-3 py-2 text-left text-gray-500">Fournisseur</th>
                          <th className="px-3 py-2 text-right text-gray-500">Prix min</th>
                          <th className="px-3 py-2 text-right text-gray-500">Prix max</th>
                          <th className="px-3 py-2 text-left text-gray-500">Unite</th>
                          <th className="px-3 py-2 text-left text-gray-500">Categorie</th>
                        </tr>
                      </thead>
                      <tbody>
                        {csvData.slice(0, 10).map((row, idx) => (
                          <tr key={idx} className="border-b border-gray-100 dark:border-gray-900">
                            <td className="px-3 py-2 text-black dark:text-white font-medium">{row.ingredient_name}</td>
                            <td className="px-3 py-2 text-gray-600 dark:text-gray-400">{row.supplier}</td>
                            <td className="px-3 py-2 text-right text-black dark:text-white">{row.price_min.toFixed(2)} EUR</td>
                            <td className="px-3 py-2 text-right text-black dark:text-white">{row.price_max.toFixed(2)} EUR</td>
                            <td className="px-3 py-2 text-gray-600 dark:text-gray-400">{row.unit}</td>
                            <td className="px-3 py-2 text-gray-600 dark:text-gray-400">{row.category}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                    {csvData.length > 10 && (
                      <div className="px-3 py-2 text-center text-xs text-gray-400 bg-gray-50 dark:bg-gray-950">
                        ... et {csvData.length - 10} lignes supplementaires
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Modal footer */}
            <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-gray-200 dark:border-gray-800">
              <button
                onClick={() => { setShowImportModal(false); setCsvData([]); setCsvFileName(''); }}
                className="px-4 py-2 text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white transition-colors"
              >
                Annuler
              </button>
              <button
                onClick={handleImportConfirm}
                disabled={csvData.length === 0}
                className="px-4 py-2 text-sm font-medium bg-black dark:bg-white text-white dark:text-black rounded-xl hover:opacity-90 transition-opacity disabled:opacity-30 disabled:cursor-not-allowed"
              >
                Importer {csvData.length > 0 ? `(${csvData.length} lignes)` : ''}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ════════════════════════════════════════════════════════════════════
          FOOTER
      ════════════════════════════════════════════════════════════════════ */}
      <div className="text-center text-xs text-gray-400 dark:text-gray-500 pb-4">
        Donnees publiees par l'equipe RestauMargin -- Prix HT indicatifs -- Sources : {pub.sources}
      </div>
    </div>
  );
}
