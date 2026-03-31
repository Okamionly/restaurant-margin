import { useState, useMemo, useEffect, useCallback } from 'react';
import {
  Thermometer, Plus, ShieldCheck, AlertTriangle, Clock,
  CheckCircle2, XCircle, Package, SprayCan, BarChart3, Search
} from 'lucide-react';

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

type TabKey = 'dashboard' | 'temperatures' | 'lots' | 'alertes' | 'nettoyage';

// ─── Constants ───────────────────────────────────────────────────────────────

const ZONE_LABELS: Record<string, string> = {
  frigo: 'Frigo (+)',
  congelateur: 'Congélateur (-)',
  plat_chaud: 'Plats chauds',
  reception: 'Réception marchandise',
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

// ─── Helpers ─────────────────────────────────────────────────────────────────

function getTempColor(zone: string, temp: number): 'emerald' | 'amber' | 'red' | 'slate' {
  if (zone === 'congelateur') return temp <= -18 ? 'emerald' : temp <= -15 ? 'amber' : 'red';
  if (zone === 'frigo') return temp < 4 ? 'emerald' : temp <= 7 ? 'amber' : 'red';
  if (zone === 'plat_chaud') return temp >= 63 ? 'emerald' : temp >= 55 ? 'amber' : 'red';
  return 'slate';
}

const TEMP_TEXT: Record<string, string> = { emerald: 'text-emerald-400', amber: 'text-amber-400', red: 'text-red-400', slate: 'text-slate-400' };
const TEMP_BADGE: Record<string, string> = { emerald: 'bg-emerald-900/40 text-emerald-300', amber: 'bg-amber-900/40 text-amber-300', red: 'bg-red-900/40 text-red-300', slate: 'bg-slate-800 text-slate-300' };
const TEMP_STATUS: Record<string, string> = { emerald: 'OK', amber: 'Attention', red: 'Danger', slate: '-' };

function getDluoBadge(days: number) {
  if (days <= 1) return 'bg-red-900/40 text-red-300 border border-red-700/50';
  if (days <= 3) return 'bg-amber-900/40 text-amber-300 border border-amber-700/50';
  return 'bg-emerald-900/40 text-emerald-300 border border-emerald-700/50';
}

function getDluoLabel(days: number) {
  if (days <= 0) return 'EXPIRÉ';
  return `J-${days}`;
}

// (seed data removed — starts empty, loaded from API)

// ─── API helpers ────────────────────────────────────────────────────────────

function getAuthHeaders(): Record<string, string> {
  const token = localStorage.getItem('token');
  const rid = localStorage.getItem('activeRestaurantId');
  const headers: Record<string, string> = { 'Content-Type': 'application/json' };
  if (token) headers['Authorization'] = `Bearer ${token}`;
  if (rid) headers['X-Restaurant-Id'] = rid;
  return headers;
}

// ─── Component ───────────────────────────────────────────────────────────────

export default function HACCP() {
  const [activeTab, setActiveTab] = useState<TabKey>('dashboard');
  const [temperatures, setTemperatures] = useState<TemperatureRecord[]>([]);
  const [lots, setLots] = useState<LotRecord[]>([]);
  const [dluoAlerts] = useState<DluoAlert[]>([]);
  const [cleaning, setCleaning] = useState<CleaningRecord[]>([]);

  const [showTempForm, setShowTempForm] = useState(false);
  const [tempForm, setTempForm] = useState({ zone: 'frigo' as TemperatureRecord['zone'], temperature: '', agent: '', notes: '' });
  const [showLotForm, setShowLotForm] = useState(false);
  const [lotForm, setLotForm] = useState({ lotNumber: '', product: '', supplier: '', dlc: '', ddm: '', status: 'en_attente' as LotRecord['status'] });
  const [searchLots, setSearchLots] = useState('');

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

  const loadSummary = useCallback(async () => {
    try {
      const res = await fetch('/api/haccp/summary', { headers: getAuthHeaders() });
      if (!res.ok) throw new Error('Failed to load summary');
      // Summary data can be used to enrich dashboard stats if backend provides it
      // For now the stats are computed client-side from temperatures/cleaning/lots
      await res.json();
    } catch {
      // Silently fall back to client-side computed stats
    }
  }, []);

  useEffect(() => {
    loadTemperatures();
    loadCleanings();
    loadSummary();
  }, [loadTemperatures, loadCleanings, loadSummary]);

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
        // Map backend response to frontend shape
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
    // Optimistic update
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
      // Already updated locally, no rollback needed for UX
    }
  }

  const filteredLots = useMemo(() => {
    if (!searchLots) return lots;
    const q = searchLots.toLowerCase();
    return lots.filter(l => l.lotNumber.toLowerCase().includes(q) || l.product.toLowerCase().includes(q) || l.supplier.toLowerCase().includes(q));
  }, [lots, searchLots]);

  const tabs: { key: TabKey; label: string; icon: React.ReactNode }[] = [
    { key: 'dashboard', label: 'Dashboard', icon: <BarChart3 className="w-4 h-4" /> },
    { key: 'temperatures', label: 'Températures', icon: <Thermometer className="w-4 h-4" /> },
    { key: 'lots', label: 'Traçabilité', icon: <Package className="w-4 h-4" /> },
    { key: 'alertes', label: 'Alertes DLUO', icon: <AlertTriangle className="w-4 h-4" /> },
    { key: 'nettoyage', label: 'Nettoyage', icon: <SprayCan className="w-4 h-4" /> },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-white flex items-center gap-3">
          <ShieldCheck className="w-7 h-7 text-emerald-400" />
          HACCP & Traçabilité
        </h1>
        <p className="text-slate-400 mt-1">Sécurité alimentaire, températures, lots et nettoyage</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-slate-900/50 p-1 rounded-xl border border-slate-800 overflow-x-auto">
        {tabs.map(tab => (
          <button key={tab.key} onClick={() => setActiveTab(tab.key)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${activeTab === tab.key ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-400 hover:text-white hover:bg-slate-800'}`}>
            {tab.icon}{tab.label}
          </button>
        ))}
      </div>

      {/* ═══ DASHBOARD ═══ */}
      {activeTab === 'dashboard' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Conformité */}
            <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-5">
              <div className="flex items-center justify-between mb-3">
                <span className="text-slate-400 text-sm">Conformité températures</span>
                <Thermometer className="w-5 h-5 text-blue-400" />
              </div>
              <div className={`text-3xl font-bold ${stats.rate >= 90 ? 'text-emerald-400' : stats.rate >= 70 ? 'text-amber-400' : 'text-red-400'}`}>{stats.rate}%</div>
              <div className="text-xs text-slate-500 mt-1">{stats.total} relevés</div>
              <div className="mt-3 h-2 bg-slate-800 rounded-full overflow-hidden">
                <div className={`h-full rounded-full ${stats.rate >= 90 ? 'bg-emerald-500' : stats.rate >= 70 ? 'bg-amber-500' : 'bg-red-500'}`} style={{ width: `${stats.rate}%` }} />
              </div>
            </div>
            {/* Alertes */}
            <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-5">
              <div className="flex items-center justify-between mb-3">
                <span className="text-slate-400 text-sm">Alertes DLUO</span>
                <AlertTriangle className="w-5 h-5 text-amber-400" />
              </div>
              <div className="text-3xl font-bold text-amber-400">{stats.activeAlerts}</div>
              <div className="text-xs text-slate-500 mt-1">dont {stats.expired} expiré{stats.expired > 1 ? 's' : ''}</div>
              {stats.expired > 0 && <div className="mt-3 flex items-center gap-2 text-xs text-red-400 bg-red-900/20 px-2 py-1 rounded-lg"><XCircle className="w-3.5 h-3.5" />Action requise</div>}
            </div>
            {/* Nettoyage */}
            <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-5">
              <div className="flex items-center justify-between mb-3">
                <span className="text-slate-400 text-sm">Nettoyage du jour</span>
                <SprayCan className="w-5 h-5 text-violet-400" />
              </div>
              <div className={`text-3xl font-bold ${stats.cleanRate === 100 ? 'text-emerald-400' : stats.cleanRate >= 50 ? 'text-amber-400' : 'text-red-400'}`}>{stats.cleanRate}%</div>
              <div className="text-xs text-slate-500 mt-1">{stats.cleanDone}/{stats.cleanTotal} zones</div>
              <div className="mt-3 h-2 bg-slate-800 rounded-full overflow-hidden">
                <div className={`h-full rounded-full ${stats.cleanRate === 100 ? 'bg-emerald-500' : stats.cleanRate >= 50 ? 'bg-amber-500' : 'bg-red-500'}`} style={{ width: `${stats.cleanRate}%` }} />
              </div>
            </div>
            {/* Lots */}
            <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-5">
              <div className="flex items-center justify-between mb-3">
                <span className="text-slate-400 text-sm">Lots reçus</span>
                <Package className="w-5 h-5 text-cyan-400" />
              </div>
              <div className="text-3xl font-bold text-white">{lots.length}</div>
              <div className="text-xs text-slate-500 mt-1">{stats.lotsOk} conformes, {stats.lotsKo} non-conforme{stats.lotsKo > 1 ? 's' : ''}</div>
              {stats.lotsKo > 0 && <div className="mt-3 flex items-center gap-2 text-xs text-red-400 bg-red-900/20 px-2 py-1 rounded-lg"><XCircle className="w-3.5 h-3.5" />{stats.lotsKo} lot(s) à vérifier</div>}
            </div>
          </div>

          {/* Recent temps */}
          <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-5">
            <h3 className="text-white font-semibold mb-4 flex items-center gap-2"><Thermometer className="w-5 h-5 text-blue-400" />Derniers relevés</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead><tr className="text-slate-400 text-xs uppercase tracking-wider border-b border-slate-800">
                  <th className="text-left py-3 px-3">Zone</th><th className="text-left py-3 px-3">Temp.</th><th className="text-left py-3 px-3">Heure</th><th className="text-left py-3 px-3">Agent</th>
                </tr></thead>
                <tbody>{temperatures.slice(0, 6).map(t => {
                  const c = getTempColor(t.zone, t.temperature);
                  return (<tr key={t.id} className="border-b border-slate-800/50 hover:bg-slate-800/30 transition-colors">
                    <td className="py-2.5 px-3 text-slate-300">{ZONE_LABELS[t.zone]}</td>
                    <td className="py-2.5 px-3"><span className={`px-2 py-0.5 rounded-lg text-xs font-semibold ${TEMP_BADGE[c]}`}>{t.temperature}°C</span></td>
                    <td className="py-2.5 px-3 text-slate-400">{new Date(t.timestamp).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}</td>
                    <td className="py-2.5 px-3 text-slate-400">{t.agent}</td>
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
          <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-4">
            <h3 className="text-sm font-semibold text-white mb-3">Zones de danger réglementaires</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div className="flex items-start gap-2"><div className="w-3 h-3 rounded-full bg-emerald-500 mt-0.5 flex-shrink-0" /><div><div className="text-emerald-400 font-medium">Conforme</div><div className="text-slate-500">Frigo &lt;4°C | Congél. &le;-18°C | Chaud &ge;63°C</div></div></div>
              <div className="flex items-start gap-2"><div className="w-3 h-3 rounded-full bg-amber-500 mt-0.5 flex-shrink-0" /><div><div className="text-amber-400 font-medium">Attention</div><div className="text-slate-500">Frigo 4-7°C | Congél. -18 à -15°C | Chaud 55-63°C</div></div></div>
              <div className="flex items-start gap-2"><div className="w-3 h-3 rounded-full bg-red-500 mt-0.5 flex-shrink-0" /><div><div className="text-red-400 font-medium">Danger</div><div className="text-slate-500">Frigo &gt;7°C | Congél. &gt;-15°C | Chaud &lt;55°C</div></div></div>
            </div>
          </div>

          <div className="flex justify-end">
            <button onClick={() => setShowTempForm(!showTempForm)} className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-medium transition-colors">
              <Plus className="w-4 h-4" />Nouveau relevé
            </button>
          </div>

          {showTempForm && (
            <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-5 space-y-4">
              <h3 className="text-white font-semibold">Enregistrer un relevé</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div><label className="block text-xs text-slate-400 mb-1">Zone</label>
                  <select value={tempForm.zone} onChange={e => setTempForm(f => ({ ...f, zone: e.target.value as TemperatureRecord['zone'] }))} className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white">
                    {Object.entries(ZONE_LABELS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
                  </select></div>
                <div><label className="block text-xs text-slate-400 mb-1">Température (°C)</label>
                  <input type="number" step="0.1" value={tempForm.temperature} onChange={e => setTempForm(f => ({ ...f, temperature: e.target.value }))} placeholder="Ex: 3.5" className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white placeholder:text-slate-600" /></div>
                <div><label className="block text-xs text-slate-400 mb-1">Agent</label>
                  <input type="text" value={tempForm.agent} onChange={e => setTempForm(f => ({ ...f, agent: e.target.value }))} placeholder="Votre nom" className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white placeholder:text-slate-600" /></div>
                <div><label className="block text-xs text-slate-400 mb-1">Notes</label>
                  <input type="text" value={tempForm.notes} onChange={e => setTempForm(f => ({ ...f, notes: e.target.value }))} placeholder="Optionnel" className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white placeholder:text-slate-600" /></div>
              </div>
              <div className="flex gap-3">
                <button onClick={addTemp} className="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-white rounded-xl text-sm font-medium transition-colors">Enregistrer</button>
                <button onClick={() => setShowTempForm(false)} className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-slate-300 rounded-xl text-sm font-medium transition-colors">Annuler</button>
              </div>
            </div>
          )}

          <div className="bg-slate-900/50 border border-slate-800 rounded-2xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead><tr className="text-slate-400 text-xs uppercase tracking-wider bg-slate-800/50">
                  <th className="text-left py-3 px-4">Zone</th><th className="text-left py-3 px-4">Temp.</th><th className="text-left py-3 px-4">Statut</th><th className="text-left py-3 px-4">Date & Heure</th><th className="text-left py-3 px-4">Agent</th><th className="text-left py-3 px-4">Notes</th>
                </tr></thead>
                <tbody>{temperatures.map(t => {
                  const c = getTempColor(t.zone, t.temperature);
                  return (<tr key={t.id} className="border-t border-slate-800/50 hover:bg-slate-800/30 transition-colors">
                    <td className="py-3 px-4 text-slate-300 font-medium">{ZONE_LABELS[t.zone]}</td>
                    <td className={`py-3 px-4 font-bold ${TEMP_TEXT[c]}`}>{t.temperature}°C</td>
                    <td className="py-3 px-4"><span className={`px-2 py-0.5 rounded-lg text-xs font-semibold ${TEMP_BADGE[c]}`}>{TEMP_STATUS[c]}</span></td>
                    <td className="py-3 px-4 text-slate-400">{new Date(t.timestamp).toLocaleDateString('fr-FR')} {new Date(t.timestamp).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}</td>
                    <td className="py-3 px-4 text-slate-400">{t.agent}</td>
                    <td className="py-3 px-4 text-slate-500">{t.notes || '-'}</td>
                  </tr>);
                })}</tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ═══ TRACABILITE ═══ */}
      {activeTab === 'lots' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-3 justify-between">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
              <input type="text" value={searchLots} onChange={e => setSearchLots(e.target.value)} placeholder="Rechercher un lot, produit, fournisseur..." className="w-full bg-slate-800 border border-slate-700 rounded-lg pl-10 pr-3 py-2.5 text-sm text-white placeholder:text-slate-600" />
            </div>
            <button onClick={() => setShowLotForm(!showLotForm)} className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-medium transition-colors"><Plus className="w-4 h-4" />Nouveau lot</button>
          </div>

          {showLotForm && (
            <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-5 space-y-4">
              <h3 className="text-white font-semibold">Enregistrer un lot</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <div><label className="block text-xs text-slate-400 mb-1">N° de lot</label><input type="text" value={lotForm.lotNumber} onChange={e => setLotForm(f => ({ ...f, lotNumber: e.target.value }))} placeholder="LOT-XXXX" className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white placeholder:text-slate-600" /></div>
                <div><label className="block text-xs text-slate-400 mb-1">Produit</label><input type="text" value={lotForm.product} onChange={e => setLotForm(f => ({ ...f, product: e.target.value }))} placeholder="Nom du produit" className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white placeholder:text-slate-600" /></div>
                <div><label className="block text-xs text-slate-400 mb-1">Fournisseur</label><input type="text" value={lotForm.supplier} onChange={e => setLotForm(f => ({ ...f, supplier: e.target.value }))} placeholder="Fournisseur" className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white placeholder:text-slate-600" /></div>
                <div><label className="block text-xs text-slate-400 mb-1">DLC</label><input type="date" value={lotForm.dlc} onChange={e => setLotForm(f => ({ ...f, dlc: e.target.value }))} className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white" /></div>
                <div><label className="block text-xs text-slate-400 mb-1">DDM (optionnel)</label><input type="date" value={lotForm.ddm} onChange={e => setLotForm(f => ({ ...f, ddm: e.target.value }))} className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white" /></div>
                <div><label className="block text-xs text-slate-400 mb-1">Statut</label><select value={lotForm.status} onChange={e => setLotForm(f => ({ ...f, status: e.target.value as LotRecord['status'] }))} className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white"><option value="en_attente">En attente</option><option value="conforme">Conforme</option><option value="non_conforme">Non conforme</option></select></div>
              </div>
              <div className="flex gap-3">
                <button onClick={addLot} className="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-white rounded-xl text-sm font-medium transition-colors">Enregistrer</button>
                <button onClick={() => setShowLotForm(false)} className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-slate-300 rounded-xl text-sm font-medium transition-colors">Annuler</button>
              </div>
            </div>
          )}

          <div className="bg-slate-900/50 border border-slate-800 rounded-2xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead><tr className="text-slate-400 text-xs uppercase tracking-wider bg-slate-800/50">
                  <th className="text-left py-3 px-4">N° Lot</th><th className="text-left py-3 px-4">Produit</th><th className="text-left py-3 px-4">Fournisseur</th><th className="text-left py-3 px-4">Réception</th><th className="text-left py-3 px-4">DLC</th><th className="text-left py-3 px-4">DDM</th><th className="text-left py-3 px-4">Statut</th>
                </tr></thead>
                <tbody>{filteredLots.map(l => (
                  <tr key={l.id} className="border-t border-slate-800/50 hover:bg-slate-800/30 transition-colors">
                    <td className="py-3 px-4 text-blue-400 font-mono text-xs font-semibold">{l.lotNumber}</td>
                    <td className="py-3 px-4 text-white font-medium">{l.product}</td>
                    <td className="py-3 px-4 text-slate-400">{l.supplier}</td>
                    <td className="py-3 px-4 text-slate-400">{new Date(l.receptionDate).toLocaleDateString('fr-FR')}</td>
                    <td className="py-3 px-4 text-slate-300">{l.dlc ? new Date(l.dlc).toLocaleDateString('fr-FR') : '-'}</td>
                    <td className="py-3 px-4 text-slate-500">{l.ddm ? new Date(l.ddm).toLocaleDateString('fr-FR') : '-'}</td>
                    <td className="py-3 px-4"><span className={`px-2.5 py-0.5 rounded-lg text-xs font-semibold ${STATUS_BADGE[l.status]}`}>{STATUS_LABELS[l.status]}</span></td>
                  </tr>
                ))}</tbody>
              </table>
            </div>
            {filteredLots.length === 0 && <div className="text-center py-8 text-slate-500">Aucun lot trouvé</div>}
          </div>
        </div>
      )}

      {/* ═══ ALERTES DLUO ═══ */}
      {activeTab === 'alertes' && (
        <div className="space-y-4">
          <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-4">
            <h3 className="text-sm font-semibold text-white mb-3">Légende</h3>
            <div className="flex flex-wrap gap-4 text-xs">
              <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-red-500" /><span className="text-slate-400">Expiré ou J-1</span></div>
              <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-amber-500" /><span className="text-slate-400">J-2 à J-3</span></div>
              <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-emerald-500" /><span className="text-slate-400">J-4+</span></div>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {dluoAlerts.map(a => (
              <div key={a.id} className={`bg-slate-900/50 border rounded-2xl p-5 transition-all ${a.daysRemaining <= 1 ? 'border-red-700/50 shadow-[0_0_15px_rgba(220,38,38,0.1)]' : a.daysRemaining <= 3 ? 'border-amber-700/50' : 'border-slate-800'}`}>
                <div className="flex items-start justify-between mb-3">
                  <div><h4 className="text-white font-semibold">{a.product}</h4><p className="text-xs text-slate-500 font-mono">{a.lotNumber}</p></div>
                  <span className={`px-2.5 py-1 rounded-lg text-xs font-bold ${getDluoBadge(a.daysRemaining)}`}>{getDluoLabel(a.daysRemaining)}</span>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between"><span className="text-slate-500">DLC</span><span className="text-slate-300">{new Date(a.dlc).toLocaleDateString('fr-FR')}</span></div>
                  <div className="flex justify-between"><span className="text-slate-500">Quantité</span><span className="text-slate-300">{a.quantity}</span></div>
                </div>
                {a.daysRemaining <= 1 && (
                  <div className="mt-3 flex items-center gap-2 text-xs text-red-400 bg-red-900/20 px-3 py-2 rounded-lg">
                    <AlertTriangle className="w-3.5 h-3.5 flex-shrink-0" />
                    {a.daysRemaining <= 0 ? 'Produit expiré — retirer immédiatement' : 'À consommer ou retirer aujourd\'hui'}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ═══ NETTOYAGE ═══ */}
      {activeTab === 'nettoyage' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-white font-semibold flex items-center gap-2"><SprayCan className="w-5 h-5 text-violet-400" />Registre de nettoyage — {new Date().toLocaleDateString('fr-FR')}</h3>
            <div className="text-sm text-slate-400">{cleaning.filter(c => c.verified).length}/{cleaning.length} zones</div>
          </div>
          <div className="bg-slate-900/50 border border-slate-800 rounded-2xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead><tr className="text-slate-400 text-xs uppercase tracking-wider bg-slate-800/50">
                  <th className="text-left py-3 px-4 w-8">Fait</th><th className="text-left py-3 px-4">Zone</th><th className="text-left py-3 px-4">Heure</th><th className="text-left py-3 px-4">Agent</th><th className="text-left py-3 px-4">Statut</th>
                </tr></thead>
                <tbody>{cleaning.map(c => (
                  <tr key={c.id} className="border-t border-slate-800/50 hover:bg-slate-800/30 transition-colors">
                    <td className="py-3 px-4">
                      <button onClick={() => toggleClean(c.id)} className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all ${c.verified ? 'bg-emerald-500 border-emerald-500 text-white' : 'border-slate-600 hover:border-slate-500'}`}>
                        {c.verified && <CheckCircle2 className="w-4 h-4" />}
                      </button>
                    </td>
                    <td className="py-3 px-4 text-white font-medium">{c.zone}</td>
                    <td className="py-3 px-4 text-slate-400">{c.time || '-'}</td>
                    <td className="py-3 px-4 text-slate-400">{c.agent || '-'}</td>
                    <td className="py-3 px-4">
                      {c.verified
                        ? <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg text-xs font-semibold bg-emerald-900/40 text-emerald-300"><CheckCircle2 className="w-3 h-3" />Nettoyé</span>
                        : <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg text-xs font-semibold bg-slate-800 text-slate-400"><Clock className="w-3 h-3" />En attente</span>}
                    </td>
                  </tr>
                ))}</tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
