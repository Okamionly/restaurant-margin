import { useState } from 'react';
import {
  Crown, Star, Zap, Check, X, ChevronDown, CreditCard,
  Shield, Smartphone, Package, Rocket, Building2, Scale,
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
    id: 'gratuit',
    name: 'Gratuit',
    price: '0€',
    period: '/mois',
    description: 'Idéal pour démarrer et tester RestauMargin',
    icon: <Package className="w-6 h-6" />,
    badge: 'Plan actuel',
    features: [
      '1 restaurant',
      '20 recettes max',
      '50 ingrédients',
      'Fiches techniques',
      'Calcul de marge basique',
    ],
    cta: 'Plan actuel',
    gradient: 'from-slate-500/10 to-slate-600/10',
    borderColor: 'border-slate-200 dark:border-slate-700',
  },
  {
    id: 'pro',
    name: 'Pro',
    price: '29€',
    period: '/mois',
    description: 'Pour les restaurateurs qui veulent optimiser leurs marges',
    icon: <Rocket className="w-6 h-6" />,
    highlighted: true,
    badge: 'Recommandé',
    features: [
      'Tout du Gratuit +',
      'Recettes illimitées',
      'Ingrédients illimités',
      'Scanner de factures (OCR)',
      'Mercuriale (suivi des prix)',
      'Menu Engineering (matrice BCG)',
      'HACCP & Traçabilité',
      'Commandes automatiques',
      'Support prioritaire',
    ],
    cta: 'Passer au Pro',
    gradient: 'from-blue-500/10 to-indigo-600/10',
    borderColor: 'border-blue-300 dark:border-blue-600',
  },
  {
    id: 'business',
    name: 'Business',
    price: '79€',
    period: '/mois',
    description: 'Pour les groupes et les multi-sites',
    icon: <Building2 className="w-6 h-6" />,
    features: [
      'Tout du Pro +',
      'Multi-restaurant (jusqu\'à 10)',
      'API ouverte',
      'Intégration caisse',
      'Marketplace fournisseurs',
      'Manager dédié',
    ],
    cta: 'Contacter l\'équipe',
    gradient: 'from-purple-500/10 to-fuchsia-600/10',
    borderColor: 'border-purple-200 dark:border-purple-700',
  },
];

const FAQ_ITEMS: FAQItem[] = [
  {
    question: 'Puis-je changer de plan à tout moment ?',
    answer:
      'Oui, vous pouvez passer à un plan supérieur ou inférieur à tout moment. Le changement prend effet immédiatement et la facturation est calculée au prorata pour le reste du mois en cours.',
  },
  {
    question: 'Y a-t-il un engagement ?',
    answer:
      'Non, aucun engagement. Tous nos plans sont sans engagement et vous pouvez annuler à tout moment. Vos données restent accessibles pendant 30 jours après annulation.',
  },
  {
    question: 'Comment fonctionne le scanner de factures ?',
    answer:
      'Le scanner OCR vous permet de photographier vos factures fournisseurs. L\'intelligence artificielle extrait automatiquement les prix, quantités et références pour mettre à jour votre mercuriale et vos coûts ingrédients en temps réel.',
  },
  {
    question: 'Le kit balance est-il compatible avec mon installation ?',
    answer:
      'Le kit Station Balance fonctionne avec une connexion Wi-Fi standard. La tablette Samsung Tab A9+ et la balance Bluetooth sont pré-configurées. Notre équipe assure l\'installation et la formation sur site.',
  },
];

// ── Feature comparison data ──────────────────────────────────────────────────
interface FeatureRow {
  name: string;
  gratuit: boolean | string;
  pro: boolean | string;
  business: boolean | string;
}

