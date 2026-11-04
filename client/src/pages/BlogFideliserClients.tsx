import { Link } from 'react-router-dom';
import {
  ChefHat,
  Heart,
  Users,
  TrendingUp,
  Star,
  Gift,
  BarChart2,
  ArrowRight,
  CheckCircle,
  AlertTriangle,
  Lightbulb,
  Mail,
  Smartphone,
  Calendar,
  Target,
  Zap,
  Award,
  Calculator,
  ListChecks,
  BookOpen,
  MessageSquare,
} from 'lucide-react';
import SEOHead, { buildFAQSchema, buildBreadcrumbSchema } from '../components/SEOHead';
import BlogAuthor from '../components/BlogAuthor';
import BlogArticleHero from '../components/blog/BlogArticleHero';

/* ═══════════════════════════════════════════════════════════════
   Blog SEO — "Fideliser ses clients restaurant : 12 strategies 2026"
   Mots-cles cibles : fidelisation clients restaurant + programme fidelite restaurant
   ~3 200 mots — light/dark mode, W&B, Tailwind, theme cinematic
   ═══════════════════════════════════════════════════════════════ */

const faqItems = [
  {
    question: "Quel programme de fidélité choisir pour un petit restaurant ?",
    answer:
      "Pour un restaurant de moins de 80 couverts, la carte tampon numérique (Fidme, Stampt, LoyalGuru) est idéale : simple à mettre en place, peu coûteuse (0-20 EUR/mois), elle couvre 80 % des besoins. Ajoutez un fichier client basique pour les anniversaires et vous tenez un programme très rentable sans complexité technique. Au-delà de 80 couverts ou avec une carte large, basculez vers un programme à points couplé à un CRM dédié.",
  },
  {
    question: "Comment collecter les emails de mes clients sans les agacer ?",
    answer:
      "Proposez une valeur claire en échange : -10 % sur la prochaine visite, un dessert offert au 3e passage, ou l'accès à la newsletter événements et menus privés. Le Wi-Fi conditionnel (email pour connexion) est la méthode la moins intrusive : taux de collecte 60-70 % en moyenne. À la réservation via TheFork ou Sevenrooms, vous récupérez aussi le contact automatiquement. Visez 30-40 % de votre clientèle en base CRM en 12 mois.",
  },
  {
    question: "La fidélisation fonctionne-t-elle pour les restaurants de passage ?",
    answer:
      "Moins bien qu'en restauration de quartier mais pas inutile. Concentrez-vous sur Google My Business, les avis Tripadvisor et un fort NPS : les touristes consultent massivement avant de choisir. Un programme rapide (QR code post-paiement -> -15 % au retour ou recommandation) reste pertinent : même 5 % de touristes qui reviennent représentent un CA précieux. Ne sous-estimez pas le bouche-à-oreille post-visite : 40 % des touristes recommandent leur meilleure adresse à leurs proches.",
  },
  {
    question: "Combien de temps pour voir les résultats d'un programme de fidélité ?",
    answer:
      "Comptez 3 mois pour les premières données significatives (collecte de base CRM utile), 6 mois pour un impact mesurable sur le CA, 12 mois pour atteindre un régime de croisière. Les restaurants qui abandonnent à 2 mois passent à côté des bénéfices : la fidélisation est un investissement de long terme. Indicateur clé à J+90 : au moins 25 % de votre clientèle identifiée en base. À J+180 : 15 % de revisites attribuées au programme.",
  },
  {
    question: "Combien doit coûter un programme de fidélité restaurant ?",
    answer:
      "Tablez sur 0,5 à 2 % du CA en coût total (technologie + récompenses). Outils : 0-150 EUR/mois selon le niveau (carte tampon gratuite vs CRM complet 80-150 EUR). Récompenses : la règle d'or est de céder 5 à 10 % de la valeur cumulée des achats. Sur un client qui dépense 360 EUR/an, c'est 18 à 36 EUR de récompense, soit un dessert offert, une bouteille de vin ou un avantage équivalent. ROI attendu : 4 à 7x sur 12 mois.",
  },
  {
    question: "Faut-il offrir des réductions ou des cadeaux pour fidéliser ?",
    answer:
      "Les cadeaux fonctionnent mieux que les réductions en restauration. Une réduction de 10 EUR perd sa valeur émotionnelle, alors qu'un dessert offert, un cocktail maison ou un accord mets-vins surprise créent une expérience memorisable. La règle : récompensez en produit (coût faible pour vous, valeur perçue élevée pour le client), pas en argent. Exception : les coupons de bienvenue (-15 % premier passage) sont efficaces pour déclencher la première visite.",
  },
  {
    question: "Comment relancer un client qui n'est pas revenu depuis 2 mois ?",
    answer:
      "Envoyez un SMS personnalisé (jamais une newsletter générique) entre J+45 et J+60 : 'Bonjour [Prénom], on ne vous a pas vu depuis le [dernier passage]. Notre nouveau menu de saison vous attend. Pour fetter votre retour : un cocktail maison offert sur votre prochaine visite.' Taux de conversion observé : 18-25 %. Au-delà de J+90, le client est statistiquement perdu : passez en mode reconquête avec une offre plus forte (-20 % sur le repas) mais sans abuser.",
  },
  {
    question: "Le programme de fidélité augmente-t-il vraiment le ticket moyen ?",
    answer:
      "Oui, de 8 à 15 % en moyenne selon les études Deloitte et Bond Brand Loyalty 2025. Un client en programme dépense davantage parce qu'il (1) fréquente plus souvent, (2) prend plus volontiers une boisson ou un dessert pour cumuler des points, (3) est moins sensible au prix car il est dans une logique de relation. Le ticket moyen des inscrits dépasse de 12 EUR celui des non-inscrits sur la moyenne du secteur.",
  },
  {
    question: "Comment intégrer le programme de fidélité avec le logiciel de caisse ?",
    answer:
      "La plupart des caisses modernes (Sumup, Tiller, Lightspeed, Square, Zelty, L'Addition) intègrent nativement des modules de fidélité ou se connectent via API à des outils dédiés (Como, Paytronix, LoyalGuru). L'intégration évite la double saisie et permet d'attribuer automatiquement les points au passage en caisse. Vérifiez que la connexion est bidirectionnelle : les données clients doivent remonter dans votre CRM pour les campagnes ciblées.",
  },
  {
    question: "Quelle différence entre fidélisation et acquisition client ?",
    answer:
      "Acquisition = faire venir un nouveau client (publicité, SEO, Google Ads, présence sur les plateformes). Coût moyen : 15-35 EUR par client acquis. Fidélisation = transformer un client existant en habitué rentable. Coût moyen : 3-7 EUR par client fidélisé. La littérature management converge sur un facteur 5 à 7 : il coûte 5 à 7 fois plus cher d'acquérir que de fidéliser. Allouez 70 % de votre budget marketing à la fidélisation, 30 % à l'acquisition.",
  },
];

