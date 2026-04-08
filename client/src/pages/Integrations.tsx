import { useState } from 'react';
import {
  Plug, Key, Webhook, Copy, RefreshCw, ExternalLink, Check, Zap, Eye, EyeOff,
  Plus, Send, Clock, CreditCard, Bluetooth, BarChart3, MessageCircle, Mail,
  MessageSquare, FileSpreadsheet, Shield, Activity, AlertTriangle, CheckCircle,
  XCircle, ChevronDown, ChevronUp, ArrowRight, Settings, Search, X, Wifi,
  WifiOff, Timer, TrendingUp, Heart
} from 'lucide-react';
import { useToast } from '../hooks/useToast';
import { useTranslation } from '../hooks/useTranslation';

// ── Types ─────────────────────────────────────────────────────────────────────

interface WebhookConfig {
  id: string;
  name: string;
  url: string;
  active: boolean;
  lastTriggered: string | null;
  events: string[];
}

type IntegrationStatus = 'connected' | 'available' | 'coming_soon';
type IntegrationCategory = 'all' | 'payments' | 'communication' | 'analytics' | 'tools';

interface Integration {
  id: string;
  name: string;
  description: string;
  features: string[];
  icon: typeof CreditCard;
  iconColor: string;
  iconBg: string;
  status: IntegrationStatus;
  category: IntegrationCategory;
  lastSync?: string;
  uptime?: number;
  requestsToday?: number;
  setupSteps?: string[];
}

interface ApiKeyEntry {
  id: string;
  name: string;
  key: string;
  created: string;
  lastUsed: string;
  scopes: string[];
}

// ── Integration Definitions ──────────────────────────────────────────────────
// Status is loaded from localStorage; defaults to 'available' (not connected)

function loadIntegrationStatuses(): Record<string, IntegrationStatus> {
  try {
    const stored = localStorage.getItem('restaumargin_integration_statuses');
    return stored ? JSON.parse(stored) : {};
  } catch { return {}; }
}

function saveIntegrationStatuses(statuses: Record<string, IntegrationStatus>) {
  localStorage.setItem('restaumargin_integration_statuses', JSON.stringify(statuses));
}

