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
  ChevronUp,
  ChevronDown,
  Plus,
  Check,
  Pencil,
} from 'lucide-react';
import { fetchRecipes, updateRecipe } from '../services/api';
import { useToast } from '../hooks/useToast';
import type { Recipe } from '../types';
import { RECIPE_CATEGORIES, ALLERGENS } from '../types';

// --- Category display config ---
const CATEGORY_ORDER = ['Entree', 'Plat', 'Dessert', 'Suggestion', 'Accompagnement', 'Boisson'] as const;
const CATEGORY_LABELS: Record<string, string> = {
  'Entree': 'Entrées',
  'Entrée': 'Entrées',
  'Plat': 'Plats',
  'Dessert': 'Desserts',
  'Suggestion': 'Suggestions du Chef',
  'Accompagnement': 'Accompagnements',
  'Boisson': 'Boissons',
};
const CATEGORY_ICONS: Record<string, string> = {
  'Entree': '',
  'Entrée': '',
  'Plat': '',
  'Dessert': '',
  'Suggestion': '',
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

// --- localStorage helpers ---
function loadExcluded(): Set<number> {
  try {
    const raw = localStorage.getItem('menuExcluded');
    if (raw) return new Set(JSON.parse(raw));
  } catch {}
  return new Set();
}
function saveExcluded(set: Set<number>) {
  localStorage.setItem('menuExcluded', JSON.stringify([...set]));
}
function loadOrder(): Record<string, number[]> {
  try {
    const raw = localStorage.getItem('menuOrder');
    if (raw) return JSON.parse(raw);
  } catch {}
  return {};
}
function saveOrder(order: Record<string, number[]>) {
  localStorage.setItem('menuOrder', JSON.stringify(order));
}

export default function MenuBuilder() {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);
  const { showToast } = useToast();

  // UI toggles
  const [showPrices, setShowPrices] = useState(true);
  const [showMargins, setShowMargins] = useState(false);
  const [sortBy, setSortBy] = useState<SortKey>('name');
  const [excludedAllergens, setExcludedAllergens] = useState<Set<string>>(new Set());
  const [allergenFilterOpen, setAllergenFilterOpen] = useState(false);

  // Menu builder: excluded dishes + menu du jour mode
  const [excludedDishes, setExcludedDishes] = useState<Set<number>>(loadExcluded);
  const [menuDuJourMode, setMenuDuJourMode] = useState(false);
  const [menuDuJourIds, setMenuDuJourIds] = useState<Set<number>>(new Set());
  const [menuDuJourPrice, setMenuDuJourPrice] = useState<string>('');
  const [editingMenuPrice, setEditingMenuPrice] = useState(false);

  // Reorder state
  const [categoryOrder, setCategoryOrder] = useState<Record<string, number[]>>(loadOrder);

  // Inline price editing
  const [editingPriceId, setEditingPriceId] = useState<number | null>(null);
  const [editingPriceValue, setEditingPriceValue] = useState('');
  const priceInputRef = useRef<HTMLInputElement>(null);

  // Quick add dropdown
  const [quickAddCategory, setQuickAddCategory] = useState<string | null>(null);

  // Print options
  const [printWithPrices, setPrintWithPrices] = useState(true);

  // Stats panel visibility
  const [showStats, setShowStats] = useState(true);

  const printRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchRecipes()
      .then(setRecipes)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  // Focus price input when editing
  useEffect(() => {
    if (editingPriceId !== null && priceInputRef.current) {
      priceInputRef.current.focus();
      priceInputRef.current.select();
    }
  }, [editingPriceId]);

  // --- Allergen filter ---
  const toggleAllergen = useCallback((a: string) => {
    setExcludedAllergens((prev) => {
      const next = new Set(prev);
      if (next.has(a)) next.delete(a);
      else next.add(a);
      return next;
    });
  }, []);

  // --- Dish exclusion toggle (persisted) ---
  const toggleExcluded = useCallback((id: number) => {
    setExcludedDishes((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      saveExcluded(next);
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

  // --- Inline price editing ---
  const startEditPrice = useCallback((recipe: Recipe) => {
    setEditingPriceId(recipe.id);
    setEditingPriceValue(recipe.sellingPrice.toFixed(2));
  }, []);

  const savePrice = useCallback(async (recipe: Recipe) => {
    const newPrice = parseFloat(editingPriceValue);
    if (isNaN(newPrice) || newPrice <= 0) {
      setEditingPriceId(null);
      return;
    }
    if (newPrice === recipe.sellingPrice) {
      setEditingPriceId(null);
      return;
    }
    try {
      const updated = await updateRecipe(recipe.id, {
        name: recipe.name,
        category: recipe.category,
        sellingPrice: newPrice,
        nbPortions: recipe.nbPortions,
        description: recipe.description || undefined,
        prepTimeMinutes: recipe.prepTimeMinutes,
        cookTimeMinutes: recipe.cookTimeMinutes,
        laborCostPerHour: recipe.laborCostPerHour,
        ingredients: recipe.ingredients.map((ri) => ({
          ingredientId: ri.ingredientId,
          quantity: ri.quantity,
          wastePercent: ri.wastePercent,
        })),
      });
      setRecipes((prev) => prev.map((r) => (r.id === recipe.id ? updated : r)));
      showToast('Sauvegardé', 'success');
    } catch {
      showToast('Erreur lors de la sauvegarde', 'error');
    }
    setEditingPriceId(null);
  }, [editingPriceValue, showToast]);

  // --- Reorder within category ---
  const moveRecipe = useCallback((category: string, recipeId: number, direction: 'up' | 'down') => {
    setCategoryOrder((prev) => {
      const currentRecipesInCat = recipes
        .filter((r) => r.category === category && !excludedDishes.has(r.id))
        .map((r) => r.id);
      const order = prev[category] || currentRecipesInCat;
      const idx = order.indexOf(recipeId);
      if (idx === -1) return prev;
      const newIdx = direction === 'up' ? idx - 1 : idx + 1;
      if (newIdx < 0 || newIdx >= order.length) return prev;
      const next = [...order];
      [next[idx], next[newIdx]] = [next[newIdx], next[idx]];
      const updated = { ...prev, [category]: next };
      saveOrder(updated);
      return updated;
    });
  }, [recipes, excludedDishes]);

  // --- Active recipes (non-excluded) ---
  const activeRecipes = useMemo(() => {
    let list = recipes.filter((r) => !excludedDishes.has(r.id));
    if (excludedAllergens.size > 0) {
      list = list.filter((r) => {
        const ra = getRecipeAllergens(r);
        return !ra.some((a) => excludedAllergens.has(a));
      });
    }
    return list;
  }, [recipes, excludedDishes, excludedAllergens]);

  // --- Excluded recipes ---
  const excludedRecipesList = useMemo(() => {
    return recipes.filter((r) => excludedDishes.has(r.id));
  }, [recipes, excludedDishes]);

  // --- Grouped by category (with custom ordering) ---
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

    RECIPE_CATEGORIES.forEach((category) => {
      let recipeList = map.get(category) || [];
      if (recipeList.length > 0) {
        // Apply custom order if exists
        const order = categoryOrder[category];
        if (order && order.length > 0) {
          const orderMap = new Map(order.map((id, idx) => [id, idx]));
          recipeList = [...recipeList].sort((a, b) => {
            const ai = orderMap.get(a.id) ?? 999;
            const bi = orderMap.get(b.id) ?? 999;
            if (ai !== 999 || bi !== 999) return ai - bi;
            // Fallback to sortBy
            if (sortBy === 'price') return a.sellingPrice - b.sellingPrice;
            if (sortBy === 'margin') return b.margin.marginPercent - a.margin.marginPercent;
            return a.name.localeCompare(b.name, 'fr');
          });
        } else {
          recipeList = [...recipeList].sort((a, b) => {
            if (sortBy === 'price') return a.sellingPrice - b.sellingPrice;
            if (sortBy === 'margin') return b.margin.marginPercent - a.margin.marginPercent;
            return a.name.localeCompare(b.name, 'fr');
          });
        }
        const avgMargin = recipeList.reduce((s, r) => s + r.margin.marginPercent, 0) / recipeList.length;
        const avgPrice = recipeList.reduce((s, r) => s + r.sellingPrice, 0) / recipeList.length;
        const prices = recipeList.map((r) => r.sellingPrice);
        result.push({
          category,
          recipes: recipeList,
          avgMargin,
          avgPrice,
          minPrice: Math.min(...prices),
          maxPrice: Math.max(...prices),
          totalRevenue: recipeList.reduce((s, r) => s + r.sellingPrice, 0),
        });
      }
    });
    return result;
  }, [activeRecipes, sortBy, categoryOrder]);

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

  // --- Menu du jour course count ---
  const menuDuJourCount = useMemo(() => menuDuJourIds.size, [menuDuJourIds]);

  // --- Global stats (active only) ---
  const totalItems = activeRecipes.length;
  const globalAvgMargin =
    totalItems > 0 ? activeRecipes.reduce((s, r) => s + r.margin.marginPercent, 0) / totalItems : 0;
  const globalAvgPrice =
    totalItems > 0 ? activeRecipes.reduce((s, r) => s + r.sellingPrice, 0) / totalItems : 0;
  const allPrices = activeRecipes.map((r) => r.sellingPrice);
  const globalMinPrice = allPrices.length > 0 ? Math.min(...allPrices) : 0;
  const globalMaxPrice = allPrices.length > 0 ? Math.max(...allPrices) : 0;
  const estimatedCoversPerService = 40;
  const revenuePotentialPerService =
    totalItems > 0 ? globalAvgPrice * estimatedCoversPerService : 0;

  // --- Quick add: recipes not on the menu for a given category ---
  const getAvailableForCategory = useCallback((category: string) => {
    return recipes.filter((r) => r.category === category && excludedDishes.has(r.id));
  }, [recipes, excludedDishes]);

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
            {/* Print options */}
            <label className="inline-flex items-center gap-1.5 text-sm text-slate-600 dark:text-slate-300 cursor-pointer">
              <input
                type="checkbox"
                checked={printWithPrices}
                onChange={(e) => setPrintWithPrices(e.target.checked)}
                className="rounded border-slate-300 text-amber-600 focus:ring-amber-500"
              />
              Prix sur impression
            </label>
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
            {menuDuJourCount > 0 && (
              <span className="ml-1 bg-white/20 rounded-full px-1.5 text-xs">
                {menuDuJourCount}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* ========== STATS PANEL (hidden on print) ========== */}
      {showStats && (
        <div className="print:hidden grid grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
          <StatCard
            label="Total plats actifs"
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
            value={`${globalAvgPrice.toFixed(2)} €`}
            icon={<DollarSign className="w-5 h-5 text-white" />}
            iconBg="bg-purple-600"
          />
          <StatCard
            label="Fourchette prix"
            value={`${globalMinPrice.toFixed(0)} - ${globalMaxPrice.toFixed(0)} €`}
            icon={<ArrowUpDown className="w-5 h-5 text-white" />}
            iconBg="bg-cyan-600"
          />
          <StatCard
            label={`CA / service (~${estimatedCoversPerService} cvts)`}
            value={`${revenuePotentialPerService.toFixed(0)} €`}
            icon={<BarChart3 className="w-5 h-5 text-white" />}
            iconBg="bg-amber-600"
          />
        </div>
      )}

      {/* ========== MENU CARD ========== */}
      <div ref={printRef}>
        {/* Print header (visible only on print) */}
        <div className="hidden print:block text-center mb-6">
          {menuDuJourMode ? (
            <>
              <div className="text-4xl font-serif font-bold text-slate-800 tracking-wide">Menu du Jour</div>
              {menuDuJourPrice && (
                <div className="text-2xl font-serif font-bold text-amber-800 mt-2">{menuDuJourPrice} &euro;</div>
              )}
              <div className="text-sm text-slate-500 mt-1">{menuDuJourCount} plat{menuDuJourCount > 1 ? 's' : ''}</div>
            </>
          ) : (
            <div className="text-4xl font-serif font-bold text-slate-800 tracking-wide">La Carte</div>
          )}
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
                {menuDuJourMode ? 'Menu du Jour' : 'La Carte'}
              </h2>
              <MenuOrnament />
              {menuDuJourMode && (
                <div className="flex flex-col items-center gap-2 mt-2">
                  <span className="inline-flex items-center gap-1 px-3 py-1 bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-300 text-sm rounded-full font-medium">
                    <Star className="w-3.5 h-3.5" />
                    {menuDuJourCount} plat{menuDuJourCount > 1 ? 's' : ''} selectionne{menuDuJourCount > 1 ? 's' : ''}
                  </span>
                  {/* Prix menu du jour */}
                  <div className="flex items-center gap-2">
                    {editingMenuPrice ? (
                      <div className="flex items-center gap-1">
                        <span className="text-sm text-slate-500">Prix menu :</span>
                        <input
                          type="number"
                          step="0.50"
                          min="0"
                          value={menuDuJourPrice}
                          onChange={(e) => setMenuDuJourPrice(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') setEditingMenuPrice(false);
                          }}
                          onBlur={() => setEditingMenuPrice(false)}
                          autoFocus
                          className="w-20 px-2 py-1 text-sm border border-amber-300 rounded focus:ring-2 focus:ring-amber-500 focus:border-amber-500 dark:bg-slate-700 dark:border-slate-600 dark:text-slate-100"
                          placeholder="0.00"
                        />
                        <span className="text-sm text-slate-500">&euro;</span>
                      </div>
                    ) : (
                      <button
                        onClick={() => setEditingMenuPrice(true)}
                        className="inline-flex items-center gap-1 text-sm text-amber-600 hover:text-amber-700 dark:text-amber-400"
                      >
                        <Pencil className="w-3 h-3" />
                        {menuDuJourPrice ? `Prix menu : ${menuDuJourPrice} €` : 'Definir le prix du menu'}
                      </button>
                    )}
                  </div>
                </div>
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

                  {/* Quick add button (screen only) */}
                  <div className="print:hidden relative mb-2">
                    <button
                      onClick={() => setQuickAddCategory(quickAddCategory === group.category ? null : group.category)}
                      className="inline-flex items-center gap-1.5 text-xs text-amber-600 hover:text-amber-700 dark:text-amber-400 dark:hover:text-amber-300 font-medium px-2 py-1 rounded hover:bg-amber-50 dark:hover:bg-amber-900/20 transition-colors"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      Ajouter un plat
                    </button>
                    {quickAddCategory === group.category && (
                      <div className="absolute z-40 top-full left-0 mt-1 bg-white dark:bg-slate-800 rounded-lg shadow-xl border border-slate-200 dark:border-slate-700 p-2 w-72 max-h-60 overflow-y-auto">
                        <div className="flex items-center justify-between mb-2 px-2">
                          <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                            Plats retires - {getCategoryLabel(group.category)}
                          </span>
                          <button onClick={() => setQuickAddCategory(null)}>
                            <X className="w-4 h-4 text-slate-400 hover:text-slate-600" />
                          </button>
                        </div>
                        {getAvailableForCategory(group.category).length === 0 ? (
                          <div className="px-2 py-3 text-center">
                            <p className="text-xs text-slate-400 mb-2">Aucun plat retire dans cette categorie</p>
                            <Link
                              to="/recipes"
                              className="text-xs text-amber-600 hover:text-amber-700 font-medium"
                              onClick={() => setQuickAddCategory(null)}
                            >
                              Creer un nouveau plat &rarr;
                            </Link>
                          </div>
                        ) : (
                          <>
                            {getAvailableForCategory(group.category).map((r) => (
                              <button
                                key={r.id}
                                onClick={() => {
                                  toggleExcluded(r.id);
                                  setQuickAddCategory(null);
                                }}
                                className="w-full flex items-center justify-between px-3 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-amber-50 dark:hover:bg-slate-700 rounded transition-colors"
                              >
                                <span>{r.name}</span>
                                <span className="text-xs text-slate-400">{r.sellingPrice.toFixed(2)} &euro;</span>
                              </button>
                            ))}
                            <div className="border-t border-slate-100 dark:border-slate-700 mt-1 pt-1">
                              <Link
                                to="/recipes"
                                className="block px-3 py-2 text-xs text-amber-600 hover:text-amber-700 font-medium"
                                onClick={() => setQuickAddCategory(null)}
                              >
                                Creer un nouveau plat &rarr;
                              </Link>
                            </div>
                          </>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Dishes */}
                  <div className="space-y-1 print:space-y-0.5">
                    {group.recipes.map((recipe, ri) => {
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
                          {/* Toggle + reorder buttons (screen only) */}
                          <div className="print:hidden flex flex-col items-center gap-0.5 pt-0.5 shrink-0">
                            {/* Toggle on/off */}
                            <button
                              onClick={() => toggleExcluded(recipe.id)}
                              title="Retirer de la carte"
                              className="text-green-500 hover:text-red-400 transition-colors"
                            >
                              <ToggleRight className="w-5 h-5" />
                            </button>
                            {/* Menu du jour star */}
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
                            {/* Reorder arrows */}
                            <div className="flex flex-col opacity-0 group-hover:opacity-100 transition-opacity">
                              <button
                                onClick={() => moveRecipe(group.category, recipe.id, 'up')}
                                disabled={ri === 0}
                                className="text-slate-300 hover:text-slate-500 dark:text-slate-600 dark:hover:text-slate-400 disabled:opacity-30 disabled:cursor-not-allowed"
                                title="Monter"
                              >
                                <ChevronUp className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={() => moveRecipe(group.category, recipe.id, 'down')}
                                disabled={ri === group.recipes.length - 1}
                                className="text-slate-300 hover:text-slate-500 dark:text-slate-600 dark:hover:text-slate-400 disabled:opacity-30 disabled:cursor-not-allowed"
                                title="Descendre"
                              >
                                <ChevronDown className="w-3.5 h-3.5" />
                              </button>
                            </div>
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
                              {/* Price - inline editable on screen, static on print */}
                              {showPrices && (
                                <>
                                  {/* Print price */}
                                  <span className={`hidden font-serif font-bold text-slate-900 whitespace-nowrap ${printWithPrices ? 'print:inline' : 'print:hidden'}`}>
                                    {recipe.sellingPrice.toFixed(2)} &euro;
                                  </span>
                                  {/* Screen price - click to edit */}
                                  {editingPriceId === recipe.id ? (
                                    <div className="print:hidden flex items-center gap-1 shrink-0">
                                      <input
                                        ref={priceInputRef}
                                        type="number"
                                        step="0.01"
                                        min="0"
                                        value={editingPriceValue}
                                        onChange={(e) => setEditingPriceValue(e.target.value)}
                                        onKeyDown={(e) => {
                                          if (e.key === 'Enter') savePrice(recipe);
                                          if (e.key === 'Escape') setEditingPriceId(null);
                                        }}
                                        onBlur={() => savePrice(recipe)}
                                        className="w-20 px-2 py-0.5 text-sm font-bold border border-amber-400 rounded focus:ring-2 focus:ring-amber-500 focus:border-amber-500 dark:bg-slate-700 dark:border-slate-600 dark:text-slate-100 text-right"
                                      />
                                      <span className="text-sm font-bold text-slate-800 dark:text-slate-100">&euro;</span>
                                    </div>
                                  ) : (
                                    <button
                                      onClick={() => startEditPrice(recipe)}
                                      className="print:hidden font-serif font-bold text-slate-800 dark:text-slate-100 whitespace-nowrap hover:text-amber-600 dark:hover:text-amber-400 transition-colors cursor-pointer group/price relative"
                                      title="Cliquer pour modifier le prix"
                                    >
                                      {recipe.sellingPrice.toFixed(2)} &euro;
                                      <Pencil className="w-3 h-3 absolute -right-4 top-1/2 -translate-y-1/2 opacity-0 group-hover/price:opacity-100 text-amber-500 transition-opacity" />
                                    </button>
                                  )}
                                </>
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

      {/* ========== PLATS RETIRES SECTION (screen only) ========== */}
      {excludedRecipesList.length > 0 && (
        <div className="print:hidden mt-8">
          <h3 className="text-lg font-semibold text-slate-500 dark:text-slate-400 mb-3 flex items-center gap-2">
            <EyeOff className="w-5 h-5" />
            Plats retires ({excludedRecipesList.length})
          </h3>
          <div className="bg-slate-50 dark:bg-slate-800/50 rounded-lg border border-slate-200 dark:border-slate-700 divide-y divide-slate-200 dark:divide-slate-700">
            {excludedRecipesList.map((recipe) => (
              <div
                key={recipe.id}
                className="flex items-center gap-3 px-4 py-3 opacity-60 hover:opacity-100 transition-opacity"
              >
                <button
                  onClick={() => toggleExcluded(recipe.id)}
                  title="Remettre sur la carte"
                  className="text-slate-400 hover:text-green-500 transition-colors"
                >
                  <ToggleLeft className="w-5 h-5" />
                </button>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-slate-600 dark:text-slate-400 line-through">
                      {recipe.name}
                    </span>
                    <span className="text-xs text-slate-400 dark:text-slate-500">
                      {getCategoryLabel(recipe.category)}
                    </span>
                  </div>
                </div>
                <span className="text-sm text-slate-400 dark:text-slate-500">
                  {recipe.sellingPrice.toFixed(2)} &euro;
                </span>
                <Link
                  to={`/recipes/${recipe.id}`}
                  className="shrink-0 p-1 rounded text-slate-400 hover:text-amber-600 transition-colors"
                  title="Voir fiche technique"
                >
                  <Eye className="w-4 h-4" />
                </Link>
              </div>
            ))}
          </div>
        </div>
      )}

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
          /* Clean menu layout for print */
          .rounded-xl {
            border-radius: 0 !important;
          }
          .shadow-lg {
            box-shadow: none !important;
          }
          ${!printWithPrices ? `
          /* Hide prices in print when option is off */
          .print\\:inline {
            display: none !important;
          }
          ` : ''}
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
