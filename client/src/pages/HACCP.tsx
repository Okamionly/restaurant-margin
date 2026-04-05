import { useState, useMemo, useEffect, useCallback } from 'react';
import {
  Thermometer, Plus, ShieldCheck, AlertTriangle, Clock,
  CheckCircle2, XCircle, Package, SprayCan, BarChart3, Search,
  Wrench, Calendar, Download, ChevronRight
} from 'lucide-react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Legend, ReferenceLine
} from 'recharts';
import { useTranslation } from '../hooks/useTranslation';

// ─── Types ───────────────────────────────────────────────────────────────────

interface TemperatureRecord {
  id: number;
  zone: 'frigo' | 'congelateur' | 'plat_chaud' | 'reception';
  temperature: number;
  timestamp: string;
  agent: string;
  notes: string;
}

interface LotRecord {
  id: number;
  lotNumber: string;
  product: string;
  supplier: string;
  receptionDate: string;
  dlc: string;
  ddm: string;
  status: 'conforme' | 'non_conforme' | 'en_attente';
}

interface DluoAlert {
  id: number;
  product: string;
  lotNumber: string;
  dlc: string;
  daysRemaining: number;
  quantity: string;
}

interface CleaningRecord {
  id: number;
  zone: string;
  date: string;
  time: string;
  agent: string;
  verified: boolean;
}

interface CorrectiveAction {
  id: number;
  type: 'temperature' | 'cleaning' | 'traceability' | 'other';
  description: string;
  responsiblePerson: string;
  deadline: string;
  status: 'ouvert' | 'en_cours' | 'resolu';
  resolution?: string;
  createdAt: string;
}

interface ComplianceReport {
  generatedAt: string;
  period: { weekStart: string; monthStart: string; today: string };
  temperatures: {
    weekCount: number;
    monthCount: number;
    weekNonConformes: number;
    monthNonConformes: number;
    nonConformitiesList: { id: number; zone: string; temperature: number; date: string; time: string }[];
  };
  cleanings: { weekTotal: number; weekDone: number; monthTotal: number; monthDone: number };
  compliance: { score: number; requiredChecks: number; completedChecks: number; missingTempDays: string[] };
  calendarHeatmap: { date: string; hasTemp: boolean; hasCleaning: boolean; complete: boolean }[];
  correctiveActions: { total: number; open: number; inProgress: number; resolved: number };
}

type TabKey = 'dashboard' | 'temperatures' | 'lots' | 'alertes' | 'nettoyage' | 'conformite' | 'actions';

// ─── Constants ───────────────────────────────────────────────────────────────

const ZONE_LABELS: Record<string, string> = {
  frigo: 'Frigo (+)',
  congelateur: 'Congelateur (-)',
  plat_chaud: 'Plats chauds',
  reception: 'Reception marchandise',
};

const STATUS_LABELS: Record<string, string> = {
  conforme: 'Conforme',
  non_conforme: 'Non conforme',
  en_attente: 'En attente',
};

const STATUS_BADGE: Record<string, string> = {
  conforme: 'bg-emerald-900/40 text-emerald-300 border border-emerald-700/50',
  non_conforme: 'bg-red-900/40 text-red-300 border border-red-700/50',
  en_attente: 'bg-amber-900/40 text-amber-300 border border-amber-700/50',
};

const ACTION_STATUS_BADGE: Record<string, string> = {
  ouvert: 'bg-red-900/40 text-red-300 border border-red-700/50',
  en_cours: 'bg-amber-900/40 text-amber-300 border border-amber-700/50',
  resolu: 'bg-emerald-900/40 text-emerald-300 border border-emerald-700/50',
};

const ACTION_STATUS_LABELS: Record<string, string> = {
  ouvert: 'Ouvert',
  en_cours: 'En cours',
  resolu: 'Resolu',
};

const ACTION_TYPE_LABELS: Record<string, string> = {
  temperature: 'Temperature',
  cleaning: 'Nettoyage',
  traceability: 'Tracabilite',
  other: 'Autre',
};

// ─── Helpers ─────────────────────────────────────────────────────────────────

function getTempColor(zone: string, temp: number): 'emerald' | 'amber' | 'red' | 'slate' {
  if (zone === 'congelateur') return temp <= -18 ? 'emerald' : temp <= -15 ? 'amber' : 'red';
  if (zone === 'frigo') return temp < 4 ? 'emerald' : temp <= 7 ? 'amber' : 'red';
  if (zone === 'plat_chaud') return temp >= 63 ? 'emerald' : temp >= 55 ? 'amber' : 'red';
  return 'slate';
}

const TEMP_TEXT: Record<string, string> = { emerald: 'text-emerald-400', amber: 'text-amber-400', red: 'text-red-400', slate: 'text-[#9CA3AF] dark:text-[#737373]' };
const TEMP_BADGE: Record<string, string> = { emerald: 'bg-emerald-900/40 text-emerald-300', amber: 'bg-amber-900/40 text-amber-300', red: 'bg-red-900/40 text-red-300', slate: 'bg-[#FAFAFA] dark:bg-[#0A0A0A] text-[#6B7280] dark:text-[#A3A3A3]' };
const TEMP_STATUS: Record<string, string> = { emerald: 'OK', amber: 'Attention', red: 'Danger', slate: '-' };

const ZONE_CHART_COLORS: Record<string, string> = {
  frigo: '#2563eb',
  congelateur: '#7c3aed',
  plat_chaud: '#d97706',
  reception: '#059669',
};

function getDluoBadge(days: number) {
  if (days <= 1) return 'bg-red-900/40 text-red-300 border border-red-700/50';
  if (days <= 3) return 'bg-amber-900/40 text-amber-300 border border-amber-700/50';
  return 'bg-emerald-900/40 text-emerald-300 border border-emerald-700/50';
}

function getDluoLabel(days: number) {
  if (days <= 0) return 'EXPIRE';
  return `J-${days}`;
}

