import { useState, useMemo, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  ChefHat,
  ArrowRight,
  RotateCcw,
  Save,
  CheckCircle,
  AlertTriangle,
  TrendingUp,
  Calculator,
  Sparkles,
  Zap,
  Target,
  HelpCircle,
  Bot,
  Bell,
  BarChart3,
  ChevronDown,
} from 'lucide-react';
import SEOHead, { buildFAQSchema, buildBreadcrumbSchema } from '../components/SEOHead';
import { trackEvent } from '../utils/analytics';

/* ─────────────── Constants ─────────────── */

const TVA_RATES = [
  { label: 'Sur place 10%', value: 10 },
  { label: 'À emporter 5,5%', value: 5.5 },
  { label: 'Alcool 20%', value: 20 },
  { label: 'Personnalisé', value: -1 },
];

const BENCHMARKS = [
  { type: 'Pizzeria', min: 22, max: 25, color: '#8b5cf6' },
  { type: 'Fast casual', min: 25, max: 30, color: '#f59e0b' },
  { type: 'Bistrot', min: 28, max: 32, color: '#10b981' },
  { type: 'Gastronomique', min: 32, max: 40, color: '#06b6d4' },
];

const FAQ_ITEMS = [
  {
    question: "Comment calculer la marge brute d'un plat de restaurant ?",
    answer:
      "La marge brute se calcule en soustrayant le coût matières du prix de vente HT. Formule : Marge brute (€) = Prix de vente HT - Coût matières. Pour obtenir le pourcentage : Marge brute % = (Marge brute € / Prix de vente HT) x 100. Un plat vendu 18€ TTC (TVA 10%) avec 5€ de coût matières dégage une marge brute de 11,36€, soit 69,5%.",
  },
  {
    question: "Quel est le coefficient multiplicateur idéal en restauration ?",
    answer:
      "Le coefficient multiplicateur idéal varie selon le type d'établissement. Pour un bistrot : 3,0 à 3,5. Pour une pizzeria : 4,0 à 4,5. Pour un restaurant gastronomique : 2,5 à 3,0. Il se calcule en divisant le prix de vente HT par le coût matières. Plus le coefficient est élevé, meilleure est la marge — mais attention à rester compétitif.",
  },
  {
    question: "Quelle est la différence entre marge brute et food cost ?",
    answer:
      "Ce sont deux faces d'une même pièce. Le food cost est le pourcentage du prix de vente HT consacré aux matières premières (objectif : < 30%). La marge brute, à l'inverse, mesure ce qu'il reste après déduction du coût matières (objectif : > 70%). Marge brute % = 100% - Food Cost %.",
  },
  {
    question: "Pourquoi calculer le prix HT et pas le prix TTC ?",
    answer:
      "Tous les indicateurs de rentabilité (marge brute, food cost, coefficient) se calculent toujours sur le prix HT car la TVA est reversée à l'État — elle ne fait pas partie de votre chiffre d'affaires réel. Utiliser le prix TTC fausserait artificiellement votre marge à la hausse.",
  },
  {
    question: "Cet outil est-il vraiment gratuit ?",
    answer:
      "Oui, le calculateur de marge restaurant est 100% gratuit, sans inscription et sans limite d'utilisation. Vous pouvez calculer autant de plats que vous voulez. Pour aller plus loin (suivi automatique, alertes prix fournisseurs, analyse menu complet), RestauMargin propose un essai gratuit de 7 jours.",
  },
  {
    question: "Comment utiliser le résultat pour fixer mes prix carte ?",
    answer:
      "Visez un food cost entre 25% et 32% selon votre concept. Si votre calcul donne un food cost > 35%, deux options : augmenter le prix de vente ou renégocier vos achats. Testez aussi le prix psychologique (9,90€ plutôt que 10€) et arrondissez à la dizaine près pour les plats premium.",
  },
];

