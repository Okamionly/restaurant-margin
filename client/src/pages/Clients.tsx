import { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import {
  Users, Search, Plus, Edit2, Trash2, Mail, Phone, Building2, Star,
  Tag, Filter, LayoutGrid, List, ChevronDown, ChevronUp, Eye, FileText,
  Download, Shield, Clock, BarChart3, PieChart, TrendingUp, X, AlertTriangle,
  Upload, Copy, ExternalLink, Heart, UserPlus, Send, Loader2,
  Crown, Repeat, Sparkles, UserMinus, MessageSquare, Megaphone, Zap,
  Cake, Award, Calendar, StickyNote, ChevronRight, ArrowUpRight,
  Gift, Target, Activity, ChevronsRight,
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
type ClientTag = 'VIP' | 'Régulier' | 'Nouveau' | 'Inactif' | 'Allergie' | 'Preference' | 'Fidèle' | 'Premium' | 'Anniversaire' | 'Professionnel';
type ViewMode = 'cards' | 'table';
type SortField = 'nom' | 'caTotal' | 'derniereVisite';
type TabId = 'infos' | 'preferences' | 'historique' | 'documents' | 'rgpd';
type SegmentId = 'tous' | 'vip' | 'reguliers' | 'nouveaux' | 'inactifs';
type LoyaltyTier = 'Bronze' | 'Silver' | 'Gold';

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
  dateNaissance: string;
  allergenes: string[];
  regime: string[];
  platsFavoris: string[];
  historique: Interaction[];
  documents: Document[];
  consentementRGPD: string;
}

interface SegmentData {
  count: number;
  totalRevenue: number;
  avgTicket: number;
  clientIds: string[];
}

interface SegmentsResponse {
  vip: SegmentData;
  reguliers: SegmentData;
  nouveaux: SegmentData;
  inactifs: SegmentData;
  total: number;
}

// ── Constants ──────────────────────────────────────────────────────────

const EU_ALLERGENES: Allergene[] = [
  { id: 'gluten', nom: 'Gluten' },
  { id: 'crustaces', nom: 'Crustaces' },
  { id: 'oeufs', nom: 'Oeufs' },
  { id: 'poisson', nom: 'Poisson' },
  { id: 'arachides', nom: 'Arachides' },
  { id: 'soja', nom: 'Soja' },
  { id: 'lait', nom: 'Lait' },
  { id: 'fruits_coques', nom: 'Fruits a coques' },
  { id: 'celeri', nom: 'Celeri' },
  { id: 'moutarde', nom: 'Moutarde' },
  { id: 'sesame', nom: 'Sesame' },
  { id: 'sulfites', nom: 'Sulfites' },
  { id: 'lupin', nom: 'Lupin' },
  { id: 'mollusques', nom: 'Mollusques' },
];

const REGIMES = ['Vegetarien', 'Vegan', 'Halal', 'Casher', 'Sans gluten'];

const BASIC_TAG_COLORS: Record<string, { bg: string; text: string; border: string }> = {
  VIP: { bg: 'bg-amber-100 dark:bg-amber-900/40', text: 'text-amber-700 dark:text-amber-300', border: 'border-amber-300 dark:border-amber-700' },
  'Régulier': { bg: 'bg-[#F3F4F6] dark:bg-[#0A0A0A]/40', text: 'text-[#111111] dark:text-[#737373]', border: 'border-[#D1D5DB] dark:border-[#1A1A1A]' },
  Nouveau: { bg: 'bg-green-100 dark:bg-green-900/40', text: 'text-green-700 dark:text-green-300', border: 'border-green-300 dark:border-green-700' },
  Inactif: { bg: 'bg-red-100 dark:bg-red-900/40', text: 'text-red-700 dark:text-red-300', border: 'border-red-300 dark:border-red-700' },
  Allergie: { bg: 'bg-orange-100 dark:bg-orange-900/40', text: 'text-orange-700 dark:text-orange-300', border: 'border-orange-300 dark:border-orange-700' },
  Preference: { bg: 'bg-purple-100 dark:bg-purple-900/40', text: 'text-purple-700 dark:text-purple-300', border: 'border-purple-300 dark:border-purple-700' },
  'Fidèle': { bg: 'bg-blue-100 dark:bg-blue-900/40', text: 'text-blue-700 dark:text-blue-300', border: 'border-blue-300 dark:border-blue-700' },
  Premium: { bg: 'bg-yellow-100 dark:bg-yellow-900/40', text: 'text-yellow-700 dark:text-yellow-300', border: 'border-yellow-300 dark:border-yellow-700' },
  Anniversaire: { bg: 'bg-pink-100 dark:bg-pink-900/40', text: 'text-pink-700 dark:text-pink-300', border: 'border-pink-300 dark:border-pink-700' },
  Professionnel: { bg: 'bg-indigo-100 dark:bg-indigo-900/40', text: 'text-indigo-700 dark:text-indigo-300', border: 'border-indigo-300 dark:border-indigo-700' },
};

const TYPE_COLORS: Record<ClientType, { bg: string; text: string }> = {
  Particulier: { bg: 'bg-[#F3F4F6] dark:bg-[#171717]', text: 'text-[#9CA3AF] dark:text-[#737373]' },
  Entreprise: { bg: 'bg-indigo-100 dark:bg-indigo-900/40', text: 'text-indigo-700 dark:text-indigo-300' },
  Association: { bg: 'bg-rose-100 dark:bg-rose-900/40', text: 'text-rose-700 dark:text-rose-300' },
};

const EMAIL_TEMPLATES = [
  { id: 'confirmation', label: 'Confirmation de reservation', subject: 'Confirmation de votre reservation', body: 'Bonjour,\n\nNous avons le plaisir de confirmer votre reservation pour le [DATE].\n\nCordialement,' },
  { id: 'rappel', label: 'Rappel evenement J-3', subject: 'Rappel : votre evenement dans 3 jours', body: 'Bonjour,\n\nNous vous rappelons que votre evenement est prevu dans 3 jours.\n\nCordialement,' },
  { id: 'remerciement', label: 'Remerciement post-evenement', subject: 'Merci pour votre confiance !', body: 'Bonjour,\n\nNous tenions a vous remercier pour votre confiance lors de votre dernier evenement.\n\nCordialement,' },
  { id: 'relance', label: 'Relance devis en attente', subject: 'Votre devis en attente', body: 'Bonjour,\n\nNous revenons vers vous concernant le devis que nous vous avons transmis.\n\nCordialement,' },
  { id: 'promo', label: 'Offre speciale / promotion', subject: 'Offre speciale pour vous !', body: 'Bonjour,\n\nNous avons le plaisir de vous faire parvenir une offre exclusive.\n\nCordialement,' },
  { id: 'anniversaire', label: 'Anniversaire client', subject: 'Joyeux anniversaire !', body: 'Cher [prenom],\n\nToute notre equipe vous souhaite un tres joyeux anniversaire !\n\nPour celebrer ce jour special, nous vous offrons -15% sur votre prochaine visite.\n\nCordialement,' },
];

const CAMPAIGN_TEMPLATES: Record<SegmentId, { subject: string; body: string }> = {
  tous: { subject: 'Nouvelles de votre restaurant', body: 'Cher [prenom] [nom],\n\nNous avons une nouvelle passionnante a partager avec vous !\n\nCordialement,\nVotre restaurant' },
  vip: { subject: 'Offre exclusive pour nos clients VIP', body: 'Cher [prenom] [nom],\n\nEn tant que client VIP, nous avons le plaisir de vous offrir une experience exclusive.\n\nNous vous invitons a une soiree degustation privee.\n\nCordialement,\nVotre restaurant' },
  reguliers: { subject: 'Merci pour votre fidelite !', body: 'Cher [prenom] [nom],\n\nMerci de nous faire confiance regulierement. Pour vous remercier, beneficiez de -10% sur votre prochaine visite.\n\nCordialement,\nVotre restaurant' },
  nouveaux: { subject: 'Bienvenue parmi nous !', body: 'Cher [prenom] [nom],\n\nNous sommes ravis de vous compter parmi nos nouveaux clients !\n\nPour celebrer votre arrivee, voici un code promo : BIENVENUE10\n\nCordialement,\nVotre restaurant' },
  inactifs: { subject: 'Vous nous manquez !', body: 'Cher [prenom] [nom],\n\nCela fait un moment que nous ne vous avons pas vu et vous nous manquez !\n\nRevenez nous voir, une surprise vous attend.\n\nCordialement,\nVotre restaurant' },
};

// ── Local Storage Persistence ───────────

const CLIENTS_STORAGE_KEY = 'restaumargin_clients';

function loadClientsFromStorage(): Client[] {
  try {
    const raw = localStorage.getItem(CLIENTS_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      // Migrate old clients that don't have dateNaissance
      return parsed.map((c: Client) => ({
        ...c,
        dateNaissance: c.dateNaissance || '',
      }));
    }
  } catch { /* corrupt data */ }
  return [];
}

function saveClientsToStorage(clients: Client[]) {
  try { localStorage.setItem(CLIENTS_STORAGE_KEY, JSON.stringify(clients)); } catch { /* quota */ }
}

function initClients(): Client[] {
  return loadClientsFromStorage();
}

// ── Helpers ─────────────────────────────────────────────────────────────

function fmt(n: number) {
  return n.toLocaleString('fr-FR', { style: 'currency', currency: 'EUR', minimumFractionDigits: 0, maximumFractionDigits: 0 });
}

function fmtDate(d: string) {
  if (!d) return '--';
  return new Date(d).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' });
}

function getInitials(nom: string, prenom: string) {
  return `${prenom?.[0] || ''}${nom?.[0] || ''}`.toUpperCase();
}

function getLoyaltyTier(caTotal: number): LoyaltyTier {
  if (caTotal >= 1000) return 'Gold';
  if (caTotal >= 500) return 'Silver';
  return 'Bronze';
}

function getLoyaltyColors(tier: LoyaltyTier) {
  switch (tier) {
    case 'Gold': return { bg: 'bg-amber-100 dark:bg-amber-900/30', text: 'text-amber-700 dark:text-amber-300', border: 'border-amber-300 dark:border-amber-700', icon: 'text-amber-500' };
    case 'Silver': return { bg: 'bg-[#F3F4F6] dark:bg-[#1A1A1A]', text: 'text-[#6B7280] dark:text-[#A3A3A3]', border: 'border-[#D1D5DB] dark:border-[#333]', icon: 'text-[#9CA3AF]' };
    case 'Bronze': return { bg: 'bg-orange-50 dark:bg-orange-900/20', text: 'text-orange-700 dark:text-orange-400', border: 'border-orange-200 dark:border-orange-800', icon: 'text-orange-500' };
  }
}

function getBirthdayDaysAway(dateNaissance: string): number | null {
  if (!dateNaissance) return null;
  const today = new Date();
  const bday = new Date(dateNaissance);
  const thisYearBday = new Date(today.getFullYear(), bday.getMonth(), bday.getDate());
  if (thisYearBday < today) {
    thisYearBday.setFullYear(today.getFullYear() + 1);
  }
  const diff = Math.ceil((thisYearBday.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
  return diff;
}

function isBirthdayThisWeek(dateNaissance: string): boolean {
  const days = getBirthdayDaysAway(dateNaissance);
  return days !== null && days >= 0 && days <= 7;
}

const interactionIcons: Record<string, { icon: string; color: string }> = {
  devis: { icon: 'D', color: 'bg-[#F3F4F6] dark:bg-[#0A0A0A]/40 text-[#111111] dark:text-[#737373]' },
  evenement: { icon: 'E', color: 'bg-purple-100 dark:bg-purple-900/40 text-purple-700 dark:text-purple-300' },
  facture: { icon: 'F', color: 'bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-300' },
  email: { icon: 'M', color: 'bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-300' },
  appel: { icon: 'A', color: 'bg-rose-100 dark:bg-rose-900/40 text-rose-700 dark:text-rose-300' },
};

// ── Component ──────────────────────────────────────────────────────────

export default function Clients() {
  const { showToast } = useToast();
  const { t } = useTranslation();

  // State
  const [clients, setClients] = useState<Client[]>(initClients);
  const csvFileRef = useRef<HTMLInputElement>(null);
  useEffect(() => { saveClientsToStorage(clients); }, [clients]);
  const [search, setSearch] = useState('');
  const [filterType, setFilterType] = useState<ClientType | ''>('');
  const [sortField, setSortField] = useState<SortField>('nom');
  const [sortAsc, setSortAsc] = useState(true);
  const [viewMode, setViewMode] = useState<ViewMode>('cards');
  const [activeSegment, setActiveSegment] = useState<SegmentId>('tous');

  // Segment data
  const [segments, setSegments] = useState<SegmentsResponse | null>(null);
  const [loadingSegments, setLoadingSegments] = useState(false);

  // Modals & sidebar
  const [showDetail, setShowDetail] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [showEmail, setShowEmail] = useState(false);
  const [showStats, setShowStats] = useState(false);
  const [showCampaign, setShowCampaign] = useState(false);
  const [sidebarClient, setSidebarClient] = useState<Client | null>(null);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [editingClient, setEditingClient] = useState<Client | null>(null);
  const [detailTab, setDetailTab] = useState<TabId>('infos');

  // Form state
  const emptyForm: Client = {
    id: '', nom: '', prenom: '', entreprise: '', siret: '', type: 'Particulier',
    tags: [], email: '', telephone: '', adresse: '', notes: '',
    caTotal: 0, nbCommandes: 0, derniereVisite: '', dateCreation: new Date().toISOString().split('T')[0],
    dateNaissance: '',
    allergenes: [], regime: [], platsFavoris: [], historique: [], documents: [],
    consentementRGPD: new Date().toISOString().split('T')[0],
  };
  const [form, setForm] = useState<Client>(emptyForm);
  const [duplicateWarning, setDuplicateWarning] = useState('');
  const [selectedTemplate, setSelectedTemplate] = useState('');
  const [emailSubject, setEmailSubject] = useState('');
  const [emailMessage, setEmailMessage] = useState('');
  const [sendingClientEmail, setSendingClientEmail] = useState(false);

  // Campaign state
  const [campaignSegment, setCampaignSegment] = useState<SegmentId>('tous');
  const [campaignSubject, setCampaignSubject] = useState('');
  const [campaignMessage, setCampaignMessage] = useState('');
  const [sendingCampaign, setSendingCampaign] = useState(false);

  // Tag editing
  const [editingTags, setEditingTags] = useState(false);
  const [clientNotes, setClientNotes] = useState('');

  // Sidebar notes for quick editing
  const [sidebarNotes, setSidebarNotes] = useState('');

  // ── Load segments ──────────────────────────────────────────────────────

  const loadSegments = useCallback(async () => {
    if (clients.length === 0) {
      setSegments(null);
      return;
    }
    setLoadingSegments(true);
    try {
      const res = await fetch(`${API}/api/clients/segments`, {
        method: 'POST',
        headers: authHeaders(),
        body: JSON.stringify({ clients }),
      });
      if (res.ok) {
        const data = await res.json();
        setSegments(data);
      }
    } catch { /* silent */ }
    setLoadingSegments(false);
  }, [clients]);

  useEffect(() => { loadSegments(); }, [loadSegments]);

  // ── Computed KPIs ─────────────────────────────────────────────────────

  const kpis = useMemo(() => {
    const now = new Date();
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

    const nouveauxCeMois = clients.filter(c => {
      if (!c.dateCreation) return false;
      return new Date(c.dateCreation) >= thirtyDaysAgo;
    }).length;

    const totalCA = clients.reduce((s, c) => s + c.caTotal, 0);
    const totalCommandes = clients.reduce((s, c) => s + c.nbCommandes, 0);
    const panierMoyen = totalCommandes > 0 ? totalCA / totalCommandes : 0;

    // Taux de fidelisation: clients with 2+ orders / total clients
    const clientsFideles = clients.filter(c => c.nbCommandes >= 2).length;
    const tauxFidelisation = clients.length > 0 ? Math.round((clientsFideles / clients.length) * 100) : 0;

    return { totalClients: clients.length, nouveauxCeMois, panierMoyen, tauxFidelisation, totalCA };
  }, [clients]);

  // ── Birthday alerts ─────────────────────────────────────────────────

  const birthdayClients = useMemo(() => {
    return clients.filter(c => isBirthdayThisWeek(c.dateNaissance)).map(c => ({
      ...c,
      daysAway: getBirthdayDaysAway(c.dateNaissance) || 0,
    })).sort((a, b) => a.daysAway - b.daysAway);
  }, [clients]);

  // ── Filtering & sorting ───────────────────────────────────────────────

  const filtered = useMemo(() => {
    let result = [...clients];

    // Segment filter (local fallback if server segments unavailable)
    if (activeSegment !== 'tous') {
      if (segments) {
        const segData = segments[activeSegment as keyof Omit<SegmentsResponse, 'total'>];
        if (segData && segData.clientIds) {
          const ids = new Set(segData.clientIds);
          result = result.filter(c => ids.has(c.id));
        }
      } else {
        // Local fallback segmentation
        const now = new Date();
        const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        const sixtyDaysAgo = new Date(now.getTime() - 60 * 24 * 60 * 60 * 1000);
        switch (activeSegment) {
          case 'vip': result = result.filter(c => c.caTotal > 500); break;
          case 'reguliers': result = result.filter(c => c.nbCommandes >= 3); break;
          case 'nouveaux': result = result.filter(c => c.dateCreation && new Date(c.dateCreation) >= thirtyDaysAgo); break;
          case 'inactifs': result = result.filter(c => c.derniereVisite && new Date(c.derniereVisite) < sixtyDaysAgo); break;
        }
      }
    }

    if (search) {
      const q = search.toLowerCase();
      result = result.filter(c =>
        c.nom.toLowerCase().includes(q) ||
        c.prenom.toLowerCase().includes(q) ||
        c.entreprise.toLowerCase().includes(q) ||
        c.email.toLowerCase().includes(q) ||
        c.telephone.includes(q)
      );
    }
    if (filterType) result = result.filter(c => c.type === filterType);

    result.sort((a, b) => {
      let cmp = 0;
      if (sortField === 'nom') cmp = a.nom.localeCompare(b.nom);
      else if (sortField === 'caTotal') cmp = a.caTotal - b.caTotal;
      else if (sortField === 'derniereVisite') cmp = (a.derniereVisite || '').localeCompare(b.derniereVisite || '');
      return sortAsc ? cmp : -cmp;
    });
    return result;
  }, [clients, search, filterType, sortField, sortAsc, activeSegment, segments]);

  // ── Local segment counts (for when server segments are unavailable) ──

  const localSegmentCounts = useMemo(() => {
    const now = new Date();
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    const sixtyDaysAgo = new Date(now.getTime() - 60 * 24 * 60 * 60 * 1000);
    return {
      vip: segments?.vip.count ?? clients.filter(c => c.caTotal > 500).length,
      reguliers: segments?.reguliers.count ?? clients.filter(c => c.nbCommandes >= 3).length,
      nouveaux: segments?.nouveaux.count ?? clients.filter(c => c.dateCreation && new Date(c.dateCreation) >= thirtyDaysAgo).length,
      inactifs: segments?.inactifs.count ?? clients.filter(c => c.derniereVisite && new Date(c.derniereVisite) < sixtyDaysAgo).length,
    };
  }, [clients, segments]);

  // ── Actions ───────────────────────────────────────────────────────────

  function openSidebar(c: Client) {
    setSidebarClient(c);
    setSidebarNotes(c.notes || '');
  }

  function closeSidebar() {
    setSidebarClient(null);
    setSidebarNotes('');
  }

  function openDetail(c: Client) {
    setSelectedClient(c);
    setDetailTab('infos');
    setClientNotes(c.notes || '');
    setEditingTags(false);
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
      setDuplicateWarning(`Doublon potentiel : ${existing.prenom} ${existing.nom} (${existing.email})`);
    } else {
      setDuplicateWarning('');
    }
  }

  function handleSave() {
    if (!form.nom || !form.email) {
      showToast(t('clients.nameAndEmailRequired') || 'Nom et email requis', 'error');
      return;
    }
    if (editingClient) {
      setClients(prev => prev.map(c => c.id === form.id ? form : c));
      // Update sidebar if open
      if (sidebarClient && sidebarClient.id === form.id) {
        setSidebarClient(form);
        setSidebarNotes(form.notes || '');
      }
      showToast(t('clients.clientUpdated') || 'Client mis a jour', 'success');
    } else {
      setClients(prev => [...prev, form]);
      showToast(t('clients.newClientAdded') || 'Nouveau client ajoute', 'success');
    }
    setShowForm(false);
  }

  function handleDelete(id: string) {
    setClients(prev => prev.filter(c => c.id !== id));
    setShowDetail(false);
    if (sidebarClient && sidebarClient.id === id) closeSidebar();
    showToast(t('clients.clientDeleted') || 'Client supprime', 'success');
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
      showToast(t('clients.fillSubjectAndMessage') || 'Remplissez sujet et message', 'error');
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
      showToast(`Email envoye a ${selectedClient.prenom} ${selectedClient.nom}`, 'success');
      setShowEmail(false);
      setEmailSubject('');
      setEmailMessage('');
      setSelectedTemplate('');
    } catch {
      showToast('Erreur envoi email', 'error');
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
    showToast(t('clients.dataExported') || 'Donnees exportees', 'success');
  }

  function handleRGPDForget(c: Client) {
    setClients(prev => prev.filter(cl => cl.id !== c.id));
    setShowDetail(false);
    if (sidebarClient && sidebarClient.id === c.id) closeSidebar();
    showToast(`Donnees de ${c.prenom} ${c.nom} supprimees (RGPD)`, 'success');
  }

  function handleCSVImport() {
    csvFileRef.current?.click();
  }

  function handleCSVExport() {
    if (filtered.length === 0) {
      showToast('Aucun client a exporter', 'error');
      return;
    }
    const headers = ['Prenom', 'Nom', 'Email', 'Telephone', 'Entreprise', 'Type', 'CA Total', 'Nb Commandes', 'Derniere Visite', 'Date Naissance', 'Date Creation', 'Tags', 'Notes'];
    const rows = filtered.map(c => [
      c.prenom,
      c.nom,
      c.email,
      c.telephone,
      c.entreprise,
      c.type,
      c.caTotal.toString(),
      c.nbCommandes.toString(),
      c.derniereVisite,
      c.dateNaissance || '',
      c.dateCreation,
      c.tags.join('; '),
      c.notes.replace(/\n/g, ' '),
    ]);
    const csvContent = [headers.join(','), ...rows.map(r => r.map(v => `"${v.replace(/"/g, '""')}"`).join(','))].join('\n');
    const blob = new Blob(['\ufeff' + csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `clients_export_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    showToast(`${filtered.length} clients exportes en CSV`, 'success');
  }

  function toggleClientTag(clientId: string, tag: ClientTag) {
    setClients(prev => prev.map(c => {
      if (c.id !== clientId) return c;
      const has = c.tags.includes(tag);
      return { ...c, tags: has ? c.tags.filter(t => t !== tag) : [...c.tags, tag] };
    }));
    if (selectedClient && selectedClient.id === clientId) {
      setSelectedClient(prev => {
        if (!prev) return prev;
        const has = prev.tags.includes(tag);
        return { ...prev, tags: has ? prev.tags.filter(t => t !== tag) : [...prev.tags, tag] };
      });
    }
    if (sidebarClient && sidebarClient.id === clientId) {
      setSidebarClient(prev => {
        if (!prev) return prev;
        const has = prev.tags.includes(tag);
        return { ...prev, tags: has ? prev.tags.filter(t => t !== tag) : [...prev.tags, tag] };
      });
    }
  }

  function saveClientNotes(clientId: string, notes: string) {
    setClients(prev => prev.map(c => c.id === clientId ? { ...c, notes } : c));
    if (selectedClient && selectedClient.id === clientId) {
      setSelectedClient(prev => prev ? { ...prev, notes } : prev);
    }
    if (sidebarClient && sidebarClient.id === clientId) {
      setSidebarClient(prev => prev ? { ...prev, notes } : prev);
    }
    showToast('Notes sauvegardees', 'success');
  }

  function openWhatsApp(phone: string) {
    const cleaned = phone.replace(/\s+/g, '').replace(/^0/, '33');
    window.open(`https://wa.me/${cleaned}`, '_blank');
  }

  // ── Campaign ──────────────────────────────────────────────────────────

  function openCampaign(segment: SegmentId) {
    setCampaignSegment(segment);
    const template = CAMPAIGN_TEMPLATES[segment];
    setCampaignSubject(template.subject);
    setCampaignMessage(template.body);
    setShowCampaign(true);
  }

  async function handleSendCampaign() {
    const recipients = getSegmentClients(campaignSegment);
    if (recipients.length === 0) {
      showToast('Aucun destinataire dans ce segment', 'error');
      return;
    }
    if (!campaignSubject.trim() || !campaignMessage.trim()) {
      showToast('Sujet et message requis', 'error');
      return;
    }
    setSendingCampaign(true);
    try {
      const res = await fetch(`${API}/api/crm/campaign`, {
        method: 'POST',
        headers: authHeaders(),
        body: JSON.stringify({
          recipients: recipients.map(c => ({ email: c.email, nom: c.nom, prenom: c.prenom, entreprise: c.entreprise })),
          subject: campaignSubject,
          message: campaignMessage,
          segmentName: segmentLabels[campaignSegment],
        }),
      });
      if (!res.ok) throw new Error('Erreur');
      const data = await res.json();
      showToast(`Campagne envoyee : ${data.sent} envoyes, ${data.failed} echoues`, 'success');
      setShowCampaign(false);
    } catch {
      showToast('Erreur envoi campagne', 'error');
    } finally {
      setSendingCampaign(false);
    }
  }

  function getSegmentClients(segment: SegmentId): Client[] {
    if (segment === 'tous') return clients;
    if (!segments) return [];
    const segData = segments[segment as keyof Omit<SegmentsResponse, 'total'>];
    if (!segData) return [];
    const ids = new Set(segData.clientIds);
    return clients.filter(c => ids.has(c.id));
  }

  // ── Stats ─────────────────────────────────────────────────────────────

  const stats = useMemo(() => {
    const top10 = [...clients].sort((a, b) => b.caTotal - a.caTotal).slice(0, 10);
    const byType = { Particulier: 0, Entreprise: 0, Association: 0 };
    clients.forEach(c => { byType[c.type]++; });
    const totalCA = clients.reduce((s, c) => s + c.caTotal, 0);
    const avgCA = clients.length ? totalCA / clients.length : 0;
    return { top10, byType, totalCA, avgCA };
  }, [clients]);

  // ── Segment labels & icons ────────────────────────────────────────────

  const segmentLabels: Record<SegmentId, string> = {
    tous: 'Tous',
    vip: 'VIP',
    reguliers: 'Reguliers',
    nouveaux: 'Nouveaux',
    inactifs: 'Inactifs',
  };

  const segmentDescriptions: Record<SegmentId, string> = {
    tous: 'Tous les clients',
    vip: '>500 EUR depenses',
    reguliers: '3+ visites',
    nouveaux: '<30 jours',
    inactifs: '>60 jours sans visite',
  };

  const segmentIcons: Record<SegmentId, React.ReactNode> = {
    tous: <Users className="w-4 h-4" />,
    vip: <Crown className="w-4 h-4" />,
    reguliers: <Repeat className="w-4 h-4" />,
    nouveaux: <Sparkles className="w-4 h-4" />,
    inactifs: <UserMinus className="w-4 h-4" />,
  };

  const segmentColors: Record<SegmentId, string> = {
    tous: 'text-[#111111] dark:text-white',
    vip: 'text-amber-600 dark:text-amber-400',
    reguliers: 'text-blue-600 dark:text-blue-400',
    nouveaux: 'text-green-600 dark:text-green-400',
    inactifs: 'text-red-600 dark:text-red-400',
  };

  // ── Render helpers ────────────────────────────────────────────────────

  function renderTags(tags: ClientTag[]) {
    return tags.map(tg => {
      const colors = BASIC_TAG_COLORS[tg] || BASIC_TAG_COLORS['VIP'];
      return (
        <span key={tg} className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium border ${colors.bg} ${colors.text} ${colors.border}`}>
          {tg === 'VIP' && <Star className="w-3 h-3" />}
          {tg}
        </span>
      );
    });
  }

  function renderAvatar(c: Client, size = 'w-10 h-10 text-sm') {
    const colors = c.tags.includes('VIP')
      ? 'from-amber-500 to-amber-700'
      : c.type === 'Entreprise'
        ? 'from-indigo-500 to-indigo-700'
        : 'from-[#111111] to-[#333]';
    return (
      <div className={`${size} rounded-full bg-gradient-to-br ${colors} flex items-center justify-center text-white font-bold flex-shrink-0 relative`}>
        {getInitials(c.nom, c.prenom)}
        {isBirthdayThisWeek(c.dateNaissance) && (
          <div className="absolute -top-1 -right-1 w-5 h-5 bg-pink-500 rounded-full flex items-center justify-center">
            <Cake className="w-3 h-3 text-white" />
          </div>
        )}
      </div>
    );
  }

  function renderLoyaltyBadge(c: Client) {
    const tier = getLoyaltyTier(c.caTotal);
    const colors = getLoyaltyColors(tier);
    return (
      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold border ${colors.bg} ${colors.text} ${colors.border}`}>
        <Award className={`w-3 h-3 ${colors.icon}`} />
        {tier}
      </span>
    );
  }

  function renderBirthdayAlert(c: Client & { daysAway: number }) {
    return (
      <div key={c.id} className="flex items-center gap-3 px-3 py-2 bg-pink-50 dark:bg-pink-900/20 rounded-xl border border-pink-200 dark:border-pink-800">
        {renderAvatar(c, 'w-8 h-8 text-xs')}
        <div className="flex-1 min-w-0">
          <span className="text-sm font-medium text-[#111111] dark:text-white truncate block">{c.prenom} {c.nom}</span>
          <span className="text-xs text-pink-600 dark:text-pink-400">
            {c.daysAway === 0 ? "Aujourd'hui !" : `Dans ${c.daysAway} jour${c.daysAway > 1 ? 's' : ''}`}
          </span>
        </div>
        <button
          onClick={() => {
            setSelectedClient(c);
            const tpl = EMAIL_TEMPLATES.find(t => t.id === 'anniversaire');
            if (tpl) {
              setEmailSubject(tpl.subject);
              setEmailMessage(tpl.body.replace('[prenom]', c.prenom));
            }
            setShowEmail(true);
          }}
          className="px-2.5 py-1 rounded-lg text-xs font-medium bg-pink-100 dark:bg-pink-900/40 text-pink-700 dark:text-pink-300 hover:bg-pink-200 dark:hover:bg-pink-900/60 transition-colors"
        >
          <Gift className="w-3.5 h-3.5" />
        </button>
      </div>
    );
  }

  // ── Client Card (Grid View) ───────────────────────────────────────────

  function ClientCard({ c }: { c: Client }) {
    const tier = getLoyaltyTier(c.caTotal);
    return (
      <div className="bg-white dark:bg-[#0A0A0A] rounded-2xl border border-[#E5E7EB] dark:border-[#1A1A1A] p-5 hover:shadow-lg hover:border-[#D1D5DB] dark:hover:border-[#333] transition-all cursor-pointer group"
        onClick={() => openSidebar(c)}>
        {/* Birthday banner */}
        {isBirthdayThisWeek(c.dateNaissance) && (
          <div className="flex items-center gap-2 px-3 py-1.5 -mx-5 -mt-5 mb-4 rounded-t-2xl bg-gradient-to-r from-pink-50 to-pink-100 dark:from-pink-900/20 dark:to-pink-900/10 border-b border-pink-200 dark:border-pink-800">
            <Cake className="w-3.5 h-3.5 text-pink-500" />
            <span className="text-xs font-medium text-pink-600 dark:text-pink-400">
              Anniversaire {getBirthdayDaysAway(c.dateNaissance) === 0 ? "aujourd'hui !" : `dans ${getBirthdayDaysAway(c.dateNaissance)} jour${(getBirthdayDaysAway(c.dateNaissance) || 0) > 1 ? 's' : ''}`}
            </span>
          </div>
        )}

        <div className="flex items-start gap-4">
          {renderAvatar(c, 'w-12 h-12 text-base')}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="font-semibold text-[#111111] dark:text-white truncate">{c.prenom} {c.nom}</h3>
              {renderLoyaltyBadge(c)}
            </div>
            {c.entreprise && (
              <div className="flex items-center gap-1.5 text-sm text-[#9CA3AF] dark:text-[#737373] mt-0.5">
                <Building2 className="w-3.5 h-3.5" />
                <span className="truncate">{c.entreprise}</span>
              </div>
            )}
            <div className="flex items-center gap-3 mt-1.5 text-xs text-[#9CA3AF] dark:text-[#737373]">
              {c.email && <span className="flex items-center gap-1 truncate"><Mail className="w-3 h-3 flex-shrink-0" />{c.email}</span>}
            </div>
            {c.telephone && (
              <div className="flex items-center gap-1 mt-0.5 text-xs text-[#9CA3AF] dark:text-[#737373]">
                <Phone className="w-3 h-3" />{c.telephone}
              </div>
            )}
            <div className="flex items-center gap-2 mt-2 flex-wrap">
              {renderTags(c.tags.slice(0, 3))}
              {c.tags.length > 3 && <span className="text-[10px] text-[#9CA3AF] dark:text-[#737373]">+{c.tags.length - 3}</span>}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3 mt-4 pt-4 border-t border-[#F3F4F6] dark:border-[#1A1A1A]">
          <div className="text-center">
            <div className="text-lg font-bold text-[#111111] dark:text-white">{fmt(c.caTotal)}</div>
            <div className="text-[10px] text-[#9CA3AF] dark:text-[#737373]">Total depense</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-bold text-[#111111] dark:text-white">{c.nbCommandes}</div>
            <div className="text-[10px] text-[#9CA3AF] dark:text-[#737373]">Commandes</div>
          </div>
          <div className="text-center">
            <div className="text-sm font-medium text-[#9CA3AF] dark:text-[#737373]">{fmtDate(c.derniereVisite)}</div>
            <div className="text-[10px] text-[#9CA3AF] dark:text-[#737373]">Derniere visite</div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="flex items-center gap-2 mt-4 opacity-0 group-hover:opacity-100 transition-opacity">
          <button onClick={(e) => { e.stopPropagation(); openEmailModal(c); }}
            className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium bg-[#F9FAFB] dark:bg-[#0A0A0A]/30 text-[#111111] dark:text-[#A3A3A3] hover:bg-[#F3F4F6] dark:hover:bg-[#0A0A0A]/50 transition-colors">
            <Send className="w-3.5 h-3.5" /> Envoyer email
          </button>
          <button onClick={(e) => { e.stopPropagation(); setSidebarNotes(c.notes || ''); openSidebar(c); }}
            className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium bg-[#F9FAFB] dark:bg-[#0A0A0A]/30 text-[#111111] dark:text-[#A3A3A3] hover:bg-[#F3F4F6] dark:hover:bg-[#0A0A0A]/50 transition-colors">
            <StickyNote className="w-3.5 h-3.5" /> Ajouter note
          </button>
        </div>
      </div>
    );
  }

  // ── Simple Bar Chart ──────────────────────────────────────────────────

  function BarChartSimple({ data, color = 'from-[#111111] to-[#333]' }: { data: { label: string; value: number }[]; color?: string }) {
    const max = Math.max(...data.map(d => d.value), 1);
    return (
      <div className="space-y-2">
        {data.map((d, i) => (
          <div key={i} className="flex items-center gap-3">
            <div className="w-28 text-xs text-[#6B7280] dark:text-[#A3A3A3] truncate text-right">{d.label}</div>
            <div className="flex-1 bg-[#F3F4F6] dark:bg-[#171717] rounded-full h-5 overflow-hidden">
              <div className={`h-full bg-gradient-to-r ${color} rounded-full transition-all duration-500 flex items-center justify-end pr-2`}
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
    const segs = data.map(d => {
      const start = acc;
      acc += (d.value / total) * 360;
      return { ...d, start, end: acc };
    });
    const gradient = segs.map(s => `${s.color} ${s.start}deg ${s.end}deg`).join(', ');
    return (
      <div className="flex items-center gap-6">
        <div className="w-32 h-32 rounded-full flex-shrink-0"
          style={{ background: `conic-gradient(${gradient})` }} />
        <div className="space-y-2">
          {data.map((d, i) => (
            <div key={i} className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: d.color }} />
              <span className="text-sm text-[#6B7280] dark:text-[#A3A3A3]">{d.label}: <strong>{d.value}</strong> ({total > 0 ? Math.round(d.value / total * 100) : 0}%)</span>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // ── Render ────────────────────────────────────────────────────────────

  return (
    <div className="flex gap-0">
      {/* Hidden CSV file input */}
      <input type="file" ref={csvFileRef} accept=".csv" className="hidden" onChange={(e) => {
        const file = e.target.files?.[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = (evt) => {
          try {
            const text = evt.target?.result as string;
            const lines = text.split('\n').filter(l => l.trim());
            if (lines.length < 2) { showToast('Le fichier CSV est vide ou invalide', 'error'); return; }
            const headers = lines[0].split(',').map(h => h.replace(/"/g, '').trim().toLowerCase());
            const prenomIdx = headers.findIndex(h => h === 'prenom' || h === 'firstname' || h === 'first_name');
            const nomIdx = headers.findIndex(h => h === 'nom' || h === 'lastname' || h === 'last_name' || h === 'name');
            const emailIdx = headers.findIndex(h => h === 'email' || h === 'mail');
            const telIdx = headers.findIndex(h => h.includes('tel') || h.includes('phone'));
            if (nomIdx === -1 && prenomIdx === -1) { showToast('Colonne "Nom" ou "Prenom" introuvable dans le CSV', 'error'); return; }
            let importCount = 0;
            for (let i = 1; i < lines.length; i++) {
              const cols = lines[i].split(',').map(c => c.replace(/"/g, '').trim());
              const nom = nomIdx !== -1 ? cols[nomIdx] : '';
              const prenom = prenomIdx !== -1 ? cols[prenomIdx] : '';
              if (!nom && !prenom) continue;
              const newClient: Client = {
                id: `csv-${Date.now()}-${i}`,
                prenom: prenom || '',
                nom: nom || '',
                email: emailIdx !== -1 ? cols[emailIdx] || '' : '',
                telephone: telIdx !== -1 ? cols[telIdx] || '' : '',
                entreprise: '',
                type: 'Particulier' as ClientType,
                tags: ['Nouveau' as ClientTag],
                notes: '',
                caTotal: 0,
                nbCommandes: 0,
                derniereVisite: '',
                dateNaissance: '',
                dateCreation: new Date().toISOString().split('T')[0],
                allergies: [],
                preferences: [],
                loyaltyPoints: 0,
              };
              setClients(prev => [...prev, newClient]);
              importCount++;
            }
            showToast(`${importCount} client${importCount > 1 ? 's' : ''} importe${importCount > 1 ? 's' : ''} avec succes`, 'success');
          } catch { showToast('Erreur lors de la lecture du fichier CSV', 'error'); }
        };
        reader.readAsText(file);
        e.target.value = '';
      }} />
      {/* Main content area */}
      <div className={`flex-1 space-y-6 transition-all duration-300 ${sidebarClient ? 'mr-0' : ''}`}>
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-[#111111] dark:text-white flex items-center gap-3">
              <Users className="w-7 h-7 text-[#111111] dark:text-[#A3A3A3]" />
              CRM Clients
            </h1>
            <p className="text-sm text-[#9CA3AF] dark:text-[#737373] mt-1">
              {clients.length} clients &middot; {fmt(stats.totalCA)} CA total
            </p>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <button onClick={() => setShowStats(true)}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#F3F4F6] dark:bg-[#171717] text-[#9CA3AF] dark:text-white hover:bg-[#E5E7EB] dark:hover:bg-[#333] text-sm font-medium transition-colors">
              <BarChart3 className="w-4 h-4" /> Statistiques
            </button>
            <button onClick={handleCSVExport}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#F3F4F6] dark:bg-[#171717] text-[#9CA3AF] dark:text-white hover:bg-[#E5E7EB] dark:hover:bg-[#333] text-sm font-medium transition-colors">
              <Download className="w-4 h-4" /> Exporter la liste
            </button>
            <button onClick={handleCSVImport}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#F3F4F6] dark:bg-[#171717] text-[#9CA3AF] dark:text-white hover:bg-[#E5E7EB] dark:hover:bg-[#333] text-sm font-medium transition-colors">
              <Upload className="w-4 h-4" /> Import CSV
            </button>
            <button onClick={openAdd}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#111111] dark:bg-white hover:bg-[#333] dark:hover:bg-[#E5E5E5] text-white dark:text-black text-sm font-medium transition-colors shadow-sm">
              <Plus className="w-4 h-4" /> Nouveau client
            </button>
          </div>
        </div>

        {/* ── KPI Stats Header ──────────────────────────────────────── */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white dark:bg-[#0A0A0A] rounded-2xl border border-[#E5E7EB] dark:border-[#1A1A1A] p-5">
            <div className="flex items-center justify-between mb-3">
              <div className="p-2.5 rounded-xl bg-[#F3F4F6] dark:bg-[#171717]">
                <Users className="w-5 h-5 text-[#111111] dark:text-[#A3A3A3]" />
              </div>
              <span className="text-xs font-medium text-green-600 dark:text-green-400 flex items-center gap-0.5">
                <ArrowUpRight className="w-3 h-3" />
                actifs
              </span>
            </div>
            <div className="text-3xl font-bold text-[#111111] dark:text-white">{kpis.totalClients}</div>
            <div className="text-xs text-[#9CA3AF] dark:text-[#737373] mt-1">Total clients</div>
          </div>

          <div className="bg-white dark:bg-[#0A0A0A] rounded-2xl border border-[#E5E7EB] dark:border-[#1A1A1A] p-5">
            <div className="flex items-center justify-between mb-3">
              <div className="p-2.5 rounded-xl bg-green-50 dark:bg-green-900/20">
                <UserPlus className="w-5 h-5 text-green-600 dark:text-green-400" />
              </div>
              <span className="text-xs font-medium text-[#9CA3AF] dark:text-[#737373]">ce mois</span>
            </div>
            <div className="text-3xl font-bold text-green-600 dark:text-green-400">{kpis.nouveauxCeMois}</div>
            <div className="text-xs text-[#9CA3AF] dark:text-[#737373] mt-1">Nouveaux ce mois</div>
          </div>

          <div className="bg-white dark:bg-[#0A0A0A] rounded-2xl border border-[#E5E7EB] dark:border-[#1A1A1A] p-5">
            <div className="flex items-center justify-between mb-3">
              <div className="p-2.5 rounded-xl bg-amber-50 dark:bg-amber-900/20">
                <Target className="w-5 h-5 text-amber-600 dark:text-amber-400" />
              </div>
              <span className="text-xs font-medium text-[#9CA3AF] dark:text-[#737373]">EUR/commande</span>
            </div>
            <div className="text-3xl font-bold text-amber-600 dark:text-amber-400">{fmt(kpis.panierMoyen)}</div>
            <div className="text-xs text-[#9CA3AF] dark:text-[#737373] mt-1">Panier moyen</div>
          </div>

          <div className="bg-white dark:bg-[#0A0A0A] rounded-2xl border border-[#E5E7EB] dark:border-[#1A1A1A] p-5">
            <div className="flex items-center justify-between mb-3">
              <div className="p-2.5 rounded-xl bg-blue-50 dark:bg-blue-900/20">
                <Activity className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              </div>
              <span className="text-xs font-medium text-[#9CA3AF] dark:text-[#737373]">2+ commandes</span>
            </div>
            <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">{kpis.tauxFidelisation}%</div>
            <div className="text-xs text-[#9CA3AF] dark:text-[#737373] mt-1">Taux de fidelisation</div>
          </div>
        </div>

        {/* ── Birthday Alerts ────────────────────────────────────────── */}
        {birthdayClients.length > 0 && (
          <div className="bg-white dark:bg-[#0A0A0A] rounded-2xl border border-pink-200 dark:border-pink-800 p-4">
            <div className="flex items-center gap-2 mb-3">
              <Cake className="w-5 h-5 text-pink-500" />
              <h3 className="text-sm font-semibold text-[#111111] dark:text-white">
                Anniversaires cette semaine ({birthdayClients.length})
              </h3>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
              {birthdayClients.map(c => renderBirthdayAlert(c))}
            </div>
          </div>
        )}

        {/* ── Segment Filter Tabs ────────────────────────────────────── */}
        <div className="bg-white dark:bg-[#0A0A0A] rounded-2xl border border-[#E5E7EB] dark:border-[#1A1A1A] p-1.5">
          <div className="flex gap-1 overflow-x-auto">
            {(['tous', 'vip', 'reguliers', 'nouveaux', 'inactifs'] as SegmentId[]).map(seg => (
              <button
                key={seg}
                onClick={() => setActiveSegment(seg)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all whitespace-nowrap ${
                  activeSegment === seg
                    ? 'bg-[#111111] dark:bg-white text-white dark:text-black shadow-sm'
                    : 'text-[#9CA3AF] dark:text-[#737373] hover:bg-[#F3F4F6] dark:hover:bg-[#171717]'
                }`}
              >
                {segmentIcons[seg]}
                <span>{segmentLabels[seg]}</span>
                <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-medium ${
                  activeSegment === seg
                    ? 'bg-white/20 dark:bg-black/20'
                    : 'bg-[#F3F4F6] dark:bg-[#171717]'
                }`}>
                  {seg === 'tous' ? clients.length : localSegmentCounts[seg]}
                </span>
              </button>
            ))}
          </div>
          {activeSegment !== 'tous' && (
            <div className="px-4 py-1.5 text-[10px] text-[#9CA3AF] dark:text-[#737373]">
              {segmentDescriptions[activeSegment]}
            </div>
          )}
        </div>

        {/* Filters bar */}
        <div className="bg-white dark:bg-[#0A0A0A] rounded-2xl border border-[#E5E7EB] dark:border-[#1A1A1A] p-4">
          <div className="flex flex-col md:flex-row items-stretch md:items-center gap-3">
            {/* Search */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9CA3AF] dark:text-[#737373]" />
              <input type="text" placeholder="Rechercher un client..."
                value={search} onChange={e => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[#E5E7EB] dark:border-[#1A1A1A] bg-[#F9FAFB] dark:bg-black text-sm text-[#111111] dark:text-white placeholder-[#9CA3AF] dark:placeholder-[#737373] focus:ring-2 focus:ring-[#111111] dark:ring-white focus:border-transparent" />
            </div>

            {/* Type filter */}
            <select value={filterType} onChange={e => setFilterType(e.target.value as ClientType | '')}
              className="px-3 py-2.5 rounded-xl border border-[#E5E7EB] dark:border-[#1A1A1A] bg-[#F9FAFB] dark:bg-black text-sm text-[#9CA3AF] dark:text-[#737373]">
              <option value="">Tous les types</option>
              <option value="Particulier">Particulier</option>
              <option value="Entreprise">Entreprise</option>
              <option value="Association">Association</option>
            </select>

            {/* Sort */}
            <div className="flex items-center gap-1">
              <select value={sortField} onChange={e => setSortField(e.target.value as SortField)}
                className="px-3 py-2.5 rounded-xl border border-[#E5E7EB] dark:border-[#1A1A1A] bg-[#F9FAFB] dark:bg-black text-sm text-[#9CA3AF] dark:text-[#737373]">
                <option value="nom">Tri par nom</option>
                <option value="caTotal">Tri par CA</option>
                <option value="derniereVisite">Tri par visite</option>
              </select>
              <button onClick={() => setSortAsc(!sortAsc)}
                className="p-2.5 rounded-xl border border-[#E5E7EB] dark:border-[#1A1A1A] bg-[#F9FAFB] dark:bg-black hover:bg-[#F3F4F6] dark:hover:bg-[#171717] transition-colors">
                {sortAsc ? <ChevronUp className="w-4 h-4 text-[#9CA3AF] dark:text-[#737373]" /> : <ChevronDown className="w-4 h-4 text-[#9CA3AF] dark:text-[#737373]" />}
              </button>
            </div>

            {/* Campaign for current segment */}
            {activeSegment !== 'tous' && (
              <button onClick={() => openCampaign(activeSegment)}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#111111] dark:bg-white text-white dark:text-black text-sm font-medium hover:bg-[#333] dark:hover:bg-[#E5E5E5] transition-colors">
                <Megaphone className="w-4 h-4" /> Campagne email
              </button>
            )}

            {/* View toggle */}
            <div className="flex items-center bg-[#F3F4F6] dark:bg-[#171717] rounded-xl p-0.5">
              <button onClick={() => setViewMode('cards')}
                className={`p-2.5 rounded-lg transition-colors ${viewMode === 'cards' ? 'bg-white dark:bg-[#333] shadow-sm text-[#111111] dark:text-white' : 'text-[#9CA3AF] dark:text-[#737373] hover:text-[#4B5563]'}`}>
                <LayoutGrid className="w-4 h-4" />
              </button>
              <button onClick={() => setViewMode('table')}
                className={`p-2.5 rounded-lg transition-colors ${viewMode === 'table' ? 'bg-white dark:bg-[#333] shadow-sm text-[#111111] dark:text-white' : 'text-[#9CA3AF] dark:text-[#737373] hover:text-[#4B5563]'}`}>
                <List className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Results count */}
        {filtered.length !== clients.length && (
          <p className="text-sm text-[#9CA3AF] dark:text-[#737373]">
            {filtered.length} resultat{filtered.length > 1 ? 's' : ''} sur {clients.length} clients
          </p>
        )}

        {/* Empty state */}
        {clients.length === 0 && (
          <div className="text-center py-16">
            <Users className="w-16 h-16 mx-auto mb-4 text-[#D1D5DB] dark:text-[#333]" />
            <h3 className="text-lg font-semibold text-[#111111] dark:text-white mb-2">Aucun client</h3>
            <p className="text-sm text-[#9CA3AF] dark:text-[#737373] mb-6">Commencez par ajouter votre premier client pour activer le CRM.</p>
            <button onClick={openAdd}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#111111] dark:bg-white hover:bg-[#333] dark:hover:bg-[#E5E5E5] text-white dark:text-black text-sm font-medium transition-colors">
              <Plus className="w-4 h-4" /> Ajouter un client
            </button>
          </div>
        )}

        {/* Card view */}
        {viewMode === 'cards' && clients.length > 0 && (
          <div className={`grid grid-cols-1 gap-4 ${sidebarClient ? 'md:grid-cols-1 xl:grid-cols-2' : 'md:grid-cols-2 xl:grid-cols-3'}`}>
            {filtered.map(c => <ClientCard key={c.id} c={c} />)}
          </div>
        )}

        {/* Table view */}
        {viewMode === 'table' && clients.length > 0 && (
          <div className="bg-white dark:bg-[#0A0A0A] rounded-2xl border border-[#E5E7EB] dark:border-[#1A1A1A] overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[#E5E7EB] dark:border-[#1A1A1A] bg-[#F9FAFB] dark:bg-black/50">
                  <th className="text-left px-4 py-3 font-medium text-[#9CA3AF] dark:text-[#737373]">Client</th>
                  <th className="text-left px-4 py-3 font-medium text-[#9CA3AF] dark:text-[#737373]">Fidelite</th>
                  <th className="text-left px-4 py-3 font-medium text-[#9CA3AF] dark:text-[#737373]">Tags</th>
                  <th className="text-right px-4 py-3 font-medium text-[#9CA3AF] dark:text-[#737373]">CA Total</th>
                  <th className="text-center px-4 py-3 font-medium text-[#9CA3AF] dark:text-[#737373]">Commandes</th>
                  <th className="text-left px-4 py-3 font-medium text-[#9CA3AF] dark:text-[#737373]">Derniere visite</th>
                  <th className="text-center px-4 py-3 font-medium text-[#9CA3AF] dark:text-[#737373]">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F3F4F6] dark:divide-[#1A1A1A]">
                {filtered.map(c => (
                  <tr key={c.id} className="hover:bg-[#F9FAFB] dark:hover:bg-[#171717]/30 cursor-pointer transition-colors"
                    onClick={() => openSidebar(c)}>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        {renderAvatar(c, 'w-9 h-9 text-xs')}
                        <div>
                          <div className="font-medium text-[#111111] dark:text-white flex items-center gap-2">
                            {c.prenom} {c.nom}
                            {isBirthdayThisWeek(c.dateNaissance) && <Cake className="w-3.5 h-3.5 text-pink-500" />}
                          </div>
                          <div className="text-xs text-[#9CA3AF] dark:text-[#737373]">{c.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">{renderLoyaltyBadge(c)}</td>
                    <td className="px-4 py-3">
                      <div className="flex gap-1 flex-wrap">{renderTags(c.tags.slice(0, 2))}{c.tags.length > 2 && <span className="text-[10px] text-[#9CA3AF]">+{c.tags.length - 2}</span>}</div>
                    </td>
                    <td className="px-4 py-3 text-right font-medium text-[#111111] dark:text-white">{fmt(c.caTotal)}</td>
                    <td className="px-4 py-3 text-center text-[#6B7280] dark:text-[#A3A3A3]">{c.nbCommandes}</td>
                    <td className="px-4 py-3 text-[#6B7280] dark:text-[#A3A3A3]">{fmtDate(c.derniereVisite)}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-center gap-1">
                        <button onClick={(e) => { e.stopPropagation(); openEmailModal(c); }}
                          className="p-1.5 rounded-lg hover:bg-[#F9FAFB] dark:hover:bg-[#0A0A0A]/30 text-[#9CA3AF] dark:text-[#737373] hover:text-[#111111] dark:hover:text-white transition-colors" title="Envoyer email">
                          <Send className="w-4 h-4" />
                        </button>
                        <button onClick={(e) => { e.stopPropagation(); openSidebar(c); }}
                          className="p-1.5 rounded-lg hover:bg-[#F3F4F6] dark:hover:bg-[#171717] text-[#9CA3AF] dark:text-[#737373] hover:text-[#374151] transition-colors" title="Ajouter note">
                          <StickyNote className="w-4 h-4" />
                        </button>
                        <button onClick={(e) => { e.stopPropagation(); openEdit(c); }}
                          className="p-1.5 rounded-lg hover:bg-[#F3F4F6] dark:hover:bg-[#171717] text-[#9CA3AF] dark:text-[#737373] hover:text-[#374151] transition-colors" title="Modifier">
                          <Edit2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {filtered.length === 0 && (
              <div className="text-center py-12 text-[#9CA3AF] dark:text-[#737373]">
                <Users className="w-12 h-12 mx-auto mb-3 opacity-50" />
                <p>Aucun client trouve</p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* ── Client Detail Sidebar ──────────────────────────────────────── */}
      {sidebarClient && (
        <div className="w-[380px] lg:w-[420px] flex-shrink-0 ml-6 hidden md:block">
          <div className="sticky top-6 bg-white dark:bg-[#0A0A0A] rounded-2xl border border-[#E5E7EB] dark:border-[#1A1A1A] overflow-hidden max-h-[calc(100vh-120px)] overflow-y-auto">
            {/* Sidebar Header */}
            <div className="relative p-5 border-b border-[#F3F4F6] dark:border-[#1A1A1A]">
              <button onClick={closeSidebar}
                className="absolute top-3 right-3 p-1.5 rounded-lg hover:bg-[#F3F4F6] dark:hover:bg-[#171717] transition-colors">
                <X className="w-4 h-4 text-[#9CA3AF]" />
              </button>
              <div className="flex items-start gap-4">
                {renderAvatar(sidebarClient, 'w-14 h-14 text-lg')}
                <div className="flex-1 min-w-0">
                  <h3 className="text-lg font-bold text-[#111111] dark:text-white">{sidebarClient.prenom} {sidebarClient.nom}</h3>
                  <div className="flex items-center gap-2 mt-1">
                    <span className={`px-2 py-0.5 rounded text-xs font-medium ${(TYPE_COLORS[sidebarClient.type] || TYPE_COLORS['Particulier']).bg} ${(TYPE_COLORS[sidebarClient.type] || TYPE_COLORS['Particulier']).text}`}>{sidebarClient.type}</span>
                    {renderLoyaltyBadge(sidebarClient)}
                  </div>
                  {sidebarClient.entreprise && (
                    <div className="flex items-center gap-1 text-xs text-[#9CA3AF] dark:text-[#737373] mt-1">
                      <Building2 className="w-3 h-3" /> {sidebarClient.entreprise}
                    </div>
                  )}
                </div>
              </div>

              {/* Birthday alert in sidebar */}
              {isBirthdayThisWeek(sidebarClient.dateNaissance) && (
                <div className="mt-3 flex items-center gap-2 px-3 py-2 rounded-xl bg-pink-50 dark:bg-pink-900/20 border border-pink-200 dark:border-pink-800">
                  <Cake className="w-4 h-4 text-pink-500" />
                  <span className="text-xs font-medium text-pink-600 dark:text-pink-400">
                    Anniversaire {getBirthdayDaysAway(sidebarClient.dateNaissance) === 0 ? "aujourd'hui !" : `dans ${getBirthdayDaysAway(sidebarClient.dateNaissance)} jour${(getBirthdayDaysAway(sidebarClient.dateNaissance) || 0) > 1 ? 's' : ''}`}
                  </span>
                </div>
              )}
            </div>

            {/* Contact Info */}
            <div className="p-5 border-b border-[#F3F4F6] dark:border-[#1A1A1A] space-y-2.5">
              <h4 className="text-[10px] font-semibold uppercase tracking-wider text-[#9CA3AF] dark:text-[#737373] mb-3">Contact</h4>
              {sidebarClient.email && (
                <div className="flex items-center gap-2.5 text-sm text-[#6B7280] dark:text-[#A3A3A3]">
                  <Mail className="w-4 h-4 text-[#9CA3AF] flex-shrink-0" />
                  <span className="truncate">{sidebarClient.email}</span>
                </div>
              )}
              {sidebarClient.telephone && (
                <div className="flex items-center gap-2.5 text-sm text-[#6B7280] dark:text-[#A3A3A3]">
                  <Phone className="w-4 h-4 text-[#9CA3AF] flex-shrink-0" />
                  <span>{sidebarClient.telephone}</span>
                </div>
              )}
              {sidebarClient.adresse && (
                <div className="flex items-start gap-2.5 text-sm text-[#6B7280] dark:text-[#A3A3A3]">
                  <Building2 className="w-4 h-4 text-[#9CA3AF] flex-shrink-0 mt-0.5" />
                  <span>{sidebarClient.adresse}</span>
                </div>
              )}
              {sidebarClient.dateNaissance && (
                <div className="flex items-center gap-2.5 text-sm text-[#6B7280] dark:text-[#A3A3A3]">
                  <Calendar className="w-4 h-4 text-[#9CA3AF] flex-shrink-0" />
                  <span>Ne(e) le {fmtDate(sidebarClient.dateNaissance)}</span>
                </div>
              )}
              <div className="flex items-center gap-2.5 text-sm text-[#6B7280] dark:text-[#A3A3A3]">
                <Clock className="w-4 h-4 text-[#9CA3AF] flex-shrink-0" />
                <span>Client depuis {fmtDate(sidebarClient.dateCreation)}</span>
              </div>
            </div>

            {/* Lifetime Value */}
            <div className="p-5 border-b border-[#F3F4F6] dark:border-[#1A1A1A]">
              <h4 className="text-[10px] font-semibold uppercase tracking-wider text-[#9CA3AF] dark:text-[#737373] mb-3">Valeur client</h4>
              <div className="grid grid-cols-3 gap-3">
                <div className="bg-[#F9FAFB] dark:bg-black rounded-xl p-3 text-center">
                  <div className="text-lg font-bold text-[#111111] dark:text-white">{fmt(sidebarClient.caTotal)}</div>
                  <div className="text-[10px] text-[#9CA3AF] dark:text-[#737373]">Lifetime Value</div>
                </div>
                <div className="bg-[#F9FAFB] dark:bg-black rounded-xl p-3 text-center">
                  <div className="text-lg font-bold text-[#111111] dark:text-white">{sidebarClient.nbCommandes}</div>
                  <div className="text-[10px] text-[#9CA3AF] dark:text-[#737373]">Commandes</div>
                </div>
                <div className="bg-[#F9FAFB] dark:bg-black rounded-xl p-3 text-center">
                  <div className="text-lg font-bold text-[#111111] dark:text-white">
                    {sidebarClient.nbCommandes > 0 ? fmt(sidebarClient.caTotal / sidebarClient.nbCommandes) : '--'}
                  </div>
                  <div className="text-[10px] text-[#9CA3AF] dark:text-[#737373]">Ticket moyen</div>
                </div>
              </div>
              {sidebarClient.derniereVisite && (
                <div className="mt-3 text-xs text-[#9CA3AF] dark:text-[#737373] flex items-center gap-1.5">
                  <Clock className="w-3 h-3" />
                  Derniere visite : {fmtDate(sidebarClient.derniereVisite)}
                </div>
              )}
            </div>

            {/* Favorite Dishes */}
            {sidebarClient.platsFavoris.length > 0 && (
              <div className="p-5 border-b border-[#F3F4F6] dark:border-[#1A1A1A]">
                <h4 className="text-[10px] font-semibold uppercase tracking-wider text-[#9CA3AF] dark:text-[#737373] mb-3 flex items-center gap-1.5">
                  <Star className="w-3.5 h-3.5 text-amber-500" /> Plats favoris
                </h4>
                <div className="flex flex-wrap gap-1.5">
                  {sidebarClient.platsFavoris.map(p => (
                    <span key={p} className="px-2.5 py-1 rounded-lg text-xs font-medium bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800">{p}</span>
                  ))}
                </div>
              </div>
            )}

            {/* Order History Timeline */}
            <div className="p-5 border-b border-[#F3F4F6] dark:border-[#1A1A1A]">
              <h4 className="text-[10px] font-semibold uppercase tracking-wider text-[#9CA3AF] dark:text-[#737373] mb-3">Historique</h4>
              {sidebarClient.historique.length === 0 ? (
                <p className="text-xs text-[#9CA3AF] dark:text-[#737373] text-center py-4">Aucune interaction</p>
              ) : (
                <div className="relative pl-5 border-l-2 border-[#E5E7EB] dark:border-[#1A1A1A] space-y-3 max-h-48 overflow-y-auto">
                  {sidebarClient.historique.slice(0, 8).map(h => (
                    <div key={h.id} className="relative">
                      <div className="absolute -left-[23px] w-3 h-3 rounded-full bg-white dark:bg-[#0A0A0A] border-2 border-[#D1D5DB] dark:border-[#333]" />
                      <div className="flex items-center justify-between">
                        <span className={`px-1.5 py-0.5 rounded text-[10px] font-medium ${interactionIcons[h.type]?.color || ''}`}>
                          {h.type.charAt(0).toUpperCase() + h.type.slice(1)}
                        </span>
                        <span className="text-[10px] text-[#9CA3AF] dark:text-[#737373]">{fmtDate(h.date)}</span>
                      </div>
                      <p className="text-xs text-[#9CA3AF] dark:text-[#737373] mt-0.5 line-clamp-1">{h.description}</p>
                      {h.montant && <p className="text-xs font-semibold text-[#111111] dark:text-white">{fmt(h.montant)}</p>}
                    </div>
                  ))}
                  {sidebarClient.historique.length > 8 && (
                    <button onClick={() => openDetail(sidebarClient)}
                      className="text-xs text-[#9CA3AF] dark:text-[#737373] hover:text-[#111111] dark:hover:text-white transition-colors flex items-center gap-1">
                      Voir tout <ChevronsRight className="w-3 h-3" />
                    </button>
                  )}
                </div>
              )}
            </div>

            {/* Notes (quick edit) */}
            <div className="p-5 border-b border-[#F3F4F6] dark:border-[#1A1A1A]">
              <h4 className="text-[10px] font-semibold uppercase tracking-wider text-[#9CA3AF] dark:text-[#737373] mb-3 flex items-center gap-1.5">
                <StickyNote className="w-3.5 h-3.5" /> Notes
              </h4>
              <textarea
                value={sidebarNotes}
                onChange={e => setSidebarNotes(e.target.value)}
                rows={3}
                className="w-full px-3 py-2 rounded-xl border border-[#E5E7EB] dark:border-[#1A1A1A] bg-[#F9FAFB] dark:bg-black text-xs text-[#111111] dark:text-white resize-none"
                placeholder="Notes internes sur ce client..."
              />
              {sidebarNotes !== (sidebarClient.notes || '') && (
                <button
                  onClick={() => saveClientNotes(sidebarClient.id, sidebarNotes)}
                  className="mt-2 px-3 py-1.5 rounded-lg text-xs font-medium bg-[#111111] dark:bg-white text-white dark:text-black hover:bg-[#333] dark:hover:bg-[#E5E5E5] transition-colors">
                  Sauvegarder
                </button>
              )}
            </div>

            {/* Tags */}
            <div className="p-5 border-b border-[#F3F4F6] dark:border-[#1A1A1A]">
              <h4 className="text-[10px] font-semibold uppercase tracking-wider text-[#9CA3AF] dark:text-[#737373] mb-3">Tags</h4>
              <div className="flex flex-wrap gap-1.5">
                {sidebarClient.tags.length > 0 ? renderTags(sidebarClient.tags) : (
                  <span className="text-xs text-[#9CA3AF] dark:text-[#737373]">Aucun tag</span>
                )}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="p-5 space-y-2">
              <h4 className="text-[10px] font-semibold uppercase tracking-wider text-[#9CA3AF] dark:text-[#737373] mb-3">Actions rapides</h4>
              <button onClick={() => openEmailModal(sidebarClient)}
                className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium bg-[#111111] dark:bg-white text-white dark:text-black hover:bg-[#333] dark:hover:bg-[#E5E5E5] transition-colors">
                <Send className="w-4 h-4" /> Envoyer email
              </button>
              <button onClick={() => openWhatsApp(sidebarClient.telephone)}
                className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium bg-green-600 text-white hover:bg-green-700 transition-colors">
                <MessageSquare className="w-4 h-4" /> WhatsApp
              </button>
              <button onClick={() => { closeSidebar(); openEdit(sidebarClient); }}
                className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium bg-[#F3F4F6] dark:bg-[#171717] text-[#111111] dark:text-white hover:bg-[#E5E7EB] dark:hover:bg-[#333] transition-colors">
                <Edit2 className="w-4 h-4" /> Modifier le profil
              </button>
              <button onClick={() => openDetail(sidebarClient)}
                className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium bg-[#F3F4F6] dark:bg-[#171717] text-[#111111] dark:text-white hover:bg-[#E5E7EB] dark:hover:bg-[#333] transition-colors">
                <Eye className="w-4 h-4" /> Voir fiche complete
              </button>
              <button onClick={() => handleDelete(sidebarClient.id)}
                className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors">
                <Trash2 className="w-4 h-4" /> Supprimer
              </button>
            </div>
          </div>
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
                  {renderLoyaltyBadge(selectedClient)}
                  {renderTags(selectedClient.tags)}
                </div>
                {selectedClient.entreprise && (
                  <div className="flex items-center gap-1.5 text-sm text-[#9CA3AF] dark:text-[#737373] mt-1">
                    <Building2 className="w-4 h-4" /> {selectedClient.entreprise}
                  </div>
                )}
                <div className="flex items-center gap-4 mt-2 text-sm text-[#9CA3AF] dark:text-[#737373] flex-wrap">
                  <span className="flex items-center gap-1"><Mail className="w-3.5 h-3.5" /> {selectedClient.email}</span>
                  <span className="flex items-center gap-1"><Phone className="w-3.5 h-3.5" /> {selectedClient.telephone}</span>
                  {selectedClient.dateNaissance && (
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5" /> {fmtDate(selectedClient.dateNaissance)}
                      {isBirthdayThisWeek(selectedClient.dateNaissance) && <Cake className="w-3.5 h-3.5 text-pink-500" />}
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-3 mt-3 flex-wrap">
                  <button onClick={() => openEmailModal(selectedClient)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium bg-[#111111] dark:bg-white text-white dark:text-black hover:bg-[#333] dark:hover:bg-[#E5E5E5] transition-colors">
                    <Send className="w-3.5 h-3.5" /> Envoyer email
                  </button>
                  <button onClick={() => openWhatsApp(selectedClient.telephone)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium bg-green-600 text-white hover:bg-green-700 transition-colors">
                    <MessageSquare className="w-3.5 h-3.5" /> WhatsApp
                  </button>
                  <button onClick={() => { setShowDetail(false); openEdit(selectedClient); }}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium bg-[#F3F4F6] dark:bg-[#171717] text-[#9CA3AF] dark:text-white hover:bg-[#E5E7EB] dark:hover:bg-[#333] transition-colors">
                    <Edit2 className="w-3.5 h-3.5" /> Modifier
                  </button>
                  <button onClick={() => handleDelete(selectedClient.id)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/50 transition-colors">
                    <Trash2 className="w-3.5 h-3.5" /> Supprimer
                  </button>
                </div>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-[#111111] dark:text-white">{fmt(selectedClient.caTotal)}</div>
                <div className="text-xs text-[#9CA3AF] dark:text-[#737373]">Lifetime Value</div>
                <div className="text-lg font-semibold text-[#6B7280] dark:text-[#A3A3A3] mt-1">
                  {selectedClient.nbCommandes > 0 ? fmt(selectedClient.caTotal / selectedClient.nbCommandes) : '--'}
                </div>
                <div className="text-xs text-[#9CA3AF] dark:text-[#737373]">Ticket moyen</div>
              </div>
            </div>

            {/* Tabs */}
            <div className="flex gap-1 border-b border-[#E5E7EB] dark:border-[#1A1A1A] mb-4 overflow-x-auto">
              {([
                { id: 'infos' as TabId, label: 'Informations' },
                { id: 'preferences' as TabId, label: 'Preferences' },
                { id: 'historique' as TabId, label: 'Historique' },
                { id: 'documents' as TabId, label: 'Documents' },
                { id: 'rgpd' as TabId, label: 'RGPD' },
              ]).map(tab => (
                <button key={tab.id} onClick={() => setDetailTab(tab.id)}
                  className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
                    detailTab === tab.id
                      ? 'border-[#111111] text-[#111111] dark:text-[#A3A3A3] dark:border-[#333]'
                      : 'border-transparent text-[#9CA3AF] dark:text-[#737373] hover:text-[#374151]'
                  }`}>
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Tab: Infos + Tags + Notes */}
            {detailTab === 'infos' && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-3">
                    <div><label className="text-xs font-medium text-[#9CA3AF] dark:text-[#737373]">Nom complet</label><p className="text-sm text-[#111111] dark:text-white">{selectedClient.prenom} {selectedClient.nom}</p></div>
                    <div><label className="text-xs font-medium text-[#9CA3AF] dark:text-[#737373]">Entreprise</label><p className="text-sm text-[#111111] dark:text-white">{selectedClient.entreprise || '--'}</p></div>
                    <div><label className="text-xs font-medium text-[#9CA3AF] dark:text-[#737373]">SIRET</label><p className="text-sm text-[#111111] dark:text-white">{selectedClient.siret || '--'}</p></div>
                    <div><label className="text-xs font-medium text-[#9CA3AF] dark:text-[#737373]">Adresse</label><p className="text-sm text-[#111111] dark:text-white">{selectedClient.adresse || '--'}</p></div>
                  </div>
                  <div className="space-y-3">
                    <div><label className="text-xs font-medium text-[#9CA3AF] dark:text-[#737373]">Email</label><p className="text-sm text-[#111111] dark:text-white">{selectedClient.email}</p></div>
                    <div><label className="text-xs font-medium text-[#9CA3AF] dark:text-[#737373]">Telephone</label><p className="text-sm text-[#111111] dark:text-white">{selectedClient.telephone}</p></div>
                    <div><label className="text-xs font-medium text-[#9CA3AF] dark:text-[#737373]">Date de naissance</label><p className="text-sm text-[#111111] dark:text-white">{selectedClient.dateNaissance ? fmtDate(selectedClient.dateNaissance) : '--'}</p></div>
                    <div><label className="text-xs font-medium text-[#9CA3AF] dark:text-[#737373]">Client depuis</label><p className="text-sm text-[#111111] dark:text-white">{fmtDate(selectedClient.dateCreation)}</p></div>
                  </div>
                </div>

                {/* Editable Tags */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-xs font-medium text-[#9CA3AF] dark:text-[#737373] flex items-center gap-1.5">
                      <Tag className="w-3.5 h-3.5" /> Tags
                    </label>
                    <button onClick={() => setEditingTags(!editingTags)}
                      className="text-xs text-[#9CA3AF] dark:text-[#737373] hover:text-[#111111] dark:hover:text-white transition-colors">
                      {editingTags ? 'Terminer' : 'Modifier'}
                    </button>
                  </div>
                  {editingTags ? (
                    <div className="flex flex-wrap gap-2">
                      {Object.keys(BASIC_TAG_COLORS).map(tag => {
                        const active = selectedClient.tags.includes(tag as ClientTag);
                        const colors = BASIC_TAG_COLORS[tag];
                        return (
                          <button key={tag}
                            onClick={() => toggleClientTag(selectedClient.id, tag as ClientTag)}
                            className={`px-3 py-1 rounded-full text-xs font-medium border transition-colors ${
                              active ? `${colors.bg} ${colors.text} ${colors.border}` : 'bg-[#F9FAFB] dark:bg-black text-[#9CA3AF] dark:text-[#737373] border-[#E5E7EB] dark:border-[#1A1A1A]'
                            }`}>
                            {active ? 'x ' : '+ '}{tag}
                          </button>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="flex flex-wrap gap-2">
                      {selectedClient.tags.length > 0 ? renderTags(selectedClient.tags) : (
                        <span className="text-xs text-[#9CA3AF] dark:text-[#737373]">Aucun tag</span>
                      )}
                    </div>
                  )}
                </div>

                {/* Editable Notes */}
                <div>
                  <label className="text-xs font-medium text-[#9CA3AF] dark:text-[#737373] mb-1 block">Notes</label>
                  <textarea
                    value={clientNotes}
                    onChange={e => setClientNotes(e.target.value)}
                    rows={3}
                    className="w-full px-3 py-2 rounded-xl border border-[#E5E7EB] dark:border-[#1A1A1A] bg-[#F9FAFB] dark:bg-black text-sm text-[#111111] dark:text-white resize-none"
                    placeholder="Notes internes sur ce client..."
                  />
                  {clientNotes !== (selectedClient.notes || '') && (
                    <button
                      onClick={() => saveClientNotes(selectedClient.id, clientNotes)}
                      className="mt-2 px-4 py-1.5 rounded-xl text-xs font-medium bg-[#111111] dark:bg-white text-white dark:text-black hover:bg-[#333] dark:hover:bg-[#E5E5E5] transition-colors">
                      Sauvegarder notes
                    </button>
                  )}
                </div>

                {/* Favorite dishes */}
                {selectedClient.platsFavoris.length > 0 && (
                  <div>
                    <label className="text-xs font-medium text-[#9CA3AF] dark:text-[#737373] mb-2 block flex items-center gap-1.5">
                      <Star className="w-3.5 h-3.5 text-amber-500" /> Plats favoris
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {selectedClient.platsFavoris.map(p => (
                        <span key={p} className="px-3 py-1 rounded-full text-xs font-medium bg-amber-50 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-700">{p}</span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Tab: Preferences alimentaires */}
            {detailTab === 'preferences' && (
              <div className="space-y-6">
                <div>
                  <h4 className="text-sm font-semibold text-[#9CA3AF] dark:text-[#737373] mb-3 flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 text-amber-500" /> Allergenes
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {EU_ALLERGENES.map(a => {
                      const active = selectedClient.allergenes.includes(a.id);
                      return (
                        <span key={a.id} className={`px-3 py-1 rounded-full text-xs font-medium border ${
                          active
                            ? 'bg-red-100 dark:bg-red-900/40 text-red-700 dark:text-red-300 border-red-300 dark:border-red-700'
                            : 'bg-[#F9FAFB] dark:bg-black text-[#9CA3AF] dark:text-[#A3A3A3] border-[#E5E7EB] dark:border-[#1A1A1A]'
                        }`}>
                          {active && '! '}{a.nom}
                        </span>
                      );
                    })}
                  </div>
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-[#9CA3AF] dark:text-[#737373] mb-3 flex items-center gap-2">
                    <Heart className="w-4 h-4 text-green-500" /> Regime
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {REGIMES.map(r => {
                      const active = selectedClient.regime.includes(r);
                      return (
                        <span key={r} className={`px-3 py-1 rounded-full text-xs font-medium border ${
                          active
                            ? 'bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-300 border-green-300 dark:border-green-700'
                            : 'bg-[#F9FAFB] dark:bg-black text-[#9CA3AF] dark:text-[#A3A3A3] border-[#E5E7EB] dark:border-[#1A1A1A]'
                        }`}>
                          {r}
                        </span>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}

            {/* Tab: Historique (timeline) */}
            {detailTab === 'historique' && (
              <div className="space-y-3">
                {/* Summary bar */}
                <div className="grid grid-cols-3 gap-4 mb-4">
                  <div className="bg-[#F9FAFB] dark:bg-black rounded-xl p-3 text-center">
                    <div className="text-lg font-bold text-[#111111] dark:text-white">{fmt(selectedClient.caTotal)}</div>
                    <div className="text-xs text-[#9CA3AF] dark:text-[#737373]">Total depense</div>
                  </div>
                  <div className="bg-[#F9FAFB] dark:bg-black rounded-xl p-3 text-center">
                    <div className="text-lg font-bold text-[#111111] dark:text-white">
                      {selectedClient.nbCommandes > 0 ? fmt(selectedClient.caTotal / selectedClient.nbCommandes) : '--'}
                    </div>
                    <div className="text-xs text-[#9CA3AF] dark:text-[#737373]">Ticket moyen</div>
                  </div>
                  <div className="bg-[#F9FAFB] dark:bg-black rounded-xl p-3 text-center">
                    <div className="text-lg font-bold text-[#111111] dark:text-white">{selectedClient.nbCommandes}</div>
                    <div className="text-xs text-[#9CA3AF] dark:text-[#737373]">Visites</div>
                  </div>
                </div>

                {selectedClient.historique.length === 0 ? (
                  <p className="text-sm text-[#9CA3AF] dark:text-[#737373] text-center py-8">Aucune interaction enregistree</p>
                ) : (
                  <div className="relative pl-6 border-l-2 border-[#E5E7EB] dark:border-[#1A1A1A] space-y-4">
                    {selectedClient.historique.map(h => (
                      <div key={h.id} className="relative">
                        <div className="absolute -left-[29px] w-4 h-4 rounded-full bg-white dark:bg-[#0A0A0A] border-2 border-[#D1D5DB] dark:border-[#1A1A1A] flex items-center justify-center text-[8px] font-bold">
                          {interactionIcons[h.type]?.icon || '?'}
                        </div>
                        <div className="bg-[#F9FAFB] dark:bg-black rounded-xl p-3">
                          <div className="flex items-center justify-between">
                            <span className={`px-2 py-0.5 rounded text-xs font-medium ${interactionIcons[h.type]?.color || ''}`}>
                              {h.type.charAt(0).toUpperCase() + h.type.slice(1)}
                            </span>
                            <span className="text-xs text-[#9CA3AF] dark:text-[#737373]">{fmtDate(h.date)}</span>
                          </div>
                          <p className="text-sm text-[#9CA3AF] dark:text-[#737373] mt-1">{h.description}</p>
                          {h.montant && <p className="text-sm font-semibold text-[#111111] dark:text-white mt-1">{fmt(h.montant)}</p>}
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
                  <p className="text-sm text-[#9CA3AF] dark:text-[#737373] text-center py-8">Aucun document</p>
                ) : (
                  selectedClient.documents.map(d => (
                    <div key={d.id} className="flex items-center justify-between bg-[#F9FAFB] dark:bg-black rounded-xl p-3">
                      <div className="flex items-center gap-3">
                        <FileText className={`w-5 h-5 ${d.type === 'facture' ? 'text-green-500' : 'text-[#374151] dark:text-[#D4D4D4]'}`} />
                        <div>
                          <div className="text-sm font-medium text-[#111111] dark:text-white">{d.numero}</div>
                          <div className="text-xs text-[#9CA3AF] dark:text-[#737373]">{d.type === 'facture' ? 'Facture' : 'Devis'} &middot; {fmtDate(d.date)}</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-semibold text-[#111111] dark:text-white">{fmt(d.montant)}</div>
                        <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                          d.statut === 'Payee' ? 'bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-300' :
                          d.statut === 'Accepte' ? 'bg-[#F3F4F6] dark:bg-[#0A0A0A]/40 text-[#111111] dark:text-[#737373]' :
                          d.statut === 'Refuse' ? 'bg-red-100 dark:bg-red-900/40 text-red-700 dark:text-red-300' :
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
                <div className="bg-[#F9FAFB] dark:bg-black rounded-xl p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Shield className="w-5 h-5 text-[#374151] dark:text-[#D4D4D4]" />
                    <h4 className="text-sm font-semibold text-[#9CA3AF] dark:text-[#737373]">Protection des donnees</h4>
                  </div>
                  <div className="space-y-2 text-sm">
                    <p className="text-[#6B7280] dark:text-[#A3A3A3]">
                      Date de consentement RGPD : <strong className="text-[#111111] dark:text-white">{fmtDate(selectedClient.consentementRGPD)}</strong>
                    </p>
                    <p className="text-[#6B7280] dark:text-[#A3A3A3]">
                      Donnees collectees : nom, coordonnees, preferences alimentaires, historique commercial
                    </p>
                  </div>
                </div>
                <div className="flex flex-wrap gap-3">
                  <button onClick={() => exportClientData(selectedClient)}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#F9FAFB] dark:bg-[#0A0A0A]/30 text-[#111111] dark:text-[#A3A3A3] hover:bg-[#F3F4F6] dark:hover:bg-[#0A0A0A]/50 text-sm font-medium transition-colors">
                    <Download className="w-4 h-4" /> Exporter donnees
                  </button>
                  <button onClick={() => handleRGPDForget(selectedClient)}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/50 text-sm font-medium transition-colors">
                    <Trash2 className="w-4 h-4" /> Droit a l'oubli
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </Modal>

      {/* ── Add/Edit Modal ───────────────────────────────────────────── */}
      <Modal isOpen={showForm} onClose={() => setShowForm(false)}
        title={editingClient ? 'Modifier le client' : 'Nouveau client'}
        className="max-w-3xl">
        <div className="space-y-5">
          {duplicateWarning && (
            <div className="flex items-center gap-2 px-4 py-3 bg-amber-50 dark:bg-amber-900/30 border border-amber-200 dark:border-amber-700 rounded-xl text-sm text-amber-700 dark:text-amber-300">
              <AlertTriangle className="w-4 h-4 flex-shrink-0" />
              {duplicateWarning}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-[#9CA3AF] dark:text-[#737373] mb-1">Prenom</label>
              <input type="text" value={form.prenom} onChange={e => setForm({ ...form, prenom: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-[#E5E7EB] dark:border-[#1A1A1A] bg-white dark:bg-black text-sm text-[#111111] dark:text-white" />
            </div>
            <div>
              <label className="block text-xs font-medium text-[#9CA3AF] dark:text-[#737373] mb-1">Nom</label>
              <input type="text" value={form.nom}
                onChange={e => { setForm({ ...form, nom: e.target.value }); checkDuplicate(e.target.value, form.email); }}
                className="w-full px-3 py-2 rounded-xl border border-[#E5E7EB] dark:border-[#1A1A1A] bg-white dark:bg-black text-sm text-[#111111] dark:text-white" />
            </div>
            <div>
              <label className="block text-xs font-medium text-[#9CA3AF] dark:text-[#737373] mb-1">Email</label>
              <input type="email" value={form.email}
                onChange={e => { setForm({ ...form, email: e.target.value }); checkDuplicate(form.nom, e.target.value); }}
                className="w-full px-3 py-2 rounded-xl border border-[#E5E7EB] dark:border-[#1A1A1A] bg-white dark:bg-black text-sm text-[#111111] dark:text-white" />
            </div>
            <div>
              <label className="block text-xs font-medium text-[#9CA3AF] dark:text-[#737373] mb-1">Telephone</label>
              <input type="tel" value={form.telephone} onChange={e => setForm({ ...form, telephone: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-[#E5E7EB] dark:border-[#1A1A1A] bg-white dark:bg-black text-sm text-[#111111] dark:text-white" />
            </div>
            <div>
              <label className="block text-xs font-medium text-[#9CA3AF] dark:text-[#737373] mb-1">Entreprise</label>
              <input type="text" value={form.entreprise} onChange={e => setForm({ ...form, entreprise: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-[#E5E7EB] dark:border-[#1A1A1A] bg-white dark:bg-black text-sm text-[#111111] dark:text-white" />
            </div>
            <div>
              <label className="block text-xs font-medium text-[#9CA3AF] dark:text-[#737373] mb-1">Date de naissance</label>
              <input type="date" value={form.dateNaissance} onChange={e => setForm({ ...form, dateNaissance: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-[#E5E7EB] dark:border-[#1A1A1A] bg-white dark:bg-black text-sm text-[#111111] dark:text-white" />
            </div>
            <div>
              <label className="block text-xs font-medium text-[#9CA3AF] dark:text-[#737373] mb-1">SIRET</label>
              <input type="text" value={form.siret} onChange={e => setForm({ ...form, siret: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-[#E5E7EB] dark:border-[#1A1A1A] bg-white dark:bg-black text-sm text-[#111111] dark:text-white" />
            </div>
            <div>
              <label className="block text-xs font-medium text-[#9CA3AF] dark:text-[#737373] mb-1">Type</label>
              <select value={form.type} onChange={e => setForm({ ...form, type: e.target.value as ClientType })}
                className="w-full px-3 py-2 rounded-xl border border-[#E5E7EB] dark:border-[#1A1A1A] bg-white dark:bg-black text-sm text-[#111111] dark:text-white">
                <option value="Particulier">Particulier</option>
                <option value="Entreprise">Entreprise</option>
                <option value="Association">Association</option>
              </select>
            </div>
            <div className="col-span-full">
              <label className="block text-xs font-medium text-[#9CA3AF] dark:text-[#737373] mb-1">Adresse</label>
              <input type="text" value={form.adresse} onChange={e => setForm({ ...form, adresse: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-[#E5E7EB] dark:border-[#1A1A1A] bg-white dark:bg-black text-sm text-[#111111] dark:text-white" />
            </div>
            <div className="col-span-full">
              <label className="block text-xs font-medium text-[#9CA3AF] dark:text-[#737373] mb-1">Tags</label>
              <div className="flex gap-2 flex-wrap">
                {Object.keys(BASIC_TAG_COLORS).map(tag => (
                  <button key={tag} type="button"
                    onClick={() => {
                      setForm(f => ({
                        ...f,
                        tags: f.tags.includes(tag as ClientTag) ? f.tags.filter(t => t !== tag) : [...f.tags, tag as ClientTag],
                      }));
                    }}
                    className={`px-2.5 py-1 rounded-xl text-xs font-medium border transition-colors ${
                      form.tags.includes(tag as ClientTag)
                        ? `${BASIC_TAG_COLORS[tag].bg} ${BASIC_TAG_COLORS[tag].text} ${BASIC_TAG_COLORS[tag].border}`
                        : 'bg-[#F9FAFB] dark:bg-black text-[#9CA3AF] dark:text-[#737373] border-[#E5E7EB] dark:border-[#1A1A1A]'
                    }`}>
                    {tag}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* CA & Commandes (manual entry since localStorage) */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-medium text-[#9CA3AF] dark:text-[#737373] mb-1">CA Total (EUR)</label>
              <input type="number" value={form.caTotal} onChange={e => setForm({ ...form, caTotal: parseFloat(e.target.value) || 0 })}
                className="w-full px-3 py-2 rounded-xl border border-[#E5E7EB] dark:border-[#1A1A1A] bg-white dark:bg-black text-sm text-[#111111] dark:text-white" />
            </div>
            <div>
              <label className="block text-xs font-medium text-[#9CA3AF] dark:text-[#737373] mb-1">Nb commandes</label>
              <input type="number" value={form.nbCommandes} onChange={e => setForm({ ...form, nbCommandes: parseInt(e.target.value) || 0 })}
                className="w-full px-3 py-2 rounded-xl border border-[#E5E7EB] dark:border-[#1A1A1A] bg-white dark:bg-black text-sm text-[#111111] dark:text-white" />
            </div>
            <div>
              <label className="block text-xs font-medium text-[#9CA3AF] dark:text-[#737373] mb-1">Derniere visite</label>
              <input type="date" value={form.derniereVisite} onChange={e => setForm({ ...form, derniereVisite: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-[#E5E7EB] dark:border-[#1A1A1A] bg-white dark:bg-black text-sm text-[#111111] dark:text-white" />
            </div>
          </div>

          {/* Allergenes */}
          <div>
            <label className="block text-xs font-medium text-[#9CA3AF] dark:text-[#737373] mb-2">Allergenes (14 allergenes UE)</label>
            <div className="flex flex-wrap gap-2">
              {EU_ALLERGENES.map(a => (
                <label key={a.id} className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium border cursor-pointer transition-colors ${
                  form.allergenes.includes(a.id)
                    ? 'bg-red-100 dark:bg-red-900/40 text-red-700 dark:text-red-300 border-red-300 dark:border-red-700'
                    : 'bg-[#F9FAFB] dark:bg-black text-[#9CA3AF] dark:text-[#737373] border-[#E5E7EB] dark:border-[#1A1A1A] hover:bg-[#F3F4F6] dark:hover:bg-[#171717]'
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

          {/* Regime */}
          <div>
            <label className="block text-xs font-medium text-[#9CA3AF] dark:text-[#737373] mb-2">Regime alimentaire</label>
            <div className="flex flex-wrap gap-2">
              {REGIMES.map(r => (
                <label key={r} className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium border cursor-pointer transition-colors ${
                  form.regime.includes(r)
                    ? 'bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-300 border-green-300 dark:border-green-700'
                    : 'bg-[#F9FAFB] dark:bg-black text-[#9CA3AF] dark:text-[#737373] border-[#E5E7EB] dark:border-[#1A1A1A] hover:bg-[#F3F4F6] dark:hover:bg-[#171717]'
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
            <label className="block text-xs font-medium text-[#9CA3AF] dark:text-[#737373] mb-1">Notes</label>
            <textarea value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })}
              rows={3}
              className="w-full px-3 py-2 rounded-xl border border-[#E5E7EB] dark:border-[#1A1A1A] bg-white dark:bg-black text-sm text-[#111111] dark:text-white resize-none" />
          </div>

          {/* Actions */}
          <div className="flex items-center justify-between pt-4 border-t border-[#E5E7EB] dark:border-[#1A1A1A]">
            <button onClick={handleCSVImport}
              className="flex items-center gap-2 text-sm text-[#9CA3AF] dark:text-[#737373] hover:text-[#374151] transition-colors">
              <Upload className="w-4 h-4" /> Import CSV
            </button>
            <div className="flex gap-3">
              <button onClick={() => setShowForm(false)}
                className="px-4 py-2 rounded-xl text-sm font-medium text-[#6B7280] dark:text-[#A3A3A3] hover:bg-[#F3F4F6] dark:hover:bg-[#171717] transition-colors">
                Annuler
              </button>
              <button onClick={handleSave}
                className="px-6 py-2 rounded-xl text-sm font-medium bg-[#111111] dark:bg-white hover:bg-[#333] dark:hover:bg-[#E5E5E5] text-white dark:text-black transition-colors">
                {editingClient ? 'Sauvegarder' : 'Ajouter'}
              </button>
            </div>
          </div>
        </div>
      </Modal>

      {/* ── Email Modal ──────────────────────────────────────────────── */}
      <Modal isOpen={showEmail} onClose={() => { setShowEmail(false); setEmailSubject(''); setEmailMessage(''); setSelectedTemplate(''); }}
        title={selectedClient ? `Email a ${selectedClient.prenom} ${selectedClient.nom}` : 'Email'}>
        {selectedClient && (
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-[#9CA3AF] dark:text-[#737373] mb-2">Templates rapides</label>
              <div className="flex flex-wrap gap-2">
                {EMAIL_TEMPLATES.map(tpl => (
                  <button key={tpl.id}
                    onClick={() => applyTemplate(tpl)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-medium border transition-colors ${selectedTemplate === tpl.id ? 'border-[#111111] dark:border-white bg-[#F9FAFB] dark:bg-[#0A0A0A]/30 text-[#111111] dark:text-white' : 'border-[#E5E7EB] dark:border-[#1A1A1A] text-[#6B7280] dark:text-[#A3A3A3] hover:border-[#D1D5DB] dark:hover:border-[#333]'}`}>
                    {tpl.id === 'anniversaire' && <Cake className="w-3 h-3 inline mr-1" />}
                    {tpl.label}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-xs font-medium text-[#9CA3AF] dark:text-[#737373] mb-1">Sujet</label>
              <input type="text" value={emailSubject} onChange={(e) => setEmailSubject(e.target.value)}
                placeholder="Sujet de l'email..."
                className="w-full px-3 py-2 rounded-xl border border-[#E5E7EB] dark:border-[#1A1A1A] bg-white dark:bg-[#0A0A0A] text-[#111111] dark:text-white text-sm focus:ring-2 focus:ring-[#111111] dark:ring-white focus:border-[#111111] outline-none" />
            </div>
            <div>
              <label className="block text-xs font-medium text-[#9CA3AF] dark:text-[#737373] mb-1">Message</label>
              <textarea value={emailMessage} onChange={(e) => setEmailMessage(e.target.value)}
                placeholder="Votre message..."
                rows={6}
                className="w-full px-3 py-2 rounded-xl border border-[#E5E7EB] dark:border-[#1A1A1A] bg-white dark:bg-[#0A0A0A] text-[#111111] dark:text-white text-sm focus:ring-2 focus:ring-[#111111] dark:ring-white focus:border-[#111111] outline-none resize-vertical" />
            </div>
            <div className="flex justify-end gap-3 pt-2">
              <button onClick={() => { setShowEmail(false); setEmailSubject(''); setEmailMessage(''); setSelectedTemplate(''); }}
                className="px-4 py-2 rounded-xl text-sm font-medium text-[#6B7280] dark:text-[#A3A3A3] hover:bg-[#F3F4F6] dark:hover:bg-[#171717] transition-colors">
                Annuler
              </button>
              <button onClick={handleSendClientEmail}
                disabled={sendingClientEmail || !emailSubject.trim() || !emailMessage.trim()}
                className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold bg-[#111111] dark:bg-white hover:bg-[#333] dark:hover:bg-[#E5E5E5] text-white dark:text-black transition-colors disabled:opacity-50">
                {sendingClientEmail ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                Envoyer
              </button>
            </div>
          </div>
        )}
      </Modal>

      {/* ── Campaign Email Modal ─────────────────────────────────────── */}
      <Modal isOpen={showCampaign} onClose={() => setShowCampaign(false)}
        title={`Campagne email - ${segmentLabels[campaignSegment]}`}
        className="max-w-2xl">
        <div className="space-y-5">
          {/* Segment info */}
          <div className="bg-[#F9FAFB] dark:bg-black rounded-xl p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-xl bg-[#F3F4F6] dark:bg-[#171717] ${segmentColors[campaignSegment]}`}>
                  {segmentIcons[campaignSegment]}
                </div>
                <div>
                  <div className="text-sm font-semibold text-[#111111] dark:text-white">{segmentLabels[campaignSegment]}</div>
                  <div className="text-xs text-[#9CA3AF] dark:text-[#737373]">
                    {getSegmentClients(campaignSegment).length} destinataires
                  </div>
                </div>
              </div>
              <Megaphone className={`w-6 h-6 ${segmentColors[campaignSegment]}`} />
            </div>
          </div>

          {/* Segment selector */}
          <div>
            <label className="block text-xs font-medium text-[#9CA3AF] dark:text-[#737373] mb-2">Segment cible</label>
            <div className="flex flex-wrap gap-2">
              {(['tous', 'vip', 'reguliers', 'nouveaux', 'inactifs'] as SegmentId[]).map(seg => (
                <button key={seg}
                  onClick={() => {
                    setCampaignSegment(seg);
                    const tpl = CAMPAIGN_TEMPLATES[seg];
                    setCampaignSubject(tpl.subject);
                    setCampaignMessage(tpl.body);
                  }}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium border transition-colors ${
                    campaignSegment === seg
                      ? 'border-[#111111] dark:border-white bg-[#111111] dark:bg-white text-white dark:text-black'
                      : 'border-[#E5E7EB] dark:border-[#1A1A1A] text-[#6B7280] dark:text-[#A3A3A3] hover:border-[#D1D5DB] dark:hover:border-[#333]'
                  }`}>
                  {segmentIcons[seg]}
                  {segmentLabels[seg]}
                  <span className="text-[10px] opacity-70">({getSegmentClients(seg).length})</span>
                </button>
              ))}
            </div>
          </div>

          {/* Subject */}
          <div>
            <label className="block text-xs font-medium text-[#9CA3AF] dark:text-[#737373] mb-1">Sujet</label>
            <input type="text" value={campaignSubject} onChange={e => setCampaignSubject(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-[#E5E7EB] dark:border-[#1A1A1A] bg-white dark:bg-[#0A0A0A] text-[#111111] dark:text-white text-sm focus:ring-2 focus:ring-[#111111] dark:ring-white outline-none" />
          </div>

          {/* Message */}
          <div>
            <label className="block text-xs font-medium text-[#9CA3AF] dark:text-[#737373] mb-1">
              Message <span className="text-[10px] opacity-60">(variables : [nom], [prenom], [entreprise])</span>
            </label>
            <textarea value={campaignMessage} onChange={e => setCampaignMessage(e.target.value)}
              rows={8}
              className="w-full px-3 py-2 rounded-xl border border-[#E5E7EB] dark:border-[#1A1A1A] bg-white dark:bg-[#0A0A0A] text-[#111111] dark:text-white text-sm focus:ring-2 focus:ring-[#111111] dark:ring-white outline-none resize-vertical" />
          </div>

          {/* Preview */}
          <div>
            <label className="block text-xs font-medium text-[#9CA3AF] dark:text-[#737373] mb-1">Apercu</label>
            <div className="bg-[#F9FAFB] dark:bg-black rounded-xl p-4 text-sm text-[#6B7280] dark:text-[#A3A3A3] whitespace-pre-wrap border border-[#E5E7EB] dark:border-[#1A1A1A]">
              {campaignMessage.replace(/\[nom\]/gi, 'Dupont').replace(/\[prenom\]/gi, 'Jean').replace(/\[entreprise\]/gi, 'SARL Example')}
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-between items-center pt-4 border-t border-[#E5E7EB] dark:border-[#1A1A1A]">
            <div className="text-xs text-[#9CA3AF] dark:text-[#737373]">
              {getSegmentClients(campaignSegment).length} email{getSegmentClients(campaignSegment).length > 1 ? 's' : ''} seront envoye{getSegmentClients(campaignSegment).length > 1 ? 's' : ''}
            </div>
            <div className="flex gap-3">
              <button onClick={() => setShowCampaign(false)}
                className="px-4 py-2 rounded-xl text-sm font-medium text-[#6B7280] dark:text-[#A3A3A3] hover:bg-[#F3F4F6] dark:hover:bg-[#171717] transition-colors">
                Annuler
              </button>
              <button onClick={handleSendCampaign}
                disabled={sendingCampaign || !campaignSubject.trim() || !campaignMessage.trim() || getSegmentClients(campaignSegment).length === 0}
                className="flex items-center gap-2 px-6 py-2 rounded-xl text-sm font-semibold bg-[#111111] dark:bg-white hover:bg-[#333] dark:hover:bg-[#E5E5E5] text-white dark:text-black transition-colors disabled:opacity-50">
                {sendingCampaign ? <Loader2 className="w-4 h-4 animate-spin" /> : <Megaphone className="w-4 h-4" />}
                Envoyer la campagne
              </button>
            </div>
          </div>
        </div>
      </Modal>

      {/* ── Stats Modal ──────────────────────────────────────────────── */}
      <Modal isOpen={showStats} onClose={() => setShowStats(false)} title="Statistiques CRM" className="max-w-3xl">
        <div className="space-y-8">
          {/* KPIs */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-[#F9FAFB] dark:bg-black rounded-2xl p-4 text-center">
              <div className="text-2xl font-bold text-[#111111] dark:text-white">{clients.length}</div>
              <div className="text-xs text-[#9CA3AF] dark:text-[#737373] mt-1">Total clients</div>
            </div>
            <div className="bg-[#F9FAFB] dark:bg-black rounded-2xl p-4 text-center">
              <div className="text-2xl font-bold text-[#111111] dark:text-[#A3A3A3]">{fmt(stats.totalCA)}</div>
              <div className="text-xs text-[#9CA3AF] dark:text-[#737373] mt-1">CA Total</div>
            </div>
            <div className="bg-[#F9FAFB] dark:bg-black rounded-2xl p-4 text-center">
              <div className="text-2xl font-bold text-green-600 dark:text-green-400">{fmt(stats.avgCA)}</div>
              <div className="text-xs text-[#9CA3AF] dark:text-[#737373] mt-1">CA moyen/client</div>
            </div>
            <div className="bg-[#F9FAFB] dark:bg-black rounded-2xl p-4 text-center">
              <div className="text-2xl font-bold text-amber-600 dark:text-amber-400">{localSegmentCounts.vip}</div>
              <div className="text-xs text-[#9CA3AF] dark:text-[#737373] mt-1">Clients VIP</div>
            </div>
          </div>

          {/* Segment distribution pie chart */}
          <div>
            <h4 className="text-sm font-semibold text-[#9CA3AF] dark:text-[#737373] mb-3 flex items-center gap-2">
              <PieChart className="w-4 h-4 text-purple-500" /> Distribution par segment
            </h4>
            <PieChartSimple data={[
              { label: 'VIP', value: localSegmentCounts.vip, color: '#f59e0b' },
              { label: 'Reguliers', value: localSegmentCounts.reguliers, color: '#3b82f6' },
              { label: 'Nouveaux', value: localSegmentCounts.nouveaux, color: '#22c55e' },
              { label: 'Inactifs', value: localSegmentCounts.inactifs, color: '#ef4444' },
            ]} />
          </div>

          {/* Revenue by segment bar chart */}
          <div>
            <h4 className="text-sm font-semibold text-[#9CA3AF] dark:text-[#737373] mb-3 flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-[#374151] dark:text-[#D4D4D4]" /> CA par segment
            </h4>
            <BarChartSimple data={[
              { label: 'VIP', value: segments?.vip.totalRevenue || 0 },
              { label: 'Reguliers', value: segments?.reguliers.totalRevenue || 0 },
              { label: 'Nouveaux', value: segments?.nouveaux.totalRevenue || 0 },
              { label: 'Inactifs', value: segments?.inactifs.totalRevenue || 0 },
            ]} />
          </div>

          {/* Top 10 by CA */}
          <div>
            <h4 className="text-sm font-semibold text-[#9CA3AF] dark:text-[#737373] mb-3 flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-green-500" /> Top 10 clients par CA
            </h4>
            <BarChartSimple data={stats.top10.map(c => ({ label: `${c.prenom} ${c.nom}`, value: c.caTotal }))} />
          </div>

          {/* Type distribution */}
          <div>
            <h4 className="text-sm font-semibold text-[#9CA3AF] dark:text-[#737373] mb-3 flex items-center gap-2">
              <PieChart className="w-4 h-4 text-indigo-500" /> Distribution par type
            </h4>
            <PieChartSimple data={[
              { label: 'Particulier', value: stats.byType.Particulier, color: '#6b7280' },
              { label: 'Entreprise', value: stats.byType.Entreprise, color: '#6366f1' },
              { label: 'Association', value: stats.byType.Association, color: '#f43f5e' },
            ]} />
          </div>
        </div>
      </Modal>
    </div>
  );
}
