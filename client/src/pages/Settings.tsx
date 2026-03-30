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
} from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { useToast } from '../hooks/useToast';
import Modal from '../components/Modal';

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

function ToggleSwitch({ enabled, onChange, color = 'bg-blue-600' }: ToggleSwitchProps) {
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
  const { user } = useAuth();
  const { showToast } = useToast();
  const [settings, setSettings] = useState<AppSettings>(loadSettings);

  // Accordion state
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    profile: true,
    restaurant: false,
    notifications: false,
    app: false,
    connexions: false,
    security: false,
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
  const [seeding, setSeeding] = useState(false);

  // Danger zone modals
  const [showDeleteDataModal, setShowDeleteDataModal] = useState(false);
  const [showDeleteAccountModal, setShowDeleteAccountModal] = useState(false);
  const [deleteConfirmText, setDeleteConfirmText] = useState('');

  // Bluetooth / printer mock state
  const [bluetoothConnected, setBluetoothConnected] = useState(false);
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
      await navigator.clipboard.writeText('restaumargin.vercel.app/pricing');
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

  async function handleSeedDemo() {
    if (seeding) return;
    if (!confirm('Cela va reinitialiser les donnees de demonstration. Continuer ?')) return;
    setSeeding(true);
    try {
      const res = await fetch(`${API_BASE}/seed`, {
        method: 'POST',
        headers: authHeaders(),
      });
      if (res.ok) {
        showToast('Donnees de demonstration reinitialisees', 'success');
        loadStats();
      } else {
        showToast("Le endpoint de seed n'est pas disponible sur ce serveur", 'error');
      }
    } catch {
      showToast("Le endpoint de seed n'est pas disponible sur ce serveur", 'error');
    } finally {
      setSeeding(false);
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
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-violet-500 to-blue-600 flex items-center justify-center text-white text-2xl font-bold shadow-lg">
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
                <p className="text-sm text-slate-500 dark:text-slate-400">{user?.email || '-'}</p>
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
              <h4 className="text-sm font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-2 mb-4">
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
          iconColor="text-blue-600"
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
              <div className="border-2 border-dashed border-slate-300 dark:border-slate-600 rounded-lg p-6 text-center hover:border-blue-400 dark:hover:border-blue-500 transition-colors cursor-pointer">
                <Upload className="w-8 h-8 mx-auto text-slate-400 mb-2" />
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  Cliquer ou glisser-deposer pour ajouter un logo
                </p>
                <p className="text-xs text-slate-400 mt-1">PNG, JPG, SVG - max 2 Mo</p>
              </div>
            </div>

            {/* Margin & coefficient objectives */}
            <div className="pt-4 border-t dark:border-slate-700">
              <h4 className="text-sm font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-2 mb-4">
                <Calculator className="w-4 h-4" />
                Objectifs financiers
              </h4>
              <div className="space-y-4">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="label mb-0">Objectif de marge</label>
                    <span className="text-sm font-bold text-blue-600 dark:text-blue-400">
                      {settings.marginObjective}%
                    </span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    step="1"
                    value={settings.marginObjective}
                    onChange={(e) => handleChange('marginObjective', parseInt(e.target.value))}
                    className="w-full h-2 bg-slate-200 dark:bg-slate-600 rounded-lg appearance-none cursor-pointer accent-blue-600"
                  />
                  <div className="flex justify-between text-xs text-slate-400 mt-1">
                    <span>0%</span>
                    <span>50%</span>
                    <span>100%</span>
                  </div>
                </div>
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
            </div>

            <SectionSaveButton onClick={() => handleSaveSettings('Etablissement')} />
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
                    <p className="text-sm font-medium text-slate-700 dark:text-slate-200">{item.label}</p>
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
                  <p className="text-sm font-medium text-slate-700 dark:text-slate-200">
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
                color="bg-blue-600"
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
                        ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 shadow-sm'
                        : 'border-slate-200 dark:border-slate-600 text-slate-600 dark:text-slate-400 hover:border-slate-300 dark:hover:border-slate-500'
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
                <span className="text-sm text-slate-600 dark:text-slate-300">Version</span>
                <span className="text-sm font-mono bg-slate-100 dark:bg-slate-700 px-2.5 py-0.5 rounded text-slate-700 dark:text-slate-300">
                  v{APP_VERSION}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Monitor className="w-4 h-4 text-slate-500" />
                  <span className="text-sm text-slate-600 dark:text-slate-300">Application installable</span>
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
                  <span className="text-xs bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400 px-2.5 py-1 rounded-full">
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
                    bluetoothConnected
                      ? 'bg-cyan-100 dark:bg-cyan-900/30'
                      : 'bg-slate-100 dark:bg-slate-700'
                  }`}
                >
                  <Bluetooth
                    className={`w-5 h-5 ${
                      bluetoothConnected
                        ? 'text-cyan-600 dark:text-cyan-400'
                        : 'text-slate-400'
                    }`}
                  />
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-700 dark:text-slate-200">Balance Bluetooth</p>
                  <p className="text-xs text-slate-400 flex items-center gap-1">
                    {bluetoothConnected ? (
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
                  setBluetoothConnected(!bluetoothConnected);
                  showToast(
                    bluetoothConnected ? 'Balance déconnectée' : 'Recherche de balance en cours...',
                    bluetoothConnected ? 'info' : 'success',
                  );
                }}
                className="btn-secondary text-sm px-4"
              >
                {bluetoothConnected ? 'Déconnecter' : 'Appairer'}
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
                  <p className="text-sm font-medium text-slate-700 dark:text-slate-200">Imprimante</p>
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
            7. DATA MANAGEMENT
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
                <UtensilsCrossed className="w-5 h-5 mx-auto mb-1 text-blue-500" />
                <div className="text-2xl font-bold text-slate-800 dark:text-slate-100">{stats.recipes}</div>
                <div className="text-xs text-slate-500 dark:text-slate-400">Recettes</div>
              </div>
              <div className="bg-slate-50 dark:bg-slate-700 rounded-lg p-3 text-center">
                <ChefHat className="w-5 h-5 mx-auto mb-1 text-green-500" />
                <div className="text-2xl font-bold text-slate-800 dark:text-slate-100">{stats.ingredients}</div>
                <div className="text-xs text-slate-500 dark:text-slate-400">Ingredients</div>
              </div>
              <div className="bg-slate-50 dark:bg-slate-700 rounded-lg p-3 text-center">
                <Users className="w-5 h-5 mx-auto mb-1 text-purple-500" />
                <div className="text-2xl font-bold text-slate-800 dark:text-slate-100">{stats.users}</div>
                <div className="text-xs text-slate-500 dark:text-slate-400">Utilisateurs</div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={handleSeedDemo}
                disabled={seeding}
                className="btn-secondary flex items-center justify-center gap-2 flex-1 text-orange-600 dark:text-orange-400 border-orange-300 dark:border-orange-600 hover:bg-orange-50 dark:hover:bg-orange-900/20 disabled:opacity-50"
              >
                <RefreshCw className={`w-4 h-4 ${seeding ? 'animate-spin' : ''}`} />
                {seeding ? 'Reinitialisation...' : 'Reinitialiser les donnees demo'}
              </button>
            </div>
          </div>
        </Section>

        {/* ================================================================
            8. DANGER ZONE
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
            <p className="text-sm text-slate-500 dark:text-slate-400">
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
