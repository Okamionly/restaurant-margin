import { useState, useEffect, useMemo, useCallback } from 'react';
import { Link } from 'react-router-dom';
import {
  Eye,
  ChefHat,
  Printer,
  Star,
  X,
  Utensils,
  Plus,
  Pencil,
  BookOpen,
  Save,
  ChevronDown,
} from 'lucide-react';
import { fetchRecipes } from '../services/api';
import { useToast } from '../hooks/useToast';
import type { Recipe } from '../types';

// ─── Menu structure definition ───
interface MenuSection {
  key: string;
  label: string;
  category: string;      // matches recipe.category
  maxSlots: number;
}

const CARTE_SECTIONS: MenuSection[] = [
  { key: 'entrees',     label: 'Entrées',              category: 'Entrée', maxSlots: 4 },
  { key: 'plats',       label: 'Plats',                category: 'Plat',   maxSlots: 6 },
  { key: 'desserts',    label: 'Desserts',             category: 'Dessert', maxSlots: 4 },
  { key: 'suggestions', label: 'Suggestions du Chef',  category: '',       maxSlots: 2 },
];

const MENU_DU_JOUR_SECTIONS: MenuSection[] = [
  { key: 'mdj_entree',  label: 'Entrée',  category: 'Entrée',  maxSlots: 1 },
  { key: 'mdj_plat',    label: 'Plat',    category: 'Plat',    maxSlots: 1 },
  { key: 'mdj_dessert', label: 'Dessert', category: 'Dessert', maxSlots: 1 },
];

// ─── localStorage persistence ───
const STORAGE_KEY = 'menuBuilderSelections';
const STORAGE_KEY_PRICE = 'menuBuilderMDJPrice';

interface MenuSelections {
  entrees: number[];
  plats: number[];
  desserts: number[];
  suggestions: number[];
  mdj_entree: number[];
  mdj_plat: number[];
  mdj_dessert: number[];
}

function loadSelections(): MenuSelections {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch {}
  return { entrees: [], plats: [], desserts: [], suggestions: [], mdj_entree: [], mdj_plat: [], mdj_dessert: [] };
}

function saveSelections(sel: MenuSelections) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(sel));
}

function loadMDJPrice(): string {
  return localStorage.getItem(STORAGE_KEY_PRICE) || '18.90';
}

function saveMDJPrice(p: string) {
  localStorage.setItem(STORAGE_KEY_PRICE, p);
}

// ─── Helper: collect all allergens from a recipe ───
function getRecipeAllergens(recipe: Recipe): string[] {
  const set = new Set<string>();
  recipe.ingredients?.forEach((ri) => {
    ri.ingredient?.allergens?.forEach((a) => set.add(a));
  });
  return Array.from(set);
}

// ─── Decorative components ───
function MenuDivider() {
  return (
    <div className="flex items-center justify-center my-2" aria-hidden>
      <div className="h-px flex-1 bg-amber-300/40 dark:bg-amber-700/30" />
      <svg viewBox="0 0 24 12" className="w-6 h-3 mx-2 text-amber-400 dark:text-amber-600" fill="currentColor">
        <path d="M12 0C8 0 5 3 2 6c3 3 6 6 10 6s7-3 10-6c-3-3-6-6-10-6zm0 10a4 4 0 110-8 4 4 0 010 8z" />
      </svg>
      <div className="h-px flex-1 bg-amber-300/40 dark:bg-amber-700/30" />
    </div>
  );
}

function MenuOrnament() {
  return (
    <div className="flex items-center justify-center py-1" aria-hidden>
      <span className="text-amber-400/60 dark:text-amber-600/60 text-sm tracking-[0.5em] font-serif select-none">
        &#10043; &#10043; &#10043;
      </span>
    </div>
  );
}

