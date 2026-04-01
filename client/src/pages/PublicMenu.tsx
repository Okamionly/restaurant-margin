import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { ChefHat, Moon, Sun, AlertTriangle, Loader2, Clock, Flame, Leaf, Fish, Egg, Milk, Nut } from 'lucide-react';
import { useTranslation } from '../hooks/useTranslation';

const API_BASE = import.meta.env.VITE_API_URL || '/api';

// ── Types ─────────────────────────────────────────────────────────────────
interface PublicIngredient {
  name: string;
  allergens: string[];
}

interface PublicRecipeIngredient {
  ingredient: PublicIngredient;
}

interface PublicRecipe {
  id: number;
  name: string;
  category: string;
  sellingPrice: number;
  description: string | null;
  prepTimeMinutes: number | null;
  cookTimeMinutes: number | null;
  ingredients: PublicRecipeIngredient[];
}

// ── Allergen icon mapping ─────────────────────────────────────────────────
const ALLERGEN_ICONS: Record<string, { icon: React.ReactNode; color: string }> = {
  'Gluten': { icon: <Flame className="w-3 h-3" />, color: 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300' },
  'Crustaces': { icon: <Fish className="w-3 h-3" />, color: 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300' },
  'Oeufs': { icon: <Egg className="w-3 h-3" />, color: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/40 dark:text-yellow-300' },
  'Poissons': { icon: <Fish className="w-3 h-3" />, color: 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300' },
  'Arachides': { icon: <Nut className="w-3 h-3" />, color: 'bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-300' },
  'Soja': { icon: <Leaf className="w-3 h-3" />, color: 'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300' },
  'Lait': { icon: <Milk className="w-3 h-3" />, color: 'bg-sky-100 text-sky-700 dark:bg-sky-900/40 dark:text-sky-300' },
  'Fruits a coque': { icon: <Nut className="w-3 h-3" />, color: 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300' },
  'Celeri': { icon: <Leaf className="w-3 h-3" />, color: 'bg-lime-100 text-lime-700 dark:bg-lime-900/40 dark:text-lime-300' },
  'Moutarde': { icon: <Flame className="w-3 h-3" />, color: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/40 dark:text-yellow-300' },
  'Sesame': { icon: <Leaf className="w-3 h-3" />, color: 'bg-stone-100 text-stone-700 dark:bg-stone-900/40 dark:text-stone-300' },
  'Sulfites': { icon: <AlertTriangle className="w-3 h-3" />, color: 'bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300' },
  'Lupin': { icon: <Leaf className="w-3 h-3" />, color: 'bg-violet-100 text-violet-700 dark:bg-violet-900/40 dark:text-violet-300' },
  'Mollusques': { icon: <Fish className="w-3 h-3" />, color: 'bg-teal-100 text-teal-700 dark:bg-teal-900/40 dark:text-teal-300' },
};

// ── Category display order & styling ──────────────────────────────────────
const CATEGORY_ORDER = ['Entree', 'Plat', 'Dessert', 'Boisson', 'Accompagnement'];

const CATEGORY_LABELS: Record<string, Record<string, string>> = {
  fr: { 'Entree': 'Entrées', 'Plat': 'Plats', 'Dessert': 'Desserts', 'Boisson': 'Boissons', 'Accompagnement': 'Accompagnements' },
  en: { 'Entree': 'Starters', 'Plat': 'Main Courses', 'Dessert': 'Desserts', 'Boisson': 'Beverages', 'Accompagnement': 'Sides' },
  es: { 'Entree': 'Entrantes', 'Plat': 'Platos Principales', 'Dessert': 'Postres', 'Boisson': 'Bebidas', 'Accompagnement': 'Acompañamientos' },
};

const CATEGORY_DECORATIONS: Record<string, string> = {
  'Entree': 'from-emerald-500/10 to-transparent',
  'Plat': 'from-blue-500/10 to-transparent',
  'Dessert': 'from-pink-500/10 to-transparent',
  'Boisson': 'from-amber-500/10 to-transparent',
  'Accompagnement': 'from-violet-500/10 to-transparent',
};

function normalizeCategory(cat: string): string {
  // Remove accents for matching: "Entrée" -> "Entree"
  return cat.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
}

export default function PublicMenu() {
  const { t } = useTranslation();
  const [searchParams] = useSearchParams();
  const hidePrices = searchParams.get('hidePrices') === '1';
  const hideAllergens = searchParams.get('hideAllergens') === '1';
  const hideDesc = searchParams.get('hideDesc') === '1';
  const lang = searchParams.get('lang') || 'fr';

  const [recipes, setRecipes] = useState<PublicRecipe[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  useEffect(() => {
    fetchPublicMenu();
  }, []);

  async function fetchPublicMenu() {
    try {
      const res = await fetch(`${API_BASE}/public/menu`);
      if (!res.ok) throw new Error('Erreur');
      const data = await res.json();
      setRecipes(data);
    } catch {
      setError('Impossible de charger le menu');
    } finally {
      setLoading(false);
    }
  }

  // Group recipes by normalized category
  const grouped = recipes.reduce<Record<string, PublicRecipe[]>>((acc, recipe) => {
    const normCat = normalizeCategory(recipe.category);
    if (!acc[normCat]) acc[normCat] = [];
    acc[normCat].push(recipe);
    return acc;
  }, {});

  const sortedCategories = CATEGORY_ORDER.filter((c) => grouped[c]?.length);
  // Add any extra categories not in the predefined order
  Object.keys(grouped).forEach((c) => {
    if (!sortedCategories.includes(c)) sortedCategories.push(c);
  });

  function getAllergens(recipe: PublicRecipe): string[] {
    const set = new Set<string>();
    (recipe.ingredients || []).forEach((ri) => {
      (ri.ingredient?.allergens || []).forEach((a: string) => set.add(a));
    });
    return Array.from(set);
  }

  const labelMap = CATEGORY_LABELS[lang] || CATEGORY_LABELS.fr;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-slate-950">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
          <p className="text-slate-400 dark:text-slate-400 text-sm">Chargement du menu...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-slate-950">
        <div className="text-center">
          <AlertTriangle className="w-12 h-12 text-amber-500 mx-auto mb-4" />
          <p className="text-slate-300 dark:text-slate-400">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-slate-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 transition-colors">
      {/* Header */}
      <header className="sticky top-0 z-20 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-b border-slate-200/60 dark:border-slate-800/60">
        <div className="max-w-2xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-600/20">
              <ChefHat className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-slate-900 dark:text-white leading-tight">
                Notre Carte
              </h1>
              <p className="text-xs text-slate-400 dark:text-slate-400">
                {lang === 'en' ? 'Our Menu' : lang === 'es' ? 'Nuestra Carta' : 'Decouvrez nos plats'}
              </p>
            </div>
          </div>
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-300 dark:text-slate-300 transition-colors"
            aria-label="Toggle theme"
          >
            {darkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>
        </div>
      </header>

      {/* Menu Content */}
      <main className="max-w-2xl mx-auto px-4 py-6 space-y-8">
        {sortedCategories.map((category) => (
          <section key={category} className="space-y-3">
            {/* Category Header */}
            <div className={`relative overflow-hidden rounded-xl bg-gradient-to-r ${CATEGORY_DECORATIONS[category] || 'from-slate-500/10 to-transparent'} p-4`}>
              <h2 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">
                {labelMap[category] || category}
              </h2>
              <div className="absolute right-4 top-1/2 -translate-y-1/2 text-4xl opacity-10">
                {category === 'Entree' && '🥗'}
                {category === 'Plat' && '🍽️'}
                {category === 'Dessert' && '🍰'}
                {category === 'Boisson' && '🥂'}
                {category === 'Accompagnement' && '🥖'}
              </div>
            </div>

            {/* Dishes */}
            <div className="space-y-2">
              {grouped[category].map((recipe) => {
                const allergens = getAllergens(recipe);
                const totalTime = (recipe.prepTimeMinutes || 0) + (recipe.cookTimeMinutes || 0);
                return (
                  <div
                    key={recipe.id}
                    className="group bg-white dark:bg-slate-800/60 rounded-xl border border-slate-100 dark:border-slate-700/50 p-4 hover:shadow-md hover:border-slate-200 dark:hover:border-slate-600 transition-all"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <h3 className="text-base font-semibold text-slate-900 dark:text-white leading-snug">
                          {recipe.name}
                        </h3>
                        {!hideDesc && recipe.description && (
                          <p className="text-sm text-slate-400 dark:text-slate-400 mt-1 leading-relaxed">
                            {recipe.description}
                          </p>
                        )}

                        {/* Meta info */}
                        <div className="flex flex-wrap items-center gap-2 mt-2">
                          {totalTime > 0 && (
                            <span className="inline-flex items-center gap-1 text-xs text-slate-400 dark:text-slate-500">
                              <Clock className="w-3 h-3" />
                              {totalTime} min
                            </span>
                          )}
                          {/* Allergens */}
                          {!hideAllergens && allergens.length > 0 && (
                            <div className="flex flex-wrap gap-1">
                              {allergens.map((a) => {
                                const normalized = a.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
                                const info = ALLERGEN_ICONS[normalized] || { icon: <AlertTriangle className="w-3 h-3" />, color: 'bg-slate-100 text-slate-300 dark:bg-slate-700 dark:text-slate-300' };
                                return (
                                  <span
                                    key={a}
                                    title={a}
                                    className={`inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-full text-[10px] font-medium ${info.color}`}
                                  >
                                    {info.icon}
                                    {a}
                                  </span>
                                );
                              })}
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Price */}
                      {!hidePrices && (
                        <div className="flex-shrink-0 text-right">
                          <span className="text-lg font-bold text-slate-900 dark:text-white">
                            {recipe.sellingPrice.toFixed(2)}
                            <span className="text-sm font-normal text-slate-400 ml-0.5">&euro;</span>
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        ))}

        {recipes.length === 0 && (
          <div className="text-center py-16">
            <ChefHat className="w-16 h-16 text-slate-300 dark:text-slate-600 mx-auto mb-4" />
            <p className="text-slate-400 dark:text-slate-400 text-lg">
              {lang === 'en' ? 'The menu is being prepared...' : lang === 'es' ? 'El menu se esta preparando...' : 'Le menu est en cours de preparation...'}
            </p>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200/60 dark:border-slate-800/60 mt-12">
        <div className="max-w-2xl mx-auto px-4 py-6 text-center">
          <div className="flex items-center justify-center gap-2 text-xs text-slate-400 dark:text-slate-500">
            <ChefHat className="w-3.5 h-3.5" />
            <span>Propulse par <span className="font-semibold text-slate-400 dark:text-slate-400">RestauMargin</span></span>
          </div>
        </div>
      </footer>
    </div>
  );
}
