import { useState, useMemo } from 'react';
import {
  Trash2, Plus, TrendingDown, AlertTriangle, Lightbulb,
  Target, PieChart as PieChartIcon, BarChart3, Leaf, Search,
  ChevronDown, ChevronUp, Calendar, ArrowDown
} from 'lucide-react';
import {
  PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Legend
} from 'recharts';
import { useToast } from '../hooks/useToast';
import Modal from '../components/Modal';

// ─── Types ───────────────────────────────────────────────────────────────────

type WasteReason = 'perime' | 'surproduction' | 'erreur_cuisine' | 'retour_client';

interface WasteEntry {
  id: number;
  date: string;
  ingredient: string;
  quantity: number;
  unit: string;
  costPerUnit: number;
  reason: WasteReason;
  notes: string;
}

type Period = 'jour' | 'semaine' | 'mois';

// ─── Constants ───────────────────────────────────────────────────────────────

const REASON_LABELS: Record<WasteReason, string> = {
  perime: 'Périmé',
  surproduction: 'Surproduction',
  erreur_cuisine: 'Erreur cuisine',
  retour_client: 'Retour client',
};

const REASON_COLORS: Record<WasteReason, string> = {
  perime: '#dc2626',
  surproduction: '#d97706',
  erreur_cuisine: '#7c3aed',
  retour_client: '#0891b2',
};

const REASON_BADGE: Record<WasteReason, string> = {
  perime: 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300',
  surproduction: 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300',
  erreur_cuisine: 'bg-violet-100 text-violet-700 dark:bg-violet-900/40 dark:text-violet-300',
  retour_client: 'bg-cyan-100 text-cyan-700 dark:bg-cyan-900/40 dark:text-cyan-300',
};

// Catalogue vide — les ingrédients seront chargés depuis l'API
const INGREDIENTS_CATALOG: { name: string; unit: string; cost: number }[] = [];

// (mock data generator removed — starts empty)

// ─── AI Suggestions ──────────────────────────────────────────────────────────

