import { Link } from 'react-router-dom';
import { ChefHat, BookOpen, BarChart3, TrendingUp, Clock, Star, Target, Users, ArrowRight, Calculator, Zap, AlertTriangle, ListChecks, Lightbulb, ChevronRight, Award, LineChart, Wallet, Activity, ShoppingCart } from 'lucide-react';
import SEOHead, { buildFAQSchema, buildBreadcrumbSchema } from '../components/SEOHead';
import BlogAuthor from '../components/BlogAuthor';
import BlogArticleHero from '../components/blog/BlogArticleHero';

/* ═══════════════════════════════════════════════════════════════
   Blog SEO — "Les KPI essentiels pour piloter son restaurant en 2026"
   Mots-clés : KPI restaurant, tableau de bord restaurant,
   indicateurs performance restauration, ratios rentabilité restauration
   ~3 300 mots — schema FAQ + HowTo + Article + Breadcrumb
   ═══════════════════════════════════════════════════════════════ */

const faqItems = [
  {
    question: "Combien de KPI faut-il suivre quand on débute en restauration ?",
    answer: "Commencez par 4 KPI fondamentaux : food cost, ticket moyen, taux d'occupation et note Google. Une fois maîtrisés sur 3 à 6 mois, ajoutez le prime cost, le RevPASH et le seuil de rentabilité. Plus de 10 KPI suivis simultanément devient contre-productif : vous perdez la vision d'ensemble. La règle 80/20 s'applique : 4 à 6 KPI bien suivis valent mieux que 20 mal compris.",
  },
  {
    question: "À quelle fréquence faut-il calculer son food cost ?",
    answer: "Hebdomadairement avec un inventaire flash sur les 10 produits stratégiques (loi de Pareto : 20 % des produits = 80 % de la valeur d'achat), et mensuellement avec un inventaire complet. En cas de dérive (food cost en hausse de plus de 2 points), passez en suivi quotidien sur 2 semaines pour identifier la cause. Les outils modernes comme RestauMargin automatisent cette mesure en continu.",
  },
  {
    question: "Mon food cost est à 38 %, est-ce trop élevé ?",
    answer: "Oui, sauf en restauration gastronomique où 35-40 % reste acceptable. Pour un bistrot, brasserie ou pizzeria, 38 % est trop élevé. Auditez 4 axes : (1) prix d'achat (négociation, fournisseurs alternatifs), (2) pertes (FIFO mal appliqué, vol, casse), (3) portionnement (grammages réels vs fiches techniques), (4) pricing (coefficient multiplicateur trop bas). Un audit complet réduit le food cost de 4-6 points en 8 semaines.",
  },
  {
    question: "Quel logiciel utiliser pour automatiser le suivi des KPI ?",
    answer: "Pour un restaurant indépendant, RestauMargin suffit largement et coûte moins de 50 EUR/mois : food cost par plat, prime cost, marges, alertes en temps réel et tableau de bord unifié. Pour les groupes multi-sites, regardez Innovorder, Tiller Insights ou Lightspeed Analytics. Pour un démarrage gratuit, le calculateur food cost RestauMargin et un tableur peuvent faire l'affaire.",
  },
  {
    question: "Comment impliquer mon équipe dans le suivi des KPI ?",
    answer: "Trois pratiques éprouvées : (1) Affichez 2 à 3 KPI clés en cuisine sur un écran (food cost de la semaine, ticket moyen, taux d'occupation). (2) Instaurez une prime trimestrielle indexée sur l'amélioration des KPI prioritaires (objectif food cost -2 pts = 200 EUR de prime par équipier). (3) Pratiquez la transparence : partagez les chiffres en réunion d'équipe. La motivation collective surpasse toujours le contrôle.",
  },
  {
    question: "Quelle est la différence entre KPI et OKR en restauration ?",
    answer: "Les KPI (Key Performance Indicators) sont des mesures continues de votre performance opérationnelle (food cost, ticket moyen, NPS). Les OKR (Objectives and Key Results) sont des objectifs trimestriels avec résultats chiffrés (ex : 'Réduire le food cost de 32 % à 28 % d'ici fin juin'). KPI = thermomètre, OKR = thermostat. Utilisez les deux : KPI pour le pilotage hebdomadaire, OKR pour la stratégie trimestrielle.",
  },
  {
    question: "Mon prime cost est à 68 %, quelle action prioritaire ?",
    answer: "À 68 % de prime cost, vous êtes en zone inquiétante (seuil critique 70 %). Action prioritaire en 3 étapes : (1) Diagnostiquer la cause dominante via décomposition (food cost à 35 % + masse salariale à 33 % ? ou inverse ?). (2) Si masse salariale élevée : optimiser le planning sur les périodes creuses, supprimer les heures de présence improductives. (3) Si food cost élevé : audit fiches techniques + négociation fournisseurs. Objectif : ramener à 62-65 % en 90 jours.",
  },
  {
    question: "Le RevPASH est-il pertinent pour un petit restaurant ?",
    answer: "Oui, et c'est même là qu'il est le plus utile. Le RevPASH (Revenue Per Available Seat Hour) mesure la rentabilité par siège et par heure. Un petit restaurant de 30 places avec un faible RevPASH révèle un problème de rotation des tables ou de saturation horaire. Calcul : CA HT / (places x heures d'ouverture). Cible : 5-10 EUR traditionnel, 8-15 EUR bistronomie, 20-40 EUR gastronomique.",
  },
  {
    question: "Faut-il suivre le NPS (Net Promoter Score) en restauration ?",
    answer: "Oui, c'est un KPI sous-utilisé mais très puissant. Le NPS mesure la probabilité que vos clients vous recommandent (0 à 10). Score = % promoteurs (9-10) - % détracteurs (0-6). En restauration : NPS < 20 = problème grave, 20-50 = correct, 50-70 = excellent, > 70 = exceptionnel. À mesurer trimestriellement via une enquête courte (1 question + champ libre).",
  },
  {
    question: "Comment construire un tableau de bord restaurant en moins d'1 heure ?",
    answer: "Méthode rapide : 1 page Excel ou Google Sheets avec 3 sections. (1) Quotidien (5 min) : CA, couverts, ticket moyen, food cost flash. (2) Hebdomadaire (15 min) : prime cost, taux d'occupation, RevPASH, top 5 plats. (3) Mensuel (30 min) : marge brute par catégorie, seuil de rentabilité, point mort, NPS. Pour automatiser, RestauMargin propose un tableau de bord pré-configuré en moins de 10 minutes.",
  },
];

