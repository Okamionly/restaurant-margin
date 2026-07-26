import { Link } from 'react-router-dom';
import {
  ChefHat,
  BookOpen,
  Calculator,
  PieChart,
  TrendingUp,
  BarChart3,
  Target,
  Zap,
  ArrowRight,
  AlertTriangle,
  Lightbulb,
  DollarSign,
  ListChecks,
  Users,
  CalendarDays,
  LineChart,
  Building2,
  Sparkles,
} from 'lucide-react';
import SEOHead, { buildFAQSchema, buildBreadcrumbSchema } from '../components/SEOHead';
import BlogArticleHero from '../components/blog/BlogArticleHero';
import BlogAuthor from '../components/BlogAuthor';

/* ════════════════════════════════════════════════════════════════════
   Blog SEO — "Chiffre d'affaires restaurant : comment le calculer,
   l'analyser et l'augmenter"
   Mots-clés cibles :
    - chiffre d'affaires restaurant
    - CA restaurant calcul
    - comment calculer chiffre affaires restaurant
    - CA prévisionnel restaurant
    - CA jour moyen restaurant
    - CA panier moyen × couverts
   ~3 200 mots — theme W&B, fond blanc, typo lisible
   ════════════════════════════════════════════════════════════════════ */

const faqItems = [
  {
    question: "Comment calculer le chiffre d'affaires d'un restaurant ?",
    answer:
      "La formule de base est : CA = Couverts × Ticket moyen × Services × Jours d'ouverture. Pour un restaurant de 50 couverts à 60 % de remplissage, ticket moyen de 28 € HT, 2 services par jour et 25 jours d'ouverture : 50 × 0,60 × 28 × 2 × 25 = 42 000 € HT/mois. Ajoutez le CA livraison et événementiel pour obtenir le CA total.",
  },
  {
    question: "Quelle est la différence entre CA HT et CA TTC ?",
    answer:
      "Le CA TTC est ce que le client paie. Le CA HT est ce qui vous appartient réellement, hors TVA reversée à l'État. En restauration française, la TVA est de 10 % sur la nourriture/boissons sans alcool consommées sur place, et de 20 % sur l'alcool et la livraison via plateforme. Tous les ratios de gestion (food cost, marge, ratio personnel) se calculent obligatoirement en HT.",
  },
  {
    question: "Comment estimer le CA prévisionnel d'un restaurant ?",
    answer:
      "Méthode en 6 étapes : (1) capacité d'accueil maximale (couverts × services × jours), (2) taux d'occupation réaliste par service (40-65 % pour un nouveau resto), (3) ticket moyen prévisionnel cohérent avec le positionnement, (4) nombre de rotations par service, (5) ajout des canaux annexes (livraison, événementiel, traiteur), (6) saisonnalité mensuelle. Calculez toujours 3 scénarios : pessimiste (60 % de l'objectif), réaliste (objectif), optimiste (110 %).",
  },
  {
    question: "Quel est le CA moyen d'un restaurant en France ?",
    answer:
      "Le CA moyen annuel d'un restaurant traditionnel français se situe autour de 350 000 à 450 000 € HT (source : Insee, panorama de la restauration 2024). Un bistrot urbain de 40-60 couverts atteint en moyenne 380 000 à 600 000 €. Une brasserie 90-150 couverts vise 800 000 à 1 500 000 €. Un gastronomique étoilé peut dépasser 1,5 M€ malgré 30-40 couverts seulement.",
  },
  {
    question: "Comment calculer le CA jour moyen d'un restaurant ?",
    answer:
      "CA jour moyen = CA mensuel total / Nombre de jours d'ouverture dans le mois. Exemple : 48 000 € HT sur 25 jours = 1 920 € HT/jour. Il est aussi utile de calculer le CA jour moyen par jour de semaine (mercredi vs samedi peuvent varier de 1 à 4) pour identifier les créneaux à activer. Le CA jour permet aussi de surveiller la dérive : si vous descendez sous 1 500 € sur 5 jours consécutifs, alerte rouge.",
  },
  {
    question: "Quel est le seuil de CA pour qu'un restaurant soit rentable ?",
    answer:
      "Il n'y a pas de seuil universel. Le seuil de rentabilité = Charges fixes / Taux de marge sur coûts variables. Pour un restaurant urbain avec 18 000 € de charges fixes mensuelles et un taux de marge sur coûts variables de 35 %, le seuil est : 18 000 / 0,35 ≈ 51 500 € HT/mois, soit environ 620 000 €/an. En dessous, vous perdez de l'argent même si le CA est en croissance.",
  },
  {
    question: "Comment augmenter le chiffre d'affaires d'un restaurant ?",
    answer:
      "5 leviers principaux : (1) ouvrir un nouveau créneau (brunch dimanche +12-18 %), (2) augmenter le ticket moyen via upselling et menu engineering (+5-12 %), (3) améliorer le taux d'occupation sur les créneaux faibles (offres mardi/mercredi), (4) développer un canal livraison rentable (carte adaptée), (5) commercialiser la privatisation et l'événementiel. Combiner 3 leviers permet d'augmenter le CA de 25-30 % en 12 mois.",
  },
  {
    question: "CA, marge brute, EBE : quelles différences ?",
    answer:
      "Le CA est le total des ventes HT. La marge brute = CA - Coût matières premières (typiquement 65-75 % du CA en restauration). L'EBE (Excédent Brut d'Exploitation) = Marge brute - Salaires - Charges externes (loyer, énergie, etc.). C'est le vrai indicateur de performance opérationnelle. Un EBE sain en restauration se situe entre 10 % et 20 % du CA HT.",
  },
  {
    question: "À quelle fréquence faut-il suivre son chiffre d'affaires ?",
    answer:
      "Quotidiennement pour le pilotage opérationnel : CA du jour, ticket moyen, nombre de couverts, comparaison avec le même jour de la semaine précédente. Hebdomadairement pour les tendances et les actions correctives. Mensuellement pour le pilotage de gestion : analyse vs prévisionnel, vs N-1, ratios. Les meilleurs restaurateurs ont un tableau de bord quotidien automatisé.",
  },
  {
    question: "Comment calculer le CA prévisionnel pour un business plan ?",
    answer:
      "Pour un business plan crédible : (1) étude de marché locale (concurrence, zone de chalandise), (2) capacité réaliste mois 1-3 (35-45 % d'occupation, montée en charge progressive), (3) capacité régime mois 6-12 (55-65 % d'occupation), (4) ticket moyen aligné sur le positionnement et la zone, (5) saisonnalité (-15 % janvier-février, +20 % décembre, etc.), (6) trois scénarios (low/mid/high). Un investisseur veut voir le scénario pessimiste tenir le seuil de rentabilité.",
  },
];

