import { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import {
  Shield, Loader2, Search, Filter, X, AlertTriangle, Printer,
  ChevronDown, ChevronUp, Users, CheckCircle2, XCircle, Info,
  Sparkles, PenLine, BarChart3, Eye, EyeOff
} from 'lucide-react';
import { fetchAllergenMatrix } from '../services/api';
import type { AllergenMatrixResult } from '../services/api';
import { Link } from 'react-router-dom';

// ─── 14 EU Allergens with icons ─────────────────────────────────────────────
const EU_ALLERGENS: {
  key: string;
  label: string;
  icon: string;
  description: string;
}[] = [
  { key: 'Gluten', label: 'Gluten', icon: '\uD83C\uDF3E', description: 'Ble, seigle, orge, avoine, epeautre, kamut' },
  { key: 'Crustaces', label: 'Crustaces', icon: '\uD83E\uDD90', description: 'Crevettes, crabes, homards, langoustines' },
  { key: 'Oeufs', label: 'Oeufs', icon: '\uD83E\uDD5A', description: 'Oeufs et produits a base d\'oeufs' },
  { key: 'Poisson', label: 'Poissons', icon: '\uD83D\uDC1F', description: 'Poissons et produits a base de poissons' },
  { key: 'Arachides', label: 'Arachides', icon: '\uD83E\uDD5C', description: 'Cacahuetes et produits a base de cacahuetes' },
  { key: 'Soja', label: 'Soja', icon: '\uD83C\uDF31', description: 'Soja et produits a base de soja' },
  { key: 'Lait', label: 'Lait', icon: '\uD83E\uDD5B', description: 'Lait et produits laitiers (lactose inclus)' },
  { key: 'Fruits a coque', label: 'Fruits a coque', icon: '\uD83C\uDF30', description: 'Amandes, noisettes, noix, noix de cajou, etc.' },
  { key: 'Celeri', label: 'Celeri', icon: '\uD83E\uDD6C', description: 'Celeri et produits a base de celeri' },
  { key: 'Moutarde', label: 'Moutarde', icon: '\uD83C\uDF36\uFE0F', description: 'Moutarde et produits a base de moutarde' },
  { key: 'Sesame', label: 'Sesame', icon: '\u2B50', description: 'Graines de sesame et produits a base de sesame' },
  { key: 'Sulfites', label: 'Sulfites', icon: '\uD83C\uDF77', description: 'Anhydride sulfureux et sulfites (>10mg/kg)' },
  { key: 'Lupin', label: 'Lupin', icon: '\uD83C\uDF3B', description: 'Lupin et produits a base de lupin' },
  { key: 'Mollusques', label: 'Mollusques', icon: '\uD83D\uDC19', description: 'Huitres, moules, escargots, calmars' },
];

type AllergenStatus = 'contains' | 'traces' | 'safe' | 'unknown';

function getStatus(
  allergenData: { present: boolean; sources: string[] } | undefined
): AllergenStatus {
  if (!allergenData) return 'unknown';
  if (!allergenData.present) return 'safe';
  // Check if any source mentions "traces" or "peut contenir"
  const sourcesLower = allergenData.sources.map(s => s.toLowerCase()).join(' ');
  if (sourcesLower.includes('trace') || sourcesLower.includes('peut contenir') || sourcesLower.includes('possible')) {
    return 'traces';
  }
  return 'contains';
}

function isAIDetected(allergenData: { present: boolean; sources: string[] } | undefined): boolean {
  if (!allergenData || !allergenData.sources) return false;
  const joined = allergenData.sources.join(' ').toLowerCase();
  return joined.includes('ia') || joined.includes('auto') || joined.includes('detect') || joined.includes('ai');
}

const statusConfig: Record<AllergenStatus, { bg: string; text: string; border: string; label: string; darkBg: string; darkText: string; darkBorder: string }> = {
  contains: {
    bg: 'bg-red-500',
    text: 'text-white',
    border: 'border-red-600',
    label: 'Contient',
    darkBg: 'bg-red-500',
    darkText: 'text-white',
    darkBorder: 'border-red-600',
  },
  traces: {
    bg: 'bg-amber-400',
    text: 'text-amber-900',
    border: 'border-amber-500',
    label: 'Traces',
    darkBg: 'bg-amber-500',
    darkText: 'text-amber-900',
    darkBorder: 'border-amber-600',
  },
  safe: {
    bg: 'bg-emerald-500',
    text: 'text-white',
    border: 'border-emerald-600',
    label: 'Sans',
    darkBg: 'bg-emerald-500',
    darkText: 'text-white',
    darkBorder: 'border-emerald-600',
  },
  unknown: {
    bg: 'bg-[#D1D5DB]',
    text: 'text-[#6B7280]',
    border: 'border-[#9CA3AF]',
    label: 'Inconnu',
    darkBg: 'bg-[#333]',
    darkText: 'text-[#737373]',
    darkBorder: 'border-[#444]',
  },
};

function SafetyBar({ score, total }: { score: number; total: number }) {
  const pct = Math.round((score / total) * 100);
  let color = 'bg-red-500';
  if (pct >= 80) color = 'bg-emerald-500';
  else if (pct >= 60) color = 'bg-amber-400';
  else if (pct >= 40) color = 'bg-orange-500';

  return (
    <div className="flex items-center gap-1.5 min-w-[90px]">
      <div className="flex-1 h-2 rounded-full bg-[#E5E7EB] dark:bg-[#1A1A1A] overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-500 ${color}`}
          style={{ width: `${pct}%` }}
        />
      </div>
      <span className="text-[10px] font-bold text-[#111111] dark:text-white tabular-nums w-[28px] text-right">
        {score}/{total}
      </span>
    </div>
  );
}

export default function AllergenMatrix() {
  const [data, setData] = useState<AllergenMatrixResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [highlightAllergen, setHighlightAllergen] = useState<string | null>(null);
  const [clientAllergens, setClientAllergens] = useState<string[]>([]);
  const [showClientChecker, setShowClientChecker] = useState(false);
  const [sortBy, setSortBy] = useState<'name' | 'safety' | 'category'>('name');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc');
  const [showLegend, setShowLegend] = useState(true);
  const printRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchAllergenMatrix()
      .then(setData)
      .catch((e) => setError(e.message || 'Erreur chargement matrice'))
      .finally(() => setLoading(false));
  }, []);

  const allergenKeys = EU_ALLERGENS.map(a => a.key);

  const categories = useMemo(() => {
    if (!data) return [];
    return Array.from(new Set(data.recipes.map((r) => r.category))).sort();
  }, [data]);

  // Compute safety score for a recipe (how many allergens it's free from)
  const getSafetyScore = useCallback((recipe: AllergenMatrixResult['recipes'][0]) => {
    let safe = 0;
    for (const a of allergenKeys) {
      const status = getStatus(recipe.allergens[a]);
      if (status === 'safe' || status === 'unknown') safe++;
    }
    return safe;
  }, [allergenKeys]);

  const filteredRecipes = useMemo(() => {
    if (!data) return [];
    let recipes = [...data.recipes];

    // Search filter
    if (search) {
      const lower = search.toLowerCase();
      recipes = recipes.filter((r) => r.name.toLowerCase().includes(lower));
    }

    // Category filter
    if (categoryFilter !== 'all') {
      recipes = recipes.filter((r) => r.category === categoryFilter);
    }

    // Sort
    recipes.sort((a, b) => {
      let cmp = 0;
      if (sortBy === 'name') {
        cmp = a.name.localeCompare(b.name, 'fr');
      } else if (sortBy === 'safety') {
        cmp = getSafetyScore(b) - getSafetyScore(a);
      } else if (sortBy === 'category') {
        cmp = a.category.localeCompare(b.category, 'fr');
      }
      return sortDir === 'asc' ? cmp : -cmp;
    });

    return recipes;
  }, [data, search, categoryFilter, sortBy, sortDir, getSafetyScore]);

  // Stats per allergen
  const allergenStats = useMemo(() => {
    if (!data) return {};
    const stats: Record<string, { contains: number; traces: number; safe: number; unknown: number }> = {};
    for (const a of allergenKeys) {
      stats[a] = { contains: 0, traces: 0, safe: 0, unknown: 0 };
      for (const r of data.recipes) {
        const s = getStatus(r.allergens[a]);
        stats[a][s]++;
      }
    }
    return stats;
  }, [data, allergenKeys]);

  // Count for highlighted allergen
  const highlightCount = useMemo(() => {
    if (!highlightAllergen || !data) return 0;
    return data.recipes.filter(r => {
      const s = getStatus(r.allergens[highlightAllergen]);
      return s === 'contains' || s === 'traces';
    }).length;
  }, [highlightAllergen, data]);

  // Client allergen checker results
  const clientResults = useMemo(() => {
    if (!data || clientAllergens.length === 0) return { safe: [], avoid: [] };
    const safe: typeof data.recipes = [];
    const avoid: typeof data.recipes = [];

    for (const recipe of data.recipes) {
      let isSafe = true;
      for (const allergen of clientAllergens) {
        const s = getStatus(recipe.allergens[allergen]);
        if (s === 'contains' || s === 'traces') {
          isSafe = false;
          break;
        }
      }
      if (isSafe) safe.push(recipe);
      else avoid.push(recipe);
    }
    return { safe, avoid };
  }, [data, clientAllergens]);

  const toggleSort = (col: 'name' | 'safety' | 'category') => {
    if (sortBy === col) {
      setSortDir(d => d === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(col);
      setSortDir('asc');
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const toggleClientAllergen = (allergen: string) => {
    setClientAllergens(prev =>
      prev.includes(allergen) ? prev.filter(a => a !== allergen) : [...prev, allergen]
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-6 h-6 animate-spin text-[#9CA3AF]" />
        <span className="ml-2 text-sm text-[#9CA3AF]">Chargement de la matrice allergenes...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-20">
        <AlertTriangle className="w-8 h-8 mx-auto mb-2 text-red-500" />
        <p className="text-sm text-red-500">{error}</p>
      </div>
    );
  }

  if (!data || data.recipes.length === 0) {
    return (
      <div className="text-center py-20">
        <Shield className="w-12 h-12 mx-auto mb-3 text-[#D1D5DB] dark:text-[#333]" />
        <h2 className="text-lg font-bold text-[#111111] dark:text-white mb-1">Aucune recette</h2>
        <p className="text-sm text-[#9CA3AF] dark:text-[#737373]">Creez des recettes pour voir la matrice allergenes.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4 print-container" ref={printRef}>
      {/* ── Header ────────────────────────────────────────────────────── */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-xl font-bold font-satoshi text-[#111111] dark:text-white flex items-center gap-2">
            <Shield className="w-5 h-5" />
            Matrice allergenes
          </h1>
          <p className="text-sm font-general-sans text-[#737373] dark:text-[#A3A3A3] mt-0.5">
            {data.recipes.length} recettes &times; 14 allergenes majeurs UE
          </p>
        </div>
        <div className="flex items-center gap-2 no-print">
          <button
            onClick={() => setShowClientChecker(v => !v)}
            className={`flex items-center gap-2 text-sm font-medium px-3 py-2 rounded-2xl border transition-colors ${
              showClientChecker
                ? 'bg-[#111111] dark:bg-white text-white dark:text-[#111111] border-[#111111] dark:border-white'
                : 'bg-white dark:bg-[#0A0A0A] text-[#111111] dark:text-white border-[#E5E7EB] dark:border-[#1A1A1A] hover:bg-[#F3F4F6] dark:hover:bg-[#171717]'
            }`}
          >
            <Users className="w-4 h-4" />
            Checker client
          </button>
          <button
            onClick={() => setShowLegend(v => !v)}
            className="flex items-center gap-2 text-sm font-medium px-3 py-2 rounded-2xl bg-white dark:bg-[#0A0A0A] text-[#111111] dark:text-white border border-[#E5E7EB] dark:border-[#1A1A1A] hover:bg-[#F3F4F6] dark:hover:bg-[#171717] transition-colors"
          >
            {showLegend ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            Legende
          </button>
          <button
            onClick={handlePrint}
            className="flex items-center gap-2 text-sm font-medium px-3 py-2 rounded-2xl bg-[#111111] dark:bg-white text-white dark:text-[#111111] hover:bg-[#333333] dark:hover:bg-[#E5E5E5] transition-colors"
          >
            <Printer className="w-4 h-4" />
            Imprimer la matrice
          </button>
        </div>
      </div>

      {/* ── Legend ─────────────────────────────────────────────────────── */}
      {showLegend && (
        <div className="bg-white dark:bg-[#0A0A0A] rounded-2xl border border-[#E5E7EB] dark:border-[#1A1A1A] p-4">
          <div className="flex flex-wrap items-center gap-4 text-xs">
            <span className="font-semibold text-[#6B7280] dark:text-[#737373] uppercase tracking-wider">Legende :</span>
            <div className="flex items-center gap-1.5">
              <span className="w-4 h-4 rounded bg-red-500 inline-block" />
              <span className="text-[#111111] dark:text-white">Contient</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-4 h-4 rounded bg-amber-400 inline-block" />
              <span className="text-[#111111] dark:text-white">Traces possibles</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-4 h-4 rounded bg-emerald-500 inline-block" />
              <span className="text-[#111111] dark:text-white">Sans allergene</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-4 h-4 rounded bg-[#D1D5DB] dark:bg-[#333] inline-block" />
              <span className="text-[#111111] dark:text-white">Non renseigne</span>
            </div>
            <div className="flex items-center gap-1.5 ml-4">
              <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-full bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 text-[9px] font-semibold">
                <Sparkles className="w-2.5 h-2.5" /> IA
              </span>
              <span className="text-[#111111] dark:text-white">Detection IA</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-full bg-[#F3F4F6] dark:bg-[#171717] text-[#6B7280] dark:text-[#737373] text-[9px] font-semibold">
                <PenLine className="w-2.5 h-2.5" /> Manuel
              </span>
              <span className="text-[#111111] dark:text-white">Saisie manuelle</span>
            </div>
          </div>
        </div>
      )}

      {/* ── Highlight banner ──────────────────────────────────────────── */}
      {highlightAllergen && (
        <div className="bg-amber-50 dark:bg-amber-900/20 rounded-2xl border border-amber-200 dark:border-amber-800 p-3 flex items-center justify-between no-print">
          <div className="flex items-center gap-2 text-sm">
            <AlertTriangle className="w-4 h-4 text-amber-600 dark:text-amber-400" />
            <span className="font-semibold text-amber-800 dark:text-amber-200">
              {highlightCount} recette{highlightCount > 1 ? 's' : ''} contien{highlightCount > 1 ? 'nent' : 't'} : {EU_ALLERGENS.find(a => a.key === highlightAllergen)?.icon}{' '}
              {EU_ALLERGENS.find(a => a.key === highlightAllergen)?.label}
            </span>
          </div>
          <button
            onClick={() => setHighlightAllergen(null)}
            className="p-1 rounded-lg hover:bg-amber-100 dark:hover:bg-amber-900/40 transition-colors"
          >
            <X className="w-4 h-4 text-amber-600 dark:text-amber-400" />
          </button>
        </div>
      )}

      {/* ── Client Allergen Checker ───────────────────────────────────── */}
      {showClientChecker && (
        <div className="bg-white dark:bg-[#0A0A0A] rounded-2xl border border-[#E5E7EB] dark:border-[#1A1A1A] p-4 space-y-3 no-print">
          <div className="flex items-center gap-2 mb-2">
            <Users className="w-4 h-4 text-[#111111] dark:text-white" />
            <h3 className="text-sm font-bold text-[#111111] dark:text-white">Mon client est allergique a :</h3>
          </div>
          <div className="flex flex-wrap gap-2">
            {EU_ALLERGENS.map(a => {
              const selected = clientAllergens.includes(a.key);
              return (
                <button
                  key={a.key}
                  onClick={() => toggleClientAllergen(a.key)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium border transition-all ${
                    selected
                      ? 'bg-red-500 text-white border-red-600 shadow-sm'
                      : 'bg-white dark:bg-[#0A0A0A] text-[#111111] dark:text-white border-[#E5E7EB] dark:border-[#1A1A1A] hover:bg-[#F3F4F6] dark:hover:bg-[#171717]'
                  }`}
                >
                  <span className="text-sm">{a.icon}</span>
                  {a.label}
                </button>
              );
            })}
          </div>

          {clientAllergens.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-3">
              {/* Safe recipes */}
              <div className="rounded-2xl border border-emerald-200 dark:border-emerald-800 bg-emerald-50/50 dark:bg-emerald-900/10 p-3">
                <div className="flex items-center gap-2 mb-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                  <span className="text-xs font-bold text-emerald-800 dark:text-emerald-200 uppercase tracking-wider">
                    Sans danger ({clientResults.safe.length})
                  </span>
                </div>
                <div className="space-y-1 max-h-[200px] overflow-y-auto">
                  {clientResults.safe.length === 0 ? (
                    <p className="text-xs text-emerald-600 dark:text-emerald-400 italic">Aucune recette compatible</p>
                  ) : (
                    clientResults.safe.map(r => (
                      <Link
                        key={r.id}
                        to={`/recipes/${r.id}`}
                        className="block text-xs text-emerald-800 dark:text-emerald-200 hover:text-emerald-600 dark:hover:text-emerald-300 py-0.5 transition-colors"
                      >
                        {r.name}
                        <span className="ml-1 text-[9px] text-emerald-600 dark:text-emerald-400">({r.category})</span>
                      </Link>
                    ))
                  )}
                </div>
              </div>

              {/* Avoid recipes */}
              <div className="rounded-2xl border border-red-200 dark:border-red-800 bg-red-50/50 dark:bg-red-900/10 p-3">
                <div className="flex items-center gap-2 mb-2">
                  <XCircle className="w-4 h-4 text-red-600 dark:text-red-400" />
                  <span className="text-xs font-bold text-red-800 dark:text-red-200 uppercase tracking-wider">
                    A eviter ({clientResults.avoid.length})
                  </span>
                </div>
                <div className="space-y-1 max-h-[200px] overflow-y-auto">
                  {clientResults.avoid.length === 0 ? (
                    <p className="text-xs text-red-600 dark:text-red-400 italic">Aucune recette a eviter</p>
                  ) : (
                    clientResults.avoid.map(r => (
                      <Link
                        key={r.id}
                        to={`/recipes/${r.id}`}
                        className="block text-xs text-red-800 dark:text-red-200 hover:text-red-600 dark:hover:text-red-300 py-0.5 transition-colors"
                      >
                        {r.name}
                        <span className="ml-1 text-[9px] text-red-600 dark:text-red-400">({r.category})</span>
                      </Link>
                    ))
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ── Filters ───────────────────────────────────────────────────── */}
      <div className="bg-white dark:bg-[#0A0A0A] rounded-2xl border border-[#E5E7EB] dark:border-[#1A1A1A] p-4 no-print">
        <div className="flex flex-wrap gap-3">
          {/* Search */}
          <div className="relative flex-1 min-w-[200px]">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#9CA3AF]" />
            <input
              type="text"
              placeholder="Rechercher une recette..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-sm rounded-xl border border-[#E5E7EB] dark:border-[#1A1A1A] bg-white dark:bg-[#0A0A0A] text-[#111111] dark:text-white focus:ring-2 focus:ring-[#111111] dark:focus:ring-white outline-none"
            />
          </div>

          {/* Category filter */}
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-3 py-2 text-sm rounded-xl border border-[#E5E7EB] dark:border-[#1A1A1A] bg-white dark:bg-[#0A0A0A] text-[#111111] dark:text-white focus:ring-2 focus:ring-[#111111] dark:focus:ring-white outline-none"
          >
            <option value="all">Toutes categories</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>

        {/* Allergen filter badges */}
        <div className="flex flex-wrap gap-1.5 mt-3">
          {EU_ALLERGENS.map(allergen => {
            const stats = allergenStats[allergen.key];
            const containsCount = stats ? stats.contains + stats.traces : 0;
            const isActive = highlightAllergen === allergen.key;
            return (
              <button
                key={allergen.key}
                onClick={() => setHighlightAllergen(isActive ? null : allergen.key)}
                title={allergen.description}
                className={`flex items-center gap-1 px-2.5 py-1 rounded-xl text-[11px] font-semibold border transition-all ${
                  isActive
                    ? 'bg-[#111111] dark:bg-white text-white dark:text-[#111111] border-[#111111] dark:border-white shadow-sm scale-105'
                    : containsCount > 0
                      ? 'bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300 border-red-200 dark:border-red-800 hover:bg-red-100 dark:hover:bg-red-900/30'
                      : 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800 hover:bg-emerald-100 dark:hover:bg-emerald-900/30'
                }`}
              >
                <span>{allergen.icon}</span>
                {allergen.label}
                <span className="ml-0.5 opacity-70">({containsCount})</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* ── Matrix Grid ───────────────────────────────────────────────── */}
      <div className="bg-white dark:bg-[#0A0A0A] rounded-2xl border border-[#E5E7EB] dark:border-[#1A1A1A] overflow-x-auto print-matrix">
        <table className="w-full text-[11px] border-collapse min-w-[1000px]">
          <thead>
            <tr className="border-b-2 border-[#E5E7EB] dark:border-[#333]">
              {/* Recipe column header */}
              <th
                className="text-left py-3 px-3 font-semibold text-[#6B7280] dark:text-[#737373] sticky left-0 bg-white dark:bg-[#0A0A0A] z-10 min-w-[200px] cursor-pointer hover:text-[#111111] dark:hover:text-white transition-colors"
                onClick={() => toggleSort('name')}
              >
                <div className="flex items-center gap-1">
                  Recette
                  {sortBy === 'name' && (sortDir === 'asc' ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />)}
                </div>
              </th>

              {/* Safety score column */}
              <th
                className="text-center py-3 px-2 font-semibold text-[#6B7280] dark:text-[#737373] min-w-[100px] cursor-pointer hover:text-[#111111] dark:hover:text-white transition-colors"
                onClick={() => toggleSort('safety')}
              >
                <div className="flex items-center justify-center gap-1">
                  <BarChart3 className="w-3 h-3" />
                  Score
                  {sortBy === 'safety' && (sortDir === 'asc' ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />)}
                </div>
              </th>

              {/* Allergen columns */}
              {EU_ALLERGENS.map(allergen => {
                const isHighlighted = highlightAllergen === allergen.key;
                return (
                  <th
                    key={allergen.key}
                    className={`text-center py-3 px-1 min-w-[52px] cursor-pointer transition-all ${
                      isHighlighted
                        ? 'bg-amber-50 dark:bg-amber-900/20'
                        : 'hover:bg-[#F3F4F6] dark:hover:bg-[#171717]'
                    }`}
                    onClick={() => setHighlightAllergen(isHighlighted ? null : allergen.key)}
                    title={`${allergen.label}: ${allergen.description}`}
                  >
                    <div className="flex flex-col items-center gap-0.5">
                      <span className="text-base leading-none">{allergen.icon}</span>
                      <span className={`text-[8px] font-bold leading-tight ${
                        isHighlighted ? 'text-amber-700 dark:text-amber-300' : 'text-[#6B7280] dark:text-[#737373]'
                      }`}>
                        {allergen.label.length > 7 ? allergen.label.substring(0, 6) + '.' : allergen.label}
                      </span>
                    </div>
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody>
            {filteredRecipes.map((recipe, idx) => {
              const safetyScore = getSafetyScore(recipe);
              // Check if recipe matches highlight
              const matchesHighlight = highlightAllergen
                ? (() => {
                    const s = getStatus(recipe.allergens[highlightAllergen]);
                    return s === 'contains' || s === 'traces';
                  })()
                : false;

              return (
                <tr
                  key={recipe.id}
                  className={`border-b border-[#F3F4F6] dark:border-[#1A1A1A] transition-all ${
                    highlightAllergen && !matchesHighlight
                      ? 'opacity-30'
                      : ''
                  } ${
                    matchesHighlight
                      ? 'bg-amber-50/50 dark:bg-amber-900/10'
                      : idx % 2 === 0
                        ? 'bg-white dark:bg-[#0A0A0A]'
                        : 'bg-[#FAFAFA] dark:bg-[#0A0A0A]/60'
                  } hover:bg-[#F3F4F6] dark:hover:bg-[#171717]`}
                >
                  {/* Recipe name */}
                  <td className="py-2 px-3 sticky left-0 bg-inherit z-10">
                    <Link
                      to={`/recipes/${recipe.id}`}
                      className="font-medium text-[#111111] dark:text-white hover:text-teal-600 dark:hover:text-teal-400 transition-colors text-xs"
                    >
                      {recipe.name}
                    </Link>
                    <span className="ml-1.5 text-[9px] text-[#9CA3AF] dark:text-[#737373] bg-[#F3F4F6] dark:bg-[#171717] px-1.5 py-0.5 rounded">
                      {recipe.category}
                    </span>
                  </td>

                  {/* Safety score */}
                  <td className="py-2 px-2">
                    <SafetyBar score={safetyScore} total={14} />
                  </td>

                  {/* Allergen cells */}
                  {EU_ALLERGENS.map(allergen => {
                    const allergenData = recipe.allergens[allergen.key];
                    const status = getStatus(allergenData);
                    const cfg = statusConfig[status];
                    const isHighlightCol = highlightAllergen === allergen.key;
                    const aiDetected = isAIDetected(allergenData);
                    const sources = allergenData?.sources?.join(', ') || '';

                    return (
                      <td
                        key={allergen.key}
                        className={`text-center py-2 px-1 transition-all ${
                          isHighlightCol ? 'bg-amber-50/50 dark:bg-amber-900/10' : ''
                        }`}
                        title={`${allergen.label}: ${cfg.label}${sources ? ` (${sources})` : ''}`}
                      >
                        <div className="flex flex-col items-center gap-0.5">
                          <span
                            className={`inline-flex items-center justify-center w-6 h-6 rounded-lg text-[10px] font-bold transition-transform hover:scale-110 ${cfg.bg} ${cfg.text}`}
                          >
                            {status === 'contains' && '\u2717'}
                            {status === 'traces' && '~'}
                            {status === 'safe' && '\u2713'}
                            {status === 'unknown' && '?'}
                          </span>
                          {/* AI detection badge */}
                          {allergenData?.present && (
                            <span
                              className={`inline-flex items-center gap-0.5 text-[7px] font-semibold leading-none ${
                                aiDetected
                                  ? 'text-purple-600 dark:text-purple-400'
                                  : 'text-[#9CA3AF] dark:text-[#555]'
                              }`}
                            >
                              {aiDetected ? (
                                <><Sparkles className="w-2 h-2" />IA</>
                              ) : (
                                <><PenLine className="w-2 h-2" /></>
                              )}
                            </span>
                          )}
                        </div>
                      </td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>

        {filteredRecipes.length === 0 && (
          <div className="text-center py-8">
            <p className="text-sm text-[#9CA3AF] dark:text-[#737373]">
              Aucune recette trouvee
            </p>
          </div>
        )}
      </div>

      {/* ── Summary Stats ─────────────────────────────────────────────── */}
      <div className="bg-white dark:bg-[#0A0A0A] rounded-2xl border border-[#E5E7EB] dark:border-[#1A1A1A] p-4">
        <h3 className="text-xs font-bold text-[#9CA3AF] dark:text-[#737373] uppercase tracking-wider mb-3">Resume</h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="text-center p-3 rounded-2xl bg-[#F3F4F6] dark:bg-[#171717]">
            <div className="text-2xl font-black text-[#111111] dark:text-white">{data.recipes.length}</div>
            <div className="text-[10px] text-[#9CA3AF] dark:text-[#737373]">Recettes analysees</div>
          </div>
          <div className="text-center p-3 rounded-2xl bg-emerald-50 dark:bg-emerald-900/20">
            <div className="text-2xl font-black text-emerald-600 dark:text-emerald-400">
              {data.recipes.filter((r) => allergenKeys.every((a) => {
                const s = getStatus(r.allergens[a]);
                return s === 'safe' || s === 'unknown';
              })).length}
            </div>
            <div className="text-[10px] text-emerald-700 dark:text-emerald-300">Sans aucun allergene</div>
          </div>
          <div className="text-center p-3 rounded-2xl bg-amber-50 dark:bg-amber-900/20">
            <div className="text-2xl font-black text-amber-600 dark:text-amber-400">
              {allergenKeys.filter((a) => {
                const s = allergenStats[a];
                return s && (s.contains > 0 || s.traces > 0);
              }).length}
            </div>
            <div className="text-[10px] text-amber-700 dark:text-amber-300">Allergenes detectes</div>
          </div>
          <div className="text-center p-3 rounded-2xl bg-red-50 dark:bg-red-900/20">
            <div className="text-2xl font-black text-red-600 dark:text-red-400">
              {allergenKeys.reduce((total, a) => {
                const s = allergenStats[a];
                return total + (s ? s.contains + s.traces : 0);
              }, 0)}
            </div>
            <div className="text-[10px] text-red-700 dark:text-red-300">Occurrences totales</div>
          </div>
        </div>
      </div>

      {/* ── Allergen Breakdown ────────────────────────────────────────── */}
      <div className="bg-white dark:bg-[#0A0A0A] rounded-2xl border border-[#E5E7EB] dark:border-[#1A1A1A] p-4">
        <h3 className="text-xs font-bold text-[#9CA3AF] dark:text-[#737373] uppercase tracking-wider mb-3">Repartition par allergene</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-7 gap-2">
          {EU_ALLERGENS.map(allergen => {
            const stats = allergenStats[allergen.key];
            if (!stats) return null;
            const total = data.recipes.length;
            const containsPct = Math.round((stats.contains / total) * 100);
            const tracesPct = Math.round((stats.traces / total) * 100);

            return (
              <div
                key={allergen.key}
                className="rounded-xl border border-[#E5E7EB] dark:border-[#1A1A1A] p-2.5 hover:border-[#111111] dark:hover:border-white transition-colors cursor-pointer"
                onClick={() => setHighlightAllergen(highlightAllergen === allergen.key ? null : allergen.key)}
              >
                <div className="flex items-center gap-1.5 mb-1.5">
                  <span className="text-sm">{allergen.icon}</span>
                  <span className="text-[10px] font-bold text-[#111111] dark:text-white truncate">{allergen.label}</span>
                </div>
                <div className="flex gap-0.5 h-2 rounded-full overflow-hidden bg-emerald-100 dark:bg-emerald-900/30">
                  {containsPct > 0 && (
                    <div className="bg-red-500 rounded-full" style={{ width: `${containsPct}%` }} />
                  )}
                  {tracesPct > 0 && (
                    <div className="bg-amber-400 rounded-full" style={{ width: `${tracesPct}%` }} />
                  )}
                </div>
                <div className="flex justify-between mt-1">
                  <span className="text-[8px] text-red-600 dark:text-red-400 font-semibold">{stats.contains} contient</span>
                  <span className="text-[8px] text-amber-600 dark:text-amber-400 font-semibold">{stats.traces} traces</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ── Print styles ──────────────────────────────────────────────── */}
      <style>{`
        @media print {
          /* Hide everything except the matrix container */
          body * {
            visibility: hidden !important;
          }
          .print-container,
          .print-container * {
            visibility: visible !important;
          }
          .print-container {
            position: absolute !important;
            left: 0 !important;
            top: 0 !important;
            width: 100% !important;
            padding: 0 !important;
          }
          /* Hide interactive elements */
          .no-print,
          button,
          select,
          input {
            display: none !important;
          }
          /* Optimize table for print */
          .print-matrix {
            overflow: visible !important;
            border: 2px solid #000 !important;
            border-radius: 0 !important;
          }
          .print-matrix table {
            font-size: 7pt !important;
            min-width: unset !important;
            width: 100% !important;
          }
          .print-matrix th,
          .print-matrix td {
            border: 0.5px solid #ccc !important;
            padding: 2px 3px !important;
          }
          .print-matrix th {
            background: #f0f0f0 !important;
            color: #000 !important;
            font-weight: bold !important;
          }
          /* Force color printing for cells */
          .bg-red-500 { background: #ef4444 !important; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
          .bg-amber-400 { background: #fbbf24 !important; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
          .bg-emerald-500 { background: #10b981 !important; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
          /* Page setup */
          @page {
            size: landscape;
            margin: 0.5cm;
          }
          /* Print header */
          h1 { font-size: 14pt !important; }
          /* Hide dark mode styling artifacts */
          [class*="dark:"] { color: #000 !important; background: transparent !important; }
          /* Ensure rounded-2xl sections visible */
          .rounded-2xl {
            border-radius: 0 !important;
            page-break-inside: avoid;
          }
        }
      `}</style>
    </div>
  );
}
