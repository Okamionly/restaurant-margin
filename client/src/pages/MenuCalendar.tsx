import { formatCurrency } from '../utils/currency';
import { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  Plus,
  X,
  Printer,
  Sun,
  Moon as MoonIcon,
  Leaf,
  Search,
  GripVertical,
  CalendarDays,
  CalendarRange,
  ShoppingCart,
  RotateCcw,
  Tag,
  Download,
  ChevronDown,
  ChevronUp,
  TrendingUp,
  TrendingDown,
  Minus,
  AlertTriangle,
  Check,
  Clock,
  Sparkles,
} from 'lucide-react';
import { fetchRecipes } from '../services/api';
import { useApiClient } from '../hooks/useApiClient';
import { useToast } from '../hooks/useToast';
import { useRestaurant } from '../hooks/useRestaurant';
import { useFocusTrap } from '../hooks/useFocusTrap';
import type { Recipe } from '../types';
import FoodIllustration from '../components/FoodIllustration';

// ── Types ──

interface MenuCalendarEntry {
  id: number;
  restaurantId: number;
  date: string;
  mealType: 'lunch' | 'dinner';
  recipeId: number;
  category: string | null;
  createdAt: string;
  recipe: {
    id: number;
    name: string;
    category: string;
    sellingPrice: number;
  };
}

type ViewMode = 'month' | 'week';

interface ShoppingItem {
  ingredientName: string;
  totalQuantity: number;
  unit: string;
  estimatedCost: number;
}

// ── Seasonal ingredients by month (France) ──

const SEASONAL_INGREDIENTS: Record<number, string[]> = {
  1: ['Poireau', 'Chou', 'Endive', 'Topinambour', 'Mache', 'Orange', 'Poire', 'Kiwi'],
  2: ['Poireau', 'Chou', 'Endive', 'Navet', 'Celeri', 'Orange', 'Pomme', 'Citron'],
  3: ['Radis', 'Epinard', 'Asperge', 'Cresson', 'Pomelo', 'Kiwi', 'Pomme'],
  4: ['Asperge', 'Radis', 'Petit pois', 'Artichaut', 'Fraise', 'Rhubarbe'],
  5: ['Asperge', 'Petit pois', 'Feve', 'Courgette', 'Fraise', 'Cerise'],
  6: ['Courgette', 'Tomate', 'Aubergine', 'Poivron', 'Fraise', 'Cerise', 'Abricot', 'Peche'],
  7: ['Tomate', 'Courgette', 'Aubergine', 'Haricot vert', 'Melon', 'Peche', 'Abricot', 'Framboise'],
  8: ['Tomate', 'Poivron', 'Aubergine', 'Figue', 'Melon', 'Mirabelle', 'Mure'],
  9: ['Raisin', 'Figue', 'Poire', 'Potiron', 'Champignon', 'Brocoli', 'Chou-fleur'],
  10: ['Potiron', 'Champignon', 'Chataigne', 'Coing', 'Pomme', 'Poire', 'Noix'],
  11: ['Courge', 'Topinambour', 'Panais', 'Chou', 'Clementine', 'Kaki', 'Pomme'],
  12: ['Poireau', 'Endive', 'Courge', 'Panais', 'Clementine', 'Orange', 'Marron'],
};

// ── Season tags by month ──

const SEASON_TAGS: Record<number, { label: string; icon: string; color: string }> = {
  1: { label: 'Hiver', icon: '❄', color: 'bg-[#E5E7EB] dark:bg-[#1A1A1A] text-[#374151] dark:text-[#D1D5DB]' },
  2: { label: 'Hiver', icon: '❄', color: 'bg-[#E5E7EB] dark:bg-[#1A1A1A] text-[#374151] dark:text-[#D1D5DB]' },
  3: { label: 'Printemps', icon: '🌱', color: 'bg-[#F3F4F6] dark:bg-[#171717] text-[#374151] dark:text-[#D1D5DB]' },
  4: { label: 'Printemps', icon: '🌱', color: 'bg-[#F3F4F6] dark:bg-[#171717] text-[#374151] dark:text-[#D1D5DB]' },
  5: { label: 'Printemps', icon: '🌱', color: 'bg-[#F3F4F6] dark:bg-[#171717] text-[#374151] dark:text-[#D1D5DB]' },
  6: { label: 'Ete', icon: '☀', color: 'bg-[#F9FAFB] dark:bg-[#0F0F0F] text-[#111111] dark:text-white' },
  7: { label: 'Ete', icon: '☀', color: 'bg-[#F9FAFB] dark:bg-[#0F0F0F] text-[#111111] dark:text-white' },
  8: { label: 'Ete', icon: '☀', color: 'bg-[#F9FAFB] dark:bg-[#0F0F0F] text-[#111111] dark:text-white' },
  9: { label: 'Automne', icon: '🍂', color: 'bg-[#F3F4F6] dark:bg-[#1A1A1A] text-[#374151] dark:text-[#D1D5DB]' },
  10: { label: 'Automne', icon: '🍂', color: 'bg-[#F3F4F6] dark:bg-[#1A1A1A] text-[#374151] dark:text-[#D1D5DB]' },
  11: { label: 'Automne', icon: '🍂', color: 'bg-[#F3F4F6] dark:bg-[#1A1A1A] text-[#374151] dark:text-[#D1D5DB]' },
  12: { label: 'Hiver', icon: '❄', color: 'bg-[#E5E7EB] dark:bg-[#1A1A1A] text-[#374151] dark:text-[#D1D5DB]' },
};

// ── Margin color coding ──

function getMarginColor(marginPercent: number): { bg: string; border: string; text: string; indicator: string } {
  if (marginPercent >= 70) return {
    bg: 'bg-[#F0FDF4] dark:bg-[#052E16]',
    border: 'border-[#86EFAC] dark:border-[#166534]',
    text: 'text-[#166534] dark:text-[#86EFAC]',
    indicator: 'bg-[#22C55E]',
  };
  if (marginPercent >= 50) return {
    bg: 'bg-[#F9FAFB] dark:bg-[#171717]',
    border: 'border-[#D1D5DB] dark:border-[#333333]',
    text: 'text-[#374151] dark:text-[#D1D5DB]',
    indicator: 'bg-[#6B7280]',
  };
  if (marginPercent >= 30) return {
    bg: 'bg-[#FFFBEB] dark:bg-[#451A03]',
    border: 'border-[#FCD34D] dark:border-[#92400E]',
    text: 'text-[#92400E] dark:text-[#FCD34D]',
    indicator: 'bg-[#F59E0B]',
  };
  return {
    bg: 'bg-[#FEF2F2] dark:bg-[#450A0A]',
    border: 'border-[#FCA5A5] dark:border-[#991B1B]',
    text: 'text-[#991B1B] dark:text-[#FCA5A5]',
    indicator: 'bg-[#EF4444]',
  };
}

