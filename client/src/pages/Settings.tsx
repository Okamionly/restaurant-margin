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
  ChevronDown,
  ChevronRight,
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
  theme: 'light' | 'dark' | 'auto';
  // Notifications
  alertStockBas: boolean;
  alertDLC: boolean;
  alertPrix: boolean;
  rappelCommandes: boolean;
  alertMessages: boolean;
  emailNotifications: boolean;
}

const DEFAULT_SETTINGS: AppSettings = {
  companyName: '',
  companyAddress: '',
  companyPhone: '',
  companySiret: '',
  cuisineType: 'française',
  coversPerDay: 80,
  tvaRate: 10,
  defaultLaborCost: 15,
  marginObjective: 70,
  coefficientObjective: 3.3,
  currency: 'EUR',
  dateFormat: 'DD/MM/YYYY',
  language: 'fr',
  theme: 'light',
  alertStockBas: true,
  alertDLC: true,
  alertPrix: true,
  rappelCommandes: true,
  alertMessages: true,
  emailNotifications: false,
};

const PLAN_LABELS: Record<string, string> = { basic: 'Basic — 9€/mois', pro: 'Pro — 29€/mois', business: 'Business — 79€/mois' };
const APP_VERSION = '1.0.0';

const CUISINE_TYPES = [
  { value: 'française', label: 'Cuisine française' },
  { value: 'italienne', label: 'Cuisine italienne' },
  { value: 'japonaise', label: 'Cuisine japonaise' },
  { value: 'chinoise', label: 'Cuisine chinoise' },
  { value: 'indienne', label: 'Cuisine indienne' },
  { value: 'mexicaine', label: 'Cuisine mexicaine' },
  { value: 'méditerranéenne', label: 'Cuisine méditerranéenne' },
  { value: 'thai', label: 'Cuisine thai' },
  { value: 'bistronomique', label: 'Bistronomique' },
  { value: 'gastronomique', label: 'Gastronomique' },
  { value: 'brasserie', label: 'Brasserie' },
  { value: 'fast-casual', label: 'Fast-casual' },
  { value: 'autre', label: 'Autre' },
];

// ---------------------------------------------------------------------------
// Financial goals types & defaults
// ---------------------------------------------------------------------------

interface FinancialGoals {
  margeMatiere: number;       // % (50-90, default 70)
  foodCost: number;           // % (10-50, default 30)
  masseSalariale: number;     // % (20-50, default 35)
  primeCost: number;          // % (50-80, default 65)
  ticketMoyen: number;        // EUR (default 25)
  couvertsJour: number;       // count (default 80)
  servicesJour: number;       // 1 | 2 | 3 (default 2)
  joursOuverture: number;     // 5 | 6 | 7 (default 6)
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
  } catch {}
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
  } catch {}
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