const FEATURE_COMPARISON: FeatureRow[] = [
  { name: 'Restaurants', gratuit: '1', pro: '1', business: 'Jusqu\'à 10' },
  { name: 'Recettes', gratuit: '20', pro: 'Illimité', business: 'Illimité' },
  { name: 'Ingrédients', gratuit: '50', pro: 'Illimité', business: 'Illimité' },
  { name: 'Fiches techniques', gratuit: true, pro: true, business: true },
  { name: 'Calcul de marge', gratuit: 'Basique', pro: 'Avancé', business: 'Avancé' },
  { name: 'Scanner de factures (OCR)', gratuit: false, pro: true, business: true },
  { name: 'Mercuriale', gratuit: false, pro: true, business: true },
  { name: 'Menu Engineering', gratuit: false, pro: true, business: true },
  { name: 'HACCP & Traçabilité', gratuit: false, pro: true, business: true },
  { name: 'Commandes automatiques', gratuit: false, pro: true, business: true },
  { name: 'API ouverte', gratuit: false, pro: false, business: true },
  { name: 'Intégration caisse', gratuit: false, pro: false, business: true },
  { name: 'Marketplace fournisseurs', gratuit: false, pro: false, business: true },
  { name: 'Manager dédié', gratuit: false, pro: false, business: true },
  { name: 'Support', gratuit: 'Email', pro: 'Prioritaire', business: 'Dédié' },
];

