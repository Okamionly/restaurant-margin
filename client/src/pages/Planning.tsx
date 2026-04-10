import { useState, useMemo, useCallback, useEffect, useRef, DragEvent, MouseEvent as ReactMouseEvent } from 'react';
import {
  CalendarDays, Clock, Users, Euro, Plus, ChevronLeft, ChevronRight,
  Edit, Trash2, X, UserPlus, AlertTriangle, Eye, GripVertical,
  Timer, LogIn, LogOut, Play, Square, Printer, AlertCircle,
  Sun, Moon, Coffee, ChefHat, UtensilsCrossed, GlassWater, Droplets,
  Send, Copy, Save, FileText, Ban, Check, MessageSquare, Zap, Shield
} from 'lucide-react';
import { useToast } from '../hooks/useToast';
import { useTranslation } from '../hooks/useTranslation';
import Modal from '../components/Modal';

// ── Types ──────────────────────────────────────────────────────────────

interface Employee {
  id: number;
  name: string;
  role: string;
  hourlyRate: number;
  color: string;
  email?: string;
  phone?: string;
  active?: boolean;
}

interface Shift {
  id: number;
  employeeId: number;
  date: string; // YYYY-MM-DD
  startTime: string; // HH:mm
  endTime: string; // HH:mm
  type: string;
  notes?: string;
}

interface TimeEntry {
  id: number;
  employeeId: number;
  date: string;
  punchIn: string;
  punchOut: string | null;
  totalMinutes: number | null;
  notes: string | null;
  employee?: { id: number; name: string; role: string; color: string; hourlyRate: number };
}

interface TimeclockSummaryEmployee {
  id: number;
  name: string;
  role: string;
  color: string;
  hourlyRate: number;
  totalMinutes: number;
  totalHours: number;
  totalCost: number;
  entryCount: number;
  days: Record<string, number>;
}

interface Conflict {
  employeeId: number;
  employeeName: string;
  shiftA: Shift;
  shiftB: Shift;
}

interface Availability {
  id: number;
  employeeId: number;
  dayOfWeek: number; // 0=Lun, 1=Mar, ..., 6=Dim
  startTime: string;
  endTime: string;
  available: boolean; // true=dispo, false=indisponible
}

interface ShiftTemplate {
  id: number;
  name: string;
  description: string;
  assignments: {
    role: string;
    count: number;
    startTime: string;
    endTime: string;
    type: string;
  }[];
}

type EmployeeRole = 'Chef' | 'Commis' | 'Serveur' | 'Serveuse' | 'Plongeur' | 'Plongeuse' | 'Patissier' | 'Patissiere';

type ShiftType = 'matin' | 'midi' | 'soir';

type PosteType = 'cuisine' | 'salle' | 'bar' | 'plonge';

const ROLES: EmployeeRole[] = ['Chef', 'Commis', 'Serveur', 'Serveuse', 'Plongeur', 'Plongeuse', 'Patissier', 'Patissiere'];

const ROLE_LABELS: Record<string, string> = {
  Chef: 'Chef',
  Commis: 'Commis',
  Serveur: 'Serveur',
  Serveuse: 'Serveuse',
  Plongeur: 'Plongeur',
  Plongeuse: 'Plongeuse',
  Patissier: 'Patissier',
  Patissiere: 'Patissiere',
};

const EMPLOYEE_COLORS = [
  '#3b82f6', '#ef4444', '#10b981', '#f59e0b', '#8b5cf6',
  '#ec4899', '#06b6d4', '#f97316', '#14b8a6', '#6366f1',
];

const SHIFT_TYPES: { key: ShiftType; label: string; start: string; end: string; color: string; bg: string }[] = [
  { key: 'matin', label: 'Matin', start: '06:00', end: '14:00', color: 'text-amber-400', bg: 'bg-amber-500/20 border-amber-500/30' },
  { key: 'midi', label: 'Midi', start: '11:00', end: '15:00', color: 'text-teal-400', bg: 'bg-teal-500/20 border-teal-500/30' },
  { key: 'soir', label: 'Soir', start: '17:00', end: '23:00', color: 'text-purple-400', bg: 'bg-purple-500/20 border-purple-500/30' },
];

const POSTES: { value: PosteType; label: string; icon: string }[] = [
  { value: 'cuisine', label: 'Cuisine', icon: 'chef' },
  { value: 'salle', label: 'Salle', icon: 'utensils' },
  { value: 'bar', label: 'Bar', icon: 'glass' },
  { value: 'plonge', label: 'Plonge', icon: 'droplets' },
];

const POSTE_COLORS: Record<string, { bg: string; text: string; border: string }> = {
  cuisine: { bg: 'bg-orange-500/15', text: 'text-orange-500', border: 'border-orange-500/30' },
  salle: { bg: 'bg-blue-500/15', text: 'text-blue-500', border: 'border-blue-500/30' },
  bar: { bg: 'bg-purple-500/15', text: 'text-purple-500', border: 'border-purple-500/30' },
  plonge: { bg: 'bg-cyan-500/15', text: 'text-cyan-500', border: 'border-cyan-500/30' },
};

const JOURS = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'];
const JOURS_FULL = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi', 'Dimanche'];

// Time grid hours 6h -> 23h
const GRID_HOURS = Array.from({ length: 18 }, (_, i) => i + 6);

// ── Default Shift Templates ──────────────────────────────────────────
const DEFAULT_TEMPLATES: ShiftTemplate[] = [
  {
    id: 1,
    name: 'Service midi standard',
    description: '3 cuisiniers + 2 serveurs, 10h-15h',
    assignments: [
      { role: 'Chef', count: 1, startTime: '10:00', endTime: '15:00', type: 'cuisine' },
      { role: 'Commis', count: 2, startTime: '10:00', endTime: '15:00', type: 'cuisine' },
      { role: 'Serveur', count: 2, startTime: '11:00', endTime: '15:00', type: 'salle' },
    ],
  },
  {
    id: 2,
    name: 'Service soir complet',
    description: '2 cuisiniers + 3 serveurs + 1 plongeur, 17h-23h',
    assignments: [
      { role: 'Chef', count: 1, startTime: '17:00', endTime: '23:00', type: 'cuisine' },
      { role: 'Commis', count: 1, startTime: '17:00', endTime: '23:00', type: 'cuisine' },
      { role: 'Serveur', count: 2, startTime: '18:00', endTime: '23:00', type: 'salle' },
      { role: 'Serveuse', count: 1, startTime: '18:00', endTime: '23:00', type: 'salle' },
      { role: 'Plongeur', count: 1, startTime: '18:00', endTime: '23:00', type: 'plonge' },
    ],
  },
  {
    id: 3,
    name: 'Brunch weekend',
    description: '2 cuisiniers + 2 serveurs + 1 bar, 8h-14h',
    assignments: [
      { role: 'Chef', count: 1, startTime: '08:00', endTime: '14:00', type: 'cuisine' },
      { role: 'Commis', count: 1, startTime: '08:00', endTime: '14:00', type: 'cuisine' },
      { role: 'Serveur', count: 1, startTime: '09:00', endTime: '14:00', type: 'salle' },
      { role: 'Serveuse', count: 1, startTime: '09:00', endTime: '14:00', type: 'salle' },
    ],
  },
  {
    id: 4,
    name: 'Equipe reduite',
    description: '1 cuisinier + 1 serveur, pour jour calme',
    assignments: [
      { role: 'Chef', count: 1, startTime: '11:00', endTime: '15:00', type: 'cuisine' },
      { role: 'Serveur', count: 1, startTime: '11:00', endTime: '15:00', type: 'salle' },
    ],
  },
];

// French labor law constants
const LEGAL_WEEKLY_HOURS = 35;
const LEGAL_MAX_WEEKLY_HOURS = 48;
const LEGAL_MAX_DAILY_HOURS = 10;
const OVERTIME_RATE_1 = 1.25; // 36h-43h: +25%
const OVERTIME_RATE_2 = 1.50; // 44h+: +50%

// ── Helpers ──────────────────────────────────────────────────────────

function getMonday(d: Date): Date {
  const date = new Date(d);
  const day = date.getDay();
  const diff = date.getDate() - day + (day === 0 ? -6 : 1);
  date.setDate(diff);
  date.setHours(0, 0, 0, 0);
  return date;
}

function addDays(d: Date, n: number): Date {
  const date = new Date(d);
  date.setDate(date.getDate() + n);
  return date;
}

function formatDate(d: Date): string {
  if (!d || isNaN(d.getTime())) return '';
  return d.toISOString().slice(0, 10);
}

function shiftHours(start: string, end: string): number {
  if (!start || !end) return 0;
  const [sh, sm] = start.split(':').map(Number);
  const [eh, em] = end.split(':').map(Number);
  if (isNaN(sh) || isNaN(sm) || isNaN(eh) || isNaN(em)) return 0;
  return Math.max(0, (eh * 60 + em - sh * 60 - sm) / 60);
}

function getShiftType(start: string): ShiftType {
  if (!start) return 'matin';
  const h = parseInt((start || '').split(':')[0]);
  if (isNaN(h) || h < 11) return 'matin';
  if (h < 17) return 'midi';
  return 'soir';
}

function timeToMinutes(t: string): number {
  const [h, m] = t.split(':').map(Number);
  return h * 60 + (m || 0);
}

function minutesToTime(m: number): string {
  const h = Math.floor(m / 60);
  const min = m % 60;
  return `${h.toString().padStart(2, '0')}:${min.toString().padStart(2, '0')}`;
}

function getPosteIcon(type: string) {
  switch (type) {
    case 'cuisine': return <ChefHat className="w-3 h-3" />;
    case 'salle': return <UtensilsCrossed className="w-3 h-3" />;
    case 'bar': return <GlassWater className="w-3 h-3" />;
    case 'plonge': return <Droplets className="w-3 h-3" />;
    default: return <ChefHat className="w-3 h-3" />;
  }
}

// Detect conflicts: same employee, same day, overlapping times
function detectConflicts(shifts: Shift[], employees: Employee[]): Conflict[] {
  const conflicts: Conflict[] = [];
  const empMap = new Map(employees.map(e => [e.id, e]));

  // Group shifts by employeeId + date
  const grouped = new Map<string, Shift[]>();
  for (const s of shifts) {
    const key = `${s.employeeId}-${s.date}`;
    const arr = grouped.get(key) || [];
    arr.push(s);
    grouped.set(key, arr);
  }

  for (const [, dayShifts] of grouped) {
    if (dayShifts.length < 2) continue;
    for (let i = 0; i < dayShifts.length; i++) {
      for (let j = i + 1; j < dayShifts.length; j++) {
        const a = dayShifts[i];
        const b = dayShifts[j];
        if (a.startTime < b.endTime && a.endTime > b.startTime) {
          const emp = empMap.get(a.employeeId);
          if (emp) {
            conflicts.push({
              employeeId: a.employeeId,
              employeeName: emp.name,
              shiftA: a,
              shiftB: b,
            });
          }
        }
      }
    }
  }
  return conflicts;
}

// ── API helpers ──────────────────────────────────────────────────────

function getAuthHeaders(): Record<string, string> {
  const token = localStorage.getItem('token');
  const rid = localStorage.getItem('activeRestaurantId');
  const headers: Record<string, string> = { 'Content-Type': 'application/json' };
  if (token) headers['Authorization'] = `Bearer ${token}`;
  if (rid) headers['X-Restaurant-Id'] = rid;
  return headers;
}

// ── Print CSS ───────────────────────────────────────────────────────

const PRINT_STYLE_ID = 'planning-print-style';

function injectPrintStyles() {
  if (document.getElementById(PRINT_STYLE_ID)) return;
  const style = document.createElement('style');
  style.id = PRINT_STYLE_ID;
  style.textContent = `
    @media print {
      body * { visibility: hidden !important; }
      #planning-printable, #planning-printable * { visibility: visible !important; }
      #planning-printable {
        position: absolute !important;
        left: 0 !important;
        top: 0 !important;
        width: 100% !important;
        background: white !important;
        color: black !important;
        padding: 20px !important;
      }
      #planning-printable .no-print { display: none !important; }
      #planning-printable table { border-collapse: collapse; width: 100%; }
      #planning-printable th, #planning-printable td {
        border: 1px solid #ccc !important;
        padding: 4px 8px !important;
        font-size: 11px !important;
        color: black !important;
        background: white !important;
      }
      #planning-printable th { background: #f5f5f5 !important; font-weight: bold; }
      #planning-printable .print-title {
        font-size: 18px !important;
        font-weight: bold !important;
        margin-bottom: 12px !important;
        display: block !important;
        color: black !important;
      }
      #planning-printable .print-subtitle {
        font-size: 12px !important;
        color: #666 !important;
        margin-bottom: 16px !important;
        display: block !important;
      }
      #planning-printable .shift-chip {
        display: inline-block;
        padding: 1px 6px;
        border-radius: 4px;
        font-size: 10px !important;
        border: 1px solid #ccc !important;
        margin: 1px;
      }
    }
  `;
  document.head.appendChild(style);
}

// ── Component ──────────────────────────────────────────────────────────

