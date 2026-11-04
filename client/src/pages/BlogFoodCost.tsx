import { Link } from 'react-router-dom';
import {
  ChefHat,
  Calculator,
  ArrowRight,
  ArrowLeft,
  BookOpen,
  Target,
  TrendingDown,
  TrendingUp,
  ShoppingCart,
  BarChart3,
  LineChart,
  Zap,
  AlertTriangle,
  CheckCircle,
  Percent,
  Lightbulb,
  ListChecks,
  Pizza,
  Beef,
  Award,
  Sparkles,
} from 'lucide-react';
import SEOHead, { buildFAQSchema, buildBreadcrumbSchema } from '../components/SEOHead';
import BlogAuthor from '../components/BlogAuthor';
import BlogArticleHero from '../components/blog/BlogArticleHero';
import PublicHeader from '../components/public/PublicHeader';
import PublicFooter from '../components/public/PublicFooter';

/* ═══════════════════════════════════════════════════════════════
   Blog SEO — "Food cost restaurant : guide ultime 2026"
   Mot-cle principal : food cost restaurant + food cost calcul
   ~3 800 mots — featured snippet first, EEAT signals, schema rich
   ═══════════════════════════════════════════════════════════════ */

const faqItems = [
  {
    question: "Qu'est-ce que le food cost en restauration ?",
    answer:
      "Le food cost (ou coût matière) est le ratio entre le coût des matières premières consommées et le chiffre d'affaires hors taxes du restaurant. Il s'exprime en pourcentage. Un food cost de 30 % signifie que pour chaque euro de vente HT, 30 centimes sont consacrés aux ingrédients. C'est l'indicateur numéro un pour piloter la rentabilité opérationnelle d'un restaurant en France comme à l'international.",
  },
  {
    question: "Comment calculer le food cost d'un plat étape par étape ?",
    answer:
      "Additionnez le coût matière de tous les ingrédients (quantités nettes après pertes multipliées par le prix d'achat HT), puis divisez par le prix de vente HT et multipliez par 100. La formule précise est : Food cost (%) = (Coût matière total / Prix de vente HT) x 100. Pour un plat vendu 18 EUR HT avec 5,40 EUR d'ingrédients, le food cost est de 30 % et la marge brute de 70 %.",
  },
  {
    question: "Quel food cost idéal viser en 2026 ?",
    answer:
      "Le food cost cible dépend du type d'établissement. Une pizzeria peut viser 22-28 %, un fast-food 25-30 %, une brasserie 28-32 %, un restaurant traditionnel 30-35 %, un gastronomique 32-38 % et un food truck 25-30 %. La règle absolue : le prime cost (food cost + masse salariale) ne doit jamais dépasser 65 % du chiffre d'affaires pour rester rentable.",
  },
  {
    question: "Quelle différence entre food cost théorique et food cost réel ?",
    answer:
      "Le food cost théorique est calculé à partir des fiches techniques (ingrédients idéaux, grammages exacts). Le food cost réel est calculé à partir des achats effectifs constatés en comptabilité : (stock initial + achats - stock final) / CA HT. L'écart entre les deux révèle le gaspillage, les sur-portions, le vol ou les erreurs d'inventaire. Un écart supérieur à 2 points doit déclencher une investigation immédiate.",
  },
  {
    question: "Comment réduire son food cost sans baisser la qualité ?",
    answer:
      "Cinq leviers majeurs : 1) fiches techniques précises au gramme près pour éliminer les sur-portions, 2) négociation des 5 plus gros fournisseurs avec demande de devis annuels, 3) réduction du gaspillage via pesée des déchets et méthode FIFO, 4) menu engineering pour promouvoir les plats à forte marge, 5) mercuriale hebdomadaire pour acheter au meilleur prix. Cumulés, ces leviers font gagner 4 à 8 points de food cost en 3 mois.",
  },
  {
    question: "Quelle est la formule du coefficient multiplicateur restaurant ?",
    answer:
      "Le coefficient multiplicateur en restauration est l'inverse mathématique du food cost. Formule : Coefficient = 1 / Food cost cible. Pour un food cost cible de 30 %, le coefficient est 1 / 0,30 = 3,33. Pour fixer un prix de vente : Prix de vente HT = Coût matière x Coefficient. Un plat avec 4 EUR de matière et un coefficient de 3,33 doit être vendu 13,33 EUR HT minimum.",
  },
  {
    question: "À quelle fréquence recalculer le food cost ?",
    answer:
      "Le food cost global du restaurant doit être suivi chaque semaine au minimum. Les fiches techniques individuelles doivent être mises à jour à chaque variation de prix fournisseur, soit en moyenne tous les mois sur les produits frais (viandes, poissons, légumes) et tous les trimestres sur l'épicerie et les vins. Avec un outil comme RestauMargin, ce suivi est automatisé via le scan OCR des factures fournisseurs.",
  },
  {
    question: "Le food cost inclut-il les boissons ?",
    answer:
      "En général, on distingue le food cost (nourriture seule, cible 25-35 %) du beverage cost (boissons, cible 18-25 % pour les softs et 20-30 % pour les vins). Cette distinction permet d'analyser séparément les performances cuisine et bar. Pour une vision globale, on calcule le COGS (Cost of Goods Sold) qui combine les deux. La marge brute sur les boissons étant généralement supérieure, un bar dynamique booste fortement la rentabilité globale.",
  },
  {
    question: "Faut-il calculer son food cost en HT ou en TTC ?",
    answer:
      "Toujours en HT (hors taxes). La TVA collectée ne vous appartient pas, elle est reversée à l'État (10 % en restauration sur place, 5,5 % à emporter en France). Calculer le food cost sur un prix TTC donnerait un ratio artificiellement bas et fausserait toute l'analyse de marge. De même, le coût matière est toujours pris en HT puisque la TVA sur les achats est récupérable.",
  },
  {
    question: "Comment intégrer les pertes au parage dans le food cost ?",
    answer:
      "Les pertes au parage (gras, os, peau, épluchures) doivent obligatoirement être prises en compte. Méthode : pesez la quantité brute, pesez la quantité nette utilisable, calculez le ratio de perte. Exemple : un filet de poisson entier avec 60 % de perte acheté 18 EUR/kg coûte réellement 45 EUR/kg net (18 / 0,40). Sans cette correction, votre food cost théorique sera systématiquement sous-estimé de 5 à 15 points.",
  },
  {
    question: "Pourquoi mon food cost réel est-il supérieur au food cost théorique ?",
    answer:
      "Sept causes principales : sur-portions des cuisiniers (sans pesée, on dose 10-15 % en plus), gaspillage alimentaire (14 % en moyenne), erreurs d'inventaire, vols (interne ou externe), offerts non comptabilisés (pain, amuse-bouche, geste commercial), pertes à la cuisson non intégrées aux fiches, hausses fournisseurs non répercutées. La méthode pour traquer l'écart : inventaire hebdomadaire, pesée des déchets, mercuriale à jour.",
  },
  {
    question: "Quel impact d'un food cost mal maîtrisé sur la rentabilité ?",
    answer:
      "Un food cost qui dérive de 30 % à 35 % sur un restaurant à 500 000 EUR de CA représente 25 000 EUR de marge brute perdus chaque année. Sur un restaurant à 1 million EUR, c'est 50 000 EUR. Pire : un food cost trop élevé compresse la marge nette qui n'est déjà que de 5 à 15 % en moyenne. C'est la première cause de fermeture des restaurants dans les trois premières années selon l'INSEE.",
  },
  {
    question: "Le food cost est-il différent pour la livraison et la salle ?",
    answer:
      "Oui, et c'est un piège majeur. Le food cost livraison est généralement plus élevé à cause des commissions plateformes (UberEats, Deliveroo : 25-35 % du prix vente) et du packaging (0,30 à 0,80 EUR par commande). Beaucoup de restaurants pensent gagner sur la livraison alors qu'ils y perdent. Calculez un food cost dédié par canal de vente et adaptez vos prix livraison en conséquence (+15 à +20 % par rapport au prix salle).",
  },
  {
    question: "Comment automatiser le calcul du food cost ?",
    answer:
      "Trois options : 1) tableur Excel avec formules manuelles (gratuit mais chronophage et source d'erreurs), 2) calculateur en ligne gratuit comme celui de RestauMargin (rapide pour des plats isolés), 3) logiciel complet de gestion qui scanne les factures fournisseurs, met à jour automatiquement les fiches techniques, calcule le food cost en temps réel et alerte en cas de dérive. L'automatisation fait gagner 5 à 10 heures par semaine et réduit drastiquement les erreurs.",
  },
  {
    question: "Quel est le food cost moyen d'un restaurant en France en 2026 ?",
    answer:
      "Le food cost moyen d'un restaurant traditionnel français se situe autour de 30 à 32 % en 2026, sous l'effet de l'inflation alimentaire cumulée depuis 2022. La restauration rapide tourne autour de 28 à 30 %, la pizzeria descend à 22 à 26 % grâce au coût matière bas de la pâte, et la gastronomie monte à 33 à 38 % du fait des produits nobles. Un restaurant bien piloté vise un food cost réel inférieur de 2 à 3 points à la moyenne de son segment : c'est la différence entre une marge nette de 5 % et de 10 %.",
  },
];

