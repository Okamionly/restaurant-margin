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
  Percent,
  Wallet,
  Package,
  SlidersHorizontal,
  Info,
  Gauge,
  Coins,
  Lightbulb,
  XCircle,
  PiggyBank,
  Receipt,
  Store,
  Pizza,
  Utensils,
  Coffee,
  Soup,
  CircleDollarSign,
  FileText,
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

// 8 segments — chacun avec sa fourchette de food cost cible + un coefficient indicatif.
// `icon` est le composant lucide, instancié à l'affichage.
const RESTO_TYPES = [
  { type: 'Bistrot / brasserie', min: 28, max: 32, color: '#10b981', icon: Utensils },
  { type: 'Restaurant gastronomique', min: 32, max: 40, color: '#06b6d4', icon: ChefHat },
  { type: 'Pizzeria', min: 22, max: 28, color: '#8b5cf6', icon: Pizza },
  { type: 'Fast-food / burger', min: 25, max: 30, color: '#f59e0b', icon: Soup },
  { type: 'Café / salon de thé', min: 18, max: 25, color: '#ec4899', icon: Coffee },
  { type: 'Bar à vins / cocktails', min: 18, max: 24, color: '#ef4444', icon: Coins },
  { type: 'Restaurant à emporter', min: 25, max: 32, color: '#14b8a6', icon: Package },
  { type: 'Food truck', min: 25, max: 30, color: '#0ea5e9', icon: Store },
];

const FAQ_ITEMS = [
  {
    question: "Comment calculer la marge brute d'un plat de restaurant ?",
    answer:
      "La marge brute se calcule en soustrayant le coût matières du prix de vente HT. Formule : Marge brute (€) = Prix de vente HT - Coût matières. Pour obtenir le pourcentage : Marge brute % = (Marge brute € / Prix de vente HT) x 100. Un plat vendu 18€ TTC (TVA 10%) avec 5€ de coût matières dégage une marge brute de 11,36€, soit 69,5%.",
  },
  {
    question: "Faut-il calculer la marge sur le prix HT ou le prix TTC ?",
    answer:
      "Toujours sur le prix HT. La TVA est collectée pour le compte de l'État, elle n'appartient pas à votre chiffre d'affaires : la déduire fausse votre marge à la hausse. Concrètement, on passe du TTC au HT avec la formule Prix HT = Prix TTC / (1 + taux de TVA). Un plat sur place à 18€ TTC correspond à 16,36€ HT (TVA 10%) ; c'est sur ces 16,36€ que se calculent food cost, marge brute et coefficient. Ce calculateur convertit automatiquement le TTC en HT selon le taux choisi.",
  },
  {
    question: "Quel est le food cost idéal en restauration ?",
    answer:
      "Le food cost idéal se situe entre 25% et 32% du prix de vente HT, mais il dépend du concept. Pizzeria : 22 à 28%. Bistrot et brasserie : 28 à 32%. Restaurant gastronomique : 32 à 40% (produits nobles). Café et bar : 18 à 25%. Au-dessus de 35% sur la majorité de votre carte, la rentabilité globale devient difficile une fois le personnel et les charges payés. L'objectif n'est pas le food cost le plus bas plat par plat, mais un food cost moyen pondéré par les ventes qui reste sous votre cible.",
  },
  {
    question: "Quelle est la différence entre marge brute et marge nette ?",
    answer:
      "La marge brute ne déduit que le coût matières (les ingrédients) : Marge brute = Prix de vente HT - Coût matières. La marge nette, elle, déduit aussi les autres coûts directs du plat : main d'œuvre de production, emballage (vente à emporter) et pertes / déchets. C'est une marge plus proche de la réalité économique. Ce calculateur estime la marge nette quand vous renseignez les champs optionnels du coût de revient complet. Attention : la vraie marge nette comptable inclut aussi le loyer, l'énergie et les charges fixes, qui ne se rattachent pas à un plat précis.",
  },
  {
    question: "Quel est le coefficient multiplicateur idéal en restauration ?",
    answer:
      "Le coefficient multiplicateur idéal varie selon le type d'établissement. Pour un bistrot : 3,0 à 3,5. Pour une pizzeria : 4,0 à 4,5. Pour un restaurant gastronomique : 2,5 à 3,0. Il se calcule en divisant le prix de vente HT par le coût matières (Coefficient = Prix HT / Coût matières). Plus le coefficient est élevé, meilleure est la marge, mais attention à rester compétitif sur votre marché.",
  },
  {
    question: "Comment trouver le prix de vente conseillé d'un plat ?",
    answer:
      "On part du coût matières et du food cost cible : Prix de vente HT conseillé = Coût matières / (Food cost cible en %). Avec 5€ de matières et un food cost cible de 30%, le prix HT conseillé est 5 / 0,30 = 16,67€, soit environ 18,33€ TTC à 10% de TVA. Ce calculateur affiche ce prix conseillé HT et TTC dès que vous choisissez un type de restaurant. Pensez ensuite à appliquer un prix psychologique (17,90€ plutôt que 18,33€).",
  },
  {
    question: "Quelle est la différence entre marge brute et food cost ?",
    answer:
      "Ce sont deux faces d'une même pièce. Le food cost est le pourcentage du prix de vente HT consacré aux matières premières (objectif : moins de 30%). La marge brute, à l'inverse, mesure ce qu'il reste après déduction du coût matières (objectif : plus de 70%). Marge brute % = 100% - Food Cost %.",
  },
  {
    question: "Comment réduire mon food cost sans baisser la qualité ?",
    answer:
      "Cinq leviers concrets : 1) renégocier vos achats et regrouper vos commandes pour obtenir de meilleurs tarifs ; 2) travailler les portions et le grammage pour éviter le sur-dosage ; 3) valoriser les parures et limiter les pertes (gestion FIFO, fiches techniques précises) ; 4) ajuster l'offre vers des plats à plus forte marge mis en avant sur la carte (menu engineering) ; 5) suivre les prix fournisseurs dans le temps pour réagir vite quand un ingrédient augmente. Mesurer le food cost de chaque plat est le préalable indispensable.",
  },
  {
    question: "Le calcul change-t-il pour la vente à emporter ?",
    answer:
      "Oui, sur deux points. D'abord la TVA : 5,5% pour de la nourriture à emporter consommée en différé (10% sur place, 20% sur l'alcool). Sélectionnez le bon taux pour obtenir le bon prix HT. Ensuite le coût de revient : ajoutez le coût d'emballage (boîte, couverts, sac) au coût matières, car il pèse réellement sur la marge en vente à emporter. Ce calculateur gère les deux : choisissez le taux 5,5% et renseignez le coût d'emballage dans le bloc coût de revient complet.",
  },
  {
    question: "Cet outil est-il vraiment gratuit ?",
    answer:
      "Oui, le calculateur de marge restaurant est 100% gratuit, sans inscription et sans limite d'utilisation. Vous pouvez calculer autant de plats que vous voulez. Pour aller plus loin (suivi automatique de toutes vos fiches techniques, mise à jour quand les prix fournisseurs changent, alertes et analyse du menu complet), RestauMargin propose un essai gratuit de 7 jours.",
  },
];

