import { useState, useEffect, useMemo, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Eye, Trash2, Search, Pencil, Copy, Sparkles, Loader2, Check, AlertTriangle, TrendingUp, X, UtensilsCrossed, LayoutGrid, List, ChevronUp, ChevronDown, ChevronsUpDown, Trophy, ShieldAlert } from 'lucide-react';
import { fetchRecipes, fetchIngredients, createRecipe, updateRecipe, deleteRecipe, cloneRecipe } from '../services/api';
import type { Recipe, Ingredient } from '../types';
import { RECIPE_CATEGORIES } from '../types';
import { useToast } from '../hooks/useToast';
import { useTranslation } from '../hooks/useTranslation';
import { useRestaurant } from '../hooks/useRestaurant';
import Modal from '../components/Modal';
import ConfirmDialog from '../components/ConfirmDialog';
import { searchTemplates, type RecipeTemplate } from '../data/recipeTemplates';

function MarginBadge({ percent }: { percent: number }) {
  const color = percent >= 70 ? 'bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-300' : percent >= 60 ? 'bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-300' : 'bg-red-100 dark:bg-red-900/40 text-red-700 dark:text-red-300';
  return <span className={`px-2 py-1 rounded-full text-xs font-medium ${color}`}>{percent.toFixed(1)}%</span>;
}

// ── Category gradient colors for recipe photo placeholders ───────────────
const CATEGORY_GRADIENTS: Record<string, string> = {
  'Entrée': 'from-emerald-400 to-green-600',
  'Plat': 'from-blue-400 to-indigo-600',
  'Dessert': 'from-pink-400 to-rose-600',
  'Accompagnement': 'from-amber-400 to-orange-600',
  'Boisson': 'from-cyan-400 to-teal-600',
};

// ── SVG allergen icons ───────────────────────────────────────────────────
const ALLERGEN_ICONS: Record<string, { svg: React.ReactNode; label: string }> = {
  Gluten: {
    label: 'Gluten',
    svg: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-3.5 h-3.5">
        <path d="M12 2v20M9 5c0 2 3 3 3 5s-3 3-3 5M15 5c0 2-3 3-3 5s3 3 3 5" />
        <path d="M7 3c1 1 2 2 2 4M17 3c-1 1-2 2-2 4" />
      </svg>
    ),
  },
  Lait: {
    label: 'Lait',
    svg: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-3.5 h-3.5">
        <path d="M8 2h8l1 5v13a2 2 0 01-2 2H9a2 2 0 01-2-2V7l1-5z" />
        <path d="M6 7h12" />
      </svg>
    ),
  },
  Oeufs: {
    label: 'Oeufs',
    svg: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-3.5 h-3.5">
        <ellipse cx="12" cy="14" rx="7" ry="8" />
        <ellipse cx="12" cy="14" rx="3" ry="3.5" />
      </svg>
    ),
  },
  Poissons: {
    label: 'Poissons',
    svg: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-3.5 h-3.5">
        <path d="M2 12s4-6 10-6 10 6 10 6-4 6-10 6S2 12 2 12z" />
        <path d="M22 12l-3-3v6l3-3z" />
        <circle cx="8" cy="12" r="1" fill="currentColor" />
      </svg>
    ),
  },
  'Crustacés': {
    label: 'Crustacés',
    svg: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-3.5 h-3.5">
        <path d="M5 8c0-3 3-5 7-5s7 2 7 5" />
        <path d="M4 12c0 4 4 8 8 8s8-4 8-8" />
        <path d="M8 12v3M16 12v3M12 8v4" />
        <path d="M3 8l2 4M21 8l-2 4" />
      </svg>
    ),
  },
  'Fruits à coque': {
    label: 'Fruits à coque',
    svg: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-3.5 h-3.5">
        <ellipse cx="12" cy="14" rx="6" ry="7" />
        <path d="M8 7c0-3 2-5 4-5s4 2 4 5" />
        <path d="M12 7v7" />
      </svg>
    ),
  },
  Soja: {
    label: 'Soja',
    svg: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-3.5 h-3.5">
        <ellipse cx="9" cy="14" rx="4" ry="6" />
        <ellipse cx="15" cy="14" rx="4" ry="6" />
        <path d="M12 2v6" />
        <path d="M10 4l2 2 2-2" />
      </svg>
    ),
  },
  'Céleri': {
    label: 'Céleri',
    svg: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-3.5 h-3.5">
        <path d="M12 22V8M8 22V10c0-4 2-7 4-8M16 22V10c0-4-2-7-4-8" />
        <path d="M8 6c-2-1-3 1-3 3M16 6c2-1 3 1 3 3" />
      </svg>
    ),
  },
  Moutarde: {
    label: 'Moutarde',
    svg: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-3.5 h-3.5">
        <rect x="7" y="8" width="10" height="13" rx="1" />
        <path d="M9 8V5a3 3 0 016 0v3" />
        <path d="M12 2v3M7 14h10" />
      </svg>
    ),
  },
  'Sésame': {
    label: 'Sésame',
    svg: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-3.5 h-3.5">
        <ellipse cx="8" cy="10" rx="2.5" ry="4" transform="rotate(-15 8 10)" />
        <ellipse cx="16" cy="10" rx="2.5" ry="4" transform="rotate(15 16 10)" />
        <ellipse cx="12" cy="16" rx="2.5" ry="4" />
      </svg>
    ),
  },
  Sulfites: {
    label: 'Sulfites',
    svg: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" className="w-3.5 h-3.5">
        <text x="4" y="17" fontSize="11" fontWeight="bold" fill="currentColor" stroke="none" fontFamily="sans-serif">SO₂</text>
      </svg>
    ),
  },
  Lupin: {
    label: 'Lupin',
    svg: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-3.5 h-3.5">
        <path d="M12 22V10" />
        <path d="M12 10c-2-4-6-5-6-8 0 5 4 6 6 8z" />
        <path d="M12 10c2-4 6-5 6-8 0 5-4 6-6 8z" />
        <path d="M12 14c-3-2-6-1-7 0 3-1 5 0 7 0z" />
        <path d="M12 14c3-2 6-1 7 0-3-1-5 0-7 0z" />
      </svg>
    ),
  },
  Mollusques: {
    label: 'Mollusques',
    svg: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-3.5 h-3.5">
        <path d="M4 18c0-6 4-12 8-14 4 2 8 8 8 14" />
        <path d="M4 18h16" />
        <path d="M8 18c0-3 2-7 4-9 2 2 4 6 4 9" />
      </svg>
    ),
  },
  Arachides: {
    label: 'Arachides',
    svg: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-3.5 h-3.5">
        <ellipse cx="10" cy="9" rx="4" ry="5" />
        <ellipse cx="14" cy="16" rx="4" ry="5" />
        <path d="M12 12c1-1 1-2 2-3" />
      </svg>
    ),
  },
};

