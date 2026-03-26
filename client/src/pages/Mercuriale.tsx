import { useState, useEffect, useMemo, useCallback } from 'react';
import { TrendingUp, TrendingDown, AlertTriangle, History, Search, Euro, BarChart3, Plus, Loader2, X } from 'lucide-react';
import { useToast } from '../hooks/useToast';

const API = '';

function authHeaders(): Record<string, string> {
  const token = localStorage.getItem('token');
  const headers: Record<string, string> = { 'Content-Type': 'application/json' };
  if (token) headers['Authorization'] = `Bearer ${token}`;
  return headers;
}

// --- Types ---

interface Ingredient {
  id: number;
  name: string;
  unit: string;
  pricePerUnit: number;
  category: string;
}

interface PricePoint {
  id: number;
  ingredientId: number;
  price: number;
  date: string;
  source: string;
}

interface PriceAlert {
  ingredientId: number;
  ingredientName: string;
  unit: string;
  oldPrice: number;
  newPrice: number;
  changePercent: number;
  date: string;
}

interface IngredientRow {
  id: number;
  name: string;
  unit: string;
  currentPrice: number;
  category: string;
  change7d: number | null;
  change30d: number | null;
  change90d: number | null;
}

type SortKey = 'name' | 'currentPrice' | 'change7d' | 'change30d' | 'change90d';
type SortDir = 'asc' | 'desc';

// --- SVG Chart ---

function PriceChart({ data, width = 700, height = 260 }: { data: PricePoint[]; width?: number; height?: number }) {
  if (!data.length) {
    return (
      <div className="flex items-center justify-center h-64 text-gray-400 dark:text-gray-500">
        <BarChart3 className="w-8 h-8 mr-2" />
        <span>Aucune donnée pour cet ingrédient</span>
      </div>
    );
  }

  const sorted = [...data].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  const prices = sorted.map((p) => p.price);
  const minP = Math.min(...prices);
  const maxP = Math.max(...prices);
  const range = maxP - minP || 1;

  const padX = 60;
  const padY = 30;
  const padBottom = 40;
  const chartW = width - padX - 20;
  const chartH = height - padY - padBottom;

  const points = sorted.map((p, i) => {
    const x = padX + (sorted.length === 1 ? chartW / 2 : (i / (sorted.length - 1)) * chartW);
    const y = padY + chartH - ((p.price - minP) / range) * chartH;
    return { x, y, price: p.price, date: p.date };
  });

  const pathD = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ');
  const areaD = `${pathD} L ${points[points.length - 1].x} ${padY + chartH} L ${points[0].x} ${padY + chartH} Z`;

  // Y axis labels (5 ticks)
  const yTicks = Array.from({ length: 5 }, (_, i) => {
    const val = minP + (range * i) / 4;
    const y = padY + chartH - (i / 4) * chartH;
    return { val, y };
  });

  // X axis labels (max 6)
  const step = Math.max(1, Math.floor(sorted.length / 6));
  const xLabels = sorted
    .filter((_, i) => i % step === 0 || i === sorted.length - 1)
    .map((p, idx, arr) => {
      const origIdx = sorted.indexOf(p);
      const x = padX + (sorted.length === 1 ? chartW / 2 : (origIdx / (sorted.length - 1)) * chartW);
      const d = new Date(p.date);
      return { x, label: `${d.getDate()}/${d.getMonth() + 1}` };
    });

  const trendUp = prices.length > 1 && prices[prices.length - 1] > prices[0];

  return (
    <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-auto" preserveAspectRatio="xMidYMid meet">
      {/* Grid */}
      {yTicks.map((t, i) => (
        <g key={i}>
          <line x1={padX} y1={t.y} x2={width - 20} y2={t.y} stroke="currentColor" className="text-gray-200 dark:text-gray-700" strokeDasharray="4 4" />
          <text x={padX - 8} y={t.y + 4} textAnchor="end" className="text-[10px] fill-gray-500 dark:fill-gray-400">
            {t.val.toFixed(2)} €
          </text>
        </g>
      ))}

      {/* Area */}
      <path d={areaD} className={trendUp ? 'fill-red-100/50 dark:fill-red-900/20' : 'fill-emerald-100/50 dark:fill-emerald-900/20'} />

      {/* Line */}
      <path d={pathD} fill="none" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" className={trendUp ? 'stroke-red-500' : 'stroke-emerald-500'} />

      {/* Dots */}
      {points.map((p, i) => (
        <g key={i}>
          <circle cx={p.x} cy={p.y} r={3.5} className={trendUp ? 'fill-red-500' : 'fill-emerald-500'} />
          <title>
            {new Date(p.date).toLocaleDateString('fr-FR')} — {p.price.toFixed(2)} €
          </title>
        </g>
      ))}

      {/* X labels */}
      {xLabels.map((l, i) => (
        <text key={i} x={l.x} y={height - 8} textAnchor="middle" className="text-[10px] fill-gray-500 dark:fill-gray-400">
          {l.label}
        </text>
      ))}
    </svg>
  );
}

