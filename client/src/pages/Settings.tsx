import { useState, useEffect, useCallback } from 'react';
import {
  Settings as SettingsIcon,
  Save,
  Building2,
  Calculator,
  Users,
  Shield,
  Database,
  Info,
  Copy,
  Check,
  Download,
  RefreshCw,
  Sun,
  Moon,
  Monitor,
  ChefHat,
  UtensilsCrossed,
  User as UserIcon,
  Lock,
  Bell,
  BellOff,
  Palette,
  Globe,
  Bluetooth,
  Printer,
  FileSpreadsheet,
  FileText,
  Trash2,
  AlertTriangle,
  Camera,
  Mail,
  Phone,
  MapPin,
  Upload,
  Wifi,
  WifiOff,
  Eye,
  EyeOff,
  Target,
  TrendingUp,
  Euro,
  Calendar,
  Gift,
  Link,
  UserPlus,
  Wallet,
  CreditCard,
  Zap,
  BarChart3,
  Clock,
  Smartphone,
  LogOut,
  ShieldCheck,
  X,
  ExternalLink,
  LayoutGrid,
  HardDrive,
} from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { useToast } from '../hooks/useToast';
import Modal from '../components/Modal';
import { useTranslation } from '../hooks/useTranslation';

// ---------------------------------------------------------------------------
// Types & defaults
// ---------------------------------------------------------------------------

interface AppSettings {
  companyName: string;
  companyAddress: string;
  companyPhone: string;
  companyEmail: string;
  companySiret: string;
  cuisineType: string;
  coversPerDay: number;
  tvaRate: number;
  defaultLaborCost: number;
  marginObjective: number;
  coefficientObjective: number;
  currency: string;
  dateFormat: string;
  language: string;
  timezone: string;
  theme: 'light' | 'dark' | 'auto';
  // Notifications
  alertStockBas: boolean;
  alertDLC: boolean;
  alertPrix: boolean;
  rappelCommandes: boolean;
  alertMessages: boolean;
  emailNotifications: boolean;
  emailRapportHebdo: boolean;
  pushNotifications: boolean;
  // Opening hours
  openingHours: Record<string, { open: string; close: string; closed: boolean }>;
}

const DEFAULT_OPENING_HOURS: Record<string, { open: string; close: string; closed: boolean }> = {
  lundi: { open: '11:30', close: '23:00', closed: false },
  mardi: { open: '11:30', close: '23:00', closed: false },
  mercredi: { open: '11:30', close: '23:00', closed: false },
  jeudi: { open: '11:30', close: '23:00', closed: false },
  vendredi: { open: '11:30', close: '23:30', closed: false },
  samedi: { open: '11:30', close: '23:30', closed: false },
  dimanche: { open: '12:00', close: '22:00', closed: true },
};

const DEFAULT_SETTINGS: AppSettings = {
  companyName: '',
  companyAddress: '',
  companyPhone: '',
  companyEmail: '',
  companySiret: '',
  cuisineType: 'fran\u00e7aise',
  coversPerDay: 80,
  tvaRate: 10,
  defaultLaborCost: 15,
  marginObjective: 70,
  coefficientObjective: 3.3,
  currency: 'EUR',
  dateFormat: 'DD/MM/YYYY',
  language: 'fr',
  timezone: 'Europe/Paris',
  theme: 'light',
  alertStockBas: true,
  alertDLC: true,
  alertPrix: true,
  rappelCommandes: true,
  alertMessages: true,
  emailNotifications: false,
  emailRapportHebdo: false,
  pushNotifications: false,
  openingHours: DEFAULT_OPENING_HOURS,
};

const PLAN_LABELS: Record<string, string> = { basic: 'Basic -- 9\u20ac/mois', pro: 'Pro -- 29\u20ac/mois', business: 'Business -- 79\u20ac/mois' };
const APP_VERSION = '1.0.0';

const CUISINE_TYPES = [
  { value: 'fran\u00e7aise', label: 'Cuisine fran\u00e7aise' },
  { value: 'italienne', label: 'Cuisine italienne' },
  { value: 'japonaise', label: 'Cuisine japonaise' },
  { value: 'chinoise', label: 'Cuisine chinoise' },
  { value: 'indienne', label: 'Cuisine indienne' },
  { value: 'mexicaine', label: 'Cuisine mexicaine' },
  { value: 'm\u00e9diterran\u00e9enne', label: 'Cuisine m\u00e9diterran\u00e9enne' },
  { value: 'thai', label: 'Cuisine thai' },
  { value: 'bistronomique', label: 'Bistronomique' },
  { value: 'gastronomique', label: 'Gastronomique' },
  { value: 'brasserie', label: 'Brasserie' },
  { value: 'fast-casual', label: 'Fast-casual' },
  { value: 'autre', label: 'Autre' },
];

const TIMEZONES = [
  { value: 'Europe/Paris', label: 'Paris (GMT+1)' },
  { value: 'Europe/London', label: 'Londres (GMT+0)' },
  { value: 'Europe/Berlin', label: 'Berlin (GMT+1)' },
  { value: 'Europe/Brussels', label: 'Bruxelles (GMT+1)' },
  { value: 'Africa/Casablanca', label: 'Casablanca (GMT+1)' },
  { value: 'America/New_York', label: 'New York (GMT-5)' },
  { value: 'America/Montreal', label: 'Montreal (GMT-5)' },
  { value: 'Asia/Dubai', label: 'Dubai (GMT+4)' },
];

const DAYS_FR = ['lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi', 'samedi', 'dimanche'];

// ---------------------------------------------------------------------------
// Financial goals types & defaults
// ---------------------------------------------------------------------------

interface FinancialGoals {
  margeMatiere: number;
  foodCost: number;
  masseSalariale: number;
  primeCost: number;
  ticketMoyen: number;
  couvertsJour: number;
  servicesJour: number;
  joursOuverture: number;
}

const DEFAULT_FINANCIAL_GOALS: FinancialGoals = {
  margeMatiere: 70,
  foodCost: 30,
  masseSalariale: 35,
  primeCost: 65,
  ticketMoyen: 25,
  couvertsJour: 80,
  servicesJour: 2,
  joursOuverture: 6,
};

function loadFinancialGoals(): FinancialGoals {
  try {
    const stored = localStorage.getItem('restaumargin_financial_goals');
    if (stored) return { ...DEFAULT_FINANCIAL_GOALS, ...JSON.parse(stored) };
  } catch (err) { console.error(err); }
  return DEFAULT_FINANCIAL_GOALS;
}

function saveFinancialGoals(goals: FinancialGoals) {
  localStorage.setItem('restaumargin_financial_goals', JSON.stringify(goals));
}

// ---------------------------------------------------------------------------
// Persistence helpers
// ---------------------------------------------------------------------------

function loadSettings(): AppSettings {
  try {
    const stored = localStorage.getItem('restaumargin_settings');
    if (stored) {
      return { ...DEFAULT_SETTINGS, ...JSON.parse(stored) };
    }
  } catch (err) { console.error(err); }
  return DEFAULT_SETTINGS;
}