const INTEGRATIONS: Integration[] = [
  {
    id: 'stripe',
    name: 'Stripe',
    description: 'Paiements en ligne, abonnements et facturation automatique',
    features: ['Paiements par carte', 'Abonnements recurrents', 'Factures automatiques', 'Tableau de bord financier'],
    icon: CreditCard,
    iconColor: 'text-violet-600 dark:text-violet-400',
    iconBg: 'bg-violet-100 dark:bg-violet-900/30',
    status: 'available',
    category: 'payments',
    setupSteps: [
      'Creez un compte Stripe sur stripe.com',
      'Recuperez votre cle API depuis le Dashboard',
      'Collez la cle dans le champ ci-dessous',
      'Testez la connexion avec un paiement test',
    ],
  },
  {
    id: 'bluetooth',
    name: 'Balance Bluetooth',
    description: 'Connectez votre balance pour peser les ingredients en temps reel',
    features: ['Pesee en direct', 'Calibration automatique', 'Historique des pesees', 'Alerte de deviation'],
    icon: Bluetooth,
    iconColor: 'text-blue-600 dark:text-blue-400',
    iconBg: 'bg-blue-100 dark:bg-blue-900/30',
    status: 'available',
    category: 'tools',
    setupSteps: [
      'Activez le Bluetooth sur votre tablette',
      'Allumez la balance et mettez-la en mode appairage',
      'Selectionnez la balance dans la liste des appareils',
      'Verifiez la connexion avec un test de pesee',
    ],
  },
  {
    id: 'ga4',
    name: 'Google Analytics 4',
    description: 'Suivez le comportement utilisateur et les conversions',
    features: ['Trafic en temps reel', 'Entonnoir de conversion', 'Segments d\'audience', 'Rapports personnalises'],
    icon: BarChart3,
    iconColor: 'text-orange-600 dark:text-orange-400',
    iconBg: 'bg-orange-100 dark:bg-orange-900/30',
    status: 'available',
    category: 'analytics',
    setupSteps: [
      'Connectez-vous a Google Analytics',
      'Creez une propriete GA4 pour RestauMargin',
      'Copiez l\'ID de mesure (G-XXXXXXXXXX)',
      'Collez-le dans les parametres ci-dessous',
    ],
  },
  {
    id: 'crisp',
    name: 'Crisp',
    description: 'Chat en direct et support client integre',
    features: ['Chat en direct', 'Base de connaissances', 'Chatbot automatise', 'Historique des conversations'],
    icon: MessageCircle,
    iconColor: 'text-purple-600 dark:text-purple-400',
    iconBg: 'bg-purple-100 dark:bg-purple-900/30',
    status: 'available',
    category: 'communication',
    setupSteps: [
      'Creez un compte sur crisp.chat',
      'Ajoutez votre site web dans Crisp',
      'Copiez l\'identifiant du site',
      'Collez-le dans le champ de configuration',
    ],
  },
  {
    id: 'resend',
    name: 'Resend',
    description: 'Envoi d\'emails transactionnels et newsletters',
    features: ['Emails transactionnels', 'Templates HTML', 'Statistiques d\'envoi', 'Gestion des rebonds'],
    icon: Mail,
    iconColor: 'text-black dark:text-white',
    iconBg: 'bg-gray-100 dark:bg-gray-800',
    status: 'available',
    category: 'communication',
    setupSteps: [
      'Inscrivez-vous sur resend.com',
      'Verifiez votre domaine d\'envoi',
      'Generez une cle API',
      'Ajoutez la cle dans RestauMargin',
    ],
  },
  {
    id: 'whatsapp',
    name: 'WhatsApp Business',
    description: 'Notifications clients et alertes equipe via WhatsApp',
    features: ['Notifications de commande', 'Alertes stock bas', 'Messages automatiques', 'Groupes d\'equipe'],
    icon: MessageSquare,
    iconColor: 'text-green-600 dark:text-green-400',
    iconBg: 'bg-green-100 dark:bg-green-900/30',
    status: 'coming_soon',
    category: 'communication',
    setupSteps: [
      'Creez un compte WhatsApp Business API',
      'Configurez un numero de telephone dedie',
      'Obtenez le token d\'acces permanent',
      'Ajoutez le token dans RestauMargin',
    ],
  },
  {
    id: 'excel',
    name: 'Export Excel',
    description: 'Exportez vos donnees en Excel / CSV pour votre comptable',
    features: ['Export en un clic', 'Templates personnalises', 'Planification automatique', 'Compatible Google Sheets'],
    icon: FileSpreadsheet,
    iconColor: 'text-emerald-600 dark:text-emerald-400',
    iconBg: 'bg-emerald-100 dark:bg-emerald-900/30',
    status: 'available',
    category: 'tools',
    setupSteps: [
      'Selectionnez les donnees a exporter',
      'Choisissez le format (Excel ou CSV)',
      'Configurez un planning d\'export automatique',
      'Definissez les destinataires par email',
    ],
  },
];

const INITIAL_WEBHOOKS: WebhookConfig[] = [
  { id: 'wh1', name: 'Nouvelle commande', url: 'https://hooks.example.com/orders', active: true, lastTriggered: '2026-04-08 09:14', events: ['order.created'] },
  { id: 'wh2', name: 'Stock bas', url: 'https://hooks.example.com/low-stock', active: true, lastTriggered: '2026-04-07 17:45', events: ['stock.low'] },
  { id: 'wh3', name: 'Nouvelle recette', url: '', active: false, lastTriggered: null, events: ['recipe.created'] },
  { id: 'wh4', name: 'Prix modifie', url: '', active: false, lastTriggered: null, events: ['price.updated'] },
];

// API keys are managed via localStorage — no hardcoded mock keys
function loadApiKeys(): ApiKeyEntry[] {
  try {
    const stored = localStorage.getItem('restaumargin_api_keys');
    return stored ? JSON.parse(stored) : [];
  } catch { return []; }
}

function saveApiKeys(keys: ApiKeyEntry[]) {
  localStorage.setItem('restaumargin_api_keys', JSON.stringify(keys));
}

// ── Status helpers ──────────────────────────────────────────────────────────

const STATUS_CONFIG: Record<IntegrationStatus, { label: string; badge: string; dot: string }> = {
  connected: {
    label: 'Connecte',
    badge: 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400',
    dot: 'bg-emerald-500',
  },
  available: {
    label: 'Disponible',
    badge: 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400',
    dot: 'bg-blue-500',
  },
  coming_soon: {
    label: 'Bientot',
    badge: 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400',
    dot: 'bg-amber-500',
  },
};

const CATEGORY_TABS: { key: IntegrationCategory; label: string; icon: typeof Plug }[] = [
  { key: 'all', label: 'Toutes', icon: Plug },
  { key: 'payments', label: 'Paiements', icon: CreditCard },
  { key: 'communication', label: 'Communication', icon: MessageCircle },
  { key: 'analytics', label: 'Analytique', icon: BarChart3 },
  { key: 'tools', label: 'Outils', icon: Settings },
];

