import { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import {
  GripVertical,
  Plus,
  X,
  ChefHat,
  DollarSign,
  Search,
  Save,
  FileDown,
  Share2,
  TrendingUp,
  BarChart3,
  Utensils,
  PieChart,
  AlertCircle,
  CheckCircle2,
  ArrowRight,
  Eye,
  EyeOff,
  Printer,
  AlertTriangle,
} from 'lucide-react';
import { fetchRecipes } from '../services/api';
import { useToast } from '../hooks/useToast';
import { useTranslation } from '../hooks/useTranslation';
import { useRestaurant } from '../hooks/useRestaurant';
import type { Recipe } from '../types';
import { RECIPE_CATEGORIES } from '../types';
import { updateOnboardingStep } from '../components/OnboardingWizard';
import FoodIllustration from '../components/FoodIllustration';

// ── Types ──

interface MenuSection {
  category: string;
  recipeIds: number[];
}

interface SavedMenu {
  id: string;
  name: string;
  sections: MenuSection[];
  createdAt: string;
  updatedAt: string;
}

// ── Category config ──

const SECTION_LABELS: Record<string, string> = {
  'Entree': 'Entrees',
  'Plat': 'Plats',
  'Dessert': 'Desserts',
  'Boisson': 'Boissons',
  'Accompagnement': 'Accompagnements',
};

const SECTION_ICONS: Record<string, string> = {
  'Entree': '🥗',
  'Plat': '🍽️',
  'Dessert': '🍰',
  'Boisson': '🥂',
  'Accompagnement': '🥖',
};

function getSectionLabel(cat: string): string {
  return SECTION_LABELS[cat] || cat;
}

function getSectionIcon(cat: string): string {
  return SECTION_ICONS[cat] || '📋';
}

// ── Category normalization ──

const CATEGORY_NORMALIZE: Record<string, string> = {
  'Entree': 'Entree',
  'Entrees': 'Entree',
  'Plats': 'Plat',
  'Desserts': 'Dessert',
  'Suggestions': 'Suggestion',
  'Accompagnements': 'Accompagnement',
  'Boissons': 'Boisson',
};

function normalizeCategory(cat: string): string {
  return CATEGORY_NORMALIZE[cat] || cat;
}

// ── Local storage helpers ──

function loadSavedMenu(): SavedMenu | null {
  try {
    const raw = localStorage.getItem('menuBuilder_currentMenu');
    if (raw) return JSON.parse(raw);
  } catch {}
  return null;
}

function saveSavedMenu(menu: SavedMenu) {
  localStorage.setItem('menuBuilder_currentMenu', JSON.stringify(menu));
}

// ── Drag data helpers ──

const DRAG_TYPE_POOL = 'pool-recipe';
const DRAG_TYPE_CANVAS = 'canvas-recipe';

// ── Component ──

export default function MenuBuilder() {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);
  const { showToast } = useToast();
  const { t } = useTranslation();
  const { selectedRestaurant, loading: restaurantLoading } = useRestaurant();

  // Menu state
  const [menuName, setMenuName] = useState('');
  const [menuSections, setMenuSections] = useState<Record<string, number[]>>({});
  const [searchQuery, setSearchQuery] = useState('');
  const [coversEstimate, setCoversEstimate] = useState(40);
  const [saving, setSaving] = useState(false);

  // Preview mode
  const [previewMode, setPreviewMode] = useState(false);

  // Drag state
  const [draggedRecipeId, setDraggedRecipeId] = useState<number | null>(null);
  const [dragSource, setDragSource] = useState<'pool' | 'canvas' | null>(null);
  const [dragSourceCategory, setDragSourceCategory] = useState<string | null>(null);
  const [dragOverCategory, setDragOverCategory] = useState<string | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);

  // Refs
  const dragGhostRef = useRef<HTMLDivElement>(null);

  // ── Load recipes ──

  useEffect(() => {
    if (restaurantLoading) return;
    if (!selectedRestaurant) {
      setLoading(false);
      return;
    }
    setLoading(true);
    fetchRecipes()
      .then((data) => {
        setRecipes(data);
        // Load saved menu
        const saved = loadSavedMenu();
        if (saved) {
          setMenuName(saved.name);
          const sections: Record<string, number[]> = {};
          saved.sections.forEach((s) => {
            sections[s.category] = s.recipeIds;
          });
          setMenuSections(sections);
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [selectedRestaurant, restaurantLoading]);

  // ── Recipe lookup ──

  const recipeMap = useMemo(() => {
    const map = new Map<number, Recipe>();
    recipes.forEach((r) => map.set(r.id, r));
    return map;
  }, [recipes]);

  // ── All recipe IDs currently on the menu canvas ──

  const menuRecipeIds = useMemo(() => {
    const set = new Set<number>();
    Object.values(menuSections).forEach((ids) => ids.forEach((id) => set.add(id)));
    return set;
  }, [menuSections]);

  // ── Pool recipes (not on canvas), grouped by category ──

  const poolRecipes = useMemo(() => {
    let list = recipes.filter((r) => !menuRecipeIds.has(r.id));
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter((r) => r.name.toLowerCase().includes(q));
    }
    const groups = new Map<string, Recipe[]>();
    RECIPE_CATEGORIES.forEach((cat) => groups.set(cat, []));
    list.forEach((r) => {
      const cat = normalizeCategory(r.category);
      const arr = groups.get(cat) || [];
      arr.push(r);
      groups.set(cat, arr);
    });
    return groups;
  }, [recipes, menuRecipeIds, searchQuery]);

  // ── Canvas section recipes (resolved) ──

  const canvasSections = useMemo(() => {
    return RECIPE_CATEGORIES.map((cat) => {
      const ids = menuSections[cat] || [];
      const resolved = ids.map((id) => recipeMap.get(id)).filter(Boolean) as Recipe[];
      return { category: cat, recipes: resolved };
    });
  }, [menuSections, recipeMap]);

  // ── Stats ──

  const menuRecipes = useMemo(() => {
    const all: Recipe[] = [];
    Object.values(menuSections).forEach((ids) => {
      ids.forEach((id) => {
        const r = recipeMap.get(id);
        if (r) all.push(r);
      });
    });
    return all;
  }, [menuSections, recipeMap]);

  const stats = useMemo(() => {
    const totalItems = menuRecipes.length;
    if (totalItems === 0)
      return {
        totalItems: 0,
        avgFoodCostPercent: 0,
        avgMarginPercent: 0,
        revenuePotential: 0,
        categoryDistribution: [] as { category: string; count: number; foodCost: number }[],
        menuBalance: 'empty' as 'empty' | 'poor' | 'fair' | 'good' | 'excellent',
      };

    const avgFoodCostPercent =
      menuRecipes.reduce((s, r) => s + (100 - r.margin.marginPercent), 0) / totalItems;
    const avgMarginPercent =
      menuRecipes.reduce((s, r) => s + r.margin.marginPercent, 0) / totalItems;
    const avgPrice = menuRecipes.reduce((s, r) => s + r.sellingPrice, 0) / totalItems;
    const revenuePotential = avgPrice * coversEstimate;

    const catCounts = new Map<string, { count: number; totalFoodCost: number }>();
    menuRecipes.forEach((r) => {
      const cat = normalizeCategory(r.category);
      const prev = catCounts.get(cat) || { count: 0, totalFoodCost: 0 };
      catCounts.set(cat, {
        count: prev.count + 1,
        totalFoodCost: prev.totalFoodCost + (100 - r.margin.marginPercent),
      });
    });

    const categoryDistribution = RECIPE_CATEGORIES.map((cat) => {
      const data = catCounts.get(cat) || { count: 0, totalFoodCost: 0 };
      return {
        category: cat,
        count: data.count,
        foodCost: data.count > 0 ? data.totalFoodCost / data.count : 0,
      };
    }).filter((d) => d.count > 0);

    // Menu balance: check if there's a good diversity of categories
    const categoriesWithItems = categoryDistribution.length;
    const hasEntrees = (menuSections['Entree'] || menuSections['Entree'] || []).length > 0;
    const hasPlats = (menuSections['Plat'] || []).length > 0;
    const hasDesserts = (menuSections['Dessert'] || []).length > 0;

    let menuBalance: 'empty' | 'poor' | 'fair' | 'good' | 'excellent' = 'poor';
    if (categoriesWithItems >= 4 && avgMarginPercent >= 65) menuBalance = 'excellent';
    else if (categoriesWithItems >= 3 && hasEntrees && hasPlats && hasDesserts) menuBalance = 'good';
    else if (categoriesWithItems >= 2) menuBalance = 'fair';

    return { totalItems, avgFoodCostPercent, avgMarginPercent, revenuePotential, categoryDistribution, menuBalance };
  }, [menuRecipes, coversEstimate, menuSections]);

  // ── Add recipe to section ──

  const addRecipeToSection = useCallback((recipeId: number, category: string, insertIndex?: number) => {
    setMenuSections((prev) => {
      // Remove from any existing section first
      const cleaned: Record<string, number[]> = {};
      Object.entries(prev).forEach(([cat, ids]) => {
        cleaned[cat] = ids.filter((id) => id !== recipeId);
      });
      const arr = [...(cleaned[category] || [])];
      if (insertIndex !== undefined && insertIndex >= 0 && insertIndex <= arr.length) {
        arr.splice(insertIndex, 0, recipeId);
      } else {
        arr.push(recipeId);
      }
      cleaned[category] = arr;
      return cleaned;
    });
  }, []);

  // ── Remove recipe from section ──

  const removeRecipeFromSection = useCallback((recipeId: number, category: string) => {
    setMenuSections((prev) => {
      const arr = (prev[category] || []).filter((id) => id !== recipeId);
      return { ...prev, [category]: arr };
    });
  }, []);

  // ── Drag & Drop handlers ──

  const handleDragStart = useCallback(
    (e: React.DragEvent, recipeId: number, source: 'pool' | 'canvas', sourceCategory?: string) => {
      setDraggedRecipeId(recipeId);
      setDragSource(source);
      setDragSourceCategory(sourceCategory || null);

      e.dataTransfer.effectAllowed = 'move';
      e.dataTransfer.setData('text/plain', String(recipeId));

      // Make the dragged element semi-transparent
      const el = e.currentTarget as HTMLElement;
      requestAnimationFrame(() => {
        el.style.opacity = '0.4';
      });
    },
    [],
  );

  const handleDragEnd = useCallback((e: React.DragEvent) => {
    const el = e.currentTarget as HTMLElement;
    el.style.opacity = '1';
    setDraggedRecipeId(null);
    setDragSource(null);
    setDragSourceCategory(null);
    setDragOverCategory(null);
    setDragOverIndex(null);
  }, []);

  const handleDropZoneDragOver = useCallback((e: React.DragEvent, category: string) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    setDragOverCategory(category);
  }, []);

  const handleDropZoneDragLeave = useCallback((e: React.DragEvent) => {
    // Only clear if we actually left the zone
    const related = e.relatedTarget as HTMLElement | null;
    if (!related || !(e.currentTarget as HTMLElement).contains(related)) {
      setDragOverCategory(null);
      setDragOverIndex(null);
    }
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent, targetCategory: string, insertIndex?: number) => {
      e.preventDefault();
      const recipeId = parseInt(e.dataTransfer.getData('text/plain'), 10);
      if (!isNaN(recipeId)) {
        addRecipeToSection(recipeId, targetCategory, insertIndex);
      }
      setDragOverCategory(null);
      setDragOverIndex(null);
      setDraggedRecipeId(null);
      setDragSource(null);
      setDragSourceCategory(null);
    },
    [addRecipeToSection],
  );

  const handleCardDragOver = useCallback(
    (e: React.DragEvent, category: string, index: number) => {
      e.preventDefault();
      e.stopPropagation();
      e.dataTransfer.dropEffect = 'move';
      setDragOverCategory(category);
      setDragOverIndex(index);
    },
    [],
  );

  // ── Save menu ──

  const handleSave = useCallback(async () => {
    if (!menuName.trim()) {
      showToast('Veuillez donner un nom au menu', 'error');
      return;
    }
    setSaving(true);
    try {
      const menu: SavedMenu = {
        id: Date.now().toString(),
        name: menuName,
        sections: RECIPE_CATEGORIES.map((cat) => ({
          category: cat,
          recipeIds: menuSections[cat] || [],
        })).filter((s) => s.recipeIds.length > 0),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      saveSavedMenu(menu);
      showToast('Menu enregistre avec succes', 'success');
      updateOnboardingStep('menuCreated', true);
    } catch {
      showToast('Erreur lors de l\'enregistrement', 'error');
    }
    setSaving(false);
  }, [menuName, menuSections, showToast]);

  // ── Print menu ──

  const handlePrintMenu = useCallback(() => {
    const printWin = window.open('', '_blank');
    if (!printWin) return;
    const restaurantName = (() => {
      try {
        const settings = localStorage.getItem('restaurant-settings');
        if (settings) {
          const parsed = JSON.parse(settings);
          return parsed.name || parsed.restaurantName || 'Restaurant';
        }
      } catch { /* */ }
      return 'Restaurant';
    })();

    const sections = canvasSections.filter(s => s.recipes.length > 0);
    const sectionHtml = sections.map(s => `
      <div class="section">
        <div class="section-header">
          <span class="section-icon">${getSectionIcon(s.category)}</span>
          <span class="section-title">${getSectionLabel(s.category)}</span>
        </div>
        <div class="items">
          ${s.recipes.map(r => `
            <div class="item">
              <div class="item-main">
                <span class="item-name">${r.name}</span>
                ${r.description ? `<span class="item-desc">${r.description}</span>` : ''}
              </div>
              <span class="item-price">${r.sellingPrice.toFixed(2)} EUR</span>
            </div>
          `).join('')}
        </div>
      </div>
    `).join('');

    printWin.document.write(`
      <html><head><title>Menu - ${restaurantName}</title>
      <style>
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700&family=Inter:wght@300;400;500&display=swap');
        body { font-family: 'Inter', sans-serif; max-width: 700px; margin: 0 auto; padding: 40px 30px; color: #111; }
        .header { text-align: center; margin-bottom: 40px; border-bottom: 2px solid #111; padding-bottom: 20px; }
        .header h1 { font-family: 'Playfair Display', serif; font-size: 32px; margin: 0 0 4px; letter-spacing: 2px; text-transform: uppercase; }
        .header p { font-size: 11px; color: #999; letter-spacing: 3px; text-transform: uppercase; }
        .section { margin-bottom: 30px; }
        .section-header { display: flex; align-items: center; gap: 8px; margin-bottom: 12px; padding-bottom: 6px; border-bottom: 1px solid #e5e7eb; }
        .section-icon { font-size: 18px; }
        .section-title { font-family: 'Playfair Display', serif; font-size: 18px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; }
        .item { display: flex; align-items: baseline; justify-content: space-between; padding: 8px 0; border-bottom: 1px dotted #e5e7eb; }
        .item-main { flex: 1; min-width: 0; }
        .item-name { font-weight: 500; font-size: 14px; }
        .item-desc { display: block; font-size: 11px; color: #888; margin-top: 2px; font-style: italic; }
        .item-price { font-weight: 600; font-size: 14px; margin-left: 16px; white-space: nowrap; }
        .footer { text-align: center; margin-top: 40px; font-size: 10px; color: #aaa; border-top: 1px solid #e5e7eb; padding-top: 12px; }
      </style></head><body>
      <div class="header">
        <h1>${restaurantName}</h1>
        <p>${menuName || 'Menu'}</p>
      </div>
      ${sectionHtml}
      <div class="footer">Merci de votre visite</div>
      </body></html>
    `);
    printWin.document.close();
    printWin.print();
  }, [canvasSections, menuName]);

  // ── Export PDF placeholder ──

  const handleExportPDF = useCallback(() => {
    showToast('Export PDF bientot disponible ! Utilisez Imprimer > PDF pour le moment.', 'info');
  }, [showToast]);

  // ── Allergen keywords for card badges ──

  const ALLERGEN_KEYWORDS: { allergen: string; icon: string; keywords: string[] }[] = [
    { allergen: 'Gluten', icon: '\u{1F33E}', keywords: ['farine', 'ble', 'pain', 'pate', 'semoule'] },
    { allergen: 'Lait', icon: '\u{1F95B}', keywords: ['lait', 'creme', 'beurre', 'fromage', 'yaourt'] },
    { allergen: 'Oeufs', icon: '\u{1F95A}', keywords: ['oeuf', 'oeufs'] },
    { allergen: 'Poissons', icon: '\u{1F41F}', keywords: ['poisson', 'saumon', 'cabillaud', 'thon', 'truite'] },
    { allergen: 'Crustaces', icon: '\u{1F990}', keywords: ['crevette', 'homard', 'crabe', 'langoustine'] },
    { allergen: 'Fruits a coque', icon: '\u{1F330}', keywords: ['amande', 'noisette', 'noix', 'pistache'] },
  ];

  const getRecipeAllergens = useCallback((recipe: Recipe): { allergen: string; icon: string }[] => {
    const detected: { allergen: string; icon: string }[] = [];
    const names = recipe.ingredients?.map(ri => ri.ingredient?.name?.toLowerCase() || '') || [];
    for (const { allergen, icon, keywords } of ALLERGEN_KEYWORDS) {
      if (names.some(n => keywords.some(kw => n.includes(kw)))) {
        detected.push({ allergen, icon });
      }
    }
    return detected;
  }, []);

  // ── Margin color helper ──

  const marginColor = (margin: number) => {
    if (margin >= 70) return 'text-emerald-400';
    if (margin >= 60) return 'text-amber-400';
    return 'text-red-400';
  };

  const marginBg = (margin: number) => {
    if (margin >= 70) return 'bg-emerald-500/20 text-emerald-400';
    if (margin >= 60) return 'bg-amber-500/20 text-amber-400';
    return 'bg-red-500/20 text-red-400';
  };

  // ── Loading ──

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-2 border-teal-500 border-t-transparent rounded-full animate-spin" />
          <span className="text-[#9CA3AF] dark:text-[#737373] text-sm">Chargement des recettes...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="h-[calc(100vh-80px)] flex flex-col bg-white dark:bg-black -m-4 sm:-m-6">
      {/* ── Header ── */}
      <div className="flex-none px-4 py-3 bg-white dark:bg-black border-b border-[#E5E7EB] dark:border-[#1A1A1A] flex items-center gap-4">
        <div className="flex items-center gap-2">
          <ChefHat className="w-6 h-6 text-teal-400" />
          <h1 className="text-lg font-bold font-satoshi text-[#111111] dark:text-white tracking-tight">Compositeur de Menu</h1>
        </div>
        <div className="flex-1" />
        <div className="flex items-center gap-3">
          <span className="text-xs text-[#6B7280] dark:text-[#A3A3A3]">{stats.totalItems} plat{stats.totalItems !== 1 ? 's' : ''}</span>
          <button
            onClick={() => setPreviewMode(!previewMode)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              previewMode
                ? 'bg-[#111111] dark:bg-white text-white dark:text-[#111111]'
                : 'bg-[#FAFAFA] dark:bg-[#0A0A0A] text-[#6B7280] dark:text-[#A3A3A3] border border-[#E5E7EB] dark:border-[#1A1A1A] hover:border-[#111111] dark:hover:border-white'
            }`}
          >
            {previewMode ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
            {previewMode ? 'Editeur' : 'Apercu'}
          </button>
          <button
            onClick={handlePrintMenu}
            disabled={stats.totalItems === 0}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-[#FAFAFA] dark:bg-[#0A0A0A] text-[#6B7280] dark:text-[#A3A3A3] border border-[#E5E7EB] dark:border-[#1A1A1A] hover:border-[#111111] dark:hover:border-white transition-all disabled:opacity-40"
          >
            <Printer className="w-3.5 h-3.5" />
            Imprimer
          </button>
          <button
            onClick={handleExportPDF}
            disabled={stats.totalItems === 0}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-[#FAFAFA] dark:bg-[#0A0A0A] text-[#6B7280] dark:text-[#A3A3A3] border border-[#E5E7EB] dark:border-[#1A1A1A] hover:border-[#111111] dark:hover:border-white transition-all disabled:opacity-40"
          >
            <FileDown className="w-3.5 h-3.5" />
            PDF
          </button>
        </div>
      </div>

      {/* ── Main 3-panel layout ── */}
      <div className="flex-1 flex overflow-hidden">
        {/* ═══════ LEFT SIDEBAR — Recipe Pool ═══════ */}
        <div className="w-72 xl:w-80 flex-none bg-white dark:bg-black border-r border-[#E5E7EB] dark:border-[#1A1A1A] flex flex-col overflow-hidden">
          {/* Search */}
          <div className="flex-none p-3 border-b border-[#E5E7EB] dark:border-[#1A1A1A]">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6B7280] dark:text-[#A3A3A3]" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Rechercher une recette..."
                className="w-full pl-9 pr-3 py-2 bg-[#FAFAFA] dark:bg-[#0A0A0A] border border-[#E5E7EB] dark:border-[#1A1A1A] rounded-lg text-sm text-[#111111] dark:text-white placeholder:text-[#6B7280] dark:text-[#A3A3A3] focus:ring-2 focus:ring-[#111111] dark:ring-white/50 focus:border-teal-500 outline-none transition-all"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-[#6B7280] dark:text-[#A3A3A3] hover:text-[#6B7280] dark:text-[#A3A3A3]"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
            <p className="text-[11px] text-[#6B7280] dark:text-[#A3A3A3] mt-2 pl-1">
              Glissez les recettes vers le menu
            </p>
          </div>

          {/* Recipe list */}
          <div className="flex-1 overflow-y-auto custom-scrollbar">
            {Array.from(poolRecipes.entries()).map(([category, categoryRecipes]) => {
              if (categoryRecipes.length === 0) return null;
              return (
                <div key={category} className="border-b border-[#E5E7EB] dark:border-[#1A1A1A]/50">
                  <div className="px-3 py-2 sticky top-0 bg-white dark:bg-black/95 backdrop-blur-sm z-10">
                    <h3 className="text-[11px] font-semibold text-teal-400 uppercase tracking-wider flex items-center gap-1.5">
                      <span>{getSectionIcon(category)}</span>
                      {getSectionLabel(category)}
                      <span className="text-[#6B7280] dark:text-[#A3A3A3] font-normal ml-auto">{categoryRecipes.length}</span>
                    </h3>
                  </div>
                  <div className="px-2 pb-2 space-y-1">
                    {categoryRecipes.map((recipe) => (
                      <div
                        key={recipe.id}
                        draggable
                        onDragStart={(e) => handleDragStart(e, recipe.id, 'pool')}
                        onDragEnd={handleDragEnd}
                        className={`group bg-[#FAFAFA] dark:bg-[#0A0A0A] border border-[#E5E7EB] dark:border-[#1A1A1A] rounded-lg p-3 cursor-grab active:cursor-grabbing transition-all duration-200 hover:border-teal-500/50 hover:bg-[#F3F4F6] dark:hover:bg-[#171717]/80 ${
                          draggedRecipeId === recipe.id ? 'opacity-40 scale-95' : ''
                        }`}
                      >
                        <div className="flex items-start gap-2">
                          <GripVertical className="w-4 h-4 text-[#6B7280] dark:text-[#A3A3A3] mt-0.5 shrink-0 group-hover:text-[#9CA3AF] dark:text-[#737373] transition-colors" />
                          <div className="flex-1 min-w-0">
                            <div className="text-sm font-medium text-[#111111] dark:text-white truncate">{recipe.name}</div>
                            <div className="flex items-center gap-3 mt-1">
                              <span className="text-[11px] text-[#6B7280] dark:text-[#A3A3A3] flex items-center gap-1">
                                <DollarSign className="w-3 h-3" />
                                {(100 - recipe.margin.marginPercent).toFixed(1)}% cout
                              </span>
                              <span className="text-[11px] text-[#9CA3AF] dark:text-[#737373]">
                                {recipe.sellingPrice.toFixed(2)} EUR
                              </span>
                              <span className={`text-[11px] font-semibold ${marginColor(recipe.margin.marginPercent)}`}>
                                {recipe.margin.marginPercent.toFixed(0)}%
                              </span>
                            </div>
                          </div>
                          <button
                            onClick={() => addRecipeToSection(recipe.id, normalizeCategory(recipe.category))}
                            className="shrink-0 p-1 rounded-md opacity-0 group-hover:opacity-100 hover:bg-[#333] dark:hover:bg-[#E5E5E5]/20 text-teal-400 transition-all"
                            title="Ajouter au menu"
                          >
                            <Plus className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
            {/* Pool empty state */}
            {Array.from(poolRecipes.values()).every((arr) => arr.length === 0) && (
              <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
                <CheckCircle2 className="w-10 h-10 text-teal-500/50 mb-3" />
                <p className="text-sm text-[#6B7280] dark:text-[#A3A3A3]">
                  {searchQuery ? 'Aucune recette trouvee' : 'Toutes les recettes sont sur le menu'}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* ═══════ CENTER — Menu Canvas / Preview ═══════ */}
        <div className="flex-1 flex flex-col overflow-hidden bg-white dark:bg-black">
          {/* Canvas header */}
          <div className="flex-none px-6 py-3 border-b border-[#E5E7EB] dark:border-[#1A1A1A] flex items-center gap-3">
            <Utensils className="w-5 h-5 text-teal-400" />
            <span className="text-sm font-semibold text-[#111111] dark:text-white">
              {previewMode ? 'Apercu client' : 'Composition du menu'}
            </span>
            <div className="flex-1" />
            <div className="flex items-center gap-4 text-[11px] text-[#6B7280] dark:text-[#A3A3A3]">
              <span>{stats.totalItems} plats</span>
              <span className="w-px h-3 bg-[#F3F4F6] dark:bg-[#171717]" />
              <span>Food cost moy. {stats.avgFoodCostPercent.toFixed(1)}%</span>
              <span className="w-px h-3 bg-[#F3F4F6] dark:bg-[#171717]" />
              <span className={marginColor(stats.avgMarginPercent)}>
                Marge moy. {stats.avgMarginPercent.toFixed(1)}%
              </span>
            </div>
          </div>

          {/* Canvas body - scrollable sections */}
          <div className="flex-1 overflow-y-auto p-6 custom-scrollbar">
            <div className="max-w-4xl mx-auto space-y-6">

              {/* ── PREVIEW MODE ── */}
              {previewMode ? (
                <div className="space-y-8">
                  {/* Preview header */}
                  <div className="text-center py-8 border-b-2 border-[#111111] dark:border-white">
                    <h2 className="text-3xl font-bold text-[#111111] dark:text-white tracking-widest uppercase" style={{ fontFamily: 'Georgia, serif' }}>
                      {menuName || 'Notre Menu'}
                    </h2>
                    <p className="text-xs text-[#9CA3AF] dark:text-[#737373] mt-2 tracking-[0.3em] uppercase">Bonne degustation</p>
                  </div>

                  {canvasSections.filter(s => s.recipes.length > 0).map((section) => (
                    <div key={section.category} className="space-y-4">
                      {/* Preview section header */}
                      <div className="text-center">
                        <span className="text-2xl">{getSectionIcon(section.category)}</span>
                        <h3 className="text-lg font-bold text-[#111111] dark:text-white uppercase tracking-[0.2em] mt-1" style={{ fontFamily: 'Georgia, serif' }}>
                          {getSectionLabel(section.category)}
                        </h3>
                        <div className="w-12 h-0.5 bg-[#111111] dark:bg-white mx-auto mt-2" />
                      </div>

                      {/* Preview cards grid */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {section.recipes.map((recipe) => {
                          const allergens = getRecipeAllergens(recipe);
                          return (
                            <div
                              key={recipe.id}
                              className="bg-[#FAFAFA] dark:bg-[#0A0A0A] border border-[#E5E7EB] dark:border-[#1A1A1A] rounded-2xl overflow-hidden hover:shadow-lg transition-shadow"
                            >
                              {/* Photo placeholder */}
                              <div className="h-32 bg-gradient-to-br from-[#F3F4F6] to-[#E5E7EB] dark:from-[#171717] dark:to-[#0A0A0A] flex items-center justify-center relative">
                                <FoodIllustration recipeName={recipe.name} category={recipe.category} size="lg" />
                                <span className={`absolute top-2 right-2 text-[10px] px-2 py-0.5 rounded-full font-bold ${marginBg(recipe.margin.marginPercent)}`}>
                                  {recipe.margin.marginPercent.toFixed(0)}% marge
                                </span>
                              </div>
                              <div className="p-4">
                                <div className="flex items-start justify-between gap-2">
                                  <div className="flex-1 min-w-0">
                                    <h4 className="text-sm font-bold text-[#111111] dark:text-white truncate">{recipe.name}</h4>
                                    {recipe.description && (
                                      <p className="text-[11px] text-[#6B7280] dark:text-[#A3A3A3] mt-1 line-clamp-2">{recipe.description}</p>
                                    )}
                                  </div>
                                  <span className="text-lg font-bold text-[#111111] dark:text-white shrink-0">
                                    {recipe.sellingPrice.toFixed(2)}<span className="text-xs font-normal ml-0.5">EUR</span>
                                  </span>
                                </div>
                                {/* Allergen icons */}
                                {allergens.length > 0 && (
                                  <div className="flex items-center gap-1 mt-2">
                                    <AlertTriangle className="w-3 h-3 text-amber-500" />
                                    {allergens.map(a => (
                                      <span key={a.allergen} className="text-[10px] px-1.5 py-0.5 rounded bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 font-medium" title={a.allergen}>
                                        {a.icon} {a.allergen}
                                      </span>
                                    ))}
                                  </div>
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  ))}

                  {stats.totalItems === 0 && (
                    <div className="text-center py-16">
                      <Utensils className="w-12 h-12 mx-auto mb-3 text-[#6B7280] dark:text-[#A3A3A3] opacity-30" />
                      <p className="text-sm text-[#6B7280] dark:text-[#A3A3A3]">Le menu est vide. Ajoutez des plats pour voir l'apercu.</p>
                    </div>
                  )}
                </div>
              ) : (
              /* ── EDITOR MODE ── */
              <>
              {canvasSections.map((section) => {
                const isDragOver = dragOverCategory === section.category;
                const isEmpty = section.recipes.length === 0;

                // Gradient config per category
                const SECTION_GRADIENTS: Record<string, string> = {
                  'Entree': 'from-emerald-500/10 via-transparent to-transparent dark:from-emerald-500/5',
                  'Plat': 'from-orange-500/10 via-transparent to-transparent dark:from-orange-500/5',
                  'Dessert': 'from-pink-500/10 via-transparent to-transparent dark:from-pink-500/5',
                  'Boisson': 'from-blue-500/10 via-transparent to-transparent dark:from-blue-500/5',
                  'Accompagnement': 'from-amber-500/10 via-transparent to-transparent dark:from-amber-500/5',
                };

                return (
                  <div
                    key={section.category}
                    onDragOver={(e) => handleDropZoneDragOver(e, section.category)}
                    onDragLeave={handleDropZoneDragLeave}
                    onDrop={(e) => handleDrop(e, section.category)}
                    className={`rounded-2xl border-2 border-dashed transition-all duration-300 overflow-hidden ${
                      isDragOver
                        ? 'border-teal-500 bg-teal-500/10 shadow-lg shadow-teal-500/5'
                        : isEmpty
                        ? 'border-[#E5E7EB] dark:border-[#1A1A1A] bg-white dark:bg-black/30'
                        : 'border-[#E5E7EB] dark:border-[#1A1A1A] bg-white dark:bg-black/50'
                    }`}
                  >
                    {/* Section header with gradient */}
                    <div className={`px-4 py-3 flex items-center gap-3 bg-gradient-to-r ${SECTION_GRADIENTS[section.category] || 'from-gray-500/10 via-transparent to-transparent'}`}>
                      <span className="text-xl">{getSectionIcon(section.category)}</span>
                      <div>
                        <h3 className="text-sm font-bold text-[#111111] dark:text-white uppercase tracking-wider">
                          {getSectionLabel(section.category)}
                        </h3>
                        <span className="text-[10px] text-[#6B7280] dark:text-[#A3A3A3]">
                          {section.recipes.length} plat{section.recipes.length !== 1 ? 's' : ''}
                        </span>
                      </div>
                      {isDragOver && (
                        <span className="ml-auto text-[11px] text-teal-400 flex items-center gap-1 animate-pulse">
                          <ArrowRight className="w-3 h-3" />
                          Deposer ici
                        </span>
                      )}
                    </div>

                    {/* Recipes in section */}
                    {section.recipes.length > 0 ? (
                      <div className="px-3 pb-3 space-y-1.5 pt-1">
                        {section.recipes.map((recipe, idx) => {
                          const allergens = getRecipeAllergens(recipe);
                          return (
                            <div
                              key={recipe.id}
                              draggable
                              onDragStart={(e) => handleDragStart(e, recipe.id, 'canvas', section.category)}
                              onDragEnd={handleDragEnd}
                              onDragOver={(e) => handleCardDragOver(e, section.category, idx)}
                              onDrop={(e) => {
                                e.stopPropagation();
                                handleDrop(e, section.category, idx);
                              }}
                              className={`group flex items-center gap-3 bg-[#FAFAFA] dark:bg-[#0A0A0A] border border-[#E5E7EB] dark:border-[#1A1A1A] rounded-xl p-3 cursor-grab active:cursor-grabbing transition-all duration-200 hover:border-[#D1D5DB] dark:hover:border-[#333] ${
                                draggedRecipeId === recipe.id ? 'opacity-40 scale-95' : ''
                              } ${
                                dragOverCategory === section.category && dragOverIndex === idx
                                  ? 'ring-2 ring-[#111111] dark:ring-white/50 bg-teal-500/10 border-teal-500/30'
                                  : ''
                              }`}
                            >
                              <GripVertical className="w-4 h-4 text-[#D1D5DB] dark:text-[#333] shrink-0 group-hover:text-[#9CA3AF] dark:text-[#737373]" />
                              {/* Photo placeholder */}
                              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#F3F4F6] to-[#E5E7EB] dark:from-[#171717] dark:to-[#0A0A0A] flex items-center justify-center shrink-0 overflow-hidden">
                                <FoodIllustration recipeName={recipe.name} category={recipe.category} size="sm" />
                              </div>
                              <div className="flex-1 min-w-0 flex items-center gap-3">
                                <div className="flex-1 min-w-0">
                                  <span className="text-sm font-medium text-[#111111] dark:text-white truncate block">
                                    {recipe.name}
                                  </span>
                                  <div className="flex items-center gap-2 mt-0.5">
                                    {recipe.description && (
                                      <span className="text-[11px] text-[#6B7280] dark:text-[#A3A3A3] truncate block max-w-[200px]">
                                        {recipe.description}
                                      </span>
                                    )}
                                    {/* Allergen icons inline */}
                                    {allergens.length > 0 && (
                                      <span className="flex items-center gap-0.5 shrink-0">
                                        {allergens.slice(0, 3).map(a => (
                                          <span key={a.allergen} className="text-[10px]" title={a.allergen}>{a.icon}</span>
                                        ))}
                                        {allergens.length > 3 && <span className="text-[9px] text-amber-500">+{allergens.length - 3}</span>}
                                      </span>
                                    )}
                                  </div>
                                </div>
                                <div className="flex items-center gap-3 shrink-0">
                                  <span className="text-xs font-semibold text-[#111111] dark:text-white">
                                    {recipe.sellingPrice.toFixed(2)} EUR
                                  </span>
                                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${marginBg(recipe.margin.marginPercent)}`}>
                                    {recipe.margin.marginPercent.toFixed(0)}%
                                  </span>
                                  <span className="text-[10px] text-[#6B7280] dark:text-[#A3A3A3]">
                                    FC {(100 - recipe.margin.marginPercent).toFixed(0)}%
                                  </span>
                                </div>
                              </div>
                              <button
                                onClick={() => removeRecipeFromSection(recipe.id, section.category)}
                                className="shrink-0 p-1.5 rounded-lg opacity-0 group-hover:opacity-100 hover:bg-red-500/20 text-red-400 transition-all"
                                title="Retirer du menu"
                              >
                                <X className="w-4 h-4" />
                              </button>
                            </div>
                          );
                        })}
                      </div>
                    ) : (
                      <div className={`px-3 pb-4 transition-all ${isDragOver ? 'py-4' : 'py-2'}`}>
                        <div
                          className={`flex items-center justify-center py-6 rounded-xl border border-dashed transition-all ${
                            isDragOver
                              ? 'border-teal-500/50 bg-teal-500/5'
                              : 'border-[#E5E7EB] dark:border-[#1A1A1A] bg-white dark:bg-black/20'
                          }`}
                        >
                          <span className={`text-xs ${isDragOver ? 'text-teal-400' : 'text-[#6B7280] dark:text-[#A3A3A3]'}`}>
                            {isDragOver ? 'Deposer pour ajouter' : 'Glissez des recettes ici'}
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
              </>
              )}
            </div>
          </div>
        </div>

        {/* ═══════ RIGHT SIDEBAR — Stats ═══════ */}
        <div className="w-72 xl:w-80 flex-none bg-white dark:bg-black border-l border-[#E5E7EB] dark:border-[#1A1A1A] flex flex-col overflow-hidden">
          <div className="flex-none px-4 py-3 border-b border-[#E5E7EB] dark:border-[#1A1A1A]">
            <h3 className="text-sm font-semibold text-[#111111] dark:text-white flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-teal-400" />
              Statistiques du menu
            </h3>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
            {/* Stat cards */}
            <div className="grid grid-cols-2 gap-3">
              <StatCard
                label="Plats total"
                value={String(stats.totalItems)}
                icon={<ChefHat className="w-4 h-4" />}
                color="teal"
              />
              <StatCard
                label="Food Cost moy."
                value={`${stats.avgFoodCostPercent.toFixed(1)}%`}
                icon={<DollarSign className="w-4 h-4" />}
                color={stats.avgFoodCostPercent <= 30 ? 'green' : stats.avgFoodCostPercent <= 35 ? 'amber' : 'red'}
              />
              <StatCard
                label="Marge moy."
                value={`${stats.avgMarginPercent.toFixed(1)}%`}
                icon={<TrendingUp className="w-4 h-4" />}
                color={stats.avgMarginPercent >= 70 ? 'green' : stats.avgMarginPercent >= 60 ? 'amber' : 'red'}
              />
              <StatCard
                label="CA potentiel"
                value={`${stats.revenuePotential.toFixed(0)} EUR`}
                icon={<BarChart3 className="w-4 h-4" />}
                color="purple"
              />
            </div>

            {/* Covers estimate */}
            <div className="bg-[#FAFAFA] dark:bg-[#0A0A0A]/50 backdrop-blur rounded-lg p-3">
              <label className="text-[11px] text-[#6B7280] dark:text-[#A3A3A3] uppercase tracking-wider block mb-2">
                Couverts estimes / service
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="range"
                  min="10"
                  max="200"
                  step="5"
                  value={coversEstimate}
                  onChange={(e) => setCoversEstimate(Number(e.target.value))}
                  className="flex-1 h-1.5 bg-[#F3F4F6] dark:bg-[#171717] rounded-full appearance-none [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-teal-400 [&::-webkit-slider-thumb]:cursor-pointer"
                />
                <span className="text-sm font-semibold text-[#111111] dark:text-white w-10 text-right">{coversEstimate}</span>
              </div>
            </div>

            {/* Food Cost Distribution - CSS Donut */}
            {stats.categoryDistribution.length > 0 && (
              <div className="bg-[#FAFAFA] dark:bg-[#0A0A0A]/50 backdrop-blur rounded-lg p-4">
                <h4 className="text-[11px] text-[#6B7280] dark:text-[#A3A3A3] uppercase tracking-wider mb-3 flex items-center gap-1.5">
                  <PieChart className="w-3.5 h-3.5" />
                  Repartition Food Cost
                </h4>
                <DonutChart data={stats.categoryDistribution} total={stats.totalItems} />
              </div>
            )}

            {/* Menu Balance Indicator */}
            <div className="bg-[#FAFAFA] dark:bg-[#0A0A0A]/50 backdrop-blur rounded-lg p-4">
              <h4 className="text-[11px] text-[#6B7280] dark:text-[#A3A3A3] uppercase tracking-wider mb-3">
                Equilibre du menu
              </h4>
              <MenuBalanceIndicator balance={stats.menuBalance} />
            </div>

            {/* Per-category breakdown */}
            {stats.categoryDistribution.length > 0 && (
              <div className="bg-[#FAFAFA] dark:bg-[#0A0A0A]/50 backdrop-blur rounded-lg p-4">
                <h4 className="text-[11px] text-[#6B7280] dark:text-[#A3A3A3] uppercase tracking-wider mb-3">
                  Par categorie
                </h4>
                <div className="space-y-2">
                  {stats.categoryDistribution.map((d) => (
                    <div key={d.category} className="flex items-center gap-2">
                      <span className="text-xs">{getSectionIcon(d.category)}</span>
                      <span className="text-xs text-[#9CA3AF] dark:text-[#737373] flex-1">{getSectionLabel(d.category)}</span>
                      <span className="text-xs text-white font-medium">{d.count}</span>
                      <span className={`text-[10px] px-1.5 py-0.5 rounded ${marginBg(100 - d.foodCost)}`}>
                        FC {d.foodCost.toFixed(0)}%
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── Bottom Bar ── */}
      <div className="flex-none px-4 py-3 bg-white dark:bg-black border-t border-[#E5E7EB] dark:border-[#1A1A1A] flex items-center gap-3">
        <input
          type="text"
          value={menuName}
          onChange={(e) => setMenuName(e.target.value)}
          placeholder="Nom du menu..."
          className="w-64 px-3 py-2 bg-[#FAFAFA] dark:bg-[#0A0A0A] border border-[#E5E7EB] dark:border-[#1A1A1A] rounded-lg text-sm text-[#111111] dark:text-white placeholder:text-[#6B7280] dark:text-[#A3A3A3] focus:ring-2 focus:ring-[#111111] dark:ring-white/50 focus:border-teal-500 outline-none transition-all"
        />
        <div className="flex-1" />
        <button
          onClick={handleSave}
          disabled={saving}
          className="inline-flex items-center gap-2 px-5 py-2 rounded-lg bg-[#111111] dark:bg-white hover:bg-[#333] dark:hover:bg-[#E5E5E5] text-white text-sm font-medium transition-colors disabled:opacity-50"
        >
          <Save className="w-4 h-4" />
          {saving ? 'Enregistrement...' : 'Enregistrer le menu'}
        </button>
      </div>

      {/* ── Custom scrollbar styles ── */}
      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgb(51 65 85 / 0.5);
          border-radius: 3px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgb(71 85 105 / 0.7);
        }
      `}</style>
    </div>
  );
}

// ═══════ Sub-components ═══════

function StatCard({
  label,
  value,
  icon,
  color,
}: {
  label: string;
  value: string;
  icon: React.ReactNode;
  color: 'teal' | 'green' | 'amber' | 'red' | 'purple';
}) {
  const colors: Record<string, { bg: string; icon: string; value: string }> = {
    teal: { bg: 'bg-teal-500/10', icon: 'text-teal-400', value: 'text-teal-400' },
    green: { bg: 'bg-emerald-500/10', icon: 'text-emerald-400', value: 'text-emerald-400' },
    amber: { bg: 'bg-amber-500/10', icon: 'text-amber-400', value: 'text-amber-400' },
    red: { bg: 'bg-red-500/10', icon: 'text-red-400', value: 'text-red-400' },
    purple: { bg: 'bg-purple-500/10', icon: 'text-purple-400', value: 'text-purple-400' },
  };
  const c = colors[color];

  return (
    <div className={`${c.bg} backdrop-blur rounded-lg p-3`}>
      <div className="flex items-center justify-between mb-1.5">
        <span className="text-[10px] text-[#6B7280] dark:text-[#A3A3A3] uppercase tracking-wider leading-tight">{label}</span>
        <span className={c.icon}>{icon}</span>
      </div>
      <div className={`text-lg font-bold ${c.value}`}>{value}</div>
    </div>
  );
}

// ── CSS-only donut chart ──

const DONUT_COLORS = [
  '#14b8a6', // teal
  '#8b5cf6', // violet
  '#f59e0b', // amber
  '#ef4444', // red
  '#3b82f6', // blue
];

function DonutChart({
  data,
  total,
}: {
  data: { category: string; count: number; foodCost: number }[];
  total: number;
}) {
  if (total === 0) return null;

  // Build conic gradient
  let accumulated = 0;
  const segments = data.map((d, i) => {
    const pct = (d.count / total) * 100;
    const start = accumulated;
    accumulated += pct;
    return { ...d, pct, start, end: accumulated, color: DONUT_COLORS[i % DONUT_COLORS.length] };
  });

  const gradient = segments
    .map((s) => `${s.color} ${s.start}% ${s.end}%`)
    .join(', ');

  return (
    <div className="flex items-center gap-4">
      <div
        className="w-20 h-20 rounded-full shrink-0 relative"
        style={{
          background: `conic-gradient(${gradient})`,
        }}
      >
        {/* Inner circle for donut effect */}
        <div className="absolute inset-2.5 rounded-full bg-[#FAFAFA] dark:bg-[#0A0A0A]" />
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-xs font-bold text-[#111111] dark:text-white">{total}</span>
        </div>
      </div>
      <div className="space-y-1.5 flex-1 min-w-0">
        {segments.map((s) => (
          <div key={s.category} className="flex items-center gap-2">
            <div
              className="w-2.5 h-2.5 rounded-full shrink-0"
              style={{ backgroundColor: s.color }}
            />
            <span className="text-[11px] text-[#9CA3AF] dark:text-[#737373] truncate flex-1">
              {getSectionLabel(s.category)}
            </span>
            <span className="text-[11px] text-white font-medium">{s.pct.toFixed(0)}%</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Menu Balance Indicator ──

function MenuBalanceIndicator({ balance }: { balance: 'empty' | 'poor' | 'fair' | 'good' | 'excellent' }) {
  const config: Record<string, { label: string; color: string; icon: React.ReactNode; description: string; width: string }> = {
    empty: {
      label: 'Vide',
      color: 'text-[#6B7280] dark:text-[#A3A3A3]',
      icon: <AlertCircle className="w-4 h-4" />,
      description: 'Ajoutez des plats pour commencer',
      width: 'w-0',
    },
    poor: {
      label: 'A ameliorer',
      color: 'text-red-400',
      icon: <AlertCircle className="w-4 h-4" />,
      description: 'Diversifiez les categories',
      width: 'w-1/4',
    },
    fair: {
      label: 'Correct',
      color: 'text-amber-400',
      icon: <AlertCircle className="w-4 h-4" />,
      description: 'Ajoutez des entrees ou desserts',
      width: 'w-1/2',
    },
    good: {
      label: 'Bon',
      color: 'text-emerald-400',
      icon: <CheckCircle2 className="w-4 h-4" />,
      description: 'Bon equilibre des categories',
      width: 'w-3/4',
    },
    excellent: {
      label: 'Excellent',
      color: 'text-teal-400',
      icon: <CheckCircle2 className="w-4 h-4" />,
      description: 'Menu bien equilibre avec bonnes marges',
      width: 'w-full',
    },
  };

  const c = config[balance];

  return (
    <div>
      <div className="flex items-center gap-2 mb-2">
        <span className={c.color}>{c.icon}</span>
        <span className={`text-sm font-semibold ${c.color}`}>{c.label}</span>
      </div>
      <div className="h-1.5 bg-[#F3F4F6] dark:bg-[#171717] rounded-full overflow-hidden mb-2">
        <div
          className={`h-full rounded-full transition-all duration-500 ${c.width} ${
            balance === 'excellent'
              ? 'bg-teal-400'
              : balance === 'good'
              ? 'bg-emerald-400'
              : balance === 'fair'
              ? 'bg-amber-400'
              : balance === 'poor'
              ? 'bg-red-400'
              : 'bg-[#F3F4F6] dark:bg-[#171717]'
          }`}
        />
      </div>
      <p className="text-[11px] text-[#6B7280] dark:text-[#A3A3A3]">{c.description}</p>
    </div>
  );
}
