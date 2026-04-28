import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Building2, MapPin, Phone, Users, Plus, Edit, Trash2, Check, ChefHat, ClipboardList, Package, Truck,
  TrendingUp, TrendingDown, DollarSign, AlertTriangle, BarChart3,
  Eye, GitCompare, Crown, ShieldAlert, Share2, ShoppingCart, ArrowLeftRight,
  Clock, Layers, Calculator, Send, CheckCircle2, X, Search, Briefcase,
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { useRestaurant, type Restaurant } from '../hooks/useRestaurant';
import { useToast } from '../hooks/useToast';
import { fetchRestaurantsOverview, type RestaurantOverview, type RestaurantOverviewStat } from '../services/api';
import Modal from '../components/Modal';
import { useTranslation } from '../hooks/useTranslation';

// ── Types ──
interface RestaurantFormData {
  name: string;
  address: string;
  cuisineType: string;
  phone: string;
  coversPerDay: number;
  openingHour: string;
  closingHour: string;
}

type TabId = 'dashboard' | 'compare' | 'analytics' | 'templates' | 'ordering' | 'staff';

const EMPTY_FORM: RestaurantFormData = {
  name: '',
  address: '',
  cuisineType: '',
  phone: '',
  coversPerDay: 0,
  openingHour: '11:00',
  closingHour: '23:00',
};

// ── Helpers ──
function formatCurrency(n: number): string {
  return n.toLocaleString('fr-FR', { minimumFractionDigits: 0, maximumFractionDigits: 0 }) + ' \u20AC';
}

function formatPercent(n: number): string {
  return n.toFixed(1) + ' %';
}

function isRestaurantOpen(openingHour?: string, closingHour?: string): boolean {
  if (!openingHour || !closingHour) return true;
  const now = new Date();
  const h = now.getHours();
  const m = now.getMinutes();
  const current = h * 60 + m;
  const [oh, om] = openingHour.split(':').map(Number);
  const [ch, cm] = closingHour.split(':').map(Number);
  const open = oh * 60 + om;
  const close = ch * 60 + cm;
  if (close > open) return current >= open && current <= close;
  return current >= open || current <= close;
}

// Simulated KPI data for demo (in production, comes from API)
function getSimulatedKPIs(r: Restaurant, overview?: RestaurantOverviewStat) {
  const seed = r.id * 7;
  return {
    caToday: overview ? Math.round(overview.revenue / 30) : Math.round(800 + (seed % 2000)),
    marginPercent: overview ? overview.marginPercent : 60 + (seed % 25),
    foodCostPercent: overview ? overview.foodCostPercent : 22 + (seed % 15),
    activeStaff: 3 + (seed % 8),
    recipeCount: overview?.recipeCount ?? r._count?.recipes ?? 0,
    ingredientCount: overview?.ingredientCount ?? r._count?.ingredients ?? 0,
    supplierCount: r._count?.suppliers ?? 0,
    revenue: overview?.revenue ?? Math.round(24000 + (seed % 40000)),
  };
}

// ── Custom Tooltip for Charts ──
function ChartTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white dark:bg-mono-50 border border-mono-900 dark:border-mono-200 rounded-lg px-3 py-2 shadow-lg">
      <p className="text-xs font-medium text-mono-100 dark:text-white mb-1">{label}</p>
      {payload.map((entry: any, i: number) => (
        <p key={i} className="text-xs text-[#6B7280] dark:text-mono-700">
          {entry.name}: <span className="font-semibold text-mono-100 dark:text-white">
            {typeof entry.value === 'number' && entry.value < 200 ? entry.value.toFixed(1) + ' %' : formatCurrency(entry.value)}
          </span>
        </p>
      ))}
    </div>
  );
}

// ── Status Badge ──
function StatusBadge({ open }: { open: boolean }) {
  if (open) {
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-mono-100/5 dark:bg-white/5 text-xs font-semibold text-mono-100 dark:text-white">
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#22C55E] opacity-75" />
          <span className="relative inline-flex rounded-full h-2 w-2 bg-[#22C55E]" />
        </span>
        Ouvert
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-mono-950 dark:bg-[#171717] text-xs font-medium text-[#9CA3AF] dark:text-mono-500">
      <span className="h-2 w-2 rounded-full bg-[#9CA3AF] dark:bg-mono-500" />
      Ferme
    </span>
  );
}

// ── Tab Button ──
function TabButton({ active, icon: Icon, label, count, onClick }: {
  active: boolean;
  icon: any;
  label: string;
  count?: number;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${
        active
          ? 'bg-mono-100 dark:bg-white text-white dark:text-mono-100 shadow-sm'
          : 'text-[#6B7280] dark:text-mono-500 hover:bg-mono-950 dark:hover:bg-[#171717] hover:text-mono-100 dark:hover:text-white'
      }`}
    >
      <Icon className="w-4 h-4" />
      <span>{label}</span>
      {count !== undefined && count > 0 && (
        <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${
          active ? 'bg-white/20 dark:bg-mono-100/20' : 'bg-mono-950 dark:bg-[#171717]'
        }`}>
          {count}
        </span>
      )}
    </button>
  );
}

