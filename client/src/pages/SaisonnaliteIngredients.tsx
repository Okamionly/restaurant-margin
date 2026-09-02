import { useState, useMemo } from 'react';
import { Leaf, Search, Filter } from 'lucide-react';

const MONTHS = ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Jun', 'Jul', 'Aoû', 'Sep', 'Oct', 'Nov', 'Déc'];
const MONTH_FULL = ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'];

type Category = 'Légumes' | 'Fruits' | 'Champignons' | 'Herbes' | 'Poissons';

interface Ingredient {
  name: string;
  category: Category;
  months: number[]; // 0=Jan … 11=Déc
  tip?: string;
}

const INGREDIENTS: Ingredient[] = [
  { name: 'Asperge', category: 'Légumes', months: [2, 3, 4, 5], tip: 'Pic en avril-mai. Acheter en direct producteur.' },
  { name: 'Artichaut', category: 'Légumes', months: [4, 5, 6, 7, 8, 9] },
  { name: 'Aubergine', category: 'Légumes', months: [5, 6, 7, 8, 9] },
  { name: 'Betterave', category: 'Légumes', months: [7, 8, 9, 10, 11, 0, 1] },
  { name: 'Brocoli', category: 'Légumes', months: [8, 9, 10, 11, 0, 1, 2, 3] },
  { name: 'Carotte', category: 'Légumes', months: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11] },
  { name: 'Céleri-rave', category: 'Légumes', months: [9, 10, 11, 0, 1, 2, 3] },
  { name: 'Chou-fleur', category: 'Légumes', months: [9, 10, 11, 0, 1, 2, 3, 4] },
  { name: 'Courgette', category: 'Légumes', months: [5, 6, 7, 8, 9] },
  { name: 'Épinard', category: 'Légumes', months: [2, 3, 4, 5, 9, 10, 11] },
  { name: 'Fenouil', category: 'Légumes', months: [7, 8, 9, 10, 11] },
  { name: 'Haricot vert', category: 'Légumes', months: [5, 6, 7, 8, 9] },
  { name: 'Navet', category: 'Légumes', months: [9, 10, 11, 0, 1, 2, 3, 4] },
  { name: 'Oignon nouveau', category: 'Légumes', months: [2, 3, 4, 5] },
  { name: 'Panais', category: 'Légumes', months: [9, 10, 11, 0, 1, 2, 3] },
  { name: 'Pois mange-tout', category: 'Légumes', months: [3, 4, 5, 6] },
  { name: 'Poivron', category: 'Légumes', months: [6, 7, 8, 9] },
  { name: 'Potiron', category: 'Légumes', months: [9, 10, 11] },
  { name: 'Radis', category: 'Légumes', months: [2, 3, 4, 5, 8, 9] },
  { name: 'Tomate', category: 'Légumes', months: [5, 6, 7, 8, 9], tip: 'Eviter hors-saison : food cost x3.' },
  { name: 'Abricot', category: 'Fruits', months: [5, 6, 7], tip: 'Transformer en confiture en pic de saison.' },
  { name: 'Cerise', category: 'Fruits', months: [4, 5, 6] },
  { name: 'Citron', category: 'Fruits', months: [0, 1, 2, 3, 4, 10, 11] },
  { name: 'Fraise', category: 'Fruits', months: [3, 4, 5, 6], tip: 'Pic en mai. Surgelées hors-saison pour desserts.' },
  { name: 'Framboise', category: 'Fruits', months: [5, 6, 7, 8] },
  { name: 'Melon', category: 'Fruits', months: [5, 6, 7, 8] },
  { name: 'Mirabelle', category: 'Fruits', months: [7, 8] },
  { name: 'Pêche', category: 'Fruits', months: [5, 6, 7, 8] },
  { name: 'Poire', category: 'Fruits', months: [7, 8, 9, 10, 11] },
  { name: 'Pomme', category: 'Fruits', months: [8, 9, 10, 11, 0, 1, 2] },
  { name: 'Prune', category: 'Fruits', months: [7, 8, 9] },
  { name: 'Raisin', category: 'Fruits', months: [8, 9, 10] },
  { name: 'Rhubarbe', category: 'Fruits', months: [3, 4, 5, 6] },
  { name: 'Cèpe', category: 'Champignons', months: [8, 9, 10], tip: 'Sécher ou congeler en pic.' },
  { name: 'Chanterelle', category: 'Champignons', months: [5, 6, 7, 8, 9, 10] },
  { name: 'Morille', category: 'Champignons', months: [2, 3, 4], tip: 'Rare. Sécher pour conserver.' },
  { name: 'Truffe noire', category: 'Champignons', months: [11, 0, 1, 2] },
  { name: 'Truffe d\'été', category: 'Champignons', months: [5, 6, 7, 8] },
  { name: 'Basilic', category: 'Herbes', months: [4, 5, 6, 7, 8, 9] },
  { name: 'Ciboulette', category: 'Herbes', months: [2, 3, 4, 5, 6, 7, 8, 9] },
  { name: 'Coriandre', category: 'Herbes', months: [3, 4, 5, 6, 7, 8, 9] },
  { name: 'Estragon', category: 'Herbes', months: [3, 4, 5, 6, 7, 8, 9] },
  { name: 'Menthe', category: 'Herbes', months: [3, 4, 5, 6, 7, 8, 9, 10] },
  { name: 'Persil', category: 'Herbes', months: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11] },
  { name: 'Thym', category: 'Herbes', months: [3, 4, 5, 6, 7, 8, 9, 10] },
  { name: 'Bar (Loup)', category: 'Poissons', months: [0, 1, 2, 3, 9, 10, 11] },
  { name: 'Cabillaud', category: 'Poissons', months: [0, 1, 2, 3, 4, 9, 10, 11] },
  { name: 'Daurade', category: 'Poissons', months: [3, 4, 5, 6, 7, 8, 9] },
  { name: 'Maquereau', category: 'Poissons', months: [3, 4, 5, 6, 7, 8] },
  { name: 'Merlu', category: 'Poissons', months: [0, 1, 2, 9, 10, 11] },
  { name: 'Saint-Jacques', category: 'Poissons', months: [9, 10, 11, 0, 1, 2, 3], tip: 'Fraîche d\'oct à mars, meilleure en hiver.' },
  { name: 'Sardine', category: 'Poissons', months: [4, 5, 6, 7, 8, 9] },
  { name: 'Thon rouge', category: 'Poissons', months: [5, 6, 7, 8] },
];