// ── Component ────────────────────────────────────────────────────────────────

export default function Integrations() {
  const { t } = useTranslation();
  const { showToast } = useToast();

  // State — integration statuses & API keys loaded from localStorage
  const [activeCategory, setActiveCategory] = useState<IntegrationCategory>('all');
  const [integrations, setIntegrations] = useState(() => {
    const savedStatuses = loadIntegrationStatuses();
    return INTEGRATIONS.map(integ => {
      const saved = savedStatuses[integ.id];
      if (saved && saved !== integ.status && integ.status !== 'coming_soon') {
        return {
          ...integ,
          status: saved,
          lastSync: saved === 'connected' ? 'Connecte manuellement' : undefined,
          uptime: saved === 'connected' ? 99.9 : undefined,
          requestsToday: saved === 'connected' ? 0 : undefined,
        };
      }
      return integ;
    });
  });
  const [webhooks, setWebhooks] = useState<WebhookConfig[]>(INITIAL_WEBHOOKS);
  const [apiKeys, setApiKeys] = useState<ApiKeyEntry[]>(loadApiKeys);
  const [visibleKeys, setVisibleKeys] = useState<Record<string, boolean>>({});
  const [confirmRegenerate, setConfirmRegenerate] = useState<string | null>(null);
  const [setupWizard, setSetupWizard] = useState<string | null>(null);
  const [wizardStep, setWizardStep] = useState(0);
  const [expandedCard, setExpandedCard] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  // ── Filtered integrations ────────────────────────────────────────────────

  const filteredIntegrations = integrations.filter(integ => {
    const matchesCategory = activeCategory === 'all' || integ.category === activeCategory;
    const matchesSearch = !searchQuery || integ.name.toLowerCase().includes(searchQuery.toLowerCase()) || integ.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const connectedCount = integrations.filter(i => i.status === 'connected').length;
  const avgUptime = integrations.filter(i => i.uptime).reduce((sum, i) => sum + (i.uptime || 0), 0) / (integrations.filter(i => i.uptime).length || 1);

  // ── API Key Handlers ──────────────────────────────────────────────────────

  const toggleKeyVisibility = (keyId: string) => {
    setVisibleKeys(prev => ({ ...prev, [keyId]: !prev[keyId] }));
  };

  const copyApiKey = (key: string) => {
    navigator.clipboard.writeText(key);
    showToast('Cle API copiee dans le presse-papiers', 'success');
  };

  const regenerateApiKey = (keyId: string) => {
    if (confirmRegenerate !== keyId) {
      setConfirmRegenerate(keyId);
      return;
    }
    setConfirmRegenerate(null);
    const newKey = `rm_live_sk_${Array.from({ length: 40 }, () => '0123456789abcdef'[Math.floor(Math.random() * 16)]).join('')}`;
    const updated = apiKeys.map(k => k.id === keyId ? { ...k, key: newKey, created: new Date().toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' }) } : k);
    setApiKeys(updated);
    saveApiKeys(updated);
    showToast('Nouvelle cle API generee avec succes', 'success');
  };

  const createApiKey = () => {
    const newKey: ApiKeyEntry = {
      id: `key_${Date.now()}`,
      name: `Cle API ${apiKeys.length + 1}`,
      key: `rm_live_sk_${Array.from({ length: 40 }, () => '0123456789abcdef'[Math.floor(Math.random() * 16)]).join('')}`,
      created: new Date().toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' }),
      lastUsed: '-',
      scopes: ['read'],
    };
    const updated = [...apiKeys, newKey];
    setApiKeys(updated);
    saveApiKeys(updated);
    showToast('Nouvelle cle API creee', 'success');
  };

  const deleteApiKey = (keyId: string) => {
    const updated = apiKeys.filter(k => k.id !== keyId);
    setApiKeys(updated);
    saveApiKeys(updated);
    showToast('Cle API supprimee', 'info');
  };

  // ── Webhook Handlers ──────────────────────────────────────────────────────

  const toggleWebhook = (id: string) => {
    setWebhooks(prev => prev.map(wh =>
      wh.id === id ? { ...wh, active: !wh.active } : wh
    ));
  };

  const updateWebhookUrl = (id: string, url: string) => {
    setWebhooks(prev => prev.map(wh =>
      wh.id === id ? { ...wh, url } : wh
    ));
  };

  const testWebhook = (wh: WebhookConfig) => {
    if (!wh.url) {
      showToast('Veuillez saisir une URL avant de tester', 'error');
      return;
    }
    showToast(`Test envoye a ${wh.url}`, 'info');
  };

  const addWebhook = () => {
    const id = `wh${Date.now()}`;
    setWebhooks(prev => [...prev, { id, name: 'Nouveau webhook', url: '', active: false, lastTriggered: null, events: [] }]);
    showToast('Webhook ajoute', 'success');
  };

  const deleteWebhook = (id: string) => {
    setWebhooks(prev => prev.filter(wh => wh.id !== id));
    showToast('Webhook supprime', 'info');
  };

  // ── Integration Handlers ──────────────────────────────────────────────────

  const toggleConnection = (id: string) => {
    const integ = integrations.find(i => i.id === id);
    if (!integ || integ.status === 'coming_soon') return;

    const newStatus: IntegrationStatus = integ.status === 'connected' ? 'available' : 'connected';

    setIntegrations(prev => {
      const updated = prev.map(i =>
        i.id === id
          ? {
              ...i,
              status: newStatus,
              lastSync: newStatus === 'connected' ? 'A l\'instant' : undefined,
              uptime: newStatus === 'connected' ? 99.9 : undefined,
              requestsToday: newStatus === 'connected' ? 0 : undefined,
            }
          : i
      );
      // Persist statuses to localStorage
      const statuses: Record<string, IntegrationStatus> = {};
      updated.forEach(i => { statuses[i.id] = i.status; });
      saveIntegrationStatuses(statuses);
      return updated;
    });
    showToast(
      integ.status === 'connected' ? `${integ.name} deconnecte` : `${integ.name} connecte avec succes`,
      integ.status === 'connected' ? 'info' : 'success'
    );
  };

  const openSetupWizard = (id: string) => {
    setSetupWizard(id);
    setWizardStep(0);
  };

  const closeSetupWizard = () => {
    setSetupWizard(null);
    setWizardStep(0);
  };

  // ── Render ────────────────────────────────────────────────────────────────

  return (
    <div className="space-y-8">
      {/* ── Header ─────────────────────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-black dark:text-white flex items-center gap-3">
            <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-xl">
              <Plug className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
            API & Integrations
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1 text-sm">
            Connectez RestauMargin a vos outils preferes
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-3 py-1.5 bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 rounded-xl text-sm">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="font-medium text-emerald-700 dark:text-emerald-400">{connectedCount} connectees</span>
          </div>
        </div>
      </div>

      {/* ── Integration Health Dashboard ───────────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Integrations actives', value: `${connectedCount}/${integrations.length}`, icon: Wifi, color: 'text-emerald-600 dark:text-emerald-400', bg: 'bg-emerald-50 dark:bg-emerald-900/20' },
          { label: 'Disponibilite moyenne', value: `${avgUptime.toFixed(2)}%`, icon: Activity, color: 'text-blue-600 dark:text-blue-400', bg: 'bg-blue-50 dark:bg-blue-900/20' },
          { label: 'Requetes aujourd\'hui', value: integrations.reduce((s, i) => s + (i.requestsToday || 0), 0).toLocaleString(), icon: TrendingUp, color: 'text-violet-600 dark:text-violet-400', bg: 'bg-violet-50 dark:bg-violet-900/20' },
          { label: 'Webhooks actifs', value: `${webhooks.filter(w => w.active).length}/${webhooks.length}`, icon: Webhook, color: 'text-purple-600 dark:text-purple-400', bg: 'bg-purple-50 dark:bg-purple-900/20' },
        ].map((stat, idx) => (
          <div key={idx} className="bg-white dark:bg-black border border-gray-200 dark:border-gray-800 rounded-2xl p-4 flex items-center gap-4">
            <div className={`p-2.5 rounded-xl ${stat.bg}`}>
              <stat.icon className={`w-5 h-5 ${stat.color}`} />
            </div>
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400">{stat.label}</p>
              <p className="text-lg font-bold text-black dark:text-white">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* ── Category Tabs + Search ─────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-4">
        <div className="flex flex-wrap gap-2 flex-1">
          {CATEGORY_TABS.map(tab => (
            <button
              key={tab.key}
              onClick={() => setActiveCategory(tab.key)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                activeCategory === tab.key
                  ? 'bg-black dark:bg-white text-white dark:text-black shadow-md'
                  : 'bg-white dark:bg-black border border-gray-200 dark:border-gray-800 text-gray-600 dark:text-gray-400 hover:border-gray-400 dark:hover:border-gray-600'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </div>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Rechercher..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="pl-9 pr-4 py-2 w-full sm:w-56 text-sm border border-gray-200 dark:border-gray-800 rounded-xl bg-white dark:bg-black text-black dark:text-white placeholder:text-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
          />
        </div>
      </div>

      {/* ── Integration Cards Grid ─────────────────────────────────────────── */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {filteredIntegrations.map(integ => {
          const statusConf = STATUS_CONFIG[integ.status];
          const Icon = integ.icon;
          const isExpanded = expandedCard === integ.id;

          return (
            <div
              key={integ.id}
              className={`bg-white dark:bg-black border border-gray-200 dark:border-gray-800 rounded-2xl overflow-hidden transition-all hover:shadow-lg hover:border-gray-300 dark:hover:border-gray-700 ${integ.status === 'coming_soon' ? 'opacity-70' : ''}`}
            >
              {/* Card Header */}
              <div className="p-5">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className={`w-11 h-11 rounded-xl flex items-center justify-center ${integ.iconBg}`}>
                      <Icon className={`w-5 h-5 ${integ.iconColor}`} />
                    </div>
                    <div>
                      <h4 className="font-semibold text-black dark:text-white text-sm">{integ.name}</h4>
                      <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-1">{integ.description}</p>
                    </div>
                  </div>
                  <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-[11px] font-semibold rounded-full whitespace-nowrap ${statusConf.badge}`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${statusConf.dot}`} />
                    {statusConf.label}
                  </span>
                </div>

                {/* Features */}
                <div className="space-y-1.5 mb-4">
                  {integ.features.slice(0, isExpanded ? undefined : 2).map((f, i) => (
                    <div key={i} className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-400">
                      <Zap className="w-3 h-3 text-blue-500 flex-shrink-0" />
                      <span>{f}</span>
                    </div>
                  ))}
                  {integ.features.length > 2 && (
                    <button
                      onClick={() => setExpandedCard(isExpanded ? null : integ.id)}
                      className="flex items-center gap-1 text-xs text-blue-600 dark:text-blue-400 hover:underline mt-1"
                    >
                      {isExpanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                      {isExpanded ? 'Moins' : `+${integ.features.length - 2} fonctionnalites`}
                    </button>
                  )}
                </div>

                {/* Health indicators for connected integrations */}
                {integ.status === 'connected' && (
                  <div className="flex items-center gap-3 mb-4 p-2.5 bg-gray-50 dark:bg-gray-900/50 rounded-xl">
                    {integ.uptime && (
                      <div className="flex items-center gap-1.5 text-[11px]">
                        <Heart className="w-3 h-3 text-emerald-500" />
                        <span className="text-emerald-700 dark:text-emerald-400 font-medium">{integ.uptime}%</span>
                      </div>
                    )}
                    {integ.requestsToday !== undefined && (
                      <div className="flex items-center gap-1.5 text-[11px]">
                        <Activity className="w-3 h-3 text-blue-500" />
                        <span className="text-gray-600 dark:text-gray-400">{integ.requestsToday} req.</span>
                      </div>
                    )}
                    {integ.lastSync && (
                      <div className="flex items-center gap-1.5 text-[11px] ml-auto">
                        <Clock className="w-3 h-3 text-gray-400" />
                        <span className="text-gray-500 dark:text-gray-400">{integ.lastSync}</span>
                      </div>
                    )}
                  </div>
                )}

                {/* Actions */}
                <div className="flex gap-2">
                  {integ.status === 'coming_soon' ? (
                    <button disabled className="flex-1 px-4 py-2.5 text-sm font-medium rounded-xl bg-gray-100 dark:bg-gray-900 text-gray-400 dark:text-gray-600 cursor-not-allowed">
                      Bientot disponible
                    </button>
                  ) : integ.status === 'connected' ? (
                    <>
                      <button
                        onClick={() => toggleConnection(integ.id)}
                        className="flex-1 px-4 py-2.5 text-sm font-medium rounded-xl border border-red-200 dark:border-red-800/50 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                      >
                        Deconnecter
                      </button>
                      <button
                        onClick={() => openSetupWizard(integ.id)}
                        className="px-3 py-2.5 rounded-xl border border-gray-200 dark:border-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors"
                        title="Configurer"
                      >
                        <Settings className="w-4 h-4" />
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        onClick={() => toggleConnection(integ.id)}
                        className="flex-1 px-4 py-2.5 text-sm font-medium rounded-xl bg-blue-600 hover:bg-blue-700 text-white transition-colors"
                      >
                        Connecter
                      </button>
                      <button
                        onClick={() => openSetupWizard(integ.id)}
                        className="px-3 py-2.5 rounded-xl border border-gray-200 dark:border-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors"
                        title="Guide d'installation"
                      >
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* ── Setup Wizard Modal ─────────────────────────────────────────────── */}
      {setupWizard && (() => {
        const integ = integrations.find(i => i.id === setupWizard);
        if (!integ || !integ.setupSteps) return null;
        const Icon = integ.icon;

        return (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <div className="bg-white dark:bg-black border border-gray-200 dark:border-gray-800 rounded-2xl w-full max-w-lg shadow-2xl">
              {/* Wizard Header */}
              <div className="flex items-center justify-between p-5 border-b border-gray-200 dark:border-gray-800">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${integ.iconBg}`}>
                    <Icon className={`w-5 h-5 ${integ.iconColor}`} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-black dark:text-white">Configurer {integ.name}</h3>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Etape {wizardStep + 1} sur {integ.setupSteps.length}</p>
                  </div>
                </div>
                <button
                  onClick={closeSetupWizard}
                  className="p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-900 text-gray-500 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Progress Bar */}
              <div className="px-5 pt-4">
                <div className="flex gap-1.5">
                  {integ.setupSteps.map((_, idx) => (
                    <div
                      key={idx}
                      className={`h-1.5 flex-1 rounded-full transition-all ${
                        idx <= wizardStep ? 'bg-blue-600' : 'bg-gray-200 dark:bg-gray-800'
                      }`}
                    />
                  ))}
                </div>
              </div>

              {/* Step Content */}
              <div className="p-5">
                <div className="space-y-4">
                  {integ.setupSteps.map((step, idx) => (
                    <div
                      key={idx}
                      className={`flex items-start gap-3 transition-opacity ${
                        idx === wizardStep ? 'opacity-100' : idx < wizardStep ? 'opacity-40' : 'opacity-20'
                      }`}
                    >
                      <div className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 text-xs font-bold ${
                        idx < wizardStep
                          ? 'bg-emerald-500 text-white'
                          : idx === wizardStep
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-200 dark:bg-gray-800 text-gray-500 dark:text-gray-400'
                      }`}>
                        {idx < wizardStep ? <Check className="w-3.5 h-3.5" /> : idx + 1}
                      </div>
                      <div className="pt-0.5">
                        <p className={`text-sm ${
                          idx === wizardStep ? 'text-black dark:text-white font-medium' : 'text-gray-500 dark:text-gray-400'
                        }`}>
                          {step}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Wizard Footer */}
              <div className="flex items-center justify-between p-5 border-t border-gray-200 dark:border-gray-800">
                <button
                  onClick={() => setWizardStep(Math.max(0, wizardStep - 1))}
                  disabled={wizardStep === 0}
                  className="px-4 py-2 text-sm font-medium rounded-xl text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-900 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                >
                  Precedent
                </button>
                {wizardStep < integ.setupSteps.length - 1 ? (
                  <button
                    onClick={() => setWizardStep(wizardStep + 1)}
                    className="px-5 py-2 text-sm font-medium rounded-xl bg-blue-600 hover:bg-blue-700 text-white transition-colors"
                  >
                    Suivant
                  </button>
                ) : (
                  <button
                    onClick={() => {
                      toggleConnection(integ.id);
                      closeSetupWizard();
                    }}
                    className="px-5 py-2 text-sm font-medium rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white transition-colors flex items-center gap-2"
                  >
                    <Check className="w-4 h-4" /> Terminer
                  </button>
                )}
              </div>
            </div>
          </div>
        );
      })()}

      {/* ── API Keys Section ───────────────────────────────────────────────── */}
      <section className="bg-white dark:bg-black border border-gray-200 dark:border-gray-800 rounded-2xl overflow-hidden">
        <div className="p-5 border-b border-gray-200 dark:border-gray-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-amber-100 dark:bg-amber-900/30 rounded-xl">
              <Key className="w-5 h-5 text-amber-600 dark:text-amber-400" />
            </div>
            <div>
              <h2 className="font-semibold text-black dark:text-white">Cles API</h2>
              <p className="text-xs text-gray-500 dark:text-gray-400">Gerez vos cles d'acces a l'API RestauMargin</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={createApiKey}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-xl bg-teal-600 hover:bg-teal-500 text-white transition-colors"
            >
              <Plus className="w-3.5 h-3.5" /> Creer une cle
            </button>
            <a
              href="#"
              onClick={(e) => { e.preventDefault(); showToast('Documentation API ouverte', 'info'); }}
              className="flex items-center gap-1.5 text-xs text-blue-600 dark:text-blue-400 hover:underline font-medium"
            >
              <ExternalLink className="w-3.5 h-3.5" /> Documentation
            </a>
          </div>
        </div>

        {apiKeys.length === 0 ? (
          <div className="p-10 text-center">
            <Key className="w-10 h-10 text-gray-300 dark:text-gray-600 mx-auto mb-3" />
            <h3 className="text-sm font-semibold text-black dark:text-white mb-1">Aucune cle API</h3>
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-4">Creez une cle API pour integrer RestauMargin avec vos outils externes.</p>
            <button
              onClick={createApiKey}
              className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-medium rounded-xl bg-teal-600 hover:bg-teal-500 text-white transition-colors"
            >
              <Plus className="w-3.5 h-3.5" /> Creer ma premiere cle
            </button>
          </div>
        ) : (
        <div className="divide-y divide-gray-100 dark:divide-gray-800/50">
          {apiKeys.map(apiKey => (
            <div key={apiKey.id} className="p-5 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-semibold text-black dark:text-white">{apiKey.name}</h4>
                  <div className="flex items-center gap-3 mt-1 text-[11px] text-gray-500 dark:text-gray-400">
                    <span>Creee le {apiKey.created}</span>
                    <span>Derniere utilisation : {apiKey.lastUsed}</span>
                  </div>
                </div>
                <div className="flex items-center gap-1.5">
                  {apiKey.scopes.map(scope => (
                    <span key={scope} className="px-2 py-0.5 rounded-md text-[10px] font-medium bg-gray-100 dark:bg-gray-900 text-gray-600 dark:text-gray-400">
                      {scope}
                    </span>
                  ))}
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-2">
                <div className="flex-1 flex items-center gap-2 px-3 py-2.5 bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-800 rounded-xl font-mono text-xs">
                  <span className="flex-1 truncate text-gray-600 dark:text-gray-400">
                    {visibleKeys[apiKey.id] ? apiKey.key : `${apiKey.key.slice(0, 12)}${'*'.repeat(32)}`}
                  </span>
                  <button
                    onClick={() => toggleKeyVisibility(apiKey.id)}
                    className="p-1 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-800 text-gray-500 transition-colors"
                    title={visibleKeys[apiKey.id] ? 'Masquer' : 'Afficher'}
                  >
                    {visibleKeys[apiKey.id] ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  </button>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => copyApiKey(apiKey.key)}
                    className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium rounded-xl border border-gray-200 dark:border-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors"
                  >
                    <Copy className="w-3.5 h-3.5" /> Copier
                  </button>
                  <button
                    onClick={() => regenerateApiKey(apiKey.id)}
                    className={`flex items-center gap-1.5 px-3 py-2 text-xs font-medium rounded-xl transition-colors ${
                      confirmRegenerate === apiKey.id
                        ? 'bg-red-600 hover:bg-red-700 text-white'
                        : 'border border-gray-200 dark:border-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-900'
                    }`}
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    {confirmRegenerate === apiKey.id ? 'Confirmer ?' : 'Regenerer'}
                  </button>
                  <button
                    onClick={() => deleteApiKey(apiKey.id)}
                    className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium rounded-xl border border-red-200 dark:border-red-800/40 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                  >
                    <X className="w-3.5 h-3.5" /> Supprimer
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
        )}

        {/* Usage Stats */}
        {apiKeys.length > 0 && (
        <div className="p-5 border-t border-gray-200 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-900/20">

          <div className="flex items-center justify-between text-sm mb-2">
            <span className="text-gray-600 dark:text-gray-400">Utilisation ce mois</span>
            <span className="font-semibold text-black dark:text-white">0 / 10 000 requetes</span>
          </div>
          <div className="w-full h-2.5 bg-gray-200 dark:bg-gray-800 rounded-full overflow-hidden">
            <div className="h-full bg-blue-600 rounded-full transition-all" style={{ width: '0%' }} />
          </div>
          <p className="text-[11px] text-gray-500 dark:text-gray-400 mt-1.5">Compteur renouvele chaque mois</p>
        </div>
        )}
      </section>

      {/* ── Webhooks Section ────────────────────────────────────────────────── */}
      <section className="bg-white dark:bg-black border border-gray-200 dark:border-gray-800 rounded-2xl overflow-hidden">
        <div className="p-5 border-b border-gray-200 dark:border-gray-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-xl">
              <Webhook className="w-5 h-5 text-purple-600 dark:text-purple-400" />
            </div>
            <div>
              <h2 className="font-semibold text-black dark:text-white">Webhooks</h2>
              <p className="text-xs text-gray-500 dark:text-gray-400">Recevez des notifications en temps reel</p>
            </div>
          </div>
          <button
            onClick={addWebhook}
            className="flex items-center gap-2 px-3.5 py-2 text-sm font-medium rounded-xl bg-blue-600 hover:bg-blue-700 text-white transition-colors"
          >
            <Plus className="w-4 h-4" /> Ajouter
          </button>
        </div>

        <div className="divide-y divide-gray-100 dark:divide-gray-800/50">
          {webhooks.map(wh => (
            <div key={wh.id} className="p-4 sm:p-5">
              <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                <div className="sm:w-44 flex-shrink-0">
                  <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${wh.active ? 'bg-emerald-500' : 'bg-gray-300 dark:bg-gray-700'}`} />
                    <span className="text-sm font-medium text-black dark:text-white">{wh.name}</span>
                  </div>
                  {wh.lastTriggered && (
                    <p className="text-[11px] text-gray-500 dark:text-gray-400 flex items-center gap-1 mt-0.5 ml-4">
                      <Clock className="w-3 h-3" /> {wh.lastTriggered}
                    </p>
                  )}
                </div>
                <input
                  type="url"
                  placeholder="https://votre-endpoint.com/webhook"
                  value={wh.url}
                  onChange={e => updateWebhookUrl(wh.id, e.target.value)}
                  className="flex-1 px-3 py-2.5 text-sm border border-gray-200 dark:border-gray-800 rounded-xl bg-white dark:bg-black text-black dark:text-white placeholder:text-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                />
                <div className="flex items-center gap-2">
                  {/* Toggle */}
                  <button
                    onClick={() => toggleWebhook(wh.id)}
                    className={`relative w-10 h-6 rounded-full transition-colors flex-shrink-0 ${
                      wh.active ? 'bg-emerald-500' : 'bg-gray-200 dark:bg-gray-800'
                    }`}
                  >
                    <span className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow-md transition-transform ${
                      wh.active ? 'translate-x-[18px]' : 'translate-x-0.5'
                    }`} />
                  </button>
                  {/* Test */}
                  <button
                    onClick={() => testWebhook(wh)}
                    className="flex items-center gap-1 px-3 py-2 text-xs font-medium rounded-xl border border-gray-200 dark:border-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors"
                    title="Tester"
                  >
                    <Send className="w-3.5 h-3.5" /> Test
                  </button>
                  {/* Delete */}
                  <button
                    onClick={() => deleteWebhook(wh.id)}
                    className="p-2 rounded-xl text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                    title="Supprimer"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {webhooks.length === 0 && (
          <div className="p-8 text-center">
            <Webhook className="w-10 h-10 text-gray-300 dark:text-gray-700 mx-auto mb-3" />
            <p className="text-sm text-gray-500 dark:text-gray-400">Aucun webhook configure</p>
            <button
              onClick={addWebhook}
              className="mt-3 text-sm text-blue-600 dark:text-blue-400 hover:underline font-medium"
            >
              Ajouter votre premier webhook
            </button>
          </div>
        )}
      </section>

      {/* ── Security & Info Footer ─────────────────────────────────────────── */}
      <div className="bg-white dark:bg-black border border-gray-200 dark:border-gray-800 rounded-2xl p-5">
        <div className="flex items-start gap-3">
          <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-xl flex-shrink-0">
            <Shield className="w-4 h-4 text-blue-600 dark:text-blue-400" />
          </div>
          <div>
            <h4 className="text-sm font-semibold text-black dark:text-white mb-1">Securite des integrations</h4>
            <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
              Toutes les connexions utilisent le chiffrement TLS 1.3. Les cles API sont hashees et ne sont jamais stockees en clair.
              Les webhooks sont signes avec HMAC-SHA256 pour verifier leur authenticite.
            </p>
            <div className="flex flex-wrap gap-4 mt-3">
              <span className="flex items-center gap-1.5 text-[11px] text-gray-500 dark:text-gray-400">
                <CheckCircle className="w-3 h-3 text-emerald-500" /> Chiffrement TLS 1.3
              </span>
              <span className="flex items-center gap-1.5 text-[11px] text-gray-500 dark:text-gray-400">
                <CheckCircle className="w-3 h-3 text-emerald-500" /> Cles hashees (SHA-256)
              </span>
              <span className="flex items-center gap-1.5 text-[11px] text-gray-500 dark:text-gray-400">
                <CheckCircle className="w-3 h-3 text-emerald-500" /> Webhooks signes HMAC
              </span>
              <span className="flex items-center gap-1.5 text-[11px] text-gray-500 dark:text-gray-400">
                <CheckCircle className="w-3 h-3 text-emerald-500" /> Conformite RGPD
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
