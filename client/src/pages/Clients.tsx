import { useState, useEffect, useMemo } from 'react';
import {
  Users, Search, Plus, Edit2, Trash2, Mail, Phone, Building2, Star,
  Tag, Filter, LayoutGrid, List, ChevronDown, ChevronUp, Eye, FileText,
  Download, Shield, Clock, BarChart3, PieChart, TrendingUp, X, AlertTriangle,
  Upload, Copy, ExternalLink, Heart, UserPlus, Send, Loader2,
} from 'lucide-react';
import { useToast } from '../hooks/useToast';
import { useTranslation } from '../hooks/useTranslation';
import Modal from '../components/Modal';

const API = '';

function authHeaders() {
  const token = localStorage.getItem('token');
  const restaurantId = localStorage.getItem('activeRestaurantId');
  return { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json', 'X-Restaurant-Id': restaurantId || '1' };
}

// ── Types ──────────────────────────────────────────────────────────────

type ClientType = 'Particulier' | 'Entreprise' | 'Association';
type ClientTag = 'VIP' | 'Régulier' | 'Nouveau';
type ViewMode = 'cards' | 'table';
type SortField = 'nom' | 'caTotal' | 'derniereVisite';
type TabId = 'infos' | 'preferences' | 'historique' | 'documents' | 'rgpd';

interface Allergene {
  id: string;
  nom: string;
}

interface Interaction {
  id: string;
  date: string;
  type: 'devis' | 'evenement' | 'facture' | 'email' | 'appel';
  description: string;
  montant?: number;
}

interface Document {
  id: string;
  type: 'devis' | 'facture';
  numero: string;
  date: string;
  montant: number;
  statut: string;
}

interface Client {
  id: string;
  nom: string;
  prenom: string;
  entreprise: string;
  siret: string;
  type: ClientType;
  tags: ClientTag[];
  email: string;
  telephone: string;
  adresse: string;
  notes: string;
  caTotal: number;
  nbCommandes: number;
  derniereVisite: string;
  dateCreation: string;
  allergenes: string[];
  regime: string[];
  platsFavoris: string[];
  historique: Interaction[];
  documents: Document[];
  consentementRGPD: string;
}

// ── Constants ──────────────────────────────────────────────────────────

const EU_ALLERGENES: Allergene[] = [
  { id: 'gluten', nom: 'Gluten' },
  { id: 'crustaces', nom: 'Crustacés' },
  { id: 'oeufs', nom: 'Oeufs' },
  { id: 'poisson', nom: 'Poisson' },
  { id: 'arachides', nom: 'Arachides' },
  { id: 'soja', nom: 'Soja' },
  { id: 'lait', nom: 'Lait' },
  { id: 'fruits_coques', nom: 'Fruits à coques' },
  { id: 'celeri', nom: 'Céleri' },
  { id: 'moutarde', nom: 'Moutarde' },
  { id: 'sesame', nom: 'Sésame' },
  { id: 'sulfites', nom: 'Sulfites' },
  { id: 'lupin', nom: 'Lupin' },
  { id: 'mollusques', nom: 'Mollusques' },
];

const REGIMES = ['Végétarien', 'Vegan', 'Halal', 'Casher', 'Sans gluten'];

const TAG_COLORS: Record<ClientTag, { bg: string; text: string; border: string }> = {
  VIP: { bg: 'bg-amber-100 dark:bg-amber-900/40', text: 'text-amber-700 dark:text-amber-300', border: 'border-amber-300 dark:border-amber-700' },
  Régulier: { bg: 'bg-blue-100 dark:bg-blue-900/40', text: 'text-blue-700 dark:text-blue-300', border: 'border-blue-300 dark:border-blue-700' },
  Nouveau: { bg: 'bg-green-100 dark:bg-green-900/40', text: 'text-green-700 dark:text-green-300', border: 'border-green-300 dark:border-green-700' },
};

const TYPE_COLORS: Record<ClientType, { bg: string; text: string }> = {
  Particulier: { bg: 'bg-slate-100 dark:bg-slate-700', text: 'text-slate-400 dark:text-slate-300' },
  Entreprise: { bg: 'bg-indigo-100 dark:bg-indigo-900/40', text: 'text-indigo-700 dark:text-indigo-300' },
  Association: { bg: 'bg-rose-100 dark:bg-rose-900/40', text: 'text-rose-700 dark:text-rose-300' },
};

const EMAIL_TEMPLATES = [
  { id: 'confirmation', label: 'Confirmation de réservation', subject: 'Confirmation de votre réservation', body: 'Bonjour,\n\nNous avons le plaisir de confirmer votre réservation pour le [DATE].\n\nCordialement,' },
  { id: 'rappel', label: 'Rappel événement J-3', subject: 'Rappel : votre événement dans 3 jours', body: 'Bonjour,\n\nNous vous rappelons que votre événement est prévu dans 3 jours.\n\nCordialement,' },
  { id: 'remerciement', label: 'Remerciement post-événement', subject: 'Merci pour votre confiance !', body: 'Bonjour,\n\nNous tenions à vous remercier pour votre confiance lors de votre dernier événement.\n\nCordialement,' },
  { id: 'relance', label: 'Relance devis en attente', subject: 'Votre devis en attente', body: 'Bonjour,\n\nNous revenons vers vous concernant le devis que nous vous avons transmis.\n\nCordialement,' },
  { id: 'promo', label: 'Offre spéciale / promotion', subject: 'Offre spéciale pour vous !', body: 'Bonjour,\n\nNous avons le plaisir de vous faire parvenir une offre exclusive.\n\nCordialement,' },
];

// ── Local Storage Persistence (no backend Client model yet) ───────────

const CLIENTS_STORAGE_KEY = 'restaumargin_clients';

function loadClientsFromStorage(): Client[] {
  try {
    const raw = localStorage.getItem(CLIENTS_STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch { /* corrupt data */ }
  return [];
}

function saveClientsToStorage(clients: Client[]) {
  try { localStorage.setItem(CLIENTS_STORAGE_KEY, JSON.stringify(clients)); } catch { /* quota */ }
}

function initClients(): Client[] {
  const stored = loadClientsFromStorage();
  return stored;
}

// ── Helpers ─────────────────────────────────────────────────────────────

function fmt(n: number) {
  return n.toLocaleString('fr-FR', { style: 'currency', currency: 'EUR', minimumFractionDigits: 0, maximumFractionDigits: 0 });
}

function fmtDate(d: string) {
  if (!d) return '—';
  return new Date(d).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' });
}

function getInitials(nom: string, prenom: string) {
  return `${prenom?.[0] || ''}${nom?.[0] || ''}`.toUpperCase();
}

const interactionIcons: Record<string, { icon: string; color: string }> = {
  devis: { icon: '📋', color: 'bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300' },
  evenement: { icon: '🎉', color: 'bg-purple-100 dark:bg-purple-900/40 text-purple-700 dark:text-purple-300' },
  facture: { icon: '📄', color: 'bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-300' },
  email: { icon: '✉️', color: 'bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-300' },
  appel: { icon: '📞', color: 'bg-rose-100 dark:bg-rose-900/40 text-rose-700 dark:text-rose-300' },
};

// ── Component ──────────────────────────────────────────────────────────

export default function Clients() {
  const { showToast } = useToast();
  const { t } = useTranslation();

  // State (persisted to localStorage — no backend Client model yet)
  const [clients, setClients] = useState<Client[]>(initClients);
  useEffect(() => { saveClientsToStorage(clients); }, [clients]);
  const [search, setSearch] = useState('');
  const [filterType, setFilterType] = useState<ClientType | ''>('');
  const [filterTag, setFilterTag] = useState<ClientTag | ''>('');
  const [sortField, setSortField] = useState<SortField>('nom');
  const [sortAsc, setSortAsc] = useState(true);
  const [viewMode, setViewMode] = useState<ViewMode>('cards');

  // Modals
  const [showDetail, setShowDetail] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [showEmail, setShowEmail] = useState(false);
  const [showStats, setShowStats] = useState(false);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [editingClient, setEditingClient] = useState<Client | null>(null);
  const [detailTab, setDetailTab] = useState<TabId>('infos');

  // Form state
  const emptyForm: Client = {
    id: '', nom: '', prenom: '', entreprise: '', siret: '', type: 'Particulier',
    tags: [], email: '', telephone: '', adresse: '', notes: '',
    caTotal: 0, nbCommandes: 0, derniereVisite: '', dateCreation: new Date().toISOString().split('T')[0],
    allergenes: [], regime: [], platsFavoris: [], historique: [], documents: [],
    consentementRGPD: new Date().toISOString().split('T')[0],
  };
  const [form, setForm] = useState<Client>(emptyForm);
  const [duplicateWarning, setDuplicateWarning] = useState('');
  const [selectedTemplate, setSelectedTemplate] = useState('');
  const [emailSubject, setEmailSubject] = useState('');
  const [emailMessage, setEmailMessage] = useState('');
  const [sendingClientEmail, setSendingClientEmail] = useState(false);

  // ── Filtering & sorting ───────────────────────────────────────────────

  const filtered = useMemo(() => {
    let result = [...clients];
    if (search) {
      const q = search.toLowerCase();
      result = result.filter(c =>
        c.nom.toLowerCase().includes(q) ||
        c.prenom.toLowerCase().includes(q) ||
        c.entreprise.toLowerCase().includes(q) ||
        c.email.toLowerCase().includes(q)
      );
    }
    if (filterType) result = result.filter(c => c.type === filterType);
    if (filterTag) result = result.filter(c => c.tags.includes(filterTag));

    result.sort((a, b) => {
      let cmp = 0;
      if (sortField === 'nom') cmp = a.nom.localeCompare(b.nom);
      else if (sortField === 'caTotal') cmp = a.caTotal - b.caTotal;
      else if (sortField === 'derniereVisite') cmp = (a.derniereVisite || '').localeCompare(b.derniereVisite || '');
      return sortAsc ? cmp : -cmp;
    });
    return result;
  }, [clients, search, filterType, filterTag, sortField, sortAsc]);

  // ── Actions ───────────────────────────────────────────────────────────

  function openDetail(c: Client) {
    setSelectedClient(c);
    setDetailTab('infos');
    setShowDetail(true);
  }

  function openAdd() {
    setEditingClient(null);
    setForm({ ...emptyForm, id: crypto.randomUUID() });
    setDuplicateWarning('');
    setShowForm(true);
  }

  function openEdit(c: Client) {
    setEditingClient(c);
    setForm({ ...c });
    setDuplicateWarning('');
    setShowForm(true);
  }

  function checkDuplicate(nom: string, email: string) {
    const existing = clients.find(c =>
      c.id !== form.id &&
      (c.email.toLowerCase() === email.toLowerCase() ||
       c.nom.toLowerCase() === nom.toLowerCase())
    );
    if (existing) {
      setDuplicateWarning(t('clients.duplicateFound').replace('{name}', `${existing.prenom} ${existing.nom}`).replace('{email}', existing.email));
    } else {
      setDuplicateWarning('');
    }
  }

  function handleSave() {
    if (!form.nom || !form.email) {
      showToast(t('clients.nameAndEmailRequired'), 'error');
      return;
    }
    if (editingClient) {
      setClients(prev => prev.map(c => c.id === form.id ? form : c));
      showToast(t('clients.clientUpdated'), 'success');
    } else {
      setClients(prev => [...prev, form]);
      showToast(t('clients.newClientAdded'), 'success');
    }
    setShowForm(false);
  }

  function handleDelete(id: string) {
    setClients(prev => prev.filter(c => c.id !== id));
    setShowDetail(false);
    showToast(t('clients.clientDeleted'), 'success');
  }

  function openEmailModal(c: Client) {
    setSelectedClient(c);
    setSelectedTemplate('');
    setEmailSubject('');
    setEmailMessage('');
    setShowEmail(true);
  }

  function applyTemplate(template: typeof EMAIL_TEMPLATES[0]) {
    setEmailSubject(template.subject);
    setEmailMessage(template.body);
    setSelectedTemplate(template.id);
  }

  async function handleSendClientEmail() {
    if (!selectedClient) return;
    if (!emailSubject.trim() || !emailMessage.trim()) {
      showToast(t('clients.fillSubjectAndMessage'), 'error');
      return;
    }
    setSendingClientEmail(true);
    try {
      const res = await fetch(`${API}/api/crm/send-email`, {
        method: 'POST',
        headers: authHeaders(),
        body: JSON.stringify({
          clientName: `${selectedClient.prenom} ${selectedClient.nom}`,
          clientEmail: selectedClient.email,
          subject: emailSubject,
          message: emailMessage,
        }),
      });
      if (!res.ok) throw new Error('Erreur envoi');
      showToast(t('clients.emailSent').replace('{name}', `${selectedClient.prenom} ${selectedClient.nom}`), 'success');
      setShowEmail(false);
      setEmailSubject('');
      setEmailMessage('');
      setSelectedTemplate('');
    } catch {
      showToast(t('clients.emailSendError'), 'error');
    } finally {
      setSendingClientEmail(false);
    }
  }

  function exportClientData(c: Client) {
    const data = JSON.stringify(c, null, 2);
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `client_${c.nom}_${c.prenom}.json`;
    a.click();
    URL.revokeObjectURL(url);
    showToast(t('clients.dataExported'), 'success');
  }

  function handleRGPDForget(c: Client) {
    setClients(prev => prev.filter(cl => cl.id !== c.id));
    setShowDetail(false);
    showToast(t('clients.rgpdForget').replace('{name}', `${c.prenom} ${c.nom}`), 'success');
  }

  function handleCSVImport() {
    showToast(t('clients.csvImportSoon'), 'info');
  }

  // ── Stats ─────────────────────────────────────────────────────────────

  const stats = useMemo(() => {
    const top10 = [...clients].sort((a, b) => b.caTotal - a.caTotal).slice(0, 10);
    const byType = { Particulier: 0, Entreprise: 0, Association: 0 };
    const byTag = { VIP: 0, Régulier: 0, Nouveau: 0 };
    clients.forEach(c => {
      byType[c.type]++;
      c.tags.forEach(t => byTag[t]++);
    });
    const totalCA = clients.reduce((s, c) => s + c.caTotal, 0);
    const avgCA = clients.length ? totalCA / clients.length : 0;
    return { top10, byType, byTag, totalCA, avgCA };
  }, [clients]);

  // ── Render helpers ────────────────────────────────────────────────────

  function renderTags(tags: ClientTag[]) {
    return tags.map(t => (
      <span key={t} className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium border ${(TAG_COLORS[t] || TAG_COLORS['VIP']).bg} ${(TAG_COLORS[t] || TAG_COLORS['VIP']).text} ${(TAG_COLORS[t] || TAG_COLORS['VIP']).border}`}>
        {t === 'VIP' && <Star className="w-3 h-3" />}
        {t}
      </span>
    ));
  }

  function renderAvatar(c: Client, size = 'w-10 h-10 text-sm') {
    const colors = c.tags.includes('VIP')
      ? 'from-amber-500 to-amber-700'
      : c.type === 'Entreprise'
        ? 'from-indigo-500 to-indigo-700'
        : 'from-blue-500 to-blue-700';
    return (
      <div className={`${size} rounded-full bg-gradient-to-br ${colors} flex items-center justify-center text-white font-bold flex-shrink-0`}>
        {getInitials(c.nom, c.prenom)}
      </div>
    );
  }

  // ── Client Card ───────────────────────────────────────────────────────

  function ClientCard({ c }: { c: Client }) {
    return (
      <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-5 hover:shadow-lg hover:border-blue-300 dark:hover:border-blue-600 transition-all cursor-pointer group"
        onClick={() => openDetail(c)}>
        <div className="flex items-start gap-4">
          {renderAvatar(c, 'w-12 h-12 text-base')}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="font-semibold text-slate-900 dark:text-white truncate">{c.prenom} {c.nom}</h3>
              <span className={`px-2 py-0.5 rounded text-xs font-medium ${(TYPE_COLORS[c.type] || TYPE_COLORS['Particulier']).bg} ${(TYPE_COLORS[c.type] || TYPE_COLORS['Particulier']).text}`}>{c.type}</span>
            </div>
            {c.entreprise && (
              <div className="flex items-center gap-1.5 text-sm text-slate-400 dark:text-slate-400 mt-0.5">
                <Building2 className="w-3.5 h-3.5" />
                <span className="truncate">{c.entreprise}</span>
              </div>
            )}
            <div className="flex items-center gap-3 mt-1 text-xs text-slate-400 dark:text-slate-500">
              <span className="flex items-center gap-1"><Mail className="w-3 h-3" />{c.email}</span>
            </div>
            <div className="flex items-center gap-2 mt-2 flex-wrap">
              {renderTags(c.tags)}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3 mt-4 pt-4 border-t border-slate-100 dark:border-slate-700">
          <div className="text-center">
            <div className="text-lg font-bold text-slate-900 dark:text-white">{fmt(c.caTotal)}</div>
            <div className="text-xs text-slate-400 dark:text-slate-500">{t('clients.caTotal')}</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-bold text-slate-900 dark:text-white">{c.nbCommandes}</div>
            <div className="text-xs text-slate-400 dark:text-slate-500">{t('clients.orders')}</div>
          </div>
          <div className="text-center">
            <div className="text-sm font-medium text-slate-400 dark:text-slate-300">{fmtDate(c.derniereVisite)}</div>
            <div className="text-xs text-slate-400 dark:text-slate-500">{t('clients.lastVisit')}</div>
          </div>
        </div>

        <div className="flex items-center gap-2 mt-4 opacity-0 group-hover:opacity-100 transition-opacity">
          <button onClick={(e) => { e.stopPropagation(); openEmailModal(c); }}
            className="flex-1 flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900/50 transition-colors">
            <Mail className="w-3.5 h-3.5" /> {t('clients.email')}
          </button>
          <a href={`tel:${c.telephone}`} onClick={(e) => e.stopPropagation()}
            className="flex-1 flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-green-50 dark:bg-green-900/30 text-green-600 dark:text-green-400 hover:bg-green-100 dark:hover:bg-green-900/50 transition-colors">
            <Phone className="w-3.5 h-3.5" /> {t('clients.call')}
          </a>
          <button onClick={(e) => { e.stopPropagation(); openEdit(c); }}
            className="flex-1 flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-50 dark:bg-slate-700 text-slate-300 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-600 transition-colors">
            <FileText className="w-3.5 h-3.5" /> {t('clients.quote')}
          </button>
        </div>
      </div>
    );
  }

  // ── Simple Bar Chart ──────────────────────────────────────────────────

  function BarChartSimple({ data }: { data: { label: string; value: number }[] }) {
    const max = Math.max(...data.map(d => d.value), 1);
    return (
      <div className="space-y-2">
        {data.map((d, i) => (
          <div key={i} className="flex items-center gap-3">
            <div className="w-28 text-xs text-slate-300 dark:text-slate-400 truncate text-right">{d.label}</div>
            <div className="flex-1 bg-slate-100 dark:bg-slate-700 rounded-full h-5 overflow-hidden">
              <div className="h-full bg-gradient-to-r from-blue-500 to-blue-600 rounded-full transition-all duration-500 flex items-center justify-end pr-2"
                style={{ width: `${(d.value / max) * 100}%` }}>
                {d.value > 0 && <span className="text-[10px] text-white font-medium">{fmt(d.value)}</span>}
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  // ── Pie Chart (simple CSS) ────────────────────────────────────────────

  function PieChartSimple({ data }: { data: { label: string; value: number; color: string }[] }) {
    const total = data.reduce((s, d) => s + d.value, 0) || 1;
    let acc = 0;
    const segments = data.map(d => {
      const start = acc;
      acc += (d.value / total) * 360;
      return { ...d, start, end: acc };
    });
    const gradient = segments.map(s => `${s.color} ${s.start}deg ${s.end}deg`).join(', ');
    return (
      <div className="flex items-center gap-6">
        <div className="w-32 h-32 rounded-full flex-shrink-0"
          style={{ background: `conic-gradient(${gradient})` }} />
        <div className="space-y-2">
          {data.map((d, i) => (
            <div key={i} className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: d.color }} />
              <span className="text-sm text-slate-300 dark:text-slate-400">{d.label}: <strong>{d.value}</strong></span>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // ── Render ────────────────────────────────────────────────────────────

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-3">
            <Users className="w-7 h-7 text-blue-600 dark:text-blue-400" />
            {t('clients.title')}
          </h1>
          <p className="text-sm text-slate-400 dark:text-slate-400 mt-1">
            {t('clients.subtitle').replace('{count}', String(clients.length)).replace('{ca}', fmt(stats.totalCA))}
          </p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <button onClick={() => setShowStats(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-100 dark:bg-slate-700 text-slate-400 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-600 text-sm font-medium transition-colors">
            <BarChart3 className="w-4 h-4" /> {t('clients.statistics')}
          </button>
          <button onClick={handleCSVImport}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-100 dark:bg-slate-700 text-slate-400 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-600 text-sm font-medium transition-colors">
            <Upload className="w-4 h-4" /> {t('clients.importCSV')}
          </button>
          <button onClick={openAdd}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium transition-colors shadow-sm">
            <Plus className="w-4 h-4" /> {t('clients.newClient')}
          </button>
        </div>
      </div>

      {/* Filters bar */}
      <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-4">
        <div className="flex flex-col md:flex-row items-stretch md:items-center gap-3">
          {/* Search */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input type="text" placeholder={t('clients.searchPlaceholder')}
              value={search} onChange={e => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-lg border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-900 text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
          </div>

          {/* Type filter */}
          <select value={filterType} onChange={e => setFilterType(e.target.value as ClientType | '')}
            className="px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-900 text-sm text-slate-400 dark:text-slate-300">
            <option value="">{t('clients.allTypes')}</option>
            <option value="Particulier">{t('clients.individual')}</option>
            <option value="Entreprise">{t('clients.company')}</option>
            <option value="Association">{t('clients.association')}</option>
          </select>

          {/* Tag filter */}
          <select value={filterTag} onChange={e => setFilterTag(e.target.value as ClientTag | '')}
            className="px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-900 text-sm text-slate-400 dark:text-slate-300">
            <option value="">{t('clients.allTags')}</option>
            <option value="VIP">VIP</option>
            <option value="Régulier">{t('clients.regular')}</option>
            <option value="Nouveau">{t('clients.newTag')}</option>
          </select>

          {/* Sort */}
          <div className="flex items-center gap-1">
            <select value={sortField} onChange={e => setSortField(e.target.value as SortField)}
              className="px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-900 text-sm text-slate-400 dark:text-slate-300">
              <option value="nom">{t('clients.sortByName')}</option>
              <option value="caTotal">{t('clients.sortByCA')}</option>
              <option value="derniereVisite">{t('clients.sortByVisit')}</option>
            </select>
            <button onClick={() => setSortAsc(!sortAsc)}
              className="p-2 rounded-lg border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors">
              {sortAsc ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
            </button>
          </div>

          {/* View toggle */}
          <div className="flex items-center bg-slate-100 dark:bg-slate-700 rounded-lg p-0.5">
            <button onClick={() => setViewMode('cards')}
              className={`p-2 rounded-md transition-colors ${viewMode === 'cards' ? 'bg-white dark:bg-slate-600 shadow-sm text-blue-600 dark:text-blue-400' : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-300'}`}>
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button onClick={() => setViewMode('table')}
              className={`p-2 rounded-md transition-colors ${viewMode === 'table' ? 'bg-white dark:bg-slate-600 shadow-sm text-blue-600 dark:text-blue-400' : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-300'}`}>
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Results count */}
      {filtered.length !== clients.length && (
        <p className="text-sm text-slate-400 dark:text-slate-400">
          {t('clients.resultsCount').replace('{count}', String(filtered.length)).replace('{total}', String(clients.length))}
        </p>
      )}

      {/* Card view */}
      {viewMode === 'cards' && (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filtered.map(c => <ClientCard key={c.id} c={c} />)}
        </div>
      )}

      {/* Table view */}
      {viewMode === 'table' && (
        <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/50">
                <th className="text-left px-4 py-3 font-medium text-slate-400 dark:text-slate-400">{t('clients.client')}</th>
                <th className="text-left px-4 py-3 font-medium text-slate-400 dark:text-slate-400">{t('clients.typCol')}</th>
                <th className="text-left px-4 py-3 font-medium text-slate-400 dark:text-slate-400">{t('clients.tagsCol')}</th>
                <th className="text-right px-4 py-3 font-medium text-slate-400 dark:text-slate-400">{t('clients.caTotal')}</th>
                <th className="text-center px-4 py-3 font-medium text-slate-400 dark:text-slate-400">{t('clients.orders')}</th>
                <th className="text-left px-4 py-3 font-medium text-slate-400 dark:text-slate-400">{t('clients.lastVisit')}</th>
                <th className="text-center px-4 py-3 font-medium text-slate-400 dark:text-slate-400">{t('clients.actions')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
              {filtered.map(c => (
                <tr key={c.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/30 cursor-pointer transition-colors"
                  onClick={() => openDetail(c)}>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      {renderAvatar(c, 'w-8 h-8 text-xs')}
                      <div>
                        <div className="font-medium text-slate-900 dark:text-white">{c.prenom} {c.nom}</div>
                        <div className="text-xs text-slate-400 dark:text-slate-500">{c.entreprise || c.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-0.5 rounded text-xs font-medium ${(TYPE_COLORS[c.type] || TYPE_COLORS['Particulier']).bg} ${(TYPE_COLORS[c.type] || TYPE_COLORS['Particulier']).text}`}>{c.type}</span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-1 flex-wrap">{renderTags(c.tags)}</div>
                  </td>
                  <td className="px-4 py-3 text-right font-medium text-slate-900 dark:text-white">{fmt(c.caTotal)}</td>
                  <td className="px-4 py-3 text-center text-slate-300 dark:text-slate-400">{c.nbCommandes}</td>
                  <td className="px-4 py-3 text-slate-300 dark:text-slate-400">{fmtDate(c.derniereVisite)}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-center gap-1">
                      <button onClick={(e) => { e.stopPropagation(); openEmailModal(c); }}
                        className="p-1.5 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/30 text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors" title="Envoyer un email">
                        <Mail className="w-4 h-4" />
                      </button>
                      <button onClick={(e) => { e.stopPropagation(); openEdit(c); }}
                        className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition-colors" title={t('clients.edit')}>
                        <Edit2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filtered.length === 0 && (
            <div className="text-center py-12 text-slate-400 dark:text-slate-500">
              <Users className="w-12 h-12 mx-auto mb-3 opacity-50" />
              <p>{t('clients.noClientFound')}</p>
            </div>
          )}
        </div>
      )}

      {/* ── Detail Modal ─────────────────────────────────────────────── */}
      <Modal isOpen={showDetail} onClose={() => setShowDetail(false)}
        title={selectedClient ? `${selectedClient.prenom} ${selectedClient.nom}` : 'Client'}
        className="max-w-3xl">
        {selectedClient && (
          <div>
            {/* Header */}
            <div className="flex items-start gap-4 mb-6">
              {renderAvatar(selectedClient, 'w-16 h-16 text-xl')}
              <div className="flex-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className={`px-2 py-0.5 rounded text-xs font-medium ${(TYPE_COLORS[selectedClient.type] || TYPE_COLORS['Particulier']).bg} ${(TYPE_COLORS[selectedClient.type] || TYPE_COLORS['Particulier']).text}`}>{selectedClient.type}</span>
                  {renderTags(selectedClient.tags)}
                </div>
                {selectedClient.entreprise && (
                  <div className="flex items-center gap-1.5 text-sm text-slate-400 dark:text-slate-400 mt-1">
                    <Building2 className="w-4 h-4" /> {selectedClient.entreprise}
                  </div>
                )}
                <div className="flex items-center gap-4 mt-2 text-sm text-slate-400 dark:text-slate-400">
                  <span className="flex items-center gap-1"><Mail className="w-3.5 h-3.5" /> {selectedClient.email}</span>
                  <span className="flex items-center gap-1"><Phone className="w-3.5 h-3.5" /> {selectedClient.telephone}</span>
                </div>
                <div className="flex items-center gap-3 mt-3">
                  <button onClick={() => openEmailModal(selectedClient)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-blue-600 text-white hover:bg-blue-700 transition-colors">
                    <Mail className="w-3.5 h-3.5" /> Email
                  </button>
                  <a href={`tel:${selectedClient.telephone}`}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-green-600 text-white hover:bg-green-700 transition-colors">
                    <Phone className="w-3.5 h-3.5" /> {t('clients.call')}
                  </a>
                  <button onClick={() => { setShowDetail(false); openEdit(selectedClient); }}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-100 dark:bg-slate-700 text-slate-400 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors">
                    <Edit2 className="w-3.5 h-3.5" /> {t('clients.edit')}
                  </button>
                </div>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-slate-900 dark:text-white">{fmt(selectedClient.caTotal)}</div>
                <div className="text-xs text-slate-400">{t('clients.caTotal')}</div>
              </div>
            </div>

            {/* Tabs */}
            <div className="flex gap-1 border-b border-slate-200 dark:border-slate-700 mb-4 overflow-x-auto">
              {([
                { id: 'infos' as TabId, label: t('clients.infos') },
                { id: 'preferences' as TabId, label: t('clients.preferences') },
                { id: 'historique' as TabId, label: t('clients.history') },
                { id: 'documents' as TabId, label: t('clients.documents') },
                { id: 'rgpd' as TabId, label: t('clients.rgpd') },
              ]).map(tab => (
                <button key={tab.id} onClick={() => setDetailTab(tab.id)}
                  className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
                    detailTab === tab.id
                      ? 'border-blue-600 text-blue-600 dark:text-blue-400 dark:border-blue-400'
                      : 'border-transparent text-slate-400 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
                  }`}>
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Tab: Infos */}
            {detailTab === 'infos' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <div><label className="text-xs font-medium text-slate-400 dark:text-slate-500">{t('clients.fullName')}</label><p className="text-sm text-slate-900 dark:text-white">{selectedClient.prenom} {selectedClient.nom}</p></div>
                  <div><label className="text-xs font-medium text-slate-400 dark:text-slate-500">{t('clients.companyLabel')}</label><p className="text-sm text-slate-900 dark:text-white">{selectedClient.entreprise || '—'}</p></div>
                  <div><label className="text-xs font-medium text-slate-400 dark:text-slate-500">{t('clients.siret')}</label><p className="text-sm text-slate-900 dark:text-white">{selectedClient.siret || '—'}</p></div>
                  <div><label className="text-xs font-medium text-slate-400 dark:text-slate-500">{t('clients.address')}</label><p className="text-sm text-slate-900 dark:text-white">{selectedClient.adresse || '—'}</p></div>
                </div>
                <div className="space-y-3">
                  <div><label className="text-xs font-medium text-slate-400 dark:text-slate-500">{t('clients.email')}</label><p className="text-sm text-slate-900 dark:text-white">{selectedClient.email}</p></div>
                  <div><label className="text-xs font-medium text-slate-400 dark:text-slate-500">{t('clients.phone')}</label><p className="text-sm text-slate-900 dark:text-white">{selectedClient.telephone}</p></div>
                  <div><label className="text-xs font-medium text-slate-400 dark:text-slate-500">{t('clients.clientSince')}</label><p className="text-sm text-slate-900 dark:text-white">{fmtDate(selectedClient.dateCreation)}</p></div>
                  <div><label className="text-xs font-medium text-slate-400 dark:text-slate-500">{t('clients.ordersEvents')}</label><p className="text-sm text-slate-900 dark:text-white">{selectedClient.nbCommandes}</p></div>
                </div>
                {selectedClient.notes && (
                  <div className="col-span-full">
                    <label className="text-xs font-medium text-slate-400 dark:text-slate-500">{t('clients.notes')}</label>
                    <p className="text-sm text-slate-400 dark:text-slate-300 bg-slate-50 dark:bg-slate-900 rounded-lg p-3 mt-1">{selectedClient.notes}</p>
                  </div>
                )}
              </div>
            )}

            {/* Tab: Préférences alimentaires */}
            {detailTab === 'preferences' && (
              <div className="space-y-6">
                <div>
                  <h4 className="text-sm font-semibold text-slate-400 dark:text-slate-300 mb-3 flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 text-amber-500" /> {t('clients.allergens')}
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {EU_ALLERGENES.map(a => {
                      const active = selectedClient.allergenes.includes(a.id);
                      return (
                        <span key={a.id} className={`px-3 py-1 rounded-full text-xs font-medium border ${
                          active
                            ? 'bg-red-100 dark:bg-red-900/40 text-red-700 dark:text-red-300 border-red-300 dark:border-red-700'
                            : 'bg-slate-50 dark:bg-slate-900 text-slate-400 dark:text-slate-600 border-slate-200 dark:border-slate-700'
                        }`}>
                          {active && '⚠ '}{a.nom}
                        </span>
                      );
                    })}
                  </div>
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-slate-400 dark:text-slate-300 mb-3 flex items-center gap-2">
                    <Heart className="w-4 h-4 text-green-500" /> {t('clients.diet')}
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {REGIMES.map(r => {
                      const active = selectedClient.regime.includes(r);
                      return (
                        <span key={r} className={`px-3 py-1 rounded-full text-xs font-medium border ${
                          active
                            ? 'bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-300 border-green-300 dark:border-green-700'
                            : 'bg-slate-50 dark:bg-slate-900 text-slate-400 dark:text-slate-600 border-slate-200 dark:border-slate-700'
                        }`}>
                          {r}
                        </span>
                      );
                    })}
                  </div>
                </div>
                {selectedClient.platsFavoris.length > 0 && (
                  <div>
                    <h4 className="text-sm font-semibold text-slate-400 dark:text-slate-300 mb-3 flex items-center gap-2">
                      <Star className="w-4 h-4 text-amber-500" /> {t('clients.favoriteDishes')}
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedClient.platsFavoris.map(p => (
                        <span key={p} className="px-3 py-1 rounded-full text-xs font-medium bg-amber-50 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-700">{p}</span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Tab: Historique */}
            {detailTab === 'historique' && (
              <div className="space-y-3">
                {selectedClient.historique.length === 0 ? (
                  <p className="text-sm text-slate-400 dark:text-slate-500 text-center py-8">{t('clients.noInteraction')}</p>
                ) : (
                  <div className="relative pl-6 border-l-2 border-slate-200 dark:border-slate-700 space-y-4">
                    {selectedClient.historique.map(h => (
                      <div key={h.id} className="relative">
                        <div className="absolute -left-[29px] w-4 h-4 rounded-full bg-white dark:bg-slate-800 border-2 border-slate-300 dark:border-slate-600 flex items-center justify-center text-[8px]">
                          {interactionIcons[h.type]?.icon}
                        </div>
                        <div className="bg-slate-50 dark:bg-slate-900 rounded-lg p-3">
                          <div className="flex items-center justify-between">
                            <span className={`px-2 py-0.5 rounded text-xs font-medium ${interactionIcons[h.type]?.color}`}>
                              {h.type.charAt(0).toUpperCase() + h.type.slice(1)}
                            </span>
                            <span className="text-xs text-slate-400 dark:text-slate-500">{fmtDate(h.date)}</span>
                          </div>
                          <p className="text-sm text-slate-400 dark:text-slate-300 mt-1">{h.description}</p>
                          {h.montant && <p className="text-sm font-semibold text-slate-900 dark:text-white mt-1">{fmt(h.montant)}</p>}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Tab: Documents */}
            {detailTab === 'documents' && (
              <div className="space-y-3">
                {selectedClient.documents.length === 0 ? (
                  <p className="text-sm text-slate-400 dark:text-slate-500 text-center py-8">{t('clients.noDocument')}</p>
                ) : (
                  selectedClient.documents.map(d => (
                    <div key={d.id} className="flex items-center justify-between bg-slate-50 dark:bg-slate-900 rounded-lg p-3">
                      <div className="flex items-center gap-3">
                        <FileText className={`w-5 h-5 ${d.type === 'facture' ? 'text-green-500' : 'text-blue-500'}`} />
                        <div>
                          <div className="text-sm font-medium text-slate-900 dark:text-white">{d.numero}</div>
                          <div className="text-xs text-slate-400 dark:text-slate-500">{d.type === 'facture' ? 'Facture' : 'Devis'} &middot; {fmtDate(d.date)}</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-semibold text-slate-900 dark:text-white">{fmt(d.montant)}</div>
                        <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                          d.statut === 'Payée' ? 'bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-300' :
                          d.statut === 'Accepté' ? 'bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300' :
                          d.statut === 'Refusé' ? 'bg-red-100 dark:bg-red-900/40 text-red-700 dark:text-red-300' :
                          'bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-300'
                        }`}>{d.statut}</span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}

            {/* Tab: RGPD */}
            {detailTab === 'rgpd' && (
              <div className="space-y-4">
                <div className="bg-slate-50 dark:bg-slate-900 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Shield className="w-5 h-5 text-blue-500" />
                    <h4 className="text-sm font-semibold text-slate-400 dark:text-slate-300">{t('clients.dataProtection')}</h4>
                  </div>
                  <div className="space-y-2 text-sm">
                    <p className="text-slate-300 dark:text-slate-400">
                      Date de consentement RGPD : <strong className="text-slate-900 dark:text-white">{fmtDate(selectedClient.consentementRGPD)}</strong>
                    </p>
                    <p className="text-slate-300 dark:text-slate-400">
                      Données collectées : nom, coordonnées, préférences alimentaires, historique commercial
                    </p>
                  </div>
                </div>
                <div className="flex flex-wrap gap-3">
                  <button onClick={() => exportClientData(selectedClient)}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900/50 text-sm font-medium transition-colors">
                    <Download className="w-4 h-4" /> {t('clients.exportData')}
                  </button>
                  <button onClick={() => handleRGPDForget(selectedClient)}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/50 text-sm font-medium transition-colors">
                    <Trash2 className="w-4 h-4" /> {t('clients.rightToForget')}
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </Modal>

      {/* ── Add/Edit Modal ───────────────────────────────────────────── */}
      <Modal isOpen={showForm} onClose={() => setShowForm(false)}
        title={editingClient ? t('clients.editClient') : t('clients.newClient')}
        className="max-w-3xl">
        <div className="space-y-5">
          {/* Duplicate warning */}
          {duplicateWarning && (
            <div className="flex items-center gap-2 px-4 py-3 bg-amber-50 dark:bg-amber-900/30 border border-amber-200 dark:border-amber-700 rounded-lg text-sm text-amber-700 dark:text-amber-300">
              <AlertTriangle className="w-4 h-4 flex-shrink-0" />
              {duplicateWarning}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-400 dark:text-slate-400 mb-1">{t('clients.firstName')}</label>
              <input type="text" value={form.prenom} onChange={e => setForm({ ...form, prenom: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-900 text-sm text-slate-900 dark:text-white" />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-400 dark:text-slate-400 mb-1">{t('clients.lastName')}</label>
              <input type="text" value={form.nom}
                onChange={e => { setForm({ ...form, nom: e.target.value }); checkDuplicate(e.target.value, form.email); }}
                className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-900 text-sm text-slate-900 dark:text-white" />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-400 dark:text-slate-400 mb-1">{t('clients.emailLabel')}</label>
              <input type="email" value={form.email}
                onChange={e => { setForm({ ...form, email: e.target.value }); checkDuplicate(form.nom, e.target.value); }}
                className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-900 text-sm text-slate-900 dark:text-white" />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-400 dark:text-slate-400 mb-1">{t('clients.phoneLabel')}</label>
              <input type="tel" value={form.telephone} onChange={e => setForm({ ...form, telephone: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-900 text-sm text-slate-900 dark:text-white" />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-400 dark:text-slate-400 mb-1">{t('clients.companyField')}</label>
              <input type="text" value={form.entreprise} onChange={e => setForm({ ...form, entreprise: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-900 text-sm text-slate-900 dark:text-white" />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-400 dark:text-slate-400 mb-1">{t('clients.siretField')}</label>
              <input type="text" value={form.siret} onChange={e => setForm({ ...form, siret: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-900 text-sm text-slate-900 dark:text-white" />
            </div>
            <div className="col-span-full">
              <label className="block text-xs font-medium text-slate-400 dark:text-slate-400 mb-1">{t('clients.addressField')}</label>
              <input type="text" value={form.adresse} onChange={e => setForm({ ...form, adresse: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-900 text-sm text-slate-900 dark:text-white" />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-400 dark:text-slate-400 mb-1">{t('clients.type')}</label>
              <select value={form.type} onChange={e => setForm({ ...form, type: e.target.value as ClientType })}
                className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-900 text-sm text-slate-900 dark:text-white">
                <option value="Particulier">Particulier</option>
                <option value="Entreprise">Entreprise</option>
                <option value="Association">Association</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-400 dark:text-slate-400 mb-1">{t('clients.tags')}</label>
              <div className="flex gap-2 flex-wrap">
                {(['VIP', 'Régulier', 'Nouveau'] as ClientTag[]).map(tag => (
                  <button key={tag} type="button"
                    onClick={() => {
                      setForm(f => ({
                        ...f,
                        tags: f.tags.includes(tag) ? f.tags.filter(t => t !== tag) : [...f.tags, tag],
                      }));
                    }}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
                      form.tags.includes(tag)
                        ? `${(TAG_COLORS[tag] || TAG_COLORS['VIP']).bg} ${(TAG_COLORS[tag] || TAG_COLORS['VIP']).text} ${(TAG_COLORS[tag] || TAG_COLORS['VIP']).border}`
                        : 'bg-slate-50 dark:bg-slate-900 text-slate-400 border-slate-200 dark:border-slate-700'
                    }`}>
                    {tag}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Allergènes */}
          <div>
            <label className="block text-xs font-medium text-slate-400 dark:text-slate-400 mb-2">{t('clients.allergensEU')}</label>
            <div className="flex flex-wrap gap-2">
              {EU_ALLERGENES.map(a => (
                <label key={a.id} className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border cursor-pointer transition-colors ${
                  form.allergenes.includes(a.id)
                    ? 'bg-red-100 dark:bg-red-900/40 text-red-700 dark:text-red-300 border-red-300 dark:border-red-700'
                    : 'bg-slate-50 dark:bg-slate-900 text-slate-400 dark:text-slate-400 border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}>
                  <input type="checkbox" className="sr-only"
                    checked={form.allergenes.includes(a.id)}
                    onChange={() => {
                      setForm(f => ({
                        ...f,
                        allergenes: f.allergenes.includes(a.id) ? f.allergenes.filter(x => x !== a.id) : [...f.allergenes, a.id],
                      }));
                    }} />
                  {a.nom}
                </label>
              ))}
            </div>
          </div>

          {/* Régime */}
          <div>
            <label className="block text-xs font-medium text-slate-400 dark:text-slate-400 mb-2">{t('clients.dietLabel')}</label>
            <div className="flex flex-wrap gap-2">
              {REGIMES.map(r => (
                <label key={r} className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border cursor-pointer transition-colors ${
                  form.regime.includes(r)
                    ? 'bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-300 border-green-300 dark:border-green-700'
                    : 'bg-slate-50 dark:bg-slate-900 text-slate-400 dark:text-slate-400 border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}>
                  <input type="checkbox" className="sr-only"
                    checked={form.regime.includes(r)}
                    onChange={() => {
                      setForm(f => ({
                        ...f,
                        regime: f.regime.includes(r) ? f.regime.filter(x => x !== r) : [...f.regime, r],
                      }));
                    }} />
                  {r}
                </label>
              ))}
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-xs font-medium text-slate-400 dark:text-slate-400 mb-1">{t('clients.notes')}</label>
            <textarea value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })}
              rows={3}
              className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-900 text-sm text-slate-900 dark:text-white resize-none" />
          </div>

          {/* Actions */}
          <div className="flex items-center justify-between pt-4 border-t border-slate-200 dark:border-slate-700">
            <button onClick={handleCSVImport}
              className="flex items-center gap-2 text-sm text-slate-400 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition-colors">
              <Upload className="w-4 h-4" /> Import CSV
            </button>
            <div className="flex gap-3">
              <button onClick={() => setShowForm(false)}
                className="px-4 py-2 rounded-lg text-sm font-medium text-slate-300 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors">
                {t('clients.cancel')}
              </button>
              <button onClick={handleSave}
                className="px-6 py-2 rounded-lg text-sm font-medium bg-blue-600 hover:bg-blue-700 text-white transition-colors">
                {editingClient ? t('clients.save') : t('clients.add')}
              </button>
            </div>
          </div>
        </div>
      </Modal>

      {/* ── Email Modal ──────────────────────────────────────────────── */}
      <Modal isOpen={showEmail} onClose={() => { setShowEmail(false); setEmailSubject(''); setEmailMessage(''); setSelectedTemplate(''); }}
        title={selectedClient ? t('clients.sendEmailTo').replace('{name}', `${selectedClient.prenom} ${selectedClient.nom}`) : 'Email'}>
        {selectedClient && (
          <div className="space-y-4">
            {/* Template shortcuts */}
            <div>
              <label className="block text-xs font-medium text-slate-400 dark:text-slate-400 mb-2">{t('clients.quickTemplates')}</label>
              <div className="flex flex-wrap gap-2">
                {EMAIL_TEMPLATES.map(t => (
                  <button key={t.id}
                    onClick={() => applyTemplate(t)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${selectedTemplate === t.id ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300' : 'border-slate-200 dark:border-slate-700 text-slate-300 dark:text-slate-400 hover:border-blue-300 dark:hover:border-blue-600'}`}>
                    {t.label}
                  </button>
                ))}
              </div>
            </div>
            {/* Subject */}
            <div>
              <label className="block text-xs font-medium text-slate-400 dark:text-slate-400 mb-1">{t('clients.subject')}</label>
              <input
                type="text"
                value={emailSubject}
                onChange={(e) => setEmailSubject(e.target.value)}
                placeholder={t('clients.subjectPlaceholder')}
                className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              />
            </div>
            {/* Message body */}
            <div>
              <label className="block text-xs font-medium text-slate-400 dark:text-slate-400 mb-1">{t('clients.message')}</label>
              <textarea
                value={emailMessage}
                onChange={(e) => setEmailMessage(e.target.value)}
                placeholder={t('clients.messagePlaceholder')}
                rows={6}
                className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none resize-vertical"
              />
            </div>
            {/* Send button */}
            <div className="flex justify-end gap-3 pt-2">
              <button
                onClick={() => { setShowEmail(false); setEmailSubject(''); setEmailMessage(''); setSelectedTemplate(''); }}
                className="px-4 py-2 rounded-lg text-sm font-medium text-slate-300 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                {t('clients.cancel')}
              </button>
              <button
                onClick={handleSendClientEmail}
                disabled={sendingClientEmail || !emailSubject.trim() || !emailMessage.trim()}
                className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold bg-blue-600 hover:bg-blue-500 text-white transition-colors disabled:opacity-50"
              >
                {sendingClientEmail ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                {t('clients.send')}
              </button>
            </div>
          </div>
        )}
      </Modal>

      {/* ── Stats Modal ──────────────────────────────────────────────── */}
      <Modal isOpen={showStats} onClose={() => setShowStats(false)} title={t('clients.statsTitle')} className="max-w-3xl">
        <div className="space-y-8">
          {/* KPIs */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-slate-50 dark:bg-slate-900 rounded-xl p-4 text-center">
              <div className="text-2xl font-bold text-slate-900 dark:text-white">{clients.length}</div>
              <div className="text-xs text-slate-400 dark:text-slate-500 mt-1">{t('clients.totalClients')}</div>
            </div>
            <div className="bg-slate-50 dark:bg-slate-900 rounded-xl p-4 text-center">
              <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">{fmt(stats.totalCA)}</div>
              <div className="text-xs text-slate-400 dark:text-slate-500 mt-1">{t('clients.caTotal')}</div>
            </div>
            <div className="bg-slate-50 dark:bg-slate-900 rounded-xl p-4 text-center">
              <div className="text-2xl font-bold text-green-600 dark:text-green-400">{fmt(stats.avgCA)}</div>
              <div className="text-xs text-slate-400 dark:text-slate-500 mt-1">{t('clients.avgCA')}</div>
            </div>
            <div className="bg-slate-50 dark:bg-slate-900 rounded-xl p-4 text-center">
              <div className="text-2xl font-bold text-amber-600 dark:text-amber-400">{stats.byTag.VIP}</div>
              <div className="text-xs text-slate-400 dark:text-slate-500 mt-1">{t('clients.vipClients')}</div>
            </div>
          </div>

          {/* Top 10 by CA */}
          <div>
            <h4 className="text-sm font-semibold text-slate-400 dark:text-slate-300 mb-3 flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-blue-500" /> {t('clients.top10ByCA')}
            </h4>
            <BarChartSimple data={stats.top10.map(c => ({ label: `${c.prenom} ${c.nom}`, value: c.caTotal }))} />
          </div>

          {/* Type distribution */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h4 className="text-sm font-semibold text-slate-400 dark:text-slate-300 mb-3 flex items-center gap-2">
                <PieChart className="w-4 h-4 text-purple-500" /> {t('clients.distributionByType')}
              </h4>
              <PieChartSimple data={[
                { label: 'Particulier', value: stats.byType.Particulier, color: '#64748b' },
                { label: 'Entreprise', value: stats.byType.Entreprise, color: '#6366f1' },
                { label: 'Association', value: stats.byType.Association, color: '#f43f5e' },
              ]} />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-slate-400 dark:text-slate-300 mb-3 flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-green-500" /> {t('clients.distributionByTag')}
              </h4>
              <PieChartSimple data={[
                { label: 'VIP', value: stats.byTag.VIP, color: '#f59e0b' },
                { label: 'Régulier', value: stats.byTag.Régulier, color: '#3b82f6' },
                { label: 'Nouveau', value: stats.byTag.Nouveau, color: '#22c55e' },
              ]} />
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
}
