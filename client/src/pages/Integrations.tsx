import { useState } from 'react';
import { Plug, Key, Webhook, Copy, RefreshCw, ExternalLink, Check, Zap, ShoppingBag, Calculator, Calendar, Truck, Eye, EyeOff, Plus, Send, Clock } from 'lucide-react';
import { useToast } from '../hooks/useToast';
import { useTranslation } from '../hooks/useTranslation';

// ── Types ─────────────────────────────────────────────────────────────────────

interface WebhookConfig {
  id: string;
  name: string;
  url: string;
  active: boolean;
  lastTriggered: string | null;
}

interface Integration {
  id: string;
  name: string;
  description: string;
  features: string[];
  color: string;
  logo: string;
  connected: boolean;
  lastSync?: string;
  comingSoon?: boolean;
}

// ── Mock Data ────────────────────────────────────────────────────────────────

const MOCK_API_KEY = '';

const INITIAL_WEBHOOKS: WebhookConfig[] = [
  { id: 'wh1', name: 'Nouvelle commande', url: 'https://hooks.example.com/orders', active: true, lastTriggered: '2026-03-27 09:14' },
  { id: 'wh2', name: 'Stock bas', url: 'https://hooks.example.com/low-stock', active: true, lastTriggered: '2026-03-26 17:45' },
  { id: 'wh3', name: 'Nouvelle recette', url: '', active: false, lastTriggered: null },
  { id: 'wh4', name: 'Prix modifié', url: '', active: false, lastTriggered: null },
];

const CAISSE_INTEGRATIONS: Integration[] = [
  {
    id: 'lightspeed',
    name: 'Lightspeed',
    description: 'Synchronisez vos ventes et tickets',
    features: ['Import automatique des ventes', 'Synchronisation des tickets', 'Rapprochement des marges'],
    color: '#e4002b',
    logo: 'LS',
    connected: true,
    lastSync: '27 mars 2026, 08:30',
  },
  {
    id: 'zelty',
    name: 'Zelty',
    description: 'Importez vos ventes automatiquement',
    features: ['Import des ventes quotidiennes', 'Suivi des encaissements', 'Analyse par service'],
    color: '#6c63ff',
    logo: 'ZE',
    connected: false,
  },
  {
    id: 'laddition',
    name: "L'Addition",
    description: "Liez votre caisse L'Addition",
    features: ['Liaison caisse directe', 'Export des tickets', 'Suivi du CA par poste'],
    color: '#ff6b35',
    logo: 'LA',
    connected: false,
    comingSoon: true,
  },
  {
    id: 'tiller',
    name: 'Tiller',
    description: 'Connectez votre caisse Tiller',
    features: ['Synchronisation en temps reel', 'Historique des ventes', 'Ventilation par produit'],
    color: '#1a1a2e',
    logo: 'TI',
    connected: false,
    comingSoon: true,
  },
];

const COMPTA_INTEGRATIONS: Integration[] = [
  {
    id: 'pennylane',
    name: 'Pennylane',
    description: 'Exportez vos factures et écritures',
    features: ['Export automatique des factures', 'Écritures comptables', 'Rapprochement bancaire'],
    color: '#6366f1',
    logo: 'PL',
    connected: true,
    lastSync: '26 mars 2026, 23:00',
  },
  {
    id: 'indy',
    name: 'Indy',
    description: 'Synchronisez avec votre comptable',
    features: ['Partage des documents', 'Export des ecritures', 'Suivi TVA'],
    color: '#10b981',
    logo: 'IN',
    connected: false,
  },
  {
    id: 'quickbooks',
    name: 'QuickBooks',
    description: 'Comptabilite cloud internationale',
    features: ['Export plan comptable', 'Factures et depenses', 'Reporting financier'],
    color: '#2ca01c',
    logo: 'QB',
    connected: false,
    comingSoon: true,
  },
];

