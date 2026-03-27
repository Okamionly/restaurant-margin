import { useState, useEffect, useRef, lazy, Suspense } from 'react';
import { Routes, Route, NavLink, Navigate, useLocation } from 'react-router-dom';
import { ChefHat, ShoppingBasket, ClipboardList, BarChart3, Sun, Moon, LogOut, Menu, X, Truck, BookOpen, Settings, Users, Download, Package, FileSearch, Scale, Receipt, TrendingUp, Target, ShoppingCart, CreditCard, CalendarDays, MessageSquare, Building2, ChevronDown, Check, Store, Trash2, QrCode, Loader2 } from 'lucide-react';
import ConnectivityBar from './components/ConnectivityBar';
import ChatbotAssistant from './components/ChatbotAssistant';
import { AuthProvider, useAuth } from './hooks/useAuth';
import { ToastProvider } from './hooks/useToast';
import { RestaurantProvider, useRestaurant } from './hooks/useRestaurant';
// Critical pages loaded eagerly (first pages users see)
import Login from './pages/Login';
import Landing from './pages/Landing';
import PublicMenu from './pages/PublicMenu';
import NotFound from './pages/NotFound';

// Lazy-loaded pages for code splitting
const Dashboard = lazy(() => import('./pages/Dashboard'));
const Ingredients = lazy(() => import('./pages/Ingredients'));
const Recipes = lazy(() => import('./pages/Recipes'));
const RecipeDetail = lazy(() => import('./pages/RecipeDetail'));
const Suppliers = lazy(() => import('./pages/Suppliers'));
const Inventory = lazy(() => import('./pages/Inventory'));
const RFQPage = lazy(() => import('./pages/RFQ'));
const MenuBuilder = lazy(() => import('./pages/MenuBuilder'));
const SettingsPage = lazy(() => import('./pages/Settings'));
const UserManagement = lazy(() => import('./pages/UserManagement'));
const WeighStation = lazy(() => import('./pages/WeighStation'));
const InvoiceScanner = lazy(() => import('./pages/InvoiceScanner'));
const Mercuriale = lazy(() => import('./pages/Mercuriale'));
const MenuEngineering = lazy(() => import('./pages/MenuEngineering'));
const AutoOrders = lazy(() => import('./pages/AutoOrders'));
const Subscription = lazy(() => import('./pages/Subscription'));
const Planning = lazy(() => import('./pages/Planning'));
const Messagerie = lazy(() => import('./pages/Messagerie'));
const Restaurants = lazy(() => import('./pages/Restaurants'));
const Marketplace = lazy(() => import('./pages/Marketplace'));
const WasteTracker = lazy(() => import('./pages/WasteTracker'));
const QRMenu = lazy(() => import('./pages/QRMenu'));

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center text-slate-500 dark:text-slate-400">Chargement...</div>;
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
        className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg bg-slate-800 dark:bg-slate-800 hover:bg-slate-700 text-white text-sm font-medium transition-colors border border-slate-700"
      >
        <Building2 className="w-4 h-4 flex-shrink-0 text-blue-400" />
        <span className="truncate flex-1 text-left sidebar-label">{selectedRestaurant.nom}</span>
        <ChevronDown className={`w-3.5 h-3.5 flex-shrink-0 transition-transform sidebar-label ${open ? 'rotate-180' : ''}`} />
      </button>
      {open && (
        <div className="absolute left-3 right-3 top-full mt-1 bg-white dark:bg-slate-800 rounded-lg shadow-xl border border-slate-200 dark:border-slate-700 z-50 py-1">
          {restaurants.map((r) => (
            <button
              key={r.id}
              onClick={() => { switchRestaurant(r.id); setOpen(false); }}
              className={`w-full flex items-center gap-3 px-3 py-2.5 text-left text-sm transition-colors ${
                r.id === selectedRestaurant.id
                  ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400'
                  : 'text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700'
              }`}
            >
              <Building2 className="w-4 h-4 flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <div className="font-medium truncate">{r.nom}</div>
                <div className="text-xs text-slate-400 dark:text-slate-500 truncate">{r.typeCuisine}</div>
              </div>
              {r.id === selectedRestaurant.id && <Check className="w-4 h-4 text-blue-600 dark:text-blue-400 flex-shrink-0" />}
            </button>
          ))}
          <div className="border-t border-slate-100 dark:border-slate-700 mt-1 pt-1">
            <NavLink
              to="/restaurants"
              onClick={() => setOpen(false)}
              className="flex items-center gap-3 px-3 py-2 text-sm text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
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
}

interface NavSection {
  title: string;
  items: NavItem[];
}

function AppLayout() {
  const { user, logout } = useAuth();
  const [darkMode, setDarkMode] = useState(() => localStorage.getItem('darkMode') === 'true');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [installPrompt, setInstallPrompt] = useState<any>(null);
  const [isInstalled, setIsInstalled] = useState(false);
  const location = useLocation();

  // PWA Install prompt
  useEffect(() => {
    const handler = (e: Event) => {
      e.preventDefault();
      setInstallPrompt(e);
    };
    window.addEventListener('beforeinstallprompt', handler);
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
    }
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
        { to: '/mercuriale', icon: TrendingUp, label: 'Mercuriale' },
        { to: '/menu-engineering', icon: Target, label: 'Menu Engineering' },
      ],
    },
    {
      title: 'OPERATIONS',
      items: [
        { to: '/commandes', icon: ShoppingCart, label: 'Commandes' },
        { to: '/planning', icon: CalendarDays, label: 'Planning' },
        { to: '/rfqs', icon: FileSearch, label: "Appels d'offres" },
      ],
    },
    {
      title: 'COMMUNICATION',
      items: [
        { to: '/messagerie', icon: MessageSquare, label: 'Messages', badge: 3 },
      ],
    },
    {
      title: 'BUSINESS',
      items: [
        { to: '/marketplace', icon: Store, label: 'Marketplace' },
        { to: '/restaurants', icon: Building2, label: 'Restaurants' },
        { to: '/abonnement', icon: CreditCard, label: 'Abonnement' },
      ],
    },
  ];

  // Bottom nav items (always visible at bottom of sidebar)
  const bottomNavItems: NavItem[] = [
    ...(user?.role === 'admin' ? [{ to: '/users', icon: Users, label: 'Utilisateurs' }] : []),
    { to: '/settings', icon: Settings, label: 'Parametres' },
  ];

  // Get user initials for avatar
  const userInitials = (user?.name || user?.email || 'U')
    .split(' ')
    .map((n: string) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  const renderNavItem = (item: NavItem, collapsed = false) => (
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
            ? 'bg-blue-600/20 text-blue-400 border-l-[3px] border-blue-500 pl-[9px]'
            : 'text-slate-400 hover:bg-white/5 hover:text-white hover:translate-x-1 hover:shadow-[inset_0_0_20px_rgba(59,130,246,0.05)]'
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

  // Sidebar content (shared between desktop and mobile)
  const sidebarContent = (collapsed = false) => (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className={`flex items-center gap-3 px-4 py-4 border-b border-slate-700/50 ${collapsed ? 'justify-center px-2' : ''}`}>
        <ChefHat className="w-8 h-8 text-blue-400 flex-shrink-0" />
        {!collapsed && <span className="text-lg font-bold text-white sidebar-label">RestauMargin</span>}
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
      <nav className="flex-1 overflow-y-auto px-3 space-y-1 pb-4 sidebar-scroll">
        {navSections.map((section, idx) => (
          <div key={section.title} className={idx > 0 ? 'pt-3' : ''}>
            {!collapsed && idx > 0 && <div className="border-t border-slate-700/30 mb-3" />}
            {!collapsed && (
              <div className="px-3 py-1.5 text-[9px] font-medium tracking-[0.15em] text-slate-500/70 uppercase sidebar-label">
                {section.title}
              </div>
            )}
            {collapsed && <div className="border-t border-slate-700/50 my-2" />}
            <div className="space-y-0.5">
              {section.items.map((item) => renderNavItem(item, collapsed))}
            </div>
          </div>
        ))}
      </nav>

      {/* Bottom section */}
      <div className="border-t border-slate-700/50 px-3 py-3 space-y-1">
        {/* Bottom nav items */}
        {bottomNavItems.map((item) => renderNavItem(item, collapsed))}

        {/* Dark mode toggle */}
        <button
          onClick={() => setDarkMode(!darkMode)}
          title={darkMode ? 'Mode clair' : 'Mode sombre'}
          className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-slate-300 hover:bg-slate-700/70 hover:text-white transition-colors w-full ${collapsed ? 'justify-center' : ''}`}
        >
          {darkMode ? <Sun className="w-5 h-5 flex-shrink-0" /> : <Moon className="w-5 h-5 flex-shrink-0" />}
          {!collapsed && <span className="sidebar-label">{darkMode ? 'Mode clair' : 'Mode sombre'}</span>}
        </button>

        {/* Install PWA button */}
        {installPrompt && !isInstalled && (
          <button
            onClick={handleInstall}
            className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium bg-green-600 hover:bg-green-500 text-white transition-colors w-full animate-pulse ${collapsed ? 'justify-center' : ''}`}
            title="Installer l'application"
          >
            <Download className="w-5 h-5 flex-shrink-0" />
            {!collapsed && <span className="sidebar-label">Installer</span>}
          </button>
        )}

        {/* User profile */}
        <div className={`flex items-center gap-3 px-3 py-3 mt-3 rounded-xl bg-slate-800/40 border border-slate-700/30 ${collapsed ? 'justify-center' : ''}`}>
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center text-white text-sm font-bold flex-shrink-0 ring-2 ring-blue-500/20">
            {userInitials}
          </div>
          {!collapsed && (
            <div className="flex-1 min-w-0 sidebar-label">
              <div className="text-sm font-semibold text-white truncate">{user?.name || user?.email}</div>
              <div className="text-[11px] text-slate-500 truncate">
                {user?.role === 'admin' ? 'Administrateur' : 'Utilisateur'}
              </div>
            </div>
          )}
          <button
            onClick={logout}
            title="Deconnexion"
            className="p-1.5 rounded-lg hover:bg-red-500/10 text-slate-500 hover:text-red-400 transition-all duration-200 flex-shrink-0"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen flex bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100">
      {/* Desktop sidebar (>= 1024px): full width */}
      <aside className="hidden lg:flex flex-col fixed inset-y-0 left-0 w-56 bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950 dark:from-slate-950 dark:via-slate-950 dark:to-black z-30 no-print">
        {sidebarContent(false)}
      </aside>

      {/* Tablet sidebar (768-1024px): icons only */}
      <aside className="hidden md:flex lg:hidden flex-col fixed inset-y-0 left-0 w-16 bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950 dark:from-slate-950 dark:via-slate-950 dark:to-black z-30 no-print">
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
          <aside className="md:hidden fixed inset-y-0 left-0 w-72 bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950 dark:from-slate-950 dark:via-slate-950 dark:to-black z-50 no-print animate-slide-in">
            <button
              onClick={() => setMobileMenuOpen(false)}
              className="absolute top-4 right-3 p-1.5 rounded-lg hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
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
        <header className="md:hidden bg-white dark:bg-slate-800 border-b dark:border-slate-700 px-4 py-3 flex items-center justify-between no-print">
          <button
            onClick={() => setMobileMenuOpen(true)}
            className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
          >
            <Menu className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-2">
            <ChefHat className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            <span className="font-bold text-slate-900 dark:text-white">RestauMargin</span>
          </div>
          <div className="w-9" /> {/* Spacer for centering */}
        </header>

        {/* Connectivity status bar */}
        <ConnectivityBar />

        {/* Content */}
        <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 py-6">
          <Suspense fallback={<div className="flex items-center justify-center h-64"><Loader2 className="w-8 h-8 animate-spin text-blue-600" /></div>}>
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
              <Route path="/mercuriale" element={<Mercuriale />} />
              <Route path="/menu-engineering" element={<MenuEngineering />} />
              <Route path="/qr-menu" element={<QRMenu />} />
              <Route path="/commandes" element={<AutoOrders />} />
              <Route path="/planning" element={<Planning />} />
              <Route path="/messagerie" element={<Messagerie />} />
              <Route path="/marketplace" element={<Marketplace />} />
              <Route path="/restaurants" element={<Restaurants />} />
              <Route path="/abonnement" element={<Subscription />} />
              <Route path="/settings" element={<SettingsPage />} />
              <Route path="/users" element={<UserManagement />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
        </main>

        {/* Footer */}
        <footer className="bg-white dark:bg-slate-800 border-t dark:border-slate-700 py-3 text-center text-xs text-slate-400 dark:text-slate-500 no-print">
          RestauMargin &copy; {new Date().getFullYear()} &mdash; Gestion de marge pour la restauration
        </footer>
      </div>

      {/* AI Chatbot - visible on all authenticated pages */}
      <ChatbotAssistant />
    </div>
  );
}

function PublicHome() {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center text-slate-500 dark:text-slate-400">Chargement...</div>;
  }

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return <Landing />;
}

function App() {
  return (
    <AuthProvider>
      <ToastProvider>
        <RestaurantProvider>
          <Routes>
            <Route path="/" element={<PublicHome />} />
          <Route path="/landing" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/menu-public" element={<PublicMenu />} />
          <Route
            path="/station"
            element={
              <ProtectedRoute>
                <Suspense fallback={<div className="flex items-center justify-center h-64"><Loader2 className="w-8 h-8 animate-spin text-blue-600" /></div>}>
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
        </RestaurantProvider>
      </ToastProvider>
    </AuthProvider>
  );
}

export default App;
