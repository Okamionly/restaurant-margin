import { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import {
  Star, TrendingUp, Target, Zap, AlertCircle, BarChart3, Plus,
  Calendar, Award, ArrowUpDown, ArrowUp, ArrowDown, Printer, Upload, X,
  Loader2, ShoppingBag, DollarSign, Percent, ChefHat, Eye,
  Filter, RefreshCw,
} from 'lucide-react';
import { useToast } from '../hooks/useToast';
import Modal from '../components/Modal';

const API = '';

function authHeaders(): Record<string, string> {
  const token = localStorage.getItem('token');
  const rid = localStorage.getItem('activeRestaurantId');
  const headers: Record<string, string> = { 'Content-Type': 'application/json' };
  if (token) headers['Authorization'] = `Bearer ${token}`;
  if (rid) headers['X-Restaurant-Id'] = rid;
  return headers;
}

// ── Types ────────────────────────────────────────────────────────────────────
interface EngineeringItem {
  id: number;
  name: string;
  category: string;
  sellingPrice: number;
  costPerPortion: number;
  margin: number;
  marginPercent: number;
  salesQty: number;
  salesRevenue: number;
  popularity: number;
  quadrant: 'star' | 'puzzle' | 'plow' | 'dog';
}

interface EngineeringData {
  engineering: EngineeringItem[];
  totalSales: number;
  avgMargin: number;
  days: number;
}

interface RecipeIngredient {
  id: number;
  quantity: number;
  wastePercent: number;
  ingredient: {
    id: number;
    name: string;
    pricePerUnit: number;
  };
}

interface Recipe {
  id: number;
  name: string;
  category: string;
  sellingPrice: number;
  nbPortions: number;
  ingredients: RecipeIngredient[];
  margin?: {
    costPerPortion: number;
    marginAmount: number;
    marginPercent: number;
  };
}

interface MenuSale {
  id: number;
  recipeId: number;
  quantity: number;
  revenue: number;
  date: string;
}

// ── Quadrant config ──────────────────────────────────────────────────────────
const QUADRANT_CONFIG = {
  star: {
    label: 'Vedettes',
    emoji: '⭐',
    color: 'emerald',
    bg: 'bg-emerald-50 dark:bg-emerald-950/30',
    border: 'border-emerald-200 dark:border-emerald-800',
    text: 'text-emerald-700 dark:text-emerald-300',
    badge: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/50 dark:text-emerald-300',
    dot: '#10b981',
    action: 'METTRE EN AVANT',
    desc: 'Haute marge + populaire',
    recommendation: 'Mettre en avant sur le menu, maintenir la qualité',
  },
  puzzle: {
    label: 'Énigmes',
    emoji: '🧩',
    color: 'blue',
    bg: 'bg-blue-50 dark:bg-blue-950/30',
    border: 'border-blue-200 dark:border-blue-800',
    text: 'text-blue-700 dark:text-blue-300',
    badge: 'bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300',
    dot: '#3b82f6',
    action: 'DÉVELOPPER',
    desc: 'Haute marge + peu populaire',
    recommendation: 'Améliorer la visibilité, repositionner sur le menu',
  },
  plow: {
    label: 'Valeurs sûres',
    emoji: '🐮',
    color: 'amber',
    bg: 'bg-amber-50 dark:bg-amber-950/30',
    border: 'border-amber-200 dark:border-amber-800',
    text: 'text-amber-700 dark:text-amber-300',
    badge: 'bg-amber-100 text-amber-800 dark:bg-amber-900/50 dark:text-amber-300',
    dot: '#f59e0b',
    action: 'REFORMULER',
    desc: 'Basse marge + populaire',
    recommendation: 'Augmenter le prix ou réduire le coût des ingrédients',
  },
  dog: {
    label: 'Poids morts',
    emoji: '🐕',
    color: 'red',
    bg: 'bg-red-50 dark:bg-red-950/30',
    border: 'border-red-200 dark:border-red-800',
    text: 'text-red-700 dark:text-red-300',
    badge: 'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300',
    dot: '#ef4444',
    action: 'REMPLACER',
    desc: 'Basse marge + peu populaire',
    recommendation: 'Envisager de retirer du menu ou reformuler',
  },
} as const;

type Quadrant = keyof typeof QUADRANT_CONFIG;
type SortField = 'name' | 'category' | 'sellingPrice' | 'costPerPortion' | 'margin' | 'marginPercent' | 'salesQty' | 'salesRevenue' | 'quadrant';
type SortDir = 'asc' | 'desc';
type Period = '7' | '30' | '90' | 'custom';

// ── Helpers ──────────────────────────────────────────────────────────────────
function fmt(n: number, decimals = 2) {
  return n.toLocaleString('fr-FR', { minimumFractionDigits: decimals, maximumFractionDigits: decimals });
}

function fmtEur(n: number) {
  return `${fmt(n, 2)} €`;
}

// ── BCG Matrix Component ─────────────────────────────────────────────────────
function BCGMatrix({ items }: { items: EngineeringItem[] }) {
  const [hovered, setHovered] = useState<EngineeringItem | null>(null);
  const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 });
  const svgRef = useRef<SVGSVGElement>(null);

  const padding = { top: 40, right: 40, bottom: 50, left: 60 };
  const width = 700;
  const height = 500;
  const plotW = width - padding.left - padding.right;
  const plotH = height - padding.top - padding.bottom;

  const { maxPop, maxMargin, avgPop, avgMargin } = useMemo(() => {
    if (items.length === 0) return { maxPop: 100, maxMargin: 100, avgPop: 50, avgMargin: 50 };
    const pops = items.map(i => i.popularity);
    const margins = items.map(i => i.marginPercent);
    return {
      maxPop: Math.max(...pops) * 1.15,
      maxMargin: Math.max(...margins) * 1.15,
      avgPop: pops.reduce((a, b) => a + b, 0) / pops.length,
      avgMargin: margins.reduce((a, b) => a + b, 0) / margins.length,
    };
  }, [items]);

  const scaleX = (pop: number) => padding.left + (pop / maxPop) * plotW;
  const scaleY = (margin: number) => padding.top + plotH - (margin / maxMargin) * plotH;

  const handleMouseMove = useCallback((e: React.MouseEvent<SVGSVGElement>) => {
    if (!svgRef.current) return;
    const rect = svgRef.current.getBoundingClientRect();
    setTooltipPos({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  }, []);

  const avgPopX = scaleX(avgPop);
  const avgMarginY = scaleY(avgMargin);

  return (
    <div className="relative">
      <svg
        ref={svgRef}
        viewBox={`0 0 ${width} ${height}`}
        className="w-full max-w-3xl mx-auto"
        onMouseMove={handleMouseMove}
        onTouchStart={(e) => {
          if (!svgRef.current) return;
          const touch = e.touches[0];
          const rect = svgRef.current.getBoundingClientRect();
          setTooltipPos({ x: touch.clientX - rect.left, y: touch.clientY - rect.top });
        }}
        onClick={(e) => {
          // Dismiss tooltip when tapping SVG background (not a data point)
          if ((e.target as SVGElement).tagName === 'svg' || (e.target as SVGElement).tagName === 'rect') {
            setHovered(null);
          }
        }}
      >
        {/* Background quadrants */}
        <rect x={padding.left} y={padding.top} width={avgPopX - padding.left} height={avgMarginY - padding.top}
          fill="rgba(59,130,246,0.06)" />
        <rect x={avgPopX} y={padding.top} width={padding.left + plotW - avgPopX} height={avgMarginY - padding.top}
          fill="rgba(16,185,129,0.06)" />
        <rect x={padding.left} y={avgMarginY} width={avgPopX - padding.left} height={padding.top + plotH - avgMarginY}
          fill="rgba(239,68,68,0.06)" />
        <rect x={avgPopX} y={avgMarginY} width={padding.left + plotW - avgPopX} height={padding.top + plotH - avgMarginY}
          fill="rgba(245,158,11,0.06)" />

        {/* Grid lines */}
        {[0.25, 0.5, 0.75, 1].map(t => (
          <g key={`grid-${t}`}>
            <line x1={padding.left} y1={padding.top + plotH * (1 - t)} x2={padding.left + plotW} y2={padding.top + plotH * (1 - t)}
              stroke="currentColor" className="text-slate-200 dark:text-slate-700" strokeWidth={0.5} strokeDasharray="4,4" />
            <line x1={padding.left + plotW * t} y1={padding.top} x2={padding.left + plotW * t} y2={padding.top + plotH}
              stroke="currentColor" className="text-slate-200 dark:text-slate-700" strokeWidth={0.5} strokeDasharray="4,4" />
          </g>
        ))}

        {/* Average lines */}
        <line x1={avgPopX} y1={padding.top} x2={avgPopX} y2={padding.top + plotH}
          stroke="currentColor" className="text-slate-400 dark:text-slate-500" strokeWidth={1.5} strokeDasharray="6,4" />
        <line x1={padding.left} y1={avgMarginY} x2={padding.left + plotW} y2={avgMarginY}
          stroke="currentColor" className="text-slate-400 dark:text-slate-500" strokeWidth={1.5} strokeDasharray="6,4" />

        {/* Quadrant labels */}
        <text x={padding.left + 8} y={padding.top + 18} className="fill-blue-400 dark:fill-blue-500" fontSize={11} fontWeight={600}>
          {QUADRANT_CONFIG.puzzle.emoji} {QUADRANT_CONFIG.puzzle.label}
        </text>
        <text x={padding.left + plotW - 8} y={padding.top + 18} className="fill-emerald-500 dark:fill-emerald-400" fontSize={11} fontWeight={600} textAnchor="end">
          {QUADRANT_CONFIG.star.emoji} {QUADRANT_CONFIG.star.label}
        </text>
        <text x={padding.left + 8} y={padding.top + plotH - 8} className="fill-red-400 dark:fill-red-500" fontSize={11} fontWeight={600}>
          {QUADRANT_CONFIG.dog.emoji} {QUADRANT_CONFIG.dog.label}
        </text>
        <text x={padding.left + plotW - 8} y={padding.top + plotH - 8} className="fill-amber-500 dark:fill-amber-400" fontSize={11} fontWeight={600} textAnchor="end">
          {QUADRANT_CONFIG.plow.emoji} {QUADRANT_CONFIG.plow.label}
        </text>

        {/* Axes */}
        <line x1={padding.left} y1={padding.top + plotH} x2={padding.left + plotW} y2={padding.top + plotH}
          stroke="currentColor" className="text-slate-300 dark:text-slate-600" strokeWidth={1} />
        <line x1={padding.left} y1={padding.top} x2={padding.left} y2={padding.top + plotH}
          stroke="currentColor" className="text-slate-300 dark:text-slate-600" strokeWidth={1} />

        {/* Axis labels */}
        <text x={padding.left + plotW / 2} y={height - 8} className="fill-slate-500 dark:fill-slate-400" fontSize={12} textAnchor="middle" fontWeight={500}>
          Popularité (ventes)
        </text>
        <text x={14} y={padding.top + plotH / 2} className="fill-slate-500 dark:fill-slate-400" fontSize={12}
          textAnchor="middle" fontWeight={500} transform={`rotate(-90, 14, ${padding.top + plotH / 2})`}>
          Marge (%)
        </text>

        {/* Y-axis ticks */}
        {[0, 0.25, 0.5, 0.75, 1].map(t => (
          <text key={`y-${t}`} x={padding.left - 8} y={padding.top + plotH * (1 - t) + 4}
            className="fill-slate-400 dark:fill-slate-500" fontSize={10} textAnchor="end">
            {fmt(maxMargin * t, 0)}%
          </text>
        ))}

        {/* X-axis ticks */}
        {[0, 0.25, 0.5, 0.75, 1].map(t => (
          <text key={`x-${t}`} x={padding.left + plotW * t} y={padding.top + plotH + 18}
            className="fill-slate-400 dark:fill-slate-500" fontSize={10} textAnchor="middle">
            {fmt(maxPop * t, 0)}
          </text>
        ))}

        {/* Data points */}
        {items.map(item => {
          const cx = scaleX(item.popularity);
          const cy = scaleY(item.marginPercent);
          const r = Math.max(8, Math.min(22, Math.sqrt(item.salesRevenue) / 7));
          const cfg = QUADRANT_CONFIG[item.quadrant];
          const isHovered = hovered?.id === item.id;
          return (
            <g key={item.id}
              onMouseEnter={() => setHovered(item)}
              onMouseLeave={() => setHovered(null)}
              onClick={() => setHovered(prev => prev?.id === item.id ? null : item)}
              className="cursor-pointer"
            >
              <circle cx={cx} cy={cy} r={isHovered ? r + 3 : r}
                fill={cfg.dot} fillOpacity={isHovered ? 0.9 : 0.7}
                stroke={isHovered ? '#fff' : cfg.dot} strokeWidth={isHovered ? 2.5 : 1}
                className="transition-all duration-150" />
              {isHovered && (
                <text x={cx} y={cy - r - 6} textAnchor="middle"
                  className="fill-slate-800 dark:fill-slate-100" fontSize={11} fontWeight={600}>
                  {item.name}
                </text>
              )}
            </g>
          );
        })}

        {/* Border */}
        <rect x={padding.left} y={padding.top} width={plotW} height={plotH}
          fill="none" stroke="currentColor" className="text-slate-200 dark:text-slate-700" strokeWidth={1} />
      </svg>

      {/* Floating tooltip */}
      {hovered && (
        <div
          className="absolute z-50 pointer-events-none bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-xl px-4 py-3 text-sm max-w-xs"
          style={{
            left: Math.min(tooltipPos.x + 16, 500),
            top: tooltipPos.y - 10,
          }}
        >
          <div className="font-bold text-slate-900 dark:text-white mb-1">{hovered.name}</div>
          <div className="text-slate-500 dark:text-slate-400 text-xs mb-2">{hovered.category}</div>
          <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-xs">
            <span className="text-slate-500 dark:text-slate-400">Prix vente:</span>
            <span className="font-medium text-slate-700 dark:text-slate-200">{fmtEur(hovered.sellingPrice)}</span>
            <span className="text-slate-500 dark:text-slate-400">Coût:</span>
            <span className="font-medium text-slate-700 dark:text-slate-200">{fmtEur(hovered.costPerPortion)}</span>
            <span className="text-slate-500 dark:text-slate-400">Marge:</span>
            <span className="font-medium text-slate-700 dark:text-slate-200">{fmt(hovered.marginPercent, 1)}%</span>
            <span className="text-slate-500 dark:text-slate-400">Ventes:</span>
            <span className="font-medium text-slate-700 dark:text-slate-200">{hovered.salesQty}</span>
            <span className="text-slate-500 dark:text-slate-400">CA:</span>
            <span className="font-medium text-slate-700 dark:text-slate-200">{fmtEur(hovered.salesRevenue)}</span>
          </div>
          <div className="mt-2 pt-2 border-t border-slate-100 dark:border-slate-700">
            <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold ${QUADRANT_CONFIG[hovered.quadrant].badge}`}>
              {QUADRANT_CONFIG[hovered.quadrant].emoji} {QUADRANT_CONFIG[hovered.quadrant].action}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}

// ── Main Page Component ──────────────────────────────────────────────────────
export default function MenuEngineering() {
  const { showToast } = useToast();

  // Data
  const [data, setData] = useState<EngineeringData | null>(null);
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);

  // Period
  const [period, setPeriod] = useState<Period>('30');
  const [customFrom, setCustomFrom] = useState('');
  const [customTo, setCustomTo] = useState('');

  // Table sorting
  const [sortField, setSortField] = useState<SortField>('salesRevenue');
  const [sortDir, setSortDir] = useState<SortDir>('desc');
  const [filterQuadrant, setFilterQuadrant] = useState<Quadrant | 'all'>('all');

  // Sales modal
  const [showSalesModal, setShowSalesModal] = useState(false);
  const [saleRecipeId, setSaleRecipeId] = useState<number | ''>('');
  const [saleQty, setSaleQty] = useState('');
  const [saleDate, setSaleDate] = useState(new Date().toISOString().slice(0, 10));
  const [saleSubmitting, setSaleSubmitting] = useState(false);

  // Bulk import
  const [showBulkModal, setShowBulkModal] = useState(false);
  const [bulkCsv, setBulkCsv] = useState('');
  const [bulkSubmitting, setBulkSubmitting] = useState(false);

  // ── Fetch data ─────────────────────────────────────────────────────────────
  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      // Fetch recipes and sales in parallel
      const [recipesRes, salesRes] = await Promise.all([
        fetch(`${API}/api/recipes`, { headers: authHeaders() }),
        fetch(`${API}/api/menu-sales${period === 'custom' && customFrom && customTo
          ? `?from=${customFrom}&to=${customTo}`
          : ''}`, { headers: authHeaders() }),
      ]);

      if (!recipesRes.ok) throw new Error('Erreur chargement recettes');
      const recipesJson: Recipe[] = await recipesRes.json();
      setRecipes(recipesJson);

      const salesJson: MenuSale[] = salesRes.ok ? await salesRes.json() : [];

      // Filter sales by period (if not custom)
      const now = Date.now();
      const daysNum = period === 'custom' ? 0 : Number(period);
      const filteredSales = period === 'custom'
        ? salesJson
        : salesJson.filter(s => {
            const saleDate = new Date(s.date).getTime();
            return saleDate >= now - daysNum * 86400000;
          });

      // Aggregate sales by recipeId
      const salesByRecipe: Record<number, { qty: number; revenue: number }> = {};
      filteredSales.forEach(s => {
        if (!salesByRecipe[s.recipeId]) salesByRecipe[s.recipeId] = { qty: 0, revenue: 0 };
        salesByRecipe[s.recipeId].qty += s.quantity;
        salesByRecipe[s.recipeId].revenue += s.revenue || 0;
      });

      const totalSales = Object.values(salesByRecipe).reduce((sum, s) => sum + s.qty, 0);
      const avgSalesQty = totalSales / Math.max(recipesJson.length, 1);

      // Calculate food cost per recipe and build engineering items
      const engineeringItems: EngineeringItem[] = recipesJson.map(recipe => {
        // Calculate food cost from ingredients
        const foodCost = (recipe.ingredients || []).reduce((total, ri) => {
          const wasteMultiplier = ri.wastePercent > 0 ? 1 / (1 - ri.wastePercent / 100) : 1;
          return total + ri.quantity * ri.ingredient.pricePerUnit * wasteMultiplier;
        }, 0);
        const costPerPortion = recipe.nbPortions > 0 ? foodCost / recipe.nbPortions : foodCost;

        // Use API-computed margin if available, otherwise compute
        const sellingPrice = recipe.sellingPrice || 0;
        const margin = sellingPrice - costPerPortion;
        const marginPercent = sellingPrice > 0 ? (margin / sellingPrice) * 100 : 0;

        const salesData = salesByRecipe[recipe.id] || { qty: 0, revenue: 0 };
        const popularity = totalSales > 0 ? (salesData.qty / totalSales) * 100 : 0;
        const salesRevenue = salesData.revenue > 0 ? salesData.revenue : salesData.qty * sellingPrice;

        return {
          id: recipe.id,
          name: recipe.name,
          category: recipe.category || 'Non classé',
          sellingPrice,
          costPerPortion: Math.round(costPerPortion * 100) / 100,
          margin: Math.round(margin * 100) / 100,
          marginPercent: Math.round(marginPercent * 10) / 10,
          salesQty: salesData.qty,
          salesRevenue: Math.round(salesRevenue * 100) / 100,
          popularity: Math.round(popularity * 10) / 10,
          quadrant: 'dog' as const, // placeholder, will be assigned below
        };
      });

      // Compute average margin for quadrant classification
      const avgMarginAmount = engineeringItems.reduce((s, e) => s + e.margin, 0) / Math.max(engineeringItems.length, 1);

      // Assign quadrants based on averages
      engineeringItems.forEach(item => {
        if (item.margin >= avgMarginAmount && item.salesQty >= avgSalesQty) item.quadrant = 'star';
        else if (item.margin >= avgMarginAmount && item.salesQty < avgSalesQty) item.quadrant = 'puzzle';
        else if (item.margin < avgMarginAmount && item.salesQty >= avgSalesQty) item.quadrant = 'plow';
        else item.quadrant = 'dog';
      });

      const avgMarginPct = engineeringItems.length > 0
        ? engineeringItems.reduce((s, e) => s + e.marginPercent, 0) / engineeringItems.length
        : 0;

      setData({
        engineering: engineeringItems,
        totalSales,
        avgMargin: Math.round(avgMarginPct * 10) / 10,
        days: daysNum || Math.ceil((new Date(customTo).getTime() - new Date(customFrom).getTime()) / 86400000) || 30,
      });
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Erreur de chargement';
      showToast(message, 'error');
    } finally {
      setLoading(false);
    }
  }, [period, customFrom, customTo, showToast]);

  useEffect(() => { fetchData(); }, [fetchData]);

  // ── Submit single sale ─────────────────────────────────────────────────────
  const handleSubmitSale = async () => {
    if (!saleRecipeId || !saleQty) {
      showToast('Veuillez remplir tous les champs', 'error');
      return;
    }
    setSaleSubmitting(true);
    try {
      const recipe = recipes.find(r => r.id === Number(saleRecipeId));
      const res = await fetch(`${API}/api/menu-sales`, {
        method: 'POST',
        headers: authHeaders(),
        body: JSON.stringify({
          recipeId: Number(saleRecipeId),
          quantity: Number(saleQty),
          revenue: 0,
          date: saleDate,
        }),
      });
      if (!res.ok) throw new Error('Erreur enregistrement');
      showToast(`Vente enregistrée : ${recipe?.name || ''} x${saleQty}`, 'success');
      setShowSalesModal(false);
      setSaleRecipeId('');
      setSaleQty('');
      fetchData();
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Erreur';
      showToast(message, 'error');
    } finally {
      setSaleSubmitting(false);
    }
  };

  // ── Submit bulk import ─────────────────────────────────────────────────────
  const handleBulkImport = async () => {
    if (!bulkCsv.trim()) {
      showToast('Veuillez coller des données CSV', 'error');
      return;
    }
    setBulkSubmitting(true);
    try {
      const lines = bulkCsv.trim().split('\n').filter(l => l.trim());
      const sales = lines.map(line => {
        const parts = line.split(/[;,\t]/).map(s => s.trim());
        if (parts.length < 2) throw new Error(`Ligne invalide: ${line}`);
        const recipeMatch = recipes.find(r =>
          r.name.toLowerCase() === parts[0].toLowerCase() || r.id === Number(parts[0])
        );
        if (!recipeMatch) throw new Error(`Recette non trouvée: ${parts[0]}`);
        return {
          recipeId: recipeMatch.id,
          quantity: Number(parts[1]),
          revenue: 0,
          date: parts[2] || new Date().toISOString().slice(0, 10),
        };
      });

      const res = await fetch(`${API}/api/menu-sales/bulk`, {
        method: 'POST',
        headers: authHeaders(),
        body: JSON.stringify({ sales }),
      });
      if (!res.ok) throw new Error('Erreur import');
      showToast(`${sales.length} ventes importées avec succès`, 'success');
      setShowBulkModal(false);
      setBulkCsv('');
      fetchData();
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Erreur import';
      showToast(message, 'error');
    } finally {
      setBulkSubmitting(false);
    }
  };

  // ── Derived data ───────────────────────────────────────────────────────────
  const items = data?.engineering || [];

  const quadrantCounts = useMemo(() => {
    const counts = { star: 0, puzzle: 0, plow: 0, dog: 0 };
    items.forEach(i => { counts[i.quadrant]++; });
    return counts;
  }, [items]);

  const totalRevenue = useMemo(() => items.reduce((s, i) => s + i.salesRevenue, 0), [items]);

  const sortedItems = useMemo(() => {
    let filtered = filterQuadrant === 'all' ? [...items] : items.filter(i => i.quadrant === filterQuadrant);
    filtered.sort((a, b) => {
      let va: any = a[sortField];
      let vb: any = b[sortField];
      if (typeof va === 'string') { va = va.toLowerCase(); vb = (vb as string).toLowerCase(); }
      if (va < vb) return sortDir === 'asc' ? -1 : 1;
      if (va > vb) return sortDir === 'asc' ? 1 : -1;
      return 0;
    });
    return filtered;
  }, [items, sortField, sortDir, filterQuadrant]);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDir(d => d === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDir('desc');
    }
  };

  const SortIcon = ({ field }: { field: SortField }) => {
    if (sortField !== field) return <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" />;
    return sortDir === 'asc'
      ? <ArrowUp className="w-3.5 h-3.5 text-blue-500" />
      : <ArrowDown className="w-3.5 h-3.5 text-blue-500" />;
  };

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">

        {/* ── Header ───────────────────────────────────────────────────────── */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white flex items-center gap-3">
              <div className="p-2.5 bg-gradient-to-br from-violet-500 to-purple-600 rounded-xl text-white shadow-lg">
                <BarChart3 className="w-6 h-6" />
              </div>
              Menu Engineering
            </h1>
            <p className="text-slate-500 dark:text-slate-400 mt-1">
              Analyse BCG de votre carte &mdash; identifiez les plats à promouvoir, optimiser ou retirer
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowSalesModal(true)}
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 text-white rounded-xl font-medium text-sm shadow-lg shadow-violet-500/25 transition-all"
            >
              <Plus className="w-4 h-4" /> Saisir vente
            </button>
            <button
              onClick={() => window.print()}
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-xl font-medium text-sm transition-all no-print"
            >
              <Printer className="w-4 h-4" /> Imprimer
            </button>
          </div>
        </div>

        {/* ── Period selector ──────────────────────────────────────────────── */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-1 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-1 shadow-sm">
            {(['7', '30', '90'] as Period[]).map(p => (
              <button
                key={p}
                onClick={() => setPeriod(p)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  period === p
                    ? 'bg-violet-600 text-white shadow-md'
                    : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700'
                }`}
              >
                {p}j
              </button>
            ))}
            <button
              onClick={() => setPeriod('custom')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-1.5 ${
                period === 'custom'
                  ? 'bg-violet-600 text-white shadow-md'
                  : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700'
              }`}
            >
              <Calendar className="w-3.5 h-3.5" /> Personnalisé
            </button>
          </div>

          {period === 'custom' && (
            <div className="flex items-center gap-2">
              <input
                type="date"
                value={customFrom}
                onChange={e => setCustomFrom(e.target.value)}
                className="px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 text-sm"
              />
              <span className="text-slate-400">→</span>
              <input
                type="date"
                value={customTo}
                onChange={e => setCustomTo(e.target.value)}
                className="px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 text-sm"
              />
              <button
                onClick={fetchData}
                className="p-2 bg-violet-600 hover:bg-violet-700 text-white rounded-lg transition-colors"
              >
                <RefreshCw className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>

        {/* ── Loading ──────────────────────────────────────────────────────── */}
        {loading && (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-violet-500" />
            <span className="ml-3 text-slate-500 dark:text-slate-400">Chargement de l&apos;analyse...</span>
          </div>
        )}

        {!loading && data && (
          <>
            {/* ── Summary cards ────────────────────────────────────────────── */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <SummaryCard
                icon={<ShoppingBag className="w-5 h-5" />}
                label="Total ventes"
                value={data.totalSales.toString()}
                sub={`sur ${data.days} jours`}
                color="violet"
              />
              <SummaryCard
                icon={<DollarSign className="w-5 h-5" />}
                label="CA total"
                value={fmtEur(totalRevenue)}
                sub="chiffre d'affaires"
                color="emerald"
              />
              <SummaryCard
                icon={<Percent className="w-5 h-5" />}
                label="Marge moyenne"
                value={`${fmt(data.avgMargin, 1)}%`}
                sub="toutes recettes"
                color="blue"
              />
              <SummaryCard
                icon={<ChefHat className="w-5 h-5" />}
                label="Nb recettes"
                value={items.length.toString()}
                sub="analysées"
                color="amber"
              />
            </div>

            {/* ── Quadrant summary cards ───────────────────────────────────── */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {(Object.keys(QUADRANT_CONFIG) as Quadrant[]).map(q => {
                const cfg = QUADRANT_CONFIG[q];
                return (
                  <button
                    key={q}
                    onClick={() => setFilterQuadrant(prev => prev === q ? 'all' : q)}
                    className={`text-left p-4 rounded-xl border-2 transition-all ${
                      filterQuadrant === q
                        ? `${cfg.border} ${cfg.bg} ring-2 ring-offset-1 ring-${cfg.color}-400/50`
                        : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:border-slate-300 dark:hover:border-slate-600'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xl">{cfg.emoji}</span>
                      <span className={`text-2xl font-bold ${cfg.text}`}>{quadrantCounts[q]}</span>
                    </div>
                    <div className="font-semibold text-sm text-slate-800 dark:text-slate-200">{cfg.label}</div>
                    <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{cfg.desc}</div>
                    <div className={`mt-2 inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold ${cfg.badge}`}>
                      {cfg.action}
                    </div>
                  </button>
                );
              })}
            </div>

            {/* ── BCG Matrix ──────────────────────────────────────────────── */}
            <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <Target className="w-5 h-5 text-violet-500" />
                    Matrice BCG &mdash; Menu Engineering
                  </h2>
                  <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
                    Chaque bulle représente un plat. Taille = chiffre d&apos;affaires. Survolez pour les détails.
                  </p>
                </div>
                <div className="flex items-center gap-3 text-xs text-slate-500 dark:text-slate-400">
                  <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-emerald-500" /> Vedettes</span>
                  <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-blue-500" /> Énigmes</span>
                  <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-amber-500" /> Valeurs sûres</span>
                  <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-red-500" /> Poids morts</span>
                </div>
              </div>

              {items.length > 0 ? (
                <BCGMatrix items={items} />
              ) : (
                <div className="text-center py-16 text-slate-400 dark:text-slate-500">
                  <BarChart3 className="w-12 h-12 mx-auto mb-3 opacity-50" />
                  <p className="font-medium">Ajoutez des recettes et des ventes pour voir l&apos;analyse</p>
                  <p className="text-sm mt-1">Créez vos recettes puis saisissez des ventes pour alimenter la matrice BCG</p>
                </div>
              )}
            </div>

            {/* ── Detailed table ───────────────────────────────────────────── */}
            <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden">
              <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between">
                <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <Award className="w-5 h-5 text-violet-500" />
                  Détail par recette
                </h2>
                <div className="flex items-center gap-2">
                  <select
                    value={filterQuadrant}
                    onChange={e => setFilterQuadrant(e.target.value as Quadrant | 'all')}
                    className="px-3 py-1.5 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-sm text-slate-700 dark:text-slate-200"
                  >
                    <option value="all">Tous les quadrants</option>
                    {(Object.keys(QUADRANT_CONFIG) as Quadrant[]).map(q => (
                      <option key={q} value={q}>{QUADRANT_CONFIG[q].emoji} {QUADRANT_CONFIG[q].label}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-slate-50 dark:bg-slate-900/50">
                      {[
                        { field: 'name' as SortField, label: 'Nom' },
                        { field: 'category' as SortField, label: 'Catégorie' },
                        { field: 'sellingPrice' as SortField, label: 'Prix vente' },
                        { field: 'costPerPortion' as SortField, label: 'Coût' },
                        { field: 'margin' as SortField, label: 'Marge (€)' },
                        { field: 'marginPercent' as SortField, label: 'Marge (%)' },
                        { field: 'salesQty' as SortField, label: 'Ventes' },
                        { field: 'salesRevenue' as SortField, label: 'CA' },
                        { field: 'quadrant' as SortField, label: 'Quadrant' },
                      ].map(col => (
                        <th
                          key={col.field}
                          onClick={() => handleSort(col.field)}
                          className="px-4 py-3 text-left text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider cursor-pointer hover:text-slate-700 dark:hover:text-slate-200 transition-colors select-none"
                        >
                          <span className="inline-flex items-center gap-1">
                            {col.label}
                            <SortIcon field={col.field} />
                          </span>
                        </th>
                      ))}
                      <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                        Action
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-700/50">
                    {sortedItems.length === 0 ? (
                      <tr>
                        <td colSpan={10} className="px-4 py-12 text-center text-slate-400 dark:text-slate-500">
                          Aucun plat trouvé pour ce filtre
                        </td>
                      </tr>
                    ) : (
                      sortedItems.map(item => {
                        const cfg = QUADRANT_CONFIG[item.quadrant];
                        return (
                          <tr key={item.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                            <td className="px-4 py-3 font-medium text-slate-900 dark:text-white whitespace-nowrap">
                              {item.name}
                            </td>
                            <td className="px-4 py-3 text-slate-600 dark:text-slate-300">
                              {item.category}
                            </td>
                            <td className="px-4 py-3 text-slate-700 dark:text-slate-200 font-mono text-right">
                              {fmtEur(item.sellingPrice)}
                            </td>
                            <td className="px-4 py-3 text-slate-700 dark:text-slate-200 font-mono text-right">
                              {fmtEur(item.costPerPortion)}
                            </td>
                            <td className="px-4 py-3 font-mono text-right font-medium text-slate-900 dark:text-white">
                              {fmtEur(item.margin)}
                            </td>
                            <td className="px-4 py-3 text-right">
                              <MarginBadge percent={item.marginPercent} />
                            </td>
                            <td className="px-4 py-3 text-slate-700 dark:text-slate-200 font-mono text-right">
                              {item.salesQty}
                            </td>
                            <td className="px-4 py-3 font-mono text-right font-medium text-slate-900 dark:text-white">
                              {fmtEur(item.salesRevenue)}
                            </td>
                            <td className="px-4 py-3">
                              <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold ${cfg.badge}`}>
                                {cfg.emoji} {cfg.label}
                              </span>
                            </td>
                            <td className="px-4 py-3 text-xs text-slate-500 dark:text-slate-400 max-w-[200px]">
                              {cfg.recommendation}
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}
      </div>

      {/* ── Modal: Saisie de vente ──────────────────────────────────────────── */}
      <Modal isOpen={showSalesModal} onClose={() => setShowSalesModal(false)} title="Saisir une vente">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Recette</label>
            <select
              value={saleRecipeId}
              onChange={e => setSaleRecipeId(e.target.value ? Number(e.target.value) : '')}
              className="w-full px-3 py-2.5 border border-slate-200 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200"
            >
              <option value="">Sélectionner une recette...</option>
              {recipes.map(r => (
                <option key={r.id} value={r.id}>{r.name} ({r.category})</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Quantité vendue</label>
            <input
              type="number"
              min="1"
              value={saleQty}
              onChange={e => setSaleQty(e.target.value)}
              placeholder="Ex: 12"
              className="w-full px-3 py-2.5 border border-slate-200 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Date</label>
            <input
              type="date"
              value={saleDate}
              onChange={e => setSaleDate(e.target.value)}
              className="w-full px-3 py-2.5 border border-slate-200 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200"
            />
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button
              onClick={() => setShowSalesModal(false)}
              className="px-4 py-2.5 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
            >
              Annuler
            </button>
            <button
              onClick={handleSubmitSale}
              disabled={saleSubmitting}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 text-white rounded-xl font-medium text-sm shadow-lg shadow-violet-500/25 transition-all disabled:opacity-50"
            >
              {saleSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
              Enregistrer
            </button>
          </div>
        </div>
      </Modal>

      {/* ── Modal: Bulk import ──────────────────────────────────────────────── */}
      <Modal isOpen={showBulkModal} onClose={() => setShowBulkModal(false)} title="Import CSV de ventes">
        <div className="space-y-4">
          <div className="p-3 bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 rounded-xl text-sm text-blue-700 dark:text-blue-300">
            <p className="font-medium mb-1">Format attendu (séparateur: virgule, point-virgule ou tabulation)</p>
            <code className="text-xs block mt-1 font-mono">
              nom_recette, quantité, date (YYYY-MM-DD)<br />
              Burger Classic, 25, 2026-03-20<br />
              Salade César, 18, 2026-03-20<br />
              Tiramisu, 12, 2026-03-20
            </code>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
              Données CSV
            </label>
            <textarea
              rows={8}
              value={bulkCsv}
              onChange={e => setBulkCsv(e.target.value)}
              placeholder="Collez vos données ici..."
              className="w-full px-3 py-2.5 border border-slate-200 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 font-mono text-sm resize-y"
            />
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button
              onClick={() => setShowBulkModal(false)}
              className="px-4 py-2.5 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
            >
              Annuler
            </button>
            <button
              onClick={handleBulkImport}
              disabled={bulkSubmitting}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 text-white rounded-xl font-medium text-sm shadow-lg shadow-violet-500/25 transition-all disabled:opacity-50"
            >
              {bulkSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
              Importer
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

// ── Reusable subcomponents ───────────────────────────────────────────────────

function SummaryCard({ icon, label, value, sub, color }: {
  icon: React.ReactNode;
  label: string;
  value: string;
  sub: string;
  color: string;
}) {
  const colorMap: Record<string, { bg: string; icon: string; border: string }> = {
    violet: {
      bg: 'from-violet-50 to-white dark:from-violet-950/30 dark:to-slate-800',
      icon: 'bg-violet-100 text-violet-600 dark:bg-violet-900/50 dark:text-violet-400',
      border: 'border-t-violet-500',
    },
    emerald: {
      bg: 'from-emerald-50 to-white dark:from-emerald-950/30 dark:to-slate-800',
      icon: 'bg-emerald-100 text-emerald-600 dark:bg-emerald-900/50 dark:text-emerald-400',
      border: 'border-t-emerald-500',
    },
    blue: {
      bg: 'from-blue-50 to-white dark:from-blue-950/30 dark:to-slate-800',
      icon: 'bg-blue-100 text-blue-600 dark:bg-blue-900/50 dark:text-blue-400',
      border: 'border-t-blue-500',
    },
    amber: {
      bg: 'from-amber-50 to-white dark:from-amber-950/30 dark:to-slate-800',
      icon: 'bg-amber-100 text-amber-600 dark:bg-amber-900/50 dark:text-amber-400',
      border: 'border-t-amber-500',
    },
  };
  const c = colorMap[color] || colorMap.violet;

  return (
    <div className={`bg-gradient-to-br ${c.bg} rounded-2xl border border-slate-200 dark:border-slate-700 border-t-4 ${c.border} p-5 shadow-sm`}>
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">{label}</span>
        <div className={`p-2 rounded-lg ${c.icon}`}>{icon}</div>
      </div>
      <div className="text-2xl font-bold text-slate-900 dark:text-white">{value}</div>
      <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">{sub}</div>
    </div>
  );
}

function MarginBadge({ percent }: { percent: number }) {
  const cls = percent >= 70
    ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/50 dark:text-emerald-300'
    : percent >= 50
    ? 'bg-amber-100 text-amber-800 dark:bg-amber-900/50 dark:text-amber-300'
    : 'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300';
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold ${cls}`}>
      {fmt(percent, 1)}%
    </span>
  );
}