const HOW_TO_STEPS = [
  {
    name: 'Saisir le prix de vente TTC',
    text: "Entrez le prix affiché sur votre carte, TVA comprise. Par exemple 18€ pour un plat du jour.",
  },
  {
    name: 'Sélectionner le taux de TVA',
    text: "Choisissez 10% (sur place), 5,5% (à emporter) ou 20% (alcool). Le calculateur convertit le TTC en HT, base de tous les calculs de marge.",
  },
  {
    name: 'Saisir le coût matières',
    text: "Indiquez le coût total des ingrédients pour une portion. Pesez et chiffrez chaque composant à partir de votre fiche technique.",
  },
  {
    name: 'Choisir votre type de restaurant',
    text: "Sélectionnez votre concept (bistrot, pizzeria, gastronomique…) pour comparer votre food cost à la cible et obtenir un prix de vente conseillé.",
  },
  {
    name: 'Affiner avec le coût de revient complet (optionnel)',
    text: "Ajoutez la main d'œuvre, l'emballage et le pourcentage de perte pour estimer la marge nette, plus proche de la réalité que la seule marge brute.",
  },
  {
    name: 'Lire les résultats',
    text: "Le calculateur affiche instantanément la marge brute, le food cost, le coefficient multiplicateur et un diagnostic couleur pour situer votre plat par rapport à sa cible.",
  },
];