function generateSuggestions(entries: WasteEntry[]): string[] {
  const tips: string[] = [];
  const byReason: Record<WasteReason, number> = { perime: 0, surproduction: 0, erreur_cuisine: 0, retour_client: 0 };
  const byIngredient: Record<string, number> = {};

  entries.forEach(e => {
    const cost = e.quantity * e.costPerUnit;
    byReason[e.reason] += cost;
    byIngredient[e.ingredient] = (byIngredient[e.ingredient] || 0) + cost;
  });

  const topReason = (Object.entries(byReason) as [WasteReason, number][]).sort((a, b) => b[1] - a[1])[0];
  const topIngredients = Object.entries(byIngredient).sort((a, b) => b[1] - a[1]).slice(0, 3);

  if (topReason[0] === 'perime') {
    tips.push('📦 Appliquez le FIFO (First In, First Out) pour réduire les pertes par péremption. Vérifiez les DLC chaque matin.');
    tips.push('🔄 Réduisez les volumes de commande pour les produits fréquemment périmés et passez à des livraisons plus fréquentes.');
  }
  if (topReason[0] === 'surproduction') {
    tips.push('📊 Analysez vos données de fréquentation pour ajuster les quantités préparées. Utilisez les prévisions du planning.');
    tips.push('🍽️ Proposez un "plat du jour" avec les surplus de la veille pour valoriser les excédents.');
  }
  if (topReason[0] === 'erreur_cuisine') {
    tips.push('👨‍🍳 Renforcez la formation des équipes sur les fiches techniques. Affichez les procédures clés en cuisine.');
    tips.push('⚖️ Utilisez la station balance pour un dosage précis et réduire les erreurs de préparation.');
  }
  if (topReason[0] === 'retour_client') {
    tips.push('🎯 Analysez les retours clients par plat pour identifier les recettes à améliorer ou retirer de la carte.');
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
  const { showToast } = useToast();
  const [entries, setEntries] = useState<WasteEntry[]>([]);
  const [period, setPeriod] = useState<Period>('semaine');
  const [search, setSearch] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showTips, setShowTips] = useState(true);

  // Form state
  const [form, setForm] = useState({
    ingredient: '',
    quantity: '',
    reason: 'perime' as WasteReason,
    notes: '',
  });

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
    const byReason: Record<WasteReason, number> = { perime: 0, surproduction: 0, erreur_cuisine: 0, retour_client: 0 };
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
      if (!byIng[e.ingredient]) byIng[e.ingredient] = { cost: 0, qty: 0, unit: e.unit };
      byIng[e.ingredient].cost += e.quantity * e.costPerUnit;
      byIng[e.ingredient].qty += e.quantity;
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
    return { actual: total, target, percentage: Math.min(100, Math.max(0, ((total - target) / total) * 100)) };
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
        e.ingredient.toLowerCase().includes(s) || REASON_LABELS[e.reason].toLowerCase().includes(s)
      );
    }
    return result.slice(0, 20);
  }, [filteredByPeriod, search]);

  // ─── Handlers ──────────────────────────────────────────────────────────────

  function handleAddWaste() {
    const ing = INGREDIENTS_CATALOG.find(i => i.name === form.ingredient);
    if (!ing) { showToast('Sélectionnez un ingrédient', 'error'); return; }
    const qty = parseFloat(form.quantity);
    if (!qty || qty <= 0) { showToast('Quantité invalide', 'error'); return; }

    const newEntry: WasteEntry = {
      id: Math.max(0, ...entries.map(e => e.id)) + 1,
      date: todayStr,
      ingredient: ing.name,
      quantity: qty,
      unit: ing.unit,
      costPerUnit: ing.cost,
      reason: form.reason,
      notes: form.notes,
    };

    setEntries(prev => [...prev, newEntry]);
    setForm({ ingredient: '', quantity: '', reason: 'perime', notes: '' });
    setShowAddModal(false);
    showToast(`Perte déclarée : ${qty} ${ing.unit} de ${ing.name} (${formatEuro(qty * ing.cost)})`, 'success');
  }

  // ─── Render ────────────────────────────────────────────────────────────────

  const periodLabels: Record<Period, string> = { jour: "Aujourd'hui", semaine: 'Cette semaine', mois: 'Ce mois' };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-3">
            <Trash2 className="w-7 h-7 text-red-500" />
            Suivi du Gaspillage
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Analysez et réduisez les pertes alimentaires de votre restaurant
          </p>
        </div>
        <div className="flex items-center gap-3">
          {/* Period selector */}
          <div className="flex rounded-lg border border-slate-200 dark:border-slate-700 overflow-hidden">
            {(['jour', 'semaine', 'mois'] as Period[]).map(p => (
              <button
                key={p}
                onClick={() => setPeriod(p)}
                className={`px-3 py-1.5 text-sm font-medium transition-colors ${
                  period === p
                    ? 'bg-blue-600 text-white'
                    : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700'
                }`}
              >
                {p === 'jour' ? 'Jour' : p === 'semaine' ? 'Semaine' : 'Mois'}
              </button>
            ))}
          </div>
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-500 text-white rounded-lg text-sm font-semibold transition-colors"
          >
            <Plus className="w-4 h-4" />
            Déclarer une perte
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total waste cost */}
        <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-slate-500 dark:text-slate-400">Pertes totales</span>
            <div className="p-2 rounded-lg bg-red-50 dark:bg-red-900/30">
              <TrendingDown className="w-4 h-4 text-red-500" />
            </div>
          </div>
          <div className="text-2xl font-bold text-slate-900 dark:text-white">{formatEuro(totalCost)}</div>
          <div className="flex items-center gap-1 mt-1">
            {costChange !== 0 && (
              <span className={`text-xs font-medium flex items-center gap-0.5 ${
                costChange > 0 ? 'text-red-500' : 'text-green-500'
              }`}>
                {costChange > 0 ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                {Math.abs(costChange).toFixed(1)}%
              </span>
            )}
            <span className="text-xs text-slate-400">{periodLabels[period]}</span>
          </div>
        </div>

        {/* Number of waste events */}
        <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-slate-500 dark:text-slate-400">Incidents</span>
            <div className="p-2 rounded-lg bg-amber-50 dark:bg-amber-900/30">
              <AlertTriangle className="w-4 h-4 text-amber-500" />
            </div>
          </div>
          <div className="text-2xl font-bold text-slate-900 dark:text-white">{entryCount}</div>
          <span className="text-xs text-slate-400">déclarations</span>
        </div>

        {/* Avg cost per incident */}
        <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-slate-500 dark:text-slate-400">Coût moyen</span>
            <div className="p-2 rounded-lg bg-violet-50 dark:bg-violet-900/30">
              <BarChart3 className="w-4 h-4 text-violet-500" />
            </div>
          </div>
          <div className="text-2xl font-bold text-slate-900 dark:text-white">
            {entryCount > 0 ? formatEuro(totalCost / entryCount) : '—'}
          </div>
          <span className="text-xs text-slate-400">par incident</span>
        </div>

        {/* Zero waste score */}
        <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-slate-500 dark:text-slate-400">Score anti-gaspi</span>
            <div className="p-2 rounded-lg bg-green-50 dark:bg-green-900/30">
              <Leaf className="w-4 h-4 text-green-500" />
            </div>
          </div>
          <div className="text-2xl font-bold text-slate-900 dark:text-white">{zeroWasteScore.toFixed(0)}/100</div>
          <span className="text-xs text-slate-400">objectif zéro déchet</span>
        </div>
      </div>

      {/* Zero Waste Progress Bar */}
      <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-5">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Target className="w-5 h-5 text-green-500" />
            <h2 className="font-semibold text-slate-800 dark:text-slate-100">Objectif Zéro Déchet</h2>
          </div>
          <span className="text-sm text-slate-500 dark:text-slate-400">
            Objectif : réduire de 20% ({formatEuro(monthlyTarget.target)})
          </span>
        </div>
        <div className="relative w-full h-6 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
          <div
            className={`absolute inset-y-0 left-0 rounded-full transition-all duration-700 ${
              zeroWasteScore >= 70 ? 'bg-green-500' : zeroWasteScore >= 40 ? 'bg-amber-500' : 'bg-red-500'
            }`}
            style={{ width: `${zeroWasteScore}%` }}
          />
          <div className="absolute inset-0 flex items-center justify-center text-xs font-bold text-slate-700 dark:text-white">
            {zeroWasteScore.toFixed(0)}% — {formatEuro(monthlyTarget.actual)} / {formatEuro(monthlyTarget.target)} objectif
          </div>
        </div>
        <div className="flex justify-between text-xs text-slate-400 mt-1">
          <span>Critique</span>
          <span>Bon</span>
          <span>Excellent</span>
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Pie chart: by reason */}
        <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-5">
          <div className="flex items-center gap-2 mb-4">
            <PieChartIcon className="w-5 h-5 text-blue-500" />
            <h2 className="font-semibold text-slate-800 dark:text-slate-100">Pertes par cause</h2>
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
            <div className="h-[280px] flex items-center justify-center text-slate-400">Aucune donnée</div>
          )}
        </div>

        {/* Bar chart: trend */}
        <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-5">
          <div className="flex items-center gap-2 mb-4">
            <BarChart3 className="w-5 h-5 text-emerald-500" />
            <h2 className="font-semibold text-slate-800 dark:text-slate-100">Évolution des pertes</h2>
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
        <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-5">
          <div className="flex items-center gap-2 mb-4">
            <ArrowDown className="w-5 h-5 text-red-500" />
            <h2 className="font-semibold text-slate-800 dark:text-slate-100">Top 5 — Ingrédients les plus gaspillés</h2>
          </div>
          {topWasted.length > 0 ? (
            <div className="space-y-3">
              {topWasted.map((item, i) => {
                const maxCost = topWasted[0].cost;
                const pct = (item.cost / maxCost) * 100;
                return (
                  <div key={item.name}>
                    <div className="flex items-center justify-between text-sm mb-1">
                      <span className="font-medium text-slate-700 dark:text-slate-200">
                        <span className="text-slate-400 mr-2">#{i + 1}</span>
                        {item.name}
                      </span>
                      <span className="font-semibold text-red-600 dark:text-red-400">{formatEuro(item.cost)}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="flex-1 h-2.5 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-red-500 rounded-full transition-all duration-500"
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                      <span className="text-xs text-slate-400 w-20 text-right">
                        {item.qty.toFixed(1)} {item.unit}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="text-sm text-slate-400">Aucune donnée pour cette période</p>
          )}
        </div>

        {/* AI Tips */}
        <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-5">
          <button
            onClick={() => setShowTips(!showTips)}
            className="flex items-center justify-between w-full mb-3"
          >
            <div className="flex items-center gap-2">
              <Lightbulb className="w-5 h-5 text-amber-500" />
              <h2 className="font-semibold text-slate-800 dark:text-slate-100">Conseils IA anti-gaspi</h2>
            </div>
            {showTips ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
          </button>
          {showTips && (
            <div className="space-y-3">
              {suggestions.map((tip, i) => (
                <div
                  key={i}
                  className="flex gap-3 p-3 rounded-lg bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800/40"
                >
                  <span className="text-sm text-slate-700 dark:text-slate-200 leading-relaxed">{tip}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Recent waste entries table */}
      <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-5">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
          <h2 className="font-semibold text-slate-800 dark:text-slate-100 flex items-center gap-2">
            <Calendar className="w-5 h-5 text-slate-400" />
            Dernières déclarations
          </h2>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Rechercher..."
              className="pl-9 pr-4 py-2 border border-slate-200 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-sm text-slate-800 dark:text-slate-100 placeholder:text-slate-400 w-full sm:w-64 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-700">
                <th className="text-left py-2 px-3 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase">Date</th>
                <th className="text-left py-2 px-3 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase">Ingrédient</th>
                <th className="text-right py-2 px-3 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase">Quantité</th>
                <th className="text-left py-2 px-3 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase">Cause</th>
                <th className="text-right py-2 px-3 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase">Coût</th>
              </tr>
            </thead>
            <tbody>
              {recentEntries.map(e => (
                <tr key={e.id} className="border-b border-slate-100 dark:border-slate-700/50 hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors">
                  <td className="py-2.5 px-3 text-slate-600 dark:text-slate-300">
                    {new Date(e.date).toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit' })}
                  </td>
                  <td className="py-2.5 px-3 font-medium text-slate-800 dark:text-slate-100">{e.ingredient}</td>
                  <td className="py-2.5 px-3 text-right text-slate-600 dark:text-slate-300">
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
                </tr>
              ))}
              {recentEntries.length === 0 && (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-slate-400">
                    Aucune perte déclarée pour cette période
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Waste Modal */}
      <Modal isOpen={showAddModal} onClose={() => setShowAddModal(false)} title="Déclarer une perte alimentaire">
        <div className="space-y-4">
          {/* Ingredient */}
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Ingrédient</label>
            <select
              value={form.ingredient}
              onChange={e => setForm(f => ({ ...f, ingredient: e.target.value }))}
              className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Sélectionner un ingrédient</option>
              {INGREDIENTS_CATALOG.map(ing => (
                <option key={ing.name} value={ing.name}>{ing.name} ({formatEuro(ing.cost)}/{ing.unit})</option>
              ))}
            </select>
          </div>

          {/* Quantity */}
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Quantité</label>
            <div className="flex items-center gap-2">
              <input
                type="number"
                step="0.01"
                min="0"
                value={form.quantity}
                onChange={e => setForm(f => ({ ...f, quantity: e.target.value }))}
                placeholder="0.00"
                className="flex-1 px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-blue-500"
              />
              {form.ingredient && (
                <span className="text-sm text-slate-400 font-medium">
                  {INGREDIENTS_CATALOG.find(i => i.name === form.ingredient)?.unit}
                </span>
              )}
            </div>
          </div>

          {/* Reason */}
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Cause</label>
            <div className="grid grid-cols-2 gap-2">
              {(Object.entries(REASON_LABELS) as [WasteReason, string][]).map(([key, label]) => (
                <button
                  key={key}
                  onClick={() => setForm(f => ({ ...f, reason: key }))}
                  className={`px-3 py-2.5 rounded-lg text-sm font-medium border-2 transition-colors ${
                    form.reason === key
                      ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300'
                      : 'border-slate-200 dark:border-slate-600 text-slate-600 dark:text-slate-300 hover:border-slate-300 dark:hover:border-slate-500'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Notes (optionnel)</label>
            <textarea
              value={form.notes}
              onChange={e => setForm(f => ({ ...f, notes: e.target.value }))}
              rows={2}
              placeholder="Détails supplémentaires..."
              className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-blue-500 resize-none"
            />
          </div>

          {/* Estimated cost preview */}
          {form.ingredient && form.quantity && (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800/40 rounded-lg p-3 text-sm">
              <span className="text-slate-600 dark:text-slate-300">Coût estimé : </span>
              <span className="font-bold text-red-600 dark:text-red-400">
                {formatEuro(parseFloat(form.quantity || '0') * (INGREDIENTS_CATALOG.find(i => i.name === form.ingredient)?.cost || 0))}
              </span>
            </div>
          )}

          {/* Submit */}
          <div className="flex justify-end gap-3 pt-2">
            <button
              onClick={() => setShowAddModal(false)}
              className="px-4 py-2 rounded-lg text-sm font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
            >
              Annuler
            </button>
            <button
              onClick={handleAddWaste}
              className="flex items-center gap-2 px-5 py-2 bg-red-600 hover:bg-red-500 text-white rounded-lg text-sm font-semibold transition-colors"
            >
              <Trash2 className="w-4 h-4" />
              Déclarer la perte
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
