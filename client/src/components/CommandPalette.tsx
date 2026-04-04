import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Layout,
  Zap,
  Brain,
  BarChart3,
  ClipboardList,
  ShoppingBasket,
  Truck,
  Package,
  CalendarDays,
  BookOpen,
  ShieldCheck,
  Sparkles,
  TrendingUp,
  Settings,
  Receipt,
  ShoppingCart,
  Plus,
  ScanLine,
  Target,
  Search,
  Command,
} from 'lucide-react';

// ----- Types -----
interface CommandItem {
  id: string;
  name: string;
  shortcut?: string;
  icon: React.ComponentType<{ className?: string }>;
  action: () => void;
}

interface CommandGroup {
  category: string;
  categoryIcon: React.ComponentType<{ className?: string }>;
  items: CommandItem[];
}

// ----- Fuzzy match helper -----
function fuzzyMatch(text: string, query: string): boolean {
  const t = text.toLowerCase();
  const q = query.toLowerCase();
  // Simple substring first
  if (t.includes(q)) return true;
  // Character-by-character fuzzy
  let qi = 0;
  for (let i = 0; i < t.length && qi < q.length; i++) {
    if (t[i] === q[qi]) qi++;
  }
  return qi === q.length;
}

function fuzzyScore(text: string, query: string): number {
  const t = text.toLowerCase();
  const q = query.toLowerCase();
  // Exact start → highest
  if (t.startsWith(q)) return 100;
  // Contains substring → high
  const idx = t.indexOf(q);
  if (idx >= 0) return 80 - idx;
  // Fuzzy → low
  return 20;
}

