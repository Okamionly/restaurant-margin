import { useState, useMemo } from 'react';
import { TrendingUp, TrendingDown, Minus, History, Search, Euro, Filter, CalendarDays } from 'lucide-react';

// --- Types ---

interface MercurialeItem {
  id: number;
  name: string;
  category: string;
  unit: string;
  currentPrice: number;
  previousPrice: number;
  variation: number;
  trend: 'up' | 'down' | 'stable';
  supplier: string;
}

type Category = 'Tous' | 'Fruits & Légumes' | 'Viandes' | 'Poissons' | 'Épicerie' | 'Produits laitiers';

// --- Demo Data ---

const LAST_UPDATE = '2026-03-31';

const DEMO_DATA: MercurialeItem[] = [
  { id: 1, name: 'Tomates grappe', category: 'Fruits & Légumes', unit: 'kg', currentPrice: 2.85, previousPrice: 2.60, variation: 9.6, trend: 'up', supplier: 'Rungis Direct' },
  { id: 2, name: 'Oignons jaunes', category: 'Fruits & Légumes', unit: 'kg', currentPrice: 1.20, previousPrice: 1.25, variation: -4.0, trend: 'down', supplier: 'Pomona' },
  { id: 3, name: 'Carottes', category: 'Fruits & Légumes', unit: 'kg', currentPrice: 1.45, previousPrice: 1.40, variation: 3.6, trend: 'up', supplier: 'Pomona' },
  { id: 4, name: 'Pommes de terre', category: 'Fruits & Légumes', unit: 'kg', currentPrice: 0.95, previousPrice: 0.98, variation: -3.1, trend: 'down', supplier: 'Transgourmet' },
  { id: 5, name: 'Citrons', category: 'Fruits & Légumes', unit: 'kg', currentPrice: 2.30, previousPrice: 2.28, variation: 0.9, trend: 'stable', supplier: 'Rungis Direct' },
  { id: 6, name: 'Filet de poulet', category: 'Viandes', unit: 'kg', currentPrice: 8.90, previousPrice: 8.50, variation: 4.7, trend: 'up', supplier: 'Davigel' },
  { id: 7, name: 'Entrecôte de boeuf', category: 'Viandes', unit: 'kg', currentPrice: 28.50, previousPrice: 27.80, variation: 2.5, trend: 'up', supplier: 'Bigard' },
  { id: 8, name: 'Échine de porc', category: 'Viandes', unit: 'kg', currentPrice: 6.70, previousPrice: 6.90, variation: -2.9, trend: 'down', supplier: 'Bigard' },
  { id: 9, name: 'Agneau (gigot)', category: 'Viandes', unit: 'kg', currentPrice: 16.80, previousPrice: 16.50, variation: 1.8, trend: 'stable', supplier: 'Davigel' },
  { id: 10, name: 'Saumon frais', category: 'Poissons', unit: 'kg', currentPrice: 18.50, previousPrice: 17.20, variation: 7.6, trend: 'up', supplier: 'Reynaud' },
  { id: 11, name: 'Crevettes (16/20)', category: 'Poissons', unit: 'kg', currentPrice: 14.90, previousPrice: 15.30, variation: -2.6, trend: 'down', supplier: 'Reynaud' },
  { id: 12, name: 'Cabillaud', category: 'Poissons', unit: 'kg', currentPrice: 15.60, previousPrice: 15.40, variation: 1.3, trend: 'stable', supplier: 'Reynaud' },
  { id: 13, name: 'Beurre doux', category: 'Produits laitiers', unit: 'kg', currentPrice: 7.80, previousPrice: 7.20, variation: 8.3, trend: 'up', supplier: 'Transgourmet' },
  { id: 14, name: 'Crème liquide 35%', category: 'Produits laitiers', unit: 'L', currentPrice: 3.40, previousPrice: 3.30, variation: 3.0, trend: 'up', supplier: 'Transgourmet' },
  { id: 15, name: 'Parmesan AOP', category: 'Produits laitiers', unit: 'kg', currentPrice: 22.00, previousPrice: 21.50, variation: 2.3, trend: 'up', supplier: 'Pomona' },
  { id: 16, name: 'Mozzarella', category: 'Produits laitiers', unit: 'kg', currentPrice: 6.50, previousPrice: 6.60, variation: -1.5, trend: 'stable', supplier: 'Pomona' },
  { id: 17, name: 'Farine T55', category: 'Épicerie', unit: 'kg', currentPrice: 0.85, previousPrice: 0.82, variation: 3.7, trend: 'up', supplier: 'Transgourmet' },
  { id: 18, name: 'Huile d\'olive extra vierge', category: 'Épicerie', unit: 'L', currentPrice: 9.50, previousPrice: 8.80, variation: 8.0, trend: 'up', supplier: 'Metro' },
  { id: 19, name: 'Riz basmati', category: 'Épicerie', unit: 'kg', currentPrice: 2.10, previousPrice: 2.15, variation: -2.3, trend: 'down', supplier: 'Metro' },
  { id: 20, name: 'Pâtes penne', category: 'Épicerie', unit: 'kg', currentPrice: 1.60, previousPrice: 1.55, variation: 3.2, trend: 'up', supplier: 'Transgourmet' },
  { id: 21, name: 'Concentré de tomate', category: 'Épicerie', unit: 'kg', currentPrice: 3.20, previousPrice: 3.10, variation: 3.2, trend: 'up', supplier: 'Metro' },
  { id: 22, name: 'Sel fin', category: 'Épicerie', unit: 'kg', currentPrice: 0.45, previousPrice: 0.45, variation: 0, trend: 'stable', supplier: 'Transgourmet' },
];