// ══════════════════════════════════════════════════════════════════════
// 1. RESTAURANT CARDS DASHBOARD
// ══════════════════════════════════════════════════════════════════════
function RestaurantCardsDashboard({
  restaurants,
  selectedRestaurant,
  overview,
  compareSet,
  onToggleCompare,
  onSwitch,
  onEdit,
  onDelete,
  onView,
}: {
  restaurants: Restaurant[];
  selectedRestaurant: Restaurant | null;
  overview: RestaurantOverview | null;
  compareSet: Set<number>;
  onToggleCompare: (id: number) => void;
  onSwitch: (id: number) => void;
  onEdit: (r: Restaurant) => void;
  onDelete: (id: number, name: string) => void;
  onView: (id: number) => void;
}) {
  const overviewMap = useMemo(() => {
    const map = new Map<number, RestaurantOverviewStat>();
    overview?.restaurants.forEach((r) => map.set(r.id, r));
    return map;
  }, [overview]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
      {restaurants.map((r) => {
        const isSelected = selectedRestaurant?.id === r.id;
        const isCompare = compareSet.has(r.id);
        const stat = overviewMap.get(r.id);
        const kpis = getSimulatedKPIs(r, stat);
        const open = isRestaurantOpen((r as any).openingHour, (r as any).closingHour);

        return (
          <div
            key={r.id}
            className={`relative bg-white dark:bg-mono-50 rounded-2xl shadow-sm border-2 transition-all group ${
              isSelected
                ? 'border-mono-100 dark:border-white ring-2 ring-mono-100/10 dark:ring-white/10'
                : isCompare
                  ? 'border-mono-100/50 dark:border-white/50 ring-1 ring-mono-100/10 dark:ring-white/10'
                  : 'border-mono-900 dark:border-mono-200 hover:border-mono-100/30 dark:hover:border-white/30'
            }`}
          >
            {/* Top badges */}
            <div className="absolute -top-2.5 left-4 flex items-center gap-2">
              {isSelected && (
                <span className="flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-mono-100 dark:bg-white text-white dark:text-mono-100 text-xs font-bold">
                  <Check className="w-3 h-3" />
                  Actif
                </span>
              )}
            </div>

            <div className="p-5">
              {/* Header: name + cuisine + status + actions */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <div className={`p-2.5 rounded-xl flex-shrink-0 ${isSelected ? 'bg-mono-100 dark:bg-white' : 'bg-mono-950 dark:bg-[#171717]'}`}>
                    <Building2 className={`w-5 h-5 ${isSelected ? 'text-white dark:text-mono-100' : 'text-[#9CA3AF] dark:text-mono-500'}`} />
                  </div>
                  <div className="min-w-0">
                    <h3 className="font-bold text-mono-100 dark:text-white truncate">{r.name}</h3>
                    <div className="flex items-center gap-2 mt-1">
                      {r.cuisineType && (
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-mono-950 dark:bg-[#171717] text-[#6B7280] dark:text-mono-700 font-medium uppercase tracking-wider">
                          {r.cuisineType}
                        </span>
                      )}
                      <StatusBadge open={open} />
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
                  <button onClick={() => onEdit(r)} className="p-1.5 rounded-lg hover:bg-mono-950 dark:hover:bg-[#171717] text-[#9CA3AF] dark:text-mono-500 hover:text-mono-100 dark:hover:text-white transition-colors" title="Modifier">
                    <Edit className="w-4 h-4" />
                  </button>
                  <button onClick={() => onDelete(r.id, r.name)} className="p-1.5 rounded-lg hover:bg-mono-950 dark:hover:bg-[#171717] text-[#9CA3AF] dark:text-mono-500 hover:text-[#DC2626] transition-colors" title="Supprimer">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Address */}
              {r.address && (
                <div className="flex items-center gap-2 text-sm text-[#6B7280] dark:text-mono-500 mb-4">
                  <MapPin className="w-3.5 h-3.5 flex-shrink-0" />
                  <span className="truncate">{r.address}</span>
                </div>
              )}

              {/* KPI Grid */}
              <div className="grid grid-cols-2 gap-3 mb-4">
                <div className="bg-mono-1000 dark:bg-mono-100 rounded-xl p-3">
                  <div className="text-[10px] font-bold uppercase tracking-wider text-[#9CA3AF] dark:text-mono-500 mb-1">CA Aujourd'hui</div>
                  <div className="text-lg font-bold text-mono-100 dark:text-white font-satoshi">{formatCurrency(kpis.caToday)}</div>
                </div>
                <div className="bg-mono-1000 dark:bg-mono-100 rounded-xl p-3">
                  <div className="text-[10px] font-bold uppercase tracking-wider text-[#9CA3AF] dark:text-mono-500 mb-1">Marge</div>
                  <div className={`text-lg font-bold font-satoshi ${kpis.marginPercent >= 65 ? 'text-mono-100 dark:text-white' : 'text-[#DC2626]'}`}>
                    {formatPercent(kpis.marginPercent)}
                  </div>
                </div>
                <div className="bg-mono-1000 dark:bg-mono-100 rounded-xl p-3">
                  <div className="text-[10px] font-bold uppercase tracking-wider text-[#9CA3AF] dark:text-mono-500 mb-1">Food Cost</div>
                  <div className={`text-lg font-bold font-satoshi ${kpis.foodCostPercent <= 30 ? 'text-mono-100 dark:text-white' : 'text-[#DC2626]'}`}>
                    {formatPercent(kpis.foodCostPercent)}
                  </div>
                </div>
                <div className="bg-mono-1000 dark:bg-mono-100 rounded-xl p-3">
                  <div className="text-[10px] font-bold uppercase tracking-wider text-[#9CA3AF] dark:text-mono-500 mb-1">Staff actif</div>
                  <div className="text-lg font-bold text-mono-100 dark:text-white font-satoshi flex items-center gap-1.5">
                    <Users className="w-4 h-4 text-[#9CA3AF] dark:text-mono-500" />
                    {kpis.activeStaff}
                  </div>
                </div>
              </div>

              {/* Stats mini row */}
              <div className="flex items-center gap-4 py-3 border-t border-mono-900 dark:border-mono-200 mb-4">
                <div className="flex items-center gap-1.5 text-xs text-[#6B7280] dark:text-mono-500">
                  <ClipboardList className="w-3.5 h-3.5" />
                  <span className="font-semibold text-mono-100 dark:text-white">{kpis.recipeCount}</span> recettes
                </div>
                <div className="flex items-center gap-1.5 text-xs text-[#6B7280] dark:text-mono-500">
                  <Package className="w-3.5 h-3.5" />
                  <span className="font-semibold text-mono-100 dark:text-white">{kpis.ingredientCount}</span> ingredients
                </div>
                <div className="flex items-center gap-1.5 text-xs text-[#6B7280] dark:text-mono-500">
                  <Truck className="w-3.5 h-3.5" />
                  <span className="font-semibold text-mono-100 dark:text-white">{kpis.supplierCount}</span> fourn.
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => onView(r.id)}
                  className="flex-1 flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl bg-mono-100 dark:bg-white hover:bg-[#333333] dark:hover:bg-[#E5E5E5] text-white dark:text-mono-100 text-sm font-medium transition-colors"
                >
                  <Eye className="w-4 h-4" />
                  Voir
                </button>
                <button
                  onClick={(e) => { e.stopPropagation(); onToggleCompare(r.id); }}
                  className={`flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl border-2 text-sm font-medium transition-all ${
                    isCompare
                      ? 'border-mono-100 dark:border-white bg-mono-100/5 dark:bg-white/5 text-mono-100 dark:text-white'
                      : 'border-mono-900 dark:border-mono-200 text-[#6B7280] dark:text-mono-500 hover:border-mono-100 dark:hover:border-white hover:text-mono-100 dark:hover:text-white'
                  }`}
                >
                  {isCompare ? <CheckCircle2 className="w-4 h-4" /> : <GitCompare className="w-4 h-4" />}
                  Comparer
                </button>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════
// 2. COMPARISON MODE
// ══════════════════════════════════════════════════════════════════════
function ComparisonMode({
  restaurants,
  compareIds,
  overview,
  onRemove,
}: {
  restaurants: Restaurant[];
  compareIds: number[];
  overview: RestaurantOverview | null;
  onRemove: (id: number) => void;
}) {
  const selected = useMemo(() => restaurants.filter((r) => compareIds.includes(r.id)), [restaurants, compareIds]);
  const overviewMap = useMemo(() => {
    const map = new Map<number, RestaurantOverviewStat>();
    overview?.restaurants.forEach((r) => map.set(r.id, r));
    return map;
  }, [overview]);

  const metrics = useMemo(() => {
    return selected.map((r) => {
      const stat = overviewMap.get(r.id);
      const kpis = getSimulatedKPIs(r, stat);
      return { id: r.id, name: r.name, ...kpis };
    });
  }, [selected, overviewMap]);

  const chartData = useMemo(() => {
    return metrics.map((m) => ({
      name: m.name.length > 12 ? m.name.slice(0, 12) + '...' : m.name,
      'Marge %': m.marginPercent,
      'Food Cost %': m.foodCostPercent,
      'CA': m.revenue,
    }));
  }, [metrics]);

  const metricDefs = [
    { key: 'revenue', label: 'CA Mensuel', format: formatCurrency, higher: true },
    { key: 'marginPercent', label: 'Marge %', format: formatPercent, higher: true },
    { key: 'foodCostPercent', label: 'Food Cost %', format: formatPercent, higher: false },
    { key: 'recipeCount', label: 'Nb Recettes', format: (n: number) => String(n), higher: true },
    { key: 'ingredientCount', label: 'Nb Ingredients', format: (n: number) => String(n), higher: true },
    { key: 'activeStaff', label: 'Staff Actif', format: (n: number) => String(n), higher: true },
  ];

  if (selected.length < 2) {
    return (
      <div className="bg-white dark:bg-mono-50 border border-mono-900 dark:border-mono-200 rounded-2xl p-12 text-center">
        <GitCompare className="w-12 h-12 text-mono-800 dark:text-mono-350 mx-auto mb-4" />
        <h3 className="text-lg font-bold text-mono-100 dark:text-white mb-2">Mode Comparaison</h3>
        <p className="text-sm text-[#6B7280] dark:text-mono-500 max-w-md mx-auto">
          Selectionnez 2 a 4 restaurants dans l'onglet Dashboard en cliquant sur "Comparer" pour les analyser cote a cote.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Selected restaurants pills */}
      <div className="flex items-center gap-2 flex-wrap">
        <span className="text-xs font-bold uppercase tracking-wider text-[#6B7280] dark:text-mono-500">Comparaison:</span>
        {selected.map((r) => (
          <span key={r.id} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-mono-100 dark:bg-white text-white dark:text-mono-100 text-xs font-medium">
            {r.name}
            <button onClick={() => onRemove(r.id)} className="hover:opacity-70 transition-opacity">
              <X className="w-3 h-3" />
            </button>
          </span>
        ))}
      </div>

      {/* Side-by-side comparison table */}
      <div className="bg-white dark:bg-mono-50 border border-mono-900 dark:border-mono-200 rounded-2xl overflow-hidden">
        <div className="px-5 py-4 border-b border-mono-900 dark:border-mono-200">
          <h4 className="text-sm font-bold text-mono-100 dark:text-white font-satoshi">Comparaison des KPI</h4>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-mono-900 dark:border-mono-200">
                <th className="text-left px-5 py-3 text-xs font-bold uppercase tracking-wider text-[#6B7280] dark:text-mono-500">Metrique</th>
                {selected.map((r) => (
                  <th key={r.id} className="text-center px-5 py-3 text-xs font-bold uppercase tracking-wider text-mono-100 dark:text-white">
                    {r.name}
                  </th>
                ))}
                <th className="text-center px-5 py-3 text-xs font-bold uppercase tracking-wider text-[#6B7280] dark:text-mono-500">Verdict</th>
              </tr>
            </thead>
            <tbody>
              {metricDefs.map((def) => {
                const values = metrics.map((m) => (m as any)[def.key] as number);
                const bestVal = def.higher ? Math.max(...values) : Math.min(...values);
                const worstVal = def.higher ? Math.min(...values) : Math.max(...values);
                const allSame = values.every((v) => v === values[0]);

                return (
                  <tr key={def.key} className="border-b border-mono-900 dark:border-mono-200 last:border-0">
                    <td className="px-5 py-3.5 font-medium text-mono-100 dark:text-white">{def.label}</td>
                    {metrics.map((m) => {
                      const val = (m as any)[def.key] as number;
                      const isBest = val === bestVal && !allSame;
                      const isWorst = val === worstVal && !allSame;
                      return (
                        <td key={m.id} className="px-5 py-3.5 text-center">
                          <span className={`font-semibold ${isBest ? 'text-mono-100 dark:text-white' : isWorst ? 'text-[#DC2626]' : 'text-[#6B7280] dark:text-mono-500'}`}>
                            {def.format(val)}
                          </span>
                          {isBest && (
                            <span className="ml-2 inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded text-[10px] font-bold bg-mono-100/10 dark:bg-white/10 text-mono-100 dark:text-white">
                              <Crown className="w-2.5 h-2.5" /> Meilleur
                            </span>
                          )}
                          {isWorst && (
                            <span className="ml-2 inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded text-[10px] font-bold bg-[#DC2626]/10 text-[#DC2626]">
                              <AlertTriangle className="w-2.5 h-2.5" /> A ameliorer
                            </span>
                          )}
                        </td>
                      );
                    })}
                    <td className="px-5 py-3.5 text-center">
                      {!allSame && (
                        <span className="text-xs text-[#6B7280] dark:text-mono-500">
                          Ecart: {def.format(Math.abs(bestVal - worstVal))}
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Bar charts */}
      {chartData.length > 0 && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          <div className="bg-white dark:bg-mono-50 border border-mono-900 dark:border-mono-200 rounded-2xl p-5">
            <h4 className="text-sm font-bold text-mono-100 dark:text-white font-satoshi mb-4">Marge vs Food Cost</h4>
            <ResponsiveContainer width="100%" height={240}>
              <BarChart data={chartData} barGap={4}>
                <CartesianGrid strokeDasharray="3 3" stroke="currentColor" className="text-mono-900 dark:text-mono-200" />
                <XAxis dataKey="name" tick={{ fill: '#6B7280', fontSize: 11 }} axisLine={{ stroke: '#E5E7EB' }} tickLine={false} />
                <YAxis tick={{ fill: '#6B7280', fontSize: 11 }} axisLine={{ stroke: '#E5E7EB' }} tickLine={false} domain={[0, 100]} tickFormatter={(v: number) => `${v}%`} />
                <Tooltip content={<ChartTooltip />} />
                <Bar dataKey="Marge %" radius={[4, 4, 0, 0]} maxBarSize={48}>
                  {chartData.map((_: any, index: number) => (
                    <Cell key={index} fill="#111111" className="dark:fill-white" />
                  ))}
                </Bar>
                <Bar dataKey="Food Cost %" radius={[4, 4, 0, 0]} maxBarSize={48} fill="#D4D4D4" className="dark:fill-mono-350" />
              </BarChart>
            </ResponsiveContainer>
            <div className="flex items-center justify-center gap-6 mt-2">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-sm bg-mono-100 dark:bg-white" />
                <span className="text-xs text-[#6B7280] dark:text-mono-500">Marge %</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-sm bg-mono-800 dark:bg-mono-350" />
                <span className="text-xs text-[#6B7280] dark:text-mono-500">Food Cost %</span>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-mono-50 border border-mono-900 dark:border-mono-200 rounded-2xl p-5">
            <h4 className="text-sm font-bold text-mono-100 dark:text-white font-satoshi mb-4">Chiffre d'affaires</h4>
            <ResponsiveContainer width="100%" height={240}>
              <BarChart data={chartData} barGap={4}>
                <CartesianGrid strokeDasharray="3 3" stroke="currentColor" className="text-mono-900 dark:text-mono-200" />
                <XAxis dataKey="name" tick={{ fill: '#6B7280', fontSize: 11 }} axisLine={{ stroke: '#E5E7EB' }} tickLine={false} />
                <YAxis tick={{ fill: '#6B7280', fontSize: 11 }} axisLine={{ stroke: '#E5E7EB' }} tickLine={false} tickFormatter={(v: number) => `${(v / 1000).toFixed(0)}k`} />
                <Tooltip content={<ChartTooltip />} />
                <Bar dataKey="CA" radius={[4, 4, 0, 0]} maxBarSize={48}>
                  {chartData.map((_: any, index: number) => (
                    <Cell key={index} fill="#111111" className="dark:fill-white" />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════
// 3. GROUP ANALYTICS
// ══════════════════════════════════════════════════════════════════════
function GroupAnalytics({
  overview,
  restaurants,
  onNavigate,
}: {
  overview: RestaurantOverview | null;
  restaurants: Restaurant[];
  onNavigate: (id: number) => void;
}) {
  if (!overview || overview.restaurants.length < 2) {
    return (
      <div className="bg-white dark:bg-mono-50 border border-mono-900 dark:border-mono-200 rounded-2xl p-12 text-center">
        <BarChart3 className="w-12 h-12 text-mono-800 dark:text-mono-350 mx-auto mb-4" />
        <h3 className="text-lg font-bold text-mono-100 dark:text-white mb-2">Analytiques Groupe</h3>
        <p className="text-sm text-[#6B7280] dark:text-mono-500">Ajoutez au moins 2 restaurants pour voir les analytiques groupe.</p>
      </div>
    );
  }

  const { totals } = overview;
  const sorted = [...overview.restaurants].sort((a, b) => b.marginPercent - a.marginPercent);
  const best = sorted[0];
  const worst = sorted[sorted.length - 1];

  // Simulated consolidated P&L
  const pnlData = [
    { label: 'Chiffre d\'affaires total', value: totals.totalRevenue, type: 'revenue' as const },
    { label: 'Cout matieres premieres', value: totals.totalFoodCost, type: 'cost' as const },
    { label: 'Marge brute', value: totals.totalMarginAmount, type: 'profit' as const },
    { label: 'Charges personnel (est.)', value: Math.round(totals.totalRevenue * 0.30), type: 'cost' as const },
    { label: 'Charges fixes (est.)', value: Math.round(totals.totalRevenue * 0.15), type: 'cost' as const },
    { label: 'Resultat net (est.)', value: Math.round(totals.totalMarginAmount - totals.totalRevenue * 0.45), type: 'profit' as const },
  ];

  return (
    <div className="space-y-6">
      {/* Big KPI cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-mono-50 border border-mono-900 dark:border-mono-200 rounded-2xl p-5">
          <div className="flex items-center gap-2 mb-3">
            <DollarSign className="w-5 h-5 text-mono-100 dark:text-white" />
            <span className="text-xs font-bold uppercase tracking-wider text-[#6B7280] dark:text-mono-500">CA Total Groupe</span>
          </div>
          <p className="text-2xl font-bold text-mono-100 dark:text-white font-satoshi">{formatCurrency(totals.totalRevenue)}</p>
          <p className="text-xs text-[#6B7280] dark:text-mono-500 mt-1">{overview.restaurants.length} restaurants</p>
        </div>
        <div className="bg-white dark:bg-mono-50 border border-mono-900 dark:border-mono-200 rounded-2xl p-5">
          <div className="flex items-center gap-2 mb-3">
            <TrendingUp className="w-5 h-5 text-mono-100 dark:text-white" />
            <span className="text-xs font-bold uppercase tracking-wider text-[#6B7280] dark:text-mono-500">Marge Moyenne</span>
          </div>
          <p className={`text-2xl font-bold font-satoshi ${totals.avgMarginPercent >= 65 ? 'text-mono-100 dark:text-white' : 'text-[#DC2626]'}`}>
            {formatPercent(totals.avgMarginPercent)}
          </p>
          <p className="text-xs text-[#6B7280] dark:text-mono-500 mt-1">Objectif: 65%+</p>
        </div>
        <div className="bg-white dark:bg-mono-50 border border-mono-900 dark:border-mono-200 rounded-2xl p-5">
          <div className="flex items-center gap-2 mb-3">
            <ClipboardList className="w-5 h-5 text-mono-100 dark:text-white" />
            <span className="text-xs font-bold uppercase tracking-wider text-[#6B7280] dark:text-mono-500">Recettes Total</span>
          </div>
          <p className="text-2xl font-bold text-mono-100 dark:text-white font-satoshi">{totals.totalRecipes}</p>
        </div>
        <div className="bg-white dark:bg-mono-50 border border-mono-900 dark:border-mono-200 rounded-2xl p-5">
          <div className="flex items-center gap-2 mb-3">
            <Package className="w-5 h-5 text-mono-100 dark:text-white" />
            <span className="text-xs font-bold uppercase tracking-wider text-[#6B7280] dark:text-mono-500">Ingredients Total</span>
          </div>
          <p className="text-2xl font-bold text-mono-100 dark:text-white font-satoshi">{totals.totalIngredients}</p>
        </div>
      </div>

      {/* Best & Worst performers */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Best */}
        <div
          className="bg-white dark:bg-mono-50 border border-mono-900 dark:border-mono-200 rounded-2xl p-5 cursor-pointer hover:border-mono-100 dark:hover:border-white transition-all"
          onClick={() => onNavigate(best.id)}
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2.5 rounded-xl bg-mono-100/5 dark:bg-white/5">
              <Crown className="w-5 h-5 text-mono-100 dark:text-white" />
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-mono-100 dark:text-white">Meilleure performance du mois</p>
              <p className="text-sm text-[#6B7280] dark:text-mono-500">Basee sur la marge</p>
            </div>
          </div>
          <h4 className="text-xl font-bold text-mono-100 dark:text-white mb-2">{best.name}</h4>
          <div className="flex items-center gap-4">
            <div>
              <span className="text-2xl font-bold text-mono-100 dark:text-white">{formatPercent(best.marginPercent)}</span>
              <span className="text-xs text-[#6B7280] dark:text-mono-500 ml-1">marge</span>
            </div>
            <div className="w-px h-8 bg-mono-900 dark:bg-mono-200" />
            <div>
              <span className="text-lg font-bold text-mono-100 dark:text-white">{formatCurrency(best.revenue)}</span>
              <span className="text-xs text-[#6B7280] dark:text-mono-500 ml-1">CA</span>
            </div>
          </div>
        </div>

        {/* Worst */}
        {worst.id !== best.id && (
          <div
            className="bg-white dark:bg-mono-50 border border-mono-900 dark:border-mono-200 rounded-2xl p-5 cursor-pointer hover:border-[#DC2626] transition-all"
            onClick={() => onNavigate(worst.id)}
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2.5 rounded-xl bg-[#DC2626]/5">
                <ShieldAlert className="w-5 h-5 text-[#DC2626]" />
              </div>
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-[#DC2626]">A ameliorer</p>
                <p className="text-sm text-[#6B7280] dark:text-mono-500">Necessite attention</p>
              </div>
            </div>
            <h4 className="text-xl font-bold text-mono-100 dark:text-white mb-2">{worst.name}</h4>
            <div className="flex items-center gap-4">
              <div>
                <span className="text-2xl font-bold text-[#DC2626]">{formatPercent(worst.marginPercent)}</span>
                <span className="text-xs text-[#6B7280] dark:text-mono-500 ml-1">marge</span>
              </div>
              <div className="w-px h-8 bg-mono-900 dark:bg-mono-200" />
              <div>
                <span className="text-lg font-bold text-mono-100 dark:text-white">{formatCurrency(worst.revenue)}</span>
                <span className="text-xs text-[#6B7280] dark:text-mono-500 ml-1">CA</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Consolidated P&L */}
      <div className="bg-white dark:bg-mono-50 border border-mono-900 dark:border-mono-200 rounded-2xl overflow-hidden">
        <div className="px-5 py-4 border-b border-mono-900 dark:border-mono-200 flex items-center gap-2">
          <Briefcase className="w-4 h-4 text-mono-100 dark:text-white" />
          <h4 className="text-sm font-bold text-mono-100 dark:text-white font-satoshi">Compte de resultat consolide (estimatif)</h4>
        </div>
        <div className="divide-y divide-mono-900 dark:divide-mono-200">
          {pnlData.map((row, i) => (
            <div key={i} className={`flex items-center justify-between px-5 py-3.5 ${row.type === 'profit' ? 'bg-mono-1000 dark:bg-mono-100' : ''}`}>
              <span className={`text-sm ${row.type === 'profit' ? 'font-bold text-mono-100 dark:text-white' : 'text-[#6B7280] dark:text-mono-500'}`}>
                {row.label}
              </span>
              <span className={`text-sm font-bold ${
                row.type === 'revenue' ? 'text-mono-100 dark:text-white'
                : row.type === 'cost' ? 'text-[#DC2626]'
                : row.value >= 0 ? 'text-mono-100 dark:text-white' : 'text-[#DC2626]'
              }`}>
                {row.type === 'cost' ? '- ' : ''}{formatCurrency(Math.abs(row.value))}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Per-restaurant ranking table */}
      <div className="bg-white dark:bg-mono-50 border border-mono-900 dark:border-mono-200 rounded-2xl overflow-hidden">
        <div className="px-5 py-4 border-b border-mono-900 dark:border-mono-200">
          <h4 className="text-sm font-bold text-mono-100 dark:text-white font-satoshi">Classement des restaurants</h4>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-mono-900 dark:border-mono-200">
                <th className="text-left px-5 py-3 text-xs font-bold uppercase tracking-wider text-[#6B7280] dark:text-mono-500">#</th>
                <th className="text-left px-5 py-3 text-xs font-bold uppercase tracking-wider text-[#6B7280] dark:text-mono-500">Restaurant</th>
                <th className="text-right px-5 py-3 text-xs font-bold uppercase tracking-wider text-[#6B7280] dark:text-mono-500">CA</th>
                <th className="text-right px-5 py-3 text-xs font-bold uppercase tracking-wider text-[#6B7280] dark:text-mono-500">Food Cost %</th>
                <th className="text-right px-5 py-3 text-xs font-bold uppercase tracking-wider text-[#6B7280] dark:text-mono-500">Marge %</th>
                <th className="text-right px-5 py-3 text-xs font-bold uppercase tracking-wider text-[#6B7280] dark:text-mono-500">Recettes</th>
              </tr>
            </thead>
            <tbody>
              {sorted.map((r, i) => (
                <tr
                  key={r.id}
                  className="border-b border-mono-900 dark:border-mono-200 last:border-0 hover:bg-mono-1000 dark:hover:bg-[#171717] transition-colors cursor-pointer"
                  onClick={() => onNavigate(r.id)}
                >
                  <td className="px-5 py-3">
                    <span className={`inline-flex items-center justify-center w-6 h-6 rounded-full text-xs font-bold ${
                      i === 0 ? 'bg-mono-100 dark:bg-white text-white dark:text-mono-100' : 'bg-mono-950 dark:bg-[#171717] text-[#6B7280] dark:text-mono-500'
                    }`}>
                      {i + 1}
                    </span>
                  </td>
                  <td className="px-5 py-3 font-medium text-mono-100 dark:text-white">{r.name}</td>
                  <td className="px-5 py-3 text-right font-medium text-mono-100 dark:text-white">{formatCurrency(r.revenue)}</td>
                  <td className="px-5 py-3 text-right">
                    <span className={`font-medium ${r.foodCostPercent <= 30 ? 'text-mono-100 dark:text-white' : 'text-[#DC2626]'}`}>
                      {formatPercent(r.foodCostPercent)}
                    </span>
                  </td>
                  <td className="px-5 py-3 text-right">
                    <span className={`inline-flex items-center gap-1 font-bold ${r.marginPercent >= 65 ? 'text-mono-100 dark:text-white' : 'text-[#DC2626]'}`}>
                      {r.marginPercent >= 65 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                      {formatPercent(r.marginPercent)}
                    </span>
                  </td>
                  <td className="px-5 py-3 text-right text-[#6B7280] dark:text-mono-500">{r.recipeCount}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════
// 4. TEMPLATE SHARING
// ══════════════════════════════════════════════════════════════════════
function TemplateSharing({ restaurants }: { restaurants: Restaurant[] }) {
  const [sourceId, setSourceId] = useState<number | null>(null);
  const [targetIds, setTargetIds] = useState<Set<number>>(new Set());
  const [shareMode, setShareMode] = useState<'single' | 'bulk'>('single');
  const [searchTerm, setSearchTerm] = useState('');
  const { showToast } = useToast();

  // Simulated recipes for demo
  const demoRecipes = useMemo(() => {
    if (!sourceId) return [];
    const source = restaurants.find((r) => r.id === sourceId);
    if (!source) return [];
    const categories = ['Entrees', 'Plats', 'Desserts', 'Boissons'];
    return categories.flatMap((cat, ci) =>
      Array.from({ length: 3 + (sourceId * (ci + 1)) % 4 }, (_, i) => ({
        id: ci * 100 + i + 1,
        name: `${cat.slice(0, -1)} ${String.fromCharCode(65 + i)}`,
        category: cat,
        foodCost: 15 + ((sourceId + ci + i) % 20),
        margin: 80 - ((sourceId + ci + i) % 20),
      }))
    );
  }, [sourceId, restaurants]);

  const [selectedRecipes, setSelectedRecipes] = useState<Set<number>>(new Set());

  const filteredRecipes = useMemo(() => {
    if (!searchTerm) return demoRecipes;
    const lower = searchTerm.toLowerCase();
    return demoRecipes.filter((r) => r.name.toLowerCase().includes(lower) || r.category.toLowerCase().includes(lower));
  }, [demoRecipes, searchTerm]);

  const categories = useMemo(() => [...new Set(demoRecipes.map((r) => r.category))], [demoRecipes]);

  function toggleRecipe(id: number) {
    setSelectedRecipes((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function selectCategory(cat: string) {
    const ids = demoRecipes.filter((r) => r.category === cat).map((r) => r.id);
    setSelectedRecipes((prev) => {
      const next = new Set(prev);
      const allSelected = ids.every((id) => next.has(id));
      ids.forEach((id) => allSelected ? next.delete(id) : next.add(id));
      return next;
    });
  }

  function toggleTarget(id: number) {
    setTargetIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function handleShare() {
    if (targetIds.size === 0) {
      showToast('Selectionnez au moins un restaurant cible', 'error');
      return;
    }
    if (selectedRecipes.size === 0) {
      showToast('Selectionnez au moins une recette a partager', 'error');
      return;
    }
    const count = selectedRecipes.size;
    const targets = targetIds.size;
    showToast(`${count} recette(s) partagee(s) avec ${targets} restaurant(s)`, 'success');
    setSelectedRecipes(new Set());
  }

  if (restaurants.length < 2) {
    return (
      <div className="bg-white dark:bg-mono-50 border border-mono-900 dark:border-mono-200 rounded-2xl p-12 text-center">
        <Share2 className="w-12 h-12 text-mono-800 dark:text-mono-350 mx-auto mb-4" />
        <h3 className="text-lg font-bold text-mono-100 dark:text-white mb-2">Partage de recettes</h3>
        <p className="text-sm text-[#6B7280] dark:text-mono-500">Ajoutez au moins 2 restaurants pour partager des recettes entre eux.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Source selection */}
      <div className="bg-white dark:bg-mono-50 border border-mono-900 dark:border-mono-200 rounded-2xl p-5">
        <h4 className="text-sm font-bold text-mono-100 dark:text-white font-satoshi mb-4 flex items-center gap-2">
          <Share2 className="w-4 h-4" /> Partager des recettes
        </h4>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#6B7280] dark:text-mono-500 mb-2">Restaurant source</label>
            <select
              value={sourceId ?? ''}
              onChange={(e) => { setSourceId(Number(e.target.value) || null); setSelectedRecipes(new Set()); }}
              className="w-full px-3 py-2.5 rounded-xl border border-mono-900 dark:border-mono-200 bg-white dark:bg-[#171717] text-mono-100 dark:text-white text-sm focus:ring-2 focus:ring-mono-100 dark:focus:ring-white outline-none"
            >
              <option value="">Choisir...</option>
              {restaurants.map((r) => <option key={r.id} value={r.id}>{r.name}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#6B7280] dark:text-mono-500 mb-2">Restaurants cibles</label>
            <div className="flex flex-wrap gap-2">
              {restaurants.filter((r) => r.id !== sourceId).map((r) => (
                <button
                  key={r.id}
                  onClick={() => toggleTarget(r.id)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium border-2 transition-all ${
                    targetIds.has(r.id)
                      ? 'border-mono-100 dark:border-white bg-mono-100 dark:bg-white text-white dark:text-mono-100'
                      : 'border-mono-900 dark:border-mono-200 text-[#6B7280] dark:text-mono-500 hover:border-mono-100 dark:hover:border-white'
                  }`}
                >
                  {r.name}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Mode toggle */}
        <div className="flex items-center gap-2 mb-4">
          <button
            onClick={() => setShareMode('single')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              shareMode === 'single' ? 'bg-mono-100 dark:bg-white text-white dark:text-mono-100' : 'bg-mono-950 dark:bg-[#171717] text-[#6B7280] dark:text-mono-500'
            }`}
          >
            Selection individuelle
          </button>
          <button
            onClick={() => setShareMode('bulk')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              shareMode === 'bulk' ? 'bg-mono-100 dark:bg-white text-white dark:text-mono-100' : 'bg-mono-950 dark:bg-[#171717] text-[#6B7280] dark:text-mono-500'
            }`}
          >
            Par categorie
          </button>
        </div>
      </div>

      {/* Recipe list */}
      {sourceId && (
        <div className="bg-white dark:bg-mono-50 border border-mono-900 dark:border-mono-200 rounded-2xl overflow-hidden">
          <div className="px-5 py-4 border-b border-mono-900 dark:border-mono-200 flex items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <ClipboardList className="w-4 h-4 text-mono-100 dark:text-white" />
              <h4 className="text-sm font-bold text-mono-100 dark:text-white font-satoshi">
                Recettes ({selectedRecipes.size}/{demoRecipes.length} selectionnees)
              </h4>
            </div>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9CA3AF]" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Rechercher..."
                className="pl-9 pr-3 py-2 rounded-lg border border-mono-900 dark:border-mono-200 bg-mono-1000 dark:bg-[#171717] text-sm text-mono-100 dark:text-white w-48 outline-none focus:ring-2 focus:ring-mono-100 dark:focus:ring-white"
              />
            </div>
          </div>

          {shareMode === 'bulk' && (
            <div className="px-5 py-3 border-b border-mono-900 dark:border-mono-200 flex items-center gap-2 flex-wrap">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => selectCategory(cat)}
                  className="px-3 py-1.5 rounded-lg text-xs font-medium border border-mono-900 dark:border-mono-200 hover:bg-mono-950 dark:hover:bg-[#171717] text-[#6B7280] dark:text-mono-500 hover:text-mono-100 dark:hover:text-white transition-all flex items-center gap-1.5"
                >
                  <Layers className="w-3 h-3" />
                  {cat}
                </button>
              ))}
            </div>
          )}

          <div className="max-h-80 overflow-y-auto divide-y divide-mono-900 dark:divide-mono-200">
            {filteredRecipes.map((recipe) => (
              <label
                key={recipe.id}
                className="flex items-center gap-3 px-5 py-3 hover:bg-mono-1000 dark:hover:bg-[#171717] transition-colors cursor-pointer"
              >
                <input
                  type="checkbox"
                  checked={selectedRecipes.has(recipe.id)}
                  onChange={() => toggleRecipe(recipe.id)}
                  className="w-4 h-4 rounded border-mono-800 dark:border-mono-350 text-mono-100 dark:text-white focus:ring-mono-100 dark:focus:ring-white"
                />
                <div className="flex-1 min-w-0">
                  <span className="text-sm font-medium text-mono-100 dark:text-white">{recipe.name}</span>
                  <span className="ml-2 text-[10px] px-2 py-0.5 rounded-full bg-mono-950 dark:bg-[#171717] text-[#6B7280] dark:text-mono-700">
                    {recipe.category}
                  </span>
                </div>
                <span className="text-xs text-[#6B7280] dark:text-mono-500">FC: {recipe.foodCost}%</span>
              </label>
            ))}
          </div>

          {/* Share button */}
          <div className="px-5 py-4 border-t border-mono-900 dark:border-mono-200 flex items-center justify-between">
            <span className="text-xs text-[#6B7280] dark:text-mono-500">
              {selectedRecipes.size} recette(s) vers {targetIds.size} restaurant(s)
            </span>
            <button
              onClick={handleShare}
              disabled={selectedRecipes.size === 0 || targetIds.size === 0}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-mono-100 dark:bg-white hover:bg-[#333333] dark:hover:bg-[#E5E5E5] disabled:opacity-40 text-white dark:text-mono-100 text-sm font-medium transition-colors"
            >
              <Send className="w-4 h-4" />
              Partager
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════
// 5. CENTRALIZED ORDERING
// ══════════════════════════════════════════════════════════════════════
function CentralizedOrdering({ restaurants }: { restaurants: Restaurant[] }) {
  const { showToast } = useToast();

  // Simulated aggregated ingredient needs
  const ingredientNeeds = useMemo(() => {
    const items = [
      { name: 'Farine T55', unit: 'kg', restaurants: restaurants.map((r) => ({ id: r.id, name: r.name, qty: 10 + (r.id * 3) % 20 })) },
      { name: 'Beurre AOP', unit: 'kg', restaurants: restaurants.map((r) => ({ id: r.id, name: r.name, qty: 5 + (r.id * 7) % 15 })) },
      { name: 'Huile d\'olive', unit: 'L', restaurants: restaurants.map((r) => ({ id: r.id, name: r.name, qty: 8 + (r.id * 5) % 12 })) },
      { name: 'Poulet Label Rouge', unit: 'kg', restaurants: restaurants.map((r) => ({ id: r.id, name: r.name, qty: 15 + (r.id * 9) % 25 })) },
      { name: 'Tomates fraishes', unit: 'kg', restaurants: restaurants.map((r) => ({ id: r.id, name: r.name, qty: 12 + (r.id * 4) % 18 })) },
      { name: 'Creme fraiche', unit: 'L', restaurants: restaurants.map((r) => ({ id: r.id, name: r.name, qty: 6 + (r.id * 2) % 10 })) },
      { name: 'Oeufs bio', unit: 'dz', restaurants: restaurants.map((r) => ({ id: r.id, name: r.name, qty: 20 + (r.id * 6) % 30 })) },
      { name: 'Saumon frais', unit: 'kg', restaurants: restaurants.map((r) => ({ id: r.id, name: r.name, qty: 8 + (r.id * 3) % 12 })) },
    ];
    return items.map((item) => ({
      ...item,
      totalQty: item.restaurants.reduce((sum, r) => sum + r.qty, 0),
      unitPrice: Math.round(3 + Math.random() * 15),
    }));
  }, [restaurants]);

  const totalVolume = ingredientNeeds.reduce((sum, i) => sum + i.totalQty * i.unitPrice, 0);
  const discountRate = totalVolume > 5000 ? 8 : totalVolume > 2000 ? 5 : 2;
  const savings = Math.round(totalVolume * discountRate / 100);

  if (restaurants.length < 2) {
    return (
      <div className="bg-white dark:bg-mono-50 border border-mono-900 dark:border-mono-200 rounded-2xl p-12 text-center">
        <ShoppingCart className="w-12 h-12 text-mono-800 dark:text-mono-350 mx-auto mb-4" />
        <h3 className="text-lg font-bold text-mono-100 dark:text-white mb-2">Commandes centralisees</h3>
        <p className="text-sm text-[#6B7280] dark:text-mono-500">Ajoutez au moins 2 restaurants pour regrouper les commandes.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Volume discount banner */}
      <div className="bg-mono-100 dark:bg-white rounded-2xl p-5 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="p-3 rounded-xl bg-white/10 dark:bg-mono-100/10">
            <Calculator className="w-6 h-6 text-white dark:text-mono-100" />
          </div>
          <div>
            <p className="text-sm font-bold text-white dark:text-mono-100">Remise volume estimee: -{discountRate}%</p>
            <p className="text-xs text-white/60 dark:text-mono-100/60">
              Volume total: {formatCurrency(totalVolume)} — Economie: {formatCurrency(savings)}/commande
            </p>
          </div>
        </div>
        <button
          onClick={() => showToast('Commande groupee envoyee aux fournisseurs!', 'success')}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white dark:bg-mono-100 text-mono-100 dark:text-white text-sm font-bold hover:opacity-90 transition-opacity"
        >
          <ShoppingCart className="w-4 h-4" />
          Commander pour tous
        </button>
      </div>

      {/* Aggregated needs table */}
      <div className="bg-white dark:bg-mono-50 border border-mono-900 dark:border-mono-200 rounded-2xl overflow-hidden">
        <div className="px-5 py-4 border-b border-mono-900 dark:border-mono-200 flex items-center gap-2">
          <Package className="w-4 h-4 text-mono-100 dark:text-white" />
          <h4 className="text-sm font-bold text-mono-100 dark:text-white font-satoshi">Besoins agreges en ingredients</h4>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-mono-900 dark:border-mono-200">
                <th className="text-left px-5 py-3 text-xs font-bold uppercase tracking-wider text-[#6B7280] dark:text-mono-500">Ingredient</th>
                {restaurants.map((r) => (
                  <th key={r.id} className="text-center px-4 py-3 text-xs font-bold uppercase tracking-wider text-[#6B7280] dark:text-mono-500">
                    {r.name.length > 10 ? r.name.slice(0, 10) + '...' : r.name}
                  </th>
                ))}
                <th className="text-center px-4 py-3 text-xs font-bold uppercase tracking-wider text-mono-100 dark:text-white bg-mono-1000 dark:bg-mono-100">Total</th>
                <th className="text-center px-4 py-3 text-xs font-bold uppercase tracking-wider text-[#6B7280] dark:text-mono-500">Prix unit.</th>
                <th className="text-right px-5 py-3 text-xs font-bold uppercase tracking-wider text-[#6B7280] dark:text-mono-500">Montant</th>
              </tr>
            </thead>
            <tbody>
              {ingredientNeeds.map((item, i) => (
                <tr key={i} className="border-b border-mono-900 dark:border-mono-200 last:border-0 hover:bg-mono-1000 dark:hover:bg-[#171717] transition-colors">
                  <td className="px-5 py-3 font-medium text-mono-100 dark:text-white">
                    {item.name}
                    <span className="ml-1 text-[10px] text-[#9CA3AF] dark:text-mono-500">({item.unit})</span>
                  </td>
                  {item.restaurants.map((r) => (
                    <td key={r.id} className="px-4 py-3 text-center text-[#6B7280] dark:text-mono-500">{r.qty}</td>
                  ))}
                  <td className="px-4 py-3 text-center font-bold text-mono-100 dark:text-white bg-mono-1000 dark:bg-mono-100">
                    {item.totalQty} {item.unit}
                  </td>
                  <td className="px-4 py-3 text-center text-[#6B7280] dark:text-mono-500">{formatCurrency(item.unitPrice)}/{item.unit}</td>
                  <td className="px-5 py-3 text-right font-medium text-mono-100 dark:text-white">{formatCurrency(item.totalQty * item.unitPrice)}</td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr className="bg-mono-1000 dark:bg-mono-100">
                <td colSpan={restaurants.length + 1} className="px-5 py-3 text-right font-bold text-mono-100 dark:text-white">Total commande</td>
                <td className="px-4 py-3" />
                <td className="px-5 py-3 text-right text-lg font-bold text-mono-100 dark:text-white">{formatCurrency(totalVolume)}</td>
              </tr>
              <tr className="bg-mono-100/5 dark:bg-white/5">
                <td colSpan={restaurants.length + 1} className="px-5 py-3 text-right font-bold text-mono-100 dark:text-white">
                  Apres remise volume (-{discountRate}%)
                </td>
                <td className="px-4 py-3" />
                <td className="px-5 py-3 text-right text-lg font-bold text-mono-100 dark:text-white">{formatCurrency(totalVolume - savings)}</td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════
// 6. STAFF ALLOCATION
// ══════════════════════════════════════════════════════════════════════
function StaffAllocation({ restaurants }: { restaurants: Restaurant[] }) {
  const { showToast } = useToast();
  const [transferFrom, setTransferFrom] = useState<number | null>(null);
  const [transferTo, setTransferTo] = useState<number | null>(null);
  const [transferPerson, setTransferPerson] = useState('');

  // Simulated staff data
  const staffData = useMemo(() => {
    const roles = ['Chef', 'Sous-chef', 'Commis', 'Serveur', 'Plongeur', 'Manager', 'Patissier', 'Barman'];
    return restaurants.map((r) => ({
      id: r.id,
      name: r.name,
      staff: Array.from({ length: 3 + (r.id * 3) % 6 }, (_, i) => ({
        id: r.id * 100 + i,
        name: `${['Jean', 'Marie', 'Hugo', 'Fatima', 'Pierre', 'Sophie', 'Karim', 'Lucie'][i % 8]} ${String.fromCharCode(65 + (r.id + i) % 26)}.`,
        role: roles[(r.id + i) % roles.length],
        isWorking: Math.random() > 0.3,
        hours: `${8 + (i % 4)}h - ${16 + (i % 4)}h`,
      })),
    }));
  }, [restaurants]);

  const totalStaff = staffData.reduce((sum, s) => sum + s.staff.length, 0);
  const workingNow = staffData.reduce((sum, s) => sum + s.staff.filter((p) => p.isWorking).length, 0);

  function handleTransfer() {
    if (!transferFrom || !transferTo || !transferPerson) {
      showToast('Remplissez tous les champs de transfert', 'error');
      return;
    }
    const from = restaurants.find((r) => r.id === transferFrom)?.name;
    const to = restaurants.find((r) => r.id === transferTo)?.name;
    showToast(`${transferPerson} transfere de ${from} vers ${to}`, 'success');
    setTransferPerson('');
  }

  if (restaurants.length < 2) {
    return (
      <div className="bg-white dark:bg-mono-50 border border-mono-900 dark:border-mono-200 rounded-2xl p-12 text-center">
        <Users className="w-12 h-12 text-mono-800 dark:text-mono-350 mx-auto mb-4" />
        <h3 className="text-lg font-bold text-mono-100 dark:text-white mb-2">Gestion du personnel</h3>
        <p className="text-sm text-[#6B7280] dark:text-mono-500">Ajoutez au moins 2 restaurants pour gerer le personnel entre sites.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Summary KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        <div className="bg-white dark:bg-mono-50 border border-mono-900 dark:border-mono-200 rounded-2xl p-5">
          <div className="text-xs font-bold uppercase tracking-wider text-[#6B7280] dark:text-mono-500 mb-2">Total employes</div>
          <div className="text-2xl font-bold text-mono-100 dark:text-white font-satoshi">{totalStaff}</div>
        </div>
        <div className="bg-white dark:bg-mono-50 border border-mono-900 dark:border-mono-200 rounded-2xl p-5">
          <div className="text-xs font-bold uppercase tracking-wider text-[#6B7280] dark:text-mono-500 mb-2">En poste maintenant</div>
          <div className="text-2xl font-bold text-mono-100 dark:text-white font-satoshi flex items-center gap-2">
            {workingNow}
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#22C55E] opacity-75" />
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#22C55E]" />
            </span>
          </div>
        </div>
        <div className="bg-white dark:bg-mono-50 border border-mono-900 dark:border-mono-200 rounded-2xl p-5">
          <div className="text-xs font-bold uppercase tracking-wider text-[#6B7280] dark:text-mono-500 mb-2">Sites</div>
          <div className="text-2xl font-bold text-mono-100 dark:text-white font-satoshi">{restaurants.length}</div>
        </div>
      </div>

      {/* Transfer widget */}
      <div className="bg-white dark:bg-mono-50 border border-mono-900 dark:border-mono-200 rounded-2xl p-5">
        <h4 className="text-sm font-bold text-mono-100 dark:text-white font-satoshi mb-4 flex items-center gap-2">
          <ArrowLeftRight className="w-4 h-4" /> Transfert de personnel
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3 items-end">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#6B7280] dark:text-mono-500 mb-1.5">De</label>
            <select
              value={transferFrom ?? ''}
              onChange={(e) => setTransferFrom(Number(e.target.value) || null)}
              className="w-full px-3 py-2.5 rounded-xl border border-mono-900 dark:border-mono-200 bg-white dark:bg-[#171717] text-sm text-mono-100 dark:text-white outline-none"
            >
              <option value="">Restaurant...</option>
              {restaurants.map((r) => <option key={r.id} value={r.id}>{r.name}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#6B7280] dark:text-mono-500 mb-1.5">Employe</label>
            <select
              value={transferPerson}
              onChange={(e) => setTransferPerson(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl border border-mono-900 dark:border-mono-200 bg-white dark:bg-[#171717] text-sm text-mono-100 dark:text-white outline-none"
            >
              <option value="">Choisir...</option>
              {transferFrom && staffData.find((s) => s.id === transferFrom)?.staff.map((p) => (
                <option key={p.id} value={p.name}>{p.name} ({p.role})</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#6B7280] dark:text-mono-500 mb-1.5">Vers</label>
            <select
              value={transferTo ?? ''}
              onChange={(e) => setTransferTo(Number(e.target.value) || null)}
              className="w-full px-3 py-2.5 rounded-xl border border-mono-900 dark:border-mono-200 bg-white dark:bg-[#171717] text-sm text-mono-100 dark:text-white outline-none"
            >
              <option value="">Restaurant...</option>
              {restaurants.filter((r) => r.id !== transferFrom).map((r) => <option key={r.id} value={r.id}>{r.name}</option>)}
            </select>
          </div>
          <button
            onClick={handleTransfer}
            disabled={!transferFrom || !transferTo || !transferPerson}
            className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-mono-100 dark:bg-white hover:bg-[#333333] dark:hover:bg-[#E5E5E5] disabled:opacity-40 text-white dark:text-mono-100 text-sm font-medium transition-colors"
          >
            <ArrowLeftRight className="w-4 h-4" />
            Transferer
          </button>
        </div>
      </div>

      {/* Staff per restaurant */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {staffData.map((site) => (
          <div key={site.id} className="bg-white dark:bg-mono-50 border border-mono-900 dark:border-mono-200 rounded-2xl overflow-hidden">
            <div className="px-5 py-4 border-b border-mono-900 dark:border-mono-200 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Building2 className="w-4 h-4 text-mono-100 dark:text-white" />
                <h4 className="text-sm font-bold text-mono-100 dark:text-white font-satoshi">{site.name}</h4>
              </div>
              <span className="text-xs font-medium text-[#6B7280] dark:text-mono-500">
                {site.staff.filter((p) => p.isWorking).length}/{site.staff.length} en poste
              </span>
            </div>
            <div className="divide-y divide-mono-900 dark:divide-mono-200">
              {site.staff.map((person) => (
                <div key={person.id} className="flex items-center gap-3 px-5 py-3">
                  <div className={`w-2 h-2 rounded-full flex-shrink-0 ${person.isWorking ? 'bg-[#22C55E]' : 'bg-mono-800 dark:bg-mono-350'}`} />
                  <div className="flex-1 min-w-0">
                    <span className="text-sm font-medium text-mono-100 dark:text-white">{person.name}</span>
                    <span className="ml-2 text-[10px] px-2 py-0.5 rounded-full bg-mono-950 dark:bg-[#171717] text-[#6B7280] dark:text-mono-700">
                      {person.role}
                    </span>
                  </div>
                  <span className="text-xs text-[#6B7280] dark:text-mono-500">{person.hours}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════
// MAIN PAGE
// ══════════════════════════════════════════════════════════════════════
export default function Restaurants() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { restaurants, selectedRestaurant, loading, switchRestaurant, addRestaurant, updateRestaurant, removeRestaurant } = useRestaurant();
  const { showToast } = useToast();
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState<RestaurantFormData>(EMPTY_FORM);
  const [submitting, setSubmitting] = useState(false);

  // Active tab
  const [activeTab, setActiveTab] = useState<TabId>('dashboard');

  // Overview data
  const [overview, setOverview] = useState<RestaurantOverview | null>(null);
  const [overviewLoading, setOverviewLoading] = useState(false);

  // Compare mode
  const [compareSet, setCompareSet] = useState<Set<number>>(new Set());

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

  function handleViewRestaurant(id: number) {
    switchRestaurant(id);
    navigate('/');
  }

  function toggleCompare(id: number) {
    setCompareSet((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        if (next.size >= 4) {
          showToast('Maximum 4 restaurants pour la comparaison', 'error');
          return prev;
        }
        next.add(id);
      }
      return next;
    });
  }

  function removeFromCompare(id: number) {
    setCompareSet((prev) => {
      const next = new Set(prev);
      next.delete(id);
      return next;
    });
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
      openingHour: (r as any).openingHour || '11:00',
      closingHour: (r as any).closingHour || '23:00',
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
        showToast('Restaurant mis a jour', 'success');
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
        <div className="text-[#9CA3AF] dark:text-mono-500">Chargement...</div>
      </div>
    );
  }

  const tabs: { id: TabId; icon: any; label: string; count?: number }[] = [
    { id: 'dashboard', icon: Building2, label: 'Dashboard', count: restaurants.length },
    { id: 'compare', icon: GitCompare, label: 'Comparer', count: compareSet.size },
    { id: 'analytics', icon: BarChart3, label: 'Analytiques Groupe' },
    { id: 'templates', icon: Share2, label: 'Partager Recettes' },
    { id: 'ordering', icon: ShoppingCart, label: 'Commandes Groupe' },
    { id: 'staff', icon: Users, label: 'Personnel' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h2 className="text-2xl font-bold text-mono-100 dark:text-white font-satoshi">Hub Multi-Restaurants</h2>
            <span className="px-2.5 py-1 rounded-full bg-mono-100 dark:bg-white text-white dark:text-mono-100 text-[10px] font-bold uppercase tracking-wider">
              Business
            </span>
          </div>
          <p className="text-sm text-[#6B7280] dark:text-mono-500 mt-1">
            {hasMultiple
              ? `${restaurants.length} etablissements — Gerez, comparez et optimisez votre portefeuille`
              : 'Gerez vos etablissements et basculez entre eux'}
          </p>
        </div>
        <button
          onClick={openAdd}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-mono-100 dark:bg-white hover:bg-[#333333] dark:hover:bg-[#E5E5E5] text-white dark:text-mono-100 text-sm font-bold transition-colors shadow-sm"
        >
          <Plus className="w-4 h-4" />
          Ajouter un restaurant
        </button>
      </div>

      {/* Tabs */}
      {hasMultiple && (
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 -mx-1 px-1">
          {tabs.map((tab) => (
            <TabButton
              key={tab.id}
              active={activeTab === tab.id}
              icon={tab.icon}
              label={tab.label}
              count={tab.count}
              onClick={() => setActiveTab(tab.id)}
            />
          ))}
        </div>
      )}

      {/* Compare mode floating bar */}
      {compareSet.size >= 2 && activeTab === 'dashboard' && (
        <div className="bg-mono-100 dark:bg-white rounded-2xl px-5 py-3 flex items-center justify-between shadow-lg">
          <div className="flex items-center gap-3">
            <GitCompare className="w-5 h-5 text-white dark:text-mono-100" />
            <span className="text-sm font-bold text-white dark:text-mono-100">{compareSet.size} restaurants selectionnes</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setCompareSet(new Set())}
              className="px-3 py-1.5 rounded-lg text-xs font-medium text-white/70 dark:text-mono-100/70 hover:text-white dark:hover:text-mono-100 transition-colors"
            >
              Tout deselectionner
            </button>
            <button
              onClick={() => setActiveTab('compare')}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white dark:bg-mono-100 text-mono-100 dark:text-white text-sm font-bold hover:opacity-90 transition-opacity"
            >
              <BarChart3 className="w-4 h-4" />
              Comparer maintenant
            </button>
          </div>
        </div>
      )}

      {/* Loading state */}
      {hasMultiple && overviewLoading && (
        <div className="bg-white dark:bg-mono-50 border border-mono-900 dark:border-mono-200 rounded-2xl p-12 flex items-center justify-center">
          <div className="text-sm text-[#9CA3AF] dark:text-mono-500">Chargement de l'apercu...</div>
        </div>
      )}

      {/* Tab content */}
      {!overviewLoading && (
        <>
          {activeTab === 'dashboard' && (
            <RestaurantCardsDashboard
              restaurants={restaurants}
              selectedRestaurant={selectedRestaurant}
              overview={overview}
              compareSet={compareSet}
              onToggleCompare={toggleCompare}
              onSwitch={switchRestaurant}
              onEdit={openEdit}
              onDelete={handleDelete}
              onView={handleViewRestaurant}
            />
          )}

          {activeTab === 'compare' && (
            <ComparisonMode
              restaurants={restaurants}
              compareIds={[...compareSet]}
              overview={overview}
              onRemove={removeFromCompare}
            />
          )}

          {activeTab === 'analytics' && (
            <GroupAnalytics
              overview={overview}
              restaurants={restaurants}
              onNavigate={handleNavigateRestaurant}
            />
          )}

          {activeTab === 'templates' && (
            <TemplateSharing restaurants={restaurants} />
          )}

          {activeTab === 'ordering' && (
            <CentralizedOrdering restaurants={restaurants} />
          )}

          {activeTab === 'staff' && (
            <StaffAllocation restaurants={restaurants} />
          )}
        </>
      )}

      {/* Single restaurant fallback (when only 1 restaurant) */}
      {!hasMultiple && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {restaurants.map((r) => {
            const kpis = getSimulatedKPIs(r);
            return (
              <div key={r.id} className="relative bg-white dark:bg-mono-50 rounded-2xl shadow-sm border-2 border-mono-100 dark:border-white ring-2 ring-mono-100/10 dark:ring-white/10">
                <div className="absolute -top-2.5 left-4">
                  <span className="flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-mono-100 dark:bg-white text-white dark:text-mono-100 text-xs font-bold">
                    <Check className="w-3 h-3" /> Actif
                  </span>
                </div>
                <div className="p-5">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2.5 rounded-xl bg-mono-100 dark:bg-white">
                        <Building2 className="w-5 h-5 text-white dark:text-mono-100" />
                      </div>
                      <div>
                        <h3 className="font-bold text-mono-100 dark:text-white">{r.name}</h3>
                        <div className="flex items-center gap-2 mt-1">
                          {r.cuisineType && (
                            <span className="text-[10px] px-2 py-0.5 rounded-full bg-mono-950 dark:bg-[#171717] text-[#6B7280] dark:text-mono-700 font-medium uppercase tracking-wider">
                              {r.cuisineType}
                            </span>
                          )}
                          <StatusBadge open={true} />
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      <button onClick={() => openEdit(r)} className="p-1.5 rounded-lg hover:bg-mono-950 dark:hover:bg-[#171717] text-[#9CA3AF] hover:text-mono-100 dark:hover:text-white transition-colors">
                        <Edit className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  {r.address && (
                    <div className="flex items-center gap-2 text-sm text-[#6B7280] dark:text-mono-500 mb-4">
                      <MapPin className="w-3.5 h-3.5 flex-shrink-0" />
                      <span>{r.address}</span>
                    </div>
                  )}
                  <div className="grid grid-cols-2 gap-3 mb-4">
                    <div className="bg-mono-1000 dark:bg-mono-100 rounded-xl p-3">
                      <div className="text-[10px] font-bold uppercase tracking-wider text-[#9CA3AF] dark:text-mono-500 mb-1">Recettes</div>
                      <div className="text-lg font-bold text-mono-100 dark:text-white font-satoshi">{r._count?.recipes ?? 0}</div>
                    </div>
                    <div className="bg-mono-1000 dark:bg-mono-100 rounded-xl p-3">
                      <div className="text-[10px] font-bold uppercase tracking-wider text-[#9CA3AF] dark:text-mono-500 mb-1">Ingredients</div>
                      <div className="text-lg font-bold text-mono-100 dark:text-white font-satoshi">{r._count?.ingredients ?? 0}</div>
                    </div>
                    <div className="bg-mono-1000 dark:bg-mono-100 rounded-xl p-3">
                      <div className="text-[10px] font-bold uppercase tracking-wider text-[#9CA3AF] dark:text-mono-500 mb-1">Fournisseurs</div>
                      <div className="text-lg font-bold text-mono-100 dark:text-white font-satoshi">{r._count?.suppliers ?? 0}</div>
                    </div>
                    <div className="bg-mono-1000 dark:bg-mono-100 rounded-xl p-3">
                      <div className="text-[10px] font-bold uppercase tracking-wider text-[#9CA3AF] dark:text-mono-500 mb-1">Couverts/jour</div>
                      <div className="text-lg font-bold text-mono-100 dark:text-white font-satoshi">{r.coversPerDay}</div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Add/Edit Modal */}
      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title={editingId ? 'Modifier le restaurant' : 'Ajouter un restaurant'}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-[#6B7280] dark:text-mono-500 mb-1.5">Nom du restaurant *</label>
            <div className="relative">
              <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9CA3AF] dark:text-mono-500" />
              <input
                type="text"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full pl-10 pr-3 py-2.5 rounded-xl border border-mono-900 dark:border-mono-200 bg-white dark:bg-[#171717] text-mono-100 dark:text-white focus:ring-2 focus:ring-mono-100 dark:focus:ring-white focus:border-mono-100 dark:focus:border-white outline-none"
                placeholder="Ex: Le Bistrot du Chef"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-[#6B7280] dark:text-mono-500 mb-1.5">Adresse</label>
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9CA3AF] dark:text-mono-500" />
              <input
                type="text"
                value={form.address}
                onChange={(e) => setForm({ ...form, address: e.target.value })}
                className="w-full pl-10 pr-3 py-2.5 rounded-xl border border-mono-900 dark:border-mono-200 bg-white dark:bg-[#171717] text-mono-100 dark:text-white focus:ring-2 focus:ring-mono-100 dark:focus:ring-white outline-none"
                placeholder="25 rue de la Paix, Paris"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-[#6B7280] dark:text-mono-500 mb-1.5">Type de cuisine</label>
              <div className="relative">
                <ChefHat className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9CA3AF] dark:text-mono-500" />
                <input
                  type="text"
                  value={form.cuisineType}
                  onChange={(e) => setForm({ ...form, cuisineType: e.target.value })}
                  className="w-full pl-10 pr-3 py-2.5 rounded-xl border border-mono-900 dark:border-mono-200 bg-white dark:bg-[#171717] text-mono-100 dark:text-white focus:ring-2 focus:ring-mono-100 dark:focus:ring-white outline-none"
                  placeholder="Cuisine francaise"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-[#6B7280] dark:text-mono-500 mb-1.5">Telephone</label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9CA3AF] dark:text-mono-500" />
                <input
                  type="tel"
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  className="w-full pl-10 pr-3 py-2.5 rounded-xl border border-mono-900 dark:border-mono-200 bg-white dark:bg-[#171717] text-mono-100 dark:text-white focus:ring-2 focus:ring-mono-100 dark:focus:ring-white outline-none"
                  placeholder="01 42 00 00 00"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-[#6B7280] dark:text-mono-500 mb-1.5">Couverts/jour</label>
              <div className="relative">
                <Users className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9CA3AF] dark:text-mono-500" />
                <input
                  type="number"
                  min={0}
                  value={form.coversPerDay || ''}
                  onChange={(e) => setForm({ ...form, coversPerDay: parseInt(e.target.value) || 0 })}
                  className="w-full pl-10 pr-3 py-2.5 rounded-xl border border-mono-900 dark:border-mono-200 bg-white dark:bg-[#171717] text-mono-100 dark:text-white focus:ring-2 focus:ring-mono-100 dark:focus:ring-white outline-none"
                  placeholder="80"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-[#6B7280] dark:text-mono-500 mb-1.5">Ouverture</label>
              <div className="relative">
                <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9CA3AF] dark:text-mono-500" />
                <input
                  type="time"
                  value={form.openingHour}
                  onChange={(e) => setForm({ ...form, openingHour: e.target.value })}
                  className="w-full pl-10 pr-3 py-2.5 rounded-xl border border-mono-900 dark:border-mono-200 bg-white dark:bg-[#171717] text-mono-100 dark:text-white focus:ring-2 focus:ring-mono-100 dark:focus:ring-white outline-none"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-[#6B7280] dark:text-mono-500 mb-1.5">Fermeture</label>
              <div className="relative">
                <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9CA3AF] dark:text-mono-500" />
                <input
                  type="time"
                  value={form.closingHour}
                  onChange={(e) => setForm({ ...form, closingHour: e.target.value })}
                  className="w-full pl-10 pr-3 py-2.5 rounded-xl border border-mono-900 dark:border-mono-200 bg-white dark:bg-[#171717] text-mono-100 dark:text-white focus:ring-2 focus:ring-mono-100 dark:focus:ring-white outline-none"
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-3">
            <button
              type="button"
              onClick={() => setShowModal(false)}
              className="px-4 py-2.5 rounded-xl border border-mono-900 dark:border-mono-200 text-[#6B7280] dark:text-mono-500 hover:bg-mono-1000 dark:hover:bg-[#171717] text-sm font-medium transition-colors"
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-5 py-2.5 rounded-xl bg-mono-100 dark:bg-white hover:bg-[#333333] dark:hover:bg-[#E5E5E5] disabled:opacity-50 text-white dark:text-mono-100 text-sm font-bold transition-colors"
            >
              {submitting ? 'En cours...' : editingId ? 'Enregistrer' : 'Ajouter'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
