import { useState } from 'react';
import {
  Crown, Zap, Check, X, ChevronDown,
  Rocket, Building2, CreditCard,
  HelpCircle, ArrowRight, Sparkles,
} from 'lucide-react';

// ── Types ────────────────────────────────────────────────────────────────────
interface Plan {
  id: string;
  name: string;
  price: string;
  period: string;
  description: string;
  icon: React.ReactNode;
  features: string[];
  highlighted?: boolean;
  badge?: string;
  cta: string;
  ctaAction?: () => void;
  gradient: string;
  borderColor: string;
}

interface FAQItem {
  question: string;
  answer: string;
}

// ── Data ─────────────────────────────────────────────────────────────────────
const PLANS: Plan[] = [
  {
    id: 'pro',
    name: 'Pro',
    price: '29\u20AC',
    period: '/mois',
    description: 'Pour les independants qui veulent maitriser leurs marges',
    icon: <Rocket className="w-6 h-6" />,
    highlighted: true,
    badge: 'Recommande',
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
    cta: 'S\'abonner au Pro',
    gradient: 'from-teal-500/10 to-indigo-600/10',
    borderColor: 'border-teal-300 dark:border-teal-600',
  },
  {
    id: 'business',
    name: 'Business',
    price: '79\u20AC',
    period: '/mois',
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
      'Support prioritaire',
      'Essai gratuit 7 jours',
    ],
    cta: 'S\'abonner au Business',
    gradient: 'from-purple-500/10 to-fuchsia-600/10',
    borderColor: 'border-purple-200 dark:border-purple-700',
  },
];

const FAQ_ITEMS: FAQItem[] = [
  {
    question: 'Puis-je changer de plan a tout moment ?',
    answer:
      'Oui, passez du Pro au Business (ou l\'inverse) quand vous voulez. Le changement est immediat et le montant est ajuste au prorata.',
  },
  {
    question: 'Y a-t-il un engagement ?',
    answer:
      'Non, zero engagement. Vous annulez quand vous voulez. Vos donnees restent accessibles 30 jours apres annulation.',
  },
  {
    question: 'Comment fonctionne le scanner de factures ?',
    answer:
      'Prenez votre facture en photo. L\'IA lit les prix, les quantites et met a jour automatiquement votre mercuriale et vos couts ingredients. Simple comme ca.',
  },
  {
    question: 'C\'est quoi les requetes IA ?',
    answer:
      'Chaque utilisation de l\'IA (creer une recette, scanner une facture, poser une question) consomme une requete. Le Pro en inclut 500/mois, le Business 2000.',
  },
];

// ── Feature comparison data ──────────────────────────────────────────────────
interface FeatureRow {
  name: string;
  pro: boolean | string;
  business: boolean | string;
}

const FEATURE_COMPARISON: FeatureRow[] = [
  { name: 'Restaurants', pro: '1', business: 'Tous vos etablissements' },
  { name: 'Fiches techniques & calcul des marges', pro: 'Illimite', business: 'Illimite' },
  { name: 'Requetes IA par mois', pro: '500', business: '2000' },
  { name: 'Commandes fournisseurs (email/WhatsApp)', pro: true, business: true },
  { name: 'Scanner de factures IA', pro: true, business: true },
  { name: 'Suivi des prix (Mercuriale)', pro: true, business: true },
  { name: 'Inventaire & alertes stock bas', pro: true, business: true },
  { name: 'HACCP digital', pro: true, business: true },
  { name: 'Messagerie fournisseurs', pro: true, business: true },
  { name: 'Commande vocale en cuisine', pro: true, business: true },
  { name: 'Rapport IA hebdomadaire', pro: false, business: true },
  { name: 'Menu Engineering (matrice BCG)', pro: false, business: true },
  { name: 'Analyse predictive des ventes', pro: false, business: true },
  { name: 'Station Balance compatible', pro: false, business: true },
  { name: 'Support', pro: 'Email', business: 'Prioritaire' },
];

