import { useState, useEffect } from 'react';
import {
  TrendingUp, TrendingDown, Euro, Users, AlertTriangle, Loader2,
  CheckCircle2, XCircle, Activity, BarChart3, Target, Zap,
  Clock, ArrowUpRight, RefreshCw, Info,
} from 'lucide-react';

interface FinanceData {
  generatedAt: string;
  mrr: number;
  arr: number;
  arpu: number;
  payingUsersCount: number;
  trialUsersCount: number;
  totalUsers: number;
  totalBasic: number;
  totalPro: number;
  totalBusiness: number;
  trialsByPlan: Record<string, number>;
  trialsExpiringSoon: number;
  trialsExpiredThisMonth: number;
  conversionsThisMonth: number;
  trialConversionRate: number;
  newUsersThisMonth: number;
  ltv: number;
  cacEstimate: number;
  ltvCacRatio: number | null;
  grossMarginPct: number | null;
  stackCostMonthly: {
    vercel: number;
    supabase: number;
    resend: number;
    anthropic: number;
    stripe_fees: number;
    total: number;
  };
  aiCostThisMonth: number | null;
  aiCallsThisMonth: number | null;
  mrrChart: Array<{ month: string; signups: number; paid: number }>;
  ruleOf40: number | null;
  stripeConnected: boolean;
  stripeTaxEnabled: boolean;
}

function MetricCard({
  label,
  value,
  sub,
  icon: Icon,
  color = 'teal',
  alert,
}: {
  label: string;
  value: string;
  sub?: string;
  icon: React.ComponentType<{ className?: string }>;
  color?: 'teal' | 'emerald' | 'rose' | 'amber' | 'blue' | 'violet';
  alert?: boolean;
}) {
  const colorMap = {
    teal: 'text-teal-600 bg-teal-50 dark:bg-teal-900/20',
    emerald: 'text-emerald-600 bg-emerald-50 dark:bg-emerald-900/20',
    rose: 'text-rose-500 bg-rose-50 dark:bg-rose-900/20',
    amber: 'text-amber-500 bg-amber-50 dark:bg-amber-900/20',
    blue: 'text-blue-500 bg-blue-50 dark:bg-blue-900/20',
    violet: 'text-violet-500 bg-violet-50 dark:bg-violet-900/20',
  };

  return (
    <div className={`bg-white dark:bg-[#0A0A0A]/50 border rounded-2xl p-5 flex items-start gap-4 ${alert ? 'border-rose-300 dark:border-rose-800' : 'border-[#E5E7EB] dark:border-[#1A1A1A]'}`}>
      <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${colorMap[color]}`}>
        <Icon className="w-5 h-5" />
      </div>
      <div className="min-w-0">
        <p className="text-xs text-[#737373] dark:text-[#A3A3A3] font-medium mb-0.5 uppercase tracking-wide">{label}</p>
        <p className="text-2xl font-bold text-[#111111] dark:text-white leading-tight">{value}</p>
        {sub && <p className="text-xs text-[#737373] dark:text-[#A3A3A3] mt-0.5">{sub}</p>}
      </div>
    </div>
  );
}

function StatusBadge({ ok, label }: { ok: boolean; label: string }) {
  return (
    <div className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium ${ok ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-400' : 'bg-rose-50 text-rose-600 dark:bg-rose-900/20 dark:text-rose-400'}`}>
      {ok ? <CheckCircle2 className="w-3.5 h-3.5" /> : <XCircle className="w-3.5 h-3.5" />}
      {label}
    </div>
  );
}

function MiniBar({ label, value, max, color }: { label: string; value: number; max: number; color: string }) {
  const pct = max > 0 ? Math.min(100, (value / max) * 100) : 0;
  return (
    <div className="flex items-center gap-3">
      <span className="text-xs text-[#737373] dark:text-[#A3A3A3] w-28 flex-shrink-0">{label}</span>
      <div className="flex-1 h-1.5 bg-[#F5F5F5] dark:bg-[#1A1A1A] rounded-full overflow-hidden">
        <div className={`h-full rounded-full ${color}`} style={{ width: `${pct}%` }} />
      </div>
      <span className="text-xs font-medium text-[#111111] dark:text-white w-8 text-right">{value}</span>
    </div>
  );
}