const RESERVATION_INTEGRATIONS: Integration[] = [
  {
    id: 'thefork',
    name: 'TheFork (LaFourchette)',
    description: 'Previsions basees sur vos reservations',
    features: ['Import des reservations', 'Previsions de couverts', 'Analyse du taux de remplissage'],
    color: '#00ab6b',
    logo: 'TF',
    connected: false,
  },
  {
    id: 'zenchef',
    name: 'Zenchef',
    description: 'Synchronisez vos reservations',
    features: ['Calendrier des reservations', 'Previsions de frequentation', 'Gestion des no-shows'],
    color: '#ff5a5f',
    logo: 'ZC',
    connected: false,
  },
  {
    id: 'octotable',
    name: 'Octotable',
    description: 'Gérez vos réservations',
    features: ['Plan de salle connecté', 'Historique client', 'Prévisions journalières'],
    color: '#7c3aed',
    logo: 'OT',
    connected: false,
    comingSoon: true,
  },
  {
    id: 'google-reserve',
    name: 'Google Reserve',
    description: 'Reservations via Google Maps',
    features: ['Reservations directes', 'Visibilite Google', 'Synchronisation automatique'],
    color: '#4285f4',
    logo: 'GR',
    connected: false,
    comingSoon: true,
  },
];

const LIVRAISON_INTEGRATIONS: Integration[] = [
  {
    id: 'ubereats',
    name: 'Uber Eats',
    description: 'Importez vos commandes livraison',
    features: ['Import des commandes', 'Suivi des commissions', 'Analyse de rentabilite'],
    color: '#06c167',
    logo: 'UE',
    connected: false,
  },
  {
    id: 'deliveroo',
    name: 'Deliveroo',
    description: 'Synchronisez vos ventes Deliveroo',
    features: ['Commandes en temps reel', 'Suivi des marges livraison', 'Catalogue synchronise'],
    color: '#00ccbc',
    logo: 'DL',
    connected: false,
  },
  {
    id: 'justeat',
    name: 'Just Eat',
    description: 'Connectez Just Eat à RestauMargin',
    features: ['Import des commandes', 'Gestion du menu en ligne', 'Statistiques de vente'],
    color: '#ff8000',
    logo: 'JE',
    connected: false,
    comingSoon: true,
  },
];

// ── Component ────────────────────────────────────────────────────────────────

