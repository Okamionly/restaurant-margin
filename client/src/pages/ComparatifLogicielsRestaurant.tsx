import { Link } from 'react-router-dom';
import {
  ChefHat,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  ArrowRight,
  DollarSign,
  Target,
  BookOpen,
  Lightbulb,
  Users,
  Zap,
  Sparkles,
  Scale,
  XCircle,
  Star,
  Building2,
  Trophy,
  Cpu,
  Calendar,
  Truck,
  Smartphone,
  Award,
  Layers,
  PieChart,
} from 'lucide-react';
import SEOHead, { buildFAQSchema, buildBreadcrumbSchema } from '../components/SEOHead';
import BlogAuthor from '../components/BlogAuthor';
import BlogArticleHero from '../components/blog/BlogArticleHero';

/* ═══════════════════════════════════════════════════════════════
   MEGA COMPARATIF SEO — "Comparatif logiciels restaurant 2026"
   Mots-clés : comparatif logiciel restaurant, meilleur logiciel restaurant 2026,
   logiciel gestion restaurant comparatif
   12 outils comparés sur 15 critères — ~3 600 mots
   Ton honnête : RestauMargin = excellent pour marges, pas magique
   ═══════════════════════════════════════════════════════════════ */

const faqItems = [
  {
    question: "Combien faut-il dépenser en logiciels pour un restaurant en 2026 ?",
    answer:
      "La fourchette varie de 50 à 400 EUR/mois selon la taille et les besoins. Un restaurant indépendant peut s'en sortir avec 60-100 EUR/mois (RestauMargin Pro 29 EUR + TheFork gratuit + Sumup caisse). Un restaurant gastronomique ou un groupe vise plutôt 250-400 EUR/mois (Lightspeed Pro 89 EUR + Zenchef Standard 139 EUR + RestauMargin Business 79 EUR). Le bon ratio est de 1 à 2 % du chiffre d'affaires consacré au stack logiciel.",
  },
  {
    question: "Combien d'outils différents faut-il pour gérer un restaurant ?",
    answer:
      "En général 3 à 5 outils suffisent : un POS (caisse), un outil de gestion des marges, un système de réservation et une connexion livraison si applicable. Aucun outil unique sur le marché ne couvre tout sérieusement. La tendance 2026 est l'intégration via API : tous les bons logiciels se branchent entre eux (Lightspeed dialogue avec Hubrise, RestauMargin importe les ventes de Tiller, etc.).",
  },
  {
    question: "Quel est le meilleur logiciel restaurant en 2026 ?",
    answer:
      "Il n'existe pas de meilleur logiciel universel. Cela dépend du besoin : pour la gestion des marges et du food cost, RestauMargin ou Marketman ; pour la caisse, Lightspeed ou L'Addition ; pour les réservations, Zenchef ou TheFork ; pour la livraison multi-canal, Hubrise ou Deliverect. Le bon réflexe est de combiner 2 à 3 outils spécialisés plutôt qu'un outil tout-en-un médiocre partout.",
  },
  {
    question: "Faut-il préférer un logiciel français à un logiciel américain ?",
    answer:
      "Les deux ont des avantages. Les logiciels français (L'Addition, Zenchef, Innovorder, RestauMargin) maîtrisent les spécificités fiscales (TVA, NF525), le support en français et les habitudes métier locales. Les logiciels américains (Lightspeed, Toast, Marketman) ont souvent plus de moyens R&D et des intégrations plus matures. Pour un restaurant en France, un mix est souvent optimal : caisse française certifiée NF525, gestion par un outil performant peu importe l'origine.",
  },
  {
    question: "Les intégrations entre logiciels fonctionnent-elles vraiment ?",
    answer:
      "Cela dépend des éditeurs. Les meilleurs (Lightspeed, Hubrise, Deliverect) ont des API documentées et des connecteurs natifs. D'autres (notamment certains POS français anciens) demandent encore des intégrations sur-mesure. RestauMargin importe les ventes depuis Tiller, L'Addition, Lightspeed et Sumup. Avant d'acheter, vérifiez toujours la liste officielle des intégrations sur le site de chaque éditeur.",
  },
  {
    question: "Quelle est la différence entre un POS et un logiciel de gestion ?",
    answer:
      "Un POS (Point of Sale) est la caisse enregistreuse digitale : il prend la commande, génère le ticket et encaisse. Un logiciel de gestion couvre tout ce qui se passe en amont et en aval : food cost, stocks, fiches techniques, marges, planning. La majorité des restaurants ont besoin des deux. Certaines suites (Lightspeed, Innovorder) tentent de combiner les deux fonctions, mais avec un compromis sur la profondeur côté gestion.",
  },
  {
    question: "Existe-t-il un logiciel restaurant gratuit qui soit vraiment utilisable ?",
    answer:
      "Quelques outils freemium tiennent la route : Sumup POS (caisse gratuite, monétisation sur les transactions), TheFork (réservations gratuites jusqu'à un certain volume), Square (caisse + paiement à partir de 0 EUR). Pour la gestion des marges, aucun outil sérieux n'est gratuit car la complexité technique est élevée. Méfiez-vous des outils 100 % gratuits qui vendent souvent vos données fournisseurs ou vos statistiques de vente.",
  },
  {
    question: "Quel logiciel choisir pour un restaurant qui démarre ?",
    answer:
      "Pour un démarrage, viser la simplicité et un budget < 80 EUR/mois. La combinaison la plus efficace en 2026 : Sumup POS (caisse gratuite + matériel à 39 EUR), TheFork (réservations gratuites), RestauMargin Pro (29 EUR/mois pour les marges). Total mensuel : 29 EUR. Une fois l'activité stabilisée (6-12 mois), passer à une caisse plus pro comme L'Addition ou Lightspeed devient pertinent.",
  },
  {
    question: "L'IA est-elle vraiment utile dans un logiciel restaurant ?",
    answer:
      "Oui, mais seulement si elle est ciblée et entraînée sur des données métier. RestauMargin utilise l'IA pour détecter les hausses de prix fournisseurs, suggérer des optimisations de carte et lire les factures par OCR. Sunday l'utilise pour le paiement contactless. Mais beaucoup d'éditeurs ajoutent un chatbot pour l'effet marketing sans valeur réelle. Demandez toujours une démo concrète avant de croire un argument IA.",
  },
  {
    question: "Comment changer de logiciel sans perdre ses données ?",
    answer:
      "Les exports CSV sont normalement obligatoires (RGPD article 20 sur la portabilité). Avant de souscrire un nouvel outil, vérifiez que l'ancien permet d'exporter clients, factures, fiches techniques et historique de ventes. La migration prend en général 2 à 4 semaines avec un onboarding accompagné. Évitez les outils qui verrouillent vos données dans un format propriétaire (clauses contractuelles à lire attentivement).",
  },
];

type ToolName =
  | 'RestauMargin'
  | 'Lightspeed'
  | 'Zenchef'
  | 'Innovorder'
  | 'Hubrise'
  | 'TheFork'
  | "L'Addition"
  | 'Tiller'
  | 'Sunday'
  | 'Marketman'
  | 'Easilys'
  | 'Deliverect';