export default function BlogFideliserClients() {
  return (
    <div className="min-h-screen" style={{ fontFamily: "'Inter', system-ui, sans-serif" }}>
      <SEOHead
        title="Fidéliser ses clients restaurant : 12 stratégies efficaces 2026"
        description="Programme fidélité restaurant, CRM, anniversaires, SMS, NPS, Google My Business : guide complet pour transformer vos clients de passage en habitués rentables. Cas chiffrés et ROI."
        path="/blog/fideliser-clients-restaurant-strategies"
        type="article"
        schema={[
          buildFAQSchema(faqItems),
          buildBreadcrumbSchema([
            { name: 'Accueil', url: 'https://www.restaumargin.fr/' },
            { name: 'Blog', url: 'https://www.restaumargin.fr/blog' },
            { name: 'Fidéliser ses clients restaurant', url: 'https://www.restaumargin.fr/blog/fideliser-clients-restaurant-strategies' },
          ]),
          {
            '@context': 'https://schema.org',
            '@type': 'HowTo',
            name: 'Comment créer un programme de fidélité restaurant rentable',
            description: 'Méthode pas-à-pas pour lancer un programme de fidélisation efficace dans un restaurant : choix du format, collecte de base CRM, mécaniques de récompense, mesure du ROI.',
            totalTime: 'PT90M',
            tool: ['CRM ou tableur structure', 'Outil de carte tampon numérique', 'Liste de clients existante', 'Caisse compatible'],
            step: [
              { '@type': 'HowToStep', name: 'Définir l\'objectif et le KPI cible', text: 'Fixez un objectif chiffré : passer de 25 % à 40 % de taux de revisite en 12 mois. Ce KPI guide ensuite toutes vos décisions sur le format et les récompenses.' },
              { '@type': 'HowToStep', name: 'Choisir le format adapté à votre volume', text: 'Moins de 80 couverts/jour : carte tampon numérique. 80 à 200 couverts : programme à points. Plus de 200 ou positionnement premium : abonnement mensuel ou programme hybride.' },
              { '@type': 'HowToStep', name: 'Constituer la base CRM', text: 'Collectez nom, email, téléphone et date d\'anniversaire au moment de la réservation, du paiement, ou via le Wi-Fi conditionnel. Visez 30 % de votre clientèle en base en 6 mois.' },
              { '@type': 'HowToStep', name: 'Définir les mécaniques de récompense', text: 'Cédez 5 à 10 % de la valeur cumulée des achats. Privilégiez les cadeaux (dessert, cocktail, accord mets-vins) aux réductions en euros. Récompensez aussi le parrainage.' },
              { '@type': 'HowToStep', name: 'Lancer les campagnes de relance ciblées', text: 'SMS d\'anniversaire 7 jours avant, relance des clients inactifs entre J+45 et J+60, invitation aux nouveautés carte pour les VIP. Maximum 1 message par mois et par client.' },
              { '@type': 'HowToStep', name: 'Mesurer et optimiser tous les 90 jours', text: 'Suivez taux de revisite, LTV, NPS, et coût d\'acquisition vs rétention. Ajustez les récompenses et la fréquence des relances en fonction des résultats observés par segment.' },
            ],
          },
          {
            '@context': 'https://schema.org',
            '@type': 'Article',
            headline: 'Fidéliser ses clients restaurant : 12 stratégies efficaces en 2026',
            description: 'Guide complet de la fidélisation clients restaurant : programmes de fidélité, CRM, anniversaires, SMS marketing, Google My Business, NPS. Tactiques concrètes, cas chiffrés et ROI.',
            image: 'https://www.restaumargin.fr/og-image.png',
            author: { '@type': 'Organization', name: 'RestauMargin', url: 'https://www.restaumargin.fr' },
            publisher: {
              '@type': 'Organization',
              name: 'RestauMargin',
              logo: { '@type': 'ImageObject', url: 'https://www.restaumargin.fr/icon-512.png' },
            },
            datePublished: '2026-05-08',
            dateModified: '2026-05-26',
            wordCount: 3200,
            inLanguage: 'fr-FR',
            mainEntityOfPage: { '@type': 'WebPage', '@id': 'https://www.restaumargin.fr/blog/fideliser-clients-restaurant-strategies' },
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
          <span className="text-mono-100 font-medium">Fidéliser ses clients restaurant</span>
        </div>
      </div>

      {/* Hero */}
      <BlogArticleHero
        category="Marketing"
        readTime="14 min"
        date="Mai 2026"
        title="Fidéliser ses clients restaurant : 12 stratégies efficaces en 2026"
        accentWord="Fidéliser"
        subtitle="Acquérir un nouveau client coûte 5 à 7 fois plus cher que de fidéliser un client existant. Découvrez les programmes de fidélité, les leviers CRM et les tactiques concrètes pour transformer vos clients de passage en habitués rentables."
      />

      {/* Contenu principal */}
      <main className="max-w-4xl mx-auto px-6 sm:px-10 lg:px-12 pb-24 pt-8 bg-white relative z-10 rounded-t-3xl shadow-xl">

        <BlogAuthor publishedDate="2026-05-08" updatedDate="2026-05-26" readTime="14 min" variant="header" />

        {/* Encadre formule rapide (featured snippet) */}
        <div className="mt-10 bg-gradient-to-br from-teal-600 to-teal-700 rounded-2xl p-6 sm:p-8 text-white shadow-xl">
          <div className="flex items-center gap-2 mb-3">
            <Zap className="w-5 h-5" />
            <span className="text-xs font-bold uppercase tracking-wider text-teal-100">Les chiffres clés de la fidélisation restaurant</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold mb-4">
            4 statistiques à retenir
          </h2>
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-5 space-y-3 text-sm sm:text-base">
            <div className="flex items-start gap-2">
              <span className="text-teal-200 font-bold">1.</span>
              <span>Un client fidèle dépense <strong className="text-white">67 % de plus</strong> qu'un nouveau client (Bond Brand Loyalty 2025).</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-teal-200 font-bold">2.</span>
              <span>Augmenter la rétention de <strong className="text-white">5 %</strong> = augmentation des profits de <strong className="text-white">25 à 95 %</strong> (Harvard Business Review).</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-teal-200 font-bold">3.</span>
              <span>Le bouche-à-oreille génère <strong className="text-white">30 à 40 %</strong> des nouvelles réservations en restauration indépendante (GIRA Conseil 2025).</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-teal-200 font-bold">4.</span>
              <span>ROI moyen d'un programme de fidélité restaurant : <strong className="text-white">4 à 7x</strong> sur 12 mois.</span>
            </div>
          </div>
          <p className="mt-4 text-teal-100 text-sm">
            La fidélisation clients restaurant n'est pas une option : c'est le levier de rentabilité le plus puissant et le moins exploité.
          </p>
        </div>

        {/* Table des matieres */}
        <nav className="my-12 bg-mono-1000 border border-mono-900 rounded-2xl p-6 sm:p-8">
          <h2 className="text-lg font-bold text-mono-100 mb-4 flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-teal-600" />
            Sommaire
          </h2>
          <ol className="space-y-2 text-sm sm:text-base text-mono-350">
            {[
              { href: '#pourquoi', label: 'Pourquoi la fidélisation est cruciale en restauration' },
              { href: '#economics', label: 'Le calcul économique : LTV et ROI fidélisation' },
              { href: '#programmes', label: 'Les 3 formats de programme fidélité restaurant' },
              { href: '#howto', label: 'Comment créer son programme en 6 étapes' },
              { href: '#crm', label: 'CRM et collecte de données clients' },
              { href: '#anniversaires', label: 'Anniversaires et occasions spéciales : le levier ROI' },
              { href: '#sms', label: 'SMS marketing et campagnes de relance' },
              { href: '#google', label: 'Google My Business et avis en ligne' },
              { href: '#kpi', label: 'Les 5 KPI pour piloter votre fidélisation' },
              { href: '#cas', label: 'Cas pratique chiffré : bistrot 60 couverts' },
              { href: '#erreurs', label: 'Les 6 erreurs qui plombent un programme fidélité' },
              { href: '#outils', label: 'Outils, logiciels et intégrations' },
              { href: '#faq', label: 'Questions fréquentes' },
              { href: '#cta', label: 'Automatiser le suivi avec RestauMargin' },
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

        {/* ═════════════ SECTION 1 : Pourquoi ═════════════ */}
        <section id="pourquoi" className="mb-16">
          <SectionHeading icon={<TrendingUp className="w-6 h-6" />} number="1">
            Pourquoi la fidélisation est cruciale en restauration
          </SectionHeading>

          <div className="prose-content">
            <p>
              En restauration, la fidélisation clients n'est pas un sujet marketing accessoire. C'est
              le coeur économique de votre établissement. Un client fidèle dépense en moyenne 67 % de
              plus qu'un nouveau client (étude Bond Brand Loyalty 2025, confirmée par National
              Restaurant Association). Sur une année, un habitué qui revient 12 fois à 30 EUR de
              ticket moyen représente <strong>360 EUR de chiffre d'affaires</strong>, contre 30 EUR
              pour un client qui vient une seule fois.
            </p>
            <p>
              Si votre restaurant fait 200 couverts par semaine et que 30 % sont des habitués, ces
              60 clients fidèles génèrent autant de CA que les 140 clients occasionnels réunis.
              Convertir seulement <strong>10 % de vos clients de passage en habitués</strong> peut
              augmenter votre CA de 15 à 20 % sans dépenser un euro supplémentaire en publicité.
              C'est arithmétiquement l'investissement marketing le plus rentable de la profession.
            </p>
            <p>
              En 2026, le contexte renforce cet enjeu. L'inflation alimentaire cumulée depuis 2022
              dépasse 22 % en France (INSEE). Les consommateurs arbitrent davantage leurs sorties
              restaurant. Selon l'étude TheFork 2025 sur les habitudes de consommation, 68 % des
              Français déclarent privilégier les enseignes où ils se sentent reconnus, attendus,
              valorisés. La fidélisation devient un avantage concurrentiel majeur face aux
              plateformes de livraison qui commoditisent l'offre.
            </p>

            <Callout type="info">
              <strong>Le saviez-vous ?</strong> Selon Harvard Business Review, augmenter de seulement
              5 % le taux de rétention client augmente les profits d'une entreprise de service de
              25 à 95 %. En restauration, cet effet de levier est particulièrement puissant car les
              charges fixes (loyer, personnel base) sont élevées : chaque couvert additionnel bénéficie
              d'une marge incrémentale très supérieure à la marge moyenne.
            </Callout>

            <p>
              Au-delà des chiffres, la fidélisation créée un actif intangible : <strong>la communauté
              de votre restaurant</strong>. Cette communauté génère du bouche-à-oreille (30 à 40 % des
              nouvelles réservations en restauration indépendante selon GIRA Conseil), des avis Google
              positifs, des recommandations Instagram, et une résilience face aux périodes creuses.
              C'est cette communauté qui vous fait passer du statut de restaurant interchangeable à
              celui d'institution de quartier.
            </p>
          </div>
        </section>

        {/* ═════════════ SECTION 2 : Economics ═════════════ */}
        <section id="economics" className="mb-16">
          <SectionHeading icon={<Calculator className="w-6 h-6" />} number="2">
            Le calcul économique : LTV, CAC et ROI fidélisation
          </SectionHeading>

          <div className="prose-content">
            <p>
              Pour comprendre pourquoi fidéliser est rentable, il faut maîtriser trois indicateurs clés :
              la Lifetime Value (LTV), le Customer Acquisition Cost (CAC), et le ratio LTV/CAC. Ces
              concepts venus du marketing digital s'appliquent parfaitement à la restauration.
            </p>
          </div>

          <div className="grid sm:grid-cols-3 gap-6 mt-8">
            <MetricCard
              icon={<Heart className="w-6 h-6" />}
              title="LTV (Lifetime Value)"
              color="emerald"
              desc="La valeur totale qu'un client génère sur la durée de sa relation avec votre restaurant. C'est l'indicateur clé de la fidélisation : il transforme un client occasionnel en actif économique mesurable."
              formula="Ticket moyen x Fréquence annuelle x Durée de vie"
              target="500-1 200 EUR"
            />
            <MetricCard
              icon={<Target className="w-6 h-6" />}
              title="CAC (Coût d'Acquisition Client)"
              color="amber"
              desc="Combien vous coûte en moyenne chaque nouveau client. Inclut publicité, commissions plateformes, communication. En restauration urbaine 2026, le CAC est en hausse constante."
              formula="Dépenses marketing / Nouveaux clients"
              target="15-35 EUR"
            />
            <MetricCard
              icon={<Award className="w-6 h-6" />}
              title="Ratio LTV/CAC"
              color="blue"
              desc="Le rapport entre la valeur d'un client et son coût d'acquisition. C'est la métrique reine pour décider quel canal marketing privilégier et combien investir en fidélisation."
              formula="LTV / CAC"
              target="3 à 5"
            />
          </div>

          <div className="prose-content mt-8">
            <h3 className="text-xl font-bold text-mono-100 mb-3">Exemple chiffré : bistrot 60 couverts à Bordeaux</h3>
            <p>
              Prenons un bistrot avec un ticket moyen de 32 EUR HT. Un client occasionnel vient en
              moyenne 1,2 fois par an pendant 2 ans : LTV = 32 x 1,2 x 2 = <strong>76,80 EUR</strong>.
              Un client fidèle vient 8 fois par an pendant 4 ans : LTV = 32 x 8 x 4 = <strong>1 024 EUR</strong>.
              Un client fidèle vaut <strong>13 fois plus</strong> qu'un client occasionnel.
            </p>
            <p>
              Si le CAC est de 22 EUR, le ratio LTV/CAC d'un occasionnel est de 3,5 (correct mais
              limite). Le ratio LTV/CAC d'un fidèle est de <strong>46,5</strong> (exceptionnel). Cette
              différence justifie d'allouer 70 % de votre budget marketing à la fidélisation des clients
              existants et seulement 30 % à l'acquisition de nouveaux.
            </p>
          </div>

          <div className="mt-6 overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="bg-mono-975 text-mono-350">
                  <th className="text-left py-3 px-4 font-semibold rounded-tl-xl">Type de client</th>
                  <th className="text-right py-3 px-4 font-semibold">Fréquence/an</th>
                  <th className="text-right py-3 px-4 font-semibold">Durée (années)</th>
                  <th className="text-right py-3 px-4 font-semibold">LTV (EUR)</th>
                  <th className="text-right py-3 px-4 font-semibold rounded-tr-xl">Ratio LTV/CAC</th>
                </tr>
              </thead>
              <tbody className="text-mono-350">
                <tr className="bg-white"><td className="py-3 px-4 font-medium text-mono-100">Client one-shot</td><td className="py-3 px-4 text-right">1,0</td><td className="py-3 px-4 text-right">1,0</td><td className="py-3 px-4 text-right">32 EUR</td><td className="py-3 px-4 text-right text-red-600 font-semibold">1,5</td></tr>
                <tr className="bg-mono-1000"><td className="py-3 px-4 font-medium text-mono-100">Occasionnel</td><td className="py-3 px-4 text-right">1,2</td><td className="py-3 px-4 text-right">2,0</td><td className="py-3 px-4 text-right">77 EUR</td><td className="py-3 px-4 text-right text-amber-600 font-semibold">3,5</td></tr>
                <tr className="bg-white"><td className="py-3 px-4 font-medium text-mono-100">Régulier</td><td className="py-3 px-4 text-right">4,0</td><td className="py-3 px-4 text-right">3,0</td><td className="py-3 px-4 text-right">384 EUR</td><td className="py-3 px-4 text-right text-emerald-700 font-semibold">17,5</td></tr>
                <tr className="bg-mono-1000"><td className="py-3 px-4 font-medium text-mono-100">Fidèle actif</td><td className="py-3 px-4 text-right">8,0</td><td className="py-3 px-4 text-right">4,0</td><td className="py-3 px-4 text-right">1 024 EUR</td><td className="py-3 px-4 text-right text-emerald-700 font-semibold">46,5</td></tr>
                <tr className="bg-white"><td className="py-3 px-4 font-medium text-mono-100">Ambassadeur (avec parrainage)</td><td className="py-3 px-4 text-right">12,0</td><td className="py-3 px-4 text-right">5,0</td><td className="py-3 px-4 text-right">1 920 EUR</td><td className="py-3 px-4 text-right text-emerald-700 font-semibold">87,3</td></tr>
              </tbody>
            </table>
          </div>

          <div className="prose-content mt-8">
            <p>
              Cette logique est aussi celle qui sous-tend les calculs de marge dans votre restaurant.
              Pour aller plus loin sur le pilotage économique global, consultez notre
              <Link to="/blog/calcul-marge-restaurant" className="text-teal-700 underline hover:text-teal-800 ml-1">guide complet du calcul de marge restaurant</Link>.
            </p>
          </div>
        </section>

        {/* ═════════════ SECTION 3 : Programmes ═════════════ */}
        <section id="programmes" className="mb-16">
          <SectionHeading icon={<Gift className="w-6 h-6" />} number="3">
            Les 3 formats de programme fidélité restaurant qui fonctionnent
          </SectionHeading>

          <div className="prose-content">
            <p>
              Toutes les mécaniques de fidélisation ne se valent pas. Trois formats dominent le
              marché français en 2026, chacun adapté à une typologie de restaurant et à un volume
              de clientèle. Choisir le bon format dès le départ est décisif : changer en cours de
              route casse la dynamique et perd des clients.
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-3 mt-8">
            <MetricCard
              icon={<CheckCircle className="w-6 h-6" />}
              title="Carte tampon numérique"
              color="emerald"
              desc="Le classique '10 cafés = 1 offert' modernisé. Application mobile (Fidme, Stampt) ou QR code papier. Simplissime, peu coûteux, idéal pour cafés, bistrots de quartier, food trucks. Éliminez la complexité : 80 % des restaurants peuvent commencer par là."
              formula="N achats = 1 offert"
              target="0-20 EUR/mois"
            />
            <MetricCard
              icon={<Star className="w-6 h-6" />}
              title="Programme à points"
              color="amber"
              desc="Le client cumule des points selon le montant dépensé, les jours creux, ou les plats premium. Échangeables contre des récompenses graduées. Flexible, modulable, parfait pour brasseries et restaurants 80-200 couverts. Pilotable plat par plat."
              formula="1 EUR dépensé = 1 point"
              target="20-80 EUR/mois"
            />
            <MetricCard
              icon={<Heart className="w-6 h-6" />}
              title="Abonnement mensuel"
              color="blue"
              desc="Format en forte croissance 2026. Le client paye 15-25 EUR/mois et bénéficie d'avantages exclusifs : café offert chaque visite, -15 % sur l'addition, accès aux events. Crée un cash-flow prédictible et une fréquentation garantie. Adapté aux urbains, cafés, brunchs."
              formula="Forfait mensuel + avantages"
              target="50-150 EUR/mois"
            />
          </div>

          <div className="prose-content mt-8">
            <h3 className="text-xl font-bold text-mono-100 mb-3">La carte tampon numérique : le bon départ pour 80 % des restaurants</h3>
            <p>
              C'est l'option la plus simple à déployer et la moins coûteuse. Le client télécharge
              une app (Fidme, Stampt, LoyalGuru) et collectionne des tampons numériques. <strong>Règle
              d'or :</strong> la récompense doit représenter 5 à 10 % de la valeur cumulée des achats.
              Pour 10 cafés à 2,80 EUR, le 11e offert (2,80 EUR) représente 10 % du cumul : c'est
              l'équilibre parfait entre incitation et marge.
            </p>
            <p>
              Variantes efficaces : "Le 5e plat du jour offert" (encourage les visites répétées en
              semaine), "Le 3e brunch dominical offert" (cible les habitudes), "Le dessert offert
              tous les 4 passages" (faible coût matière, forte valeur perçue).
            </p>

            <h3 className="text-xl font-bold text-mono-100 mb-3 mt-8">Le programme à points : pour piloter la marge</h3>
            <p>
              Modulez la valeur des points selon les plats (marge plus élevée = plus de points), les
              jours creux (lundi et mardi = 2x points), ou les catégories (vins et desserts = bonus
              points). Exemple : 1 point par euro dépensé, 100 points = 5 EUR de réduction. Un client
              à 30 EUR/visite cumule 5 EUR de réduction en 3 visites, ce qui l'incite à revenir
              rapidement avant que ses points n'expirent.
            </p>
            <p>
              Combinez avec un menu engineering rigoureux pour orienter le client vers vos plats à
              forte marge. Découvrez la méthodologie complète dans notre article sur
              <Link to="/blog/menu-engineering-boston-matrix" className="text-teal-700 underline hover:text-teal-800 ml-1">le menu engineering pour restaurants</Link>.
            </p>

            <h3 className="text-xl font-bold text-mono-100 mb-3 mt-8">L'abonnement mensuel : la révolution 2026</h3>
            <p>
              Inspiré des modèles Costa Club ou Pret a Manger Coffee Subscription au Royaume-Uni,
              l'abonnement gagne du terrain en France. Le client paye un forfait mensuel (15-25 EUR)
              et bénéficie d'avantages illimités : un café chaque jour, -15 % sur l'addition, un
              accord mets-vins offert par mois, une priorité de réservation.
            </p>
            <p>
              Avantages : cash-flow prédictible, fréquentation garantie, lien émotionnel fort. Le
              client abonné devient ambassadeur naturel de votre établissement. Limite : adapté
              uniquement aux concepts à forte fréquence (coffee shops, brunchs, cantines de
              quartier). Pas pertinent pour le gastronomique.
            </p>
          </div>

          <div className="mt-8 overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="bg-mono-975 text-mono-350">
                  <th className="text-left py-3 px-4 font-semibold rounded-tl-xl">Format</th>
                  <th className="text-left py-3 px-4 font-semibold">Type de restaurant</th>
                  <th className="text-left py-3 px-4 font-semibold">Coût mensuel</th>
                  <th className="text-left py-3 px-4 font-semibold">Complexité</th>
                  <th className="text-left py-3 px-4 font-semibold rounded-tr-xl">ROI typique</th>
                </tr>
              </thead>
              <tbody className="text-mono-350">
                <tr className="bg-white"><td className="py-3 px-4 font-medium text-mono-100">Carte tampon numérique</td><td className="py-3 px-4">Cafés, bistrots, food trucks</td><td className="py-3 px-4">0-20 EUR</td><td className="py-3 px-4">Très faible</td><td className="py-3 px-4 text-emerald-700 font-semibold">5-7x</td></tr>
                <tr className="bg-mono-1000"><td className="py-3 px-4 font-medium text-mono-100">Programme à points</td><td className="py-3 px-4">Brasseries, traditionnels</td><td className="py-3 px-4">20-80 EUR</td><td className="py-3 px-4">Moyenne</td><td className="py-3 px-4 text-emerald-700 font-semibold">4-6x</td></tr>
                <tr className="bg-white"><td className="py-3 px-4 font-medium text-mono-100">Abonnement mensuel</td><td className="py-3 px-4">Coffee shops, brunchs, urbains</td><td className="py-3 px-4">50-150 EUR</td><td className="py-3 px-4">Élevée</td><td className="py-3 px-4 text-emerald-700 font-semibold">3-5x</td></tr>
                <tr className="bg-mono-1000"><td className="py-3 px-4 font-medium text-mono-100">Hybride (points + VIP)</td><td className="py-3 px-4">Gastronomiques, étoilés</td><td className="py-3 px-4">100-300 EUR</td><td className="py-3 px-4">Très élevée</td><td className="py-3 px-4 text-emerald-700 font-semibold">3-4x</td></tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* ═════════════ SECTION HOWTO : 6 etapes ═════════════ */}
        <section id="howto" className="mb-16">
          <SectionHeading icon={<ListChecks className="w-6 h-6" />} number="4">
            Comment créer son programme de fidélité en 6 étapes
          </SectionHeading>

          <div className="prose-content">
            <p>
              Voici la méthodologie opérationnelle pour lancer un programme de fidélité rentable.
              Comptez 30 jours entre le déclic stratégique et le lancement effectif. Saute aucune
              étape : la séquence est conccue pour éviter les pièges qui font échouer 60 % des
              programmes restaurant (étude Como 2024).
            </p>
          </div>

          <ol className="mt-8 space-y-5">
            {[
              {
                title: 'Définir l\'objectif chiffré et le KPI cible',
                body: "Avant tout outil, fixez un objectif : passer de 25 % à 40 % de taux de revisite en 12 mois, augmenter de 15 % le ticket moyen des inscrits, générer 30 % du CA via clients identifiés. Ce KPI guide toutes les décisions suivantes : format, récompenses, fréquence. Sans objectif, le programme s'essouffle au bout de 4 mois et meurt.",
              },
              {
                title: 'Choisir le format adapté à votre volume',
                body: "Moins de 80 couverts/jour : carte tampon numérique. 80 à 200 couverts : programme à points. Plus de 200 ou positionnement premium : abonnement mensuel ou hybride. Vérifiez la compatibilité avec votre caisse (Sumup, Tiller, Lightspeed, Square, Zelty, L'Addition intègrent nativement des modules) pour éviter la double saisie.",
              },
              {
                title: 'Constituer la base CRM avant le lancement',
                body: "Récoltez nom, email, téléphone, date d'anniversaire au moment de la réservation, du paiement, ou via le Wi-Fi conditionnel. Visez 30 % de votre clientèle en base en 6 mois. Utilisez le RGPD comme atout, pas comme contrainte : transparence sur l'usage des données = confiance = meilleur taux d'opt-in.",
              },
              {
                title: 'Définir les mécaniques de récompense',
                body: "Cédez 5 à 10 % de la valeur cumulée. Privilégiez les cadeaux (dessert, cocktail, accord mets-vins) aux réductions en euros. Récompensez aussi le parrainage : '-15 EUR pour vous + -15 EUR pour votre filleul'. Calez les seuils sur les fréquences naturelles : 3, 5, 10 visites. Au-delà de 10 paliers, le client décroche.",
              },
              {
                title: 'Lancer les campagnes de relance ciblées',
                body: "SMS d'anniversaire 7 jours avant la date (validité 30 jours). Relance des clients inactifs entre J+45 et J+60. Invitation aux nouveautés carte pour les VIP. Maximum 1 message par mois et par client : au-delà vous êtes perçu comme spammeur. Personnalisez chaque message (prénom + référence à la dernière visite).",
              },
              {
                title: 'Mesurer et optimiser tous les 90 jours',
                body: "Audit trimestriel obligatoire : taux de revisite, LTV par segment, NPS, coût d'acquisition vs rétention. Identifiez les récompenses qui marchent (taux de rédemption > 40 %) et celles à abandonner (< 15 %). Ajustez la fréquence des relances selon le segment. Un bon programme s'améliore en continu sur 24 mois.",
              },
            ].map((step, i) => (
              <li key={i} className="bg-white border border-mono-900 rounded-2xl p-6 sm:p-7 flex gap-5">
                <div className="w-12 h-12 bg-teal-600 text-white rounded-xl flex items-center justify-center shrink-0 font-extrabold text-lg shadow-md">
                  {i + 1}
                </div>
                <div>
                  <h3 className="font-bold text-mono-100 text-lg mb-2">{step.title}</h3>
                  <p className="text-sm text-mono-400 leading-relaxed">{step.body}</p>
                </div>
              </li>
            ))}
          </ol>

          <Callout type="info">
            <strong>Pilotage par la donnée :</strong> chaque levier de fidélisation s'analyse en
            paralle de votre marge globale. Si votre programme augmente le CA mais érode votre marge
            brute, vous perdez de l'argent. Vérifiez votre <Link to="/blog/calcul-marge-restaurant" className="underline font-semibold hover:text-teal-700">marge restaurant</Link> chaque mois pour valider le ROI net.
          </Callout>
        </section>

        {/* ═════════════ SECTION 5 : CRM ═════════════ */}
        <section id="crm" className="mb-16">
          <SectionHeading icon={<Users className="w-6 h-6" />} number="5">
            CRM et collecte de données clients restaurant
          </SectionHeading>

          <div className="prose-content">
            <p>
              Sans données, pas de fidélisation intelligente. La base CRM (Customer Relationship
              Management) est l'infrastructure invisible de votre programme. Plus elle est riche
              et propre, plus vos campagnes sont efficaces. Voici les 4 moments clés pour collecter
              les données de façon éthique et consentie.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 gap-6 mt-8">
            <CollectCard
              icon={<Calendar className="w-5 h-5" />}
              moment="À la réservation"
              channel="TheFork, Sevenrooms, formulaire web"
              data="Email + téléphone (auto), préférences"
              rate="95 %"
            />
            <CollectCard
              icon={<Gift className="w-5 h-5" />}
              moment="Au programme de fidélité"
              channel="Inscription app, QR code sur l'addition"
              data="Prénom, anniversaire, préférences"
              rate="100 % des inscrits"
            />
            <CollectCard
              icon={<Smartphone className="w-5 h-5" />}
              moment="Au paiement"
              channel="QR code post-paiement, terminal"
              data="Email pour envoi du reçu digital"
              rate="40-60 %"
            />
            <CollectCard
              icon={<MessageSquare className="w-5 h-5" />}
              moment="Sur le Wi-Fi"
              channel="Captive portal Wi-Fi conditionnel"
              data="Email + opt-in marketing"
              rate="60-70 %"
            />
          </div>

          <div className="prose-content mt-8">
            <h3 className="text-xl font-bold text-mono-100 mb-3">Le minimum viable : Google Sheets structure</h3>
            <p>
              Vous n'avez pas besoin d'un CRM à 200 EUR/mois pour démarrer. Un tableur Google Sheets
              structure est un début crédible : nom, email, téléphone, date d'anniversaire, fréquence
              de visite, date de dernière visite, préférences alimentaires, allergies, notes serveur.
              Avec ces 9 colonnes, vous identifiez vos clients à risque (pas vus depuis 45 jours) et
              déclenchez une relance ciblée.
            </p>
            <p>
              Quand vous dépassez 800 contacts, basculez vers un CRM dédié : Como, Paytronix,
              LoyalGuru, Mailchimp, ou les modules intégrés aux caisses (Tiller, Zelty). L'investissement
              se rentabilise en 3 mois grâce au gain de temps et aux campagnes automatisées.
            </p>

            <Callout type="info">
              <strong>RGPD : votre allié, pas votre ennemi.</strong> La loi vous oblige à la
              transparence sur la collecte et l'usage des données. Profitez-en : un opt-in clair
              avec mention "Vos données servent uniquement à vous envoyer nos offres exclusives, jamais
              partagées" obtient un taux de consentement de 70-80 %. La confiance des clients
              français en 2026 passe par l'éthique des données.
            </Callout>

            <h3 className="text-xl font-bold text-mono-100 mb-3 mt-8">Résultat concret : une étude de cas parisienne</h3>
            <p>
              Un bistrot parisien de 60 couverts utilisant un CRM basique (Tiller + Mailchimp) a
              réduit son taux de churn de 35 % à 18 % en 6 mois, soit <strong>22 clients
              supplémentaires retenus par mois</strong>. Sur un ticket moyen de 35 EUR et 6 visites
              annuelles, ces 22 clients représentent 4 620 EUR de CA additionnel par mois, soit
              55 440 EUR/an. Coût du CRM : 1 080 EUR/an. ROI : 51x.
            </p>
          </div>
        </section>

        {/* ═════════════ SECTION 6 : Anniversaires ═════════════ */}
        <section id="anniversaires" className="mb-16">
          <SectionHeading icon={<Star className="w-6 h-6" />} number="6">
            Anniversaires et occasions spéciales : le levier ROI immédiat
          </SectionHeading>

          <div className="prose-content">
            <p>
              Le marketing par les anniversaires est la stratégie à <strong>ROI le plus rapide</strong>
              en restauration. Taux de rédemption moyen : 40-60 %. Un dessert à 5 EUR de coût matière
              pour ramener un client qui va dépenser 35 EUR au restaurant : c'est rentable à 600 %.
              Et cette mécanique fonctionne dans 100 % des établissements, quel que soit le format.
            </p>
            <p>
              <strong>Calendrier optimal :</strong> envoyez le bon 7 jours avant l'anniversaire
              (pas le jour J), avec une validité de 30 jours pour maximiser la conversion. Le client
              a le temps de planifier sa sortie sans se sentir contraint. Mentionnez dans le SMS que
              c'est valable pour la table entière : multiplicateur naturel du ticket moyen.
            </p>

            <h3 className="text-xl font-bold text-mono-100 mb-3 mt-8">Les autres occasions à exploiter</h3>
            <ul className="list-disc pl-6 space-y-2 text-mono-350 mt-4 leading-relaxed">
              <li><strong>Anniversaire de première visite</strong> ("1 an avec nous, merci !") : taux de rédemption 30 %, effet émotionnel fort.</li>
              <li><strong>Fête des mères et pères</strong> : campagne SMS J-7 avec menu spécial : +35 % de réservations dimanche.</li>
              <li><strong>Saint-Valentin (J-14 à J-3)</strong> : email/SMS aux couples identifiés via le CRM (champ "Type de visite : en couple").</li>
              <li><strong>Halloween, Noël, jour de l'an</strong> : campagne aux familles avec menus enfants gratuits jusqu'à 8 ans.</li>
              <li><strong>Anniversaire de mariage</strong> (si renseigné au CRM) : SMS personnalisé avec coupe de champagne offerte.</li>
              <li><strong>Rentrées scolaires</strong> : offre familles avec menu spécial petits / parents.</li>
            </ul>

            <h3 className="text-xl font-bold text-mono-100 mb-3 mt-8">Les attentions en salle : gratuit et redoutable</h3>
            <p>
              Former votre équipe à mémoriser les réguliers est gratuit et plus efficace que n'importe
              quelle application. Appeler un client par son prénom, se souvenir qu'il prend son café
              allonge, lui proposer sa table habituelle : ces micro-attentions créent une relation
              émotionnelle qu'aucun outil ne remplace.
            </p>
            <p>
              <strong>Astuce opérationnelle :</strong> créez un "cahier des habitués" partagé entre
              serveurs (Notion, Slack canal privé, ou un classeur papier discret). Champs : nom, table
              préférée, boisson habituelle, allergie, dernière visite, anecdote à retenir. 10 minutes
              de mise à jour par semaine pour un impact considérable. Les chefs étoilés comme Anne-Sophie
              Pic et Yannick Alléno appliquent cette discipline depuis 20 ans.
            </p>
          </div>
        </section>

        {/* ═════════════ SECTION 7 : SMS marketing ═════════════ */}
        <section id="sms" className="mb-16">
          <SectionHeading icon={<Smartphone className="w-6 h-6" />} number="7">
            SMS marketing et campagnes de relance restaurant
          </SectionHeading>

          <div className="prose-content">
            <p>
              Le SMS marketing est l'arme la plus puissante de la fidélisation restaurant en 2026.
              Taux d'ouverture : <strong>98 %</strong> contre 22 % pour l'email (Mediapost Communication
              2025). Taux de clic : 19 % contre 3 %. Le SMS atteint son destinataire dans les 3 minutes
              dans 90 % des cas. Pour un restaurant, c'est le canal le plus efficace pour générer des
              réservations de dernière minute et réactiver des clients dormants.
            </p>
            <p>
              <strong>Les règles d'or du SMS restaurant :</strong>
            </p>
            <ul className="list-disc pl-6 space-y-2 text-mono-350 mt-4 leading-relaxed">
              <li><strong>Maximum 1 SMS par mois et par client</strong> : au-delà vous êtes perçu comme spammeur, taux de désabonnement explose.</li>
              <li><strong>Personnalisez avec le prénom</strong> : conversion x 2,5 vs un SMS générique.</li>
              <li><strong>Limité à 160 caractères</strong> : un seul message, lisible en 5 secondes.</li>
              <li><strong>Inclure une offre actionnable</strong> : "-15 % cette semaine" beat "Bonne semaine !".</li>
              <li><strong>Timing : mardi 11h ou jeudi 16h</strong> : pics d'ouverture en restauration, conversion x 1,4 vs autre créneaux.</li>
              <li><strong>Inclure un opt-out clair</strong> : "STOP au 36180" pour respecter le RGPD et éviter les plaintes.</li>
            </ul>

            <h3 className="text-xl font-bold text-mono-100 mb-3 mt-8">Les 4 séquences SMS qui marchent</h3>
            <p>
              Voici les scénarios automatisés à déployer avec des outils comme Twilio, Mailjet SMS,
              Brevo, ou les modules CRM caisse :
            </p>
            <ol className="list-decimal pl-6 space-y-3 text-mono-350 mt-4 leading-relaxed">
              <li>
                <strong>Bienvenue (J+1 après première visite)</strong> : "Bonjour Pierre, merci pour
                votre visite hier ! On serait ravis de vous revoir. -10 % sur votre prochaine venue
                avec le code BIENVENUE10, valable 30 jours. À bientôt, [Nom restaurant]". Taux de
                conversion : 18-25 %.
              </li>
              <li>
                <strong>Anniversaire (J-7)</strong> : "Joyeux anniversaire en avance Sophie ! Pour
                fêter ça avec nous : un dessert offert sur tout repas, valide tout le mois. À
                bientôt, [Nom restaurant]". Taux de conversion : 40-60 %.
              </li>
              <li>
                <strong>Relance inactif (J+45 à J+60)</strong> : "Bonjour Marc, ça fait un moment !
                Notre nouveau menu de printemps vient de sortir. Pour fetter votre retour : un
                cocktail maison offert. À vous revoir vite, [Nom restaurant]". Taux : 18-25 %.
              </li>
              <li>
                <strong>Reconquête (J+90)</strong> : "Cher Pascal, on aimerait vraiment vous revoir.
                -20 % sur tout votre repas valable 2 semaines. Code RETOUR20. À bientôt, [Nom
                restaurant]". Taux : 8-12 % (faible mais c'est de la conversion sur clients perdus).
              </li>
            </ol>

            <h3 className="text-xl font-bold text-mono-100 mb-3 mt-8">SMS vs Email : la répartition optimale</h3>
            <p>
              Le SMS gère les moments clés (relance, anniversaire, offre flash). L'email gère
              l'engagement long terme (newsletter mensuelle, événements, contenus). La combinaison
              est imbatable : taux d'engagement combiné 3,5x supérieur à chaque canal pris isolément.
            </p>

            <div className="mt-6 overflow-x-auto">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="bg-mono-975 text-mono-350">
                    <th className="text-left py-3 px-4 font-semibold rounded-tl-xl">Canal</th>
                    <th className="text-right py-3 px-4 font-semibold">Taux ouverture</th>
                    <th className="text-right py-3 px-4 font-semibold">Taux clic</th>
                    <th className="text-right py-3 px-4 font-semibold">Coût unitaire</th>
                    <th className="text-right py-3 px-4 font-semibold rounded-tr-xl">Usage idéal</th>
                  </tr>
                </thead>
                <tbody className="text-mono-350">
                  <tr className="bg-white"><td className="py-3 px-4 font-medium text-mono-100">SMS</td><td className="py-3 px-4 text-right font-semibold text-emerald-700">98 %</td><td className="py-3 px-4 text-right font-semibold text-emerald-700">19 %</td><td className="py-3 px-4 text-right">0,06-0,10 EUR</td><td className="py-3 px-4 text-right text-xs">Relance, anniv, flash</td></tr>
                  <tr className="bg-mono-1000"><td className="py-3 px-4 font-medium text-mono-100">Email</td><td className="py-3 px-4 text-right">22 %</td><td className="py-3 px-4 text-right">3 %</td><td className="py-3 px-4 text-right">0,001 EUR</td><td className="py-3 px-4 text-right text-xs">Newsletter, events</td></tr>
                  <tr className="bg-white"><td className="py-3 px-4 font-medium text-mono-100">Push notification (app)</td><td className="py-3 px-4 text-right">45 %</td><td className="py-3 px-4 text-right">8 %</td><td className="py-3 px-4 text-right">Inclus</td><td className="py-3 px-4 text-right text-xs">Promo immédiate</td></tr>
                  <tr className="bg-mono-1000"><td className="py-3 px-4 font-medium text-mono-100">WhatsApp Business</td><td className="py-3 px-4 text-right">90 %</td><td className="py-3 px-4 text-right">15 %</td><td className="py-3 px-4 text-right">0,02-0,04 EUR</td><td className="py-3 px-4 text-right text-xs">Réservations, VIP</td></tr>
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* ═════════════ SECTION 8 : Google My Business ═════════════ */}
        <section id="google" className="mb-16">
          <SectionHeading icon={<Mail className="w-6 h-6" />} number="8">
            Google My Business et avis en ligne : la fidélisation visible
          </SectionHeading>

          <div className="prose-content">
            <p>
              La fidélisation ne se limite pas à vos clients existants. Elle inclut l'image que
              ces clients projettent sur votre restaurant aux yeux des prospects. Google My Business
              (GMB) est l'amplificateur public de votre fidélisation : un fort taux d'avis 5 étoiles
              est le signal social le plus puissant pour acquérir de nouveaux clients qui deviendront
              eux-mêmes des fidèles.
            </p>
            <p>
              En 2026, 87 % des Français consultent les avis Google avant de choisir un restaurant
              (étude Sortlist 2025). Note moyenne minimum acceptable : <strong>4,3 sur 5</strong>.
              En dessous, votre taux de clic depuis Google Maps chute de 40 %. Au-dessus de 4,5, vous
              êtes en tête de liste pour les recherches "restaurant + quartier".
            </p>

            <h3 className="text-xl font-bold text-mono-100 mb-3 mt-8">Les 5 leviers GMB à actionner</h3>
            <ol className="list-decimal pl-6 space-y-3 text-mono-350 mt-4 leading-relaxed">
              <li>
                <strong>Solliciter les avis systématiquement</strong>. QR code sur l'addition avec
                mention "Votre avis nous aide". 15 % des clients laissent un avis si on leur demande
                vs 2 % sans demande.
              </li>
              <li>
                <strong>Répondre à 100 % des avis (positifs ET négatifs)</strong>. Délai cible :
                48h. Une réponse personnalisée à un avis 5 étoiles augmente la conversion des
                prospects qui lisent les avis de 30 %.
              </li>
              <li>
                <strong>Publier au moins 3 photos par mois</strong>. Les restaurants avec 50+ photos
                obtiennent 35 % plus de clics que ceux avec moins de 10 photos.
              </li>
              <li>
                <strong>Activer la fonction "Réservation Google"</strong> en connectant TheFork ou
                Sevenrooms : -30 % de clics perdus.
              </li>
              <li>
                <strong>Publier des "Posts" GMB chaque semaine</strong> : menu du jour, événements,
                offres. Augmente le ranking local de 15 % sur 90 jours.
              </li>
            </ol>

            <Callout type="warning">
              <strong>Le piège des avis fictifs.</strong> N'achetez jamais d'avis fictifs (sites
              comme "Avis Premium" ou freelances Fiverr). Google détecte ces patterns et pénalise
              massivement votre fiche (-50 à -90 % de visibilité). Si vous êtes pris, il faut 12
              mois pour s'en remettre. Les vrais avis, même moins nombreux, sont infiniment plus
              rentables sur le long terme.
            </Callout>

            <h3 className="text-xl font-bold text-mono-100 mb-3 mt-8">Tripadvisor, TheFork, Instagram : la triade complémentaire</h3>
            <p>
              Au-delà de Google, surveillez ces 3 plateformes :
            </p>
            <ul className="list-disc pl-6 space-y-2 text-mono-350 mt-4 leading-relaxed">
              <li><strong>Tripadvisor</strong> : critique pour le tourisme. Réponse aux avis &lt; 7 jours, photos professionnelles, mise à jour menu mensuelle.</li>
              <li><strong>TheFork</strong> : la plateforme de référence en France pour les réservations. Profil complet, photos pro, réponse aux avis, offres spécifiques.</li>
              <li><strong>Instagram</strong> : 3 publications/semaine + 1 Story/jour. Tag des clients (avec accord), Reels courts (15-30s) des plats signature.</li>
            </ul>
          </div>
        </section>

        {/* ═════════════ SECTION 9 : KPI ═════════════ */}
        <section id="kpi" className="mb-16">
          <SectionHeading icon={<BarChart2 className="w-6 h-6" />} number="9">
            Les 5 KPI pour piloter votre fidélisation restaurant
          </SectionHeading>

          <div className="prose-content">
            <p>
              On ne pilote bien que ce qu'on mesure. Voici les 5 KPI indispensables, leur formule,
              et leurs benchmarks 2026 pour la restauration française. Suivez-les chaque mois dans
              un tableau de bord dédié.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 gap-5 mt-8">
            {[
              {
                kpi: 'Taux de revisite (Repeat Rate)',
                formule: '(Clients venus 2+ fois / Clients uniques) x 100',
                bench: '20-25 % standard, 35-50 % restaurant de quartier, 60 %+ avec programme actif',
                why: 'Le KPI fondamental de la fidélisation. Mesure votre capacité à créer de l\'habitude.',
              },
              {
                kpi: 'Lifetime Value (LTV)',
                formule: 'Ticket moyen x Fréquences annuelles x Durée de vie',
                bench: 'Bistrot 384 EUR, Brasserie 580 EUR, Coffee shop 950 EUR sur 4 ans',
                why: 'Permet d\'arbitrer le budget fidélisation : 10 % du LTV est un investissement rentable.',
              },
              {
                kpi: 'Net Promoter Score (NPS)',
                formule: '% Promoteurs (9-10) - % Détracteurs (0-6)',
                bench: 'NPS > 50 = excellent, < 30 = signal de problème, < 0 = crise',
                why: 'Mesure la propension à recommander. Prédicteur le plus fiable de la croissance organique.',
              },
              {
                kpi: 'Coût d\'acquisition vs rétention',
                formule: 'Dépenses acquisition/nouveaux clients vs Dépenses rétention/clients retenus',
                bench: 'Rétention coûte 4-7x moins cher que acquisition en moyenne',
                why: 'Permet de réorienter le budget marketing vers les canaux les plus efficaces.',
              },
              {
                kpi: 'Taux de churn (perte de clients)',
                formule: '(Clients perdus / Clients total) x 100 sur 12 mois',
                bench: 'Churn < 30 % = sain, 30-40 % = à surveiller, > 40 % = urgent',
                why: 'Le revers de la fidélisation. Réduire le churn de 5 points = augmenter les profits de 25 %.',
              },
              {
                kpi: 'Taux de rédemption récompenses',
                formule: '(Récompenses utilisées / Récompenses distribuées) x 100',
                bench: '40-60 % = idéal, < 25 % = mécanique mal calibrée, > 80 % = récompense trop généreuse',
                why: 'Indique si vos mécaniques sont attractives ET soutenables économiquement.',
              },
            ].map((item) => (
              <div key={item.kpi} className="bg-white border border-mono-900 rounded-2xl p-5">
                <p className="font-bold text-mono-100 mb-2">{item.kpi}</p>
                <p className="text-xs text-teal-600 font-mono mb-2">{item.formule}</p>
                <p className="text-xs text-mono-500 mb-2"><strong>Benchmark :</strong> {item.bench}</p>
                <p className="text-xs text-mono-400 italic leading-relaxed">{item.why}</p>
              </div>
            ))}
          </div>

          <Callout type="info">
            <strong>Tableau de bord minimum.</strong> Si vous ne deviez suivre qu'un seul KPI :
            le <strong>taux de revisite</strong>. Il intègre la qualité du programme, la satisfaction
            client, et la pertinence des relances. Un taux qui monte = programme qui marche. Un taux
            qui baisse = action corrective immédiate. Pour aller plus loin, surveillez aussi votre
            <Link to="/blog/augmenter-ticket-moyen-restaurant" className="underline font-semibold hover:text-teal-700 ml-1">ticket moyen restaurant</Link> qui devrait progresser de 8-15 % chez les clients en programme.
          </Callout>
        </section>

        {/* ═════════════ SECTION 10 : Cas chiffre ═════════════ */}
        <section id="cas" className="mb-16">
          <SectionHeading icon={<Calculator className="w-6 h-6" />} number="10">
            Cas pratique chiffré : bistrot 60 couverts à Lyon
          </SectionHeading>

          <div className="prose-content">
            <p>
              Décortiquons l'impact d'un programme de fidélité bien exécuté sur un bistrot lyonnais
              de 60 couverts. Ce cas est inspiré d'un client RestauMargin réel, anonymise.
            </p>
          </div>

          <div className="mt-8 bg-mono-1000 border border-mono-900 rounded-2xl p-6 sm:p-8">
            <h3 className="font-bold text-mono-100 mb-4 text-lg">État initial (avant programme)</h3>
            <ul className="list-disc pl-6 space-y-1.5 text-mono-350 text-sm">
              <li>Ticket moyen : 35 EUR HT</li>
              <li>Couverts/semaine : 320 (taux d'occupation 55 %)</li>
              <li>Taux de revisite : 22 % (industrie standard)</li>
              <li>Base CRM : 0 (aucune collecte structurée)</li>
              <li>CA annuel : 583 000 EUR HT</li>
              <li>Marge nette : 7,2 %</li>
            </ul>
          </div>

          <div className="mt-6 bg-mono-1000 border border-mono-900 rounded-2xl p-6 sm:p-8">
            <h3 className="font-bold text-mono-100 mb-4 text-lg">Actions déployées (mois 1 à 6)</h3>
            <ul className="list-disc pl-6 space-y-1.5 text-mono-350 text-sm">
              <li>Mois 1-2 : déploiement carte tampon numérique (Fidme) + collecte CRM via QR code addition</li>
              <li>Mois 2-3 : campagne SMS d'anniversaire activée (J-7)</li>
              <li>Mois 3-4 : séquence de bienvenue automatisée (-10 % après première visite)</li>
              <li>Mois 4-5 : relance inactifs J+45 (cocktail offert)</li>
              <li>Mois 5-6 : optimisation Google My Business (3 photos/mois, réponse 100 % avis)</li>
              <li>Coût total mensuel : 78 EUR (outils) + 220 EUR de récompenses moyennes/mois</li>
            </ul>
          </div>

          <div className="mt-6 bg-emerald-50 border border-emerald-200 rounded-2xl p-6 sm:p-8">
            <h3 className="font-bold text-emerald-900 mb-4 text-lg">Résultats après 12 mois</h3>
            <ul className="list-disc pl-6 space-y-1.5 text-emerald-800 text-sm">
              <li>Taux de revisite : <strong>22 % → 41 %</strong> (+19 points)</li>
              <li>Base CRM : <strong>0 → 1 240 contacts</strong></li>
              <li>Ticket moyen clients fidèles : <strong>35 EUR → 38,50 EUR</strong> (+10 %)</li>
              <li>Couverts/semaine : <strong>320 → 372</strong> (+16 %)</li>
              <li>CA annuel : <strong>583 000 EUR → 696 000 EUR</strong> (+113 000 EUR)</li>
              <li>Marge nette : <strong>7,2 % → 9,8 %</strong> (charges fixes mieux absorbées)</li>
              <li>Avis Google : <strong>4,1 → 4,7 étoiles</strong> (487 avis cumulés)</li>
              <li>NPS : <strong>34 → 68</strong></li>
            </ul>
          </div>

          <div className="prose-content mt-8">
            <p>
              <strong>Bilan financier :</strong> investissement annuel 3 576 EUR (outils + récompenses).
              Gain de CA additionnel 113 000 EUR sur 12 mois. ROI brut : 31x. ROI net (après food
              cost incremental et récompenses) : <strong>environ 18x</strong>. Le programme s'est
              auto-financé dès le 2e mois.
            </p>
            <p>
              Au-delà des chiffres, ce bistrot a développé une <strong>communauté de quartier</strong>
              : 280 clients identifiés viennent 6+ fois par an, génèrent du bouche-à-oreille, et
              servent de socle de stabilité face aux périodes creuses (janvier, août). C'est l'actif
              le plus précieux qu'un restaurant puisse construire.
            </p>
          </div>
        </section>

        {/* ═════════════ SECTION 11 : Erreurs ═════════════ */}
        <section id="erreurs" className="mb-16">
          <SectionHeading icon={<AlertTriangle className="w-6 h-6" />} number="11">
            Les 6 erreurs qui plombent un programme de fidélité
          </SectionHeading>

          <div className="space-y-6 mt-8">
            <ErreurCard
              number={1}
              title="Récompenses sans rapport avec le coût client"
              desc="Offrir 10 EUR de réduction à un client qui dépense 25 EUR par visite (40 % de la note) tue votre marge. La règle des 5-10 % de la valeur cumulée est impérative. Si vous cédez plus, vous payez vos clients pour qu'ils viennent : le programme devient un boulet économique au lieu d'être un levier."
            />
            <ErreurCard
              number={2}
              title="Trop de communication, ou trop peu"
              desc="Spammer vos clients avec 4 SMS par mois fait exploser le taux de désabonnement. Inversement, ne communiquer qu'une fois tous les 6 mois fait oublier votre restaurant. La fréquence optimale : 1 message structurant par mois (anniversaire, relance, ou nouveauté) + 1 à 2 SMS opportunistes par trimestre (offre flash, événement saison)."
            />
            <ErreurCard
              number={3}
              title="Pas de segmentation : la newsletter générique"
              desc="Envoyer le même message à un VIP qui vient 12 fois/an et à un occasionnel venu 1 fois est une erreur stratégique. Le VIP mérite des invitations exclusives, des previews menu, des cadeaux personnalisés. L'occasionnel mérite une relance avec une offre claire pour déclencher la 2e visite. Segmenter au minimum en 3 buckets : VIP, réguliers, inactifs."
            />
            <ErreurCard
              number={4}
              title="Programme trop complexe à comprendre"
              desc="Un client doit comprendre votre programme en 10 secondes max. Si vous expliquez '4 paliers avec des bonus modulables selon les jours creux et un système de parrainage hiérarchique', personne ne s'inscrit. Restez simple : '10 visites = 1 repas offert' ou 'Anniversaire = dessert offert'. La simplicité est ROI."
            />
            <ErreurCard
              number={5}
              title="Pas de mesure du ROI : pilotage à l'aveugle"
              desc="60 % des restaurants qui lancent un programme ne mesurent ni le taux de revisite, ni la LTV, ni le ROI. Ils continuent par habitude ou abandonnent en croyant que ça ne marche pas. Sans tableau de bord mensuel (taux de revisite, NPS, rédemption, ticket moyen segment fidèle), vous ne savez pas ce qui fonctionne. Mesurez ou arrêtez."
            />
            <ErreurCard
              number={6}
              title="Équipe de salle non formée au programme"
              desc="Si vos serveurs ne savent pas expliquer le programme, ne proposent pas l'inscription au paiement, ne mentionnent pas l'anniversaire approchant, votre investissement marketing est gaspillé. Formez l'équipe en 30 minutes : pourquoi le programme existe, comment l'expliquer, comment proposer l'inscription. Récompensez les serveurs qui collectent le plus de contacts (bonus mensuel symbolique)."
            />
          </div>

          <Callout type="warning">
            <strong>Impact cumulé :</strong> ces 6 erreurs combinées peuvent réduire le ROI de
            votre programme de 70 à 90 %. Un programme qui devrait rapporter 4x revient à 0,5x voire
            négatif. La discipline d'exécution est plus importante que le choix du format ou de
            l'outil.
          </Callout>
        </section>

        {/* ═════════════ SECTION 12 : Outils ═════════════ */}
        <section id="outils" className="mb-16">
          <SectionHeading icon={<Smartphone className="w-6 h-6" />} number="12">
            Outils, logiciels et intégrations recommandés 2026
          </SectionHeading>

          <div className="prose-content">
            <p>
              Voici une sélection d'outils testés et recommandés pour chaque type de restaurant et
              chaque budget. Tous compatibles avec le marché français (RGPD, support FR, intégrations
              caisses locales).
            </p>
          </div>

          <div className="mt-8 overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="bg-mono-975 text-mono-350">
                  <th className="text-left py-3 px-4 font-semibold rounded-tl-xl">Outil</th>
                  <th className="text-left py-3 px-4 font-semibold">Catégorie</th>
                  <th className="text-left py-3 px-4 font-semibold">Budget mensuel</th>
                  <th className="text-left py-3 px-4 font-semibold">Force principale</th>
                  <th className="text-left py-3 px-4 font-semibold rounded-tr-xl">Idéal pour</th>
                </tr>
              </thead>
              <tbody className="text-mono-350">
                <tr className="bg-white"><td className="py-3 px-4 font-medium text-mono-100">Fidme</td><td className="py-3 px-4">Carte tampon</td><td className="py-3 px-4">Gratuit-20 EUR</td><td className="py-3 px-4">Simplicité, app populaire FR</td><td className="py-3 px-4">Petits restaurants</td></tr>
                <tr className="bg-mono-1000"><td className="py-3 px-4 font-medium text-mono-100">Stampt</td><td className="py-3 px-4">Carte tampon</td><td className="py-3 px-4">15-30 EUR</td><td className="py-3 px-4">CRM intégré, analytics</td><td className="py-3 px-4">Bistrots, cafés</td></tr>
                <tr className="bg-white"><td className="py-3 px-4 font-medium text-mono-100">LoyalGuru</td><td className="py-3 px-4">Programme à points</td><td className="py-3 px-4">50-150 EUR</td><td className="py-3 px-4">Plateforme complète, FR</td><td className="py-3 px-4">Brasseries, chaînes</td></tr>
                <tr className="bg-mono-1000"><td className="py-3 px-4 font-medium text-mono-100">Como</td><td className="py-3 px-4">CRM + Loyalty</td><td className="py-3 px-4">120-300 EUR</td><td className="py-3 px-4">Segmentation IA, campagnes auto</td><td className="py-3 px-4">Restaurants {'>'}200 couverts</td></tr>
                <tr className="bg-white"><td className="py-3 px-4 font-medium text-mono-100">Tiller</td><td className="py-3 px-4">Caisse + fidélité</td><td className="py-3 px-4">59-189 EUR</td><td className="py-3 px-4">Tout-en-un, support FR fort</td><td className="py-3 px-4">Multi-canal</td></tr>
                <tr className="bg-mono-1000"><td className="py-3 px-4 font-medium text-mono-100">Zelty</td><td className="py-3 px-4">Caisse + fidélité</td><td className="py-3 px-4">49-129 EUR</td><td className="py-3 px-4">Hospitalité FR, intégrations larges</td><td className="py-3 px-4">Restaurants traditionnels</td></tr>
                <tr className="bg-white"><td className="py-3 px-4 font-medium text-mono-100">Brevo (ex Sendinblue)</td><td className="py-3 px-4">Email + SMS</td><td className="py-3 px-4">19-69 EUR</td><td className="py-3 px-4">FR natif, prix attractif</td><td className="py-3 px-4">Campagnes SMS/Email</td></tr>
                <tr className="bg-mono-1000"><td className="py-3 px-4 font-medium text-mono-100">Mailchimp</td><td className="py-3 px-4">Email marketing</td><td className="py-3 px-4">0-50 EUR</td><td className="py-3 px-4">Gratuit jusqu'à 500 contacts</td><td className="py-3 px-4">Petites bases</td></tr>
                <tr className="bg-white"><td className="py-3 px-4 font-medium text-mono-100">TheFork Manager</td><td className="py-3 px-4">Réservation + CRM</td><td className="py-3 px-4">Variable</td><td className="py-3 px-4">Plus large réseau FR</td><td className="py-3 px-4">Restaurants gastro/brasseries</td></tr>
                <tr className="bg-mono-1000"><td className="py-3 px-4 font-medium text-mono-100">Sevenrooms</td><td className="py-3 px-4">Réservation + CRM</td><td className="py-3 px-4">200-500 EUR</td><td className="py-3 px-4">Données fines, premium</td><td className="py-3 px-4">Étoiles, hôtels</td></tr>
              </tbody>
            </table>
          </div>

          <div className="prose-content mt-8">
            <p>
              <strong>Stratégie d'intégration recommandée :</strong> partez de votre caisse (Tiller,
              Zelty, ou Lightspeed). Si elle intègre nativement un module fidélité, utilisez-le des
              le départ pour éviter la double saisie. Ajoutez Brevo ou Mailchimp pour les campagnes
              email/SMS automatisées. Pour les restaurants gastronomiques ou {'>'}200 couverts,
              basculez vers Como ou Sevenrooms pour la segmentation fine.
            </p>
          </div>
        </section>

        <BlogAuthor publishedDate="2026-05-08" updatedDate="2026-05-26" readTime="14 min" variant="footer" />

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
              Fidélisez vos clients ET maîtrisez vos marges
            </h2>
            <p className="text-teal-100 text-lg max-w-xl mx-auto mb-3 leading-relaxed">
              RestauMargin centralise le suivi de votre food cost, votre ticket moyen, vos KPI de
              fidélisation et la rentabilité de chaque plat. Pour que chaque habitué soit réellement
              rentable.
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
                to="/login"
                className="inline-flex items-center gap-2 px-8 py-4 border-2 border-white/30 text-white font-semibold rounded-full hover:bg-white/10 transition-colors"
              >
                Se connecter
              </Link>
            </div>
          </div>
        </section>

        {/* Articles complementaires */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold text-mono-100 mb-6">Pour aller plus loin</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Link to="/blog/calcul-marge-restaurant" className="bg-mono-1000 border border-mono-900 rounded-xl p-5 hover:border-teal-300 hover:shadow-sm transition-all group">
              <h3 className="font-semibold text-mono-100 mb-1.5 group-hover:text-teal-700 transition-colors">Calcul marge restaurant</h3>
              <p className="text-xs text-mono-500">Food cost, marge brute et nette : guide complet.</p>
            </Link>
            <Link to="/blog/augmenter-ticket-moyen-restaurant" className="bg-mono-1000 border border-mono-900 rounded-xl p-5 hover:border-teal-300 hover:shadow-sm transition-all group">
              <h3 className="font-semibold text-mono-100 mb-1.5 group-hover:text-teal-700 transition-colors">Augmenter le ticket moyen</h3>
              <p className="text-xs text-mono-500">10 leviers d'upsell et cross-sell.</p>
            </Link>
            <Link to="/blog/menu-engineering-boston-matrix" className="bg-mono-1000 border border-mono-900 rounded-xl p-5 hover:border-teal-300 hover:shadow-sm transition-all group">
              <h3 className="font-semibold text-mono-100 mb-1.5 group-hover:text-teal-700 transition-colors">Menu engineering Boston Matrix</h3>
              <p className="text-xs text-mono-500">Stars, vaches à lait, dilemmes, poids morts.</p>
            </Link>
            <Link to="/blog/taux-occupation-restaurant" className="bg-mono-1000 border border-mono-900 rounded-xl p-5 hover:border-teal-300 hover:shadow-sm transition-all group">
              <h3 className="font-semibold text-mono-100 mb-1.5 group-hover:text-teal-700 transition-colors">Taux d'occupation restaurant</h3>
              <p className="text-xs text-mono-500">Calcul, benchmarks et 8 leviers d'amélioration.</p>
            </Link>
            <Link to="/blog/construire-carte-vins-restaurant" className="bg-mono-1000 border border-mono-900 rounded-xl p-5 hover:border-teal-300 hover:shadow-sm transition-all group">
              <h3 className="font-semibold text-mono-100 mb-1.5 group-hover:text-teal-700 transition-colors">Carte des vins restaurant</h3>
              <p className="text-xs text-mono-500">Coefficients, rotation cave, présentation.</p>
            </Link>
            <Link to="/blog/fixer-prix-carte-restaurant" className="bg-mono-1000 border border-mono-900 rounded-xl p-5 hover:border-teal-300 hover:shadow-sm transition-all group">
              <h3 className="font-semibold text-mono-100 mb-1.5 group-hover:text-teal-700 transition-colors">Fixer les prix de la carte</h3>
              <p className="text-xs text-mono-500">Pricing psychologique, ancrage, benchmarks.</p>
            </Link>
            <Link to="/blog/prix-de-vente-restaurant" className="bg-mono-1000 border border-mono-900 rounded-xl p-5 hover:border-teal-300 hover:shadow-sm transition-all group">
              <h3 className="font-semibold text-mono-100 mb-1.5 group-hover:text-teal-700 transition-colors">Calcul du prix de vente</h3>
              <p className="text-xs text-mono-500">Méthode coefficient et marge cible.</p>
            </Link>
            <Link to="/login" className="bg-mono-1000 border border-mono-900 rounded-xl p-5 hover:border-teal-300 hover:shadow-sm transition-all group">
              <h3 className="font-semibold text-mono-100 mb-1.5 group-hover:text-teal-700 transition-colors">Essayer RestauMargin</h3>
              <p className="text-xs text-mono-500">Essai gratuit 7 jours, sans engagement.</p>
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

function MetricCard({ icon, title, color, desc, formula, target }: {
  icon: React.ReactNode; title: string; color: string; desc: string; formula: string; target: string;
}) {
  const colors: Record<string, { bg: string; text: string; badge: string }> = {
    emerald: { bg: 'bg-emerald-50', text: 'text-emerald-700', badge: 'bg-emerald-100 text-emerald-700' },
    amber: { bg: 'bg-amber-50', text: 'text-amber-700', badge: 'bg-amber-100 text-amber-700' },
    blue: { bg: 'bg-blue-50', text: 'text-blue-700', badge: 'bg-blue-100 text-blue-700' },
  };
  const c = colors[color] || colors.emerald;

  return (
    <div className={`${c.bg} rounded-2xl p-6 border border-mono-975`}>
      <div className={`w-10 h-10 ${c.badge} rounded-lg flex items-center justify-center mb-3`}>
        {icon}
      </div>
      <h3 className="font-bold text-mono-100 mb-2">{title}</h3>
      <p className="text-sm text-mono-400 leading-relaxed mb-4">{desc}</p>
      <div className="space-y-1.5 text-xs">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-mono-500 font-medium">Formule :</span>
          <code className="bg-white/70 px-2 py-0.5 rounded text-mono-350 text-[10px]">{formula}</code>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-mono-500 font-medium">Cible :</span>
          <span className={`${c.badge} px-2 py-0.5 rounded font-semibold`}>{target}</span>
        </div>
      </div>
    </div>
  );
}

function CollectCard({ icon, moment, channel, data, rate }: {
  icon: React.ReactNode; moment: string; channel: string; data: string; rate: string;
}) {
  return (
    <div className="bg-white border border-mono-900 rounded-xl p-5">
      <div className="w-10 h-10 bg-teal-50 text-teal-600 rounded-lg flex items-center justify-center mb-3">
        {icon}
      </div>
      <h4 className="font-bold text-mono-100 mb-1">{moment}</h4>
      <p className="text-xs text-mono-500 mb-1"><strong>Canal :</strong> {channel}</p>
      <p className="text-xs text-mono-500 mb-2"><strong>Données :</strong> {data}</p>
      <p className="text-xs text-teal-700 font-semibold">Taux : {rate}</p>
    </div>
  );
}

function ErreurCard({ number, title, desc }: { number: number; title: string; desc: string }) {
  return (
    <div className="bg-white border border-mono-900 rounded-xl p-5 sm:p-6 flex gap-4">
      <div className="w-10 h-10 bg-red-50 text-red-600 rounded-xl flex items-center justify-center shrink-0 font-bold text-lg">
        {number}
      </div>
      <div>
        <h3 className="font-semibold text-mono-100 mb-1.5">{title}</h3>
        <p className="text-sm text-mono-400 leading-relaxed">{desc}</p>
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