export default function AdminFinance() {
  const [data, setData] = useState<FinanceData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastRefresh, setLastRefresh] = useState<Date | null>(null);

  useEffect(() => {
    document.title = 'Finance Dashboard — RestauMargin';
    fetchFinance();
  }, []);

  async function fetchFinance() {
    try {
      setLoading(true);
      setError(null);
      const token = localStorage.getItem('token');
      const res = await fetch('/api/admin/finance', {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) {
        if (res.status === 403) throw new Error('Acces reserve aux administrateurs');
        throw new Error('Erreur chargement dashboard finance');
      }
      const json = await res.json();
      setData(json);
      setLastRefresh(new Date());
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

  if (error || !data) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-3">
        <AlertTriangle className="w-10 h-10 text-rose-500" />
        <p className="text-[#737373]">{error || 'Impossible de charger le dashboard finance'}</p>
        <button
          onClick={fetchFinance}
          className="mt-2 px-4 py-2 bg-teal-600 hover:bg-teal-500 text-white text-sm rounded-xl transition-colors"
        >
          Reessayer
        </button>
      </div>
    );
  }

  const fmtEur = (n: number) =>
    new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(n);

  const fmtPct = (n: number | null) => (n !== null ? `${n}%` : 'N/A');

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#111111] dark:text-white tracking-tight">
            Finance Dashboard
          </h1>
          <p className="text-sm text-[#737373] dark:text-[#A3A3A3] mt-0.5">
            Metriques SaaS en temps reel — lecture seule Supabase
          </p>
        </div>
        <div className="flex items-center gap-3">
          {lastRefresh && (
            <span className="text-xs text-[#737373] dark:text-[#A3A3A3]">
              Actualise {lastRefresh.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
            </span>
          )}
          <button
            onClick={fetchFinance}
            className="flex items-center gap-2 px-3 py-2 text-sm bg-[#F5F5F5] dark:bg-[#1A1A1A] text-[#111111] dark:text-white rounded-xl hover:bg-[#E5E7EB] dark:hover:bg-[#262626] transition-colors"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            Rafraichir
          </button>
        </div>
      </div>

      {/* Infrastructure status alerts */}
      <div className="flex flex-wrap gap-2">
        <StatusBadge ok={data.stripeConnected} label={data.stripeConnected ? 'Stripe Live connecte' : 'STRIPE_SECRET_KEY manquante'} />
        <StatusBadge ok={data.stripeTaxEnabled} label={data.stripeTaxEnabled ? 'Stripe Tax FR actif' : 'Stripe Tax FR desactive — risque TVA 20%'} />
        <StatusBadge ok={data.aiCostThisMonth !== null} label={data.aiCostThisMonth !== null ? 'Instrumentation IA active' : 'Cout IA non instrumente'} />
      </div>

      {/* BLOCKER banner if Stripe not connected */}
      {!data.stripeConnected && (
        <div className="flex items-start gap-3 bg-rose-50 dark:bg-rose-900/20 border border-rose-200 dark:border-rose-800 rounded-2xl p-4">
          <AlertTriangle className="w-5 h-5 text-rose-500 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-semibold text-rose-700 dark:text-rose-400">
              BLOCKER : STRIPE_SECRET_KEY absente sur Vercel
            </p>
            <p className="text-xs text-rose-600 dark:text-rose-300 mt-0.5">
              100% des trials expirent sans possibilite de paiement. Configurer immediatement via docs/STRIPE_SETUP.md.
            </p>
          </div>
        </div>
      )}

      {/* MRR = 0 info banner */}
      {data.mrr === 0 && data.payingUsersCount === 0 && (
        <div className="flex items-start gap-3 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-2xl p-4">
          <Info className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-amber-700 dark:text-amber-400">
            MRR = 0 EUR. Aucun utilisateur payant detecte. Les metriques affichees sont des estimations basees sur les donnees Supabase.
            Les MRR/ARR reels necessitent Stripe Live + webhook <code>invoice.paid</code>.
          </p>
        </div>
      )}

      {/* Core SaaS metrics */}
      <section>
        <h2 className="text-sm font-semibold text-[#737373] dark:text-[#A3A3A3] uppercase tracking-wider mb-4">
          Metriques SaaS core
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <MetricCard
            label="MRR"
            value={fmtEur(data.mrr)}
            sub={`ARR ${fmtEur(data.arr)}`}
            icon={Euro}
            color="teal"
            alert={data.mrr === 0}
          />
          <MetricCard
            label="Utilisateurs payants"
            value={String(data.payingUsersCount)}
            sub={`ARPU ${fmtEur(data.arpu)}/mois`}
            icon={Users}
            color="emerald"
          />
          <MetricCard
            label="Trials actifs"
            value={String(data.trialUsersCount)}
            sub={`${data.trialsExpiringSoon} expirent dans 7j`}
            icon={Clock}
            color={data.trialsExpiringSoon > 0 ? 'amber' : 'blue'}
          />
          <MetricCard
            label="Conversion trial"
            value={fmtPct(data.trialConversionRate)}
            sub={`${data.conversionsThisMonth} converties ce mois`}
            icon={TrendingUp}
            color="violet"
          />
        </div>
      </section>

      {/* Unit economics */}
      <section>
        <h2 className="text-sm font-semibold text-[#737373] dark:text-[#A3A3A3] uppercase tracking-wider mb-4">
          Unit economics
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <MetricCard
            label="LTV estime"
            value={fmtEur(data.ltv)}
            sub="36 mois retention moy."
            icon={Target}
            color="emerald"
          />
          <MetricCard
            label="CAC estime"
            value={fmtEur(data.cacEstimate)}
            sub="Outreach manuel (pas paid)"
            icon={ArrowUpRight}
            color="blue"
          />
          <MetricCard
            label="LTV/CAC ratio"
            value={data.ltvCacRatio !== null ? `${data.ltvCacRatio}x` : 'N/A'}
            sub={data.ltvCacRatio !== null && data.ltvCacRatio >= 3 ? 'Bon (cible >3x)' : 'Cible : >3x'}
            icon={BarChart3}
            color={data.ltvCacRatio !== null && data.ltvCacRatio >= 3 ? 'emerald' : 'amber'}
          />
          <MetricCard
            label="Marge brute estimee"
            value={data.grossMarginPct !== null ? fmtPct(data.grossMarginPct) : 'N/A'}
            sub={data.mrr === 0 ? 'Activer Stripe pour calculer' : 'Hors cout IA variable'}
            icon={Activity}
            color={data.grossMarginPct !== null && data.grossMarginPct >= 70 ? 'emerald' : 'amber'}
          />
        </div>
      </section>

      {/* User funnel */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Plan breakdown */}
        <div className="bg-white dark:bg-[#0A0A0A]/50 border border-[#E5E7EB] dark:border-[#1A1A1A] rounded-2xl p-5">
          <h3 className="text-sm font-semibold text-[#111111] dark:text-white mb-4">Repartition par plan</h3>
          <div className="space-y-3">
            <MiniBar label="Basic (gratuit)" value={data.totalBasic} max={data.totalUsers} color="bg-[#E5E7EB] dark:bg-[#262626]" />
            <MiniBar label="Pro (29€/mois)" value={data.totalPro} max={data.totalUsers} color="bg-teal-500" />
            <MiniBar label="Business (79€/mois)" value={data.totalBusiness} max={data.totalUsers} color="bg-violet-500" />
            <MiniBar label="Trials actifs" value={data.trialUsersCount} max={data.totalUsers} color="bg-amber-400" />
          </div>
          <div className="mt-4 pt-4 border-t border-[#E5E7EB] dark:border-[#1A1A1A]">
            <div className="flex justify-between text-xs text-[#737373] dark:text-[#A3A3A3]">
              <span>Total inscrits</span>
              <span className="font-semibold text-[#111111] dark:text-white">{data.totalUsers}</span>
            </div>
            <div className="flex justify-between text-xs text-[#737373] dark:text-[#A3A3A3] mt-1">
              <span>Nouveaux ce mois</span>
              <span className="font-semibold text-[#111111] dark:text-white">{data.newUsersThisMonth}</span>
            </div>
          </div>
        </div>

        {/* Stack costs */}
        <div className="bg-white dark:bg-[#0A0A0A]/50 border border-[#E5E7EB] dark:border-[#1A1A1A] rounded-2xl p-5">
          <h3 className="text-sm font-semibold text-[#111111] dark:text-white mb-4">Couts stack mensuel</h3>
          <div className="space-y-2.5">
            {[
              { label: 'Vercel', value: data.stackCostMonthly.vercel },
              { label: 'Supabase', value: data.stackCostMonthly.supabase },
              { label: 'Resend', value: data.stackCostMonthly.resend },
              { label: 'Anthropic IA', value: data.stackCostMonthly.anthropic },
              { label: 'Stripe fees', value: data.stackCostMonthly.stripe_fees },
            ].map((item) => (
              <div key={item.label} className="flex justify-between items-center text-sm">
                <span className="text-[#737373] dark:text-[#A3A3A3]">{item.label}</span>
                <span className={`font-medium ${item.value === 0 ? 'text-emerald-600' : 'text-[#111111] dark:text-white'}`}>
                  {item.value === 0 ? 'Gratuit' : fmtEur(item.value)}
                </span>
              </div>
            ))}
            <div className="flex justify-between items-center text-sm font-semibold border-t border-[#E5E7EB] dark:border-[#1A1A1A] pt-2.5 mt-2">
              <span className="text-[#111111] dark:text-white">Total fixe</span>
              <span className="text-[#111111] dark:text-white">{fmtEur(data.stackCostMonthly.total)}</span>
            </div>
          </div>
          {data.aiCostThisMonth === null && (
            <p className="mt-3 text-xs text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/20 rounded-lg px-3 py-2">
              Cout Anthropic non instrumente — voir ai_usage_log
            </p>
          )}
        </div>
      </div>

      {/* Monthly signup chart (text-based since no chart lib) */}
      <div className="bg-white dark:bg-[#0A0A0A]/50 border border-[#E5E7EB] dark:border-[#1A1A1A] rounded-2xl p-5">
        <h3 className="text-sm font-semibold text-[#111111] dark:text-white mb-4">Inscriptions par mois (12 mois)</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[#E5E7EB] dark:border-[#1A1A1A]">
                <th className="text-left py-2 pr-4 text-xs text-[#737373] dark:text-[#A3A3A3] font-medium">Mois</th>
                <th className="text-right py-2 px-3 text-xs text-[#737373] dark:text-[#A3A3A3] font-medium">Inscrits</th>
                <th className="text-right py-2 pl-3 text-xs text-[#737373] dark:text-[#A3A3A3] font-medium">Payants</th>
              </tr>
            </thead>
            <tbody>
              {data.mrrChart.slice(-6).map((row) => (
                <tr key={row.month} className="border-b border-[#F5F5F5] dark:border-[#111111] last:border-0">
                  <td className="py-2 pr-4 text-[#111111] dark:text-white font-medium">{row.month}</td>
                  <td className="py-2 px-3 text-right text-[#737373] dark:text-[#A3A3A3]">{row.signups}</td>
                  <td className="py-2 pl-3 text-right">
                    <span className={`font-medium ${row.paid > 0 ? 'text-emerald-600' : 'text-[#737373] dark:text-[#A3A3A3]'}`}>
                      {row.paid}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* AI cost section */}
      <div className="bg-white dark:bg-[#0A0A0A]/50 border border-[#E5E7EB] dark:border-[#1A1A1A] rounded-2xl p-5">
        <div className="flex items-center gap-2 mb-4">
          <Zap className="w-4 h-4 text-violet-500" />
          <h3 className="text-sm font-semibold text-[#111111] dark:text-white">Instrumentation cout IA (Anthropic)</h3>
        </div>
        {data.aiCostThisMonth !== null ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            <div>
              <p className="text-xs text-[#737373] dark:text-[#A3A3A3]">Cout ce mois</p>
              <p className="text-xl font-bold text-[#111111] dark:text-white">{fmtEur(data.aiCostThisMonth)}</p>
            </div>
            <div>
              <p className="text-xs text-[#737373] dark:text-[#A3A3A3]">Appels IA ce mois</p>
              <p className="text-xl font-bold text-[#111111] dark:text-white">{data.aiCallsThisMonth ?? 0}</p>
            </div>
            <div>
              <p className="text-xs text-[#737373] dark:text-[#A3A3A3]">Cout/appel moyen</p>
              <p className="text-xl font-bold text-[#111111] dark:text-white">
                {data.aiCallsThisMonth && data.aiCallsThisMonth > 0
                  ? fmtEur(data.aiCostThisMonth / data.aiCallsThisMonth)
                  : 'N/A'}
              </p>
            </div>
          </div>
        ) : (
          <div className="flex items-start gap-3 bg-amber-50 dark:bg-amber-900/20 rounded-xl p-4">
            <AlertTriangle className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-amber-700 dark:text-amber-400">
                Table ai_usage_log non creee
              </p>
              <p className="text-xs text-amber-600 dark:text-amber-300 mt-0.5">
                Appliquer la migration Prisma pour activer l'instrumentation des couts Anthropic.
                Sans cette table, la marge brute est incalculable a grande echelle.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Dunning alerts */}
      {data.trialsExpiringSoon > 0 && (
        <div className="flex items-start gap-3 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-2xl p-4">
          <Clock className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-semibold text-amber-700 dark:text-amber-400">
              {data.trialsExpiringSoon} trial(s) expirent dans les 7 prochains jours
            </p>
            <p className="text-xs text-amber-600 dark:text-amber-300 mt-0.5">
              Envoyer les emails dunning J-7 / J-3 / J-1 via les templates dans api/utils/emailTemplates.ts.
              Wiring webhook <code>customer.subscription.trial_will_end</code> requis.
            </p>
          </div>
        </div>
      )}

      {/* Footer */}
      <div className="text-xs text-[#A3A3A3] dark:text-[#737373] text-center pb-4">
        Donnees extraites de Supabase (read-only) — {data.generatedAt ? new Date(data.generatedAt).toLocaleString('fr-FR') : ''}
        {' | '}Les MRR/ARR reels necessitent Stripe Live + webhooks actifs
      </div>
    </div>
  );
}