const howToSteps = [
  { name: "Lister tous les ingrédients du plat", text: "Dressez la liste exhaustive de chaque ingrédient avec son grammage exact, y compris les petits (huile, sel, herbes, décor) qui peuvent représenter 5 à 10 % du coût réel." },
  { name: "Peser les quantités nettes après parage", text: "Distinguez systématiquement quantité brute et quantité nette. Un kilo de carottes donne 800 g épluchés, un filet de poisson entier perd 60 % à la découpe." },
  { name: "Relever les prix d'achat HT actualisés", text: "Utilisez le prix moyen pondéré sur les 3 derniers mois, frais de port inclus. Mettez à jour mensuellement pour les produits frais." },
  { name: "Calculer le coût par ingrédient", text: "Multipliez quantité nette x prix unitaire. Exemple : 180 g de saumon à 22 EUR/kg = 0,180 x 22 = 3,96 EUR." },
  { name: "Additionner pour obtenir le coût matière total", text: "La somme de tous les coûts ingrédients donne le coût matière total du plat. Ajoutez 0,40 à 0,80 EUR pour les à-côtés (pain, beurre, sauce, décor)." },
  { name: "Diviser par le prix de vente HT", text: "Food cost (%) = (Coût matière total / Prix de vente HT) x 100. Calculez toujours en HT, jamais en TTC." },
  { name: "Comparer aux benchmarks de votre type d'établissement", text: "Si vous êtes au-dessus de la cible, agissez : réduire portions, négocier fournisseurs, substituer un ingrédient, ajuster le prix de vente." },
  { name: "Mettre à jour mensuellement", text: "Refaites le calcul à chaque variation significative de prix fournisseur. Sans suivi, le food cost peut dériver de 28 % à 34 % en 6 mois sans s'en rendre compte." },
];

