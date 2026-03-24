import { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { Link } from 'react-router-dom';
import {
  Eye,
  TrendingUp,
  ChefHat,
  DollarSign,
  Printer,
  EyeOff,
  ArrowUpDown,
  Filter,
  Star,
  ToggleLeft,
  ToggleRight,
  X,
  BarChart3,
  Utensils,
} from 'lucide-react';
import { fetchRecipes } from '../services/api';
import type { Recipe } from '../types';
import { RECIPE_CATEGORIES, ALLERGENS } from '../types';

// --- Category display config ---
const CATEGORY_ORDER = ['Entree', 'Plat', 'Dessert', 'Accompagnement', 'Boisson'] as const;
const CATEGORY_LABELS: Record<string, string> = {
  'Entree': 'Entrees',
  'Entrée': 'Entrees',
  'Plat': 'Plats',
  'Dessert': 'Desserts',
  'Accompagnement': 'Accompagnements',
  'Boisson': 'Boissons',
};
const CATEGORY_ICONS: Record<string, string> = {
  'Entree': '',
  'Entrée': '',
  'Plat': '',
  'Dessert': '',
  'Accompagnement': '',
  'Boisson': '',
};

function getCategoryLabel(cat: string) {
  return CATEGORY_LABELS[cat] || cat;
}

type SortKey = 'name' | 'price' | 'margin';

// --- Decorative separator ---
function MenuDivider() {
  return (
    <div className="flex items-center justify-center my-1 print:my-2" aria-hidden>
      <div className="h-px flex-1 bg-amber-300/40 dark:bg-amber-700/30 print:bg-amber-800/20" />
      <svg viewBox="0 0 24 12" className="w-8 h-4 mx-3 text-amber-400 dark:text-amber-600 print:text-amber-800/40" fill="currentColor">
        <path d="M12 0C8 0 5 3 2 6c3 3 6 6 10 6s7-3 10-6c-3-3-6-6-10-6zm0 10a4 4 0 110-8 4 4 0 010 8z" />
      </svg>
      <div className="h-px flex-1 bg-amber-300/40 dark:bg-amber-700/30 print:bg-amber-800/20" />
    </div>
  );
}

function MenuOrnament() {
  return (
    <div className="flex items-center justify-center py-2 print:py-1" aria-hidden>
      <span className="text-amber-400/60 dark:text-amber-600/60 print:text-amber-800/30 text-lg tracking-[0.5em] font-serif select-none">
        &#10043; &#10043; &#10043;
      </span>
    </div>
  );
}

// --- Helper: collect all allergens from a recipe ---
function getRecipeAllergens(recipe: Recipe): string[] {
  const set = new Set<string>();
  recipe.ingredients?.forEach((ri) => {
    ri.ingredient?.allergens?.forEach((a) => set.add(a));
  });
  return Array.from(set);
}

export default function MenuBuilder() {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);

  // UI toggles
  const [showPrices, setShowPrices] = useState(true);
  const [showMargins, setShowMargins] = useState(false);
  const [sortBy, setSortBy] = useState<SortKey>('name');
  const [excludedAllergens, setExcludedAllergens] = useState<Set<string>>(new Set());
  const [allergenFilterOpen, setAllergenFilterOpen] = useState(false);

  // Menu builder: toggled dishes + menu du jour mode
  const [disabledDishes, setDisabledDishes] = useState<Set<number>>(new Set());
  const [menuDuJourMode, setMenuDuJourMode] = useState(false);
  const [menuDuJourIds, setMenuDuJourIds] = useState<Set<number>>(new Set());

  // Stats panel visibility
  const [showStats, setShowStats] = useState(true);

  const printRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchRecipes()
      .then(setRecipes)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  // --- Allergen filter ---
  const toggleAllergen = useCallback((a: string) => {
    setExcludedAllergens((prev) => {
      const next = new Set(prev);
      if (next.has(a)) next.delete(a);
      else next.add(a);
      return next;
    });
  }, []);

  // --- Dish toggles ---
  const toggleDish = useCallback((id: number) => {
    setDisabledDishes((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }, []);

  const toggleMenuDuJour = useCallback((id: number) => {
    setMenuDuJourIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }, []);

  // --- Filtered + sorted recipes ---
  const activeRecipes = useMemo(() => {
    let list = recipes.filter((r) => !disabledDishes.has(r.id));
    // Filter by allergens
    if (excludedAllergens.size > 0) {
      list = list.filter((r) => {
        const ra = getRecipeAllergens(r);
        return !ra.some((a) => excludedAllergens.has(a));
      });
    }
    return list;
  }, [recipes, disabledDishes, excludedAllergens]);

  // --- Grouped by category ---
  const grouped = useMemo(() => {
    const map = new Map<string, Recipe[]>();
    RECIPE_CATEGORIES.forEach((cat) => map.set(cat, []));
    activeRecipes.forEach((r) => {
      const list = map.get(r.category) || [];
      list.push(r);
      map.set(r.category, list);
    });

    const result: {
      category: string;
      recipes: Recipe[];
      avgMargin: number;
      avgPrice: number;
      minPrice: number;
      maxPrice: number;
      totalRevenue: number;
    }[] = [];

    // Use RECIPE_CATEGORIES order to preserve display order
    RECIPE_CATEGORIES.forEach((category) => {
      const recipeList = map.get(category) || [];
      if (recipeList.length > 0) {
        // Sort
        const sorted = [...recipeList].sort((a, b) => {
          if (sortBy === 'price') return a.sellingPrice - b.sellingPrice;
          if (sortBy === 'margin') return b.margin.marginPercent - a.margin.marginPercent;
          return a.name.localeCompare(b.name, 'fr');
        });
        const avgMargin = sorted.reduce((s, r) => s + r.margin.marginPercent, 0) / sorted.length;
        const avgPrice = sorted.reduce((s, r) => s + r.sellingPrice, 0) / sorted.length;
        const prices = sorted.map((r) => r.sellingPrice);
        result.push({
          category,
          recipes: sorted,
          avgMargin,
          avgPrice,
          minPrice: Math.min(...prices),
          maxPrice: Math.max(...prices),
          totalRevenue: sorted.reduce((s, r) => s + r.sellingPrice, 0),
        });
      }
    });
    return result;
  }, [activeRecipes, sortBy]);

  // --- Menu du jour filtered ---
  const menuDuJourGroups = useMemo(() => {
    if (!menuDuJourMode) return grouped;
    return grouped
      .map((g) => ({
        ...g,
        recipes: g.recipes.filter((r) => menuDuJourIds.has(r.id)),
      }))
      .filter((g) => g.recipes.length > 0);
  }, [grouped, menuDuJourMode, menuDuJourIds]);

  const displayGroups = menuDuJourMode ? menuDuJourGroups : grouped;

  // --- Global stats ---
  const totalItems = activeRecipes.length;
  const globalAvgMargin =
    totalItems > 0 ? activeRecipes.reduce((s, r) => s + r.margin.marginPercent, 0) / totalItems : 0;
  const globalAvgPrice =
    totalItems > 0 ? activeRecipes.reduce((s, r) => s + r.sellingPrice, 0) / totalItems : 0;
  const allPrices = activeRecipes.map((r) => r.sellingPrice);
  const globalMinPrice = allPrices.length > 0 ? Math.min(...allPrices) : 0;
  const globalMaxPrice = allPrices.length > 0 ? Math.max(...allPrices) : 0;
  const estimatedCoversPerService = 40; // typical restaurant
  const revenuePotentialPerService =
    totalItems > 0 ? globalAvgPrice * estimatedCoversPerService : 0;

  // --- Print ---
  const handlePrint = useCallback(() => {
    window.print();
  }, []);

  if (loading)
    return (
      <div className="text-center py-12 text-slate-500 dark:text-slate-400">Chargement...</div>
    );

  return (
    <div className="max-w-7xl mx-auto">
      {/* ========== TOOLBAR (hidden on print) ========== */}
      <div className="print:hidden mb-6">
        {/* Header row */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
          <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
            <Utensils className="w-6 h-6 text-amber-600" />
            La Carte
          </h2>
          <div className="flex flex-wrap items-center gap-2">
            {/* Print */}
            <button
              onClick={handlePrint}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-amber-600 hover:bg-amber-700 text-white text-sm font-medium transition-colors"
            >
              <Printer className="w-4 h-4" />
              Imprimer le menu
            </button>
            {/* Stats toggle */}
            <button
              onClick={() => setShowStats((v) => !v)}
              className="inline-flex items-center gap-2 px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-200 text-sm hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
            >
              <BarChart3 className="w-4 h-4" />
              {showStats ? 'Masquer stats' : 'Afficher stats'}
            </button>
          </div>
        </div>

        {/* Filter / Sort bar */}
        <div className="flex flex-wrap items-center gap-3 bg-white dark:bg-slate-800 rounded-lg shadow px-4 py-3">
          {/* Sort */}
          <div className="flex items-center gap-2 text-sm">
            <ArrowUpDown className="w-4 h-4 text-slate-400" />
            <span className="text-slate-500 dark:text-slate-400">Tri :</span>
            {(['name', 'price', 'margin'] as SortKey[]).map((key) => (
              <button
                key={key}
                onClick={() => setSortBy(key)}
                className={`px-2 py-1 rounded text-xs font-medium transition-colors ${
                  sortBy === key
                    ? 'bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300'
                    : 'text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200'
                }`}
              >
                {key === 'name' ? 'Nom' : key === 'price' ? 'Prix' : 'Marge'}
              </button>
            ))}
          </div>

          <div className="h-5 w-px bg-slate-200 dark:bg-slate-700" />

          {/* Show/hide prices */}
          <button
            onClick={() => setShowPrices((v) => !v)}
            className="inline-flex items-center gap-1.5 text-sm text-slate-600 dark:text-slate-300 hover:text-slate-800 dark:hover:text-slate-100"
          >
            {showPrices ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
            Prix
          </button>

          {/* Show/hide margins */}
          <button
            onClick={() => setShowMargins((v) => !v)}
            className="inline-flex items-center gap-1.5 text-sm text-slate-600 dark:text-slate-300 hover:text-slate-800 dark:hover:text-slate-100"
          >
            {showMargins ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
            Marges
          </button>

          <div className="h-5 w-px bg-slate-200 dark:bg-slate-700" />

          {/* Allergen filter */}
          <div className="relative">
            <button
              onClick={() => setAllergenFilterOpen((v) => !v)}
              className={`inline-flex items-center gap-1.5 text-sm px-2 py-1 rounded transition-colors ${
                excludedAllergens.size > 0
                  ? 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-800 dark:hover:text-slate-100'
              }`}
            >
              <Filter className="w-4 h-4" />
              Allergenes{excludedAllergens.size > 0 && ` (${excludedAllergens.size})`}
            </button>
            {allergenFilterOpen && (
              <div className="absolute z-50 top-full left-0 mt-1 bg-white dark:bg-slate-800 rounded-lg shadow-xl border border-slate-200 dark:border-slate-700 p-3 w-64">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                    Exclure les allergenes
                  </span>
                  <button onClick={() => setAllergenFilterOpen(false)}>
                    <X className="w-4 h-4 text-slate-400 hover:text-slate-600" />
                  </button>
                </div>
                <div className="grid grid-cols-2 gap-1 max-h-60 overflow-y-auto">
                  {ALLERGENS.map((a) => (
                    <label
                      key={a}
                      className="flex items-center gap-2 px-2 py-1.5 rounded hover:bg-slate-50 dark:hover:bg-slate-700/50 cursor-pointer text-sm"
                    >
                      <input
                        type="checkbox"
                        checked={excludedAllergens.has(a)}
                        onChange={() => toggleAllergen(a)}
                        className="rounded border-slate-300 text-red-600 focus:ring-red-500"
                      />
                      <span className="text-slate-700 dark:text-slate-300">{a}</span>
                    </label>
                  ))}
                </div>
                {excludedAllergens.size > 0 && (
                  <button
                    onClick={() => setExcludedAllergens(new Set())}
                    className="mt-2 text-xs text-red-600 hover:text-red-700"
                  >
                    Reinitialiser
                  </button>
                )}
              </div>
            )}
          </div>

          <div className="h-5 w-px bg-slate-200 dark:bg-slate-700" />

          {/* Menu du jour */}
          <button
            onClick={() => setMenuDuJourMode((v) => !v)}
            className={`inline-flex items-center gap-1.5 text-sm px-3 py-1 rounded-full font-medium transition-colors ${
              menuDuJourMode
                ? 'bg-amber-500 text-white'
                : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600'
            }`}
          >
            <Star className="w-4 h-4" />
            Menu du jour
          </button>
        </div>
      </div>

      {/* ========== STATS PANEL (hidden on print) ========== */}
      {showStats && (
        <div className="print:hidden grid grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
          <StatCard
            label="Total plats"
            value={String(totalItems)}
            icon={<ChefHat className="w-5 h-5 text-white" />}
            iconBg="bg-blue-600"
          />
          <StatCard
            label="Marge moy."
            value={`${globalAvgMargin.toFixed(1)}%`}
            valueColor={
              globalAvgMargin >= 70
                ? 'text-green-600'
                : globalAvgMargin >= 60
                ? 'text-amber-600'
                : 'text-red-600'
            }
            icon={<TrendingUp className="w-5 h-5 text-white" />}
            iconBg="bg-green-600"
          />
          <StatCard
            label="Prix moyen"
            value={`${globalAvgPrice.toFixed(2)} \u20AC`}
            icon={<DollarSign className="w-5 h-5 text-white" />}
            iconBg="bg-purple-600"
          />
          <StatCard
            label="Fourchette prix"
            value={`${globalMinPrice.toFixed(0)} - ${globalMaxPrice.toFixed(0)} \u20AC`}
            icon={<ArrowUpDown className="w-5 h-5 text-white" />}
            iconBg="bg-cyan-600"
          />
          <StatCard
            label={`CA / service (~${estimatedCoversPerService} cvts)`}
            value={`${revenuePotentialPerService.toFixed(0)} \u20AC`}
            icon={<BarChart3 className="w-5 h-5 text-white" />}
            iconBg="bg-amber-600"
          />
        </div>
      )}

      {/* ========== MENU CARD ========== */}
      <div ref={printRef}>
        {/* Print header (visible only on print) */}
        <div className="hidden print:block text-center mb-6">
          <div className="text-4xl font-serif font-bold text-slate-800 tracking-wide">La Carte</div>
          <MenuOrnament />
        </div>

        {displayGroups.length === 0 ? (
          <div className="text-center py-16 bg-white dark:bg-slate-800 rounded-lg shadow print:shadow-none">
            <ChefHat className="w-16 h-16 mx-auto text-slate-300 dark:text-slate-600 mb-4" />
            <h3 className="text-xl font-semibold text-slate-600 dark:text-slate-300 mb-2">
              Aucun plat sur la carte
            </h3>
            <p className="text-slate-400 dark:text-slate-500">
              Creez des recettes pour construire votre carte.
            </p>
          </div>
        ) : (
          <div
            className={`bg-white dark:bg-slate-800 rounded-xl shadow-lg overflow-hidden
            border border-amber-100 dark:border-slate-700
            print:shadow-none print:border-none print:rounded-none`}
          >
            {/* Screen menu header */}
            <div className="print:hidden bg-gradient-to-b from-amber-50 to-white dark:from-slate-800 dark:to-slate-800 text-center py-8 px-6 border-b border-amber-100 dark:border-slate-700">
              <h2 className="text-3xl font-serif font-bold text-slate-800 dark:text-slate-100 tracking-wide">
                La Carte
              </h2>
              <MenuOrnament />
              {menuDuJourMode && (
                <span className="inline-flex items-center gap-1 mt-2 px-3 py-1 bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-300 text-sm rounded-full font-medium">
                  <Star className="w-3.5 h-3.5" />
                  Menu du jour
                </span>
              )}
            </div>

            {/* Categories */}
            <div className="px-6 sm:px-10 py-6 print:px-4 print:py-2 space-y-8 print:space-y-4">
              {displayGroups.map((group, gi) => (
                <div key={group.category}>
                  {/* Category header */}
                  <div className="text-center mb-4 print:mb-2">
                    <h3 className="text-xl sm:text-2xl font-serif font-bold text-amber-800 dark:text-amber-400 tracking-wider uppercase print:text-lg">
                      {getCategoryLabel(group.category)}
                    </h3>
                    {/* Category stats (screen only) */}
                    <div className="print:hidden flex items-center justify-center gap-3 mt-1 text-xs text-slate-400 dark:text-slate-500">
                      <span>{group.recipes.length} plat{group.recipes.length > 1 ? 's' : ''}</span>
                      <span>&middot;</span>
                      <span>Moy. {group.avgPrice.toFixed(2)} &euro;</span>
                      {showMargins && (
                        <>
                          <span>&middot;</span>
                          <span>Marge {group.avgMargin.toFixed(1)}%</span>
                        </>
                      )}
                    </div>
                    <MenuDivider />
                  </div>

                  {/* Dishes */}
                  <div className="space-y-1 print:space-y-0.5">
                    {group.recipes.map((recipe) => {
                      const allergens = getRecipeAllergens(recipe);
                      const mc =
                        recipe.margin.marginPercent >= 70
                          ? 'text-green-600'
                          : recipe.margin.marginPercent >= 60
                          ? 'text-amber-600'
                          : 'text-red-600';
                      const isDuJour = menuDuJourIds.has(recipe.id);

                      return (
                        <div
                          key={recipe.id}
                          className={`group flex items-start gap-3 px-3 py-2.5 rounded-lg transition-colors
                            hover:bg-amber-50/50 dark:hover:bg-slate-700/30
                            print:px-0 print:py-1 print:hover:bg-transparent
                            ${menuDuJourMode && !isDuJour ? 'opacity-30' : ''}`}
                        >
                          {/* Toggle buttons (screen only) */}
                          <div className="print:hidden flex flex-col items-center gap-1 pt-0.5 shrink-0">
                            <button
                              onClick={() => toggleDish(recipe.id)}
                              title={disabledDishes.has(recipe.id) ? 'Activer sur la carte' : 'Retirer de la carte'}
                              className="text-slate-300 hover:text-slate-500 dark:text-slate-600 dark:hover:text-slate-400"
                            >
                              {disabledDishes.has(recipe.id) ? (
                                <ToggleLeft className="w-5 h-5" />
                              ) : (
                                <ToggleRight className="w-5 h-5 text-green-500" />
                              )}
                            </button>
                            {!menuDuJourMode && (
                              <button
                                onClick={() => toggleMenuDuJour(recipe.id)}
                                title={isDuJour ? 'Retirer du menu du jour' : 'Ajouter au menu du jour'}
                                className={`transition-colors ${
                                  isDuJour
                                    ? 'text-amber-500'
                                    : 'text-slate-200 dark:text-slate-700 hover:text-amber-400'
                                }`}
                              >
                                <Star className={`w-4 h-4 ${isDuJour ? 'fill-current' : ''}`} />
                              </button>
                            )}
                          </div>

                          {/* Dish content */}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-baseline gap-2">
                              <Link
                                to={`/recipes/${recipe.id}`}
                                className="font-semibold text-slate-800 dark:text-slate-100 hover:text-amber-700 dark:hover:text-amber-400 transition-colors print:text-slate-900 print:no-underline"
                              >
                                {recipe.name}
                              </Link>
                              {/* Dotted leader line */}
                              <span className="flex-1 border-b border-dotted border-slate-300 dark:border-slate-600 print:border-slate-400 translate-y-[-3px] mx-1" />
                              {/* Price */}
                              {showPrices && (
                                <span className="font-serif font-bold text-slate-800 dark:text-slate-100 print:text-slate-900 whitespace-nowrap">
                                  {recipe.sellingPrice.toFixed(2)} &euro;
                                </span>
                              )}
                            </div>
                            {/* Description */}
                            {recipe.description && (
                              <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5 print:text-slate-600 italic">
                                {recipe.description}
                              </p>
                            )}
                            {/* Allergen badges + margin info (screen only) */}
                            <div className="print:hidden flex flex-wrap items-center gap-2 mt-1">
                              {allergens.length > 0 && (
                                <div className="flex flex-wrap gap-1">
                                  {allergens.map((a) => (
                                    <span
                                      key={a}
                                      className="text-[10px] px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400"
                                    >
                                      {a}
                                    </span>
                                  ))}
                                </div>
                              )}
                              {showMargins && (
                                <span className={`text-xs font-semibold ${mc}`}>
                                  {recipe.margin.marginPercent.toFixed(1)}% marge
                                </span>
                              )}
                              {showMargins && (
                                <span className="text-xs text-slate-400 dark:text-slate-500">
                                  Cout: {(recipe.margin.totalCostPerPortion || recipe.margin.costPerPortion).toFixed(2)} &euro;
                                </span>
                              )}
                            </div>
                            {/* Print: allergen line */}
                            {allergens.length > 0 && (
                              <p className="hidden print:block text-[9px] text-slate-500 mt-0.5">
                                Allergenes : {allergens.join(', ')}
                              </p>
                            )}
                          </div>

                          {/* View link (screen only) */}
                          <Link
                            to={`/recipes/${recipe.id}`}
                            className="print:hidden shrink-0 p-1.5 rounded-lg opacity-0 group-hover:opacity-100 hover:bg-amber-100 dark:hover:bg-amber-900/30 text-amber-600 dark:text-amber-400 transition-all"
                            title="Voir fiche technique"
                          >
                            <Eye className="w-4 h-4" />
                          </Link>
                        </div>
                      );
                    })}
                  </div>

                  {/* Separator between categories */}
                  {gi < displayGroups.length - 1 && <MenuOrnament />}
                </div>
              ))}
            </div>

            {/* Menu footer */}
            <div className="text-center py-4 px-6 border-t border-amber-100 dark:border-slate-700 print:border-slate-300">
              <p className="text-xs text-slate-400 dark:text-slate-500 print:text-slate-600">
                Prix TTC &mdash; Tous nos plats sont faits maison. N&apos;hesitez pas a signaler vos allergies a notre equipe.
              </p>
              <MenuOrnament />
            </div>
          </div>
        )}
      </div>

      {/* ========== PER-CATEGORY STATS (screen only) ========== */}
      {showStats && displayGroups.length > 0 && (
        <div className="print:hidden mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {displayGroups.map((g) => (
            <div
              key={g.category}
              className="bg-white dark:bg-slate-800 rounded-lg shadow p-4 border-l-4 border-amber-400 dark:border-amber-600"
            >
              <h4 className="font-serif font-bold text-slate-800 dark:text-slate-100 mb-2">
                {getCategoryLabel(g.category)}
              </h4>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div>
                  <span className="text-slate-400 dark:text-slate-500">Plats</span>
                  <div className="font-semibold text-slate-700 dark:text-slate-200">{g.recipes.length}</div>
                </div>
                <div>
                  <span className="text-slate-400 dark:text-slate-500">Prix moyen</span>
                  <div className="font-semibold text-slate-700 dark:text-slate-200">
                    {g.avgPrice.toFixed(2)} &euro;
                  </div>
                </div>
                <div>
                  <span className="text-slate-400 dark:text-slate-500">Min - Max</span>
                  <div className="font-semibold text-slate-700 dark:text-slate-200">
                    {g.minPrice.toFixed(0)} - {g.maxPrice.toFixed(0)} &euro;
                  </div>
                </div>
                <div>
                  <span className="text-slate-400 dark:text-slate-500">Marge moy.</span>
                  <div
                    className={`font-semibold ${
                      g.avgMargin >= 70
                        ? 'text-green-600'
                        : g.avgMargin >= 60
                        ? 'text-amber-600'
                        : 'text-red-600'
                    }`}
                  >
                    {g.avgMargin.toFixed(1)}%
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ========== PRINT STYLES ========== */}
      <style>{`
        @media print {
          /* Hide everything outside the menu */
          body * {
            visibility: hidden;
          }
          /* But show the menu card and its children */
          #root, #root * {
            visibility: visible;
          }
          /* Hide navigation, sidebar, etc */
          nav, aside, header, footer, .print\\:hidden {
            display: none !important;
          }
          /* Page setup */
          @page {
            margin: 1.5cm;
            size: A4;
          }
          body {
            font-size: 11pt;
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
          }
          /* Elegant font for print */
          .font-serif {
            font-family: 'Georgia', 'Times New Roman', serif;
          }
          /* Avoid page breaks inside a category */
          .space-y-8 > div {
            break-inside: avoid;
          }
        }
      `}</style>
    </div>
  );
}

// --- Stat card sub-component ---
function StatCard({
  label,
  value,
  valueColor,
  icon,
  iconBg,
}: {
  label: string;
  value: string;
  valueColor?: string;
  icon: React.ReactNode;
  iconBg: string;
}) {
  return (
    <div className="bg-white dark:bg-slate-800 rounded-lg shadow p-4">
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs text-slate-500 dark:text-slate-400">{label}</span>
        <div className={`p-2 rounded-lg ${iconBg}`}>{icon}</div>
      </div>
      <div className={`text-xl font-bold ${valueColor || 'text-slate-800 dark:text-slate-100'}`}>
        {value}
      </div>
    </div>
  );
}