type ToolData = {
  name: ToolName;
  price: string;
  speciality: string;
  foodCost: 'oui' | 'non' | 'partiel';
  pos: 'oui' | 'non' | 'partiel';
  reservations: 'oui' | 'non' | 'partiel';
  livraison: 'oui' | 'non' | 'partiel';
  ia: 'oui' | 'non' | 'partiel';
  multiResto: 'oui' | 'non' | 'partiel';
  mobile: 'oui' | 'non' | 'partiel';
  supportFr: 'oui' | 'non' | 'partiel';
  note: string;
};

const tools: ToolData[] = [
  {
    name: 'RestauMargin',
    price: '29 EUR',
    speciality: 'Marges & food cost',
    foodCost: 'oui',
    pos: 'non',
    reservations: 'non',
    livraison: 'non',
    ia: 'oui',
    multiResto: 'oui',
    mobile: 'oui',
    supportFr: 'oui',
    note: '4.8/5',
  },
  {
    name: 'Lightspeed',
    price: '69 EUR',
    speciality: 'POS premium',
    foodCost: 'partiel',
    pos: 'oui',
    reservations: 'partiel',
    livraison: 'partiel',
    ia: 'partiel',
    multiResto: 'oui',
    mobile: 'oui',
    supportFr: 'oui',
    note: '4.4/5',
  },
  {
    name: 'Zenchef',
    price: '89 EUR',
    speciality: 'Réservations + marketing',
    foodCost: 'non',
    pos: 'non',
    reservations: 'oui',
    livraison: 'non',
    ia: 'partiel',
    multiResto: 'oui',
    mobile: 'oui',
    supportFr: 'oui',
    note: '4.5/5',
  },
  {
    name: 'Innovorder',
    price: '99 EUR',
    speciality: 'Caisse + click & collect',
    foodCost: 'partiel',
    pos: 'oui',
    reservations: 'partiel',
    livraison: 'oui',
    ia: 'partiel',
    multiResto: 'oui',
    mobile: 'oui',
    supportFr: 'oui',
    note: '4.2/5',
  },
  {
    name: 'Hubrise',
    price: '69 EUR',
    speciality: 'Hub intégrations livraison',
    foodCost: 'non',
    pos: 'non',
    reservations: 'non',
    livraison: 'oui',
    ia: 'non',
    multiResto: 'oui',
    mobile: 'partiel',
    supportFr: 'oui',
    note: '4.6/5',
  },
  {
    name: 'TheFork',
    price: 'Gratuit / 79 EUR',
    speciality: 'Réservations marketplace',
    foodCost: 'non',
    pos: 'non',
    reservations: 'oui',
    livraison: 'non',
    ia: 'non',
    multiResto: 'oui',
    mobile: 'oui',
    supportFr: 'oui',
    note: '4.1/5',
  },
  {
    name: "L'Addition",
    price: '59 EUR',
    speciality: 'POS français',
    foodCost: 'partiel',
    pos: 'oui',
    reservations: 'non',
    livraison: 'partiel',
    ia: 'non',
    multiResto: 'oui',
    mobile: 'oui',
    supportFr: 'oui',
    note: '4.5/5',
  },
  {
    name: 'Tiller',
    price: '69 EUR',
    speciality: 'POS bistrot/bar',
    foodCost: 'non',
    pos: 'oui',
    reservations: 'partiel',
    livraison: 'partiel',
    ia: 'non',
    multiResto: 'oui',
    mobile: 'oui',
    supportFr: 'oui',
    note: '4.3/5',
  },
  {
    name: 'Sunday',
    price: '0 EUR + 1.4 %',
    speciality: 'Paiement table mobile',
    foodCost: 'non',
    pos: 'partiel',
    reservations: 'non',
    livraison: 'non',
    ia: 'oui',
    multiResto: 'oui',
    mobile: 'oui',
    supportFr: 'oui',
    note: '4.6/5',
  },
  {
    name: 'Marketman',
    price: '149 EUR',
    speciality: 'Food cost USA',
    foodCost: 'oui',
    pos: 'non',
    reservations: 'non',
    livraison: 'non',
    ia: 'partiel',
    multiResto: 'oui',
    mobile: 'oui',
    supportFr: 'partiel',
    note: '4.4/5',
  },
  {
    name: 'Easilys',
    price: '149 EUR',
    speciality: 'Collectivités + RHF',
    foodCost: 'oui',
    pos: 'non',
    reservations: 'non',
    livraison: 'non',
    ia: 'partiel',
    multiResto: 'oui',
    mobile: 'partiel',
    supportFr: 'oui',
    note: '4.3/5',
  },
  {
    name: 'Deliverect',
    price: '89 EUR',
    speciality: 'Livraison multi-canal',
    foodCost: 'non',
    pos: 'non',
    reservations: 'non',
    livraison: 'oui',
    ia: 'partiel',
    multiResto: 'oui',
    mobile: 'partiel',
    supportFr: 'oui',
    note: '4.5/5',
  },
];

const articleSchema = {
  '@context': 'https://schema.org',
  '@type': 'Article',
  headline: 'Comparatif logiciels restaurant 2026 : 12 outils analysés',
  description:
    "Comparatif honnete et detaille de 12 logiciels restaurant en 2026 : RestauMargin, Lightspeed, Zenchef, Innovorder, Hubrise, TheFork, L'Addition, Tiller, Sunday, Marketman, Easilys, Deliverect. Prix, fonctionnalites, profils restaurateurs, FAQ.",
  image: 'https://www.restaumargin.fr/og-image.png',
  author: { '@type': 'Organization', name: 'RestauMargin', url: 'https://www.restaumargin.fr' },
  publisher: {
    '@type': 'Organization',
    name: 'RestauMargin',
    logo: { '@type': 'ImageObject', url: 'https://www.restaumargin.fr/icon-512.png' },
  },
  datePublished: '2026-05-26',
  dateModified: '2026-05-26',
  wordCount: 3600,
  inLanguage: 'fr-FR',
  mainEntityOfPage: {
    '@type': 'WebPage',
    '@id': 'https://www.restaumargin.fr/comparatif-logiciels-restaurant',
  },
};

const itemListSchema = {
  '@context': 'https://schema.org',
  '@type': 'ItemList',
  name: 'Comparatif 12 logiciels restaurant 2026',
  itemListElement: tools.map((t, i) => ({
    '@type': 'ListItem',
    position: i + 1,
    item: {
      '@type': 'SoftwareApplication',
      name: t.name,
      applicationCategory: 'BusinessApplication',
      operatingSystem: 'Web, iOS, Android',
      description: `${t.name} - ${t.speciality}. Tarif a partir de ${t.price}/mois.`,
      offers: {
        '@type': 'Offer',
        price: t.price.replace(/[^\d]/g, '') || '0',
        priceCurrency: 'EUR',
      },
    },
  })),
};

