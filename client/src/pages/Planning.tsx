import { useState, useMemo } from 'react';
import {
  CalendarDays, Clock, Users, Euro, Plus, ChevronLeft, ChevronRight,
  Edit, Trash2, Loader2, X, UserPlus
} from 'lucide-react';
import { useToast } from '../hooks/useToast';
import Modal from '../components/Modal';

const API = '';

function authHeaders() {
  const token = localStorage.getItem('token');
  return { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' };
}

// ── Types ──────────────────────────────────────────────────────────────

interface Employee {
  id: number;
  nom: string;
  prenom: string;
  role: EmployeeRole;
  tauxHoraire: number;
  heuresContrat: number;
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

const ROLES: EmployeeRole[] = ['Chef', 'Commis', 'Serveur', 'Serveuse', 'Plongeur', 'Plongeuse', 'Patissier', 'Patissiere'];

const ROLE_LABELS: Record<EmployeeRole, string> = {
  Chef: 'Chef',
  Commis: 'Commis',
  Serveur: 'Serveur',
  Serveuse: 'Serveuse',
  Plongeur: 'Plongeur',
  Plongeuse: 'Plongeuse',
  Patissier: 'P\u00e2tissier',
  Patissiere: 'P\u00e2tissi\u00e8re',
};

const ROLE_COLORS: Record<string, { bg: string; text: string; border: string }> = {
  Chef:        { bg: 'bg-red-100 dark:bg-red-900/40',    text: 'text-red-700 dark:text-red-300',    border: 'border-red-300 dark:border-red-700' },
  Commis:      { bg: 'bg-orange-100 dark:bg-orange-900/40', text: 'text-orange-700 dark:text-orange-300', border: 'border-orange-300 dark:border-orange-700' },
  Serveur:     { bg: 'bg-blue-100 dark:bg-blue-900/40',   text: 'text-blue-700 dark:text-blue-300',   border: 'border-blue-300 dark:border-blue-700' },
  Serveuse:    { bg: 'bg-blue-100 dark:bg-blue-900/40',   text: 'text-blue-700 dark:text-blue-300',   border: 'border-blue-300 dark:border-blue-700' },
  Plongeur:    { bg: 'bg-slate-100 dark:bg-slate-700/40', text: 'text-slate-700 dark:text-slate-300', border: 'border-slate-300 dark:border-slate-600' },
  Plongeuse:   { bg: 'bg-slate-100 dark:bg-slate-700/40', text: 'text-slate-700 dark:text-slate-300', border: 'border-slate-300 dark:border-slate-600' },
  Patissier:   { bg: 'bg-pink-100 dark:bg-pink-900/40',   text: 'text-pink-700 dark:text-pink-300',   border: 'border-pink-300 dark:border-pink-700' },
  Patissiere:  { bg: 'bg-pink-100 dark:bg-pink-900/40',   text: 'text-pink-700 dark:text-pink-300',   border: 'border-pink-300 dark:border-pink-700' },
};

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

function formatDateFr(d: Date): string {
  return d.toLocaleDateString('fr-FR', { day: 'numeric', month: 'long' });
}

function shiftHours(start: string, end: string): number {
  const [sh, sm] = start.split(':').map(Number);
  const [eh, em] = end.split(':').map(Number);
  return Math.max(0, (eh * 60 + em - sh * 60 - sm) / 60);
}

// ── Sample data ────────────────────────────────────────────────────────

function buildSampleData() {
  const today = new Date();
  const monday = getMonday(today);

  const employees: Employee[] = [
    { id: 1, nom: 'Benali', prenom: 'Youssef', role: 'Chef', tauxHoraire: 25, heuresContrat: 39 },
    { id: 2, nom: 'Kaddouri', prenom: 'Ali', role: 'Commis', tauxHoraire: 14, heuresContrat: 35 },
    { id: 3, nom: 'Dupont', prenom: 'Marie', role: 'Serveuse', tauxHoraire: 12, heuresContrat: 35 },
    { id: 4, nom: 'Bouzid', prenom: 'Ahmed', role: 'Plongeur', tauxHoraire: 11.65, heuresContrat: 35 },
    { id: 5, nom: 'Moreau', prenom: 'Sofia', role: 'Patissiere', tauxHoraire: 16, heuresContrat: 35 },
  ];

  const shifts: Shift[] = [
    { id: 1, employeeId: 1, date: formatDate(monday),         start: '08:00', end: '15:00', poste: 'cuisine' },
    { id: 2, employeeId: 1, date: formatDate(addDays(monday, 1)), start: '08:00', end: '15:00', poste: 'cuisine' },
    { id: 3, employeeId: 1, date: formatDate(addDays(monday, 2)), start: '08:00', end: '15:00', poste: 'cuisine' },
    { id: 4, employeeId: 1, date: formatDate(addDays(monday, 3)), start: '15:00', end: '23:00', poste: 'cuisine' },
    { id: 5, employeeId: 1, date: formatDate(addDays(monday, 4)), start: '15:00', end: '23:00', poste: 'cuisine' },
    { id: 6, employeeId: 2, date: formatDate(monday),         start: '09:00', end: '17:00', poste: 'cuisine' },
    { id: 7, employeeId: 2, date: formatDate(addDays(monday, 1)), start: '09:00', end: '17:00', poste: 'cuisine' },
    { id: 8, employeeId: 2, date: formatDate(addDays(monday, 2)), start: '09:00', end: '17:00', poste: 'cuisine' },
    { id: 9, employeeId: 2, date: formatDate(addDays(monday, 3)), start: '09:00', end: '17:00', poste: 'cuisine' },
    { id: 10, employeeId: 2, date: formatDate(addDays(monday, 4)), start: '09:00', end: '14:00', poste: 'cuisine' },
    { id: 11, employeeId: 3, date: formatDate(monday),         start: '11:00', end: '15:00', poste: 'salle' },
    { id: 12, employeeId: 3, date: formatDate(addDays(monday, 1)), start: '11:00', end: '15:00', poste: 'salle' },
    { id: 13, employeeId: 3, date: formatDate(addDays(monday, 2)), start: '18:00', end: '23:00', poste: 'salle' },
    { id: 14, employeeId: 3, date: formatDate(addDays(monday, 4)), start: '11:00', end: '15:00', poste: 'salle' },
    { id: 15, employeeId: 3, date: formatDate(addDays(monday, 5)), start: '18:00', end: '23:00', poste: 'salle' },
    { id: 16, employeeId: 4, date: formatDate(monday),         start: '11:00', end: '16:00', poste: 'plonge' },
    { id: 17, employeeId: 4, date: formatDate(addDays(monday, 1)), start: '11:00', end: '16:00', poste: 'plonge' },
    { id: 18, employeeId: 4, date: formatDate(addDays(monday, 2)), start: '11:00', end: '16:00', poste: 'plonge' },
    { id: 19, employeeId: 4, date: formatDate(addDays(monday, 3)), start: '18:00', end: '23:00', poste: 'plonge' },
    { id: 20, employeeId: 4, date: formatDate(addDays(monday, 4)), start: '18:00', end: '23:00', poste: 'plonge' },
    { id: 21, employeeId: 5, date: formatDate(monday),         start: '06:00', end: '14:00', poste: 'cuisine' },
    { id: 22, employeeId: 5, date: formatDate(addDays(monday, 1)), start: '06:00', end: '14:00', poste: 'cuisine' },
    { id: 23, employeeId: 5, date: formatDate(addDays(monday, 3)), start: '06:00', end: '14:00', poste: 'cuisine' },
    { id: 24, employeeId: 5, date: formatDate(addDays(monday, 4)), start: '06:00', end: '14:00', poste: 'cuisine' },
  ];

  return { employees, shifts };
}

// ── Component ──────────────────────────────────────────────────────────

export default function Planning() {
  const { showToast } = useToast();
  const sample = useMemo(() => buildSampleData(), []);

  const [employees, setEmployees] = useState<Employee[]>(sample.employees);
  const [shifts, setShifts] = useState<Shift[]>(sample.shifts);
  const [weekStart, setWeekStart] = useState<Date>(() => getMonday(new Date()));
  const [nextId, setNextId] = useState(100);

  // Modals
  const [showEmployeeModal, setShowEmployeeModal] = useState(false);
  const [showShiftModal, setShowShiftModal] = useState(false);
  const [editEmployee, setEditEmployee] = useState<Employee | null>(null);
  const [editShift, setEditShift] = useState<Shift | null>(null);
  const [shiftDayPrefill, setShiftDayPrefill] = useState<string | null>(null);

  // Employee form
  const emptyEmpForm = { nom: '', prenom: '', role: 'Commis' as EmployeeRole, tauxHoraire: '', heuresContrat: '' };
  const [empForm, setEmpForm] = useState(emptyEmpForm);

  // Shift form
  const emptyShiftForm = { employeeId: '', date: '', start: '', end: '', poste: 'cuisine' as Shift['poste'] };
  const [shiftForm, setShiftForm] = useState(emptyShiftForm);

  // Simulated weekly revenue for ratio
  const weeklyRevenue = 12500;

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

  // ── Employee CRUD ──────────────────────────────────────────────────

  function openAddEmployee() {
    setEditEmployee(null);
    setEmpForm(emptyEmpForm);
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
    });
    setShowEmployeeModal(true);
  }

  function saveEmployee() {
    if (!empForm.nom.trim() || !empForm.prenom.trim() || !empForm.tauxHoraire || !empForm.heuresContrat) {
      showToast('Veuillez remplir tous les champs', 'error');
      return;
    }
    if (editEmployee) {
      setEmployees(prev => prev.map(e =>
        e.id === editEmployee.id
          ? { ...e, nom: empForm.nom, prenom: empForm.prenom, role: empForm.role, tauxHoraire: parseFloat(empForm.tauxHoraire), heuresContrat: parseFloat(empForm.heuresContrat) }
          : e
      ));
      showToast('Employ\u00e9 modifi\u00e9', 'success');
    } else {
      const id = nextId;
      setNextId(n => n + 1);
      setEmployees(prev => [...prev, {
        id,
        nom: empForm.nom,
        prenom: empForm.prenom,
        role: empForm.role,
        tauxHoraire: parseFloat(empForm.tauxHoraire),
        heuresContrat: parseFloat(empForm.heuresContrat),
      }]);
      showToast('Employ\u00e9 ajout\u00e9', 'success');
    }
    setShowEmployeeModal(false);
  }

  function deleteEmployee(id: number) {
    setEmployees(prev => prev.filter(e => e.id !== id));
    setShifts(prev => prev.filter(s => s.employeeId !== id));
    showToast('Employ\u00e9 supprim\u00e9', 'success');
  }

  // ── Shift CRUD ────────────────────────────────────────────────────

  function openAddShift(day?: string) {
    setEditShift(null);
    setShiftForm({ ...emptyShiftForm, date: day || '' });
    setShiftDayPrefill(day || null);
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

  function saveShift() {
    if (!shiftForm.employeeId || !shiftForm.date || !shiftForm.start || !shiftForm.end) {
      showToast('Veuillez remplir tous les champs', 'error');
      return;
    }
    if (shiftForm.start >= shiftForm.end) {
      showToast('L\'heure de fin doit \u00eatre apr\u00e8s l\'heure de d\u00e9but', 'error');
      return;
    }
    const empId = parseInt(shiftForm.employeeId);
    // Overlap check
    const overlap = shifts.some(s => {
      if (editShift && s.id === editShift.id) return false;
      if (s.employeeId !== empId || s.date !== shiftForm.date) return false;
      return s.start < shiftForm.end && s.end > shiftForm.start;
    });
    if (overlap) {
      showToast('Chevauchement d\u00e9tect\u00e9 pour cet employ\u00e9 ce jour', 'error');
      return;
    }

    if (editShift) {
      setShifts(prev => prev.map(s =>
        s.id === editShift.id
          ? { ...s, employeeId: empId, date: shiftForm.date, start: shiftForm.start, end: shiftForm.end, poste: shiftForm.poste }
          : s
      ));
      showToast('Cr\u00e9neau modifi\u00e9', 'success');
    } else {
      const id = nextId;
      setNextId(n => n + 1);
      setShifts(prev => [...prev, {
        id,
        employeeId: empId,
        date: shiftForm.date,
        start: shiftForm.start,
        end: shiftForm.end,
        poste: shiftForm.poste,
      }]);
      showToast('Cr\u00e9neau ajout\u00e9', 'success');
    }
    setShowShiftModal(false);
  }

  function deleteShift(id: number) {
    setShifts(prev => prev.filter(s => s.id !== id));
    showToast('Cr\u00e9neau supprim\u00e9', 'success');
  }

  // ── Summary table data ────────────────────────────────────────────

  const summaryRows = useMemo(() => {
    return employees.map(emp => {
      const days = weekDayStrings.map(dayStr => {
        const dayShifts = weekShifts.filter(s => s.employeeId === emp.id && s.date === dayStr);
        const hours = dayShifts.reduce((sum, s) => sum + shiftHours(s.start, s.end), 0);
        return hours;
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
          <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
            <CalendarDays className="w-7 h-7 text-indigo-500" />
            Planning du personnel
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Gestion des horaires et planification hebdomadaire
          </p>
        </div>
        <div className="flex gap-2">
          <button onClick={openAddEmployee} className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition text-sm font-medium">
            <UserPlus className="w-4 h-4" /> Ajouter employ\u00e9
          </button>
          <button onClick={() => openAddShift()} className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition text-sm font-medium">
            <Plus className="w-4 h-4" /> Ajouter cr\u00e9neau
          </button>
        </div>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <SummaryCard icon={<Users className="w-5 h-5 text-indigo-500" />} label="Employ\u00e9s actifs" value={String(employees.length)} />
        <SummaryCard icon={<Clock className="w-5 h-5 text-amber-500" />} label="Heures cette semaine" value={`${totalHoursWeek.toFixed(1)}h`} />
        <SummaryCard icon={<Euro className="w-5 h-5 text-emerald-500" />} label="Co\u00fbt MO semaine" value={`${laborCost.toFixed(0)} \u20ac`} />
        <SummaryCard
          icon={<CalendarDays className="w-5 h-5 text-rose-500" />}
          label="Ratio MO/CA"
          value={`${laborRatio.toFixed(1)}%`}
          alert={laborRatio > 30}
          subtitle={laborRatio > 30 ? 'Objectif : < 30%' : 'OK'}
        />
      </div>

      {/* Week navigation */}
      <div className="flex items-center justify-between bg-white dark:bg-slate-800 rounded-xl p-4 shadow-sm border border-slate-200 dark:border-slate-700">
        <button onClick={goPrev} className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition">
          <ChevronLeft className="w-5 h-5 text-slate-600 dark:text-slate-300" />
        </button>
        <div className="flex items-center gap-3">
          <button onClick={goThisWeek} className="px-3 py-1 text-xs font-medium rounded-full bg-indigo-100 dark:bg-indigo-900/40 text-indigo-700 dark:text-indigo-300 hover:bg-indigo-200 dark:hover:bg-indigo-800/50 transition">
            Cette semaine
          </button>
          <h2 className="text-lg font-semibold text-slate-800 dark:text-slate-100">{weekLabel}</h2>
        </div>
        <button onClick={goNext} className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition">
          <ChevronRight className="w-5 h-5 text-slate-600 dark:text-slate-300" />
        </button>
      </div>

      {/* Week view */}
      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-x-auto">
        <div className="grid grid-cols-7 min-w-[800px]">
          {weekDays.map((day, i) => {
            const dayStr = formatDate(day);
            const dayShifts = shifts.filter(s => s.date === dayStr);
            const isToday = formatDate(new Date()) === dayStr;

            return (
              <div key={i} className={`border-r border-slate-200 dark:border-slate-700 last:border-r-0 ${isToday ? 'bg-indigo-50/50 dark:bg-indigo-950/20' : ''}`}>
                {/* Day header */}
                <div className={`px-3 py-2 border-b border-slate-200 dark:border-slate-700 text-center ${isToday ? 'bg-indigo-100 dark:bg-indigo-900/30' : 'bg-slate-50 dark:bg-slate-800/80'}`}>
                  <div className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase">{JOURS[i]}</div>
                  <div className={`text-sm font-semibold ${isToday ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-700 dark:text-slate-200'}`}>
                    {day.getDate()}/{(day.getMonth() + 1).toString().padStart(2, '0')}
                  </div>
                </div>
                {/* Shifts */}
                <div className="p-2 space-y-1.5 min-h-[180px]">
                  {dayShifts
                    .sort((a, b) => a.start.localeCompare(b.start))
                    .map(s => {
                      const emp = employees.find(e => e.id === s.employeeId);
                      if (!emp) return null;
                      const colors = ROLE_COLORS[emp.role] || ROLE_COLORS.Commis;
                      return (
                        <div
                          key={s.id}
                          className={`rounded-lg p-1.5 text-xs border ${colors.bg} ${colors.border} cursor-pointer hover:shadow-md transition group relative`}
                          onClick={() => openEditShift(s)}
                        >
                          <div className={`font-semibold truncate ${colors.text}`}>{emp.prenom} {emp.nom.charAt(0)}.</div>
                          <div className={`text-[10px] ${colors.text} opacity-75`}>{ROLE_LABELS[emp.role]}</div>
                          <div className={`text-[10px] font-mono ${colors.text}`}>{s.start} - {s.end}</div>
                          <button
                            onClick={e => { e.stopPropagation(); deleteShift(s.id); }}
                            className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 p-0.5 rounded bg-white/80 dark:bg-slate-900/80 hover:bg-red-100 dark:hover:bg-red-900/40 transition"
                          >
                            <X className="w-3 h-3 text-red-500" />
                          </button>
                        </div>
                      );
                    })}
                  <button
                    onClick={() => openAddShift(dayStr)}
                    className="w-full py-1.5 border border-dashed border-slate-300 dark:border-slate-600 rounded-lg text-slate-400 dark:text-slate-500 hover:border-indigo-400 hover:text-indigo-500 dark:hover:border-indigo-500 dark:hover:text-indigo-400 transition flex items-center justify-center gap-1 text-xs"
                  >
                    <Plus className="w-3 h-3" /> Ajouter
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Employee list */}
      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700">
        <div className="px-5 py-4 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between">
          <h3 className="font-semibold text-slate-800 dark:text-slate-100 flex items-center gap-2">
            <Users className="w-4 h-4 text-indigo-500" /> \u00c9quipe ({employees.length})
          </h3>
          <button onClick={openAddEmployee} className="text-xs font-medium text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1">
            <UserPlus className="w-3.5 h-3.5" /> Ajouter
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-800/60">
                <th className="px-4 py-2.5 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase">Employ\u00e9</th>
                <th className="px-4 py-2.5 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase">R\u00f4le</th>
                <th className="px-4 py-2.5 text-right text-xs font-medium text-slate-500 dark:text-slate-400 uppercase">Taux horaire</th>
                <th className="px-4 py-2.5 text-right text-xs font-medium text-slate-500 dark:text-slate-400 uppercase">Heures contrat</th>
                <th className="px-4 py-2.5 text-center text-xs font-medium text-slate-500 dark:text-slate-400 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
              {employees.map(emp => {
                const colors = ROLE_COLORS[emp.role] || ROLE_COLORS.Commis;
                return (
                  <tr key={emp.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/30 transition">
                    <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200">{emp.prenom} {emp.nom}</td>
                    <td className="px-4 py-3">
                      <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${colors.bg} ${colors.text}`}>
                        {ROLE_LABELS[emp.role]}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right text-slate-600 dark:text-slate-300">{emp.tauxHoraire.toFixed(2)} \u20ac/h</td>
                    <td className="px-4 py-3 text-right text-slate-600 dark:text-slate-300">{emp.heuresContrat}h/sem</td>
                    <td className="px-4 py-3 text-center">
                      <div className="flex items-center justify-center gap-1">
                        <button onClick={() => openEditEmployee(emp)} className="p-1.5 rounded hover:bg-slate-100 dark:hover:bg-slate-700 transition">
                          <Edit className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400" />
                        </button>
                        <button onClick={() => deleteEmployee(emp.id)} className="p-1.5 rounded hover:bg-red-50 dark:hover:bg-red-900/20 transition">
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
      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700">
        <div className="px-5 py-4 border-b border-slate-200 dark:border-slate-700">
          <h3 className="font-semibold text-slate-800 dark:text-slate-100 flex items-center gap-2">
            <Clock className="w-4 h-4 text-amber-500" /> R\u00e9capitulatif hebdomadaire
          </h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-800/60">
                <th className="px-4 py-2.5 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase">Employ\u00e9</th>
                {JOURS.map(j => (
                  <th key={j} className="px-3 py-2.5 text-center text-xs font-medium text-slate-500 dark:text-slate-400 uppercase">{j}</th>
                ))}
                <th className="px-3 py-2.5 text-center text-xs font-medium text-slate-500 dark:text-slate-400 uppercase">Total</th>
                <th className="px-4 py-2.5 text-right text-xs font-medium text-slate-500 dark:text-slate-400 uppercase">Co\u00fbt</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
              {summaryRows.map(row => (
                <tr key={row.emp.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/30 transition">
                  <td className="px-4 py-2.5 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">
                    {row.emp.prenom} {row.emp.nom.charAt(0)}.
                  </td>
                  {row.days.map((h, i) => (
                    <td key={i} className={`px-3 py-2.5 text-center text-xs ${h > 0 ? 'text-slate-700 dark:text-slate-200 font-medium' : 'text-slate-300 dark:text-slate-600'}`}>
                      {h > 0 ? `${h}h` : '-'}
                    </td>
                  ))}
                  <td className="px-3 py-2.5 text-center font-semibold text-slate-800 dark:text-slate-100">
                    {row.total > 0 ? `${row.total}h` : '-'}
                  </td>
                  <td className="px-4 py-2.5 text-right font-medium text-slate-700 dark:text-slate-200">
                    {row.cost > 0 ? `${row.cost.toFixed(0)} \u20ac` : '-'}
                  </td>
                </tr>
              ))}
              {/* Totals */}
              <tr className="bg-slate-50 dark:bg-slate-800/60 font-semibold">
                <td className="px-4 py-2.5 text-slate-800 dark:text-slate-100">Total</td>
                {totalRow.days.map((h, i) => (
                  <td key={i} className="px-3 py-2.5 text-center text-xs text-slate-700 dark:text-slate-200">
                    {h > 0 ? `${h}h` : '-'}
                  </td>
                ))}
                <td className="px-3 py-2.5 text-center text-indigo-600 dark:text-indigo-400">{totalRow.total}h</td>
                <td className="px-4 py-2.5 text-right text-indigo-600 dark:text-indigo-400">{totalRow.cost.toFixed(0)} \u20ac</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* ── Employee Modal ─────────────────────────────────────────────── */}
      <Modal
        isOpen={showEmployeeModal}
        onClose={() => setShowEmployeeModal(false)}
        title={editEmployee ? 'Modifier employ\u00e9' : 'Ajouter un employ\u00e9'}
      >
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Pr\u00e9nom</label>
              <input
                type="text"
                value={empForm.prenom}
                onChange={e => setEmpForm(f => ({ ...f, prenom: e.target.value }))}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm"
                placeholder="Ex: Marie"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Nom</label>
              <input
                type="text"
                value={empForm.nom}
                onChange={e => setEmpForm(f => ({ ...f, nom: e.target.value }))}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm"
                placeholder="Ex: Dupont"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">R\u00f4le</label>
            <select
              value={empForm.role}
              onChange={e => setEmpForm(f => ({ ...f, role: e.target.value as EmployeeRole }))}
              className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm"
            >
              {ROLES.map(r => (
                <option key={r} value={r}>{ROLE_LABELS[r]}</option>
              ))}
            </select>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Taux horaire (\u20ac/h)</label>
              <input
                type="number"
                step="0.01"
                min="0"
                value={empForm.tauxHoraire}
                onChange={e => setEmpForm(f => ({ ...f, tauxHoraire: e.target.value }))}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm"
                placeholder="Ex: 14.00"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Heures contrat / semaine</label>
              <input
                type="number"
                min="0"
                value={empForm.heuresContrat}
                onChange={e => setEmpForm(f => ({ ...f, heuresContrat: e.target.value }))}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm"
                placeholder="Ex: 35"
              />
            </div>
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <button onClick={() => setShowEmployeeModal(false)} className="px-4 py-2 text-sm font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition">
              Annuler
            </button>
            <button onClick={saveEmployee} className="px-4 py-2 text-sm font-medium bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition">
              {editEmployee ? 'Modifier' : 'Ajouter'}
            </button>
          </div>
        </div>
      </Modal>

      {/* ── Shift Modal ────────────────────────────────────────────────── */}
      <Modal
        isOpen={showShiftModal}
        onClose={() => setShowShiftModal(false)}
        title={editShift ? 'Modifier cr\u00e9neau' : 'Ajouter un cr\u00e9neau'}
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Employ\u00e9</label>
            <select
              value={shiftForm.employeeId}
              onChange={e => setShiftForm(f => ({ ...f, employeeId: e.target.value }))}
              className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm"
            >
              <option value="">-- S\u00e9lectionner --</option>
              {employees.map(emp => (
                <option key={emp.id} value={emp.id}>{emp.prenom} {emp.nom} ({ROLE_LABELS[emp.role]})</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Date</label>
            <input
              type="date"
              value={shiftForm.date}
              onChange={e => setShiftForm(f => ({ ...f, date: e.target.value }))}
              className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Heure d\u00e9but</label>
              <input
                type="time"
                value={shiftForm.start}
                onChange={e => setShiftForm(f => ({ ...f, start: e.target.value }))}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Heure fin</label>
              <input
                type="time"
                value={shiftForm.end}
                onChange={e => setShiftForm(f => ({ ...f, end: e.target.value }))}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Poste</label>
            <select
              value={shiftForm.poste}
              onChange={e => setShiftForm(f => ({ ...f, poste: e.target.value as Shift['poste'] }))}
              className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm"
            >
              {POSTES.map(p => (
                <option key={p.value} value={p.value}>{p.label}</option>
              ))}
            </select>
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <button onClick={() => setShowShiftModal(false)} className="px-4 py-2 text-sm font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition">
              Annuler
            </button>
            {editShift && (
              <button
                onClick={() => { deleteShift(editShift.id); setShowShiftModal(false); }}
                className="px-4 py-2 text-sm font-medium bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
              >
                Supprimer
              </button>
            )}
            <button onClick={saveShift} className="px-4 py-2 text-sm font-medium bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition">
              {editShift ? 'Modifier' : 'Ajouter'}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

// ── Sub-components ────────────────────────────────────────────────────

function SummaryCard({ icon, label, value, alert, subtitle }: {
  icon: React.ReactNode;
  label: string;
  value: string;
  alert?: boolean;
  subtitle?: string;
}) {
  return (
    <div className={`bg-white dark:bg-slate-800 rounded-xl p-4 shadow-sm border ${alert ? 'border-red-300 dark:border-red-700' : 'border-slate-200 dark:border-slate-700'}`}>
      <div className="flex items-center gap-3">
        <div className={`p-2 rounded-lg ${alert ? 'bg-red-100 dark:bg-red-900/30' : 'bg-slate-100 dark:bg-slate-700/50'}`}>
          {icon}
        </div>
        <div>
          <div className="text-xs text-slate-500 dark:text-slate-400">{label}</div>
          <div className={`text-xl font-bold ${alert ? 'text-red-600 dark:text-red-400' : 'text-slate-800 dark:text-slate-100'}`}>{value}</div>
          {subtitle && (
            <div className={`text-xs ${alert ? 'text-red-500 dark:text-red-400' : 'text-emerald-600 dark:text-emerald-400'}`}>{subtitle}</div>
          )}
        </div>
      </div>
    </div>
  );
}
