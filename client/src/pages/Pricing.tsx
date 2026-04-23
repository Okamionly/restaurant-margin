import { useState, useEffect } from 'react';
import {
  Check, X, ChefHat, Sparkles, Building2, HelpCircle, ChevronDown, ChevronUp,
  ArrowRight, CheckCircle2, Loader2, Eye, ShieldCheck, TrendingUp, Users,
  Calculator, SlidersHorizontal, Star, BadgePercent
} from 'lucide-react';
import { Link } from 'react-router-dom';
import SEOHead, { buildFAQSchema, buildBreadcrumbSchema } from '../components/SEOHead';

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
  {
    question: "Y a-t-il une garantie satisfait ou rembourse ?",
    answer: "Oui. Si vous n'etes pas satisfait dans les 30 premiers jours, nous vous remboursons integralement. Sans condition, sans question.",
  },
  {
    question: "Mes donnees sont-elles securisees ?",
    answer: "Absolument. Vos donnees sont hebergees en Europe (Supabase), chiffrees en transit et au repos. Nous sommes conformes au RGPD et ne partageons jamais vos donnees.",
  },
];

interface ComparisonRow {
  feature: string;
  category: string;
  pro: boolean | string;
  business: boolean | string;
}

const comparisonData: ComparisonRow[] = [
  { feature: 'Fiches techniques illimitees', category: 'Gestion', pro: true, business: true },
  { feature: 'Calcul automatique des marges', category: 'Gestion', pro: true, business: true },
  { feature: 'Gestion des ingredients', category: 'Gestion', pro: true, business: true },
  { feature: 'Commandes fournisseurs (email + WhatsApp)', category: 'Gestion', pro: true, business: true },
  { feature: 'Scanner de factures IA', category: 'IA', pro: true, business: true },
  { feature: 'Requetes IA par mois', category: 'IA', pro: '500', business: '2 000' },
  { feature: '19 actions IA (recettes, analyse, voix)', category: 'IA', pro: true, business: true },
  { feature: 'Rapport IA hebdomadaire', category: 'IA', pro: false, business: true },
  { feature: 'Analyse predictive des ventes', category: 'IA', pro: false, business: true },
  { feature: 'Suivi des prix fournisseurs (Mercuriale)', category: 'Fournisseurs', pro: true, business: true },
  { feature: 'Alertes prix fournisseurs', category: 'Fournisseurs', pro: true, business: true },
  { feature: 'Messagerie fournisseurs integree', category: 'Fournisseurs', pro: true, business: true },
  { feature: 'Gestion inventaire + alertes stock bas', category: 'Operations', pro: true, business: true },
  { feature: 'HACCP digital (temperatures, nettoyage)', category: 'Operations', pro: true, business: true },
  { feature: 'Multi-etablissements', category: 'Business', pro: false, business: true },
  { feature: 'Menu Engineering (matrice BCG)', category: 'Business', pro: false, business: true },
  { feature: 'Station Balance (tablette + Bluetooth)', category: 'Business', pro: false, business: true },
  { feature: 'Support prioritaire', category: 'Support', pro: false, business: true },
  { feature: 'Support email standard', category: 'Support', pro: true, business: true },
  { feature: 'Essai gratuit 7 jours', category: 'Support', pro: true, business: true },
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
    icon: <Sparkles className="w-6 h-6 text-black" />,
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
      { text: 'Essai gratuit 14 jours — sans carte bancaire', included: true },
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
    icon: <Building2 className="w-6 h-6 text-black" />,
    features: [
      { text: 'Tout du plan Pro', included: true },
      { text: 'Multi-restaurants : gerez tous vos etablissements', included: true },
      { text: '2000 requetes IA par mois', included: true },
      { text: 'Rapport IA hebdomadaire automatique', included: true },
      { text: 'Menu Engineering : matrice BCG pour optimiser votre carte', included: true },
      { text: 'Analyse predictive : previsions de ventes et suggestions prix', included: true },
      { text: 'Station Balance compatible (tablette + balance Bluetooth)', included: true },
      { text: 'Support prioritaire', included: true },
      { text: 'Essai gratuit 14 jours', included: true },
    ],
    cta: "S'abonner — 79\u20AC/mois",
    ctaLink: 'https://buy.stripe.com/4gMbIU5Ki4cAfbe1b187K05',
    external: true,
  },
  {
    name: 'Enterprise',
    description: 'Pour les groupes 3+ etablissements, franchises et chaines regionales',
    priceMonthly: null,
    priceLabel: 'Sur devis',
    icon: <Users className="w-6 h-6 text-black" />,
    features: [
      { text: 'Tout du plan Business', included: true },
      { text: 'Gestion multi-sites illimitee (groupes, franchises)', included: true },
      { text: 'Requetes IA illimitees', included: true },
      { text: 'Station Balance hardware : tablette + balance BT fournie', included: true },
      { text: 'Kiosk mode cuisine sans connexion internet', included: true },
      { text: 'Integrabilite API (ERP, caisse, compta)', included: true },
      { text: 'SLA 99.9% + support dedie + formation equipe', included: true },
      { text: 'Contrat annuel avec MSA + DPA RGPD', included: true },
    ],
    cta: 'Demander un devis',
    ctaLink: '',
  },
];

