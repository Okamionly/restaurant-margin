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
  Scale,
  MessageSquare,
  Calendar,
  Store,
  Trash2,
  QrCode,
  FileText,
  Calculator,
  Contact,
  CreditCard,
  PartyPopper,
  Shield,
  Loader2,
  Clock,
  Printer,
  ArrowRight,
} from 'lucide-react';
import { getToken } from '../services/api';

// ----- Types -----
interface CommandItem {
  id: string;
  name: string;
  shortcut?: string;
  icon: React.ComponentType<{ className?: string }>;
  action: () => void;
  category?: string;
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
  if (t.includes(q)) return true;
  let qi = 0;
  for (let i = 0; i < t.length && qi < q.length; i++) {
    if (t[i] === q[qi]) qi++;
  }
  return qi === q.length;
}

function fuzzyScore(text: string, query: string): number {
  const t = text.toLowerCase();
  const q = query.toLowerCase();
  if (t.startsWith(q)) return 100;
  const idx = t.indexOf(q);
  if (idx >= 0) return 80 - idx;
  return 20;
}

// ----- Recent Commands (localStorage) -----
const RECENT_KEY = 'rm-command-palette-recent';
const MAX_RECENT = 5;

function getRecentIds(): string[] {
  try {
    const raw = localStorage.getItem(RECENT_KEY);
    if (!raw) return [];
    return JSON.parse(raw) as string[];
  } catch {
    return [];
  }
}

function addRecent(id: string) {
  const current = getRecentIds().filter((r) => r !== id);
  current.unshift(id);
  localStorage.setItem(RECENT_KEY, JSON.stringify(current.slice(0, MAX_RECENT)));
}

// ----- Recently visited pages (localStorage) -----
const RECENT_PAGES_KEY = 'rm-recent-pages';
const MAX_RECENT_PAGES = 5;

export function trackPageVisit(path: string) {
  try {
    const raw = localStorage.getItem(RECENT_PAGES_KEY);
    const current: string[] = raw ? JSON.parse(raw) : [];
    const updated = [path, ...current.filter((p) => p !== path)].slice(0, MAX_RECENT_PAGES);
    localStorage.setItem(RECENT_PAGES_KEY, JSON.stringify(updated));
  } catch { /* ignore */ }
}

function getRecentPages(): string[] {
  try {
    const raw = localStorage.getItem(RECENT_PAGES_KEY);
    if (!raw) return [];
    return JSON.parse(raw) as string[];
  } catch {
    return [];
  }
}