const howToSteps = [
  {
    name: "Identifier les 4 KPI prioritaires de votre établissement",
    text: "Selon votre type d'établissement, sélectionnez 4 KPI critiques. Restaurant traditionnel : food cost, prime cost, ticket moyen, taux d'occupation. Pizzeria : food cost, RevPASH, panier moyen, ratio livraison/salle. Coffee shop : marge brute par boisson, rotation/heure, ticket moyen, fidélisation.",
  },
  {
    name: "Définir les benchmarks cibles et zones d'alerte",
    text: "Pour chaque KPI, définissez 3 zones : verte (objectif atteint), orange (vigilance), rouge (action urgente). Exemple food cost : vert <30 %, orange 30-33 %, rouge >33 %. Adaptez les seuils à votre type d'établissement et votre positionnement prix.",
  },
  {
    name: "Mettre en place la collecte automatisée",
    text: "Connectez votre caisse, votre système de stock et vos factures fournisseurs à un tableau de bord central. Sans automatisation, la saisie manuelle prend 5-8 heures/semaine et génère 15-20 % d'erreurs. RestauMargin ou un ETL maison résolvent ce point.",
  },
  {
    name: "Calculer les KPI à la fréquence adéquate",
    text: "Food cost et prime cost : hebdomadaire. Ticket moyen et taux d'occupation : quotidien. RevPASH et NPS : mensuel. Marge brute par plat : trimestriel. Une fréquence inadaptée fait perdre du temps ou rate les dérives.",
  },
  {
    name: "Analyser les écarts vs benchmarks",
    text: "À chaque mesure, comparez le KPI à son benchmark cible. Si écart > 5 %, lancez une investigation : pourquoi ? Quelle cause racine ? Documentez les conclusions dans un journal de bord pour identifier les patterns récurrents.",
  },
  {
    name: "Définir des actions correctives chiffrées",
    text: "Chaque KPI hors zone verte doit déclencher une action corrective avec un objectif chiffré et une deadline. Exemple : food cost à 34 % vs 30 % cible → action : audit fiches techniques + renégociation 3 fournisseurs principaux → deadline 30 jours → objectif retour à 31 %.",
  },
  {
    name: "Communiquer les KPI à l'équipe",
    text: "Affichez 2-3 KPI prioritaires en cuisine et en salle. Organisez un point hebdomadaire de 15 min sur les indicateurs. Reliez les KPI à une prime collective. La transparence accélère l'amélioration de 2 à 3x par rapport au suivi solo.",
  },
];

const articleSchema = {
  '@context': 'https://schema.org',
  '@type': 'Article',
  headline: "Les 12 KPI essentiels pour piloter son restaurant en 2026 (guide complet)",
  description: "Food cost, prime cost, RevPASH, ticket moyen, NPS... Le guide complet des KPI restaurant 2026 avec formules, benchmarks et tableau de bord.",
  image: 'https://www.restaumargin.fr/og-image.png',
  author: { '@type': 'Organization', name: 'La rédaction RestauMargin', url: 'https://www.restaumargin.fr/a-propos' },
  publisher: {
    '@type': 'Organization',
    name: 'RestauMargin',
    logo: { '@type': 'ImageObject', url: 'https://www.restaumargin.fr/icon-512.png' },
  },
  datePublished: '2026-04-27',
  dateModified: '2026-05-26',
  wordCount: 3300,
  inLanguage: 'fr-FR',
  mainEntityOfPage: { '@type': 'WebPage', '@id': 'https://www.restaumargin.fr/blog/kpi-restaurateur' },
};

const howToSchema = {
  '@context': 'https://schema.org',
  '@type': 'HowTo',
  name: "Comment mettre en place un tableau de bord KPI restaurant en 7 étapes",
  description: "Méthode pas-à-pas pour construire un tableau de bord performance complet pour son restaurant.",
  totalTime: 'PT1H',
  tool: ['Caisse', 'Logiciel RestauMargin', 'Factures fournisseurs', 'Inventaire physique'],
  step: howToSteps.map((s) => ({ '@type': 'HowToStep', name: s.name, text: s.text })),
};