export default function BlogChiffreAffaires() {
  const faqSchema = buildFAQSchema(faqItems);
  const breadcrumbSchema = buildBreadcrumbSchema([
    { name: 'Accueil', url: 'https://www.restaumargin.fr/' },
    { name: 'Blog', url: 'https://www.restaumargin.fr/blog' },
    {
      name: "Chiffre d'affaires restaurant",
      url: 'https://www.restaumargin.fr/blog/chiffre-affaires-restaurant-comment-calculer',
    },
  ]);

  const howToSchema = {
    '@context': 'https://schema.org',
    '@type': 'HowTo',
    name: "Comment calculer le chiffre d'affaires prévisionnel d'un restaurant en 6 étapes",
    description:
      "Méthode pas-à-pas pour estimer le chiffre d'affaires prévisionnel d'un restaurant : capacité, occupation, ticket moyen, rotations, canaux annexes, saisonnalité.",
    totalTime: 'PT30M',
    tool: ['Plan de salle', 'Étude de marché locale', 'Tableur ou logiciel RestauMargin'],
    step: [
      {
        '@type': 'HowToStep',
        name: "Définir la capacité d'accueil",
        text: "Comptez le nombre de couverts assis maximum (PLU/sécurité incendie), multiplié par le nombre de services par jour et le nombre de jours d'ouverture mensuels.",
      },
      {
        '@type': 'HowToStep',
        name: "Estimer le taux d'occupation",
        text: 'Pour un nouveau restaurant, prévoyez 35-45 % les 3 premiers mois, puis 55-65 % en régime de croisière. Variez par service (midi semaine souvent plus faible que dîner week-end).',
      },
      {
        '@type': 'HowToStep',
        name: 'Calculer le ticket moyen prévisionnel',
        text: "Alignez le ticket moyen sur votre positionnement et la zone de chalandise. Bistrot urbain : 22-32 € TTC. Brasserie : 28-42 €. Gastronomique : 70-180 €. Convertissez toujours en HT (/ 1,10) pour les calculs.",
      },
      {
        '@type': 'HowToStep',
        name: 'Intégrer les rotations',
        text: 'Un service peut accueillir plusieurs rotations. Bistrot midi : 1,2 à 1,5 rotation. Brasserie soir week-end : jusqu\'à 2 rotations. La rotation augmente la capacité réelle sans agrandir la salle.',
      },
      {
        '@type': 'HowToStep',
        name: 'Ajouter les canaux annexes',
        text: 'Livraison (10-25 % du CA), événementiel/privatisations (5-15 %), traiteur/click & collect (5-10 %). Ces canaux ont des marges spécifiques à modéliser séparément.',
      },
      {
        '@type': 'HowToStep',
        name: 'Appliquer la saisonnalité',
        text: 'Pondérez chaque mois par son coefficient saisonnier : janvier-février -15 à -20 %, juillet-août -5 à -20 % (selon zone), décembre +20 %, mai-juin et septembre-octobre stables. Vérifiez les vacances scolaires de votre zone.',
      },
    ],
  };

  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline:
      "Chiffre d'affaires restaurant : comment le calculer, l'analyser et l'augmenter en 2026",
    description:
      "Guide complet du chiffre d'affaires restaurant : formules CA HT/TTC, benchmarks par type d'établissement, calcul prévisionnel, KPIs quotidiens, saisonnalité et leviers de croissance.",
    image: 'https://www.restaumargin.fr/og-image.png',
    author: {
      '@type': 'Organization',
      name: 'RestauMargin',
      url: 'https://www.restaumargin.fr/a-propos',
    },
    publisher: {
      '@type': 'Organization',
      name: 'RestauMargin',
      logo: { '@type': 'ImageObject', url: 'https://www.restaumargin.fr/icon-512.png' },
    },
    datePublished: '2026-04-27',
    dateModified: '2026-05-26',
    wordCount: 3200,
    inLanguage: 'fr-FR',
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': 'https://www.restaumargin.fr/blog/chiffre-affaires-restaurant-comment-calculer',
    },
  };

  return (
    <div className="min-h-screen" style={{ fontFamily: "'Inter', system-ui, sans-serif" }}>
      <SEOHead
        title="Chiffre d'affaires restaurant : calcul, benchmarks, prévisionnel (guide 2026)"
        description="Comment calculer le chiffre d'affaires d'un restaurant : formules CA HT/TTC, benchmarks par type (bistrot, brasserie, gastro), CA prévisionnel en 6 étapes, KPIs quotidiens et leviers d'augmentation."
        path="/blog/chiffre-affaires-restaurant-comment-calculer"
        type="article"
        schema={[faqSchema, breadcrumbSchema, howToSchema, articleSchema]}
      />

      {/* Navbar */}
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
          <Link to="/" className="hover:text-teal-600">
            Accueil
          </Link>
          <span>/</span>
          <Link to="/blog" className="hover:text-teal-600">
            Blog
          </Link>
          <span>/</span>
          <span className="text-mono-100 font-medium">Chiffre d'affaires restaurant</span>
        </div>
      </div>

      {/* Hero */}
      <BlogArticleHero
        category="Pilotage"
        readTime="16 min"
        date="Avril 2026"
        title="Chiffre d'affaires restaurant : comment le calculer, l'analyser et l'augmenter"
        accentWord="chiffre d'affaires"
        subtitle="Formules, benchmarks par type d'établissement, calcul du CA prévisionnel en 6 étapes, KPIs quotidiens et 5 leviers concrets pour faire croître votre CA de 25 % en 12 mois."
      />

      {/* Body */}
      <main className="max-w-4xl mx-auto px-6 sm:px-10 lg:px-12 pb-24 pt-8 bg-white relative z-10 rounded-t-3xl shadow-xl">
        <BlogAuthor publishedDate="2026-04-27" updatedDate="2026-05-26" readTime="16 min" variant="header" />

        {/* Encadré formules rapides (featured snippet) */}
        <div className="mt-10 bg-gradient-to-br from-teal-600 to-teal-700 rounded-2xl p-6 sm:p-8 text-white shadow-xl">
          <div className="flex items-center gap-2 mb-3">
            <Zap className="w-5 h-5" />
            <span className="text-xs font-bold uppercase tracking-wider text-teal-100">
              Formules essentielles CA restaurant
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold mb-4">À retenir absolument</h2>
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-5 space-y-3 font-mono text-sm sm:text-base">
            <div className="flex items-start gap-2">
              <span className="text-teal-200 font-bold">1.</span>
              <span>
                <strong className="text-white">CA salle</strong> = Couverts × Ticket moyen HT × Services × Jours
              </span>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-teal-200 font-bold">2.</span>
              <span>
                <strong className="text-white">CA HT</strong> = CA TTC / 1,10 (nourriture sur place) ou / 1,20 (alcool, livraison plateforme)
              </span>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-teal-200 font-bold">3.</span>
              <span>
                <strong className="text-white">CA jour moyen</strong> = CA mensuel HT / Jours d'ouverture
              </span>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-teal-200 font-bold">4.</span>
              <span>
                <strong className="text-white">CA prévisionnel</strong> = Capacité × Taux d'occupation × Ticket moyen × Rotations
              </span>
            </div>
          </div>
          <p className="mt-4 text-teal-100 text-sm">
            Tous les ratios (food cost, marge, EBE, ratio personnel) se calculent en HT. Le TTC ne sert qu'à la trésorerie.
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
              { href: '#definitions', label: "Définitions : CA HT, CA TTC, CA net, CA brut" },
              { href: '#formules', label: 'Les formules de calcul du CA restaurant' },
              { href: '#composantes', label: 'Les composantes du CA : salle, livraison, événementiel' },
              { href: '#benchmarks', label: 'Benchmarks CA par type de restaurant' },
              { href: '#villes', label: 'Benchmarks CA par ville (Paris, Lyon, province)' },
              { href: '#previsionnel', label: 'CA prévisionnel : la méthode en 6 étapes' },
              { href: '#exemple-previsionnel', label: 'Exemple complet de CA prévisionnel' },
              { href: '#saisonnalite', label: "Saisonnalité : l'impact sur le CA mensuel" },
              { href: '#kpis', label: 'KPIs quotidiens à tracker pour piloter le CA' },
              { href: '#analyse', label: 'Analyse fine : par service, jour, canal' },
              { href: '#rentabilite', label: 'Pourquoi un gros CA peut être déficitaire' },
              { href: '#leviers', label: 'Les 5 leviers concrets pour augmenter le CA' },
              { href: '#erreurs', label: '5 erreurs courantes dans le suivi du CA' },
              { href: '#faq', label: 'Questions fréquentes' },
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
          <p className="text-[#374151] text-lg leading-relaxed mb-10">
            Le chiffre d'affaires d'un restaurant est l'indicateur le plus visible — mais aussi le plus
            trompeur. Un restaurant à 600 K€ de CA peut perdre 40 K€ par an, tandis qu'un autre à 380 K€
            dégage 76 K€ d'EBE. Encore faut-il calculer le CA correctement (HT vs TTC, plusieurs taux de
            TVA), l'analyser finement (midi vs soir, jour de semaine, canal de vente) et savoir l'augmenter
            avec méthode. Ce guide complet vous donne toutes les formules, les benchmarks réels par type
            d'établissement et la méthode en 6 étapes pour calculer un CA prévisionnel solide.
          </p>

          {/* ═══════ SECTION 1 : Définitions ═══════ */}
          <section id="definitions" className="mb-16">
            <SectionHeading icon={<Calculator className="w-6 h-6" />} number="1">
              Définitions : CA HT, CA TTC, CA net, CA brut
            </SectionHeading>

            <p className="text-[#374151] leading-relaxed mb-6">
              Avant toute analyse, il faut maîtriser le vocabulaire. Quatre notions reviennent en permanence
              dans le pilotage d'un restaurant — les confondre fausse l'ensemble de votre gestion.
            </p>

            <div className="grid gap-4 sm:grid-cols-2 mb-8">
              <DefinitionCard
                title="CA TTC"
                color="amber"
                desc="Total encaissé par le restaurant, taxes comprises. C'est le montant affiché sur les additions et qui transite dans la caisse. Utile uniquement pour la trésorerie immédiate."
                formula="Σ Additions clients"
              />
              <DefinitionCard
                title="CA HT"
                color="emerald"
                desc="Chiffre d'affaires hors taxes. C'est le CA qui appartient réellement à l'entreprise (la TVA collectée est reversée à l'État). Base de tous les ratios de gestion."
                formula="CA TTC / (1 + Taux TVA)"
              />
              <DefinitionCard
                title="CA brut"
                color="blue"
                desc="CA encaissé avant déduction des commissions plateformes (Uber Eats 28-30 %, Deliveroo 25-30 %), des annulations et des remises commerciales. Important pour suivre le volume d'activité réel."
                formula="CA TTC + commissions + remises"
              />
              <DefinitionCard
                title="CA net"
                color="teal"
                desc="CA réellement perçu après déduction des commissions, frais bancaires et remises. C'est le vrai cash qui entre. Indispensable pour les canaux livraison où la commission est importante."
                formula="CA brut - commissions - remises"
              />
            </div>

            <h3 className="text-xl font-bold text-mono-100 mb-3">Les deux taux de TVA en restauration</h3>
            <p className="text-[#374151] leading-relaxed mb-4">
              En France, la restauration applique deux taux de TVA simultanément, et un restaurateur doit
              savoir les ventiler correctement pour ne pas se tromper dans son CA HT :
            </p>
            <ul className="space-y-2 text-[#374151] mb-6">
              <li className="flex items-start gap-2">
                <span className="w-2 h-2 rounded-full bg-teal-500 mt-2 flex-shrink-0" />
                <span>
                  <strong>10 %</strong> sur la nourriture et les boissons sans alcool consommées sur place
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-2 h-2 rounded-full bg-teal-500 mt-2 flex-shrink-0" />
                <span>
                  <strong>20 %</strong> sur les boissons alcoolisées et sur les livraisons effectuées via
                  une plateforme tierce (Uber Eats, Deliveroo, Just Eat)
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-2 h-2 rounded-full bg-teal-500 mt-2 flex-shrink-0" />
                <span>
                  <strong>5,5 %</strong> sur la vente à emporter de produits alimentaires destinés à une
                  consommation différée (sandwichs froids, plats à réchauffer)
                </span>
              </li>
            </ul>

            <h3 className="text-xl font-bold text-mono-100 mb-3 mt-8">Exemple concret : addition typique</h3>
            <p className="text-[#374151] leading-relaxed mb-4">
              Une addition à 49 € TTC comprenant entrée 9 + plat 22 + dessert 8 + vin 7 + café 3 :
            </p>
            <div className="bg-mono-975 rounded-xl p-5 mb-6 font-mono text-sm text-mono-100 space-y-1">
              <div>Nourriture (entrée + plat + dessert) = 39 € TTC → 35,45 € HT (TVA 10 %)</div>
              <div>Boissons (vin + café) = 10 € TTC → 8,33 € HT (TVA 20 %)</div>
              <div className="pt-2 border-t border-mono-900">
                <strong>CA HT total = 43,78 €</strong> · TVA collectée = 5,22 € · CA TTC = 49,00 €
              </div>
            </div>

            <Callout type="warning">
              <strong>Règle d'or :</strong> tous les calculs de marge, food cost, ratio personnel, EBE et
              KPIs de pilotage se font <strong>obligatoirement en HT</strong>. Raisonner en TTC fausse le
              food cost de 9 à 10 points et donne une vision irréaliste de la rentabilité.
            </Callout>
          </section>

          {/* ═══════ SECTION 2 : Formules ═══════ */}
          <section id="formules" className="mb-16">
            <SectionHeading icon={<Calculator className="w-6 h-6" />} number="2">
              Les formules de calcul du CA restaurant
            </SectionHeading>

            <p className="text-[#374151] leading-relaxed mb-6">
              Le chiffre d'affaires d'un restaurant peut être calculé de plusieurs façons selon ce que vous
              voulez mesurer : production maximale, performance réelle, ou potentiel à atteindre. Voici les
              cinq formules à connaître absolument.
            </p>

            <div className="space-y-5">
              <FormulaCard
                title="Formule de base : CA salle"
                formula="CA = Couverts × Ticket moyen HT × Services × Jours"
                example="50 couverts × 0,60 (taux occup.) × 28 € × 2 services × 25 jours = 42 000 € HT/mois"
              />
              <FormulaCard
                title="CA panier moyen × couverts"
                formula="CA = Nombre de couverts servis × Ticket moyen HT"
                example="1 500 couverts/mois × 28 € HT = 42 000 € HT/mois"
              />
              <FormulaCard
                title="CA livraison net (après commission)"
                formula="CA net = Commandes × Panier moyen HT × (1 - Commission plateforme)"
                example="35 cmd/jour × 20 € HT × 25 j × (1 - 0,28) = 12 600 € HT/mois net"
              />
              <FormulaCard
                title="CA jour moyen"
                formula="CA jour moyen = CA mensuel HT / Jours d'ouverture"
                example="48 000 € HT / 25 jours = 1 920 € HT/jour"
              />
              <FormulaCard
                title="CA par mètre carré (ratio sectoriel)"
                formula="CA / m² = CA annuel HT / Surface totale en m²"
                example="600 000 € / 120 m² = 5 000 € HT/m²/an (benchmark : 3 000 à 8 000 €)"
              />
            </div>
          </section>

          {/* ═══════ SECTION 3 : Composantes ═══════ */}
          <section id="composantes" className="mb-16">
            <SectionHeading icon={<PieChart className="w-6 h-6" />} number="3">
              Les composantes du CA : salle, livraison, événementiel
            </SectionHeading>

            <p className="text-[#374151] leading-relaxed mb-6">
              Un restaurant moderne tire rarement 100 % de son CA de la salle. Trois canaux principaux
              cohabitent, chacun avec sa logique de marge propre. La connaissance fine de leur poids dans
              votre mix est essentielle pour piloter la rentabilité.
            </p>

            <div className="grid gap-6 sm:grid-cols-3 mb-6">
              <CanalCard
                icon={<Users className="w-5 h-5" />}
                title="Salle"
                color="emerald"
                weight="60-85 %"
                desc="Canal historique, le plus rentable. Vins, desserts et cafés à forte marge, pas de commission externe. Ticket moyen plus élevé, expérience plus complète."
                margin="EBE 12-22 %"
              />
              <CanalCard
                icon={<Zap className="w-5 h-5" />}
                title="Livraison"
                color="amber"
                weight="10-30 %"
                desc="Uber Eats, Deliveroo, Just Eat. Commission de 25-30 % qui rogne la marge. Au-delà de 30 % du CA, dépendance dangereuse aux plateformes."
                margin="EBE 3-8 %"
              />
              <CanalCard
                icon={<Building2 className="w-5 h-5" />}
                title="Événementiel"
                color="blue"
                weight="5-20 %"
                desc="Mariages, séminaires, anniversaires, privatisations. Tickets élevés, prévision facile, peu de gâchis. Marges souvent les meilleures du mix."
                margin="EBE 30-45 %"
              />
            </div>

            <Callout type="info">
              <strong>Mix recommandé :</strong> 70-75 % salle + 15-20 % livraison + 10-15 % événementiel.
              Cette répartition équilibre rentabilité (salle), volume (livraison) et marge premium
              (événementiel) sans dépendance excessive à un canal.
            </Callout>
          </section>

          {/* ═══════ SECTION 4 : Benchmarks par type ═══════ */}
          <section id="benchmarks" className="mb-16">
            <SectionHeading icon={<BarChart3 className="w-6 h-6" />} number="4">
              Benchmarks CA par type de restaurant
            </SectionHeading>

            <p className="text-[#374151] leading-relaxed mb-6">
              Voici les fourchettes de CA annuel HT par type d'établissement, basées sur les données Insee,
              GIRA Conseil et l'observatoire UMIH. Ces chiffres permettent de situer votre restaurant par
              rapport à la moyenne du marché et de fixer des objectifs réalistes.
            </p>

            <div className="overflow-x-auto mb-6">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="bg-mono-975 text-mono-350">
                    <th className="text-left py-3 px-4 font-semibold rounded-tl-xl">Type de restaurant</th>
                    <th className="text-right py-3 px-4 font-semibold">Couverts</th>
                    <th className="text-right py-3 px-4 font-semibold">Ticket moyen TTC</th>
                    <th className="text-right py-3 px-4 font-semibold">CA annuel HT (médian)</th>
                    <th className="text-right py-3 px-4 font-semibold rounded-tr-xl">Fourchette</th>
                  </tr>
                </thead>
                <tbody className="text-mono-350">
                  <tr className="bg-white">
                    <td className="py-3 px-4 font-medium text-mono-100">Bistrot urbain</td>
                    <td className="py-3 px-4 text-right">40-60</td>
                    <td className="py-3 px-4 text-right">22-32 €</td>
                    <td className="py-3 px-4 text-right font-bold">450 000 €</td>
                    <td className="py-3 px-4 text-right text-xs">380-600 K€</td>
                  </tr>
                  <tr className="bg-mono-1000">
                    <td className="py-3 px-4 font-medium text-mono-100">Brasserie traditionnelle</td>
                    <td className="py-3 px-4 text-right">90-150</td>
                    <td className="py-3 px-4 text-right">28-42 €</td>
                    <td className="py-3 px-4 text-right font-bold">1 100 000 €</td>
                    <td className="py-3 px-4 text-right text-xs">800 K-1,5 M€</td>
                  </tr>
                  <tr className="bg-white">
                    <td className="py-3 px-4 font-medium text-mono-100">Restaurant gastronomique</td>
                    <td className="py-3 px-4 text-right">30-50</td>
                    <td className="py-3 px-4 text-right">70-180 €</td>
                    <td className="py-3 px-4 text-right font-bold">850 000 €</td>
                    <td className="py-3 px-4 text-right text-xs">600 K-2,5 M€</td>
                  </tr>
                  <tr className="bg-mono-1000">
                    <td className="py-3 px-4 font-medium text-mono-100">Pizzeria</td>
                    <td className="py-3 px-4 text-right">50-80</td>
                    <td className="py-3 px-4 text-right">18-26 €</td>
                    <td className="py-3 px-4 text-right font-bold">420 000 €</td>
                    <td className="py-3 px-4 text-right text-xs">300-700 K€</td>
                  </tr>
                  <tr className="bg-white">
                    <td className="py-3 px-4 font-medium text-mono-100">Fast-casual</td>
                    <td className="py-3 px-4 text-right">40-70</td>
                    <td className="py-3 px-4 text-right">13-22 €</td>
                    <td className="py-3 px-4 text-right font-bold">650 000 €</td>
                    <td className="py-3 px-4 text-right text-xs">450 K-1,2 M€</td>
                  </tr>
                  <tr className="bg-mono-1000">
                    <td className="py-3 px-4 font-medium text-mono-100">Restaurant étoilé Michelin</td>
                    <td className="py-3 px-4 text-right">25-40</td>
                    <td className="py-3 px-4 text-right">160-450 €</td>
                    <td className="py-3 px-4 text-right font-bold">1 800 000 €</td>
                    <td className="py-3 px-4 text-right text-xs">1,2-4 M€</td>
                  </tr>
                  <tr className="bg-white">
                    <td className="py-3 px-4 font-medium text-mono-100">Food truck</td>
                    <td className="py-3 px-4 text-right">–</td>
                    <td className="py-3 px-4 text-right">10-16 €</td>
                    <td className="py-3 px-4 text-right font-bold">180 000 €</td>
                    <td className="py-3 px-4 text-right text-xs">90-350 K€</td>
                  </tr>
                  <tr className="bg-mono-1000">
                    <td className="py-3 px-4 font-medium text-mono-100">Bar à vin / Tapas</td>
                    <td className="py-3 px-4 text-right">35-60</td>
                    <td className="py-3 px-4 text-right">25-38 €</td>
                    <td className="py-3 px-4 text-right font-bold">520 000 €</td>
                    <td className="py-3 px-4 text-right text-xs">350-800 K€</td>
                  </tr>
                  <tr className="bg-white">
                    <td className="py-3 px-4 font-medium text-mono-100">Sushi / asiatique</td>
                    <td className="py-3 px-4 text-right">40-70</td>
                    <td className="py-3 px-4 text-right">22-38 €</td>
                    <td className="py-3 px-4 text-right font-bold">560 000 €</td>
                    <td className="py-3 px-4 text-right text-xs">400 K-1 M€</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <p className="text-sm text-mono-500 italic">
              Sources : Insee panorama de la restauration 2024, GIRA Conseil, observatoire UMIH, baromètre
              Food Service Vision. Données moyennes France métropolitaine, hors Paris intra-muros (voir
              section ville plus bas).
            </p>
          </section>

          {/* ═══════ SECTION 5 : Benchmarks par ville ═══════ */}
          <section id="villes" className="mb-16">
            <SectionHeading icon={<Building2 className="w-6 h-6" />} number="5">
              Benchmarks CA par ville (Paris, Lyon, province)
            </SectionHeading>

            <p className="text-[#374151] leading-relaxed mb-6">
              La géographie change radicalement les niveaux de CA : un même format de bistrot peut avoir un
              CA 2 à 3 fois supérieur entre une petite ville et le centre de Paris. Voici les ordres de
              grandeur pour un bistrot urbain de 40-60 couverts.
            </p>

            <div className="overflow-x-auto mb-6">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="bg-mono-975 text-mono-350">
                    <th className="text-left py-3 px-4 font-semibold rounded-tl-xl">Ville / Zone</th>
                    <th className="text-right py-3 px-4 font-semibold">Ticket moyen TTC</th>
                    <th className="text-right py-3 px-4 font-semibold">CA annuel HT (bistrot 50 cv)</th>
                    <th className="text-right py-3 px-4 font-semibold">CA / m² (annuel)</th>
                    <th className="text-right py-3 px-4 font-semibold rounded-tr-xl">Loyer / m² / mois</th>
                  </tr>
                </thead>
                <tbody className="text-mono-350">
                  <tr className="bg-white">
                    <td className="py-3 px-4 font-medium text-mono-100">Paris intra-muros (1er-8e)</td>
                    <td className="py-3 px-4 text-right">32-48 €</td>
                    <td className="py-3 px-4 text-right font-bold">750 K-1,2 M€</td>
                    <td className="py-3 px-4 text-right">7 000-12 000 €</td>
                    <td className="py-3 px-4 text-right">120-280 €</td>
                  </tr>
                  <tr className="bg-mono-1000">
                    <td className="py-3 px-4 font-medium text-mono-100">Paris (autres arr. + Hauts-de-Seine)</td>
                    <td className="py-3 px-4 text-right">26-38 €</td>
                    <td className="py-3 px-4 text-right font-bold">550-850 K€</td>
                    <td className="py-3 px-4 text-right">5 500-8 500 €</td>
                    <td className="py-3 px-4 text-right">75-160 €</td>
                  </tr>
                  <tr className="bg-white">
                    <td className="py-3 px-4 font-medium text-mono-100">Lyon centre</td>
                    <td className="py-3 px-4 text-right">24-34 €</td>
                    <td className="py-3 px-4 text-right font-bold">450-700 K€</td>
                    <td className="py-3 px-4 text-right">4 500-7 000 €</td>
                    <td className="py-3 px-4 text-right">55-110 €</td>
                  </tr>
                  <tr className="bg-mono-1000">
                    <td className="py-3 px-4 font-medium text-mono-100">Bordeaux, Marseille, Lille, Toulouse</td>
                    <td className="py-3 px-4 text-right">22-32 €</td>
                    <td className="py-3 px-4 text-right font-bold">400-620 K€</td>
                    <td className="py-3 px-4 text-right">4 000-6 500 €</td>
                    <td className="py-3 px-4 text-right">45-95 €</td>
                  </tr>
                  <tr className="bg-white">
                    <td className="py-3 px-4 font-medium text-mono-100">Villes moyennes (50-200k hab.)</td>
                    <td className="py-3 px-4 text-right">19-28 €</td>
                    <td className="py-3 px-4 text-right font-bold">320-500 K€</td>
                    <td className="py-3 px-4 text-right">3 000-5 000 €</td>
                    <td className="py-3 px-4 text-right">30-65 €</td>
                  </tr>
                  <tr className="bg-mono-1000">
                    <td className="py-3 px-4 font-medium text-mono-100">Petites villes / rural touristique</td>
                    <td className="py-3 px-4 text-right">16-28 €</td>
                    <td className="py-3 px-4 text-right font-bold">220-400 K€</td>
                    <td className="py-3 px-4 text-right">2 500-4 500 €</td>
                    <td className="py-3 px-4 text-right">15-45 €</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <Callout type="info">
              <strong>Lecture du tableau :</strong> un CA élevé à Paris ne signifie pas une meilleure
              rentabilité. Le loyer / m² peut absorber tout l'écart de CA. Le ratio à surveiller est le
              CA / loyer : il doit être supérieur à 12-15× pour qu'un restaurant urbain soit viable.
            </Callout>
          </section>

          {/* ═══════ SECTION 6 : CA prévisionnel méthode ═══════ */}
          <section id="previsionnel" className="mb-16">
            <SectionHeading icon={<ListChecks className="w-6 h-6" />} number="6">
              CA prévisionnel : la méthode en 6 étapes
            </SectionHeading>

            <p className="text-[#374151] leading-relaxed mb-6">
              Calculer un CA prévisionnel solide est indispensable pour un business plan, un dossier de
              financement, ou simplement pour piloter une année. Voici la méthode pas-à-pas appliquée par
              les experts-comptables spécialisés en restauration.
            </p>

            <ol className="space-y-5 mb-6">
              {[
                {
                  title: "Définir la capacité d'accueil maximale",
                  body: "Comptez le nombre exact de couverts assis (PLU/sécurité incendie), multiplié par le nombre de services par jour (1 ou 2) et le nombre de jours d'ouverture mensuels. Exemple : 50 cv × 2 services × 25 jours = 2 500 couverts/mois maximum théorique.",
                },
                {
                  title: "Estimer le taux d'occupation réaliste",
                  body: "Pour un nouveau restaurant, prévoyez 35-45 % les 3 premiers mois (montée en notoriété), puis 55-65 % en régime de croisière. Variez par service : un midi en semaine peut être à 40 % alors qu'un samedi soir tourne à 85 %. La moyenne pondérée est ce qui compte.",
                },
                {
                  title: 'Fixer le ticket moyen prévisionnel',
                  body: "Alignez le ticket moyen sur votre positionnement et la zone de chalandise. Étude de la concurrence locale : visites mystère, observation des additions. Bistrot urbain : 22-32 € TTC. Brasserie : 28-42 €. Convertissez en HT (/ 1,10) pour les calculs internes.",
                },
                {
                  title: 'Intégrer les rotations par service',
                  body: "Un service de 2 heures peut accueillir plusieurs rotations selon la fluidité. Bistrot midi rapide : 1,2 à 1,5 rotation. Brasserie soir week-end : jusqu'à 2 rotations. La rotation augmente la capacité réelle sans agrandir la salle — c'est un levier souvent sous-exploité.",
                },
                {
                  title: 'Ajouter les canaux annexes',
                  body: "Livraison plateforme (10-25 % du CA), événementiel/privatisations (5-15 %), traiteur/click & collect (5-10 %), brunch dominical (5-12 %). Chaque canal a sa propre courbe d'apprentissage : prévoyez une montée en charge sur 6 à 12 mois.",
                },
                {
                  title: 'Appliquer la saisonnalité mensuelle',
                  body: "Pondérez chaque mois par son coefficient saisonnier. Janvier-février : -15 à -20 %. Juillet-août : -5 à -20 % (selon zone touristique ou affaires). Décembre : +20 à +30 % (fêtes). Mai-juin et septembre-octobre : stables, mois pivots du business plan.",
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

            <Callout type="warning">
              <strong>Astuce expert-comptable :</strong> calculez systématiquement <strong>3 scénarios</strong> :
              pessimiste (60 % de l'objectif), réaliste (objectif), optimiste (110 %). Un investisseur veut
              voir le scénario pessimiste tenir le seuil de rentabilité. Sinon, le projet n'est pas finançable.
            </Callout>
          </section>

          {/* ═══════ SECTION 7 : Exemple prévisionnel ═══════ */}
          <section id="exemple-previsionnel" className="mb-16">
            <SectionHeading icon={<BarChart3 className="w-6 h-6" />} number="7">
              Exemple complet de CA prévisionnel
            </SectionHeading>

            <p className="text-[#374151] leading-relaxed mb-6">
              Prenons un cas concret : bistrot urbain, 50 couverts, midi + soir, 6 jours sur 7 (fermé
              dimanche soir + lundi). Voici comment construire le prévisionnel mois par mois.
            </p>

            <h3 className="text-xl font-bold text-mono-100 mb-3">Hypothèses de base</h3>
            <div className="bg-mono-975 rounded-xl p-5 mb-6 font-mono text-sm text-mono-100 space-y-1">
              <div>Capacité : 50 couverts × 2 services × 25 jours = 2 500 couverts/mois maxi</div>
              <div>Taux d'occupation cible mois 6+ : 60 %</div>
              <div>Ticket moyen TTC : 32 € (soit 28,80 € HT)</div>
              <div>Rotations : 1,1 midi + 1,0 soir = moyenne 1,05</div>
              <div>Canaux annexes : livraison 21 %, événementiel 6 %</div>
            </div>

            <h3 className="text-xl font-bold text-mono-100 mb-3 mt-8">Calcul mois de croisière</h3>
            <div className="bg-mono-975 rounded-xl p-5 mb-6 font-mono text-sm text-mono-100 space-y-1">
              <div>CA salle = 50 × 0,60 × 28,80 × 2 × 25 × 1,05 = 45 360 € HT</div>
              <div>CA livraison net (35 cmd × 20 € × 25 j × 0,72) = 12 600 € HT</div>
              <div>CA événementiel (2 × 1 800 €) = 3 600 € HT</div>
              <div className="pt-2 font-bold border-t border-mono-900">Total mensuel : 61 560 € HT</div>
              <div className="font-bold">Total annuel projeté : 738 720 € HT</div>
            </div>

            <h3 className="text-xl font-bold text-mono-100 mb-3 mt-8">Saisonnalité appliquée (12 mois)</h3>
            <div className="overflow-x-auto mb-6">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="bg-mono-975 text-mono-350">
                    <th className="text-left py-3 px-4 font-semibold rounded-tl-xl">Mois</th>
                    <th className="text-right py-3 px-4 font-semibold">Coef. saisonnier</th>
                    <th className="text-right py-3 px-4 font-semibold">CA mensuel HT</th>
                    <th className="text-right py-3 px-4 font-semibold rounded-tr-xl">Note</th>
                  </tr>
                </thead>
                <tbody className="text-mono-350 text-xs sm:text-sm">
                  <tr className="bg-white"><td className="py-2 px-4 font-medium text-mono-100">Janvier</td><td className="py-2 px-4 text-right">0,80</td><td className="py-2 px-4 text-right font-bold">49 250 €</td><td className="py-2 px-4 text-right">Reprise lente</td></tr>
                  <tr className="bg-mono-1000"><td className="py-2 px-4 font-medium text-mono-100">Février</td><td className="py-2 px-4 text-right">0,85</td><td className="py-2 px-4 text-right font-bold">52 330 €</td><td className="py-2 px-4 text-right">Vacances scolaires</td></tr>
                  <tr className="bg-white"><td className="py-2 px-4 font-medium text-mono-100">Mars</td><td className="py-2 px-4 text-right">1,00</td><td className="py-2 px-4 text-right font-bold">61 560 €</td><td className="py-2 px-4 text-right">Base</td></tr>
                  <tr className="bg-mono-1000"><td className="py-2 px-4 font-medium text-mono-100">Avril</td><td className="py-2 px-4 text-right">1,05</td><td className="py-2 px-4 text-right font-bold">64 640 €</td><td className="py-2 px-4 text-right">Pâques + terrasses</td></tr>
                  <tr className="bg-white"><td className="py-2 px-4 font-medium text-mono-100">Mai</td><td className="py-2 px-4 text-right">1,10</td><td className="py-2 px-4 text-right font-bold">67 720 €</td><td className="py-2 px-4 text-right">Ponts + jours fériés</td></tr>
                  <tr className="bg-mono-1000"><td className="py-2 px-4 font-medium text-mono-100">Juin</td><td className="py-2 px-4 text-right">1,10</td><td className="py-2 px-4 text-right font-bold">67 720 €</td><td className="py-2 px-4 text-right">Pic terrasses</td></tr>
                  <tr className="bg-white"><td className="py-2 px-4 font-medium text-mono-100">Juillet</td><td className="py-2 px-4 text-right">0,90</td><td className="py-2 px-4 text-right font-bold">55 400 €</td><td className="py-2 px-4 text-right">Vacances (selon zone)</td></tr>
                  <tr className="bg-mono-1000"><td className="py-2 px-4 font-medium text-mono-100">Août</td><td className="py-2 px-4 text-right">0,80</td><td className="py-2 px-4 text-right font-bold">49 250 €</td><td className="py-2 px-4 text-right">Creux urbain</td></tr>
                  <tr className="bg-white"><td className="py-2 px-4 font-medium text-mono-100">Septembre</td><td className="py-2 px-4 text-right">1,05</td><td className="py-2 px-4 text-right font-bold">64 640 €</td><td className="py-2 px-4 text-right">Rentrée business</td></tr>
                  <tr className="bg-mono-1000"><td className="py-2 px-4 font-medium text-mono-100">Octobre</td><td className="py-2 px-4 text-right">1,05</td><td className="py-2 px-4 text-right font-bold">64 640 €</td><td className="py-2 px-4 text-right">Mois stable</td></tr>
                  <tr className="bg-white"><td className="py-2 px-4 font-medium text-mono-100">Novembre</td><td className="py-2 px-4 text-right">1,00</td><td className="py-2 px-4 text-right font-bold">61 560 €</td><td className="py-2 px-4 text-right">Base</td></tr>
                  <tr className="bg-mono-1000"><td className="py-2 px-4 font-medium text-mono-100">Décembre</td><td className="py-2 px-4 text-right">1,30</td><td className="py-2 px-4 text-right font-bold">80 030 €</td><td className="py-2 px-4 text-right">Fêtes + séminaires</td></tr>
                  <tr className="bg-teal-50">
                    <td className="py-3 px-4 font-bold text-teal-900">TOTAL ANNUEL</td>
                    <td className="py-3 px-4 text-right font-bold text-teal-900">1,00</td>
                    <td className="py-3 px-4 text-right font-bold text-teal-900">738 740 €</td>
                    <td className="py-3 px-4 text-right text-teal-900 text-xs">Scénario réaliste</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <p className="text-[#374151] leading-relaxed">
              Les 3 scénarios pour ce restaurant : <strong>pessimiste 443 K€</strong> (60 % de l'objectif),
              <strong> réaliste 739 K€</strong> (cas ci-dessus), <strong>optimiste 813 K€</strong> (110 %).
              C'est le scénario pessimiste qui doit couvrir au minimum les charges fixes pour valider la
              viabilité du projet.
            </p>
          </section>

          {/* ═══════ SECTION 8 : Saisonnalité ═══════ */}
          <section id="saisonnalite" className="mb-16">
            <SectionHeading icon={<CalendarDays className="w-6 h-6" />} number="8">
              Saisonnalité : l'impact sur le CA mensuel
            </SectionHeading>

            <p className="text-[#374151] leading-relaxed mb-6">
              La saisonnalité peut faire varier le CA d'un restaurant de 1 à 2,5 entre le mois le plus
              faible et le mois le plus fort. Cette variabilité doit être anticipée pour piloter la
              trésorerie et le planning des équipes.
            </p>

            <h3 className="text-xl font-bold text-mono-100 mb-3">Facteurs de saisonnalité</h3>
            <ul className="space-y-3 text-[#374151] mb-6">
              <li className="flex items-start gap-2">
                <span className="w-2 h-2 rounded-full bg-teal-400 mt-2 flex-shrink-0" />
                <span>
                  <strong>Calendrier scolaire</strong> : vacances de février, Pâques, été, Toussaint, Noël.
                  Vérifiez les 3 zones (A, B, C) pour votre région. Impact +10 % en zone touristique,
                  -10 à -20 % en zone urbaine business.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-2 h-2 rounded-full bg-teal-400 mt-2 flex-shrink-0" />
                <span>
                  <strong>Jours fériés et ponts</strong> : mai concentre jusqu'à 4 jours fériés. Bonus de
                  +5 à +12 % sur le CA mensuel selon la configuration.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-2 h-2 rounded-full bg-teal-400 mt-2 flex-shrink-0" />
                <span>
                  <strong>Météo</strong> : un restaurant avec terrasse peut voir +15 à +25 % de CA sur un
                  week-end ensoleillé d'avril-mai. À l'inverse, un mois pluvieux fait -8 à -15 %.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-2 h-2 rounded-full bg-teal-400 mt-2 flex-shrink-0" />
                <span>
                  <strong>Événements locaux</strong> : congrès, salons, festivals. Si votre ville accueille
                  un grand événement, le CA peut grimper de +30 à +60 % sur la période. Anticipez en stock,
                  équipe et planning.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-2 h-2 rounded-full bg-teal-400 mt-2 flex-shrink-0" />
                <span>
                  <strong>Période fiscale et 13e mois</strong> : décembre et juin (primes) sont des mois
                  de forte consommation, notamment sur le segment moyen-haut de gamme.
                </span>
              </li>
            </ul>

            <Callout type="info">
              <strong>Stratégie anti-saisonnalité :</strong> compensez les creux de janvier/février et
              juillet/août avec des opérations spéciales (mois de la Galette, semaine truffe, brunch d'été,
              menu touristes en zone urbaine). Objectif : ne jamais descendre sous 70 % du CA moyen.
            </Callout>
          </section>

          {/* ═══════ SECTION 9 : KPIs quotidiens ═══════ */}
          <section id="kpis" className="mb-16">
            <SectionHeading icon={<LineChart className="w-6 h-6" />} number="9">
              KPIs quotidiens à tracker pour piloter le CA
            </SectionHeading>

            <p className="text-[#374151] leading-relaxed mb-6">
              Un suivi quotidien rigoureux du CA et de ses composantes permet d'identifier rapidement les
              dérives et d'agir avant qu'il ne soit trop tard. Voici les 8 indicateurs à intégrer dans votre
              tableau de bord quotidien.
            </p>

            <div className="grid gap-4 sm:grid-cols-2 mb-6">
              <KpiCard
                title="CA jour HT"
                desc="Total des ventes du jour hors taxes. À comparer au même jour de la semaine précédente et au CA jour moyen budgété."
                target="Variation ±10 % vs J-7"
              />
              <KpiCard
                title="Nombre de couverts"
                desc="Total des couverts servis sur le jour (additionne salle + livraison + événements)."
                target="60-65 % de la capacité maxi"
              />
              <KpiCard
                title="Ticket moyen HT"
                desc="CA HT divisé par le nombre de couverts. Indicateur clé du mix-vente et de l'upselling."
                target="Stable ou en hausse vs N-1"
              />
              <KpiCard
                title="CA / heure de personnel"
                desc="CA HT divisé par les heures travaillées. Mesure la productivité de la brigade."
                target="120-180 € HT / heure"
              />
              <KpiCard
                title="Taux d'occupation"
                desc="Couverts servis / capacité théorique. Permet de repérer les services creux."
                target="50-70 % en moyenne"
              />
              <KpiCard
                title="Mix canaux"
                desc="Répartition CA salle / livraison / événementiel. Surveillez la dépendance plateformes."
                target="Salle > 65 %"
              />
              <KpiCard
                title="Taux de no-show réservations"
                desc="Réservations non honorées / total réservations. Manque à gagner direct sur le CA."
                target="< 8 %"
              />
              <KpiCard
                title="Panier moyen livraison"
                desc="CA livraison brut / nombre de commandes. Indicateur de la rentabilité du canal."
                target="> 22 € pour rentabiliser la commission"
              />
            </div>
          </section>

          {/* ═══════ SECTION 10 : Analyse fine ═══════ */}
          <section id="analyse" className="mb-16">
            <SectionHeading icon={<BarChart3 className="w-6 h-6" />} number="10">
              Analyse fine : par service, jour, canal
            </SectionHeading>

            <p className="text-[#374151] leading-relaxed mb-6">
              Le CA mensuel global cache de fortes disparités. L'analyse fine permet d'identifier les
              services rentables, les jours creux à activer et les heures à fermer pour optimiser la marge.
            </p>

            <h3 className="text-xl font-bold text-mono-100 mb-3">Analyse horaire (cas réel bistrot 50 cv)</h3>
            <div className="bg-mono-975 rounded-xl p-5 mb-6 font-mono text-xs sm:text-sm text-mono-100 space-y-1">
              <div>12h-13h : 28 cv, 728 € HT → service saturé, possibilité d'allonger horaires</div>
              <div>13h-14h : 18 cv, 468 € HT → bon</div>
              <div>14h-15h : 4 cv, 92 € HT → fermer ou transformer en service afterwork ?</div>
              <div>19h-20h : 22 cv, 748 € HT → service en montée</div>
              <div>20h-21h : 32 cv, 1 088 € HT → service saturé, ticket élevé</div>
              <div>21h-22h : 24 cv, 792 € HT → bon</div>
              <div>22h-23h : 4 cv, 132 € HT → faible (last call possible ?)</div>
            </div>

            <h3 className="text-xl font-bold text-mono-100 mb-3 mt-8">Analyse par jour de la semaine</h3>
            <div className="overflow-x-auto mb-6">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="bg-mono-975 text-mono-350">
                    <th className="text-left py-3 px-4 font-semibold rounded-tl-xl">Jour</th>
                    <th className="text-right py-3 px-4 font-semibold">CA jour HT</th>
                    <th className="text-right py-3 px-4 font-semibold">Couverts</th>
                    <th className="text-right py-3 px-4 font-semibold">Ticket moyen</th>
                    <th className="text-right py-3 px-4 font-semibold rounded-tr-xl">Verdict</th>
                  </tr>
                </thead>
                <tbody className="text-mono-350 text-xs sm:text-sm">
                  <tr className="bg-white"><td className="py-2 px-4 font-medium text-mono-100">Mardi</td><td className="py-2 px-4 text-right">1 380 €</td><td className="py-2 px-4 text-right">52</td><td className="py-2 px-4 text-right">26,50 €</td><td className="py-2 px-4 text-right text-amber-600">À activer</td></tr>
                  <tr className="bg-mono-1000"><td className="py-2 px-4 font-medium text-mono-100">Mercredi</td><td className="py-2 px-4 text-right">1 620 €</td><td className="py-2 px-4 text-right">62</td><td className="py-2 px-4 text-right">26,10 €</td><td className="py-2 px-4 text-right text-amber-600">À activer</td></tr>
                  <tr className="bg-white"><td className="py-2 px-4 font-medium text-mono-100">Jeudi</td><td className="py-2 px-4 text-right">2 240 €</td><td className="py-2 px-4 text-right">78</td><td className="py-2 px-4 text-right">28,70 €</td><td className="py-2 px-4 text-right text-emerald-600">Bon</td></tr>
                  <tr className="bg-mono-1000"><td className="py-2 px-4 font-medium text-mono-100">Vendredi</td><td className="py-2 px-4 text-right">3 120 €</td><td className="py-2 px-4 text-right">98</td><td className="py-2 px-4 text-right">31,80 €</td><td className="py-2 px-4 text-right text-emerald-600">Excellent</td></tr>
                  <tr className="bg-white"><td className="py-2 px-4 font-medium text-mono-100">Samedi</td><td className="py-2 px-4 text-right">3 580 €</td><td className="py-2 px-4 text-right">108</td><td className="py-2 px-4 text-right">33,10 €</td><td className="py-2 px-4 text-right text-emerald-600">Pic</td></tr>
                  <tr className="bg-mono-1000"><td className="py-2 px-4 font-medium text-mono-100">Dimanche (midi seul)</td><td className="py-2 px-4 text-right">1 540 €</td><td className="py-2 px-4 text-right">48</td><td className="py-2 px-4 text-right">32,10 €</td><td className="py-2 px-4 text-right text-amber-600">Potentiel brunch</td></tr>
                </tbody>
              </table>
            </div>

            <h3 className="text-xl font-bold text-mono-100 mb-3 mt-8">Mix-vente Boston Matrix appliqué à la carte</h3>
            <ul className="space-y-2 text-[#374151] mb-6">
              <li className="flex items-start gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500 mt-2 flex-shrink-0" />
                <span>
                  <strong>30 % stars</strong> (forte marge + forte rotation) : à mettre en avant sur la carte,
                  à recommander par le service
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-2 h-2 rounded-full bg-blue-500 mt-2 flex-shrink-0" />
                <span>
                  <strong>30 % vaches à lait</strong> (forte rotation, marge moyenne) : à optimiser en coût
                  matières, garder la stabilité
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-2 h-2 rounded-full bg-amber-500 mt-2 flex-shrink-0" />
                <span>
                  <strong>20 % dilemmes</strong> (faible rotation, forte marge) : à pousser via formation
                  équipe, repositionnement, photo plat
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-2 h-2 rounded-full bg-red-500 mt-2 flex-shrink-0" />
                <span>
                  <strong>20 % poids morts</strong> (faible rotation, faible marge) : à supprimer sans
                  hésitation au prochain changement de carte
                </span>
              </li>
            </ul>
          </section>

          {/* ═══════ SECTION 11 : Pourquoi gros CA peut perdre ═══════ */}
          <section id="rentabilite" className="mb-16">
            <SectionHeading icon={<AlertTriangle className="w-6 h-6" />} number="11">
              Pourquoi un gros CA peut être déficitaire
            </SectionHeading>

            <p className="text-[#374151] leading-relaxed mb-6">
              Le CA n'est qu'une moitié de l'équation. Voici un cas réel comparant deux restaurants :
              le restaurant A fait 2,5× plus de CA que le restaurant B, mais B dégage 114 K€ de plus
              en marge nette.
            </p>

            <div className="overflow-x-auto mb-6">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="bg-mono-975 text-mono-350">
                    <th className="text-left py-3 px-4 font-semibold rounded-tl-xl">Indicateur</th>
                    <th className="text-right py-3 px-4 font-semibold">Restaurant A (gros CA)</th>
                    <th className="text-right py-3 px-4 font-semibold rounded-tr-xl">Restaurant B (petit CA)</th>
                  </tr>
                </thead>
                <tbody className="text-mono-350">
                  <tr className="bg-white"><td className="py-3 px-4 font-medium text-mono-100">CA HT annuel</td><td className="py-3 px-4 text-right font-bold">950 000 €</td><td className="py-3 px-4 text-right font-bold">380 000 €</td></tr>
                  <tr className="bg-mono-1000"><td className="py-3 px-4 text-red-700">Food cost</td><td className="py-3 px-4 text-right text-red-700">40 %</td><td className="py-3 px-4 text-right text-emerald-700">30 %</td></tr>
                  <tr className="bg-white"><td className="py-3 px-4 text-emerald-700">Marge brute</td><td className="py-3 px-4 text-right">60 %</td><td className="py-3 px-4 text-right">70 %</td></tr>
                  <tr className="bg-mono-1000"><td className="py-3 px-4 text-red-700">Ratio personnel</td><td className="py-3 px-4 text-right text-red-700">38 %</td><td className="py-3 px-4 text-right text-emerald-700">32 %</td></tr>
                  <tr className="bg-white"><td className="py-3 px-4 text-red-700">Loyer + charges</td><td className="py-3 px-4 text-right text-red-700">26 %</td><td className="py-3 px-4 text-right text-emerald-700">18 %</td></tr>
                  <tr className="bg-mono-1000"><td className="py-3 px-4 font-bold text-mono-100">EBE annuel</td><td className="py-3 px-4 text-right font-bold text-red-700">-38 000 €</td><td className="py-3 px-4 text-right font-bold text-emerald-700">+76 000 €</td></tr>
                </tbody>
              </table>
            </div>

            <Callout type="warning">
              <strong>Lecture :</strong> B avec 2,5× moins de CA dégage 114 K€ de plus en marge nette.
              <strong> Le CA n'est pas synonyme de rentabilité.</strong> Un food cost maîtrisé, un ratio
              personnel ajusté et un loyer raisonnable comptent infiniment plus qu'un CA brut élevé.
            </Callout>
          </section>

          {/* ═══════ SECTION 12 : Leviers ═══════ */}
          <section id="leviers" className="mb-16">
            <SectionHeading icon={<Sparkles className="w-6 h-6" />} number="12">
              Les 5 leviers concrets pour augmenter le CA
            </SectionHeading>

            <p className="text-[#374151] leading-relaxed mb-6">
              Augmenter le CA passe rarement par une seule action. Les restaurants les plus performants
              combinent plusieurs leviers pour atteindre +25 à +30 % en 12 mois sans investissement lourd.
            </p>

            <div className="space-y-5">
              <LevierCard
                number={1}
                title="Ouvrir un nouveau créneau (brunch dominical)"
                desc="Un brunch dominical bien marketé attire 30 à 50 couverts à 26-32 €. Sur un an, +12 à +18 % de CA."
                impact="Ex : 35 cv × 28 € × 50 dimanches = +49 K€/an"
              />
              <LevierCard
                number={2}
                title="Augmenter le ticket moyen (upselling structuré)"
                desc="Formation équipe à l'apéritif suggéré, plat du jour mis en valeur, café gourmand systématique, vin au verre premium. +3 à +5 € par couvert."
                impact="Ex : +3,50 € × 18 000 cv = +63 K€/an"
              />
              <LevierCard
                number={3}
                title="Activer les créneaux faibles"
                desc="Tapas Tuesday, dîner à thème mercredi, formule afterwork 17h-19h. Cible : ramener 8-12 couverts supplémentaires sur des services creux."
                impact="Ex : 50 mardis × 10 cv × 25 € = +12,5 K€/an"
              />
              <LevierCard
                number={4}
                title="Développer une carte livraison rentable"
                desc="Carte adaptée (plats qui tiennent le transport), packaging marque, photo soignée. Visez 12-25 commandes/jour."
                impact="Ex : 12 cmd × 22 € × 365 = 96 K€ brut → 69 K€ net après commission"
              />
              <LevierCard
                number={5}
                title="Commercialiser la privatisation"
                desc="1 privatisation par mois (anniversaire, séminaire) à 2 000-3 500 €. Marge quasi pure (peu de gâchis, planning maîtrisé)."
                impact="Ex : 12 × 2 500 € = +30 K€/an quasi-pure marge"
              />
            </div>

            <div className="mt-8 bg-gradient-to-br from-emerald-50 to-teal-50 border border-emerald-200 rounded-2xl p-6">
              <h3 className="text-xl font-bold text-emerald-900 mb-2">
                Combo 3 leviers (brunch + upselling + privatisation)
              </h3>
              <p className="text-emerald-800 leading-relaxed">
                <strong>+142 K€ de CA additionnel</strong> avec un investissement marketing limité (3-8 K€).
                Sur la marge brute de 70 % et après surcoût opérationnel, cela représente environ
                <strong> +72 K€ d'EBE supplémentaire</strong>, soit un ROI marketing de l'ordre de 9×.
              </p>
            </div>
          </section>

          {/* ═══════ SECTION 13 : Erreurs ═══════ */}
          <section id="erreurs" className="mb-16">
            <SectionHeading icon={<AlertTriangle className="w-6 h-6" />} number="13">
              5 erreurs courantes dans le suivi du CA
            </SectionHeading>

            <p className="text-[#374151] leading-relaxed mb-6">
              Même les restaurateurs expérimentés tombent dans ces pièges. Les éviter peut transformer un
              EBE négatif en EBE positif sans changer un seul euro de CA.
            </p>

            <div className="space-y-4">
              <ErrorCard
                number={1}
                title="Raisonner en TTC au lieu de HT"
                desc="C'est l'erreur la plus fréquente. Un food cost calculé sur le TTC paraît 9-10 points plus bas qu'en réalité. Vous croyez avoir 28 % alors que vous êtes à 38 %. Conséquence : décisions de prix faussées, marge plombée."
              />
              <ErrorCard
                number={2}
                title="Confondre CA brut livraison et CA net"
                desc="Une commande de 30 € sur Uber Eats vous rapporte 21,60 € après commission de 28 %. Si vous comptabilisez le brut, vous surestimez votre CA de 28 % sur ce canal et votre rentabilité réelle est masquée."
              />
              <ErrorCard
                number={3}
                title="Ne suivre que le CA mensuel global"
                desc="Le CA mensuel cache les dérives quotidiennes. Une baisse progressive sur 3 semaines passe inaperçue jusqu'à ce qu'il soit trop tard. Le suivi doit être quotidien, hebdomadaire et mensuel."
              />
              <ErrorCard
                number={4}
                title="Ignorer la saisonnalité dans le prévisionnel"
                desc="Diviser un CA annuel par 12 donne un budget mensuel irréaliste. Janvier sera systématiquement décevant et décembre euphorique, sans que cela soit une bonne ou mauvaise nouvelle. La pondération mensuelle est obligatoire."
              />
              <ErrorCard
                number={5}
                title="Ne pas distinguer ticket moyen midi vs soir"
                desc="Un ticket moyen global de 26 € masque souvent un midi à 19 € et un soir à 34 €. La stratégie d'upselling et la carte doivent être pensées différemment pour chaque service. C'est l'analyse la plus rentable à mener."
              />
            </div>
          </section>

          {/* ═══════ FAQ ═══════ */}
          <section id="faq" className="mb-16">
            <SectionHeading icon={<BookOpen className="w-6 h-6" />} number="14">
              Questions fréquentes
            </SectionHeading>

            <div className="space-y-3 mt-8">
              {faqItems.map(({ question, answer }) => (
                <FAQItem key={question} q={question} a={answer} />
              ))}
            </div>
          </section>

          {/* CTA principale */}
          <div className="bg-gradient-to-br from-teal-600 to-teal-700 rounded-2xl p-8 text-center text-white mb-12">
            <h2 className="text-2xl font-bold mb-3">Du CA à la marge nette</h2>
            <p className="text-teal-100 mb-6 text-sm leading-relaxed max-w-[480px] mx-auto">
              Augmenter son CA est essentiel, protéger sa marge l'est encore plus. RestauMargin pilote vos
              food cost, marges et ratios en temps réel pour transformer chaque euro de CA en bénéfice.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link
                to="/login?mode=register"
                className="inline-flex items-center justify-center gap-2 bg-white text-teal-700 font-semibold px-6 py-3 rounded-xl hover:bg-teal-50 transition-colors text-sm"
              >
                Essayer gratuitement <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                to="/outils/calculateur-food-cost"
                className="inline-flex items-center justify-center gap-2 bg-teal-800 text-white font-semibold px-6 py-3 rounded-xl hover:bg-teal-900 transition-colors text-sm border border-teal-500"
              >
                <Calculator className="w-4 h-4" /> Calculateur food cost gratuit
              </Link>
            </div>
          </div>

          {/* Articles liés (internal links) */}
          <section className="mb-12">
            <h2 className="text-xl font-bold text-mono-100 mb-5">Pour aller plus loin</h2>
            <div className="grid sm:grid-cols-2 gap-4">
              <Link
                to="/blog/augmenter-ticket-moyen-restaurant"
                className="bg-mono-1000 border border-mono-900 rounded-xl p-5 hover:border-teal-300 hover:shadow-sm transition-all group"
              >
                <div className="flex items-center gap-2 mb-2">
                  <DollarSign className="w-4 h-4 text-teal-600" />
                  <h3 className="font-semibold text-mono-100 group-hover:text-teal-700 transition-colors">
                    Augmenter le ticket moyen
                  </h3>
                </div>
                <p className="text-xs text-mono-500">
                  10 techniques d'upselling pour gagner +3 à +5 € par couvert.
                </p>
              </Link>
              <Link
                to="/blog/taux-occupation-restaurant"
                className="bg-mono-1000 border border-mono-900 rounded-xl p-5 hover:border-teal-300 hover:shadow-sm transition-all group"
              >
                <div className="flex items-center gap-2 mb-2">
                  <Users className="w-4 h-4 text-teal-600" />
                  <h3 className="font-semibold text-mono-100 group-hover:text-teal-700 transition-colors">
                    Taux d'occupation restaurant
                  </h3>
                </div>
                <p className="text-xs text-mono-500">
                  Calcul, benchmarks et stratégies pour passer de 45 % à 65 %.
                </p>
              </Link>
              <Link
                to="/blog/prevision-ventes-restaurant"
                className="bg-mono-1000 border border-mono-900 rounded-xl p-5 hover:border-teal-300 hover:shadow-sm transition-all group"
              >
                <div className="flex items-center gap-2 mb-2">
                  <TrendingUp className="w-4 h-4 text-teal-600" />
                  <h3 className="font-semibold text-mono-100 group-hover:text-teal-700 transition-colors">
                    Prévision des ventes
                  </h3>
                </div>
                <p className="text-xs text-mono-500">
                  Modélisation jour/semaine/mois pour anticiper le CA et les approvisionnements.
                </p>
              </Link>
              <Link
                to="/blog/kpi-restaurateur"
                className="bg-mono-1000 border border-mono-900 rounded-xl p-5 hover:border-teal-300 hover:shadow-sm transition-all group"
              >
                <div className="flex items-center gap-2 mb-2">
                  <LineChart className="w-4 h-4 text-teal-600" />
                  <h3 className="font-semibold text-mono-100 group-hover:text-teal-700 transition-colors">
                    Guide des KPIs restaurateur
                  </h3>
                </div>
                <p className="text-xs text-mono-500">
                  20 KPIs essentiels à tracker pour piloter la rentabilité au quotidien.
                </p>
              </Link>
              <Link
                to="/blog/calcul-marge-restaurant"
                className="bg-mono-1000 border border-mono-900 rounded-xl p-5 hover:border-teal-300 hover:shadow-sm transition-all group"
              >
                <div className="flex items-center gap-2 mb-2">
                  <Target className="w-4 h-4 text-teal-600" />
                  <h3 className="font-semibold text-mono-100 group-hover:text-teal-700 transition-colors">
                    Calculer la marge restaurant
                  </h3>
                </div>
                <p className="text-xs text-mono-500">
                  Guide complet : food cost, coefficient, marge brute et nette.
                </p>
              </Link>
              <Link
                to="/blog/budget-previsionnel-restaurant"
                className="bg-mono-1000 border border-mono-900 rounded-xl p-5 hover:border-teal-300 hover:shadow-sm transition-all group"
              >
                <div className="flex items-center gap-2 mb-2">
                  <BarChart3 className="w-4 h-4 text-teal-600" />
                  <h3 className="font-semibold text-mono-100 group-hover:text-teal-700 transition-colors">
                    Budget prévisionnel restaurant
                  </h3>
                </div>
                <p className="text-xs text-mono-500">
                  Construire un budget mensuel et annuel solide à partir du CA prévisionnel.
                </p>
              </Link>
            </div>
          </section>

          {/* Nav bas de page */}
          <div className="mt-12 pt-8 border-t border-mono-900 flex justify-between items-center">
            <Link to="/blog" className="text-sm text-teal-600 hover:underline">
              ← Tous les articles
            </Link>
            <Link to="/blog/budget-previsionnel-restaurant" className="text-sm text-teal-600 hover:underline">
              Budget prévisionnel →
            </Link>
          </div>
        </article>

        <BlogAuthor publishedDate="2026-04-27" updatedDate="2026-05-26" readTime="16 min" variant="footer" />
      </main>

      {/* Footer */}
      <footer className="bg-mono-1000 border-t border-mono-900 py-12 px-4">
        <div className="max-w-4xl mx-auto text-center text-sm text-mono-500">
          <Link to="/landing" className="flex items-center justify-center gap-2 text-mono-100 font-bold text-lg mb-4">
            <ChefHat className="w-6 h-6 text-teal-600" />
            RestauMargin
          </Link>
          <p className="mb-4">La plateforme de gestion de marge pour les restaurateurs.</p>
          <div className="flex flex-wrap items-center justify-center gap-4 text-xs text-mono-700">
            <Link to="/mentions-legales" className="hover:text-teal-600 transition-colors">
              Mentions légales
            </Link>
            <Link to="/cgv" className="hover:text-teal-600 transition-colors">
              CGV
            </Link>
            <Link to="/cgu" className="hover:text-teal-600 transition-colors">
              CGU
            </Link>
            <Link to="/politique-confidentialite" className="hover:text-teal-600 transition-colors">
              Confidentialité
            </Link>
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

function SectionHeading({
  icon,
  number,
  children,
}: {
  icon: React.ReactNode;
  number: string;
  children: React.ReactNode;
}) {
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

function DefinitionCard({
  title,
  color,
  desc,
  formula,
}: {
  title: string;
  color: string;
  desc: string;
  formula: string;
}) {
  const colors: Record<string, { bg: string; text: string; badge: string }> = {
    emerald: { bg: 'bg-emerald-50', text: 'text-emerald-700', badge: 'bg-emerald-100 text-emerald-700' },
    amber: { bg: 'bg-amber-50', text: 'text-amber-700', badge: 'bg-amber-100 text-amber-700' },
    blue: { bg: 'bg-blue-50', text: 'text-blue-700', badge: 'bg-blue-100 text-blue-700' },
    teal: { bg: 'bg-teal-50', text: 'text-teal-700', badge: 'bg-teal-100 text-teal-700' },
  };
  const c = colors[color] || colors.emerald;
  return (
    <div className={`${c.bg} rounded-2xl p-5 border border-mono-975`}>
      <h3 className={`font-bold ${c.text} mb-2`}>{title}</h3>
      <p className="text-sm text-mono-400 leading-relaxed mb-3">{desc}</p>
      <div className="text-xs">
        <span className="text-mono-500 font-medium">Formule : </span>
        <code className={`${c.badge} px-2 py-0.5 rounded`}>{formula}</code>
      </div>
    </div>
  );
}

function FormulaCard({
  title,
  formula,
  example,
}: {
  title: string;
  formula: string;
  example: string;
}) {
  return (
    <div className="bg-white border border-mono-900 rounded-xl p-5">
      <h3 className="font-bold text-mono-100 mb-2">{title}</h3>
      <div className="bg-mono-975 rounded-lg p-3 font-mono text-sm text-mono-100 mb-2">{formula}</div>
      <p className="text-xs text-mono-500">
        <span className="font-medium">Exemple :</span> {example}
      </p>
    </div>
  );
}

function CanalCard({
  icon,
  title,
  color,
  weight,
  desc,
  margin,
}: {
  icon: React.ReactNode;
  title: string;
  color: string;
  weight: string;
  desc: string;
  margin: string;
}) {
  const colors: Record<string, { bg: string; text: string; badge: string }> = {
    emerald: { bg: 'bg-emerald-50', text: 'text-emerald-700', badge: 'bg-emerald-100 text-emerald-700' },
    amber: { bg: 'bg-amber-50', text: 'text-amber-700', badge: 'bg-amber-100 text-amber-700' },
    blue: { bg: 'bg-blue-50', text: 'text-blue-700', badge: 'bg-blue-100 text-blue-700' },
  };
  const c = colors[color] || colors.emerald;
  return (
    <div className={`${c.bg} rounded-2xl p-5 border border-mono-975`}>
      <div className={`w-10 h-10 ${c.badge} rounded-lg flex items-center justify-center mb-3`}>
        {icon}
      </div>
      <h3 className="font-bold text-mono-100 mb-1">{title}</h3>
      <div className={`text-xs ${c.badge} px-2 py-0.5 rounded inline-block mb-2 font-semibold`}>
        {weight} du CA
      </div>
      <p className="text-sm text-mono-400 leading-relaxed mb-3">{desc}</p>
      <div className="text-xs text-mono-500">
        <span className="font-medium">{margin}</span>
      </div>
    </div>
  );
}

function KpiCard({ title, desc, target }: { title: string; desc: string; target: string }) {
  return (
    <div className="bg-white border border-mono-900 rounded-xl p-5">
      <h3 className="font-bold text-mono-100 mb-2">{title}</h3>
      <p className="text-sm text-mono-400 leading-relaxed mb-3">{desc}</p>
      <div className="text-xs bg-teal-50 text-teal-700 px-2 py-1 rounded inline-block font-semibold">
        Cible : {target}
      </div>
    </div>
  );
}

function LevierCard({
  number,
  title,
  desc,
  impact,
}: {
  number: number;
  title: string;
  desc: string;
  impact: string;
}) {
  return (
    <div className="bg-white border border-mono-900 rounded-xl p-5 sm:p-6 flex gap-4">
      <div className="w-10 h-10 bg-pink-50 text-pink-600 rounded-xl flex items-center justify-center shrink-0 font-bold text-lg">
        {number}
      </div>
      <div className="flex-1">
        <h3 className="font-semibold text-mono-100 mb-1.5">{title}</h3>
        <p className="text-sm text-mono-400 leading-relaxed mb-2">{desc}</p>
        <div className="text-xs bg-emerald-50 text-emerald-700 px-2 py-1 rounded inline-block font-semibold">
          {impact}
        </div>
      </div>
    </div>
  );
}

function ErrorCard({ number, title, desc }: { number: number; title: string; desc: string }) {
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
  const styles =
    type === 'info'
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
