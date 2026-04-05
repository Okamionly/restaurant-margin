import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Building2, MapPin, Phone, Users, Plus, Edit, Trash2, Check, ChefHat, ClipboardList, Package, Truck,
  TrendingUp, TrendingDown, DollarSign, Award, AlertTriangle, BarChart3, ChevronDown, ArrowRight,
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { useRestaurant, type Restaurant } from '../hooks/useRestaurant';
import { useToast } from '../hooks/useToast';
import { fetchRestaurantsOverview, type RestaurantOverview, type RestaurantOverviewStat } from '../services/api';
import Modal from '../components/Modal';
import { useTranslation } from '../hooks/useTranslation';

interface RestaurantFormData {
  name: string;
  address: string;
  cuisineType: string;
  phone: string;
  coversPerDay: number;
}

const EMPTY_FORM: RestaurantFormData = {
  name: '',
  address: '',
  cuisineType: '',
  phone: '',
  coversPerDay: 0,
};

function formatCurrency(n: number): string {
  return n.toLocaleString('fr-FR', { minimumFractionDigits: 0, maximumFractionDigits: 0 }) + ' \u20AC';
}

function formatPercent(n: number): string {
  return n.toFixed(1) + ' %';
}

// ── Custom Tooltip for Charts ──
function ChartTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white dark:bg-[#0A0A0A] border border-[#E5E7EB] dark:border-[#1A1A1A] rounded-lg px-3 py-2 shadow-lg">
      <p className="text-xs font-medium text-[#111111] dark:text-white mb-1">{label}</p>
      {payload.map((entry: any, i: number) => (
        <p key={i} className="text-xs text-[#6B7280] dark:text-[#A3A3A3]">
          {entry.name}: <span className="font-semibold text-[#111111] dark:text-white">{entry.value.toFixed(1)} %</span>
        </p>
      ))}
    </div>
  );
}

