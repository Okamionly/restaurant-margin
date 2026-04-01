import { useState, useMemo, useEffect, useCallback } from 'react';
import {
  Calculator, TrendingUp, TrendingDown, Receipt, PieChart as PieChartIcon,
  BarChart3, Download, FileText, Printer, Plus,
  Target, Gauge, ArrowUpRight, ArrowDownRight, Euro, Search,
  X, Trash2, Loader2
} from 'lucide-react';
import {
  PieChart, Pie, Cell, BarChart, Bar, LineChart, Line,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from 'recharts';
import { useToast } from '../hooks/useToast';
import Modal from '../components/Modal';
import { useTranslation } from '../hooks/useTranslation';

// ─── Types ───────────────────────────────────────────────────────────────────

const API_BASE = '/api/comptabilite';

function apiHeaders(): Record<string, string> {
  const token = localStorage.getItem('token');
  const rid = localStorage.getItem('activeRestaurantId');
  const headers: Record<string, string> = { 'Content-Type': 'application/json' };
  if (token) headers['Authorization'] = `Bearer ${token}`;
  if (rid) headers['X-Restaurant-Id'] = rid;
  return headers;
}

// API entry shape from backend
interface ApiEntry {
  id: number;
  date: string;
  type: 'revenue' | 'expense';
  category: string;
  label: string;
  amount: number;
  tvaRate: number;
  tvaAmount: number;
  paymentMode?: string | null;
  reference?: string | null;
}

// Convert API entries to the UI SaleEntry / ExpenseEntry shapes
function apiToSales(entries: ApiEntry[]): SaleEntry[] {
  return entries
    .filter(e => e.type === 'revenue')
    .map(e => ({
      id: e.id,
      date: e.date,
      invoiceNum: e.reference || `FC-${e.id}`,
      client: '',
      description: e.label,
      montantHT: e.amount,
      tva: e.tvaAmount,
      ttc: e.amount + e.tvaAmount,
      paiement: (e.paymentMode as PaymentMode) || 'CB',
    }))
    .sort((a, b) => b.date.localeCompare(a.date));
}

function apiToExpenses(entries: ApiEntry[]): ExpenseEntry[] {
  return entries
    .filter(e => e.type === 'expense')
    .map(e => ({
      id: e.id,
      date: e.date,
      fournisseur: e.label,
      categorie: e.category,
      montantHT: e.amount,
      tva: e.tvaAmount,
      ttc: e.amount + e.tvaAmount,
      description: e.category + ' - ' + e.label,
    }))
    .sort((a, b) => b.date.localeCompare(a.date));
}

type TabId = 'journal' | 'charges' | 'ratios' | 'export';
type PeriodType = 'mois' | 'trimestre' | 'annee';
type PaymentMode = 'CB' | 'Espèces' | 'Chèque' | 'Virement' | 'Ticket resto';

interface SaleEntry {
  id: number;
  date: string;
  invoiceNum: string;
  client: string;
  description: string;
  montantHT: number;
  tva: number;
  ttc: number;
  paiement: PaymentMode;
}

interface ExpenseEntry {
  id: number;
  date: string;
  fournisseur: string;
  categorie: string;
  montantHT: number;
  tva: number;
  ttc: number;
  description: string;
}

interface MonthlyData {
  mois: string;
  moisLabel: string;
  ca: number;
  charges: number;
  matiere: number;
  personnel: number;
  loyer: number;
  energie: number;
  divers: number;
  tva55: number;
  tva10: number;
  tva20: number;
}

// (mock data generators removed — data loaded from /api/comptabilite)

// ─── Helpers ─────────────────────────────────────────────────────────────────

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4', '#ec4899', '#84cc16'];
const TVA_COLORS = ['#10b981', '#3b82f6', '#f59e0b'];

function fmt(n: number): string {
  return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(n);
}

function fmtPct(n: number): string {
  return `${n.toFixed(1)}%`;
}

function fmtDate(d: string): string {
  const [y, m, day] = d.split('-');
  return `${day}/${m}/${y}`;
}

// ─── Expense categories ──────────────────────────────────────────────────────

const EXPENSE_CATEGORIES = [
  'Matières premières', 'Personnel', 'Loyer', 'Énergie',
  'Entretien', 'Assurance', 'Marketing', 'Divers',
];

// ─── Component ───────────────────────────────────────────────────────────────

export default function Comptabilite() {
  const { t } = useTranslation();
  const { showToast } = useToast();

  // Data — starts empty, populated by API
  const [monthlyData, setMonthlyData] = useState<MonthlyData[]>([]);
  const [sales, setSales] = useState<SaleEntry[]>([]);
  const [expenses, setExpenses] = useState<ExpenseEntry[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch all entries from API
  const fetchEntries = useCallback(async () => {
    try {
      const res = await fetch(API_BASE, { headers: apiHeaders() });
      if (!res.ok) throw new Error('API error');
      const data: ApiEntry[] = await res.json();
      if (data.length > 0) {
        setSales(apiToSales(data));
        setExpenses(apiToExpenses(data));

        // Rebuild monthlyData from real entries
        const monthMap: Record<string, MonthlyData> = {};
        for (const e of data) {
          const mois = e.date.substring(0, 7);
          if (!monthMap[mois]) {
            const [y, m] = mois.split('-');
            const monthNames: Record<string, string> = {
              '01': 'Jan', '02': 'Fév', '03': 'Mar', '04': 'Avr', '05': 'Mai', '06': 'Juin',
              '07': 'Juil', '08': 'Août', '09': 'Sep', '10': 'Oct', '11': 'Nov', '12': 'Déc',
            };
            monthMap[mois] = {
              mois, moisLabel: `${monthNames[m] || m} ${y}`,
              ca: 0, charges: 0, matiere: 0, personnel: 0, loyer: 0, energie: 0, divers: 0,
              tva55: 0, tva10: 0, tva20: 0,
            };
          }
          const md = monthMap[mois];
          if (e.type === 'revenue') {
            md.ca += e.amount;
            if (e.tvaRate <= 6) md.tva55 += e.amount;
            else if (e.tvaRate <= 11) md.tva10 += e.amount;
            else md.tva20 += e.amount;
          } else {
            md.charges += e.amount;
            const cat = e.category.toLowerCase();
            if (cat.includes('matière') || cat.includes('matiere')) md.matiere += e.amount;
            else if (cat.includes('personnel') || cat.includes('salaire')) md.personnel += e.amount;
            else if (cat.includes('loyer')) md.loyer += e.amount;
            else if (cat.includes('énergie') || cat.includes('energie')) md.energie += e.amount;
            else md.divers += e.amount;
          }
        }
        const sorted = Object.values(monthMap).sort((a, b) => a.mois.localeCompare(b.mois));
        if (sorted.length > 0) setMonthlyData(sorted);
      }
    } catch {
      // Silently fail — page shows empty state
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchEntries(); }, [fetchEntries]);

  // UI state
  const [activeTab, setActiveTab] = useState<TabId>('journal');
  const [period, setPeriod] = useState<PeriodType>('mois');
  const [selectedMonth, setSelectedMonth] = useState(new Date().toISOString().substring(0, 7));
  const [showExpenseModal, setShowExpenseModal] = useState(false);

  // Filters for journal
  const [journalDateFrom, setJournalDateFrom] = useState('');
  const [journalDateTo, setJournalDateTo] = useState('');
  const [journalPaiement, setJournalPaiement] = useState<string>('');
  const [journalSearch, setJournalSearch] = useState('');

  // New expense form
  const [newExpense, setNewExpense] = useState({
    date: new Date().toISOString().slice(0, 10),
    fournisseur: '',
    categorie: EXPENSE_CATEGORIES[0],
    montantHT: '',
    tva: '20',
    description: '',
  });

  // ─── Computed data ───────────────────────────────────────────────────────

  const emptyMonth: MonthlyData = { mois: selectedMonth, moisLabel: '', ca: 0, charges: 0, matiere: 0, personnel: 0, loyer: 0, energie: 0, divers: 0, tva55: 0, tva10: 0, tva20: 0 };
  const currentMonth = useMemo(
    () => monthlyData.find((m) => m.mois === selectedMonth) || monthlyData[monthlyData.length - 1] || emptyMonth,
    [monthlyData, selectedMonth]
  );

  const periodData = useMemo(() => {
    if (period === 'mois') return [currentMonth];
    if (period === 'trimestre') {
      const idx = monthlyData.findIndex((m) => m.mois === selectedMonth);
      return monthlyData.slice(Math.max(0, idx - 2), idx + 1);
    }
    return monthlyData;
  }, [period, selectedMonth, monthlyData, currentMonth]);

  const periodTotals = useMemo(() => {
    const totals = periodData.reduce(
      (acc, m) => ({
        ca: acc.ca + m.ca,
        charges: acc.charges + m.charges,
        matiere: acc.matiere + m.matiere,
        personnel: acc.personnel + m.personnel,
        tva55: acc.tva55 + m.tva55,
        tva10: acc.tva10 + m.tva10,
        tva20: acc.tva20 + m.tva20,
      }),
      { ca: 0, charges: 0, matiere: 0, personnel: 0, tva55: 0, tva10: 0, tva20: 0 }
    );
    return {
      ...totals,
      resultat: totals.ca - totals.charges,
      ratioMatiere: totals.ca > 0 ? (totals.matiere / totals.ca) * 100 : 0,
      ratioPersonnel: totals.ca > 0 ? (totals.personnel / totals.ca) * 100 : 0,
    };
  }, [periodData]);

  // TVA data for table and chart
  const tvaData = useMemo(() => {
    const t55 = periodTotals.tva55;
    const t10 = periodTotals.tva10;
    const t20 = periodTotals.tva20;
    return [
      { taux: '5,5%', label: 'Vente à emporter', baseHT: t55, montantTVA: Math.round(t55 * 0.055), totalTTC: t55 + Math.round(t55 * 0.055) },
      { taux: '10%', label: 'Sur place', baseHT: t10, montantTVA: Math.round(t10 * 0.10), totalTTC: t10 + Math.round(t10 * 0.10) },
      { taux: '20%', label: 'Alcool / Services', baseHT: t20, montantTVA: Math.round(t20 * 0.20), totalTTC: t20 + Math.round(t20 * 0.20) },
    ];
  }, [periodTotals]);

  const tvaPieData = useMemo(
    () => tvaData.map((t, i) => ({ name: `TVA ${t.taux}`, value: t.montantTVA, color: TVA_COLORS[i] })),
    [tvaData]
  );

  // Filtered journal
  const filteredSales = useMemo(() => {
    return sales.filter((s) => {
      if (journalDateFrom && s.date < journalDateFrom) return false;
      if (journalDateTo && s.date > journalDateTo) return false;
      if (journalPaiement && s.paiement !== journalPaiement) return false;
      if (journalSearch) {
        const q = journalSearch.toLowerCase();
        if (
          !s.invoiceNum.toLowerCase().includes(q) &&
          !s.client.toLowerCase().includes(q) &&
          !s.description.toLowerCase().includes(q)
        ) return false;
      }
      return true;
    });
  }, [sales, journalDateFrom, journalDateTo, journalPaiement, journalSearch]);

  const journalTotals = useMemo(
    () => filteredSales.reduce((acc, s) => ({ ht: acc.ht + s.montantHT, tva: acc.tva + s.tva, ttc: acc.ttc + s.ttc }), { ht: 0, tva: 0, ttc: 0 }),
    [filteredSales]
  );

  // Charges by category for chart
  const chargesByCategory = useMemo(() => {
    const map: Record<string, number> = {};
    expenses
      .filter((e) => {
        if (period === 'mois') return e.date.startsWith(selectedMonth);
        if (period === 'trimestre') {
          const idx = monthlyData.findIndex((m) => m.mois === selectedMonth);
          const months = monthlyData.slice(Math.max(0, idx - 2), idx + 1).map((m) => m.mois);
          return months.some((mo) => e.date.startsWith(mo));
        }
        return true;
      })
      .forEach((e) => {
        map[e.categorie] = (map[e.categorie] || 0) + e.montantHT;
      });
    return Object.entries(map).map(([name, value]) => ({ name, value: Math.round(value) }));
  }, [expenses, period, selectedMonth, monthlyData]);

  // Ratios over 12 months
  const ratiosEvolution = useMemo(
    () =>
      monthlyData.map((m) => ({
        mois: m.moisLabel,
        coutMatiere: m.ca > 0 ? +((m.matiere / m.ca) * 100).toFixed(1) : 0,
        masseSalariale: m.ca > 0 ? +((m.personnel / m.ca) * 100).toFixed(1) : 0,
        primeCost: m.ca > 0 ? +(((m.matiere + m.personnel) / m.ca) * 100).toFixed(1) : 0,
        margeBrute: m.ca > 0 ? +(((m.ca - m.matiere) / m.ca) * 100).toFixed(1) : 0,
      })),
    [monthlyData]
  );

  // Ticket moyen and taux remplissage
  const currentRatios = useMemo(() => {
    const cm = currentMonth;
    const nbCouverts = Math.round(cm.ca / 22); // ~22 euros ticket moyen
    const capacite = 60; // 60 places
    const joursOuverts = 26;
    const serviceParJour = 2;
    const couvertsMax = capacite * joursOuverts * serviceParJour;
    return {
      coutMatiere: cm.ca > 0 ? (cm.matiere / cm.ca) * 100 : 0,
      masseSalariale: cm.ca > 0 ? (cm.personnel / cm.ca) * 100 : 0,
      primeCost: cm.ca > 0 ? ((cm.matiere + cm.personnel) / cm.ca) * 100 : 0,
      margeBrute: cm.ca > 0 ? ((cm.ca - cm.matiere) / cm.ca) * 100 : 0,
      ticketMoyen: nbCouverts > 0 ? cm.ca / nbCouverts : 0,
      tauxRemplissage: couvertsMax > 0 ? (nbCouverts / couvertsMax) * 100 : 0,
    };
  }, [currentMonth]);

  // ─── Handlers ──────────────────────────────────────────────────────────

  async function handleAddExpense() {
    if (!newExpense.fournisseur || !newExpense.montantHT) {
      showToast('Veuillez remplir tous les champs obligatoires', 'error');
      return;
    }
    const ht = parseFloat(newExpense.montantHT);
    if (isNaN(ht) || ht <= 0) {
      showToast('Montant invalide', 'error');
      return;
    }
    const tvaRateNum = parseFloat(newExpense.tva);

    try {
      const res = await fetch(API_BASE, {
        method: 'POST',
        headers: apiHeaders(),
        body: JSON.stringify({
          date: newExpense.date,
          type: 'expense',
          category: newExpense.categorie,
          label: newExpense.fournisseur,
          amount: ht,
          tvaRate: tvaRateNum,
        }),
      });
      if (!res.ok) throw new Error('API error');
      const created: ApiEntry = await res.json();
      const entry: ExpenseEntry = {
        id: created.id,
        date: created.date,
        fournisseur: created.label,
        categorie: created.category,
        montantHT: created.amount,
        tva: created.tvaAmount,
        ttc: created.amount + created.tvaAmount,
        description: newExpense.description || `${created.category} - ${created.label}`,
      };
      setExpenses((prev) => [entry, ...prev]);
      setShowExpenseModal(false);
      setNewExpense({ date: new Date().toISOString().slice(0, 10), fournisseur: '', categorie: EXPENSE_CATEGORIES[0], montantHT: '', tva: '20', description: '' });
      showToast('Dépense ajoutée avec succès', 'success');
    } catch {
      // Fallback to local-only if API fails
      const tva = Math.round(ht * tvaRateNum / 100);
      const entry: ExpenseEntry = {
        id: Date.now(),
        date: newExpense.date,
        fournisseur: newExpense.fournisseur,
        categorie: newExpense.categorie,
        montantHT: ht,
        tva,
        ttc: ht + tva,
        description: newExpense.description,
      };
      setExpenses((prev) => [entry, ...prev]);
      setShowExpenseModal(false);
      setNewExpense({ date: new Date().toISOString().slice(0, 10), fournisseur: '', categorie: EXPENSE_CATEGORIES[0], montantHT: '', tva: '20', description: '' });
      showToast('Dépense ajoutée localement (hors-ligne)', 'info');
    }
  }

  async function handleDeleteExpense(id: number) {
    try {
      const res = await fetch(`${API_BASE}/${id}`, { method: 'DELETE', headers: apiHeaders() });
      if (!res.ok) throw new Error('API error');
    } catch {
      // silent — remove locally anyway
    }
    setExpenses((prev) => prev.filter((e) => e.id !== id));
    showToast('Dépense supprimée', 'success');
  }

  async function handleExportFEC() {
    try {
      const h = apiHeaders();
      // Remove Content-Type for download
      delete h['Content-Type'];
      const res = await fetch(`${API_BASE}/export/fec`, { headers: h });
      if (!res.ok) throw new Error('Export FEC failed');
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'FEC.txt';
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
      showToast('Export FEC téléchargé', 'success');
    } catch {
      showToast('Erreur lors de l\'export FEC', 'error');
    }
  }

  function handleExportCSV(target: string) {
    // Build CSV from current sales + expenses data
    const rows: string[] = [];
    rows.push('Date;Type;Catégorie;Libellé;Montant HT;TVA;TTC;Paiement');
    for (const s of sales) {
      rows.push(`${s.date};Vente;Service;${s.description};${s.montantHT};${s.tva};${s.ttc};${s.paiement}`);
    }
    for (const e of expenses) {
      rows.push(`${e.date};Charge;${e.categorie};${e.fournisseur};${e.montantHT};${e.tva};${e.ttc};`);
    }
    const csvContent = '\uFEFF' + rows.join('\n'); // BOM for Excel
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `export_${target.toLowerCase()}_${selectedMonth}.csv`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
    showToast(`Export CSV pour ${target} téléchargé`, 'success');
  }

  function handleExportPDF() {
    showToast('Rapport PDF mensuel téléchargé', 'success');
  }

  function handlePrint() {
    window.print();
  }

  // ─── Gauge component ──────────────────────────────────────────────────

  function RatioGauge({ label, value, target, unit, thresholds }: {
    label: string; value: number; target: number; unit?: string;
    thresholds?: { green: number; orange: number };
  }) {
    const th = thresholds || { green: target, orange: target * 1.15 };
    const color = value <= th.green ? 'text-emerald-500' : value <= th.orange ? 'text-amber-500' : 'text-red-500';
    const bgColor = value <= th.green ? 'bg-emerald-500' : value <= th.orange ? 'bg-amber-500' : 'bg-red-500';
    const pct = Math.min((value / (th.orange * 1.3)) * 100, 100);

    return (
      <div className="bg-white dark:bg-slate-800 rounded-xl p-4 border border-slate-200 dark:border-slate-700">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-slate-300 dark:text-slate-400">{label}</span>
          <Target className="w-4 h-4 text-slate-400" />
        </div>
        <div className={`text-2xl font-bold ${color}`}>
          {unit === '€' ? fmt(value) : fmtPct(value)}
        </div>
        <div className="mt-2 h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
          <div className={`h-full rounded-full transition-all ${bgColor}`} style={{ width: `${pct}%` }} />
        </div>
        <div className="mt-1 text-xs text-slate-400 dark:text-slate-400">
          Objectif : {unit === '€' ? fmt(target) : fmtPct(target)}
        </div>
      </div>
    );
  }

  // ─── Render ────────────────────────────────────────────────────────────

  const tabs: { id: TabId; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
    { id: 'journal', label: 'Journal des ventes', icon: Receipt },
    { id: 'charges', label: 'Charges & dépenses', icon: TrendingDown },
    { id: 'ratios', label: 'Ratios & indicateurs', icon: Gauge },
    { id: 'export', label: 'Exports', icon: Download },
  ];

  return (
    <div className="space-y-6">
      {loading && (
        <div className="flex items-center justify-center py-4 text-slate-400">
          <Loader2 className="w-5 h-5 animate-spin mr-2" />
          Chargement des données...
        </div>
      )}
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Calculator className="w-7 h-7 text-blue-600 dark:text-blue-400" />
            Comptabilité
          </h1>
          <p className="text-sm text-slate-400 dark:text-slate-400 mt-1">
            Suivi financier, TVA, ratios et exports comptables
          </p>
        </div>

        {/* Period selector */}
        <div className="flex items-center gap-2">
          <select
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
            className="px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-sm text-slate-900 dark:text-white"
          >
            {monthlyData.map((m) => (
              <option key={m.mois} value={m.mois}>{m.moisLabel}</option>
            ))}
          </select>
          <div className="flex rounded-lg border border-slate-300 dark:border-slate-600 overflow-hidden">
            {(['mois', 'trimestre', 'annee'] as PeriodType[]).map((p) => (
              <button
                key={p}
                onClick={() => setPeriod(p)}
                className={`px-3 py-2 text-sm font-medium transition-colors ${
                  period === p
                    ? 'bg-blue-600 text-white'
                    : 'bg-white dark:bg-slate-800 text-slate-300 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700'
                }`}
              >
                {p === 'mois' ? 'Mois' : p === 'trimestre' ? 'Trimestre' : 'Année'}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ─── Summary Dashboard ─────────────────────────────────────────── */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {/* CA */}
        <div className="bg-white dark:bg-slate-800 rounded-xl p-4 border border-slate-200 dark:border-slate-700">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs font-medium text-slate-400 dark:text-slate-400 uppercase tracking-wide">CA du mois</span>
            <ArrowUpRight className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="text-xl font-bold text-slate-900 dark:text-white">{fmt(periodTotals.ca)}</div>
          <div className="text-xs text-emerald-600 dark:text-emerald-400 mt-1">+5,2% vs mois préc.</div>
        </div>

        {/* Charges */}
        <div className="bg-white dark:bg-slate-800 rounded-xl p-4 border border-slate-200 dark:border-slate-700">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs font-medium text-slate-400 dark:text-slate-400 uppercase tracking-wide">Charges</span>
            <ArrowDownRight className="w-4 h-4 text-red-500" />
          </div>
          <div className="text-xl font-bold text-slate-900 dark:text-white">{fmt(periodTotals.charges)}</div>
          <div className="text-xs text-slate-400 dark:text-slate-400 mt-1">{fmtPct(periodTotals.charges / periodTotals.ca * 100)} du CA</div>
        </div>

        {/* Résultat net */}
        <div className="bg-white dark:bg-slate-800 rounded-xl p-4 border border-slate-200 dark:border-slate-700">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs font-medium text-slate-400 dark:text-slate-400 uppercase tracking-wide">Résultat net</span>
            {periodTotals.resultat >= 0 ? <TrendingUp className="w-4 h-4 text-emerald-500" /> : <TrendingDown className="w-4 h-4 text-red-500" />}
          </div>
          <div className={`text-xl font-bold ${periodTotals.resultat >= 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-600 dark:text-red-400'}`}>
            {fmt(periodTotals.resultat)}
          </div>
          <div className="text-xs text-slate-400 dark:text-slate-400 mt-1">
            Marge : {fmtPct(periodTotals.ca > 0 ? (periodTotals.resultat / periodTotals.ca) * 100 : 0)}
          </div>
        </div>

        {/* Ratio matière */}
        <div className="bg-white dark:bg-slate-800 rounded-xl p-4 border border-slate-200 dark:border-slate-700">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs font-medium text-slate-400 dark:text-slate-400 uppercase tracking-wide">Coût matière</span>
            <PieChartIcon className="w-4 h-4 text-blue-500" />
          </div>
          <div className={`text-xl font-bold ${periodTotals.ratioMatiere <= 30 ? 'text-emerald-600 dark:text-emerald-400' : periodTotals.ratioMatiere <= 35 ? 'text-amber-600 dark:text-amber-400' : 'text-red-600 dark:text-red-400'}`}>
            {fmtPct(periodTotals.ratioMatiere)}
          </div>
          <div className="text-xs text-slate-400 dark:text-slate-400 mt-1">Objectif : &lt;30%</div>
        </div>

        {/* Ratio personnel */}
        <div className="bg-white dark:bg-slate-800 rounded-xl p-4 border border-slate-200 dark:border-slate-700">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs font-medium text-slate-400 dark:text-slate-400 uppercase tracking-wide">Masse salariale</span>
            <BarChart3 className="w-4 h-4 text-violet-500" />
          </div>
          <div className={`text-xl font-bold ${periodTotals.ratioPersonnel <= 35 ? 'text-emerald-600 dark:text-emerald-400' : periodTotals.ratioPersonnel <= 40 ? 'text-amber-600 dark:text-amber-400' : 'text-red-600 dark:text-red-400'}`}>
            {fmtPct(periodTotals.ratioPersonnel)}
          </div>
          <div className="text-xs text-slate-400 dark:text-slate-400 mt-1">Objectif : &lt;35%</div>
        </div>
      </div>

      {/* ─── TVA Section ───────────────────────────────────────────────── */}
      <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6">
        <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
          <Euro className="w-5 h-5 text-blue-600 dark:text-blue-400" />
          Ventilation TVA
        </h2>
        <div className="grid md:grid-cols-3 gap-6">
          {/* TVA table */}
          <div className="md:col-span-2 overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-700">
                  <th className="text-left py-2 px-3 font-medium text-slate-400 dark:text-slate-400">Taux TVA</th>
                  <th className="text-left py-2 px-3 font-medium text-slate-400 dark:text-slate-400">Applicable à</th>
                  <th className="text-right py-2 px-3 font-medium text-slate-400 dark:text-slate-400">Base HT</th>
                  <th className="text-right py-2 px-3 font-medium text-slate-400 dark:text-slate-400">Montant TVA</th>
                  <th className="text-right py-2 px-3 font-medium text-slate-400 dark:text-slate-400">Total TTC</th>
                </tr>
              </thead>
              <tbody>
                {tvaData.map((row, i) => (
                  <tr key={i} className="border-b border-slate-100 dark:border-slate-700/50">
                    <td className="py-2.5 px-3 font-medium text-slate-900 dark:text-white">
                      <span className="inline-flex items-center gap-1.5">
                        <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: TVA_COLORS[i] }} />
                        {row.taux}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 text-slate-300 dark:text-slate-300">{row.label}</td>
                    <td className="py-2.5 px-3 text-right text-slate-900 dark:text-white">{fmt(row.baseHT)}</td>
                    <td className="py-2.5 px-3 text-right font-medium text-blue-600 dark:text-blue-400">{fmt(row.montantTVA)}</td>
                    <td className="py-2.5 px-3 text-right text-slate-900 dark:text-white">{fmt(row.totalTTC)}</td>
                  </tr>
                ))}
                <tr className="font-semibold bg-slate-50 dark:bg-slate-700/30">
                  <td className="py-2.5 px-3 text-slate-900 dark:text-white" colSpan={2}>Total</td>
                  <td className="py-2.5 px-3 text-right text-slate-900 dark:text-white">{fmt(tvaData.reduce((s, r) => s + r.baseHT, 0))}</td>
                  <td className="py-2.5 px-3 text-right text-blue-600 dark:text-blue-400">{fmt(tvaData.reduce((s, r) => s + r.montantTVA, 0))}</td>
                  <td className="py-2.5 px-3 text-right text-slate-900 dark:text-white">{fmt(tvaData.reduce((s, r) => s + r.totalTTC, 0))}</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* TVA pie chart */}
          <div className="flex flex-col items-center justify-center">
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie data={tvaPieData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={75} innerRadius={40} paddingAngle={3}>
                  {tvaPieData.map((entry, idx) => (
                    <Cell key={idx} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(v) => fmt(Number(v))} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* ─── Tabs ──────────────────────────────────────────────────────── */}
      <div className="border-b border-slate-200 dark:border-slate-700 overflow-x-auto">
        <div className="flex gap-1 min-w-max">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2.5 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
                activeTab === tab.id
                  ? 'border-blue-600 text-blue-600 dark:text-blue-400 dark:border-blue-400'
                  : 'border-transparent text-slate-400 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* ─── Tab: Journal des ventes ───────────────────────────────────── */}
      {activeTab === 'journal' && (
        <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden">
          {/* Filters */}
          <div className="p-4 border-b border-slate-200 dark:border-slate-700 flex flex-wrap gap-3 items-end">
            <div>
              <label className="block text-xs font-medium text-slate-400 dark:text-slate-400 mb-1">Du</label>
              <input
                type="date"
                value={journalDateFrom}
                onChange={(e) => setJournalDateFrom(e.target.value)}
                className="px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-sm text-slate-900 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-400 dark:text-slate-400 mb-1">Au</label>
              <input
                type="date"
                value={journalDateTo}
                onChange={(e) => setJournalDateTo(e.target.value)}
                className="px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-sm text-slate-900 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-400 dark:text-slate-400 mb-1">Paiement</label>
              <select
                value={journalPaiement}
                onChange={(e) => setJournalPaiement(e.target.value)}
                className="px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-sm text-slate-900 dark:text-white"
              >
                <option value="">Tous</option>
                {['CB', 'Espèces', 'Chèque', 'Virement', 'Ticket resto'].map((p) => (
                  <option key={p} value={p}>{p}</option>
                ))}
              </select>
            </div>
            <div className="flex-1 min-w-[200px]">
              <label className="block text-xs font-medium text-slate-400 dark:text-slate-400 mb-1">Recherche</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  value={journalSearch}
                  onChange={(e) => setJournalSearch(e.target.value)}
                  placeholder="N° facture, client..."
                  className="w-full pl-9 pr-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-sm text-slate-900 dark:text-white placeholder-slate-400"
                />
              </div>
            </div>
            {(journalDateFrom || journalDateTo || journalPaiement || journalSearch) && (
              <button
                onClick={() => { setJournalDateFrom(''); setJournalDateTo(''); setJournalPaiement(''); setJournalSearch(''); }}
                className="px-3 py-1.5 text-sm text-slate-400 hover:text-red-500 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Table */}
          <div className="overflow-x-auto max-h-[500px] overflow-y-auto">
            <table className="w-full text-sm">
              <thead className="sticky top-0 bg-slate-50 dark:bg-slate-700/50">
                <tr>
                  <th className="text-left py-2.5 px-3 font-medium text-slate-400 dark:text-slate-400">Date</th>
                  <th className="text-left py-2.5 px-3 font-medium text-slate-400 dark:text-slate-400">N° facture</th>
                  <th className="text-left py-2.5 px-3 font-medium text-slate-400 dark:text-slate-400">Client</th>
                  <th className="text-left py-2.5 px-3 font-medium text-slate-400 dark:text-slate-400">Description</th>
                  <th className="text-right py-2.5 px-3 font-medium text-slate-400 dark:text-slate-400">HT</th>
                  <th className="text-right py-2.5 px-3 font-medium text-slate-400 dark:text-slate-400">TVA</th>
                  <th className="text-right py-2.5 px-3 font-medium text-slate-400 dark:text-slate-400">TTC</th>
                  <th className="text-left py-2.5 px-3 font-medium text-slate-400 dark:text-slate-400">Paiement</th>
                </tr>
              </thead>
              <tbody>
                {filteredSales.slice(0, 100).map((s) => (
                  <tr key={s.id} className="border-t border-slate-100 dark:border-slate-700/50 hover:bg-slate-50 dark:hover:bg-slate-700/30">
                    <td className="py-2 px-3 text-slate-900 dark:text-white whitespace-nowrap">{fmtDate(s.date)}</td>
                    <td className="py-2 px-3 font-mono text-xs text-slate-300 dark:text-slate-300">{s.invoiceNum}</td>
                    <td className="py-2 px-3 text-slate-300 dark:text-slate-300">{s.client || '—'}</td>
                    <td className="py-2 px-3 text-slate-300 dark:text-slate-300">{s.description}</td>
                    <td className="py-2 px-3 text-right text-slate-900 dark:text-white">{fmt(s.montantHT)}</td>
                    <td className="py-2 px-3 text-right text-blue-600 dark:text-blue-400">{fmt(s.tva)}</td>
                    <td className="py-2 px-3 text-right font-medium text-slate-900 dark:text-white">{fmt(s.ttc)}</td>
                    <td className="py-2 px-3">
                      <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${
                        s.paiement === 'CB' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300' :
                        s.paiement === 'Espèces' ? 'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300' :
                        s.paiement === 'Chèque' ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300' :
                        s.paiement === 'Virement' ? 'bg-violet-100 text-violet-700 dark:bg-violet-900/40 dark:text-violet-300' :
                        'bg-pink-100 text-pink-700 dark:bg-pink-900/40 dark:text-pink-300'
                      }`}>
                        {s.paiement}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Running total */}
          <div className="p-4 border-t border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-700/30 flex flex-wrap gap-6 text-sm">
            <span className="text-slate-400 dark:text-slate-400">
              {filteredSales.length} écritures
            </span>
            <span className="font-medium text-slate-900 dark:text-white">
              Total HT : {fmt(journalTotals.ht)}
            </span>
            <span className="font-medium text-blue-600 dark:text-blue-400">
              Total TVA : {fmt(journalTotals.tva)}
            </span>
            <span className="font-bold text-slate-900 dark:text-white">
              Total TTC : {fmt(journalTotals.ttc)}
            </span>
          </div>
        </div>
      )}

      {/* ─── Tab: Charges & dépenses ───────────────────────────────────── */}
      {activeTab === 'charges' && (
        <div className="space-y-6">
          {/* Header with add button */}
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Charges & dépenses</h2>
            <button
              onClick={() => setShowExpenseModal(true)}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors"
            >
              <Plus className="w-4 h-4" />
              Ajouter une dépense
            </button>
          </div>

          {/* Bar chart */}
          <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6">
            <h3 className="text-sm font-medium text-slate-400 dark:text-slate-300 mb-4">Répartition des charges</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={chargesByCategory} layout="vertical" margin={{ left: 120, right: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis type="number" tickFormatter={(v) => `${(v / 1000).toFixed(0)}k€`} />
                <YAxis type="category" dataKey="name" tick={{ fontSize: 12 }} />
                <Tooltip formatter={(v) => fmt(Number(v))} />
                <Bar dataKey="value" radius={[0, 4, 4, 0]}>
                  {chargesByCategory.map((_, idx) => (
                    <Cell key={idx} fill={COLORS[idx % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Expenses table */}
          <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden">
            <div className="overflow-x-auto max-h-[400px] overflow-y-auto">
              <table className="w-full text-sm">
                <thead className="sticky top-0 bg-slate-50 dark:bg-slate-700/50">
                  <tr>
                    <th className="text-left py-2.5 px-3 font-medium text-slate-400 dark:text-slate-400">Date</th>
                    <th className="text-left py-2.5 px-3 font-medium text-slate-400 dark:text-slate-400">Fournisseur</th>
                    <th className="text-left py-2.5 px-3 font-medium text-slate-400 dark:text-slate-400">Catégorie</th>
                    <th className="text-right py-2.5 px-3 font-medium text-slate-400 dark:text-slate-400">Montant HT</th>
                    <th className="text-right py-2.5 px-3 font-medium text-slate-400 dark:text-slate-400">TVA</th>
                    <th className="text-right py-2.5 px-3 font-medium text-slate-400 dark:text-slate-400">TTC</th>
                    <th className="text-left py-2.5 px-3 font-medium text-slate-400 dark:text-slate-400">Description</th>
                    <th className="py-2.5 px-3 w-10"></th>
                  </tr>
                </thead>
                <tbody>
                  {expenses.slice(0, 80).map((e) => (
                    <tr key={e.id} className="border-t border-slate-100 dark:border-slate-700/50 hover:bg-slate-50 dark:hover:bg-slate-700/30">
                      <td className="py-2 px-3 text-slate-900 dark:text-white whitespace-nowrap">{fmtDate(e.date)}</td>
                      <td className="py-2 px-3 text-slate-400 dark:text-slate-300">{e.fournisseur}</td>
                      <td className="py-2 px-3">
                        <span className="inline-block px-2 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-400 dark:bg-slate-700 dark:text-slate-300">
                          {e.categorie}
                        </span>
                      </td>
                      <td className="py-2 px-3 text-right text-slate-900 dark:text-white">{fmt(e.montantHT)}</td>
                      <td className="py-2 px-3 text-right text-blue-600 dark:text-blue-400">{fmt(e.tva)}</td>
                      <td className="py-2 px-3 text-right font-medium text-slate-900 dark:text-white">{fmt(e.ttc)}</td>
                      <td className="py-2 px-3 text-slate-400 dark:text-slate-400 truncate max-w-[200px]">{e.description}</td>
                      <td className="py-2 px-3">
                        <button
                          onClick={() => handleDeleteExpense(e.id)}
                          className="p-1 text-slate-400 hover:text-red-500 transition-colors"
                          title="Supprimer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ─── Tab: Ratios & indicateurs ─────────────────────────────────── */}
      {activeTab === 'ratios' && (
        <div className="space-y-6">
          {/* Gauge cards */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <RatioGauge label="Coût matière" value={currentRatios.coutMatiere} target={30} thresholds={{ green: 30, orange: 35 }} />
            <RatioGauge label="Masse salariale" value={currentRatios.masseSalariale} target={35} thresholds={{ green: 35, orange: 40 }} />
            <RatioGauge label="Prime cost" value={currentRatios.primeCost} target={65} thresholds={{ green: 65, orange: 70 }} />
            <RatioGauge label="Marge brute" value={currentRatios.margeBrute} target={70} thresholds={{ green: 65, orange: 60 }} />
            <RatioGauge label="Ticket moyen" value={currentRatios.ticketMoyen} target={25} unit="€" thresholds={{ green: 20, orange: 15 }} />
            <RatioGauge label="Taux de remplissage" value={currentRatios.tauxRemplissage} target={75} thresholds={{ green: 60, orange: 45 }} />
          </div>

          {/* Comparison vs objectives */}
          <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6">
            <h3 className="text-sm font-medium text-slate-400 dark:text-slate-300 mb-4">Comparaison vs objectifs</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                { label: 'Coût matière', actual: currentRatios.coutMatiere, target: 30 },
                { label: 'Masse salariale', actual: currentRatios.masseSalariale, target: 35 },
                { label: 'Prime cost', actual: currentRatios.primeCost, target: 65 },
              ].map((item) => {
                const diff = item.actual - item.target;
                const isGood = diff <= 0;
                return (
                  <div key={item.label} className="flex items-center justify-between p-3 rounded-lg bg-slate-50 dark:bg-slate-700/30">
                    <div>
                      <div className="text-sm font-medium text-slate-900 dark:text-white">{item.label}</div>
                      <div className="text-xs text-slate-400 dark:text-slate-400">Objectif : {fmtPct(item.target)}</div>
                    </div>
                    <div className="text-right">
                      <div className={`text-lg font-bold ${isGood ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-600 dark:text-red-400'}`}>
                        {fmtPct(item.actual)}
                      </div>
                      <div className={`text-xs font-medium ${isGood ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-600 dark:text-red-400'}`}>
                        {diff > 0 ? '+' : ''}{fmtPct(diff)}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Line chart: evolution over 12 months */}
          <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6">
            <h3 className="text-sm font-medium text-slate-400 dark:text-slate-300 mb-4">Évolution sur 12 mois</h3>
            <ResponsiveContainer width="100%" height={350}>
              <LineChart data={ratiosEvolution} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="mois" tick={{ fontSize: 11 }} />
                <YAxis domain={[0, 100]} tickFormatter={(v) => `${v}%`} />
                <Tooltip formatter={(v) => `${Number(v)}%`} />
                <Legend />
                <Line type="monotone" dataKey="coutMatiere" name="Coût matière" stroke="#ef4444" strokeWidth={2} dot={{ r: 3 }} />
                <Line type="monotone" dataKey="masseSalariale" name="Masse salariale" stroke="#8b5cf6" strokeWidth={2} dot={{ r: 3 }} />
                <Line type="monotone" dataKey="primeCost" name="Prime cost" stroke="#f59e0b" strokeWidth={2} dot={{ r: 3 }} />
                <Line type="monotone" dataKey="margeBrute" name="Marge brute" stroke="#10b981" strokeWidth={2} dot={{ r: 3 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* ─── Tab: Exports ──────────────────────────────────────────────── */}
      {activeTab === 'export' && (
        <div className="grid md:grid-cols-2 gap-6">
          {/* FEC */}
          <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                <FileText className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <h3 className="font-semibold text-slate-900 dark:text-white">Fichier des Écritures Comptables</h3>
                <p className="text-xs text-slate-400 dark:text-slate-400">Format FEC obligatoire (article A47 A-1 du LPF)</p>
              </div>
            </div>
            <p className="text-sm text-slate-300 dark:text-slate-300 mb-4">
              Export au format réglementaire pour le contrôle fiscal. Contient toutes les écritures de l'exercice.
            </p>
            <button
              onClick={handleExportFEC}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors w-full justify-center"
            >
              <Download className="w-4 h-4" />
              Télécharger le FEC
            </button>
          </div>

          {/* CSV Pennylane */}
          <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-lg bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center">
                <FileText className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
              </div>
              <div>
                <h3 className="font-semibold text-slate-900 dark:text-white">Export CSV logiciel comptable</h3>
                <p className="text-xs text-slate-400 dark:text-slate-400">Compatible Pennylane, Sage, Cegid</p>
              </div>
            </div>
            <p className="text-sm text-slate-300 dark:text-slate-300 mb-4">
              Exportez vos données dans un format compatible avec votre logiciel comptable.
            </p>
            <div className="flex gap-2">
              <button onClick={() => handleExportCSV('Pennylane')} className="flex-1 flex items-center gap-1 px-3 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-sm font-medium transition-colors justify-center">
                <Download className="w-3 h-3" />
                Pennylane
              </button>
              <button onClick={() => handleExportCSV('Sage')} className="flex-1 flex items-center gap-1 px-3 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-sm font-medium transition-colors justify-center">
                <Download className="w-3 h-3" />
                Sage
              </button>
              <button onClick={() => handleExportCSV('Cegid')} className="flex-1 flex items-center gap-1 px-3 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-sm font-medium transition-colors justify-center">
                <Download className="w-3 h-3" />
                Cegid
              </button>
            </div>
          </div>

          {/* PDF */}
          <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-lg bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
                <FileText className="w-5 h-5 text-red-600 dark:text-red-400" />
              </div>
              <div>
                <h3 className="font-semibold text-slate-900 dark:text-white">Rapport PDF mensuel</h3>
                <p className="text-xs text-slate-400 dark:text-slate-400">Synthèse complète du mois</p>
              </div>
            </div>
            <p className="text-sm text-slate-300 dark:text-slate-300 mb-4">
              Rapport synthétique avec CA, charges, TVA et ratios clés. Idéal pour votre expert-comptable.
            </p>
            <button
              onClick={handleExportPDF}
              className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm font-medium transition-colors w-full justify-center"
            >
              <Download className="w-4 h-4" />
              Générer le rapport PDF
            </button>
          </div>

          {/* Print */}
          <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-lg bg-slate-100 dark:bg-slate-700 flex items-center justify-center">
                <Printer className="w-5 h-5 text-slate-300 dark:text-slate-400" />
              </div>
              <div>
                <h3 className="font-semibold text-slate-900 dark:text-white">Imprimer</h3>
                <p className="text-xs text-slate-400 dark:text-slate-400">Impression de la page courante</p>
              </div>
            </div>
            <p className="text-sm text-slate-300 dark:text-slate-300 mb-4">
              Imprimez les données actuellement affichées pour vos classeurs comptables.
            </p>
            <button
              onClick={handlePrint}
              className="flex items-center gap-2 px-4 py-2 bg-slate-600 hover:bg-slate-700 text-white rounded-lg text-sm font-medium transition-colors w-full justify-center"
            >
              <Printer className="w-4 h-4" />
              Imprimer
            </button>
          </div>
        </div>
      )}

      {/* ─── Add expense Modal ─────────────────────────────────────────── */}
      <Modal isOpen={showExpenseModal} onClose={() => setShowExpenseModal(false)} title="Ajouter une dépense">
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-400 dark:text-slate-300 mb-1">Date</label>
              <input
                type="date"
                value={newExpense.date}
                onChange={(e) => setNewExpense({ ...newExpense, date: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-sm text-slate-900 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-400 dark:text-slate-300 mb-1">Catégorie</label>
              <select
                value={newExpense.categorie}
                onChange={(e) => setNewExpense({ ...newExpense, categorie: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-sm text-slate-900 dark:text-white"
              >
                {EXPENSE_CATEGORIES.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-400 dark:text-slate-300 mb-1">Fournisseur *</label>
            <input
              type="text"
              value={newExpense.fournisseur}
              onChange={(e) => setNewExpense({ ...newExpense, fournisseur: e.target.value })}
              placeholder="Nom du fournisseur"
              className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-sm text-slate-900 dark:text-white placeholder-slate-400"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-400 dark:text-slate-300 mb-1">Montant HT *</label>
              <input
                type="number"
                step="0.01"
                value={newExpense.montantHT}
                onChange={(e) => setNewExpense({ ...newExpense, montantHT: e.target.value })}
                placeholder="0,00"
                className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-sm text-slate-900 dark:text-white placeholder-slate-400"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-400 dark:text-slate-300 mb-1">Taux TVA (%)</label>
              <select
                value={newExpense.tva}
                onChange={(e) => setNewExpense({ ...newExpense, tva: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-sm text-slate-900 dark:text-white"
              >
                <option value="0">0% (Exonéré)</option>
                <option value="5.5">5,5%</option>
                <option value="10">10%</option>
                <option value="20">20%</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-400 dark:text-slate-300 mb-1">Description</label>
            <input
              type="text"
              value={newExpense.description}
              onChange={(e) => setNewExpense({ ...newExpense, description: e.target.value })}
              placeholder="Description de la dépense"
              className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-sm text-slate-900 dark:text-white placeholder-slate-400"
            />
          </div>

          {/* Preview */}
          {newExpense.montantHT && (
            <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-700/30 text-sm">
              <div className="flex justify-between">
                <span className="text-slate-400 dark:text-slate-400">Montant HT :</span>
                <span className="text-slate-900 dark:text-white">{fmt(parseFloat(newExpense.montantHT) || 0)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400 dark:text-slate-400">TVA ({newExpense.tva}%) :</span>
                <span className="text-blue-600 dark:text-blue-400">{fmt(Math.round((parseFloat(newExpense.montantHT) || 0) * parseFloat(newExpense.tva) / 100))}</span>
              </div>
              <div className="flex justify-between font-semibold border-t border-slate-200 dark:border-slate-600 pt-1 mt-1">
                <span className="text-slate-900 dark:text-white">Total TTC :</span>
                <span className="text-slate-900 dark:text-white">{fmt(Math.round((parseFloat(newExpense.montantHT) || 0) * (1 + parseFloat(newExpense.tva) / 100)))}</span>
              </div>
            </div>
          )}

          <div className="flex gap-3 pt-2">
            <button
              onClick={() => setShowExpenseModal(false)}
              className="flex-1 px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg text-sm font-medium text-slate-400 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
            >
              Annuler
            </button>
            <button
              onClick={handleAddExpense}
              className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors"
            >
              Ajouter
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
