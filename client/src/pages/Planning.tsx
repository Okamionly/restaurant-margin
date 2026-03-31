import { useState, useMemo, useCallback, useEffect, DragEvent } from 'react';
import {
  CalendarDays, Clock, Users, Euro, Plus, ChevronLeft, ChevronRight,
  Edit, Trash2, X, UserPlus, AlertTriangle, Eye, GripVertical
} from 'lucide-react';
import { useToast } from '../hooks/useToast';
import Modal from '../components/Modal';

// ── Types ──────────────────────────────────────────────────────────────

interface Employee {
  id: number;
  nom: string;
  prenom: string;
  role: EmployeeRole;
  tauxHoraire: number;
  heuresContrat: number;
  couleur: string;
}

interface Shift {
  id: number;
  employeeId: number;
  date: string; // YYYY-MM-DD
  start: string; // HH:mm
  end: string; // HH:mm
  poste: 'cuisine' | 'salle' | 'plonge';
}

type EmployeeRole = 'Chef' | 'Commis' | 'Serveur' | 'Serveuse' | 'Plongeur' | 'Plongeuse' | 'Patissier' | 'Patissiere';

type ShiftType = 'matin' | 'midi' | 'soir';

const ROLES: EmployeeRole[] = ['Chef', 'Commis', 'Serveur', 'Serveuse', 'Plongeur', 'Plongeuse', 'Patissier', 'Patissiere'];

const ROLE_LABELS: Record<EmployeeRole, string> = {
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
  { key: 'midi', label: 'Midi', start: '11:00', end: '15:00', color: 'text-blue-400', bg: 'bg-blue-500/20 border-blue-500/30' },
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
  return d.toISOString().slice(0, 10);
}

function shiftHours(start: string, end: string): number {
  const [sh, sm] = start.split(':').map(Number);
  const [eh, em] = end.split(':').map(Number);
  return Math.max(0, (eh * 60 + em - sh * 60 - sm) / 60);
}