// ── Category color mapping (monochrome W&B with subtle accents) ──

const CATEGORY_COLORS: Record<string, { bg: string; text: string; border: string }> = {
  'Entree':         { bg: 'bg-[#F3F4F6] dark:bg-[#1A1A1A]', text: 'text-[#111111] dark:text-[#E5E7EB]', border: 'border-[#D1D5DB] dark:border-[#333333]' },
  'Plat':           { bg: 'bg-[#E5E7EB] dark:bg-[#262626]', text: 'text-[#111111] dark:text-white', border: 'border-[#9CA3AF] dark:border-[#404040]' },
  'Dessert':        { bg: 'bg-[#F9FAFB] dark:bg-[#171717]', text: 'text-[#374151] dark:text-[#D1D5DB]', border: 'border-[#E5E7EB] dark:border-[#2A2A2A]' },
  'Boisson':        { bg: 'bg-white dark:bg-[#0F0F0F]', text: 'text-[#6B7280] dark:text-[#9CA3AF]', border: 'border-[#E5E7EB] dark:border-[#1A1A1A]' },
  'Accompagnement': { bg: 'bg-[#F3F4F6] dark:bg-[#1F1F1F]', text: 'text-[#4B5563] dark:text-[#D1D5DB]', border: 'border-[#D1D5DB] dark:border-[#333333]' },
};

function getCategoryStyle(cat: string) {
  return CATEGORY_COLORS[cat] || CATEGORY_COLORS['Plat'];
}

// ── Helpers ──

function formatDateKey(d: Date): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

function getDaysInMonth(year: number, month: number): Date[] {
  const days: Date[] = [];
  const last = new Date(year, month + 1, 0).getDate();
  for (let d = 1; d <= last; d++) {
    days.push(new Date(year, month, d));
  }
  return days;
}

function getWeekDays(year: number, month: number, day: number): Date[] {
  const date = new Date(year, month, day);
  const dayOfWeek = (date.getDay() + 6) % 7; // Monday = 0
  const monday = new Date(date);
  monday.setDate(date.getDate() - dayOfWeek);
  const days: Date[] = [];
  for (let i = 0; i < 7; i++) {
    const d = new Date(monday);
    d.setDate(monday.getDate() + i);
    days.push(d);
  }
  return days;
}

const WEEKDAYS = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'];
const WEEKDAYS_FULL = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi', 'Dimanche'];

const MONTH_NAMES = [
  'Janvier', 'Fevrier', 'Mars', 'Avril', 'Mai', 'Juin',
  'Juillet', 'Aout', 'Septembre', 'Octobre', 'Novembre', 'Decembre',
];

// ── Component ──