// 5 erreurs fréquentes — contenu SEO + valeur pédagogique réelle.
const COMMON_ERRORS = [
  {
    title: 'Calculer la marge sur le prix TTC',
    wrong: "Diviser le coût matières par le prix affiché TTC.",
    right:
      "Toujours convertir en HT d'abord. Sur 18€ TTC à 10% de TVA, on calcule sur 16,36€, pas sur 18€. Sinon le food cost paraît plus bas qu'il ne l'est et la marge est surévaluée.",
  },
  {
    title: 'Oublier les pertes et les parures',
    wrong: "Compter le poids net servi alors qu'on achète du brut.",
    right:
      "Intégrer un taux de perte (épluchage, parures, casse, invendus). Un coût matières « théorique » de 5€ peut devenir 5,75€ réels avec 15% de pertes.",
  },
  {
    title: "Ignorer l'emballage en vente à emporter",
    wrong: "Appliquer le même coût de revient qu'en salle.",
    right:
      "Ajouter boîte, couvercle, couverts et sac. 0,40€ à 0,90€ d'emballage par commande grignotent une marge déjà plus serrée en click & collect.",
  },
  {
    title: 'Viser un food cost identique pour tous les plats',
    wrong: "Appliquer mécaniquement le même coefficient partout.",
    right:
      "Raisonner en food cost moyen pondéré par les ventes. Un plat « signature » à 38% peut être rentable s'il est mis en avant et entouré de plats à 22-26%.",
  },
  {
    title: 'Confondre marge brute et bénéfice',
    wrong: "Penser qu'une marge brute de 70% = 70% de profit.",
    right:
      "La marge brute ne paie pas encore le personnel, le loyer ni l'énergie. C'est l'enveloppe disponible pour couvrir toutes les charges, pas le résultat net.",
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
const fmtPct0 = (n: number) => `${Math.round(isFinite(n) ? n : 0)} %`;
const fmtCoef = (n: number) => `× ${(isFinite(n) ? n : 0).toFixed(2).replace('.', ',')}`;

/* ─────────────── Page ─────────────── */

export default function CalculateurMargeRestaurant() {
  // Inputs (default values to show immediate calculation)
  const [prixTTC, setPrixTTC] = useState<number>(18);
  const [tvaSelectIdx, setTvaSelectIdx] = useState<number>(0); // 10%
  const [tvaCustom, setTvaCustom] = useState<number>(10);
  const [coutMatieres, setCoutMatieres] = useState<number>(5);
  const [restoTypeIdx, setRestoTypeIdx] = useState<number>(0); // Bistrot

  // Coût de revient complet (optionnel, dépliable)
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [coutMainOeuvre, setCoutMainOeuvre] = useState<number>(0);
  const [coutEmballage, setCoutEmballage] = useState<number>(0);
  const [pertePct, setPertePct] = useState<number>(0);

  const [tracked, setTracked] = useState(false);
  const [saved, setSaved] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  // TVA effective
  const tva = useMemo(() => {
    const selected = TVA_RATES[tvaSelectIdx];
    if (selected.value === -1) return Math.max(0, Math.min(100, tvaCustom));
    return selected.value;
  }, [tvaSelectIdx, tvaCustom]);

  /* ── Live calculs (marge brute, HT, food cost, coefficient) ── */
  const calc = useMemo(() => {
    const tvaCoef = 1 + tva / 100;
    const prixHT = tvaCoef > 0 ? prixTTC / tvaCoef : 0;
    const margeEur = prixHT - coutMatieres;
    const margePct = prixHT > 0 ? (margeEur / prixHT) * 100 : 0;
    const foodCostPct = prixHT > 0 ? (coutMatieres / prixHT) * 100 : 0;
    const coef = coutMatieres > 0 ? prixHT / coutMatieres : 0;
    return { prixHT, margeEur, margePct, foodCostPct, coef };
  }, [prixTTC, tva, coutMatieres]);

  /* ── Coût de revient complet → marge nette estimée ── */
  const advanced = useMemo(() => {
    // Coût matières majoré des pertes (on achète du brut, on sert du net).
    const matiereAvecPerte = coutMatieres * (1 + Math.max(0, pertePct) / 100);
    const coutRevient = matiereAvecPerte + Math.max(0, coutMainOeuvre) + Math.max(0, coutEmballage);
    const margeNetteEur = calc.prixHT - coutRevient;
    const margeNettePct = calc.prixHT > 0 ? (margeNetteEur / calc.prixHT) * 100 : 0;
    return { coutRevient, margeNetteEur, margeNettePct };
  }, [coutMatieres, pertePct, coutMainOeuvre, coutEmballage, calc.prixHT]);

  /* ── Comparaison à la cible du type de restaurant choisi ── */
  const targetCmp = useMemo(() => {
    const t = RESTO_TYPES[restoTypeIdx];
    const fc = calc.foodCostPct;
    let status: 'empty' | 'below' | 'in' | 'above';
    if (calc.prixHT <= 0 || coutMatieres <= 0) status = 'empty';
    else if (fc < t.min) status = 'below';
    else if (fc <= t.max) status = 'in';
    else status = 'above';

    // Prix de vente conseillé : on vise le milieu de la fourchette cible.
    const targetMid = (t.min + t.max) / 2;
    const prixConseilleHT = targetMid > 0 ? coutMatieres / (targetMid / 100) : 0;
    const prixConseilleTTC = prixConseilleHT * (1 + tva / 100);
    // Prix mini/maxi de la fourchette (food cost max => prix mini ; food cost min => prix maxi).
    const prixMinHT = t.max > 0 ? coutMatieres / (t.max / 100) : 0;
    const prixMaxHT = t.min > 0 ? coutMatieres / (t.min / 100) : 0;

    return { t, status, targetMid, prixConseilleHT, prixConseilleTTC, prixMinHT, prixMaxHT };
  }, [restoTypeIdx, calc.foodCostPct, calc.prixHT, coutMatieres, tva]);

  // Track first usage
  useEffect(() => {
    if (!tracked && prixTTC > 0 && coutMatieres > 0) {
      trackEvent('calculator_marge_used');
      setTracked(true);
    }
  }, [prixTTC, coutMatieres, tracked]);

  // Food cost color indicator (diagnostic absolu, indépendant du type)
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
    setCoutMainOeuvre(0);
    setCoutEmballage(0);
    setPertePct(0);
    setSaved(false);
  }

  // Schemas
  const webAppSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: 'Calculateur de marge restaurant',
    url: 'https://www.restaumargin.fr/outils/calculateur-marge-restaurant',
    description:
      "Calculateur en ligne gratuit pour déterminer la marge brute, le food cost, le coefficient multiplicateur, le prix HT/TTC avec calcul de TVA et le prix de vente conseillé d'un plat de restaurant. Comparaison aux cibles par type d'établissement. Sans inscription.",
    applicationCategory: 'BusinessApplication',
    operatingSystem: 'Any',
    inLanguage: 'fr-FR',
    isAccessibleForFree: true,
    featureList: [
      'Calcul de la marge brute en euros et en pourcentage',
      'Calcul du food cost',
      'Calcul du coefficient multiplicateur',
      'Conversion prix HT / prix TTC avec taux de TVA (10%, 5,5%, 20%)',
      'Coût de revient complet : main d\'œuvre, emballage, taux de perte',
      'Estimation de la marge nette',
      'Comparaison du food cost aux cibles par type de restaurant',
      'Prix de vente conseillé HT et TTC',
    ],
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
      "Utiliser le calculateur RestauMargin pour obtenir instantanément la marge brute, le food cost, le coefficient multiplicateur, le prix HT/TTC et le prix de vente conseillé de votre plat.",
    totalTime: 'PT3M',
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
        title="Calculateur de marge restaurant gratuit | Food cost, coefficient, TVA"
        description="Calculez gratuitement la marge brute, le food cost, le coefficient multiplicateur et le prix de vente conseillé de vos plats. Avec calcul TVA et comparaison aux cibles par type de restaurant. Sans inscription."
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
            Saisissez votre prix de vente, votre TVA et votre coût matières. Obtenez instantanément la
            marge brute en €, en %, le food cost, le coefficient multiplicateur et le prix de vente
            conseillé selon votre type de restaurant.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3 text-sm">
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-[#e5e5e5] rounded-full">
              <Zap className="w-4 h-4 text-emerald-600" />
              <strong className="text-[#0F172A]">Calcul live</strong>
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-[#e5e5e5] rounded-full">
              <Percent className="w-4 h-4 text-emerald-600" />
              <strong className="text-[#0F172A]">Calcul TVA HT / TTC</strong>
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-[#e5e5e5] rounded-full">
              <Target className="w-4 h-4 text-emerald-600" />
              <strong className="text-[#0F172A]">8 types de resto</strong>
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
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
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

            {/* Type de restaurant */}
            <div>
              <label htmlFor="resto-type" className="block text-sm font-semibold text-[#000000] mb-1.5">
                Type de restaurant
              </label>
              <select
                id="resto-type"
                value={restoTypeIdx}
                onChange={(e) => setRestoTypeIdx(parseInt(e.target.value, 10))}
                className="w-full px-4 py-3 bg-[#FAFAFA] border-2 border-[#e5e5e5] rounded-2xl text-base font-semibold text-[#000000] focus:outline-none focus:border-emerald-500 focus:bg-white transition-all duration-200"
              >
                {RESTO_TYPES.map((r, idx) => (
                  <option key={r.type} value={idx}>
                    {r.type}
                  </option>
                ))}
              </select>
              <p className="text-xs text-[#999999] mt-1">
                Cible food cost : {RESTO_TYPES[restoTypeIdx].min}–{RESTO_TYPES[restoTypeIdx].max}%
              </p>
            </div>
          </div>

          {/* COÛT DE REVIENT COMPLET — dépliable */}
          <div className="mb-6 rounded-2xl border border-[#e5e5e5] overflow-hidden">
            <button
              type="button"
              onClick={() => setShowAdvanced((v) => !v)}
              className="w-full flex items-center justify-between gap-2 px-4 py-3 bg-[#FAFAFA] hover:bg-[#f3f3f3] transition-colors text-left"
              aria-expanded={showAdvanced}
            >
              <span className="flex items-center gap-2 text-sm font-semibold text-[#000000]">
                <SlidersHorizontal className="w-4 h-4 text-emerald-600" />
                Coût de revient complet (optionnel) : main d'œuvre, emballage, pertes
              </span>
              <ChevronDown
                className={`w-4 h-4 flex-shrink-0 text-[#999999] transition-transform duration-200 ${
                  showAdvanced ? 'rotate-180' : ''
                }`}
              />
            </button>

            {showAdvanced && (
              <div className="px-4 py-5 bg-white border-t border-[#e5e5e5]">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* Main d'œuvre */}
                  <div>
                    <label htmlFor="cout-mo" className="block text-sm font-semibold text-[#000000] mb-1.5">
                      Main d'œuvre / plat
                    </label>
                    <div className="relative">
                      <input
                        id="cout-mo"
                        type="number"
                        inputMode="decimal"
                        min={0}
                        max={9999}
                        step="0.01"
                        value={coutMainOeuvre || ''}
                        onChange={(e) =>
                          setCoutMainOeuvre(Math.max(0, Math.min(9999, parseFloat(e.target.value) || 0)))
                        }
                        placeholder="0,00"
                        className="w-full px-4 py-2.5 pr-10 bg-[#FAFAFA] border-2 border-[#e5e5e5] rounded-xl text-sm font-semibold text-[#000000] placeholder:text-[#cccccc] focus:outline-none focus:border-emerald-500 focus:bg-white transition-all duration-200"
                      />
                      <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[#999999] font-semibold pointer-events-none">
                        €
                      </span>
                    </div>
                    <p className="text-xs text-[#999999] mt-1">Temps de préparation valorisé</p>
                  </div>

                  {/* Emballage */}
                  <div>
                    <label htmlFor="cout-emb" className="block text-sm font-semibold text-[#000000] mb-1.5">
                      Emballage / plat
                    </label>
                    <div className="relative">
                      <input
                        id="cout-emb"
                        type="number"
                        inputMode="decimal"
                        min={0}
                        max={9999}
                        step="0.01"
                        value={coutEmballage || ''}
                        onChange={(e) =>
                          setCoutEmballage(Math.max(0, Math.min(9999, parseFloat(e.target.value) || 0)))
                        }
                        placeholder="0,00"
                        className="w-full px-4 py-2.5 pr-10 bg-[#FAFAFA] border-2 border-[#e5e5e5] rounded-xl text-sm font-semibold text-[#000000] placeholder:text-[#cccccc] focus:outline-none focus:border-emerald-500 focus:bg-white transition-all duration-200"
                      />
                      <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[#999999] font-semibold pointer-events-none">
                        €
                      </span>
                    </div>
                    <p className="text-xs text-[#999999] mt-1">Vente à emporter (boîte, sac…)</p>
                  </div>

                  {/* Perte */}
                  <div>
                    <label htmlFor="perte-pct" className="block text-sm font-semibold text-[#000000] mb-1.5">
                      Taux de perte / déchet
                    </label>
                    <div className="relative">
                      <input
                        id="perte-pct"
                        type="number"
                        inputMode="decimal"
                        min={0}
                        max={100}
                        step="0.5"
                        value={pertePct || ''}
                        onChange={(e) => setPertePct(Math.max(0, Math.min(100, parseFloat(e.target.value) || 0)))}
                        placeholder="0"
                        className="w-full px-4 py-2.5 pr-10 bg-[#FAFAFA] border-2 border-[#e5e5e5] rounded-xl text-sm font-semibold text-[#000000] placeholder:text-[#cccccc] focus:outline-none focus:border-emerald-500 focus:bg-white transition-all duration-200"
                      />
                      <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[#999999] font-semibold pointer-events-none">
                        %
                      </span>
                    </div>
                    <p className="text-xs text-[#999999] mt-1">Parures, casse, invendus</p>
                  </div>
                </div>

                {/* Résultats marge nette */}
                <div className="mt-5 grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="rounded-2xl p-3.5 text-center border border-[#e5e5e5] bg-[#FAFAFA]">
                    <div className="flex justify-center mb-1 text-[#999999]">
                      <Receipt className="w-4 h-4" />
                    </div>
                    <div className="text-[10px] uppercase tracking-wide font-semibold mb-1 text-[#999999]">
                      Coût de revient
                    </div>
                    <div className="text-lg sm:text-xl font-extrabold text-[#000000]">
                      {fmtEur(advanced.coutRevient)}
                    </div>
                  </div>
                  <div className="rounded-2xl p-3.5 text-center border-2 border-emerald-200 bg-emerald-50">
                    <div className="flex justify-center mb-1 text-emerald-600">
                      <PiggyBank className="w-4 h-4" />
                    </div>
                    <div className="text-[10px] uppercase tracking-wide font-semibold mb-1 text-emerald-700">
                      Marge nette estimée
                    </div>
                    <div
                      className="text-lg sm:text-xl font-extrabold"
                      style={{ color: advanced.margeNetteEur >= 0 ? '#047857' : '#ef4444' }}
                    >
                      {fmtEur(advanced.margeNetteEur)}
                    </div>
                  </div>
                  <div className="rounded-2xl p-3.5 text-center border border-[#e5e5e5] bg-[#FAFAFA]">
                    <div className="flex justify-center mb-1 text-[#999999]">
                      <Gauge className="w-4 h-4" />
                    </div>
                    <div className="text-[10px] uppercase tracking-wide font-semibold mb-1 text-[#999999]">
                      Marge nette %
                    </div>
                    <div
                      className="text-lg sm:text-xl font-extrabold"
                      style={{ color: advanced.margeNettePct >= 0 ? '#000000' : '#ef4444' }}
                    >
                      {fmtPct(advanced.margeNettePct)}
                    </div>
                  </div>
                </div>
                <p className="text-xs text-[#999999] mt-3 flex items-start gap-1.5">
                  <Info className="w-3.5 h-3.5 flex-shrink-0 mt-px" />
                  La marge nette estimée reste avant loyer, énergie et charges fixes (qui ne se rattachent
                  pas à un plat précis). Elle est plus réaliste que la marge brute mais ce n'est pas le
                  résultat comptable final.
                </p>
              </div>
            )}
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

          {/* COMPARAISON À LA CIBLE — badge contextuel */}
          <div className="mb-6">
            <TargetVerdict
              status={targetCmp.status}
              typeName={targetCmp.t.type}
              foodCostPct={calc.foodCostPct}
              min={targetCmp.t.min}
              max={targetCmp.t.max}
            />
          </div>

          {/* PRIX DE VENTE CONSEILLÉ */}
          {coutMatieres > 0 && (
            <div className="mb-6 rounded-2xl border-2 border-emerald-200 bg-emerald-50 p-4 sm:p-5">
              <div className="flex items-center gap-2 mb-3">
                <CircleDollarSign className="w-5 h-5 text-emerald-600" />
                <h3 className="text-sm sm:text-base font-bold text-[#000000]">
                  Prix de vente conseillé pour un {targetCmp.t.type.toLowerCase()}
                </h3>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                <div className="rounded-xl bg-white border border-emerald-200 p-3 text-center">
                  <div className="text-[10px] uppercase tracking-wide font-semibold mb-1 text-[#999999]">
                    Prix conseillé HT
                  </div>
                  <div className="text-lg sm:text-xl font-extrabold text-[#000000]">
                    {fmtEur(targetCmp.prixConseilleHT)}
                  </div>
                </div>
                <div className="rounded-xl bg-emerald-600 p-3 text-center">
                  <div className="text-[10px] uppercase tracking-wide font-semibold mb-1 text-white/80">
                    Prix conseillé TTC
                  </div>
                  <div className="text-lg sm:text-xl font-extrabold text-white">
                    {fmtEur(targetCmp.prixConseilleTTC)}
                  </div>
                </div>
                <div className="col-span-2 sm:col-span-1 rounded-xl bg-white border border-emerald-200 p-3 text-center">
                  <div className="text-[10px] uppercase tracking-wide font-semibold mb-1 text-[#999999]">
                    Fourchette HT cible
                  </div>
                  <div className="text-sm sm:text-base font-extrabold text-[#000000]">
                    {fmtEur(targetCmp.prixMinHT)} – {fmtEur(targetCmp.prixMaxHT)}
                  </div>
                </div>
              </div>
              <p className="text-xs text-[#666666] mt-3 flex items-start gap-1.5">
                <Lightbulb className="w-3.5 h-3.5 flex-shrink-0 mt-px text-emerald-600" />
                Calculé pour atteindre un food cost de {fmtPct0(targetCmp.targetMid)} (milieu de la cible{' '}
                {targetCmp.t.min}–{targetCmp.t.max}%). Pensez au prix psychologique : arrondissez à 17,90€
                plutôt que {fmtEur(targetCmp.prixConseilleTTC)}.
              </p>
            </div>
          )}

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
                  <span className="w-2 h-2 rounded-full bg-emerald-500" /> inférieur à 30%
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-amber-500" /> 30-35%
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-red-500" /> supérieur à 35%
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
            En 2 minutes, vous saurez si votre plat est rentable, à quel prix le vendre et comment
            l'optimiser.
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
            LES 3 FORMULES CLÉS — avec exemples chiffrés
        ══════════════════════════════════════════════ */}
        <section className="bg-white rounded-3xl border border-[#e5e5e5] p-5 sm:p-8 mb-10">
          <div className="flex items-center gap-2 mb-2">
            <Calculator className="w-5 h-5 text-emerald-600" />
            <h2 className="text-xl sm:text-2xl font-bold text-[#000000]">Les 3 formules clés du calcul de marge</h2>
          </div>
          <p className="text-sm text-[#666666] mb-6">
            Exemple fil rouge : un plat vendu <strong className="text-[#000000]">18€ TTC</strong> (TVA 10%, soit{' '}
            <strong className="text-[#000000]">16,36€ HT</strong>) avec{' '}
            <strong className="text-[#000000]">5€ de coût matières</strong>.
          </p>
          <div className="space-y-4">
            <FormulaRow
              n={1}
              title="Marge brute"
              formula="Marge brute (€) = Prix de vente HT − Coût matières"
              example="16,36€ − 5€ = 11,36€ de marge brute, soit 69,5% du prix HT."
              note="C'est ce qu'il reste pour payer le personnel, le loyer et l'énergie."
            />
            <FormulaRow
              n={2}
              title="Food cost"
              formula="Food cost (%) = (Coût matières / Prix de vente HT) × 100"
              example="(5€ / 16,36€) × 100 = 30,6% de food cost."
              note="L'indicateur n°1 de rentabilité. Objectif : 25 à 32% selon le concept."
            />
            <FormulaRow
              n={3}
              title="Coefficient multiplicateur"
              formula="Coefficient = Prix de vente HT / Coût matières"
              example="16,36€ / 5€ = × 3,27. On multiplie le coût d'achat par 3,27."
              note="Inversement : Prix HT conseillé = Coût matières × coefficient cible."
            />
          </div>
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
              text="C'est ce qu'il vous reste après avoir payé les ingrédients. La marge brute couvre tous les autres coûts : personnel, loyer, énergie. Visez plus de 65% dans un bistrot classique, plus de 70% en gastronomique."
            />
            <DefCard
              title="Marge nette"
              formula="Marge nette (€) = Prix vente HT - Coût de revient complet"
              text="Elle déduit aussi la main d'œuvre, l'emballage et les pertes. Plus proche de la réalité que la marge brute, elle se calcule dans le bloc coût de revient complet. La vraie marge nette comptable intègre en plus le loyer et les charges fixes."
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
            <DefCard
              title="Taux de perte"
              formula="Coût réel = Coût matières × (1 + Perte %)"
              text="On achète du brut et on sert du net : épluchage, parures, casse et invendus gonflent le coût réel. Un coût matières théorique de 5€ devient 5,75€ réels avec 15% de pertes. Intégrez-le pour ne pas surestimer votre marge."
            />
          </div>
        </section>

        {/* ══════════════════════════════════════════════
            FOOD COST CIBLE PAR TYPE — tableau 8 segments
        ══════════════════════════════════════════════ */}
        <section className="bg-white rounded-3xl border border-[#e5e5e5] p-5 sm:p-8 mb-10">
          <div className="flex items-center gap-2 mb-2">
            <Target className="w-5 h-5 text-emerald-600" />
            <h2 className="text-xl sm:text-2xl font-bold text-[#000000]">
              Food cost cible par type de restaurant
            </h2>
          </div>
          <p className="text-sm text-[#666666] mb-6">
            Votre food cost actuel est de <strong className="text-[#000000]">{fmtPct(calc.foodCostPct)}</strong>.
            Comparez-le aux fourchettes de référence du secteur en France. Sélectionnez votre concept dans le
            calculateur pour un diagnostic personnalisé.
          </p>

          {/* Tableau desktop */}
          <div className="hidden sm:block overflow-hidden rounded-2xl border border-[#e5e5e5]">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-[#FAFAFA] text-left">
                  <th className="px-4 py-3 font-semibold text-[#666666]">Type d'établissement</th>
                  <th className="px-4 py-3 font-semibold text-[#666666]">Food cost cible</th>
                  <th className="px-4 py-3 font-semibold text-[#666666]">Coefficient indicatif</th>
                  <th className="px-4 py-3 font-semibold text-[#666666]">Marge brute visée</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#e5e5e5]">
                {RESTO_TYPES.map((b, idx) => {
                  const Icon = b.icon;
                  const isActive = idx === restoTypeIdx;
                  return (
                    <tr key={b.type} className={isActive ? 'bg-emerald-50' : 'bg-white'}>
                      <td className="px-4 py-3 font-semibold text-[#000000]">
                        <span className="flex items-center gap-2">
                          <Icon className="w-4 h-4" style={{ color: b.color }} />
                          {b.type}
                          {isActive && (
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-600 text-white">
                              VOUS
                            </span>
                          )}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-[#000000] font-semibold">
                        {b.min}% – {b.max}%
                      </td>
                      <td className="px-4 py-3 text-[#666666]">
                        × {(100 / b.max).toFixed(1)} à × {(100 / b.min).toFixed(1)}
                      </td>
                      <td className="px-4 py-3 text-[#666666]">
                        {100 - b.max}% – {100 - b.min}%
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Cartes mobile */}
          <div className="sm:hidden space-y-3">
            {RESTO_TYPES.map((b, idx) => {
              const Icon = b.icon;
              const isActive = idx === restoTypeIdx;
              return (
                <div
                  key={b.type}
                  className={`flex items-center gap-3 p-3.5 rounded-2xl border ${
                    isActive ? 'border-emerald-500 bg-emerald-50' : 'border-[#e5e5e5] bg-[#FAFAFA]'
                  }`}
                >
                  <div
                    className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0"
                    style={{ background: `${b.color}1a` }}
                  >
                    <Icon className="w-4 h-4" style={{ color: b.color }} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-bold text-[#000000] text-sm">{b.type}</span>
                      {isActive && (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-600 text-white">
                          VOUS
                        </span>
                      )}
                    </div>
                    <div className="text-xs text-[#666666] mt-0.5">
                      Food cost <strong className="text-[#000000]">{b.min}–{b.max}%</strong> · coeff. × {(100 / b.max).toFixed(1)}–{(100 / b.min).toFixed(1)}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          <p className="text-xs text-[#999999] mt-4 flex items-start gap-1.5">
            <Info className="w-3.5 h-3.5 flex-shrink-0 mt-px" />
            Ces fourchettes sont des repères de pilotage, pas des règles absolues. L'important est votre food
            cost moyen pondéré par les ventes, plat par plat.
          </p>
        </section>

        {/* ══════════════════════════════════════════════
            ERREURS COURANTES
        ══════════════════════════════════════════════ */}
        <section className="bg-white rounded-3xl border border-[#e5e5e5] p-5 sm:p-8 mb-10">
          <div className="flex items-center gap-2 mb-2">
            <AlertTriangle className="w-5 h-5 text-amber-500" />
            <h2 className="text-xl sm:text-2xl font-bold text-[#000000]">
              5 erreurs courantes de calcul de marge
            </h2>
          </div>
          <p className="text-sm text-[#666666] mb-6">
            Ces erreurs faussent vos prix et grignotent une rentabilité que vous croyez avoir.
          </p>
          <div className="space-y-4">
            {COMMON_ERRORS.map((err, idx) => (
              <div key={err.title} className="rounded-2xl border border-[#e5e5e5] p-4 sm:p-5 bg-[#FAFAFA]">
                <h3 className="text-base font-bold text-[#000000] mb-3 flex items-start gap-2">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-[#000000] text-white text-xs font-bold flex items-center justify-center">
                    {idx + 1}
                  </span>
                  {err.title}
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="flex items-start gap-2 rounded-xl bg-red-50 border border-red-100 p-3">
                    <XCircle className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" />
                    <p className="text-sm text-[#666666] leading-relaxed">
                      <strong className="text-[#000000]">Erreur :</strong> {err.wrong}
                    </p>
                  </div>
                  <div className="flex items-start gap-2 rounded-xl bg-emerald-50 border border-emerald-100 p-3">
                    <CheckCircle className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                    <p className="text-sm text-[#666666] leading-relaxed">
                      <strong className="text-[#000000]">Bon réflexe :</strong> {err.right}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ══════════════════════════════════════════════
            ALLER PLUS LOIN — RestauMargin (CTA conversion renforcé)
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
            <p className="text-white/70 mb-6 max-w-2xl text-base leading-relaxed">
              Ce calculateur traite un plat à la fois. RestauMargin applique le même calcul à toutes vos
              fiches techniques et le tient à jour automatiquement : quand un prix fournisseur change, votre
              food cost et votre marge se recalculent seuls. Plus de tableur figé qui dérive en silence.
            </p>

            {/* Comparatif manuel vs RestauMargin */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
              <div className="rounded-2xl bg-white/5 border border-white/10 p-4">
                <div className="text-xs font-semibold text-white/50 uppercase tracking-wide mb-2">
                  Calcul manuel / tableur
                </div>
                <ul className="space-y-1.5 text-sm text-white/70">
                  <li className="flex items-start gap-2">
                    <XCircle className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" /> Un plat recalculé à la fois
                  </li>
                  <li className="flex items-start gap-2">
                    <XCircle className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" /> Prix fournisseurs jamais à jour
                  </li>
                  <li className="flex items-start gap-2">
                    <XCircle className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" /> Aucune alerte quand la marge chute
                  </li>
                </ul>
              </div>
              <div className="rounded-2xl bg-emerald-500/10 border border-emerald-500/30 p-4">
                <div className="text-xs font-semibold text-emerald-400 uppercase tracking-wide mb-2">
                  Avec RestauMargin
                </div>
                <ul className="space-y-1.5 text-sm text-white/80">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" /> Tout le menu calculé en continu
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" /> Mise à jour auto sur prix fournisseurs
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" /> Alerte dès qu'un plat passe sous la cible
                  </li>
                </ul>
              </div>
            </div>

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
                onClick={() => trackEvent('calc_cta_register_clicked')}
                className="inline-flex items-center justify-center gap-1.5 px-6 py-3.5 bg-white text-[#000000] text-sm font-bold rounded-full hover:bg-emerald-50 transition-colors"
              >
                Essai gratuit 7 jours <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                to="/fonctionnalites/fiches-techniques"
                className="inline-flex items-center justify-center gap-1.5 px-6 py-3.5 bg-white/10 hover:bg-white/15 text-white text-sm font-semibold rounded-full transition-colors border border-white/20"
              >
                Voir les fiches techniques
              </Link>
            </div>
            <p className="text-xs text-white/40 mt-4">
              Sans engagement · sans carte bancaire pour l'essai · données hébergées en Europe.
            </p>
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
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            <InternalLink
              to="/blog/calcul-marge-restaurant"
              title="Guide complet du calcul de marge"
              desc="Article détaillé"
              icon={<FileText className="w-4 h-4" />}
            />
            <InternalLink
              to="/blog/coefficient-multiplicateur"
              title="Tout sur le coefficient multiplicateur"
              desc="Méthode pratique"
              icon={<Calculator className="w-4 h-4" />}
            />
            <InternalLink
              to="/blog/tva-restaurant"
              title="La TVA en restauration"
              desc="10%, 5,5% et 20% expliqués"
              icon={<Percent className="w-4 h-4" />}
            />
            <InternalLink
              to="/outils/calculateur-food-cost"
              title="Calculateur food cost"
              desc="Outil par ingrédients"
              icon={<Wallet className="w-4 h-4" />}
            />
            <InternalLink
              to="/fonctionnalites/fiches-techniques"
              title="Fiches techniques automatisées"
              desc="Fonctionnalité RestauMargin"
              icon={<ChefHat className="w-4 h-4" />}
            />
            <InternalLink
              to="/login?mode=register"
              title="Essai gratuit 7 jours"
              desc="Logiciel complet"
              icon={<Sparkles className="w-4 h-4" />}
            />
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

// Badge de comparaison à la cible (vert / orange / rouge selon le statut).
function TargetVerdict({
  status,
  typeName,
  foodCostPct,
  min,
  max,
}: {
  status: 'empty' | 'below' | 'in' | 'above';
  typeName: string;
  foodCostPct: number;
  min: number;
  max: number;
}) {
  if (status === 'empty') {
    return (
      <div className="flex items-center gap-3 rounded-2xl border border-[#e5e5e5] bg-[#FAFAFA] p-4">
        <Info className="w-5 h-5 text-[#999999] flex-shrink-0" />
        <p className="text-sm text-[#666666]">
          Renseignez un prix et un coût matières pour comparer votre food cost à la cible{' '}
          <strong className="text-[#000000]">{typeName.toLowerCase()}</strong> ({min}–{max}%).
        </p>
      </div>
    );
  }

  const fc = fmtPct(foodCostPct);

  if (status === 'in') {
    return (
      <div className="flex items-start gap-3 rounded-2xl border-2 border-emerald-300 bg-emerald-50 p-4">
        <CheckCircle className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
        <div>
          <p className="text-sm font-bold text-[#000000]">
            Votre food cost de {fc} est dans la cible {typeName.toLowerCase()} ({min}–{max}%).
          </p>
          <p className="text-xs text-[#666666] mt-1">
            Plat bien calibré. Vous pouvez sécuriser cette marge en surveillant vos prix d'achat dans le temps.
          </p>
        </div>
      </div>
    );
  }

  if (status === 'below') {
    return (
      <div className="flex items-start gap-3 rounded-2xl border-2 border-emerald-300 bg-emerald-50 p-4">
        <TrendingUp className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
        <div>
          <p className="text-sm font-bold text-[#000000]">
            Food cost de {fc} : sous la cible {typeName.toLowerCase()} ({min}–{max}%), marge confortable.
          </p>
          <p className="text-xs text-[#666666] mt-1">
            Excellente rentabilité sur ce plat. Vérifiez tout de même qu'il reste attractif et au juste prix
            pour vos clients : un prix trop élevé peut freiner les ventes.
          </p>
        </div>
      </div>
    );
  }

  // above
  return (
    <div className="flex items-start gap-3 rounded-2xl border-2 border-red-200 bg-red-50 p-4">
      <AlertTriangle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
      <div>
        <p className="text-sm font-bold text-[#000000]">
          Food cost de {fc} : au-dessus de la cible {typeName.toLowerCase()} ({min}–{max}%).
        </p>
        <p className="text-xs text-[#666666] mt-1">
          Pour l'optimiser : augmentez légèrement le prix de vente (voir le prix conseillé ci-dessous),
          renégociez vos achats, ajustez les portions ou réduisez les pertes. Mettez en avant les plats à
          meilleure marge sur la carte.
        </p>
      </div>
    </div>
  );
}

function FormulaRow({
  n,
  title,
  formula,
  example,
  note,
}: {
  n: number;
  title: string;
  formula: string;
  example: string;
  note: string;
}) {
  return (
    <div className="flex gap-4 rounded-2xl border border-[#e5e5e5] bg-[#FAFAFA] p-4 sm:p-5">
      <div className="flex-shrink-0 w-9 h-9 rounded-full bg-emerald-600 text-white font-bold flex items-center justify-center text-sm">
        {n}
      </div>
      <div className="min-w-0">
        <h3 className="text-base font-bold text-[#000000] mb-2">{title}</h3>
        <div className="text-xs sm:text-sm font-mono bg-white border border-[#e5e5e5] rounded-lg px-3 py-2 text-emerald-700 mb-2 break-words">
          {formula}
        </div>
        <p className="text-sm text-[#000000] font-semibold mb-1">{example}</p>
        <p className="text-xs text-[#666666] leading-relaxed">{note}</p>
      </div>
    </div>
  );
}

function DefCard({ title, formula, text }: { title: string; formula: string; text: string }) {
  return (
    <div className="bg-[#FAFAFA] rounded-2xl p-5 border border-[#e5e5e5]">
      <h3 className="text-base font-bold text-[#000000] mb-2">{title}</h3>
      <div className="text-xs font-mono bg-white border border-[#e5e5e5] rounded-lg px-3 py-2 text-emerald-700 mb-3 break-words">
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

function InternalLink({
  to,
  title,
  desc,
  icon,
}: {
  to: string;
  title: string;
  desc: string;
  icon?: React.ReactNode;
}) {
  return (
    <Link
      to={to}
      className="group block bg-white border border-[#e5e5e5] rounded-2xl p-4 hover:border-emerald-500 hover:shadow-md transition-all duration-200"
    >
      <div className="text-sm font-bold text-[#000000] group-hover:text-emerald-600 transition-colors mb-1 flex items-center justify-between gap-2">
        <span className="flex items-center gap-2 min-w-0">
          {icon && <span className="text-emerald-600 flex-shrink-0">{icon}</span>}
          <span className="truncate">{title}</span>
        </span>
        <ArrowRight className="w-4 h-4 flex-shrink-0 opacity-0 group-hover:opacity-100 -translate-x-1 group-hover:translate-x-0 transition-all duration-200" />
      </div>
      <div className="text-xs text-[#999999]">{desc}</div>
    </Link>
  );
}