function getDeadlineColor(deadline: string): string {
  const now = new Date();
  const dl = new Date(deadline);
  const diffDays = Math.ceil((dl.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
  if (diffDays < 0) return 'text-red-400';
  if (diffDays <= 2) return 'text-amber-400';
  return 'text-[#6B7280] dark:text-[#A3A3A3]';
}

function getDeadlineBg(deadline: string): string {
  const now = new Date();
  const dl = new Date(deadline);
  const diffDays = Math.ceil((dl.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
  if (diffDays < 0) return 'bg-red-900/20';
  if (diffDays <= 2) return 'bg-amber-900/20';
  return '';
}

// ─── API helpers ────────────────────────────────────────────────────────────

function getAuthHeaders(): Record<string, string> {
  const token = localStorage.getItem('token');
  const rid = localStorage.getItem('activeRestaurantId');
  const headers: Record<string, string> = { 'Content-Type': 'application/json' };
  if (token) headers['Authorization'] = `Bearer ${token}`;
  if (rid) headers['X-Restaurant-Id'] = rid;
  return headers;
}

// ─── Compliance Score Ring ──────────────────────────────────────────────────

function ScoreRing({ score, size = 160 }: { score: number; size?: number }) {
  const radius = (size - 16) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;
  const color = score >= 80 ? '#10b981' : score >= 50 ? '#f59e0b' : '#ef4444';

  return (
    <div className="relative inline-flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke="#1A1A1A" strokeWidth="8" />
        <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke={color} strokeWidth="8" strokeLinecap="round"
          strokeDasharray={circumference} strokeDashoffset={offset}
          className="transition-all duration-1000 ease-out" />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-3xl font-bold text-[#111111] dark:text-white">{score}%</span>
        <span className="text-xs text-[#9CA3AF] dark:text-[#737373]">Conformite</span>
      </div>
    </div>
  );
}

// ─── Print Styles ───────────────────────────────────────────────────────────

const PRINT_STYLES = `
@media print {
  body * { visibility: hidden !important; }
  .print-report, .print-report * { visibility: visible !important; }
  .print-report { position: absolute; left: 0; top: 0; width: 100%; background: white !important; color: black !important; padding: 24px; }
  .print-report .dark\\:bg-black\\/50 { background: white !important; border-color: #e5e7eb !important; }
  .print-report .dark\\:text-white, .print-report .text-white { color: black !important; }
  .print-report .dark\\:text-\\[\\#737373\\], .print-report .text-\\[\\#9CA3AF\\] { color: #666 !important; }
  .no-print { display: none !important; }
}
`;

// ─── Component ───────────────────────────────────────────────────────────────

export default function HACCP() {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState<TabKey>('dashboard');
  const [temperatures, setTemperatures] = useState<TemperatureRecord[]>([]);
  const [lots, setLots] = useState<LotRecord[]>([]);
  const [dluoAlerts] = useState<DluoAlert[]>([]);
  const [cleaning, setCleaning] = useState<CleaningRecord[]>([]);
  const [correctiveActions, setCorrectiveActions] = useState<CorrectiveAction[]>([]);
  const [complianceReport, setComplianceReport] = useState<ComplianceReport | null>(null);

  const [showTempForm, setShowTempForm] = useState(false);
  const [tempForm, setTempForm] = useState({ zone: 'frigo' as TemperatureRecord['zone'], temperature: '', agent: '', notes: '' });
  const [showLotForm, setShowLotForm] = useState(false);
  const [lotForm, setLotForm] = useState({ lotNumber: '', product: '', supplier: '', dlc: '', ddm: '', status: 'en_attente' as LotRecord['status'] });
  const [searchLots, setSearchLots] = useState('');

  const [showActionForm, setShowActionForm] = useState(false);
  const [actionForm, setActionForm] = useState({ type: 'temperature' as CorrectiveAction['type'], description: '', responsiblePerson: '', deadline: '' });

  // ─── API: Load data on mount ──────────────────────────────────────────

  const loadTemperatures = useCallback(async () => {
    try {
      const res = await fetch('/api/haccp/temperatures', { headers: getAuthHeaders() });
      if (!res.ok) throw new Error('Failed to load temperatures');
      const data = await res.json();
      const mapped: TemperatureRecord[] = (Array.isArray(data) ? data : []).map((t: any) => ({
        id: t.id,
        zone: t.zone,
        temperature: t.temperature,
        timestamp: t.createdAt || `${t.date}T${t.time || '00:00'}`,
        agent: t.recordedBy || '',
        notes: t.notes || '',
      }));
      setTemperatures(mapped);
    } catch {
      setTemperatures([]);
    }
  }, []);

  const loadCleanings = useCallback(async () => {
    try {
      const today = new Date().toISOString().split('T')[0];
      const res = await fetch(`/api/haccp/cleanings?date=${today}`, { headers: getAuthHeaders() });
      if (!res.ok) throw new Error('Failed to load cleanings');
      const data = await res.json();
      const mapped: CleaningRecord[] = (Array.isArray(data) ? data : []).map((c: any) => ({
        id: c.id,
        zone: c.zone,
        date: c.date,
        time: c.status === 'fait' ? new Date(c.createdAt).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }) : '',
        agent: c.doneBy || '',
        verified: c.status === 'fait',
      }));
      setCleaning(mapped);
    } catch {
      setCleaning([]);
    }
  }, []);

  const loadReport = useCallback(async () => {
    try {
      const res = await fetch('/api/haccp/report', { headers: getAuthHeaders() });
      if (!res.ok) throw new Error('Failed to load report');
      const data = await res.json();
      setComplianceReport(data);
    } catch {
      setComplianceReport(null);
    }
  }, []);

  const loadCorrectiveActions = useCallback(async () => {
    try {
      const res = await fetch('/api/haccp/corrective-actions', { headers: getAuthHeaders() });
      if (!res.ok) throw new Error('Failed to load corrective actions');
      const data = await res.json();
      setCorrectiveActions(Array.isArray(data) ? data : []);
    } catch {
      setCorrectiveActions([]);
    }
  }, []);

  useEffect(() => {
    loadTemperatures();
    loadCleanings();
    loadReport();
    loadCorrectiveActions();
  }, [loadTemperatures, loadCleanings, loadReport, loadCorrectiveActions]);

  // ─── Stats ───────────────────────────────────────────────────────────────

  const stats = useMemo(() => {
    const total = temperatures.length;
    const ok = temperatures.filter(t => {
      if (t.zone === 'frigo') return t.temperature < 4;
      if (t.zone === 'congelateur') return t.temperature <= -18;
      if (t.zone === 'plat_chaud') return t.temperature >= 63;
      return true;
    }).length;
    const rate = total > 0 ? Math.round((ok / total) * 100) : 0;
    const activeAlerts = dluoAlerts.filter(a => a.daysRemaining <= 3).length;
    const expired = dluoAlerts.filter(a => a.daysRemaining <= 0).length;
    const cleanDone = cleaning.filter(c => c.verified).length;
    const cleanRate = cleaning.length > 0 ? Math.round((cleanDone / cleaning.length) * 100) : 0;
    const lotsOk = lots.filter(l => l.status === 'conforme').length;
    const lotsKo = lots.filter(l => l.status === 'non_conforme').length;
    return { rate, total, activeAlerts, expired, cleanRate, cleanDone, cleanTotal: cleaning.length, lotsOk, lotsKo };
  }, [temperatures, dluoAlerts, cleaning, lots]);

  // ─── Chart data: temperature trend (last 7 days) ────────────────────────

  const { chartData, chartZones } = useMemo(() => {
    const today = new Date();
    const dateKeys: string[] = [];
    const dateLabels: string[] = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(d.getDate() - i);
      dateKeys.push(d.toISOString().split('T')[0]);
      dateLabels.push(d.toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit' }));
    }

    const zonesSet = new Set<string>();
    temperatures.forEach(t => zonesSet.add(t.zone));
    const zones = Array.from(zonesSet);

    const grouped: Record<string, Record<string, number>> = {};
    dateKeys.forEach(dk => { grouped[dk] = {}; });

    temperatures.forEach(t => {
      const tDate = new Date(t.timestamp).toISOString().split('T')[0];
      if (grouped[tDate]) {
        const label = ZONE_LABELS[t.zone] || t.zone;
        if (grouped[tDate][label] === undefined) {
          grouped[tDate][label] = t.temperature;
        }
      }
    });

    const data = dateKeys.map((dk, i) => ({
      date: dateLabels[i],
      ...grouped[dk],
    }));

    return { chartData: data, chartZones: zones.map(z => ZONE_LABELS[z] || z) };
  }, [temperatures]);

  // Custom tooltip for the temperature chart
  const TempChartTooltip = ({ active, payload, label }: any) => {
    if (!active || !payload?.length) return null;
    return (
      <div className="bg-[#FAFAFA] dark:bg-[#0A0A0A] border border-[#E5E7EB] dark:border-[#1A1A1A] rounded-lg p-3 shadow-xl text-xs">
        <div className="text-[#9CA3AF] dark:text-[#737373] mb-1.5 font-medium">{label}</div>
        {payload.map((p: any) => {
          const temp = p.value as number;
          let status = 'OK';
          if (p.dataKey === ZONE_LABELS['frigo'] && temp >= 4) status = temp <= 7 ? 'Attention' : 'Danger';
          else if (p.dataKey === ZONE_LABELS['congelateur'] && temp > -18) status = temp <= -15 ? 'Attention' : 'Danger';
          else if (p.dataKey === ZONE_LABELS['plat_chaud'] && temp < 63) status = temp >= 55 ? 'Attention' : 'Danger';
          const statusColor = status === 'OK' ? 'text-emerald-400' : status === 'Attention' ? 'text-amber-400' : 'text-red-400';
          return (
            <div key={p.dataKey} className="flex items-center justify-between gap-4 py-0.5">
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: p.color }} />
                <span className="text-[#6B7280] dark:text-[#A3A3A3]">{p.dataKey}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[#111111] dark:text-white font-semibold">{temp}°C</span>
                <span className={`font-medium ${statusColor}`}>{status}</span>
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  // ─── Handlers ────────────────────────────────────────────────────────────

  async function addTemp() {
    if (!tempForm.temperature || !tempForm.agent) return;
    const now = new Date();
    const dateStr = now.toISOString().split('T')[0];
    const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
    const payload = {
      zone: tempForm.zone,
      temperature: parseFloat(tempForm.temperature),
      date: dateStr,
      time: timeStr,
      recordedBy: tempForm.agent,
      notes: tempForm.notes || null,
    };
    const localRecord: TemperatureRecord = {
      id: Date.now(),
      zone: tempForm.zone,
      temperature: parseFloat(tempForm.temperature),
      timestamp: now.toISOString(),
      agent: tempForm.agent,
      notes: tempForm.notes,
    };
    try {
      const res = await fetch('/api/haccp/temperatures', {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(payload),
      });
      if (res.ok) {
        const saved = await res.json();
        const mapped: TemperatureRecord = {
          id: saved.id,
          zone: saved.zone,
          temperature: saved.temperature,
          timestamp: saved.createdAt || now.toISOString(),
          agent: saved.recordedBy || tempForm.agent,
          notes: saved.notes || '',
        };
        setTemperatures(prev => [mapped, ...prev]);
      } else {
        setTemperatures(prev => [localRecord, ...prev]);
      }
    } catch {
      setTemperatures(prev => [localRecord, ...prev]);
    }
    setTempForm({ zone: 'frigo', temperature: '', agent: '', notes: '' });
    setShowTempForm(false);
    // Refresh report after adding temp
    loadReport();
  }

  function addLot() {
    if (!lotForm.lotNumber || !lotForm.product || !lotForm.supplier) return;
    setLots(prev => [{ id: Date.now(), ...lotForm, receptionDate: new Date().toISOString().split('T')[0] }, ...prev]);
    setLotForm({ lotNumber: '', product: '', supplier: '', dlc: '', ddm: '', status: 'en_attente' });
    setShowLotForm(false);
  }

  async function toggleClean(id: number) {
    const record = cleaning.find(c => c.id === id);
    if (!record) return;
    const now = new Date();
    const newVerified = !record.verified;
    const updated = {
      ...record,
      verified: newVerified,
      time: newVerified ? `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}` : '',
      agent: newVerified ? 'Moi' : '',
    };
    setCleaning(prev => prev.map(c => c.id === id ? updated : c));
    try {
      await fetch(`/api/haccp/cleanings/${id}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify({
          status: newVerified ? 'fait' : 'en_attente',
          doneBy: newVerified ? 'Moi' : null,
        }),
      });
    } catch {
      // Already updated locally
    }
    loadReport();
  }

  async function addCorrectiveAction() {
    if (!actionForm.description || !actionForm.responsiblePerson || !actionForm.deadline) return;
    try {
      const res = await fetch('/api/haccp/corrective-action', {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(actionForm),
      });
      if (res.ok) {
        const saved = await res.json();
        setCorrectiveActions(prev => [saved, ...prev]);
      }
    } catch {
      // Fallback: add locally
      setCorrectiveActions(prev => [{ id: Date.now(), ...actionForm, status: 'ouvert', createdAt: new Date().toISOString() } as CorrectiveAction, ...prev]);
    }
    setActionForm({ type: 'temperature', description: '', responsiblePerson: '', deadline: '' });
    setShowActionForm(false);
    loadReport();
  }

  async function updateActionStatus(id: number, newStatus: string) {
    setCorrectiveActions(prev => prev.map(a => a.id === id ? { ...a, status: newStatus as CorrectiveAction['status'] } : a));
    try {
      await fetch(`/api/haccp/corrective-action/${id}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify({ status: newStatus }),
      });
    } catch {
      // Already updated locally
    }
    loadReport();
  }

  function handlePrint() {
    window.print();
  }

  const filteredLots = useMemo(() => {
    if (!searchLots) return lots;
    const q = searchLots.toLowerCase();
    return lots.filter(l => l.lotNumber.toLowerCase().includes(q) || l.product.toLowerCase().includes(q) || l.supplier.toLowerCase().includes(q));
  }, [lots, searchLots]);

  const tabs: { key: TabKey; label: string; icon: React.ReactNode }[] = [
    { key: 'dashboard', label: t('haccp.tabDashboard'), icon: <BarChart3 className="w-4 h-4" /> },
    { key: 'temperatures', label: t('haccp.tabTemperatures'), icon: <Thermometer className="w-4 h-4" /> },
    { key: 'nettoyage', label: t('haccp.tabCleaning'), icon: <SprayCan className="w-4 h-4" /> },
    { key: 'conformite', label: 'Conformite', icon: <ShieldCheck className="w-4 h-4" /> },
    { key: 'actions', label: 'Actions correctives', icon: <Wrench className="w-4 h-4" /> },
    { key: 'lots', label: t('haccp.tabTraceability'), icon: <Package className="w-4 h-4" /> },
    { key: 'alertes', label: t('haccp.tabAlerts'), icon: <AlertTriangle className="w-4 h-4" /> },
  ];

  return (
    <div className="space-y-6">
      {/* Print styles */}
      <style dangerouslySetInnerHTML={{ __html: PRINT_STYLES }} />

      {/* Header */}
      <div className="flex items-center justify-between no-print">
        <div>
          <h1 className="text-2xl font-bold text-[#111111] dark:text-white flex items-center gap-3">
            <ShieldCheck className="w-7 h-7 text-emerald-400" />
            {t('haccp.title')}
          </h1>
          <p className="text-[#9CA3AF] dark:text-[#737373] mt-1">{t('haccp.subtitle')}</p>
        </div>
        <button onClick={handlePrint}
          className="flex items-center gap-2 px-4 py-2.5 bg-[#111111] dark:bg-white hover:bg-[#333] dark:hover:bg-[#E5E5E5] text-white dark:text-black rounded-xl text-sm font-medium transition-colors no-print">
          <Download className="w-4 h-4" />
          Exporter rapport HACCP
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-white dark:bg-black/50 p-1 rounded-xl border border-[#E5E7EB] dark:border-[#1A1A1A] overflow-x-auto no-print">
        {tabs.map(tab => (
          <button key={tab.key} onClick={() => setActiveTab(tab.key)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${activeTab === tab.key ? 'bg-[#111111] dark:bg-white text-white dark:text-black shadow-lg' : 'text-[#9CA3AF] dark:text-[#737373] hover:text-[#111111] dark:hover:text-white hover:bg-[#F3F4F6] dark:hover:bg-[#171717]'}`}>
            {tab.icon}{tab.label}
          </button>
        ))}
      </div>

      {/* ═══ DASHBOARD ═══ */}
      {activeTab === 'dashboard' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Conformite */}
            <div className="bg-white dark:bg-black/50 border border-[#E5E7EB] dark:border-[#1A1A1A] rounded-2xl p-5">
              <div className="flex items-center justify-between mb-3">
                <span className="text-[#9CA3AF] dark:text-[#737373] text-sm">{t('haccp.tempCompliance')}</span>
                <Thermometer className="w-5 h-5 text-teal-400" />
              </div>
              <div className={`text-3xl font-bold ${stats.rate >= 90 ? 'text-emerald-400' : stats.rate >= 70 ? 'text-amber-400' : 'text-red-400'}`}>{stats.rate}%</div>
              <div className="text-xs text-[#9CA3AF] dark:text-[#737373] mt-1">{stats.total} {t('haccp.readings')}</div>
              <div className="mt-3 h-2 bg-[#FAFAFA] dark:bg-[#0A0A0A] rounded-full overflow-hidden">
                <div className={`h-full rounded-full ${stats.rate >= 90 ? 'bg-emerald-500' : stats.rate >= 70 ? 'bg-amber-500' : 'bg-red-500'}`} style={{ width: `${stats.rate}%` }} />
              </div>
            </div>
            {/* Alertes */}
            <div className="bg-white dark:bg-black/50 border border-[#E5E7EB] dark:border-[#1A1A1A] rounded-2xl p-5">
              <div className="flex items-center justify-between mb-3">
                <span className="text-[#9CA3AF] dark:text-[#737373] text-sm">{t('haccp.dluoAlerts')}</span>
                <AlertTriangle className="w-5 h-5 text-amber-400" />
              </div>
              <div className="text-3xl font-bold text-amber-400">{stats.activeAlerts}</div>
              <div className="text-xs text-[#9CA3AF] dark:text-[#737373] mt-1">{t('haccp.including')} {stats.expired} {t('haccp.expired')}</div>
              {stats.expired > 0 && <div className="mt-3 flex items-center gap-2 text-xs text-red-400 bg-red-900/20 px-2 py-1 rounded-lg"><XCircle className="w-3.5 h-3.5" />{t('haccp.actionRequired')}</div>}
            </div>
            {/* Nettoyage */}
            <div className="bg-white dark:bg-black/50 border border-[#E5E7EB] dark:border-[#1A1A1A] rounded-2xl p-5">
              <div className="flex items-center justify-between mb-3">
                <span className="text-[#9CA3AF] dark:text-[#737373] text-sm">{t('haccp.todayCleaning')}</span>
                <SprayCan className="w-5 h-5 text-violet-400" />
              </div>
              <div className={`text-3xl font-bold ${stats.cleanRate === 100 ? 'text-emerald-400' : stats.cleanRate >= 50 ? 'text-amber-400' : 'text-red-400'}`}>{stats.cleanRate}%</div>
              <div className="text-xs text-[#9CA3AF] dark:text-[#737373] mt-1">{stats.cleanDone}/{stats.cleanTotal} zones</div>
              <div className="mt-3 h-2 bg-[#FAFAFA] dark:bg-[#0A0A0A] rounded-full overflow-hidden">
                <div className={`h-full rounded-full ${stats.cleanRate === 100 ? 'bg-emerald-500' : stats.cleanRate >= 50 ? 'bg-amber-500' : 'bg-red-500'}`} style={{ width: `${stats.cleanRate}%` }} />
              </div>
            </div>
            {/* Actions correctives */}
            <div className="bg-white dark:bg-black/50 border border-[#E5E7EB] dark:border-[#1A1A1A] rounded-2xl p-5">
              <div className="flex items-center justify-between mb-3">
                <span className="text-[#9CA3AF] dark:text-[#737373] text-sm">Actions correctives</span>
                <Wrench className="w-5 h-5 text-orange-400" />
              </div>
              <div className="text-3xl font-bold text-[#111111] dark:text-white">{complianceReport?.correctiveActions.open || 0}</div>
              <div className="text-xs text-[#9CA3AF] dark:text-[#737373] mt-1">ouvertes / {complianceReport?.correctiveActions.total || 0} total</div>
              {(complianceReport?.correctiveActions.open || 0) > 0 && (
                <button onClick={() => setActiveTab('actions')} className="mt-3 flex items-center gap-1 text-xs text-amber-400 hover:text-amber-300 transition-colors">
                  Voir les actions <ChevronRight className="w-3 h-3" />
                </button>
              )}
            </div>
          </div>

          {/* Temperature trend chart */}
          <div className="bg-white dark:bg-black/50 border border-[#E5E7EB] dark:border-[#1A1A1A] rounded-2xl p-5">
            <h3 className="text-[#111111] dark:text-white font-semibold mb-4 flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-teal-400" />
              {t('haccp.tempTrend')}
            </h3>
            {temperatures.length === 0 ? (
              <div className="text-center py-12 text-[#9CA3AF] dark:text-[#737373] text-sm">{t('haccp.noTempData')}</div>
            ) : (
              <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={chartData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                    <XAxis dataKey="date" stroke="#94a3b8" tick={{ fontSize: 12 }} />
                    <YAxis stroke="#94a3b8" tick={{ fontSize: 12 }} tickFormatter={(v: number) => `${v}°`} />
                    <Tooltip content={<TempChartTooltip />} />
                    <Legend
                      wrapperStyle={{ fontSize: 12, color: '#94a3b8' }}
                      formatter={(value: string) => <span className="text-[#6B7280] dark:text-[#A3A3A3]">{value}</span>}
                    />
                    <ReferenceLine y={0} stroke="#ef4444" strokeDasharray="6 4" strokeWidth={1} label={{ value: '0C', position: 'right', fill: '#ef4444', fontSize: 10 }} />
                    <ReferenceLine y={4} stroke="#ef4444" strokeDasharray="6 4" strokeWidth={1} label={{ value: '4C froid', position: 'right', fill: '#ef4444', fontSize: 10 }} />
                    <ReferenceLine y={63} stroke="#ef4444" strokeDasharray="6 4" strokeWidth={1} label={{ value: '63C chaud', position: 'right', fill: '#ef4444', fontSize: 10 }} />
                    {chartZones.map(zone => {
                      const zoneKey = Object.entries(ZONE_LABELS).find(([, v]) => v === zone)?.[0] || '';
                      return (
                        <Line
                          key={zone}
                          type="monotone"
                          dataKey={zone}
                          stroke={ZONE_CHART_COLORS[zoneKey] || '#64748b'}
                          strokeWidth={2}
                          dot={{ r: 4, fill: ZONE_CHART_COLORS[zoneKey] || '#64748b' }}
                          activeDot={{ r: 6 }}
                          connectNulls
                        />
                      );
                    })}
                  </LineChart>
                </ResponsiveContainer>
              </div>
            )}
          </div>

          {/* Recent temps */}
          <div className="bg-white dark:bg-black/50 border border-[#E5E7EB] dark:border-[#1A1A1A] rounded-2xl p-5">
            <h3 className="text-[#111111] dark:text-white font-semibold mb-4 flex items-center gap-2"><Thermometer className="w-5 h-5 text-teal-400" />{t('haccp.latestReadings')}</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead><tr className="text-[#9CA3AF] dark:text-[#737373] text-xs uppercase tracking-wider border-b border-[#E5E7EB] dark:border-[#1A1A1A]">
                  <th className="text-left py-3 px-3">{t('haccp.zone')}</th><th className="text-left py-3 px-3">{t('haccp.temp')}</th><th className="text-left py-3 px-3">{t('haccp.time')}</th><th className="text-left py-3 px-3">{t('haccp.agent')}</th>
                </tr></thead>
                <tbody>{temperatures.slice(0, 6).map(t => {
                  const c = getTempColor(t.zone, t.temperature);
                  return (<tr key={t.id} className="border-b border-[#E5E7EB] dark:border-[#1A1A1A]/50 hover:bg-[#F3F4F6] dark:hover:bg-[#171717]/30 transition-colors">
                    <td className="py-2.5 px-3 text-[#6B7280] dark:text-[#A3A3A3]">{ZONE_LABELS[t.zone]}</td>
                    <td className="py-2.5 px-3"><span className={`px-2 py-0.5 rounded-lg text-xs font-semibold ${TEMP_BADGE[c]}`}>{t.temperature}°C</span></td>
                    <td className="py-2.5 px-3 text-[#9CA3AF] dark:text-[#737373]">{new Date(t.timestamp).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}</td>
                    <td className="py-2.5 px-3 text-[#9CA3AF] dark:text-[#737373]">{t.agent}</td>
                  </tr>);
                })}</tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ═══ TEMPERATURES ═══ */}
      {activeTab === 'temperatures' && (
        <div className="space-y-4">
          {/* Legend */}
          <div className="bg-white dark:bg-black/50 border border-[#E5E7EB] dark:border-[#1A1A1A] rounded-2xl p-4">
            <h3 className="text-sm font-semibold text-[#111111] dark:text-white mb-3">{t('haccp.dangerZones')}</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div className="flex items-start gap-2"><div className="w-3 h-3 rounded-full bg-emerald-500 mt-0.5 flex-shrink-0" /><div><div className="text-emerald-400 font-medium">{t('haccp.compliantStatus')}</div><div className="text-[#9CA3AF] dark:text-[#737373]">{t('haccp.compliantRanges')}</div></div></div>
              <div className="flex items-start gap-2"><div className="w-3 h-3 rounded-full bg-amber-500 mt-0.5 flex-shrink-0" /><div><div className="text-amber-400 font-medium">{t('haccp.warningStatus')}</div><div className="text-[#9CA3AF] dark:text-[#737373]">{t('haccp.warningRanges')}</div></div></div>
              <div className="flex items-start gap-2"><div className="w-3 h-3 rounded-full bg-red-500 mt-0.5 flex-shrink-0" /><div><div className="text-red-400 font-medium">{t('haccp.dangerStatus')}</div><div className="text-[#9CA3AF] dark:text-[#737373]">{t('haccp.dangerRanges')}</div></div></div>
            </div>
          </div>

          <div className="flex justify-end">
            <button onClick={() => setShowTempForm(!showTempForm)} className="flex items-center gap-2 px-4 py-2.5 bg-[#111111] dark:bg-white hover:bg-[#333] dark:hover:bg-[#E5E5E5] text-white dark:text-black rounded-xl text-sm font-medium transition-colors">
              <Plus className="w-4 h-4" />{t('haccp.newReading')}
            </button>
          </div>

          {showTempForm && (
            <div className="bg-white dark:bg-black/50 border border-[#E5E7EB] dark:border-[#1A1A1A] rounded-2xl p-5 space-y-4">
              <h3 className="text-[#111111] dark:text-white font-semibold">{t('haccp.recordReading')}</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div><label className="block text-xs text-[#9CA3AF] dark:text-[#737373] mb-1">{t('haccp.zone')}</label>
                  <select value={tempForm.zone} onChange={e => setTempForm(f => ({ ...f, zone: e.target.value as TemperatureRecord['zone'] }))} className="w-full bg-[#FAFAFA] dark:bg-[#0A0A0A] border border-[#E5E7EB] dark:border-[#1A1A1A] rounded-lg px-3 py-2 text-sm text-[#111111] dark:text-white">
                    {Object.entries(ZONE_LABELS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
                  </select></div>
                <div><label className="block text-xs text-[#9CA3AF] dark:text-[#737373] mb-1">{t('haccp.temperatureLabel')}</label>
                  <input type="number" step="0.1" value={tempForm.temperature} onChange={e => setTempForm(f => ({ ...f, temperature: e.target.value }))} placeholder="Ex: 3.5" className="w-full bg-[#FAFAFA] dark:bg-[#0A0A0A] border border-[#E5E7EB] dark:border-[#1A1A1A] rounded-lg px-3 py-2 text-sm text-[#111111] dark:text-white placeholder:text-[#6B7280]" /></div>
                <div><label className="block text-xs text-[#9CA3AF] dark:text-[#737373] mb-1">{t('haccp.agent')}</label>
                  <input type="text" value={tempForm.agent} onChange={e => setTempForm(f => ({ ...f, agent: e.target.value }))} placeholder={t('haccp.yourName')} className="w-full bg-[#FAFAFA] dark:bg-[#0A0A0A] border border-[#E5E7EB] dark:border-[#1A1A1A] rounded-lg px-3 py-2 text-sm text-[#111111] dark:text-white placeholder:text-[#6B7280]" /></div>
                <div><label className="block text-xs text-[#9CA3AF] dark:text-[#737373] mb-1">{t('haccp.notes')}</label>
                  <input type="text" value={tempForm.notes} onChange={e => setTempForm(f => ({ ...f, notes: e.target.value }))} placeholder={t('haccp.optional')} className="w-full bg-[#FAFAFA] dark:bg-[#0A0A0A] border border-[#E5E7EB] dark:border-[#1A1A1A] rounded-lg px-3 py-2 text-sm text-[#111111] dark:text-white placeholder:text-[#6B7280]" /></div>
              </div>
              <div className="flex gap-3">
                <button onClick={addTemp} className="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-white rounded-xl text-sm font-medium transition-colors">{t('haccp.save')}</button>
                <button onClick={() => setShowTempForm(false)} className="px-4 py-2 bg-[#F3F4F6] dark:bg-[#171717] hover:bg-[#E5E7EB] dark:hover:bg-[#222] text-[#6B7280] dark:text-[#A3A3A3] rounded-xl text-sm font-medium transition-colors">{t('haccp.cancel')}</button>
              </div>
            </div>
          )}

          <div className="bg-white dark:bg-black/50 border border-[#E5E7EB] dark:border-[#1A1A1A] rounded-2xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead><tr className="text-[#9CA3AF] dark:text-[#737373] text-xs uppercase tracking-wider bg-[#FAFAFA] dark:bg-[#0A0A0A]/50">
                  <th className="text-left py-3 px-4">{t('haccp.zone')}</th><th className="text-left py-3 px-4">{t('haccp.temp')}</th><th className="text-left py-3 px-4">{t('haccp.status')}</th><th className="text-left py-3 px-4">{t('haccp.dateTime')}</th><th className="text-left py-3 px-4">{t('haccp.agent')}</th><th className="text-left py-3 px-4">{t('haccp.notes')}</th>
                </tr></thead>
                <tbody>{temperatures.map(t => {
                  const c = getTempColor(t.zone, t.temperature);
                  return (<tr key={t.id} className="border-t border-[#E5E7EB] dark:border-[#1A1A1A]/50 hover:bg-[#F3F4F6] dark:hover:bg-[#171717]/30 transition-colors">
                    <td className="py-3 px-4 text-[#6B7280] dark:text-[#A3A3A3] font-medium">{ZONE_LABELS[t.zone]}</td>
                    <td className={`py-3 px-4 font-bold ${TEMP_TEXT[c]}`}>{t.temperature}°C</td>
                    <td className="py-3 px-4"><span className={`px-2 py-0.5 rounded-lg text-xs font-semibold ${TEMP_BADGE[c]}`}>{TEMP_STATUS[c]}</span></td>
                    <td className="py-3 px-4 text-[#9CA3AF] dark:text-[#737373]">{new Date(t.timestamp).toLocaleDateString('fr-FR')} {new Date(t.timestamp).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}</td>
                    <td className="py-3 px-4 text-[#9CA3AF] dark:text-[#737373]">{t.agent}</td>
                    <td className="py-3 px-4 text-[#9CA3AF] dark:text-[#737373]">{t.notes || '-'}</td>
                  </tr>);
                })}</tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ═══ NETTOYAGE ═══ */}
      {activeTab === 'nettoyage' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-[#111111] dark:text-white font-semibold flex items-center gap-2"><SprayCan className="w-5 h-5 text-violet-400" />{t('haccp.cleaningRegistry')} — {new Date().toLocaleDateString('fr-FR')}</h3>
            <div className="text-sm text-[#9CA3AF] dark:text-[#737373]">{cleaning.filter(c => c.verified).length}/{cleaning.length} zones</div>
          </div>
          <div className="bg-white dark:bg-black/50 border border-[#E5E7EB] dark:border-[#1A1A1A] rounded-2xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead><tr className="text-[#9CA3AF] dark:text-[#737373] text-xs uppercase tracking-wider bg-[#FAFAFA] dark:bg-[#0A0A0A]/50">
                  <th className="text-left py-3 px-4 w-8">{t('haccp.done')}</th><th className="text-left py-3 px-4">{t('haccp.zone')}</th><th className="text-left py-3 px-4">{t('haccp.time')}</th><th className="text-left py-3 px-4">{t('haccp.agent')}</th><th className="text-left py-3 px-4">{t('haccp.status')}</th>
                </tr></thead>
                <tbody>{cleaning.map(c => (
                  <tr key={c.id} className="border-t border-[#E5E7EB] dark:border-[#1A1A1A]/50 hover:bg-[#F3F4F6] dark:hover:bg-[#171717]/30 transition-colors">
                    <td className="py-3 px-4">
                      <button onClick={() => toggleClean(c.id)} className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all ${c.verified ? 'bg-emerald-500 border-emerald-500 text-white' : 'border-[#E5E7EB] dark:border-[#333] hover:border-[#999]'}`}>
                        {c.verified && <CheckCircle2 className="w-4 h-4" />}
                      </button>
                    </td>
                    <td className="py-3 px-4 text-[#111111] dark:text-white font-medium">{c.zone}</td>
                    <td className="py-3 px-4 text-[#9CA3AF] dark:text-[#737373]">{c.time || '-'}</td>
                    <td className="py-3 px-4 text-[#9CA3AF] dark:text-[#737373]">{c.agent || '-'}</td>
                    <td className="py-3 px-4">
                      {c.verified
                        ? <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg text-xs font-semibold bg-emerald-900/40 text-emerald-300"><CheckCircle2 className="w-3 h-3" />{t('haccp.cleaned')}</span>
                        : <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg text-xs font-semibold bg-[#FAFAFA] dark:bg-[#0A0A0A] text-[#9CA3AF] dark:text-[#737373]"><Clock className="w-3 h-3" />{t('haccp.pending')}</span>}
                    </td>
                  </tr>
                ))}</tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ═══ CONFORMITE ═══ */}
      {activeTab === 'conformite' && (
        <div className="space-y-6 print-report">
          {/* Score + Summary row */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Score Ring */}
            <div className="bg-white dark:bg-black/50 border border-[#E5E7EB] dark:border-[#1A1A1A] rounded-2xl p-6 flex flex-col items-center justify-center">
              <h3 className="text-[#111111] dark:text-white font-semibold mb-4 flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-emerald-400" />
                Score de conformite
              </h3>
              <ScoreRing score={complianceReport?.compliance.score || 0} />
              <div className="mt-4 text-center text-sm text-[#9CA3AF] dark:text-[#737373]">
                {complianceReport?.compliance.completedChecks || 0} / {complianceReport?.compliance.requiredChecks || 0} controles effectues
              </div>
            </div>

            {/* Stats summary */}
            <div className="bg-white dark:bg-black/50 border border-[#E5E7EB] dark:border-[#1A1A1A] rounded-2xl p-6 space-y-4">
              <h3 className="text-[#111111] dark:text-white font-semibold flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-teal-400" />
                Bilan de la semaine
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-[#9CA3AF] dark:text-[#737373] text-sm">Releves temperature</span>
                  <span className="text-[#111111] dark:text-white font-semibold">{complianceReport?.temperatures.weekCount || 0}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-[#9CA3AF] dark:text-[#737373] text-sm">Non-conformites</span>
                  <span className="text-red-400 font-semibold">{complianceReport?.temperatures.weekNonConformes || 0}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-[#9CA3AF] dark:text-[#737373] text-sm">Nettoyages effectues</span>
                  <span className="text-[#111111] dark:text-white font-semibold">{complianceReport?.cleanings.weekDone || 0} / {complianceReport?.cleanings.weekTotal || 0}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-[#9CA3AF] dark:text-[#737373] text-sm">Actions ouvertes</span>
                  <span className="text-amber-400 font-semibold">{complianceReport?.correctiveActions.open || 0}</span>
                </div>
              </div>
              <div className="pt-3 border-t border-[#E5E7EB] dark:border-[#1A1A1A]">
                <h4 className="text-xs text-[#9CA3AF] dark:text-[#737373] uppercase tracking-wider mb-2">Ce mois</h4>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div><span className="text-[#9CA3AF] dark:text-[#737373]">Temp: </span><span className="text-[#111111] dark:text-white font-medium">{complianceReport?.temperatures.monthCount || 0}</span></div>
                  <div><span className="text-[#9CA3AF] dark:text-[#737373]">NC: </span><span className="text-red-400 font-medium">{complianceReport?.temperatures.monthNonConformes || 0}</span></div>
                </div>
              </div>
            </div>

            {/* Calendar Heatmap */}
            <div className="bg-white dark:bg-black/50 border border-[#E5E7EB] dark:border-[#1A1A1A] rounded-2xl p-6">
              <h3 className="text-[#111111] dark:text-white font-semibold mb-4 flex items-center gap-2">
                <Calendar className="w-5 h-5 text-teal-400" />
                Calendrier du mois
              </h3>
              <div className="grid grid-cols-7 gap-1.5">
                {['L', 'M', 'M', 'J', 'V', 'S', 'D'].map((d, i) => (
                  <div key={i} className="text-center text-xs text-[#9CA3AF] dark:text-[#737373] font-medium py-1">{d}</div>
                ))}
                {(() => {
                  const heatmap = complianceReport?.calendarHeatmap || [];
                  if (heatmap.length === 0) return null;
                  // Pad start to align with day of week
                  const firstDate = new Date(heatmap[0]?.date || new Date());
                  const startDay = firstDate.getDay() === 0 ? 6 : firstDate.getDay() - 1; // Monday = 0
                  const pads = Array.from({ length: startDay }, (_, i) => (
                    <div key={`pad-${i}`} className="w-full aspect-square" />
                  ));
                  const cells = heatmap.map((day) => {
                    const dayNum = new Date(day.date).getDate();
                    const bg = day.complete ? 'bg-emerald-500/30 border-emerald-500/50' :
                      (day.hasTemp || day.hasCleaning) ? 'bg-amber-500/20 border-amber-500/40' :
                        'bg-red-500/15 border-red-500/30';
                    return (
                      <div key={day.date}
                        className={`w-full aspect-square rounded-md border flex items-center justify-center text-xs font-medium ${bg}`}
                        title={`${day.date}: ${day.complete ? 'Complet' : day.hasTemp && day.hasCleaning ? 'Partiel' : day.hasTemp ? 'Temp. seulement' : day.hasCleaning ? 'Nettoyage seul' : 'Aucun controle'}`}>
                        <span className="text-[#111111] dark:text-white">{dayNum}</span>
                      </div>
                    );
                  });
                  return [...pads, ...cells];
                })()}
              </div>
              <div className="flex gap-4 mt-3 text-xs">
                <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded-sm bg-emerald-500/30 border border-emerald-500/50" /><span className="text-[#9CA3AF] dark:text-[#737373]">Complet</span></div>
                <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded-sm bg-amber-500/20 border border-amber-500/40" /><span className="text-[#9CA3AF] dark:text-[#737373]">Partiel</span></div>
                <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded-sm bg-red-500/15 border border-red-500/30" /><span className="text-[#9CA3AF] dark:text-[#737373]">Manquant</span></div>
              </div>
            </div>
          </div>

          {/* Missing checks */}
          {(complianceReport?.compliance.missingTempDays?.length || 0) > 0 && (
            <div className="bg-white dark:bg-black/50 border border-red-700/30 rounded-2xl p-5">
              <h3 className="text-[#111111] dark:text-white font-semibold mb-3 flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-red-400" />
                Controles manquants cette semaine
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {complianceReport?.compliance.missingTempDays.map(day => (
                  <div key={day} className="flex items-center justify-between bg-red-900/10 border border-red-900/20 rounded-xl px-4 py-3">
                    <div className="flex items-center gap-2">
                      <XCircle className="w-4 h-4 text-red-400" />
                      <span className="text-sm text-[#111111] dark:text-white">{new Date(day).toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'short' })}</span>
                    </div>
                    <button onClick={() => { setActiveTab('temperatures'); setShowTempForm(true); }}
                      className="text-xs text-teal-400 hover:text-teal-300 font-medium transition-colors no-print">
                      Ajouter maintenant
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Non-conformity alerts */}
          {(complianceReport?.temperatures.nonConformitiesList?.length || 0) > 0 && (
            <div className="bg-white dark:bg-black/50 border border-amber-700/30 rounded-2xl p-5">
              <h3 className="text-[#111111] dark:text-white font-semibold mb-3 flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-amber-400" />
                Non-conformites cette semaine ({complianceReport?.temperatures.weekNonConformes})
              </h3>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead><tr className="text-[#9CA3AF] dark:text-[#737373] text-xs uppercase tracking-wider border-b border-[#E5E7EB] dark:border-[#1A1A1A]">
                    <th className="text-left py-2 px-3">Zone</th><th className="text-left py-2 px-3">Temperature</th><th className="text-left py-2 px-3">Date</th><th className="text-left py-2 px-3">Heure</th>
                  </tr></thead>
                  <tbody>{complianceReport?.temperatures.nonConformitiesList.map(nc => (
                    <tr key={nc.id} className="border-b border-[#E5E7EB] dark:border-[#1A1A1A]/50">
                      <td className="py-2 px-3 text-[#6B7280] dark:text-[#A3A3A3]">{ZONE_LABELS[nc.zone] || nc.zone}</td>
                      <td className="py-2 px-3 text-red-400 font-bold">{nc.temperature}°C</td>
                      <td className="py-2 px-3 text-[#9CA3AF] dark:text-[#737373]">{new Date(nc.date).toLocaleDateString('fr-FR')}</td>
                      <td className="py-2 px-3 text-[#9CA3AF] dark:text-[#737373]">{nc.time || '-'}</td>
                    </tr>
                  ))}</tbody>
                </table>
              </div>
            </div>
          )}

          {/* Corrective actions log */}
          <div className="bg-white dark:bg-black/50 border border-[#E5E7EB] dark:border-[#1A1A1A] rounded-2xl p-5">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-[#111111] dark:text-white font-semibold flex items-center gap-2">
                <Wrench className="w-5 h-5 text-orange-400" />
                Dernieres actions correctives
              </h3>
              <button onClick={() => setActiveTab('actions')} className="text-xs text-teal-400 hover:text-teal-300 font-medium transition-colors no-print">
                Voir tout
              </button>
            </div>
            {correctiveActions.length === 0 ? (
              <div className="text-center py-8 text-[#9CA3AF] dark:text-[#737373] text-sm">Aucune action corrective enregistree</div>
            ) : (
              <div className="space-y-2">
                {correctiveActions.slice(0, 5).map(a => (
                  <div key={a.id} className={`flex items-center justify-between px-4 py-3 rounded-xl border border-[#E5E7EB] dark:border-[#1A1A1A] ${getDeadlineBg(a.deadline)}`}>
                    <div className="flex items-center gap-3">
                      <span className={`px-2 py-0.5 rounded-lg text-xs font-semibold ${ACTION_STATUS_BADGE[a.status]}`}>{ACTION_STATUS_LABELS[a.status]}</span>
                      <span className="text-sm text-[#111111] dark:text-white">{a.description}</span>
                    </div>
                    <div className="flex items-center gap-3 text-xs">
                      <span className="text-[#9CA3AF] dark:text-[#737373]">{a.responsiblePerson}</span>
                      <span className={getDeadlineColor(a.deadline)}>{new Date(a.deadline).toLocaleDateString('fr-FR')}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ═══ ACTIONS CORRECTIVES ═══ */}
      {activeTab === 'actions' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-[#111111] dark:text-white font-semibold flex items-center gap-2">
              <Wrench className="w-5 h-5 text-orange-400" />
              Actions correctives
            </h3>
            <button onClick={() => setShowActionForm(!showActionForm)}
              className="flex items-center gap-2 px-4 py-2.5 bg-[#111111] dark:bg-white hover:bg-[#333] dark:hover:bg-[#E5E5E5] text-white dark:text-black rounded-xl text-sm font-medium transition-colors">
              <Plus className="w-4 h-4" />Nouvelle action
            </button>
          </div>

          {/* Status summary cards */}
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-white dark:bg-black/50 border border-red-700/30 rounded-2xl p-4 text-center">
              <div className="text-2xl font-bold text-red-400">{correctiveActions.filter(a => a.status === 'ouvert').length}</div>
              <div className="text-xs text-[#9CA3AF] dark:text-[#737373] mt-1">Ouvertes</div>
            </div>
            <div className="bg-white dark:bg-black/50 border border-amber-700/30 rounded-2xl p-4 text-center">
              <div className="text-2xl font-bold text-amber-400">{correctiveActions.filter(a => a.status === 'en_cours').length}</div>
              <div className="text-xs text-[#9CA3AF] dark:text-[#737373] mt-1">En cours</div>
            </div>
            <div className="bg-white dark:bg-black/50 border border-emerald-700/30 rounded-2xl p-4 text-center">
              <div className="text-2xl font-bold text-emerald-400">{correctiveActions.filter(a => a.status === 'resolu').length}</div>
              <div className="text-xs text-[#9CA3AF] dark:text-[#737373] mt-1">Resolues</div>
            </div>
          </div>

          {/* New action form */}
          {showActionForm && (
            <div className="bg-white dark:bg-black/50 border border-[#E5E7EB] dark:border-[#1A1A1A] rounded-2xl p-5 space-y-4">
              <h3 className="text-[#111111] dark:text-white font-semibold">Nouvelle action corrective</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div>
                  <label className="block text-xs text-[#9CA3AF] dark:text-[#737373] mb-1">Type</label>
                  <select value={actionForm.type} onChange={e => setActionForm(f => ({ ...f, type: e.target.value as CorrectiveAction['type'] }))}
                    className="w-full bg-[#FAFAFA] dark:bg-[#0A0A0A] border border-[#E5E7EB] dark:border-[#1A1A1A] rounded-lg px-3 py-2 text-sm text-[#111111] dark:text-white">
                    {Object.entries(ACTION_TYPE_LABELS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs text-[#9CA3AF] dark:text-[#737373] mb-1">Description</label>
                  <input type="text" value={actionForm.description} onChange={e => setActionForm(f => ({ ...f, description: e.target.value }))}
                    placeholder="Decrire la non-conformite..."
                    className="w-full bg-[#FAFAFA] dark:bg-[#0A0A0A] border border-[#E5E7EB] dark:border-[#1A1A1A] rounded-lg px-3 py-2 text-sm text-[#111111] dark:text-white placeholder:text-[#6B7280]" />
                </div>
                <div>
                  <label className="block text-xs text-[#9CA3AF] dark:text-[#737373] mb-1">Responsable</label>
                  <input type="text" value={actionForm.responsiblePerson} onChange={e => setActionForm(f => ({ ...f, responsiblePerson: e.target.value }))}
                    placeholder="Nom du responsable"
                    className="w-full bg-[#FAFAFA] dark:bg-[#0A0A0A] border border-[#E5E7EB] dark:border-[#1A1A1A] rounded-lg px-3 py-2 text-sm text-[#111111] dark:text-white placeholder:text-[#6B7280]" />
                </div>
                <div>
                  <label className="block text-xs text-[#9CA3AF] dark:text-[#737373] mb-1">Echeance</label>
                  <input type="date" value={actionForm.deadline} onChange={e => setActionForm(f => ({ ...f, deadline: e.target.value }))}
                    className="w-full bg-[#FAFAFA] dark:bg-[#0A0A0A] border border-[#E5E7EB] dark:border-[#1A1A1A] rounded-lg px-3 py-2 text-sm text-[#111111] dark:text-white" />
                </div>
              </div>
              <div className="flex gap-3">
                <button onClick={addCorrectiveAction} className="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-white rounded-xl text-sm font-medium transition-colors">Enregistrer</button>
                <button onClick={() => setShowActionForm(false)} className="px-4 py-2 bg-[#F3F4F6] dark:bg-[#171717] hover:bg-[#E5E7EB] dark:hover:bg-[#222] text-[#6B7280] dark:text-[#A3A3A3] rounded-xl text-sm font-medium transition-colors">Annuler</button>
              </div>
            </div>
          )}

          {/* Actions list */}
          <div className="bg-white dark:bg-black/50 border border-[#E5E7EB] dark:border-[#1A1A1A] rounded-2xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead><tr className="text-[#9CA3AF] dark:text-[#737373] text-xs uppercase tracking-wider bg-[#FAFAFA] dark:bg-[#0A0A0A]/50">
                  <th className="text-left py-3 px-4">Type</th>
                  <th className="text-left py-3 px-4">Description</th>
                  <th className="text-left py-3 px-4">Responsable</th>
                  <th className="text-left py-3 px-4">Echeance</th>
                  <th className="text-left py-3 px-4">Statut</th>
                  <th className="text-left py-3 px-4">Actions</th>
                </tr></thead>
                <tbody>{correctiveActions.map(a => (
                  <tr key={a.id} className={`border-t border-[#E5E7EB] dark:border-[#1A1A1A]/50 hover:bg-[#F3F4F6] dark:hover:bg-[#171717]/30 transition-colors ${getDeadlineBg(a.deadline)}`}>
                    <td className="py-3 px-4">
                      <span className="px-2 py-0.5 rounded-lg text-xs font-medium bg-[#FAFAFA] dark:bg-[#0A0A0A] text-[#6B7280] dark:text-[#A3A3A3] border border-[#E5E7EB] dark:border-[#1A1A1A]">
                        {ACTION_TYPE_LABELS[a.type] || a.type}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-[#111111] dark:text-white max-w-xs">{a.description}</td>
                    <td className="py-3 px-4 text-[#9CA3AF] dark:text-[#737373]">{a.responsiblePerson}</td>
                    <td className={`py-3 px-4 font-medium ${getDeadlineColor(a.deadline)}`}>{new Date(a.deadline).toLocaleDateString('fr-FR')}</td>
                    <td className="py-3 px-4">
                      <span className={`px-2.5 py-0.5 rounded-lg text-xs font-semibold ${ACTION_STATUS_BADGE[a.status]}`}>{ACTION_STATUS_LABELS[a.status]}</span>
                    </td>
                    <td className="py-3 px-4">
                      {a.status !== 'resolu' && (
                        <div className="flex gap-1">
                          {a.status === 'ouvert' && (
                            <button onClick={() => updateActionStatus(a.id, 'en_cours')}
                              className="px-2 py-1 text-xs bg-amber-900/30 text-amber-300 rounded-lg hover:bg-amber-900/50 transition-colors">
                              Demarrer
                            </button>
                          )}
                          <button onClick={() => updateActionStatus(a.id, 'resolu')}
                            className="px-2 py-1 text-xs bg-emerald-900/30 text-emerald-300 rounded-lg hover:bg-emerald-900/50 transition-colors">
                            Resoudre
                          </button>
                        </div>
                      )}
                      {a.status === 'resolu' && (
                        <span className="text-xs text-emerald-400">
                          <CheckCircle2 className="w-4 h-4 inline" />
                        </span>
                      )}
                    </td>
                  </tr>
                ))}</tbody>
              </table>
            </div>
            {correctiveActions.length === 0 && <div className="text-center py-8 text-[#9CA3AF] dark:text-[#737373]">Aucune action corrective</div>}
          </div>
        </div>
      )}

      {/* ═══ TRACABILITE ═══ */}
      {activeTab === 'lots' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-3 justify-between">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9CA3AF] dark:text-[#737373]" />
              <input type="text" value={searchLots} onChange={e => setSearchLots(e.target.value)} placeholder={t('haccp.searchLots')} className="w-full bg-[#FAFAFA] dark:bg-[#0A0A0A] border border-[#E5E7EB] dark:border-[#1A1A1A] rounded-lg pl-10 pr-3 py-2.5 text-sm text-[#111111] dark:text-white placeholder:text-[#6B7280]" />
            </div>
            <button onClick={() => setShowLotForm(!showLotForm)} className="flex items-center gap-2 px-4 py-2.5 bg-[#111111] dark:bg-white hover:bg-[#333] dark:hover:bg-[#E5E5E5] text-white dark:text-black rounded-xl text-sm font-medium transition-colors"><Plus className="w-4 h-4" />{t('haccp.newLot')}</button>
          </div>

          {showLotForm && (
            <div className="bg-white dark:bg-black/50 border border-[#E5E7EB] dark:border-[#1A1A1A] rounded-2xl p-5 space-y-4">
              <h3 className="text-[#111111] dark:text-white font-semibold">{t('haccp.recordLot')}</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <div><label className="block text-xs text-[#9CA3AF] dark:text-[#737373] mb-1">{t('haccp.lotNumber')}</label><input type="text" value={lotForm.lotNumber} onChange={e => setLotForm(f => ({ ...f, lotNumber: e.target.value }))} placeholder="LOT-XXXX" className="w-full bg-[#FAFAFA] dark:bg-[#0A0A0A] border border-[#E5E7EB] dark:border-[#1A1A1A] rounded-lg px-3 py-2 text-sm text-[#111111] dark:text-white placeholder:text-[#6B7280]" /></div>
                <div><label className="block text-xs text-[#9CA3AF] dark:text-[#737373] mb-1">{t('haccp.product')}</label><input type="text" value={lotForm.product} onChange={e => setLotForm(f => ({ ...f, product: e.target.value }))} placeholder={t('haccp.productName')} className="w-full bg-[#FAFAFA] dark:bg-[#0A0A0A] border border-[#E5E7EB] dark:border-[#1A1A1A] rounded-lg px-3 py-2 text-sm text-[#111111] dark:text-white placeholder:text-[#6B7280]" /></div>
                <div><label className="block text-xs text-[#9CA3AF] dark:text-[#737373] mb-1">{t('haccp.supplier')}</label><input type="text" value={lotForm.supplier} onChange={e => setLotForm(f => ({ ...f, supplier: e.target.value }))} placeholder={t('haccp.supplier')} className="w-full bg-[#FAFAFA] dark:bg-[#0A0A0A] border border-[#E5E7EB] dark:border-[#1A1A1A] rounded-lg px-3 py-2 text-sm text-[#111111] dark:text-white placeholder:text-[#6B7280]" /></div>
                <div><label className="block text-xs text-[#9CA3AF] dark:text-[#737373] mb-1">{t('haccp.dlc')}</label><input type="date" value={lotForm.dlc} onChange={e => setLotForm(f => ({ ...f, dlc: e.target.value }))} className="w-full bg-[#FAFAFA] dark:bg-[#0A0A0A] border border-[#E5E7EB] dark:border-[#1A1A1A] rounded-lg px-3 py-2 text-sm text-[#111111] dark:text-white" /></div>
                <div><label className="block text-xs text-[#9CA3AF] dark:text-[#737373] mb-1">{t('haccp.ddm')}</label><input type="date" value={lotForm.ddm} onChange={e => setLotForm(f => ({ ...f, ddm: e.target.value }))} className="w-full bg-[#FAFAFA] dark:bg-[#0A0A0A] border border-[#E5E7EB] dark:border-[#1A1A1A] rounded-lg px-3 py-2 text-sm text-[#111111] dark:text-white" /></div>
                <div><label className="block text-xs text-[#9CA3AF] dark:text-[#737373] mb-1">{t('haccp.status')}</label><select value={lotForm.status} onChange={e => setLotForm(f => ({ ...f, status: e.target.value as LotRecord['status'] }))} className="w-full bg-[#FAFAFA] dark:bg-[#0A0A0A] border border-[#E5E7EB] dark:border-[#1A1A1A] rounded-lg px-3 py-2 text-sm text-[#111111] dark:text-white"><option value="en_attente">{t('haccp.pending')}</option><option value="conforme">{t('haccp.compliantStatus')}</option><option value="non_conforme">{t('haccp.nonCompliantStatus')}</option></select></div>
              </div>
              <div className="flex gap-3">
                <button onClick={addLot} className="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-white rounded-xl text-sm font-medium transition-colors">{t('haccp.save')}</button>
                <button onClick={() => setShowLotForm(false)} className="px-4 py-2 bg-[#F3F4F6] dark:bg-[#171717] hover:bg-[#E5E7EB] dark:hover:bg-[#222] text-[#6B7280] dark:text-[#A3A3A3] rounded-xl text-sm font-medium transition-colors">{t('haccp.cancel')}</button>
              </div>
            </div>
          )}

          <div className="bg-white dark:bg-black/50 border border-[#E5E7EB] dark:border-[#1A1A1A] rounded-2xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead><tr className="text-[#9CA3AF] dark:text-[#737373] text-xs uppercase tracking-wider bg-[#FAFAFA] dark:bg-[#0A0A0A]/50">
                  <th className="text-left py-3 px-4">{t('haccp.lotNumber')}</th><th className="text-left py-3 px-4">{t('haccp.product')}</th><th className="text-left py-3 px-4">{t('haccp.supplier')}</th><th className="text-left py-3 px-4">{t('haccp.reception')}</th><th className="text-left py-3 px-4">{t('haccp.dlc')}</th><th className="text-left py-3 px-4">{t('haccp.ddm')}</th><th className="text-left py-3 px-4">{t('haccp.status')}</th>
                </tr></thead>
                <tbody>{filteredLots.map(l => (
                  <tr key={l.id} className="border-t border-[#E5E7EB] dark:border-[#1A1A1A]/50 hover:bg-[#F3F4F6] dark:hover:bg-[#171717]/30 transition-colors">
                    <td className="py-3 px-4 text-teal-400 font-mono text-xs font-semibold">{l.lotNumber}</td>
                    <td className="py-3 px-4 text-[#111111] dark:text-white font-medium">{l.product}</td>
                    <td className="py-3 px-4 text-[#9CA3AF] dark:text-[#737373]">{l.supplier}</td>
                    <td className="py-3 px-4 text-[#9CA3AF] dark:text-[#737373]">{new Date(l.receptionDate).toLocaleDateString('fr-FR')}</td>
                    <td className="py-3 px-4 text-[#6B7280] dark:text-[#A3A3A3]">{l.dlc ? new Date(l.dlc).toLocaleDateString('fr-FR') : '-'}</td>
                    <td className="py-3 px-4 text-[#9CA3AF] dark:text-[#737373]">{l.ddm ? new Date(l.ddm).toLocaleDateString('fr-FR') : '-'}</td>
                    <td className="py-3 px-4"><span className={`px-2.5 py-0.5 rounded-lg text-xs font-semibold ${STATUS_BADGE[l.status]}`}>{STATUS_LABELS[l.status]}</span></td>
                  </tr>
                ))}</tbody>
              </table>
            </div>
            {filteredLots.length === 0 && <div className="text-center py-8 text-[#9CA3AF] dark:text-[#737373]">{t('haccp.noLotsFound')}</div>}
          </div>
        </div>
      )}

      {/* ═══ ALERTES DLUO ═══ */}
      {activeTab === 'alertes' && (
        <div className="space-y-4">
          <div className="bg-white dark:bg-black/50 border border-[#E5E7EB] dark:border-[#1A1A1A] rounded-2xl p-4">
            <h3 className="text-sm font-semibold text-[#111111] dark:text-white mb-3">{t('haccp.legend')}</h3>
            <div className="flex flex-wrap gap-4 text-xs">
              <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-red-500" /><span className="text-[#9CA3AF] dark:text-[#737373]">{t('haccp.expiredOrD1')}</span></div>
              <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-amber-500" /><span className="text-[#9CA3AF] dark:text-[#737373]">{t('haccp.d2ToD3')}</span></div>
              <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-emerald-500" /><span className="text-[#9CA3AF] dark:text-[#737373]">{t('haccp.d4Plus')}</span></div>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {dluoAlerts.map(a => (
              <div key={a.id} className={`bg-white dark:bg-black/50 border rounded-2xl p-5 transition-all ${a.daysRemaining <= 1 ? 'border-red-700/50 shadow-[0_0_15px_rgba(220,38,38,0.1)]' : a.daysRemaining <= 3 ? 'border-amber-700/50' : 'border-[#E5E7EB] dark:border-[#1A1A1A]'}`}>
                <div className="flex items-start justify-between mb-3">
                  <div><h4 className="text-[#111111] dark:text-white font-semibold">{a.product}</h4><p className="text-xs text-[#9CA3AF] dark:text-[#737373] font-mono">{a.lotNumber}</p></div>
                  <span className={`px-2.5 py-1 rounded-lg text-xs font-bold ${getDluoBadge(a.daysRemaining)}`}>{getDluoLabel(a.daysRemaining)}</span>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between"><span className="text-[#9CA3AF] dark:text-[#737373]">{t('haccp.dlc')}</span><span className="text-[#6B7280] dark:text-[#A3A3A3]">{new Date(a.dlc).toLocaleDateString('fr-FR')}</span></div>
                  <div className="flex justify-between"><span className="text-[#9CA3AF] dark:text-[#737373]">{t('haccp.quantity')}</span><span className="text-[#6B7280] dark:text-[#A3A3A3]">{a.quantity}</span></div>
                </div>
                {a.daysRemaining <= 1 && (
                  <div className="mt-3 flex items-center gap-2 text-xs text-red-400 bg-red-900/20 px-3 py-2 rounded-lg">
                    <AlertTriangle className="w-3.5 h-3.5 flex-shrink-0" />
                    {a.daysRemaining <= 0 ? t('haccp.expiredRemoveNow') : t('haccp.consumeOrRemoveToday')}
                  </div>
                )}
              </div>
            ))}
          </div>
          {dluoAlerts.length === 0 && (
            <div className="bg-white dark:bg-black/50 border border-[#E5E7EB] dark:border-[#1A1A1A] rounded-2xl p-12 text-center">
              <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto mb-3" />
              <p className="text-[#111111] dark:text-white font-semibold">Aucune alerte DLC</p>
              <p className="text-sm text-[#9CA3AF] dark:text-[#737373] mt-1">Tous les produits sont dans les delais</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
