import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Users, TrendingUp, TrendingDown, Euro, Activity, AlertTriangle,
  ShoppingCart, ChefHat, MessageSquare, Gift, Loader2, ArrowUpRight,
  Clock, CheckCircle2, XCircle, BarChart3,
} from 'lucide-react';

interface Stats {
  totalUsers: number;
  newUsersWeek: number;
  newUsersMonth: number;
  totalRestaurants: number;
  totalRecipes: number;
  totalIngredients: number;
  activeSubscriptions: number;
  totalMessages: number;
  totalOrders: number;
  newsletterCount: number;
  recentSignups: Array<{
    id: number;
    name: string;
    email: string;
    role: string;
    plan: string;
    createdAt: string;
  }>;
  signupsChart: Array<{ date: string; count: number }>;
}

export default function AdminMetrics() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    document.title = 'Admin Metrics — RestauMargin';
    fetchStats();
  }, []);

  async function fetchStats() {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('/api/admin/stats', {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) {
        if (res.status === 403) throw new Error('Accès réservé aux administrateurs');
        throw new Error('Erreur chargement');
      }
      setStats(await res.json());
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-teal-600 animate-spin" />
      </div>
    );
  }

  if (error || !stats) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center flex-col gap-3">
        <AlertTriangle className="w-10 h-10 text-rose-500" />
        <p className="text-[#737373]">{error || 'Impossible de charger les metriques'}</p>
      </div>
    );
  }

  // Computed business metrics (estimations)
  const paidUsers = stats.activeSubscriptions;
  const conversionRate = stats.totalUsers > 0 ? (paidUsers / stats.totalUsers) * 100 : 0;
  const estimatedMRR = paidUsers * 29; // Assume average 29€ (mix of Pro/Business)
  const trialsExpiringSoon = stats.recentSignups.filter((u) => {
    if (u.plan !== 'basic') return false;
    return true; // Backend would filter properly, here we show all basic recents
  }).length;

  // Chart max for normalization
  const chartMax = Math.max(...stats.signupsChart.map((d) => d.count), 1);
  const last7Days = stats.signupsChart.slice(-7);
  const last7Total = last7Days.reduce((s, d) => s + d.count, 0);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-[#111111] dark:bg-white text-white dark:text-[#111111] rounded-full mb-3">
            <BarChart3 className="w-4 h-4" />
            <span className="text-xs font-bold uppercase tracking-wider">Cockpit admin</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-[#111111] dark:text-white">
            Metriques RestauMargin
          </h1>
          <p className="text-[#737373] dark:text-[#A3A3A3] mt-1">
            Vue temps reel de l'activite, conversions et revenus.
          </p>
        </div>
        <button
          onClick={fetchStats}
          className="px-4 py-2 bg-teal-600 hover:bg-teal-500 text-white text-sm font-semibold rounded-xl transition-colors"
        >
          ↻ Rafraichir
        </button>
      </div>

      {/* Big 4 business KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <BigKpi
          icon={Euro}
          label="MRR estime"
          value={`${estimatedMRR.toLocaleString('fr-FR')} €`}
          subtitle={`${paidUsers} abonnement${paidUsers > 1 ? 's' : ''} actif${paidUsers > 1 ? 's' : ''}`}
          color="emerald"
        />
        <BigKpi
          icon={TrendingUp}
          label="Conversion"
          value={`${conversionRate.toFixed(1)}%`}
          subtitle={`${paidUsers}/${stats.totalUsers} users payants`}
          color="teal"
        />
        <BigKpi
          icon={Users}
          label="Signups cette semaine"
          value={stats.newUsersWeek.toString()}
          subtitle={`${last7Total} sur les 7 derniers jours`}
          color="blue"
          trend={stats.newUsersWeek > 0 ? 'up' : 'flat'}
        />
        <BigKpi
          icon={AlertTriangle}
          label="Trials expirant"
          value={trialsExpiringSoon.toString()}
          subtitle="A relancer en priorite"
          color="amber"
        />
      </div>

      {/* Signups chart */}
      <div className="bg-white dark:bg-[#0A0A0A]/50 border border-[#E5E7EB] dark:border-[#1A1A1A] rounded-2xl p-6 sm:p-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-bold text-[#111111] dark:text-white">
              Signups 30 derniers jours
            </h2>
            <p className="text-sm text-[#737373] dark:text-[#A3A3A3]">
              Total : {stats.signupsChart.reduce((s, d) => s + d.count, 0)} inscriptions
            </p>
          </div>
          <div className="flex items-center gap-2 text-xs text-[#737373] dark:text-[#A3A3A3]">
            <span className="inline-block w-3 h-3 bg-teal-600 rounded"></span>
            <span>Signups/jour</span>
          </div>
        </div>
        <div className="flex items-end gap-1 h-32 sm:h-40">
          {stats.signupsChart.map((d, i) => {
            const height = (d.count / chartMax) * 100;
            return (
              <div
                key={d.date}
                className="flex-1 flex flex-col items-center justify-end group relative"
                title={`${d.date}: ${d.count} signup${d.count !== 1 ? 's' : ''}`}
              >
                <div
                  className="w-full bg-teal-600 hover:bg-teal-500 rounded-t transition-colors min-h-[2px]"
                  style={{ height: `${Math.max(height, d.count > 0 ? 8 : 2)}%` }}
                />
                {i % 5 === 0 && (
                  <div className="text-[9px] text-[#737373] dark:text-[#A3A3A3] mt-1 whitespace-nowrap overflow-hidden">
                    {new Date(d.date).toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit' })}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Activity grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <SmallKpi icon={ChefHat} label="Restaurants" value={stats.totalRestaurants} />
        <SmallKpi icon={Activity} label="Recettes" value={stats.totalRecipes} />
        <SmallKpi icon={ShoppingCart} label="Ingredients" value={stats.totalIngredients} />
        <SmallKpi icon={MessageSquare} label="Messages" value={stats.totalMessages} />
      </div>

      {/* Recent signups */}
      <div className="bg-white dark:bg-[#0A0A0A]/50 border border-[#E5E7EB] dark:border-[#1A1A1A] rounded-2xl overflow-hidden">
        <div className="px-6 py-4 border-b border-[#E5E7EB] dark:border-[#1A1A1A] flex items-center justify-between">
          <h2 className="text-lg font-bold text-[#111111] dark:text-white">
            Dernieres inscriptions
          </h2>
          <Link
            to="/users"
            className="inline-flex items-center gap-1 text-sm text-teal-600 hover:text-teal-700 font-semibold"
          >
            Tout voir <ArrowUpRight className="w-3 h-3" />
          </Link>
        </div>
        <div className="divide-y divide-[#E5E7EB] dark:divide-[#1A1A1A]">
          {stats.recentSignups.map((u) => (
            <div
              key={u.id}
              className="px-6 py-3 flex items-center justify-between hover:bg-[#F5F5F5] dark:hover:bg-[#171717] transition-colors"
            >
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-semibold text-[#111111] dark:text-white text-sm truncate">
                    {u.name}
                  </span>
                  <PlanBadge plan={u.plan} />
                  {u.role === 'admin' && (
                    <span className="text-xs px-2 py-0.5 bg-amber-100 dark:bg-amber-900/20 text-amber-700 dark:text-amber-400 font-semibold rounded-full">
                      ADMIN
                    </span>
                  )}
                </div>
                <div className="text-xs text-[#737373] dark:text-[#A3A3A3] truncate">
                  {u.email}
                </div>
              </div>
              <div className="flex items-center gap-2 text-xs text-[#737373] dark:text-[#A3A3A3] flex-shrink-0 ml-3">
                <Clock className="w-3 h-3" />
                {new Date(u.createdAt).toLocaleDateString('fr-FR')}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Footer stats */}
      <div className="grid grid-cols-2 gap-4">
        <Link
          to="/email-marketing"
          className="group bg-white dark:bg-[#0A0A0A]/50 border border-[#E5E7EB] dark:border-[#1A1A1A] rounded-2xl p-5 hover:border-teal-500 transition-colors"
        >
          <div className="flex items-center justify-between mb-2">
            <div className="w-10 h-10 rounded-xl bg-violet-100 dark:bg-violet-900/20 flex items-center justify-center">
              <MessageSquare className="w-5 h-5 text-violet-600" />
            </div>
            <ArrowUpRight className="w-4 h-4 text-[#737373] group-hover:text-teal-600 transition-colors" />
          </div>
          <div className="text-2xl font-black text-[#111111] dark:text-white">
            {stats.newsletterCount}
          </div>
          <div className="text-xs font-semibold text-[#737373] dark:text-[#A3A3A3] uppercase tracking-wider">
            Newsletter opt-ins
          </div>
        </Link>

        <Link
          to="/mes-parrainages"
          className="group bg-white dark:bg-[#0A0A0A]/50 border border-[#E5E7EB] dark:border-[#1A1A1A] rounded-2xl p-5 hover:border-teal-500 transition-colors"
        >
          <div className="flex items-center justify-between mb-2">
            <div className="w-10 h-10 rounded-xl bg-rose-100 dark:bg-rose-900/20 flex items-center justify-center">
              <Gift className="w-5 h-5 text-rose-600" />
            </div>
            <ArrowUpRight className="w-4 h-4 text-[#737373] group-hover:text-teal-600 transition-colors" />
          </div>
          <div className="text-2xl font-black text-[#111111] dark:text-white">
            Parrainage
          </div>
          <div className="text-xs font-semibold text-[#737373] dark:text-[#A3A3A3] uppercase tracking-wider">
            Programme actif
          </div>
        </Link>
      </div>
    </div>
  );
}

/* ─── Sub-components ─── */

function BigKpi({
  icon: Icon,
  label,
  value,
  subtitle,
  color,
  trend,
}: {
  icon: any;
  label: string;
  value: string;
  subtitle: string;
  color: 'emerald' | 'teal' | 'blue' | 'amber';
  trend?: 'up' | 'down' | 'flat';
}) {
  const colors = {
    emerald: 'text-emerald-600 bg-emerald-100 dark:bg-emerald-900/20',
    teal: 'text-teal-600 bg-teal-100 dark:bg-teal-900/20',
    blue: 'text-blue-600 bg-blue-100 dark:bg-blue-900/20',
    amber: 'text-amber-600 bg-amber-100 dark:bg-amber-900/20',
  };
  return (
    <div className="bg-white dark:bg-[#0A0A0A]/50 border border-[#E5E7EB] dark:border-[#1A1A1A] rounded-2xl p-5">
      <div className="flex items-center justify-between mb-3">
        <div className={`inline-flex items-center justify-center w-10 h-10 rounded-xl ${colors[color]}`}>
          <Icon className="w-5 h-5" />
        </div>
        {trend === 'up' && <TrendingUp className="w-4 h-4 text-emerald-600" />}
        {trend === 'down' && <TrendingDown className="w-4 h-4 text-rose-600" />}
      </div>
      <div className="text-2xl sm:text-3xl font-black text-[#111111] dark:text-white mb-1">
        {value}
      </div>
      <div className="text-xs font-semibold text-[#737373] dark:text-[#A3A3A3] uppercase tracking-wider mb-1">
        {label}
      </div>
      <div className="text-xs text-[#525252] dark:text-[#A3A3A3]">{subtitle}</div>
    </div>
  );
}

function SmallKpi({ icon: Icon, label, value }: { icon: any; label: string; value: number }) {
  return (
    <div className="bg-white dark:bg-[#0A0A0A]/50 border border-[#E5E7EB] dark:border-[#1A1A1A] rounded-2xl p-4 flex items-center gap-3">
      <div className="w-9 h-9 rounded-lg bg-[#F5F5F5] dark:bg-[#171717] flex items-center justify-center">
        <Icon className="w-4 h-4 text-[#525252] dark:text-[#A3A3A3]" />
      </div>
      <div>
        <div className="text-lg font-bold text-[#111111] dark:text-white">{value}</div>
        <div className="text-xs text-[#737373] dark:text-[#A3A3A3]">{label}</div>
      </div>
    </div>
  );
}

function PlanBadge({ plan }: { plan: string }) {
  const styles: Record<string, string> = {
    basic: 'bg-gray-100 text-gray-700 dark:bg-gray-900/40 dark:text-gray-300',
    pro: 'bg-teal-100 text-teal-700 dark:bg-teal-900/20 dark:text-teal-400',
    business: 'bg-violet-100 text-violet-700 dark:bg-violet-900/20 dark:text-violet-400',
  };
  return (
    <span className={`text-xs px-2 py-0.5 font-bold uppercase rounded-full ${styles[plan] || styles.basic}`}>
      {plan}
    </span>
  );
}