// ── Component ────────────────────────────────────────────────────────────────
export default function Subscription() {
  const [openFAQ, setOpenFAQ] = useState<number | null>(null);

  // Simulated usage stats (would come from context/API in real app)
  const currentPlan = 'Pro';
  const recipesUsed = 25;
  const recipesMax = 999;
  const ingredientsUsed = 410;
  const ingredientsMax = 999;

  const toggleFAQ = (index: number) => {
    setOpenFAQ(openFAQ === index ? null : index);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pb-20">
      {/* ── Current Plan Banner ──────────────────────────────────────────── */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-xl bg-gradient-to-br from-[#F3F4F6] dark:from-[#171717] to-[#F3F4F6] dark:to-[#171717]">
                <Crown className="w-6 h-6 text-[#6B7280] dark:text-[#A3A3A3]" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900 dark:text-white">
                  Plan {currentPlan}
                </h1>
                <div className="flex items-center gap-4 mt-1 text-sm text-gray-500 dark:text-gray-400">
                  <span>
                    <span className="font-semibold text-gray-700 dark:text-gray-300">
                      {recipesUsed}
                    </span>
                    /{recipesMax} recettes
                  </span>
                  <span className="w-1 h-1 rounded-full bg-gray-300 dark:bg-gray-600" />
                  <span>
                    <span className="font-semibold text-gray-700 dark:text-gray-300">
                      {ingredientsUsed}
                    </span>
                    /{ingredientsMax} ingrédients
                  </span>
                </div>
              </div>
            </div>
            <div className="flex gap-3">
              <button
                onClick={async () => {
                  try {
                    const token = localStorage.getItem('token');
                    const res = await fetch('/api/stripe/portal', {
                      method: 'POST',
                      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
                    });
                    const data = await res.json();
                    if (data.url) window.location.href = data.url;
                  } catch {}
                }}
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#111111] dark:bg-white text-white dark:text-black font-medium rounded-xl transition-all hover:bg-[#333] dark:hover:bg-[#E5E5E5]"
              >
                <CreditCard className="w-4 h-4" />
                Gérer mon abonnement
              </button>
              <button className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-teal-600 to-indigo-600 hover:from-teal-700 hover:to-indigo-700 text-white font-medium rounded-xl shadow-lg shadow-teal-500/25 transition-all duration-200 hover:shadow-xl hover:shadow-teal-500/30 hover:-translate-y-0.5">
                <Zap className="w-4 h-4" />
                Passer au Pro
              </button>
            </div>
          </div>

          {/* Usage bars */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
            <div>
              <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mb-1">
                <span>Recettes</span>
                <span>{Math.round((recipesUsed / recipesMax) * 100)}%</span>
              </div>
              <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-teal-500 to-indigo-500 rounded-full transition-all duration-500"
                  style={{ width: `${(recipesUsed / recipesMax) * 100}%` }}
                />
              </div>
            </div>
            <div>
              <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mb-1">
                <span>Ingrédients</span>
                <span>{Math.round((ingredientsUsed / ingredientsMax) * 100)}%</span>
              </div>
              <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full transition-all duration-500"
                  style={{ width: `${(ingredientsUsed / ingredientsMax) * 100}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* ── Section Title ──────────────────────────────────────────────── */}
        <div className="text-center mt-12 mb-10">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
            Choisissez votre plan
          </h2>
          <p className="mt-3 text-lg text-gray-500 dark:text-gray-400 max-w-2xl mx-auto">
            Concu pour les restaurateurs, pas les developpeurs.
            Simple, direct, efficace.
          </p>
        </div>

        {/* ── Pricing Cards ─────────────────────────────────────────────── */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8 max-w-4xl mx-auto">
          {PLANS.map((plan) => (
            <div
              key={plan.id}
              className={`relative rounded-2xl border-2 bg-white dark:bg-gray-800 overflow-hidden transition-all duration-300 hover:shadow-xl ${
                plan.highlighted
                  ? 'border-teal-500 dark:border-teal-400 shadow-xl shadow-teal-500/10 md:-translate-y-2 md:scale-105 z-10'
                  : plan.borderColor + ' shadow-sm hover:-translate-y-1'
              }`}
            >
              {/* Badge */}
              {plan.badge && (
                <div
                  className={`absolute top-0 right-0 px-3 py-1 text-xs font-bold rounded-bl-xl ${
                    plan.highlighted
                      ? 'bg-gradient-to-r from-teal-600 to-indigo-600 text-white'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300'
                  }`}
                >
                  {plan.highlighted && <Sparkles className="w-3 h-3 inline mr-1 -mt-0.5" />}
                  {plan.badge}
                </div>
              )}

              {/* Header gradient */}
              <div className={`bg-gradient-to-br ${plan.gradient} px-6 pt-8 pb-6`}>
                <div
                  className={`inline-flex p-2.5 rounded-xl ${
                    plan.highlighted
                      ? 'bg-teal-100 dark:bg-teal-900/50 text-teal-600 dark:text-teal-400'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300'
                  }`}
                >
                  {plan.icon}
                </div>
                <h3 className="mt-4 text-xl font-bold text-gray-900 dark:text-white">
                  {plan.name}
                </h3>
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                  {plan.description}
                </p>
                <div className="mt-4 flex items-baseline">
                  <span className="text-4xl font-extrabold text-gray-900 dark:text-white">
                    {plan.price}
                  </span>
                  <span className="ml-1 text-gray-500 dark:text-gray-400">{plan.period}</span>
                </div>
              </div>

              {/* Features */}
              <div className="px-6 py-6">
                <ul className="space-y-3">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <Check
                        className={`w-5 h-5 flex-shrink-0 mt-0.5 ${
                          plan.highlighted
                            ? 'text-teal-500 dark:text-teal-400'
                            : 'text-emerald-500 dark:text-emerald-400'
                        }`}
                      />
                      <span className="text-sm text-gray-700 dark:text-gray-300">{feature}</span>
                    </li>
                  ))}
                </ul>

                {/* CTA */}
                <button
                  className={`mt-8 w-full py-3 px-4 rounded-xl font-semibold text-sm transition-all duration-200 ${
                    plan.highlighted
                      ? 'bg-gradient-to-r from-teal-600 to-indigo-600 hover:from-teal-700 hover:to-indigo-700 text-white shadow-lg shadow-teal-500/25 hover:shadow-xl hover:shadow-teal-500/30 hover:-translate-y-0.5'
                      : 'bg-[#111111] dark:bg-white hover:bg-[#333] dark:hover:bg-gray-100 text-white dark:text-black hover:-translate-y-0.5'
                  }`}
                >
                  <span className="inline-flex items-center gap-2">
                    {plan.cta}
                    <ArrowRight className="w-4 h-4" />
                  </span>
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* ── Feature Comparison Table ───────────────────────────────────── */}
        <div className="mt-20">
          <h2 className="text-2xl font-bold text-center text-gray-900 dark:text-white mb-8">
            Ce qui est inclus dans chaque plan
          </h2>

          <div className="overflow-x-auto rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-sm">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200 dark:border-gray-700">
                  <th className="text-left py-4 px-6 text-sm font-semibold text-gray-500 dark:text-gray-400 w-1/3">
                    Fonctionnalité
                  </th>
                  <th className="text-center py-4 px-4 text-sm font-semibold text-teal-600 dark:text-teal-400">
                    <div className="flex flex-col items-center gap-1">
                      <Rocket className="w-4 h-4" />
                      Pro
                    </div>
                  </th>
                  <th className="text-center py-4 px-4 text-sm font-semibold text-gray-500 dark:text-gray-400">
                    <div className="flex flex-col items-center gap-1">
                      <Building2 className="w-4 h-4" />
                      Business
                    </div>
                  </th>
                </tr>
              </thead>
              <tbody>
                {FEATURE_COMPARISON.map((row, i) => (
                  <tr
                    key={i}
                    className={`border-b border-gray-100 dark:border-gray-700/50 ${
                      i % 2 === 0
                        ? 'bg-gray-50/50 dark:bg-gray-800/50'
                        : 'bg-white dark:bg-gray-800'
                    }`}
                  >
                    <td className="py-3.5 px-6 text-sm text-gray-700 dark:text-gray-300 font-medium">
                      {row.name}
                    </td>
                    {(['pro', 'business'] as const).map((plan) => (
                      <td key={plan} className="py-3.5 px-4 text-center">
                        {typeof row[plan] === 'boolean' ? (
                          row[plan] ? (
                            <Check
                              className={`w-5 h-5 mx-auto ${
                                plan === 'pro'
                                  ? 'text-teal-500 dark:text-teal-400'
                                  : 'text-emerald-500 dark:text-emerald-400'
                              }`}
                            />
                          ) : (
                            <X className="w-5 h-5 mx-auto text-gray-300 dark:text-gray-600" />
                          )
                        ) : (
                          <span
                            className={`text-sm font-medium ${
                              plan === 'pro'
                                ? 'text-teal-600 dark:text-teal-400'
                                : 'text-gray-600 dark:text-gray-400'
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

        {/* ── FAQ Section ────────────────────────────────────────────────── */}
        <div className="mt-20 max-w-3xl mx-auto">
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-50 dark:bg-teal-900/30 text-teal-600 dark:text-teal-400 text-xs font-bold mb-3">
              <HelpCircle className="w-3.5 h-3.5" />
              FAQ
            </div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              Questions fréquentes
            </h2>
          </div>

          <div className="space-y-3">
            {FAQ_ITEMS.map((item, index) => (
              <div
                key={index}
                className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden transition-all duration-200 hover:shadow-md"
              >
                <button
                  onClick={() => toggleFAQ(index)}
                  className="flex items-center justify-between w-full px-6 py-4 text-left"
                >
                  <span className="text-sm font-semibold text-gray-900 dark:text-white pr-4">
                    {item.question}
                  </span>
                  <ChevronDown
                    className={`w-5 h-5 flex-shrink-0 text-gray-400 dark:text-gray-500 transition-transform duration-200 ${
                      openFAQ === index ? 'rotate-180' : ''
                    }`}
                  />
                </button>
                <div
                  className={`overflow-hidden transition-all duration-300 ${
                    openFAQ === index ? 'max-h-48 opacity-100' : 'max-h-0 opacity-0'
                  }`}
                >
                  <p className="px-6 pb-4 text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                    {item.answer}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── Bottom CTA ─────────────────────────────────────────────────── */}
        <div className="mt-20 text-center">
          <div className="inline-flex flex-col items-center p-8 rounded-2xl bg-gradient-to-br from-teal-50 to-indigo-50 dark:from-teal-900/20 dark:to-indigo-900/20 border border-teal-100 dark:border-teal-800">
            <Sparkles className="w-8 h-8 text-teal-500 dark:text-teal-400 mb-3" />
            <h3 className="text-xl font-bold text-gray-900 dark:text-white">
              Besoin d'aide pour choisir ?
            </h3>
            <p className="mt-2 text-sm text-gray-500 dark:text-gray-400 max-w-md">
              On vous explique tout simplement. Ecrivez-nous, on repond vite.
            </p>
            <button className="mt-5 inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-teal-600 to-indigo-600 hover:from-teal-700 hover:to-indigo-700 text-white font-semibold rounded-xl shadow-lg shadow-teal-500/25 transition-all duration-200 hover:shadow-xl hover:-translate-y-0.5">
              Nous contacter
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
