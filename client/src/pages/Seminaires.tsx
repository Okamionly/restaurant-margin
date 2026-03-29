import { useState, useMemo, useEffect, useCallback } from 'react';
import {
  CalendarDays, Users, Euro, TrendingUp, Plus, ChevronLeft, ChevronRight,
  Edit, Trash2, Send, CheckCircle2, XCircle, Clock, Building2, Utensils,
  Printer, PartyPopper, ArrowRight, Search, LayoutGrid, Calendar,
  Phone, Mail, Briefcase, MapPin, Monitor, Music, Mic, Tv, Flower2, Camera,
  FileText, DollarSign, Hash, AlertCircle
} from 'lucide-react';
import { useToast } from '../hooks/useToast';
import Modal from '../components/Modal';

const API = '';

function authHeaders() {
  const token = localStorage.getItem('token');
  const rid = localStorage.getItem('selectedRestaurantId') || '';
  return { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json', 'X-Restaurant-Id': rid };
}

// ── Status mapping (backend <-> frontend) ──
const STATUS_TO_BACKEND: Record<string, string> = {
  'Demande': 'demande',
  'Devis envoyé': 'devis_envoye',
  'Confirmé': 'confirme',
  'En cours': 'en_cours',
  'Soldé': 'solde',
};
const STATUS_TO_FRONTEND: Record<string, EventStatus> = {
  'demande': 'Demande',
  'devis_envoye': 'Devis envoyé',
  'confirme': 'Confirmé',
  'en_cours': 'En cours',
  'solde': 'Soldé',
};

// Map backend seminaire record to frontend SeminaireEvent
function mapFromApi(s: Record<string, unknown>): SeminaireEvent {
  const budget = (s.budget as number) || 0;
  return {
    id: s.id as number,
    clientNom: (s.clientName as string) || '',
    clientEmail: (s.clientEmail as string) || '',
    clientTelephone: (s.clientPhone as string) || '',
    clientEntreprise: '',
    type: (s.eventType as EventType) || 'Autre',
    date: (s.date as string) || '',
    heureDebut: (s.startTime as string) || '',
    heureFin: (s.endTime as string) || '',
    nbConvivesMin: (s.guestCount as number) || 20,
    nbConvivesMax: (s.guestCount as number) || 20,
    salle: '',
    menu: { entree: '', plat: '', dessert: '', prixParPersonne: 0 },
    equipements: (s.equipment as string[]) || [],
    prixParPersonne: (s.guestCount as number) > 0 ? Math.round(budget / (s.guestCount as number)) : 0,
    totalEstime: budget,
    arrhes: Math.round(budget * 0.3),
    arrhesPercent: 30,
    notes: (s.notes as string) || '',
    status: STATUS_TO_FRONTEND[(s.status as string)] || 'Demande',
    timeline: [],
  };
}

// ── Types ──────────────────────────────────────────────────────────────

type EventType = 'Séminaire' | 'Mariage' | 'Anniversaire' | 'Corporate' | 'Autre';
type EventStatus = 'Demande' | 'Devis envoyé' | 'Confirmé' | 'En cours' | 'Soldé';

interface TimelineEntry {
  date: string;
  action: string;
}

interface MenuSelection {
  entree: string;
  plat: string;
  dessert: string;
  prixParPersonne: number;
}

interface SeminaireEvent {
  id: number;
  clientNom: string;
  clientEmail: string;
  clientTelephone: string;
  clientEntreprise: string;
  type: EventType;
  date: string;
  heureDebut: string;
  heureFin: string;
  nbConvivesMin: number;
  nbConvivesMax: number;
  salle: string;
  menu: MenuSelection;
  equipements: string[];
  prixParPersonne: number;
  totalEstime: number;
  arrhes: number;
  arrhesPercent: number;
  notes: string;
  status: EventStatus;
  timeline: TimelineEntry[];
}

// ── Constants ──────────────────────────────────────────────────────────

const STATUS_COLUMNS: EventStatus[] = ['Demande', 'Devis envoyé', 'Confirmé', 'En cours', 'Soldé'];

const STATUS_COLORS: Record<EventStatus, { bg: string; text: string; border: string; dot: string }> = {
  'Demande':       { bg: 'bg-slate-100 dark:bg-slate-700/50', text: 'text-slate-700 dark:text-slate-300', border: 'border-slate-300 dark:border-slate-600', dot: 'bg-slate-400' },
  'Devis envoyé':  { bg: 'bg-amber-100 dark:bg-amber-900/40', text: 'text-amber-700 dark:text-amber-300', border: 'border-amber-300 dark:border-amber-700', dot: 'bg-amber-400' },
  'Confirmé':      { bg: 'bg-blue-100 dark:bg-blue-900/40', text: 'text-blue-700 dark:text-blue-300', border: 'border-blue-300 dark:border-blue-700', dot: 'bg-blue-400' },
  'En cours':      { bg: 'bg-emerald-100 dark:bg-emerald-900/40', text: 'text-emerald-700 dark:text-emerald-300', border: 'border-emerald-300 dark:border-emerald-700', dot: 'bg-emerald-400' },
  'Soldé':         { bg: 'bg-purple-100 dark:bg-purple-900/40', text: 'text-purple-700 dark:text-purple-300', border: 'border-purple-300 dark:border-purple-700', dot: 'bg-purple-400' },
};

const TYPE_COLORS: Record<EventType, string> = {
  'Séminaire':    'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-300',
  'Mariage':      'bg-pink-100 text-pink-700 dark:bg-pink-900/40 dark:text-pink-300',
  'Anniversaire': 'bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-300',
  'Corporate':    'bg-cyan-100 text-cyan-700 dark:bg-cyan-900/40 dark:text-cyan-300',
  'Autre':        'bg-slate-100 text-slate-700 dark:bg-slate-700/40 dark:text-slate-300',
};

const EVENT_TYPES: EventType[] = ['Séminaire', 'Mariage', 'Anniversaire', 'Corporate', 'Autre'];
const SALLES = ['Salle principale', 'Terrasse', 'Salon privé', 'Salle de réunion'];
const EQUIPEMENTS = [
  { id: 'videoprojecteur', label: 'Vidéoprojecteur', icon: Monitor },
  { id: 'sono', label: 'Sono', icon: Music },
  { id: 'micro', label: 'Micro', icon: Mic },
  { id: 'ecran', label: 'Écran', icon: Tv },
  { id: 'decoration', label: 'Décoration florale', icon: Flower2 },
  { id: 'photobooth', label: 'Photobooth', icon: Camera },
];

// (mock data removed — loaded from API)

// ── Helpers ──────────────────────────────────────────────────────────

function formatDate(dateStr: string): string {
  const d = new Date(dateStr + 'T00:00:00');
  return d.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' });
}

function formatDateShort(dateStr: string): string {
  const d = new Date(dateStr + 'T00:00:00');
  return d.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' });
}

function formatEuro(n: number): string {
  return n.toLocaleString('fr-FR', { style: 'currency', currency: 'EUR', minimumFractionDigits: 0, maximumFractionDigits: 0 });
}

function getDaysInMonth(year: number, month: number): number {
  return new Date(year, month + 1, 0).getDate();
}

function getFirstDayOfMonth(year: number, month: number): number {
  const d = new Date(year, month, 1).getDay();
  return d === 0 ? 6 : d - 1; // Monday-based
}

// ── Component ──────────────────────────────────────────────────────────

export default function Seminaires() {
  const { showToast } = useToast();

  const [events, setEvents] = useState<SeminaireEvent[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchEvents = useCallback(async () => {
    try {
      const res = await fetch(`${API}/api/seminaires`, { headers: authHeaders() });
      if (!res.ok) throw new Error('fetch failed');
      const data = await res.json();
      setEvents(data.map(mapFromApi));
    } catch {
      showToast('Erreur chargement séminaires', 'error');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchEvents(); }, [fetchEvents]);
  const [viewMode, setViewMode] = useState<'kanban' | 'calendar'>('kanban');
  const [searchQuery, setSearchQuery] = useState('');
  const [showNewModal, setShowNewModal] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<SeminaireEvent | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [calendarMonth, setCalendarMonth] = useState(() => new Date().getMonth());
  const [calendarYear, setCalendarYear] = useState(() => new Date().getFullYear());

  // ── New event form state ──
  const emptyForm = {
    clientNom: '', clientEmail: '', clientTelephone: '', clientEntreprise: '',
    type: 'Séminaire' as EventType, date: '', heureDebut: '09:00', heureFin: '17:00',
    nbConvivesMin: 10, nbConvivesMax: 20, salle: 'Salle principale',
    menuEntree: '', menuPlat: '', menuDessert: '', menuPrix: 50,
    equipements: [] as string[],
    prixParPersonne: 50, arrhesPercent: 30,
    notes: '',
  };
  const [form, setForm] = useState(emptyForm);

  // ── Filtered events ──
  const filtered = useMemo(() => {
    if (!searchQuery.trim()) return events;
    const q = searchQuery.toLowerCase();
    return events.filter(e =>
      e.clientNom.toLowerCase().includes(q) ||
      e.clientEntreprise.toLowerCase().includes(q) ||
      e.type.toLowerCase().includes(q) ||
      e.salle.toLowerCase().includes(q)
    );
  }, [events, searchQuery]);

  // ── Summary cards ──
  const now = new Date();
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();

  const thisMonthEvents = events.filter(e => {
    const d = new Date(e.date + 'T00:00:00');
    return d.getMonth() === currentMonth && d.getFullYear() === currentYear;
  });

  const caPrevi = events
    .filter(e => ['Confirmé', 'En cours', 'Soldé'].includes(e.status))
    .reduce((s, e) => s + e.totalEstime, 0);

  const tauxConversion = events.length > 0
    ? Math.round((events.filter(e => ['Confirmé', 'En cours', 'Soldé'].includes(e.status)).length / events.length) * 100)
    : 0;

  const prochainEvent = events
    .filter(e => e.date >= now.toISOString().slice(0, 10) && e.status !== 'Soldé')
    .sort((a, b) => a.date.localeCompare(b.date))[0] || null;

  // ── Move event to next/prev status ──
  async function moveEvent(id: number, direction: 'next' | 'prev') {
    const ev = events.find(e => e.id === id);
    if (!ev) return;
    const idx = STATUS_COLUMNS.indexOf(ev.status);
    const newIdx = direction === 'next' ? Math.min(idx + 1, STATUS_COLUMNS.length - 1) : Math.max(idx - 1, 0);
    if (newIdx === idx) return;
    const newStatus = STATUS_COLUMNS[newIdx];
    try {
      await fetch(`${API}/api/seminaires/${id}`, {
        method: 'PUT',
        headers: authHeaders(),
        body: JSON.stringify({ status: STATUS_TO_BACKEND[newStatus] }),
      });
      setEvents(prev => prev.map(e => e.id === id ? { ...e, status: newStatus } : e));
      showToast('Statut mis à jour', 'success');
    } catch {
      showToast('Erreur mise à jour statut', 'error');
    }
  }

  // ── Create event ──
  async function handleCreate() {
    if (!form.clientNom || !form.date) {
      showToast('Veuillez remplir le nom du client et la date', 'error');
      return;
    }
    const total = form.prixParPersonne * form.nbConvivesMax;
    const menuStr = [form.menuEntree, form.menuPlat, form.menuDessert].filter(Boolean).join(' / ');
    try {
      const res = await fetch(`${API}/api/seminaires`, {
        method: 'POST',
        headers: authHeaders(),
        body: JSON.stringify({
          title: `${form.type} - ${form.clientNom}`,
          clientName: form.clientNom,
          clientEmail: form.clientEmail || null,
          clientPhone: form.clientTelephone || null,
          eventType: form.type,
          date: form.date,
          startTime: form.heureDebut || null,
          endTime: form.heureFin || null,
          guestCount: form.nbConvivesMax,
          budget: total,
          menuDetails: menuStr || null,
          equipment: form.equipements,
          notes: form.notes || null,
        }),
      });
      if (!res.ok) throw new Error('create failed');
      const created = await res.json();
      setEvents(prev => [mapFromApi(created), ...prev]);
      setForm(emptyForm);
      setShowNewModal(false);
      showToast('Événement créé avec succès', 'success');
    } catch {
      showToast('Erreur création événement', 'error');
    }
  }

  // ── Status actions ──
  async function handleStatusAction(event: SeminaireEvent, action: string) {
    let newStatus: EventStatus = event.status;
    switch (action) {
      case 'envoyer_devis': newStatus = 'Devis envoyé'; break;
      case 'confirmer': newStatus = 'Confirmé'; break;
      case 'annuler': newStatus = 'Demande'; break;
      case 'solder': newStatus = 'Soldé'; break;
    }
    try {
      await fetch(`${API}/api/seminaires/${event.id}`, {
        method: 'PUT',
        headers: authHeaders(),
        body: JSON.stringify({ status: STATUS_TO_BACKEND[newStatus] }),
      });
      setEvents(prev => prev.map(e => e.id === event.id ? { ...e, status: newStatus } : e));
      showToast('Action effectuée', 'success');
    } catch {
      showToast('Erreur mise à jour statut', 'error');
    }
    setShowDetailModal(false);
    setSelectedEvent(null);
  }

  // ── Delete event ──
  async function handleDelete(id: number) {
    try {
      await fetch(`${API}/api/seminaires/${id}`, { method: 'DELETE', headers: authHeaders() });
      setEvents(prev => prev.filter(e => e.id !== id));
      setShowDetailModal(false);
      setSelectedEvent(null);
      showToast('Événement supprimé', 'success');
    } catch {
      showToast('Erreur suppression', 'error');
    }
  }

  // ── Toggle equipment in form ──
  function toggleEquipement(eqId: string) {
    setForm(prev => ({
      ...prev,
      equipements: prev.equipements.includes(eqId)
        ? prev.equipements.filter(x => x !== eqId)
        : [...prev.equipements, eqId],
    }));
  }

  // ── Calendar data ──
  const calendarEvents = useMemo(() => {
    const map: Record<string, SeminaireEvent[]> = {};
    filtered.forEach(e => {
      if (!map[e.date]) map[e.date] = [];
      map[e.date].push(e);
    });
    return map;
  }, [filtered]);

  const daysInMonth = getDaysInMonth(calendarYear, calendarMonth);
  const firstDay = getFirstDayOfMonth(calendarYear, calendarMonth);
  const monthLabel = new Date(calendarYear, calendarMonth).toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' });

  function prevMonth() {
    if (calendarMonth === 0) { setCalendarMonth(11); setCalendarYear(y => y - 1); }
    else setCalendarMonth(m => m - 1);
  }
  function nextMonth() {
    if (calendarMonth === 11) { setCalendarMonth(0); setCalendarYear(y => y + 1); }
    else setCalendarMonth(m => m + 1);
  }

  // ═════════════════════════════════════════════════════════════════════
  // RENDER
  // ═════════════════════════════════════════════════════════════════════

  return (
    <div className="space-y-6">
      {/* ── Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <PartyPopper className="w-7 h-7 text-blue-600 dark:text-blue-400" />
            Séminaires & Groupes
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Gérez vos événements, devis et réservations de groupe
          </p>
        </div>
        <div className="flex items-center gap-3">
          {/* View toggle */}
          <div className="flex bg-slate-100 dark:bg-slate-800 rounded-lg p-0.5">
            <button
              onClick={() => setViewMode('kanban')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                viewMode === 'kanban' ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm' : 'text-slate-500 dark:text-slate-400'
              }`}
            >
              <LayoutGrid className="w-4 h-4" /> Kanban
            </button>
            <button
              onClick={() => setViewMode('calendar')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                viewMode === 'calendar' ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm' : 'text-slate-500 dark:text-slate-400'
              }`}
            >
              <Calendar className="w-4 h-4" /> Calendrier
            </button>
          </div>
          <button
            onClick={() => { setForm(emptyForm); setShowNewModal(true); }}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-semibold transition-colors shadow-sm"
          >
            <Plus className="w-4 h-4" /> Nouvel événement
          </button>
        </div>
      </div>

      {/* ── Summary Cards ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-blue-100 dark:bg-blue-900/40 flex items-center justify-center">
              <CalendarDays className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Événements ce mois</p>
              <p className="text-2xl font-bold text-slate-900 dark:text-white">{thisMonthEvents.length}</p>
            </div>
          </div>
        </div>
        <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-emerald-100 dark:bg-emerald-900/40 flex items-center justify-center">
              <Euro className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
            </div>
            <div>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">CA prévisionnel</p>
              <p className="text-2xl font-bold text-slate-900 dark:text-white">{formatEuro(caPrevi)}</p>
            </div>
          </div>
        </div>
        <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-amber-100 dark:bg-amber-900/40 flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-amber-600 dark:text-amber-400" />
            </div>
            <div>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Taux de conversion</p>
              <p className="text-2xl font-bold text-slate-900 dark:text-white">{tauxConversion}%</p>
            </div>
          </div>
        </div>
        <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-purple-100 dark:bg-purple-900/40 flex items-center justify-center">
              <Clock className="w-5 h-5 text-purple-600 dark:text-purple-400" />
            </div>
            <div>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Prochain événement</p>
              {prochainEvent ? (
                <p className="text-sm font-bold text-slate-900 dark:text-white truncate">
                  {formatDateShort(prochainEvent.date)} — {prochainEvent.clientNom.split(' ')[0]}
                </p>
              ) : (
                <p className="text-sm text-slate-400 dark:text-slate-500">Aucun</p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ── Search bar ── */}
      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
        <input
          type="text"
          placeholder="Rechercher un événement..."
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          className="w-full pl-9 pr-4 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* ═══════════ KANBAN VIEW ═══════════ */}
      {viewMode === 'kanban' && (
        <div className="flex gap-4 overflow-x-auto pb-4 -mx-4 px-4 sm:mx-0 sm:px-0">
          {STATUS_COLUMNS.map(status => {
            const col = STATUS_COLORS[status];
            const columnEvents = filtered.filter(e => e.status === status);
            return (
              <div key={status} className="flex-shrink-0 w-72">
                {/* Column header */}
                <div className={`flex items-center gap-2 px-3 py-2 rounded-t-xl border ${col.border} ${col.bg}`}>
                  <div className={`w-2.5 h-2.5 rounded-full ${col.dot}`} />
                  <span className={`text-sm font-semibold ${col.text}`}>{status}</span>
                  <span className={`ml-auto text-xs font-medium px-2 py-0.5 rounded-full ${col.bg} ${col.text}`}>
                    {columnEvents.length}
                  </span>
                </div>
                {/* Cards */}
                <div className={`border-x border-b ${col.border} rounded-b-xl bg-slate-50 dark:bg-slate-900/50 p-2 space-y-2 min-h-[200px]`}>
                  {columnEvents.length === 0 && (
                    <div className="text-xs text-slate-400 dark:text-slate-500 text-center py-8">Aucun événement</div>
                  )}
                  {columnEvents.map(ev => (
                    <div
                      key={ev.id}
                      onClick={() => { setSelectedEvent(ev); setShowDetailModal(true); }}
                      className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-3 cursor-pointer hover:shadow-md hover:border-blue-300 dark:hover:border-blue-600 transition-all group"
                    >
                      {/* Type badge */}
                      <span className={`inline-block text-[10px] font-semibold px-2 py-0.5 rounded-full mb-2 ${TYPE_COLORS[ev.type]}`}>
                        {ev.type}
                      </span>
                      {/* Client */}
                      <h4 className="text-sm font-semibold text-slate-900 dark:text-white truncate">{ev.clientNom}</h4>
                      {ev.clientEntreprise && (
                        <p className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1 mt-0.5">
                          <Building2 className="w-3 h-3" /> {ev.clientEntreprise}
                        </p>
                      )}
                      {/* Info row */}
                      <div className="flex items-center gap-3 mt-2 text-xs text-slate-500 dark:text-slate-400">
                        <span className="flex items-center gap-1">
                          <CalendarDays className="w-3 h-3" /> {formatDateShort(ev.date)}
                        </span>
                        <span className="flex items-center gap-1">
                          <Users className="w-3 h-3" /> {ev.nbConvivesMax}
                        </span>
                      </div>
                      {/* Amount */}
                      <div className="flex items-center justify-between mt-2">
                        <span className="text-sm font-bold text-slate-900 dark:text-white">{formatEuro(ev.totalEstime)}</span>
                        {/* Move arrows */}
                        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          {STATUS_COLUMNS.indexOf(ev.status) > 0 && (
                            <button
                              onClick={e2 => { e2.stopPropagation(); moveEvent(ev.id, 'prev'); }}
                              className="p-1 rounded hover:bg-slate-100 dark:hover:bg-slate-700"
                              title="Reculer"
                            >
                              <ChevronLeft className="w-3.5 h-3.5" />
                            </button>
                          )}
                          {STATUS_COLUMNS.indexOf(ev.status) < STATUS_COLUMNS.length - 1 && (
                            <button
                              onClick={e2 => { e2.stopPropagation(); moveEvent(ev.id, 'next'); }}
                              className="p-1 rounded hover:bg-slate-100 dark:hover:bg-slate-700"
                              title="Avancer"
                            >
                              <ArrowRight className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ═══════════ CALENDAR VIEW ═══════════ */}
      {viewMode === 'calendar' && (
        <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden">
          {/* Month nav */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-slate-700">
            <button onClick={prevMonth} className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors">
              <ChevronLeft className="w-5 h-5 text-slate-600 dark:text-slate-300" />
            </button>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white capitalize">{monthLabel}</h2>
            <button onClick={nextMonth} className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors">
              <ChevronRight className="w-5 h-5 text-slate-600 dark:text-slate-300" />
            </button>
          </div>
          {/* Days header */}
          <div className="grid grid-cols-7 border-b border-slate-200 dark:border-slate-700">
            {['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'].map(d => (
              <div key={d} className="text-center text-xs font-semibold text-slate-500 dark:text-slate-400 py-2">{d}</div>
            ))}
          </div>
          {/* Calendar grid */}
          <div className="grid grid-cols-7">
            {/* Empty cells before first day */}
            {Array.from({ length: firstDay }).map((_, i) => (
              <div key={`e${i}`} className="min-h-[100px] border-b border-r border-slate-100 dark:border-slate-700/50" />
            ))}
            {/* Day cells */}
            {Array.from({ length: daysInMonth }).map((_, i) => {
              const day = i + 1;
              const dateStr = `${calendarYear}-${String(calendarMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
              const dayEvents = calendarEvents[dateStr] || [];
              const isToday = dateStr === now.toISOString().slice(0, 10);
              return (
                <div
                  key={day}
                  className={`min-h-[100px] border-b border-r border-slate-100 dark:border-slate-700/50 p-1.5 ${
                    isToday ? 'bg-blue-50/50 dark:bg-blue-900/10' : ''
                  }`}
                >
                  <span className={`text-xs font-medium ${isToday ? 'bg-blue-600 text-white px-1.5 py-0.5 rounded-full' : 'text-slate-600 dark:text-slate-400'}`}>
                    {day}
                  </span>
                  <div className="mt-1 space-y-1">
                    {dayEvents.slice(0, 3).map(ev => (
                      <button
                        key={ev.id}
                        onClick={() => { setSelectedEvent(ev); setShowDetailModal(true); }}
                        className={`w-full text-left text-[10px] leading-tight px-1.5 py-1 rounded truncate font-medium ${TYPE_COLORS[ev.type]} hover:opacity-80 transition-opacity`}
                      >
                        {ev.clientNom.split(' ')[0]} ({ev.nbConvivesMax})
                      </button>
                    ))}
                    {dayEvents.length > 3 && (
                      <span className="text-[10px] text-slate-400 dark:text-slate-500 pl-1">+{dayEvents.length - 3} autres</span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ═══════════ NEW EVENT MODAL ═══════════ */}
      <Modal isOpen={showNewModal} onClose={() => setShowNewModal(false)} title="Nouvel événement" className="max-w-3xl">
        <div className="space-y-6">
          {/* Client info */}
          <div>
            <h4 className="text-sm font-bold text-slate-700 dark:text-slate-200 mb-3 flex items-center gap-2">
              <Users className="w-4 h-4" /> Informations client
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">Nom *</label>
                <input
                  value={form.clientNom}
                  onChange={e => setForm(f => ({ ...f, clientNom: e.target.value }))}
                  placeholder="Nom du client"
                  className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">Entreprise</label>
                <input
                  value={form.clientEntreprise}
                  onChange={e => setForm(f => ({ ...f, clientEntreprise: e.target.value }))}
                  placeholder="Nom de l'entreprise"
                  className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">Email</label>
                <input
                  type="email"
                  value={form.clientEmail}
                  onChange={e => setForm(f => ({ ...f, clientEmail: e.target.value }))}
                  placeholder="email@exemple.com"
                  className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">Téléphone</label>
                <input
                  value={form.clientTelephone}
                  onChange={e => setForm(f => ({ ...f, clientTelephone: e.target.value }))}
                  placeholder="06 12 34 56 78"
                  className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>

          {/* Event details */}
          <div>
            <h4 className="text-sm font-bold text-slate-700 dark:text-slate-200 mb-3 flex items-center gap-2">
              <CalendarDays className="w-4 h-4" /> Détails de l'événement
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">Type *</label>
                <select
                  value={form.type}
                  onChange={e => setForm(f => ({ ...f, type: e.target.value as EventType }))}
                  className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {EVENT_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">Date *</label>
                <input
                  type="date"
                  value={form.date}
                  onChange={e => setForm(f => ({ ...f, date: e.target.value }))}
                  className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">Heure début</label>
                <input
                  type="time"
                  value={form.heureDebut}
                  onChange={e => setForm(f => ({ ...f, heureDebut: e.target.value }))}
                  className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">Heure fin</label>
                <input
                  type="time"
                  value={form.heureFin}
                  onChange={e => setForm(f => ({ ...f, heureFin: e.target.value }))}
                  className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">Nb convives (min)</label>
                <input
                  type="number"
                  value={form.nbConvivesMin}
                  onChange={e => setForm(f => ({ ...f, nbConvivesMin: +e.target.value }))}
                  className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">Nb convives (max)</label>
                <input
                  type="number"
                  value={form.nbConvivesMax}
                  onChange={e => setForm(f => ({ ...f, nbConvivesMax: +e.target.value }))}
                  className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">Salle / Espace</label>
                <select
                  value={form.salle}
                  onChange={e => setForm(f => ({ ...f, salle: e.target.value }))}
                  className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {SALLES.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
            </div>
          </div>

          {/* Menu */}
          <div>
            <h4 className="text-sm font-bold text-slate-700 dark:text-slate-200 mb-3 flex items-center gap-2">
              <Utensils className="w-4 h-4" /> Menu
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">Entrée</label>
                <input
                  value={form.menuEntree}
                  onChange={e => setForm(f => ({ ...f, menuEntree: e.target.value }))}
                  placeholder="Ex: Salade César"
                  className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">Plat</label>
                <input
                  value={form.menuPlat}
                  onChange={e => setForm(f => ({ ...f, menuPlat: e.target.value }))}
                  placeholder="Ex: Filet de boeuf"
                  className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">Dessert</label>
                <input
                  value={form.menuDessert}
                  onChange={e => setForm(f => ({ ...f, menuDessert: e.target.value }))}
                  placeholder="Ex: Fondant chocolat"
                  className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>

          {/* Équipements */}
          <div>
            <h4 className="text-sm font-bold text-slate-700 dark:text-slate-200 mb-3 flex items-center gap-2">
              <Monitor className="w-4 h-4" /> Équipements
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {EQUIPEMENTS.map(eq => (
                <label
                  key={eq.id}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg border cursor-pointer transition-colors ${
                    form.equipements.includes(eq.id)
                      ? 'bg-blue-50 dark:bg-blue-900/30 border-blue-300 dark:border-blue-600 text-blue-700 dark:text-blue-300'
                      : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:border-slate-300 dark:hover:border-slate-600'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={form.equipements.includes(eq.id)}
                    onChange={() => toggleEquipement(eq.id)}
                    className="sr-only"
                  />
                  <eq.icon className="w-4 h-4 flex-shrink-0" />
                  <span className="text-xs font-medium">{eq.label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Budget */}
          <div>
            <h4 className="text-sm font-bold text-slate-700 dark:text-slate-200 mb-3 flex items-center gap-2">
              <Euro className="w-4 h-4" /> Budget
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">Prix / personne (€)</label>
                <input
                  type="number"
                  value={form.prixParPersonne}
                  onChange={e => setForm(f => ({ ...f, prixParPersonne: +e.target.value }))}
                  className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">Total estimé</label>
                <div className="px-3 py-2 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-lg text-sm font-bold text-slate-900 dark:text-white">
                  {formatEuro(form.prixParPersonne * form.nbConvivesMax)}
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">Arrhes ({form.arrhesPercent}%)</label>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    min={0}
                    max={100}
                    value={form.arrhesPercent}
                    onChange={e => setForm(f => ({ ...f, arrhesPercent: +e.target.value }))}
                    className="w-20 px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <span className="text-sm text-slate-500 dark:text-slate-400">%</span>
                  <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                    = {formatEuro(Math.round(form.prixParPersonne * form.nbConvivesMax * form.arrhesPercent / 100))}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">Notes internes</label>
            <textarea
              value={form.notes}
              onChange={e => setForm(f => ({ ...f, notes: e.target.value }))}
              rows={3}
              placeholder="Informations complémentaires, allergies, demandes spéciales..."
              className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            />
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-2 border-t border-slate-200 dark:border-slate-700">
            <button
              onClick={() => setShowNewModal(false)}
              className="px-4 py-2 text-sm font-medium text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"
            >
              Annuler
            </button>
            <button
              onClick={handleCreate}
              className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-semibold transition-colors"
            >
              Créer l'événement
            </button>
          </div>
        </div>
      </Modal>

      {/* ═══════════ EVENT DETAIL MODAL ═══════════ */}
      {selectedEvent && (
        <Modal
          isOpen={showDetailModal}
          onClose={() => { setShowDetailModal(false); setSelectedEvent(null); }}
          title={selectedEvent.clientNom}
          className="max-w-3xl"
        >
          {(() => {
            const ev = selectedEvent;
            const col = STATUS_COLORS[ev.status];
            return (
              <div className="space-y-6">
                {/* Status + type */}
                <div className="flex items-center gap-3 flex-wrap">
                  <span className={`inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1 rounded-full ${col.bg} ${col.text}`}>
                    <span className={`w-2 h-2 rounded-full ${col.dot}`} />
                    {ev.status}
                  </span>
                  <span className={`text-xs font-semibold px-3 py-1 rounded-full ${TYPE_COLORS[ev.type]}`}>
                    {ev.type}
                  </span>
                </div>

                {/* Client info */}
                <div className="bg-slate-50 dark:bg-slate-900/50 rounded-lg p-4 space-y-2">
                  <h4 className="text-sm font-bold text-slate-700 dark:text-slate-200">Client</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
                    <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
                      <Users className="w-4 h-4 text-slate-400" /> {ev.clientNom}
                    </div>
                    {ev.clientEntreprise && (
                      <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
                        <Building2 className="w-4 h-4 text-slate-400" /> {ev.clientEntreprise}
                      </div>
                    )}
                    <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
                      <Mail className="w-4 h-4 text-slate-400" /> {ev.clientEmail}
                    </div>
                    <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
                      <Phone className="w-4 h-4 text-slate-400" /> {ev.clientTelephone}
                    </div>
                  </div>
                </div>

                {/* Event details */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <div className="text-center p-3 bg-slate-50 dark:bg-slate-900/50 rounded-lg">
                    <CalendarDays className="w-5 h-5 text-blue-500 mx-auto mb-1" />
                    <p className="text-xs text-slate-500 dark:text-slate-400">Date</p>
                    <p className="text-sm font-bold text-slate-900 dark:text-white">{formatDate(ev.date)}</p>
                  </div>
                  <div className="text-center p-3 bg-slate-50 dark:bg-slate-900/50 rounded-lg">
                    <Clock className="w-5 h-5 text-amber-500 mx-auto mb-1" />
                    <p className="text-xs text-slate-500 dark:text-slate-400">Horaire</p>
                    <p className="text-sm font-bold text-slate-900 dark:text-white">{ev.heureDebut} - {ev.heureFin}</p>
                  </div>
                  <div className="text-center p-3 bg-slate-50 dark:bg-slate-900/50 rounded-lg">
                    <Users className="w-5 h-5 text-emerald-500 mx-auto mb-1" />
                    <p className="text-xs text-slate-500 dark:text-slate-400">Convives</p>
                    <p className="text-sm font-bold text-slate-900 dark:text-white">{ev.nbConvivesMin} - {ev.nbConvivesMax}</p>
                  </div>
                  <div className="text-center p-3 bg-slate-50 dark:bg-slate-900/50 rounded-lg">
                    <MapPin className="w-5 h-5 text-purple-500 mx-auto mb-1" />
                    <p className="text-xs text-slate-500 dark:text-slate-400">Salle</p>
                    <p className="text-sm font-bold text-slate-900 dark:text-white">{ev.salle}</p>
                  </div>
                </div>

                {/* Menu */}
                <div>
                  <h4 className="text-sm font-bold text-slate-700 dark:text-slate-200 mb-2 flex items-center gap-2">
                    <Utensils className="w-4 h-4" /> Menu
                  </h4>
                  <div className="bg-slate-50 dark:bg-slate-900/50 rounded-lg p-4">
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-sm">
                      <div>
                        <p className="text-xs text-slate-500 dark:text-slate-400 font-medium mb-0.5">Entrée</p>
                        <p className="text-slate-900 dark:text-white">{ev.menu.entree || '—'}</p>
                      </div>
                      <div>
                        <p className="text-xs text-slate-500 dark:text-slate-400 font-medium mb-0.5">Plat</p>
                        <p className="text-slate-900 dark:text-white">{ev.menu.plat || '—'}</p>
                      </div>
                      <div>
                        <p className="text-xs text-slate-500 dark:text-slate-400 font-medium mb-0.5">Dessert</p>
                        <p className="text-slate-900 dark:text-white">{ev.menu.dessert || '—'}</p>
                      </div>
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">
                      {formatEuro(ev.prixParPersonne)} / personne
                    </p>
                  </div>
                </div>

                {/* Équipements */}
                {ev.equipements.length > 0 && (
                  <div>
                    <h4 className="text-sm font-bold text-slate-700 dark:text-slate-200 mb-2">Équipements</h4>
                    <div className="flex flex-wrap gap-2">
                      {ev.equipements.map(eqId => {
                        const eq = EQUIPEMENTS.find(x => x.id === eqId);
                        if (!eq) return null;
                        return (
                          <span key={eqId} className="inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-700/50 text-slate-600 dark:text-slate-300">
                            <eq.icon className="w-3.5 h-3.5" /> {eq.label}
                          </span>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Budget summary */}
                <div className="grid grid-cols-3 gap-4 bg-emerald-50 dark:bg-emerald-900/20 rounded-lg p-4 border border-emerald-200 dark:border-emerald-800">
                  <div className="text-center">
                    <p className="text-xs text-emerald-600 dark:text-emerald-400 font-medium">Total estimé</p>
                    <p className="text-lg font-bold text-emerald-700 dark:text-emerald-300">{formatEuro(ev.totalEstime)}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-xs text-emerald-600 dark:text-emerald-400 font-medium">Arrhes ({ev.arrhesPercent}%)</p>
                    <p className="text-lg font-bold text-emerald-700 dark:text-emerald-300">{formatEuro(ev.arrhes)}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-xs text-emerald-600 dark:text-emerald-400 font-medium">Solde restant</p>
                    <p className="text-lg font-bold text-emerald-700 dark:text-emerald-300">{formatEuro(ev.totalEstime - ev.arrhes)}</p>
                  </div>
                </div>

                {/* Notes */}
                {ev.notes && (
                  <div>
                    <h4 className="text-sm font-bold text-slate-700 dark:text-slate-200 mb-2 flex items-center gap-2">
                      <FileText className="w-4 h-4" /> Notes internes
                    </h4>
                    <p className="text-sm text-slate-600 dark:text-slate-300 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg p-3">
                      {ev.notes}
                    </p>
                  </div>
                )}

                {/* Timeline */}
                <div>
                  <h4 className="text-sm font-bold text-slate-700 dark:text-slate-200 mb-3">Historique</h4>
                  <div className="space-y-0">
                    {ev.timeline.map((entry, i) => (
                      <div key={i} className="flex gap-3">
                        <div className="flex flex-col items-center">
                          <div className="w-2.5 h-2.5 rounded-full bg-blue-500 mt-1.5 flex-shrink-0" />
                          {i < ev.timeline.length - 1 && <div className="w-px flex-1 bg-slate-200 dark:bg-slate-700 my-1" />}
                        </div>
                        <div className="pb-3">
                          <p className="text-xs text-slate-400 dark:text-slate-500">{formatDate(entry.date)}</p>
                          <p className="text-sm text-slate-700 dark:text-slate-200">{entry.action}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Action buttons */}
                <div className="flex flex-wrap gap-2 pt-3 border-t border-slate-200 dark:border-slate-700">
                  {ev.status === 'Demande' && (
                    <button
                      onClick={() => handleStatusAction(ev, 'envoyer_devis')}
                      className="flex items-center gap-2 px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white rounded-lg text-sm font-semibold transition-colors"
                    >
                      <Send className="w-4 h-4" /> Envoyer devis
                    </button>
                  )}
                  {(ev.status === 'Devis envoyé' || ev.status === 'Demande') && (
                    <button
                      onClick={() => handleStatusAction(ev, 'confirmer')}
                      className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-semibold transition-colors"
                    >
                      <CheckCircle2 className="w-4 h-4" /> Confirmer
                    </button>
                  )}
                  {ev.status !== 'Soldé' && ev.status !== 'Demande' && (
                    <button
                      onClick={() => handleStatusAction(ev, 'annuler')}
                      className="flex items-center gap-2 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg text-sm font-semibold transition-colors"
                    >
                      <XCircle className="w-4 h-4" /> Annuler
                    </button>
                  )}
                  {(ev.status === 'Confirmé' || ev.status === 'En cours') && (
                    <button
                      onClick={() => handleStatusAction(ev, 'solder')}
                      className="flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-sm font-semibold transition-colors"
                    >
                      <DollarSign className="w-4 h-4" /> Marquer soldé
                    </button>
                  )}
                  {/* BEO Print */}
                  <button
                    onClick={() => {
                      showToast('Impression du BEO en cours...', 'info');
                      setTimeout(() => window.print(), 300);
                    }}
                    className="flex items-center gap-2 px-4 py-2 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 rounded-lg text-sm font-semibold transition-colors ml-auto"
                  >
                    <Printer className="w-4 h-4" /> BEO
                  </button>
                  <button
                    onClick={() => handleDelete(ev.id)}
                    className="flex items-center gap-2 px-4 py-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg text-sm font-medium transition-colors"
                  >
                    <Trash2 className="w-4 h-4" /> Supprimer
                  </button>
                </div>
              </div>
            );
          })()}
        </Modal>
      )}
    </div>
  );
}
