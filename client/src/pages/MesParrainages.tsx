import { useState, useEffect } from 'react';
import { Gift, Copy, CheckCircle2, Users, TrendingUp, Trophy, Mail, MessageCircle, Loader2, Sparkles } from 'lucide-react';
import { useToast } from '../hooks/useToast';

interface ReferralData {
  referralCode: string;
  shareUrl: string;
  stats: {
    totalReferred: number;
    converted: number;
    rewardsEarned: number;
  };
  referrals: Array<{
    id: number;
    status: string;
    rewardApplied: boolean;
    createdAt: string;
  }>;
}

export default function MesParrainages() {
  const [data, setData] = useState<ReferralData | null>(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const { showToast } = useToast();

  useEffect(() => {
    document.title = 'Mes Parrainages — RestauMargin';
    fetchData();
  }, []);

  async function fetchData() {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('/api/referrals/me', {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error('Erreur chargement');
      const json = await res.json();
      setData(json);
    } catch (e) {
      showToast('Erreur chargement des parrainages', 'error');
    } finally {
      setLoading(false);
    }
  }

  function copyToClipboard(text: string) {
    navigator.clipboard.writeText(text);
    setCopied(true);
    showToast('Lien copié !', 'success');
    setTimeout(() => setCopied(false), 2000);
  }

  function shareViaEmail() {
    if (!data) return;
    const subject = encodeURIComponent('Découvre RestauMargin avec -20% !');
    const body = encodeURIComponent(
      `Salut,\n\nJe pense que RestauMargin peut vraiment t'aider à gérer tes marges restaurant. ` +
      `Voici mon lien de parrainage, tu auras 20% de réduction sur ton premier mois :\n\n${data.shareUrl}\n\nÀ bientôt !`
    );
    window.location.href = `mailto:?subject=${subject}&body=${body}`;
  }

  function shareViaWhatsApp() {
    if (!data) return;
    const text = encodeURIComponent(
      `Salut ! J'utilise RestauMargin pour gérer mes marges restaurant et je pense que ça peut t'intéresser. ` +
      `Voici mon lien avec -20% sur ton premier mois : ${data.shareUrl}`
    );
    window.open(`https://wa.me/?text=${text}`, '_blank');
  }

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-teal-600 animate-spin" />
      </div>
    );
  }

  if (!data) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center text-[#737373]">
        Impossible de charger les parrainages.
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 space-y-8">
      {/* Header */}
      <div>
        <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-teal-50 dark:bg-teal-900/20 border border-teal-200 dark:border-teal-900/40 rounded-full mb-3">
          <Gift className="w-4 h-4 text-teal-600" />
          <span className="text-xs font-semibold text-teal-700 dark:text-teal-400 uppercase tracking-wider">Programme parrainage</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-[#111111] dark:text-white mb-2">
          Parrainez vos pairs, gagnez ensemble
        </h1>
        <p className="text-[#737373] dark:text-[#A3A3A3]">
          Pour chaque restaurateur que vous parrainez, vous gagnez <strong className="text-teal-600">1 mois Pro gratuit</strong> et il reçoit <strong className="text-teal-600">20% de réduction</strong> sur son premier mois.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard
          icon={Users}
          label="Filleuls invités"
          value={data.stats.totalReferred}
          color="teal"
        />
        <StatCard
          icon={TrendingUp}
          label="Conversions"
          value={data.stats.converted}
          color="emerald"
        />
        <StatCard
          icon={Trophy}
          label="Récompenses"
          value={data.stats.rewardsEarned}
          color="amber"
          suffix={data.stats.rewardsEarned > 0 ? `${data.stats.rewardsEarned} mois gratuit` : ''}
        />
      </div>

      {/* Share block */}
      <div className="bg-gradient-to-br from-teal-500 to-teal-700 rounded-3xl p-8 sm:p-10 text-white shadow-xl">
        <div className="flex items-center gap-2 mb-3">
          <Sparkles className="w-5 h-5" />
          <span className="text-sm font-semibold uppercase tracking-wider opacity-90">Votre lien magique</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-bold mb-6">
          Partagez et gagnez
        </h2>

        {/* Code */}
        <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-4 mb-4">
          <div className="text-xs font-semibold uppercase tracking-wider opacity-75 mb-2">Votre code</div>
          <div className="flex items-center justify-between gap-3">
            <span className="text-2xl sm:text-3xl font-black tracking-wider">{data.referralCode}</span>
            <button
              onClick={() => copyToClipboard(data.referralCode)}
              className="flex items-center gap-2 px-4 py-2 bg-white/20 hover:bg-white/30 rounded-xl text-sm font-semibold transition-colors"
            >
              {copied ? <CheckCircle2 className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              {copied ? 'Copié !' : 'Copier'}
            </button>
          </div>
        </div>

        {/* Link */}
        <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-4 mb-6">
          <div className="text-xs font-semibold uppercase tracking-wider opacity-75 mb-2">Votre lien de partage</div>
          <div className="flex items-center gap-3">
            <input
              readOnly
              value={data.shareUrl}
              className="flex-1 bg-transparent text-sm font-mono outline-none min-w-0 truncate"
              onClick={(e) => (e.target as HTMLInputElement).select()}
            />
            <button
              onClick={() => copyToClipboard(data.shareUrl)}
              className="flex-shrink-0 p-2 bg-white/20 hover:bg-white/30 rounded-lg transition-colors"
              title="Copier le lien"
            >
              <Copy className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Share buttons */}
        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={shareViaEmail}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-white text-teal-700 hover:bg-white/90 rounded-xl font-semibold transition-colors"
          >
            <Mail className="w-4 h-4" />
            Email
          </button>
          <button
            onClick={shareViaWhatsApp}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-white text-teal-700 hover:bg-white/90 rounded-xl font-semibold transition-colors"
          >
            <MessageCircle className="w-4 h-4" />
            WhatsApp
          </button>
        </div>
      </div>

      {/* How it works */}
      <div className="bg-white dark:bg-[#0A0A0A]/50 border border-[#E5E7EB] dark:border-[#1A1A1A] rounded-2xl p-6 sm:p-8">
        <h3 className="text-xl font-bold text-[#111111] dark:text-white mb-6">Comment ça marche ?</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <Step number={1} title="Partagez votre lien" text="Envoyez votre code ou lien par email, WhatsApp ou SMS à vos pairs restaurateurs." />
          <Step number={2} title="Ils s'inscrivent" text="Vos filleuls reçoivent automatiquement 20% de réduction sur leur premier mois." />
          <Step number={3} title="Vous gagnez" text="Quand ils passent en Pro ou Business, vous recevez 1 mois gratuit." />
        </div>
      </div>

      {/* History */}
      {data.referrals.length > 0 && (
        <div className="bg-white dark:bg-[#0A0A0A]/50 border border-[#E5E7EB] dark:border-[#1A1A1A] rounded-2xl p-6 sm:p-8">
          <h3 className="text-xl font-bold text-[#111111] dark:text-white mb-4">Historique ({data.referrals.length})</h3>
          <div className="space-y-2">
            {data.referrals.map((r) => (
              <div
                key={r.id}
                className="flex items-center justify-between p-3 bg-[#F5F5F5] dark:bg-[#171717] rounded-xl"
              >
                <div>
                  <div className="text-sm font-semibold text-[#111111] dark:text-white">
                    Filleul #{r.id}
                  </div>
                  <div className="text-xs text-[#737373] dark:text-[#A3A3A3]">
                    Inscrit le {new Date(r.createdAt).toLocaleDateString('fr-FR')}
                  </div>
                </div>
                <StatusBadge status={r.status} />
              </div>
            ))}
          </div>
        </div>
      )}

      {data.referrals.length === 0 && (
        <div className="text-center py-12 text-[#737373] dark:text-[#A3A3A3]">
          <Gift className="w-12 h-12 mx-auto mb-3 opacity-30" />
          <p className="text-sm">Aucun parrainage pour le moment. Partagez votre lien pour commencer !</p>
        </div>
      )}
    </div>
  );
}

/* ─── Sub-components ─── */

function StatCard({ icon: Icon, label, value, color, suffix }: { icon: any; label: string; value: number; color: string; suffix?: string }) {
  const colors: Record<string, string> = {
    teal: 'text-teal-600 bg-teal-100 dark:bg-teal-900/20',
    emerald: 'text-emerald-600 bg-emerald-100 dark:bg-emerald-900/20',
    amber: 'text-amber-600 bg-amber-100 dark:bg-amber-900/20',
  };
  return (
    <div className="bg-white dark:bg-[#0A0A0A]/50 border border-[#E5E7EB] dark:border-[#1A1A1A] rounded-2xl p-5">
      <div className={`inline-flex items-center justify-center w-10 h-10 rounded-xl ${colors[color]} mb-3`}>
        <Icon className="w-5 h-5" />
      </div>
      <div className="text-3xl font-black text-[#111111] dark:text-white mb-1">{value}</div>
      <div className="text-xs font-semibold text-[#737373] dark:text-[#A3A3A3] uppercase tracking-wider">{label}</div>
      {suffix && <div className="text-xs text-emerald-600 font-semibold mt-1">{suffix}</div>}
    </div>
  );
}

function Step({ number, title, text }: { number: number; title: string; text: string }) {
  return (
    <div>
      <div className="flex items-center justify-center w-8 h-8 rounded-full bg-teal-100 dark:bg-teal-900/30 text-teal-600 font-bold text-sm mb-3">
        {number}
      </div>
      <div className="font-semibold text-[#111111] dark:text-white mb-1">{title}</div>
      <div className="text-sm text-[#737373] dark:text-[#A3A3A3] leading-relaxed">{text}</div>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, { label: string; cls: string }> = {
    pending: { label: 'En attente', cls: 'bg-amber-100 text-amber-700 dark:bg-amber-900/20 dark:text-amber-400' },
    qualified: { label: 'Qualifié', cls: 'bg-teal-100 text-teal-700 dark:bg-teal-900/20 dark:text-teal-400' },
    rewarded: { label: 'Récompensé', cls: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-400' },
    active: { label: 'Actif', cls: 'bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400' },
  };
  const s = styles[status] || { label: status, cls: 'bg-gray-100 text-gray-700' };
  return <span className={`px-2.5 py-1 text-xs font-semibold rounded-full ${s.cls}`}>{s.label}</span>;
}