// ─── Main component ───
export default function MenuBuilder() {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);
  const { showToast } = useToast();

  // Mode: 'edit' or 'preview'
  const [mode, setMode] = useState<'edit' | 'preview'>('edit');

  // Selections
  const [selections, setSelections] = useState<MenuSelections>(loadSelections);
  const [mdjPrice, setMdjPrice] = useState<string>(loadMDJPrice);
  const [editingPrice, setEditingPrice] = useState(false);

  // Dropdown open state for each section
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

  useEffect(() => {
    fetchRecipes()
      .then(setRecipes)
      .catch(() => showToast('Erreur lors du chargement des recettes', 'error'))
      .finally(() => setLoading(false));
  }, [showToast]);

  // Persist selections
  const updateSelections = useCallback((next: MenuSelections) => {
    setSelections(next);
    saveSelections(next);
  }, []);

  const updateMDJPrice = useCallback((p: string) => {
    setMdjPrice(p);
    saveMDJPrice(p);
  }, []);

  // Recipe lookup
  const recipeMap = useMemo(() => {
    const map = new Map<number, Recipe>();
    recipes.forEach((r) => map.set(r.id, r));
    return map;
  }, [recipes]);

  // Available recipes by category
  const recipesByCategory = useMemo(() => {
    const map = new Map<string, Recipe[]>();
    recipes.forEach((r) => {
      const list = map.get(r.category) || [];
      list.push(r);
      map.set(r.category, list);
    });
    return map;
  }, [recipes]);

  // All recipes for "suggestions" (any category)
  const allRecipesSorted = useMemo(() => {
    return [...recipes].sort((a, b) => a.name.localeCompare(b.name, 'fr'));
  }, [recipes]);

  // ─── Selection handlers ───
  const addToSection = useCallback((sectionKey: string, recipeId: number, maxSlots: number) => {
    setSelections((prev) => {
      const current = prev[sectionKey as keyof MenuSelections] || [];
      if (current.includes(recipeId)) return prev;
      if (current.length >= maxSlots) {
        showToast(`Maximum ${maxSlots} élément${maxSlots > 1 ? 's' : ''} pour cette section`, 'error');
        return prev;
      }
      const next = { ...prev, [sectionKey]: [...current, recipeId] };
      saveSelections(next);
      return next;
    });
    setOpenDropdown(null);
  }, [showToast]);

  const removeFromSection = useCallback((sectionKey: string, recipeId: number) => {
    setSelections((prev) => {
      const current = prev[sectionKey as keyof MenuSelections] || [];
      const next = { ...prev, [sectionKey]: current.filter((id) => id !== recipeId) };
      saveSelections(next);
      return next;
    });
  }, []);

  const clearSection = useCallback((sectionKey: string) => {
    setSelections((prev) => {
      const next = { ...prev, [sectionKey]: [] };
      saveSelections(next);
      return next;
    });
  }, []);

  // Get available recipes for a section (not already selected in that section)
  const getAvailable = useCallback((section: MenuSection) => {
    const selected = new Set(selections[section.key as keyof MenuSelections] || []);
    if (section.category === '') {
      // Suggestions: any recipe
      return allRecipesSorted.filter((r) => !selected.has(r.id));
    }
    return (recipesByCategory.get(section.category) || [])
      .filter((r) => !selected.has(r.id))
      .sort((a, b) => a.name.localeCompare(b.name, 'fr'));
  }, [selections, recipesByCategory, allRecipesSorted]);

  // Resolve ids to recipes for a section
  const getSelectedRecipes = useCallback((sectionKey: string): Recipe[] => {
    const ids = selections[sectionKey as keyof MenuSelections] || [];
    return ids.map((id) => recipeMap.get(id)).filter(Boolean) as Recipe[];
  }, [selections, recipeMap]);

  // Print
  const handlePrint = useCallback(() => {
    window.print();
  }, []);

  // Suppress updateSelections unused warning — kept for future use
  void updateSelections;

  if (loading) {
    return (
      <div className="text-center py-12 text-slate-500 dark:text-slate-400">Chargement...</div>
    );
  }

  // ═══════════════════════════════════
  //  PREVIEW MODE
  // ═══════════════════════════════════
  if (mode === 'preview') {
    const carteHasContent = CARTE_SECTIONS.some(
      (s) => (selections[s.key as keyof MenuSelections] || []).length > 0
    );
    const mdjHasContent = MENU_DU_JOUR_SECTIONS.some(
      (s) => (selections[s.key as keyof MenuSelections] || []).length > 0
    );

    return (
      <div className="max-w-3xl mx-auto">
        {/* Toolbar */}
        <div className="print:hidden flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
            <Eye className="w-6 h-6 text-amber-600" />
            Aperçu de la carte
          </h2>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-amber-600 hover:bg-amber-700 text-white text-sm font-medium transition-colors"
            >
              <Printer className="w-4 h-4" />
              Imprimer
            </button>
            <button
              onClick={() => setMode('edit')}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-200 text-sm font-medium hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
            >
              <Pencil className="w-4 h-4" />
              Modifier la carte
            </button>
          </div>
        </div>

        {/* ═══ MENU CARD ═══ */}
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-xl border border-amber-200/60 dark:border-slate-700 overflow-hidden print:shadow-none print:border print:border-amber-200">
          {/* Card Header */}
          <div className="bg-gradient-to-b from-amber-50 via-amber-50/50 to-white dark:from-slate-800 dark:via-slate-800 dark:to-slate-800 text-center pt-10 pb-6 px-8 border-b border-amber-100/60 dark:border-slate-700">
            <div className="text-xs tracking-[0.35em] uppercase text-amber-600 dark:text-amber-400 font-semibold mb-2">
              Restaurant
            </div>
            <h1 className="text-4xl font-serif font-bold text-slate-800 dark:text-slate-100 tracking-wide">
              La Carte
            </h1>
            <MenuOrnament />
          </div>

          <div className="px-8 sm:px-12 py-8 space-y-8 print:px-6 print:py-4 print:space-y-5">
            {/* ─── LA CARTE sections ─── */}
            {carteHasContent ? (
              CARTE_SECTIONS.map((section, si) => {
                const items = getSelectedRecipes(section.key);
                if (items.length === 0) return null;
                return (
                  <div key={section.key}>
                    <div className="text-center mb-3">
                      <h3 className="text-xl font-serif font-bold text-amber-800 dark:text-amber-400 tracking-wider uppercase">
                        {section.label}
                      </h3>
                      <MenuDivider />
                    </div>
                    <div className="space-y-2">
                      {items.map((recipe) => {
                        const allergens = getRecipeAllergens(recipe);
                        return (
                          <div key={recipe.id} className="px-2">
                            <div className="flex items-baseline gap-2">
                              <span className="font-semibold text-slate-800 dark:text-slate-100 font-serif">
                                {recipe.name}
                              </span>
                              <span className="flex-1 border-b border-dotted border-slate-300 dark:border-slate-600 translate-y-[-3px] mx-1" />
                              <span className="font-serif font-bold text-slate-800 dark:text-slate-100 whitespace-nowrap">
                                {recipe.sellingPrice.toFixed(2)} &euro;
                              </span>
                            </div>
                            {recipe.description && (
                              <p className="text-sm text-slate-500 dark:text-slate-400 italic mt-0.5 pl-1">
                                {recipe.description}
                              </p>
                            )}
                            {allergens.length > 0 && (
                              <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-0.5 pl-1">
                                Allergènes : {allergens.join(', ')}
                              </p>
                            )}
                          </div>
                        );
                      })}
                    </div>
                    {si < CARTE_SECTIONS.length - 1 && <MenuOrnament />}
                  </div>
                );
              })
            ) : (
              <div className="text-center py-8 text-slate-400 dark:text-slate-500">
                <ChefHat className="w-12 h-12 mx-auto mb-3 opacity-40" />
                <p>Aucun plat sélectionné pour la carte.</p>
                <button
                  onClick={() => setMode('edit')}
                  className="mt-3 text-sm text-amber-600 hover:text-amber-700 font-medium"
                >
                  Composer la carte &rarr;
                </button>
              </div>
            )}

            {/* ─── MENU DU JOUR ─── */}
            {mdjHasContent && (
              <>
                <div className="border-t-2 border-amber-200 dark:border-amber-800/40 pt-6 mt-8">
                  <div className="text-center mb-4">
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-amber-100 dark:bg-amber-900/30 rounded-full mb-2">
                      <Star className="w-4 h-4 text-amber-600 dark:text-amber-400 fill-current" />
                      <span className="text-sm font-semibold text-amber-700 dark:text-amber-300">
                        Menu du Jour
                      </span>
                    </div>
                    {mdjPrice && (
                      <div className="text-2xl font-serif font-bold text-amber-700 dark:text-amber-400 mt-1">
                        {parseFloat(mdjPrice).toFixed(2)} &euro;
                      </div>
                    )}
                    <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">
                      Entrée + Plat + Dessert
                    </p>
                    <MenuDivider />
                  </div>
                  <div className="space-y-3">
                    {MENU_DU_JOUR_SECTIONS.map((section) => {
                      const items = getSelectedRecipes(section.key);
                      if (items.length === 0) return null;
                      return (
                        <div key={section.key} className="text-center">
                          <span className="text-xs tracking-widest uppercase text-amber-600 dark:text-amber-500 font-semibold">
                            {section.label}
                          </span>
                          {items.map((recipe) => (
                            <div key={recipe.id} className="mt-1">
                              <span className="font-serif font-semibold text-slate-800 dark:text-slate-100">
                                {recipe.name}
                              </span>
                              {recipe.description && (
                                <p className="text-sm text-slate-500 dark:text-slate-400 italic">
                                  {recipe.description}
                                </p>
                              )}
                            </div>
                          ))}
                        </div>
                      );
                    })}
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Footer */}
          <div className="text-center py-4 px-8 border-t border-amber-100/60 dark:border-slate-700">
            <p className="text-xs text-slate-400 dark:text-slate-500">
              Prix TTC &mdash; Tous nos plats sont faits maison. N&apos;hésitez pas à signaler vos allergies à notre équipe.
            </p>
            <MenuOrnament />
          </div>
        </div>

        {/* Print styles */}
        <style>{`
          @media print {
            body * { visibility: hidden; }
            #root, #root * { visibility: visible; }
            nav, aside, header, footer, .print\\:hidden { display: none !important; }
            @page { margin: 1.5cm; size: A4; }
            body { font-size: 11pt; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
            .font-serif { font-family: 'Georgia', 'Times New Roman', serif; }
          }
        `}</style>
      </div>
    );
  }

  // ═══════════════════════════════════
  //  EDIT MODE
  // ═══════════════════════════════════
  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
          <Utensils className="w-6 h-6 text-amber-600" />
          Composer la carte
        </h2>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setMode('preview')}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-amber-600 hover:bg-amber-700 text-white text-sm font-medium transition-colors"
          >
            <Eye className="w-4 h-4" />
            Aperçu
          </button>
          <button
            onClick={handlePrint}
            className="inline-flex items-center gap-2 px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-200 text-sm hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
          >
            <Printer className="w-4 h-4" />
            Imprimer
          </button>
        </div>
      </div>

      {recipes.length === 0 ? (
        <div className="text-center py-16 bg-white dark:bg-slate-800 rounded-lg shadow">
          <ChefHat className="w-16 h-16 mx-auto text-slate-300 dark:text-slate-600 mb-4" />
          <h3 className="text-xl font-semibold text-slate-600 dark:text-slate-300 mb-2">
            Aucune recette disponible
          </h3>
          <p className="text-slate-400 dark:text-slate-500 mb-4">
            Créez des recettes pour composer votre carte.
          </p>
          <Link
            to="/recipes"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-amber-600 hover:bg-amber-700 text-white text-sm font-medium"
          >
            <Plus className="w-4 h-4" />
            Créer une recette
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* ═══ LA CARTE ═══ */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <BookOpen className="w-5 h-5 text-amber-600" />
              <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100">La Carte</h3>
            </div>

            <div className="space-y-5">
              {CARTE_SECTIONS.map((section) => {
                const selected = getSelectedRecipes(section.key);
                const available = getAvailable(section);
                const count = (selections[section.key as keyof MenuSelections] || []).length;
                const isOpen = openDropdown === section.key;

                return (
                  <div
                    key={section.key}
                    className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden"
                  >
                    {/* Section header */}
                    <div className="flex items-center justify-between px-4 py-3 bg-gradient-to-r from-amber-50 to-white dark:from-slate-800 dark:to-slate-800 border-b border-slate-100 dark:border-slate-700">
                      <div className="flex items-center gap-2">
                        <h4 className="font-serif font-bold text-amber-800 dark:text-amber-400 text-base">
                          {section.label}
                        </h4>
                        <span className="text-xs text-slate-400 dark:text-slate-500 bg-slate-100 dark:bg-slate-700 px-2 py-0.5 rounded-full">
                          {count}/{section.maxSlots}
                        </span>
                      </div>
                      {count > 0 && (
                        <button
                          onClick={() => clearSection(section.key)}
                          className="text-xs text-slate-400 hover:text-red-500 dark:hover:text-red-400 transition-colors"
                        >
                          Tout retirer
                        </button>
                      )}
                    </div>

                    {/* Selected items */}
                    <div className="divide-y divide-slate-100 dark:divide-slate-700">
                      {selected.length === 0 ? (
                        <div className="px-4 py-4 text-center text-sm text-slate-400 dark:text-slate-500">
                          Aucun plat sélectionné
                        </div>
                      ) : (
                        selected.map((recipe) => (
                          <div
                            key={recipe.id}
                            className="flex items-center gap-3 px-4 py-2.5 hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors"
                          >
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2">
                                <Link
                                  to={`/recipes/${recipe.id}`}
                                  className="font-medium text-slate-800 dark:text-slate-100 hover:text-amber-700 dark:hover:text-amber-400 transition-colors truncate"
                                >
                                  {recipe.name}
                                </Link>
                                {recipe.description && (
                                  <span className="hidden sm:inline text-xs text-slate-400 dark:text-slate-500 italic truncate">
                                    {recipe.description}
                                  </span>
                                )}
                              </div>
                            </div>
                            <span className="text-sm font-semibold text-slate-600 dark:text-slate-300 whitespace-nowrap">
                              {recipe.sellingPrice.toFixed(2)} &euro;
                            </span>
                            <button
                              onClick={() => removeFromSection(section.key, recipe.id)}
                              className="p-1 rounded text-slate-300 hover:text-red-500 dark:text-slate-600 dark:hover:text-red-400 transition-colors"
                              title="Retirer"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                        ))
                      )}
                    </div>

                    {/* Add button / dropdown */}
                    {count < section.maxSlots && (
                      <div className="relative border-t border-slate-100 dark:border-slate-700">
                        <button
                          onClick={() => setOpenDropdown(isOpen ? null : section.key)}
                          className="w-full flex items-center justify-center gap-1.5 px-4 py-2.5 text-sm text-amber-600 dark:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-900/10 font-medium transition-colors"
                        >
                          <Plus className="w-4 h-4" />
                          Ajouter ({section.maxSlots - count} restant{section.maxSlots - count > 1 ? 's' : ''})
                          <ChevronDown className={`w-3.5 h-3.5 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                        </button>

                        {isOpen && (
                          <div className="absolute z-50 bottom-full left-0 right-0 mb-1 bg-white dark:bg-slate-800 rounded-lg shadow-xl border border-slate-200 dark:border-slate-700 max-h-60 overflow-y-auto">
                            {available.length === 0 ? (
                              <div className="px-4 py-3 text-center text-sm text-slate-400 dark:text-slate-500">
                                {section.category
                                  ? `Aucune recette disponible en "${section.label}"`
                                  : 'Aucune recette disponible'}
                                <Link
                                  to="/recipes"
                                  className="block mt-1 text-xs text-amber-600 hover:text-amber-700 font-medium"
                                  onClick={() => setOpenDropdown(null)}
                                >
                                  Créer une recette &rarr;
                                </Link>
                              </div>
                            ) : (
                              available.map((r) => (
                                <button
                                  key={r.id}
                                  onClick={() => addToSection(section.key, r.id, section.maxSlots)}
                                  className="w-full flex items-center justify-between px-4 py-2.5 text-sm hover:bg-amber-50 dark:hover:bg-slate-700 transition-colors text-left"
                                >
                                  <span className="text-slate-700 dark:text-slate-300 truncate">
                                    {r.name}
                                    {section.category === '' && (
                                      <span className="ml-2 text-xs text-slate-400">({r.category})</span>
                                    )}
                                  </span>
                                  <span className="text-xs text-slate-400 dark:text-slate-500 whitespace-nowrap ml-2">
                                    {r.sellingPrice.toFixed(2)} &euro;
                                  </span>
                                </button>
                              ))
                            )}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* ═══ MENU DU JOUR ═══ */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Star className="w-5 h-5 text-amber-600 fill-current" />
              <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100">Menu du Jour</h3>
            </div>

            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-amber-200 dark:border-amber-900/40 overflow-hidden">
              {/* Price header */}
              <div className="flex items-center justify-between px-5 py-4 bg-gradient-to-r from-amber-50 to-amber-50/30 dark:from-amber-900/20 dark:to-slate-800 border-b border-amber-100 dark:border-amber-900/30">
                <div>
                  <span className="text-sm text-slate-500 dark:text-slate-400">
                    Entrée + Plat + Dessert
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  {editingPrice ? (
                    <div className="flex items-center gap-1">
                      <input
                        type="number"
                        step="0.10"
                        min="0"
                        value={mdjPrice}
                        onChange={(e) => setMdjPrice(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            updateMDJPrice(mdjPrice);
                            setEditingPrice(false);
                          }
                        }}
                        onBlur={() => {
                          updateMDJPrice(mdjPrice);
                          setEditingPrice(false);
                        }}
                        autoFocus
                        className="w-20 px-2 py-1 text-sm font-bold border border-amber-300 rounded focus:ring-2 focus:ring-amber-500 focus:border-amber-500 dark:bg-slate-700 dark:border-slate-600 dark:text-slate-100 text-right"
                        placeholder="0.00"
                      />
                      <span className="text-sm font-bold text-slate-600 dark:text-slate-300">&euro;</span>
                    </div>
                  ) : (
                    <button
                      onClick={() => setEditingPrice(true)}
                      className="inline-flex items-center gap-1.5 text-lg font-serif font-bold text-amber-700 dark:text-amber-400 hover:text-amber-800 dark:hover:text-amber-300 transition-colors"
                    >
                      {mdjPrice ? `${parseFloat(mdjPrice).toFixed(2)} €` : 'Définir le prix'}
                      <Pencil className="w-3.5 h-3.5 opacity-50" />
                    </button>
                  )}
                </div>
              </div>

              {/* Menu du jour sections */}
              <div className="divide-y divide-slate-100 dark:divide-slate-700">
                {MENU_DU_JOUR_SECTIONS.map((section) => {
                  const selected = getSelectedRecipes(section.key);
                  const available = getAvailable(section);
                  const count = (selections[section.key as keyof MenuSelections] || []).length;
                  const isOpen = openDropdown === section.key;

                  return (
                    <div key={section.key} className="px-5 py-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs tracking-widest uppercase text-amber-600 dark:text-amber-500 font-semibold">
                          {section.label}
                        </span>
                        {count >= section.maxSlots && (
                          <button
                            onClick={() => clearSection(section.key)}
                            className="text-xs text-slate-400 hover:text-red-500 dark:hover:text-red-400"
                          >
                            Retirer
                          </button>
                        )}
                      </div>

                      {selected.length > 0 ? (
                        selected.map((recipe) => (
                          <div key={recipe.id} className="flex items-center gap-2">
                            <Link
                              to={`/recipes/${recipe.id}`}
                              className="font-medium text-slate-800 dark:text-slate-100 hover:text-amber-700 dark:hover:text-amber-400 transition-colors"
                            >
                              {recipe.name}
                            </Link>
                            <span className="text-xs text-slate-400">
                              ({recipe.sellingPrice.toFixed(2)} &euro;)
                            </span>
                            <button
                              onClick={() => removeFromSection(section.key, recipe.id)}
                              className="ml-auto p-0.5 rounded text-slate-300 hover:text-red-500 dark:text-slate-600 dark:hover:text-red-400"
                            >
                              <X className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        ))
                      ) : (
                        <div className="relative">
                          <button
                            onClick={() => setOpenDropdown(isOpen ? null : section.key)}
                            className="w-full flex items-center justify-center gap-1.5 py-2 text-sm text-amber-600 dark:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-900/10 rounded-lg border border-dashed border-amber-200 dark:border-amber-800/40 font-medium transition-colors"
                          >
                            <Plus className="w-4 h-4" />
                            Choisir {section.label === 'Entrée' ? 'une entrée' : section.label === 'Plat' ? 'un plat' : 'un dessert'}
                          </button>

                          {isOpen && (
                            <div className="absolute z-50 bottom-full left-0 right-0 mb-1 bg-white dark:bg-slate-800 rounded-lg shadow-xl border border-slate-200 dark:border-slate-700 max-h-48 overflow-y-auto">
                              {available.length === 0 ? (
                                <div className="px-4 py-3 text-center text-sm text-slate-400">
                                  Aucune recette en &laquo; {section.label} &raquo;
                                </div>
                              ) : (
                                available.map((r) => (
                                  <button
                                    key={r.id}
                                    onClick={() => addToSection(section.key, r.id, section.maxSlots)}
                                    className="w-full flex items-center justify-between px-4 py-2 text-sm hover:bg-amber-50 dark:hover:bg-slate-700 transition-colors text-left"
                                  >
                                    <span className="text-slate-700 dark:text-slate-300 truncate">{r.name}</span>
                                    <span className="text-xs text-slate-400 whitespace-nowrap ml-2">
                                      {r.sellingPrice.toFixed(2)} &euro;
                                    </span>
                                  </button>
                                ))
                              )}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Menu du jour cost summary */}
              {MENU_DU_JOUR_SECTIONS.every((s) => (selections[s.key as keyof MenuSelections] || []).length > 0) && (
                <MdjCostSummary
                  sections={MENU_DU_JOUR_SECTIONS}
                  getSelectedRecipes={getSelectedRecipes}
                  mdjPrice={mdjPrice}
                />
              )}
            </div>

            {/* Quick recap */}
            <div className="mt-6 bg-slate-50 dark:bg-slate-800/50 rounded-lg border border-slate-200 dark:border-slate-700 p-4">
              <h4 className="text-sm font-semibold text-slate-600 dark:text-slate-400 mb-3 flex items-center gap-2">
                <Save className="w-4 h-4" />
                Récapitulatif
              </h4>
              <div className="grid grid-cols-2 gap-3 text-sm">
                {CARTE_SECTIONS.map((s) => {
                  const count = (selections[s.key as keyof MenuSelections] || []).length;
                  return (
                    <div key={s.key} className="flex items-center justify-between">
                      <span className="text-slate-500 dark:text-slate-400">{s.label}</span>
                      <span className={`font-semibold ${count === s.maxSlots ? 'text-green-600' : count > 0 ? 'text-amber-600' : 'text-slate-300 dark:text-slate-600'}`}>
                        {count}/{s.maxSlots}
                      </span>
                    </div>
                  );
                })}
                <div className="col-span-2 border-t border-slate-200 dark:border-slate-700 pt-2 mt-1">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500 dark:text-slate-400 font-medium">Menu du Jour</span>
                    <span className={`font-semibold ${
                      MENU_DU_JOUR_SECTIONS.every((s) => (selections[s.key as keyof MenuSelections] || []).length > 0)
                        ? 'text-green-600'
                        : 'text-slate-300 dark:text-slate-600'
                    }`}>
                      {MENU_DU_JOUR_SECTIONS.filter((s) => (selections[s.key as keyof MenuSelections] || []).length > 0).length}/3
                      {mdjPrice && ` · ${parseFloat(mdjPrice).toFixed(2)} €`}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Close dropdowns on click outside */}
      {openDropdown && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setOpenDropdown(null)}
        />
      )}
    </div>
  );
}

// ─── Menu du Jour cost summary sub-component ───
function MdjCostSummary({
  sections,
  getSelectedRecipes,
  mdjPrice,
}: {
  sections: MenuSection[];
  getSelectedRecipes: (key: string) => Recipe[];
  mdjPrice: string;
}) {
  const totalCost = sections.reduce((sum, s) => {
    const items = getSelectedRecipes(s.key);
    return sum + items.reduce((s2, r) => s2 + (r.margin.totalCostPerPortion || r.margin.costPerPortion), 0);
  }, 0);

  const price = parseFloat(mdjPrice) || 0;
  const marginAmount = price - totalCost;
  const marginPct = price > 0 ? (marginAmount / price) * 100 : 0;

  return (
    <div className="border-t border-amber-100 dark:border-amber-900/30 px-5 py-3 bg-amber-50/30 dark:bg-amber-900/10">
      <div className="flex items-center justify-between text-sm">
        <span className="text-slate-500 dark:text-slate-400">Coût matière total</span>
        <span className="font-semibold text-slate-700 dark:text-slate-300">{totalCost.toFixed(2)} &euro;</span>
      </div>
      {price > 0 && (
        <div className="flex items-center justify-between text-sm mt-1">
          <span className="text-slate-500 dark:text-slate-400">Marge menu</span>
          <span className={`font-bold ${marginPct >= 70 ? 'text-green-600' : marginPct >= 60 ? 'text-amber-600' : 'text-red-600'}`}>
            {marginAmount.toFixed(2)} &euro; ({marginPct.toFixed(1)}%)
          </span>
        </div>
      )}
    </div>
  );
}
