import { useState } from 'react';
import { Check, X, ChefHat, Sparkles, Building2, HelpCircle, ChevronDown, ChevronUp, ArrowRight, CheckCircle2, Loader2, Eye } from 'lucide-react';
import { Link } from 'react-router-dom';

interface FAQItem {
  question: string;
  answer: string;
}

const faqs: FAQItem[] = [
  {
    question: "Comment fonctionne l'abonnement ?",
    answer: "Choisissez votre plan (Pro 29\u20AC ou Business 79\u20AC/mois), payez par carte bancaire et recevez votre code d'activation par email. Sans engagement, vous annulez quand vous voulez.",
  },
  {
    question: "Comment fonctionne la facturation annuelle ?",
    answer: "En choisissant la facturation annuelle, vous economisez 20%. Vous etes facture une seule fois pour l'annee entiere.",
  },
  {
    question: "Puis-je changer de plan a tout moment ?",
    answer: "Oui. Passez du Pro au Business (ou l'inverse) quand vous voulez. Le changement est immediat et le montant est ajuste au prorata.",
  },
  {
    question: "Comment recevoir mon code d'activation ?",
    answer: "Apres le paiement, vous recevez un code par email (ex: RM-A3F8K2XY). Entrez-le a la creation de votre compte et c'est parti.",
  },
  {
    question: "C'est quoi les requetes IA ?",
    answer: "Chaque fois que vous utilisez l'IA (creer une recette, scanner une facture, poser une question), ca consomme une requete. Le plan Pro inclut 500 requetes/mois, le Business 2000.",
  },
  {
    question: "Quels moyens de paiement acceptez-vous ?",
    answer: "Cartes bancaires (Visa, Mastercard, Amex), virements SEPA et prelevements automatiques pour les plans annuels.",
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
  external?: boolean;
  icon: React.ReactNode;
}

const plans: Plan[] = [
  {
    name: 'Pro',
    description: 'Pour les independants qui veulent maitriser leurs marges',
    priceMonthly: 29,
    popular: true,
    icon: <Sparkles className="w-6 h-6 text-teal-400" />,
    features: [
      { text: 'Fiches techniques illimitees avec calcul automatique des marges', included: true },
      { text: '19 actions IA : creez vos recettes par chat ou commande vocale', included: true },
      { text: 'Commandes fournisseurs par email et WhatsApp en 1 clic', included: true },
      { text: 'Scanner de factures IA : photographiez, les prix se mettent a jour', included: true },
      { text: 'Suivi des prix fournisseurs (Mercuriale) avec alertes', included: true },
      { text: 'Gestion de l\'inventaire avec alertes stock bas', included: true },
      { text: 'HACCP digital : temperatures, nettoyage, conformite', included: true },
      { text: 'Messagerie integree avec vos fournisseurs', included: true },
      { text: '500 requetes IA par mois', included: true },
      { text: 'Essai gratuit 7 jours', included: true },
      { text: 'Multi-etablissements', included: false },
      { text: 'Rapport IA hebdomadaire', included: false },
      { text: 'Analyse predictive des ventes', included: false },
    ],
    cta: "S'abonner — 29\u20AC/mois",
    ctaLink: 'https://buy.stripe.com/9B614g1u2eRe9QU6vl87K04',
    external: true,
  },
  {
    name: 'Business',
    description: 'Pour les groupes qui gerent plusieurs etablissements',
    priceMonthly: 79,
    icon: <Building2 className="w-6 h-6 text-emerald-400" />,
    features: [
      { text: 'Tout du plan Pro', included: true },
      { text: 'Multi-restaurants : gerez tous vos etablissements', included: true },
      { text: '2000 requetes IA par mois', included: true },
      { text: 'Rapport IA hebdomadaire automatique', included: true },
      { text: 'Menu Engineering : matrice BCG pour optimiser votre carte', included: true },
      { text: 'Analyse predictive : previsions de ventes et suggestions prix', included: true },
      { text: 'Station Balance compatible (tablette + balance Bluetooth)', included: true },
      { text: 'Support prioritaire', included: true },
      { text: 'Essai gratuit 7 jours', included: true },
    ],
    cta: "S'abonner — 79\u20AC/mois",
    ctaLink: 'https://buy.stripe.com/4gMbIU5Ki4cAfbe1b187K05',
    external: true,
  },
];

function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <div className="max-w-3xl mx-auto">
      <h2 className="text-3xl font-bold text-slate-900 text-center mb-10">Questions frequentes</h2>
      <div className="space-y-3">
        {faqs.map((faq, index) => (
          <div
            key={index}
            className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm"
          >
            <button
              onClick={() => setOpenIndex(openIndex === index ? null : index)}
              className="w-full flex items-center justify-between px-6 py-5 text-left"
            >
              <div className="flex items-center gap-3">
                <HelpCircle className="w-5 h-5 text-teal-400 flex-shrink-0" />
                <span className="text-slate-900 font-medium">{faq.question}</span>
              </div>
              {openIndex === index ? (
                <ChevronUp className="w-5 h-5 text-slate-400 flex-shrink-0" />
              ) : (
                <ChevronDown className="w-5 h-5 text-slate-400 flex-shrink-0" />
              )}
            </button>
            {openIndex === index && (
              <div className="px-6 pb-5 pt-0">
                <p className="text-slate-600 leading-relaxed pl-8">{faq.answer}</p>
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
  const [showDevisForm, setShowDevisForm] = useState(false);
  const [devisForm, setDevisForm] = useState({ name: '', email: '', phone: '', message: '' });
  const [devisLoading, setDevisLoading] = useState(false);
  const [devisSent, setDevisSent] = useState(false);
  const [devisError, setDevisError] = useState('');

  function getPrice(plan: Plan) {
    if (plan.priceMonthly === null) return plan.priceLabel || 'Sur mesure';
    if (plan.priceMonthly === 0) return 'Gratuit';
    const price = annual ? Math.round(plan.priceMonthly * 0.8) : plan.priceMonthly;
    return `${price}\u20AC`;
  }

  return (
    <div className="min-h-screen bg-white text-slate-900">
      {/* Header */}
      <header className="border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2.5">
            <ChefHat className="w-8 h-8 text-teal-500" />
            <span className="text-lg font-bold text-slate-900">RestauMargin</span>
          </Link>
          <Link
            to="/login"
            className="px-5 py-2 bg-teal-600 hover:bg-teal-700 text-white text-sm font-semibold rounded-xl transition-colors"
          >
            Se connecter
          </Link>
        </div>
      </header>

      {/* Hero */}
      <section className="pt-20 pb-12 px-4 sm:px-6 text-center">
        <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight mb-4 text-slate-900">
          Concu pour les restaurateurs,{' '}
          <span className="bg-gradient-to-r from-teal-500 to-emerald-500 bg-clip-text text-transparent">
            pas les developpeurs
          </span>
        </h1>
        <p className="text-lg text-slate-500 max-w-2xl mx-auto mb-10">
          Simple, direct, efficace. Choisissez votre plan et commencez a maitriser vos marges.
        </p>

        {/* Toggle mensuel / annuel */}
        <div className="flex items-center justify-center gap-4 mb-16">
          <span className={`text-sm font-medium ${!annual ? 'text-slate-900' : 'text-slate-400'}`}>
            Mensuel
          </span>
          <button
            onClick={() => setAnnual(!annual)}
            className={`relative w-14 h-7 rounded-full transition-colors ${
              annual ? 'bg-teal-600' : 'bg-slate-300'
            }`}
          >
            <div
              className={`absolute top-0.5 left-0.5 w-6 h-6 bg-white rounded-full transition-transform shadow-md ${
                annual ? 'translate-x-7' : 'translate-x-0'
              }`}
            />
          </button>
          <span className={`text-sm font-medium ${annual ? 'text-slate-900' : 'text-slate-400'}`}>
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
              className={`relative flex flex-col bg-white rounded-2xl border p-8 transition-transform hover:-translate-y-1 shadow-sm ${
                plan.popular
                  ? 'border-teal-500 shadow-[0_0_40px_-10px_rgba(59,130,246,0.2)]'
                  : 'border-slate-200'
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
                  <span className="px-4 py-1.5 bg-teal-600 text-white text-xs font-bold rounded-full uppercase tracking-wide">
                    Populaire
                  </span>
                </div>
              )}

              {/* Plan header */}
              <div className="flex items-center gap-3 mb-4">
                {plan.icon}
                <h3 className="text-xl font-bold text-slate-900">{plan.name}</h3>
              </div>
              <p className="text-slate-500 text-sm mb-6">{plan.description}</p>

              {/* Price */}
              <div className="mb-8">
                {plan.priceMonthly !== null && plan.priceMonthly > 0 ? (
                  <div className="flex items-baseline gap-1">
                    <span className="text-4xl font-extrabold text-slate-900">{getPrice(plan)}</span>
                    <span className="text-slate-400 text-sm">/mois</span>
                  </div>
                ) : plan.priceMonthly === 0 ? (
                  <span className="text-4xl font-extrabold text-slate-900">Gratuit</span>
                ) : (
                  <span className="text-3xl font-extrabold text-slate-900">{plan.priceLabel}</span>
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
                      <X className="w-5 h-5 text-slate-300 flex-shrink-0 mt-0.5" />
                    )}
                    <span className={feature.included ? 'text-slate-400' : 'text-slate-400'}>
                      {feature.text}
                    </span>
                  </li>
                ))}
              </ul>

              {/* CTA */}
              {plan.name === 'Enterprise' ? (
                devisSent ? (
                  <div className="flex items-center justify-center gap-2 py-3.5 text-emerald-400 text-sm font-semibold">
                    <CheckCircle2 className="w-5 h-5" /> Demande envoyée !
                  </div>
                ) : showDevisForm ? (
                  <form
                    onSubmit={async (e) => {
                      e.preventDefault();
                      setDevisLoading(true);
                      setDevisError('');
                      try {
                        const res = await fetch('/api/contact', {
                          method: 'POST',
                          headers: { 'Content-Type': 'application/json' },
                          body: JSON.stringify({
                            name: devisForm.name,
                            email: devisForm.email,
                            phone: devisForm.phone,
                            message: devisForm.message,
                            source: 'enterprise-devis',
                          }),
                        });
                        if (!res.ok) {
                          const data = await res.json();
                          throw new Error(data.error || 'Erreur lors de l\'envoi');
                        }
                        setDevisSent(true);
                      } catch (err: unknown) {
                        const message = err instanceof Error ? err.message : 'Erreur. Veuillez réessayer.';
                        setDevisError(message);
                      } finally {
                        setDevisLoading(false);
                      }
                    }}
                    className="space-y-3"
                  >
                    <input
                      type="text"
                      required
                      value={devisForm.name}
                      onChange={(e) => setDevisForm({ ...devisForm, name: e.target.value })}
                      placeholder="Votre nom"
                      className="w-full px-3 py-2 rounded-lg bg-gray-50 border border-slate-300 text-slate-900 text-sm placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                    />
                    <input
                      type="email"
                      required
                      value={devisForm.email}
                      onChange={(e) => setDevisForm({ ...devisForm, email: e.target.value })}
                      placeholder="votre@email.com"
                      className="w-full px-3 py-2 rounded-lg bg-gray-50 border border-slate-300 text-slate-900 text-sm placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                    />
                    <input
                      type="tel"
                      value={devisForm.phone}
                      onChange={(e) => setDevisForm({ ...devisForm, phone: e.target.value })}
                      placeholder="Téléphone (optionnel)"
                      className="w-full px-3 py-2 rounded-lg bg-gray-50 border border-slate-300 text-slate-900 text-sm placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                    />
                    <textarea
                      rows={2}
                      value={devisForm.message}
                      onChange={(e) => setDevisForm({ ...devisForm, message: e.target.value })}
                      placeholder="Votre besoin (nb. de sites, etc.)"
                      className="w-full px-3 py-2 rounded-lg bg-gray-50 border border-slate-300 text-slate-900 text-sm placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent resize-none"
                    />
                    {devisError && (
                      <p className="text-xs text-red-400">{devisError}</p>
                    )}
                    <button
                      type="submit"
                      disabled={devisLoading}
                      className="flex items-center justify-center gap-2 w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
                    >
                      {devisLoading ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" /> Envoi...
                        </>
                      ) : (
                        <>
                          Envoyer la demande
                          <ArrowRight className="w-4 h-4" />
                        </>
                      )}
                    </button>
                  </form>
                ) : (
                  <button
                    onClick={() => setShowDevisForm(true)}
                    className="flex items-center justify-center gap-2 w-full py-3.5 rounded-xl text-sm font-semibold transition-colors bg-slate-100 hover:bg-slate-200 text-slate-900 border border-slate-300"
                  >
                    {plan.cta}
                    <ArrowRight className="w-4 h-4" />
                  </button>
                )
              ) : plan.external ? (
                <a
                  href={plan.ctaLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`flex items-center justify-center gap-2 w-full py-3.5 rounded-xl text-sm font-semibold transition-colors ${
                    plan.popular
                      ? 'bg-teal-600 hover:bg-teal-700 text-white'
                      : 'bg-emerald-600 hover:bg-emerald-700 text-white'
                  }`}
                >
                  {plan.cta}
                  <ArrowRight className="w-4 h-4" />
                </a>
              ) : (
                <Link
                  to={plan.ctaLink}
                  className="flex items-center justify-center gap-2 w-full py-3.5 rounded-xl text-sm font-semibold transition-colors bg-slate-100 hover:bg-slate-200 text-slate-900 border border-slate-300"
                >
                  {plan.cta}
                  <ArrowRight className="w-4 h-4" />
                </Link>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section className="bg-gray-50 py-24 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto">
          <FAQSection />
        </div>
      </section>

      {/* Footer CTA */}
      <section className="border-t border-slate-200 bg-gray-50 py-16 px-4 sm:px-6 text-center">
        <h2 className="text-2xl font-bold text-slate-900 mb-3">
          Pret a reprendre le controle de vos marges ?
        </h2>
        <p className="text-slate-500 mb-8 max-w-lg mx-auto">
          Essayez gratuitement pendant 7 jours. Sans carte bancaire, sans engagement.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <a
            href="https://buy.stripe.com/9B614g1u2eRe9QU6vl87K04"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-8 py-3.5 bg-teal-600 hover:bg-teal-700 text-white font-semibold rounded-xl transition-colors"
          >
            Commencer l'essai gratuit — 29\u20AC/mois
            <ArrowRight className="w-5 h-5" />
          </a>
          <Link
            to="/demo"
            className="inline-flex items-center gap-2 px-8 py-3.5 border border-slate-300 hover:border-slate-400 text-slate-700 font-semibold rounded-xl transition-colors"
          >
            <Eye className="w-5 h-5" />
            Voir la demo
          </Link>
        </div>
      </section>
    </div>
  );
}
