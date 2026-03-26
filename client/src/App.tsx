import { useState, useEffect } from 'react';
import { Routes, Route, NavLink, Navigate, useLocation } from 'react-router-dom';
import { ChefHat, ShoppingBasket, ClipboardList, BarChart3, Sun, Moon, LogOut, Menu, X, Truck, BookOpen, Settings, Users, Download, Package, FileSearch, Scale, Receipt, TrendingUp, Target } from 'lucide-react';
import { AuthProvider, useAuth } from './hooks/useAuth';
import { ToastProvider } from './hooks/useToast';
import Dashboard from './pages/Dashboard';
import Ingredients from './pages/Ingredients';
import Recipes from './pages/Recipes';
import RecipeDetail from './pages/RecipeDetail';
import Suppliers from './pages/Suppliers';
import Inventory from './pages/Inventory';
import RFQPage from './pages/RFQ';
import MenuBuilder from './pages/MenuBuilder';
import SettingsPage from './pages/Settings';
import UserManagement from './pages/UserManagement';
import WeighStation from './pages/WeighStation';
import InvoiceScanner from './pages/InvoiceScanner';
import Mercuriale from './pages/Mercuriale';
import MenuEngineering from './pages/MenuEngineering';
import Login from './pages/Login';
import Landing from './pages/Landing';

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
    // Check if already installed
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

  const navItems = [
    { to: '/dashboard', icon: BarChart3, label: 'Tableau de bord' },
    { to: '/ingredients', icon: ShoppingBasket, label: 'Ingrédients' },
    { to: '/recipes', icon: ClipboardList, label: 'Fiches techniques' },
    { to: '/menu', icon: BookOpen, label: 'La Carte' },
    { to: '/suppliers', icon: Truck, label: 'Fournisseurs' },
    { to: '/inventory', icon: Package, label: 'Inventaire' },
    { to: '/rfqs', icon: FileSearch, label: 'Appels d\'offres' },
    { to: '/scanner-factures', icon: Receipt, label: 'Scanner Factures' },
    { to: '/mercuriale', icon: TrendingUp, label: 'Mercuriale' },
    { to: '/menu-engineering', icon: BarChart3, label: 'Menu Engineering' },
  ];

  const secondaryNavItems = [
    ...(user?.role === 'admin' ? [{ to: '/users', icon: Users, label: 'Utilisateurs' }] : []),
    { to: '/settings', icon: Settings, label: 'Paramètres' },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100">
      {/* Header */}
      <header className="bg-blue-800 dark:bg-blue-900 text-white shadow-lg no-print">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <ChefHat className="w-8 h-8" />
            <h1 className="text-xl font-bold">RestauMargin</h1>
          </div>
          <div className="flex items-center gap-3">
            {/* Station Balance button */}
            <a
              href="/station"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-700 hover:bg-blue-600 text-white text-sm font-medium transition-colors"
              title="Station Balance"
            >
              <Scale className="w-4 h-4" />
              <span className="hidden sm:inline">Station</span>
            </a>

            {/* Install PWA button */}
            {installPrompt && !isInstalled && (
              <button
                onClick={handleInstall}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-green-500 hover:bg-green-600 text-white text-sm font-medium transition-colors animate-pulse"
                title="Installer l'application"
              >
                <Download className="w-4 h-4" />
                <span className="hidden sm:inline">Installer</span>
              </button>
            )}

            {/* Dark mode toggle */}
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="p-2 rounded-lg hover:bg-blue-700 dark:hover:bg-blue-800 transition-colors"
              title={darkMode ? 'Mode clair' : 'Mode sombre'}
            >
              {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>

            {/* User info - desktop */}
            <div className="hidden sm:flex items-center gap-3">
              <span className="text-sm text-blue-200">{user?.name || user?.email}</span>
              {user?.role === 'admin' && (
                <span className="px-2 py-0.5 rounded text-[10px] bg-purple-600 text-white font-medium">Admin</span>
              )}
              <button
                onClick={logout}
                className="p-2 rounded-lg hover:bg-blue-700 dark:hover:bg-blue-800 transition-colors"
                title="Déconnexion"
              >
                <LogOut className="w-5 h-5" />
              </button>
            </div>

            {/* Hamburger - mobile */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="sm:hidden p-2 rounded-lg hover:bg-blue-700"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="sm:hidden bg-white dark:bg-slate-800 border-b dark:border-slate-700 shadow-lg no-print">
          <div className="px-4 py-2 space-y-1">
            {[...navItems, ...secondaryNavItems].map(({ to, icon: Icon, label }) => (
              <NavLink
                key={to}
                to={to}
                end={to === '/dashboard'}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400'
                      : 'text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700'
                  }`
                }
              >
                <Icon className="w-4 h-4" />
                {label}
              </NavLink>
            ))}
            <div className="border-t dark:border-slate-700 pt-2 mt-2">
              <div className="px-3 py-1 text-xs text-slate-400">{user?.name || user?.email}</div>
              <button
                onClick={logout}
                className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 w-full"
              >
                <LogOut className="w-4 h-4" />
                Déconnexion
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Navigation - desktop */}
      <nav className="bg-white dark:bg-slate-800 border-b dark:border-slate-700 shadow-sm no-print hidden sm:block">
        <div className="max-w-7xl mx-auto px-4 flex justify-between">
          <div className="flex gap-1">
            {navItems.map(({ to, icon: Icon, label }) => (
              <NavLink
                key={to}
                to={to}
                end={to === '/dashboard'}
                className={({ isActive }) =>
                  `flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                    isActive
                      ? 'border-blue-600 text-blue-600 dark:text-blue-400 dark:border-blue-400'
                      : 'border-transparent text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:border-slate-300'
                  }`
                }
              >
                <Icon className="w-4 h-4" />
                {label}
              </NavLink>
            ))}
          </div>
          <div className="flex gap-1">
            {secondaryNavItems.map(({ to, icon: Icon, label }) => (
              <NavLink
                key={to}
                to={to}
                className={({ isActive }) =>
                  `flex items-center gap-2 px-3 py-3 text-sm font-medium border-b-2 transition-colors ${
                    isActive
                      ? 'border-blue-600 text-blue-600 dark:text-blue-400 dark:border-blue-400'
                      : 'border-transparent text-slate-500 dark:text-slate-500 hover:text-slate-900 dark:hover:text-slate-200 hover:border-slate-300'
                  }`
                }
              >
                <Icon className="w-4 h-4" />
                <span className="hidden lg:inline">{label}</span>
              </NavLink>
            ))}
          </div>
        </div>
      </nav>

      {/* Content */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 py-6">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/ingredients" element={<Ingredients />} />
          <Route path="/recipes" element={<Recipes />} />
          <Route path="/recipes/:id" element={<RecipeDetail />} />
          <Route path="/menu" element={<MenuBuilder />} />
          <Route path="/suppliers" element={<Suppliers />} />
          <Route path="/inventory" element={<Inventory />} />
          <Route path="/rfqs" element={<RFQPage />} />
          <Route path="/scanner-factures" element={<InvoiceScanner />} />
          <Route path="/mercuriale" element={<Mercuriale />} />
          <Route path="/menu-engineering" element={<MenuEngineering />} />
          <Route path="/settings" element={<SettingsPage />} />
          <Route path="/users" element={<UserManagement />} />
        </Routes>
      </main>

      {/* Footer */}
      <footer className="bg-white dark:bg-slate-800 border-t dark:border-slate-700 py-3 text-center text-xs text-slate-400 dark:text-slate-500 no-print">
        RestauMargin &copy; {new Date().getFullYear()} &mdash; Gestion de marge pour la restauration
      </footer>
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
        <Routes>
          <Route path="/" element={<PublicHome />} />
          <Route path="/landing" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route
            path="/station"
            element={
              <ProtectedRoute>
                <WeighStation />
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
      </ToastProvider>
    </AuthProvider>
  );
}

export default App;
