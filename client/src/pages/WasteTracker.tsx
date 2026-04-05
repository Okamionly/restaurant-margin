import { useState, useMemo, useEffect } from 'react';
import {
  Trash2, Plus, TrendingDown, AlertTriangle, Lightbulb,
  Target, PieChart as PieChartIcon, BarChart3, Leaf, Search,
  ChevronDown, ChevronUp, Calendar, ArrowDown, Loader2
} from 'lucide-react';
import {
  PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer
} from 'recharts';
import { useToast } from '../hooks/useToast';
import { useRestaurant } from '../hooks/useRestaurant';
import { useTranslation } from '../hooks/useTranslation';
import Modal from '../components/Modal';
import { fetchIngredients } from '../services/api';
import type { Ingredient } from '../types';

// ─── Types ───────────────────────────────────────────────────────────────────

type WasteReason = 'expired' | 'spoiled' | 'overproduction' | 'damaged' | 'other';

interface WasteEntry {
  id: number;
  date: string;
  /** Display name of the ingredient */
  ingredientName: string;
  /** FK to ingredients table */
  ingredientId: number;
  quantity: number;
  unit: string;
  costPerUnit: number;
  reason: WasteReason;
  notes: string;
}

// Shape returned by GET /api/waste/summary
interface WasteSummary {
  totalCost: number;
  itemCount: number;
  topWasted: { ingredientName: string; totalCost: number; totalQuantity: number; unit: string }[];
  wasteByReason: Record<string, number>;
  trend: { date: string; cost: number }[];
}

const API_BASE = import.meta.env.VITE_API_URL || '/api';

function authHeaders(): Record<string, string> {
  const token = localStorage.getItem('token');
  const rid = localStorage.getItem('activeRestaurantId');
  const headers: Record<string, string> = { 'Content-Type': 'application/json' };
  if (token) headers['Authorization'] = `Bearer ${token}`;
  if (rid) headers['X-Restaurant-Id'] = rid;
  return headers;
}

type Period = 'jour' | 'semaine' | 'mois';

// ─── Constants ───────────────────────────────────────────────────────────────

const REASON_LABELS: Record<WasteReason, string> = {
  expired: 'Périmé',
  spoiled: 'Avarié',
  overproduction: 'Surproduction',
  damaged: 'Endommagé',
  other: 'Autre',
};

const REASON_COLORS: Record<WasteReason, string> = {
  expired: '#dc2626',
  spoiled: '#d97706',
  overproduction: '#7c3aed',
  damaged: '#0891b2',
  other: '#6b7280',
};

const REASON_BADGE: Record<WasteReason, string> = {
  expired: 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300',
  spoiled: 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300',
  overproduction: 'bg-violet-100 text-violet-700 dark:bg-violet-900/40 dark:text-violet-300',
  damaged: 'bg-cyan-100 text-cyan-700 dark:bg-cyan-900/40 dark:text-cyan-300',
  other: 'bg-gray-100 text-gray-700 dark:bg-gray-900/40 dark:text-gray-300',
};

// (ingredients are loaded from the API — no static catalog needed)

// ─── AI Suggestions ──────────────────────────────────────────────────────────

