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
} from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { useToast } from '../hooks/useToast';

// ---------------------------------------------------------------------------
// Types & defaults
// ---------------------------------------------------------------------------

interface AppSettings {
  companyName: string;
  companyAddress: string;
  companyPhone: string;
  companySiret: string;
  tvaRate: number;
  defaultLaborCost: number;
  marginObjective: number;
  coefficientObjective: number;
  currency: string;
}

const DEFAULT_SETTINGS: AppSettings = {
  companyName: '',
  companyAddress: '',
  companyPhone: '',
  companySiret: '',
  tvaRate: 10,
  defaultLaborCost: 15,
  marginObjective: 70,
  coefficientObjective: 3.3,
  currency: 'EUR',
};

const INVITATION_CODE = 'RESTAUMARGIN2024';
const APP_VERSION = '1.0.0';

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

function saveSettings(settings: AppSettings) {
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
}

function Section({ icon, iconColor, title, badge, open, onToggle, children }: SectionProps) {
  return (
    <div className="bg-white dark:bg-slate-800 rounded-lg shadow overflow-hidden transition-all">
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
// Main component
// ---------------------------------------------------------------------------

export default function Settings() {
  const { user } = useAuth();
  const { showToast } = useToast();
  const [settings, setSettings] = useState<AppSettings>(loadSettings);
  const [hasChanges, setHasChanges] = useState(false);

  // Accordion state - all open by default
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    company: true,
    financial: true,
    security: false,
    data: false,
    appInfo: false,
  });

  // Copy-to-clipboard feedback
  const [copied, setCopied] = useState(false);

  // Stats
  const [stats, setStats] = useState({ recipes: 0, ingredients: 0, users: 0 });

  // Dark mode (mirrors App.tsx logic)
  const [darkMode, setDarkMode] = useState(() => localStorage.getItem('darkMode') === 'true');

  // PWA install
  const [installPrompt, setInstallPrompt] = useState<any>(null);
  const [isInstalled, setIsInstalled] = useState(false);

  // Seeding state
  const [seeding, setSeeding] = useState(false);

  // ------ Effects ------

  useEffect(() => {
    loadStats();
  }, []);

  useEffect(() => {
    const handler = (e: any) => {
      e.preventDefault();
      setInstallPrompt(e);
    };
    window.addEventListener('beforeinstallprompt', handler);

    if (window.matchMedia('(display-mode: standalone)').matches) {
      setIsInstalled(true);
    }

    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

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

  function handleChange(key: keyof AppSettings, value: string | number) {
    setSettings((prev) => ({ ...prev, [key]: value }));
    setHasChanges(true);
  }

  function handleSave() {
    saveSettings(settings);
    setHasChanges(false);
    showToast('Parametres sauvegardes avec succes', 'success');
  }

  function handleReset() {
    setSettings(DEFAULT_SETTINGS);
    setHasChanges(true);
  }

  function toggleSection(id: string) {
    setOpenSections((prev) => ({ ...prev, [id]: !prev[id] }));
  }

  const handleCopyCode = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(INVITATION_CODE);
      setCopied(true);
      showToast('Code copie dans le presse-papier', 'success');
      setTimeout(() => setCopied(false), 2000);
    } catch {
      showToast('Impossible de copier le code', 'error');
    }
  }, [showToast]);

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
      showToast('Donnees exportees avec succes', 'success');
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
        showToast('Le endpoint de seed n\'est pas disponible sur ce serveur', 'error');
      }
    } catch {
      showToast('Le endpoint de seed n\'est pas disponible sur ce serveur', 'error');
    } finally {
      setSeeding(false);
    }
  }

  function handleToggleDark() {
    const next = !darkMode;
    setDarkMode(next);
    localStorage.setItem('darkMode', String(next));
    if (next) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
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

  // ---------------------------------------------------------------------------
  // Render
  // ---------------------------------------------------------------------------

  return (
    <div className="max-w-3xl mx-auto pb-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
          <SettingsIcon className="w-7 h-7" />
          Parametres
        </h2>
        {hasChanges && (
          <button onClick={handleSave} className="btn-primary flex items-center gap-2">
            <Save className="w-4 h-4" /> Sauvegarder
          </button>
        )}
      </div>

      <div className="space-y-4">
        {/* ================================================================
            1. COMPANY INFO
           ================================================================ */}
        <Section
          id="company"
          icon={<Building2 className="w-5 h-5" />}
          iconColor="text-blue-600"
          title="Informations entreprise"
          open={openSections.company}
          onToggle={() => toggleSection('company')}
        >
          <div className="space-y-4">
            <div>
              <label className="label">Nom de l'etablissement</label>
              <input
                className="input w-full"
                value={settings.companyName}
                onChange={(e) => handleChange('companyName', e.target.value)}
                placeholder="Mon Restaurant"
              />
            </div>
            <div>
              <label className="label">Adresse</label>
              <input
                className="input w-full"
                value={settings.companyAddress}
                onChange={(e) => handleChange('companyAddress', e.target.value)}
                placeholder="123 Rue de la Cuisine, 75001 Paris"
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="label">Telephone</label>
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
          </div>
        </Section>

        {/* ================================================================
            2. FINANCIAL SETTINGS
           ================================================================ */}
        <Section
          id="financial"
          icon={<Calculator className="w-5 h-5" />}
          iconColor="text-green-600"
          title="Parametres financiers"
          open={openSections.financial}
          onToggle={() => toggleSection('financial')}
        >
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
                <p className="text-xs text-slate-400 mt-1">Sur place : 10% | A emporter : 5.5%</p>
              </div>
              <div>
                <label className="label">Cout main d'oeuvre par defaut (EUR/h)</label>
                <input
                  type="number"
                  step="0.5"
                  min="0"
                  className="input w-full"
                  value={settings.defaultLaborCost}
                  onChange={(e) => handleChange('defaultLaborCost', parseFloat(e.target.value) || 0)}
                />
                <p className="text-xs text-slate-400 mt-1">Applique par defaut aux nouvelles recettes</p>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="label">Objectif de marge (%)</label>
                <input
                  type="number"
                  step="1"
                  min="0"
                  max="100"
                  className="input w-full"
                  value={settings.marginObjective}
                  onChange={(e) => handleChange('marginObjective', parseFloat(e.target.value) || 0)}
                />
                <p className="text-xs text-slate-400 mt-1">Reference pour les indicateurs de couleur</p>
              </div>
              <div>
                <label className="label">Objectif de coefficient</label>
                <input
                  type="number"
                  step="0.1"
                  min="0"
                  className="input w-full"
                  value={settings.coefficientObjective}
                  onChange={(e) => handleChange('coefficientObjective', parseFloat(e.target.value) || 0)}
                />
                <p className="text-xs text-slate-400 mt-1">Reference : x3.3 minimum recommande</p>
              </div>
            </div>
            <div>
              <label className="label">Devise</label>
              <select
                className="input w-full sm:w-48"
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
          </div>
        </Section>

        {/* ================================================================
            3. SECURITY / INVITATION CODE
           ================================================================ */}
        <Section
          id="security"
          icon={<Shield className="w-5 h-5" />}
          iconColor="text-orange-600"
          title="Securite"
          open={openSections.security}
          onToggle={() => toggleSection('security')}
        >
          <div className="space-y-4">
            {/* Current user info */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="label">Nom</label>
                <div className="input w-full bg-slate-50 dark:bg-slate-700 cursor-not-allowed text-slate-600 dark:text-slate-300">
                  {user?.name || '-'}
                </div>
              </div>
              <div>
                <label className="label">Email</label>
                <div className="input w-full bg-slate-50 dark:bg-slate-700 cursor-not-allowed text-slate-600 dark:text-slate-300">
                  {user?.email || '-'}
                </div>
              </div>
              <div>
                <label className="label">Role</label>
                <div className="input w-full bg-slate-50 dark:bg-slate-700 cursor-not-allowed text-slate-600 dark:text-slate-300">
                  {user?.role === 'admin' ? 'Administrateur' : 'Chef de cuisine'}
                </div>
              </div>
            </div>

            {/* Invitation code */}
            <div className="mt-4 pt-4 border-t dark:border-slate-700">
              <label className="label">Code d'invitation</label>
              <div className="flex items-center gap-2">
                <div className="input flex-1 bg-slate-50 dark:bg-slate-700 font-mono text-sm tracking-wider select-all">
                  {INVITATION_CODE}
                </div>
                <button
                  onClick={handleCopyCode}
                  className="btn-secondary flex items-center gap-1.5 px-3 py-2 text-sm whitespace-nowrap"
                  title="Copier le code"
                >
                  {copied ? (
                    <>
                      <Check className="w-4 h-4 text-green-600" />
                      Copie
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
            4. DATA MANAGEMENT
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
            <div className="grid grid-cols-3 gap-3">
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
                onClick={handleExportData}
                className="btn-secondary flex items-center justify-center gap-2 flex-1"
              >
                <Download className="w-4 h-4" />
                Exporter toutes les donnees
              </button>
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
            5. APPLICATION INFO
           ================================================================ */}
        <Section
          id="appInfo"
          icon={<Info className="w-5 h-5" />}
          iconColor="text-slate-500"
          title="Application"
          open={openSections.appInfo}
          onToggle={() => toggleSection('appInfo')}
        >
          <div className="space-y-4">
            {/* Version */}
            <div className="flex items-center justify-between py-2">
              <span className="text-sm text-slate-600 dark:text-slate-300">Version</span>
              <span className="text-sm font-mono bg-slate-100 dark:bg-slate-700 px-2.5 py-0.5 rounded text-slate-700 dark:text-slate-300">
                v{APP_VERSION}
              </span>
            </div>

            {/* Dark mode toggle */}
            <div className="flex items-center justify-between py-2 border-t dark:border-slate-700">
              <div className="flex items-center gap-2">
                {darkMode ? <Moon className="w-4 h-4 text-indigo-400" /> : <Sun className="w-4 h-4 text-amber-500" />}
                <span className="text-sm text-slate-600 dark:text-slate-300">Mode sombre</span>
              </div>
              <button
                onClick={handleToggleDark}
                className={`relative w-11 h-6 rounded-full transition-colors ${
                  darkMode ? 'bg-indigo-600' : 'bg-slate-300'
                }`}
              >
                <span
                  className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${
                    darkMode ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>

            {/* PWA install status */}
            <div className="flex items-center justify-between py-2 border-t dark:border-slate-700">
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
        </Section>
      </div>

      {/* ================================================================
          Bottom actions
         ================================================================ */}
      <div className="flex flex-col sm:flex-row justify-between gap-3 mt-6">
        <button onClick={handleReset} className="btn-secondary text-sm">
          Reinitialiser les parametres
        </button>
        {hasChanges && (
          <button onClick={handleSave} className="btn-primary flex items-center gap-2">
            <Save className="w-4 h-4" /> Sauvegarder
          </button>
        )}
      </div>
    </div>
  );
}
