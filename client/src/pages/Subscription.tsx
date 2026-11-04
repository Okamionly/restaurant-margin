import { useState, useEffect, useCallback } from 'react';
import {
  Crown, Check, ChevronDown, ChevronLeft, ChevronRight,
  Rocket, CreditCard,
  HelpCircle, ArrowRight, Sparkles,
  TrendingUp, Users, Calculator,
  Quote, Star, Clock,
  BarChart3,
  SlidersHorizontal,
} from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

// ── Types ────────────────────────────────────────────────────────────────────
interface Plan {
  id: string;
  name: string;
  priceMonthly: number;
  description: string;
  icon: React.ReactNode;
  features: string[];
  highlighted?: boolean;
  badge?: string;
  cta: string;
  ctaAction?: () => void;
}

interface FAQItem {
  question: string;
  answer: string;
}

interface Testimonial {
  name: string;
  restaurant: string;
  city: string;
  quote: string;
  rating: number;
  initials: string;
}

interface UsageStat {
  label: string;
  used: number;
  max: number | null;
  unit?: string;
  color: string;
}

// ── Data ─────────────────────────────────────────────────────────────────────
// 2026-11-04 : offre unique (decision du fondateur). Un seul plan, 19 € par mois,
// toutes les fonctionnalites, sans engagement. Le checkout Stripe vend ce prix
// quel que soit le planId ; on envoie 'pro', le plan interne.
const PLANS: Plan[] = [
  {
    id: 'pro',
    name: 'RestauMargin',
    priceMonthly: 19,
    description: 'Toutes les fonctionnalités, pour un ou plusieurs établissements',
    icon: <Rocket className="w-6 h-6" />,
    highlighted: true,
    badge: 'Offre unique',
    features: [
      'Fiches techniques illimitées avec calcul des marges',
      '19 actions IA : recettes par chat ou commande vocale',
      '500 requêtes IA par mois',
      'Lecture des factures par IA : les prix se mettent à jour',
      'Commandes fournisseurs par e-mail et WhatsApp',
      'Suivi des prix fournisseurs (Mercuriale) avec alertes',
      'Inventaire avec alertes de stock bas',
      'HACCP numérique : températures, nettoyage, traçabilité',
      'Ingénierie de menu (matrice BCG)',
      'Plusieurs établissements dans un seul compte',
      'Station de pesée (tablette + balance Bluetooth)',
      'Support par e-mail',
    ],
    cta: 'S\'abonner — 19 € par mois',
  },
];

const FAQ_ITEMS: FAQItem[] = [
  {
    question: 'Puis-je résilier à tout moment ?',
    answer:
      'Oui, sans engagement. Vous résiliez quand vous voulez depuis votre espace abonnement ; la résiliation prend effet à la fin du mois en cours (CGV, article 4.2).',
  },
  {
    question: 'Comment fonctionne le paiement ?',
    answer:
      'Le paiement se fait chaque mois par carte bancaire, via Stripe. Le tarif est de 19 € par mois.',
  },
  {
    question: 'Y a-t-il plusieurs formules ?',
    answer:
      'Non. Il n\'existe qu\'une seule offre, avec toutes les fonctionnalités, que vous ayez un ou plusieurs établissements.',
  },
  {
    question: 'Que se passe-t-il après les 7 jours d\'essai ?',
    answer:
      'Si vous ne vous abonnez pas, votre compte passe en lecture seule. Vous pouvez vous abonner à tout moment pour retrouver l\'accès complet.',
  },
  {
    question: 'C\'est quoi les requêtes IA ?',
    answer:
      'Chaque utilisation de l\'IA (créer une recette, lire une facture, poser une question) consomme une requête. L\'abonnement inclut 500 requêtes par mois ; les requêtes non utilisées ne se cumulent pas.',
  },
];