export default function Integrations() {
  const { t } = useTranslation();
  const { showToast } = useToast();
  const [apiKeyVisible, setApiKeyVisible] = useState(false);
  const [webhooks, setWebhooks] = useState<WebhookConfig[]>(INITIAL_WEBHOOKS);
  const [integrations, setIntegrations] = useState({
    caisse: CAISSE_INTEGRATIONS,
    compta: COMPTA_INTEGRATIONS,
    reservation: RESERVATION_INTEGRATIONS,
    livraison: LIVRAISON_INTEGRATIONS,
  });
  const [confirmRegenerate, setConfirmRegenerate] = useState(false);

  // ── API Key Handlers ──────────────────────────────────────────────────────

  const copyApiKey = () => {
    navigator.clipboard.writeText(MOCK_API_KEY);
    showToast('Clé API copiée dans le presse-papiers', 'success');
  };

  const regenerateApiKey = () => {
    if (!confirmRegenerate) {
      setConfirmRegenerate(true);
      return;
    }
    setConfirmRegenerate(false);
    showToast('Nouvelle clé API générée avec succès', 'success');
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
    showToast(`Test envoyé à ${wh.url}`, 'info');
  };

  const addWebhook = () => {
    const id = `wh${Date.now()}`;
    setWebhooks(prev => [...prev, { id, name: 'Nouveau webhook', url: '', active: false, lastTriggered: null }]);
    showToast('Webhook ajouté', 'success');
  };

  // ── Integration Handlers ──────────────────────────────────────────────────

  const toggleConnection = (category: keyof typeof integrations, id: string) => {
    setIntegrations(prev => ({
      ...prev,
      [category]: prev[category].map(integ =>
        integ.id === id && !integ.comingSoon
          ? {
              ...integ,
              connected: !integ.connected,
              lastSync: !integ.connected ? 'A l\'instant' : undefined,
            }
          : integ
      ),
    }));
    const found = integrations[category].find(i => i.id === id);
    if (found && !found.comingSoon) {
      showToast(
        found.connected ? `${found.name} déconnecté` : `${found.name} connecté avec succès`,
        found.connected ? 'info' : 'success'
      );
    }
  };

  // ── Integration Card ──────────────────────────────────────────────────────

  const IntegrationCard = ({ integ, category }: { integ: Integration; category: keyof typeof integrations }) => (
    <div className={`bg-white dark:bg-slate-800 rounded-xl border dark:border-slate-700 p-5 flex flex-col gap-3 transition-all hover:shadow-md ${integ.comingSoon ? 'opacity-75' : ''}`}>
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div
            className="w-12 h-12 rounded-xl flex items-center justify-center text-white font-bold text-sm shadow-md"
            style={{ backgroundColor: integ.color }}
          >
            {integ.logo}
          </div>
          <div>
            <h4 className="font-semibold text-slate-900 dark:text-white">{integ.name}</h4>
            <p className="text-sm text-slate-400 dark:text-slate-400">{integ.description}</p>
          </div>
        </div>
        {integ.comingSoon ? (
          <span className="px-2.5 py-1 text-xs font-medium rounded-full bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 whitespace-nowrap">
            Bientot disponible
          </span>
        ) : integ.connected ? (
          <span className="px-2.5 py-1 text-xs font-medium rounded-full bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 flex items-center gap-1">
            <Check className="w-3 h-3" /> Connecte
          </span>
        ) : (
          <span className="px-2.5 py-1 text-xs font-medium rounded-full bg-slate-100 dark:bg-slate-700 text-slate-400 dark:text-slate-400">
            Non connecte
          </span>
        )}
      </div>

      <ul className="space-y-1">
        {integ.features.map((f, i) => (
          <li key={i} className="flex items-center gap-2 text-sm text-slate-300 dark:text-slate-300">
            <Zap className="w-3.5 h-3.5 text-blue-500 flex-shrink-0" />
            {f}
          </li>
        ))}
      </ul>

      {integ.connected && integ.lastSync && (
        <p className="text-xs text-slate-400 dark:text-slate-500 flex items-center gap-1">
          <Clock className="w-3 h-3" /> Derniere synchro : {integ.lastSync}
        </p>
      )}

      <div className="mt-auto pt-2">
        {integ.comingSoon ? (
          <button disabled className="w-full px-4 py-2 text-sm font-medium rounded-lg bg-slate-100 dark:bg-slate-700 text-slate-400 dark:text-slate-500 cursor-not-allowed">
            Bientot disponible
          </button>
        ) : integ.connected ? (
          <button
            onClick={() => toggleConnection(category, integ.id)}
            className="w-full px-4 py-2 text-sm font-medium rounded-lg border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
          >
            Déconnecter
          </button>
        ) : (
          <button
            onClick={() => toggleConnection(category, integ.id)}
            className="w-full px-4 py-2 text-sm font-medium rounded-lg bg-blue-600 hover:bg-blue-700 text-white transition-colors"
          >
            Connecter
          </button>
        )}
      </div>
    </div>
  );

  // ── Section renderer ──────────────────────────────────────────────────────

  const IntegrationSection = ({
    icon: Icon,
    title,
    items,
    category,
  }: {
    icon: typeof ShoppingBag;
    title: string;
    items: Integration[];
    category: keyof typeof integrations;
  }) => (
    <section>
      <div className="flex items-center gap-2 mb-4">
        <Icon className="w-5 h-5 text-blue-600 dark:text-blue-400" />
        <h3 className="text-lg font-semibold text-slate-900 dark:text-white">{title}</h3>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {items.map(integ => (
          <IntegrationCard key={integ.id} integ={integ} category={category} />
        ))}
      </div>
    </section>
  );

  // ── Render ────────────────────────────────────────────────────────────────

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-3">
          <Plug className="w-7 h-7 text-blue-600 dark:text-blue-400" />
          API & Intégrations
        </h1>
        <p className="text-slate-400 dark:text-slate-400 mt-1">
          Connectez RestauMargin à vos outils
        </p>
      </div>

      {/* ── API Key Section ─────────────────────────────────────────────────── */}
      <section className="bg-white dark:bg-slate-800 rounded-xl border dark:border-slate-700 p-6 space-y-5">
        <div className="flex items-center gap-2">
          <Key className="w-5 h-5 text-amber-500" />
          <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Cle API</h2>
        </div>

        {/* Key display */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1 flex items-center gap-2 px-4 py-2.5 bg-slate-50 dark:bg-slate-900 border dark:border-slate-700 rounded-lg font-mono text-sm">
            <span className="flex-1 truncate text-slate-400 dark:text-slate-300">
              {apiKeyVisible ? MOCK_API_KEY : '\u2022'.repeat(40)}
            </span>
            <button
              onClick={() => setApiKeyVisible(!apiKeyVisible)}
              className="p-1 rounded hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-400 transition-colors"
              title={apiKeyVisible ? 'Masquer' : 'Afficher'}
            >
              {apiKeyVisible ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
          <div className="flex gap-2">
            <button
              onClick={copyApiKey}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg bg-slate-100 dark:bg-slate-700 text-slate-400 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors"
            >
              <Copy className="w-4 h-4" /> Copier
            </button>
            <button
              onClick={regenerateApiKey}
              className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                confirmRegenerate
                  ? 'bg-red-600 hover:bg-red-700 text-white'
                  : 'bg-slate-100 dark:bg-slate-700 text-slate-400 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600'
              }`}
            >
              <RefreshCw className="w-4 h-4" />
              {confirmRegenerate ? 'Confirmer ?' : 'Regenerer'}
            </button>
          </div>
        </div>

        {/* Usage stats */}
        <div>
          <div className="flex items-center justify-between text-sm mb-1.5">
            <span className="text-slate-300 dark:text-slate-400">Utilisation ce mois</span>
            <span className="font-medium text-slate-400 dark:text-slate-300">1 247 / 10 000 requetes</span>
          </div>
          <div className="w-full h-2.5 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
            <div className="h-full bg-blue-600 rounded-full transition-all" style={{ width: '12.47%' }} />
          </div>
          <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">1 247 requetes ce mois</p>
        </div>

        {/* Doc link */}
        <a
          href="#"
          onClick={(e) => { e.preventDefault(); showToast('Documentation API ouverte', 'info'); }}
          className="inline-flex items-center gap-2 text-sm text-blue-600 dark:text-blue-400 hover:underline"
        >
          <ExternalLink className="w-4 h-4" /> Consulter la documentation API
        </a>
      </section>

      {/* ── Webhooks Section ────────────────────────────────────────────────── */}
      <section className="bg-white dark:bg-slate-800 rounded-xl border dark:border-slate-700 p-6 space-y-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Webhook className="w-5 h-5 text-purple-500" />
            <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Webhooks</h2>
          </div>
          <button
            onClick={addWebhook}
            className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium rounded-lg bg-blue-600 hover:bg-blue-700 text-white transition-colors"
          >
            <Plus className="w-4 h-4" /> Ajouter un webhook
          </button>
        </div>

        <div className="space-y-3">
          {webhooks.map(wh => (
            <div
              key={wh.id}
              className="flex flex-col sm:flex-row sm:items-center gap-3 p-4 bg-slate-50 dark:bg-slate-900 rounded-lg border dark:border-slate-700"
            >
              <div className="sm:w-40 flex-shrink-0">
                <span className="text-sm font-medium text-slate-400 dark:text-slate-300">{wh.name}</span>
                {wh.lastTriggered && (
                  <p className="text-xs text-slate-400 dark:text-slate-500 flex items-center gap-1 mt-0.5">
                    <Clock className="w-3 h-3" /> {wh.lastTriggered}
                  </p>
                )}
              </div>
              <input
                type="url"
                placeholder="https://votre-endpoint.com/webhook"
                value={wh.url}
                onChange={e => updateWebhookUrl(wh.id, e.target.value)}
                className="flex-1 px-3 py-2 text-sm border dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-400 dark:text-slate-300 placeholder:text-slate-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              />
              <div className="flex items-center gap-2">
                {/* Toggle */}
                <button
                  onClick={() => toggleWebhook(wh.id)}
                  className={`relative w-10 h-6 rounded-full transition-colors ${
                    wh.active ? 'bg-green-500' : 'bg-slate-300 dark:bg-slate-600'
                  }`}
                >
                  <span className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform ${
                    wh.active ? 'translate-x-[18px]' : 'translate-x-0.5'
                  }`} />
                </button>
                {/* Test */}
                <button
                  onClick={() => testWebhook(wh)}
                  className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium rounded-lg bg-slate-100 dark:bg-slate-700 text-slate-300 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors"
                  title="Tester"
                >
                  <Send className="w-3.5 h-3.5" /> Test
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Integration Sections ────────────────────────────────────────────── */}
      <IntegrationSection
        icon={ShoppingBag}
        title="Integrations Caisse"
        items={integrations.caisse}
        category="caisse"
      />

      <IntegrationSection
        icon={Calculator}
        title="Integrations Comptabilite"
        items={integrations.compta}
        category="compta"
      />

      <IntegrationSection
        icon={Calendar}
        title="Integrations Reservation"
        items={integrations.reservation}
        category="reservation"
      />

      <IntegrationSection
        icon={Truck}
        title="Integrations Livraison"
        items={integrations.livraison}
        category="livraison"
      />
    </div>
  );
}
