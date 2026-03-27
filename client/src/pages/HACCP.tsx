import { useState, useMemo } from 'react';
import {
  Thermometer, ShieldCheck, CalendarClock, SprayCan, FileDown,
  Plus, AlertTriangle, CheckCircle2, XCircle, Clock, Trash2,
  ClipboardCheck, TrendingUp, ChevronDown, ChevronUp
} from 'lucide-react';
import { useToast } from '../hooks/useToast';
import Modal from '../components/Modal';

// ─── Types ───────────────────────────────────────────────────────────────────

interface TemperatureReading {
  id: number;
  lieu: string;
  temperature: number;
  heure: string;
  conforme: boolean;
  actionCorrective: string;
}

interface DLCProduct {
  id: number;
  produit: string;
  dateReception: string;
  dlc: string;
  type: 'DLC' | 'DLUO';
}

interface CleaningTask {
  id: number;
  zone: string;
  tache: string;
  frequence: 'quotidien' | 'hebdomadaire' | 'mensuel';
  fait: boolean;
  horodatage: string | null;
}

type TabKey = 'temperatures' | 'dlc' | 'nettoyage';

// ─── Helpers ─────────────────────────────────────────────────────────────────

const LOCATIONS = [
  'Frigo 1', 'Frigo 2', 'Congélateur', 'Chambre froide',
  'Vitrine réfrigérée', 'Bain-marie'
];

function isTemperatureConforme(lieu: string, temp: number): boolean {
  const l = lieu.toLowerCase();
  if (l.includes('congél') || l.includes('chambre froide')) return temp <= -18;
  if (l.includes('bain-marie')) return temp >= 63;
  return temp >= 0 && temp <= 4;
}

function temperatureRange(lieu: string): string {
  const l = lieu.toLowerCase();
  if (l.includes('congél') || l.includes('chambre froide')) return '≤ -18°C';
  if (l.includes('bain-marie')) return '≥ 63°C';
  return '0 – 4°C';
}

