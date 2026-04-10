import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  ChefHat, Moon, Sun, AlertTriangle, Loader2, Clock, Flame, Leaf, Fish, Egg, Milk, Nut,
  Filter, X, ShoppingCart, MapPin, Phone, Plus, Minus, ChevronLeft, ChevronRight
} from 'lucide-react';
import { useTranslation } from '../hooks/useTranslation';
import { RecipeCategoryBadge, getCategoryBorderColor } from '../components/RecipePlaceholder';
import FoodIllustration from '../components/FoodIllustration';

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

// ── Theme config ─────────────────────────────────────────────────────────
type MenuTheme = 'classic' | 'dark' | 'elegant';

interface ThemeStyle {
  bg: string;
  bgSecondary: string;
  text: string;
  textSecondary: string;
  card: string;
  cardBorder: string;
  accent: string;
  headerBg: string;
  font: string;
}

const THEME_STYLES: Record<MenuTheme, ThemeStyle> = {
  classic: {
    bg: 'bg-white', bgSecondary: 'bg-[#FAFAFA]',
    text: 'text-[#111111]', textSecondary: 'text-[#737373]',
    card: 'bg-white', cardBorder: 'border-[#E5E7EB]',
    accent: 'bg-[#111111] text-white',
    headerBg: 'bg-white/90',
    font: "'Inter', system-ui, sans-serif",
  },
  dark: {
    bg: 'bg-black', bgSecondary: 'bg-[#0A0A0A]',
    text: 'text-white', textSecondary: 'text-[#A3A3A3]',
    card: 'bg-[#111111]', cardBorder: 'border-[#262626]',
    accent: 'bg-white text-black',
    headerBg: 'bg-black/90',
    font: "'Inter', system-ui, sans-serif",
  },
  elegant: {
    bg: 'bg-[#FAF7F2]', bgSecondary: 'bg-[#F5F0E8]',
    text: 'text-[#3D2B1F]', textSecondary: 'text-[#8B7355]',
    card: 'bg-[#FFFDF9]', cardBorder: 'border-[#E8DFD0]',
    accent: 'bg-[#8B6914] text-white',
    headerBg: 'bg-[#FAF7F2]/90',
    font: "'Georgia', 'Times New Roman', serif",
  },
};

// ── Allergen icon mapping ─────────────────────────────────────────────────
const ALL_ALLERGEN_KEYS = [
  'Gluten', 'Crustaces', 'Oeufs', 'Poissons', 'Arachides',
  'Soja', 'Lait', 'Fruits a coque', 'Celeri', 'Moutarde',
  'Sesame', 'Sulfites', 'Lupin', 'Mollusques',
];

