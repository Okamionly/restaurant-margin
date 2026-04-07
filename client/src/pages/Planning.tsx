import { useState, useMemo, useCallback, useEffect, DragEvent } from 'react';
import {
  CalendarDays, Clock, Users, Euro, Plus, ChevronLeft, ChevronRight,
  Edit, Trash2, X, UserPlus, AlertTriangle, Eye, GripVertical,
  Timer, LogIn, LogOut, Play, Square
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

type EmployeeRole = 'Chef' | 'Commis' | 'Serveur' | 'Serveuse' | 'Plongeur' | 'Plongeuse' | 'Patissier' | 'Patissiere';

type ShiftType = 'matin' | 'midi' | 'soir';

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

const POSTES = [
  { value: 'cuisine', label: 'Cuisine' },
  { value: 'salle', label: 'Salle' },
  { value: 'plonge', label: 'Plonge' },
] as const;

const JOURS = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'];
const JOURS_FULL = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi', 'Dimanche'];

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

// (mock data removed — starts empty, loaded from API)

// ── API helpers ──────────────────────────────────────────────────────

function getAuthHeaders(): Record<string, string> {
  const token = localStorage.getItem('token');
  const rid = localStorage.getItem('activeRestaurantId');
  const headers: Record<string, string> = { 'Content-Type': 'application/json' };
  if (token) headers['Authorization'] = `Bearer ${token}`;
  if (rid) headers['X-Restaurant-Id'] = rid;
  return headers;
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

  // Modals
  const [showEmployeeModal, setShowEmployeeModal] = useState(false);
  const [showShiftModal, setShowShiftModal] = useState(false);
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
      // Optimistic update
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

  function openAddShift(day?: string, shiftType?: ShiftType) {
    setEditShift(null);
    const st = shiftType ? SHIFT_TYPES.find(s => s.key === shiftType) : null;
    setShiftForm({
      ...emptyShiftForm,
      date: day || '',
      startTime: st?.start || '',
      endTime: st?.end || '',
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

  // ── Drag & drop ──────────────────────────────────────────────────

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
      type: shiftType,
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
  }, [dragEmployee, shifts, nextId, showToast]);

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
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#111111] dark:text-white flex items-center gap-2">
            <CalendarDays className="w-7 h-7 text-indigo-500" />
            {t('planning.title')}
          </h1>
          <p className="text-sm text-[#9CA3AF] dark:text-[#737373] mt-1">
            {t('planning.subtitle')}
          </p>
        </div>
        <div className="flex gap-2 flex-wrap">
          <button onClick={openAddEmployee} className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition text-sm font-medium">
            <UserPlus className="w-4 h-4" /> {t('planning.employee')}
          </button>
          <button onClick={() => openAddShift()} className="flex items-center gap-2 px-4 py-2 bg-emerald-500 text-white rounded-xl hover:bg-emerald-400 transition text-sm font-medium">
            <Plus className="w-4 h-4" /> {t('planning.shift')}
          </button>
        </div>
      </div>

      {/* Tab navigation */}
      <div className="flex rounded-lg bg-white dark:bg-black border border-[#E5E7EB] dark:border-[#1A1A1A] p-1 gap-1">
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

      {/* Summary cards */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-2 sm:gap-3">
        <StatCard icon={<Users className="w-5 h-5 text-indigo-400" />} label={t('planning.employees')} value={String(employees.length)} />
        <StatCard icon={<Clock className="w-5 h-5 text-amber-400" />} label={t('planning.hoursPerWeek')} value={`${totalHoursWeek.toFixed(0)}h`} />
        <StatCard icon={<Euro className="w-5 h-5 text-emerald-400" />} label={t('planning.laborCost')} value={`${laborCost.toFixed(0)} EUR`} />
        <StatCard
          icon={<CalendarDays className="w-5 h-5 text-teal-400" />}
          label={t('planning.laborRatio')}
          value={`${laborRatio.toFixed(1)}%`}
          alert={laborRatio > 30}
        />
        <StatCard
          icon={<AlertTriangle className="w-5 h-5 text-rose-400" />}
          label={t('planning.hoursAlerts')}
          value={`${alertCount}`}
          alert={alertCount > 0}
          subtitle={alertCount > 0 ? `${alertCount} ${t('planning.employeesOver35h')}` : 'OK'}
        />
      </div>

      {/* Week navigation + view toggle */}
      <div className="flex flex-col sm:flex-row items-center justify-between bg-white dark:bg-black border border-[#E5E7EB] dark:border-[#1A1A1A] rounded-2xl p-4 gap-3">
        <div className="flex items-center gap-2">
          <button onClick={goPrev} className="p-2 rounded-lg hover:bg-[#FAFAFA] dark:bg-[#0A0A0A] transition">
            <ChevronLeft className="w-5 h-5 text-[#6B7280] dark:text-[#A3A3A3]" />
          </button>
          <button onClick={goThisWeek} className="px-3 py-1 text-xs font-medium rounded-full bg-indigo-900/40 text-indigo-300 hover:bg-indigo-800/50 transition border border-indigo-700/30">
            {t('planning.today')}
          </button>
          <h2 className="text-lg font-semibold text-[#111111] dark:text-white px-2">{weekLabel}</h2>
          <button onClick={goNext} className="p-2 rounded-lg hover:bg-[#FAFAFA] dark:bg-[#0A0A0A] transition">
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
      <div className="bg-white dark:bg-black border border-[#E5E7EB] dark:border-[#1A1A1A] rounded-2xl p-4">
        <h3 className="text-xs font-medium text-[#9CA3AF] dark:text-[#737373] uppercase tracking-wider mb-3">
          {t('planning.dragToAssign')}
        </h3>
        <div className="flex flex-wrap gap-2">
          {employees.map(emp => (
            <div
              key={emp.id}
              draggable
              onDragStart={() => handleDragStart(emp)}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-[#E5E7EB] dark:border-[#1A1A1A] bg-[#FAFAFA] dark:bg-[#0A0A0A] cursor-grab active:cursor-grabbing hover:border-[#D1D5DB] dark:hover:border-[#333] transition select-none"
            >
              <GripVertical className="w-3.5 h-3.5 text-[#9CA3AF] dark:text-[#737373]" />
              <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: emp.color || '#6366f1' }} />
              <span className="text-sm text-[#6B7280] dark:text-[#A3A3A3] font-medium">{emp.name || ''}</span>
              <span className="text-xs text-[#9CA3AF] dark:text-[#737373]">{ROLE_LABELS[emp.role] || emp.role || ''}</span>
            </div>
          ))}
        </div>
      </div>

      {/* ── Vue semaine ── */}
      {view === 'semaine' && (
        <div className="bg-white dark:bg-black border border-[#E5E7EB] dark:border-[#1A1A1A] rounded-2xl overflow-hidden">
          {/* Desktop grid */}
          <div className="hidden lg:block overflow-x-auto">
            <div className="grid grid-cols-7 min-w-[900px]">
              {weekDays.map((day, i) => {
                const dayStr = formatDate(day);
                const dayShifts = shifts.filter(s => s.date === dayStr);
                const isToday = formatDate(new Date()) === dayStr;
                const dayCost = dailyCosts[i];

                return (
                  <div key={i} className={`border-r border-[#E5E7EB] dark:border-[#1A1A1A] last:border-r-0 ${isToday ? 'bg-indigo-950/20' : ''}`}>
                    {/* Day header */}
                    <div className={`px-3 py-2.5 border-b border-[#E5E7EB] dark:border-[#1A1A1A] text-center ${isToday ? 'bg-indigo-900/30' : 'bg-[#FAFAFA] dark:bg-[#0A0A0A]'}`}>
                      <div className="text-xs font-medium text-[#9CA3AF] dark:text-[#737373] uppercase">{JOURS[i]}</div>
                      <div className={`text-sm font-bold ${isToday ? 'text-indigo-400' : 'text-[#6B7280] dark:text-[#A3A3A3]'}`}>
                        {day.getDate()}/{(day.getMonth() + 1).toString().padStart(2, '0')}
                      </div>
                      <div className="text-[10px] text-[#9CA3AF] dark:text-[#737373] mt-0.5">{(dayCost ?? 0).toFixed(0)} EUR</div>
                    </div>
                    {/* Shift zones */}
                    {SHIFT_TYPES.map(st => {
                      const zoneShifts = dayShifts.filter(s => getShiftType(s.startTime) === st.key);
                      return (
                        <div
                          key={st.key}
                          onDragOver={handleDragOver}
                          onDrop={() => handleDrop(dayStr, st.key)}
                          className={`border-b border-[#E5E7EB] dark:border-[#1A1A1A] last:border-b-0 min-h-[60px] p-1.5 transition ${dragEmployee ? 'bg-[#FAFAFA] dark:bg-[#0A0A0A] hover:bg-[#F3F4F6] dark:bg-[#171717]/30' : ''}`}
                        >
                          <div className={`text-[9px] font-medium uppercase tracking-wider mb-1 ${st.color}`}>
                            {st.label} ({st.start}-{st.end})
                          </div>
                          <div className="space-y-1">
                            {zoneShifts
                              .sort((a, b) => a.startTime.localeCompare(b.startTime))
                              .map(s => {
                                const emp = employees.find(e => e.id === s.employeeId);
                                if (!emp) return null;
                                return (
                                  <div
                                    key={s.id}
                                    className="rounded-md p-1.5 text-xs cursor-pointer hover:brightness-110 transition group relative border"
                                    style={{
                                      backgroundColor: (emp.color || '#6366f1') + '20',
                                      borderColor: (emp.color || '#6366f1') + '40',
                                    }}
                                    onClick={() => openEditShift(s)}
                                  >
                                    <div className="font-semibold text-[#111111] dark:text-white truncate">{emp.name || ''}</div>
                                    <div className="text-[10px] font-mono text-[#9CA3AF] dark:text-[#737373]">{s.startTime}-{s.endTime}</div>
                                    <button
                                      onClick={e => { e.stopPropagation(); deleteShift(s.id); }}
                                      className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 p-0.5 rounded bg-white dark:bg-black hover:bg-red-900/60 transition"
                                    >
                                      <X className="w-3 h-3 text-red-400" />
                                    </button>
                                  </div>
                                );
                              })}
                          </div>
                        </div>
                      );
                    })}
                    {/* Add button */}
                    <div className="p-1.5">
                      <button
                        onClick={() => openAddShift(dayStr)}
                        className="w-full py-1.5 border border-dashed border-[#E5E7EB] dark:border-[#1A1A1A] rounded-lg text-[#9CA3AF] dark:text-[#737373] hover:border-indigo-500 hover:text-indigo-400 transition flex items-center justify-center gap-1 text-xs"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Mobile: single day view */}
          <div className="lg:hidden">
            <div className="flex items-center justify-between px-4 py-3 border-b border-[#E5E7EB] dark:border-[#1A1A1A] bg-[#FAFAFA] dark:bg-[#0A0A0A]">
              <button
                onClick={() => setSelectedDayIdx(prev => (prev - 1 + 7) % 7)}
                className="p-2 rounded-lg hover:bg-[#F3F4F6] dark:bg-[#171717] transition"
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
                className="p-2 rounded-lg hover:bg-[#F3F4F6] dark:bg-[#171717] transition"
              >
                <ChevronRight className="w-5 h-5 text-[#6B7280] dark:text-[#A3A3A3]" />
              </button>
            </div>
            <MobileDayContent
              day={weekDays[selectedDayIdx]}
              shifts={shifts}
              employees={employees}
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

      {/* ── Vue jour ── */}
      {view === 'jour' && (
        <div className="bg-white dark:bg-black border border-[#E5E7EB] dark:border-[#1A1A1A] rounded-2xl overflow-hidden">
          <div className="flex items-center justify-between px-5 py-3 border-b border-[#E5E7EB] dark:border-[#1A1A1A] bg-[#FAFAFA] dark:bg-[#0A0A0A]">
            <button
              onClick={() => setSelectedDayIdx(prev => (prev - 1 + 7) % 7)}
              className="p-2 rounded-lg hover:bg-[#F3F4F6] dark:bg-[#171717] transition"
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
              className="p-2 rounded-lg hover:bg-[#F3F4F6] dark:bg-[#171717] transition"
            >
              <ChevronRight className="w-5 h-5 text-[#6B7280] dark:text-[#A3A3A3]" />
            </button>
          </div>
          <DayDetailView
            day={weekDays[selectedDayIdx]}
            shifts={shifts}
            employees={employees}
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
          <button onClick={openAddEmployee} className="text-xs font-medium text-indigo-400 hover:underline flex items-center gap-1">
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
                <th className="px-4 py-2.5 text-right text-xs font-medium text-[#9CA3AF] dark:text-[#737373] uppercase">{t('planning.contract')}</th>
                <th className="px-4 py-2.5 text-right text-xs font-medium text-[#9CA3AF] dark:text-[#737373] uppercase">{t('planning.hoursPerWeek')}</th>
                <th className="px-4 py-2.5 text-center text-xs font-medium text-[#9CA3AF] dark:text-[#737373] uppercase">{t('planning.status')}</th>
                <th className="px-4 py-2.5 text-center text-xs font-medium text-[#9CA3AF] dark:text-[#737373] uppercase">{t('planning.actions')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E5E7EB] dark:divide-[#1A1A1A]">
              {employees.map(emp => {
                const hours = employeeWeeklyHours.get(emp.id) || 0;
                const isOver35 = hours > 35;
                const isOver48 = hours > 48;
                return (
                  <tr key={emp.id} className="hover:bg-[#FAFAFA] dark:bg-[#0A0A0A] transition">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: emp.color || '#6366f1' }} />
                        <span className="font-medium text-[#111111] dark:text-white">{emp.name || ''}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className="px-2 py-0.5 rounded-full text-xs font-medium" style={{ backgroundColor: (emp.color || '#6366f1') + '20', color: emp.color || '#6366f1' }}>
                        {ROLE_LABELS[emp.role] || emp.role || ''}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right text-[#6B7280] dark:text-[#A3A3A3]">{(emp.hourlyRate ?? 0).toFixed(2)} EUR/h</td>
                    <td className="px-4 py-3 text-right text-[#6B7280] dark:text-[#A3A3A3]">{emp.hourlyRate ?? 0}h</td>
                    <td className="px-4 py-3 text-right">
                      <span className={`font-semibold ${isOver48 ? 'text-red-400' : isOver35 ? 'text-amber-400' : 'text-emerald-400'}`}>
                        {hours.toFixed(0)}h
                      </span>
                    </td>
                    <td className="px-4 py-3 text-center">
                      {isOver48 ? (
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
                    <td className="px-4 py-3 text-center">
                      <div className="flex items-center justify-center gap-1">
                        <button onClick={() => openEditEmployee(emp)} className="p-1.5 rounded hover:bg-[#F3F4F6] dark:bg-[#171717] transition">
                          <Edit className="w-3.5 h-3.5 text-[#9CA3AF] dark:text-[#737373]" />
                        </button>
                        <button onClick={() => deleteEmployee(emp.id)} className="p-1.5 rounded hover:bg-red-900/20 transition">
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

      {/* Weekly summary table */}
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
                return (
                  <tr key={row.emp.id} className="hover:bg-[#FAFAFA] dark:bg-[#0A0A0A] transition">
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
                      {isOver48 ? (
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
                  className={`w-8 h-8 rounded-full border-2 transition ${empForm.color === c ? 'border-white scale-110' : 'border-transparent opacity-60 hover:opacity-100'}`}
                  style={{ backgroundColor: c }}
                />
              ))}
            </div>
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <button onClick={() => setShowEmployeeModal(false)} className="px-4 py-2 text-sm font-medium text-[#6B7280] dark:text-[#A3A3A3] hover:bg-[#F3F4F6] dark:bg-[#171717] rounded-lg transition">
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
            <select
              value={shiftForm.type}
              onChange={e => setShiftForm(f => ({ ...f, type: e.target.value }))}
              className="w-full px-3 py-2 rounded-lg bg-[#FAFAFA] dark:bg-[#0A0A0A] border border-[#E5E7EB] dark:border-[#1A1A1A] text-[#111111] dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm"
            >
              {POSTES.map(p => (
                <option key={p.value} value={p.value}>{p.label}</option>
              ))}
            </select>
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <button onClick={() => setShowShiftModal(false)} className="px-4 py-2 text-sm font-medium text-[#6B7280] dark:text-[#A3A3A3] hover:bg-[#F3F4F6] dark:bg-[#171717] rounded-lg transition">
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
        <div className={`p-2 rounded-lg ${alert ? 'bg-red-900/30' : 'bg-[#FAFAFA] dark:bg-[#0A0A0A]'}`}>
          {icon}
        </div>
        <div>
          <div className="text-xs text-[#9CA3AF] dark:text-[#737373]">{label}</div>
          <div className={`text-xl font-bold ${alert ? 'text-red-400' : 'text-[#111111] dark:text-white'}`}>{value}</div>
          {subtitle && (
            <div className={`text-xs ${alert ? 'text-red-400' : 'text-emerald-400'}`}>{subtitle}</div>
          )}
        </div>
      </div>
    </div>
  );
}

function MobileDayContent({ day, shifts, employees, onEditShift, onDeleteShift, onAddShift, dragEmployee, onDragOver, onDrop }: {
  day: Date;
  shifts: Shift[];
  employees: Employee[];
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
                  return (
                    <div
                      key={s.id}
                      className="rounded-lg p-2.5 bg-white dark:bg-black border border-[#E5E7EB] dark:border-[#1A1A1A] cursor-pointer hover:border-[#D1D5DB] dark:hover:border-[#333] transition group relative"
                      onClick={() => onEditShift(s)}
                    >
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: emp.color || '#6366f1' }} />
                        <span className="font-semibold text-[#111111] dark:text-white text-sm">{emp.name || ''}</span>
                      </div>
                      <div className="text-xs text-[#9CA3AF] dark:text-[#737373] mt-0.5">{ROLE_LABELS[emp.role] || emp.role || ''} -- {s.startTime} a {s.endTime}</div>
                      <button
                        onClick={e => { e.stopPropagation(); onDeleteShift(s.id); }}
                        className="absolute top-2 right-2 p-1 rounded bg-[#FAFAFA] dark:bg-[#0A0A0A] hover:bg-red-900/40 transition"
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

function DayDetailView({ day, shifts, employees, onEditShift, onDeleteShift, onAddShift }: {
  day: Date;
  shifts: Shift[];
  employees: Employee[];
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

  // Group by employee for presence
  const presenceMap = new Map<number, Shift[]>();
  dayShifts.forEach(s => {
    const arr = presenceMap.get(s.employeeId) || [];
    arr.push(s);
    presenceMap.set(s.employeeId, arr);
  });

  return (
    <div className="p-5 space-y-5">
      {/* Day stats */}
      <div className="grid grid-cols-3 gap-2 sm:gap-3">
        <div className="bg-[#FAFAFA] dark:bg-[#0A0A0A] rounded-xl p-2 sm:p-3 text-center border border-[#E5E7EB] dark:border-[#1A1A1A]">
          <div className="text-[10px] sm:text-xs text-[#9CA3AF] dark:text-[#737373]">{t('planning.presentEmployees')}</div>
          <div className="text-lg sm:text-2xl font-bold text-[#111111] dark:text-white">{presenceMap.size}</div>
        </div>
        <div className="bg-[#FAFAFA] dark:bg-[#0A0A0A] rounded-xl p-3 text-center border border-[#E5E7EB] dark:border-[#1A1A1A]">
          <div className="text-xs text-[#9CA3AF] dark:text-[#737373]">{t('planning.totalHours')}</div>
          <div className="text-2xl font-bold text-[#111111] dark:text-white">{totalHours.toFixed(0)}h</div>
        </div>
        <div className="bg-[#FAFAFA] dark:bg-[#0A0A0A] rounded-xl p-3 text-center border border-[#E5E7EB] dark:border-[#1A1A1A]">
          <div className="text-xs text-[#9CA3AF] dark:text-[#737373]">{t('planning.dayCost')}</div>
          <div className="text-2xl font-bold text-emerald-400">{totalCost.toFixed(0)} EUR</div>
        </div>
      </div>

      {/* Shift type sections */}
      {SHIFT_TYPES.map(st => {
        const zoneShifts = dayShifts.filter(s => getShiftType(s.startTime) === st.key);
        return (
          <div key={st.key}>
            <div className={`flex items-center gap-2 mb-3`}>
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
                    return (
                      <div
                        key={s.id}
                        className="rounded-xl p-4 border border-[#E5E7EB] dark:border-[#1A1A1A] bg-[#FAFAFA] dark:bg-[#0A0A0A] cursor-pointer hover:border-[#D1D5DB] dark:hover:border-[#333] transition group relative"
                        onClick={() => onEditShift(s)}
                      >
                        <div className="flex items-center gap-3 mb-2">
                          <div className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm" style={{ backgroundColor: emp.color || '#6366f1' }}>
                            {(emp.name || '').charAt(0)}
                          </div>
                          <div>
                            <div className="font-semibold text-[#111111] dark:text-white">{emp.name || ''}</div>
                            <div className="text-xs text-[#9CA3AF] dark:text-[#737373]">{ROLE_LABELS[emp.role] || emp.role || ''}</div>
                          </div>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span className="font-mono text-[#6B7280] dark:text-[#A3A3A3]">{s.startTime} - {s.endTime}</span>
                          <span className="text-[#9CA3AF] dark:text-[#737373]">{hours}h -- {(hours * (emp.hourlyRate ?? 0)).toFixed(0)} EUR</span>
                        </div>
                        <button
                          onClick={e => { e.stopPropagation(); onDeleteShift(s.id); }}
                          className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 p-1.5 rounded-lg bg-white dark:bg-black hover:bg-red-900/40 transition"
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
              className="mt-2 w-full py-2 border border-dashed border-[#E5E7EB] dark:border-[#1A1A1A] rounded-xl text-[#9CA3AF] dark:text-[#737373] hover:border-indigo-500 hover:text-indigo-400 transition flex items-center justify-center gap-1 text-sm"
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
            return (
              <div
                key={emp.id}
                className={`flex items-center justify-between px-4 py-2.5 rounded-xl border transition ${
                  isPresent ? 'border-[#E5E7EB] dark:border-[#1A1A1A] bg-[#FAFAFA] dark:bg-[#0A0A0A]' : 'border-[#E5E7EB] dark:border-[#1A1A1A] bg-white dark:bg-black opacity-50'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-2.5 h-2.5 rounded-full ${isPresent ? 'bg-emerald-400' : 'bg-[#D1D5DB] dark:bg-[#475569]'}`} />
                  <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: emp.color || '#6366f1' }} />
                  <span className={`text-sm font-medium ${isPresent ? 'text-[#111111] dark:text-white' : 'text-[#9CA3AF] dark:text-[#737373]'}`}>{emp.name || ''}</span>
                  <span className="text-xs text-[#9CA3AF] dark:text-[#737373]">{ROLE_LABELS[emp.role] || emp.role || ''}</span>
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
  // clockTick triggers re-render for live elapsed time display
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
        <div className="bg-white dark:bg-black rounded-2xl p-4 border border-[#E5E7EB] dark:border-[#1A1A1A]">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-[#FAFAFA] dark:bg-[#0A0A0A]">
              <LogOut className="w-5 h-5 text-[#111111] dark:text-white" />
            </div>
            <div>
              <div className="text-xs text-[#9CA3AF] dark:text-[#737373]">Termines aujourd'hui</div>
              <div className="text-xl font-bold text-[#111111] dark:text-white">{completedToday}</div>
            </div>
          </div>
        </div>
        <div className="bg-white dark:bg-black rounded-2xl p-4 border border-[#E5E7EB] dark:border-[#1A1A1A]">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-[#FAFAFA] dark:bg-[#0A0A0A]">
              <Clock className="w-5 h-5 text-[#111111] dark:text-white" />
            </div>
            <div>
              <div className="text-xs text-[#9CA3AF] dark:text-[#737373]">Heures aujourd'hui</div>
              <div className="text-xl font-bold text-[#111111] dark:text-white">{formatDuration(totalMinutesToday)}</div>
            </div>
          </div>
        </div>
        <div className="bg-white dark:bg-black rounded-2xl p-4 border border-[#E5E7EB] dark:border-[#1A1A1A]">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-[#FAFAFA] dark:bg-[#0A0A0A]">
              <CalendarDays className="w-5 h-5 text-[#111111] dark:text-white" />
            </div>
            <div>
              <div className="text-xs text-[#9CA3AF] dark:text-[#737373]">Date</div>
              <div className="text-sm font-bold text-[#111111] dark:text-white capitalize">{today}</div>
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
                    {/* Time marker */}
                    <div className="flex flex-col items-center w-16 flex-shrink-0">
                      <span className="text-xs font-mono text-[#6B7280] dark:text-[#A3A3A3]">{formatTimeFromISO(entry.punchIn)}</span>
                      <div className={`w-px h-4 ${isOpen ? 'bg-emerald-500' : 'bg-[#E5E7EB] dark:bg-[#1A1A1A]'}`} />
                      <span className="text-xs font-mono text-[#6B7280] dark:text-[#A3A3A3]">
                        {entry.punchOut ? formatTimeFromISO(entry.punchOut) : '--:--'}
                      </span>
                    </div>
                    {/* Bar */}
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
                  {/* Totals row */}
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
