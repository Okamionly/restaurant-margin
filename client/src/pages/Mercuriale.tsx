import { useState, useEffect } from 'react';
import { TrendingUp, TrendingDown, Minus, Search, CalendarDays, AlertTriangle, Lightbulb, ArrowRight, RefreshCw, ExternalLink } from 'lucide-react';

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

const CATEGORY_CONFIG: Record<string, { emoji: string; color: string; bg: string }> = {
  'Viandes': { emoji: '\uD83E\uDD69', color: 'text-rose-400', bg: 'bg-rose-500/10 border-rose-500/30' },
  'Poissons': { emoji: '\uD83D\uDC1F', color: 'text-cyan-400', bg: 'bg-cyan-500/10 border-cyan-500/30' },
  'Légumes': { emoji: '\uD83E\uDD66', color: 'text-green-400', bg: 'bg-green-500/10 border-green-500/30' },
  'Produits laitiers': { emoji: '\uD83E\uDDC8', color: 'text-blue-400', bg: 'bg-blue-500/10 border-blue-500/30' },
  'Épicerie': { emoji: '\uD83E\uDDC2', color: 'text-amber-400', bg: 'bg-amber-500/10 border-amber-500/30' },
};

function TrendBadge({ trend, detail }: { trend: string; detail: string | null }) {
  if (trend === 'hausse') {
    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold bg-red-500/20 text-red-400">
        <TrendingUp className="w-3 h-3" />
        {detail || 'Hausse'}
      </span>
    );
  }
  if (trend === 'baisse') {
    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-400">
        <TrendingDown className="w-3 h-3" />
        {detail || 'Baisse'}
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold bg-slate-500/20 text-slate-400">
      <Minus className="w-3 h-3" />
      Stable
    </span>
  );
}

