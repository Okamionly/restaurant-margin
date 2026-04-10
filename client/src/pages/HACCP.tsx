import { useState, useMemo, useEffect, useCallback } from 'react';
import {
  Thermometer, Plus, ShieldCheck, AlertTriangle, Clock,
  CheckCircle2, XCircle, Package, SprayCan, BarChart3, Search,
  Wrench, Calendar, Download, ChevronRight, ChevronLeft, Printer,
  TrendingUp, Bell, User, Flame, Snowflake, Droplets, HandMetal,
  Truck, FileText, ClipboardCheck, AlertOctagon, Camera, ExternalLink,
  FileCheck, ChevronDown, ChevronUp, Hash, Building2, ListChecks
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

interface DailyCheckItem {
  id: string;
  category: string;
  label: string;
  icon: string;
  checked: boolean;
  temperature: string;
  timestamp: string;
  agent: string;
  zone?: 'frigo' | 'congelateur' | 'plat_chaud';
  minTemp?: number;
  maxTemp?: number;
}

interface TempAlert {
  id: string;
  zone: string;
  temperature: number;
  maxAllowed?: number;
  minAllowed?: number;
  message: string;
  correctiveAction: string;
  timestamp: string;
}

// ─── Digital Temperature Log Types ──────────────────────────────────────────

interface TempLogEntry {
  id: string;
  equipment: string;
  checkTime: '08:00' | '12:00' | '18:00';
  temperature: number;
  operator: string;
  timestamp: string;
  isConform: boolean;
  correctiveAction?: string;
}

// ─── Cleaning Schedule Types ────────────────────────────────────────────────

interface CleaningTask {
  id: string;
  label: string;
  frequency: 'daily' | 'weekly' | 'monthly';
  category: string;
  checked: boolean;
  operator: string;
  timestamp: string;
  photoPlaceholder: boolean;
}

// ─── Supplier Traceability Types ────────────────────────────────────────────

interface DeliveryRecord {
  id: string;
  supplierName: string;
  deliveryDate: string;
  products: string;
  lotNumbers: string;
  temperatureReception: number | null;
  tempIsConform: boolean | null;
  decision: 'accepte' | 'refuse' | 'en_attente';
  refusalReason: string;
  operator: string;
  timestamp: string;
}

// ─── Incident Log Types ─────────────────────────────────────────────────────

interface IncidentRecord {
  id: string;
  date: string;
  description: string;
  severity: 'faible' | 'moyen' | 'grave' | 'critique';
  actionsTaken: string;
  followUp: string;
  status: 'ouvert' | 'en_cours' | 'clos';
  reporter: string;
  timestamp: string;
}

// ─── Audit Preparation Types ────────────────────────────────────────────────

interface AuditCheckItem {
  id: string;
  category: string;
  label: string;
  description: string;
  isPresent: boolean;
  isCritical: boolean;
}

type TabKey = 'dashboard' | 'checklist' | 'temperatures' | 'lots' | 'alertes' | 'nettoyage' | 'conformite' | 'actions' | 'temp_log' | 'cleaning_schedule' | 'supplier_trace' | 'audit_prep' | 'incidents';

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

const DAILY_CHECK_TEMPLATE: Omit<DailyCheckItem, 'checked' | 'temperature' | 'timestamp' | 'agent'>[] = [
  { id: 'frigo-matin', category: 'Temperatures frigo', label: 'Frigo - Matin (ouverture)', icon: 'snowflake', zone: 'frigo', maxTemp: 4 },
  { id: 'frigo-midi', category: 'Temperatures frigo', label: 'Frigo - Midi (service)', icon: 'snowflake', zone: 'frigo', maxTemp: 4 },
  { id: 'frigo-soir', category: 'Temperatures frigo', label: 'Frigo - Soir (fermeture)', icon: 'snowflake', zone: 'frigo', maxTemp: 4 },
  { id: 'congel-matin', category: 'Temperatures congelateur', label: 'Congelateur - Matin', icon: 'snowflake', zone: 'congelateur', maxTemp: -18 },
  { id: 'congel-soir', category: 'Temperatures congelateur', label: 'Congelateur - Soir', icon: 'snowflake', zone: 'congelateur', maxTemp: -18 },
  { id: 'plat-chaud-midi', category: 'Temperature plats chauds', label: 'Plats chauds - Service midi', icon: 'flame', zone: 'plat_chaud', minTemp: 63 },
  { id: 'plat-chaud-soir', category: 'Temperature plats chauds', label: 'Plats chauds - Service soir', icon: 'flame', zone: 'plat_chaud', minTemp: 63 },
  { id: 'nettoyage-plan', category: 'Nettoyage surfaces', label: 'Plans de travail et surfaces', icon: 'spray' },
  { id: 'nettoyage-sol', category: 'Nettoyage surfaces', label: 'Sols cuisine et reserve', icon: 'spray' },
  { id: 'nettoyage-equip', category: 'Nettoyage surfaces', label: 'Equipements (trancheur, mixeur...)', icon: 'spray' },
  { id: 'hygiene-mains', category: 'Hygiene personnel', label: 'Lavage des mains verifie', icon: 'hand' },
  { id: 'hygiene-tenue', category: 'Hygiene personnel', label: 'Tenues propres et conformes', icon: 'hand' },
  { id: 'hygiene-blessures', category: 'Hygiene personnel', label: 'Verification blessures / maladies', icon: 'hand' },
];

// ─── Temperature Log Constants ──────────────────────────────────────────────

const TEMP_LOG_EQUIPMENT = [
  { id: 'frigo1', label: 'Frigo 1', type: 'froid' as const, maxTemp: 4 },
  { id: 'frigo2', label: 'Frigo 2', type: 'froid' as const, maxTemp: 4 },
  { id: 'congelateur', label: 'Congelateur', type: 'congel' as const, maxTemp: -18 },
  { id: 'chambre_froide', label: 'Chambre froide', type: 'froid' as const, maxTemp: 4 },
  { id: 'bain_marie', label: 'Bain-marie', type: 'chaud' as const, minTemp: 63 },
];

const TEMP_LOG_TIMES = ['08:00', '12:00', '18:00'] as const;

function isTempLogConform(equipId: string, temp: number): boolean {
  const equip = TEMP_LOG_EQUIPMENT.find(e => e.id === equipId);
  if (!equip) return true;
  if (equip.type === 'froid') return temp < (equip.maxTemp ?? 4);
  if (equip.type === 'congel') return temp <= (equip.maxTemp ?? -18);
  if (equip.type === 'chaud') return temp >= (equip.minTemp ?? 63);
  return true;
}

function getTempLogCorrective(equipId: string, temp: number): string {
  const equip = TEMP_LOG_EQUIPMENT.find(e => e.id === equipId);
  if (!equip) return '';
  if (equip.type === 'froid' && temp >= (equip.maxTemp ?? 4))
    return `${equip.label} a ${temp}°C (max ${equip.maxTemp}°C). Verifier thermostat, fermeture porte. Deplacer produits sensibles.`;
  if (equip.type === 'congel' && temp > (equip.maxTemp ?? -18))
    return `${equip.label} a ${temp}°C (max ${equip.maxTemp}°C). Verifier compresseur, ne pas ouvrir. Appeler technicien si > -15°C.`;
  if (equip.type === 'chaud' && temp < (equip.minTemp ?? 63))
    return `${equip.label} a ${temp}°C (min ${equip.minTemp}°C). Remonter temperature immediatement. Jeter si maintien > 2h entre 10-63°C.`;
  return '';
}

// ─── Cleaning Schedule Constants ────────────────────────────────────────────

const CLEANING_SCHEDULE_TEMPLATE: Omit<CleaningTask, 'checked' | 'operator' | 'timestamp' | 'photoPlaceholder'>[] = [
  // Daily
  { id: 'daily-plans-travail', label: 'Plans de travail', frequency: 'daily', category: 'Quotidien' },
  { id: 'daily-sols', label: 'Sols cuisine et salle', frequency: 'daily', category: 'Quotidien' },
  { id: 'daily-equipements', label: 'Equipements (trancheur, mixeur, etc.)', frequency: 'daily', category: 'Quotidien' },
  { id: 'daily-poubelles-int', label: 'Poubelles interieures', frequency: 'daily', category: 'Quotidien' },
  { id: 'daily-sanitaires', label: 'Sanitaires et lavabos', frequency: 'daily', category: 'Quotidien' },
  // Weekly
  { id: 'weekly-hottes', label: 'Hottes et filtres', frequency: 'weekly', category: 'Hebdomadaire' },
  { id: 'weekly-grilles', label: 'Grilles et aerations', frequency: 'weekly', category: 'Hebdomadaire' },
  { id: 'weekly-poubelles-ext', label: 'Poubelles exterieures et bacs', frequency: 'weekly', category: 'Hebdomadaire' },
  { id: 'weekly-fours', label: 'Fours et plaques', frequency: 'weekly', category: 'Hebdomadaire' },
  { id: 'weekly-frigos-ext', label: 'Exterieur frigos', frequency: 'weekly', category: 'Hebdomadaire' },
  // Monthly
  { id: 'monthly-chambre-froide', label: 'Chambre froide (degivrage + nettoyage)', frequency: 'monthly', category: 'Mensuel' },
  { id: 'monthly-stockage-sec', label: 'Stockage sec (etageres, rayonnages)', frequency: 'monthly', category: 'Mensuel' },
  { id: 'monthly-murs-plafonds', label: 'Murs et plafonds cuisine', frequency: 'monthly', category: 'Mensuel' },
  { id: 'monthly-canalisations', label: 'Canalisations et siphons', frequency: 'monthly', category: 'Mensuel' },
];

// ─── Audit Checklist Template ───────────────────────────────────────────────

const AUDIT_CHECKLIST_TEMPLATE: Omit<AuditCheckItem, 'isPresent'>[] = [
  { id: 'audit-plan-haccp', category: 'Documents HACCP', label: 'Plan HACCP a jour', description: 'Document decrivant les 7 principes HACCP appliques', isCritical: true },
  { id: 'audit-registre-temp', category: 'Documents HACCP', label: 'Registre temperatures (30 jours)', description: 'Releves temperatures frigo, congel, chaud des 30 derniers jours', isCritical: true },
  { id: 'audit-plan-nettoyage', category: 'Documents HACCP', label: 'Plan de nettoyage et desinfection', description: 'Planning des taches de nettoyage avec frequences', isCritical: true },
  { id: 'audit-fiches-produits', category: 'Documents HACCP', label: 'Fiches techniques produits', description: 'Fiches de securite des produits de nettoyage utilises', isCritical: false },
  { id: 'audit-tracabilite', category: 'Tracabilite', label: 'Registre de tracabilite fournisseurs', description: 'Bons de livraison avec numeros de lots, DLC, temperatures', isCritical: true },
  { id: 'audit-agrements', category: 'Tracabilite', label: 'Agrements sanitaires fournisseurs', description: 'Copies des agrements sanitaires de chaque fournisseur', isCritical: true },
  { id: 'audit-bon-livraison', category: 'Tracabilite', label: 'Bons de livraison classes', description: 'Archivage chronologique des bons de livraison', isCritical: false },
  { id: 'audit-formation', category: 'Personnel', label: 'Attestations de formation hygiene', description: 'Formation HACCP de 14h pour au moins un responsable', isCritical: true },
  { id: 'audit-visite-medicale', category: 'Personnel', label: 'Visites medicales a jour', description: 'Aptitude medicale de chaque employe manipulant des aliments', isCritical: true },
  { id: 'audit-tenues', category: 'Personnel', label: 'Tenues de travail conformes', description: 'Vetements propres, charlotte, tablier, chaussures de securite', isCritical: false },
  { id: 'audit-eau', category: 'Infrastructures', label: 'Analyse eau potable', description: 'Dernier resultat d\'analyse de l\'eau (si puits ou reseau prive)', isCritical: false },
  { id: 'audit-nuisibles', category: 'Infrastructures', label: 'Contrat desinsectisation / deratisation', description: 'Contrat en cours avec une societe specialisee + rapports de visite', isCritical: true },
  { id: 'audit-dechets', category: 'Infrastructures', label: 'Gestion des dechets', description: 'Procedures de tri et elimination des dechets alimentaires', isCritical: false },
  { id: 'audit-actions-correctives', category: 'Suivi', label: 'Registre des actions correctives', description: 'Historique des non-conformites et mesures prises', isCritical: true },
  { id: 'audit-incidents', category: 'Suivi', label: 'Registre des incidents', description: 'Journal des incidents de securite alimentaire', isCritical: false },
  { id: 'audit-rappel-produits', category: 'Suivi', label: 'Procedure de rappel produits', description: 'Procedure ecrite de retrait/rappel en cas d\'alerte sanitaire', isCritical: true },
];

const SEVERITY_LABELS: Record<string, string> = {
  faible: 'Faible',
  moyen: 'Moyen',
  grave: 'Grave',
  critique: 'Critique',
};

const SEVERITY_BADGE: Record<string, string> = {
  faible: 'bg-blue-900/40 text-blue-300 border border-blue-700/50',
  moyen: 'bg-amber-900/40 text-amber-300 border border-amber-700/50',
  grave: 'bg-orange-900/40 text-orange-300 border border-orange-700/50',
  critique: 'bg-red-900/40 text-red-300 border border-red-700/50',
};

const INCIDENT_STATUS_BADGE: Record<string, string> = {
  ouvert: 'bg-red-900/40 text-red-300 border border-red-700/50',
  en_cours: 'bg-amber-900/40 text-amber-300 border border-amber-700/50',
  clos: 'bg-emerald-900/40 text-emerald-300 border border-emerald-700/50',
};

const INCIDENT_STATUS_LABELS: Record<string, string> = {
  ouvert: 'Ouvert',
  en_cours: 'En cours',
  clos: 'Clos',
};

// ─── localStorage helpers for new modules ───────────────────────────────────

function getStorageKey(module: string, dateKey?: string): string {
  const rid = localStorage.getItem('activeRestaurantId') || 'default';
  return dateKey ? `haccp_${module}_${rid}_${dateKey}` : `haccp_${module}_${rid}`;
}

function loadFromStorage<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (raw) return JSON.parse(raw);
  } catch { /* ignore */ }
  return fallback;
}