function AllergenIcon({ name }: { name: string }) {
  const icon = ALLERGEN_ICONS[name];
  if (!icon) {
    return (
      <span
        title={name}
        className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-red-100 dark:bg-red-900/50 text-red-700 dark:text-red-300 text-[9px] font-bold cursor-help border border-red-200 dark:border-red-800"
      >
        {name.slice(0, 2)}
      </span>
    );
  }
  return (
    <span
      title={icon.label}
      className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-red-100 dark:bg-red-900/50 text-red-700 dark:text-red-300 cursor-help border border-red-200 dark:border-red-800 hover:scale-110 transition-transform"
    >
      {icon.svg}
    </span>
  );
}

/** Collect unique allergens from a recipe's ingredients */
function getRecipeAllergens(recipe: Recipe): string[] {
  const set = new Set<string>();
  recipe.ingredients.forEach((ri) => {
    ri.ingredient?.allergens?.forEach((a) => set.add(a));
  });
  return Array.from(set).sort();
}

/** Category-based photo placeholder */
function RecipePhotoPlaceholder({ category }: { category: string }) {
  const gradient = CATEGORY_GRADIENTS[category] || 'from-slate-400 to-slate-600';
  return (
    <div className={`relative h-32 rounded-t-lg bg-gradient-to-br ${gradient} flex items-center justify-center overflow-hidden`}>
      <div className="absolute inset-0 opacity-10">
        <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
          <circle cx="20" cy="20" r="15" fill="white" />
          <circle cx="80" cy="70" r="20" fill="white" />
          <circle cx="50" cy="50" r="10" fill="white" />
        </svg>
      </div>
      <UtensilsCrossed className="w-10 h-10 text-white/70" />
    </div>
  );
}

