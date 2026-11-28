import { useState, useEffect, useRef, lazy, Suspense } from 'react';
import { Routes, Route, NavLink, useLocation, useNavigate } from 'react-router-dom';
import { ChefHat, ShoppingBasket, ClipboardList, BarChart3, Sun, Moon, LogOut, Menu, X, Truck, BookOpen, Settings, Users, Download, Package, FileSearch, Scale, Receipt, TrendingUp, Target, ShoppingCart, CreditCard, CalendarDays, Calendar, MessageSquare, Building2, ChevronDown, Check, Store, Trash2, QrCode, Loader2, PartyPopper, FileText, Calculator, Contact, ShieldCheck, Shield, Sparkles, Newspaper, AlertTriangle, Search, Handshake, Timer, Gift, Activity, Leaf, Utensils } from 'lucide-react';
import { isOnboardingCompleted } from './utils/onboardingFlags';
import Breadcrumbs from './components/Breadcrumbs';
import { trackPageVisit } from './utils/recentPages';
import ActiveUsers, { ConnectedBadge, PageActivityDot } from './components/ActiveUsers';
import TrialPaywallGuard from './components/TrialPaywallGuard';
import { useAuth } from './hooks/useAuth';
import { useToast } from './hooks/useToast';
import { useTranslation } from './hooks/useTranslation';
import { useRestaurant } from './hooks/useRestaurant';
import { getToken, fetchRecipes } from './services/api';
import NotFound from './pages/NotFound';
import { lazyRetry } from './utils/lazyRetry';

// Coquille de l'espace connecte (sidebar, en-tete, routes de l'application).
// Perf/SEO 2026-11-28 : extraite d'App.tsx et chargee a la demande. Avant, elle vivait dans le
// chunk d'entree que telecharge chaque visiteur d'article : ses ~50 icones lucide et, depuis le
// 15/11 (useTranslation ajoute pour un toast), tout locales/fr.json (127 Ko).
// Ne rien importer ici depuis App.tsx (dependance circulaire) ; lazyRetry vit dans utils/.

