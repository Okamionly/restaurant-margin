import { useState, useEffect, useMemo } from 'react';
import { Shield, Loader2, Search, Filter, Check, X, AlertTriangle, Printer } from 'lucide-react';
import { fetchAllergenMatrix } from '../services/api';
import type { AllergenMatrixResult } from '../services/api';
import { Link } from 'react-router-dom';

const EU_ALLERGENS_DISPLAY: Record<string, string> = {
  'Gluten': 'Gluten',
  'Crustaces': 'Crustaces',
  'Oeufs': 'Oeufs',
  'Poisson': 'Poisson',
  'Arachides': 'Arachides',
  'Soja': 'Soja',
  'Lait': 'Lait',
  'Fruits a coque': 'Fruits a coque',
  'Celeri': 'Celeri',
  'Moutarde': 'Moutarde',
  'Sesame': 'Sesame',
  'Sulfites': 'Sulfites',
  'Lupin': 'Lupin',
  'Mollusques': 'Mollusques',
};

export default function AllergenMatrix() {
  const [data, setData] = useState<AllergenMatrixResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [excludeAllergen, setExcludeAllergen] = useState<string | null>(null);
  const [categoryFilter, setCategoryFilter] = useState<string>('all');

  useEffect(() => {
    fetchAllergenMatrix()
      .then(setData)
      .catch((e) => setError(e.message || 'Erreur chargement matrice'))
      .finally(() => setLoading(false));
  }, []);

  const categories = useMemo(() => {
    if (!data) return [];
    return Array.from(new Set(data.recipes.map((r) => r.category))).sort();
  }, [data]);

  const filteredRecipes = useMemo(() => {
    if (!data) return [];
    let recipes = data.recipes;

    if (search) {
      const lower = search.toLowerCase();
      recipes = recipes.filter((r) => r.name.toLowerCase().includes(lower));
    }

    if (categoryFilter !== 'all') {
      recipes = recipes.filter((r) => r.category === categoryFilter);
    }

    if (excludeAllergen) {
      recipes = recipes.filter((r) => {
        const status = r.allergens[excludeAllergen];
        return !status || !status.present;
      });
    }

    return recipes;
  }, [data, search, categoryFilter, excludeAllergen]);

  const allergenStats = useMemo(() => {
    if (!data) return {};
    const stats: Record<string, number> = {};
    for (const allergen of data.allergens) {
      stats[allergen] = data.recipes.filter((r) => r.allergens[allergen]?.present).length;
    }
    return stats;
  }, [data]);

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
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-xl font-bold text-[#111111] dark:text-white flex items-center gap-2">
            <Shield className="w-5 h-5" />
            Matrice allergenes
          </h1>
          <p className="text-sm text-[#9CA3AF] dark:text-[#737373] mt-0.5">
            {data.recipes.length} recettes x 14 allergenes majeurs UE
          </p>
        </div>
        <button
          onClick={() => window.print()}
          className="flex items-center gap-2 text-sm font-medium px-3 py-2 rounded-xl bg-[#111111] dark:bg-white text-white dark:text-[#111111] hover:bg-[#333333] dark:hover:bg-[#E5E5E5] transition-colors"
        >
          <Printer className="w-4 h-4" />
          Imprimer
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white dark:bg-[#0A0A0A] rounded-xl border border-[#E5E7EB] dark:border-[#1A1A1A] p-4">
        <div className="flex flex-wrap gap-3">
          {/* Search */}
          <div className="relative flex-1 min-w-[200px]">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#9CA3AF]" />
            <input
              type="text"
              placeholder="Rechercher une recette..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-sm rounded-lg border border-[#E5E7EB] dark:border-[#1A1A1A] bg-white dark:bg-[#0A0A0A] text-[#111111] dark:text-white focus:ring-2 focus:ring-[#111111] dark:focus:ring-white outline-none"
            />
          </div>

          {/* Category filter */}
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-3 py-2 text-sm rounded-lg border border-[#E5E7EB] dark:border-[#1A1A1A] bg-white dark:bg-[#0A0A0A] text-[#111111] dark:text-white focus:ring-2 focus:ring-[#111111] dark:focus:ring-white outline-none"
          >
            <option value="all">Toutes categories</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>

          {/* Exclude allergen filter */}
          <div className="relative">
            <select
              value={excludeAllergen || ''}
              onChange={(e) => setExcludeAllergen(e.target.value || null)}
              className="pl-8 pr-3 py-2 text-sm rounded-lg border border-[#E5E7EB] dark:border-[#1A1A1A] bg-white dark:bg-[#0A0A0A] text-[#111111] dark:text-white focus:ring-2 focus:ring-[#111111] dark:focus:ring-white outline-none"
            >
              <option value="">Filtrer sans allergene...</option>
              {data.allergens.map((a) => (
                <option key={a} value={a}>Sans {EU_ALLERGENS_DISPLAY[a] || a}</option>
              ))}
            </select>
            <Filter className="w-4 h-4 absolute left-2.5 top-1/2 -translate-y-1/2 text-[#9CA3AF]" />
          </div>

          {excludeAllergen && (
            <button
              onClick={() => setExcludeAllergen(null)}
              className="flex items-center gap-1 px-3 py-2 text-xs font-medium rounded-lg bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-800 hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors"
            >
              <X className="w-3 h-3" />
              Retirer filtre
            </button>
          )}
        </div>

        {/* Allergen stats badges */}
        <div className="flex flex-wrap gap-1.5 mt-3">
          {data.allergens.map((allergen) => {
            const count = allergenStats[allergen] || 0;
            const isExcluded = excludeAllergen === allergen;
            return (
              <button
                key={allergen}
                onClick={() => setExcludeAllergen(isExcluded ? null : allergen)}
                className={`px-2 py-0.5 rounded-full text-[10px] font-semibold border transition-colors ${
                  isExcluded
                    ? 'bg-[#111111] dark:bg-white text-white dark:text-[#111111] border-[#111111] dark:border-white'
                    : count > 0
                      ? 'bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300 border-red-200 dark:border-red-800 hover:bg-red-100 dark:hover:bg-red-900/30'
                      : 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300 border-green-200 dark:border-green-800 hover:bg-green-100 dark:hover:bg-green-900/30'
                }`}
              >
                {EU_ALLERGENS_DISPLAY[allergen] || allergen} ({count})
              </button>
            );
          })}
        </div>
      </div>

      {/* Matrix table */}
      <div className="bg-white dark:bg-[#0A0A0A] rounded-xl border border-[#E5E7EB] dark:border-[#1A1A1A] overflow-x-auto">
        <table className="w-full text-[11px] border-collapse min-w-[900px]">
          <thead>
            <tr className="border-b-2 border-[#D1D5DB] dark:border-[#333]">
              <th className="text-left py-2 px-3 font-semibold text-[#6B7280] dark:text-[#737373] sticky left-0 bg-white dark:bg-[#0A0A0A] z-10 min-w-[180px]">
                Recette
              </th>
              {data.allergens.map((allergen) => (
                <th
                  key={allergen}
                  className="text-center py-2 px-1 font-semibold text-[#6B7280] dark:text-[#737373] min-w-[60px]"
                >
                  <div className="writing-mode-vertical text-[9px] leading-tight">
                    {(EU_ALLERGENS_DISPLAY[allergen] || allergen).split(' ').map((w, i) => (
                      <div key={i}>{w}</div>
                    ))}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filteredRecipes.map((recipe, idx) => (
              <tr
                key={recipe.id}
                className={`border-b border-[#F3F4F6] dark:border-[#1A1A1A] hover:bg-[#FAFAFA] dark:hover:bg-[#0A0A0A]/80 transition-colors ${
                  idx % 2 === 0 ? '' : 'bg-[#FAFAFA]/50 dark:bg-[#0A0A0A]/30'
                }`}
              >
                <td className="py-1.5 px-3 sticky left-0 bg-white dark:bg-[#0A0A0A] z-10">
                  <Link
                    to={`/recipes/${recipe.id}`}
                    className="font-medium text-[#111111] dark:text-white hover:text-teal-600 dark:hover:text-teal-400 transition-colors"
                  >
                    {recipe.name}
                  </Link>
                  <span className="ml-1.5 text-[9px] text-[#9CA3AF] dark:text-[#737373] bg-[#F3F4F6] dark:bg-[#171717] px-1.5 py-0.5 rounded">
                    {recipe.category}
                  </span>
                </td>
                {data.allergens.map((allergen) => {
                  const status = recipe.allergens[allergen];
                  const isPresent = status?.present;
                  return (
                    <td
                      key={allergen}
                      className="text-center py-1.5 px-1"
                      title={isPresent ? `Present: ${status.sources.join(', ')}` : 'Absent'}
                    >
                      {isPresent ? (
                        <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 text-[10px] font-bold">
                          {'\u2717'}
                        </span>
                      ) : (
                        <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 text-[10px] font-bold">
                          {'\u2713'}
                        </span>
                      )}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>

        {filteredRecipes.length === 0 && (
          <div className="text-center py-8">
            <p className="text-sm text-[#9CA3AF] dark:text-[#737373]">
              {excludeAllergen
                ? `Aucune recette sans ${EU_ALLERGENS_DISPLAY[excludeAllergen] || excludeAllergen}`
                : 'Aucune recette trouvee'}
            </p>
          </div>
        )}
      </div>

      {/* Summary */}
      <div className="bg-white dark:bg-[#0A0A0A] rounded-xl border border-[#E5E7EB] dark:border-[#1A1A1A] p-4">
        <h3 className="text-xs font-bold text-[#9CA3AF] dark:text-[#737373] uppercase tracking-wider mb-2">Resume</h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="text-center p-3 rounded-lg bg-[#F3F4F6] dark:bg-[#171717]">
            <div className="text-2xl font-black text-[#111111] dark:text-white">{data.recipes.length}</div>
            <div className="text-[10px] text-[#9CA3AF] dark:text-[#737373]">Recettes</div>
          </div>
          <div className="text-center p-3 rounded-lg bg-green-50 dark:bg-green-900/20">
            <div className="text-2xl font-black text-green-600 dark:text-green-400">
              {data.recipes.filter((r) => data.allergens.every((a) => !r.allergens[a]?.present)).length}
            </div>
            <div className="text-[10px] text-green-700 dark:text-green-300">Sans allergene</div>
          </div>
          <div className="text-center p-3 rounded-lg bg-amber-50 dark:bg-amber-900/20">
            <div className="text-2xl font-black text-amber-600 dark:text-amber-400">
              {data.allergens.filter((a) => allergenStats[a] > 0).length}
            </div>
            <div className="text-[10px] text-amber-700 dark:text-amber-300">Allergenes detectes</div>
          </div>
          <div className="text-center p-3 rounded-lg bg-red-50 dark:bg-red-900/20">
            <div className="text-2xl font-black text-red-600 dark:text-red-400">
              {Object.values(allergenStats).reduce((a, b) => a + b, 0)}
            </div>
            <div className="text-[10px] text-red-700 dark:text-red-300">Occurrences totales</div>
          </div>
        </div>
      </div>

      {/* Print styles */}
      <style>{`
        @media print {
          body * { visibility: hidden; }
          .space-y-4, .space-y-4 * { visibility: visible; }
          .space-y-4 { position: absolute; left: 0; top: 0; width: 100%; }
          table { font-size: 8pt; }
          button, select, input { display: none !important; }
        }
      `}</style>
    </div>
  );
}
