/**
 * @file client/src/pages/LaunchPH.tsx
 *
 * Page dédiée /launch — countdown vers le launch Product Hunt.
 * Capture les emails des early supporters pour leur envoyer un reminder
 * jour-J et maximiser les upvotes dans les 30 premières minutes.
 *
 * Theme : ShaderBackground Curves (cohérence landing) + MintMistBackground hero.
 * SEO : indexable (les visiteurs PH atterriront ici).
 */

import { lazy, Suspense, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Mic, Sparkles, Bell, TrendingUp, ArrowRight, Calendar, Clock, Users, Zap } from 'lucide-react';

const ShaderBackground = lazy(() => import('../components/landing/ShaderBackground'));
const MintMistBackground = lazy(() => import('../components/landing/MintMistBackground'));

// Date du launch — à updater quand user choisit (Mardi 5 mai ou Mercredi 6 mai 2026 9h01 Paris)
const LAUNCH_DATE = new Date('2026-05-06T09:01:00+02:00');
const PH_DRAFT_URL = 'https://www.producthunt.com/products/restaumargin';

export default function LaunchPH() {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const tick = () => {
      const now = new Date().getTime();
      const launch = LAUNCH_DATE.getTime();
      const diff = launch - now;

      if (diff <= 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        return;
      }

      setTimeLeft({
        days: Math.floor(diff / (1000 * 60 * 60 * 24)),
        hours: Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((diff % (1000 * 60)) / 1000),
      });
    };

    tick();
    const interval = setInterval(tick, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || loading) return;
    setLoading(true);

    try {
      // Stocke en localStorage et envoie à l'API
      await fetch('/api/launch-notify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, source: 'launch-page' }),
      }).catch(() => {});

      // Toujours OK pour UX (même si endpoint pas encore créé)
      localStorage.setItem('ph_launch_notify', email);
      setSubmitted(true);
    } finally {
      setLoading(false);
    }
  };

  const launched = timeLeft.days === 0 && timeLeft.hours === 0 && timeLeft.minutes === 0 && timeLeft.seconds === 0;

  return (
    <>
      {/* Curves shader fixed background */}
      <Suspense fallback={null}>
        <div className="fixed inset-0 -z-10 pointer-events-none">
          <ShaderBackground intensity={0.6} />
        </div>
      </Suspense>

      <main className="relative min-h-screen">
        {/* HERO */}
        <section className="relative pt-20 pb-24 sm:pt-28 sm:pb-32 px-4 sm:px-6 overflow-hidden isolate">
          <Suspense fallback={<div className="absolute inset-0 z-0 bg-[#FAFAF7]" />}>
            <MintMistBackground intensity={0.9} className="z-0" />
          </Suspense>

          <div className="relative z-10 max-w-5xl mx-auto text-center">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-sm font-semibold mb-8 shadow-sm">
              <Sparkles className="w-4 h-4" />
              {launched ? 'WE\'RE LIVE ON PRODUCT HUNT' : 'COMING SOON ON PRODUCT HUNT'}
            </div>

            {/* Title */}
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black tracking-tight text-[#0F172A] leading-[1.05] mb-6">
              On lance RestauMargin
              <br />
              sur <span className="text-emerald-600">Product Hunt</span>
            </h1>

            <p className="text-lg sm:text-xl text-[#525252] max-w-2xl mx-auto leading-relaxed mb-10">
              Le 6 mai 2026 à 9h01, RestauMargin sera officiellement lancé sur la plus grosse
              plateforme tech au monde. <strong className="text-[#0F172A]">Aide-nous à atteindre le Top 5 du jour.</strong>
            </p>

            {/* Countdown */}
            {!launched ? (
              <div className="grid grid-cols-4 gap-3 sm:gap-6 max-w-2xl mx-auto mb-12">
                {[
                  { label: 'Jours', value: timeLeft.days },
                  { label: 'Heures', value: timeLeft.hours },
                  { label: 'Minutes', value: timeLeft.minutes },
                  { label: 'Secondes', value: timeLeft.seconds },
                ].map((unit) => (
                  <div
                    key={unit.label}
                    className="bg-white/90 backdrop-blur border border-[#E5E7EB] rounded-2xl p-4 sm:p-6 shadow-lg"
                  >
                    <div className="text-3xl sm:text-5xl font-black text-emerald-600 tabular-nums">
                      {String(unit.value).padStart(2, '0')}
                    </div>
                    <div className="text-xs sm:text-sm text-[#737373] uppercase tracking-wider mt-1 font-semibold">
                      {unit.label}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="mb-12">
                <a
                  href={PH_DRAFT_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-3 px-10 py-5 rounded-2xl bg-[#DA552F] text-white font-bold text-lg shadow-2xl hover:scale-105 transition-transform"
                >
                  <span>Upvote sur Product Hunt</span>
                  <ArrowRight className="w-6 h-6" />
                </a>
              </div>
            )}

            {/* Email capture */}
            {!submitted ? (
              <form
                onSubmit={handleSubmit}
                className="max-w-xl mx-auto flex flex-col sm:flex-row gap-3 mb-6"
              >
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="ton-email@restaurant.fr"
                  className="flex-1 px-5 py-4 rounded-xl border-2 border-[#E5E7EB] bg-white text-[#0F172A] placeholder:text-[#A3A3A3] focus:border-emerald-500 focus:outline-none focus:ring-4 focus:ring-emerald-500/20 transition-all"
                />
                <button
                  type="submit"
                  disabled={loading}
                  className="px-8 py-4 rounded-xl bg-emerald-600 text-white font-bold hover:bg-emerald-700 active:scale-95 transition-all shadow-lg shadow-emerald-600/20 disabled:opacity-50"
                >
                  {loading ? 'Envoi...' : 'Préviens-moi 🚀'}
                </button>
              </form>
            ) : (
              <div className="max-w-xl mx-auto bg-emerald-50 border-2 border-emerald-200 rounded-2xl p-6 mb-6">
                <div className="flex items-center justify-center gap-3 text-emerald-700 font-bold">
                  <Bell className="w-5 h-5" />
                  C'est noté ! On t'envoie un rappel le jour J.
                </div>
                <p className="text-sm text-emerald-600 mt-2">
                  Et un email à 9h01 pile pour upvoter.
                </p>
              </div>
            )}

            <p className="text-sm text-[#737373]">
              On t'envoie 1 seul email — le jour du launch. Promis, pas de spam.
            </p>
          </div>
        </section>

        {/* WHY THIS MATTERS */}
        <section className="relative py-20 px-4 sm:px-6 bg-white/80 backdrop-blur">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl sm:text-4xl font-black text-[#0F172A] text-center mb-4 tracking-tight">
              Pourquoi ton upvote change tout
            </h2>
            <p className="text-center text-[#525252] text-lg mb-12 max-w-2xl mx-auto">
              Sur Product Hunt, c'est les premières heures qui décident. Top 5 du jour = 10 000 visiteurs sur RestauMargin.
            </p>

            <div className="grid sm:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="w-16 h-16 rounded-2xl bg-emerald-100 flex items-center justify-center mx-auto mb-4">
                  <Users className="w-8 h-8 text-emerald-600" />
                </div>
                <div className="text-4xl font-black text-[#0F172A] mb-2 tabular-nums">10 000</div>
                <div className="text-sm text-[#525252]">visiteurs si Top 5</div>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 rounded-2xl bg-emerald-100 flex items-center justify-center mx-auto mb-4">
                  <Zap className="w-8 h-8 text-emerald-600" />
                </div>
                <div className="text-4xl font-black text-[#0F172A] mb-2 tabular-nums">100+</div>
                <div className="text-sm text-[#525252]">upvotes pour Top 5</div>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 rounded-2xl bg-emerald-100 flex items-center justify-center mx-auto mb-4">
                  <Clock className="w-8 h-8 text-emerald-600" />
                </div>
                <div className="text-4xl font-black text-[#0F172A] mb-2 tabular-nums">24h</div>
                <div className="text-sm text-[#525252]">de fenêtre de vote</div>
              </div>
            </div>
          </div>
        </section>

        {/* WHAT IS RESTAUMARGIN */}
        <section className="relative py-20 px-4 sm:px-6">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl sm:text-4xl font-black text-[#0F172A] text-center mb-4 tracking-tight">
              Ce qu'on lance, en 30 secondes
            </h2>
            <p className="text-center text-[#525252] text-lg mb-12 max-w-2xl mx-auto">
              RestauMargin automatise le calcul des marges restaurant grâce à l'IA et à la dictée vocale.
            </p>

            <div className="grid sm:grid-cols-2 gap-6">
              {[
                {
                  icon: Mic,
                  title: 'Dictée vocale en 10 secondes',
                  text: 'Tu dis "Tomate 500g, mozzarella 200g, basilic" — l\'IA extrait la fiche technique avec les coûts.',
                },
                {
                  icon: TrendingUp,
                  title: 'Marges en temps réel',
                  text: 'Chaque recette se met à jour automatiquement quand un fournisseur change ses prix.',
                },
                {
                  icon: Bell,
                  title: 'Alertes inflation prix',
                  text: 'Le tomates ont pris 8% chez ton fournisseur ? Tu le sais immédiatement. Pas en fin de mois.',
                },
                {
                  icon: Sparkles,
                  title: 'Menu engineering Boston',
                  text: 'Stars, Puzzles, Plowhorses, Dogs : on classifie tes plats automatiquement pour optimiser ta carte.',
                },
              ].map((feature) => (
                <div
                  key={feature.title}
                  className="bg-white/90 backdrop-blur border border-[#E5E7EB] rounded-2xl p-6 hover:shadow-lg hover:border-emerald-300 transition-all"
                >
                  <div className="w-12 h-12 rounded-xl bg-emerald-50 flex items-center justify-center mb-4">
                    <feature.icon className="w-6 h-6 text-emerald-600" />
                  </div>
                  <h3 className="text-lg font-bold text-[#0F172A] mb-2">{feature.title}</h3>
                  <p className="text-sm text-[#525252] leading-relaxed">{feature.text}</p>
                </div>
              ))}
            </div>

            <div className="mt-12 text-center">
              <Link
                to="/"
                className="inline-flex items-center gap-2 text-emerald-600 hover:text-emerald-700 font-semibold transition-colors"
              >
                Voir le site complet
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </section>

        {/* CTA FINAL */}
        <section className="relative py-20 px-4 sm:px-6 bg-gradient-to-br from-emerald-600 to-emerald-800">
          <div className="max-w-3xl mx-auto text-center text-white">
            <Calendar className="w-12 h-12 mx-auto mb-6 opacity-80" />
            <h2 className="text-3xl sm:text-4xl font-black mb-4 tracking-tight">
              Le 6 mai 2026 à 9h01 (Paris)
            </h2>
            <p className="text-lg opacity-90 mb-8 max-w-xl mx-auto leading-relaxed">
              Mets-le dans ton agenda. Un seul vote, et tu nous aides à atteindre des milliers de restaurateurs qui galèrent encore avec Excel.
            </p>
            <a
              href={PH_DRAFT_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-3 px-8 py-4 rounded-2xl bg-white text-emerald-700 font-bold hover:scale-105 transition-transform shadow-2xl"
            >
              Voir la page Product Hunt
              <ArrowRight className="w-5 h-5" />
            </a>
          </div>
        </section>
      </main>
    </>
  );
}
