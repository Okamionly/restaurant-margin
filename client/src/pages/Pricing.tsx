import { useState } from 'react';
import { Check, X, ChefHat, Sparkles, Building2, HelpCircle, ChevronDown, ChevronUp, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

interface FAQItem {
  question: string;
  answer: string;
}

const faqs: FAQItem[] = [
  {
    question: "Puis-je essayer gratuitement avant de m'engager ?",
    answer: "Oui ! Le plan Professionnel inclut un essai gratuit de 14 jours sans carte bancaire requise. Vous pouvez aussi commencer avec le plan Decouverte qui est entierement gratuit.",
  },
  {
    question: "Comment fonctionne la facturation annuelle ?",
    answer: "En choisissant la facturation annuelle, vous beneficiez d'une reduction de 20% par rapport au tarif mensuel. Vous etes facture une seule fois pour l'annee entiere.",
  },
  {
    question: "Puis-je changer de plan a tout moment ?",
    answer: "Absolument. Vous pouvez upgrader ou downgrader votre plan a tout moment. Le changement prend effet immediatement et le montant est ajuste au prorata.",
  },
  {
    question: "Que se passe-t-il a la fin de mon essai gratuit ?",
    answer: "A la fin de votre essai de 14 jours, vous pouvez choisir de continuer avec le plan Professionnel ou repasser au plan Decouverte gratuit. Aucune facturation automatique.",
  },
  {
    question: "Comment fonctionne le plan Enterprise ?",
    answer: "Le plan Enterprise est entierement personnalise selon vos besoins. Contactez notre equipe commerciale pour obtenir un devis adapte a votre structure multi-etablissements.",
  },
  {
    question: "Quels moyens de paiement acceptez-vous ?",
    answer: "Nous acceptons les cartes bancaires (Visa, Mastercard, Amex), les virements SEPA et les prelevements automatiques pour les plans annuels.",
  },
];

interface PlanFeature {
  text: string;
  included: boolean;
}

interface Plan {
  name: string;
  description: string;
  priceMonthly: number | null;
  priceLabel?: string;
  features: PlanFeature[];
  cta: string;
  ctaLink: string;
  popular?: boolean;
  icon: React.ReactNode;
}

const plans: Plan[] = [
  {
    name: 'Decouverte',
    description: 'Pour demarrer et tester la plateforme',
    priceMonthly: 0,
    icon: <ChefHat className="w-6 h-6 text-slate-400" />,
    features: [
      { text: "Jusqu'a 20 ingredients", included: true },
      { text: '5 recettes', included: true },
      { text: 'Calcul de marge basique', included: true },
      { text: '1 utilisateur', included: true },
      { text: 'Menu Engineering', included: false },
      { text: 'Fiches techniques', included: false },
      { text: 'Assistant IA', included: false },
      { text: 'Gestion fournisseurs', included: false },
    ],
    cta: 'Commencer gratuitement',
    ctaLink: '/login',
  },
  {
    name: 'Professionnel',
    description: 'Pour les restaurateurs ambitieux',
    priceMonthly: 29,
    popular: true,
    icon: <Sparkles className="w-6 h-6 text-blue-400" />,
    features: [
      { text: 'Ingredients illimites', included: true },
      { text: 'Recettes illimitees', included: true },
      { text: 'Menu Engineering', included: true },
      { text: 'Fiches techniques', included: true },
      { text: 'Assistant IA', included: true },
      { text: 'Gestion fournisseurs', included: true },
      { text: 'HACCP & Tracabilite', included: true },
      { text: '5 utilisateurs', included: true },
      { text: 'Support prioritaire', included: true },
    ],
    cta: 'Essai gratuit 14 jours',
    ctaLink: '/login',
  },
  {
    name: 'Enterprise',
    description: 'Pour les groupes et chaines',
    priceMonthly: null,
    priceLabel: 'Sur mesure',
    icon: <Building2 className="w-6 h-6 text-emerald-400" />,
    features: [
      { text: 'Tout Pro +', included: true },
      { text: 'Kit Station (Balance + Tablette)', included: true },
      { text: 'Multi-etablissements', included: true },
      { text: 'API personnalisee', included: true },
      { text: 'Formation sur site', included: true },
      { text: 'Utilisateurs illimites', included: true },
      { text: 'Account manager dedie', included: true },
    ],
    cta: 'Nous contacter',
    ctaLink: '/dev-corp',
  },
];

function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <div className="max-w-3xl mx-auto">
      <h2 className="text-3xl font-bold text-white text-center mb-10">Questions frequentes</h2>
      <div className="space-y-3">
        {faqs.map((faq, index) => (
          <div
            key={index}
            className="bg-slate-900/50 border border-slate-800 rounded-2xl overflow-hidden"
          >
            <button
              onClick={() => setOpenIndex(openIndex === index ? null : index)}
              className="w-full flex items-center justify-between px-6 py-5 text-left"
            >
              <div className="flex items-center gap-3">
                <HelpCircle className="w-5 h-5 text-blue-400 flex-shrink-0" />
                <span className="text-white font-medium">{faq.question}</span>
              </div>
              {openIndex === index ? (
                <ChevronUp className="w-5 h-5 text-slate-400 flex-shrink-0" />
              ) : (
                <ChevronDown className="w-5 h-5 text-slate-400 flex-shrink-0" />
              )}
            </button>
            {openIndex === index && (
              <div className="px-6 pb-5 pt-0">
                <p className="text-slate-400 leading-relaxed pl-8">{faq.answer}</p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default function Pricing() {
  const [annual, setAnnual] = useState(false);

  function getPrice(plan: Plan) {
    if (plan.priceMonthly === null) return plan.priceLabel || 'Sur mesure';
    if (plan.priceMonthly === 0) return 'Gratuit';
    const price = annual ? Math.round(plan.priceMonthly * 0.8) : plan.priceMonthly;
    return `${price}\u20AC`;
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      {/* Header */}
      <header className="border-b border-slate-800/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2.5">
            <ChefHat className="w-8 h-8 text-blue-400" />
            <span className="text-lg font-bold text-white">RestauMargin</span>
          </Link>
          <Link
            to="/login"
            className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-xl transition-colors"
          >
            Se connecter
          </Link>
        </div>
      </header>

      {/* Hero */}
      <section className="pt-20 pb-12 px-4 sm:px-6 text-center">
        <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight mb-4">
          Tarifs simples,{' '}
          <span className="bg-gradient-to-r from-blue-400 to-emerald-400 bg-clip-text text-transparent">
            marge maximale
          </span>
        </h1>
        <p className="text-lg text-slate-400 max-w-2xl mx-auto mb-10">
          Choisissez le plan adapte a votre etablissement. Commencez gratuitement, evoluez quand vous etes pret.
        </p>

        {/* Toggle mensuel / annuel */}
        <div className="flex items-center justify-center gap-4 mb-16">
          <span className={`text-sm font-medium ${!annual ? 'text-white' : 'text-slate-500'}`}>
            Mensuel
          </span>
          <button
            onClick={() => setAnnual(!annual)}
            className={`relative w-14 h-7 rounded-full transition-colors ${
              annual ? 'bg-blue-600' : 'bg-slate-700'
            }`}
          >
            <div
              className={`absolute top-0.5 left-0.5 w-6 h-6 bg-white rounded-full transition-transform shadow-md ${
                annual ? 'translate-x-7' : 'translate-x-0'
              }`}
            />
          </button>
          <span className={`text-sm font-medium ${annual ? 'text-white' : 'text-slate-500'}`}>
            Annuel
          </span>
          {annual && (
            <span className="ml-1 px-2.5 py-1 bg-emerald-500/20 text-emerald-400 text-xs font-semibold rounded-full">
              Economisez 20%
            </span>
          )}
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 pb-24">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`relative flex flex-col bg-slate-900/50 rounded-2xl border p-8 transition-transform hover:-translate-y-1 ${
                plan.popular
                  ? 'border-blue-500 shadow-[0_0_40px_-10px_rgba(59,130,246,0.3)]'
                  : 'border-slate-800'
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
                  <span className="px-4 py-1.5 bg-blue-600 text-white text-xs font-bold rounded-full uppercase tracking-wide">
                    Populaire
                  </span>
                </div>
              )}

              {/* Plan header */}
              <div className="flex items-center gap-3 mb-4">
                {plan.icon}
                <h3 className="text-xl font-bold text-white">{plan.name}</h3>
              </div>
              <p className="text-slate-400 text-sm mb-6">{plan.description}</p>

              {/* Price */}
              <div className="mb-8">
                {plan.priceMonthly !== null && plan.priceMonthly > 0 ? (
                  <div className="flex items-baseline gap-1">
                    <span className="text-4xl font-extrabold text-white">{getPrice(plan)}</span>
                    <span className="text-slate-500 text-sm">/mois</span>
                  </div>
                ) : plan.priceMonthly === 0 ? (
                  <span className="text-4xl font-extrabold text-white">Gratuit</span>
                ) : (
                  <span className="text-3xl font-extrabold text-white">{plan.priceLabel}</span>
                )}
                {plan.priceMonthly !== null && plan.priceMonthly > 0 && annual && (
                  <p className="text-emerald-400 text-xs mt-1">
                    Facture {Math.round(plan.priceMonthly * 0.8 * 12)}{'\u20AC'}/an au lieu de {plan.priceMonthly * 12}{'\u20AC'}
                  </p>
                )}
              </div>

              {/* Features */}
              <ul className="space-y-3 mb-8 flex-1">
                {plan.features.map((feature, idx) => (
                  <li key={idx} className="flex items-start gap-3">
                    {feature.included ? (
                      <Check className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
                    ) : (
                      <X className="w-5 h-5 text-slate-600 flex-shrink-0 mt-0.5" />
                    )}
                    <span className={feature.included ? 'text-slate-300' : 'text-slate-600'}>
                      {feature.text}
                    </span>
                  </li>
                ))}
              </ul>

              {/* CTA */}
              <Link
                to={plan.ctaLink}
                className={`flex items-center justify-center gap-2 w-full py-3.5 rounded-xl text-sm font-semibold transition-colors ${
                  plan.popular
                    ? 'bg-blue-600 hover:bg-blue-700 text-white'
                    : 'bg-slate-800 hover:bg-slate-700 text-white border border-slate-700'
                }`}
              >
                {plan.cta}
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 pb-24">
        <FAQSection />
      </section>

      {/* Footer CTA */}
      <section className="border-t border-slate-800/50 py-16 px-4 sm:px-6 text-center">
        <h2 className="text-2xl font-bold text-white mb-3">
          Pret a optimiser vos marges ?
        </h2>
        <p className="text-slate-400 mb-8 max-w-lg mx-auto">
          Rejoignez des centaines de restaurateurs qui utilisent RestauMargin pour augmenter leur rentabilite.
        </p>
        <Link
          to="/login"
          className="inline-flex items-center gap-2 px-8 py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition-colors"
        >
          Commencer gratuitement
          <ArrowRight className="w-5 h-5" />
        </Link>
      </section>
    </div>
  );
}