export default function Planning() {
  const { t } = useTranslation();
  const { showToast } = useToast();
  const [planningTab, setPlanningTab] = useState<'planning' | 'pointage'>('planning');
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [shifts, setShifts] = useState<Shift[]>([]);
  const [weekStart, setWeekStart] = useState<Date>(() => getMonday(new Date()));

  // Timeclock state
  const [todayEntries, setTodayEntries] = useState<TimeEntry[]>([]);
  const [timeclockSummary, setTimeclockSummary] = useState<TimeclockSummaryEmployee[]>([]);
  const [timeclockLoading, setTimeclockLoading] = useState(false);
  const [clockTick, setClockTick] = useState(0);
  const [view, setView] = useState<'semaine' | 'jour'>('semaine');
  const [selectedDayIdx, setSelectedDayIdx] = useState(() => {
    const today = new Date().getDay();
    return today === 0 ? 6 : today - 1;
  });
  const [nextId, setNextId] = useState(100);
  const [dragEmployee, setDragEmployee] = useState<Employee | null>(null);

  // Drag-to-create state
  const [dragCreateState, setDragCreateState] = useState<{
    dayIdx: number;
    startHour: number;
    currentHour: number;
    active: boolean;
  } | null>(null);

  // Availability management
  const [availabilities, setAvailabilities] = useState<Availability[]>([]);
  const [showAvailabilityModal, setShowAvailabilityModal] = useState(false);
  const [availabilityEmployee, setAvailabilityEmployee] = useState<Employee | null>(null);
  const [availForm, setAvailForm] = useState({ dayOfWeek: 0, startTime: '06:00', endTime: '23:00', available: false as boolean });

  // Shift templates
  const [shiftTemplates, setShiftTemplates] = useState<ShiftTemplate[]>(() => {
    try {
      const saved = localStorage.getItem('planning-templates');
      return saved ? JSON.parse(saved) : DEFAULT_TEMPLATES;
    } catch { return DEFAULT_TEMPLATES; }
  });
  const [showTemplateModal, setShowTemplateModal] = useState(false);
  const [showTemplateApplyModal, setShowTemplateApplyModal] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<ShiftTemplate | null>(null);
  const [templateApplyDate, setTemplateApplyDate] = useState('');

  // WhatsApp modal
  const [showWhatsappModal, setShowWhatsappModal] = useState(false);

  // Overtime details modal
  const [showOvertimeModal, setShowOvertimeModal] = useState(false);

  // Modals
  const [showEmployeeModal, setShowEmployeeModal] = useState(false);
  const [showShiftModal, setShowShiftModal] = useState(false);
  const [showConflictsModal, setShowConflictsModal] = useState(false);
  const [editEmployee, setEditEmployee] = useState<Employee | null>(null);
  const [editShift, setEditShift] = useState<Shift | null>(null);

  // Employee form
  const emptyEmpForm = { name: '', role: 'Commis' as string, hourlyRate: '', color: EMPLOYEE_COLORS[0] };
  const [empForm, setEmpForm] = useState(emptyEmpForm);

  // Shift form
  const emptyShiftForm = { employeeId: '', date: '', startTime: '', endTime: '', type: 'cuisine' };
  const [shiftForm, setShiftForm] = useState(emptyShiftForm);

  // Weekly revenue for ratio (0 when no data)
  const weeklyRevenue = 0;

  // Inject print styles on mount
  useEffect(() => { injectPrintStyles(); }, []);

  // Persist templates to localStorage
  useEffect(() => {
    localStorage.setItem('planning-templates', JSON.stringify(shiftTemplates));
  }, [shiftTemplates]);

  // Load availabilities
  const loadAvailabilities = useCallback(async () => {
    try {
      const res = await fetch('/api/planning/availabilities', { headers: getAuthHeaders() });
      if (res.ok) {
        const data = await res.json();
        setAvailabilities(Array.isArray(data) ? data : []);
      }
    } catch {
      // Silently ignore - availability is optional
    }
  }, []);

  useEffect(() => { loadAvailabilities(); }, [loadAvailabilities]);

  // ── API: Load employees on mount ──────────────────────────────────────

  const loadEmployees = useCallback(async () => {
    try {
      const res = await fetch('/api/planning/employees', { headers: getAuthHeaders() });
      if (!res.ok) throw new Error('Failed to load employees');
      const data = await res.json();
      setEmployees(Array.isArray(data) ? data : []);
    } catch {
      setEmployees([]);
    }
  }, []);

  const loadShifts = useCallback(async (from: string, to: string) => {
    try {
      const res = await fetch(`/api/planning/shifts?from=${from}&to=${to}`, { headers: getAuthHeaders() });
      if (!res.ok) throw new Error('Failed to load shifts');
      const data = await res.json();
      setShifts(Array.isArray(data) ? data : []);
    } catch {
      setShifts([]);
    }
  }, []);

  useEffect(() => {
    loadEmployees();
  }, [loadEmployees]);

  useEffect(() => {
    const from = formatDate(weekStart);
    const to = formatDate(addDays(weekStart, 6));
    loadShifts(from, to);
  }, [weekStart, loadShifts]);

  // ── Timeclock API ──────────────────────────────────────────────────

  const loadTodayEntries = useCallback(async () => {
    try {
      const res = await fetch('/api/timeclock/today', { headers: getAuthHeaders() });
      if (!res.ok) throw new Error('Failed to load today entries');
      const data = await res.json();
      setTodayEntries(Array.isArray(data) ? data : []);
    } catch {
      setTodayEntries([]);
    }
  }, []);

  const loadTimeclockSummary = useCallback(async () => {
    try {
      const from = formatDate(weekStart);
      const to = formatDate(addDays(weekStart, 6));
      const res = await fetch(`/api/timeclock/summary?from=${from}&to=${to}`, { headers: getAuthHeaders() });
      if (!res.ok) throw new Error('Failed to load timeclock summary');
      const data = await res.json();
      setTimeclockSummary(Array.isArray(data.employees) ? data.employees : []);
    } catch {
      setTimeclockSummary([]);
    }
  }, [weekStart]);

  useEffect(() => {
    if (planningTab === 'pointage') {
      loadTodayEntries();
      loadTimeclockSummary();
    }
  }, [planningTab, loadTodayEntries, loadTimeclockSummary]);

  // Clock tick for live duration display
  useEffect(() => {
    if (planningTab !== 'pointage') return;
    const interval = setInterval(() => setClockTick(prev => prev + 1), 30000);
    return () => clearInterval(interval);
  }, [planningTab]);

  async function handlePunchIn(employeeId: number) {
    setTimeclockLoading(true);
    try {
      const res = await fetch('/api/timeclock/punch-in', {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({ employeeId }),
      });
      if (!res.ok) {
        const err = await res.json();
        showToast(err.error || 'Erreur punch-in', 'error');
        return;
      }
      showToast('Pointage enregistre !', 'success');
      await loadTodayEntries();
    } catch {
      showToast('Erreur punch-in', 'error');
    } finally {
      setTimeclockLoading(false);
    }
  }

  async function handlePunchOut(employeeId: number) {
    setTimeclockLoading(true);
    try {
      const res = await fetch('/api/timeclock/punch-out', {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({ employeeId }),
      });
      if (!res.ok) {
        const err = await res.json();
        showToast(err.error || 'Erreur punch-out', 'error');
        return;
      }
      showToast('Sortie enregistree !', 'success');
      await loadTodayEntries();
      await loadTimeclockSummary();
    } catch {
      showToast('Erreur punch-out', 'error');
    } finally {
      setTimeclockLoading(false);
    }
  }

  function getEmployeePunchStatus(empId: number): { isPunchedIn: boolean; entry: TimeEntry | null } {
    const openEntry = todayEntries.find(e => e.employeeId === empId && !e.punchOut);
    return { isPunchedIn: !!openEntry, entry: openEntry || null };
  }

  function formatDuration(minutes: number): string {
    const h = Math.floor(minutes / 60);
    const m = minutes % 60;
    return `${h}h${m.toString().padStart(2, '0')}`;
  }

  function getElapsedMinutes(punchIn: string): number {
    const start = new Date(punchIn).getTime();
    const now = Date.now();
    return Math.max(0, Math.round((now - start) / 60000));
  }

  function formatTimeFromISO(iso: string): string {
    const d = new Date(iso);
    return `${d.getHours().toString().padStart(2, '0')}:${d.getMinutes().toString().padStart(2, '0')}`;
  }

  // ── Week navigation ─────────────────────────────────────────────────

  const weekDays = useMemo(() => {
    return Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));
  }, [weekStart]);

  const weekLabel = useMemo(() => {
    const end = addDays(weekStart, 6);
    const moisStart = weekStart.toLocaleDateString('fr-FR', { month: 'long' }) || '';
    const moisEnd = end.toLocaleDateString('fr-FR', { month: 'long' }) || '';
    const year = weekStart.getFullYear();
    if (moisStart === moisEnd) {
      return `${weekStart.getDate()} - ${end.getDate()} ${moisStart ? moisStart.charAt(0).toUpperCase() + moisStart.slice(1) : ''} ${year}`;
    }
    return `${weekStart.getDate()} ${moisStart ? moisStart.charAt(0).toUpperCase() + moisStart.slice(1) : ''} - ${end.getDate()} ${moisEnd ? moisEnd.charAt(0).toUpperCase() + moisEnd.slice(1) : ''} ${year}`;
  }, [weekStart]);

  function goThisWeek() { setWeekStart(getMonday(new Date())); }
  function goPrev() { setWeekStart(addDays(weekStart, -7)); }
  function goNext() { setWeekStart(addDays(weekStart, 7)); }

  // ── Computed stats ──────────────────────────────────────────────────

  const weekDayStrings = useMemo(() => weekDays.map(formatDate), [weekDays]);

  const weekShifts = useMemo(() => {
    const set = new Set(weekDayStrings);
    return shifts.filter(s => set.has(s.date));
  }, [shifts, weekDayStrings]);

  const totalHoursWeek = useMemo(() => {
    return weekShifts.reduce((sum, s) => sum + shiftHours(s.startTime, s.endTime), 0);
  }, [weekShifts]);

  const laborCost = useMemo(() => {
    return weekShifts.reduce((sum, s) => {
      const emp = employees.find(e => e.id === s.employeeId);
      if (!emp) return sum;
      return sum + shiftHours(s.startTime, s.endTime) * (emp.hourlyRate ?? 0);
    }, 0);
  }, [weekShifts, employees]);

  const laborRatio = weeklyRevenue > 0 ? (laborCost / weeklyRevenue) * 100 : 0;

  // Today's staff count
  const todayStr = formatDate(new Date());
  const todayShifts = useMemo(() => shifts.filter(s => s.date === todayStr), [shifts, todayStr]);
  const todayStaffCount = useMemo(() => {
    return new Set(todayShifts.map(s => s.employeeId)).size;
  }, [todayShifts]);
  const todayTotalHours = useMemo(() => {
    return todayShifts.reduce((sum, s) => sum + shiftHours(s.startTime, s.endTime), 0);
  }, [todayShifts]);
  const todayEstCost = useMemo(() => {
    return todayShifts.reduce((sum, s) => {
      const emp = employees.find(e => e.id === s.employeeId);
      return sum + (emp ? shiftHours(s.startTime, s.endTime) * (emp.hourlyRate ?? 0) : 0);
    }, 0);
  }, [todayShifts, employees]);

  // Per-employee weekly hours
  const employeeWeeklyHours = useMemo(() => {
    const map = new Map<number, number>();
    for (const emp of employees) {
      const hours = weekShifts
        .filter(s => s.employeeId === emp.id)
        .reduce((sum, s) => sum + shiftHours(s.startTime, s.endTime), 0);
      map.set(emp.id, hours);
    }
    return map;
  }, [employees, weekShifts]);

  const alertCount = useMemo(() => {
    let count = 0;
    employeeWeeklyHours.forEach(h => { if (h > 35) count++; });
    return count;
  }, [employeeWeeklyHours]);

  // Conflict detection
  const conflicts = useMemo(() => detectConflicts(weekShifts, employees), [weekShifts, employees]);

  // Daily cost
  const dailyCosts = useMemo(() => {
    return weekDayStrings.map(dayStr => {
      return shifts
        .filter(s => s.date === dayStr)
        .reduce((sum, s) => {
          const emp = employees.find(e => e.id === s.employeeId);
          return sum + (emp ? shiftHours(s.startTime, s.endTime) * (emp.hourlyRate ?? 0) : 0);
        }, 0);
    });
  }, [weekDayStrings, shifts, employees]);

  // Overtime details per employee (French labor law)
  const overtimeDetails = useMemo(() => {
    return employees.map(emp => {
      const hours = employeeWeeklyHours.get(emp.id) || 0;
      const isOver35 = hours > LEGAL_WEEKLY_HOURS;
      const isOver48 = hours > LEGAL_MAX_WEEKLY_HOURS;
      const overtime = Math.max(0, hours - LEGAL_WEEKLY_HOURS);
      const overtimeAt25 = Math.min(overtime, 8); // 36h-43h
      const overtimeAt50 = Math.max(0, overtime - 8); // 44h+
      const baseCost = LEGAL_WEEKLY_HOURS * (emp.hourlyRate ?? 0);
      const overtimeCost = overtimeAt25 * (emp.hourlyRate ?? 0) * OVERTIME_RATE_1
        + overtimeAt50 * (emp.hourlyRate ?? 0) * OVERTIME_RATE_2;
      // Check daily hours
      const dailyAlerts: string[] = [];
      weekDayStrings.forEach((dayStr, i) => {
        const dayHours = weekShifts
          .filter(s => s.employeeId === emp.id && s.date === dayStr)
          .reduce((sum, s) => sum + shiftHours(s.startTime, s.endTime), 0);
        if (dayHours > LEGAL_MAX_DAILY_HOURS) {
          dailyAlerts.push(`${JOURS[i]}: ${dayHours.toFixed(1)}h (max ${LEGAL_MAX_DAILY_HOURS}h)`);
        }
      });
      return { emp, hours, isOver35, isOver48, overtime, overtimeAt25, overtimeAt50, baseCost, overtimeCost, dailyAlerts };
    }).filter(d => d.isOver35 || d.dailyAlerts.length > 0);
  }, [employees, employeeWeeklyHours, weekShifts, weekDayStrings]);

  // Get unavailable slots for a given employee on a given day-of-week
  function getUnavailableSlots(empId: number, dayOfWeek: number): Availability[] {
    return availabilities.filter(a => a.employeeId === empId && a.dayOfWeek === dayOfWeek && !a.available);
  }

  // WhatsApp message generator
  const whatsappMessage = useMemo(() => {
    const lines: string[] = [];
    lines.push(`Planning semaine du ${weekLabel}`);
    lines.push('');
    employees.forEach(emp => {
      const empShifts = weekShifts.filter(s => s.employeeId === emp.id);
      if (empShifts.length === 0) return;
      lines.push(`${emp.name} (${ROLE_LABELS[emp.role] || emp.role}):`);
      weekDayStrings.forEach((dayStr, i) => {
        const dayShifts = empShifts.filter(s => s.date === dayStr);
        if (dayShifts.length > 0) {
          const times = dayShifts.map(s => `${s.startTime}-${s.endTime}`).join(', ');
          lines.push(`  ${JOURS_FULL[i]}: ${times}`);
        }
      });
      const hours = employeeWeeklyHours.get(emp.id) || 0;
      lines.push(`  Total: ${hours.toFixed(0)}h`);
      lines.push('');
    });
    return lines.join('\n');
  }, [employees, weekShifts, weekDayStrings, weekLabel, employeeWeeklyHours]);

  // Apply template to a date
  async function applyTemplate(template: ShiftTemplate, date: string) {
    if (!date) {
      showToast('Selectionnez une date', 'error');
      return;
    }
    let addedCount = 0;
    for (const assignment of template.assignments) {
      // Find matching employees by role
      const matchingEmps = employees.filter(e => e.role === assignment.role ||
        (assignment.role === 'Serveur' && (e.role === 'Serveur' || e.role === 'Serveuse')) ||
        (assignment.role === 'Commis' && (e.role === 'Commis' || e.role === 'Chef')) ||
        (assignment.role === 'Plongeur' && (e.role === 'Plongeur' || e.role === 'Plongeuse'))
      );
      const needed = Math.min(assignment.count, matchingEmps.length);
      for (let i = 0; i < needed; i++) {
        const emp = matchingEmps[i];
        // Check for overlap
        const overlap = shifts.some(s => {
          if (s.employeeId !== emp.id || s.date !== date) return false;
          return s.startTime < assignment.endTime && s.endTime > assignment.startTime;
        });
        if (overlap) continue;
        const shiftData = {
          employeeId: emp.id,
          date,
          startTime: assignment.startTime,
          endTime: assignment.endTime,
          type: assignment.type,
        };
        const localId = nextId + addedCount;
        const newShift: Shift = { id: localId, ...shiftData };
        try {
          const res = await fetch('/api/planning/shifts', {
            method: 'POST',
            headers: getAuthHeaders(),
            body: JSON.stringify(shiftData),
          });
          if (res.ok) {
            const saved = await res.json();
            setShifts(prev => [...prev, saved]);
          } else {
            setShifts(prev => [...prev, newShift]);
          }
        } catch {
          setShifts(prev => [...prev, newShift]);
        }
        addedCount++;
      }
    }
    setNextId(n => n + addedCount);
    showToast(`Template "${template.name}" applique: ${addedCount} creneaux ajoutes`, 'success');
    setShowTemplateApplyModal(false);
    setSelectedTemplate(null);
  }

  // Availability CRUD
  function openAvailabilityManager(emp: Employee) {
    setAvailabilityEmployee(emp);
    setAvailForm({ dayOfWeek: 0, startTime: '06:00', endTime: '23:00', available: false });
    setShowAvailabilityModal(true);
  }

  async function addAvailability() {
    if (!availabilityEmployee) return;
    const newAvail: Availability = {
      id: Date.now(),
      employeeId: availabilityEmployee.id,
      dayOfWeek: availForm.dayOfWeek,
      startTime: availForm.startTime,
      endTime: availForm.endTime,
      available: availForm.available,
    };
    setAvailabilities(prev => [...prev, newAvail]);
    try {
      await fetch('/api/planning/availabilities', {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(newAvail),
      });
    } catch {
      // Already added locally
    }
    showToast('Disponibilite ajoutee', 'success');
  }

  function removeAvailability(id: number) {
    setAvailabilities(prev => prev.filter(a => a.id !== id));
    try {
      fetch(`/api/planning/availabilities/${id}`, { method: 'DELETE', headers: getAuthHeaders() });
    } catch {
      // Already removed locally
    }
    showToast('Disponibilite supprimee', 'success');
  }

  // ── Employee CRUD ──────────────────────────────────────────────────

  function openAddEmployee() {
    setEditEmployee(null);
    const usedColors = new Set(employees.map(e => e.color));
    const nextColor = EMPLOYEE_COLORS.find(c => !usedColors.has(c)) || EMPLOYEE_COLORS[employees.length % EMPLOYEE_COLORS.length];
    setEmpForm({ ...emptyEmpForm, color: nextColor });
    setShowEmployeeModal(true);
  }

  function openEditEmployee(emp: Employee) {
    setEditEmployee(emp);
    setEmpForm({
      name: emp.name || '',
      role: emp.role || 'Commis',
      hourlyRate: String(emp.hourlyRate ?? 12),
      color: emp.color || EMPLOYEE_COLORS[0],
    });
    setShowEmployeeModal(true);
  }

  async function saveEmployee() {
    if (!empForm.name.trim() || !empForm.hourlyRate) {
      showToast(t('planning.fillAllFields'), 'error');
      return;
    }
    const empData = {
      name: empForm.name.trim(),
      role: empForm.role,
      hourlyRate: parseFloat(empForm.hourlyRate),
      color: empForm.color,
    };
    if (editEmployee) {
      setEmployees(prev => prev.map(e =>
        e.id === editEmployee.id ? { ...e, ...empData } : e
      ));
      try {
        await fetch(`/api/planning/employees/${editEmployee.id}`, {
          method: 'PUT',
          headers: getAuthHeaders(),
          body: JSON.stringify(empData),
        });
      } catch {
        // Already updated locally
      }
      showToast(t('planning.employeeUpdated'), 'success');
    } else {
      const localId = nextId;
      setNextId(n => n + 1);
      const newEmp: Employee = { id: localId, ...empData };
      try {
        const res = await fetch('/api/planning/employees', {
          method: 'POST',
          headers: getAuthHeaders(),
          body: JSON.stringify(empData),
        });
        if (res.ok) {
          const saved = await res.json();
          setEmployees(prev => [...prev, saved]);
        } else {
          setEmployees(prev => [...prev, newEmp]);
        }
      } catch {
        setEmployees(prev => [...prev, newEmp]);
      }
      showToast(t('planning.employeeAdded'), 'success');
    }
    setShowEmployeeModal(false);
  }

  async function deleteEmployee(id: number) {
    setEmployees(prev => prev.filter(e => e.id !== id));
    setShifts(prev => prev.filter(s => s.employeeId !== id));
    try {
      await fetch(`/api/planning/employees/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
      });
    } catch {
      // Already removed locally
    }
    showToast(t('planning.employeeDeleted'), 'success');
  }

  // ── Shift CRUD ────────────────────────────────────────────────────

  function openAddShift(day?: string, shiftType?: ShiftType, startH?: number, endH?: number) {
    setEditShift(null);
    const st = shiftType ? SHIFT_TYPES.find(s => s.key === shiftType) : null;
    setShiftForm({
      ...emptyShiftForm,
      date: day || '',
      startTime: startH != null ? minutesToTime(startH * 60) : (st?.start || ''),
      endTime: endH != null ? minutesToTime(endH * 60) : (st?.end || ''),
    });
    setShowShiftModal(true);
  }

  function openEditShift(s: Shift) {
    setEditShift(s);
    setShiftForm({
      employeeId: String(s.employeeId ?? ''),
      date: s.date || '',
      startTime: s.startTime || '',
      endTime: s.endTime || '',
      type: s.type || 'cuisine',
    });
    setShowShiftModal(true);
  }

  async function saveShift() {
    if (!shiftForm.employeeId || !shiftForm.date || !shiftForm.startTime || !shiftForm.endTime) {
      showToast(t('planning.fillAllFields'), 'error');
      return;
    }
    if (shiftForm.startTime >= shiftForm.endTime) {
      showToast(t('planning.endAfterStart'), 'error');
      return;
    }
    const empId = parseInt(shiftForm.employeeId);
    const overlap = shifts.some(s => {
      if (editShift && s.id === editShift.id) return false;
      if (s.employeeId !== empId || s.date !== shiftForm.date) return false;
      return s.startTime < shiftForm.endTime && s.endTime > shiftForm.startTime;
    });
    if (overlap) {
      showToast(t('planning.overlapDetected'), 'error');
      return;
    }

    const shiftData = {
      employeeId: empId,
      date: shiftForm.date,
      startTime: shiftForm.startTime,
      endTime: shiftForm.endTime,
      type: shiftForm.type,
    };

    if (editShift) {
      setShifts(prev => prev.map(s =>
        s.id === editShift.id ? { ...s, ...shiftData } : s
      ));
      try {
        await fetch(`/api/planning/shifts/${editShift.id}`, {
          method: 'PUT',
          headers: getAuthHeaders(),
          body: JSON.stringify(shiftData),
        });
      } catch {
        // Already updated locally
      }
      showToast(t('planning.shiftUpdated'), 'success');
    } else {
      const localId = nextId;
      setNextId(n => n + 1);
      const newShift: Shift = { id: localId, ...shiftData };
      try {
        const res = await fetch('/api/planning/shifts', {
          method: 'POST',
          headers: getAuthHeaders(),
          body: JSON.stringify(shiftData),
        });
        if (res.ok) {
          const saved = await res.json();
          setShifts(prev => [...prev, saved]);
        } else {
          setShifts(prev => [...prev, newShift]);
        }
      } catch {
        setShifts(prev => [...prev, newShift]);
      }
      showToast(t('planning.shiftAdded'), 'success');
    }
    setShowShiftModal(false);
  }

  async function deleteShift(id: number) {
    setShifts(prev => prev.filter(s => s.id !== id));
    try {
      await fetch(`/api/planning/shifts/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
      });
    } catch {
      // Already removed locally
    }
    showToast(t('planning.shiftDeleted'), 'success');
  }

  // ── Drag & drop (employee cards) ──────────────────────────────────

  const handleDragStart = useCallback((emp: Employee) => {
    setDragEmployee(emp);
  }, []);

  const handleDragOver = useCallback((e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'copy';
  }, []);

  const handleDrop = useCallback(async (dayStr: string, shiftType: ShiftType) => {
    if (!dragEmployee) return;
    const st = SHIFT_TYPES.find(s => s.key === shiftType)!;
    const overlap = shifts.some(s => {
      if (s.employeeId !== dragEmployee.id || s.date !== dayStr) return false;
      return s.startTime < st.end && s.endTime > st.start;
    });
    if (overlap) {
      showToast(t('planning.overlapDetected'), 'error');
      setDragEmployee(null);
      return;
    }
    const localId = nextId;
    setNextId(n => n + 1);
    const poste = dragEmployee.role === 'Serveur' || dragEmployee.role === 'Serveuse' ? 'salle' as const
      : dragEmployee.role === 'Plongeur' || dragEmployee.role === 'Plongeuse' ? 'plonge' as const
      : 'cuisine' as const;
    const shiftData = {
      employeeId: dragEmployee.id,
      date: dayStr,
      startTime: st.start,
      endTime: st.end,
      type: poste,
    };
    const newShift: Shift = { id: localId, ...shiftData };
    try {
      const res = await fetch('/api/planning/shifts', {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(shiftData),
      });
      if (res.ok) {
        const saved = await res.json();
        setShifts(prev => [...prev, saved]);
      } else {
        setShifts(prev => [...prev, newShift]);
      }
    } catch {
      setShifts(prev => [...prev, newShift]);
    }
    showToast(`${dragEmployee.name || t('planning.employee')} ${t('planning.assigned')}`, 'success');
    setDragEmployee(null);
  }, [dragEmployee, shifts, nextId, showToast, t]);

  // ── Drag-to-create on time grid ───────────────────────────────────

  function handleGridMouseDown(dayIdx: number, hour: number) {
    setDragCreateState({ dayIdx, startHour: hour, currentHour: hour + 1, active: true });
  }

  function handleGridMouseMove(dayIdx: number, hour: number) {
    if (!dragCreateState || !dragCreateState.active) return;
    if (dayIdx !== dragCreateState.dayIdx) return;
    const newEnd = Math.max(dragCreateState.startHour + 1, hour + 1);
    setDragCreateState(prev => prev ? { ...prev, currentHour: Math.min(newEnd, 24) } : null);
  }

  function handleGridMouseUp() {
    if (!dragCreateState || !dragCreateState.active) return;
    const { dayIdx, startHour, currentHour } = dragCreateState;
    const dayStr = weekDayStrings[dayIdx];
    const realStart = Math.min(startHour, currentHour);
    const realEnd = Math.max(startHour, currentHour);
    setDragCreateState(null);
    if (realEnd - realStart >= 1 && dayStr) {
      openAddShift(dayStr, undefined, realStart, realEnd);
    }
  }

  // ── Print handler ─────────────────────────────────────────────────

  function handlePrint() {
    window.print();
  }

  // ── Summary table data ────────────────────────────────────────────

  const summaryRows = useMemo(() => {
    return employees.map(emp => {
      const days = weekDayStrings.map(dayStr => {
        const dayShifts = weekShifts.filter(s => s.employeeId === emp.id && s.date === dayStr);
        return dayShifts.reduce((sum, s) => sum + shiftHours(s.startTime, s.endTime), 0);
      });
      const total = days.reduce((a, b) => a + b, 0);
      return { emp, days, total, cost: total * (emp.hourlyRate ?? 0) };
    });
  }, [employees, weekDayStrings, weekShifts]);

  const totalRow = useMemo(() => {
    const days = weekDayStrings.map((_, i) => summaryRows.reduce((sum, r) => sum + r.days[i], 0));
    const total = days.reduce((a, b) => a + b, 0);
    const cost = summaryRows.reduce((sum, r) => sum + r.cost, 0);
    return { days, total, cost };
  }, [summaryRows, weekDayStrings]);

  // ── Render ──────────────────────────────────────────────────────────

  return (
    <div className="space-y-6" id="planning-printable">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#111111] dark:text-white flex items-center gap-2 print-title">
            <CalendarDays className="w-7 h-7 text-indigo-500 no-print" />
            {t('planning.title')}
          </h1>
          <p className="text-sm text-[#9CA3AF] dark:text-[#737373] mt-1 print-subtitle">
            {t('planning.subtitle')} -- {weekLabel}
          </p>
        </div>
        <div className="flex gap-2 flex-wrap no-print">
          {/* WhatsApp / Send planning */}
          <button
            onClick={() => setShowWhatsappModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-[#25D366] text-white rounded-xl hover:bg-[#20BD5A] transition text-sm font-medium"
          >
            <Send className="w-4 h-4" /> Envoyer le planning
          </button>
          {/* Templates */}
          <button
            onClick={() => setShowTemplateModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-black text-[#111111] dark:text-white border border-[#E5E7EB] dark:border-[#1A1A1A] rounded-xl hover:bg-[#FAFAFA] dark:hover:bg-[#0A0A0A] transition text-sm font-medium"
          >
            <FileText className="w-4 h-4" /> Templates
          </button>
          <button
            onClick={handlePrint}
            className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-black text-[#111111] dark:text-white border border-[#E5E7EB] dark:border-[#1A1A1A] rounded-xl hover:bg-[#FAFAFA] dark:hover:bg-[#0A0A0A] transition text-sm font-medium"
          >
            <Printer className="w-4 h-4" /> Imprimer
          </button>
          {/* Overtime alerts */}
          {overtimeDetails.length > 0 && (
            <button
              onClick={() => setShowOvertimeModal(true)}
              className="flex items-center gap-2 px-4 py-2 bg-amber-600 text-white rounded-xl hover:bg-amber-700 transition text-sm font-medium animate-pulse"
            >
              <Shield className="w-4 h-4" /> {overtimeDetails.length} alerte{overtimeDetails.length > 1 ? 's' : ''} heures
            </button>
          )}
          {conflicts.length > 0 && (
            <button
              onClick={() => setShowConflictsModal(true)}
              className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-xl hover:bg-red-700 transition text-sm font-medium animate-pulse"
            >
              <AlertCircle className="w-4 h-4" /> {conflicts.length} conflit{conflicts.length > 1 ? 's' : ''}
            </button>
          )}
          <button onClick={openAddEmployee} className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition text-sm font-medium">
            <UserPlus className="w-4 h-4" /> {t('planning.employee')}
          </button>
          <button onClick={() => openAddShift()} className="flex items-center gap-2 px-4 py-2 bg-emerald-500 text-white rounded-xl hover:bg-emerald-400 transition text-sm font-medium">
            <Plus className="w-4 h-4" /> {t('planning.shift')}
          </button>
        </div>
      </div>

      {/* Tab navigation */}
      <div className="flex rounded-lg bg-white dark:bg-black border border-[#E5E7EB] dark:border-[#1A1A1A] p-1 gap-1 no-print">
        <button
          onClick={() => setPlanningTab('planning')}
          className={`flex items-center gap-2 px-5 py-2.5 text-sm font-medium rounded-lg transition ${
            planningTab === 'planning'
              ? 'bg-[#111111] dark:bg-white text-white dark:text-black'
              : 'text-[#6B7280] dark:text-[#A3A3A3] hover:bg-[#FAFAFA] dark:hover:bg-[#0A0A0A]'
          }`}
        >
          <CalendarDays className="w-4 h-4" /> Planning
        </button>
        <button
          onClick={() => setPlanningTab('pointage')}
          className={`flex items-center gap-2 px-5 py-2.5 text-sm font-medium rounded-lg transition ${
            planningTab === 'pointage'
              ? 'bg-[#111111] dark:bg-white text-white dark:text-black'
              : 'text-[#6B7280] dark:text-[#A3A3A3] hover:bg-[#FAFAFA] dark:hover:bg-[#0A0A0A]'
          }`}
        >
          <Timer className="w-4 h-4" /> Pointage
        </button>
      </div>

      {/* ══════════ PLANNING TAB ══════════ */}
      {planningTab === 'planning' && (<>

      {/* ── Staff Summary Bar ── */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2 sm:gap-3">
        <StatCard
          icon={<Users className="w-5 h-5 text-indigo-400" />}
          label="Personnes aujourd'hui"
          value={String(todayStaffCount)}
          subtitle={`sur ${employees.length} employes`}
        />
        <StatCard
          icon={<Clock className="w-5 h-5 text-amber-400" />}
          label="Heures aujourd'hui"
          value={`${todayTotalHours.toFixed(0)}h`}
        />
        <StatCard
          icon={<Euro className="w-5 h-5 text-emerald-400" />}
          label="Cout estime jour"
          value={`${todayEstCost.toFixed(0)} EUR`}
        />
        <StatCard
          icon={<Clock className="w-5 h-5 text-blue-400" />}
          label={t('planning.hoursPerWeek')}
          value={`${totalHoursWeek.toFixed(0)}h`}
        />
        <StatCard
          icon={<Euro className="w-5 h-5 text-teal-400" />}
          label={t('planning.laborCost')}
          value={`${laborCost.toFixed(0)} EUR`}
          alert={laborRatio > 30}
        />
        <StatCard
          icon={<AlertTriangle className="w-5 h-5 text-rose-400" />}
          label={t('planning.hoursAlerts')}
          value={`${alertCount + conflicts.length}`}
          alert={alertCount > 0 || conflicts.length > 0}
          subtitle={
            conflicts.length > 0
              ? `${conflicts.length} conflit${conflicts.length > 1 ? 's' : ''}, ${alertCount} >35h`
              : alertCount > 0 ? `${alertCount} ${t('planning.employeesOver35h')}` : 'OK'
          }
        />
      </div>

      {/* Week navigation + view toggle */}
      <div className="flex flex-col sm:flex-row items-center justify-between bg-white dark:bg-black border border-[#E5E7EB] dark:border-[#1A1A1A] rounded-2xl p-4 gap-3 no-print">
        <div className="flex items-center gap-2">
          <button onClick={goPrev} className="p-2 rounded-lg hover:bg-[#FAFAFA] dark:hover:bg-[#0A0A0A] transition">
            <ChevronLeft className="w-5 h-5 text-[#6B7280] dark:text-[#A3A3A3]" />
          </button>
          <button onClick={goThisWeek} className="px-3 py-1 text-xs font-medium rounded-full bg-indigo-100 dark:bg-indigo-900/40 text-indigo-600 dark:text-indigo-300 hover:bg-indigo-200 dark:hover:bg-indigo-800/50 transition border border-indigo-200 dark:border-indigo-700/30">
            {t('planning.today')}
          </button>
          <h2 className="text-lg font-semibold text-[#111111] dark:text-white px-2">{weekLabel}</h2>
          <button onClick={goNext} className="p-2 rounded-lg hover:bg-[#FAFAFA] dark:hover:bg-[#0A0A0A] transition">
            <ChevronRight className="w-5 h-5 text-[#6B7280] dark:text-[#A3A3A3]" />
          </button>
        </div>
        <div className="flex rounded-lg bg-[#FAFAFA] dark:bg-[#0A0A0A] border border-[#E5E7EB] dark:border-[#1A1A1A] p-0.5">
          <button
            onClick={() => setView('semaine')}
            className={`px-4 py-1.5 text-sm font-medium rounded-md transition ${view === 'semaine' ? 'bg-indigo-600 text-white' : 'text-[#9CA3AF] dark:text-[#737373] hover:text-[#111111] dark:hover:text-white'}`}
          >
            {t('planning.week')}
          </button>
          <button
            onClick={() => setView('jour')}
            className={`px-4 py-1.5 text-sm font-medium rounded-md transition ${view === 'jour' ? 'bg-indigo-600 text-white' : 'text-[#9CA3AF] dark:text-[#737373] hover:text-[#111111] dark:hover:text-white'}`}
          >
            {t('planning.day')}
          </button>
        </div>
      </div>

      {/* Employee drag panel */}
      <div className="bg-white dark:bg-black border border-[#E5E7EB] dark:border-[#1A1A1A] rounded-2xl p-4 no-print">
        <h3 className="text-xs font-medium text-[#9CA3AF] dark:text-[#737373] uppercase tracking-wider mb-3">
          {t('planning.dragToAssign')}
        </h3>
        <div className="flex flex-wrap gap-2">
          {employees.map(emp => {
            const empConflicts = conflicts.filter(c => c.employeeId === emp.id);
            return (
              <div
                key={emp.id}
                draggable
                onDragStart={() => handleDragStart(emp)}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border bg-[#FAFAFA] dark:bg-[#0A0A0A] cursor-grab active:cursor-grabbing hover:border-[#D1D5DB] dark:hover:border-[#333] transition select-none ${
                  empConflicts.length > 0 ? 'border-red-500 ring-1 ring-red-500/30' : 'border-[#E5E7EB] dark:border-[#1A1A1A]'
                }`}
              >
                <GripVertical className="w-3.5 h-3.5 text-[#9CA3AF] dark:text-[#737373]" />
                <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: emp.color || '#6366f1' }} />
                <span className="text-sm text-[#6B7280] dark:text-[#A3A3A3] font-medium">{emp.name || ''}</span>
                <span className="text-xs text-[#9CA3AF] dark:text-[#737373]">{ROLE_LABELS[emp.role] || emp.role || ''}</span>
                {empConflicts.length > 0 && (
                  <span className="flex items-center gap-0.5 px-1.5 py-0.5 rounded-full bg-red-500/20 text-red-500 text-[10px] font-bold">
                    <AlertCircle className="w-3 h-3" /> {empConflicts.length}
                  </span>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* ── Week View Calendar: 7-column time grid ── */}
      {view === 'semaine' && (
        <div className="bg-white dark:bg-black border border-[#E5E7EB] dark:border-[#1A1A1A] rounded-2xl overflow-hidden">
          {/* Desktop: Full time-slot grid */}
          <div className="hidden lg:block overflow-x-auto">
            <div
              className="grid min-w-[900px]"
              style={{ gridTemplateColumns: '60px repeat(7, 1fr)' }}
              onMouseUp={handleGridMouseUp}
              onMouseLeave={() => dragCreateState?.active && handleGridMouseUp()}
            >
              {/* Header row */}
              <div className="bg-[#FAFAFA] dark:bg-[#0A0A0A] border-b border-r border-[#E5E7EB] dark:border-[#1A1A1A] p-2 text-center">
                <span className="text-[10px] text-[#9CA3AF] dark:text-[#737373] uppercase font-medium">Heure</span>
              </div>
              {weekDays.map((day, i) => {
                const dayStr = formatDate(day);
                const isToday = todayStr === dayStr;
                const dayConflicts = conflicts.filter(c => c.shiftA.date === dayStr);
                const dayCost = dailyCosts[i] || 0;
                return (
                  <div
                    key={i}
                    className={`border-b border-r border-[#E5E7EB] dark:border-[#1A1A1A] last:border-r-0 px-2 py-2 text-center ${
                      isToday ? 'bg-indigo-50 dark:bg-indigo-950/20' : 'bg-[#FAFAFA] dark:bg-[#0A0A0A]'
                    }`}
                  >
                    <div className="text-[10px] font-medium text-[#9CA3AF] dark:text-[#737373] uppercase">{JOURS_FULL[i]}</div>
                    <div className={`text-sm font-bold ${isToday ? 'text-indigo-500' : 'text-[#6B7280] dark:text-[#A3A3A3]'}`}>
                      {day.getDate()}/{(day.getMonth() + 1).toString().padStart(2, '0')}
                    </div>
                    {/* Labor cost badge per day */}
                    {dayCost > 0 && (
                      <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 text-[9px] font-bold mt-0.5">
                        <Euro className="w-2.5 h-2.5" /> {dayCost.toFixed(0)} EUR
                      </span>
                    )}
                    {dayConflicts.length > 0 && (
                      <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-full bg-red-500/20 text-red-500 text-[9px] font-bold mt-0.5">
                        <AlertCircle className="w-2.5 h-2.5" /> {dayConflicts.length}
                      </span>
                    )}
                  </div>
                );
              })}

              {/* Time rows: 6h -> 23h */}
              {GRID_HOURS.map(hour => (
                <>
                  {/* Hour label */}
                  <div
                    key={`label-${hour}`}
                    className="border-b border-r border-[#E5E7EB] dark:border-[#1A1A1A] p-1 text-center flex items-center justify-center"
                  >
                    <span className="text-[10px] font-mono text-[#9CA3AF] dark:text-[#737373]">
                      {hour.toString().padStart(2, '0')}:00
                    </span>
                  </div>
                  {/* 7 day cells for this hour */}
                  {weekDays.map((day, dayIdx) => {
                    const dayStr = formatDate(day);
                    const isToday = todayStr === dayStr;

                    // Check if any employee is unavailable at this hour on this day
                    const dayOfWeek = dayIdx; // 0=Lun matches our dayOfWeek convention
                    const hasUnavailable = availabilities.some(a =>
                      !a.available && a.dayOfWeek === dayOfWeek &&
                      timeToMinutes(a.startTime) <= hour * 60 && timeToMinutes(a.endTime) > hour * 60
                    );

                    // Find shifts that span this hour
                    const hourShifts = shifts.filter(s => {
                      if (s.date !== dayStr) return false;
                      const sStart = timeToMinutes(s.startTime);
                      const sEnd = timeToMinutes(s.endTime);
                      const cellStart = hour * 60;
                      const cellEnd = (hour + 1) * 60;
                      return sStart < cellEnd && sEnd > cellStart;
                    });

                    // Drag-to-create highlight
                    const isDragHighlight = dragCreateState?.active
                      && dragCreateState.dayIdx === dayIdx
                      && hour >= Math.min(dragCreateState.startHour, dragCreateState.currentHour)
                      && hour < Math.max(dragCreateState.startHour, dragCreateState.currentHour);

                    // Only render shift block at its start hour
                    const startsHere = hourShifts.filter(s => {
                      const sh = parseInt(s.startTime.split(':')[0]);
                      return sh === hour;
                    });

                    return (
                      <div
                        key={`cell-${hour}-${dayIdx}`}
                        className={`border-b border-r border-[#E5E7EB] dark:border-[#1A1A1A] last:border-r-0 relative min-h-[32px] transition-colors cursor-crosshair ${
                          isToday ? 'bg-indigo-50/50 dark:bg-indigo-950/10' : ''
                        } ${isDragHighlight ? 'bg-indigo-100 dark:bg-indigo-900/30' : ''} ${
                          hasUnavailable && !isDragHighlight ? 'bg-[#F0F0F0] dark:bg-[#1A1A1A]' : ''
                        } ${
                          dragEmployee ? 'hover:bg-[#FAFAFA] dark:hover:bg-[#0A0A0A]' : ''
                        }`}
                        onDragOver={handleDragOver}
                        onDrop={() => {
                          const shiftType = hour < 11 ? 'matin' as ShiftType : hour < 17 ? 'midi' as ShiftType : 'soir' as ShiftType;
                          handleDrop(dayStr, shiftType);
                        }}
                        onMouseDown={() => handleGridMouseDown(dayIdx, hour)}
                        onMouseMove={() => handleGridMouseMove(dayIdx, hour)}
                      >
                        {startsHere.map(s => {
                          const emp = employees.find(e => e.id === s.employeeId);
                          if (!emp) return null;
                          const sStart = timeToMinutes(s.startTime);
                          const sEnd = timeToMinutes(s.endTime);
                          const spanHours = Math.ceil((sEnd - sStart) / 60);
                          const posteColor = POSTE_COLORS[s.type] || POSTE_COLORS.cuisine;
                          const shiftConflict = conflicts.some(
                            c => (c.shiftA.id === s.id || c.shiftB.id === s.id)
                          );

                          return (
                            <div
                              key={s.id}
                              className={`absolute left-0.5 right-0.5 z-10 rounded-md p-1 text-[10px] cursor-pointer hover:brightness-110 transition group border ${
                                shiftConflict ? 'ring-2 ring-red-500 border-red-500' : posteColor.border
                              }`}
                              style={{
                                top: `${((sStart % 60) / 60) * 100}%`,
                                height: `${spanHours * 32 - 2}px`,
                                backgroundColor: (emp.color || '#6366f1') + '18',
                                borderColor: shiftConflict ? undefined : (emp.color || '#6366f1') + '40',
                              }}
                              onClick={(e) => { e.stopPropagation(); openEditShift(s); }}
                            >
                              <div className="flex items-center gap-1 truncate">
                                {shiftConflict && <AlertCircle className="w-2.5 h-2.5 text-red-500 flex-shrink-0" />}
                                <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: emp.color || '#6366f1' }} />
                                <span className="font-semibold text-[#111111] dark:text-white truncate">{emp.name}</span>
                              </div>
                              {spanHours >= 2 && (
                                <div className="flex items-center gap-1 mt-0.5 text-[#9CA3AF] dark:text-[#737373]">
                                  {getPosteIcon(s.type)}
                                  <span>{s.startTime}-{s.endTime}</span>
                                </div>
                              )}
                              <button
                                onClick={e => { e.stopPropagation(); deleteShift(s.id); }}
                                className="absolute top-0.5 right-0.5 opacity-0 group-hover:opacity-100 p-0.5 rounded bg-white dark:bg-black hover:bg-red-100 dark:hover:bg-red-900/60 transition"
                              >
                                <X className="w-2.5 h-2.5 text-red-400" />
                              </button>
                            </div>
                          );
                        })}
                      </div>
                    );
                  })}
                </>
              ))}
            </div>
          </div>

          {/* Mobile: single day view */}
          <div className="lg:hidden">
            <div className="flex items-center justify-between px-4 py-3 border-b border-[#E5E7EB] dark:border-[#1A1A1A] bg-[#FAFAFA] dark:bg-[#0A0A0A]">
              <button
                onClick={() => setSelectedDayIdx(prev => (prev - 1 + 7) % 7)}
                className="p-2 rounded-lg hover:bg-[#F3F4F6] dark:hover:bg-[#171717] transition"
              >
                <ChevronLeft className="w-5 h-5 text-[#6B7280] dark:text-[#A3A3A3]" />
              </button>
              <div className="text-center">
                <div className="text-xs font-medium text-[#9CA3AF] dark:text-[#737373] uppercase">{JOURS_FULL[selectedDayIdx]}</div>
                <div className="text-sm font-semibold text-[#111111] dark:text-white">
                  {weekDays[selectedDayIdx].getDate()}/{(weekDays[selectedDayIdx].getMonth() + 1).toString().padStart(2, '0')}
                </div>
              </div>
              <button
                onClick={() => setSelectedDayIdx(prev => (prev + 1) % 7)}
                className="p-2 rounded-lg hover:bg-[#F3F4F6] dark:hover:bg-[#171717] transition"
              >
                <ChevronRight className="w-5 h-5 text-[#6B7280] dark:text-[#A3A3A3]" />
              </button>
            </div>
            <MobileDayContent
              day={weekDays[selectedDayIdx]}
              shifts={shifts}
              employees={employees}
              conflicts={conflicts}
              onEditShift={openEditShift}
              onDeleteShift={deleteShift}
              onAddShift={(dayStr, shiftType) => openAddShift(dayStr, shiftType)}
              dragEmployee={dragEmployee}
              onDragOver={handleDragOver}
              onDrop={handleDrop}
            />
          </div>
        </div>
      )}

      {/* ── Day Detail View (jour) ── */}
      {view === 'jour' && (
        <div className="bg-white dark:bg-black border border-[#E5E7EB] dark:border-[#1A1A1A] rounded-2xl overflow-hidden">
          <div className="flex items-center justify-between px-5 py-3 border-b border-[#E5E7EB] dark:border-[#1A1A1A] bg-[#FAFAFA] dark:bg-[#0A0A0A] no-print">
            <button
              onClick={() => setSelectedDayIdx(prev => (prev - 1 + 7) % 7)}
              className="p-2 rounded-lg hover:bg-[#F3F4F6] dark:hover:bg-[#171717] transition"
            >
              <ChevronLeft className="w-5 h-5 text-[#6B7280] dark:text-[#A3A3A3]" />
            </button>
            <div className="text-center">
              <div className="text-xs font-medium text-[#9CA3AF] dark:text-[#737373] uppercase">{JOURS_FULL[selectedDayIdx]}</div>
              <div className="text-lg font-bold text-[#111111] dark:text-white">
                {weekDays[selectedDayIdx].toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}
              </div>
            </div>
            <button
              onClick={() => setSelectedDayIdx(prev => (prev + 1) % 7)}
              className="p-2 rounded-lg hover:bg-[#F3F4F6] dark:hover:bg-[#171717] transition"
            >
              <ChevronRight className="w-5 h-5 text-[#6B7280] dark:text-[#A3A3A3]" />
            </button>
          </div>
          <DayTimelineView
            day={weekDays[selectedDayIdx]}
            shifts={shifts}
            employees={employees}
            conflicts={conflicts}
            onEditShift={openEditShift}
            onDeleteShift={deleteShift}
            onAddShift={(dayStr, shiftType) => openAddShift(dayStr, shiftType)}
          />
        </div>
      )}

      {/* Employee list */}
      <div className="bg-white dark:bg-black border border-[#E5E7EB] dark:border-[#1A1A1A] rounded-2xl overflow-hidden">
        <div className="px-5 py-4 border-b border-[#E5E7EB] dark:border-[#1A1A1A] flex items-center justify-between">
          <h3 className="font-semibold text-[#111111] dark:text-white flex items-center gap-2">
            <Users className="w-4 h-4 text-indigo-400" /> {t('planning.team')} ({employees.length})
          </h3>
          <button onClick={openAddEmployee} className="text-xs font-medium text-indigo-400 hover:underline flex items-center gap-1 no-print">
            <UserPlus className="w-3.5 h-3.5" /> {t('common.add')}
          </button>
        </div>
        <div className="overflow-x-auto -mx-4 sm:mx-0">
          <table className="w-full text-sm min-w-[700px]">
            <thead>
              <tr className="bg-[#FAFAFA] dark:bg-[#0A0A0A]">
                <th className="px-4 py-2.5 text-left text-xs font-medium text-[#9CA3AF] dark:text-[#737373] uppercase">{t('planning.employee')}</th>
                <th className="px-4 py-2.5 text-left text-xs font-medium text-[#9CA3AF] dark:text-[#737373] uppercase">{t('planning.role')}</th>
                <th className="px-4 py-2.5 text-right text-xs font-medium text-[#9CA3AF] dark:text-[#737373] uppercase">{t('planning.rate')}</th>
                <th className="px-4 py-2.5 text-right text-xs font-medium text-[#9CA3AF] dark:text-[#737373] uppercase">{t('planning.hoursPerWeek')}</th>
                <th className="px-4 py-2.5 text-center text-xs font-medium text-[#9CA3AF] dark:text-[#737373] uppercase">{t('planning.status')}</th>
                <th className="px-4 py-2.5 text-center text-xs font-medium text-[#9CA3AF] dark:text-[#737373] uppercase no-print">{t('planning.actions')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E5E7EB] dark:divide-[#1A1A1A]">
              {employees.map(emp => {
                const hours = employeeWeeklyHours.get(emp.id) || 0;
                const isOver35 = hours > 35;
                const isOver48 = hours > 48;
                const empConflicts = conflicts.filter(c => c.employeeId === emp.id);
                return (
                  <tr key={emp.id} className="hover:bg-[#FAFAFA] dark:hover:bg-[#0A0A0A] transition">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: emp.color || '#6366f1' }} />
                        <span className="font-medium text-[#111111] dark:text-white">{emp.name || ''}</span>
                        {empConflicts.length > 0 && (
                          <span className="flex items-center gap-0.5 px-1.5 py-0.5 rounded-full bg-red-500/20 text-red-500 text-[10px] font-bold">
                            <AlertCircle className="w-3 h-3" /> Conflit
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className="px-2 py-0.5 rounded-full text-xs font-medium" style={{ backgroundColor: (emp.color || '#6366f1') + '20', color: emp.color || '#6366f1' }}>
                        {ROLE_LABELS[emp.role] || emp.role || ''}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right text-[#6B7280] dark:text-[#A3A3A3]">{(emp.hourlyRate ?? 0).toFixed(2)} EUR/h</td>
                    <td className="px-4 py-3 text-right">
                      <span className={`font-semibold ${isOver48 ? 'text-red-400' : isOver35 ? 'text-amber-400' : 'text-emerald-400'}`}>
                        {hours.toFixed(0)}h
                      </span>
                    </td>
                    <td className="px-4 py-3 text-center">
                      {empConflicts.length > 0 ? (
                        <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-red-500/20 text-red-400 border border-red-500/30">
                          CONFLIT
                        </span>
                      ) : isOver48 ? (
                        <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-red-500/20 text-red-400 border border-red-500/30">
                          ILLEGAL &gt;48h
                        </span>
                      ) : isOver35 ? (
                        <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-amber-500/20 text-amber-400 border border-amber-500/30">
                          {t('planning.overtime')}
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                          OK
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-center no-print">
                      <div className="flex items-center justify-center gap-1">
                        <button onClick={() => openAvailabilityManager(emp)} className="p-1.5 rounded hover:bg-[#F3F4F6] dark:hover:bg-[#171717] transition" title="Disponibilites">
                          <Clock className="w-3.5 h-3.5 text-[#9CA3AF] dark:text-[#737373]" />
                        </button>
                        <button onClick={() => openEditEmployee(emp)} className="p-1.5 rounded hover:bg-[#F3F4F6] dark:hover:bg-[#171717] transition">
                          <Edit className="w-3.5 h-3.5 text-[#9CA3AF] dark:text-[#737373]" />
                        </button>
                        <button onClick={() => deleteEmployee(emp.id)} className="p-1.5 rounded hover:bg-red-100 dark:hover:bg-red-900/20 transition">
                          <Trash2 className="w-3.5 h-3.5 text-red-500" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Weekly summary table (print-friendly) */}
      <div className="bg-white dark:bg-black border border-[#E5E7EB] dark:border-[#1A1A1A] rounded-2xl overflow-hidden">
        <div className="px-5 py-4 border-b border-[#E5E7EB] dark:border-[#1A1A1A]">
          <h3 className="font-semibold text-[#111111] dark:text-white flex items-center gap-2">
            <Clock className="w-4 h-4 text-amber-400" /> {t('planning.weeklySummary')}
          </h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-[#FAFAFA] dark:bg-[#0A0A0A]">
                <th className="px-4 py-2.5 text-left text-xs font-medium text-[#9CA3AF] dark:text-[#737373] uppercase">{t('planning.employee')}</th>
                {JOURS.map(j => (
                  <th key={j} className="px-3 py-2.5 text-center text-xs font-medium text-[#9CA3AF] dark:text-[#737373] uppercase">{j}</th>
                ))}
                <th className="px-3 py-2.5 text-center text-xs font-medium text-[#9CA3AF] dark:text-[#737373] uppercase">Total</th>
                <th className="px-4 py-2.5 text-right text-xs font-medium text-[#9CA3AF] dark:text-[#737373] uppercase">{t('planning.cost')}</th>
                <th className="px-3 py-2.5 text-center text-xs font-medium text-[#9CA3AF] dark:text-[#737373] uppercase">{t('planning.alert')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E5E7EB] dark:divide-[#1A1A1A]">
              {summaryRows.map(row => {
                const isOver35 = row.total > 35;
                const isOver48 = row.total > 48;
                const empConflicts = conflicts.filter(c => c.employeeId === row.emp.id);
                return (
                  <tr key={row.emp.id} className="hover:bg-[#FAFAFA] dark:hover:bg-[#0A0A0A] transition">
                    <td className="px-4 py-2.5 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: row.emp.color || '#6366f1' }} />
                        <span className="font-medium text-[#111111] dark:text-white">{row.emp.name || ''}</span>
                      </div>
                    </td>
                    {row.days.map((h, i) => (
                      <td key={i} className={`px-3 py-2.5 text-center text-xs ${h > 0 ? 'text-[#6B7280] dark:text-[#A3A3A3] font-medium' : 'text-[#6B7280] dark:text-[#A3A3A3]'}`}>
                        {h > 0 ? `${h}h` : '-'}
                      </td>
                    ))}
                    <td className={`px-3 py-2.5 text-center font-bold ${isOver48 ? 'text-red-400' : isOver35 ? 'text-amber-400' : 'text-[#111111] dark:text-white'}`}>
                      {row.total > 0 ? `${row.total}h` : '-'}
                    </td>
                    <td className="px-4 py-2.5 text-right font-medium text-[#6B7280] dark:text-[#A3A3A3]">
                      {row.cost > 0 ? `${row.cost.toFixed(0)} EUR` : '-'}
                    </td>
                    <td className="px-3 py-2.5 text-center">
                      {empConflicts.length > 0 ? (
                        <AlertCircle className="w-4 h-4 text-red-500 mx-auto" />
                      ) : isOver48 ? (
                        <AlertTriangle className="w-4 h-4 text-red-400 mx-auto" />
                      ) : isOver35 ? (
                        <AlertTriangle className="w-4 h-4 text-amber-400 mx-auto" />
                      ) : null}
                    </td>
                  </tr>
                );
              })}
              {/* Totals */}
              <tr className="bg-[#FAFAFA] dark:bg-[#0A0A0A] font-semibold">
                <td className="px-4 py-2.5 text-[#111111] dark:text-white">Total</td>
                {totalRow.days.map((h, i) => (
                  <td key={i} className="px-3 py-2.5 text-center text-xs text-[#6B7280] dark:text-[#A3A3A3]">
                    {h > 0 ? `${h}h` : '-'}
                  </td>
                ))}
                <td className="px-3 py-2.5 text-center text-indigo-400">{totalRow.total}h</td>
                <td className="px-4 py-2.5 text-right text-indigo-400">{(totalRow.cost ?? 0).toFixed(0)} EUR</td>
                <td />
              </tr>
              {/* Daily cost row */}
              <tr className="bg-[#FAFAFA] dark:bg-[#0A0A0A]">
                <td className="px-4 py-2.5 text-[#9CA3AF] dark:text-[#737373] text-xs">{t('planning.costPerDay')}</td>
                {dailyCosts.map((c, i) => (
                  <td key={i} className="px-3 py-2.5 text-center text-xs text-[#9CA3AF] dark:text-[#737373]">
                    {c > 0 ? `${c.toFixed(0)}` : '-'}
                  </td>
                ))}
                <td />
                <td />
                <td />
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      </>)}

      {/* ══════════ POINTAGE TAB ══════════ */}
      {planningTab === 'pointage' && (
        <PointageTab
          employees={employees}
          todayEntries={todayEntries}
          timeclockSummary={timeclockSummary}
          timeclockLoading={timeclockLoading}
          weekStart={weekStart}
          weekDays={weekDays}
          onPunchIn={handlePunchIn}
          onPunchOut={handlePunchOut}
          getEmployeePunchStatus={getEmployeePunchStatus}
          formatDuration={formatDuration}
          getElapsedMinutes={getElapsedMinutes}
          formatTimeFromISO={formatTimeFromISO}
          clockTick={clockTick}
          goPrev={goPrev}
          goNext={goNext}
          goThisWeek={goThisWeek}
          weekLabel={weekLabel}
        />
      )}

      {/* ── Employee Modal ─────────────────────────────────────────────── */}
      <Modal
        isOpen={showEmployeeModal}
        onClose={() => setShowEmployeeModal(false)}
        title={editEmployee ? t('planning.editEmployee') : t('planning.addEmployee')}
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-[#6B7280] dark:text-[#A3A3A3] mb-1">{t('planning.fullName')}</label>
            <input
              type="text"
              value={empForm.name}
              onChange={e => setEmpForm(f => ({ ...f, name: e.target.value }))}
              className="w-full px-3 py-2 rounded-lg bg-[#FAFAFA] dark:bg-[#0A0A0A] border border-[#E5E7EB] dark:border-[#1A1A1A] text-[#111111] dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm"
              placeholder="Ex: Marie Dupont"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-[#6B7280] dark:text-[#A3A3A3] mb-1">{t('planning.role')}</label>
            <select
              value={empForm.role}
              onChange={e => setEmpForm(f => ({ ...f, role: e.target.value }))}
              className="w-full px-3 py-2 rounded-lg bg-[#FAFAFA] dark:bg-[#0A0A0A] border border-[#E5E7EB] dark:border-[#1A1A1A] text-[#111111] dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm"
            >
              {ROLES.map(r => (
                <option key={r} value={r}>{ROLE_LABELS[r]}</option>
              ))}
            </select>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-[#6B7280] dark:text-[#A3A3A3] mb-1">{t('planning.hourlyRate')}</label>
              <input
                type="number"
                step="0.01"
                min="0"
                value={empForm.hourlyRate}
                onChange={e => setEmpForm(f => ({ ...f, hourlyRate: e.target.value }))}
                className="w-full px-3 py-2 rounded-lg bg-[#FAFAFA] dark:bg-[#0A0A0A] border border-[#E5E7EB] dark:border-[#1A1A1A] text-[#111111] dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm"
                placeholder="Ex: 14.00"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-[#6B7280] dark:text-[#A3A3A3] mb-1">{t('planning.color')}</label>
            <div className="flex gap-2 flex-wrap">
              {EMPLOYEE_COLORS.map(c => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setEmpForm(f => ({ ...f, color: c }))}
                  className={`w-8 h-8 rounded-full border-2 transition ${empForm.color === c ? 'border-[#111111] dark:border-white scale-110' : 'border-transparent opacity-60 hover:opacity-100'}`}
                  style={{ backgroundColor: c }}
                />
              ))}
            </div>
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <button onClick={() => setShowEmployeeModal(false)} className="px-4 py-2 text-sm font-medium text-[#6B7280] dark:text-[#A3A3A3] hover:bg-[#F3F4F6] dark:hover:bg-[#171717] rounded-lg transition">
              {t('common.cancel')}
            </button>
            <button onClick={saveEmployee} className="px-4 py-2 text-sm font-medium bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition">
              {editEmployee ? t('common.edit') : t('common.add')}
            </button>
          </div>
        </div>
      </Modal>

      {/* ── Shift Modal ────────────────────────────────────────────────── */}
      <Modal
        isOpen={showShiftModal}
        onClose={() => setShowShiftModal(false)}
        title={editShift ? t('planning.editShift') : t('planning.addShift')}
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-[#6B7280] dark:text-[#A3A3A3] mb-1">{t('planning.employee')}</label>
            <select
              value={shiftForm.employeeId}
              onChange={e => setShiftForm(f => ({ ...f, employeeId: e.target.value }))}
              className="w-full px-3 py-2 rounded-lg bg-[#FAFAFA] dark:bg-[#0A0A0A] border border-[#E5E7EB] dark:border-[#1A1A1A] text-[#111111] dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm"
            >
              <option value="">-- {t('common.select')} --</option>
              {employees.map(emp => (
                <option key={emp.id} value={emp.id}>{emp.name || ''} ({ROLE_LABELS[emp.role] || emp.role || ''})</option>
              ))}
            </select>
          </div>
          {/* Quick shift type buttons */}
          <div>
            <label className="block text-sm font-medium text-[#6B7280] dark:text-[#A3A3A3] mb-1">{t('planning.serviceType')}</label>
            <div className="flex gap-2">
              {SHIFT_TYPES.map(st => (
                <button
                  key={st.key}
                  type="button"
                  onClick={() => setShiftForm(f => ({ ...f, startTime: st.start, endTime: st.end }))}
                  className={`flex-1 py-2 rounded-lg text-xs font-medium border transition ${
                    shiftForm.startTime === st.start && shiftForm.endTime === st.end
                      ? st.bg + ' text-white'
                      : 'bg-[#FAFAFA] dark:bg-[#0A0A0A] border-[#E5E7EB] dark:border-[#1A1A1A] text-[#9CA3AF] dark:text-[#737373] hover:border-[#D1D5DB] dark:hover:border-[#333]'
                  }`}
                >
                  {st.label}<br />{st.start}-{st.end}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-[#6B7280] dark:text-[#A3A3A3] mb-1">{t('planning.date')}</label>
            <input
              type="date"
              value={shiftForm.date}
              onChange={e => setShiftForm(f => ({ ...f, date: e.target.value }))}
              className="w-full px-3 py-2 rounded-lg bg-[#FAFAFA] dark:bg-[#0A0A0A] border border-[#E5E7EB] dark:border-[#1A1A1A] text-[#111111] dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm"
            />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-[#6B7280] dark:text-[#A3A3A3] mb-1">{t('planning.startTime')}</label>
              <input
                type="time"
                value={shiftForm.startTime}
                onChange={e => setShiftForm(f => ({ ...f, startTime: e.target.value }))}
                className="w-full px-3 py-2 rounded-lg bg-[#FAFAFA] dark:bg-[#0A0A0A] border border-[#E5E7EB] dark:border-[#1A1A1A] text-[#111111] dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#6B7280] dark:text-[#A3A3A3] mb-1">{t('planning.endTime')}</label>
              <input
                type="time"
                value={shiftForm.endTime}
                onChange={e => setShiftForm(f => ({ ...f, endTime: e.target.value }))}
                className="w-full px-3 py-2 rounded-lg bg-[#FAFAFA] dark:bg-[#0A0A0A] border border-[#E5E7EB] dark:border-[#1A1A1A] text-[#111111] dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-[#6B7280] dark:text-[#A3A3A3] mb-1">{t('planning.position')}</label>
            <div className="grid grid-cols-4 gap-2">
              {POSTES.map(p => {
                const colors = POSTE_COLORS[p.value];
                const isSelected = shiftForm.type === p.value;
                return (
                  <button
                    key={p.value}
                    type="button"
                    onClick={() => setShiftForm(f => ({ ...f, type: p.value }))}
                    className={`flex flex-col items-center gap-1 py-2.5 rounded-xl border text-xs font-medium transition ${
                      isSelected
                        ? `${colors.bg} ${colors.text} ${colors.border}`
                        : 'bg-[#FAFAFA] dark:bg-[#0A0A0A] border-[#E5E7EB] dark:border-[#1A1A1A] text-[#9CA3AF] dark:text-[#737373] hover:border-[#D1D5DB] dark:hover:border-[#333]'
                    }`}
                  >
                    {getPosteIcon(p.value)}
                    {p.label}
                  </button>
                );
              })}
            </div>
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <button onClick={() => setShowShiftModal(false)} className="px-4 py-2 text-sm font-medium text-[#6B7280] dark:text-[#A3A3A3] hover:bg-[#F3F4F6] dark:hover:bg-[#171717] rounded-lg transition">
              {t('common.cancel')}
            </button>
            {editShift && (
              <button
                onClick={() => { deleteShift(editShift.id); setShowShiftModal(false); }}
                className="px-4 py-2 text-sm font-medium bg-red-600 text-white rounded-xl hover:bg-red-700 transition"
              >
                {t('common.delete')}
              </button>
            )}
            <button onClick={saveShift} className="px-4 py-2 text-sm font-medium bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition">
              {editShift ? t('common.edit') : t('common.add')}
            </button>
          </div>
        </div>
      </Modal>

      {/* ── Conflicts Modal ────────────────────────────────────────────── */}
      <Modal
        isOpen={showConflictsModal}
        onClose={() => setShowConflictsModal(false)}
        title="Conflits de planning detectes"
      >
        <div className="space-y-3">
          <p className="text-sm text-[#6B7280] dark:text-[#A3A3A3]">
            Les employes suivants ont des creneaux qui se chevauchent :
          </p>
          {conflicts.map((c, idx) => (
            <div key={idx} className="p-3 rounded-xl bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800/30">
              <div className="flex items-center gap-2 mb-1">
                <AlertCircle className="w-4 h-4 text-red-500" />
                <span className="font-semibold text-[#111111] dark:text-white text-sm">{c.employeeName}</span>
                <span className="text-xs text-[#9CA3AF] dark:text-[#737373]">{c.shiftA.date}</span>
              </div>
              <div className="text-xs text-red-600 dark:text-red-400 space-y-0.5 pl-6">
                <div>Creneau 1 : {c.shiftA.startTime} - {c.shiftA.endTime} ({c.shiftA.type})</div>
                <div>Creneau 2 : {c.shiftB.startTime} - {c.shiftB.endTime} ({c.shiftB.type})</div>
              </div>
            </div>
          ))}
          {conflicts.length === 0 && (
            <p className="text-center text-[#9CA3AF] dark:text-[#737373] py-4">Aucun conflit detecte.</p>
          )}
          <div className="flex justify-end pt-2">
            <button onClick={() => setShowConflictsModal(false)} className="px-4 py-2 text-sm font-medium bg-[#111111] dark:bg-white text-white dark:text-black rounded-xl hover:opacity-90 transition">
              Fermer
            </button>
          </div>
        </div>
      </Modal>

      {/* ── Overtime Alerts Modal (French Labor Law) ──────────────────── */}
      <Modal
        isOpen={showOvertimeModal}
        onClose={() => setShowOvertimeModal(false)}
        title="Alertes heures supplementaires - Droit du travail"
      >
        <div className="space-y-4">
          <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800/30">
            <div className="flex items-center gap-2 mb-1">
              <Shield className="w-4 h-4 text-amber-500" />
              <span className="font-semibold text-[#111111] dark:text-white text-sm">Code du travail francais</span>
            </div>
            <div className="text-xs text-[#6B7280] dark:text-[#A3A3A3] space-y-0.5 pl-6">
              <div>Duree legale : {LEGAL_WEEKLY_HOURS}h/semaine</div>
              <div>Maximum absolu : {LEGAL_MAX_WEEKLY_HOURS}h/semaine</div>
              <div>Maximum journalier : {LEGAL_MAX_DAILY_HOURS}h/jour</div>
              <div>Heures sup 36h-43h : +25% | 44h+ : +50%</div>
            </div>
          </div>

          {overtimeDetails.map(detail => (
            <div key={detail.emp.id} className={`p-4 rounded-xl border ${
              detail.isOver48 ? 'bg-red-50 dark:bg-red-950/20 border-red-300 dark:border-red-800/30'
              : 'bg-amber-50 dark:bg-amber-950/20 border-amber-200 dark:border-amber-800/30'
            }`}>
              <div className="flex items-center gap-2 mb-2">
                <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: detail.emp.color || '#6366f1' }} />
                <span className="font-semibold text-[#111111] dark:text-white">{detail.emp.name}</span>
                <span className={`text-xs px-2 py-0.5 rounded-full font-bold ${
                  detail.isOver48 ? 'bg-red-500/20 text-red-500' : 'bg-amber-500/20 text-amber-500'
                }`}>
                  {detail.hours.toFixed(1)}h / {LEGAL_WEEKLY_HOURS}h
                </span>
              </div>
              <div className="text-xs space-y-1 pl-5 text-[#6B7280] dark:text-[#A3A3A3]">
                {detail.isOver48 && (
                  <div className="text-red-500 font-bold flex items-center gap-1">
                    <Ban className="w-3 h-3" /> ILLEGAL : depasse {LEGAL_MAX_WEEKLY_HOURS}h hebdomadaires
                  </div>
                )}
                {detail.overtime > 0 && (
                  <>
                    <div>Heures supplementaires : {detail.overtime.toFixed(1)}h</div>
                    {detail.overtimeAt25 > 0 && <div>- {detail.overtimeAt25.toFixed(1)}h a 125% = {(detail.overtimeAt25 * (detail.emp.hourlyRate ?? 0) * OVERTIME_RATE_1).toFixed(0)} EUR</div>}
                    {detail.overtimeAt50 > 0 && <div>- {detail.overtimeAt50.toFixed(1)}h a 150% = {(detail.overtimeAt50 * (detail.emp.hourlyRate ?? 0) * OVERTIME_RATE_2).toFixed(0)} EUR</div>}
                    <div className="font-semibold text-[#111111] dark:text-white">Surcout heures sup : {detail.overtimeCost.toFixed(0)} EUR</div>
                  </>
                )}
                {detail.dailyAlerts.length > 0 && (
                  <div className="mt-1">
                    <div className="text-red-500 font-bold">Depassement journalier :</div>
                    {detail.dailyAlerts.map((alert, i) => (
                      <div key={i} className="text-red-400">{alert}</div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}

          {overtimeDetails.length === 0 && (
            <div className="text-center py-6">
              <Check className="w-8 h-8 text-emerald-500 mx-auto mb-2" />
              <p className="text-[#6B7280] dark:text-[#A3A3A3]">Aucun depassement horaire cette semaine.</p>
            </div>
          )}

          <div className="flex justify-end pt-2">
            <button onClick={() => setShowOvertimeModal(false)} className="px-4 py-2 text-sm font-medium bg-[#111111] dark:bg-white text-white dark:text-black rounded-xl hover:opacity-90 transition">
              Fermer
            </button>
          </div>
        </div>
      </Modal>

      {/* ── Shift Templates Modal ─────────────────────────────────────── */}
      <Modal
        isOpen={showTemplateModal}
        onClose={() => setShowTemplateModal(false)}
        title="Templates de planning"
      >
        <div className="space-y-4">
          <p className="text-sm text-[#6B7280] dark:text-[#A3A3A3]">
            Appliquez un template pour remplir rapidement une journee.
          </p>
          {shiftTemplates.map(tmpl => (
            <div key={tmpl.id} className="p-4 rounded-xl bg-[#FAFAFA] dark:bg-[#0A0A0A] border border-[#E5E7EB] dark:border-[#1A1A1A] hover:border-[#D1D5DB] dark:hover:border-[#333] transition">
              <div className="flex items-center justify-between mb-2">
                <div>
                  <div className="font-semibold text-[#111111] dark:text-white text-sm flex items-center gap-2">
                    <Zap className="w-4 h-4 text-amber-400" />
                    {tmpl.name}
                  </div>
                  <div className="text-xs text-[#9CA3AF] dark:text-[#737373] mt-0.5">{tmpl.description}</div>
                </div>
                <button
                  onClick={() => {
                    setSelectedTemplate(tmpl);
                    setTemplateApplyDate('');
                    setShowTemplateApplyModal(true);
                  }}
                  className="px-3 py-1.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition text-xs font-medium flex items-center gap-1"
                >
                  <Play className="w-3 h-3" /> Appliquer
                </button>
              </div>
              <div className="flex flex-wrap gap-1.5 mt-2">
                {tmpl.assignments.map((a, i) => {
                  const pc = POSTE_COLORS[a.type] || POSTE_COLORS.cuisine;
                  return (
                    <span key={i} className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${pc.bg} ${pc.text} border ${pc.border}`}>
                      {a.count}x {ROLE_LABELS[a.role] || a.role} ({a.startTime}-{a.endTime})
                    </span>
                  );
                })}
              </div>
            </div>
          ))}
          <div className="flex justify-end pt-2">
            <button onClick={() => setShowTemplateModal(false)} className="px-4 py-2 text-sm font-medium bg-[#111111] dark:bg-white text-white dark:text-black rounded-xl hover:opacity-90 transition">
              Fermer
            </button>
          </div>
        </div>
      </Modal>

      {/* ── Template Apply Modal (date picker) ────────────────────────── */}
      <Modal
        isOpen={showTemplateApplyModal}
        onClose={() => { setShowTemplateApplyModal(false); setSelectedTemplate(null); }}
        title={`Appliquer : ${selectedTemplate?.name || ''}`}
      >
        <div className="space-y-4">
          <p className="text-sm text-[#6B7280] dark:text-[#A3A3A3]">
            Choisissez la date a laquelle appliquer ce template. Les creneaux seront automatiquement attribues aux employes disponibles.
          </p>
          {selectedTemplate && (
            <div className="p-3 rounded-xl bg-[#FAFAFA] dark:bg-[#0A0A0A] border border-[#E5E7EB] dark:border-[#1A1A1A]">
              <div className="text-xs text-[#9CA3AF] dark:text-[#737373] mb-1">Creneaux prevus :</div>
              {selectedTemplate.assignments.map((a, i) => (
                <div key={i} className="text-xs text-[#6B7280] dark:text-[#A3A3A3]">
                  {a.count}x {ROLE_LABELS[a.role] || a.role} -- {a.startTime} a {a.endTime} ({a.type})
                </div>
              ))}
            </div>
          )}
          <div>
            <label className="block text-sm font-medium text-[#6B7280] dark:text-[#A3A3A3] mb-1">Date</label>
            <input
              type="date"
              value={templateApplyDate}
              onChange={e => setTemplateApplyDate(e.target.value)}
              className="w-full px-3 py-2 rounded-lg bg-[#FAFAFA] dark:bg-[#0A0A0A] border border-[#E5E7EB] dark:border-[#1A1A1A] text-[#111111] dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm"
            />
          </div>
          {/* Quick day buttons */}
          <div className="flex flex-wrap gap-1.5">
            {weekDays.map((day, i) => {
              const dayStr = formatDate(day);
              return (
                <button
                  key={i}
                  onClick={() => setTemplateApplyDate(dayStr)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition ${
                    templateApplyDate === dayStr
                      ? 'bg-indigo-600 text-white border-indigo-600'
                      : 'bg-[#FAFAFA] dark:bg-[#0A0A0A] border-[#E5E7EB] dark:border-[#1A1A1A] text-[#6B7280] dark:text-[#A3A3A3] hover:border-[#D1D5DB] dark:hover:border-[#333]'
                  }`}
                >
                  {JOURS[i]} {day.getDate()}/{(day.getMonth() + 1).toString().padStart(2, '0')}
                </button>
              );
            })}
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <button onClick={() => { setShowTemplateApplyModal(false); setSelectedTemplate(null); }} className="px-4 py-2 text-sm font-medium text-[#6B7280] dark:text-[#A3A3A3] hover:bg-[#F3F4F6] dark:hover:bg-[#171717] rounded-lg transition">
              Annuler
            </button>
            <button
              onClick={() => selectedTemplate && applyTemplate(selectedTemplate, templateApplyDate)}
              disabled={!templateApplyDate}
              className="px-4 py-2 text-sm font-medium bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition disabled:opacity-50"
            >
              <span className="flex items-center gap-1"><Zap className="w-3.5 h-3.5" /> Appliquer</span>
            </button>
          </div>
        </div>
      </Modal>

      {/* ── Availability Management Modal ─────────────────────────────── */}
      <Modal
        isOpen={showAvailabilityModal}
        onClose={() => setShowAvailabilityModal(false)}
        title={`Disponibilites : ${availabilityEmployee?.name || ''}`}
      >
        <div className="space-y-4">
          <p className="text-sm text-[#6B7280] dark:text-[#A3A3A3]">
            Definissez les creneaux ou l'employe n'est pas disponible. Les zones grises apparaitront sur le planning.
          </p>

          {/* Current unavailabilities */}
          {availabilityEmployee && (
            <div className="space-y-2">
              <h4 className="text-xs font-medium text-[#9CA3AF] dark:text-[#737373] uppercase tracking-wider">Indisponibilites actuelles</h4>
              {availabilities.filter(a => a.employeeId === availabilityEmployee.id && !a.available).length === 0 && (
                <p className="text-xs text-[#9CA3AF] dark:text-[#737373] text-center py-3 bg-[#FAFAFA] dark:bg-[#0A0A0A] rounded-xl border border-dashed border-[#E5E7EB] dark:border-[#1A1A1A]">
                  Aucune indisponibilite definie.
                </p>
              )}
              {availabilities.filter(a => a.employeeId === availabilityEmployee.id && !a.available).map(avail => (
                <div key={avail.id} className="flex items-center justify-between p-2.5 rounded-xl bg-[#FAFAFA] dark:bg-[#0A0A0A] border border-[#E5E7EB] dark:border-[#1A1A1A]">
                  <div className="flex items-center gap-2">
                    <Ban className="w-3.5 h-3.5 text-red-400" />
                    <span className="text-sm text-[#111111] dark:text-white font-medium">{JOURS_FULL[avail.dayOfWeek]}</span>
                    <span className="text-xs text-[#9CA3AF] dark:text-[#737373]">{avail.startTime} - {avail.endTime}</span>
                  </div>
                  <button onClick={() => removeAvailability(avail.id)} className="p-1 rounded hover:bg-red-100 dark:hover:bg-red-900/20 transition">
                    <X className="w-3.5 h-3.5 text-red-400" />
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Add new unavailability */}
          <div className="p-3 rounded-xl bg-[#FAFAFA] dark:bg-[#0A0A0A] border border-[#E5E7EB] dark:border-[#1A1A1A] space-y-3">
            <h4 className="text-xs font-medium text-[#9CA3AF] dark:text-[#737373] uppercase tracking-wider">Ajouter une indisponibilite</h4>
            <div>
              <label className="block text-xs font-medium text-[#6B7280] dark:text-[#A3A3A3] mb-1">Jour</label>
              <select
                value={availForm.dayOfWeek}
                onChange={e => setAvailForm(f => ({ ...f, dayOfWeek: parseInt(e.target.value) }))}
                className="w-full px-3 py-2 rounded-lg bg-white dark:bg-black border border-[#E5E7EB] dark:border-[#1A1A1A] text-[#111111] dark:text-white text-sm"
              >
                {JOURS_FULL.map((j, i) => (
                  <option key={i} value={i}>{j}</option>
                ))}
              </select>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-[#6B7280] dark:text-[#A3A3A3] mb-1">De</label>
                <input
                  type="time"
                  value={availForm.startTime}
                  onChange={e => setAvailForm(f => ({ ...f, startTime: e.target.value }))}
                  className="w-full px-3 py-2 rounded-lg bg-white dark:bg-black border border-[#E5E7EB] dark:border-[#1A1A1A] text-[#111111] dark:text-white text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-[#6B7280] dark:text-[#A3A3A3] mb-1">A</label>
                <input
                  type="time"
                  value={availForm.endTime}
                  onChange={e => setAvailForm(f => ({ ...f, endTime: e.target.value }))}
                  className="w-full px-3 py-2 rounded-lg bg-white dark:bg-black border border-[#E5E7EB] dark:border-[#1A1A1A] text-[#111111] dark:text-white text-sm"
                />
              </div>
            </div>
            <button
              onClick={addAvailability}
              className="w-full py-2 bg-red-600 text-white rounded-xl hover:bg-red-700 transition text-sm font-medium flex items-center justify-center gap-1"
            >
              <Ban className="w-3.5 h-3.5" /> Marquer comme indisponible
            </button>
          </div>

          <div className="flex justify-end pt-2">
            <button onClick={() => setShowAvailabilityModal(false)} className="px-4 py-2 text-sm font-medium bg-[#111111] dark:bg-white text-white dark:text-black rounded-xl hover:opacity-90 transition">
              Fermer
            </button>
          </div>
        </div>
      </Modal>

      {/* ── WhatsApp / Send Planning Modal ────────────────────────────── */}
      <Modal
        isOpen={showWhatsappModal}
        onClose={() => setShowWhatsappModal(false)}
        title="Envoyer le planning"
      >
        <div className="space-y-4">
          <p className="text-sm text-[#6B7280] dark:text-[#A3A3A3]">
            Copiez le message ci-dessous et envoyez-le via WhatsApp, SMS ou autre messagerie.
          </p>

          <div className="relative">
            <textarea
              readOnly
              value={whatsappMessage}
              rows={12}
              className="w-full px-3 py-2 rounded-lg bg-[#FAFAFA] dark:bg-[#0A0A0A] border border-[#E5E7EB] dark:border-[#1A1A1A] text-[#111111] dark:text-white text-xs font-mono resize-none"
            />
          </div>

          <div className="flex flex-col sm:flex-row gap-2">
            <button
              onClick={() => {
                navigator.clipboard.writeText(whatsappMessage);
                showToast('Message copie dans le presse-papier !', 'success');
              }}
              className="flex-1 py-2.5 bg-[#111111] dark:bg-white text-white dark:text-black rounded-xl hover:opacity-90 transition text-sm font-medium flex items-center justify-center gap-2"
            >
              <Copy className="w-4 h-4" /> Copier le message
            </button>
            <button
              onClick={() => {
                const encoded = encodeURIComponent(whatsappMessage);
                window.open(`https://wa.me/?text=${encoded}`, '_blank');
              }}
              className="flex-1 py-2.5 bg-[#25D366] text-white rounded-xl hover:bg-[#20BD5A] transition text-sm font-medium flex items-center justify-center gap-2"
            >
              <MessageSquare className="w-4 h-4" /> Ouvrir WhatsApp
            </button>
          </div>

          {/* Per-employee send links */}
          <div className="space-y-2">
            <h4 className="text-xs font-medium text-[#9CA3AF] dark:text-[#737373] uppercase tracking-wider">Envoyer par employe</h4>
            {employees.map(emp => {
              const empShifts = weekShifts.filter(s => s.employeeId === emp.id);
              if (empShifts.length === 0) return null;
              const empMsg = [`${emp.name}, voici ton planning :`];
              weekDayStrings.forEach((dayStr, i) => {
                const dayShifts = empShifts.filter(s => s.date === dayStr);
                if (dayShifts.length > 0) {
                  empMsg.push(`${JOURS_FULL[i]}: ${dayShifts.map(s => `${s.startTime}-${s.endTime}`).join(', ')}`);
                }
              });
              const hours = employeeWeeklyHours.get(emp.id) || 0;
              empMsg.push(`Total: ${hours.toFixed(0)}h`);
              const msg = empMsg.join('\n');
              return (
                <div key={emp.id} className="flex items-center justify-between p-2.5 rounded-xl bg-[#FAFAFA] dark:bg-[#0A0A0A] border border-[#E5E7EB] dark:border-[#1A1A1A]">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: emp.color || '#6366f1' }} />
                    <span className="text-sm font-medium text-[#111111] dark:text-white">{emp.name}</span>
                    <span className="text-xs text-[#9CA3AF] dark:text-[#737373]">{hours.toFixed(0)}h</span>
                  </div>
                  <div className="flex gap-1.5">
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(msg);
                        showToast(`Planning de ${emp.name} copie !`, 'success');
                      }}
                      className="p-1.5 rounded-lg hover:bg-[#F3F4F6] dark:hover:bg-[#171717] transition"
                      title="Copier"
                    >
                      <Copy className="w-3.5 h-3.5 text-[#6B7280] dark:text-[#A3A3A3]" />
                    </button>
                    <button
                      onClick={() => {
                        const encoded = encodeURIComponent(msg);
                        window.open(`https://wa.me/?text=${encoded}`, '_blank');
                      }}
                      className="p-1.5 rounded-lg bg-[#25D366]/10 hover:bg-[#25D366]/20 transition"
                      title="WhatsApp"
                    >
                      <Send className="w-3.5 h-3.5 text-[#25D366]" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="flex justify-end pt-2">
            <button onClick={() => setShowWhatsappModal(false)} className="px-4 py-2 text-sm font-medium bg-[#111111] dark:bg-white text-white dark:text-black rounded-xl hover:opacity-90 transition">
              Fermer
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

// ── Sub-components ────────────────────────────────────────────────────

function StatCard({ icon, label, value, alert, subtitle }: {
  icon: React.ReactNode;
  label: string;
  value: string;
  alert?: boolean;
  subtitle?: string;
}) {
  return (
    <div className={`bg-white dark:bg-black rounded-2xl p-4 border ${alert ? 'border-red-700/50' : 'border-[#E5E7EB] dark:border-[#1A1A1A]'}`}>
      <div className="flex items-center gap-3">
        <div className={`p-2 rounded-lg ${alert ? 'bg-red-100 dark:bg-red-900/30' : 'bg-[#FAFAFA] dark:bg-[#0A0A0A]'}`}>
          {icon}
        </div>
        <div className="min-w-0">
          <div className="text-[10px] sm:text-xs text-[#9CA3AF] dark:text-[#737373] truncate">{label}</div>
          <div className={`text-lg sm:text-xl font-bold ${alert ? 'text-red-400' : 'text-[#111111] dark:text-white'}`}>{value}</div>
          {subtitle && (
            <div className={`text-[10px] sm:text-xs truncate ${alert ? 'text-red-400' : 'text-emerald-400'}`}>{subtitle}</div>
          )}
        </div>
      </div>
    </div>
  );
}

function MobileDayContent({ day, shifts, employees, conflicts, onEditShift, onDeleteShift, onAddShift, dragEmployee, onDragOver, onDrop }: {
  day: Date;
  shifts: Shift[];
  employees: Employee[];
  conflicts: Conflict[];
  onEditShift: (s: Shift) => void;
  onDeleteShift: (id: number) => void;
  onAddShift: (dayStr: string, shiftType?: ShiftType) => void;
  dragEmployee: Employee | null;
  onDragOver: (e: DragEvent<HTMLDivElement>) => void;
  onDrop: (dayStr: string, shiftType: ShiftType) => void;
}) {
  const { t } = useTranslation();
  const dayStr = formatDate(day);
  const dayShifts = shifts.filter(s => s.date === dayStr);

  return (
    <div className="p-3 space-y-3">
      {SHIFT_TYPES.map(st => {
        const zoneShifts = dayShifts.filter(s => getShiftType(s.startTime) === st.key);
        return (
          <div
            key={st.key}
            onDragOver={onDragOver}
            onDrop={() => onDrop(dayStr, st.key)}
            className={`rounded-xl border p-3 ${st.bg} ${dragEmployee ? 'ring-2 ring-indigo-500/30' : ''}`}
          >
            <div className={`text-xs font-semibold uppercase tracking-wider mb-2 ${st.color}`}>
              {st.label} ({st.start} - {st.end})
            </div>
            <div className="space-y-2">
              {zoneShifts
                .sort((a, b) => a.startTime.localeCompare(b.startTime))
                .map(s => {
                  const emp = employees.find(e => e.id === s.employeeId);
                  if (!emp) return null;
                  const shiftConflict = conflicts.some(c => c.shiftA.id === s.id || c.shiftB.id === s.id);
                  const posteColor = POSTE_COLORS[s.type] || POSTE_COLORS.cuisine;
                  return (
                    <div
                      key={s.id}
                      className={`rounded-lg p-2.5 bg-white dark:bg-black border cursor-pointer hover:border-[#D1D5DB] dark:hover:border-[#333] transition group relative ${
                        shiftConflict ? 'border-red-500 ring-1 ring-red-500/30' : 'border-[#E5E7EB] dark:border-[#1A1A1A]'
                      }`}
                      onClick={() => onEditShift(s)}
                    >
                      <div className="flex items-center gap-2">
                        {shiftConflict && <AlertCircle className="w-3.5 h-3.5 text-red-500 flex-shrink-0" />}
                        <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: emp.color || '#6366f1' }} />
                        <span className="font-semibold text-[#111111] dark:text-white text-sm">{emp.name || ''}</span>
                        <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${posteColor.bg} ${posteColor.text} font-medium`}>
                          {s.type}
                        </span>
                      </div>
                      <div className="text-xs text-[#9CA3AF] dark:text-[#737373] mt-0.5">{ROLE_LABELS[emp.role] || emp.role || ''} -- {s.startTime} a {s.endTime}</div>
                      <button
                        onClick={e => { e.stopPropagation(); onDeleteShift(s.id); }}
                        className="absolute top-2 right-2 p-1 rounded bg-[#FAFAFA] dark:bg-[#0A0A0A] hover:bg-red-100 dark:hover:bg-red-900/40 transition"
                      >
                        <X className="w-3.5 h-3.5 text-red-400" />
                      </button>
                    </div>
                  );
                })}
              {zoneShifts.length === 0 && (
                <p className="text-center text-xs text-[#9CA3AF] dark:text-[#737373] py-2">{t('planning.noShift')}</p>
              )}
            </div>
            <button
              onClick={() => onAddShift(dayStr, st.key)}
              className="w-full mt-2 py-2 border border-dashed border-[#D1D5DB] dark:border-[#475569] rounded-lg text-[#9CA3AF] dark:text-[#737373] hover:border-indigo-500 hover:text-indigo-400 transition flex items-center justify-center gap-1 text-xs"
            >
              <Plus className="w-3.5 h-3.5" /> {t('common.add')}
            </button>
          </div>
        );
      })}
    </div>
  );
}

// ── Day Timeline View (detailed hour-by-hour) ──────────────────────

function DayTimelineView({ day, shifts, employees, conflicts, onEditShift, onDeleteShift, onAddShift }: {
  day: Date;
  shifts: Shift[];
  employees: Employee[];
  conflicts: Conflict[];
  onEditShift: (s: Shift) => void;
  onDeleteShift: (id: number) => void;
  onAddShift: (dayStr: string, shiftType?: ShiftType) => void;
}) {
  const { t } = useTranslation();
  const dayStr = formatDate(day);
  const dayShifts = shifts.filter(s => s.date === dayStr);
  const totalHours = dayShifts.reduce((sum, s) => sum + shiftHours(s.startTime, s.endTime), 0);
  const totalCost = dayShifts.reduce((sum, s) => {
    const emp = employees.find(e => e.id === s.employeeId);
    return sum + (emp ? shiftHours(s.startTime, s.endTime) * (emp.hourlyRate ?? 0) : 0);
  }, 0);
  const uniqueEmployees = new Set(dayShifts.map(s => s.employeeId)).size;
  const dayConflicts = conflicts.filter(c => c.shiftA.date === dayStr);

  // Group by employee for presence timeline
  const presenceMap = new Map<number, Shift[]>();
  dayShifts.forEach(s => {
    const arr = presenceMap.get(s.employeeId) || [];
    arr.push(s);
    presenceMap.set(s.employeeId, arr);
  });

  return (
    <div className="p-5 space-y-5">
      {/* Day stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3">
        <div className="bg-[#FAFAFA] dark:bg-[#0A0A0A] rounded-xl p-2 sm:p-3 text-center border border-[#E5E7EB] dark:border-[#1A1A1A]">
          <div className="text-[10px] sm:text-xs text-[#9CA3AF] dark:text-[#737373]">{t('planning.presentEmployees')}</div>
          <div className="text-lg sm:text-2xl font-bold text-[#111111] dark:text-white">{uniqueEmployees}</div>
        </div>
        <div className="bg-[#FAFAFA] dark:bg-[#0A0A0A] rounded-xl p-2 sm:p-3 text-center border border-[#E5E7EB] dark:border-[#1A1A1A]">
          <div className="text-[10px] sm:text-xs text-[#9CA3AF] dark:text-[#737373]">{t('planning.totalHours')}</div>
          <div className="text-lg sm:text-2xl font-bold text-[#111111] dark:text-white">{totalHours.toFixed(0)}h</div>
        </div>
        <div className="bg-[#FAFAFA] dark:bg-[#0A0A0A] rounded-xl p-2 sm:p-3 text-center border border-[#E5E7EB] dark:border-[#1A1A1A]">
          <div className="text-[10px] sm:text-xs text-[#9CA3AF] dark:text-[#737373]">{t('planning.dayCost')}</div>
          <div className="text-lg sm:text-2xl font-bold text-emerald-400">{totalCost.toFixed(0)} EUR</div>
        </div>
        {dayConflicts.length > 0 && (
          <div className="bg-red-50 dark:bg-red-950/20 rounded-xl p-2 sm:p-3 text-center border border-red-200 dark:border-red-800/30">
            <div className="text-[10px] sm:text-xs text-red-500">Conflits</div>
            <div className="text-lg sm:text-2xl font-bold text-red-500">{dayConflicts.length}</div>
          </div>
        )}
      </div>

      {/* Timeline visualization */}
      <div className="bg-[#FAFAFA] dark:bg-[#0A0A0A] rounded-xl border border-[#E5E7EB] dark:border-[#1A1A1A] p-4 overflow-x-auto">
        <h4 className="text-xs font-medium text-[#9CA3AF] dark:text-[#737373] uppercase tracking-wider mb-3">Timeline 6h - 23h</h4>
        {/* Hour ruler */}
        <div className="flex mb-2" style={{ minWidth: '600px' }}>
          <div className="w-28 flex-shrink-0" />
          <div className="flex-1 flex">
            {GRID_HOURS.map(h => (
              <div key={h} className="flex-1 text-center">
                <span className="text-[9px] font-mono text-[#9CA3AF] dark:text-[#737373]">{h}</span>
              </div>
            ))}
          </div>
        </div>
        {/* Employee rows */}
        <div className="space-y-1.5" style={{ minWidth: '600px' }}>
          {employees.map(emp => {
            const empShifts = presenceMap.get(emp.id) || [];
            const empConflicts = dayConflicts.filter(c => c.employeeId === emp.id);
            return (
              <div key={emp.id} className="flex items-center gap-2">
                <div className="w-28 flex-shrink-0 flex items-center gap-1.5 truncate">
                  <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: emp.color || '#6366f1' }} />
                  <span className="text-xs font-medium text-[#111111] dark:text-white truncate">{emp.name}</span>
                  {empConflicts.length > 0 && <AlertCircle className="w-3 h-3 text-red-500 flex-shrink-0" />}
                </div>
                <div className="flex-1 relative h-7 bg-white dark:bg-black rounded border border-[#E5E7EB] dark:border-[#1A1A1A]">
                  {/* Hour grid lines */}
                  {GRID_HOURS.map((h, i) => (
                    <div
                      key={h}
                      className="absolute top-0 bottom-0 border-l border-[#E5E7EB] dark:border-[#1A1A1A]"
                      style={{ left: `${(i / GRID_HOURS.length) * 100}%` }}
                    />
                  ))}
                  {/* Shift bars */}
                  {empShifts.map(s => {
                    const sStart = timeToMinutes(s.startTime);
                    const sEnd = timeToMinutes(s.endTime);
                    const gridStart = 6 * 60; // 6:00
                    const gridEnd = 24 * 60; // 24:00
                    const left = Math.max(0, ((sStart - gridStart) / (gridEnd - gridStart)) * 100);
                    const width = Math.min(100 - left, ((sEnd - sStart) / (gridEnd - gridStart)) * 100);
                    const shiftConflict = empConflicts.some(c => c.shiftA.id === s.id || c.shiftB.id === s.id);
                    const posteColor = POSTE_COLORS[s.type] || POSTE_COLORS.cuisine;
                    return (
                      <div
                        key={s.id}
                        className={`absolute top-0.5 bottom-0.5 rounded cursor-pointer hover:brightness-110 transition flex items-center px-1 overflow-hidden ${
                          shiftConflict ? 'ring-2 ring-red-500' : ''
                        }`}
                        style={{
                          left: `${left}%`,
                          width: `${width}%`,
                          backgroundColor: (emp.color || '#6366f1') + '30',
                          borderLeft: `3px solid ${emp.color || '#6366f1'}`,
                        }}
                        onClick={() => onEditShift(s)}
                        title={`${emp.name} - ${s.startTime} a ${s.endTime} (${s.type})`}
                      >
                        <span className="text-[9px] font-medium text-[#111111] dark:text-white truncate">
                          {s.startTime}-{s.endTime}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Shift type sections */}
      {SHIFT_TYPES.map(st => {
        const zoneShifts = dayShifts.filter(s => getShiftType(s.startTime) === st.key);
        return (
          <div key={st.key}>
            <div className="flex items-center gap-2 mb-3">
              <div className={`w-3 h-3 rounded-full ${st.key === 'matin' ? 'bg-amber-400' : st.key === 'midi' ? 'bg-teal-400' : 'bg-purple-400'}`} />
              <h4 className={`font-semibold ${st.color}`}>{st.label} ({st.start} - {st.end})</h4>
              <span className="text-xs text-[#9CA3AF] dark:text-[#737373]">{zoneShifts.length} creneau(x)</span>
            </div>
            {zoneShifts.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {zoneShifts
                  .sort((a, b) => a.startTime.localeCompare(b.startTime))
                  .map(s => {
                    const emp = employees.find(e => e.id === s.employeeId);
                    if (!emp) return null;
                    const hours = shiftHours(s.startTime, s.endTime);
                    const shiftConflict = conflicts.some(c => c.shiftA.id === s.id || c.shiftB.id === s.id);
                    const posteColor = POSTE_COLORS[s.type] || POSTE_COLORS.cuisine;
                    return (
                      <div
                        key={s.id}
                        className={`rounded-xl p-4 border bg-[#FAFAFA] dark:bg-[#0A0A0A] cursor-pointer hover:border-[#D1D5DB] dark:hover:border-[#333] transition group relative ${
                          shiftConflict ? 'border-red-500 ring-1 ring-red-500/30' : 'border-[#E5E7EB] dark:border-[#1A1A1A]'
                        }`}
                        onClick={() => onEditShift(s)}
                      >
                        <div className="flex items-center gap-3 mb-2">
                          <div className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm" style={{ backgroundColor: emp.color || '#6366f1' }}>
                            {(emp.name || '').charAt(0)}
                          </div>
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center gap-1.5">
                              {shiftConflict && <AlertCircle className="w-3.5 h-3.5 text-red-500 flex-shrink-0" />}
                              <span className="font-semibold text-[#111111] dark:text-white truncate">{emp.name || ''}</span>
                            </div>
                            <div className="flex items-center gap-1.5 mt-0.5">
                              <span className="text-xs text-[#9CA3AF] dark:text-[#737373]">{ROLE_LABELS[emp.role] || emp.role || ''}</span>
                              <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${posteColor.bg} ${posteColor.text} font-medium flex items-center gap-0.5`}>
                                {getPosteIcon(s.type)} {s.type}
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span className="font-mono text-[#6B7280] dark:text-[#A3A3A3]">{s.startTime} - {s.endTime}</span>
                          <span className="text-[#9CA3AF] dark:text-[#737373]">{hours}h -- {(hours * (emp.hourlyRate ?? 0)).toFixed(0)} EUR</span>
                        </div>
                        <button
                          onClick={e => { e.stopPropagation(); onDeleteShift(s.id); }}
                          className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 p-1.5 rounded-lg bg-white dark:bg-black hover:bg-red-100 dark:hover:bg-red-900/40 transition no-print"
                        >
                          <Trash2 className="w-3.5 h-3.5 text-red-400" />
                        </button>
                      </div>
                    );
                  })}
              </div>
            ) : (
              <p className="text-sm text-[#9CA3AF] dark:text-[#737373] py-3 text-center bg-[#FAFAFA] dark:bg-[#0A0A0A] rounded-xl border border-dashed border-[#E5E7EB] dark:border-[#1A1A1A]">
                {t('planning.noShift')}
              </p>
            )}
            <button
              onClick={() => onAddShift(dayStr, st.key)}
              className="mt-2 w-full py-2 border border-dashed border-[#E5E7EB] dark:border-[#1A1A1A] rounded-xl text-[#9CA3AF] dark:text-[#737373] hover:border-indigo-500 hover:text-indigo-400 transition flex items-center justify-center gap-1 text-sm no-print"
            >
              <Plus className="w-4 h-4" /> Ajouter un creneau {st.label.toLowerCase()}
            </button>
          </div>
        );
      })}

      {/* Presence summary */}
      <div>
        <h4 className="font-semibold text-[#111111] dark:text-white flex items-center gap-2 mb-3">
          <Eye className="w-4 h-4 text-indigo-400" /> {t('planning.dayPresence')}
        </h4>
        <div className="space-y-2">
          {employees.map(emp => {
            const empShifts = presenceMap.get(emp.id);
            const isPresent = !!empShifts && empShifts.length > 0;
            const empHours = empShifts ? empShifts.reduce((sum, s) => sum + shiftHours(s.startTime, s.endTime), 0) : 0;
            const empConflicts = dayConflicts.filter(c => c.employeeId === emp.id);
            return (
              <div
                key={emp.id}
                className={`flex items-center justify-between px-4 py-2.5 rounded-xl border transition ${
                  empConflicts.length > 0
                    ? 'border-red-500 bg-red-50 dark:bg-red-950/10'
                    : isPresent ? 'border-[#E5E7EB] dark:border-[#1A1A1A] bg-[#FAFAFA] dark:bg-[#0A0A0A]' : 'border-[#E5E7EB] dark:border-[#1A1A1A] bg-white dark:bg-black opacity-50'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-2.5 h-2.5 rounded-full ${empConflicts.length > 0 ? 'bg-red-500' : isPresent ? 'bg-emerald-400' : 'bg-[#D1D5DB] dark:bg-[#475569]'}`} />
                  <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: emp.color || '#6366f1' }} />
                  <span className={`text-sm font-medium ${isPresent ? 'text-[#111111] dark:text-white' : 'text-[#9CA3AF] dark:text-[#737373]'}`}>{emp.name || ''}</span>
                  <span className="text-xs text-[#9CA3AF] dark:text-[#737373]">{ROLE_LABELS[emp.role] || emp.role || ''}</span>
                  {empConflicts.length > 0 && (
                    <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-red-500/20 text-red-500 font-bold">CONFLIT</span>
                  )}
                </div>
                <div className="text-sm">
                  {isPresent ? (
                    <span className="text-[#6B7280] dark:text-[#A3A3A3]">
                      {empShifts!.map(s => `${s.startTime}-${s.endTime}`).join(', ')} -- <span className="font-semibold">{empHours}h</span>
                    </span>
                  ) : (
                    <span className="text-[#6B7280] dark:text-[#A3A3A3]">{t('planning.absent')}</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ── Pointage Tab ────────────────────────────────────────────────────

function PointageTab({
  employees, todayEntries, timeclockSummary, timeclockLoading, weekStart, weekDays,
  onPunchIn, onPunchOut, getEmployeePunchStatus, formatDuration, getElapsedMinutes, formatTimeFromISO,
  clockTick, goPrev, goNext, goThisWeek, weekLabel,
}: {
  employees: Employee[];
  todayEntries: TimeEntry[];
  timeclockSummary: TimeclockSummaryEmployee[];
  timeclockLoading: boolean;
  weekStart: Date;
  weekDays: Date[];
  onPunchIn: (id: number) => void;
  onPunchOut: (id: number) => void;
  getEmployeePunchStatus: (id: number) => { isPunchedIn: boolean; entry: TimeEntry | null };
  formatDuration: (m: number) => string;
  getElapsedMinutes: (iso: string) => number;
  formatTimeFromISO: (iso: string) => string;
  clockTick: number;
  goPrev: () => void;
  goNext: () => void;
  goThisWeek: () => void;
  weekLabel: string;
}) {
  const { t } = useTranslation();
  const today = new Date().toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
  void clockTick;

  const activePunches = employees.filter(e => getEmployeePunchStatus(e.id).isPunchedIn).length;
  const completedToday = todayEntries.filter(e => e.punchOut).length;
  const totalMinutesToday = todayEntries
    .filter(e => e.punchOut && e.totalMinutes)
    .reduce((sum, e) => sum + (e.totalMinutes || 0), 0);

  const JOURS_SHORT = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'];

  return (
    <div className="space-y-6">
      {/* Pointage summary cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3">
        <div className="bg-white dark:bg-black rounded-2xl p-3 sm:p-4 border border-[#E5E7EB] dark:border-[#1A1A1A]">
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="p-1.5 sm:p-2 rounded-lg bg-[#FAFAFA] dark:bg-[#0A0A0A]">
              <Users className="w-4 h-4 sm:w-5 sm:h-5 text-[#111111] dark:text-white" />
            </div>
            <div>
              <div className="text-[10px] sm:text-xs text-[#9CA3AF] dark:text-[#737373]">En service</div>
              <div className="text-lg sm:text-xl font-bold text-[#111111] dark:text-white">{activePunches}</div>
            </div>
          </div>
        </div>
        <div className="bg-white dark:bg-black rounded-2xl p-3 sm:p-4 border border-[#E5E7EB] dark:border-[#1A1A1A]">
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="p-1.5 sm:p-2 rounded-lg bg-[#FAFAFA] dark:bg-[#0A0A0A]">
              <LogOut className="w-4 h-4 sm:w-5 sm:h-5 text-[#111111] dark:text-white" />
            </div>
            <div>
              <div className="text-[10px] sm:text-xs text-[#9CA3AF] dark:text-[#737373]">Termines aujourd'hui</div>
              <div className="text-lg sm:text-xl font-bold text-[#111111] dark:text-white">{completedToday}</div>
            </div>
          </div>
        </div>
        <div className="bg-white dark:bg-black rounded-2xl p-3 sm:p-4 border border-[#E5E7EB] dark:border-[#1A1A1A]">
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="p-1.5 sm:p-2 rounded-lg bg-[#FAFAFA] dark:bg-[#0A0A0A]">
              <Clock className="w-4 h-4 sm:w-5 sm:h-5 text-[#111111] dark:text-white" />
            </div>
            <div>
              <div className="text-[10px] sm:text-xs text-[#9CA3AF] dark:text-[#737373]">Heures aujourd'hui</div>
              <div className="text-lg sm:text-xl font-bold text-[#111111] dark:text-white">{formatDuration(totalMinutesToday)}</div>
            </div>
          </div>
        </div>
        <div className="bg-white dark:bg-black rounded-2xl p-3 sm:p-4 border border-[#E5E7EB] dark:border-[#1A1A1A]">
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="p-1.5 sm:p-2 rounded-lg bg-[#FAFAFA] dark:bg-[#0A0A0A]">
              <CalendarDays className="w-4 h-4 sm:w-5 sm:h-5 text-[#111111] dark:text-white" />
            </div>
            <div>
              <div className="text-[10px] sm:text-xs text-[#9CA3AF] dark:text-[#737373]">Date</div>
              <div className="text-xs sm:text-sm font-bold text-[#111111] dark:text-white capitalize">{today}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Punch buttons per employee */}
      <div className="bg-white dark:bg-black border border-[#E5E7EB] dark:border-[#1A1A1A] rounded-2xl overflow-hidden">
        <div className="px-5 py-4 border-b border-[#E5E7EB] dark:border-[#1A1A1A]">
          <h3 className="font-semibold text-[#111111] dark:text-white flex items-center gap-2">
            <Timer className="w-4 h-4 text-[#111111] dark:text-white" /> Pointage du jour
          </h3>
        </div>
        <div className="divide-y divide-[#E5E7EB] dark:divide-[#1A1A1A]">
          {employees.map(emp => {
            const { isPunchedIn, entry } = getEmployeePunchStatus(emp.id);
            const empCompletedEntries = todayEntries.filter(e => e.employeeId === emp.id && e.punchOut);
            const empTotalMinutes = empCompletedEntries.reduce((sum, e) => sum + (e.totalMinutes || 0), 0);
            const elapsed = isPunchedIn && entry ? getElapsedMinutes(entry.punchIn) : 0;

            return (
              <div key={emp.id} className="px-5 py-4 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3 min-w-0 flex-1">
                  <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: emp.color || '#6366f1' }} />
                  <div className="min-w-0">
                    <div className="font-medium text-[#111111] dark:text-white text-sm truncate">{emp.name}</div>
                    <div className="text-xs text-[#9CA3AF] dark:text-[#737373]">
                      {ROLE_LABELS[emp.role] || emp.role}
                      {empTotalMinutes > 0 && ` -- ${formatDuration(empTotalMinutes)} aujourd'hui`}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3 flex-shrink-0">
                  {isPunchedIn && entry && (
                    <div className="text-right">
                      <div className="text-xs text-[#9CA3AF] dark:text-[#737373]">
                        Arrive {formatTimeFromISO(entry.punchIn)}
                      </div>
                      <div className="text-sm font-semibold text-[#111111] dark:text-white flex items-center gap-1">
                        <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                        {formatDuration(elapsed)}
                      </div>
                    </div>
                  )}

                  {isPunchedIn ? (
                    <button
                      onClick={() => onPunchOut(emp.id)}
                      disabled={timeclockLoading}
                      className="flex items-center gap-2 px-4 py-2 bg-[#111111] dark:bg-white text-white dark:text-black rounded-xl hover:bg-[#333] dark:hover:bg-[#E5E5E5] transition text-sm font-medium disabled:opacity-50"
                    >
                      <Square className="w-3.5 h-3.5" /> Sortie
                    </button>
                  ) : (
                    <button
                      onClick={() => onPunchIn(emp.id)}
                      disabled={timeclockLoading}
                      className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-black text-[#111111] dark:text-white border border-[#E5E7EB] dark:border-[#1A1A1A] rounded-xl hover:bg-[#FAFAFA] dark:hover:bg-[#0A0A0A] transition text-sm font-medium disabled:opacity-50"
                    >
                      <Play className="w-3.5 h-3.5" /> Entree
                    </button>
                  )}
                </div>
              </div>
            );
          })}
          {employees.length === 0 && (
            <div className="px-5 py-8 text-center text-[#9CA3AF] dark:text-[#737373] text-sm">
              Aucun employe. Ajoutez des employes dans l'onglet Planning.
            </div>
          )}
        </div>
      </div>

      {/* Today's timeline */}
      <div className="bg-white dark:bg-black border border-[#E5E7EB] dark:border-[#1A1A1A] rounded-2xl overflow-hidden">
        <div className="px-5 py-4 border-b border-[#E5E7EB] dark:border-[#1A1A1A]">
          <h3 className="font-semibold text-[#111111] dark:text-white flex items-center gap-2">
            <Clock className="w-4 h-4 text-[#111111] dark:text-white" /> Timeline du jour
          </h3>
        </div>
        <div className="px-5 py-4">
          {todayEntries.length > 0 ? (
            <div className="space-y-3">
              {todayEntries.map(entry => {
                const emp = employees.find(e => e.id === entry.employeeId) || entry.employee;
                if (!emp) return null;
                const isOpen = !entry.punchOut;
                const elapsed = isOpen ? getElapsedMinutes(entry.punchIn) : (entry.totalMinutes || 0);
                return (
                  <div key={entry.id} className="flex items-center gap-3">
                    <div className="flex flex-col items-center w-16 flex-shrink-0">
                      <span className="text-xs font-mono text-[#6B7280] dark:text-[#A3A3A3]">{formatTimeFromISO(entry.punchIn)}</span>
                      <div className={`w-px h-4 ${isOpen ? 'bg-emerald-500' : 'bg-[#E5E7EB] dark:bg-[#1A1A1A]'}`} />
                      <span className="text-xs font-mono text-[#6B7280] dark:text-[#A3A3A3]">
                        {entry.punchOut ? formatTimeFromISO(entry.punchOut) : '--:--'}
                      </span>
                    </div>
                    <div className={`flex-1 rounded-xl p-3 border ${isOpen ? 'border-emerald-500/30 bg-emerald-500/5' : 'border-[#E5E7EB] dark:border-[#1A1A1A] bg-[#FAFAFA] dark:bg-[#0A0A0A]'}`}>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: emp.color || '#6366f1' }} />
                          <span className="font-medium text-[#111111] dark:text-white text-sm">{emp.name}</span>
                          <span className="text-xs text-[#9CA3AF] dark:text-[#737373]">{ROLE_LABELS[emp.role] || emp.role}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          {isOpen && <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />}
                          <span className={`text-sm font-semibold ${isOpen ? 'text-emerald-600 dark:text-emerald-400' : 'text-[#111111] dark:text-white'}`}>
                            {formatDuration(elapsed)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="text-center text-[#9CA3AF] dark:text-[#737373] text-sm py-6">
              Aucun pointage enregistre aujourd'hui.
            </p>
          )}
        </div>
      </div>

      {/* Weekly summary table */}
      <div className="bg-white dark:bg-black border border-[#E5E7EB] dark:border-[#1A1A1A] rounded-2xl overflow-hidden">
        <div className="px-5 py-4 border-b border-[#E5E7EB] dark:border-[#1A1A1A] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <h3 className="font-semibold text-[#111111] dark:text-white flex items-center gap-2">
            <Euro className="w-4 h-4 text-[#111111] dark:text-white" /> Recap hebdomadaire (pointages)
          </h3>
          <div className="flex items-center gap-2">
            <button onClick={goPrev} className="p-1.5 rounded-lg hover:bg-[#FAFAFA] dark:hover:bg-[#0A0A0A] transition">
              <ChevronLeft className="w-4 h-4 text-[#6B7280] dark:text-[#A3A3A3]" />
            </button>
            <button onClick={goThisWeek} className="px-3 py-1 text-xs font-medium rounded-full bg-[#FAFAFA] dark:bg-[#0A0A0A] text-[#6B7280] dark:text-[#A3A3A3] hover:bg-[#F3F4F6] dark:hover:bg-[#171717] transition border border-[#E5E7EB] dark:border-[#1A1A1A]">
              Cette semaine
            </button>
            <span className="text-sm font-medium text-[#111111] dark:text-white px-2">{weekLabel}</span>
            <button onClick={goNext} className="p-1.5 rounded-lg hover:bg-[#FAFAFA] dark:hover:bg-[#0A0A0A] transition">
              <ChevronRight className="w-4 h-4 text-[#6B7280] dark:text-[#A3A3A3]" />
            </button>
          </div>
        </div>
        <div className="overflow-x-auto -mx-4 sm:mx-0">
          <table className="w-full text-sm min-w-[700px]">
            <thead>
              <tr className="bg-[#FAFAFA] dark:bg-[#0A0A0A]">
                <th className="px-4 py-2.5 text-left text-xs font-medium text-[#9CA3AF] dark:text-[#737373] uppercase">Employe</th>
                {JOURS_SHORT.map(j => (
                  <th key={j} className="px-3 py-2.5 text-center text-xs font-medium text-[#9CA3AF] dark:text-[#737373] uppercase">{j}</th>
                ))}
                <th className="px-3 py-2.5 text-center text-xs font-medium text-[#9CA3AF] dark:text-[#737373] uppercase">Total</th>
                <th className="px-4 py-2.5 text-right text-xs font-medium text-[#9CA3AF] dark:text-[#737373] uppercase">Cout</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E5E7EB] dark:divide-[#1A1A1A]">
              {timeclockSummary.length > 0 ? (
                <>
                  {timeclockSummary.map(emp => {
                    const weekDayStrings = weekDays.map(d => {
                      if (!d || isNaN(d.getTime())) return '';
                      return d.toISOString().slice(0, 10);
                    });
                    return (
                      <tr key={emp.id} className="hover:bg-[#FAFAFA] dark:hover:bg-[#0A0A0A] transition">
                        <td className="px-4 py-2.5 whitespace-nowrap">
                          <div className="flex items-center gap-2">
                            <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: emp.color || '#6366f1' }} />
                            <span className="font-medium text-[#111111] dark:text-white">{emp.name}</span>
                          </div>
                        </td>
                        {weekDayStrings.map((dayStr, i) => {
                          const dayMinutes = emp.days[dayStr] || 0;
                          const h = Math.round((dayMinutes / 60) * 10) / 10;
                          return (
                            <td key={i} className={`px-3 py-2.5 text-center text-xs ${h > 0 ? 'text-[#6B7280] dark:text-[#A3A3A3] font-medium' : 'text-[#9CA3AF] dark:text-[#737373]'}`}>
                              {h > 0 ? `${h}h` : '-'}
                            </td>
                          );
                        })}
                        <td className="px-3 py-2.5 text-center font-bold text-[#111111] dark:text-white">
                          {emp.totalHours > 0 ? `${emp.totalHours}h` : '-'}
                        </td>
                        <td className="px-4 py-2.5 text-right font-medium text-[#6B7280] dark:text-[#A3A3A3]">
                          {emp.totalCost > 0 ? `${emp.totalCost.toFixed(0)} EUR` : '-'}
                        </td>
                      </tr>
                    );
                  })}
                  <tr className="bg-[#FAFAFA] dark:bg-[#0A0A0A] font-semibold">
                    <td className="px-4 py-2.5 text-[#111111] dark:text-white">Total</td>
                    {weekDays.map((d, i) => {
                      const dayStr = d && !isNaN(d.getTime()) ? d.toISOString().slice(0, 10) : '';
                      const dayMinutes = timeclockSummary.reduce((sum, emp) => sum + (emp.days[dayStr] || 0), 0);
                      const h = Math.round((dayMinutes / 60) * 10) / 10;
                      return (
                        <td key={i} className="px-3 py-2.5 text-center text-xs text-[#6B7280] dark:text-[#A3A3A3]">
                          {h > 0 ? `${h}h` : '-'}
                        </td>
                      );
                    })}
                    <td className="px-3 py-2.5 text-center text-[#111111] dark:text-white">
                      {timeclockSummary.reduce((s, e) => s + e.totalHours, 0).toFixed(1)}h
                    </td>
                    <td className="px-4 py-2.5 text-right text-[#111111] dark:text-white">
                      {timeclockSummary.reduce((s, e) => s + e.totalCost, 0).toFixed(0)} EUR
                    </td>
                  </tr>
                </>
              ) : (
                <tr>
                  <td colSpan={10} className="px-5 py-8 text-center text-[#9CA3AF] dark:text-[#737373] text-sm">
                    Aucun pointage enregistre cette semaine.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