const ALLERGEN_ICONS: Record<string, { icon: React.ReactNode; color: string; colorDark: string; colorElegant: string }> = {
  'Gluten': { icon: <Flame className="w-3 h-3" />, color: 'bg-amber-100 text-amber-700', colorDark: 'bg-amber-900/40 text-amber-300', colorElegant: 'bg-amber-50 text-amber-800' },
  'Crustaces': { icon: <Fish className="w-3 h-3" />, color: 'bg-red-100 text-red-700', colorDark: 'bg-red-900/40 text-red-300', colorElegant: 'bg-red-50 text-red-800' },
  'Oeufs': { icon: <Egg className="w-3 h-3" />, color: 'bg-yellow-100 text-yellow-700', colorDark: 'bg-yellow-900/40 text-yellow-300', colorElegant: 'bg-yellow-50 text-yellow-800' },
  'Poissons': { icon: <Fish className="w-3 h-3" />, color: 'bg-blue-100 text-blue-700', colorDark: 'bg-blue-900/40 text-blue-300', colorElegant: 'bg-blue-50 text-blue-800' },
  'Arachides': { icon: <Nut className="w-3 h-3" />, color: 'bg-orange-100 text-orange-700', colorDark: 'bg-orange-900/40 text-orange-300', colorElegant: 'bg-orange-50 text-orange-800' },
  'Soja': { icon: <Leaf className="w-3 h-3" />, color: 'bg-green-100 text-green-700', colorDark: 'bg-green-900/40 text-green-300', colorElegant: 'bg-green-50 text-green-800' },
  'Lait': { icon: <Milk className="w-3 h-3" />, color: 'bg-sky-100 text-sky-700', colorDark: 'bg-sky-900/40 text-sky-300', colorElegant: 'bg-sky-50 text-sky-800' },
  'Fruits a coque': { icon: <Nut className="w-3 h-3" />, color: 'bg-amber-100 text-amber-700', colorDark: 'bg-amber-900/40 text-amber-300', colorElegant: 'bg-amber-50 text-amber-800' },
  'Celeri': { icon: <Leaf className="w-3 h-3" />, color: 'bg-lime-100 text-lime-700', colorDark: 'bg-lime-900/40 text-lime-300', colorElegant: 'bg-lime-50 text-lime-800' },
  'Moutarde': { icon: <Flame className="w-3 h-3" />, color: 'bg-yellow-100 text-yellow-700', colorDark: 'bg-yellow-900/40 text-yellow-300', colorElegant: 'bg-yellow-50 text-yellow-800' },
  'Sesame': { icon: <Leaf className="w-3 h-3" />, color: 'bg-stone-100 text-stone-700', colorDark: 'bg-stone-900/40 text-stone-300', colorElegant: 'bg-stone-100 text-stone-800' },
  'Sulfites': { icon: <AlertTriangle className="w-3 h-3" />, color: 'bg-purple-100 text-purple-700', colorDark: 'bg-purple-900/40 text-purple-300', colorElegant: 'bg-purple-50 text-purple-800' },
  'Lupin': { icon: <Leaf className="w-3 h-3" />, color: 'bg-violet-100 text-violet-700', colorDark: 'bg-violet-900/40 text-violet-300', colorElegant: 'bg-violet-50 text-violet-800' },
  'Mollusques': { icon: <Fish className="w-3 h-3" />, color: 'bg-teal-100 text-teal-700', colorDark: 'bg-teal-900/40 text-teal-300', colorElegant: 'bg-teal-50 text-teal-800' },
};

// ── Category display order & styling ──────────────────────────────────────
const CATEGORY_ORDER = ['Entree', 'Plat', 'Dessert', 'Boisson', 'Accompagnement'];

const CATEGORY_LABELS: Record<string, Record<string, string>> = {
  fr: { 'Entree': 'Entrees', 'Plat': 'Plats', 'Dessert': 'Desserts', 'Boisson': 'Boissons', 'Accompagnement': 'Accompagnements' },
  en: { 'Entree': 'Starters', 'Plat': 'Main Courses', 'Dessert': 'Desserts', 'Boisson': 'Beverages', 'Accompagnement': 'Sides' },
  es: { 'Entree': 'Entrantes', 'Plat': 'Platos Principales', 'Dessert': 'Postres', 'Boisson': 'Bebidas', 'Accompagnement': 'Acompañamientos' },
  ar: { 'Entree': 'المقبلات', 'Plat': 'الاطباق الرئيسية', 'Dessert': 'الحلويات', 'Boisson': 'المشروبات', 'Accompagnement': 'المرافقات' },
};

const CATEGORY_EMOJI: Record<string, string> = {
  'Entree': '🥗',
  'Plat': '🍽',
  'Dessert': '🍰',
  'Boisson': '🥂',
  'Accompagnement': '🥖',
};

function normalizeCategory(cat: string): string {
  return cat.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
}