export default function BlogKpiGuide() {
  return (
    <div className="min-h-screen" style={{ fontFamily: "'Inter', system-ui, sans-serif" }}>
      <SEOHead
        title="KPI restaurant 2026 : les 12 indicateurs essentiels (guide)"
        description="Food cost, prime cost, RevPASH, ticket moyen, NPS... Le guide complet des 12 KPI restaurant 2026 avec formules, benchmarks par type et tableau de bord."
        path="/blog/kpi-restaurateur"
        type="article"
        schema={[
          buildFAQSchema(faqItems),
          buildBreadcrumbSchema([
            { name: 'Accueil', url: 'https://www.restaumargin.fr/' },
            { name: 'Blog', url: 'https://www.restaumargin.fr/blog' },
            { name: 'KPI restaurant', url: 'https://www.restaumargin.fr/blog/kpi-restaurateur' },
          ]),
          articleSchema,
          howToSchema,
        ]}
      />

      {/* ── Navbar ── */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-mono-900">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <Link to="/landing" className="flex items-center gap-2 text-mono-100 font-bold text-lg">
            <ChefHat className="w-7 h-7 text-teal-600" />
            <span>RestauMargin</span>
          </Link>
          <div className="flex items-center gap-3">
            <Link
              to="/outils/calculateur-food-cost"
              className="hidden sm:inline-flex items-center gap-1.5 px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white text-sm font-semibold rounded-full transition-colors"
            >
              <Calculator className="w-4 h-4" />
              Calculer mes KPI
            </Link>
            <Link
              to="/login"
              className="text-sm font-medium text-mono-400 hover:text-teal-600 transition-colors"
            >
              Connexion
            </Link>
          </div>
        </div>
      </nav>

      {/* Breadcrumbs */}
      <div className="bg-mono-1000 border-b border-mono-900 py-3 px-4">
        <div className="max-w-4xl mx-auto text-xs text-mono-500 flex items-center gap-2 flex-wrap">
          <Link to="/" className="hover:text-teal-600">Accueil</Link>
          <ChevronRight className="w-3 h-3" />
          <Link to="/blog" className="hover:text-teal-600">Blog</Link>
          <ChevronRight className="w-3 h-3" />
          <span className="text-mono-100 font-medium">KPI restaurant</span>
        </div>
      </div>

      {/* Hero */}
      <BlogArticleHero
        category="Pilotage"
        readTime="16 min"
        date="Mai 2026"
        title="Les 12 KPI essentiels pour piloter son restaurant en 2026"
        accentWord="KPI"
        subtitle="En 2026, marge nette moyenne sous 4 % et inflation matières +6 %/an : piloter au feeling est devenu un luxe. Voici les 12 indicateurs qui transforment l'intuition en certitude — formules, benchmarks, tableau de bord et cas concrets."
      />

      {/* Body */}
      <main className="max-w-4xl mx-auto px-6 sm:px-10 lg:px-12 pb-24 pt-8 bg-white relative z-10 rounded-t-3xl shadow-xl">

        <BlogAuthor publishedDate="2026-04-27" updatedDate="2026-05-26" readTime="16 min" variant="header" />

        {/* Formule encadré snippet */}
        <div className="mt-10 bg-gradient-to-br from-teal-600 to-teal-700 rounded-2xl p-6 sm:p-8 text-white shadow-xl">
          <div className="flex items-center gap-2 mb-3">
            <Zap className="w-5 h-5" />
            <span className="text-xs font-bold uppercase tracking-wider text-teal-100">Les 5 KPI prioritaires</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold mb-4">Les indicateurs clés à mémoriser</h2>
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-5 space-y-3 font-mono text-sm sm:text-base">
            <div className="flex items-start gap-2">
              <span className="text-teal-200 font-bold">1.</span>
              <span><strong className="text-white">Food cost (%)</strong> = Coût matières / CA HT x 100</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-teal-200 font-bold">2.</span>
              <span><strong className="text-white">Prime cost (%)</strong> = (Food cost + Coût personnel) / CA HT x 100</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-teal-200 font-bold">3.</span>
              <span><strong className="text-white">Ticket moyen (EUR)</strong> = CA HT / Nombre de couverts</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-teal-200 font-bold">4.</span>
              <span><strong className="text-white">RevPASH (EUR/h)</strong> = CA HT / (Places x Heures)</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-teal-200 font-bold">5.</span>
              <span><strong className="text-white">Marge brute (%)</strong> = (CA HT - Coût matières) / CA HT x 100</span>
            </div>
          </div>
          <p className="mt-4 text-teal-100 text-sm">
            Objectifs standards : food cost 25-33 %, prime cost &lt; 65 %, marge brute &gt; 65 %.
          </p>
        </div>

        {/* Sommaire */}
        <nav className="my-12 bg-mono-1000 border border-mono-900 rounded-2xl p-6 sm:p-8">
          <h2 className="text-lg font-bold text-mono-100 mb-4 flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-teal-600" />
            Sommaire
          </h2>
          <ol className="space-y-2 text-sm sm:text-base text-mono-350">
            {[
              { href: '#intro', label: "Pourquoi piloter ses KPI en 2026 est devenu vital" },
              { href: '#food-cost', label: "KPI #1 — Food Cost : le roi des indicateurs" },
              { href: '#prime-cost', label: "KPI #2 — Prime Cost : la rentabilité opérationnelle" },
              { href: '#marge-brute', label: "KPI #3 — Marge brute" },
              { href: '#ticket-moyen', label: "KPI #4 — Ticket moyen et CA par couvert" },
              { href: '#occupation', label: "KPI #5 — Taux d'occupation des tables" },
              { href: '#revpash', label: "KPI #6 — RevPASH : le KPI méconnu" },
              { href: '#seuil-rentabilite', label: "KPI #7 — Seuil de rentabilité et point mort" },
              { href: '#rotation-stocks', label: "KPI #8 — Rotation des stocks" },
              { href: '#nps', label: "KPI #9 — NPS et satisfaction client" },
              { href: '#taux-retour', label: "KPI #10 — Taux de retour et fidélisation" },
              { href: '#ca-employe', label: "KPI #11 — CA par employé et productivité" },
              { href: '#cout-acquisition', label: "KPI #12 — Coût d'acquisition client" },
              { href: '#tableau', label: "Tableau récapitulatif des 12 KPI" },
              { href: '#howto', label: "Comment construire son tableau de bord" },
              { href: '#faq', label: "Questions fréquentes" },
            ].map((item, i) => (
              <li key={i}>
                <a href={item.href} className="hover:text-teal-600 transition-colors flex items-start gap-2">
                  <span className="text-teal-600 font-semibold min-w-[24px]">{i + 1}.</span>
                  {item.label}
                </a>
              </li>
            ))}
          </ol>
        </nav>

        <article>

        {/* Intro */}
        <section id="intro" className="mb-16">
          <SectionHeading icon={<TrendingUp className="w-6 h-6" />} number="0">
            Pourquoi piloter ses KPI en 2026 est devenu vital
          </SectionHeading>
          <div className="prose-content">
            <p>
              <strong>60 % des restaurants qui ferment dans les 3 premières années ne suivaient aucun indicateur autre que
              leur chiffre d'affaires quotidien.</strong> En 2026, dans un secteur où la marge nette moyenne est tombée
              sous les 4 % et l'inflation matières dépasse 6 % par an, ne pas piloter ses KPI est devenu une faute de gestion.
            </p>
            <p>
              Les <strong>KPI (Key Performance Indicators)</strong> sont des indicateurs mesurables et actionnables qui
              transforment vos intuitions en certitudes. Un restaurateur qui suit régulièrement 6 à 8 KPI clés détecte
              les dérives 4 à 8 semaines plus tôt qu'un confrère qui pilote "au feeling". Et 8 semaines, c'est exactement
              le temps qui sépare un problème corrigeable d'une crise irréversible.
            </p>
            <p>
              Ce guide présente les <strong>12 KPI restaurant essentiels</strong> en 2026, leurs formules exactes, les
              benchmarks par type d'établissement, et la manière concrète de bâtir votre tableau de bord hebdomadaire.
              Tous les KPI sont issus de notre base de 500+ restaurants connectés à RestauMargin et croisés avec les
              études Fiducial 2025 et GIRA Conseil.
            </p>
          </div>
        </section>

        {/* KPI #1 Food Cost */}
        <section id="food-cost" className="mb-16">
          <SectionHeading icon={<ShoppingCart className="w-6 h-6" />} number="1">
            KPI #1 — Food Cost : le roi des indicateurs
          </SectionHeading>

          <div className="prose-content">
            <p>
              Le <strong>food cost</strong> mesure la part de votre CA HT absorbée par les matières premières.
              C'est le premier KPI à surveiller et le plus révélateur de la santé opérationnelle de votre restaurant.
              Un food cost maîtrisé signifie des achats optimisés, des fiches techniques respectées et un pricing cohérent.
            </p>
          </div>

          <div className="bg-mono-1000 border border-mono-900 rounded-xl p-5 my-6 font-mono text-sm text-mono-100">
            Food Cost (%) = (Coût matières consommées / CA HT) x 100
          </div>

          <h3 className="text-xl font-bold text-mono-100 mt-8 mb-3">Benchmarks 2026 par type d'établissement</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="bg-mono-975 text-mono-350">
                  <th className="text-left py-3 px-4 font-semibold rounded-tl-xl">Type</th>
                  <th className="text-center py-3 px-4 font-semibold">Excellent</th>
                  <th className="text-center py-3 px-4 font-semibold">Standard</th>
                  <th className="text-center py-3 px-4 font-semibold rounded-tr-xl">Alerte</th>
                </tr>
              </thead>
              <tbody className="text-mono-350">
                <tr className="bg-white"><td className="py-3 px-4 font-medium text-mono-100">Gastronomie / Bistronomie</td><td className="py-3 px-4 text-center">&lt; 32 %</td><td className="py-3 px-4 text-center">32-38 %</td><td className="py-3 px-4 text-center">&gt; 38 %</td></tr>
                <tr className="bg-mono-1000"><td className="py-3 px-4 font-medium text-mono-100">Restaurant traditionnel</td><td className="py-3 px-4 text-center">&lt; 30 %</td><td className="py-3 px-4 text-center">30-35 %</td><td className="py-3 px-4 text-center">&gt; 35 %</td></tr>
                <tr className="bg-white"><td className="py-3 px-4 font-medium text-mono-100">Brasserie / Bistrot</td><td className="py-3 px-4 text-center">&lt; 28 %</td><td className="py-3 px-4 text-center">28-33 %</td><td className="py-3 px-4 text-center">&gt; 33 %</td></tr>
                <tr className="bg-mono-1000"><td className="py-3 px-4 font-medium text-mono-100">Pizzeria / Italien</td><td className="py-3 px-4 text-center">&lt; 22 %</td><td className="py-3 px-4 text-center">22-28 %</td><td className="py-3 px-4 text-center">&gt; 28 %</td></tr>
                <tr className="bg-white"><td className="py-3 px-4 font-medium text-mono-100">Fast casual / Burger</td><td className="py-3 px-4 text-center">&lt; 28 %</td><td className="py-3 px-4 text-center">28-32 %</td><td className="py-3 px-4 text-center">&gt; 32 %</td></tr>
                <tr className="bg-mono-1000"><td className="py-3 px-4 font-medium text-mono-100">Coffee shop</td><td className="py-3 px-4 text-center">&lt; 18 %</td><td className="py-3 px-4 text-center">18-25 %</td><td className="py-3 px-4 text-center">&gt; 25 %</td></tr>
              </tbody>
            </table>
          </div>

          <h3 className="text-xl font-bold text-mono-100 mt-8 mb-3">Pourquoi suivre cet indicateur</h3>
          <div className="prose-content">
            <p>
              Un restaurant qui fait 30 000 EUR de CA mensuel avec 10 500 EUR de coût matières affiche un food cost de 35 %.
              En réduisant à 32 %, il économise <strong>900 EUR/mois</strong>, soit 10 800 EUR de marge nette annuelle
              supplémentaire. C'est l'effet de levier le plus accessible pour améliorer la rentabilité.
            </p>
          </div>

          <h3 className="text-xl font-bold text-mono-100 mt-8 mb-3">Comment l'améliorer</h3>
          <ul className="space-y-2 text-mono-400">
            <li className="flex items-start gap-2"><span className="text-teal-600 font-bold">→</span> Mettre en place des fiches techniques précises avec grammages au gramme près</li>
            <li className="flex items-start gap-2"><span className="text-teal-600 font-bold">→</span> Pratiquer le FIFO (First In First Out) et peser les pertes quotidiennement</li>
            <li className="flex items-start gap-2"><span className="text-teal-600 font-bold">→</span> Renégocier les 5 fournisseurs principaux tous les 6 mois</li>
            <li className="flex items-start gap-2"><span className="text-teal-600 font-bold">→</span> Pratiquer le menu engineering pour favoriser les plats à fort coefficient</li>
            <li className="flex items-start gap-2"><span className="text-teal-600 font-bold">→</span> Faire un inventaire flash hebdomadaire sur les 10 produits stratégiques</li>
          </ul>

          <Callout type="info">
            Pour approfondir, consultez notre <Link to="/blog/reduire-food-cost" className="text-teal-700 underline hover:text-teal-800 font-semibold">guide complet du food cost</Link> et
            le <Link to="/outils/calculateur-food-cost" className="text-teal-700 underline hover:text-teal-800 font-semibold">calculateur gratuit</Link>.
          </Callout>
        </section>

        {/* KPI #2 Prime Cost */}
        <section id="prime-cost" className="mb-16">
          <SectionHeading icon={<TrendingUp className="w-6 h-6" />} number="2">
            KPI #2 — Prime Cost : la rentabilité opérationnelle
          </SectionHeading>

          <div className="prose-content">
            <p>
              Le <strong>prime cost</strong> combine matières premières et coût total du personnel (salaires bruts + charges
              patronales + extras + heures supplémentaires). C'est l'indicateur ultime de rentabilité opérationnelle :
              ces deux postes représentent 55 à 70 % des coûts totaux d'un restaurant.
            </p>
          </div>

          <div className="bg-mono-1000 border border-mono-900 rounded-xl p-5 my-6 font-mono text-sm text-mono-100">
            Prime Cost (%) = (Food Cost + Coût personnel total) / CA HT x 100
          </div>

          <div className="my-6 grid sm:grid-cols-2 gap-4">
            <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4">
              <div className="font-bold text-emerald-900 mb-2">Zones saines (2026)</div>
              <ul className="text-sm text-emerald-800 space-y-1">
                <li><strong>≤ 60 %</strong> : Excellent (top 25 %)</li>
                <li><strong>60-65 %</strong> : Bon</li>
                <li><strong>65-70 %</strong> : Vigilance</li>
              </ul>
            </div>
            <div className="bg-red-50 border border-red-200 rounded-xl p-4">
              <div className="font-bold text-red-900 mb-2">Zones critiques</div>
              <ul className="text-sm text-red-800 space-y-1">
                <li><strong>&gt; 70 %</strong> : Mathématiquement non viable</li>
                <li><strong>&gt; 75 %</strong> : Cessation d'activité probable</li>
              </ul>
            </div>
          </div>

          <h3 className="text-xl font-bold text-mono-100 mt-8 mb-3">Pourquoi suivre cet indicateur</h3>
          <div className="prose-content">
            <p>
              Une fois le prime cost déduit, il vous reste 30 à 35 % du CA pour couvrir le loyer, l'énergie, le marketing,
              les assurances et la marge nette. Si le prime cost dépasse 70 %, vous perdez de l'argent — c'est mathématique.
              En 2026, post-revalorisation SMIC, viser un prime cost de 60-65 % est un objectif réaliste mais exigeant.
            </p>
          </div>

          <h3 className="text-xl font-bold text-mono-100 mt-8 mb-3">Comment l'améliorer</h3>
          <ul className="space-y-2 text-mono-400">
            <li className="flex items-start gap-2"><span className="text-teal-600 font-bold">→</span> Caler le planning sur les heures de forte affluence (1h inutile/jour = 300-400 EUR/mois)</li>
            <li className="flex items-start gap-2"><span className="text-teal-600 font-bold">→</span> Croiser planning et prévisions de fréquentation (météo, événements locaux)</li>
            <li className="flex items-start gap-2"><span className="text-teal-600 font-bold">→</span> Optimiser le mix CDI/extras (CDI pour le noyau, extras pour les pics)</li>
            <li className="flex items-start gap-2"><span className="text-teal-600 font-bold">→</span> Simplifier la carte pour réduire les effectifs cuisine</li>
            <li className="flex items-start gap-2"><span className="text-teal-600 font-bold">→</span> Mettre en place des polyvalences (salle/cuisine, service/bar)</li>
          </ul>

          <Callout type="info">
            Notre <Link to="/blog/prime-cost-restaurant" className="text-teal-700 underline hover:text-teal-800 font-semibold">guide dédié au prime cost</Link> approfondit
            chaque levier d'optimisation avec des cas concrets.
          </Callout>
        </section>

        {/* KPI #3 Marge brute */}
        <section id="marge-brute" className="mb-16">
          <SectionHeading icon={<Wallet className="w-6 h-6" />} number="3">
            KPI #3 — Marge brute
          </SectionHeading>

          <div className="prose-content">
            <p>
              La <strong>marge brute</strong> est l'inverse du food cost : ce qui reste après avoir payé les matières premières.
              Si food cost = 30 %, marge brute = 70 %. Mais elle s'analyse aussi en valeur absolue (euros) pour comparer
              différents plats ou catégories.
            </p>
          </div>

          <div className="bg-mono-1000 border border-mono-900 rounded-xl p-5 my-6 font-mono text-sm text-mono-100 space-y-1">
            <div>Marge brute (%) = (CA HT - Coût matières) / CA HT x 100</div>
            <div>Marge brute (EUR) = CA HT - Coût matières</div>
          </div>

          <h3 className="text-xl font-bold text-mono-100 mt-6 mb-3">Pourquoi suivre cet indicateur</h3>
          <div className="prose-content">
            <p>
              Un plat à 18 EUR avec 5,40 EUR de matières dégage 12,60 EUR de marge brute. C'est ce montant qui contribue
              à couvrir vos charges fixes. Plus votre marge brute en euros est élevée, plus vous absorbez rapidement
              vos charges. Cible 2026 : marge brute &gt; 65 % en restauration traditionnelle, &gt; 75 % en pizzeria.
            </p>
            <p>
              Pour creuser le sujet : <Link to="/blog/calcul-marge-restaurant" className="text-teal-700 underline hover:text-teal-800 font-semibold">guide complet du calcul de marge restaurant</Link>.
            </p>
          </div>
        </section>

        {/* KPI #4 Ticket moyen */}
        <section id="ticket-moyen" className="mb-16">
          <SectionHeading icon={<Star className="w-6 h-6" />} number="4">
            KPI #4 — Ticket moyen et CA par couvert
          </SectionHeading>

          <div className="prose-content">
            <p>
              Le <strong>ticket moyen</strong> reflète votre stratégie de menu et l'efficacité de l'upsell.
              Le <strong>CA par couvert</strong> divise par le nombre de personnes (pas de tickets), ce qui intègre
              correctement les groupes.
            </p>
          </div>

          <div className="bg-mono-1000 border border-mono-900 rounded-xl p-5 my-6 font-mono text-sm text-mono-100 space-y-1">
            <div>Ticket moyen = CA HT / Nombre de tickets</div>
            <div>CA/couvert = CA total HT / Nombre de personnes</div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="bg-mono-975 text-mono-350">
                  <th className="text-left py-3 px-4 font-semibold rounded-tl-xl">Type</th>
                  <th className="text-center py-3 px-4 font-semibold rounded-tr-xl">Ticket moyen TTC (2026)</th>
                </tr>
              </thead>
              <tbody className="text-mono-350">
                <tr className="bg-white"><td className="py-3 px-4 font-medium text-mono-100">Pizzeria de quartier</td><td className="py-3 px-4 text-center">18-25 EUR</td></tr>
                <tr className="bg-mono-1000"><td className="py-3 px-4 font-medium text-mono-100">Brasserie</td><td className="py-3 px-4 text-center">25-35 EUR</td></tr>
                <tr className="bg-white"><td className="py-3 px-4 font-medium text-mono-100">Bistronomie</td><td className="py-3 px-4 text-center">35-55 EUR</td></tr>
                <tr className="bg-mono-1000"><td className="py-3 px-4 font-medium text-mono-100">Gastronomique</td><td className="py-3 px-4 text-center">80-150 EUR</td></tr>
                <tr className="bg-white"><td className="py-3 px-4 font-medium text-mono-100">Coffee shop</td><td className="py-3 px-4 text-center">4-10 EUR</td></tr>
              </tbody>
            </table>
          </div>

          <h3 className="text-xl font-bold text-mono-100 mt-8 mb-3">Comment l'améliorer</h3>
          <div className="prose-content">
            <p>
              Former l'équipe à l'upsell (entrée + dessert + verre de vin) peut faire gagner 3 à 5 EUR par couvert,
              soit potentiellement <strong>+15 % de CA</strong> sans coût additionnel. Techniques efficaces :
              suggestion à l'arrivée (apéritif maison), description vivante des plats, café gourmand systématiquement
              proposé, formules "entrée + plat + verre" mises en avant.
            </p>
          </div>
        </section>

        {/* KPI #5 Taux d'occupation */}
        <section id="occupation" className="mb-16">
          <SectionHeading icon={<Users className="w-6 h-6" />} number="5">
            KPI #5 — Taux d'occupation des tables
          </SectionHeading>

          <div className="prose-content">
            <p>
              Mesuré par service et par jour, le taux d'occupation révèle votre capacité commerciale réelle et
              identifie les créneaux à activer ou redimensionner.
            </p>
          </div>

          <div className="bg-mono-1000 border border-mono-900 rounded-xl p-5 my-6 font-mono text-sm text-mono-100">
            Taux d'occupation (%) = (Couverts servis / Capacité max) x 100
          </div>

          <h3 className="text-xl font-bold text-mono-100 mt-6 mb-3">Benchmarks 2026</h3>
          <ul className="space-y-2 text-mono-400">
            <li className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-blue-500" /> Midi semaine : 70-90 %</li>
            <li className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-blue-500" /> Soir semaine : 60-80 %</li>
            <li className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-blue-500" /> Vendredi/samedi soir : 90-100 % (avec 2 services)</li>
            <li className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-blue-500" /> Dimanche midi (brunch) : 80-100 %</li>
          </ul>

          <div className="prose-content mt-6">
            <p>
              Un taux &lt; 50 % le vendredi soir = signal d'alarme commercial (problème de notoriété, positionnement,
              ou prix). À l'inverse, &gt; 95 % systématique = vous perdez des clients faute de place : envisagez un
              deuxième service, l'extension de la salle, ou un système de réservation strict.
            </p>
          </div>
        </section>

        {/* KPI #6 RevPASH */}
        <section id="revpash" className="mb-16">
          <SectionHeading icon={<Clock className="w-6 h-6" />} number="6">
            KPI #6 — RevPASH : le KPI méconnu
          </SectionHeading>

          <div className="prose-content">
            <p>
              Le <strong>RevPASH</strong> (Revenue Per Available Seat Hour), emprunté à l'hôtellerie, mesure la rentabilité
              par siège et par heure d'ouverture. C'est l'un des KPI les plus puissants et les moins utilisés en restauration.
              Il intègre simultanément la rotation, le ticket moyen et le taux d'occupation.
            </p>
          </div>

          <div className="bg-mono-1000 border border-mono-900 rounded-xl p-5 my-6 font-mono text-sm text-mono-100">
            RevPASH (EUR/h) = CA HT / (Nombre de places x Heures d'ouverture)
          </div>

          <h3 className="text-xl font-bold text-mono-100 mt-6 mb-3">Exemple chiffré</h3>
          <div className="prose-content">
            <p>
              Restaurant de 50 places, ouvert 6 heures sur le service du soir, CA de 1 800 EUR.
              RevPASH = 1 800 / (50 x 6) = <strong>6 EUR/siège/heure</strong>.
            </p>
            <p>Cibles 2026 :</p>
            <ul>
              <li>Restauration traditionnelle : 5 à 10 EUR</li>
              <li>Bistronomie : 8 à 15 EUR</li>
              <li>Gastronomique : 20 à 40 EUR</li>
              <li>Coffee shop : 3 à 6 EUR</li>
            </ul>
            <p>
              Deux restaurants avec le même ticket moyen peuvent avoir des RevPASH très différents si l'un tourne ses tables
              2,5 fois et l'autre 1,8 fois. <strong>Un RevPASH en hausse de 2 EUR peut représenter 800 à 1 500 EUR de CA
              supplémentaire par semaine</strong> — sans un seul couvert de plus.
            </p>
          </div>
        </section>

        {/* KPI #7 Seuil de rentabilité */}
        <section id="seuil-rentabilite" className="mb-16">
          <SectionHeading icon={<Target className="w-6 h-6" />} number="7">
            KPI #7 — Seuil de rentabilité et point mort
          </SectionHeading>

          <div className="prose-content">
            <p>
              Le <strong>seuil de rentabilité</strong> est le CA minimum pour ne pas perdre d'argent.
              Le <strong>point mort calendaire</strong> est la date à laquelle vous l'atteignez dans l'année.
            </p>
          </div>

          <div className="bg-mono-1000 border border-mono-900 rounded-xl p-5 my-6 font-mono text-sm text-mono-100 space-y-1">
            <div>Seuil (EUR) = Charges fixes / Taux MCV</div>
            <div>Point mort (jours) = Seuil annuel / (CA annuel / 365)</div>
          </div>

          <div className="prose-content mt-6">
            <p>
              Exemple : charges fixes 18 000 EUR/mois, taux MCV 60 % → seuil = 30 000 EUR/mois. Si CA prévu = 45 000 EUR,
              point mort = 30 000 / (45 000/30) = jour 20 du mois. Vos 10 derniers jours génèrent le bénéfice.
            </p>
            <p>
              Affichez un compteur "CA réalisé / Seuil" en cuisine : c'est l'un des leviers de motivation les plus efficaces
              pour mobiliser l'équipe. Notre <Link to="/blog/seuil-rentabilite-restaurant" className="text-teal-700 underline hover:text-teal-800 font-semibold">guide complet du seuil de rentabilité</Link> détaille
              la méthode complète avec 3 cas pratiques.
            </p>
          </div>
        </section>

        {/* KPI #8 Rotation des stocks */}
        <section id="rotation-stocks" className="mb-16">
          <SectionHeading icon={<Activity className="w-6 h-6" />} number="8">
            KPI #8 — Rotation des stocks
          </SectionHeading>

          <div className="prose-content">
            <p>
              La <strong>rotation des stocks</strong> mesure la vitesse à laquelle votre inventaire se renouvelle.
              En restauration, plus la rotation est élevée, mieux c'est : produits frais, moins de pertes, trésorerie
              optimisée.
            </p>
          </div>

          <div className="bg-mono-1000 border border-mono-900 rounded-xl p-5 my-6 font-mono text-sm text-mono-100 space-y-1">
            <div>Rotation = Coût matières mensuel / Stock moyen</div>
            <div>Durée moyenne du stock (jours) = 30 / Rotation</div>
          </div>

          <div className="prose-content mt-6">
            <p>
              Benchmarks 2026 :
            </p>
            <ul>
              <li>Produits frais (légumes, viande, poisson) : rotation &gt; 10 (stock &lt; 3 jours)</li>
              <li>Surgelés : rotation 3 à 5 (stock 6 à 10 jours)</li>
              <li>Épicerie sèche : rotation 1,5 à 3 (stock 10 à 20 jours)</li>
              <li>Vins/alcools : rotation 0,5 à 1,5 (stock 20 à 60 jours)</li>
            </ul>
            <p>
              Une rotation trop faible signale un sur-stockage : trésorerie immobilisée, risque de péremption, perte de fraîcheur.
              Une rotation trop élevée révèle un sous-stockage : ruptures, achats d'urgence à prix fort, stress équipe.
            </p>
          </div>
        </section>

        {/* KPI #9 NPS */}
        <section id="nps" className="mb-16">
          <SectionHeading icon={<Star className="w-6 h-6" />} number="9">
            KPI #9 — NPS et satisfaction client
          </SectionHeading>

          <div className="prose-content">
            <p>
              Le <strong>NPS (Net Promoter Score)</strong> mesure la probabilité que vos clients vous recommandent.
              Question unique : "Sur une échelle de 0 à 10, quelle est la probabilité que vous recommandiez notre restaurant
              à un ami ?"
            </p>
          </div>

          <div className="bg-mono-1000 border border-mono-900 rounded-xl p-5 my-6 font-mono text-sm text-mono-100">
            NPS = % Promoteurs (9-10) - % Détracteurs (0-6)
          </div>

          <ul className="space-y-2 text-mono-400 mt-6">
            <li><strong className="text-mono-100">NPS &lt; 20</strong> : Problème grave, action urgente</li>
            <li><strong className="text-mono-100">NPS 20-50</strong> : Correct, marge de progression</li>
            <li><strong className="text-mono-100">NPS 50-70</strong> : Excellent</li>
            <li><strong className="text-mono-100">NPS &gt; 70</strong> : Exceptionnel (top 5 %)</li>
          </ul>

          <div className="prose-content mt-6">
            <p>
              <strong>La règle des 48h :</strong> répondez à chaque avis Google dans les 48 heures. Les restaurants qui
              répondent systématiquement aux avis négatifs ont en moyenne une note Google 0,3 point plus haute.
              <strong>Chaque étoile Google supplémentaire peut augmenter le CA de 5 à 9 %</strong> (étude Harvard Business
              Review 2024).
            </p>
          </div>
        </section>

        {/* KPI #10 Taux de retour */}
        <section id="taux-retour" className="mb-16">
          <SectionHeading icon={<Users className="w-6 h-6" />} number="10">
            KPI #10 — Taux de retour et fidélisation
          </SectionHeading>

          <div className="prose-content">
            <p>
              Acquérir un nouveau client coûte en moyenne <strong>5 à 7 fois plus cher</strong> que de conserver un client existant.
              Pourtant, la majorité des restaurateurs investissent plus en acquisition qu'en fidélisation.
              Le <strong>taux de retour</strong> est l'indicateur de fidélité le plus actionnable.
            </p>
          </div>

          <div className="bg-mono-1000 border border-mono-900 rounded-xl p-5 my-6 font-mono text-sm text-mono-100">
            Taux de retour (%) = Clients revenus dans 90 jours / Clients uniques x 100
          </div>

          <div className="prose-content mt-6">
            <p>
              <strong>Objectif :</strong> &gt; 30 % de taux de retour sur 90 jours. Pour le mesurer, déployez un programme
              de fidélité simple (carte tampons, app fidélité) ou un système de réservation qui identifie les clients récurrents.
              Une augmentation de 5 points du taux de retour génère typiquement +12 à 18 % de CA annuel.
            </p>
          </div>
        </section>

        {/* KPI #11 CA par employé */}
        <section id="ca-employe" className="mb-16">
          <SectionHeading icon={<LineChart className="w-6 h-6" />} number="11">
            KPI #11 — CA par employé et productivité
          </SectionHeading>

          <div className="prose-content">
            <p>
              Le <strong>CA par employé</strong> (équivalent temps plein) mesure la productivité globale de votre équipe.
              C'est un indicateur de référence pour benchmarker la performance opérationnelle.
            </p>
          </div>

          <div className="bg-mono-1000 border border-mono-900 rounded-xl p-5 my-6 font-mono text-sm text-mono-100">
            CA/employé annuel = CA annuel HT / Nombre d'ETP
          </div>

          <div className="prose-content mt-6">
            <p>Benchmarks 2026 :</p>
            <ul>
              <li>Fast casual / Burger : 80 000 à 120 000 EUR/ETP/an</li>
              <li>Restaurant traditionnel : 60 000 à 90 000 EUR/ETP/an</li>
              <li>Bistronomie : 70 000 à 110 000 EUR/ETP/an</li>
              <li>Gastronomique : 50 000 à 80 000 EUR/ETP/an (service plus dense)</li>
              <li>Coffee shop : 90 000 à 150 000 EUR/ETP/an</li>
            </ul>
          </div>
        </section>

        {/* KPI #12 CAC */}
        <section id="cout-acquisition" className="mb-16">
          <SectionHeading icon={<Award className="w-6 h-6" />} number="12">
            KPI #12 — Coût d'acquisition client (CAC)
          </SectionHeading>

          <div className="prose-content">
            <p>
              Le <strong>CAC</strong> mesure ce qu'il vous coûte d'acquérir un nouveau client (publicité, plateformes,
              promotion, événements). Critique en 2026 où la concurrence digitale a fait flamber les coûts d'acquisition.
            </p>
          </div>

          <div className="bg-mono-1000 border border-mono-900 rounded-xl p-5 my-6 font-mono text-sm text-mono-100">
            CAC = Budget marketing total / Nombre de nouveaux clients
          </div>

          <div className="prose-content mt-6">
            <p>
              Cible 2026 : CAC &lt; 15 EUR pour un restaurant urbain. Comparez-le à la LTV (Lifetime Value =
              ticket moyen x nombre de visites/an x nombre d'années de fidélité). Ratio sain : LTV/CAC &gt; 3x.
              Si le ratio chute sous 2x, votre acquisition n'est plus rentable.
            </p>
          </div>
        </section>

        {/* Tableau récapitulatif */}
        <section id="tableau" className="mb-16">
          <SectionHeading icon={<BarChart3 className="w-6 h-6" />} number="13">
            Tableau récapitulatif des 12 KPI
          </SectionHeading>

          <div className="overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="bg-mono-975 text-mono-350">
                  <th className="text-left py-3 px-4 font-semibold rounded-tl-xl">KPI</th>
                  <th className="text-left py-3 px-4 font-semibold">Formule synthétique</th>
                  <th className="text-center py-3 px-4 font-semibold">Cible 2026</th>
                  <th className="text-center py-3 px-4 font-semibold rounded-tr-xl">Fréquence</th>
                </tr>
              </thead>
              <tbody className="text-mono-350">
                {[
                  { k: 'Food Cost', f: 'Matières / CA x 100', t: '25-33 %', fr: 'Hebdo' },
                  { k: 'Prime Cost', f: '(Matières + Personnel) / CA x 100', t: '< 65 %', fr: 'Hebdo' },
                  { k: 'Marge brute', f: '(CA - Matières) / CA x 100', t: '> 65 %', fr: 'Hebdo' },
                  { k: 'Ticket moyen', f: 'CA / Tickets', t: 'Selon type', fr: 'Quotidien' },
                  { k: "Taux d'occupation", f: 'Couverts / Capacité x 100', t: '70-90 %', fr: 'Quotidien' },
                  { k: 'RevPASH', f: 'CA / (Places x Heures)', t: '5-15 EUR', fr: 'Hebdo' },
                  { k: 'Seuil de rentabilité', f: 'CF / Taux MCV', t: '< 70 % CA', fr: 'Mensuel' },
                  { k: 'Rotation stocks', f: 'Matières / Stock moyen', t: 'Variable', fr: 'Mensuel' },
                  { k: 'NPS', f: '% Promoteurs - % Détracteurs', t: '> 50', fr: 'Trimestriel' },
                  { k: 'Taux de retour', f: 'Clients récurrents / Total x 100', t: '> 30 %', fr: 'Mensuel' },
                  { k: 'CA / employé', f: 'CA annuel / ETP', t: 'Selon type', fr: 'Trimestriel' },
                  { k: 'CAC', f: 'Marketing / Nouveaux clients', t: '< 15 EUR', fr: 'Mensuel' },
                ].map((row, i) => (
                  <tr key={i} className={i % 2 === 0 ? 'bg-white' : 'bg-mono-1000'}>
                    <td className="py-3 px-4 font-medium text-mono-100">{row.k}</td>
                    <td className="py-3 px-4 text-xs">{row.f}</td>
                    <td className="py-3 px-4 text-center">{row.t}</td>
                    <td className="py-3 px-4 text-center text-xs">{row.fr}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* HowTo */}
        <section id="howto" className="mb-16">
          <SectionHeading icon={<ListChecks className="w-6 h-6" />} number="14">
            Comment construire son tableau de bord en 7 étapes
          </SectionHeading>

          <div className="prose-content">
            <p>
              Voici la méthode pas-à-pas pour mettre en place un tableau de bord KPI complet. Comptez 1 à 2 heures
              pour la configuration initiale, puis 30 minutes/semaine en routine.
            </p>
          </div>

          <ol className="mt-8 space-y-5">
            {howToSteps.map((step, i) => (
              <li key={i} className="bg-white border border-mono-900 rounded-2xl p-6 sm:p-7 flex gap-5">
                <div className="w-12 h-12 bg-teal-600 text-white rounded-xl flex items-center justify-center shrink-0 font-extrabold text-lg shadow-md">
                  {i + 1}
                </div>
                <div>
                  <h3 className="font-bold text-mono-100 text-lg mb-2">{step.name}</h3>
                  <p className="text-sm text-mono-400 leading-relaxed">{step.text}</p>
                </div>
              </li>
            ))}
          </ol>
        </section>

        {/* FAQ */}
        <section id="faq" className="mb-16">
          <SectionHeading icon={<Lightbulb className="w-6 h-6" />} number="15">
            Questions fréquentes
          </SectionHeading>

          <div className="space-y-5 mt-8">
            {faqItems.map(({ question, answer }) => (
              <div key={question} className="border border-mono-900 rounded-xl p-5 bg-white">
                <p className="font-semibold text-mono-100 mb-2">{question}</p>
                <p className="text-mono-400 text-sm leading-relaxed">{answer}</p>
              </div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <div id="cta" className="bg-gradient-to-br from-teal-600 to-teal-700 rounded-2xl p-8 text-center text-white">
          <h2 className="text-2xl font-bold mb-3">Pilotez vos 12 KPI automatiquement</h2>
          <p className="text-teal-100 mb-6 text-sm leading-relaxed max-w-[480px] mx-auto">
            RestauMargin calcule en temps réel food cost, prime cost, marge brute par plat, RevPASH et alertes
            à partir de vos données de caisse et stocks. Plus de tableur, plus d'erreur.
          </p>
          <Link
            to="/login"
            className="inline-flex items-center gap-2 bg-white text-teal-700 font-semibold px-6 py-3 rounded-xl hover:bg-teal-50 transition-colors text-sm"
          >
            Essayer gratuitement <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <BlogAuthor publishedDate="2026-04-27" updatedDate="2026-05-26" readTime="16 min" variant="footer" />

        {/* Articles connexes */}
        <div className="mt-12 pt-8 border-t border-mono-900">
          <h3 className="text-lg font-bold text-mono-100 mb-4 flex items-center gap-2">
            <Users className="w-5 h-5 text-teal-600" />
            Articles connexes
          </h3>
          <div className="grid sm:grid-cols-2 gap-4">
            <Link to="/blog/seuil-rentabilite-restaurant" className="block p-4 border border-mono-900 rounded-xl hover:border-teal-300 transition-colors">
              <p className="font-semibold text-mono-100 mb-1">Seuil de rentabilité restaurant</p>
              <p className="text-sm text-mono-400">Comment calculer le point mort et la marge de sécurité.</p>
            </Link>
            <Link to="/blog/calcul-marge-restaurant" className="block p-4 border border-mono-900 rounded-xl hover:border-teal-300 transition-colors">
              <p className="font-semibold text-mono-100 mb-1">Calcul marge restaurant</p>
              <p className="text-sm text-mono-400">Marge brute, nette, food cost et coefficient.</p>
            </Link>
            <Link to="/blog/reduire-food-cost" className="block p-4 border border-mono-900 rounded-xl hover:border-teal-300 transition-colors">
              <p className="font-semibold text-mono-100 mb-1">Food cost : la méthode complète</p>
              <p className="text-sm text-mono-400">Formules, fiches techniques, pertes, benchmarks.</p>
            </Link>
            <Link to="/blog/prime-cost-restaurant" className="block p-4 border border-mono-900 rounded-xl hover:border-teal-300 transition-colors">
              <p className="font-semibold text-mono-100 mb-1">Prime cost : matières + personnel</p>
              <p className="text-sm text-mono-400">L'indicateur ultime de rentabilité opérationnelle.</p>
            </Link>
            <Link to="/blog/coefficient-multiplicateur" className="block p-4 border border-mono-900 rounded-xl hover:border-teal-300 transition-colors">
              <p className="font-semibold text-mono-100 mb-1">Coefficient multiplicateur</p>
              <p className="text-sm text-mono-400">Méthode rapide pour fixer ses prix de vente.</p>
            </Link>
            <Link to="/blog/chiffre-affaires-restaurant-comment-calculer" className="block p-4 border border-mono-900 rounded-xl hover:border-teal-300 transition-colors">
              <p className="font-semibold text-mono-100 mb-1">Chiffre d'affaires restaurant</p>
              <p className="text-sm text-mono-400">Calculer, analyser, augmenter son CA.</p>
            </Link>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-mono-900 flex justify-between items-center">
          <Link to="/blog" className="text-sm text-teal-600 hover:underline">← Tous les articles</Link>
          <Link to="/outils/calculateur-food-cost" className="text-sm text-teal-600 hover:underline">Calculateur food cost gratuit →</Link>
        </div>
        </article>
      </main>
    </div>
  );
}

function SectionHeading({ icon, number, children }: { icon: React.ReactNode; number: string; children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-3 mb-6">
      <div className="w-12 h-12 rounded-2xl bg-teal-600 text-white flex items-center justify-center shadow-md shrink-0">
        {icon}
      </div>
      <div>
        <div className="text-xs text-teal-600 font-bold uppercase tracking-wider mb-1">Section {number}</div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-mono-100 leading-tight">{children}</h2>
      </div>
    </div>
  );
}

function Callout({ type, children }: { type: 'info' | 'warning'; children: React.ReactNode }) {
  const styles = {
    info: 'bg-teal-50 border-teal-300 text-teal-900',
    warning: 'bg-amber-50 border-amber-300 text-amber-900',
  };
  return (
    <div className={`my-6 border-l-4 rounded-r-xl p-5 ${styles[type]}`}>
      <p className="text-sm leading-relaxed">{children}</p>
    </div>
  );
}
