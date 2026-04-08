import { useState, useEffect, useCallback } from 'react';
import {
  Crown, Zap, Check, X, ChevronDown, ChevronLeft, ChevronRight,
  Rocket, Building2, CreditCard,
  HelpCircle, ArrowRight, Sparkles,
  TrendingUp, Users, Calculator,
  Quote, Star, Shield, Clock, Database,
  BarChart3, Cpu, Download, Globe, Headphones,
  SlidersHorizontal,
} from 'lucide-react';

// ── Types ────────────────────────────────────────────────────────────────────
interface Plan {
  id: string;
  name: string;
  priceMonthly: number;
  priceAnnual: number;
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

interface FeatureRow {
  name: string;
  icon?: React.ReactNode;
  pro: boolean | string;
  business: boolean | string;
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
const PLANS: Plan[] = [
  {
    id: 'pro',
    name: 'Pro',
    priceMonthly: 29,
    priceAnnual: 23,
    description: 'Pour les independants qui veulent maitriser leurs marges',
    icon: <Rocket className="w-6 h-6" />,
    highlighted: true,
    badge: 'Populaire',
    features: [
      'Fiches techniques illimitees avec calcul des marges',
      '19 actions IA : recettes par chat ou commande vocale',
      'Commandes fournisseurs par email et WhatsApp en 1 clic',
      'Scanner de factures IA : photographiez, tout se met a jour',
      'Suivi des prix fournisseurs (Mercuriale) avec alertes',
      'Inventaire avec alertes stock bas',
      'HACCP digital : temperatures, nettoyage, conformite',
      'Messagerie integree avec vos fournisseurs',
      '500 requetes IA par mois',
      'Essai gratuit 7 jours',
    ],
    cta: 'Commencer l\'essai gratuit',
  },
  {
    id: 'business',
    name: 'Business',
    priceMonthly: 79,
    priceAnnual: 63,
    description: 'Pour les groupes qui gerent plusieurs etablissements',
    icon: <Building2 className="w-6 h-6" />,
    features: [
      'Tout du plan Pro',
      'Multi-restaurants : gerez tous vos etablissements',
      '2000 requetes IA par mois',
      'Rapport IA hebdomadaire automatique',
      'Menu Engineering : matrice BCG pour optimiser votre carte',
      'Analyse predictive : previsions de ventes et suggestions prix',
      'Station Balance compatible (tablette + balance Bluetooth)',
      'Acces API pour integrations personnalisees',
      'Support prioritaire',
      'Essai gratuit 7 jours',
    ],
    cta: 'Commencer l\'essai gratuit',
  },
];

const FEATURE_COMPARISON: FeatureRow[] = [
  { name: 'Restaurants', icon: <Globe className="w-4 h-4" />, pro: '1', business: 'Illimite' },
  { name: 'Fiches techniques', icon: <BarChart3 className="w-4 h-4" />, pro: 'Illimite', business: 'Illimite' },
  { name: 'Ingredients', icon: <Database className="w-4 h-4" />, pro: 'Illimite', business: 'Illimite' },
  { name: 'Recettes', icon: <Star className="w-4 h-4" />, pro: 'Illimite', business: 'Illimite' },
  { name: 'Requetes IA / mois', icon: <Cpu className="w-4 h-4" />, pro: '500', business: '2 000' },
  { name: 'Stockage documents', icon: <Database className="w-4 h-4" />, pro: '1 Go', business: '10 Go' },
  { name: 'Commandes fournisseurs', pro: true, business: true },
  { name: 'Scanner de factures IA', pro: true, business: true },
  { name: 'Suivi des prix (Mercuriale)', pro: true, business: true },
  { name: 'Inventaire & alertes', pro: true, business: true },
  { name: 'HACCP digital', pro: true, business: true },
  { name: 'Messagerie fournisseurs', pro: true, business: true },
  { name: 'Commande vocale', pro: true, business: true },
  { name: 'Exports CSV / PDF', icon: <Download className="w-4 h-4" />, pro: true, business: true },
  { name: 'Rapport IA hebdomadaire', pro: false, business: true },
  { name: 'Menu Engineering (BCG)', pro: false, business: true },
  { name: 'Analyse predictive', pro: false, business: true },
  { name: 'Station Balance', pro: false, business: true },
  { name: 'Acces API', icon: <Globe className="w-4 h-4" />, pro: false, business: true },
  { name: 'Multi-restaurant', pro: false, business: true },
  { name: 'Support', icon: <Headphones className="w-4 h-4" />, pro: 'Email', business: 'Prioritaire' },
];

const FAQ_ITEMS: FAQItem[] = [
  {
    question: 'Puis-je annuler a tout moment ?',
    answer:
      'Oui, zero engagement. Vous annulez quand vous voulez depuis votre espace abonnement. Vos donnees restent accessibles 30 jours apres annulation.',
  },
  {
    question: 'Comment fonctionne le paiement ?',
    answer:
      'Le paiement se fait par carte bancaire via Stripe, la plateforme de paiement la plus securisee au monde. Vous pouvez aussi payer par virement SEPA pour les plans annuels.',
  },
  {
    question: 'Y a-t-il un engagement ?',
    answer:
      'Non, aucun engagement. Le plan mensuel se renouvelle chaque mois. Le plan annuel vous fait economiser 20% et se renouvelle chaque annee.',
  },
  {
    question: 'Que se passe-t-il apres le trial de 7 jours ?',
    answer:
      'Si vous ne souscrivez pas, votre compte passe en lecture seule. Vos donnees sont conservees 30 jours. Vous pouvez reactiver a tout moment sans perdre vos donnees.',
  },
  {
    question: 'Puis-je changer de plan ?',
    answer:
      'Oui, passez du Pro au Business (ou l\'inverse) quand vous voulez. Le changement est immediat et le montant est ajuste au prorata.',
  },
  {
    question: 'C\'est quoi les requetes IA ?',
    answer:
      'Chaque utilisation de l\'IA (creer une recette, scanner une facture, poser une question) consomme une requete. Le Pro inclut 500/mois, le Business 2000/mois. Les requetes non-utilisees ne se cumulent pas.',
  },
];

const TESTIMONIALS: Testimonial[] = [
  {
    name: 'Sophie Martin',
    restaurant: 'Le Petit Bistrot',
    city: 'Lyon',
    quote: 'En 3 mois, on a reduit notre food cost de 34% a 28%. RestauMargin a change notre maniere de gerer les achats. Le scanner de factures nous fait gagner 2h par semaine.',
    rating: 5,
    initials: 'SM',
  },
  {
    name: 'Karim Benali',
    restaurant: 'Dar Essalam',
    city: 'Paris',
    quote: 'Avec 3 restaurants, le plan Business est indispensable. Les rapports IA hebdomadaires me montrent exactement ou je perds de l\'argent. ROI en moins d\'un mois.',
    rating: 5,
    initials: 'KB',
  },
  {
    name: 'Marie Dupont',
    restaurant: 'La Table de Marie',
    city: 'Bordeaux',
    quote: 'L\'IA m\'a suggere des recettes alternatives qui ont reduit mes couts de 18% sans changer le gout. Mes clients ne voient pas la difference, mon comptable si.',
    rating: 5,
    initials: 'MD',
  },
];

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
  const [isAnnual, setIsAnnual] = useState(false);
  const [testimonialIndex, setTestimonialIndex] = useState(0);
  const [roiCouverts, setRoiCouverts] = useState(80);
  const [roiPrixMoyen, setRoiPrixMoyen] = useState(22);