function saveToStorage(key: string, data: any): void {
  localStorage.setItem(key, JSON.stringify(data));
}

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

function dateKey(d: Date): string {
  return d.toISOString().split('T')[0];
}

function getWeekDates(refDate: Date): Date[] {
  const d = new Date(refDate);
  const day = d.getDay();
  const diff = day === 0 ? -6 : 1 - day;
  d.setDate(d.getDate() + diff);
  const dates: Date[] = [];
  for (let i = 0; i < 7; i++) {
    dates.push(new Date(d));
    d.setDate(d.getDate() + 1);
  }
  return dates;
}

const WEEKDAY_NAMES = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'];

function isTempOutOfRange(zone: string | undefined, temp: number): { outOfRange: boolean; message: string; correction: string } {
  if (!zone) return { outOfRange: false, message: '', correction: '' };
  if (zone === 'frigo' && temp > 4) {
    return {
      outOfRange: true,
      message: `ALERTE: Frigo a ${temp}°C (max 4°C)`,
      correction: 'Verifier la fermeture de la porte, controler le thermostat, deplacer les produits sensibles vers un frigo conforme.',
    };
  }
  if (zone === 'congelateur' && temp > -18) {
    return {
      outOfRange: true,
      message: `ALERTE: Congelateur a ${temp}°C (max -18°C)`,
      correction: 'Verifier le compresseur, ne pas ouvrir la porte, appeler le technicien si > -15°C. Verifier l\'etat des produits congeles.',
    };
  }
  if (zone === 'plat_chaud' && temp < 63) {
    return {
      outOfRange: true,
      message: `ALERTE: Plat chaud a ${temp}°C (min 63°C)`,
      correction: 'Remonter en temperature immediatement (>63°C en <1h). Si impossible, refroidir rapidement et stocker au froid. Jeter si maintien > 2h entre 10-63°C.',
    };
  }
  return { outOfRange: false, message: '', correction: '' };
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

// ─── localStorage helpers for daily checklist ───────────────────────────────

function getChecklistStorageKey(date: string): string {
  const rid = localStorage.getItem('activeRestaurantId') || 'default';
  return `haccp_checklist_${rid}_${date}`;
}

function loadDailyChecklist(date: string): DailyCheckItem[] {
  try {
    const raw = localStorage.getItem(getChecklistStorageKey(date));
    if (raw) return JSON.parse(raw);
  } catch { /* ignore */ }
  return DAILY_CHECK_TEMPLATE.map(t => ({ ...t, checked: false, temperature: '', timestamp: '', agent: '' }));
}

function saveDailyChecklist(date: string, items: DailyCheckItem[]) {
  localStorage.setItem(getChecklistStorageKey(date), JSON.stringify(items));
}

function loadWeeklyData(): Record<string, DailyCheckItem[]> {
  const data: Record<string, DailyCheckItem[]> = {};
  const dates = getWeekDates(new Date());
  for (const d of dates) {
    const key = dateKey(d);
    data[key] = loadDailyChecklist(key);
  }
  return data;
}

// ─── Compliance Score Ring (CSS conic-gradient) ─────────────────────────────

function ComplianceScoreWidget({ score, size = 180 }: { score: number; size?: number }) {
  const color = score >= 80 ? '#10b981' : score >= 50 ? '#f59e0b' : '#ef4444';
  const bgColor = score >= 80 ? 'rgba(16,185,129,0.1)' : score >= 50 ? 'rgba(245,158,11,0.1)' : 'rgba(239,68,68,0.1)';
  const label = score >= 80 ? 'Excellent' : score >= 50 ? 'A ameliorer' : 'Critique';
  const angle = (score / 100) * 360;

  return (
    <div className="flex flex-col items-center">
      <div
        className="relative rounded-full flex items-center justify-center"
        style={{
          width: size,
          height: size,
          background: `conic-gradient(${color} ${angle}deg, #1A1A1A ${angle}deg 360deg)`,
          padding: 10,
        }}
      >
        <div
          className="w-full h-full rounded-full flex flex-col items-center justify-center"
          style={{ backgroundColor: bgColor, backdropFilter: 'blur(8px)' }}
        >
          <div className="bg-white dark:bg-black rounded-full w-[85%] h-[85%] flex flex-col items-center justify-center shadow-inner">
            <span className="text-4xl font-black" style={{ color }}>{score}%</span>
            <span className="text-xs font-semibold mt-0.5" style={{ color }}>{label}</span>
            <span className="text-[10px] text-[#9CA3AF] dark:text-[#737373] mt-0.5">Conformite HACCP</span>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Print Styles ───────────────────────────────────────────────────────────

const PRINT_STYLES = `
@media print {
  body * { visibility: hidden !important; }
  .print-report, .print-report * { visibility: visible !important; }
  .print-report {
    position: absolute; left: 0; top: 0; width: 100%;
    background: white !important; color: black !important; padding: 24px;
    font-size: 11px;
  }
  .print-report h1, .print-report h2, .print-report h3 { color: black !important; }
  .print-report table { border-collapse: collapse; width: 100%; }
  .print-report th, .print-report td { border: 1px solid #ccc; padding: 6px 8px; text-align: left; }
  .print-report th { background: #f3f4f6 !important; font-weight: 600; }
  .print-report .dark\\:bg-black\\/50 { background: white !important; border-color: #e5e7eb !important; }
  .print-report .dark\\:text-white, .print-report .text-white { color: black !important; }
  .print-report .dark\\:text-\\[\\#737373\\], .print-report .text-\\[\\#9CA3AF\\] { color: #666 !important; }
  .no-print { display: none !important; }
  @page { margin: 1cm; }
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

  // Daily checklist state
  const today = dateKey(new Date());
  const [checklistDate, setChecklistDate] = useState(today);
  const [dailyChecklist, setDailyChecklist] = useState<DailyCheckItem[]>(() => loadDailyChecklist(today));
  const [tempAlerts, setTempAlerts] = useState<TempAlert[]>([]);

  // Weekly calendar state
  const [weekOffset, setWeekOffset] = useState(0);
  const [selectedWeekDay, setSelectedWeekDay] = useState<string | null>(null);
  const [weeklyData, setWeeklyData] = useState<Record<string, DailyCheckItem[]>>(() => loadWeeklyData());

  // ─── Digital Temperature Log state ────────────────────────────────────
  const [tempLogDate, setTempLogDate] = useState(today);
  const [tempLogEntries, setTempLogEntries] = useState<TempLogEntry[]>(() =>
    loadFromStorage(getStorageKey('temp_log', today), [])
  );
  const [showTempLogForm, setShowTempLogForm] = useState(false);
  const [tempLogForm, setTempLogForm] = useState({ equipment: 'frigo1', checkTime: '08:00' as const, temperature: '', operator: '' });

  // ─── Cleaning Schedule state ──────────────────────────────────────────
  const [cleaningSchedule, setCleaningSchedule] = useState<CleaningTask[]>(() => {
    const stored = loadFromStorage<CleaningTask[]>(getStorageKey('cleaning_schedule', today), []);
    if (stored.length > 0) return stored;
    return CLEANING_SCHEDULE_TEMPLATE.map(t => ({ ...t, checked: false, operator: '', timestamp: '', photoPlaceholder: false }));
  });
  const [cleaningFilter, setCleaningFilter] = useState<'all' | 'daily' | 'weekly' | 'monthly'>('all');

  // ─── Supplier Traceability state ──────────────────────────────────────
  const [deliveries, setDeliveries] = useState<DeliveryRecord[]>(() =>
    loadFromStorage(getStorageKey('deliveries'), [])
  );
  const [showDeliveryForm, setShowDeliveryForm] = useState(false);
  const [deliveryForm, setDeliveryForm] = useState({
    supplierName: '', deliveryDate: today, products: '', lotNumbers: '',
    temperatureReception: '', decision: 'en_attente' as DeliveryRecord['decision'],
    refusalReason: '', operator: '',
  });

  // ─── Audit Preparation state ──────────────────────────────────────────
  const [auditChecklist, setAuditChecklist] = useState<AuditCheckItem[]>(() => {
    const stored = loadFromStorage<AuditCheckItem[]>(getStorageKey('audit_checklist'), []);
    if (stored.length > 0) return stored;
    return AUDIT_CHECKLIST_TEMPLATE.map(t => ({ ...t, isPresent: false }));
  });

  // ─── Incident Log state ───────────────────────────────────────────────
  const [incidents, setIncidents] = useState<IncidentRecord[]>(() =>
    loadFromStorage(getStorageKey('incidents'), [])
  );
  const [showIncidentForm, setShowIncidentForm] = useState(false);
  const [incidentForm, setIncidentForm] = useState({
    description: '', severity: 'moyen' as IncidentRecord['severity'],
    actionsTaken: '', followUp: '', reporter: '',
  });
  const [incidentView, setIncidentView] = useState<'list' | 'timeline'>('list');

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

  // Sync checklist to localStorage when it changes
  useEffect(() => {
    saveDailyChecklist(checklistDate, dailyChecklist);
    // Also update weekly data
    setWeeklyData(prev => ({ ...prev, [checklistDate]: dailyChecklist }));
  }, [dailyChecklist, checklistDate]);

  // Load checklist when date changes
  useEffect(() => {
    setDailyChecklist(loadDailyChecklist(checklistDate));
  }, [checklistDate]);

  // Persist new module data to localStorage
  useEffect(() => {
    saveToStorage(getStorageKey('temp_log', tempLogDate), tempLogEntries);
  }, [tempLogEntries, tempLogDate]);

  useEffect(() => {
    setTempLogEntries(loadFromStorage(getStorageKey('temp_log', tempLogDate), []));
  }, [tempLogDate]);

  useEffect(() => {
    saveToStorage(getStorageKey('cleaning_schedule', today), cleaningSchedule);
  }, [cleaningSchedule]);

  useEffect(() => {
    saveToStorage(getStorageKey('deliveries'), deliveries);
  }, [deliveries]);

  useEffect(() => {
    saveToStorage(getStorageKey('audit_checklist'), auditChecklist);
  }, [auditChecklist]);

  useEffect(() => {
    saveToStorage(getStorageKey('incidents'), incidents);
  }, [incidents]);

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

  // ─── Quick Stats (consecutive days, last NC, pending actions) ─────────

  const quickStats = useMemo(() => {
    // Consecutive compliant days from today backwards
    let consecutiveDays = 0;
    const todayDate = new Date();
    for (let i = 0; i < 365; i++) {
      const d = new Date(todayDate);
      d.setDate(d.getDate() - i);
      const dk = dateKey(d);
      const checks = loadDailyChecklist(dk);
      const totalItems = checks.length;
      const checkedItems = checks.filter(c => c.checked).length;
      if (totalItems > 0 && checkedItems === totalItems) {
        consecutiveDays++;
      } else if (i === 0 && checkedItems < totalItems) {
        // Today not yet complete, skip
        continue;
      } else {
        break;
      }
    }

    // Last non-conformity
    let lastNCDaysAgo = -1;
    const nonConformeTemps = temperatures.filter(t => {
      if (t.zone === 'frigo') return t.temperature > 4;
      if (t.zone === 'congelateur') return t.temperature > -18;
      if (t.zone === 'plat_chaud') return t.temperature < 63;
      return false;
    });
    if (nonConformeTemps.length > 0) {
      const sorted = [...nonConformeTemps].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
      const lastNC = new Date(sorted[0].timestamp);
      lastNCDaysAgo = Math.floor((todayDate.getTime() - lastNC.getTime()) / (1000 * 60 * 60 * 24));
    }

    // Pending corrective actions
    const pendingActions = correctiveActions.filter(a => a.status !== 'resolu').length;

    return { consecutiveDays, lastNCDaysAgo, pendingActions };
  }, [temperatures, correctiveActions]);

  // ─── Compliance Score (based on daily checklist) ──────────────────────

  const complianceScore = useMemo(() => {
    // Combine API report score with local checklist
    if (complianceReport?.compliance.score !== undefined) {
      // Blend API score with local daily progress
      const localChecked = dailyChecklist.filter(c => c.checked).length;
      const localTotal = dailyChecklist.length;
      const localRate = localTotal > 0 ? (localChecked / localTotal) * 100 : 0;
      return Math.round((complianceReport.compliance.score + localRate) / 2);
    }
    const checked = dailyChecklist.filter(c => c.checked).length;
    const total = dailyChecklist.length;
    return total > 0 ? Math.round((checked / total) * 100) : 0;
  }, [complianceReport, dailyChecklist]);

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

  // ─── Weekly Calendar Data ─────────────────────────────────────────────

  const weekDates = useMemo(() => {
    const ref = new Date();
    ref.setDate(ref.getDate() + weekOffset * 7);
    return getWeekDates(ref);
  }, [weekOffset]);

  const weekCalendarData = useMemo(() => {
    return weekDates.map(d => {
      const dk = dateKey(d);
      const checks = weeklyData[dk] || loadDailyChecklist(dk);
      const total = checks.length;
      const done = checks.filter(c => c.checked).length;
      const status: 'complete' | 'partial' | 'missing' =
        total > 0 && done === total ? 'complete' :
        done > 0 ? 'partial' : 'missing';
      return { date: d, dateStr: dk, total, done, status };
    });
  }, [weekDates, weeklyData]);

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

    // Check for temperature alerts
    const alertCheck = isTempOutOfRange(tempForm.zone, parseFloat(tempForm.temperature));
    if (alertCheck.outOfRange) {
      const alert: TempAlert = {
        id: `alert-${Date.now()}`,
        zone: ZONE_LABELS[tempForm.zone] || tempForm.zone,
        temperature: parseFloat(tempForm.temperature),
        message: alertCheck.message,
        correctiveAction: alertCheck.correction,
        timestamp: now.toISOString(),
      };
      setTempAlerts(prev => [alert, ...prev]);

      // Auto-create corrective action
      const autoAction: CorrectiveAction = {
        id: Date.now(),
        type: 'temperature',
        description: alertCheck.message,
        responsiblePerson: tempForm.agent,
        deadline: new Date(now.getTime() + 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        status: 'ouvert',
        resolution: alertCheck.correction,
        createdAt: now.toISOString(),
      };
      setCorrectiveActions(prev => [autoAction, ...prev]);

      // Try to persist corrective action to API
      try {
        await fetch('/api/haccp/corrective-action', {
          method: 'POST',
          headers: getAuthHeaders(),
          body: JSON.stringify({
            type: 'temperature',
            description: alertCheck.message,
            responsiblePerson: tempForm.agent,
            deadline: autoAction.deadline,
          }),
        });
      } catch { /* local fallback already applied */ }
    }

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

  // ── Export registre CSV ────────────────────────────────────────────
  function exportRegistreCSV() {
    if (temperatures.length === 0 && tempLogEntries.length === 0) {
      window.print();
      return;
    }
    const header = ['Date', 'Heure', 'Zone / Equipement', 'Temperature (C)', 'Conforme', 'Operateur', 'Notes'];
    const rows: string[][] = [];
    // Legacy temperature records
    temperatures.forEach(t => {
      const d = t.timestamp ? new Date(t.timestamp) : null;
      rows.push([
        d ? d.toLocaleDateString('fr-FR') : '',
        d ? d.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }) : '',
        ZONE_LABELS[t.zone] || t.zone,
        String(t.temperature),
        '', // compliance determined by zone limits
        t.agent || '',
        t.notes || '',
      ]);
    });
    // Digital temp log entries
    tempLogEntries.forEach(e => {
      const equip = TEMP_LOG_EQUIPMENT.find(eq => eq.id === e.equipment);
      rows.push([
        e.timestamp ? new Date(e.timestamp).toLocaleDateString('fr-FR') : tempLogDate,
        e.checkTime,
        equip?.label || e.equipment,
        String(e.temperature),
        e.isConform ? 'Oui' : 'Non',
        e.operator,
        e.correctiveAction || '',
      ]);
    });
    const csvContent = [header, ...rows].map(row => row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(';')).join('\n');
    const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `haccp_registre_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  // ─── Daily Checklist Handlers ─────────────────────────────────────────

  function toggleCheckItem(id: string) {
    setDailyChecklist(prev => prev.map(item => {
      if (item.id !== id) return item;
      const now = new Date();
      return {
        ...item,
        checked: !item.checked,
        timestamp: !item.checked ? now.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }) : '',
        agent: !item.checked ? 'Moi' : '',
      };
    }));
  }

  function updateCheckItemTemp(id: string, temp: string) {
    setDailyChecklist(prev => prev.map(item => {
      if (item.id !== id) return item;
      const updated = { ...item, temperature: temp };

      // Check for temperature alerts in real-time
      if (temp && item.zone) {
        const tempVal = parseFloat(temp);
        if (!isNaN(tempVal)) {
          const alertCheck = isTempOutOfRange(item.zone, tempVal);
          if (alertCheck.outOfRange) {
            // Add alert if not already showing for this item
            setTempAlerts(prev => {
              const exists = prev.some(a => a.id === `checklist-${id}`);
              if (exists) {
                return prev.map(a => a.id === `checklist-${id}` ? {
                  ...a,
                  temperature: tempVal,
                  message: alertCheck.message,
                  correctiveAction: alertCheck.correction,
                } : a);
              }
              return [{
                id: `checklist-${id}`,
                zone: ZONE_LABELS[item.zone!] || item.zone || '',
                temperature: tempVal,
                message: alertCheck.message,
                correctiveAction: alertCheck.correction,
                timestamp: new Date().toISOString(),
              }, ...prev];
            });
          } else {
            // Remove alert if temp is now OK
            setTempAlerts(prev => prev.filter(a => a.id !== `checklist-${id}`));
          }
        }
      }

      return updated;
    }));
  }

  function dismissAlert(alertId: string) {
    setTempAlerts(prev => prev.filter(a => a.id !== alertId));
  }

  // ─── Digital Temperature Log Handlers ─────────────────────────────────

  function addTempLogEntry() {
    if (!tempLogForm.temperature || !tempLogForm.operator) return;
    const temp = parseFloat(tempLogForm.temperature);
    const isConform = isTempLogConform(tempLogForm.equipment, temp);
    const corrective = !isConform ? getTempLogCorrective(tempLogForm.equipment, temp) : undefined;
    const entry: TempLogEntry = {
      id: `tl-${Date.now()}`,
      equipment: tempLogForm.equipment,
      checkTime: tempLogForm.checkTime as TempLogEntry['checkTime'],
      temperature: temp,
      operator: tempLogForm.operator,
      timestamp: new Date().toISOString(),
      isConform,
      correctiveAction: corrective,
    };
    setTempLogEntries(prev => [...prev, entry]);

    // Auto-generate corrective action for non-conformity
    if (!isConform && corrective) {
      const autoAction: CorrectiveAction = {
        id: Date.now(),
        type: 'temperature',
        description: corrective,
        responsiblePerson: tempLogForm.operator,
        deadline: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        status: 'ouvert',
        resolution: corrective,
        createdAt: new Date().toISOString(),
      };
      setCorrectiveActions(prev => [autoAction, ...prev]);
    }

    setTempLogForm({ equipment: 'frigo1', checkTime: '08:00', temperature: '', operator: '' });
    setShowTempLogForm(false);
  }

  // ─── Cleaning Schedule Handlers ───────────────────────────────────────

  function toggleCleaningTask(id: string) {
    setCleaningSchedule(prev => prev.map(task => {
      if (task.id !== id) return task;
      const now = new Date();
      return {
        ...task,
        checked: !task.checked,
        operator: !task.checked ? 'Moi' : '',
        timestamp: !task.checked ? now.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }) : '',
      };
    }));
  }

  function toggleCleaningPhoto(id: string) {
    setCleaningSchedule(prev => prev.map(task =>
      task.id === id ? { ...task, photoPlaceholder: !task.photoPlaceholder } : task
    ));
  }

  // ─── Supplier Traceability Handlers ───────────────────────────────────

  function addDelivery() {
    if (!deliveryForm.supplierName || !deliveryForm.products) return;
    const tempVal = deliveryForm.temperatureReception ? parseFloat(deliveryForm.temperatureReception) : null;
    let tempIsConform: boolean | null = null;
    if (tempVal !== null) {
      // Simple check: if cold product, should be < 4
      tempIsConform = tempVal < 4;
    }
    const record: DeliveryRecord = {
      id: `del-${Date.now()}`,
      supplierName: deliveryForm.supplierName,
      deliveryDate: deliveryForm.deliveryDate,
      products: deliveryForm.products,
      lotNumbers: deliveryForm.lotNumbers,
      temperatureReception: tempVal,
      tempIsConform,
      decision: deliveryForm.decision,
      refusalReason: deliveryForm.refusalReason,
      operator: deliveryForm.operator,
      timestamp: new Date().toISOString(),
    };
    setDeliveries(prev => [record, ...prev]);
    setDeliveryForm({
      supplierName: '', deliveryDate: today, products: '', lotNumbers: '',
      temperatureReception: '', decision: 'en_attente', refusalReason: '', operator: '',
    });
    setShowDeliveryForm(false);
  }

  function updateDeliveryDecision(id: string, decision: DeliveryRecord['decision'], reason?: string) {
    setDeliveries(prev => prev.map(d =>
      d.id === id ? { ...d, decision, refusalReason: reason || d.refusalReason } : d
    ));
  }

  // ─── Audit Preparation Handlers ───────────────────────────────────────

  function toggleAuditItem(id: string) {
    setAuditChecklist(prev => prev.map(item =>
      item.id === id ? { ...item, isPresent: !item.isPresent } : item
    ));
  }

  const auditScore = useMemo(() => {
    const total = auditChecklist.length;
    const present = auditChecklist.filter(i => i.isPresent).length;
    return total > 0 ? Math.round((present / total) * 100) : 0;
  }, [auditChecklist]);

  const auditByCategory = useMemo(() => {
    const cats: Record<string, AuditCheckItem[]> = {};
    auditChecklist.forEach(item => {
      if (!cats[item.category]) cats[item.category] = [];
      cats[item.category].push(item);
    });
    return cats;
  }, [auditChecklist]);

  // ─── Incident Log Handlers ────────────────────────────────────────────

  function addIncident() {
    if (!incidentForm.description || !incidentForm.reporter) return;
    const record: IncidentRecord = {
      id: `inc-${Date.now()}`,
      date: today,
      description: incidentForm.description,
      severity: incidentForm.severity,
      actionsTaken: incidentForm.actionsTaken,
      followUp: incidentForm.followUp,
      status: 'ouvert',
      reporter: incidentForm.reporter,
      timestamp: new Date().toISOString(),
    };
    setIncidents(prev => [record, ...prev]);
    setIncidentForm({ description: '', severity: 'moyen', actionsTaken: '', followUp: '', reporter: '' });
    setShowIncidentForm(false);
  }

  function updateIncidentStatus(id: string, status: IncidentRecord['status']) {
    setIncidents(prev => prev.map(i => i.id === id ? { ...i, status } : i));
  }

  const filteredLots = useMemo(() => {
    if (!searchLots) return lots;
    const q = searchLots.toLowerCase();
    return lots.filter(l => l.lotNumber.toLowerCase().includes(q) || l.product.toLowerCase().includes(q) || l.supplier.toLowerCase().includes(q));
  }, [lots, searchLots]);

  // ─── Checklist grouped by category ────────────────────────────────────

  const checklistByCategory = useMemo(() => {
    const cats: Record<string, DailyCheckItem[]> = {};
    dailyChecklist.forEach(item => {
      if (!cats[item.category]) cats[item.category] = [];
      cats[item.category].push(item);
    });
    return cats;
  }, [dailyChecklist]);

  const checklistProgress = useMemo(() => {
    const total = dailyChecklist.length;
    const done = dailyChecklist.filter(c => c.checked).length;
    return { total, done, pct: total > 0 ? Math.round((done / total) * 100) : 0 };
  }, [dailyChecklist]);

  // ─── Category icon helper ─────────────────────────────────────────────

  function getCategoryIcon(category: string) {
    if (category.includes('frigo')) return <Snowflake className="w-5 h-5 text-blue-400" />;
    if (category.includes('congelateur')) return <Snowflake className="w-5 h-5 text-violet-400" />;
    if (category.includes('chaud')) return <Flame className="w-5 h-5 text-orange-400" />;
    if (category.includes('Nettoyage')) return <SprayCan className="w-5 h-5 text-teal-400" />;
    if (category.includes('Hygiene')) return <HandMetal className="w-5 h-5 text-pink-400" />;
    return <CheckCircle2 className="w-5 h-5 text-[#9CA3AF]" />;
  }

  // Cleaning schedule progress
  const cleaningScheduleProgress = useMemo(() => {
    const filtered = cleaningFilter === 'all' ? cleaningSchedule : cleaningSchedule.filter(t => t.frequency === cleaningFilter);
    const done = filtered.filter(t => t.checked).length;
    return { total: filtered.length, done, pct: filtered.length > 0 ? Math.round((done / filtered.length) * 100) : 0 };
  }, [cleaningSchedule, cleaningFilter]);

  // Temp log grouped by equipment for the day
  const tempLogGrid = useMemo(() => {
    const grid: Record<string, Record<string, TempLogEntry | null>> = {};
    TEMP_LOG_EQUIPMENT.forEach(eq => {
      grid[eq.id] = {};
      TEMP_LOG_TIMES.forEach(time => { grid[eq.id][time] = null; });
    });
    tempLogEntries.forEach(entry => {
      if (grid[entry.equipment]) {
        grid[entry.equipment][entry.checkTime] = entry;
      }
    });
    return grid;
  }, [tempLogEntries]);

  const tabs: { key: TabKey; label: string; icon: React.ReactNode; badge?: number }[] = [
    { key: 'dashboard', label: t('haccp.tabDashboard'), icon: <BarChart3 className="w-4 h-4" /> },
    { key: 'checklist', label: 'Checklist du jour', icon: <CheckCircle2 className="w-4 h-4" />, badge: checklistProgress.total - checklistProgress.done > 0 ? checklistProgress.total - checklistProgress.done : undefined },
    { key: 'temp_log', label: 'Releves temp.', icon: <Thermometer className="w-4 h-4" /> },
    { key: 'cleaning_schedule', label: 'Plan nettoyage', icon: <ListChecks className="w-4 h-4" /> },
    { key: 'supplier_trace', label: 'Fournisseurs', icon: <Truck className="w-4 h-4" /> },
    { key: 'audit_prep', label: 'Audit', icon: <ClipboardCheck className="w-4 h-4" />, badge: auditChecklist.filter(i => i.isCritical && !i.isPresent).length > 0 ? auditChecklist.filter(i => i.isCritical && !i.isPresent).length : undefined },
    { key: 'incidents', label: 'Incidents', icon: <AlertOctagon className="w-4 h-4" />, badge: incidents.filter(i => i.status !== 'clos').length > 0 ? incidents.filter(i => i.status !== 'clos').length : undefined },
    { key: 'temperatures', label: t('haccp.tabTemperatures'), icon: <Thermometer className="w-4 h-4" /> },
    { key: 'nettoyage', label: t('haccp.tabCleaning'), icon: <SprayCan className="w-4 h-4" /> },
    { key: 'conformite', label: 'Conformite', icon: <ShieldCheck className="w-4 h-4" /> },
    { key: 'actions', label: 'Actions correctives', icon: <Wrench className="w-4 h-4" />, badge: quickStats.pendingActions > 0 ? quickStats.pendingActions : undefined },
    { key: 'lots', label: t('haccp.tabTraceability'), icon: <Package className="w-4 h-4" /> },
    { key: 'alertes', label: t('haccp.tabAlerts'), icon: <AlertTriangle className="w-4 h-4" /> },
  ];

  return (
    <div className="space-y-6">
      {/* Print styles */}
      <style dangerouslySetInnerHTML={{ __html: PRINT_STYLES }} />

      {/* ─── Temperature Alerts Banner ──────────────────────────────────── */}
      {tempAlerts.length > 0 && (
        <div className="space-y-2 no-print">
          {tempAlerts.map(alert => (
            <div key={alert.id} className="bg-red-950/60 border-2 border-red-500/60 rounded-2xl p-4 animate-pulse-slow">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-red-500/20 flex items-center justify-center flex-shrink-0">
                  <Bell className="w-5 h-5 text-red-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <h4 className="text-red-300 font-bold text-sm">{alert.message}</h4>
                    <button onClick={() => dismissAlert(alert.id)} className="text-red-400/60 hover:text-red-300 transition-colors flex-shrink-0">
                      <XCircle className="w-5 h-5" />
                    </button>
                  </div>
                  <div className="mt-1.5 bg-red-900/30 rounded-xl px-3 py-2">
                    <p className="text-xs text-red-200 font-medium">Action corrective recommandee :</p>
                    <p className="text-xs text-red-300/80 mt-0.5">{alert.correctiveAction}</p>
                  </div>
                  <div className="mt-1.5 text-[10px] text-red-400/60">
                    {new Date(alert.timestamp).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })} - Action corrective auto-creee
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 no-print">
        <div>
          <h1 className="text-2xl font-bold font-satoshi text-[#111111] dark:text-white flex items-center gap-3">
            <ShieldCheck className="w-7 h-7 text-emerald-400" />
            {t('haccp.title')}
          </h1>
          <p className="text-[#9CA3AF] dark:text-[#737373] mt-1">{t('haccp.subtitle')}</p>
        </div>
        <div className="flex gap-2">
          <button onClick={exportRegistreCSV}
            className="flex items-center gap-2 px-4 py-2.5 border border-[#E5E7EB] dark:border-[#1A1A1A] text-[#6B7280] dark:text-[#A3A3A3] hover:bg-[#FAFAFA] dark:hover:bg-[#171717] rounded-xl text-sm font-medium transition-colors">
            <Download className="w-4 h-4" />
            Exporter registre
          </button>
          <button onClick={handlePrint}
            className="flex items-center gap-2 px-4 py-2.5 bg-[#111111] dark:bg-white hover:bg-[#333] dark:hover:bg-[#E5E5E5] text-white dark:text-black rounded-xl text-sm font-medium transition-colors">
            <Printer className="w-4 h-4" />
            Imprimer le registre
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-white dark:bg-black/50 p-1 rounded-xl border border-[#E5E7EB] dark:border-[#1A1A1A] overflow-x-auto no-print">
        {tabs.map(tab => (
          <button key={tab.key} onClick={() => setActiveTab(tab.key)}
            className={`relative flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${activeTab === tab.key ? 'bg-[#111111] dark:bg-white text-white dark:text-black shadow-lg' : 'text-[#9CA3AF] dark:text-[#737373] hover:text-[#111111] dark:hover:text-white hover:bg-[#F3F4F6] dark:hover:bg-[#171717]'}`}>
            {tab.icon}{tab.label}
            {tab.badge && (
              <span className={`ml-1 min-w-[18px] h-[18px] flex items-center justify-center rounded-full text-[10px] font-bold ${activeTab === tab.key ? 'bg-red-500 text-white' : 'bg-red-500/80 text-white'}`}>
                {tab.badge}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* ═══════════════════════════════════════════════════════════════════
           DASHBOARD
         ═══════════════════════════════════════════════════════════════════ */}
      {activeTab === 'dashboard' && (
        <div className="space-y-6 print-report">
          {/* Top row: Compliance Score + Quick Stats */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Compliance Score Widget */}
            <div className="lg:col-span-4 bg-white dark:bg-black/50 border border-[#E5E7EB] dark:border-[#1A1A1A] rounded-2xl p-6 flex flex-col items-center justify-center">
              <ComplianceScoreWidget score={complianceScore} />
              <div className="mt-4 w-full">
                <div className="flex justify-between text-xs text-[#9CA3AF] dark:text-[#737373] mb-1">
                  <span>Progression du jour</span>
                  <span>{checklistProgress.done}/{checklistProgress.total}</span>
                </div>
                <div className="h-2 bg-[#FAFAFA] dark:bg-[#0A0A0A] rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{
                      width: `${checklistProgress.pct}%`,
                      backgroundColor: checklistProgress.pct >= 80 ? '#10b981' : checklistProgress.pct >= 50 ? '#f59e0b' : '#ef4444',
                    }}
                  />
                </div>
              </div>
            </div>

            {/* Quick Stats Cards */}
            <div className="lg:col-span-8 grid grid-cols-1 sm:grid-cols-3 gap-4">
              {/* Consecutive compliant days */}
              <div className="bg-white dark:bg-black/50 border border-[#E5E7EB] dark:border-[#1A1A1A] rounded-2xl p-5">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[#9CA3AF] dark:text-[#737373] text-xs font-medium uppercase tracking-wider">Jours consecutifs conforme</span>
                </div>
                <div className="flex items-end gap-2">
                  <span className="text-4xl font-black text-emerald-400">{quickStats.consecutiveDays}</span>
                  <span className="text-sm text-[#9CA3AF] dark:text-[#737373] mb-1">jours</span>
                </div>
                <div className="mt-3 flex items-center gap-2 text-xs text-emerald-400">
                  <TrendingUp className="w-3.5 h-3.5" />
                  <span>Continuez ainsi !</span>
                </div>
              </div>

              {/* Last non-conformity */}
              <div className="bg-white dark:bg-black/50 border border-[#E5E7EB] dark:border-[#1A1A1A] rounded-2xl p-5">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[#9CA3AF] dark:text-[#737373] text-xs font-medium uppercase tracking-wider">Derniere non-conformite</span>
                </div>
                <div className="flex items-end gap-2">
                  {quickStats.lastNCDaysAgo >= 0 ? (
                    <>
                      <span className={`text-4xl font-black ${quickStats.lastNCDaysAgo <= 1 ? 'text-red-400' : quickStats.lastNCDaysAgo <= 3 ? 'text-amber-400' : 'text-[#111111] dark:text-white'}`}>
                        {quickStats.lastNCDaysAgo}
                      </span>
                      <span className="text-sm text-[#9CA3AF] dark:text-[#737373] mb-1">jour{quickStats.lastNCDaysAgo !== 1 ? 's' : ''}</span>
                    </>
                  ) : (
                    <span className="text-lg font-bold text-emerald-400">Aucune</span>
                  )}
                </div>
                <div className="mt-3 text-xs text-[#9CA3AF] dark:text-[#737373]">
                  {quickStats.lastNCDaysAgo < 0 ? 'Aucune non-conformite enregistree' :
                    quickStats.lastNCDaysAgo === 0 ? 'Aujourd\'hui' :
                    `Il y a ${quickStats.lastNCDaysAgo} jour${quickStats.lastNCDaysAgo !== 1 ? 's' : ''}`}
                </div>
              </div>

              {/* Pending corrective actions */}
              <div className="bg-white dark:bg-black/50 border border-[#E5E7EB] dark:border-[#1A1A1A] rounded-2xl p-5">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[#9CA3AF] dark:text-[#737373] text-xs font-medium uppercase tracking-wider">Actions correctives en cours</span>
                </div>
                <div className="flex items-end gap-2">
                  <span className={`text-4xl font-black ${quickStats.pendingActions > 0 ? 'text-amber-400' : 'text-emerald-400'}`}>
                    {quickStats.pendingActions}
                  </span>
                  <span className="text-sm text-[#9CA3AF] dark:text-[#737373] mb-1">action{quickStats.pendingActions !== 1 ? 's' : ''}</span>
                </div>
                {quickStats.pendingActions > 0 ? (
                  <button onClick={() => setActiveTab('actions')} className="mt-3 flex items-center gap-1 text-xs text-amber-400 hover:text-amber-300 transition-colors">
                    Voir les actions <ChevronRight className="w-3 h-3" />
                  </button>
                ) : (
                  <div className="mt-3 flex items-center gap-2 text-xs text-emerald-400">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Tout est en ordre</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Summary stat cards */}
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

          {/* Weekly Calendar View */}
          <div className="bg-white dark:bg-black/50 border border-[#E5E7EB] dark:border-[#1A1A1A] rounded-2xl p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-[#111111] dark:text-white font-semibold flex items-center gap-2">
                <Calendar className="w-5 h-5 text-teal-400" />
                Vue hebdomadaire
              </h3>
              <div className="flex items-center gap-2">
                <button onClick={() => setWeekOffset(o => o - 1)} className="p-1.5 rounded-lg hover:bg-[#F3F4F6] dark:hover:bg-[#171717] transition-colors">
                  <ChevronLeft className="w-4 h-4 text-[#9CA3AF] dark:text-[#737373]" />
                </button>
                <button onClick={() => setWeekOffset(0)} className="px-3 py-1 rounded-lg text-xs font-medium text-[#9CA3AF] dark:text-[#737373] hover:bg-[#F3F4F6] dark:hover:bg-[#171717] transition-colors">
                  Aujourd'hui
                </button>
                <button onClick={() => setWeekOffset(o => o + 1)} className="p-1.5 rounded-lg hover:bg-[#F3F4F6] dark:hover:bg-[#171717] transition-colors">
                  <ChevronRight className="w-4 h-4 text-[#9CA3AF] dark:text-[#737373]" />
                </button>
              </div>
            </div>
            <div className="grid grid-cols-7 gap-2">
              {weekCalendarData.map((day, i) => {
                const isToday = day.dateStr === today;
                const isSelected = selectedWeekDay === day.dateStr;
                const statusColor = day.status === 'complete' ? 'border-emerald-500/60 bg-emerald-500/10' :
                  day.status === 'partial' ? 'border-amber-500/60 bg-amber-500/10' :
                  'border-red-500/40 bg-red-500/5';
                const dotColor = day.status === 'complete' ? 'bg-emerald-500' :
                  day.status === 'partial' ? 'bg-amber-500' : 'bg-red-500/50';

                return (
                  <button
                    key={day.dateStr}
                    onClick={() => {
                      setSelectedWeekDay(day.dateStr === selectedWeekDay ? null : day.dateStr);
                      setChecklistDate(day.dateStr);
                      setActiveTab('checklist');
                    }}
                    className={`relative flex flex-col items-center p-3 rounded-xl border-2 transition-all ${statusColor} ${isSelected ? 'ring-2 ring-teal-400/50' : ''} ${isToday ? 'shadow-lg' : ''} hover:scale-105`}
                  >
                    <span className="text-[10px] font-bold uppercase text-[#9CA3AF] dark:text-[#737373]">{WEEKDAY_NAMES[i]}</span>
                    <span className={`text-lg font-bold mt-0.5 ${isToday ? 'text-[#111111] dark:text-white' : 'text-[#6B7280] dark:text-[#A3A3A3]'}`}>
                      {day.date.getDate()}
                    </span>
                    <span className="text-[10px] text-[#9CA3AF] dark:text-[#737373] mt-0.5">
                      {day.done}/{day.total}
                    </span>
                    <div className={`w-2 h-2 rounded-full mt-1.5 ${dotColor}`} />
                    {isToday && (
                      <div className="absolute -top-1 -right-1 w-3 h-3 bg-teal-400 rounded-full border-2 border-white dark:border-black" />
                    )}
                  </button>
                );
              })}
            </div>
            <div className="flex gap-4 mt-3 text-xs">
              <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded-full bg-emerald-500" /><span className="text-[#9CA3AF] dark:text-[#737373]">Complet</span></div>
              <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded-full bg-amber-500" /><span className="text-[#9CA3AF] dark:text-[#737373]">Partiel</span></div>
              <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded-full bg-red-500/50" /><span className="text-[#9CA3AF] dark:text-[#737373]">Manquant</span></div>
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

      {/* ═══════════════════════════════════════════════════════════════════
           DAILY CHECKLIST
         ═══════════════════════════════════════════════════════════════════ */}
      {activeTab === 'checklist' && (
        <div className="space-y-4">
          {/* Date selector + progress */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <h3 className="text-[#111111] dark:text-white font-semibold flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-teal-400" />
                Checklist HACCP
              </h3>
              <input
                type="date"
                value={checklistDate}
                onChange={(e) => setChecklistDate(e.target.value)}
                className="bg-[#FAFAFA] dark:bg-[#0A0A0A] border border-[#E5E7EB] dark:border-[#1A1A1A] rounded-lg px-3 py-1.5 text-sm text-[#111111] dark:text-white"
              />
              {checklistDate !== today && (
                <button onClick={() => setChecklistDate(today)} className="text-xs text-teal-400 hover:text-teal-300 font-medium">
                  Aujourd'hui
                </button>
              )}
            </div>
            <div className="flex items-center gap-3">
              <div className="text-sm font-medium">
                <span className={checklistProgress.pct >= 80 ? 'text-emerald-400' : checklistProgress.pct >= 50 ? 'text-amber-400' : 'text-red-400'}>
                  {checklistProgress.done}/{checklistProgress.total}
                </span>
                <span className="text-[#9CA3AF] dark:text-[#737373] ml-1">controles</span>
              </div>
              <div className="w-32 h-2.5 bg-[#FAFAFA] dark:bg-[#0A0A0A] rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-500"
                  style={{
                    width: `${checklistProgress.pct}%`,
                    backgroundColor: checklistProgress.pct >= 80 ? '#10b981' : checklistProgress.pct >= 50 ? '#f59e0b' : '#ef4444',
                  }}
                />
              </div>
              <span className={`text-sm font-bold ${checklistProgress.pct >= 80 ? 'text-emerald-400' : checklistProgress.pct >= 50 ? 'text-amber-400' : 'text-red-400'}`}>
                {checklistProgress.pct}%
              </span>
            </div>
          </div>

          {/* Checklist by category */}
          {Object.entries(checklistByCategory).map(([category, items]) => {
            const catDone = items.filter(i => i.checked).length;
            const catTotal = items.length;
            const hasTemps = items.some(i => i.zone);

            return (
              <div key={category} className="bg-white dark:bg-black/50 border border-[#E5E7EB] dark:border-[#1A1A1A] rounded-2xl overflow-hidden">
                <div className="flex items-center justify-between px-5 py-3 bg-[#FAFAFA] dark:bg-[#0A0A0A]/50 border-b border-[#E5E7EB] dark:border-[#1A1A1A]">
                  <div className="flex items-center gap-2">
                    {getCategoryIcon(category)}
                    <span className="text-[#111111] dark:text-white font-semibold text-sm">{category}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`text-xs font-medium ${catDone === catTotal ? 'text-emerald-400' : 'text-[#9CA3AF] dark:text-[#737373]'}`}>
                      {catDone}/{catTotal}
                    </span>
                    {catDone === catTotal && <CheckCircle2 className="w-4 h-4 text-emerald-400" />}
                  </div>
                </div>
                <div className="divide-y divide-[#E5E7EB] dark:divide-[#1A1A1A]/50">
                  {items.map(item => {
                    // Check if temp is out of range
                    let tempWarning = false;
                    if (item.temperature && item.zone) {
                      const tempVal = parseFloat(item.temperature);
                      if (!isNaN(tempVal)) {
                        const check = isTempOutOfRange(item.zone, tempVal);
                        tempWarning = check.outOfRange;
                      }
                    }

                    return (
                      <div key={item.id} className={`flex items-center gap-4 px-5 py-3 transition-colors ${item.checked ? 'bg-emerald-500/5' : 'hover:bg-[#F3F4F6] dark:hover:bg-[#171717]/30'} ${tempWarning ? 'bg-red-500/5 border-l-4 border-red-500' : ''}`}>
                        {/* Checkbox */}
                        <button
                          onClick={() => toggleCheckItem(item.id)}
                          className={`w-7 h-7 rounded-lg border-2 flex items-center justify-center transition-all flex-shrink-0 ${item.checked ? 'bg-emerald-500 border-emerald-500 text-white' : 'border-[#E5E7EB] dark:border-[#333] hover:border-emerald-400'}`}
                        >
                          {item.checked && <CheckCircle2 className="w-4 h-4" />}
                        </button>

                        {/* Label */}
                        <div className="flex-1 min-w-0">
                          <span className={`text-sm ${item.checked ? 'text-[#9CA3AF] dark:text-[#737373] line-through' : 'text-[#111111] dark:text-white'}`}>
                            {item.label}
                          </span>
                        </div>

                        {/* Temperature input (for temp items) */}
                        {hasTemps && item.zone && (
                          <div className="flex items-center gap-1.5">
                            <input
                              type="number"
                              step="0.1"
                              value={item.temperature}
                              onChange={(e) => updateCheckItemTemp(item.id, e.target.value)}
                              placeholder="°C"
                              className={`w-20 bg-[#FAFAFA] dark:bg-[#0A0A0A] border rounded-lg px-2 py-1.5 text-sm text-center font-mono font-bold ${tempWarning ? 'border-red-500 text-red-400' : 'border-[#E5E7EB] dark:border-[#1A1A1A] text-[#111111] dark:text-white'} placeholder:text-[#6B7280]`}
                            />
                            <span className="text-xs text-[#9CA3AF] dark:text-[#737373]">°C</span>
                          </div>
                        )}

                        {/* Timestamp */}
                        {item.timestamp && (
                          <div className="flex items-center gap-1.5 text-xs text-[#9CA3AF] dark:text-[#737373]">
                            <Clock className="w-3 h-3" />
                            <span>{item.timestamp}</span>
                          </div>
                        )}

                        {/* Agent */}
                        {item.agent && (
                          <div className="flex items-center gap-1 text-xs text-[#9CA3AF] dark:text-[#737373]">
                            <User className="w-3 h-3" />
                            <span>{item.agent}</span>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ═══════════════════════════════════════════════════════════════════
           TEMPERATURES
         ═══════════════════════════════════════════════════════════════════ */}
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

              {/* Live temperature alert preview */}
              {tempForm.temperature && (() => {
                const check = isTempOutOfRange(tempForm.zone, parseFloat(tempForm.temperature));
                if (!check.outOfRange) return null;
                return (
                  <div className="bg-red-950/40 border border-red-500/40 rounded-xl p-3 flex items-start gap-3">
                    <AlertTriangle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-semibold text-red-300">{check.message}</p>
                      <p className="text-xs text-red-400/80 mt-1">{check.correction}</p>
                      <p className="text-[10px] text-red-400/50 mt-1">Une action corrective sera automatiquement creee a l'enregistrement</p>
                    </div>
                  </div>
                );
              })()}

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

      {/* ═══════════════════════════════════════════════════════════════════
           NETTOYAGE
         ═══════════════════════════════════════════════════════════════════ */}
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

      {/* ═══════════════════════════════════════════════════════════════════
           CONFORMITE
         ═══════════════════════════════════════════════════════════════════ */}
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
              <ComplianceScoreWidget score={complianceReport?.compliance.score || complianceScore} size={160} />
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
                  const firstDate = new Date(heatmap[0]?.date || new Date());
                  const startDay = firstDate.getDay() === 0 ? 6 : firstDate.getDay() - 1;
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

      {/* ═══════════════════════════════════════════════════════════════════
           ACTIONS CORRECTIVES
         ═══════════════════════════════════════════════════════════════════ */}
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
                    <td className="py-3 px-4 text-[#111111] dark:text-white max-w-xs">
                      <div>{a.description}</div>
                      {a.resolution && (
                        <div className="mt-1 text-xs text-[#9CA3AF] dark:text-[#737373] italic">Action: {a.resolution}</div>
                      )}
                    </td>
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

      {/* ═══════════════════════════════════════════════════════════════════
           DIGITAL TEMPERATURE LOG
         ═══════════════════════════════════════════════════════════════════ */}
      {activeTab === 'temp_log' && (
        <div className="space-y-4">
          {/* Header */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <h3 className="text-[#111111] dark:text-white font-semibold flex items-center gap-2">
                <Thermometer className="w-5 h-5 text-teal-400" />
                Releve de temperatures
              </h3>
              <input
                type="date"
                value={tempLogDate}
                onChange={(e) => setTempLogDate(e.target.value)}
                className="bg-[#F5F5F5] dark:bg-[#262626] border border-[#E5E7EB] dark:border-[#262626] rounded-lg px-3 py-1.5 text-sm text-[#111111] dark:text-white"
              />
              {tempLogDate !== today && (
                <button onClick={() => setTempLogDate(today)} className="text-xs text-teal-400 hover:text-teal-300 font-medium">
                  Aujourd'hui
                </button>
              )}
            </div>
            <div className="flex items-center gap-3">
              <button onClick={() => setShowTempLogForm(!showTempLogForm)}
                className="flex items-center gap-2 px-4 py-2.5 bg-[#111111] dark:bg-white hover:bg-[#333] dark:hover:bg-[#E5E5E5] text-white dark:text-black rounded-xl text-sm font-medium transition-colors">
                <Plus className="w-4 h-4" />Enregistrer
              </button>
              <button onClick={handlePrint}
                className="flex items-center gap-2 px-4 py-2.5 bg-[#F5F5F5] dark:bg-[#262626] hover:bg-[#E5E7EB] dark:hover:bg-[#333] text-[#111111] dark:text-white rounded-xl text-sm font-medium transition-colors">
                <Printer className="w-4 h-4" />Imprimer
              </button>
            </div>
          </div>

          {/* Quick entry form */}
          {showTempLogForm && (
            <div className="bg-white dark:bg-[#0A0A0A]/50 border border-[#E5E7EB] dark:border-[#1A1A1A] rounded-2xl p-5 space-y-4">
              <h3 className="text-[#111111] dark:text-white font-semibold">Nouveau releve</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div>
                  <label className="block text-xs text-[#737373] dark:text-[#A3A3A3] mb-1">Equipement</label>
                  <select value={tempLogForm.equipment} onChange={e => setTempLogForm(f => ({ ...f, equipment: e.target.value }))}
                    className="w-full bg-[#F5F5F5] dark:bg-[#262626] border border-[#E5E7EB] dark:border-[#262626] rounded-lg px-3 py-2 text-sm text-[#111111] dark:text-white">
                    {TEMP_LOG_EQUIPMENT.map(eq => <option key={eq.id} value={eq.id}>{eq.label}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs text-[#737373] dark:text-[#A3A3A3] mb-1">Heure du controle</label>
                  <select value={tempLogForm.checkTime} onChange={e => setTempLogForm(f => ({ ...f, checkTime: e.target.value as any }))}
                    className="w-full bg-[#F5F5F5] dark:bg-[#262626] border border-[#E5E7EB] dark:border-[#262626] rounded-lg px-3 py-2 text-sm text-[#111111] dark:text-white">
                    <option value="08:00">8h - Matin</option>
                    <option value="12:00">12h - Midi</option>
                    <option value="18:00">18h - Soir</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs text-[#737373] dark:text-[#A3A3A3] mb-1">Temperature (°C)</label>
                  <input type="number" step="0.1" value={tempLogForm.temperature}
                    onChange={e => setTempLogForm(f => ({ ...f, temperature: e.target.value }))}
                    placeholder="Ex: 3.2"
                    className="w-full bg-[#F5F5F5] dark:bg-[#262626] border border-[#E5E7EB] dark:border-[#262626] rounded-lg px-3 py-2 text-sm text-[#111111] dark:text-white placeholder:text-[#6B7280]" />
                </div>
                <div>
                  <label className="block text-xs text-[#737373] dark:text-[#A3A3A3] mb-1">Operateur</label>
                  <input type="text" value={tempLogForm.operator}
                    onChange={e => setTempLogForm(f => ({ ...f, operator: e.target.value }))}
                    placeholder="Votre nom"
                    className="w-full bg-[#F5F5F5] dark:bg-[#262626] border border-[#E5E7EB] dark:border-[#262626] rounded-lg px-3 py-2 text-sm text-[#111111] dark:text-white placeholder:text-[#6B7280]" />
                </div>
              </div>

              {/* Live alert preview */}
              {tempLogForm.temperature && (() => {
                const temp = parseFloat(tempLogForm.temperature);
                if (isNaN(temp)) return null;
                const conform = isTempLogConform(tempLogForm.equipment, temp);
                if (conform) return (
                  <div className="bg-emerald-950/30 border border-emerald-500/40 rounded-xl p-3 flex items-center gap-3">
                    <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                    <span className="text-sm text-emerald-300">Temperature conforme</span>
                  </div>
                );
                return (
                  <div className="bg-red-950/40 border border-red-500/40 rounded-xl p-3 flex items-start gap-3">
                    <AlertTriangle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-semibold text-red-300">NON-CONFORME</p>
                      <p className="text-xs text-red-400/80 mt-1">{getTempLogCorrective(tempLogForm.equipment, temp)}</p>
                      <p className="text-[10px] text-red-400/50 mt-1">Action corrective auto-creee a l'enregistrement</p>
                    </div>
                  </div>
                );
              })()}

              <div className="flex gap-3">
                <button onClick={addTempLogEntry} className="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-white rounded-xl text-sm font-medium transition-colors">Enregistrer</button>
                <button onClick={() => setShowTempLogForm(false)} className="px-4 py-2 bg-[#F5F5F5] dark:bg-[#171717] hover:bg-[#E5E7EB] dark:hover:bg-[#222] text-[#6B7280] dark:text-[#A3A3A3] rounded-xl text-sm font-medium transition-colors">Annuler</button>
              </div>
            </div>
          )}

          {/* Professional grid: equipment x time */}
          <div className="bg-white dark:bg-[#0A0A0A]/50 border border-[#E5E7EB] dark:border-[#1A1A1A] rounded-2xl overflow-hidden print-report">
            <div className="px-5 py-3 bg-[#F5F5F5] dark:bg-[#0A0A0A] border-b border-[#E5E7EB] dark:border-[#1A1A1A]">
              <h4 className="text-sm font-semibold text-[#111111] dark:text-white">
                Fiche de releve - {new Date(tempLogDate).toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
              </h4>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-[#737373] dark:text-[#737373] text-xs uppercase tracking-wider bg-[#FAFAFA] dark:bg-[#0A0A0A]/50">
                    <th className="text-left py-3 px-4 font-semibold">Equipement</th>
                    <th className="text-left py-3 px-4 font-semibold">Limite</th>
                    {TEMP_LOG_TIMES.map(time => (
                      <th key={time} className="text-center py-3 px-4 font-semibold">{time === '08:00' ? '8h Matin' : time === '12:00' ? '12h Midi' : '18h Soir'}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {TEMP_LOG_EQUIPMENT.map(eq => (
                    <tr key={eq.id} className="border-t border-[#E5E7EB] dark:border-[#1A1A1A]/50">
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          {eq.type === 'chaud' ? <Flame className="w-4 h-4 text-orange-400" /> : <Snowflake className="w-4 h-4 text-blue-400" />}
                          <span className="text-[#111111] dark:text-white font-medium">{eq.label}</span>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-xs text-[#737373] dark:text-[#A3A3A3]">
                        {eq.type === 'chaud' ? `>= ${eq.minTemp}°C` : `< ${eq.maxTemp}°C`}
                      </td>
                      {TEMP_LOG_TIMES.map(time => {
                        const entry = tempLogGrid[eq.id]?.[time];
                        if (!entry) {
                          return (
                            <td key={time} className="py-3 px-4 text-center">
                              <button
                                onClick={() => {
                                  setTempLogForm(f => ({ ...f, equipment: eq.id, checkTime: time as any }));
                                  setShowTempLogForm(true);
                                }}
                                className="text-xs text-[#737373] hover:text-teal-400 transition-colors px-3 py-1.5 rounded-lg border border-dashed border-[#E5E7EB] dark:border-[#333] hover:border-teal-400/50"
                              >
                                + Saisir
                              </button>
                            </td>
                          );
                        }
                        return (
                          <td key={time} className="py-3 px-4 text-center">
                            <div className={`inline-flex flex-col items-center px-3 py-1.5 rounded-lg ${entry.isConform ? 'bg-emerald-900/20' : 'bg-red-900/20 border border-red-500/30'}`}>
                              <span className={`text-sm font-bold ${entry.isConform ? 'text-emerald-400' : 'text-red-400'}`}>{entry.temperature}°C</span>
                              <span className="text-[10px] text-[#737373] dark:text-[#A3A3A3]">{entry.operator}</span>
                            </div>
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Non-conformities of the day */}
          {tempLogEntries.filter(e => !e.isConform).length > 0 && (
            <div className="bg-white dark:bg-[#0A0A0A]/50 border border-red-700/30 rounded-2xl p-5">
              <h4 className="text-[#111111] dark:text-white font-semibold mb-3 flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-red-400" />
                Non-conformites du jour ({tempLogEntries.filter(e => !e.isConform).length})
              </h4>
              <div className="space-y-2">
                {tempLogEntries.filter(e => !e.isConform).map(entry => {
                  const eq = TEMP_LOG_EQUIPMENT.find(e => e.id === entry.equipment);
                  return (
                    <div key={entry.id} className="flex items-start gap-3 bg-red-900/10 border border-red-900/20 rounded-xl px-4 py-3">
                      <XCircle className="w-4 h-4 text-red-400 mt-0.5 flex-shrink-0" />
                      <div className="flex-1">
                        <div className="flex items-center gap-2 text-sm">
                          <span className="text-[#111111] dark:text-white font-medium">{eq?.label}</span>
                          <span className="text-red-400 font-bold">{entry.temperature}°C</span>
                          <span className="text-[#737373] text-xs">a {entry.checkTime}</span>
                        </div>
                        {entry.correctiveAction && (
                          <p className="text-xs text-red-400/70 mt-1">{entry.correctiveAction}</p>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}

      {/* ═══════════════════════════════════════════════════════════════════
           CLEANING SCHEDULE
         ═══════════════════════════════════════════════════════════════════ */}
      {activeTab === 'cleaning_schedule' && (
        <div className="space-y-4">
          {/* Header */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <h3 className="text-[#111111] dark:text-white font-semibold flex items-center gap-2">
              <ListChecks className="w-5 h-5 text-violet-400" />
              Plan de nettoyage et desinfection
            </h3>
            <div className="flex items-center gap-3">
              {/* Filter buttons */}
              {(['all', 'daily', 'weekly', 'monthly'] as const).map(f => (
                <button key={f} onClick={() => setCleaningFilter(f)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${cleaningFilter === f ? 'bg-[#111111] dark:bg-white text-white dark:text-black' : 'text-[#737373] hover:text-[#111111] dark:hover:text-white hover:bg-[#F5F5F5] dark:hover:bg-[#171717]'}`}>
                  {f === 'all' ? 'Tout' : f === 'daily' ? 'Quotidien' : f === 'weekly' ? 'Hebdo' : 'Mensuel'}
                </button>
              ))}
              <button onClick={handlePrint}
                className="flex items-center gap-2 px-4 py-2.5 bg-[#F5F5F5] dark:bg-[#262626] hover:bg-[#E5E7EB] dark:hover:bg-[#333] text-[#111111] dark:text-white rounded-xl text-sm font-medium transition-colors">
                <Printer className="w-4 h-4" />PDF
              </button>
            </div>
          </div>

          {/* Progress bar */}
          <div className="bg-white dark:bg-[#0A0A0A]/50 border border-[#E5E7EB] dark:border-[#1A1A1A] rounded-2xl p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-[#737373] dark:text-[#A3A3A3]">Progression</span>
              <span className={`text-sm font-bold ${cleaningScheduleProgress.pct >= 80 ? 'text-emerald-400' : cleaningScheduleProgress.pct >= 50 ? 'text-amber-400' : 'text-red-400'}`}>
                {cleaningScheduleProgress.done}/{cleaningScheduleProgress.total} ({cleaningScheduleProgress.pct}%)
              </span>
            </div>
            <div className="h-2.5 bg-[#FAFAFA] dark:bg-[#0A0A0A] rounded-full overflow-hidden">
              <div className="h-full rounded-full transition-all duration-500"
                style={{
                  width: `${cleaningScheduleProgress.pct}%`,
                  backgroundColor: cleaningScheduleProgress.pct >= 80 ? '#10b981' : cleaningScheduleProgress.pct >= 50 ? '#f59e0b' : '#ef4444',
                }} />
            </div>
          </div>

          {/* Tasks by category */}
          {(['Quotidien', 'Hebdomadaire', 'Mensuel'] as const).map(cat => {
            const tasks = cleaningSchedule.filter(t => t.category === cat);
            if (cleaningFilter !== 'all') {
              const freq = cleaningFilter === 'daily' ? 'Quotidien' : cleaningFilter === 'weekly' ? 'Hebdomadaire' : 'Mensuel';
              if (cat !== freq) return null;
            }
            const catDone = tasks.filter(t => t.checked).length;
            const freqIcon = cat === 'Quotidien' ? <Clock className="w-4 h-4 text-teal-400" /> :
              cat === 'Hebdomadaire' ? <Calendar className="w-4 h-4 text-blue-400" /> :
              <Calendar className="w-4 h-4 text-violet-400" />;

            return (
              <div key={cat} className="bg-white dark:bg-[#0A0A0A]/50 border border-[#E5E7EB] dark:border-[#1A1A1A] rounded-2xl overflow-hidden print-report">
                <div className="flex items-center justify-between px-5 py-3 bg-[#FAFAFA] dark:bg-[#0A0A0A]/50 border-b border-[#E5E7EB] dark:border-[#1A1A1A]">
                  <div className="flex items-center gap-2">
                    {freqIcon}
                    <span className="text-[#111111] dark:text-white font-semibold text-sm">{cat}</span>
                    <span className="text-xs text-[#737373] dark:text-[#A3A3A3]">
                      ({cat === 'Quotidien' ? 'tous les jours' : cat === 'Hebdomadaire' ? '1x/semaine' : '1x/mois'})
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`text-xs font-medium ${catDone === tasks.length ? 'text-emerald-400' : 'text-[#737373]'}`}>
                      {catDone}/{tasks.length}
                    </span>
                    {catDone === tasks.length && tasks.length > 0 && <CheckCircle2 className="w-4 h-4 text-emerald-400" />}
                  </div>
                </div>
                <div className="divide-y divide-[#E5E7EB] dark:divide-[#1A1A1A]/50">
                  {tasks.map(task => (
                    <div key={task.id} className={`flex items-center gap-4 px-5 py-3 transition-colors ${task.checked ? 'bg-emerald-500/5' : 'hover:bg-[#F5F5F5] dark:hover:bg-[#171717]/30'}`}>
                      <button onClick={() => toggleCleaningTask(task.id)}
                        className={`w-7 h-7 rounded-lg border-2 flex items-center justify-center transition-all flex-shrink-0 ${task.checked ? 'bg-emerald-500 border-emerald-500 text-white' : 'border-[#E5E7EB] dark:border-[#333] hover:border-emerald-400'}`}>
                        {task.checked && <CheckCircle2 className="w-4 h-4" />}
                      </button>
                      <div className="flex-1 min-w-0">
                        <span className={`text-sm ${task.checked ? 'text-[#737373] line-through' : 'text-[#111111] dark:text-white'}`}>
                          {task.label}
                        </span>
                      </div>
                      {/* Photo placeholder */}
                      <button onClick={() => toggleCleaningPhoto(task.id)}
                        className={`p-1.5 rounded-lg transition-colors ${task.photoPlaceholder ? 'bg-teal-500/20 text-teal-400' : 'text-[#737373] hover:text-teal-400 hover:bg-[#F5F5F5] dark:hover:bg-[#171717]'}`}
                        title="Photo attestation">
                        <Camera className="w-4 h-4" />
                      </button>
                      {task.timestamp && (
                        <div className="flex items-center gap-1.5 text-xs text-[#737373]">
                          <Clock className="w-3 h-3" />
                          <span>{task.timestamp}</span>
                        </div>
                      )}
                      {task.operator && (
                        <div className="flex items-center gap-1 text-xs text-[#737373]">
                          <User className="w-3 h-3" />
                          <span>{task.operator}</span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ═══════════════════════════════════════════════════════════════════
           SUPPLIER TRACEABILITY
         ═══════════════════════════════════════════════════════════════════ */}
      {activeTab === 'supplier_trace' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <h3 className="text-[#111111] dark:text-white font-semibold flex items-center gap-2">
              <Truck className="w-5 h-5 text-teal-400" />
              Tracabilite fournisseurs - Receptions
            </h3>
            <div className="flex items-center gap-3">
              <a href="/fournisseurs" className="flex items-center gap-1.5 px-3 py-2 text-xs text-teal-400 hover:text-teal-300 border border-teal-400/30 hover:border-teal-400/60 rounded-xl transition-colors">
                <ExternalLink className="w-3.5 h-3.5" />
                Page Fournisseurs
              </a>
              <button onClick={() => setShowDeliveryForm(!showDeliveryForm)}
                className="flex items-center gap-2 px-4 py-2.5 bg-[#111111] dark:bg-white hover:bg-[#333] dark:hover:bg-[#E5E5E5] text-white dark:text-black rounded-xl text-sm font-medium transition-colors">
                <Plus className="w-4 h-4" />Nouvelle livraison
              </button>
            </div>
          </div>

          {/* Summary cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-white dark:bg-[#0A0A0A]/50 border border-[#E5E7EB] dark:border-[#1A1A1A] rounded-2xl p-4 text-center">
              <div className="text-2xl font-bold text-[#111111] dark:text-white">{deliveries.length}</div>
              <div className="text-xs text-[#737373] mt-1">Total livraisons</div>
            </div>
            <div className="bg-white dark:bg-[#0A0A0A]/50 border border-emerald-700/30 rounded-2xl p-4 text-center">
              <div className="text-2xl font-bold text-emerald-400">{deliveries.filter(d => d.decision === 'accepte').length}</div>
              <div className="text-xs text-[#737373] mt-1">Acceptees</div>
            </div>
            <div className="bg-white dark:bg-[#0A0A0A]/50 border border-red-700/30 rounded-2xl p-4 text-center">
              <div className="text-2xl font-bold text-red-400">{deliveries.filter(d => d.decision === 'refuse').length}</div>
              <div className="text-xs text-[#737373] mt-1">Refusees</div>
            </div>
          </div>

          {/* Delivery form */}
          {showDeliveryForm && (
            <div className="bg-white dark:bg-[#0A0A0A]/50 border border-[#E5E7EB] dark:border-[#1A1A1A] rounded-2xl p-5 space-y-4">
              <h3 className="text-[#111111] dark:text-white font-semibold">Enregistrer une livraison</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs text-[#737373] mb-1">Fournisseur</label>
                  <input type="text" value={deliveryForm.supplierName}
                    onChange={e => setDeliveryForm(f => ({ ...f, supplierName: e.target.value }))}
                    placeholder="Nom du fournisseur"
                    className="w-full bg-[#F5F5F5] dark:bg-[#262626] border border-[#E5E7EB] dark:border-[#262626] rounded-lg px-3 py-2 text-sm text-[#111111] dark:text-white placeholder:text-[#6B7280]" />
                </div>
                <div>
                  <label className="block text-xs text-[#737373] mb-1">Date de livraison</label>
                  <input type="date" value={deliveryForm.deliveryDate}
                    onChange={e => setDeliveryForm(f => ({ ...f, deliveryDate: e.target.value }))}
                    className="w-full bg-[#F5F5F5] dark:bg-[#262626] border border-[#E5E7EB] dark:border-[#262626] rounded-lg px-3 py-2 text-sm text-[#111111] dark:text-white" />
                </div>
                <div>
                  <label className="block text-xs text-[#737373] mb-1">Produits livres</label>
                  <input type="text" value={deliveryForm.products}
                    onChange={e => setDeliveryForm(f => ({ ...f, products: e.target.value }))}
                    placeholder="Viande, legumes, etc."
                    className="w-full bg-[#F5F5F5] dark:bg-[#262626] border border-[#E5E7EB] dark:border-[#262626] rounded-lg px-3 py-2 text-sm text-[#111111] dark:text-white placeholder:text-[#6B7280]" />
                </div>
                <div>
                  <label className="block text-xs text-[#737373] mb-1">Numeros de lot</label>
                  <input type="text" value={deliveryForm.lotNumbers}
                    onChange={e => setDeliveryForm(f => ({ ...f, lotNumbers: e.target.value }))}
                    placeholder="LOT-001, LOT-002"
                    className="w-full bg-[#F5F5F5] dark:bg-[#262626] border border-[#E5E7EB] dark:border-[#262626] rounded-lg px-3 py-2 text-sm text-[#111111] dark:text-white placeholder:text-[#6B7280]" />
                </div>
                <div>
                  <label className="block text-xs text-[#737373] mb-1">Temperature a reception (°C)</label>
                  <input type="number" step="0.1" value={deliveryForm.temperatureReception}
                    onChange={e => setDeliveryForm(f => ({ ...f, temperatureReception: e.target.value }))}
                    placeholder="Ex: 2.5"
                    className="w-full bg-[#F5F5F5] dark:bg-[#262626] border border-[#E5E7EB] dark:border-[#262626] rounded-lg px-3 py-2 text-sm text-[#111111] dark:text-white placeholder:text-[#6B7280]" />
                </div>
                <div>
                  <label className="block text-xs text-[#737373] mb-1">Decision</label>
                  <select value={deliveryForm.decision}
                    onChange={e => setDeliveryForm(f => ({ ...f, decision: e.target.value as DeliveryRecord['decision'] }))}
                    className="w-full bg-[#F5F5F5] dark:bg-[#262626] border border-[#E5E7EB] dark:border-[#262626] rounded-lg px-3 py-2 text-sm text-[#111111] dark:text-white">
                    <option value="en_attente">En attente</option>
                    <option value="accepte">Accepte</option>
                    <option value="refuse">Refuse</option>
                  </select>
                </div>
                {deliveryForm.decision === 'refuse' && (
                  <div className="sm:col-span-2">
                    <label className="block text-xs text-[#737373] mb-1">Motif de refus</label>
                    <input type="text" value={deliveryForm.refusalReason}
                      onChange={e => setDeliveryForm(f => ({ ...f, refusalReason: e.target.value }))}
                      placeholder="Temperature non conforme, emballage endommage..."
                      className="w-full bg-[#F5F5F5] dark:bg-[#262626] border border-[#E5E7EB] dark:border-[#262626] rounded-lg px-3 py-2 text-sm text-[#111111] dark:text-white placeholder:text-[#6B7280]" />
                  </div>
                )}
                <div>
                  <label className="block text-xs text-[#737373] mb-1">Operateur</label>
                  <input type="text" value={deliveryForm.operator}
                    onChange={e => setDeliveryForm(f => ({ ...f, operator: e.target.value }))}
                    placeholder="Votre nom"
                    className="w-full bg-[#F5F5F5] dark:bg-[#262626] border border-[#E5E7EB] dark:border-[#262626] rounded-lg px-3 py-2 text-sm text-[#111111] dark:text-white placeholder:text-[#6B7280]" />
                </div>
              </div>

              {/* Temperature auto-validate preview */}
              {deliveryForm.temperatureReception && (() => {
                const temp = parseFloat(deliveryForm.temperatureReception);
                if (isNaN(temp)) return null;
                const ok = temp < 4;
                return (
                  <div className={`${ok ? 'bg-emerald-950/30 border-emerald-500/40' : 'bg-red-950/40 border-red-500/40'} border rounded-xl p-3 flex items-center gap-3`}>
                    {ok ? <CheckCircle2 className="w-5 h-5 text-emerald-400" /> : <AlertTriangle className="w-5 h-5 text-red-400" />}
                    <span className={`text-sm ${ok ? 'text-emerald-300' : 'text-red-300'}`}>
                      Temperature de reception: {temp}°C - {ok ? 'Conforme (< 4°C)' : 'NON CONFORME (>= 4°C)'}
                    </span>
                  </div>
                );
              })()}

              <div className="flex gap-3">
                <button onClick={addDelivery} className="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-white rounded-xl text-sm font-medium transition-colors">Enregistrer</button>
                <button onClick={() => setShowDeliveryForm(false)} className="px-4 py-2 bg-[#F5F5F5] dark:bg-[#171717] hover:bg-[#E5E7EB] dark:hover:bg-[#222] text-[#6B7280] dark:text-[#A3A3A3] rounded-xl text-sm font-medium transition-colors">Annuler</button>
              </div>
            </div>
          )}

          {/* Deliveries list */}
          <div className="bg-white dark:bg-[#0A0A0A]/50 border border-[#E5E7EB] dark:border-[#1A1A1A] rounded-2xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-[#737373] text-xs uppercase tracking-wider bg-[#FAFAFA] dark:bg-[#0A0A0A]/50">
                    <th className="text-left py-3 px-4">Fournisseur</th>
                    <th className="text-left py-3 px-4">Date</th>
                    <th className="text-left py-3 px-4">Produits</th>
                    <th className="text-left py-3 px-4">N° Lots</th>
                    <th className="text-left py-3 px-4">Temp.</th>
                    <th className="text-left py-3 px-4">Decision</th>
                    <th className="text-left py-3 px-4">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {deliveries.map(d => (
                    <tr key={d.id} className="border-t border-[#E5E7EB] dark:border-[#1A1A1A]/50 hover:bg-[#F5F5F5] dark:hover:bg-[#171717]/30 transition-colors">
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <Building2 className="w-4 h-4 text-[#737373]" />
                          <span className="text-[#111111] dark:text-white font-medium">{d.supplierName}</span>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-[#737373]">{new Date(d.deliveryDate).toLocaleDateString('fr-FR')}</td>
                      <td className="py-3 px-4 text-[#111111] dark:text-white max-w-xs truncate">{d.products}</td>
                      <td className="py-3 px-4 text-teal-400 font-mono text-xs">{d.lotNumbers || '-'}</td>
                      <td className="py-3 px-4">
                        {d.temperatureReception !== null ? (
                          <span className={`px-2 py-0.5 rounded-lg text-xs font-semibold ${d.tempIsConform ? 'bg-emerald-900/40 text-emerald-300' : 'bg-red-900/40 text-red-300'}`}>
                            {d.temperatureReception}°C
                          </span>
                        ) : <span className="text-[#737373]">-</span>}
                      </td>
                      <td className="py-3 px-4">
                        <span className={`px-2.5 py-0.5 rounded-lg text-xs font-semibold ${
                          d.decision === 'accepte' ? 'bg-emerald-900/40 text-emerald-300 border border-emerald-700/50' :
                          d.decision === 'refuse' ? 'bg-red-900/40 text-red-300 border border-red-700/50' :
                          'bg-amber-900/40 text-amber-300 border border-amber-700/50'
                        }`}>
                          {d.decision === 'accepte' ? 'Accepte' : d.decision === 'refuse' ? 'Refuse' : 'En attente'}
                        </span>
                        {d.decision === 'refuse' && d.refusalReason && (
                          <div className="text-[10px] text-red-400/70 mt-0.5">{d.refusalReason}</div>
                        )}
                      </td>
                      <td className="py-3 px-4">
                        {d.decision === 'en_attente' && (
                          <div className="flex gap-1">
                            <button onClick={() => updateDeliveryDecision(d.id, 'accepte')}
                              className="px-2 py-1 text-xs bg-emerald-900/30 text-emerald-300 rounded-lg hover:bg-emerald-900/50 transition-colors">
                              Accepter
                            </button>
                            <button onClick={() => {
                              const reason = prompt('Motif de refus:');
                              if (reason) updateDeliveryDecision(d.id, 'refuse', reason);
                            }}
                              className="px-2 py-1 text-xs bg-red-900/30 text-red-300 rounded-lg hover:bg-red-900/50 transition-colors">
                              Refuser
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {deliveries.length === 0 && (
              <div className="text-center py-12 text-[#737373]">
                <Truck className="w-12 h-12 mx-auto mb-3 text-[#737373]/40" />
                <p className="font-medium text-[#111111] dark:text-white">Aucune livraison enregistree</p>
                <p className="text-sm mt-1">Cliquez "Nouvelle livraison" pour commencer</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ═══════════════════════════════════════════════════════════════════
           AUDIT PREPARATION
         ═══════════════════════════════════════════════════════════════════ */}
      {activeTab === 'audit_prep' && (
        <div className="space-y-6">
          {/* Header */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <h3 className="text-[#111111] dark:text-white font-semibold flex items-center gap-2">
              <ClipboardCheck className="w-5 h-5 text-teal-400" />
              Preparer un audit
            </h3>
            <button onClick={handlePrint}
              className="flex items-center gap-2 px-4 py-2.5 bg-[#111111] dark:bg-white hover:bg-[#333] dark:hover:bg-[#E5E5E5] text-white dark:text-black rounded-xl text-sm font-medium transition-colors">
              <FileText className="w-4 h-4" />Generer rapport audit
            </button>
          </div>

          {/* Audit readiness score */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="bg-white dark:bg-[#0A0A0A]/50 border border-[#E5E7EB] dark:border-[#1A1A1A] rounded-2xl p-6 flex flex-col items-center justify-center">
              <ComplianceScoreWidget score={auditScore} size={160} />
              <div className="mt-4 text-center">
                <p className="text-sm text-[#111111] dark:text-white font-semibold">
                  Vous etes pret a {auditScore}% pour l'audit
                </p>
                <p className="text-xs text-[#737373] mt-1">
                  {auditChecklist.filter(i => i.isPresent).length}/{auditChecklist.length} documents disponibles
                </p>
              </div>
            </div>

            {/* Missing critical items */}
            <div className="lg:col-span-2 bg-white dark:bg-[#0A0A0A]/50 border border-[#E5E7EB] dark:border-[#1A1A1A] rounded-2xl p-6">
              <h4 className="text-[#111111] dark:text-white font-semibold mb-4 flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-red-400" />
                Elements manquants
              </h4>
              {auditChecklist.filter(i => !i.isPresent).length === 0 ? (
                <div className="text-center py-8">
                  <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto mb-3" />
                  <p className="text-emerald-400 font-semibold">Tous les documents sont presents !</p>
                  <p className="text-sm text-[#737373] mt-1">Vous etes pret pour l'audit</p>
                </div>
              ) : (
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {auditChecklist.filter(i => !i.isPresent).map(item => (
                    <div key={item.id}
                      className={`flex items-center justify-between px-4 py-3 rounded-xl border ${item.isCritical ? 'border-red-500/30 bg-red-900/10' : 'border-amber-500/30 bg-amber-900/10'}`}>
                      <div className="flex items-center gap-3">
                        {item.isCritical ? (
                          <XCircle className="w-4 h-4 text-red-400 flex-shrink-0" />
                        ) : (
                          <AlertTriangle className="w-4 h-4 text-amber-400 flex-shrink-0" />
                        )}
                        <div>
                          <span className={`text-sm font-medium ${item.isCritical ? 'text-red-300' : 'text-amber-300'}`}>{item.label}</span>
                          {item.isCritical && <span className="ml-2 text-[10px] text-red-400 bg-red-900/30 px-1.5 py-0.5 rounded">CRITIQUE</span>}
                        </div>
                      </div>
                      <button onClick={() => toggleAuditItem(item.id)}
                        className="text-xs text-teal-400 hover:text-teal-300 transition-colors">
                        Marquer present
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Full audit checklist by category */}
          {Object.entries(auditByCategory).map(([category, items]) => {
            const catDone = items.filter(i => i.isPresent).length;
            const catCritical = items.filter(i => i.isCritical && !i.isPresent).length;

            return (
              <div key={category} className="bg-white dark:bg-[#0A0A0A]/50 border border-[#E5E7EB] dark:border-[#1A1A1A] rounded-2xl overflow-hidden print-report">
                <div className="flex items-center justify-between px-5 py-3 bg-[#FAFAFA] dark:bg-[#0A0A0A]/50 border-b border-[#E5E7EB] dark:border-[#1A1A1A]">
                  <div className="flex items-center gap-2">
                    <FileCheck className="w-4 h-4 text-teal-400" />
                    <span className="text-[#111111] dark:text-white font-semibold text-sm">{category}</span>
                    {catCritical > 0 && (
                      <span className="text-[10px] text-red-400 bg-red-900/30 px-1.5 py-0.5 rounded">{catCritical} critique{catCritical > 1 ? 's' : ''} manquant{catCritical > 1 ? 's' : ''}</span>
                    )}
                  </div>
                  <span className={`text-xs font-medium ${catDone === items.length ? 'text-emerald-400' : 'text-[#737373]'}`}>
                    {catDone}/{items.length}
                  </span>
                </div>
                <div className="divide-y divide-[#E5E7EB] dark:divide-[#1A1A1A]/50">
                  {items.map(item => (
                    <div key={item.id} className={`flex items-center gap-4 px-5 py-3 transition-colors ${item.isPresent ? 'bg-emerald-500/5' : item.isCritical ? 'bg-red-500/5' : ''}`}>
                      <button onClick={() => toggleAuditItem(item.id)}
                        className={`w-7 h-7 rounded-lg border-2 flex items-center justify-center transition-all flex-shrink-0 ${item.isPresent ? 'bg-emerald-500 border-emerald-500 text-white' : item.isCritical ? 'border-red-500/50 hover:border-red-400' : 'border-[#E5E7EB] dark:border-[#333] hover:border-emerald-400'}`}>
                        {item.isPresent && <CheckCircle2 className="w-4 h-4" />}
                      </button>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className={`text-sm ${item.isPresent ? 'text-[#737373] line-through' : 'text-[#111111] dark:text-white'}`}>
                            {item.label}
                          </span>
                          {item.isCritical && !item.isPresent && (
                            <span className="text-[10px] text-red-400 bg-red-900/30 px-1.5 py-0.5 rounded flex-shrink-0">OBLIGATOIRE</span>
                          )}
                        </div>
                        <p className="text-xs text-[#737373] mt-0.5">{item.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ═══════════════════════════════════════════════════════════════════
           INCIDENT LOG
         ═══════════════════════════════════════════════════════════════════ */}
      {activeTab === 'incidents' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <h3 className="text-[#111111] dark:text-white font-semibold flex items-center gap-2">
              <AlertOctagon className="w-5 h-5 text-red-400" />
              Journal des incidents
            </h3>
            <div className="flex items-center gap-3">
              {/* View toggle */}
              <div className="flex bg-[#F5F5F5] dark:bg-[#171717] rounded-lg p-0.5">
                <button onClick={() => setIncidentView('list')}
                  className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${incidentView === 'list' ? 'bg-[#111111] dark:bg-white text-white dark:text-black' : 'text-[#737373]'}`}>
                  Liste
                </button>
                <button onClick={() => setIncidentView('timeline')}
                  className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${incidentView === 'timeline' ? 'bg-[#111111] dark:bg-white text-white dark:text-black' : 'text-[#737373]'}`}>
                  Chronologie
                </button>
              </div>
              <button onClick={exportRegistreCSV}
                className="flex items-center gap-2 px-3 py-2 text-xs border border-[#E5E7EB] dark:border-[#333] text-[#111111] dark:text-white rounded-xl hover:bg-[#F5F5F5] dark:hover:bg-[#171717] transition-colors">
                <Download className="w-3.5 h-3.5" />Exporter registre
              </button>
              <button onClick={() => setShowIncidentForm(!showIncidentForm)}
                className="flex items-center gap-2 px-4 py-2.5 bg-[#111111] dark:bg-white hover:bg-[#333] dark:hover:bg-[#E5E5E5] text-white dark:text-black rounded-xl text-sm font-medium transition-colors">
                <Plus className="w-4 h-4" />Nouvel incident
              </button>
            </div>
          </div>

          {/* Summary cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="bg-white dark:bg-[#0A0A0A]/50 border border-[#E5E7EB] dark:border-[#1A1A1A] rounded-2xl p-4 text-center">
              <div className="text-2xl font-bold text-[#111111] dark:text-white">{incidents.length}</div>
              <div className="text-xs text-[#737373] mt-1">Total incidents</div>
            </div>
            <div className="bg-white dark:bg-[#0A0A0A]/50 border border-red-700/30 rounded-2xl p-4 text-center">
              <div className="text-2xl font-bold text-red-400">{incidents.filter(i => i.status === 'ouvert').length}</div>
              <div className="text-xs text-[#737373] mt-1">Ouverts</div>
            </div>
            <div className="bg-white dark:bg-[#0A0A0A]/50 border border-amber-700/30 rounded-2xl p-4 text-center">
              <div className="text-2xl font-bold text-amber-400">{incidents.filter(i => i.status === 'en_cours').length}</div>
              <div className="text-xs text-[#737373] mt-1">En cours</div>
            </div>
            <div className="bg-white dark:bg-[#0A0A0A]/50 border border-emerald-700/30 rounded-2xl p-4 text-center">
              <div className="text-2xl font-bold text-emerald-400">{incidents.filter(i => i.status === 'clos').length}</div>
              <div className="text-xs text-[#737373] mt-1">Clos</div>
            </div>
          </div>

          {/* Incident form */}
          {showIncidentForm && (
            <div className="bg-white dark:bg-[#0A0A0A]/50 border border-[#E5E7EB] dark:border-[#1A1A1A] rounded-2xl p-5 space-y-4">
              <h3 className="text-[#111111] dark:text-white font-semibold">Signaler un incident</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className="block text-xs text-[#737373] mb-1">Description de l'incident</label>
                  <textarea value={incidentForm.description}
                    onChange={e => setIncidentForm(f => ({ ...f, description: e.target.value }))}
                    placeholder="Decrire l'incident en detail..."
                    rows={3}
                    className="w-full bg-[#F5F5F5] dark:bg-[#262626] border border-[#E5E7EB] dark:border-[#262626] rounded-lg px-3 py-2 text-sm text-[#111111] dark:text-white placeholder:text-[#6B7280] resize-none" />
                </div>
                <div>
                  <label className="block text-xs text-[#737373] mb-1">Gravite</label>
                  <select value={incidentForm.severity}
                    onChange={e => setIncidentForm(f => ({ ...f, severity: e.target.value as IncidentRecord['severity'] }))}
                    className="w-full bg-[#F5F5F5] dark:bg-[#262626] border border-[#E5E7EB] dark:border-[#262626] rounded-lg px-3 py-2 text-sm text-[#111111] dark:text-white">
                    <option value="faible">Faible</option>
                    <option value="moyen">Moyen</option>
                    <option value="grave">Grave</option>
                    <option value="critique">Critique</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs text-[#737373] mb-1">Signale par</label>
                  <input type="text" value={incidentForm.reporter}
                    onChange={e => setIncidentForm(f => ({ ...f, reporter: e.target.value }))}
                    placeholder="Votre nom"
                    className="w-full bg-[#F5F5F5] dark:bg-[#262626] border border-[#E5E7EB] dark:border-[#262626] rounded-lg px-3 py-2 text-sm text-[#111111] dark:text-white placeholder:text-[#6B7280]" />
                </div>
                <div>
                  <label className="block text-xs text-[#737373] mb-1">Actions prises</label>
                  <input type="text" value={incidentForm.actionsTaken}
                    onChange={e => setIncidentForm(f => ({ ...f, actionsTaken: e.target.value }))}
                    placeholder="Mesures immediates prises..."
                    className="w-full bg-[#F5F5F5] dark:bg-[#262626] border border-[#E5E7EB] dark:border-[#262626] rounded-lg px-3 py-2 text-sm text-[#111111] dark:text-white placeholder:text-[#6B7280]" />
                </div>
                <div>
                  <label className="block text-xs text-[#737373] mb-1">Suivi necessaire</label>
                  <input type="text" value={incidentForm.followUp}
                    onChange={e => setIncidentForm(f => ({ ...f, followUp: e.target.value }))}
                    placeholder="Actions de suivi..."
                    className="w-full bg-[#F5F5F5] dark:bg-[#262626] border border-[#E5E7EB] dark:border-[#262626] rounded-lg px-3 py-2 text-sm text-[#111111] dark:text-white placeholder:text-[#6B7280]" />
                </div>
              </div>
              <div className="flex gap-3">
                <button onClick={addIncident} className="px-4 py-2 bg-red-500 hover:bg-red-400 text-white rounded-xl text-sm font-medium transition-colors">Signaler l'incident</button>
                <button onClick={() => setShowIncidentForm(false)} className="px-4 py-2 bg-[#F5F5F5] dark:bg-[#171717] hover:bg-[#E5E7EB] dark:hover:bg-[#222] text-[#6B7280] dark:text-[#A3A3A3] rounded-xl text-sm font-medium transition-colors">Annuler</button>
              </div>
            </div>
          )}

          {/* LIST VIEW */}
          {incidentView === 'list' && (
            <div className="bg-white dark:bg-[#0A0A0A]/50 border border-[#E5E7EB] dark:border-[#1A1A1A] rounded-2xl overflow-hidden print-report">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-[#737373] text-xs uppercase tracking-wider bg-[#FAFAFA] dark:bg-[#0A0A0A]/50">
                      <th className="text-left py-3 px-4">Date</th>
                      <th className="text-left py-3 px-4">Description</th>
                      <th className="text-left py-3 px-4">Gravite</th>
                      <th className="text-left py-3 px-4">Actions</th>
                      <th className="text-left py-3 px-4">Suivi</th>
                      <th className="text-left py-3 px-4">Statut</th>
                      <th className="text-left py-3 px-4">Gerer</th>
                    </tr>
                  </thead>
                  <tbody>
                    {incidents.map(inc => (
                      <tr key={inc.id} className={`border-t border-[#E5E7EB] dark:border-[#1A1A1A]/50 hover:bg-[#F5F5F5] dark:hover:bg-[#171717]/30 transition-colors ${inc.severity === 'critique' ? 'bg-red-500/5' : ''}`}>
                        <td className="py-3 px-4 text-[#737373] whitespace-nowrap">{new Date(inc.date).toLocaleDateString('fr-FR')}</td>
                        <td className="py-3 px-4 text-[#111111] dark:text-white max-w-xs">
                          <div className="truncate">{inc.description}</div>
                          <div className="text-[10px] text-[#737373] mt-0.5">Par {inc.reporter}</div>
                        </td>
                        <td className="py-3 px-4">
                          <span className={`px-2 py-0.5 rounded-lg text-xs font-semibold ${SEVERITY_BADGE[inc.severity]}`}>
                            {SEVERITY_LABELS[inc.severity]}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-[#737373] text-xs max-w-[200px] truncate">{inc.actionsTaken || '-'}</td>
                        <td className="py-3 px-4 text-[#737373] text-xs max-w-[200px] truncate">{inc.followUp || '-'}</td>
                        <td className="py-3 px-4">
                          <span className={`px-2.5 py-0.5 rounded-lg text-xs font-semibold ${INCIDENT_STATUS_BADGE[inc.status]}`}>
                            {INCIDENT_STATUS_LABELS[inc.status]}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          {inc.status !== 'clos' && (
                            <div className="flex gap-1">
                              {inc.status === 'ouvert' && (
                                <button onClick={() => updateIncidentStatus(inc.id, 'en_cours')}
                                  className="px-2 py-1 text-xs bg-amber-900/30 text-amber-300 rounded-lg hover:bg-amber-900/50 transition-colors">
                                  Traiter
                                </button>
                              )}
                              <button onClick={() => updateIncidentStatus(inc.id, 'clos')}
                                className="px-2 py-1 text-xs bg-emerald-900/30 text-emerald-300 rounded-lg hover:bg-emerald-900/50 transition-colors">
                                Clore
                              </button>
                            </div>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {incidents.length === 0 && (
                <div className="text-center py-12 text-[#737373]">
                  <CheckCircle2 className="w-12 h-12 mx-auto mb-3 text-emerald-400" />
                  <p className="font-medium text-[#111111] dark:text-white">Aucun incident enregistre</p>
                  <p className="text-sm mt-1">C'est une bonne nouvelle !</p>
                </div>
              )}
            </div>
          )}

          {/* TIMELINE VIEW */}
          {incidentView === 'timeline' && (
            <div className="space-y-0 print-report">
              {incidents.length === 0 ? (
                <div className="bg-white dark:bg-[#0A0A0A]/50 border border-[#E5E7EB] dark:border-[#1A1A1A] rounded-2xl p-12 text-center">
                  <CheckCircle2 className="w-12 h-12 mx-auto mb-3 text-emerald-400" />
                  <p className="font-medium text-[#111111] dark:text-white">Aucun incident</p>
                </div>
              ) : (
                <div className="relative pl-8">
                  {/* Timeline line */}
                  <div className="absolute left-3 top-0 bottom-0 w-0.5 bg-[#E5E7EB] dark:bg-[#1A1A1A]" />

                  {incidents.map((inc, idx) => {
                    const sevColor = inc.severity === 'critique' ? 'bg-red-500' :
                      inc.severity === 'grave' ? 'bg-orange-500' :
                      inc.severity === 'moyen' ? 'bg-amber-500' : 'bg-blue-500';

                    return (
                      <div key={inc.id} className="relative pb-6">
                        {/* Timeline dot */}
                        <div className={`absolute -left-5 top-4 w-4 h-4 rounded-full border-2 border-white dark:border-black ${sevColor} z-10`} />

                        <div className={`bg-white dark:bg-[#0A0A0A]/50 border rounded-2xl p-5 ml-4 ${inc.severity === 'critique' ? 'border-red-500/30' : 'border-[#E5E7EB] dark:border-[#1A1A1A]'}`}>
                          <div className="flex items-start justify-between gap-4">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-2">
                                <span className="text-xs text-[#737373]">{new Date(inc.date).toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' })}</span>
                                <span className={`px-2 py-0.5 rounded-lg text-xs font-semibold ${SEVERITY_BADGE[inc.severity]}`}>
                                  {SEVERITY_LABELS[inc.severity]}
                                </span>
                                <span className={`px-2 py-0.5 rounded-lg text-xs font-semibold ${INCIDENT_STATUS_BADGE[inc.status]}`}>
                                  {INCIDENT_STATUS_LABELS[inc.status]}
                                </span>
                              </div>
                              <p className="text-sm text-[#111111] dark:text-white">{inc.description}</p>
                              {inc.actionsTaken && (
                                <div className="mt-2 text-xs">
                                  <span className="text-[#737373]">Actions: </span>
                                  <span className="text-[#111111] dark:text-[#A3A3A3]">{inc.actionsTaken}</span>
                                </div>
                              )}
                              {inc.followUp && (
                                <div className="mt-1 text-xs">
                                  <span className="text-[#737373]">Suivi: </span>
                                  <span className="text-[#111111] dark:text-[#A3A3A3]">{inc.followUp}</span>
                                </div>
                              )}
                              <div className="mt-2 text-[10px] text-[#737373]">
                                Signale par {inc.reporter} a {new Date(inc.timestamp).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
                              </div>
                            </div>
                            {inc.status !== 'clos' && (
                              <div className="flex gap-1 flex-shrink-0">
                                {inc.status === 'ouvert' && (
                                  <button onClick={() => updateIncidentStatus(inc.id, 'en_cours')}
                                    className="px-2 py-1 text-xs bg-amber-900/30 text-amber-300 rounded-lg hover:bg-amber-900/50 transition-colors">
                                    Traiter
                                  </button>
                                )}
                                <button onClick={() => updateIncidentStatus(inc.id, 'clos')}
                                  className="px-2 py-1 text-xs bg-emerald-900/30 text-emerald-300 rounded-lg hover:bg-emerald-900/50 transition-colors">
                                  Clore
                                </button>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* ═══════════════════════════════════════════════════════════════════
           TRACABILITE
         ═══════════════════════════════════════════════════════════════════ */}
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

      {/* ═══════════════════════════════════════════════════════════════════
           ALERTES DLUO
         ═══════════════════════════════════════════════════════════════════ */}
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
