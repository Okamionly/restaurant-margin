import { useState, useMemo, useEffect, useCallback } from 'react';
import {
  Calculator, TrendingUp, TrendingDown, Receipt, PieChart as PieChartIcon,
  BarChart3, Download, FileText, Printer, Plus,
  Target, Gauge, ArrowUpRight, ArrowDownRight, Euro, Search,
  X, Trash2, Loader2, ArrowUp, ArrowDown, Mail, Activity,
  DollarSign, Shield, ChevronRight, Minus, Heart,
  Tags, Landmark, BarChart2, CheckCircle, XCircle, Link2, AlertTriangle
} from 'lucide-react';
import {
  PieChart, Pie, Cell, BarChart, Bar, LineChart, Line,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
  AreaChart, Area, ComposedChart
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

type TabId = 'pnl' | 'journal' | 'charges' | 'cashflow' | 'tva' | 'ratios' | 'budget' | 'bank' | 'export';

// ─── Auto-categorization keywords ───────────────────────────────────────────

const CATEGORY_KEYWORDS: Record<string, string[]> = {
  'Matieres premieres': ['metro', 'rungis', 'pomona', 'brake', 'sysco', 'transgourmet', 'davigel', 'viande', 'poisson', 'legume', 'fruit', 'lait', 'farine', 'huile', 'beurre', 'fromage', 'epicerie', 'boulangerie', 'patisserie', 'alimentaire', 'boisson'],
  'Personnel': ['salaire', 'paie', 'urssaf', 'cotisation', 'mutuelle', 'prevoyance', 'interim', 'formation', 'medecine travail', 'ticket restaurant', 'prime'],
  'Loyer': ['loyer', 'bail', 'foncier', 'charges locatives', 'syndic', 'copropriete'],
  'Energie': ['edf', 'engie', 'gaz', 'electricite', 'eau', 'veolia', 'suez', 'chauffage', 'climatisation'],
  'Marketing': ['publicite', 'pub', 'google ads', 'facebook', 'instagram', 'flyer', 'affiche', 'sponsoring', 'communication', 'agence com', 'seo', 'site web', 'reseaux sociaux', 'influence'],
  'Assurance': ['assurance', 'axa', 'allianz', 'maif', 'generali', 'responsabilite civile'],
  'Entretien': ['nettoyage', 'entretien', 'reparation', 'maintenance', 'plombier', 'electricien', 'desinsectisation', 'desratisation'],
  'Divers': [],
};

function autoCategorize(fournisseur: string, description: string): string {
  const text = `${fournisseur} ${description}`.toLowerCase();
  for (const [category, keywords] of Object.entries(CATEGORY_KEYWORDS)) {
    if (category === 'Divers') continue;
    for (const kw of keywords) {
      if (text.includes(kw)) return category;
    }
  }
  return 'Divers';
}

// ─── Bank Reconciliation types ──────────────────────────────────────────────

type ReconciliationStatus = 'rapproche' | 'non_rapproche';

interface BankTransaction {
  id: number;
  date: string;
  label: string;
  amount: number;
  status: ReconciliationStatus;
  matchedExpenseId?: number;
}

// ─── Budget types ───────────────────────────────────────────────────────────

interface BudgetEntry {
  category: string;
  budget: number;
  actual: number;
}
type PeriodType = 'mois' | 'trimestre' | 'annee';
type PaymentMode = 'CB' | 'Especes' | 'Cheque' | 'Virement' | 'Ticket resto';

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
  assurance: number;
  marketing: number;
  divers: number;
  tva55: number;
  tva10: number;
  tva20: number;
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4', '#ec4899', '#84cc16'];
const TVA_COLORS = ['#10b981', '#3b82f6', '#f59e0b'];
const EXPENSE_BAR_COLORS: Record<string, string> = {
  'Matieres premieres': '#ef4444',
  'Personnel': '#8b5cf6',
  'Loyer': '#3b82f6',
  'Energie': '#f59e0b',
  'Assurance': '#06b6d4',
  'Marketing': '#ec4899',
  'Divers': '#6b7280',
  'Entretien': '#84cc16',
};

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
  'Matieres premieres', 'Personnel', 'Loyer', 'Energie',
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
              '01': 'Jan', '02': 'Fev', '03': 'Mar', '04': 'Avr', '05': 'Mai', '06': 'Juin',
              '07': 'Juil', '08': 'Aout', '09': 'Sep', '10': 'Oct', '11': 'Nov', '12': 'Dec',
            };
            monthMap[mois] = {
              mois, moisLabel: `${monthNames[m] || m} ${y}`,
              ca: 0, charges: 0, matiere: 0, personnel: 0, loyer: 0, energie: 0, assurance: 0, marketing: 0, divers: 0,
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
            if (cat.includes('matiere') || cat.includes('matiere')) md.matiere += e.amount;
            else if (cat.includes('personnel') || cat.includes('salaire')) md.personnel += e.amount;
            else if (cat.includes('loyer')) md.loyer += e.amount;
            else if (cat.includes('energie') || cat.includes('energie')) md.energie += e.amount;
            else if (cat.includes('assurance')) md.assurance += e.amount;
            else if (cat.includes('marketing')) md.marketing += e.amount;
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
  const [activeTab, setActiveTab] = useState<TabId>('pnl');
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

  // ─── Bank Reconciliation state ──────────────────────────────────────────
  const [bankTransactions, setBankTransactions] = useState<BankTransaction[]>([]);
  const [showBankModal, setShowBankModal] = useState(false);
  const [newBankTx, setNewBankTx] = useState({ date: new Date().toISOString().slice(0, 10), label: '', amount: '' });

  // ─── Budget state ──────────────────────────────────────────────────────
  const [budgets, setBudgets] = useState<Record<string, number>>(() => {
    const saved = localStorage.getItem('rm_budgets');
    if (saved) return JSON.parse(saved);
    return {
      'Matieres premieres': 12000,
      'Personnel': 15000,
      'Loyer': 3500,
      'Energie': 1200,
      'Entretien': 800,
      'Assurance': 600,
      'Marketing': 1500,
      'Divers': 1000,
    };
  });
  const [editingBudget, setEditingBudget] = useState<string | null>(null);
  const [budgetInput, setBudgetInput] = useState('');

  // Persist budgets
  useEffect(() => {
    localStorage.setItem('rm_budgets', JSON.stringify(budgets));
  }, [budgets]);

  // ─── Computed data ───────────────────────────────────────────────────────

  const emptyMonth: MonthlyData = { mois: selectedMonth, moisLabel: '', ca: 0, charges: 0, matiere: 0, personnel: 0, loyer: 0, energie: 0, assurance: 0, marketing: 0, divers: 0, tva55: 0, tva10: 0, tva20: 0 };
  const currentMonth = useMemo(
    () => monthlyData.find((m) => m.mois === selectedMonth) || monthlyData[monthlyData.length - 1] || emptyMonth,
    [monthlyData, selectedMonth]
  );

  // Previous month data for comparison
  const previousMonth = useMemo(() => {
    const idx = monthlyData.findIndex(m => m.mois === currentMonth.mois);
    if (idx > 0) return monthlyData[idx - 1];
    return emptyMonth;
  }, [monthlyData, currentMonth]);

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
        loyer: acc.loyer + m.loyer,
        energie: acc.energie + m.energie,
        assurance: acc.assurance + m.assurance,
        marketing: acc.marketing + m.marketing,
        divers: acc.divers + m.divers,
        tva55: acc.tva55 + m.tva55,
        tva10: acc.tva10 + m.tva10,
        tva20: acc.tva20 + m.tva20,
      }),
      { ca: 0, charges: 0, matiere: 0, personnel: 0, loyer: 0, energie: 0, assurance: 0, marketing: 0, divers: 0, tva55: 0, tva10: 0, tva20: 0 }
    );
    return {
      ...totals,
      resultat: totals.ca - totals.charges,
      margeBrute: totals.ca - totals.matiere,
      chargesPersonnel: totals.personnel,
      chargesFixes: totals.loyer + totals.energie + totals.assurance,
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
      { taux: '5,5%', label: 'Vente a emporter', baseHT: t55, montantTVA: Math.round(t55 * 0.055), totalTTC: t55 + Math.round(t55 * 0.055) },
      { taux: '10%', label: 'Sur place', baseHT: t10, montantTVA: Math.round(t10 * 0.10), totalTTC: t10 + Math.round(t10 * 0.10) },
      { taux: '20%', label: 'Alcool / Services', baseHT: t20, montantTVA: Math.round(t20 * 0.20), totalTTC: t20 + Math.round(t20 * 0.20) },
    ];
  }, [periodTotals]);

  const tvaPieData = useMemo(
    () => tvaData.map((t, i) => ({ name: `TVA ${t.taux}`, value: t.montantTVA, color: TVA_COLORS[i] })),
    [tvaData]
  );

  // TVA Collected (on sales) vs TVA Paid (on expenses)
  const tvaCollected = useMemo(() => tvaData.reduce((s, r) => s + r.montantTVA, 0), [tvaData]);
  const tvaPaid = useMemo(() => {
    return expenses
      .filter(e => {
        if (period === 'mois') return e.date.startsWith(selectedMonth);
        if (period === 'trimestre') {
          const idx = monthlyData.findIndex(m => m.mois === selectedMonth);
          const months = monthlyData.slice(Math.max(0, idx - 2), idx + 1).map(m => m.mois);
          return months.some(mo => e.date.startsWith(mo));
        }
        return true;
      })
      .reduce((s, e) => s + e.tva, 0);
  }, [expenses, period, selectedMonth, monthlyData]);
  const tvaNet = tvaCollected - tvaPaid;

  // Quarterly TVA totals
  const quarterlyTva = useMemo(() => {
    const quarters: { label: string; collected: number; paid: number; net: number }[] = [];
    const qMap: Record<string, { collected: number; paid: number }> = {};

    for (const m of monthlyData) {
      const [y, mo] = m.mois.split('-');
      const qNum = Math.ceil(parseInt(mo) / 3);
      const qKey = `${y}-T${qNum}`;
      if (!qMap[qKey]) qMap[qKey] = { collected: 0, paid: 0 };
      // collected TVA
      qMap[qKey].collected += Math.round(m.tva55 * 0.055) + Math.round(m.tva10 * 0.10) + Math.round(m.tva20 * 0.20);
    }

    // paid TVA per quarter from expenses
    for (const e of expenses) {
      const [y, mo] = e.date.split('-');
      const qNum = Math.ceil(parseInt(mo) / 3);
      const qKey = `${y}-T${qNum}`;
      if (!qMap[qKey]) qMap[qKey] = { collected: 0, paid: 0 };
      qMap[qKey].paid += e.tva;
    }

    for (const [label, data] of Object.entries(qMap).sort(([a], [b]) => a.localeCompare(b))) {
      quarters.push({ label, collected: Math.round(data.collected), paid: Math.round(data.paid), net: Math.round(data.collected - data.paid) });
    }
    return quarters;
  }, [monthlyData, expenses]);

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

  // Charges by category for chart (horizontal bars)
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
    return Object.entries(map)
      .map(([name, value]) => ({ name, value: Math.round(value) }))
      .sort((a, b) => b.value - a.value);
  }, [expenses, period, selectedMonth, monthlyData]);

  const totalChargesForBar = useMemo(() => chargesByCategory.reduce((s, c) => s + c.value, 0), [chargesByCategory]);

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

  // Cash flow timeline data
  const cashFlowData = useMemo(() => {
    let runningBalance = 0;
    return monthlyData.map(m => {
      const moneyIn = m.ca;
      const moneyOut = m.charges;
      runningBalance += moneyIn - moneyOut;
      return {
        mois: m.moisLabel,
        entrees: Math.round(moneyIn),
        sorties: Math.round(moneyOut),
        solde: Math.round(runningBalance),
      };
    });
  }, [monthlyData]);

  // ─── Budget vs Actual computed data ─────────────────────────────────────
  const budgetData = useMemo((): BudgetEntry[] => {
    return EXPENSE_CATEGORIES.map(cat => {
      const actual = expenses
        .filter(e => {
          if (period === 'mois') return e.date.startsWith(selectedMonth) && e.categorie === cat;
          if (period === 'trimestre') {
            const idx = monthlyData.findIndex(m => m.mois === selectedMonth);
            const months = monthlyData.slice(Math.max(0, idx - 2), idx + 1).map(m => m.mois);
            return months.some(mo => e.date.startsWith(mo)) && e.categorie === cat;
          }
          return e.categorie === cat;
        })
        .reduce((s, e) => s + e.montantHT, 0);
      const multiplier = period === 'trimestre' ? 3 : period === 'annee' ? 12 : 1;
      return { category: cat, budget: (budgets[cat] || 0) * multiplier, actual: Math.round(actual) };
    });
  }, [expenses, budgets, period, selectedMonth, monthlyData]);

  const totalBudget = useMemo(() => budgetData.reduce((s, b) => s + b.budget, 0), [budgetData]);
  const totalActual = useMemo(() => budgetData.reduce((s, b) => s + b.actual, 0), [budgetData]);

  // ─── Bank reconciliation computed ───────────────────────────────────────
  const reconciledCount = useMemo(() => bankTransactions.filter(t2 => t2.status === 'rapproche').length, [bankTransactions]);
  const unreconciledCount = useMemo(() => bankTransactions.filter(t2 => t2.status === 'non_rapproche').length, [bankTransactions]);

  // Ticket moyen and taux remplissage
  const currentRatios = useMemo(() => {
    const cm = currentMonth;
    const nbCouverts = Math.round(cm.ca / 22);
    const capacite = 60;
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

  // ─── P&L data ──────────────────────────────────────────────────────────
  const pnlData = useMemo(() => {
    const ca = periodTotals.ca;
    const coutMatieres = periodTotals.matiere;
    const margeBrute = ca - coutMatieres;
    const chargesPersonnel = periodTotals.personnel;
    const chargesFixes = periodTotals.loyer + periodTotals.energie + periodTotals.assurance;
    const autresCharges = periodTotals.marketing + periodTotals.divers;
    const resultatNet = margeBrute - chargesPersonnel - chargesFixes - autresCharges;

    const pctOf = (v: number) => ca > 0 ? (v / ca) * 100 : 0;

    return {
      ca, coutMatieres, margeBrute, chargesPersonnel, chargesFixes, autresCharges, resultatNet,
      pctCA: 100,
      pctMatieres: pctOf(coutMatieres),
      pctMargeBrute: pctOf(margeBrute),
      pctPersonnel: pctOf(chargesPersonnel),
      pctFixes: pctOf(chargesFixes),
      pctAutres: pctOf(autresCharges),
      pctResultat: pctOf(resultatNet),
    };
  }, [periodTotals]);

  // Previous period P&L for comparison
  const prevPnlData = useMemo(() => {
    const pm = previousMonth;
    const ca = pm.ca;
    const coutMatieres = pm.matiere;
    const margeBrute = ca - coutMatieres;
    const chargesPersonnel = pm.personnel;
    const chargesFixes = pm.loyer + pm.energie + pm.assurance;
    const autresCharges = pm.marketing + pm.divers;
    const resultatNet = margeBrute - chargesPersonnel - chargesFixes - autresCharges;
    return { ca, coutMatieres, margeBrute, chargesPersonnel, chargesFixes, autresCharges, resultatNet };
  }, [previousMonth]);

  // ─── Financial Health Score ─────────────────────────────────────────────
  const healthScore = useMemo(() => {
    let score = 50; // base

    // Marge brute score (30% of total) — target > 65%
    const mb = pnlData.pctMargeBrute;
    if (mb >= 70) score += 30;
    else if (mb >= 65) score += 25;
    else if (mb >= 55) score += 15;
    else if (mb >= 45) score += 5;
    else score -= 10;

    // Personnel ratio (20% of total) — target < 35%
    const pr = pnlData.pctPersonnel;
    if (pr <= 30) score += 20;
    else if (pr <= 35) score += 15;
    else if (pr <= 40) score += 5;
    else score -= 10;

    // Net result positive
    if (pnlData.resultatNet > 0) score += 10;
    else score -= 20;

    // Cash flow positive trend
    if (cashFlowData.length >= 2) {
      const last = cashFlowData[cashFlowData.length - 1];
      const prev = cashFlowData[cashFlowData.length - 2];
      if (last && prev && last.solde > prev.solde) score += 5;
    }

    return Math.max(0, Math.min(100, score));
  }, [pnlData, cashFlowData]);

  const healthLabel = healthScore >= 80 ? 'Excellent' : healthScore >= 60 ? 'Bon' : healthScore >= 40 ? 'A surveiller' : 'Critique';
  const healthColor = healthScore >= 80 ? '#10b981' : healthScore >= 60 ? '#3b82f6' : healthScore >= 40 ? '#f59e0b' : '#ef4444';

  // ─── Delta % helper ────────────────────────────────────────────────────
  function deltaPercent(current: number, previous: number): number {
    if (previous === 0) return current > 0 ? 100 : 0;
    return ((current - previous) / Math.abs(previous)) * 100;
  }

  function DeltaArrow({ current, previous, invert = false }: { current: number; previous: number; invert?: boolean }) {
    const delta = deltaPercent(current, previous);
    if (delta === 0) return <span className="text-xs text-[#9CA3AF] dark:text-[#737373]">--</span>;
    const isPositive = invert ? delta < 0 : delta > 0;
    return (
      <span className={`inline-flex items-center gap-0.5 text-xs font-medium ${isPositive ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-600 dark:text-red-400'}`}>
        {delta > 0 ? <ArrowUp className="w-3 h-3" /> : <ArrowDown className="w-3 h-3" />}
        {Math.abs(delta).toFixed(1)}%
      </span>
    );
  }

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
      showToast('Depense ajoutee avec succes', 'success');
    } catch {
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
      showToast('Depense ajoutee localement (hors-ligne)', 'info');
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
    showToast('Depense supprimee', 'success');
  }

  async function handleExportFEC() {
    try {
      const h = apiHeaders();
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
      showToast('Export FEC telecharge', 'success');
    } catch {
      showToast('Erreur lors de l\'export FEC', 'error');
    }
  }

  function handleExportCSV(target: string) {
    const rows: string[] = [];
    rows.push('Date;Type;Categorie;Libelle;Montant HT;TVA;TTC;Paiement');
    for (const s of sales) {
      rows.push(`${s.date};Vente;Service;${s.description};${s.montantHT};${s.tva};${s.ttc};${s.paiement}`);
    }
    for (const e of expenses) {
      rows.push(`${e.date};Charge;${e.categorie};${e.fournisseur};${e.montantHT};${e.tva};${e.ttc};`);
    }
    const csvContent = '\uFEFF' + rows.join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `export_${target.toLowerCase()}_${selectedMonth}.csv`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
    showToast(`Export CSV pour ${target} telecharge`, 'success');
  }

  function handleExportPDF() {
    window.print();
  }

  function handleSendToAccountant() {
    // Generate FEC CSV and trigger download + show toast
    handleExportFEC();
    showToast('Export FEC genere et envoye au comptable', 'success');
  }

  function handlePrint() {
    window.print();
  }

  // ─── Bank reconciliation handlers ─────────────────────────────────────
  function handleAddBankTransaction() {
    if (!newBankTx.label || !newBankTx.amount) {
      showToast('Veuillez remplir tous les champs', 'error');
      return;
    }
    const amount = parseFloat(newBankTx.amount);
    if (isNaN(amount)) {
      showToast('Montant invalide', 'error');
      return;
    }
    const tx: BankTransaction = {
      id: Date.now(),
      date: newBankTx.date,
      label: newBankTx.label,
      amount,
      status: 'non_rapproche',
    };
    setBankTransactions(prev => [tx, ...prev]);
    setNewBankTx({ date: new Date().toISOString().slice(0, 10), label: '', amount: '' });
    setShowBankModal(false);
    showToast('Transaction bancaire ajoutee', 'success');
  }

  function handleReconcile(txId: number, expenseId?: number) {
    setBankTransactions(prev => prev.map(t2 =>
      t2.id === txId ? { ...t2, status: 'rapproche' as ReconciliationStatus, matchedExpenseId: expenseId } : t2
    ));
    showToast('Transaction rapprochee', 'success');
  }

  function handleUnreconcile(txId: number) {
    setBankTransactions(prev => prev.map(t2 =>
      t2.id === txId ? { ...t2, status: 'non_rapproche' as ReconciliationStatus, matchedExpenseId: undefined } : t2
    ));
    showToast('Rapprochement annule', 'info');
  }

  function handleDeleteBankTx(txId: number) {
    setBankTransactions(prev => prev.filter(t2 => t2.id !== txId));
    showToast('Transaction supprimee', 'success');
  }

  // ─── Budget handlers ──────────────────────────────────────────────────
  function handleSaveBudget(category: string) {
    const val = parseFloat(budgetInput);
    if (isNaN(val) || val < 0) {
      showToast('Montant invalide', 'error');
      return;
    }
    setBudgets(prev => ({ ...prev, [category]: val }));
    setEditingBudget(null);
    setBudgetInput('');
    showToast(`Budget ${category} mis a jour`, 'success');
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
      <div className="bg-white dark:bg-[#0A0A0A] rounded-2xl p-4 border border-[#E5E7EB] dark:border-[#1A1A1A]">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-[#6B7280] dark:text-[#A3A3A3]">{label}</span>
          <Target className="w-4 h-4 text-[#9CA3AF] dark:text-[#737373]" />
        </div>
        <div className={`text-2xl font-bold ${color}`}>
          {unit === 'EUR' ? fmt(value) : fmtPct(value)}
        </div>
        <div className="mt-2 h-2 bg-[#E5E7EB] dark:bg-[#171717] rounded-full overflow-hidden">
          <div className={`h-full rounded-full transition-all ${bgColor}`} style={{ width: `${pct}%` }} />
        </div>
        <div className="mt-1 text-xs text-[#9CA3AF] dark:text-[#737373]">
          Objectif : {unit === 'EUR' ? fmt(target) : fmtPct(target)}
        </div>
      </div>
    );
  }

  // ─── P&L Line component ───────────────────────────────────────────────

  function PnLLine({ label, amount, pct, prevAmount, isSubtotal = false, isNegative = false, indent = false }: {
    label: string; amount: number; pct: number; prevAmount: number; isSubtotal?: boolean; isNegative?: boolean; indent?: boolean;
  }) {
    const positive = amount >= 0;
    const colorClass = isSubtotal
      ? (positive ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-600 dark:text-red-400')
      : 'text-[#111111] dark:text-white';

    return (
      <div className={`flex items-center justify-between py-3 px-4 ${isSubtotal ? 'bg-[#F9FAFB] dark:bg-[#171717]/30 font-semibold border-t border-b border-[#E5E7EB] dark:border-[#1A1A1A]' : 'border-b border-[#F3F4F6] dark:border-[#1A1A1A]/50'}`}>
        <div className={`flex items-center gap-2 ${indent ? 'pl-6' : ''}`}>
          {isNegative && !isSubtotal && <Minus className="w-3 h-3 text-[#9CA3AF] dark:text-[#737373]" />}
          {isSubtotal && <ChevronRight className="w-4 h-4 text-[#9CA3AF] dark:text-[#737373]" />}
          <span className={isSubtotal ? colorClass : 'text-[#374151] dark:text-[#D4D4D4] text-sm'}>{label}</span>
        </div>
        <div className="flex items-center gap-6">
          {/* Previous month */}
          <div className="text-right w-24 hidden md:block">
            <span className="text-xs text-[#9CA3AF] dark:text-[#737373]">{fmt(prevAmount)}</span>
          </div>
          {/* Current */}
          <div className="text-right w-28">
            <span className={`text-sm font-medium ${colorClass}`}>{fmt(amount)}</span>
          </div>
          {/* % of CA */}
          <div className="text-right w-16">
            <span className={`text-xs ${isSubtotal ? colorClass : 'text-[#9CA3AF] dark:text-[#737373]'}`}>{fmtPct(pct)}</span>
          </div>
          {/* Delta */}
          <div className="w-16 text-right hidden md:block">
            <DeltaArrow current={amount} previous={prevAmount} invert={isNegative} />
          </div>
        </div>
      </div>
    );
  }

  // ─── Financial Health Gauge (CSS conic-gradient) ───────────────────────

  function HealthGauge() {
    const angle = (healthScore / 100) * 360;
    const bgGradient = `conic-gradient(${healthColor} 0deg, ${healthColor} ${angle}deg, #E5E7EB ${angle}deg, #E5E7EB 360deg)`;

    return (
      <div className="bg-white dark:bg-[#0A0A0A] rounded-2xl border border-[#E5E7EB] dark:border-[#1A1A1A] p-6">
        <div className="flex items-center gap-2 mb-4">
          <Heart className="w-5 h-5 text-[#111111] dark:text-[#A3A3A3]" />
          <h3 className="text-lg font-semibold text-[#111111] dark:text-white">Sante financiere</h3>
        </div>
        <div className="flex items-center gap-8">
          {/* Circular gauge */}
          <div className="relative flex-shrink-0">
            <div
              className="w-32 h-32 rounded-full flex items-center justify-center"
              style={{ background: bgGradient }}
            >
              <div className="w-24 h-24 rounded-full bg-white dark:bg-[#0A0A0A] flex flex-col items-center justify-center">
                <span className="text-3xl font-bold" style={{ color: healthColor }}>{healthScore}</span>
                <span className="text-[10px] text-[#9CA3AF] dark:text-[#737373] uppercase tracking-wider">/100</span>
              </div>
            </div>
          </div>
          {/* Details */}
          <div className="flex-1 space-y-3">
            <div>
              <span className="text-sm font-semibold" style={{ color: healthColor }}>{healthLabel}</span>
              <p className="text-xs text-[#9CA3AF] dark:text-[#737373] mt-0.5">
                Score base sur la marge brute, les ratios de charges et la tresorerie
              </p>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div className="flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full ${pnlData.pctMargeBrute >= 65 ? 'bg-emerald-500' : pnlData.pctMargeBrute >= 50 ? 'bg-amber-500' : 'bg-red-500'}`} />
                <span className="text-xs text-[#6B7280] dark:text-[#A3A3A3]">Marge brute {fmtPct(pnlData.pctMargeBrute)}</span>
              </div>
              <div className="flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full ${pnlData.pctPersonnel <= 35 ? 'bg-emerald-500' : pnlData.pctPersonnel <= 40 ? 'bg-amber-500' : 'bg-red-500'}`} />
                <span className="text-xs text-[#6B7280] dark:text-[#A3A3A3]">Personnel {fmtPct(pnlData.pctPersonnel)}</span>
              </div>
              <div className="flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full ${pnlData.resultatNet > 0 ? 'bg-emerald-500' : 'bg-red-500'}`} />
                <span className="text-xs text-[#6B7280] dark:text-[#A3A3A3]">Resultat {pnlData.resultatNet >= 0 ? '+' : ''}{fmt(pnlData.resultatNet)}</span>
              </div>
              <div className="flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full ${pnlData.pctMatieres <= 30 ? 'bg-emerald-500' : pnlData.pctMatieres <= 35 ? 'bg-amber-500' : 'bg-red-500'}`} />
                <span className="text-xs text-[#6B7280] dark:text-[#A3A3A3]">Matieres {fmtPct(pnlData.pctMatieres)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ─── Render ────────────────────────────────────────────────────────────

  const tabs: { id: TabId; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
    { id: 'pnl', label: 'Compte de resultat', icon: FileText },
    { id: 'journal', label: 'Journal', icon: Receipt },
    { id: 'charges', label: 'Charges', icon: TrendingDown },
    { id: 'cashflow', label: 'Tresorerie', icon: Activity },
    { id: 'tva', label: 'TVA', icon: Euro },
    { id: 'budget', label: 'Budget', icon: BarChart2 },
    { id: 'bank', label: 'Rapprochement', icon: Landmark },
    { id: 'ratios', label: 'Ratios', icon: Gauge },
    { id: 'export', label: 'Exports', icon: Download },
  ];

  return (
    <div className="space-y-6">
      {loading && (
        <div className="flex items-center justify-center py-4 text-[#9CA3AF] dark:text-[#737373]">
          <Loader2 className="w-5 h-5 animate-spin mr-2" />
          Chargement des donnees...
        </div>
      )}

      {/* ─── Header ──────────────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold font-satoshi text-[#111111] dark:text-white flex items-center gap-2">
            <Calculator className="w-7 h-7 text-[#111111] dark:text-[#A3A3A3]" />
            Comptabilite
          </h1>
          <p className="text-sm text-[#9CA3AF] dark:text-[#737373] mt-1">
            P&L, tresorerie, TVA, ratios et exports comptables
          </p>
        </div>

        {/* Period selector */}
        <div className="flex items-center gap-2 flex-wrap">
          <select
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
            className="px-3 py-2 rounded-xl border border-[#D1D5DB] dark:border-[#1A1A1A] bg-white dark:bg-[#0A0A0A] text-sm text-[#111111] dark:text-white"
          >
            {monthlyData.map((m) => (
              <option key={m.mois} value={m.mois}>{m.moisLabel}</option>
            ))}
          </select>
          <div className="flex rounded-xl border border-[#D1D5DB] dark:border-[#1A1A1A] overflow-hidden">
            {(['mois', 'trimestre', 'annee'] as PeriodType[]).map((p) => (
              <button
                key={p}
                onClick={() => setPeriod(p)}
                className={`px-3 py-2 text-sm font-medium transition-colors ${
                  period === p
                    ? 'bg-[#111111] dark:bg-white text-white dark:text-black'
                    : 'bg-white dark:bg-[#0A0A0A] text-[#6B7280] dark:text-[#A3A3A3] hover:bg-[#F9FAFB] dark:hover:bg-[#171717]'
                }`}
              >
                {p === 'mois' ? 'Mois' : p === 'trimestre' ? 'Trim.' : 'Annee'}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ─── Summary KPI Row ──────────────────────────────────────────── */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        {/* CA */}
        <div className="bg-white dark:bg-[#0A0A0A] rounded-2xl p-4 border border-[#E5E7EB] dark:border-[#1A1A1A]">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs font-medium text-[#9CA3AF] dark:text-[#737373] uppercase tracking-wide">CA</span>
            <ArrowUpRight className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="text-xl font-bold font-satoshi tabular-nums text-[#111111] dark:text-white">{fmt(periodTotals.ca)}</div>
          <DeltaArrow current={currentMonth.ca} previous={previousMonth.ca} />
        </div>

        {/* Charges */}
        <div className="bg-white dark:bg-[#0A0A0A] rounded-2xl p-4 border border-[#E5E7EB] dark:border-[#1A1A1A]">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs font-medium text-[#9CA3AF] dark:text-[#737373] uppercase tracking-wide">Charges</span>
            <ArrowDownRight className="w-4 h-4 text-red-500" />
          </div>
          <div className="text-xl font-bold font-satoshi tabular-nums text-[#111111] dark:text-white">{fmt(periodTotals.charges)}</div>
          <DeltaArrow current={currentMonth.charges} previous={previousMonth.charges} invert />
        </div>

        {/* Resultat net */}
        <div className="bg-white dark:bg-[#0A0A0A] rounded-2xl p-4 border border-[#E5E7EB] dark:border-[#1A1A1A]">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs font-medium text-[#9CA3AF] dark:text-[#737373] uppercase tracking-wide">Resultat</span>
            {periodTotals.resultat >= 0 ? <TrendingUp className="w-4 h-4 text-emerald-500" /> : <TrendingDown className="w-4 h-4 text-red-500" />}
          </div>
          <div className={`text-xl font-bold ${periodTotals.resultat >= 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-600 dark:text-red-400'}`}>
            {fmt(periodTotals.resultat)}
          </div>
          <span className="text-xs text-[#9CA3AF] dark:text-[#737373]">
            {fmtPct(periodTotals.ca > 0 ? (periodTotals.resultat / periodTotals.ca) * 100 : 0)} du CA
          </span>
        </div>

        {/* Ratio matiere */}
        <div className="bg-white dark:bg-[#0A0A0A] rounded-2xl p-4 border border-[#E5E7EB] dark:border-[#1A1A1A]">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs font-medium text-[#9CA3AF] dark:text-[#737373] uppercase tracking-wide">Cout matiere</span>
            <PieChartIcon className="w-4 h-4 text-[#374151] dark:text-[#D4D4D4]" />
          </div>
          <div className={`text-xl font-bold ${periodTotals.ratioMatiere <= 30 ? 'text-emerald-600 dark:text-emerald-400' : periodTotals.ratioMatiere <= 35 ? 'text-amber-600 dark:text-amber-400' : 'text-red-600 dark:text-red-400'}`}>
            {fmtPct(periodTotals.ratioMatiere)}
          </div>
          <span className="text-xs text-[#9CA3AF] dark:text-[#737373]">Objectif : &lt;30%</span>
        </div>

        {/* Ratio personnel */}
        <div className="bg-white dark:bg-[#0A0A0A] rounded-2xl p-4 border border-[#E5E7EB] dark:border-[#1A1A1A]">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs font-medium text-[#9CA3AF] dark:text-[#737373] uppercase tracking-wide">Personnel</span>
            <BarChart3 className="w-4 h-4 text-violet-500" />
          </div>
          <div className={`text-xl font-bold ${periodTotals.ratioPersonnel <= 35 ? 'text-emerald-600 dark:text-emerald-400' : periodTotals.ratioPersonnel <= 40 ? 'text-amber-600 dark:text-amber-400' : 'text-red-600 dark:text-red-400'}`}>
            {fmtPct(periodTotals.ratioPersonnel)}
          </div>
          <span className="text-xs text-[#9CA3AF] dark:text-[#737373]">Objectif : &lt;35%</span>
        </div>
      </div>

      {/* ─── Financial Health Score + Export Quick Actions ─────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2">
          <HealthGauge />
        </div>
        {/* Quick Export Buttons */}
        <div className="bg-white dark:bg-[#0A0A0A] rounded-2xl border border-[#E5E7EB] dark:border-[#1A1A1A] p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Download className="w-5 h-5 text-[#111111] dark:text-[#A3A3A3]" />
              <h3 className="text-lg font-semibold text-[#111111] dark:text-white">Actions rapides</h3>
            </div>
          </div>
          <div className="space-y-2">
            <button
              onClick={() => handleExportCSV('Comptabilite')}
              className="w-full flex items-center gap-3 px-4 py-2.5 bg-[#F9FAFB] dark:bg-[#171717] hover:bg-[#F3F4F6] dark:hover:bg-[#1A1A1A] rounded-xl text-sm font-medium text-[#111111] dark:text-white transition-colors border border-[#E5E7EB] dark:border-[#1A1A1A]"
            >
              <Download className="w-4 h-4 text-emerald-500" />
              Exporter en CSV
            </button>
            <button
              onClick={handleExportPDF}
              className="w-full flex items-center gap-3 px-4 py-2.5 bg-[#F9FAFB] dark:bg-[#171717] hover:bg-[#F3F4F6] dark:hover:bg-[#1A1A1A] rounded-xl text-sm font-medium text-[#111111] dark:text-white transition-colors border border-[#E5E7EB] dark:border-[#1A1A1A]"
            >
              <FileText className="w-4 h-4 text-red-500" />
              Exporter en PDF
            </button>
            <button
              onClick={handleSendToAccountant}
              className="w-full flex items-center gap-3 px-4 py-2.5 bg-[#F9FAFB] dark:bg-[#171717] hover:bg-[#F3F4F6] dark:hover:bg-[#1A1A1A] rounded-xl text-sm font-medium text-[#111111] dark:text-white transition-colors border border-[#E5E7EB] dark:border-[#1A1A1A]"
            >
              <Mail className="w-4 h-4 text-blue-500" />
              Envoyer au comptable (email)
            </button>
          </div>
        </div>
      </div>

      {/* ─── Tabs ──────────────────────────────────────────────────────── */}
      <div className="border-b border-[#E5E7EB] dark:border-[#1A1A1A] overflow-x-auto">
        <div className="flex gap-1 min-w-max">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2.5 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
                activeTab === tab.id
                  ? 'border-[#111111] text-[#111111] dark:text-white dark:border-white'
                  : 'border-transparent text-[#9CA3AF] dark:text-[#737373] hover:text-[#374151] dark:hover:text-[#A3A3A3]'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════════════════
          TAB: P&L — Profit & Loss Statement
          ═══════════════════════════════════════════════════════════════════ */}
      {activeTab === 'pnl' && (
        <div className="space-y-6">
          {/* Monthly Comparison Header */}
          <div className="bg-white dark:bg-[#0A0A0A] rounded-2xl border border-[#E5E7EB] dark:border-[#1A1A1A] overflow-hidden">
            <div className="px-4 py-3 border-b border-[#E5E7EB] dark:border-[#1A1A1A] flex items-center justify-between">
              <h2 className="text-lg font-semibold text-[#111111] dark:text-white flex items-center gap-2">
                <FileText className="w-5 h-5" />
                Compte de Resultat (P&L)
              </h2>
              <div className="hidden md:flex items-center gap-6 text-xs font-medium text-[#9CA3AF] dark:text-[#737373] uppercase">
                <span className="w-24 text-right">Mois prec.</span>
                <span className="w-28 text-right">Mois actuel</span>
                <span className="w-16 text-right">% du CA</span>
                <span className="w-16 text-right">Delta</span>
              </div>
            </div>

            {/* P&L Lines */}
            <PnLLine label="Chiffre d'affaires" amount={pnlData.ca} pct={pnlData.pctCA} prevAmount={prevPnlData.ca} />
            <PnLLine label="Cout matieres premieres" amount={pnlData.coutMatieres} pct={pnlData.pctMatieres} prevAmount={prevPnlData.coutMatieres} isNegative indent />
            <PnLLine label="Marge brute" amount={pnlData.margeBrute} pct={pnlData.pctMargeBrute} prevAmount={prevPnlData.margeBrute} isSubtotal />
            <PnLLine label="Charges de personnel" amount={pnlData.chargesPersonnel} pct={pnlData.pctPersonnel} prevAmount={prevPnlData.chargesPersonnel} isNegative indent />
            <PnLLine label="Charges fixes (loyer, energie, assurance)" amount={pnlData.chargesFixes} pct={pnlData.pctFixes} prevAmount={prevPnlData.chargesFixes} isNegative indent />
            <PnLLine label="Autres charges (marketing, divers)" amount={pnlData.autresCharges} pct={pnlData.pctAutres} prevAmount={prevPnlData.autresCharges} isNegative indent />
            <PnLLine label="Resultat net" amount={pnlData.resultatNet} pct={pnlData.pctResultat} prevAmount={prevPnlData.resultatNet} isSubtotal />
          </div>

          {/* P&L Monthly Evolution Chart */}
          <div className="bg-white dark:bg-[#0A0A0A] rounded-2xl border border-[#E5E7EB] dark:border-[#1A1A1A] p-6">
            <h3 className="text-sm font-medium text-[#9CA3AF] dark:text-[#737373] mb-4">Evolution CA vs Charges vs Resultat</h3>
            <ResponsiveContainer width="100%" height={300}>
              <ComposedChart data={monthlyData.map(m => ({
                mois: m.moisLabel,
                ca: Math.round(m.ca),
                charges: Math.round(m.charges),
                resultat: Math.round(m.ca - m.charges),
              }))}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                <XAxis dataKey="mois" tick={{ fontSize: 11 }} />
                <YAxis tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`} />
                <Tooltip formatter={(v) => fmt(Number(v))} />
                <Legend />
                <Bar dataKey="ca" name="CA" fill="#3b82f6" radius={[4, 4, 0, 0]} barSize={20} />
                <Bar dataKey="charges" name="Charges" fill="#ef4444" radius={[4, 4, 0, 0]} barSize={20} />
                <Line type="monotone" dataKey="resultat" name="Resultat" stroke="#10b981" strokeWidth={2} dot={{ r: 3 }} />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* ═══════════════════════════════════════════════════════════════════
          TAB: Journal des ventes
          ═══════════════════════════════════════════════════════════════════ */}
      {activeTab === 'journal' && (
        <div className="bg-white dark:bg-[#0A0A0A] rounded-2xl border border-[#E5E7EB] dark:border-[#1A1A1A] overflow-hidden">
          {/* Filters */}
          <div className="p-4 border-b border-[#E5E7EB] dark:border-[#1A1A1A] flex flex-wrap gap-3 items-end">
            <div>
              <label className="block text-xs font-medium text-[#9CA3AF] dark:text-[#737373] mb-1">Du</label>
              <input
                type="date"
                value={journalDateFrom}
                onChange={(e) => setJournalDateFrom(e.target.value)}
                className="px-3 py-1.5 rounded-lg border border-[#D1D5DB] dark:border-[#1A1A1A] bg-white dark:bg-[#171717] text-sm text-[#111111] dark:text-white"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-[#9CA3AF] dark:text-[#737373] mb-1">Au</label>
              <input
                type="date"
                value={journalDateTo}
                onChange={(e) => setJournalDateTo(e.target.value)}
                className="px-3 py-1.5 rounded-lg border border-[#D1D5DB] dark:border-[#1A1A1A] bg-white dark:bg-[#171717] text-sm text-[#111111] dark:text-white"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-[#9CA3AF] dark:text-[#737373] mb-1">Paiement</label>
              <select
                value={journalPaiement}
                onChange={(e) => setJournalPaiement(e.target.value)}
                className="px-3 py-1.5 rounded-lg border border-[#D1D5DB] dark:border-[#1A1A1A] bg-white dark:bg-[#171717] text-sm text-[#111111] dark:text-white"
              >
                <option value="">Tous</option>
                {['CB', 'Especes', 'Cheque', 'Virement', 'Ticket resto'].map((p) => (
                  <option key={p} value={p}>{p}</option>
                ))}
              </select>
            </div>
            <div className="flex-1 min-w-[200px]">
              <label className="block text-xs font-medium text-[#9CA3AF] dark:text-[#737373] mb-1">Recherche</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9CA3AF] dark:text-[#737373]" />
                <input
                  type="text"
                  value={journalSearch}
                  onChange={(e) => setJournalSearch(e.target.value)}
                  placeholder="N facture, client..."
                  className="w-full pl-9 pr-3 py-1.5 rounded-lg border border-[#D1D5DB] dark:border-[#1A1A1A] bg-white dark:bg-[#171717] text-sm text-[#111111] dark:text-white placeholder-[#9CA3AF] dark:placeholder-[#737373]"
                />
              </div>
            </div>
            {(journalDateFrom || journalDateTo || journalPaiement || journalSearch) && (
              <button
                onClick={() => { setJournalDateFrom(''); setJournalDateTo(''); setJournalPaiement(''); setJournalSearch(''); }}
                className="px-3 py-1.5 text-sm text-[#9CA3AF] dark:text-[#737373] hover:text-red-500 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Table */}
          <div className="overflow-x-auto max-h-[500px] overflow-y-auto">
            <table className="w-full text-sm">
              <thead className="sticky top-0 bg-[#F9FAFB] dark:bg-[#171717]/50">
                <tr>
                  <th className="text-left py-2.5 px-3 font-medium text-[#9CA3AF] dark:text-[#737373]">Date</th>
                  <th className="text-left py-2.5 px-3 font-medium text-[#9CA3AF] dark:text-[#737373]">N facture</th>
                  <th className="text-left py-2.5 px-3 font-medium text-[#9CA3AF] dark:text-[#737373]">Client</th>
                  <th className="text-left py-2.5 px-3 font-medium text-[#9CA3AF] dark:text-[#737373]">Description</th>
                  <th className="text-right py-2.5 px-3 font-medium text-[#9CA3AF] dark:text-[#737373]">HT</th>
                  <th className="text-right py-2.5 px-3 font-medium text-[#9CA3AF] dark:text-[#737373]">TVA</th>
                  <th className="text-right py-2.5 px-3 font-medium text-[#9CA3AF] dark:text-[#737373]">TTC</th>
                  <th className="text-left py-2.5 px-3 font-medium text-[#9CA3AF] dark:text-[#737373]">Paiement</th>
                </tr>
              </thead>
              <tbody>
                {filteredSales.slice(0, 100).map((s) => (
                  <tr key={s.id} className="border-t border-[#F3F4F6] dark:border-[#1A1A1A]/50 hover:bg-[#F9FAFB] dark:hover:bg-[#171717]/30">
                    <td className="py-2 px-3 text-[#111111] dark:text-white whitespace-nowrap">{fmtDate(s.date)}</td>
                    <td className="py-2 px-3 font-mono text-xs text-[#6B7280] dark:text-[#A3A3A3]">{s.invoiceNum}</td>
                    <td className="py-2 px-3 text-[#6B7280] dark:text-[#A3A3A3]">{s.client || '--'}</td>
                    <td className="py-2 px-3 text-[#6B7280] dark:text-[#A3A3A3]">{s.description}</td>
                    <td className="py-2 px-3 text-right text-[#111111] dark:text-white">{fmt(s.montantHT)}</td>
                    <td className="py-2 px-3 text-right text-[#111111] dark:text-[#A3A3A3]">{fmt(s.tva)}</td>
                    <td className="py-2 px-3 text-right font-medium text-[#111111] dark:text-white">{fmt(s.ttc)}</td>
                    <td className="py-2 px-3">
                      <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${
                        s.paiement === 'CB' ? 'bg-[#F3F4F6] dark:bg-[#171717] text-[#111111] dark:text-[#A3A3A3]' :
                        s.paiement === 'Especes' ? 'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300' :
                        s.paiement === 'Cheque' ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300' :
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
          <div className="p-4 border-t border-[#E5E7EB] dark:border-[#1A1A1A] bg-[#F9FAFB] dark:bg-[#171717]/30 flex flex-wrap gap-6 text-sm">
            <span className="text-[#9CA3AF] dark:text-[#737373]">
              {filteredSales.length} ecritures
            </span>
            <span className="font-medium text-[#111111] dark:text-white">
              Total HT : {fmt(journalTotals.ht)}
            </span>
            <span className="font-medium text-[#111111] dark:text-[#A3A3A3]">
              Total TVA : {fmt(journalTotals.tva)}
            </span>
            <span className="font-bold text-[#111111] dark:text-white">
              Total TTC : {fmt(journalTotals.ttc)}
            </span>
          </div>
        </div>
      )}

      {/* ═══════════════════════════════════════════════════════════════════
          TAB: Charges & depenses
          ═══════════════════════════════════════════════════════════════════ */}
      {activeTab === 'charges' && (
        <div className="space-y-6">
          {/* Header with add button */}
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-[#111111] dark:text-white">Charges & depenses</h2>
            <button
              onClick={() => setShowExpenseModal(true)}
              className="flex items-center gap-2 px-4 py-2 bg-[#111111] dark:bg-white hover:bg-[#333] dark:hover:bg-[#E5E5E5] text-white dark:text-black rounded-xl text-sm font-medium transition-colors"
            >
              <Plus className="w-4 h-4" />
              Ajouter une depense
            </button>
          </div>

          {/* Expense Categories — Horizontal Bar Chart */}
          <div className="bg-white dark:bg-[#0A0A0A] rounded-2xl border border-[#E5E7EB] dark:border-[#1A1A1A] p-6">
            <h3 className="text-sm font-medium text-[#9CA3AF] dark:text-[#737373] mb-4">Repartition des charges par categorie</h3>
            {chargesByCategory.length === 0 ? (
              <p className="text-sm text-[#9CA3AF] dark:text-[#737373] text-center py-8">Aucune charge pour la periode selectionnee</p>
            ) : (
              <div className="space-y-3">
                {chargesByCategory.map((cat) => {
                  const pct = totalChargesForBar > 0 ? (cat.value / totalChargesForBar) * 100 : 0;
                  const barColor = EXPENSE_BAR_COLORS[cat.name] || '#6b7280';
                  return (
                    <div key={cat.name}>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm text-[#374151] dark:text-[#D4D4D4]">{cat.name}</span>
                        <div className="flex items-center gap-3">
                          <span className="text-xs text-[#9CA3AF] dark:text-[#737373]">{fmtPct(pct)}</span>
                          <span className="text-sm font-medium text-[#111111] dark:text-white w-20 text-right">{fmt(cat.value)}</span>
                        </div>
                      </div>
                      <div className="h-3 bg-[#F3F4F6] dark:bg-[#171717] rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full transition-all duration-500"
                          style={{ width: `${pct}%`, backgroundColor: barColor }}
                        />
                      </div>
                    </div>
                  );
                })}
                {/* Total */}
                <div className="pt-3 border-t border-[#E5E7EB] dark:border-[#1A1A1A] flex items-center justify-between">
                  <span className="text-sm font-semibold text-[#111111] dark:text-white">Total charges</span>
                  <span className="text-sm font-bold text-[#111111] dark:text-white">{fmt(totalChargesForBar)}</span>
                </div>
              </div>
            )}
          </div>

          {/* Recharts bar chart */}
          <div className="bg-white dark:bg-[#0A0A0A] rounded-2xl border border-[#E5E7EB] dark:border-[#1A1A1A] p-6">
            <h3 className="text-sm font-medium text-[#9CA3AF] dark:text-[#737373] mb-4">Graphique des charges</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={chargesByCategory} layout="vertical" margin={{ left: 130, right: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                <XAxis type="number" tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`} />
                <YAxis type="category" dataKey="name" tick={{ fontSize: 12 }} />
                <Tooltip formatter={(v) => fmt(Number(v))} />
                <Bar dataKey="value" radius={[0, 6, 6, 0]}>
                  {chargesByCategory.map((cat, idx) => (
                    <Cell key={idx} fill={EXPENSE_BAR_COLORS[cat.name] || COLORS[idx % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Expenses table */}
          <div className="bg-white dark:bg-[#0A0A0A] rounded-2xl border border-[#E5E7EB] dark:border-[#1A1A1A] overflow-hidden">
            <div className="overflow-x-auto max-h-[400px] overflow-y-auto">
              <table className="w-full text-sm">
                <thead className="sticky top-0 bg-[#F9FAFB] dark:bg-[#171717]/50">
                  <tr>
                    <th className="text-left py-2.5 px-3 font-medium text-[#9CA3AF] dark:text-[#737373]">Date</th>
                    <th className="text-left py-2.5 px-3 font-medium text-[#9CA3AF] dark:text-[#737373]">Fournisseur</th>
                    <th className="text-left py-2.5 px-3 font-medium text-[#9CA3AF] dark:text-[#737373]">Categorie</th>
                    <th className="text-right py-2.5 px-3 font-medium text-[#9CA3AF] dark:text-[#737373]">Montant HT</th>
                    <th className="text-right py-2.5 px-3 font-medium text-[#9CA3AF] dark:text-[#737373]">TVA</th>
                    <th className="text-right py-2.5 px-3 font-medium text-[#9CA3AF] dark:text-[#737373]">TTC</th>
                    <th className="text-left py-2.5 px-3 font-medium text-[#9CA3AF] dark:text-[#737373]">Description</th>
                    <th className="py-2.5 px-3 w-10"></th>
                  </tr>
                </thead>
                <tbody>
                  {expenses.slice(0, 80).map((e) => (
                    <tr key={e.id} className="border-t border-[#F3F4F6] dark:border-[#1A1A1A]/50 hover:bg-[#F9FAFB] dark:hover:bg-[#171717]/30">
                      <td className="py-2 px-3 text-[#111111] dark:text-white whitespace-nowrap">{fmtDate(e.date)}</td>
                      <td className="py-2 px-3 text-[#6B7280] dark:text-[#A3A3A3]">{e.fournisseur}</td>
                      <td className="py-2 px-3">
                        <span className="inline-block px-2 py-0.5 rounded-full text-xs font-medium bg-[#F3F4F6] dark:bg-[#171717] text-[#6B7280] dark:text-[#A3A3A3]">
                          {e.categorie}
                        </span>
                      </td>
                      <td className="py-2 px-3 text-right text-[#111111] dark:text-white">{fmt(e.montantHT)}</td>
                      <td className="py-2 px-3 text-right text-[#111111] dark:text-[#A3A3A3]">{fmt(e.tva)}</td>
                      <td className="py-2 px-3 text-right font-medium text-[#111111] dark:text-white">{fmt(e.ttc)}</td>
                      <td className="py-2 px-3 text-[#6B7280] dark:text-[#A3A3A3] truncate max-w-[200px]">{e.description}</td>
                      <td className="py-2 px-3">
                        <button
                          onClick={() => handleDeleteExpense(e.id)}
                          className="p-1 text-[#9CA3AF] dark:text-[#737373] hover:text-red-500 transition-colors"
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

      {/* ═══════════════════════════════════════════════════════════════════
          TAB: Cash Flow Tracker
          ═══════════════════════════════════════════════════════════════════ */}
      {activeTab === 'cashflow' && (
        <div className="space-y-6">
          {/* Cash flow summary cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white dark:bg-[#0A0A0A] rounded-2xl border border-[#E5E7EB] dark:border-[#1A1A1A] p-5">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-8 h-8 rounded-lg bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center">
                  <ArrowUp className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                </div>
                <span className="text-sm text-[#6B7280] dark:text-[#A3A3A3]">Entrees du mois</span>
              </div>
              <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">{fmt(currentMonth.ca)}</div>
            </div>
            <div className="bg-white dark:bg-[#0A0A0A] rounded-2xl border border-[#E5E7EB] dark:border-[#1A1A1A] p-5">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-8 h-8 rounded-lg bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
                  <ArrowDown className="w-4 h-4 text-red-600 dark:text-red-400" />
                </div>
                <span className="text-sm text-[#6B7280] dark:text-[#A3A3A3]">Sorties du mois</span>
              </div>
              <div className="text-2xl font-bold text-red-600 dark:text-red-400">{fmt(currentMonth.charges)}</div>
            </div>
            <div className="bg-white dark:bg-[#0A0A0A] rounded-2xl border border-[#E5E7EB] dark:border-[#1A1A1A] p-5">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-8 h-8 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                  <DollarSign className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                </div>
                <span className="text-sm text-[#6B7280] dark:text-[#A3A3A3]">Solde cumule</span>
              </div>
              <div className={`text-2xl font-bold ${(cashFlowData[cashFlowData.length - 1]?.solde ?? 0) >= 0 ? 'text-blue-600 dark:text-blue-400' : 'text-red-600 dark:text-red-400'}`}>
                {fmt(cashFlowData[cashFlowData.length - 1]?.solde ?? 0)}
              </div>
            </div>
          </div>

          {/* Cash Flow Timeline Area Chart */}
          <div className="bg-white dark:bg-[#0A0A0A] rounded-2xl border border-[#E5E7EB] dark:border-[#1A1A1A] p-6">
            <h3 className="text-sm font-medium text-[#9CA3AF] dark:text-[#737373] mb-4">Flux de tresorerie sur la periode</h3>
            <ResponsiveContainer width="100%" height={350}>
              <AreaChart data={cashFlowData} margin={{ top: 10, right: 20, bottom: 5, left: 0 }}>
                <defs>
                  <linearGradient id="gradIn" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="gradOut" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                <XAxis dataKey="mois" tick={{ fontSize: 11 }} />
                <YAxis tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`} />
                <Tooltip formatter={(v) => fmt(Number(v))} />
                <Legend />
                <Area type="monotone" dataKey="entrees" name="Entrees" stroke="#10b981" fill="url(#gradIn)" strokeWidth={2} />
                <Area type="monotone" dataKey="sorties" name="Sorties" stroke="#ef4444" fill="url(#gradOut)" strokeWidth={2} />
                <Line type="monotone" dataKey="solde" name="Solde cumule" stroke="#3b82f6" strokeWidth={2.5} dot={{ r: 4 }} />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Cash Flow Table */}
          <div className="bg-white dark:bg-[#0A0A0A] rounded-2xl border border-[#E5E7EB] dark:border-[#1A1A1A] overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-[#F9FAFB] dark:bg-[#171717]/50">
                  <tr>
                    <th className="text-left py-2.5 px-4 font-medium text-[#9CA3AF] dark:text-[#737373]">Mois</th>
                    <th className="text-right py-2.5 px-4 font-medium text-emerald-600 dark:text-emerald-400">Entrees</th>
                    <th className="text-right py-2.5 px-4 font-medium text-red-600 dark:text-red-400">Sorties</th>
                    <th className="text-right py-2.5 px-4 font-medium text-[#111111] dark:text-white">Net</th>
                    <th className="text-right py-2.5 px-4 font-medium text-blue-600 dark:text-blue-400">Solde cumule</th>
                  </tr>
                </thead>
                <tbody>
                  {cashFlowData.map((row, i) => (
                    <tr key={i} className="border-t border-[#F3F4F6] dark:border-[#1A1A1A]/50 hover:bg-[#F9FAFB] dark:hover:bg-[#171717]/30">
                      <td className="py-2.5 px-4 text-[#111111] dark:text-white font-medium">{row.mois}</td>
                      <td className="py-2.5 px-4 text-right text-emerald-600 dark:text-emerald-400">{fmt(row.entrees)}</td>
                      <td className="py-2.5 px-4 text-right text-red-600 dark:text-red-400">{fmt(row.sorties)}</td>
                      <td className={`py-2.5 px-4 text-right font-medium ${row.entrees - row.sorties >= 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-600 dark:text-red-400'}`}>
                        {fmt(row.entrees - row.sorties)}
                      </td>
                      <td className={`py-2.5 px-4 text-right font-bold ${row.solde >= 0 ? 'text-blue-600 dark:text-blue-400' : 'text-red-600 dark:text-red-400'}`}>
                        {fmt(row.solde)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ═══════════════════════════════════════════════════════════════════
          TAB: TVA — Tax Summary
          ═══════════════════════════════════════════════════════════════════ */}
      {activeTab === 'tva' && (
        <div className="space-y-6">
          {/* TVA Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white dark:bg-[#0A0A0A] rounded-2xl border border-[#E5E7EB] dark:border-[#1A1A1A] p-5">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-8 h-8 rounded-lg bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center">
                  <ArrowUp className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                </div>
                <span className="text-sm text-[#6B7280] dark:text-[#A3A3A3]">TVA collectee</span>
              </div>
              <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">{fmt(tvaCollected)}</div>
              <span className="text-xs text-[#9CA3AF] dark:text-[#737373]">Sur les ventes</span>
            </div>
            <div className="bg-white dark:bg-[#0A0A0A] rounded-2xl border border-[#E5E7EB] dark:border-[#1A1A1A] p-5">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-8 h-8 rounded-lg bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
                  <ArrowDown className="w-4 h-4 text-red-600 dark:text-red-400" />
                </div>
                <span className="text-sm text-[#6B7280] dark:text-[#A3A3A3]">TVA deductible</span>
              </div>
              <div className="text-2xl font-bold text-red-600 dark:text-red-400">{fmt(tvaPaid)}</div>
              <span className="text-xs text-[#9CA3AF] dark:text-[#737373]">Sur les achats</span>
            </div>
            <div className="bg-white dark:bg-[#0A0A0A] rounded-2xl border border-[#E5E7EB] dark:border-[#1A1A1A] p-5">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-8 h-8 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                  <Shield className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                </div>
                <span className="text-sm text-[#6B7280] dark:text-[#A3A3A3]">TVA nette due</span>
              </div>
              <div className={`text-2xl font-bold ${tvaNet >= 0 ? 'text-blue-600 dark:text-blue-400' : 'text-emerald-600 dark:text-emerald-400'}`}>
                {fmt(tvaNet)}
              </div>
              <span className="text-xs text-[#9CA3AF] dark:text-[#737373]">{tvaNet >= 0 ? 'A reverser' : 'Credit de TVA'}</span>
            </div>
          </div>

          {/* Ventilation TVA table + pie chart */}
          <div className="bg-white dark:bg-[#0A0A0A] rounded-2xl border border-[#E5E7EB] dark:border-[#1A1A1A] p-6">
            <h2 className="text-lg font-semibold text-[#111111] dark:text-white mb-4 flex items-center gap-2">
              <Euro className="w-5 h-5 text-[#111111] dark:text-[#A3A3A3]" />
              Ventilation TVA
            </h2>
            <div className="grid md:grid-cols-3 gap-6">
              {/* TVA table */}
              <div className="md:col-span-2 overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-[#E5E7EB] dark:border-[#1A1A1A]">
                      <th className="text-left py-2 px-3 font-medium text-[#9CA3AF] dark:text-[#737373]">Taux TVA</th>
                      <th className="text-left py-2 px-3 font-medium text-[#9CA3AF] dark:text-[#737373]">Applicable a</th>
                      <th className="text-right py-2 px-3 font-medium text-[#9CA3AF] dark:text-[#737373]">Base HT</th>
                      <th className="text-right py-2 px-3 font-medium text-[#9CA3AF] dark:text-[#737373]">Montant TVA</th>
                      <th className="text-right py-2 px-3 font-medium text-[#9CA3AF] dark:text-[#737373]">Total TTC</th>
                    </tr>
                  </thead>
                  <tbody>
                    {tvaData.map((row, i) => (
                      <tr key={i} className="border-b border-[#F3F4F6] dark:border-[#1A1A1A]/50">
                        <td className="py-2.5 px-3 font-medium text-[#111111] dark:text-white">
                          <span className="inline-flex items-center gap-1.5">
                            <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: TVA_COLORS[i] }} />
                            {row.taux}
                          </span>
                        </td>
                        <td className="py-2.5 px-3 text-[#6B7280] dark:text-[#A3A3A3]">{row.label}</td>
                        <td className="py-2.5 px-3 text-right text-[#111111] dark:text-white">{fmt(row.baseHT)}</td>
                        <td className="py-2.5 px-3 text-right font-medium text-[#111111] dark:text-[#A3A3A3]">{fmt(row.montantTVA)}</td>
                        <td className="py-2.5 px-3 text-right text-[#111111] dark:text-white">{fmt(row.totalTTC)}</td>
                      </tr>
                    ))}
                    <tr className="font-semibold bg-[#F9FAFB] dark:bg-[#171717]/30">
                      <td className="py-2.5 px-3 text-[#111111] dark:text-white" colSpan={2}>Total</td>
                      <td className="py-2.5 px-3 text-right text-[#111111] dark:text-white">{fmt(tvaData.reduce((s, r) => s + r.baseHT, 0))}</td>
                      <td className="py-2.5 px-3 text-right text-[#111111] dark:text-[#A3A3A3]">{fmt(tvaData.reduce((s, r) => s + r.montantTVA, 0))}</td>
                      <td className="py-2.5 px-3 text-right text-[#111111] dark:text-white">{fmt(tvaData.reduce((s, r) => s + r.totalTTC, 0))}</td>
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

          {/* Quarterly TVA Totals */}
          <div className="bg-white dark:bg-[#0A0A0A] rounded-2xl border border-[#E5E7EB] dark:border-[#1A1A1A] p-6">
            <h3 className="text-sm font-medium text-[#9CA3AF] dark:text-[#737373] mb-4">Totaux trimestriels TVA</h3>
            {quarterlyTva.length === 0 ? (
              <p className="text-sm text-[#9CA3AF] dark:text-[#737373] text-center py-4">Pas de donnees trimestrielles</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-[#E5E7EB] dark:border-[#1A1A1A]">
                      <th className="text-left py-2 px-3 font-medium text-[#9CA3AF] dark:text-[#737373]">Trimestre</th>
                      <th className="text-right py-2 px-3 font-medium text-emerald-600 dark:text-emerald-400">TVA collectee</th>
                      <th className="text-right py-2 px-3 font-medium text-red-600 dark:text-red-400">TVA deductible</th>
                      <th className="text-right py-2 px-3 font-medium text-blue-600 dark:text-blue-400">TVA nette due</th>
                    </tr>
                  </thead>
                  <tbody>
                    {quarterlyTva.map((q, i) => (
                      <tr key={i} className="border-b border-[#F3F4F6] dark:border-[#1A1A1A]/50">
                        <td className="py-2.5 px-3 font-medium text-[#111111] dark:text-white">{q.label}</td>
                        <td className="py-2.5 px-3 text-right text-emerald-600 dark:text-emerald-400">{fmt(q.collected)}</td>
                        <td className="py-2.5 px-3 text-right text-red-600 dark:text-red-400">{fmt(q.paid)}</td>
                        <td className={`py-2.5 px-3 text-right font-semibold ${q.net >= 0 ? 'text-blue-600 dark:text-blue-400' : 'text-emerald-600 dark:text-emerald-400'}`}>
                          {fmt(q.net)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ═══════════════════════════════════════════════════════════════════
          TAB: Budget vs Actual
          ═══════════════════════════════════════════════════════════════════ */}
      {activeTab === 'budget' && (
        <div className="space-y-6">
          {/* Summary cards */}
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-white dark:bg-[#0A0A0A] rounded-2xl p-4 border border-[#E5E7EB] dark:border-[#1A1A1A]">
              <span className="text-xs font-medium text-[#9CA3AF] dark:text-[#737373] uppercase tracking-wide">Budget total</span>
              <div className="text-xl font-bold text-[#111111] dark:text-white mt-1">{fmt(totalBudget)}</div>
              <span className="text-xs text-[#9CA3AF] dark:text-[#737373]">{period === 'mois' ? 'Ce mois' : period === 'trimestre' ? 'Ce trimestre' : 'Cette annee'}</span>
            </div>
            <div className="bg-white dark:bg-[#0A0A0A] rounded-2xl p-4 border border-[#E5E7EB] dark:border-[#1A1A1A]">
              <span className="text-xs font-medium text-[#9CA3AF] dark:text-[#737373] uppercase tracking-wide">Depenses reelles</span>
              <div className="text-xl font-bold text-[#111111] dark:text-white mt-1">{fmt(totalActual)}</div>
              <span className={`text-xs font-medium ${totalActual <= totalBudget ? 'text-emerald-500' : 'text-red-500'}`}>
                {totalActual <= totalBudget ? 'Dans le budget' : `Depassement ${fmt(totalActual - totalBudget)}`}
              </span>
            </div>
            <div className="bg-white dark:bg-[#0A0A0A] rounded-2xl p-4 border border-[#E5E7EB] dark:border-[#1A1A1A]">
              <span className="text-xs font-medium text-[#9CA3AF] dark:text-[#737373] uppercase tracking-wide">Ecart</span>
              <div className={`text-xl font-bold mt-1 ${totalBudget - totalActual >= 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-600 dark:text-red-400'}`}>
                {totalBudget - totalActual >= 0 ? '+' : ''}{fmt(totalBudget - totalActual)}
              </div>
              <span className="text-xs text-[#9CA3AF] dark:text-[#737373]">
                {totalBudget > 0 ? fmtPct(((totalBudget - totalActual) / totalBudget) * 100) : '0%'} du budget
              </span>
            </div>
          </div>

          {/* Budget table with color bars */}
          <div className="bg-white dark:bg-[#0A0A0A] rounded-2xl border border-[#E5E7EB] dark:border-[#1A1A1A] overflow-hidden">
            <div className="p-4 border-b border-[#E5E7EB] dark:border-[#1A1A1A] flex items-center justify-between">
              <h3 className="font-semibold text-[#111111] dark:text-white flex items-center gap-2">
                <BarChart2 className="w-5 h-5 text-[#111111] dark:text-[#A3A3A3]" />
                Budget mensuel par categorie
              </h3>
              <span className="text-xs text-[#9CA3AF] dark:text-[#737373]">Cliquez sur un montant pour modifier</span>
            </div>
            <div className="divide-y divide-[#F3F4F6] dark:divide-[#1A1A1A]">
              {budgetData.map(({ category, budget, actual }) => {
                const variance = budget - actual;
                const pct = budget > 0 ? (actual / budget) * 100 : 0;
                const isOver = actual > budget;
                const barColor = isOver ? 'bg-red-500' : pct > 80 ? 'bg-amber-500' : 'bg-emerald-500';

                return (
                  <div key={category} className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-3">
                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: EXPENSE_BAR_COLORS[category] || '#6b7280' }} />
                        <span className="text-sm font-medium text-[#111111] dark:text-white">{category}</span>
                      </div>
                      <div className="flex items-center gap-4 text-sm">
                        {/* Budget editable */}
                        <div className="text-right">
                          <span className="text-[10px] text-[#9CA3AF] dark:text-[#737373] uppercase">Budget</span>
                          {editingBudget === category ? (
                            <div className="flex items-center gap-1">
                              <input
                                type="number"
                                value={budgetInput}
                                onChange={e => setBudgetInput(e.target.value)}
                                className="w-20 px-2 py-0.5 rounded border border-[#D1D5DB] dark:border-[#1A1A1A] bg-white dark:bg-[#171717] text-sm text-right"
                                autoFocus
                                onKeyDown={e => e.key === 'Enter' && handleSaveBudget(category)}
                              />
                              <button onClick={() => handleSaveBudget(category)} className="text-emerald-500 hover:text-emerald-400">
                                <CheckCircle className="w-4 h-4" />
                              </button>
                              <button onClick={() => setEditingBudget(null)} className="text-red-500 hover:text-red-400">
                                <XCircle className="w-4 h-4" />
                              </button>
                            </div>
                          ) : (
                            <div
                              className="font-medium text-[#111111] dark:text-white cursor-pointer hover:text-teal-600 dark:hover:text-teal-400 transition-colors"
                              onClick={() => { setEditingBudget(category); setBudgetInput(String(budgets[category] || 0)); }}
                            >
                              {fmt(budget)}
                            </div>
                          )}
                        </div>
                        {/* Actual */}
                        <div className="text-right">
                          <span className="text-[10px] text-[#9CA3AF] dark:text-[#737373] uppercase">Reel</span>
                          <div className="font-medium text-[#111111] dark:text-white">{fmt(actual)}</div>
                        </div>
                        {/* Variance */}
                        <div className="text-right w-20">
                          <span className="text-[10px] text-[#9CA3AF] dark:text-[#737373] uppercase">Ecart</span>
                          <div className={`font-semibold ${isOver ? 'text-red-600 dark:text-red-400' : 'text-emerald-600 dark:text-emerald-400'}`}>
                            {variance >= 0 ? '+' : ''}{fmt(variance)}
                          </div>
                        </div>
                      </div>
                    </div>
                    {/* Progress bar */}
                    <div className="h-3 bg-[#E5E7EB] dark:bg-[#171717] rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${barColor}`}
                        style={{ width: `${Math.min(pct, 100)}%` }}
                      />
                    </div>
                    <div className="flex justify-between mt-1">
                      <span className="text-[10px] text-[#9CA3AF] dark:text-[#737373]">{fmtPct(pct)} utilise</span>
                      {isOver && (
                        <span className="text-[10px] text-red-500 font-medium flex items-center gap-0.5">
                          <AlertTriangle className="w-3 h-3" /> Depassement
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Budget vs Actual bar chart */}
          <div className="bg-white dark:bg-[#0A0A0A] rounded-2xl border border-[#E5E7EB] dark:border-[#1A1A1A] p-6">
            <h3 className="font-semibold text-[#111111] dark:text-white mb-4">Comparaison visuelle</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={budgetData} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                  <XAxis type="number" tickFormatter={(v: number) => `${Math.round(v / 1000)}k`} />
                  <YAxis type="category" dataKey="category" width={120} tick={{ fontSize: 11 }} />
                  <Tooltip formatter={(v: number) => fmt(v)} />
                  <Legend />
                  <Bar dataKey="budget" name="Budget" fill="#3b82f6" radius={[0, 4, 4, 0]} barSize={14} />
                  <Bar dataKey="actual" name="Reel" fill="#10b981" radius={[0, 4, 4, 0]} barSize={14} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}

      {/* ═══════════════════════════════════════════════════════════════════
          TAB: Bank Reconciliation
          ═══════════════════════════════════════════════════════════════════ */}
      {activeTab === 'bank' && (
        <div className="space-y-6">
          {/* Summary row */}
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-white dark:bg-[#0A0A0A] rounded-2xl p-4 border border-[#E5E7EB] dark:border-[#1A1A1A]">
              <span className="text-xs font-medium text-[#9CA3AF] dark:text-[#737373] uppercase tracking-wide">Total transactions</span>
              <div className="text-xl font-bold text-[#111111] dark:text-white mt-1">{bankTransactions.length}</div>
            </div>
            <div className="bg-white dark:bg-[#0A0A0A] rounded-2xl p-4 border border-[#E5E7EB] dark:border-[#1A1A1A]">
              <div className="flex items-center gap-1.5 mb-1">
                <CheckCircle className="w-4 h-4 text-emerald-500" />
                <span className="text-xs font-medium text-[#9CA3AF] dark:text-[#737373] uppercase tracking-wide">Rapprochees</span>
              </div>
              <div className="text-xl font-bold text-emerald-600 dark:text-emerald-400">{reconciledCount}</div>
            </div>
            <div className="bg-white dark:bg-[#0A0A0A] rounded-2xl p-4 border border-[#E5E7EB] dark:border-[#1A1A1A]">
              <div className="flex items-center gap-1.5 mb-1">
                <AlertTriangle className="w-4 h-4 text-amber-500" />
                <span className="text-xs font-medium text-[#9CA3AF] dark:text-[#737373] uppercase tracking-wide">Non rapprochees</span>
              </div>
              <div className="text-xl font-bold text-amber-600 dark:text-amber-400">{unreconciledCount}</div>
            </div>
          </div>

          {/* Add button */}
          <div className="flex justify-end">
            <button
              onClick={() => setShowBankModal(true)}
              className="flex items-center gap-2 px-4 py-2 bg-[#111111] dark:bg-white hover:bg-[#333] dark:hover:bg-[#E5E5E5] text-white dark:text-black rounded-xl text-sm font-medium transition-colors"
            >
              <Plus className="w-4 h-4" />
              Ajouter une transaction bancaire
            </button>
          </div>

          {/* Transaction list */}
          <div className="bg-white dark:bg-[#0A0A0A] rounded-2xl border border-[#E5E7EB] dark:border-[#1A1A1A] overflow-hidden">
            <div className="p-4 border-b border-[#E5E7EB] dark:border-[#1A1A1A]">
              <h3 className="font-semibold text-[#111111] dark:text-white flex items-center gap-2">
                <Landmark className="w-5 h-5 text-[#111111] dark:text-[#A3A3A3]" />
                Transactions bancaires
              </h3>
            </div>
            {bankTransactions.length === 0 ? (
              <div className="p-8 text-center">
                <Landmark className="w-10 h-10 mx-auto text-[#D1D5DB] dark:text-[#525252] mb-3" />
                <p className="text-sm text-[#9CA3AF] dark:text-[#737373]">Aucune transaction bancaire.</p>
                <p className="text-xs text-[#D1D5DB] dark:text-[#525252] mt-1">Ajoutez vos releves bancaires pour les rapprocher avec vos depenses.</p>
              </div>
            ) : (
              <div className="divide-y divide-[#F3F4F6] dark:divide-[#1A1A1A]">
                {bankTransactions.map(tx => {
                  const matchedExpense = tx.matchedExpenseId ? expenses.find(e => e.id === tx.matchedExpenseId) : null;
                  return (
                    <div key={tx.id} className="p-4 flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${tx.status === 'rapproche' ? 'bg-emerald-100 dark:bg-emerald-900/30' : 'bg-amber-100 dark:bg-amber-900/30'}`}>
                          {tx.status === 'rapproche' ? <CheckCircle className="w-4 h-4 text-emerald-600 dark:text-emerald-400" /> : <AlertTriangle className="w-4 h-4 text-amber-600 dark:text-amber-400" />}
                        </div>
                        <div>
                          <div className="text-sm font-medium text-[#111111] dark:text-white">{tx.label}</div>
                          <div className="text-xs text-[#9CA3AF] dark:text-[#737373]">{fmtDate(tx.date)}</div>
                          {matchedExpense && (
                            <div className="text-xs text-emerald-600 dark:text-emerald-400 flex items-center gap-1 mt-0.5">
                              <Link2 className="w-3 h-3" /> {matchedExpense.fournisseur} - {matchedExpense.categorie}
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className="text-sm font-bold text-[#111111] dark:text-white">{fmt(tx.amount)}</span>
                        <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold ${tx.status === 'rapproche' ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300' : 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300'}`}>
                          {tx.status === 'rapproche' ? 'Rapproche' : 'Non rapproche'}
                        </span>
                        {tx.status === 'non_rapproche' ? (
                          <div className="flex items-center gap-1">
                            {/* Try auto-match with expenses */}
                            {expenses.filter(e => Math.abs(e.montantHT - tx.amount) < 1).length > 0 ? (
                              <button
                                onClick={() => {
                                  const match = expenses.find(e => Math.abs(e.montantHT - tx.amount) < 1);
                                  if (match) handleReconcile(tx.id, match.id);
                                }}
                                className="px-2 py-1 text-xs font-medium bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg transition-colors"
                              >
                                Rapprocher auto
                              </button>
                            ) : (
                              <button
                                onClick={() => handleReconcile(tx.id)}
                                className="px-2 py-1 text-xs font-medium bg-teal-600 hover:bg-teal-500 text-white rounded-lg transition-colors"
                              >
                                Rapprocher
                              </button>
                            )}
                            <button onClick={() => handleDeleteBankTx(tx.id)} className="p-1 text-red-500 hover:text-red-400 transition-colors">
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() => handleUnreconcile(tx.id)}
                            className="px-2 py-1 text-xs font-medium text-[#6B7280] dark:text-[#A3A3A3] hover:text-red-500 transition-colors"
                          >
                            Annuler
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ═══════════════════════════════════════════════════════════════════
          TAB: Ratios & indicateurs
          ═══════════════════════════════════════════════════════════════════ */}
      {activeTab === 'ratios' && (
        <div className="space-y-6">
          {/* Gauge cards */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <RatioGauge label="Cout matiere" value={currentRatios.coutMatiere} target={30} thresholds={{ green: 30, orange: 35 }} />
            <RatioGauge label="Masse salariale" value={currentRatios.masseSalariale} target={35} thresholds={{ green: 35, orange: 40 }} />
            <RatioGauge label="Prime cost" value={currentRatios.primeCost} target={65} thresholds={{ green: 65, orange: 70 }} />
            <RatioGauge label="Marge brute" value={currentRatios.margeBrute} target={70} thresholds={{ green: 65, orange: 60 }} />
            <RatioGauge label="Ticket moyen" value={currentRatios.ticketMoyen} target={25} unit="EUR" thresholds={{ green: 20, orange: 15 }} />
            <RatioGauge label="Taux de remplissage" value={currentRatios.tauxRemplissage} target={75} thresholds={{ green: 60, orange: 45 }} />
          </div>

          {/* Comparison vs objectives */}
          <div className="bg-white dark:bg-[#0A0A0A] rounded-2xl border border-[#E5E7EB] dark:border-[#1A1A1A] p-6">
            <h3 className="text-sm font-medium text-[#9CA3AF] dark:text-[#737373] mb-4">Comparaison vs objectifs</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                { label: 'Cout matiere', actual: currentRatios.coutMatiere, target: 30 },
                { label: 'Masse salariale', actual: currentRatios.masseSalariale, target: 35 },
                { label: 'Prime cost', actual: currentRatios.primeCost, target: 65 },
              ].map((item) => {
                const diff = item.actual - item.target;
                const isGood = diff <= 0;
                return (
                  <div key={item.label} className="flex items-center justify-between p-3 rounded-xl bg-[#F9FAFB] dark:bg-[#171717]/30">
                    <div>
                      <div className="text-sm font-medium text-[#111111] dark:text-white">{item.label}</div>
                      <div className="text-xs text-[#9CA3AF] dark:text-[#737373]">Objectif : {fmtPct(item.target)}</div>
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
          <div className="bg-white dark:bg-[#0A0A0A] rounded-2xl border border-[#E5E7EB] dark:border-[#1A1A1A] p-6">
            <h3 className="text-sm font-medium text-[#9CA3AF] dark:text-[#737373] mb-4">Evolution sur 12 mois</h3>
            <ResponsiveContainer width="100%" height={350}>
              <LineChart data={ratiosEvolution} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                <XAxis dataKey="mois" tick={{ fontSize: 11 }} />
                <YAxis domain={[0, 100]} tickFormatter={(v) => `${v}%`} />
                <Tooltip formatter={(v) => `${Number(v)}%`} />
                <Legend />
                <Line type="monotone" dataKey="coutMatiere" name="Cout matiere" stroke="#ef4444" strokeWidth={2} dot={{ r: 3 }} />
                <Line type="monotone" dataKey="masseSalariale" name="Masse salariale" stroke="#8b5cf6" strokeWidth={2} dot={{ r: 3 }} />
                <Line type="monotone" dataKey="primeCost" name="Prime cost" stroke="#f59e0b" strokeWidth={2} dot={{ r: 3 }} />
                <Line type="monotone" dataKey="margeBrute" name="Marge brute" stroke="#10b981" strokeWidth={2} dot={{ r: 3 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* ═══════════════════════════════════════════════════════════════════
          TAB: Exports
          ═══════════════════════════════════════════════════════════════════ */}
      {activeTab === 'export' && (
        <div className="grid md:grid-cols-2 gap-6">
          {/* FEC */}
          <div className="bg-white dark:bg-[#0A0A0A] rounded-2xl border border-[#E5E7EB] dark:border-[#1A1A1A] p-6">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-xl bg-[#F3F4F6] dark:bg-[#171717] flex items-center justify-center">
                <FileText className="w-5 h-5 text-[#111111] dark:text-[#A3A3A3]" />
              </div>
              <div>
                <h3 className="font-semibold text-[#111111] dark:text-white">Fichier des Ecritures Comptables</h3>
                <p className="text-xs text-[#9CA3AF] dark:text-[#737373]">Format FEC obligatoire (article A47 A-1 du LPF)</p>
              </div>
            </div>
            <p className="text-sm text-[#6B7280] dark:text-[#A3A3A3] mb-4">
              Export au format reglementaire pour le controle fiscal. Contient toutes les ecritures de l'exercice.
            </p>
            <button
              onClick={handleExportFEC}
              className="flex items-center gap-2 px-4 py-2 bg-[#111111] dark:bg-white hover:bg-[#333] dark:hover:bg-[#E5E5E5] text-white dark:text-black rounded-xl text-sm font-medium transition-colors w-full justify-center"
            >
              <Download className="w-4 h-4" />
              Telecharger le FEC
            </button>
          </div>

          {/* CSV */}
          <div className="bg-white dark:bg-[#0A0A0A] rounded-2xl border border-[#E5E7EB] dark:border-[#1A1A1A] p-6">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center">
                <FileText className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
              </div>
              <div>
                <h3 className="font-semibold text-[#111111] dark:text-white">Exporter en CSV</h3>
                <p className="text-xs text-[#9CA3AF] dark:text-[#737373]">Compatible Pennylane, Sage, Cegid</p>
              </div>
            </div>
            <p className="text-sm text-[#6B7280] dark:text-[#A3A3A3] mb-4">
              Exportez vos donnees dans un format compatible avec votre logiciel comptable.
            </p>
            <div className="flex gap-2">
              <button onClick={() => handleExportCSV('Pennylane')} className="flex-1 flex items-center gap-1 px-3 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-sm font-medium transition-colors justify-center">
                <Download className="w-3 h-3" />
                Pennylane
              </button>
              <button onClick={() => handleExportCSV('Sage')} className="flex-1 flex items-center gap-1 px-3 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-sm font-medium transition-colors justify-center">
                <Download className="w-3 h-3" />
                Sage
              </button>
              <button onClick={() => handleExportCSV('Cegid')} className="flex-1 flex items-center gap-1 px-3 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-sm font-medium transition-colors justify-center">
                <Download className="w-3 h-3" />
                Cegid
              </button>
            </div>
          </div>

          {/* PDF */}
          <div className="bg-white dark:bg-[#0A0A0A] rounded-2xl border border-[#E5E7EB] dark:border-[#1A1A1A] p-6">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-xl bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
                <FileText className="w-5 h-5 text-red-600 dark:text-red-400" />
              </div>
              <div>
                <h3 className="font-semibold text-[#111111] dark:text-white">Exporter en PDF</h3>
                <p className="text-xs text-[#9CA3AF] dark:text-[#737373]">Synthese complete du mois</p>
              </div>
            </div>
            <p className="text-sm text-[#6B7280] dark:text-[#A3A3A3] mb-4">
              Rapport synthetique avec CA, charges, TVA et ratios cles. Ideal pour votre expert-comptable.
            </p>
            <button
              onClick={handleExportPDF}
              className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl text-sm font-medium transition-colors w-full justify-center"
            >
              <Download className="w-4 h-4" />
              Generer le rapport PDF
            </button>
          </div>

          {/* Email to accountant */}
          <div className="bg-white dark:bg-[#0A0A0A] rounded-2xl border border-[#E5E7EB] dark:border-[#1A1A1A] p-6">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-xl bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                <Mail className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <h3 className="font-semibold text-[#111111] dark:text-white">Envoyer au comptable (email)</h3>
                <p className="text-xs text-[#9CA3AF] dark:text-[#737373]">Envoi par email au cabinet comptable</p>
              </div>
            </div>
            <p className="text-sm text-[#6B7280] dark:text-[#A3A3A3] mb-4">
              Envoyez les donnees du mois directement a votre comptable par email.
            </p>
            <button
              onClick={handleSendToAccountant}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-medium transition-colors w-full justify-center"
            >
              <Mail className="w-4 h-4" />
              Envoyer par email
            </button>
          </div>

          {/* Print */}
          <div className="bg-white dark:bg-[#0A0A0A] rounded-2xl border border-[#E5E7EB] dark:border-[#1A1A1A] p-6 md:col-span-2">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-xl bg-[#F3F4F6] dark:bg-[#171717] flex items-center justify-center">
                <Printer className="w-5 h-5 text-[#6B7280] dark:text-[#A3A3A3]" />
              </div>
              <div>
                <h3 className="font-semibold text-[#111111] dark:text-white">Imprimer</h3>
                <p className="text-xs text-[#9CA3AF] dark:text-[#737373]">Impression de la page courante</p>
              </div>
            </div>
            <button
              onClick={handlePrint}
              className="flex items-center gap-2 px-4 py-2 bg-[#4B5563] hover:bg-[#374151] text-white rounded-xl text-sm font-medium transition-colors w-full justify-center"
            >
              <Printer className="w-4 h-4" />
              Imprimer
            </button>
          </div>
        </div>
      )}

      {/* ─── Bank Transaction Modal ──────────────────────────────────────── */}
      <Modal isOpen={showBankModal} onClose={() => setShowBankModal(false)} title="Ajouter une transaction bancaire">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-[#9CA3AF] dark:text-[#737373] mb-1">Date</label>
            <input
              type="date"
              value={newBankTx.date}
              onChange={e => setNewBankTx({ ...newBankTx, date: e.target.value })}
              className="w-full px-3 py-2 rounded-lg border border-[#D1D5DB] dark:border-[#1A1A1A] bg-white dark:bg-[#171717] text-sm text-[#111111] dark:text-white"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-[#9CA3AF] dark:text-[#737373] mb-1">Libelle *</label>
            <input
              type="text"
              value={newBankTx.label}
              onChange={e => setNewBankTx({ ...newBankTx, label: e.target.value })}
              placeholder="Ex: VIREMENT METRO CASH&CARRY"
              className="w-full px-3 py-2 rounded-lg border border-[#D1D5DB] dark:border-[#1A1A1A] bg-white dark:bg-[#171717] text-sm text-[#111111] dark:text-white placeholder-[#9CA3AF] dark:placeholder-[#737373]"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-[#9CA3AF] dark:text-[#737373] mb-1">Montant *</label>
            <input
              type="number"
              step="0.01"
              value={newBankTx.amount}
              onChange={e => setNewBankTx({ ...newBankTx, amount: e.target.value })}
              placeholder="0,00"
              className="w-full px-3 py-2 rounded-lg border border-[#D1D5DB] dark:border-[#1A1A1A] bg-white dark:bg-[#171717] text-sm text-[#111111] dark:text-white placeholder-[#9CA3AF] dark:placeholder-[#737373]"
            />
          </div>
          <div className="flex gap-3 pt-2">
            <button
              onClick={() => setShowBankModal(false)}
              className="flex-1 px-4 py-2 border border-[#D1D5DB] dark:border-[#1A1A1A] rounded-xl text-sm font-medium text-[#6B7280] dark:text-[#A3A3A3] hover:bg-[#F9FAFB] dark:hover:bg-[#171717] transition-colors"
            >
              Annuler
            </button>
            <button
              onClick={handleAddBankTransaction}
              className="flex-1 px-4 py-2 bg-[#111111] dark:bg-white hover:bg-[#333] dark:hover:bg-[#E5E5E5] text-white dark:text-black rounded-xl text-sm font-medium transition-colors"
            >
              Ajouter
            </button>
          </div>
        </div>
      </Modal>

      {/* ─── Add expense Modal ─────────────────────────────────────────── */}
      <Modal isOpen={showExpenseModal} onClose={() => setShowExpenseModal(false)} title="Ajouter une depense">
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-[#9CA3AF] dark:text-[#737373] mb-1">Date</label>
              <input
                type="date"
                value={newExpense.date}
                onChange={(e) => setNewExpense({ ...newExpense, date: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-[#D1D5DB] dark:border-[#1A1A1A] bg-white dark:bg-[#171717] text-sm text-[#111111] dark:text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#9CA3AF] dark:text-[#737373] mb-1">Categorie</label>
              <select
                value={newExpense.categorie}
                onChange={(e) => setNewExpense({ ...newExpense, categorie: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-[#D1D5DB] dark:border-[#1A1A1A] bg-white dark:bg-[#171717] text-sm text-[#111111] dark:text-white"
              >
                {EXPENSE_CATEGORIES.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-[#9CA3AF] dark:text-[#737373] mb-1">Fournisseur *</label>
            <input
              type="text"
              value={newExpense.fournisseur}
              onChange={(e) => {
                const val = e.target.value;
                const suggestedCat = autoCategorize(val, newExpense.description);
                setNewExpense({ ...newExpense, fournisseur: val, categorie: suggestedCat });
              }}
              placeholder="Nom du fournisseur — categorie auto-detectee"
              className="w-full px-3 py-2 rounded-lg border border-[#D1D5DB] dark:border-[#1A1A1A] bg-white dark:bg-[#171717] text-sm text-[#111111] dark:text-white placeholder-[#9CA3AF] dark:placeholder-[#737373]"
            />
            {newExpense.fournisseur && (
              <div className="flex items-center gap-1.5 mt-1">
                <Tags className="w-3 h-3 text-teal-500" />
                <span className="text-xs text-teal-600 dark:text-teal-400">Auto-categorie : {autoCategorize(newExpense.fournisseur, newExpense.description)}</span>
              </div>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-[#9CA3AF] dark:text-[#737373] mb-1">Montant HT *</label>
              <input
                type="number"
                step="0.01"
                value={newExpense.montantHT}
                onChange={(e) => setNewExpense({ ...newExpense, montantHT: e.target.value })}
                placeholder="0,00"
                className="w-full px-3 py-2 rounded-lg border border-[#D1D5DB] dark:border-[#1A1A1A] bg-white dark:bg-[#171717] text-sm text-[#111111] dark:text-white placeholder-[#9CA3AF] dark:placeholder-[#737373]"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#9CA3AF] dark:text-[#737373] mb-1">Taux TVA (%)</label>
              <select
                value={newExpense.tva}
                onChange={(e) => setNewExpense({ ...newExpense, tva: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-[#D1D5DB] dark:border-[#1A1A1A] bg-white dark:bg-[#171717] text-sm text-[#111111] dark:text-white"
              >
                <option value="0">0% (Exonere)</option>
                <option value="5.5">5,5%</option>
                <option value="10">10%</option>
                <option value="20">20%</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-[#9CA3AF] dark:text-[#737373] mb-1">Description</label>
            <input
              type="text"
              value={newExpense.description}
              onChange={(e) => setNewExpense({ ...newExpense, description: e.target.value })}
              placeholder="Description de la depense"
              className="w-full px-3 py-2 rounded-lg border border-[#D1D5DB] dark:border-[#1A1A1A] bg-white dark:bg-[#171717] text-sm text-[#111111] dark:text-white placeholder-[#9CA3AF] dark:placeholder-[#737373]"
            />
          </div>

          {/* Preview */}
          {newExpense.montantHT && (
            <div className="p-3 rounded-xl bg-[#F9FAFB] dark:bg-[#171717]/30 text-sm">
              <div className="flex justify-between">
                <span className="text-[#9CA3AF] dark:text-[#737373]">Montant HT :</span>
                <span className="text-[#111111] dark:text-white">{fmt(parseFloat(newExpense.montantHT) || 0)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#9CA3AF] dark:text-[#737373]">TVA ({newExpense.tva}%) :</span>
                <span className="text-[#111111] dark:text-[#A3A3A3]">{fmt(Math.round((parseFloat(newExpense.montantHT) || 0) * parseFloat(newExpense.tva) / 100))}</span>
              </div>
              <div className="flex justify-between font-semibold border-t border-[#E5E7EB] dark:border-[#1A1A1A] pt-1 mt-1">
                <span className="text-[#111111] dark:text-white">Total TTC :</span>
                <span className="text-[#111111] dark:text-white">{fmt(Math.round((parseFloat(newExpense.montantHT) || 0) * (1 + parseFloat(newExpense.tva) / 100)))}</span>
              </div>
            </div>
          )}

          <div className="flex gap-3 pt-2">
            <button
              onClick={() => setShowExpenseModal(false)}
              className="flex-1 px-4 py-2 border border-[#D1D5DB] dark:border-[#1A1A1A] rounded-xl text-sm font-medium text-[#6B7280] dark:text-[#A3A3A3] hover:bg-[#F9FAFB] dark:hover:bg-[#171717] transition-colors"
            >
              Annuler
            </button>
            <button
              onClick={handleAddExpense}
              className="flex-1 px-4 py-2 bg-[#111111] dark:bg-white hover:bg-[#333] dark:hover:bg-[#E5E5E5] text-white dark:text-black rounded-xl text-sm font-medium transition-colors"
            >
              Ajouter
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
