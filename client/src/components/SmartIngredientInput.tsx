import { useState, useRef, useEffect, useCallback } from 'react';
import { Search, Plus, Loader2, ChevronDown } from 'lucide-react';

interface Ingredient {
  id: number;
  name: string;
  unit: string;
  price: number;
  category?: string;
  supplier?: string;
}

interface MercurialePrice {
  name: string;
  priceMin: number | null;
  priceMax: number | null;
  unit: string;
  supplier: string | null;
  trend: string | null;
  trendDetail: string | null;
  category: string | null;
}

interface SmartIngredientInputProps {
  onSelect: (ingredient: { id: number; name: string; unit: string; price: number; category?: string }) => void;
  placeholder?: string;
  className?: string;
}

const CATEGORY_EMOJIS: Record<string, string> = {
  'Viandes': '🥩',
  'Poissons': '🐟',
  'Fruits & Legumes': '🥬',
  'Fruits & Légumes': '🥬',
  'Epicerie': '🫒',
  'Épicerie': '🫒',
  'Produits laitiers': '🧀',
  'Boissons': '🍷',
  'Surgeles': '🧊',
  'Surgelés': '🧊',
  'Boulangerie': '🥖',
  'Condiments': '🧂',
};

const UNITS = ['kg', 'g', 'L', 'cl', 'pièce', 'bouteille', 'boîte', 'sachet'];

const CATEGORIES = [
  'Viandes',
  'Poissons',
  'Fruits & Légumes',
  'Épicerie',
  'Produits laitiers',
  'Boissons',
  'Surgelés',
  'Boulangerie',
  'Condiments',
];

