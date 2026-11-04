import { useState } from 'react';
import {
  Check, ChefHat, HelpCircle, ChevronDown, ChevronUp,
  ArrowRight, Eye, ShieldCheck, TrendingUp, BadgePercent
} from 'lucide-react';
import { Link } from 'react-router-dom';
import SEOHead from '../components/SEOHead';
import PublicHeader from '../components/public/PublicHeader';
import PublicFooter from '../components/public/PublicFooter';

interface FAQItem {
  question: string;
  answer: string;
}

// 2026-11-04 : offre unique (decision du fondateur). Plus de Pro / Business /
// Enterprise, plus de facturation annuelle : un seul prix, 19 € par mois, toutes
// les fonctionnalites, sans engagement. Meme prix que le checkout Stripe.
const PRIX_MENSUEL = 19;

const faqs: FAQItem[] = [
  {
    question: "Comment fonctionne l'abonnement ?",
    answer: "Il n'y a qu'une seule offre : RestauMargin à 19 € par mois, avec toutes les fonctionnalités. Vous commencez par 7 jours d'essai gratuit sans carte bancaire, puis vous vous abonnez depuis votre espace si l'outil vous convient.",
  },
  {
    question: "Y a-t-il plusieurs formules ?",
    answer: "Non. Tout le monde a accès à la même offre complète, que vous ayez un ou plusieurs établissements. Pas d'option payante en plus, pas de facturation annuelle à avancer.",
  },
  {
    question: "Comment résilier ?",
    answer: "L'abonnement est sans engagement : vous pouvez le résilier à tout moment depuis votre espace. La résiliation prend effet à la fin du mois en cours (CGV, article 4.2).",
  },
  {
    question: "C'est quoi les requêtes IA ?",
    answer: "Chaque fois que vous utilisez l'IA (créer une recette, lire une facture, poser une question), cela consomme une requête. L'abonnement inclut 500 requêtes par mois, remises à zéro le 1er de chaque mois.",
  },
  {
    question: "Quels moyens de paiement acceptez-vous ?",
    answer: "Le paiement se fait chaque mois par carte bancaire (Visa, Mastercard, American Express), via Stripe.",
  },
  {
    // 2026-11-04 : promettait « remboursement integral sous 30 jours », que les CGV (art. 4.2)
    // excluent. On ne promet que ce que les CGV disent.
    question: "Puis-je essayer avant de payer ?",
    answer: "Oui. L'essai est gratuit pendant 7 jours, sans carte bancaire. Ensuite l'abonnement est sans engagement : vous pouvez le résilier à tout moment depuis votre espace, la résiliation prend effet à la fin du mois en cours (CGV, article 4.2).",
  },
  {
    question: "Mes données sont-elles sécurisées ?",
    answer: "Vos données sont hébergées en Europe (Supabase), chiffrées en transit et au repos. Nous respectons le RGPD et ne revendons pas vos données.",
  },
];

// Ce qui etait dans Pro et Business, limite a ce qui existe reellement dans l'application.
const fonctionnalites: string[] = [
  'Fiches techniques illimitées avec calcul automatique des marges',
  '19 actions IA : créez vos recettes par chat ou commande vocale',
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
];