const CATEGORIES: Category[] = ['Tous', 'Fruits & Légumes', 'Viandes', 'Poissons', 'Épicerie', 'Produits laitiers'];

type SortKey = 'name' | 'currentPrice' | 'variation';
type SortDir = 'asc' | 'desc';

// --- Helpers ---

function TrendBadge({ trend, variation }: { trend: 'up' | 'down' | 'stable'; variation: number }) {
  if (trend === 'up') {
    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold bg-red-500/20 text-red-400">
        <TrendingUp className="w-3 h-3" />
        +{variation.toFixed(1)}%
      </span>
    );
  }
  if (trend === 'down') {
    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-400">
        <TrendingDown className="w-3 h-3" />
        {variation.toFixed(1)}%
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold bg-slate-500/20 text-slate-400">
      <Minus className="w-3 h-3" />
      {variation === 0 ? '0.0' : (variation > 0 ? '+' : '') + variation.toFixed(1)}%
    </span>
  );
}

function CategoryBadge({ category }: { category: string }) {
  const colors: Record<string, string> = {
    'Fruits & Légumes': 'bg-green-500/20 text-green-400',
    'Viandes': 'bg-rose-500/20 text-rose-400',
    'Poissons': 'bg-cyan-500/20 text-cyan-400',
    'Épicerie': 'bg-amber-500/20 text-amber-400',
    'Produits laitiers': 'bg-blue-500/20 text-blue-400',
  };
  return (
    <span className={`inline-block px-2 py-0.5 rounded-full text-[11px] font-medium ${colors[category] || 'bg-slate-500/20 text-slate-400'}`}>
      {category}
    </span>
  );
}

// --- Main Component ---