export default function Recipes() {
  const { t } = useTranslation();
  const { showToast } = useToast();
  const { selectedRestaurant, loading: restaurantLoading } = useRestaurant();
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [ingredients, setIngredients] = useState<Ingredient[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);

  // View & filter state
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [sortColumn, setSortColumn] = useState<string>('name');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

  const [form, setForm] = useState({
    name: '',
    category: 'Plat',
    sellingPrice: '',
    nbPortions: '1',
    description: '',
    prepTimeMinutes: '',
    cookTimeMinutes: '',
    laborCostPerHour: '',
  });
  const [formIngredients, setFormIngredients] = useState<{ ingredientId: number; quantity: string; wastePercent: string }[]>([]);

  // Suggestion system
  const [suggestions, setSuggestions] = useState<RecipeTemplate[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  // Delete confirm
  const [deleteTarget, setDeleteTarget] = useState<number | null>(null);

  // New: form enhancements state
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [ingredientSearch, setIngredientSearch] = useState('');
  const [templateApplyInfo, setTemplateApplyInfo] = useState<{ found: number; total: number; missing: string[] } | null>(null);

  useEffect(() => {
    if (restaurantLoading || !selectedRestaurant) return;
    loadData();
  }, [selectedRestaurant, restaurantLoading]);

  async function loadData() {
    try {
      const [r, i] = await Promise.all([fetchRecipes(), fetchIngredients()]);
      setRecipes(r);
      setIngredients(i);
    } catch {
      showToast(t("recipes.errorLoading"), 'error');
    } finally {
      setLoading(false);
    }
  }

  // ── KPI Summary ──────────────────────────────────────────────────────
  const kpis = useMemo(() => {
    if (recipes.length === 0) return { total: 0, avgMargin: 0, bestName: '-', bestMargin: 0, dangerCount: 0 };
    const avgMargin = recipes.reduce((s, r) => s + r.margin.marginPercent, 0) / recipes.length;
    const best = recipes.reduce((a, b) => a.margin.marginPercent >= b.margin.marginPercent ? a : b);
    const dangerCount = recipes.filter((r) => r.margin.marginPercent < 60).length;
    return { total: recipes.length, avgMargin, bestName: best.name, bestMargin: best.margin.marginPercent, dangerCount };
  }, [recipes]);

  // ── Category pills ──────────────────────────────────────────────────
  const categoryPills = useMemo(() => {
    const counts: Record<string, number> = {};
    recipes.forEach((r) => { counts[r.category] = (counts[r.category] || 0) + 1; });
    return Object.entries(counts).sort((a, b) => a[0].localeCompare(b[0]));
  }, [recipes]);

  const filtered = recipes.filter((r) => {
    const matchesSearch = r.name.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || r.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // ── Table sort logic ────────────────────────────────────────────────
  const sortedFiltered = useMemo(() => {
    if (viewMode !== 'table') return filtered;
    const sorted = [...filtered];
    sorted.sort((a, b) => {
      let va: string | number, vb: string | number;
      switch (sortColumn) {
        case 'name': va = a.name.toLowerCase(); vb = b.name.toLowerCase(); break;
        case 'category': va = a.category; vb = b.category; break;
        case 'sellingPrice': va = a.sellingPrice; vb = b.sellingPrice; break;
        case 'cost': va = a.margin.costPerPortion; vb = b.margin.costPerPortion; break;
        case 'margin': va = a.margin.marginPercent; vb = b.margin.marginPercent; break;
        case 'coefficient': va = a.margin.coefficient; vb = b.margin.coefficient; break;
        default: va = a.name; vb = b.name;
      }
      if (va < vb) return sortDirection === 'asc' ? -1 : 1;
      if (va > vb) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });
    return sorted;
  }, [filtered, sortColumn, sortDirection, viewMode]);

  function handleSort(col: string) {
    if (sortColumn === col) {
      setSortDirection((d) => d === 'asc' ? 'desc' : 'asc');
    } else {
      setSortColumn(col);
      setSortDirection('asc');
    }
  }

  function SortIcon({ col }: { col: string }) {
    if (sortColumn !== col) return <ChevronsUpDown className="w-3.5 h-3.5 text-slate-400" />;
    return sortDirection === 'asc' ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />;
  }

  // Filtered ingredients for the add-ingredient dropdown search
  const filteredIngredients = useMemo(() => {
    if (!ingredientSearch.trim()) return ingredients;
    const q = ingredientSearch.toLowerCase();
    return ingredients.filter((i) =>
      i.name.toLowerCase().includes(q) || i.category.toLowerCase().includes(q)
    );
  }, [ingredients, ingredientSearch]);

  function openNew() {
    setForm({ name: '', category: 'Plat', sellingPrice: '', nbPortions: '1', description: '', prepTimeMinutes: '', cookTimeMinutes: '', laborCostPerHour: '' });
    setFormIngredients([]);
    setEditingId(null);
    setTemplateApplyInfo(null);
    setIngredientSearch('');
    setShowForm(true);
  }

  function openEdit(recipe: Recipe) {
    setForm({
      name: recipe.name,
      category: recipe.category,
      sellingPrice: String(recipe.sellingPrice),
      nbPortions: String(recipe.nbPortions),
      description: recipe.description || '',
      prepTimeMinutes: recipe.prepTimeMinutes ? String(recipe.prepTimeMinutes) : '',
      cookTimeMinutes: recipe.cookTimeMinutes ? String(recipe.cookTimeMinutes) : '',
      laborCostPerHour: recipe.laborCostPerHour ? String(recipe.laborCostPerHour) : '',
    });
    setFormIngredients(
      recipe.ingredients.map((ri) => ({
        ingredientId: ri.ingredientId,
        quantity: String(ri.quantity),
        wastePercent: ri.wastePercent ? String(ri.wastePercent) : '0',
      }))
    );
    setEditingId(recipe.id);
    setTemplateApplyInfo(null);
    setIngredientSearch('');
    setShowForm(true);
  }

  // Handle recipe name change - search for templates
  function handleNameChange(value: string) {
    setForm({ ...form, name: value });
    if (!editingId && value.length >= 2) {
      const results = searchTemplates(value);
      setSuggestions(results);
      setShowSuggestions(results.length > 0);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  }

  // Apply a template suggestion - with enhanced feedback
  function applyTemplate(template: RecipeTemplate) {
    setForm({
      name: template.name,
      category: template.category,
      sellingPrice: String(template.suggestedSellingPrice),
      nbPortions: String(template.nbPortions),
      description: template.description,
      prepTimeMinutes: String(template.suggestedPrepTime),
      cookTimeMinutes: String(template.suggestedCookTime),
      laborCostPerHour: '',
    });

    // Map template ingredients to actual ingredients in DB
    const missing: string[] = [];
    const mapped = template.suggestedIngredients
      .map((ti: { name: string; quantity: number; wastePercent: number }) => {
        const found = ingredients.find((i) => i.name === ti.name);
        if (!found) {
          missing.push(ti.name);
          return null;
        }
        return {
          ingredientId: found.id,
          quantity: String(ti.quantity),
          wastePercent: String(ti.wastePercent),
        };
      })
      .filter(Boolean) as { ingredientId: number; quantity: string; wastePercent: string }[];

    setFormIngredients(mapped);
    setTemplateApplyInfo({
      found: mapped.length,
      total: template.suggestedIngredients.length,
      missing,
    });
    setShowSuggestions(false);
    setSuggestions([]);
  }

  function addIngredientLine() {
    if (ingredients.length === 0) return;
    // Pick the first ingredient from filtered list, or default to first overall
    const defaultIng = filteredIngredients.length > 0 ? filteredIngredients[0] : ingredients[0];
    setFormIngredients([...formIngredients, { ingredientId: defaultIng.id, quantity: '', wastePercent: '0' }]);
  }

  function removeIngredientLine(index: number) {
    setFormIngredients(formIngredients.filter((_, i) => i !== index));
  }

  // Real-time cost calculation
  const liveCost = formIngredients.reduce((total, fi) => {
    const ing = ingredients.find((i) => i.id === fi.ingredientId);
    const qty = parseFloat(fi.quantity) || 0;
    const waste = parseFloat(fi.wastePercent) || 0;
    const effectiveQty = qty * (1 + waste / 100);
    return total + (ing ? ing.pricePerUnit * effectiveQty : 0);
  }, 0);

  const livePortions = parseInt(form.nbPortions) || 1;
  const liveCostPerPortion = liveCost / livePortions;

  // Labor cost calculation
  const livePrepTime = parseFloat(form.prepTimeMinutes) || 0;
  const liveCookTime = parseFloat(form.cookTimeMinutes) || 0;
  const liveLaborRate = parseFloat(form.laborCostPerHour) || 0;
  const liveLaborCost = ((livePrepTime + liveCookTime) / 60) * liveLaborRate;
  const liveLaborPerPortion = liveLaborCost / livePortions;
  const liveTotalPerPortion = liveCostPerPortion + liveLaborPerPortion;

  const liveSellingPrice = parseFloat(form.sellingPrice) || 0;
  const liveMargin = liveSellingPrice > 0 ? ((liveSellingPrice - liveTotalPerPortion) / liveSellingPrice) * 100 : 0;

  // Keyboard shortcut: Ctrl+Enter to save
  const handleFormKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
      e.preventDefault();
      const formEl = (e.target as HTMLElement).closest('form');
      if (formEl) formEl.requestSubmit();
    }
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);

    const data = {
      name: form.name,
      category: form.category,
      sellingPrice: parseFloat(form.sellingPrice),
      nbPortions: parseInt(form.nbPortions) || 1,
      description: form.description || undefined,
      prepTimeMinutes: form.prepTimeMinutes ? parseFloat(form.prepTimeMinutes) : undefined,
      cookTimeMinutes: form.cookTimeMinutes ? parseFloat(form.cookTimeMinutes) : undefined,
      laborCostPerHour: form.laborCostPerHour ? parseFloat(form.laborCostPerHour) : undefined,
      ingredients: formIngredients
        .filter((fi) => parseFloat(fi.quantity) > 0)
        .map((fi) => ({
          ingredientId: fi.ingredientId,
          quantity: parseFloat(fi.quantity),
          wastePercent: parseFloat(fi.wastePercent) || 0,
        })),
    };

    try {
      if (editingId) {
        await updateRecipe(editingId, data);
      } else {
        await createRecipe(data);
      }
      setSaveSuccess(true);
      setTimeout(() => {
        setSaveSuccess(false);
        setShowForm(false);
        showToast(editingId ? t("recipes.recipeUpdated") : t("recipes.recipeCreated"), 'success');
        loadData();
      }, 600);
    } catch {
      showToast(t("recipes.errorSaving"), 'error');
    } finally {
      setSaving(false);
    }
  }

  async function handleDeleteConfirm() {
    if (!deleteTarget) return;
    try {
      await deleteRecipe(deleteTarget);
      showToast(t("recipes.recipeDeleted"), 'success');
      loadData();
    } catch {
      showToast(t("recipes.errorDeleting"), 'error');
    } finally {
      setDeleteTarget(null);
    }
  }

  async function handleClone(id: number) {
    try {
      await cloneRecipe(id);
      showToast(t("recipes.recipeCloned"), 'success');
      loadData();
    } catch {
      showToast(t("recipes.errorCloning"), 'error');
    }
  }

  // Compute template preview data
  function getTemplatePreview(tpl: RecipeTemplate) {
    let estimatedCost = 0;
    let foundCount = 0;
    tpl.suggestedIngredients.forEach((ti) => {
      const found = ingredients.find((i) => i.name === ti.name);
      if (found) {
        foundCount++;
        const effectiveQty = ti.quantity * (1 + ti.wastePercent / 100);
        estimatedCost += found.pricePerUnit * effectiveQty;
      }
    });
    const costPerPortion = estimatedCost / tpl.nbPortions;
    const margin = tpl.suggestedSellingPrice > 0
      ? ((tpl.suggestedSellingPrice - costPerPortion) / tpl.suggestedSellingPrice) * 100
      : 0;
    return { estimatedCost, costPerPortion, margin, foundCount };
  }

  if (loading) return <div className="text-center py-12 text-slate-500 dark:text-slate-400">{t("recipes.loading")}</div>;

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100">{t("recipes.title")}</h2>
        <button onClick={openNew} className="btn-primary flex items-center gap-2">
          <Plus className="w-4 h-4" /> {t("recipes.newRecipe")}
        </button>
      </div>

      {/* ── KPI Summary Cards ──────────────────────────────────────────── */}
      {recipes.length > 0 && (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
          <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-4">
            <div className="text-xs text-slate-500 dark:text-slate-400 mb-1">{t("recipes.kpiTotal")}</div>
            <div className="text-2xl font-bold text-slate-800 dark:text-slate-100">{kpis.total}</div>
          </div>
          <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-4">
            <div className="text-xs text-slate-500 dark:text-slate-400 mb-1">{t("recipes.kpiAvgMargin")}</div>
            <div className={`text-2xl font-bold ${kpis.avgMargin >= 70 ? 'text-green-600 dark:text-green-400' : kpis.avgMargin >= 60 ? 'text-amber-600 dark:text-amber-400' : 'text-red-600 dark:text-red-400'}`}>{kpis.avgMargin.toFixed(1)}%</div>
          </div>
          <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-4">
            <div className="flex items-center gap-1 text-xs text-slate-500 dark:text-slate-400 mb-1">
              <Trophy className="w-3 h-3" /> {t("recipes.kpiBestMargin")}
            </div>
            <div className="text-sm font-bold text-green-600 dark:text-green-400 truncate" title={kpis.bestName}>{kpis.bestName}</div>
            <div className="text-xs text-slate-500 dark:text-slate-400">{kpis.bestMargin.toFixed(1)}%</div>
          </div>
          <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-4">
            <div className="flex items-center gap-1 text-xs text-slate-500 dark:text-slate-400 mb-1">
              <ShieldAlert className="w-3 h-3" /> {t("recipes.kpiDanger")}
            </div>
            <div className={`text-2xl font-bold ${kpis.dangerCount > 0 ? 'text-red-600 dark:text-red-400' : 'text-green-600 dark:text-green-400'}`}>{kpis.dangerCount}</div>
          </div>
        </div>
      )}

      {/* ── Search bar + View toggle ───────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row gap-3 mb-4">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder={t("recipes.searchPlaceholder")}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="input pl-10 w-full"
          />
        </div>
        <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 rounded-lg p-1">
          <button
            onClick={() => setViewMode('grid')}
            className={`p-2 rounded-md transition-colors ${viewMode === 'grid' ? 'bg-white dark:bg-slate-700 shadow-sm text-blue-600 dark:text-blue-400' : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}`}
            title={t("recipes.gridView")}
          >
            <LayoutGrid className="w-4 h-4" />
          </button>
          <button
            onClick={() => setViewMode('table')}
            className={`p-2 rounded-md transition-colors ${viewMode === 'table' ? 'bg-white dark:bg-slate-700 shadow-sm text-blue-600 dark:text-blue-400' : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}`}
            title={t("recipes.tableView")}
          >
            <List className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* ── Category filter pills ──────────────────────────────────────── */}
      {categoryPills.length > 1 && (
        <div className="flex flex-wrap gap-2 mb-4">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${selectedCategory === 'all' ? 'bg-blue-600 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'}`}
          >
            {t("recipes.allCategories")} ({recipes.length})
          </button>
          {categoryPills.map(([cat, count]) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${selectedCategory === cat ? 'bg-blue-600 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'}`}
            >
              {cat} ({count})
            </button>
          ))}
        </div>
      )}

      {/* ── Table View ─────────────────────────────────────────────────── */}
      {viewMode === 'table' ? (
        <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-700">
                {[
                  { key: 'name', label: t("recipes.colName") },
                  { key: 'category', label: t("recipes.colCategory") },
                  { key: 'sellingPrice', label: t("recipes.colSellingPrice") },
                  { key: 'cost', label: t("recipes.colCost") },
                  { key: 'margin', label: t("recipes.colMargin") },
                  { key: 'coefficient', label: t("recipes.colCoefficient") },
                ].map((col) => (
                  <th
                    key={col.key}
                    onClick={() => handleSort(col.key)}
                    className="px-4 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider cursor-pointer hover:text-slate-700 dark:hover:text-slate-200 select-none"
                  >
                    <span className="inline-flex items-center gap-1">
                      {col.label}
                      <SortIcon col={col.key} />
                    </span>
                  </th>
                ))}
                <th className="px-4 py-3 text-right text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
              {sortedFiltered.length === 0 ? (
                <tr><td colSpan={7} className="px-4 py-8 text-center text-slate-400 dark:text-slate-500">{recipes.length === 0 ? t("recipes.noRecipes") : t("recipes.noResults")}</td></tr>
              ) : sortedFiltered.map((recipe) => (
                <tr key={recipe.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-100">{recipe.name}</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">{recipe.category}</td>
                  <td className="px-4 py-3 font-mono text-slate-700 dark:text-slate-300">{recipe.sellingPrice.toFixed(2)}&euro;</td>
                  <td className="px-4 py-3 font-mono text-slate-700 dark:text-slate-300">{recipe.margin.costPerPortion.toFixed(2)}&euro;</td>
                  <td className="px-4 py-3"><MarginBadge percent={recipe.margin.marginPercent} /></td>
                  <td className="px-4 py-3 font-mono text-slate-700 dark:text-slate-300">{recipe.margin.coefficient.toFixed(2)}</td>
                  <td className="px-4 py-3">
                    <div className="flex gap-1 justify-end">
                      <Link to={`/recipes/${recipe.id}`} className="p-1.5 rounded hover:bg-slate-100 dark:hover:bg-slate-700" title={t("recipes.view")}>
                        <Eye className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                      </Link>
                      <button onClick={() => openEdit(recipe)} className="p-1.5 rounded hover:bg-slate-100 dark:hover:bg-slate-700" title={t("recipes.editTooltip")}>
                        <Pencil className="w-4 h-4 text-slate-600 dark:text-slate-400" />
                      </button>
                      <button onClick={() => handleClone(recipe.id)} className="p-1.5 rounded hover:bg-blue-100 dark:hover:bg-blue-900/30" title={t("recipes.cloneTooltip")}>
                        <Copy className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                      </button>
                      <button onClick={() => setDeleteTarget(recipe.id)} className="p-1.5 rounded hover:bg-red-100 dark:hover:bg-red-900/30" title={t("recipes.deleteTooltip")}>
                        <Trash2 className="w-4 h-4 text-red-500" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
      /* ── Grid View (existing cards) ────────────────────────────────── */
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.length === 0 ? (
          <p className="text-slate-400 dark:text-slate-500 col-span-full text-center py-8">
            {recipes.length === 0 ? t("recipes.noRecipes") : t("recipes.noResults")}
          </p>
        ) : (
          filtered.map((recipe) => {
            const allergens = getRecipeAllergens(recipe);
            return (
            <div key={recipe.id} className="bg-white dark:bg-slate-800 rounded-lg shadow hover:shadow-lg hover:-translate-y-1 transition-all duration-200 overflow-hidden group">
              {/* Photo placeholder */}
              <RecipePhotoPlaceholder category={recipe.category} />

              <div className="p-4">
                {/* Header: name + category + margin */}
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="font-semibold text-lg text-slate-800 dark:text-slate-100 leading-tight">{recipe.name}</h3>
                    <span className="text-xs text-slate-500 dark:text-slate-400">{recipe.category}</span>
                  </div>
                  <MarginBadge percent={recipe.margin.marginPercent} />
                </div>

                {/* Key stats row */}
                <div className="grid grid-cols-3 gap-2 text-center mb-3">
                  <div className="bg-slate-50 dark:bg-slate-700/50 rounded-lg py-2 px-1">
                    <div className="text-[11px] text-slate-500 dark:text-slate-400">{t("recipes.sale")}</div>
                    <div className="text-sm font-bold text-slate-800 dark:text-slate-200">{recipe.sellingPrice.toFixed(2)}&euro;</div>
                  </div>
                  <div className="bg-slate-50 dark:bg-slate-700/50 rounded-lg py-2 px-1">
                    <div className="text-[11px] text-slate-500 dark:text-slate-400">{t("recipes.cost")}</div>
                    <div className="text-sm font-bold text-slate-800 dark:text-slate-200">{recipe.margin.costPerPortion.toFixed(2)}&euro;</div>
                  </div>
                  <div className="bg-slate-50 dark:bg-slate-700/50 rounded-lg py-2 px-1">
                    <div className="text-[11px] text-slate-500 dark:text-slate-400">{t("recipes.margin")}</div>
                    <div className={`text-sm font-bold ${recipe.margin.marginPercent >= 70 ? 'text-green-600 dark:text-green-400' : recipe.margin.marginPercent >= 60 ? 'text-amber-600 dark:text-amber-400' : 'text-red-600 dark:text-red-400'}`}>
                      {recipe.margin.marginPercent.toFixed(1)}%
                    </div>
                  </div>
                </div>

                {/* Allergen icons row */}
                {allergens.length > 0 && (
                  <div className="flex flex-wrap gap-1 mb-3">
                    {allergens.map((a) => (
                      <AllergenIcon key={a} name={a} />
                    ))}
                  </div>
                )}

                {/* Actions */}
                <div className="flex gap-2 pt-3 border-t dark:border-slate-700">
                  <Link to={`/recipes/${recipe.id}`} className="btn-secondary text-sm flex items-center gap-1 flex-1 justify-center">
                    <Eye className="w-4 h-4" /> {t("recipes.view")}
                  </Link>
                  <button onClick={() => openEdit(recipe)} className="p-2 rounded hover:bg-slate-100 dark:hover:bg-slate-700" title={t("recipes.editTooltip")}>
                    <Pencil className="w-4 h-4 text-slate-600 dark:text-slate-400" />
                  </button>
                  <button onClick={() => handleClone(recipe.id)} className="p-2 rounded hover:bg-blue-100 dark:hover:bg-blue-900/30" title={t("recipes.cloneTooltip")}>
                    <Copy className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                  </button>
                  <button onClick={() => setDeleteTarget(recipe.id)} className="p-2 rounded hover:bg-red-100 dark:hover:bg-red-900/30" title={t("recipes.deleteTooltip")}>
                    <Trash2 className="w-4 h-4 text-red-500" />
                  </button>
                </div>
              </div>
            </div>
            );
          })
        )}
      </div>
      )}

      {/* Recipe Form Modal */}
      <Modal isOpen={showForm} onClose={() => setShowForm(false)} title={editingId ? t("recipes.editRecipeTitle") : t("recipes.newRecipeTitle")}>
        <form onSubmit={handleSubmit} onKeyDown={handleFormKeyDown} className={`space-y-4 transition-colors duration-500 ${saveSuccess ? 'bg-green-50 dark:bg-green-900/20 rounded-lg p-2 -m-2' : ''}`}>
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2 relative">
              <label className="label">{t("recipes.dishName")}</label>
              <input
                required
                className="input w-full"
                value={form.name}
                onChange={(e) => handleNameChange(e.target.value)}
                onFocus={() => { if (suggestions.length > 0) setShowSuggestions(true); }}
                placeholder={t("recipes.dishNamePlaceholder")}
                autoComplete="off"
              />
              {/* Enhanced Suggestions dropdown with preview cards */}
              {showSuggestions && suggestions.length > 0 && (
                <div className="absolute z-50 top-full left-0 right-0 mt-1 bg-white dark:bg-slate-700 rounded-lg shadow-xl border dark:border-slate-600 max-h-80 overflow-y-auto">
                  <div className="px-3 py-2 text-xs font-medium text-blue-600 dark:text-blue-400 border-b dark:border-slate-600 flex items-center gap-1">
                    <Sparkles className="w-3 h-3" /> {t("recipes.recipeSuggestions")}
                  </div>
                  {suggestions.slice(0, 8).map((tpl, idx) => {
                    const preview = getTemplatePreview(tpl);
                    return (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => applyTemplate(tpl)}
                        className="w-full text-left px-3 py-3 hover:bg-blue-50 dark:hover:bg-slate-600 transition-colors border-b dark:border-slate-600 last:border-0"
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <span className="font-medium text-slate-800 dark:text-slate-200">{tpl.name}</span>
                            <span className="ml-2 text-xs text-slate-400">{tpl.category}</span>
                          </div>
                          <span className="text-sm font-mono text-slate-500">{tpl.suggestedSellingPrice} &euro;</span>
                        </div>
                        <div className="text-xs text-slate-400 mt-0.5">{tpl.description}</div>
                        {/* Preview card with cost/margin estimates */}
                        <div className="flex items-center gap-3 mt-1.5 text-xs">
                          <span className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                            {tpl.suggestedIngredients.length} {t("recipes.ingredients")}
                          </span>
                          {preview.foundCount > 0 && (
                            <>
                              <span className="text-slate-500">
                                {t("recipes.estimatedCost")} : {preview.costPerPortion.toFixed(2)}&euro;
                              </span>
                              <span className={`font-medium ${preview.margin >= 70 ? 'text-green-600' : preview.margin >= 60 ? 'text-amber-600' : 'text-red-600'}`}>
                                {t("recipes.estimatedMargin")} : {preview.margin.toFixed(0)}%
                              </span>
                            </>
                          )}
                          {preview.foundCount < tpl.suggestedIngredients.length && (
                            <span className="text-amber-500">
                              {preview.foundCount}/{tpl.suggestedIngredients.length} {t("recipes.inDatabase")}
                            </span>
                          )}
                        </div>
                      </button>
                    );
                  })}
                  <button
                    type="button"
                    onClick={() => setShowSuggestions(false)}
                    className="w-full text-center px-3 py-2 text-xs text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
                  >
                    {t("recipes.closeSuggestions")}
                  </button>
                </div>
              )}
            </div>

            {/* Template apply info banner */}
            {templateApplyInfo && (
              <div className="col-span-2">
                <div className={`rounded-lg p-3 text-sm flex items-start gap-2 ${templateApplyInfo.missing.length > 0 ? 'bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800' : 'bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800'}`}>
                  {templateApplyInfo.missing.length > 0 ? (
                    <AlertTriangle className="w-4 h-4 text-amber-500 mt-0.5 flex-shrink-0" />
                  ) : (
                    <Check className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                  )}
                  <div>
                    <p className={templateApplyInfo.missing.length > 0 ? 'text-amber-700 dark:text-amber-300' : 'text-green-700 dark:text-green-300'}>
                      {t("recipes.ingredientsFoundOf").replace("{found}", String(templateApplyInfo.found)).replace("{total}", String(templateApplyInfo.total))}
                    </p>
                    {templateApplyInfo.missing.length > 0 && (
                      <div className="mt-1.5 space-y-1">
                        {templateApplyInfo.missing.map((name) => (
                          <div key={name} className="flex items-center gap-2">
                            <span className="text-amber-600 dark:text-amber-400 text-xs">{name}</span>
                            <Link
                              to="/ingredients"
                              className="text-xs text-blue-600 dark:text-blue-400 hover:underline font-medium"
                              onClick={() => setShowForm(false)}
                            >
                              {t("recipes.addMissing")}
                            </Link>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                  <button
                    type="button"
                    onClick={() => setTemplateApplyInfo(null)}
                    className="ml-auto p-0.5 text-slate-400 hover:text-slate-600 flex-shrink-0"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              </div>
            )}

            <div>
              <label className="label">{t("recipes.category")}</label>
              <select required className="input w-full" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}>
                {RECIPE_CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="label">{t("recipes.nbPortions")}</label>
              <input required type="number" min="1" className="input w-full" value={form.nbPortions} onChange={(e) => setForm({ ...form, nbPortions: e.target.value })} />
            </div>
            <div>
              <label className="label">{t("recipes.sellingPrice")}</label>
              <input required type="number" step="0.01" min="0" className="input w-full" value={form.sellingPrice} onChange={(e) => setForm({ ...form, sellingPrice: e.target.value })} />
            </div>
            <div>
              <label className="label">{t("recipes.description")}</label>
              <input className="input w-full" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
            </div>
          </div>

          {/* Timing and labor */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="label">{t("recipes.prepTime")}</label>
              <input type="number" min="0" className="input w-full" value={form.prepTimeMinutes} onChange={(e) => setForm({ ...form, prepTimeMinutes: e.target.value })} />
            </div>
            <div>
              <label className="label">{t("recipes.cookTime")}</label>
              <input type="number" min="0" className="input w-full" value={form.cookTimeMinutes} onChange={(e) => setForm({ ...form, cookTimeMinutes: e.target.value })} />
            </div>
            <div>
              <label className="label">{t("recipes.laborCostPerHour")}</label>
              <input type="number" step="0.01" min="0" className="input w-full" value={form.laborCostPerHour} onChange={(e) => setForm({ ...form, laborCostPerHour: e.target.value })} />
            </div>
          </div>

          {/* Live cost/margin preview - always visible */}
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-slate-700/50 dark:to-slate-700/30 rounded-lg p-4 border border-blue-100 dark:border-slate-600">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              <span className="text-sm font-semibold text-blue-800 dark:text-blue-300">{t("recipes.livePreview")}</span>
            </div>
            <div className="grid grid-cols-2 gap-x-6 gap-y-1 text-sm">
              <div className="flex justify-between text-slate-600 dark:text-slate-300">
                <span>{t("recipes.materialCost")}</span>
                <strong className="font-mono">{liveCost.toFixed(2)} &euro;</strong>
              </div>
              <div className="flex justify-between text-slate-600 dark:text-slate-300">
                <span>{t("recipes.costPerPortion")}</span>
                <strong className="font-mono">{liveCostPerPortion.toFixed(2)} &euro;</strong>
              </div>
              {liveLaborPerPortion > 0 && (
                <div className="flex justify-between text-slate-600 dark:text-slate-300">
                  <span>{t("recipes.laborPerPortion")}</span>
                  <strong className="font-mono">{liveLaborPerPortion.toFixed(2)} &euro;</strong>
                </div>
              )}
              <div className="flex justify-between text-slate-600 dark:text-slate-300">
                <span>{t("recipes.totalPerPortion")}</span>
                <strong className="font-mono">{liveTotalPerPortion.toFixed(2)} &euro;</strong>
              </div>
            </div>
            {liveSellingPrice > 0 && (
              <div className="flex items-center justify-between mt-2 pt-2 border-t border-blue-200 dark:border-slate-600">
                <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">{t("recipes.estimatedMarginLabel")}</span>
                <span className={`text-lg font-bold ${liveMargin >= 70 ? 'text-green-600' : liveMargin >= 60 ? 'text-amber-600' : 'text-red-600'}`}>
                  {liveMargin.toFixed(1)}%
                </span>
              </div>
            )}
          </div>

          {/* Ingredients */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="label mb-0">{t("recipes.ingredientsLabel")}</label>
              <button type="button" onClick={addIngredientLine} className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 font-medium">
                {t("recipes.addIngredient")}
              </button>
            </div>

            {/* Ingredient search/filter */}
            {formIngredients.length > 0 && ingredients.length > 10 && (
              <div className="relative mb-2">
                <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder={t("recipes.filterIngredients")}
                  value={ingredientSearch}
                  onChange={(e) => setIngredientSearch(e.target.value)}
                  className="input pl-8 w-full text-sm py-1.5"
                />
              </div>
            )}

            {formIngredients.length === 0 ? (
              <p className="text-sm text-slate-400 dark:text-slate-500 py-2">{t("recipes.noIngredients")}</p>
            ) : (
              <div className="space-y-2">
                {formIngredients.map((fi, idx) => {
                  const ing = ingredients.find((i) => i.id === fi.ingredientId);
                  const qty = parseFloat(fi.quantity) || 0;
                  const waste = parseFloat(fi.wastePercent) || 0;
                  const effectiveQty = qty * (1 + waste / 100);
                  const lineTotal = ing ? ing.pricePerUnit * effectiveQty : 0;
                  return (
                    <div key={idx} className="flex items-center gap-2 flex-wrap sm:flex-nowrap">
                      <select
                        className="input flex-1 min-w-[140px]"
                        value={fi.ingredientId}
                        onChange={(e) => {
                          const updated = [...formIngredients];
                          updated[idx].ingredientId = parseInt(e.target.value);
                          setFormIngredients(updated);
                        }}
                      >
                        {(ingredientSearch ? filteredIngredients : ingredients).map((i) => (
                          <option key={i.id} value={i.id}>{i.name} ({i.pricePerUnit.toFixed(2)}&euro;/{i.unit})</option>
                        ))}
                      </select>
                      <input
                        type="number"
                        step="0.001"
                        min="0"
                        placeholder={t("recipes.qtyPlaceholder")}
                        className="input w-20"
                        value={fi.quantity}
                        onChange={(e) => {
                          const updated = [...formIngredients];
                          updated[idx].quantity = e.target.value;
                          setFormIngredients(updated);
                        }}
                      />
                      <span className="text-xs text-slate-500 dark:text-slate-400 w-8">{ing?.unit}</span>
                      <input
                        type="number"
                        step="1"
                        min="0"
                        max="100"
                        placeholder={t("recipes.wastePlaceholder")}
                        className="input w-20"
                        value={fi.wastePercent}
                        onChange={(e) => {
                          const updated = [...formIngredients];
                          updated[idx].wastePercent = e.target.value;
                          setFormIngredients(updated);
                        }}
                        title={t("recipes.wasteTooltip")}
                      />
                      <span className="text-xs text-slate-400 w-4">%</span>
                      <span className={`text-sm font-mono w-20 text-right ${lineTotal > 0 ? 'text-slate-700 dark:text-slate-300' : 'text-slate-400'}`}>{lineTotal.toFixed(2)} &euro;</span>
                      <button type="button" onClick={() => removeIngredientLine(idx)} className="p-1 text-red-400 hover:text-red-600">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  );
                })}

                {/* Running total of food cost */}
                <div className="flex items-center justify-end gap-2 pt-2 border-t dark:border-slate-700">
                  <span className="text-sm text-slate-500 dark:text-slate-400">{t("recipes.materialTotal")}</span>
                  <span className="text-sm font-bold font-mono text-slate-800 dark:text-slate-200">{liveCost.toFixed(2)} &euro;</span>
                </div>
              </div>
            )}
          </div>

          <div className="flex items-center justify-between pt-2">
            <span className="text-xs text-slate-400">{t("recipes.ctrlEnterSave")}</span>
            <div className="flex gap-3">
              <button type="button" onClick={() => setShowForm(false)} className="btn-secondary">{t("recipes.cancel")}</button>
              <button
                type="submit"
                className={`btn-primary flex items-center gap-2 min-w-[140px] justify-center transition-all ${saveSuccess ? 'bg-green-600 hover:bg-green-700' : ''}`}
                disabled={saving}
              >
                {saving ? (
                  <><Loader2 className="w-4 h-4 animate-spin" /> {t("recipes.saving")}</>
                ) : saveSuccess ? (
                  <><Check className="w-4 h-4" /> {t("recipes.saved")}</>
                ) : (
                  editingId ? t("recipes.edit") : t("recipes.createRecipe")
                )}
              </button>
            </div>
          </div>
        </form>
      </Modal>

      {/* Delete Confirm */}
      <ConfirmDialog
        isOpen={deleteTarget !== null}
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeleteTarget(null)}
        title={t("recipes.deleteTitle")}
        message={t("recipes.deleteMessage")}
      />
    </div>
  );
}
