import { useState, useEffect, useRef, lazy, Suspense, useCallback } from 'react';
import { Routes, Route, NavLink, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { ChefHat, ShoppingBasket, ClipboardList, BarChart3, Sun, Moon, LogOut, Menu, X, Truck, BookOpen, Settings, Users, Download, Package, FileSearch, Scale, Receipt, TrendingUp, Target, ShoppingCart, CreditCard, CalendarDays, MessageSquare, Building2, ChevronDown, Check, Store, Trash2, QrCode, Loader2, Plug, PartyPopper, FileText, Calculator, Contact, ShieldCheck, Sparkles, Newspaper, Bell, AlertTriangle, Keyboard, Search } from 'lucide-react';
import ErrorBoundary from './components/ErrorBoundary';
import ConnectivityBar from './components/ConnectivityBar';
import OfflineSyncBar from './components/OfflineSyncBar';
import ChatbotAssistant from './components/ChatbotAssistant';
import KitchenTimer from './components/KitchenTimer';
import CookieBanner from './components/CookieBanner';
import Breadcrumbs from './components/Breadcrumbs';
import CommandPalette from './components/CommandPalette';
import AlertsBell from './components/AlertsBell';
import ShortcutsModal from './components/ShortcutsModal';
import { AuthProvider, useAuth } from './hooks/useAuth';
import { ToastProvider } from './hooks/useToast';
import { RestaurantProvider, useRestaurant } from './hooks/useRestaurant';
import { getToken } from './services/api';

// Auto-retry lazy imports on chunk load failure (stale deploy)
function lazyRetry(importFn: () => Promise<any>) {
  return lazy(() => importFn().catch(() => {
    // Chunk failed — new deploy changed hashes. Force full page reload.
    // Use timestamp to allow multiple retries (not just once per session)
    const key = 'chunk-retry-ts';
    const last = parseInt(sessionStorage.getItem(key) || '0');
    const now = Date.now();
    // Allow reload if last retry was more than 5 seconds ago (prevents infinite loop)
    if (now - last > 5000) {
      sessionStorage.setItem(key, String(now));
      window.location.reload();
    }
    // If still failing after reload, return a placeholder to prevent crash
    return { default: () => {
      window.location.reload();
      return null;
    } } as any;
  }));
}

// Critical pages loaded eagerly (first pages users see)
import Login from './pages/Login';
import Landing from './pages/Landing';
import StationLanding from './pages/StationLanding';
import PublicMenu from './pages/PublicMenu';
import NotFound from './pages/NotFound';

// Lazy-loaded pages for code splitting
const Dashboard = lazyRetry(() => import('./pages/Dashboard'));
const Ingredients = lazyRetry(() => import('./pages/Ingredients'));
const Recipes = lazyRetry(() => import('./pages/Recipes'));
const RecipeDetail = lazyRetry(() => import('./pages/RecipeDetail'));
const Suppliers = lazyRetry(() => import('./pages/Suppliers'));
const FournisseurPromo = lazyRetry(() => import('./pages/FournisseurPromo'));
const Inventory = lazyRetry(() => import('./pages/Inventory'));
const RFQPage = lazyRetry(() => import('./pages/RFQ'));
const MenuBuilder = lazyRetry(() => import('./pages/MenuBuilder'));
const SettingsPage = lazyRetry(() => import('./pages/Settings'));
const UserManagement = lazyRetry(() => import('./pages/UserManagement'));
const WeighStation = lazyRetry(() => import('./pages/WeighStation'));
const InvoiceScanner = lazyRetry(() => import('./pages/InvoiceScanner'));
const Mercuriale = lazyRetry(() => import('./pages/Mercuriale'));
const MenuEngineering = lazyRetry(() => import('./pages/MenuEngineering'));
const AutoOrders = lazyRetry(() => import('./pages/AutoOrders'));
const Subscription = lazyRetry(() => import('./pages/Subscription'));
const Planning = lazyRetry(() => import('./pages/Planning'));
const Messagerie = lazyRetry(() => import('./pages/Messagerie'));
const Restaurants = lazyRetry(() => import('./pages/Restaurants'));
const Marketplace = lazyRetry(() => import('./pages/Marketplace'));
const WasteTracker = lazyRetry(() => import('./pages/WasteTracker'));
const QRMenu = lazyRetry(() => import('./pages/QRMenu'));
const Integrations = lazyRetry(() => import('./pages/Integrations'));
const Seminaires = lazyRetry(() => import('./pages/Seminaires'));
const DevisPage = lazyRetry(() => import('./pages/Devis'));
const Comptabilite = lazyRetry(() => import('./pages/Comptabilite'));
const Clients = lazyRetry(() => import('./pages/Clients'));
const DevCorp = lazyRetry(() => import('./pages/DevCorp'));
const HACCPPage = lazyRetry(() => import('./pages/HACCP'));
const AIAssistant = lazyRetry(() => import('./pages/AIAssistant'));
const Actualites = lazyRetry(() => import('./pages/Actualites'));
const MentionsLegales = lazyRetry(() => import('./pages/MentionsLegales'));
const CGV = lazyRetry(() => import('./pages/CGV'));
const PolitiqueConfidentialite = lazyRetry(() => import('./pages/PolitiqueConfidentialite'));
const CGU = lazyRetry(() => import('./pages/CGU'));
const Pricing = lazyRetry(() => import('./pages/Pricing'));
const ResetPassword = lazyRetry(() => import('./pages/ResetPassword'));
const FoodCostCalculator = lazyRetry(() => import('./pages/FoodCostCalculator'));
const BlogCalcMarge = lazyRetry(() => import('./pages/BlogCalcMarge'));
const QRCodeGenerator = lazyRetry(() => import('./pages/QRCodeGenerator'));
const KitchenMode = lazyRetry(() => import('./pages/KitchenMode'));
const EditorialRecipes = lazyRetry(() => import('./pages/EditorialRecipes'));

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center text-[#9CA3AF] dark:text-[#737373]">Chargement...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
}


function SidebarRestaurantSelector() {
  const { restaurants, selectedRestaurant, switchRestaurant } = useRestaurant();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  if (!selectedRestaurant) return null;

  return (
    <div ref={ref} className="relative px-3 mb-4">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg bg-[#F3F4F6] dark:bg-[#171717] hover:bg-[#E5E7EB] dark:hover:bg-[#1A1A1A] text-[#111111] dark:text-white text-sm font-medium transition-colors border border-[#E5E7EB] dark:border-[#1A1A1A]"
      >
        <Building2 className="w-4 h-4 flex-shrink-0 text-teal-400" />
        <span className="truncate flex-1 text-left sidebar-label">{selectedRestaurant.name}</span>
        <ChevronDown className={`w-3.5 h-3.5 flex-shrink-0 transition-transform sidebar-label ${open ? 'rotate-180' : ''}`} />
      </button>
      {open && (
        <div className="absolute left-3 right-3 top-full mt-1 bg-white dark:bg-[#0A0A0A] rounded-lg shadow-xl border border-[#E5E7EB] dark:border-[#1A1A1A] z-50 py-1">
          {restaurants.map((r) => (
            <button
              key={r.id}
              onClick={() => { switchRestaurant(r.id); setOpen(false); }}
              className={`w-full flex items-center gap-3 px-3 py-2.5 text-left text-sm transition-colors ${
                r.id === selectedRestaurant.id
                  ? 'bg-[#F3F4F6] dark:bg-[#171717] text-[#111111] dark:text-white font-semibold'
                  : 'text-[#6B7280] dark:text-[#A3A3A3] hover:bg-[#F3F4F6] dark:hover:bg-[#171717]'
              }`}
            >
              <Building2 className="w-4 h-4 flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <div className="font-medium truncate">{r.name}</div>
                <div className="text-xs text-[#9CA3AF] dark:text-[#737373] truncate">{r.cuisineType || ''}</div>
              </div>
              {r.id === selectedRestaurant.id && <Check className="w-4 h-4 text-[#111111] dark:text-white flex-shrink-0" />}
            </button>
          ))}
          <div className="border-t border-[#E5E7EB] dark:border-[#1A1A1A] mt-1 pt-1">
            <NavLink
              to="/restaurants"
              onClick={() => setOpen(false)}
              className="flex items-center gap-3 px-3 py-2 text-sm text-[#6B7280] dark:text-[#737373] hover:bg-[#F3F4F6] dark:hover:bg-[#171717] transition-colors"
            >
              <Settings className="w-4 h-4" />
              Gerer les restaurants
            </NavLink>
          </div>
        </div>
      )}
    </div>
  );
}

// Nav section type
interface NavItem {
  to: string;
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  badge?: number;
  badgeText?: string;
  disabled?: boolean;
}

interface NavSection {
  title: string;
  items: NavItem[];
}

interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}


// Global Search Modal (Ctrl+K)
interface SearchResult {
  id: string;
  name: string;
  category: 'recettes' | 'ingredients' | 'fournisseurs' | 'pages';
  path: string;
  icon: React.ComponentType<{ className?: string }>;
}

function GlobalSearch() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const [recipes, setRecipes] = useState<any[]>([]);
  const [ingredients, setIngredients] = useState<any[]>([]);
  const [suppliers, setSuppliers] = useState<any[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  const pages: SearchResult[] = [
    { id: 'p-dashboard', name: 'Tableau de bord', category: 'pages', path: '/dashboard', icon: BarChart3 },
    { id: 'p-menu', name: 'La Carte', category: 'pages', path: '/menu', icon: BookOpen },
    { id: 'p-ingredients', name: 'Ingredients', category: 'pages', path: '/ingredients', icon: ShoppingBasket },
    { id: 'p-recipes', name: 'Fiches techniques', category: 'pages', path: '/recipes', icon: ClipboardList },
    { id: 'p-inventory', name: 'Inventaire', category: 'pages', path: '/inventory', icon: Package },
    { id: 'p-suppliers', name: 'Fournisseurs', category: 'pages', path: '/suppliers', icon: Truck },
    { id: 'p-scanner', name: 'Factures', category: 'pages', path: '/scanner-factures', icon: Receipt },
    { id: 'p-mercuriale', name: 'Mercuriale', category: 'pages', path: '/mercuriale', icon: TrendingUp },
    { id: 'p-engineering', name: 'Menu Engineering', category: 'pages', path: '/menu-engineering', icon: Target },
    { id: 'p-commandes', name: 'Commandes', category: 'pages', path: '/commandes', icon: ShoppingCart },
    { id: 'p-planning', name: 'Planning', category: 'pages', path: '/planning', icon: CalendarDays },
    { id: 'p-messagerie', name: 'Messages', category: 'pages', path: '/messagerie', icon: MessageSquare },
    { id: 'p-clients', name: 'Clients CRM', category: 'pages', path: '/clients', icon: Contact },
    { id: 'p-comptabilite', name: 'Comptabilite', category: 'pages', path: '/comptabilite', icon: Calculator },
    { id: 'p-devis', name: 'Devis & Factures', category: 'pages', path: '/devis', icon: FileText },
    { id: 'p-marketplace', name: 'Marketplace', category: 'pages', path: '/marketplace', icon: Store },
    { id: 'p-settings', name: 'Parametres', category: 'pages', path: '/settings', icon: Settings },
    { id: 'p-gaspillage', name: 'Gaspillage', category: 'pages', path: '/gaspillage', icon: Trash2 },
    { id: 'p-haccp', name: 'HACCP', category: 'pages', path: '/haccp', icon: ShieldCheck },
    { id: 'p-assistant', name: 'Assistant IA', category: 'pages', path: '/assistant', icon: Sparkles },
    { id: 'p-seminaires', name: 'Seminaires', category: 'pages', path: '/seminaires', icon: PartyPopper },
    { id: 'p-qr', name: 'Menu QR Code', category: 'pages', path: '/qr-menu', icon: QrCode },
    { id: 'p-abonnement', name: 'Mon abonnement', category: 'pages', path: '/abonnement', icon: CreditCard },
    { id: 'p-station', name: 'Station Balance', category: 'pages', path: '/station', icon: Scale },
  ];

  // Fetch data on open
  useEffect(() => {
    if (!open) return;
    const token = getToken();
    if (!token) return;
    const headers = { Authorization: `Bearer ${token}` };
    setLoading(true);
    Promise.all([
      fetch('/api/recipes', { headers }).then(r => r.ok ? r.json() : []).catch(() => []),
      fetch('/api/ingredients', { headers }).then(r => r.ok ? r.json() : []).catch(() => []),
      fetch('/api/suppliers', { headers }).then(r => r.ok ? r.json() : []).catch(() => []),
    ]).then(([rec, ing, sup]) => {
      setRecipes(Array.isArray(rec) ? rec : []);
      setIngredients(Array.isArray(ing) ? ing : []);
      setSuppliers(Array.isArray(sup) ? sup : []);
      setLoading(false);
    });
  }, [open]);

  // Filter results
  useEffect(() => {
    if (!query.trim()) { setResults([]); setActiveIndex(0); return; }
    const q = query.toLowerCase().trim();
    const matched: SearchResult[] = [];
    recipes.filter(r => r.name?.toLowerCase().includes(q)).slice(0, 5).forEach(r => {
      matched.push({ id: 'r-' + r.id, name: r.name, category: 'recettes', path: '/recipes/' + r.id, icon: ClipboardList });
    });
    ingredients.filter(i => i.name?.toLowerCase().includes(q)).slice(0, 5).forEach(i => {
      matched.push({ id: 'i-' + i.id, name: i.name, category: 'ingredients', path: '/ingredients', icon: ShoppingBasket });
    });
    suppliers.filter(s => (s.name || s.company)?.toLowerCase().includes(q)).slice(0, 5).forEach(s => {
      matched.push({ id: 's-' + s.id, name: s.name || s.company, category: 'fournisseurs', path: '/suppliers', icon: Truck });
    });
    pages.filter(p => p.name.toLowerCase().includes(q)).forEach(p => matched.push(p));
    setResults(matched);
    setActiveIndex(0);
  }, [query, recipes, ingredients, suppliers]);

  // Ctrl+Shift+K shortcut (Ctrl+K now opens CommandPalette)
  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.shiftKey && e.key === 'K') {
        e.preventDefault();
        setOpen(prev => !prev);
      }
    }
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, []);

  // Focus input on open
  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 50);
      setQuery('');
      setResults([]);
    }
  }, [open]);

  const handleSelect = useCallback((result: SearchResult) => {
    setOpen(false);
    navigate(result.path);
  }, [navigate]);

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'ArrowDown') { e.preventDefault(); setActiveIndex(i => Math.min(i + 1, results.length - 1)); }
    else if (e.key === 'ArrowUp') { e.preventDefault(); setActiveIndex(i => Math.max(i - 1, 0)); }
    else if (e.key === 'Enter' && results[activeIndex]) { handleSelect(results[activeIndex]); }
    else if (e.key === 'Escape') { setOpen(false); }
  }

  const categoryLabels: Record<string, string> = {
    recettes: 'Recettes',
    ingredients: 'Ingredients',
    fournisseurs: 'Fournisseurs',
    pages: 'Pages',
  };

  const grouped = results.reduce<Record<string, SearchResult[]>>((acc, r) => {
    if (!acc[r.category]) acc[r.category] = [];
    acc[r.category].push(r);
    return acc;
  }, {});

  if (!open) return null;

  let flatIndex = -1;

  return (
    <div className="fixed inset-0 z-[100] flex items-start justify-center pt-[15vh]" onClick={() => setOpen(false)}>
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
      <div
        className="relative w-full max-w-lg mx-4 rounded-2xl border border-white/10 bg-[#0f172a]/80 backdrop-blur-xl shadow-2xl shadow-black/40 overflow-hidden"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center gap-3 px-4 py-3 border-b border-white/5">
          <Search className="w-5 h-5 text-[#94a3b8] flex-shrink-0" />
          <input
            ref={inputRef}
            value={query}
            onChange={e => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Rechercher recettes, ingredients, fournisseurs, pages..."
            className="flex-1 bg-transparent text-white placeholder-[#64748b] text-sm outline-none"
            autoComplete="off"
          />
          <kbd className="hidden sm:inline-flex items-center gap-1 px-1.5 py-0.5 text-[10px] font-medium text-[#64748b] bg-[#1e293b] border border-[#334155] rounded">ESC</kbd>
        </div>
        <div className="max-h-[50vh] overflow-y-auto py-2">
          {loading && (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="w-5 h-5 animate-spin text-teal-400" />
            </div>
          )}
          {!loading && query && results.length === 0 && (
            <div className="text-center py-8 text-sm text-[#64748b]">Aucun resultat pour &laquo; {query} &raquo;</div>
          )}
          {!loading && !query && (
            <div className="text-center py-8 text-sm text-[#64748b]">Tapez pour rechercher...</div>
          )}
          {!loading && Object.keys(grouped).map(cat => (
            <div key={cat}>
              <div className="px-4 py-1.5 text-[10px] font-semibold tracking-wider text-[#64748b] uppercase">{categoryLabels[cat] || cat}</div>
              {grouped[cat].map(result => {
                flatIndex++;
                const idx = flatIndex;
                return (
                  <button
                    key={result.id}
                    onClick={() => handleSelect(result)}
                    onMouseEnter={() => setActiveIndex(idx)}
                    className={`w-full flex items-center gap-3 px-4 py-2.5 text-left text-sm transition-colors ${
                      idx === activeIndex
                        ? 'bg-teal-500/10 text-teal-300'
                        : 'text-[#cbd5e1] hover:bg-white/5'
                    }`}
                  >
                    <result.icon className="w-4 h-4 flex-shrink-0 text-[#64748b]" />
                    <span className="truncate">{result.name}</span>
                    <span className="ml-auto text-[10px] text-[#475569]">{categoryLabels[result.category]}</span>
                  </button>
                );
              })}
            </div>
          ))}
        </div>
        <div className="flex items-center gap-4 px-4 py-2 border-t border-white/5 text-[10px] text-[#475569]">
          <span className="flex items-center gap-1"><kbd className="px-1 py-0.5 bg-[#1e293b] border border-[#334155] rounded text-[#64748b]">{"\u2191\u2193"}</kbd> naviguer</span>
          <span className="flex items-center gap-1"><kbd className="px-1 py-0.5 bg-[#1e293b] border border-[#334155] rounded text-[#64748b]">{"\u23CE"}</kbd> ouvrir</span>
          <span className="flex items-center gap-1"><kbd className="px-1 py-0.5 bg-[#1e293b] border border-[#334155] rounded text-[#64748b]">esc</kbd> fermer</span>
        </div>
      </div>
    </div>
  );
}

