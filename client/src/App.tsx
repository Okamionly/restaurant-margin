import { useState, useEffect, useRef, lazy, Suspense } from 'react';
import { Routes, Route, NavLink, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { ChefHat, ShoppingBasket, ClipboardList, BarChart3, Sun, Moon, LogOut, Menu, X, Truck, BookOpen, Settings, Users, Download, Package, FileSearch, Scale, Receipt, TrendingUp, Target, ShoppingCart, CreditCard, CalendarDays, Calendar, MessageSquare, Building2, ChevronDown, Check, Store, Trash2, QrCode, Loader2, Plug, PartyPopper, FileText, Calculator, Contact, ShieldCheck, Shield, Sparkles, Newspaper, AlertTriangle, Keyboard, Search, Trophy, Handshake, Timer } from 'lucide-react';
import ErrorBoundary from './components/ErrorBoundary';
import ConnectivityBar from './components/ConnectivityBar';
import OfflineSyncBar from './components/OfflineSyncBar';
import ChatbotAssistant from './components/ChatbotAssistant';
import OnboardingWizard, { isOnboardingCompleted } from './components/OnboardingWizard';
import KitchenTimer from './components/KitchenTimer';
import VoiceCommandButton from './components/VoiceCommandButton';
import CookieBanner from './components/CookieBanner';
import Breadcrumbs from './components/Breadcrumbs';
import CommandPalette from './components/CommandPalette';
import NotificationCenter from './components/NotificationCenter';
import ShortcutsModal from './components/ShortcutsModal';
import ActiveUsers, { ConnectedBadge, PageActivityDot } from './components/ActiveUsers';
import CollaborationToast from './components/CollaborationToast';
import WorkingIndicator from './components/WorkingIndicator';
import { SidebarLevelBadge } from './components/Gamification';
import ContextualTooltips from './components/ContextualTooltips';
import OnboardingProgress from './components/OnboardingProgress';
import HelpButton from './components/HelpButton';
import { AuthProvider, useAuth } from './hooks/useAuth';
import { ToastProvider } from './hooks/useToast';
import { CollaborationProvider } from './hooks/useCollaboration';
import { RestaurantProvider, useRestaurant } from './hooks/useRestaurant';
import { getToken, fetchRecipes } from './services/api';

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
const AllergenMatrix = lazyRetry(() => import('./pages/AllergenMatrix'));
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
const ServiceTracker = lazyRetry(() => import('./pages/ServiceTracker'));
const EditorialRecipes = lazyRetry(() => import('./pages/EditorialRecipes'));
const Analytics = lazyRetry(() => import('./pages/Analytics'));
const FinancialIntelligence = lazyRetry(() => import('./pages/FinancialIntelligence'));
const FeedbackPage = lazyRetry(() => import('./pages/Feedback'));
const PublicFeedback = lazyRetry(() => import('./pages/PublicFeedback'));
const PublicRecipe = lazyRetry(() => import('./pages/PublicRecipe'));
const MenuCalendar = lazyRetry(() => import('./pages/MenuCalendar'));
const AdminDashboard = lazyRetry(() => import('./pages/AdminDashboard'));
const GamificationPage = lazyRetry(() => import('./components/Gamification'));
const Temoignages = lazyRetry(() => import('./pages/Temoignages'));
const Demo = lazyRetry(() => import('./pages/Demo'));
const BlogCoefficient = lazyRetry(() => import('./pages/BlogCoefficient'));
const BlogFoodCost = lazyRetry(() => import('./pages/BlogFoodCost'));
const BlogIA = lazyRetry(() => import('./pages/BlogIA'));
const NegociationIA = lazyRetry(() => import('./pages/NegociationIA'));

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
        <ConnectedBadge />
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


function AppLayout() {
  const { user, logout } = useAuth();
  const { selectedRestaurant } = useRestaurant();
  const [darkMode, setDarkMode] = useState(() => localStorage.getItem('darkMode') === 'true');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [installPrompt, setInstallPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isInstalled, setIsInstalled] = useState(false);
  const [showInstallBanner, setShowInstallBanner] = useState(false);
  const [verificationSent, setVerificationSent] = useState(false);
  const [showShortcutsModal, setShowShortcutsModal] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [trialBannerDismissed, setTrialBannerDismissed] = useState(() => localStorage.getItem('trial-banner-dismissed') === '1');
  const location = useLocation();
  const navigate = useNavigate();

  // Check if onboarding wizard should show (first login, no recipes, not completed)
  useEffect(() => {
    if (isOnboardingCompleted()) return;
    let cancelled = false;
    fetchRecipes().then(recipes => {
      if (!cancelled && recipes.length === 0) {
        setShowOnboarding(true);
      }
    }).catch(() => {
      // If fetch fails, don't show onboarding
    });
    return () => { cancelled = true; };
  }, []);

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
  // Grouped navigation sections
  const navSections: NavSection[] = [
    {
      title: 'PRINCIPAL',
      items: [
        { to: '/dashboard', icon: BarChart3, label: 'Tableau de bord' },
        { to: '/mon-score', icon: Trophy, label: 'Mon score' },
        { to: '/assistant', icon: Sparkles, label: 'Assistant IA' },
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
        { to: '/menu-calendar', icon: Calendar, label: 'Menu Calendrier' },
      ],
    },
    {
      title: 'INTELLIGENCE',
      items: [
        { to: '/financial-intelligence', icon: TrendingUp, label: 'Intelligence financiere' },
        { to: '/analytics', icon: BarChart3, label: 'Analytiques' },
        { to: '/scanner-factures', icon: Receipt, label: 'Factures' },
        { to: '/actualites', icon: Newspaper, label: 'Actualités IA' },
        { to: '/mercuriale', icon: TrendingUp, label: 'Mercuriale' },
        { to: '/menu-engineering', icon: Target, label: 'Menu Engineering' },
        { to: '/allergen-matrix', icon: Shield, label: 'Matrice allergenes' },
        { to: '/recettes-semaine', icon: ChefHat, label: 'Recettes semaine' },
        { to: '/negociation-ia', icon: Handshake, label: 'Negociation IA' },
      ],
    },
    {
      title: 'OPERATIONS',
      items: [
        { to: '/service-tracker', icon: Timer, label: 'Suivi Service' },
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
        { to: '/feedback', icon: MessageSquare, label: 'Avis clients' },
        { to: '/clients', icon: Contact, label: 'Clients CRM' },
      ],
    },
    {
      title: 'BUSINESS',
      items: [
        { to: '/comptabilite', icon: Calculator, label: 'Comptabilité' },
        { to: '/devis', icon: FileText, label: 'Devis & Factures' },
        { to: '/marketplace', icon: Store, label: 'Marketplace' },
        // Integrations masqué pour l'instant
        { to: '/restaurants', icon: Building2, label: 'Restaurants' },
        { to: '/abonnement', icon: CreditCard, label: 'Mon abonnement' },
      ],
    },
  ];

  // Bottom nav items (always visible at bottom of sidebar)
  const bottomNavItems: NavItem[] = [
    ...(user?.role === 'admin' ? [{ to: '/admin', icon: Shield, label: 'Administration' }] : []),
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
          data-tooltip={collapsed ? item.label : undefined}
          onClick={() => alert('Cette fonctionnalité sera disponible prochainement')}
          className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 group w-full opacity-50 cursor-not-allowed ${
            collapsed ? 'justify-center nav-tooltip-premium' : ''
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
        data-tooltip={!collapsed ? item.label : undefined}
        className={({ isActive }) =>
          `flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 group nav-item-premium nav-tooltip-premium ${
            collapsed ? 'justify-center' : ''
          } ${
            isActive
              ? 'bg-[#111111] text-white dark:bg-white dark:text-[#000000] nav-item-active'
              : 'text-[#6B7280] dark:text-[#737373] hover:text-[#111111] dark:hover:text-white'
          }`
        }
      >
        <span className="relative flex-shrink-0 nav-icon-bounce">
          <item.icon className="w-5 h-5" />
          {item.badge && item.badge > 0 && (
            <span className="absolute -top-1.5 -right-2.5 px-1 min-w-[18px] h-[18px] flex items-center justify-center text-[10px] font-bold bg-red-500 text-white rounded-full">
              {item.badge}
            </span>
          )}
          <PageActivityDot path={item.to} />
        </span>
        {!collapsed && <span className="sidebar-label truncate">{item.label}</span>}
      </NavLink>
    );
  };

  // Sidebar content (shared between desktop and mobile)
  const sidebarContent = (collapsed = false) => (
    <div className="flex flex-col h-full">
      {/* Premium accent gradient line */}
      <div className="premium-top-line" />

      {/* Logo */}
      <div className={`flex items-center gap-3 px-4 py-5 border-b border-white/10 dark:border-white/5 ${collapsed ? 'justify-center px-2' : ''}`}>
        <ChefHat className="w-8 h-8 text-[#111111] dark:text-white flex-shrink-0" />
        {!collapsed && <span className="text-lg font-bold logo-shimmer sidebar-label font-satoshi tracking-tight flex-1">RestauMargin</span>}
        <NotificationCenter />

      </div>

      {/* Restaurant selector */}
      {!collapsed && (
        <div className="pt-3">
          <SidebarRestaurantSelector />
        </div>
      )}

      {/* Active users (collaboration indicators) */}
      {!collapsed && <ActiveUsers />}

      {/* Onboarding progress tracker */}
      {!collapsed && <OnboardingProgress />}

      {/* Gamification Level Badge */}
      {!collapsed && <SidebarLevelBadge />}

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
            {!collapsed && idx > 0 && <div className="border-t border-[#E5E7EB]/60 dark:border-white/5 mb-3" />}
            {!collapsed && (
              <div className="px-3 py-1.5 text-[9px] font-semibold tracking-[0.18em] text-[#9CA3AF] dark:text-[#525252] uppercase sidebar-label font-satoshi">
                {section.title}
              </div>
            )}
            {collapsed && <div className="border-t border-[#E5E7EB]/60 dark:border-white/5 my-2" />}
            <div className="space-y-0.5">
              {section.items.map((item) => renderNavItem(item, collapsed))}
            </div>
          </div>
        ))}
      </nav>

      {/* Bottom section */}
      <div className="border-t border-[#E5E7EB]/60 dark:border-white/5 px-3 py-3 space-y-1">
        {/* Bottom nav items */}
        {bottomNavItems.map((item) => renderNavItem(item, collapsed))}

        {/* Dark mode toggle with rotation animation */}
        <button
          onClick={() => setDarkMode(!darkMode)}
          title={darkMode ? 'Mode clair' : 'Mode sombre'}
          aria-label={darkMode ? 'Activer le mode clair' : 'Activer le mode sombre'}
          className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-[#6B7280] dark:text-[#737373] hover:bg-[#F3F4F6] dark:hover:bg-[#171717] hover:text-[#111111] dark:hover:text-white transition-colors w-full nav-item-premium ${collapsed ? 'justify-center' : ''}`}
        >
          <span className="dark-mode-icon flex-shrink-0" key={darkMode ? 'sun' : 'moon'}>
            {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </span>
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

        {/* Status bar */}
        {!collapsed && (
          <div className="flex items-center gap-2 px-4 py-2 text-[10px] text-[#9CA3AF] dark:text-[#525252] font-medium tracking-wide">
            <span className="status-dot-online flex-shrink-0" />
            <span>Connecte</span>
            <span className="mx-1 text-[#D1D5DB] dark:text-[#333333]">&middot;</span>
            <span>v2.0</span>
          </div>
        )}

        {/* User profile */}
        <div className={`flex items-center gap-3 px-3 py-3 mt-1 rounded-xl bg-[#F3F4F6]/80 dark:bg-[#171717]/80 border border-[#E5E7EB] dark:border-[#1A1A1A] backdrop-blur-sm ${collapsed ? 'justify-center' : ''}`}>
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
      {/* Premium top gradient line */}
      <div className="fixed top-0 left-0 right-0 z-[60] premium-top-line" />
      <a href="#main-content" className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:bg-teal-600 focus:text-white focus:px-4 focus:py-2 focus:rounded-lg">
        Aller au contenu principal
      </a>
      {/* Desktop sidebar (>= 1024px): full width — glassmorphism */}
      <aside className="hidden lg:flex flex-col fixed inset-y-0 left-0 w-56 sidebar-glass z-30 no-print" style={{ top: '2px' }}>
        {sidebarContent(false)}
      </aside>

      {/* Tablet sidebar (768-1024px): icons only — glassmorphism */}
      <aside className="hidden md:flex lg:hidden flex-col fixed inset-y-0 left-0 w-16 sidebar-glass z-30 no-print" style={{ top: '2px' }}>
        {sidebarContent(true)}
      </aside>

      {/* Mobile overlay sidebar */}
      {mobileMenuOpen && (
        <>
          {/* Backdrop */}
          <div
            className="md:hidden fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
            onClick={() => setMobileMenuOpen(false)}
          />
          {/* Sidebar panel */}
          <aside className="md:hidden fixed inset-y-0 left-0 w-72 sidebar-glass z-50 no-print animate-slide-in" style={{ top: '2px' }}>
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
      <div className="flex-1 flex flex-col min-h-screen lg:ml-56 md:ml-16 ml-0" style={{ paddingTop: '2px' }}>
        {/* Mobile top bar */}
        <header className="md:hidden bg-white/90 dark:bg-[#0A0A0A]/90 backdrop-blur-lg border-b border-[#E5E7EB] dark:border-[#1A1A1A] px-4 py-3 flex items-center justify-between no-print">
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
              <NotificationCenter />
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

        {/* Trial expiry banner */}
        {(() => {
          if (trialBannerDismissed || !user?.trialEndsAt) return null;
          const trialEnd = new Date(user.trialEndsAt);
          const now = new Date();
          const diffMs = trialEnd.getTime() - now.getTime();
          const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));
          const isExpired = diffDays <= 0;
          const isExpiring = diffDays > 0 && diffDays <= 2;

          if (!isExpired && !isExpiring) return null;

          return (
            <div className={`border-b px-4 py-2.5 flex items-center justify-between text-sm ${
              isExpired
                ? 'bg-red-500/10 border-red-500/30 text-red-400'
                : 'bg-amber-500/10 border-amber-500/30 text-amber-400'
            }`}>
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 flex-shrink-0" />
                <span>
                  {isExpired
                    ? 'Votre essai gratuit est terminé — Passez au plan Pro'
                    : `Votre essai gratuit se termine dans ${diffDays} jour${diffDays > 1 ? 's' : ''}`
                  }
                </span>
              </div>
              <div className="flex items-center gap-3 ml-4 flex-shrink-0">
                <button
                  onClick={() => navigate('/abonnement')}
                  className={`px-3 py-1 rounded-lg text-xs font-semibold transition-colors ${
                    isExpired
                      ? 'bg-red-500 hover:bg-red-400 text-white'
                      : 'bg-amber-500 hover:bg-amber-400 text-white'
                  }`}
                >
                  Voir les plans
                </button>
                <button
                  onClick={() => { setTrialBannerDismissed(true); localStorage.setItem('trial-banner-dismissed', '1'); }}
                  className="p-1 hover:bg-white/10 rounded transition-colors"
                  aria-label="Fermer"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          );
        })()}

        {/* Content */}
        <main id="main-content" key={selectedRestaurant?.id ?? 'no-restaurant'} className="flex-1 w-full max-w-7xl mx-auto px-3 sm:px-6 py-4 sm:py-6 premium-content">
          <Breadcrumbs />
          <WorkingIndicator />
          <div key={location.pathname} className="animate-premium-page-in">
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
              <Route path="/menu-calendar" element={<MenuCalendar />} />
              <Route path="/rfqs" element={<RFQPage />} />
              <Route path="/analytics" element={<Analytics />} />
              <Route path="/financial-intelligence" element={<FinancialIntelligence />} />
              <Route path="/scanner-factures" element={<InvoiceScanner />} />
              <Route path="/actualites" element={<Actualites />} />
              <Route path="/mercuriale" element={<Mercuriale />} />
              <Route path="/menu-engineering" element={<MenuEngineering />} />
              <Route path="/allergen-matrix" element={<AllergenMatrix />} />
              <Route path="/qr-menu" element={<QRMenu />} />
              <Route path="/commandes" element={<AutoOrders />} />
              <Route path="/service-tracker" element={<ServiceTracker />} />
              <Route path="/planning" element={<Planning />} />
              <Route path="/seminaires" element={<Seminaires />} />
              <Route path="/haccp" element={<HACCPPage />} />
              <Route path="/recettes-semaine" element={<EditorialRecipes />} />
              <Route path="/negociation-ia" element={<NegociationIA />} />
              <Route path="/assistant" element={<AIAssistant />} />
              <Route path="/messagerie" element={<Messagerie />} />
              <Route path="/feedback" element={<FeedbackPage />} />
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
              <Route path="/admin" element={<AdminDashboard />} />
              <Route path="/mon-score" element={<GamificationPage />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
          </div>
        </main>

        {/* Footer */}
        <footer className="bg-white/80 dark:bg-[#0A0A0A]/80 backdrop-blur-sm border-t border-[#E5E7EB] dark:border-[#1A1A1A] py-3 text-center text-xs text-[#9CA3AF] dark:text-[#737373] no-print">
          RestauMargin &copy; {new Date().getFullYear()} &mdash; Gestion de marge pour la restauration
        </footer>
      </div>

      {/* Command Palette (Ctrl+K) — unified search + actions */}
      <CommandPalette />
      <ShortcutsModal open={showShortcutsModal} onClose={() => setShowShortcutsModal(false)} />
      <ChatbotAssistant />
      {/* Kitchen Timer - floating bottom-left */}
      <KitchenTimer />
      {/* Voice Command - floating bottom-right, above Crisp chat */}
      <VoiceCommandButton />

      {/* Collaboration live toasts */}
      <CollaborationToast />

      {/* Contextual tooltips for first-visit pages */}
      <ContextualTooltips />

      {/* Floating help button */}
      <HelpButton />

      {/* Onboarding Wizard for new users */}
      {showOnboarding && (
        <OnboardingWizard onComplete={() => setShowOnboarding(false)} />
      )}
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
          <Route path="/feedback/:id" element={<Suspense fallback={<div className="min-h-screen bg-white dark:bg-[#0A0A0A] flex items-center justify-center"><Loader2 className="w-8 h-8 animate-spin text-[#111111] dark:text-white" /></div>}><PublicFeedback /></Suspense>} />
          <Route path="/r/:token" element={<Suspense fallback={<div className="min-h-screen bg-white flex items-center justify-center"><Loader2 className="w-8 h-8 animate-spin text-[#111111]" /></div>}><PublicRecipe /></Suspense>} />
          <Route path="/station-produit" element={<StationLanding />} />
          <Route path="/dev-corp" element={<Suspense fallback={<div className="min-h-screen bg-white dark:bg-black flex items-center justify-center"><Loader2 className="w-8 h-8 text-blue-500 animate-spin" /></div>}><DevCorp /></Suspense>} />
          <Route path="/mentions-legales" element={<Suspense fallback={<div className="min-h-screen bg-white dark:bg-black flex items-center justify-center"><Loader2 className="w-8 h-8 text-blue-500 animate-spin" /></div>}><MentionsLegales /></Suspense>} />
          <Route path="/cgv" element={<Suspense fallback={<div className="min-h-screen bg-white dark:bg-black flex items-center justify-center"><Loader2 className="w-8 h-8 text-blue-500 animate-spin" /></div>}><CGV /></Suspense>} />
          <Route path="/cgu" element={<Suspense fallback={<div className="min-h-screen bg-white dark:bg-black flex items-center justify-center"><Loader2 className="w-8 h-8 text-blue-500 animate-spin" /></div>}><CGU /></Suspense>} />
          <Route path="/politique-confidentialite" element={<Suspense fallback={<div className="min-h-screen bg-white dark:bg-black flex items-center justify-center"><Loader2 className="w-8 h-8 text-blue-500 animate-spin" /></div>}><PolitiqueConfidentialite /></Suspense>} />
          <Route path="/pricing" element={<Suspense fallback={<div className="min-h-screen bg-white dark:bg-black flex items-center justify-center"><Loader2 className="w-8 h-8 text-blue-500 animate-spin" /></div>}><Pricing /></Suspense>} />
          <Route path="/reset-password" element={<Suspense fallback={<div className="min-h-screen bg-white dark:bg-black flex items-center justify-center"><Loader2 className="w-8 h-8 text-blue-500 animate-spin" /></div>}><ResetPassword /></Suspense>} />
          <Route path="/outils/calculateur-food-cost" element={<Suspense fallback={<div className="min-h-screen bg-[#f8fafb] flex items-center justify-center"><Loader2 className="w-8 h-8 text-teal-500 animate-spin" /></div>}><FoodCostCalculator /></Suspense>} />
          <Route path="/outils/generateur-qr-menu" element={<Suspense fallback={<div className="min-h-screen bg-[#f8fafb] flex items-center justify-center"><Loader2 className="w-8 h-8 text-teal-500 animate-spin" /></div>}><QRCodeGenerator /></Suspense>} />
          <Route path="/blog/calcul-marge-restaurant" element={<Suspense fallback={<div className="min-h-screen bg-white flex items-center justify-center"><Loader2 className="w-8 h-8 text-teal-500 animate-spin" /></div>}><BlogCalcMarge /></Suspense>} />
          <Route path="/temoignages" element={<Suspense fallback={<div className="min-h-screen bg-white flex items-center justify-center"><Loader2 className="w-8 h-8 animate-spin text-[#111111]" /></div>}><Temoignages /></Suspense>} />
          <Route path="/demo" element={<Suspense fallback={<div className="min-h-screen bg-white flex items-center justify-center"><Loader2 className="w-8 h-8 text-teal-500 animate-spin" /></div>}><Demo /></Suspense>} />
          <Route path="/blog/coefficient-multiplicateur" element={<Suspense fallback={<div className="min-h-screen bg-white flex items-center justify-center"><Loader2 className="w-8 h-8 text-teal-500 animate-spin" /></div>}><BlogCoefficient /></Suspense>} />
          <Route path="/blog/reduire-food-cost" element={<Suspense fallback={<div className="min-h-screen bg-white flex items-center justify-center"><Loader2 className="w-8 h-8 text-teal-500 animate-spin" /></div>}><BlogFoodCost /></Suspense>} />
          <Route path="/blog/ia-restauration" element={<Suspense fallback={<div className="min-h-screen bg-white flex items-center justify-center"><Loader2 className="w-8 h-8 text-teal-500 animate-spin" /></div>}><BlogIA /></Suspense>} />
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
                <CollaborationProvider>
                  <AppLayout />
                </CollaborationProvider>
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
