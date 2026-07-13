import { Link } from 'react-router-dom';
import {
  ChefHat,
  Calculator,
  ArrowRight,
  ArrowLeft,
  BookOpen,
  Target,
  TrendingUp,
  Scale,
  Percent,
  AlertTriangle,
  CheckCircle,
  Lightbulb,
  ListChecks,
  Award,
  Sparkles,
  Repeat,
  Tag,
  BarChart3,
  Zap,
} from 'lucide-react';
import SEOHead, { buildFAQSchema, buildBreadcrumbSchema } from '../components/SEOHead';
import BlogAuthor from '../components/BlogAuthor';
import BlogArticleHero from '../components/blog/BlogArticleHero';

/* ═══════════════════════════════════════════════════════════════
   Blog SEO — "Taux de marque ou taux de marge : quelle difference ?"
   Mot-cle principal : taux de marque restaurant / difference taux de marge taux de marque
   Question PAA quasi-vierge en restauration — ~3 500 mots
   ═══════════════════════════════════════════════════════════════ */

const faqItems = [
  {
    question: "Quelle est la difference entre le taux de marge et le taux de marque ?",
    answer:
      "La marge en euros est identique (Prix de vente HT moins Cout d'achat HT), mais le denominateur change. Le taux de marque rapporte la marge au PRIX DE VENTE : Taux de marque = Marge / Prix de vente HT x 100. Le taux de marge la rapporte au COUT D'ACHAT : Taux de marge = Marge / Cout d'achat HT x 100. Pour un plat coutant 4 EUR vendu 16 EUR HT, le taux de marque est de 75 % (12/16) et le taux de marge de 300 % (12/4). C'est le meme plat, deux lectures differentes.",
  },
  {
    question: "Comment calculer le taux de marque d'un restaurant ?",
    answer:
      "Taux de marque = (Prix de vente HT moins Cout matiere HT) / Prix de vente HT x 100. Exemple : un plat vendu 18 EUR HT avec un cout matiere de 5 EUR a un taux de marque de (18-5)/18 = 72 %. Le taux de marque est le complement du food cost : Taux de marque = 100 % moins Food cost. Un food cost de 28 % correspond donc a un taux de marque de 72 %. C'est le taux le plus utilise pour piloter un restaurant car il se rapporte directement au chiffre d'affaires.",
  },
  {
    question: "Comment calculer le taux de marge ?",
    answer:
      "Taux de marge = (Prix de vente HT moins Cout d'achat HT) / Cout d'achat HT x 100. Exemple : un plat coutant 5 EUR vendu 18 EUR HT a un taux de marge de (18-5)/5 = 260 %. En restauration, le taux de marge est souvent tres eleve (200 a 400 %) car le cout matiere est faible par rapport au prix de vente. Il correspond au coefficient multiplicateur exprime en pourcentage : coefficient 4 = taux de marge de 300 %.",
  },
  {
    question: "La marge brute d'un restaurant, c'est un taux de marge ou un taux de marque ?",
    answer:
      "C'est un taux de marque. Quand un restaurateur dit qu'il fait 70 % de marge brute, il divise sa marge par le chiffre d'affaires (le prix de vente), pas par le cout d'achat. Il s'agit donc d'un taux de marque. Le taux de marge equivalent serait de 233 %. Cette confusion de vocabulaire est la source d'erreurs de pricing majeures : un restaurateur qui applique un taux de marge de 70 % au lieu d'un taux de marque de 70 % vend ses plats bien trop bas.",
  },
  {
    question: "Comment passer du taux de marge au taux de marque ?",
    answer:
      "Deux formules de conversion. Du marge vers la marque : Taux de marque = Taux de marge / (1 + Taux de marge). Un taux de marge de 300 % (soit 3) donne 3 / (1+3) = 75 % de taux de marque. Inversement : Taux de marge = Taux de marque / (1 moins Taux de marque). Un taux de marque de 75 % (soit 0,75) donne 0,75 / (1-0,75) = 300 %. Gardez ces deux formules sous la main, elles evitent 90 % des erreurs de calcul.",
  },
  {
    question: "Pourquoi le taux de marge est-il toujours superieur au taux de marque ?",
    answer:
      "Parce que le cout d'achat (denominateur du taux de marge) est toujours inferieur au prix de vente (denominateur du taux de marque). Diviser la meme marge par un nombre plus petit donne un pourcentage plus grand. Le taux de marge peut depasser 100 % (et atteindre 300 a 400 % en restauration), alors que le taux de marque reste par definition inferieur a 100 % : la marge ne peut jamais depasser le prix de vente.",
  },
  {
    question: "Quel est le lien entre le taux de marque et le coefficient multiplicateur ?",
    answer:
      "Ils decrivent la meme realite. Coefficient multiplicateur = 1 / (1 moins Taux de marque). Un taux de marque de 75 % correspond a un coefficient de 1 / 0,25 = 4. Inversement : Taux de marque = 1 moins (1 / Coefficient). Un coefficient de 3,5 donne un taux de marque de 1 - 1/3,5 = 71,4 %. Le coefficient s'applique au cout pour trouver le prix, le taux de marque decrit la part de marge dans ce prix.",
  },
  {
    question: "Quel est le lien entre le taux de marque et le food cost ?",
    answer:
      "Ils sont complementaires et leur somme fait toujours 100 %. Taux de marque = 100 % moins Food cost. Un food cost de 30 % donne un taux de marque de 70 %. Un food cost de 25 % donne un taux de marque de 75 %. C'est la relation la plus utile au quotidien : suivre son food cost, c'est suivre son taux de marque a l'envers. Un bon food cost restaurant se situe entre 25 et 33 %, soit un taux de marque de 67 a 75 %.",
  },
  {
    question: "Un taux de marque de 70 % est-il bon pour un restaurant ?",
    answer:
      "Oui, c'est une cible saine. Un taux de marque de 68 a 75 % (food cost de 25 a 32 %) est considere comme sain en restauration traditionnelle en 2026. En dessous de 65 % de taux de marque, la marge matiere devient insuffisante pour couvrir la masse salariale et les charges fixes. Attention : le taux de marque ne mesure que la matiere premiere. Il faut ensuite retrancher le personnel (labour cost) et les charges fixes pour connaitre la rentabilite reelle, ce que mesure le prime cost.",
  },
  {
    question: "Peut-on avoir un taux de marque superieur a 100 % ?",
    answer:
      "Non, jamais. Le taux de marque rapporte la marge au prix de vente. Comme la marge (prix de vente moins cout) est forcement inferieure ou egale au prix de vente, le taux de marque plafonne a 100 %, atteint seulement si le cout d'achat est nul. Si vous obtenez un taux de marque de 120 %, vous avez confondu avec le taux de marge, qui lui n'a pas de plafond et depasse regulierement 100 % en restauration.",
  },
  {
    question: "Faut-il calculer ces taux en HT ou en TTC ?",
    answer:
      "Toujours en HT. La TVA n'est pas un revenu du restaurant : elle est collectee pour l'Etat et reversee. Calculer un taux de marque sur des prix TTC gonfle artificiellement la marge et fausse toutes les comparaisons. Ramenez systematiquement le prix de vente en HT (Prix TTC / 1,10 pour la restauration sur place, / 1,20 pour l'alcool) avant de calculer marge, marque ou coefficient. Le cout matiere fournisseur est deja generalement exprime en HT.",
  },
  {
    question: "Quel taux utiliser pour fixer le prix d'un plat ?",
    answer:
      "Le plus simple en restauration est de partir du food cost cible (donc du taux de marque cible). Fixez votre taux de marque cible (par exemple 72 %, soit un food cost de 28 %), puis calculez le prix : Prix de vente HT = Cout matiere / (1 moins Taux de marque). Pour un cout de 5 EUR et un taux de marque de 72 % : 5 / 0,28 = 17,86 EUR HT. Le taux de marge, lui, sert davantage a comparer le rendement d'un achat lors des negociations fournisseurs.",
  },
  {
    question: "Le taux de marque est-il la meme chose que le taux de marge nette ?",
    answer:
      "Non. Le taux de marque se calcule sur le seul cout matiere : c'est un indicateur de marge brute. La marge nette, elle, tient compte de TOUTES les charges (personnel, loyer, energie, amortissements, impots). Un restaurant peut afficher un excellent taux de marque de 74 % et une marge nette de 3 % seulement si sa masse salariale et ses charges fixes sont trop lourdes. Ne jamais confondre marge matiere (marque) et rentabilite finale (marge nette).",
  },
  {
    question: "Comment eviter de confondre le taux de marge et le taux de marque ?",
    answer:
      "Retenez un moyen mnemotechnique : la marQue se calcule sur le prix de vente (Q comme le prix qu'on affiche au client), la marGe se calcule sur le cout d'achat. Autre reflexe : si le pourcentage depasse 100 %, c'est forcement un taux de marge. En restauration, sauf mention contraire, la marge brute et les 65-75 % couramment cites sont des taux de marque. En cas de doute, revenez toujours a la marge en euros, puis choisissez le denominateur.",
  },
];