// ----- Component -----
export default function CommandPalette() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [activeIndex, setActiveIndex] = useState(0);
  const [recentIds, setRecentIds] = useState<string[]>([]);
  const [recipes, setRecipes] = useState<any[]>([]);
  const [ingredients, setIngredients] = useState<any[]>([]);
  const [suppliers, setSuppliers] = useState<any[]>([]);
  const [loadingData, setLoadingData] = useState(false);
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

  // Execute and track a command
  const exec = useCallback(
    (item: CommandItem) => {
      addRecent(item.id);
      item.action();
      setOpen(false);
    },
    []
  );

  // ----- Quick Action definitions -----
  const quickActions: CommandItem[] = useMemo(
    () => [
      {
        id: 'qa-new-recipe',
        name: 'Nouvelle recette',
        icon: Plus,
        shortcut: 'Ctrl+N',
        action: () => go('/recipes?action=new'),
        category: 'action',
      },
      {
        id: 'qa-new-ingredient',
        name: 'Nouvel ingredient',
        icon: Plus,
        shortcut: 'Ctrl+I',
        action: () => go('/ingredients?action=new'),
        category: 'action',
      },
      {
        id: 'qa-new-pesee',
        name: 'Nouvelle pesee',
        icon: Scale,
        action: () => go('/station'),
        category: 'action',
      },
      {
        id: 'qa-commande',
        name: 'Commande fournisseur',
        icon: ShoppingCart,
        action: () => go('/commandes'),
        category: 'action',
      },
      {
        id: 'qa-ai-report',
        name: 'Rapport IA',
        icon: Brain,
        action: () => go('/assistant?prompt=rapport-complet'),
        category: 'action',
      },
      {
        id: 'qa-scanner',
        name: 'Scanner facture',
        icon: ScanLine,
        action: () => go('/scanner-factures'),
        category: 'action',
      },
      {
        id: 'qa-dashboard',
        name: 'Voir le dashboard',
        icon: BarChart3,
        action: () => go('/dashboard'),
        category: 'action',
      },
      {
        id: 'qa-print',
        name: 'Imprimer cette page',
        icon: Printer,
        shortcut: 'Ctrl+P',
        action: () => {
          setOpen(false);
          window.print();
        },
        category: 'action',
      },
    ],
    [go]
  );

  // ----- Navigation pages -----
  const pageItems: CommandItem[] = useMemo(
    () => [
      { id: 'p-dashboard', name: 'Tableau de bord', icon: BarChart3, action: () => go('/dashboard'), category: 'page' },
      { id: 'p-menu', name: 'La Carte', icon: BookOpen, action: () => go('/menu'), category: 'page' },
      { id: 'p-ingredients', name: 'Ingredients', icon: ShoppingBasket, action: () => go('/ingredients'), category: 'page' },
      { id: 'p-recipes', name: 'Fiches techniques', icon: ClipboardList, action: () => go('/recipes'), category: 'page' },
      { id: 'p-inventory', name: 'Inventaire', icon: Package, action: () => go('/inventory'), category: 'page' },
      { id: 'p-suppliers', name: 'Fournisseurs', icon: Truck, action: () => go('/suppliers'), category: 'page' },
      { id: 'p-scanner', name: 'Factures', icon: Receipt, action: () => go('/scanner-factures'), category: 'page' },
      { id: 'p-mercuriale', name: 'Mercuriale', icon: TrendingUp, action: () => go('/mercuriale'), category: 'page' },
      { id: 'p-engineering', name: 'Menu Engineering', icon: Target, action: () => go('/menu-engineering'), category: 'page' },
      { id: 'p-allergens', name: 'Matrice allergenes', icon: Shield, action: () => go('/allergen-matrix'), category: 'page' },
      { id: 'p-commandes', name: 'Commandes', icon: ShoppingCart, action: () => go('/commandes'), category: 'page' },
      { id: 'p-planning', name: 'Planning', icon: CalendarDays, action: () => go('/planning'), category: 'page' },
      { id: 'p-messagerie', name: 'Messages', icon: MessageSquare, action: () => go('/messagerie'), category: 'page' },
      { id: 'p-clients', name: 'Clients CRM', icon: Contact, action: () => go('/clients'), category: 'page' },
      { id: 'p-comptabilite', name: 'Comptabilite', icon: Calculator, action: () => go('/comptabilite'), category: 'page' },
      { id: 'p-devis', name: 'Devis & Factures', icon: FileText, action: () => go('/devis'), category: 'page' },
      { id: 'p-marketplace', name: 'Marketplace', icon: Store, action: () => go('/marketplace'), category: 'page' },
      { id: 'p-settings', name: 'Parametres', icon: Settings, action: () => go('/settings'), category: 'page' },
      { id: 'p-gaspillage', name: 'Gaspillage', icon: Trash2, action: () => go('/gaspillage'), category: 'page' },
      { id: 'p-menu-calendar', name: 'Menu Calendrier', icon: Calendar, action: () => go('/menu-calendar'), category: 'page' },
      { id: 'p-haccp', name: 'HACCP', icon: ShieldCheck, action: () => go('/haccp'), category: 'page' },
      { id: 'p-assistant', name: 'Assistant IA', icon: Sparkles, action: () => go('/assistant'), category: 'page' },
      { id: 'p-seminaires', name: 'Seminaires', icon: PartyPopper, action: () => go('/seminaires'), category: 'page' },
      { id: 'p-qr', name: 'Menu QR Code', icon: QrCode, action: () => go('/qr-menu'), category: 'page' },
      { id: 'p-abonnement', name: 'Mon abonnement', icon: CreditCard, action: () => go('/abonnement'), category: 'page' },
      { id: 'p-station', name: 'Station Balance', icon: Scale, action: () => go('/station'), category: 'page' },
      { id: 'p-feedback', name: 'Avis clients', icon: MessageSquare, action: () => go('/feedback'), category: 'page' },
      { id: 'p-analytics', name: 'Analytics', icon: BarChart3, action: () => go('/analytics'), category: 'page' },
    ],
    [go]
  );

  // ----- IA commands -----
  const aiItems: CommandItem[] = useMemo(
    () => [
      { id: 'ai-assistant', name: "Ouvrir l'assistant IA", icon: Sparkles, action: () => go('/assistant'), category: 'ia' },
      { id: 'ai-margins', name: 'Optimiser les marges', icon: Target, action: () => go('/assistant?prompt=optimiser-marges'), category: 'ia' },
      { id: 'ai-foodcost', name: 'Analyser le food cost', icon: Receipt, action: () => go('/assistant?prompt=analyser-food-cost'), category: 'ia' },
      { id: 'ai-report', name: 'Generer rapport complet', icon: Brain, action: () => go('/assistant?prompt=rapport-complet'), category: 'ia' },
    ],
    [go]
  );

  // All static commands combined
  const allStaticItems = useMemo(
    () => [...quickActions, ...pageItems, ...aiItems],
    [quickActions, pageItems, aiItems]
  );

  // ----- Dynamic search results from API -----
  const dynamicResults: CommandItem[] = useMemo(() => {
    if (!query.trim()) return [];
    const q = query.toLowerCase().trim();
    const items: CommandItem[] = [];

    recipes
      .filter((r: any) => r.name?.toLowerCase().includes(q))
      .slice(0, 5)
      .forEach((r: any) => {
        items.push({
          id: 'recipe-' + r.id,
          name: r.name,
          icon: ClipboardList,
          action: () => go('/recipes/' + r.id),
          category: 'recette',
        });
      });

    ingredients
      .filter((i: any) => i.name?.toLowerCase().includes(q))
      .slice(0, 5)
      .forEach((i: any) => {
        items.push({
          id: 'ingredient-' + i.id,
          name: i.name,
          icon: ShoppingBasket,
          action: () => go('/ingredients'),
          category: 'ingredient',
        });
      });

    suppliers
      .filter((s: any) => s.name?.toLowerCase().includes(q))
      .slice(0, 5)
      .forEach((s: any) => {
        items.push({
          id: 'supplier-' + s.id,
          name: s.name,
          icon: Truck,
          action: () => go('/suppliers'),
          category: 'fournisseur',
        });
      });

    return items;
  }, [query, recipes, ingredients, suppliers, go]);

  // ----- Build recent command items -----
  const recentItems: CommandItem[] = useMemo(() => {
    if (query.trim()) return []; // Don't show recent when searching
    return recentIds
      .map((id) => allStaticItems.find((item) => item.id === id))
      .filter(Boolean) as CommandItem[];
  }, [recentIds, allStaticItems, query]);

  // ----- Build recently visited pages -----
  // Map of route paths to page item IDs for resolving recent pages
  const pathToPageId = useMemo(() => {
    const map: Record<string, string> = {
      '/dashboard': 'p-dashboard',
      '/menu': 'p-menu',
      '/ingredients': 'p-ingredients',
      '/recipes': 'p-recipes',
      '/inventory': 'p-inventory',
      '/suppliers': 'p-suppliers',
      '/scanner-factures': 'p-scanner',
      '/mercuriale': 'p-mercuriale',
      '/menu-engineering': 'p-engineering',
      '/allergen-matrix': 'p-allergens',
      '/commandes': 'p-commandes',
      '/planning': 'p-planning',
      '/messagerie': 'p-messagerie',
      '/clients': 'p-clients',
      '/comptabilite': 'p-comptabilite',
      '/devis': 'p-devis',
      '/marketplace': 'p-marketplace',
      '/settings': 'p-settings',
      '/gaspillage': 'p-gaspillage',
      '/menu-calendar': 'p-menu-calendar',
      '/haccp': 'p-haccp',
      '/assistant': 'p-assistant',
      '/seminaires': 'p-seminaires',
      '/qr-menu': 'p-qr',
      '/abonnement': 'p-abonnement',
      '/station': 'p-station',
      '/feedback': 'p-feedback',
      '/analytics': 'p-analytics',
    };
    return map;
  }, []);

  const recentPageItems: CommandItem[] = useMemo(() => {
    if (query.trim()) return [];
    const recentPaths = getRecentPages();
    const items: CommandItem[] = [];
    for (const path of recentPaths) {
      const pageId = pathToPageId[path];
      if (pageId) {
        const found = pageItems.find((pi) => pi.id === pageId);
        if (found && !items.find((i) => i.id === found.id)) {
          items.push(found);
        }
      }
      if (items.length >= MAX_RECENT_PAGES) break;
    }
    return items;
  }, [query, pageItems, pathToPageId]);

  // ----- Filtered command groups for display -----
  const displayGroups = useMemo(() => {
    const groups: { label: string; icon: React.ComponentType<{ className?: string }>; items: CommandItem[] }[] = [];

    if (!query.trim()) {
      // No query: show recently visited pages, then recent commands, then quick actions, then pages
      if (recentPageItems.length > 0) {
        groups.push({ label: 'Recemment visite', icon: Clock, items: recentPageItems });
      }
      if (recentItems.length > 0) {
        groups.push({ label: 'Recemment utilise', icon: Clock, items: recentItems });
      }
      groups.push({ label: 'Actions rapides', icon: Zap, items: quickActions });
      groups.push({ label: 'Navigation', icon: Layout, items: pageItems.slice(0, 8) });
      groups.push({ label: 'Intelligence IA', icon: Brain, items: aiItems });
    } else {
      // Has query: filter everything
      const matchedActions = quickActions
        .filter((item) => fuzzyMatch(item.name, query))
        .sort((a, b) => fuzzyScore(b.name, query) - fuzzyScore(a.name, query));
      const matchedPages = pageItems
        .filter((item) => fuzzyMatch(item.name, query))
        .sort((a, b) => fuzzyScore(b.name, query) - fuzzyScore(a.name, query));
      const matchedAI = aiItems
        .filter((item) => fuzzyMatch(item.name, query))
        .sort((a, b) => fuzzyScore(b.name, query) - fuzzyScore(a.name, query));

      if (matchedActions.length > 0) {
        groups.push({ label: 'Actions', icon: Zap, items: matchedActions });
      }
      if (dynamicResults.length > 0) {
        const recipeResults = dynamicResults.filter((d) => d.category === 'recette');
        const ingredientResults = dynamicResults.filter((d) => d.category === 'ingredient');
        const supplierResults = dynamicResults.filter((d) => d.category === 'fournisseur');
        if (recipeResults.length > 0) {
          groups.push({ label: 'Recettes', icon: ClipboardList, items: recipeResults });
        }
        if (ingredientResults.length > 0) {
          groups.push({ label: 'Ingredients', icon: ShoppingBasket, items: ingredientResults });
        }
        if (supplierResults.length > 0) {
          groups.push({ label: 'Fournisseurs', icon: Truck, items: supplierResults });
        }
      }
      if (matchedPages.length > 0) {
        groups.push({ label: 'Pages', icon: Layout, items: matchedPages });
      }
      if (matchedAI.length > 0) {
        groups.push({ label: 'Intelligence IA', icon: Brain, items: matchedAI });
      }
    }

    return groups;
  }, [query, quickActions, pageItems, aiItems, recentItems, recentPageItems, dynamicResults]);

  const flatItems = useMemo(() => displayGroups.flatMap((g) => g.items), [displayGroups]);

  // ----- Fetch data on open -----
  useEffect(() => {
    if (!open) return;
    const token = getToken();
    if (!token) return;
    const headers = { Authorization: `Bearer ${token}` };
    setLoadingData(true);
    Promise.all([
      fetch('/api/recipes', { headers }).then((r) => (r.ok ? r.json() : [])).catch(() => []),
      fetch('/api/ingredients', { headers }).then((r) => (r.ok ? r.json() : [])).catch(() => []),
      fetch('/api/suppliers', { headers }).then((r) => (r.ok ? r.json() : [])).catch(() => []),
    ]).then(([rec, ing, sup]) => {
      setRecipes(Array.isArray(rec) ? rec : []);
      setIngredients(Array.isArray(ing) ? ing : []);
      setSuppliers(Array.isArray(sup) ? sup : []);
      setLoadingData(false);
    });
  }, [open]);

  // ----- Global keyboard shortcuts -----
  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      // Ctrl+K / Cmd+K: toggle palette
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setOpen((prev) => !prev);
        return;
      }

      // Don't fire shortcuts if palette is open (let it handle its own keys)
      if (open) return;

      // Don't fire shortcuts when typing in an input/textarea
      const tag = (e.target as HTMLElement)?.tagName;
      if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') return;
      if ((e.target as HTMLElement)?.isContentEditable) return;

      // Ctrl+N: new recipe
      if ((e.metaKey || e.ctrlKey) && e.key === 'n') {
        e.preventDefault();
        addRecent('qa-new-recipe');
        navigate('/recipes?action=new');
        return;
      }

      // Ctrl+I: new ingredient
      if ((e.metaKey || e.ctrlKey) && e.key === 'i') {
        e.preventDefault();
        addRecent('qa-new-ingredient');
        navigate('/ingredients?action=new');
        return;
      }

      // Ctrl+P: print
      if ((e.metaKey || e.ctrlKey) && e.key === 'p') {
        e.preventDefault();
        window.print();
        return;
      }
    }
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [open, navigate]);

  // ----- Focus on open -----
  useEffect(() => {
    if (open) {
      setQuery('');
      setActiveIndex(0);
      setRecentIds(getRecentIds());
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
            exec(flatItems[activeIndex]);
          }
          break;
        case 'Escape':
          e.preventDefault();
          setOpen(false);
          break;
      }
    },
    [flatItems, activeIndex, exec]
  );

  // ----- Don't render when closed -----
  if (!open) return null;

  let runningIndex = -1;

  const isMac = navigator.platform?.toLowerCase().includes('mac');
  const modKey = isMac ? '\u2318' : 'Ctrl';

  return (
    <div
      className="fixed inset-0 z-[200] flex items-start justify-center"
      onClick={() => setOpen(false)}
    >
      {/* Overlay with backdrop blur */}
      <div className="absolute inset-0 bg-black/70 backdrop-blur-md animate-[cpFadeIn_120ms_ease-out]" />

      {/* Panel - centered, responsive */}
      <div
        className="
          relative w-full max-w-[600px] mx-4 mt-[15vh]
          sm:rounded-2xl rounded-none
          border border-[#1A1A1A]
          bg-[#0A0A0A]
          shadow-2xl shadow-black/60
          overflow-hidden
          animate-[cpSlideDown_180ms_ease-out]
          max-sm:fixed max-sm:inset-0 max-sm:mt-0 max-sm:mx-0 max-sm:max-w-none max-sm:rounded-none max-sm:border-0
        "
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search input - large */}
        <div className="flex items-center gap-3 px-5 py-4 border-b border-[#1A1A1A]">
          <Search className="w-5 h-5 text-[#737373] flex-shrink-0" />
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Tapez une commande ou recherchez..."
            className="flex-1 bg-transparent text-white placeholder-[#525252] text-base outline-none caret-teal-400"
            autoComplete="off"
            spellCheck={false}
          />
          {loadingData && <Loader2 className="w-4 h-4 animate-spin text-teal-400 flex-shrink-0" />}
          <kbd className="hidden sm:inline-flex items-center gap-0.5 px-2 py-1 text-[11px] font-medium text-[#525252] bg-[#171717] border border-[#262626] rounded-lg">
            ESC
          </kbd>
        </div>

        {/* Results list */}
        <div ref={listRef} className="max-h-[60vh] max-sm:max-h-[calc(100vh-120px)] overflow-y-auto py-2 scroll-smooth">
          {displayGroups.length === 0 && query.trim() && (
            <div className="py-12 text-center">
              <Search className="w-8 h-8 text-[#333333] mx-auto mb-3" />
              <p className="text-sm text-[#525252]">
                Aucun resultat pour &laquo;&nbsp;{query}&nbsp;&raquo;
              </p>
            </div>
          )}

          {displayGroups.map((group) => (
            <div key={group.label} className="mb-1">
              {/* Category header */}
              <div className="flex items-center gap-2 px-5 py-2 mt-1">
                <group.icon className="w-3.5 h-3.5 text-[#525252]" />
                <span className="text-[11px] font-semibold uppercase tracking-widest text-[#525252]">
                  {group.label}
                </span>
              </div>

              {/* Items */}
              {group.items.map((item) => {
                runningIndex++;
                const idx = runningIndex;
                const isActive = idx === activeIndex;

                return (
                  <button
                    key={item.id + '-' + idx}
                    data-active={isActive}
                    onClick={() => exec(item)}
                    onMouseEnter={() => setActiveIndex(idx)}
                    className={`
                      w-full flex items-center gap-3 px-5 py-3 text-left transition-all duration-75 group
                      ${
                        isActive
                          ? 'bg-teal-500/10'
                          : 'hover:bg-[#111111]'
                      }
                    `}
                  >
                    <div
                      className={`
                        w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 transition-colors duration-75
                        ${isActive ? 'bg-teal-500/20' : 'bg-[#171717]'}
                      `}
                    >
                      <item.icon
                        className={`w-4 h-4 transition-colors duration-75 ${
                          isActive ? 'text-teal-400' : 'text-[#737373]'
                        }`}
                      />
                    </div>
                    <span
                      className={`flex-1 truncate text-sm transition-colors duration-75 ${
                        isActive ? 'text-white' : 'text-[#A3A3A3]'
                      }`}
                    >
                      {item.name}
                    </span>
                    {item.shortcut && (
                      <span className="ml-auto flex items-center gap-1 flex-shrink-0">
                        {item.shortcut.split('+').map((k, ki) => (
                          <kbd
                            key={ki}
                            className={`
                              inline-flex items-center justify-center min-w-[24px] px-1.5 py-0.5
                              text-[10px] font-medium rounded-md
                              ${isActive
                                ? 'text-teal-300 bg-teal-500/15 border border-teal-500/20'
                                : 'text-[#525252] bg-[#171717] border border-[#262626]'
                              }
                            `}
                          >
                            {k === 'Ctrl' ? modKey : k}
                          </kbd>
                        ))}
                      </span>
                    )}
                    {isActive && !item.shortcut && (
                      <ArrowRight className="w-3.5 h-3.5 text-teal-400/60 flex-shrink-0" />
                    )}
                  </button>
                );
              })}
            </div>
          ))}
        </div>

        {/* Footer hints */}
        <div className="flex items-center gap-5 px-5 py-3 border-t border-[#1A1A1A] text-[11px] text-[#525252]">
          <span className="flex items-center gap-1.5">
            <kbd className="px-1.5 py-0.5 bg-[#171717] border border-[#262626] rounded-md text-[#525252] text-[10px]">
              {'\u2191\u2193'}
            </kbd>
            naviguer
          </span>
          <span className="flex items-center gap-1.5">
            <kbd className="px-1.5 py-0.5 bg-[#171717] border border-[#262626] rounded-md text-[#525252] text-[10px]">
              {'\u23CE'}
            </kbd>
            ouvrir
          </span>
          <span className="flex items-center gap-1.5">
            <kbd className="px-1.5 py-0.5 bg-[#171717] border border-[#262626] rounded-md text-[#525252] text-[10px]">
              esc
            </kbd>
            fermer
          </span>
          <span className="flex items-center gap-1.5">
            <kbd className="px-1.5 py-0.5 bg-[#171717] border border-[#262626] rounded-md text-[#525252] text-[10px]">
              ?
            </kbd>
            raccourcis
          </span>
          <span className="ml-auto flex items-center gap-1.5 text-[#525252]">
            <Command className="w-3 h-3" />
            <span className="text-[10px] font-medium">K</span>
          </span>
        </div>
      </div>

      {/* Keyframe animations */}
      <style>{`
        @keyframes cpFadeIn {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
        @keyframes cpSlideDown {
          from { opacity: 0; transform: translateY(-16px) scale(0.97); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }
      `}</style>
    </div>
  );
}
