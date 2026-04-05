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
} from 'lucide-react';
import { fetchRecipes } from '../services/api';
import { getToken, getActiveRestaurantId } from '../services/api';
import { useToast } from '../hooks/useToast';
import { useRestaurant } from '../hooks/useRestaurant';
import type { Recipe } from '../types';

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

// ── Category color mapping (monochrome W&B with subtle accents) ──

const CATEGORY_COLORS: Record<string, { bg: string; text: string; border: string }> = {
  'Entree':         { bg: 'bg-[#F3F4F6] dark:bg-[#1A1A1A]', text: 'text-[#111111] dark:text-[#E5E7EB]', border: 'border-[#D1D5DB] dark:border-[#333333]' },
  'Entrée':         { bg: 'bg-[#F3F4F6] dark:bg-[#1A1A1A]', text: 'text-[#111111] dark:text-[#E5E7EB]', border: 'border-[#D1D5DB] dark:border-[#333333]' },
  'Plat':           { bg: 'bg-[#E5E7EB] dark:bg-[#262626]', text: 'text-[#111111] dark:text-white', border: 'border-[#9CA3AF] dark:border-[#404040]' },
  'Dessert':        { bg: 'bg-[#F9FAFB] dark:bg-[#171717]', text: 'text-[#374151] dark:text-[#D1D5DB]', border: 'border-[#E5E7EB] dark:border-[#2A2A2A]' },
  'Boisson':        { bg: 'bg-white dark:bg-[#0F0F0F]', text: 'text-[#6B7280] dark:text-[#9CA3AF]', border: 'border-[#E5E7EB] dark:border-[#1A1A1A]' },
  'Accompagnement': { bg: 'bg-[#F3F4F6] dark:bg-[#1F1F1F]', text: 'text-[#4B5563] dark:text-[#D1D5DB]', border: 'border-[#D1D5DB] dark:border-[#333333]' },
};

function getCategoryStyle(cat: string) {
  return CATEGORY_COLORS[cat] || CATEGORY_COLORS['Plat'];
}

// ── Helpers ──

function authHeaders(): Record<string, string> {
  const token = getToken();
  const headers: Record<string, string> = { 'Content-Type': 'application/json' };
  if (token) headers['Authorization'] = `Bearer ${token}`;
  const rid = getActiveRestaurantId();
  if (rid) headers['X-Restaurant-Id'] = rid;
  return headers;
}

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

const WEEKDAYS = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'];

const MONTH_NAMES = [
  'Janvier', 'Fevrier', 'Mars', 'Avril', 'Mai', 'Juin',
  'Juillet', 'Aout', 'Septembre', 'Octobre', 'Novembre', 'Decembre',
];

// ── Component ──

