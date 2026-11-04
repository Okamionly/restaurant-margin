import { Link } from 'react-router-dom';
import {
  ChefHat,
  BookOpen,
  RefreshCw,
  Calculator,
  BarChart3,
  TrendingUp,
  Settings,
  AlertTriangle,
  ArrowRight,
  Snowflake,
  Package,
  Lightbulb,
  CheckCircle,
  ListChecks,
  Sparkles,
  Target,
  ClipboardList,
  DollarSign,
  Warehouse,
  Layers,
  Zap,
  ShieldAlert,
} from 'lucide-react';
import SEOHead, { buildFAQSchema, buildBreadcrumbSchema } from '../components/SEOHead';
import BlogAuthor from '../components/BlogAuthor';
import BlogArticleHero from '../components/blog/BlogArticleHero';

/* ════════════════════════════════════════════════════════════════════════════
   Blog SEO — "Rotation des stocks en restaurant : guide complet 2026"
   Mot-cles principaux : rotation stocks restaurant, coefficient rotation
                         stocks, stock dormant restaurant, reduire stock cuisine
   ~3 200 mots — mode clair, fond blanc, typo lisible
   ════════════════════════════════════════════════════════════════════════════ */

const faqItems = [
  {
    question: "Quelle est la formule du coefficient de rotation des stocks en restaurant ?",
    answer:
      "Le coefficient de rotation des stocks se calcule en divisant le coût des matières consommées (CMV) sur la période par la valeur moyenne du stock sur cette même période. Formule : Rotation = CMV / Stock moyen. Pour un restaurant, on calcule habituellement sur le mois. Exemple : 50 000 EUR de CMV mensuel et 12 500 EUR de stock moyen = rotation de 4x/mois, soit environ 7-8 jours de stock.",
  },
  {
    question: "Comment calculer les jours de stock d'un restaurant ?",
    answer:
      "Formule : Jours de stock = (Stock moyen / CMV) x 365 sur l'année, ou (Stock moyen / Achats) x 30 sur le mois. Un restaurant performant tourne en moyenne autour de 8-12 jours de stock toutes catégories confondues. Un nombre supérieur à 20 jours signale généralement du stock dormant ou des achats sur-dimensionnés.",
  },
  {
    question: "Quelle est la rotation cible par catégorie de produit ?",
    answer:
      "Frais (viandes, poissons, fruits, légumes) : 2-3 jours de stock, soit une rotation de 10-15x/mois. Produits secs (riz, pâtes, farine, conserves) : 15-30 jours de stock, rotation 1-2x/mois. Surgelés : 30-60 jours, rotation 0,5-1x/mois. Vins courants : 15-30 jours, vins de garde : 60-90 jours. Ces ratios proviennent des benchmarks GIRA Conseil.",
  },
  {
    question: "FIFO, LIFO, PEPS : quelle méthode utiliser en restauration ?",
    answer:
      "En restauration on utilise toujours le FIFO (First In, First Out), aussi appelé PEPS (Premier Entre, Premier Sorti). Le LIFO (Last In, First Out) est interdit pour les produits alimentaires périssables et il n'est plus autorisé pour le calcul fiscal en France (PCG 2014). Le FIFO assure que les produits les plus anciens sont consommés en premier, évitant les pertes liées aux DLC.",
  },
  {
    question: "Inventaire physique vs inventaire permanent : lequel choisir ?",
    answer:
      "Les deux sont complémentaires. L'inventaire permanent (informatique, en continu via OCR factures + ventes) vous donne une vision en temps réel. L'inventaire physique (à la main, sur étagère) est obligatoire au moins 1 fois par an (clôture comptable) et recommandé tous les 15 jours pour ajuster les écarts. Un écart > 3 % entre permanent et physique signale soit de la casse soit du vol soit des erreurs de saisie.",
  },
  {
    question: "Combien coûte réellement le stockage en restaurant ?",
    answer:
      "Le coût réel de stockage représente 20-30 % de la valeur du stock par an : 5-8 % de capital immobilisé (coût d'opportunité), 3-7 % de pertes (DLC, casse, vol), 5-8 % d'énergie (chambre froide, congélateurs), 2-4 % de manutention/inventaire, 1-3 % d'assurance. Un stock de 15 000 EUR vous coûte donc 3 000 à 4 500 EUR par an juste pour exister.",
  },
  {
    question: "Comment calculer le stock de sécurité d'un restaurant ?",
    answer:
      "Stock de sécurité = (Consommation moyenne quotidienne x Délai de réapprovisionnement) x Coefficient de sécurité (1,2 à 1,5). Exemple : steak haché, consommation 2 kg/jour, délai 3 jours, coeff 1,3 = 2 x 3 x 1,3 = 7,8 kg de stock de sécurité. Le stock d'alerte (point de commande) = Stock de sécurité + (Consommation x Délai livraison).",
  },
  {
    question: "Que faire des produits qui approchent de la DLC ?",
    answer:
      "Trois options dans l'ordre : (1) suggestion du jour pour écouler immédiatement, (2) prix plat du jour réduit de 15-25 %, (3) dons à des associations (Restos du Coeur, ANDES, Banque Alimentaire) déductibles fiscalement à 60 %. Jamais de jet pur sans traçabilité : c'est un échec de planification + perte fiscale potentielle. La loi Garot (2016) impose le don pour les surfaces > 400 m2 mais c'est une bonne pratique pour tous.",
  },
  {
    question: "Faut-il faire un inventaire chaque semaine ?",
    answer:
      "Inventaire complet : tous les 15 jours suffit pour la plupart des restaurants (2 inventaires/mois pour le calcul officiel de rotation). Inventaire cible sur les produits chers (viandes nobles, poissons frais, vins, alcools) chaque lundi matin pour ajuster les commandes hebdomadaires. Au mensuel minimum pour calculer la rotation officielle et la marge brute réelle.",
  },
  {
    question: "Comment un logiciel comme RestauMargin réduit le stock dormant ?",
    answer:
      "RestauMargin scanne automatiquement vos factures fournisseurs (OCR), suit les ventes en temps réel et calcule en continu la rotation par référence. Un produit identifié comme dormant (rotation < 1x/mois sur 60 jours) déclenche une alerte avec 4 suggestions : recette anti-gaspi, promotion plat du jour, retour fournisseur si possible, ou don associatif. Résultat moyen constaté : -30 % de stock dormant en 90 jours.",
  },
];

const howToSteps = [
  {
    name: "Mesurer le stock de début et de fin de période",
    text: "Réalisez un inventaire physique le 1er et le 30 du mois. Valorisez chaque produit au prix d'achat HT (méthode PEPS/FIFO). Stock moyen = (Stock début + Stock fin) / 2. Pour plus de précision, ajoutez un inventaire au 15 et faites la moyenne sur 3 points.",
  },
  {
    name: "Calculer le coût des matières consommées (CMV)",
    text: "CMV = Stock initial + Achats de la période - Stock final. Exemple : 4 200 EUR + 13 000 EUR - 4 800 EUR = 12 400 EUR de matières consommées sur le mois. C'est cette valeur que vous divisez par le stock moyen pour obtenir la rotation réelle.",
  },
  {
    name: "Calculer le coefficient de rotation",
    text: "Coefficient de rotation = CMV / Stock moyen. Avec les chiffres précédents : 12 400 / 4 500 = 2,76x/mois. Plus le coefficient est élevé, plus votre stock tourne vite et moins votre trésorerie est immobilisée. La cible standard restauration est 3-4x/mois en global.",
  },
  {
    name: "Convertir en jours de stock",
    text: "Jours de stock = (Stock moyen / CMV) x Nombre de jours de la période. Avec 4 500 / 12 400 x 30 = 10,9 jours. Un restaurant performant sur tous les rayons combinés tourne entre 8 et 12 jours. Au-delà de 15 jours, vous avez un problème de sur-stockage.",
  },
  {
    name: "Décliner par catégorie de produit",
    text: "Refaites le calcul séparément pour chaque famille (viandes, poissons, légumes, secs, vins, alcools). C'est la seule façon de détecter où se cache le stock dormant. La moyenne globale masque toujours les anomalies locales. Une catégorie hors-norme (jours > 2x le benchmark) signale une action immédiate à mener.",
  },
];