function authHeaders() {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`,
  };
}

export default function SmartIngredientInput({
  onSelect,
  placeholder = 'Rechercher un ingrédient...',
  className = '',
}: SmartIngredientInputProps) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Ingredient[]>([]);
  const [mercurialePrices, setMercurialePrices] = useState<MercurialePrice[]>([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [searched, setSearched] = useState(false);

  // New ingredient form state
  const [newPrice, setNewPrice] = useState('');
  const [newUnit, setNewUnit] = useState('kg');
  const [newCategory, setNewCategory] = useState('Épicerie');
  const [newSupplier, setNewSupplier] = useState('');
  const [creating, setCreating] = useState(false);
  const [toast, setToast] = useState('');

  const wrapperRef = useRef<HTMLDivElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout>>();

  // Close dropdown on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  // Auto-dismiss toast
  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(''), 3000);
    return () => clearTimeout(t);
  }, [toast]);

  const search = useCallback(async (term: string) => {
    if (term.trim().length < 2) {
      setResults([]);
      setMercurialePrices([]);
      setSearched(false);
      setOpen(false);
      return;
    }
    setLoading(true);
    try {
      const [ingredientRes, mercurialeRes] = await Promise.all([
        fetch(`/api/ingredients?search=${encodeURIComponent(term)}`, { headers: authHeaders() }),
        fetch(`/api/mercuriale/search?q=${encodeURIComponent(term)}`, { headers: authHeaders() }).catch(() => null),
      ]);
      if (ingredientRes.ok) {
        const data = await ingredientRes.json();
        const list = Array.isArray(data) ? data : data.ingredients ?? [];
        setResults(list);
        setSearched(true);
        setOpen(true);
      }
      if (mercurialeRes && mercurialeRes.ok) {
        const mercData = await mercurialeRes.json();
        setMercurialePrices(Array.isArray(mercData) ? mercData : []);
      } else {
        setMercurialePrices([]);
      }
    } catch {
      // silently fail
    } finally {
      setLoading(false);
    }
  }, []);

  const handleChange = (value: string) => {
    setQuery(value);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => search(value), 300);
  };

  const handleSelect = (ing: Ingredient) => {
    onSelect({ id: ing.id, name: ing.name, unit: ing.unit, price: ing.price, category: ing.category });
    setQuery(ing.name);
    setOpen(false);
    setSearched(false);
  };

  const handleCreate = async () => {
    if (!query.trim() || creating) return;
    setCreating(true);
    try {
      const res = await fetch('/api/ingredients', {
        method: 'POST',
        headers: authHeaders(),
        body: JSON.stringify({
          name: query.trim(),
          unit: newUnit,
          price: parseFloat(newPrice) || 0,
          category: newCategory,
          supplier: newSupplier.trim() || undefined,
        }),
      });
      if (res.ok) {
        const created = await res.json();
        onSelect({
          id: created.id,
          name: created.name,
          unit: created.unit,
          price: created.price,
          category: created.category,
        });
        setToast('Ingredient ajoute a l\'inventaire');
        setQuery(created.name);
        setOpen(false);
        setSearched(false);
        // Reset form
        setNewPrice('');
        setNewUnit('kg');
        setNewCategory('Épicerie');
        setNewSupplier('');
      }
    } catch {
      // silently fail
    } finally {
      setCreating(false);
    }
  };

  const noResults = searched && results.length === 0 && query.trim().length >= 2;

  // Find the best mercuriale match for a given ingredient name
  function findMercurialePrice(ingredientName: string): MercurialePrice | null {
    const lower = ingredientName.toLowerCase();
    return mercurialePrices.find(mp => lower.includes(mp.name.toLowerCase()) || mp.name.toLowerCase().includes(lower)) || null;
  }

  // When no results + mercuriale has a price, pre-fill the price
  const mercurialeForNew = mercurialePrices.length > 0 ? mercurialePrices[0] : null;
  useEffect(() => {
    if (noResults && mercurialeForNew && !newPrice) {
      const avg = mercurialeForNew.priceMin != null && mercurialeForNew.priceMax != null
        ? ((mercurialeForNew.priceMin + mercurialeForNew.priceMax) / 2).toFixed(2)
        : '';
      if (avg) setNewPrice(avg);
      if (mercurialeForNew.unit) setNewUnit(mercurialeForNew.unit);
    }
  }, [noResults, mercurialeForNew]);

  return (
    <div ref={wrapperRef} className={`relative ${className}`}>
      {/* Search input */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#A3A3A3] pointer-events-none" />
        <input
          type="text"
          value={query}
          onChange={(e) => handleChange(e.target.value)}
          onFocus={() => { if (searched && query.trim().length >= 2) setOpen(true); }}
          placeholder={placeholder}
          className="w-full pl-10 pr-10 py-2.5 bg-[#262626] dark:bg-[#262626] bg-white border border-[#262626] dark:border-[#262626] rounded-lg text-sm text-white dark:text-white placeholder-[#A3A3A3] focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-colors"
        />
        {loading && (
          <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-teal-400 animate-spin" />
        )}
        {!loading && query && (
          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#A3A3A3]" />
        )}
      </div>

      {/* Dropdown */}
      {open && (
        <div className="absolute z-50 mt-1 w-full bg-[#0A0A0A] dark:bg-[#0A0A0A] border border-[#262626] rounded-lg shadow-xl overflow-hidden">
          {/* Existing results */}
          {results.length > 0 && (
            <ul className="max-h-60 overflow-y-auto divide-y divide-[#E5E7EB] dark:divide-[#1A1A1A]">
              {results.map((ing) => {
                const mp = findMercurialePrice(ing.name);
                return (
                <li key={ing.id}>
                  <button
                    type="button"
                    onClick={() => handleSelect(ing)}
                    className="w-full text-left px-4 py-2.5 hover:bg-[#F5F5F5] dark:hover:bg-[#262626] transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-lg flex-shrink-0">
                        {CATEGORY_EMOJIS[ing.category ?? ''] ?? '📦'}
                      </span>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-[#111111] dark:text-white font-medium truncate">{ing.name}</p>
                        {ing.supplier && (
                          <p className="text-xs text-[#A3A3A3] truncate">{ing.supplier}</p>
                        )}
                      </div>
                      <div className="text-right flex-shrink-0">
                        <p className="text-sm text-teal-400 font-semibold">
                          {typeof ing.price === 'number' ? ing.price.toFixed(2) : '0.00'} &euro;
                        </p>
                        <p className="text-xs text-[#A3A3A3]">/{ing.unit}</p>
                      </div>
                    </div>
                    {mp && mp.priceMin != null && mp.priceMax != null && (
                      <div className="mt-1 ml-9">
                        <span className="text-xs text-teal-400">
                          {'📊'} Marche : {mp.priceMin.toFixed(2)}-{mp.priceMax.toFixed(2)}&euro;/{mp.unit} ({mp.supplier})
                          {mp.trend === 'baisse' && <span className="text-emerald-400 ml-1">{'↘'} {mp.trendDetail}</span>}
                          {mp.trend === 'hausse' && <span className="text-red-400 ml-1">{'↗'} {mp.trendDetail}</span>}
                          {mp.trend === 'stable' && <span className="text-[#A3A3A3] ml-1">{'→'} {mp.trendDetail}</span>}
                        </span>
                      </div>
                    )}
                  </button>
                </li>
                );
              })}
            </ul>
          )}

          {/* New ingredient banner */}
          {noResults && (
            <div className="animate-slideDown">
              {/* Header */}
              <div className="flex items-center gap-2 px-4 py-3 bg-teal-100 dark:bg-teal-900/40 border-b border-teal-300 dark:border-teal-700/50">
                <span className="text-lg">✨</span>
                <span className="text-sm font-semibold text-teal-300">
                  Nouvel ingredient detecte !
                </span>
                <span className="ml-auto text-xs text-teal-400 bg-teal-200 dark:bg-teal-900/60 px-2 py-0.5 rounded-full">
                  {query.trim()}
                </span>
              </div>

              {/* Mercuriale price hint */}
              {mercurialeForNew && mercurialeForNew.priceMin != null && mercurialeForNew.priceMax != null && (
                <div className="px-4 py-2 bg-teal-50 dark:bg-teal-900/30 border-b border-teal-200 dark:border-teal-700/30">
                  <span className="text-xs text-teal-400">
                    {'📊'} Prix marche : {mercurialeForNew.priceMin.toFixed(2)}-{mercurialeForNew.priceMax.toFixed(2)}&euro;/{mercurialeForNew.unit}
                    {mercurialeForNew.supplier && ` (${mercurialeForNew.supplier})`}
                    {mercurialeForNew.trend === 'baisse' && <span className="text-emerald-400 ml-1">{'↘'} {mercurialeForNew.trendDetail}</span>}
                    {mercurialeForNew.trend === 'hausse' && <span className="text-red-400 ml-1">{'↗'} {mercurialeForNew.trendDetail}</span>}
                    {mercurialeForNew.trend === 'stable' && <span className="text-[#A3A3A3] ml-1">{'→'} {mercurialeForNew.trendDetail}</span>}
                  </span>
                </div>
              )}

              {/* Mini form */}
              <div className="p-4 space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  {/* Price */}
                  <div>
                    <label className="block text-xs text-[#A3A3A3] mb-1">Prix unitaire</label>
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      value={newPrice}
                      onChange={(e) => setNewPrice(e.target.value)}
                      placeholder="0.00 &euro;"
                      className="w-full px-3 py-2 bg-[#F5F5F5] dark:bg-[#262626] border border-[#E5E7EB] dark:border-[#262626] rounded-lg text-sm text-[#111111] dark:text-white placeholder-[#A3A3A3] dark:placeholder-[#737373] focus:outline-none focus:ring-2 focus:ring-teal-500"
                    />
                  </div>

                  {/* Unit */}
                  <div>
                    <label className="block text-xs text-[#A3A3A3] mb-1">Unite</label>
                    <select
                      value={newUnit}
                      onChange={(e) => setNewUnit(e.target.value)}
                      className="w-full px-3 py-2 bg-[#F5F5F5] dark:bg-[#262626] border border-[#E5E7EB] dark:border-[#262626] rounded-lg text-sm text-[#111111] dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
                    >
                      {UNITS.map((u) => (
                        <option key={u} value={u}>{u}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  {/* Category */}
                  <div>
                    <label className="block text-xs text-[#A3A3A3] mb-1">Categorie</label>
                    <select
                      value={newCategory}
                      onChange={(e) => setNewCategory(e.target.value)}
                      className="w-full px-3 py-2 bg-[#F5F5F5] dark:bg-[#262626] border border-[#E5E7EB] dark:border-[#262626] rounded-lg text-sm text-[#111111] dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
                    >
                      {CATEGORIES.map((c) => (
                        <option key={c} value={c}>
                          {CATEGORY_EMOJIS[c] ?? ''} {c}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Supplier */}
                  <div>
                    <label className="block text-xs text-[#A3A3A3] mb-1">Fournisseur</label>
                    <input
                      type="text"
                      value={newSupplier}
                      onChange={(e) => setNewSupplier(e.target.value)}
                      placeholder="Optionnel"
                      className="w-full px-3 py-2 bg-[#F5F5F5] dark:bg-[#262626] border border-[#E5E7EB] dark:border-[#262626] rounded-lg text-sm text-[#111111] dark:text-white placeholder-[#A3A3A3] dark:placeholder-[#737373] focus:outline-none focus:ring-2 focus:ring-teal-500"
                    />
                  </div>
                </div>

                {/* Submit button */}
                <button
                  type="button"
                  onClick={handleCreate}
                  disabled={creating}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-teal-600 hover:bg-teal-500 disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-semibold rounded-lg transition-colors"
                >
                  {creating ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Plus className="w-4 h-4" />
                  )}
                  Ajouter a l'inventaire
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Toast notification */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-[9999] bg-green-600 text-white px-4 py-3 rounded-lg shadow-lg flex items-center gap-2 animate-toast-in">
          <span>✅</span>
          <span className="text-sm">{toast}</span>
        </div>
      )}
    </div>
  );
}