// ── Main Component ────────────────────────────────────────────────────────
export default function PublicMenu() {
  const { t } = useTranslation();
  const [searchParams] = useSearchParams();
  const hidePrices = searchParams.get('hidePrices') === '1';
  const hideAllergens = searchParams.get('hideAllergens') === '1';
  const hideDesc = searchParams.get('hideDesc') === '1';
  const lang = searchParams.get('lang') || 'fr';
  const themeParam = (searchParams.get('theme') || 'classic') as MenuTheme;
  const orderEnabled = searchParams.get('order') === '1';

  const [recipes, setRecipes] = useState<PublicRecipe[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Theme: use param or default
  const [theme, setTheme] = useState<MenuTheme>(themeParam);
  const ts = THEME_STYLES[theme];

  // Allergen filter for customers
  const [showAllergenPanel, setShowAllergenPanel] = useState(false);
  const [customerAllergens, setCustomerAllergens] = useState<string[]>([]);

  // Active category for swipeable tabs
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const categoryTabsRef = useRef<HTMLDivElement>(null);

  // Order cart
  const [cart, setCart] = useState<Record<number, number>>({});

  const toggleTheme = useCallback(() => {
    setTheme(prev => {
      if (prev === 'classic') return 'dark';
      if (prev === 'dark') return 'elegant';
      return 'classic';
    });
  }, []);

  useEffect(() => {
    fetchPublicMenu();
  }, []);

  async function fetchPublicMenu() {
    try {
      const ridFromUrl = searchParams.get('restaurantId');
      const ridFromStorage = localStorage.getItem('activeRestaurantId');
      const rid = ridFromUrl || ridFromStorage || '1';
      const res = await fetch(`${API_BASE}/public/menu?restaurantId=${rid}`);
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
  const grouped = useMemo(() => {
    return recipes.reduce<Record<string, PublicRecipe[]>>((acc, recipe) => {
      const normCat = normalizeCategory(recipe.category);
      if (!acc[normCat]) acc[normCat] = [];
      acc[normCat].push(recipe);
      return acc;
    }, {});
  }, [recipes]);

  const sortedCategories = useMemo(() => {
    const cats = CATEGORY_ORDER.filter((c) => grouped[c]?.length);
    Object.keys(grouped).forEach((c) => {
      if (!cats.includes(c)) cats.push(c);
    });
    return cats;
  }, [grouped]);

  function getAllergens(recipe: PublicRecipe): string[] {
    const set = new Set<string>();
    (recipe.ingredients || []).forEach((ri) => {
      (ri.ingredient?.allergens || []).forEach((a: string) => set.add(a));
    });
    return Array.from(set);
  }

  // Filter out recipes containing customer allergens
  const filteredGrouped = useMemo(() => {
    if (customerAllergens.length === 0) return grouped;
    const result: Record<string, PublicRecipe[]> = {};
    for (const [cat, items] of Object.entries(grouped)) {
      const safe = items.filter(recipe => {
        const recipeAllergens = getAllergens(recipe);
        const normalizedRecipe = recipeAllergens.map(a => a.normalize('NFD').replace(/[\u0300-\u036f]/g, ''));
        return !customerAllergens.some(ca => normalizedRecipe.includes(ca));
      });
      if (safe.length > 0) result[cat] = safe;
    }
    return result;
  }, [grouped, customerAllergens]);

  const labelMap = CATEGORY_LABELS[lang] || CATEGORY_LABELS.fr;

  // Cart functions
  const addToCart = useCallback((id: number) => {
    setCart(prev => ({ ...prev, [id]: (prev[id] || 0) + 1 }));
  }, []);
  const removeFromCart = useCallback((id: number) => {
    setCart(prev => {
      const next = { ...prev };
      if (next[id] > 1) next[id] -= 1;
      else delete next[id];
      return next;
    });
  }, []);
  const totalItems = useMemo(() => Object.values(cart).reduce((a, b) => a + b, 0), [cart]);
  const totalPrice = useMemo(() => {
    return Object.entries(cart).reduce((sum, [id, qty]) => {
      const recipe = recipes.find(r => r.id === Number(id));
      return sum + (recipe ? recipe.sellingPrice * qty : 0);
    }, 0);
  }, [cart, recipes]);

  // Scroll to category
  const scrollToCategory = useCallback((cat: string) => {
    setActiveCategory(cat);
    const el = document.getElementById(`category-${cat}`);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, []);

  // Scroll category tabs
  const scrollTabsBy = useCallback((offset: number) => {
    if (categoryTabsRef.current) {
      categoryTabsRef.current.scrollBy({ left: offset, behavior: 'smooth' });
    }
  }, []);

  // Allergen color by theme
  const getAllergenColor = useCallback((normalized: string) => {
    const info = ALLERGEN_ICONS[normalized];
    if (!info) return theme === 'dark' ? 'bg-[#262626] text-[#A3A3A3]' : theme === 'elegant' ? 'bg-[#F5F0E8] text-[#8B7355]' : 'bg-[#F5F5F5] text-[#737373]';
    if (theme === 'dark') return info.colorDark;
    if (theme === 'elegant') return info.colorElegant;
    return info.color;
  }, [theme]);

  // ── Loading state ──
  if (loading) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${ts.bg}`}>
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
          <p className={`${ts.textSecondary} text-sm`}>
            {lang === 'en' ? 'Loading menu...' : lang === 'es' ? 'Cargando menu...' : lang === 'ar' ? '...جار التحميل' : 'Chargement du menu...'}
          </p>
        </div>
      </div>
    );
  }

  // ── Error state ──
  if (error) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${ts.bg}`}>
        <div className="text-center">
          <AlertTriangle className="w-12 h-12 text-amber-500 mx-auto mb-4" />
          <p className={ts.textSecondary}>{error}</p>
        </div>
      </div>
    );
  }

  const isRtl = lang === 'ar';

  return (
    <div
      className={`min-h-screen ${ts.bg} transition-colors`}
      style={{ fontFamily: ts.font }}
      dir={isRtl ? 'rtl' : 'ltr'}
    >
      {/* ── Restaurant Branding Header ── */}
      <div className={`relative overflow-hidden ${theme === 'dark' ? 'bg-[#111111]' : theme === 'elegant' ? 'bg-[#3D2B1F]' : 'bg-[#111111]'}`}>
        <div className="absolute inset-0 opacity-10 bg-gradient-to-br from-white/20 to-transparent" />
        <div className="relative max-w-2xl mx-auto px-5 pt-10 pb-8">
          {/* Logo placeholder */}
          <div className="flex items-center gap-4 mb-5">
            <div className={`w-16 h-16 rounded-2xl flex items-center justify-center shadow-lg ${
              theme === 'elegant' ? 'bg-[#8B6914]' : 'bg-white/10'
            }`}>
              <ChefHat className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-extrabold text-white leading-tight" style={{ fontFamily: theme === 'elegant' ? "'Georgia', serif" : "'Inter', sans-serif" }}>
                {lang === 'en' ? 'Our Menu' : lang === 'es' ? 'Nuestra Carta' : lang === 'ar' ? 'قائمة الطعام' : 'Notre Carte'}
              </h1>
              <p className="text-sm text-white/50 mt-0.5">
                {lang === 'en' ? 'Discover our culinary selection' : lang === 'es' ? 'Descubra nuestra seleccion' : lang === 'ar' ? 'اكتشف تشكيلتنا' : 'Decouvrez nos plats'}
              </p>
            </div>
          </div>
          {/* Opening hours + contact */}
          <div className="flex flex-wrap gap-3 mt-2">
            <span className="inline-flex items-center gap-1.5 text-xs text-white/40">
              <Clock className="w-3 h-3" />
              {lang === 'en' ? 'Open 12:00 - 22:30' : lang === 'es' ? 'Abierto 12:00 - 22:30' : lang === 'ar' ? '12:00 - 22:30 مفتوح' : 'Ouvert 12h - 22h30'}
            </span>
            <span className="inline-flex items-center gap-1.5 text-xs text-white/40">
              <MapPin className="w-3 h-3" />
              {lang === 'en' ? 'View location' : lang === 'es' ? 'Ver ubicacion' : lang === 'ar' ? 'الموقع' : 'Voir l\'adresse'}
            </span>
          </div>
        </div>
      </div>

      {/* ── Sticky Category Tabs (swipeable) ── */}
      <header className={`sticky top-0 z-20 ${ts.headerBg} backdrop-blur-xl border-b ${ts.cardBorder}`}>
        <div className="max-w-2xl mx-auto px-2 relative">
          {/* Scroll arrows */}
          <button
            onClick={() => scrollTabsBy(-120)}
            className={`absolute left-0 top-1/2 -translate-y-1/2 z-10 w-7 h-7 rounded-full ${ts.card} shadow flex items-center justify-center ${ts.textSecondary} hover:opacity-70`}
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            onClick={() => scrollTabsBy(120)}
            className={`absolute right-0 top-1/2 -translate-y-1/2 z-10 w-7 h-7 rounded-full ${ts.card} shadow flex items-center justify-center ${ts.textSecondary} hover:opacity-70`}
          >
            <ChevronRight className="w-4 h-4" />
          </button>

          <div
            ref={categoryTabsRef}
            className="flex gap-1 overflow-x-auto py-3 px-8 scrollbar-hide scroll-smooth"
            style={{ WebkitOverflowScrolling: 'touch' }}
          >
            {sortedCategories.map((category) => {
              const isActive = activeCategory === category || (!activeCategory && sortedCategories[0] === category);
              return (
                <button
                  key={category}
                  onClick={() => scrollToCategory(category)}
                  className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-semibold whitespace-nowrap transition-all ${
                    isActive
                      ? ts.accent
                      : `${ts.textSecondary} hover:opacity-70`
                  }`}
                >
                  <span className="text-base">{CATEGORY_EMOJI[category] || '🍴'}</span>
                  {labelMap[category] || category}
                </button>
              );
            })}
          </div>
        </div>
      </header>

      {/* ── Toolbar: Theme toggle + Allergen filter ── */}
      <div className="max-w-2xl mx-auto px-5 pt-4 pb-2 flex items-center gap-2">
        {/* Theme toggle */}
        <button
          onClick={toggleTheme}
          className={`p-2.5 rounded-xl border ${ts.cardBorder} ${ts.card} ${ts.textSecondary} hover:opacity-70 transition`}
          aria-label="Toggle theme"
        >
          {theme === 'classic' ? <Moon className="w-4 h-4" /> : theme === 'dark' ? <Sun className="w-4 h-4" /> : <Flame className="w-4 h-4" />}
        </button>

        {/* Allergen filter button */}
        <button
          onClick={() => setShowAllergenPanel(!showAllergenPanel)}
          className={`flex items-center gap-2 px-3 py-2.5 rounded-xl border text-sm font-medium transition ${
            customerAllergens.length > 0
              ? ts.accent + ' border-transparent'
              : `${ts.cardBorder} ${ts.card} ${ts.textSecondary}`
          }`}
        >
          <Filter className="w-4 h-4" />
          {lang === 'en' ? 'Allergies' : lang === 'es' ? 'Alergias' : lang === 'ar' ? 'الحساسية' : 'Allergenes'}
          {customerAllergens.length > 0 && (
            <span className={`w-5 h-5 rounded-full text-[10px] font-bold flex items-center justify-center ${
              theme === 'dark' ? 'bg-black text-white' : 'bg-white text-black'
            }`}>
              {customerAllergens.length}
            </span>
          )}
        </button>

        <div className="flex-1" />

        {/* Dish count */}
        <span className={`text-xs font-medium ${ts.textSecondary}`}>
          {recipes.length} {lang === 'en' ? 'dishes' : lang === 'es' ? 'platos' : lang === 'ar' ? 'طبق' : 'plats'}
        </span>
      </div>

      {/* ── Allergen Filter Panel ── */}
      {showAllergenPanel && (
        <div className={`max-w-2xl mx-auto px-5 pb-4`}>
          <div className={`${ts.card} border ${ts.cardBorder} rounded-2xl p-4`}>
            <div className="flex items-center justify-between mb-3">
              <h3 className={`text-sm font-bold ${ts.text} flex items-center gap-2`}>
                <AlertTriangle className="w-4 h-4 opacity-40" />
                {lang === 'en' ? 'Select your allergies' : lang === 'es' ? 'Seleccione sus alergias' : lang === 'ar' ? 'حدد الحساسية' : 'Selectionnez vos allergies'}
              </h3>
              {customerAllergens.length > 0 && (
                <button onClick={() => setCustomerAllergens([])} className={`text-xs ${ts.textSecondary} hover:opacity-70`}>
                  {lang === 'en' ? 'Clear all' : lang === 'es' ? 'Limpiar' : lang === 'ar' ? 'مسح الكل' : 'Tout effacer'}
                </button>
              )}
            </div>
            <p className={`text-xs ${ts.textSecondary} mb-3`}>
              {lang === 'en' ? 'Dishes containing selected allergens will be hidden.' : lang === 'es' ? 'Los platos con alergenos seleccionados se ocultaran.' : lang === 'ar' ? '.سيتم اخفاء الاطباق التي تحتوي على المسببات المحددة' : 'Les plats contenant ces allergenes seront masques.'}
            </p>
            <div className="flex flex-wrap gap-2">
              {ALL_ALLERGEN_KEYS.map(a => {
                const isActive = customerAllergens.includes(a);
                const info = ALLERGEN_ICONS[a];
                return (
                  <button
                    key={a}
                    onClick={() => {
                      setCustomerAllergens(prev =>
                        prev.includes(a) ? prev.filter(x => x !== a) : [...prev, a]
                      );
                    }}
                    className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium border transition-all ${
                      isActive
                        ? ts.accent + ' border-transparent shadow-sm'
                        : `${ts.cardBorder} ${ts.textSecondary} hover:opacity-70`
                    }`}
                  >
                    {info?.icon || <AlertTriangle className="w-3 h-3" />}
                    {a}
                    {isActive && <X className="w-3 h-3" />}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* ── Menu Content ── */}
      <main className="max-w-2xl mx-auto px-5 py-4 space-y-8 pb-32">
        {sortedCategories.map((category) => {
          const items = filteredGrouped[category];
          if (!items || items.length === 0) return null;

          return (
            <section key={category} id={`category-${category}`} className="scroll-mt-20 space-y-4">
              {/* Category Header */}
              <div className="flex items-center gap-3">
                <span className="text-2xl">{CATEGORY_EMOJI[category] || '🍴'}</span>
                <div>
                  <h2 className={`text-xl font-extrabold ${ts.text} tracking-tight`} style={{ fontFamily: ts.font }}>
                    {labelMap[category] || category}
                  </h2>
                  <p className={`text-xs ${ts.textSecondary}`}>
                    {items.length} {lang === 'en' ? 'items' : lang === 'es' ? 'platos' : lang === 'ar' ? 'عنصر' : 'plats'}
                  </p>
                </div>
              </div>

              {/* Dishes */}
              <div className="space-y-3">
                {items.map((recipe) => {
                  const allergens = getAllergens(recipe);
                  const totalTime = (recipe.prepTimeMinutes || 0) + (recipe.cookTimeMinutes || 0);
                  const cartQty = cart[recipe.id] || 0;

                  return (
                    <div
                      key={recipe.id}
                      className={`${ts.card} rounded-2xl border ${ts.cardBorder} overflow-hidden transition-all ${
                        cartQty > 0 ? 'ring-2 ring-black/10' : ''
                      }`}
                    >
                      <div className="flex gap-4 p-4">
                        {/* Large food illustration */}
                        <div className="flex-shrink-0">
                          <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-xl overflow-hidden">
                            <FoodIllustration
                              recipeName={recipe.name}
                              category={normalizeCategory(recipe.category)}
                              size="md"
                              animated
                            />
                          </div>
                        </div>

                        {/* Content */}
                        <div className="flex-1 min-w-0">
                          <h3
                            className={`text-base font-bold ${ts.text} leading-snug`}
                            style={{ fontFamily: ts.font }}
                          >
                            {recipe.name}
                          </h3>

                          {!hideDesc && recipe.description && (
                            <p className={`text-sm ${ts.textSecondary} mt-1 leading-relaxed line-clamp-2`}>
                              {recipe.description}
                            </p>
                          )}

                          {/* Meta: time + allergens */}
                          <div className="flex flex-wrap items-center gap-1.5 mt-2">
                            {totalTime > 0 && (
                              <span className={`inline-flex items-center gap-1 text-xs ${ts.textSecondary}`}>
                                <Clock className="w-3 h-3" />
                                {totalTime} min
                              </span>
                            )}
                            {!hideAllergens && allergens.length > 0 && (
                              <div className="flex flex-wrap gap-1">
                                {allergens.map((a) => {
                                  const normalized = a.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
                                  const info = ALLERGEN_ICONS[normalized];
                                  const colorClass = getAllergenColor(normalized);
                                  return (
                                    <span
                                      key={a}
                                      title={a}
                                      className={`inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-full text-[10px] font-medium ${colorClass}`}
                                    >
                                      {info?.icon || <AlertTriangle className="w-3 h-3" />}
                                      {a}
                                    </span>
                                  );
                                })}
                              </div>
                            )}
                          </div>

                          {/* Price row + order button */}
                          <div className="flex items-center justify-between mt-3">
                            {!hidePrices && (
                              <span className={`text-xl font-extrabold ${ts.text}`} style={{ fontFamily: ts.font }}>
                                {recipe.sellingPrice.toFixed(2)}
                                <span className={`text-sm font-normal ${ts.textSecondary} ml-0.5`}>&euro;</span>
                              </span>
                            )}

                            {/* Order controls */}
                            {orderEnabled && (
                              <div className="flex items-center gap-1">
                                {cartQty > 0 ? (
                                  <>
                                    <button
                                      onClick={() => removeFromCart(recipe.id)}
                                      className={`w-8 h-8 rounded-lg border ${ts.cardBorder} flex items-center justify-center ${ts.textSecondary} hover:opacity-70 transition`}
                                    >
                                      <Minus className="w-3.5 h-3.5" />
                                    </button>
                                    <span className={`w-8 text-center text-sm font-bold ${ts.text}`}>{cartQty}</span>
                                    <button
                                      onClick={() => addToCart(recipe.id)}
                                      className={`w-8 h-8 rounded-lg ${ts.accent} flex items-center justify-center hover:opacity-80 transition`}
                                    >
                                      <Plus className="w-3.5 h-3.5" />
                                    </button>
                                  </>
                                ) : (
                                  <button
                                    onClick={() => addToCart(recipe.id)}
                                    className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold ${ts.accent} hover:opacity-80 transition`}
                                  >
                                    <Plus className="w-3.5 h-3.5" />
                                    {lang === 'en' ? 'Add' : lang === 'es' ? 'Agregar' : lang === 'ar' ? 'اضف' : 'Ajouter'}
                                  </button>
                                )}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>
          );
        })}

        {recipes.length === 0 && (
          <div className="text-center py-16">
            <ChefHat className={`w-16 h-16 ${ts.textSecondary} mx-auto mb-4 opacity-30`} />
            <p className={`${ts.textSecondary} text-lg`}>
              {lang === 'en' ? 'The menu is being prepared...' : lang === 'es' ? 'El menu se esta preparando...' : lang === 'ar' ? '...القائمة قيد التحضير' : 'Le menu est en cours de preparation...'}
            </p>
          </div>
        )}

        {/* Customer allergen info notice */}
        {customerAllergens.length > 0 && (
          <div className={`${ts.card} border ${ts.cardBorder} rounded-2xl p-4 text-center`}>
            <p className={`text-xs ${ts.textSecondary}`}>
              {lang === 'en'
                ? `Hiding dishes containing: ${customerAllergens.join(', ')}`
                : lang === 'es'
                ? `Ocultando platos que contienen: ${customerAllergens.join(', ')}`
                : lang === 'ar'
                ? `اخفاء الاطباق التي تحتوي على: ${customerAllergens.join(', ')}`
                : `Plats masques contenant : ${customerAllergens.join(', ')}`
              }
            </p>
            <button
              onClick={() => { setCustomerAllergens([]); setShowAllergenPanel(false); }}
              className={`mt-2 text-xs font-semibold ${ts.textSecondary} underline hover:opacity-70`}
            >
              {lang === 'en' ? 'Show all dishes' : lang === 'es' ? 'Mostrar todos' : lang === 'ar' ? 'عرض جميع الاطباق' : 'Afficher tous les plats'}
            </button>
          </div>
        )}
      </main>

      {/* ── Floating Cart Bar (order mode) ── */}
      {orderEnabled && totalItems > 0 && (
        <div className="fixed bottom-0 left-0 right-0 z-50 px-4 pb-4">
          <div className={`max-w-2xl mx-auto ${ts.accent} rounded-2xl shadow-2xl px-5 py-4 flex items-center gap-4`}>
            <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
              <ShoppingCart className="w-5 h-5" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-bold">
                {totalItems} {lang === 'en' ? 'item' : lang === 'es' ? 'articulo' : lang === 'ar' ? 'عنصر' : 'article'}{totalItems > 1 ? 's' : ''}
              </p>
              <p className="text-xs opacity-60">{totalPrice.toFixed(2)} EUR</p>
            </div>
            <button
              onClick={() => {
                alert(
                  lang === 'en'
                    ? `Order of ${totalItems} items (${totalPrice.toFixed(2)} EUR) sent to kitchen!`
                    : `Commande de ${totalItems} articles (${totalPrice.toFixed(2)} EUR) envoyee en cuisine !`
                );
                setCart({});
              }}
              className={`px-5 py-2.5 rounded-xl text-sm font-bold transition ${
                theme === 'dark' ? 'bg-black text-white hover:opacity-80' : 'bg-white text-black hover:opacity-80'
              }`}
            >
              {lang === 'en' ? 'Order' : lang === 'es' ? 'Pedir' : lang === 'ar' ? 'اطلب' : 'Commander'}
            </button>
          </div>
        </div>
      )}

      {/* ── Footer ── */}
      <footer className={`border-t ${ts.cardBorder} mt-4`}>
        <div className="max-w-2xl mx-auto px-5 py-6 text-center">
          <div className={`flex items-center justify-center gap-2 text-xs ${ts.textSecondary}`}>
            <ChefHat className="w-3.5 h-3.5" />
            <span>Propulse par <span className="font-semibold">RestauMargin</span></span>
          </div>
        </div>
      </footer>
    </div>
  );
}