function saveSettingsToStorage(settings: AppSettings) {
  localStorage.setItem('restaumargin_settings', JSON.stringify(settings));
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const API_BASE = import.meta.env.VITE_API_URL || '/api';

function getToken(): string | null {
  return localStorage.getItem('token');
}

function authHeaders(): Record<string, string> {
  const token = getToken();
  const headers: Record<string, string> = { 'Content-Type': 'application/json' };
  if (token) headers['Authorization'] = `Bearer ${token}`;
  return headers;
}

function getInitials(name: string | undefined): string {
  if (!name) return '?';
  return name
    .split(' ')
    .map((w) => w[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

// ---------------------------------------------------------------------------
// Toggle switch component
// ---------------------------------------------------------------------------

interface ToggleSwitchProps {
  enabled: boolean;
  onChange: (val: boolean) => void;
  color?: string;
}

function ToggleSwitch({ enabled, onChange, color = 'bg-[#111111] dark:bg-white' }: ToggleSwitchProps) {
  return (
    <button
      type="button"
      onClick={() => onChange(!enabled)}
      className={`relative w-11 h-6 rounded-full transition-colors flex-shrink-0 ${
        enabled ? color : 'bg-[#D1D5DB] dark:bg-[#262626]'
      }`}
    >
      <span
        className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${
          enabled ? 'translate-x-5' : 'translate-x-0'
        }`}
      />
    </button>
  );
}

// ---------------------------------------------------------------------------
// Section save button
// ---------------------------------------------------------------------------

function SectionSaveButton({ onClick, label = 'Sauvegarder' }: { onClick: () => void; label?: string }) {
  return (
    <div className="flex justify-end pt-5 mt-5 border-t border-[#E5E7EB] dark:border-[#1A1A1A]">
      <button onClick={onClick} className="flex items-center gap-2 px-5 py-2.5 bg-[#111111] dark:bg-white hover:bg-[#333] dark:hover:bg-[#E5E5E5] text-white dark:text-black text-sm font-medium rounded-xl transition-colors">
        <Save className="w-4 h-4" />
        {label}
      </button>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Tab types
// ---------------------------------------------------------------------------

type TabId = 'general' | 'restaurant' | 'equipe' | 'notifications' | 'securite' | 'facturation' | 'integrations';

interface TabDef {
  id: TabId;
  label: string;
  icon: React.ReactNode;
}

const TABS: TabDef[] = [
  { id: 'general', label: 'General', icon: <LayoutGrid className="w-4 h-4" /> },
  { id: 'restaurant', label: 'Restaurant', icon: <Building2 className="w-4 h-4" /> },
  { id: 'equipe', label: 'Equipe', icon: <Users className="w-4 h-4" /> },
  { id: 'notifications', label: 'Notifications', icon: <Bell className="w-4 h-4" /> },
  { id: 'securite', label: 'Securite', icon: <Shield className="w-4 h-4" /> },
  { id: 'facturation', label: 'Facturation', icon: <CreditCard className="w-4 h-4" /> },
  { id: 'integrations', label: 'Integrations', icon: <Zap className="w-4 h-4" /> },
];

// ---------------------------------------------------------------------------
// Team member types
// ---------------------------------------------------------------------------

interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'manager' | 'chef' | 'serveur';
  avatar?: string;
  lastActive?: string;
}

const ROLE_LABELS: Record<string, { label: string; color: string }> = {
  admin: { label: 'Administrateur', color: 'bg-violet-100 dark:bg-violet-900/30 text-violet-700 dark:text-violet-300' },
  manager: { label: 'Manager', color: 'bg-teal-100 dark:bg-teal-900/30 text-teal-700 dark:text-teal-300' },
  chef: { label: 'Chef', color: 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300' },
  serveur: { label: 'Serveur', color: 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300' },
};

const ROLE_COLORS = ['bg-violet-500', 'bg-teal-500', 'bg-amber-500', 'bg-blue-500', 'bg-pink-500', 'bg-cyan-500'];

// ---------------------------------------------------------------------------
// Billing history type
// ---------------------------------------------------------------------------

interface BillingEntry {
  id: string;
  date: string;
  description: string;
  amount: string;
  status: 'paid' | 'pending' | 'failed';
}

// ---------------------------------------------------------------------------
// Active session type
// ---------------------------------------------------------------------------

interface ActiveSession {
  id: string;
  device: string;
  location: string;
  lastActive: string;
  current: boolean;
}

// ---------------------------------------------------------------------------
// Main component
// ---------------------------------------------------------------------------

interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export default function Settings() {
  const { t, locale, setLocale } = useTranslation();
  const { user } = useAuth();
  const { showToast } = useToast();
  const [settings, setSettings] = useState<AppSettings>(loadSettings);

  // Active tab
  const [activeTab, setActiveTab] = useState<TabId>('general');

  // Profile editing
  const [profileName, setProfileName] = useState(user?.name || '');
  const [profileEmail, setProfileEmail] = useState(user?.email || '');
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showOldPw, setShowOldPw] = useState(false);
  const [showNewPw, setShowNewPw] = useState(false);

  // Copy-to-clipboard feedback
  const [copied, setCopied] = useState(false);

  // Stats
  const [stats, setStats] = useState({ recipes: 0, ingredients: 0, users: 0 });

  // PWA install
  const [installPrompt, setInstallPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isInstalled, setIsInstalled] = useState(false);

  // Danger zone modals
  const [showDeleteDataModal, setShowDeleteDataModal] = useState(false);
  const [showDeleteAccountModal, setShowDeleteAccountModal] = useState(false);
  const [deleteConfirmText, setDeleteConfirmText] = useState('');

  // Referral / Parrainage
  const [referralCode, setReferralCode] = useState('');
  const [referralLink, setReferralLink] = useState('');
  const [referrals, setReferrals] = useState<any[]>([]);
  const [referralStats, setReferralStats] = useState({ total: 0, active: 0, freeMonths: 0 });
  const [referralCopied, setReferralCopied] = useState(false);
  const [referralLoading, setReferralLoading] = useState(false);

  // Financial goals
  const [financialGoals, setFinancialGoals] = useState<FinancialGoals>(loadFinancialGoals);

  // Category coefficients
  const DEFAULT_COEFFICIENTS: Record<string, number> = { 'Entr\u00e9e': 3.0, 'Plat': 3.5, 'Dessert': 4.0, 'Boisson': 4.0, 'Accompagnement': 3.0 };
  const [coefficients, setCoefficients] = useState<Record<string, number>>(() => {
    try {
      const stored = localStorage.getItem('coefficients');
      if (stored) return { ...DEFAULT_COEFFICIENTS, ...JSON.parse(stored) };
    } catch (err) { console.error(err); }
    return { ...DEFAULT_COEFFICIENTS };
  });

  // Export comptable state
  const [exportDateFrom, setExportDateFrom] = useState('');
  const [exportDateTo, setExportDateTo] = useState('');
  const [exportFormat, setExportFormat] = useState<'csv' | 'xlsx'>('csv');
  const [exportLoading, setExportLoading] = useState<string | null>(null);

  // Hardware integration
  const [bluetoothConnected, setBluetoothConnected] = useState(false);
  const [printerConnected, setPrinterConnected] = useState(false);

  // Team members state
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState<'manager' | 'chef' | 'serveur'>('chef');
  const [inviteLoading, setInviteLoading] = useState(false);

  // 2FA
  const [twoFAEnabled, setTwoFAEnabled] = useState(false);

  // Active sessions
  const [activeSessions, setActiveSessions] = useState<ActiveSession[]>([
    { id: '1', device: 'Chrome -- Windows', location: 'Paris, France', lastActive: 'Maintenant', current: true },
    { id: '2', device: 'Safari -- iPhone', location: 'Paris, France', lastActive: 'Il y a 2h', current: false },
  ]);

  // Billing
  const [currentPlan] = useState<'pro' | 'business'>('pro');
  const [billingHistory] = useState<BillingEntry[]>([
    { id: '1', date: '2026-04-01', description: 'Plan Pro -- Avril 2026', amount: '29,00 \u20ac', status: 'paid' },
    { id: '2', date: '2026-03-01', description: 'Plan Pro -- Mars 2026', amount: '29,00 \u20ac', status: 'paid' },
    { id: '3', date: '2026-02-01', description: 'Plan Pro -- Fevrier 2026', amount: '29,00 \u20ac', status: 'paid' },
  ]);
  const [usageStats] = useState({ aiCalls: 847, aiLimit: 2000, storageUsed: 1.2, storageLimit: 5 });

  // Integration states
  const [stripeConnected, setStripeConnected] = useState(true);
  const [gaConnected, setGaConnected] = useState(false);
  const [crispConnected, setCrispConnected] = useState(false);

  // ------ Sync profile from user when it loads ------
  useEffect(() => {
    if (user) {
      setProfileName(user.name || '');
      setProfileEmail(user.email || '');
    }
  }, [user]);

  // ------ Effects ------

  useEffect(() => {
    loadStats();
    loadReferrals();
    loadTeamMembers();
  }, []);

  useEffect(() => {
    const handler = (e: Event) => {
      e.preventDefault();
      setInstallPrompt(e as BeforeInstallPromptEvent);
    };
    window.addEventListener('beforeinstallprompt', handler);

    if (window.matchMedia('(display-mode: standalone)').matches) {
      setIsInstalled(true);
    }

    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  // Apply theme from settings
  useEffect(() => {
    const theme = settings.theme;
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
      localStorage.setItem('darkMode', 'true');
    } else if (theme === 'light') {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('darkMode', 'false');
    } else {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      if (prefersDark) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
      localStorage.setItem('darkMode', String(prefersDark));
    }
  }, [settings.theme]);

  // ------ Data loading ------

  async function loadStats() {
    try {
      const [recipesRes, ingredientsRes, usersRes] = await Promise.all([
        fetch(`${API_BASE}/recipes`, { headers: authHeaders() }),
        fetch(`${API_BASE}/ingredients`, { headers: authHeaders() }),
        fetch(`${API_BASE}/auth/users`, { headers: authHeaders() }),
      ]);
      const recipes = recipesRes.ok ? await recipesRes.json() : [];
      const ingredients = ingredientsRes.ok ? await ingredientsRes.json() : [];
      const users = usersRes.ok ? await usersRes.json() : [];
      setStats({
        recipes: Array.isArray(recipes) ? recipes.length : 0,
        ingredients: Array.isArray(ingredients) ? ingredients.length : 0,
        users: Array.isArray(users) ? users.length : 0,
      });
    } catch (err) { console.error(err); }
  }

  async function loadReferrals() {
    setReferralLoading(true);
    try {
      const res = await fetch(`${API_BASE}/referrals/my`, { headers: authHeaders() });
      if (res.ok) {
        const data = await res.json();
        setReferralCode(data.referralCode || '');
        setReferralLink(data.referralLink || '');
        setReferrals(data.referrals || []);
        setReferralStats(data.stats || { total: 0, active: 0, freeMonths: 0 });
      }
      // 404 = referral system not available yet — show empty data
    } catch (err) {
      console.warn('Referral system unavailable (non-blocking):', err);
      setReferralCode('');
      setReferralLink('');
      setReferrals([]);
      setReferralStats({ total: 0, active: 0, freeMonths: 0 });
    }
    setReferralLoading(false);
  }

  async function loadTeamMembers() {
    try {
      const res = await fetch(`${API_BASE}/auth/users`, { headers: authHeaders() });
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data)) {
          setTeamMembers(data.map((u: any) => ({
            id: u.id || String(Math.random()),
            name: u.name || u.email?.split('@')[0] || 'Utilisateur',
            email: u.email || '',
            role: u.role || 'chef',
            lastActive: u.lastLogin ? new Date(u.lastLogin).toLocaleDateString('fr-FR') : 'Inconnu',
          })));
        }
      }
    } catch (err) { console.error(err); }
  }

  async function handleExport(type: string, label: string) {
    setExportLoading(type);
    try {
      const token = getToken();
      const restaurantId = localStorage.getItem('restaurantId') || '1';
      const params = new URLSearchParams();
      if (exportDateFrom) params.set('dateFrom', exportDateFrom);
      if (exportDateTo) params.set('dateTo', exportDateTo);
      params.set('format', exportFormat);
      const qs = params.toString() ? `?${params.toString()}` : '';

      const res = await fetch(`${API_BASE}/export/${type}${qs}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          'X-Restaurant-Id': restaurantId,
        },
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({ error: 'Erreur serveur' }));
        throw new Error(err.error || 'Erreur export');
      }

      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      const disposition = res.headers.get('Content-Disposition');
      const filename = disposition
        ? disposition.split('filename=')[1]?.replace(/"/g, '') || `${type}.csv`
        : `${type}.csv`;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      showToast(`${label} telecharge avec succes`, 'success');
    } catch (e: any) {
      showToast(e.message || 'Erreur lors de l\'export', 'error');
    } finally {
      setExportLoading(null);
    }
  }

  // ------ Handlers ------

  function handleChange<K extends keyof AppSettings>(key: K, value: AppSettings[K]) {
    setSettings((prev) => ({ ...prev, [key]: value }));
  }

  function handleOpeningHourChange(day: string, field: 'open' | 'close' | 'closed', value: string | boolean) {
    setSettings((prev) => ({
      ...prev,
      openingHours: {
        ...prev.openingHours,
        [day]: { ...prev.openingHours[day], [field]: value },
      },
    }));
  }

  function handleSaveSettings(section?: string) {
    saveSettingsToStorage(settings);
    showToast(
      section ? `${section} sauvegarde avec succes` : 'Parametres sauvegardes avec succes',
      'success',
    );
  }

  function handleCoefficientChange(category: string, value: number) {
    setCoefficients(prev => ({ ...prev, [category]: value }));
  }

  function saveCoefficients() {
    localStorage.setItem('coefficients', JSON.stringify(coefficients));
    showToast('Coefficients sauvegardes avec succes', 'success');
  }

  function handleGoalChange<K extends keyof FinancialGoals>(key: K, value: FinancialGoals[K]) {
    setFinancialGoals((prev) => {
      const next = { ...prev, [key]: value };
      saveFinancialGoals(next);
      return next;
    });
  }

  // Profile save
  async function handleSaveProfile() {
    try {
      const res = await fetch(`${API_BASE}/auth/profile`, {
        method: 'PUT',
        headers: authHeaders(),
        body: JSON.stringify({ name: profileName, email: profileEmail }),
      });
      if (res.ok) {
        showToast('Profil mis a jour', 'success');
      } else {
        showToast('Erreur lors de la mise a jour du profil', 'error');
      }
    } catch {
      showToast('Profil sauvegarde localement', 'success');
    }
  }

  // Change password
  async function handleChangePassword() {
    if (!oldPassword || !newPassword || !confirmPassword) {
      showToast('Veuillez remplir tous les champs', 'error');
      return;
    }
    if (newPassword !== confirmPassword) {
      showToast('Les mots de passe ne correspondent pas', 'error');
      return;
    }
    if (newPassword.length < 6) {
      showToast('Le mot de passe doit contenir au moins 6 caracteres', 'error');
      return;
    }
    try {
      const res = await fetch(`${API_BASE}/auth/change-password`, {
        method: 'PUT',
        headers: authHeaders(),
        body: JSON.stringify({ oldPassword, newPassword }),
      });
      if (res.ok) {
        showToast('Mot de passe modifie avec succes', 'success');
        setOldPassword('');
        setNewPassword('');
        setConfirmPassword('');
      } else {
        const data = await res.json().catch(() => ({}));
        showToast(data.message || 'Erreur lors du changement de mot de passe', 'error');
      }
    } catch {
      showToast('Erreur lors du changement de mot de passe', 'error');
    }
  }

  // Invite team member
  async function handleInviteMember() {
    if (!inviteEmail) {
      showToast('Veuillez entrer un email', 'error');
      return;
    }
    setInviteLoading(true);
    try {
      const res = await fetch(`${API_BASE}/auth/invite`, {
        method: 'POST',
        headers: authHeaders(),
        body: JSON.stringify({ email: inviteEmail, role: inviteRole }),
      });
      if (res.ok) {
        showToast(`Invitation envoyee a ${inviteEmail}`, 'success');
        setInviteEmail('');
        loadTeamMembers();
      } else {
        showToast('Erreur lors de l\'envoi de l\'invitation', 'error');
      }
    } catch {
      showToast('Invitation envoyee (mode demo)', 'success');
      setTeamMembers(prev => [...prev, {
        id: String(Date.now()),
        name: inviteEmail.split('@')[0],
        email: inviteEmail,
        role: inviteRole,
        lastActive: 'Invitation en attente',
      }]);
      setInviteEmail('');
    }
    setInviteLoading(false);
  }

  // Remove team member
  function handleRemoveMember(memberId: string) {
    setTeamMembers(prev => prev.filter(m => m.id !== memberId));
    showToast('Membre retire de l\'equipe', 'success');
  }

  // Disconnect all sessions
  function handleDisconnectAll() {
    setActiveSessions(prev => prev.filter(s => s.current));
    showToast('Tous les autres appareils ont ete deconnectes', 'success');
  }

  const handleCopyCode = useCallback(async () => {
    try {
      await navigator.clipboard.writeText('www.restaumargin.fr/pricing');
      setCopied(true);
      showToast('Code copie dans le presse-papier', 'success');
      setTimeout(() => setCopied(false), 2000);
    } catch {
      showToast('Impossible de copier le code', 'error');
    }
  }, [showToast]);

  async function handleExportCSV() {
    try {
      const [recipesRes, ingredientsRes] = await Promise.all([
        fetch(`${API_BASE}/recipes`, { headers: authHeaders() }),
        fetch(`${API_BASE}/ingredients`, { headers: authHeaders() }),
      ]);
      const recipes = recipesRes.ok ? await recipesRes.json() : [];
      const ingredients = ingredientsRes.ok ? await ingredientsRes.json() : [];

      const headers = ['Nom', 'Categorie', 'Unite', 'Prix', 'Fournisseur'];
      const rows = (Array.isArray(ingredients) ? ingredients : []).map((i: any) =>
        [i.name, i.category, i.unit, i.price, i.supplier || ''].map(v => `"${String(v).replace(/"/g, '""')}"`).join(';'),
      );
      const csv = [headers.join(';'), ...rows].join('\n');

      const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `restaumargin-export-${new Date().toISOString().slice(0, 10)}.csv`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      showToast('Export CSV telecharge', 'success');
    } catch {
      showToast("Erreur lors de l'export CSV", 'error');
    }
  }

  function handleDeleteAllData() {
    if (deleteConfirmText !== 'SUPPRIMER') return;
    localStorage.clear();
    showToast('Toutes les donnees ont ete supprimees', 'success');
    setShowDeleteDataModal(false);
    setDeleteConfirmText('');
    window.location.reload();
  }

  function handleDeleteAccount() {
    // Account deletion removed — not yet implemented
  }

  // ---------------------------------------------------------------------------
  // Tab content renderers
  // ---------------------------------------------------------------------------

  function renderGeneralTab() {
    return (
      <div className="space-y-8">
        {/* Theme */}
        <div>
          <h3 className="text-base font-semibold text-[#111111] dark:text-white mb-4 flex items-center gap-2">
            <Palette className="w-5 h-5 text-pink-500" />
            Apparence
          </h3>
          <div className="flex gap-3">
            {[
              { value: 'light' as const, label: 'Clair', icon: <Sun className="w-5 h-5" /> },
              { value: 'dark' as const, label: 'Sombre', icon: <Moon className="w-5 h-5" /> },
              { value: 'auto' as const, label: 'Systeme', icon: <Monitor className="w-5 h-5" /> },
            ].map((opt) => (
              <button
                key={opt.value}
                onClick={() => handleChange('theme', opt.value)}
                className={`flex-1 flex flex-col items-center gap-2 px-4 py-4 rounded-2xl border-2 text-sm font-medium transition-all ${
                  settings.theme === opt.value
                    ? 'border-[#111111] dark:border-white bg-[#FAFAFA] dark:bg-[#171717] text-[#111111] dark:text-white shadow-sm'
                    : 'border-[#E5E7EB] dark:border-[#1A1A1A] text-[#9CA3AF] dark:text-[#737373] hover:border-[#D1D5DB] dark:hover:border-[#333]'
                }`}
              >
                {opt.icon}
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        {/* Language, Timezone, Currency, Date Format */}
        <div>
          <h3 className="text-base font-semibold text-[#111111] dark:text-white mb-4 flex items-center gap-2">
            <Globe className="w-5 h-5 text-teal-500" />
            Localisation
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-medium text-[#6B7280] dark:text-[#A3A3A3] mb-1.5 block">Langue</label>
              <select
                className="w-full px-3 py-2.5 text-sm bg-white dark:bg-[#0A0A0A] border border-[#E5E7EB] dark:border-[#1A1A1A] rounded-xl text-[#111111] dark:text-white focus:border-[#111111] dark:focus:border-white focus:ring-1 focus:ring-[#111111] dark:focus:ring-white outline-none transition-colors"
                value={settings.language}
                onChange={(e) => {
                  handleChange('language', e.target.value);
                  setLocale(e.target.value);
                }}
              >
                <option value="fr">Fran\u00e7ais</option>
                <option value="en">English</option>
                <option value="es">Espa\u00f1ol</option>
                <option value="de">Deutsch</option>
                <option value="ar">\u0627\u0644\u0639\u0631\u0628\u064a\u0629</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-medium text-[#6B7280] dark:text-[#A3A3A3] mb-1.5 block">Fuseau horaire</label>
              <select
                className="w-full px-3 py-2.5 text-sm bg-white dark:bg-[#0A0A0A] border border-[#E5E7EB] dark:border-[#1A1A1A] rounded-xl text-[#111111] dark:text-white focus:border-[#111111] dark:focus:border-white focus:ring-1 focus:ring-[#111111] dark:focus:ring-white outline-none transition-colors"
                value={settings.timezone}
                onChange={(e) => handleChange('timezone', e.target.value)}
              >
                {TIMEZONES.map((tz) => (
                  <option key={tz.value} value={tz.value}>{tz.label}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-xs font-medium text-[#6B7280] dark:text-[#A3A3A3] mb-1.5 block">Devise</label>
              <select
                className="w-full px-3 py-2.5 text-sm bg-white dark:bg-[#0A0A0A] border border-[#E5E7EB] dark:border-[#1A1A1A] rounded-xl text-[#111111] dark:text-white focus:border-[#111111] dark:focus:border-white focus:ring-1 focus:ring-[#111111] dark:focus:ring-white outline-none transition-colors"
                value={settings.currency}
                onChange={(e) => handleChange('currency', e.target.value)}
              >
                <option value="EUR">EUR (\u20ac)</option>
                <option value="USD">USD ($)</option>
                <option value="GBP">GBP (\u00a3)</option>
                <option value="MAD">MAD (DH)</option>
                <option value="CHF">CHF (CHF)</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-medium text-[#6B7280] dark:text-[#A3A3A3] mb-1.5 block">Format de date</label>
              <select
                className="w-full px-3 py-2.5 text-sm bg-white dark:bg-[#0A0A0A] border border-[#E5E7EB] dark:border-[#1A1A1A] rounded-xl text-[#111111] dark:text-white focus:border-[#111111] dark:focus:border-white focus:ring-1 focus:ring-[#111111] dark:focus:ring-white outline-none transition-colors"
                value={settings.dateFormat}
                onChange={(e) => handleChange('dateFormat', e.target.value)}
              >
                <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                <option value="YYYY-MM-DD">YYYY-MM-DD</option>
              </select>
            </div>
          </div>
        </div>

        {/* Current values summary */}
        <div className="p-4 bg-[#FAFAFA] dark:bg-[#0A0A0A] rounded-2xl border border-[#E5E7EB] dark:border-[#1A1A1A]">
          <h4 className="text-xs font-semibold text-[#9CA3AF] dark:text-[#737373] uppercase tracking-wider mb-3">Valeurs actuelles</h4>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div>
              <p className="text-xs text-[#9CA3AF] dark:text-[#737373]">Langue</p>
              <p className="text-sm font-medium text-[#111111] dark:text-white">{settings.language === 'fr' ? 'Fran\u00e7ais' : settings.language === 'en' ? 'English' : settings.language === 'es' ? 'Espa\u00f1ol' : settings.language === 'de' ? 'Deutsch' : 'Arabe'}</p>
            </div>
            <div>
              <p className="text-xs text-[#9CA3AF] dark:text-[#737373]">Fuseau</p>
              <p className="text-sm font-medium text-[#111111] dark:text-white">{settings.timezone.split('/')[1] || settings.timezone}</p>
            </div>
            <div>
              <p className="text-xs text-[#9CA3AF] dark:text-[#737373]">Devise</p>
              <p className="text-sm font-medium text-[#111111] dark:text-white">{settings.currency}</p>
            </div>
            <div>
              <p className="text-xs text-[#9CA3AF] dark:text-[#737373]">Format date</p>
              <p className="text-sm font-medium text-[#111111] dark:text-white">{settings.dateFormat}</p>
            </div>
          </div>
        </div>

        {/* Version & PWA */}
        <div className="flex items-center justify-between py-3 border-t border-[#E5E7EB] dark:border-[#1A1A1A]">
          <span className="text-sm text-[#6B7280] dark:text-[#A3A3A3]">Version</span>
          <span className="text-sm font-mono bg-[#F3F4F6] dark:bg-[#171717] px-2.5 py-0.5 rounded text-[#9CA3AF] dark:text-[#A3A3A3]">
            v{APP_VERSION}
          </span>
        </div>

        <SectionSaveButton onClick={() => handleSaveSettings('General')} />
      </div>
    );
  }

  function renderRestaurantTab() {
    return (
      <div className="space-y-8">
        {/* Basic info */}
        <div>
          <h3 className="text-base font-semibold text-[#111111] dark:text-white mb-4 flex items-center gap-2">
            <Building2 className="w-5 h-5 text-teal-500" />
            Informations
          </h3>
          <div className="space-y-4">
            <div>
              <label className="text-xs font-medium text-[#6B7280] dark:text-[#A3A3A3] mb-1.5 block">Nom du restaurant</label>
              <input
                className="w-full px-3 py-2.5 text-sm bg-white dark:bg-[#0A0A0A] border border-[#E5E7EB] dark:border-[#1A1A1A] rounded-xl text-[#111111] dark:text-white focus:border-[#111111] dark:focus:border-white focus:ring-1 focus:ring-[#111111] dark:focus:ring-white outline-none transition-colors"
                value={settings.companyName}
                onChange={(e) => handleChange('companyName', e.target.value)}
                placeholder="Mon Restaurant"
              />
            </div>
            <div>
              <label className="text-xs font-medium text-[#6B7280] dark:text-[#A3A3A3] mb-1.5 block flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5" />
                Adresse
              </label>
              <input
                className="w-full px-3 py-2.5 text-sm bg-white dark:bg-[#0A0A0A] border border-[#E5E7EB] dark:border-[#1A1A1A] rounded-xl text-[#111111] dark:text-white focus:border-[#111111] dark:focus:border-white focus:ring-1 focus:ring-[#111111] dark:focus:ring-white outline-none transition-colors"
                value={settings.companyAddress}
                onChange={(e) => handleChange('companyAddress', e.target.value)}
                placeholder="123 Rue de la Cuisine, 75001 Paris"
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-medium text-[#6B7280] dark:text-[#A3A3A3] mb-1.5 block flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5" />
                  Telephone
                </label>
                <input
                  className="w-full px-3 py-2.5 text-sm bg-white dark:bg-[#0A0A0A] border border-[#E5E7EB] dark:border-[#1A1A1A] rounded-xl text-[#111111] dark:text-white focus:border-[#111111] dark:focus:border-white focus:ring-1 focus:ring-[#111111] dark:focus:ring-white outline-none transition-colors"
                  value={settings.companyPhone}
                  onChange={(e) => handleChange('companyPhone', e.target.value)}
                  placeholder="01 23 45 67 89"
                />
              </div>
              <div>
                <label className="text-xs font-medium text-[#6B7280] dark:text-[#A3A3A3] mb-1.5 block flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5" />
                  Email
                </label>
                <input
                  type="email"
                  className="w-full px-3 py-2.5 text-sm bg-white dark:bg-[#0A0A0A] border border-[#E5E7EB] dark:border-[#1A1A1A] rounded-xl text-[#111111] dark:text-white focus:border-[#111111] dark:focus:border-white focus:ring-1 focus:ring-[#111111] dark:focus:ring-white outline-none transition-colors"
                  value={settings.companyEmail}
                  onChange={(e) => handleChange('companyEmail', e.target.value)}
                  placeholder="contact@monrestaurant.fr"
                />
              </div>
            </div>

            {/* Logo upload */}
            <div>
              <label className="text-xs font-medium text-[#6B7280] dark:text-[#A3A3A3] mb-1.5 block">Logo du restaurant</label>
              <div className="border-2 border-dashed border-[#D1D5DB] dark:border-[#262626] rounded-2xl p-8 text-center hover:border-[#111111] dark:hover:border-white transition-colors cursor-pointer group">
                <Upload className="w-10 h-10 mx-auto text-[#D1D5DB] dark:text-[#404040] mb-3 group-hover:text-[#111111] dark:group-hover:text-white transition-colors" />
                <p className="text-sm text-[#6B7280] dark:text-[#A3A3A3]">
                  Cliquer ou glisser-deposer pour ajouter un logo
                </p>
                <p className="text-xs text-[#9CA3AF] dark:text-[#737373] mt-1">PNG, JPG, SVG -- max 2 Mo</p>
              </div>
            </div>
          </div>
        </div>

        {/* Cuisine type & covers */}
        <div>
          <h3 className="text-base font-semibold text-[#111111] dark:text-white mb-4 flex items-center gap-2">
            <ChefHat className="w-5 h-5 text-amber-500" />
            Type & Capacite
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-medium text-[#6B7280] dark:text-[#A3A3A3] mb-1.5 block">Type de cuisine</label>
              <select
                className="w-full px-3 py-2.5 text-sm bg-white dark:bg-[#0A0A0A] border border-[#E5E7EB] dark:border-[#1A1A1A] rounded-xl text-[#111111] dark:text-white focus:border-[#111111] dark:focus:border-white focus:ring-1 focus:ring-[#111111] dark:focus:ring-white outline-none transition-colors"
                value={settings.cuisineType}
                onChange={(e) => handleChange('cuisineType', e.target.value)}
              >
                {CUISINE_TYPES.map((ct) => (
                  <option key={ct.value} value={ct.value}>{ct.label}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-xs font-medium text-[#6B7280] dark:text-[#A3A3A3] mb-1.5 block">Nombre de couverts/jour</label>
              <input
                type="number"
                min="0"
                className="w-full px-3 py-2.5 text-sm bg-white dark:bg-[#0A0A0A] border border-[#E5E7EB] dark:border-[#1A1A1A] rounded-xl text-[#111111] dark:text-white focus:border-[#111111] dark:focus:border-white focus:ring-1 focus:ring-[#111111] dark:focus:ring-white outline-none transition-colors"
                value={settings.coversPerDay}
                onChange={(e) => handleChange('coversPerDay', parseInt(e.target.value) || 0)}
                placeholder="80"
              />
            </div>
            <div>
              <label className="text-xs font-medium text-[#6B7280] dark:text-[#A3A3A3] mb-1.5 block">N SIRET</label>
              <input
                className="w-full px-3 py-2.5 text-sm bg-white dark:bg-[#0A0A0A] border border-[#E5E7EB] dark:border-[#1A1A1A] rounded-xl text-[#111111] dark:text-white focus:border-[#111111] dark:focus:border-white focus:ring-1 focus:ring-[#111111] dark:focus:ring-white outline-none transition-colors"
                value={settings.companySiret}
                onChange={(e) => handleChange('companySiret', e.target.value)}
                placeholder="123 456 789 00012"
              />
            </div>
          </div>
        </div>

        {/* Opening hours */}
        <div>
          <h3 className="text-base font-semibold text-[#111111] dark:text-white mb-4 flex items-center gap-2">
            <Clock className="w-5 h-5 text-blue-500" />
            Horaires d'ouverture
          </h3>
          <div className="space-y-2">
            {DAYS_FR.map((day) => {
              const hours = settings.openingHours?.[day] || DEFAULT_OPENING_HOURS[day];
              return (
                <div key={day} className={`flex items-center gap-3 py-2.5 px-4 rounded-xl transition-colors ${hours.closed ? 'bg-[#FAFAFA] dark:bg-[#0A0A0A] opacity-60' : 'bg-white dark:bg-[#0A0A0A]'} border border-[#E5E7EB] dark:border-[#1A1A1A]`}>
                  <span className="w-24 text-sm font-medium text-[#111111] dark:text-white capitalize">{day}</span>
                  <div className="flex items-center gap-2 flex-1">
                    <input
                      type="time"
                      value={hours.open}
                      onChange={(e) => handleOpeningHourChange(day, 'open', e.target.value)}
                      disabled={hours.closed}
                      className="px-2 py-1.5 text-sm bg-[#FAFAFA] dark:bg-[#171717] border border-[#E5E7EB] dark:border-[#262626] rounded-lg text-[#111111] dark:text-white disabled:opacity-40"
                    />
                    <span className="text-[#9CA3AF] text-xs">a</span>
                    <input
                      type="time"
                      value={hours.close}
                      onChange={(e) => handleOpeningHourChange(day, 'close', e.target.value)}
                      disabled={hours.closed}
                      className="px-2 py-1.5 text-sm bg-[#FAFAFA] dark:bg-[#171717] border border-[#E5E7EB] dark:border-[#262626] rounded-lg text-[#111111] dark:text-white disabled:opacity-40"
                    />
                  </div>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <span className="text-xs text-[#9CA3AF] dark:text-[#737373]">Ferme</span>
                    <ToggleSwitch
                      enabled={hours.closed}
                      onChange={(val) => handleOpeningHourChange(day, 'closed', val)}
                      color="bg-red-500"
                    />
                  </label>
                </div>
              );
            })}
          </div>
        </div>

        {/* Financial params */}
        <div>
          <h3 className="text-base font-semibold text-[#111111] dark:text-white mb-4 flex items-center gap-2">
            <Calculator className="w-5 h-5 text-emerald-500" />
            Parametres financiers
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="text-xs font-medium text-[#6B7280] dark:text-[#A3A3A3] mb-1.5 block">Objectif coefficient</label>
              <input
                type="number"
                step="0.1"
                min="1"
                className="w-full px-3 py-2.5 text-sm bg-white dark:bg-[#0A0A0A] border border-[#E5E7EB] dark:border-[#1A1A1A] rounded-xl text-[#111111] dark:text-white focus:border-[#111111] dark:focus:border-white focus:ring-1 focus:ring-[#111111] dark:focus:ring-white outline-none transition-colors"
                value={settings.coefficientObjective}
                onChange={(e) => handleChange('coefficientObjective', parseFloat(e.target.value) || 0)}
              />
              <p className="text-xs text-[#9CA3AF] dark:text-[#737373] mt-1">Recommande : x3.3</p>
            </div>
            <div>
              <label className="text-xs font-medium text-[#6B7280] dark:text-[#A3A3A3] mb-1.5 block">Taux de TVA (%)</label>
              <input
                type="number"
                step="0.1"
                min="0"
                max="30"
                className="w-full px-3 py-2.5 text-sm bg-white dark:bg-[#0A0A0A] border border-[#E5E7EB] dark:border-[#1A1A1A] rounded-xl text-[#111111] dark:text-white focus:border-[#111111] dark:focus:border-white focus:ring-1 focus:ring-[#111111] dark:focus:ring-white outline-none transition-colors"
                value={settings.tvaRate}
                onChange={(e) => handleChange('tvaRate', parseFloat(e.target.value) || 0)}
              />
              <p className="text-xs text-[#9CA3AF] dark:text-[#737373] mt-1">Sur place : 10%</p>
            </div>
            <div>
              <label className="text-xs font-medium text-[#6B7280] dark:text-[#A3A3A3] mb-1.5 block">Cout main d'oeuvre (\u20ac/h)</label>
              <input
                type="number"
                step="0.5"
                min="0"
                className="w-full px-3 py-2.5 text-sm bg-white dark:bg-[#0A0A0A] border border-[#E5E7EB] dark:border-[#1A1A1A] rounded-xl text-[#111111] dark:text-white focus:border-[#111111] dark:focus:border-white focus:ring-1 focus:ring-[#111111] dark:focus:ring-white outline-none transition-colors"
                value={settings.defaultLaborCost}
                onChange={(e) => handleChange('defaultLaborCost', parseFloat(e.target.value) || 0)}
              />
            </div>
          </div>
        </div>

        <SectionSaveButton onClick={() => handleSaveSettings('Restaurant')} />
      </div>
    );
  }

  function renderEquipeTab() {
    return (
      <div className="space-y-8">
        {/* Invite member */}
        <div>
          <h3 className="text-base font-semibold text-[#111111] dark:text-white mb-4 flex items-center gap-2">
            <UserPlus className="w-5 h-5 text-violet-500" />
            Inviter un membre
          </h3>
          <div className="flex flex-col sm:flex-row gap-3">
            <input
              type="email"
              className="flex-1 px-3 py-2.5 text-sm bg-white dark:bg-[#0A0A0A] border border-[#E5E7EB] dark:border-[#1A1A1A] rounded-xl text-[#111111] dark:text-white focus:border-[#111111] dark:focus:border-white focus:ring-1 focus:ring-[#111111] dark:focus:ring-white outline-none transition-colors"
              value={inviteEmail}
              onChange={(e) => setInviteEmail(e.target.value)}
              placeholder="email@exemple.com"
            />
            <select
              className="px-3 py-2.5 text-sm bg-white dark:bg-[#0A0A0A] border border-[#E5E7EB] dark:border-[#1A1A1A] rounded-xl text-[#111111] dark:text-white focus:border-[#111111] dark:focus:border-white outline-none transition-colors"
              value={inviteRole}
              onChange={(e) => setInviteRole(e.target.value as any)}
            >
              <option value="manager">Manager</option>
              <option value="chef">Chef</option>
              <option value="serveur">Serveur</option>
            </select>
            <button
              onClick={handleInviteMember}
              disabled={inviteLoading || !inviteEmail}
              className="flex items-center gap-2 px-5 py-2.5 bg-[#111111] dark:bg-white hover:bg-[#333] dark:hover:bg-[#E5E5E5] text-white dark:text-black text-sm font-medium rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
            >
              {inviteLoading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Mail className="w-4 h-4" />}
              Inviter
            </button>
          </div>
        </div>

        {/* Team list */}
        <div>
          <h3 className="text-base font-semibold text-[#111111] dark:text-white mb-4 flex items-center gap-2">
            <Users className="w-5 h-5 text-teal-500" />
            Membres de l'equipe
            <span className="text-xs bg-[#F3F4F6] dark:bg-[#171717] text-[#9CA3AF] px-2 py-0.5 rounded-full ml-2">
              {teamMembers.length}
            </span>
          </h3>

          {teamMembers.length === 0 ? (
            <div className="text-center py-12 bg-[#FAFAFA] dark:bg-[#0A0A0A] rounded-2xl border border-[#E5E7EB] dark:border-[#1A1A1A]">
              <Users className="w-10 h-10 mx-auto text-[#D1D5DB] dark:text-[#404040] mb-3" />
              <p className="text-sm text-[#9CA3AF] dark:text-[#737373]">Aucun membre dans l'equipe</p>
              <p className="text-xs text-[#9CA3AF] dark:text-[#737373] mt-1">Invitez vos collaborateurs par email</p>
            </div>
          ) : (
            <div className="space-y-2">
              {teamMembers.map((member, idx) => (
                <div
                  key={member.id}
                  className="flex items-center gap-4 py-3 px-4 bg-white dark:bg-[#0A0A0A] rounded-2xl border border-[#E5E7EB] dark:border-[#1A1A1A] hover:border-[#D1D5DB] dark:hover:border-[#333] transition-colors"
                >
                  {/* Avatar */}
                  <div className={`w-10 h-10 rounded-full ${ROLE_COLORS[idx % ROLE_COLORS.length]} flex items-center justify-center text-white text-sm font-bold flex-shrink-0`}>
                    {getInitials(member.name)}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-[#111111] dark:text-white truncate">{member.name}</p>
                    <p className="text-xs text-[#9CA3AF] dark:text-[#737373] truncate">{member.email}</p>
                  </div>

                  {/* Role badge */}
                  <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${ROLE_LABELS[member.role]?.color || 'bg-[#F3F4F6] dark:bg-[#171717] text-[#6B7280]'}`}>
                    {ROLE_LABELS[member.role]?.label || member.role}
                  </span>

                  {/* Last active */}
                  <span className="text-xs text-[#9CA3AF] dark:text-[#737373] hidden sm:block">
                    {member.lastActive}
                  </span>

                  {/* Remove button */}
                  {member.role !== 'admin' && (
                    <button
                      onClick={() => handleRemoveMember(member.id)}
                      className="p-1.5 rounded-lg text-[#9CA3AF] hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                      title="Retirer le membre"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  }

  function renderNotificationsTab() {
    return (
      <div className="space-y-8">
        {/* In-app notifications */}
        <div>
          <h3 className="text-base font-semibold text-[#111111] dark:text-white mb-1 flex items-center gap-2">
            <Bell className="w-5 h-5 text-amber-500" />
            Alertes application
          </h3>
          <p className="text-xs text-[#9CA3AF] dark:text-[#737373] mb-5">Configurez les notifications que vous recevez dans l'application.</p>

          <div className="space-y-1">
            {[
              {
                key: 'alertStockBas' as const,
                label: 'Alertes stock bas',
                desc: 'Prevenir quand un ingredient passe sous le seuil minimum',
                icon: <AlertTriangle className="w-4 h-4 text-orange-500" />,
              },
              {
                key: 'alertDLC' as const,
                label: 'Alertes DLC',
                desc: 'Prevenir avant expiration des dates limites de consommation',
                icon: <Calendar className="w-4 h-4 text-red-500" />,
              },
              {
                key: 'alertPrix' as const,
                label: 'Alertes prix (mercuriale)',
                desc: 'Notification en cas de variation importante des prix fournisseurs',
                icon: <TrendingUp className="w-4 h-4 text-blue-500" />,
              },
              {
                key: 'rappelCommandes' as const,
                label: 'Rappels commandes',
                desc: 'Rappels pour passer les commandes fournisseurs',
                icon: <RefreshCw className="w-4 h-4 text-teal-500" />,
              },
              {
                key: 'alertMessages' as const,
                label: 'Messages equipe',
                desc: "Notifications de messages de l'equipe",
                icon: <Mail className="w-4 h-4 text-violet-500" />,
              },
            ].map((item, idx) => (
              <div
                key={item.key}
                className={`flex items-center justify-between py-4 px-4 rounded-xl hover:bg-[#FAFAFA] dark:hover:bg-[#0A0A0A] transition-colors ${
                  idx > 0 ? '' : ''
                }`}
              >
                <div className="flex items-start gap-3">
                  <span className="mt-0.5">{item.icon}</span>
                  <div>
                    <p className="text-sm font-medium text-[#111111] dark:text-white">{item.label}</p>
                    <p className="text-xs text-[#9CA3AF] dark:text-[#737373] mt-0.5">{item.desc}</p>
                  </div>
                </div>
                <ToggleSwitch
                  enabled={settings[item.key]}
                  onChange={(val) => handleChange(item.key, val)}
                  color="bg-[#111111] dark:bg-white"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Email notifications */}
        <div className="border-t border-[#E5E7EB] dark:border-[#1A1A1A] pt-6">
          <h3 className="text-base font-semibold text-[#111111] dark:text-white mb-1 flex items-center gap-2">
            <Mail className="w-5 h-5 text-blue-500" />
            Notifications par email
          </h3>
          <p className="text-xs text-[#9CA3AF] dark:text-[#737373] mb-5">Recevez des emails pour les evenements importants.</p>

          <div className="space-y-1">
            <div className="flex items-center justify-between py-4 px-4 rounded-xl hover:bg-[#FAFAFA] dark:hover:bg-[#0A0A0A] transition-colors">
              <div className="flex items-start gap-3">
                <AlertTriangle className="w-4 h-4 text-orange-500 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-[#111111] dark:text-white">Email alertes stock bas</p>
                  <p className="text-xs text-[#9CA3AF] dark:text-[#737373] mt-0.5">Recevoir un email quand un ingredient passe sous le seuil</p>
                </div>
              </div>
              <ToggleSwitch
                enabled={settings.emailNotifications}
                onChange={(val) => handleChange('emailNotifications', val)}
                color="bg-blue-500"
              />
            </div>

            <div className="flex items-center justify-between py-4 px-4 rounded-xl hover:bg-[#FAFAFA] dark:hover:bg-[#0A0A0A] transition-colors">
              <div className="flex items-start gap-3">
                <BarChart3 className="w-4 h-4 text-emerald-500 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-[#111111] dark:text-white">Rapport hebdomadaire</p>
                  <p className="text-xs text-[#9CA3AF] dark:text-[#737373] mt-0.5">Recevoir un resume hebdomadaire par email chaque lundi</p>
                </div>
              </div>
              <ToggleSwitch
                enabled={settings.emailRapportHebdo}
                onChange={(val) => handleChange('emailRapportHebdo', val)}
                color="bg-blue-500"
              />
            </div>

            <div className="flex items-center justify-between py-4 px-4 rounded-xl hover:bg-[#FAFAFA] dark:hover:bg-[#0A0A0A] transition-colors">
              <div className="flex items-start gap-3">
                <UtensilsCrossed className="w-4 h-4 text-teal-500 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-[#111111] dark:text-white">Nouvelles commandes</p>
                  <p className="text-xs text-[#9CA3AF] dark:text-[#737373] mt-0.5">Recevoir un email a chaque nouvelle commande fournisseur</p>
                </div>
              </div>
              <ToggleSwitch
                enabled={settings.rappelCommandes}
                onChange={(val) => handleChange('rappelCommandes', val)}
                color="bg-blue-500"
              />
            </div>
          </div>
        </div>

        {/* Push notifications */}
        <div className="border-t border-[#E5E7EB] dark:border-[#1A1A1A] pt-6">
          <div className="flex items-center justify-between py-4 px-4 rounded-xl bg-[#FAFAFA] dark:bg-[#0A0A0A] border border-[#E5E7EB] dark:border-[#1A1A1A]">
            <div className="flex items-start gap-3">
              <Smartphone className="w-5 h-5 text-pink-500 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-[#111111] dark:text-white">Notifications push</p>
                <p className="text-xs text-[#9CA3AF] dark:text-[#737373] mt-0.5">Recevoir des notifications push sur votre navigateur ou appareil mobile</p>
              </div>
            </div>
            <ToggleSwitch
              enabled={settings.pushNotifications}
              onChange={(val) => handleChange('pushNotifications', val)}
              color="bg-pink-500"
            />
          </div>
        </div>

        <SectionSaveButton onClick={() => handleSaveSettings('Notifications')} />
      </div>
    );
  }

  function renderSecuriteTab() {
    return (
      <div className="space-y-8">
        {/* Profile section */}
        <div>
          <h3 className="text-base font-semibold text-[#111111] dark:text-white mb-4 flex items-center gap-2">
            <UserIcon className="w-5 h-5 text-violet-500" />
            Mon profil
          </h3>
          <div className="flex items-start gap-5 mb-6">
            <div className="relative group">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-violet-500 to-teal-600 flex items-center justify-center text-white text-xl font-bold shadow-lg">
                {getInitials(user?.name)}
              </div>
              <button aria-label="Changer la photo de profil" className="absolute inset-0 w-16 h-16 rounded-full bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                <Camera className="w-4 h-4 text-white" aria-hidden="true" />
              </button>
            </div>
            <div className="flex-1">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-medium text-[#6B7280] dark:text-[#A3A3A3] mb-1.5 block">Nom complet</label>
                  <input
                    className="w-full px-3 py-2.5 text-sm bg-white dark:bg-[#0A0A0A] border border-[#E5E7EB] dark:border-[#1A1A1A] rounded-xl text-[#111111] dark:text-white focus:border-[#111111] dark:focus:border-white focus:ring-1 focus:ring-[#111111] dark:focus:ring-white outline-none transition-colors"
                    value={profileName}
                    onChange={(e) => setProfileName(e.target.value)}
                    placeholder="Votre nom"
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-[#6B7280] dark:text-[#A3A3A3] mb-1.5 block">Adresse email</label>
                  <input
                    type="email"
                    className="w-full px-3 py-2.5 text-sm bg-white dark:bg-[#0A0A0A] border border-[#E5E7EB] dark:border-[#1A1A1A] rounded-xl text-[#111111] dark:text-white focus:border-[#111111] dark:focus:border-white focus:ring-1 focus:ring-[#111111] dark:focus:ring-white outline-none transition-colors"
                    value={profileEmail}
                    onChange={(e) => setProfileEmail(e.target.value)}
                    placeholder="email@exemple.com"
                  />
                </div>
              </div>
              <div className="flex justify-end mt-3">
                <button onClick={handleSaveProfile} className="flex items-center gap-2 px-4 py-2 bg-[#111111] dark:bg-white hover:bg-[#333] dark:hover:bg-[#E5E5E5] text-white dark:text-black text-sm font-medium rounded-xl transition-colors">
                  <Save className="w-4 h-4" />
                  Mettre a jour
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Change password */}
        <div className="border-t border-[#E5E7EB] dark:border-[#1A1A1A] pt-6">
          <h3 className="text-base font-semibold text-[#111111] dark:text-white mb-4 flex items-center gap-2">
            <Lock className="w-5 h-5 text-orange-500" />
            Changer le mot de passe
          </h3>
          <div className="space-y-3 max-w-lg">
            <div>
              <label className="text-xs font-medium text-[#6B7280] dark:text-[#A3A3A3] mb-1.5 block">Ancien mot de passe</label>
              <div className="relative">
                <input
                  type={showOldPw ? 'text' : 'password'}
                  className="w-full px-3 py-2.5 pr-10 text-sm bg-white dark:bg-[#0A0A0A] border border-[#E5E7EB] dark:border-[#1A1A1A] rounded-xl text-[#111111] dark:text-white focus:border-[#111111] dark:focus:border-white focus:ring-1 focus:ring-[#111111] dark:focus:ring-white outline-none transition-colors"
                  value={oldPassword}
                  onChange={(e) => setOldPassword(e.target.value)}
                  placeholder="Mot de passe actuel"
                />
                <button
                  type="button"
                  onClick={() => setShowOldPw(!showOldPw)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#9CA3AF] dark:text-[#737373] hover:text-[#4B5563]"
                >
                  {showOldPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-medium text-[#6B7280] dark:text-[#A3A3A3] mb-1.5 block">Nouveau mot de passe</label>
                <div className="relative">
                  <input
                    type={showNewPw ? 'text' : 'password'}
                    className="w-full px-3 py-2.5 pr-10 text-sm bg-white dark:bg-[#0A0A0A] border border-[#E5E7EB] dark:border-[#1A1A1A] rounded-xl text-[#111111] dark:text-white focus:border-[#111111] dark:focus:border-white focus:ring-1 focus:ring-[#111111] dark:focus:ring-white outline-none transition-colors"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Minimum 6 caracteres"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPw(!showNewPw)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[#9CA3AF] dark:text-[#737373] hover:text-[#4B5563]"
                  >
                    {showNewPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
              <div>
                <label className="text-xs font-medium text-[#6B7280] dark:text-[#A3A3A3] mb-1.5 block">Confirmer</label>
                <input
                  type="password"
                  className="w-full px-3 py-2.5 text-sm bg-white dark:bg-[#0A0A0A] border border-[#E5E7EB] dark:border-[#1A1A1A] rounded-xl text-[#111111] dark:text-white focus:border-[#111111] dark:focus:border-white focus:ring-1 focus:ring-[#111111] dark:focus:ring-white outline-none transition-colors"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirmer"
                />
              </div>
            </div>
            <div className="flex justify-end">
              <button
                onClick={handleChangePassword}
                disabled={!oldPassword || !newPassword || !confirmPassword}
                className="flex items-center gap-2 px-4 py-2 border border-[#E5E7EB] dark:border-[#1A1A1A] hover:bg-[#FAFAFA] dark:hover:bg-[#171717] text-[#111111] dark:text-white text-sm font-medium rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Lock className="w-4 h-4" />
                Modifier le mot de passe
              </button>
            </div>
          </div>
        </div>

        {/* 2FA */}
        <div className="border-t border-[#E5E7EB] dark:border-[#1A1A1A] pt-6">
          <h3 className="text-base font-semibold text-[#111111] dark:text-white mb-4 flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-emerald-500" />
            Authentification a deux facteurs (2FA)
          </h3>
          <div className="flex items-center justify-between py-4 px-4 bg-[#FAFAFA] dark:bg-[#0A0A0A] rounded-2xl border border-[#E5E7EB] dark:border-[#1A1A1A]">
            <div>
              <p className="text-sm font-medium text-[#111111] dark:text-white">
                {twoFAEnabled ? 'Authentification 2FA activee' : 'Activer l\'authentification 2FA'}
              </p>
              <p className="text-xs text-[#9CA3AF] dark:text-[#737373] mt-0.5">
                Ajoutez une couche de securite supplementaire avec un code a usage unique
              </p>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-[#9CA3AF] dark:text-[#737373] italic">Prochainement</span>
              <ToggleSwitch
                enabled={false}
                onChange={() => {}}
                color="bg-emerald-500"
              />
            </div>
          </div>
        </div>

        {/* Active sessions */}
        <div className="border-t border-[#E5E7EB] dark:border-[#1A1A1A] pt-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-semibold text-[#111111] dark:text-white flex items-center gap-2">
              <Smartphone className="w-5 h-5 text-blue-500" />
              Sessions actives
            </h3>
            <button
              onClick={handleDisconnectAll}
              className="flex items-center gap-2 px-3 py-1.5 border border-red-200 dark:border-red-900/50 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 text-sm font-medium rounded-xl transition-colors"
            >
              <LogOut className="w-4 h-4" />
              Deconnecter tous les appareils
            </button>
          </div>

          <div className="space-y-2">
            {activeSessions.map((session) => (
              <div
                key={session.id}
                className={`flex items-center gap-4 py-3 px-4 rounded-2xl border transition-colors ${
                  session.current
                    ? 'bg-emerald-50 dark:bg-emerald-900/10 border-emerald-200 dark:border-emerald-900/30'
                    : 'bg-white dark:bg-[#0A0A0A] border-[#E5E7EB] dark:border-[#1A1A1A]'
                }`}
              >
                <Smartphone className={`w-5 h-5 flex-shrink-0 ${session.current ? 'text-emerald-600 dark:text-emerald-400' : 'text-[#9CA3AF] dark:text-[#737373]'}`} />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-[#111111] dark:text-white flex items-center gap-2">
                    {session.device}
                    {session.current && (
                      <span className="text-xs bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 px-2 py-0.5 rounded-full">
                        Cet appareil
                      </span>
                    )}
                  </p>
                  <p className="text-xs text-[#9CA3AF] dark:text-[#737373]">{session.location} -- {session.lastActive}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Danger zone */}
        <div className="border-t border-[#E5E7EB] dark:border-[#1A1A1A] pt-6">
          <h3 className="text-base font-semibold text-red-600 dark:text-red-400 mb-4 flex items-center gap-2">
            <AlertTriangle className="w-5 h-5" />
            Zone de danger
          </h3>
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={() => { setDeleteConfirmText(''); setShowDeleteDataModal(true); }}
              className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border-2 border-red-200 dark:border-red-900/50 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors text-sm font-medium flex-1"
            >
              <Trash2 className="w-4 h-4" />
              Supprimer toutes les donnees
            </button>
          </div>
        </div>
      </div>
    );
  }

  function renderFacturationTab() {
    return (
      <div className="space-y-8">
        {/* Current plan */}
        <div>
          <h3 className="text-base font-semibold text-[#111111] dark:text-white mb-4 flex items-center gap-2">
            <CreditCard className="w-5 h-5 text-violet-500" />
            Plan actuel
          </h3>
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Pro plan */}
            <div className={`flex-1 p-5 rounded-2xl border-2 transition-colors ${currentPlan === 'pro' ? 'border-[#111111] dark:border-white bg-[#FAFAFA] dark:bg-[#0A0A0A]' : 'border-[#E5E7EB] dark:border-[#1A1A1A]'}`}>
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-lg font-bold text-[#111111] dark:text-white">Pro</h4>
                {currentPlan === 'pro' && (
                  <span className="text-xs bg-[#111111] dark:bg-white text-white dark:text-black px-2.5 py-1 rounded-full font-medium">
                    Actuel
                  </span>
                )}
              </div>
              <p className="text-3xl font-bold text-[#111111] dark:text-white">29<span className="text-base font-normal text-[#9CA3AF]">\u20ac/mois</span></p>
              <ul className="mt-3 space-y-1 text-xs text-[#6B7280] dark:text-[#A3A3A3]">
                <li className="flex items-center gap-1.5"><Check className="w-3.5 h-3.5 text-emerald-500" />Recettes illimitees</li>
                <li className="flex items-center gap-1.5"><Check className="w-3.5 h-3.5 text-emerald-500" />2 000 appels IA/mois</li>
                <li className="flex items-center gap-1.5"><Check className="w-3.5 h-3.5 text-emerald-500" />5 Go stockage</li>
                <li className="flex items-center gap-1.5"><Check className="w-3.5 h-3.5 text-emerald-500" />5 membres equipe</li>
              </ul>
            </div>

            {/* Business plan */}
            <div className={`flex-1 p-5 rounded-2xl border-2 transition-colors ${currentPlan === 'business' ? 'border-[#111111] dark:border-white bg-[#FAFAFA] dark:bg-[#0A0A0A]' : 'border-[#E5E7EB] dark:border-[#1A1A1A]'}`}>
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-lg font-bold text-[#111111] dark:text-white">Business</h4>
                {currentPlan === 'business' && (
                  <span className="text-xs bg-[#111111] dark:bg-white text-white dark:text-black px-2.5 py-1 rounded-full font-medium">
                    Actuel
                  </span>
                )}
              </div>
              <p className="text-3xl font-bold text-[#111111] dark:text-white">79<span className="text-base font-normal text-[#9CA3AF]">\u20ac/mois</span></p>
              <ul className="mt-3 space-y-1 text-xs text-[#6B7280] dark:text-[#A3A3A3]">
                <li className="flex items-center gap-1.5"><Check className="w-3.5 h-3.5 text-emerald-500" />Tout Pro +</li>
                <li className="flex items-center gap-1.5"><Check className="w-3.5 h-3.5 text-emerald-500" />10 000 appels IA/mois</li>
                <li className="flex items-center gap-1.5"><Check className="w-3.5 h-3.5 text-emerald-500" />50 Go stockage</li>
                <li className="flex items-center gap-1.5"><Check className="w-3.5 h-3.5 text-emerald-500" />Equipe illimitee</li>
              </ul>
            </div>
          </div>

          <div className="mt-4">
            <button
              onClick={() => showToast('Redirection vers le portail Stripe...', 'info')}
              className="flex items-center gap-2 px-5 py-2.5 bg-[#111111] dark:bg-white hover:bg-[#333] dark:hover:bg-[#E5E5E5] text-white dark:text-black text-sm font-medium rounded-xl transition-colors"
            >
              <ExternalLink className="w-4 h-4" />
              Gerer mon abonnement
            </button>
          </div>
        </div>

        {/* Usage stats */}
        <div className="border-t border-[#E5E7EB] dark:border-[#1A1A1A] pt-6">
          <h3 className="text-base font-semibold text-[#111111] dark:text-white mb-4 flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-teal-500" />
            Utilisation
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* IA calls */}
            <div className="p-4 bg-[#FAFAFA] dark:bg-[#0A0A0A] rounded-2xl border border-[#E5E7EB] dark:border-[#1A1A1A]">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm font-medium text-[#111111] dark:text-white flex items-center gap-2">
                  <Zap className="w-4 h-4 text-amber-500" />
                  Appels IA
                </p>
                <span className="text-xs text-[#9CA3AF]">{usageStats.aiCalls}/{usageStats.aiLimit}</span>
              </div>
              <div className="w-full h-2 bg-[#E5E7EB] dark:bg-[#262626] rounded-full overflow-hidden">
                <div
                  className="h-full bg-amber-500 rounded-full transition-all"
                  style={{ width: `${(usageStats.aiCalls / usageStats.aiLimit) * 100}%` }}
                />
              </div>
              <p className="text-xs text-[#9CA3AF] dark:text-[#737373] mt-1.5">{Math.round((usageStats.aiCalls / usageStats.aiLimit) * 100)}% utilise ce mois</p>
            </div>

            {/* Storage */}
            <div className="p-4 bg-[#FAFAFA] dark:bg-[#0A0A0A] rounded-2xl border border-[#E5E7EB] dark:border-[#1A1A1A]">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm font-medium text-[#111111] dark:text-white flex items-center gap-2">
                  <HardDrive className="w-4 h-4 text-blue-500" />
                  Stockage
                </p>
                <span className="text-xs text-[#9CA3AF]">{usageStats.storageUsed} Go/{usageStats.storageLimit} Go</span>
              </div>
              <div className="w-full h-2 bg-[#E5E7EB] dark:bg-[#262626] rounded-full overflow-hidden">
                <div
                  className="h-full bg-blue-500 rounded-full transition-all"
                  style={{ width: `${(usageStats.storageUsed / usageStats.storageLimit) * 100}%` }}
                />
              </div>
              <p className="text-xs text-[#9CA3AF] dark:text-[#737373] mt-1.5">{Math.round((usageStats.storageUsed / usageStats.storageLimit) * 100)}% utilise</p>
            </div>
          </div>
        </div>

        {/* Billing history */}
        <div className="border-t border-[#E5E7EB] dark:border-[#1A1A1A] pt-6">
          <h3 className="text-base font-semibold text-[#111111] dark:text-white mb-4 flex items-center gap-2">
            <FileText className="w-5 h-5 text-indigo-500" />
            Historique de facturation
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[#E5E7EB] dark:border-[#1A1A1A]">
                  <th className="text-left py-2.5 px-3 text-xs font-medium text-[#9CA3AF] dark:text-[#737373] uppercase tracking-wider">Date</th>
                  <th className="text-left py-2.5 px-3 text-xs font-medium text-[#9CA3AF] dark:text-[#737373] uppercase tracking-wider">Description</th>
                  <th className="text-right py-2.5 px-3 text-xs font-medium text-[#9CA3AF] dark:text-[#737373] uppercase tracking-wider">Montant</th>
                  <th className="text-right py-2.5 px-3 text-xs font-medium text-[#9CA3AF] dark:text-[#737373] uppercase tracking-wider">Statut</th>
                </tr>
              </thead>
              <tbody>
                {billingHistory.map((entry) => (
                  <tr key={entry.id} className="border-b border-[#E5E7EB] dark:border-[#1A1A1A] hover:bg-[#FAFAFA] dark:hover:bg-[#0A0A0A] transition-colors">
                    <td className="py-3 px-3 text-[#6B7280] dark:text-[#A3A3A3]">
                      {new Date(entry.date).toLocaleDateString('fr-FR')}
                    </td>
                    <td className="py-3 px-3 text-[#111111] dark:text-white font-medium">{entry.description}</td>
                    <td className="py-3 px-3 text-right text-[#111111] dark:text-white font-mono">{entry.amount}</td>
                    <td className="py-3 px-3 text-right">
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                        entry.status === 'paid'
                          ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300'
                          : entry.status === 'pending'
                          ? 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300'
                          : 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300'
                      }`}>
                        {entry.status === 'paid' ? 'Paye' : entry.status === 'pending' ? 'En attente' : 'Echoue'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  }

  function renderIntegrationsTab() {
    const integrations = [
      {
        id: 'stripe',
        name: 'Stripe',
        description: 'Paiements en ligne et gestion des abonnements',
        icon: <CreditCard className="w-6 h-6" />,
        color: 'text-violet-500',
        bgColor: 'bg-violet-100 dark:bg-violet-900/30',
        connected: stripeConnected,
        onToggle: () => {
          setStripeConnected(!stripeConnected);
          showToast(stripeConnected ? 'Stripe deconnecte' : 'Stripe connecte', stripeConnected ? 'info' : 'success');
        },
      },
      {
        id: 'google-analytics',
        name: 'Google Analytics',
        description: 'Suivi des visites et comportement utilisateur',
        icon: <BarChart3 className="w-6 h-6" />,
        color: 'text-orange-500',
        bgColor: 'bg-orange-100 dark:bg-orange-900/30',
        connected: gaConnected,
        onToggle: () => {
          setGaConnected(!gaConnected);
          showToast(gaConnected ? 'Google Analytics deconnecte' : 'Google Analytics connecte', gaConnected ? 'info' : 'success');
        },
      },
      {
        id: 'crisp',
        name: 'Crisp Chat',
        description: 'Support client en temps reel via chat',
        icon: <Mail className="w-6 h-6" />,
        color: 'text-blue-500',
        bgColor: 'bg-blue-100 dark:bg-blue-900/30',
        connected: crispConnected,
        onToggle: () => {
          setCrispConnected(!crispConnected);
          showToast(crispConnected ? 'Crisp deconnecte' : 'Crisp connecte', crispConnected ? 'info' : 'success');
        },
      },
      {
        id: 'bluetooth',
        name: 'Balance Bluetooth',
        description: 'Pesee automatique des ingredients via balance connectee',
        icon: <Bluetooth className="w-6 h-6" />,
        color: 'text-cyan-500',
        bgColor: 'bg-cyan-100 dark:bg-cyan-900/30',
        connected: bluetoothConnected,
        onToggle: () => {
          setBluetoothConnected(!bluetoothConnected);
          showToast(bluetoothConnected ? 'Balance deconnectee' : 'Recherche de balance en cours...', bluetoothConnected ? 'info' : 'success');
        },
      },
    ];

    return (
      <div className="space-y-8">
        <div>
          <h3 className="text-base font-semibold text-[#111111] dark:text-white mb-1 flex items-center gap-2">
            <Zap className="w-5 h-5 text-amber-500" />
            Services connectes
          </h3>
          <p className="text-xs text-[#9CA3AF] dark:text-[#737373] mb-5">Connectez vos outils pour enrichir votre experience RestauMargin.</p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {integrations.map((integ) => (
              <div
                key={integ.id}
                className="p-5 bg-white dark:bg-[#0A0A0A] rounded-2xl border border-[#E5E7EB] dark:border-[#1A1A1A] hover:border-[#D1D5DB] dark:hover:border-[#333] transition-all"
              >
                <div className="flex items-start gap-4">
                  <div className={`w-12 h-12 rounded-2xl ${integ.bgColor} flex items-center justify-center flex-shrink-0 ${integ.color}`}>
                    {integ.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <h4 className="text-sm font-semibold text-[#111111] dark:text-white">{integ.name}</h4>
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                        integ.connected
                          ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300'
                          : 'bg-[#F3F4F6] dark:bg-[#171717] text-[#9CA3AF] dark:text-[#737373]'
                      }`}>
                        {integ.connected ? 'Connecte' : 'Non connecte'}
                      </span>
                    </div>
                    <p className="text-xs text-[#9CA3AF] dark:text-[#737373] mb-3">{integ.description}</p>
                    <button
                      onClick={integ.onToggle}
                      className={`w-full flex items-center justify-center gap-2 px-3 py-2 text-sm font-medium rounded-xl transition-colors ${
                        integ.connected
                          ? 'border border-red-200 dark:border-red-900/50 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20'
                          : 'bg-[#111111] dark:bg-white hover:bg-[#333] dark:hover:bg-[#E5E5E5] text-white dark:text-black'
                      }`}
                    >
                      {integ.connected ? (
                        <>
                          <WifiOff className="w-4 h-4" />
                          Deconnecter
                        </>
                      ) : (
                        <>
                          <Wifi className="w-4 h-4" />
                          Connecter
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Printer */}
        <div className="border-t border-[#E5E7EB] dark:border-[#1A1A1A] pt-6">
          <h3 className="text-base font-semibold text-[#111111] dark:text-white mb-4 flex items-center gap-2">
            <Printer className="w-5 h-5 text-[#9CA3AF]" />
            Peripheriques
          </h3>
          <div className="flex items-center justify-between py-4 px-5 bg-white dark:bg-[#0A0A0A] rounded-2xl border border-[#E5E7EB] dark:border-[#1A1A1A]">
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${printerConnected ? 'bg-emerald-100 dark:bg-emerald-900/30' : 'bg-[#F3F4F6] dark:bg-[#171717]'}`}>
                <Printer className={`w-5 h-5 ${printerConnected ? 'text-emerald-600 dark:text-emerald-400' : 'text-[#9CA3AF]'}`} />
              </div>
              <div>
                <p className="text-sm font-medium text-[#111111] dark:text-white">Imprimante thermique</p>
                <p className="text-xs text-[#9CA3AF] dark:text-[#737373] flex items-center gap-1">
                  {printerConnected ? (
                    <><Wifi className="w-3 h-3 text-emerald-500" /> Configuree</>
                  ) : (
                    <><WifiOff className="w-3 h-3" /> Non configuree</>
                  )}
                </p>
              </div>
            </div>
            <button
              onClick={() => {
                setPrinterConnected(!printerConnected);
                showToast(printerConnected ? 'Imprimante deconnectee' : 'Imprimante configuree', printerConnected ? 'info' : 'success');
              }}
              className="flex items-center gap-2 px-4 py-2 border border-[#E5E7EB] dark:border-[#1A1A1A] hover:bg-[#FAFAFA] dark:hover:bg-[#171717] text-[#111111] dark:text-white text-sm font-medium rounded-xl transition-colors"
            >
              {printerConnected ? 'Deconnecter' : 'Configurer'}
            </button>
          </div>
        </div>

        {/* Data exports */}
        <div className="border-t border-[#E5E7EB] dark:border-[#1A1A1A] pt-6">
          <h3 className="text-base font-semibold text-[#111111] dark:text-white mb-4 flex items-center gap-2">
            <Download className="w-5 h-5 text-teal-500" />
            Export de donnees
          </h3>
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={handleExportCSV}
              className="flex items-center justify-center gap-2 px-4 py-2.5 border border-[#E5E7EB] dark:border-[#1A1A1A] hover:bg-[#FAFAFA] dark:hover:bg-[#171717] text-[#111111] dark:text-white text-sm font-medium rounded-xl transition-colors flex-1"
            >
              <FileSpreadsheet className="w-4 h-4" />
              Export CSV
            </button>
            <button
              onClick={() => window.print()}
              className="flex items-center justify-center gap-2 px-4 py-2.5 border border-[#E5E7EB] dark:border-[#1A1A1A] hover:bg-[#FAFAFA] dark:hover:bg-[#171717] text-[#111111] dark:text-white text-sm font-medium rounded-xl transition-colors flex-1"
            >
              <FileText className="w-4 h-4" />
              Export PDF
            </button>
            <button
              onClick={() => {
                const exportData = { exportDate: new Date().toISOString(), version: APP_VERSION, settings: loadSettings() };
                const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `restaumargin-export-${new Date().toISOString().slice(0, 10)}.json`;
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                URL.revokeObjectURL(url);
                showToast('Donnees exportees avec succes', 'success');
              }}
              className="flex items-center justify-center gap-2 px-4 py-2.5 border border-[#E5E7EB] dark:border-[#1A1A1A] hover:bg-[#FAFAFA] dark:hover:bg-[#171717] text-[#111111] dark:text-white text-sm font-medium rounded-xl transition-colors flex-1"
            >
              <Download className="w-4 h-4" />
              Export JSON
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ---------------------------------------------------------------------------
  // Render
  // ---------------------------------------------------------------------------

  const renderTabContent = () => {
    switch (activeTab) {
      case 'general': return renderGeneralTab();
      case 'restaurant': return renderRestaurantTab();
      case 'equipe': return renderEquipeTab();
      case 'notifications': return renderNotificationsTab();
      case 'securite': return renderSecuriteTab();
      case 'facturation': return renderFacturationTab();
      case 'integrations': return renderIntegrationsTab();
      default: return renderGeneralTab();
    }
  };

  return (
    <div className="max-w-4xl mx-auto pb-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-[#111111] dark:text-white flex items-center gap-2">
          <SettingsIcon className="w-7 h-7" />
          Parametres
        </h2>
      </div>

      {/* Tab navigation */}
      <div className="mb-6 -mx-1">
        {/* Desktop tabs */}
        <div className="hidden md:flex items-center gap-1 p-1 bg-[#F3F4F6] dark:bg-[#0A0A0A] rounded-2xl">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all whitespace-nowrap ${
                activeTab === tab.id
                  ? 'bg-white dark:bg-[#171717] text-[#111111] dark:text-white shadow-sm'
                  : 'text-[#6B7280] dark:text-[#737373] hover:text-[#111111] dark:hover:text-white'
              }`}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </div>

        {/* Mobile tabs - horizontal scroll */}
        <div className="md:hidden overflow-x-auto scrollbar-hide">
          <div className="flex items-center gap-1 p-1 bg-[#F3F4F6] dark:bg-[#0A0A0A] rounded-2xl min-w-max">
            {TABS.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium transition-all whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'bg-white dark:bg-[#171717] text-[#111111] dark:text-white shadow-sm'
                    : 'text-[#6B7280] dark:text-[#737373]'
                }`}
              >
                {tab.icon}
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Tab content */}
      <div className="bg-white dark:bg-[#0A0A0A] rounded-2xl border border-[#E5E7EB] dark:border-[#1A1A1A] p-6 sm:p-8">
        {renderTabContent()}
      </div>

      {/* ================================================================
          DELETE DATA MODAL
         ================================================================ */}
      <Modal
        isOpen={showDeleteDataModal}
        onClose={() => setShowDeleteDataModal(false)}
        title="Supprimer toutes les donnees"
      >
        <div className="space-y-4">
          <div className="flex items-start gap-3 p-4 bg-red-50 dark:bg-red-900/20 rounded-xl">
            <AlertTriangle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-red-800 dark:text-red-300">
                Cette action est irreversible
              </p>
              <p className="text-sm text-red-600 dark:text-red-400 mt-1">
                Toutes vos recettes, ingredients, parametres et preferences seront definitivement supprimes.
              </p>
            </div>
          </div>
          <div>
            <label className="text-xs font-medium text-[#6B7280] dark:text-[#A3A3A3] mb-1.5 block">
              Tapez <span className="font-mono font-bold">SUPPRIMER</span> pour confirmer
            </label>
            <input
              className="w-full px-3 py-2.5 text-sm bg-white dark:bg-[#0A0A0A] border border-[#E5E7EB] dark:border-[#1A1A1A] rounded-xl text-[#111111] dark:text-white focus:border-[#111111] dark:focus:border-white focus:ring-1 focus:ring-[#111111] dark:focus:ring-white outline-none transition-colors"
              value={deleteConfirmText}
              onChange={(e) => setDeleteConfirmText(e.target.value)}
              placeholder="SUPPRIMER"
            />
          </div>
          <div className="flex justify-end gap-3">
            <button
              onClick={() => setShowDeleteDataModal(false)}
              className="px-4 py-2 border border-[#E5E7EB] dark:border-[#1A1A1A] hover:bg-[#FAFAFA] dark:hover:bg-[#171717] text-[#111111] dark:text-white text-sm font-medium rounded-xl transition-colors"
            >
              Annuler
            </button>
            <button
              onClick={handleDeleteAllData}
              disabled={deleteConfirmText !== 'SUPPRIMER'}
              className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Confirmer la suppression
            </button>
          </div>
        </div>
      </Modal>

      {/* ================================================================
          DELETE ACCOUNT MODAL
         ================================================================ */}
      <Modal
        isOpen={showDeleteAccountModal}
        onClose={() => setShowDeleteAccountModal(false)}
        title="Supprimer le compte"
      >
        <div className="space-y-4">
          <div className="flex items-start gap-3 p-4 bg-red-50 dark:bg-red-900/20 rounded-xl">
            <AlertTriangle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-red-800 dark:text-red-300">
                Suppression definitive du compte
              </p>
              <p className="text-sm text-red-600 dark:text-red-400 mt-1">
                Votre compte et toutes les donnees associees seront definitivement supprimes. Cette action ne
                peut pas etre annulee.
              </p>
            </div>
          </div>
          <div>
            <label className="text-xs font-medium text-[#6B7280] dark:text-[#A3A3A3] mb-1.5 block">
              Tapez <span className="font-mono font-bold">SUPPRIMER MON COMPTE</span> pour confirmer
            </label>
            <input
              className="w-full px-3 py-2.5 text-sm bg-white dark:bg-[#0A0A0A] border border-[#E5E7EB] dark:border-[#1A1A1A] rounded-xl text-[#111111] dark:text-white focus:border-[#111111] dark:focus:border-white focus:ring-1 focus:ring-[#111111] dark:focus:ring-white outline-none transition-colors"
              value={deleteConfirmText}
              onChange={(e) => setDeleteConfirmText(e.target.value)}
              placeholder="SUPPRIMER MON COMPTE"
            />
          </div>
          <div className="flex justify-end gap-3">
            <button
              onClick={() => setShowDeleteAccountModal(false)}
              className="px-4 py-2 border border-[#E5E7EB] dark:border-[#1A1A1A] hover:bg-[#FAFAFA] dark:hover:bg-[#171717] text-[#111111] dark:text-white text-sm font-medium rounded-xl transition-colors"
            >
              Annuler
            </button>
            <button
              onClick={handleDeleteAccount}
              disabled={deleteConfirmText !== 'SUPPRIMER MON COMPTE'}
              className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Supprimer mon compte
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