function joursRestants(dlc: string): number {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const target = new Date(dlc);
  target.setHours(0, 0, 0, 0);
  return Math.ceil((target.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
}

function dlcColor(jours: number): string {
  if (jours < 0) return 'bg-gray-900 text-white dark:bg-black';
  if (jours < 3) return 'bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-300';
  if (jours <= 7) return 'bg-orange-100 text-orange-800 dark:bg-orange-900/40 dark:text-orange-300';
  return 'bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300';
}

function dlcLabel(jours: number): string {
  if (jours < 0) return 'Expiré';
  if (jours === 0) return "Aujourd'hui";
  if (jours < 3) return 'Urgent';
  if (jours <= 7) return 'Attention';
  return 'OK';
}

const now = () => new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
const today = () => new Date().toISOString().split('T')[0];

// ─── Default cleaning tasks ─────────────────────────────────────────────────

const DEFAULT_CLEANING: Omit<CleaningTask, 'id'>[] = [
  { zone: 'Cuisine', tache: 'Nettoyage des plans de travail', frequence: 'quotidien', fait: false, horodatage: null },
  { zone: 'Cuisine', tache: 'Nettoyage des équipements (four, plaque)', frequence: 'quotidien', fait: false, horodatage: null },
  { zone: 'Cuisine', tache: 'Nettoyage des sols', frequence: 'quotidien', fait: false, horodatage: null },
  { zone: 'Chambre froide', tache: 'Nettoyage et vérification des étagères', frequence: 'hebdomadaire', fait: false, horodatage: null },
  { zone: 'Chambre froide', tache: 'Dégivrage et nettoyage complet', frequence: 'mensuel', fait: false, horodatage: null },
  { zone: 'Salle', tache: 'Nettoyage des tables et chaises', frequence: 'quotidien', fait: false, horodatage: null },
  { zone: 'Sanitaires', tache: 'Désinfection complète', frequence: 'quotidien', fait: false, horodatage: null },
  { zone: 'Stockage', tache: 'Rangement et nettoyage des étagères', frequence: 'hebdomadaire', fait: false, horodatage: null },
  { zone: 'Poubelles', tache: 'Nettoyage et désinfection des bacs', frequence: 'quotidien', fait: false, horodatage: null },
  { zone: 'Hotte', tache: 'Nettoyage des filtres de hotte', frequence: 'hebdomadaire', fait: false, horodatage: null },
  { zone: 'Hotte', tache: 'Nettoyage complet de la hotte', frequence: 'mensuel', fait: false, horodatage: null },
];

let nextId = 1;
function genId() { return nextId++; }

// ─── Component ───────────────────────────────────────────────────────────────

export default function HACCP() {
  const { showToast } = useToast();
  const [activeTab, setActiveTab] = useState<TabKey>('temperatures');

  // Temperature state
  const [readings, setReadings] = useState<TemperatureReading[]>([]);
  const [showTempModal, setShowTempModal] = useState(false);
  const [tempForm, setTempForm] = useState({ lieu: LOCATIONS[0], temperature: '', actionCorrective: '' });

  // DLC state
  const [products, setProducts] = useState<DLCProduct[]>([]);
  const [showDLCModal, setShowDLCModal] = useState(false);
  const [dlcForm, setDlcForm] = useState({ produit: '', dateReception: today(), dlc: '', type: 'DLC' as 'DLC' | 'DLUO' });

  // Cleaning state
  const [cleaning, setCleaning] = useState<CleaningTask[]>(
    DEFAULT_CLEANING.map(t => ({ ...t, id: genId() }))
  );
  const [cleaningFilter, setCleaningFilter] = useState<'all' | 'quotidien' | 'hebdomadaire' | 'mensuel'>('all');

  // ── Summary stats ──────────────────────────────────────────────────────────

  const todayReadings = readings.filter(r => {
    const rDate = r.heure.split(' ')[0];
    return rDate === today() || true; // In local-only mode, count all
  });

  const dlcAlerts = useMemo(() => products.filter(p => joursRestants(p.dlc) < 3).length, [products]);

  const cleaningProgress = useMemo(() => {
    if (cleaning.length === 0) return 0;
    return Math.round((cleaning.filter(c => c.fait).length / cleaning.length) * 100);
  }, [cleaning]);

  const dernierControle = useMemo(() => {
    if (readings.length === 0) return '—';
    return readings[readings.length - 1].heure;
  }, [readings]);

  // ── Temperature handlers ───────────────────────────────────────────────────

  function handleAddTemperature() {
    const temp = parseFloat(tempForm.temperature);
    if (isNaN(temp)) {
      showToast('Veuillez entrer une température valide', 'error');
      return;
    }
    const conforme = isTemperatureConforme(tempForm.lieu, temp);
    const reading: TemperatureReading = {
      id: genId(),
      lieu: tempForm.lieu,
      temperature: temp,
      heure: `${today()} ${now()}`,
      conforme,
      actionCorrective: conforme ? '' : tempForm.actionCorrective,
    };
    setReadings(prev => [reading, ...prev]);
    setShowTempModal(false);
    setTempForm({ lieu: LOCATIONS[0], temperature: '', actionCorrective: '' });
    showToast(conforme ? 'Relevé conforme enregistré' : 'Relevé NON conforme enregistré', conforme ? 'success' : 'error');
  }

  // ── DLC handlers ───────────────────────────────────────────────────────────

  function handleAddProduct() {
    if (!dlcForm.produit || !dlcForm.dlc) {
      showToast('Veuillez remplir tous les champs obligatoires', 'error');
      return;
    }
    const product: DLCProduct = {
      id: genId(),
      produit: dlcForm.produit,
      dateReception: dlcForm.dateReception,
      dlc: dlcForm.dlc,
      type: dlcForm.type,
    };
    setProducts(prev => [product, ...prev]);
    setShowDLCModal(false);
    setDlcForm({ produit: '', dateReception: today(), dlc: '', type: 'DLC' });
    showToast('Produit ajouté au suivi DLC', 'success');
  }

  // ── Cleaning handlers ──────────────────────────────────────────────────────

  function toggleCleaning(id: number) {
    setCleaning(prev => prev.map(c => {
      if (c.id !== id) return c;
      const fait = !c.fait;
      return { ...c, fait, horodatage: fait ? `${today()} ${now()}` : null };
    }));
  }

  const filteredCleaning = useMemo(() => {
    if (cleaningFilter === 'all') return cleaning;
    return cleaning.filter(c => c.frequence === cleaningFilter);
  }, [cleaning, cleaningFilter]);

  // ── Export stub ────────────────────────────────────────────────────────────

  function handleExportPDF() {
    showToast('Export PDF en cours de préparation...', 'info');
    // Future: call backend or use jsPDF
  }

  // ── Temp conformance preview ───────────────────────────────────────────────

  const tempPreviewConforme = tempForm.temperature !== ''
    ? isTemperatureConforme(tempForm.lieu, parseFloat(tempForm.temperature))
    : null;

  // ─── Render ────────────────────────────────────────────────────────────────

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 dark:text-white flex items-center gap-2">
            <ShieldCheck className="w-7 h-7 text-emerald-600" />
            HACCP — Sécurité alimentaire
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Suivi des températures, DLC/DLUO et plan de nettoyage
          </p>
        </div>
        <button
          onClick={handleExportPDF}
          className="flex items-center gap-2 px-4 py-2 bg-slate-700 hover:bg-slate-800 text-white rounded-lg transition dark:bg-slate-600 dark:hover:bg-slate-500"
        >
          <FileDown className="w-4 h-4" />
          Exporter PDF
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <SummaryCard
          icon={<Thermometer className="w-5 h-5 text-blue-600" />}
          label="Relevés du jour"
          value={String(todayReadings.length)}
          sub="enregistrés"
          color="blue"
        />
        <SummaryCard
          icon={<AlertTriangle className="w-5 h-5 text-red-600" />}
          label="Alertes DLC"
          value={String(dlcAlerts)}
          sub="produits < 3 jours"
          color="red"
        />
        <SummaryCard
          icon={<SprayCan className="w-5 h-5 text-emerald-600" />}
          label="Nettoyage"
          value={`${cleaningProgress}%`}
          sub="complété"
          color="emerald"
          progress={cleaningProgress}
        />
        <SummaryCard
          icon={<Clock className="w-5 h-5 text-violet-600" />}
          label="Dernier contrôle"
          value={dernierControle}
          sub=""
          color="violet"
        />
      </div>

      {/* Tabs */}
      <div className="border-b border-slate-200 dark:border-slate-700">
        <nav className="flex gap-6">
          {([
            { key: 'temperatures' as TabKey, label: 'Températures', icon: <Thermometer className="w-4 h-4" /> },
            { key: 'dlc' as TabKey, label: 'DLC / DLUO', icon: <CalendarClock className="w-4 h-4" /> },
            { key: 'nettoyage' as TabKey, label: 'Plan de nettoyage', icon: <SprayCan className="w-4 h-4" /> },
          ]).map(tab => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`flex items-center gap-2 pb-3 px-1 text-sm font-medium border-b-2 transition-colors ${
                activeTab === tab.key
                  ? 'border-emerald-600 text-emerald-700 dark:text-emerald-400 dark:border-emerald-400'
                  : 'border-transparent text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200'
              }`}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      {activeTab === 'temperatures' && (
        <TemperatureSection
          readings={readings}
          onAdd={() => setShowTempModal(true)}
          onDelete={(id) => {
            setReadings(prev => prev.filter(r => r.id !== id));
            showToast('Relevé supprimé', 'info');
          }}
        />
      )}

      {activeTab === 'dlc' && (
        <DLCSection
          products={products}
          onAdd={() => setShowDLCModal(true)}
          onDelete={(id) => {
            setProducts(prev => prev.filter(p => p.id !== id));
            showToast('Produit retiré du suivi', 'info');
          }}
        />
      )}

      {activeTab === 'nettoyage' && (
        <CleaningSection
          tasks={filteredCleaning}
          filter={cleaningFilter}
          onFilterChange={setCleaningFilter}
          onToggle={toggleCleaning}
          progress={cleaningProgress}
        />
      )}

      {/* Temperature Modal */}
      <Modal isOpen={showTempModal} onClose={() => setShowTempModal(false)} title="Nouveau relevé de température">
        <div className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Lieu</label>
            <select
              value={tempForm.lieu}
              onChange={e => setTempForm(f => ({ ...f, lieu: e.target.value }))}
              className="w-full border border-slate-300 dark:border-slate-600 rounded-lg px-3 py-2 bg-white dark:bg-slate-700 text-slate-800 dark:text-white"
            >
              {LOCATIONS.map(loc => <option key={loc} value={loc}>{loc}</option>)}
            </select>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Plage conforme : {temperatureRange(tempForm.lieu)}
            </p>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Température (°C)</label>
            <input
              type="number"
              step="0.1"
              value={tempForm.temperature}
              onChange={e => setTempForm(f => ({ ...f, temperature: e.target.value }))}
              className="w-full border border-slate-300 dark:border-slate-600 rounded-lg px-3 py-2 bg-white dark:bg-slate-700 text-slate-800 dark:text-white"
              placeholder="ex: 3.5"
            />
            {tempPreviewConforme !== null && (
              <p className={`text-xs mt-1 font-medium ${tempPreviewConforme ? 'text-green-600' : 'text-red-600'}`}>
                {tempPreviewConforme ? '✓ Conforme' : '✗ Non conforme — action corrective requise'}
              </p>
            )}
          </div>
          {tempPreviewConforme === false && (
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Action corrective</label>
              <textarea
                value={tempForm.actionCorrective}
                onChange={e => setTempForm(f => ({ ...f, actionCorrective: e.target.value }))}
                rows={2}
                className="w-full border border-slate-300 dark:border-slate-600 rounded-lg px-3 py-2 bg-white dark:bg-slate-700 text-slate-800 dark:text-white"
                placeholder="Décrire l'action corrective prise..."
              />
            </div>
          )}
          <div className="flex justify-end gap-3 pt-2">
            <button
              onClick={() => setShowTempModal(false)}
              className="px-4 py-2 text-sm text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition"
            >
              Annuler
            </button>
            <button
              onClick={handleAddTemperature}
              className="px-4 py-2 text-sm bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition"
            >
              Enregistrer
            </button>
          </div>
        </div>
      </Modal>

      {/* DLC Modal */}
      <Modal isOpen={showDLCModal} onClose={() => setShowDLCModal(false)} title="Ajouter un produit au suivi DLC">
        <div className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Produit</label>
            <input
              type="text"
              value={dlcForm.produit}
              onChange={e => setDlcForm(f => ({ ...f, produit: e.target.value }))}
              className="w-full border border-slate-300 dark:border-slate-600 rounded-lg px-3 py-2 bg-white dark:bg-slate-700 text-slate-800 dark:text-white"
              placeholder="ex: Crème fraîche"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Date de réception</label>
              <input
                type="date"
                value={dlcForm.dateReception}
                onChange={e => setDlcForm(f => ({ ...f, dateReception: e.target.value }))}
                className="w-full border border-slate-300 dark:border-slate-600 rounded-lg px-3 py-2 bg-white dark:bg-slate-700 text-slate-800 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Type</label>
              <select
                value={dlcForm.type}
                onChange={e => setDlcForm(f => ({ ...f, type: e.target.value as 'DLC' | 'DLUO' }))}
                className="w-full border border-slate-300 dark:border-slate-600 rounded-lg px-3 py-2 bg-white dark:bg-slate-700 text-slate-800 dark:text-white"
              >
                <option value="DLC">DLC (Date Limite de Consommation)</option>
                <option value="DLUO">DLUO (Date de Durabilité Minimale)</option>
              </select>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Date limite</label>
            <input
              type="date"
              value={dlcForm.dlc}
              onChange={e => setDlcForm(f => ({ ...f, dlc: e.target.value }))}
              className="w-full border border-slate-300 dark:border-slate-600 rounded-lg px-3 py-2 bg-white dark:bg-slate-700 text-slate-800 dark:text-white"
            />
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <button
              onClick={() => setShowDLCModal(false)}
              className="px-4 py-2 text-sm text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition"
            >
              Annuler
            </button>
            <button
              onClick={handleAddProduct}
              className="px-4 py-2 text-sm bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition"
            >
              Ajouter
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

// ─── Sub-components ──────────────────────────────────────────────────────────

function SummaryCard({ icon, label, value, sub, color, progress }: {
  icon: React.ReactNode; label: string; value: string; sub: string; color: string; progress?: number;
}) {
  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-4">
      <div className="flex items-center gap-3 mb-2">
        <div className={`p-2 rounded-lg bg-${color}-50 dark:bg-${color}-900/20`}>{icon}</div>
        <span className="text-sm font-medium text-slate-600 dark:text-slate-400">{label}</span>
      </div>
      <p className="text-2xl font-bold text-slate-800 dark:text-white">{value}</p>
      {sub && <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{sub}</p>}
      {progress !== undefined && (
        <div className="mt-2 w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2">
          <div
            className="h-2 rounded-full bg-emerald-500 transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>
      )}
    </div>
  );
}

function TemperatureSection({ readings, onAdd, onDelete }: {
  readings: TemperatureReading[]; onAdd: () => void; onDelete: (id: number) => void;
}) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-slate-800 dark:text-white flex items-center gap-2">
          <Thermometer className="w-5 h-5 text-blue-600" />
          Relevés de température
        </h2>
        <button
          onClick={onAdd}
          className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-sm rounded-lg transition"
        >
          <Plus className="w-4 h-4" />
          Nouveau relevé
        </button>
      </div>

      {readings.length === 0 ? (
        <EmptyState message="Aucun relevé de température enregistré aujourd'hui." />
      ) : (
        <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-slate-50 dark:bg-slate-700/50 text-left">
                  <th className="px-4 py-3 font-medium text-slate-600 dark:text-slate-300">Lieu</th>
                  <th className="px-4 py-3 font-medium text-slate-600 dark:text-slate-300">Température</th>
                  <th className="px-4 py-3 font-medium text-slate-600 dark:text-slate-300">Plage</th>
                  <th className="px-4 py-3 font-medium text-slate-600 dark:text-slate-300">Heure</th>
                  <th className="px-4 py-3 font-medium text-slate-600 dark:text-slate-300">Conforme</th>
                  <th className="px-4 py-3 font-medium text-slate-600 dark:text-slate-300">Action corrective</th>
                  <th className="px-4 py-3 font-medium text-slate-600 dark:text-slate-300"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                {readings.map(r => (
                  <tr key={r.id} className={`${r.conforme ? '' : 'bg-red-50/50 dark:bg-red-900/10'}`}>
                    <td className="px-4 py-3 font-medium text-slate-800 dark:text-white">{r.lieu}</td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center gap-1 font-mono font-semibold ${
                        r.conforme ? 'text-green-700 dark:text-green-400' : 'text-red-700 dark:text-red-400'
                      }`}>
                        {r.temperature.toFixed(1)}°C
                      </span>
                    </td>
                    <td className="px-4 py-3 text-slate-500 dark:text-slate-400 text-xs">{temperatureRange(r.lieu)}</td>
                    <td className="px-4 py-3 text-slate-600 dark:text-slate-300">{r.heure}</td>
                    <td className="px-4 py-3">
                      {r.conforme ? (
                        <span className="inline-flex items-center gap-1 text-green-700 dark:text-green-400 bg-green-100 dark:bg-green-900/30 px-2 py-0.5 rounded-full text-xs font-medium">
                          <CheckCircle2 className="w-3 h-3" /> Oui
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-red-700 dark:text-red-400 bg-red-100 dark:bg-red-900/30 px-2 py-0.5 rounded-full text-xs font-medium">
                          <XCircle className="w-3 h-3" /> Non
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-slate-600 dark:text-slate-300 max-w-[200px] truncate">
                      {r.actionCorrective || '—'}
                    </td>
                    <td className="px-4 py-3">
                      <button onClick={() => onDelete(r.id)} className="text-slate-400 hover:text-red-500 transition">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

function DLCSection({ products, onAdd, onDelete }: {
  products: DLCProduct[]; onAdd: () => void; onDelete: (id: number) => void;
}) {
  const sorted = useMemo(() =>
    [...products].sort((a, b) => joursRestants(a.dlc) - joursRestants(b.dlc)),
    [products]
  );

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-slate-800 dark:text-white flex items-center gap-2">
          <CalendarClock className="w-5 h-5 text-orange-600" />
          {"Suivi DLC / DLUO"}
        </h2>
        <button
          onClick={onAdd}
          className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-sm rounded-lg transition"
        >
          <Plus className="w-4 h-4" />
          Ajouter un produit
        </button>
      </div>

      {sorted.length === 0 ? (
        <EmptyState message="Aucun produit suivi. Ajoutez des produits pour surveiller leurs dates limites." />
      ) : (
        <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-slate-50 dark:bg-slate-700/50 text-left">
                  <th className="px-4 py-3 font-medium text-slate-600 dark:text-slate-300">Produit</th>
                  <th className="px-4 py-3 font-medium text-slate-600 dark:text-slate-300">Type</th>
                  <th className="px-4 py-3 font-medium text-slate-600 dark:text-slate-300">Réception</th>
                  <th className="px-4 py-3 font-medium text-slate-600 dark:text-slate-300">Date limite</th>
                  <th className="px-4 py-3 font-medium text-slate-600 dark:text-slate-300">Jours restants</th>
                  <th className="px-4 py-3 font-medium text-slate-600 dark:text-slate-300">Statut</th>
                  <th className="px-4 py-3 font-medium text-slate-600 dark:text-slate-300"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                {sorted.map(p => {
                  const jours = joursRestants(p.dlc);
                  return (
                    <tr key={p.id} className={jours < 0 ? 'opacity-60' : ''}>
                      <td className="px-4 py-3 font-medium text-slate-800 dark:text-white">{p.produit}</td>
                      <td className="px-4 py-3">
                        <span className="text-xs font-medium px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300">
                          {p.type}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-slate-600 dark:text-slate-300">{p.dateReception}</td>
                      <td className="px-4 py-3 text-slate-600 dark:text-slate-300 font-mono">{p.dlc}</td>
                      <td className="px-4 py-3 font-semibold">
                        <span className={jours < 0 ? 'text-gray-500' : jours < 3 ? 'text-red-600 dark:text-red-400' : jours <= 7 ? 'text-orange-600 dark:text-orange-400' : 'text-green-600 dark:text-green-400'}>
                          {jours < 0 ? `${Math.abs(jours)}j expiré` : `${jours}j`}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`inline-block text-xs font-medium px-2 py-0.5 rounded-full ${dlcColor(jours)}`}>
                          {dlcLabel(jours)}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <button onClick={() => onDelete(p.id)} className="text-slate-400 hover:text-red-500 transition">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Legend */}
      <div className="flex flex-wrap gap-3 text-xs text-slate-500 dark:text-slate-400">
        <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-full bg-green-500 inline-block"></span> &gt; 7 jours</span>
        <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-full bg-orange-500 inline-block"></span> 3–7 jours</span>
        <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-full bg-red-500 inline-block"></span> &lt; 3 jours</span>
        <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-full bg-gray-800 inline-block"></span> Expiré</span>
      </div>
    </div>
  );
}

function CleaningSection({ tasks, filter, onFilterChange, onToggle, progress }: {
  tasks: CleaningTask[];
  filter: 'all' | 'quotidien' | 'hebdomadaire' | 'mensuel';
  onFilterChange: (f: 'all' | 'quotidien' | 'hebdomadaire' | 'mensuel') => void;
  onToggle: (id: number) => void;
  progress: number;
}) {
  const zones = useMemo(() => {
    const map = new Map<string, CleaningTask[]>();
    tasks.forEach(t => {
      const list = map.get(t.zone) || [];
      list.push(t);
      map.set(t.zone, list);
    });
    return Array.from(map.entries());
  }, [tasks]);

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <h2 className="text-lg font-semibold text-slate-800 dark:text-white flex items-center gap-2">
          <ClipboardCheck className="w-5 h-5 text-emerald-600" />
          Plan de nettoyage
        </h2>
        <div className="flex items-center gap-2">
          {(['all', 'quotidien', 'hebdomadaire', 'mensuel'] as const).map(f => (
            <button
              key={f}
              onClick={() => onFilterChange(f)}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg transition ${
                filter === f
                  ? 'bg-emerald-600 text-white'
                  : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600'
              }`}
            >
              {f === 'all' ? 'Tout' : f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Global progress */}
      <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Progression globale</span>
          <span className={`text-sm font-bold ${
            progress === 100 ? 'text-emerald-600' : progress >= 50 ? 'text-orange-600' : 'text-red-600'
          }`}>{progress}%</span>
        </div>
        <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-3">
          <div
            className={`h-3 rounded-full transition-all duration-500 ${
              progress === 100 ? 'bg-emerald-500' : progress >= 50 ? 'bg-orange-500' : 'bg-red-500'
            }`}
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Tasks by zone */}
      <div className="space-y-3">
        {zones.map(([zone, zoneTasks]) => {
          const done = zoneTasks.filter(t => t.fait).length;
          return (
            <div key={zone} className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden">
              <div className="flex items-center justify-between px-4 py-3 bg-slate-50 dark:bg-slate-700/50">
                <span className="font-medium text-slate-800 dark:text-white text-sm">{zone}</span>
                <span className="text-xs text-slate-500 dark:text-slate-400">
                  {done}/{zoneTasks.length} terminé{done > 1 ? 's' : ''}
                </span>
              </div>
              <div className="divide-y divide-slate-100 dark:divide-slate-700">
                {zoneTasks.map(task => (
                  <label
                    key={task.id}
                    className="flex items-center gap-3 px-4 py-3 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-700/30 transition"
                  >
                    <input
                      type="checkbox"
                      checked={task.fait}
                      onChange={() => onToggle(task.id)}
                      className="w-4 h-4 rounded border-slate-300 dark:border-slate-600 text-emerald-600 focus:ring-emerald-500"
                    />
                    <div className="flex-1 min-w-0">
                      <p className={`text-sm ${task.fait ? 'line-through text-slate-400 dark:text-slate-500' : 'text-slate-800 dark:text-white'}`}>
                        {task.tache}
                      </p>
                      {task.horodatage && (
                        <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">
                          Fait le {task.horodatage}
                        </p>
                      )}
                    </div>
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                      task.frequence === 'quotidien'
                        ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
                        : task.frequence === 'hebdomadaire'
                        ? 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400'
                        : 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400'
                    }`}>
                      {task.frequence}
                    </span>
                  </label>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function EmptyState({ message }: { message: string }) {
  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-12 text-center">
      <ShieldCheck className="w-12 h-12 text-slate-300 dark:text-slate-600 mx-auto mb-3" />
      <p className="text-slate-500 dark:text-slate-400">{message}</p>
    </div>
  );
}