export default function MenuCalendar() {
  const { showToast } = useToast();
  useRestaurant(); // ensures restaurant context is active

  const today = new Date();
  const [currentYear, setCurrentYear] = useState(today.getFullYear());
  const [currentMonth, setCurrentMonth] = useState(today.getMonth());
  const [mealType, setMealType] = useState<'lunch' | 'dinner'>('lunch');
  const [entries, setEntries] = useState<MenuCalendarEntry[]>([]);
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);

  // Modal state
  const [modalOpen, setModalOpen] = useState(false);
  const [modalDate, setModalDate] = useState<Date | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

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
  const firstDayOfWeek = (days[0].getDay() + 6) % 7; // Monday = 0
  const paddingDays = Array.from({ length: firstDayOfWeek }, (_, i) => i);

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

  const goToToday = () => {
    setCurrentYear(today.getFullYear());
    setCurrentMonth(today.getMonth());
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
      showToast(`${recipe.name} ajouté au ${formatDateKey(date)}`, 'success');
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

  // ── Drag & Drop ──

  const handleDragStart = (entry: MenuCalendarEntry) => {
    setDragEntry(entry);
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
    if (!dragEntry) return;

    const targetKey = formatDateKey(targetDate);
    const sourceKey = dragEntry.date.slice(0, 10);
    if (targetKey === sourceKey) return;

    // Remove old + create new
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

  // ── Print ──

  const handlePrint = () => {
    window.print();
  };

  // ── Seasonal ingredients for current month ──

  const seasonalItems = SEASONAL_INGREDIENTS[currentMonth + 1] || [];

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

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-2 border-[#111111] dark:border-white border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* ── Header ── */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#111111] dark:text-white font-satoshi">
            Menu Calendrier
          </h1>
          <p className="text-sm text-[#6B7280] dark:text-[#737373] mt-1">
            Planifiez vos menus par jour et par service
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handlePrint}
            className="flex items-center gap-2 px-4 py-2 rounded-xl border border-[#E5E7EB] dark:border-[#333333] text-[#111111] dark:text-white hover:bg-[#F3F4F6] dark:hover:bg-[#171717] transition-colors text-sm no-print"
          >
            <Printer className="w-4 h-4" />
            Imprimer
          </button>
        </div>
      </div>

      {/* ── Controls Row ── */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 no-print">
        {/* Month navigation */}
        <div className="flex items-center gap-3">
          <button
            onClick={goToPrevMonth}
            className="p-2 rounded-lg border border-[#E5E7EB] dark:border-[#333333] hover:bg-[#F3F4F6] dark:hover:bg-[#171717] transition-colors"
          >
            <ChevronLeft className="w-4 h-4 text-[#111111] dark:text-white" />
          </button>
          <div className="text-lg font-semibold text-[#111111] dark:text-white font-satoshi min-w-[200px] text-center">
            {MONTH_NAMES[currentMonth]} {currentYear}
          </div>
          <button
            onClick={goToNextMonth}
            className="p-2 rounded-lg border border-[#E5E7EB] dark:border-[#333333] hover:bg-[#F3F4F6] dark:hover:bg-[#171717] transition-colors"
          >
            <ChevronRight className="w-4 h-4 text-[#111111] dark:text-white" />
          </button>
          <button
            onClick={goToToday}
            className="px-3 py-1.5 text-xs font-medium rounded-lg border border-[#E5E7EB] dark:border-[#333333] text-[#6B7280] dark:text-[#9CA3AF] hover:bg-[#F3F4F6] dark:hover:bg-[#171717] transition-colors"
          >
            Aujourd'hui
          </button>
        </div>

        {/* Meal type toggle */}
        <div className="flex items-center gap-1 bg-[#F3F4F6] dark:bg-[#171717] rounded-xl p-1">
          <button
            onClick={() => setMealType('lunch')}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              mealType === 'lunch'
                ? 'bg-white dark:bg-[#0A0A0A] text-[#111111] dark:text-white shadow-sm'
                : 'text-[#6B7280] dark:text-[#737373] hover:text-[#111111] dark:hover:text-white'
            }`}
          >
            <Sun className="w-4 h-4" />
            Dejeuner
          </button>
          <button
            onClick={() => setMealType('dinner')}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              mealType === 'dinner'
                ? 'bg-white dark:bg-[#0A0A0A] text-[#111111] dark:text-white shadow-sm'
                : 'text-[#6B7280] dark:text-[#737373] hover:text-[#111111] dark:hover:text-white'
            }`}
          >
            <MoonIcon className="w-4 h-4" />
            Diner
          </button>
        </div>
      </div>

      {/* ── Season Banner ── */}
      {seasonalItems.length > 0 && (
        <div className="bg-[#F9FAFB] dark:bg-[#0F0F0F] border border-[#E5E7EB] dark:border-[#1A1A1A] rounded-2xl p-4 no-print">
          <div className="flex items-center gap-2 mb-2">
            <Leaf className="w-4 h-4 text-[#111111] dark:text-white" />
            <span className="text-sm font-semibold text-[#111111] dark:text-white font-satoshi">
              Produits de saison — {MONTH_NAMES[currentMonth]}
            </span>
          </div>
          <div className="flex flex-wrap gap-2">
            {seasonalItems.map(item => (
              <span
                key={item}
                className="px-2.5 py-1 text-xs rounded-full bg-white dark:bg-[#171717] border border-[#E5E7EB] dark:border-[#333333] text-[#374151] dark:text-[#D1D5DB]"
              >
                {item}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* ── Calendar Grid ── */}
      <div ref={calendarRef} className="bg-white dark:bg-[#0A0A0A] border border-[#E5E7EB] dark:border-[#1A1A1A] rounded-2xl overflow-hidden print-calendar">
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

        {/* Day cells */}
        <div className="grid grid-cols-7">
          {/* Padding cells for days before the 1st */}
          {paddingDays.map(i => (
            <div key={`pad-${i}`} className="min-h-[120px] border-b border-r border-[#F3F4F6] dark:border-[#1A1A1A] bg-[#FAFAFA] dark:bg-[#050505]" />
          ))}

          {/* Actual days */}
          {days.map(day => {
            const dateKey = formatDateKey(day);
            const dayEntries = entriesByDate[dateKey] || [];
            const isToday = dateKey === todayKey;
            const isWeekend = day.getDay() === 0 || day.getDay() === 6;
            const isDragOver = dragOverDate === dateKey;

            return (
              <div
                key={dateKey}
                className={`min-h-[120px] border-b border-r border-[#F3F4F6] dark:border-[#1A1A1A] p-1.5 transition-colors ${
                  isWeekend ? 'bg-[#FAFAFA] dark:bg-[#050505]' : 'bg-white dark:bg-[#0A0A0A]'
                } ${isDragOver ? 'bg-[#F3F4F6] dark:bg-[#171717]' : ''}`}
                onDragOver={(e) => handleDragOver(e, dateKey)}
                onDragLeave={handleDragLeave}
                onDrop={(e) => handleDrop(e, day)}
              >
                {/* Day number + add button */}
                <div className="flex items-center justify-between mb-1">
                  <span
                    className={`inline-flex items-center justify-center w-7 h-7 text-xs font-semibold rounded-full ${
                      isToday
                        ? 'bg-[#111111] dark:bg-white text-white dark:text-[#111111]'
                        : 'text-[#374151] dark:text-[#D1D5DB]'
                    }`}
                  >
                    {day.getDate()}
                  </span>
                  <button
                    onClick={() => {
                      setModalDate(day);
                      setModalOpen(true);
                      setSearchQuery('');
                      setSelectedCategory('all');
                    }}
                    className="p-1 rounded-md hover:bg-[#F3F4F6] dark:hover:bg-[#171717] transition-colors opacity-0 group-hover:opacity-100 no-print"
                    style={{ opacity: 1 }}
                  >
                    <Plus className="w-3.5 h-3.5 text-[#9CA3AF] dark:text-[#737373]" />
                  </button>
                </div>

                {/* Recipe pills */}
                <div className="space-y-1">
                  {dayEntries.map(entry => {
                    const style = getCategoryStyle(entry.recipe.category);
                    return (
                      <div
                        key={entry.id}
                        draggable
                        onDragStart={() => handleDragStart(entry)}
                        className={`group/pill flex items-center gap-1 px-1.5 py-0.5 rounded-md border cursor-grab active:cursor-grabbing text-[11px] leading-tight ${style.bg} ${style.text} ${style.border} transition-all hover:shadow-sm`}
                      >
                        <GripVertical className="w-3 h-3 flex-shrink-0 opacity-30 group-hover/pill:opacity-70" />
                        <span className="truncate flex-1">{entry.recipe.name}</span>
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
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ── Legend ── */}
      <div className="flex flex-wrap items-center gap-4 text-xs text-[#6B7280] dark:text-[#737373] no-print">
        <span className="font-semibold text-[#111111] dark:text-white">Categorie :</span>
        {Object.entries(CATEGORY_COLORS).filter(([key]) => !key.includes('é')).map(([cat, style]) => (
          <div key={cat} className="flex items-center gap-1.5">
            <span className={`inline-block w-3 h-3 rounded-sm border ${style.bg} ${style.border}`} />
            <span>{cat}</span>
          </div>
        ))}
      </div>

      {/* ── Recipe Assignment Modal ── */}
      {modalOpen && modalDate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 no-print">
          <div className="bg-white dark:bg-[#0A0A0A] border border-[#E5E7EB] dark:border-[#1A1A1A] rounded-2xl w-full max-w-lg mx-4 max-h-[80vh] flex flex-col shadow-2xl">
            {/* Modal header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-[#E5E7EB] dark:border-[#1A1A1A]">
              <div>
                <h3 className="text-base font-semibold text-[#111111] dark:text-white font-satoshi">
                  Ajouter au {modalDate.getDate()} {MONTH_NAMES[modalDate.getMonth()]}
                </h3>
                <p className="text-xs text-[#6B7280] dark:text-[#737373] mt-0.5">
                  {mealType === 'lunch' ? 'Dejeuner' : 'Diner'}
                </p>
              </div>
              <button
                onClick={() => setModalOpen(false)}
                className="p-2 rounded-lg hover:bg-[#F3F4F6] dark:hover:bg-[#171717] transition-colors"
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
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[#E5E7EB] dark:border-[#333333] bg-white dark:bg-[#0F0F0F] text-[#111111] dark:text-white text-sm placeholder-[#9CA3AF] focus:outline-none focus:ring-2 focus:ring-[#111111] dark:focus:ring-white"
                  autoFocus
                />
              </div>
              <div className="flex flex-wrap gap-1.5">
                <button
                  onClick={() => setSelectedCategory('all')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                    selectedCategory === 'all'
                      ? 'bg-[#111111] dark:bg-white text-white dark:text-[#111111]'
                      : 'bg-[#F3F4F6] dark:bg-[#171717] text-[#6B7280] dark:text-[#9CA3AF] hover:text-[#111111] dark:hover:text-white'
                  }`}
                >
                  Tous
                </button>
                {uniqueCategories.map(cat => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                      selectedCategory === cat
                        ? 'bg-[#111111] dark:bg-white text-white dark:text-[#111111]'
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
                <div className="space-y-1">
                  {filteredRecipes.map(recipe => {
                    const style = getCategoryStyle(recipe.category);
                    return (
                      <button
                        key={recipe.id}
                        onClick={() => {
                          addRecipeToDate(recipe, modalDate);
                          setModalOpen(false);
                        }}
                        className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-[#F3F4F6] dark:hover:bg-[#171717] transition-colors text-left group"
                      >
                        <span className={`inline-block w-2 h-2 rounded-full border ${style.bg} ${style.border}`} />
                        <div className="flex-1 min-w-0">
                          <div className="text-sm font-medium text-[#111111] dark:text-white truncate">
                            {recipe.name}
                          </div>
                          <div className="text-xs text-[#9CA3AF] dark:text-[#737373]">
                            {recipe.category} &middot; {recipe.sellingPrice.toFixed(2)} EUR
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