export default function BlogRotationStocks() {
  return (
    <div className="min-h-screen" style={{ fontFamily: "'Inter', system-ui, sans-serif" }}>
      <SEOHead
        title="Rotation des stocks restaurant : formule, benchmarks et optimisation 2026"
        description="Calcul du coefficient de rotation des stocks restaurant : formule, ratios cibles par produit, FIFO/PEPS, inventaire, stock de sécurité, méthodes pour réduire le stock dormant et optimiser la trésorerie."
        path="/blog/rotation-stocks-restaurant"
        type="article"
        schema={[
          buildFAQSchema(faqItems),
          buildBreadcrumbSchema([
            { name: 'Accueil', url: 'https://www.restaumargin.fr/' },
            { name: 'Blog', url: 'https://www.restaumargin.fr/blog' },
            { name: 'Rotation des stocks restaurant', url: 'https://www.restaumargin.fr/blog/rotation-stocks-restaurant' },
          ]),
          {
            '@context': 'https://schema.org',
            '@type': 'HowTo',
            name: 'Comment calculer le coefficient de rotation des stocks en restauration',
            description: "Méthode pas-à-pas pour mesurer la rotation des stocks et détecter le stock dormant dans un restaurant.",
            totalTime: 'PT20M',
            tool: ['Balance de cuisine', 'Logiciel de gestion (RestauMargin)', 'Inventaire papier ou tablette'],
            step: howToSteps.map((s) => ({ '@type': 'HowToStep', name: s.name, text: s.text })),
          },
          {
            '@context': 'https://schema.org',
            '@type': 'Article',
            headline: "Rotation des stocks restaurant : formule, benchmarks et optimisation 2026",
            description:
              "Guide complet sur la rotation des stocks en restauration : coefficient, jours de stock, FIFO/PEPS, inventaire physique vs permanent, stock dormant, coût caché du stockage.",
            image: 'https://www.restaumargin.fr/og-image.png',
            author: { '@type': 'Organization', name: 'RestauMargin', url: 'https://www.restaumargin.fr' },
            publisher: {
              '@type': 'Organization',
              name: 'RestauMargin',
              logo: { '@type': 'ImageObject', url: 'https://www.restaumargin.fr/icon-512.png' },
            },
            datePublished: '2026-04-27',
            dateModified: '2026-05-26',
            wordCount: 3200,
            inLanguage: 'fr-FR',
            mainEntityOfPage: { '@type': 'WebPage', '@id': 'https://www.restaumargin.fr/blog/rotation-stocks-restaurant' },
          },
        ]}
      />

      {/* Navbar */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-mono-900">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 text-mono-100 font-bold text-lg">
            <ChefHat className="w-7 h-7 text-teal-600" />
            <span>RestauMargin</span>
          </Link>
          <div className="flex items-center gap-3">
            <Link
              to="/outils/calculateur-food-cost"
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

      {/* Breadcrumbs visibles */}
      <div className="bg-mono-1000 border-b border-mono-900 py-3 px-4">
        <div className="max-w-4xl mx-auto text-xs text-mono-500 flex items-center gap-2 flex-wrap">
          <Link to="/" className="hover:text-teal-600">Accueil</Link>
          <span>/</span>
          <Link to="/blog" className="hover:text-teal-600">Blog</Link>
          <span>/</span>
          <span className="text-mono-100 font-medium">Rotation des stocks restaurant</span>
        </div>
      </div>

      {/* Hero */}
      <BlogArticleHero
        category="Stocks"
        readTime="16 min"
        date="Mai 2026"
        title="Rotation des stocks restaurant : formule, benchmarks et optimisation 2026"
        accentWord="rotation"
        subtitle="15 000 EUR de stock immobilisé = 9 000 EUR coincés en cuisine au lieu d'être en banque. Coefficient, jours de stock, FIFO/PEPS, stock dormant, coût caché : tout pour reprendre le contrôle de vos stocks restaurant."
      />

      {/* Body */}
      <main className="max-w-4xl mx-auto px-6 sm:px-10 lg:px-12 pb-24 pt-8 bg-white relative z-10 rounded-t-3xl shadow-xl">

        <BlogAuthor publishedDate="2026-04-27" readTime="16 min" variant="header" />

        {/* Featured snippet : formule rapide */}
        <div className="mt-10 bg-gradient-to-br from-teal-600 to-teal-700 rounded-2xl p-6 sm:p-8 text-white shadow-xl">
          <div className="flex items-center gap-2 mb-3">
            <Zap className="w-5 h-5" />
            <span className="text-xs font-bold uppercase tracking-wider text-teal-100">
              Formule rotation stocks restaurant
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold mb-4">
            Les 3 formules essentielles
          </h2>
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-5 space-y-3 font-mono text-sm sm:text-base">
            <div className="flex items-start gap-2">
              <span className="text-teal-200 font-bold">1.</span>
              <span><strong className="text-white">Rotation</strong> = CMV / Stock moyen</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-teal-200 font-bold">2.</span>
              <span><strong className="text-white">Jours de stock</strong> = (Stock moyen / CMV) x 365</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-teal-200 font-bold">3.</span>
              <span><strong className="text-white">Stock moyen</strong> = (Stock début + Stock fin) / 2</span>
            </div>
          </div>
          <p className="mt-4 text-teal-100 text-sm">
            Cible standard restauration : <strong>3-4x/mois</strong> en global, soit <strong>8-12 jours de stock</strong> toutes catégories confondues. Frais : 2-3 jours, secs : 15-30 jours, surgelés : 30-60 jours.
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
              { href: '#definition', label: "Définition et formule du coefficient de rotation" },
              { href: '#enjeux', label: "Pourquoi la rotation est l'indicateur clé de votre trésorerie" },
              { href: '#howto', label: 'Calculer la rotation en 5 étapes (méthode pas-à-pas)' },
              { href: '#ratios', label: 'Ratios cibles par catégorie de produit' },
              { href: '#fifo', label: 'Méthode FIFO / LIFO / PEPS : laquelle choisir ?' },
              { href: '#inventaire', label: 'Inventaire physique vs inventaire permanent' },
              { href: '#cout-cache', label: 'Le coût caché du stockage (20-30 % par an)' },
              { href: '#securite', label: 'Stock de sécurité, stock d alerte et réapprovisionnement' },
              { href: '#dormant', label: "Comment détecter et réduire le stock dormant" },
              { href: '#outils', label: 'Outils digitaux pour automatiser la rotation' },
              { href: '#faq', label: 'Questions fréquentes' },
              { href: '#cta', label: 'Essayer RestauMargin gratuitement' },
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

        {/* SECTION 1 — Definition */}
        <section id="definition" className="mb-16">
          <SectionHeading icon={<Calculator className="w-6 h-6" />} number="1">
            Définition et formule du coefficient de rotation
          </SectionHeading>

          <div className="prose-content">
            <p>
              La <strong>rotation des stocks restaurant</strong> mesure le nombre de fois où votre stock
              est entièrement renouvelé sur une période donnée (généralement le mois ou l'année).
              C'est l'indicateur le plus puissant pour évaluer la santé financière d'un établissement
              de restauration : il combine en un seul chiffre la qualité des achats, la maîtrise des
              recettes, la cohérence de la carte et la rigueur du FIFO.
            </p>
            <p>
              Le calcul standard se base sur le <strong>coût des matières consommées (CMV)</strong>
              divisé par la valeur moyenne du stock sur la période. Le CMV se reconstitue avec une
              équation simple : Stock initial + Achats de la période - Stock final. Tous les chiffres
              doivent être valorisés en euros HT au prix d'achat.
            </p>

            <Callout type="info">
              <strong>Pourquoi CMV et pas Achats ?</strong> Beaucoup de restaurateurs divisent les achats du mois par le stock moyen. C'est une approximation acceptable si le stock varie peu, mais cela fausse le ratio quand vous avez sur-commandé ou liquidé du stock. Le CMV neutralise ces effets en mesurant uniquement ce qui a réellement été consommé.
            </Callout>

            <p>
              Une fois la rotation calculée, on la convertit souvent en <strong>jours de stock</strong>,
              qui parle plus à l'esprit qu'un coefficient abstrait. Formule : Jours de stock = (Stock
              moyen / CMV) x Nombre de jours de la période. Un restaurant qui tourne en 7 jours est
              extrêmement performant ; un restaurant qui tourne en 25 jours a un problème structurel.
            </p>
          </div>

          <div className="bg-mono-1000 border border-mono-900 rounded-2xl p-6 mt-8">
            <h3 className="font-bold text-mono-100 mb-3 text-lg">Bonne pratique mesure</h3>
            <ul className="space-y-2 text-sm text-mono-350">
              <li className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-teal-600 mt-0.5 shrink-0" />
                <span>Inventaire <strong>bi-mensuel</strong> (1er + 15) pour 4 points par mois</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-teal-600 mt-0.5 shrink-0" />
                <span>Toujours en <strong>HT au prix d'achat</strong> (jamais prix de vente)</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-teal-600 mt-0.5 shrink-0" />
                <span>Décliner par <strong>famille</strong> (viande, poisson, légume, sec, vin, alcool)</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-teal-600 mt-0.5 shrink-0" />
                <span>Comparer au benchmark de votre type d'établissement</span>
              </li>
            </ul>
          </div>
        </section>

        {/* SECTION 2 — Pourquoi cle */}
        <section id="enjeux" className="mb-16">
          <SectionHeading icon={<AlertTriangle className="w-6 h-6" />} number="2">
            Pourquoi la rotation est l'indicateur clé de votre trésorerie
          </SectionHeading>

          <div className="prose-content">
            <p>
              Imaginez deux restaurants identiques en chiffre d'affaires (600 000 EUR HT) et food cost (30 %).
              Le premier tourne à 4x/mois avec 3 750 EUR de stock moyen. Le second tourne à 2x/mois avec
              7 500 EUR de stock moyen. Sur le papier, les deux ont la même marge brute. En réalité, l'écart
              entre les deux atteint <strong>10 000 EUR de bénéfice annuel</strong>, voici pourquoi.
            </p>
          </div>

          <div className="grid sm:grid-cols-3 gap-5 mt-8">
            <ImpactCard
              icon={<DollarSign className="w-5 h-5" />}
              color="red"
              title="Trésorerie immobilisée"
              desc="Chaque euro stocké est un euro indisponible pour salaires, loyer, fournisseurs. Un stock 2x trop gros = 1 à 3 mois de trésorerie figée."
            />
            <ImpactCard
              icon={<ShieldAlert className="w-5 h-5" />}
              color="amber"
              title="Pertes et casse"
              desc="Mauvaise rotation = DLC dépassées, qualité dégradée, vol, casse. Les pertes invisibles peuvent atteindre 5-7 % du stock annuellement."
            />
            <ImpactCard
              icon={<TrendingUp className="w-5 h-5" />}
              color="teal"
              title="Santé globale"
              desc="La rotation reflète achats bien dimensionnés, recettes standardisées, carte cohérente, FIFO respecté, et anticipation précise."
            />
          </div>

          <div className="prose-content mt-8">
            <p>
              Selon les données agrégées de la GIRA Conseil (des restaurants
              connectés), les établissements dans le top 25 % de leur catégorie ont une rotation moyenne
              <strong> 2,4x supérieure</strong> à la moyenne du marché. Ce n'est pas un hasard : ils ont
              compris que <strong>la rotation est un effet, pas une cause</strong>. C'est le reflet d'une
              chaîne de bonnes pratiques en amont.
            </p>
            <p>
              Une rotation faible signale presque toujours l'un des trois problèmes suivants : (1)
              une carte trop large qui nécessite trop de références, (2) des commandes mal calibrées
              avec sur-stockage chronique, ou (3) une mauvaise anticipation de la saisonnalité. Résoudre
              ces trois causes ramène mécaniquement la rotation à son niveau optimal.
            </p>
          </div>

          <Callout type="warning">
            <strong>Signal d'alarme :</strong> si vos jours de stock dépassent <strong>2x le benchmark</strong> de
            votre catégorie (par exemple 30 jours sur la viande au lieu de 3-4), c'est un problème
            structurel à corriger immédiatement. Vous immobilisez du capital pour rien et vous risquez
            des pertes massives à la prochaine variation de demande.
          </Callout>
        </section>

        {/* SECTION 3 — HowTo 5 etapes */}
        <section id="howto" className="mb-16">
          <SectionHeading icon={<ListChecks className="w-6 h-6" />} number="3">
            Calculer la rotation en 5 étapes (méthode pas-à-pas)
          </SectionHeading>

          <div className="prose-content">
            <p>
              Voici la méthode complète pour calculer le coefficient de rotation de votre restaurant.
              Comptez 20 à 30 minutes la première fois, puis 5-10 minutes une fois la routine installée.
              Plus vous le faites souvent, plus vous détectez vite les anomalies.
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

          {/* Exemple chiffre */}
          <div className="mt-10 bg-mono-1000 border border-mono-900 rounded-2xl p-6 sm:p-8">
            <h3 className="font-bold text-mono-100 mb-4 text-lg flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-teal-600" />
              Exemple chiffré : bistronomie avril 2026
            </h3>
            <div className="bg-white border border-mono-900 rounded-xl p-5 font-mono text-sm text-mono-350 space-y-2">
              <div>Stock 1er avril :        4 200 EUR</div>
              <div>Stock 30 avril :          4 800 EUR</div>
              <div>Achats du mois :         13 000 EUR</div>
              <div className="border-t border-mono-900 pt-2">CMV = 4 200 + 13 000 - 4 800 = <strong className="text-mono-100">12 400 EUR</strong></div>
              <div>Stock moyen = (4 200 + 4 800) / 2 = <strong className="text-mono-100">4 500 EUR</strong></div>
              <div>Rotation = 12 400 / 4 500 = <strong className="text-teal-700">2,76x/mois</strong></div>
              <div>Jours de stock = (4 500 / 12 400) x 30 = <strong className="text-teal-700">10,9 jours</strong></div>
            </div>
            <p className="mt-4 text-sm text-mono-400 leading-relaxed">
              Verdict : rotation légèrement en-dessous du benchmark (cible 3-4x). Action recommandée :
              décliner par catégorie pour identifier où se loge le stock dormant.
            </p>
          </div>

          <Callout type="info">
            <strong>Astuce gain de temps :</strong> au lieu de refaire ce calcul à la main chaque mois,
            <Link to="/outils/calculateur-food-cost" className="underline font-semibold hover:text-teal-700 ml-1">
              utilisez le calculateur RestauMargin
            </Link>{' '}
            qui synchronise factures fournisseurs, ventes et inventaires pour vous donner la rotation
            par catégorie en temps réel.
          </Callout>
        </section>

        {/* SECTION 4 — Ratios par categorie */}
        <section id="ratios" className="mb-16">
          <SectionHeading icon={<BarChart3 className="w-6 h-6" />} number="4">
            Ratios cibles par catégorie de produit
          </SectionHeading>

          <div className="prose-content">
            <p>
              L'analyse globale de la rotation masque toujours des anomalies locales. C'est en
              découpant par famille de produit que vous détectez le stock dormant. Voici les
              <strong> ratios cibles par catégorie</strong> observés dans les restaurants performants
              en France (source : GIRA Conseil 2025, SNRC).
            </p>
          </div>

          <div className="mt-8 overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="bg-mono-975 text-mono-350">
                  <th className="text-left py-3 px-4 font-semibold rounded-tl-xl">Catégorie</th>
                  <th className="text-center py-3 px-4 font-semibold">Durée de vie</th>
                  <th className="text-center py-3 px-4 font-semibold">Jours de stock cible</th>
                  <th className="text-center py-3 px-4 font-semibold">Rotation mensuelle</th>
                  <th className="text-center py-3 px-4 font-semibold rounded-tr-xl">Fréquence achat</th>
                </tr>
              </thead>
              <tbody className="text-mono-350">
                {[
                  { cat: 'Poissons frais', dlc: '1-3 jours', js: '1-2 j', rot: '12-15x', freq: 'Quotidien' },
                  { cat: 'Coquillages / crustacés', dlc: '1-2 jours', js: '0,5-1 j', rot: '20-30x', freq: 'Quotidien' },
                  { cat: 'Viandes fraîches', dlc: '3-7 jours', js: '2-4 j', rot: '7-10x', freq: '2-3x/semaine' },
                  { cat: 'Volaille', dlc: '2-4 jours', js: '1-2 j', rot: '12-15x', freq: 'Tri-hebdo' },
                  { cat: 'Charcuterie / triperie', dlc: '5-10 jours', js: '3-5 j', rot: '6-8x', freq: 'Hebdo' },
                  { cat: 'Légumes fragiles (salades, herbes)', dlc: '2-4 jours', js: '1-2 j', rot: '12-15x', freq: 'Quotidien' },
                  { cat: 'Légumes de garde (carotte, oignon)', dlc: '15-30 jours', js: '5-7 j', rot: '4-6x', freq: 'Hebdo' },
                  { cat: 'Fruits frais', dlc: '3-7 jours', js: '2-4 j', rot: '7-10x', freq: 'Bi-hebdo' },
                  { cat: 'Crémerie (lait, beurre, oeufs)', dlc: '7-21 jours', js: '5-7 j', rot: '4-6x', freq: 'Bi-hebdo' },
                  { cat: 'Fromages affinés', dlc: '15-45 jours', js: '10-15 j', rot: '2-3x', freq: 'Hebdo' },
                  { cat: 'Pâtes, riz, farine, conserves', dlc: '6-24 mois', js: '15-30 j', rot: '1-2x', freq: 'Mensuel' },
                  { cat: 'Épices, condiments', dlc: '12-36 mois', js: '30-60 j', rot: '0,5-1x', freq: 'Bi-mensuel' },
                  { cat: 'Surgelés (légumes, frites)', dlc: '12-24 mois', js: '30-60 j', rot: '0,5-1x', freq: 'Mensuel' },
                  { cat: 'Surgelés (protéines)', dlc: '6-12 mois', js: '15-30 j', rot: '1-2x', freq: 'Bi-mensuel' },
                  { cat: 'Vins courants', dlc: '1-3 ans', js: '15-30 j', rot: '1-2x', freq: 'Mensuel' },
                  { cat: 'Vins de garde / cave', dlc: '5-20+ ans', js: '60-90 j', rot: '0,3-0,5x', freq: 'Trimestriel' },
                  { cat: 'Spiritueux', dlc: '5+ ans', js: '15-30 j', rot: '1-2x', freq: 'Mensuel' },
                  { cat: 'Bières / softs', dlc: '3-12 mois', js: '7-15 j', rot: '2-4x', freq: 'Hebdo' },
                ].map((row, i) => (
                  <tr key={i} className={i % 2 === 0 ? 'bg-white' : 'bg-mono-1000'}>
                    <td className="py-3 px-4 font-medium text-mono-100">{row.cat}</td>
                    <td className="py-3 px-4 text-center">{row.dlc}</td>
                    <td className="py-3 px-4 text-center font-semibold text-teal-700">{row.js}</td>
                    <td className="py-3 px-4 text-center">{row.rot}</td>
                    <td className="py-3 px-4 text-center text-mono-500">{row.freq}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="prose-content mt-8">
            <h3 className="text-xl font-bold text-mono-100 mb-3">Comment lire ce tableau</h3>
            <ul className="list-disc list-inside space-y-2 text-mono-350">
              <li>
                <strong>Frais (viandes, poissons, fruits, légumes)</strong> : la règle d'or est <strong>2-3 jours
                de stock maximum</strong>. Au-delà, vous payez en pertes ce que vous croyez économiser en logistique.
              </li>
              <li>
                <strong>Secs et conserves</strong> : <strong>15-30 jours</strong> est confortable. Pas la peine
                de descendre plus bas (vous payez plus en logistique que vous n'économisez en trésorerie).
              </li>
              <li>
                <strong>Surgelés</strong> : <strong>30-60 jours</strong> en moyenne. Le congélateur protège
                la DLC mais coûte cher en énergie (5-8 EUR/m3/mois). Ne pas en abuser.
              </li>
              <li>
                <strong>Vins courants vs garde</strong> : ratios totalement différents (1-2x vs 0,3-0,5x).
                Les vins de garde prennent même de la valeur en cave, c'est un actif différent.
              </li>
            </ul>
          </div>

          <Callout type="info">
            <strong>Règle empirique :</strong> si une catégorie dépasse <strong>2x le benchmark</strong>,
            c'est du stock dormant. Si elle est <strong>2x inférieure</strong>, vous risquez la rupture
            (et donc des plats sortis de carte au pire moment). L'objectif est d'être dans la cible, pas au-dessous.
          </Callout>
        </section>

        {/* SECTION 5 — FIFO / LIFO / PEPS */}
        <section id="fifo" className="mb-16">
          <SectionHeading icon={<Layers className="w-6 h-6" />} number="5">
            Méthode FIFO / LIFO / PEPS : laquelle choisir ?
          </SectionHeading>

          <div className="prose-content">
            <p>
              Trois méthodes existent pour valoriser le stock et organiser sa consommation. En
              restauration, une seule est utilisée dans la pratique : le <strong>FIFO (First In,
              First Out)</strong>, équivalent français <strong>PEPS (Premier Entre, Premier Sorti)</strong>.
              Mais comprendre les trois méthodes permet de bien parler avec son comptable et d'éviter
              les erreurs réglementaires.
            </p>
          </div>

          <div className="grid sm:grid-cols-3 gap-5 mt-8">
            <MethodCard
              title="FIFO / PEPS"
              subtitle="Recommandé"
              color="emerald"
              desc="Premier entre = premier sorti. Les produits les plus anciens sont consommés en premier. Indispensable pour les denrées périssables et obligatoire pour le calcul fiscal en France depuis 2014."
              avantage="Limite les DLC dépassées, valorisation réaliste, conforme PCG"
              inconvenient="Demande un étiquetage daté et un rangement rigoureux"
            />
            <MethodCard
              title="LIFO"
              subtitle="Interdit en France"
              color="red"
              desc="Last In, First Out : dernier entre = premier sorti. Les produits les plus récents sont consommés en priorité. Méthode autorisée aux États-Unis mais interdite en France depuis 2014 (PCG)."
              avantage="Avantage fiscal en inflation (en US uniquement)"
              inconvenient="Interdit pour les bilans français, garantit des pertes en restauration"
            />
            <MethodCard
              title="CUMP"
              subtitle="Alternative comptable"
              color="blue"
              desc="Coût Unitaire Moyen Pondéré : on calcule un prix moyen pondéré à chaque entrée. Utilisé par les grands groupes. Compatible avec le FIFO physique (rangement) tout en simplifiant la comptabilité."
              avantage="Simplifie la valorisation comptable"
              inconvenient="Decorrele du flux physique réel des produits"
            />
          </div>

          <div className="prose-content mt-8">
            <h3 className="text-xl font-bold text-mono-100 mb-3">FIFO en pratique : les 5 règles</h3>
            <ol className="list-decimal list-inside space-y-2 text-mono-350">
              <li><strong>Étiquetage date à la réception</strong> : date de réception + DLC sur chaque produit ou bac gastronome.</li>
              <li><strong>Rangement par date</strong> : les nouveaux produits derrière, les anciens devant. Une règle simple : "celui qui range, range derrière".</li>
              <li><strong>Code couleur par jour</strong> : étiquettes lundi=rouge, mardi=jaune, mercredi=vert... permet de voir d'un coup d'oeil l'âge d'un produit.</li>
              <li><strong>Inventaire visuel quotidien</strong> : 5 minutes en début de service pour scanner les DLC du jour.</li>
              <li><strong>Suggestion du jour</strong> : écouler les fins de stock par une "création du chef" qui utilise les produits à sortir.</li>
            </ol>
            <p className="mt-4">
              Le FIFO bien appliqué réduit les pertes de <strong>3 à 5 %</strong> du coût matière annuel.
              Sur un restaurant qui achète pour 180 000 EUR par an, c'est <strong>5 400 à 9 000 EUR</strong>{' '}
              récupérés directement sur la marge nette. Pour aller plus loin, lisez notre guide complet
              <Link to="/blog/methode-fifo-gestion-stocks-restaurant" className="text-teal-700 underline hover:text-teal-800 ml-1">
                méthode FIFO en restaurant
              </Link>{' '}
              ainsi que la comparaison détaillée
              <Link to="/blog/fifo-lifo-stocks-restaurant" className="text-teal-700 underline hover:text-teal-800 ml-1">
                FIFO vs LIFO
              </Link>.
            </p>
          </div>
        </section>

        {/* SECTION 6 — Inventaire */}
        <section id="inventaire" className="mb-16">
          <SectionHeading icon={<ClipboardList className="w-6 h-6" />} number="6">
            Inventaire physique vs inventaire permanent
          </SectionHeading>

          <div className="prose-content">
            <p>
              Pour piloter la rotation des stocks de votre restaurant, il faut savoir compter ce que
              vous avez. Deux méthodes coexistent et se complètent : l'inventaire physique (à la
              main, sur étagère) et l'inventaire permanent (informatique, en continu).
            </p>
          </div>

          <div className="grid sm:grid-cols-2 gap-6 mt-8">
            <div className="bg-blue-50 border border-blue-200 rounded-2xl p-6">
              <div className="flex items-center gap-2 mb-3">
                <Warehouse className="w-5 h-5 text-blue-700" />
                <h3 className="font-bold text-blue-900">Inventaire physique</h3>
              </div>
              <p className="text-sm text-blue-800 mb-3">
                <strong>Méthode :</strong> on compte chaque produit à la main, étagère par étagère,
                en valorisant au prix d'achat HT.
              </p>
              <p className="text-sm text-blue-800 mb-3">
                <strong>Fréquence :</strong> obligatoire <strong>1x/an</strong> (clôture comptable), recommandé
                <strong> tous les 15 jours</strong> pour piloter la rotation. Cible : produits chers chaque lundi.
              </p>
              <p className="text-sm text-blue-800">
                <strong>Avantage :</strong> réalité terrain incontestable, détecte la casse et le vol.<br />
                <strong>Inconvénient :</strong> chronophage (2-4 heures par inventaire complet).
              </p>
            </div>

            <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-6">
              <div className="flex items-center gap-2 mb-3">
                <Sparkles className="w-5 h-5 text-emerald-700" />
                <h3 className="font-bold text-emerald-900">Inventaire permanent</h3>
              </div>
              <p className="text-sm text-emerald-800 mb-3">
                <strong>Méthode :</strong> le logiciel met à jour le stock automatiquement (entrées = OCR
                factures, sorties = decremement par fiche technique à chaque vente caisse).
              </p>
              <p className="text-sm text-emerald-800 mb-3">
                <strong>Fréquence :</strong> <strong>temps réel</strong>, accessible 24/7 depuis n'importe
                quel écran. Permet la rotation par catégorie en continu.
              </p>
              <p className="text-sm text-emerald-800">
                <strong>Avantage :</strong> vision en continu, alertes seuil bas, rotation auto.<br />
                <strong>Inconvénient :</strong> dérive si pas réconcilié avec le physique régulière.
              </p>
            </div>
          </div>

          <div className="prose-content mt-8">
            <h3 className="text-xl font-bold text-mono-100 mb-3">La combinaison gagnante</h3>
            <p>
              L'approche moderne consiste à <strong>combiner les deux</strong> : un inventaire
              permanent pour le pilotage quotidien (rotation, food cost, marge) + un inventaire physique
              tous les 15 jours pour réconcilier et détecter les écarts. Un écart supérieur à
              <strong> 3 %</strong> entre le stock théorique (permanent) et le stock réel (physique) signale
              l'un des problèmes suivants : casse non déclarée, vol, erreur de fiche technique, mauvaise
              saisie de facture.
            </p>
            <p>
              Pour la méthodologie pas-à-pas du comptage physique, consultez notre guide complet
              <Link to="/blog/inventaire-restaurant-guide" className="text-teal-700 underline hover:text-teal-800 ml-1">
                inventaire restaurant
              </Link>. C'est la fondation sans laquelle aucun calcul de rotation n'a de sens.
            </p>
          </div>

          <Callout type="warning">
            <strong>Erreur classique :</strong> faire un inventaire permanent sans jamais le réconcilier
            avec un physique. Au bout de 6 mois, l'écart peut atteindre 10-15 % et vous prenez des décisions
            sur des chiffres faux. La discipline du physique bi-mensuel est non-négociable.
          </Callout>
        </section>

        {/* SECTION 7 — Cout cache */}
        <section id="cout-cache" className="mb-16">
          <SectionHeading icon={<DollarSign className="w-6 h-6" />} number="7">
            Le coût caché du stockage (20-30 % par an)
          </SectionHeading>

          <div className="prose-content">
            <p>
              La plupart des restaurateurs sous-estiment massivement le coût réel du stockage. On voit
              le stock comme "de l'argent qui dort", mais en réalité c'est de <strong>l'argent qui se
              dégrade activement</strong>. Le coût total de stockage représente <strong>20 à 30 % de la
              valeur du stock par an</strong>, réparti sur 5 postes.
            </p>
          </div>

          <div className="mt-8 overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="bg-mono-975 text-mono-350">
                  <th className="text-left py-3 px-4 font-semibold rounded-tl-xl">Poste de coût</th>
                  <th className="text-center py-3 px-4 font-semibold">% de la valeur stock</th>
                  <th className="text-left py-3 px-4 font-semibold rounded-tr-xl">Détail</th>
                </tr>
              </thead>
              <tbody className="text-mono-350">
                <tr className="bg-white">
                  <td className="py-3 px-4 font-medium text-mono-100">Capital immobilisé</td>
                  <td className="py-3 px-4 text-center font-semibold text-red-700">5 - 8 %</td>
                  <td className="py-3 px-4">Coût d'opportunité (découvert bancaire, intérêts emprunt, rendement perdu)</td>
                </tr>
                <tr className="bg-mono-1000">
                  <td className="py-3 px-4 font-medium text-mono-100">Pertes (DLC, casse, vol)</td>
                  <td className="py-3 px-4 text-center font-semibold text-red-700">3 - 7 %</td>
                  <td className="py-3 px-4">Produits jetés à la DLC, casse de fragiles, vol interne ou externe</td>
                </tr>
                <tr className="bg-white">
                  <td className="py-3 px-4 font-medium text-mono-100">Énergie (froid)</td>
                  <td className="py-3 px-4 text-center font-semibold text-red-700">5 - 8 %</td>
                  <td className="py-3 px-4">Chambre froide positive 4-6 EUR/m3/mois, congélateur 8-12 EUR/m3/mois</td>
                </tr>
                <tr className="bg-mono-1000">
                  <td className="py-3 px-4 font-medium text-mono-100">Manutention + inventaire</td>
                  <td className="py-3 px-4 text-center font-semibold text-red-700">2 - 4 %</td>
                  <td className="py-3 px-4">Temps personnel réception, rangement, comptage, gestion</td>
                </tr>
                <tr className="bg-white">
                  <td className="py-3 px-4 font-medium text-mono-100">Assurance + risque</td>
                  <td className="py-3 px-4 text-center font-semibold text-red-700">1 - 3 %</td>
                  <td className="py-3 px-4">Assurance multirisque, risque coupure froid, risque inondation</td>
                </tr>
                <tr className="bg-teal-50 border-t-2 border-teal-200">
                  <td className="py-3 px-4 font-bold text-mono-100">TOTAL annuel</td>
                  <td className="py-3 px-4 text-center font-bold text-teal-700">20 - 30 %</td>
                  <td className="py-3 px-4 font-semibold text-teal-900">de la valeur moyenne du stock</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="prose-content mt-8">
            <h3 className="text-xl font-bold text-mono-100 mb-3">Application chiffrée</h3>
            <p>
              Prenons un restaurant avec un stock moyen de <strong>15 000 EUR</strong>. Le coût réel
              annuel de ce stock est de 3 000 à 4 500 EUR (juste pour exister, hors valeur achat).
              Si vous réduisez ce stock à <strong>8 000 EUR</strong> sans casser le service, vous
              économisez <strong>1 400 à 2 100 EUR par an</strong>, et vous libérez <strong>7 000 EUR</strong>{' '}
              de trésorerie immédiatement disponibles pour investir, embaucher ou rembourser un emprunt.
            </p>
          </div>

          <Callout type="info">
            <strong>Tip rentable :</strong> avant d'accepter une remise volume de votre fournisseur (par
            exemple -5 % sur achat 1 mois au lieu de 1 semaine), calculez si le coût de stockage
            additionnel ne mange pas la remise. Si vous sur-stockez 4 semaines de plus à 25 % de coût
            annuel de stockage, vous payez environ 2 % en plus en stockage. Une remise de 5 % donne en
            réalité 3 % de gain net. Si la remise est de 2 %, vous perdez de l'argent.
          </Callout>
        </section>

        {/* SECTION 8 — Stock de securite + alerte */}
        <section id="securite" className="mb-16">
          <SectionHeading icon={<Target className="w-6 h-6" />} number="8">
            Stock de sécurité, stock d'alerte et réapprovisionnement
          </SectionHeading>

          <div className="prose-content">
            <p>
              Réduire le stock ne signifie pas tomber en rupture. La bonne approche est de calculer
              précisément deux seuils : le <strong>stock de sécurité</strong> (tampon contre les
              imprévus) et le <strong>stock d'alerte</strong> (déclencheur de commande). Ces deux
              valeurs s'ajustent par référence et par saison.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 gap-6 mt-8">
            <div className="bg-amber-50 border border-amber-200 rounded-2xl p-6">
              <div className="flex items-center gap-2 mb-3">
                <ShieldAlert className="w-5 h-5 text-amber-700" />
                <h3 className="font-bold text-amber-900">Stock de sécurité</h3>
              </div>
              <p className="text-sm text-amber-800 mb-3">
                Quantité tampon qui couvre les <strong>imprévus</strong> : pic de demande non anticipé,
                retard de livraison, défaut qualité, événement exceptionnel.
              </p>
              <div className="bg-white border border-amber-200 rounded-xl p-4 font-mono text-xs text-amber-900">
                Stock sécurité = Consommation moy/j x Délai x Coef sécurité (1,2 - 1,5)
              </div>
            </div>

            <div className="bg-red-50 border border-red-200 rounded-2xl p-6">
              <div className="flex items-center gap-2 mb-3">
                <Zap className="w-5 h-5 text-red-700" />
                <h3 className="font-bold text-red-900">Stock d'alerte (point de commande)</h3>
              </div>
              <p className="text-sm text-red-800 mb-3">
                Niveau de stock <strong>déclencheur</strong> de la commande de réapprovisionnement.
                Inclut le délai fournisseur pour ne jamais tomber en-dessous du stock de sécurité.
              </p>
              <div className="bg-white border border-red-200 rounded-xl p-4 font-mono text-xs text-red-900">
                Stock alerte = Stock sécurité + (Consommation moy/j x Délai livraison)
              </div>
            </div>
          </div>

          <div className="mt-8 bg-mono-1000 border border-mono-900 rounded-2xl p-6 sm:p-8">
            <h3 className="font-bold text-mono-100 mb-4 text-lg flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-teal-600" />
              Exemple chiffré : steak haché
            </h3>
            <div className="bg-white border border-mono-900 rounded-xl p-5 font-mono text-sm text-mono-350 space-y-2">
              <div>Consommation moyenne :     2 kg/jour</div>
              <div>Délai livraison fournisseur : 3 jours</div>
              <div>Coefficient de sécurité :    1,3 (saison standard)</div>
              <div className="border-t border-mono-900 pt-2">Stock de sécurité = 2 x 3 x 1,3 = <strong className="text-mono-100">7,8 kg</strong></div>
              <div>Stock alerte = 7,8 + (2 x 3) = <strong className="text-teal-700">13,8 kg</strong></div>
              <div>Quantité à commander = 7 jours x 2 kg = <strong className="text-teal-700">14 kg</strong></div>
              <div>Stock max après livraison = <strong className="text-teal-700">21,8 kg</strong></div>
            </div>
            <p className="mt-4 text-sm text-mono-400 leading-relaxed">
              Avec ce dispositif, vous déclenchez la commande quand il reste 13,8 kg, vous recevez 14 kg
              3 jours plus tard, et vous n'êtes jamais en rupture. Le coefficient de sécurité passe à 1,5
              en haute saison et 1,2 en basse saison pour lisser les variations.
            </p>
          </div>

          <div className="prose-content mt-8">
            <p>
              Ce calcul doit être fait <strong>par référence</strong> pour les produits critiques
              (top 20 % en valeur). Pour les autres références (épicerie longue durée), un simple
              seuil bas visuel suffit. La règle de Pareto s'applique : 20 % de vos références font
              80 % de votre valeur de stock — c'est sur ces 20 % que vous mettez l'effort de calibrage.
            </p>
          </div>
        </section>

        {/* SECTION 9 — Stock dormant */}
        <section id="dormant" className="mb-16">
          <SectionHeading icon={<Package className="w-6 h-6" />} number="9">
            Comment détecter et réduire le stock dormant
          </SectionHeading>

          <div className="prose-content">
            <p>
              Le <strong>stock dormant</strong> est l'ennemi silencieux de votre trésorerie. Il s'agit
              des produits qui n'ont pas tourné depuis 30, 60 ou 90 jours. Dans la plupart des
              restaurants, 15 à 25 % du stock est dormant sans que l'équipe ne s'en rende compte.
              Voici comment le détecter et l'éradiquer.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 gap-5 mt-8">
            <ImpactCard
              icon={<AlertTriangle className="w-5 h-5" />}
              color="red"
              title="Niveau 1 — Dormant (30j)"
              desc="Aucune sortie depuis 30 jours. Action : revoir la fiche technique qui l'utilise, intégrer dans une suggestion du jour."
            />
            <ImpactCard
              icon={<ShieldAlert className="w-5 h-5" />}
              color="amber"
              title="Niveau 2 — Critique (60j)"
              desc="Aucune sortie depuis 60 jours. Action : promotion plat du jour ou retour fournisseur si possible. Décision sous 7 jours."
            />
            <ImpactCard
              icon={<Snowflake className="w-5 h-5" />}
              color="blue"
              title="Niveau 3 — Glacé (90j)"
              desc="Aucune sortie depuis 90 jours. Action : congeler si compatible, donner à une association, ou jeter avec traçabilité."
            />
            <ImpactCard
              icon={<Lightbulb className="w-5 h-5" />}
              color="teal"
              title="Prévention"
              desc="Supprimer la référence du catalogue actif. Réduire les minimums de commande chez le fournisseur ou changer de fournisseur."
            />
          </div>

          <div className="prose-content mt-8">
            <h3 className="text-xl font-bold text-mono-100 mb-3">Les 6 leviers d'optimisation</h3>
            <ol className="list-decimal list-inside space-y-3 text-mono-350">
              <li><strong>Commandes en flux tendus</strong> : 3-4 petites commandes/semaine plutôt que 2 grosses. Stock divisé par 2 pour le même CA, produits plus frais, trésorerie libérée.</li>
              <li><strong>Standardiser les recettes</strong> : fiches techniques précises au gramme, bacs gastronomes calibrés, pesage systématique des protéines.</li>
              <li><strong>Carte alignée avec les stocks</strong> : suggestion du jour qui utilise les fins de stock, mini-carte 6-8 plats max. Passer de 24 à 12 plats peut faire passer la rotation de 2,5x à 4,8x.</li>
              <li><strong>FIFO strict</strong> : étiquetage date à la réception, rangement par date, code couleur par jour. Réduit les pertes de 3-5 %.</li>
              <li><strong>Réduire les références</strong> : 30 % des références ne servent qu'à 5 % du CA. Cible : 80-150 références actives, pas 150-300.</li>
              <li><strong>Fournisseurs fréquents vs stock important</strong> : flux tendus sur le frais (viandes/poissons/légumes), stock raisonnable sur les secs.</li>
            </ol>
            <p className="mt-4">
              Pour aller plus loin sur la réduction du gaspillage, consultez notre guide dédié
              <Link to="/blog/gaspillage-alimentaire" className="text-teal-700 underline hover:text-teal-800 ml-1">
                gaspillage alimentaire en restaurant
              </Link>. Ces deux sujets (rotation + gaspillage) sont les deux faces d'une même médaille.
            </p>
          </div>

          <Callout type="warning">
            <strong>Cas très fréquent :</strong> un fournisseur qui impose un minimum de commande
            (300 EUR) vous force à sur-stocker. Trois solutions : (1) grouper avec un restaurant
            voisin, (2) changer pour un fournisseur sans minimum (Pourdebon Pro, La Ruche Pro, marché
            de gros), (3) accepter le minimum uniquement pour les secs (jamais pour le frais).
          </Callout>
        </section>

        {/* SECTION 10 — Outils digitaux */}
        <section id="outils" className="mb-16">
          <SectionHeading icon={<Sparkles className="w-6 h-6" />} number="10">
            Outils digitaux pour automatiser la rotation
          </SectionHeading>

          <div className="prose-content">
            <p>
              Faire tous ces calculs à la main est possible mais épuisant. Les outils digitaux modernes
              automatisent l'ensemble : OCR factures, décompte par fiche technique à chaque vente,
              calcul rotation en continu, alertes seuil bas, identification du stock dormant. Voici
              les critères pour choisir le bon logiciel.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 gap-6 mt-8">
            {[
              {
                icon: <Calculator className="w-5 h-5" />,
                title: 'OCR factures fournisseurs',
                desc: "Le logiciel scanne automatiquement les factures (Metro, Pomona, Brake, marchés). Plus de saisie manuelle, prix toujours à jour, mise à jour automatique des fiches techniques.",
              },
              {
                icon: <RefreshCw className="w-5 h-5" />,
                title: 'Décompte temps réel par caisse',
                desc: "À chaque vente, la fiche technique decremente le stock. Vous savez en continu ce qu'il reste sans toucher au stock physique. Compatible POS Sumup, Lightspeed, Zelty, L'Addition.",
              },
              {
                icon: <BarChart3 className="w-5 h-5" />,
                title: 'Rotation par catégorie en continu',
                desc: "Visualisez la rotation par famille (viande, poisson, sec, vin) en temps réel. Identifiez immédiatement la catégorie qui dépasse le benchmark.",
              },
              {
                icon: <AlertTriangle className="w-5 h-5" />,
                title: 'Alertes stock dormant',
                desc: "Le logiciel détecte automatiquement les produits qui n'ont pas tourné depuis 30/60/90 jours et propose 4 actions : recette anti-gaspi, promo, retour fournisseur, don.",
              },
              {
                icon: <Target className="w-5 h-5" />,
                title: 'Stock de sécurité intelligent',
                desc: "Calcul automatique par référence en fonction de l'historique de consommation et de la saisonnalité. Ajuste tout seul les coefficients de sécurité selon les variations.",
              },
              {
                icon: <Settings className="w-5 h-5" />,
                title: 'Suggestion de commandes',
                desc: "Le logiciel propose la commande optimale par fournisseur en fonction du stock, de la consommation prévue et des délais. Validez en 1 clic.",
              },
            ].map((feat, i) => (
              <div key={i} className="bg-white border border-mono-900 rounded-xl p-5 hover:border-teal-300 hover:shadow-sm transition-all">
                <div className="w-10 h-10 bg-teal-50 rounded-lg flex items-center justify-center text-teal-600 mb-3">
                  {feat.icon}
                </div>
                <h3 className="font-semibold text-mono-100 mb-1.5">{feat.title}</h3>
                <p className="text-sm text-mono-400 leading-relaxed">{feat.desc}</p>
              </div>
            ))}
          </div>

          <div className="prose-content mt-8">
            <h3 className="text-xl font-bold text-mono-100 mb-3">Les solutions du marché</h3>
            <p>
              Plusieurs logiciels existent en France : <strong>RestauMargin</strong> (positionné sur
              la marge brute + rotation + alertes IA, 29 EUR/mois), <strong>Easilys</strong> (gestion
              de stocks + traceabilite HACCP, 89 EUR/mois), <strong>Marketman</strong> (américain
              traduit en français, 149 USD/mois), <strong>Foodics</strong> (POS complet + stocks).
              Pour un indépendant ou une petite chaîne, RestauMargin offre le meilleur ratio
              fonctionnalités / prix pour le suivi de la rotation et de la marge.
            </p>
            <p>
              Résultat moyen constaté sur les établissements du secteur à RestauMargin : <strong>-30 %
              de stock dormant en 90 jours</strong>, <strong>+1,5 à 3 points de marge brute</strong>{' '}
              récupérés, <strong>5-8 heures par semaine économisées</strong> sur la gestion des stocks.
              Pour découvrir l'outil, lancez le
              <Link to="/outils/calculateur-food-cost" className="text-teal-700 underline hover:text-teal-800 ml-1">
                calculateur de food cost gratuit
              </Link>{' '}
              ou consultez les
              <Link to="/pricing" className="text-teal-700 underline hover:text-teal-800 ml-1">
                tarifs RestauMargin
              </Link>.
            </p>
          </div>
        </section>

        <BlogAuthor publishedDate="2026-04-27" readTime="16 min" variant="footer" />

        {/* FAQ */}
        <section id="faq" className="mb-16">
          <h2 className="text-2xl font-bold text-mono-100 mb-6">Questions fréquentes</h2>
          <div className="space-y-4">
            {faqItems.map((item, i) => (
              <FAQItem key={i} q={item.question} a={item.answer} />
            ))}
          </div>
        </section>

        {/* CTA */}
        <section id="cta" className="mb-16">
          <div className="bg-gradient-to-br from-teal-600 to-teal-700 rounded-2xl p-8 sm:p-12 text-center">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white mb-4">
              Libérez de la trésorerie en cuisine
            </h2>
            <p className="text-teal-100 text-lg max-w-xl mx-auto mb-3 leading-relaxed">
              RestauMargin importe vos factures fournisseurs, calcule votre rotation par catégorie en
              temps réel et alerte automatiquement sur le stock dormant. Tout est automatique.
            </p>
            <p className="text-teal-50 text-base max-w-xl mx-auto mb-8">
              <strong>29 EUR/mois</strong> &mdash; essai gratuit 7 jours, sans engagement, sans carte bancaire.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                to="/login?mode=register"
                className="inline-flex items-center gap-2 px-8 py-4 bg-white text-teal-700 font-bold rounded-full hover:bg-teal-50 transition-colors text-lg shadow-lg"
              >
                Essai gratuit 7 jours
                <ArrowRight className="w-5 h-5" />
              </Link>
              <Link
                to="/outils/calculateur-food-cost"
                className="inline-flex items-center gap-2 px-8 py-4 border-2 border-white/30 text-white font-semibold rounded-full hover:bg-white/10 transition-colors"
              >
                <Calculator className="w-5 h-5" />
                Calculateur gratuit
              </Link>
            </div>
          </div>
        </section>

        {/* Articles complementaires */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold text-mono-100 mb-6">Pour aller plus loin</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Link to="/blog/methode-fifo-gestion-stocks-restaurant" className="bg-mono-1000 border border-mono-900 rounded-xl p-5 hover:border-teal-300 hover:shadow-sm transition-all group">
              <h3 className="font-semibold text-mono-100 mb-1.5 group-hover:text-teal-700 transition-colors">Méthode FIFO en restaurant</h3>
              <p className="text-xs text-mono-500">Étiquetage, rangement, code couleur : le FIFO en pratique pour réduire les pertes.</p>
            </Link>
            <Link to="/blog/fifo-lifo-stocks-restaurant" className="bg-mono-1000 border border-mono-900 rounded-xl p-5 hover:border-teal-300 hover:shadow-sm transition-all group">
              <h3 className="font-semibold text-mono-100 mb-1.5 group-hover:text-teal-700 transition-colors">FIFO vs LIFO en stocks</h3>
              <p className="text-xs text-mono-500">Comparaison des méthodes, règles fiscales France et choix recommandé.</p>
            </Link>
            <Link to="/blog/inventaire-restaurant-guide" className="bg-mono-1000 border border-mono-900 rounded-xl p-5 hover:border-teal-300 hover:shadow-sm transition-all group">
              <h3 className="font-semibold text-mono-100 mb-1.5 group-hover:text-teal-700 transition-colors">Inventaire restaurant</h3>
              <p className="text-xs text-mono-500">Méthodologie complète inventaire physique + permanent, fréquences et outils.</p>
            </Link>
            <Link to="/blog/gaspillage-alimentaire" className="bg-mono-1000 border border-mono-900 rounded-xl p-5 hover:border-teal-300 hover:shadow-sm transition-all group">
              <h3 className="font-semibold text-mono-100 mb-1.5 group-hover:text-teal-700 transition-colors">Réduire le gaspillage</h3>
              <p className="text-xs text-mono-500">Levier complémentaire à la rotation : recettes anti-gaspi, dons, traceabilite.</p>
            </Link>
          </div>
        </section>

        </article>

      </main>

      {/* Footer */}
      <footer className="bg-mono-1000 border-t border-mono-900 py-12 px-4">
        <div className="max-w-4xl mx-auto text-center text-sm text-mono-500">
          <Link to="/" className="flex items-center justify-center gap-2 text-mono-100 font-bold text-lg mb-4">
            <ChefHat className="w-6 h-6 text-teal-600" />
            RestauMargin
          </Link>
          <p className="mb-4">
            La plateforme de gestion de marge pour les restaurateurs.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4 text-xs text-mono-700">
            <Link to="/mentions-legales" className="hover:text-teal-600 transition-colors">Mentions légales</Link>
            <Link to="/cgv" className="hover:text-teal-600 transition-colors">CGV</Link>
            <Link to="/cgu" className="hover:text-teal-600 transition-colors">CGU</Link>
            <Link to="/politique-confidentialite" className="hover:text-teal-600 transition-colors">Confidentialité</Link>
          </div>
          <p className="mt-6 text-xs text-mono-700">
            &copy; {new Date().getFullYear()} RestauMargin. Tous droits réservés.
          </p>
        </div>
      </footer>
    </div>
  );
}

/* ═══════════════ Sous-composants ═══════════════ */

function SectionHeading({ icon, number, children }: { icon: React.ReactNode; number: string; children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-3 mb-6">
      <div className="w-10 h-10 bg-teal-100 text-teal-700 rounded-xl flex items-center justify-center shrink-0">
        {icon}
      </div>
      <h2 className="text-2xl font-bold text-mono-100">
        <span className="text-teal-600 mr-2">{number}.</span>
        {children}
      </h2>
    </div>
  );
}

function ImpactCard({ icon, title, desc, color }: {
  icon: React.ReactNode; title: string; desc: string; color: 'red' | 'amber' | 'teal' | 'blue';
}) {
  const colors: Record<string, { bg: string; text: string; iconBg: string }> = {
    red: { bg: 'bg-red-50 border-red-200', text: 'text-red-900', iconBg: 'bg-red-100 text-red-700' },
    amber: { bg: 'bg-amber-50 border-amber-200', text: 'text-amber-900', iconBg: 'bg-amber-100 text-amber-700' },
    teal: { bg: 'bg-teal-50 border-teal-200', text: 'text-teal-900', iconBg: 'bg-teal-100 text-teal-700' },
    blue: { bg: 'bg-blue-50 border-blue-200', text: 'text-blue-900', iconBg: 'bg-blue-100 text-blue-700' },
  };
  const c = colors[color];

  return (
    <div className={`${c.bg} border rounded-2xl p-5`}>
      <div className={`w-10 h-10 ${c.iconBg} rounded-lg flex items-center justify-center mb-3`}>
        {icon}
      </div>
      <h3 className={`font-bold ${c.text} mb-2`}>{title}</h3>
      <p className={`text-sm ${c.text} leading-relaxed opacity-90`}>{desc}</p>
    </div>
  );
}

function MethodCard({ title, subtitle, color, desc, avantage, inconvenient }: {
  title: string; subtitle: string; color: 'emerald' | 'red' | 'blue';
  desc: string; avantage: string; inconvenient: string;
}) {
  const colors: Record<string, { bg: string; badge: string; text: string }> = {
    emerald: { bg: 'bg-emerald-50 border-emerald-200', badge: 'bg-emerald-100 text-emerald-700', text: 'text-emerald-900' },
    red: { bg: 'bg-red-50 border-red-200', badge: 'bg-red-100 text-red-700', text: 'text-red-900' },
    blue: { bg: 'bg-blue-50 border-blue-200', badge: 'bg-blue-100 text-blue-700', text: 'text-blue-900' },
  };
  const c = colors[color];

  return (
    <div className={`${c.bg} border rounded-2xl p-6`}>
      <div className="flex items-center justify-between mb-3">
        <h3 className={`font-bold text-lg ${c.text}`}>{title}</h3>
        <span className={`text-xs font-semibold px-2 py-1 rounded-full ${c.badge}`}>{subtitle}</span>
      </div>
      <p className={`text-sm ${c.text} leading-relaxed mb-4 opacity-90`}>{desc}</p>
      <div className="space-y-2 text-xs">
        <div>
          <span className="font-semibold text-emerald-700">+ </span>
          <span className={`${c.text} opacity-80`}>{avantage}</span>
        </div>
        <div>
          <span className="font-semibold text-red-700">- </span>
          <span className={`${c.text} opacity-80`}>{inconvenient}</span>
        </div>
      </div>
    </div>
  );
}

function Callout({ type, children }: { type: 'info' | 'warning'; children: React.ReactNode }) {
  const styles = type === 'info'
    ? 'bg-blue-50 border-blue-200 text-blue-800'
    : 'bg-amber-50 border-amber-200 text-amber-800';
  const Icon = type === 'info' ? Lightbulb : AlertTriangle;
  return (
    <div className={`${styles} border rounded-xl p-5 my-6 flex gap-3 text-sm leading-relaxed`}>
      <Icon className="w-5 h-5 shrink-0 mt-0.5" />
      <div>{children}</div>
    </div>
  );
}

function FAQItem({ q, a }: { q: string; a: string }) {
  return (
    <details className="bg-mono-1000 border border-mono-900 rounded-xl group">
      <summary className="px-5 py-4 font-semibold text-mono-100 cursor-pointer select-none flex items-center justify-between hover:text-teal-700 transition-colors">
        {q}
        <ArrowRight className="w-4 h-4 text-mono-700 group-open:rotate-90 transition-transform" />
      </summary>
      <p className="px-5 pb-4 text-sm text-mono-400 leading-relaxed">{a}</p>
    </details>
  );
}