const NotificationCenter = lazyRetry(() => import('./components/NotificationCenter'));
const OnboardingWizard = lazyRetry(() => import('./components/OnboardingWizard'));
const CommandPalette = lazyRetry(() => import('./components/CommandPalette'));
const GamificationPage = lazyRetry(() => import('./components/Gamification'));
const ConnectivityBar = lazyRetry(() => import('./components/ConnectivityBar'));
const OfflineSyncBar = lazyRetry(() => import('./components/OfflineSyncBar'));
const WorkingIndicator = lazyRetry(() => import('./components/WorkingIndicator'));
const ContextualTooltips = lazyRetry(() => import('./components/ContextualTooltips'));
const FloatingActionBubble = lazyRetry(() => import('./components/FloatingActionBubble'));
const MobileBottomNav = lazyRetry(() => import('./components/MobileBottomNav'));
const NPSModal = lazyRetry(() => import('./components/NPSModal'));
const ShortcutsModal = lazyRetry(() => import('./components/ShortcutsModal'));
const SidebarLevelBadge = lazyRetry(() => import('./components/SidebarLevelBadge'));
const OnboardingProgress = lazyRetry(() => import('./components/OnboardingProgress'));
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
const HACCPPage = lazyRetry(() => import('./pages/HACCP'));
const AIAssistant = lazyRetry(() => import('./pages/AIAssistant'));
const Actualites = lazyRetry(() => import('./pages/Actualites'));
const Pricing = lazyRetry(() => import('./pages/Pricing'));
const MesParrainages = lazyRetry(() => import('./pages/MesParrainages'));
const TrialReactivate = lazyRetry(() => import('./pages/TrialReactivate'));
const AdminMetrics = lazyRetry(() => import('./pages/AdminMetrics'));
const AdminFinance = lazyRetry(() => import('./pages/AdminFinance'));
const OutreachMailer = lazyRetry(() => import('./pages/OutreachMailer'));
const KitchenMode = lazyRetry(() => import('./pages/KitchenMode'));
const ServiceTracker = lazyRetry(() => import('./pages/ServiceTracker'));
const EditorialRecipes = lazyRetry(() => import('./pages/EditorialRecipes'));
const Analytics = lazyRetry(() => import('./pages/Analytics'));
const FinancialIntelligence = lazyRetry(() => import('./pages/FinancialIntelligence'));
const FeedbackPage = lazyRetry(() => import('./pages/Feedback'));
const MenuCalendar = lazyRetry(() => import('./pages/MenuCalendar'));
const AdminDashboard = lazyRetry(() => import('./pages/AdminDashboard'));
const NegociationIA = lazyRetry(() => import('./pages/NegociationIA'));
const EmailMarketing = lazyRetry(() => import('./pages/EmailMarketing'));
const HelpPage = lazyRetry(() => import('./pages/Help'));
const BreakevenCalculator = lazyRetry(() => import('./pages/BreakevenCalculator'));
const CouvertsCible = lazyRetry(() => import('./pages/CouvertsCible'));
const TvaCalculator = lazyRetry(() => import('./pages/TvaCalculator'));
const LaborCostCalculator = lazyRetry(() => import('./pages/LaborCostCalculator'));
const PriceIncreaseSimulator = lazyRetry(() => import('./pages/PriceIncreaseSimulator'));
const PrimeSaisonniere = lazyRetry(() => import('./pages/PrimeSaisonniere'));
const BonCadeau = lazyRetry(() => import('./pages/BonCadeau'));
const DlcTracker = lazyRetry(() => import('./pages/DlcTracker'));
const ChecklistService = lazyRetry(() => import('./pages/ChecklistService'));
const ChronoPreparation = lazyRetry(() => import('./pages/ChronoPreparation'));
const SaisonnaliteIngredients = lazyRetry(() => import('./pages/SaisonnaliteIngredients'));
const RoiEquipement = lazyRetry(() => import('./pages/RoiEquipement'));
const CoutCouvert = lazyRetry(() => import('./pages/CoutCouvert'));
const LivraisonRentabilite = lazyRetry(() => import('./pages/LivraisonRentabilite'));

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
        className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg bg-mono-950 dark:bg-[#171717] hover:bg-mono-900 dark:hover:bg-mono-200 text-mono-100 dark:text-white text-sm font-medium transition-colors border border-mono-900 dark:border-mono-200"
      >
        <Building2 className="w-4 h-4 flex-shrink-0 text-teal-400" />
        <span className="truncate flex-1 text-left sidebar-label">{selectedRestaurant.name}</span>
        <ConnectedBadge />
        <ChevronDown className={`w-3.5 h-3.5 flex-shrink-0 transition-transform sidebar-label ${open ? 'rotate-180' : ''}`} />
      </button>
      {open && (
        <div className="absolute left-3 right-3 top-full mt-1 bg-white dark:bg-mono-50 rounded-lg shadow-xl border border-mono-900 dark:border-mono-200 z-50 py-1">
          {restaurants.map((r) => (
            <button
              key={r.id}
              onClick={() => { switchRestaurant(r.id); setOpen(false); }}
              className={`w-full flex items-center gap-3 px-3 py-2.5 text-left text-sm transition-colors ${
                r.id === selectedRestaurant.id
                  ? 'bg-mono-950 dark:bg-[#171717] text-mono-100 dark:text-white font-semibold'
                  : 'text-[#6B7280] dark:text-mono-700 hover:bg-mono-950 dark:hover:bg-[#171717]'
              }`}
            >
              <Building2 className="w-4 h-4 flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <div className="font-medium truncate">{r.name}</div>
                <div className="text-xs text-[#9CA3AF] dark:text-mono-500 truncate">{r.cuisineType || ''}</div>
              </div>
              {r.id === selectedRestaurant.id && <Check className="w-4 h-4 text-mono-100 dark:text-white flex-shrink-0" />}
            </button>
          ))}
          <div className="border-t border-mono-900 dark:border-mono-200 mt-1 pt-1">
            <NavLink
              to="/restaurants"
              onClick={() => setOpen(false)}
              className="flex items-center gap-3 px-3 py-2 text-sm text-[#6B7280] dark:text-mono-500 hover:bg-mono-950 dark:hover:bg-[#171717] transition-colors"
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



export default function AppLayout() {
  const { user, logout } = useAuth();
  const { selectedRestaurant } = useRestaurant();
  const { showToast } = useToast();
  const { t } = useTranslation();
  const [darkMode, setDarkMode] = useState(() => localStorage.getItem('darkMode') === 'true');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [installPrompt, setInstallPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isInstalled, setIsInstalled] = useState(false);
  const [showInstallBanner, setShowInstallBanner] = useState(false);
  const [verificationSent, setVerificationSent] = useState(false);
  const [showShortcutsModal, setShowShortcutsModal] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(false);
  // CommandPalette is lazy-loaded — only mount it after first Cmd+K / Ctrl+K
  // to keep ~40 KB out of the main bundle on first paint.
  const [commandPaletteArmed, setCommandPaletteArmed] = useState(false);
  const [trialBannerDismissed, setTrialBannerDismissed] = useState(() => localStorage.getItem('trial-banner-dismissed') === '1');
  // Progressive disclosure: sidebar_advanced_mode persists across sessions
  const [advancedMode, setAdvancedMode] = useState<boolean>(
    () => localStorage.getItem('sidebar_advanced_mode') === 'expanded'
  );
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

  function toggleAdvancedMode() {
    const next = !advancedMode;
    setAdvancedMode(next);
    localStorage.setItem('sidebar_advanced_mode', next ? 'expanded' : 'collapsed');
  }

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

  // PWA Install prompt -- show after 30s on site, only once per week
  useEffect(() => {
    let timer: ReturnType<typeof setTimeout> | null = null;
    const handler = (e: Event) => {
      e.preventDefault();
      setInstallPrompt(e as BeforeInstallPromptEvent);
      const lastDismissed = localStorage.getItem('pwa-install-dismissed-at');
      const oneWeekMs = 7 * 24 * 60 * 60 * 1000;
      const canShow = !lastDismissed || (Date.now() - parseInt(lastDismissed, 10)) > oneWeekMs;
      if (canShow) {
        timer = setTimeout(() => { setShowInstallBanner(true); }, 30000);
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
    return () => {
      window.removeEventListener('beforeinstallprompt', handler);
      if (timer) clearTimeout(timer);
    };
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
    // Store timestamp so banner only hides for 1 week
    localStorage.setItem('pwa-install-dismissed-at', String(Date.now()));
  }

  useEffect(() => {
    // Enable smooth dark-mode transition class
    document.documentElement.classList.add('dark-transition');
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('darkMode', String(darkMode));
    // Remove transition class after animation completes to avoid affecting other transitions
    const timer = setTimeout(() => document.documentElement.classList.remove('dark-transition'), 350);
    return () => clearTimeout(timer);
  }, [darkMode]);

  // Close mobile menu on navigation
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  // Track recently visited pages for CommandPalette
  useEffect(() => {
    const path = location.pathname;
    // Only track main app pages (not login, public, etc.)
    if (path && path !== '/' && path !== '/login' && !path.startsWith('/outils') && !path.startsWith('/blog')) {
      trackPageVisit(path);
    }
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

  // Arm CommandPalette lazy import on first Cmd+K / Ctrl+K.
  useEffect(() => {
    if (commandPaletteArmed) return;
    function handleArmKey(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && (e.key === 'k' || e.key === 'K')) {
        setCommandPaletteArmed(true);
      }
    }
    window.addEventListener('keydown', handleArmKey);
    return () => window.removeEventListener('keydown', handleArmKey);
  }, [commandPaletteArmed]);
  // --- Progressive disclosure: ESSENTIAL sections (~10 items, visible by default) ---
  const essentialSections: NavSection[] = [
    {
      title: 'PRINCIPAL',
      items: [
        { to: '/dashboard', icon: BarChart3, label: 'Tableau de bord' },
        { to: '/messagerie', icon: MessageSquare, label: 'Messages' },
        { to: '/commandes', icon: ShoppingCart, label: 'Commandes' },
        { to: '/assistant', icon: Sparkles, label: 'Assistant IA' },
        { to: '/aide', icon: BookOpen, label: "Centre d'aide" },
      ],
    },
    {
      title: 'GESTION',
      items: [
        { to: '/recipes', icon: ClipboardList, label: 'Fiches techniques' },
        { to: '/ingredients', icon: ShoppingBasket, label: 'Ingrédients' },
        { to: '/inventory', icon: Package, label: 'Inventaire' },
        { to: '/menu-engineering', icon: Target, label: 'Menu Engineering' },
        { to: '/suppliers', icon: Truck, label: 'Fournisseurs' },
      ],
    },
  ];

  // --- ADVANCED sections (hidden by default, shown when advancedMode === true) ---
  const advancedSections: NavSection[] = [
    {
      title: 'PRINCIPAL +',
      items: [
        { to: '/menu', icon: BookOpen, label: 'La Carte' },
        { to: '/qr-menu', icon: QrCode, label: 'Menu QR Code' },
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
        { to: '/allergen-matrix', icon: Shield, label: 'Matrice allergenes' },
        { to: '/recettes-semaine', icon: ChefHat, label: 'Recettes semaine' },
        { to: '/negociation-ia', icon: Handshake, label: 'Négociation IA' },
        { to: '/simulateur-prix', icon: TrendingUp, label: 'Simulateur prix' },
        { to: '/saisonnalite', icon: Leaf, label: 'Saisonnalité' },
      ],
    },
    {
      title: 'GESTION +',
      items: [
        { to: '/gaspillage', icon: Trash2, label: 'Gaspillage' },
        { to: '/menu-calendar', icon: Calendar, label: 'Menu Calendrier' },
      ],
    },
    {
      title: 'OPERATIONS',
      items: [
        { to: '/service-tracker', icon: Timer, label: 'Suivi Service' },
        { to: '/planning', icon: CalendarDays, label: 'Planning' },
        { to: '/seminaires', icon: PartyPopper, label: 'Séminaires' },
        { to: '/rfqs', icon: FileSearch, label: "Appels d'offres" },
        { to: '/haccp', icon: ShieldCheck, label: 'HACCP' },
        { to: '/dlc-tracker', icon: Package, label: 'DLC / DLUO' },
        { to: '/checklist-service', icon: ClipboardList, label: 'Checklist service' },
        { to: '/chrono-preparation', icon: Timer, label: 'Chrono préparation' },
      ],
    },
    {
      title: 'COMMUNICATION',
      items: [
        { to: '/feedback', icon: MessageSquare, label: 'Avis clients' },
        { to: '/clients', icon: Contact, label: 'Clients CRM' },
        { to: '/bon-cadeau', icon: Gift, label: 'Bon cadeau' },
      ],
    },
    {
      title: 'BUSINESS',
      items: [
        { to: '/comptabilite', icon: Calculator, label: 'Comptabilité' },
        { to: '/devis', icon: FileText, label: 'Devis & Factures' },
        { to: '/marketplace', icon: Store, label: 'Marketplace' },
        { to: '/rentabilite', icon: Activity, label: 'Seuil de rentabilité' },
        { to: '/couverts-cible', icon: Users, label: 'Couverts cible' },
        { to: '/calculateur-tva', icon: Calculator, label: 'Calculateur TVA' },
        { to: '/cout-main-oeuvre', icon: Users, label: 'Coût main d\'œuvre' },
        { to: '/prime-saisonniere', icon: Gift, label: 'Prime saisonnière' },
        { to: '/roi-equipement', icon: TrendingUp, label: 'ROI Équipement' },
        { to: '/cout-couvert', icon: Utensils, label: 'Coût par couvert' },
        { to: '/livraison-rentabilite', icon: Truck, label: 'Rentabilité livraison' },
        // Integrations masqué pour l'instant
        { to: '/restaurants', icon: Building2, label: 'Restaurants' },
        { to: '/abonnement', icon: CreditCard, label: 'Mon abonnement' },
        { to: '/mes-parrainages', icon: Gift, label: 'Parrainage' },
      ],
    },
  ];

  // Bottom nav items (always visible at bottom of sidebar)
  const bottomNavItems: NavItem[] = [
    ...(user?.role === 'admin' ? [{ to: '/admin', icon: Shield, label: 'Administration' }] : []),
    ...(user?.role === 'admin' ? [{ to: '/admin/finance', icon: TrendingUp, label: 'Finance' }] : []),
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
          title={collapsed ? item.label : t('common.comingSoon')}
          data-tooltip={collapsed ? item.label : undefined}
          onClick={() => showToast(t('common.comingSoon'), 'info')}
          className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 group w-full opacity-50 cursor-not-allowed ${
            collapsed ? 'justify-center nav-tooltip-premium' : ''
          } text-[#9CA3AF] dark:text-mono-500`}
        >
          <span className="relative flex-shrink-0">
            <item.icon className="w-5 h-5" />
          </span>
          {!collapsed && (
            <>
              <span className="sidebar-label truncate">{item.label}</span>
              {item.badgeText && (
                <span className="ml-auto text-[9px] font-semibold uppercase tracking-wide bg-mono-900 text-[#6B7280] dark:bg-mono-200 dark:text-mono-500 px-1.5 py-0.5 rounded-full whitespace-nowrap">
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
              ? 'bg-mono-100 text-white dark:bg-white dark:text-[#000000] nav-item-active'
              : 'text-[#6B7280] dark:text-mono-500 hover:text-mono-100 dark:hover:text-white'
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
        <ChefHat className="w-8 h-8 text-mono-100 dark:text-white flex-shrink-0" />
        {!collapsed && <span className="text-lg font-bold logo-shimmer sidebar-label font-satoshi tracking-tight flex-1">RestauMargin</span>}
        <Suspense fallback={null}><NotificationCenter /></Suspense>

      </div>

      {/* A partir d'ici tout defile d'un seul tenant (2026-11-04) : sur telephone, les
          blocs fixes du haut et du bas ne laissaient que 4 entrees visibles au milieu
          (captures du fondateur). Seuls le logo et la ligne profil restent fixes. */}
      <div className="flex-1 min-h-0 overflow-y-auto sidebar-scroll">
      {/* Restaurant selector */}
      {!collapsed && (
        <div className="pt-3">
          <SidebarRestaurantSelector />
        </div>
      )}

      {/* Active users (collaboration indicators) */}
      {!collapsed && <ActiveUsers />}

      {/* Onboarding progress tracker */}
      {!collapsed && <Suspense fallback={null}><OnboardingProgress /></Suspense>}

      {/* Gamification Level Badge */}
      {!collapsed && <Suspense fallback={null}><SidebarLevelBadge /></Suspense>}

      {/* Stations : rangee compacte de trois tuiles (2026-11-04), empilees seulement en mode replie */}
      <div className={collapsed ? 'px-3 mb-3 mt-4 space-y-2' : 'px-3 mb-3 grid grid-cols-3 gap-2'}>
        <NavLink
          to="/station"
          title="Station Balance"
          aria-label="Station Balance"
          className={`${collapsed ? 'flex items-center justify-center px-3 py-2.5' : 'flex flex-col items-center justify-center gap-1 px-1 py-2 text-[11px] leading-tight text-center'} rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-semibold transition-colors w-full overflow-hidden`}
        >
          <Scale className="w-5 h-5 flex-shrink-0" />
          {!collapsed && <span className="sidebar-label truncate max-w-full">Balance</span>}
        </NavLink>
        <NavLink
          to="/kitchen-mode"
          title="Cuisine KDS"
          aria-label="Cuisine KDS"
          className={`${collapsed ? 'flex items-center justify-center px-3 py-2.5' : 'flex flex-col items-center justify-center gap-1 px-1 py-2 text-[11px] leading-tight text-center'} rounded-lg bg-mono-100 dark:bg-white hover:bg-[#333] dark:hover:bg-[#E5E5E5] text-white dark:text-mono-100 font-semibold transition-colors w-full overflow-hidden`}
        >
          <ChefHat className="w-5 h-5 flex-shrink-0" />
          {!collapsed && <span className="sidebar-label truncate max-w-full">Cuisine</span>}
        </NavLink>
        <NavLink
          to="/scanner-factures"
          title="Station Factures"
          aria-label="Station Factures"
          className={`${collapsed ? 'flex items-center justify-center px-3 py-2.5' : 'flex flex-col items-center justify-center gap-1 px-1 py-2 text-[11px] leading-tight text-center'} rounded-lg bg-amber-500 hover:bg-amber-400 text-white font-semibold transition-colors w-full overflow-hidden`}
        >
          <Receipt className="w-5 h-5 flex-shrink-0" />
          {!collapsed && <span className="sidebar-label truncate max-w-full">Factures</span>}
        </NavLink>
      </div>

      {/* Nav sections - scrollable area */}
      <nav aria-label="Navigation principale" className="px-3 space-y-1.5 pb-4">
        {/* Essential sections — always visible */}
        {essentialSections.map((section, idx) => (
          <div key={section.title} className={idx > 0 ? 'pt-4' : ''}>
            {!collapsed && idx > 0 && <div className="border-t border-mono-900/60 dark:border-white/5 mb-3" />}
            {!collapsed && (
              <div className="px-3 py-1.5 text-[9px] font-semibold tracking-[0.18em] text-[#9CA3AF] dark:text-mono-400 uppercase sidebar-label font-satoshi">
                {section.title}
              </div>
            )}
            {collapsed && <div className="border-t border-mono-900/60 dark:border-white/5 my-2" />}
            <div className="space-y-0.5">
              {section.items.map((item) => renderNavItem(item, collapsed))}
            </div>
          </div>
        ))}

        {/* Progressive disclosure toggle */}
        {!collapsed && (
          <div className="pt-4">
            <div className="border-t border-mono-900/60 dark:border-white/5 mb-3" />
            <button
              type="button"
              onClick={toggleAdvancedMode}
              aria-expanded={advancedMode}
              aria-controls="sidebar-advanced-tools"
              className="flex items-center gap-2 w-full px-3 py-1.5 text-[11px] font-medium text-[#9CA3AF] dark:text-mono-400 hover:text-mono-100 dark:hover:text-white transition-colors rounded-lg hover:bg-mono-950 dark:hover:bg-[#171717] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 focus-visible:ring-offset-1 group"
            >
              <ChevronDown
                className={`w-3.5 h-3.5 flex-shrink-0 transition-transform duration-200 ${advancedMode ? 'rotate-180' : ''}`}
              />
              <span className="tracking-[0.12em] uppercase font-satoshi">
                {advancedMode ? 'Masquer les outils' : 'Outils avancés'}
              </span>
              {!advancedMode && (
                <span className="ml-auto text-[9px] font-semibold bg-mono-950 dark:bg-mono-200 text-[#9CA3AF] dark:text-mono-400 px-1.5 py-0.5 rounded-full">
                  +{advancedSections.reduce((acc, s) => acc + s.items.length, 0)}
                </span>
              )}
            </button>
          </div>
        )}

        {/* Advanced sections — revealed on toggle */}
        {(advancedMode || collapsed) && (
          <div id="sidebar-advanced-tools">
            {advancedSections.map((section, idx) => (
              <div key={section.title} className="pt-4">
                {!collapsed && <div className="border-t border-mono-900/40 dark:border-white/[0.04] mb-3" />}
                {!collapsed && (
                  <div className="px-3 py-1.5 text-[9px] font-semibold tracking-[0.18em] text-[#C4C4C4] dark:text-mono-350 uppercase sidebar-label font-satoshi">
                    {section.title}
                  </div>
                )}
                {collapsed && idx === 0 && <div className="border-t border-mono-900/60 dark:border-white/5 my-2" />}
                <div className="space-y-0.5 opacity-90">
                  {section.items.map((item) => renderNavItem(item, collapsed))}
                </div>
              </div>
            ))}
          </div>
        )}
        {/* Compte : ces liens etaient epingles en bas et mangeaient la moitie de l'ecran sur telephone */}
        <div className="pt-4">
          {!collapsed && <div className="border-t border-mono-900/60 dark:border-white/5 mb-3" />}
          {!collapsed && (
            <div className="px-3 py-1.5 text-[9px] font-semibold tracking-[0.18em] text-[#9CA3AF] dark:text-mono-400 uppercase sidebar-label font-satoshi">
              Compte
            </div>
          )}
          <div className="space-y-0.5">
            {bottomNavItems.map((item) => renderNavItem(item, collapsed))}
            {installPrompt && !isInstalled && (
              <button
                onClick={handleInstall}
                className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-semibold bg-mono-100 dark:bg-white text-white dark:text-black hover:bg-[#333333] dark:hover:bg-[#E5E5E5] transition-colors w-full ${collapsed ? 'justify-center' : ''}`}
                title="Installer l'application"
              >
                <Download className="w-5 h-5 flex-shrink-0" />
                {!collapsed && <span className="sidebar-label">Installer l'app</span>}
              </button>
            )}
          </div>
        </div>
      </nav>
      </div>

      {/* Ligne profil, seule partie fixe en bas : profil, mode sombre, deconnexion */}
      <div className="flex-shrink-0 border-t border-mono-900/60 dark:border-white/5 px-3 py-2.5">
        <div className={`flex items-center gap-2 ${collapsed ? 'flex-col' : ''}`}>
          <div className="w-9 h-9 rounded-full bg-mono-100 dark:bg-white flex items-center justify-center text-white dark:text-black text-xs font-bold flex-shrink-0">
            {userInitials}
          </div>
          {!collapsed && (
            <div className="flex-1 min-w-0 sidebar-label">
              <div className="text-sm font-semibold text-mono-100 dark:text-white truncate">{user?.name || user?.email}</div>
              <div className="text-[11px] text-[#737373] dark:text-mono-500 truncate">
                {user?.role === 'admin' ? 'Administrateur' : 'Utilisateur'}
              </div>
            </div>
          )}
          <button
            onClick={() => setDarkMode(!darkMode)}
            title={darkMode ? 'Mode clair' : 'Mode sombre'}
            aria-label={darkMode ? 'Activer le mode clair' : 'Activer le mode sombre'}
            className="inline-flex items-center justify-center w-9 h-9 rounded-lg text-[#6B7280] dark:text-mono-500 hover:bg-mono-950 dark:hover:bg-[#171717] hover:text-mono-100 dark:hover:text-white transition-colors flex-shrink-0"
          >
            <span className="dark-mode-icon" key={darkMode ? 'sun' : 'moon'}>
              {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </span>
          </button>
          <button
            onClick={logout}
            title="Déconnexion"
            aria-label="Déconnexion"
            className="inline-flex items-center justify-center w-9 h-9 rounded-lg hover:bg-red-500/10 text-[#9CA3AF] dark:text-mono-500 hover:text-red-400 transition-colors flex-shrink-0"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen flex bg-white dark:bg-black text-mono-100 dark:text-white">
      {/* Premium top gradient line */}
      <div className="fixed top-0 left-0 right-0 z-[60] premium-top-line" />
      <a href="#main-content" className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[9999] focus:bg-teal-600 focus:text-white focus:px-4 focus:py-2 focus:rounded-lg focus:shadow-lg focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-teal-600 focus:font-semibold focus:text-sm">
        Aller au contenu principal
      </a>
      {/* Sidebar — always full width with labels (desktop + tablet) */}
      <aside className="hidden md:flex flex-col fixed top-0 left-0 w-64 sidebar-glass z-30 no-print" style={{ top: '2px', height: 'calc(100dvh - 2px)' }}>
        {sidebarContent(false)}
      </aside>

      {/* Mobile overlay sidebar */}
      {mobileMenuOpen && (
        <>
          {/* Backdrop */}
          <div
            className="md:hidden fixed inset-0 bg-black/60 backdrop-blur-sm z-[85]"
            onClick={() => setMobileMenuOpen(false)}
          />
          {/* Sidebar panel */}
              {/* FIX 2026-09-24 : inset-y-0 (top:0 + bottom:0) se resout en 100vh, qui sur
              mobile inclut la zone masquee par la barre d'adresse du navigateur — le bas
              du panneau (statut, profil, deconnexion) tombait donc hors de l'ecran.
              100dvh suit la hauteur REELLEMENT visible et se reajuste quand la barre
              se retracte. */}
          <aside className="md:hidden fixed top-0 left-0 w-72 sidebar-glass z-[90] no-print animate-slide-in" style={{ top: '2px', height: 'calc(100dvh - 2px)' }}>
            <button
              onClick={() => setMobileMenuOpen(false)}
              aria-label="Fermer le menu"
              className="absolute top-3 right-3 inline-flex items-center justify-center w-11 h-11 rounded-lg hover:bg-mono-950 dark:hover:bg-[#171717] text-[#9CA3AF] dark:text-mono-500 hover:text-mono-100 dark:hover:text-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 focus-visible:ring-offset-2"
            >
              <X className="w-5 h-5" />
            </button>
            {sidebarContent(false)}
          </aside>
        </>
      )}

      {/* Main content area */}
      <div className="flex-1 min-w-0 flex flex-col min-h-screen md:ml-64 ml-0" style={{ paddingTop: '2px' }}>
        {/* Mobile top bar */}
        {/* FIX 2026-09-24 : le header etait dans le flux normal, donc il defilait avec
            la page. Sur mobile, le bouton d'ouverture du menu disparaissait des qu'on
            descendait : il fallait remonter en haut de page pour naviguer. sticky top-0
            le garde accessible en permanence. z-30 le place sous le panneau (z-50) et
            son fond (z-40), pour qu'il ne passe pas par-dessus le menu ouvert. */}
        <header className="md:hidden sticky top-0 z-30 bg-white dark:bg-mono-50 border-b border-mono-900 dark:border-mono-200 px-4 py-3 flex items-center justify-between no-print">
          <button
            onClick={() => setMobileMenuOpen(true)}
            aria-label="Ouvrir le menu"
            className="inline-flex items-center justify-center w-11 h-11 rounded-lg hover:bg-mono-950 dark:hover:bg-[#171717] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 focus-visible:ring-offset-2"
          >
            <Menu className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-2">
            <ChefHat className="w-6 h-6 text-mono-100 dark:text-white" />
            <span className="font-bold text-mono-100 dark:text-white">RestauMargin</span>
          </div>
          <div className="flex items-center gap-1">
              <button onClick={() => { const e = new KeyboardEvent("keydown", { key: "k", ctrlKey: true }); window.dispatchEvent(e); }} aria-label="Rechercher" className="inline-flex items-center justify-center w-11 h-11 rounded-lg hover:bg-mono-950 dark:hover:bg-[#171717] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 focus-visible:ring-offset-2"><Search className="w-5 h-5 text-[#6B7280] dark:text-mono-500" /></button>
              <Suspense fallback={null}><NotificationCenter /></Suspense>
            </div>
        </header>

        {/* Connectivity + offline sync bars — lazy app-shell chrome (invisible fallback) */}
        <Suspense fallback={null}>
          <ConnectivityBar />
          <OfflineSyncBar />
        </Suspense>

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
            <div className="bg-mono-100 dark:bg-mono-50 border-b border-[#333333] dark:border-mono-200 text-white px-4 py-3 text-sm">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-10 h-10 rounded-xl bg-teal-600 flex items-center justify-center flex-shrink-0 shadow-lg shadow-teal-600/20">
                    <ChefHat className="w-5 h-5 text-white" />
                  </div>
                  <div className="min-w-0">
                    <div className="font-semibold truncate">Installer RestauMargin</div>
                    {subMessage && (
                      <div className="text-xs text-mono-700 mt-0.5">{subMessage}</div>
                    )}
                    {!subMessage && (
                      <div className="text-xs text-mono-700 mt-0.5">Acces rapide, fonctionne hors connexion</div>
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
                    <X className="w-4 h-4 text-mono-700" />
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
          if (!user?.trialEndsAt) return null;
          // Skip for paying users (pro/business)
          if (user.plan === 'pro' || user.plan === 'business') return null;
          const trialEnd = new Date(user.trialEndsAt);
          const now = new Date();
          const diffMs = trialEnd.getTime() - now.getTime();
          const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));
          const isExpired = diffDays <= 0;
          const isUrgent = diffDays > 0 && diffDays <= 3;

          if (!isExpired && !isUrgent) return null;
          // Amber (urgent) banners can be dismissed; red (expired) banners cannot
          if (!isExpired && trialBannerDismissed) return null;

          return (
            <div className={`border-b px-4 py-3 flex items-center justify-between text-sm font-medium ${
              isExpired
                ? 'bg-red-500/10 border-red-500/30 text-red-400'
                : 'bg-amber-500/15 border-amber-500/30 text-amber-300'
            }`}>
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 flex-shrink-0 animate-pulse" />
                <span>
                  {isExpired
                    ? 'Essai termine'
                    : `Votre essai expire dans ${diffDays} jour${diffDays > 1 ? 's' : ''}`
                  }
                </span>
              </div>
              <div className="flex items-center gap-3 ml-4 flex-shrink-0">
                <button
                  onClick={() => navigate('/abonnement')}
                  className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-colors shadow-sm ${
                    isExpired
                      ? 'bg-red-500 hover:bg-red-400 text-white'
                      : 'bg-amber-500 hover:bg-amber-400 text-white'
                  }`}
                >
                  S'abonner — 19 € par mois
                </button>
                {!isExpired && (
                  <button
                    onClick={() => { setTrialBannerDismissed(true); localStorage.setItem('trial-banner-dismissed', '1'); }}
                    className="p-1 hover:bg-white/10 rounded transition-colors"
                    aria-label="Fermer"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>
          );
        })()}

        {/* Content */}
        <main id="main-content" key={selectedRestaurant?.id ?? 'no-restaurant'} className="flex-1 w-full max-w-7xl mx-auto px-3 sm:px-6 py-4 sm:py-6 pb-20 md:pb-6 premium-content">
          <Breadcrumbs />
          <Suspense fallback={null}><WorkingIndicator /></Suspense>
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
              <Route path="/financial-intelligence" element={<TrialPaywallGuard feature="Intelligence financiere"><FinancialIntelligence /></TrialPaywallGuard>} />
              <Route path="/scanner-factures" element={<InvoiceScanner />} />
              <Route path="/actualites" element={<Actualites />} />
              <Route path="/mercuriale" element={<Mercuriale />} />
              <Route path="/menu-engineering" element={<MenuEngineering />} />
              <Route path="/allergen-matrix" element={<AllergenMatrix />} />
              <Route path="/qr-menu" element={<QRMenu />} />
              <Route path="/commandes" element={<AutoOrders />} />
              <Route path="/service-tracker" element={<ServiceTracker />} />
              <Route path="/kitchen-mode" element={<KitchenMode />} />
              <Route path="/planning" element={<Planning />} />
              <Route path="/seminaires" element={<Seminaires />} />
              <Route path="/haccp" element={<HACCPPage />} />
              <Route path="/recettes-semaine" element={<EditorialRecipes />} />
              <Route path="/negociation-ia" element={<TrialPaywallGuard feature="Negociation IA"><NegociationIA /></TrialPaywallGuard>} />
              <Route path="/assistant" element={<TrialPaywallGuard feature="Assistant IA"><AIAssistant /></TrialPaywallGuard>} />
              <Route path="/messagerie" element={<Messagerie />} />
              <Route path="/feedback" element={<FeedbackPage />} />
              <Route path="/clients" element={<Clients />} />
              <Route path="/marketplace" element={<Marketplace />} />
              <Route path="/fournisseur/:id" element={<FournisseurPromo />} />
              <Route path="/integrations" element={<Integrations />} />
              <Route path="/comptabilite" element={<Comptabilite />} />
              <Route path="/devis" element={<DevisPage />} />
              <Route path="/rentabilite" element={<BreakevenCalculator />} />
              <Route path="/couverts-cible" element={<CouvertsCible />} />
              <Route path="/calculateur-tva" element={<TvaCalculator />} />
              <Route path="/cout-main-oeuvre" element={<LaborCostCalculator />} />
              <Route path="/simulateur-prix" element={<PriceIncreaseSimulator />} />
              <Route path="/prime-saisonniere" element={<PrimeSaisonniere />} />
              <Route path="/dlc-tracker" element={<DlcTracker />} />
              <Route path="/checklist-service" element={<ChecklistService />} />
              <Route path="/chrono-preparation" element={<ChronoPreparation />} />
              <Route path="/saisonnalite" element={<SaisonnaliteIngredients />} />
              <Route path="/roi-equipement" element={<RoiEquipement />} />
              <Route path="/cout-couvert" element={<CoutCouvert />} />
              <Route path="/livraison-rentabilite" element={<LivraisonRentabilite />} />
              <Route path="/bon-cadeau" element={<BonCadeau />} />
              <Route path="/restaurants" element={<TrialPaywallGuard feature="Multi-restaurant"><Restaurants /></TrialPaywallGuard>} />
              <Route path="/pricing" element={<Pricing />} />
              <Route path="/abonnement" element={<Subscription />} />
              <Route path="/settings" element={<SettingsPage />} />
              <Route path="/users" element={<UserManagement />} />
              <Route path="/admin" element={<AdminDashboard />} />
              <Route path="/mon-score" element={<GamificationPage />} />
              <Route path="/mes-parrainages" element={<Suspense fallback={<div className="min-h-screen flex items-center justify-center"><Loader2 className="w-8 h-8 text-teal-500 animate-spin" /></div>}><MesParrainages /></Suspense>} />
              <Route path="/reactivation" element={<Suspense fallback={<div className="min-h-screen flex items-center justify-center"><Loader2 className="w-8 h-8 text-teal-500 animate-spin" /></div>}><TrialReactivate /></Suspense>} />
              <Route path="/admin/metrics" element={<Suspense fallback={<div className="min-h-screen flex items-center justify-center"><Loader2 className="w-8 h-8 text-teal-500 animate-spin" /></div>}><AdminMetrics /></Suspense>} />
              <Route path="/admin/finance" element={<Suspense fallback={<div className="min-h-screen flex items-center justify-center"><Loader2 className="w-8 h-8 text-teal-500 animate-spin" /></div>}><AdminFinance /></Suspense>} />
              <Route path="/admin/outreach" element={<Suspense fallback={<div className="min-h-screen flex items-center justify-center"><Loader2 className="w-8 h-8 text-teal-500 animate-spin" /></div>}><OutreachMailer /></Suspense>} />
              <Route path="/email-marketing" element={<EmailMarketing />} />
              <Route path="/aide" element={<Suspense fallback={<div className="min-h-screen flex items-center justify-center"><Loader2 className="w-8 h-8 text-teal-500 animate-spin" /></div>}><HelpPage /></Suspense>} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
          </div>
        </main>

        {/* Footer */}
        <footer className="bg-white/80 dark:bg-mono-50/80 backdrop-blur-sm border-t border-mono-900 dark:border-mono-200 py-3 pb-16 md:pb-3 text-center text-xs text-[#9CA3AF] dark:text-mono-500 no-print">
          RestauMargin &copy; {new Date().getFullYear()} &mdash; Gestion de marge pour la restauration
        </footer>
      </div>

      {/* Command Palette (Ctrl+K) — lazy-loaded on first shortcut press */}
      {commandPaletteArmed && (
        <Suspense fallback={null}>
          <CommandPalette />
        </Suspense>
      )}
      {/* App-shell overlays — lazy-loaded off the critical path (invisible null fallback).
          Behavior unchanged : same mount lifecycle, just fetched as async chunks. */}
      <Suspense fallback={null}>
        <ShortcutsModal open={showShortcutsModal} onClose={() => setShowShortcutsModal(false)} />
        {/* Contextual tooltips for first-visit pages */}
        <ContextualTooltips />
        {/* Floating FAB bubble — single button that expands */}
        <FloatingActionBubble />
        {/* Mobile bottom navigation bar */}
        <MobileBottomNav />
        {/* NPS survey — shows at J+14 after first login, once per user */}
        <NPSModal />
      </Suspense>

      {/* Onboarding Wizard for new users — lazy-loaded (only rendered when needed) */}
      {showOnboarding && (
        <Suspense fallback={null}>
          <OnboardingWizard onComplete={() => setShowOnboarding(false)} />
        </Suspense>
      )}
    </div>
  );
}