// ── Component ────────────────────────────────────────────────────────────────
export default function Subscription() {
  const [openFAQ, setOpenFAQ] = useState<number | null>(null);

  // Simulated usage stats (would come from context/API in real app)
  const currentPlan = 'Gratuit';
  const recipesUsed = 12;
  const recipesMax = 20;
  const ingredientsUsed = 34;
  const ingredientsMax = 50;

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
              <div className="p-3 rounded-xl bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-700 dark:to-slate-600">
                <Crown className="w-6 h-6 text-slate-300 dark:text-slate-300" />
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
            <button className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-medium rounded-xl shadow-lg shadow-blue-500/25 transition-all duration-200 hover:shadow-xl hover:shadow-blue-500/30 hover:-translate-y-0.5">
              <Zap className="w-4 h-4" />
              Passer au Pro
            </button>
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
                  className="h-full bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full transition-all duration-500"
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
            Des outils puissants pour optimiser la rentabilité de votre restaurant.
            Commencez gratuitement, évoluez quand vous êtes prêt.
          </p>
        </div>

        {/* ── Pricing Cards ─────────────────────────────────────────────── */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {PLANS.map((plan) => (
            <div
              key={plan.id}
              className={`relative rounded-2xl border-2 bg-white dark:bg-gray-800 overflow-hidden transition-all duration-300 hover:shadow-xl ${
                plan.highlighted
                  ? 'border-blue-500 dark:border-blue-400 shadow-xl shadow-blue-500/10 md:-translate-y-2 md:scale-105 z-10'
                  : plan.borderColor + ' shadow-sm hover:-translate-y-1'
              }`}
            >
              {/* Badge */}
              {plan.badge && (
                <div
                  className={`absolute top-0 right-0 px-3 py-1 text-xs font-bold rounded-bl-xl ${
                    plan.highlighted
                      ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white'
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
                      ? 'bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400'
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
                            ? 'text-blue-500 dark:text-blue-400'
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
                      ? 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg shadow-blue-500/25 hover:shadow-xl hover:shadow-blue-500/30 hover:-translate-y-0.5'
                      : plan.id === 'gratuit'
                        ? 'bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 cursor-default'
                        : 'bg-gray-900 dark:bg-white hover:bg-gray-800 dark:hover:bg-gray-100 text-white dark:text-gray-900 hover:-translate-y-0.5'
                  }`}
                  disabled={plan.id === 'gratuit'}
                >
                  <span className="inline-flex items-center gap-2">
                    {plan.cta}
                    {plan.id !== 'gratuit' && <ArrowRight className="w-4 h-4" />}
                  </span>
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* ── Kit Station Balance ────────────────────────────────────────── */}
        <div className="mt-16">
          <div className="relative rounded-2xl border-2 border-amber-300 dark:border-amber-600 bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 overflow-hidden shadow-lg">
            {/* Decorative */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-amber-200/30 to-transparent rounded-bl-full pointer-events-none" />

            <div className="relative p-8 lg:p-10">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8">
                {/* Left content */}
                <div className="flex-1">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-100 dark:bg-amber-800/50 text-amber-700 dark:text-amber-300 text-xs font-bold mb-4">
                    <Scale className="w-3.5 h-3.5" />
                    MATÉRIEL PROFESSIONNEL
                  </div>
                  <h3 className="text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white">
                    Kit Station Balance
                  </h3>
                  <p className="mt-2 text-gray-600 dark:text-gray-400 max-w-lg">
                    La solution tout-en-un pour peser, calculer et optimiser vos recettes
                    directement en cuisine.
                  </p>

                  <div className="mt-6 flex items-baseline gap-2">
                    <span className="text-4xl font-extrabold text-gray-900 dark:text-white">
                      1 200€
                    </span>
                    <span className="text-gray-500 dark:text-gray-400">one-shot</span>
                    <span className="text-gray-400 dark:text-gray-500 mx-1">+</span>
                    <span className="text-xl font-bold text-gray-900 dark:text-white">29€</span>
                    <span className="text-gray-500 dark:text-gray-400">/mois</span>
                  </div>
                  <p className="mt-1 text-sm text-blue-600 dark:text-blue-400 font-medium">
                    Plan Pro inclus
                  </p>

                  <ul className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {[
                      { icon: <Smartphone className="w-4 h-4" />, text: 'Tablette Samsung Tab A9+' },
                      { icon: <Scale className="w-4 h-4" />, text: 'Balance connectée Bluetooth' },
                      { icon: <Shield className="w-4 h-4" />, text: 'Boîtier inox professionnel' },
                      { icon: <Star className="w-4 h-4" />, text: 'Installation et formation' },
                    ].map((item, i) => (
                      <li key={i} className="flex items-center gap-2.5">
                        <span className="flex-shrink-0 p-1 rounded-lg bg-amber-100 dark:bg-amber-800/40 text-amber-600 dark:text-amber-400">
                          {item.icon}
                        </span>
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                          {item.text}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Right CTA */}
                <div className="flex-shrink-0">
                  <button className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-bold rounded-xl shadow-lg shadow-amber-500/25 transition-all duration-200 hover:shadow-xl hover:shadow-amber-500/30 hover:-translate-y-0.5 text-lg">
                    <CreditCard className="w-5 h-5" />
                    Commander le kit
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ── Feature Comparison Table ───────────────────────────────────── */}
        <div className="mt-20">
          <h2 className="text-2xl font-bold text-center text-gray-900 dark:text-white mb-8">
            Comparaison détaillée des fonctionnalités
          </h2>

          <div className="overflow-x-auto rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-sm">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200 dark:border-gray-700">
                  <th className="text-left py-4 px-6 text-sm font-semibold text-gray-500 dark:text-gray-400 w-1/3">
                    Fonctionnalité
                  </th>
                  <th className="text-center py-4 px-4 text-sm font-semibold text-gray-500 dark:text-gray-400">
                    <div className="flex flex-col items-center gap-1">
                      <Package className="w-4 h-4" />
                      Gratuit
                    </div>
                  </th>
                  <th className="text-center py-4 px-4 text-sm font-semibold text-blue-600 dark:text-blue-400">
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
                    {(['gratuit', 'pro', 'business'] as const).map((plan) => (
                      <td key={plan} className="py-3.5 px-4 text-center">
                        {typeof row[plan] === 'boolean' ? (
                          row[plan] ? (
                            <Check
                              className={`w-5 h-5 mx-auto ${
                                plan === 'pro'
                                  ? 'text-blue-500 dark:text-blue-400'
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
                                ? 'text-blue-600 dark:text-blue-400'
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
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-xs font-bold mb-3">
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
          <div className="inline-flex flex-col items-center p-8 rounded-2xl bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border border-blue-100 dark:border-blue-800">
            <Sparkles className="w-8 h-8 text-blue-500 dark:text-blue-400 mb-3" />
            <h3 className="text-xl font-bold text-gray-900 dark:text-white">
              Des questions sur nos offres ?
            </h3>
            <p className="mt-2 text-sm text-gray-500 dark:text-gray-400 max-w-md">
              Notre équipe est disponible pour vous aider à choisir le plan adapté à vos besoins.
            </p>
            <button className="mt-5 inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold rounded-xl shadow-lg shadow-blue-500/25 transition-all duration-200 hover:shadow-xl hover:-translate-y-0.5">
              Nous contacter
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