const howToSteps = [
  { name: "Reunir le cout d'achat HT et le prix de vente HT", text: "Prenez le cout matiere HT d'un plat (via sa fiche technique) et son prix de vente affiche ramene en HT (Prix TTC / 1,10 en restauration sur place). Travaillez toujours en HT pour ne pas fausser le calcul avec la TVA." },
  { name: "Calculer la marge en euros", text: "Marge = Prix de vente HT moins Cout d'achat HT. C'est la base commune aux deux taux. Exemple : 16 EUR de prix de vente HT moins 4 EUR de cout = 12 EUR de marge." },
  { name: "Calculer le taux de marque", text: "Taux de marque = Marge / Prix de vente HT x 100. Exemple : 12 / 16 = 75 %. C'est le taux a rapporter au chiffre d'affaires, celui qu'on appelle marge brute en restauration." },
  { name: "Calculer le taux de marge", text: "Taux de marge = Marge / Cout d'achat HT x 100. Exemple : 12 / 4 = 300 %. Il correspond au coefficient multiplicateur exprime en pourcentage (coefficient 4 = 300 % de taux de marge)." },
  { name: "Verifier la coherence avec le coefficient et le food cost", text: "Controle croise : Taux de marque + Food cost = 100 %, et Coefficient = 1 / (1 moins Taux de marque). Un taux de marque de 75 % implique un food cost de 25 % et un coefficient de 4. Si les trois ne collent pas, il y a une erreur." },
  { name: "Comparer aux benchmarks restauration", text: "Cible saine en 2026 : taux de marque de 68 a 75 % sur les plats (food cost de 25 a 32 %), et jusqu'a 80-90 % sur les boissons. En dessous de 65 %, la marge matiere devient insuffisante." },
  { name: "Suivre l'evolution dans le temps", text: "Recalculez chaque mois par plat et en moyenne. Une baisse du taux de marque signale une hausse des couts fournisseurs ou du gaspillage. Un logiciel comme RestauMargin automatise le suivi a partir des fiches techniques." },
];

const conversions = [
  ['2,5', '150 %', '60 %', '40 %'],
  ['3,0', '200 %', '66,7 %', '33,3 %'],
  ['3,33', '233 %', '70 %', '30 %'],
  ['3,5', '250 %', '71,4 %', '28,6 %'],
  ['4,0', '300 %', '75 %', '25 %'],
  ['4,5', '350 %', '77,8 %', '22,2 %'],
  ['5,0', '400 %', '80 %', '20 %'],
];