function getShiftType(start: string): ShiftType {
  const h = parseInt(start.split(':')[0]);
  if (h < 11) return 'matin';
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
  const { showToast } = useToast();
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [shifts, setShifts] = useState<Shift[]>([]);
  const [weekStart, setWeekStart] = useState<Date>(() => getMonday(new Date()));
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
  const emptyEmpForm = { nom: '', prenom: '', role: 'Commis' as EmployeeRole, tauxHoraire: '', heuresContrat: '', couleur: EMPLOYEE_COLORS[0] };
  const [empForm, setEmpForm] = useState(emptyEmpForm);

  // Shift form
  const emptyShiftForm = { employeeId: '', date: '', start: '', end: '', poste: 'cuisine' as Shift['poste'] };
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

  // ── Week navigation ─────────────────────────────────────────────────

  const weekDays = useMemo(() => {
    return Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));
  }, [weekStart]);

  const weekLabel = useMemo(() => {
    const end = addDays(weekStart, 6);
    const moisStart = weekStart.toLocaleDateString('fr-FR', { month: 'long' });
    const moisEnd = end.toLocaleDateString('fr-FR', { month: 'long' });
    const year = weekStart.getFullYear();
    if (moisStart === moisEnd) {
      return `${weekStart.getDate()} - ${end.getDate()} ${moisStart.charAt(0).toUpperCase() + moisStart.slice(1)} ${year}`;
    }
    return `${weekStart.getDate()} ${moisStart.charAt(0).toUpperCase() + moisStart.slice(1)} - ${end.getDate()} ${moisEnd.charAt(0).toUpperCase() + moisEnd.slice(1)} ${year}`;
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
    return weekShifts.reduce((sum, s) => sum + shiftHours(s.start, s.end), 0);
  }, [weekShifts]);

  const laborCost = useMemo(() => {
    return weekShifts.reduce((sum, s) => {
      const emp = employees.find(e => e.id === s.employeeId);
      if (!emp) return sum;
      return sum + shiftHours(s.start, s.end) * emp.tauxHoraire;
    }, 0);
  }, [weekShifts, employees]);

  const laborRatio = weeklyRevenue > 0 ? (laborCost / weeklyRevenue) * 100 : 0;

  // Per-employee weekly hours
  const employeeWeeklyHours = useMemo(() => {
    const map = new Map<number, number>();
    for (const emp of employees) {
      const hours = weekShifts
        .filter(s => s.employeeId === emp.id)
        .reduce((sum, s) => sum + shiftHours(s.start, s.end), 0);
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
          return sum + (emp ? shiftHours(s.start, s.end) * emp.tauxHoraire : 0);
        }, 0);
    });
  }, [weekDayStrings, shifts, employees]);

  // ── Employee CRUD ──────────────────────────────────────────────────

  function openAddEmployee() {
    setEditEmployee(null);
    const usedColors = new Set(employees.map(e => e.couleur));
    const nextColor = EMPLOYEE_COLORS.find(c => !usedColors.has(c)) || EMPLOYEE_COLORS[employees.length % EMPLOYEE_COLORS.length];
    setEmpForm({ ...emptyEmpForm, couleur: nextColor });
    setShowEmployeeModal(true);
  }

  function openEditEmployee(emp: Employee) {
    setEditEmployee(emp);
    setEmpForm({
      nom: emp.nom,
      prenom: emp.prenom,
      role: emp.role,
      tauxHoraire: String(emp.tauxHoraire),
      heuresContrat: String(emp.heuresContrat),
      couleur: emp.couleur,
    });
    setShowEmployeeModal(true);
  }

  async function saveEmployee() {
    if (!empForm.nom.trim() || !empForm.prenom.trim() || !empForm.tauxHoraire || !empForm.heuresContrat) {
      showToast('Veuillez remplir tous les champs', 'error');
      return;
    }
    const empData = {
      nom: empForm.nom,
      prenom: empForm.prenom,
      role: empForm.role,
      tauxHoraire: parseFloat(empForm.tauxHoraire),
      heuresContrat: parseFloat(empForm.heuresContrat),
      couleur: empForm.couleur,
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
      showToast('Employe modifie', 'success');
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
      showToast('Employe ajoute', 'success');
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
    showToast('Employe supprime', 'success');
  }

  // ── Shift CRUD ────────────────────────────────────────────────────

  function openAddShift(day?: string, shiftType?: ShiftType) {
    setEditShift(null);
    const st = shiftType ? SHIFT_TYPES.find(s => s.key === shiftType) : null;
    setShiftForm({
      ...emptyShiftForm,
      date: day || '',
      start: st?.start || '',
      end: st?.end || '',
    });
    setShowShiftModal(true);
  }

  function openEditShift(s: Shift) {
    setEditShift(s);
    setShiftForm({
      employeeId: String(s.employeeId),
      date: s.date,
      start: s.start,
      end: s.end,
      poste: s.poste,
    });
    setShowShiftModal(true);
  }

  async function saveShift() {
    if (!shiftForm.employeeId || !shiftForm.date || !shiftForm.start || !shiftForm.end) {
      showToast('Veuillez remplir tous les champs', 'error');
      return;
    }
    if (shiftForm.start >= shiftForm.end) {
      showToast("L'heure de fin doit etre apres l'heure de debut", 'error');
      return;
    }
    const empId = parseInt(shiftForm.employeeId);
    const overlap = shifts.some(s => {
      if (editShift && s.id === editShift.id) return false;
      if (s.employeeId !== empId || s.date !== shiftForm.date) return false;
      return s.start < shiftForm.end && s.end > shiftForm.start;
    });
    if (overlap) {
      showToast('Chevauchement detecte pour cet employe ce jour', 'error');
      return;
    }

    const shiftData = {
      employeeId: empId,
      date: shiftForm.date,
      start: shiftForm.start,
      end: shiftForm.end,
      poste: shiftForm.poste,
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
      showToast('Creneau modifie', 'success');
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
      showToast('Creneau ajoute', 'success');
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
    showToast('Creneau supprime', 'success');
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
      return s.start < st.end && s.end > st.start;
    });
    if (overlap) {
      showToast('Chevauchement detecte', 'error');
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
      start: st.start,
      end: st.end,
      poste,
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
    showToast(`${dragEmployee.prenom} assigne`, 'success');
    setDragEmployee(null);
  }, [dragEmployee, shifts, nextId, showToast]);

  // ── Summary table data ────────────────────────────────────────────

  const summaryRows = useMemo(() => {
    return employees.map(emp => {
      const days = weekDayStrings.map(dayStr => {
        const dayShifts = weekShifts.filter(s => s.employeeId === emp.id && s.date === dayStr);
        return dayShifts.reduce((sum, s) => sum + shiftHours(s.start, s.end), 0);
      });
      const total = days.reduce((a, b) => a + b, 0);
      return { emp, days, total, cost: total * emp.tauxHoraire };
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
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <CalendarDays className="w-7 h-7 text-indigo-500" />
            Planning du personnel
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Gestion des horaires et planification hebdomadaire
          </p>
        </div>
        <div className="flex gap-2 flex-wrap">
          <button onClick={openAddEmployee} className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition text-sm font-medium">
            <UserPlus className="w-4 h-4" /> Employe
          </button>
          <button onClick={() => openAddShift()} className="flex items-center gap-2 px-4 py-2 bg-emerald-500 text-white rounded-xl hover:bg-emerald-400 transition text-sm font-medium">
            <Plus className="w-4 h-4" /> Creneau
          </button>
        </div>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3">
        <StatCard icon={<Users className="w-5 h-5 text-indigo-400" />} label="Employes" value={String(employees.length)} />
        <StatCard icon={<Clock className="w-5 h-5 text-amber-400" />} label="Heures/semaine" value={`${totalHoursWeek.toFixed(0)}h`} />
        <StatCard icon={<Euro className="w-5 h-5 text-emerald-400" />} label="Cout MO" value={`${laborCost.toFixed(0)} EUR`} />
        <StatCard
          icon={<CalendarDays className="w-5 h-5 text-blue-400" />}
          label="Ratio MO/CA"
          value={`${laborRatio.toFixed(1)}%`}
          alert={laborRatio > 30}
        />
        <StatCard
          icon={<AlertTriangle className="w-5 h-5 text-rose-400" />}
          label="Alertes heures"
          value={`${alertCount}`}
          alert={alertCount > 0}
          subtitle={alertCount > 0 ? `${alertCount} employe(s) >35h` : 'OK'}
        />
      </div>

      {/* Week navigation + view toggle */}
      <div className="flex flex-col sm:flex-row items-center justify-between bg-slate-900/50 border border-slate-800 rounded-2xl p-4 gap-3">
        <div className="flex items-center gap-2">
          <button onClick={goPrev} className="p-2 rounded-lg hover:bg-slate-800 transition">
            <ChevronLeft className="w-5 h-5 text-slate-300" />
          </button>
          <button onClick={goThisWeek} className="px-3 py-1 text-xs font-medium rounded-full bg-indigo-900/40 text-indigo-300 hover:bg-indigo-800/50 transition border border-indigo-700/30">
            Aujourd'hui
          </button>
          <h2 className="text-lg font-semibold text-white px-2">{weekLabel}</h2>
          <button onClick={goNext} className="p-2 rounded-lg hover:bg-slate-800 transition">
            <ChevronRight className="w-5 h-5 text-slate-300" />
          </button>
        </div>
        <div className="flex rounded-lg bg-slate-800 border border-slate-700 p-0.5">
          <button
            onClick={() => setView('semaine')}
            className={`px-4 py-1.5 text-sm font-medium rounded-md transition ${view === 'semaine' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'}`}
          >
            Semaine
          </button>
          <button
            onClick={() => setView('jour')}
            className={`px-4 py-1.5 text-sm font-medium rounded-md transition ${view === 'jour' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'}`}
          >
            Jour
          </button>
        </div>
      </div>

      {/* Employee drag panel */}
      <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-4">
        <h3 className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-3">
          Glisser un employe sur un creneau pour l'assigner
        </h3>
        <div className="flex flex-wrap gap-2">
          {employees.map(emp => (
            <div
              key={emp.id}
              draggable
              onDragStart={() => handleDragStart(emp)}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-slate-700 bg-slate-800 cursor-grab active:cursor-grabbing hover:border-slate-600 transition select-none"
            >
              <GripVertical className="w-3.5 h-3.5 text-slate-500" />
              <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: emp.couleur }} />
              <span className="text-sm text-slate-200 font-medium">{emp.prenom} {(emp.nom || '').charAt(0)}.</span>
              <span className="text-xs text-slate-500">{ROLE_LABELS[emp.role]}</span>
            </div>
          ))}
        </div>
      </div>

      {/* ── Vue semaine ── */}
      {view === 'semaine' && (
        <div className="bg-slate-900/50 border border-slate-800 rounded-2xl overflow-hidden">
          {/* Desktop grid */}
          <div className="hidden lg:block overflow-x-auto">
            <div className="grid grid-cols-7 min-w-[900px]">
              {weekDays.map((day, i) => {
                const dayStr = formatDate(day);
                const dayShifts = shifts.filter(s => s.date === dayStr);
                const isToday = formatDate(new Date()) === dayStr;
                const dayCost = dailyCosts[i];

                return (
                  <div key={i} className={`border-r border-slate-800 last:border-r-0 ${isToday ? 'bg-indigo-950/20' : ''}`}>
                    {/* Day header */}
                    <div className={`px-3 py-2.5 border-b border-slate-800 text-center ${isToday ? 'bg-indigo-900/30' : 'bg-slate-800/40'}`}>
                      <div className="text-xs font-medium text-slate-500 uppercase">{JOURS[i]}</div>
                      <div className={`text-sm font-bold ${isToday ? 'text-indigo-400' : 'text-slate-200'}`}>
                        {day.getDate()}/{(day.getMonth() + 1).toString().padStart(2, '0')}
                      </div>
                      <div className="text-[10px] text-slate-500 mt-0.5">{dayCost.toFixed(0)} EUR</div>
                    </div>
                    {/* Shift zones */}
                    {SHIFT_TYPES.map(st => {
                      const zoneShifts = dayShifts.filter(s => getShiftType(s.start) === st.key);
                      return (
                        <div
                          key={st.key}
                          onDragOver={handleDragOver}
                          onDrop={() => handleDrop(dayStr, st.key)}
                          className={`border-b border-slate-800/50 last:border-b-0 min-h-[60px] p-1.5 transition ${dragEmployee ? 'bg-slate-800/20 hover:bg-slate-700/30' : ''}`}
                        >
                          <div className={`text-[9px] font-medium uppercase tracking-wider mb-1 ${st.color}`}>
                            {st.label} ({st.start}-{st.end})
                          </div>
                          <div className="space-y-1">
                            {zoneShifts
                              .sort((a, b) => a.start.localeCompare(b.start))
                              .map(s => {
                                const emp = employees.find(e => e.id === s.employeeId);
                                if (!emp) return null;
                                return (
                                  <div
                                    key={s.id}
                                    className="rounded-md p-1.5 text-xs cursor-pointer hover:brightness-110 transition group relative border"
                                    style={{
                                      backgroundColor: emp.couleur + '20',
                                      borderColor: emp.couleur + '40',
                                    }}
                                    onClick={() => openEditShift(s)}
                                  >
                                    <div className="font-semibold text-white truncate">{emp.prenom} {(emp.nom || '').charAt(0)}.</div>
                                    <div className="text-[10px] font-mono text-slate-400">{s.start}-{s.end}</div>
                                    <button
                                      onClick={e => { e.stopPropagation(); deleteShift(s.id); }}
                                      className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 p-0.5 rounded bg-slate-900/80 hover:bg-red-900/60 transition"
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
                        className="w-full py-1.5 border border-dashed border-slate-700 rounded-lg text-slate-500 hover:border-indigo-500 hover:text-indigo-400 transition flex items-center justify-center gap-1 text-xs"
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
            <div className="flex items-center justify-between px-4 py-3 border-b border-slate-800 bg-slate-800/40">
              <button
                onClick={() => setSelectedDayIdx(prev => (prev - 1 + 7) % 7)}
                className="p-2 rounded-lg hover:bg-slate-700 transition"
              >
                <ChevronLeft className="w-5 h-5 text-slate-300" />
              </button>
              <div className="text-center">
                <div className="text-xs font-medium text-slate-400 uppercase">{JOURS_FULL[selectedDayIdx]}</div>
                <div className="text-sm font-semibold text-white">
                  {weekDays[selectedDayIdx].getDate()}/{(weekDays[selectedDayIdx].getMonth() + 1).toString().padStart(2, '0')}
                </div>
              </div>
              <button
                onClick={() => setSelectedDayIdx(prev => (prev + 1) % 7)}
                className="p-2 rounded-lg hover:bg-slate-700 transition"
              >
                <ChevronRight className="w-5 h-5 text-slate-300" />
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
        <div className="bg-slate-900/50 border border-slate-800 rounded-2xl overflow-hidden">
          <div className="flex items-center justify-between px-5 py-3 border-b border-slate-800 bg-slate-800/40">
            <button
              onClick={() => setSelectedDayIdx(prev => (prev - 1 + 7) % 7)}
              className="p-2 rounded-lg hover:bg-slate-700 transition"
            >
              <ChevronLeft className="w-5 h-5 text-slate-300" />
            </button>
            <div className="text-center">
              <div className="text-xs font-medium text-slate-400 uppercase">{JOURS_FULL[selectedDayIdx]}</div>
              <div className="text-lg font-bold text-white">
                {weekDays[selectedDayIdx].toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}
              </div>
            </div>
            <button
              onClick={() => setSelectedDayIdx(prev => (prev + 1) % 7)}
              className="p-2 rounded-lg hover:bg-slate-700 transition"
            >
              <ChevronRight className="w-5 h-5 text-slate-300" />
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
      <div className="bg-slate-900/50 border border-slate-800 rounded-2xl overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-800 flex items-center justify-between">
          <h3 className="font-semibold text-white flex items-center gap-2">
            <Users className="w-4 h-4 text-indigo-400" /> Equipe ({employees.length})
          </h3>
          <button onClick={openAddEmployee} className="text-xs font-medium text-indigo-400 hover:underline flex items-center gap-1">
            <UserPlus className="w-3.5 h-3.5" /> Ajouter
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-slate-800/60">
                <th className="px-4 py-2.5 text-left text-xs font-medium text-slate-400 uppercase">Employe</th>
                <th className="px-4 py-2.5 text-left text-xs font-medium text-slate-400 uppercase">Role</th>
                <th className="px-4 py-2.5 text-right text-xs font-medium text-slate-400 uppercase">Taux</th>
                <th className="px-4 py-2.5 text-right text-xs font-medium text-slate-400 uppercase">Contrat</th>
                <th className="px-4 py-2.5 text-right text-xs font-medium text-slate-400 uppercase">Heures/sem</th>
                <th className="px-4 py-2.5 text-center text-xs font-medium text-slate-400 uppercase">Statut</th>
                <th className="px-4 py-2.5 text-center text-xs font-medium text-slate-400 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {employees.map(emp => {
                const hours = employeeWeeklyHours.get(emp.id) || 0;
                const isOver35 = hours > 35;
                const isOver48 = hours > 48;
                return (
                  <tr key={emp.id} className="hover:bg-slate-800/30 transition">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: emp.couleur }} />
                        <span className="font-medium text-white">{emp.prenom} {emp.nom}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className="px-2 py-0.5 rounded-full text-xs font-medium" style={{ backgroundColor: emp.couleur + '20', color: emp.couleur }}>
                        {ROLE_LABELS[emp.role]}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right text-slate-300">{emp.tauxHoraire.toFixed(2)} EUR/h</td>
                    <td className="px-4 py-3 text-right text-slate-300">{emp.heuresContrat}h</td>
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
                          Heures sup
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                          OK
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-center">
                      <div className="flex items-center justify-center gap-1">
                        <button onClick={() => openEditEmployee(emp)} className="p-1.5 rounded hover:bg-slate-700 transition">
                          <Edit className="w-3.5 h-3.5 text-slate-400" />
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
      <div className="bg-slate-900/50 border border-slate-800 rounded-2xl overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-800">
          <h3 className="font-semibold text-white flex items-center gap-2">
            <Clock className="w-4 h-4 text-amber-400" /> Recapitulatif hebdomadaire
          </h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-slate-800/60">
                <th className="px-4 py-2.5 text-left text-xs font-medium text-slate-400 uppercase">Employe</th>
                {JOURS.map(j => (
                  <th key={j} className="px-3 py-2.5 text-center text-xs font-medium text-slate-400 uppercase">{j}</th>
                ))}
                <th className="px-3 py-2.5 text-center text-xs font-medium text-slate-400 uppercase">Total</th>
                <th className="px-4 py-2.5 text-right text-xs font-medium text-slate-400 uppercase">Cout</th>
                <th className="px-3 py-2.5 text-center text-xs font-medium text-slate-400 uppercase">Alerte</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {summaryRows.map(row => {
                const isOver35 = row.total > 35;
                const isOver48 = row.total > 48;
                return (
                  <tr key={row.emp.id} className="hover:bg-slate-800/30 transition">
                    <td className="px-4 py-2.5 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: row.emp.couleur }} />
                        <span className="font-medium text-white">{row.emp.prenom} {(row.emp.nom || '').charAt(0)}.</span>
                      </div>
                    </td>
                    {row.days.map((h, i) => (
                      <td key={i} className={`px-3 py-2.5 text-center text-xs ${h > 0 ? 'text-slate-200 font-medium' : 'text-slate-600'}`}>
                        {h > 0 ? `${h}h` : '-'}
                      </td>
                    ))}
                    <td className={`px-3 py-2.5 text-center font-bold ${isOver48 ? 'text-red-400' : isOver35 ? 'text-amber-400' : 'text-white'}`}>
                      {row.total > 0 ? `${row.total}h` : '-'}
                    </td>
                    <td className="px-4 py-2.5 text-right font-medium text-slate-300">
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
              <tr className="bg-slate-800/60 font-semibold">
                <td className="px-4 py-2.5 text-white">Total</td>
                {totalRow.days.map((h, i) => (
                  <td key={i} className="px-3 py-2.5 text-center text-xs text-slate-200">
                    {h > 0 ? `${h}h` : '-'}
                  </td>
                ))}
                <td className="px-3 py-2.5 text-center text-indigo-400">{totalRow.total}h</td>
                <td className="px-4 py-2.5 text-right text-indigo-400">{totalRow.cost.toFixed(0)} EUR</td>
                <td />
              </tr>
              {/* Daily cost row */}
              <tr className="bg-slate-800/40">
                <td className="px-4 py-2.5 text-slate-400 text-xs">Cout/jour</td>
                {dailyCosts.map((c, i) => (
                  <td key={i} className="px-3 py-2.5 text-center text-xs text-slate-400">
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

      {/* ── Employee Modal ─────────────────────────────────────────────── */}
      <Modal
        isOpen={showEmployeeModal}
        onClose={() => setShowEmployeeModal(false)}
        title={editEmployee ? 'Modifier employe' : 'Ajouter un employe'}
      >
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">Prenom</label>
              <input
                type="text"
                value={empForm.prenom}
                onChange={e => setEmpForm(f => ({ ...f, prenom: e.target.value }))}
                className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm"
                placeholder="Ex: Marie"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">Nom</label>
              <input
                type="text"
                value={empForm.nom}
                onChange={e => setEmpForm(f => ({ ...f, nom: e.target.value }))}
                className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm"
                placeholder="Ex: Dupont"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">Role</label>
            <select
              value={empForm.role}
              onChange={e => setEmpForm(f => ({ ...f, role: e.target.value as EmployeeRole }))}
              className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm"
            >
              {ROLES.map(r => (
                <option key={r} value={r}>{ROLE_LABELS[r]}</option>
              ))}
            </select>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">Taux horaire (EUR/h)</label>
              <input
                type="number"
                step="0.01"
                min="0"
                value={empForm.tauxHoraire}
                onChange={e => setEmpForm(f => ({ ...f, tauxHoraire: e.target.value }))}
                className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm"
                placeholder="Ex: 14.00"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">Heures contrat/sem</label>
              <input
                type="number"
                min="0"
                value={empForm.heuresContrat}
                onChange={e => setEmpForm(f => ({ ...f, heuresContrat: e.target.value }))}
                className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm"
                placeholder="Ex: 35"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">Couleur</label>
            <div className="flex gap-2 flex-wrap">
              {EMPLOYEE_COLORS.map(c => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setEmpForm(f => ({ ...f, couleur: c }))}
                  className={`w-8 h-8 rounded-full border-2 transition ${empForm.couleur === c ? 'border-white scale-110' : 'border-transparent opacity-60 hover:opacity-100'}`}
                  style={{ backgroundColor: c }}
                />
              ))}
            </div>
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <button onClick={() => setShowEmployeeModal(false)} className="px-4 py-2 text-sm font-medium text-slate-300 hover:bg-slate-700 rounded-lg transition">
              Annuler
            </button>
            <button onClick={saveEmployee} className="px-4 py-2 text-sm font-medium bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition">
              {editEmployee ? 'Modifier' : 'Ajouter'}
            </button>
          </div>
        </div>
      </Modal>

      {/* ── Shift Modal ────────────────────────────────────────────────── */}
      <Modal
        isOpen={showShiftModal}
        onClose={() => setShowShiftModal(false)}
        title={editShift ? 'Modifier creneau' : 'Ajouter un creneau'}
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">Employe</label>
            <select
              value={shiftForm.employeeId}
              onChange={e => setShiftForm(f => ({ ...f, employeeId: e.target.value }))}
              className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm"
            >
              <option value="">-- Selectionner --</option>
              {employees.map(emp => (
                <option key={emp.id} value={emp.id}>{emp.prenom} {emp.nom} ({ROLE_LABELS[emp.role]})</option>
              ))}
            </select>
          </div>
          {/* Quick shift type buttons */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">Type de service</label>
            <div className="flex gap-2">
              {SHIFT_TYPES.map(st => (
                <button
                  key={st.key}
                  type="button"
                  onClick={() => setShiftForm(f => ({ ...f, start: st.start, end: st.end }))}
                  className={`flex-1 py-2 rounded-lg text-xs font-medium border transition ${
                    shiftForm.start === st.start && shiftForm.end === st.end
                      ? st.bg + ' text-white'
                      : 'bg-slate-800 border-slate-700 text-slate-400 hover:border-slate-600'
                  }`}
                >
                  {st.label}<br />{st.start}-{st.end}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">Date</label>
            <input
              type="date"
              value={shiftForm.date}
              onChange={e => setShiftForm(f => ({ ...f, date: e.target.value }))}
              className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">Heure debut</label>
              <input
                type="time"
                value={shiftForm.start}
                onChange={e => setShiftForm(f => ({ ...f, start: e.target.value }))}
                className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">Heure fin</label>
              <input
                type="time"
                value={shiftForm.end}
                onChange={e => setShiftForm(f => ({ ...f, end: e.target.value }))}
                className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">Poste</label>
            <select
              value={shiftForm.poste}
              onChange={e => setShiftForm(f => ({ ...f, poste: e.target.value as Shift['poste'] }))}
              className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm"
            >
              {POSTES.map(p => (
                <option key={p.value} value={p.value}>{p.label}</option>
              ))}
            </select>
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <button onClick={() => setShowShiftModal(false)} className="px-4 py-2 text-sm font-medium text-slate-300 hover:bg-slate-700 rounded-lg transition">
              Annuler
            </button>
            {editShift && (
              <button
                onClick={() => { deleteShift(editShift.id); setShowShiftModal(false); }}
                className="px-4 py-2 text-sm font-medium bg-red-600 text-white rounded-xl hover:bg-red-700 transition"
              >
                Supprimer
              </button>
            )}
            <button onClick={saveShift} className="px-4 py-2 text-sm font-medium bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition">
              {editShift ? 'Modifier' : 'Ajouter'}
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
    <div className={`bg-slate-900/50 rounded-2xl p-4 border ${alert ? 'border-red-700/50' : 'border-slate-800'}`}>
      <div className="flex items-center gap-3">
        <div className={`p-2 rounded-lg ${alert ? 'bg-red-900/30' : 'bg-slate-800'}`}>
          {icon}
        </div>
        <div>
          <div className="text-xs text-slate-400">{label}</div>
          <div className={`text-xl font-bold ${alert ? 'text-red-400' : 'text-white'}`}>{value}</div>
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
  const dayStr = formatDate(day);
  const dayShifts = shifts.filter(s => s.date === dayStr);

  return (
    <div className="p-3 space-y-3">
      {SHIFT_TYPES.map(st => {
        const zoneShifts = dayShifts.filter(s => getShiftType(s.start) === st.key);
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
                .sort((a, b) => a.start.localeCompare(b.start))
                .map(s => {
                  const emp = employees.find(e => e.id === s.employeeId);
                  if (!emp) return null;
                  return (
                    <div
                      key={s.id}
                      className="rounded-lg p-2.5 bg-slate-900/60 border border-slate-700 cursor-pointer hover:border-slate-600 transition group relative"
                      onClick={() => onEditShift(s)}
                    >
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: emp.couleur }} />
                        <span className="font-semibold text-white text-sm">{emp.prenom} {emp.nom}</span>
                      </div>
                      <div className="text-xs text-slate-400 mt-0.5">{ROLE_LABELS[emp.role]} -- {s.start} a {s.end}</div>
                      <button
                        onClick={e => { e.stopPropagation(); onDeleteShift(s.id); }}
                        className="absolute top-2 right-2 p-1 rounded bg-slate-800 hover:bg-red-900/40 transition"
                      >
                        <X className="w-3.5 h-3.5 text-red-400" />
                      </button>
                    </div>
                  );
                })}
              {zoneShifts.length === 0 && (
                <p className="text-center text-xs text-slate-500 py-2">Aucun creneau</p>
              )}
            </div>
            <button
              onClick={() => onAddShift(dayStr, st.key)}
              className="w-full mt-2 py-2 border border-dashed border-slate-600 rounded-lg text-slate-500 hover:border-indigo-500 hover:text-indigo-400 transition flex items-center justify-center gap-1 text-xs"
            >
              <Plus className="w-3.5 h-3.5" /> Ajouter
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
  const dayStr = formatDate(day);
  const dayShifts = shifts.filter(s => s.date === dayStr);
  const totalHours = dayShifts.reduce((sum, s) => sum + shiftHours(s.start, s.end), 0);
  const totalCost = dayShifts.reduce((sum, s) => {
    const emp = employees.find(e => e.id === s.employeeId);
    return sum + (emp ? shiftHours(s.start, s.end) * emp.tauxHoraire : 0);
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
      <div className="grid grid-cols-3 gap-3">
        <div className="bg-slate-800/60 rounded-xl p-3 text-center border border-slate-700">
          <div className="text-xs text-slate-400">Employes presents</div>
          <div className="text-2xl font-bold text-white">{presenceMap.size}</div>
        </div>
        <div className="bg-slate-800/60 rounded-xl p-3 text-center border border-slate-700">
          <div className="text-xs text-slate-400">Heures totales</div>
          <div className="text-2xl font-bold text-white">{totalHours.toFixed(0)}h</div>
        </div>
        <div className="bg-slate-800/60 rounded-xl p-3 text-center border border-slate-700">
          <div className="text-xs text-slate-400">Cout du jour</div>
          <div className="text-2xl font-bold text-emerald-400">{totalCost.toFixed(0)} EUR</div>
        </div>
      </div>

      {/* Shift type sections */}
      {SHIFT_TYPES.map(st => {
        const zoneShifts = dayShifts.filter(s => getShiftType(s.start) === st.key);
        return (
          <div key={st.key}>
            <div className={`flex items-center gap-2 mb-3`}>
              <div className={`w-3 h-3 rounded-full ${st.key === 'matin' ? 'bg-amber-400' : st.key === 'midi' ? 'bg-blue-400' : 'bg-purple-400'}`} />
              <h4 className={`font-semibold ${st.color}`}>{st.label} ({st.start} - {st.end})</h4>
              <span className="text-xs text-slate-500">{zoneShifts.length} creneau(x)</span>
            </div>
            {zoneShifts.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {zoneShifts
                  .sort((a, b) => a.start.localeCompare(b.start))
                  .map(s => {
                    const emp = employees.find(e => e.id === s.employeeId);
                    if (!emp) return null;
                    const hours = shiftHours(s.start, s.end);
                    return (
                      <div
                        key={s.id}
                        className="rounded-xl p-4 border border-slate-700 bg-slate-800/40 cursor-pointer hover:border-slate-600 transition group relative"
                        onClick={() => onEditShift(s)}
                      >
                        <div className="flex items-center gap-3 mb-2">
                          <div className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm" style={{ backgroundColor: emp.couleur }}>
                            {(emp.prenom || '').charAt(0)}{(emp.nom || '').charAt(0)}
                          </div>
                          <div>
                            <div className="font-semibold text-white">{emp.prenom} {emp.nom}</div>
                            <div className="text-xs text-slate-400">{ROLE_LABELS[emp.role]}</div>
                          </div>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span className="font-mono text-slate-300">{s.start} - {s.end}</span>
                          <span className="text-slate-400">{hours}h -- {(hours * emp.tauxHoraire).toFixed(0)} EUR</span>
                        </div>
                        <button
                          onClick={e => { e.stopPropagation(); onDeleteShift(s.id); }}
                          className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 p-1.5 rounded-lg bg-slate-900/80 hover:bg-red-900/40 transition"
                        >
                          <Trash2 className="w-3.5 h-3.5 text-red-400" />
                        </button>
                      </div>
                    );
                  })}
              </div>
            ) : (
              <p className="text-sm text-slate-500 py-3 text-center bg-slate-800/20 rounded-xl border border-dashed border-slate-700">
                Aucun creneau
              </p>
            )}
            <button
              onClick={() => onAddShift(dayStr, st.key)}
              className="mt-2 w-full py-2 border border-dashed border-slate-700 rounded-xl text-slate-500 hover:border-indigo-500 hover:text-indigo-400 transition flex items-center justify-center gap-1 text-sm"
            >
              <Plus className="w-4 h-4" /> Ajouter un creneau {st.label.toLowerCase()}
            </button>
          </div>
        );
      })}

      {/* Presence summary */}
      <div>
        <h4 className="font-semibold text-white flex items-center gap-2 mb-3">
          <Eye className="w-4 h-4 text-indigo-400" /> Presences du jour
        </h4>
        <div className="space-y-2">
          {employees.map(emp => {
            const empShifts = presenceMap.get(emp.id);
            const isPresent = !!empShifts && empShifts.length > 0;
            const empHours = empShifts ? empShifts.reduce((sum, s) => sum + shiftHours(s.start, s.end), 0) : 0;
            return (
              <div
                key={emp.id}
                className={`flex items-center justify-between px-4 py-2.5 rounded-xl border transition ${
                  isPresent ? 'border-slate-700 bg-slate-800/40' : 'border-slate-800/50 bg-slate-900/30 opacity-50'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-2.5 h-2.5 rounded-full ${isPresent ? 'bg-emerald-400' : 'bg-slate-600'}`} />
                  <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: emp.couleur }} />
                  <span className={`text-sm font-medium ${isPresent ? 'text-white' : 'text-slate-500'}`}>{emp.prenom} {emp.nom}</span>
                  <span className="text-xs text-slate-500">{ROLE_LABELS[emp.role]}</span>
                </div>
                <div className="text-sm">
                  {isPresent ? (
                    <span className="text-slate-300">
                      {empShifts!.map(s => `${s.start}-${s.end}`).join(', ')} -- <span className="font-semibold">{empHours}h</span>
                    </span>
                  ) : (
                    <span className="text-slate-600">Absent</span>
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