export default function Mercuriale() {
  const [data, setData] = useState<MercurialeData | null>(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    fetchMercuriale();
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

  // Group prices by category
  const pricesByCategory = (data?.prices || []).reduce<Record<string, MercurialePrice[]>>((acc, p) => {
    if (!acc[p.category]) acc[p.category] = [];
    acc[p.category].push(p);
    return acc;
  }, {});

  // Filter by search
  const filteredCategories = Object.entries(pricesByCategory).reduce<Record<string, MercurialePrice[]>>((acc, [cat, prices]) => {
    if (!search.trim()) {
      acc[cat] = prices;
    } else {
      const q = search.toLowerCase();
      const filtered = prices.filter(p =>
        p.ingredient_name.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        (p.supplier && p.supplier.toLowerCase().includes(q))
      );
      if (filtered.length) acc[cat] = filtered;
    }
    return acc;
  }, {});

  const alertItems = (data?.alerts || []).filter(a => a.type === 'alert');
  const opportunityItems = (data?.alerts || []).filter(a => a.type === 'opportunity');

  // Stats
  const totalProducts = data?.prices?.length || 0;
  const hausses = data?.prices?.filter(p => p.trend === 'hausse').length || 0;
  const baisses = data?.prices?.filter(p => p.trend === 'baisse').length || 0;
  const stables = data?.prices?.filter(p => p.trend === 'stable').length || 0;

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-6 flex items-center justify-center h-64 text-slate-400">
        <RefreshCw className="w-6 h-6 animate-spin mr-2" />
        Chargement de la mercuriale...
      </div>
    );
  }

  if (error || !data?.publication) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex flex-col items-center justify-center h-64 text-center bg-slate-900/50 border border-slate-800 rounded-2xl">
          <CalendarDays className="w-12 h-12 text-slate-600 mb-4" />
          <p className="text-slate-400 font-medium mb-2">{error || 'Aucune mercuriale disponible'}</p>
          <p className="text-slate-500 text-sm">Les prix du march&eacute; seront publi&eacute;s prochainement par l'&eacute;quipe RestauMargin.</p>
        </div>
      </div>
    );
  }

  const pub = data.publication;
  const weekDate = new Date(pub.week_date).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' });

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-600/20 rounded-xl">
            <CalendarDays className="w-6 h-6 text-blue-400" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white">{pub.title}</h1>
            <p className="text-sm text-slate-400">
              Semaine du {weekDate}
            </p>
          </div>
        </div>
        <div className="text-xs text-slate-500 max-w-md text-right">
          Sources : {pub.sources}
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-4">
          <div className="text-sm text-slate-400 mb-1">Produits suivis</div>
          <div className="text-2xl font-bold text-white">{totalProducts}</div>
        </div>
        <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-4">
          <div className="text-sm text-slate-400 mb-1 flex items-center gap-1">
            <TrendingUp className="w-3.5 h-3.5 text-red-400" /> En hausse
          </div>
          <div className="text-2xl font-bold text-red-400">{hausses}</div>
        </div>
        <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-4">
          <div className="text-sm text-slate-400 mb-1 flex items-center gap-1">
            <TrendingDown className="w-3.5 h-3.5 text-emerald-400" /> En baisse
          </div>
          <div className="text-2xl font-bold text-emerald-400">{baisses}</div>
        </div>
        <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-4">
          <div className="text-sm text-slate-400 mb-1 flex items-center gap-1">
            <Minus className="w-3.5 h-3.5 text-slate-400" /> Stables
          </div>
          <div className="text-2xl font-bold text-slate-300">{stables}</div>
        </div>
      </div>

      {/* Search */}
      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Rechercher un produit..."
          className="w-full pl-9 pr-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-sm text-white placeholder-slate-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>

      {/* Alerts Section */}
      {alertItems.length > 0 && (
        <div className="bg-red-500/5 border border-red-500/20 rounded-2xl p-5 space-y-3">
          <h2 className="flex items-center gap-2 text-lg font-bold text-red-400">
            <AlertTriangle className="w-5 h-5" />
            Alertes Hausses
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {alertItems.map((a) => (
              <div key={a.id} className="bg-slate-900/60 border border-red-500/20 rounded-xl p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-semibold text-white">{a.ingredient_name}</span>
                  <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-red-500/20 text-red-400">
                    {a.variation}
                  </span>
                </div>
                <p className="text-sm text-slate-400 flex items-start gap-1.5">
                  <ArrowRight className="w-3.5 h-3.5 text-red-400 mt-0.5 flex-shrink-0" />
                  {a.action_text}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Opportunities Section */}
      {opportunityItems.length > 0 && (
        <div className="bg-emerald-500/5 border border-emerald-500/20 rounded-2xl p-5 space-y-3">
          <h2 className="flex items-center gap-2 text-lg font-bold text-emerald-400">
            <Lightbulb className="w-5 h-5" />
            Opportunit&eacute;s
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {opportunityItems.map((a) => (
              <div key={a.id} className="bg-slate-900/60 border border-emerald-500/20 rounded-xl p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-semibold text-white">{a.ingredient_name}</span>
                  <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-400">
                    {a.variation}
                  </span>
                </div>
                <p className="text-sm text-slate-400 flex items-start gap-1.5">
                  <ArrowRight className="w-3.5 h-3.5 text-emerald-400 mt-0.5 flex-shrink-0" />
                  {a.action_text}
                </p>
                {a.saving && (
                  <div className="mt-2 text-xs text-emerald-400 font-medium">
                    Potentiel : {a.saving}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Price Tables by Category */}
      {Object.entries(filteredCategories).map(([category, prices]) => {
        const config = CATEGORY_CONFIG[category] || { emoji: '\uD83D\uDCE6', color: 'text-slate-400', bg: 'bg-slate-500/10 border-slate-500/30' };
        return (
          <div key={category} className={`border rounded-2xl overflow-hidden ${config.bg}`}>
            <div className="px-5 py-3 border-b border-slate-800/50">
              <h2 className={`text-lg font-bold ${config.color} flex items-center gap-2`}>
                <span className="text-xl">{config.emoji}</span>
                {category}
                <span className="text-xs font-normal text-slate-500 ml-2">({prices.length} produit{prices.length > 1 ? 's' : ''})</span>
              </h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left border-b border-slate-800/50 bg-slate-900/40">
                    <th className="px-5 py-2.5 font-semibold text-slate-300">Produit</th>
                    <th className="px-5 py-2.5 font-semibold text-slate-300 text-right">Prix min</th>
                    <th className="px-5 py-2.5 font-semibold text-slate-300 text-right">Prix max</th>
                    <th className="px-5 py-2.5 font-semibold text-slate-300">Unit&eacute;</th>
                    <th className="px-5 py-2.5 font-semibold text-slate-300 text-center">Tendance</th>
                    <th className="px-5 py-2.5 font-semibold text-slate-300 hidden md:table-cell">Fournisseurs</th>
                  </tr>
                </thead>
                <tbody>
                  {prices.map((p) => (
                    <tr key={p.id} className="border-b border-slate-800/30 hover:bg-slate-800/20 transition-colors">
                      <td className="px-5 py-3 font-medium text-white">{p.ingredient_name}</td>
                      <td className="px-5 py-3 text-right font-semibold text-white">
                        {Number(p.price_min).toFixed(2)}&euro;
                      </td>
                      <td className="px-5 py-3 text-right font-semibold text-white">
                        {Number(p.price_max).toFixed(2)}&euro;
                      </td>
                      <td className="px-5 py-3 text-slate-400">/{p.unit}</td>
                      <td className="px-5 py-3 text-center">
                        <TrendBadge trend={p.trend} detail={p.trend_detail} />
                      </td>
                      <td className="px-5 py-3 text-slate-500 text-xs hidden md:table-cell">{p.supplier}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        );
      })}

      {/* Alternatives Section */}
      {(data.alternatives?.length || 0) > 0 && (
        <div className="bg-slate-900/50 border border-blue-500/20 rounded-2xl overflow-hidden">
          <div className="px-5 py-3 border-b border-slate-800/50">
            <h2 className="text-lg font-bold text-blue-400 flex items-center gap-2">
              <ExternalLink className="w-5 h-5" />
              Alternatives &eacute;conomiques
            </h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left border-b border-slate-800/50 bg-slate-900/40">
                  <th className="px-5 py-2.5 font-semibold text-slate-300">Produit co&ucirc;teux</th>
                  <th className="px-5 py-2.5 font-semibold text-slate-300 text-center">
                    <ArrowRight className="w-4 h-4 inline" />
                  </th>
                  <th className="px-5 py-2.5 font-semibold text-slate-300">Alternative</th>
                  <th className="px-5 py-2.5 font-semibold text-emerald-400 text-right">&Eacute;conomie</th>
                </tr>
              </thead>
              <tbody>
                {data.alternatives.map((alt) => (
                  <tr key={alt.id} className="border-b border-slate-800/30 hover:bg-slate-800/20 transition-colors">
                    <td className="px-5 py-3 text-white font-medium">{alt.product}</td>
                    <td className="px-5 py-3 text-center text-slate-500">
                      <ArrowRight className="w-4 h-4 inline" />
                    </td>
                    <td className="px-5 py-3 text-emerald-400 font-medium">{alt.alternative}</td>
                    <td className="px-5 py-3 text-right">
                      <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-400">
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

      {/* Footer */}
      <div className="text-center text-xs text-slate-600 pb-4">
        Donn&eacute;es publi&eacute;es par l'&eacute;quipe RestauMargin &mdash; Prix HT indicatifs &mdash; Sources : {pub.sources}
      </div>
    </div>
  );
}