// ── Overview Dashboard Section ──
function OverviewDashboard({
  overview,
  onNavigateRestaurant,
}: {
  overview: RestaurantOverview;
  onNavigateRestaurant: (id: number) => void;
}) {
  const { restaurants, totals } = overview;
  const navigate = useNavigate();

  // Find best/worst by margin %
  const sorted = useMemo(() => [...restaurants].sort((a, b) => b.marginPercent - a.marginPercent), [restaurants]);
  const best = sorted[0] || null;
  const worst = sorted[sorted.length - 1] || null;
  const hasDifference = best && worst && best.id !== worst.id;

  // Chart data
  const chartData = useMemo(
    () => restaurants.map((r) => ({ name: r.name.length > 14 ? r.name.slice(0, 14) + '...' : r.name, 'Marge %': r.marginPercent, 'Food Cost %': r.foodCostPercent, fullName: r.name })),
    [restaurants]
  );

  // Quick switch dropdown
  const [dropdownOpen, setDropdownOpen] = useState(false);

  return (
    <div className="space-y-6">
      {/* Section header */}
      <div className="flex items-center gap-2">
        <BarChart3 className="w-5 h-5 text-[#111111] dark:text-white" />
        <h3 className="text-lg font-bold text-[#111111] dark:text-white font-satoshi">Vue d'ensemble du portefeuille</h3>
      </div>

      {/* Portfolio total KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-[#0A0A0A] border border-[#E5E7EB] dark:border-[#1A1A1A] rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <DollarSign className="w-4 h-4 text-[#111111] dark:text-white" />
            <span className="text-xs font-medium uppercase tracking-wide text-[#6B7280] dark:text-[#737373]">CA Total</span>
          </div>
          <p className="text-xl font-bold text-[#111111] dark:text-white font-satoshi">{formatCurrency(totals.totalRevenue)}</p>
        </div>
        <div className="bg-white dark:bg-[#0A0A0A] border border-[#E5E7EB] dark:border-[#1A1A1A] rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="w-4 h-4 text-[#111111] dark:text-white" />
            <span className="text-xs font-medium uppercase tracking-wide text-[#6B7280] dark:text-[#737373]">Marge Moy.</span>
          </div>
          <p className={`text-xl font-bold font-satoshi ${totals.avgMarginPercent >= 65 ? 'text-[#111111] dark:text-white' : 'text-[#DC2626]'}`}>
            {formatPercent(totals.avgMarginPercent)}
          </p>
        </div>
        <div className="bg-white dark:bg-[#0A0A0A] border border-[#E5E7EB] dark:border-[#1A1A1A] rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <ClipboardList className="w-4 h-4 text-[#111111] dark:text-white" />
            <span className="text-xs font-medium uppercase tracking-wide text-[#6B7280] dark:text-[#737373]">Recettes</span>
          </div>
          <p className="text-xl font-bold text-[#111111] dark:text-white font-satoshi">{totals.totalRecipes}</p>
        </div>
        <div className="bg-white dark:bg-[#0A0A0A] border border-[#E5E7EB] dark:border-[#1A1A1A] rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <Package className="w-4 h-4 text-[#111111] dark:text-white" />
            <span className="text-xs font-medium uppercase tracking-wide text-[#6B7280] dark:text-[#737373]">Ingredients</span>
          </div>
          <p className="text-xl font-bold text-[#111111] dark:text-white font-satoshi">{totals.totalIngredients}</p>
        </div>
      </div>

      {/* Best / Worst + Quick Switch */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Best performer */}
        {best && (
          <div
            className="bg-white dark:bg-[#0A0A0A] border border-[#E5E7EB] dark:border-[#1A1A1A] rounded-xl p-4 cursor-pointer hover:border-[#111111] dark:hover:border-white transition-colors"
            onClick={() => onNavigateRestaurant(best.id)}
          >
            <div className="flex items-center gap-2 mb-3">
              <Award className="w-4 h-4 text-[#111111] dark:text-white" />
              <span className="text-xs font-bold uppercase tracking-wide text-[#111111] dark:text-white">Meilleure performance</span>
            </div>
            <p className="text-sm font-semibold text-[#111111] dark:text-white mb-1">{best.name}</p>
            <div className="flex items-center gap-3">
              <span className="text-lg font-bold text-[#111111] dark:text-white">{formatPercent(best.marginPercent)}</span>
              <span className="text-xs text-[#6B7280] dark:text-[#737373]">marge</span>
            </div>
            <div className="mt-2 flex items-center gap-1 text-xs text-[#6B7280] dark:text-[#737373]">
              <ArrowRight className="w-3 h-3" />
              Voir le dashboard
            </div>
          </div>
        )}

        {/* Worst performer */}
        {worst && hasDifference && (
          <div
            className="bg-white dark:bg-[#0A0A0A] border border-[#E5E7EB] dark:border-[#1A1A1A] rounded-xl p-4 cursor-pointer hover:border-[#111111] dark:hover:border-white transition-colors"
            onClick={() => onNavigateRestaurant(worst.id)}
          >
            <div className="flex items-center gap-2 mb-3">
              <AlertTriangle className="w-4 h-4 text-[#DC2626]" />
              <span className="text-xs font-bold uppercase tracking-wide text-[#DC2626]">A ameliorer</span>
            </div>
            <p className="text-sm font-semibold text-[#111111] dark:text-white mb-1">{worst.name}</p>
            <div className="flex items-center gap-3">
              <span className="text-lg font-bold text-[#DC2626]">{formatPercent(worst.marginPercent)}</span>
              <span className="text-xs text-[#6B7280] dark:text-[#737373]">marge</span>
            </div>
            <div className="mt-2 flex items-center gap-1 text-xs text-[#6B7280] dark:text-[#737373]">
              <ArrowRight className="w-3 h-3" />
              Voir le dashboard
            </div>
          </div>
        )}

        {/* Quick switch dropdown */}
        <div className="bg-white dark:bg-[#0A0A0A] border border-[#E5E7EB] dark:border-[#1A1A1A] rounded-xl p-4 relative">
          <div className="flex items-center gap-2 mb-3">
            <Building2 className="w-4 h-4 text-[#111111] dark:text-white" />
            <span className="text-xs font-bold uppercase tracking-wide text-[#111111] dark:text-white">Acces rapide</span>
          </div>
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="w-full flex items-center justify-between px-3 py-2.5 rounded-lg border border-[#E5E7EB] dark:border-[#1A1A1A] bg-[#FAFAFA] dark:bg-[#171717] text-sm text-[#111111] dark:text-white hover:border-[#111111] dark:hover:border-white transition-colors"
          >
            <span>Choisir un restaurant</span>
            <ChevronDown className={`w-4 h-4 transition-transform ${dropdownOpen ? 'rotate-180' : ''}`} />
          </button>
          {dropdownOpen && (
            <div className="absolute left-4 right-4 top-[calc(100%-4px)] z-10 bg-white dark:bg-[#0A0A0A] border border-[#E5E7EB] dark:border-[#1A1A1A] rounded-lg shadow-lg overflow-hidden">
              {restaurants.map((r) => (
                <button
                  key={r.id}
                  onClick={() => {
                    setDropdownOpen(false);
                    onNavigateRestaurant(r.id);
                  }}
                  className="w-full flex items-center justify-between px-3 py-2.5 text-sm text-left hover:bg-[#F3F4F6] dark:hover:bg-[#171717] transition-colors"
                >
                  <span className="text-[#111111] dark:text-white font-medium">{r.name}</span>
                  <span className="text-xs text-[#6B7280] dark:text-[#737373]">{formatPercent(r.marginPercent)}</span>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Comparison table */}
      <div className="bg-white dark:bg-[#0A0A0A] border border-[#E5E7EB] dark:border-[#1A1A1A] rounded-xl overflow-hidden">
        <div className="px-4 py-3 border-b border-[#E5E7EB] dark:border-[#1A1A1A]">
          <h4 className="text-sm font-bold text-[#111111] dark:text-white font-satoshi">Comparaison des KPI</h4>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[#E5E7EB] dark:border-[#1A1A1A]">
                <th className="text-left px-4 py-2.5 text-xs font-bold uppercase tracking-wide text-[#6B7280] dark:text-[#737373]">Restaurant</th>
                <th className="text-right px-4 py-2.5 text-xs font-bold uppercase tracking-wide text-[#6B7280] dark:text-[#737373]">CA</th>
                <th className="text-right px-4 py-2.5 text-xs font-bold uppercase tracking-wide text-[#6B7280] dark:text-[#737373]">Food Cost %</th>
                <th className="text-right px-4 py-2.5 text-xs font-bold uppercase tracking-wide text-[#6B7280] dark:text-[#737373]">Marge %</th>
                <th className="text-right px-4 py-2.5 text-xs font-bold uppercase tracking-wide text-[#6B7280] dark:text-[#737373]">Recettes</th>
                <th className="px-4 py-2.5"></th>
              </tr>
            </thead>
            <tbody>
              {sorted.map((r) => (
                <tr
                  key={r.id}
                  className="border-b border-[#E5E7EB] dark:border-[#1A1A1A] last:border-0 hover:bg-[#FAFAFA] dark:hover:bg-[#171717] transition-colors cursor-pointer"
                  onClick={() => onNavigateRestaurant(r.id)}
                >
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <Building2 className="w-4 h-4 text-[#6B7280] dark:text-[#737373] flex-shrink-0" />
                      <span className="font-medium text-[#111111] dark:text-white">{r.name}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-right font-medium text-[#111111] dark:text-white">{formatCurrency(r.revenue)}</td>
                  <td className="px-4 py-3 text-right">
                    <span className={`font-medium ${r.foodCostPercent <= 30 ? 'text-[#111111] dark:text-white' : 'text-[#DC2626]'}`}>
                      {formatPercent(r.foodCostPercent)}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <span className={`inline-flex items-center gap-1 font-bold ${r.marginPercent >= 65 ? 'text-[#111111] dark:text-white' : 'text-[#DC2626]'}`}>
                      {r.marginPercent >= 65 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                      {formatPercent(r.marginPercent)}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right text-[#6B7280] dark:text-[#737373]">{r.recipeCount}</td>
                  <td className="px-4 py-3 text-right">
                    <ArrowRight className="w-4 h-4 text-[#6B7280] dark:text-[#737373]" />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Bar chart: margin comparison */}
      {chartData.length > 1 && (
        <div className="bg-white dark:bg-[#0A0A0A] border border-[#E5E7EB] dark:border-[#1A1A1A] rounded-xl p-4">
          <div className="flex items-center gap-2 mb-4">
            <BarChart3 className="w-4 h-4 text-[#111111] dark:text-white" />
            <h4 className="text-sm font-bold text-[#111111] dark:text-white font-satoshi">Marge vs Food Cost par restaurant</h4>
          </div>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={chartData} barGap={4}>
              <CartesianGrid strokeDasharray="3 3" stroke="currentColor" className="text-[#E5E7EB] dark:text-[#1A1A1A]" />
              <XAxis
                dataKey="name"
                tick={{ fill: '#6B7280', fontSize: 11 }}
                axisLine={{ stroke: '#E5E7EB' }}
                tickLine={false}
              />
              <YAxis
                tick={{ fill: '#6B7280', fontSize: 11 }}
                axisLine={{ stroke: '#E5E7EB' }}
                tickLine={false}
                domain={[0, 100]}
                tickFormatter={(v: number) => `${v}%`}
              />
              <Tooltip content={<ChartTooltip />} />
              <Bar dataKey="Marge %" radius={[4, 4, 0, 0]} maxBarSize={48}>
                {chartData.map((_: any, index: number) => (
                  <Cell key={index} fill="#111111" className="dark:fill-white" />
                ))}
              </Bar>
              <Bar dataKey="Food Cost %" radius={[4, 4, 0, 0]} maxBarSize={48} fill="#D4D4D4" className="dark:fill-[#404040]" />
            </BarChart>
          </ResponsiveContainer>
          <div className="flex items-center justify-center gap-6 mt-2">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-sm bg-[#111111] dark:bg-white" />
              <span className="text-xs text-[#6B7280] dark:text-[#737373]">Marge %</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-sm bg-[#D4D4D4] dark:bg-[#404040]" />
              <span className="text-xs text-[#6B7280] dark:text-[#737373]">Food Cost %</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ── Main Page ──
export default function Restaurants() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { restaurants, selectedRestaurant, loading, switchRestaurant, addRestaurant, updateRestaurant, removeRestaurant } = useRestaurant();
  const { showToast } = useToast();
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState<RestaurantFormData>(EMPTY_FORM);
  const [submitting, setSubmitting] = useState(false);

  // Overview data
  const [overview, setOverview] = useState<RestaurantOverview | null>(null);
  const [overviewLoading, setOverviewLoading] = useState(false);

  const hasMultiple = restaurants.length > 1;

  useEffect(() => {
    if (hasMultiple) {
      setOverviewLoading(true);
      fetchRestaurantsOverview()
        .then(setOverview)
        .catch(() => {})
        .finally(() => setOverviewLoading(false));
    }
  }, [hasMultiple, restaurants.length]);

  function handleNavigateRestaurant(id: number) {
    switchRestaurant(id);
    navigate('/');
  }

  function openAdd() {
    setEditingId(null);
    setForm(EMPTY_FORM);
    setShowModal(true);
  }

  function openEdit(r: Restaurant) {
    setEditingId(r.id);
    setForm({
      name: r.name,
      address: r.address || '',
      cuisineType: r.cuisineType || '',
      phone: r.phone || '',
      coversPerDay: r.coversPerDay,
    });
    setShowModal(true);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name.trim()) {
      showToast('Le nom du restaurant est requis', 'error');
      return;
    }
    setSubmitting(true);
    try {
      if (editingId) {
        await updateRestaurant(editingId, { ...form });
        showToast('Restaurant mis à jour', 'success');
      } else {
        await addRestaurant(form);
        showToast('Restaurant ajoute avec succes', 'success');
      }
      setShowModal(false);
    } catch {
      showToast('Erreur lors de la sauvegarde', 'error');
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDelete(id: number, name: string) {
    if (restaurants.length <= 1) {
      showToast('Vous devez avoir au moins un restaurant', 'error');
      return;
    }
    try {
      await removeRestaurant(id);
      showToast(`"${name}" supprime`, 'info');
    } catch {
      showToast('Erreur lors de la suppression', 'error');
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-[#9CA3AF] dark:text-[#737373]">Chargement...</div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-[#111111] dark:text-white font-satoshi">Mes Restaurants</h2>
          <p className="text-sm text-[#9CA3AF] dark:text-[#737373] mt-1">
            {hasMultiple
              ? `${restaurants.length} etablissements — comparez et gerez votre portefeuille`
              : 'Gerez vos etablissements et basculez entre eux'}
          </p>
        </div>
        <button
          onClick={openAdd}
          className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-[#111111] dark:bg-white hover:bg-[#333333] dark:hover:bg-[#E5E5E5] text-white dark:text-[#111111] text-sm font-medium transition-colors shadow-sm"
        >
          <Plus className="w-4 h-4" />
          Ajouter un restaurant
        </button>
      </div>

      {/* Overview Dashboard (only if multiple restaurants) */}
      {hasMultiple && overview && !overviewLoading && (
        <OverviewDashboard overview={overview} onNavigateRestaurant={handleNavigateRestaurant} />
      )}

      {hasMultiple && overviewLoading && (
        <div className="bg-white dark:bg-[#0A0A0A] border border-[#E5E7EB] dark:border-[#1A1A1A] rounded-xl p-8 flex items-center justify-center">
          <div className="text-sm text-[#9CA3AF] dark:text-[#737373]">Chargement de l'apercu...</div>
        </div>
      )}

      {/* Divider between overview and cards */}
      {hasMultiple && (
        <div className="flex items-center gap-3">
          <div className="flex-1 h-px bg-[#E5E7EB] dark:bg-[#1A1A1A]" />
          <span className="text-xs font-bold uppercase tracking-wide text-[#6B7280] dark:text-[#737373]">Gestion des restaurants</span>
          <div className="flex-1 h-px bg-[#E5E7EB] dark:bg-[#1A1A1A]" />
        </div>
      )}

      {/* Restaurant Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {restaurants.map((r) => {
          const isSelected = selectedRestaurant?.id === r.id;
          return (
            <div
              key={r.id}
              onClick={() => switchRestaurant(r.id)}
              className={`relative bg-white dark:bg-[#0A0A0A] rounded-xl shadow-sm border-2 transition-all cursor-pointer hover:shadow-md ${
                isSelected
                  ? 'border-[#111111] dark:border-white ring-2 ring-[#111111]/20 dark:ring-white/20'
                  : 'border-[#E5E7EB] dark:border-[#1A1A1A] hover:border-[#111111]/40 dark:hover:border-white/40'
              }`}
            >
              {/* Selected badge */}
              {isSelected && (
                <div className="absolute -top-2.5 left-4 flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#111111] dark:bg-white text-white dark:text-[#111111] text-xs font-medium">
                  <Check className="w-3 h-3" />
                  Actif
                </div>
              )}

              <div className="p-5">
                {/* Top row: name + actions */}
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className={`p-2.5 rounded-lg ${isSelected ? 'bg-[#111111]/10 dark:bg-white/10' : 'bg-[#F3F4F6] dark:bg-[#171717]'}`}>
                      <Building2 className={`w-5 h-5 ${isSelected ? 'text-[#111111] dark:text-white' : 'text-[#9CA3AF] dark:text-[#737373]'}`} />
                    </div>
                    <div>
                      <h3 className="font-semibold text-[#111111] dark:text-white">{r.name}</h3>
                      <span className="text-xs px-2 py-0.5 rounded-full bg-[#F3F4F6] dark:bg-[#171717] text-[#6B7280] dark:text-[#A3A3A3]">
                        {r.cuisineType || '\u2014'}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
                    <button
                      onClick={() => openEdit(r)}
                      className="p-1.5 rounded-lg hover:bg-[#F3F4F6] dark:hover:bg-[#171717] text-[#9CA3AF] dark:text-[#737373] hover:text-[#111111] dark:hover:text-white transition-colors"
                      title="Modifier"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(r.id, r.name)}
                      className="p-1.5 rounded-lg hover:bg-[#F3F4F6] dark:hover:bg-[#171717] text-[#9CA3AF] dark:text-[#737373] hover:text-red-600 dark:hover:text-red-400 transition-colors"
                      title="Supprimer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Info rows */}
                <div className="space-y-1.5 mb-4">
                  <div className="flex items-center gap-2 text-sm text-[#9CA3AF] dark:text-[#737373]">
                    <MapPin className="w-3.5 h-3.5 flex-shrink-0" />
                    {r.address || '\u2014'}
                  </div>
                  <div className="flex items-center gap-2 text-sm text-[#9CA3AF] dark:text-[#737373]">
                    <Phone className="w-3.5 h-3.5 flex-shrink-0" />
                    {r.phone || '\u2014'}
                  </div>
                  <div className="flex items-center gap-2 text-sm text-[#9CA3AF] dark:text-[#737373]">
                    <Users className="w-3.5 h-3.5 flex-shrink-0" />
                    {r.coversPerDay} couverts/jour
                  </div>
                </div>

                {/* Stats row */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-3 border-t border-[#E5E7EB] dark:border-[#1A1A1A]">
                  <div className="text-center">
                    <div className="flex items-center justify-center gap-1 text-[#9CA3AF] dark:text-[#737373] mb-0.5">
                      <ClipboardList className="w-3.5 h-3.5" />
                    </div>
                    <div className="text-lg font-bold text-[#111111] dark:text-white">{r._count?.recipes ?? 0}</div>
                    <div className="text-[10px] text-[#9CA3AF] dark:text-[#737373] uppercase tracking-wide">Recettes</div>
                  </div>
                  <div className="text-center">
                    <div className="flex items-center justify-center gap-1 text-[#9CA3AF] dark:text-[#737373] mb-0.5">
                      <Package className="w-3.5 h-3.5" />
                    </div>
                    <div className="text-lg font-bold text-[#111111] dark:text-white">{r._count?.ingredients ?? 0}</div>
                    <div className="text-[10px] text-[#9CA3AF] dark:text-[#737373] uppercase tracking-wide">Ingredients</div>
                  </div>
                  <div className="text-center">
                    <div className="flex items-center justify-center gap-1 text-[#9CA3AF] dark:text-[#737373] mb-0.5">
                      <Truck className="w-3.5 h-3.5" />
                    </div>
                    <div className="text-lg font-bold text-[#111111] dark:text-white">{r._count?.suppliers ?? 0}</div>
                    <div className="text-[10px] text-[#9CA3AF] dark:text-[#737373] uppercase tracking-wide">Fournisseurs</div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add/Edit Modal */}
      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title={editingId ? 'Modifier le restaurant' : 'Ajouter un restaurant'}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-[#9CA3AF] dark:text-[#737373] mb-1">Nom du restaurant *</label>
            <div className="relative">
              <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9CA3AF] dark:text-[#737373]" />
              <input
                type="text"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full pl-10 pr-3 py-2.5 rounded-lg border border-[#E5E7EB] dark:border-[#1A1A1A] bg-white dark:bg-[#171717] text-[#111111] dark:text-white focus:ring-2 focus:ring-[#111111] dark:focus:ring-white focus:border-[#111111] dark:focus:border-white outline-none"
                placeholder="Ex: Le Bistrot de Youssef"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-[#9CA3AF] dark:text-[#737373] mb-1">Adresse</label>
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9CA3AF] dark:text-[#737373]" />
              <input
                type="text"
                value={form.address}
                onChange={(e) => setForm({ ...form, address: e.target.value })}
                className="w-full pl-10 pr-3 py-2.5 rounded-lg border border-[#E5E7EB] dark:border-[#1A1A1A] bg-white dark:bg-[#171717] text-[#111111] dark:text-white focus:ring-2 focus:ring-[#111111] dark:focus:ring-white focus:border-[#111111] dark:focus:border-white outline-none"
                placeholder="25 rue de la Paix, Paris"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-[#9CA3AF] dark:text-[#737373] mb-1">Type de cuisine</label>
              <div className="relative">
                <ChefHat className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9CA3AF] dark:text-[#737373]" />
                <input
                  type="text"
                  value={form.cuisineType}
                  onChange={(e) => setForm({ ...form, cuisineType: e.target.value })}
                  className="w-full pl-10 pr-3 py-2.5 rounded-lg border border-[#E5E7EB] dark:border-[#1A1A1A] bg-white dark:bg-[#171717] text-[#111111] dark:text-white focus:ring-2 focus:ring-[#111111] dark:focus:ring-white focus:border-[#111111] dark:focus:border-white outline-none"
                  placeholder="Cuisine francaise"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-[#9CA3AF] dark:text-[#737373] mb-1">Telephone</label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9CA3AF] dark:text-[#737373]" />
                <input
                  type="tel"
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  className="w-full pl-10 pr-3 py-2.5 rounded-lg border border-[#E5E7EB] dark:border-[#1A1A1A] bg-white dark:bg-[#171717] text-[#111111] dark:text-white focus:ring-2 focus:ring-[#111111] dark:focus:ring-white focus:border-[#111111] dark:focus:border-white outline-none"
                  placeholder="01 42 00 00 00"
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-[#9CA3AF] dark:text-[#737373] mb-1">Couverts par jour</label>
            <div className="relative">
              <Users className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9CA3AF] dark:text-[#737373]" />
              <input
                type="number"
                min={0}
                value={form.coversPerDay || ''}
                onChange={(e) => setForm({ ...form, coversPerDay: parseInt(e.target.value) || 0 })}
                className="w-full pl-10 pr-3 py-2.5 rounded-lg border border-[#E5E7EB] dark:border-[#1A1A1A] bg-white dark:bg-[#171717] text-[#111111] dark:text-white focus:ring-2 focus:ring-[#111111] dark:focus:ring-white focus:border-[#111111] dark:focus:border-white outline-none"
                placeholder="80"
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={() => setShowModal(false)}
              className="px-4 py-2.5 rounded-lg border border-[#E5E7EB] dark:border-[#1A1A1A] text-[#9CA3AF] dark:text-[#737373] hover:bg-[#FAFAFA] dark:bg-[#0A0A0A] dark:hover:bg-[#171717] text-sm font-medium transition-colors"
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-4 py-2.5 rounded-lg bg-[#111111] dark:bg-white hover:bg-[#333333] dark:hover:bg-[#E5E5E5] disabled:opacity-50 text-white dark:text-[#111111] text-sm font-medium transition-colors"
            >
              {submitting ? 'En cours...' : editingId ? 'Enregistrer' : 'Ajouter'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