export default function BlogFoodCost() {
  return (
    <div className="min-h-screen bg-white">
      <SEOHead
        title="Food cost restaurant : calcul, formule et benchmarks (guide 2026)"
        description="Le food cost en restauration expliqué de A à Z : formule exacte, exemple chiffré, benchmarks par type de restaurant, 10 leviers pour le réduire. Guide complet 2026."
        path="/blog/reduire-food-cost"
        type="article"
        schema={[
          buildFAQSchema(faqItems),
          buildBreadcrumbSchema([
            { name: 'Accueil', url: 'https://www.restaumargin.fr/' },
            { name: 'Blog', url: 'https://www.restaumargin.fr/blog' },
            { name: 'Food cost restaurant', url: 'https://www.restaumargin.fr/blog/reduire-food-cost' },
          ]),
          {
            '@context': 'https://schema.org',
            '@type': 'HowTo',
            name: 'Comment calculer le food cost d\'un restaurant en 8 étapes',
            description: 'Méthode complète pour calculer le food cost d\'un plat de restaurant en tenant compte des pertes au parage, des à-côtés et des benchmarks sectoriels.',
            totalTime: 'PT20M',
            tool: ['Balance de précision', 'Calculatrice', 'Tableur ou logiciel RestauMargin', 'Factures fournisseurs'],
            step: howToSteps.map((s) => ({ '@type': 'HowToStep', name: s.name, text: s.text })),
          },
          {
            '@context': 'https://schema.org',
            '@type': 'Article',
            headline: 'Food cost restaurant : calcul, formule et benchmarks (guide 2026)',
            description: 'Guide complet du food cost en restauration : définition, formule, exemple chiffré, benchmarks par type d\'établissement, 10 leviers pour le réduire et erreurs courantes à éviter.',
            image: 'https://www.restaumargin.fr/og-image.png',
            author: { '@type': 'Organization', name: 'RestauMargin', url: 'https://www.restaumargin.fr' },
            publisher: {
              '@type': 'Organization',
              name: 'RestauMargin',
              logo: { '@type': 'ImageObject', url: 'https://www.restaumargin.fr/icon-512.png' },
            },
            datePublished: '2026-04-14',
            dateModified: '2026-06-03',
            wordCount: 3950,
            inLanguage: 'fr-FR',
            mainEntityOfPage: { '@type': 'WebPage', '@id': 'https://www.restaumargin.fr/blog/reduire-food-cost' },
            citation: [
              { '@type': 'CreativeWork', name: 'Observatoire de la restauration 2025 - Fiducial' },
              { '@type': 'CreativeWork', name: 'INSEE - Secteur de l\'hébergement et restauration' },
              { '@type': 'CreativeWork', name: 'GIRA Conseil - Tendances restauration France 2026' },
              { '@type': 'CreativeWork', name: 'KPMG - Étude annuelle hôtellerie-restauration' },
            ],
          },
        ]}
      />

      {/* ── Navbar ── */}
      <PublicHeader />

      {/* ── Breadcrumbs ── */}
      <div className="bg-mono-1000 border-b border-mono-900 py-3 px-4">
        <div className="max-w-4xl mx-auto text-xs text-mono-500 flex items-center gap-2 flex-wrap">
          <Link to="/" className="hover:text-teal-600">Accueil</Link>
          <span>/</span>
          <Link to="/blog" className="hover:text-teal-600">Blog</Link>
          <span>/</span>
          <span className="text-mono-100 font-medium">Food cost restaurant</span>
        </div>
      </div>

      {/* ── Hero ── */}
      <BlogArticleHero
        category="Food Cost"
        readTime="18 min"
        date="Juin 2026"
        title="Food cost restaurant : le guide complet 2026 pour le calculer et le maîtriser"
        accentWord="food cost"
        subtitle="La formule exacte, l'exemple chiffré détaillé, les benchmarks par type d'établissement et les 10 leviers éprouvés pour faire passer votre food cost sous la barre des 30 % sans sacrifier la qualité."
      />

      <main className="max-w-4xl mx-auto px-6 sm:px-10 lg:px-12 pb-24 pt-8 bg-white relative z-10 rounded-t-3xl shadow-xl">
        <BlogAuthor publishedDate="2026-04-14" updatedDate="2026-06-03" readTime="18 min" variant="header" />

        {/* ── Intro / Featured snippet ── */}
        <div className="bg-gradient-to-br from-teal-50 to-emerald-50 border-l-4 border-teal-600 rounded-r-2xl p-5 sm:p-6 my-8">
          <p className="text-xs font-bold uppercase tracking-wider text-teal-700 mb-2">Définition rapide</p>
          <p className="text-base sm:text-lg text-mono-100 leading-relaxed">
            Le <strong>food cost</strong> est le ratio entre le coût des matières premières consommées et le chiffre d'affaires hors taxes du restaurant, exprimé en pourcentage. <strong>Formule : Food cost (%) = (Coût matières / Prix de vente HT) x 100</strong>. En restauration française, la cible se situe entre 25 % et 35 % selon le type d'établissement. C'est l'indicateur numéro un de pilotage de la rentabilité opérationnelle.
          </p>
        </div>

        {/* ── Encadre formule visible ── */}
        <div className="mt-10 bg-gradient-to-br from-teal-600 to-teal-700 rounded-2xl p-6 sm:p-8 text-white shadow-xl">
          <div className="flex items-center gap-2 mb-3">
            <Zap className="w-5 h-5" />
            <span className="text-xs font-bold uppercase tracking-wider text-teal-100">Formules essentielles food cost</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold mb-4">
            Les 5 formules clés à retenir
          </h2>
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-5 space-y-3 font-mono text-sm sm:text-base">
            <div className="flex items-start gap-2">
              <span className="text-teal-200 font-bold">1.</span>
              <span><strong className="text-white">Food cost (%)</strong> = (Coût matières / Prix de vente HT) x 100</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-teal-200 font-bold">2.</span>
              <span><strong className="text-white">Marge brute (%)</strong> = 100 - Food cost</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-teal-200 font-bold">3.</span>
              <span><strong className="text-white">Food cost réel</strong> = (Stock initial + Achats - Stock final) / CA HT x 100</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-teal-200 font-bold">4.</span>
              <span><strong className="text-white">Coefficient multiplicateur</strong> = 1 / Food cost cible</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-teal-200 font-bold">5.</span>
              <span><strong className="text-white">Prime cost (%)</strong> = (Food cost + Labour cost) / CA HT x 100</span>
            </div>
          </div>
          <p className="mt-4 text-teal-100 text-sm">
            Objectif standard 2026 : food cost entre 25 % et 35 %, marge brute entre 65 % et 75 %, prime cost sous 65 %.
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
              { href: '#definition', label: 'Définition du food cost en restauration' },
              { href: '#pourquoi', label: 'Pourquoi le food cost est l\'indicateur clé' },
              { href: '#formule', label: 'La formule du food cost (théorique vs réel)' },
              { href: '#methode', label: 'Comment calculer le food cost en 8 étapes' },
              { href: '#exemple', label: 'Exemple chiffré détaillé : saumon grillé' },
              { href: '#benchmarks', label: 'Benchmarks food cost par type de restaurant' },
              { href: '#derives', label: 'Pourquoi mon food cost dérive ?' },
              { href: '#leviers', label: '10 leviers concrets pour réduire le food cost' },
              { href: '#vs', label: 'Food cost vs prime cost vs marge brute' },
              { href: '#erreurs', label: 'Les 7 erreurs courantes à éviter' },
              { href: '#outils', label: 'Outils pour automatiser le calcul' },
              { href: '#faq', label: 'FAQ : 14 questions fréquentes' },
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

        {/* ═════════ SECTION 1 : Definition ═════════ */}
        <section id="definition" className="mb-14">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-12 h-12 bg-teal-100 rounded-xl flex items-center justify-center">
              <Calculator className="w-6 h-6 text-teal-700" />
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-mono-100 !mt-0 !mb-0">1. Définition du food cost en restauration</h2>
          </div>

          <p>
            Le <strong>food cost</strong>, traduit en français par <strong>coût matière</strong> ou <strong>ratio matières premières</strong>, est le pourcentage de votre chiffre d'affaires hors taxes que vous consacrez à l'achat des ingrédients servis. Si vous vendez 100 EUR HT de nourriture et que vous dépensez 30 EUR en matières premières pour produire ces plats, votre food cost est de 30 %.
          </p>

          <p>
            Ce ratio est universellement reconnu comme l'indicateur de gestion numéro un en restauration. Selon l'<strong>Observatoire de la restauration Fiducial 2025</strong>, 78 % des restaurateurs français le suivent au moins mensuellement, et c'est le seul ratio que la totalité des experts-comptables spécialisés CHR exigent dans leurs tableaux de bord clients.
          </p>

          <p>
            On distingue deux notions essentielles que beaucoup de restaurateurs confondent :
          </p>

          <ul className="space-y-2 my-4">
            <li className="flex items-start gap-2">
              <CheckCircle className="w-5 h-5 text-teal-600 flex-shrink-0 mt-0.5" />
              <span><strong>Food cost théorique</strong> : calculé à partir des fiches techniques (grammages idéaux, prix d'achat connus). C'est l'objectif à atteindre.</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle className="w-5 h-5 text-teal-600 flex-shrink-0 mt-0.5" />
              <span><strong>Food cost réel</strong> : calculé à partir des achats effectifs constatés en comptabilité. C'est la réalité de votre gestion.</span>
            </li>
          </ul>

          <p>
            L'écart entre les deux est votre <strong>dérive</strong>. Un écart inférieur à 2 points est acceptable. Au-delà, il y a un problème : gaspillage, sur-portions, vol, ou erreurs de fiches techniques. Selon une étude <strong>GIRA Conseil 2024</strong>, l'écart moyen en France est de 3,8 points, soit 19 000 EUR par an de marge perdue sur un restaurant à 500 000 EUR de CA.
          </p>

          <div className="bg-amber-50 border-l-4 border-amber-400 rounded-r-xl p-5 my-6">
            <div className="flex items-start gap-3">
              <Lightbulb className="w-5 h-5 text-amber-700 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-bold text-amber-900 mb-1">Le saviez-vous ?</p>
                <p className="text-sm text-amber-800">
                  Le terme "food cost" vient des États-Unis où il est utilisé depuis les années 1950. En France, il s'est généralisé dans les écoles hôtelières à partir des années 1990. Aujourd'hui, c'est le ratio le plus enseigné en BTS et licence hôtellerie-restauration.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ═════════ SECTION 2 : Pourquoi ═════════ */}
        <section id="pourquoi" className="mb-14">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center">
              <Target className="w-6 h-6 text-emerald-700" />
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-mono-100 !mt-0 !mb-0">2. Pourquoi le food cost est l'indicateur clé</h2>
          </div>

          <p>
            Trois raisons fondamentales expliquent pourquoi le food cost est suivi avant tous les autres indicateurs en restauration :
          </p>

          <div className="grid sm:grid-cols-3 gap-4 my-6">
            <div className="bg-white border border-mono-900 rounded-xl p-5">
              <div className="w-10 h-10 bg-teal-100 rounded-lg flex items-center justify-center mb-3">
                <Percent className="w-5 h-5 text-teal-700" />
              </div>
              <h3 className="text-base font-bold text-mono-100 mb-2">Premier poste de coût</h3>
              <p className="text-sm text-mono-400 leading-relaxed">
                Les matières premières représentent 25 à 38 % du chiffre d'affaires. C'est le plus gros poste après les salaires. 1 point gagné = 1 % du CA directement en marge nette.
              </p>
            </div>
            <div className="bg-white border border-mono-900 rounded-xl p-5">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mb-3">
                <Zap className="w-5 h-5 text-blue-700" />
              </div>
              <h3 className="text-base font-bold text-mono-100 mb-2">Actionnable au quotidien</h3>
              <p className="text-sm text-mono-400 leading-relaxed">
                Contrairement au loyer fixe, le food cost peut être optimisé chaque jour : négociation fournisseurs, ajustement des portions, suppression des plats peu rentables.
              </p>
            </div>
            <div className="bg-white border border-mono-900 rounded-xl p-5">
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center mb-3">
                <BarChart3 className="w-5 h-5 text-purple-700" />
              </div>
              <h3 className="text-base font-bold text-mono-100 mb-2">Comparable et standardisé</h3>
              <p className="text-sm text-mono-400 leading-relaxed">
                Tous les restaurants du monde utilisent le même calcul. Vous pouvez vous benchmarker sur votre secteur, votre région, votre concept.
              </p>
            </div>
          </div>

          <p>
            Concrètement, sur un restaurant à <strong>500 000 EUR de chiffre d'affaires annuel HT</strong> :
          </p>

          <div className="overflow-x-auto my-6">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-mono-1000">
                  <th className="text-left px-4 py-3 font-semibold text-mono-400">Food cost</th>
                  <th className="text-left px-4 py-3 font-semibold text-mono-400">Coût matière annuel</th>
                  <th className="text-left px-4 py-3 font-semibold text-mono-400">Marge brute annuelle</th>
                  <th className="text-left px-4 py-3 font-semibold text-mono-400">Impact sur marge nette</th>
                </tr>
              </thead>
              <tbody>
                {[
                  ['25 %', '125 000 EUR', '375 000 EUR', 'Excellent'],
                  ['28 %', '140 000 EUR', '360 000 EUR', 'Très bon'],
                  ['30 %', '150 000 EUR', '350 000 EUR', 'Standard'],
                  ['32 %', '160 000 EUR', '340 000 EUR', 'À surveiller'],
                  ['35 %', '175 000 EUR', '325 000 EUR', 'Critique'],
                  ['38 %', '190 000 EUR', '310 000 EUR', 'Perte probable'],
                ].map(([fc, cm, mb, imp]) => (
                  <tr key={fc} className="border-t border-mono-975">
                    <td className="px-4 py-2.5 font-semibold text-teal-700">{fc}</td>
                    <td className="px-4 py-2.5 text-mono-350">{cm}</td>
                    <td className="px-4 py-2.5 text-mono-350">{mb}</td>
                    <td className="px-4 py-2.5 text-mono-500 font-medium">{imp}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <p>
            Entre un food cost à 25 % et un food cost à 35 %, la différence est de <strong>50 000 EUR de marge brute annuelle</strong> sur le même chiffre d'affaires. Sur 5 ans, c'est 250 000 EUR. C'est exactement pour cela que ce ratio est la priorité absolue de tout restaurateur sérieux.
          </p>
        </section>

        {/* ═════════ SECTION 3 : Formule ═════════ */}
        <section id="formule" className="mb-14">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
              <Calculator className="w-6 h-6 text-blue-700" />
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-mono-100 !mt-0 !mb-0">3. La formule du food cost : théorique vs réel</h2>
          </div>

          <p>
            Il existe <strong>deux formules</strong> du food cost, et toute la science de la gestion en restauration consiste à réduire l'écart entre les deux.
          </p>

          <h3 className="text-xl font-bold text-mono-100 mt-8 mb-3">Formule du food cost théorique (par plat)</h3>
          <div className="bg-mono-100 rounded-xl p-5 my-4 font-mono text-sm text-white">
            Food cost théorique (%) = (Coût matière du plat / Prix de vente HT du plat) x 100
          </div>
          <p>
            Cette formule s'applique <strong>plat par plat</strong>, à partir de la fiche technique. Elle suppose une utilisation parfaite des ingrédients, sans gaspillage ni sur-portion. C'est votre objectif.
          </p>

          <h3 className="text-xl font-bold text-mono-100 mt-8 mb-3">Formule du food cost réel (sur une période)</h3>
          <div className="bg-mono-100 rounded-xl p-5 my-4 font-mono text-sm text-white">
            Food cost réel (%) = ((Stock initial + Achats période - Stock final) / CA HT période) x 100
          </div>
          <p>
            Cette formule s'applique <strong>au restaurant entier</strong> sur une période (semaine, mois, année). Elle intègre tout : les pertes, le gaspillage, les offerts, les sur-portions, le vol éventuel. C'est votre réalité.
          </p>

          <div className="bg-rose-50 border-l-4 border-rose-400 rounded-r-xl p-5 my-6">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-rose-700 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-bold text-rose-900 mb-1">Piège classique à éviter</p>
                <p className="text-sm text-rose-800">
                  Ne calculez <strong>jamais</strong> votre food cost réel en divisant les achats du mois par le CA du mois. Vous oubliez les stocks. Un mois où vous achetez beaucoup pour stocker fausserait le ratio. Toujours intégrer (Stock initial + Achats - Stock final).
                </p>
              </div>
            </div>
          </div>

          <h3 className="text-xl font-bold text-mono-100 mt-8 mb-3">Exemple chiffré comparatif</h3>
          <p>
            Exemple illustratif (chiffres fictifs) : un bistrot, sur un mois d'avril :
          </p>
          <div className="overflow-x-auto my-4">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-mono-1000">
                  <th className="text-left px-4 py-3 font-semibold text-mono-400">Élément</th>
                  <th className="text-right px-4 py-3 font-semibold text-mono-400">Montant</th>
                </tr>
              </thead>
              <tbody>
                {[
                  ['Stock initial 01/04', '4 200 EUR'],
                  ['Achats avril', '20 800 EUR'],
                  ['Stock final 30/04', '3 900 EUR'],
                  ['Consommation réelle', '21 100 EUR'],
                  ['Chiffre d\'affaires HT avril', '65 000 EUR'],
                  ['Food cost réel', '32,5 %'],
                  ['Food cost théorique (fiches techniques)', '28,8 %'],
                  ['Écart (dérive)', '3,7 points'],
                ].map(([k, v], i) => (
                  <tr key={k} className={`border-t border-mono-975 ${i >= 6 ? 'bg-amber-50' : ''}`}>
                    <td className="px-4 py-2.5 font-medium text-mono-100">{k}</td>
                    <td className="px-4 py-2.5 text-right font-mono text-mono-350">{v}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <p>
            Diagnostic : un écart de 3,7 points est préoccupant. Cela représente <strong>2 405 EUR de marge perdue sur le mois</strong> (3,7 % de 65 000 EUR), soit 28 860 EUR par an. Le restaurateur doit immédiatement enquêter sur les causes : gaspillage, sur-portions, vol.
          </p>
        </section>

        {/* ═════════ SECTION 4 : Methode 8 etapes ═════════ */}
        <section id="methode" className="mb-14">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
              <ListChecks className="w-6 h-6 text-purple-700" />
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-mono-100 !mt-0 !mb-0">4. Comment calculer le food cost en 8 étapes</h2>
          </div>

          <p>
            Voici la méthode complète utilisée par les chefs et les contrôleurs de gestion CHR. Comptez 15 à 20 minutes par plat la première fois, puis 3 à 5 minutes une fois rodé.
          </p>

          <div className="space-y-4 my-8">
            {howToSteps.map((item, i) => (
              <div key={i} className="flex gap-4 bg-white border border-mono-900 rounded-2xl p-5">
                <div className="w-12 h-12 bg-teal-600 text-white rounded-xl flex items-center justify-center flex-shrink-0 font-extrabold text-lg shadow-md">
                  {i + 1}
                </div>
                <div>
                  <h3 className="text-base font-bold text-mono-100 !mt-0 !mb-1">{item.name}</h3>
                  <p className="text-sm text-mono-400 leading-relaxed !mb-0">{item.text}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="bg-teal-50 border-l-4 border-teal-500 rounded-r-xl p-5 my-6">
            <div className="flex items-start gap-3">
              <Sparkles className="w-5 h-5 text-teal-700 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-bold text-teal-900 mb-1">Astuce gain de temps</p>
                <p className="text-sm text-teal-800">
                  Au lieu de refaire ce calcul manuellement pour chaque plat, utilisez le{' '}
                  <Link to="/outils/calculateur-food-cost" className="underline font-semibold hover:text-teal-900">
                    calculateur de food cost gratuit RestauMargin
                  </Link>. Vous saisissez ingrédients, grammages et prix, le food cost et la marge brute s'affichent instantanément avec le verdict (cible atteinte ou non).
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ═════════ SECTION 5 : Exemple ═════════ */}
        <section id="exemple" className="mb-14">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-12 h-12 bg-rose-100 rounded-xl flex items-center justify-center">
              <Beef className="w-6 h-6 text-rose-700" />
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-mono-100 !mt-0 !mb-0">5. Exemple chiffré détaillé : saumon grillé</h2>
          </div>

          <p>
            Prenons un exemple illustratif. Voici la fiche technique complète d'un plat phare : <strong>saumon grillé, riz basmati et haricots verts</strong>, vendu 19,90 EUR TTC (soit 18,09 EUR HT à 10 % de TVA).
          </p>

          <h3 className="text-xl font-bold text-mono-100 mt-6 mb-3">Étape 1 : la fiche technique</h3>
          <div className="overflow-x-auto my-4">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-mono-1000">
                  <th className="text-left px-4 py-3 font-semibold text-mono-400">Ingrédient</th>
                  <th className="text-left px-4 py-3 font-semibold text-mono-400">Qté brute</th>
                  <th className="text-left px-4 py-3 font-semibold text-mono-400">Perte</th>
                  <th className="text-left px-4 py-3 font-semibold text-mono-400">Qté nette</th>
                  <th className="text-left px-4 py-3 font-semibold text-mono-400">Prix/kg HT</th>
                  <th className="text-right px-4 py-3 font-semibold text-mono-400">Coût</th>
                </tr>
              </thead>
              <tbody>
                {[
                  ['Pavé de saumon', '200 g', '10 %', '180 g', '22,00 EUR', '3,96 EUR'],
                  ['Riz basmati', '120 g', '0 %', '120 g', '2,50 EUR', '0,30 EUR'],
                  ['Haricots verts', '100 g', '20 %', '80 g', '4,50 EUR', '0,36 EUR'],
                  ['Beurre demi-sel', '20 g', '0 %', '20 g', '12,00 EUR', '0,24 EUR'],
                  ['Citron jaune', '30 g', '50 %', '15 g', '3,00 EUR', '0,05 EUR'],
                  ['Huile olive', '10 g', '0 %', '10 g', '8,00 EUR', '0,08 EUR'],
                  ['Épices + sel + herbes', '5 g', '0 %', '5 g', '20,00 EUR', '0,10 EUR'],
                  ['Pain + beurre offerts', '—', '—', '—', '—', '0,30 EUR'],
                ].map((row) => (
                  <tr key={row[0]} className="border-t border-mono-975">
                    {row.map((cell, j) => (
                      <td key={j} className={`px-4 py-2.5 ${j === 0 ? 'font-medium text-mono-100' : j === 5 ? 'text-right font-mono' : ''} text-mono-350`}>{cell}</td>
                    ))}
                  </tr>
                ))}
                <tr className="border-t-2 border-mono-800 bg-teal-50">
                  <td className="px-4 py-2.5 font-bold text-mono-100" colSpan={5}>COÛT MATIÈRE TOTAL</td>
                  <td className="px-4 py-2.5 text-right font-bold text-teal-700 font-mono">5,39 EUR</td>
                </tr>
              </tbody>
            </table>
          </div>

          <h3 className="text-xl font-bold text-mono-100 mt-8 mb-3">Étape 2 : calcul du food cost</h3>
          <div className="bg-gradient-to-br from-teal-600 to-emerald-600 rounded-2xl p-6 my-6 text-white">
            <div className="font-mono text-sm space-y-3">
              <div>Prix de vente TTC : 19,90 EUR</div>
              <div>Prix de vente HT (TVA 10 %) : 19,90 / 1,10 = 18,09 EUR</div>
              <div>Coût matière : 5,39 EUR</div>
              <div className="text-lg font-bold pt-2 border-t border-white/20">
                Food cost = (5,39 / 18,09) x 100 = 29,8 %
              </div>
              <div>Marge brute = 18,09 - 5,39 = 12,70 EUR (70,2 %)</div>
              <div>Coefficient multiplicateur = 18,09 / 5,39 = 3,36</div>
            </div>
          </div>

          <p>
            <strong>Verdict</strong> : food cost à 29,8 %, parfaitement dans la cible 28-32 % d'un restaurant traditionnel. Marge brute de 12,70 EUR par plat. Si le restaurant vend 30 saumons par jour, c'est <strong>381 EUR de marge brute quotidienne</strong> juste sur ce plat.
          </p>

          <h3 className="text-xl font-bold text-mono-100 mt-8 mb-3">Étape 3 : scénarios de variation</h3>
          <p>
            Que se passe-t-il si le prix du saumon augmente de 22 à 27 EUR/kg (scénario typique de variation saisonnière) ?
          </p>
          <div className="overflow-x-auto my-4">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-mono-1000">
                  <th className="text-left px-4 py-3 font-semibold text-mono-400">Scénario</th>
                  <th className="text-left px-4 py-3 font-semibold text-mono-400">Prix saumon</th>
                  <th className="text-left px-4 py-3 font-semibold text-mono-400">Coût matière</th>
                  <th className="text-left px-4 py-3 font-semibold text-mono-400">Food cost</th>
                  <th className="text-left px-4 py-3 font-semibold text-mono-400">Décision</th>
                </tr>
              </thead>
              <tbody>
                {[
                  ['Initial', '22 EUR/kg', '5,39 EUR', '29,8 %', 'OK, on garde le prix'],
                  ['Hausse modérée', '24 EUR/kg', '5,75 EUR', '31,8 %', 'Surveiller, ajuster si dure'],
                  ['Forte hausse', '27 EUR/kg', '6,29 EUR', '34,8 %', 'Augmenter prix vente +1 EUR'],
                  ['Pic saisonnier', '32 EUR/kg', '7,19 EUR', '39,8 %', 'Retirer plat ou +3 EUR'],
                ].map(([s, p, c, f, d], i) => (
                  <tr key={s} className={`border-t border-mono-975 ${i === 3 ? 'bg-rose-50' : i === 2 ? 'bg-amber-50' : ''}`}>
                    <td className="px-4 py-2.5 font-medium text-mono-100">{s}</td>
                    <td className="px-4 py-2.5 text-mono-350">{p}</td>
                    <td className="px-4 py-2.5 text-mono-350">{c}</td>
                    <td className="px-4 py-2.5 font-semibold text-mono-100">{f}</td>
                    <td className="px-4 py-2.5 text-mono-500">{d}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <p>
            Sans mercuriale ni recalcul mensuel, vous ne détectez ces dérives qu'à la fin du mois sur votre P&L, soit 30 jours après le début du problème. Avec un suivi hebdomadaire, vous réagissez en 7 jours maximum.
          </p>
        </section>

        {/* ═════════ SECTION 6 : Benchmarks ═════════ */}
        <section id="benchmarks" className="mb-14">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center">
              <Award className="w-6 h-6 text-amber-700" />
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-mono-100 !mt-0 !mb-0">6. Benchmarks food cost par type de restaurant</h2>
          </div>

          <p>
            Le food cost cible n'est pas universel : il dépend du type d'établissement, du ticket moyen, du modèle économique et de la part des boissons. Voici les fourchettes de référence en France pour 2026, compilées à partir des données <strong>Fiducial</strong>, <strong>INSEE</strong> et <strong>GIRA Conseil</strong>.
          </p>

          <div className="overflow-x-auto my-6">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-mono-1000">
                  <th className="text-left px-4 py-3 font-semibold text-mono-400">Type d'établissement</th>
                  <th className="text-left px-4 py-3 font-semibold text-mono-400">Food cost cible</th>
                  <th className="text-left px-4 py-3 font-semibold text-mono-400">Zone rouge</th>
                  <th className="text-left px-4 py-3 font-semibold text-mono-400">Spécificité</th>
                </tr>
              </thead>
              <tbody>
                {[
                  ['Pizzeria / Crêperie', '22-28 %', '> 32 %', 'Ingrédients de base peu coûteux, gros volumes'],
                  ['Fast-food / Snack', '25-30 %', '> 33 %', 'Produits standardisés, économies d\'échelle'],
                  ['Restaurant asiatique', '25-30 %', '> 34 %', 'Riz, nouilles, légumes à faible coût'],
                  ['Food truck', '25-30 %', '> 33 %', 'Carte courte, peu de pertes, mobilité'],
                  ['Bistrot / Brasserie', '28-32 %', '> 35 %', 'Carte variée, produits de marché'],
                  ['Restaurant traditionnel', '30-35 %', '> 38 %', 'Produits frais, travail de préparation'],
                  ['Gastronomique', '32-38 %', '> 42 %', 'Produits premium (foie gras, truffe, homard)'],
                  ['Dark kitchen / Livraison', '28-35 %', '> 38 %', 'Commissions plateformes 25-35 % en plus'],
                  ['Traiteur / Événementiel', '30-38 %', '> 40 %', 'Économies d\'échelle, logistique lourde'],
                  ['Café / Coffee shop', '20-28 %', '> 32 %', 'Boissons à forte marge, food d\'appoint'],
                  ['Végétarien / Vegan', '25-32 %', '> 36 %', 'Légumes saisonniers, sourcing exigeant'],
                  ['Hôtel restaurant', '30-38 %', '> 42 %', 'Petit-déjeuner buffet, banquets'],
                ].map(([type, fc, zr, spec]) => (
                  <tr key={type} className="border-t border-mono-975">
                    <td className="px-4 py-2.5 font-semibold text-mono-100">{type}</td>
                    <td className="px-4 py-2.5 text-teal-700 font-semibold">{fc}</td>
                    <td className="px-4 py-2.5 text-rose-600 font-semibold">{zr}</td>
                    <td className="px-4 py-2.5 text-mono-500 text-xs">{spec}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <p>
            <strong>Lecture du tableau</strong> : une pizzeria avec un food cost de 31 % est en dérive, alors qu'un gastronomique avec le même ratio est très performant. Le ratio doit toujours être lu en relatif à votre type d'établissement.
          </p>

          <p>
            <strong>Points d'attention sectoriels</strong> :
          </p>
          <ul className="space-y-2 my-4">
            <li className="flex items-start gap-2">
              <Pizza className="w-5 h-5 text-amber-700 flex-shrink-0 mt-0.5" />
              <span><strong>Pizzeria</strong> : la farine et le fromage représentent 60 % du coût matière. Une hausse de 10 % du prix du fromage fait grimper le food cost de 1,5 à 2 points.</span>
            </li>
            <li className="flex items-start gap-2">
              <Beef className="w-5 h-5 text-rose-700 flex-shrink-0 mt-0.5" />
              <span><strong>Brasserie / Bistrot</strong> : 30-40 % du food cost est sur les viandes et poissons. Les variations de cours (boeuf, saumon) impactent immédiatement.</span>
            </li>
            <li className="flex items-start gap-2">
              <ShoppingCart className="w-5 h-5 text-blue-700 flex-shrink-0 mt-0.5" />
              <span><strong>Dark kitchen</strong> : attention aux commissions plateformes (UberEats, Deliveroo) qui prennent 25 à 35 % du prix vente. Votre food cost réel sur la livraison est souvent 8 à 12 points au-dessus du food cost salle.</span>
            </li>
          </ul>
        </section>

        {/* ═════════ SECTION 7 : Derives ═════════ */}
        <section id="derives" className="mb-14">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-12 h-12 bg-rose-100 rounded-xl flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-rose-700" />
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-mono-100 !mt-0 !mb-0">7. Pourquoi mon food cost dérive ?</h2>
          </div>

          <p>
            Vous avez calculé votre food cost théorique à 28 % mais votre comptable vous annonce 33 % à la clôture mensuelle. Cinq points d'écart, c'est <strong>15 000 à 25 000 EUR de marge brute perdus</strong> sur une année. Voici les 7 causes principales et les solutions concrètes.
          </p>

          <div className="space-y-5 my-6">
            {[
              {
                cause: 'Sur-portions des cuisiniers',
                impact: '+1 à +3 points',
                expl: "Un cuisinier sans balance dose 'à l'oeil' et ajoute systématiquement 10 à 15 % en plus pour 'faire généreux'. Sur 80 couverts par service, c'est 8 à 12 portions offertes gratuitement.",
                sol: 'Balances de précision en cuisine, fiches techniques affichées au mur, contrôle hebdomadaire par le chef.',
              },
              {
                cause: 'Gaspillage alimentaire',
                impact: '+2 à +4 points',
                expl: "En moyenne 14 % des achats finissent à la poubelle (surproduction, mauvaise rotation, péremptions). Pour 15 000 EUR/mois d'achats, c'est 2 100 EUR jetés mensuellement.",
                sol: 'Poubelle de tri et pesée des déchets, méthode FIFO (First In First Out), prévision de production basée sur historique.',
              },
              {
                cause: 'Hausses fournisseurs non répercutées',
                impact: '+1 à +3 points',
                expl: "Le beurre passe de 5 à 7 EUR/kg, le saumon de 22 à 27 EUR/kg, mais vous gardez le même prix de vente pendant 6 mois. Mathématiquement, votre food cost monte.",
                sol: 'Mercuriale hebdomadaire des 20 ingrédients les plus chers, révision des prix de vente tous les 6 mois minimum.',
              },
              {
                cause: 'Pertes au parage sous-estimées',
                impact: '+1 à +2 points',
                expl: "Vous calculez vos fiches techniques sur poids brut au lieu de poids net. Un filet de poisson entier perd 60 % à la découpe. Sans correction, votre food cost théorique est faux.",
                sol: 'Coefficient de perte par produit, mesure des rendements 3 fois par an, achat de produits déjà préparés pour les coûts cachés.',
              },
              {
                cause: 'Erreurs d\'inventaire',
                impact: '+0,5 à +2 points',
                expl: "Sans inventaire mensuel rigoureux, vous ne savez pas exactement ce qui a été consommé. Une erreur de 500 EUR sur un stock fausse le food cost de 1 point.",
                sol: 'Inventaire hebdomadaire des produits sensibles (viandes, poissons, alcools), mensuel pour le reste, logiciel de gestion.',
              },
              {
                cause: 'Vols (interne et externe)',
                impact: '+0,5 à +2 points',
                expl: "Les vols internes (cuisiniers, serveurs, plonge) représentent 50 à 70 % du shrinkage en restauration. Bouteilles d'alcool, viandes premium, fromages d\'exception sont les cibles principales.",
                sol: 'Inventaire alcools quotidien, caméras en cuisine et réserve, contrôle des sorties poubelles.',
              },
              {
                cause: 'Offerts non comptabilisés',
                impact: '+0,5 à +1,5 point',
                expl: "Cafés offerts, amuse-bouches, gestes commerciaux, pain et beurre offerts, repas du personnel : tout cela coûte de la matière première mais ne génère pas de CA.",
                sol: 'Comptabilisation des offerts via le POS, repas du personnel valorisé au coût matière, politique offerts écrite et limitée.',
              },
            ].map((d, i) => (
              <div key={i} className="bg-white border border-mono-900 rounded-xl p-5">
                <div className="flex items-start justify-between gap-3 mb-2">
                  <h3 className="text-base font-bold text-mono-100 !mt-0 !mb-0">{i + 1}. {d.cause}</h3>
                  <span className="text-xs font-semibold px-2 py-1 bg-rose-100 text-rose-700 rounded-full flex-shrink-0">{d.impact}</span>
                </div>
                <p className="text-sm text-mono-400 leading-relaxed mb-2"><strong>Explication :</strong> {d.expl}</p>
                <p className="text-sm text-teal-700 leading-relaxed"><strong>Solution :</strong> {d.sol}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ═════════ SECTION 8 : 10 leviers ═════════ */}
        <section id="leviers" className="mb-14">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center">
              <TrendingDown className="w-6 h-6 text-emerald-700" />
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-mono-100 !mt-0 !mb-0">8. 10 leviers concrets pour réduire le food cost</h2>
          </div>

          <p>
            Réduire son food cost de 30 % à 27 % sur un restaurant à 500 000 EUR de CA, c'est <strong>15 000 EUR de marge brute supplémentaire</strong> chaque année. Voici les 10 leviers actionnables classés par impact décroissant.
          </p>

          <div className="space-y-4 my-6">
            {[
              { n: 1, t: 'Fiches techniques systématiques au gramme près', i: '-3 a -5 pts', d: 'Le levier le plus puissant. Pesez tout, documentez tout, formez l\'équipe. Une fiche par plat avec ingrédients, quantités nettes, étapes, photo. Affichage en cuisine.' },
              { n: 2, t: 'Renégociation annuelle des 5 plus gros fournisseurs', i: '-2 a -4 pts', d: 'Devis annuel chez 2 concurrents pour chaque fournisseur principal. Mise en concurrence réelle. Volume garanti contre remise. Paiement anticipé contre escompte.' },
              { n: 3, t: 'Réduction du gaspillage alimentaire', i: '-2 a -3 pts', d: 'Pesée des déchets quotidienne, identification top 5 produits gaspillés, ajustement commandes. Méthode FIFO. Traçabilité des sorties poubelles.' },
              { n: 4, t: 'Menu engineering (matrice popularité / marge)', i: '-2 a -3 pts', d: 'Classez chaque plat en Star, Puzzle, Cheval de labour, Poids mort. Promouvoir les Stars, retirer les Poids morts. Effet de mix gagnant.' },
              { n: 5, t: 'Mercuriale hebdomadaire des ingrédients clés', i: '-1 a -3 pts', d: 'Suivi des prix des 20 ingrédients les plus chers. Achats d\'opportunité quand prix bas. Substitution saisonnière (fraises été vs pommes hiver).' },
              { n: 6, t: 'Inventaire mensuel rigoureux', i: '-1 a -2 pts', d: 'Inventaire physique de tous les stocks le dernier jour du mois. Comparaison avec inventaire théorique. Identification des écarts inexpliqués.' },
              { n: 7, t: 'Optimisation des rendements (parage, découpe)', i: '-1 a -2 pts', d: 'Formation aux techniques de découpe optimale, utilisation des chutes pour fonds et sauces, achat de produits semi-préparés quand pertinent.' },
              { n: 8, t: 'Carte courte et standardisée', i: '-1 a -2 pts', d: 'Réduire de 40 à 25 plats permet une meilleure rotation des stocks, moins de pertes, meilleure maîtrise. Ingrédients croisés entre plats.' },
              { n: 9, t: 'Saisonnalité stricte (produits de saison)', i: '-1 a -2 pts', d: 'Carte qui évolue tous les 3 mois selon la saisonnalité. Tomates en été, courges en automne, racines en hiver. Coût matière divisé par 2 sur certains produits.' },
              { n: 10, t: 'Recettes batch-cooking et mise en place', i: '-0,5 à -1,5 pt', d: 'Préparation en amont (J-1) qui réduit les pertes au coup de feu, améliore la consistance des portions, améliore le rendement équipe.' },
            ].map((l) => (
              <div key={l.n} className="bg-white border border-mono-900 rounded-xl p-5 hover:border-teal-300 hover:shadow-sm transition-all">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-teal-600 text-white rounded-lg flex items-center justify-center flex-shrink-0 font-extrabold">
                    {l.n}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-start justify-between gap-3 mb-2 flex-wrap">
                      <h3 className="text-base font-bold text-mono-100 !mt-0 !mb-0">{l.t}</h3>
                      <span className="text-xs font-semibold px-2 py-1 bg-emerald-100 text-emerald-700 rounded-full flex-shrink-0">{l.i}</span>
                    </div>
                    <p className="text-sm text-mono-400 leading-relaxed !mb-0">{l.d}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="bg-gradient-to-r from-teal-600 to-emerald-600 rounded-2xl p-6 my-8 text-white">
            <h3 className="text-lg font-bold mb-3 flex items-center gap-2">
              <Sparkles className="w-5 h-5" />
              Cumul total potentiel
            </h3>
            <p className="text-teal-50 text-sm leading-relaxed mb-4">
              En appliquant les 5 premiers leviers avec sérieux pendant 6 mois, vous pouvez gagner <strong className="text-white">8 à 12 points de food cost</strong>. Sur un restaurant à 500 000 EUR de CA, c'est 40 000 à 60 000 EUR de marge brute supplémentaire par an.
            </p>
            <Link
              to="/outils/calculateur-food-cost"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-white text-teal-700 font-semibold rounded-lg hover:bg-teal-50 transition-colors text-sm"
            >
              Calculer mon potentiel d'économies
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </section>

        {/* ═════════ SECTION 9 : Comparaison ═════════ */}
        <section id="vs" className="mb-14">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
              <BarChart3 className="w-6 h-6 text-blue-700" />
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-mono-100 !mt-0 !mb-0">9. Food cost vs prime cost vs marge brute</h2>
          </div>

          <p>
            Trois indicateurs souvent confondus mais radicalement différents. Maîtriser cette distinction est indispensable pour piloter un restaurant en 2026.
          </p>

          <div className="overflow-x-auto my-6">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-mono-1000">
                  <th className="text-left px-4 py-3 font-semibold text-mono-400">Indicateur</th>
                  <th className="text-left px-4 py-3 font-semibold text-mono-400">Définition</th>
                  <th className="text-left px-4 py-3 font-semibold text-mono-400">Formule</th>
                  <th className="text-left px-4 py-3 font-semibold text-mono-400">Cible</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-t border-mono-975">
                  <td className="px-4 py-3 font-semibold text-teal-700">Food cost</td>
                  <td className="px-4 py-3 text-mono-500 text-xs">Coût matières / CA</td>
                  <td className="px-4 py-3 font-mono text-xs text-mono-350">(Matières / CA HT) x 100</td>
                  <td className="px-4 py-3 font-semibold text-mono-100">25-35 %</td>
                </tr>
                <tr className="border-t border-mono-975">
                  <td className="px-4 py-3 font-semibold text-emerald-700">Marge brute</td>
                  <td className="px-4 py-3 text-mono-500 text-xs">CA - matières</td>
                  <td className="px-4 py-3 font-mono text-xs text-mono-350">100 - Food cost</td>
                  <td className="px-4 py-3 font-semibold text-mono-100">65-75 %</td>
                </tr>
                <tr className="border-t border-mono-975">
                  <td className="px-4 py-3 font-semibold text-purple-700">Prime cost</td>
                  <td className="px-4 py-3 text-mono-500 text-xs">Matières + masse salariale</td>
                  <td className="px-4 py-3 font-mono text-xs text-mono-350">(FC + Labour) / CA HT x 100</td>
                  <td className="px-4 py-3 font-semibold text-mono-100">&lt; 65 %</td>
                </tr>
                <tr className="border-t border-mono-975">
                  <td className="px-4 py-3 font-semibold text-blue-700">Marge nette</td>
                  <td className="px-4 py-3 text-mono-500 text-xs">Résultat net / CA</td>
                  <td className="px-4 py-3 font-mono text-xs text-mono-350">(Résultat / CA HT) x 100</td>
                  <td className="px-4 py-3 font-semibold text-mono-100">5-15 %</td>
                </tr>
              </tbody>
            </table>
          </div>

          <p>
            <strong>Exemple illustratif</strong> : un bistrot a un food cost de 30 %, donc une marge brute de 70 %. Si sa masse salariale représente 35 % du CA, son prime cost est de 65 % (30 % + 35 %). Après loyer (8 %), énergie (4 %), assurances et autres (6 %), il reste 17 % avant impôts. Après impôts et amortissements, sa marge nette est probablement autour de 8 à 10 %. <Link to="/blog/prime-cost-restaurant" className="text-teal-700 font-semibold hover:underline">Voir notre guide complet sur le prime cost</Link>.
          </p>

          <div className="bg-blue-50 border-l-4 border-blue-400 rounded-r-xl p-5 my-6">
            <p className="text-sm text-blue-900 leading-relaxed">
              <strong>Règle d'or 2026</strong> : pilotez le food cost <strong>au quotidien</strong> (fiches techniques, mercuriale), le prime cost <strong>chaque semaine</strong> (food + masse salariale), la marge nette <strong>chaque mois</strong> (P&L complet). Un suivi seulement annuel est équivalent à conduire les yeux bandés.
            </p>
          </div>
        </section>

        {/* ═════════ SECTION 10 : Erreurs ═════════ */}
        <section id="erreurs" className="mb-14">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-12 h-12 bg-rose-100 rounded-xl flex items-center justify-center">
              <AlertTriangle className="w-6 h-6 text-rose-700" />
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-mono-100 !mt-0 !mb-0">10. Les 7 erreurs courantes à éviter</h2>
          </div>

          <ol className="space-y-4 my-6 list-none pl-0">
            {[
              {
                t: 'Calculer en TTC au lieu de HT',
                d: 'C\'est l\'erreur la plus répandue chez les débutants. Si vous calculez votre food cost sur un prix TTC, vous obtenez un ratio artificiellement bas (de 1,5 à 2 points). Toujours diviser par le prix HT.',
              },
              {
                t: 'Oublier les pertes au parage',
                d: 'Un kilo de carottes brutes donne 800 g épluchés. Un filet de bar entier donne 35 % de filets utilisables. Si vous calculez sur le poids brut, votre food cost théorique est faux de 5 à 15 %.',
              },
              {
                t: 'Ne pas intégrer les à-côtés',
                d: 'Pain offert, beurre, sauce, fond, décor représentent 0,40 à 0,80 EUR par couvert. Sur 80 couverts par service, c\'est 32 à 64 EUR de matière oubliée par jour.',
              },
              {
                t: 'Calculer une seule fois par an',
                d: 'Le food cost varie en permanence (prix fournisseurs, saisonnalité, mix produits). Un calcul annuel révèle les problèmes trop tard. Le minimum, c\'est mensuel. L\'idéal, c\'est hebdomadaire.',
              },
              {
                t: 'Confondre food cost et marge brute',
                d: 'Food cost et marge brute sont complémentaires (food cost + marge brute = 100 %), pas équivalents. Un food cost à 30 % donne une marge brute de 70 %, jamais 30 %.',
              },
              {
                t: 'Ne pas distinguer salle et livraison',
                d: 'Les commissions plateformes (25-35 %) et le packaging (0,30-0,80 EUR par commande) augmentent le food cost livraison de 8 à 12 points par rapport au food cost salle. Calculez séparément.',
              },
              {
                t: 'Ignorer l\'écart théorique vs réel',
                d: 'Si votre food cost théorique est à 28 % mais que le réel est à 33 %, ne vous contentez pas du chiffre théorique. L\'écart de 5 points représente votre dérive de gestion. Investiguez et corrigez.',
              },
            ].map((e, i) => (
              <li key={i} className="bg-white border border-rose-100 rounded-xl p-5">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-rose-100 text-rose-700 rounded-lg flex items-center justify-center flex-shrink-0 font-bold text-sm">
                    {i + 1}
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-mono-100 !mt-0 !mb-1">{e.t}</h3>
                    <p className="text-sm text-mono-400 leading-relaxed !mb-0">{e.d}</p>
                  </div>
                </div>
              </li>
            ))}
          </ol>
        </section>

        {/* ═════════ SECTION 11 : Outils ═════════ */}
        <section id="outils" className="mb-14">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
              <Sparkles className="w-6 h-6 text-purple-700" />
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-mono-100 !mt-0 !mb-0">11. Outils pour automatiser le calcul du food cost</h2>
          </div>

          <p>
            Calculer son food cost à la main est faisable mais chronophage : il faut compter <strong>5 à 10 heures par semaine</strong> pour maintenir des fiches techniques à jour sur une carte de 30 plats. Trois catégories d'outils existent.
          </p>

          <div className="grid sm:grid-cols-3 gap-4 my-6">
            <div className="bg-white border border-mono-900 rounded-xl p-5">
              <div className="w-10 h-10 bg-mono-900 rounded-lg flex items-center justify-center mb-3">
                <LineChart className="w-5 h-5 text-mono-400" />
              </div>
              <h3 className="text-base font-bold text-mono-100 mb-2">Tableur Excel / Google Sheets</h3>
              <p className="text-sm text-mono-400 leading-relaxed mb-3">
                Gratuit, flexible, mais chronophage et source d'erreurs. Bon pour débuter ou pour 5-10 plats maximum.
              </p>
              <p className="text-xs text-mono-500">Temps : 8-12h / semaine</p>
              <p className="text-xs text-teal-700 font-semibold mt-1">Coût : 0 EUR</p>
            </div>
            <div className="bg-white border border-teal-300 rounded-xl p-5 ring-2 ring-teal-100">
              <div className="w-10 h-10 bg-teal-100 rounded-lg flex items-center justify-center mb-3">
                <Calculator className="w-5 h-5 text-teal-700" />
              </div>
              <h3 className="text-base font-bold text-mono-100 mb-2">Calculateur en ligne gratuit</h3>
              <p className="text-sm text-mono-400 leading-relaxed mb-3">
                Rapide pour des plats isolés. Pas de sauvegarde dans le temps. Idéal pour tester une recette ou un prix.
              </p>
              <p className="text-xs text-mono-500">Temps : 2 min par plat</p>
              <p className="text-xs text-teal-700 font-semibold mt-1">Coût : 0 EUR</p>
            </div>
            <div className="bg-white border border-mono-900 rounded-xl p-5">
              <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center mb-3">
                <Sparkles className="w-5 h-5 text-emerald-700" />
              </div>
              <h3 className="text-base font-bold text-mono-100 mb-2">Logiciel complet (RestauMargin)</h3>
              <p className="text-sm text-mono-400 leading-relaxed mb-3">
                Scan OCR des factures, mise à jour automatique des prix, alertes dérives, menu engineering intégré.
              </p>
              <p className="text-xs text-mono-500">Temps : 1-2h / semaine</p>
              <p className="text-xs text-teal-700 font-semibold mt-1">Coût : à partir de 39 EUR/mois</p>
            </div>
          </div>

          <p>
            <strong>Recommandation</strong> : commencez avec le calculateur gratuit pour tester la méthode, puis basculez vers un logiciel dès que vous dépassez 15 plats à la carte ou 300 000 EUR de CA annuel. L'investissement (39-89 EUR/mois) est rentabilisé en 2 à 4 semaines via les économies générées.
          </p>
        </section>

        {/* ═════════ CTA milieu ═════════ */}
        <div className="my-12 bg-gradient-to-br from-mono-100 to-mono-200 rounded-2xl p-6 sm:p-8 text-white text-center">
          <Sparkles className="w-10 h-10 text-teal-400 mx-auto mb-3" />
          <h3 className="text-xl sm:text-2xl font-extrabold mb-3">Calcule ton food cost en 5 min</h3>
          <p className="text-mono-400 text-sm sm:text-base mb-5 max-w-lg mx-auto">
            Saisis tes ingrédients, grammages et prix d'achat. Le calculateur gratuit RestauMargin t'affiche food cost, marge brute, coefficient multiplicateur et verdict sectoriel instantanément.
          </p>
          <Link
            to="/outils/calculateur-food-cost"
            className="inline-flex items-center gap-2 px-6 py-3 bg-teal-600 hover:bg-teal-500 text-white font-semibold rounded-xl transition-colors"
          >
            Accéder au calculateur gratuit
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* ═════════ FAQ ═════════ */}
        <section id="faq" className="mb-14">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center">
              <BookOpen className="w-6 h-6 text-amber-700" />
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-mono-100 !mt-0 !mb-0">12. FAQ : 14 questions fréquentes sur le food cost</h2>
          </div>

          <div className="space-y-3 my-6">
            {faqItems.map((item, i) => (
              <details key={i} className="bg-mono-1000 border border-mono-900 rounded-xl group">
                <summary className="px-5 py-4 font-semibold text-mono-100 cursor-pointer select-none flex items-center justify-between hover:text-teal-700 transition-colors text-sm">
                  {item.question}
                  <ArrowRight className="w-4 h-4 text-mono-700 group-open:rotate-90 transition-transform flex-shrink-0 ml-2" />
                </summary>
                <p className="px-5 pb-4 text-sm text-mono-400 leading-relaxed">{item.answer}</p>
              </details>
            ))}
          </div>
        </section>

        {/* ═════════ Articles complementaires ═════════ */}
        <section className="mb-14">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-mono-100 mb-6">Articles complémentaires sur les marges restaurant</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            {[
              { to: '/blog/calcul-marge-restaurant', t: 'Calcul de marge restaurant : guide complet 2026', d: 'Formules, benchmarks et erreurs courantes pour piloter vos marges.' },
              { to: '/blog/prime-cost-restaurant', t: 'Prime cost en restauration : l\'indicateur n 1', d: 'Food cost + masse salariale : l\'indicateur le plus prédictif de la rentabilité.' },
              { to: '/blog/coefficient-multiplicateur', t: 'Coefficient multiplicateur en restauration', d: 'Tableaux complets par catégorie de plat pour fixer vos prix.' },
              { to: '/blog/prix-de-vente-restaurant', t: 'Fixer le prix de vente d\'un plat', d: 'Méthode complète avec psychologie du prix et benchmarks 2026.' },
              { to: '/blog/cout-revient-plat-restaurant', t: 'Calculer le coût de revient d\'un plat', d: 'Méthode pas à pas, ratios de perte et fiches techniques.' },
              { to: '/blog/seuil-rentabilite-restaurant', t: 'Seuil de rentabilité d\'un restaurant', d: 'À partir de combien de couverts votre établissement est-il rentable ?' },
            ].map((a) => (
              <Link
                key={a.to}
                to={a.to}
                className="bg-white border border-mono-900 rounded-xl p-5 hover:border-teal-300 hover:shadow-sm transition-all group"
              >
                <h3 className="text-sm font-bold text-mono-100 mb-1 group-hover:text-teal-700 transition-colors !mt-0 !mb-1">{a.t}</h3>
                <p className="text-xs text-mono-500 !mb-0">{a.d}</p>
              </Link>
            ))}
          </div>
        </section>

        {/* ═════════ Sources EEAT ═════════ */}
        <section className="mb-14 bg-mono-1000 border border-mono-900 rounded-2xl p-6 sm:p-8">
          <h2 className="text-lg font-bold text-mono-100 mb-4">Sources et références</h2>
          <ul className="space-y-2 text-sm text-mono-400">
            <li>- <strong>Fiducial</strong> : Observatoire de la restauration commerciale 2025</li>
            <li>- <strong>INSEE</strong> : Comptes nationaux trimestriels - secteur 56 (hébergement-restauration)</li>
            <li>- <strong>GIRA Conseil</strong> : Tendances et chiffres-clés de la restauration France 2026</li>
            <li>- <strong>KPMG</strong> : Étude annuelle hôtellerie-restauration France 2025</li>
            <li>- <strong>UMIH</strong> : Union des Métiers et des Industries de l'Hôtellerie - référentiel des ratios</li>
            <li>- <strong>National Restaurant Association</strong> : Benchmark international du food cost (US data)</li>
          </ul>
          <p className="text-xs text-mono-500 mt-4 italic">
            Article rédigé par la rédaction RestauMargin. Mis à jour le 26 mai 2026. Notre méthodologie : croisement des données publiques INSEE et Fiducial.
          </p>
        </section>

        <BlogAuthor publishedDate="2026-04-14" updatedDate="2026-06-03" readTime="18 min" variant="footer" />

        </article>
      </main>

      {/* ── CTA final ── */}
      <section className="bg-gradient-to-br from-teal-50 to-emerald-50 py-14 px-4">
        <div className="max-w-xl mx-auto text-center">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-mono-100 mb-3 font-satoshi">
            Pilote ton food cost en temps réel avec RestauMargin
          </h2>
          <p className="text-mono-500 mb-6">
            Scan OCR des factures fournisseurs, fiches techniques automatiques, mercuriale en continu, alertes en cas de dérive, menu engineering intégré. Tout pour passer ton food cost de 33 % à 28 % en 3 mois.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              to="/outils/calculateur-food-cost"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-white border border-teal-300 text-teal-700 font-semibold rounded-xl hover:bg-teal-50 transition-colors"
            >
              <Calculator className="w-5 h-5" />
              Calculateur gratuit
            </Link>
            <Link
              to="/login"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-teal-600 hover:bg-teal-700 text-white font-semibold rounded-xl transition-colors"
            >
              Essayer RestauMargin
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <PublicFooter />

      <style>{`
        .prose-article p {
          color: #475569;
          line-height: 1.75;
          margin-bottom: 1rem;
          font-size: 1rem;
        }
        .prose-article ul, .prose-article ol {
          color: #475569;
          line-height: 1.75;
        }
        .prose-article strong {
          color: #0f172a;
          font-weight: 600;
        }
        .prose-article a {
          color: #0d9488;
          text-decoration: underline;
          text-underline-offset: 2px;
        }
        .prose-article a:hover {
          color: #0f766e;
        }
        .prose-article table {
          border: 1px solid #e2e8f0;
          border-radius: 0.75rem;
          overflow: hidden;
          width: 100%;
        }
        .prose-article th, .prose-article td {
          border-bottom: 1px solid #f1f5f9;
        }
      `}</style>
    </div>
  );
}