export default function MenuCalendar() {
  const { showToast } = useToast();
  useRestaurant();
  const { authHeaders } = useApiClient();

  const today = new Date();
  const [currentYear, setCurrentYear] = useState(today.getFullYear());
  const [currentMonth, setCurrentMonth] = useState(today.getMonth());
  const [currentDay, setCurrentDay] = useState(today.getDate());
  const [mealType, setMealType] = useState<'lunch' | 'dinner'>('lunch');
  const [viewMode, setViewMode] = useState<ViewMode>('month');
  const [entries, setEntries] = useState<MenuCalendarEntry[]>([]);
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);

  // Sidebar
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarSearch, setSidebarSearch] = useState('');
  const [sidebarCategory, setSidebarCategory] = useState<string>('all');
  const [sidebarDragRecipe, setSidebarDragRecipe] = useState<Recipe | null>(null);

  // Modal state
  const [modalOpen, setModalOpen] = useState(false);
  const modalTrapRef = useFocusTrap<HTMLDivElement>(modalOpen);
  const [modalDate, setModalDate] = useState<Date | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  // Shopping list
  const [shoppingListOpen, setShoppingListOpen] = useState(false);

  // Rotation tracker
  const [rotationOpen, setRotationOpen] = useState(false);

  // Season banner
  const [seasonBannerOpen, setSeasonBannerOpen] = useState(true);

  // Drag state
  const [dragEntry, setDragEntry] = useState<MenuCalendarEntry | null>(null);
  const [dragOverDate, setDragOverDate] = useState<string | null>(null);

  // Print ref
  const calendarRef = useRef<HTMLDivElement>(null);

  // ── Data fetching ──

  const monthKey = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}`;

  const loadEntries = useCallback(async () => {
    try {
      const res = await fetch(`/api/menu-calendar?month=${monthKey}`, { headers: authHeaders() });
      if (!res.ok) throw new Error('Fetch error');
      const data = await res.json();
      setEntries(data);
    } catch {
      // silent fail on initial load
    }
  }, [monthKey]);

  const loadRecipes = useCallback(async () => {
    try {
      const data = await fetchRecipes();
      setRecipes(data);
    } catch {
      // silent
    }
  }, []);

  useEffect(() => {
    setLoading(true);
    Promise.all([loadEntries(), loadRecipes()]).finally(() => setLoading(false));
  }, [loadEntries, loadRecipes]);

  // ── Entries grouped by date ──

  const entriesByDate = useMemo(() => {
    const map: Record<string, MenuCalendarEntry[]> = {};
    for (const entry of entries) {
      const key = entry.date.slice(0, 10);
      if (!map[key]) map[key] = [];
      if (entry.mealType === mealType) {
        map[key].push(entry);
      }
    }
    return map;
  }, [entries, mealType]);

  // ── Calendar grid ──

  const days = getDaysInMonth(currentYear, currentMonth);
  const weekDays = getWeekDays(currentYear, currentMonth, currentDay);
  const firstDayOfWeek = (days[0].getDay() + 6) % 7;
  const paddingDays = Array.from({ length: firstDayOfWeek }, (_, i) => i);

  // ── Recipe margin lookup ──

  const recipeMarginMap = useMemo(() => {
    const map: Record<number, number> = {};
    for (const r of recipes) {
      if (r.margin) {
        map[r.id] = r.margin.marginPercent;
      }
    }
    return map;
  }, [recipes]);

  // ── Rotation tracker data ──

  const rotationData = useMemo(() => {
    const counts: Record<number, { name: string; count: number; lastUsed: string; category: string }> = {};
    for (const entry of entries) {
      if (!counts[entry.recipeId]) {
        counts[entry.recipeId] = {
          name: entry.recipe.name,
          count: 0,
          lastUsed: entry.date,
          category: entry.recipe.category,
        };
      }
      counts[entry.recipeId].count++;
      if (entry.date > counts[entry.recipeId].lastUsed) {
        counts[entry.recipeId].lastUsed = entry.date;
      }
    }
    return Object.values(counts).sort((a, b) => b.count - a.count);
  }, [entries]);

  // ── Shopping list generator ──

  const shoppingList = useMemo((): ShoppingItem[] => {
    const ingredientMap: Record<string, ShoppingItem> = {};
    for (const entry of entries) {
      if (entry.mealType !== mealType) continue;
      const recipe = recipes.find(r => r.id === entry.recipeId);
      if (!recipe?.ingredients) continue;
      for (const ri of recipe.ingredients) {
        const key = `${ri.ingredient.name}-${ri.ingredient.unit}`;
        if (!ingredientMap[key]) {
          ingredientMap[key] = {
            ingredientName: ri.ingredient.name,
            totalQuantity: 0,
            unit: ri.ingredient.unit,
            estimatedCost: 0,
          };
        }
        const wasteMultiplier = 1 + (ri.wastePercent / 100);
        ingredientMap[key].totalQuantity += ri.quantity * wasteMultiplier;
        ingredientMap[key].estimatedCost += ri.quantity * wasteMultiplier * ri.ingredient.pricePerUnit;
      }
    }
    return Object.values(ingredientMap).sort((a, b) => a.ingredientName.localeCompare(b.ingredientName));
  }, [entries, recipes, mealType]);

  const totalShoppingCost = useMemo(() => shoppingList.reduce((s, i) => s + i.estimatedCost, 0), [shoppingList]);

  // ── Navigation ──

  const goToPrevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(y => y - 1);
    } else {
      setCurrentMonth(m => m - 1);
    }
  };

  const goToNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(y => y + 1);
    } else {
      setCurrentMonth(m => m + 1);
    }
  };

  const goToPrevWeek = () => {
    const d = new Date(currentYear, currentMonth, currentDay - 7);
    setCurrentYear(d.getFullYear());
    setCurrentMonth(d.getMonth());
    setCurrentDay(d.getDate());
  };

  const goToNextWeek = () => {
    const d = new Date(currentYear, currentMonth, currentDay + 7);
    setCurrentYear(d.getFullYear());
    setCurrentMonth(d.getMonth());
    setCurrentDay(d.getDate());
  };

  const goToToday = () => {
    setCurrentYear(today.getFullYear());
    setCurrentMonth(today.getMonth());
    setCurrentDay(today.getDate());
  };

  // ── Actions ──

  const addRecipeToDate = async (recipe: Recipe, date: Date) => {
    try {
      const res = await fetch('/api/menu-calendar', {
        method: 'POST',
        headers: authHeaders(),
        body: JSON.stringify({
          date: formatDateKey(date),
          mealType,
          menuItems: [{ recipeId: recipe.id, category: recipe.category }],
        }),
      });
      if (!res.ok) throw new Error('Erreur');
      const created = await res.json();
      setEntries(prev => [...prev, ...created]);
      showToast(`${recipe.name} ajoute au ${formatDateKey(date)}`, 'success');
    } catch {
      showToast('Erreur lors de l\'ajout', 'error');
    }
  };

  const removeEntry = async (id: number) => {
    try {
      const res = await fetch(`/api/menu-calendar/${id}`, {
        method: 'DELETE',
        headers: authHeaders(),
      });
      if (!res.ok) throw new Error('Erreur');
      setEntries(prev => prev.filter(e => e.id !== id));
    } catch {
      showToast('Erreur lors de la suppression', 'error');
    }
  };

  // ── Drag & Drop (entry move) ──

  const handleDragStart = (entry: MenuCalendarEntry) => {
    setDragEntry(entry);
    setSidebarDragRecipe(null);
  };

  const handleDragOver = (e: React.DragEvent, dateKey: string) => {
    e.preventDefault();
    setDragOverDate(dateKey);
  };

  const handleDragLeave = () => {
    setDragOverDate(null);
  };

  const handleDrop = async (e: React.DragEvent, targetDate: Date) => {
    e.preventDefault();
    setDragOverDate(null);

    // Drop from sidebar
    if (sidebarDragRecipe) {
      await addRecipeToDate(sidebarDragRecipe, targetDate);
      setSidebarDragRecipe(null);
      return;
    }

    if (!dragEntry) return;

    const targetKey = formatDateKey(targetDate);
    const sourceKey = dragEntry.date.slice(0, 10);
    if (targetKey === sourceKey) return;

    try {
      await fetch(`/api/menu-calendar/${dragEntry.id}`, {
        method: 'DELETE',
        headers: authHeaders(),
      });

      const res = await fetch('/api/menu-calendar', {
        method: 'POST',
        headers: authHeaders(),
        body: JSON.stringify({
          date: targetKey,
          mealType: dragEntry.mealType,
          menuItems: [{ recipeId: dragEntry.recipeId, category: dragEntry.category }],
        }),
      });
      if (!res.ok) throw new Error('Erreur');
      const created = await res.json();
      setEntries(prev => [...prev.filter(e => e.id !== dragEntry.id), ...created]);
      showToast(`${dragEntry.recipe.name} deplace au ${targetKey}`, 'success');
    } catch {
      showToast('Erreur lors du deplacement', 'error');
    }
    setDragEntry(null);
  };

  // ── Sidebar drag ──

  const handleSidebarDragStart = (e: React.DragEvent, recipe: Recipe) => {
    setSidebarDragRecipe(recipe);
    setDragEntry(null);
    e.dataTransfer.effectAllowed = 'copy';
    e.dataTransfer.setData('text/plain', String(recipe.id));
  };

  // ── Print ──

  const handlePrint = () => {
    window.print();
  };

  // ── Export shopping list ──

  const exportShoppingList = () => {
    const lines = [
      `Liste de courses — ${MONTH_NAMES[currentMonth]} ${currentYear} (${mealType === 'lunch' ? 'Dejeuner' : 'Diner'})`,
      '',
      ...shoppingList.map(item =>
        `- ${item.ingredientName}: ${item.totalQuantity.toFixed(2)} ${item.unit} (~${formatCurrency(item.estimatedCost)})`
      ),
      '',
      `Total estime: ${formatCurrency(totalShoppingCost)}`,
    ];
    const blob = new Blob([lines.join('\n')], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `courses-${monthKey}.txt`;
    a.click();
    URL.revokeObjectURL(url);
    showToast('Liste de courses exportee', 'success');
  };

  // ── Seasonal ingredients for current month ──

  const seasonalItems = SEASONAL_INGREDIENTS[currentMonth + 1] || [];
  const seasonTag = SEASON_TAGS[currentMonth + 1];

  // ── Sidebar filtered recipes ──

  const sidebarFilteredRecipes = useMemo(() => {
    let filtered = recipes;
    if (sidebarCategory !== 'all') {
      filtered = filtered.filter(r => r.category === sidebarCategory);
    }
    if (sidebarSearch) {
      const q = sidebarSearch.toLowerCase();
      filtered = filtered.filter(r => r.name.toLowerCase().includes(q));
    }
    return filtered;
  }, [recipes, sidebarCategory, sidebarSearch]);

  // ── Modal filtered recipes ──

  const filteredRecipes = useMemo(() => {
    let filtered = recipes;
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(r => r.category === selectedCategory);
    }
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      filtered = filtered.filter(r => r.name.toLowerCase().includes(q));
    }
    return filtered;
  }, [recipes, selectedCategory, searchQuery]);

  const uniqueCategories = useMemo(() => {
    return [...new Set(recipes.map(r => r.category))].sort();
  }, [recipes]);

  // ── Today check ──

  const todayKey = formatDateKey(today);

  // ── Monthly stats ──

  const monthStats = useMemo(() => {
    const mealEntries = entries.filter(e => e.mealType === mealType);
    const totalRecipes = mealEntries.length;
    const uniqueRecipes = new Set(mealEntries.map(e => e.recipeId)).size;
    const daysWithMenu = new Set(mealEntries.map(e => e.date.slice(0, 10))).size;
    const totalDays = days.length;

    let avgMargin = 0;
    let marginCount = 0;
    for (const e of mealEntries) {
      const m = recipeMarginMap[e.recipeId];
      if (m !== undefined) {
        avgMargin += m;
        marginCount++;
      }
    }
    if (marginCount > 0) avgMargin /= marginCount;

    return { totalRecipes, uniqueRecipes, daysWithMenu, totalDays, avgMargin };
  }, [entries, mealType, days, recipeMarginMap]);

  // ── Render helpers ──

  const renderRecipePill = (entry: MenuCalendarEntry, compact = false) => {
    const margin = recipeMarginMap[entry.recipeId];
    const marginColor = margin !== undefined ? getMarginColor(margin) : null;
    const catStyle = getCategoryStyle(entry.recipe.category);

    return (
      <div
        key={entry.id}
        draggable
        onDragStart={() => handleDragStart(entry)}
        className={`group/pill flex items-center gap-1 px-1.5 py-0.5 rounded-lg border cursor-grab active:cursor-grabbing text-[11px] leading-tight transition-all hover:shadow-sm ${
          marginColor ? `${marginColor.bg} ${marginColor.border} ${marginColor.text}` : `${catStyle.bg} ${catStyle.border} ${catStyle.text}`
        }`}
      >
        {marginColor && (
          <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${marginColor.indicator}`} />
        )}
        <GripVertical className="w-3 h-3 flex-shrink-0 opacity-30 group-hover/pill:opacity-70" />
        <FoodIllustration recipeName={entry.recipe.name} category={entry.recipe.category} size="sm" animated={false} className="flex-shrink-0 scale-75" />
        <span className="truncate flex-1">{entry.recipe.name}</span>
        {!compact && margin !== undefined && (
          <span className="text-[9px] font-mono opacity-70 flex-shrink-0">{margin.toFixed(0)}%</span>
        )}
        <button
          onClick={(e) => {
            e.stopPropagation();
            removeEntry(entry.id);
          }}
          className="p-0.5 rounded hover:bg-black/10 dark:hover:bg-white/10 opacity-0 group-hover/pill:opacity-100 transition-opacity no-print"
        >
          <X className="w-3 h-3" />
        </button>
      </div>
    );
  };

  const renderDayCell = (day: Date, isWeekView = false) => {
    const dateKey = formatDateKey(day);
    const dayEntries = entriesByDate[dateKey] || [];
    const isToday = dateKey === todayKey;
    const isWeekend = day.getDay() === 0 || day.getDay() === 6;
    const isDragOver = dragOverDate === dateKey;
    const isCurrentMonth = day.getMonth() === currentMonth;

    return (
      <div
        key={dateKey}
        className={`${isWeekView ? 'min-h-[200px]' : 'min-h-[110px] sm:min-h-[120px]'} border-b border-r border-[#F3F4F6] dark:border-[#1A1A1A] p-1.5 transition-colors ${
          isWeekend ? 'bg-[#FAFAFA] dark:bg-[#050505]' : 'bg-white dark:bg-black'
        } ${isDragOver ? 'bg-[#F0F0F0] dark:bg-[#171717] ring-2 ring-inset ring-[#111111] dark:ring-white' : ''} ${
          !isCurrentMonth ? 'opacity-40' : ''
        }`}
        onDragOver={(e) => handleDragOver(e, dateKey)}
        onDragLeave={handleDragLeave}
        onDrop={(e) => handleDrop(e, day)}
      >
        {/* Day header */}
        <div className="flex items-center justify-between mb-1">
          <div className="flex items-center gap-1">
            <span
              className={`inline-flex items-center justify-center w-7 h-7 text-xs font-semibold rounded-full transition-colors ${
                isToday
                  ? 'bg-[#111111] dark:bg-white text-white dark:text-black'
                  : 'text-[#374151] dark:text-[#D1D5DB]'
              }`}
            >
              {day.getDate()}
            </span>
            {isWeekView && (
              <span className="text-[10px] text-[#9CA3AF] dark:text-[#737373] font-medium">
                {WEEKDAYS_FULL[(day.getDay() + 6) % 7]}
              </span>
            )}
          </div>
          <button
            onClick={() => {
              setModalDate(day);
              setModalOpen(true);
              setSearchQuery('');
              setSelectedCategory('all');
            }}
            className="p-1 rounded-md hover:bg-[#F3F4F6] dark:hover:bg-[#171717] transition-colors no-print"
          >
            <Plus className="w-3.5 h-3.5 text-[#9CA3AF] dark:text-[#737373]" />
          </button>
        </div>

        {/* Recipe pills */}
        <div className="space-y-1">
          {dayEntries.map(entry => renderRecipePill(entry, !isWeekView))}
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-2 border-[#111111] dark:border-white border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="flex gap-4">
      {/* ── Sidebar (recipe panel for drag-drop) ── */}
      {sidebarOpen && (
        <div className="hidden lg:flex flex-col w-72 flex-shrink-0 bg-white dark:bg-black border border-[#E5E7EB] dark:border-[#1A1A1A] rounded-2xl overflow-hidden no-print h-fit sticky top-4">
          <div className="flex items-center justify-between px-4 py-3 border-b border-[#E5E7EB] dark:border-[#1A1A1A]">
            <h3 className="text-sm font-semibold text-[#111111] dark:text-white font-satoshi">
              Recettes
            </h3>
            <button
              onClick={() => setSidebarOpen(false)}
              className="p-1 rounded-lg hover:bg-[#F3F4F6] dark:hover:bg-[#171717] transition-colors"
            >
              <X className="w-4 h-4 text-[#6B7280]" />
            </button>
          </div>

          {/* Sidebar search */}
          <div className="px-3 py-2 border-b border-[#F3F4F6] dark:border-[#1A1A1A]">
            <div className="relative">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#9CA3AF]" />
              <input
                type="text"
                value={sidebarSearch}
                onChange={e => setSidebarSearch(e.target.value)}
                placeholder="Rechercher..."
                className="w-full pl-8 pr-3 py-2 rounded-xl border border-[#E5E7EB] dark:border-[#333333] bg-white dark:bg-black text-[#111111] dark:text-white text-xs placeholder-[#9CA3AF] focus:outline-none focus:ring-2 focus:ring-[#111111] dark:focus:ring-white"
              />
            </div>
          </div>

          {/* Sidebar category filter */}
          <div className="px-3 py-2 flex flex-wrap gap-1 border-b border-[#F3F4F6] dark:border-[#1A1A1A]">
            <button
              onClick={() => setSidebarCategory('all')}
              className={`px-2 py-1 rounded-lg text-[10px] font-medium transition-colors ${
                sidebarCategory === 'all'
                  ? 'bg-[#111111] dark:bg-white text-white dark:text-black'
                  : 'bg-[#F3F4F6] dark:bg-[#171717] text-[#6B7280] hover:text-[#111111] dark:hover:text-white'
              }`}
            >
              Tous
            </button>
            {uniqueCategories.map(cat => (
              <button
                key={cat}
                onClick={() => setSidebarCategory(cat)}
                className={`px-2 py-1 rounded-lg text-[10px] font-medium transition-colors ${
                  sidebarCategory === cat
                    ? 'bg-[#111111] dark:bg-white text-white dark:text-black'
                    : 'bg-[#F3F4F6] dark:bg-[#171717] text-[#6B7280] hover:text-[#111111] dark:hover:text-white'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Sidebar recipe list */}
          <div className="flex-1 overflow-y-auto max-h-[60vh] px-2 py-2 space-y-0.5">
            {sidebarFilteredRecipes.length === 0 ? (
              <div className="text-center py-6 text-xs text-[#9CA3AF]">
                Aucune recette
              </div>
            ) : (
              sidebarFilteredRecipes.map(recipe => {
                const margin = recipe.margin?.marginPercent;
                const marginColor = margin !== undefined ? getMarginColor(margin) : null;
                return (
                  <div
                    key={recipe.id}
                    draggable
                    onDragStart={(e) => handleSidebarDragStart(e, recipe)}
                    className="flex items-center gap-2 px-2.5 py-2 rounded-xl hover:bg-[#F3F4F6] dark:hover:bg-[#171717] transition-colors cursor-grab active:cursor-grabbing group"
                  >
                    {marginColor && (
                      <span className={`w-2 h-2 rounded-full flex-shrink-0 ${marginColor.indicator}`} />
                    )}
                    <div className="flex-1 min-w-0">
                      <div className="text-xs font-medium text-[#111111] dark:text-white truncate">
                        {recipe.name}
                      </div>
                      <div className="text-[10px] text-[#9CA3AF]">
                        {recipe.category}
                        {margin !== undefined && ` · ${margin.toFixed(0)}%`}
                      </div>
                    </div>
                    <GripVertical className="w-3.5 h-3.5 text-[#D1D5DB] dark:text-[#4B5563] opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}

      {/* ── Main Content ── */}
      <div className="flex-1 space-y-4 min-w-0">
        {/* ── Header ── */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold text-[#111111] dark:text-white font-satoshi">
              Menu Calendrier
            </h1>
            {seasonTag && (
              <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ${seasonTag.color}`}>
                <Tag className="w-3 h-3" />
                {seasonTag.label}
              </span>
            )}
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            {/* Sidebar toggle */}
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className={`hidden lg:flex items-center gap-1.5 px-3 py-2 rounded-xl border text-sm transition-colors no-print ${
                sidebarOpen
                  ? 'bg-[#111111] dark:bg-white text-white dark:text-black border-[#111111] dark:border-white'
                  : 'border-[#E5E7EB] dark:border-[#333333] text-[#111111] dark:text-white hover:bg-[#F3F4F6] dark:hover:bg-[#171717]'
              }`}
            >
              <Sparkles className="w-4 h-4" />
              <span className="hidden xl:inline">Recettes</span>
            </button>

            {/* Shopping list */}
            <button
              onClick={() => setShoppingListOpen(!shoppingListOpen)}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl border text-sm transition-colors no-print ${
                shoppingListOpen
                  ? 'bg-[#111111] dark:bg-white text-white dark:text-black border-[#111111] dark:border-white'
                  : 'border-[#E5E7EB] dark:border-[#333333] text-[#111111] dark:text-white hover:bg-[#F3F4F6] dark:hover:bg-[#171717]'
              }`}
            >
              <ShoppingCart className="w-4 h-4" />
              <span className="hidden sm:inline">Courses</span>
            </button>

            {/* Rotation tracker */}
            <button
              onClick={() => setRotationOpen(!rotationOpen)}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl border text-sm transition-colors no-print ${
                rotationOpen
                  ? 'bg-[#111111] dark:bg-white text-white dark:text-black border-[#111111] dark:border-white'
                  : 'border-[#E5E7EB] dark:border-[#333333] text-[#111111] dark:text-white hover:bg-[#F3F4F6] dark:hover:bg-[#171717]'
              }`}
            >
              <RotateCcw className="w-4 h-4" />
              <span className="hidden sm:inline">Rotation</span>
            </button>

            {/* Print */}
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-[#E5E7EB] dark:border-[#333333] text-[#111111] dark:text-white hover:bg-[#F3F4F6] dark:hover:bg-[#171717] transition-colors text-sm no-print"
            >
              <Printer className="w-4 h-4" />
              <span className="hidden sm:inline">Imprimer</span>
            </button>
          </div>
        </div>

        {/* ── Stats Row ── */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 no-print">
          <div className="bg-white dark:bg-black border border-[#E5E7EB] dark:border-[#1A1A1A] rounded-2xl p-3">
            <div className="text-[10px] uppercase tracking-wider text-[#9CA3AF] dark:text-[#737373] font-medium">Jours planifies</div>
            <div className="text-xl font-bold text-[#111111] dark:text-white mt-1 font-satoshi">
              {monthStats.daysWithMenu}<span className="text-sm font-normal text-[#9CA3AF]">/{monthStats.totalDays}</span>
            </div>
          </div>
          <div className="bg-white dark:bg-black border border-[#E5E7EB] dark:border-[#1A1A1A] rounded-2xl p-3">
            <div className="text-[10px] uppercase tracking-wider text-[#9CA3AF] dark:text-[#737373] font-medium">Recettes uniques</div>
            <div className="text-xl font-bold text-[#111111] dark:text-white mt-1 font-satoshi">{monthStats.uniqueRecipes}</div>
          </div>
          <div className="bg-white dark:bg-black border border-[#E5E7EB] dark:border-[#1A1A1A] rounded-2xl p-3">
            <div className="text-[10px] uppercase tracking-wider text-[#9CA3AF] dark:text-[#737373] font-medium">Total plats</div>
            <div className="text-xl font-bold text-[#111111] dark:text-white mt-1 font-satoshi">{monthStats.totalRecipes}</div>
          </div>
          <div className="bg-white dark:bg-black border border-[#E5E7EB] dark:border-[#1A1A1A] rounded-2xl p-3">
            <div className="text-[10px] uppercase tracking-wider text-[#9CA3AF] dark:text-[#737373] font-medium">Marge moyenne</div>
            <div className="flex items-center gap-1.5 mt-1">
              <span className="text-xl font-bold text-[#111111] dark:text-white font-satoshi">
                {monthStats.avgMargin > 0 ? `${monthStats.avgMargin.toFixed(0)}%` : '--'}
              </span>
              {monthStats.avgMargin >= 60 && <TrendingUp className="w-4 h-4 text-[#22C55E]" />}
              {monthStats.avgMargin > 0 && monthStats.avgMargin < 40 && <TrendingDown className="w-4 h-4 text-[#EF4444]" />}
              {monthStats.avgMargin >= 40 && monthStats.avgMargin < 60 && <Minus className="w-4 h-4 text-[#9CA3AF]" />}
            </div>
          </div>
        </div>

        {/* ── Controls Row ── */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 no-print">
          {/* Left: navigation */}
          <div className="flex items-center gap-2">
            <button
              onClick={viewMode === 'month' ? goToPrevMonth : goToPrevWeek}
              className="p-2 rounded-xl border border-[#E5E7EB] dark:border-[#333333] hover:bg-[#F3F4F6] dark:hover:bg-[#171717] transition-colors"
            >
              <ChevronLeft className="w-4 h-4 text-[#111111] dark:text-white" />
            </button>
            <div className="text-base font-semibold text-[#111111] dark:text-white font-satoshi min-w-[180px] text-center">
              {viewMode === 'month'
                ? `${MONTH_NAMES[currentMonth]} ${currentYear}`
                : `Sem. du ${weekDays[0].getDate()} ${MONTH_NAMES[weekDays[0].getMonth()]}` }
            </div>
            <button
              onClick={viewMode === 'month' ? goToNextMonth : goToNextWeek}
              className="p-2 rounded-xl border border-[#E5E7EB] dark:border-[#333333] hover:bg-[#F3F4F6] dark:hover:bg-[#171717] transition-colors"
            >
              <ChevronRight className="w-4 h-4 text-[#111111] dark:text-white" />
            </button>
            <button
              onClick={goToToday}
              className="px-3 py-1.5 text-xs font-medium rounded-xl border border-[#E5E7EB] dark:border-[#333333] text-[#6B7280] dark:text-[#9CA3AF] hover:bg-[#F3F4F6] dark:hover:bg-[#171717] transition-colors"
            >
              Aujourd&apos;hui
            </button>
          </div>

          {/* Right: view toggle + meal toggle */}
          <div className="flex items-center gap-2">
            {/* View mode toggle */}
            <div className="flex items-center gap-1 bg-[#F3F4F6] dark:bg-[#171717] rounded-xl p-1">
              <button
                onClick={() => setViewMode('month')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                  viewMode === 'month'
                    ? 'bg-white dark:bg-black text-[#111111] dark:text-white shadow-sm'
                    : 'text-[#6B7280] dark:text-[#737373] hover:text-[#111111] dark:hover:text-white'
                }`}
              >
                <CalendarDays className="w-3.5 h-3.5" />
                Mois
              </button>
              <button
                onClick={() => setViewMode('week')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                  viewMode === 'week'
                    ? 'bg-white dark:bg-black text-[#111111] dark:text-white shadow-sm'
                    : 'text-[#6B7280] dark:text-[#737373] hover:text-[#111111] dark:hover:text-white'
                }`}
              >
                <CalendarRange className="w-3.5 h-3.5" />
                Semaine
              </button>
            </div>

            {/* Meal type toggle */}
            <div className="flex items-center gap-1 bg-[#F3F4F6] dark:bg-[#171717] rounded-xl p-1">
              <button
                onClick={() => setMealType('lunch')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                  mealType === 'lunch'
                    ? 'bg-white dark:bg-black text-[#111111] dark:text-white shadow-sm'
                    : 'text-[#6B7280] dark:text-[#737373] hover:text-[#111111] dark:hover:text-white'
                }`}
              >
                <Sun className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Dejeuner</span>
              </button>
              <button
                onClick={() => setMealType('dinner')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                  mealType === 'dinner'
                    ? 'bg-white dark:bg-black text-[#111111] dark:text-white shadow-sm'
                    : 'text-[#6B7280] dark:text-[#737373] hover:text-[#111111] dark:hover:text-white'
                }`}
              >
                <MoonIcon className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Diner</span>
              </button>
            </div>
          </div>
        </div>

        {/* ── Shopping List Panel ── */}
        {shoppingListOpen && (
          <div className="bg-white dark:bg-black border border-[#E5E7EB] dark:border-[#1A1A1A] rounded-2xl overflow-hidden no-print">
            <div className="flex items-center justify-between px-5 py-3 border-b border-[#E5E7EB] dark:border-[#1A1A1A]">
              <div className="flex items-center gap-2">
                <ShoppingCart className="w-4 h-4 text-[#111111] dark:text-white" />
                <h3 className="text-sm font-semibold text-[#111111] dark:text-white font-satoshi">
                  Liste de courses — {MONTH_NAMES[currentMonth]}
                </h3>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-[#F3F4F6] dark:bg-[#171717] text-[#6B7280]">
                  {shoppingList.length} ingredients
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-semibold text-[#111111] dark:text-white">
                  {formatCurrency(totalShoppingCost)}
                </span>
                <button
                  onClick={exportShoppingList}
                  className="p-1.5 rounded-lg hover:bg-[#F3F4F6] dark:hover:bg-[#171717] transition-colors"
                  title="Exporter"
                >
                  <Download className="w-4 h-4 text-[#6B7280]" />
                </button>
                <button
                  onClick={() => setShoppingListOpen(false)}
                  className="p-1.5 rounded-lg hover:bg-[#F3F4F6] dark:hover:bg-[#171717] transition-colors"
                >
                  <X className="w-4 h-4 text-[#6B7280]" />
                </button>
              </div>
            </div>
            {shoppingList.length === 0 ? (
              <div className="px-5 py-8 text-center text-sm text-[#9CA3AF]">
                Ajoutez des recettes au calendrier pour generer la liste
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-0 max-h-[300px] overflow-y-auto">
                {shoppingList.map((item, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between px-4 py-2.5 border-b border-r border-[#F3F4F6] dark:border-[#1A1A1A] hover:bg-[#FAFAFA] dark:hover:bg-[#0A0A0A] transition-colors"
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <Check className="w-3.5 h-3.5 text-[#D1D5DB] dark:text-[#333333] flex-shrink-0" />
                      <span className="text-sm text-[#111111] dark:text-white truncate">{item.ingredientName}</span>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0 ml-2">
                      <span className="text-xs font-mono text-[#6B7280] dark:text-[#9CA3AF]">
                        {item.totalQuantity.toFixed(1)} {item.unit}
                      </span>
                      <span className="text-[10px] text-[#9CA3AF]">
                        {item.estimatedCost.toFixed(2)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ── Rotation Tracker Panel ── */}
        {rotationOpen && (
          <div className="bg-white dark:bg-black border border-[#E5E7EB] dark:border-[#1A1A1A] rounded-2xl overflow-hidden no-print">
            <div className="flex items-center justify-between px-5 py-3 border-b border-[#E5E7EB] dark:border-[#1A1A1A]">
              <div className="flex items-center gap-2">
                <RotateCcw className="w-4 h-4 text-[#111111] dark:text-white" />
                <h3 className="text-sm font-semibold text-[#111111] dark:text-white font-satoshi">
                  Rotation des recettes
                </h3>
              </div>
              <button
                onClick={() => setRotationOpen(false)}
                className="p-1.5 rounded-lg hover:bg-[#F3F4F6] dark:hover:bg-[#171717] transition-colors"
              >
                <X className="w-4 h-4 text-[#6B7280]" />
              </button>
            </div>
            {rotationData.length === 0 ? (
              <div className="px-5 py-8 text-center text-sm text-[#9CA3AF]">
                Aucune donnee de rotation pour ce mois
              </div>
            ) : (
              <div className="max-h-[300px] overflow-y-auto">
                {rotationData.map((item, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between px-5 py-2.5 border-b border-[#F3F4F6] dark:border-[#1A1A1A] hover:bg-[#FAFAFA] dark:hover:bg-[#0A0A0A] transition-colors"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <span className="text-xs font-mono text-[#9CA3AF] w-6 text-right flex-shrink-0">#{i + 1}</span>
                      <div className="min-w-0">
                        <div className="text-sm font-medium text-[#111111] dark:text-white truncate">{item.name}</div>
                        <div className="text-[10px] text-[#9CA3AF]">{item.category}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 flex-shrink-0">
                      <div className="flex items-center gap-1.5">
                        <div className="flex gap-0.5">
                          {Array.from({ length: Math.min(item.count, 7) }, (_, j) => (
                            <div key={j} className="w-2 h-2 rounded-full bg-[#111111] dark:bg-white" />
                          ))}
                          {item.count > 7 && (
                            <span className="text-[10px] text-[#9CA3AF] ml-0.5">+{item.count - 7}</span>
                          )}
                        </div>
                        <span className="text-xs font-medium text-[#111111] dark:text-white">{item.count}x</span>
                      </div>
                      {item.count >= 5 && (
                        <span className="flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium bg-[#FEF2F2] dark:bg-[#450A0A] text-[#991B1B] dark:text-[#FCA5A5]">
                          <AlertTriangle className="w-3 h-3" />
                          Frequente
                        </span>
                      )}
                      <div className="flex items-center gap-1 text-[10px] text-[#9CA3AF]">
                        <Clock className="w-3 h-3" />
                        {item.lastUsed.slice(5, 10)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ── Season Banner ── */}
        {seasonalItems.length > 0 && seasonBannerOpen && (
          <div className="bg-white dark:bg-black border border-[#E5E7EB] dark:border-[#1A1A1A] rounded-2xl p-4 no-print">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Leaf className="w-4 h-4 text-[#111111] dark:text-white" />
                <span className="text-sm font-semibold text-[#111111] dark:text-white font-satoshi">
                  Produits de saison — {MONTH_NAMES[currentMonth]}
                </span>
              </div>
              <button
                onClick={() => setSeasonBannerOpen(false)}
                className="p-1 rounded-lg hover:bg-[#F3F4F6] dark:hover:bg-[#171717] transition-colors"
              >
                <ChevronUp className="w-4 h-4 text-[#9CA3AF]" />
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {seasonalItems.map(item => (
                <span
                  key={item}
                  className="px-2.5 py-1 text-xs rounded-full bg-[#F3F4F6] dark:bg-[#171717] border border-[#E5E7EB] dark:border-[#333333] text-[#374151] dark:text-[#D1D5DB]"
                >
                  {item}
                </span>
              ))}
            </div>
          </div>
        )}

        {!seasonBannerOpen && (
          <button
            onClick={() => setSeasonBannerOpen(true)}
            className="flex items-center gap-2 text-xs text-[#9CA3AF] hover:text-[#111111] dark:hover:text-white transition-colors no-print"
          >
            <Leaf className="w-3.5 h-3.5" />
            Produits de saison
            <ChevronDown className="w-3 h-3" />
          </button>
        )}

        {/* ── Calendar Grid ── */}
        <div ref={calendarRef} className="bg-white dark:bg-black border border-[#E5E7EB] dark:border-[#1A1A1A] rounded-2xl overflow-hidden print-calendar">
          {/* Weekday headers */}
          <div className="grid grid-cols-7 border-b border-[#E5E7EB] dark:border-[#1A1A1A]">
            {WEEKDAYS.map(day => (
              <div
                key={day}
                className="px-2 py-3 text-center text-xs font-semibold text-[#6B7280] dark:text-[#737373] uppercase tracking-wider"
              >
                {day}
              </div>
            ))}
          </div>

          {viewMode === 'month' ? (
            /* ── Month view ── */
            <div className="grid grid-cols-7">
              {paddingDays.map(i => (
                <div key={`pad-${i}`} className="min-h-[110px] sm:min-h-[120px] border-b border-r border-[#F3F4F6] dark:border-[#1A1A1A] bg-[#FAFAFA] dark:bg-[#050505]" />
              ))}
              {days.map(day => renderDayCell(day, false))}
            </div>
          ) : (
            /* ── Week view ── */
            <div className="grid grid-cols-7">
              {weekDays.map(day => renderDayCell(day, true))}
            </div>
          )}
        </div>

        {/* ── Legend ── */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-4 text-xs text-[#6B7280] dark:text-[#737373] no-print">
          <div className="flex flex-wrap items-center gap-3">
            <span className="font-semibold text-[#111111] dark:text-white">Marge :</span>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-[#22C55E]" />
              <span>70%+</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-[#6B7280]" />
              <span>50-70%</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-[#F59E0B]" />
              <span>30-50%</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-[#EF4444]" />
              <span>&lt;30%</span>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <span className="font-semibold text-[#111111] dark:text-white">Categorie :</span>
            {Object.entries(CATEGORY_COLORS).filter(([key], index, arr) =>
              arr.findIndex(([k]) => k === key) === arr.indexOf(arr.find(([k]) => k === key)!)
            ).slice(0, 5).map(([cat, style]) => (
              <div key={cat} className="flex items-center gap-1.5">
                <span className={`inline-block w-3 h-3 rounded-sm border ${style.bg} ${style.border}`} />
                <span>{cat}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Recipe Assignment Modal ── */}
      {modalOpen && modalDate && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 no-print"
          onClick={() => setModalOpen(false)}
          onKeyDown={(e) => { if (e.key === 'Escape') setModalOpen(false); }}
        >
          <div
            ref={modalTrapRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby="menu-calendar-modal-title"
            className="bg-white dark:bg-black border border-[#E5E7EB] dark:border-[#1A1A1A] rounded-2xl w-full max-w-lg mx-4 max-h-[80vh] flex flex-col shadow-2xl"
            onClick={e => e.stopPropagation()}
          >
            {/* Modal header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-[#E5E7EB] dark:border-[#1A1A1A]">
              <div>
                <h3 id="menu-calendar-modal-title" className="text-base font-semibold text-[#111111] dark:text-white font-satoshi">
                  Ajouter au {modalDate.getDate()} {MONTH_NAMES[modalDate.getMonth()]}
                </h3>
                <p className="text-xs text-[#6B7280] dark:text-[#737373] mt-0.5">
                  {mealType === 'lunch' ? 'Dejeuner' : 'Diner'}
                </p>
              </div>
              <button
                onClick={() => setModalOpen(false)}
                className="p-2 rounded-xl hover:bg-[#F3F4F6] dark:hover:bg-[#171717] transition-colors"
              >
                <X className="w-5 h-5 text-[#6B7280]" />
              </button>
            </div>

            {/* Search + filter */}
            <div className="px-5 py-3 space-y-3 border-b border-[#F3F4F6] dark:border-[#1A1A1A]">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9CA3AF]" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  placeholder="Rechercher une recette..."
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[#E5E7EB] dark:border-[#333333] bg-white dark:bg-black text-[#111111] dark:text-white text-sm placeholder-[#9CA3AF] focus:outline-none focus:ring-2 focus:ring-[#111111] dark:focus:ring-white"
                  autoFocus
                />
              </div>
              <div className="flex flex-wrap gap-1.5">
                <button
                  onClick={() => setSelectedCategory('all')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-colors ${
                    selectedCategory === 'all'
                      ? 'bg-[#111111] dark:bg-white text-white dark:text-black'
                      : 'bg-[#F3F4F6] dark:bg-[#171717] text-[#6B7280] dark:text-[#9CA3AF] hover:text-[#111111] dark:hover:text-white'
                  }`}
                >
                  Tous
                </button>
                {uniqueCategories.map(cat => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-colors ${
                      selectedCategory === cat
                        ? 'bg-[#111111] dark:bg-white text-white dark:text-black'
                        : 'bg-[#F3F4F6] dark:bg-[#171717] text-[#6B7280] dark:text-[#9CA3AF] hover:text-[#111111] dark:hover:text-white'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Recipe list */}
            <div className="flex-1 overflow-y-auto px-5 py-3">
              {filteredRecipes.length === 0 ? (
                <div className="text-center py-8 text-sm text-[#9CA3AF]">
                  Aucune recette trouvee
                </div>
              ) : (
                <div className="space-y-0.5">
                  {filteredRecipes.map(recipe => {
                    const margin = recipe.margin?.marginPercent;
                    const marginColor = margin !== undefined ? getMarginColor(margin) : null;
                    const catStyle = getCategoryStyle(recipe.category);
                    return (
                      <button
                        key={recipe.id}
                        onClick={() => {
                          addRecipeToDate(recipe, modalDate);
                          setModalOpen(false);
                        }}
                        className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-[#F3F4F6] dark:hover:bg-[#171717] transition-colors text-left group"
                      >
                        {marginColor ? (
                          <span className={`inline-block w-2.5 h-2.5 rounded-full flex-shrink-0 ${marginColor.indicator}`} />
                        ) : (
                          <span className={`inline-block w-2 h-2 rounded-full border ${catStyle.bg} ${catStyle.border}`} />
                        )}
                        <div className="flex-1 min-w-0">
                          <div className="text-sm font-medium text-[#111111] dark:text-white truncate">
                            {recipe.name}
                          </div>
                          <div className="text-xs text-[#9CA3AF] dark:text-[#737373]">
                            {recipe.category}
                            {margin !== undefined && (
                              <span className={`ml-1 ${margin >= 60 ? 'text-[#22C55E]' : margin >= 40 ? 'text-[#6B7280]' : 'text-[#EF4444]'}`}>
                                · {margin.toFixed(0)}% marge
                              </span>
                            )}
                            {' · '}{formatCurrency(recipe.sellingPrice)}
                          </div>
                        </div>
                        <Plus className="w-4 h-4 text-[#9CA3AF] opacity-0 group-hover:opacity-100 transition-opacity" />
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ── Print Styles ── */}
      <style>{`
        @media print {
          .no-print { display: none !important; }
          .print-calendar { border: 1px solid #000 !important; }
          body { background: white !important; }
          * { color: #000 !important; background: white !important; border-color: #ccc !important; }
        }
      `}</style>
    </div>
  );
}