export default function ComparatifLogicielsRestaurant() {
  return (
    <div className="min-h-screen" style={{ fontFamily: "'Inter', system-ui, sans-serif" }}>
      <SEOHead
        title="Comparatif logiciels restaurant 2026 | 12 outils analysés | RestauMargin"
        description="Comparatif honnête de 12 logiciels restaurant en 2026 : RestauMargin, Lightspeed, Zenchef, Innovorder, Hubrise, TheFork, L'Addition, etc. Prix, fonctionnalités, avis."
        path="/comparatif-logiciels-restaurant"
        type="article"
        schema={[
          articleSchema,
          buildFAQSchema(faqItems),
          buildBreadcrumbSchema([
            { name: 'Accueil', url: 'https://www.restaumargin.fr/' },
            { name: 'Comparatifs', url: 'https://www.restaumargin.fr/blog' },
            { name: 'Comparatif logiciels restaurant', url: 'https://www.restaumargin.fr/comparatif-logiciels-restaurant' },
          ]),
          itemListSchema,
        ]}
      />

      {/* ── Navbar ── */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-mono-900">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <Link to="/landing" className="flex items-center gap-2 text-mono-100 font-bold text-lg">
            <ChefHat className="w-7 h-7 text-teal-600" />
            <span>RestauMargin</span>
          </Link>
          <div className="flex items-center gap-3">
            <Link
              to="/login?mode=register"
              className="hidden sm:inline-flex items-center gap-1.5 px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white text-sm font-semibold rounded-full transition-colors"
            >
              <Sparkles className="w-4 h-4" />
              Essai gratuit 7 jours
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

      {/* ── Breadcrumbs visibles ── */}
      <div className="bg-mono-1000 border-b border-mono-900 py-3 px-4">
        <div className="max-w-5xl mx-auto text-xs text-mono-500 flex items-center gap-2 flex-wrap">
          <Link to="/" className="hover:text-teal-600">Accueil</Link>
          <span>/</span>
          <Link to="/blog" className="hover:text-teal-600">Comparatifs</Link>
          <span>/</span>
          <span className="text-mono-100 font-medium">Comparatif logiciels restaurant 2026</span>
        </div>
      </div>

      {/* ── Hero / H1 ── */}
      <BlogArticleHero
        category="Comparatif"
        readTime="18 min"
        date="Mai 2026"
        title="Comparatif logiciels restaurant 2026 : 12 outils analysés"
        accentWord="12 outils analysés"
        subtitle="Vous cherchez un logiciel pour piloter votre restaurant en 2026 ? Voici un comparatif honnête et factuel de 12 outils du marché (RestauMargin, Lightspeed, Zenchef, Innovorder, Hubrise, TheFork, L'Addition, Tiller, Sunday, Marketman, Easilys, Deliverect) sur 15 critères, avec des recommandations par profil de restaurateur."
      />

      {/* ── Contenu principal ── */}
      <main className="max-w-5xl mx-auto px-6 sm:px-10 lg:px-12 pb-24 pt-8 bg-white relative z-10 rounded-t-3xl shadow-xl">

        <BlogAuthor publishedDate="2026-05-26" readTime="18 min" variant="header" />

        {/* ── TL;DR ── */}
        <div className="mt-10 bg-gradient-to-br from-teal-600 to-teal-700 rounded-3xl p-6 sm:p-8 text-white shadow-xl">
          <div className="flex items-center gap-2 mb-3">
            <Zap className="w-5 h-5" />
            <span className="text-xs font-bold uppercase tracking-wider text-teal-100">En 60 secondes</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold mb-4">
            Le verdict en 60 secondes
          </h2>
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-5 space-y-3 text-sm sm:text-base">
            <p className="leading-relaxed">
              <strong className="text-white">Il n'existe pas de logiciel restaurant universellement supérieur.</strong> Le bon choix dépend de votre profil (indépendant, gastro, multi-resto, dark kitchen, brasserie) et de votre priorité (marges, réservations, livraison, encaissement).
            </p>
            <p className="leading-relaxed">
              <strong className="text-white">Notre approche :</strong> combiner 2 à 3 outils spécialisés plutôt que chercher un tout-en-un médiocre. Budget réaliste : 60 à 250 EUR/mois selon la taille.
            </p>
            <p className="leading-relaxed pt-2 border-t border-white/20">
              <strong className="text-white">RestauMargin</strong> (29 EUR/mois) excelle sur la gestion des marges et du food cost. Pour les réservations, la caisse et la livraison, d'autres outils sont meilleurs. Le combo le plus fréquent chez nos clients : <strong>RestauMargin + L'Addition + TheFork</strong>.
            </p>
          </div>
        </div>

        {/* ── Sommaire ── */}
        <nav className="my-12 bg-mono-1000 border border-mono-900 rounded-2xl p-6 sm:p-8">
          <h2 className="text-lg font-bold text-mono-100 mb-4 flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-teal-600" />
            Sommaire
          </h2>
          <ol className="space-y-2 text-sm sm:text-base text-mono-350">
            {[
              { href: '#intro', label: 'Pourquoi choisir le bon logiciel restaurant' },
              { href: '#methodo', label: 'Méthodologie : 15 critères analysés' },
              { href: '#tableau', label: 'Tableau comparatif des 12 outils' },
              { href: '#top3', label: 'Top 3 par catégorie de besoin' },
              { href: '#profils', label: 'Quel logiciel pour quel profil de restaurateur' },
              { href: '#pricing', label: 'Tableau des prix mensuels' },
              { href: '#tendances', label: 'Tendances 2026 : IA, API, mobile, durabilité' },
              { href: '#faq', label: 'Questions fréquentes' },
              { href: '#cta', label: 'Tester RestauMargin gratuitement' },
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

        {/* ═════════════ SECTION 1 : INTRO ═════════════ */}
        <section id="intro" className="mb-16">
          <SectionHeading icon={<TrendingUp className="w-6 h-6" />} number="1">
            Pourquoi choisir le bon logiciel restaurant
          </SectionHeading>

          <div className="prose-content">
            <p>
              En 2026, un restaurant moyen utilise <strong>4 à 6 logiciels différents</strong> au quotidien :
              une caisse, un système de réservation, un outil de gestion des marges, un connecteur livraison,
              parfois un outil de planning et un CRM. Le marché compte plus de 80 éditeurs français et
              internationaux qui se disputent ce stack. Faire le mauvais choix coûte cher : un mauvais POS
              ralentit le service, un outil de gestion mal connecté fait perdre des heures de saisie manuelle,
              et une plateforme de réservation chère sans valeur ajoutée grignote la marge.
            </p>
            <p>
              Notre objectif avec ce comparatif est de donner une <strong>lecture honnête</strong> de 12 outils
              majeurs du marché en 2026. Nous présentons RestauMargin comme excellent sur son scope (gestion des
              marges, food cost, fiches techniques), mais pas comme une solution magique qui remplacerait tous
              les autres outils. La vraie question n'est pas "quel est le meilleur logiciel", mais "quelle est
              la meilleure combinaison pour mon besoin".
            </p>
          </div>

          <div className="grid gap-5 sm:grid-cols-3 mt-8">
            <ReasonCard
              icon={<DollarSign className="w-6 h-6" />}
              title="L'impact financier"
              desc="Un mauvais stack logiciel coûte facilement 200 EUR/mois inutiles (fonctions doublonnées, abonnements non utilisés). Sur 5 ans, cela représente 12 000 EUR perdus."
            />
            <ReasonCard
              icon={<AlertTriangle className="w-6 h-6" />}
              title="Le verrouillage"
              desc="Certains éditeurs vous enferment dans un format propriétaire. Changer d'outil 2 ans plus tard devient un cauchemar de migration de données."
            />
            <ReasonCard
              icon={<Zap className="w-6 h-6" />}
              title="La productivité"
              desc="Un bon stack libère 5 à 10 heures par semaine de saisie manuelle. Sur un cuisinier ou un gérant, c'est l'équivalent d'une demi-journée de productivité opérationnelle."
            />
          </div>

          <div className="prose-content mt-8">
            <p>
              La bonne approche est <strong>modulaire et progressive</strong>. Démarrer avec 2 ou 3 outils
              essentiels (caisse + marges + réservations), valider qu'ils sont utilisés au quotidien, puis
              ajouter des modules complémentaires selon l'évolution de l'activité (livraison, planning, RH).
              Évitez les suites "tout-en-un" promettant de tout faire : elles sont presque toujours moins
              performantes sur chaque dimension que des outils spécialisés bien intégrés.
            </p>
          </div>
        </section>

        {/* ═════════════ SECTION 2 : MÉTHODO ═════════════ */}
        <section id="methodo" className="mb-16">
          <SectionHeading icon={<Layers className="w-6 h-6" />} number="2">
            Méthodologie : 15 critères analysés
          </SectionHeading>

          <div className="prose-content">
            <p>
              Pour comparer les 12 outils de manière équitable, nous avons retenu 15 critères regroupés en
              cinq catégories. Chaque outil est noté sur sa <strong>présence native</strong> de la
              fonctionnalité, pas sur une appréciation qualitative subjective.
            </p>
          </div>

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 mt-8">
            <CriteriaCard
              icon={<DollarSign className="w-6 h-6" />}
              title="Économie"
              items={['Prix mensuel entrée', 'Prix annuel cumulé', 'Essai gratuit ou démo']}
            />
            <CriteriaCard
              icon={<PieChart className="w-6 h-6" />}
              title="Gestion opérationnelle"
              items={['Food cost natif', 'Fiches techniques', 'Mercuriale fournisseurs']}
            />
            <CriteriaCard
              icon={<Building2 className="w-6 h-6" />}
              title="Acquisition client"
              items={['Réservations en ligne', 'Marketing email/SMS', 'Site web restaurant']}
            />
            <CriteriaCard
              icon={<Truck className="w-6 h-6" />}
              title="Opérationnel terrain"
              items={['POS / caisse certifiée', 'Connecteurs livraison', 'Multi-restaurant']}
            />
            <CriteriaCard
              icon={<Smartphone className="w-6 h-6" />}
              title="Expérience"
              items={['App mobile native', 'Support français', 'Note utilisateur moyenne']}
            />
            <CriteriaCard
              icon={<Cpu className="w-6 h-6" />}
              title="Innovation"
              items={['IA intégrée', 'API publique', 'Roadmap 2026']}
            />
          </div>

          <Callout type="info">
            <strong>Sources et fiabilité :</strong> les tarifs et fonctionnalités proviennent des sites
            officiels des éditeurs, complétés par les avis utilisateurs publics (Capterra, GetApp,
            G2) et nos propres tests de produits en mai 2026. Les prix peuvent évoluer ; vérifiez
            toujours sur le site de l'éditeur avant de souscrire.
          </Callout>
        </section>

        {/* ═════════════ SECTION 3 : TABLEAU MEGA ═════════════ */}
        <section id="tableau" className="mb-16">
          <SectionHeading icon={<Scale className="w-6 h-6" />} number="3">
            Tableau comparatif des 12 outils
          </SectionHeading>

          <div className="prose-content">
            <p>
              Voici la vue d'ensemble du marché en mai 2026. Cliquez sur les en-têtes de colonnes pour
              comprendre chaque critère. Les notes proviennent des moyennes pondérées sur les principales
              plateformes d'avis utilisateurs (Capterra, G2, GetApp), mises à jour mars-mai 2026.
            </p>
          </div>

          <div className="mt-8 overflow-x-auto rounded-2xl border border-mono-900">
            <table className="w-full text-xs sm:text-sm min-w-[1100px]">
              <thead>
                <tr className="bg-mono-950 text-mono-100">
                  <th className="text-left py-4 px-3 font-bold sticky left-0 bg-mono-950 z-10">Logiciel</th>
                  <th className="text-center py-4 px-3 font-bold">Prix /mois</th>
                  <th className="text-left py-4 px-3 font-bold">Spécialité</th>
                  <th className="text-center py-4 px-3 font-bold">Food cost</th>
                  <th className="text-center py-4 px-3 font-bold">POS</th>
                  <th className="text-center py-4 px-3 font-bold">Résa</th>
                  <th className="text-center py-4 px-3 font-bold">Livraison</th>
                  <th className="text-center py-4 px-3 font-bold">IA</th>
                  <th className="text-center py-4 px-3 font-bold">Multi-resto</th>
                  <th className="text-center py-4 px-3 font-bold">Mobile</th>
                  <th className="text-center py-4 px-3 font-bold">FR</th>
                  <th className="text-center py-4 px-3 font-bold">Note</th>
                </tr>
              </thead>
              <tbody className="bg-white">
                {tools.map((t, i) => (
                  <ToolRow key={i} tool={t} highlight={t.name === 'RestauMargin'} />
                ))}
              </tbody>
            </table>
          </div>

          <Callout type="info">
            <strong>Lecture du tableau :</strong> coche verte = fonctionnalité native et mature ; cercle
            orange = présente mais limitée ou en option payante ; croix grise = absente du produit. La
            ligne RestauMargin est surlignée car c'est notre produit, mais les notes restent objectives
            (moyennes utilisateurs publiques).
          </Callout>
        </section>

        {/* ═════════════ SECTION 4 : TOP 3 PAR CATÉGORIE ═════════════ */}
        <section id="top3" className="mb-16">
          <SectionHeading icon={<Trophy className="w-6 h-6" />} number="4">
            Top 3 par catégorie de besoin
          </SectionHeading>

          <div className="prose-content">
            <p>
              Plutôt qu'un classement global qui ne veut rien dire, voici le top 3 dans chacune des cinq
              grandes catégories fonctionnelles. Pour chaque catégorie, un seul outil est généralement
              suffisant : pas besoin d'avoir trois logiciels de caisse en parallèle.
            </p>
          </div>

          <div className="grid gap-6 mt-8">
            <CategoryCard
              icon={<PieChart className="w-6 h-6" />}
              category="Gestion marge / food cost"
              winners={[
                { name: 'RestauMargin', desc: '29 EUR/mois, IA intégrée, mercuriale, fiches techniques, scan factures OCR. Le meilleur rapport qualité/prix en français.' },
                { name: 'Marketman', desc: '149 EUR/mois, leader mondial du food cost, très complet mais cher et orienté chaînes US. Interface en anglais.' },
                { name: 'Easilys', desc: '149 EUR/mois, fort en collectivités et RHF (restauration hors foyer). Excellent pour cuisines centrales et écoles.' },
              ]}
            />
            <CategoryCard
              icon={<DollarSign className="w-6 h-6" />}
              category="POS / Caisse"
              winners={[
                { name: 'Lightspeed', desc: '69-89 EUR/mois, premium international, intégrations top, certifié NF525. Le choix sûr pour groupes et gastros.' },
                { name: "L'Addition", desc: '59 EUR/mois, leader français du POS restaurant, plus de 10 000 établissements, support FR irréprochable.' },
                { name: 'Tiller', desc: '69 EUR/mois, racheté par Sumup, fort sur bistrots, bars et tabacs-presse, simple à prendre en main.' },
              ]}
            />
            <CategoryCard
              icon={<Calendar className="w-6 h-6" />}
              category="Réservations"
              winners={[
                { name: 'Zenchef', desc: '89-189 EUR/mois, mature, marketing intégré, site web inclus. Le choix premium pour gastros et restaurants à fort volume.' },
                { name: 'TheFork', desc: 'Gratuit jusqu\'à un certain volume puis 79 EUR/mois, énorme audience marketplace, idéal pour acquisition client.' },
                { name: 'Resy', desc: 'Modèle freemium, mature aux USA, en croissance en France, design moderne, intégrations American Express.' },
              ]}
            />
            <CategoryCard
              icon={<Truck className="w-6 h-6" />}
              category="Livraison / intégrations"
              winners={[
                { name: 'Hubrise', desc: '69 EUR/mois, leader français des connecteurs livraison, brancher UberEats / Deliveroo / Just Eat en un clic.' },
                { name: 'Innovorder', desc: '99 EUR/mois, caisse + click & collect natifs + bornes commande, suite intégrée pour fast-food et casual.' },
                { name: 'Deliverect', desc: '89 EUR/mois, leader européen du middleware livraison, fort à l\'international, KDS (kitchen display) inclus.' },
              ]}
            />
            <CategoryCard
              icon={<Smartphone className="w-6 h-6" />}
              category="Mobile / kiosk"
              winners={[
                { name: 'Sunday', desc: '0 EUR + 1.4 % par transaction, paiement à table par QR code, expérience client moderne, déployé en France et UK.' },
                { name: 'Pi Electronique', desc: 'Bornes de commande et caisses tactiles spécialisées, fort sur boulangerie et brasserie volume, hardware robuste.' },
                { name: 'RestauMargin', desc: 'PWA mobile native avec mode kiosk balance Bluetooth pour pesage temps réel en cuisine. Inclus dès la formule Pro.' },
              ]}
            />
          </div>
        </section>

        {/* ═════════════ SECTION 5 : PROFILS RESTAURATEURS ═════════════ */}
        <section id="profils" className="mb-16">
          <SectionHeading icon={<Users className="w-6 h-6" />} number="5">
            Quel logiciel pour quel profil de restaurateur
          </SectionHeading>

          <div className="prose-content">
            <p>
              Voici les <strong>cinq profils de restaurateurs</strong> les plus fréquents et les
              combinaisons de logiciels que nous observons chez nos clients et que nous recommandons
              honnêtement. Ces combinaisons ne sont pas figées : adaptez selon vos volumes, votre
              ticket moyen et votre marge actuelle.
            </p>
          </div>

          <div className="grid gap-6 mt-8">
            <ScenarioCard
              badge="Profil 1"
              title="Restaurant indépendant, 1 établissement, 30 à 80 couverts/jour"
              recommendation={"RestauMargin + L'Addition"}
              recoColor="emerald"
              desc="Vous gérez seul ou à deux, votre priorité est la rentabilité quotidienne et un service fluide. RestauMargin Pro (29 EUR) pour les marges et le food cost, L'Addition (59 EUR) pour la caisse. Total : 88 EUR/mois. Réservations gérées par TheFork gratuit ou par téléphone. C'est le combo le plus fréquent chez nos clients indépendants."
            />
            <ScenarioCard
              badge="Profil 2"
              title="Gastronomique étoilé ou très haut de gamme"
              recommendation="RestauMargin + Zenchef + Lightspeed"
              recoColor="purple"
              desc="Votre ticket moyen est élevé (60 EUR et plus), vous avez besoin d'une gestion fine des marges (RestauMargin Business 79 EUR), d'un module réservation premium avec marketing (Zenchef Standard 139 EUR) et d'une caisse pro multi-postes (Lightspeed Pro 89 EUR). Total : 307 EUR/mois. C'est un investissement qui se rentabilise vite sur ce niveau de gamme."
            />
            <ScenarioCard
              badge="Profil 3"
              title="Groupe multi-restaurant, 3 à 10 établissements"
              recommendation="RestauMargin Business + Lightspeed"
              recoColor="blue"
              desc="Vous avez besoin d'une vue consolidée des marges et d'un benchmarking entre établissements (RestauMargin Business 79 EUR multi-resto), et d'une caisse capable de gérer plusieurs sites avec API ouverte (Lightspeed 89 EUR). Total : 168 EUR/mois pour le coeur du stack, à compléter par Zenchef si réservations centralisées nécessaires."
            />
            <ScenarioCard
              badge="Profil 4"
              title="Dark kitchen ou cuisine 100 % livraison"
              recommendation="RestauMargin + Hubrise + Deliverect"
              recoColor="emerald"
              desc="Pas de salle, pas de réservation, votre vie c'est UberEats, Deliveroo, Just Eat. Hubrise (69 EUR) ou Deliverect (89 EUR) pour centraliser les commandes en une seule interface KDS, RestauMargin (29 EUR) pour piloter le food cost très serré qui caractérise ce business. Total : 98 EUR/mois. Marge optimisée plat par plat critique pour rester rentable."
            />
            <ScenarioCard
              badge="Profil 5"
              title="Brasserie volume ou bistrot 100+ couverts/jour"
              recommendation={"RestauMargin + L'Addition + TheFork"}
              recoColor="blue"
              desc="Volume élevé, marge faible (entre 60 et 65 % de marge brute selon les cartes), un POS rapide est critique. L'Addition (59 EUR) éprouvé sur la brasserie française, RestauMargin (29 EUR) pour traquer chaque point de food cost, TheFork (gratuit) pour le walk-in et la visibilité Google. Total : 88 EUR/mois. Très bon ratio pour des établissements à fort débit."
            />
          </div>

          <Callout type="info">
            <strong>Notre engagement de transparence :</strong> aucun des éditeurs cités dans ce
            comparatif ne nous rémunère pour figurer dans ces recommandations. Nous citons les outils
            que nous voyons effectivement utilisés et appréciés par nos clients, parfois en
            complément de RestauMargin, parfois sans nous. L'objectif est que vous ayez le bon stack
            pour votre activité, pas que vous payiez RestauMargin par défaut.
          </Callout>
        </section>

        {/* ═════════════ SECTION 6 : TABLEAU PRICING ═════════════ */}
        <section id="pricing" className="mb-16">
          <SectionHeading icon={<DollarSign className="w-6 h-6" />} number="6">
            Tableau des prix mensuels
          </SectionHeading>

          <div className="prose-content">
            <p>
              Récapitulatif rapide des 12 outils par ordre croissant de tarif d'entrée de gamme.
              Attention : ces prix correspondent à la formule la plus basique. Les formules
              supérieures peuvent doubler ou tripler le tarif selon les fonctionnalités activées.
            </p>
          </div>

          <div className="mt-8 overflow-x-auto rounded-2xl border border-mono-900">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-mono-950 text-mono-100">
                  <th className="text-left py-4 px-4 font-bold">Logiciel</th>
                  <th className="text-right py-4 px-4 font-bold">Prix mensuel</th>
                  <th className="text-right py-4 px-4 font-bold">Prix annuel</th>
                  <th className="text-left py-4 px-4 font-bold">Modèle</th>
                </tr>
              </thead>
              <tbody className="text-mono-350">
                <PricingRow name="Sunday" monthly="0 EUR + 1.4 %" yearly="Variable" model="Commission sur transactions" highlight={false} />
                <PricingRow name="TheFork (basique)" monthly="0 EUR" yearly="0 EUR" model="Gratuit + commissions sur couverts" highlight={false} />
                <PricingRow name="RestauMargin Pro" monthly="29 EUR" yearly="348 EUR" model="Abonnement, essai 7j gratuit" highlight={true} />
                <PricingRow name="L'Addition" monthly="59 EUR" yearly="708 EUR" model="Abonnement + matériel à part" highlight={false} />
                <PricingRow name="Tiller" monthly="69 EUR" yearly="828 EUR" model="Abonnement + matériel à part" highlight={false} />
                <PricingRow name="Lightspeed" monthly="69 EUR" yearly="828 EUR" model="Abonnement, modulaire" highlight={false} />
                <PricingRow name="Hubrise" monthly="69 EUR" yearly="828 EUR" model="Abonnement par canal" highlight={false} />
                <PricingRow name="RestauMargin Business" monthly="79 EUR" yearly="948 EUR" model="Abonnement multi-resto" highlight={true} />
                <PricingRow name="Zenchef Essential" monthly="89 EUR" yearly="1 068 EUR" model="Abonnement, démo obligatoire" highlight={false} />
                <PricingRow name="Deliverect" monthly="89 EUR" yearly="1 068 EUR" model="Abonnement par localisation" highlight={false} />
                <PricingRow name="Innovorder" monthly="99 EUR" yearly="1 188 EUR" model="Abonnement + matériel" highlight={false} />
                <PricingRow name="Marketman" monthly="149 EUR" yearly="1 788 EUR" model="Abonnement, anglais" highlight={false} />
                <PricingRow name="Easilys" monthly="149 EUR" yearly="1 788 EUR" model="Abonnement, devis" highlight={false} />
              </tbody>
            </table>
          </div>

          <div className="prose-content mt-8">
            <p>
              Ces tarifs sont à pondérer par les <strong>coûts cachés</strong> : matériel (lecteurs de
              carte, tablettes, imprimantes thermiques), frais d'onboarding, modules optionnels, support
              prioritaire. Un POS comme Lightspeed peut afficher 69 EUR/mois sur le papier mais coûter
              130 EUR/mois en réalité avec matériel financé et options de paiement intégrées. Demandez
              toujours un devis total sur 12 mois incluant tous les frais.
            </p>
            <p>
              Notre conviction : le bon stack en 2026 coûte entre <strong>60 et 250 EUR/mois</strong>
              pour 80 % des restaurants français. Au-delà, vous payez probablement pour des fonctions
              que vous n'utilisez pas. En dessous, vous accumulez des coûts cachés (temps perdu, erreurs
              de saisie, marge non pilotée).
            </p>
          </div>
        </section>

        {/* ═════════════ SECTION 7 : TENDANCES 2026 ═════════════ */}
        <section id="tendances" className="mb-16">
          <SectionHeading icon={<Sparkles className="w-6 h-6" />} number="7">
            Tendances 2026 : IA, API, mobile, durabilité
          </SectionHeading>

          <div className="prose-content">
            <p>
              Le marché des logiciels restaurant traverse une phase d'innovation accélérée en 2026.
              Quatre tendances structurent les choix produit chez tous les éditeurs sérieux. Comprendre
              ces tendances vous aide à anticiper l'évolution de vos outils sur les 3 à 5 prochaines
              années.
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 mt-8">
            <TrendCard
              icon={<Cpu className="w-6 h-6" />}
              title="L'IA appliquée et utile"
              desc="L'IA générative arrive enfin avec des cas d'usage concrets. Détection automatique de hausses de prix fournisseurs (RestauMargin), génération de descriptions de plats (Hubrise), prédiction de demande pour les commandes (Easilys), OCR de factures (RestauMargin, Marketman). On passe du gadget marketing à des gains de temps mesurables (2 à 5h/semaine économisées)."
            />
            <TrendCard
              icon={<Layers className="w-6 h-6" />}
              title="Les API ouvertes obligatoires"
              desc="Les éditeurs qui refusent de partager leurs données sont en perte de vitesse. Lightspeed, Hubrise, RestauMargin, Sumup ont tous des API publiques documentées. C'est devenu un critère décisif : vérifiez systématiquement la qualité de l'API et la liste des intégrations natives avant d'acheter. Un outil isolé en 2026 est un outil mort à 3 ans."
            />
            <TrendCard
              icon={<Smartphone className="w-6 h-6" />}
              title="Le mobile-first total"
              desc="Plus aucun outil pro n'est uniquement desktop. Les meilleurs sont des PWA (Progressive Web App) qui fonctionnent identiquement sur Mac, PC, tablette Samsung et iPhone. Le mode hors-ligne devient un standard pour ne pas dépendre du WiFi du restaurant. RestauMargin, Lightspeed et Sunday sont exemplaires sur ce point."
            />
            <TrendCard
              icon={<Award className="w-6 h-6" />}
              title="La durabilité et les certifications"
              desc="Les obligations sur le gaspillage alimentaire (loi AGEC), le tri à la source des biodéchets (obligation 2024 pour tous) et la traçabilité carbone des plats poussent les éditeurs à intégrer des modules dédiés. Easilys, Marketman et RestauMargin proposent déjà des indicateurs de gaspillage et d'empreinte carbone par recette."
            />
          </div>

          <Callout type="info">
            <strong>Notre prédiction :</strong> d'ici 2028, le marché aura probablement consolidé 3
            à 5 "hubs" majeurs (un par fonction) avec un écosystème d'apps connectées par API. Le modèle
            "tout-en-un" propriétaire est en déclin. Mieux vaut adopter dès maintenant la logique
            modulaire que d'investir dans un outil monolithique qui peinera à s'intégrer demain.
          </Callout>
        </section>

        <BlogAuthor publishedDate="2026-05-26" readTime="18 min" variant="footer" />

        {/* ═════════════ FAQ visible ═════════════ */}
        <section id="faq" className="mb-16">
          <h2 className="text-2xl font-bold text-mono-100 mb-6">Questions fréquentes</h2>
          <div className="space-y-4">
            {faqItems.map((item, i) => (
              <FAQItem key={i} q={item.question} a={item.answer} />
            ))}
          </div>
        </section>

        {/* ═════════════ CTA ═════════════ */}
        <section id="cta" className="mb-16">
          <div className="bg-gradient-to-br from-teal-600 to-teal-700 rounded-3xl p-8 sm:p-12 text-center">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white mb-4">
              Testez RestauMargin gratuitement pendant 7 jours
            </h2>
            <p className="text-teal-100 text-lg max-w-xl mx-auto mb-3 leading-relaxed">
              Si la gestion des marges et du food cost est votre priorité, RestauMargin est probablement
              la meilleure pièce de votre stack 2026. Testez sans carte bancaire et combinez avec les
              outils complémentaires de votre choix.
            </p>
            <p className="text-teal-50 text-base max-w-xl mx-auto mb-8">
              <strong>29 EUR/mois</strong> à partir du 8e jour si vous décidez de continuer.
              Annulation en un clic, export complet de vos données à tout moment.
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
                to="/pricing"
                className="inline-flex items-center gap-2 px-8 py-4 border-2 border-white/30 text-white font-semibold rounded-full hover:bg-white/10 transition-colors"
              >
                <DollarSign className="w-5 h-5" />
                Voir les tarifs
              </Link>
            </div>
          </div>
        </section>

        {/* ═════════════ Pour aller plus loin ═════════════ */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold text-mono-100 mb-6">Pour aller plus loin</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Link
              to="/alternative-zenchef"
              className="bg-mono-1000 border border-mono-900 rounded-2xl p-5 hover:border-teal-300 hover:shadow-sm transition-all group"
            >
              <h3 className="font-semibold text-mono-100 mb-1.5 group-hover:text-teal-700 transition-colors">
                Alternative Zenchef
              </h3>
              <p className="text-xs text-mono-500">Comparatif détaillé Zenchef vs RestauMargin : prix, fonctionnalités, cas d'usage.</p>
            </Link>
            <Link
              to="/alternative-innovorder"
              className="bg-mono-1000 border border-mono-900 rounded-2xl p-5 hover:border-teal-300 hover:shadow-sm transition-all group"
            >
              <h3 className="font-semibold text-mono-100 mb-1.5 group-hover:text-teal-700 transition-colors">
                Alternative Innovorder
              </h3>
              <p className="text-xs text-mono-500">RestauMargin vs Innovorder : POS, click & collect, gestion des marges.</p>
            </Link>
            <Link
              to="/alternative-hubrise"
              className="bg-mono-1000 border border-mono-900 rounded-2xl p-5 hover:border-teal-300 hover:shadow-sm transition-all group"
            >
              <h3 className="font-semibold text-mono-100 mb-1.5 group-hover:text-teal-700 transition-colors">
                Alternative Hubrise
              </h3>
              <p className="text-xs text-mono-500">Comparatif Hubrise vs RestauMargin : livraison vs marges, complémentarités.</p>
            </Link>
            <Link
              to="/blog/logiciel-gestion-restaurant"
              className="bg-mono-1000 border border-mono-900 rounded-2xl p-5 hover:border-teal-300 hover:shadow-sm transition-all group"
            >
              <h3 className="font-semibold text-mono-100 mb-1.5 group-hover:text-teal-700 transition-colors">
                Guide logiciel gestion restaurant
              </h3>
              <p className="text-xs text-mono-500">Article de fond sur ce qu'un bon logiciel de gestion doit faire en 2026.</p>
            </Link>
            <Link
              to="/pricing"
              className="bg-mono-1000 border border-mono-900 rounded-2xl p-5 hover:border-teal-300 hover:shadow-sm transition-all group"
            >
              <h3 className="font-semibold text-mono-100 mb-1.5 group-hover:text-teal-700 transition-colors">
                Tarifs RestauMargin
              </h3>
              <p className="text-xs text-mono-500">Formules Pro (29 EUR) et Business (79 EUR) en détail, comparaison fonctionnalités.</p>
            </Link>
            <Link
              to="/blog/calcul-marge-restaurant"
              className="bg-mono-1000 border border-mono-900 rounded-2xl p-5 hover:border-teal-300 hover:shadow-sm transition-all group"
            >
              <h3 className="font-semibold text-mono-100 mb-1.5 group-hover:text-teal-700 transition-colors">
                Calcul de marge restaurant
              </h3>
              <p className="text-xs text-mono-500">Guide complet : food cost, formules et benchmarks par type d'établissement.</p>
            </Link>
            <Link
              to="/blog/logiciel-caisse-restaurant"
              className="bg-mono-1000 border border-mono-900 rounded-2xl p-5 hover:border-teal-300 hover:shadow-sm transition-all group"
            >
              <h3 className="font-semibold text-mono-100 mb-1.5 group-hover:text-teal-700 transition-colors">
                Logiciel de caisse restaurant
              </h3>
              <p className="text-xs text-mono-500">Comparatif des principaux POS du marché : Lightspeed, L'Addition, Tiller, Sumup.</p>
            </Link>
            <Link
              to="/login?mode=register"
              className="bg-mono-1000 border border-mono-900 rounded-2xl p-5 hover:border-teal-300 hover:shadow-sm transition-all group"
            >
              <h3 className="font-semibold text-mono-100 mb-1.5 group-hover:text-teal-700 transition-colors">
                Créer mon compte
              </h3>
              <p className="text-xs text-mono-500">Essai gratuit 7 jours, sans carte bancaire, accès toutes fonctionnalités.</p>
            </Link>
          </div>
        </section>

        </article>

      </main>

      {/* ── Footer ── */}
      <footer className="bg-mono-1000 border-t border-mono-900 py-12 px-4">
        <div className="max-w-5xl mx-auto text-center text-sm text-mono-500">
          <Link to="/landing" className="flex items-center justify-center gap-2 text-mono-100 font-bold text-lg mb-4">
            <ChefHat className="w-6 h-6 text-teal-600" />
            RestauMargin
          </Link>
          <p className="mb-4">La plateforme de gestion de marge pour les restaurateurs.</p>
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

function ReasonCard({ icon, title, desc }: { icon: React.ReactNode; title: string; desc: string }) {
  return (
    <div className="bg-white border border-mono-900 rounded-2xl p-6">
      <div className="w-10 h-10 bg-amber-100 text-amber-700 rounded-xl flex items-center justify-center mb-3">
        {icon}
      </div>
      <h3 className="font-bold text-mono-100 mb-2">{title}</h3>
      <p className="text-sm text-mono-400 leading-relaxed">{desc}</p>
    </div>
  );
}

function CriteriaCard({ icon, title, items }: { icon: React.ReactNode; title: string; items: string[] }) {
  return (
    <div className="bg-white border border-mono-900 rounded-2xl p-5">
      <div className="flex items-center gap-2 mb-3">
        <div className="w-9 h-9 bg-teal-100 text-teal-700 rounded-lg flex items-center justify-center shrink-0">
          {icon}
        </div>
        <h3 className="font-bold text-mono-100">{title}</h3>
      </div>
      <ul className="space-y-1.5 text-sm text-mono-400">
        {items.map((it, i) => (
          <li key={i} className="flex items-start gap-2">
            <CheckCircle className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
            <span>{it}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function ToolRow({ tool, highlight }: { tool: ToolData; highlight: boolean }) {
  const renderStatus = (status: 'oui' | 'non' | 'partiel') => {
    if (status === 'oui') return <CheckCircle className="w-5 h-5 mx-auto text-emerald-600" />;
    if (status === 'partiel') return <div className="w-4 h-4 mx-auto rounded-full bg-amber-400" title="Partiel ou en option" />;
    return <XCircle className="w-5 h-5 mx-auto text-mono-700" />;
  };

  return (
    <tr className={`border-t border-mono-900 hover:bg-mono-1000 transition-colors ${highlight ? 'bg-emerald-50/40' : ''}`}>
      <td className={`py-3 px-3 font-semibold sticky left-0 z-10 ${highlight ? 'bg-emerald-50 text-emerald-900' : 'bg-white text-mono-100'}`}>
        {highlight && <span className="inline-block mr-1.5">★</span>}
        {tool.name}
      </td>
      <td className="py-3 px-3 text-center font-medium">{tool.price}</td>
      <td className="py-3 px-3 text-mono-400">{tool.speciality}</td>
      <td className="py-3 px-3 text-center">{renderStatus(tool.foodCost)}</td>
      <td className="py-3 px-3 text-center">{renderStatus(tool.pos)}</td>
      <td className="py-3 px-3 text-center">{renderStatus(tool.reservations)}</td>
      <td className="py-3 px-3 text-center">{renderStatus(tool.livraison)}</td>
      <td className="py-3 px-3 text-center">{renderStatus(tool.ia)}</td>
      <td className="py-3 px-3 text-center">{renderStatus(tool.multiResto)}</td>
      <td className="py-3 px-3 text-center">{renderStatus(tool.mobile)}</td>
      <td className="py-3 px-3 text-center">{renderStatus(tool.supportFr)}</td>
      <td className="py-3 px-3 text-center font-semibold text-mono-100">
        <div className="flex items-center justify-center gap-1">
          <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
          {tool.note}
        </div>
      </td>
    </tr>
  );
}

function CategoryCard({ icon, category, winners }: {
  icon: React.ReactNode;
  category: string;
  winners: { name: string; desc: string }[];
}) {
  return (
    <div className="bg-white border border-mono-900 rounded-3xl p-6 sm:p-8">
      <div className="flex items-center gap-3 mb-5">
        <div className="w-10 h-10 bg-teal-100 text-teal-700 rounded-xl flex items-center justify-center shrink-0">
          {icon}
        </div>
        <h3 className="text-xl font-bold text-mono-100">{category}</h3>
      </div>
      <div className="grid gap-3 sm:grid-cols-3">
        {winners.map((w, i) => (
          <div key={i} className="bg-mono-1000 border border-mono-900 rounded-xl p-4">
            <div className="flex items-center gap-2 mb-2">
              <div className={`w-6 h-6 rounded-full flex items-center justify-center text-white text-xs font-bold ${
                i === 0 ? 'bg-amber-500' : i === 1 ? 'bg-mono-500' : 'bg-amber-700'
              }`}>
                {i + 1}
              </div>
              <h4 className="font-bold text-mono-100">{w.name}</h4>
            </div>
            <p className="text-xs text-mono-400 leading-relaxed">{w.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function ScenarioCard({ badge, title, recommendation, recoColor, desc }: {
  badge: string;
  title: string;
  recommendation: string;
  recoColor: 'emerald' | 'blue' | 'purple';
  desc: string;
}) {
  const colors = {
    emerald: { bg: 'bg-emerald-50', border: 'border-emerald-200', text: 'text-emerald-900', badge: 'bg-emerald-600' },
    blue: { bg: 'bg-blue-50', border: 'border-blue-200', text: 'text-blue-900', badge: 'bg-blue-600' },
    purple: { bg: 'bg-purple-50', border: 'border-purple-200', text: 'text-purple-900', badge: 'bg-purple-600' },
  };
  const c = colors[recoColor];

  return (
    <div className={`${c.bg} border ${c.border} rounded-3xl p-6 sm:p-8`}>
      <div className="flex items-center gap-3 mb-3 flex-wrap">
        <span className={`${c.badge} text-white text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full`}>
          {badge}
        </span>
        <span className={`${c.text} text-xs font-semibold flex items-center gap-1.5`}>
          <Target className="w-3.5 h-3.5" />
          Reco : {recommendation}
        </span>
      </div>
      <h3 className={`font-bold text-lg ${c.text} mb-3`}>{title}</h3>
      <p className="text-sm text-mono-400 leading-relaxed">{desc}</p>
    </div>
  );
}

function PricingRow({ name, monthly, yearly, model, highlight }: {
  name: string;
  monthly: string;
  yearly: string;
  model: string;
  highlight: boolean;
}) {
  return (
    <tr className={`border-t border-mono-900 ${highlight ? 'bg-emerald-50/60' : 'bg-white'}`}>
      <td className={`py-3 px-4 font-bold ${highlight ? 'text-emerald-900' : 'text-mono-100'}`}>
        {highlight && '★ '}{name}
      </td>
      <td className={`py-3 px-4 text-right font-bold ${highlight ? 'text-emerald-900' : 'text-mono-100'}`}>{monthly}</td>
      <td className={`py-3 px-4 text-right ${highlight ? 'text-emerald-700' : 'text-mono-400'}`}>{yearly}</td>
      <td className={`py-3 px-4 text-xs ${highlight ? 'text-emerald-700' : 'text-mono-500'}`}>{model}</td>
    </tr>
  );
}

function TrendCard({ icon, title, desc }: { icon: React.ReactNode; title: string; desc: string }) {
  return (
    <div className="bg-white border border-mono-900 rounded-2xl p-6">
      <div className="w-10 h-10 bg-teal-100 text-teal-700 rounded-xl flex items-center justify-center mb-3">
        {icon}
      </div>
      <h3 className="font-bold text-mono-100 mb-2 text-lg">{title}</h3>
      <p className="text-sm text-mono-400 leading-relaxed">{desc}</p>
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
    <details className="bg-mono-1000 border border-mono-900 rounded-2xl group">
      <summary className="px-5 py-4 font-semibold text-mono-100 cursor-pointer select-none flex items-center justify-between hover:text-teal-700 transition-colors">
        {q}
        <ArrowRight className="w-4 h-4 text-mono-700 group-open:rotate-90 transition-transform" />
      </summary>
      <p className="px-5 pb-4 text-sm text-mono-400 leading-relaxed">{a}</p>
    </details>
  );
}