function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <div className="max-w-3xl mx-auto">
      <h2 className="text-3xl sm:text-4xl font-bold text-black text-center mb-4">
        Questions fréquentes
      </h2>
      <p className="text-center text-[#6B7280] mb-10 max-w-lg mx-auto">
        Tout ce que vous devez savoir avant de commencer.
      </p>
      <div className="space-y-3">
        {faqs.map((faq, index) => (
          <div
            key={index}
            className="bg-white border border-mono-900 rounded-2xl overflow-hidden shadow-sm hover:border-black/20 transition-colors"
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
  const roi = Math.round((annualSaving / (PRIX_MENSUEL * 12)) * 100);

  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-12">
        <h2 className="text-3xl sm:text-4xl font-bold text-black mb-4">
          Calculez votre retour sur investissement
        </h2>
        <p className="text-[#6B7280] max-w-lg mx-auto">
          Déplacez les curseurs pour estimer combien RestauMargin peut vous faire économiser.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Sliders */}
        <div className="space-y-8 p-8 bg-white border border-mono-900 rounded-2xl">
          <div>
            <div className="flex items-center justify-between mb-3">
              <label className="text-sm font-medium text-black">Nombre de plats à la carte</label>
              <span className="text-sm font-bold text-black bg-mono-950 px-3 py-1 rounded-lg">{dishCount}</span>
            </div>
            <input
              type="range"
              min={10}
              max={120}
              value={dishCount}
              onChange={(e) => setDishCount(Number(e.target.value))}
              className="w-full h-2 bg-mono-900 rounded-lg appearance-none cursor-pointer accent-black"
            />
            <div className="flex justify-between text-xs text-[#9CA3AF] mt-1">
              <span>10</span>
              <span>120</span>
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-3">
              <label className="text-sm font-medium text-black">Prix moyen d'un plat</label>
              <span className="text-sm font-bold text-black bg-mono-950 px-3 py-1 rounded-lg">{avgDishPrice}{'€'}</span>
            </div>
            <input
              type="range"
              min={8}
              max={50}
              value={avgDishPrice}
              onChange={(e) => setAvgDishPrice(Number(e.target.value))}
              className="w-full h-2 bg-mono-900 rounded-lg appearance-none cursor-pointer accent-black"
            />
            <div className="flex justify-between text-xs text-[#9CA3AF] mt-1">
              <span>8{'€'}</span>
              <span>50{'€'}</span>
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-3">
              <label className="text-sm font-medium text-black">Couverts par jour</label>
              <span className="text-sm font-bold text-black bg-mono-950 px-3 py-1 rounded-lg">{coversPerDay}</span>
            </div>
            <input
              type="range"
              min={20}
              max={200}
              value={coversPerDay}
              onChange={(e) => setCoversPerDay(Number(e.target.value))}
              className="w-full h-2 bg-mono-900 rounded-lg appearance-none cursor-pointer accent-black"
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
              <span className="text-sm font-medium text-white/70">Vos économies estimées</span>
            </div>

            <div className="space-y-6">
              <div>
                <p className="text-sm text-white/50 mb-1">Économie mensuelle</p>
                <p className="text-3xl font-extrabold">
                  {monthlySaving.toLocaleString('fr-FR', { maximumFractionDigits: 0 })}{'€'}
                </p>
              </div>
              <div>
                <p className="text-sm text-white/50 mb-1">Économie annuelle</p>
                <p className="text-4xl font-extrabold text-white">
                  {annualSaving.toLocaleString('fr-FR', { maximumFractionDigits: 0 })}{'€'}
                </p>
              </div>
              <div className="pt-4 border-t border-white/10">
                <p className="text-sm text-white/50 mb-1">ROI de votre abonnement</p>
                <p className="text-2xl font-bold text-white">{roi > 0 ? `${roi}%` : 'N/A'}</p>
              </div>
            </div>
          </div>

          <p className="text-xs text-white/30 mt-6">
            * Simulation illustrative basée sur une hypothèse de réduction du food cost de 35 % à 30 %. Ce n'est pas un résultat garanti ni une moyenne mesurée.
          </p>
        </div>
      </div>
    </div>
  );
}