function generateSuggestions(entries: WasteEntry[]): string[] {
  const tips: string[] = [];
  const byReason: Record<WasteReason, number> = { expired: 0, spoiled: 0, overproduction: 0, damaged: 0, other: 0 };
  const byIngredient: Record<string, number> = {};

  entries.forEach(e => {
    const cost = e.quantity * e.costPerUnit;
    byReason[e.reason] += cost;
    byIngredient[e.ingredientName] = (byIngredient[e.ingredientName] || 0) + cost;
  });

  const topReason = (Object.entries(byReason) as [WasteReason, number][]).sort((a, b) => b[1] - a[1])[0];
  const topIngredients = Object.entries(byIngredient).sort((a, b) => b[1] - a[1]).slice(0, 3);

  if (topReason[0] === 'expired') {
    tips.push('📦 Appliquez le FIFO (First In, First Out) pour réduire les pertes par péremption. Vérifiez les DLC chaque matin.');
    tips.push('🔄 Réduisez les volumes de commande pour les produits fréquemment périmés et passez à des livraisons plus fréquentes.');
  }
  if (topReason[0] === 'overproduction') {
    tips.push('📊 Analysez vos données de fréquentation pour ajuster les quantités préparées. Utilisez les prévisions du planning.');
    tips.push('🍽️ Proposez un "plat du jour" avec les surplus de la veille pour valoriser les excédents.');
  }
  if (topReason[0] === 'damaged') {
    tips.push('👨‍🍳 Renforcez la formation des équipes sur les fiches techniques. Affichez les procédures clés en cuisine.');
    tips.push('⚖️ Utilisez la station balance pour un dosage précis et réduire les erreurs de préparation.');
  }
  if (topReason[0] === 'spoiled') {
    tips.push('🎯 Analysez les conditions de stockage — température, humidité, rotation des stocks.');
    tips.push('💬 Formez le service en salle à mieux décrire les plats pour éviter les commandes inadaptées.');
  }

  if (topIngredients.length > 0) {
    tips.push(`🔍 ${topIngredients[0][0]} représente votre plus grosse perte (${topIngredients[0][1].toFixed(0)}€). Envisagez un fournisseur avec conditionnement adapté.`);
  }

  tips.push('📱 Utilisez une app anti-gaspi (Too Good To Go) pour vendre les invendus en fin de service.');
  tips.push('🥗 Créez un menu "zéro déchet" hebdomadaire utilisant les ingrédients en fin de DLC.');

  return tips;
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function formatEuro(val: number): string {
  return val.toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' });
}

function getWeekNumber(d: Date): number {
  const oneJan = new Date(d.getFullYear(), 0, 1);
  return Math.ceil(((d.getTime() - oneJan.getTime()) / 86400000 + oneJan.getDay() + 1) / 7);
}

// ─── Component ───────────────────────────────────────────────────────────────

export default function WasteTracker() {
  const { t } = useTranslation();
  const { showToast } = useToast();
  const { selectedRestaurant, loading: restaurantLoading } = useRestaurant();
  const [entries, setEntries] = useState<WasteEntry[]>([]);
  const [loadingEntries, setLoadingEntries] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [ingredients, setIngredients] = useState<Ingredient[]>([]);
  const [period, setPeriod] = useState<Period>('semaine');
  const [search, setSearch] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showTips, setShowTips] = useState(true);

  // Form state
  const [form, setForm] = useState({
    ingredientId: '',
    quantity: '',
    reason: 'expired' as WasteReason,
    notes: '',
  });

  // ─── Data fetching ────────────────────────────────────────────────────────

  async function loadEntries() {
    setLoadingEntries(true);
    try {
      const res = await fetch(`${API_BASE}/waste`, { headers: authHeaders() });
      if (!res.ok) throw new Error('Erreur chargement des pertes');
      const data: WasteEntry[] = await res.json();
      setEntries(data);
    } catch {
      showToast('Impossible de charger les pertes', 'error');
    } finally {
      setLoadingEntries(false);
    }
  }

  async function loadSummary() {
    try {
      const res = await fetch(`${API_BASE}/waste/summary`, { headers: authHeaders() });
      if (res.ok) {
        // summary data is computed locally from entries — kept for future enrichment
        await res.json() as WasteSummary;
      }
    } catch {
      // non-blocking — summary enrichment is optional
    }
  }

  useEffect(() => {
    if (restaurantLoading || !selectedRestaurant) return;
    loadEntries();
    loadSummary();
    fetchIngredients()
      .then(setIngredients)
      .catch(() => showToast('Impossible de charger les ingrédients', 'error'));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedRestaurant, restaurantLoading]);

  // ─── Computed data ───────────────────────────────────────────────────────

  const today = new Date();
  const todayStr = today.toISOString().split('T')[0];

  const filteredByPeriod = useMemo(() => {
    const now = new Date();
    return entries.filter(e => {
      const d = new Date(e.date);
      if (period === 'jour') return e.date === todayStr;
      if (period === 'semaine') {
        const weekAgo = new Date(now);
        weekAgo.setDate(weekAgo.getDate() - 7);
        return d >= weekAgo;
      }
      const monthAgo = new Date(now);
      monthAgo.setDate(monthAgo.getDate() - 30);
      return d >= monthAgo;
    });
  }, [entries, period, todayStr]);

  const totalCost = useMemo(() =>
    filteredByPeriod.reduce((sum, e) => sum + e.quantity * e.costPerUnit, 0),
    [filteredByPeriod]
  );

  const previousPeriodCost = useMemo(() => {
    const now = new Date();
    let start: Date, end: Date;
    if (period === 'jour') {
      start = new Date(now); start.setDate(start.getDate() - 2);
      end = new Date(now); end.setDate(end.getDate() - 1);
    } else if (period === 'semaine') {
      start = new Date(now); start.setDate(start.getDate() - 14);
      end = new Date(now); end.setDate(end.getDate() - 7);
    } else {
      start = new Date(now); start.setDate(start.getDate() - 60);
      end = new Date(now); end.setDate(end.getDate() - 30);
    }
    return entries
      .filter(e => { const d = new Date(e.date); return d >= start && d < end; })
      .reduce((sum, e) => sum + e.quantity * e.costPerUnit, 0);
  }, [entries, period]);

  const costChange = previousPeriodCost > 0
    ? ((totalCost - previousPeriodCost) / previousPeriodCost * 100)
    : 0;

  const entryCount = filteredByPeriod.length;

  // Pie chart: waste by reason
  const pieData = useMemo(() => {
    const byReason: Record<WasteReason, number> = { expired: 0, spoiled: 0, overproduction: 0, damaged: 0, other: 0 };
    filteredByPeriod.forEach(e => { byReason[e.reason] += e.quantity * e.costPerUnit; });
    return (Object.entries(byReason) as [WasteReason, number][])
      .filter(([, v]) => v > 0)
      .map(([reason, value]) => ({
        name: REASON_LABELS[reason],
        value: parseFloat(value.toFixed(2)),
        color: REASON_COLORS[reason],
      }));
  }, [filteredByPeriod]);

  // Bar chart: waste trend over time
  const barData = useMemo(() => {
    if (period === 'jour') {
      // Show hourly is not realistic, show last 7 days
      const days: Record<string, number> = {};
      const now = new Date();
      for (let i = 6; i >= 0; i--) {
        const d = new Date(now); d.setDate(d.getDate() - i);
        const key = d.toLocaleDateString('fr-FR', { weekday: 'short', day: 'numeric' });
        days[key] = 0;
      }
      entries.forEach(e => {
        const d = new Date(e.date);
        const diffDays = Math.floor((now.getTime() - d.getTime()) / 86400000);
        if (diffDays >= 0 && diffDays <= 6) {
          const key = d.toLocaleDateString('fr-FR', { weekday: 'short', day: 'numeric' });
          if (key in days) days[key] += e.quantity * e.costPerUnit;
        }
      });
      return Object.entries(days).map(([name, value]) => ({ name, value: parseFloat(value.toFixed(2)) }));
    }
    if (period === 'semaine') {
      // Last 4 weeks
      const weeks: Record<string, number> = {};
      for (let i = 3; i >= 0; i--) {
        const d = new Date(); d.setDate(d.getDate() - i * 7);
        const key = `S${getWeekNumber(d)}`;
        weeks[key] = 0;
      }
      entries.forEach(e => {
        const d = new Date(e.date);
        const key = `S${getWeekNumber(d)}`;
        if (key in weeks) weeks[key] += e.quantity * e.costPerUnit;
      });
      return Object.entries(weeks).map(([name, value]) => ({ name, value: parseFloat(value.toFixed(2)) }));
    }
    // Month: last 30 days grouped by day
    const days: Record<string, number> = {};
    for (let i = 29; i >= 0; i--) {
      const d = new Date(); d.setDate(d.getDate() - i);
      const key = d.toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit' });
      days[key] = 0;
    }
    entries.forEach(e => {
      const d = new Date(e.date);
      const key = d.toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit' });
      if (key in days) days[key] += e.quantity * e.costPerUnit;
    });
    return Object.entries(days).map(([name, value]) => ({ name, value: parseFloat(value.toFixed(2)) }));
  }, [entries, period]);

  // Top 5 most wasted ingredients
  const topWasted = useMemo(() => {
    const byIng: Record<string, { cost: number; qty: number; unit: string }> = {};
    filteredByPeriod.forEach(e => {
      if (!byIng[e.ingredientName]) byIng[e.ingredientName] = { cost: 0, qty: 0, unit: e.unit };
      byIng[e.ingredientName].cost += e.quantity * e.costPerUnit;
      byIng[e.ingredientName].qty += e.quantity;
    });
    return Object.entries(byIng)
      .sort((a, b) => b[1].cost - a[1].cost)
      .slice(0, 5)
      .map(([name, data]) => ({ name, ...data }));
  }, [filteredByPeriod]);

  // Zero waste progress (target: reduce by 20% from month average)
  const monthlyTarget = useMemo(() => {
    const monthEntries = entries.filter(e => {
      const d = new Date(e.date);
      const monthAgo = new Date(); monthAgo.setDate(monthAgo.getDate() - 30);
      return d >= monthAgo;
    });
    const total = monthEntries.reduce((s, e) => s + e.quantity * e.costPerUnit, 0);
    const target = total * 0.80; // target: 20% reduction
    return { actual: total, target, percentage: total > 0 ? Math.min(100, Math.max(0, ((total - target) / total) * 100)) : 0 };
  }, [entries]);

  // Zero waste score (inverted: lower waste = higher score)
  const zeroWasteScore = Math.max(0, Math.min(100, 100 - monthlyTarget.percentage * 5));

  // AI suggestions
  const suggestions = useMemo(() => generateSuggestions(entries), [entries]);

  // Recent entries
  const recentEntries = useMemo(() => {
    let result = [...filteredByPeriod].sort((a, b) => b.date.localeCompare(a.date) || b.id - a.id);
    if (search) {
      const s = search.toLowerCase();
      result = result.filter(e =>
        e.ingredientName.toLowerCase().includes(s) || REASON_LABELS[e.reason].toLowerCase().includes(s)
      );
    }
    return result.slice(0, 20);
  }, [filteredByPeriod, search]);

  // ─── Handlers ──────────────────────────────────────────────────────────────

  async function handleAddWaste() {
    const ing = ingredients.find(i => i.id === parseInt(form.ingredientId));
    if (!ing) { showToast('Sélectionnez un ingrédient', 'error'); return; }
    const qty = parseFloat(form.quantity);
    if (!qty || qty <= 0) { showToast('Quantité invalide', 'error'); return; }

    setSubmitting(true);
    try {
      const res = await fetch(`${API_BASE}/waste`, {
        method: 'POST',
        headers: authHeaders(),
        body: JSON.stringify({
          ingredientId: ing.id,
          ingredientName: ing.name,
          quantity: qty,
          unit: ing.unit,
          costPerUnit: ing.pricePerUnit,
          reason: form.reason,
          notes: form.notes,
          date: todayStr,
        }),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({})) as { error?: string };
        throw new Error(body.error || 'Erreur lors de la déclaration');
      }
      setForm({ ingredientId: '', quantity: '', reason: 'expired', notes: '' });
      setShowAddModal(false);
      showToast(`Perte déclarée : ${qty} ${ing.unit} de ${ing.name} (${formatEuro(qty * ing.pricePerUnit)})`, 'success');
      await loadEntries();
    } catch (err: unknown) {
      showToast(err instanceof Error ? err.message : 'Erreur déclaration', 'error');
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDeleteEntry(id: number) {
    try {
      const res = await fetch(`${API_BASE}/waste/${id}`, {
        method: 'DELETE',
        headers: authHeaders(),
      });
      if (!res.ok) throw new Error('Erreur suppression');
      showToast('Déclaration supprimée', 'success');
      await loadEntries();
    } catch {
      showToast('Impossible de supprimer la déclaration', 'error');
    }
  }

  // ─── Render ────────────────────────────────────────────────────────────────

  const periodLabels: Record<Period, string> = { jour: t('wasteTracker.today'), semaine: t('wasteTracker.thisWeek'), mois: t('wasteTracker.thisMonth') };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#111111] dark:text-white flex items-center gap-3">
            <Trash2 className="w-7 h-7 text-red-500" />
            {t('wasteTracker.title')}
          </h1>
          <p className="text-sm text-[#9CA3AF] dark:text-[#737373] mt-1">
            {t('wasteTracker.subtitle')}
          </p>
        </div>
        <div className="flex items-center gap-3">
          {/* Period selector */}
          <div className="flex rounded-lg border border-[#E5E7EB] dark:border-[#1A1A1A] overflow-hidden">
            {(['jour', 'semaine', 'mois'] as Period[]).map(p => (
              <button
                key={p}
                onClick={() => setPeriod(p)}
                className={`px-3 py-1.5 text-sm font-medium transition-colors ${
                  period === p
                    ? 'bg-[#111111] dark:bg-white text-white dark:text-black'
                    : 'bg-white dark:bg-[#0A0A0A] text-[#6B7280] dark:text-[#A3A3A3] hover:bg-[#F9FAFB] dark:hover:bg-[#171717]'
                }`}
              >
                {p === 'jour' ? t('wasteTracker.day') : p === 'semaine' ? t('wasteTracker.week') : t('wasteTracker.month')}
              </button>
            ))}
          </div>
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-500 text-white rounded-lg text-sm font-semibold transition-colors"
          >
            <Plus className="w-4 h-4" />
            {t('wasteTracker.declareWaste')}
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total waste cost */}
        <div className="bg-white dark:bg-[#0A0A0A] rounded-xl border border-[#E5E7EB] dark:border-[#1A1A1A] p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-[#9CA3AF] dark:text-[#737373]">{t('wasteTracker.totalLosses')}</span>
            <div className="p-2 rounded-lg bg-red-50 dark:bg-red-900/30">
              <TrendingDown className="w-4 h-4 text-red-500" />
            </div>
          </div>
          <div className="text-2xl font-bold text-[#111111] dark:text-white">{formatEuro(totalCost)}</div>
          <div className="flex items-center gap-1 mt-1">
            {costChange !== 0 && (
              <span className={`text-xs font-medium flex items-center gap-0.5 ${
                costChange > 0 ? 'text-red-500' : 'text-green-500'
              }`}>
                {costChange > 0 ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                {Math.abs(costChange).toFixed(1)}%
              </span>
            )}
            <span className="text-xs text-[#9CA3AF] dark:text-[#737373]">{periodLabels[period]}</span>
          </div>
        </div>

        {/* Number of waste events */}
        <div className="bg-white dark:bg-[#0A0A0A] rounded-xl border border-[#E5E7EB] dark:border-[#1A1A1A] p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-[#9CA3AF] dark:text-[#737373]">{t('wasteTracker.incidents')}</span>
            <div className="p-2 rounded-lg bg-amber-50 dark:bg-amber-900/30">
              <AlertTriangle className="w-4 h-4 text-amber-500" />
            </div>
          </div>
          <div className="text-2xl font-bold text-[#111111] dark:text-white">{entryCount}</div>
          <span className="text-xs text-[#9CA3AF] dark:text-[#737373]">{t('wasteTracker.declarations')}</span>
        </div>

        {/* Avg cost per incident */}
        <div className="bg-white dark:bg-[#0A0A0A] rounded-xl border border-[#E5E7EB] dark:border-[#1A1A1A] p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-[#9CA3AF] dark:text-[#737373]">{t('wasteTracker.avgCost')}</span>
            <div className="p-2 rounded-lg bg-violet-50 dark:bg-violet-900/30">
              <BarChart3 className="w-4 h-4 text-violet-500" />
            </div>
          </div>
          <div className="text-2xl font-bold text-[#111111] dark:text-white">
            {entryCount > 0 ? formatEuro(totalCost / entryCount) : '—'}
          </div>
          <span className="text-xs text-[#9CA3AF] dark:text-[#737373]">{t('wasteTracker.perIncident')}</span>
        </div>

        {/* Zero waste score */}
        <div className="bg-white dark:bg-[#0A0A0A] rounded-xl border border-[#E5E7EB] dark:border-[#1A1A1A] p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-[#9CA3AF] dark:text-[#737373]">{t('wasteTracker.antiWasteScore')}</span>
            <div className="p-2 rounded-lg bg-green-50 dark:bg-green-900/30">
              <Leaf className="w-4 h-4 text-green-500" />
            </div>
          </div>
          <div className="text-2xl font-bold text-[#111111] dark:text-white">{zeroWasteScore.toFixed(0)}/100</div>
          <span className="text-xs text-[#9CA3AF] dark:text-[#737373]">{t('wasteTracker.zeroWasteGoal')}</span>
        </div>
      </div>

      {/* Zero Waste Progress Bar */}
      <div className="bg-white dark:bg-[#0A0A0A] rounded-xl border border-[#E5E7EB] dark:border-[#1A1A1A] p-5">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Target className="w-5 h-5 text-green-500" />
            <h2 className="font-semibold text-[#1F2937] dark:text-white">{t('wasteTracker.zeroWasteObjective')}</h2>
          </div>
          <span className="text-sm text-[#9CA3AF] dark:text-[#737373]">
            Objectif : réduire de 20% ({formatEuro(monthlyTarget.target)})
          </span>
        </div>
        <div className="relative w-full h-6 bg-[#F3F4F6] dark:bg-[#171717] rounded-full overflow-hidden">
          <div
            className={`absolute inset-y-0 left-0 rounded-full transition-all duration-700 ${
              zeroWasteScore >= 70 ? 'bg-green-500' : zeroWasteScore >= 40 ? 'bg-amber-500' : 'bg-red-500'
            }`}
            style={{ width: `${zeroWasteScore}%` }}
          />
          <div className="absolute inset-0 flex items-center justify-center text-xs font-bold text-[#9CA3AF] dark:text-white">
            {zeroWasteScore.toFixed(0)}% — {formatEuro(monthlyTarget.actual)} / {formatEuro(monthlyTarget.target)} objectif
          </div>
        </div>
        <div className="flex justify-between text-xs text-[#9CA3AF] dark:text-[#737373] mt-1">
          <span>{t('wasteTracker.critical')}</span>
          <span>{t('wasteTracker.good')}</span>
          <span>{t('wasteTracker.excellent')}</span>
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Pie chart: by reason */}
        <div className="bg-white dark:bg-[#0A0A0A] rounded-xl border border-[#E5E7EB] dark:border-[#1A1A1A] p-5">
          <div className="flex items-center gap-2 mb-4">
            <PieChartIcon className="w-5 h-5 text-[#374151] dark:text-[#D4D4D4]" />
            <h2 className="font-semibold text-[#1F2937] dark:text-white">{t('wasteTracker.lossesByCause')}</h2>
          </div>
          {pieData.length > 0 ? (
            <ResponsiveContainer width="100%" height={280}>
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={3}
                  dataKey="value"
                  label={({ name, percent }: { name?: string; percent?: number }) => `${name ?? ''} (${((percent ?? 0) * 100).toFixed(0)}%)`}
                >
                  {pieData.map((entry, i) => (
                    <Cell key={i} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(val: unknown) => formatEuro(Number(val))} />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-[280px] flex items-center justify-center text-[#9CA3AF] dark:text-[#737373]">{t('wasteTracker.noData')}</div>
          )}
        </div>

        {/* Bar chart: trend */}
        <div className="bg-white dark:bg-[#0A0A0A] rounded-xl border border-[#E5E7EB] dark:border-[#1A1A1A] p-5">
          <div className="flex items-center gap-2 mb-4">
            <BarChart3 className="w-5 h-5 text-emerald-500" />
            <h2 className="font-semibold text-[#1F2937] dark:text-white">{t('wasteTracker.lossTrend')}</h2>
          </div>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={barData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.3} />
              <XAxis dataKey="name" tick={{ fontSize: 11 }} interval={period === 'mois' ? 4 : 0} />
              <YAxis tick={{ fontSize: 11 }} tickFormatter={(v) => `${v}€`} />
              <Tooltip formatter={(val: unknown) => formatEuro(Number(val))} labelStyle={{ color: '#1e293b' }} />
              <Bar dataKey="value" fill="#dc2626" radius={[4, 4, 0, 0]} name="Pertes (€)" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Top 5 + Tips Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top 5 most wasted */}
        <div className="bg-white dark:bg-[#0A0A0A] rounded-xl border border-[#E5E7EB] dark:border-[#1A1A1A] p-5">
          <div className="flex items-center gap-2 mb-4">
            <ArrowDown className="w-5 h-5 text-red-500" />
            <h2 className="font-semibold text-[#1F2937] dark:text-white">{t('wasteTracker.top5Wasted')}</h2>
          </div>
          {topWasted.length > 0 ? (
            <div className="space-y-3">
              {topWasted.map((item, i) => {
                const maxCost = topWasted[0].cost;
                const pct = (item.cost / maxCost) * 100;
                return (
                  <div key={item.name}>
                    <div className="flex items-center justify-between text-sm mb-1">
                      <span className="font-medium text-[#9CA3AF] dark:text-white">
                        <span className="text-[#9CA3AF] dark:text-[#737373] mr-2">#{i + 1}</span>
                        {item.name}
                      </span>
                      <span className="font-semibold text-red-600 dark:text-red-400">{formatEuro(item.cost)}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="flex-1 h-2.5 bg-[#F3F4F6] dark:bg-[#171717] rounded-full overflow-hidden">
                        <div
                          className="h-full bg-red-500 rounded-full transition-all duration-500"
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                      <span className="text-xs text-[#9CA3AF] dark:text-[#737373] w-20 text-right">
                        {item.qty.toFixed(1)} {item.unit}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="text-sm text-[#9CA3AF] dark:text-[#737373]">{t('wasteTracker.noDataForPeriod')}</p>
          )}
        </div>

        {/* AI Tips */}
        <div className="bg-white dark:bg-[#0A0A0A] rounded-xl border border-[#E5E7EB] dark:border-[#1A1A1A] p-5">
          <button
            onClick={() => setShowTips(!showTips)}
            className="flex items-center justify-between w-full mb-3"
          >
            <div className="flex items-center gap-2">
              <Lightbulb className="w-5 h-5 text-amber-500" />
              <h2 className="font-semibold text-[#1F2937] dark:text-white">{t('wasteTracker.aiTips')}</h2>
            </div>
            {showTips ? <ChevronUp className="w-4 h-4 text-[#9CA3AF] dark:text-[#737373]" /> : <ChevronDown className="w-4 h-4 text-[#9CA3AF] dark:text-[#737373]" />}
          </button>
          {showTips && (
            <div className="space-y-3">
              {suggestions.map((tip, i) => (
                <div
                  key={i}
                  className="flex gap-3 p-3 rounded-lg bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800/40"
                >
                  <span className="text-sm text-[#9CA3AF] dark:text-white leading-relaxed">{tip}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Recent waste entries table */}
      <div className="bg-white dark:bg-[#0A0A0A] rounded-xl border border-[#E5E7EB] dark:border-[#1A1A1A] p-5">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
          <h2 className="font-semibold text-[#1F2937] dark:text-white flex items-center gap-2">
            <Calendar className="w-5 h-5 text-[#9CA3AF] dark:text-[#737373]" />
            {t('wasteTracker.recentDeclarations')}
          </h2>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9CA3AF] dark:text-[#737373]" />
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder={t('wasteTracker.search')}
              className="pl-9 pr-4 py-2 border border-[#E5E7EB] dark:border-[#1A1A1A] rounded-lg bg-white dark:bg-[#171717] text-sm text-[#1F2937] dark:text-white placeholder:text-[#6B7280] dark:text-[#A3A3A3] w-full sm:w-64 focus:ring-2 focus:ring-[#111111] dark:ring-white focus:border-transparent"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[#E5E7EB] dark:border-[#1A1A1A]">
                <th className="text-left py-2 px-3 text-xs font-semibold text-[#9CA3AF] dark:text-[#737373] uppercase">{t('wasteTracker.date')}</th>
                <th className="text-left py-2 px-3 text-xs font-semibold text-[#9CA3AF] dark:text-[#737373] uppercase">{t('wasteTracker.ingredient')}</th>
                <th className="text-right py-2 px-3 text-xs font-semibold text-[#9CA3AF] dark:text-[#737373] uppercase">{t('wasteTracker.quantity')}</th>
                <th className="text-left py-2 px-3 text-xs font-semibold text-[#9CA3AF] dark:text-[#737373] uppercase">{t('wasteTracker.cause')}</th>
                <th className="text-right py-2 px-3 text-xs font-semibold text-[#9CA3AF] dark:text-[#737373] uppercase">{t('wasteTracker.cost')}</th>
                <th className="py-2 px-3"></th>
              </tr>
            </thead>
            <tbody>
              {loadingEntries ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-[#9CA3AF] dark:text-[#737373]">
                    <Loader2 className="w-5 h-5 animate-spin mx-auto" />
                  </td>
                </tr>
              ) : (
                <>
                  {recentEntries.map(e => (
                    <tr key={e.id} className="border-b border-[#F3F4F6] dark:border-[#1A1A1A]/50 hover:bg-[#F9FAFB] dark:hover:bg-[#171717]/30 transition-colors">
                      <td className="py-2.5 px-3 text-[#6B7280] dark:text-[#A3A3A3]">
                        {new Date(e.date).toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit' })}
                      </td>
                      <td className="py-2.5 px-3 font-medium text-[#1F2937] dark:text-white">{e.ingredientName}</td>
                      <td className="py-2.5 px-3 text-right text-[#6B7280] dark:text-[#A3A3A3]">
                        {e.quantity.toFixed(2)} {e.unit}
                      </td>
                      <td className="py-2.5 px-3">
                        <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${REASON_BADGE[e.reason]}`}>
                          {REASON_LABELS[e.reason]}
                        </span>
                      </td>
                      <td className="py-2.5 px-3 text-right font-semibold text-red-600 dark:text-red-400">
                        {formatEuro(e.quantity * e.costPerUnit)}
                      </td>
                      <td className="py-2.5 px-3 text-right">
                        <button
                          onClick={() => handleDeleteEntry(e.id)}
                          className="p-1.5 rounded-lg text-[#9CA3AF] dark:text-[#737373] hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/30 transition-colors"
                          title={t('wasteTracker.delete')}
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                  {recentEntries.length === 0 && (
                    <tr>
                      <td colSpan={6} className="py-8 text-center text-[#9CA3AF] dark:text-[#737373]">
                        {t('wasteTracker.noWasteForPeriod')}
                      </td>
                    </tr>
                  )}
                </>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Waste Modal */}
      <Modal isOpen={showAddModal} onClose={() => setShowAddModal(false)} title={t('wasteTracker.declareWasteTitle')}>
        <div className="space-y-4">
          {/* Ingredient */}
          <div>
            <label className="block text-sm font-medium text-[#9CA3AF] dark:text-[#737373] mb-1">{t('wasteTracker.ingredient')}</label>
            <select
              value={form.ingredientId}
              onChange={e => setForm(f => ({ ...f, ingredientId: e.target.value }))}
              className="w-full px-3 py-2 border border-[#D1D5DB] dark:border-[#1A1A1A] rounded-lg bg-white dark:bg-[#171717] text-[#1F2937] dark:text-white focus:ring-2 focus:ring-[#111111] dark:ring-white"
            >
              <option value="">{t('wasteTracker.selectIngredient')}</option>
              {ingredients.map(ing => (
                <option key={ing.id} value={ing.id}>{ing.name} ({formatEuro(ing.pricePerUnit)}/{ing.unit})</option>
              ))}
            </select>
          </div>

          {/* Quantity */}
          <div>
            <label className="block text-sm font-medium text-[#9CA3AF] dark:text-[#737373] mb-1">{t('wasteTracker.quantity')}</label>
            <div className="flex items-center gap-2">
              <input
                type="number"
                step="0.01"
                min="0"
                value={form.quantity}
                onChange={e => setForm(f => ({ ...f, quantity: e.target.value }))}
                placeholder="0.00"
                className="flex-1 px-3 py-2 border border-[#D1D5DB] dark:border-[#1A1A1A] rounded-lg bg-white dark:bg-[#171717] text-[#1F2937] dark:text-white focus:ring-2 focus:ring-[#111111] dark:ring-white"
              />
              {form.ingredientId && (
                <span className="text-sm text-[#9CA3AF] dark:text-[#737373] font-medium">
                  {ingredients.find(i => i.id === parseInt(form.ingredientId))?.unit}
                </span>
              )}
            </div>
          </div>

          {/* Reason */}
          <div>
            <label className="block text-sm font-medium text-[#9CA3AF] dark:text-[#737373] mb-1">{t('wasteTracker.cause')}</label>
            <div className="grid grid-cols-2 gap-2">
              {(Object.entries(REASON_LABELS) as [WasteReason, string][]).map(([key, label]) => (
                <button
                  key={key}
                  onClick={() => setForm(f => ({ ...f, reason: key }))}
                  className={`px-3 py-2.5 rounded-lg text-sm font-medium border-2 transition-colors ${
                    form.reason === key
                      ? 'border-[#111111] bg-[#F9FAFB] dark:bg-[#0A0A0A]/30 text-[#111111] dark:text-[#737373]'
                      : 'border-[#E5E7EB] dark:border-[#1A1A1A] text-[#6B7280] dark:text-[#A3A3A3] hover:border-[#D1D5DB] dark:hover:border-[#6B7280]'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-sm font-medium text-[#9CA3AF] dark:text-[#737373] mb-1">{t('wasteTracker.notesOptional')}</label>
            <textarea
              value={form.notes}
              onChange={e => setForm(f => ({ ...f, notes: e.target.value }))}
              rows={2}
              placeholder={t('wasteTracker.additionalDetails')}
              className="w-full px-3 py-2 border border-[#D1D5DB] dark:border-[#1A1A1A] rounded-lg bg-white dark:bg-[#171717] text-[#1F2937] dark:text-white focus:ring-2 focus:ring-[#111111] dark:ring-white resize-none"
            />
          </div>

          {/* Estimated cost preview */}
          {form.ingredientId && form.quantity && (() => {
            const ing = ingredients.find(i => i.id === parseInt(form.ingredientId));
            return ing ? (
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800/40 rounded-lg p-3 text-sm">
                <span className="text-[#6B7280] dark:text-[#A3A3A3]">{t('wasteTracker.estimatedCost')} : </span>
                <span className="font-bold text-red-600 dark:text-red-400">
                  {formatEuro(parseFloat(form.quantity || '0') * ing.pricePerUnit)}
                </span>
              </div>
            ) : null;
          })()}

          {/* Submit */}
          <div className="flex justify-end gap-3 pt-2">
            <button
              onClick={() => setShowAddModal(false)}
              disabled={submitting}
              className="px-4 py-2 rounded-lg text-sm font-medium text-[#6B7280] dark:text-[#A3A3A3] hover:bg-[#F3F4F6] dark:hover:bg-[#171717] transition-colors disabled:opacity-50"
            >
              {t('wasteTracker.cancel')}
            </button>
            <button
              onClick={handleAddWaste}
              disabled={submitting}
              className="flex items-center gap-2 px-5 py-2 bg-red-600 hover:bg-red-500 text-white rounded-lg text-sm font-semibold transition-colors disabled:opacity-60"
            >
              {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
              {t('wasteTracker.declareWaste')}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