const CATEGORY_COLORS: Record<Category, string> = {
  'Légumes': 'bg-emerald-500',
  'Fruits': 'bg-orange-400',
  'Champignons': 'bg-amber-600',
  'Herbes': 'bg-teal-500',
  'Poissons': 'bg-blue-500',
};

const CATEGORY_BADGE: Record<Category, string> = {
  'Légumes': 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800',
  'Fruits': 'bg-orange-50 dark:bg-orange-900/20 text-orange-700 dark:text-orange-300 border border-orange-200 dark:border-orange-800',
  'Champignons': 'bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800',
  'Herbes': 'bg-teal-50 dark:bg-teal-900/20 text-teal-700 dark:text-teal-300 border border-teal-200 dark:border-teal-800',
  'Poissons': 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800',
};

const ALL_CATEGORIES: Category[] = ['Légumes', 'Fruits', 'Champignons', 'Herbes', 'Poissons'];

const currentMonth = new Date().getMonth();

export default function SaisonnaliteIngredients() {
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState<Category | 'Tous'>('Tous');
  const [activeMonth, setActiveMonth] = useState<number | null>(currentMonth);
  const [tooltip, setTooltip] = useState<{ name: string; tip: string } | null>(null);

  const filtered = useMemo(() => {
    return INGREDIENTS.filter(ing => {
      const matchSearch = ing.name.toLowerCase().includes(search.toLowerCase());
      const matchCat = activeCategory === 'Tous' || ing.category === activeCategory;
      const matchMonth = activeMonth === null || ing.months.includes(activeMonth);
      return matchSearch && matchCat && matchMonth;
    });
  }, [search, activeCategory, activeMonth]);

  const inSeasonNow = useMemo(() =>
    INGREDIENTS.filter(i => i.months.includes(currentMonth)).length,
    []
  );

  return (
    <div className="p-4 md:p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-1">
          <div className="p-2 bg-teal-50 dark:bg-teal-900/20 rounded-xl">
            <Leaf className="w-5 h-5 text-teal-600 dark:text-teal-400" />
          </div>
          <h1 className="text-2xl font-bold text-[#111111] dark:text-white" style={{ fontFamily: 'Satoshi, sans-serif' }}>
            Saisonnalité des ingrédients
          </h1>
        </div>
        <p className="text-[#737373] dark:text-[#A3A3A3] ml-12 text-sm">
          Achetez au bon moment pour minimiser le food cost. <span className="text-teal-600 dark:text-teal-400 font-medium">{inSeasonNow} ingrédients</span> de saison ce mois-ci.
        </p>
      </div>

      {/* Filters row */}
      <div className="flex flex-wrap gap-3 mb-5">
        <div className="relative flex-1 min-w-[180px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#737373] dark:text-[#A3A3A3]" />
          <input
            type="text"
            placeholder="Rechercher un ingrédient…"
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-sm bg-[#F5F5F5] dark:bg-[#262626] border border-[#E5E7EB] dark:border-[#262626] rounded-lg text-[#111111] dark:text-white placeholder:text-[#737373] dark:placeholder:text-[#A3A3A3] focus:outline-none focus:ring-2 focus:ring-teal-500/30"
          />
        </div>
        <div className="flex items-center gap-1 flex-wrap">
          <Filter className="w-4 h-4 text-[#737373] dark:text-[#A3A3A3] mr-1" />
          {(['Tous', ...ALL_CATEGORIES] as const).map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                activeCategory === cat
                  ? 'bg-teal-600 text-white'
                  : 'bg-[#F5F5F5] dark:bg-[#262626] text-[#737373] dark:text-[#A3A3A3] hover:bg-[#E5E7EB] dark:hover:bg-[#333]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Month selector */}
      <div className="bg-white dark:bg-[#0A0A0A]/50 border border-[#E5E7EB] dark:border-[#1A1A1A] rounded-2xl p-4 mb-5">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-semibold uppercase tracking-wider text-[#737373] dark:text-[#A3A3A3]">Filtrer par mois</span>
          {activeMonth !== null && (
            <button onClick={() => setActiveMonth(null)} className="text-xs text-teal-600 dark:text-teal-400 hover:underline">
              Voir tous
            </button>
          )}
        </div>
        <div className="grid grid-cols-6 md:grid-cols-12 gap-1.5">
          {MONTHS.map((m, i) => (
            <button
              key={i}
              onClick={() => setActiveMonth(activeMonth === i ? null : i)}
              className={`py-2 rounded-lg text-xs font-medium transition-all ${
                activeMonth === i
                  ? 'bg-teal-600 text-white shadow-sm'
                  : i === currentMonth
                  ? 'bg-teal-50 dark:bg-teal-900/20 text-teal-700 dark:text-teal-300 border border-teal-300 dark:border-teal-700'
                  : 'bg-[#F5F5F5] dark:bg-[#1A1A1A] text-[#737373] dark:text-[#A3A3A3] hover:bg-[#E5E7EB] dark:hover:bg-[#262626]'
              }`}
            >
              {m}
            </button>
          ))}
        </div>
      </div>

      {/* Results count */}
      <p className="text-xs text-[#737373] dark:text-[#A3A3A3] mb-3">
        {filtered.length} ingrédient{filtered.length > 1 ? 's' : ''}
        {activeMonth !== null ? ` en saison en ${MONTH_FULL[activeMonth]}` : ''}
      </p>

      {/* Grid */}
      {filtered.length === 0 ? (
        <div className="text-center py-16 text-[#737373] dark:text-[#A3A3A3]">
          <Leaf className="w-10 h-10 mx-auto mb-3 opacity-30" />
          <p className="font-medium">Aucun ingrédient trouvé</p>
          <p className="text-sm mt-1">Essayez d'ajuster les filtres</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
          {filtered.map(ing => (
            <div
              key={ing.name}
              className="bg-white dark:bg-[#0A0A0A]/50 border border-[#E5E7EB] dark:border-[#1A1A1A] rounded-2xl p-4 hover:border-teal-300 dark:hover:border-teal-800 transition-colors"
            >
              <div className="flex items-start justify-between mb-3">
                <div>
                  <span className="font-semibold text-[#111111] dark:text-white text-sm">{ing.name}</span>
                  {ing.tip && (
                    <button
                      className="ml-2 text-xs text-teal-600 dark:text-teal-400 underline underline-offset-2"
                      onClick={() => setTooltip(tooltip?.name === ing.name ? null : { name: ing.name, tip: ing.tip! })}
                    >
                      astuce
                    </button>
                  )}
                </div>
                <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${CATEGORY_BADGE[ing.category]}`}>
                  {ing.category}
                </span>
              </div>
              {tooltip?.name === ing.name && (
                <p className="text-xs text-teal-700 dark:text-teal-300 bg-teal-50 dark:bg-teal-900/20 rounded-lg px-3 py-2 mb-3 border border-teal-100 dark:border-teal-900">
                  💡 {ing.tip}
                </p>
              )}
              {/* Month bar */}
              <div className="flex gap-0.5">
                {MONTHS.map((m, i) => {
                  const inSeason = ing.months.includes(i);
                  const isActive = i === activeMonth;
                  const isCurrent = i === currentMonth;
                  return (
                    <div key={i} className="flex-1 group relative">
                      <div
                        className={`h-5 rounded-sm transition-all ${
                          inSeason
                            ? isActive || isCurrent
                              ? `${CATEGORY_COLORS[ing.category]} opacity-100`
                              : `${CATEGORY_COLORS[ing.category]} opacity-60`
                            : 'bg-[#F5F5F5] dark:bg-[#1A1A1A]'
                        }`}
                      />
                      <span className="absolute -top-7 left-1/2 -translate-x-1/2 bg-[#111111] dark:bg-white text-white dark:text-[#111111] text-[10px] rounded px-1.5 py-0.5 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-10">
                        {MONTHS[i]}
                      </span>
                    </div>
                  );
                })}
              </div>
              <div className="flex justify-between mt-1">
                <span className="text-[10px] text-[#737373] dark:text-[#A3A3A3]">Jan</span>
                <span className="text-[10px] text-[#737373] dark:text-[#A3A3A3]">Déc</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