// ----- Component -----
export default function CommandPalette() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [activeIndex, setActiveIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  // Helper to navigate and close
  const go = useCallback(
    (path: string) => {
      setOpen(false);
      navigate(path);
    },
    [navigate]
  );

  // ----- Command definitions -----
  const groups: CommandGroup[] = useMemo(
    () => [
      {
        category: 'Navigation',
        categoryIcon: Layout,
        items: [
          { id: 'nav-dashboard', name: 'Dashboard', icon: BarChart3, action: () => go('/dashboard') },
          { id: 'nav-recettes', name: 'Recettes', icon: ClipboardList, action: () => go('/recipes') },
          { id: 'nav-ingredients', name: 'Ingredients', icon: ShoppingBasket, action: () => go('/ingredients') },
          { id: 'nav-fournisseurs', name: 'Fournisseurs', icon: Truck, action: () => go('/suppliers') },
          { id: 'nav-inventaire', name: 'Inventaire', icon: Package, action: () => go('/inventory') },
          { id: 'nav-planning', name: 'Planning', icon: CalendarDays, action: () => go('/planning') },
          { id: 'nav-menu', name: 'Menu', icon: BookOpen, action: () => go('/menu') },
          { id: 'nav-haccp', name: 'HACCP', icon: ShieldCheck, action: () => go('/haccp') },
          { id: 'nav-assistant', name: 'IA Assistant', icon: Sparkles, action: () => go('/assistant') },
          { id: 'nav-mercuriale', name: 'Mercuriale', icon: TrendingUp, action: () => go('/mercuriale') },
          { id: 'nav-parametres', name: 'Parametres', icon: Settings, action: () => go('/settings') },
        ],
      },
      {
        category: 'Actions rapides',
        categoryIcon: Zap,
        items: [
          { id: 'act-new-recipe', name: 'Nouvelle recette', icon: Plus, shortcut: 'N R', action: () => go('/recipes?new=1') },
          { id: 'act-new-ingredient', name: 'Nouvel ingredient', icon: Plus, shortcut: 'N I', action: () => go('/ingredients?new=1') },
          { id: 'act-new-supplier', name: 'Nouveau fournisseur', icon: Plus, action: () => go('/suppliers?new=1') },
          { id: 'act-new-order', name: 'Nouvelle commande', icon: ShoppingCart, action: () => go('/commandes?new=1') },
          { id: 'act-scan-invoice', name: 'Scanner facture', icon: ScanLine, shortcut: 'S F', action: () => go('/scanner-factures') },
        ],
      },
      {
        category: 'IA',
        categoryIcon: Brain,
        items: [
          { id: 'ai-assistant', name: "Ouvrir l'assistant IA", icon: Sparkles, shortcut: 'G A', action: () => go('/assistant') },
          { id: 'ai-margins', name: 'Optimiser les marges', icon: Target, action: () => go('/assistant?prompt=optimiser-marges') },
          { id: 'ai-foodcost', name: 'Analyser le food cost', icon: Receipt, action: () => go('/assistant?prompt=analyser-food-cost') },
        ],
      },
    ],
    [go]
  );

  // ----- Filtered & flattened items -----
  const filteredGroups = useMemo(() => {
    if (!query.trim()) return groups;

    return groups
      .map((g) => ({
        ...g,
        items: g.items
          .filter((item) => fuzzyMatch(item.name, query))
          .sort((a, b) => fuzzyScore(b.name, query) - fuzzyScore(a.name, query)),
      }))
      .filter((g) => g.items.length > 0);
  }, [query, groups]);

  const flatItems = useMemo(() => filteredGroups.flatMap((g) => g.items), [filteredGroups]);

  // ----- Keyboard shortcut to open -----
  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setOpen((prev) => !prev);
      }
    }
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, []);

  // ----- Focus on open -----
  useEffect(() => {
    if (open) {
      setQuery('');
      setActiveIndex(0);
      // Small delay so the DOM is painted before focusing
      requestAnimationFrame(() => {
        inputRef.current?.focus();
      });
    }
  }, [open]);

  // ----- Scroll active item into view -----
  useEffect(() => {
    if (!listRef.current) return;
    const active = listRef.current.querySelector('[data-active="true"]');
    if (active) {
      active.scrollIntoView({ block: 'nearest' });
    }
  }, [activeIndex]);

  // ----- Reset activeIndex when results change -----
  useEffect(() => {
    setActiveIndex(0);
  }, [query]);

  // ----- Keyboard navigation inside palette -----
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowDown':
          e.preventDefault();
          setActiveIndex((i) => (i + 1) % Math.max(flatItems.length, 1));
          break;
        case 'ArrowUp':
          e.preventDefault();
          setActiveIndex((i) => (i - 1 + flatItems.length) % Math.max(flatItems.length, 1));
          break;
        case 'Enter':
          e.preventDefault();
          if (flatItems[activeIndex]) {
            flatItems[activeIndex].action();
          }
          break;
        case 'Escape':
          e.preventDefault();
          setOpen(false);
          break;
      }
    },
    [flatItems, activeIndex]
  );

  // ----- Don't render when closed -----
  if (!open) return null;

  let runningIndex = -1;

  return (
    <div
      className="fixed inset-0 z-[200] flex items-start justify-center"
      onClick={() => setOpen(false)}
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-[fadeIn_150ms_ease-out]" />

      {/* Panel */}
      <div
        className="relative w-full max-w-lg mx-4 mt-[20vh] rounded-xl border border-slate-700 bg-slate-900 shadow-2xl shadow-black/50 overflow-hidden animate-[slideDown_200ms_ease-out]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search input */}
        <div className="flex items-center gap-3 px-4 py-3.5 border-b border-slate-700/60">
          <Search className="w-5 h-5 text-slate-400 flex-shrink-0" />
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Rechercher une commande..."
            className="flex-1 bg-transparent text-white placeholder-slate-400 text-sm outline-none caret-teal-400"
            autoComplete="off"
            spellCheck={false}
          />
          <kbd className="hidden sm:inline-flex items-center gap-0.5 px-1.5 py-0.5 text-[10px] font-medium text-slate-500 bg-slate-800 border border-slate-700 rounded">
            ESC
          </kbd>
        </div>

        {/* Results list */}
        <div ref={listRef} className="max-h-[50vh] overflow-y-auto py-2 scroll-smooth">
          {filteredGroups.length === 0 && (
            <div className="py-10 text-center text-sm text-slate-500">
              Aucun resultat pour &laquo;&nbsp;{query}&nbsp;&raquo;
            </div>
          )}

          {filteredGroups.map((group) => (
            <div key={group.category} className="mb-1">
              {/* Category header */}
              <div className="flex items-center gap-2 px-4 py-2">
                <group.categoryIcon className="w-3.5 h-3.5 text-slate-500" />
                <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                  {group.category}
                </span>
              </div>

              {/* Items */}
              {group.items.map((item) => {
                runningIndex++;
                const idx = runningIndex;
                const isActive = idx === activeIndex;

                return (
                  <button
                    key={item.id}
                    data-active={isActive}
                    onClick={() => item.action()}
                    onMouseEnter={() => setActiveIndex(idx)}
                    className={`
                      w-full flex items-center gap-3 px-4 py-2.5 text-left text-sm transition-all duration-100
                      ${
                        isActive
                          ? 'bg-teal-500/20 border-l-2 border-teal-400'
                          : 'border-l-2 border-transparent hover:bg-teal-500/10'
                      }
                    `}
                  >
                    <item.icon
                      className={`w-4 h-4 flex-shrink-0 transition-colors duration-100 ${
                        isActive ? 'text-teal-400' : 'text-slate-500'
                      }`}
                    />
                    <span
                      className={`flex-1 truncate transition-colors duration-100 ${
                        isActive ? 'text-white' : 'text-slate-300'
                      }`}
                    >
                      {item.name}
                    </span>
                    {item.shortcut && (
                      <span className="ml-auto flex items-center gap-1">
                        {item.shortcut.split(' ').map((k, ki) => (
                          <kbd
                            key={ki}
                            className="inline-flex items-center justify-center min-w-[20px] px-1 py-0.5 text-[10px] font-medium text-slate-500 bg-slate-800 border border-slate-700 rounded"
                          >
                            {k}
                          </kbd>
                        ))}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          ))}
        </div>

        {/* Footer hints */}
        <div className="flex items-center gap-4 px-4 py-2.5 border-t border-slate-700/60 text-[10px] text-slate-500">
          <span className="flex items-center gap-1.5">
            <kbd className="px-1 py-0.5 bg-slate-800 border border-slate-700 rounded text-slate-500">
              {'\u2191\u2193'}
            </kbd>
            naviguer
          </span>
          <span className="flex items-center gap-1.5">
            <kbd className="px-1 py-0.5 bg-slate-800 border border-slate-700 rounded text-slate-500">
              {'\u23CE'}
            </kbd>
            ouvrir
          </span>
          <span className="flex items-center gap-1.5">
            <kbd className="px-1 py-0.5 bg-slate-800 border border-slate-700 rounded text-slate-500">esc</kbd>
            fermer
          </span>
          <span className="ml-auto flex items-center gap-1.5">
            <Command className="w-3 h-3" />
            <span>K</span>
          </span>
        </div>
      </div>

      {/* Keyframe animations (injected once) */}
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
        @keyframes slideDown {
          from { opacity: 0; transform: translateY(-12px) scale(0.98); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }
      `}</style>
    </div>
  );
}