export default function BlogTauxMarque() {
  return (
    <div className="min-h-screen bg-white" style={{ fontFamily: "'Inter', system-ui, sans-serif" }}>
      <SEOHead
        title="Taux de marque ou taux de marge : quelle difference ? (calcul restaurant 2026)"
        description="Taux de marge vs taux de marque : la difference expliquee simplement. Formules, exemple chiffre, tableau de conversion, lien avec le coefficient multiplicateur et le food cost. Guide restaurant 2026."
        path="/blog/taux-de-marque-taux-de-marge"
        type="article"
        schema={[
          buildFAQSchema(faqItems),
          buildBreadcrumbSchema([
            { name: 'Accueil', url: 'https://www.restaumargin.fr/' },
            { name: 'Blog', url: 'https://www.restaumargin.fr/blog' },
            { name: 'Taux de marque ou taux de marge', url: 'https://www.restaumargin.fr/blog/taux-de-marque-taux-de-marge' },
          ]),
          {
            '@context': 'https://schema.org',
            '@type': 'HowTo',
            name: 'Comment calculer le taux de marque et le taux de marge en restauration',
            description: 'Methode pas a pas pour calculer et distinguer le taux de marque et le taux de marge d\'un plat de restaurant : marge en euros, denominateur, controle croise avec le coefficient et le food cost.',
            totalTime: 'PT10M',
            tool: ['Fiche technique', 'Calculatrice ou logiciel RestauMargin'],
            step: howToSteps.map((s) => ({ '@type': 'HowToStep', name: s.name, text: s.text })),
          },
          {
            '@context': 'https://schema.org',
            '@type': 'Article',
            headline: 'Taux de marque ou taux de marge : quelle difference ? (calcul restaurant 2026)',
            description: 'Difference entre taux de marge et taux de marque en restauration : formules, exemple chiffre complet, tableau de conversion, lien avec le coefficient multiplicateur et le food cost, erreurs de pricing a eviter.',
            image: 'https://www.restaumargin.fr/og-image.png',
            author: { '@type': 'Organization', name: 'RestauMargin', url: 'https://www.restaumargin.fr' },
            publisher: {
              '@type': 'Organization',
              name: 'RestauMargin',
              logo: { '@type': 'ImageObject', url: 'https://www.restaumargin.fr/icon-512.png' },
            },
            datePublished: '2026-07-13',
            dateModified: '2026-07-13',
            wordCount: 3500,
            inLanguage: 'fr-FR',
            mainEntityOfPage: { '@type': 'WebPage', '@id': 'https://www.restaumargin.fr/blog/taux-de-marque-taux-de-marge' },
            citation: [
              { '@type': 'CreativeWork', name: 'Plan comptable general - notions de marge commerciale' },
              { '@type': 'CreativeWork', name: 'GHR - Groupement des Hotelleries et Restaurations, ratios 2026' },
              { '@type': 'CreativeWork', name: 'INSEE - Secteur 56 hebergement et restauration' },
            ],
          },
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
              to="/outils/calculateur-marge-restaurant"
              className="hidden sm:inline-flex items-center gap-1.5 px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white text-sm font-semibold rounded-full transition-colors"
            >
              <Calculator className="w-4 h-4" />
              Calculer ma marge
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

      {/* ── Breadcrumbs ── */}
      <div className="bg-mono-1000 border-b border-mono-900 py-3 px-4">
        <div className="max-w-4xl mx-auto text-xs text-mono-500 flex items-center gap-2 flex-wrap">
          <Link to="/" className="hover:text-teal-600">Accueil</Link>
          <span>/</span>
          <Link to="/blog" className="hover:text-teal-600">Blog</Link>
          <span>/</span>
          <span className="text-mono-100 font-medium">Taux de marque ou taux de marge</span>
        </div>
      </div>

      {/* ── Hero ── */}
      <BlogArticleHero
        category="Marges"
        readTime="16 min"
        date="Juillet 2026"
        title="Taux de marque ou taux de marge : quelle difference en restauration ?"
        accentWord="marque"
        subtitle="Deux ratios que tout restaurateur confond au moins une fois. Meme marge en euros, mais un denominateur different qui change tout. Voici les formules, un exemple chiffre complet, un tableau de conversion et les erreurs de pricing a ne plus jamais commettre."
      />

      <main className="max-w-4xl mx-auto px-6 sm:px-10 lg:px-12 pb-24 pt-8 bg-white relative z-10 rounded-t-3xl shadow-xl">
        <BlogAuthor publishedDate="2026-07-13" readTime="16 min" variant="header" />

        {/* ── Intro / Featured snippet ── */}
        <div className="bg-gradient-to-br from-teal-50 to-emerald-50 border-l-4 border-teal-600 rounded-r-2xl p-5 sm:p-6 my-8">
          <p className="text-xs font-bold uppercase tracking-wider text-teal-700 mb-2">Reponse rapide</p>
          <p className="text-base sm:text-lg text-mono-100 leading-relaxed">
            Le <strong>taux de marque</strong> et le <strong>taux de marge</strong> partent de la meme marge en euros (Prix de vente HT moins Cout d'achat HT), mais divisent par un nombre different. Le <strong>taux de marque = Marge / Prix de vente HT</strong> (base : le prix de vente). Le <strong>taux de marge = Marge / Cout d'achat HT</strong> (base : le cout). Pour un plat coutant 4 EUR vendu 16 EUR HT : taux de marque de <strong>75 %</strong>, taux de marge de <strong>300 %</strong>. En restauration, la "marge brute" dont tout le monde parle est en realite un taux de marque.
          </p>
        </div>

        {/* ── Encadre formules ── */}
        <div className="mt-10 bg-gradient-to-br from-teal-600 to-teal-700 rounded-2xl p-6 sm:p-8 text-white shadow-xl">
          <div className="flex items-center gap-2 mb-3">
            <Scale className="w-5 h-5" />
            <span className="text-xs font-bold uppercase tracking-wider text-teal-100">Les formules a retenir</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold mb-4">
            Marque, marge et leurs conversions
          </h2>
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-5 space-y-3 font-mono text-sm sm:text-base">
            <div className="flex items-start gap-2">
              <span className="text-teal-200 font-bold">1.</span>
              <span><strong className="text-white">Marge (EUR)</strong> = Prix de vente HT moins Cout d'achat HT</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-teal-200 font-bold">2.</span>
              <span><strong className="text-white">Taux de marque</strong> = Marge / Prix de vente HT x 100</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-teal-200 font-bold">3.</span>
              <span><strong className="text-white">Taux de marge</strong> = Marge / Cout d'achat HT x 100</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-teal-200 font-bold">4.</span>
              <span><strong className="text-white">Marque vers marge</strong> = Marque / (1 moins Marque)</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-teal-200 font-bold">5.</span>
              <span><strong className="text-white">Marge vers marque</strong> = Marge / (1 + Marge)</span>
            </div>
          </div>
          <p className="mt-4 text-teal-100 text-sm">
            Reflexe cle en restauration : Taux de marque + Food cost = 100 %. Un food cost de 28 % correspond a un taux de marque de 72 %.
          </p>
        </div>

        {/* ── Sommaire ── */}
        <nav className="my-12 bg-mono-1000 border border-mono-900 rounded-2xl p-6 sm:p-8">
          <h2 className="text-lg font-bold text-mono-100 mb-4 flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-teal-600" />
            Sommaire
          </h2>
          <ol className="space-y-2 text-sm sm:text-base text-mono-350">
            {[
              { href: '#difference', label: 'La difference en 30 secondes' },
              { href: '#formules', label: 'Les deux formules : tout est dans le denominateur' },
              { href: '#exemple', label: 'Exemple chiffre complet : le plat a 4 EUR vendu 16 EUR' },
              { href: '#confusion', label: 'Pourquoi la confusion est si frequente en restauration' },
              { href: '#triangle', label: 'Marque, coefficient multiplicateur et food cost' },
              { href: '#conversion', label: 'Tableau de conversion marge <-> marque' },
              { href: '#marge-brute', label: 'La marge brute du restaurant est un taux de marque' },
              { href: '#quel-taux', label: 'Quel taux utiliser, et quand ?' },
              { href: '#erreurs', label: 'Les 5 erreurs qui faussent vos prix' },
              { href: '#methode', label: 'Comment calculer et suivre ces taux' },
              { href: '#faq', label: 'FAQ : 14 questions frequentes' },
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

        <article className="prose-article">

        {/* ═════════ SECTION 1 : Difference ═════════ */}
        <section id="difference" className="mb-14">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-12 h-12 bg-teal-100 rounded-xl flex items-center justify-center">
              <Scale className="w-6 h-6 text-teal-700" />
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-mono-100 !mt-0 !mb-0">1. La difference en 30 secondes</h2>
          </div>

          <p>
            Un plat vous coute <strong>4 EUR</strong> de matiere premiere. Vous le vendez <strong>16 EUR HT</strong>. Votre marge est de 12 EUR. Jusque-la, tout le monde est d'accord. La ou naissent les malentendus, c'est au moment d'exprimer cette marge en pourcentage. Selon la base de calcul choisie, vous obtenez <strong>75 %</strong> ou <strong>300 %</strong> pour exactement le meme plat.
          </p>

          <p>
            Ces deux pourcentages ont un nom precis :
          </p>

          <div className="grid sm:grid-cols-2 gap-4 my-6">
            <div className="bg-white border-2 border-teal-200 rounded-2xl p-5">
              <div className="flex items-center gap-2 mb-3">
                <Tag className="w-5 h-5 text-teal-700" />
                <h3 className="text-base font-bold text-mono-100">Taux de marque</h3>
              </div>
              <p className="text-sm text-mono-400 leading-relaxed mb-3">
                La marge rapportee au <strong>prix de vente</strong>. On regarde quelle part du prix affiche au client reste dans la poche du restaurant.
              </p>
              <div className="bg-teal-50 rounded-lg p-3 font-mono text-sm text-teal-900">
                12 / 16 = <strong>75 %</strong>
              </div>
            </div>
            <div className="bg-white border-2 border-blue-200 rounded-2xl p-5">
              <div className="flex items-center gap-2 mb-3">
                <TrendingUp className="w-5 h-5 text-blue-700" />
                <h3 className="text-base font-bold text-mono-100">Taux de marge</h3>
              </div>
              <p className="text-sm text-mono-400 leading-relaxed mb-3">
                La marge rapportee au <strong>cout d'achat</strong>. On regarde combien la matiere premiere a rapporte par rapport a ce qu'elle a coute.
              </p>
              <div className="bg-blue-50 rounded-lg p-3 font-mono text-sm text-blue-900">
                12 / 4 = <strong>300 %</strong>
              </div>
            </div>
          </div>

          <p>
            Retenez le moyen mnemotechnique : la <strong>marQue</strong> se calcule sur le prix de vente (la valeur affichee au client), la <strong>marGe</strong> sur le cout d'achat. Les deux mesurent la meme chose vue sous deux angles, comme la temperature en Celsius et en Fahrenheit. Ni l'un ni l'autre n'est faux : ce qui est faux, c'est de comparer un taux de marque a un taux de marge sans le savoir.
          </p>

          <div className="bg-amber-50 border-l-4 border-amber-400 rounded-r-xl p-5 my-6">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-amber-700 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-bold text-amber-900 mb-1">L'enjeu concret</p>
                <p className="text-sm text-amber-800">
                  Un restaurateur qui veut "70 % de marge" et applique par erreur un taux de marge de 70 % (au lieu d'un taux de marque) fixe des prix <strong>bien trop bas</strong> : son plat a 4 EUR de cout serait vendu 6,80 EUR au lieu de 13,33 EUR. Une erreur de vocabulaire qui coute la moitie de la marge.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ═════════ SECTION 2 : Formules ═════════ */}
        <section id="formules" className="mb-14">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
              <Calculator className="w-6 h-6 text-blue-700" />
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-mono-100 !mt-0 !mb-0">2. Les deux formules : tout est dans le denominateur</h2>
          </div>

          <p>
            Les deux taux partagent le meme numerateur, <strong>la marge en euros</strong>. La seule variable, c'est le denominateur.
          </p>

          <h3 className="text-xl font-bold text-mono-100 mt-8 mb-3">La marge en euros (le point de depart commun)</h3>
          <div className="bg-mono-100 rounded-xl p-5 my-4 font-mono text-sm text-white text-center">
            Marge (EUR) = Prix de vente HT moins Cout d'achat HT
          </div>
          <p>
            Cette marge s'appelle aussi la <strong>marge brute unitaire</strong> quand on raisonne par plat. Elle doit toujours se calculer en HT, jamais en TTC : la TVA n'appartient pas au restaurant, elle est collectee pour l'Etat.
          </p>

          <h3 className="text-xl font-bold text-mono-100 mt-8 mb-3">Le taux de marque : base prix de vente</h3>
          <div className="bg-teal-600 rounded-xl p-5 my-4 font-mono text-sm text-white text-center">
            Taux de marque (%) = (Marge / Prix de vente HT) x 100
          </div>
          <p>
            Le taux de marque repond a la question : <strong>quelle part de mon prix de vente est de la marge ?</strong> Comme la marge est forcement inferieure au prix de vente, le taux de marque est toujours compris entre 0 et 100 %. C'est le taux naturellement utilise en restauration, car il se rapporte directement au chiffre d'affaires.
          </p>

          <h3 className="text-xl font-bold text-mono-100 mt-8 mb-3">Le taux de marge : base cout d'achat</h3>
          <div className="bg-blue-600 rounded-xl p-5 my-4 font-mono text-sm text-white text-center">
            Taux de marge (%) = (Marge / Cout d'achat HT) x 100
          </div>
          <p>
            Le taux de marge repond a une autre question : <strong>combien mon cout matiere a-t-il rapporte par rapport a ce qu'il a coute ?</strong> Comme le cout d'achat est faible en restauration (4 EUR pour un plat vendu 16 EUR), ce taux explose facilement au-dela de 100 % et atteint couramment 200 a 400 %. Il correspond, exprime autrement, au <Link to="/blog/coefficient-multiplicateur" className="text-teal-600 hover:text-teal-700 font-semibold underline decoration-teal-300">coefficient multiplicateur</Link>.
          </p>

          <div className="bg-emerald-50 border-l-4 border-emerald-400 rounded-r-xl p-5 my-6">
            <div className="flex items-start gap-3">
              <Lightbulb className="w-5 h-5 text-emerald-700 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-bold text-emerald-900 mb-1">Le reflexe qui evite l'erreur</p>
                <p className="text-sm text-emerald-800">
                  Si un pourcentage de "marge" depasse 100 %, c'est <strong>forcement</strong> un taux de marge. Un taux de marque ne peut jamais depasser 100 %. Ce simple controle detecte instantanement la majorite des confusions.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ═════════ SECTION 3 : Exemple ═════════ */}
        <section id="exemple" className="mb-14">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center">
              <BarChart3 className="w-6 h-6 text-emerald-700" />
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-mono-100 !mt-0 !mb-0">3. Exemple chiffre complet : le plat a 4 EUR vendu 16 EUR</h2>
          </div>

          <p>
            Prenons un plat signature : un <strong>risotto aux champignons</strong>. Sa fiche technique donne un cout matiere de <strong>4 EUR HT</strong>. Il est vendu <strong>17,60 EUR TTC</strong>, soit <strong>16 EUR HT</strong> (TVA restauration a 10 %). Deroulons tous les indicateurs.
          </p>

          <div className="overflow-x-auto my-6">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-mono-1000">
                  <th className="text-left px-4 py-3 font-semibold text-mono-400">Indicateur</th>
                  <th className="text-left px-4 py-3 font-semibold text-mono-400">Calcul</th>
                  <th className="text-left px-4 py-3 font-semibold text-mono-400">Resultat</th>
                </tr>
              </thead>
              <tbody>
                {[
                  ['Cout matiere HT', 'Fiche technique', '4,00 EUR'],
                  ['Prix de vente HT', '17,60 / 1,10', '16,00 EUR'],
                  ['Marge brute (EUR)', '16 moins 4', '12,00 EUR'],
                  ['Taux de marque', '12 / 16', '75 %'],
                  ['Taux de marge', '12 / 4', '300 %'],
                  ['Coefficient multiplicateur', '16 / 4', '4,0'],
                  ['Food cost', '4 / 16', '25 %'],
                ].map(([ind, calc, res], i) => (
                  <tr key={ind} className={`border-t border-mono-975 ${i === 3 ? 'bg-teal-50' : i === 4 ? 'bg-blue-50' : ''}`}>
                    <td className="px-4 py-2.5 font-bold text-mono-100">{ind}</td>
                    <td className="px-4 py-2.5 text-mono-500 font-mono text-xs">{calc}</td>
                    <td className="px-4 py-2.5 text-mono-100 font-semibold">{res}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <p>
            Observez la coherence de l'ensemble : le <strong>taux de marque (75 %)</strong> et le <strong>food cost (25 %)</strong> s'additionnent pour faire 100 %. Le <strong>coefficient (4)</strong> est l'inverse du food cost (1 / 0,25 = 4). Et le <strong>taux de marge (300 %)</strong> vaut le coefficient moins 1, exprime en pourcentage. Ces quatre chiffres decrivent la meme realite economique.
          </p>

          <p>
            C'est precisement pour cette raison que la confusion est dangereuse : un restaurateur qui lit "300 % de marge" pourrait croire son plat trois fois plus rentable qu'un plat "a 75 % de marge". Ce sont pourtant strictement les memes 12 EUR. Pour aller plus loin sur la construction du prix, consultez notre guide <Link to="/blog/prix-de-vente-restaurant" className="text-teal-600 hover:text-teal-700 font-semibold underline decoration-teal-300">calculer le prix de vente d'un plat</Link>.
          </p>

          <div className="bg-mono-1000 border border-mono-900 rounded-2xl p-6 my-8">
            <h3 className="text-base font-bold text-mono-100 mb-3 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-teal-600" />
              Le meme plat vu par un fournisseur de vin
            </h3>
            <p className="text-sm text-mono-400 leading-relaxed">
              Une bouteille achetee <strong>6 EUR HT</strong> et vendue <strong>24 EUR HT</strong> (verre compris) affiche une marge de 18 EUR. Taux de marque : 18/24 = <strong>75 %</strong>. Taux de marge : 18/6 = <strong>300 %</strong>. Coefficient : 4. Les boissons offrent souvent des taux de marque encore plus eleves (80 a 90 %) : voir notre article sur la <Link to="/blog/marge-boissons-restaurant" className="text-teal-600 hover:text-teal-700 font-semibold underline decoration-teal-300">marge sur les boissons</Link>.
            </p>
          </div>
        </section>

        {/* ═════════ SECTION 4 : Confusion ═════════ */}
        <section id="confusion" className="mb-14">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-12 h-12 bg-rose-100 rounded-xl flex items-center justify-center">
              <AlertTriangle className="w-6 h-6 text-rose-700" />
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-mono-100 !mt-0 !mb-0">4. Pourquoi la confusion est si frequente en restauration</h2>
          </div>

          <p>
            Trois raisons expliquent pourquoi ces deux notions se melangent en permanence dans la profession :
          </p>

          <ul className="space-y-3 my-5">
            <li className="flex items-start gap-3">
              <div className="w-8 h-8 bg-rose-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <span className="text-rose-700 font-bold text-sm">1</span>
              </div>
              <div>
                <strong className="text-mono-100">Le mot "marge" est utilise pour les deux.</strong> Dans le langage courant, "je fais 70 % de marge" ne precise jamais le denominateur. Le contexte comptable (marge brute rapportee au CA) impose pourtant un taux de marque, mais personne ne le dit.
              </div>
            </li>
            <li className="flex items-start gap-3">
              <div className="w-8 h-8 bg-rose-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <span className="text-rose-700 font-bold text-sm">2</span>
              </div>
              <div>
                <strong className="text-mono-100">Le commerce de detail raisonne en taux de marge.</strong> Un grossiste ou un caviste parle spontanement de taux de marge (rendement sur le cout d'achat). Le restaurateur, lui, pilote au chiffre d'affaires, donc en taux de marque. Les deux mondes se croisent sans utiliser le meme referentiel.
              </div>
            </li>
            <li className="flex items-start gap-3">
              <div className="w-8 h-8 bg-rose-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <span className="text-rose-700 font-bold text-sm">3</span>
              </div>
              <div>
                <strong className="text-mono-100">Les tableurs maison melangent les formules.</strong> Beaucoup de restaurateurs bricolent un Excel ou une cellule divise par le cout, la suivante par le prix de vente. Resultat : des colonnes "% marge" incoherentes d'une ligne a l'autre.
              </div>
            </li>
          </ul>

          <p>
            Cette confusion n'est pas anodine. Elle conduit soit a <strong>surestimer sa rentabilite</strong> (croire gagner 300 % quand on gagne 75 % de son prix), soit a <strong>sous-tarifer ses plats</strong> (appliquer 70 % de marge sur le cout au lieu du prix). Dans les deux cas, le compte de resultat trinque. Un logiciel qui applique une definition unique et coherente supprime le probleme a la source.
          </p>
        </section>

        {/* ═════════ SECTION 5 : Triangle ═════════ */}
        <section id="triangle" className="mb-14">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
              <Repeat className="w-6 h-6 text-purple-700" />
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-mono-100 !mt-0 !mb-0">5. Marque, coefficient multiplicateur et food cost</h2>
          </div>

          <p>
            En restauration, le taux de marque n'est jamais seul. Il vit dans un <strong>triangle</strong> avec le coefficient multiplicateur et le food cost. Connaitre l'un permet de retrouver les deux autres instantanement.
          </p>

          <div className="bg-mono-1000 border border-mono-900 rounded-2xl p-6 my-6 space-y-4">
            <div className="flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-mono-100 mb-1">Taux de marque et food cost sont complementaires</p>
                <p className="font-mono text-sm text-mono-400">Taux de marque = 100 % moins Food cost</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-mono-100 mb-1">Le coefficient decoule du taux de marque</p>
                <p className="font-mono text-sm text-mono-400">Coefficient = 1 / (1 moins Taux de marque) = 1 / Food cost</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-mono-100 mb-1">Le taux de marge se deduit du coefficient</p>
                <p className="font-mono text-sm text-mono-400">Taux de marge = (Coefficient moins 1) x 100</p>
              </div>
            </div>
          </div>

          <p>
            Concretement, si vous fixez un <strong>food cost cible de 28 %</strong> (une cible saine en restauration traditionnelle), alors :
          </p>

          <ul className="space-y-2 my-4">
            <li className="flex items-start gap-2">
              <ArrowRight className="w-5 h-5 text-teal-600 flex-shrink-0 mt-0.5" />
              <span>votre <strong>taux de marque</strong> est de 72 % (100 moins 28) ;</span>
            </li>
            <li className="flex items-start gap-2">
              <ArrowRight className="w-5 h-5 text-teal-600 flex-shrink-0 mt-0.5" />
              <span>votre <strong>coefficient multiplicateur</strong> est de 3,57 (1 / 0,28) ;</span>
            </li>
            <li className="flex items-start gap-2">
              <ArrowRight className="w-5 h-5 text-teal-600 flex-shrink-0 mt-0.5" />
              <span>votre <strong>taux de marge</strong> est de 257 % ((3,57 moins 1) x 100).</span>
            </li>
          </ul>

          <p>
            Ces quatre chiffres sont interchangeables. Le plus pratique au quotidien reste le <strong>food cost</strong> (et donc le taux de marque), car il se compare directement aux benchmarks du secteur et se retrouve dans le <Link to="/blog/prime-cost-restaurant" className="text-teal-600 hover:text-teal-700 font-semibold underline decoration-teal-300">prime cost</Link>. Pour approfondir la mecanique du multiplicateur, lisez le guide dedie au <Link to="/blog/coefficient-multiplicateur" className="text-teal-600 hover:text-teal-700 font-semibold underline decoration-teal-300">coefficient multiplicateur en restauration</Link>.
          </p>
        </section>

        {/* ═════════ SECTION 6 : Conversion ═════════ */}
        <section id="conversion" className="mb-14">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-12 h-12 bg-teal-100 rounded-xl flex items-center justify-center">
              <Repeat className="w-6 h-6 text-teal-700" />
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-mono-100 !mt-0 !mb-0">6. Tableau de conversion marge et marque</h2>
          </div>

          <p>
            Gardez ce tableau sous la main. Il relie le coefficient multiplicateur, le taux de marge, le taux de marque et le food cost pour les valeurs les plus courantes en restauration.
          </p>

          <div className="overflow-x-auto my-6">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-mono-1000">
                  <th className="text-left px-4 py-3 font-semibold text-mono-400">Coefficient</th>
                  <th className="text-left px-4 py-3 font-semibold text-mono-400">Taux de marge</th>
                  <th className="text-left px-4 py-3 font-semibold text-mono-400">Taux de marque</th>
                  <th className="text-left px-4 py-3 font-semibold text-mono-400">Food cost</th>
                </tr>
              </thead>
              <tbody>
                {conversions.map(([coef, marge, marque, fc], i) => (
                  <tr key={coef} className={`border-t border-mono-975 ${marque === '75 %' ? 'bg-teal-50' : ''}`}>
                    <td className="px-4 py-2.5 font-bold text-mono-100">{coef}</td>
                    <td className="px-4 py-2.5 text-blue-700 font-semibold">{marge}</td>
                    <td className="px-4 py-2.5 text-teal-700 font-semibold">{marque}</td>
                    <td className="px-4 py-2.5 text-mono-500">{fc}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <p>
            Lecture : un <strong>coefficient de 4</strong> equivaut a un taux de marge de 300 %, un taux de marque de 75 % et un food cost de 25 %. Toutes ces valeurs decrivent le meme plat. La colonne surlignee correspond a l'exemple du risotto vu plus haut.
          </p>

          <div className="bg-teal-50 border border-teal-200 rounded-2xl p-6 my-8">
            <h3 className="text-base font-bold text-mono-100 mb-3 flex items-center gap-2">
              <Calculator className="w-5 h-5 text-teal-600" />
              Les deux formules de conversion a memoriser
            </h3>
            <div className="space-y-3 font-mono text-sm">
              <p className="text-mono-100">
                <strong className="text-teal-700">Marge vers marque :</strong> Taux de marque = Taux de marge / (1 + Taux de marge)
              </p>
              <p className="text-mono-100">
                <strong className="text-teal-700">Marque vers marge :</strong> Taux de marge = Taux de marque / (1 moins Taux de marque)
              </p>
            </div>
            <p className="text-sm text-mono-500 mt-3">
              Exemple : un taux de marge de 250 % (2,5) donne 2,5 / 3,5 = 71,4 % de taux de marque. Verification dans le tableau : coefficient 3,5, ligne correspondante.
            </p>
          </div>
        </section>

        {/* ═════════ SECTION 7 : Marge brute ═════════ */}
        <section id="marge-brute" className="mb-14">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
              <Target className="w-6 h-6 text-blue-700" />
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-mono-100 !mt-0 !mb-0">7. La marge brute du restaurant est un taux de marque</h2>
          </div>

          <p>
            Voici le point le plus important pour un restaurateur. Quand vous lisez qu'un restaurant sain vise une <strong>marge brute de 65 a 75 %</strong>, ce pourcentage est un <strong>taux de marque</strong>, car il rapporte la marge matiere au chiffre d'affaires (le prix de vente), pas au cout d'achat.
          </p>

          <div className="bg-mono-100 rounded-xl p-5 my-6 font-mono text-sm text-white text-center">
            Marge brute (%) = (CA HT moins Cout matiere) / CA HT x 100 = Taux de marque
          </div>

          <p>
            Autrement dit, tous les benchmarks de marge brute que vous croisez en restauration sont des taux de marque. Les traduire par erreur en taux de marge conduit a des non-sens. Voici la correspondance :
          </p>

          <div className="overflow-x-auto my-6">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-mono-1000">
                  <th className="text-left px-4 py-3 font-semibold text-mono-400">Type d'etablissement</th>
                  <th className="text-left px-4 py-3 font-semibold text-mono-400">Marge brute (taux de marque)</th>
                  <th className="text-left px-4 py-3 font-semibold text-mono-400">Taux de marge equivalent</th>
                </tr>
              </thead>
              <tbody>
                {[
                  ['Pizzeria', '72 a 78 %', '257 a 355 %'],
                  ['Bistrot / brasserie', '68 a 74 %', '213 a 285 %'],
                  ['Restaurant traditionnel', '65 a 72 %', '186 a 257 %'],
                  ['Gastronomique', '68 a 75 %', '213 a 300 %'],
                  ['Boissons (bar)', '80 a 90 %', '400 a 900 %'],
                ].map(([type, marque, marge]) => (
                  <tr key={type} className="border-t border-mono-975">
                    <td className="px-4 py-2.5 font-bold text-mono-100">{type}</td>
                    <td className="px-4 py-2.5 text-teal-700 font-semibold">{marque}</td>
                    <td className="px-4 py-2.5 text-blue-700">{marge}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <p>
            Attention a ne pas s'arreter la : le taux de marque ne mesure que la <strong>marge matiere</strong>. Une fois la matiere payee, il reste a couvrir le personnel, le loyer, l'energie et les charges. C'est le role de la <Link to="/blog/marge-beneficiaire-restaurant-ideal" className="text-teal-600 hover:text-teal-700 font-semibold underline decoration-teal-300">marge beneficiaire</Link> et du <Link to="/blog/seuil-rentabilite-restaurant" className="text-teal-600 hover:text-teal-700 font-semibold underline decoration-teal-300">seuil de rentabilite</Link>. Un excellent taux de marque de 74 % peut coexister avec une marge nette de 2 %.
          </p>
        </section>

        {/* ═════════ SECTION 8 : Quel taux ═════════ */}
        <section id="quel-taux" className="mb-14">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center">
              <ListChecks className="w-6 h-6 text-emerald-700" />
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-mono-100 !mt-0 !mb-0">8. Quel taux utiliser, et quand ?</h2>
          </div>

          <p>
            Aucun des deux taux n'est meilleur dans l'absolu. Chacun a son terrain de jeu. Voici comment choisir :
          </p>

          <div className="grid sm:grid-cols-2 gap-4 my-6">
            <div className="bg-white border border-mono-900 rounded-xl p-5">
              <div className="flex items-center gap-2 mb-3">
                <Tag className="w-5 h-5 text-teal-700" />
                <h3 className="text-base font-bold text-mono-100">Utilisez le taux de marque pour...</h3>
              </div>
              <ul className="space-y-2 text-sm text-mono-400">
                <li className="flex items-start gap-2"><CheckCircle className="w-4 h-4 text-teal-600 flex-shrink-0 mt-0.5" /> Piloter votre marge brute au chiffre d'affaires</li>
                <li className="flex items-start gap-2"><CheckCircle className="w-4 h-4 text-teal-600 flex-shrink-0 mt-0.5" /> Fixer le prix de vente a partir d'un food cost cible</li>
                <li className="flex items-start gap-2"><CheckCircle className="w-4 h-4 text-teal-600 flex-shrink-0 mt-0.5" /> Comparer vos plats entre eux et aux benchmarks</li>
                <li className="flex items-start gap-2"><CheckCircle className="w-4 h-4 text-teal-600 flex-shrink-0 mt-0.5" /> Communiquer avec votre comptable</li>
              </ul>
            </div>
            <div className="bg-white border border-mono-900 rounded-xl p-5">
              <div className="flex items-center gap-2 mb-3">
                <TrendingUp className="w-5 h-5 text-blue-700" />
                <h3 className="text-base font-bold text-mono-100">Utilisez le taux de marge pour...</h3>
              </div>
              <ul className="space-y-2 text-sm text-mono-400">
                <li className="flex items-start gap-2"><CheckCircle className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" /> Evaluer le rendement d'un achat fournisseur</li>
                <li className="flex items-start gap-2"><CheckCircle className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" /> Negocier un tarif d'achat (base cout)</li>
                <li className="flex items-start gap-2"><CheckCircle className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" /> Dialoguer avec un grossiste ou un caviste</li>
                <li className="flex items-start gap-2"><CheckCircle className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" /> Raisonner comme dans le commerce de detail</li>
              </ul>
            </div>
          </div>

          <p>
            En pratique, un restaurateur passe 90 % de son temps en <strong>taux de marque</strong> (ou son miroir, le food cost), car toute sa gestion se rapporte au chiffre d'affaires. Le taux de marge reste utile ponctuellement, surtout cote achats. La regle d'or : ne jamais melanger les deux dans un meme tableau, et toujours preciser la base quand on annonce un pourcentage.
          </p>
        </section>

        {/* ═════════ SECTION 9 : Erreurs ═════════ */}
        <section id="erreurs" className="mb-14">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-12 h-12 bg-rose-100 rounded-xl flex items-center justify-center">
              <AlertTriangle className="w-6 h-6 text-rose-700" />
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-mono-100 !mt-0 !mb-0">9. Les 5 erreurs qui faussent vos prix</h2>
          </div>

          <div className="space-y-4 my-6">
            {[
              {
                titre: 'Appliquer un taux de marge la ou il faut un taux de marque',
                desc: "Vouloir 70 % de marge et diviser par le cout au lieu du prix de vente : le plat a 4 EUR est vendu 6,80 EUR au lieu de 13,33 EUR. La marge est divisee par deux. C'est l'erreur la plus couteuse.",
              },
              {
                titre: 'Calculer sur des prix TTC',
                desc: 'Inclure la TVA dans le prix de vente gonfle le taux de marque de 8 a 10 points. Un plat a 75 % de marque reelle affiche 77-78 % si on oublie de passer en HT. Toujours retirer la TVA d\'abord.',
              },
              {
                titre: 'Oublier les pertes et le gaspillage',
                desc: "Le cout matiere theorique de la fiche technique ignore les pertes (epluchures, ratees, DLC depassees). Le taux de marque reel est souvent 3 a 5 points sous le theorique. Suivez l'ecart via l'inventaire.",
              },
              {
                titre: 'Confondre marge brute et marge nette',
                desc: 'Un taux de marque de 74 % ne veut pas dire 74 % de benefice. Il reste a payer le personnel, le loyer et les charges. La rentabilite reelle se lit sur la marge nette, pas sur le taux de marque.',
              },
              {
                titre: 'Melanger les bases dans un meme tableau',
                desc: 'Un Excel maison qui divise une ligne par le cout et la suivante par le prix produit des colonnes incoherentes. Definissez une base unique (le taux de marque) et tenez-vous-y sur toute la carte.',
              },
            ].map((err, i) => (
              <div key={i} className="flex items-start gap-4 bg-rose-50 border border-rose-100 rounded-xl p-5">
                <div className="w-8 h-8 bg-rose-200 rounded-lg flex items-center justify-center flex-shrink-0">
                  <span className="text-rose-800 font-bold text-sm">{i + 1}</span>
                </div>
                <div>
                  <h3 className="text-base font-bold text-mono-100 mb-1">{err.titre}</h3>
                  <p className="text-sm text-mono-400 leading-relaxed">{err.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ═════════ SECTION 10 : Methode ═════════ */}
        <section id="methode" className="mb-14">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-12 h-12 bg-teal-100 rounded-xl flex items-center justify-center">
              <Zap className="w-6 h-6 text-teal-700" />
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-mono-100 !mt-0 !mb-0">10. Comment calculer et suivre ces taux</h2>
          </div>

          <p>
            Voici la methode en 7 etapes pour calculer, verifier et piloter vos taux sans jamais les confondre.
          </p>

          <ol className="space-y-4 my-6">
            {howToSteps.map((step, i) => (
              <li key={i} className="flex items-start gap-4">
                <div className="w-9 h-9 bg-teal-600 rounded-lg flex items-center justify-center flex-shrink-0 text-white font-bold text-sm">
                  {i + 1}
                </div>
                <div>
                  <h3 className="text-base font-bold text-mono-100 mb-1">{step.name}</h3>
                  <p className="text-sm text-mono-400 leading-relaxed">{step.text}</p>
                </div>
              </li>
            ))}
          </ol>

          <div className="bg-gradient-to-br from-teal-600 to-teal-700 rounded-2xl p-6 sm:p-8 text-white shadow-xl my-8">
            <div className="flex items-center gap-2 mb-3">
              <Award className="w-5 h-5" />
              <span className="text-xs font-bold uppercase tracking-wider text-teal-100">Automatisez le calcul</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-extrabold mb-3">
              RestauMargin calcule marque, marge, coefficient et food cost pour chaque plat
            </h3>
            <p className="text-teal-50 leading-relaxed mb-5">
              A partir de vos fiches techniques, RestauMargin affiche automatiquement le cout matiere, le taux de marque, le food cost et le coefficient, en HT et de facon coherente sur toute la carte. Fini les Excel qui melangent les bases. Vous voyez d'un coup d'oeil quels plats tirent votre marge vers le haut ou vers le bas.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link
                to="/outils/calculateur-marge-restaurant"
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-white text-teal-700 font-semibold rounded-full hover:bg-teal-50 transition-colors"
              >
                <Calculator className="w-4 h-4" />
                Calculateur de marge gratuit
              </Link>
              <Link
                to="/logiciel-marge-restaurant"
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-teal-800/50 text-white font-semibold rounded-full hover:bg-teal-800 transition-colors border border-teal-400/30"
              >
                Decouvrir le logiciel
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </section>

        {/* ═════════ FAQ ═════════ */}
        <section id="faq" className="mb-14">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center">
              <BookOpen className="w-6 h-6 text-emerald-700" />
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-mono-100 !mt-0 !mb-0">FAQ : 14 questions frequentes</h2>
          </div>

          <div className="space-y-4">
            {faqItems.map((item, i) => (
              <details key={i} className="group bg-mono-1000 border border-mono-900 rounded-xl overflow-hidden">
                <summary className="cursor-pointer list-none px-5 py-4 flex items-start justify-between gap-4 hover:bg-mono-975 transition-colors">
                  <span className="font-semibold text-mono-100 text-sm sm:text-base">{item.question}</span>
                  <span className="text-teal-600 text-xl leading-none flex-shrink-0 group-open:rotate-45 transition-transform">+</span>
                </summary>
                <div className="px-5 pb-5 text-sm text-mono-400 leading-relaxed">
                  {item.answer}
                </div>
              </details>
            ))}
          </div>
        </section>

        {/* ── Articles connexes (maillage interne) ── */}
        <section className="mb-4">
          <h2 className="text-xl font-bold text-mono-100 mb-5 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-teal-600" />
            Pour aller plus loin
          </h2>
          <div className="grid sm:grid-cols-2 gap-3">
            {[
              ['/blog/calcul-marge-restaurant', 'Marge restaurant 2026 : calcul, formule, food cost'],
              ['/blog/coefficient-multiplicateur', 'Le coefficient multiplicateur en restauration'],
              ['/blog/prix-de-vente-restaurant', "Calculer le prix de vente d'un plat"],
              ['/blog/reduire-food-cost', 'Reduire le food cost : 10 strategies'],
              ['/blog/prime-cost-restaurant', "Prime cost : l'indicateur n 1 de rentabilite"],
              ['/blog/5-ratios-cles-restaurant', 'Les 5 ratios cles a suivre en restaurant'],
              ['/blog/marge-beneficiaire-restaurant-ideal', 'Quelle marge beneficiaire viser ?'],
              ['/blog/marge-boissons-restaurant', 'Quelle marge sur les boissons ?'],
            ].map(([href, label]) => (
              <Link
                key={href}
                to={href}
                className="flex items-center justify-between gap-3 bg-white border border-mono-900 rounded-xl px-4 py-3 hover:border-teal-300 hover:bg-teal-50/40 transition-colors group"
              >
                <span className="text-sm font-medium text-mono-100">{label}</span>
                <ArrowRight className="w-4 h-4 text-teal-600 flex-shrink-0 group-hover:translate-x-0.5 transition-transform" />
              </Link>
            ))}
          </div>
        </section>

        </article>

        {/* ── Auteur (E-E-A-T) ── */}
        <BlogAuthor publishedDate="2026-07-13" readTime="16 min" variant="footer" />

        {/* ── Retour blog ── */}
        <div className="mt-12 pt-8 border-t border-mono-900">
          <Link to="/blog" className="inline-flex items-center gap-2 text-teal-600 hover:text-teal-700 font-semibold transition-colors">
            <ArrowLeft className="w-4 h-4" />
            Retour au blog
          </Link>
        </div>
      </main>
    </div>
  );
}