export default function Mercuriale() {
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<Category>('Tous');
  const [sortKey, setSortKey] = useState<SortKey>('name');
  const [sortDir, setSortDir] = useState<SortDir>('asc');

  // --- Stats ---

  const stats = useMemo(() => {
    const ups = DEMO_DATA.filter((d) => d.trend === 'up').length;
    const downs = DEMO_DATA.filter((d) => d.trend === 'down').length;
    const stables = DEMO_DATA.filter((d) => d.trend === 'stable').length;
    const avgVariation = DEMO_DATA.reduce((sum, d) => sum + d.variation, 0) / DEMO_DATA.length;
    return { ups, downs, stables, avgVariation, total: DEMO_DATA.length };
  }, []);

  // --- Sorting / Filtering ---

  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortKey(key);
      setSortDir(key === 'name' ? 'asc' : 'desc');
    }
  };

  const filteredRows = useMemo(() => {
    let rows = [...DEMO_DATA];

    // Category filter
    if (selectedCategory !== 'Tous') {
      rows = rows.filter((r) => r.category === selectedCategory);
    }

    // Search filter
    if (search.trim()) {
      const q = search.toLowerCase();
      rows = rows.filter(
        (r) =>
          r.name.toLowerCase().includes(q) ||
          r.category.toLowerCase().includes(q) ||
          r.supplier.toLowerCase().includes(q)
      );
    }

    // Sort
    rows.sort((a, b) => {
      let cmp = 0;
      if (sortKey === 'name') {
        cmp = a.name.localeCompare(b.name, 'fr');
      } else if (sortKey === 'currentPrice') {
        cmp = a.currentPrice - b.currentPrice;
      } else {
        cmp = a.variation - b.variation;
      }
      return sortDir === 'asc' ? cmp : -cmp;
    });

    return rows;
  }, [search, selectedCategory, sortKey, sortDir]);

  const SortIcon = ({ col }: { col: SortKey }) => (
    <span className={`ml-1 inline-block ${sortKey === col ? 'text-blue-400' : 'text-slate-600'}`}>
      {sortKey === col && sortDir === 'desc' ? '\u25BC' : '\u25B2'}
    </span>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-600/20 rounded-xl">
            <History className="w-6 h-6 text-blue-400" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white">Mercuriale</h1>
            <p className="text-sm text-slate-400">Suivi des prix du march&eacute; en temps r&eacute;el</p>
          </div>
        </div>
        <div className="flex items-center gap-2 text-sm text-slate-400">
          <CalendarDays className="w-4 h-4" />
          Derni&egrave;re mise &agrave; jour : {new Date(LAST_UPDATE).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-4">
          <div className="text-sm text-slate-400 mb-1">Produits suivis</div>
          <div className="text-2xl font-bold text-white">{stats.total}</div>
        </div>
        <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-4">
          <div className="text-sm text-slate-400 mb-1 flex items-center gap-1">
            <TrendingUp className="w-3.5 h-3.5 text-red-400" /> En hausse
          </div>
          <div className="text-2xl font-bold text-red-400">{stats.ups}</div>
        </div>
        <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-4">
          <div className="text-sm text-slate-400 mb-1 flex items-center gap-1">
            <TrendingDown className="w-3.5 h-3.5 text-emerald-400" /> En baisse
          </div>
          <div className="text-2xl font-bold text-emerald-400">{stats.downs}</div>
        </div>
        <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-4">
          <div className="text-sm text-slate-400 mb-1">Variation moyenne</div>
          <div className={`text-2xl font-bold ${stats.avgVariation > 0 ? 'text-red-400' : 'text-emerald-400'}`}>
            {stats.avgVariation > 0 ? '+' : ''}{stats.avgVariation.toFixed(1)}%
          </div>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-4">
        <div className="flex flex-col md:flex-row md:items-center gap-3">
          {/* Search */}
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Rechercher un ingr&eacute;dient..."
              className="w-full pl-9 pr-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-sm text-white placeholder-slate-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Category filter */}
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-slate-500" />
            <div className="flex flex-wrap gap-1.5">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                    selectedCategory === cat
                      ? 'bg-blue-600 text-white'
                      : 'bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-slate-300'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Price Table */}
      <div className="bg-slate-900/50 border border-slate-800 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left border-b border-slate-800 bg-slate-900/80">
                <th
                  className="px-4 py-3 font-semibold text-slate-300 cursor-pointer hover:text-blue-400 select-none"
                  onClick={() => handleSort('name')}
                >
                  Ingr&eacute;dient <SortIcon col="name" />
                </th>
                <th className="px-4 py-3 font-semibold text-slate-300">
                  Cat&eacute;gorie
                </th>
                <th
                  className="px-4 py-3 font-semibold text-slate-300 text-right cursor-pointer hover:text-blue-400 select-none"
                  onClick={() => handleSort('currentPrice')}
                >
                  Prix actuel <SortIcon col="currentPrice" />
                </th>
                <th className="px-4 py-3 font-semibold text-slate-300 text-right">
                  Prix pr&eacute;c&eacute;dent
                </th>
                <th
                  className="px-4 py-3 font-semibold text-slate-300 text-center cursor-pointer hover:text-blue-400 select-none"
                  onClick={() => handleSort('variation')}
                >
                  Variation <SortIcon col="variation" />
                </th>
                <th className="px-4 py-3 font-semibold text-slate-300">
                  Fournisseur
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredRows.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-12 text-center text-slate-500">
                    Aucun ingr&eacute;dient trouv&eacute;
                  </td>
                </tr>
              ) : (
                filteredRows.map((row) => (
                  <tr
                    key={row.id}
                    className="border-b border-slate-800/50 hover:bg-slate-800/30 transition-colors"
                  >
                    <td className="px-4 py-3">
                      <span className="font-medium text-white">{row.name}</span>
                    </td>
                    <td className="px-4 py-3">
                      <CategoryBadge category={row.category} />
                    </td>
                    <td className="px-4 py-3 text-right">
                      <span className="font-semibold text-white">{row.currentPrice.toFixed(2)}</span>
                      <span className="text-slate-500 ml-1">&euro;/{row.unit}</span>
                    </td>
                    <td className="px-4 py-3 text-right text-slate-400">
                      {row.previousPrice.toFixed(2)} &euro;/{row.unit}
                    </td>
                    <td className="px-4 py-3 text-center">
                      <TrendBadge trend={row.trend} variation={row.variation} />
                    </td>
                    <td className="px-4 py-3 text-slate-400 text-sm">
                      {row.supplier}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        <div className="px-4 py-3 text-xs text-slate-500 border-t border-slate-800 flex items-center justify-between">
          <span>{filteredRows.length} ingr&eacute;dient{filteredRows.length > 1 ? 's' : ''} affich&eacute;{filteredRows.length > 1 ? 's' : ''}</span>
          <span className="flex items-center gap-1">
            <Euro className="w-3 h-3" />
            Prix HT &mdash; Source : fournisseurs grossistes
          </span>
        </div>
      </div>
    </div>
  );
}