// FIX 2026-09-24 : ce tableau contenait des temoignages nominatifs ENTIEREMENT
// INVENTES (nom, etablissement, ville, citation et resultats chiffres), alors que
// la base compte une vingtaine de comptes et aucun abonne payant. Publier de faux
// avis de consommateurs est une pratique commerciale trompeuse (Code de la
// consommation, art. L121-2 et suivants) — et un prospect qui cherche un de ces
// etablissements et ne le trouve pas est perdu definitivement.
// Vide, pas supprime : y remettre de VRAIS temoignages autorises rallume la section.
const TESTIMONIALS: Testimonial[] = [];

// Simulated usage data (would come from API in production)
const USAGE_STATS: UsageStat[] = [
  { label: 'Appels IA', used: 43, max: 500, color: 'bg-teal-500' },
  { label: 'Ingredients', used: 209, max: null, unit: 'illimite', color: 'bg-emerald-500' },
  { label: 'Recettes', used: 87, max: null, unit: 'illimite', color: 'bg-indigo-500' },
  { label: 'Stockage', used: 12, max: 1024, unit: 'Mo', color: 'bg-purple-500' },
];

// ── Component ────────────────────────────────────────────────────────────────
export default function Subscription() {
  const [openFAQ, setOpenFAQ] = useState<number | null>(null);
  const [testimonialIndex, setTestimonialIndex] = useState(0);
  const [roiCouverts, setRoiCouverts] = useState(80);
  const [roiPrixMoyen, setRoiPrixMoyen] = useState(22);

  // Real subscription state from auth
  const { user } = useAuth();
  const currentPlanId = user?.plan || 'basic';
  const isSubscribed = currentPlanId === 'pro' || currentPlanId === 'business';

  // Compute trial status for display
  const trialActive = !isSubscribed && user?.trialEndsAt && new Date(user.trialEndsAt) > new Date();
  const trialDaysLeft = user?.trialEndsAt
    ? Math.max(0, Math.ceil((new Date(user.trialEndsAt).getTime() - Date.now()) / (1000 * 60 * 60 * 24)))
    : 0;

  // Auto-rotate testimonials
  useEffect(() => {
    if (TESTIMONIALS.length === 0) return;
    const timer = setInterval(() => {
      setTestimonialIndex((prev) => (prev + 1) % TESTIMONIALS.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const toggleFAQ = useCallback((index: number) => {
    setOpenFAQ((prev) => (prev === index ? null : index));
  }, []);

  const handleStripePortal = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('/api/stripe/portal', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.url) window.location.href = data.url;
    } catch {
      // silent
    }
  };

  const [subscribeLoading, setSubscribeLoading] = useState<string | null>(null);
  const [subscribeError, setSubscribeError] = useState<string | null>(null);

  const handleSubscribe = async (planId: string) => {
    setSubscribeLoading(planId);
    setSubscribeError(null);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('/api/stripe/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ planId }),
      });
      const data = await res.json();
      if (!res.ok) {
        setSubscribeError(data.error || 'Erreur lors de la creation de la session de paiement');
        return;
      }
      if (data.url) {
        window.location.href = data.url;
      } else {
        setSubscribeError('URL de paiement non disponible');
      }
    } catch {
      setSubscribeError('Erreur de connexion au serveur');
    } finally {
      setSubscribeLoading(null);
    }
  };

  // ROI Calculator logic
  const roiFoodCostSavingsPercent = 0.06; // hypothese illustrative (pas une moyenne mesuree)
  const avgFoodCostPercent = 0.32;
  const dailyRevenue = roiCouverts * roiPrixMoyen;
  const monthlySavings = Math.round(dailyRevenue * 30 * avgFoodCostPercent * roiFoodCostSavingsPercent);
  const annualSavings = monthlySavings * 12;

  // Les anciens abonnes « business » ont le meme acces : une seule offre affichee.
  const currentPlan = PLANS[0];

  return (
    <div className="min-h-screen bg-white dark:bg-black pb-20">

      {/* ================================================================== */}
      {/* 7. CURRENT PLAN BANNER                                             */}
      {/* ================================================================== */}
      {/* Show banner for: active subscribers OR users on trial */}
      {(isSubscribed || trialActive) && (() => {
        const planInfo = isSubscribed ? currentPlan : null;
        return (
        <div className="bg-white dark:bg-black border-b border-mono-900 dark:border-mono-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            {/* Top row */}
            <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className={`p-3 rounded-2xl border ${isSubscribed ? 'bg-gradient-to-br from-teal-500/10 to-indigo-500/10 border-teal-500/20' : 'bg-amber-500/10 border-amber-500/20'}`}>
                  <Crown className={`w-6 h-6 ${isSubscribed ? 'text-teal-500' : 'text-amber-500'}`} />
                </div>
                <div>
                  <div className="flex items-center gap-3">
                    <h1 className="text-xl font-bold text-mono-100 dark:text-white">
                      {isSubscribed ? 'Abonnement RestauMargin' : 'Essai gratuit'}
                    </h1>
                    <span className={`px-2.5 py-0.5 text-xs font-bold rounded-full border ${
                      isSubscribed
                        ? 'bg-teal-500/10 text-teal-600 dark:text-teal-400 border-teal-500/20'
                        : 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20'
                    }`}>
                      {isSubscribed ? 'Actif' : `${trialDaysLeft} jour${trialDaysLeft > 1 ? 's' : ''} restant${trialDaysLeft > 1 ? 's' : ''}`}
                    </span>
                  </div>
                  <div className="flex items-center gap-4 mt-1 text-sm text-[#6B7280] dark:text-mono-700">
                    {isSubscribed && planInfo ? (
                      <>
                        <span className="flex items-center gap-1.5">
                          <Clock className="w-3.5 h-3.5" />
                          Abonnement actif
                        </span>
                        <span className="hidden sm:inline w-1 h-1 rounded-full bg-[#D1D5DB] dark:bg-mono-350" />
                        <span className="hidden sm:inline">
                          {`${planInfo.priceMonthly}\u00A0€ par mois`}
                        </span>
                      </>
                    ) : (
                      <span className="flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5" />
                        Expire le {user?.trialEndsAt ? new Date(user.trialEndsAt).toLocaleDateString('fr-FR') : ''}
                      </span>
                    )}
                  </div>
                </div>
              </div>
              <div className="flex gap-3">
                {isSubscribed && (
                  <button
                    onClick={handleStripePortal}
                    className="inline-flex items-center gap-2 px-5 py-2.5 bg-mono-100 dark:bg-white text-white dark:text-black font-medium rounded-2xl transition-all hover:bg-[#333333] dark:hover:bg-[#E5E5E5]"
                  >
                    <CreditCard className="w-4 h-4" />
                    Gérer mon abonnement
                  </button>
                )}
                {!isSubscribed && (
                  <button
                    onClick={() => handleSubscribe('pro')}
                    disabled={subscribeLoading === 'pro'}
                    className="inline-flex items-center gap-2 px-5 py-2.5 bg-teal-600 hover:bg-teal-500 text-white font-medium rounded-2xl shadow-lg shadow-teal-500/25 transition-all duration-200 hover:shadow-xl hover:-translate-y-0.5 disabled:opacity-60 disabled:cursor-wait"
                  >
                    <CreditCard className="w-4 h-4" />
                    {subscribeLoading === 'pro' ? 'Redirection...' : 'S\'abonner — 19 € par mois'}
                  </button>
                )}
              </div>
            </div>

            {/* Usage stats bars — only for paying subscribers */}
            {isSubscribed && (
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
              {USAGE_STATS.map((stat) => {
                const percentage = stat.max ? Math.min((stat.used / stat.max) * 100, 100) : 5;
                const displayMax = stat.max ? `${stat.max}${stat.unit ? ` ${stat.unit}` : ''}` : stat.unit || 'illimite';
                const displayUsed = `${stat.used}${stat.unit && stat.max ? ` ${stat.unit}` : ''}`;
                return (
                  <div
                    key={stat.label}
                    className="bg-mono-1000 dark:bg-mono-50 border border-mono-900 dark:border-mono-200 rounded-2xl p-4"
                  >
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-xs font-medium text-[#6B7280] dark:text-mono-700">
                        {stat.label}
                      </span>
                      <span className="text-xs font-bold text-mono-100 dark:text-white">
                        {displayUsed} / {displayMax}
                      </span>
                    </div>
                    <div className="h-2 bg-mono-900 dark:bg-mono-200 rounded-full overflow-hidden">
                      <div
                        className={`h-full ${stat.color} rounded-full transition-all duration-700`}
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
            )}
          </div>
        </div>
        );
      })()}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* ================================================================ */}
        {/* 1. PLAN COMPARISON CARDS + MONTHLY/ANNUAL TOGGLE                  */}
        {/* ================================================================ */}
        <div className="text-center mt-12 mb-4">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-teal-500/10 text-teal-600 dark:text-teal-400 text-xs font-bold mb-4">
            <Sparkles className="w-3.5 h-3.5" />
            Un seul tarif, sans surprise
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold text-mono-100 dark:text-white">
            Une seule offre, tout compris
          </h2>
          <p className="mt-3 text-lg text-[#6B7280] dark:text-mono-700 max-w-2xl mx-auto">
            19 € par mois, toutes les fonctionnalités, sans engagement.
          </p>
        </div>

        {/* Plan cards */}
        <div className="mt-10 grid grid-cols-1 gap-6 max-w-md mx-auto">
          {PLANS.map((plan) => {
            const price = plan.priceMonthly;
            const isCurrentPlan = isSubscribed;

            return (
              <div
                key={plan.id}
                className={`relative rounded-2xl border-2 bg-white dark:bg-mono-50 overflow-hidden transition-all duration-300 hover:shadow-xl ${
                  plan.highlighted
                    ? 'border-teal-500 dark:border-teal-400 shadow-xl shadow-teal-500/10'
                    : 'border-mono-900 dark:border-mono-200 shadow-sm hover:-translate-y-1'
                }`}
              >
                {/* Badge */}
                {plan.badge && (
                  <div className="absolute top-0 right-0 px-4 py-1.5 text-xs font-bold rounded-bl-2xl bg-gradient-to-r from-teal-600 to-indigo-600 text-white">
                    <Sparkles className="w-3 h-3 inline mr-1 -mt-0.5" />
                    {plan.badge}
                  </div>
                )}

                {/* Header */}
                <div className="px-6 pt-8 pb-6">
                  <div
                    className={`inline-flex p-2.5 rounded-2xl ${
                      plan.highlighted
                        ? 'bg-teal-500/10 text-teal-600 dark:text-teal-400'
                        : 'bg-mono-950 dark:bg-[#171717] text-[#6B7280] dark:text-mono-700'
                    }`}
                  >
                    {plan.icon}
                  </div>
                  <h3 className="mt-4 text-xl font-bold text-mono-100 dark:text-white">
                    {plan.name}
                  </h3>
                  <p className="mt-1 text-sm text-[#6B7280] dark:text-mono-700">
                    {plan.description}
                  </p>
                  <div className="mt-4 flex items-baseline gap-1">
                    <span className="text-4xl font-extrabold text-mono-100 dark:text-white">
                      {price}&nbsp;&euro;
                    </span>
                    <span className="text-[#6B7280] dark:text-mono-700">par mois</span>
                  </div>
                  <p className="mt-1 text-xs text-[#6B7280] dark:text-mono-700">
                    Sans engagement. Essai gratuit 7 jours, sans carte bancaire.
                  </p>
                </div>

                {/* Divider */}
                <div className="mx-6 border-t border-mono-900 dark:border-mono-200" />

                {/* Features */}
                <div className="px-6 py-6">
                  <ul className="space-y-3">
                    {plan.features.map((feature, i) => (
                      <li key={i} className="flex items-start gap-3">
                        <div className={`mt-0.5 p-0.5 rounded-full ${
                          plan.highlighted
                            ? 'bg-teal-500/10'
                            : 'bg-emerald-500/10'
                        }`}>
                          <Check
                            className={`w-3.5 h-3.5 ${
                              plan.highlighted
                                ? 'text-teal-500 dark:text-teal-400'
                                : 'text-emerald-500 dark:text-emerald-400'
                            }`}
                          />
                        </div>
                        <span className="text-sm text-[#374151] dark:text-mono-800">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  {/* CTA */}
                  <button
                    onClick={() => isCurrentPlan ? handleStripePortal() : handleSubscribe(plan.id)}
                    disabled={subscribeLoading === plan.id}
                    className={`mt-8 w-full py-3.5 px-4 rounded-2xl font-semibold text-sm transition-all duration-200 disabled:opacity-60 disabled:cursor-wait ${
                      isCurrentPlan
                        ? 'bg-mono-950 dark:bg-[#171717] text-[#6B7280] dark:text-mono-700 cursor-default'
                        : plan.highlighted
                          ? 'bg-gradient-to-r from-teal-600 to-indigo-600 hover:from-teal-700 hover:to-indigo-700 text-white shadow-lg shadow-teal-500/25 hover:shadow-xl hover:shadow-teal-500/30 hover:-translate-y-0.5'
                          : 'bg-mono-100 dark:bg-white hover:bg-[#333333] dark:hover:bg-[#E5E5E5] text-white dark:text-black hover:-translate-y-0.5'
                    }`}
                  >
                    <span className="inline-flex items-center gap-2">
                      {subscribeLoading === plan.id
                        ? 'Redirection vers Stripe...'
                        : isCurrentPlan ? 'Gérer mon abonnement' : plan.cta}
                      {!isCurrentPlan && !subscribeLoading && <ArrowRight className="w-4 h-4" />}
                    </span>
                  </button>
                  {subscribeError && !isCurrentPlan && (
                    <p className="mt-2 text-xs text-red-500 text-center">{subscribeError}</p>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* ================================================================ */}
        {/* 3. USAGE STATS (detailed section)                                */}
        {/* ================================================================ */}
        <div className="mt-20">
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 text-xs font-bold mb-3">
              <BarChart3 className="w-3.5 h-3.5" />
              Utilisation
            </div>
            <h2 className="text-2xl font-bold text-mono-100 dark:text-white">
              Votre consommation ce mois
            </h2>
            <p className="mt-2 text-sm text-[#6B7280] dark:text-mono-700">
              Suivez votre utilisation en temps reel
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 max-w-5xl mx-auto">
            {USAGE_STATS.map((stat) => {
              const percentage = stat.max ? Math.min((stat.used / stat.max) * 100, 100) : 5;
              const displayMax = stat.max ? `${stat.max}${stat.unit ? ` ${stat.unit}` : ''}` : stat.unit || 'illimite';
              const displayUsed = `${stat.used}${stat.unit && stat.max ? ` ${stat.unit}` : ''}`;
              const isWarning = stat.max && (stat.used / stat.max) > 0.8;
              const isCritical = stat.max && (stat.used / stat.max) > 0.95;

              return (
                <div
                  key={stat.label}
                  className={`bg-white dark:bg-mono-50 border rounded-2xl p-5 transition-all ${
                    isCritical
                      ? 'border-red-300 dark:border-red-800'
                      : isWarning
                        ? 'border-amber-300 dark:border-amber-800'
                        : 'border-mono-900 dark:border-mono-200'
                  }`}
                >
                  <div className="flex justify-between items-start mb-4">
                    <span className="text-sm font-semibold text-mono-100 dark:text-white">
                      {stat.label}
                    </span>
                    {isCritical && (
                      <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-red-500/10 text-red-600 dark:text-red-400">
                        Critique
                      </span>
                    )}
                    {isWarning && !isCritical && (
                      <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400">
                        Attention
                      </span>
                    )}
                  </div>
                  <div className="flex items-baseline gap-1 mb-3">
                    <span className="text-2xl font-bold text-mono-100 dark:text-white">{displayUsed}</span>
                    <span className="text-sm text-[#6B7280] dark:text-mono-700">/ {displayMax}</span>
                  </div>
                  <div className="h-2.5 bg-mono-900 dark:bg-mono-200 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-700 ${
                        isCritical
                          ? 'bg-red-500'
                          : isWarning
                            ? 'bg-amber-500'
                            : stat.color
                      }`}
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                  {stat.max && (
                    <p className="mt-2 text-xs text-[#9CA3AF] dark:text-mono-500">
                      {Math.round(percentage)}% utilise
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* ================================================================ */}
        {/* 4. ROI CALCULATOR                                                */}
        {/* ================================================================ */}
        <div className="mt-20">
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-bold mb-3">
              <Calculator className="w-3.5 h-3.5" />
              Calculateur ROI
            </div>
            <h2 className="text-2xl font-bold text-mono-100 dark:text-white">
              Combien RestauMargin vous fait economiser ?
            </h2>
            <p className="mt-2 text-sm text-[#6B7280] dark:text-mono-700">
              Simulation illustrative : hypothese d'une reduction de 6% du food cost
            </p>
          </div>

          <div className="max-w-3xl mx-auto bg-white dark:bg-mono-50 border border-mono-900 dark:border-mono-200 rounded-2xl p-6 sm:p-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
              {/* Slider: couverts/jour */}
              <div>
                <div className="flex justify-between items-center mb-3">
                  <label className="text-sm font-medium text-[#374151] dark:text-mono-800 flex items-center gap-2">
                    <Users className="w-4 h-4 text-[#6B7280] dark:text-mono-700" />
                    Couverts / jour
                  </label>
                  <span className="text-sm font-bold text-mono-100 dark:text-white bg-mono-950 dark:bg-[#171717] px-3 py-1 rounded-xl">
                    {roiCouverts}
                  </span>
                </div>
                <input
                  type="range"
                  min="20"
                  max="500"
                  step="10"
                  value={roiCouverts}
                  onChange={(e) => setRoiCouverts(Number(e.target.value))}
                  className="w-full h-2 rounded-full appearance-none cursor-pointer bg-mono-900 dark:bg-mono-200 accent-teal-500"
                />
                <div className="flex justify-between text-xs text-[#9CA3AF] dark:text-mono-500 mt-1">
                  <span>20</span>
                  <span>500</span>
                </div>
              </div>

              {/* Slider: prix moyen plat */}
              <div>
                <div className="flex justify-between items-center mb-3">
                  <label className="text-sm font-medium text-[#374151] dark:text-mono-800 flex items-center gap-2">
                    <SlidersHorizontal className="w-4 h-4 text-[#6B7280] dark:text-mono-700" />
                    Prix moyen plat
                  </label>
                  <span className="text-sm font-bold text-mono-100 dark:text-white bg-mono-950 dark:bg-[#171717] px-3 py-1 rounded-xl">
                    {roiPrixMoyen}&euro;
                  </span>
                </div>
                <input
                  type="range"
                  min="8"
                  max="60"
                  step="1"
                  value={roiPrixMoyen}
                  onChange={(e) => setRoiPrixMoyen(Number(e.target.value))}
                  className="w-full h-2 rounded-full appearance-none cursor-pointer bg-mono-900 dark:bg-mono-200 accent-teal-500"
                />
                <div className="flex justify-between text-xs text-[#9CA3AF] dark:text-mono-500 mt-1">
                  <span>8&euro;</span>
                  <span>60&euro;</span>
                </div>
              </div>
            </div>

            {/* Divider */}
            <div className="my-6 border-t border-mono-900 dark:border-mono-200" />

            {/* Results */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="text-center p-4 bg-mono-1000 dark:bg-[#050505] rounded-2xl border border-mono-900 dark:border-mono-200">
                <p className="text-xs text-[#6B7280] dark:text-mono-700 mb-1">CA mensuel estime</p>
                <p className="text-xl font-bold text-mono-100 dark:text-white">
                  {(dailyRevenue * 30).toLocaleString('fr-FR')}&euro;
                </p>
              </div>
              <div className="text-center p-4 bg-emerald-500/5 rounded-2xl border border-emerald-500/20">
                <p className="text-xs text-emerald-600 dark:text-emerald-400 mb-1">Economie / mois</p>
                <p className="text-2xl font-extrabold text-emerald-600 dark:text-emerald-400">
                  +{monthlySavings.toLocaleString('fr-FR')}&euro;
                </p>
              </div>
              <div className="text-center p-4 bg-teal-500/5 rounded-2xl border border-teal-500/20">
                <p className="text-xs text-teal-600 dark:text-teal-400 mb-1">Economie / an</p>
                <p className="text-2xl font-extrabold text-teal-600 dark:text-teal-400">
                  +{annualSavings.toLocaleString('fr-FR')}&euro;
                </p>
              </div>
            </div>

            <p className="mt-4 text-center text-xs text-[#9CA3AF] dark:text-mono-500">
              Simulation basee sur une hypothese de reduction de 6% du food cost (32% moyen en restauration). Resultat non garanti.
            </p>
          </div>
        </div>

        {/* ================================================================ */}
        {/* 5. TESTIMONIAL SLIDER                                            */}
        {/* Rendu seulement s'il existe de vrais temoignages : avec le tableau  */}
        {/* vide, TESTIMONIALS[0].rating plantait la page.                    */}
        {/* ================================================================ */}
        {TESTIMONIALS.length > 0 && (
        <div className="mt-20">
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 text-xs font-bold mb-3">
              <Quote className="w-3.5 h-3.5" />
              Temoignages
            </div>
            <h2 className="text-2xl font-bold text-mono-100 dark:text-white">
              Ils utilisent RestauMargin au quotidien
            </h2>
          </div>

          <div className="max-w-3xl mx-auto relative">
            {/* Main testimonial card */}
            <div className="bg-white dark:bg-mono-50 border border-mono-900 dark:border-mono-200 rounded-2xl p-8 transition-all duration-500">
              {/* Stars */}
              <div className="flex gap-1 mb-4">
                {[...Array(TESTIMONIALS[testimonialIndex].rating)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 text-amber-400 fill-amber-400" />
                ))}
              </div>

              {/* Quote */}
              <p className="text-lg text-[#374151] dark:text-mono-800 leading-relaxed mb-6 italic">
                &laquo; {TESTIMONIALS[testimonialIndex].quote} &raquo;
              </p>

              {/* Author */}
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-teal-500 to-indigo-500 flex items-center justify-center text-white font-bold text-sm">
                  {TESTIMONIALS[testimonialIndex].initials}
                </div>
                <div>
                  <p className="font-semibold text-mono-100 dark:text-white">
                    {TESTIMONIALS[testimonialIndex].name}
                  </p>
                  <p className="text-sm text-[#6B7280] dark:text-mono-700">
                    {TESTIMONIALS[testimonialIndex].restaurant} — {TESTIMONIALS[testimonialIndex].city}
                  </p>
                </div>
              </div>
            </div>

            {/* Navigation */}
            <div className="flex items-center justify-center gap-4 mt-6">
              <button
                onClick={() => setTestimonialIndex((prev) => (prev - 1 + TESTIMONIALS.length) % TESTIMONIALS.length)}
                className="p-2 rounded-xl bg-mono-950 dark:bg-[#171717] hover:bg-mono-900 dark:hover:bg-mono-200 transition-colors"
              >
                <ChevronLeft className="w-4 h-4 text-[#6B7280] dark:text-mono-700" />
              </button>
              <div className="flex gap-2">
                {TESTIMONIALS.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setTestimonialIndex(i)}
                    className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                      i === testimonialIndex
                        ? 'bg-teal-500 w-6'
                        : 'bg-[#D1D5DB] dark:bg-mono-350 hover:bg-[#9CA3AF] dark:hover:bg-mono-400'
                    }`}
                  />
                ))}
              </div>
              <button
                onClick={() => setTestimonialIndex((prev) => (prev + 1) % TESTIMONIALS.length)}
                className="p-2 rounded-xl bg-mono-950 dark:bg-[#171717] hover:bg-mono-900 dark:hover:bg-mono-200 transition-colors"
              >
                <ChevronRight className="w-4 h-4 text-[#6B7280] dark:text-mono-700" />
              </button>
            </div>
          </div>
        </div>
        )}

        {/* ================================================================ */}
        {/* 6. FAQ SECTION                                                   */}
        {/* ================================================================ */}
        <div className="mt-20 max-w-3xl mx-auto">
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-teal-500/10 text-teal-600 dark:text-teal-400 text-xs font-bold mb-3">
              <HelpCircle className="w-3.5 h-3.5" />
              FAQ
            </div>
            <h2 className="text-2xl font-bold text-mono-100 dark:text-white">
              Questions frequentes
            </h2>
          </div>

          <div className="space-y-3">
            {FAQ_ITEMS.map((item, index) => (
              <div
                key={index}
                className="bg-white dark:bg-mono-50 rounded-2xl border border-mono-900 dark:border-mono-200 overflow-hidden transition-all duration-200 hover:border-[#D1D5DB] dark:hover:border-[#2A2A2A]"
              >
                <button
                  onClick={() => toggleFAQ(index)}
                  className="flex items-center justify-between w-full px-6 py-4 text-left"
                >
                  <span className="text-sm font-semibold text-mono-100 dark:text-white pr-4">
                    {item.question}
                  </span>
                  <ChevronDown
                    className={`w-5 h-5 flex-shrink-0 text-[#9CA3AF] dark:text-mono-500 transition-transform duration-200 ${
                      openFAQ === index ? 'rotate-180' : ''
                    }`}
                  />
                </button>
                <div
                  className={`overflow-hidden transition-all duration-300 ${
                    openFAQ === index ? 'max-h-48 opacity-100' : 'max-h-0 opacity-0'
                  }`}
                >
                  <p className="px-6 pb-4 text-sm text-[#6B7280] dark:text-mono-700 leading-relaxed">
                    {item.answer}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ================================================================ */}
        {/* BOTTOM CTA                                                       */}
        {/* ================================================================ */}
        <div className="mt-20 text-center">
          <div className="inline-flex flex-col items-center p-8 sm:p-10 rounded-2xl bg-gradient-to-br from-teal-500/5 to-indigo-500/5 border border-teal-500/10">
            <div className="p-3 rounded-2xl bg-gradient-to-br from-teal-500/10 to-indigo-500/10 mb-4">
              <TrendingUp className="w-8 h-8 text-teal-500" />
            </div>
            <h3 className="text-xl font-bold text-mono-100 dark:text-white">
              Besoin d'aide pour choisir ?
            </h3>
            <p className="mt-2 text-sm text-[#6B7280] dark:text-mono-700 max-w-md">
              On vous explique tout simplement. Ecrivez-nous, on repond vite.
            </p>
            <button className="mt-5 inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-teal-600 to-indigo-600 hover:from-teal-700 hover:to-indigo-700 text-white font-semibold rounded-2xl shadow-lg shadow-teal-500/25 transition-all duration-200 hover:shadow-xl hover:-translate-y-0.5">
              Nous contacter
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