// --- Main Component ---

export default function Mercuriale() {
  const { showToast } = useToast();

  const [ingredients, setIngredients] = useState<Ingredient[]>([]);
  const [alerts, setAlerts] = useState<PriceAlert[]>([]);
  const [priceHistory, setPriceHistory] = useState<PricePoint[]>([]);
  const [tableRows, setTableRows] = useState<IngredientRow[]>([]);

  const [loading, setLoading] = useState(true);
  const [chartLoading, setChartLoading] = useState(false);
  const [selectedIngredientId, setSelectedIngredientId] = useState<number | null>(null);
  const [chartDays, setChartDays] = useState(30);

  const [search, setSearch] = useState('');
  const [sortKey, setSortKey] = useState<SortKey>('name');
  const [sortDir, setSortDir] = useState<SortDir>('asc');

  // Manual price entry
  const [showPriceModal, setShowPriceModal] = useState(false);
  const [priceForm, setPriceForm] = useState({ ingredientId: 0, price: '' });
  const [saving, setSaving] = useState(false);

  // --- Data Fetching ---

  const fetchAlerts = useCallback(async () => {
    try {
      const res = await fetch(`${API}/api/price-history/alerts`, { headers: authHeaders() });
      if (!res.ok) throw new Error();
      const data = await res.json();
      setAlerts(data);
    } catch {
      // Silently handle - alerts are non-critical
    }
  }, []);

  const fetchIngredients = useCallback(async () => {
    try {
      const res = await fetch(`${API}/api/ingredients`, { headers: authHeaders() });
      if (!res.ok) throw new Error();
      const data = await res.json();
      setIngredients(data);
      if (data.length > 0 && !selectedIngredientId) {
        setSelectedIngredientId(data[0].id);
      }
      return data as Ingredient[];
    } catch {
      showToast('Erreur chargement des ingrédients', 'error');
      return [];
    }
  }, [showToast, selectedIngredientId]);

  const fetchPriceHistoryForChart = useCallback(async (ingredientId: number, days: number) => {
    setChartLoading(true);
    try {
      const res = await fetch(`${API}/api/price-history?ingredientId=${ingredientId}&days=${days}`, { headers: authHeaders() });
      if (!res.ok) throw new Error();
      const data = await res.json();
      setPriceHistory(data);
    } catch {
      setPriceHistory([]);
    } finally {
      setChartLoading(false);
    }
  }, []);

  const buildTableRows = useCallback(async (ings: Ingredient[]) => {
    // Fetch 7d, 30d, 90d changes for table
    const rows: IngredientRow[] = [];
    for (const ing of ings) {
      let change7d: number | null = null;
      let change30d: number | null = null;
      let change90d: number | null = null;
      try {
        const res90 = await fetch(`${API}/api/price-history?ingredientId=${ing.id}&days=90`, { headers: authHeaders() });
        if (res90.ok) {
          const history: PricePoint[] = await res90.json();
          if (history.length >= 2) {
            const sorted = [...history].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
            const latest = sorted[sorted.length - 1].price;
            const now = new Date();

            const findOldPrice = (daysAgo: number) => {
              const cutoff = new Date(now.getTime() - daysAgo * 86400000);
              const older = sorted.filter((p) => new Date(p.date) <= cutoff);
              return older.length ? older[older.length - 1].price : sorted[0].price;
            };

            const old7 = findOldPrice(7);
            const old30 = findOldPrice(30);
            const old90 = findOldPrice(90);

            if (old7) change7d = ((latest - old7) / old7) * 100;
            if (old30) change30d = ((latest - old30) / old30) * 100;
            if (old90) change90d = ((latest - old90) / old90) * 100;
          }
        }
      } catch {
        // skip
      }
      rows.push({
        id: ing.id,
        name: ing.name,
        unit: ing.unit,
        currentPrice: ing.pricePerUnit,
        category: ing.category,
        change7d,
        change30d,
        change90d,
      });
    }
    setTableRows(rows);
  }, []);

  useEffect(() => {
    (async () => {
      setLoading(true);
      const ings = await fetchIngredients();
      await fetchAlerts();
      await buildTableRows(ings);
      setLoading(false);
    })();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (selectedIngredientId) {
      fetchPriceHistoryForChart(selectedIngredientId, chartDays);
    }
  }, [selectedIngredientId, chartDays, fetchPriceHistoryForChart]);

  // --- Manual price save ---

  const handleSavePrice = async () => {
    if (!priceForm.ingredientId || !priceForm.price) {
      showToast('Veuillez remplir tous les champs', 'error');
      return;
    }
    setSaving(true);
    try {
      const res = await fetch(`${API}/api/price-history`, {
        method: 'POST',
        headers: authHeaders(),
        body: JSON.stringify({
          ingredientId: priceForm.ingredientId,
          price: parseFloat(priceForm.price),
          source: 'manual',
        }),
      });
      if (!res.ok) throw new Error();
      showToast('Prix enregistré', 'success');
      setShowPriceModal(false);
      setPriceForm({ ingredientId: 0, price: '' });

      // Refresh
      const ings = await fetchIngredients();
      await fetchAlerts();
      await buildTableRows(ings);
      if (selectedIngredientId) {
        fetchPriceHistoryForChart(selectedIngredientId, chartDays);
      }
    } catch {
      showToast('Erreur lors de l\'enregistrement', 'error');
    } finally {
      setSaving(false);
    }
  };

  // --- Sorting / Filtering ---

  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortKey(key);
      setSortDir('asc');
    }
  };

  const filteredRows = useMemo(() => {
    let rows = [...tableRows];
    if (search.trim()) {
      const q = search.toLowerCase();
      rows = rows.filter((r) => r.name.toLowerCase().includes(q) || r.category.toLowerCase().includes(q));
    }
    rows.sort((a, b) => {
      let cmp = 0;
      if (sortKey === 'name') {
        cmp = a.name.localeCompare(b.name, 'fr');
      } else {
        const av = a[sortKey] ?? 0;
        const bv = b[sortKey] ?? 0;
        cmp = (av as number) - (bv as number);
      }
      return sortDir === 'asc' ? cmp : -cmp;
    });
    return rows;
  }, [tableRows, search, sortKey, sortDir]);

  const selectedIngredient = ingredients.find((i) => i.id === selectedIngredientId);

  // --- Helpers ---

  const formatChange = (val: number | null) => {
    if (val === null) return <span className="text-gray-400">—</span>;
    const sign = val > 0 ? '+' : '';
    const color = val > 0 ? 'text-red-600 dark:text-red-400' : val < 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-gray-500';
    return <span className={`font-medium ${color}`}>{sign}{val.toFixed(1)}%</span>;
  };

  const SortIcon = ({ col }: { col: SortKey }) => (
    <span className={`ml-1 inline-block ${sortKey === col ? 'text-blue-500' : 'text-gray-400'}`}>
      {sortKey === col && sortDir === 'desc' ? '\u25BC' : '\u25B2'}
    </span>
  );

  // --- Render ---

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div className="flex items-center gap-3">
          <History className="w-7 h-7 text-blue-600 dark:text-blue-400" />
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Mercuriale</h1>
        </div>
        <button
          onClick={() => setShowPriceModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
        >
          <Plus className="w-4 h-4" />
          Saisir un prix
        </button>
      </div>

      {/* Alerts Section */}
      {alerts.length > 0 && (
        <div>
          <div className="flex items-center gap-2 mb-3">
            <AlertTriangle className="w-5 h-5 text-amber-500" />
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Alertes de prix</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
            {alerts.map((a, i) => {
              const up = a.changePercent > 0;
              return (
                <div
                  key={i}
                  className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4 flex flex-col gap-2 shadow-sm"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-gray-900 dark:text-white text-sm truncate">{a.ingredientName}</span>
                    <span
                      className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                        up ? 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300' : 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300'
                      }`}
                    >
                      {up ? '+' : ''}
                      {a.changePercent.toFixed(1)}%
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <span className="text-gray-500 dark:text-gray-400">{a.oldPrice.toFixed(2)} €</span>
                    <span className="text-gray-400">\u2192</span>
                    <span className={`font-medium ${up ? 'text-red-600 dark:text-red-400' : 'text-emerald-600 dark:text-emerald-400'}`}>
                      {a.newPrice.toFixed(2)} €
                    </span>
                    <span className="text-gray-400 text-xs">/ {a.unit}</span>
                  </div>
                  <div className="flex items-center gap-1 text-xs text-gray-400">
                    {up ? <TrendingUp className="w-3.5 h-3.5 text-red-500" /> : <TrendingDown className="w-3.5 h-3.5 text-emerald-500" />}
                    <span>{new Date(a.date).toLocaleDateString('fr-FR')}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Price Chart */}
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-5 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
          <div className="flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-blue-500" />
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Évolution des prix</h2>
          </div>
          <div className="flex items-center gap-3">
            <select
              value={selectedIngredientId ?? ''}
              onChange={(e) => setSelectedIngredientId(Number(e.target.value))}
              className="px-3 py-1.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-sm text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 max-w-[220px]"
            >
              {ingredients.map((ing) => (
                <option key={ing.id} value={ing.id}>
                  {ing.name}
                </option>
              ))}
            </select>
            <select
              value={chartDays}
              onChange={(e) => setChartDays(Number(e.target.value))}
              className="px-3 py-1.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-sm text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
            >
              <option value={7}>7 jours</option>
              <option value={30}>30 jours</option>
              <option value={90}>90 jours</option>
              <option value={180}>6 mois</option>
              <option value={365}>1 an</option>
            </select>
          </div>
        </div>
        {selectedIngredient && (
          <div className="text-sm text-gray-500 dark:text-gray-400 mb-2">
            <Euro className="w-3.5 h-3.5 inline mr-1" />
            {selectedIngredient.name} — prix actuel : <span className="font-semibold text-gray-900 dark:text-white">{selectedIngredient.pricePerUnit.toFixed(2)} €/{selectedIngredient.unit}</span>
          </div>
        )}
        {chartLoading ? (
          <div className="flex items-center justify-center h-64">
            <Loader2 className="w-6 h-6 animate-spin text-blue-500" />
          </div>
        ) : (
          <PriceChart data={priceHistory} />
        )}
      </div>

      {/* Price Table */}
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm">
        <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Tableau des prix</h2>
          <div className="relative max-w-xs w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Rechercher un ingrédient..."
              className="w-full pl-9 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-sm text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
                <th
                  className="px-4 py-3 font-semibold text-gray-600 dark:text-gray-300 cursor-pointer hover:text-blue-600 select-none"
                  onClick={() => handleSort('name')}
                >
                  Ingrédient <SortIcon col="name" />
                </th>
                <th
                  className="px-4 py-3 font-semibold text-gray-600 dark:text-gray-300 text-right cursor-pointer hover:text-blue-600 select-none"
                  onClick={() => handleSort('currentPrice')}
                >
                  Prix actuel <SortIcon col="currentPrice" />
                </th>
                <th
                  className="px-4 py-3 font-semibold text-gray-600 dark:text-gray-300 text-right cursor-pointer hover:text-blue-600 select-none"
                  onClick={() => handleSort('change7d')}
                >
                  7j <SortIcon col="change7d" />
                </th>
                <th
                  className="px-4 py-3 font-semibold text-gray-600 dark:text-gray-300 text-right cursor-pointer hover:text-blue-600 select-none"
                  onClick={() => handleSort('change30d')}
                >
                  30j <SortIcon col="change30d" />
                </th>
                <th
                  className="px-4 py-3 font-semibold text-gray-600 dark:text-gray-300 text-right cursor-pointer hover:text-blue-600 select-none"
                  onClick={() => handleSort('change90d')}
                >
                  90j <SortIcon col="change90d" />
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredRows.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-4 py-8 text-center text-gray-400">
                    Aucun ingrédient trouvé
                  </td>
                </tr>
              ) : (
                filteredRows.map((row) => (
                  <tr
                    key={row.id}
                    className="border-b border-gray-100 dark:border-gray-700/50 hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors cursor-pointer"
                    onClick={() => {
                      setSelectedIngredientId(row.id);
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                  >
                    <td className="px-4 py-3">
                      <div className="font-medium text-gray-900 dark:text-white">{row.name}</div>
                      <div className="text-xs text-gray-400">{row.category}</div>
                    </td>
                    <td className="px-4 py-3 text-right font-medium text-gray-900 dark:text-white">
                      {row.currentPrice.toFixed(2)} €<span className="text-gray-400 text-xs ml-1">/{row.unit}</span>
                    </td>
                    <td className="px-4 py-3 text-right">{formatChange(row.change7d)}</td>
                    <td className="px-4 py-3 text-right">{formatChange(row.change30d)}</td>
                    <td className="px-4 py-3 text-right">{formatChange(row.change90d)}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        <div className="px-4 py-3 text-xs text-gray-400 border-t border-gray-200 dark:border-gray-700">
          {filteredRows.length} ingrédient{filteredRows.length > 1 ? 's' : ''} — Cliquez sur une ligne pour voir l'historique
        </div>
      </div>

      {/* Manual Price Entry Modal */}
      {showPriceModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl w-full max-w-md mx-4 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Saisir un nouveau prix</h3>
              <button
                onClick={() => setShowPriceModal(false)}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Ingrédient</label>
                <select
                  value={priceForm.ingredientId}
                  onChange={(e) => setPriceForm((f) => ({ ...f, ingredientId: Number(e.target.value) }))}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-sm text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                >
                  <option value={0}>Sélectionner...</option>
                  {ingredients.map((ing) => (
                    <option key={ing.id} value={ing.id}>
                      {ing.name} ({ing.unit})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Nouveau prix (€)
                </label>
                <div className="relative">
                  <Euro className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    value={priceForm.price}
                    onChange={(e) => setPriceForm((f) => ({ ...f, price: e.target.value }))}
                    placeholder="0.00"
                    className="w-full pl-9 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-sm text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                {priceForm.ingredientId > 0 && (
                  <p className="mt-1 text-xs text-gray-400">
                    Prix actuel : {ingredients.find((i) => i.id === priceForm.ingredientId)?.pricePerUnit.toFixed(2) ?? '—'} €
                  </p>
                )}
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => setShowPriceModal(false)}
                className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
              >
                Annuler
              </button>
              <button
                onClick={handleSavePrice}
                disabled={saving}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors text-sm font-medium"
              >
                {saving && <Loader2 className="w-4 h-4 animate-spin" />}
                Enregistrer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
