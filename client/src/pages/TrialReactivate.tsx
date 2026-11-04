import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import {
  ChefHat, ArrowRight, CheckCircle2, Heart, Loader2,
  TrendingUp, Scale, BarChart3, Calculator, CreditCard,
} from 'lucide-react';
import SEOHead from '../components/SEOHead';
import { useToast } from '../hooks/useToast';

/* ═══════════════════════════════════════════════════════════════
   Trial Reactivate — page de retour pour les essais expirés
   Offre unique (2026-11-04) : 19 € par mois, toutes les fonctionnalités,
   sans engagement. L'ancienne remise « -30 % pendant 3 mois » et son
   compte à rebours de 48 h n'étaient appliqués par aucun code serveur
   (le checkout ignorait le champ discount) : retirés.
   ═══════════════════════════════════════════════════════════════ */

const FONCTIONNALITES = [
  'Tableau de bord, marges et recettes illimitées',
  'Menu engineering',
  'Fournisseurs, HACCP, comptabilité',
  'Inventaire et stock',
  'Multi-établissements',
  'Assistant IA : 500 requêtes par mois',
];

export default function TrialReactivate() {
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState<any>(null);
  const { showToast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    document.title = 'Réactiver votre compte — RestauMargin';
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
  }, [navigate]);

  async function reactivate() {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('/api/stripe/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ planId: 'pro' }),
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
    <div className="min-h-screen bg-white">
      <SEOHead
        title="Réactiver votre compte — RestauMargin"
        description="Votre essai gratuit est terminé. Réactivez votre compte RestauMargin : 19 € par mois, toutes les fonctionnalités, sans engagement."
        noindex={true}
      />

      {/* Hero */}
      <section className="pt-16 pb-12 px-4 sm:px-6 max-w-4xl mx-auto text-center">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-rose-50 border border-rose-200 rounded-full mb-6">
          <Heart className="w-4 h-4 text-rose-600" />
          <span className="text-sm font-semibold text-rose-700 uppercase tracking-wider">Bon retour</span>
        </div>
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-black text-mono-100 mb-6 leading-tight">
          {user?.name ? `${user.name}, ` : ''}vos données<br />vous attendent
        </h1>
        <p className="text-lg text-mono-400 max-w-2xl mx-auto leading-relaxed">
          Votre essai gratuit est terminé. Réactivez votre compte pour retrouver vos fiches techniques et vos marges.
        </p>
      </section>

      {/* Offre unique */}
      <section className="pb-16 px-4 sm:px-6 max-w-md mx-auto">
        <div className="bg-white border-2 border-teal-500 rounded-3xl p-8 relative shadow-xl">
          <div className="flex items-center gap-2 mb-3">
            <ChefHat className="w-5 h-5 text-teal-600" />
            <span className="text-sm font-semibold text-teal-600 uppercase tracking-wider">RestauMargin</span>
          </div>
          <div className="mb-6">
            <span className="text-4xl font-black text-mono-100">19 €</span>
            <span className="text-mono-500"> par mois</span>
            <div className="text-xs text-mono-500 mt-1">Toutes les fonctionnalités, sans engagement</div>
          </div>
          <ul className="space-y-2.5 mb-8">
            {FONCTIONNALITES.map((f) => (
              <li key={f} className="flex items-start gap-2 text-sm text-mono-400">
                <CheckCircle2 className="w-4 h-4 text-teal-600 flex-shrink-0 mt-0.5" />
                <span>{f}</span>
              </li>
            ))}
          </ul>
          <button
            onClick={reactivate}
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 px-6 py-3.5 bg-teal-600 hover:bg-teal-500 disabled:opacity-50 text-white font-semibold rounded-xl transition-colors"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <CreditCard className="w-4 h-4" />}
            Réactiver mon compte
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </section>

      {/* Reminder why */}
      <section className="py-16 px-4 sm:px-6 max-w-4xl mx-auto bg-[#f8fafb] rounded-3xl my-8">
        <h2
          className="text-2xl sm:text-3xl font-bold text-mono-100 mb-8 text-center"
         
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
            <div key={item.text} className="flex items-start gap-3 bg-white p-4 rounded-xl border border-mono-900">
              <item.icon className="w-5 h-5 text-teal-600 flex-shrink-0 mt-0.5" />
              <span className="text-sm text-mono-400">{item.text}</span>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16 px-4 sm:px-6 max-w-3xl mx-auto">
        <h2
          className="text-2xl sm:text-3xl font-bold text-mono-100 mb-8 text-center"
         
        >
          Questions fréquentes
        </h2>
        <div className="space-y-4">
          {[
            {
              q: 'Mes données sont-elles toujours là ?',
              a: "Oui. Vos fiches techniques, ingrédients et recettes créés pendant l'essai sont conservés. Réactivez et tout est de nouveau accessible.",
            },
            {
              q: 'Puis-je résilier à tout moment ?',
              a: "Oui, sans engagement. Vous résiliez depuis votre espace abonnement ; la résiliation prend effet à la fin de la période mensuelle en cours.",
            },
            {
              q: 'Combien coûte RestauMargin ?',
              a: "Une seule offre : 19 € par mois, toutes les fonctionnalités incluses.",
            },
          ].map((item) => (
            <details
              key={item.q}
              className="group border border-mono-900 rounded-xl p-4 hover:border-teal-500 transition-colors"
            >
              <summary className="cursor-pointer font-semibold text-mono-100 flex items-center justify-between">
                {item.q}
                <span className="ml-2 text-mono-500 group-open:rotate-180 transition-transform">▾</span>
              </summary>
              <p className="mt-3 text-sm text-mono-400 leading-relaxed">{item.a}</p>
            </details>
          ))}
        </div>
      </section>

      {/* Back link */}
      <section className="py-8 px-4 sm:px-6 text-center">
        <Link to="/abonnement" className="text-sm text-mono-500 hover:text-teal-600 transition-colors">
          Voir mon abonnement
        </Link>
      </section>
    </div>
  );
}