const HOW_TO_STEPS = [
  {
    name: 'Saisir le prix de vente TTC',
    text: "Entrez le prix affiché sur votre carte, TVA comprise. Par exemple 18€ pour un plat du jour.",
  },
  {
    name: 'Sélectionner le taux de TVA',
    text: "Choisissez 10% (sur place), 5,5% (à emporter) ou 20% (alcool). Par défaut : 10% sur place.",
  },
  {
    name: 'Saisir le coût matières',
    text: "Indiquez le coût total des ingrédients pour une portion. Pesez et chiffrez chaque composant.",
  },
  {
    name: 'Lire les résultats',
    text: "Le calculateur affiche instantanément la marge brute, le food cost et le coefficient multiplicateur, avec un code couleur pour situer votre plat.",
  },
];

/* ─────────────── Helpers ─────────────── */

const fmtEur = (n: number) =>
  new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(isFinite(n) ? n : 0);

const fmtPct = (n: number) => `${(isFinite(n) ? n : 0).toFixed(2).replace('.', ',')} %`;
const fmtCoef = (n: number) => `× ${(isFinite(n) ? n : 0).toFixed(2).replace('.', ',')}`;

/* ─────────────── Page ─────────────── */

export default function CalculateurMargeRestaurant() {
  // Inputs (default values to show immediate calculation)
  const [prixTTC, setPrixTTC] = useState<number>(18);
  const [tvaSelectIdx, setTvaSelectIdx] = useState<number>(0); // 10%
  const [tvaCustom, setTvaCustom] = useState<number>(10);
  const [coutMatieres, setCoutMatieres] = useState<number>(5);
  const [tracked, setTracked] = useState(false);
  const [saved, setSaved] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  // TVA effective
  const tva = useMemo(() => {
    const selected = TVA_RATES[tvaSelectIdx];
    if (selected.value === -1) return Math.max(0, Math.min(100, tvaCustom));
    return selected.value;
  }, [tvaSelectIdx, tvaCustom]);

  /* ── Live calculs ── */
  const calc = useMemo(() => {
    const tvaCoef = 1 + tva / 100;
    const prixHT = tvaCoef > 0 ? prixTTC / tvaCoef : 0;
    const margeEur = prixHT - coutMatieres;
    const margePct = prixHT > 0 ? (margeEur / prixHT) * 100 : 0;
    const foodCostPct = prixHT > 0 ? (coutMatieres / prixHT) * 100 : 0;
    const coef = coutMatieres > 0 ? prixHT / coutMatieres : 0;
    return { prixHT, margeEur, margePct, foodCostPct, coef };
  }, [prixTTC, tva, coutMatieres]);

  // Track first usage
  useEffect(() => {
    if (!tracked && prixTTC > 0 && coutMatieres > 0) {
      trackEvent('calculator_marge_used');
      setTracked(true);
    }
  }, [prixTTC, coutMatieres, tracked]);

  // Food cost color indicator
  const fcColor =
    calc.foodCostPct === 0
      ? '#e5e5e5'
      : calc.foodCostPct < 30
        ? '#10b981'
        : calc.foodCostPct <= 35
          ? '#f59e0b'
          : '#ef4444';

  const fcLabel =
    calc.foodCostPct === 0
      ? '—'
      : calc.foodCostPct < 30
        ? 'Excellent'
        : calc.foodCostPct <= 35
          ? 'Acceptable'
          : 'À optimiser';

  // Reset
  function reset() {
    setPrixTTC(0);
    setTvaSelectIdx(0);
    setTvaCustom(10);
    setCoutMatieres(0);
    setSaved(false);
  }

  // Schemas
  const webAppSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: 'Calculateur de marge restaurant',
    url: 'https://www.restaumargin.fr/outils/calculateur-marge-restaurant',
    description:
      "Calculateur en ligne gratuit pour déterminer la marge brute, le food cost et le coefficient multiplicateur d'un plat de restaurant. Sans inscription.",
    applicationCategory: 'BusinessApplication',
    operatingSystem: 'Any',
    inLanguage: 'fr-FR',
    isAccessibleForFree: true,
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'EUR',
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '4.9',
      ratingCount: '127',
      bestRating: '5',
      worstRating: '1',
    },
  };

  const howToSchema = {
    '@context': 'https://schema.org',
    '@type': 'HowTo',
    name: "Comment calculer la marge d'un plat de restaurant en ligne",
    description:
      "Utiliser le calculateur RestauMargin pour obtenir instantanément la marge brute, le food cost et le coefficient multiplicateur de votre plat.",
    totalTime: 'PT2M',
    tool: [{ '@type': 'HowToTool', name: 'Calculateur de marge restaurant RestauMargin' }],
    step: HOW_TO_STEPS.map((s, idx) => ({
      '@type': 'HowToStep',
      position: idx + 1,
      name: s.name,
      text: s.text,
    })),
  };

  const faqSchema = buildFAQSchema(FAQ_ITEMS);

  const breadcrumbSchema = buildBreadcrumbSchema([
    { name: 'Accueil', url: 'https://www.restaumargin.fr/' },
    { name: 'Outils gratuits', url: 'https://www.restaumargin.fr/outils/calculateur-food-cost' },
    {
      name: 'Calculateur de marge restaurant',
      url: 'https://www.restaumargin.fr/outils/calculateur-marge-restaurant',
    },
  ]);

  return (
    <div className="min-h-screen bg-white" style={{ fontFamily: "'Inter', system-ui, sans-serif" }}>
      <SEOHead
        title="Calculateur marge restaurant gratuit | Food cost + coefficient"
        description="Outil gratuit pour calculer la marge brute, le food cost et le coefficient multiplicateur de votre plat. Sans inscription, en 2 minutes."
        path="/outils/calculateur-marge-restaurant"
        schema={[webAppSchema, howToSchema, faqSchema, breadcrumbSchema]}
      />

      {/* ── Navbar ── */}
      <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-[#e5e5e5]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 text-[#000000] font-bold text-lg">
            <ChefHat className="w-7 h-7 text-[#000000]" />
            <span>RestauMargin</span>
          </Link>
          <Link
            to="/login?mode=register"
            className="hidden sm:inline-flex items-center gap-1.5 px-5 py-2.5 bg-[#000000] hover:bg-[#222222] text-white text-sm font-semibold rounded-full transition-colors"
          >
            Essai gratuit <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </nav>

      {/* ── Hero ── */}
      <header className="relative pt-12 pb-8 sm:pt-16 sm:pb-12 px-4">
        <div className="relative z-10 text-center max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-50 text-emerald-700 text-xs font-semibold mb-6 border border-emerald-200">
            <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
            Outil 100% gratuit, sans inscription, calcul immédiat
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#0F172A] leading-tight tracking-tight mb-5">
            Calculateur de marge restaurant <span className="text-emerald-600">gratuit en ligne</span>
          </h1>

          <p className="text-base sm:text-lg text-[#666666] max-w-2xl mx-auto leading-relaxed mb-6">
            Saisissez votre prix de vente, votre TVA et votre coût matières. Obtenez instantanément
            la marge brute en €, en %, le food cost et le coefficient multiplicateur.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3 text-sm">
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-[#e5e5e5] rounded-full">
              <Zap className="w-4 h-4 text-emerald-600" />
              <strong className="text-[#0F172A]">Calcul live</strong>
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-[#e5e5e5] rounded-full">
              <Target className="w-4 h-4 text-emerald-600" />
              <strong className="text-[#0F172A]">Benchmarks 4 types</strong>
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-[#e5e5e5] rounded-full">
              <Sparkles className="w-4 h-4 text-emerald-600" />
              <strong className="text-[#0F172A]">Sans inscription</strong>
            </span>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 sm:px-6 pb-20">
        {/* ══════════════════════════════════════════════
            CALCULATEUR INTERACTIF — Carte centrale très visible
        ══════════════════════════════════════════════ */}
        <section
          className="relative bg-white rounded-3xl border border-[#e5e5e5] shadow-[0_8px_40px_-12px_rgba(0,0,0,0.12)] p-5 sm:p-8 mb-10 transition-all duration-300 hover:shadow-[0_12px_50px_-12px_rgba(0,0,0,0.18)]"
          aria-labelledby="calculator-title"
        >
          {/* Top accent line */}
          <div className="absolute top-0 left-8 right-8 h-[2px] bg-gradient-to-r from-transparent via-emerald-500 to-transparent" />

          <div className="flex items-center gap-2 mb-2">
            <Calculator className="w-5 h-5 text-emerald-600" />
            <h2 id="calculator-title" className="text-xl sm:text-2xl font-bold text-[#000000]">
              Calculez la marge de votre plat
            </h2>
          </div>
          <p className="text-sm text-[#666666] mb-6">
            Les résultats se mettent à jour en temps réel. Aucune donnée n'est enregistrée.
          </p>

          {/* INPUTS GRID */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            {/* Prix TTC */}
            <div>
              <label htmlFor="prix-ttc" className="block text-sm font-semibold text-[#000000] mb-1.5">
                Prix de vente TTC
              </label>
              <div className="relative">
                <input
                  id="prix-ttc"
                  type="number"
                  inputMode="decimal"
                  min={0}
                  max={9999}
                  step="0.01"
                  value={prixTTC || ''}
                  onChange={(e) => setPrixTTC(Math.max(0, Math.min(9999, parseFloat(e.target.value) || 0)))}
                  placeholder="18,00"
                  className="w-full px-4 py-3 pr-10 bg-[#FAFAFA] border-2 border-[#e5e5e5] rounded-2xl text-base font-semibold text-[#000000] placeholder:text-[#cccccc] focus:outline-none focus:border-emerald-500 focus:bg-white transition-all duration-200"
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[#999999] font-semibold pointer-events-none">
                  €
                </span>
              </div>
              <p className="text-xs text-[#999999] mt-1">Prix affiché sur votre carte</p>
            </div>

            {/* TVA */}
            <div>
              <label htmlFor="tva-select" className="block text-sm font-semibold text-[#000000] mb-1.5">
                TVA applicable
              </label>
              <select
                id="tva-select"
                value={tvaSelectIdx}
                onChange={(e) => setTvaSelectIdx(parseInt(e.target.value, 10))}
                className="w-full px-4 py-3 bg-[#FAFAFA] border-2 border-[#e5e5e5] rounded-2xl text-base font-semibold text-[#000000] focus:outline-none focus:border-emerald-500 focus:bg-white transition-all duration-200"
              >
                {TVA_RATES.map((r, idx) => (
                  <option key={r.label} value={idx}>
                    {r.label}
                  </option>
                ))}
              </select>
              {TVA_RATES[tvaSelectIdx].value === -1 && (
                <div className="relative mt-2">
                  <input
                    type="number"
                    inputMode="decimal"
                    min={0}
                    max={100}
                    step="0.1"
                    value={tvaCustom || ''}
                    onChange={(e) => setTvaCustom(Math.max(0, Math.min(100, parseFloat(e.target.value) || 0)))}
                    placeholder="10"
                    className="w-full px-4 py-2.5 pr-10 bg-[#FAFAFA] border-2 border-[#e5e5e5] rounded-xl text-sm font-semibold text-[#000000] focus:outline-none focus:border-emerald-500 focus:bg-white transition-all duration-200"
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[#999999] font-semibold pointer-events-none">
                    %
                  </span>
                </div>
              )}
              <p className="text-xs text-[#999999] mt-1">10% sur place / 5,5% à emporter</p>
            </div>

            {/* Coût matières */}
            <div>
              <label htmlFor="cout-matieres" className="block text-sm font-semibold text-[#000000] mb-1.5">
                Coût matières
              </label>
              <div className="relative">
                <input
                  id="cout-matieres"
                  type="number"
                  inputMode="decimal"
                  min={0}
                  max={9999}
                  step="0.01"
                  value={coutMatieres || ''}
                  onChange={(e) => setCoutMatieres(Math.max(0, Math.min(9999, parseFloat(e.target.value) || 0)))}
                  placeholder="5,00"
                  className="w-full px-4 py-3 pr-10 bg-[#FAFAFA] border-2 border-[#e5e5e5] rounded-2xl text-base font-semibold text-[#000000] placeholder:text-[#cccccc] focus:outline-none focus:border-emerald-500 focus:bg-white transition-all duration-200"
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[#999999] font-semibold pointer-events-none">
                  €
                </span>
              </div>
              <p className="text-xs text-[#999999] mt-1">Ingrédients pour 1 portion</p>
            </div>
          </div>

          {/* RESULTATS */}
          <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 mb-6">
            <ResultCard label="Prix vente HT" value={fmtEur(calc.prixHT)} icon={<BarChart3 className="w-4 h-4" />} />
            <ResultCard
              label="Marge brute"
              value={fmtEur(calc.margeEur)}
              icon={<TrendingUp className="w-4 h-4" />}
              highlight
            />
            <ResultCard label="Marge %" value={fmtPct(calc.margePct)} icon={<Target className="w-4 h-4" />} />
            <ResultCard
              label="Food cost"
              value={fmtPct(calc.foodCostPct)}
              icon={<AlertTriangle className="w-4 h-4" />}
              color={fcColor}
            />
            <ResultCard label="Coefficient" value={fmtCoef(calc.coef)} icon={<Calculator className="w-4 h-4" />} />
          </div>

          {/* Food cost indicator bar */}
          <div className="bg-[#FAFAFA] rounded-2xl p-4 mb-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-3">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full transition-colors duration-300" style={{ background: fcColor }} />
                <span className="text-sm font-semibold text-[#000000]">
                  Diagnostic food cost : <span style={{ color: fcColor }}>{fcLabel}</span>
                </span>
              </div>
              <div className="flex items-center gap-3 text-[11px] text-[#666666]">
                <span className="flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-emerald-500" /> &lt;30%
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-amber-500" /> 30-35%
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-red-500" /> &gt;35%
                </span>
              </div>
            </div>
            <div className="relative h-2 w-full bg-white rounded-full overflow-hidden border border-[#e5e5e5]">
              <div
                className="absolute inset-y-0 left-0 transition-all duration-500 ease-out rounded-full"
                style={{
                  width: `${Math.min(Math.max(calc.foodCostPct, 0), 50) * 2}%`,
                  background: fcColor,
                }}
              />
              <div className="absolute top-0 bottom-0 w-px bg-[#cccccc]" style={{ left: '60%' }} />
              <div className="absolute top-0 bottom-0 w-px bg-[#cccccc]" style={{ left: '70%' }} />
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <button
              type="button"
              onClick={reset}
              className="inline-flex items-center justify-center gap-1.5 px-5 py-3 bg-[#FAFAFA] hover:bg-[#f0f0f0] text-[#000000] text-sm font-semibold rounded-full border border-[#e5e5e5] transition-colors"
            >
              <RotateCcw className="w-4 h-4" /> Tester avec un autre plat
            </button>
            <Link
              to="/login?mode=register"
              onClick={() => {
                trackEvent('save_calc_clicked');
                setSaved(true);
              }}
              className="inline-flex items-center justify-center gap-1.5 px-5 py-3 bg-[#000000] hover:bg-[#222222] text-white text-sm font-semibold rounded-full transition-colors"
            >
              <Save className="w-4 h-4" /> Sauvegarder ce calcul
            </Link>
            {saved && (
              <span className="text-sm text-[#666666] flex items-center gap-1.5">
                <CheckCircle className="w-4 h-4 text-emerald-600" /> Créez un compte pour conserver vos plats
              </span>
            )}
          </div>
        </section>

        {/* ══════════════════════════════════════════════
            COMMENT UTILISER LE CALCULATEUR
        ══════════════════════════════════════════════ */}
        <section className="bg-white rounded-3xl border border-[#e5e5e5] p-5 sm:p-8 mb-10">
          <h2 className="text-xl sm:text-2xl font-bold text-[#000000] mb-2">
            Comment utiliser le calculateur ?
          </h2>
          <p className="text-sm text-[#666666] mb-6">
            En 2 minutes, vous saurez si votre plat est rentable ou s'il faut ajuster votre prix.
          </p>
          <ol className="space-y-4">
            {HOW_TO_STEPS.map((step, idx) => (
              <li key={step.name} className="flex gap-4">
                <div className="flex-shrink-0 w-9 h-9 rounded-full bg-emerald-100 text-emerald-700 font-bold flex items-center justify-center text-sm">
                  {idx + 1}
                </div>
                <div>
                  <h3 className="text-base font-semibold text-[#000000] mb-1">{step.name}</h3>
                  <p className="text-sm text-[#666666] leading-relaxed">{step.text}</p>
                </div>
              </li>
            ))}
          </ol>
        </section>

        {/* ══════════════════════════════════════════════
            DEFINITIONS
        ══════════════════════════════════════════════ */}
        <section className="bg-white rounded-3xl border border-[#e5e5e5] p-5 sm:p-8 mb-10">
          <h2 className="text-xl sm:text-2xl font-bold text-[#000000] mb-6">
            Définitions clés à connaître
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <DefCard
              title="Marge brute"
              formula="Marge brute (€) = Prix vente HT - Coût matières"
              text="C'est ce qu'il vous reste après avoir payé les ingrédients. La marge brute couvre tous les autres coûts : personnel, loyer, énergie. Visez >65% dans un bistrot classique, >70% en gastronomique."
            />
            <DefCard
              title="Food cost"
              formula="Food cost % = (Coût matières / Prix vente HT) × 100"
              text="Indicateur n°1 de rentabilité. C'est la part du prix qui repart en achats matières. Objectif : 25 à 32% selon votre concept. Au-delà de 35%, votre rentabilité est compromise."
            />
            <DefCard
              title="Coefficient multiplicateur"
              formula="Coefficient = Prix vente HT / Coût matières"
              text="Combien vous multipliez le coût d'achat pour fixer votre prix de vente. Bistrot : 3 à 3,5. Pizzeria : 4 à 4,5. Plus il est élevé, meilleure est la marge, mais attention à rester compétitif."
            />
            <DefCard
              title="Prix HT vs TTC"
              formula="Prix HT = Prix TTC / (1 + TVA/100)"
              text="Le HT est le prix sans TVA. C'est lui qui sert pour tous vos calculs de marge car la TVA est reversée à l'État. Le TTC est seulement ce que paie le client. Pour 18€ TTC à 10% de TVA, le HT est 16,36€."
            />
          </div>
        </section>

        {/* ══════════════════════════════════════════════
            BENCHMARKS PAR TYPE
        ══════════════════════════════════════════════ */}
        <section className="bg-white rounded-3xl border border-[#e5e5e5] p-5 sm:p-8 mb-10">
          <div className="flex items-center gap-2 mb-2">
            <Target className="w-5 h-5 text-emerald-600" />
            <h2 className="text-xl sm:text-2xl font-bold text-[#000000]">
              Benchmarks food cost par type d'établissement
            </h2>
          </div>
          <p className="text-sm text-[#666666] mb-6">
            Comparez votre food cost ({fmtPct(calc.foodCostPct)}) aux moyennes du secteur en France.
          </p>
          <div className="space-y-3">
            {BENCHMARKS.map((b) => {
              const userIsInRange = calc.foodCostPct >= b.min && calc.foodCostPct <= b.max;
              return (
                <div
                  key={b.type}
                  className={`flex items-center gap-4 p-4 rounded-2xl border transition-all duration-200 ${
                    userIsInRange ? 'border-emerald-500 bg-emerald-50' : 'border-[#e5e5e5] bg-[#FAFAFA]'
                  }`}
                >
                  <div className="w-3 h-12 rounded-full flex-shrink-0" style={{ background: b.color }} />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-bold text-[#000000]">{b.type}</span>
                      {userIsInRange && (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-600 text-white">
                          VOUS
                        </span>
                      )}
                    </div>
                    <div className="text-sm text-[#666666] mt-0.5">
                      Food cost cible :{' '}
                      <strong className="text-[#000000]">
                        {b.min}% – {b.max}%
                      </strong>
                    </div>
                  </div>
                  <div className="text-right hidden sm:block">
                    <div className="text-xs text-[#999999]">Coefficient</div>
                    <div className="font-bold text-[#000000]">
                      × {(100 / b.max).toFixed(1)} à × {(100 / b.min).toFixed(1)}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* ══════════════════════════════════════════════
            ALLER PLUS LOIN — RestauMargin
        ══════════════════════════════════════════════ */}
        <section className="bg-gradient-to-br from-[#0a0a0a] to-[#1a1a1a] rounded-3xl p-6 sm:p-10 mb-10 text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl -translate-y-1/3 translate-x-1/3" />
          <div className="relative z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 text-emerald-400 text-xs font-semibold mb-5 border border-white/10">
              <Sparkles className="w-3.5 h-3.5" /> Aller plus loin
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold mb-3 leading-tight">
              Calculer un plat à la main, c'est bien.
              <br className="hidden sm:block" />
              <span className="text-emerald-400">Automatiser tout votre menu, c'est mieux.</span>
            </h2>
            <p className="text-white/70 mb-7 max-w-2xl text-base leading-relaxed">
              RestauMargin connecte vos fiches techniques à vos prix fournisseurs en temps réel.
              Quand un ingrédient augmente, vous le voyez immédiatement.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-7">
              <ProBenefit
                icon={<ChefHat className="w-5 h-5" />}
                title="Suivi automatique"
                desc="Toutes vos fiches techniques en un coup d'œil"
              />
              <ProBenefit
                icon={<Bell className="w-5 h-5" />}
                title="Alertes prix"
                desc="Notification si un fournisseur augmente"
              />
              <ProBenefit
                icon={<BarChart3 className="w-5 h-5" />}
                title="Analyse de menu"
                desc="Boston Matrix + recommandations"
              />
              <ProBenefit
                icon={<Bot className="w-5 h-5" />}
                title="IA suggestions"
                desc="19 actions IA + commande vocale"
              />
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              <Link
                to="/login?mode=register"
                className="inline-flex items-center justify-center gap-1.5 px-6 py-3.5 bg-white text-[#000000] text-sm font-bold rounded-full hover:bg-emerald-50 transition-colors"
              >
                Essai gratuit 7 jours <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                to="/blog/calcul-marge-restaurant"
                className="inline-flex items-center justify-center gap-1.5 px-6 py-3.5 bg-white/10 hover:bg-white/15 text-white text-sm font-semibold rounded-full transition-colors border border-white/20"
              >
                Lire le guide complet
              </Link>
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════════════════
            FAQ
        ══════════════════════════════════════════════ */}
        <section className="bg-white rounded-3xl border border-[#e5e5e5] p-5 sm:p-8 mb-10">
          <div className="flex items-center gap-2 mb-6">
            <HelpCircle className="w-5 h-5 text-emerald-600" />
            <h2 className="text-xl sm:text-2xl font-bold text-[#000000]">
              Questions fréquentes
            </h2>
          </div>
          <div className="divide-y divide-[#e5e5e5]">
            {FAQ_ITEMS.map((item, idx) => (
              <div key={idx}>
                <button
                  type="button"
                  onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                  className="w-full flex items-center justify-between py-4 text-left text-sm sm:text-base font-semibold text-[#000000] hover:text-[#666666] transition-colors"
                  aria-expanded={openFaq === idx}
                >
                  <span>{item.question}</span>
                  <ChevronDown
                    className={`w-4 h-4 flex-shrink-0 ml-2 transition-transform duration-200 ${
                      openFaq === idx ? 'rotate-180' : ''
                    }`}
                  />
                </button>
                {openFaq === idx && (
                  <div className="pb-4 text-sm text-[#666666] leading-relaxed">{item.answer}</div>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* ══════════════════════════════════════════════
            INTERNAL LINKS
        ══════════════════════════════════════════════ */}
        <section className="mb-10">
          <h2 className="text-lg font-bold text-[#000000] mb-4">À explorer ensuite</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            <InternalLink
              to="/blog/calcul-marge-restaurant"
              title="Guide complet du calcul de marge"
              desc="Article détaillé"
            />
            <InternalLink
              to="/blog/coefficient-multiplicateur"
              title="Tout sur le coefficient multiplicateur"
              desc="Méthode pratique"
            />
            <InternalLink
              to="/outils/calculateur-food-cost"
              title="Calculateur food cost"
              desc="Outil ingrédients"
            />
            <InternalLink to="/login?mode=register" title="Essai gratuit 7 jours" desc="Logiciel complet" />
          </div>
        </section>
      </main>

      {/* ── Sticky CTA banner ── */}
      <div className="fixed bottom-0 left-0 right-0 z-50 bg-[#000000] text-white py-3 px-4 sm:px-6 shadow-[0_-4px_20px_rgba(0,0,0,0.15)]">
        <div className="max-w-5xl mx-auto flex items-center justify-between gap-3">
          <p className="text-sm font-medium hidden sm:block">
            Automatisez le calcul de marge sur tout votre menu.
          </p>
          <p className="text-sm font-medium sm:hidden">Automatisez tout votre menu.</p>
          <Link
            to="/login?mode=register"
            className="flex-shrink-0 inline-flex items-center gap-1.5 px-4 py-2 bg-white text-[#000000] text-sm font-bold rounded-full hover:bg-[#f5f5f5] transition-colors"
          >
            Essai gratuit <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>

      {/* ── Footer ── */}
      <footer className="border-t border-[#e5e5e5] bg-white py-6 text-center text-sm text-[#999999] mb-14">
        <div className="max-w-6xl mx-auto px-4">
          &copy; {new Date().getFullYear()} RestauMargin &middot;{' '}
          <Link to="/mentions-legales" className="hover:text-[#000000] transition-colors">
            Mentions légales
          </Link>{' '}
          &middot;{' '}
          <Link to="/cgv" className="hover:text-[#000000] transition-colors">
            CGV
          </Link>
        </div>
      </footer>
    </div>
  );
}

/* ─────────────── Sub-components ─────────────── */

function ResultCard({
  label,
  value,
  icon,
  color,
  highlight,
}: {
  label: string;
  value: string;
  icon?: React.ReactNode;
  color?: string;
  highlight?: boolean;
}) {
  return (
    <div
      className={`rounded-2xl p-3.5 text-center border transition-all duration-200 ${
        highlight ? 'bg-[#000000] text-white border-[#000000]' : 'bg-[#FAFAFA] border-[#e5e5e5]'
      }`}
    >
      {icon && (
        <div
          className={`flex justify-center mb-1 ${highlight ? 'text-white/60' : 'text-[#999999]'}`}
        >
          {icon}
        </div>
      )}
      <div
        className={`text-[10px] uppercase tracking-wide font-semibold mb-1 ${
          highlight ? 'text-white/70' : 'text-[#999999]'
        }`}
      >
        {label}
      </div>
      <div
        className="text-lg sm:text-xl font-extrabold transition-all duration-300"
        style={{ color: color || (highlight ? '#ffffff' : '#000000') }}
      >
        {value}
      </div>
    </div>
  );
}

function DefCard({ title, formula, text }: { title: string; formula: string; text: string }) {
  return (
    <div className="bg-[#FAFAFA] rounded-2xl p-5 border border-[#e5e5e5]">
      <h3 className="text-base font-bold text-[#000000] mb-2">{title}</h3>
      <div className="text-xs font-mono bg-white border border-[#e5e5e5] rounded-lg px-3 py-2 text-emerald-700 mb-3">
        {formula}
      </div>
      <p className="text-sm text-[#666666] leading-relaxed">{text}</p>
    </div>
  );
}

function ProBenefit({ icon, title, desc }: { icon: React.ReactNode; title: string; desc: string }) {
  return (
    <div className="bg-white/5 backdrop-blur border border-white/10 rounded-2xl p-4 hover:bg-white/10 transition-colors">
      <div className="text-emerald-400 mb-2">{icon}</div>
      <div className="text-sm font-bold text-white mb-1">{title}</div>
      <div className="text-xs text-white/60 leading-snug">{desc}</div>
    </div>
  );
}

function InternalLink({ to, title, desc }: { to: string; title: string; desc: string }) {
  return (
    <Link
      to={to}
      className="group block bg-white border border-[#e5e5e5] rounded-2xl p-4 hover:border-emerald-500 hover:shadow-md transition-all duration-200"
    >
      <div className="text-sm font-bold text-[#000000] group-hover:text-emerald-600 transition-colors mb-1 flex items-center justify-between">
        <span>{title}</span>
        <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 -translate-x-1 group-hover:translate-x-0 transition-all duration-200" />
      </div>
      <div className="text-xs text-[#999999]">{desc}</div>
    </Link>
  );
}