function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <div className="max-w-3xl mx-auto">
      <h2 className="text-3xl sm:text-4xl font-bold text-black text-center mb-4">
        Questions frequentes
      </h2>
      <p className="text-center text-[#6B7280] mb-10 max-w-lg mx-auto">
        Tout ce que vous devez savoir avant de commencer.
      </p>
      <div className="space-y-3">
        {faqs.map((faq, index) => (
          <div
            key={index}
            className="bg-white border border-[#E5E7EB] rounded-2xl overflow-hidden shadow-sm hover:border-black/20 transition-colors"
          >
            <button
              onClick={() => setOpenIndex(openIndex === index ? null : index)}
              className="w-full flex items-center justify-between px-6 py-5 text-left"
            >
              <div className="flex items-center gap-3">
                <HelpCircle className="w-5 h-5 text-[#9CA3AF] flex-shrink-0" />
                <span className="text-black font-medium">{faq.question}</span>
              </div>
              {openIndex === index ? (
                <ChevronUp className="w-5 h-5 text-[#9CA3AF] flex-shrink-0" />
              ) : (
                <ChevronDown className="w-5 h-5 text-[#9CA3AF] flex-shrink-0" />
              )}
            </button>
            <div
              className={`overflow-hidden transition-all duration-300 ${
                openIndex === index ? 'max-h-40 opacity-100' : 'max-h-0 opacity-0'
              }`}
            >
              <div className="px-6 pb-5 pt-0">
                <p className="text-[#6B7280] leading-relaxed pl-8">{faq.answer}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function ROICalculator() {
  const [dishCount, setDishCount] = useState(40);
  const [avgDishPrice, setAvgDishPrice] = useState(18);
  const [coversPerDay, setCoversPerDay] = useState(60);

  const currentFoodCost = 0.35;
  const optimizedFoodCost = 0.30;
  const daysPerMonth = 26;

  const monthlyRevenue = coversPerDay * avgDishPrice * daysPerMonth;
  const currentCost = monthlyRevenue * currentFoodCost;
  const optimizedCost = monthlyRevenue * optimizedFoodCost;
  const monthlySaving = currentCost - optimizedCost;
  const annualSaving = monthlySaving * 12;
  const roi = Math.round((annualSaving / (29 * 12)) * 100);

  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-12">
        <h2 className="text-3xl sm:text-4xl font-bold text-black mb-4">
          Calculez votre retour sur investissement
        </h2>
        <p className="text-[#6B7280] max-w-lg mx-auto">
          Deplacez les curseurs pour estimer combien RestauMargin peut vous faire economiser.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Sliders */}
        <div className="space-y-8 p-8 bg-white border border-[#E5E7EB] rounded-2xl">
          <div>
            <div className="flex items-center justify-between mb-3">
              <label className="text-sm font-medium text-black">Nombre de plats a la carte</label>
              <span className="text-sm font-bold text-black bg-[#F3F4F6] px-3 py-1 rounded-lg">{dishCount}</span>
            </div>
            <input
              type="range"
              min={10}
              max={120}
              value={dishCount}
              onChange={(e) => setDishCount(Number(e.target.value))}
              className="w-full h-2 bg-[#E5E7EB] rounded-lg appearance-none cursor-pointer accent-black"
            />
            <div className="flex justify-between text-xs text-[#9CA3AF] mt-1">
              <span>10</span>
              <span>120</span>
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-3">
              <label className="text-sm font-medium text-black">Prix moyen d'un plat</label>
              <span className="text-sm font-bold text-black bg-[#F3F4F6] px-3 py-1 rounded-lg">{avgDishPrice}{'\u20AC'}</span>
            </div>
            <input
              type="range"
              min={8}
              max={50}
              value={avgDishPrice}
              onChange={(e) => setAvgDishPrice(Number(e.target.value))}
              className="w-full h-2 bg-[#E5E7EB] rounded-lg appearance-none cursor-pointer accent-black"
            />
            <div className="flex justify-between text-xs text-[#9CA3AF] mt-1">
              <span>8{'\u20AC'}</span>
              <span>50{'\u20AC'}</span>
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-3">
              <label className="text-sm font-medium text-black">Couverts par jour</label>
              <span className="text-sm font-bold text-black bg-[#F3F4F6] px-3 py-1 rounded-lg">{coversPerDay}</span>
            </div>
            <input
              type="range"
              min={20}
              max={200}
              value={coversPerDay}
              onChange={(e) => setCoversPerDay(Number(e.target.value))}
              className="w-full h-2 bg-[#E5E7EB] rounded-lg appearance-none cursor-pointer accent-black"
            />
            <div className="flex justify-between text-xs text-[#9CA3AF] mt-1">
              <span>20</span>
              <span>200</span>
            </div>
          </div>
        </div>

        {/* Results */}
        <div className="p-8 bg-black text-white rounded-2xl flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-6">
              <TrendingUp className="w-5 h-5" />
              <span className="text-sm font-medium text-white/70">Vos economies estimees</span>
            </div>

            <div className="space-y-6">
              <div>
                <p className="text-sm text-white/50 mb-1">Economie mensuelle</p>
                <p className="text-3xl font-extrabold">
                  {monthlySaving.toLocaleString('fr-FR', { maximumFractionDigits: 0 })}{'\u20AC'}
                </p>
              </div>
              <div>
                <p className="text-sm text-white/50 mb-1">Economie annuelle</p>
                <p className="text-4xl font-extrabold text-white">
                  {annualSaving.toLocaleString('fr-FR', { maximumFractionDigits: 0 })}{'\u20AC'}
                </p>
              </div>
              <div className="pt-4 border-t border-white/10">
                <p className="text-sm text-white/50 mb-1">ROI de votre abonnement</p>
                <p className="text-2xl font-bold text-white">{roi > 0 ? `${roi}%` : 'N/A'}</p>
              </div>
            </div>
          </div>

          <p className="text-xs text-white/30 mt-6">
            * Estimation basee sur une reduction du food cost de 35% a 30%, moyenne constatee chez nos utilisateurs.
          </p>
        </div>
      </div>
    </div>
  );
}

function ComparisonTable() {
  const categories = [...new Set(comparisonData.map(r => r.category))];

  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-12">
        <h2 className="text-3xl sm:text-4xl font-bold text-black mb-4">
          Comparaison detaillee des plans
        </h2>
        <p className="text-[#6B7280] max-w-lg mx-auto">
          Toutes les fonctionnalites incluses dans chaque plan.
        </p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b-2 border-black">
              <th className="text-left py-4 pr-4 text-sm font-medium text-[#6B7280]">Fonctionnalite</th>
              <th className="text-center py-4 px-4 w-32">
                <div className="flex flex-col items-center gap-1">
                  <Sparkles className="w-5 h-5 text-black" />
                  <span className="text-sm font-bold text-black">Pro</span>
                  <span className="text-xs text-[#6B7280]">29{'\u20AC'}/mois</span>
                </div>
              </th>
              <th className="text-center py-4 pl-4 w-32">
                <div className="flex flex-col items-center gap-1">
                  <Building2 className="w-5 h-5 text-black" />
                  <span className="text-sm font-bold text-black">Business</span>
                  <span className="text-xs text-[#6B7280]">79{'\u20AC'}/mois</span>
                </div>
              </th>
            </tr>
          </thead>
          <tbody>
            {categories.map((cat) => (
              <>
                <tr key={`cat-${cat}`}>
                  <td colSpan={3} className="pt-6 pb-2">
                    <span className="text-xs font-bold text-[#9CA3AF] uppercase tracking-wider">{cat}</span>
                  </td>
                </tr>
                {comparisonData
                  .filter(r => r.category === cat)
                  .map((row, idx) => (
                    <tr key={`${cat}-${idx}`} className="border-b border-[#F3F4F6] hover:bg-[#FAFAFA] transition-colors">
                      <td className="py-3.5 pr-4 text-sm text-[#374151]">{row.feature}</td>
                      <td className="py-3.5 px-4 text-center">
                        {typeof row.pro === 'boolean' ? (
                          row.pro ? (
                            <Check className="w-5 h-5 text-black mx-auto" />
                          ) : (
                            <X className="w-5 h-5 text-[#D1D5DB] mx-auto" />
                          )
                        ) : (
                          <span className="text-sm font-semibold text-black">{row.pro}</span>
                        )}
                      </td>
                      <td className="py-3.5 pl-4 text-center">
                        {typeof row.business === 'boolean' ? (
                          row.business ? (
                            <Check className="w-5 h-5 text-black mx-auto" />
                          ) : (
                            <X className="w-5 h-5 text-[#D1D5DB] mx-auto" />
                          )
                        ) : (
                          <span className="text-sm font-semibold text-black">{row.business}</span>
                        )}
                      </td>
                    </tr>
                  ))}
              </>
            ))}
          </tbody>
        </table>
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
    <div className="min-h-screen bg-white text-black">
      <SEOHead
        title="Tarifs RestauMargin — Pro 29€/mois, Business 79€/mois | Logiciel marge restaurant"
        description="RestauMargin Pro a 29€/mois : fiches techniques, food cost, IA vocale, balance Bluetooth. Business a 79€/mois : multi-sites, rapport IA hebdomadaire. Enterprise sur devis. Essai 14j sans CB."
        path="/pricing"
        schema={[
          buildFAQSchema(faqs.map(f => ({ question: f.question, answer: f.answer }))),
          buildBreadcrumbSchema([{ name: 'Accueil', url: '/' }, { name: 'Tarifs', url: '/pricing' }]),
        ]}
      />
      {/* Header */}
      <header className="border-b border-[#E5E7EB]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-black flex items-center justify-center">
              <ChefHat className="w-5 h-5 text-white" />
            </div>
            <span className="text-lg font-bold text-black">RestauMargin</span>
          </Link>
          <div className="flex items-center gap-3">
            <Link
              to="/demo"
              className="hidden sm:inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-[#6B7280] hover:text-black transition-colors"
            >
              <Eye className="w-4 h-4" />
              Demo
            </Link>
            <Link
              to="/login"
              className="px-5 py-2 bg-black hover:bg-[#333333] text-white text-sm font-semibold rounded-xl transition-colors"
            >
              Se connecter
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="pt-20 pb-12 px-4 sm:px-6 text-center">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#F3F4F6] rounded-full mb-6">
          <BadgePercent className="w-4 h-4 text-black" />
          <span className="text-xs font-semibold text-black">150+ restaurants — essai 14j sans CB</span>
        </div>
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight mb-4 text-black">
          Tarifs simples,{' '}
          <span className="underline decoration-4 decoration-black/20 underline-offset-8">
            sans surprise
          </span>
        </h1>
        <p className="text-lg text-[#6B7280] max-w-2xl mx-auto mb-10">
          Un seul objectif : vous aider a maitriser vos marges. Choisissez votre plan et commencez en 2 minutes.
        </p>

        {/* Toggle mensuel / annuel */}
        <div className="flex items-center justify-center gap-4 mb-16">
          <span className={`text-sm font-medium transition-colors ${!annual ? 'text-black' : 'text-[#9CA3AF]'}`}>
            Mensuel
          </span>
          <button
            onClick={() => setAnnual(!annual)}
            className={`relative w-14 h-7 rounded-full transition-colors ${
              annual ? 'bg-black' : 'bg-[#D1D5DB]'
            }`}
          >
            <div
              className={`absolute top-0.5 left-0.5 w-6 h-6 bg-white rounded-full transition-transform shadow-md ${
                annual ? 'translate-x-7' : 'translate-x-0'
              }`}
            />
          </button>
          <span className={`text-sm font-medium transition-colors ${annual ? 'text-black' : 'text-[#9CA3AF]'}`}>
            Annuel
          </span>
          {annual && (
            <span className="ml-1 px-3 py-1 bg-black text-white text-xs font-semibold rounded-full">
              2 mois offerts
            </span>
          )}
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 pb-24">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`relative flex flex-col rounded-2xl border p-8 transition-all duration-200 hover:-translate-y-1 ${
                plan.popular
                  ? 'border-black shadow-[0_8px_40px_-12px_rgba(0,0,0,0.15)] bg-white'
                  : 'border-[#E5E7EB] bg-white hover:border-[#9CA3AF]'
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
                  <span className="px-4 py-1.5 bg-black text-white text-xs font-bold rounded-full uppercase tracking-wide">
                    Populaire
                  </span>
                </div>
              )}

              {/* Plan header */}
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-[#F3F4F6] flex items-center justify-center">
                  {plan.icon}
                </div>
                <h3 className="text-xl font-bold text-black">{plan.name}</h3>
              </div>
              <p className="text-[#6B7280] text-sm mb-6">{plan.description}</p>

              {/* Price */}
              <div className="mb-8">
                {plan.priceMonthly !== null && plan.priceMonthly > 0 ? (
                  <div className="flex items-baseline gap-1">
                    <span className="text-5xl font-extrabold text-black">{getPrice(plan)}</span>
                    <span className="text-[#9CA3AF] text-sm">/mois</span>
                  </div>
                ) : plan.priceMonthly === 0 ? (
                  <span className="text-5xl font-extrabold text-black">Gratuit</span>
                ) : (
                  <span className="text-3xl font-extrabold text-black">{plan.priceLabel}</span>
                )}
                {plan.priceMonthly !== null && plan.priceMonthly > 0 && annual && (
                  <p className="text-black text-xs mt-2 font-medium">
                    Facture {Math.round(plan.priceMonthly * 0.8 * 12)}{'\u20AC'}/an au lieu de <span className="line-through text-[#9CA3AF]">{plan.priceMonthly * 12}{'\u20AC'}</span>
                  </p>
                )}
                {plan.priceMonthly !== null && plan.priceMonthly > 0 && !annual && (
                  <p className="text-[#9CA3AF] text-xs mt-2">
                    ou {Math.round(plan.priceMonthly * 0.8 * 12)}{'\u20AC'}/an (-20%)
                  </p>
                )}
              </div>

              {/* Features */}
              <ul className="space-y-3 mb-8 flex-1">
                {plan.features.map((feature, idx) => (
                  <li key={idx} className="flex items-start gap-3">
                    {feature.included ? (
                      <Check className="w-5 h-5 text-black flex-shrink-0 mt-0.5" />
                    ) : (
                      <X className="w-5 h-5 text-[#D1D5DB] flex-shrink-0 mt-0.5" />
                    )}
                    <span className={feature.included ? 'text-[#374151] text-sm' : 'text-[#D1D5DB] text-sm'}>
                      {feature.text}
                    </span>
                  </li>
                ))}
              </ul>

              {/* CTA */}
              {plan.name === 'Enterprise' ? (
                devisSent ? (
                  <div className="flex items-center justify-center gap-2 py-3.5 text-black text-sm font-semibold">
                    <CheckCircle2 className="w-5 h-5" /> Demande envoyee !
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
                        const message = err instanceof Error ? err.message : 'Erreur. Veuillez reessayer.';
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
                      className="w-full px-3 py-2 rounded-lg bg-[#F3F4F6] border border-[#E5E7EB] text-black text-sm placeholder:text-[#9CA3AF] focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                    />
                    <input
                      type="email"
                      required
                      value={devisForm.email}
                      onChange={(e) => setDevisForm({ ...devisForm, email: e.target.value })}
                      placeholder="votre@email.com"
                      className="w-full px-3 py-2 rounded-lg bg-[#F3F4F6] border border-[#E5E7EB] text-black text-sm placeholder:text-[#9CA3AF] focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                    />
                    <input
                      type="tel"
                      value={devisForm.phone}
                      onChange={(e) => setDevisForm({ ...devisForm, phone: e.target.value })}
                      placeholder="Telephone (optionnel)"
                      className="w-full px-3 py-2 rounded-lg bg-[#F3F4F6] border border-[#E5E7EB] text-black text-sm placeholder:text-[#9CA3AF] focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                    />
                    <textarea
                      rows={2}
                      value={devisForm.message}
                      onChange={(e) => setDevisForm({ ...devisForm, message: e.target.value })}
                      placeholder="Votre besoin (nb. de sites, etc.)"
                      className="w-full px-3 py-2 rounded-lg bg-[#F3F4F6] border border-[#E5E7EB] text-black text-sm placeholder:text-[#9CA3AF] focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent resize-none"
                    />
                    {devisError && (
                      <p className="text-xs text-red-500">{devisError}</p>
                    )}
                    <button
                      type="submit"
                      disabled={devisLoading}
                      className="flex items-center justify-center gap-2 w-full py-3 rounded-xl bg-black hover:bg-[#333333] text-white text-sm font-semibold transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
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
                    className="flex items-center justify-center gap-2 w-full py-3.5 rounded-xl text-sm font-semibold transition-colors bg-[#F3F4F6] hover:bg-[#E5E7EB] text-black border border-[#E5E7EB]"
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
                      ? 'bg-black hover:bg-[#333333] text-white'
                      : 'bg-white hover:bg-[#F3F4F6] text-black border-2 border-black'
                  }`}
                >
                  {plan.cta}
                  <ArrowRight className="w-4 h-4" />
                </a>
              ) : (
                <Link
                  to={plan.ctaLink}
                  className="flex items-center justify-center gap-2 w-full py-3.5 rounded-xl text-sm font-semibold transition-colors bg-[#F3F4F6] hover:bg-[#E5E7EB] text-black border border-[#E5E7EB]"
                >
                  {plan.cta}
                  <ArrowRight className="w-4 h-4" />
                </Link>
              )}
            </div>
          ))}
        </div>

        {/* Money-back guarantee */}
        <div className="mt-8 flex items-center justify-center gap-3 text-center">
          <ShieldCheck className="w-5 h-5 text-black flex-shrink-0" />
          <p className="text-sm text-[#6B7280]">
            <span className="font-semibold text-black">Garantie 30 jours satisfait ou rembourse.</span>{' '}
            Essayez sans risque.
          </p>
        </div>
      </section>

      {/* Social Proof Bar */}
      <section className="border-y border-[#E5E7EB] bg-[#FAFAFA] py-12 px-4 sm:px-6">
        <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          <div>
            <p className="text-3xl font-extrabold text-black">150+</p>
            <p className="text-sm text-[#6B7280] mt-1">Restaurants actifs</p>
          </div>
          <div>
            <p className="text-3xl font-extrabold text-black">4.8/5</p>
            <div className="flex items-center justify-center gap-0.5 mt-1">
              {[1,2,3,4,5].map(i => (
                <Star key={i} className={`w-3.5 h-3.5 ${i <= 4 ? 'fill-black text-black' : 'fill-black/40 text-black/40'}`} />
              ))}
            </div>
          </div>
          <div>
            <p className="text-3xl font-extrabold text-black">-5pts</p>
            <p className="text-sm text-[#6B7280] mt-1">Food cost moyen</p>
          </div>
          <div>
            <p className="text-3xl font-extrabold text-black">2 min</p>
            <p className="text-sm text-[#6B7280] mt-1">Pour commencer</p>
          </div>
        </div>
      </section>

      {/* Feature Comparison Table */}
      <section className="py-24 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto">
          <ComparisonTable />
        </div>
      </section>

      {/* ROI Calculator */}
      <section className="bg-[#FAFAFA] border-y border-[#E5E7EB] py-24 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto">
          <ROICalculator />
        </div>
      </section>

      {/* FAQ */}
      <section className="py-24 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto">
          <FAQSection />
        </div>
      </section>

      {/* Footer CTA */}
      <section className="border-t border-[#E5E7EB] bg-black py-20 px-4 sm:px-6 text-center">
        <h2 className="text-2xl sm:text-3xl font-bold text-white mb-3">
          Pret a reprendre le controle de vos marges ?
        </h2>
        <p className="text-white/50 mb-8 max-w-lg mx-auto">
          Essayez gratuitement pendant 14 jours. Sans carte bancaire, sans engagement.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <a
            href="https://buy.stripe.com/9B614g1u2eRe9QU6vl87K04"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-8 py-3.5 bg-white hover:bg-[#F3F4F6] text-black font-semibold rounded-xl transition-colors"
          >
            Commencer l'essai gratuit
            <ArrowRight className="w-5 h-5" />
          </a>
          <Link
            to="/demo"
            className="inline-flex items-center gap-2 px-8 py-3.5 border border-white/20 hover:border-white/40 text-white font-semibold rounded-xl transition-colors"
          >
            <Eye className="w-5 h-5" />
            Voir la demo
          </Link>
        </div>
        <div className="mt-6 flex items-center justify-center gap-2">
          <ShieldCheck className="w-4 h-4 text-white/40" />
          <p className="text-xs text-white/40">Garantie 30 jours satisfait ou rembourse</p>
        </div>
      </section>
    </div>
  );
}