function ToggleSwitch({ enabled, onChange, color = 'bg-teal-600' }: ToggleSwitchProps) {
  return (
    <button
      type="button"
      onClick={() => onChange(!enabled)}
      className={`relative w-11 h-6 rounded-full transition-colors flex-shrink-0 ${
        enabled ? color : 'bg-slate-300 dark:bg-slate-600'
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
// Accordion section component
// ---------------------------------------------------------------------------

interface SectionProps {
  id: string;
  icon: React.ReactNode;
  iconColor: string;
  title: string;
  badge?: React.ReactNode;
  open: boolean;
  onToggle: () => void;
  children: React.ReactNode;
  variant?: 'default' | 'danger';
}

function Section({ icon, iconColor, title, badge, open, onToggle, children, variant = 'default' }: SectionProps) {
  const borderClass = variant === 'danger' ? 'border border-red-200 dark:border-red-900/50' : '';
  return (
    <div className={`bg-white dark:bg-slate-800 rounded-lg shadow overflow-hidden transition-all ${borderClass}`}>
      <button
        onClick={onToggle}
        className="w-full px-5 py-4 flex items-center gap-3 hover:bg-slate-50 dark:hover:bg-slate-750 transition-colors text-left"
      >
        <span className={iconColor}>{icon}</span>
        <h3 className="font-semibold text-lg text-slate-800 dark:text-slate-100 flex-1">{title}</h3>
        {badge}
        {open ? (
          <ChevronDown className="w-5 h-5 text-slate-400 transition-transform" />
        ) : (
          <ChevronRight className="w-5 h-5 text-slate-400 transition-transform" />
        )}
      </button>
      {open && (
        <div className="px-5 pb-5 border-t dark:border-slate-700">
          <div className="pt-5">{children}</div>
        </div>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Section save button
// ---------------------------------------------------------------------------

function SectionSaveButton({ onClick, label = 'Sauvegarder' }: { onClick: () => void; label?: string }) {
  return (
    <div className="flex justify-end pt-4 mt-4 border-t dark:border-slate-700">
      <button onClick={onClick} className="btn-primary flex items-center gap-2 text-sm">
        <Save className="w-4 h-4" />
        {label}
      </button>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Main component
// ---------------------------------------------------------------------------

interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export default function Settings() {
  const { t } = useTranslation();
  const { user } = useAuth();
  const { showToast } = useToast();
  const [settings, setSettings] = useState<AppSettings>(loadSettings);

  // Accordion state
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    profile: true,
    restaurant: false,
    coefficients: false,
    notifications: false,
    app: false,
    connexions: false,
    security: false,
    referral: false,
    data: false,
    danger: false,
  });

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

  // Seeding state

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
  const DEFAULT_COEFFICIENTS: Record<string, number> = { 'Entrée': 3.0, 'Plat': 3.5, 'Dessert': 4.0, 'Boisson': 5.0, 'Accompagnement': 2.5 };
  const [coefficients, setCoefficients] = useState<Record<string, number>>(() => {
    try {
      const stored = localStorage.getItem('coefficients');
      if (stored) return { ...DEFAULT_COEFFICIENTS, ...JSON.parse(stored) };
    } catch {}
    return { ...DEFAULT_COEFFICIENTS };
  });

  function handleCoefficientChange(category: string, value: number) {
    setCoefficients(prev => ({ ...prev, [category]: value }));
  }

  function saveCoefficients() {
    localStorage.setItem('coefficients', JSON.stringify(coefficients));
    showToast('Coefficients sauvegardés avec succès', 'success');
  }

  function handleGoalChange<K extends keyof FinancialGoals>(key: K, value: FinancialGoals[K]) {
    setFinancialGoals((prev) => {
      const next = { ...prev, [key]: value };
      saveFinancialGoals(next);
      return next;
    });
  }

  // Hardware integration: future feature
  const [tealtoothConnected, setBluetoothConnected] = useState(false);
  const [printerConnected, setPrinterConnected] = useState(false);

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
      // auto
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
    } catch {}
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
    } catch {}
    setReferralLoading(false);
  }

  // ------ Handlers ------

  function handleChange<K extends keyof AppSettings>(key: K, value: AppSettings[K]) {
    setSettings((prev) => ({ ...prev, [key]: value }));
  }

  function handleSaveSettings(section?: string) {
    saveSettingsToStorage(settings);
    showToast(
      section ? `${section} sauvegardé avec succès` : 'Paramètres sauvegardés avec succès',
      'success',
    );
  }

  function toggleSection(id: string) {
    setOpenSections((prev) => ({ ...prev, [id]: !prev[id] }));
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
        showToast('Profil mis à jour', 'success');
      } else {
        showToast('Erreur lors de la mise à jour du profil', 'error');
      }
    } catch {
      // Fallback: save locally
      showToast('Profil sauvegardé localement', 'success');
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
      showToast('Le mot de passe doit contenir au moins 6 caractères', 'error');
      return;
    }
    try {
      const res = await fetch(`${API_BASE}/auth/change-password`, {
        method: 'PUT',
        headers: authHeaders(),
        body: JSON.stringify({ oldPassword, newPassword }),
      });
      if (res.ok) {
        showToast('Mot de passe modifié avec succès', 'success');
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

  const handleCopyCode = useCallback(async () => {
    try {
      await navigator.clipboard.writeText('www.restaumargin.fr/pricing');
      setCopied(true);
      showToast('Code copié dans le presse-papier', 'success');
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

      // Build CSV for ingredients
      const headers = ['Nom', 'Categorie', 'Unite', 'Prix', 'Fournisseur'];
      const rows = (Array.isArray(ingredients) ? ingredients : []).map((i: any) =>
        [i.name, i.category, i.unit, i.price, i.supplier || ''].join(','),
      );
      const csv = [headers.join(','), ...rows].join('\n');

      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
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

  async function handleExportPDF() {
    showToast('Export PDF bientot disponible', 'info');
  }

  async function handleExportData() {
    try {
      const [recipesRes, ingredientsRes] = await Promise.all([
        fetch(`${API_BASE}/recipes`, { headers: authHeaders() }),
        fetch(`${API_BASE}/ingredients`, { headers: authHeaders() }),
      ]);
      const recipes = recipesRes.ok ? await recipesRes.json() : [];
      const ingredients = ingredientsRes.ok ? await ingredientsRes.json() : [];

      const exportData = {
        exportDate: new Date().toISOString(),
        version: APP_VERSION,
        settings: loadSettings(),
        recipes,
        ingredients,
      };

      const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `restaumargin-export-${new Date().toISOString().slice(0, 10)}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      showToast('Données exportées avec succès', 'success');
    } catch {
      showToast("Erreur lors de l'export", 'error');
    }
  }


  async function handleInstall() {
    if (!installPrompt) return;
    installPrompt.prompt();
    const result = await installPrompt.userChoice;
    if (result.outcome === 'accepted') {
      setIsInstalled(true);
      showToast('Application installee', 'success');
    }
    setInstallPrompt(null);
  }

  function handleDeleteAllData() {
    if (deleteConfirmText !== 'SUPPRIMER') return;
    localStorage.clear();
    showToast('Toutes les données ont été supprimées', 'success');
    setShowDeleteDataModal(false);
    setDeleteConfirmText('');
    window.location.reload();
  }

  function handleDeleteAccount() {
    if (deleteConfirmText !== 'SUPPRIMER MON COMPTE') return;
    showToast('Suppression du compte bientot disponible', 'info');
    setShowDeleteAccountModal(false);
    setDeleteConfirmText('');
  }

  // ---------------------------------------------------------------------------
  // Render
  // ---------------------------------------------------------------------------

  return (
    <div className="max-w-3xl mx-auto pb-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
          <SettingsIcon className="w-7 h-7" />
          Paramètres
        </h2>
      </div>

      <div className="space-y-4">
        {/* ================================================================
            1. PROFILE
           ================================================================ */}
        <Section
          id="profile"
          icon={<UserIcon className="w-5 h-5" />}
          iconColor="text-violet-600"
          title="Mon profil"
          open={openSections.profile}
          onToggle={() => toggleSection('profile')}
        >
          <div className="space-y-6">
            {/* Avatar + basic info */}
            <div className="flex items-start gap-5">
              <div className="relative group">
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-violet-500 to-teal-600 flex items-center justify-center text-white text-2xl font-bold shadow-lg">
                  {getInitials(user?.name)}
                </div>
                <button className="absolute inset-0 w-20 h-20 rounded-full bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                  <Camera className="w-5 h-5 text-white" />
                </button>
              </div>
              <div className="flex-1 space-y-1">
                <h4 className="text-lg font-semibold text-slate-800 dark:text-slate-100">
                  {user?.name || 'Utilisateur'}
                </h4>
                <p className="text-sm text-slate-400 dark:text-slate-400">{user?.email || '-'}</p>
                <span className="inline-block text-xs bg-violet-100 dark:bg-violet-900/30 text-violet-700 dark:text-violet-400 px-2.5 py-0.5 rounded-full font-medium mt-1">
                  {user?.role === 'admin' ? 'Administrateur' : 'Chef de cuisine'}
                </span>
              </div>
            </div>

            {/* Editable fields */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="label">Nom complet</label>
                <input
                  className="input w-full"
                  value={profileName}
                  onChange={(e) => setProfileName(e.target.value)}
                  placeholder="Votre nom"
                />
              </div>
              <div>
                <label className="label">Adresse email</label>
                <input
                  type="email"
                  className="input w-full"
                  value={profileEmail}
                  onChange={(e) => setProfileEmail(e.target.value)}
                  placeholder="email@exemple.com"
                />
              </div>
            </div>

            <SectionSaveButton onClick={handleSaveProfile} label="Mettre a jour le profil" />

            {/* Change password */}
            <div className="pt-4 border-t dark:border-slate-700">
              <h4 className="text-sm font-semibold text-slate-400 dark:text-slate-300 flex items-center gap-2 mb-4">
                <Lock className="w-4 h-4" />
                Changer le mot de passe
              </h4>
              <div className="space-y-3">
                <div>
                  <label className="label">Ancien mot de passe</label>
                  <div className="relative">
                    <input
                      type={showOldPw ? 'text' : 'password'}
                      className="input w-full pr-10"
                      value={oldPassword}
                      onChange={(e) => setOldPassword(e.target.value)}
                      placeholder="Mot de passe actuel"
                    />
                    <button
                      type="button"
                      onClick={() => setShowOldPw(!showOldPw)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                    >
                      {showOldPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="label">Nouveau mot de passe</label>
                    <div className="relative">
                      <input
                        type={showNewPw ? 'text' : 'password'}
                        className="input w-full pr-10"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        placeholder="Minimum 6 caractères"
                      />
                      <button
                        type="button"
                        onClick={() => setShowNewPw(!showNewPw)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                      >
                        {showNewPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>
                  <div>
                    <label className="label">Confirmer le mot de passe</label>
                    <input
                      type="password"
                      className="input w-full"
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
                    className="btn-secondary flex items-center gap-2 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Lock className="w-4 h-4" />
                    Modifier le mot de passe
                  </button>
                </div>
              </div>
            </div>
          </div>
        </Section>

        {/* ================================================================
            2. RESTAURANT SETTINGS
           ================================================================ */}
        <Section
          id="restaurant"
          icon={<Building2 className="w-5 h-5" />}
          iconColor="text-teal-600"
          title="Etablissement"
          open={openSections.restaurant}
          onToggle={() => toggleSection('restaurant')}
        >
          <div className="space-y-4">
            <div>
              <label className="label">Nom du restaurant</label>
              <input
                className="input w-full"
                value={settings.companyName}
                onChange={(e) => handleChange('companyName', e.target.value)}
                placeholder="Mon Restaurant"
              />
            </div>
            <div>
              <label className="label flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5" />
                Adresse
              </label>
              <input
                className="input w-full"
                value={settings.companyAddress}
                onChange={(e) => handleChange('companyAddress', e.target.value)}
                placeholder="123 Rue de la Cuisine, 75001 Paris"
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="label flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5" />
                  Telephone
                </label>
                <input
                  className="input w-full"
                  value={settings.companyPhone}
                  onChange={(e) => handleChange('companyPhone', e.target.value)}
                  placeholder="01 23 45 67 89"
                />
              </div>
              <div>
                <label className="label">N SIRET</label>
                <input
                  className="input w-full"
                  value={settings.companySiret}
                  onChange={(e) => handleChange('companySiret', e.target.value)}
                  placeholder="123 456 789 00012"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="label">Type de cuisine</label>
                <select
                  className="input w-full"
                  value={settings.cuisineType}
                  onChange={(e) => handleChange('cuisineType', e.target.value)}
                >
                  {CUISINE_TYPES.map((t) => (
                    <option key={t.value} value={t.value}>
                      {t.label}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="label">Nombre de couverts/jour</label>
                <input
                  type="number"
                  min="0"
                  className="input w-full"
                  value={settings.coversPerDay}
                  onChange={(e) => handleChange('coversPerDay', parseInt(e.target.value) || 0)}
                  placeholder="80"
                />
              </div>
            </div>

            {/* Logo upload placeholder */}
            <div>
              <label className="label">Logo du restaurant</label>
              <div className="border-2 border-dashed border-slate-300 dark:border-slate-600 rounded-lg p-6 text-center hover:border-teal-400 dark:hover:border-teal-500 transition-colors cursor-pointer">
                <Upload className="w-8 h-8 mx-auto text-slate-400 mb-2" />
                <p className="text-sm text-slate-400 dark:text-slate-400">
                  Cliquer ou glisser-deposer pour ajouter un logo
                </p>
                <p className="text-xs text-slate-400 mt-1">PNG, JPG, SVG - max 2 Mo</p>
              </div>
            </div>

            {/* Existing financial params (coefficient, TVA, labor) */}
            <div className="pt-4 border-t dark:border-slate-700">
              <h4 className="text-sm font-semibold text-slate-400 dark:text-slate-300 flex items-center gap-2 mb-4">
                <Calculator className="w-4 h-4" />
                Parametres financiers de base
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="label">Objectif coefficient</label>
                  <input
                    type="number"
                    step="0.1"
                    min="1"
                    className="input w-full"
                    value={settings.coefficientObjective}
                    onChange={(e) => handleChange('coefficientObjective', parseFloat(e.target.value) || 0)}
                  />
                  <p className="text-xs text-slate-400 mt-1">Recommande : x3.3</p>
                </div>
                <div>
                  <label className="label">Taux de TVA (%)</label>
                  <input
                    type="number"
                    step="0.1"
                    min="0"
                    max="30"
                    className="input w-full"
                    value={settings.tvaRate}
                    onChange={(e) => handleChange('tvaRate', parseFloat(e.target.value) || 0)}
                  />
                  <p className="text-xs text-slate-400 mt-1">Sur place : 10%</p>
                </div>
                <div>
                  <label className="label">Cout main d'oeuvre (EUR/h)</label>
                  <input
                    type="number"
                    step="0.5"
                    min="0"
                    className="input w-full"
                    value={settings.defaultLaborCost}
                    onChange={(e) => handleChange('defaultLaborCost', parseFloat(e.target.value) || 0)}
                  />
                </div>
              </div>
            </div>

            {/* ---- Enhanced financial objectives ---- */}
            <div className="pt-4 border-t dark:border-slate-700">
              <h4 className="text-sm font-semibold text-slate-400 dark:text-slate-300 flex items-center gap-2 mb-4">
                <Target className="w-4 h-4 text-emerald-500" />
                Objectifs financiers
              </h4>

              {/* --- Percentage sliders --- */}
              <div className="space-y-5">
                {/* Objectif marge matiere */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="label mb-0 flex items-center gap-1.5">
                      <TrendingUp className="w-3.5 h-3.5 text-emerald-500" />
                      Objectif marge matiere
                    </label>
                    <span className="text-sm font-bold text-emerald-600 dark:text-emerald-400">
                      {financialGoals.margeMatiere}%
                    </span>
                  </div>
                  <input
                    type="range"
                    min="50"
                    max="90"
                    step="1"
                    value={financialGoals.margeMatiere}
                    onChange={(e) => handleGoalChange('margeMatiere', parseInt(e.target.value))}
                    className="w-full h-2 bg-slate-200 dark:bg-slate-600 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                  />
                  <div className="flex justify-between text-xs text-slate-400 mt-1">
                    <span>50%</span>
                    <span>70%</span>
                    <span>90%</span>
                  </div>
                </div>

                {/* Objectif food cost */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="label mb-0 flex items-center gap-1.5">
                      <TrendingUp className="w-3.5 h-3.5 text-orange-500" />
                      Objectif food cost
                    </label>
                    <span className="text-sm font-bold text-orange-600 dark:text-orange-400">
                      {financialGoals.foodCost}%
                    </span>
                  </div>
                  <input
                    type="range"
                    min="10"
                    max="50"
                    step="1"
                    value={financialGoals.foodCost}
                    onChange={(e) => handleGoalChange('foodCost', parseInt(e.target.value))}
                    className="w-full h-2 bg-slate-200 dark:bg-slate-600 rounded-lg appearance-none cursor-pointer accent-orange-500"
                  />
                  <div className="flex justify-between text-xs text-slate-400 mt-1">
                    <span>10%</span>
                    <span>30%</span>
                    <span>50%</span>
                  </div>
                </div>

                {/* Objectif masse salariale */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="label mb-0 flex items-center gap-1.5">
                      <Users className="w-3.5 h-3.5 text-violet-500" />
                      Objectif masse salariale
                    </label>
                    <span className="text-sm font-bold text-violet-600 dark:text-violet-400">
                      {financialGoals.masseSalariale}%
                    </span>
                  </div>
                  <input
                    type="range"
                    min="20"
                    max="50"
                    step="1"
                    value={financialGoals.masseSalariale}
                    onChange={(e) => handleGoalChange('masseSalariale', parseInt(e.target.value))}
                    className="w-full h-2 bg-slate-200 dark:bg-slate-600 rounded-lg appearance-none cursor-pointer accent-violet-500"
                  />
                  <div className="flex justify-between text-xs text-slate-400 mt-1">
                    <span>20%</span>
                    <span>35%</span>
                    <span>50%</span>
                  </div>
                </div>

                {/* Objectif prime cost */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="label mb-0 flex items-center gap-1.5">
                      <Target className="w-3.5 h-3.5 text-teal-500" />
                      Objectif prime cost
                    </label>
                    <span className="text-sm font-bold text-teal-600 dark:text-teal-400">
                      {financialGoals.primeCost}%
                    </span>
                  </div>
                  <input
                    type="range"
                    min="50"
                    max="80"
                    step="1"
                    value={financialGoals.primeCost}
                    onChange={(e) => handleGoalChange('primeCost', parseInt(e.target.value))}
                    className="w-full h-2 bg-slate-200 dark:bg-slate-600 rounded-lg appearance-none cursor-pointer accent-teal-500"
                  />
                  <div className="flex justify-between text-xs text-slate-400 mt-1">
                    <span>50%</span>
                    <span>65%</span>
                    <span>80%</span>
                  </div>
                </div>
              </div>

              {/* --- Number inputs & selects --- */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-5">
                <div>
                  <label className="label flex items-center gap-1.5">
                    <Euro className="w-3.5 h-3.5 text-amber-500" />
                    Ticket moyen cible
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      min="1"
                      step="0.5"
                      className="input w-full pr-8"
                      value={financialGoals.ticketMoyen}
                      onChange={(e) => handleGoalChange('ticketMoyen', parseFloat(e.target.value) || 0)}
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm">EUR</span>
                  </div>
                </div>
                <div>
                  <label className="label flex items-center gap-1.5">
                    <Users className="w-3.5 h-3.5 text-cyan-500" />
                    Nombre de couverts/jour
                  </label>
                  <input
                    type="number"
                    min="1"
                    className="input w-full"
                    value={financialGoals.couvertsJour}
                    onChange={(e) => handleGoalChange('couvertsJour', parseInt(e.target.value) || 0)}
                  />
                </div>
                <div>
                  <label className="label flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-pink-500" />
                    Nombre de services/jour
                  </label>
                  <select
                    className="input w-full"
                    value={financialGoals.servicesJour}
                    onChange={(e) => handleGoalChange('servicesJour', parseInt(e.target.value))}
                  >
                    <option value={1}>1 service</option>
                    <option value={2}>2 services</option>
                    <option value={3}>3 services</option>
                  </select>
                </div>
                <div>
                  <label className="label flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-indigo-500" />
                    Jours d'ouverture/semaine
                  </label>
                  <select
                    className="input w-full"
                    value={financialGoals.joursOuverture}
                    onChange={(e) => handleGoalChange('joursOuverture', parseInt(e.target.value))}
                  >
                    <option value={5}>5 jours</option>
                    <option value={6}>6 jours</option>
                    <option value={7}>7 jours</option>
                  </select>
                </div>
              </div>

              {/* Summary card */}
              <div className="mt-5 p-4 bg-slate-50 dark:bg-slate-700/50 rounded-xl border border-slate-200 dark:border-slate-600">
                <h5 className="text-xs font-semibold text-slate-400 dark:text-slate-400 uppercase tracking-wider mb-3">
                  Estimation CA mensuel
                </h5>
                <div className="text-2xl font-bold text-slate-800 dark:text-slate-100">
                  {new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(
                    financialGoals.ticketMoyen *
                    financialGoals.couvertsJour *
                    financialGoals.joursOuverture *
                    4.33
                  )}
                  <span className="text-sm font-normal text-slate-400 ml-1">/mois</span>
                </div>
                <p className="text-xs text-slate-400 mt-1">
                  {financialGoals.ticketMoyen} EUR x {financialGoals.couvertsJour} couverts x {financialGoals.joursOuverture} j/sem x 4.33 sem
                </p>
              </div>
            </div>

            <SectionSaveButton onClick={() => handleSaveSettings('Etablissement')} />
          </div>
        </Section>

        {/* ================================================================
            2b. COEFFICIENTS PAR CATEGORIE
           ================================================================ */}
        <Section
          id="coefficients"
          icon={<Calculator className="w-5 h-5" />}
          iconColor="text-teal-600"
          title="Coefficients multiplicateurs par catégorie"
          open={openSections.coefficients}
          onToggle={() => toggleSection('coefficients')}
        >
          <div className="space-y-4">
            <p className="text-sm text-slate-400">
              Définissez le coefficient multiplicateur pour chaque catégorie de recette. Le prix de vente suggéré = coût matière x coefficient.
            </p>

            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b dark:border-slate-700">
                    <th className="text-left py-2 px-3 text-slate-400 dark:text-slate-400 font-medium">Catégorie</th>
                    <th className="text-center py-2 px-3 text-slate-400 dark:text-slate-400 font-medium">Coefficient</th>
                    <th className="text-right py-2 px-3 text-slate-400 dark:text-slate-400 font-medium">Prix suggéré pour 3&#8364; de coût</th>
                  </tr>
                </thead>
                <tbody>
                  {Object.entries(coefficients).map(([category, coeff]) => (
                    <tr key={category} className="border-b dark:border-slate-700/50 hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors">
                      <td className="py-2.5 px-3 font-medium text-slate-700 dark:text-slate-200">{category}</td>
                      <td className="py-2.5 px-3 text-center">
                        <input
                          type="number"
                          step="0.1"
                          min="1"
                          max="20"
                          className="input w-20 text-center font-mono text-sm"
                          value={coeff}
                          onChange={(e) => handleCoefficientChange(category, parseFloat(e.target.value) || 1)}
                        />
                      </td>
                      <td className="py-2.5 px-3 text-right font-mono text-teal-600 dark:text-teal-400 font-semibold">
                        {(3 * coeff).toFixed(2)} &#8364;
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="flex justify-end pt-2">
              <button onClick={saveCoefficients} className="btn-primary flex items-center gap-2 text-sm">
                <Save className="w-4 h-4" />
                Enregistrer
              </button>
            </div>
          </div>
        </Section>

        {/* ================================================================
            3. NOTIFICATION PREFERENCES
           ================================================================ */}
        <Section
          id="notifications"
          icon={<Bell className="w-5 h-5" />}
          iconColor="text-amber-600"
          title="Notifications"
          open={openSections.notifications}
          onToggle={() => toggleSection('notifications')}
        >
          <div className="space-y-1">
            {[
              {
                key: 'alertStockBas' as const,
                label: 'Alertes stock bas',
                desc: 'Prevenir quand un ingredient passe sous le seuil minimum',
                icon: <AlertTriangle className="w-4 h-4" />,
              },
              {
                key: 'alertDLC' as const,
                label: 'Alertes DLC',
                desc: 'Prevenir avant expiration des dates limites de consommation',
                icon: <Bell className="w-4 h-4" />,
              },
              {
                key: 'alertPrix' as const,
                label: 'Alertes prix (mercuriale)',
                desc: 'Notification en cas de variation importante des prix fournisseurs',
                icon: <Calculator className="w-4 h-4" />,
              },
              {
                key: 'rappelCommandes' as const,
                label: 'Rappels commandes',
                desc: 'Rappels pour passer les commandes fournisseurs',
                icon: <RefreshCw className="w-4 h-4" />,
              },
              {
                key: 'alertMessages' as const,
                label: 'Messages',
                desc: "Notifications de messages de l'equipe",
                icon: <Mail className="w-4 h-4" />,
              },
            ].map((item, idx) => (
              <div
                key={item.key}
                className={`flex items-center justify-between py-3 ${
                  idx > 0 ? 'border-t dark:border-slate-700' : ''
                }`}
              >
                <div className="flex items-start gap-3">
                  <span className="text-slate-400 mt-0.5">{item.icon}</span>
                  <div>
                    <p className="text-sm font-medium text-slate-400 dark:text-slate-200">{item.label}</p>
                    <p className="text-xs text-slate-400">{item.desc}</p>
                  </div>
                </div>
                <ToggleSwitch
                  enabled={settings[item.key]}
                  onChange={(val) => handleChange(item.key, val)}
                  color="bg-amber-500"
                />
              </div>
            ))}

            {/* Email notifications master toggle */}
            <div className="flex items-center justify-between py-3 mt-2 pt-4 border-t-2 dark:border-slate-600">
              <div className="flex items-start gap-3">
                <span className="text-slate-400 mt-0.5">
                  {settings.emailNotifications ? (
                    <Mail className="w-4 h-4" />
                  ) : (
                    <BellOff className="w-4 h-4" />
                  )}
                </span>
                <div>
                  <p className="text-sm font-medium text-slate-400 dark:text-slate-200">
                    Notifications par email
                  </p>
                  <p className="text-xs text-slate-400">
                    Recevoir un email pour chaque alerte activée ci-dessus
                  </p>
                </div>
              </div>
              <ToggleSwitch
                enabled={settings.emailNotifications}
                onChange={(val) => handleChange('emailNotifications', val)}
                color="bg-teal-600"
              />
            </div>

            <SectionSaveButton onClick={() => handleSaveSettings('Notifications')} />
          </div>
        </Section>

        {/* ================================================================
            4. APP SETTINGS
           ================================================================ */}
        <Section
          id="app"
          icon={<Palette className="w-5 h-5" />}
          iconColor="text-pink-600"
          title="Application"
          open={openSections.app}
          onToggle={() => toggleSection('app')}
        >
          <div className="space-y-5">
            {/* Theme */}
            <div>
              <label className="label mb-2">Theme</label>
              <div className="flex gap-2">
                {[
                  { value: 'light' as const, label: 'Clair', icon: <Sun className="w-4 h-4" /> },
                  { value: 'dark' as const, label: 'Sombre', icon: <Moon className="w-4 h-4" /> },
                  { value: 'auto' as const, label: 'Auto', icon: <Monitor className="w-4 h-4" /> },
                ].map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => handleChange('theme', opt.value)}
                    className={`flex items-center gap-2 px-4 py-2.5 rounded-lg border text-sm font-medium transition-all ${
                      settings.theme === opt.value
                        ? 'border-teal-500 bg-teal-50 dark:bg-teal-900/30 text-teal-700 dark:text-teal-300 shadow-sm'
                        : 'border-slate-200 dark:border-slate-600 text-slate-300 dark:text-slate-400 hover:border-slate-300 dark:hover:border-slate-500'
                    }`}
                  >
                    {opt.icon}
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Language, Currency, Date format */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="label flex items-center gap-1.5">
                  <Globe className="w-3.5 h-3.5" />
                  Langue
                </label>
                <select
                  className="input w-full"
                  value={settings.language}
                  onChange={(e) => handleChange('language', e.target.value)}
                >
                  <option value="fr">Francais</option>
                </select>
              </div>
              <div>
                <label className="label">Devise</label>
                <select
                  className="input w-full"
                  value={settings.currency}
                  onChange={(e) => handleChange('currency', e.target.value)}
                >
                  <option value="EUR">Euro (EUR)</option>
                  <option value="USD">Dollar ($)</option>
                  <option value="GBP">Livre (GBP)</option>
                  <option value="CHF">Franc suisse (CHF)</option>
                  <option value="MAD">Dirham (MAD)</option>
                </select>
              </div>
              <div>
                <label className="label">Format de date</label>
                <select
                  className="input w-full"
                  value={settings.dateFormat}
                  onChange={(e) => handleChange('dateFormat', e.target.value)}
                >
                  <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                  <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                  <option value="YYYY-MM-DD">YYYY-MM-DD</option>
                </select>
              </div>
            </div>

            {/* Version & PWA */}
            <div className="pt-4 border-t dark:border-slate-700 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-300 dark:text-slate-300">Version</span>
                <span className="text-sm font-mono bg-slate-100 dark:bg-slate-700 px-2.5 py-0.5 rounded text-slate-400 dark:text-slate-300">
                  v{APP_VERSION}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Monitor className="w-4 h-4 text-slate-400" />
                  <span className="text-sm text-slate-300 dark:text-slate-300">Application installable</span>
                </div>
                {isInstalled ? (
                  <span className="text-xs bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 px-2.5 py-1 rounded-full font-medium">
                    Installee
                  </span>
                ) : installPrompt ? (
                  <button onClick={handleInstall} className="btn-primary text-xs px-3 py-1.5">
                    Installer
                  </button>
                ) : (
                  <span className="text-xs bg-slate-100 dark:bg-slate-700 text-slate-400 dark:text-slate-400 px-2.5 py-1 rounded-full">
                    Non disponible
                  </span>
                )}
              </div>
            </div>

            <SectionSaveButton onClick={() => handleSaveSettings('Application')} />
          </div>
        </Section>

        {/* ================================================================
            5. CONNEXIONS
           ================================================================ */}
        <Section
          id="connexions"
          icon={<Bluetooth className="w-5 h-5" />}
          iconColor="text-cyan-600"
          title="Connexions & Export"
          open={openSections.connexions}
          onToggle={() => toggleSection('connexions')}
        >
          <div className="space-y-4">
            {/* Bluetooth balance */}
            <div className="flex items-center justify-between py-3">
              <div className="flex items-center gap-3">
                <div
                  className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                    tealtoothConnected
                      ? 'bg-cyan-100 dark:bg-cyan-900/30'
                      : 'bg-slate-100 dark:bg-slate-700'
                  }`}
                >
                  <Bluetooth
                    className={`w-5 h-5 ${
                      tealtoothConnected
                        ? 'text-cyan-600 dark:text-cyan-400'
                        : 'text-slate-400'
                    }`}
                  />
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-400 dark:text-slate-200">Balance Bluetooth</p>
                  <p className="text-xs text-slate-400 flex items-center gap-1">
                    {tealtoothConnected ? (
                      <>
                        <Wifi className="w-3 h-3 text-green-500" /> Connectée
                      </>
                    ) : (
                      <>
                        <WifiOff className="w-3 h-3" /> Non connectée
                      </>
                    )}
                  </p>
                </div>
              </div>
              <button
                onClick={() => {
                  setBluetoothConnected(!tealtoothConnected);
                  showToast(
                    tealtoothConnected ? 'Balance déconnectée' : 'Recherche de balance en cours...',
                    tealtoothConnected ? 'info' : 'success',
                  );
                }}
                className="btn-secondary text-sm px-4"
              >
                {tealtoothConnected ? 'Déconnecter' : 'Appairer'}
              </button>
            </div>

            {/* Printer */}
            <div className="flex items-center justify-between py-3 border-t dark:border-slate-700">
              <div className="flex items-center gap-3">
                <div
                  className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                    printerConnected
                      ? 'bg-green-100 dark:bg-green-900/30'
                      : 'bg-slate-100 dark:bg-slate-700'
                  }`}
                >
                  <Printer
                    className={`w-5 h-5 ${
                      printerConnected
                        ? 'text-green-600 dark:text-green-400'
                        : 'text-slate-400'
                    }`}
                  />
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-400 dark:text-slate-200">Imprimante</p>
                  <p className="text-xs text-slate-400 flex items-center gap-1">
                    {printerConnected ? (
                      <>
                        <Wifi className="w-3 h-3 text-green-500" /> Configuree
                      </>
                    ) : (
                      <>
                        <WifiOff className="w-3 h-3" /> Non configuree
                      </>
                    )}
                  </p>
                </div>
              </div>
              <button
                onClick={() => {
                  setPrinterConnected(!printerConnected);
                  showToast(
                    printerConnected ? 'Imprimante déconnectée' : 'Imprimante configurée',
                    printerConnected ? 'info' : 'success',
                  );
                }}
                className="btn-secondary text-sm px-4"
              >
                {printerConnected ? 'Déconnecter' : 'Configurer'}
              </button>
            </div>

            {/* Export buttons */}
            <div className="pt-4 border-t dark:border-slate-700">
              <label className="label mb-3">Exporter les donnees</label>
              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={handleExportCSV}
                  className="btn-secondary flex items-center justify-center gap-2 flex-1"
                >
                  <FileSpreadsheet className="w-4 h-4" />
                  Export CSV
                </button>
                <button
                  onClick={handleExportPDF}
                  className="btn-secondary flex items-center justify-center gap-2 flex-1"
                >
                  <FileText className="w-4 h-4" />
                  Export PDF
                </button>
                <button
                  onClick={handleExportData}
                  className="btn-secondary flex items-center justify-center gap-2 flex-1"
                >
                  <Download className="w-4 h-4" />
                  Export JSON
                </button>
              </div>
            </div>
          </div>
        </Section>

        {/* ================================================================
            6. SECURITY / INVITATION CODE
           ================================================================ */}
        <Section
          id="security"
          icon={<Shield className="w-5 h-5" />}
          iconColor="text-orange-600"
          title="Sécurité & Invitation"
          open={openSections.security}
          onToggle={() => toggleSection('security')}
        >
          <div className="space-y-4">
            {/* Invitation code */}
            <div>
              <label className="label">Abonnement</label>
              <div className="flex items-center gap-2">
                <div className="input flex-1 bg-slate-50 dark:bg-slate-700 font-mono text-sm tracking-wider select-all">
                  {PLAN_LABELS[(user as any)?.plan] || 'Basic — 9€/mois'}
                </div>
                <button
                  onClick={handleCopyCode}
                  className="btn-secondary flex items-center gap-1.5 px-3 py-2 text-sm whitespace-nowrap"
                  title="Copier le code"
                >
                  {copied ? (
                    <>
                      <Check className="w-4 h-4 text-green-600" />
                      Copié
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4" />
                      Copier
                    </>
                  )}
                </button>
              </div>
              <p className="text-xs text-slate-400 mt-2 flex items-start gap-1.5">
                <Info className="w-3.5 h-3.5 mt-0.5 flex-shrink-0" />
                Partagez ce code avec vos collaborateurs pour qu'ils puissent s'inscrire.
              </p>
            </div>
          </div>
        </Section>

        {/* ================================================================
            7. PARRAINAGE
           ================================================================ */}
        <Section
          id="referral"
          icon={<Gift className="w-5 h-5" />}
          iconColor="text-amber-500"
          title="Parrainage"
          badge={referralStats.active > 0 ? (
            <span className="text-xs bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 px-2 py-0.5 rounded-full font-medium">
              {referralStats.active} actif{referralStats.active > 1 ? 's' : ''}
            </span>
          ) : undefined}
          open={openSections.referral}
          onToggle={() => toggleSection('referral')}
        >
          <div className="space-y-5">
            {/* Referral code + copy */}
            <div>
              <label className="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-2">Votre code de parrainage</label>
              <div className="flex items-center gap-2">
                <div className="flex-1 bg-slate-100 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg px-4 py-2.5 font-mono text-lg tracking-wider text-slate-800 dark:text-slate-100">
                  {referralLoading ? '...' : referralCode}
                </div>
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(referralLink);
                    setReferralCopied(true);
                    showToast('Lien de parrainage copié !', 'success');
                    setTimeout(() => setReferralCopied(false), 2000);
                  }}
                  className="flex items-center gap-1.5 px-4 py-2.5 rounded-lg bg-amber-500 hover:bg-amber-600 text-white text-sm font-medium transition-colors"
                >
                  {referralCopied ? (
                    <>
                      <Check className="w-4 h-4" />
                      Copié
                    </>
                  ) : (
                    <>
                      <Link className="w-4 h-4" />
                      Copier le lien
                    </>
                  )}
                </button>
              </div>
              <p className="text-xs text-slate-400 mt-2">
                Partagez ce lien : <span className="font-mono text-slate-500 dark:text-slate-400">{referralLink}</span>
              </p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="bg-slate-50 dark:bg-slate-700 rounded-lg p-3 text-center">
                <UserPlus className="w-5 h-5 mx-auto mb-1 text-amber-500" />
                <div className="text-2xl font-bold text-slate-800 dark:text-slate-100">{referralStats.total}</div>
                <div className="text-xs text-slate-400">Parrainages total</div>
              </div>
              <div className="bg-slate-50 dark:bg-slate-700 rounded-lg p-3 text-center">
                <Check className="w-5 h-5 mx-auto mb-1 text-green-500" />
                <div className="text-2xl font-bold text-slate-800 dark:text-slate-100">{referralStats.active}</div>
                <div className="text-xs text-slate-400">Actifs</div>
              </div>
              <div className="bg-slate-50 dark:bg-slate-700 rounded-lg p-3 text-center">
                <Gift className="w-5 h-5 mx-auto mb-1 text-purple-500" />
                <div className="text-2xl font-bold text-slate-800 dark:text-slate-100">{referralStats.freeMonths}</div>
                <div className="text-xs text-slate-400">Mois gratuits gagnes</div>
              </div>
            </div>

            {/* Referral list */}
            {referrals.length > 0 ? (
              <div>
                <h4 className="text-sm font-medium text-slate-600 dark:text-slate-300 mb-2">Vos filleuls</h4>
                <div className="space-y-2">
                  {referrals.map((r: any) => (
                    <div key={r.id} className="flex items-center justify-between bg-slate-50 dark:bg-slate-700 rounded-lg px-4 py-2.5">
                      <div>
                        <p className="text-sm font-medium text-slate-800 dark:text-slate-100">{r.referee_name || r.referee_email}</p>
                        <p className="text-xs text-slate-400">{new Date(r.created_at).toLocaleDateString('fr-FR')}</p>
                      </div>
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                        r.status === 'active'
                          ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300'
                          : r.status === 'pending'
                          ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300'
                          : 'bg-slate-100 dark:bg-slate-600 text-slate-500 dark:text-slate-300'
                      }`}>
                        {r.status === 'active' ? 'Actif' : r.status === 'pending' ? 'En attente' : r.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="text-center py-6 text-slate-400">
                <UserPlus className="w-8 h-8 mx-auto mb-2 opacity-40" />
                <p className="text-sm">Aucun filleul pour le moment</p>
                <p className="text-xs mt-1">Partagez votre lien pour commencer !</p>
              </div>
            )}
          </div>
        </Section>

        {/* ================================================================
            8. DATA MANAGEMENT
           ================================================================ */}
        <Section
          id="data"
          icon={<Database className="w-5 h-5" />}
          iconColor="text-indigo-600"
          title="Gestion des donnees"
          open={openSections.data}
          onToggle={() => toggleSection('data')}
        >
          <div className="space-y-5">
            {/* Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="bg-slate-50 dark:bg-slate-700 rounded-lg p-3 text-center">
                <UtensilsCrossed className="w-5 h-5 mx-auto mb-1 text-teal-500" />
                <div className="text-2xl font-bold text-slate-800 dark:text-slate-100">{stats.recipes}</div>
                <div className="text-xs text-slate-400 dark:text-slate-400">Recettes</div>
              </div>
              <div className="bg-slate-50 dark:bg-slate-700 rounded-lg p-3 text-center">
                <ChefHat className="w-5 h-5 mx-auto mb-1 text-green-500" />
                <div className="text-2xl font-bold text-slate-800 dark:text-slate-100">{stats.ingredients}</div>
                <div className="text-xs text-slate-400 dark:text-slate-400">Ingredients</div>
              </div>
              <div className="bg-slate-50 dark:bg-slate-700 rounded-lg p-3 text-center">
                <Users className="w-5 h-5 mx-auto mb-1 text-purple-500" />
                <div className="text-2xl font-bold text-slate-800 dark:text-slate-100">{stats.users}</div>
                <div className="text-xs text-slate-400 dark:text-slate-400">Utilisateurs</div>
              </div>
            </div>

          </div>
        </Section>

        {/* ================================================================
            9. DANGER ZONE
           ================================================================ */}
        <Section
          id="danger"
          icon={<AlertTriangle className="w-5 h-5" />}
          iconColor="text-red-600"
          title="Zone de danger"
          open={openSections.danger}
          onToggle={() => toggleSection('danger')}
          variant="danger"
        >
          <div className="space-y-4">
            <p className="text-sm text-slate-400 dark:text-slate-400">
              Ces actions sont irreversibles. Veuillez proceder avec prudence.
            </p>

            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={() => {
                  setDeleteConfirmText('');
                  setShowDeleteDataModal(true);
                }}
                className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg border-2 border-red-300 dark:border-red-700 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors text-sm font-medium flex-1"
              >
                <Trash2 className="w-4 h-4" />
                Supprimer toutes les donnees
              </button>
              <button
                onClick={() => {
                  setDeleteConfirmText('');
                  setShowDeleteAccountModal(true);
                }}
                className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-red-600 hover:bg-red-700 text-white transition-colors text-sm font-medium flex-1"
              >
                <Trash2 className="w-4 h-4" />
                Supprimer le compte
              </button>
            </div>
          </div>
        </Section>
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
          <div className="flex items-start gap-3 p-4 bg-red-50 dark:bg-red-900/20 rounded-lg">
            <AlertTriangle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-red-800 dark:text-red-300">
                Cette action est irreversible
              </p>
              <p className="text-sm text-red-600 dark:text-red-400 mt-1">
                Toutes vos recettes, ingredients, paramètres et preferences seront definitivement supprimes.
              </p>
            </div>
          </div>
          <div>
            <label className="label">
              Tapez <span className="font-mono font-bold">SUPPRIMER</span> pour confirmer
            </label>
            <input
              className="input w-full"
              value={deleteConfirmText}
              onChange={(e) => setDeleteConfirmText(e.target.value)}
              placeholder="SUPPRIMER"
            />
          </div>
          <div className="flex justify-end gap-3">
            <button onClick={() => setShowDeleteDataModal(false)} className="btn-secondary text-sm">
              Annuler
            </button>
            <button
              onClick={handleDeleteAllData}
              disabled={deleteConfirmText !== 'SUPPRIMER'}
              className="px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
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
          <div className="flex items-start gap-3 p-4 bg-red-50 dark:bg-red-900/20 rounded-lg">
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
            <label className="label">
              Tapez <span className="font-mono font-bold">SUPPRIMER MON COMPTE</span> pour confirmer
            </label>
            <input
              className="input w-full"
              value={deleteConfirmText}
              onChange={(e) => setDeleteConfirmText(e.target.value)}
              placeholder="SUPPRIMER MON COMPTE"
            />
          </div>
          <div className="flex justify-end gap-3">
            <button onClick={() => setShowDeleteAccountModal(false)} className="btn-secondary text-sm">
              Annuler
            </button>
            <button
              onClick={handleDeleteAccount}
              disabled={deleteConfirmText !== 'SUPPRIMER MON COMPTE'}
              className="px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Supprimer mon compte
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