  // Simulated subscription state
  const isSubscribed = true;
  const currentPlanId = 'pro';
  const nextBillingDate = '15 mai 2026';

  // Auto-rotate testimonials
  useEffect(() => {
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

  const handleSubscribe = async (planId: string) => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('/api/stripe/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ planId, annual: isAnnual }),
      });
      const data = await res.json();
      if (data.url) window.location.href = data.url;
    } catch {
      // silent
    }
  };

  // ROI Calculator logic
  const roiFoodCostSavingsPercent = 0.06; // 6% food cost reduction on average
  const avgFoodCostPercent = 0.32;
  const dailyRevenue = roiCouverts * roiPrixMoyen;
  const monthlySavings = Math.round(dailyRevenue * 30 * avgFoodCostPercent * roiFoodCostSavingsPercent);
  const annualSavings = monthlySavings * 12;

  const currentPlan = PLANS.find((p) => p.id === currentPlanId);

  return (
    <div className="min-h-screen bg-white dark:bg-black pb-20">

      {/* ================================================================== */}
      {/* 7. CURRENT PLAN BANNER                                             */}
      {/* ================================================================== */}
      {isSubscribed && currentPlan && (
        <div className="bg-white dark:bg-black border-b border-[#E5E7EB] dark:border-[#1A1A1A]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            {/* Top row */}
            <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-2xl bg-gradient-to-br from-teal-500/10 to-indigo-500/10 border border-teal-500/20">
                  <Crown className="w-6 h-6 text-teal-500" />
                </div>
                <div>
                  <div className="flex items-center gap-3">
                    <h1 className="text-xl font-bold text-[#111111] dark:text-white">
                      Plan {currentPlan.name}
                    </h1>
                    <span className="px-2.5 py-0.5 text-xs font-bold rounded-full bg-teal-500/10 text-teal-600 dark:text-teal-400 border border-teal-500/20">
                      Actif
                    </span>
                  </div>
                  <div className="flex items-center gap-4 mt-1 text-sm text-[#6B7280] dark:text-[#A3A3A3]">
                    <span className="flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5" />
                      Prochain paiement : {nextBillingDate}
                    </span>
                    <span className="hidden sm:inline w-1 h-1 rounded-full bg-[#D1D5DB] dark:bg-[#404040]" />
                    <span className="hidden sm:inline">
                      {isAnnual ? `${currentPlan.priceAnnual}\u20AC/mois (annuel)` : `${currentPlan.priceMonthly}\u20AC/mois`}
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={handleStripePortal}
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#111111] dark:bg-white text-white dark:text-black font-medium rounded-2xl transition-all hover:bg-[#333333] dark:hover:bg-[#E5E5E5]"
                >
                  <CreditCard className="w-4 h-4" />
                  Gerer mon abonnement
                </button>
                {currentPlanId === 'pro' && (
                  <button
                    onClick={() => handleSubscribe('business')}
                    className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-teal-600 to-indigo-600 hover:from-teal-700 hover:to-indigo-700 text-white font-medium rounded-2xl shadow-lg shadow-teal-500/25 transition-all duration-200 hover:shadow-xl hover:shadow-teal-500/30 hover:-translate-y-0.5"
                  >
                    <Zap className="w-4 h-4" />
                    Passer au Business
                  </button>
                )}
              </div>
            </div>

            {/* Usage stats bars */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
              {USAGE_STATS.map((stat) => {
                const percentage = stat.max ? Math.min((stat.used / stat.max) * 100, 100) : 5;
                const displayMax = stat.max ? `${stat.max}${stat.unit ? ` ${stat.unit}` : ''}` : stat.unit || 'illimite';
                const displayUsed = `${stat.used}${stat.unit && stat.max ? ` ${stat.unit}` : ''}`;
                return (
                  <div
                    key={stat.label}
                    className="bg-[#FAFAFA] dark:bg-[#0A0A0A] border border-[#E5E7EB] dark:border-[#1A1A1A] rounded-2xl p-4"
                  >
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-xs font-medium text-[#6B7280] dark:text-[#A3A3A3]">
                        {stat.label}
                      </span>
                      <span className="text-xs font-bold text-[#111111] dark:text-white">
                        {displayUsed} / {displayMax}
                      </span>
                    </div>
                    <div className="h-2 bg-[#E5E7EB] dark:bg-[#1A1A1A] rounded-full overflow-hidden">
                      <div
                        className={`h-full ${stat.color} rounded-full transition-all duration-700`}
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* ================================================================ */}
        {/* 1. PLAN COMPARISON CARDS + MONTHLY/ANNUAL TOGGLE                  */}
        {/* ================================================================ */}
        <div className="text-center mt-12 mb-4">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-teal-500/10 text-teal-600 dark:text-teal-400 text-xs font-bold mb-4">
            <Sparkles className="w-3.5 h-3.5" />
            Tarifs simples, sans surprise
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold text-[#111111] dark:text-white">
            Choisissez votre plan
          </h2>
          <p className="mt-3 text-lg text-[#6B7280] dark:text-[#A3A3A3] max-w-2xl mx-auto">
            Concu pour les restaurateurs, pas les developpeurs.
            Simple, direct, efficace.
          </p>
        </div>

        {/* Monthly / Annual toggle */}
        <div className="flex items-center justify-center gap-4 mb-10">
          <span className={`text-sm font-medium transition-colors ${!isAnnual ? 'text-[#111111] dark:text-white' : 'text-[#9CA3AF] dark:text-[#737373]'}`}>
            Mensuel
          </span>
          <button
            onClick={() => setIsAnnual(!isAnnual)}
            className={`relative w-14 h-7 rounded-full transition-colors duration-300 ${
              isAnnual ? 'bg-teal-500' : 'bg-[#D1D5DB] dark:bg-[#404040]'
            }`}
          >
            <div
              className={`absolute top-0.5 w-6 h-6 bg-white rounded-full shadow-md transition-transform duration-300 ${
                isAnnual ? 'translate-x-7' : 'translate-x-0.5'
              }`}
            />
          </button>
          <span className={`text-sm font-medium transition-colors ${isAnnual ? 'text-[#111111] dark:text-white' : 'text-[#9CA3AF] dark:text-[#737373]'}`}>
            Annuel
          </span>
          {isAnnual && (
            <span className="px-2.5 py-1 text-xs font-bold rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
              -20%
            </span>
          )}
        </div>

        {/* Plan cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8 max-w-4xl mx-auto">
          {PLANS.map((plan) => {
            const price = isAnnual ? plan.priceAnnual : plan.priceMonthly;
            const isCurrentPlan = isSubscribed && plan.id === currentPlanId;

            return (
              <div
                key={plan.id}
                className={`relative rounded-2xl border-2 bg-white dark:bg-[#0A0A0A] overflow-hidden transition-all duration-300 hover:shadow-xl ${
                  plan.highlighted
                    ? 'border-teal-500 dark:border-teal-400 shadow-xl shadow-teal-500/10 md:-translate-y-2 md:scale-[1.02] z-10'
                    : 'border-[#E5E7EB] dark:border-[#1A1A1A] shadow-sm hover:-translate-y-1'
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
                        : 'bg-[#F3F4F6] dark:bg-[#171717] text-[#6B7280] dark:text-[#A3A3A3]'
                    }`}
                  >
                    {plan.icon}
                  </div>
                  <h3 className="mt-4 text-xl font-bold text-[#111111] dark:text-white">
                    {plan.name}
                  </h3>
                  <p className="mt-1 text-sm text-[#6B7280] dark:text-[#A3A3A3]">
                    {plan.description}
                  </p>
                  <div className="mt-4 flex items-baseline gap-1">
                    <span className="text-4xl font-extrabold text-[#111111] dark:text-white">
                      {price}&euro;
                    </span>
                    <span className="text-[#6B7280] dark:text-[#A3A3A3]">/mois</span>
                    {isAnnual && (
                      <span className="ml-2 text-sm line-through text-[#9CA3AF] dark:text-[#737373]">
                        {plan.priceMonthly}&euro;
                      </span>
                    )}
                  </div>
                  {isAnnual && (
                    <p className="mt-1 text-xs text-emerald-600 dark:text-emerald-400 font-medium">
                      Soit {price * 12}&euro;/an au lieu de {plan.priceMonthly * 12}&euro;
                    </p>
                  )}
                </div>

                {/* Divider */}
                <div className="mx-6 border-t border-[#E5E7EB] dark:border-[#1A1A1A]" />

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
                        <span className="text-sm text-[#374151] dark:text-[#D4D4D4]">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  {/* CTA */}
                  <button
                    onClick={() => isCurrentPlan ? handleStripePortal() : handleSubscribe(plan.id)}
                    className={`mt-8 w-full py-3.5 px-4 rounded-2xl font-semibold text-sm transition-all duration-200 ${
                      isCurrentPlan
                        ? 'bg-[#F3F4F6] dark:bg-[#171717] text-[#6B7280] dark:text-[#A3A3A3] cursor-default'
                        : plan.highlighted
                          ? 'bg-gradient-to-r from-teal-600 to-indigo-600 hover:from-teal-700 hover:to-indigo-700 text-white shadow-lg shadow-teal-500/25 hover:shadow-xl hover:shadow-teal-500/30 hover:-translate-y-0.5'
                          : 'bg-[#111111] dark:bg-white hover:bg-[#333333] dark:hover:bg-[#E5E5E5] text-white dark:text-black hover:-translate-y-0.5'
                    }`}
                  >
                    <span className="inline-flex items-center gap-2">
                      {isCurrentPlan ? 'Plan actuel' : plan.cta}
                      {!isCurrentPlan && <ArrowRight className="w-4 h-4" />}
                    </span>
                  </button>
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
            <h2 className="text-2xl font-bold text-[#111111] dark:text-white">
              Votre consommation ce mois
            </h2>
            <p className="mt-2 text-sm text-[#6B7280] dark:text-[#A3A3A3]">
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
                  className={`bg-white dark:bg-[#0A0A0A] border rounded-2xl p-5 transition-all ${
                    isCritical
                      ? 'border-red-300 dark:border-red-800'
                      : isWarning
                        ? 'border-amber-300 dark:border-amber-800'
                        : 'border-[#E5E7EB] dark:border-[#1A1A1A]'
                  }`}
                >
                  <div className="flex justify-between items-start mb-4">
                    <span className="text-sm font-semibold text-[#111111] dark:text-white">
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
                    <span className="text-2xl font-bold text-[#111111] dark:text-white">{displayUsed}</span>
                    <span className="text-sm text-[#6B7280] dark:text-[#A3A3A3]">/ {displayMax}</span>
                  </div>
                  <div className="h-2.5 bg-[#E5E7EB] dark:bg-[#1A1A1A] rounded-full overflow-hidden">
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
                    <p className="mt-2 text-xs text-[#9CA3AF] dark:text-[#737373]">
                      {Math.round(percentage)}% utilise
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* ================================================================ */}
        {/* 2. FEATURE COMPARISON TABLE                                       */}
        {/* ================================================================ */}
        <div className="mt-20">
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-purple-500/10 text-purple-600 dark:text-purple-400 text-xs font-bold mb-3">
              <Shield className="w-3.5 h-3.5" />
              Comparatif
            </div>
            <h2 className="text-2xl font-bold text-[#111111] dark:text-white">
              Ce qui est inclus dans chaque plan
            </h2>
          </div>

          <div className="overflow-x-auto rounded-2xl border border-[#E5E7EB] dark:border-[#1A1A1A] bg-white dark:bg-[#0A0A0A] shadow-sm max-w-5xl mx-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-[#E5E7EB] dark:border-[#1A1A1A]">
                  <th className="text-left py-4 px-6 text-sm font-semibold text-[#6B7280] dark:text-[#A3A3A3] w-[45%]">
                    Fonctionnalite
                  </th>
                  <th className="text-center py-4 px-4">
                    <div className="flex flex-col items-center gap-1">
                      <div className="p-1.5 rounded-xl bg-teal-500/10">
                        <Rocket className="w-4 h-4 text-teal-600 dark:text-teal-400" />
                      </div>
                      <span className="text-sm font-bold text-teal-600 dark:text-teal-400">Pro</span>
                      <span className="text-xs text-[#9CA3AF] dark:text-[#737373]">{isAnnual ? '23' : '29'}&euro;/mois</span>
                    </div>
                  </th>
                  <th className="text-center py-4 px-4">
                    <div className="flex flex-col items-center gap-1">
                      <div className="p-1.5 rounded-xl bg-purple-500/10">
                        <Building2 className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                      </div>
                      <span className="text-sm font-bold text-purple-600 dark:text-purple-400">Business</span>
                      <span className="text-xs text-[#9CA3AF] dark:text-[#737373]">{isAnnual ? '63' : '79'}&euro;/mois</span>
                    </div>
                  </th>
                </tr>
              </thead>
              <tbody>
                {FEATURE_COMPARISON.map((row, i) => (
                  <tr
                    key={i}
                    className={`border-b border-[#F3F4F6] dark:border-[#111111] last:border-b-0 ${
                      i % 2 === 0
                        ? 'bg-[#FAFAFA]/50 dark:bg-[#050505]'
                        : 'bg-white dark:bg-[#0A0A0A]'
                    }`}
                  >
                    <td className="py-3.5 px-6 text-sm text-[#374151] dark:text-[#D4D4D4] font-medium">
                      <span className="inline-flex items-center gap-2">
                        {row.icon && <span className="text-[#9CA3AF] dark:text-[#737373]">{row.icon}</span>}
                        {row.name}
                      </span>
                    </td>
                    {(['pro', 'business'] as const).map((plan) => (
                      <td key={plan} className="py-3.5 px-4 text-center">
                        {typeof row[plan] === 'boolean' ? (
                          row[plan] ? (
                            <div className="inline-flex p-1 rounded-full bg-emerald-500/10">
                              <Check className="w-4 h-4 text-emerald-500" />
                            </div>
                          ) : (
                            <div className="inline-flex p-1 rounded-full bg-[#F3F4F6] dark:bg-[#171717]">
                              <X className="w-4 h-4 text-[#D1D5DB] dark:text-[#404040]" />
                            </div>
                          )
                        ) : (
                          <span
                            className={`text-sm font-semibold ${
                              plan === 'pro'
                                ? 'text-teal-600 dark:text-teal-400'
                                : 'text-purple-600 dark:text-purple-400'
                            }`}
                          >
                            {row[plan]}
                          </span>
                        )}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
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
            <h2 className="text-2xl font-bold text-[#111111] dark:text-white">
              Combien RestauMargin vous fait economiser ?
            </h2>
            <p className="mt-2 text-sm text-[#6B7280] dark:text-[#A3A3A3]">
              En moyenne, nos clients reduisent leur food cost de 6%
            </p>
          </div>

          <div className="max-w-3xl mx-auto bg-white dark:bg-[#0A0A0A] border border-[#E5E7EB] dark:border-[#1A1A1A] rounded-2xl p-6 sm:p-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
              {/* Slider: couverts/jour */}
              <div>
                <div className="flex justify-between items-center mb-3">
                  <label className="text-sm font-medium text-[#374151] dark:text-[#D4D4D4] flex items-center gap-2">
                    <Users className="w-4 h-4 text-[#6B7280] dark:text-[#A3A3A3]" />
                    Couverts / jour
                  </label>
                  <span className="text-sm font-bold text-[#111111] dark:text-white bg-[#F3F4F6] dark:bg-[#171717] px-3 py-1 rounded-xl">
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
                  className="w-full h-2 rounded-full appearance-none cursor-pointer bg-[#E5E7EB] dark:bg-[#1A1A1A] accent-teal-500"
                />
                <div className="flex justify-between text-xs text-[#9CA3AF] dark:text-[#737373] mt-1">
                  <span>20</span>
                  <span>500</span>
                </div>
              </div>

              {/* Slider: prix moyen plat */}
              <div>
                <div className="flex justify-between items-center mb-3">
                  <label className="text-sm font-medium text-[#374151] dark:text-[#D4D4D4] flex items-center gap-2">
                    <SlidersHorizontal className="w-4 h-4 text-[#6B7280] dark:text-[#A3A3A3]" />
                    Prix moyen plat
                  </label>
                  <span className="text-sm font-bold text-[#111111] dark:text-white bg-[#F3F4F6] dark:bg-[#171717] px-3 py-1 rounded-xl">
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
                  className="w-full h-2 rounded-full appearance-none cursor-pointer bg-[#E5E7EB] dark:bg-[#1A1A1A] accent-teal-500"
                />
                <div className="flex justify-between text-xs text-[#9CA3AF] dark:text-[#737373] mt-1">
                  <span>8&euro;</span>
                  <span>60&euro;</span>
                </div>
              </div>
            </div>

            {/* Divider */}
            <div className="my-6 border-t border-[#E5E7EB] dark:border-[#1A1A1A]" />

            {/* Results */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="text-center p-4 bg-[#FAFAFA] dark:bg-[#050505] rounded-2xl border border-[#E5E7EB] dark:border-[#1A1A1A]">
                <p className="text-xs text-[#6B7280] dark:text-[#A3A3A3] mb-1">CA mensuel estime</p>
                <p className="text-xl font-bold text-[#111111] dark:text-white">
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

            <p className="mt-4 text-center text-xs text-[#9CA3AF] dark:text-[#737373]">
              Estimation basee sur une reduction moyenne de 6% du food cost (32% moyen en restauration)
            </p>
          </div>
        </div>

        {/* ================================================================ */}
        {/* 5. TESTIMONIAL SLIDER                                            */}
        {/* ================================================================ */}
        <div className="mt-20">
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 text-xs font-bold mb-3">
              <Quote className="w-3.5 h-3.5" />
              Temoignages
            </div>
            <h2 className="text-2xl font-bold text-[#111111] dark:text-white">
              Ils utilisent RestauMargin au quotidien
            </h2>
          </div>

          <div className="max-w-3xl mx-auto relative">
            {/* Main testimonial card */}
            <div className="bg-white dark:bg-[#0A0A0A] border border-[#E5E7EB] dark:border-[#1A1A1A] rounded-2xl p-8 transition-all duration-500">
              {/* Stars */}
              <div className="flex gap-1 mb-4">
                {[...Array(TESTIMONIALS[testimonialIndex].rating)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 text-amber-400 fill-amber-400" />
                ))}
              </div>

              {/* Quote */}
              <p className="text-lg text-[#374151] dark:text-[#D4D4D4] leading-relaxed mb-6 italic">
                &laquo; {TESTIMONIALS[testimonialIndex].quote} &raquo;
              </p>

              {/* Author */}
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-teal-500 to-indigo-500 flex items-center justify-center text-white font-bold text-sm">
                  {TESTIMONIALS[testimonialIndex].initials}
                </div>
                <div>
                  <p className="font-semibold text-[#111111] dark:text-white">
                    {TESTIMONIALS[testimonialIndex].name}
                  </p>
                  <p className="text-sm text-[#6B7280] dark:text-[#A3A3A3]">
                    {TESTIMONIALS[testimonialIndex].restaurant} — {TESTIMONIALS[testimonialIndex].city}
                  </p>
                </div>
              </div>
            </div>

            {/* Navigation */}
            <div className="flex items-center justify-center gap-4 mt-6">
              <button
                onClick={() => setTestimonialIndex((prev) => (prev - 1 + TESTIMONIALS.length) % TESTIMONIALS.length)}
                className="p-2 rounded-xl bg-[#F3F4F6] dark:bg-[#171717] hover:bg-[#E5E7EB] dark:hover:bg-[#1A1A1A] transition-colors"
              >
                <ChevronLeft className="w-4 h-4 text-[#6B7280] dark:text-[#A3A3A3]" />
              </button>
              <div className="flex gap-2">
                {TESTIMONIALS.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setTestimonialIndex(i)}
                    className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                      i === testimonialIndex
                        ? 'bg-teal-500 w-6'
                        : 'bg-[#D1D5DB] dark:bg-[#404040] hover:bg-[#9CA3AF] dark:hover:bg-[#525252]'
                    }`}
                  />
                ))}
              </div>
              <button
                onClick={() => setTestimonialIndex((prev) => (prev + 1) % TESTIMONIALS.length)}
                className="p-2 rounded-xl bg-[#F3F4F6] dark:bg-[#171717] hover:bg-[#E5E7EB] dark:hover:bg-[#1A1A1A] transition-colors"
              >
                <ChevronRight className="w-4 h-4 text-[#6B7280] dark:text-[#A3A3A3]" />
              </button>
            </div>
          </div>
        </div>

        {/* ================================================================ */}
        {/* 6. FAQ SECTION                                                   */}
        {/* ================================================================ */}
        <div className="mt-20 max-w-3xl mx-auto">
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-teal-500/10 text-teal-600 dark:text-teal-400 text-xs font-bold mb-3">
              <HelpCircle className="w-3.5 h-3.5" />
              FAQ
            </div>
            <h2 className="text-2xl font-bold text-[#111111] dark:text-white">
              Questions frequentes
            </h2>
          </div>

          <div className="space-y-3">
            {FAQ_ITEMS.map((item, index) => (
              <div
                key={index}
                className="bg-white dark:bg-[#0A0A0A] rounded-2xl border border-[#E5E7EB] dark:border-[#1A1A1A] overflow-hidden transition-all duration-200 hover:border-[#D1D5DB] dark:hover:border-[#2A2A2A]"
              >
                <button
                  onClick={() => toggleFAQ(index)}
                  className="flex items-center justify-between w-full px-6 py-4 text-left"
                >
                  <span className="text-sm font-semibold text-[#111111] dark:text-white pr-4">
                    {item.question}
                  </span>
                  <ChevronDown
                    className={`w-5 h-5 flex-shrink-0 text-[#9CA3AF] dark:text-[#737373] transition-transform duration-200 ${
                      openFAQ === index ? 'rotate-180' : ''
                    }`}
                  />
                </button>
                <div
                  className={`overflow-hidden transition-all duration-300 ${
                    openFAQ === index ? 'max-h-48 opacity-100' : 'max-h-0 opacity-0'
                  }`}
                >
                  <p className="px-6 pb-4 text-sm text-[#6B7280] dark:text-[#A3A3A3] leading-relaxed">
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
            <h3 className="text-xl font-bold text-[#111111] dark:text-white">
              Besoin d'aide pour choisir ?
            </h3>
            <p className="mt-2 text-sm text-[#6B7280] dark:text-[#A3A3A3] max-w-md">
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