function AppLayout() {
  const { user, logout } = useAuth();
  const { selectedRestaurant } = useRestaurant();
  const [darkMode, setDarkMode] = useState(() => localStorage.getItem('darkMode') === 'true');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [installPrompt, setInstallPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isInstalled, setIsInstalled] = useState(false);
  const [showInstallBanner, setShowInstallBanner] = useState(false);
  const [verificationSent, setVerificationSent] = useState(false);
  const [stockAlerts, setStockAlerts] = useState<{ name: string; quantity: number; unit: string }[]>([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showShortcutsModal, setShowShortcutsModal] = useState(false);
  const notifRef = useRef<HTMLDivElement>(null);
  const notifTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const location = useLocation();
  const navigate = useNavigate();

  async function handleResendVerification() {
    try {
      const token = getToken();
      await fetch('/api/auth/resend-verification', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      });
      setVerificationSent(true);
    } catch {
      // silently fail
    }
  }

  // PWA Install prompt
  useEffect(() => {
    const handler = (e: Event) => {
      e.preventDefault();
      setInstallPrompt(e as BeforeInstallPromptEvent);
      if (!localStorage.getItem('pwa-install-dismissed')) {
        setShowInstallBanner(true);
      }
    };
    window.addEventListener('beforeinstallprompt', handler);
    window.addEventListener('appinstalled', () => {
      setIsInstalled(true);
      setInstallPrompt(null);
      setShowInstallBanner(false);
    });
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setIsInstalled(true);
    }
    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  async function handleInstall() {
    if (!installPrompt) return;
    installPrompt.prompt();
    const result = await installPrompt.userChoice;
    if (result.outcome === 'accepted') {
      setIsInstalled(true);
      setInstallPrompt(null);
      setShowInstallBanner(false);
    }
  }

  function dismissInstallBanner() {
    setShowInstallBanner(false);
    localStorage.setItem('pwa-install-dismissed', '1');
  }

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('darkMode', String(darkMode));
  }, [darkMode]);

  // Close mobile menu on navigation
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  // Fetch low stock alerts
  useEffect(() => {
    async function checkLowStock() {
      try {
        const token = getToken();
        if (!token) return;
        const res = await fetch('/api/ingredients', {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) return;
        const data = await res.json();
        const ingredients = Array.isArray(data) ? data : data.ingredients || [];
        const lowStock = ingredients
          .filter((ing: any) => {
            const qty = ing.currentStock ?? ing.quantity ?? 0;
            const threshold = ing.minimumStock ?? ing.minStock ?? ing.threshold ?? 5;
            return qty > 0 && qty < threshold;
          })
          .slice(0, 5)
          .map((ing: any) => ({
            name: ing.name,
            quantity: ing.currentStock ?? ing.quantity ?? 0,
            unit: ing.unit || 'kg',
          }));
        setStockAlerts(lowStock);
      } catch {
        // silently fail
      }
    }
    checkLowStock();
  }, [selectedRestaurant?.id]);

  // Close notification dropdown on click outside
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setShowNotifications(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Auto-close notifications after 5s
  useEffect(() => {
    if (showNotifications && stockAlerts.length > 0) {
      if (notifTimeoutRef.current) clearTimeout(notifTimeoutRef.current);
      notifTimeoutRef.current = setTimeout(() => setShowNotifications(false), 5000);
    }
    return () => {
      if (notifTimeoutRef.current) clearTimeout(notifTimeoutRef.current);
    };
  }, [showNotifications, stockAlerts.length]);

  // "?" key opens shortcuts modal (only when no input is focused)
  useEffect(() => {
    function handleShortcutKey(e: KeyboardEvent) {
      const tag = (e.target as HTMLElement)?.tagName;
      if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') return;
      if ((e.target as HTMLElement)?.isContentEditable) return;
      if (e.key === '?') {
        e.preventDefault();
        setShowShortcutsModal(prev => !prev);
      }
    }
    window.addEventListener('keydown', handleShortcutKey);
    return () => window.removeEventListener('keydown', handleShortcutKey);
  }, []);

  // Notification bell component (reusable for mobile & desktop)
  const notificationBell = (
    <div ref={notifRef} className="relative">
      <button
        onClick={() => setShowNotifications(!showNotifications)}
        className="relative p-2 rounded-lg hover:bg-[#334155]/50 text-[#94a3b8] hover:text-white transition-colors"
        aria-label={`Notifications${stockAlerts.length > 0 ? ` (${stockAlerts.length} alertes)` : ''}`}
      >
        <Bell className="w-5 h-5" />
        {stockAlerts.length > 0 && (
          <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] flex items-center justify-center text-[10px] font-bold bg-red-500 text-white rounded-full px-1 animate-pulse">
            {stockAlerts.length}
          </span>
        )}
      </button>
      {showNotifications && stockAlerts.length > 0 && (
        <div className="absolute right-0 top-full mt-2 w-80 bg-[#0f172a] border border-[#334155] rounded-xl shadow-2xl shadow-black/40 z-50 overflow-hidden">
          <div className="px-4 py-3 border-b border-[#334155]/50 flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-400" />
            <span className="text-sm font-semibold text-white">Alertes stock</span>
            <span className="ml-auto text-[10px] font-bold bg-red-500/20 text-red-400 px-2 py-0.5 rounded-full">
              {stockAlerts.length}
            </span>
          </div>
          <div className="max-h-64 overflow-y-auto">
            {stockAlerts.map((alert, i) => (
              <div
                key={i}
                className="px-4 py-3 flex items-start gap-3 hover:bg-[#1e293b]/50 transition-colors border-b border-[#1e293b]/50 last:border-b-0"
              >
                <div className="w-8 h-8 rounded-lg bg-amber-500/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Package className="w-4 h-4 text-amber-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-white font-medium">Stock bas: {alert.name}</p>
                  <p className="text-xs text-[#94a3b8] mt-0.5">
                    {alert.quantity}{alert.unit} restant{alert.quantity > 1 ? 's' : ''}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );

  // Grouped navigation sections
  const navSections: NavSection[] = [
    {
      title: 'PRINCIPAL',
      items: [
        { to: '/dashboard', icon: BarChart3, label: 'Tableau de bord' },
        { to: '/menu', icon: BookOpen, label: 'La Carte' },
        { to: '/qr-menu', icon: QrCode, label: 'Menu QR Code' },
      ],
    },
    {
      title: 'GESTION',
      items: [
        { to: '/ingredients', icon: ShoppingBasket, label: 'Ingredients' },
        { to: '/recipes', icon: ClipboardList, label: 'Fiches techniques' },
        { to: '/inventory', icon: Package, label: 'Inventaire' },
        { to: '/suppliers', icon: Truck, label: 'Fournisseurs' },
        { to: '/gaspillage', icon: Trash2, label: 'Gaspillage' },
      ],
    },
    {
      title: 'INTELLIGENCE',
      items: [
        { to: '/scanner-factures', icon: Receipt, label: 'Factures' },
        { to: '/actualites', icon: Newspaper, label: 'Actualités IA' },
        { to: '/mercuriale', icon: TrendingUp, label: 'Mercuriale' },
        { to: '/menu-engineering', icon: Target, label: 'Menu Engineering' },
        { to: '/recettes-semaine', icon: ChefHat, label: 'Recettes semaine' },
        { to: '/assistant', icon: Sparkles, label: 'Assistant IA' },
      ],
    },
    {
      title: 'OPERATIONS',
      items: [
        { to: '/commandes', icon: ShoppingCart, label: 'Commandes' },
        { to: '/planning', icon: CalendarDays, label: 'Planning' },
        { to: '/seminaires', icon: PartyPopper, label: 'Séminaires' },
        { to: '/rfqs', icon: FileSearch, label: "Appels d'offres" },
        { to: '/haccp', icon: ShieldCheck, label: 'HACCP' },
      ],
    },
    {
      title: 'COMMUNICATION',
      items: [
        { to: '/messagerie', icon: MessageSquare, label: 'Messages' },
        { to: '/clients', icon: Contact, label: 'Clients CRM' },
      ],
    },
    {
      title: 'BUSINESS',
      items: [
        { to: '/comptabilite', icon: Calculator, label: 'Comptabilité' },
        { to: '/devis', icon: FileText, label: 'Devis & Factures' },
        { to: '/marketplace', icon: Store, label: 'Marketplace' },
        { to: '/integrations', icon: Plug, label: 'Integrations', badgeText: 'Bientôt', disabled: true },
        { to: '/restaurants', icon: Building2, label: 'Restaurants' },
        { to: '/abonnement', icon: CreditCard, label: 'Mon abonnement' },
      ],
    },
  ];

  // Bottom nav items (always visible at bottom of sidebar)
  const bottomNavItems: NavItem[] = [
    ...(user?.role === 'admin' ? [{ to: '/users', icon: Users, label: 'Utilisateurs' }] : []),
    { to: '/settings', icon: Settings, label: 'Paramètres' },
  ];

  // Get user initials for avatar
  const userInitials = (user?.name || user?.email || 'U')
    .split(' ')
    .map((n: string) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  const renderNavItem = (item: NavItem, collapsed = false) => {
    if (item.disabled) {
      return (
        <button
          key={item.to}
          type="button"
          title={collapsed ? item.label : 'Cette fonctionnalité sera disponible prochainement'}
          onClick={() => alert('Cette fonctionnalité sera disponible prochainement')}
          className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 group w-full opacity-50 cursor-not-allowed ${
            collapsed ? 'justify-center' : ''
          } text-[#9CA3AF] dark:text-[#737373]`}
        >
          <span className="relative flex-shrink-0">
            <item.icon className="w-5 h-5" />
          </span>
          {!collapsed && (
            <>
              <span className="sidebar-label truncate">{item.label}</span>
              {item.badgeText && (
                <span className="ml-auto text-[9px] font-semibold uppercase tracking-wide bg-[#E5E7EB] text-[#6B7280] dark:bg-[#1A1A1A] dark:text-[#737373] px-1.5 py-0.5 rounded-full whitespace-nowrap">
                  {item.badgeText}
                </span>
              )}
            </>
          )}
        </button>
      );
    }

    return (
      <NavLink
        key={item.to}
        to={item.to}
        end={item.to === '/dashboard'}
        title={collapsed ? item.label : undefined}
        className={({ isActive }) =>
          `flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 group ${
            collapsed ? 'justify-center' : ''
          } ${
            isActive
              ? 'bg-[#111111] text-white dark:bg-white dark:text-[#000000] border-l-[2px] border-[#111111] dark:border-white pl-[10px]'
              : 'text-[#6B7280] dark:text-[#737373] hover:bg-[#F3F4F6] dark:hover:bg-[#171717] hover:text-[#111111] dark:hover:text-white hover:translate-x-0.5'
          }`
        }
      >
        <span className="relative flex-shrink-0">
          <item.icon className="w-5 h-5" />
          {item.badge && item.badge > 0 && (
            <span className="absolute -top-1.5 -right-2.5 px-1 min-w-[18px] h-[18px] flex items-center justify-center text-[10px] font-bold bg-red-500 text-white rounded-full">
              {item.badge}
            </span>
          )}
        </span>
        {!collapsed && <span className="sidebar-label truncate">{item.label}</span>}
      </NavLink>
    );
  };

  // Sidebar content (shared between desktop and mobile)
  const sidebarContent = (collapsed = false) => (
    <div className="flex flex-col h-full">
      {/* Accent line */}
      <div className="h-[1px] bg-[#E5E7EB] dark:bg-[#1A1A1A]" />

      {/* Logo */}
      <div className={`flex items-center gap-3 px-4 py-5 border-b border-[#E5E7EB] dark:border-[#1A1A1A] ${collapsed ? 'justify-center px-2' : ''}`}>
        <ChefHat className="w-8 h-8 text-[#111111] dark:text-white flex-shrink-0" />
        {!collapsed && <span className="text-lg font-bold text-[#111111] dark:text-white sidebar-label font-satoshi tracking-tight flex-1">RestauMargin</span>}
        <AlertsBell />
        {!collapsed && notificationBell}
      </div>

      {/* Restaurant selector */}
      {!collapsed && (
        <div className="pt-4">
          <SidebarRestaurantSelector />
        </div>
      )}

      {/* Station Balance button */}
      <div className={`px-3 mb-3 ${collapsed ? 'mt-4' : ''}`}>
        <NavLink
          to="/station"
          title={collapsed ? 'Station Balance' : undefined}
          className={`flex items-center gap-2.5 px-3 py-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-semibold transition-colors w-full ${collapsed ? 'justify-center' : ''}`}
        >
          <Scale className="w-5 h-5 flex-shrink-0" />
          {!collapsed && <span className="sidebar-label">Station Balance</span>}
        </NavLink>
      </div>

      {/* Nav sections - scrollable area */}
      <nav aria-label="Navigation principale" className="flex-1 overflow-y-auto px-3 space-y-1.5 pb-4 sidebar-scroll">
        {navSections.map((section, idx) => (
          <div key={section.title} className={idx > 0 ? 'pt-4' : ''}>
            {!collapsed && idx > 0 && <div className="border-t border-[#E5E7EB] dark:border-[#1A1A1A] mb-3" />}
            {!collapsed && (
              <div className="px-3 py-1.5 text-[9px] font-semibold tracking-[0.18em] text-[#9CA3AF] dark:text-[#737373] uppercase sidebar-label font-satoshi">
                {section.title}
              </div>
            )}
            {collapsed && <div className="border-t border-[#E5E7EB] dark:border-[#1A1A1A] my-2" />}
            <div className="space-y-0.5">
              {section.items.map((item) => renderNavItem(item, collapsed))}
            </div>
          </div>
        ))}
      </nav>

      {/* Bottom section */}
      <div className="border-t border-[#E5E7EB] dark:border-[#1A1A1A] px-3 py-3 space-y-1">
        {/* Bottom nav items */}
        {bottomNavItems.map((item) => renderNavItem(item, collapsed))}

        {/* Dark mode toggle */}
        <button
          onClick={() => setDarkMode(!darkMode)}
          title={darkMode ? 'Mode clair' : 'Mode sombre'}
          aria-label={darkMode ? 'Activer le mode clair' : 'Activer le mode sombre'}
          className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-[#6B7280] dark:text-[#737373] hover:bg-[#F3F4F6] dark:hover:bg-[#171717] hover:text-[#111111] dark:hover:text-white transition-colors w-full ${collapsed ? 'justify-center' : ''}`}
        >
          {darkMode ? <Sun className="w-5 h-5 flex-shrink-0" /> : <Moon className="w-5 h-5 flex-shrink-0" />}
          {!collapsed && <span className="sidebar-label">{darkMode ? 'Mode clair' : 'Mode sombre'}</span>}
        </button>

        {/* Install PWA button */}
        {installPrompt && !isInstalled && (
          <button
            onClick={handleInstall}
            className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-semibold bg-[#111111] dark:bg-white text-white dark:text-black hover:bg-[#333333] dark:hover:bg-[#E5E5E5] transition-colors w-full ${collapsed ? 'justify-center' : ''}`}
            title="Installer l'application"
          >
            <Download className="w-5 h-5 flex-shrink-0" />
            {!collapsed && <span className="sidebar-label">Installer l'app</span>}
          </button>
        )}

        {/* User profile */}
        <div className={`flex items-center gap-3 px-3 py-3 mt-3 rounded-xl bg-[#F3F4F6] dark:bg-[#171717] border border-[#E5E7EB] dark:border-[#1A1A1A] ${collapsed ? 'justify-center' : ''}`}>
          <div className="w-10 h-10 rounded-full bg-[#111111] dark:bg-white flex items-center justify-center text-white dark:text-black text-sm font-bold flex-shrink-0">
            {userInitials}
          </div>
          {!collapsed && (
            <div className="flex-1 min-w-0 sidebar-label">
              <div className="text-sm font-semibold text-[#111111] dark:text-white truncate">{user?.name || user?.email}</div>
              <div className="text-[11px] text-[#9CA3AF] dark:text-[#737373] truncate">
                {user?.role === 'admin' ? 'Administrateur' : 'Utilisateur'}
              </div>
            </div>
          )}
          <button
            onClick={logout}
            title="Deconnexion"
            aria-label="Déconnexion"
            className="p-1.5 rounded-lg hover:bg-red-500/10 text-[#9CA3AF] dark:text-[#737373] hover:text-red-400 transition-all duration-200 flex-shrink-0"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen flex bg-white dark:bg-black text-[#111111] dark:text-white">
      <a href="#main-content" className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:bg-teal-600 focus:text-white focus:px-4 focus:py-2 focus:rounded-lg">
        Aller au contenu principal
      </a>
      {/* Desktop sidebar (>= 1024px): full width */}
      <aside className="hidden lg:flex flex-col fixed inset-y-0 left-0 w-56 bg-[#FAFAFA] border-r border-[#E5E7EB] dark:bg-[#0A0A0A] dark:border-r dark:border-[#1A1A1A] z-30 no-print">
        {sidebarContent(false)}
      </aside>

      {/* Tablet sidebar (768-1024px): icons only */}
      <aside className="hidden md:flex lg:hidden flex-col fixed inset-y-0 left-0 w-16 bg-[#FAFAFA] border-r border-[#E5E7EB] dark:bg-[#0A0A0A] dark:border-r dark:border-[#1A1A1A] z-30 no-print">
        {sidebarContent(true)}
      </aside>

      {/* Mobile overlay sidebar */}
      {mobileMenuOpen && (
        <>
          {/* Backdrop */}
          <div
            className="md:hidden fixed inset-0 bg-black/50 z-40"
            onClick={() => setMobileMenuOpen(false)}
          />
          {/* Sidebar panel */}
          <aside className="md:hidden fixed inset-y-0 left-0 w-72 bg-[#FAFAFA] border-r border-[#E5E7EB] dark:bg-[#0A0A0A] dark:border-r dark:border-[#1A1A1A] z-50 no-print animate-slide-in">
            <button
              onClick={() => setMobileMenuOpen(false)}
              aria-label="Fermer le menu"
              className="absolute top-4 right-3 p-1.5 rounded-lg hover:bg-[#F3F4F6] dark:hover:bg-[#171717] text-[#9CA3AF] dark:text-[#737373] hover:text-[#111111] dark:hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
            {sidebarContent(false)}
          </aside>
        </>
      )}

      {/* Main content area */}
      <div className="flex-1 flex flex-col min-h-screen lg:ml-56 md:ml-16 ml-0">
        {/* Mobile top bar */}
        <header className="md:hidden bg-white dark:bg-[#0A0A0A] border-b border-[#E5E7EB] dark:border-[#1A1A1A] px-4 py-3 flex items-center justify-between no-print">
          <button
            onClick={() => setMobileMenuOpen(true)}
            aria-label="Ouvrir le menu"
            className="p-2 rounded-lg hover:bg-[#F3F4F6] dark:hover:bg-[#171717] transition-colors"
          >
            <Menu className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-2">
            <ChefHat className="w-6 h-6 text-[#111111] dark:text-white" />
            <span className="font-bold text-[#111111] dark:text-white">RestauMargin</span>
          </div>
          <div className="flex items-center gap-1">
              <button onClick={() => { const e = new KeyboardEvent("keydown", { key: "k", ctrlKey: true }); window.dispatchEvent(e); }} aria-label="Rechercher" className="p-2 rounded-lg hover:bg-[#F3F4F6] dark:hover:bg-[#171717] transition-colors"><Search className="w-5 h-5 text-[#6B7280] dark:text-[#737373]" /></button>
              <AlertsBell />
              {notificationBell}
            </div>
        </header>

        {/* Connectivity status bar */}
        <ConnectivityBar />

        {/* Offline sync bar — shows pending actions & sync status */}
        <OfflineSyncBar />

        {/* PWA Install banner — platform-specific */}
        {showInstallBanner && !isInstalled && (() => {
          const ua = navigator.userAgent;
          const isIOS = /iPad|iPhone|iPod/.test(ua) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
          const isAndroid = /Android/.test(ua);
          const isMac = /Macintosh/.test(ua) && navigator.maxTouchPoints <= 1;
          const isWindows = /Windows/.test(ua);

          let message = 'Installez RestauMargin sur votre appareil';
          let buttonText = 'Installer';
          let showButton = true;
          let subMessage = '';

          if (isIOS) {
            message = 'Installer RestauMargin sur votre iPhone/iPad';
            subMessage = 'Appuyez sur le bouton Partager puis "Sur l\'ecran d\'accueil"';
            showButton = false;
          } else if (isAndroid) {
            message = 'Installer l\'app RestauMargin';
            buttonText = 'Installer l\'app';
          } else if (isWindows) {
            message = 'Installer RestauMargin pour Windows';
            buttonText = 'Installer pour Windows';
          } else if (isMac) {
            message = 'Installer RestauMargin pour Mac';
            buttonText = 'Installer pour Mac';
          }

          return (
            <div className="bg-[#111111] dark:bg-[#0A0A0A] border-b border-[#333333] dark:border-[#1A1A1A] text-white px-4 py-3 text-sm">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center flex-shrink-0">
                    <Download className="w-4 h-4 text-black" />
                  </div>
                  <div className="min-w-0">
                    <div className="font-semibold truncate">{message}</div>
                    {subMessage && (
                      <div className="text-xs text-[#A3A3A3] mt-0.5">{subMessage}</div>
                    )}
                    {!subMessage && (
                      <div className="text-xs text-[#A3A3A3] mt-0.5">Acces rapide, fonctionne hors connexion</div>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2 ml-4 flex-shrink-0">
                  {showButton && (
                    <button
                      onClick={handleInstall}
                      className="px-4 py-1.5 bg-white hover:bg-[#E5E5E5] text-black rounded-lg font-semibold text-xs whitespace-nowrap transition-colors"
                    >
                      {buttonText}
                    </button>
                  )}
                  <button
                    onClick={dismissInstallBanner}
                    className="p-1.5 hover:bg-[#333333] rounded-lg transition-colors"
                    aria-label="Fermer"
                  >
                    <X className="w-4 h-4 text-[#A3A3A3]" />
                  </button>
                </div>
              </div>
            </div>
          );
        })()}

        {/* Email verification banner */}
        {user && user.emailVerified === false && (
          <div className="bg-amber-500/10 border-b border-amber-500/30 text-amber-400 px-4 py-2 flex items-center justify-between text-sm">
            <span>Vérifiez votre adresse email pour sécuriser votre compte.</span>
            {verificationSent ? (
              <span className="text-emerald-400 ml-4">Email envoyé !</span>
            ) : (
              <button onClick={handleResendVerification} className="text-amber-300 hover:text-amber-200 underline ml-4 whitespace-nowrap">
                Renvoyer l'email
              </button>
            )}
          </div>
        )}

        {/* Content */}
        <main id="main-content" key={selectedRestaurant?.id ?? 'no-restaurant'} className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 py-6">
          <Breadcrumbs />
          <Suspense fallback={<div className="flex items-center justify-center h-64"><Loader2 className="w-8 h-8 animate-spin text-teal-500" /></div>}>
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/ingredients" element={<Ingredients />} />
              <Route path="/recipes" element={<Recipes />} />
              <Route path="/recipes/:id" element={<RecipeDetail />} />
              <Route path="/menu" element={<MenuBuilder />} />
              <Route path="/suppliers" element={<Suppliers />} />
              <Route path="/inventory" element={<Inventory />} />
              <Route path="/gaspillage" element={<WasteTracker />} />
              <Route path="/rfqs" element={<RFQPage />} />
              <Route path="/scanner-factures" element={<InvoiceScanner />} />
              <Route path="/actualites" element={<Actualites />} />
              <Route path="/mercuriale" element={<Mercuriale />} />
              <Route path="/menu-engineering" element={<MenuEngineering />} />
              <Route path="/qr-menu" element={<QRMenu />} />
              <Route path="/commandes" element={<AutoOrders />} />
              <Route path="/planning" element={<Planning />} />
              <Route path="/seminaires" element={<Seminaires />} />
              <Route path="/haccp" element={<HACCPPage />} />
              <Route path="/recettes-semaine" element={<EditorialRecipes />} />
              <Route path="/assistant" element={<AIAssistant />} />
              <Route path="/messagerie" element={<Messagerie />} />
              <Route path="/clients" element={<Clients />} />
              <Route path="/marketplace" element={<Marketplace />} />
              <Route path="/fournisseur/:id" element={<FournisseurPromo />} />
              <Route path="/integrations" element={<Integrations />} />
              <Route path="/comptabilite" element={<Comptabilite />} />
              <Route path="/devis" element={<DevisPage />} />
              <Route path="/restaurants" element={<Restaurants />} />
              <Route path="/pricing" element={<Pricing />} />
              <Route path="/abonnement" element={<Subscription />} />
              <Route path="/settings" element={<SettingsPage />} />
              <Route path="/users" element={<UserManagement />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
        </main>

        {/* Footer */}
        <footer className="bg-white dark:bg-[#0A0A0A] border-t border-[#E5E7EB] dark:border-[#1A1A1A] py-3 text-center text-xs text-[#9CA3AF] dark:text-[#737373] no-print">
          RestauMargin &copy; {new Date().getFullYear()} &mdash; Gestion de marge pour la restauration
        </footer>
      </div>

      {/* Command Palette (Ctrl+K) & Global Search (Ctrl+Shift+K) */}
      <CommandPalette />
      <GlobalSearch />
      <ShortcutsModal open={showShortcutsModal} onClose={() => setShowShortcutsModal(false)} />
      <ChatbotAssistant />
      {/* Kitchen Timer - floating bottom-left */}
      <KitchenTimer />
    </div>
  );
}

function PublicHome() {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center text-[#9CA3AF] dark:text-[#737373]">Chargement...</div>;
  }

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return <Landing />;
}

function App() {
  return (
    <ErrorBoundary>
    <AuthProvider>
      <ToastProvider>
        <RestaurantProvider>
          <Routes>
            <Route path="/" element={<PublicHome />} />
          <Route path="/landing" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/menu-public" element={<PublicMenu />} />
          <Route path="/station-produit" element={<StationLanding />} />
          <Route path="/dev-corp" element={<Suspense fallback={<div className="min-h-screen bg-[#020617] flex items-center justify-center"><Loader2 className="w-8 h-8 text-blue-500 animate-spin" /></div>}><DevCorp /></Suspense>} />
          <Route path="/mentions-legales" element={<Suspense fallback={<div className="min-h-screen bg-[#020617] flex items-center justify-center"><Loader2 className="w-8 h-8 text-blue-500 animate-spin" /></div>}><MentionsLegales /></Suspense>} />
          <Route path="/cgv" element={<Suspense fallback={<div className="min-h-screen bg-[#020617] flex items-center justify-center"><Loader2 className="w-8 h-8 text-blue-500 animate-spin" /></div>}><CGV /></Suspense>} />
          <Route path="/cgu" element={<Suspense fallback={<div className="min-h-screen bg-[#020617] flex items-center justify-center"><Loader2 className="w-8 h-8 text-blue-500 animate-spin" /></div>}><CGU /></Suspense>} />
          <Route path="/politique-confidentialite" element={<Suspense fallback={<div className="min-h-screen bg-[#020617] flex items-center justify-center"><Loader2 className="w-8 h-8 text-blue-500 animate-spin" /></div>}><PolitiqueConfidentialite /></Suspense>} />
          <Route path="/pricing" element={<Suspense fallback={<div className="min-h-screen bg-[#020617] flex items-center justify-center"><Loader2 className="w-8 h-8 text-blue-500 animate-spin" /></div>}><Pricing /></Suspense>} />
          <Route path="/reset-password" element={<Suspense fallback={<div className="min-h-screen bg-[#020617] flex items-center justify-center"><Loader2 className="w-8 h-8 text-blue-500 animate-spin" /></div>}><ResetPassword /></Suspense>} />
          <Route path="/outils/calculateur-food-cost" element={<Suspense fallback={<div className="min-h-screen bg-[#f8fafb] flex items-center justify-center"><Loader2 className="w-8 h-8 text-teal-500 animate-spin" /></div>}><FoodCostCalculator /></Suspense>} />
          <Route path="/outils/generateur-qr-menu" element={<Suspense fallback={<div className="min-h-screen bg-[#f8fafb] flex items-center justify-center"><Loader2 className="w-8 h-8 text-teal-500 animate-spin" /></div>}><QRCodeGenerator /></Suspense>} />
          <Route path="/blog/calcul-marge-restaurant" element={<Suspense fallback={<div className="min-h-screen bg-white flex items-center justify-center"><Loader2 className="w-8 h-8 text-teal-500 animate-spin" /></div>}><BlogCalcMarge /></Suspense>} />
          <Route
            path="/station"
            element={
              <ProtectedRoute>
                <Suspense fallback={<div className="flex items-center justify-center h-64"><Loader2 className="w-8 h-8 animate-spin text-teal-500" /></div>}>
                  <WeighStation />
                </Suspense>
              </ProtectedRoute>
            }
          />
          <Route
            path="/*"
            element={
              <ProtectedRoute>
                <AppLayout />
              </ProtectedRoute>
            }
          />
          </Routes>
          <CookieBanner />
        </RestaurantProvider>
      </ToastProvider>
    </AuthProvider>
    </ErrorBoundary>
  );
}

export default App;
