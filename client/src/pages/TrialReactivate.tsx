import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import {
  ChefHat, ArrowRight, CheckCircle2, Clock, Gift, Sparkles,
  TrendingUp, Scale, BarChart3, Calculator, Heart, Loader2,
} from 'lucide-react';
import SEOHead from '../components/SEOHead';
import { useToast } from '../hooks/useToast';

/* ═══════════════════════════════════════════════════════════════
   Trial Reactivate — Offre de reconquete pour les trials expires
   Offre : -30% sur les 3 premiers mois, limite dans le temps
   ═══════════════════════════════════════════════════════════════ */

export default function TrialReactivate() {
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [timeLeft, setTimeLeft] = useState({ hours: 47, minutes: 59 });
  const { showToast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    document.title = 'Offre de reactivation — RestauMargin';
    // Check if user is logged in and has expired trial
    const token = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');
    if (!token) {
      navigate('/login');
      return;
    }
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch {}
    }

    // Countdown timer (48h expiry offer)
    const expiryTime = localStorage.getItem('trialReactivateExpiry');
    let targetTime: number;
    if (expiryTime) {
      targetTime = parseInt(expiryTime, 10);
    } else {
      targetTime = Date.now() + 48 * 60 * 60 * 1000;
      localStorage.setItem('trialReactivateExpiry', targetTime.toString());
    }

    const interval = setInterval(() => {
      const now = Date.now();
      const diff = Math.max(0, targetTime - now);
      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      setTimeLeft({ hours, minutes });
    }, 30000);

    return () => clearInterval(interval);
  }, [navigate]);

  async function reactivate(planId: 'pro' | 'business') {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('/api/stripe/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ planId, annual: false, discount: 'REACTIVATE30' }),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || 'Erreur checkout');
      }
      const { url } = await res.json();
      if (url) window.location.href = url;
    } catch (e: any) {
      showToast(e.message || 'Erreur activation', 'error');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-white" style={{ fontFamily: "'Inter', system-ui, sans-serif" }}>
      <SEOHead
        title="Offre de reactivation — RestauMargin"
        description="Votre essai gratuit est termine. Profitez de -30% sur les 3 premiers mois pour reactiver votre compte RestauMargin."
        noindex={true}
      />

      {/* Banner countdown */}
      <div className="bg-gradient-to-r from-[#111111] to-[#1f2937] text-white px-4 py-3 text-center text-sm font-semibold">
        <div className="flex items-center justify-center gap-2 flex-wrap">
          <Clock className="w-4 h-4" />
          <span>Offre limitee — Expire dans</span>
          <span className="inline-flex items-center gap-1 font-mono font-black text-teal-400">
            {String(timeLeft.hours).padStart(2, '0')}h {String(timeLeft.minutes).padStart(2, '0')}m
          </span>
        </div>
      </div>

      {/* Hero */}
      <section className="pt-16 pb-12 px-4 sm:px-6 max-w-4xl mx-auto text-center">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-rose-50 border border-rose-200 rounded-full mb-6">
          <Heart className="w-4 h-4 text-rose-600" />
          <span className="text-sm font-semibold text-rose-700 uppercase tracking-wider">Offre speciale retour</span>
        </div>
        <h1
          className="text-4xl sm:text-5xl md:text-6xl font-black text-[#111111] mb-6 leading-tight"
         
        >
          {user?.name ? `${user.name}, ` : ''}on vous offre <span className="text-teal-600">-30%</span><br />
          pour revenir
        </h1>
        <p className="text-lg text-[#525252] max-w-2xl mx-auto leading-relaxed mb-2">
          Votre essai gratuit est termine, mais vous avez goute a RestauMargin.
        </p>
        <p className="text-lg text-[#111111] font-semibold max-w-2xl mx-auto leading-relaxed">
          Profitez de <span className="text-teal-600">-30% sur les 3 premiers mois</span> pour reactiver votre compte.
        </p>
      </section>

      {/* Pricing cards */}
      <section className="pb-16 px-4 sm:px-6 max-w-4xl mx-auto">
        <div className="grid md:grid-cols-2 gap-6">
          {/* Pro */}
          <div className="bg-white border-2 border-teal-500 rounded-3xl p-8 relative shadow-xl">
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-teal-600 text-white text-xs font-bold px-4 py-1 rounded-full uppercase tracking-wider">
              Recommande
            </div>
            <div className="flex items-center gap-2 mb-3">
              <ChefHat className="w-5 h-5 text-teal-600" />
              <span className="text-sm font-semibold text-teal-600 uppercase tracking-wider">Pro</span>
            </div>
            <div className="mb-4">
              <span className="text-4xl font-black text-[#111111]">20,30 €</span>
              <span className="text-[#737373]">/mois</span>
              <div className="text-xs text-[#737373] mt-1">
                pendant 3 mois, puis <s className="text-[#525252]">29€</s> 29€/mois
              </div>
            </div>
            <div className="inline-flex items-center gap-1 px-2 py-0.5 bg-emerald-100 text-emerald-700 text-xs font-bold rounded-full mb-6">
              <Sparkles className="w-3 h-3" />
              -30% offerts
            </div>
            <ul className="space-y-2.5 mb-8">
              {[
                'Dashboard, marges, recettes illimitees',
                'Menu Engineering',
                'Fournisseurs, HACCP, comptabilite',
                'Assistant IA (20q/jour)',
                '5 utilisateurs',
                'Support prioritaire',
              ].map((f) => (
                <li key={f} className="flex items-start gap-2 text-sm text-[#525252]">
                  <CheckCircle2 className="w-4 h-4 text-teal-600 flex-shrink-0 mt-0.5" />
                  <span>{f}</span>
                </li>
              ))}
            </ul>
            <button
              onClick={() => reactivate('pro')}
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 px-6 py-3.5 bg-teal-600 hover:bg-teal-500 disabled:opacity-50 text-white font-semibold rounded-xl transition-colors"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Gift className="w-4 h-4" />}
              Reactiver Pro avec -30%
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* Business */}
          <div className="bg-white border border-[#E5E7EB] rounded-3xl p-8 relative">
            <div className="flex items-center gap-2 mb-3">
              <Scale className="w-5 h-5 text-[#111111]" />
              <span className="text-sm font-semibold text-[#111111] uppercase tracking-wider">Business</span>
            </div>
            <div className="mb-4">
              <span className="text-4xl font-black text-[#111111]">55,30 €</span>
              <span className="text-[#737373]">/mois</span>
              <div className="text-xs text-[#737373] mt-1">
                pendant 3 mois, puis <s className="text-[#525252]">79€</s> 79€/mois
              </div>
            </div>
            <div className="inline-flex items-center gap-1 px-2 py-0.5 bg-emerald-100 text-emerald-700 text-xs font-bold rounded-full mb-6">
              <Sparkles className="w-3 h-3" />
              -30% offerts
            </div>
            <ul className="space-y-2.5 mb-8">
              {[
                'Tout du Pro',
                'Kit Station Balance integre',
                'Inventaire & stock automatise',
                'Multi-etablissements',
                'IA illimitee',
                'Auto-commandes fournisseurs',
                'Utilisateurs illimites',
                'Support 24/7',
              ].map((f) => (
                <li key={f} className="flex items-start gap-2 text-sm text-[#525252]">
                  <CheckCircle2 className="w-4 h-4 text-teal-600 flex-shrink-0 mt-0.5" />
                  <span>{f}</span>
                </li>
              ))}
            </ul>
            <button
              onClick={() => reactivate('business')}
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 px-6 py-3.5 bg-[#111111] hover:bg-[#1f2937] disabled:opacity-50 text-white font-semibold rounded-xl transition-colors"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Gift className="w-4 h-4" />}
              Reactiver Business avec -30%
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>

      {/* Reminder why */}
      <section className="py-16 px-4 sm:px-6 max-w-4xl mx-auto bg-[#f8fafb] rounded-3xl my-8">
        <h2
          className="text-2xl sm:text-3xl font-bold text-[#111111] mb-8 text-center"
         
        >
          Ce que vous ratez depuis la fin de votre essai
        </h2>
        <div className="grid sm:grid-cols-2 gap-4">
          {[
            { icon: Calculator, text: 'Calcul automatique du food cost et des marges' },
            { icon: BarChart3, text: 'Dashboard temps reel avec alertes anomalies' },
            { icon: TrendingUp, text: 'Menu Engineering et optimisation IA' },
            { icon: Scale, text: 'Pesee connectee pour fiches techniques precises' },
          ].map((item) => (
            <div key={item.text} className="flex items-start gap-3 bg-white p-4 rounded-xl border border-[#E5E7EB]">
              <item.icon className="w-5 h-5 text-teal-600 flex-shrink-0 mt-0.5" />
              <span className="text-sm text-[#525252]">{item.text}</span>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16 px-4 sm:px-6 max-w-3xl mx-auto">
        <h2
          className="text-2xl sm:text-3xl font-bold text-[#111111] mb-8 text-center"
         
        >
          Questions frequentes
        </h2>
        <div className="space-y-4">
          {[
            {
              q: 'Mes donnees sont-elles toujours la ?',
              a: "Oui. Toutes vos fiches techniques, ingredients et recettes cree pendant l'essai sont conservees. Reactivez et tout est de nouveau accessible en un clic.",
            },
            {
              q: "Pourquoi -30% pendant 3 mois ?",
              a: "C'est notre maniere de vous dire 'merci d'avoir teste' et de vous donner le temps de vraiment integrer RestauMargin dans votre routine.",
            },
            {
              q: 'Puis-je annuler a tout moment ?',
              a: 'Oui, sans engagement. Vous annulez en un clic depuis votre espace abonnement. Le remboursement prorata est automatique.',
            },
            {
              q: 'Quand expire cette offre ?',
              a: "L'offre -30% est disponible pendant 48h. Apres cela, les prix standards Pro (29€) et Business (79€) s'appliquent.",
            },
          ].map((item) => (
            <details
              key={item.q}
              className="group border border-[#E5E7EB] rounded-xl p-4 hover:border-teal-500 transition-colors"
            >
              <summary className="cursor-pointer font-semibold text-[#111111] flex items-center justify-between">
                {item.q}
                <span className="ml-2 text-[#737373] group-open:rotate-180 transition-transform">▾</span>
              </summary>
              <p className="mt-3 text-sm text-[#525252] leading-relaxed">{item.a}</p>
            </details>
          ))}
        </div>
      </section>

      {/* Back link */}
      <section className="py-8 px-4 sm:px-6 text-center">
        <Link to="/abonnement" className="text-sm text-[#737373] hover:text-teal-600 transition-colors">
          Voir tous les tarifs sans reduction
        </Link>
      </section>
    </div>
  );
}