export default function Pricing() {
  return (
    <div className="min-h-screen bg-white text-black">
      <SEOHead
        title="Tarif RestauMargin — 19 € par mois, toutes les fonctionnalités"
        description="Une seule offre : RestauMargin à 19 € par mois, toutes les fonctionnalités, sans engagement. Marges, food cost, fiches techniques et IA. Essai gratuit 7 jours sans carte bancaire."
        path="/pricing"
      />
      {/* Header */}
      <PublicHeader />

      {/* Hero */}
      <section className="pt-20 pb-12 px-4 sm:px-6 text-center">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-mono-950 rounded-full mb-6">
          <BadgePercent className="w-4 h-4 text-black" />
          {/* FIX 2026-09-24 : disait "des restaurants". Faux — une vingtaine de
              comptes, aucun abonne payant. On garde l'argument qui, lui, est vrai. */}
          <span className="text-xs font-semibold text-black">Essai gratuit 7 jours, sans carte bancaire</span>
        </div>
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight mb-4 text-black">
          Un seul tarif,{' '}
          <span className="underline decoration-4 decoration-black/20 underline-offset-8">
            sans surprise
          </span>
        </h1>
        <p className="text-lg text-[#6B7280] max-w-2xl mx-auto mb-12">
          Une seule offre, toutes les fonctionnalités, sans engagement. Commencez en 2 minutes.
        </p>
      </section>

      {/* Carte unique */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 pb-24">
        <div className="mx-auto max-w-lg">
          <div className="relative flex flex-col rounded-2xl border border-black p-8 bg-white shadow-[0_8px_40px_-12px_rgba(0,0,0,0.15)]">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-mono-950 flex items-center justify-center">
                <ChefHat className="w-6 h-6 text-black" />
              </div>
              <h2 className="text-xl font-bold text-black">RestauMargin</h2>
            </div>
            <p className="text-[#6B7280] text-sm mb-6">Toutes les fonctionnalités, pour un ou plusieurs établissements.</p>

            <div className="mb-8">
              <div className="flex items-baseline gap-2">
                <span className="text-5xl font-extrabold text-black">{PRIX_MENSUEL}{'\u00A0'}€</span>
                <span className="text-[#6B7280] text-base">par mois</span>
              </div>
              <p className="text-[#6B7280] text-xs mt-2">Sans engagement, résiliable à tout moment.</p>
            </div>

            <ul className="space-y-3 mb-8 flex-1">
              {fonctionnalites.map((f) => (
                <li key={f} className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-black flex-shrink-0 mt-0.5" />
                  <span className="text-[#374151] text-sm">{f}</span>
                </li>
              ))}
            </ul>

            <Link
              to="/login?mode=register"
              className="flex items-center justify-center gap-2 w-full py-3.5 rounded-xl text-sm font-semibold transition-colors bg-black hover:bg-[#333333] text-white"
            >
              Commencer l'essai gratuit
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

        {/* Money-back guarantee */}
        <div className="mt-8 flex items-center justify-center gap-3 text-center">
          <ShieldCheck className="w-5 h-5 text-black flex-shrink-0" />
          <p className="text-sm text-[#6B7280]">
            <span className="font-semibold text-black">Essai gratuit 7 jours, sans carte bancaire, sans engagement.</span>{' '}
            Essayez sans risque.
          </p>
        </div>
      </section>

      {/* Ce que l'offre contient — verifiable, par opposition a de la preuve sociale.
          FIX 2026-09-24 : ce bloc annoncait "des restaurants actifs", "4.8/5" avec
          quatre etoiles pleines, et "-5pts de food cost moyen". Aucun de ces trois
          chiffres n'existe : la base compte une vingtaine de comptes, aucun abonne
          payant, et aucune note client n'a jamais ete collectee. Un avis ou une
          statistique client fabriques relevent de la pratique commerciale trompeuse
          (Code de la consommation, art. L121-2 et suivants), et le premier prospect
          qui verifie perd confiance pour de bon.
          Remplace par ce qui est vrai AUJOURD'HUI et qui se verifie en un clic. */}
      <section className="border-y border-mono-900 bg-mono-1000 py-12 px-4 sm:px-6">
        <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          <div>
            <p className="text-3xl font-extrabold text-black">7 jours</p>
            <p className="text-sm text-[#6B7280] mt-1">Essai gratuit, sans carte</p>
          </div>
          <div>
            <p className="text-3xl font-extrabold text-black">Sans</p>
            <p className="text-sm text-[#6B7280] mt-1">engagement ni frais caché</p>
          </div>
          <div>
            <p className="text-3xl font-extrabold text-black">Illimitées</p>
            <p className="text-sm text-[#6B7280] mt-1">Fiches techniques et recettes</p>
          </div>
          <div>
            <p className="text-3xl font-extrabold text-black">2 min</p>
            <p className="text-sm text-[#6B7280] mt-1">Pour commencer</p>
          </div>
        </div>
      </section>

      {/* ROI Calculator */}
      <section className="bg-mono-1000 border-y border-mono-900 py-24 px-4 sm:px-6">
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
      <section className="border-t border-mono-900 bg-black py-20 px-4 sm:px-6 text-center">
        <h2 className="text-2xl sm:text-3xl font-bold text-white mb-3">
          Prêt à reprendre le contrôle de vos marges ?
        </h2>
        <p className="text-white/50 mb-8 max-w-lg mx-auto">
          Essayez gratuitement pendant 7 jours, sans carte bancaire. Ensuite 19 € par mois, sans engagement.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            to="/login?mode=register"
            className="inline-flex items-center gap-2 px-8 py-3.5 bg-white hover:bg-mono-950 text-black font-semibold rounded-xl transition-colors"
          >
            Commencer l'essai gratuit
            <ArrowRight className="w-5 h-5" />
          </Link>
          <Link
            to="/demo"
            className="inline-flex items-center gap-2 px-8 py-3.5 border border-white/20 hover:border-white/40 text-white font-semibold rounded-xl transition-colors"
          >
            <Eye className="w-5 h-5" />
            Voir la démo
          </Link>
        </div>
        <div className="mt-6 flex items-center justify-center gap-2">
          <ShieldCheck className="w-4 h-4 text-white/40" />
          <p className="text-xs text-white/40">Essai gratuit 7 jours, sans carte bancaire, sans engagement</p>
        </div>
      </section>
      <PublicFooter />
    </div>
  );
}
